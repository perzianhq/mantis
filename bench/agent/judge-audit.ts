/**
 * Independent-label calibration audit for the blind judge.
 *
 *   npm --prefix bench/agent run bench:judge-audit -- select
 *   npm --prefix bench/agent run bench:judge-audit -- run
 *   npm --prefix bench/agent run bench:judge-audit -- report
 *
 * Selection is deliberately offline.  `run` reuses judgeBenchmark for one
 * saved packet at a time so each completed model verdict is durable and a
 * restart never repeats it.
 */
import { appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isEvidenceRun, judgeBenchmark, readEvidenceSidecar, relocateSavedPath } from './judge.js';
import { LIVE_V1_SCORED_ROWS } from './live-v1.js';
import { LONG_LIVE_V1_SCORED_ROWS } from './long-live-v1.js';
import { loadRealsiteRows } from './realsite.js';
import type { SavedBenchmark, SavedRun, Verdict } from './judge.js';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const DEFAULT_RESULTS = path.join(REPO, 'bench', 'results');
// AUDIT_TAG keeps a scoped audit (see AUDIT_PREFIX / AUDIT_ALL below) in its own files.
const AUDIT_PROVIDER = (process.env.AUDIT_PROVIDER ?? 'codex') as 'codex' | 'claude';
const TAG = process.env.AUDIT_TAG ? `-${process.env.AUDIT_TAG}` : '';
const MANIFEST_NAME = `judge-audit${TAG}-manifest.json`;
const RUN_NAME = `judge-audit${TAG}-run.jsonl`;
const TARGET = 120;
const FAILURE_TARGET = Math.round(TARGET * 0.4);

export type GoldVerdict = 'success' | 'failure';

export interface AuditPacket {
  id: string;
  source: string;
  task: string;
  approach: string;
  model: string;
  run: number;
  attemptLog: string;
  gold: GoldVerdict;
}

export interface AuditManifest {
  version: 1;
  seed: number;
  target: number;
  selected: AuditPacket[];
  available: { packets: number; tasks: number; successes: number; failures: number; approaches: string[]; models: string[] };
}

export interface AuditRun extends AuditPacket {
  verdict: Verdict;
  reason: string;
  judgeModel?: string;
  completedAt: string;
}

export interface AuditSummary {
  packets: number;
  tasks: number;
  agreement: number;
  agreementRate: number;
  falseSuccesses: number;
  goldFailures: number;
  falseSuccessOfFailures: number | null;
  falseSuccessOfAll: number;
  confusion: Record<GoldVerdict, Record<'success' | 'failure' | 'other', number>>;
  outcomes: Record<'success' | 'failure' | 'unsure' | 'blocked' | 'site_broken', number>;
  wilson95: { low: number; high: number };
  gate: { pass: boolean; packets: boolean; tasks: boolean; agreement: boolean; falseSuccess: boolean };
  disagreements: { task: string; approach: string; model: string; gold: GoldVerdict; verdict: Verdict; reason: string }[];
}

const hash = (value: string, seed: number): number => {
  let n = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < value.length; i++) n = Math.imul(n ^ value.charCodeAt(i), 16777619);
  return n >>> 0;
};

const seeded = <T>(items: readonly T[], seed: number, label: (item: T) => string): T[] =>
  [...items].sort((a, b) => hash(label(a), seed) - hash(label(b), seed) || label(a).localeCompare(label(b)));

const packetId = (packet: Omit<AuditPacket, 'id'>): string =>
  [packet.task, packet.approach, packet.model, packet.run, packet.attemptLog].join('|');

const validGold = (value: unknown): value is GoldVerdict => value === 'success' || value === 'failure';
const ignoredResultName = (name: string): boolean => /(?:prev|stale|unusable|merged)/i.test(name);
const within = (file: string, root: string): boolean => {
  const relative = path.relative(path.resolve(root), path.resolve(file));
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};
const modelFor = (saved: SavedBenchmark, run: SavedRun): string =>
  run.resolvedModels?.[0] ?? run.attempts?.flatMap((attempt) => attempt.resolvedModels ?? [attempt.initModel ?? '']).find(Boolean) ?? run.initModel ?? saved.metadata?.settings?.model ?? saved.model ?? 'unknown';
const logNameFor = (run: SavedRun): string => path.basename(run.logPath ?? run.evidencePath ?? run.finalScreenshotPath ?? `run-${run.run}`)
  .replace(/\.evidence\.json$/, '.jsonl').replace(/\.(?:final|step-\d+(?:-[a-z]+)?)\.png$/, '.jsonl');

