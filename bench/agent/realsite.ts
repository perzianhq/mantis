/**
 * Real-site tasks for the agent eval: Online-Mind2Web-style rows from bench/agent/realsite-tasks.json
 * (an array of { task_id, website, confirmed_task, level, checks, deterministic }; `task` is accepted for `confirmed_task`). Real sites have no regex answer, so these tasks are
 * `judged: true` and graded afterwards by a blind LLM judge (bench/agent/judge.ts). The task's own
 * `expect` only checks that the agent finished (it printed the FINAL_URL line).
 *
 * Select them with AGENT_TASKS=cat:realsite. AGENT_REALSITE_N (default 10) rows are sampled, stratified
 * by level, with a seeded shuffle (AGENT_REALSITE_SEED, default 1), so the same N and seed always pick the same tasks.
 * If the JSON file is missing there are simply no realsite tasks.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { matchesAnswerRequirement, stripAnswerMetadata } from './grading.js';
import type { AnswerFactType } from './grading.js';
import type { AgentTask } from './tasks.js';

/** Optional legacy answer key: substrings the final reply / some evidence frame must contain. */
export interface RealsiteChecks { answerIncludes?: string[]; evidenceIncludes?: string[] }
export interface MatchPredicate { type: AnswerFactType; value: string | number; with?: { type: AnswerFactType; value: string | number } }
/**
 * `path` is the canonical pathname; `alsoPaths` lists other pathnames of the same page that the site legitimately
 * serves or redirects to (a `*` segment matches exactly one non-empty path segment).  A trailing slash never matters.
 */
export interface UrlPredicate {
  origin: string; path: string; alsoPaths?: string[]; query?: Record<string, string>;
  /** Query values matched as normalized human input; keys are exact. */
  queryExcludes?: Record<string, string>;
  /** Evidence that must be rendered by this particular accepted destination. */
  textIncludes?: MatchPredicate[];
}
/** A heading whose required answer and visible text are bound to one final URL. */
export interface PathHeadingPredicate { origin?: string; path: string; heading: MatchPredicate }

/** A form control is identified independently of its human-facing label. */
export interface FormValue {
  label: string;
  value: string;
  id?: string;
  name?: string;
  /** Zero-based occurrence among controls with the same id/name/label. */
  occurrence?: number;
}
export interface OrderedFormState { name: string; formValues: FormValue[] }
export interface FormHistory {
  /** A submitted form is never an acceptable intermediate state. */
  noSubmission?: true;
  /** Submissions the workflow legitimately needs (e.g. a published sandbox sign-in); more than this fails. */
  allowedSubmissions?: number;
  /** These controls must retain their original values throughout the run. */
  untouched?: FormValue[];
  /** Do not silently accept a final snapshot when the workflow needs history. */
  requireJournal?: true;
}
/** Require individually scoped observation calls before one later scoped observation. */
export interface ScopedObservationSequence { scopes: string[]; before: string }
export interface ProcessContract { separateScopedObservations?: ScopedObservationSequence }

/**
 * Explicit opt-in for answer keys that are safe to grade without a model.  All
 * requirements are checked against one final, harness-captured page state, so
 * a label from an earlier frame cannot prove that a final selection survived.
 */
export interface DeterministicGrader {
  kind: 'fact' | 'form' | 'state';
  answerIncludes: MatchPredicate[];
  /** Case-insensitive regular expressions the reply must not match (e.g. a live total the task forbids reporting). */
  answerExcludes?: string[];
  final: {
    url: UrlPredicate | UrlPredicate[];
    textIncludes: MatchPredicate[];
    /** Optional path-specific heading variants. Existing contracts keep their single shared heading checks. */
    pathHeadings?: PathHeadingPredicate[];
    formValues?: FormValue[];
  };
  /** Named checkpoints that must occur in this order in the harness journal. */
  orderedStates?: OrderedFormState[];
  history?: FormHistory;
}

/** Minimal final-frame shape, kept independent of the evidence implementation. */
export interface DeterministicEvidence {
  url: string;
  text: string;
  forms?: FormValue[];
  final?: boolean;
  /** Redacted harness history; imported structurally to keep this module pure. */
  journal?: { complete?: boolean; submissions?: unknown[]; states?: Array<{ name?: string; step?: number; url?: string; forms?: FormValue[] }>; observations?: Array<{ scope?: string }> };
}

export interface RealsiteRow {
  task_id: string; website: string; task: string; level: string;
  checks?: RealsiteChecks;
  deterministic?: DeterministicGrader;
  process?: ProcessContract;
  /** Narrow opt-in for a published disposable demonstration account. */
  sandboxLogin?: { username: string; password: string };
  uploadFixture?: string;
  /** Task-specific, non-leading criteria supplied to the blind judge. */
  judgeRubric?: string;
}

export const REALSITE_FILE = path.join(import.meta.dirname, 'realsite-tasks.json');

