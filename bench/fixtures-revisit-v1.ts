/** Local revisit fixtures: the question arrives only after all four product visits. */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type RevisitFamily = 'accordion-field' | 'visible-field';
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
export const REVISIT_ROUTES = Object.freeze({ history: '/revisit/history', question: '/revisit/question', product: (id: string) => `/revisit/p/${id}` });
export const REVISIT_FULL_LABELS = Object.freeze(Object.keys(REVISIT_PRODUCTS[0]!.full));
export const REVISIT_VISIBLE_LABELS = Object.freeze(['Brand', 'Colour', 'Weight'] as const);

const CSS = 'body{font:16px/1.5 system-ui,sans-serif;margin:0;color:#222b35}header,footer{background:#273746;color:#f4f7f8;padding:12px 28px}nav{background:#e7edf0;padding:8px 28px}nav a{margin-right:16px}main{max-width:820px;padding:20px 28px}.card{border:1px solid #9baab5;border-radius:8px;padding:14px;margin:12px 0}table{border-collapse:collapse}th,td{border:1px solid #c7d1d7;padding:5px 10px;text-align:left}button{font:inherit;padding:6px 12px}.panel{margin-top:14px}';
const page = (title: string, up: string, body: string, script: string): string => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body><header><strong>Larkfield Supply</strong> <span>Practical goods for the everyday outdoors</span></header><nav><a href="${up}history">Recently viewed</a><a href="${up}question">Question</a></nav><main>${body}</main><footer>Larkfield Supply. Repairs and returns handled locally.</footer><script>${STORE}\n${script}</script></body></html>`;

/** State is attempt-local and includes the fixture's own event sequence for ordering checks. */
const STORE = `
var m=location.pathname.match(/^\\/__attempt\\/([A-Za-z0-9_-]+)/);var tok=m?m[1]:(sessionStorage.getItem('__fixture_attempt')||'local');
var KEY='revisit-v1:'+tok;function family(){return tok.toLowerCase().indexOf('visible')>=0?'visible-field':'accordion-field';}
function load(){try{var s=JSON.parse(sessionStorage.getItem(KEY)||'{}');return{family:s.family||family(),visited:s.visited||[],questionShownAt:s.questionShownAt==null?null:s.questionShownAt,target:s.target||null,events:s.events||[]};}catch(e){return{family:family(),visited:[],questionShownAt:null,target:null,events:[]};}}
var S=load();function record(page,action){S.events.push({t:S.events.length,page:page,action:action});}function mark(id){if(S.visited.indexOf(id)<0)S.visited.push(id);}
function save(){sessionStorage.setItem(KEY,JSON.stringify(S));sync();}function sync(){window.__fixtureState={kind:'revisit-v1',family:S.family,visited:S.visited.slice(),questionShownAt:S.questionShownAt,target:S.target?{id:S.target.id,label:S.target.label}:null,events:S.events.slice()};}
`;

const historyPage = (): string => page('Recently viewed', '', `<h1>Recently viewed</h1><p>Items you looked at recently, oldest first.</p><ol id="viewed">${REVISIT_PRODUCTS.map((product) => `<li class="card"><a href="p/${product.id}">${product.name}</a> <span>${product.price}</span></li>`).join('')}</ol>`, 'sync();');
const productPage = (product: RevisitProduct): string => {
  const visible = Object.entries(product.visible).map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('');
  const full = Object.entries(product.full).map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('');
  return page(product.name, '../', `<h1>${product.name}</h1><p><strong>${product.price}</strong></p><p>${product.blurb}</p><table id="visible-specs"><tbody>${visible}</tbody></table><div class="panel"><button type="button" id="full-specs" aria-expanded="false" aria-controls="full-specs-panel">Full specifications</button><div id="full-specs-panel" role="region" aria-label="Full specifications" hidden></div></div>`, `
