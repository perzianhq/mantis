/**
 * Regrade saved answers without launching an agent or browser. Historical
 * fixtureCheck booleans are reported, never upgraded into state evidence.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS, gradeTaskAnswer, normalizeGradedAnswer, type AgentTask } from './tasks.js';
import { LOCAL_V2_TASKS, gradeLocalV2Case } from './local-v2.js';
import { fixtureVariant } from '../fixture-variants.js';
import type { FixtureVariant } from '../fixture-variants.js';
import { fullReplyInTrace, matchSavedTraces, savedResults, type SavedAttempt, type SavedResults, type SavedRun } from './offline-metrics.js';

type Json = Record<string, unknown>;
export type HardenedState = 'not_required' | 'pass' | 'fail' | 'unknown_rerun_needed';
export interface AnswerRegrade {
  task: string; approach: string; run: number; status: string; terminalAttempt: number;
  trace: string | null; rawReply: string | null; answer: { pass: boolean | null; failed: string[]; replayedLegacyRegexPass: boolean | null; change: 'same' | 'wrong_answer_to_success' | 'success_to_wrong_answer' | 'unknown' };
  legacy: { outcomeOk: boolean; fixtureCheck: boolean | null };
  hardenedState: HardenedState;
  finalOutcome: 'success' | 'failure' | 'unknown_rerun_needed';
  needs: string[];
}
export interface RegradeReport {
  schemaVersion: 1; kind: 'offline-regrade';
  provenance: { input: string; inputSha256: string; generatedAt: string; savedTaskHash: string | null; currentTaskHash: string; savedGradingHash: string | null; currentGradingHash: string; savedVariantHash: string | null; currentVariantHash: string | null; currentTaskIds: string[]; savedTaskIds: string[] };
  summary: { rows: number; answerPass: number; answerFail: number; answerUnknown: number; answerPromotions: number; answerDemotions: number; timeoutCannotPromote: number; noncompletedCannotPromote: number; legacyFixturePass: number; legacyFixtureFail: number; legacyFixtureUnknown: number; hardenedStateUnknownRerun: number; missingTrace: number; taskMissing: number; taskCatalogVersionMismatch: boolean };
  caveats: string[];
  runs: AnswerRegrade[];
}

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');
/** Returns the complete final provider reply, not the result JSON's 160-char display field. */
export const fullReplyFromTrace = fullReplyInTrace;

const terminal = (run: SavedRun): { attempt: SavedAttempt; index: number } => {
  const attempts = run.attempts?.length ? run.attempts : [{}];
  return { attempt: attempts[attempts.length - 1]!, index: attempts.length - 1 };
};
const evidenceOf = (attempt: SavedAttempt): { version?: unknown; taskId?: unknown; attemptId?: unknown; events?: unknown; observationCount?: unknown } | null => {
  const raw = attempt.fixtureEvidence;
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as { version?: unknown; taskId?: unknown; attemptId?: unknown; events?: unknown; observationCount?: unknown } : null;
};
const validObservation = (event: unknown): boolean => {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return false;
  const value = event as Json;
  return typeof value.arrival === 'number' && Number.isInteger(value.arrival) && value.arrival >= 0 &&
    typeof value.path === 'string' && typeof value.documentId === 'string' &&
    ['load', 'click', 'input', 'change', 'submit', 'scroll', 'settled'].includes(String(value.kind)) &&
    !!value.target && typeof value.target === 'object' && !!value.controls && typeof value.controls === 'object' && typeof value.text === 'string';
};
function hardenedState(task: AgentTask, attempt: SavedAttempt, variant: FixtureVariant | null): { state: HardenedState; needs: string[] } {
  if (!task.check) return { state: 'not_required', needs: [] };
  const evidence = evidenceOf(attempt);
  if (!evidence || evidence.version !== 1 || evidence.taskId !== task.id || typeof attempt.attemptId !== 'string' || evidence.attemptId !== attempt.attemptId || !Array.isArray(evidence.events) || evidence.observationCount !== evidence.events.length || !evidence.events.every(validObservation)) {
    return { state: 'unknown_rerun_needed', needs: ['authoritative fixture observation evidence is absent, malformed, or for another task'] };
  }
  try {
    // The task checker owns the event schema. This is only reachable for newly persisted authoritative evidence.
    const events = variant ? (evidence.events as never[]).map((event) => variant.canonicalObservation(event as never)) : evidence.events;
    const checked = task.check(events as never);
    const passed = typeof checked === 'boolean' ? checked : !!checked && typeof checked === 'object' && (checked as { ok?: unknown }).ok === true;
    return { state: passed ? 'pass' : 'fail', needs: [] };
  } catch { return { state: 'unknown_rerun_needed', needs: ['authoritative fixture observation evidence could not be checked'] }; }
}

