import { describe, expect, it } from 'vitest';
import { extractGradedAnswer, isHarnessFailure, makeMetadata, nextHarnessFailureStreak, wrongAnswerDetail } from '../bench/agent/integrity.js';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import os from 'node:os';
import { join, resolve } from 'node:path';

describe('harness failure classification', () => {
  it('watches newly appended alerts and resets its cursor for replaced logs', async () => {
    const folder = mkdtempSync(join(os.tmpdir(), 'mantis-watch-'));
    const log = join(folder, 'job.log');
    writeFileSync(join(folder, 'job.status'), 'label=job\nstate=running\nexit=\n');
    writeFileSync(log, 'ABORTED: harness old failure\n');
    // Simulate a prior watcher having already consumed the old alert.
    writeFileSync(join(folder, '.watch-cursors'), `${log}\t1\n`);
    const watch = () => new Promise<string>((resolveOutput, reject) => {
      const child = spawn('bash', [resolve('scripts/watch-jobs.sh')], {
        env: { ...process.env, WATCH_JOBS_DIR: folder, WATCH_JOBS_INTERVAL: '0.02', WATCH_JOBS_NO_NOTIFY: '1' },
      });
      let output = ''; child.stdout.on('data', (data) => { output += data; });
      const timer = setTimeout(() => { child.kill(); reject(new Error('watcher did not alert')); }, 10_000);
      child.on('exit', (code) => { clearTimeout(timer); code === 0 ? resolveOutput(output) : reject(new Error(`watcher exited ${code}`)); });
    });
    try {
      const appended = watch();
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 80));
      appendFileSync(log, 'ABORTED: harness later failure\n');
      await expect(appended).resolves.toContain('Harness error in job.log');

      // Near miss: a shorter reused log must reset the previous cursor, not skip its alert.
      writeFileSync(log, 'Error: network request failed\n');
      await expect(watch()).resolves.toContain('Harness error in job.log');

      // Same-length replacement must not inherit the consumed cursor.
      writeFileSync(log, 'ABORTED: harness new failure!!\n');
      await expect(watch()).resolves.toContain('Harness error in job.log');

      // Nor may a longer replacement skip the old-length prefix.
      writeFileSync(log, 'replacement header\nError: network request failed\n');
      await expect(watch()).resolves.toContain('Harness error in job.log');

      // A replacement can keep the first line while changing already-consumed content.
      writeFileSync(log, 'replacement header\nABORTED: harness replacement failure\n');
      await expect(watch()).resolves.toContain('Harness error in job.log');

      // While a job is writing, the saved byte count and checksum must be for
      // the same captured content, rather than two different live-file reads.
      writeFileSync(log, 'ordinary progress\n');
      const polling = spawn('bash', [resolve('scripts/watch-jobs.sh')], {
        env: { ...process.env, WATCH_JOBS_DIR: folder, WATCH_JOBS_INTERVAL: '0.02', WATCH_JOBS_NO_NOTIFY: '1' },
      });
      const appending = setInterval(() => appendFileSync(log, 'ordinary progress detail\n'), 1);
      try {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 1_200));
      } finally {
        clearInterval(appending);
        polling.kill();
      }
      await new Promise<void>((resolveExit) => polling.once('exit', () => resolveExit()));
      const cursor = readFileSync(join(folder, '.watch-cursors'), 'utf8').trim()
        .split(/\r?\n/).filter((line) => line.startsWith(`${log}\t`)).at(-1)!.split('\t');
      expect(cursor[2]).toBe(cursor[4]?.split(':')[1]);
      // Near miss: a cursor must not be empty just because normal log lines were appended.
      expect(Number(cursor[1])).toBeGreaterThan(1);
    } finally {
      rmSync(folder, { recursive: true, force: true });
    }
  }, 15_000);

  it('counts transport, API, network, and browser startup evidence', () => {
    expect(isHarnessFailure({ status: 'connection_failure', error: 'MCP connection failed' })).toBe(true);
    expect(isHarnessFailure({ status: 'crash', error: 'HTTP 503 upstream unavailable' })).toBe(true);
    expect(isHarnessFailure({ status: 'cli_error', error: 'request failed', diagnostics: ['cause ECONNRESET'] })).toBe(true);
    expect(isHarnessFailure({ status: 'crash', error: 'Chromium browser failed to launch' })).toBe(true);
    expect(isHarnessFailure({ status: 'cli_error', error: 'Sarvam network request failed' })).toBe(true);
    expect(isHarnessFailure({ status: 'cli_error', error: 'ordinary failure', diagnostics: ['MCP transport connection closed'] })).toBe(true);
  });

  it('does not turn ordinary task failures into harness failures', () => {
    expect(isHarnessFailure({ status: 'wrong_answer', error: 'answer did not match the expected result' })).toBe(false);
    expect(isHarnessFailure({ status: 'timeout', error: 'timed out after 600s' })).toBe(false);
    expect(isHarnessFailure({ status: 'cli_error', error: 'invalid tool arguments' })).toBe(false);
    expect(isHarnessFailure({ status: 'wrong_answer', error: 'browser click failed on an unavailable button' })).toBe(false);
    // This is an emitted recovery diagnostic for an ordinary rejected tool call, not infrastructure.
    expect(isHarnessFailure({ status: 'wrong_answer', error: 'answer did not match the expected result', diagnostics: ['MCP tool failed: open'] })).toBe(false);
  });

  it('counts only unrecovered final harness failures and resets the abort streak', () => {
    const failed = { harnessFailure: true };
    const recovered = [{ ...failed }, { harnessFailure: false }];
    expect(nextHarnessFailureStreak(0, [failed])).toBe(1);
    expect(nextHarnessFailureStreak(2, [failed])).toBe(3); // threshold reached
    expect(nextHarnessFailureStreak(2, recovered)).toBe(0); // retry recovered
    expect(nextHarnessFailureStreak(0, [{ harnessFailure: false }])).toBe(0); // near miss: ordinary failure never advances it
  });

  it('keeps the completion-token budget in the resume fingerprint', () => {
    const settings = { provider: 'sarvam' as const, tasks: [], approaches: [], runs: 1, model: 'model', reasoning: 'max-steps:1', timeoutMs: 1, concurrency: 1, sarvamMaxTokens: 100, toolRestrictions: {}, runtime: { nodeVersion: 'v', platform: 'p', arch: 'a' }, environment: {}, browserPaths: {} };
    const changed = { ...settings, sarvamMaxTokens: 200 };
    expect(makeMetadata(settings, {}, 'client').configFingerprint).toBe(makeMetadata({ ...settings }, {}, 'client').configFingerprint);
    expect(makeMetadata(settings, {}, 'client').configFingerprint).not.toBe(makeMetadata(changed, {}, 'client').configFingerprint);
  });

  it('preserves prose before an explicit answer line', () => {
    expect(extractGradedAnswer('The validation completed.\nANSWER: accepted', false)).toBe('The validation completed.\nANSWER: accepted');
    // Near miss: judged output still removes protocol-only final URLs.
    expect(extractGradedAnswer('FINAL_URL: https://fixture.test/', true)).toBe('');
  });

  it('reports an empty normal completion distinctly', () => {
    expect(wrongAnswerDetail('provider', '', true)).toContain('empty response after a normal stop');
    // Near miss: an empty result that never completed is not labelled a normal stop.
    expect(wrongAnswerDetail('provider', '', false)).toBe('answer did not match the expected result');
  });

  it('keeps empty-completion and fixture-check diagnoses together', () => {
    const detail = wrongAnswerDetail('provider', '', true, 'missing expected confirmation');
    expect(detail).toContain('empty response after a normal stop');
    expect(detail).toContain('fixture check failed: missing expected confirmation');
  });

});
