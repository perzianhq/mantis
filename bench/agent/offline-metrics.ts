/**
 * Deterministic, offline metrics for an already saved agent run.  This module
 * deliberately does not import run.ts: importing that file starts an eval.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { diagnoseTrace, parseTrace, type TraceDiagnostics } from './tool-diagnostics.js';
import { matchesAnswerRequirement, type AnswerRequirement } from './grading.js';
import { TASKS } from './tasks.js';

type Json = Record<string, unknown>;
type RequirementLike = AnswerRequirement;

export interface SavedAttempt {
  attempt?: number;
  attemptId?: string;
  status?: string;
  timedOut?: boolean;
  costUsd?: number | null;
  costInr?: number | null;
  totalInputTokens?: number | null;
  usage?: { inputTokens?: number | null; cacheWriteTokens?: number | null; cacheReadTokens?: number | null; outputTokens?: number | null; costUsd?: number | null };
  timings?: { cliWallMs?: number | null; cliExecutionMs?: number | null };
  fixtureCheck?: { ok: boolean | null; details?: string } | null;
  fixtureEvidence?: unknown;
}
export interface SavedRun {
  task: string;
  approach: string;
  run: number;
  status: string;
  ok: boolean;
  valid: boolean;
  answer?: string;
  attempts?: SavedAttempt[];
}
export interface SavedResults { metadata?: Json; results: SavedRun[] }
export interface MetricGroup {
  logicalRuns: number; validRuns: number; successes: number; status: Record<string, number>;
  attempts: number; timeoutAttempts: number; tracesMatched: number; tracesMissing: number; tracesAmbiguous: number;
  toolSteps: number; repeatedIdenticalActions: number; coveredOrBlockedClickLoops: number;
  toolErrors: Record<string, { events: number; recovered: number; unresolved: number }>;
  modalities: { textObservationActions: number; imageObservationActions: number; textCharacters: number; imageBlocks: number; screenshotOnlyActions: number };
  information: { textRequirementRuns: number; requiredFactPatternAvailable: number; unavailableVisualReview: number; answerUsedAvailablePattern: number; answerDidNotUseAvailablePattern: number; noRequirements: number; traceMissing: number };
  efficiency: { costUsd: Scalar; costInr: Scalar; totalInputTokens: Scalar; outputTokens: Scalar; cliWallMs: Scalar };
}
export interface Scalar { totalKnown: number; knownAttempts: number; allAttempts: number; unknownAttempts: number; observedPerSuccess: number | null; completePerSuccess: number | null }
export interface OfflineMetricsReport {
  schemaVersion: 1;
  kind: 'offline-metrics';
  provenance: { input: string; inputSha256: string; resultRows: number; sourceHashes: Json | null; currentSources: Record<string, string>; taskIdsInResult: string[]; categoryCatalog: string; generatedAt: string };
  caveats: string[];
  overall: MetricGroup;
  byApproach: Record<string, MetricGroup>;
  byCategory: Record<string, MetricGroup>;
  byTask: Record<string, MetricGroup>;
  byApproachCategory: Record<string, MetricGroup>;
  byApproachTask: Record<string, MetricGroup>;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const hash = (text: string): string => createHash('sha256').update(text).digest('hex');
const scalar = (): Scalar => ({ totalKnown: 0, knownAttempts: 0, allAttempts: 0, unknownAttempts: 0, observedPerSuccess: null, completePerSuccess: null });
const group = (): MetricGroup => ({
  logicalRuns: 0, validRuns: 0, successes: 0, status: {}, attempts: 0, timeoutAttempts: 0, tracesMatched: 0, tracesMissing: 0, tracesAmbiguous: 0,
  toolSteps: 0, repeatedIdenticalActions: 0, coveredOrBlockedClickLoops: 0, toolErrors: {},
  modalities: { textObservationActions: 0, imageObservationActions: 0, textCharacters: 0, imageBlocks: 0, screenshotOnlyActions: 0 },
  information: { textRequirementRuns: 0, requiredFactPatternAvailable: 0, unavailableVisualReview: 0, answerUsedAvailablePattern: 0, answerDidNotUseAvailablePattern: 0, noRequirements: 0, traceMissing: 0 },
  efficiency: { costUsd: scalar(), costInr: scalar(), totalInputTokens: scalar(), outputTokens: scalar(), cliWallMs: scalar() },
});
const addError = (to: MetricGroup['toolErrors'], from: TraceDiagnostics['toolErrors']): void => {
  for (const [name, count] of Object.entries(from)) {
    const target = to[name] ??= { events: 0, recovered: 0, unresolved: 0 };
    target.events += count.events; target.recovered += count.recovered; target.unresolved += count.unresolved;
  }
};
const addScalar = (target: Scalar, value: number | null | undefined): void => {
  target.allAttempts++;
  if (typeof value === 'number' && Number.isFinite(value)) { target.totalKnown += value; target.knownAttempts++; } else target.unknownAttempts++;
};
const finish = (value: MetricGroup): MetricGroup => {
  for (const entry of Object.values(value.efficiency)) {
    entry.observedPerSuccess = value.successes && entry.knownAttempts ? entry.totalKnown / value.successes : null;
    entry.completePerSuccess = value.successes && entry.unknownAttempts === 0 ? entry.totalKnown / value.successes : null;
  }
  return value;
};
const key = (run: SavedRun, attempt: SavedAttempt, index: number): string => `${run.task}--${run.approach}--${run.run}--attempt-${attempt.attempt ?? index + 1}-`;
const keyCounts = (runs: readonly SavedRun[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const run of runs) for (const [index, attempt] of (run.attempts?.length ? run.attempts : [{}]).entries()) {
    const identity = key(run, attempt, index);
    counts.set(identity, (counts.get(identity) ?? 0) + 1);
  }
  return counts;
};
const isVisual = (_requirements: readonly RequirementLike[], category: string): boolean => category === 'visual';
const matchesRequirement = (requirements: readonly RequirementLike[], text: string): boolean => requirements.length > 0 && requirements.every((r) => matchesAnswerRequirement(text, r));
const textContent = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textContent).join('\n');
  if (!value || typeof value !== 'object') return '';
  const item = value as Json;
  if (item.type === 'text' && typeof item.text === 'string') return item.text;
  if (typeof item.text === 'string') return item.text;
  return textContent(item.content);
};
/** Only browser-tool result payloads, never model completions or prompts. */
const observationText = (trace: string): string => trace.split(/\r?\n/).flatMap((line) => {
  try {
    const event = JSON.parse(line) as Json;
    if (event.type === 'sarvam.tool_result' && event.error !== true) return typeof event.resultText === 'string' ? [event.resultText] : [];
    if (event.type !== 'item.completed') return [];
    const item = event.item as Json | undefined;
    if (item?.type !== 'mcp_tool_call' || item.status === 'failed' || item.status === 'error' || item.error) return [];
    const result = item.result as Json | undefined;
    if (result?.isError === true) return [];
    return [textContent(result?.content ?? item.content)];
  } catch { return []; }
}).filter(Boolean).join('\n');