export function buildRegrade(input: SavedResults, options: { inputName: string; inputText: string; traceDirectory: string; taskFileText: string; gradingFileText?: string; variantFileText?: string }): RegradeReport {
  const savedSettings = input.metadata?.settings as Json | undefined;
  const seed = savedSettings?.fixtureSeed;
  let variant: FixtureVariant | null = null;
  const variantError = typeof seed === 'number' ? (() => { try { variant = fixtureVariant(seed); return null; } catch (error) { return error instanceof Error ? error.message : String(error); } })() : seed == null ? null : 'saved fixtureSeed is not a number';
  const localV2 = input.results.length > 0 && input.results.every((run) => LOCAL_V2_TASKS.some((task) => task.id === run.task));
  const catalog = localV2 ? LOCAL_V2_TASKS : TASKS;
  const tasks = new Map(catalog.map((task) => [task.id, variant ? variant.task(task) : task])); const traces = matchSavedTraces(input.results, options.traceDirectory);
  const savedTaskIds = (input.metadata?.settings as Json | undefined)?.tasks;
  const expectedIds = Array.isArray(savedTaskIds) ? savedTaskIds.filter((value): value is string => typeof value === 'string') : [...new Set(input.results.map((run) => run.task))];
  const sourceHashes = (input.metadata?.sourceHashes ?? input.metadata?.sources ?? input.metadata?.source) as Json | undefined; const savedTaskHash = typeof sourceHashes?.['bench/agent/tasks.ts'] === 'string' ? sourceHashes['bench/agent/tasks.ts'] : null;
  const savedGradingHash = typeof sourceHashes?.['bench/agent/grading.ts'] === 'string' ? sourceHashes['bench/agent/grading.ts'] : null;
  const savedVariantHash = typeof sourceHashes?.['bench/fixture-variants.ts'] === 'string' ? sourceHashes['bench/fixture-variants.ts'] : null;
  const currentTaskHash = sha256(options.taskFileText); const currentGradingHash = sha256(options.gradingFileText ?? ''); const currentVariantHash = options.variantFileText === undefined ? null : sha256(options.variantFileText);
  const versionMismatch = (savedTaskHash !== null && savedTaskHash !== currentTaskHash) || (savedGradingHash !== null && savedGradingHash !== currentGradingHash) || (typeof seed === 'number' && (savedVariantHash === null || savedVariantHash !== currentVariantHash));
  const runs: AnswerRegrade[] = input.results.map((run) => {
    const task = tasks.get(run.task); const { attempt, index } = terminal(run); const identity = `${run.task}--${run.approach}--${run.run}--attempt-${attempt.attempt ?? index + 1}-`;
    const tracePath = traces.get(identity) ?? null; const rawReply = tracePath ? fullReplyFromTrace(readFileSync(tracePath, 'utf8')) : null;
    const needs: string[] = []; if (versionMismatch) needs.push('saved task source hash differs from the current task catalog; answer is graded under current named-task semantics');
    if (variantError) needs.push(`seeded fixture replay unavailable: ${variantError}`);
    if (typeof seed === 'number' && (savedVariantHash === null || savedVariantHash !== currentVariantHash)) needs.push('saved seeded-fixture source differs from the current frozen variant mapping');
    if (!task) needs.push('task ID is not in the current task catalog'); if (!tracePath) needs.push('saved provider trace is missing or ambiguous');
    const evidence = evidenceOf(attempt);
    // Local-v2 stored its already-normalized final answer separately; use that
    // contract value rather than the conversational trace narration.
    const gradingAnswer = localV2 ? (run.answer ?? null) : rawReply;
    const grade = task && gradingAnswer !== null
      ? localV2
        ? Array.isArray(evidence?.events) ? gradeLocalV2Case(task.id, gradingAnswer, evidence.events as never[]) : null
        : gradeTaskAnswer(task, gradingAnswer)
      : null;
    const replayedLegacyRegexPass = task && gradingAnswer !== null ? task.expect.test(normalizeGradedAnswer(gradingAnswer)) : null;
    const legacyFixture = attempt.fixtureCheck?.ok ?? null;
    const state = task && !variantError ? hardenedState(task, attempt, variant) : { state: 'unknown_rerun_needed' as const, needs: ['task ID is unavailable for state validation'] };
    needs.push(...state.needs);
    const answerPass = grade?.pass ?? null;
    const change: AnswerRegrade['answer']['change'] = answerPass === null || replayedLegacyRegexPass === null ? 'unknown' : !replayedLegacyRegexPass && answerPass ? 'wrong_answer_to_success' : replayedLegacyRegexPass && !answerPass ? 'success_to_wrong_answer' : 'same';
    const completed = run.valid === true && (run.status === 'success' || run.status === 'wrong_answer');
    if (!completed && answerPass) needs.push(`non-completed ${run.status || 'unknown'} attempt cannot be promoted by a post-hoc answer match`);
    const finalOutcome: AnswerRegrade['finalOutcome'] = !completed ? (run.valid ? 'failure' : 'unknown_rerun_needed') : answerPass === null ? 'unknown_rerun_needed' : !answerPass ? 'failure' : state.state === 'fail' ? 'failure' : state.state === 'unknown_rerun_needed' ? 'unknown_rerun_needed' : 'success';
    return { task: run.task, approach: run.approach, run: run.run, status: run.status, terminalAttempt: attempt.attempt ?? index + 1, trace: tracePath, rawReply,
      answer: { pass: answerPass, failed: grade?.failed ?? (rawReply === null ? ['full provider reply unavailable'] : ['task unavailable']), replayedLegacyRegexPass, change }, legacy: { outcomeOk: run.ok, fixtureCheck: legacyFixture }, hardenedState: state.state, finalOutcome, needs };
  });
  const answerPass = runs.filter((run) => run.answer.pass === true).length; const answerFail = runs.filter((run) => run.answer.pass === false).length;
  return { schemaVersion: 1, kind: 'offline-regrade', provenance: { input: options.inputName, inputSha256: sha256(options.inputText), generatedAt: new Date().toISOString(), savedTaskHash, currentTaskHash, savedGradingHash, currentGradingHash, savedVariantHash, currentVariantHash, currentTaskIds: [...tasks.keys()].sort(), savedTaskIds: expectedIds.sort() },
    summary: { rows: runs.length, answerPass, answerFail, answerUnknown: runs.length - answerPass - answerFail, answerPromotions: runs.filter((run) => run.answer.change === 'wrong_answer_to_success').length, answerDemotions: runs.filter((run) => run.answer.change === 'success_to_wrong_answer').length, timeoutCannotPromote: runs.filter((run) => (run.status === 'timeout') && run.needs.some((need) => need.startsWith('non-completed'))).length, noncompletedCannotPromote: runs.filter((run) => run.needs.some((need) => need.startsWith('non-completed'))).length, legacyFixturePass: runs.filter((run) => run.legacy.fixtureCheck === true).length, legacyFixtureFail: runs.filter((run) => run.legacy.fixtureCheck === false).length, legacyFixtureUnknown: runs.filter((run) => run.legacy.fixtureCheck === null).length, hardenedStateUnknownRerun: runs.filter((run) => run.hardenedState === 'unknown_rerun_needed').length, missingTrace: runs.filter((run) => !run.trace).length, taskMissing: runs.filter((run) => !tasks.has(run.task)).length, taskCatalogVersionMismatch: versionMismatch },
    caveats: ['Answers are regraded from the complete saved provider reply, not the truncated result.answer display field. Answer-change labels compare a replayed current legacy regex to strict current grading; they are not inferred from legacy outcome/state booleans.', 'Legacy fixtureCheck is only a historical boolean. It is reported separately and never treated as authoritative hardened state evidence.', 'A historical run with a task state check and no persisted authoritative observations matched to its task and attempt is unknown/rerun-needed even if its answer passes.', 'Timeouts, crashes, CLI errors, connection failures, and invalid/non-completed results are never promoted by an answer regrade.'], runs };
}

