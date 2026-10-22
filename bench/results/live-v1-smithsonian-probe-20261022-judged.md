# Real-site eval, blind-judged: live-v1-smithsonian-probe-20261022

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 4 | 2 | 0 | 0 | 2 | 0 | 50.0% | 100.0% | 19.0 | 164,886 | 197.8 |
| tree | 4 | 2 | 0 | 0 | 2 | 0 | 50.0% | 100.0% | 27.5 | 508,772 | 276.1 |
| screenshot | 4 | 2 | 0 | 0 | 2 | 0 | 50.0% | 100.0% | 41.8 | 284,983 | 324.2 |

Universally blocked tasks: `livev1-interactive-smithsonian-search`. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-n` medium: Use the Smithsonian National Air and Space Museum site to open the collection obje | success, success | success, success | success, success |
| `livev1-i` hard: Search Smithsonian for “Apollo 11” and leave the on-site results page visible with t | blocked, blocked | blocked, blocked | blocked, blocked |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 4 | 0 | 4 | 3 |
| tree | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 4 | 0 | 4 | 2 |
| screenshot | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 4 | 0 | 4 | 4 |

### Check vs judge disagreements

None.
