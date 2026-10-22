# Real-site eval, blind-judged: live-v1-v16-tmdb-20261022

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 4.0 | 22,719 | 67.2 |
| tree | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 9.7 | 133,288 | 65.9 |
| screenshot | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 17.3 | 67,624 | 105.0 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-i` hard: Search TMDB for “Spirited Away” and leave the title result or title page visible. | success, success, success | success, success, success | success, success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 3 | 3 |
| tree | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 3 | 1 |
| screenshot | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 3 | 3 |

### Check vs judge disagreements

None.
