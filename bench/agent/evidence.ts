/**
 * Evidence frames for the blind judge: the harness (not the agent) captures the viewport and the page state
 * (URL, visible text, form values) after the agent's browser actions. This module holds the pure parts: the
 * in-page state function, parsing of its output, near-duplicate removal and the cap on kept frames, and the
 * sidecar written next to the run log. Capture itself lives in run.ts; the judge reads the sidecar.
 */
import { decodePng, grayThumb, thumbDiff } from './png.js';

export interface FormValue {
  label: string; value: string; id?: string; name?: string; occurrence?: number;
  /** Password contents are never retained; only this emptiness bit is allowed. */
  passwordEmpty?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}
/**
 * Harness-only workflow record. Passwords are represented only by emptiness and
 * files by basename; this shape must never carry secret control values.
 */
export interface EvidenceJournal {
  complete: boolean;
  submissions: { method: string; url: string }[];
  /** Every synchronous capture, including its browser-tool step when available. */
  states: { name?: string; step?: number; url?: string; forms: FormValue[] }[];
  transitions: { kind: 'document' | 'tab' | 'frame'; url: string }[];
  uploads: string[];
}
export interface EvidenceFrame {
  id: string; /** F1.. in chronological order */
  step: number; /** agent tool calls completed when captured */
  url: string;
  file: string; /** basename of the PNG, in the same folder as the sidecar */
  text: string; final?: boolean; forms?: FormValue[];
}
export interface EvidenceSidecar { frames: EvidenceFrame[]; captured: number; kept: number; captureMs: number; journal?: EvidenceJournal }

/**
 * Strict, site-agnostic signatures for browser/network/server error documents. These deliberately do not include
 * vague copy such as "something went wrong": normal pages can contain that text, while the signatures below identify
 * a document which itself failed to load. A 404 is left to the judge because it can also be an agent navigation error.
 */
const SITE_ERROR_TEXT = /(?:^|\n)\s*(?:this site can(?:not|['’]t) be reached|this page (?:isn['’]t|is not) working|this webpage is not available|internal server error|bad gateway|service unavailable|gateway timeout|http error 5\d\d|err_[a-z0-9_]+)\b/im;
const SITE_ERROR_URL = /^(?:chrome-error:\/\/|about:(?:neterror|certerror))/i;

export function isSiteErrorFrame(frame: Pick<EvidenceFrame, 'url' | 'text'>): boolean {
  return SITE_ERROR_URL.test(frame.url.trim()) || SITE_ERROR_TEXT.test(frame.text);
}

/** True only when the packet contains a definite site error and no frame contains usable page content. */
export function evidenceShowsOnlySiteErrors(frames: readonly Pick<EvidenceFrame, 'url' | 'text'>[]): boolean {
  const observed = frames.filter((frame) => frame.url.trim() || frame.text.trim());
  return observed.some(isSiteErrorFrame) && observed.every((frame) => isSiteErrorFrame(frame) || !frame.text.trim());
}

export const FINAL_TEXT_CAP = 30_000;
export const STEP_TEXT_CAP = 8_000;
export const MAX_FRAMES = 12;

/**
 * Arrow function source evaluated in the page (Playwright `page.evaluate(string)` or Playwright MCP
 * `browser_evaluate`). Self-contained; returns a JSON string { url, title, text, forms }.
 */
