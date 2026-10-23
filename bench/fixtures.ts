/** Local fixture pages served over http://127.0.0.1 (same bytes for every tool). */
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { moreRoute } from './fixtures-more.js';
import { LONG_PAGES } from './fixtures-long.js';
import type { FixtureVariant } from './fixture-variants.js';

export interface FixtureObservation {
  /** Server-assigned receipt order; actionId resets on navigations and is not a terminal-state clock. */
  arrival: number;
  /** Hidden fixture-owned terminal state, when a workflow opts in to expose it. */
  fixtureState?: unknown;
  path: string;
  kind: 'load' | 'click' | 'input' | 'change' | 'submit' | 'scroll' | 'popstate' | 'settled';
  documentId: string;
  /** Page-side send order within one document; concurrent keepalive requests can arrive out of order. */
  seq?: number;
  actionId?: number;
  target: { tag: string; id: string; name: string; type: string; ariaLabel: string; text: string; href: string; value: string; checked: boolean };
  controls: Record<string, { value: string; checked: boolean }>;
  text: string;
  /** Opt-in long-suite trace. Absent unless the page defines `window.__fixtureLong`; historical suites never carry it. */
  long?: FixtureLongTrace;
}

/** One business-state change in a long workflow: the entity touched and its value before and after. */
export interface FixtureLongMutation { entity: string; field?: string; before: unknown; after: unknown }
/**
 * Page-reported evidence for the long-workflow suite. The page owns the authoritative ledger (`ledger`),
 * stable entity/operation identity and a monotonically increasing `revision`; `pending` counts delayed fixture
 * work (simulated requests, staged intermediate revisions) not yet committed. `url` includes query and hash;
 * `notification` is set on post-commit settlement notifications and page-hide flushes.
 */
export interface FixtureLongTrace {
  url?: string;
  revision?: number;
  entityId?: string;
  operationId?: string;
  mutations?: FixtureLongMutation[];
  pending?: number;
  ledger?: unknown;
  notification?: string;
  error?: string;
}

export interface FixtureCheckResult { ok: boolean; details?: string }
/** Authoritative observations retained with future benchmark attempts for offline regrading. */
export interface FixtureVerification extends FixtureCheckResult {
  provenance: {
    version: 1; taskId: string; attemptId: string; observationCount: number; events: FixtureObservation[];
    /** Last ledger-bearing observation after outstanding fixture work finished (long suites only). */
    longTerminal?: FixtureObservation | null;
  };
}
export type FixtureCheck = (events: FixtureObservation[]) => boolean | FixtureCheckResult;
export interface FixtureCheckEntry { taskId: string; check?: FixtureCheck }
export interface DevelopmentFixtureRoute { body: string; type: string }
export type DevelopmentFixtureRouter = (path: string) => DevelopmentFixtureRoute | null;

/** Hidden benchmark instrumentation. It records ordinary DOM events and post-action page state. */
const attemptBootstrap = String.raw`<script>(() => {
  const prefix = location.pathname.match(/^\/__attempt\/([A-Za-z0-9_-]+)(?:\/|$)/);
  if (prefix) sessionStorage.setItem('__fixture_attempt', prefix[1]);
})();</script>`;