/** Require the same immutable evidence packet that `run` will give the judge. */
export function hasCompleteSavedEvidence(run: SavedRun, logs: string): boolean {
  if (!isEvidenceRun(run)) return false;
  const sidecarPath = relocateSavedPath(run.evidencePath, logs);
  const sidecar = readEvidenceSidecar(sidecarPath, logs);
  if (!sidecar || !sidecar.frames.length || sidecar.frames.length !== (run.evidenceFrames?.length ?? 0)) return false;
  const sidecarDir = path.dirname(sidecarPath!);
  if (!sidecar.frames.every((frame) => {
    const image = path.resolve(sidecarDir, frame.file);
    return within(image, sidecarDir) && existsSync(image);
  })) return false;
  if (!(run.evidenceFrames ?? []).every((frame) => {
    const image = relocateSavedPath(frame, logs);
    return typeof image === 'string' && within(image, logs) && existsSync(image);
  })) return false;
  const log = relocateSavedPath(run.logPath ?? logNameFor(run), logs);
  return typeof log === 'string' && within(log, logs) && existsSync(log);
}

/** Choose a reproducible, task-round-robin sample while retaining failure power. */
export function selectAuditPackets(available: readonly AuditPacket[], target = TARGET, seed = 1): AuditPacket[] {
  const selected: AuditPacket[] = [];
  const used = new Set<string>();
  const add = (packet: AuditPacket | undefined): void => {
    if (packet && selected.length < target && !used.has(packet.id)) { selected.push(packet); used.add(packet.id); }
  };
  const byTask = (items: readonly AuditPacket[]): Map<string, AuditPacket[]> => {
    const groups = new Map<string, AuditPacket[]>();
    for (const item of items) groups.set(item.task, [...(groups.get(item.task) ?? []), item]);
    return groups;
  };
  const roundRobin = (items: readonly AuditPacket[], count: number, preferFailure = false): void => {
    const groups = byTask(items);
    const tasks = seeded([...groups.keys()], seed, (task) => task);
    while (selected.length < target && count > 0) {
      let added = 0;
      for (const task of tasks) {
        const candidates = seeded(groups.get(task) ?? [], seed, (packet) => packet.id)
          .filter((packet) => !used.has(packet.id));
        const next = (preferFailure ? candidates.find((packet) => packet.gold === 'failure') : undefined) ?? candidates[0];
        if (next && count > 0) { add(next); count--; added++; }
      }
      if (!added) return;
    }
  };

  // First give every task a seat.  This is the hard diversity constraint.
  for (const task of seeded([...byTask(available).keys()], seed, (item) => item)) {
    const choices = seeded(byTask(available).get(task) ?? [], seed, (packet) => packet.id);
    add(choices.find((packet) => packet.gold === 'failure') ?? choices[0]);
  }
  // Cover every available approach and agent model before filling the sample.
  for (const dimension of [
    [...new Set(available.map((packet) => packet.approach))],
    [...new Set(available.map((packet) => packet.model))],
  ]) for (const value of seeded(dimension, seed, (item) => item)) add(seeded(available.filter((packet) => packet.approach === value || packet.model === value), seed, (packet) => packet.id).find((packet) => !used.has(packet.id)));

  const failures = available.filter((packet) => packet.gold === 'failure');
  const wantedFailures = Math.min(failures.length, Math.round(target * 0.4));
  roundRobin(failures, Math.max(0, wantedFailures - selected.filter((packet) => packet.gold === 'failure').length), true);
  roundRobin(available.filter((packet) => packet.gold === 'success'), target - selected.length);
  roundRobin(failures, target - selected.length, true);
  return selected;
}

