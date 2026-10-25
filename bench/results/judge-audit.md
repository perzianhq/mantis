# Sol judge calibration audit

**FAIL** — packets 120/100; tasks 33/30; agreement 77.5% (95% Wilson 69.2%–84.1%); false successes 6/48 (12.5%) and 5.0% of all packets.

Manifest: 120/120 selected from 1105 eligible deterministic packets (33 tasks; 991 successes; 114 failures).

## Confusion matrix

| Gold | Sol success | Sol failure | Sol other |
| --- | ---: | ---: | ---: |
| success | 53 | 12 | 7 |
| failure | 6 | 40 | 2 |

Other outcomes: unsure 9, blocked 0, site_broken 0. These are disagreements.

## Disagreements by task / approach / model

| Task | Approach | Model | Gold | Sol | Reason |
| --- | --- | --- | --- | --- | --- |
| longlive-wiki-moons | mantis | gpt-6-luna | failure | unsure | F12 verifies Mimas and the required final location, but the captured infobox content does not verify all reported radii, periods, and discovery dates for the other seven moons. |
| livev1-docs-mdn-http-overview | mantis | deepseekv4.1-flash | failure | success | F2 shows MDN's HTTP landing page with the heading "HTTP: Hypertext Transfer Protocol", matching the agent's report and the accepted task criteria. |
| livev1-docs-django-overview | screenshot | gpt-6-luna | failure | success | F2 shows the official Django overview page and the exact heading quoted in the agent’s reply. |
| livev1-civic-census-about | screenshot | gpt-6-luna | failure | success | F3 shows the official Census about page, and F4 confirms the reported agency name, U.S. Census Bureau, despite the agent's inaccurate reported URL. |
| livev1-docs-mdn-http-overview | tree | deepseekv4.1-flash | failure | success | The agent opened the accepted HTTP landing page and correctly reported its visible heading, "HTTP: Hypertext Transfer Protocol". |
| longlive-wiki-moons | tree | gpt-6-luna | failure | unsure | F12 confirms Mimas’s values and the required final page, but the other frames lack sufficient infobox details to verify all seven remaining moons’ reported values. |
| livev1-docs-django-overview | screenshot | gpt-6-luna | failure | success | F3 confirms the agent opened the official top-navigation overview and correctly reported its displayed heading, despite reporting an imprecise final URL. |
| livev1-civic-census-about | screenshot | deepseekv4.1-flash | failure | success | F3 confirms the official Census about page was opened, and F4 supports the correctly reported agency name, U.S. Census Bureau. |
| longlive-gutenberg-gothic | mantis | claude-haiku-5-5 | success | failure | The final capture is on #84, but the viewport shows the introduction and download section rather than the required visible “About this eBook” section. |
| longlive-sauce-cart-revise | mantis | claude-haiku-5-5 | success | failure | The agent logged in despite the explicit instruction to stop before login, as shown by the transition from F1 to F2, although F11 shows the requested final cart. |
| longlive-wiki-probes | tree | gpt-6-luna | success | unsure | All pinned articles were visited and the final page is Pioneer 10, but the evidence does not show the launch dates and labelled launch masses needed to verify most reported values. |
| longlive-wiki-moons | mantis | claude-haiku-5-5 | success | unsure | F12 verifies Mimas’s values and the required final revision, but the other frames do not expose enough infobox values to verify the complete answer. |
| longlive-met-vangogh | tree | gpt-6-luna | success | failure | The final frame shows 436530, Oleanders, but Artwork Details / Overview is below the viewport rather than visible as required. |
| longlive-gutenberg-shakespeare-search | mantis | claude-haiku-5-5 | success | failure | F12 shows the final Language form selection as Any rather than English, and the reply omits the required 'Earlier: #1524' line. |
| longlive-gutenberg-dickens-search | tree | gpt-6-luna | success | failure | The agent opened both exact records after separate searches and returned to page two, but its final reply omitted both required eBook numbers and left the required 'Earlier: #<number>' comparison blank. |
| longlive-met-monet-search | tree | claude-haiku-5-5 | success | unsure | The searches and final page-two state are supported, but the captures do not show either object's object number or dimensions, so the reported values and height comparison cannot be verified. |
| longlive-form-selenium-review | tree | gpt-6-luna | success | unsure | F1 and the journal support the correct two-pass values and unsubmitted final form, but do not verify that both dates were chosen in the calendar rather than typed. |
| longlive-gutenberg-novels | mantis | gpt-6-luna | success | failure | The final viewport shows the top of Persuasion’s record rather than “About this eBook,” and the reply’s Earliest line omits the required #105. |
| longlive-met-rembrandt-search | tree | claude-haiku-5-5 | success | failure | The final reply includes the live count of 73 Title-search results as an answer fact, violating the explicit prohibition, despite correctly restoring page two. |
| longlive-gutenberg-gothic | tree | claude-haiku-5-5 | success | unsure | Catalogue navigation and the final #84 metadata table are supported, but the captures do not verify the other seven records’ release dates, LoC codes, and exact credited Author fields. |
| longlive-wiki-moons | tree | claude-haiku-5-5 | success | failure | The agent explicitly admitted bypassing the required on-site search, consistent with the direct article transitions, although it finished on the pinned Mimas revision. |
| longlive-sauce-cart-revise | tree | claude-haiku-5-5 | success | failure | The agent completed the cart workflow but logged in despite the explicit instruction to stop before login. |
| longlive-gutenberg-shakespeare-search | mantis | gpt-6-luna | success | failure | The agent searched both explicit IDs and returned to the original second results page, but its final reply omitted the required tie-break result 'Earlier: #1524'. |
| longlive-met-vangogh | mantis | claude-haiku-5-5 | success | unsure | All eight object pages were visited and the final Overview is visible, but the captures omit dimensions and Object Numbers for most objects, preventing verification of the complete checklist. |
| longlive-wiki-probes | tree | gpt-6-luna | success | failure | The journal records only one on-site search, for Voyager 1; the remaining articles were opened directly at pinned URLs, so the required search workflow was not completed. |
| longlive-gutenberg-dickens-search | tree | claude-haiku-5-5 | success | failure | The reply leaves the required 'Earlier: #98' comparison blank, and the final advanced-search form shows Language Any rather than retaining English (F9). |
| longlive-met-monet-search | tree | claude-haiku-5-5 | success | unsure | The search sequence, object visits, and restored page-two state are supported, but F7 and F11 truncate before the object numbers and dimensions, leaving those required answer details unverified. |

Gate checks: packets PASS; tasks PASS; agreement FAIL; false successes FAIL.