export const PAGE_STATE_FUNCTION = `() => {
  const clip = (s, n) => String(s == null ? '' : s).replace(/\\s+/g, ' ').trim().slice(0, n);
  const skip = ['hidden', 'submit', 'button', 'image', 'reset'];
  const forms = [];
  for (const el of document.querySelectorAll('input, select, textarea')) {
    if (forms.length >= 100) break;
    const type = (el.getAttribute('type') || '').toLowerCase();
    if (el.tagName === 'INPUT' && skip.includes(type)) continue;
    const box = el.getBoundingClientRect();
    if (!box.width && !box.height) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const labelledBy = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).map((id) => (document.getElementById(id) || {}).textContent || '').join(' ');
    const attached = el.labels ? Array.from(el.labels).map((l) => l.textContent || '').join(' ') : '';
    const label = clip(el.getAttribute('aria-label') || labelledBy || attached || el.getAttribute('placeholder') || el.getAttribute('name') || el.id, 80);
    let value;
    if (el.tagName === 'SELECT') value = Array.from(el.selectedOptions).map((o) => o.textContent || '').join(', ');
    else if (type === 'checkbox' || type === 'radio') value = el.checked ? 'checked' : 'unchecked';
    else if (type === 'password') value = '';
    else if (type === 'file') value = String(el.value || '').split(/[\\/]/).pop() || '';
    else value = el.value;
    const identity = { label, value: clip(value, 200), ...(el.id ? { id: el.id } : {}), ...(el.getAttribute('name') ? { name: el.getAttribute('name') } : {}), ...(type === 'password' ? { passwordEmpty: !el.value } : {}), ...(el.disabled ? { disabled: true } : {}), ...(el.readOnly ? { readonly: true } : {}) };
    forms.push(identity);
  }
  for (let i = 0; i < forms.length; i++) {
    const control = forms[i];
    const matches = forms.filter((other) => other.id === control.id && other.name === control.name && other.label === control.label);
    if (matches.length > 1) control.occurrence = matches.indexOf(control);
  }
  const submissionKey = '__mantis_bench_submissions_v1';
  let submissions = [];
  let saved = window.__mantisBenchSubmissions;
  if (!Array.isArray(saved)) { try { saved = JSON.parse(sessionStorage.getItem(submissionKey) || '[]'); } catch { saved = []; } }
  if (Array.isArray(saved)) submissions = saved.filter((entry) => entry && typeof entry.method === 'string' && typeof entry.url === 'string').slice(-20);
  if (!window.__mantisBenchSubmissionObserver) {
    window.__mantisBenchSubmissionObserver = true;
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      let prior = window.__mantisBenchSubmissions;
      if (!Array.isArray(prior)) { try { prior = JSON.parse(sessionStorage.getItem(submissionKey) || '[]'); } catch { prior = []; } }
      const next = Array.isArray(prior) ? prior : [];
      next.push({ method: (form.method || 'get').toUpperCase(), url: form.action || location.href });
      window.__mantisBenchSubmissions = next.slice(-20);
      try { sessionStorage.setItem(submissionKey, JSON.stringify(window.__mantisBenchSubmissions)); } catch { /* in-memory history covers sandboxed same-document flows */ }
    }, true);
  }
  const body = document.body;
  return JSON.stringify({ url: location.href, title: document.title, text: body ? body.innerText.slice(0, ${FINAL_TEXT_CAP}) : '', forms, submissions });
}`;

export interface PageState { url: string; title: string; text: string; forms: FormValue[]; submissions?: { method: string; url: string }[] }

/** Build the redacted, retained history from synchronous harness captures. */
export function journalFromPageStates(states: readonly (PageState & { step?: number })[], submissions: { method: string; url: string }[] = []): EvidenceJournal {
  const transitions = states.flatMap((state, index) => !index || states[index - 1]!.url !== state.url ? [{ kind: 'document' as const, url: state.url }] : []);
  const uploads = [...new Set(states.flatMap((state) => state.forms.filter((form) => /file|upload/i.test(`${form.label} ${form.name ?? ''} ${form.id ?? ''}`) && form.value).map((form) => form.value.split(/[\\/]/).pop()!)))];
  const observedSubmissions = [...submissions];
  for (const state of states) {
    // Each document retains the accumulated same-origin history. Append only the
    // suffix that was not present in the preceding synchronous checkpoint.
    const seen = state.submissions ?? [];
    if (seen.length >= observedSubmissions.length) observedSubmissions.push(...seen.slice(observedSubmissions.length));
  }
  return {
    // Captures are synchronous with each completed agent call. A zero-capture run
    // is deliberately incomplete and therefore cannot establish history.
    complete: states.length > 0,
    submissions: observedSubmissions,
    states: states.map((state) => ({ ...(state.step === undefined ? {} : { step: state.step }), url: state.url, forms: state.forms })),
    transitions,
    uploads,
  };
}

