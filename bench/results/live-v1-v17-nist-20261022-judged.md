# Real-site eval, blind-judged: live-v1-v17-nist-20261022

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 5.0 | 23,006 | 66.0 |
| tree | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 7.3 | 35,663 | 73.2 |
| screenshot | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 7.3 | 19,122 | 48.8 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-c` medium: Open the NIST about page and report the heading shown on the official About destin | success, success, success | success, success, success | success, success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |
| tree | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |
| screenshot | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |

### Check vs judge disagreements

None.