const observer = String.raw`<script>
(() => {
  const prefix = location.pathname.match(/^\/__attempt\/([A-Za-z0-9_-]+)(?:\/|$)/);
  if (prefix) sessionStorage.setItem('__fixture_attempt', prefix[1]);
  const token = sessionStorage.getItem('__fixture_attempt');
  if (!token) return;
  const documentId = Math.random().toString(36).slice(2);
  let actionSerial = 0;
  let sendSerial = 0;
  const summarize = (el) => {
    if (!(el instanceof Element)) el = document.documentElement;
    const target = el.closest('button,a,input,select,textarea,[role="menuitem"],[data-plan],[data-v]') || el;
    return {
      tag: target.tagName.toLowerCase(), id: target.id || '', name: target.getAttribute('name') || '',
      type: target.getAttribute('type') || '', ariaLabel: target.getAttribute('aria-label') || '',
      text: (target.innerText || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160),
      href: target.getAttribute('href') || '', value: 'value' in target ? String(target.value) : '',
      checked: 'checked' in target ? Boolean(target.checked) : false
    };
  };
  const controls = () => {
    const result = {};
    for (const el of document.querySelectorAll('input,select,textarea')) {
      const value = { value: String(el.value), checked: Boolean(el.checked) };
      const key = el.id || (el.type === 'radio' ? el.name + ':' + el.value : el.name || el.type || el.tagName);
      result[key] = value;
      if (el.type === 'radio' && el.checked) result[el.name] = value;
    }
    return result;
  };
  const logicalPath = () => location.pathname.replace(/^\/__attempt\/[A-Za-z0-9_-]+/, '') || '/';
  // Opt-in long-suite evidence: only pages that define window.__fixtureLong carry it.
  const longTrace = (kind, reason) => {
    if (typeof window.__fixtureLong !== 'function') return undefined;
    let snapshot = {};
    try { snapshot = window.__fixtureLong(kind, reason) || {}; } catch (error) { snapshot = { error: String(error) }; }
    return { ...snapshot, url: logicalPath() + location.search + location.hash, notification: reason };
  };
  const send = (kind, target, targetSummary, controlState, actionId, reason) => {
    const data = { path: logicalPath(), kind, documentId, actionId, seq: ++sendSerial, target: targetSummary || summarize(target), controls: controlState || controls(), text: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 5000), fixtureState: window.__fixtureState || undefined, long: longTrace(kind, reason) };
    pending++;
    fetch('/__verify/' + encodeURIComponent(token), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data), keepalive: true }).catch(() => {}).finally(() => { pending--; });
  };
  // Observations not yet received by the grader, so tests can wait for them deterministically.
  let pending = 0;
  Object.defineProperty(window, '__fixturePending', { get: () => pending });
  send('load', document.documentElement);
  for (const kind of ['click','input','change','submit','scroll']) {
    document.addEventListener(kind, (event) => {
      const actionId = ++actionSerial;
      const summary = summarize(event.target);
      const state = controls();
      send(kind, event.target, summary, state, actionId);
      // A settled snapshot must describe the terminal DOM, not controls captured
      // before the event handler mutated them (or navigated away).
      setTimeout(() => send('settled', event.target, summary, undefined, actionId), 0);
    }, true);
  }
  // History traversal does not have a DOM target, but long-workflow hazards can
  // require proving that a real Back/Forward navigation occurred.
  addEventListener('popstate', () => send('popstate', document.body));
  if (window.__fixtureFrameObserver) addEventListener('message', () => setTimeout(() => send('settled', document.body), 0));
  // Explicit post-commit settlement for delayed updates: a long-workflow page calls this after each committed
  // revision (including late or intermediate ones) so the terminal state is observed after the work finishes.
  Object.defineProperty(window, '__fixtureNotify', { value: (reason) => {
    if (typeof window.__fixtureLong === 'function') setTimeout(() => send('settled', document.body, undefined, undefined, undefined, String(reason || 'commit')), 0);
  } });
  // Flush the ledger when the document goes away (navigation, tab close) so the last state is never lost.
  addEventListener('pagehide', () => { if (typeof window.__fixtureLong === 'function') send('settled', document.body, undefined, undefined, undefined, 'pagehide'); });
})();
</script>`;
/** Only opt-in v2 iframe workflows need a parent message settlement hook. */
const frameObserver = String.raw`<script>window.__fixtureFrameObserver=true;</script>`;

function instrument(html: string, includeFrameObserver = false): string {
  const bootstrapped = html.includes('</head>') ? html.replace('</head>', `${attemptBootstrap}</head>`) : `${attemptBootstrap}${html}`;
  const scripts = `${includeFrameObserver ? frameObserver : ''}${observer}`;
  return bootstrapped.includes('</body>') ? bootstrapped.replace('</body>', `${scripts}</body>`) : `${bootstrapped}${scripts}`;
}

/**
 * Restore page-side send order within each document. Every beacon is its own request, so two
 * near-simultaneous posts (a click and its settled snapshot) can reach the server swapped. Each
 * document keeps the arrival slots it occupied; only the events inside those slots are re-sorted
 * by `seq`, so cross-document order is untouched. Observations without `seq` are left as received.
 */
