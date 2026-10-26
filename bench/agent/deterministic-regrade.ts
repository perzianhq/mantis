/** Offline replay of saved deterministic evidence; it never opens a browser or calls a model. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deterministicGradeForRun, isAccessBlockText, readEvidenceSidecar, readFinalTexts, runKey, type PacketFrame, type SavedRun } from './judge.js';
import { LIVE_V1_SCORED_ROWS } from './live-v1.js';
import { LONG_LIVE_V1_ROWS } from './long-live-v1.js';
import type { RealsiteRow } from './realsite.js';

export type RegradeSuite = 'live-v1' | 'long-live-v1';
export type RegradeResult = {
  task: string; approach: string; run: number; status: string; verdict: 'success' | 'failure'; reason: string; blocked: boolean;
  /** The raw result/log directory that supplied this cell, never a merged judged report. */
  provenance: string; selected: boolean;
};
export type RegradeReport = {
  suite: RegradeSuite; source: string; model: string; taskCount: number; runsPerApproach: number;
  excludedTasks: Array<{ task: string; reason: string }>;
  runs: RegradeResult[]; sourceRuns: RegradeResult[]; differences: RegradeResult[];
  counts: Record<string, number>; totals: Record<string, number>; reproducedExistingVerdicts: number;
};
type SourceFile = { results?: SavedRun[]; metadata?: { settings?: { provider?: string; model?: string } }; model?: string };

const RESULTS = path.resolve(import.meta.dirname, '..', 'results');
const resultKey = (r: Pick<RegradeResult, 'task' | 'approach' | 'run'>) => `${r.task}--${r.approach}--${r.run}`;
const longIdfix = 'long-live-v1-idfix-haiku';

function suiteRows(suite: RegradeSuite): readonly RealsiteRow[] {
  return suite === 'long-live-v1' ? LONG_LIVE_V1_ROWS : LIVE_V1_SCORED_ROWS;
}
function sourceFile(root: string, name: string): SourceFile { return JSON.parse(readFileSync(path.join(root, `${name}.json`), 'utf8')) as SourceFile; }
function sourceProvider(source: SourceFile): string { return source.metadata?.settings?.provider ?? (source.model?.includes('claude') ? 'claude' : source.model?.includes('sarvam') ? 'sarvam' : 'codex'); }
function sourceModel(source: SourceFile): string { return source.metadata?.settings?.model ?? source.model ?? 'unknown-model'; }

/** The journal is sidecar-level evidence, but only the final capture may use it to prove a terminal contract. */
export function framesWithJournal(sidecar: ReturnType<typeof readEvidenceSidecar>): PacketFrame[] {
  if (!sidecar) return [];
  return sidecar.frames.map((frame) => ({
    id: frame.id, url: frame.url, text: frame.text, final: frame.final === true,
    ...(frame.final ? { forms: frame.forms ?? [], ...(sidecar.journal ? { journal: sidecar.journal } : {}) } : {}), image: '',
  }));
}

/** Preserve original cells for audit, then replace only the three repaired Haiku cells from raw evidence. */
export function applyLongLiveIdfix(sourceName: string, primary: readonly SavedRun[], replacement: readonly SavedRun[]): Array<{ run: SavedRun; provenance: string; selected: boolean }> {
  const replacementKeys = new Set(replacement.map((run) => resultKey(run)));
  const historical = primary.map((run) => ({ run, provenance: sourceName, selected: !replacementKeys.has(resultKey(run)) }));
  if (sourceName !== 'long-live-v1-final-haiku') return historical;
  return [...historical, ...replacement.map((run) => ({ run, provenance: longIdfix, selected: true }))];
}

function fullReplies(root: string, records: readonly { run: SavedRun; provenance: string }[], sources: Map<string, SourceFile>): Map<string, string> {
  const replies = new Map<string, string>();
  for (const [provenance, source] of sources) {
    const runs = records.filter((record) => record.provenance === provenance).map((record) => record.run);
    const texts = readFinalTexts(path.join(root, 'agent-logs', provenance), sourceProvider(source), runs);
    for (const run of runs) {
      const text = texts.get(runKey(run.task, run.approach, run.run));
      if (text) replies.set(`${provenance}|${resultKey(run)}`, text);
    }
  }
  return replies;
}

