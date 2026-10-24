# Real-site eval, blind-judged: long-live-v1-main-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 48 | 27 | 21 | 0 | 0 | 0 | 56.3% | 56.3% | 15.9 | 266,997 | 113.8 |
| tree | 48 | 23 | 22 | 3 | 0 | 0 | 47.9% | 47.9% | 21.6 | 467,549 | 133.2 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` hard: Using Wikipedia's on-site search, visit Voyager 1, Voyager 2, Pioneer 10, Pioneer 11 | success, success, success | failure, failure, failure |
| `longlive` hard: Using Wikipedia's on-site search, inspect Io, Europa, Ganymede, Callisto, Titan, Tri | failure, success, failure | success, success, failure |
| `longlive` medium: Use Project Gutenberg's catalogue search to inspect these eight English Text recor | success, success, success | failure, failure, success |
| `longlive` hard: Audit these eight Project Gutenberg English Text records using catalogue search: Fra | success, success, success | failure, failure, failure |
| `longlive` medium: Use The Met collection search to inspect object IDs 436528, 436532, 436535, 436524 | failure, failure, success | failure, failure, success |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'Charles Dickens', Language English, | success, success, failure | success, failure, success |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'William Shakespeare', Language Engl | success, success, success | success, success, success |
| `longlive` hard: Search The Met collection for 'Monet' in All Fields. Enable Has image, keep other qu | failure, failure, success | success, success, success |
| `longlive` hard: Search The Met collection for 'Rembrandt' in All Fields. Enable Has image, keep othe | failure, failure, success | failure, success, success |
| `longlive` medium: Prepare Selenium's Form Page without submitting. Controls without visible labels a | success, success, success | success, success, success |
| `longlive` medium: Fill the Selenium Web form without submitting. In the first pass set Text input 'L | failure, failure, failure | success, success, success |
| `longlive` medium: Prepare Selenium's Multiple Selection test page without submitting. Controls have | success, success, success | success, success, success |
| `longlive` medium: This is Sauce Demo, an explicit test-account sandbox. Log in with its displayed st | failure, failure, failure | failure, unsure, unsure |
| `longlive` hard: On Sauce Demo only, log in with displayed test credentials standard_user / secret_sa | failure, failure, failure | failure, failure, failure |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | failure, failure, failure | unsure, failure, failure |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | success, success, success | failure, failure, failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 48 | 27 | 21 | 0 | 0 | 0 | 39 | 9 | 0 | 44 | 3 |
| tree | 48 | 23 | 22 | 3 | 0 | 0 | 38 | 10 | 0 | 43 | 3 |

### Check vs judge disagreements

None.
