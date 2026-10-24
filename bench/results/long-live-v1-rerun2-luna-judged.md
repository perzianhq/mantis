# Real-site eval, blind-judged: long-live-v1-rerun2-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 17 | 16 | 1 | 0 | 0 | 0 | 94.1% | 94.1% | 20.4 | 344,923 | 61.1 |
| tree | 8 | 6 | 2 | 0 | 0 | 0 | 75.0% | 75.0% | 30.8 | 652,146 | 82.9 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` medium: Use The Met collection search to inspect object IDs 436528, 436532, 436535, 436524 | success, success | - |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'Charles Dickens', Language English, | failure | - |
| `longlive` hard: Search The Met collection for 'Rembrandt' in All Fields. Enable Has image, keep othe | success, success | - |
| `longlive` medium: Fill the Selenium Web form without submitting. In the first pass set Text input 'L | success, success, success | - |
| `longlive` medium: This is Sauce Demo, an explicit test-account sandbox. Log in with its displayed st | success, success, success | success, success, success |
| `longlive` hard: On Sauce Demo only, log in with displayed test credentials standard_user / secret_sa | success, success, success | success, success, success |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | success, success, success | failure, failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 17 | 16 | 1 | 0 | 0 | 0 | 14 | 3 | 0 | 17 | 3 |
| tree | 8 | 6 | 2 | 0 | 0 | 0 | 6 | 2 | 0 | 8 | 1 |

### Check vs judge disagreements

None.