/** Small seeded PRNG (mulberry32): returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle with a supplied PRNG; returns a new array. */
export function shuffled<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const LEVEL_ORDER = ['easy', 'medium', 'hard'];
const levelRank = (level: string): number => {
  const i = LEVEL_ORDER.indexOf(level.toLowerCase());
  return i === -1 ? LEVEL_ORDER.length : i;
};

/**
 * Deterministic seeded sample of `n` rows, stratified by `level` in proportion to the level sizes
 * (largest-remainder allocation). The result does not depend on the input order, and its order is shuffled
 * so a partial run is not biased towards one level.
 */
export function sampleRealsite(rows: readonly RealsiteRow[], n: number, seed: number): RealsiteRow[] {
  const rand = mulberry32(seed);
  const sorted = [...rows].sort((a, b) => (a.task_id < b.task_id ? -1 : a.task_id > b.task_id ? 1 : 0));
  const groups = new Map<string, RealsiteRow[]>();
  for (const row of sorted) groups.set(row.level, [...(groups.get(row.level) ?? []), row]);
  const levels = [...groups.keys()].sort((a, b) => levelRank(a) - levelRank(b) || (a < b ? -1 : 1));
  const total = sorted.length;
  const want = Math.min(Math.max(0, Math.floor(n)), total);
  if (want === 0) return [];
  const quota = new Map<string, number>();
  const remainder: { level: string; frac: number }[] = [];
  let given = 0;
  for (const level of levels) {
    const exact = (groups.get(level)!.length / total) * want;
    quota.set(level, Math.floor(exact));
    given += Math.floor(exact);
    remainder.push({ level, frac: exact - Math.floor(exact) });
  }
  // Remaining slots go to the largest fractional parts (stable by level order), never above a group's size.
  remainder.sort((a, b) => b.frac - a.frac);
  for (let i = 0; given < want; i = (i + 1) % remainder.length) {
    const { level } = remainder[i]!;
    if (quota.get(level)! < groups.get(level)!.length) { quota.set(level, quota.get(level)! + 1); given++; }
  }
  const picked: RealsiteRow[] = [];
  for (const level of levels) picked.push(...shuffled(groups.get(level)!, rand).slice(0, quota.get(level)!));
  return shuffled(picked, rand);
}

/** All valid rows of the JSON file ([] when the file is missing). Missing or invalid answer-key checks are flagged. */
export function loadRealsiteRows(file: string = REALSITE_FILE, reportIssues: (message: string) => void = console.warn): RealsiteRow[] {
  if (!existsSync(file)) return [];
  const raw: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(raw)) throw new Error(`${file} must contain a JSON array of { task_id, website, confirmed_task, level, checks, deterministic }.`);
  const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const issues: string[] = [];
  const rows = raw.flatMap((item): RealsiteRow[] => {
    const o = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const task_id = text(o.task_id);
    const website = text(o.website);
    // Online-Mind2Web calls the task text `confirmed_task`; plain `task` is also accepted.
    const task = text(o.confirmed_task) ?? text(o.task);
    if (!task_id || !website || !task) return [];
    const deterministicIssue = validateDeterministicGrader(o.deterministic);
    const deterministic = parseDeterministicGrader(o.deterministic);
    const processIssue = validateProcessContract(o.process);
    const process = parseProcessContract(o.process);
    const checksIssue = validateChecks(o.checks);
    const judgeRubric = text(o.judgeRubric);
    const sandbox = o.sandboxLogin;
    const sandboxLogin = sandbox && typeof sandbox === 'object' && !Array.isArray(sandbox) && text((sandbox as Record<string, unknown>).username) && text((sandbox as Record<string, unknown>).password)
      ? { username: text((sandbox as Record<string, unknown>).username)!, password: text((sandbox as Record<string, unknown>).password)! }
      : undefined;
    const uploadFixture = text(o.uploadFixture);
    // A complete deterministic grader is itself the explicit answer-key opt-in;
    // legacy substring checks remain optional for those rows.
    if (checksIssue && !deterministic && !process && !judgeRubric) issues.push(`${task_id}: ${checksIssue}`);
    if (deterministicIssue) issues.push(`${task_id}: ${deterministicIssue}`);
    if (processIssue) issues.push(`${task_id}: ${processIssue}`);
    const checks = parseChecks(o.checks);
    return [{ task_id, website, task, level: text(o.level) ?? 'unknown', ...(checks ? { checks } : {}), ...(deterministic ? { deterministic } : {}), ...(process ? { process } : {}), ...(judgeRubric ? { judgeRubric } : {}), ...(sandboxLogin ? { sandboxLogin } : {}), ...(uploadFixture ? { uploadFixture } : {}) }];
  });
  if (issues.length) {
    const shown = issues.slice(0, 10).join('; ');
    reportIssues(`[realsite] ${issues.length} task row${issues.length === 1 ? '' : 's'} missing valid checks or deterministic graders in ${file}: ${shown}${issues.length > 10 ? `; and ${issues.length - 10} more` : ''}`);
  }
  return rows;
}

