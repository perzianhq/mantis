import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const taskId = 'longlive-gutenberg-dickens-search';
const logDir = path.join(root, 'bench', 'results', 'agent-logs', 'long-live-v1-final-luna');
const results = JSON.parse(fs.readFileSync(path.join(root, 'bench', 'results', 'long-live-v1-final-luna.json'), 'utf8'));
const tasks = JSON.parse(fs.readFileSync(path.join(root, 'bench', 'agent', 'long-live-v1-draft.json'), 'utf8'));
const shotsDir = path.join(here, 'shots');
fs.mkdirSync(shotsDir, { recursive: true });

function parseConcatenatedJson(text) {
  const values = [];
  let start = -1, depth = 0, quoted = false, escaped = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (char === '"') { quoted = true; continue; }
    if (char === '{') { if (depth++ === 0) start = i; }
    if (char === '}' && --depth === 0 && start >= 0) values.push(JSON.parse(text.slice(start, i + 1)));
  }
  return values;
}

function findOne(pattern) {
  const matches = fs.readdirSync(logDir).filter((name) => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Expected one log for ${pattern}; found ${matches.length}`);
  return path.join(logDir, matches[0]);
}

function shortUrl(value) {
  try {
    const url = new URL(value);
    return `${url.hostname.replace(/^www\./, '')}${url.pathname === '/' ? '' : url.pathname}`.slice(0, 42);
  } catch { return String(value).slice(0, 42); }
}

function shortArgument(tool, args = {}) {
  if (args.url) return shortUrl(args.url);
  if (args.query) return `“${String(args.query).slice(0, 35)}”`;
  if (args.text) return `“${String(args.text).slice(0, 35)}”`;
  if (args.selector) return String(args.selector).slice(0, 40);
  if (args.ref) return `#${args.ref}`;
  if (args.id !== undefined) return `#${args.id}`;
  if (Array.isArray(args.fields)) return args.fields.map((field) => `“${field.value}”`).join(', ').slice(0, 42);
  if (args.element) return String(args.element).slice(0, 40);
  const entries = Object.entries(args);
  return entries.length ? String(entries[0][1]).slice(0, 42) : 'page state';
}

function streamUsage(pathname) {
  // Codex stream files are concatenated JSON objects rather than newline-delimited JSON.
  const objects = parseConcatenatedJson(fs.readFileSync(pathname, 'utf8'));
  const usage = [];
  for (const object of objects) {
    const candidate = object.usage || object.response?.usage || object.item?.usage || object.item?.response?.usage;
    if (!candidate) continue;
    const input = candidate.input_tokens ?? candidate.inputTokens;
    const cached = candidate.cached_input_tokens ?? candidate.cacheReadTokens ?? 0;
    if (Number.isFinite(input)) usage.push(Number(input) + Number(cached || 0));
  }
  return usage;
}

function pngSize(pathname) {
  const bytes = fs.readFileSync(pathname);
  if (bytes.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not a PNG: ${pathname}`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), bytes: bytes.length };
}

function copyFrames(approach, evidencePath, events, wallMs) {
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  const eventByStep = new Map(events.map((event, index) => [index + 1, event]));
  const frames = evidence.frames.map((frame) => {
    const event = eventByStep.get(frame.step);
    if (!event) throw new Error(`${approach} capture ${frame.file} has no call ${frame.step}`);
    const source = path.join(logDir, frame.file);
    const size = pngSize(source);
    if (size.width > 1280) throw new Error(`${frame.file} is ${size.width}px wide; downscale it before rendering`);
    const suffix = frame.file.endsWith('.final.png') ? 'final' : `step-${String(frame.step).padStart(2, '0')}`;
    const file = `${approach}-${suffix}.png`;
    fs.copyFileSync(source, path.join(shotsDir, file));
    // A capture is shown no earlier than its call returned; the final one at run completion.
    const atMs = frame.file.endsWith('.final.png') ? wallMs : event.resultMs;
    return { call: frame.step, atMs, file: `shots/${file}`, url: frame.url, width: size.width, height: size.height };
  });
  const captured = new Set(frames.map((frame) => frame.call));
  const gaps = events.map((_, index) => index + 1).filter((step) => !captured.has(step));
  console.log(`${approach} captures: ${frames.map((frame) => `call ${frame.call} @ ${(frame.atMs / 1000).toFixed(3)}s -> ${frame.file}`).join('; ')}`);
  console.log(`${approach} gaps: ${gaps.length ? `calls ${gaps.join(', ')}` : 'none'}`);
  return frames;
}

function readRun(approach, run, expected) {
  const stem = `${taskId}--${approach}--${run}--`;
  const longPath = findOne(new RegExp(`^${stem.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}.*\\.long\\.jsonl$`));
  const evidencePath = longPath.replace(/\.long\.jsonl$/, '.evidence.json');
  const streamPath = longPath.replace(/\.long\.jsonl$/, '.jsonl');
  const calls = fs.readFileSync(longPath, 'utf8').trim().split(/\r?\n/).map(JSON.parse).filter((row) => row.kind === 'call');
  const result = results.results.find((row) => row.task === taskId && row.approach === approach && row.run === run);
  if (!result) throw new Error(`Published result is missing for ${approach} run ${run}`);
  const totalTokens = result.totalInputTokens;
  const wallMs = result.timings?.cliWallMs;
  if (calls.length !== expected.calls || totalTokens !== expected.tokens || wallMs !== expected.wallMs) {
    throw new Error(`${approach} totals disagree: calls ${calls.length}, tokens ${totalTokens}, wall ${wallMs}`);
  }
  const startAt = Math.min(...calls.map((call) => call.dispatchedAt));
  const streamTokens = streamUsage(streamPath);
  // The stream has one aggregate usage event for this one-turn agent. It cannot produce a
  // per-call counter, so distribute the authoritative total over call observations.
  const weights = calls.map((call) => Math.max(1, call.observation?.tokensEstimate || 0));
  const weightTotal = weights.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const events = calls.map((call, index) => {
    cumulative += weights[index] / weightTotal * totalTokens;
    return {
      atMs: Math.max(0, call.dispatchedAt - startAt),
      resultMs: Math.max(0, (call.resultAt ?? call.dispatchedAt) - startAt),
      tool: call.tool,
      argument: shortArgument(call.tool, call.arguments),
      observationTokensEstimate: call.observation?.tokensEstimate ?? 0,
      cumulativeTokens: index === calls.length - 1 ? totalTokens : Math.round(cumulative),
    };
  });
  return {
    name: approach === 'mantis' ? 'Mantis' : 'Playwright MCP',
    detail: approach === 'mantis' ? 'Mantis browser view' : '@playwright/mcp 0.0.83 · benchmark configuration; JavaScript tools disabled',
    approach, run, calls: calls.length, totalTokens, wallMs,
    tokenMethod: 'estimated-observation-weighted',
    streamUsageEvents: streamTokens.length,
    events,
    frames: copyFrames(approach, evidencePath, events, wallMs),
  };
}

const task = (Array.isArray(tasks) ? tasks : tasks.tasks).find((row) => row.task_id === taskId);
if (!task?.confirmed_task) throw new Error(`Task prompt missing for ${taskId}`);
const data = {
  taskId,
  taskText: task.confirmed_task,
  source: 'bench/results/agent-logs/long-live-v1-final-luna',
  tokenCounterMethod: 'estimated-observation-weighted',
  runs: [
    readRun('mantis', 2, { calls: 10, tokens: 291952, wallMs: 49756 }),
    readRun('tree', 1, { calls: 22, tokens: 733231, wallMs: 72977 }),
  ],
};
fs.writeFileSync(path.join(here, 'data.json'), `${JSON.stringify(data, null, 2)}\n`);
const shotBytes = fs.readdirSync(shotsDir).filter((name) => name.endsWith('.png')).reduce((total, name) => total + fs.statSync(path.join(shotsDir, name)).size, 0);
if (shotBytes >= 3 * 1024 * 1024) throw new Error(`shots is ${(shotBytes / 1024 / 1024).toFixed(2)} MB; expected under 3 MB`);
console.log(`shots: ${(shotBytes / 1024).toFixed(0)} KiB total`);
for (const run of data.runs) console.log(`${run.name}: ${run.calls} calls, ${run.totalTokens.toLocaleString()} input tokens, ${run.wallMs} ms (${run.tokenMethod})`);
