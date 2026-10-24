# Real-site eval, blind-judged: long-live-v1-pilot-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 16 | 7 | 7 | 2 | 0 | 0 | 43.8% | 43.8% | 22.9 | 358,604 | 130.2 |
| tree | 16 | 7 | 7 | 2 | 0 | 0 | 43.8% | 43.8% | 25.5 | 497,241 | 131.2 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` hard: Using Wikipedia's on-site search, visit Voyager 1, Voyager 2, Pioneer 10, Pioneer 11 | failure | failure |
| `longlive` hard: Using Wikipedia's on-site search, inspect Io, Europa, Ganymede, Callisto, Titan, Tri | failure | failure |
| `longlive` medium: Use Project Gutenberg's catalogue search to inspect these eight English Text recor | success | failure |
| `longlive` hard: Audit these eight Project Gutenberg English Text records using catalogue search: Fra | failure | failure |
| `longlive` medium: Use The Met collection search to inspect object IDs 436528, 436532, 436535, 436524 | failure | failure |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'Charles Dickens', Language English, | success | failure |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'William Shakespeare', Language Engl | success | failure |
| `longlive` hard: Search The Met collection for 'Monet' in All Fields. Enable Has image, keep other qu | success | success |
| `longlive` hard: Search The Met collection for 'Rembrandt' in All Fields. Enable Has image, keep othe | failure | success |
| `longlive` medium: Prepare Selenium's Form Page without submitting. Controls without visible labels a | failure | success |
| `longlive` medium: Fill the Selenium Web form without submitting. In the first pass set Text input 'L | success | success |
| `longlive` medium: Prepare Selenium's Multiple Selection test page without submitting. Controls have | failure | success |
| `longlive` medium: This is Sauce Demo, an explicit test-account sandbox. Log in with its displayed st | success | success |
| `longlive` hard: On Sauce Demo only, log in with displayed test credentials standard_user / secret_sa | success | success |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | unsure | unsure |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | unsure | unsure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 16 | 7 | 7 | 2 | 0 | 0 | 14 | 2 | 0 | 15 | 0 |
| tree | 16 | 7 | 7 | 2 | 0 | 0 | 14 | 2 | 0 | 16 | 0 |

### Check vs judge disagreements

None.
