#!/usr/bin/env node
/**
 * Model-free A/B of Mantis `type` latency on local fixtures (loopback server, no network).
 * Example: node bench/type-latency-ab.mjs --builds new=.tmp-ab/ab-new,fix=.tmp-ab/ab-fix --reps 8
 * Fixtures: a typeahead request that never touches the DOM (the case the request grace targets),
 * a typeahead that renders after 600ms (near miss: must still be waited for), and a plain input.
 */
import { createServer } from 'node:http';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const REPO = path.resolve(import.meta.dirname, '..');
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const reps = Number(args.get('--reps') ?? 8);
const out = path.resolve(args.get('--out') ?? path.join(REPO, 'bench/results/type-latency-ab.json'));
const builds = (args.get('--builds') ?? 'new=.tmp-ab/ab-new,fix=.tmp-ab/ab-fix').split(',').map((e) => {
  const [label, dir] = e.split('=');
  return { label, dir: path.resolve(REPO, dir) };
});

const FIXTURES = {
  'hanging-request': {
    html: `<input aria-label="Search" oninput="fetch('/slow?ms=2800')">`,
    expectText: null,
  },
  'rendered-in-600ms': {
    html: `<input aria-label="Search" oninput="fetch('/slow?ms=600').then(() => document.body.append('Suggestion list'))">`,
    expectText: 'Suggestion list',
  },
  'plain-input': { html: `<input aria-label="Search">`, expectText: null },
};

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/slow') {
    setTimeout(() => { res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok'); }, Number(url.searchParams.get('ms') ?? 1000));
    return;
  }
  const f = FIXTURES[url.pathname.slice(1)];
  if (!f) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(`<!doctype html><body>${f.html}</body>`);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const idOf = (view, needle) => {
  for (const line of view.split('\n')) {
    const m = line.match(/#(\d+) \w+ /);
    if (m && line.includes(needle)) return Number(m[1]);
  }
  throw new Error(`"${needle}" not found in view:\n${view}`);
};
const median = (xs) => { const a = [...xs].sort((x, y) => x - y); return a[Math.floor((a.length - 1) / 2)]; };
const p90 = (xs) => { const a = [...xs].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.ceil(a.length * 0.9) - 1)]; };

const classes = {};
for (const b of builds) classes[b.label] = (await import(pathToFileURL(path.join(b.dir, 'dist/index.js')).href)).MantisBrowser;

const results = {};
for (const name of Object.keys(FIXTURES)) {
  results[name] = Object.fromEntries(builds.map((b) => [b.label, { ms: [], rendered: [] }]));
  for (let rep = 0; rep < reps; rep++) {
    const order = rep % 2 ? [...builds].reverse() : builds; // rotate so neither build always goes first
    for (const b of order) {
      const m = new classes[b.label]({ actionTimeoutMs: 3000 });
      try {
        const view = await m.open(`${base}/${name}`);
        const id = idOf(view, 'textbox "Search"');
        const start = performance.now();
        const text = await m.type(id, 'query');
        const ms = performance.now() - start;
        results[name][b.label].ms.push(Math.round(ms));
        results[name][b.label].rendered.push(FIXTURES[name].expectText ? text.includes(FIXTURES[name].expectText) : null);
      } finally { await m.close(); }
      process.stdout.write(`\rtype-ab ${name} ${rep + 1}/${reps}`.padEnd(44));
    }
  }
}
server.close();
process.stdout.write('\n');

const lines = ['| Fixture | Build | n | median ms | p90 ms | result shown |', '|---|---|---:|---:|---:|---|'];
for (const [name, byBuild] of Object.entries(results)) {
  for (const b of builds) {
    const r = byBuild[b.label];
    const shown = r.rendered[0] === null ? 'n/a' : `${r.rendered.filter(Boolean).length}/${r.rendered.length}`;
    lines.push(`| ${name} | ${b.label} | ${r.ms.length} | ${median(r.ms)} | ${p90(r.ms)} | ${shown} |`);
  }
}
const md = lines.join('\n');
writeFileSync(out, JSON.stringify(results, null, 2));
writeFileSync(out.replace(/\.json$/, '.md'), `# Type latency A/B\n\nBuilds: ${builds.map((b) => `${b.label}=${b.dir}`).join(', ')}. ${reps} reps per cell, build order rotated, loopback fixtures.\n\n${md}\n`);
console.log(md);
