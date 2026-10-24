# Real-site eval, blind-judged: long-live-v1-rerun6-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 18.7 | 454,153 | 78.3 |
| tree | 6 | 3 | 3 | 0 | 0 | 0 | 50.0% | 50.0% | 24.2 | 434,176 | 70.1 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` medium: Use Project Gutenberg Advanced Search: Author 'Charles Dickens', Language English, | success | - |
| `longlive` hard: Search The Met collection for 'Monet' in All Fields. Enable Has image, keep other qu | success, success | - |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | - | success, success, success |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | - | failure, failure, failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 3 | 0 |
| tree | 6 | 3 | 3 | 0 | 0 | 0 | 0 | 6 | 0 | 6 | 6 |

### Check vs judge disagreements

None.
