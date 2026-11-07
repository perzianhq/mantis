import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { collectLiveV1Preflight } from '../bench/agent/live-v1-preflight.js';
import { liveV1SourceFingerprint } from '../bench/agent/live-v1.js';
import { REVISIT_LIVE_V1_ROWS, REVISIT_LIVE_V1_SCORED_ROWS, REVISIT_LIVE_V1_SOURCE_FINGERPRINTS, REVISIT_LIVE_V1_SUITE, REVISIT_LIVE_V1_TASKS, REVISIT_LIVE_V1_TASK_HASH, validateRevisitLiveV1Rows, revisitLiveV1TaskHash } from '../bench/agent/revisit-live-v1.js';
import type { RevisitLiveV1Row } from '../bench/agent/revisit-live-v1.js';

const IDS = [
  'revisitlive-iana-451-reference', 'revisitlive-apg-faq-phone', 'revisitlive-pep8-docstring-limit', 'revisitlive-go-release-date',
];

describe('revisit-live-v1 catalog', () => {
  it('loads the four reviewed rows and schedules each as a live task', () => {
    expect(REVISIT_LIVE_V1_SUITE).toBe('revisit-live-v1');
    expect(REVISIT_LIVE_V1_ROWS.map((row) => row.task_id)).toEqual(IDS);
    expect(REVISIT_LIVE_V1_ROWS.filter((row) => row.excluded)).toEqual([]);
    expect(REVISIT_LIVE_V1_SCORED_ROWS).toHaveLength(4);
    // What AGENT_SUITE=revisit-live-v1 AGENT_TASKS=all selects.
    expect(REVISIT_LIVE_V1_TASKS.map((task) => task.id)).toEqual(IDS);
    expect(REVISIT_LIVE_V1_TASKS.every((task) => task.site === 'live' && task.judged === true)).toBe(true);
  });

  it('keys every row deterministically on an https source with reviewed notes', () => {
    for (const row of REVISIT_LIVE_V1_ROWS) {
      expect(row.grading, row.task_id).toBe('deterministic');
      expect(row.deterministic?.answerIncludes.length, row.task_id).toBeGreaterThan(0);
      expect(row.source.canonicalUrl.startsWith('https://'), row.task_id).toBe(true);
      expect(row.keyNotes.verified, row.task_id).toEqual(expect.any(String));
      expect(row.keyNotes.nearMiss, row.task_id).toEqual(expect.any(String));
      expect(REVISIT_LIVE_V1_SOURCE_FINGERPRINTS[row.task_id], row.task_id).toBe(liveV1SourceFingerprint(row));
    }
    expect(REVISIT_LIVE_V1_TASK_HASH).toBe(revisitLiveV1TaskHash(REVISIT_LIVE_V1_ROWS));
    expect(REVISIT_LIVE_V1_TASK_HASH).toMatch(/^[0-9a-f]{64}$/);
    expect(createHash('sha256').update(JSON.stringify(REVISIT_LIVE_V1_SOURCE_FINGERPRINTS)).digest('hex')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('requires each row to end on its own page A and to cover collapsed and deep-table targets', () => {
    for (const row of REVISIT_LIVE_V1_ROWS) {
      const finalUrl = row.deterministic!.final.url;
      const alternatives = Array.isArray(finalUrl) ? finalUrl : [finalUrl];
      expect(alternatives, row.task_id).toHaveLength(1);
      expect(row.source.canonicalUrl, row.task_id).toBe(alternatives[0]!.origin + alternatives[0]!.path);
      expect(row.task, row.task_id).toContain(row.source.canonicalUrl);
    }
    expect(REVISIT_LIVE_V1_ROWS.some((row) => row.family === 'collapsed')).toBe(true);
    expect(REVISIT_LIVE_V1_ROWS.some((row) => row.family === 'table')).toBe(true);
  });

  it('rejects malformed rows before any run begins', () => {
    const base = REVISIT_LIVE_V1_ROWS[0]!;
    const bad = (patch: Partial<RevisitLiveV1Row>): RevisitLiveV1Row[] => [{ ...base, ...patch } as RevisitLiveV1Row, ...REVISIT_LIVE_V1_ROWS.slice(1)];
    expect(() => validateRevisitLiveV1Rows(REVISIT_LIVE_V1_ROWS)).not.toThrow();
    expect(() => validateRevisitLiveV1Rows([base, base])).toThrow(/unique/);
    expect(() => validateRevisitLiveV1Rows(bad({ task_id: 'livev1-wrong-prefix' }))).toThrow(/revisitlive-/);
    expect(() => validateRevisitLiveV1Rows(bad({ deterministic: undefined }))).toThrow(/deterministic/);
    expect(() => validateRevisitLiveV1Rows(bad({ grading: 'judge' as never }))).toThrow(/deterministic/);
    expect(() => validateRevisitLiveV1Rows(bad({ source: { ...base.source, canonicalUrl: 'http://peps.python.org/pep-0008/' } }))).toThrow(/HTTPS/);
    expect(() => validateRevisitLiveV1Rows(bad({ excluded: true }))).toThrow(/without an exclusion reason/);
    expect(() => validateRevisitLiveV1Rows(bad({ exclusionReason: 'site down' }))).toThrow(/not excluded/);
    expect(() => validateRevisitLiveV1Rows(bad({ excluded: true, exclusionReason: 'site down' }))).not.toThrow();
  });

  it('preflights its own sources offline without touching live-v1 behaviour', async () => {
    const offline = await collectLiveV1Preflight(false, undefined, 'revisit-live-v1');
    expect(offline).toMatchObject({ suite: 'revisit-live-v1', mode: 'offline', taskHash: REVISIT_LIVE_V1_TASK_HASH });
    expect(offline.candidates.map((candidate) => candidate.taskId)).toEqual(IDS);
    expect(offline.candidates.every((candidate) => candidate.status === 'unverified-offline')).toBe(true);
    const network = await collectLiveV1Preflight(true, async (url) => ({ ok: url.includes('peps') || url.includes('go.dev'), status: url.includes('peps') || url.includes('go.dev') ? 200 : 503 }), 'revisit-live-v1');
    expect(network.candidates.filter((candidate) => candidate.status === 'reachable')).toHaveLength(2);
    expect(network.candidates.filter((candidate) => candidate.status === 'blocked').map((candidate) => candidate.taskId)).toEqual(['revisitlive-iana-451-reference', 'revisitlive-apg-faq-phone']);
    expect((await collectLiveV1Preflight(false)).suite).toBe('live-v1');
  });
});
