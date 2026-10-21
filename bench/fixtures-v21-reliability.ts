/**
 * Permanent local-v2.1 reliability fixtures.
 *
 * These routes deliberately use ordinary rendered DOM.  Every benchmark
 * approach opens the same URL and receives the same task prompt; no route
 * depends on a prior capture, tool-specific identifier, or synthetic stale
 * element failure.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type V21ReliabilityDomain =
  | 'regions-reading'
  | 'spa-navigation-recovery'
  | 'forms-embedded-controls'
  | 'charts-canvas-images'
  | 'overlays-shadow-dom';

export type V21ReliabilityFamily =
  | 'inline-prose-tail'
  | 'visible-prose-over-hidden-decoy'
  | 'recycled-control-current-record'
  | 'iframe-shadow-media-fact'
  | 'visible-chart-series-over-hidden-decoy'
  | 'nested-child-action';

export interface V21ReliabilityCase {
  id: string;
  domain: V21ReliabilityDomain;
  family: V21ReliabilityFamily;
  structuralVariant: string;
  seed: number;
  split: 'reliability';
  route: string;
  prompt: (base: string) => string;
  expected: { answer: string; state: Record<string, unknown> };
  oracleId: string;
  nearMiss: { id: string; answer: string; state: Record<string, unknown> };
  check: FixtureCheck;
}

const normalize = (value: string) => value.trim()
  .replace(/^(?:final(?: answer)?|answer):\s*/i, '')
  .replace(/\s+/g, ' ')
  .replace(/[.]$/, '')
  .toLocaleLowerCase();
const exact = (answer: string, expected: string) => normalize(answer) === normalize(expected);
export const matchesV21ReliabilityAnswer = (entry: V21ReliabilityCase, answer: string) =>
  exact(answer, entry.expected.answer)
  // The task asks for the receipt, not its UI label. Keep this scoped to the
  // receipt workflow; the terminal-state check still proves the action.
  || (entry.family === 'recycled-control-current-record' && exact(answer, entry.expected.answer.replace(/^Receipt:\s*/i, '')));
/** Ignore completion snapshots from a document the agent subsequently left. */
const currentDocumentState = (events: FixtureObservation[], loadStateIsTerminal = false) => {
  const documentId = events.filter((event) => event.kind === 'load').at(-1)?.documentId;
  if (!documentId) return events.filter((event) => event.kind === 'settled').at(-1);
  const current = events.filter((event) => event.documentId === documentId);
  // Fact-retrieval tasks have no required interaction, so the latest document's
  // load state is authoritative even if an earlier document previously settled.
  if (loadStateIsTerminal) return current.filter((event) => event.kind === 'load').at(-1);
  // Workflows require a settled snapshot after their requested action.
  const settled = current.filter((event) => event.kind === 'settled').at(-1);
  if (settled) return settled;
  // A load-only document is authoritative only when the run never settled elsewhere; otherwise the agent left a completed document for an unsettled one.
  return events.some((event) => event.kind === 'settled') ? undefined : current.filter((event) => event.kind === 'load').at(-1);
};
const terminal = (state: Record<string, unknown>, loadStateIsTerminal = false): FixtureCheck => (events) =>
  JSON.stringify(currentDocumentState(events, loadStateIsTerminal)?.fixtureState) === JSON.stringify(state);