/** Null for a complete checks object; otherwise a stable validation message used by local and cloud runs. */
export function validateChecks(value: unknown): string | null {
  if (value === undefined) return 'missing checks';
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'checks must be an object';
  const o = value as Record<string, unknown>;
  const validList = (v: unknown): boolean => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && x.trim());
  const fields = ['answerIncludes', 'evidenceIncludes'] as const;
  const invalid = fields.filter((field) => Object.hasOwn(o, field) && !validList(o[field]));
  if (invalid.length) return `${invalid.join(' and ')} must be non-empty string arrays`;
  if (!fields.some((field) => validList(o[field]))) return 'checks must include answerIncludes or evidenceIncludes';
  return null;
}

function compilesAsRegExp(source: string): boolean {
  try { new RegExp(source, 'i'); return true; } catch { return false; }
}

/** Null for an absent or complete deterministic opt-in; otherwise a stable validation message. */
export function validateDeterministicGrader(value: unknown): string | null {
  if (value === undefined) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'deterministic must be an object';
  const o = value as Record<string, unknown>;
  if (Object.keys(o).some((key) => !['kind', 'answerIncludes', 'answerExcludes', 'final', 'orderedStates', 'history'].includes(key))) return 'deterministic contains an unknown field';
  if (o.kind !== 'fact' && o.kind !== 'form' && o.kind !== 'state') return 'deterministic.kind must be fact, form or state';
  if (!o.final || typeof o.final !== 'object' || Array.isArray(o.final)) return 'deterministic.final must be an object';
  const final = o.final as Record<string, unknown>;
  if (Object.keys(final).some((key) => !['url', 'textIncludes', 'pathHeadings', 'formValues'].includes(key))) return 'deterministic.final contains an unknown field';
  const predicate = (v: unknown): boolean => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
    const item = v as Record<string, unknown>;
    const scalar = ['text', 'number', 'entity'].includes(item.type as string) &&
      ((typeof item.value === 'string' && Boolean(item.value.trim())) || (typeof item.value === 'number' && Number.isFinite(item.value)));
    return scalar && (item.with === undefined || predicate(item.with));
  };
  if (!Array.isArray(o.answerIncludes) || !o.answerIncludes.every(predicate)) return 'deterministic.answerIncludes must be typed predicates';
  if (o.answerExcludes !== undefined && (!Array.isArray(o.answerExcludes) || !o.answerExcludes.length || !o.answerExcludes.every((p) => typeof p === 'string' && p.trim() && compilesAsRegExp(p)))) return 'deterministic.answerExcludes must be non-empty valid regular expression strings';
  const validUrl = (candidate: unknown): boolean => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
    const url = candidate as Record<string, unknown>;
    if (Object.keys(url).some((key) => !['origin', 'path', 'alsoPaths', 'query', 'queryExcludes', 'textIncludes'].includes(key)) || typeof url.origin !== 'string' || !url.origin.trim() || typeof url.path !== 'string' || !url.path.startsWith('/')) return false;
    if (url.alsoPaths !== undefined && (!Array.isArray(url.alsoPaths) || !url.alsoPaths.length || !url.alsoPaths.every((p) => typeof p === 'string' && p.startsWith('/')))) return false;
    if (url.query !== undefined && (!url.query || typeof url.query !== 'object' || Array.isArray(url.query) || !Object.values(url.query as Record<string, unknown>).every((v) => typeof v === 'string'))) return false;
    if (url.queryExcludes !== undefined && (!url.queryExcludes || typeof url.queryExcludes !== 'object' || Array.isArray(url.queryExcludes) || !Object.values(url.queryExcludes as Record<string, unknown>).every((v) => typeof v === 'string' && compilesAsRegExp(v)))) return false;
    return url.textIncludes === undefined || (Array.isArray(url.textIncludes) && url.textIncludes.length > 0 && url.textIncludes.every(predicate));
  };
  if (!(Array.isArray(final.url) ? final.url.length > 0 && final.url.every(validUrl) : validUrl(final.url))) return 'deterministic.final.url must be an origin/path predicate or non-empty alternatives';
  const urlHasText = (Array.isArray(final.url) ? final.url : [final.url]).some((url) => !!url && typeof url === 'object' && Array.isArray((url as Record<string, unknown>).textIncludes) && ((url as Record<string, unknown>).textIncludes as unknown[]).length > 0);
  if (!Array.isArray(final.textIncludes) || !final.textIncludes.every(predicate) || (!final.textIncludes.length && !urlHasText)) return 'deterministic.final.textIncludes must be typed predicates and non-empty unless a URL alternative supplies text';
  const headings = final.pathHeadings;
  if (headings !== undefined && (!Array.isArray(headings) || !headings.length || !headings.every((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
    const heading = entry as Record<string, unknown>;
    return Object.keys(heading).every((key) => ['origin', 'path', 'heading'].includes(key)) &&
      (heading.origin === undefined || (typeof heading.origin === 'string' && Boolean(heading.origin.trim()))) &&
      typeof heading.path === 'string' && heading.path.startsWith('/') && predicate(heading.heading);
  }))) return 'deterministic.final.pathHeadings must be non-empty path/heading predicates';
  const stateOnly = o.kind === 'state' && !o.answerIncludes.length;
  if (!o.answerIncludes.length && !headings?.length && !stateOnly) return 'deterministic.answerIncludes must be non-empty unless final.pathHeadings supplies headings or this is a state grader';
  const values = final.formValues;
  const validFormValue = (entry: unknown): entry is FormValue => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
    const form = entry as Record<string, unknown>;
    return Object.keys(form).every((key) => ['label', 'value', 'id', 'name', 'occurrence'].includes(key)) &&
      typeof form.label === 'string' && Boolean(form.label.trim()) && typeof form.value === 'string' &&
      (form.id === undefined || typeof form.id === 'string') && (form.name === undefined || typeof form.name === 'string') &&
      (form.occurrence === undefined || (Number.isInteger(form.occurrence) && (form.occurrence as number) >= 0));
  };
  const validForms = Array.isArray(values) && values.length > 0 && values.every(validFormValue);
  if (o.kind === 'form' && !validForms) return 'deterministic.final.formValues must be a non-empty label/value array for form graders';
  if (o.kind === 'fact' && values !== undefined && !validForms) return 'deterministic.final.formValues must be a non-empty label/value array when supplied';
  const ordered = o.orderedStates;
  if (ordered !== undefined && (!Array.isArray(ordered) || !ordered.length || !ordered.every((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
    const state = entry as Record<string, unknown>;
    return Object.keys(state).every((key) => key === 'name' || key === 'formValues') && typeof state.name === 'string' && Boolean(state.name.trim()) &&
      Array.isArray(state.formValues) && state.formValues.length > 0 && state.formValues.every(validFormValue);
  }))) return 'deterministic.orderedStates must be non-empty named form checkpoints';
  const history = o.history;
  if (history !== undefined) {
    if (!history || typeof history !== 'object' || Array.isArray(history) || Object.keys(history as object).some((key) => !['noSubmission', 'allowedSubmissions', 'untouched', 'requireJournal'].includes(key))) return 'deterministic.history contains an unknown field';
    const h = history as Record<string, unknown>;
    if ((h.noSubmission !== undefined && h.noSubmission !== true) || (h.allowedSubmissions !== undefined && (!Number.isInteger(h.allowedSubmissions) || (h.allowedSubmissions as number) < 1 || (h.allowedSubmissions as number) > 5)) || (h.requireJournal !== undefined && h.requireJournal !== true) ||
      (h.untouched !== undefined && (!Array.isArray(h.untouched) || !h.untouched.length || !h.untouched.every(validFormValue)))) return 'deterministic.history must contain valid redacted history constraints';
  }
  return null;
}