export function regradeMarkdown(report: RegradeReport): string {
  const s = report.summary; const lines = ['# Offline saved-run regrade', '', `Source: \`${report.provenance.input}\` (SHA-256 \`${report.provenance.inputSha256}\`).`, '', `Answer regrade: ${s.answerPass} pass, ${s.answerFail} fail, ${s.answerUnknown} unknown; changes: ${s.answerPromotions} wrong-answer → success and ${s.answerDemotions} success → wrong-answer.`, `Legacy fixture checks: ${s.legacyFixturePass} pass, ${s.legacyFixtureFail} fail, ${s.legacyFixtureUnknown} unknown. Hardened state: ${s.hardenedStateUnknownRerun} unknown/rerun-needed.`, '', '## Runs needing evidence, task review, or a rerun', '', '| Task | Approach | Run | Answer | Legacy fixture | Hardened state | Why |', '| --- | --- | ---: | --- | --- | --- | --- |'];
  for (const run of report.runs.filter((run) => run.needs.length || run.hardenedState === 'unknown_rerun_needed')) lines.push(`| ${run.task} | ${run.approach} | ${run.run} | ${run.answer.pass === null ? 'unknown' : run.answer.pass ? 'pass' : 'fail'} | ${run.legacy.fixtureCheck === null ? 'unknown' : run.legacy.fixtureCheck ? 'pass' : 'fail'} | ${run.hardenedState} | ${run.needs.join('; ').replaceAll('|', '\\|')} |`);
  lines.push('', '## Limits', ''); for (const caveat of report.caveats) lines.push(`- ${caveat}`);
  return `${lines.join('\n')}\n`;
}