export function orderObservations(events: FixtureObservation[]): FixtureObservation[] {
  const byDocument = new Map<string, number[]>();
  events.forEach((event, index) => {
    if (typeof event.seq !== 'number') return;
    const slots = byDocument.get(event.documentId);
    if (slots) slots.push(index); else byDocument.set(event.documentId, [index]);
  });
  const ordered = [...events];
  for (const slots of byDocument.values()) {
    const sorted = slots.map((slot) => events[slot]).sort((a, b) => a.seq! - b.seq!);
    slots.forEach((slot, i) => { ordered[slot] = { ...sorted[i], arrival: events[slot].arrival }; });
  }
  return ordered;
}

interface AttemptState { taskId: string; events: FixtureObservation[]; pending: number; lastAt: number; nextArrival: number }

const newAttempt = (taskId: string): AttemptState => ({ taskId, events: [], pending: 0, lastAt: 0, nextArrival: 0 });

/** Observations are posted asynchronously, so wait until none is in flight and none has arrived for a while. */
const QUIET_MS = 250;
const MAX_WAIT_MS = 3000;
/** Long workflows simulate delayed requests: wait (bounded) until the page reports no outstanding fixture work. */
const LONG_MAX_WAIT_MS = 5000;
async function quiet(state: AttemptState | undefined): Promise<void> {
  const deadline = Date.now() + MAX_WAIT_MS;
  while (state && Date.now() < deadline && (state.pending > 0 || Date.now() - state.lastAt < QUIET_MS)) {
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  if (!state) return;
  const longDeadline = Date.now() + LONG_MAX_WAIT_MS;
  while (Date.now() < longDeadline && longWorkOutstanding(state)) {
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}
/** True while the last long-trace observation still reports delayed fixture work, or beacons are in flight/recent. */
function longWorkOutstanding(state: AttemptState): boolean {
  const last = orderObservations(state.events).filter((event) => event.long !== undefined).at(-1);
  if (!last) return false;
  return (last.long?.pending ?? 0) > 0 || state.pending > 0 || Date.now() - state.lastAt < QUIET_MS;
}
/** The authoritative terminal ledger: the last long-trace observation once outstanding work has completed. */
export function longTerminalObservation(events: FixtureObservation[]): FixtureObservation | null {
  return events.filter((event) => event.long !== undefined && event.long.ledger !== undefined).at(-1) ?? null;
}

const page = (title: string, body: string, script = ''): string =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title></head><body>${body}${script ? `<script>${script}</script>` : ''}</body></html>`;

const login = page(
  'Login — Acme',
  `<header><a href="/site/home">Home</a></header>
<main>
  <h1>Sign in</h1>
  <form aria-label="Login" id="f">
    <label for="email">Email</label>
    <input id="email" type="email" required>
    <label for="pw">Password</label>
    <input id="pw" type="password" required>
    <p id="err" role="alert"></p>
    <button type="submit">Sign in</button>
    <p>Forgot your password? <a href="/reset">Reset it</a></p>
  </form>
</main>`,
  `document.getElementById('f').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('pw').value;
    if (email !== 'agent@example.com' || password !== 'correct-horse-battery') {
      document.getElementById('err').textContent = 'Email or password is incorrect.';
      return;
    }
    document.title = 'Welcome — Acme';
    document.querySelector('h1').textContent = 'Signed in';
  });`,
);

const cookie = page(
  'Shop',
  `<main>
  <h1>Shop</h1>
  <p id="status">Cart is empty.</p>
  <button id="add">Add to cart</button>
  <a href="/more">More products</a>
</main>
<div id="overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10">
  <div role="dialog" aria-modal="true" aria-labelledby="ct" style="background:#fff;margin:100px auto;width:400px;padding:20px">
    <h2 id="ct">Accept cookies?</h2>
    <button onclick="document.getElementById('overlay').remove()">Accept</button>
    <button onclick="document.getElementById('overlay').remove()">Reject</button>
  </div>
</div>`,
  `document.getElementById('add').addEventListener('click', () => { document.getElementById('status').textContent = 'Added to cart (1 item).'; });`,
);

const N_ITEMS = 200;
const longlist = page(
  'Docs',
  `<header><a href="/site/home">Home</a></header>