/** Null for an absent or complete process-only opt-in. */
export function validateProcessContract(value: unknown): string | null {
  if (value === undefined) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'process must be an object';
  const o = value as Record<string, unknown>;
  if (Object.keys(o).some((key) => key !== 'separateScopedObservations')) return 'process contains an unknown field';
  const sequence = o.separateScopedObservations;
  if (!sequence || typeof sequence !== 'object' || Array.isArray(sequence)) return 'process.separateScopedObservations must be an object';
  const s = sequence as Record<string, unknown>;
  if (Object.keys(s).some((key) => key !== 'scopes' && key !== 'before') || !Array.isArray(s.scopes) || !s.scopes.length || !s.scopes.every((scope) => typeof scope === 'string' && scope.trim()) || typeof s.before !== 'string' || !s.before.trim()) return 'process.separateScopedObservations must name non-empty scopes and a later scope';
  const names = [...s.scopes, s.before].map((scope) => (scope as string).trim().toLowerCase());
  if (new Set(names).size !== names.length) return 'process.separateScopedObservations scopes must be distinct';
  return null;
}

/** `checks` objects keep only the lists that are non-empty arrays of non-empty strings; anything else is ignored. */
function parseChecks(value: unknown): RealsiteChecks | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const o = value as Record<string, unknown>;
  const list = (v: unknown): string[] | undefined =>
    Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && x.trim()) ? (v as string[]).map((x) => x.trim()) : undefined;
  const answerIncludes = list(o.answerIncludes);
  const evidenceIncludes = list(o.evidenceIncludes);
  return answerIncludes || evidenceIncludes ? { ...(answerIncludes ? { answerIncludes } : {}), ...(evidenceIncludes ? { evidenceIncludes } : {}) } : undefined;
}

