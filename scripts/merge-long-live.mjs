import fs from 'node:fs';
const r = (n) => JSON.parse(fs.readFileSync(`bench/results/long-live-v1-${n}-judged.json`, 'utf8')).runs ?? [];
for (const [m, order] of [['luna', ['main','rerun2','rerun3','rerun5','rerun6','rerun7']], ['haiku', ['main','rerun2','rerun3','rerun5','rerun7']]]) {
  const map = new Map();
  for (const n of order) {
    let rows; try { rows = r(`${n}-${m}`); } catch { continue; }
    for (const x of rows) {
      const k = `${x.task}|${x.approach}|${x.run}`;
      if ((n === 'rerun3' || n === 'rerun7') && map.get(k)?.verdict === 'success') continue;
      map.set(k, { ...x, src: n });
    }
  }
  const t = {};
  for (const x of map.values()) { const a = (t[x.approach] ??= {}); a[x.verdict] = (a[x.verdict] ?? 0) + 1; a.n = (a.n ?? 0) + 1; }
  console.log(m, JSON.stringify(t));
  const bad = [...map.values()].filter((x) => x.verdict !== 'success').map((x) => `${x.approach} ${x.task.replace('longlive-','')} r${x.run} ${x.verdict} [${x.src}]`).sort();
  console.log(bad.join('\n'));
}
