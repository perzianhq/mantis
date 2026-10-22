# Real-site eval, blind-judged: live-v1-rfc8259-20261022

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 5.7 | 35,955 | 71.7 |
| tree | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 6.3 | 79,598 | 70.8 |
| screenshot | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 9.3 | 24,984 | 78.9 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-s` easy: Open RFC 8259 and report its displayed title. | success, success, success | success, success, success | success, success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |
| tree | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |
| screenshot | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |

### Check vs judge disagreements

None.