function oldVerdicts(root: string, sourceName: string, suite: RegradeSuite): Map<string, string> {
  const names = suite === 'long-live-v1' && sourceName === 'long-live-v1-final-haiku'
    ? ['long-live-v1-final-merged-haiku-judged']
    : suite === 'long-live-v1' ? [`${sourceName}-judged`] : [`${sourceName}-final`];
  for (const name of names) {
    const file = path.join(root, `${name}.json`);
    if (!existsSync(file)) continue;
    const prior = JSON.parse(readFileSync(file, 'utf8')) as { runs?: Array<{ task: string; approach: string; run: number; verdict: string }> };
    return new Map((prior.runs ?? []).map((run) => [resultKey(run), run.verdict]));
  }
  return new Map();
}
/** Historical-source comparison deliberately does not use the merged Haiku report as evidence. */
function historicalOldVerdicts(root: string, sourceName: string, suite: RegradeSuite): Map<string, string> {
  if (suite === 'long-live-v1') {
    const file = path.join(root, `${sourceName}-judged.json`);
    if (existsSync(file)) {
      const prior = JSON.parse(readFileSync(file, 'utf8')) as { runs?: Array<{ task: string; approach: string; run: number; verdict: string }> };
      return new Map((prior.runs ?? []).map((run) => [resultKey(run), run.verdict]));
    }
  }
  return oldVerdicts(root, sourceName, suite);
}

function gradeRecord(row: RealsiteRow, record: { run: SavedRun; provenance: string; selected: boolean }, root: string, replies: Map<string, string>): RegradeResult {
  const { run, provenance, selected } = record;
  const logs = path.join(root, 'agent-logs', provenance);
  const sidecarPath = run.evidencePath ? path.join(logs, path.basename(run.evidencePath)) : null;
  const sidecar = readEvidenceSidecar(sidecarPath, logs);
  const frames = framesWithJournal(sidecar);
  const final = frames.filter((frame) => frame.final);
  const blocked = final.some((frame) => isAccessBlockText(frame.text));
  const answer = replies.get(`${provenance}|${resultKey(run)}`);
  const missing = [
    ...(answer === undefined ? ['missing attempt-bound final reply'] : []),
    ...(!sidecar ? ['missing saved evidence sidecar'] : []),
    ...(sidecar && final.length !== 1 ? [final.length ? 'multiple final captured evidence frames' : 'missing final captured evidence frame'] : []),
  ];
  const grade = !missing.length && !blocked ? deterministicGradeForRun(row, run.status, true, answer!, frames) : null;
  const verdict: 'success' | 'failure' = grade?.pass === true ? 'success' : 'failure';
  const reason = blocked ? 'final captured frame is an access-block page' : missing.length ? missing.join('; ')
    : grade?.failed.join('; ') ?? `run status ${run.status} (not deterministically gradable)`;
  return { task: run.task, approach: run.approach, run: run.run, status: run.status, verdict, reason, blocked, provenance, selected };
}

/** Regrade a saved run set. Long-live excludes its two judge-only chains from deterministic scoring. */
export function deterministicRegrade(name: string, suite: RegradeSuite = 'live-v1', root: string = RESULTS): RegradeReport {
  const primary = sourceFile(root, name);
  const sources = new Map<string, SourceFile>([[name, primary]]);
  const replacement = suite === 'long-live-v1' && name === 'long-live-v1-final-haiku' ? sourceFile(root, longIdfix) : { results: [] };
  if (suite === 'long-live-v1' && name === 'long-live-v1-final-haiku') sources.set(longIdfix, replacement);
  const deterministicRows = suiteRows(suite).filter((row) => Boolean(row.deterministic));
  const rows = new Map(deterministicRows.map((row) => [row.task_id, row]));
  const excludedTasks = suite === 'long-live-v1' ? suiteRows(suite).filter((row) => !row.deterministic).map((row) => ({ task: row.task_id, reason: 'not deterministically gradable' })) : [];
  const allRecords = (suite === 'long-live-v1' ? applyLongLiveIdfix(name, primary.results ?? [], replacement.results ?? []) : (primary.results ?? []).map((run) => ({ run, provenance: name, selected: true }))).filter((record) => rows.has(record.run.task));
  const replies = fullReplies(root, allRecords, sources);
  const sourceRuns = allRecords.map((record) => gradeRecord(rows.get(record.run.task)!, record, root, replies));
  const runs = sourceRuns.filter((run) => run.selected);
  const old = oldVerdicts(root, name, suite);
  const differences = runs.filter((run) => old.has(resultKey(run)) && old.get(resultKey(run)) !== run.verdict);
  const reproducedExistingVerdicts = sourceRuns.filter((run) => {
    const prior = historicalOldVerdicts(root, run.provenance, suite);
    return prior.has(resultKey(run)) && prior.get(resultKey(run)) === run.verdict;
  }).length;
  const counts: Record<string, number> = {}; const totals: Record<string, number> = {};
  for (const run of runs) { totals[run.approach] = (totals[run.approach] ?? 0) + 1; if (run.verdict === 'success') counts[run.approach] = (counts[run.approach] ?? 0) + 1; }
  return { suite, source: name, model: sourceModel(primary), taskCount: deterministicRows.length, runsPerApproach: deterministicRows.length * 3, excludedTasks, runs, sourceRuns, differences, counts, totals, reproducedExistingVerdicts };
}

