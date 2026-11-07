/**
 * Delayed-question revisit fixtures (three tasks). The question is withheld until the workflow reaches a gate, so
 * the agent cannot know what to look for while it first reads the pages. Pages only report events and the identity
 * (never the value) of the question target. The checkable answers exist only in this module's oracle tables, which
 * run in the harness process, not in any page served to the agent.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type RevisitFamily = 'accordion-field' | 'visible-field' | 'changing-value';
export interface RevisitProduct {
  id: string; name: string; price: string; blurb: string;
  visible: Readonly<Record<'Brand' | 'Colour' | 'Weight', string>>;
  full: Readonly<Record<string, string>>;
}

export const REVISIT_PRODUCTS: readonly RevisitProduct[] = Object.freeze([
  { id: 'lf-101', name: 'Aster Field Lantern', price: '$48.00', blurb: 'A compact lantern for early starts and late returns.', visible: { Brand: 'Halden', Colour: 'Moss', Weight: '420 g' }, full: { Firmware: '3.14.8', Warranty: '4 years', 'Battery cycles': '680', 'Certification code': 'LC-81Q', 'Serial prefix': 'AS-17', 'Origin plant': 'Plant 7B', 'Charge port': 'USB-C PD', 'Lens material': 'Borosilicate', 'Water rating': 'IP67', 'Thermal limit': '-18 C', 'Service interval': '24 months', 'Batch reference': 'B-441' } },
  { id: 'lf-184', name: 'Bramble Camp Kettle', price: '$36.00', blurb: 'A wide-base kettle designed for quiet camp breakfasts.', visible: { Brand: 'Morrow', Colour: 'Slate', Weight: '610 g' }, full: { Firmware: '2.09.3', Warranty: '3 years', 'Battery cycles': '540', 'Certification code': 'KC-42M', 'Serial prefix': 'BR-62', 'Origin plant': 'Plant 7D', 'Charge port': 'Magnetic dock', 'Lens material': 'Anodised steel', 'Water rating': 'IP54', 'Thermal limit': '-12 C', 'Service interval': '18 months', 'Batch reference': 'K-208' } },
  { id: 'lf-233', name: 'Cairn Trail Radio', price: '$72.00', blurb: 'A weather-ready radio with a clear, low-power display.', visible: { Brand: 'Norell', Colour: 'Ochre', Weight: '285 g' }, full: { Firmware: '5.22.1', Warranty: '5 years', 'Battery cycles': '760', 'Certification code': 'TR-96P', 'Serial prefix': 'CA-38', 'Origin plant': 'Plant 7F', 'Charge port': 'USB-C', 'Lens material': 'Polycarbonate', 'Water rating': 'IP68', 'Thermal limit': '-24 C', 'Service interval': '30 months', 'Batch reference': 'R-673' } },
  { id: 'lf-297', name: 'Dunewick Headlamp', price: '$54.00', blurb: 'A balanced headlamp for map reading and short night walks.', visible: { Brand: 'Vesper', Colour: 'Cinder', Weight: '195 g' }, full: { Firmware: '4.07.6', Warranty: '2 years', 'Battery cycles': '490', 'Certification code': 'DH-55R', 'Serial prefix': 'DU-91', 'Origin plant': 'Plant 7H', 'Charge port': 'Pogo pin', 'Lens material': 'Acrylic', 'Water rating': 'IP65', 'Thermal limit': '-10 C', 'Service interval': '12 months', 'Batch reference': 'H-315' } },
]);
export const REVISIT_IDS = Object.freeze(REVISIT_PRODUCTS.map((product) => product.id));
export const REVISIT_ROUTES = Object.freeze({ history: '/revisit/history', question: '/revisit/question', product: (id: string) => `/revisit/p/${id}`, order: '/revisit/order' });
export const REVISIT_FULL_LABELS = Object.freeze(Object.keys(REVISIT_PRODUCTS[0]!.full));
export const REVISIT_VISIBLE_LABELS = Object.freeze(['Brand', 'Colour', 'Weight'] as const);

/**
 * Changing-value order page. The queried row is one of `span` rows starting at `firstRow` (well below the first
 * screen, well above the end of the page) and its value changes once the Question page is first shown. The two rows
 * beside it carry near-duplicate values; every other row uses dock numbers the target trio never uses.
 */
