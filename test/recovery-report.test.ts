import { expect, it } from 'vitest';
import { recoveryCounts, recoveryMarkdownLines, type RecoveryRun } from '../bench/agent/recovery-report.js';

it('reports a retained merged row without first-pass metadata as unknown', () => {
  const merged: RecoveryRun = {
    approach: 'mantis', status: 'success', ok: true, valid: true,
    attempts: [{ status: 'success', usageComplete: true, totalInputTokens: 1 }],
  };
  const explicit: RecoveryRun = {
    ...merged,
    firstPass: { status: 'wrong_answer', ok: false, valid: true },
  };
  expect(recoveryCounts([merged, explicit])).toMatchObject({
    firstPassSuccesses: 0, firstPassValid: 1, firstPassUnknown: 1,
    recoveredSuccesses: 2, recoveredValid: 2,
  });
  expect(recoveryMarkdownLines([merged, explicit]).join('\n')).toContain('0/1 (1 unknown)');
});
