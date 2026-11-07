/**
 * shopping-v1 synthetic fixtures: a small shop where a preference has to be inferred from several product pages and
 * carried to a recommendations page. Every page is self-contained local HTML with the same header, nav and footer; the
 * agent's answer plus the page-reported state (`window.__fixtureState`) are graded deterministically.
 *
 * The shopper's preference is never stated. The four recently viewed products share exactly two attributes
 * (waterproof = yes, colour = olive). Every smaller two- or three-item intersection also has a misleading extra
 * attribute, so only all four pages isolate that pair. Those facts are spread
 * across the blurb, the spec table, a "Details" panel that only renders when opened, and an icon-only rating row.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type ShoppingFamily = 'history-pick' | 'recall-detail';

export interface ShoppingCase {
  id: string;
  category: 'navigation';
  family: ShoppingFamily;
  structuralVariant: string;
  seed: number;
  route: string;
  prompt: (base: string) => string;
  expected: { answer: string; state: Record<string, unknown> };
  oracleId: string;
  nearMiss: { id: string; answer: string; state: Record<string, unknown> };
  check: FixtureCheck;
}

interface Viewed {
  id: string; name: string; price: string; brand: string; weight: string; material: string; colour: string; waterproof: 'Yes' | 'No';
  blurb: string; rating: number;
  /** Spec rows shown in the table (Brand, Weight and the rating row are always shown). */
  table: ReadonlyArray<'colour' | 'material' | 'waterproof'>;
  /** Lines that only render once the Details panel is opened. */
  details: readonly string[];
  signals: Signals;
}
interface Signals { cut: string; hood: string; cuff: string; pocket: string }
interface Rec { id: string; name: string; price: string; brand: string; colour: string; material: string; waterproof: 'Yes' | 'No'; signals: Signals }

/** The only attributes common to all four products. */
export const SHOPPING_PREFERENCE_ATTRIBUTES = Object.freeze(['colour', 'waterproof'] as const);
export const SHOPPING_INTERSECTION_ATTRIBUTES = Object.freeze(['colour', 'waterproof', 'cut', 'hood', 'cuff', 'pocket'] as const);
type IntersectionAttribute = (typeof SHOPPING_INTERSECTION_ATTRIBUTES)[number];
export const shoppingAttributes = (item: Pick<Viewed | Rec, 'colour' | 'waterproof' | 'signals'>): Record<IntersectionAttribute, string> => ({
  colour: item.colour, waterproof: item.waterproof, ...item.signals,
});

/* ---------- deterministic data ---------- */

/** Oldest to newest. The four three-item marker groups make every early intersection misleading. */
export const SHOPPING_VIEWED: readonly Viewed[] = Object.freeze([
  {
    id: 'rl-2041', name: 'Ashgrove Shell Jacket', price: '$149.00', brand: 'Tarn & Co', weight: '640 g', material: 'Recycled nylon ripstop', colour: 'Olive', waterproof: 'Yes',
    blurb: 'A packable shell for long, wet ridge walks.', rating: 4, table: ['waterproof'],
    details: ['Colourway: Olive.', 'Shell fabric: Recycled nylon ripstop.', 'Care: machine wash cold, hang dry.'],
    signals: { cut: 'Alpine', hood: 'Roll-away', cuff: 'Storm', pocket: 'Zip' },
  },
  {
    id: 'rl-2077', name: 'Fenwick Rain Parka', price: '$189.00', brand: 'Hollis', weight: '820 g', material: 'Waxed cotton', colour: 'Olive', waterproof: 'Yes',
    blurb: 'A deep olive parka that stays waterproof to 10,000 mm, with a hood that rolls away.', rating: 5, table: ['material'],
    details: ['Origin: assembled in Portugal.', 'Care: re-wax once a season.'],
    signals: { cut: 'Alpine', hood: 'Roll-away', cuff: 'Elastic', pocket: 'Map' },
  },
  {
    id: 'rl-2102', name: 'Brackenridge Trail Pants', price: '$119.00', brand: 'Northfold', weight: '480 g', material: 'Stretch polyester', colour: 'Olive', waterproof: 'Yes',
    blurb: 'Taped seams and a waterproof membrane keep the weather out on muddy descents.', rating: 3, table: ['colour', 'material'],
    details: ['Origin: assembled in Vietnam.', 'Care: machine wash warm.'],
    signals: { cut: 'Alpine', hood: 'Fixed', cuff: 'Storm', pocket: 'Map' },
  },
  {
    id: 'rl-2138', name: 'Corrie Packable Poncho', price: '$79.00', brand: 'Kestrel', weight: '310 g', material: 'Neoprene-nylon blend', colour: 'Olive', waterproof: 'Yes',
    blurb: 'Throws over a pack in seconds and folds into its own pocket.', rating: 2, table: ['colour', 'material', 'waterproof'],
    details: ['Origin: assembled in Poland.', 'Care: wipe clean.'],
    signals: { cut: 'Coastal', hood: 'Roll-away', cuff: 'Storm', pocket: 'Map' },
  },
]);

