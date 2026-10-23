# Real-site eval, blind-judged: live-v1-haiku-mantis-gapfix-rec-20261024

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 6 | 6 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 5.3 | 95,475 | 31.3 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis |
|---|---|
| `livev1-s` hard: Open the CSS Color Level 4 specification and report its displayed title. | success |
| `livev1-d` medium: Open Node.js URL documentation and report the API section title. | success |
| `livev1-c` hard: Open the National Archives about page and report the organization name displayed the | success |
| `livev1-n` easy: Use Wikipedia to open the Ada Lovelace article and leave the article page visible. | success |
| `livev1-n` medium: Use The Met collection search to find “Wheat Field with Cypresses” and leave the m | success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 6 | 6 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 6 | 2 |

### Check vs judge disagreements

None.