/** Parse PAGE_STATE_FUNCTION output: the raw JSON, or the Playwright MCP "### Result" wrapper around it. */
export function parsePageState(text: string): PageState | null {
  let value: unknown = text.trim();
  const wrapped = /^### Result\s*\n([\s\S]*?)(?:\n### |$)/.exec(value as string);
  if (wrapped) value = wrapped[1]!.trim();
  // The JSON string may be JSON-quoted once (MCP wrapper) or not at all.
  for (let i = 0; i < 3 && typeof value === 'string'; i++) {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (typeof o.url !== 'string' || typeof o.text !== 'string') return null;
  const forms = Array.isArray(o.forms)
    ? o.forms.flatMap((f): FormValue[] => {
      const v = f as Record<string, unknown> | null;
      return v && typeof v.label === 'string' && typeof v.value === 'string'
        ? [{ label: v.label, value: v.value, ...(typeof v.id === 'string' ? { id: v.id } : {}), ...(typeof v.name === 'string' ? { name: v.name } : {}), ...(Number.isInteger(v.occurrence) && (v.occurrence as number) >= 0 ? { occurrence: v.occurrence as number } : {}), ...(typeof v.passwordEmpty === 'boolean' ? { passwordEmpty: v.passwordEmpty } : {}), ...(v.disabled === true ? { disabled: true } : {}), ...(v.readonly === true ? { readonly: true } : {}) }]
        : [];
    })
    : [];
  const submissions = Array.isArray(o.submissions) ? o.submissions.flatMap((entry): { method: string; url: string }[] => {
    if (!entry || typeof entry !== 'object') return [];
    const event = entry as Record<string, unknown>;
    return typeof event.method === 'string' && typeof event.url === 'string' ? [{ method: event.method, url: event.url }] : [];
  }) : [];
  return { url: o.url, title: typeof o.title === 'string' ? o.title : '', text: o.text, forms, ...(submissions.length ? { submissions } : {}) };
}

/**
 * Drop near-duplicate frames and cap the count. Input is chronological; the last element is the final frame.
 * A frame is dropped when it is within `threshold` of the previous kept frame, on the same URL, and has unchanged
 * form values (if the frame before the final one is a near-duplicate of the final, that earlier one goes instead).
 * Above `max`, the first and last stay and the frames with the biggest visual, URL, or form-state change from their
 * predecessor fill the rest, in chronological order.
 */
const sameForm = (a: FormValue, b: FormValue): boolean =>
  a.label === b.label && a.id === b.id && a.name === b.name && a.occurrence === b.occurrence
    && a.value === b.value && a.passwordEmpty === b.passwordEmpty && a.disabled === b.disabled && a.readonly === b.readonly;

/** Form values are sampled independently of pixels, so preserve small but meaningful input changes. */
const formsChanged = (before: readonly FormValue[] | undefined, after: readonly FormValue[] | undefined): boolean => {
  const left = before ?? [];
  const right = after ?? [];
  return left.length !== right.length || left.some((form) => !right.some((other) => sameForm(form, other)));
};

export function selectFrames<T extends { thumb: Uint8Array; url: string; forms?: readonly FormValue[] }>(frames: T[], max = MAX_FRAMES, threshold = 2): T[] {
  if (frames.length === 0) return [];
  const final = frames[frames.length - 1]!;
  if (max <= 1) return [final];
  const seq: T[] = [];
  for (const frame of frames.slice(0, -1)) {
    const prev = seq[seq.length - 1];
    if (prev && prev.url === frame.url && thumbDiff(prev.thumb, frame.thumb) < threshold && !formsChanged(prev.forms, frame.forms)) continue;
    seq.push(frame);
  }
  const last = seq[seq.length - 1];
  if (last && last.url === final.url && thumbDiff(last.thumb, final.thumb) < threshold && !formsChanged(last.forms, final.forms)) seq.pop();
  seq.push(final);
  if (seq.length <= max) return seq;
  const score = (i: number): number => thumbDiff(seq[i - 1]!.thumb, seq[i]!.thumb)
    + (seq[i - 1]!.url !== seq[i]!.url ? 50 : 0)
    + (formsChanged(seq[i - 1]!.forms, seq[i]!.forms) ? 10_000 : 0);
  const middle = Array.from({ length: seq.length - 2 }, (_, k) => k + 1).sort((a, b) => score(b) - score(a) || a - b).slice(0, max - 2);
  const keep = new Set([0, seq.length - 1, ...middle]);
  return seq.filter((_, i) => keep.has(i));
}

/** One harness capture held in memory until the run ends. */
export interface CapturedFrame { step: number; url: string; text: string; forms: FormValue[]; png: Buffer; thumb: Uint8Array; final?: boolean }

/** A frame from the PNG bytes and the page-state text; null if the PNG cannot be decoded. */
export function toCapturedFrame(png: Buffer, state: string | null, step: number, final = false): CapturedFrame | null {
  try {
    const parsed = state === null ? null : parsePageState(state);
    return { step, url: parsed?.url ?? '', text: parsed?.text ?? '', forms: parsed?.forms ?? [], png, thumb: grayThumb(decodePng(png)), ...(final ? { final: true } : {}) };
  } catch { return null; }
}

/**
 * Select the frames to keep and name their files. Earlier frames are `<unique>.step-NN.png` (a `-b`, `-c`..
 * suffix when two share a step); the final one is `<unique>.final.png`. Earlier text is capped for the sidecar.
 */
export function packEvidence(frames: CapturedFrame[], unique: string, captureMs: number, journal?: EvidenceJournal): { sidecar: EvidenceSidecar; pngs: { file: string; png: Buffer }[] } {
  const kept = selectFrames(frames);
  const used = new Map<number, number>();
  const pngs: { file: string; png: Buffer }[] = [];
  const out = kept.map((frame, i): EvidenceFrame => {
    let file = `${unique}.final.png`;
    if (!frame.final) {
      const n = used.get(frame.step) ?? 0;
      used.set(frame.step, n + 1);
      file = `${unique}.step-${String(frame.step).padStart(2, '0')}${n ? `-${String.fromCharCode(97 + n)}` : ''}.png`;
    }
    pngs.push({ file, png: frame.png });
    const entry: EvidenceFrame = { id: `F${i + 1}`, step: frame.step, url: frame.url, file, text: frame.text.slice(0, frame.final ? FINAL_TEXT_CAP : STEP_TEXT_CAP) };
    if (frame.final) { entry.final = true; entry.forms = frame.forms; }
    return entry;
  });
  return { sidecar: { frames: out, captured: frames.length, kept: out.length, captureMs, ...(journal ? { journal } : {}) }, pngs };
}