function parseDeterministicGrader(value: unknown): DeterministicGrader | undefined {
  if (value === undefined || validateDeterministicGrader(value) !== null) return undefined;
  const o = value as DeterministicGrader;
  const predicates = (items: MatchPredicate[]): MatchPredicate[] => items.map((item) => ({ type: item.type, value: typeof item.value === 'string' ? item.value.trim() : item.value, ...(item.with ? { with: { type: item.with.type, value: typeof item.with.value === 'string' ? item.with.value.trim() : item.with.value } } : {}) }));
  const url = (item: UrlPredicate): UrlPredicate => ({ origin: item.origin.trim(), path: item.path, ...(item.alsoPaths ? { alsoPaths: [...item.alsoPaths] } : {}), ...(item.query ? { query: { ...item.query } } : {}), ...(item.queryExcludes ? { queryExcludes: { ...item.queryExcludes } } : {}), ...(item.textIncludes ? { textIncludes: predicates(item.textIncludes) } : {}) });
  return {
    kind: o.kind,
    answerIncludes: predicates(o.answerIncludes),
    ...(o.answerExcludes ? { answerExcludes: [...o.answerExcludes] } : {}),
    final: {
      url: Array.isArray(o.final.url) ? o.final.url.map(url) : url(o.final.url),
      textIncludes: predicates(o.final.textIncludes),
      ...(o.final.pathHeadings ? { pathHeadings: o.final.pathHeadings.map((entry) => ({ ...(entry.origin ? { origin: entry.origin.trim() } : {}), path: entry.path, heading: predicates([entry.heading])[0]! })) } : {}),
      ...(o.final.formValues ? { formValues: o.final.formValues.map((entry) => ({ label: entry.label.trim(), value: entry.value, ...(entry.id !== undefined ? { id: entry.id } : {}), ...(entry.name !== undefined ? { name: entry.name } : {}), ...(entry.occurrence !== undefined ? { occurrence: entry.occurrence } : {}) })) } : {}),
    },
    ...(o.orderedStates ? { orderedStates: o.orderedStates.map((state) => ({ name: state.name.trim(), formValues: state.formValues.map((entry) => ({ label: entry.label.trim(), value: entry.value, ...(entry.id !== undefined ? { id: entry.id } : {}), ...(entry.name !== undefined ? { name: entry.name } : {}), ...(entry.occurrence !== undefined ? { occurrence: entry.occurrence } : {}) })) })) } : {}),
    ...(o.history ? { history: { ...(o.history.noSubmission ? { noSubmission: true as const } : {}), ...(o.history.allowedSubmissions ? { allowedSubmissions: o.history.allowedSubmissions } : {}), ...(o.history.requireJournal ? { requireJournal: true as const } : {}), ...(o.history.untouched ? { untouched: o.history.untouched.map((entry) => ({ label: entry.label.trim(), value: entry.value, ...(entry.id !== undefined ? { id: entry.id } : {}), ...(entry.name !== undefined ? { name: entry.name } : {}), ...(entry.occurrence !== undefined ? { occurrence: entry.occurrence } : {}) })) } : {}) } } : {}),
  };
}

function parseProcessContract(value: unknown): ProcessContract | undefined {
  if (value === undefined || validateProcessContract(value) !== null) return undefined;
  const sequence = (value as ProcessContract).separateScopedObservations!;
  return { separateScopedObservations: { scopes: sequence.scopes.map((scope) => scope.trim()), before: sequence.before.trim() } };
}

/** Treat common static-site aliases as one destination without task-specific lists. */
const normalizePath = (p: string): string => {
  let value = p.length > 1 ? p.replace(/\/+$/, '') || '/' : p;
  value = value.replace(/\/index\.html?$/i, '/') || '/';
  value = value.replace(/\.html?$/i, '') || '/';
  return value.length > 1 ? value.replace(/\/+$/, '') || '/' : value;
};
function urlPathMatches(actual: string, predicate: UrlPredicate): boolean {
  const got = normalizePath(actual);
  return [predicate.path, ...(predicate.alsoPaths ?? [])].some((allowed) => {
    const want = normalizePath(allowed);
    if (!want.includes('*')) return got === want;
    const a = got.split('/'); const w = want.split('/');
    return a.length === w.length && w.every((seg, i) => (seg === '*' ? Boolean(a[i]) : seg === a[i]));
  });
}

const norm = (s: string): string => s.replace(/\s+/g, ' ').trim().toLowerCase();
const normQuery = (s: string): string => norm(s.replace(/\+/g, ' '));
const predicateLabel = (predicate: MatchPredicate): string => String(predicate.value);
const matchesPredicate = (source: string, predicate: MatchPredicate): boolean =>
  matchesAnswerRequirement(source, { id: 'realsite', ...predicate });
/** FINAL_URL is transport metadata, never evidence that the reply answered a key. */
const answerContent = (answer: string): string => stripAnswerMetadata(answer);
const formMatches = (actual: FormValue, wanted: FormValue): boolean =>
  norm(actual.label) === norm(wanted.label) && actual.value === wanted.value &&
  (wanted.id === undefined || actual.id === wanted.id) && (wanted.name === undefined || actual.name === wanted.name) &&
  (wanted.occurrence === undefined || actual.occurrence === wanted.occurrence);

