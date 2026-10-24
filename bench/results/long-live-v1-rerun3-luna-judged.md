# Real-site eval, blind-judged: long-live-v1-rerun3-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| tree | 13 | 9 | 4 | 0 | 0 | 0 | 69.2% | 69.2% | 29.1 | 441,712 | 76.8 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | tree |
|---|---|
| `longlive` hard: Using Wikipedia's on-site search, visit Voyager 1, Voyager 2, Pioneer 10, Pioneer 11 | success, success, success |
| `longlive` hard: Using Wikipedia's on-site search, inspect Io, Europa, Ganymede, Callisto, Titan, Tri | success |
| `longlive` medium: Use Project Gutenberg's catalogue search to inspect these eight English Text recor | success, success |
| `longlive` hard: Audit these eight Project Gutenberg English Text records using catalogue search: Fra | failure, failure, failure |
| `longlive` medium: Use The Met collection search to inspect object IDs 436528, 436532, 436535, 436524 | success, success |
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'Charles Dickens', Language English, | success |
| `longlive` hard: Search The Met collection for 'Rembrandt' in All Fields. Enable Has image, keep othe | failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| tree | 13 | 9 | 4 | 0 | 0 | 0 | 13 | 0 | 0 | 13 | 0 |

### Check vs judge disagreements

None.
