import { sarvamExecutionExcludingWaits } from '../bench/agent/timing.js';
import { describe, expect, it } from 'vitest';

describe('sarvamExecutionExcludingWaits', () => {
  it('excludes limiter, cooldown, and retry-backoff waits with a nonnegative floor', () => {
    expect(sarvamExecutionExcludingWaits(1_000, { limiterQueueMs: 100, cooldownMs: 200, retryBackoffMs: 300 })).toBe(400);
    expect(sarvamExecutionExcludingWaits(100, { limiterQueueMs: 100, cooldownMs: 100, retryBackoffMs: 100 })).toBe(0);
    expect(sarvamExecutionExcludingWaits(null, { limiterQueueMs: 0, cooldownMs: 0, retryBackoffMs: 0 })).toBeNull();
  });
});
