import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildOfflineMetrics, type SavedResults } from '../bench/agent/offline-metrics.js';
import { buildRegrade, fullReplyFromTrace } from '../bench/agent/regrade.js';

const trace = (answer: string, observation = 'Team costs $29'): string => [
  JSON.stringify({ type: 'sarvam.tool_result', name: 'read', error: false, resultText: observation, chars: observation.length }),
  JSON.stringify({ type: 'sarvam.summary', resultText: answer }),
].join('\n');
const run = (overrides: Record<string, unknown> = {}) => ({ task: 'pricing-team', approach: 'mantis', run: 1, status: 'success', ok: true, valid: true, answer: '$29', attempts: [{ attempt: 1, status: 'success', timedOut: false, costInr: 3, totalInputTokens: 10, usage: { outputTokens: 2 }, timings: { cliWallMs: 50 }, fixtureCheck: { ok: true } }], ...overrides });

describe('offline saved-run analysis', () => {
  it('counts every retry once and keeps missing cost/usage unknown', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'mantis-offline-'));
    try {
      const logs = path.join(root, 'logs'); mkdirSync(logs);
      writeFileSync(path.join(logs, 'pricing-team--mantis--1--attempt-1-a.jsonl'), trace('ANSWER: no answer'));
      writeFileSync(path.join(logs, 'pricing-team--mantis--1--attempt-2-b.jsonl'), trace('ANSWER: $29'));
      const result = run({ attempts: [
        { attempt: 1, status: 'connection_failure', costInr: 2, totalInputTokens: null, usage: { outputTokens: null }, timings: { cliWallMs: 20 } },
        { attempt: 2, status: 'success', costInr: 3, totalInputTokens: 10, usage: { outputTokens: 2 }, timings: { cliWallMs: 50 } },
      ] });
      const report = buildOfflineMetrics({ results: [result] } as SavedResults, { inputName: 'saved.json', inputText: JSON.stringify(result), traceDirectory: logs, categories: { 'pricing-team': 'navigation' }, requirements: { 'pricing-team': [{ id: 'price', type: 'number', value: 29 }] } });
      expect(report.overall.efficiency.costInr).toMatchObject({ totalKnown: 5, allAttempts: 2, unknownAttempts: 0, observedPerSuccess: 5 });
      expect(report.overall.efficiency.totalInputTokens).toMatchObject({ totalKnown: 10, allAttempts: 2, unknownAttempts: 1, completePerSuccess: null });
      expect(report.overall.information.answerUsedAvailablePattern).toBe(1);
      expect(report.byApproachTask['mantis/pricing-team'].attempts).toBe(2);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it('uses full saved replies, separates old fixture bools, and never promotes a timeout', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'mantis-regrade-'));
    try {
      const logs = path.join(root, 'logs'); mkdirSync(logs);
      writeFileSync(path.join(logs, 'pricing-team--mantis--1--attempt-1-a.jsonl'), trace('I checked a different plan. ANSWER: $29'));
      writeFileSync(path.join(logs, 'pricing-team--mantis--2--attempt-1-a.jsonl'), trace('ANSWER: $31'));
      writeFileSync(path.join(logs, 'pricing-team--mantis--3--attempt-1-a.jsonl'), trace('ANSWER: $29'));
      writeFileSync(path.join(logs, 'dashboard-refresh--mantis--4--attempt-1-a.jsonl'), trace('ANSWER: Last updated just now; Umbrella 3 has $4,218'));
      const saved = { metadata: { sourceHashes: { 'bench/agent/tasks.ts': 'old' } }, results: [
        run({ run: 1, ok: false, status: 'wrong_answer', answer: 'this is the shortened display, not the full reply' }),
        run({ run: 2, ok: true, status: 'success', attempts: [{ attempt: 1, status: 'success', fixtureCheck: { ok: true } }] }),
        run({ run: 3, ok: false, status: 'timeout', attempts: [{ attempt: 1, status: 'timeout', timedOut: true, fixtureCheck: { ok: true } }] }),
        { ...run({ task: 'dashboard-refresh', run: 4, ok: true, status: 'success' }), attempts: [{ attempt: 1, status: 'success', fixtureCheck: { ok: true } }] },
      ] } as SavedResults;
      const report = buildRegrade(saved, { inputName: 'saved.json', inputText: JSON.stringify(saved), traceDirectory: logs, taskFileText: readFileSync(path.resolve(import.meta.dirname, '../bench/agent/tasks.ts'), 'utf8') });
      expect(report.runs[0]!.answer.change).toBe('same');
      expect(report.runs[1]!.answer.change).toBe('same');
      expect(report.runs[2]!.answer.pass).toBe(true);
      expect(report.runs[2]!.finalOutcome).toBe('failure');
      expect(report.runs[3]!.answer.change).toBe('success_to_wrong_answer');
      expect(report.runs.every((item) => item.hardenedState === 'unknown_rerun_needed')).toBe(true);
      expect(fullReplyFromTrace(trace('A long reply\nANSWER: $29'))).toContain('A long reply');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it('does not guess through ambiguous or missing traces and identifies an unavailable task ID', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'mantis-ambiguous-'));
    try {
      const logs = path.join(root, 'logs'); mkdirSync(logs);
      writeFileSync(path.join(logs, 'pricing-team--mantis--1--attempt-1-a.jsonl'), trace('ANSWER: $29'));
      writeFileSync(path.join(logs, 'pricing-team--mantis--1--attempt-1-b.jsonl'), trace('ANSWER: $29'));
      const report = buildOfflineMetrics({ results: [run()] } as SavedResults, { inputName: 'saved.json', inputText: '{}', traceDirectory: logs, categories: { 'pricing-team': 'navigation' }, requirements: { 'pricing-team': [{ id: 'price', type: 'number', value: 29 }] } });
      expect(report.overall.tracesAmbiguous).toBe(1);
      expect(report.overall.tracesMissing).toBe(0);
      const missingTask = buildRegrade({ results: [run({ task: 'removed-task' })] } as SavedResults, { inputName: 'saved.json', inputText: '{}', traceDirectory: logs, taskFileText: readFileSync(path.resolve(import.meta.dirname, '../bench/agent/tasks.ts'), 'utf8') });
      expect(missingTask.runs[0]!.answer.pass).toBeNull();
      expect(missingTask.runs[0]!.needs).toContain('task ID is not in the current task catalog');
      const missingReply = buildRegrade({ results: [run({ run: 2 })] } as SavedResults, { inputName: 'saved.json', inputText: '{}', traceDirectory: logs, taskFileText: readFileSync(path.resolve(import.meta.dirname, '../bench/agent/tasks.ts'), 'utf8') });
      expect(missingReply.runs[0]!.finalOutcome).toBe('unknown_rerun_needed');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
