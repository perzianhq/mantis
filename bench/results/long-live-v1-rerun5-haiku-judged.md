# Real-site eval, blind-judged: long-live-v1-rerun5-haiku

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| tree | 3 | 2 | 1 | 0 | 0 | 0 | 66.7% | 66.7% | 41.7 | 1,171,280 | 121.2 |
| mantis | 1 | 1 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 20.0 | 276,709 | 50.3 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | tree | mantis |
|---|---|---|
| `longlive` hard: Audit these eight Project Gutenberg English Text records using catalogue search: Fra | success | - |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | failure | - |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | success | success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| tree | 3 | 2 | 1 | 0 | 0 | 0 | 1 | 2 | 0 | 3 | 2 |
| mantis | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 |

### Check vs judge disagreements

None.
