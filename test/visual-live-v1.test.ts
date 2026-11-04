import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { collectLiveV1Preflight } from '../bench/agent/live-v1-preflight.js';
import { liveV1SourceFingerprint } from '../bench/agent/live-v1.js';
import { VISUAL_LIVE_V1_ROWS, VISUAL_LIVE_V1_SCORED_ROWS, VISUAL_LIVE_V1_SOURCE_FINGERPRINTS, VISUAL_LIVE_V1_SUITE, VISUAL_LIVE_V1_TASKS, VISUAL_LIVE_V1_TASK_HASH, validateVisualLiveV1Rows, visualLiveV1TaskHash } from '../bench/agent/visual-live-v1.js';
import type { VisualLiveV1Row } from '../bench/agent/visual-live-v1.js';

const IDS = [
  'visuallive-books-one-star', 'visuallive-books-five-star-page', 'visuallive-oscars-ajax-winner', 'visuallive-quotes-infinite-scroll',
  'visuallive-quotes-delayed', 'visuallive-dynamic-loading', 'visuallive-xkcd-iso-date', 'visuallive-xkcd-worth-time',
];

describe('visual-live-v1 catalog', () => {
  it('loads the eight reviewed rows and schedules each as a live task', () => {
    expect(VISUAL_LIVE_V1_SUITE).toBe('visual-live-v1');
    expect(VISUAL_LIVE_V1_ROWS.map((row) => row.task_id)).toEqual(IDS);
    expect(VISUAL_LIVE_V1_ROWS.filter((row) => row.excluded)).toEqual([]);
    expect(VISUAL_LIVE_V1_SCORED_ROWS).toHaveLength(8);
    // What AGENT_SUITE=visual-live-v1 AGENT_TASKS=all selects.
    expect(VISUAL_LIVE_V1_TASKS.map((task) => task.id)).toEqual(IDS);
    expect(VISUAL_LIVE_V1_TASKS.every((task) => task.site === 'live' && task.judged === true)).toBe(true);
  });

  it('keys every row deterministically on an https source with reviewed notes', () => {
    for (const row of VISUAL_LIVE_V1_ROWS) {
      expect(row.grading, row.task_id).toBe('deterministic');
      expect(row.deterministic?.answerIncludes.length, row.task_id).toBeGreaterThan(0);
      expect(row.source.canonicalUrl.startsWith('https://'), row.task_id).toBe(true);
      expect(row.keyNotes.verified, row.task_id).toEqual(expect.any(String));
      expect(row.keyNotes.nearMiss, row.task_id).toEqual(expect.any(String));
      expect(VISUAL_LIVE_V1_SOURCE_FINGERPRINTS[row.task_id], row.task_id).toBe(liveV1SourceFingerprint(row));
    }
    expect(VISUAL_LIVE_V1_TASK_HASH).toBe(visualLiveV1TaskHash(VISUAL_LIVE_V1_ROWS));
    expect(VISUAL_LIVE_V1_TASK_HASH).toMatch(/^[0-9a-f]{64}$/);
    expect(createHash('sha256').update(JSON.stringify(VISUAL_LIVE_V1_SOURCE_FINGERPRINTS)).digest('hex')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('rejects malformed rows before any run begins', () => {
    const base = VISUAL_LIVE_V1_ROWS[0]!;
    const bad = (patch: Partial<VisualLiveV1Row>): VisualLiveV1Row[] => [{ ...base, ...patch } as VisualLiveV1Row, ...VISUAL_LIVE_V1_ROWS.slice(1)];
    expect(() => validateVisualLiveV1Rows(VISUAL_LIVE_V1_ROWS)).not.toThrow();
    expect(() => validateVisualLiveV1Rows([base, base])).toThrow(/unique/);
    expect(() => validateVisualLiveV1Rows(bad({ task_id: 'livev1-wrong-prefix' }))).toThrow(/visuallive-/);
    expect(() => validateVisualLiveV1Rows(bad({ deterministic: undefined }))).toThrow(/deterministic/);
    expect(() => validateVisualLiveV1Rows(bad({ grading: 'judge' as never }))).toThrow(/deterministic/);
    expect(() => validateVisualLiveV1Rows(bad({ source: { ...base.source, canonicalUrl: 'http://books.toscrape.com/' } }))).toThrow(/HTTPS/);
    expect(() => validateVisualLiveV1Rows(bad({ excluded: true }))).toThrow(/without an exclusion reason/);
    expect(() => validateVisualLiveV1Rows(bad({ exclusionReason: 'site down' }))).toThrow(/not excluded/);
    expect(() => validateVisualLiveV1Rows(bad({ excluded: true, exclusionReason: 'site down' }))).not.toThrow();
  });

  it('preflights its own sources offline without touching live-v1 behaviour', async () => {
    const offline = await collectLiveV1Preflight(false, undefined, 'visual-live-v1');
    expect(offline).toMatchObject({ suite: 'visual-live-v1', mode: 'offline', taskHash: VISUAL_LIVE_V1_TASK_HASH });
    expect(offline.candidates.map((candidate) => candidate.taskId)).toEqual(IDS);
    expect(offline.candidates.every((candidate) => candidate.status === 'unverified-offline')).toBe(true);
    const network = await collectLiveV1Preflight(true, async (url) => ({ ok: url.includes('xkcd'), status: url.includes('xkcd') ? 200 : 503 }), 'visual-live-v1');
    expect(network.candidates.filter((candidate) => candidate.status === 'reachable')).toHaveLength(2);
    expect((await collectLiveV1Preflight(false)).suite).toBe('live-v1');
  });
});
