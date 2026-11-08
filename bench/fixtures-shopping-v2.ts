/** Seeded preference inference with a delayed catalog. Only this harness module holds the answer key. */
import type { FixtureCheckEntry, FixtureCheckResult, FixtureObservation } from './fixtures.js';
import { seedFrom } from './fixtures-revisit-v1.js';

const DEFINITIONS = [
  { name: 'material-colour', labels: ['Material', 'Colour family'], values: [['Linen', 'Wool', 'Cotton'], ['Blue', 'Green', 'Red']], gap: 5, layout: 'table', visual: false },
  { name: 'tier-size', labels: ['Brand tier', 'Size class'], values: [['Artisan', 'Everyday', 'Premium'], ['Compact', 'Standard', 'Oversized']], gap: 6, layout: 'prose', visual: false },
  { name: 'closure-capacity', labels: ['Closure', 'Capacity'], values: [['Zip', 'Buckle', 'Snap'], ['12 litres', '18 litres', '24 litres']], gap: 7, layout: 'list', visual: false },
  { name: 'finish-shape', labels: ['Finish', 'Shape'], values: [['Matte', 'Gloss', 'Brushed'], ['Round', 'Square', 'Oval']], gap: 8, layout: 'table', visual: false },
  { name: 'textile-pattern', labels: ['Textile', 'Surface'], values: [['Canvas', 'Denim', 'Twill'], ['Stripe', 'Dot', 'Check']], gap: 6, layout: 'prose', visual: true },
  { name: 'material-swatch', labels: ['Material', 'Surface'], values: [['Ceramic', 'Glass', 'Steel'], ['Blue', 'Green', 'Red']], gap: 7, layout: 'list', visual: true },
] as const;
type Definition = (typeof DEFINITIONS)[number];
export interface ShoppingV2Item { id: string; name: string; traits: readonly string[]; price: string }
export interface ShoppingV2Data {
  seed: number; viewed: ShoppingV2Item[]; candidates: ShoppingV2Item[]; correctId: string;
  oneAttributeIds: string[]; popularId: string; detours: { id: string; title: string; fact: string }[];
}
export const SHOPPING_V2_ROUTES = Object.freeze({ history: '/shopping-v2/history', gap: '/shopping-v2/errands', catalog: '/shopping-v2/catalog', product: (id: string) => `/shopping-v2/p/${id}`, detour: (id: string) => `/shopping-v2/d/${id}` });
const R = SHOPPING_V2_ROUTES;
const NAMES = ['Alder', 'Birch', 'Cairn', 'Dune', 'Ember', 'Flint', 'Grove', 'Haven', 'Iris', 'Juniper', 'Knoll', 'Larch'];
const ERRANDS = [
  ['Library desk', 'Collection shelf: 4'], ['Garden notice', 'Watering starts at 07:30'], ['Museum hours', 'Last entry: 16:15'],
  ['Transit bulletin', 'Replacement service: platform 2'], ['Community hall', 'Doors open at 18:45'], ['Pool notice', 'Lane booking: 30 minutes'],
  ['Repair desk', 'Receipt copies: counter 6'], ['Recycling guide', 'Paper collection: Wednesday'], ['Bakery board', 'Next batch: 11:20'],
  ['Walking group', 'Meeting point: north gate'], ['Parcel office', 'Collection closes at 17:10'], ['Music room', 'Practice slots: 45 minutes'],
] as const;
/** Pure oracle data, never serialized into a page. Candidate role and display order are independent. */
export function shoppingV2Data(id: string, attemptId?: string): ShoppingV2Data {
  const entry = SHOPPING_V2_CASES.find((entry) => entry.id === id);
  if (!entry) throw new Error(`unknown shopping-v2 case: ${id}`);
  return dataFor(entry.definition, seedFrom(attemptId, entry.seed));
}
function dataFor(def: Definition, seed: number): ShoppingV2Data {
  let next = seed;
  const random = () => { next = (Math.imul(next, 1664525) + 1013904223) >>> 0; return next; };
  const shuffle = <T,>(items: readonly T[]): T[] => { const out = [...items]; for (let i = out.length - 1; i > 0; i--) { const j = random() % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; };
  const a = (seed >>> 5) % 3; const b = (seed >>> 12) % 3;
  const names = shuffle(NAMES); const ids = new Set<string>();
  const opaque = () => { let id: string; do { id = `q${random().toString(36)}`; } while (ids.has(id)); ids.add(id); return id; };
  const item = (index: number, traits: readonly string[]): ShoppingV2Item => ({ id: opaque(), name: `${names[index]} item`, traits, price: index < 4 ? `$${40 + index * 7}.00` : '$60.00' });
  const viewed = Array.from({ length: 4 }, (_, i) => item(i, [def.values[0][a]!, def.values[1][b]!]));
  const candidates = [item(4, [def.values[0][a]!, def.values[1][b]!]), item(5, [def.values[0][a]!, def.values[1][(b + 1) % 3]!]), item(6, [def.values[0][(a + 1) % 3]!, def.values[1][b]!]), item(7, [def.values[0][(a + 2) % 3]!, def.values[1][(b + 2) % 3]!])];
  const detours = shuffle(ERRANDS).slice(0, def.gap).map(([title, fact]) => ({ id: opaque(), title, fact }));
  return { seed, viewed, candidates: shuffle(candidates), correctId: candidates[0]!.id, oneAttributeIds: [candidates[1]!.id, candidates[2]!.id], popularId: candidates[3]!.id, detours };
}
const CSS = 'body{font:17px/1.5 system-ui;margin:0;color:#202b38;background:#faf9f5}header,footer{padding:14px 28px;background:#243746;color:white}nav,main{padding:16px 28px;max-width:900px}nav a{margin-right:24px}article,aside{padding:18px;margin:14px 0;border:1px solid #b5bec6;border-radius:8px;background:white}aside{background:#eef0ef}table{border-collapse:collapse}th,td{padding:7px 12px;border:1px solid #aaa;text-align:left}button{font:inherit;padding:8px 14px}.popular{border:4px solid #bd8a23;background:#fff2ca;padding:22px}svg{display:block;margin:10px 0}dt{font-weight:bold}';
/** Shapes only: no semantic colour/pattern names, alt text, titles or per-value CSS classes. */
function surface(value: string): string {
  const colors: Record<string, string> = { Blue: '#2368c4', Green: '#287c41', Red: '#bd303f' };
  let shapes: string;
  if (colors[value]) shapes = `<rect x="10" y="10" width="160" height="85" rx="12" fill="${colors[value]}"/><path d="M22 75Q75 35 155 70" fill="none" stroke="#ffffff" stroke-width="3"/>`;
  else if (value === 'Stripe') shapes = Array.from({ length: 8 }, (_, i) => `<path d="M${12 + i * 21} 10v85" stroke="#26394c" stroke-width="9"/>`).join('');
  else if (value === 'Dot') shapes = Array.from({ length: 24 }, (_, i) => `<circle cx="${18 + (i % 8) * 21}" cy="${22 + Math.floor(i / 8) * 29}" r="6" fill="#26394c"/>`).join('');
  else shapes = Array.from({ length: 24 }, (_, i) => `<rect x="${8 + (i % 8) * 21}" y="${10 + Math.floor(i / 8) * 29}" width="20" height="28" fill="${(i + Math.floor(i / 8)) % 2 ? '#26394c' : '#eee5d4'}"/>`).join('');
  return `<svg viewBox="0 0 180 105" width="180" height="105" role="img" aria-label="Product surface"><rect width="180" height="105" fill="#eee5d4"/>${shapes}</svg>`;
}
const specs = (def: Definition, item: ShoppingV2Item): string => {
  const rows = def.labels.flatMap((label, i) => def.visual && i === 1 ? [] : [[label, item.traits[i]!] as const]);
  const text = def.layout === 'prose' ? `<p>${rows.map(([label, value]) => `${label}: ${value}.`).join(' ')}</p>` : def.layout === 'list' ? `<dl>${rows.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('')}</dl>` : `<table>${rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('')}</table>`;
  return text + (def.visual ? surface(item.traits[1]!) : '');
};
const shell = (id: string, data: ShoppingV2Data, title: string, body: string, script = ''): string => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body><header>Daybook market <span id="cart-count"></span></header><nav><a href="../history">Earlier today</a><a href="../errands">Errands</a><a href="../catalog">Catalog</a></nav><main>${body}</main><footer>Local product notebook</footer><script>
var token=(location.pathname.match(/^\\/__attempt\\/([A-Za-z0-9_-]+)/)||[])[1]||'local';
var key='shopping-v2:'+token;var S;try{S=JSON.parse(sessionStorage.getItem(key)||'null');}catch(e){}if(!S)S={cart:[],events:[]};
function record(page,action){S.events.push({page:page,action:action});}
function seen(page){return S.events.some(function(e){return e.page===page&&e.action==='view';});}
function save(){sessionStorage.setItem(key,JSON.stringify(S));window.__fixtureState={kind:'shopping-v2',task:${JSON.stringify(id)},variant:${data.seed},cart:S.cart.slice(),events:S.events.slice()};document.getElementById('cart-count').textContent=' Cart ('+S.cart.length+')';}
${script}\nsave();</script></body></html>`;

/** Gates reveal UI, never a correct choice. History remains navigable after the gap. */
export function shoppingV2Route(path: string, context?: { taskId?: string; attemptId?: string }): { body: string; type: string } | null {
  if (!path.startsWith('/shopping-v2/')) return null;
  const entry = SHOPPING_V2_CASES.find((e) => e.id === context?.taskId) ?? SHOPPING_V2_CASES[0]!;
  const data = shoppingV2Data(entry.id, context?.attemptId); const def = entry.definition;
  // Relative links use one consistent depth without dropping the attempt prefix.
  const page = (title: string, body: string, script = '') => ({ type: 'text/html; charset=utf-8', body: shell(entry.id, data, title, body, script).replace('<head>', `<head><base href="${path.includes('/p/') || path.includes('/d/') ? '../' : './'}">`).replaceAll('href="../history"', 'href="history"').replaceAll('href="../errands"', 'href="errands"').replaceAll('href="../catalog"', 'href="catalog"') });
  const historyReady = data.viewed.map((p) => `seen(${JSON.stringify(R.product(p.id))})`).join('&&');
  const gapReady = data.detours.map((d) => `S.events.slice(start+1).some(function(e){return e.page===${JSON.stringify(R.detour(d.id))}&&e.action==='view';})`).join('&&');
  if (path === R.history) return page('Earlier today', `<h1>Earlier today</h1><p>This shopper browsed these products. Each page also has a stockroom preview for later shopping.</p><ul>${data.viewed.map((p) => `<li><a href="p/${p.id}">${p.name}</a></li>`).join('')}</ul><p><a href="errands">Continue to errands</a></p>`);
  const index = data.viewed.findIndex((p) => path === R.product(p.id));
  if (index >= 0) {
    const item = data.viewed[index]!; const preview = data.candidates[index]!;
    return page(item.name, `<h1>${item.name}</h1><p>${item.price}</p>${specs(def, item)}<p>Weight: ${210 + index * 75} g. Dispatch: ${index + 1} days. Maker series: ${NAMES[index]}.</p><aside><h2>Stockroom preview</h2><h3>${preview.name}</h3><p>Reference ${preview.id}</p>${specs(def, preview)}</aside><a href="history">Back to earlier today</a>`, `record(${JSON.stringify(path)},'view');`);
  }
  if (path === R.gap) return page('Errands', '<h1>Errands</h1><div id="content">Finish opening the earlier products, then return here.</div>', `if(${historyReady}){if(!S.events.some(function(e){return e.action==='gap-start';}))record(${JSON.stringify(R.gap)},'gap-start');document.getElementById('content').innerHTML=${JSON.stringify(`<p>The shopper has these unrelated notices to check before shopping.</p><ul>${data.detours.map((d) => `<li><a href="d/${d.id}">${d.title}</a></li>`).join('')}</ul><a href="catalog">Continue to catalog</a>`)};}`);
  const detour = data.detours.find((d) => path === R.detour(d.id));
  if (detour) return page(detour.title, `<h1>${detour.title}</h1><p>${detour.fact}</p><a href="errands">Back to errands</a>`, `if(S.events.some(function(e){return e.action==='gap-start';}))record(${JSON.stringify(path)},'view');`);
  if (path === R.catalog) {
    const cards = [...data.candidates].sort((a, b) => Number(b.id === data.popularId) - Number(a.id === data.popularId));
    const html = `<p>Choose an item for the shopper. Specifications were in the earlier stockroom previews.</p>${cards.map((p) => `<article${p.id === data.popularId ? ' class="popular"' : ''}>${p.id === data.popularId ? '<strong>Popular · Recommended this week</strong>' : ''}<h2>${p.name}</h2><p>Reference ${p.id} · ${p.price}</p><button data-item="${p.id}">Add ${p.name} to cart</button></article>`).join('')}<button id="clear">Empty cart</button>`;
    return page('Catalog', '<h1>Catalog</h1><div id="content">Complete all the errands before shopping.</div>', `var start=S.events.findIndex(function(e){return e.action==='gap-start';});if(start>=0&&${historyReady}&&${gapReady}){record(${JSON.stringify(R.catalog)},'catalog-shown');document.getElementById('content').innerHTML=${JSON.stringify(html)};}document.querySelectorAll('[data-item]').forEach(function(b){b.onclick=function(){var id=b.getAttribute('data-item');if(S.cart.indexOf(id)<0)S.cart.push(id);record(${JSON.stringify(R.catalog)},'add:'+id);save();};});var clear=document.getElementById('clear');if(clear)clear.onclick=function(){S.cart=[];record(${JSON.stringify(R.catalog)},'clear');save();};`);
  }
  return null;
}

export interface ShoppingV2Grade extends FixtureCheckResult { recommendationCorrect: boolean; visitsComplete: boolean }
export function gradeShoppingV2Case(id: string, answer: string, observations: FixtureObservation[]): ShoppingV2Grade {
  const bad = (details: string): ShoppingV2Grade => ({ ok: false, recommendationCorrect: false, visitsComplete: false, details });
  const entry = SHOPPING_V2_CASES.find((e) => e.id === id);
  const state = observations.map((e) => e.fixtureState).filter((s): s is Record<string, unknown> => !!s && typeof s === 'object' && !Array.isArray(s)).at(-1);
  if (!entry || !state || state.kind !== 'shopping-v2' || state.task !== id || !Number.isInteger(state.variant) || Number(state.variant) < 0 || Number(state.variant) > 0xffffffff) return bad('invalid shopping-v2 identity');
  const data = dataFor(entry.definition, Number(state.variant));
  if (!Array.isArray(state.cart) || !state.cart.every((id) => typeof id === 'string' && data.candidates.some((c) => c.id === id)) || new Set(state.cart).size !== state.cart.length) return bad('invalid cart');
  if (!Array.isArray(state.events) || !state.events.every((e) => e && typeof e === 'object' && typeof e.page === 'string' && typeof e.action === 'string')) return bad('invalid visit events');
  const events = state.events as { page: string; action: string }[];
  const shown = events.findIndex((e) => e.page === R.catalog && e.action === 'catalog-shown');
  const gap = events.findIndex((e) => e.page === R.gap && e.action === 'gap-start');
  const phaseAt = (path: string, action: string) => observations.findIndex((observation) => {
    const snapshot = observation.fixtureState as typeof state | undefined;
    return observation.path === path && snapshot?.kind === 'shopping-v2' && snapshot.task === id && snapshot.variant === state.variant &&
      Array.isArray(snapshot.events) && snapshot.events.some((event) => event?.page === path && event?.action === action);
  });
  const gapAt = phaseAt(R.gap, 'gap-start');
  const shownAt = phaseAt(R.catalog, 'catalog-shown');
  const viewed = (from: number, to: number, path: string, observationFrom: number, observationTo: number) =>
    events.slice(from, to).some((e) => e.page === path && e.action === 'view') &&
    observations.slice(observationFrom, observationTo).some((e) => e.path === path);
  const visitsComplete = gap >= 0 && shown > gap && gapAt >= 0 && shownAt > gapAt &&
    data.viewed.every((p) => viewed(0, gap, R.product(p.id), 0, gapAt)) &&
    data.detours.every((d) => viewed(gap + 1, shown, R.detour(d.id), gapAt + 1, shownAt));
  const recommendationCorrect = state.cart.length === 1 && state.cart[0] === data.correctId;
  const ok = recommendationCorrect && visitsComplete && /\S/.test(answer);
  return { ok, recommendationCorrect, visitsComplete, ...(!ok ? { details: !/\S/.test(answer) ? 'final answer is empty' : !recommendationCorrect ? 'cart must contain exactly the preferred item' : 'history and detour visits must precede the catalog' } : {}) };
}
export const SHOPPING_V2_CASES = Object.freeze(DEFINITIONS.map((definition, i) => ({
  id: `shopping-v2-${definition.name}`, category: 'navigation' as const, definition, seed: 840201 + i,
  family: definition.visual ? 'visual-preference' : 'text-preference', structuralVariant: `${definition.layout}-${definition.gap}-detours`, oracleId: `shopping-v2-${definition.name}-cart`,
  route: R.history,
  prompt: (base: string) => `At ${base}${R.history} are products a shopper looked at earlier today. Browse each product, check the shopper's errands, then recommend one item from the catalog they would most likely want and add it to the cart.`,
  check: (events: FixtureObservation[]) => gradeShoppingV2Case(`shopping-v2-${definition.name}`, 'completed', events),
})));
export const SHOPPING_V2_CHECKS: FixtureCheckEntry[] = SHOPPING_V2_CASES.map((e) => ({ taskId: e.id, check: e.check }));