<h1>Docs</h1>
<label for="flt">Filter</label>
<input id="flt" type="text" placeholder="Filter items">
<nav aria-label="Docs"><ul id="list">${Array.from({ length: N_ITEMS }, (_, i) => `<li><a href="/item/${i + 1}">Item ${i + 1}</a></li>`).join('')}</ul></nav>
<footer><p>${N_ITEMS} items</p></footer>`,
  `document.getElementById('flt').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    for (const li of document.querySelectorAll('#list li')) li.hidden = !li.textContent.toLowerCase().includes(q);
  });`,
);

const item = (n: string): string => page(`Item ${n}`, `<main><h1>Detail for item ${n}</h1><a href="/longlist">Back to the list</a></main>`);

const form = page(
  'Newsletter',
  `<main>
  <h1>Newsletter</h1>
  <form id="f" aria-label="Subscribe">
    <label for="c">Country</label>
    <select id="c"><option value="">Choose…</option><option value="us">United States</option><option value="ca">Canada</option><option value="de">Germany</option><option value="in">India</option></select>
    <label><input type="checkbox" id="n"> Send me the weekly newsletter</label>
    <button type="submit">Subscribe</button>
  </form>
  <p id="out"></p>
</main>`,
  `document.getElementById('f').addEventListener('submit', (e) => {
    e.preventDefault();
    const c = document.getElementById('c');
    document.getElementById('out').textContent = 'Subscribed from ' + (c.selectedOptions[0].text) + ' (weekly: ' + (document.getElementById('n').checked ? 'yes' : 'no') + ').';
  });`,
);

const nav = (title: string, body: string): string =>
  page(
    title,
    `<header><nav aria-label="Main"><a href="/site/home">Home</a> <a href="/site/pricing">Pricing</a> <a href="/site/about">About</a></nav></header><main>${body}</main><footer><p>© Example Corp</p></footer>`,
  );

const site: Record<string, string> = {
  home: nav('Home — Example Corp', '<h1>Welcome to Example Corp</h1><p>We make widgets for people who like widgets.</p><a href="/site/pricing">See our pricing</a>'),
  pricing: nav(
    'Pricing — Example Corp',
    '<h1>Pricing</h1><ul><li>Starter: $9 per month</li><li>Team: $29 per month</li><li>Enterprise: contact us</li></ul><button>Start free trial</button>',
  ),
  about: nav('About — Example Corp', '<h1>About us</h1><p>Founded in 2019.</p>'),
};

const NAMES = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne', 'Wonka', 'Tyrell', 'Cyberdyne'];
const rows = Array.from({ length: 60 }, (_, i) => {
  const name = `${NAMES[i % NAMES.length]} ${Math.floor(i / NAMES.length) + 1}`;
  const status = ['Active', 'Pending', 'Churned'][i % 3];
  const amount = (1000 + ((i * 7919) % 9000)).toLocaleString('en-US');
  return `<tr><td>${name}</td><td>${status}</td><td>$${amount}</td><td><button aria-label="Edit ${name}">Edit</button> <button aria-label="Archive ${name}">Archive</button></td></tr>`;
}).join('');
const dashboard = page(
  'Dashboard — Billing',
  `<header><a href="/site/home">Home</a> <a href="/site/pricing">Plans</a> <input type="search" aria-label="Search customers" placeholder="Search customers"></header>
<aside><nav aria-label="Sidebar"><a href="#">Overview</a> <a href="#">Customers</a> <a href="#">Invoices</a> <a href="#">Reports</a> <a href="#">Settings</a></nav></aside>
<main>
  <h1>Billing overview</h1>
  <p id="upd">Last updated: 10:00</p>
  <button id="ref">Refresh</button>
  <p>Total revenue: $123,456</p>
  <table><caption>Customers</caption><thead><tr><th>Name</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table>