var ID=${JSON.stringify(product.id)},ROWS=${JSON.stringify(full)};mark(ID);record('/revisit/p/'+ID,'view');save();
var button=document.getElementById('full-specs'),panel=document.getElementById('full-specs-panel');button.addEventListener('click',function(){if(button.getAttribute('aria-expanded')==='true'){button.setAttribute('aria-expanded','false');panel.hidden=true;panel.textContent='';record('/revisit/p/'+ID,'collapse-specs');save();return;}button.setAttribute('aria-expanded','true');panel.hidden=false;panel.innerHTML='<table><tbody>'+ROWS+'</tbody></table>';record('/revisit/p/'+ID,'expand-specs');save();});`);
};
const questionPage = (): string => page('Question', '', `<h1>Question</h1><div id="question"><p>Finish reviewing your recently viewed items first.</p></div>`, `
var PRODUCTS=${JSON.stringify(REVISIT_PRODUCTS.map((p) => ({ id: p.id, name: p.name, visible: p.visible, full: p.full })))};
function hash(text){var n=2166136261;for(var i=0;i<text.length;i++)n=Math.imul(n^text.charCodeAt(i),16777619);return n>>>0;}
record('/revisit/question','view');save();if(S.visited.length===PRODUCTS.length){if(!S.target){var n=hash(tok),product=PRODUCTS[1+(n%2)],labels=S.family==='visible-field'?['Brand','Colour','Weight']:${JSON.stringify(REVISIT_FULL_LABELS)};S.target={id:product.id,label:labels[(n>>>8)%labels.length]};record('/revisit/question','question-shown');S.questionShownAt=S.events.length-1;save();}var selected=PRODUCTS.find(function(p){return p.id===S.target.id;}),box=document.getElementById('question');box.innerHTML='<p id="question-text">What is the '+S.target.label+' of '+selected.name+'?</p>';sync();}else sync();`);

const normalize = (value: string): string => value.trim().replace(/^(?:final(?: answer)?|answer):\s*/i, '').replace(/\s+/g, ' ').replace(/[.]$/, '').toLocaleLowerCase();
const states = (events: FixtureObservation[]): Record<string, unknown>[] => events.map((event) => event.fixtureState as Record<string, unknown> | undefined).filter((state): state is Record<string, unknown> => !!state && state.kind === 'revisit-v1');
const finalState = (events: FixtureObservation[]): Record<string, unknown> | undefined => states(events).at(-1);
const valueFor = (id: string, label: string, family: RevisitFamily): string | undefined => {
  const product = REVISIT_PRODUCTS.find((candidate) => candidate.id === id);
  return product ? (family === 'visible-field' ? product.visible as Record<string, string> : product.full)[label] : undefined;
};
const allViewed = (state: Record<string, unknown>): boolean => Array.isArray(state.visited) && REVISIT_IDS.every((id) => state.visited!.includes(id));
const questionOpened = (state: Record<string, unknown>): boolean => Array.isArray(state.events) && state.events.some((event) => !!event && typeof event === 'object' && (event as { page?: unknown }).page === REVISIT_ROUTES.question);
const revisitAfterQuestion = (state: Record<string, unknown>, id: string): boolean => {
  const at = state.questionShownAt; const events = state.events;
  return typeof at === 'number' && Array.isArray(events) && events.slice(at + 1).some((event) => !!event && typeof event === 'object' && (event as { page?: unknown; action?: unknown }).page === REVISIT_ROUTES.product(id) && (event as { action?: unknown }).action === 'view');
};
const expandedAfterQuestion = (state: Record<string, unknown>, id: string): boolean => {
  const at = state.questionShownAt; const events = state.events;
  return typeof at === 'number' && Array.isArray(events) && events.slice(at + 1).some((event) => !!event && typeof event === 'object' && (event as { page?: unknown; action?: unknown }).page === REVISIT_ROUTES.product(id) && (event as { action?: unknown }).action === 'expand-specs');
};

export interface RevisitCase { id: string; category: 'navigation'; family: RevisitFamily; seed: number; route: string; prompt: (base: string) => string; expected: { answer: string }; oracleId: string; nearMiss: { id: string }; structuralVariant: string; check: FixtureCheck; }
const checkFor = (family: RevisitFamily): FixtureCheck => (events) => {
  const state = finalState(events);
  if (!state || state.kind !== 'revisit-v1' || !questionOpened(state)) return { ok: false, details: 'question page must be opened' };
  if (!allViewed(state)) return { ok: false, details: 'all four viewed products must be opened' };
  if (!state.target || typeof state.target !== 'object') return { ok: false, details: 'question page must be opened' };
  const target = state.target as { id?: unknown; label?: unknown };
  if (typeof state.questionShownAt !== 'number' || typeof target.id !== 'string' || typeof target.label !== 'string') return { ok: false, details: 'question page must be opened' };
  if (!revisitAfterQuestion(state, target.id)) return { ok: false, details: 'target product must be revisited after question' };
  return family === 'accordion-field' && !expandedAfterQuestion(state, target.id) ? { ok: false, details: 'target specifications must be expanded after question' } : { ok: true };
};
const cases: RevisitCase[] = [
  { id: 'revisit-accordion-field', category: 'navigation', family: 'accordion-field', seed: 730101, route: REVISIT_ROUTES.history, prompt: (base) => `Open the recently viewed page at ${base}${REVISIT_ROUTES.history}, open each of the four products the shopper viewed and note what they are. Then open the Question page and answer it. Report only the answer.`, expected: { answer: '' }, oracleId: 'revisit-accordion-field-oracle', nearMiss: { id: 'revisit-accordion-wrong-product' }, structuralVariant: 'question is withheld until four product visits; its target is a collapsed specification on a middle product and requires a post-reveal revisit', check: checkFor('accordion-field') },
  { id: 'revisit-visible-field', category: 'navigation', family: 'visible-field', seed: 730102, route: REVISIT_ROUTES.history, prompt: (base) => `Open the recently viewed page at ${base}${REVISIT_ROUTES.history}, open each of the four products the shopper viewed and note what they are. Then open the Question page and answer it. Report only the answer.`, expected: { answer: '' }, oracleId: 'revisit-visible-field-oracle', nearMiss: { id: 'revisit-visible-wrong-product' }, structuralVariant: 'question is withheld until four product visits; its target is a visible specification on a middle product and requires a post-reveal revisit', check: checkFor('visible-field') },
];
export const REVISIT_CASES = Object.freeze(cases);
export const REVISIT_CHECKS = REVISIT_CASES.map(({ id, check }) => ({ taskId: id, check }));

export function answerForRevisitState(state: Record<string, unknown>): string | undefined {
  const target = state.target as { id?: unknown; label?: unknown } | null;
  return target && typeof target.id === 'string' && typeof target.label === 'string' && (state.family === 'accordion-field' || state.family === 'visible-field') ? valueFor(target.id, target.label, state.family) : undefined;
}
export function gradeRevisitCase(id: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const entry = REVISIT_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { ok: false, details: 'unknown revisit case' };
  const state = finalState(events); const expected = state && answerForRevisitState(state);
  if (!expected) {
    const checked = entry.check(events);
    return typeof checked === 'boolean' ? { ok: checked, details: checked ? undefined : 'revisit fixture oracle failed' } : checked;
  }
  if (normalize(answer) !== normalize(expected)) return { ok: false, details: 'answer does not match target value' };
  const checked = entry.check(events);
  return typeof checked === 'boolean' ? { ok: checked, details: checked ? undefined : 'revisit fixture oracle failed' } : checked;
}
export function revisitRoute(path: string): { body: string; type: string } | null {
  const type = 'text/html; charset=utf-8';
  if (path === REVISIT_ROUTES.history) return { body: historyPage(), type };
  if (path === REVISIT_ROUTES.question) return { body: questionPage(), type };
  const product = REVISIT_PRODUCTS.find((candidate) => path === REVISIT_ROUTES.product(candidate.id));
  return product ? { body: productPage(product), type } : null;
}