export function savedResults(text: string): SavedResults {
  const parsed = JSON.parse(text) as SavedResults;
  if (!Array.isArray(parsed.results)) throw new Error('Saved result JSON must have a results array.');
  return parsed;
}

/** Maps result attempt identity to a trace only when its filename is unique. */
export function matchSavedTraces(runs: readonly SavedRun[], traceDirectory: string): Map<string, string | null> {
  const result = new Map<string, string | null>();
  const counts = keyCounts(runs);
  for (const run of runs) for (const [index, attempt] of (run.attempts?.length ? run.attempts : [{}]).entries()) {
    const identity = key(run, attempt, index);
    const matches = traceCandidates(run, attempt, index, traceDirectory);
    result.set(identity, counts.get(identity) === 1 && matches.length === 1 ? path.join(traceDirectory, matches[0]!) : null);
  }
  return result;
}
export function traceCandidates(run: SavedRun, attempt: SavedAttempt, index: number, traceDirectory: string): string[] {
  if (!existsSync(traceDirectory)) return [];
  return readdirSync(traceDirectory).filter((name) => name.endsWith('.jsonl') && name.startsWith(key(run, attempt, index))).sort();
}

/** Complete provider answer for information-use attribution; never result.answer's display truncation. */
export function fullReplyInTrace(trace: string): string | null {
  let answer: string | null = null;
  for (const line of trace.split(/\r?\n/)) try {
    const event = JSON.parse(line) as Json;
    if (event.type === 'sarvam.summary' && typeof event.resultText === 'string') answer = event.resultText;
    if (event.type === 'item.completed') {
      const item = event.item as Json | undefined;
      if (item && /message|assistant/i.test(String(item.type ?? ''))) {
        const text = textContent(item.content ?? item);
        if (text) answer = text;
      }
    }
  } catch { /* Ignore one corrupt event; no reply is inferred. */ }
  return answer;
}

