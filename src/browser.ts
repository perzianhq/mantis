import { existsSync, statSync } from 'node:fs';
import { basename, resolve as resolvePath } from 'node:path';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, ElementHandle, Frame, Page } from 'playwright';
import { bounded, capture, resolve } from './capture/index.js';
import type { RawNode, Snapshot } from './capture/index.js';
import { findInSnapshot, translate } from './translate.js';
import { matchOptions, optionHint } from './optionMatch.js';
import type { ReadOptions } from './translate.js';
import { SiteMemory, originOf } from './memory.js';
import { NO_CHANGE, answerReadyCue, diffSnapshots, headerLines } from './diff.js';
import { DATA_CHARS, listMedia, describeElement, formatData, formatTableRows } from './fallback/media.js';
import type { Target } from './fallback/media.js';
import { detectCaptcha, noHuman } from './fallback/captcha.js';
import { recognize, closeOcr } from './fallback/ocr.js';
import { downscale, pngSize } from './fallback/look.js';
import { chromiumExecutable, missingChromiumHint, userAgentFor } from './userAgent.js';
import { parseUntil, describeUntil, waitForHuman, DEFAULT_TIMEOUT_SECONDS } from './fallback/askHuman.js';

/** Transpiler helper shim for pages (see launch()). */
const NAME_SHIM = "Object.defineProperty(globalThis, '__name', { value: (f) => f, configurable: true });";

export interface MantisOptions {
  /** Run Chromium without a window. Default true; MANTIS_HEADLESS=0 shows it. */
  headless?: boolean;
  /** How long a click/type/select waits for the element to become actionable. */
  actionTimeoutMs?: number;
  /** Site memory (collapse regions already seen on this site). Default on; MANTIS_MEMORY=0 turns it off. */
  memory?: boolean;
  /** Where site memory is stored between sessions. Default MANTIS_MEMORY_DIR or ~/.cache/mantis/sites. */
  memoryDir?: string;
}

/** A failure the agent should see as a plain message. */
class ActionError extends Error {}

/** An issued number belongs to a document that has since been replaced. */
class NavigatedError extends Error {}

/** Split a selector list without mistaking commas in CSS syntax for separators. */
function splitSelectorList(selector: string): string[] {
  const tokens: string[] = [];
  let start = 0;
  let brackets = 0;
  let parentheses = 0;
  let quote = '';
  let escaped = false;
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i]!;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[') {
      brackets++;
    } else if (char === ']') {
      brackets = Math.max(0, brackets - 1);
    } else if (char === '(') {
      parentheses++;
    } else if (char === ')') {
      parentheses = Math.max(0, parentheses - 1);
    } else if (char === ',' && !brackets && !parentheses) {
      tokens.push(selector.slice(start, i));
      start = i + 1;
    }
  }
  tokens.push(selector.slice(start));
  return tokens;
}

const FRAME_OPERATION_MS = 1_500;

type NavigationWatch = {
  page: Page;
  started: Promise<boolean>;
  hasStarted: () => boolean;
  /** The main frame has committed (or its URL already differs from the action's start). */
  hasCommitted: () => boolean;
  remainingMs: () => number | null;
  finished: Promise<'finished'>;
  failureMessage: string;
  cancel: () => void;
};

type ToolTiming = {
  tool: string;
  start: number;
  /** Exclusive durations: nested work is charged to its own phase, not its caller. */
  phases: Map<string, number>;
  scans?: Map<string, number>;
  stack?: { phase: string; start: number; children: number }[];
  settle?: string;
  routeRetry?: 'fired' | '1/changed' | '1/same';
};

/** Live count badges and durations may tick without changing a persisted control's identity. */
function sameIdentity(
  issued: { id?: number; role: string; name: string; href?: string },
  current: { id?: number; role: string; name: string; href?: string },
  allowLiveNameChange = false,
): boolean {
  if (issued.role !== current.role || issued.href !== current.href) return false;
  if (!allowLiveNameChange) return issued.name === current.name;
  // Only a persisted registry identity can safely retain an issued id while a live
  // badge or countdown ticks. A replacement/rematch must keep its name exactly.
  if (issued.id === undefined || issued.id !== current.id) return issued.name === current.name;
  const withoutLiveCounts = (name: string): string => name
    .replace(/([\[(]\s*)\d+(?:[.,]\d+)*(?=\s*[\])])/g, '$1#')
    .replace(/\b(in\s+)\d+(?:[.,]\d+)*\s*(?:ms|msec(?:ond)?s?|s|sec(?:ond)?s?|m|mins?|minutes?|h|hours?)\b/gi, '$1#')
    .replace(/\b\d+(?:[.,]\d+)*\s*(?:ms|msec(?:ond)?s?|s|sec(?:ond)?s?|m|mins?|minutes?|h|hours?)(\s+remaining)\b/gi, '#$1');
  return withoutLiveCounts(issued.name) === withoutLiveCounts(current.name);
}

/**
 * Runs in every page before its own scripts. Tags the document (so a navigation is told apart from
 * a re-render) and counts pending timers and in-flight fetch/XHR, so settle() can wait for
 * work an action kicked off, such as content that appears 500ms after a click.
 */
const TRACKER = `(() => {
  if (window.__mantisDoc) return;
  window.__mantisDoc = Math.random().toString(36).slice(2) + Date.now().toString(36);
  // This runs before the document's own scripts. Its epoch deliberately includes
  // load-time work in a destination document, while actions overwrite it below.
  window.__mantisDocStart = performance.now();
  window.__mantisEpoch = window.__mantisDocStart;
  window.__mantisEpochDoc = window.__mantisDoc;
  const st = window.setTimeout, ct = window.clearTimeout;
  const si = window.setInterval, ci = window.clearInterval;
  // Every pending timer and request remembers its "origin": when the work that caused it began.
  // Work started inside a tracked timer callback inherits that timer's origin, so a polling chain
  // (a timer re-arming itself) keeps its first origin forever and is told apart from what an action
  // started. settle() only waits for work whose origin is at or after the action.
  let currentOrigin = null;
  const live = new Map(); // timer id -> {origin, interval, delay, chained}
  const reqs = new Set(); // one entry {origin} per in-flight request
  const originNow = () => (currentOrigin !== null ? currentOrigin : performance.now());
  // A timeout scheduled from another timeout callback is a polling chain. Keep that
  // distinction so settle can treat it like an interval without hiding a one-shot result.
  let currentTimerChain = false;
  window.__mantisSetTimeout = st.bind(window);
  // settle() sets this while it waits on pending work, so a finished timer re-checks at once instead of at the next poll.
  window.__mantisWake = null;
  window.setTimeout = function (fn, ms, ...rest) {
    if (typeof fn !== 'function') return st.call(this, fn, ms, ...rest);
    const origin = originNow();
    const chained = currentTimerChain;
    let id;
    id = st.call(this, function () {
      live.delete(id);
      const prev = currentOrigin;
      const prevChain = currentTimerChain;
      currentOrigin = origin;
      currentTimerChain = true;
      try { return fn.apply(this, arguments); } finally { currentOrigin = prev; currentTimerChain = prevChain; if (window.__mantisWake) window.__mantisWake(); }
    }, ms, ...rest);
    live.set(id, { origin, interval: false, delay: Number.isFinite(Number(ms)) ? Math.max(0, Number(ms)) : 0, chained });
    return id;
  };
  window.clearTimeout = function (id) { live.delete(id); return ct.call(this, id); };
  window.setInterval = function (fn, ms, ...rest) {
    if (typeof fn !== 'function') return si.call(this, fn, ms, ...rest);
    const origin = originNow();
    const id = si.call(this, function () {
      const prev = currentOrigin;
      const prevChain = currentTimerChain;
      currentOrigin = origin;
      currentTimerChain = false;
      try { return fn.apply(this, arguments); } finally { currentOrigin = prev; currentTimerChain = prevChain; }
    }, ms, ...rest);
    live.set(id, { origin, interval: true, delay: Number.isFinite(Number(ms)) ? Math.max(0, Number(ms)) : 0, chained: false });
    return id;
  };
  window.clearInterval = function (id) { live.delete(id); return ci.call(this, id); };
  const f = window.fetch;
  if (f) window.fetch = function () {
    const req = { origin: originNow() };
    reqs.add(req);
    const done = () => { reqs.delete(req); };
    let p;
    try { p = f.apply(this, arguments); } catch (e) { done(); throw e; }
    p.then(done, done);
    return p;
  };
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const req = { origin: originNow() };
    reqs.add(req);
    const done = () => { reqs.delete(req); };
    this.addEventListener('loadend', done);
    try { return send.apply(this, arguments); } catch (e) { done(); throw e; }
  };
  // Is short-lived work that began at or after \`since\` (performance.now()) still pending? No argument: any.
  window.__mantisBusy = (since, includeIntervals = false, maxDelay = Infinity, minIntervalDelay = 0) => {
    const from = since === undefined ? -Infinity : since;
    for (const timer of live.values()) if (timer.origin >= from && timer.delay <= maxDelay && (timer.interval ? includeIntervals && timer.delay >= minIntervalDelay : true)) return true;
    for (const req of reqs) if (req.origin >= from) return true;
    return false;
  };
  window.__mantisBusyKinds = (since, includeIntervals = false, maxDelay = Infinity, minIntervalDelay = 0) => {
    const from = since === undefined ? -Infinity : since;
    const kinds = { timer: false, chained: false, interval: false, request: false, oneShotDelay: -1 };
    for (const timer of live.values()) {
      if (timer.origin < from || timer.delay > maxDelay) continue;
      if (timer.interval) {
        if (includeIntervals && timer.delay >= minIntervalDelay) kinds.interval = true;
      } else {
        kinds.timer = true;
        if (timer.chained) kinds.chained = true;
        else kinds.oneShotDelay = Math.max(kinds.oneShotDelay, timer.delay);
      }
    }
    for (const req of reqs) if (req.origin >= from) kinds.request = true;
    return kinds;
  };
  // Elements given a click-type listener in script: clickable even without a role, link or tabindex.
  const clicky = new WeakSet();
  window.__mantisClick = clicky;
  const CLICK_EVENTS = new Set(['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart']);
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (CLICK_EVENTS.has(type) && this instanceof Element) clicky.add(this);
    return add.call(this, type, fn, opts);
  };
  const onclick = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick');
  if (onclick && onclick.set) {
    Object.defineProperty(HTMLElement.prototype, 'onclick', {
      ...onclick,
      set(fn) { if (fn) clicky.add(this); return onclick.set.call(this, fn); },
    });
  }
  // Bumped by anything that can change what a scan sees, so an unchanged page can reuse its last scan.
  window.__mantisMut = 0;
  // DOM mutations only (not scroll/input/hover): lets settle() tell an action that changed nothing from one that did.
  window.__mantisDomChanges = 0;
  const bump = () => { window.__mantisMut++; };
  const domBump = () => { window.__mantisMut++; window.__mantisDomChanges++; };
  // An observer on the document does not see inside shadow roots. Open roots are tracked here (those
  // attached later through attachShadow, nested ones, and ones the parser made, found by a scan) so every
  // observer can be pointed at them too. Bounded: past MAX_SHADOW_ROOTS the roots are not tracked and
  // __mantisShadowFull makes page snapshots non-reusable. Closed roots are invisible to script and out of scope.
  const MAX_SHADOW_ROOTS = 256;
  const MAX_SCAN_NODES = 30000;
  const shadowRoots = [];
  const knownRoots = new WeakSet();
  const watchers = new Set();
  window.__mantisShadowFull = false;
  const trackRoot = (root) => {
    if (knownRoots.has(root)) return;
    if (shadowRoots.length >= MAX_SHADOW_ROOTS) {
      for (let i = shadowRoots.length - 1; i >= 0; i--) if (!shadowRoots[i].deref()) shadowRoots.splice(i, 1);
      if (shadowRoots.length >= MAX_SHADOW_ROOTS) { window.__mantisShadowFull = true; return; }
    }
    knownRoots.add(root);
    shadowRoots.push(new WeakRef(root));
    for (const watch of watchers) watch(root);
  };
  const attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const root = attachShadow.call(this, init);
    if (init && init.mode === 'open') trackRoot(root);
    return root;
  };
  let scanned = -1;
  const scanShadows = () => {
    if (scanned === window.__mantisDomChanges) return;
    scanned = window.__mantisDomChanges;
    let budget = MAX_SCAN_NODES;
    const walk = (start) => {
      const walker = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENT);
      for (let n = walker.nextNode(); n && budget-- > 0; n = walker.nextNode()) {
        if (n.shadowRoot) { trackRoot(n.shadowRoot); walk(n.shadowRoot); }
      }
    };
    walk(document);
  };
  window.__mantisObserveShadows = (observer, options) => {
    scanShadows();
    const watch = (root) => { try { observer.observe(root, options); } catch (e) {} };
    for (const ref of shadowRoots) { const root = ref.deref(); if (root) watch(root); }
    watchers.add(watch);
    return () => { watchers.delete(watch); };
  };
  const MUTATIONS = { subtree: true, childList: true, attributes: true, characterData: true };
  const domObserver = new MutationObserver(domBump);
  domObserver.observe(document, MUTATIONS);
  window.__mantisObserveShadows(domObserver, MUTATIONS);
  addEventListener('DOMContentLoaded', scanShadows, { once: true });
  // Hover and animation lifecycle events do not themselves change the captured DOM. Their
  // previous inclusion made a completed action look new to its immediately following read().
  // DOM changes caused by either still arrive through the mutation observer above.
  for (const ev of ['scroll', 'input', 'change', 'focusin', 'focusout', 'resize', 'load', 'toggle']) {
    addEventListener(ev, bump, { capture: true, passive: true });
  }
})();`;

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** First meaningful line of a Playwright error, without the call log. */
function brief(e: unknown): string {
  const first = String(e instanceof Error ? e.message : e).split('\n')[0] ?? '';
  return first.replace(/^[\w.]+: /, '').trim().slice(0, 200) || 'unknown error';
}

/** The final actionability state reported by Playwright for a failed click. */
export type ClickFailure = 'not-visible' | 'outside-viewport' | 'intercepted';

/**
 * Read Playwright's final actionability state rather than its retry log preamble.
 * "waiting for element to be visible" is emitted for every click attempt, including
 * ones that did become visible and later timed out waiting for navigation.
 */