</main>`,
  `document.getElementById('ref').addEventListener('click', () => { document.getElementById('upd').textContent = 'Last updated: just now'; });`,
);

function route(path: string): string | null {
  if (path === '/login') return login;
  if (path === '/cookie') return cookie;
  if (path === '/longlist') return longlist;
  if (path === '/form') return form;
  if (path === '/dashboard') return dashboard;
  const m = path.match(/^\/item\/(\d+)$/);
  if (m) return item(m[1]!);
  const s = path.match(/^\/site\/(\w+)$/);
  if (s && site[s[1]!]) return site[s[1]!]!;
  return null;
}

/** Start the fixture server on a random localhost port. Each attempt token has isolated evidence. */
export async function startFixtures(options: { checks?: FixtureCheckEntry[]; variant?: FixtureVariant | null; developmentRoute?: DevelopmentFixtureRouter } = {}): Promise<{
  base: string;
  baseFor: (taskId: string, attemptId: string) => string;
  verify: (taskId: string, attemptId?: string) => Promise<FixtureVerification | null>;
  close: () => Promise<void>;
}> {
  const checks = new Map((options.checks ?? []).map((entry) => [entry.taskId, entry.check]));
  // Preserve the frozen v1 response/evidence contract: fixture HTML is always
  // instrumented, including a plain startFixtures() response. V2 routes and
  // the frame-message settlement hook remain explicit opt-ins below.
  const instrumentResponses = true;
  const attempts = new Map<string, AttemptState>();
  const server: Server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    if (req.method === 'POST' && url.pathname.startsWith('/__verify/')) {
      const token = decodeURIComponent(url.pathname.slice('/__verify/'.length));
      const pending = attempts.get(token);
      if (pending) { pending.pending++; pending.lastAt = Date.now(); }
      let body = '';
      req.setEncoding('utf8');
      req.on('data', (part: string) => { body += part; });
      req.on('end', () => {
        try {
          const event = JSON.parse(body) as FixtureObservation;
          const state = attempts.get(token);
          if (state && event && typeof event.path === 'string' && Array.isArray(state.events)) state.events.push({ ...event, arrival: state.nextArrival++ });
        } catch { /* malformed observation is ignored */ }
        if (pending) { pending.pending--; pending.lastAt = Date.now(); }
        res.writeHead(204).end();
      });
      return;
    }
    let path = url.pathname;
    const attemptPrefix = path.match(/^\/__attempt\/([A-Za-z0-9_-]+)(\/.*)?$/);
    if (attemptPrefix) {
      const token = attemptPrefix[1]!;
      path = attemptPrefix[2] || '/';
      if (!attempts.has(token)) attempts.set(token, newAttempt(''));
    }
    const long = LONG_PAGES[path];
    const v2 = long === undefined ? (options.developmentRoute?.(path) ?? null) : null;
    const more = long === undefined ? (v2 ?? moreRoute(path)) : { body: long, type: 'text/html; charset=utf-8' };
    if (more) {
      res.writeHead(200, { 'content-type': more.type }).end(more.type.startsWith('text/html') ? (instrumentResponses ? instrument(options.variant?.html(more.body) ?? more.body, !!options.developmentRoute) : options.variant?.html(more.body) ?? more.body) : more.body);
      return;
    }
    const html = route(path);
    if (html === null) {
      res.writeHead(404, { 'content-type': 'text/html' }).end(page('Not found', '<h1>Not found</h1>'));
    } else {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(instrumentResponses ? instrument(options.variant?.html(html) ?? html, !!options.developmentRoute) : options.variant?.html(html) ?? html);
    }
  });
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok));
  const { port } = server.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;
  return {
    base,
    baseFor: (taskId, attemptId) => {
      if (!/^[A-Za-z0-9_-]+$/.test(attemptId)) throw new Error('attemptId must contain only letters, numbers, hyphens, and underscores');
      attempts.set(attemptId, newAttempt(taskId));
      return `${base}/__attempt/${encodeURIComponent(attemptId)}`;
    },
    verify: async (taskId, attemptId) => {
      if (attemptId === undefined) return null;
      const check = checks.get(taskId);
      if (!check) { attempts.delete(attemptId); return null; }
      // Let the final keepalive observations land, including after the agent closes its browser.
      const state = attempts.get(attemptId);
      await quiet(state);
      if (state && state.taskId !== taskId) return { ok: false, details: 'attempt belongs to a different task', provenance: { version: 1, taskId, attemptId, observationCount: 0, events: [] } };
      const events = orderObservations(state?.events ?? []);
      const result = check(options.variant ? events.map((event) => options.variant!.canonicalObservation(event)) : events);
      attempts.delete(attemptId);
      const checked = typeof result === 'boolean' ? { ok: result, details: result ? undefined : `fixture check failed (${events.length} observations)` } : result;
      const longTerminal = longTerminalObservation(events);
      return { ...checked, provenance: { version: 1, taskId, attemptId, observationCount: events.length, events: [...events], ...(longTerminal ? { longTerminal } : {}) } };
    },
    close: () => new Promise((ok) => server.close(() => ok())),
  };
}