export function buildOfflineMetrics(input: SavedResults, options: { inputName: string; inputText: string; traceDirectory: string; categories?: Record<string, string>; requirements?: Record<string, RequirementLike[]>; categoryCatalog?: string; currentSources?: Record<string, string> }): OfflineMetricsReport {
  const categories = options.categories ?? {};
  const requirements = options.requirements ?? {};
  const traces = matchSavedTraces(input.results, options.traceDirectory);
  const identities = keyCounts(input.results);
  const all = group(); const approaches: Record<string, MetricGroup> = {}; const byCategory: Record<string, MetricGroup> = {}; const byTask: Record<string, MetricGroup> = {}; const byApproachCategory: Record<string, MetricGroup> = {}; const byApproachTask: Record<string, MetricGroup> = {};
  const selected = (run: SavedRun): MetricGroup[] => {
    const category = categories[run.task] ?? 'unknown';
    return [all, approaches[run.approach] ??= group(), byCategory[category] ??= group(), byTask[run.task] ??= group(), byApproachCategory[`${run.approach}/${category}`] ??= group(), byApproachTask[`${run.approach}/${run.task}`] ??= group()];
  };
  for (const run of input.results) {
    const targets = selected(run); const req = requirements[run.task] ?? []; const category = categories[run.task] ?? 'unknown';
    for (const target of targets) { target.logicalRuns++; if (run.valid) target.validRuns++; if (run.valid && run.ok) target.successes++; target.status[run.status] = (target.status[run.status] ?? 0) + 1; }
    const attempts = run.attempts?.length ? run.attempts : [{}];
    for (const [index, attempt] of attempts.entries()) {
      const traceKey = key(run, attempt, index); const trace = traces.get(traceKey);
      for (const target of targets) {
        target.attempts++; if (attempt.timedOut || attempt.status === 'timeout') target.timeoutAttempts++;
        addScalar(target.efficiency.costUsd, attempt.costUsd ?? attempt.usage?.costUsd); addScalar(target.efficiency.costInr, attempt.costInr);
        addScalar(target.efficiency.totalInputTokens, attempt.totalInputTokens);
        addScalar(target.efficiency.outputTokens, attempt.usage?.outputTokens);
        addScalar(target.efficiency.cliWallMs, attempt.timings?.cliWallMs);
      }
      if (!trace) {
        const ambiguous = (identities.get(traceKey) ?? 0) > 1 || traceCandidates(run, attempt, index, options.traceDirectory).length > 1;
        for (const target of targets) {
          if (ambiguous) target.tracesAmbiguous++; else { target.tracesMissing++; target.information.traceMissing++; }
        }
        continue;
      }
      const basename = path.basename(trace); const duplicate = [...traces.values()].filter((item) => item === trace).length > 1;
      if (duplicate) { for (const target of targets) target.tracesAmbiguous++; continue; }
      const traceText = readFileSync(trace, 'utf8'); const diagnostic = diagnoseTrace(traceText, basename); const actions = parseTrace(traceText);
      // Never treat screenshots as text facts. This retains only browser tool result payloads.
      const rawText = observationText(traceText);
      for (const target of targets) {
        target.tracesMatched++; target.toolSteps += diagnostic.stepsToFinish; target.repeatedIdenticalActions += diagnostic.repeatedIdenticalActions; target.coveredOrBlockedClickLoops += diagnostic.coveredOrBlockedClickLoops; addError(target.toolErrors, diagnostic.toolErrors);
        for (const action of actions) {
          target.modalities.textCharacters += action.observationChars; target.modalities.imageBlocks += action.observationImages;
          if (action.observationChars) target.modalities.textObservationActions++;
          if (action.observationImages) target.modalities.imageObservationActions++;
          if (!action.observationChars && action.observationImages) target.modalities.screenshotOnlyActions++;
        }
        if (isVisual(req, category) && actions.some((a) => a.observationImages > 0) && (!req.length || !matchesRequirement(req, rawText))) target.information.unavailableVisualReview++;
        if (!req.length) target.information.noRequirements++;
        else {
          target.information.textRequirementRuns++;
          if (matchesRequirement(req, rawText)) {
            target.information.requiredFactPatternAvailable++;
            if (matchesRequirement(req, fullReplyInTrace(traceText) ?? '')) target.information.answerUsedAvailablePattern++;
            else target.information.answerDidNotUseAvailablePattern++;
          }
        }
      }
    }
  }
  const finalize = (items: Record<string, MetricGroup>): Record<string, MetricGroup> => Object.fromEntries(Object.entries(items).map(([name, value]) => [name, finish(value)]));
  return {
    schemaVersion: 1, kind: 'offline-metrics',
    provenance: { input: options.inputName, inputSha256: hash(options.inputText), resultRows: input.results.length, sourceHashes: (input.metadata?.sourceHashes as Json | undefined) ?? null, currentSources: options.currentSources ?? {}, taskIdsInResult: [...new Set(input.results.map((r) => r.task))].sort(), categoryCatalog: options.categoryCatalog ?? 'not supplied', generatedAt: new Date().toISOString() },
    caveats: [
      'All attempts, including retry failures, contribute to cost/time/usage totals exactly once; observed-per-success is a lower bound when coverage is incomplete.',
      'Tool-error recovery, repeats and blocked-click loops are deterministic trace heuristics, not causal tool-fault verdicts.',
      'Required-fact coverage uses declared text requirements as a pattern proxy. Screenshot-only visual evidence is unavailable without image review; text observations do not establish visual coverage.',
      'Historical fixtureCheck booleans and trace text do not contain authoritative fixture observations; this report makes no hardened state-verification claim.',
    ],
    overall: finish(all), byApproach: finalize(approaches), byCategory: finalize(byCategory), byTask: finalize(byTask), byApproachCategory: finalize(byApproachCategory), byApproachTask: finalize(byApproachTask),
  };
}

