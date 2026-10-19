import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActiveWorkTimeout } from '../bench/agent/active-timeout.js';

afterEach(() => vi.useRealTimers());

describe('ActiveWorkTimeout', () => {
  it('does not charge limiter queue, cooldown, or retry backoff to active work', () => {
    vi.useFakeTimers();
    const expired: string[] = [];
    const timer = new ActiveWorkTimeout(100, 2_000, (kind) => expired.push(kind));
    vi.advanceTimersByTime(40);
    for (const [kind, ms] of [['limiter_queue', 200], ['cooldown', 300], ['retry_backoff', 400]] as const) {
      const resume = timer.pause(kind);
      vi.advanceTimersByTime(ms);
      resume();
    }
    expect(timer.telemetry()).toMatchObject({ activeWorkMs: 40, quotaWaitMs: 900, limiterQueueMs: 200, cooldownMs: 300, retryBackoffMs: 400, timeoutKind: null });
    vi.advanceTimersByTime(59);
    expect(expired).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(expired).toEqual(['active_work']);
    timer.stop();
  });

  it('keeps the wall-clock cap active while quota work is paused', () => {
    vi.useFakeTimers();
    const expired: string[] = [];
    const timer = new ActiveWorkTimeout(1_000, 100, (kind) => expired.push(kind));
    const resume = timer.pause('limiter_queue');
    vi.advanceTimersByTime(100);
    expect(expired).toEqual(['wall_clock']);
    expect(timer.telemetry()).toMatchObject({ activeWorkMs: 0, quotaWaitMs: 100, wallMs: 100, wallCapMs: 100, timeoutKind: 'wall_clock' });
    resume();
    timer.stop();
  });

  it('reports wait telemetry without changing older callers that omit it', () => {
    vi.useFakeTimers();
    const timer = new ActiveWorkTimeout(100, 500, () => {});
    vi.advanceTimersByTime(20);
    const resume = timer.pause('retry_backoff');
    vi.advanceTimersByTime(30);
    resume();
    expect(timer.stop()).toMatchObject({ activeWorkMs: 20, quotaWaitMs: 30, retryBackoffMs: 30, wallMs: 50, wallCapMs: 500, timeoutKind: null });
  });
});