export function loadAvailablePackets(resultsDir = DEFAULT_RESULTS): AuditPacket[] {
  const winners = new Map<string, { packet: AuditPacket; mtime: number; source: string }>();
  for (const judgedFile of readdirSync(resultsDir).filter((name) => name.endsWith('-judged.json') && !ignoredResultName(name))) {
    const source = judgedFile.replace(/-judged\.json$/, '');
    const sourcePath = path.join(resultsDir, `${source}.json`);
    if (!existsSync(sourcePath)) continue;
    let judged: { runs?: { task?: string; approach?: string; run?: number; verdict?: unknown; grading?: unknown }[] };
    let saved: SavedBenchmark;
    try { judged = JSON.parse(readFileSync(path.join(resultsDir, judgedFile), 'utf8')); saved = JSON.parse(readFileSync(sourcePath, 'utf8')); } catch { continue; }
    const logs = path.join(resultsDir, 'agent-logs', source);
    const mtime = statSync(path.join(resultsDir, judgedFile)).mtimeMs;
    for (const result of judged.runs ?? []) {
      if (result.grading !== 'deterministic' || !validGold(result.verdict) || typeof result.task !== 'string' || typeof result.approach !== 'string' || !Number.isInteger(result.run)) continue;
      const savedRun = saved.results.find((run) => run.task === result.task && run.approach === result.approach && run.run === result.run);
      if (!savedRun || !hasCompleteSavedEvidence(savedRun, logs)) continue;
      const packetBase = { source, task: result.task, approach: result.approach, model: modelFor(saved, savedRun), run: result.run, attemptLog: logNameFor(savedRun), gold: result.verdict };
      const packet: AuditPacket = { ...packetBase, id: packetId(packetBase) };
      const previous = winners.get(packet.id);
      if (!previous || mtime > previous.mtime || (mtime === previous.mtime && source.localeCompare(previous.source) > 0)) winners.set(packet.id, { packet, mtime, source });
    }
  }
  return [...winners.values()].map((entry) => entry.packet);
}

export function buildAuditManifest(available: readonly AuditPacket[], seed = 1, target = TARGET): AuditManifest {
  const selected = target >= available.length ? [...available] : selectAuditPackets(available, target, seed);
  return {
    version: 1, seed, target, selected,
    available: {
      packets: available.length,
      tasks: new Set(available.map((packet) => packet.task)).size,
      successes: available.filter((packet) => packet.gold === 'success').length,
      failures: available.filter((packet) => packet.gold === 'failure').length,
      approaches: [...new Set(available.map((packet) => packet.approach))].sort(),
      models: [...new Set(available.map((packet) => packet.model))].sort(),
    },
  };
}

const wilson = (successes: number, total: number): { low: number; high: number } => {
  if (!total) return { low: 0, high: 0 };
  const z = 1.959963984540054;
  const p = successes / total;
  const d = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / d;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / d;
  return { low: center - margin, high: center + margin };
};

export function summarizeAudit(manifest: AuditManifest, completed: readonly AuditRun[]): AuditSummary {
  const expected = new Map(manifest.selected.map((packet) => [packet.id, packet]));
  // A partially interrupted append can leave a duplicate line; only the latest
  // durable verdict for a manifest packet is part of the audit denominator.
  const latest = new Map<string, AuditRun>();
  for (const run of completed) if (expected.has(run.id)) latest.set(run.id, run);
  const runs = [...latest.values()];
  const outcomes: AuditSummary['outcomes'] = { success: 0, failure: 0, unsure: 0, blocked: 0, site_broken: 0 };
  const confusion: AuditSummary['confusion'] = { success: { success: 0, failure: 0, other: 0 }, failure: { success: 0, failure: 0, other: 0 } };
  const disagreements: AuditSummary['disagreements'] = [];
  let agreement = 0;
  let falseSuccesses = 0;
  for (const run of runs) {
    outcomes[run.verdict]++;
    const column: 'success' | 'failure' | 'other' = run.verdict === 'success' || run.verdict === 'failure' ? run.verdict : 'other';
    confusion[run.gold][column]++;
    if (run.verdict === run.gold) agreement++;
    else disagreements.push({ task: run.task, approach: run.approach, model: run.model, gold: run.gold, verdict: run.verdict, reason: run.reason });
    if (run.gold === 'failure' && run.verdict === 'success') falseSuccesses++;
  }
  const total = runs.length;
  const failures = runs.filter((run) => run.gold === 'failure').length;
  const agreementRate = total ? agreement / total : 0;
  const falseSuccessOfFailures = failures ? falseSuccesses / failures : null;
  const gate = {
    packets: total >= 100,
    tasks: new Set(runs.map((run) => run.task)).size >= 30,
    agreement: agreementRate >= .95,
    falseSuccess: falseSuccessOfFailures !== null && falseSuccessOfFailures <= .02,
    pass: false,
  };
  gate.pass = gate.packets && gate.tasks && gate.agreement && gate.falseSuccess;
  return { packets: total, tasks: new Set(runs.map((run) => run.task)).size, agreement, agreementRate, falseSuccesses, goldFailures: failures, falseSuccessOfFailures, falseSuccessOfAll: total ? falseSuccesses / total : 0, confusion, outcomes, wilson95: wilson(agreement, total), gate, disagreements };
}

