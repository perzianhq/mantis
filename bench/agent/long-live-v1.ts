/**
 * Reviewable long-horizon live-task draft. It intentionally stays schedulable
 * only for the rows not marked excluded; `assertLongLiveFreezable` is the
 * separate gate used when this draft becomes a frozen scorecard.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { loadRealsiteRows, realsiteTask } from './realsite.js';
import type { AgentTask } from './tasks.js';
import { liveV1SourceFingerprint } from './live-v1.js';
import type { LiveV1Row } from './live-v1.js';

export const LONG_LIVE_V1_SUITE = 'long-live-v1' as const;
export const LONG_LIVE_V1_FILE = path.join(import.meta.dirname, 'long-live-v1-draft.json');
export const LONG_LIVE_V1_MANIFEST_FILE = path.join(import.meta.dirname, '..', 'manifests', 'long-live-v1.json');

export type LongLiveKeyStatus = 'verified' | 'to-verify';
export interface LongLiveReferenceWalkthrough { status: string; method: string; steps: string[] }
export interface LongLiveNearMiss { description: string; expected: 'reject'; [key: string]: unknown }
export interface LongLiveV1Row extends LiveV1Row {
  taskType: string;
  referenceActions: readonly [number, number];
  nearMiss: LongLiveNearMiss;
  keyStatus: LongLiveKeyStatus;
  botRisk: string;
  referenceWalkthrough: LongLiveReferenceWalkthrough;
  keyNotes: Record<string, unknown>;
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

/** A draft's hash covers its review metadata as well as its grading contract. */
export const longLiveV1TaskHash = (rows: readonly LongLiveV1Row[]): string => sha256(canonical(rows
  .map((row) => ({ id: row.task_id, family: row.family, grading: row.grading, level: row.level, source: row.source, task: row.task, deterministic: row.deterministic ?? null, judgeRubric: row.judgeRubric ?? null, excluded: row.excluded ?? false, exclusionReason: row.exclusionReason ?? null, taskType: row.taskType, referenceActions: row.referenceActions, nearMiss: row.nearMiss, keyStatus: row.keyStatus, botRisk: row.botRisk, referenceWalkthrough: row.referenceWalkthrough, keyNotes: row.keyNotes }))
  .sort((a, b) => a.id.localeCompare(b.id))));

const DEMO_TASK_TYPES = new Set(['form-fill-no-submit', 'demo-test-account-flow', 'tab-frame-upload-chain']);

export function validateLongLiveV1Rows(rows: readonly LongLiveV1Row[]): void {
  const fail = (message: string): never => { throw new Error(`long-live-v1 catalog invalid: ${message}`); };
  if (new Set(rows.map((row) => row.task_id)).size !== rows.length) fail('task ids must be unique');
  if (rows.some((row) => !/^longlive-/.test(row.task_id))) fail('task ids must start with longlive-');
  const demoSites = new Set(rows.filter((row) => DEMO_TASK_TYPES.has(row.taskType)).map((row) => new URL(row.website).origin));
  if (demoSites.size > 4) fail(`at most four demo sites are allowed, got ${demoSites.size}`);
  for (const row of rows) {
    if (row.grading !== 'deterministic' && row.grading !== 'judge') fail(`${row.task_id} has invalid grading`);
    if (row.level !== 'medium' && row.level !== 'hard') fail(`${row.task_id} must be medium or hard`);
    if (!Array.isArray(row.referenceActions) || row.referenceActions.length !== 2 || !row.referenceActions.every((value) => Number.isInteger(value)) || row.referenceActions[0] < 20 || row.referenceActions[1] > 40 || row.referenceActions[0] > row.referenceActions[1]) fail(`${row.task_id} referenceActions must be an ordered 20-40 range`);
    if (!row.taskType.trim()) fail(`${row.task_id} is missing taskType`);
    if (!row.nearMiss?.description?.trim() || row.nearMiss.expected !== 'reject') fail(`${row.task_id} requires a rejecting near miss`);
    if (row.keyStatus !== 'verified' && row.keyStatus !== 'to-verify') fail(`${row.task_id} has invalid keyStatus`);
    if (!row.botRisk.trim()) fail(`${row.task_id} is missing botRisk`);
    if (!row.referenceWalkthrough?.status?.trim() || !row.referenceWalkthrough.method?.trim() || !Array.isArray(row.referenceWalkthrough.steps) || !row.referenceWalkthrough.steps.length || !row.referenceWalkthrough.steps.every((step) => typeof step === 'string' && step.trim())) fail(`${row.task_id} has an invalid referenceWalkthrough`);
    if (!row.keyNotes || !isObject(row.keyNotes)) fail(`${row.task_id} is missing keyNotes`);
    if (row.excluded && !row.exclusionReason?.trim()) fail(`${row.task_id} is excluded without an exclusion reason`);
    if (!row.excluded && row.exclusionReason !== undefined) fail(`${row.task_id} has an exclusion reason but is not excluded`);
    if (row.grading === 'deterministic' && !row.deterministic) fail(`${row.task_id} is deterministic without a terminal-state contract`);
    if (row.grading === 'judge' && row.deterministic) fail(`${row.task_id} is judge-graded but contains a deterministic contract`);
    if (row.grading === 'judge' && !row.judgeRubric?.trim()) fail(`${row.task_id} is judge-graded without a task-specific rubric`);
    if (!row.source.canonicalUrl.startsWith('https://') || row.source.fingerprintBasis !== 'canonical-url-and-contract') fail(`${row.task_id} has no canonical HTTPS source fingerprint basis`);
  }
}