function main(): void {
  const name = process.argv[2] ?? process.env.REGRADE_IN; if (!name) throw new Error('Pass a result name/path or set REGRADE_IN.');
  const resultsRoot = path.resolve(import.meta.dirname, '..', 'results'); const inputPath = existsSync(name) ? path.resolve(name) : path.join(resultsRoot, `${name.replace(/\.json$/i, '')}.json`); const inputText = readFileSync(inputPath, 'utf8'); const resultName = path.basename(inputPath, '.json');
  const report = buildRegrade(savedResults(inputText), { inputName: path.relative(path.resolve(import.meta.dirname, '..', '..'), inputPath), inputText, traceDirectory: path.join(resultsRoot, 'agent-logs', resultName), taskFileText: readFileSync(path.resolve(import.meta.dirname, 'tasks.ts'), 'utf8'), gradingFileText: readFileSync(path.resolve(import.meta.dirname, 'grading.ts'), 'utf8'), variantFileText: readFileSync(path.resolve(import.meta.dirname, '..', 'fixture-variants.ts'), 'utf8') });
  const stem = process.env.REGRADE_OUT ?? `${resultName}-regraded`; const jsonOut = path.resolve(resultsRoot, `${stem}.json`); const markdownOut = path.resolve(resultsRoot, `${stem}.md`);
  const samePath = (left: string, right: string): boolean => process.platform === 'win32' ? left.toLowerCase() === right.toLowerCase() : left === right;
  if (samePath(jsonOut, inputPath) || samePath(markdownOut, inputPath)) throw new Error('Regrade output must not overwrite its source result JSON.');
  writeFileSync(jsonOut, JSON.stringify(report, null, 2) + '\n'); writeFileSync(markdownOut, regradeMarkdown(report));
  console.log(`[regrade] wrote bench/results/${stem}.{json,md} for ${report.summary.rows} result rows.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
