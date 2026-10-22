# Real-site eval, blind-judged: live-v1-haiku-20261022-localrerun

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 12 | 12 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 5.6 | 83,699 | 42.0 |
| tree | 9 | 8 | 1 | 0 | 0 | 0 | 88.9% | 88.9% | 10.9 | 216,783 | 34.0 |
| screenshot | 12 | 12 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 9.9 | 79,591 | 23.8 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-s` easy: Open the WCAG 2.2 recommendation and report the standard's displayed title. | success, success, success | failure, success, success | success, success, success |
| `livev1-s` hard: Open the CSS Color Level 4 specification and report its displayed title. | success, success, success | success, success, success | success, success, success |
| `livev1-n` medium: Use The Met collection search to find “Wheat Field with Cypresses” and leave the m | success, success, success | success, success | success, success, success |
| `livev1-i` hard: Search TMDB for “Spirited Away” and leave the title result or title page visible. | success, success, success | success | success, success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 12 | 12 | 0 | 0 | 0 | 0 | 3 | 9 | 0 | 12 | 6 |
| tree | 9 | 8 | 1 | 0 | 0 | 0 | 3 | 6 | 0 | 9 | 3 |
| screenshot | 12 | 12 | 0 | 0 | 0 | 0 | 3 | 9 | 0 | 12 | 6 |

### Check vs judge disagreements

None.
