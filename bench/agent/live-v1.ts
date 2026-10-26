/**
 * Frozen public live-v1 catalog.  This intentionally does not use the gated
 * Online-Mind2Web source: every row and grading contract is reviewable here.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { loadRealsiteRows, realsiteTask } from './realsite.js';
import type { RealsiteRow } from './realsite.js';
import type { AgentTask } from './tasks.js';

export const LIVE_V1_SUITE = 'live-v1' as const;
export const LIVE_V1_FILE = path.join(import.meta.dirname, 'live-v1-tasks.json');
export const LIVE_V1_MANIFEST_FILE = path.join(import.meta.dirname, '..', 'manifests', 'live-v1.json');
export const LIVE_V1_FAMILIES = ['standards', 'documentation', 'civic-reference', 'open-data', 'site-navigation', 'interactive-exploration'] as const;
export type LiveV1Family = typeof LIVE_V1_FAMILIES[number];
export type LiveV1Grading = 'deterministic';

export interface LiveV1Source {
  canonicalUrl: string;
  fingerprintBasis: 'canonical-url-and-contract';
  preflight: 'unverified-offline' | 'reachable' | 'blocked' | 'changed';
}
export interface LiveV1Row extends RealsiteRow {
  family: LiveV1Family;
  grading: LiveV1Grading;
  source: LiveV1Source;
  /** Retained in the public catalog but omitted from live scheduling and scoring. */
  excluded?: true;
  exclusionReason?: string;
}

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonical(object[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

/** The frozen source fingerprint is URL + grading contract, not volatile page bytes. */
export const liveV1SourceFingerprint = (row: Pick<LiveV1Row, 'source' | 'deterministic' | 'judgeRubric' | 'task'>): string =>
  sha256(canonical({ url: row.source.canonicalUrl, deterministic: row.deterministic ?? null, rubric: row.judgeRubric ?? null, task: row.task }));

export const liveV1TaskHash = (rows: readonly LiveV1Row[]): string => sha256(canonical(rows
  .map((row) => ({ id: row.task_id, family: row.family, grading: row.grading, level: row.level, source: row.source, task: row.task, deterministic: row.deterministic ?? null, judgeRubric: row.judgeRubric ?? null, excluded: row.excluded ?? false, exclusionReason: row.exclusionReason ?? null }))
  .sort((a, b) => a.id.localeCompare(b.id))));

function loadRaw(file: string): Record<string, unknown>[] {
  const value: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(value)) throw new Error(`${file} must be a JSON array.`);
  return value.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`${file}[${index}] must be an object.`);
    return item as Record<string, unknown>;
  });
}

