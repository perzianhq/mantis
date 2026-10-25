# Sol judge calibration audit

**FAIL** — packets 120/100; tasks 33/30; agreement 79.2% (95% Wilson 71.1%–85.5%); false successes 6/48 (12.5%) and 5.0% of all packets.

Manifest: 120/120 selected from 1105 eligible deterministic packets (33 tasks; 991 successes; 114 failures).

## Confusion matrix

| Gold | Sol success | Sol failure | Sol other |
| --- | ---: | ---: | ---: |
| success | 56 | 8 | 8 |
| failure | 6 | 39 | 3 |

Other outcomes: unsure 11, blocked 0, site_broken 0. These are disagreements.

## Disagreements by task / approach / model

| Task | Approach | Model | Gold | Sol | Reason |
| --- | --- | --- | --- | --- | --- |
| longlive-wiki-moons | mantis | gpt-6-luna | failure | unsure | F12 verifies Mimas’s values and the required final page, but the other frames do not expose enough infobox data to verify all reported values and significant digits. |
| livev1-docs-mdn-http-overview | mantis | deepseekv4.1-flash | failure | success | F2 shows the accepted MDN HTTP landing page with the heading “HTTP: Hypertext Transfer Protocol,” matching the agent’s report. |
| livev1-docs-django-overview | screenshot | gpt-6-luna | failure | success | F2 shows the official Django overview page, and the agent correctly reported its displayed heading. |
| livev1-civic-census-about | screenshot | gpt-6-luna | failure | success | F3 shows the official Census about page was opened, and F4 supports the reported agency name, U.S. Census Bureau. |
| longlive-gutenberg-shakespeare-search | tree | gpt-6-luna | failure | unsure | The frames support the search sequence, separate exact-ID searches, and return to page two, but F5 and F7 do not show the release dates or LoC codes needed to verify the reported comparison. |
| livev1-docs-mdn-http-overview | tree | deepseekv4.1-flash | failure | success | F3 and F4 show the accepted MDN HTTP landing page with the heading “HTTP: Hypertext Transfer Protocol,” matching the agent’s report. |
| longlive-wiki-moons | tree | gpt-6-luna | failure | unsure | F12 verifies Mimas’s values and the correct final revision, but the supplied frames do not expose the other moons’ required infobox values, so their accuracy and displayed precision cannot be confirmed. |
| livev1-docs-django-overview | screenshot | gpt-6-luna | failure | success | F2 and F3 show the official Django overview page, and the agent correctly reported its displayed heading. |
| livev1-civic-census-about | screenshot | deepseekv4.1-flash | failure | success | F3 shows the official Census about page, and F4 supports the correctly reported agency name, U.S. Census Bureau. |
| longlive-gutenberg-gothic | mantis | claude-haiku-5-5 | success | failure | The final capture is on #84 but shows the top of the record, with “About this eBook” below the visible viewport, so the required finishing state was not achieved. |
| longlive-wiki-moons | mantis | claude-haiku-5-5 | success | unsure | F12 confirms the pinned Mimas endpoint and its reported values, but the captures do not verify Io and Europa’s data or most other moons’ radii and periods. |
| longlive-wiki-probes | tree | gpt-6-luna | success | failure | The journal shows on-site search used only for Voyager 1, followed by direct navigation to the other seven pinned URLs, so the required search workflow was not completed. |
| longlive-met-vangogh | tree | gpt-6-luna | success | failure | The agent visited all eight records and returned the checklist, but F10 shows the final viewport above Artwork Details / Overview, so the required finishing state was not achieved. |
| longlive-met-monet-search | tree | claude-haiku-5-5 | success | unsure | The journal supports the required navigation and F12 confirms the final page-two state, but F6 and F10 do not expose the object numbers or dimensions needed to verify the reported comparison. |
| longlive-gutenberg-dickens-search | tree | gpt-6-luna | success | unsure | The evidence confirms separate number searches, exact-ID records, and return to filtered page two, but F5 and F7 do not show the Release Date or record LoC fields needed to verify the reported details. |
| longlive-gutenberg-shakespeare-search | mantis | claude-haiku-5-5 | success | failure | The final reply incorrectly claims neither target ID appeared on page two, but F12 explicitly lists Hamlet #1524. |
| longlive-gutenberg-novels | mantis | gpt-6-luna | success | failure | The final frame shows Persuasion (#105), but the required “About this eBook” section is below the visible viewport, contrary to the agent’s claim and the task’s finishing requirement. |
| longlive-gutenberg-gothic | tree | claude-haiku-5-5 | success | unsure | The journal confirms catalogue searches and visits to all eight records, but only F12 verifies the required metadata; the other seven records’ credited Authors, Release Dates, and LoC codes are not visible in the evidence. |
| longlive-wiki-moons | tree | claude-haiku-5-5 | success | failure | The agent explicitly admitted skipping the required Wikipedia on-site search and opening pinned URLs directly, although it finished on the correct pinned Mimas article. |
| longlive-met-rembrandt-search | tree | claude-haiku-5-5 | success | unsure | The lookup workflow and restored page-two state are supported, but F6 and F10 do not expose the dimensions and object numbers needed to verify all reported details. |
| longlive-wiki-probes | tree | gpt-6-luna | success | unsure | All pinned articles were visited and F12 confirms Pioneer 10's reported values and final location, but the other articles' launch dates and labelled launch masses are absent from the captured evidence. |
| longlive-gutenberg-shakespeare-search | mantis | gpt-6-luna | success | failure | F8 shows the final Advanced Search language field set to Any, so the required English selection was not retained despite the results summary and URL indicating English. |
| longlive-met-vangogh | mantis | claude-haiku-5-5 | success | unsure | All eight objects were visited and F12 confirms the required final Overview state, but the captures omit several dimensions and Object Numbers needed to verify the complete checklist. |
| longlive-met-monet-search | tree | claude-haiku-5-5 | success | unsure | The required searches, object visits, and restored page-two state are supported, but the captured Overview text omits object numbers and dimensions, preventing verification of the reported values and taller-object comparison. |
| longlive-gutenberg-dickens-search | tree | claude-haiku-5-5 | success | failure | F9 shows the final advanced-search language control set to Any rather than English, so the required original filter selections were not all retained. |

Gate checks: packets PASS; tasks PASS; agreement FAIL; false successes FAIL.
