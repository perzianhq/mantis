# Real-site eval, blind-judged: long-live-v1-rerun2-haiku

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 7 | 7 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 19.7 | 271,088 | 44.8 |
| tree | 1 | 1 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 26.0 | 397,997 | 64.2 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` medium: Fill the Selenium Web form without submitting. In the first pass set Text input 'L | success, success, success | - |
| `longlive` medium: This is Sauce Demo, an explicit test-account sandbox. Log in with its displayed st | success, success, success | success |
| `longlive` hard: On Sauce Demo only, log in with displayed test credentials standard_user / secret_sa | success | - |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 7 | 7 | 0 | 0 | 0 | 0 | 7 | 0 | 0 | 7 | 0 |
| tree | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |

### Check vs judge disagreements

None.