export function validateLiveV1Rows(rows: readonly LiveV1Row[]): void {
  const fail = (message: string): never => { throw new Error(`live-v1 catalog invalid: ${message}`); };
  if (rows.length !== 31) fail(`expected 31 documented tasks, got ${rows.length}`);
  const scored = rows.filter((row) => !row.excluded);
  if (scored.length !== 30) fail(`expected 30 scored tasks, got ${scored.length}`);
  if (new Set(rows.map((row) => row.task_id)).size !== rows.length) fail('task ids must be unique');
  const count = (items: readonly string[], value: string) => items.filter((item) => item === value).length;
  const families = scored.map((row) => row.family);
  if (rows.some((row) => !LIVE_V1_FAMILIES.includes(row.family))) fail('contains an unknown family');
  for (const family of LIVE_V1_FAMILIES) if (count(families, family) !== 5) fail(`family ${family} must contain exactly five scored tasks`);
  const gradings = scored.map((row) => row.grading);
  if (count(gradings, 'deterministic') !== 30) fail('requires 30 deterministic scored tasks');
  for (const row of rows) {
    if (row.excluded && !row.exclusionReason?.trim()) fail(`${row.task_id} is excluded without an exclusion reason`);
    if (!row.excluded && row.exclusionReason !== undefined) fail(`${row.task_id} has an exclusion reason but is not excluded`);
    if (row.grading === 'deterministic' && !row.deterministic) fail(`${row.task_id} is deterministic without a terminal-state contract`);
    if (row.grading !== 'deterministic') fail(`${row.task_id} must use deterministic grading`);
    if (!row.source.canonicalUrl.startsWith('https://') || row.source.fingerprintBasis !== 'canonical-url-and-contract') fail(`${row.task_id} has no canonical HTTPS source fingerprint basis`);
    if (!['unverified-offline', 'reachable', 'blocked', 'changed'].includes(row.source.preflight)) fail(`${row.task_id} has an invalid preflight status`);
  }
  for (const [level, expected] of Object.entries({ easy: 8, medium: 14, hard: 8 })) if (count(scored.map((row) => row.level), level) !== expected) fail(`expected ${expected} scored ${level} tasks`);
  const sites = new Map<string, number>();
  for (const row of rows) {
    const origin = new URL(row.website).origin;
    sites.set(origin, (sites.get(origin) ?? 0) + 1);
  }
  if (sites.size < 15) fail(`requires at least 15 independent sites, got ${sites.size}`);
  if ([...sites.values()].some((n) => n > 3)) fail('no site may have more than three tasks');
}

/** Parse and validate the catalog before any browser or paid model work starts. */
export function loadLiveV1Rows(file: string = LIVE_V1_FILE): LiveV1Row[] {
  const parsed = loadRealsiteRows(file, (message) => { throw new Error(message); });
  const raw = new Map(loadRaw(file).map((entry) => [String(entry.task_id ?? ''), entry]));
  const rows = parsed.map((base): LiveV1Row => {
    const entry = raw.get(base.task_id);
    const source = entry?.source as Partial<LiveV1Source> | undefined;
    const family = entry?.family;
    const grading = entry?.grading;
    if (typeof family !== 'string' || typeof grading !== 'string' || !source || typeof source.canonicalUrl !== 'string' || typeof source.fingerprintBasis !== 'string' || typeof source.preflight !== 'string') {
      throw new Error(`live-v1 catalog invalid: ${base.task_id} is missing family, grading, or source metadata`);
    }
    const excluded = entry?.excluded;
    const exclusionReason = entry?.exclusionReason;
    if (excluded !== undefined && excluded !== true) throw new Error(`live-v1 catalog invalid: ${base.task_id} excluded must be true when present`);
    if (exclusionReason !== undefined && (typeof exclusionReason !== 'string' || !exclusionReason.trim())) throw new Error(`live-v1 catalog invalid: ${base.task_id} exclusionReason must be a non-empty string when present`);
    return { ...base, family: family as LiveV1Family, grading: grading as LiveV1Grading, source: source as LiveV1Source, ...(excluded ? { excluded: true as const, exclusionReason: exclusionReason as string } : {}) };
  });
  validateLiveV1Rows(rows);
  return rows;
}

export const LIVE_V1_ROWS: readonly LiveV1Row[] = Object.freeze(loadLiveV1Rows());
/** Excluded rows remain documented but are never scheduled or counted in scorecards. */
export const LIVE_V1_SCORED_ROWS: readonly LiveV1Row[] = Object.freeze(LIVE_V1_ROWS.filter((row) => !row.excluded));
/** Unlike the legacy realsite selector, this frozen suite's `all` includes all scored judged rows. */
export const LIVE_V1_TASKS: readonly AgentTask[] = Object.freeze(LIVE_V1_SCORED_ROWS.map(realsiteTask));
export const LIVE_V1_TASK_HASH = liveV1TaskHash(LIVE_V1_ROWS);
export const LIVE_V1_SOURCE_FINGERPRINTS = Object.freeze(Object.fromEntries(LIVE_V1_ROWS.map((row) => [row.task_id, liveV1SourceFingerprint(row)])));
