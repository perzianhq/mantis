import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildEvidencePrompt } from '../bench/agent/judge.js';
import { evaluateDeterministicGrader } from '../bench/agent/realsite.js';
import { collectLiveV1Preflight } from '../bench/agent/live-v1-preflight.js';
import { LIVE_V1_ROWS, LIVE_V1_SOURCE_FINGERPRINTS, LIVE_V1_TASK_HASH, LIVE_V1_TASKS, loadLiveV1Rows, validateLiveV1Rows } from '../bench/agent/live-v1.js';
import type { LiveV1Row } from '../bench/agent/live-v1.js';

describe('live-v1 frozen public catalog', () => {
  it('selects every frozen task, including judged rows', () => {
    expect(LIVE_V1_ROWS).toHaveLength(30);
    expect(LIVE_V1_TASKS).toHaveLength(30);
    expect(LIVE_V1_TASKS.filter((task) => task.judged)).toHaveLength(30);
    expect(LIVE_V1_ROWS.filter((row) => row.grading === 'deterministic')).toHaveLength(20);
    expect(LIVE_V1_ROWS.filter((row) => row.grading === 'judge')).toHaveLength(10);
  });

  it('rejects a malformed catalog allocation before any run begins', () => {
    const corrupt = LIVE_V1_ROWS.map((row) => ({ ...row })) as LiveV1Row[];
    corrupt[0] = { ...corrupt[0]!, grading: 'judge', deterministic: undefined, judgeRubric: 'A rubric alone cannot repair the frozen allocation.' };
    expect(() => validateLiveV1Rows(corrupt)).toThrow(/20 deterministic and 10 judged/);
    expect(() => loadLiveV1Rows(fileURLToPath(new URL('../bench/agent/live-v1-tasks.json', import.meta.url)))).not.toThrow();
  });

  it('matches the immutable manifest task and source-fingerprint hashes', () => {
    const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/live-v1.json', import.meta.url), 'utf8')) as { tasks: string[]; taskHash: string; sourceFingerprintSetHash: string; grading: Record<string, number>; difficulty: Record<string, number> };
    expect(manifest.tasks).toEqual(LIVE_V1_ROWS.map((row) => row.task_id));
    expect(manifest.taskHash).toBe(LIVE_V1_TASK_HASH);
    expect(manifest.sourceFingerprintSetHash).toBe(createHash('sha256').update(JSON.stringify(LIVE_V1_SOURCE_FINGERPRINTS)).digest('hex'));
    expect(manifest.grading).toEqual({ deterministic: 20, judge: 10 });
    expect(manifest.difficulty).toEqual({ easy: 8, medium: 14, hard: 8 });
  });

  it('delivers the task-specific rubric to a blind judge without exposing tool details', () => {
    const row = LIVE_V1_ROWS.find((entry) => entry.grading === 'judge')!;
    const prompt = buildEvidencePrompt({ task: row.task, website: row.website, finalUrl: row.source.canonicalUrl, answer: 'Done.', rubric: row.judgeRubric, attached: false, frames: [] });
    expect(prompt).toContain(`Task-specific rubric: ${row.judgeRubric}`);
    expect(prompt).not.toMatch(/mantis|playwright|accessibility tree/i);
  });

  it('validates every deterministic contract and rejects its URL/text near misses', () => {
    for (const row of LIVE_V1_ROWS.filter((entry) => entry.grading === 'deterministic')) {
      const grader = row.deterministic!;
      const answer = grader.answerIncludes.map((item) => String(item.value)).join(' — ');
      const text = grader.final.textIncludes.map((item) => String(item.value)).join(' — ');
      const url = `${grader.final.url.origin}${grader.final.url.path}`;
      expect(evaluateDeterministicGrader(grader, answer, [{ final: true, url, text }])?.pass, row.task_id).toBe(true);
      expect(evaluateDeterministicGrader(grader, answer, [{ final: true, url: `${grader.final.url.origin}/wrong`, text }])?.pass, row.task_id).toBe(false);
      expect(evaluateDeterministicGrader(grader, answer, [{ final: true, url, text: 'near miss only' }])?.pass, row.task_id).toBe(false);
    }
    const postgres = LIVE_V1_ROWS.find((row) => row.task_id === 'livev1-docs-postgresql-types')!.deterministic!;
    expect(evaluateDeterministicGrader(postgres, 'Chapter 8. Data Types', [{ final: true, url: 'https://www.postgresql.org/docs/current/datatype.html', text: 'Chapter\u00a08.\u00a0Data Types' }])?.pass).toBe(true);
  });

  it('collects the free offline inventory without claiming live verification', async () => {
    const preflight = await collectLiveV1Preflight();
    expect(preflight).toMatchObject({ suite: 'live-v1', mode: 'offline', taskHash: LIVE_V1_TASK_HASH });
    expect(preflight.candidates).toHaveLength(30);
    expect(preflight.candidates.every((candidate) => candidate.status === 'unverified-offline')).toBe(true);
  });
});
