/**
 * An agent-run timeout that charges browser/model work, but not waits imposed by
 * the local Sarvam limiter.  A separate wall cap always remains in force so a
 * wedged worker cannot live forever.
 */
export type SarvamWaitKind = 'limiter_queue' | 'cooldown' | 'retry_backoff';
export type TimeoutKind = 'active_work' | 'wall_clock';

export interface ActiveTimeoutTelemetry {
  activeWorkMs: number;
  quotaWaitMs: number;
  limiterQueueMs: number;
  cooldownMs: number;
  retryBackoffMs: number;
  wallMs: number;
  wallCapMs: number;
  timeoutKind: TimeoutKind | null;
}

type Clock = () => number;

export class ActiveWorkTimeout {
  private readonly startedAt: number;
  private activeTimer: ReturnType<typeof setTimeout> | undefined;
  private wallTimer: ReturnType<typeof setTimeout> | undefined;
  private pausedAt: number | null = null;
  private pauseDepth = 0;
  private pausedMs = 0;
  private readonly waits: Record<SarvamWaitKind, number> = { limiter_queue: 0, cooldown: 0, retry_backoff: 0 };
  private timeoutKind: TimeoutKind | null = null;
  private stopped = false;

  constructor(
    private readonly activeBudgetMs: number,
    private readonly wallCapMs: number,
    private readonly onTimeout: (kind: TimeoutKind) => void,
    private readonly now: Clock = Date.now,
  ) {
    this.startedAt = now();
    this.schedule();
  }

  /** Start a locally measured Sarvam wait. Call the returned function exactly once. */
  pause(kind: SarvamWaitKind): () => void {
    if (this.stopped) return () => {};
    const started = this.now();
    if (this.pauseDepth++ === 0) {
      this.pausedAt = started;
      this.clearActiveTimer();
    }
    let resumed = false;
    return () => {
      if (resumed) return;
      resumed = true;
      const elapsed = Math.max(0, this.now() - started);
      this.waits[kind] += elapsed;
      if (this.stopped || --this.pauseDepth > 0) return;
      this.pausedMs += Math.max(0, this.now() - (this.pausedAt ?? this.now()));
      this.pausedAt = null;
      this.schedule();
    };
  }

  stop(): ActiveTimeoutTelemetry {
    if (!this.stopped) {
      this.stopped = true;
      this.clearActiveTimer();
      if (this.wallTimer) clearTimeout(this.wallTimer);
    }
    return this.telemetry();
  }

  telemetry(): ActiveTimeoutTelemetry {
    const wallMs = Math.max(0, this.now() - this.startedAt);
    const livePause = this.pausedAt === null ? 0 : Math.max(0, this.now() - this.pausedAt);
    const quotaWaitMs = this.pausedMs + livePause;
    return {
      activeWorkMs: Math.max(0, wallMs - quotaWaitMs),
      quotaWaitMs,
      limiterQueueMs: this.waits.limiter_queue,
      cooldownMs: this.waits.cooldown,
      retryBackoffMs: this.waits.retry_backoff,
      wallMs,
      wallCapMs: this.wallCapMs,
      timeoutKind: this.timeoutKind,
    };
  }

  private schedule(): void {
    if (this.stopped || this.pauseDepth > 0) return;
    const remaining = Math.max(0, this.activeBudgetMs - this.telemetry().activeWorkMs);
    this.activeTimer = setTimeout(() => this.expire('active_work'), remaining);
    if (!this.wallTimer) {
      const wallRemaining = Math.max(0, this.wallCapMs - (this.now() - this.startedAt));
      this.wallTimer = setTimeout(() => this.expire('wall_clock'), wallRemaining);
    }
  }

  private clearActiveTimer(): void {
    if (this.activeTimer) clearTimeout(this.activeTimer);
    this.activeTimer = undefined;
  }

  private expire(kind: TimeoutKind): void {
    if (this.stopped || this.timeoutKind) return;
    this.timeoutKind = kind;
    this.onTimeout(kind);
  }
}