/** Freezing is deliberate: the changing draft may be imported and tested before it is scorecard-ready. */
export function assertLongLiveFreezable(rows: readonly LongLiveV1Row[]): void {
  const scored = rows.filter((row) => !row.excluded);
  if (scored.length < 12) throw new Error(`long-live-v1 cannot freeze: requires at least 12 non-excluded rows, got ${scored.length}`);
  for (const row of scored) {
    if (row.keyStatus !== 'verified') throw new Error(`long-live-v1 cannot freeze: ${row.task_id} keyStatus must be verified`);
    if (!row.nearMiss?.description?.trim()) throw new Error(`long-live-v1 cannot freeze: ${row.task_id} requires a near miss`);
  }
}

export function loadLongLiveV1Rows(file: string = LONG_LIVE_V1_FILE): LongLiveV1Row[] {
  const parsed = loadRealsiteRows(file, (message) => { throw new Error(message); });
  const raw = new Map(loadRaw(file).map((entry) => [String(entry.task_id ?? ''), entry]));
  const rows = parsed.map((base): LongLiveV1Row => {
    const entry = raw.get(base.task_id);
    if (!entry) throw new Error(`long-live-v1 catalog invalid: ${base.task_id} is missing raw metadata`);
    const source = entry.source;
    const excluded = entry.excluded;
    const exclusionReason = entry.exclusionReason;
    const referenceActions = entry.referenceActions;
    if (excluded !== undefined && excluded !== true) throw new Error(`long-live-v1 catalog invalid: ${base.task_id} excluded must be true when present`);
    if (exclusionReason !== undefined && (typeof exclusionReason !== 'string' || !exclusionReason.trim())) throw new Error(`long-live-v1 catalog invalid: ${base.task_id} exclusionReason must be a non-empty string when present`);
    if (!isObject(source) || typeof source.canonicalUrl !== 'string' || typeof source.fingerprintBasis !== 'string' || typeof source.preflight !== 'string') throw new Error(`long-live-v1 catalog invalid: ${base.task_id} is missing source metadata`);
    if (!Array.isArray(referenceActions) || !isObject(entry.nearMiss) || typeof entry.keyStatus !== 'string' || typeof entry.taskType !== 'string' || typeof entry.botRisk !== 'string' || !isObject(entry.referenceWalkthrough) || !isObject(entry.keyNotes)) throw new Error(`long-live-v1 catalog invalid: ${base.task_id} is missing long-task metadata`);
    return { ...base, family: entry.family as LongLiveV1Row['family'], grading: entry.grading as LongLiveV1Row['grading'], source: source as LongLiveV1Row['source'], taskType: entry.taskType, referenceActions: referenceActions as [number, number], nearMiss: entry.nearMiss as LongLiveNearMiss, keyStatus: entry.keyStatus as LongLiveKeyStatus, botRisk: entry.botRisk, referenceWalkthrough: entry.referenceWalkthrough as LongLiveReferenceWalkthrough, keyNotes: entry.keyNotes, ...(excluded ? { excluded: true as const, exclusionReason: exclusionReason as string } : {}) };
  });
  validateLongLiveV1Rows(rows);
  return rows;
}

export const LONG_LIVE_V1_ROWS: readonly LongLiveV1Row[] = Object.freeze(loadLongLiveV1Rows());
export const LONG_LIVE_V1_SCORED_ROWS: readonly LongLiveV1Row[] = Object.freeze(LONG_LIVE_V1_ROWS.filter((row) => !row.excluded));
export const LONG_LIVE_V1_TASKS: readonly AgentTask[] = Object.freeze(LONG_LIVE_V1_SCORED_ROWS.map(realsiteTask));
export const LONG_LIVE_V1_TASK_HASH = longLiveV1TaskHash(LONG_LIVE_V1_ROWS);
export const LONG_LIVE_V1_SOURCE_FINGERPRINTS = Object.freeze(Object.fromEntries(LONG_LIVE_V1_ROWS.map((row) => [row.task_id, liveV1SourceFingerprint(row)])));

/** Produces the content for bench/manifests/long-live-v1.json once the freeze assertion passes. */
export function buildLongLiveV1Manifest(rows: readonly LongLiveV1Row[] = LONG_LIVE_V1_ROWS): Record<string, unknown> {
  assertLongLiveFreezable(rows);
  const scored = rows.filter((row) => !row.excluded);
  const fingerprints = Object.fromEntries(rows.map((row) => [row.task_id, liveV1SourceFingerprint(row)]));
  return {
    id: 'long-live-v1', selector: LONG_LIVE_V1_SUITE, kind: 'frozen-public-read-only-live-evaluation-config', status: 'frozen', sourceSelector: 'bench/agent/long-live-v1.ts', catalog: 'bench/agent/long-live-v1-draft.json', taskCount: scored.length, documentedTaskCount: rows.length,
    taskHashAlgorithm: 'sha256(canonical sorted task contracts)', taskHash: longLiveV1TaskHash(rows), sourceFingerprintAlgorithm: 'sha256(canonical URL + task-specific grading contract)', sourceFingerprintSetHash: sha256(JSON.stringify(fingerprints)), tasks: rows.map((row) => row.task_id), limits: { maxToolCalls: 100, executionTimeoutSeconds: 1200 },
  };
}
