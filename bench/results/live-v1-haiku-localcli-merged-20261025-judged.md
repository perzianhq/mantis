# Real-site eval, blind-judged: live-v1-haiku-localcli-merged-20261025

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| tree | 90 | 86 | 4 | 0 | 0 | 0 | 95.6% | 95.6% | 7.7 | 152,552 | 52.5 |
| screenshot | 90 | 88 | 2 | 0 | 0 | 0 | 97.8% | 97.8% | 10.3 | 82,055 | 42.3 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | tree | screenshot |
|---|---|---|
| `livev1-s` easy: Open RFC 8259 and report its displayed title. | success, success, success | success, success, success |
| `livev1-s` easy: Open the WCAG 2.2 recommendation and report the standard's displayed title. | success, success, success | success, success, success |
| `livev1-s` medium: Open RFC 9110 and report its displayed protocol title. | success, success, success | success, success, success |
| `livev1-s` medium: Open the OpenAPI 3.1.0 specification and report the version shown in its title. | success, success, success | success, success, success |
| `livev1-s` hard: Open the CSS Color Level 4 specification and report its displayed title. | success, failure, success | success, success, success |
| `livev1-d` easy: Open Python's json library documentation and report the module heading. | success, success, success | success, success, success |
| `livev1-d` easy: Open MDN's HTTP overview and report the page heading. | success, success, success | success, success, success |
| `livev1-d` medium: Open Node.js URL documentation and report the API section title. | success, success, success | success, success, success |
| `livev1-d` medium: Open Django's overview and report the heading shown on the page you reach. | success, success, success | success, success, success |
| `livev1-d` hard: Open PostgreSQL's current data-types chapter and report the chapter heading. | success, success, success | success, success, success |
| `livev1-c` easy: Open the Library of Congress about page and report the organization name displayed t | success, success, success | success, success, success |
| `livev1-c` medium: Open NASA's missions page and report the displayed page heading. | success, success, success | success, success, success |
| `livev1-c` medium: Open the U.S. Census Bureau about page and report the agency name shown there. | success, success, success | success, success, success |
| `livev1-c` medium: Open the NIST about page and report the heading shown on the official About destin | success, success, success | success, success, success |
| `livev1-c` hard: Open the National Archives about page and report the organization name displayed the | success, success, success | success, success, success |
| `livev1-d` easy: Open the World Bank population indicator page and report the indicator title. | success, success, success | success, success, success |
| `livev1-d` medium: Open Our World in Data's CO₂ emissions page and report the title shown on the page | success, success, success | success, success, success |
| `livev1-d` medium: Open Data.gov's climate topic page and report the topic name. | failure, failure, failure | failure, failure, success |
| `livev1-d` hard: Open Eurostat's database landing page and report the displayed database title. | success, success, success | success, success, success |
| `livev1-d` hard: Open the OECD Data Explorer and report the product name shown on its landing page. | success, success, success | success, success, success |
| `livev1-n` easy: Use Wikipedia to open the Ada Lovelace article and leave the article page visible. | success, success, success | success, success, success |
| `livev1-n` easy: Use Merriam-Webster to open the dictionary entry for “serendipity” and leave its def | success, success, success | success, success, success |
| `livev1-n` medium: Use the Smithsonian National Air and Space Museum site to open the collection obje | success, success, success | success, success, success |
| `livev1-n` medium: Search Project Gutenberg for “Frankenstein” and leave the results page visible wit | success, success, success | success, success, success |
| `livev1-n` medium: Use The Met collection search to find “Wheat Field with Cypresses” and leave the m | success, success, success | success, success, success |
| `livev1-i` medium: Search Open Library for “machine learning” and leave the site results page visible | success, success, success | success, success, success |
| `livev1-i` medium: Open the GitHub issues page for microsoft/vscode and leave the open-issues state v | success, success, success | success, success, success |
| `livev1-i` hard: Search OpenStreetMap for the Eiffel Tower and leave the selected place or result vis | success, success, success | success, success, success |
| `livev1-i` hard: Search TMDB for “Spirited Away” and leave the title result or title page visible. | success, success, success | success, success, success |
| `livev1-i` hard: Search arXiv for “attention is all you need” and leave the on-site results page visi | success, success, success | success, success, success |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| tree | 90 | 86 | 4 | 0 | 0 | 0 | 57 | 33 | 0 | 90 | 8 |
| screenshot | 90 | 88 | 2 | 0 | 0 | 0 | 57 | 33 | 0 | 90 | 16 |

### Check vs judge disagreements

None.
