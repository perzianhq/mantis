// Replace the whole Haiku Mantis form-selenium-select cell (all 3 runs) in the final judged result with the rerun made after the id/name fix.
import fs from 'node:fs';
const base = JSON.parse(fs.readFileSync('bench/results/long-live-v1-final-haiku-judged.json', 'utf8'));
const fix = JSON.parse(fs.readFileSync('bench/results/long-live-v1-idfix-haiku-judged.json', 'utf8'));
const cell = (x) => x.task === 'longlive-form-selenium-select' && x.approach === 'mantis';
const runs = [...base.runs.filter((x) => !cell(x)), ...fix.runs.filter(cell).map((x) => ({ ...x, src: 'idfix' }))];
fs.writeFileSync('bench/results/long-live-v1-final-merged-haiku-judged.json', JSON.stringify({ ...base, runs }, null, 2));
const t = {};
for (const x of runs) { const a = (t[x.approach] ??= { success: 0, n: 0 }); a.n++; if (x.verdict === 'success') a.success++; }
console.log(JSON.stringify(t));
