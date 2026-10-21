# Real-site eval, blind-judged: live-v1-deepseek-final-20261021

> Each current-format run was graded blind by `gpt-6.1-sol` from the agent's final reply and a judge evidence packet of per-step harness frames (page image, URL, text, and final form values), unless an explicitly opted-in complete deterministic grader decided it first. Legacy substring checks can override a judge verdict. Legacy runs use the final live-page screenshot, or a fresh load when unavailable. Tool-revealing lines were stripped and the order shuffled.

## Per approach

| Approach | Runs | Success | Failure | Unsure | Blocked | Site broken | Overall success rate | Success rate excluding universally blocked / site-broken tasks | Avg tool calls | Avg input tokens | Avg time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 90 | 36 | 23 | 31 | 0 | 0 | 40.0% | 40.0% | 7.4 | 78,105 | 107.9 |
| tree | 90 | 34 | 25 | 31 | 0 | 0 | 37.8% | 37.8% | 8.1 | 155,090 | 103.9 |
| screenshot | 90 | 41 | 21 | 28 | 0 | 0 | 45.6% | 45.6% | 13.9 | 84,219 | 162.8 |

Universally blocked tasks: none. Site-broken tasks: none.

## Per task

| Task | mantis | tree | screenshot |
|---|---|---|---|
| `livev1-s` easy: Open the GNU GPL v3 license page and report its full title and date. | failure, failure, failure | failure, failure, failure | failure, failure, failure |
| `livev1-s` easy: Open the WCAG 2.2 recommendation and report the standard's displayed title. | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-s` medium: Open RFC 9110 and report its displayed protocol title. | failure, failure, failure | failure, failure, success | success, success, success |
| `livev1-s` medium: Open the OpenAPI 3.1.0 specification and report the version shown in its title. | success, success, success | success, success, success | success, success, success |
| `livev1-s` hard: Open the CSS Color Level 4 specification and report its displayed title. | success, success, success | success, success, success | success, success, success |
| `livev1-d` easy: Open Python's json library documentation and report the module heading. | success, success, success | success, success, success | success, success, success |
| `livev1-d` easy: Open MDN's HTTP overview and report the page heading. | success, success, failure | success, failure, failure | success, success, failure |
| `livev1-d` medium: Open Node.js URL documentation and report the API section title. | failure, failure, failure | failure, failure, failure | failure, success, success |
| `livev1-d` medium: Open Django's overview and report the page heading. | success, success, success | success, failure, failure | failure, failure, failure |
| `livev1-d` hard: Open PostgreSQL's current data-types chapter and report the chapter heading. | success, success, success | success, success, success | success, success, success |
| `livev1-c` easy: Open the Library of Congress about page and report the organization name displayed t | success, success, success | success, success, success | success, success, success |
| `livev1-c` medium: Open NASA's missions page and report the displayed page heading. | failure, failure, failure | failure, failure, failure | success, success, success |
| `livev1-c` medium: Open the U.S. Census Bureau about page and report the agency name shown there. | failure, failure, failure | failure, failure, failure | failure, failure, failure |
| `livev1-c` medium: Open the USGS about page and report its displayed heading. | failure, failure, failure | failure, failure, failure | failure, failure, success |
| `livev1-c` hard: Open the National Archives about page and report the organization name displayed the | success, success, success | success, success, success | success, success, success |
| `livev1-d` easy: Open the World Bank population indicator page and report the indicator title. | success, success, success | success, success, success | success, success, success |
| `livev1-d` medium: Open Our World in Data's CO₂ emissions page and report the chart topic title. | success, failure, failure | failure, failure, success | failure, failure, failure |
| `livev1-d` medium: Open Data.gov's climate topic page and report the topic name. | success, success, success | success, success, success | success, success, success |
| `livev1-d` hard: Open Eurostat's database landing page and report the displayed database title. | success, success, success | success, success, success | success, success, success |
| `livev1-d` hard: Open the OECD Data Explorer and report the product name shown on its landing page. | success, success, success | success, success, success | success, success, success |
| `livev1-n` easy: Use Wikipedia to open the Ada Lovelace article and leave the article page visible. | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-n` easy: Use Merriam-Webster to open the dictionary entry for “serendipity” and leave its def | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-n` medium: Use the Smithsonian National Air and Space Museum site to open the collection obje | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-n` medium: Search Project Gutenberg for “Frankenstein” and leave the results page visible wit | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-n` medium: Use The Met collection search to find “Starry Night” and leave the matching collec | unsure, unsure, unsure | unsure, unsure, unsure | failure, unsure, failure |
| `livev1-i` medium: Search Open Library for “machine learning” and leave the site results page visible | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-i` medium: Open the GitHub issues page for microsoft/vscode and leave the open-issues state v | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-i` hard: Search OpenStreetMap for the Eiffel Tower and leave the selected place or result vis | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-i` hard: Search IMDb for “Spirited Away” and leave the title result or title page visible. | unsure, unsure, unsure | unsure, unsure, unsure | unsure, unsure, unsure |
| `livev1-i` hard: Search Smithsonian for “Apollo 11” and leave the on-site results page visible with t | failure, unsure, failure | failure, failure, unsure | failure, failure, failure |

## Evidence and checks

| Approach | Evidence runs | Success | Failure | Unsure | Blocked | Site broken | Deterministic | Judge fallback | Status-only | With frames | Citing an earlier frame |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mantis | 90 | 36 | 23 | 31 | 0 | 0 | 56 | 34 | 0 | 90 | 0 |
| tree | 90 | 34 | 25 | 31 | 0 | 0 | 57 | 33 | 0 | 90 | 0 |
| screenshot | 90 | 41 | 21 | 28 | 0 | 0 | 55 | 35 | 0 | 90 | 0 |

### Check vs judge disagreements

None.