/**
 * Run a row's answer-key checks (case-insensitive, whitespace collapsed): every `answerIncludes` string must be in
 * the agent's full final reply and every `evidenceIncludes` string in at least one frame's page text.
 * Null when the row has no checks.
 */
export function evaluateChecks(checks: RealsiteChecks | undefined, answer: string, frameTexts: string[]): { pass: boolean; failed: string[] } | null {
  if (!checks || (!checks.answerIncludes?.length && !checks.evidenceIncludes?.length)) return null;
  const reply = norm(answerContent(answer));
  const texts = frameTexts.map(norm);
  const failed = [
    ...(checks.answerIncludes ?? []).filter((x) => !reply.includes(norm(x))).map((x) => `answer lacks "${x}"`),
    ...(checks.evidenceIncludes ?? []).filter((x) => !texts.some((t) => t.includes(norm(x)))).map((x) => `no frame shows "${x}"`),
  ];
  return { pass: failed.length === 0, failed };
}

/**
 * Evaluate a complete opted-in grader.  The final-frame restriction is
 * deliberate: stateful work must prove URL, result text, and submitted form
 * values together, rather than collecting matching fragments from history.
 */
export function evaluateDeterministicGrader(grader: DeterministicGrader | undefined, answer: string, frames: DeterministicEvidence[]): { pass: boolean; failed: string[] } | null {
  if (!grader) return null;
  // A stateful grader may only use the unique terminal harness capture.  Picking
  // the first marked frame would let a stale intermediate state prove success.
  const finals = frames.filter((frame) => frame.final);
  if (finals.length !== 1) return { pass: false, failed: [finals.length ? 'multiple final captured evidence frames' : 'no final captured evidence frame'] };
  const final = finals[0]!;
  const reply = norm(answer);
  let parsed: URL | null = null;
  try { parsed = new URL(final.url); } catch { /* reported below as an unmatched URL predicate */ }
  const text = final.text;
  const forms = final.forms ?? [];
  const alternatives = Array.isArray(grader.final.url) ? grader.final.url : [grader.final.url];
  const taskOrigin = alternatives[0]!.origin;
  const pathHeading = parsed && grader.final.pathHeadings?.find((entry) =>
    (entry.origin ?? taskOrigin) === parsed!.origin && normalizePath(entry.path) === normalizePath(parsed!.pathname));
  const matchingPathHeading = !grader.final.pathHeadings?.length || Boolean(pathHeading);
  const matchingUrl = parsed && alternatives.find((candidate) =>
    parsed!.origin === candidate.origin && urlPathMatches(parsed!.pathname, candidate) &&
    Object.entries(candidate.query ?? {}).every(([key, value]) => normQuery(parsed!.searchParams.get(key) ?? '') === normQuery(value)) &&
    Object.entries(candidate.queryExcludes ?? {}).every(([key, source]) => !new RegExp(source, 'i').test(normQuery(parsed!.searchParams.get(key) ?? '')))
  );
  const urlMatches = Boolean(matchingUrl || pathHeading);
  const failed = [
    ...grader.answerIncludes.filter((item) => !matchesPredicate(answerContent(answer), item)).map((item) => `answer lacks "${predicateLabel(item)}"`),
    ...(grader.answerExcludes ?? []).filter((source) => new RegExp(source, 'i').test(answerContent(answer).replace(/\s+/g, ' '))).map((source) => `answer contains forbidden pattern ${JSON.stringify(source)}`),
    ...(!urlMatches ? ['final URL does not match the required origin/path'] : []),
    ...(!matchingPathHeading ? ['final URL has no matching path-specific heading'] : []),
    ...(pathHeading && !matchesPredicate(answer, pathHeading.heading) ? [`answer lacks heading "${predicateLabel(pathHeading.heading)}" for the final path`] : []),
    ...grader.final.textIncludes.filter((item) => !matchesPredicate(text, item)).map((item) => `final frame lacks "${predicateLabel(item)}"`),
    ...(matchingUrl?.textIncludes ?? []).filter((item) => !matchesPredicate(text, item)).map((item) => `final frame lacks destination text "${predicateLabel(item)}"`),
    ...(pathHeading && !matchesPredicate(text, pathHeading.heading) ? [`final frame lacks heading "${predicateLabel(pathHeading.heading)}" for the final path`] : []),
    ...(grader.final.formValues ?? []).filter((wanted) => !forms.some((actual) => formMatches(actual, wanted))).map((wanted) => `final form lacks ${JSON.stringify(wanted.label)}=${JSON.stringify(wanted.value)}`),
    ...(() => {
      const journal = final.journal;
      if (!grader.orderedStates?.length && !grader.history) return [] as string[];
      if (!journal?.complete) return ['missing complete harness journal'];
      const states = journal.states ?? [];
      let cursor = -1;
      const missing = (grader.orderedStates ?? []).find((required) => {
        const found = states.findIndex((state, index) => index > cursor && (state.name === required.name || required.formValues.every((wanted) => (state.forms ?? []).some((actual) => formMatches(actual, wanted)))));
        if (found < 0) return true;
        cursor = found;
        return false;
      });
      const history = grader.history;
      return [
        ...(missing ? [`missing ordered journal state ${JSON.stringify(missing.name)}`] : []),
        ...((history?.noSubmission || history?.allowedSubmissions !== undefined) && (journal.submissions?.length ?? 0) > (history.allowedSubmissions ?? 0) ? ['journal records a form submission'] : []),
        ...(history?.untouched ?? []).filter((wanted) => states.some((state) => (state.forms ?? []).some((actual) => norm(actual.label) === norm(wanted.label) && actual.id === wanted.id && actual.name === wanted.name && actual.occurrence === wanted.occurrence && actual.value !== wanted.value))).map((wanted) => `journal shows changed untouched control ${JSON.stringify(wanted.label)}`),
      ];
    })(),
  ];
  return { pass: failed.length === 0, failed };
}

