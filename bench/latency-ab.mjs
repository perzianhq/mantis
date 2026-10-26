#!/usr/bin/env node
/**
 * Model-free MCP replay of recorded Mantis open/read/find calls against N builds.
 * Example: node bench/latency-ab.mjs --builds old=.tmp-ab/ab-old,new=.tmp-ab/ab-new,fix=.tmp-ab/ab-fix
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');
const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (!key.startsWith('--')) throw new Error(`Unexpected argument: ${key}`);
  if (key === '--dry-run') args.set(key, true);
  else {
    const value = process.argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${key} requires a value.`);
    args.set(key, value);
  }
}
const numberArg = (name, fallback, min) => {
  const value = Number(args.get(name) ?? fallback);
  if (!Number.isInteger(value) || value < min) throw new Error(`${name} must be an integer of at least ${min}.`);
  return value;
};
const reps = numberArg('--reps', process.env.LATENCY_AB_REPS ?? 6, 2);
const concurrency = numberArg('--concurrency', process.env.LATENCY_AB_CONCURRENCY ?? 3, 1);
const date = new Date().toISOString().slice(0, 10);
const outFile = path.resolve(args.get('--out') ?? path.join(REPO, `bench/results/latency-ab-${date}.json`));
const summaryFile = outFile.replace(/\.json$/, '.md');
const jobFile = path.join(REPO, '.codex-jobs', 'latency-ab.out.md');
const primaryLogs = path.join(REPO, 'bench/results/agent-logs/latency-ab-luna-new-20261026');
const fallbackLogs = path.join(REPO, '.tmp-ab/ab-new/bench/results/agent-logs/latency-ab-luna-new-20261026');
const suppliedLogs = args.get('--logs') ?? process.env.LATENCY_AB_LOGS;
const logDir = path.resolve(suppliedLogs ?? (existsSync(primaryLogs) ? primaryLogs : fallbackLogs));
const USER_AGENT = process.env.MANTIS_USER_AGENT ?? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.8078.4 Safari/537.36';
const REPLAYABLE = new Set(['open', 'read', 'find']);
const now = () => Number(process.hrtime.bigint()) / 1e6;
const round = (n) => n == null ? null : Math.round(n * 100) / 100;
const quantile = (xs, p) => {
  const a = xs.filter(Number.isFinite).sort((x, y) => x - y);
  if (!a.length) return null;
  const i = (a.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return a[lo] + (a[hi] - a[lo]) * (i - lo);
};
const stats = (xs) => ({ medianMs: round(quantile(xs, .5)), p90Ms: round(quantile(xs, .9)) });
const PAGE_EVALUATE = '() => JSON.stringify({url:location.href,title:document.title,body:(document.body?.innerText||"").slice(0,1200)})';
const ERROR_PAGE = /(access denied|application error|bad gateway|cloudflare|connection (?:is not private|refused|reset|timed out)|gateway timeout|internal server error|just a moment|page not found|privacy error|site can.t be reached|service unavailable|temporarily unavailable|this site can.t be reached|too many requests)/i;

function parseBuilds(spec) {
  const builds = spec.split(',').filter(Boolean).map((entry) => {
    const at = entry.indexOf('=');
    const label = entry.slice(0, at).trim(), dir = entry.slice(at + 1).trim();
    if (at < 1 || !dir || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(label)) throw new Error(`Invalid --builds entry: ${entry}`);
    return { label, dir: path.resolve(dir) };
  });
  if (builds.length < 2) throw new Error('--builds must name at least two builds.');
  if (new Set(builds.map((b) => b.label)).size !== builds.length) throw new Error('--builds labels must be unique.');
  return builds;
}
const builds = parseBuilds(args.get('--builds') ?? process.env.LATENCY_AB_BUILDS ?? 'old=.tmp-ab/ab-old,new=.tmp-ab/ab-new');
const timingBuilds = (args.get('--timing-builds') ?? '').split(',').filter(Boolean);
for (const label of timingBuilds) if (!builds.some((b) => b.label === label)) throw new Error(`Unknown --timing-builds label: ${label}`);

function parseTrace(file) {
  const events = [], bad = [];
  for (const [line, text] of readFileSync(file, 'utf8').split(/\r?\n/).entries()) {
    if (!text.trim()) continue;
    try { events.push(JSON.parse(text)); } catch (error) { bad.push({ line: line + 1, message: String(error) }); }
  }
  const calls = events.flatMap((event) => {
    const item = event?.item;
    if (item?.type !== 'mcp_tool_call' || item.server !== 'mantis' || item.status !== 'completed' || typeof item.tool !== 'string') return [];
    const tool = item.tool.replace(/^mcp__mantis__/, '');
    return REPLAYABLE.has(tool) ? [{ tool, arguments: item.arguments ?? {} }] : [];
  });
  return { calls, bad };
}
function loadTraces(dir) {
  const traces = [];
  for (const file of readdirSync(dir).filter((name) => /^livev1-.+--mantis--1--attempt-1-.+\.jsonl$/.test(name)).sort()) {
    const task = file.match(/^livev1-(.+?)--mantis--/)?.[1];
    const parsed = task && parseTrace(path.join(dir, file));
    if (parsed?.calls.some((call) => call.tool === 'open')) traces.push({ task, file, ...parsed });
  }
  return traces;
}

class McpChild {
  constructor(buildDir, memoryDir, timing) {
    this.pending = new Map(); this.id = 0; this.buffer = ''; this.stderr = ''; this.stderrBuffer = ''; this.timingLines = [];
    const env = { ...process.env, MANTIS_MEMORY_DIR: memoryDir, MANTIS_USER_AGENT: USER_AGENT, MANTIS_NO_HUMAN: '1', MANTIS_HEADLESS: '1' };
    if (timing) env.MANTIS_TIMING = '1'; else delete env.MANTIS_TIMING;
    this.child = spawn(process.execPath, [path.join(buildDir, 'bench/agent/bridge.mjs'), '--mantis-server'], { cwd: buildDir, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true, env });
    this.child.stdout.setEncoding('utf8'); this.child.stderr.setEncoding('utf8');
    this.child.stdout.on('data', (chunk) => this.onData(chunk));
    this.child.stderr.on('data', (chunk) => this.onStderr(chunk));
    this.child.once('error', (error) => this.finish(error));
    this.child.once('exit', (code, signal) => this.finish(new Error(`MCP exited (${code ?? 'null'}, ${signal ?? 'none'}): ${this.stderr.slice(-300)}`)));
  }
  onData(chunk) {
    this.buffer += chunk;
    for (;;) {
      const at = this.buffer.indexOf('\n'); if (at < 0) return;
      const line = this.buffer.slice(0, at); this.buffer = this.buffer.slice(at + 1);
      let message; try { message = JSON.parse(line); } catch { continue; }
      const pending = this.pending.get(String(message.id));
      if (!pending) continue;
      this.pending.delete(String(message.id)); clearTimeout(pending.timer);
      message.error ? pending.reject(new Error(message.error.message ?? JSON.stringify(message.error))) : pending.resolve(message.result);
    }
  }
  onStderr(chunk) {
    this.stderr += chunk; this.stderrBuffer += chunk;
    for (;;) {
      const at = this.stderrBuffer.indexOf('\n'); if (at < 0) return;
      const line = this.stderrBuffer.slice(0, at).replace(/\r$/, ''); this.stderrBuffer = this.stderrBuffer.slice(at + 1);
      if (/^mantis timing /i.test(line)) this.timingLines.push(line);
    }
  }
  finish(error) {
    for (const pending of this.pending.values()) { clearTimeout(pending.timer); pending.reject(error); }
    this.pending.clear();
  }
  request(method, params, timeoutMs = 60000) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(String(id)); reject(new Error(`${method} timed out after ${timeoutMs}ms`)); }, timeoutMs);
      this.pending.set(String(id), { resolve, reject, timer });
      this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  }
  notify(method, params) { this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`); }
  async start() {
    const began = now();
    await this.request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'latency-ab', version: '2' } }, 30000);
    this.notify('notifications/initialized', {});
    await this.request('tools/list', {}, 30000);
    return now() - began;
  }
  async stop() { this.child.stdin.end(); if (!this.child.killed) this.child.kill(); }
}
const textParts = (result) => result?.content?.filter((part) => part?.type === 'text' && typeof part.text === 'string').map((part) => part.text).join('\n') ?? '';
const failed = (result, error) => Boolean(error || result?.isError || result?.content?.some((part) => part?.type === 'text' && /^error:/i.test(part.text ?? '')));
function pageState(result) {
  const text = textParts(result);
  try {
    const value = JSON.parse(text.split('\n').at(-1)), url = String(value?.url ?? ''), title = String(value?.title ?? ''), body = String(value?.body ?? '');
    const error = !/^https?:\/\//i.test(url) ? `non-http URL: ${url || 'empty'}` : !title.trim() ? 'empty title' : ERROR_PAGE.test(title + '\n' + body) ? `error page: ${title}` : null;
    return { ok: !error, url, title, error };
  } catch { return { ok: false, url: null, title: null, error: `unparseable page probe: ${text.slice(-200)}` }; }
}
async function capture(client) {
  const began = now();
  try {
    const result = await client.request('tools/call', { name: 'bench_capture', arguments: { evaluate: PAGE_EVALUATE } }, 30000);
    return { ms: round(now() - began), error: failed(result) ? textParts(result).slice(0, 500) || 'capture error' : null, page: pageState(result) };
  } catch (error) { return { ms: round(now() - began), error: String(error), page: { ok: false, error: 'capture request failed' } }; }
}
async function runArm(build, trace, rep, mode, timing) {
  const started = now(), memoryDir = path.join(REPO, '.tmp-ab', 'memory', `${mode}-${trace.task}-${build.label}-${rep}-${Date.now()}`);
  mkdirSync(memoryDir, { recursive: true });
  const client = new McpChild(build.dir, memoryDir, timing), calls = [];
  let startupMs = null, validPage = true, pageError = null;
  try {
    startupMs = await client.start();
    for (let index = 0; index < trace.calls.length; index++) {
      const operation = trace.calls[index], timingStart = client.timingLines.length, began = now();
      let result, error = null;
      try { result = await client.request('tools/call', { name: operation.tool, arguments: operation.arguments }); } catch (caught) { error = String(caught); }
      const handlerMs = now() - began, timings = client.timingLines.slice(timingStart);
      const observed = await capture(client), ok = !failed(result, error);
      const call = { index, tool: operation.tool, handlerMs: round(handlerMs), captureMs: observed.ms, ok, error: error ?? (!ok ? textParts(result).slice(0, 500) || 'MCP tool returned isError' : null), captureError: observed.error, page: observed.page };
      if (timings.length) call.timing = timings;
      calls.push(call);
      if (!observed.page.ok) { validPage = false; pageError ??= observed.page.error; break; }
    }
  } catch (error) {
    calls.push({ index: -1, tool: '__startup__', handlerMs: null, captureMs: null, ok: false, error: String(error), captureError: null });
    validPage = false; pageError ??= 'MCP startup failed';
  } finally { await client.stop(); rmSync(memoryDir, { recursive: true, force: true }); }
  return { task: trace.task, build: build.label, rep, mode, startupMs: round(startupMs), totalWallMs: round(now() - started), validPage: validPage && calls.length > 0, pageError, calls };
}
async function pool(jobs, count) {
  const results = new Array(jobs.length); let next = 0;
  async function worker() { for (;;) { const i = next++; if (i >= jobs.length) return; results[i] = await jobs[i](); } }
  await Promise.all(Array.from({ length: Math.min(count, jobs.length) }, worker));
  return results;
}
function schedule(traces, count) {
  const queue = [];
  for (const trace of traces) for (let rep = 1; rep <= count; rep++) {
    for (let i = 0; i < builds.length; i++) queue.push({ trace, task: trace.task, rep, build: builds[(i + rep - 1) % builds.length] });
  }
  return queue;
}

function bootstrapRatio(rows, base, label, iterations = 4000) {
  const groups = new Map();
  for (const row of rows) (groups.get(row.task) ?? groups.set(row.task, []).get(row.task)).push(row);
  const taskGroups = [...groups.values()];
  if (taskGroups.length < 2) return { point: null, low: null, high: null };
  const ratio = (sample) => {
    const denominator = quantile(sample.map((row) => row.builds[base].handlerMs), .5);
    const numerator = quantile(sample.map((row) => row.builds[label].handlerMs), .5);
    return denominator && numerator ? numerator / denominator : null;
  };
  const point = ratio(rows), samples = []; let seed = 0x9e3779b9;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (let i = 0; i < iterations; i++) {
    const sample = []; for (let j = 0; j < taskGroups.length; j++) sample.push(...taskGroups[Math.floor(random() * taskGroups.length)]);
    const value = ratio(sample); if (value != null) samples.push(value);
  }
  return { point: round(point), low: round(quantile(samples, .025)), high: round(quantile(samples, .975)) };
}
function summarize(raw) {
  const labels = raw.builds.map((b) => b.label), base = labels[0], common = raw.pairs.filter((row) => !row.skipReason);
  const tools = [...new Set(common.map((row) => row.tool))].sort().map((tool) => {
    const rows = common.filter((row) => row.tool === tool);
    const perBuild = Object.fromEntries(labels.map((label) => [label, stats(rows.map((row) => row.builds[label].handlerMs))]));
    const ratios = Object.fromEntries(labels.slice(1).map((label) => [label, bootstrapRatio(rows, base, label)]));
    return { tool, n: rows.length, builds: perBuild, ratios, regressedOver15Pct: labels.slice(1).some((label) => ratios[label].point > 1.15) };
  });
  const taskTotals = raw.trace.files.map(({ task }) => {
    const rows = raw.taskPairs.filter((row) => row.task === task && !row.skipReason);
    const medianWallMs = Object.fromEntries(labels.map((label) => [label, round(quantile(rows.map((row) => row.builds[label].totalWallMs), .5))]));
    return { task, n: rows.length, medianWallMs, ratios: Object.fromEntries(labels.slice(1).map((label) => [label, medianWallMs[base] ? round(medianWallMs[label] / medianWallMs[base]) : null])) };
  });
  const complete = raw.taskPairs.filter((row) => !row.skipReason), skippedByReason = {};
  for (const row of raw.pairs) if (row.skipReason) skippedByReason[row.skipReason] = (skippedByReason[row.skipReason] ?? 0) + 1;
  return {
    baseline: base, tools, taskTotals,
    startupMs: Object.fromEntries(labels.map((label) => [label, stats(complete.map((row) => row.builds[label].startupMs))])),
    captureMs: Object.fromEntries(labels.map((label) => [label, stats(common.map((row) => row.builds[label].captureMs))])),
    skippedPairs: raw.pairs.filter((row) => row.skipReason).length, skippedTaskPairs: raw.taskPairs.filter((row) => row.skipReason).length, skippedByReason,
    regressions: tools.filter((tool) => tool.regressedOver15Pct).map((tool) => tool.tool),
  };
}
function markdown(result) {
  const labels = result.builds.map((b) => b.label), base = labels[0], ratio = (x) => `${x.point} (${x.low}-${x.high})`;
  const measureHeaders = labels.map((label) => `${label} median/p90 ms`), ratioHeaders = labels.slice(1).map((label) => `${label}/${base} bootstrap 95% CI`);
  const totalHeaders = labels.map((label) => `${label} total-wall median ms`), totalRatios = labels.slice(1).map((label) => `${label}/${base}`);
  const lines = [
    '# Latency replay', '',
    `${result.builds.map((b) => `${b.label}: ${b.commit}`).join('; ')}. ${result.trace.tasks} tasks, ${result.repsPerBuild} reps/build, concurrency ${result.concurrency}; build order rotates by rep.`,
    `Common successful calls: ${result.summary.tools.reduce((n, x) => n + x.n, 0)}; symmetric skipped call triples: ${result.summary.skippedPairs}.`,
    result.timingBuilds.length ? `MANTIS_TIMING was enabled only for: ${result.timingBuilds.join(', ')}. It is diagnostic and not part of the primary comparison.` : 'MANTIS_TIMING was disabled for all builds so diagnostic timing does not skew the comparison.', '',
    `| Tool | n | ${[...measureHeaders, ...ratioHeaders, '>15%'].join(' | ')} |`,
    `|---|---:|${[...measureHeaders, ...ratioHeaders, '>15%'].map(() => '---:').join('|')}|`,
    ...result.summary.tools.map((x) => `| ${x.tool} | ${x.n} | ${[...labels.map((label) => `${x.builds[label].medianMs}/${x.builds[label].p90Ms}`), ...labels.slice(1).map((label) => ratio(x.ratios[label])), x.regressedOver15Pct ? 'yes' : 'no'].join(' | ')} |`),
    '', `CLI startup median/p90 ms: ${labels.map((label) => `${label} ${result.summary.startupMs[label].medianMs}/${result.summary.startupMs[label].p90Ms}`).join(', ')}.`,
    `Capture median/p90 ms: ${labels.map((label) => `${label} ${result.summary.captureMs[label].medianMs}/${result.summary.captureMs[label].p90Ms}`).join(', ')}.`,
    `Result: ${result.summary.regressions.length ? `regression signal in ${result.summary.regressions.join(', ')}.` : 'no per-tool median regression above 15%.'}`,
    `Skipped (symmetric): ${result.summary.skippedPairs} call triples; ${result.summary.skippedTaskPairs} task-rep groups. Reasons: ${JSON.stringify(result.summary.skippedByReason)}.`, '',
    `| Task | paired reps | ${[...totalHeaders, ...totalRatios].join(' | ')} |`,
    `|---|---:|${[...totalHeaders, ...totalRatios].map(() => '---:').join('|')}|`,
    ...result.summary.taskTotals.map((x) => `| ${x.task} | ${x.n} | ${[...labels.map((label) => x.medianWallMs[label]), ...labels.slice(1).map((label) => x.ratios[label])].join(' | ')} |`),
  ];
  return `${lines.join('\n')}\n`;
}
function writeResult(result) {
  mkdirSync(path.dirname(outFile), { recursive: true }); mkdirSync(path.dirname(jobFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(result, null, 2)); writeFileSync(summaryFile, markdown(result));
  const job = ['# Latency replay job', '', `- Result: ${path.relative(REPO, outFile)}`, `- Summary: ${path.relative(REPO, summaryFile)}`,
    `- Builds: ${result.builds.map((b) => `${b.label}@${b.commit.slice(0, 7)}`).join(', ')}; ${result.trace.tasks} tasks; ${result.repsPerBuild} reps/build; concurrency ${result.concurrency}; rotated build order.`,
    `- Recorded source: one Mantis run-1 trace per task (${result.trace.calls} replayable calls: open/read/find only); no model/API calls.`,
    `- Live-page validation: ${result.preflight.filter((x) => x.accepted).length}/${result.trace.tasks} tasks accepted on every build before timing; failed triples are symmetrically excluded.`,
    `- Common successful call triples: ${result.summary.tools.reduce((n, x) => n + x.n, 0)}; symmetric skips: ${result.summary.skippedPairs}.`,
    `- MANTIS_TIMING builds: ${result.timingBuilds.length ? result.timingBuilds.join(', ') : 'none'} (diagnostic only).`,
    `- Regression >15%: ${result.summary.regressions.length ? result.summary.regressions.join(', ') : 'none'}.`];
  writeFileSync(jobFile, `${job.join('\n')}\n`);
}

if (args.has('--dry-run')) {
  const sample = [{ task: 'dry-task-a' }, { task: 'dry-task-b' }], queue = schedule(sample, 3);
  console.log(`dry-run: 2 tasks x 3 reps x ${builds.length} builds; concurrency ${concurrency}`);
  for (const [index, arm] of queue.entries()) console.log(`${String(index + 1).padStart(2, '0')}  task=${arm.task} rep=${arm.rep} build=${arm.build.label}`);
  console.log(`queue arms: ${queue.length}; no browsers or child processes started.`);
  process.exit(0);
}
if (args.has('--summarize')) {
  const result = JSON.parse(readFileSync(path.resolve(args.get('--summarize')), 'utf8'));
  result.summary = summarize(result); writeResult(result);
  console.log(JSON.stringify({ outFile, summaryFile, jobFile, regressions: result.summary.regressions }));
  process.exit(0);
}

const allTraces = loadTraces(logDir);
const requestedTask = args.get('--task');
const traces = requestedTask ? allTraces.filter((trace) => trace.task === requestedTask) : allTraces;
if (allTraces.length < 10) throw new Error(`Expected at least 10 parseable Mantis run-1 traces with an open call, found ${allTraces.length} in ${logDir}`);
if (requestedTask && traces.length !== 1) throw new Error(`No unique trace for --task ${requestedTask}`);
for (const build of builds) build.commit = execFileSync('git', ['-C', build.dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

// Preflight only the first open, symmetrically, with the same worker-pool limit.
const preflightJobs = traces.flatMap((trace) => {
  const initial = { ...trace, calls: [trace.calls.find((call) => call.tool === 'open')] };
  return builds.map((build) => async () => ({ task: trace.task, build: build.label, run: await runArm(build, initial, 0, 'preflight', timingBuilds.includes(build.label)) }));
});
const probeRows = await pool(preflightJobs, concurrency), probes = new Map();
for (const probe of probeRows) {
  const row = probes.get(probe.task) ?? { task: probe.task, builds: {} };
  row.builds[probe.build] = probe.run; probes.set(probe.task, row);
}
const preflight = traces.map((trace) => {
  const row = probes.get(trace.task); row.accepted = builds.every((build) => row.builds[build.label]?.validPage);
  if (!row.accepted) console.error(`[latency-ab] preflight skipped ${trace.task}: ${builds.map((build) => `${build.label}=${row.builds[build.label]?.pageError ?? 'missing'}`).join('; ')}`);
  return row;
});
const eligible = traces.filter((trace) => probes.get(trace.task).accepted);
const arms = schedule(eligible, reps);
const runs = await pool(arms.map((arm) => async () => {
  const run = await runArm(arm.build, arm.trace, arm.rep, 'measure', timingBuilds.includes(arm.build.label));
  console.error(`[latency-ab] ${arm.task} ${arm.build.label} ${arm.rep}/${reps}: ${run.totalWallMs}ms`);
  return run;
}), concurrency);
const byKey = new Map(runs.map((run) => [`${run.task}\0${run.build}\0${run.rep}`, run]));
const runFor = (task, label, rep) => byKey.get(`${task}\0${label}\0${rep}`);
const pairs = [], taskPairs = [];
for (const trace of traces) for (let rep = 1; rep <= reps; rep++) {
  const armsByBuild = Object.fromEntries(builds.map((build) => [build.label, runFor(trace.task, build.label, rep)]));
  const incomplete = (run) => !run || !run.validPage || run.calls.length !== trace.calls.length || run.calls.some((call) => !call.ok);
  const taskSkipReason = builds.some((b) => !armsByBuild[b.label]) ? 'preflight-page-invalid' : builds.some((b) => !armsByBuild[b.label].validPage) ? 'replay-page-invalid' : builds.some((b) => incomplete(armsByBuild[b.label])) ? 'tool-replay-failed' : null;
  taskPairs.push({ task: trace.task, rep, builds: armsByBuild, skipReason: taskSkipReason });
  for (let index = 0; index < trace.calls.length; index++) {
    const calls = Object.fromEntries(builds.map((b) => [b.label, armsByBuild[b.label]?.calls.find((call) => call.index === index) ?? { ok: false, error: 'missing replay' }]));
    pairs.push({ task: trace.task, rep, index, tool: trace.calls[index].tool, builds: calls, skipReason: taskSkipReason ?? (builds.some((b) => !calls[b.label].ok) ? 'tool-replay-failed' : null) });
  }
}
const result = {
  generatedAt: new Date().toISOString(), builds, repsPerBuild: reps, concurrency, timingBuilds,
  order: 'worker queue; arms adjacent by task/rep; build labels rotate by rep',
  trace: { source: path.relative(REPO, logDir), selection: 'one --mantis--1 trace per task; open/read/find only; requires open', tasks: traces.length, calls: traces.reduce((n, trace) => n + trace.calls.length, 0), files: traces.map((trace) => ({ task: trace.task, file: trace.file, calls: trace.calls.length, parseErrors: trace.bad.length })) },
  preflight, runs, pairs, taskPairs, summary: null,
};
result.summary = summarize(result);
writeResult(result);
console.log(JSON.stringify({ outFile, summaryFile, jobFile, regressions: result.summary.regressions }));