/** Display order on the recommendations page. */
export const SHOPPING_RECS: readonly Rec[] = Object.freeze([
  // Each of the first four is a decoy for one of the four three-item intersections.
  { id: 'rl-3046', name: 'Marsh Field Coat', price: '$129.00', brand: 'Hollis', colour: 'Olive', material: 'Cotton canvas', waterproof: 'Yes', signals: { cut: 'Alpine', hood: 'Roll-away', cuff: 'Storm', pocket: 'None' } },
  { id: 'rl-3024', name: 'Kestrel Stretch Sleeve', price: '$44.00', brand: 'Kestrel', colour: 'Olive', material: 'Neoprene-nylon blend', waterproof: 'Yes', signals: { cut: 'Alpine', hood: 'Roll-away', cuff: 'None', pocket: 'Map' } },
  { id: 'rl-3052', name: 'Delta Rain Shell', price: '$139.00', brand: 'Northfold', colour: 'Olive', material: 'Recycled polyester', waterproof: 'Yes', signals: { cut: 'Alpine', hood: 'None', cuff: 'Storm', pocket: 'Map' } },
  { id: 'rl-3031', name: 'Pebble Day Cape', price: '$24.00', brand: 'Tarn & Co', colour: 'Olive', material: 'Cotton blend', waterproof: 'Yes', signals: { cut: 'None', hood: 'Roll-away', cuff: 'Storm', pocket: 'Map' } },
  { id: 'rl-3010', name: 'Sedge Hardshell Jacket', price: '$159.00', brand: 'Brisk', colour: 'Olive', material: 'Laminated nylon', waterproof: 'Yes', signals: { cut: 'Tailored', hood: 'Attached', cuff: 'Adjustable', pocket: 'Internal' } },
  { id: 'rl-3067', name: 'Slate Ridge Overtrousers', price: '$99.00', brand: 'Kestrel', colour: 'Charcoal', material: 'Neoprene-nylon blend', waterproof: 'No', signals: { cut: 'Utility', hood: 'None', cuff: 'Elastic', pocket: 'Map' } },
]);

export const SHOPPING_CORRECT_ID = 'rl-3010';
export const SHOPPING_CORRECT_NAME = 'Sedge Hardshell Jacket';
/** Matches only the newest viewed item's brand and material, and neither true shared attribute. */
export const SHOPPING_DECOY_ID = 'rl-3067';
export const SHOPPING_DECOY_NAME = 'Slate Ridge Overtrousers';
/** Cheapest card; it is also an early-intersection decoy. */
export const SHOPPING_CHEAPEST_ID = 'rl-3031';
export const SHOPPING_VIEWED_IDS: readonly string[] = Object.freeze(SHOPPING_VIEWED.map((item) => item.id));
/** The fact asked by the recall task: visible only in the first viewed page's Details panel. */
export const SHOPPING_FIRST_MATERIAL = SHOPPING_VIEWED[0].material;
export const SHOPPING_LAST_MATERIAL = SHOPPING_VIEWED[SHOPPING_VIEWED.length - 1].material;
/** The viewed page that shows its rating as five identical glyph icons and no rating text. */
export const SHOPPING_ICON_RATING_ID = 'rl-2102';

const ROUTES = Object.freeze({
  history: '/shopping/history',
  recs: '/shopping/recs',
  product: (id: string) => `/shopping/p/${id}`,
});
export const SHOPPING_ROUTES = ROUTES;

/* ---------- pages ---------- */

