/**
 * capability-v1 synthetic fixtures: four pages that probe where an agent browser tool works or fails on
 * visual-only and time-dependent content. Every page is self-contained local HTML; the grader reads the
 * agent's answer plus the page-reported terminal state (`window.__fixtureState`).
 *
 *  - colour-swatch: variants exist only as coloured buttons (no name, label or title).
 *  - photo-fact: the fact exists only inside a raster image generated at load time.
 *  - revisit-earlier: a value from the first of four pages must be re-entered on the last.
 *  - live-update: a status changes on timers and the action only works once it reads Ready.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type CapabilityFamily = 'colour-swatch' | 'photo-fact' | 'revisit-earlier' | 'live-update';
export type CapabilityCategory = 'visual' | 'navigation' | 'dynamic';

export interface CapabilityCase {
  id: string;
  category: CapabilityCategory;
  family: CapabilityFamily;
  structuralVariant: string;
  seed: number;
  route: string;
  prompt: (base: string) => string;
  expected: { answer: string; state: Record<string, unknown> };
  oracleId: string;
  nearMiss: { id: string; answer: string; state: Record<string, unknown> };
  check: FixtureCheck;
}

/* ---------- deterministic data ---------- */

/** Variants in display order. The code is opaque: it does not follow display position or name the colour. */
export const SWATCHES = Object.freeze([
  { code: 'SW-27', hex: '#d64545', colour: 'red' },
  { code: 'SW-14', hex: '#e8892b', colour: 'orange' },
  { code: 'SW-52', hex: '#7b4fc9', colour: 'purple' },
  { code: 'SW-38', hex: '#2f9e55', colour: 'green' },
  { code: 'SW-61', hex: '#2b6fd6', colour: 'blue' },
  { code: 'SW-19', hex: '#8a8f98', colour: 'grey' },
] as const);
export const GREEN_CODE = SWATCHES.find((swatch) => swatch.colour === 'green')!.code;
export const BLUE_CODE = SWATCHES.find((swatch) => swatch.colour === 'blue')!.code;

export const PHOTO_SERIAL = 'KX-48273';
export const PHOTO_BATCH = '3318';
export const REVISIT_ORDER_CODE = 'ORD-4829-QX';
export const REVISIT_DECOYS = Object.freeze({ quote: 'QT-5521', basket: 'BK-7730' });
export const LIVE_PICKUP_CODE = 'PK-6139';
export const LIVE_PROCESSING_MS = 2500;
export const LIVE_READY_MS = 5000;

const ROUTES = Object.freeze({
  swatch: '/capability/swatch',
  photo: '/capability/photo',
  revisitA: '/capability/revisit/a',
  revisitB: '/capability/revisit/b',
  revisitC: '/capability/revisit/c',
  revisitD: '/capability/revisit/d',
  live: '/capability/live',
});
export const CAPABILITY_ROUTES = ROUTES;

/* ---------- pages ---------- */

