# Real-site eval, blind-judged: long-live-v1-fix-haiku

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 2 | 2 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 31.5 | 626,157 | 183.9 |
| tree | 2 | 2 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 36.0 | 1,000,504 | 152.5 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` hard: Using Wikipedia's on-site search, visit Voyager 1, Voyager 2, Pioneer 10, Pioneer 11 | success | success |
| `longlive` hard: Using Wikipedia's on-site search, inspect Io, Europa, Ganymede, Callisto, Titan, Tri | success | success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 2 | 2 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 2 | 0 |
| tree | 2 | 2 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 2 | 0 |

### Check vs judge disagreements

None.
