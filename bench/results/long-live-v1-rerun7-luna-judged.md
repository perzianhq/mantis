# Real-site eval, blind-judged: long-live-v1-rerun7-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 1 | 0 | 1 | 0 | 0 | 0 | 0.0% | 0.0% | 6.0 | 135,206 | 39.5 |
| tree | 6 | 0 | 6 | 0 | 0 | 0 | 0.0% | 0.0% | 34.2 | 353,251 | 66.4 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` hard: Using Wikipedia's on-site search, inspect Io, Europa, Ganymede, Callisto, Titan, Tri | failure | - |
| `longlive` hard: Audit these eight Project Gutenberg English Text records using catalogue search: Fra | - | failure, failure, failure |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | - | failure, failure, failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| tree | 6 | 0 | 6 | 0 | 0 | 0 | 3 | 3 | 0 | 6 | 3 |

### Check vs judge disagreements

None.
