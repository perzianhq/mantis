import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildEvidencePrompt } from '../bench/agent/judge.js';
import { evaluateDeterministicGrader } from '../bench/agent/realsite.js';
import { collectLiveV1Preflight } from '../bench/agent/live-v1-preflight.js';
import { LIVE_V1_ROWS, LIVE_V1_SCORED_ROWS, LIVE_V1_SOURCE_FINGERPRINTS, LIVE_V1_TASK_HASH, LIVE_V1_TASKS, loadLiveV1Rows, validateLiveV1Rows } from '../bench/agent/live-v1.js';
import type { LiveV1Row } from '../bench/agent/live-v1.js';

describe('live-v1 frozen public catalog', () => {
  it('documents excluded rows but schedules and scores only the frozen scored cohort', () => {
    expect(LIVE_V1_ROWS).toHaveLength(31);
    expect(LIVE_V1_SCORED_ROWS).toHaveLength(30);
    expect(LIVE_V1_ROWS.filter((row) => row.excluded)).toEqual([expect.objectContaining({ task_id: 'livev1-standards-gpl-3', exclusionReason: expect.any(String) })]);
    expect(LIVE_V1_TASKS).toHaveLength(30);
    expect(LIVE_V1_TASKS.filter((task) => task.judged)).toHaveLength(30);
    expect(LIVE_V1_SCORED_ROWS.filter((row) => row.grading === 'deterministic')).toHaveLength(20);
    expect(LIVE_V1_SCORED_ROWS.filter((row) => row.grading === 'judge')).toHaveLength(10);
    expect(LIVE_V1_TASKS.map((task) => task.id)).not.toContain('livev1-standards-gpl-3');
  });

  it('rejects a malformed catalog allocation before any run begins', () => {
    const corrupt = LIVE_V1_ROWS.map((row) => ({ ...row })) as LiveV1Row[];
    const scoredIndex = corrupt.findIndex((row) => !row.excluded);
    corrupt[scoredIndex] = { ...corrupt[scoredIndex]!, grading: 'judge', deterministic: undefined, judgeRubric: 'A rubric alone cannot repair the frozen allocation.' };
    expect(() => validateLiveV1Rows(corrupt)).toThrow(/20 deterministic and 10 judged scored/);
    expect(() => loadLiveV1Rows(fileURLToPath(new URL('../bench/agent/live-v1-tasks.json', import.meta.url)))).not.toThrow();
  });

  it('matches the immutable manifest task and source-fingerprint hashes', () => {
    const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/live-v1.json', import.meta.url), 'utf8')) as { taskCount: number; tasks: string[]; taskHash: string; sourceFingerprintSetHash: string; grading: Record<string, number>; difficulty: Record<string, number> };
    expect(manifest.taskCount).toBe(30);
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
      const pathHeading = grader.final.pathHeadings?.find((heading) => heading.path === grader.final.url.path);
      const headingValue = pathHeading ? ` ${String(pathHeading.heading.value)}` : '';
      const answer = grader.answerIncludes.map((item) => String(item.value)).join(' — ');
      const text = grader.final.textIncludes.map((item) => String(item.value)).join(' — ');
      const url = `${grader.final.url.origin}${grader.final.url.path}`;
      expect(evaluateDeterministicGrader(grader, answer + headingValue, [{ final: true, url, text: text + headingValue }])?.pass, row.task_id).toBe(true);
      expect(evaluateDeterministicGrader(grader, answer, [{ final: true, url: `${grader.final.url.origin}/wrong`, text }])?.pass, row.task_id).toBe(false);
      expect(evaluateDeterministicGrader(grader, answer, [{ final: true, url, text: 'near miss only' }])?.pass, row.task_id).toBe(false);
    }
    const postgres = LIVE_V1_ROWS.find((row) => row.task_id === 'livev1-docs-postgresql-types')!.deterministic!;
    expect(evaluateDeterministicGrader(postgres, 'Chapter 8. Data Types', [{ final: true, url: 'https://www.postgresql.org/docs/current/datatype.html', text: 'Chapter\u00a08.\u00a0Data Types' }])?.pass).toBe(true);
  });

  it('accepts each reviewed live-v1 answer-key alternative and rejects its paired near miss', () => {
    const grade = (id: string, answer: string, url: string, text: string): boolean => {
      const grader = LIVE_V1_ROWS.find((row) => row.task_id === id)!.deterministic!;
      return evaluateDeterministicGrader(grader, answer, [{ final: true, url, text }])?.pass ?? false;
    };

    expect(grade('livev1-docs-django-overview', 'Django at a glance', 'https://docs.djangoproject.com/en/6.1/intro/overview/', 'Django at a glance')).toBe(true);
    expect(grade('livev1-docs-django-overview', 'Why Django?', 'https://www.djangoproject.com/start/overview/', 'Why Django?')).toBe(true);
    expect(grade('livev1-docs-django-overview', 'Django at a glance', 'https://www.djangoproject.com/start/overview/', 'Django at a glance')).toBe(false);

    expect(grade('livev1-docs-postgresql-types', 'Chapter 8. Data Types', 'https://www.postgresql.org/docs/18/datatype.html', 'Chapter 8. Data Types')).toBe(true);
    expect(grade('livev1-docs-postgresql-types', 'Chapter 8. Data Types', 'https://www.postgresql.org/docs/17/datatype.html', 'Chapter 8. Data Types')).toBe(false);

    expect(grade('livev1-civic-nist-about', 'About NIST', 'https://www.nist.gov/about-nist', 'About NIST | NIST')).toBe(true);
    expect(grade('livev1-civic-nist-about', 'About NIST', 'https://www.nist.gov/about-nist/leadership', 'About NIST | NIST')).toBe(false);

    expect(grade('livev1-data-ourworldindata-co2', 'CO2 emissions', 'https://ourworldindata.org/co2-emissions', 'CO2 emissions')).toBe(true);
    expect(grade('livev1-data-ourworldindata-co2', 'CO2 and Greenhouse Gas Emissions', 'https://ourworldindata.org/co2-and-greenhouse-gas-emissions', 'CO2 and Greenhouse Gas Emissions')).toBe(true);
    expect(grade('livev1-data-ourworldindata-co2', 'CO2 emissions', 'https://ourworldindata.org/co2-and-greenhouse-gas-emissions', 'CO2 emissions')).toBe(false);

    expect(grade('livev1-docs-mdn-http-overview', 'Overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'Overview of HTTP')).toBe(true);
    expect(grade('livev1-docs-mdn-http-overview', 'HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP', 'HTTP')).toBe(true);
    expect(grade('livev1-docs-mdn-http-overview', 'Overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP', 'HTTP')).toBe(true);
    expect(grade('livev1-docs-mdn-http-overview', 'Overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching', 'Overview of HTTP')).toBe(false);
    expect(grade('livev1-docs-mdn-http-overview', 'HTTP caching', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'Overview of HTTP')).toBe(false);
  });

  it('collects the free offline inventory without claiming live verification', async () => {
    const preflight = await collectLiveV1Preflight();
    expect(preflight).toMatchObject({ suite: 'live-v1', mode: 'offline', taskHash: LIVE_V1_TASK_HASH });
    expect(preflight.candidates).toHaveLength(30);
    expect(preflight.candidates.every((candidate) => candidate.status === 'unverified-offline')).toBe(true);
  });

  describe('contract boundaries and typography', () => {
    const pass = (id: string, answer: string, text: string): boolean => {
      const row = LIVE_V1_ROWS.find((r) => r.task_id === id)!;
      const grader = row.deterministic!;
      const url = `${grader.final.url.origin}${grader.final.url.path}`;
      return evaluateDeterministicGrader(grader, answer, [{ final: true, url, text }])?.pass ?? false;
    };

    it('does not accept a version or date that merely contains the key', () => {
      expect(pass('livev1-standards-openapi-31', 'The displayed version is 3.1.0', 'OpenAPI Specification v3.1.0')).toBe(true);
      expect(pass('livev1-standards-openapi-31', 'The displayed version is 3.1.01', 'OpenAPI Specification v3.1.0')).toBe(false);
      expect(pass('livev1-standards-gpl-3', 'GNU GENERAL PUBLIC LICENSE, 29 June 2007', 'GNU GENERAL PUBLIC LICENSE 29 June 2007')).toBe(true);
      expect(pass('livev1-standards-rfc-8259', 'The title is The JavaScript Object Notation (JSON) Data Interchange Format', 'RFC 8259 The JavaScript Object Notation (JSON) Data Interchange Format')).toBe(true);
      expect(pass('livev1-standards-rfc-8259', 'The title is Hypertext Transfer Protocol Semantics', 'RFC 8259 The JavaScript Object Notation (JSON) Data Interchange Format')).toBe(false);
      expect(pass('livev1-standards-gpl-3', 'GNU GENERAL PUBLIC LICENSE, 29 June 20070', 'GNU GENERAL PUBLIC LICENSE 29 June 2007')).toBe(false);
    });

    it('treats CO2 and CO₂ as the same answer', () => {
      expect(pass('livev1-data-ourworldindata-co2', 'CO2 emissions', 'CO₂ emissions')).toBe(true);
      expect(pass('livev1-data-ourworldindata-co2', 'CO₂ emissions', 'CO₂ emissions')).toBe(true);
      expect(pass('livev1-data-ourworldindata-co2', 'CH4 emissions', 'CO₂ emissions')).toBe(false);
    });
  });
});