/**
 * A process contract can prove a violation, but cannot establish task success:
 * a complete matching ledger therefore leaves factual grading to the judge.
 * Older/incomplete sidecars omit `observations` and also fall back to the judge.
 */
export function evaluateProcessContract(contract: ProcessContract | undefined, frames: DeterministicEvidence[]): { pass: boolean; failed: string[] } | null {
  const sequence = contract?.separateScopedObservations;
  if (!sequence) return null;
  const final = frames.filter((frame) => frame.final);
  const observations = final.length === 1 ? final[0]!.journal?.observations : undefined;
  if (!observations) return null;
  let cursor = -1;
  const missing = sequence.scopes.find((scope) => {
    const found = observations.findIndex((observation, index) => index > cursor && norm(observation.scope ?? '') === norm(scope));
    if (found < 0) return true;
    cursor = found;
    return false;
  });
  const later = !missing && observations.findIndex((observation, index) => index > cursor && norm(observation.scope ?? '') === norm(sequence.before));
  const failed = missing
    ? [`missing separate scoped observation ${JSON.stringify(missing)} before ${JSON.stringify(sequence.before)}`]
    : later === -1
      ? [`missing later scoped observation ${JSON.stringify(sequence.before)}`]
      : [];
  return { pass: failed.length === 0, failed };
}

export function realsitePrompt(row: Pick<RealsiteRow, 'website' | 'task'> & { sandboxLogin?: { username: string; password: string } }): string {
  const safety = row.sandboxLogin
    ? `You may sign in only with this site's published sandbox credentials: username ${row.sandboxLogin.username}, password ${row.sandboxLogin.password}. Do not use any other account or credentials. Do not buy anything or enter personal information; use only task-provided synthetic values and stop before any irreversible step. `
    : 'Do not log in, buy anything, or enter personal information; stop before that step. Use only task-provided synthetic values. ';
  return `Start at ${row.website}. ${row.task} ${safety}` +
    'Finish with the page showing the evidence for your answer, including relevant inputs and site-generated results. Leave any required sign-in, purchase, or personal-information prompt open. State what is currently visible and distinguish it from earlier observations or your own calculations. Do not substitute your own estimate for a requested site result. ' +
    'When done, reply with your answer or what you did, then a last line "FINAL_URL: <url of the page you ended on>".';
}

export function realsiteTask(row: RealsiteRow): AgentTask {
  return {
    id: row.task_id,
    category: 'realsite',
    site: 'live',
    prompt: () => realsitePrompt(row),
    expect: /FINAL_URL:/,
    judged: true,
    ...(row.uploadFixture ? { uploadFixture: row.uploadFixture } : {}),
  };
}

function envInt(name: string, value: string | undefined, fallback: number, min: number): number {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < min || !Number.isSafeInteger(Number(value))) {
    throw new Error(`${name} must be an integer >= ${min}; received ${JSON.stringify(value)}.`);
  }
  return Number(value);
}

/** The sampled realsite tasks, per AGENT_REALSITE_N / AGENT_REALSITE_SEED. */
export function loadRealsiteTasks(env: NodeJS.ProcessEnv = process.env, file: string = REALSITE_FILE): AgentTask[] {
  const rows = loadRealsiteRows(file);
  if (!rows.length) return [];
  const n = envInt('AGENT_REALSITE_N', env.AGENT_REALSITE_N, 10, 1);
  const seed = envInt('AGENT_REALSITE_SEED', env.AGENT_REALSITE_SEED, 1, 0);
  return sampleRealsite(rows, n, seed).map(realsiteTask);
}

// ---- Parsing of the agent's final reply (shared with the judge) ----