export function classifyClickError(e: unknown): ClickFailure | null {
  const message = String(e instanceof Error ? e.message : e);
  const states: Array<{ at: number; failure: ClickFailure | null; clears: 'visibility' | 'all' }> = [];
  const add = (pattern: RegExp, failure: ClickFailure | null, clears: 'visibility' | 'all' = 'all'): void => {
    for (const match of message.matchAll(pattern)) states.push({ at: match.index ?? -1, failure, clears });
  };
  add(/element is not visible/gi, 'not-visible');
  add(/(?:element is )?outside of the viewport/gi, 'outside-viewport');
  add(/intercepts pointer events/gi, 'intercepted');
  // These are successful later states, not failures. Keep them in the sequence so
  // a retry-log preamble cannot outweigh a click that reached navigation waiting.
  // Visibility only proves the element is visible: every retry logs it before the
  // hit-target check, so a timeout landing there must keep the earlier interception.
  add(/element is visible, enabled and stable/gi, null, 'visibility');
  add(/waiting for scheduled navigations/gi, null);
  states.sort((a, b) => a.at - b.at);
  let current: ClickFailure | null = null;
  for (const state of states) {
    if (state.failure) current = state.failure;
    else if (state.clears === 'all' || current === 'not-visible') current = null;
  }
  return current;
}

/** How long Playwright keeps retrying a click on an element something else is covering. */
const COVERED_CLICK_TIMEOUT = 600;

/** Navigation gets its own budget after a click has dispatched. */
const NAVIGATION_TIMEOUT = 5000;
/** A brief, bounded chance for a non-interactive painted veil to finish clearing. */
const VEIL_CLEAR_TIMEOUT = 1500;
const VEIL_RECHECK_MS = 100;

/**
 * Page-side predicate for a visually hidden labelable control and its rendered label.
 * This is deliberately self-contained because Playwright serializes evaluate callbacks.
 */
function renderedLabelForHiddenControl(target: Element): HTMLLabelElement | null {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement || target instanceof HTMLButtonElement)) return null;
  const rect = target.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const parent = (node: Element): Element | null =>
    node.parentElement ?? (node.getRootNode() instanceof ShadowRoot ? (node.getRootNode() as ShadowRoot).host : null);
  const effectiveOpacity = (element: Element): number => {
    let opacity = 1;
    for (let node: Element | null = element; node; node = parent(node)) {
      const value = parseFloat(getComputedStyle(node).opacity);
      if (!Number.isNaN(value)) opacity *= value;
    }
    return opacity;
  };
  const style = getComputedStyle(target);
  const clip = style.clip.replace(/\s+/g, '').toLowerCase();
  const path = style.clipPath.replace(/\s+/g, '').toLowerCase();
  const alwaysHidden = rect.width <= 4 || rect.height <= 4 ||
    /^rect\((?:0(?:px)?,){3}0(?:px)?\)$/.test(clip) || path === 'inset(50%)' || path === 'inset(100%)';
  const transparent = effectiveOpacity(target) < 0.01;
  if ((!alwaysHidden && !transparent) || !target.labels) return null;
  if (!alwaysHidden) {
    const left = Math.max(rect.left, 0);
    const right = Math.min(rect.right, innerWidth);
    const top = Math.max(rect.top, 0);
    const bottom = Math.min(rect.bottom, innerHeight);
    // Preserve the hidden-control path when there is no visible centre to test.
    if (left < right && top < bottom) {
      const root = target.getRootNode();
      const scope: Document | ShadowRoot = root instanceof ShadowRoot ? root : document;
      const hit = scope.elementFromPoint((left + right) / 2, (top + bottom) / 2);
      if (hit === target || !!hit && target.contains(hit)) return null;
    }
  }
  for (const label of Array.from(target.labels)) {
    const labelStyle = getComputedStyle(label);
    const labelRect = label.getBoundingClientRect();
    if (labelStyle.display !== 'none' && labelStyle.visibility === 'visible' &&
        effectiveOpacity(label) > 0 && labelRect.width >= 4 && labelRect.height >= 4) return label;
  }
  return null;
}

/** The unrelated element on top of a click target (see coveredBy). */
interface Cover {
  desc: string;
  hitId?: number;
  close?: { id: number; name: string };
  controls: { id: number; name: string }[];
  /** A dialog, or a layer that offers a numbered control the agent can use. */
  interactive: boolean;
  /** A nearby loading signal makes the short recheck especially likely to help. */
  busy: boolean;
  /** Nothing visible in the overlay (no text, background, border, shadow or content): a real pointer is blocked but a user would not see why. */
  invisible: boolean;
  /** An expanded combobox owns this suggestion popup and can close it with Escape or a selection. */
  comboboxPopup: boolean;
}

/**
 * One Chromium, one active page. Actions return short text; read() returns the
 * numbered view of the page.
 */
export class MantisBrowser {
  /** Last scan and the page state it was taken at (see observe / unchanged). */
  private last: { page: Page; doc: string; mut: number; snap: Snapshot } | null = null;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  /** Pages whose listeners have already been installed (newPage also fires context's page event). */
  private readonly adopted = new WeakSet<Page>();
  /** The opener to return to when an active popup closes. */
  private readonly opener = new WeakMap<Page, Page | null>();
  private labels = new Map<number, string>();
  /** Identity each number had when it was last shown to the agent. */
  private known = new Map<number, { id: number; role: string; name: string; href?: string; doc: string | null }>();
  /** A click watcher that has not yet seen its navigation start. */
  private pendingNavigation: NavigationWatch | null = null;
  private notes: string[] = [];
  private scratch: BrowserContext | null = null;
  private readonly actionTimeout: number;
  private readonly memory: SiteMemory;
  /** Present only while MANTIS_TIMING is enabled; normal calls do no timing work. */
  private timing: ToolTiming | null = null;
  /** A target's mandatory live validation can also be the action's before snapshot. */
  private actionBefore: { page: Page; snap: Snapshot; doc: string | null } | null = null;

  constructor(private readonly opts: MantisOptions = {}) {
    this.actionTimeout = opts.actionTimeoutMs ?? 5000;
    this.memory = new SiteMemory({ enabled: opts.memory, dir: opts.memoryDir });
  }

  async launch(): Promise<void> {
    if (this.browser) return;
    const headless = this.opts.headless ?? process.env.MANTIS_HEADLESS !== '0';
    this.browser = await chromium.launch({ headless, ...chromiumExecutable() }).catch((e: unknown) => {
      throw new Error(missingChromiumHint(e) ?? (e instanceof Error ? e.message : String(e)));
    });
    // Headless Chromium announces itself as "HeadlessChrome", which some sites answer with a degraded page.
    const userAgent = headless || process.env.MANTIS_USER_AGENT ? await userAgentFor(this.browser) : undefined;
    this.context = await this.browser.newContext({ viewport: { width: 1280, height: 800 }, ...(userAgent ? { userAgent } : {}) });
    // Transpilers (tsx, vitest) wrap named functions in a __name() helper that does not
    // exist in the page; define it (as a string, so it is not itself wrapped).
    await this.context.addInitScript("Object.defineProperty(globalThis, '__name', { value: (f) => f, configurable: true });");
    await this.context.addInitScript(TRACKER);
    this.context.on('page', (p) => this.adopt(p));
    this.adopt(await this.context.newPage());
  }

  async close(): Promise<void> {
    const b = this.browser;
    this.browser = this.context = this.page = this.scratch = null;
    await closeOcr();
    await b?.close().catch(() => undefined);
  }

  /** Raw structured snapshot of the active page (library use). */
  async snapshot(): Promise<Snapshot> {
    return capture(await this.activePage());
  }