const percent = (value: number | null): string => value === null ? 'n/a' : `${(value * 100).toFixed(1)}%`;
const renderReport = (manifest: AuditManifest, report: AuditSummary): string => {
  const state = report.gate.pass ? 'PASS' : 'FAIL';
  const rows = report.disagreements.length
    ? report.disagreements.map((item) => `| ${item.task} | ${item.approach} | ${item.model} | ${item.gold} | ${item.verdict} | ${item.reason.replaceAll('|', '\\|')} |`).join('\n')
    : '| none | - | - | - | - | - |';
  return [
    '# Sol judge calibration audit', '',
    `**${state}** — packets ${report.packets}/100; tasks ${report.tasks}/30; agreement ${percent(report.agreementRate)} (95% Wilson ${percent(report.wilson95.low)}–${percent(report.wilson95.high)}); false successes ${report.falseSuccesses}/${report.goldFailures} (${percent(report.falseSuccessOfFailures)}) and ${percent(report.falseSuccessOfAll)} of all packets.`, '',
    `Manifest: ${manifest.selected.length}/${manifest.target} selected from ${manifest.available.packets} eligible deterministic packets (${manifest.available.tasks} tasks; ${manifest.available.successes} successes; ${manifest.available.failures} failures).`, '',
    '## Confusion matrix', '',
    '| Gold | Sol success | Sol failure | Sol other |', '| --- | ---: | ---: | ---: |',
    `| success | ${report.confusion.success.success} | ${report.confusion.success.failure} | ${report.confusion.success.other} |`,
    `| failure | ${report.confusion.failure.success} | ${report.confusion.failure.failure} | ${report.confusion.failure.other} |`, '',
    `Other outcomes: unsure ${report.outcomes.unsure}, blocked ${report.outcomes.blocked}, site_broken ${report.outcomes.site_broken}. These are disagreements.`, '',
    '## Disagreements by task / approach / model', '',
    '| Task | Approach | Model | Gold | Sol | Reason |', '| --- | --- | --- | --- | --- | --- |', rows, '',
    `Gate checks: packets ${report.gate.packets ? 'PASS' : 'FAIL'}; tasks ${report.gate.tasks ? 'PASS' : 'FAIL'}; agreement ${report.gate.agreement ? 'PASS' : 'FAIL'}; false successes ${report.gate.falseSuccess ? 'PASS' : 'FAIL'}.`, '',
  ].join('\n');
};

const manifestPath = (resultsDir: string): string => path.join(resultsDir, MANIFEST_NAME);
const runPath = (resultsDir: string): string => path.join(resultsDir, RUN_NAME);
const loadManifest = (resultsDir: string): AuditManifest => JSON.parse(readFileSync(manifestPath(resultsDir), 'utf8')) as AuditManifest;
export const loadAuditRuns = (resultsDir = DEFAULT_RESULTS): AuditRun[] => !existsSync(runPath(resultsDir)) ? [] : readFileSync(runPath(resultsDir), 'utf8').split(/\r?\n/).flatMap((line) => {
  try { return line ? [JSON.parse(line) as AuditRun] : []; } catch { return []; }
});