const page = (title: string, body: string, script = '') =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>body{font:16px/1.5 system-ui,sans-serif;margin:28px;max-width:780px}.card{border:1px solid #8b98a5;border-radius:8px;padding:16px;margin:12px 0}button,input{font:inherit;padding:5px 9px}mark{background:#fff1a8}.chart{border:1px solid #b8c3cf;background:#fbfdff}svg{max-width:100%;height:auto}</style></head><body>${body}<script>${script}</script></body></html>`;

const proseTailPage = () => page('Inline marked report', `<main><h1>Service handoff</h1><p id="report">The morning dispatch reconciled Cinder-214 after the previous route closed. The operations note records routine inventory and ordinary checkpoint details for the loading team. The afternoon review confirms that the packing seal matched the scheduled manifest, the dock supervisor acknowledged the transfer, and the destination ledger remained open until the final reconciliation. The earlier reference Lark-281 belongs to the superseded draft and is not the handoff value. Continue through the end of this report: after the final counter-signature and the release note, the confirmed handoff reference is <mark>Juniper-829</mark>.</p></main>`, `window.__fixtureState={kind:'v21-reliability',family:'inline-prose-tail',source:'current'};`);

const visibleProsePage = () => page('Rendered release note', `<main><h1>Release note</h1><p id="release">The visible rollout region is <strong>Harbor-17</strong>.<span hidden> The visible rollout region is Quarry-91.</span></p><p>The second sentence is intentionally not rendered.</p></main>`, `window.__fixtureState={kind:'v21-reliability',family:'visible-prose-over-hidden-decoy',source:'visible'};`);

const recycledControlPage = () => page('Current task queue', `<main><h1>Current task queue</h1><label>Filter current task <input id="filter" aria-label="Filter current task" value="Birch"></label><button id="refresh">Refresh filtered task</button><section class="card" aria-live="polite"><h2 id="record">Birch-18</h2><p id="detail">A prior task is currently selected.</p><button id="complete">Complete Birch-18</button><p id="out" role="status"></p></section></main>`, `const filter=document.querySelector('#filter'),refresh=document.querySelector('#refresh'),record=document.querySelector('#record'),detail=document.querySelector('#detail'),complete=document.querySelector('#complete'),out=document.querySelector('#out');let current='Birch-18',refreshed=false,wrongEffect=false,completed=null;const state=()=>window.__fixtureState={kind:'v21-reliability',family:'recycled-control-current-record',current,refreshed,completed,wrongEffect};const render=()=>{record.textContent=current;detail.textContent=current==='Cedar-73'?'Current filtered task is ready for completion.':'A prior task is currently selected.';complete.textContent='Complete '+current};state();refresh.addEventListener('click',()=>{const wanted=filter.value.trim().toLowerCase();current=wanted.includes('cedar')?'Cedar-73':'Birch-18';refreshed=true;render();state()});complete.addEventListener('click',()=>{completed=current;wrongEffect=current!=='Cedar-73';state();out.textContent=wrongEffect?'Wrong task completed: '+current+'.':'Receipt: Cedar-73 completed.'});`);

const iframeShadowMediaPage = () => {
  const frame = `<!doctype html><body><media-report></media-report><script>class MediaReport extends HTMLElement{connectedCallback(){const root=this.attachShadow({mode:'open'});root.innerHTML='<figure><img alt="Beacon intensity: 73 lux" src="data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'280\\' height=\\'110\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23e7f5ff\\'/%3E%3Ctext x=\\'20\\' y=\\'60\\' font-size=\\'28\\'%3E73 lux%3C/text%3E%3C/svg%3E"><figcaption>Live beacon reading</figcaption></figure>'}}customElements.define('media-report',MediaReport);<\/script>`;
  return page('Embedded media report', `<main><h1>Beacon report</h1><figure><img alt="Archive beacon intensity: 41 lux" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='70'%3E%3Ctext x='8' y='42'%3Earchive 41 lux%3C/text%3E%3C/svg%3E"><figcaption>Archive image — not the live report</figcaption></figure><iframe title="Live media report" style="width:340px;height:180px;border:1px solid #8b98a5" srcdoc="${frame.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></iframe></main>`, `window.__fixtureState={kind:'v21-reliability',family:'iframe-shadow-media-fact',source:'live-media'};`);
};

const chartSeriesPage = () => page('Visible chart series', `<main><h1>Weekly shipments</h1><figure><canvas id="shipments" width="520" height="220" aria-label="Weekly shipments chart"></canvas><figcaption>Visible series: North — all values are in units.</figcaption></figure></main><script src="/vendor/chart.js"></script>`, `const chart=new Chart(document.querySelector('#shipments'),{type:'line',data:{labels:['Tuesday','Wednesday','Thursday'],datasets:[{label:'North',data:[52,58,64]},{label:'Archive North',data:[77,83,91]}]},options:{animation:false,plugins:{title:{display:true,text:'Weekly shipments'}}}});chart.setDatasetVisibility(1,false);chart.update();window.__fixtureState={kind:'v21-reliability',family:'visible-chart-series-over-hidden-decoy',series:'North',visibleValue:'64 units'};`);

const nestedChildPage = () => page('Request card', `<main><h1>Review requests</h1><article id="request" class="card" role="button" tabindex="0" aria-label="Open Cedar review request"><h2>Cedar review request</h2><p>Opening the card starts the parent review flow.</p><button id="approve">Approve request</button><p id="out" role="status"></p></article></main>`, `const request=document.querySelector('#request'),approve=document.querySelector('#approve'),out=document.querySelector('#out');let childApproved=false,parentOpened=false;const state=()=>window.__fixtureState={kind:'v21-reliability',family:'nested-child-action',childApproved,parentOpened};request.addEventListener('click',()=>{parentOpened=true;state();out.textContent='Parent review opened.'});request.addEventListener('keydown',e=>{if(e.key==='Enter')request.click()});approve.addEventListener('click',e=>{e.stopPropagation();childApproved=true;state();out.textContent='Request approved.'});state();`);

const cases: readonly V21ReliabilityCase[] = [
  { id:'v21-reliability-inline-prose-tail',domain:'regions-reading',family:'inline-prose-tail',structuralVariant:'long inline-marked prose with a superseded earlier reference and the answer at the tail',seed:521101,split:'reliability',route:'/v21/reliability/prose-tail',prompt:b=>`Open ${b}/v21/reliability/prose-tail. Read through the end of the service handoff and report only the confirmed handoff reference.`,expected:{answer:'Juniper-829',state:{kind:'v21-reliability',family:'inline-prose-tail',source:'current'}},oracleId:'v21-reliability-inline-prose-tail-oracle',nearMiss:{id:'v21-reliability-inline-prose-tail-superseded-reference',answer:'Lark-281',state:{kind:'v21-reliability',family:'inline-prose-tail',source:'current'}},check:terminal({kind:'v21-reliability',family:'inline-prose-tail',source:'current'}, true) },
  { id:'v21-reliability-visible-prose',domain:'regions-reading',family:'visible-prose-over-hidden-decoy',structuralVariant:'rendered prose with a conflicting hidden descendant',seed:521102,split:'reliability',route:'/v21/reliability/visible-prose',prompt:b=>`Open ${b}/v21/reliability/visible-prose. Report only the rendered rollout region.`,expected:{answer:'Harbor-17',state:{kind:'v21-reliability',family:'visible-prose-over-hidden-decoy',source:'visible'}},oracleId:'v21-reliability-visible-prose-oracle',nearMiss:{id:'v21-reliability-visible-prose-hidden-descendant',answer:'Quarry-91',state:{kind:'v21-reliability',family:'visible-prose-over-hidden-decoy',source:'visible'}},check:terminal({kind:'v21-reliability',family:'visible-prose-over-hidden-decoy',source:'visible'}, true) },
  { id:'v21-reliability-recycled-control',domain:'spa-navigation-recovery',family:'recycled-control-current-record',structuralVariant:'filter and refresh reuse the same actionable control for a different current record',seed:521103,split:'reliability',route:'/v21/reliability/recycled-control',prompt:b=>`Open ${b}/v21/reliability/recycled-control. Filter to Cedar, refresh the filtered task, complete the current task, and report only the receipt.`,expected:{answer:'Receipt: Cedar-73 completed.',state:{kind:'v21-reliability',family:'recycled-control-current-record',current:'Cedar-73',refreshed:true,completed:'Cedar-73',wrongEffect:false}},oracleId:'v21-reliability-recycled-control-oracle',nearMiss:{id:'v21-reliability-recycled-control-prior-record',answer:'Wrong task completed: Birch-18.',state:{kind:'v21-reliability',family:'recycled-control-current-record',current:'Birch-18',refreshed:false,completed:'Birch-18',wrongEffect:true}},check:terminal({kind:'v21-reliability',family:'recycled-control-current-record',current:'Cedar-73',refreshed:true,completed:'Cedar-73',wrongEffect:false}) },
  { id:'v21-reliability-iframe-shadow-media',domain:'forms-embedded-controls',family:'iframe-shadow-media-fact',structuralVariant:'visible media fact inside a reachable same-origin iframe and open shadow root',seed:521104,split:'reliability',route:'/v21/reliability/iframe-shadow-media',prompt:b=>`Open ${b}/v21/reliability/iframe-shadow-media. In the live media report, report only the beacon intensity with its unit.`,expected:{answer:'73 lux',state:{kind:'v21-reliability',family:'iframe-shadow-media-fact',source:'live-media'}},oracleId:'v21-reliability-iframe-shadow-media-oracle',nearMiss:{id:'v21-reliability-iframe-shadow-media-archive-image',answer:'41 lux',state:{kind:'v21-reliability',family:'iframe-shadow-media-fact',source:'live-media'}},check:terminal({kind:'v21-reliability',family:'iframe-shadow-media-fact',source:'live-media'}, true) },
  { id:'v21-reliability-visible-chart-series',domain:'charts-canvas-images',family:'visible-chart-series-over-hidden-decoy',structuralVariant:'Chart.js visible series after a runtime legend-style visibility change',seed:521105,split:'reliability',route:'/v21/reliability/visible-chart-series',prompt:b=>`Open ${b}/v21/reliability/visible-chart-series. Report only the visible North-series Thursday value with its unit.`,expected:{answer:'64 units',state:{kind:'v21-reliability',family:'visible-chart-series-over-hidden-decoy',series:'North',visibleValue:'64 units'}},oracleId:'v21-reliability-visible-chart-series-oracle',nearMiss:{id:'v21-reliability-visible-chart-series-hidden-series',answer:'91 units',state:{kind:'v21-reliability',family:'visible-chart-series-over-hidden-decoy',series:'North',visibleValue:'64 units'}},check:terminal({kind:'v21-reliability',family:'visible-chart-series-over-hidden-decoy',series:'North',visibleValue:'64 units'}, true) },
  { id:'v21-reliability-nested-child-action',domain:'overlays-shadow-dom',family:'nested-child-action',structuralVariant:'nested child action within an independently actionable parent card',seed:521106,split:'reliability',route:'/v21/reliability/nested-child-action',prompt:b=>`Open ${b}/v21/reliability/nested-child-action. Approve the Cedar request using the nested action without opening the parent review flow, and report only the confirmation.`,expected:{answer:'Request approved.',state:{kind:'v21-reliability',family:'nested-child-action',childApproved:true,parentOpened:false}},oracleId:'v21-reliability-nested-child-action-oracle',nearMiss:{id:'v21-reliability-nested-child-action-parent-card',answer:'Parent review opened.',state:{kind:'v21-reliability',family:'nested-child-action',childApproved:false,parentOpened:true}},check:terminal({kind:'v21-reliability',family:'nested-child-action',childApproved:true,parentOpened:false}) },
];

export const V21_RELIABILITY_CASES = Object.freeze(cases);
export const V21_RELIABILITY_CHECKS = V21_RELIABILITY_CASES.map(({ id, check }) => ({ taskId: id, check }));

export function gradeV21ReliabilityCase(id: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const entry = V21_RELIABILITY_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { ok: false, details: 'unknown v2.1 reliability case' };
  const result = entry.check(events);
  const stateOk = typeof result === 'boolean' ? result : result.ok;
  return matchesV21ReliabilityAnswer(entry, answer) && stateOk
    ? { ok: true }
    : { ok: false, details: !matchesV21ReliabilityAnswer(entry, answer) ? 'answer does not match the v2.1 reliability oracle' : 'terminal state does not match the v2.1 reliability oracle' };
}

export function v21ReliabilityRoute(path: string): { body: string; type: string } | null {
  const entry = V21_RELIABILITY_CASES.find((candidate) => candidate.route === path);
  if (!entry) return null;
  const body: Record<V21ReliabilityFamily, () => string> = {
    'inline-prose-tail': proseTailPage,
    'visible-prose-over-hidden-decoy': visibleProsePage,
    'recycled-control-current-record': recycledControlPage,
    'iframe-shadow-media-fact': iframeShadowMediaPage,
    'visible-chart-series-over-hidden-decoy': chartSeriesPage,
    'nested-child-action': nestedChildPage,
  };
  return { body: body[entry.family](), type: 'text/html; charset=utf-8' };
}
