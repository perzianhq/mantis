/**
 * Isolated, fresh fixtures for a future project-tool A/B evaluation.  This is
 * deliberately neither local-v2 development nor the final local-v2 held-out
 * benchmark: no normal selector imports this module.
 */
import type { DevelopmentFixtureRouter, FixtureCheck, FixtureCheckEntry, FixtureObservation } from './fixtures.js';

export type ProjectEvalDomain = 'table' | 'feed' | 'chart';
export interface ProjectEvalCase {
  id: string;
  domain: ProjectEvalDomain;
  family: string;
  structuralVariant: string;
  seed: number;
  split: 'project-eval';
  route: string;
  prompt: (base: string) => string;
  expected: { answer: string; state: Record<string, unknown> };
  oracleId: string;
  nearMiss: { id: string; answer: string; state: Record<string, unknown> };
  check: FixtureCheck;
}

const state = (events: FixtureObservation[]) => events.filter((event) => event.kind === 'settled').at(-1)?.fixtureState;
const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);
const normalized = (answer: string) => answer.replace(/^\s*final(?: answer)?:\s*/i, '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const check = (expected: Record<string, unknown>): FixtureCheck => (events) => ({ ok: same(state(events), expected), details: 'required visible workflow state was not reached' });
const grade = (entry: ProjectEvalCase, answer: string, events: FixtureObservation[]) => {
  const answers = answer.split(/\r?\n/).map(normalized).filter(Boolean);
  const answerOk = answers.length === 1 && answers[0] === normalized(entry.expected.answer);
  const stateOk = same(state(events), entry.expected.state);
  return answerOk && stateOk ? { ok: true } : { ok: false, details: !answerOk ? 'answer must be exactly one expected final answer' : 'required visible workflow state was not reached' };
};
const page = (title: string, body: string, script: string) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>body{font:15px/1.45 system-ui,sans-serif;margin:20px;max-width:900px}button{font:inherit;margin:5px}.wide{max-width:430px;overflow:auto;border:1px solid #789}.nested{height:190px;overflow:auto;border:2px solid #567;padding:6px}.feed button{display:block;width:100%;text-align:left;padding:8px}.hidden{display:none}table{border-collapse:collapse;min-width:760px}th,td{padding:7px 11px;border-bottom:1px solid #ddd;text-align:left;white-space:nowrap}svg{border:1px solid #789;background:#fbfdff}</style></head><body>${body}<script>${script}</script></body></html>`;

/** All fixture data, including the answer target, is reproducibly derived from its declared seed. */
const seeded = (seed: number, salt: number, minimum: number, maximum: number): number => {
  let value = (seed ^ Math.imul(salt + 1, 0x9e3779b9)) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b) >>> 0;
  return minimum + (value % (maximum - minimum + 1));
};
const wideData = (seed: number) => ({ record:`rq-${seeded(seed, 1, 40, 79)}`, score:seeded(seed, 2, 82, 98), nearby:seeded(seed, 3, 45, 75) });
const pageData = (seed: number) => ({ batch:`batch-${seeded(seed, 1, 20, 39)}`, units:seeded(seed, 2, 31, 49), nearby:seeded(seed, 3, 12, 28) });
const nestedData = (seed: number) => ({ number:seeded(seed, 1, 15, 20) });
const dispatchData = (seed: number) => ({ number:seeded(seed, 1, 26, 32) });
const seriesData = (seed: number) => ({ week:seeded(seed, 1, 33, 46), offset:seeded(seed, 2, 1, 67) });
const svgData = (seed: number) => ({ value:seeded(seed, 1, 68, 88) });
const WIDE = wideData(61001);
const PAGED = pageData(61002);
const NESTED = nestedData(62001);
const DISPATCH = dispatchData(62002);
const SERIES = seriesData(63001);
const SERIES_VALUE = 20 + (((SERIES.week - 1) * 17 + SERIES.offset) % 71);
const SVG = svgData(63002);

const wideReordered = (seed: number): string => { const data=wideData(seed); return page('Project evaluation — reordered wide table', `<main><h1>Quarterly request ledger</h1><p>Use the visible sort control before reporting the selected request.</p><button id="sort">Sort score descending</button><div class="wide"><table id="ledger"><thead><tr><th>Record</th><th>Owner</th><th>Region</th><th>Notes</th><th>Score</th><th>Review</th></tr></thead><tbody id="rows"></tbody></table></div></main>`, `
const rows=[['rq-19','Iris','West','Routine','${data.nearby}','Open'],['${data.record}','Mina','North','Escalated','${data.score}','Review'],['rq-08','Dax','South','Routine','73','Open'],['rq-63','Oren','East','Deferred','62','Open']];let sorted=false;function render(){const shown=sorted?[...rows].sort((a,b)=>Number(b[4])-Number(a[4])):rows;rowsEl.innerHTML=shown.map(r=>'<tr><th>'+r[0]+'</th>'+r.slice(1).map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('');window.__fixtureState={case:'wide-reorder',sorted}}const rowsEl=document.querySelector('#rows');sort.onclick=()=>{sorted=true;render()};render();`); };

const nativePaged = (seed: number): string => { const data=pageData(seed); return page('Project evaluation — native table pages', `<main><h1>Shipment batches</h1><p>Use the native next-page control; only the current page is rendered.</p><button id="prev" disabled>Previous page</button><span id="page" aria-live="polite"></span><button id="next">Next page</button><table id="batches"><thead><tr><th>Batch</th><th>Depot</th><th>Units</th></tr></thead><tbody id="rows"></tbody></table></main>`, `
const all=[[['batch-04','Harbor','18'],['batch-08','North','${data.nearby}']],[['${data.batch}','Ridge','${data.units}'],['batch-25','Delta','16']]];let p=0;function render(){rows.innerHTML=all[p].map(r=>'<tr><th>'+r[0]+'</th><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('');page.textContent='Page '+(p+1)+' of 2';prev.disabled=p===0;next.disabled=p===1;window.__fixtureState={case:'native-pages',page:p+1}}prev.onclick=()=>{p=0;render()};next.onclick=()=>{p=1;render()};render();`); };

const nestedGrouped = (seed: number): string => { const data=nestedData(seed), target=`incident-${String(data.number).padStart(2,'0')}`; return page('Project evaluation — grouped nested feed', `<main><h1>Nested incident inbox</h1><p>Choose the South group, then use its actual nested list action.</p><label>Incident group <select id="group"><option>North</option><option>South</option></select></label><section id="inbox" class="nested" aria-label="Incident inbox"><h2 id="heading"></h2><ol id="incident-list" class="feed"></ol></section><p id="receipt" role="status"></p></main>`, `
const target='${target}',south=Array.from({length:10},(_,i)=>({id:'incident-'+String(${data.number}-5+i).padStart(2,'0'),title:'Incident '+String(${data.number}-5+i).padStart(2,'0')})),north=Array.from({length:9},(_,i)=>({id:'incident-n'+String(i+1).padStart(2,'0'),title:'North incident '+String(i+1).padStart(2,'0')}));const groupEl=document.querySelector('#group'),headingEl=document.querySelector('#heading'),listEl=document.querySelector('#incident-list'),receiptEl=document.querySelector('#receipt');function render(){const rows=groupEl.value==='South'?south:north;headingEl.textContent=groupEl.value+' incident group';listEl.innerHTML=rows.map(x=>'<li><button data-id="'+x.id+'">'+x.title+' — acknowledge</button></li>').join('');window.__fixtureState={case:'nested-grouped',group:groupEl.value,acknowledged:null}}groupEl.onchange=render;listEl.onclick=e=>{const b=e.target.closest('button');if(!b)return;window.__fixtureState={case:'nested-grouped',group:groupEl.value,acknowledged:b.dataset.id};receiptEl.textContent=b.dataset.id+' acknowledged.'};render();`); };

const recycledFeed = (seed: number): string => { const lane=(seed % 9) + 1; return page('Project evaluation — recycled dispatch feed', `<main><h1>Dispatch feed</h1><p>Scroll the visible feed to the requested dispatch; the rows are recycled.</p><section id="feed" class="nested feed" aria-label="Dispatch feed"><div id="spacer" style="position:relative"></div></section><p id="receipt" role="status"></p></main>`, `
const items=Array.from({length:36},(_,i)=>({id:'dispatch-'+String(i+1).padStart(2,'0'),title:'Dispatch '+String(i+1).padStart(2,'0')+' — lane '+((i+${lane})%9+1)}));const box=document.querySelector('#feed'),spacer=document.querySelector('#spacer'),row=42;spacer.style.height=(items.length*row)+'px';function render(){const first=Math.max(0,Math.floor(box.scrollTop/row)-2),last=Math.min(items.length,first+7);spacer.innerHTML=items.slice(first,last).map((x,i)=>'<button style="position:absolute;top:'+((first+i)*row)+'px;left:0;height:'+row+'px" data-id="'+x.id+'">'+x.title+' — pin</button>').join('')}box.onscroll=render;box.onclick=e=>{const b=e.target.closest('button');if(!b)return;window.__fixtureState={case:'recycled-feed',pinned:b.dataset.id};receipt.textContent=b.dataset.id+' pinned.'};window.__fixtureState={case:'recycled-feed',pinned:null};render();`); };

const longSeries = (seed: number): string => { const data=seriesData(seed); return page('Project evaluation — exposed long series', `<main><h1>60-week capacity series</h1><p>Reveal the approved chart before reading its currently rendered data.</p><button id="reveal">Reveal approved series</button><canvas id="series" class="hidden" width="640" height="260" aria-label="Approved 60-week capacity chart"></canvas><p id="receipt" role="status"></p></main>`, `
const labels=Array.from({length:60},(_,i)=>'Week '+String(i+1).padStart(2,'0')),values=labels.map((_,i)=>20+((i*17+${data.offset})%71));const canvas=document.querySelector('#series');window.Chart={getChart:n=>n===canvas?{data:{labels,datasets:[{label:'Approved capacity',data:values}]},config:{type:'line'}}:null};window.__fixtureState={case:'long-series',exposed:false};reveal.onclick=()=>{canvas.classList.remove('hidden');window.__fixtureState={case:'long-series',exposed:true};receipt.textContent='Approved series visible.'};`); };

const svgSelection = (seed: number): string => { const data=svgData(seed); return page('Project evaluation — rendered SVG selection', `<main><h1>Meridian monthly chart</h1><p>Select the visible April Meridian point before reporting the receipt.</p><svg id="chart" role="img" aria-label="Meridian monthly chart" width="520" height="220" viewBox="0 0 520 220"><text x="30" y="30">Meridian monthly values</text><text x="80" y="190">Jan ${data.value-45}</text><text x="185" y="170">Feb ${data.value-32}</text><text x="290" y="145">Mar ${data.value-18}</text><text x="395" y="115">Apr ${data.value}</text><circle cx="420" cy="105" r="8" fill="#1769aa"></circle></svg><button id="select">Select April Meridian</button><p id="receipt" role="status"></p></main>`, `window.__fixtureState={case:'svg-selection',selected:false};select.onclick=()=>{window.__fixtureState={case:'svg-selection',selected:true};receipt.textContent='April Meridian selected: ${data.value} units.'};`); };

const cases: ProjectEvalCase[] = [
  { id:'project-eval-table-wide-reorder',domain:'table',family:'wide-reordered',structuralVariant:'horizontal dense table with an explicit client sort',seed:61001,split:'project-eval',route:'/project-eval/table/wide-reorder',prompt:b=>`Open ${b}/project-eval/table/wide-reorder. Sort the request ledger by score descending. For ${WIDE.record}, in the Score column, report exactly: record | column | value.`,expected:{answer:`${WIDE.record} | Score | ${WIDE.score}`,state:{case:'wide-reorder',sorted:true}},oracleId:'project-eval-table-wide-reorder-oracle',nearMiss:{id:'project-eval-table-wide-reorder-wrong-column',answer:`${WIDE.record} | Review | Review`,state:{case:'wide-reorder',sorted:true}},check:check({case:'wide-reorder',sorted:true})},
  { id:'project-eval-table-native-pages',domain:'table',family:'native-pagination',structuralVariant:'only one native table page is rendered at a time',seed:61002,split:'project-eval',route:'/project-eval/table/native-pages',prompt:b=>`Open ${b}/project-eval/table/native-pages. Go to the page containing ${PAGED.batch}. In the Units column, report exactly: batch | column | value.`,expected:{answer:`${PAGED.batch} | Units | ${PAGED.units}`,state:{case:'native-pages',page:2}},oracleId:'project-eval-table-native-pages-oracle',nearMiss:{id:'project-eval-table-native-pages-wrong-column',answer:`${PAGED.batch} | Depot | Ridge`,state:{case:'native-pages',page:2}},check:check({case:'native-pages',page:2})},
  { id:'project-eval-feed-nested-grouped',domain:'feed',family:'nested-grouped',structuralVariant:'nested grouped list requires a native group selection before its actual list action',seed:62001,split:'project-eval',route:'/project-eval/feed/nested-grouped',prompt:b=>`Open ${b}/project-eval/feed/nested-grouped. Choose the South incident group, acknowledge Incident ${NESTED.number}, and report the receipt exactly.`,expected:{answer:`incident-${String(NESTED.number).padStart(2,'0')} acknowledged.`,state:{case:'nested-grouped',group:'South',acknowledged:`incident-${String(NESTED.number).padStart(2,'0')}`}},oracleId:'project-eval-feed-nested-grouped-oracle',nearMiss:{id:'project-eval-feed-nested-grouped-neighbor',answer:`incident-${String(NESTED.number-1).padStart(2,'0')} acknowledged.`,state:{case:'nested-grouped',group:'South',acknowledged:`incident-${String(NESTED.number-1).padStart(2,'0')}`}},check:check({case:'nested-grouped',group:'South',acknowledged:`incident-${String(NESTED.number).padStart(2,'0')}`})},
  { id:'project-eval-feed-recycled-dispatch',domain:'feed',family:'recycled-dispatch',structuralVariant:'feed virtualizer replaces offscreen dispatch action provenance',seed:62002,split:'project-eval',route:'/project-eval/feed/recycled-dispatch',prompt:b=>`Open ${b}/project-eval/feed/recycled-dispatch. Pin Dispatch ${DISPATCH.number} and report the receipt exactly.`,expected:{answer:`dispatch-${String(DISPATCH.number).padStart(2,'0')} pinned.`,state:{case:'recycled-feed',pinned:`dispatch-${String(DISPATCH.number).padStart(2,'0')}`}},oracleId:'project-eval-feed-recycled-dispatch-oracle',nearMiss:{id:'project-eval-feed-recycled-dispatch-neighbor',answer:`dispatch-${String(DISPATCH.number-1).padStart(2,'0')} pinned.`,state:{case:'recycled-feed',pinned:`dispatch-${String(DISPATCH.number-1).padStart(2,'0')}`}},check:check({case:'recycled-feed',pinned:`dispatch-${String(DISPATCH.number).padStart(2,'0')}`})},
  { id:'project-eval-chart-long-series',domain:'chart',family:'long-exposed-series',structuralVariant:'hidden canvas becomes an exposed 60-point chart only after the visible approval step',seed:63001,split:'project-eval',route:'/project-eval/chart/long-series',prompt:b=>`Open ${b}/project-eval/chart/long-series. Reveal the approved series, then report exactly: series | week | value for Week ${SERIES.week}.`,expected:{answer:`Approved capacity | Week ${String(SERIES.week).padStart(2,'0')} | ${SERIES_VALUE}`,state:{case:'long-series',exposed:true}},oracleId:'project-eval-chart-long-series-oracle',nearMiss:{id:'project-eval-chart-long-series-neighbor',answer:`Approved capacity | Week ${String(SERIES.week-1).padStart(2,'0')} | ${20 + (((SERIES.week - 2) * 17 + SERIES.offset) % 71)}`,state:{case:'long-series',exposed:true}},check:check({case:'long-series',exposed:true})},
  { id:'project-eval-chart-svg-selection',domain:'chart',family:'rendered-svg-selection',structuralVariant:'rendered SVG labels plus a separate visible selection workflow',seed:63002,split:'project-eval',route:'/project-eval/chart/svg-selection',prompt:b=>`Open ${b}/project-eval/chart/svg-selection. Select April Meridian and report the receipt exactly.`,expected:{answer:`April Meridian selected: ${SVG.value} units.`,state:{case:'svg-selection',selected:true}},oracleId:'project-eval-chart-svg-selection-oracle',nearMiss:{id:'project-eval-chart-svg-selection-unselected',answer:`April Meridian is ${SVG.value} units.`,state:{case:'svg-selection',selected:false}},check:check({case:'svg-selection',selected:true})},
];

export const PROJECT_EVAL_CASES = Object.freeze(cases);
export const PROJECT_EVAL_CHECKS: FixtureCheckEntry[] = PROJECT_EVAL_CASES.map((entry) => ({ taskId:entry.id, check:entry.check }));
export const PROJECT_EVAL_MANIFEST = Object.freeze(PROJECT_EVAL_CASES.map(({ id, domain, family, structuralVariant, seed, route, oracleId, nearMiss }) => ({ id, domain, family, structuralVariant, seed, route, oracleId, nearMissId:nearMiss.id })));
export const PROJECT_EVAL_PROTOCOL = Object.freeze({ namespace:'project-eval', frozen:true, freezeFields:['fixtures','prompts','seeds','oracles','toolCommit','toolConfig'] as const, repeatsPerArm:3, arms:['baseline','project'] as const, randomized:true, runsPerModel:36, resultsNamespace:'project-eval', retiredAfterTuning:true });
const renderers: Record<string, (seed: number) => string> = {
  'project-eval-table-wide-reorder':wideReordered,
  'project-eval-table-native-pages':nativePaged,
  'project-eval-feed-nested-grouped':nestedGrouped,
  'project-eval-feed-recycled-dispatch':recycledFeed,
  'project-eval-chart-long-series':longSeries,
  'project-eval-chart-svg-selection':svgSelection,
};
/** Testable renderer: a different seed changes visible records/targets, never just metadata. */
export const renderProjectEvalFixture = (id: string, seed = PROJECT_EVAL_CASES.find((entry) => entry.id === id)?.seed): string => {
  const render = renderers[id];
  if (!render || seed === undefined) throw new Error(`unknown project-eval fixture ${id}`);
  return render(seed);
};
export const projectEvalRoute: DevelopmentFixtureRouter = (path) => {
  const entry = PROJECT_EVAL_CASES.find((candidate) => candidate.route === path);
  return entry ? { body:renderProjectEvalFixture(entry.id), type:'text/html; charset=utf-8' } : null;
};
export const gradeProjectEvalCase = (id: string, answer: string, events: FixtureObservation[]) => { const entry=PROJECT_EVAL_CASES.find((candidate)=>candidate.id===id); return entry ? grade(entry,answer,events) : {ok:false,details:'unknown project-eval case'}; };