const fmt = (number: number | null): string => number === null ? 'unknown' : Number.isInteger(number) ? String(number) : number.toFixed(3);
const row = (name: string, metrics: MetricGroup): string => `| ${name} | ${metrics.successes}/${metrics.validRuns} | ${metrics.attempts} | ${metrics.toolSteps} | ${metrics.repeatedIdenticalActions} | ${metrics.coveredOrBlockedClickLoops} | ${fmt(metrics.efficiency.costInr.observedPerSuccess)}${metrics.efficiency.costInr.unknownAttempts ? '+' : ''} | ${metrics.efficiency.cliWallMs.knownAttempts}/${metrics.efficiency.cliWallMs.allAttempts} |`;
export function offlineMetricsMarkdown(report: OfflineMetricsReport): string {
  const lines = ['# Offline agent metrics', '', `Source: \`${report.provenance.input}\` (${report.provenance.resultRows} logical runs; SHA-256 \`${report.provenance.inputSha256}\`).`, '', '## Outcome and efficiency by approach', '', '| Approach | Legacy successes/valid | Attempts | Tool steps | Repeats | Blocked-click loops | Observed INR/success | Wall-time coverage |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
  for (const [name, value] of Object.entries(report.byApproach).sort()) lines.push(row(name, value));
  lines.push('', '## Outcomes by category', '', '| Category | Legacy successes/valid | Attempts | Tool steps | Repeats | Blocked-click loops | Observed INR/success | Wall-time coverage |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const [name, value] of Object.entries(report.byCategory).sort()) lines.push(row(name, value));
  lines.push('', '## Outcomes by task', '', '| Task | Legacy successes/valid | Attempts | Tool steps | Repeats | Blocked-click loops | Observed INR/success | Wall-time coverage |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const [name, value] of Object.entries(report.byTask).sort()) lines.push(row(name, value));
  lines.push('', 'Approach×category and approach×task groups are retained in the JSON companion for paired comparisons.');
  lines.push('', '## Information evidence', '', '| Scope | Pattern available in text observation | Available but answer lacks pattern | Screenshot-only visual review unavailable | Missing traces |', '| --- | ---: | ---: | ---: | ---: |');
  const infoRow = (name: string, value: MetricGroup): string => `| ${name} | ${value.information.requiredFactPatternAvailable}/${value.information.textRequirementRuns} | ${value.information.answerDidNotUseAvailablePattern} | ${value.information.unavailableVisualReview} | ${value.information.traceMissing} |`;
  lines.push(infoRow('overall', report.overall)); for (const [name, value] of Object.entries(report.byApproach).sort()) lines.push(infoRow(name, value));
  lines.push('', '## Provenance and limits', ''); for (const caveat of report.caveats) lines.push(`- ${caveat}`);
  return `${lines.join('\n')}\n`;
}

function catalog(): { categories: Record<string, string>; requirements: Record<string, RequirementLike[]>; source: string; currentSources: Record<string, string> } {
  // tasks.ts is task data and deterministic graders only; this module intentionally never imports run.ts.
  return {
    categories: Object.fromEntries(TASKS.map((task) => [task.id, task.category])),
    requirements: Object.fromEntries(TASKS.map((task) => [task.id, task.answerRequirements ?? []])),
    source: 'current bench/agent/tasks.ts task IDs/categories/answer requirements',
    currentSources: Object.fromEntries(['tasks.ts', 'grading.ts'].map((name) => [name, hash(readFileSync(path.resolve(import.meta.dirname, name), 'utf8'))])),
  };
}
function main(): void {
  const name = process.argv[2] ?? process.env.OFFLINE_METRICS_IN;
  if (!name) throw new Error('Pass a result name/path or set OFFLINE_METRICS_IN.');
  const resultsRoot = path.resolve(import.meta.dirname, '..', 'results'); const inputPath = existsSync(name) ? path.resolve(name) : path.join(resultsRoot, `${name.replace(/\.json$/i, '')}.json`);
  const inputText = readFileSync(inputPath, 'utf8'); const parsed = savedResults(inputText); const resultName = path.basename(inputPath, '.json');
  const data = catalog(); const traceDirectory = path.join(resultsRoot, 'agent-logs', resultName);
  const report = buildOfflineMetrics(parsed, { inputName: path.relative(path.resolve(import.meta.dirname, '..', '..'), inputPath), inputText, traceDirectory, ...data, categoryCatalog: data.source });
  const stem = process.env.OFFLINE_METRICS_OUT ?? `${resultName}-offline-metrics`;
  const jsonOut = path.resolve(resultsRoot, `${stem}.json`); const markdownOut = path.resolve(resultsRoot, `${stem}.md`);
  const samePath = (left: string, right: string): boolean => process.platform === 'win32' ? left.toLowerCase() === right.toLowerCase() : left === right;
  if (samePath(jsonOut, inputPath) || samePath(markdownOut, inputPath)) throw new Error('Offline metrics output must not overwrite its source result JSON.');
  writeFileSync(jsonOut, JSON.stringify(report, null, 2) + '\n'); writeFileSync(markdownOut, offlineMetricsMarkdown(report));
  console.log(`[offline-metrics] wrote bench/results/${stem}.{json,md} for ${parsed.results.length} result rows.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
