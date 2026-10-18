/**
 * Clean Sarvam execution time for approach comparisons. Keep quota and retry
 * delays in separate reliability telemetry rather than attributing them to an
 * approach.
 */
export function sarvamExecutionExcludingWaits(
  cliWallMs: number | null,
  timing: { limiterQueueMs: number; cooldownMs: number; retryBackoffMs: number },
): number | null {
  return cliWallMs === null
    ? null
    : Math.max(0, cliWallMs - timing.limiterQueueMs - timing.cooldownMs - timing.retryBackoffMs);
}
