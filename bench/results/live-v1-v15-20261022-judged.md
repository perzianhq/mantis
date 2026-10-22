# Real-site eval, blind-judged: live-v1-v15-20261022

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 6 | 6 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 4.7 | 25,053 | 64.3 |
| tree | 6 | 6 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 7.0 | 158,324 | 61.8 |
| screenshot | 6 | 6 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 10.0 | 37,323 | 85.6 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-d` easy: Open MDN's HTTP overview and report the page heading. | success, success, success | success, success, success | success, success, success |
| `livev1-n` medium: Use The Met collection search to find “Wheat Field with Cypresses” and leave the m | success, success, success | success, success, success | success, success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 6 | 6 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 6 | 3 |
| tree | 6 | 6 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 6 | 3 |
| screenshot | 6 | 6 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 6 | 3 |

### Check vs judge disagreements

None.
