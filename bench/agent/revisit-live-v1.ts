/**
 * revisit-live-v1: a small public real-site suite for revisiting information after leaving a page (a value deep in a
 * long table or page, inside a collapsed disclosure).  The agent visits page A, then two other pages, then answers
 * from page A and must finish there.  Every row is graded by the deterministic grader on the harness-captured final
 * state; there is no judge path.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { loadRealsiteRows, realsiteTask } from './realsite.js';
import type { RealsiteRow } from './realsite.js';
import type { AgentTask } from './tasks.js';
import { liveV1SourceFingerprint } from './live-v1.js';
import type { LiveV1Source } from './live-v1.js';

export const REVISIT_LIVE_V1_SUITE = 'revisit-live-v1' as const;
export const REVISIT_LIVE_V1_FILE = path.join(import.meta.dirname, 'revisit-live-v1-tasks.json');
export const REVISIT_LIVE_V1_FAMILIES = ['table', 'collapsed', 'deep'] as const;
export type RevisitLiveV1Family = typeof REVISIT_LIVE_V1_FAMILIES[number];

export interface RevisitLiveV1Row extends RealsiteRow {
  family: RevisitLiveV1Family;
  grading: 'deterministic';
  source: LiveV1Source;
  keyNotes: Record<string, unknown>;
  /** Retained in the catalog but never scheduled; needs a reason. */
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
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

function loadRaw(file: string): Record<string, unknown>[] {
  const value: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(value)) throw new Error(`${file} must be a JSON array.`);
  return value.map((item, index) => {
    if (!isObject(item)) throw new Error(`${file}[${index}] must be an object.`);
    return item;
  });
}

export const revisitLiveV1TaskHash = (rows: readonly RevisitLiveV1Row[]): string => sha256(canonical(rows
  .map((row) => ({ id: row.task_id, family: row.family, grading: row.grading, level: row.level, source: row.source, task: row.task, deterministic: row.deterministic ?? null, keyNotes: row.keyNotes, excluded: row.excluded ?? false, exclusionReason: row.exclusionReason ?? null }))
  .sort((a, b) => a.id.localeCompare(b.id))));

export function validateRevisitLiveV1Rows(rows: readonly RevisitLiveV1Row[]): void {
  const fail = (message: string): never => { throw new Error(`revisit-live-v1 catalog invalid: ${message}`); };
  if (new Set(rows.map((row) => row.task_id)).size !== rows.length) fail('task ids must be unique');
  for (const row of rows) {
    if (!/^revisitlive-/.test(row.task_id)) fail(`${row.task_id} must start with revisitlive-`);
    if (!REVISIT_LIVE_V1_FAMILIES.includes(row.family)) fail(`${row.task_id} has an unknown family`);
    if (row.grading !== 'deterministic' || !row.deterministic) fail(`${row.task_id} must be deterministic with a terminal-state contract`);
    if (row.excluded && !row.exclusionReason?.trim()) fail(`${row.task_id} is excluded without an exclusion reason`);
    if (!row.excluded && row.exclusionReason !== undefined) fail(`${row.task_id} has an exclusion reason but is not excluded`);
    if (!row.source.canonicalUrl.startsWith('https://') || row.source.fingerprintBasis !== 'canonical-url-and-contract') fail(`${row.task_id} has no canonical HTTPS source fingerprint basis`);
    if (!isObject(row.keyNotes) || typeof row.keyNotes.verified !== 'string' || typeof row.keyNotes.nearMiss !== 'string') fail(`${row.task_id} keyNotes need verified and nearMiss descriptions`);
  }
}

export function loadRevisitLiveV1Rows(file: string = REVISIT_LIVE_V1_FILE): RevisitLiveV1Row[] {
  const parsed = loadRealsiteRows(file, (message) => { throw new Error(message); });
  const raw = new Map(loadRaw(file).map((entry) => [String(entry.task_id ?? ''), entry]));
  const rows = parsed.map((base): RevisitLiveV1Row => {
    const entry = raw.get(base.task_id);
    const source = entry?.source;
    if (!entry || !isObject(source) || typeof source.canonicalUrl !== 'string' || typeof source.fingerprintBasis !== 'string' || typeof source.preflight !== 'string' || typeof entry.family !== 'string' || typeof entry.grading !== 'string' || !isObject(entry.keyNotes)) {
      throw new Error(`revisit-live-v1 catalog invalid: ${base.task_id} is missing family, grading, source or keyNotes metadata`);
    }
    if (entry.excluded !== undefined && entry.excluded !== true) throw new Error(`revisit-live-v1 catalog invalid: ${base.task_id} excluded must be true when present`);
    if (entry.exclusionReason !== undefined && (typeof entry.exclusionReason !== 'string' || !entry.exclusionReason.trim())) throw new Error(`revisit-live-v1 catalog invalid: ${base.task_id} exclusionReason must be a non-empty string when present`);
    return { ...base, family: entry.family as RevisitLiveV1Family, grading: entry.grading as 'deterministic', source: source as unknown as LiveV1Source, keyNotes: entry.keyNotes, ...(entry.excluded ? { excluded: true as const, exclusionReason: entry.exclusionReason as string } : {}) };
  });
  validateRevisitLiveV1Rows(rows);
  return rows;
}

export const REVISIT_LIVE_V1_ROWS: readonly RevisitLiveV1Row[] = Object.freeze(loadRevisitLiveV1Rows());
export const REVISIT_LIVE_V1_SCORED_ROWS: readonly RevisitLiveV1Row[] = Object.freeze(REVISIT_LIVE_V1_ROWS.filter((row) => !row.excluded));
export const REVISIT_LIVE_V1_TASKS: readonly AgentTask[] = Object.freeze(REVISIT_LIVE_V1_SCORED_ROWS.map(realsiteTask));
export const REVISIT_LIVE_V1_TASK_HASH = revisitLiveV1TaskHash(REVISIT_LIVE_V1_ROWS);
export const REVISIT_LIVE_V1_SOURCE_FINGERPRINTS = Object.freeze(Object.fromEntries(REVISIT_LIVE_V1_ROWS.map((row) => [row.task_id, liveV1SourceFingerprint(row)])));