const CSS = 'body{font:16px/1.5 system-ui,sans-serif;margin:0;color:#1d2330}header,footer{background:#23322a;color:#f2f5ef;padding:12px 28px}main{padding:20px 28px;max-width:820px}nav{padding:8px 28px;background:#e8ece6}nav a{margin-right:16px}.card{border:1px solid #8b98a5;border-radius:8px;padding:14px;margin:12px 0}table{border-collapse:collapse}td,th{border:1px solid #c5ccd3;padding:4px 10px;text-align:left}.g{display:inline-block;width:22px;height:22px;margin-right:2px;fill:#c9ced4}.g.on{fill:#e0a526}button{font:inherit;padding:6px 12px}.panel{margin-top:10px}';
const glyph = (on: boolean): string => `<svg class="g${on ? ' on' : ''}" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/></svg>`;

/** Shared client store: per-attempt state in sessionStorage, mirrored into window.__fixtureState on every page. */
const STORE = `
var m=location.pathname.match(/^\\/__attempt\\/([A-Za-z0-9_-]+)/);
var tok=m?m[1]:(sessionStorage.getItem('__fixture_attempt')||'local');
var KEY='shopping-v1:'+tok;
function load(){try{var s=JSON.parse(sessionStorage.getItem(KEY)||'{}');return{cart:s.cart||[],visited:s.visited||[],detailsOpened:s.detailsOpened||[]};}catch(e){return{cart:[],visited:[],detailsOpened:[]};}}
var S=load();
function save(){sessionStorage.setItem(KEY,JSON.stringify(S));sync();}
function sync(){var c=document.getElementById('cart-count');if(c)c.textContent='Cart ('+S.cart.length+')';
  window.__fixtureState={kind:'shopping-v1',family:'preference-carry',cart:S.cart.slice(),visited:S.visited.slice(),detailsOpened:S.detailsOpened.slice()};}
function mark(list,id){if(S[list].indexOf(id)<0)S[list].push(id);}`;

/** `up` is the relative prefix back to /shopping/ (empty on history and recs, "../" on product pages). */
const page = (title: string, up: string, body: string, script: string): string =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>`
  + `<header><strong>Ridgeline Outfitters</strong> <span>Outdoor clothing and kit</span> <span id="cart-count" style="float:right">Cart (0)</span></header>`
  + `<nav><a href="${up}history">Recently viewed</a><a href="${up}recs">Recommended</a></nav>`
  + `<main>${body}</main>`
  + `<footer><p>Ridgeline Outfitters. Free returns within 30 days. Delivery 2 to 4 working days.</p></footer>`
  + `<script>${STORE}\n${script}</script></body></html>`;

const historyPage = (): string => page('Recently viewed', '', `<h1>Recently viewed</h1><p>Items you looked at recently, oldest first.</p>
<ol id="viewed">${SHOPPING_VIEWED.map((item) => `<li class="card"><a href="p/${item.id}">${item.name}</a> <span>${item.price}</span></li>`).join('')}</ol>`, 'sync();');

const productPage = (item: Viewed): string => {
  const rows = [`<tr><th scope="row">Brand</th><td>${item.brand}</td></tr>`];
  if (item.table.includes('colour')) rows.push(`<tr><th scope="row">Colour</th><td>${item.colour}</td></tr>`);
  if (item.table.includes('material')) rows.push(`<tr><th scope="row">Material</th><td>${item.material}</td></tr>`);
  if (item.table.includes('waterproof')) rows.push(`<tr><th scope="row">Waterproof</th><td>${item.waterproof}</td></tr>`);
  rows.push(...Object.entries(item.signals).map(([label, value]) => `<tr><th scope="row">${label[0].toUpperCase()}${label.slice(1)}</th><td>${value}</td></tr>`));
  rows.push(`<tr><th scope="row">Weight</th><td>${item.weight}</td></tr>`);
  // One page shows its rating only as five identical glyph icons (filled ones coloured); the rest print a number.
  rows.push(item.id === SHOPPING_ICON_RATING_ID
    ? `<tr><th scope="row"></th><td><span id="glyphs">${[1, 2, 3, 4, 5].map((n) => glyph(n <= item.rating)).join('')}</span></td></tr>`
    : `<tr><th scope="row">Rating</th><td>${item.rating}.0 / 5</td></tr>`);
  return page(item.name, '../', `<h1>${item.name}</h1><p><strong>${item.price}</strong></p><p id="blurb">${item.blurb}</p>
