/** Offline live-v1 replay: reads only saved evidence sidecars, never a model or network. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deterministicGradeForRun, isAccessBlockText, readEvidenceSidecar, type SavedRun } from './judge.js';
import { LIVE_V1_SCORED_ROWS } from './live-v1.js';

type Result = { task: string; approach: string; run: number; status: string; verdict: 'success' | 'failure'; reason: string; blocked: boolean };
const root = path.resolve(import.meta.dirname, '..', 'results');
const key = (r: Pick<Result, 'task' | 'approach' | 'run'>) => `${r.task}--${r.approach}--${r.run}`;

export function deterministicRegrade(name: string): { runs: Result[]; differences: Result[]; counts: Record<string, number> } {
  const source = JSON.parse(readFileSync(path.join(root, `${name}.json`), 'utf8')) as { results: SavedRun[] };
  const finalPath = path.join(root, `${name}-final.json`);
  const prior = existsSync(finalPath) ? JSON.parse(readFileSync(finalPath, 'utf8')) as { runs?: Array<{ task: string; approach: string; run: number; verdict: string }> } : { runs: [] };
  const old = new Map((prior.runs ?? []).map((r) => [key(r), r.verdict])); const rows = new Map(LIVE_V1_SCORED_ROWS.map((r) => [r.task_id, r]));
  const logs = path.join(root, 'agent-logs', name);
  const preliminary = source.results.filter((run) => rows.has(run.task)).map((run) => {
    const sidecar = readEvidenceSidecar(run.evidencePath ? path.join(logs, path.basename(run.evidencePath)) : null, logs);
    const frames = sidecar?.frames ?? []; const final = frames.filter((f) => f.final);
    const blocked = final.some((f) => isAccessBlockText(f.text));
    const grade = deterministicGradeForRun(rows.get(run.task)!, run.status, true, run.answer ?? '', frames);
    const verdict: 'success' | 'failure' = grade?.pass === true ? 'success' : 'failure';
    return { task: run.task, approach: run.approach, run: run.run, status: run.status, verdict, reason: blocked ? 'final captured frame is an access-block page' : grade?.failed.join('; ') ?? (run.status === 'success' ? 'missing saved final evidence' : `run status ${run.status} (no graded final frame)`), blocked };
  });
  const taskRuns = new Map<string, Result[]>(); for (const run of preliminary) taskRuns.set(run.task, [...(taskRuns.get(run.task) ?? []), run]);
  const excluded = new Set([...taskRuns].filter(([, runs]) => runs.length > 0 && runs.every((run) => run.blocked)).map(([task]) => task));
  const runs = preliminary.map((run) => excluded.has(run.task) ? { ...run, verdict: 'failure' as const, reason: `${run.reason}; task excluded as blocked for every approach run` } : run);
  const differences = runs.filter((run) => old.has(key(run)) && old.get(key(run)) !== run.verdict);
  const counts: Record<string, number> = {}; for (const run of runs) if (run.verdict === 'success') counts[run.approach] = (counts[run.approach] ?? 0) + 1;
  return { runs, differences, counts };
}

function main(): void {
  const name = process.argv[2]; if (!name) throw new Error('Pass the saved live-v1 result name.');
  const report = deterministicRegrade(name); const stem = `${name}-regraded`;
  writeFileSync(path.join(root, `${stem}.json`), JSON.stringify(report, null, 2) + '\n');
  const lines = [`# Deterministic live-v1 regrade`, '', `Successes: ${Object.entries(report.counts).map(([a, n]) => `${a} ${n}`).join(', ') || 'none'}.`, '', '## Verdict differences', '', '| Run | Old | New | Reason |', '| --- | --- | --- | --- |'];
  for (const run of report.differences) lines.push(`| ${key(run)} | see final report | ${run.verdict} | ${run.reason.replaceAll('|', '\\|')} |`);
  writeFileSync(path.join(root, `${stem}.md`), `${lines.join('\n')}\n`);
  console.log(`[regrade] ${name}: ${Object.entries(report.counts).map(([a, n]) => `${a}=${n}`).join(' ')}; differences=${report.differences.length}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