export async function runAudit(manifest: AuditManifest, resultsDir = DEFAULT_RESULTS, concurrency = Number(process.env.AUDIT_CONCURRENCY ?? 4)): Promise<void> {
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error('AUDIT_CONCURRENCY must be a positive integer.');
  const done = new Map(loadAuditRuns(resultsDir).map((run) => [run.id, run]));
  const pending = manifest.selected.filter((packet) => !done.has(packet.id));
  const saved = new Map<string, SavedBenchmark>();
  const getSaved = (source: string): SavedBenchmark => {
    const found = saved.get(source);
    if (found) return found;
    const loaded = JSON.parse(readFileSync(path.join(resultsDir, `${source}.json`), 'utf8')) as SavedBenchmark;
    saved.set(source, loaded);
    return loaded;
  };
  let next = 0;
  let failed = 0;
  const status = (): void => {
    const runs = [...done.values()];
    const summary = summarizeAudit(manifest, runs);
    console.log(`audit judged ${runs.length}/${manifest.selected.length}  agree ${summary.agreement}  disagree ${runs.length - summary.agreement}  false-success ${summary.falseSuccesses}`);
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, pending.length) }, async () => {
    while (next < pending.length) {
      const packet = pending[next++]!;
      let report: Awaited<ReturnType<typeof judgeBenchmark>>;
      try {
        report = await judgeBenchmark(packet.source, {
        provider: AUDIT_PROVIDER, ...(AUDIT_PROVIDER === 'codex' ? { model: 'gpt-6.1-sol', reasoning: 'high' as const } : {}), resultsDir, saved: getSaved(packet.source),
        runKeys: new Set([`${packet.task}|${packet.approach}|${packet.run}`]), write: false,
        freshScreenshots: false, requireSavedEvidence: true, disableDeterministic: true, disableChecks: true, quiet: true,
        });
      } catch (error) {
        console.error(`audit error ${packet.id}: ${error instanceof Error ? error.message : error}`);
        continue;
      }
      const judged = report.runs[0];
      const skipped = report.skipped[0];
      if (/^judge error/.test(judged?.reason ?? skipped?.reason ?? '')) {
        failed += 1; // infrastructure failure (usage limit, missing binary): leave unrecorded so a rerun retries it
        if (failed === 1 || failed % 20 === 0) console.error(`audit infra error x${failed}: ${(judged?.reason ?? skipped?.reason ?? '').replace(/\s+/g, ' ').slice(-220)}`);
        if (failed >= 5 && !done.size) { next = pending.length; }
        continue;
      }
      const run: AuditRun = {
        ...packet,
        verdict: judged?.verdict ?? 'unsure', reason: judged?.reason ?? skipped?.reason ?? 'Judge returned no verdict.',
        ...(judged?.judgeModel ? { judgeModel: judged.judgeModel } : {}), completedAt: new Date().toISOString(),
      };
      appendFileSync(runPath(resultsDir), `${JSON.stringify(run)}\n`);
      done.set(run.id, run);
      status();
    }
  }));
}

export function writeAuditReport(manifest: AuditManifest, runs: readonly AuditRun[], resultsDir = DEFAULT_RESULTS): AuditSummary {
  const report = summarizeAudit(manifest, runs);
  writeFileSync(path.join(resultsDir, `judge-audit${TAG}.json`), JSON.stringify({ manifest, report }, null, 2));
  writeFileSync(path.join(resultsDir, `judge-audit${TAG}.md`), renderReport(manifest, report));
  console.log(`audit ${report.gate.pass ? 'PASS' : 'FAIL'}  packets ${report.packets}/100  tasks ${report.tasks}/30  agreement ${percent(report.agreementRate)}  false-success ${report.falseSuccesses}/${report.goldFailures}`);
  return report;
}

async function main(): Promise<void> {
  const command = process.argv[2];
  const resultsDir = process.env.AUDIT_RESULTS_DIR ?? DEFAULT_RESULTS;
  if (command === 'select') {
    const seed = Number(process.env.AUDIT_SEED ?? 1);
    if (!Number.isInteger(seed)) throw new Error('AUDIT_SEED must be an integer.');
    // Packets of excluded or unknown tasks cannot go through judgeBenchmark, so they are not eligible.
    const judgeable = new Set([...loadRealsiteRows(), ...LIVE_V1_SCORED_ROWS, ...LONG_LIVE_V1_SCORED_ROWS].map((row) => row.task_id));
    const prefix = process.env.AUDIT_PREFIX ?? '';
    const eligible = loadAvailablePackets(resultsDir).filter((packet) => judgeable.has(packet.task) && packet.task.startsWith(prefix) && (!process.env.AUDIT_SOURCE || packet.source.includes(process.env.AUDIT_SOURCE)));
    // AUDIT_ALL=1 audits every eligible packet instead of a stratified sample (used to rescore a whole set under the audit judge).
    const manifest = buildAuditManifest(eligible, seed, process.env.AUDIT_ALL === '1' ? eligible.length : TARGET);
    writeFileSync(manifestPath(resultsDir), JSON.stringify(manifest, null, 2));
    console.log(`audit selected ${manifest.selected.length}/${manifest.target}  available ${manifest.available.packets}  tasks ${manifest.available.tasks}  success ${manifest.available.successes}  failure ${manifest.available.failures}`);
  } else if (command === 'run') {
    await runAudit(loadManifest(resultsDir), resultsDir);
  } else if (command === 'report') {
    writeAuditReport(loadManifest(resultsDir), loadAuditRuns(resultsDir), resultsDir);
  } else {
    throw new Error('Usage: judge-audit.ts select | run | report');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
}