<table id="specs"><tbody>${rows.join('')}</tbody></table>
<div class="panel"><button type="button" id="details-tab" aria-expanded="false" aria-controls="details-panel">Details</button><div id="details-panel" role="region" aria-label="Details" hidden></div></div>`, `
var ID=${JSON.stringify(item.id)},DETAILS=${JSON.stringify(item.details)};
mark('visited',ID);save();
var tab=document.getElementById('details-tab'),panel=document.getElementById('details-panel');
tab.addEventListener('click',function(){
  if(tab.getAttribute('aria-expanded')==='true'){tab.setAttribute('aria-expanded','false');panel.hidden=true;panel.textContent='';return sync();}
  tab.setAttribute('aria-expanded','true');panel.hidden=false;
  panel.innerHTML='<ul>'+DETAILS.map(function(d){return '<li>'+d+'</li>';}).join('')+'</ul>';
  mark('detailsOpened',ID);save();});`);
};

const recsPage = (): string => page('Recommended for you', '', `<h1>Recommended for you</h1>
<div id="recs">${SHOPPING_RECS.map((rec) => `<div class="card" data-id="${rec.id}"><h2>${rec.name}</h2><p>${rec.price}</p>
<ul><li>Brand: ${rec.brand}</li><li>Colour: ${rec.colour}</li><li>Material: ${rec.material}</li><li>Waterproof: ${rec.waterproof}</li>${Object.entries(rec.signals).map(([label, value]) => `<li>${label[0].toUpperCase()}${label.slice(1)}: ${value}</li>`).join('')}</ul>
<button type="button" class="add" data-id="${rec.id}">Add to cart</button></div>`).join('')}</div>
<section class="card"><h2>Your cart</h2><ul id="cart-list"></ul><p id="cart-empty">Your cart is empty.</p></section>`, `
var NAMES=${JSON.stringify(Object.fromEntries(SHOPPING_RECS.map((rec) => [rec.id, rec.name])))};
function render(){var ul=document.getElementById('cart-list');ul.innerHTML='';
  S.cart.forEach(function(id){var li=document.createElement('li');li.textContent=NAMES[id]+' ';
    var b=document.createElement('button');b.type='button';b.className='remove';b.setAttribute('data-id',id);b.textContent='Remove';li.appendChild(b);ul.appendChild(li);});
  document.getElementById('cart-empty').hidden=S.cart.length>0;sync();}
document.getElementById('recs').addEventListener('click',function(e){var b=e.target.closest('.add');if(!b)return;
  mark('cart',b.getAttribute('data-id'));save();render();});
document.getElementById('cart-list').addEventListener('click',function(e){var b=e.target.closest('.remove');if(!b)return;
  var id=b.getAttribute('data-id');S.cart=S.cart.filter(function(x){return x!==id;});save();render();});