function modelSlug(model: string): string { return /haiku/i.test(model) ? 'haiku' : /luna/i.test(model) ? 'luna' : model.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
function markdown(report: RegradeReport): string {
  const score = Object.keys(report.totals).sort().map((approach) => `${approach}: ${report.counts[approach] ?? 0}/${report.totals[approach]}`).join('; ');
  const lines = [`# Deterministic ${report.suite} regrade`, '', `Model: ${report.model}.`, `Successes (${report.runsPerApproach} runs per approach): ${score || 'none'}.`, '', '## Excluded tasks', ''];
  for (const task of report.excludedTasks) lines.push(`- ${task.task}: ${task.reason}`);
  const failures = report.runs.filter((run) => run.verdict === 'failure');
  lines.push('', '## Failures under deterministic keys', '', '| Task | Approach | Run | Model | Failing check |', '| --- | --- | ---: | --- | --- |');
  for (const run of failures) lines.push(`| ${run.task} | ${run.approach} | ${run.run} | ${report.model} | ${run.reason.replaceAll('|', '\\|')} |`);
  lines.push('', '## Verdict differences', '', '| Run | Old | New | Reason |', '| --- | --- | --- | --- |');
  for (const run of report.differences) lines.push(`| ${resultKey(run)} | see judged report | ${run.verdict} | ${run.reason.replaceAll('|', '\\|')} |`);
  return `${lines.join('\n')}\n`;
}
function writeReport(report: RegradeReport, root: string = RESULTS): string {
  const stem = report.suite === 'long-live-v1' ? `${report.suite}-deterministic-regrade-${modelSlug(report.model)}` : `${report.source}-regraded`;
  writeFileSync(path.join(root, `${stem}.json`), JSON.stringify(report, null, 2) + '\n');
  writeFileSync(path.join(root, `${stem}.md`), markdown(report));
  return stem;
}
function writeLongLiveSummary(reports: readonly RegradeReport[], root: string = RESULTS): void {
  const paired = ['mantis', 'tree'].map((approach) => ({ approach, ...Object.fromEntries(reports.map((report) => [modelSlug(report.model), `${report.counts[approach] ?? 0}/${report.totals[approach] ?? 0}`])) }));
  const reproduced = reports.reduce((total, report) => total + report.reproducedExistingVerdicts, 0);
  const summary = { suite: 'long-live-v1', taskCount: 14, runsPerApproach: 42, paired, reproducedExistingVerdicts: reproduced, excludedTasks: reports[0]?.excludedTasks ?? [] };
  const failures = reports.flatMap((report) => report.runs.filter((run) => run.verdict === 'failure').map((run) => ({ ...run, model: report.model })));
  writeFileSync(path.join(root, 'long-live-v1-deterministic-regrade.json'), JSON.stringify(summary, null, 2) + '\n');
  writeFileSync(path.join(root, 'long-live-v1-deterministic-regrade.md'), [
    '# Deterministic long-live-v1 regrade', '', `Reproduced existing deterministic verdicts: ${reproduced}/171.`, '', '| Approach | Luna | Haiku |', '| --- | --- | --- |',
    ...paired.map((row) => `| ${row.approach} | ${row.luna ?? 'n/a'} | ${row.haiku ?? 'n/a'} |`), '', 'Excluded: internet-window-frames-upload and selenium-window-frames-upload — not deterministically gradable.', '',
    '## Failures under deterministic keys', '', '| Task | Approach | Run | Model | Failing check |', '| --- | --- | ---: | --- | --- |',
    ...failures.map((run) => `| ${run.task} | ${run.approach} | ${run.run} | ${run.model} | ${run.reason.replaceAll('|', '\\|')} |`), '',
  ].join('\n'));
}

function main(): void {
  const [first, second] = process.argv.slice(2);
  if (first === 'long-live-v1' && !second) {
    const reports: RegradeReport[] = [];
    for (const source of ['long-live-v1-final-luna', 'long-live-v1-final-haiku']) {
      const report = deterministicRegrade(source, 'long-live-v1'); const stem = writeReport(report);
      reports.push(report);
      console.log(`[regrade] ${stem}: ${Object.entries(report.counts).map(([a, n]) => `${a}=${n}/${report.totals[a]}`).join(' ')}; differences=${report.differences.length}`);
    }
    writeLongLiveSummary(reports);
    return;
  }
  const suite: RegradeSuite = first === 'live-v1' || first === 'long-live-v1' ? first : (first?.startsWith('long-live-v1') ? 'long-live-v1' : 'live-v1');
  const source = second ?? first;
  if (!source || source === 'live-v1') throw new Error('Pass a saved result name, or `long-live-v1` to replay the published Luna and Haiku cohorts.');
  const report = deterministicRegrade(source, suite); const stem = writeReport(report);
  console.log(`[regrade] ${stem}: ${Object.entries(report.counts).map(([a, n]) => `${a}=${n}/${report.totals[a]}`).join(' ')}; differences=${report.differences.length}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
