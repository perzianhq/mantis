# Real-site eval, blind-judged: long-live-v1-chain-luna

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 0 | 3 | 0 | 0 | 0 | 0.0% | 0.0% | 9.7 | 153,891 | 51.4 |
| tree | 3 | 1 | 1 | 1 | 0 | 0 | 33.3% | 33.3% | 12.7 | 214,239 | 73.0 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree |
|---|---|---|
| `longlive` medium: Prepare Selenium's Form Page without submitting. Controls without visible labels a | failure | success |
| `longlive` medium: Perform one browser handoff check on The Internet demo. On Multiple Windows, click | failure | unsure |
| `longlive` medium: On Selenium's XHTML test page, click 'Open new window'. Switch to the named result | failure | failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 3 | 0 | 3 | 0 | 0 | 0 | 1 | 2 | 0 | 2 | 1 |
| tree | 3 | 1 | 1 | 1 | 0 | 0 | 1 | 2 | 0 | 2 | 1 |

### Check vs judge disagreements

None.