const page = (title: string, body: string, script = ''): string =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>body{font:16px/1.5 system-ui,sans-serif;margin:28px;max-width:760px}button,input{font:inherit;padding:6px 12px}.card{border:1px solid #8b98a5;border-radius:8px;padding:16px;margin:12px 0}.swatch{width:44px;height:44px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #556;margin:4px 8px 4px 0;padding:0;cursor:pointer}.swatch[aria-pressed="true"]{box-shadow:0 0 0 3px #111}.btn-off{background:#d5d9de;color:#6b7580;cursor:not-allowed}a.next{display:inline-block;margin-top:10px}</style></head><body>${body}<script>${script}</script></body></html>`;

const swatchPage = (): string => page('Trail Pack', `<main><h1>Trail Pack</h1><p>Lightweight 24 L pack. $48.00</p>
<fieldset class="card"><legend>Colour</legend><div id="swatches">${SWATCHES.map((swatch) => `<button type="button" class="swatch" data-v="${swatch.code}" aria-pressed="false" style="background:${swatch.hex}"></button>`).join('')}</div>
<p id="selected" role="status">No colour selected.</p></fieldset>
<button id="add" type="button">Add to cart</button><p id="cart" role="status"></p></main>`, `
var selected=null,cart=[];
function sync(){window.__fixtureState={kind:'capability-v1',family:'colour-swatch',selected:selected,cart:cart.slice().sort()};}
document.querySelectorAll('.swatch').forEach(function(b){b.addEventListener('click',function(){
  selected=b.getAttribute('data-v');
  document.querySelectorAll('.swatch').forEach(function(o){o.setAttribute('aria-pressed',String(o===b));});
  document.getElementById('selected').textContent='Selected variant: '+selected+'.';sync();});});
document.getElementById('add').addEventListener('click',function(){
  if(!selected){document.getElementById('cart').textContent='Choose a colour first.';return sync();}
  if(cart.indexOf(selected)<0)cart.push(selected);
  document.getElementById('cart').textContent='Trail Pack, variant '+selected+', added to your cart.';sync();});
sync();`);

/** The serial is assembled from char codes and painted onto an unattached canvas: no text node, alt or script literal names it. */
const photoPage = (): string => {
  const codes = (value: string) => JSON.stringify([...value].map((char) => char.charCodeAt(0)));
  return page('Parcel intake', `<main><h1>Parcel intake</h1><p>The photo below was taken at the dock.</p><img id="label" alt="Photo of a parcel label" width="640" height="360"></main>`, `
var serial=String.fromCharCode.apply(null,${codes(PHOTO_SERIAL)}),batch=String.fromCharCode.apply(null,${codes(PHOTO_BATCH)});
var c=document.createElement('canvas');c.width=640;c.height=360;var x=c.getContext('2d');
x.fillStyle='#f4efe0';x.fillRect(0,0,640,360);x.strokeStyle='#333';x.lineWidth=4;x.strokeRect(10,10,620,340);
x.fillStyle='#222';x.font='bold 26px sans-serif';x.fillText('PARCEL LABEL',34,58);
x.font='24px sans-serif';x.fillText('Route 17-C',34,102);x.fillText('Weight 12.4 kg',34,140);x.fillText('Batch '+batch,34,178);
x.font='20px sans-serif';x.fillText('Serial no.',34,224);
x.font='bold 64px monospace';x.fillText(serial,34,292);
for(var i=0;i<28;i++){x.fillRect(380+i*8,40+((i*7)%5),3+(i%3),60);}
x.strokeStyle='#bbb';x.lineWidth=1;for(var j=0;j<6;j++){x.beginPath();x.moveTo(20,310+j*5);x.lineTo(620,306+j*5);x.stroke();}
document.getElementById('label').src=c.toDataURL('image/png');
window.__fixtureState={kind:'capability-v1',family:'photo-fact',source:'raster-label'};`);
};

const revisitNav = (step: number): string => `<p aria-label="Progress">Step ${step} of 4</p>`;
const revisitPageA = (): string => page('Order placed', `<main>${revisitNav(1)}<h1>Order placed</h1><div class="card"><p>Thank you. Your order code is <strong>${REVISIT_ORDER_CODE}</strong>.</p><p>You will need this code to verify the order at the end of checkout.</p></div><a class="next" href="b">Continue to delivery</a></main>`, `window.__fixtureState={kind:'capability-v1',family:'revisit-earlier',page:'a'};`);
const revisitPageB = (): string => page('Delivery', `<main>${revisitNav(2)}<h1>Delivery</h1><div class="card"><p>Delivery quote reference: <strong>${REVISIT_DECOYS.quote}</strong></p><label><input type="radio" name="speed" checked> Standard (3 days)</label><br><label><input type="radio" name="speed"> Express (next day)</label></div><a class="next" href="c">Continue to review</a></main>`, `window.__fixtureState={kind:'capability-v1',family:'revisit-earlier',page:'b'};`);
const revisitPageC = (): string => page('Review', `<main>${revisitNav(3)}<h1>Review</h1><div class="card"><p>Basket reference: <strong>${REVISIT_DECOYS.basket}</strong></p><p>Total: $63.40</p></div><a class="next" href="d">Continue to verification</a></main>`, `window.__fixtureState={kind:'capability-v1',family:'revisit-earlier',page:'c'};`);
const revisitPageD = (): string => page('Verify order', `<main>${revisitNav(4)}<h1>Verify your order</h1><form id="verify" class="card"><label for="order-code">Order code from the order confirmation page</label><br><input id="order-code" name="order-code" autocomplete="off"> <button type="submit">Verify order</button></form><p id="out" role="status"></p></main>`, `
var submitted=null;
function sync(){window.__fixtureState={kind:'capability-v1',family:'revisit-earlier',page:'d',submitted:submitted};}
document.getElementById('verify').addEventListener('submit',function(e){e.preventDefault();
  submitted=document.getElementById('order-code').value.trim();
  document.getElementById('out').textContent='Verification received.';sync();});
sync();`);

const livePage = (): string => page('Order status', `<main><h1>Order status</h1><div class="card"><p>Status: <strong id="status" role="status" aria-live="polite">Pending</strong></p><button id="collect" type="button" class="btn-off" aria-disabled="true">Collect order</button><p id="out" role="status"></p></div></main>`, `
var status='Pending',collected=false,code=null,early=0;
var el=document.getElementById('status'),btn=document.getElementById('collect'),out=document.getElementById('out');
function sync(){el.textContent=status;var ready=status==='Ready';btn.setAttribute('aria-disabled',String(!ready));btn.className=ready?'':'btn-off';
  window.__fixtureState={kind:'capability-v1',family:'live-update',status:status,collected:collected,code:code,earlyClicks:early};}
setTimeout(function(){status='Processing';sync();},${LIVE_PROCESSING_MS});
setTimeout(function(){status='Ready';sync();},${LIVE_READY_MS});
btn.addEventListener('click',function(){
  if(status!=='Ready'){early++;out.textContent='Not ready yet.';return sync();}
  collected=true;code='PK-'+(6100+39);out.textContent='Collected. Pickup code: '+code;sync();});
sync();`);

/* ---------- oracle ---------- */

const normalize = (value: string): string => value.trim().replace(/^(?:final(?: answer)?|answer):\s*/i, '').replace(/\s+/g, ' ').replace(/[.]$/, '').toLocaleLowerCase();
export const matchesCapabilityAnswer = (entry: CapabilityCase, answer: string): boolean => normalize(answer) === normalize(entry.expected.answer);

const lastSettledState = (events: FixtureObservation[]): Record<string, unknown> | undefined =>
  events.filter((event) => event.kind === 'settled').at(-1)?.fixtureState as Record<string, unknown> | undefined;
const sameList = (a: unknown, b: string[]): boolean => Array.isArray(a) && a.length === b.length && a.every((item, index) => item === b[index]);

const swatchCheck: FixtureCheck = (events) => {
  const state = lastSettledState(events);
  return state?.family === 'colour-swatch' && state.selected === GREEN_CODE && sameList(state.cart, [GREEN_CODE]);
};
/** A fact is read-only: any observation of the page in its final form counts, as with the v2 chart fixtures. */
const photoCheck: FixtureCheck = (events) => events.some((event) => (event.kind === 'load' || event.kind === 'settled')
  && (event.fixtureState as Record<string, unknown> | undefined)?.family === 'photo-fact'
  && (event.fixtureState as Record<string, unknown>).source === 'raster-label');
/** The flow must be walked in order (A, B, C, D) and the final submitted value must be page A's code. */
const revisitCheck: FixtureCheck = (events) => {
  const wanted = [ROUTES.revisitA, ROUTES.revisitB, ROUTES.revisitC, ROUTES.revisitD];
  let next = 0;
  for (const event of events) if (event.kind === 'load' && event.path === wanted[next] && ++next === wanted.length) break;
  const last = events.filter((event) => event.kind === 'settled').at(-1);
  const state = last?.fixtureState as Record<string, unknown> | undefined;
  return next === wanted.length && last?.path === ROUTES.revisitD && state?.family === 'revisit-earlier' && state.submitted === REVISIT_ORDER_CODE;
};
const liveCheck: FixtureCheck = (events) => {
  const state = lastSettledState(events);
  return state?.family === 'live-update' && state.status === 'Ready' && state.collected === true && state.code === LIVE_PICKUP_CODE;
};

const CASES: CapabilityCase[] = [
  {
    id: 'capability-colour-swatch', category: 'visual', family: 'colour-swatch',
    structuralVariant: 'unlabelled colour-only swatch buttons with opaque variant codes',
    seed: 610101, route: ROUTES.swatch,
    prompt: (b) => `Open ${b}${ROUTES.swatch}. Select the green colour of the Trail Pack and add it to the cart. Report only the variant code shown in the cart confirmation.`,
    expected: { answer: GREEN_CODE, state: { kind: 'capability-v1', family: 'colour-swatch', selected: GREEN_CODE, cart: [GREEN_CODE] } },
    oracleId: 'capability-colour-swatch-oracle',
    nearMiss: { id: 'capability-colour-swatch-blue-variant', answer: BLUE_CODE, state: { kind: 'capability-v1', family: 'colour-swatch', selected: BLUE_CODE, cart: [BLUE_CODE] } },
    check: swatchCheck,
  },
  {
    id: 'capability-photo-fact', category: 'visual', family: 'photo-fact',
    structuralVariant: 'serial number painted into a canvas-generated PNG; alt text and page prose omit it',
    seed: 610102, route: ROUTES.photo,
    prompt: (b) => `Open ${b}${ROUTES.photo}. Read the parcel label in the photo and report the serial number printed on it (not the batch number). Reply with only the serial number.`,
    expected: { answer: PHOTO_SERIAL, state: { kind: 'capability-v1', family: 'photo-fact', source: 'raster-label' } },
    oracleId: 'capability-photo-fact-oracle',
    nearMiss: { id: 'capability-photo-fact-batch-number', answer: `Batch ${PHOTO_BATCH}`, state: { kind: 'capability-v1', family: 'photo-fact', source: 'raster-label' } },
    check: photoCheck,
  },
  {
    id: 'capability-revisit-earlier', category: 'navigation', family: 'revisit-earlier',
    structuralVariant: 'order code shown only on step 1 of 4 and re-entered on the verification form at step 4',
    seed: 610103, route: ROUTES.revisitA,
    prompt: (b) => `Open ${b}${ROUTES.revisitA}. Go through the checkout steps with the Continue links until the verification form, then enter the order code from the order confirmation page and verify the order. Report only the order code you entered.`,
    expected: { answer: REVISIT_ORDER_CODE, state: { kind: 'capability-v1', family: 'revisit-earlier', page: 'd', submitted: REVISIT_ORDER_CODE } },
    oracleId: 'capability-revisit-earlier-oracle',
    nearMiss: { id: 'capability-revisit-earlier-quote-reference', answer: REVISIT_DECOYS.quote, state: { kind: 'capability-v1', family: 'revisit-earlier', page: 'd', submitted: REVISIT_DECOYS.quote } },
    check: revisitCheck,
  },
  {
    id: 'capability-live-update', category: 'dynamic', family: 'live-update',
    structuralVariant: 'timer-driven Pending/Processing/Ready status gating an aria-disabled action',
    seed: 610104, route: ROUTES.live,
    prompt: (b) => `Open ${b}${ROUTES.live}. Wait until the order status reads Ready, then click Collect order and report only the pickup code it shows.`,
    expected: { answer: LIVE_PICKUP_CODE, state: { kind: 'capability-v1', family: 'live-update', status: 'Ready', collected: true, code: LIVE_PICKUP_CODE } },
    oracleId: 'capability-live-update-oracle',
    nearMiss: { id: 'capability-live-update-early-click', answer: LIVE_PICKUP_CODE, state: { kind: 'capability-v1', family: 'live-update', status: 'Processing', collected: false, code: null } },
    check: liveCheck,
  },
];

export const CAPABILITY_CASES = Object.freeze(CASES);
export const CAPABILITY_CHECKS = CAPABILITY_CASES.map(({ id, check }) => ({ taskId: id, check }));

export function gradeCapabilityCase(id: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const entry = CAPABILITY_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { ok: false, details: 'unknown capability case' };
  const answerOk = matchesCapabilityAnswer(entry, answer);
  const result = entry.check(events);
  const stateOk = typeof result === 'boolean' ? result : result.ok;
  return answerOk && stateOk
    ? { ok: true }
    : { ok: false, details: !answerOk ? 'answer does not match the capability oracle' : 'terminal state does not match the capability oracle' };
}

export function capabilityRoute(path: string): { body: string; type: string } | null {
  const pages: Record<string, () => string> = {
    [ROUTES.swatch]: swatchPage, [ROUTES.photo]: photoPage, [ROUTES.live]: livePage,
    [ROUTES.revisitA]: revisitPageA, [ROUTES.revisitB]: revisitPageB, [ROUTES.revisitC]: revisitPageC, [ROUTES.revisitD]: revisitPageD,
  };
  const make = pages[path];
  return make ? { body: make(), type: 'text/html; charset=utf-8' } : null;
}