  async open(url: string): Promise<string> {
    return this.guard(async () => {
      const page = await this.activePage();
      const target = /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
      for (let attempt = 0; ; attempt++) {
        try {
          await this.timed('navigate', () => page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 }));
          break;
        } catch (e) {
          // Chromium commits the error page of an earlier failed load late, which can
          // interrupt this navigation. Let things quiet down; if we ended up where we
          // wanted to be, that is success, otherwise retry.
          if (attempt < 2 && /interrupted by another navigation/.test(String(e))) {
            await sleep(300);
            await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => undefined);
            if (page.url() === new URL(target).href) break;
            continue;
          }
          if (/net::ERR_BLOCKED_BY_RESPONSE/i.test(String(e))) {
            throw new ActionError(`could not open ${target}: blocked by the site; do not retry this URL; choose another route or report blocked`);
          }
          if (/net::/.test(String(e))) await page.waitForURL(/^chrome-error:/, { timeout: 3000 }).catch(() => undefined);
          throw new ActionError(`could not open ${target}: ${brief(e)}`);
        }
      }
      await this.timed('wait', () => this.settle(page, false, null, true));
      // A navigation starts a new page-scoped number registry. Identities from the previous
      // document must never be mistaken for a newly allocated media/control number.
      this.labels.clear();
      this.known.clear();
      const captchaPromise = detectCaptcha(page);
      let observed = await this.timed('capture', () => this.observe(page));
      const controls = observed.snap.nodes.filter((n) => n.kind === 'interactive');
      const disabled = controls.filter((n) => n.states.includes('disabled') || n.states.includes('looks disabled'));
      const covered = controls.filter((n) => n.covered && n.inViewport && !n.srOnly);
      const blocked = controls.filter((n) => disabled.includes(n) || covered.includes(n));
      const dialogAlreadyShown = observed.snap.nodes.some((n) => n.kind === 'region' && n.role === 'dialog' && n.inViewport);
      // Several covered controls in view indicate a page layer. A lone covered control is often
      // a sticky bar or a screen-reader-only link, neither of which merits the late-dialog wait.
      // Several truly disabled controls on first load usually mean the page is still hydrating.
      const hydrating = this.hasDisabledControls(observed.snap);
      const gated = !dialogAlreadyShown && (hydrating || covered.length >= 2 || (blocked.length >= 2 && blocked.length * 2 >= controls.length));
      if (gated && await this.timed('dialog', () => this.waitForLateDialog(page, disabled.map((n) => n.id!).filter((id) => id !== undefined), hydrating ? 1500 : 1000))) {
        observed = await this.timed('capture', () => this.observe(page));
      }
      const snap = observed.snap;
      let text = this.timedSync('translate', () => this.render(snap, {}, observed.doc));
      const captcha = await this.timed('captcha', () => captchaPromise);
      if (captcha) text += `\n${captcha}`;
      if (hydrating && this.hasDisabledControls(snap)) text += `\n${this.hydrationNote()}`;
      return this.notes.length ? `${text}\n${this.notes.splice(0).join('\n')}` : text;
    }, 'open');
  }

  /**
   * The numbered view of the page. `region` narrows to one region; `full` turns trimming off within a bounded excerpt;
   * `fresh` shows regions in full that site memory would otherwise summarise (as `full` and `region` also do).
   */
  async read(opts: ReadOptions = {}): Promise<string> {
    return this.guard(async () => this.view(await this.activePage(), opts), 'read');
  }

  /** Search the whole page, including parts read() trimmed or summarised, for controls and text. */
  async find(query: string | string[], contextChars?: number): Promise<string> {
    return this.guard(async () => {
      const page = await this.activePage();
      const captchaPromise = detectCaptcha(page);
      const observed = (await this.unchanged(page)) ?? (await this.timed('capture', () => this.observe(page)));
      const { snap } = observed;
      this.remember(snap, observed.doc);
      const text = findInSnapshot(snap, query, 20, contextChars);
      const captcha = await this.timed('captcha', () => captchaPromise);
      return captcha ? `${text}\n${captcha}` : text;
    }, 'find');
  }

  /** Clear what site memory holds about the current site (this session and on disk). */
  async forget(): Promise<string> {
    return this.guard(async () => {
      const page = await this.activePage();
      const origin = originOf(page.url());
      if (!this.memory.enabled) return 'site memory is off (MANTIS_MEMORY=0); nothing to forget';
      if (!origin) return 'no site is open; nothing to forget';
      this.memory.forget(origin);
      return `forgot everything remembered about ${origin === 'file://' ? 'local files' : origin}; the next read shows every region in full`;
    }, 'forget');
  }

  async click(id: number): Promise<string> {
    return this.act('click', async (page) => {
      const { el, label } = await this.target(page, id);
      const inactive = await this.inactiveController(el);
      if (inactive) {
        await el.dispose();
        throw new ActionError(this.inactiveMessage(label, inactive));
      }
      const associatedLabel = await this.renderedAssociatedLabel(el);
      let cover = await this.coveredBy(el, associatedLabel);
      let navigation: NavigationWatch | null = null;
      let dispatched = false;
      try {
        // A painted layer with no dialog or controls is often a loading veil. Re-hit-test it for a
        // short, fixed interval instead of spending the normal click timeout on something nobody can dismiss.
        if (cover && !cover.interactive && !cover.invisible) {
          cover = await this.waitForVeilToClear(el, associatedLabel, cover);
          // An empty layer still intercepts a real pointer, but has nothing an agent could dismiss.
          // Let the normal click path reach its existing click-through fallback.
          if (cover && !cover.invisible) throw new ActionError(this.coveredMessage(label, cover, await this.linkHref(el)));
        }
        const clickTarget = associatedLabel && !cover ? associatedLabel : el;
        const clickTimeout = cover ? COVERED_CLICK_TIMEOUT : this.actionTimeout;
        navigation = this.watchNavigation(page);
        // The watcher is installed first so a navigation from this dispatch is not missed.
        // Its detection and completion budgets begin only after Playwright has dispatched.
        await clickTarget.click({ timeout: clickTimeout, noWaitAfter: true });
        dispatched = true;
      } catch (e) {
        if (e instanceof ActionError) throw e;
        const msg = String(e instanceof Error ? e.message : e);
        // ElementHandle's noWaitAfter is deprecated in recent Playwright releases and may still
        // surface its timeout after the click has already dispatched. Playwright's own navigation
        // wait is the proof the action fired; an unrelated main-frame navigation is not.
        if (/waiting for scheduled navigations to finish/i.test(msg)) {
          dispatched = true;
        } else if (!(dispatched = await this.clickFallback(page, el, id, msg, associatedLabel))) {
          const blocked = cover && /intercepts pointer events|Timeout/.test(msg) ? cover : null;
          // An empty transparent layer is nothing the agent could dismiss: click the element itself.
          if (blocked?.invisible) {
            await el.evaluate((n) => n instanceof HTMLElement ? n.click() : n.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
            dispatched = true;
          } else {
            navigation?.cancel();
            throw new ActionError(blocked ? this.coveredMessage(label, blocked) : this.explain(e, label));
          }
        }
      } finally {
        await associatedLabel?.dispose().catch(() => undefined);
        await el.dispose();
      }
      if (dispatched && navigation) {
        // Keep the watcher through settle. It observes immediate and delayed navigations there,
        // avoiding a fixed start race on actions that stay in the current document.
        this.pendingNavigation = navigation;
      } else navigation?.cancel();
      return `clicked ${label}`;
    }, { targetScan: true });
  }

  async type(id: number, text: string, submit = false): Promise<string> {
    return this.act('type', async (page) => {
      const { el, label } = await this.target(page, id);
      let navigation: NavigationWatch | null = null;
      try {
        await el.fill(text, { timeout: this.actionTimeout });
        if (submit) {
          navigation = this.watchNavigation(page, 'submit');
          await el.press('Enter', { timeout: this.actionTimeout, noWaitAfter: true });
        }
      } catch (e) {
        throw new ActionError(this.explain(e, label));
      } finally {
        await el.dispose();
      }
      if (navigation) this.pendingNavigation = navigation;
      const shown = label.includes('(password)') ? '•••' : `"${text.length > 40 ? text.slice(0, 39) + '…' : text}"`;
      return `typed ${shown} into ${label.replace(' (password)', '')}${submit ? ' and pressed Enter' : ''}`;
    }, { requestGrace: !submit, targetScan: true, ...(submit ? {} : { bounds: { max: 1500, idleGrace: 60 } }) });
  }

  async select(id: number, option: string | string[]): Promise<string> {
    return this.act('select', async (page) => {
      const { el, label } = await this.target(page, id);
      try {
        const native = await el.evaluate((node) => node instanceof HTMLSelectElement);
        // A link that really goes somewhere would navigate away before any option could be chosen;
        // a dropdown toggle (hash or script href, or marked as a popup trigger) is fine.
        const navigates = !native && await el.evaluate((node) => {
          if (!(node instanceof HTMLAnchorElement)) return false;
          const href = node.getAttribute('href') ?? '';
          const popup = node.hasAttribute('aria-haspopup') || node.hasAttribute('aria-expanded') || node.hasAttribute('aria-controls') ||
            node.hasAttribute('data-toggle') || node.hasAttribute('data-bs-toggle');
          return !popup && href !== '' && !href.startsWith('#') && !/^javascript:/i.test(href);
        });
        if (navigates) throw new ActionError(`${label} is a link to another page, not a select; click it to follow it`);
        const picked = native
          ? await this.chooseOption(el, label, option)
          : await this.chooseCustomOption(el, label, typeof option === 'string' ? option : this.oneOption(option, label));
        return `selected "${picked}" in ${label}`;
      } catch (e) {
        throw e instanceof ActionError ? e : new ActionError(this.explain(e, label));
      } finally {
        await el.dispose();
      }
    }, { targetScan: true });
  }

  /** Custom comboboxes choose one option per call; a one-element list is accepted. */
  private oneOption(option: string[], label: string): string {
    if (option.length !== 1) throw new ActionError(`${label} is not a multi-select <select>; give one option per call`);
    return option[0]!;
  }

  /**
   * Match `option` against a <select>'s options (value, exact label, case-insensitive label, substring) and choose it.
   * A list is only valid for <select multiple>; it replaces the whole selection with exactly those options.
   */
  private async chooseOption(el: ElementHandle<Element>, label: string, option: string | string[]): Promise<string> {
    const wants = Array.isArray(option) ? option : [option];
    const found = await el.evaluate((node) => {
      if (!(node instanceof HTMLSelectElement)) return { notSelect: true as const };
      const opts = Array.from(node.options).map((o) => ({ value: o.value, label: (o.label || o.text).replace(/\s+/g, ' ').trim() }));
      return { multiple: node.multiple, opts };
    });
    if ('notSelect' in found) {
      throw new ActionError(`${label} is not a <select>; click it, then click the option you want`);
    }
    if (wants.length > 1 && !found.multiple) {
      throw new ActionError(`${label} is a single-choice select; give one option, not ${wants.length}`);
    }
    const labels = found.opts.map((o) => o.label);
    const hits: number[] = [];
    for (const want of wants) {
      const m = matchOptions(found.opts, want);
      if (!m.hits.length) {
        throw new ActionError(`no option "${want}" in ${label}; ${optionHint(labels, want)}`);
      }
      if (m.loose && m.hits.length > 1) {
        throw new ActionError(`ambiguous option "${want}" in ${label}; candidates: ${m.hits.slice(0, 15).map((i) => labels[i]).join(' | ')}`);
      }
      hits.push(m.hits[0]!);
    }
    await el.selectOption(hits.map((index) => ({ index })), { timeout: this.actionTimeout });
    return hits.map((i) => labels[i]).join(', ');
  }

  /** Open a custom combobox/listbox and choose its one unambiguous matching option. */
  private async chooseCustomOption(el: ElementHandle<Element>, label: string, option: string): Promise<string> {
    // Runs in the control's own frame: lists the visible options of its popup and matches
    // the wanted text exactly, then case-insensitively, then as a substring.
    const ITEMS = '[role="option"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], option, a[href], button, li';
    const scan = () => el.evaluateHandle((control, items) => {
      const clean = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();
      const visible = (node: Element): boolean => {
        if (!node.getClientRects().length) return false;
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.visibility !== 'collapse';
      };
      const doc = control.ownerDocument;
      const ids = (control.getAttribute('aria-controls') || control.getAttribute('aria-owns') || '').split(/\s+/).filter(Boolean);
      const roots: Element[] = [];
      if (control.getAttribute('role') === 'listbox') roots.push(control);
      for (const id of ids) {
        const root = doc.getElementById(id);
        if (root && visible(root)) roots.push(root);
      }
      // A popup rendered outside the combobox is common. If ARIA does not identify it,
      // use the visible listbox only when that is the sole possible popup.
      if (!roots.length) {
        const lists = Array.from(doc.querySelectorAll('[role="listbox"], [role="menu"]')).filter(visible);
        if (lists.length === 1) roots.push(lists[0]!);
      }
      const options: Element[] = [];
      const add = (node: Element): void => { if (!options.includes(node) && visible(node)) options.push(node); };
      for (const root of roots) {
        if (root.matches('[role="option"], option')) add(root);
        for (const node of Array.from(root.querySelectorAll('[role="option"], [role="menuitem"], option'))) add(node);
        // Some listboxes omit explicit option roles; their direct children are still options.
        if (root.getAttribute('role') === 'listbox') for (const node of Array.from(root.children)) add(node);
      }
      // Plain dropdowns (a toggle link or button over a list of links) carry no ARIA at all:
      // fall back to the items that appeared only after the click.
      if (!options.length) {
        const seen = (globalThis as { __mantisSeen?: Set<Element> }).__mantisSeen;
        if (seen) for (const node of Array.from(doc.querySelectorAll(items))) if (!seen.has(node) && !control.contains(node)) add(node);
      }
      const all = options.map((node) => ({ node, label: clean(node.getAttribute('aria-label') || node.textContent) })).filter((entry) => entry.label);
      // A wrapper (li) and the link inside it are one choice: keep the innermost element of each label.
      const entries = all.filter((entry) => !all.some((other) => other.node !== entry.node && other.label === entry.label && entry.node.contains(other.node)));
      return { labels: entries.map((entry) => entry.label), nodes: entries.map((entry) => entry.node) };
    }, ITEMS);
    type Found = { labels: string[]; matches: number[]; loose: boolean; node: ElementHandle<Element> | null };
    const find = async (): Promise<Found> => {
      const handle = await scan();
      try {
        const labels = await handle.getProperty('labels').then((h) => h.jsonValue() as Promise<string[]>);
        const nodes = await handle.getProperty('nodes').then((h) => h.getProperties());
        const m = matchOptions(labels.map((l) => ({ label: l })), option);
        const picked = m.hits.length === 1 ? m.hits[0]! : -1;
        let node: ElementHandle<Element> | null = null;
        for (const [key, h] of nodes) {
          if (Number(key) === picked) node = h.asElement() as ElementHandle<Element> | null;
          else await h.dispose();
        }
        return { labels, matches: m.hits, loose: m.loose, node };
      } finally {
        await handle.dispose();
      }
    };
    await el.evaluate((control, items) => {
      const doc = control.ownerDocument;
      const seen = new Set<Element>();
      for (const node of Array.from(doc.querySelectorAll(items))) if (node.getClientRects().length) seen.add(node);
      (globalThis as { __mantisSeen?: Set<Element> }).__mantisSeen = seen;
    }, ITEMS);
    try {
      await el.click({ timeout: this.actionTimeout });
    } catch (e) {
      throw new ActionError(this.explain(e, label));
    }
    const waitForOptions = async (): Promise<Found> => {
      let found = await find();
      for (let attempt = 0; !found.labels.length && attempt < 4; attempt++) {
        await found.node?.dispose();
        await new Promise<void>((done) => setTimeout(done, 50));
        found = await find();
      }
      return found;
    };
    let found = await waitForOptions();
    // Autocomplete inputs often do not render their choices until they have a query.
    if (!found.matches.length && await el.evaluate((node) => node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement)) {
      await found.node?.dispose();
      await el.fill(option, { timeout: this.actionTimeout });
      found = await waitForOptions();
    }
    const choice = found.node;
    try {
      if (found.matches.length > 1) {
        throw new ActionError(`ambiguous option "${option}" in ${label}; candidates: ${found.matches.slice(0, 15).map((i) => found.labels[i]).join(' | ')}`);
      }
      if (!choice) {
        throw new ActionError(`no option "${option}" in ${label}; ${optionHint(found.labels, option)}`);
      }
      try {
        await choice.click({ timeout: this.actionTimeout });
      } catch (e) {
        throw new ActionError(this.explain(e, label));
      }
    } finally {
      await choice?.dispose();
    }
    return found.labels[found.matches[0]!]!;
  }

  /** Fill several fields in one call: text, dropdown option, or true/false for checkboxes and radios. */
  async fill(fields: { id: number; value: string | boolean | string[] }[]): Promise<string> {
    return this.act('fill', async (page) => {
      if (!fields.length) throw new ActionError('no fields given');
      const done: number[] = [];
      const parts: string[] = [];
      for (const { id, value } of fields) {
        let el: ElementHandle<Element> | undefined;
        let name = '';
        try {
          // A prior field can synchronously replace a dependent control. Unlike a one-field
          // action, silently rematching it risks applying the remaining value to a different
          // entity; preserve the completed prefix and let the caller re-read and decide.
          if (done.length) {
            const live = await resolve(page, id);
            if (!live.ok) {
              throw new ActionError(`no longer exists after an earlier field changed the page; call read() to verify the remaining fields`);
            }
            await live.el.dispose();
          }
          const t = await this.target(page, id);
          el = t.el;
          const secret = t.label.includes('(password)');
          name = t.label.replace(' (password)', '').replace(/^#\d+ /, '');
          const kind = await el.evaluate((n) =>
            n instanceof HTMLSelectElement
              ? 'select'
              : n instanceof HTMLInputElement && (n.type === 'checkbox' || n.type === 'radio')
                ? 'check'
                : 'text',
          );
          if (kind === 'select') {
            parts.push(`selected "${await this.chooseOption(el, name, Array.isArray(value) ? value : String(value))}" in ${name}`);
          } else if (kind === 'check') {
            const on = /^(true|on|yes)$/i.test(String(value));
            if (!on && !/^(false|off|no)$/i.test(String(value))) {
              throw new ActionError(`${name} is a checkbox; use true or false, not "${value}"`);
            }
            await this.setChecked(page, el, id, on, name);
            parts.push(`${on ? 'checked' : 'unchecked'} ${name}`);
          } else {
            const text = String(value);
            await el.fill(text, { timeout: this.actionTimeout });
            const shown = secret ? '•••' : `"${text.length > 40 ? text.slice(0, 39) + '…' : text}"`;
            parts.push(`${shown} into ${name}`);
          }
          done.push(id);
        } catch (e) {
          if (e instanceof NavigatedError) throw e;
          const why = e instanceof ActionError ? e.message : this.explain(e, name || `#${id}`);
          const so = done.length ? `filled ${done.map((d) => `#${d}`).join(', ')}` : 'nothing filled';
          throw new ActionError(`${so}; #${id}: ${why}`);
        } finally {
          await el?.dispose();
        }
      }
      return `filled ${parts.length} field${parts.length === 1 ? '' : 's'}: ${parts.join('; ')}`;
    }, { targetScan: true });
  }

  async press(key: string): Promise<string> {
    return this.act('press', async (page) => {
      try {
        await page.keyboard.press(key);
      } catch (e) {
        throw new ActionError(`could not press "${key}": ${brief(e)}`);
      }
      return `pressed ${key}`;
    });
  }

  /**
   * Scroll the page in one direction by most of a screen, or bring element `#id` into view.
   * With a direction and `inside` (an id), scroll the list/panel that contains `#inside` instead.
   */
  async scroll(target: 'up' | 'down' | 'left' | 'right' | number = 'down', inside?: number): Promise<string> {
    return this.act('scroll', async (page) => {
      if (typeof target === 'number') {
        const { el, label } = await this.target(page, target);
        try {
          await el.scrollIntoViewIfNeeded({ timeout: this.actionTimeout });
        } catch (e) {
          throw new ActionError(this.explain(e, label));
        } finally {
          await el.dispose();
        }
        return `scrolled ${label} into view`;
      }
      if (inside === undefined) return this.scrollPage(page, target);
      const { el } = await this.target(page, inside);
      let r;
      try {
        r = await el.evaluate((node, dir) => {
          const parent = (n: Element): Element | null => n.parentElement ?? (n.getRootNode() instanceof ShadowRoot ? (n.getRootNode() as ShadowRoot).host : null);
          const horizontal = dir === 'left' || dir === 'right';
          let box: Element | null = null;
          for (let n: Element | null = node; n && n !== document.body && n !== document.documentElement; n = parent(n)) {
            const style = getComputedStyle(n);
            const scrolls = horizontal
              ? n.scrollWidth > n.clientWidth + 4 && /auto|scroll|overlay/.test(style.overflowX)
              : n.scrollHeight > n.clientHeight + 4 && /auto|scroll|overlay/.test(style.overflowY);
            if (scrolls) { box = n; break; }
          }
          if (!box) return null;
          const before = horizontal ? box.scrollLeft : box.scrollTop;
          const delta = (dir === 'down' || dir === 'right' ? 1 : -1) * Math.round((horizontal ? box.clientWidth : box.clientHeight) * 0.8);
          box.scrollBy(horizontal ? { left: delta, behavior: 'instant' as ScrollBehavior } : { top: delta, behavior: 'instant' as ScrollBehavior });
          const after = horizontal ? box.scrollLeft : box.scrollTop;
          const max = horizontal ? box.scrollWidth - box.clientWidth : box.scrollHeight - box.clientHeight;
          const name = (box.getAttribute('aria-label') ?? '').replace(/\s+/g, ' ').trim();
          return { moved: after !== before, pct: max > 0 ? Math.round((after / max) * 100) : 100, name: name.length > 40 ? name.slice(0, 39) + '…' : name };
        }, target);
      } catch (e) {
        throw new ActionError(this.explain(e, `#${inside}`));
      } finally {
        await el.dispose();
      }
      if (!r) return `#${inside} is not inside a scrollable container; ${await this.scrollPage(page, target)}`;
      const where = r.name ? `"${r.name}"` : `the container containing #${inside}`;
      return r.moved
        ? `scrolled ${target} inside ${where}; now at ${r.pct}% of it`
        : `scroll ${target} inside ${where}: already at the ${target === 'down' ? 'bottom' : target === 'up' ? 'top' : target === 'right' ? 'right edge' : 'left edge'} of it`;
    }, { quiet: true, targetScan: typeof target === 'number' || inside !== undefined });
  }

  /** Scroll the page, or its largest inner scroll container when the page itself cannot scroll. */
  private async scrollPage(page: Page, target: 'up' | 'down' | 'left' | 'right'): Promise<string> {
    const r = await page.evaluate((dir) => {
      const horizontal = dir === 'left' || dir === 'right';
      const delta = (dir === 'down' || dir === 'right' ? 1 : -1) * Math.round((horizontal ? window.innerWidth : window.innerHeight) * 0.8);
      const pageScroller: Element = document.scrollingElement ?? document.documentElement;
      let scroller: Element = pageScroller;
      const position = (element: Element) => horizontal ? element.scrollLeft : element.scrollTop;
      const extent = (element: Element) => horizontal ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight;
      const before = position(scroller);
      window.scrollBy(horizontal ? delta : 0, horizontal ? 0 : delta);
      if (position(scroller) === before) {
        // The page itself does not scroll on this axis; choose the largest
        // matching inner container so `scroll({direction:'right'})` remains
        // useful even when the model has no numbered handle for the table.
        let best = 0;
        for (const e of Array.from(document.querySelectorAll('*'))) {
          const area = e.clientWidth * e.clientHeight;
          const style = getComputedStyle(e);
          const scrolls = horizontal
            ? e.scrollWidth > e.clientWidth + 4 && /auto|scroll/.test(style.overflowX)
            : e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(style.overflowY);
          if (area > best && scrolls) {
            best = area;
            scroller = e;
          }
        }
        if (scroller !== pageScroller) scroller.scrollBy(horizontal ? delta : 0, horizontal ? 0 : delta);
      }
      const after = position(scroller);
      const max = extent(scroller);
      return { moved: after !== before, pct: max > 0 ? Math.round((after / max) * 100) : 100, max };
    }, target);
    if (r.max <= 0) return `scroll ${target}: nothing to scroll (page fits on screen)`;
    return r.moved ? `scrolled ${target}; now at ${r.pct}% of page` : `scroll ${target}: already at the ${target === 'down' ? 'bottom' : target === 'up' ? 'top' : target === 'right' ? 'right edge' : 'left edge'}`;
  }

  async back(): Promise<string> {
    return this.act('back', async (page) => {
      const from = page.url();
      await page.goBack({ waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => null);
      const landed = page.url();
      if (landed === from) return 'cannot go back: no earlier page';
      const note = this.lostQueryOnBack(from, landed)
        ? `\nnote: the query string of the earlier page was not restored; open(${from}) returns to it`
        : '';
      return `went back to ${landed}${note}`;
    }, { quiet: true });
  }

  /** Wait briefly for text to appear/present/disappear, or for an issued control to become present/enabled. */
  async waitFor(condition: { text?: string; id?: number; state?: 'appears' | 'disappears' | 'present' | 'enabled'; timeoutSeconds?: number }): Promise<string> {
    const { text, id } = condition;
    const state = condition.state ?? (text !== undefined ? 'appears' : 'present');
    const timeoutSeconds = Math.min(10, Math.max(0.1, condition.timeoutSeconds ?? 10));
    if ((text === undefined) === (id === undefined)) return 'error: give either text or id, not both';
    if (text !== undefined && !['appears', 'present', 'disappears'].includes(state)) return 'error: text waits use state "present", "appears", or "disappears"; use "present" for text already visible';
    if (id !== undefined && !['present', 'enabled'].includes(state)) return 'error: element waits use state "present" or "enabled"; use text with "present" for visible text';
    if (text !== undefined && !text.trim()) return 'error: text to wait for cannot be empty';
    if (id !== undefined && !this.known.has(id)) return `error: no element #${id} on this page; call read() to see current numbers`;

    const description = text !== undefined
      ? `text "${text}" to ${state}`
      : `#${id} to become ${state}`;
    let timedOut = false;
    const result = await this.act('upload', async (page) => {
      const ready = async (): Promise<boolean> => {
        if (text !== undefined) {
          const shown = await page.evaluate((needle) => (document.body?.innerText ?? '').toLocaleLowerCase().includes(needle), text.toLocaleLowerCase());
          return state === 'disappears' ? !shown : shown;
        }
        const found = await resolve(page, id!);
        if (!found.ok) return false;
        try {
          if (state === 'present') return true;
          return await found.el.evaluate((node) => {
            const disabled = node instanceof HTMLButtonElement || node instanceof HTMLInputElement || node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement
              ? node.disabled
              : false;
            return !disabled && node.getAttribute('aria-disabled') !== 'true';
          });
        } finally {
          await found.el.dispose();
        }
      };
      const deadline = Date.now() + timeoutSeconds * 1000;
      while (!(await ready())) {
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          timedOut = true;
          return `timed out after ${timeoutSeconds}s waiting for ${description}`;
        }
        await sleep(Math.min(100, remaining));
      }
      return `waited for ${description}`;
    });
    // A diff alone is not useful when nothing changed. Include the live numbered view on timeout.
    return timedOut && !result.startsWith('error:') ? `${result}\ncurrent observation:\n${await this.read()}` : result;
  }

  /** Hover a numbered control, for menus and tooltips that only appear under the pointer. */
  async hover(id: number): Promise<string> {
    return this.act('hover', async (page) => {
      const { el, label } = await this.target(page, id);
      try {
        await el.hover({ timeout: this.actionTimeout });
        return `hovered ${label}`;
      } catch (e) {
        throw new ActionError(this.explain(e, label));
      } finally {
        await el.dispose();
      }
    }, { targetScan: true });
  }

  /** Set local files on a file input, its label, or a control which opens a file chooser. */
  async upload(id: number, paths: string[]): Promise<string> {
    return this.act('upload', async (page) => {
      if (!paths.length) throw new ActionError('give at least one local file path');
      const files = paths.map((path) => resolvePath(path));
      for (const file of files) {
        if (!existsSync(file)) throw new ActionError(`file does not exist: ${file}`);
        if (!statSync(file).isFile()) throw new ActionError(`path is not a file: ${file}`);
      }
      const { el, label } = await this.target(page, id);
      try {
        const directInput = await el.evaluate((node) => node instanceof HTMLInputElement && node.type === 'file');
        if (directInput) {
          await el.setInputFiles(files, { timeout: this.actionTimeout });
          return `selected ${files.length} file${files.length === 1 ? '' : 's'} on ${label}: ${files.map((file) => basename(file)).join(', ')}`;
        }
        const handle = await el.evaluateHandle((node) => {
          const fileInput = (candidate: Element | null): HTMLInputElement | null =>
            candidate instanceof HTMLInputElement && candidate.type === 'file' ? candidate : null;
          const root = node.getRootNode() as Document | ShadowRoot;
          return fileInput(node) ??
            (node instanceof HTMLLabelElement ? fileInput(node.control) : null) ??
            (node instanceof HTMLLabelElement && node.htmlFor ? fileInput(root.querySelector(`#${CSS.escape(node.htmlFor)}`)) : null) ??
            fileInput(node.querySelector('input[type="file"]'));
        });
        const input = handle.asElement();
        if (input) {
          try {
            await input.setInputFiles(files, { timeout: this.actionTimeout });
          } finally {
            await input.dispose();
          }
        } else {
          await handle.dispose();
          const chooser = page.waitForEvent('filechooser', { timeout: this.actionTimeout }).catch(() => null);
          await el.click({ timeout: this.actionTimeout, noWaitAfter: true }).catch((e) => { throw new ActionError(this.explain(e, label)); });
          const opened = await chooser;
          if (!opened) throw new ActionError(`${label} did not open a file chooser`);
          await opened.setFiles(files);
        }
        return `selected ${files.length} file${files.length === 1 ? '' : 's'} on ${label}: ${files.map((file) => basename(file)).join(', ')}`;
      } finally {
        await el.dispose();
      }
    }, { targetScan: true });
  }

  /** List tabs, switch the active tab, or close one. */
  async tabs(action: 'list' | 'switch' | 'close' = 'list', id?: number): Promise<string> {
    return this.guard(async () => {
      await this.launch();
      const pages = this.context!.pages();
      const tab = id === undefined ? undefined : pages[id - 1];
      if (action !== 'list' && (!Number.isInteger(id) || !tab)) throw new ActionError(`no tab #${id}; call tabs() to list open tabs`);
      if (action === 'list') {
        const active = await this.activePage();
        const lines = await Promise.all(pages.map(async (page, index) => {
          const title = await page.title().catch(() => '');
          return `${page === active ? '*' : ' '} #${index + 1} "${title || 'untitled'}" ${page.url()}`;
        }));
        return `tabs:\n${lines.join('\n')}`;
      }
      if (action === 'switch') {
        this.page = tab!;
        await tab!.bringToFront().catch(() => undefined);
        this.last = null;
        this.labels.clear();
        this.known.clear();
        return `switched to tab #${id}\n${await this.view(tab!)}`;
      }
      const wasActive = this.page === tab;
      await tab!.close();
      const remaining = this.context!.pages();
      this.last = null;
      this.labels.clear();
      this.known.clear();
      if (!wasActive) return `closed tab #${id}`;
      if (!remaining.length) return `closed tab #${id}`;
      this.page = remaining.at(-1)!;
      return `closed tab #${id}; now active\n${await this.view(this.page)}`;
    }, 'tabs');
  }

  // ---- fallback ladder: data -> ocr -> look -> ask_human -------------------

  /** Visible images, canvases and chart-like SVGs, each with a number usable by data/ocr/look. */
  async media(): Promise<string> {
    return this.guard(async () => {
      const page = await this.activePage();
      // Capture allocates disjoint frame number ranges before media() asks each frame to use
      // the shared registry. That keeps embedded visual ids resolvable by data()/look().
      await this.observe(page);
      const text = await listMedia(page);
      const captcha = await this.timed('captcha', () => detectCaptcha(page));
      return captcha ? `${text}\n${captcha}` : text;
    }, 'media');
  }

  /** Hidden text behind a visual element: alt/caption/filename, SVG text, in-memory chart data. */
  async data(target: Target): Promise<string> {
    return this.guard(async () => {
      const page = await this.activePage();
      let resolved: { el: ElementHandle<Element>; label: string };
      try {
        resolved = await this.visualTarget(page, target);
      } catch (e) {
        if (!(e instanceof ActionError)) throw e;
        const media = await listMedia(page).catch(() => '');
        const canvas = media.match(/^#(\d+) canvas\b/m);
        const hint = canvas ? `; a canvas is available — try data({id: ${canvas[1]}})` : '';
        throw new ActionError(`${e.message}${hint}`);
      }
      const { el, label } = resolved;
      try {
        const rows = await el.evaluate(formatTableRows, DATA_CHARS);
        return rows ?? formatData(label, await describeElement(el));
      } finally {
        await el.dispose();
      }
    }, 'data');
  }

  /** Text inside an image/canvas via OCR (tesseract.js). Never returns the image. */
  async ocr(target: Target): Promise<string> {
    return this.guard(async () => {
      const page = await this.activePage();
      const { el, label } = await this.visualTarget(page, target);
      try {
        const png = await this.shot(el, label);
        const { text, confidence } = await recognize(png).catch((e: unknown) => {
          throw new ActionError(e instanceof Error ? e.message : String(e));
        });
        if (!text) return `ocr ${label}: no text recognised (confidence ${confidence}%). Try look(id) as a last resort.`;
        const body = text.length > 1500 ? text.slice(0, 1499).trimEnd() + '…' : text;
        const warn = confidence < 60 ? ' - low confidence, text may be wrong; consider look(id)' : '';
        return `ocr ${label} (confidence ${confidence}%${warn}):\n${body}`;
      } finally {
        await el.dispose();
      }
    }, 'ocr');
  }

  /** The one tool that returns an image: a PNG of a single element, at most 800px on its longest side. */
  async look(target: Target): Promise<{ png: Buffer; text: string } | { error: string }> {
    try {
      const page = await this.activePage();
      const { el, label } = await this.visualTarget(page, target);
      try {
        const raw = await this.shot(el, label);
        const png = await downscale(raw, () => this.scratchPage());
        const { width, height } = pngSize(png);
        return { png, text: `look ${label}: ${width}×${height} PNG` };
      } finally {
        await el.dispose();
      }
    } catch (e) {
      return { error: `error: ${e instanceof ActionError ? e.message : brief(e)}` };
    }
  }

  /**
   * Hand control to a human (CAPTCHA, 2FA, payment, login). Mantis never solves CAPTCHAs.
   * Headless: opens a headed window with the same cookies/storage and URL, waits, then carries
   * the state back and reloads. Headed (or MANTIS_ASK_HUMAN_HEADLESS=1, tests only): waits on the same page.
   */
  async askHuman(reason: string, until?: string, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS): Promise<string> {
    if (noHuman()) return 'no human available; choose another route or report blocked';
    return this.guard(async () => {
      let cond;
      try {
        cond = parseUntil(until);
      } catch (e) {
        throw new ActionError((e as Error).message);
      }
      const page = await this.activePage();
      if (cond.kind === 'selector_gone' || cond.kind === 'selector_present') {
        const sel = cond.selector;
        await page.evaluate((s) => void document.querySelector(s), sel).catch(() => {
          throw new ActionError(`invalid CSS selector "${sel}"`);
        });
      }
      const timeoutMs = Math.max(0.1, timeoutSeconds) * 1000;
      const what = describeUntil(cond);
      const secs = `${Math.round(timeoutSeconds * 10) / 10}s`;
      console.error(`[mantis] human needed: ${reason} (waiting for ${what}, up to ${secs})`);

      if (!this.isHeadless() || process.env.MANTIS_ASK_HUMAN_HEADLESS === '1') {
        const ok = await waitForHuman(page, cond, { timeoutMs });
        if (!ok) return `error: timed out after ${secs} waiting for ${what} (${reason}); the page is unchanged, call read() to see it`;
        const now = this.page ?? page;
        await this.settle(now);
        return `human step done (${reason})\n${await this.view(now)}`;
      }

      // Headless: let the human work in a visible window that carries over this session.
      const state = await this.context!.storageState();
      const url = page.url();
      let headed: Browser;
      try {
        headed = await chromium.launch({ headless: false, ...chromiumExecutable() });
      } catch (e) {
        throw new ActionError(
          `cannot open a visible browser window for the human (${brief(e)}). ` +
            'Run Mantis with MANTIS_HEADLESS=0 on a machine with a display, or complete this step yourself.',
        );
      }
      try {
        const ctx = await headed.newContext({ viewport: null, storageState: state });
        await ctx.addInitScript(NAME_SHIM);
        const hp = await ctx.newPage();
        if (url && !url.startsWith('chrome-error:') && url !== 'about:blank') {
          await hp.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => undefined);
        }
        const ok = await waitForHuman(hp, cond, { timeoutMs });
        if (!ok) return `error: timed out after ${secs} waiting for ${what} (${reason}); nothing was changed, call read() to see the page`;
        const finalUrl = hp.url();
        const newState = await ctx.storageState();
        await headed.close().catch(() => undefined);
        await this.swapContext(newState);
        const fresh = await this.activePage();
        if (finalUrl && finalUrl !== 'about:blank') {
          await fresh.goto(finalUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => undefined);
        }
        await this.settle(fresh);
        return `human step done (${reason}); session carried over\n${await this.view(fresh)}`;
      } finally {
        await headed.close().catch(() => undefined);
      }
    }, 'ask_human');
  }

  // ---- internals ---------------------------------------------------------

  private adopt(p: Page): void {
    if (this.adopted.has(p)) {
      this.page = p;
      return;
    }
    this.adopted.add(p);
    // Keep the current page as a synchronous fallback: Playwright resolves opener() asynchronously,
    // while a script is allowed to close a newly opened window immediately.
    this.opener.set(p, this.page);
    this.page = p;
    void p.opener().then((opener) => { this.opener.set(p, opener); }).catch(() => undefined);
    p.on('dialog', (d) => {
      const accept = d.type() === 'alert' || d.type() === 'beforeunload' || d.type() === 'confirm' || d.type() === 'prompt';
      this.notes.push(`dialog: ${d.type()} "${d.message().slice(0, 120)}" (${accept ? 'accepted' : 'dismissed'})`);
      void (accept ? (d.type() === 'prompt' ? d.accept(d.defaultValue()) : d.accept()) : d.dismiss()).catch(() => undefined);
    });
    p.on('close', () => {
      if (this.page !== p) return;
      const previous = this.opener.get(p);
      this.page = previous && !previous.isClosed() ? previous : null;
      if (this.page) this.notes.push('popup: closed (back on the page that opened it)');
    });
  }

  private async activePage(): Promise<Page> {
    await this.launch();
    if (!this.page) this.adopt(await this.context!.newPage());
    return this.page!;
  }

  private async guard(fn: () => Promise<string>, tool = 'tool'): Promise<string> {
    const outer = this.timing;
    if (!outer && process.env.MANTIS_TIMING === '1') this.timing = { tool, start: performance.now(), phases: new Map() };
    try {
      return await fn();
    } catch (e) {
      return `error: ${e instanceof ActionError ? e.message : brief(e)}`;
    } finally {
      if (!outer && this.timing) {
        const timing = this.timing;
        this.timing = null;
        const phases = ['action', 'navigate', 'navigation', 'wait', 'dialog', 'captcha', 'capture', 'scan-before', 'scan-target', 'scan-after', 'translate', 'diff']
          .map((name) => `${name}=${Math.round(timing.phases.get(name) ?? 0)}ms`).join(' ');
        const scans = ['before', 'target', 'after'].map((name) => `${name}:${timing.scans?.get(name) ?? 0}`).join(',');
        process.stderr.write(`mantis timing tool=${timing.tool} ${phases} scans=${scans}${timing.settle ? ` settle=${timing.settle}` : ''} total=${Math.round(performance.now() - timing.start)}ms${timing.routeRetry ? ` routeRetry=${timing.routeRetry}` : ''}\n`);
      }
    }
  }

  private async timed<T>(phase: string, fn: () => Promise<T>): Promise<T> {
    if (!this.timing) return fn();
    const timing = this.timing;
    const start = performance.now();
    const stack = timing.stack ??= [];
    const frame = { phase, start, children: 0 };
    stack.push(frame);
    try { return await fn(); } finally {
      const elapsed = performance.now() - start;
      stack.pop();
      timing.phases.set(phase, (timing.phases.get(phase) ?? 0) + elapsed - frame.children);
      if (stack.length) stack[stack.length - 1]!.children += elapsed;
    }
  }

  private timedSync<T>(phase: string, fn: () => T): T {
    if (!this.timing) return fn();
    const start = performance.now();
    try { return fn(); } finally { this.timing.phases.set(phase, (this.timing.phases.get(phase) ?? 0) + performance.now() - start); }
  }

  /**
   * Run an action, wait for the page to settle, and report what changed: a diff
   * when the same document is still showing, the full view after a navigation.
   */
  private act(tool: string, fn: (page: Page) => Promise<string>, opts: { quiet?: boolean; requestGrace?: boolean; targetScan?: boolean; bounds?: { max: number; idleGrace: number } } = {}): Promise<string> {
    return this.guard(async () => {
      this.pendingNavigation?.cancel();
      this.pendingNavigation = null;
      const page = await this.activePage();
      let before = await this.unchanged(page);
      // Targeted actions always validate live state before dispatch. That scan is also a valid
      // before snapshot, so do not perform a redundant walk first.
      if (!before && !opts.targetScan) before = await this.scan(page, 'before').catch(() => null);
      this.actionBefore = null;
      // Do not refresh issued identities from this scan. A SPA can recycle the same DOM element
      // between the agent's read and its action; the target guard compares against that last read.
      // Stamp the action's start in-page so settle() ignores timers/requests that were already running.
      await page.evaluate(() => {
        const w = window as unknown as { __mantisDoc?: string; __mantisEpoch?: number; __mantisEpochDoc?: string; __mantisDomChanges?: number; __mantisEpochDomChanges?: number };
        w.__mantisEpoch = performance.now();
        w.__mantisEpochDoc = w.__mantisDoc;
        w.__mantisEpochDomChanges = w.__mantisDomChanges;
      }).catch(() => undefined);
      let msg: string;
      try {
        msg = await this.timed('action', () => fn(page));
        before ??= this.actionBefore;
      } catch (e) {
        if (e instanceof NavigatedError) return this.navigatedObservation(page);
        throw e;
      }
      const navigation = this.pendingNavigation as NavigationWatch | null;
      try {
        // Fast exits remain the default for ordinary actions; submits explicitly opt out because
        // their destination can publish a route before its result view has painted.
        await this.timed('wait', () => this.settle(page, true, navigation, opts.requestGrace ?? true, opts.bounds ?? null));
      } finally {
        navigation?.cancel();
        if (this.pendingNavigation === navigation) this.pendingNavigation = null;
      }
      const lines = [msg];
      const now = this.page ?? page;
      if (now !== page) {
        await this.timed('wait', () => this.settle(now));
        lines.push('opened in a new tab (now active)');
      }
      const captchaPromise = detectCaptcha(now);
      let after = await this.scan(now, 'after').catch(() => null);
      // Client routers can publish their destination URL before the next frame paints it. Do not
      // hand back the old page under the new route: give an unchanged route view one bounded retry.
      if (before && after && now === page && this.needsPageView(before.snap, after.snap)
        && this.sameVisibleContent(before.snap, after.snap)) {
        if (this.timing) this.timing.routeRetry = 'fired';
        await this.timed('wait', () => this.settle(now, true, null, false, { max: 1500, idleGrace: 750 }));
        after = await this.scan(now, 'after').catch(() => null);
        if (this.timing) this.timing.routeRetry = after && !this.sameVisibleContent(before.snap, after.snap) ? '1/changed' : '1/same';
      }
      if (before && after && now === page && before.doc !== null && before.doc === after.doc && !this.needsPageView(before.snap, after.snap)) {
        this.remember(after.snap, after.doc);
        const cue = answerReadyCue(before.snap, after.snap);
        if (cue) lines.push(cue);
        const d = this.timedSync('diff', () => diffSnapshots(before.snap, after.snap));
        if (!(opts.quiet && d === NO_CHANGE)) lines.push(d);
      } else {
        // A different document (ids restart, a diff would mislead): say where we are, show it whole.
        if (before && after) lines.push(...headerLines(before.snap, after.snap));
        if ((after?.snap.url ?? now.url()).startsWith('chrome-error:')) lines.push('the page failed to load');
        else if (after) {
          this.labels.clear();
          this.known.clear();
          const cue = before ? answerReadyCue(before.snap, after.snap) : null;
          if (cue) lines.push(cue);
          lines.push(this.timedSync('translate', () => this.render(after.snap, {}, after.doc)));
          if (this.hasDisabledControls(after.snap)) lines.push(this.hydrationNote());
        }
      }
      const captcha = await this.timed('captcha', () => captchaPromise);
      if (captcha) lines.push(captcha);
      lines.push(...this.notes.splice(0));
      return lines.join('\n');
    }, tool);
  }

  private async scan(page: Page, kind: 'before' | 'target' | 'after'): Promise<{ snap: Snapshot; doc: string | null }> {
    if (this.timing) {
      const scans = this.timing.scans ??= new Map();
      scans.set(kind, (scans.get(kind) ?? 0) + 1);
    }
    return this.timed(`scan-${kind}`, () => this.observe(page));
  }

  /** A route/title change is a new agent-facing page even when a client router retained its document. */
  private needsPageView(before: Snapshot, after: Snapshot): boolean {
    if (before.title !== after.title) return true;
    try {
      return new URL(before.url).pathname !== new URL(after.url).pathname;
    } catch {
      return before.url !== after.url;
    }
  }

  /** URL changes alone are not a useful page view while a client router has not painted yet. */
  private sameVisibleContent(before: Snapshot, after: Snapshot): boolean {
    if (before.title !== after.title) return false;
    // States and ids are left out: a click moves focus onto the clicked link without the page repainting.
    const visible = (snap: Snapshot): string[] => snap.nodes
      .filter((n) => n.inViewport)
      .map(({ kind, role, name, value }) => JSON.stringify([kind, role, name, value ?? '']));
    const was = visible(before);
    const now = visible(after);
    const left = new Map<string, number>();
    for (const key of was) left.set(key, (left.get(key) ?? 0) + 1);
    let shared = 0;
    for (const key of now) {
      const n = left.get(key) ?? 0;
      if (n > 0) { shared++; left.set(key, n - 1); }
    }
    const most = Math.max(was.length, now.length);
    return most === 0 || shared / most >= 0.9;
  }

  private lostQueryOnBack(from: string, landed: string): boolean {
    try {
      const left = new URL(from);
      const earlier = new URL(landed);
      return left.search.length > 1 && earlier.search.length < left.search.length;
    } catch {
      return false;
    }
  }

  /** Scan the page; remembered so the next action can skip its "before" scan if nothing changed. */
  private async observe(page: Page): Promise<{ snap: Snapshot; doc: string | null }> {
    const before = await this.pageState(page); // read first: a change during the scan must not be missed
    const snap = await capture(page);
    // Changes inside an iframe don't move the page's counter, so pages with frames are always rescanned.
    const reusable = before.doc && before.mut >= 0 && !snap.framesSkipped && !snap.nodes.some((n) => n.frame !== undefined);
    this.last = reusable ? { page, doc: before.doc!, mut: before.mut, snap } : null;
    return { snap, doc: before.doc };
  }

  /** The last scan, if this page has not changed since (DOM, scroll, input, focus, size, hover). */
  private async unchanged(page: Page): Promise<{ snap: Snapshot; doc: string | null } | null> {
    const l = this.last;
    if (!l || l.page !== page || l.snap.url !== page.url()) return null;
    const now = await this.pageState(page);
    return now.doc === l.doc && now.mut === l.mut ? { snap: l.snap, doc: l.doc } : null;
  }

  private async pageState(page: Page): Promise<{ doc: string | null; mut: number }> {
    return page
      .evaluate(() => {
        const w = window as unknown as { __mantisDoc?: string; __mantisMut?: number; __mantisShadowFull?: boolean };
        // Past the shadow-root tracking cap some roots go unobserved, so the counter cannot vouch for the page.
        return { doc: w.__mantisDoc ?? null, mut: w.__mantisShadowFull ? -1 : (w.__mantisMut ?? -1) };
      })
      .catch(() => ({ doc: null, mut: -1 }));
  }

  /** A number was issued for a previous document: show the live page, not a stale-id error. */
  private async navigatedObservation(page: Page): Promise<string> {
    const now = this.page ?? page;
    await this.settle(now);
    const captchaPromise = detectCaptcha(now);
    const after = await this.timed('capture', () => this.observe(now));
    this.labels.clear();
    this.known.clear();
    let text = `page navigated; showing the current page\n${this.render(after.snap, {}, after.doc)}`;
    const captcha = await this.timed('captcha', () => captchaPromise);
    if (captcha) text += `\n${captcha}`;
    return text;
  }

  private async view(page: Page, opts: ReadOptions = {}): Promise<string> {
    const captchaPromise = detectCaptcha(page);
    const observed = (await this.unchanged(page)) ?? (await this.timed('capture', () => this.observe(page)));
    let text = this.render(observed.snap, opts, observed.doc);
    const captcha = await this.timed('captcha', () => captchaPromise);
    if (captcha) text += `\n${captcha}`;
    return this.notes.length ? `${text}\n${this.notes.splice(0).join('\n')}` : text;
  }

  private render(snap: Snapshot, opts: ReadOptions = {}, doc: string | null = null): string {
    this.remember(snap, doc);
    return translate(snap, undefined, opts, this.memory.hook(originOf(snap.url)));
  }

  private hasDisabledControls(snap: Snapshot): boolean {
    return snap.nodes.filter((n) => n.kind === 'interactive' && n.states.includes('disabled')).length >= 3;
  }

  private hydrationNote(): string {
    return `Some controls are still disabled; the page may be loading. Actions wait up to ${this.actionTimeout / 1000}s for them to enable.`;
  }

  /** Remember how each number was last described, for action messages. */
  private remember(snap: Snapshot, doc: string | null = null): void {
    this.labels.clear();
    for (const n of snap.nodes) {
      if (n.kind === 'interactive' && n.id !== undefined) {
        this.labels.set(n.id, this.labelOf(n));
        this.known.set(n.id, { id: n.id, role: n.role, name: n.name, href: n.href, doc });
      }
    }
  }

  private labelOf(n: RawNode): string {
    const name = n.name ? ` ${n.inferred ? '~' : ''}"${n.name.replace(/"/g, "'")}"` : '';
    return `#${n.id} ${n.role}${name}${n.secret ? ' (password)' : ''}`;
  }

  /** A number whose element a re-render replaced: follow it to the one control with the same role and name now. */
  private async rematch(page: Page, id: number): Promise<{ el: ElementHandle<Element>; label: string } | null> {
    const was = this.known.get(id);
    if (!was) return null;
    const same = (await capture(page)).nodes.filter((n) =>
      n.kind === 'interactive' && n.id !== undefined && sameIdentity(was, n),
    );
    if (same.length !== 1) return null;
    const found = await resolve(page, same[0]!.id!);
    return found.ok ? { el: found.el, label: `${this.labelOf(same[0]!)} (was #${id}; the page re-rendered)` } : null;
  }

  private async target(page: Page, id: number): Promise<{ el: ElementHandle<Element>; label: string }> {
    const issued = this.known.get(id);
    if (issued?.doc && (await this.pageState(page)).doc !== issued.doc) throw new NavigatedError();
    const found = await resolve(page, id);
    if (!found.ok) {
      const again = found.reason === 'gone' ? await this.rematch(page, id) : null;
      if (again) {
        // A rematched control still needs a before side for the action diff. This uncommon
        // replacement path cannot reuse its rematch scan because that scan lacks page state.
        if (!this.actionBefore) this.actionBefore = { page, ...(await this.scan(page, 'target')) };
        return again;
      }
      throw new ActionError(
        found.reason === 'unknown'
          ? `no element #${id} on this page; call read() to see current numbers`
          : `#${id} no longer exists (the page changed); call read() to refresh`,
      );
    }
    if (issued) {
      // Always walk immediately before dispatch. The document MutationObserver does not see
      // mutations inside an already-open shadow root, so a cached page snapshot is insufficient.
      const validation = await this.scan(page, 'target');
      // Retain the fresh live guard; only the redundant action-before walk is removed.
      if (!this.actionBefore) this.actionBefore = { page, ...validation };
      const current = validation.snap.nodes.find((n) => n.kind === 'interactive' && n.id === id);
      // A connected element that the visible capture no longer represents should retain the
      // normal actionability error (for example, "is not visible"), rather than being called a
      // semantic identity change. Guard only a newly captured, meaningfully different target.
      if (current && !sameIdentity(issued, current, true)) {
        await found.el.dispose().catch(() => undefined);
        const was = `${issued.role}${issued.name ? ` "${issued.name}"` : ''}`;
        const now = current ? `${current.role}${current.name ? ` "${current.name}"` : ''}` : 'an unavailable control';
        throw new ActionError(`#${id} changed from ${was} to ${now}; call read() to refresh`);
      }
    }
    return { el: found.el, label: this.labels.get(id) ?? `#${id}` };
  }

  /** A target may still have a box while its disclosure is logically closed. */
  private async inactiveController(el: ElementHandle<Element>): Promise<{ id: number; name: string } | null> {
    return el.evaluate((target) => {
      const parent = (node: Element): Element | null => {
        const root = node.getRootNode();
        return node.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
      };
      const rootOf = (node: Element): Document | ShadowRoot => {
        const root = node.getRootNode();
        return root instanceof ShadowRoot ? root : document;
      };
      const registry = (window as unknown as { __mantis?: { ids: WeakMap<Element, number> } }).__mantis;
      const describe = (node: Element): { id: number; name: string } | null => {
        const id = registry?.ids.get(node);
        if (id === undefined || !node.getClientRects().length) return null;
        const name = (node.getAttribute('aria-label') || node.getAttribute('title') ||
          (node instanceof HTMLElement ? node.innerText : node.textContent) || node.localName)
          .replace(/\s+/g, ' ').trim().slice(0, 60);
        return { id, name: name || node.localName };
      };
      for (let node: Element | null = parent(target); node; node = parent(node)) {
        if (node instanceof HTMLDetailsElement && !node.open) {
          const summary = Array.from(node.children).find((child): child is HTMLElement => child instanceof HTMLElement && child.localName === 'summary');
          // The summary is the opener itself, never an inactive child of its own details.
          const found = summary && summary !== target ? describe(summary) : null;
          if (found) return found;
        }
      }
      const ids = new Set<string>();
      for (let node: Element | null = target; node; node = parent(node)) if (node.id) ids.add(node.id);
      if (!ids.size) return null;
      // ARIA disclosure relationships are document/shadow-root local. Do not infer a
      // controller from an unrelated expanded-looking ancestor or another component.
      for (const trigger of Array.from(rootOf(target).querySelectorAll('[aria-expanded="false"][aria-controls]'))) {
        if ((trigger.getAttribute('aria-controls') || '').split(/\s+/).some((id) => ids.has(id))) {
          const found = describe(trigger);
          if (found) return found;
        }
      }
      return null;
    }).catch(() => null);
  }

  /**
   * What sits on top of the element's center, if it is something unrelated to the element (an overlay).
   * Hit-tests through open shadow roots. A descendant, an ancestor and an associated label all
   * count as the element itself, as does anything when the center cannot be tested.
   */
  private async coveredBy(el: ElementHandle<Element>, label: ElementHandle<Element> | null = null): Promise<Cover | null> {
    return el.evaluate((target, associatedLabel) => {
      const r0 = target.getBoundingClientRect();
      if (!r0.width || !r0.height || getComputedStyle(target).pointerEvents === 'none') return null;
      const pointerTarget = associatedLabel ?? target;
      const off = (r: DOMRect): boolean => r.left + r.width / 2 < 0 || r.top + r.height / 2 < 0 || r.left + r.width / 2 >= innerWidth || r.top + r.height / 2 >= innerHeight;
      if (off(pointerTarget.getBoundingClientRect())) pointerTarget.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' as ScrollBehavior });
      const parent = (node: Element): Element | null => node.parentElement ?? (node.getRootNode() instanceof ShadowRoot ? (node.getRootNode() as ShadowRoot).host : null);
      // The unrelated element on top of the center right now, or null.
      const probe = (): Element | null => {
        const r = pointerTarget.getBoundingClientRect();
        if (off(r)) return null;
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const root = pointerTarget.getRootNode() as Document | ShadowRoot;
        let top: Element | null = (root instanceof ShadowRoot ? root : document).elementFromPoint(x, y);
        while (top?.shadowRoot) {
          const inner = top.shadowRoot.elementFromPoint(x, y);
          if (!inner || inner === top) break;
          top = inner;
        }
        if (!top || top === document.documentElement || top === document.body) return null;
        for (let n: Element | null = top; n; n = parent(n)) if (n === target) return null; // the element or inside it
        for (let n: Element | null = target; n; n = parent(n)) if (n === top) return null; // wraps the element
        if (pointerTarget !== target && pointerTarget.contains(top)) return null; // inside the associated label
        return top;
      };
      let hit = probe();
      if (!hit) return null;
      // A sticky/fixed bar over the center is not a blocker: Playwright scrolls past it. Centre the element and look again.
      const floats = (): boolean => {
        for (let n: Element | null = hit; n && n !== document.documentElement && !n.contains(pointerTarget); n = parent(n)) {
          const pos = getComputedStyle(n).position;
          if (pos === 'fixed' || pos === 'sticky') return true;
        }
        return false;
      };
      if (floats()) {
        pointerTarget.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' as ScrollBehavior });
        hit = probe();
        if (!hit) return null;
      }
      const reg = (window as unknown as { __mantis?: { ids: WeakMap<Element, number> } }).__mantis;
      const idOfNode = (node: Element): number | undefined => reg?.ids.get(node);
      const text = (node: Element): string => {
        const renderedText = node instanceof HTMLElement ? node.innerText : node.textContent;
        return (node.getAttribute('aria-label') || renderedText || '').replace(/\s+/g, ' ').trim();
      };
      const describe = (node: Element): string => {
        const attrs: string[] = [];
        const cls = (node.getAttribute('class') ?? '').split(/\s+/).filter(Boolean).slice(0, 2).join('.');
        if (cls) attrs.push(`.${cls}`);
        const role = node.getAttribute('role');
        if (role) attrs.push(` role=${role}`);
        const name = text(node);
        if (name) attrs.push(` "${name.length > 40 ? name.slice(0, 39) + '…' : name}"`);
        return `<${node.localName}${attrs.join('')}>`;
      };
      // A close/dismiss control in the same overlay, if it has a number from the last read.
      const CLOSE = /^(close|dismiss|cancel|no thanks|not now|decline|reject|[x×✕✖])$/i;
      let close: { id: number; name: string } | undefined;
      let hitId: number | undefined;
      // A label associated with the target is a legitimate pointer proxy, not a loading veil.
      let interactive = false;
      for (let n: Element | null = hit; n; n = parent(n)) {
        if (n instanceof HTMLLabelElement && n.control === target) { interactive = true; break; }
      }
      const controls: { id: number; name: string }[] = [];
      const seenControls = new Set<number>();
      const popup = hit.closest('[role="listbox"], [role="menu"]') ?? (hit.matches('[role="option"]') ? hit : null);
      const comboboxPopup = !!popup && Array.from(document.querySelectorAll('[role="combobox"], input, textarea')).some((owner) => {
        if (owner.getAttribute('aria-expanded') !== 'true') return false;
        const owns = `${owner.getAttribute('aria-controls') ?? ''} ${owner.getAttribute('aria-owns') ?? ''}`.trim().split(/\s+/);
        return owns.some((id) => {
          const controlled = document.getElementById(id);
          return controlled === popup || !!controlled?.contains(popup);
        });
      });
      let busy = !!hit.closest('[aria-busy="true"]') || !!document.querySelector('[role="progressbar"], progress');
      const focusable = 'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"], [role="button"], [role="link"], [role="menuitem"]';
      const rendered = (node: Element): boolean => {
        if (!node.getClientRects().length) return false;
        for (let ancestor: Element | null = node; ancestor; ancestor = parent(ancestor)) {
          const style = getComputedStyle(ancestor);
          if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
        }
        return true;
      };
      for (let n: Element | null = hit; n && n !== document.documentElement && !n.contains(pointerTarget); n = parent(n)) {
        hitId ??= idOfNode(n);
        if (n.matches('dialog, [role="dialog"], [role="alertdialog"], [aria-modal="true"]')) interactive = true;
        if (n.getAttribute('aria-busy') === 'true' || n.querySelector('[role="progressbar"], progress, [aria-busy="true"]')) busy = true;
        const scope: ParentNode = n.parentElement ? n : (n.getRootNode() as ParentNode); // top of a shadow tree: search the whole tree
        const candidates = n.matches(focusable)
          ? [n, ...Array.from(scope.querySelectorAll(focusable)).filter((b) => b !== n)]
          : Array.from(scope.querySelectorAll(focusable));
        for (const b of candidates) {
          if (b !== n && !n.contains(b)) continue;
          if (!rendered(b) || (b as HTMLButtonElement).disabled || b.getAttribute('aria-disabled') === 'true') continue;
          const name = (b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent || '').replace(/\s+/g, ' ').trim();
          const id = idOfNode(b);
          if (id !== undefined && !seenControls.has(id)) { seenControls.add(id); controls.push({ id, name: name || b.localName }); }
          if (!close && id !== undefined && CLOSE.test(name)) close = { id, name };
        }
      }
       // Arbitrary links/buttons in page content do not make a layer dismissible. A semantic modal
       // or an explicitly named close control does; those are safe, actionable dismissal advice.
       if (close) interactive = true;
      // Visually empty: the hit element has no text, content, background, border or shadow, and no layer above
      // it (up to the one that holds the target) paints over the center. Ancestors' content elsewhere does not matter.
      const clear = (c: string): boolean => c === 'transparent' || /^rgba\(.*,\s*0\)$/.test(c) || /\/\s*0(\.0+)?%?\s*\)$/.test(c);
      const paints = (node: Element): boolean => {
        const cs = getComputedStyle(node);
        return !clear(cs.backgroundColor) || cs.backgroundImage !== 'none' || (cs.backdropFilter || 'none') !== 'none' || cs.filter !== 'none';
      };
      const empty = (node: Element): boolean => {
        if (/\S/.test(node.textContent ?? '') || node.matches('img, svg, canvas, video, iframe, input, button, a, [role]') || node.querySelector('img, svg, canvas, video, iframe, input, button, a, [role]')) return false;
        const cs = getComputedStyle(node);
        const border = ['top', 'right', 'bottom', 'left'].every((s) => {
          const style = cs.getPropertyValue(`border-${s}-style`);
          return style === 'none' || style === 'hidden' || parseFloat(cs.getPropertyValue(`border-${s}-width`)) === 0;
        });
        return !paints(node) && border && cs.boxShadow === 'none';
      };
      let invisible = empty(hit);
      for (let n: Element | null = parent(hit); invisible && n && n !== document.documentElement && !n.contains(pointerTarget); n = parent(n)) if (paints(n)) invisible = false;
      return { desc: describe(hit), hitId, close, controls, interactive: interactive || comboboxPopup, busy, invisible, comboboxPopup };
    }, label).catch(() => null);
  }

  /** Re-hit-test a painted, control-free layer for a bounded period, then return the blocker that remains. */
  private async waitForVeilToClear(el: ElementHandle<Element>, label: ElementHandle<Element> | null, initial: Cover): Promise<Cover | null> {
    const deadline = Date.now() + VEIL_CLEAR_TIMEOUT;
    let cover: Cover | null = initial;
    while (Date.now() < deadline) {
      // Prefer checking sooner when a region advertises loading, but always give painted veils this bounded chance.
      await sleep(Math.min(cover?.busy ? VEIL_RECHECK_MS / 2 : VEIL_RECHECK_MS, deadline - Date.now()));
      cover = await this.coveredBy(el, label);
      if (!cover || cover.interactive || cover.invisible) return cover;
    }
    return cover;
  }

  /** An anchor's resolved destination is useful when a non-interactive veil makes its link unreachable. */
  private async linkHref(el: ElementHandle<Element>): Promise<string | null> {
    return el.evaluate((node) => node instanceof HTMLAnchorElement && node.href ? node.href : null).catch(() => null);
  }

  private coveredMessage(label: string, cover: Cover, href: string | null = null): string {
    const plain = label.replace(' (password)', '');
    const by = cover.hitId !== undefined ? `${cover.desc} (#${cover.hitId})` : cover.desc;
    const close = cover.close ? ` (try #${cover.close.id} "${cover.close.name}")` : '';
    if (cover.comboboxPopup) {
      return `${plain} is covered by a combobox suggestion popup, ${by}; press Escape, select a suggestion, or click elsewhere to dismiss it`;
    }
    if (!cover.interactive && !cover.invisible) {
      const direct = href ? `; href ${href}; try open("${href}")` : '';
      return `${plain} is covered by another element, a non-dismissible layer, ${by}; nothing to dismiss (the page may be loading or the region is inactive)${direct}`;
    }
    const controls = cover.controls.filter((control) => control.id !== cover.close?.id).slice(0, 3)
      .map((control) => `#${control.id} "${control.name}"`).join(', ');
    return `${plain} is covered by another element, ${by}; dismiss that first${close}${controls ? ` (controls: ${controls})` : ''}`;
  }

  private inactiveMessage(label: string, controller: { id: number; name: string }): string {
    return `${label.replace(' (password)', '')} is inside a collapsed or inactive section; open #${controller.id} "${controller.name}" first`;
  }

  private explain(e: unknown, label: string): string {
    const msg = String(e instanceof Error ? e.message : e);
    const plain = label.replace(' (password)', '');
    const clickFailure = classifyClickError(e);
    if (clickFailure === 'intercepted') {
      return `${plain} is covered by another element; call read() to inspect what is blocking it`;
    }
    if (clickFailure === 'not-visible') {
      return `${plain} is not visible; try scroll(#id) or read() again`;
    }
    if (/not enabled|disabled/.test(msg) && /Timeout/.test(msg)) return `${plain} is disabled`;
    if (/detached from the DOM|not attached/.test(msg)) return `${plain} no longer exists; call read() to refresh`;
    if (/not an <input>|not editable|Element is not/.test(msg)) return `${plain} is not a text field`;
    if (/Timeout/.test(msg)) return `${plain} did not become clickable in time`;
    return `${plain}: ${brief(e)}`;
  }

  /** Observe before dispatch without spending either navigation budget until dispatch has happened. */
  private watchNavigation(page: Page, action = 'click'): NavigationWatch {
    const controller = new AbortController();
    const initialUrl = page.url();
    let hasStarted = false;
    let hasCommitted = false;
    let deadline: number | null = null;
    let resolveStarted: (started: boolean) => void = () => undefined;
    const started = new Promise<boolean>((resolve) => { resolveStarted = resolve; });
    const begin = (): void => {
      if (!hasStarted) {
        hasStarted = true;
        deadline = Date.now() + NAVIGATION_TIMEOUT;
        resolveStarted(true);
      }
    };
    const onRequest = (request: import('playwright').Request): void => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) begin();
    };
    page.on('request', onRequest);
    // History API navigations have no document request. Playwright reports them on the same
    // main-frame event as a document commit, so use that event as a second start signal.
    let onFrameNavigated: (frame: Frame) => void;
    const finished = new Promise<'finished'>((resolve) => {
      onFrameNavigated = (frame) => {
        if (frame !== page.mainFrame()) return;
        begin();
        hasCommitted = true;
        page.off('framenavigated', onFrameNavigated);
        resolve('finished');
      };
      page.on('framenavigated', onFrameNavigated);
    });
    void controller.signal.addEventListener('abort', () => resolveStarted(false), { once: true });
    /* A replacement navigation can abort the request wait; request and frame events remain
       installed until cancel so the replacement is still observed. */
    return {
      page,
      started,
      hasStarted: () => hasStarted,
      hasCommitted: () => hasCommitted || page.url() !== initialUrl,
      remainingMs: () => deadline === null ? null : Math.max(0, deadline - Date.now()),
      finished,
      failureMessage: `${action} was dispatched, but the navigation did not finish in time`,
      cancel: () => {
        controller.abort();
        page.off('request', onRequest);
        page.off('framenavigated', onFrameNavigated);
      },
    };
  }

  /** Complete an observed request within the one budget that began when it started. */
  private async waitForInFlightNavigation(navigation: NavigationWatch): Promise<void> {
    const remaining = navigation.remainingMs();
    if (remaining === null) return;
    if (remaining <= 0) {
      if (navigation.hasCommitted()) return;
      throw new ActionError(navigation.failureMessage);
    }
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    const outcome = await Promise.race([
      navigation.finished,
      new Promise<'timed-out'>((resolve) => { finishTimer = setTimeout(() => resolve('timed-out'), remaining); }),
    ]);
    if (finishTimer) clearTimeout(finishTimer);
    if (outcome === 'timed-out') {
      // A URL change is already the observable result the caller needs, even when a late load
      // event never arrives (for example, a document held open by a streaming response).
      if (navigation.hasCommitted()) return;
      throw new ActionError(navigation.failureMessage);
    }
    const loadRemaining = navigation.remainingMs();
    if (loadRemaining && loadRemaining > 0) {
      await navigation.page.waitForLoadState('domcontentloaded', { timeout: loadRemaining }).catch(() => undefined);
    }
  }

  /**
   * Fallbacks for a control Playwright could not click: a visible label that owns it, then a
   * snapshot-verified screen-reader-only control. True when one of them fired.
   */
  private async clickFallback(page: Page, el: ElementHandle<Element>, id: number, msg: string, associatedLabel: ElementHandle<Element> | null = null): Promise<boolean> {
    const failure = classifyClickError(msg);
    // A visible label can legitimately receive the pointer for its control.
    if (failure === 'intercepted' && await this.clickAssociatedLabel(el, associatedLabel)) return true;
    // The snapshot verified a screen-reader-only control.
    return failure !== null && await this.clickSrOnly(page, el, id);
  }

  /**
   * Set a checkbox/radio. If it cannot be clicked directly (visually hidden native input styled via its label),
   * use the click fallbacks, but only to reach the wanted state: never toggle it the wrong way.
   */
  private async setChecked(page: Page, el: ElementHandle<Element>, id: number, on: boolean, label: string): Promise<void> {
    const state = () => el.evaluate((n) => n instanceof HTMLInputElement ? { checked: n.checked, disabled: n.disabled, radio: n.type === 'radio' } : null).catch(() => null);
    const verify = async (): Promise<void> => {
      if ((await state())?.checked !== on) throw new ActionError(`${label} did not reach the requested state`);
    };
    const current = await state();
    if (!current || current.disabled) {
      await el.setChecked(on, { timeout: this.actionTimeout });
      await verify();
      return;
    }
    if (current.checked === on) return;
    // A radio cannot be unchecked by clicking it.
    if (current.radio && !on) throw new ActionError(`${label} is a radio; select another option instead`);
    const inactive = await this.inactiveController(el);
    if (inactive) throw new ActionError(this.inactiveMessage(label, inactive));
    const associatedLabel = await this.renderedAssociatedLabel(el);
    const cover = await this.coveredBy(el, associatedLabel);
    try {
      if (associatedLabel && !cover) await associatedLabel.click({ timeout: this.actionTimeout });
      else await el.setChecked(on, { timeout: cover ? COVERED_CLICK_TIMEOUT : this.actionTimeout });
      await verify();
    } catch (e) {
      if (e instanceof ActionError) throw e;
      const msg = String(e instanceof Error ? e.message : e);
      if (cover && /intercepts pointer events|Timeout/.test(msg)) throw new ActionError(this.coveredMessage(label, cover));
      if (classifyClickError(msg) === null) throw e;
      const cur = await state();
      if (!cur || cur.disabled) throw e;
      if (cur.checked === on) return;
      if (cur.radio && !on) throw e;
      if (!(await this.clickFallback(page, el, id, msg, associatedLabel)) || (await state())?.checked !== on) throw e;
    } finally {
      await associatedLabel?.dispose().catch(() => undefined);
    }
  }

  /** A label may intercept a pointer aimed at its own native control. No other overlay qualifies. */
  private async clickAssociatedLabel(el: ElementHandle<Element>, renderedLabel: ElementHandle<Element> | null = null): Promise<boolean> {
    const label = renderedLabel ?? await this.renderedAssociatedLabel(el);
    if (label) {
      try {
        await label.click({ timeout: COVERED_CLICK_TIMEOUT });
        return true;
      } catch {
        return false;
      } finally {
        if (!renderedLabel) await label.dispose().catch(() => undefined);
      }
    }
    const handle = await el.evaluateHandle((target) => {
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement || target instanceof HTMLButtonElement)) return null;
      const parent = (node: Element): Element | null => node.parentElement ?? (node.getRootNode() instanceof ShadowRoot ? (node.getRootNode() as ShadowRoot).host : null);
      const hitAt = (element: Element): Element | null => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
        const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2));
        const root = element.getRootNode() as Document | ShadowRoot;
        let hit: Element | null = (root instanceof ShadowRoot ? root : document).elementFromPoint(x, y);
        while (hit?.shadowRoot) {
          const inner = hit.shadowRoot.elementFromPoint(x, y);
          if (!inner || inner === hit) break;
          hit = inner;
        }
        return hit;
      };
      const hit = hitAt(target);
      for (let node = hit; node; node = parent(node)) {
        if (node instanceof HTMLLabelElement && node.control === target) return node;
      }
      return null;
    }).catch(() => null);
    const interceptedLabel = handle?.asElement();
    if (!interceptedLabel) {
      await handle?.dispose().catch(() => undefined);
      return false;
    }
    try {
      await interceptedLabel.click({ timeout: COVERED_CLICK_TIMEOUT });
      return true;
    } catch {
      return false;
    } finally {
      await handle?.dispose().catch(() => undefined);
    }
  }

  private async renderedAssociatedLabel(el: ElementHandle<Element>): Promise<ElementHandle<Element> | null> {
    const handle = await el.evaluateHandle(renderedLabelForHiddenControl).catch(() => null);
    const label = handle?.asElement();
    if (!label) await handle?.dispose().catch(() => undefined);
    return label ?? null;
  }

  /** Snapshot eligibility is established by the walker's narrow screen-reader-only predicate. */
  private async clickSrOnly(page: Page, el: ElementHandle<Element>, id: number): Promise<boolean> {
    const snap = (await this.observe(page).catch(() => null))?.snap;
    if (!snap?.nodes.some((n) => n.id === id && n.srOnly === true)) return false;
    return el.evaluate((node) => {
      if (!(node instanceof HTMLElement) || !node.isConnected) return false;
      if (node instanceof HTMLInputElement && (node.type === 'checkbox' || node.type === 'radio')) {
        node.click();
        return true;
      }
      node.focus();
      node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      node.click();
      node.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
      return true;
    }).catch(() => false);
  }

  /**
   * Observe only a blocked page for a rendered dialog or a disabled control becoming enabled.
   * A page still hydrating gets the long wait; a page that is only covered gets a shorter one.
   */
  private async waitForLateDialog(page: Page, disabledIds: number[], waitMs: number): Promise<boolean> {
    return page.evaluate(([ids, limit]) => new Promise<boolean>((done) => {
      const registry = (window as unknown as { __mantis?: { byId: Map<number, WeakRef<Element>> } }).__mantis;
      const initial = new Map(ids.map((id) => [id, registry?.byId.get(id)?.deref()]));
      const rendered = (el: Element): boolean => {
        if (el.closest('template')) return false;
        for (let node: Element | null = el; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
        }
        return el.getClientRects().length > 0;
      };
      const changed = (): boolean => {
        if (Array.from(document.querySelectorAll('dialog[open], [role="dialog"], [role="alertdialog"], [aria-modal="true"]')).some(rendered)) return true;
        return Array.from(initial.values()).some((el) => {
          if (!el?.isConnected) return false;
          const style = getComputedStyle(el);
          const blocked = el.matches(':disabled') || el.getAttribute('aria-disabled') === 'true' ||
            style.pointerEvents === 'none' || Number(style.opacity) < 0.5;
          return !blocked;
        });
      };
      if (changed()) { done(true); return; }
      const finish = (value: boolean): void => { observer.disconnect(); clearTimeout(timer); done(value); };
      const observer = new MutationObserver(() => { if (changed()) finish(true); });
      observer.observe(document, { subtree: true, childList: true, attributes: true });
      const timer = setTimeout(() => finish(false), limit);
    }), [disabledIds, waitMs] as [number[], number]).catch(() => false);
  }

  private isHeadless(): boolean {
    return this.opts.headless ?? process.env.MANTIS_HEADLESS !== '0';
  }

  /** Resolve an id or CSS selector to a live element, with a label for messages. */
  private async visualTarget(page: Page, t: Target): Promise<{ el: ElementHandle<Element>; label: string }> {
    if (t.id !== undefined) return this.target(page, t.id);
    if (t.selector) {
      const tokens = splitSelectorList(t.selector);
      const refs = tokens.flatMap((token) => {
        const match = token.trim().match(/^#(\d+)$/);
        return match ? [Number(match[1])] : [];
      });
      if (refs.length) {
        const selector = tokens.filter((token) => !/^#\d+$/.test(token.trim())).join(',');
        let selectorError: ActionError | undefined;
        if (selector) {
          try {
            return await this.visualTarget(page, { selector });
          } catch (e) {
            if (!(e instanceof ActionError)) throw e;
            selectorError = e;
          }
        }
        let missing: ActionError | undefined;
        for (const id of refs) {
          try {
            return await this.target(page, id);
          } catch (e) {
            if (!(e instanceof ActionError)) throw e;
            missing = e;
          }
        }
        throw selectorError ?? missing!;
      }
      // Validate once in the main document, then search each child frame. A selector has
      // document-local scope, so the first match follows the same main-frame-first order as
      // ordinary page.$(), while still reaching cross-origin frames through Playwright.
      try {
        const valid = await bounded(
          page.evaluate((selector) => void document.querySelector(selector), t.selector).then(() => true).catch(() => false),
          FRAME_OPERATION_MS,
        );
        if (valid !== true) throw new Error('selector did not validate');
      } catch {
        throw new ActionError(`invalid CSS selector "${t.selector}"`);
      }
      let el: ElementHandle<Element> | null = null;
      for (const frame of page.frames()) {
        el = await bounded(frame.$(t.selector).catch(() => null), FRAME_OPERATION_MS);
        if (el) break;
      }
      if (!el) throw new ActionError(`nothing matches selector "${t.selector}"; call media() to list images and charts`);
      return { el, label: `"${t.selector}"` };
    }
    throw new ActionError('give an element number (id) from read()/media(), or a CSS selector');
  }

  /** PNG of one element, scrolled into view; never the whole page. */
  private async shot(el: ElementHandle<Element>, label: string): Promise<Buffer> {
    try {
      await el.scrollIntoViewIfNeeded({ timeout: this.actionTimeout });
      return await el.screenshot({ type: 'png', timeout: this.actionTimeout * 2 });
    } catch (e) {
      throw new ActionError(`could not capture ${label}: ${brief(e)}`);
    }
  }

  /** A blank page in a separate context for image work; never becomes the active page. */
  private async scratchPage(): Promise<Page> {
    await this.launch();
    if (!this.scratch) {
      this.scratch = await this.browser!.newContext();
      await this.scratch.addInitScript(NAME_SHIM);
    }
    return this.scratch.pages()[0] ?? this.scratch.newPage();
  }

  /** Replace the browser context with a fresh one holding `state` (cookies + localStorage). */
  private async swapContext(state: Awaited<ReturnType<BrowserContext['storageState']>>): Promise<void> {
    const old = this.context;
    const ctx = await this.browser!.newContext({ viewport: { width: 1280, height: 800 }, storageState: state });
    await ctx.addInitScript(NAME_SHIM);
    await ctx.addInitScript(TRACKER);
    ctx.on('page', (p) => this.adopt(p));
    this.context = ctx;
    this.adopt(await ctx.newPage());
    await old?.close().catch(() => undefined);
  }

  /**
   * Wait for load, then for the page to go quiet: no DOM mutation for 150ms (3s cap). Pending
   * optionally gets a short grace, but a long-poll or beacon that leaves the DOM quiet cannot
   * hold an ordinary action for the full cap.
   * After an action only work begun since it counts (not background polling), and attributes that
   * keep changing on one element (animation) stop resetting the quiet timer.
   */
  private async settle(
    page: Page,
    afterAction = false,
    navigation: NavigationWatch | null = null,
    requestGrace = false,
    bounds: { max: number; idleGrace: number } | null = null,
  ): Promise<void> {
    const initialUrl = page.url();
    const settleStarted = Date.now();
    const settleMax = bounds?.max ?? 3000;
    // An action begins on an already-loaded document. Skipping this independent load wait
    // leaves a started navigation to the watcher's single bounded completion budget.
    if (!afterAction) await page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => undefined);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // A retry after a replaced document shares one total budget with its first attempt.
        const max = Math.max(1, settleMax - (Date.now() - settleStarted));
        const stop = await page.evaluate(
          ({ quiet, idleGrace, max, busyMax, timerMax, intervalMax, useEpoch, reason, requestGrace, requestMax, requestQuiet, chainedMax }) =>
            new Promise<string | undefined>((done) => {
              const w = window as unknown as {
                __mantisSetTimeout?: typeof setTimeout;
                __mantisBusy?: (since?: number, includeIntervals?: boolean, maxDelay?: number, minIntervalDelay?: number) => boolean;
                __mantisBusyKinds?: (since?: number, includeIntervals?: boolean, maxDelay?: number, minIntervalDelay?: number) => { timer: boolean; chained: boolean; interval: boolean; request: boolean; oneShotDelay: number };
                __mantisWake?: (() => void) | null;
                __mantisEpoch?: number;
                __mantisDocStart?: number;
                __mantisDomChanges?: number;
                __mantisEpochDomChanges?: number;
                __mantisObserveShadows?: (observer: MutationObserver, options: MutationObserverInit) => () => void;
              };
              const st = w.__mantisSetTimeout ?? setTimeout;
              let metaRefreshMs = 0;
              for (const meta of Array.from(document.querySelectorAll('meta[http-equiv="refresh" i]'))) {
                const match = meta.getAttribute('content')?.trim().match(/^([\d.]+)/);
                const delay = match ? Number(match[1]) * 1000 : NaN;
                if (Number.isFinite(delay) && delay >= 0 && delay <= 3000) { metaRefreshMs = delay; break; }
              }
              // Only work begun since the action (or post-navigation epoch) counts as pending.
              const since = useEpoch ? (w.__mantisEpoch ?? 0) : 0;
              const start = Date.now();
              const ownIntervals = useEpoch && (w.__mantisEpoch ?? 0) > (w.__mantisDocStart ?? Infinity);
              let sawMutation = false;
              let lastMutation = start;
              let timer: ReturnType<typeof setTimeout>;
              let unwatchShadows: (() => void) | undefined;
              const busyKinds = () => w.__mantisBusyKinds?.(since, ownIntervals, timerMax) ?? { timer: false, chained: false, interval: false, request: false, oneShotDelay: -1 };
              const describe = (busy: ReturnType<typeof busyKinds>): string =>
                ([busy.request && 'req', busy.timer && 'timer', busy.chained && 'chained', busy.interval && 'interval'].filter(Boolean).join('+') || 'none')
                + (busy.oneShotDelay >= 0 ? `(oneShot=${busy.oneShotDelay}ms)` : '');
              // Timing runs only: what was pending the first time a check deferred, since it has fired by the exit.
              let heldBy = '';
              // True while the next check is a poll of pending work (not the quiet window after a mutation).
              let polling = false;
              let mutations = 0;
              let finished = false;
              const defer = (): void => {
                if (reason && !heldBy) heldBy = `${describe(busyKinds())}@${Date.now() - start}ms`;
                polling = true;
                timer = st(check, 50);
              };
              // A tracked timer just ran. If it changed nothing in the DOM, re-check now rather than at the next 50ms poll.
              const wake = (): void => {
                if (!polling) return;
                const seen = mutations;
                st(() => {
                  if (finished || !polling || mutations !== seen) return;
                  clearTimeout(timer);
                  timer = st(check, 0);
                }, 0);
              };
              // Only a self-rearming timer is pending: no request, interval or one-shot that could still render a result.
              const onlyQuietPoll = (): boolean => {
                const busy = busyKinds();
                return busy.chained && busy.timer && !busy.request && !busy.interval && busy.oneShotDelay < 0;
              };
              const capReason = (): string => {
                const busy = busyKinds();
                return busy.request ? 'cap-request' : busy.timer ? 'cap-timer' : busy.interval ? 'cap-interval' : 'cap-timer';
              };
              const finish = (why = 'quiet'): void => {
                finished = true;
                if (w.__mantisWake === wake) w.__mantisWake = null;
                obs.disconnect();
                unwatchShadows?.();
                clearTimeout(timer);
                clearTimeout(cap);
                // Timing runs only: what was still pending and how long the DOM had been quiet.
                done(reason
                  ? `${why} pending=${describe(busyKinds())}${heldBy ? ` heldBy=${heldBy}` : ''} quietFor=${Date.now() - lastMutation}ms after=${Date.now() - start}ms`
                  : undefined);
              };
              const check = (): void => {
                polling = false;
                const elapsed = Date.now() - start;
                if (elapsed < metaRefreshMs) timer = st(check, Math.min(50, metaRefreshMs - elapsed));
                // An action's own interval can lead to a navigation, but an interval installed
                // while a destination document loads is background work and must not hold settle.
                // A quiet request, interval, or self-rearming timeout is a poll, not a pending result.
                // Keep one-shot timers in the normal window: they can still render a late result.
                else if (requestGrace && elapsed >= chainedMax && Date.now() - lastMutation >= requestQuiet && onlyQuietPoll()) finish('cap-timer');
                else if (requestGrace && elapsed >= requestMax && Date.now() - lastMutation >= requestQuiet) {
                  const busy = busyKinds();
                  if (busy.request && !busy.timer && !busy.interval) finish('cap-request');
                  else if (busy.chained && busy.timer) finish('cap-timer');
                  else if (w.__mantisBusy?.(since, ownIntervals, timerMax, 500) && elapsed < busyMax) defer();
                  else if (w.__mantisBusy?.(since, ownIntervals, timerMax) && elapsed < intervalMax) defer();
                  else finish(reason && (busy.request || busy.timer || busy.interval) ? capReason() : 'quiet');
                } else if (w.__mantisBusy?.(since, ownIntervals, timerMax, 500) && elapsed < busyMax) defer();
                else if (w.__mantisBusy?.(since, ownIntervals, timerMax) && elapsed < intervalMax) defer();
                else finish(reason && elapsed >= busyMax ? capReason() : 'quiet');
              };
              // An element whose same attribute keeps changing (carousel, spinner, ticker) is an animation:
              // after its 3rd change it no longer resets the quiet timer. New or removed content always does.
              // A carousel advancing across many slides touches each element only once or twice, so the same
              // change is also counted per kind (attribute + tag + first class).
              const repeats = new WeakMap<Node, Map<string, number>>();
              const kinds = new Map<string, number>();
              const NOISE = new Set(['script', 'style', 'link', 'meta', 'noscript', 'template']);
              const noise = (n: Node): boolean => {
                if (n.nodeType === 8) return true;
                if (n.nodeType === 3) return !(n.textContent ?? '').trim();
                if (!(n instanceof Element)) return false;
                if (NOISE.has(n.localName)) return true;
                if (n.localName === 'iframe' || n.localName === 'img') {
                  const r = n.getBoundingClientRect();
                  return r.width <= 1 && r.height <= 1;
                }
                return false;
              };
              const animated = (m: MutationRecord): boolean => {
                if (m.type === 'characterData') return false;
                if (m.type === 'childList') {
                  // Analytics and ad scripts injecting into <head>, or only tags that show nothing, are not new content.
                  const t = m.target;
                  if (t instanceof Element && (t.localName === 'head' || t.closest('head'))) return true;
                  const moved = [...Array.from(m.addedNodes), ...Array.from(m.removedNodes)];
                  return moved.length > 0 && moved.every(noise);
                }
                let per = repeats.get(m.target);
                if (!per) repeats.set(m.target, (per = new Map()));
                const name = m.attributeName ?? '';
                const n = (per.get(name) ?? 0) + 1;
                per.set(name, n);
                let repeated = n >= 3;
                if (m.target instanceof Element) {
                  const cls = m.target.classList[0];
                  if (cls) {
                    const kind = `${name}|${m.target.localName}|${cls}`;
                    const k = (kinds.get(kind) ?? 0) + 1;
                    kinds.set(kind, k);
                    if (k >= 3) repeated = true;
                  }
                }
                return repeated;
              };
              const obs = new MutationObserver((records) => {
                let real = false;
                for (const m of records) if (!animated(m)) real = true;
                if (!real) return;
                mutations++;
                polling = false;
                if (reason || requestGrace) {
                  sawMutation = true;
                  lastMutation = Date.now();
                }
                clearTimeout(timer);
                timer = st(check, quiet);
              });
              const options = { subtree: true, childList: true, attributes: true, characterData: true };
              obs.observe(document, options);
              // Open shadow roots (also ones attached while we wait) are not covered by an observer on the document.
              unwatchShadows = w.__mantisObserveShadows?.(obs, options);
              // The action left the DOM untouched and started no timer or request: nothing is known to be
              // coming, so a short grace for a frame-delayed effect replaces the full quiet window.
              // Any mutation during it restarts the normal window.
              const idle = useEpoch && metaRefreshMs === 0 && w.__mantisEpochDomChanges !== undefined
                && w.__mantisDomChanges === w.__mantisEpochDomChanges
                && !w.__mantisBusy?.(since, (w.__mantisEpoch ?? 0) > (w.__mantisDocStart ?? Infinity), timerMax);
              timer = st(check, idle ? idleGrace : quiet);
              w.__mantisWake = wake;
              const cap = st(() => finish(reason ? (sawMutation ? 'cap-mutations' : capReason()) : 'quiet'), max);
            }),
          {
            quiet: 150,
            idleGrace: Math.min(bounds?.idleGrace ?? 60, max),
            max,
            busyMax: max,
            // A page load can leave housekeeping timers (storage cleanup, idle flushes) of 2s or more; they do not render a result.
            timerMax: afterAction ? max : Math.min(max, 1999),
            intervalMax: Math.min(1000, max),
            useEpoch: afterAction,
            reason: !!this.timing,
            requestGrace,
            requestMax: 1000,
            requestQuiet: 300,
            chainedMax: 450,
          },
        );
        if (stop && this.timing) this.timing.settle = stop;
        // A timer can start a main-frame request after its own pending entry has fired. Do not
        // cancel that request's watcher just because the old document has become quiet.
        if (navigation?.hasStarted()) await this.timed('navigation', () => this.waitForInFlightNavigation(navigation));
        return;
      } catch (e) {
        if (e instanceof ActionError) throw e;
        const remaining = settleMax - (Date.now() - settleStarted);
        if (remaining <= 0) return;
        // Do not spend a second load-state timeout after a request has started. In particular,
        // a timer-triggered navigation that never commits has exactly the watcher's budget.
        if (navigation?.hasStarted()) await this.timed('navigation', () => this.waitForInFlightNavigation(navigation));
        // A navigation replaced the document under us; wait for it and try once more.
        // A committed navigation has already replaced the document. Retrying its load wait here
        // duplicates the watcher budget and can add five seconds to a page we can already read.
        if (page.url() === initialUrl && !navigation?.hasCommitted()) {
          await page.waitForLoadState('domcontentloaded', { timeout: Math.min(5000, remaining) }).catch(() => undefined);
        }
        if (Date.now() - settleStarted < settleMax) await sleep(Math.min(50, settleMax - (Date.now() - settleStarted)));
      }
    }
  }
}
