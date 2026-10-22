# Real-site eval, blind-judged: live-v1-luna-20261022-unsure

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| screenshot | 6 | 6 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 10.2 | 159,270 | 37.6 |
| tree | 6 | 6 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 6.2 | 147,207 | 32.3 |
| mantis | 2 | 2 | 0 | 0 | 0 | 0 | 100.0% | 100.0% | 4.0 | 97,666 | 28.2 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | screenshot | tree | mantis |
|---|---|---|---|
| `livev1-s` easy: Open the WCAG 2.2 recommendation and report the standard's displayed title. | success | - | - |
| `livev1-n` easy: Use Wikipedia to open the Ada Lovelace article and leave the article page visible. | - | success | - |
| `livev1-n` easy: Use Merriam-Webster to open the dictionary entry for “serendipity” and leave its def | success | - | - |
| `livev1-n` medium: Use the Smithsonian National Air and Space Museum site to open the collection obje | success | success | success |
| `livev1-n` medium: Use The Met collection search to find “Wheat Field with Cypresses” and leave the m | success | success, success | success |
| `livev1-i` medium: Search Open Library for “machine learning” and leave the site results page visible | success | - | - |
| `livev1-i` medium: Open the GitHub issues page for microsoft/vscode and leave the open-issues state v | - | success | - |
| `livev1-i` hard: Search OpenStreetMap for the Eiffel Tower and leave the selected place or result vis | - | success | - |
| `livev1-i` hard: Search TMDB for “Spirited Away” and leave the title result or title page visible. | success | - | - |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| screenshot | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 0 | 2 |
| tree | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 0 | 3 |
| mantis | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |

### Check vs judge disagreements

None.