render();`);

/* ---------- oracle ---------- */

const normalize = (value: string): string => value.trim().replace(/^(?:final(?: answer)?|answer):\s*/i, '').replace(/\s+/g, ' ').replace(/[.]$/, '').toLocaleLowerCase();

const states = (events: FixtureObservation[]): Record<string, unknown>[] =>
  events.map((event) => event.fixtureState as Record<string, unknown> | undefined).filter((state): state is Record<string, unknown> => !!state && state.kind === 'shopping-v1');
/** The final page-reported state: the last observation that carried a shopping-v1 state. */
const lastState = (events: FixtureObservation[]): Record<string, unknown> | undefined => states(events).at(-1);
const sameSet = (a: unknown, b: readonly string[]): boolean => Array.isArray(a) && a.length === b.length && b.every((item) => a.includes(item));
/** All four viewed pages were really opened: load events for each path, and the page script's own `visited` agrees. */
const allViewedOpened = (events: FixtureObservation[]): boolean =>
  SHOPPING_VIEWED_IDS.every((id) => events.some((event) => event.kind === 'load' && event.path === ROUTES.product(id)))
  && states(events).some((state) => Array.isArray(state.visited) && SHOPPING_VIEWED_IDS.every((id) => (state.visited as string[]).includes(id)));

/** Cart is exactly the one fitting recommendation, and every viewed page was opened. */
const pickCheck: FixtureCheck = (events) => {
  const state = lastState(events);
  if (state?.kind !== 'shopping-v1' || !sameSet(state.cart, [SHOPPING_CORRECT_ID])) return { ok: false, details: `cart must contain only ${SHOPPING_CORRECT_NAME}` };
  return allViewedOpened(events) ? { ok: true } : { ok: false, details: 'all four viewed products must be opened' };
};
/** All four pages were opened and the first page's Details panel was actually opened. */
const recallCheck: FixtureCheck = (events) => {
  if (!allViewedOpened(events)) return { ok: false, details: 'all four viewed products must be opened' };
  return states(events).some((state) => Array.isArray(state.detailsOpened) && (state.detailsOpened as string[]).includes(SHOPPING_VIEWED_IDS[0]))
    ? { ok: true } : { ok: false, details: 'first viewed product Details panel must be opened' };
};

const CASES: ShoppingCase[] = [
  {
    id: 'shopping-pick-from-history', category: 'navigation', family: 'history-pick',
    structuralVariant: 'only all four viewed products isolate two shared attributes; every pair and triple has a matching decoy, with the true pair spread over blurb, table and Details',
    seed: 620101, route: ROUTES.history,
    prompt: (b) => `Open the recently viewed page at ${b}${ROUTES.history}, look at all four products the shopper viewed, work out what they have in common, then add the intended recommended product to the cart. Report the name of the product you added.`,
    expected: { answer: SHOPPING_CORRECT_NAME, state: { kind: 'shopping-v1', family: 'preference-carry', cart: [SHOPPING_CORRECT_ID], visited: [...SHOPPING_VIEWED_IDS] } },
    oracleId: 'shopping-pick-from-history-oracle',
    nearMiss: { id: 'shopping-pick-from-history-newest-only-decoy', answer: SHOPPING_DECOY_NAME, state: { kind: 'shopping-v1', family: 'preference-carry', cart: [SHOPPING_DECOY_ID], visited: [...SHOPPING_VIEWED_IDS] } },
    check: pickCheck,
  },
  {
    id: 'shopping-recall-earlier-detail', category: 'navigation', family: 'recall-detail',
    structuralVariant: 'material of the first viewed product appears only inside its Details panel; all four visits and the first Details opening are required without an ordering claim',
    seed: 620102, route: ROUTES.history,
    prompt: (b) => `Open the recently viewed page at ${b}${ROUTES.history}, open each of the four products the shopper viewed, and open the Details panel of the first product in that list (the one viewed longest ago). Report its shell fabric. Reply with only the fabric.`,
    expected: { answer: SHOPPING_FIRST_MATERIAL, state: { kind: 'shopping-v1', family: 'preference-carry', visited: [...SHOPPING_VIEWED_IDS], detailsOpened: [SHOPPING_VIEWED_IDS[0]] } },
    oracleId: 'shopping-recall-earlier-detail-oracle',
    nearMiss: { id: 'shopping-recall-earlier-detail-last-page-material', answer: SHOPPING_LAST_MATERIAL, state: { kind: 'shopping-v1', family: 'preference-carry', visited: [...SHOPPING_VIEWED_IDS], detailsOpened: [SHOPPING_VIEWED_IDS[0]] } },
    check: recallCheck,
  },
];

export const SHOPPING_CASES = Object.freeze(CASES);
export const SHOPPING_CHECKS = SHOPPING_CASES.map(({ id, check }) => ({ taskId: id, check }));

/** Cart state is authoritative for picking; recall requires the exact normalized fabric string. */
export const matchesShoppingAnswer = (entry: ShoppingCase, answer: string): boolean => {
  if (entry.family === 'recall-detail') return normalize(answer) === normalize(entry.expected.answer);
  return normalize(answer).length > 0;
};

export function gradeShoppingCase(id: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const entry = SHOPPING_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { ok: false, details: 'unknown shopping case' };
  const answerOk = matchesShoppingAnswer(entry, answer);
  const result = entry.check(events);
  const stateOk = typeof result === 'boolean' ? result : result.ok;
  return answerOk && stateOk
    ? { ok: true }
    : { ok: false, details: !answerOk ? 'answer does not match the shopping oracle' : typeof result === 'boolean' ? 'terminal state does not match the shopping oracle' : result.details ?? 'terminal state does not match the shopping oracle' };
}

export function shoppingRoute(path: string): { body: string; type: string } | null {
  const type = 'text/html; charset=utf-8';
  if (path === ROUTES.history) return { body: historyPage(), type };
  if (path === ROUTES.recs) return { body: recsPage(), type };
  const item = SHOPPING_VIEWED.find((candidate) => path === ROUTES.product(candidate.id));
  return item ? { body: productPage(item), type } : null;
}