export const REVISIT_ORDER = Object.freeze({ id: 'LF-90281', rows: 96, firstRow: 56, span: 20, label: 'Carrier scan' });
const CHANGES = Object.freeze([
  { before: 'Dock 7A received', after: 'Dock 7C received', near: ['Dock 7B received', 'Dock 7D received'] as const },
  { before: 'Dock 8B received', after: 'Dock 8D received', near: ['Dock 8A received', 'Dock 8C received'] as const },
]);
export const revisitChangeFor = (row: number) => CHANGES[row % 2]!;
export const revisitRowId = (row: number): string => `LN-${5800 + row}`;
const rowFromId = (id: string): number | null => { const match = /^LN-(\d+)$/.exec(id); const row = match ? Number(match[1]) - 5800 : NaN; return Number.isInteger(row) && row >= REVISIT_ORDER.firstRow && row < REVISIT_ORDER.firstRow + REVISIT_ORDER.span ? row : null; };

const CSS = 'body{font:16px/1.5 system-ui,sans-serif;margin:0;color:#222b35}header,footer{background:#273746;color:#f4f7f8;padding:12px 28px}nav{background:#e7edf0;padding:8px 28px}nav a{margin-right:16px}main{max-width:820px;padding:20px 28px}.card{border:1px solid #9baab5;border-radius:8px;padding:14px;margin:12px 0}table{border-collapse:collapse}th,td{border:1px solid #c7d1d7;padding:5px 10px;text-align:left}button{font:inherit;padding:6px 12px}.panel{margin-top:14px}.event{padding:8px 10px;border-bottom:1px solid #c7d1d7;min-height:42px}';
const STORE = `
var m=location.pathname.match(/^\\/__attempt\\/([A-Za-z0-9_-]+)/);var tok=m?m[1]:(sessionStorage.getItem('__fixture_attempt')||'local');
var KEY='revisit-v1:'+tok;
function load(){try{var s=JSON.parse(sessionStorage.getItem(KEY)||'{}');return{visited:s.visited||[],questionShownAt:s.questionShownAt==null?null:s.questionShownAt,target:s.target||null,events:s.events||[],rowSeen:!!s.rowSeen};}catch(e){return{visited:[],questionShownAt:null,target:null,events:[],rowSeen:false};}}
var S=load();function record(page,action){S.events.push({t:S.events.length,page:page,action:action});}function mark(id){if(S.visited.indexOf(id)<0)S.visited.push(id);}function save(){try{sessionStorage.setItem(KEY,JSON.stringify(S));}catch(e){}sync();}
function sync(){window.__fixtureState={kind:'revisit-v1',family:FAMILY,visited:S.visited.slice(),questionShownAt:S.questionShownAt,target:S.target?{id:S.target.id,label:S.target.label}:null,events:S.events.slice(),rowSeen:S.rowSeen};}
`;
// The family is injected by the server from the attempt's task; page code never infers it from the attempt token.
const page = (family: RevisitFamily, title: string, up: string, body: string, script: string): string => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body><header><strong>Larkfield Supply</strong> <span>Practical goods for the everyday outdoors</span></header><nav><a href="${up}history">Recently viewed</a><a href="${up}order">Order status</a><a href="${up}question">Question</a></nav><main>${body}</main><footer>Larkfield Supply. Repairs and returns handled locally.</footer><script>var FAMILY=${JSON.stringify(family)};${STORE}\n${script}</script></body></html>`;
const hash = (text: string): number => { let n = 2166136261; for (let i = 0; i < text.length; i++) n = Math.imul(n ^ text.charCodeAt(i), 16777619); return n >>> 0; };
/**
 * The run harness appends `-seed-<manifest seed>-<run index>` to every attempt token. That suffix is identical for
 * all approaches of one (task, run), and the question target is derived only from it. Without a suffix (ad hoc use)
 * the case's own manifest seed is used.
 */
const seedFrom = (attemptId: string | undefined, fallback: number): number => { const match = attemptId?.match(/(?:^|-)seed-(\d+)-(\d+)(?:-|$)/); return hash(match ? `${match[1]}-${match[2]}` : `${fallback}-1`); };
const familyFor = (taskId?: string): RevisitFamily => taskId === 'revisit-changing-value' ? 'changing-value' : taskId === 'revisit-visible-field' ? 'visible-field' : 'accordion-field';
const caseSeed = (family: RevisitFamily): number => REVISIT_CASES.find((entry) => entry.family === family)!.seed;
const productTarget = (family: RevisitFamily, seed: number): { id: string; label: string; name: string } => { const product = REVISIT_PRODUCTS[1 + (seed % 2)]!; const labels = family === 'visible-field' ? REVISIT_VISIBLE_LABELS : REVISIT_FULL_LABELS; return { id: product.id, label: labels[(seed >>> 8) % labels.length]!, name: product.name }; };
const changeRow = (seed: number): number => REVISIT_ORDER.firstRow + ((seed >>> 4) % REVISIT_ORDER.span);

const historyPage = (family: RevisitFamily): string => page(family, 'Recently viewed', '', `<h1>Recently viewed</h1><p>Items you looked at recently, oldest first.</p><ol id="viewed">${REVISIT_PRODUCTS.map((product) => `<li class="card"><a href="p/${product.id}">${product.name}</a> <span>${product.price}</span></li>`).join('')}</ol>`, 'sync();');
const productPage = (family: RevisitFamily, product: RevisitProduct): string => {
  const visible = Object.entries(product.visible).map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('');
  const full = Object.entries(product.full).map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('');
  return page(family, product.name, '../', `<h1>${product.name}</h1><p><strong>${product.price}</strong></p><p>${product.blurb}</p><table id="visible-specs"><tbody>${visible}</tbody></table><div class="panel"><button type="button" id="full-specs" aria-expanded="false" aria-controls="full-specs-panel">Full specifications</button><div id="full-specs-panel" role="region" aria-label="Full specifications" hidden><table><tbody>${full}</tbody></table></div></div>`, `
