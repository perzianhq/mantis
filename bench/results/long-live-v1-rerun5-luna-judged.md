# Real-site eval, blind-judged: long-live-v1-rerun5-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 5 | 4 | 1 | 0 | 0 | 0 | 80.0% | 80.0% | 27.4 | 412,019 | 107.5 |
| tree | 10 | 1 | 9 | 0 | 0 | 0 | 10.0% | 10.0% | 30.1 | 515,956 | 88.2 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` hard: Using Wikipedia's on-site search, inspect Io, Europa, Ganymede, Callisto, Titan, Tri | success, failure | - |
| `longlive` hard: Audit these eight Project Gutenberg English Text records using catalogue search: Fra | - | failure, failure, failure |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'Charles Dickens', Language English, | success | - |
| `longlive` hard: Search The Met collection for 'Monet' in All Fields. Enable Has image, keep other qu | success, success | - |
| `longlive` hard: Search The Met collection for 'Rembrandt' in All Fields. Enable Has image, keep othe | - | success |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | - | failure, failure, failure |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | - | failure, failure, failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 5 | 4 | 1 | 0 | 0 | 0 | 5 | 0 | 0 | 5 | 0 |
| tree | 10 | 1 | 9 | 0 | 0 | 0 | 4 | 6 | 0 | 10 | 5 |

### Check vs judge disagreements

None.