/** The URL on the last `FINAL_URL:` line, or null. Tolerates markdown links, backticks, angle brackets and trailing punctuation. */
export function parseFinalUrl(text: string): string | null {
  const matches = [...text.matchAll(/FINAL_URL:[ \t]*([^\r\n]*)/gi)];
  for (let i = matches.length - 1; i >= 0; i--) {
    let value = matches[i]![1]!.trim();
    const link = /\]\((\S+?)\)/.exec(value);
    if (link) value = link[1]!;
    const url = /https?:\/\/[^\s<>`"'()\[\]]+/i.exec(value);
    if (url) return url[0].replace(/[.,;:!?*_]+$/, '');
  }
  return null;
}

// Tool identifiers may be embedded in names such as mcp__playwright__browser_click.
const TOOL_IDENTIFIERS = /\bmcp(?:__[a-z0-9_-]+)*\b|\bmantis\b|\bplaywright\b|\bsnapshots?\b|\baccessibility tree\b|\bscreenshots?\b|\bbrowser_\w+\b|\b\d+\s+tool calls?\b|\btool calls?\s*[:=]\s*\d+\b/gi;
// Pixel coordinates from a click-by-position tool: x=123, y=456 / (123, 456) / [123,456] / at 123,456 / "coordinates".
const COORDS = /\bat\s+[xy]\s*[=:]\s*\d{1,4}(?:\s*,\s*[xy]\s*[=:]\s*\d{1,4})?\b|\b[xy]\s*[=:]\s*\d{1,4}\b|[(\[]\s*\d{1,4}\s*,\s*\d{1,4}\s*[)\]]|\bat\s+\d{1,4}\s*,\s*\d{1,4}\b|\bcoordinates?\b/gi;
const REF_TOKENS = /(?<![\w$.])e\d{1,5}\b|(?<![\w&])#\d{1,5}\b|\[?\bref(?:\s*[=:]\s*|\s+)\[?\w*\d+\]?/gi;

/**
 * Numbers that belong to the visited pages (a whole URL path segment or query value, or a `#N` written in page text), so
 * an answer's `#98` that names a record is not mistaken for an element ref and redacted.
 */
export function pageNumbers(urls: readonly (string | null | undefined)[], texts: readonly string[]): Set<string> {
  const numbers = new Set<string>();
  for (const url of urls) for (const m of (url ?? '').matchAll(/[/=](\d{1,5})(?=[/?&#.]|$)/g)) numbers.add(m[1]!);
  for (const text of texts) for (const m of text.matchAll(/(?<![\w&])#(\d{1,5})\b/g)) numbers.add(m[1]!);
  return numbers;
}

/**
 * The final reply with anything that could reveal the browsing tool removed, so a judge cannot tell which
 * approach produced it: tool identifiers, numbered element refs (e42, #12, ref=...), and pixel coordinates
 * are redacted in place; FINAL_URL lines are omitted because that value is passed separately. A `#N` whose N is in
 * `keepNumbers` (see `pageNumbers`) is a value from the pages, not a ref, and stays.
 */
export function sanitizeAnswer(text: string, keepNumbers?: ReadonlySet<string>): string {
  const kept = text.split(/\r?\n/).flatMap((line) => {
    if (/^\s*FINAL_URL:/i.test(line)) return [];
    // These are statements about an agent's own browser chrome, not page content.
    // Keep this deliberately line-scoped and specific so an answer about a page is not removed.
    if (/^\s*(?:(?:note|disclaimer|caveat)\s*:\s*)?(?:(?:i|we)\s+(?:cannot|can't|could not|couldn't|(?:am|are|was|were) unable to)\s+(?:read|see|view|access|inspect|verify)\s+(?:the\s+)?(?:(?:url|address)\s*bar|(?:browser\s+)?tab(?:\s+(?:url|address))?)(?:[,:;]\s*(?:(?:so\s+)?(?:my|the)\s+)?(?:url|location)\s+(?:is|was)\s+(?:only\s+)?(?:inferred|guessed|estimated))?|(?:the\s+)?(?:(?:url|address)\s*bar|(?:browser\s+)?tab(?:\s+(?:url|address))?)\s+(?:is|was)\s+(?:not\s+)?(?:visible|readable|available|accessible|shown|displayed|legible)(?:[,:;]\s*(?:(?:so\s+)?(?:my|the)\s+)?(?:url|location)\s+(?:is|was)\s+(?:only\s+)?(?:inferred|guessed|estimated))?)[.!?]*\s*$/i.test(line)) return [];
    const redacted = line
      .replace(TOOL_IDENTIFIERS, '')
      .replace(COORDS, '')
      .replace(REF_TOKENS, (token) => (keepNumbers && /^#\d{1,5}$/.test(token) && keepNumbers.has(token.slice(1)) ? token : ''))
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\(\s*\)/g, '')
      .replace(/\s+([,.;:!?])/g, '$1')
      .trim();
    return redacted ? [redacted] : [];
  });
  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