var ID=${JSON.stringify(product.id)};mark(ID);record('/revisit/p/'+ID,'view');save();var button=document.getElementById('full-specs'),panel=document.getElementById('full-specs-panel');button.addEventListener('click',function(){var open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',open?'false':'true');panel.hidden=open;record('/revisit/p/'+ID,open?'collapse-specs':'expand-specs');save();});`);
};
/**
 * The page receives only the target's identity. The gate: product families need all four products opened; the
 * changing-value family needs the order page viewed. The first time the gate passes the page records `question-shown`
 * (state `questionShownAt`) and, for changing-value, tells the fixture server to switch the order page to its updated value.
 */
const questionPage = (family: RevisitFamily, seed: number): string => {
  const changing = family === 'changing-value';
  const target = changing ? { id: revisitRowId(changeRow(seed)), label: REVISIT_ORDER.label } : productTarget(family, seed);
  const ready = changing ? `S.events.some(function(e){return e.page==='/revisit/order'&&e.action==='view';})` : 'S.visited.length===4';
  const wait = changing ? 'Open the order status page first, then come back to this page.' : 'Finish reviewing your recently viewed items first.';
  const question = changing ? `'<p id="question-text">What is the current '+T.label+' for line '+T.id+'?</p>'` : `'<p id="question-text">What is the '+T.label+' of '+T.name+'?</p>'`;
  const reveal = changing ? `var req=new XMLHttpRequest();req.open('POST','/__revisit-reveal/'+encodeURIComponent(tok),false);req.send('');` : '';
  return page(family, 'Question', '', `<h1>Question</h1><div id="question"><p>${wait}</p></div>`, `
var T=${JSON.stringify(target)};record('/revisit/question','view');var box=document.getElementById('question');
if(${ready}){if(S.questionShownAt===null){S.target={id:T.id,label:T.label};record('/revisit/question','question-shown');S.questionShownAt=S.events.length-1;save();${reveal}}else save();box.innerHTML=${question};}else save();`);
};
const FILLER_DOCKS = [1, 2, 3, 4, 5, 6];
const orderRows = (target: number, updated: boolean): string => Array.from({ length: REVISIT_ORDER.rows }, (_, index) => {
  const n = index + 1; const change = revisitChangeFor(target);
  const scan = n === target ? (updated ? change.after : change.before) : n === target - 1 ? change.near[0] : n === target + 1 ? change.near[1] : `Dock ${FILLER_DOCKS[(n * 5) % FILLER_DOCKS.length]}${'ABCD'[(n * 3) % 4]} received`;
  return `<li class="event"${n === target ? ' id="target-row"' : ''}><strong>Line ${revisitRowId(n)}</strong> — Carrier scan: ${scan}; package ${String(480 + n).padStart(3, '0')}; routed via depot ${10 + ((n * 7) % 23)}</li>`;
}).join('');
// A back/forward load (cache or bfcache) is reloaded so a revisit after the reveal always fetches the updated row.
const orderPage = (family: RevisitFamily, target: number, updated: boolean): string => page(family, 'Order status', '', `<h1>Order ${REVISIT_ORDER.id} status</h1><p id="summary"><strong>Status:</strong> In transit — carrier updates below.</p><h2>Shipment event log</h2><ol id="events">${orderRows(target, updated)}</ol>`, `
window.addEventListener('pageshow',function(e){if(e.persisted)location.reload();});
var nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
if(nav&&nav.type==='back_forward'){location.reload();}else{record('/revisit/order','view');var row=document.getElementById('target-row');if(window.IntersectionObserver&&row)new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting;})){S.rowSeen=true;record('/revisit/order','row-seen');save();}}).observe(row);save();}`);
// ---- oracle and grader ----
const normalize = (value: string): string => value.trim().replace(/^(?:final(?: answer)?|answer):\s*/i, '').replace(/\s+/g, ' ').replace(/[.]$/, '').toLocaleLowerCase();
const finalState = (events: FixtureObservation[]): Record<string, unknown> | undefined => events.map((event) => event.fixtureState).filter((state): state is Record<string, unknown> => !!state && typeof state === 'object' && !Array.isArray(state)).at(-1);
interface RevisitEvent { page?: unknown; action?: unknown }
const eventList = (state: Record<string, unknown>): RevisitEvent[] | null => Array.isArray(state.events) && state.events.every((event) => !!event && typeof event === 'object' && !Array.isArray(event)) ? state.events as RevisitEvent[] : null;
const FAMILIES: readonly string[] = ['accordion-field', 'visible-field', 'changing-value'];
/** The expected value for a reported target, or undefined when the target is not a real question for the family. */
function expectedFor(family: RevisitFamily, target: unknown): string | undefined {
  if (!target || typeof target !== 'object' || Array.isArray(target)) return undefined;
  const { id, label } = target as { id?: unknown; label?: unknown };
  if (typeof id !== 'string' || typeof label !== 'string') return undefined;
  if (family === 'changing-value') { const row = rowFromId(id); return row !== null && label === REVISIT_ORDER.label ? revisitChangeFor(row).after : undefined; }
  const product = REVISIT_PRODUCTS.find((candidate) => candidate.id === id);
  if (!product) return undefined;
  const values = (family === 'visible-field' ? product.visible : product.full) as Record<string, string>;
  return Object.prototype.hasOwnProperty.call(values, label) ? values[label] : undefined;
}
interface Inspection { fail?: string; expected?: string; workflowFail?: string; returned?: boolean; rowSeen?: boolean }
/** `fail` is a structural or identity failure (no answer can be established); `workflowFail` is a visit/expand failure. */
function inspect(entry: RevisitCase, state: Record<string, unknown>): Inspection {
  if (state.kind !== 'revisit-v1') return { fail: 'revisit state kind is invalid' };
  if (typeof state.family !== 'string' || !FAMILIES.includes(state.family)) return { fail: 'revisit state family is invalid' };
  if (state.family !== entry.family) return { fail: 'revisit state family does not match task' };
  const events = eventList(state);
  if (!events) return { fail: 'revisit events are malformed' };
  const visited = state.visited;
  if (!Array.isArray(visited) || new Set(visited).size !== visited.length || !visited.every((id) => typeof id === 'string' && REVISIT_IDS.includes(id))) return { fail: 'revisit visited ids are invalid' };
  if (state.questionShownAt === null || state.questionShownAt === undefined) return state.target === null || state.target === undefined ? { fail: 'question page must be opened' } : { fail: 'malformed revisit target' };
  const shown = state.questionShownAt;
  if (typeof shown !== 'number' || !Number.isInteger(shown) || shown < 0 || shown >= events.length || events[shown]!.page !== REVISIT_ROUTES.question || events[shown]!.action !== 'question-shown') return { fail: 'revisit question marker is malformed' };
  const expected = expectedFor(entry.family, state.target);
  if (expected === undefined) return { fail: 'malformed revisit target' };
  const target = state.target as { id: string };
  const before = events.slice(0, shown); const after = events.slice(shown + 1);
  const viewed = (list: RevisitEvent[], path: string, action = 'view'): boolean => list.some((event) => event.page === path && event.action === action);
  if (entry.family === 'changing-value') {
    const returned = viewed(after, REVISIT_ROUTES.order); const rowSeen = state.rowSeen === true;
    const workflowFail = !viewed(before, REVISIT_ROUTES.order) ? 'order page must be viewed before the question' : !returned ? 'order page must be revisited after question' : undefined;
    return { expected, returned, rowSeen, ...(workflowFail ? { workflowFail } : {}) };
  }
  if (!REVISIT_IDS.every((id) => visited.includes(id) && viewed(before, REVISIT_ROUTES.product(id)))) return { expected, workflowFail: 'all four viewed products must be opened' };
  const path = REVISIT_ROUTES.product(target.id); const returned = viewed(after, path);
  if (entry.family === 'visible-field') return { expected, returned };
  const workflowFail = !returned ? 'target product must be revisited after question' : !viewed(after, path, 'expand-specs') ? 'target specifications must be expanded after question' : undefined;
  return { expected, returned, ...(workflowFail ? { workflowFail } : {}) };
}

export interface RevisitCase { id: string; category: 'navigation'; family: RevisitFamily; seed: number; route: string; prompt: (base: string) => string; expected: { answer: string }; oracleId: string; nearMiss: { id: string }; structuralVariant: string; check: FixtureCheck; }
const checkFor = (family: RevisitFamily): FixtureCheck => (events) => {
  const entry = REVISIT_CASES.find((candidate) => candidate.family === family)!; const state = finalState(events);
  if (!state) return { ok: false, details: 'revisit state kind is invalid' };
  const result = inspect(entry, state); const details = result.fail ?? result.workflowFail;
  return details ? { ok: false, details } : { ok: true };
};
const productPrompt = (base: string): string => `Open the recently viewed page at ${base}${REVISIT_ROUTES.history}, open each of the four products the shopper viewed and note what they are. Then open the Question page and answer it. Report only the answer.`;
const cases: RevisitCase[] = [
  { id: 'revisit-accordion-field', category: 'navigation', family: 'accordion-field', seed: 730101, route: REVISIT_ROUTES.history, prompt: productPrompt, expected: { answer: '' }, oracleId: 'revisit-accordion-field-oracle', nearMiss: { id: 'revisit-accordion-wrong-product' }, structuralVariant: 'question is withheld until four product visits; its target is a collapsed specification on a middle product and requires a post-reveal return and expansion', check: checkFor('accordion-field') },
  { id: 'revisit-visible-field', category: 'navigation', family: 'visible-field', seed: 730102, route: REVISIT_ROUTES.history, prompt: productPrompt, expected: { answer: '' }, oracleId: 'revisit-visible-field-oracle', nearMiss: { id: 'revisit-visible-wrong-answer' }, structuralVariant: 'control: question is withheld until four product visits and targets a visible specification; returning is recorded but not required', check: checkFor('visible-field') },
  { id: 'revisit-changing-value', category: 'navigation', family: 'changing-value', seed: 730103, route: REVISIT_ROUTES.order, prompt: (base) => `Open the order status page at ${base}${REVISIT_ROUTES.order}, note its title and status summary, then open the Question page and answer it with the current value. Report only the answer.`, expected: { answer: '' }, oracleId: 'revisit-changing-value-oracle', nearMiss: { id: 'revisit-changing-stale-value' }, structuralVariant: 'a deep shipment row (one of many near-duplicates) changes when the question is first shown; only a post-reveal order-page view exposes its current value', check: checkFor('changing-value') },
];
export const REVISIT_CASES = Object.freeze(cases);
export const REVISIT_CHECKS = REVISIT_CASES.map(({ id, check }) => ({ taskId: id, check }));
/** The expected answer for a reported state, or undefined when the state's family or target is not a valid question. */
export function answerForRevisitState(state: Record<string, unknown>): string | undefined { return typeof state.family === 'string' && FAMILIES.includes(state.family) ? expectedFor(state.family as RevisitFamily, state.target) : undefined; }
export interface RevisitGrade extends FixtureCheckResult {
  /** The answer equals the target value; false when the state is structurally invalid or no question was shown. */
  answerCorrect: boolean;
  /** Required visits/expansions happened. For the visible-field control this excludes `returned`. */
  workflowOk: boolean;
  answerDetails?: string; workflowDetails?: string;
  /** Informational: the target product (or the order page) was viewed again after the question. */
  returned?: boolean;
  /** Informational for changing-value: the target row intersected the viewport. Not required: some approaches read without scrolling. */
  rowSeen?: boolean;
}
export function gradeRevisitCase(id: string, answer: string, events: FixtureObservation[]): RevisitGrade {
  const invalid = (details: string): RevisitGrade => ({ ok: false, answerCorrect: false, workflowOk: false, details, answerDetails: details, workflowDetails: details });
  const entry = REVISIT_CASES.find((candidate) => candidate.id === id);
  if (!entry) return invalid('unknown revisit case');
  const state = finalState(events);
  if (!state) return invalid('revisit state kind is invalid');
  const result = inspect(entry, state);
  const answerCorrect = result.fail === undefined && result.expected !== undefined && normalize(answer) === normalize(result.expected);
  const targetId = (state.target as { id?: unknown } | null | undefined)?.id;
  const row = typeof targetId === 'string' ? rowFromId(targetId) : null;
  const stale = entry.family === 'changing-value' && result.fail === undefined && row !== null && normalize(answer) === normalize(revisitChangeFor(row).before);
  const answerDetails = answerCorrect ? undefined : result.fail ?? (stale ? 'answer is stale (value before the update)' : 'answer does not match target value');
  const workflowDetails = result.fail ?? result.workflowFail;
  const details = answerDetails ?? workflowDetails;
  return { ok: answerCorrect && workflowDetails === undefined, answerCorrect, workflowOk: workflowDetails === undefined, ...(details ? { details } : {}), ...(answerDetails ? { answerDetails } : {}), ...(workflowDetails ? { workflowDetails } : {}), ...(result.returned === undefined ? {} : { returned: result.returned }), ...(result.rowSeen === undefined ? {} : { rowSeen: result.rowSeen }) };
}
export function revisitRoute(path: string, context?: { taskId?: string; attemptId?: string; revealed?: boolean }): { body: string; type: string } | null {
  const type = 'text/html; charset=utf-8'; const family = familyFor(context?.taskId);
  if (path === REVISIT_ROUTES.history) return { body: historyPage(family), type };
  if (path === REVISIT_ROUTES.question) return { body: questionPage(family, seedFrom(context?.attemptId, caseSeed(family))), type };
  if (path === REVISIT_ROUTES.order) return { body: orderPage(family, changeRow(seedFrom(context?.attemptId, caseSeed('changing-value'))), context?.revealed === true), type };
  const product = REVISIT_PRODUCTS.find((candidate) => path === REVISIT_ROUTES.product(candidate.id));
  return product ? { body: productPage(family, product), type } : null;
}