# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 12 runs in parallel.
- Scope: 16 tasks × 2 approaches × 1 runs = 32 logical runs; 32 recorded so far; 32 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 16 / 16 | 16 / 16 |
| After reruns / merged correct | 16 / 16 | 16 / 16 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 16 / 16 | 16 / 16 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 524 | 530 |
| MCP tool errors (including retries) | 54 | 22 |
| Browser observation text (observed chars) | 712,921 | 1,196,270 |
| Browser observation images (observed blocks) | 12 | 9 |
| Normal input tokens (total) | 796 | 692 |
| Cache-write input tokens (total) | 564,617 | 776,277 |
| Cache-read input tokens (total) | 10,781,495 | 12,736,307 |
| Output tokens (total) | 128,796 | 103,270 |
| Total input tokens incl. cache (legacy) | 11,346,908 | 13,513,276 |
| MCP startup (total, s) | 35.9 | 36.6 |
| CLI startup (total, s) | 79.7 | 70.7 |
| CLI execution (total, s) | 2582.0 | 2665.9 |
| CLI wall (total, s) | 2661.7 | 2736.7 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 5.5 | 6.0 |
| Harness capture (total, s) | 319.7 | 586.0 |
| Cost estimate (USD; including retries) | 7.29 | 8.28 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 30 | 3 | 136,301 | 0 | 52 | 86,211 | 1,037,703 | 9,495 | 2.3 | 7.6 | 418.7 | 426.3 | 0.00 | 0.27 | Pioneer 10 has the lowest launch mass, so I finished on its pinned revision. Each value below is the labelled infobox field read from the pinned revision; I use |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 86 | 4 | 116,431 | 5 | 88 | 92,197 | 2,090,739 | 17,640 | 2.3 | 6.9 | 559.2 | 566.1 | 0.00 | 0.19 | Pioneer 10 is the lightest at 258 kg. Each entity was reached by Wikipedia search, then its pinned revision was read in the infobox. Voyager 1 \| 1977-09-05 \| 1 |
| `longlive-wiki-moons` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 53 | 8 | 42,247 | 0 | 60 | 36,073 | 805,628 | 10,497 | 2.4 | 7.3 | 521.1 | 528.4 | 0.00 | 0.16 | Mimas is the last pinned page, and it's the one open now. Io \| 1824.2 km \| 1.769 d \| 1610-01-08 Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08 Ganymede \| 2632.27 |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 158,770 | 0 | 28 | 95,235 | 549,391 | 5,450 | 2.4 | 6.5 | 266.7 | 273.2 | 0.00 | 0.42 | Infobox values from the pinned revisions (I read them from the page's infobox, not calculated): Io \| 1824.2 \| 1.769 \| 1610-01-08 Europa \| 1560.8 \| 3.551181 \| 1 |
| `longlive-gutenberg-novels` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 2 | 77,307 | 0 | 56 | 52,163 | 800,565 | 4,430 | 2.4 | 8.0 | 107.1 | 115.1 | 0.00 | 0.39 | eBook number \| displayed title \| Release Date \| LoC code 1342 \| Pride and Prejudice \| 1998-06-01 \| PR 161 \| Sense and Sensibility \| 1994-09-01 \| PR 158 \| Emma \| |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 45 | 2 | 74,852 | 0 | 58 | 53,952 | 1,050,100 | 7,826 | 2.4 | 8.6 | 203.8 | 212.4 | 0.00 | 0.48 | Persuasion (#105) has the earliest Release Date of the eight records. 1342 \| Pride and Prejudice \| 1998-06-01 \| PR 161 \| Sense and Sensibility \| 1994-09-01 \| P |
| `longlive-gutenberg-gothic` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 50 | 2 | 74,437 | 0 | 104 | 48,167 | 1,871,176 | 8,516 | 2.4 | 7.6 | 152.6 | 160.2 | 0.00 | 0.75 | eBook \| displayed title \| credited Author \| release date \| LoC code 84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 199 |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 40 | 0 | 71,364 | 0 | 46 | 51,530 | 794,740 | 7,001 | 2.4 | 8.6 | 183.1 | 191.7 | 0.00 | 0.46 | Lines below are from the record pages' "Author", "Title", "Release Date" and "LoC Class" fields. Dates are converted from the displayed "Mon D, YYYY" format; th |
| `longlive-met-vangogh` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 61,683 | 0 | 38 | 39,988 | 483,439 | 6,392 | 2.4 | 7.3 | 111.0 | 118.3 | 0.00 | 0.27 | 436528 through 436530 were all read from their Met object pages. Each Overview lists Title, Date, Medium, and Object Number, and a "Dimensions" line that gives  |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 93,422 | 0 | 28 | 59,130 | 562,423 | 6,548 | 2.4 | 7.1 | 151.5 | 158.6 | 0.00 | 0.56 | The eight-object checklist is below. Every value came from the object page's Artwork Details list, and I did no conversions or estimates. ``` 436528 \| Irises \| |
| `longlive-gutenberg-dickens-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 18 | 3 | 29,486 | 0 | 36 | 23,054 | 322,678 | 4,068 | 2.5 | 8.2 | 100.5 | 108.7 | 0.00 | 0.25 | Both titles were confirmed through their own Quick search results, and the browser is back on page two of the advanced search with Author, English and PR still  |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 58,915 | 0 | 40 | 42,665 | 583,312 | 4,670 | 2.5 | 7.9 | 128.3 | 136.2 | 0.00 | 0.43 | I completed the search and both record checks. The browser is on the advanced-search page two, with Author "Charles Dickens", Language English, and LoCC PR stil |
| `longlive-gutenberg-shakespeare-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 30 | 2 | 40,190 | 0 | 50 | 32,146 | 613,786 | 7,190 | 2.0 | 8.3 | 136.8 | 145.1 | 0.00 | 0.42 | 1524 \| Hamlet \| 1998-11-01 \| PR 1533 \| Macbeth \| 1998-11-01 \| PR Earlier: #1524 Both Release Dates are Nov 1, 1998, so the tie goes to the lower eBook number ( |
| `longlive-gutenberg-shakespeare-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 28 | 1 | 53,670 | 0 | 52 | 34,798 | 719,385 | 5,618 | 2.3 | 2.0 | 159.0 | 161.0 | 0.00 | 0.41 | 1524 \| Hamlet \| 1998-11-01 \| PR 1533 \| Macbeth \| 1998-11-01 \| PR Earlier: #1524 Both release dates are as displayed on the book pages (Nov 1, 1998), and I appl |
| `longlive-met-monet-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 33 | 1 | 78,206 | 0 | 60 | 47,422 | 898,561 | 6,947 | 2.0 | 3.7 | 162.3 | 166.0 | 0.00 | 0.43 | Both objects are read and the final page is back on page two of the Monet search. 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 39 | 4 | 199,730 | 0 | 60 | 94,189 | 1,856,320 | 7,235 | 2.0 | 2.1 | 217.9 | 220.0 | 0.00 | 0.35 | Both objects are recorded below, and the browser is back on page two of the "Monet" search. 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 9 |
| `longlive-met-rembrandt-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 66,815 | 0 | 46 | 41,685 | 658,639 | 5,666 | 2.9 | 5.2 | 121.8 | 127.0 | 0.00 | 0.34 | 437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm 437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm Taller: 437394 The final  |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 35 | 3 | 191,256 | 0 | 54 | 92,367 | 1,961,224 | 7,425 | 2.0 | 5.6 | 254.7 | 260.3 | 0.00 | 0.28 | 437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm 437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm Taller: 437394 Steps: I r |
| `longlive-form-selenium-student` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 74 | 12 | 23,149 | 3 | 74 | 48,659 | 1,333,258 | 29,605 | 2.0 | 2.3 | 201.0 | 203.2 | 0.00 | 0.33 | Prepared: Ada Example; Four; Eggs and Sausages; unsubmitted The form is filled with the reviewed values and nothing was submitted. The page is still open on th |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 7 | 1 | 8,079 | 1 | 10 | 14,205 | 62,604 | 5,174 | 2.0 | 4.8 | 37.1 | 41.8 | 0.00 | 0.57 | I stopped before filling anything because I can't map the requested fields to this page's controls. - **Ids aren't visible:** The accessibility snapshot shows  |
| `longlive-form-selenium-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 21 | 2 | 9,630 | 2 | 38 | 15,601 | 289,532 | 5,126 | 2.6 | 2.1 | 55.3 | 57.3 | 0.00 | 0.41 | The form is only partly filled: the Date picker is still empty, so the date step is incomplete. **Completed (verified by reading the page after each pass):** - |
| `longlive-form-selenium-review` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 32 | 2 | 29,480 | 0 | 34 | 24,071 | 383,944 | 4,945 | 2.0 | 2.2 | 84.8 | 87.0 | 0.00 | 0.36 | Prepared: LL16 rehearsal; unsubmitted The form on the page now shows the corrected values, and nothing was submitted. Observed in the final snapshot: - Text in |
| `longlive-form-selenium-select` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 63 | 15 | 11,484 | 5 | 52 | 31,261 | 626,418 | 20,185 | 2.0 | 4.1 | 126.8 | 130.9 | 0.00 | 0.32 | I could not finish the task. The page only lets me replace a selection, not add to it, so the two-item sets can't be built with these tools. **Current state (f |
| `longlive-form-selenium-select` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 34 | 2 | 25,110 | 0 | 30 | 25,227 | 316,366 | 7,027 | 2.0 | 2.0 | 70.0 | 72.0 | 0.00 | 0.44 | selectWithoutMultiple \| two selectWithMultipleEqualsMultiple \| Emmental, Cheddar selectWithEmptyStringMultiple \| one, two selectWithMultipleWithoutValue \| two s |
| `longlive-sauce-cart-revise` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 22,944 | 0 | 28 | 18,605 | 222,240 | 1,951 | 2.0 | 3.6 | 39.4 | 43.0 | 0.00 | 0.34 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The steps are complete and the cart page is open at https://www.saucedemo.com/cart.html. Visible no |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 25 | 2 | 28,379 | 0 | 38 | 21,998 | 379,308 | 3,376 | 2.0 | 1.3 | 75.5 | 76.8 | 0.00 | 0.34 | Done. The cart page is open and shows exactly the Backpack and Bolt T-Shirt, each at quantity 1, with the cart badge at 2 and the Checkout button visible. I did |
| `longlive-sauce-checkout-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 22,606 | 0 | 48 | 19,193 | 424,259 | 3,267 | 2.0 | 1.2 | 67.9 | 69.0 | 0.00 | 0.38 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish The page currently visible is "Checkout: Overview" (https://www.saucedemo.c |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 41 | 1 | 58,849 | 0 | 50 | 36,732 | 701,124 | 4,398 | 2.0 | 1.7 | 111.5 | 113.2 | 0.00 | 0.22 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Checkout: Overview (https://www.saucedemo.com/checkout-step-two.html) is op |
| `longlive-internet-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 4 | 4 | 357 | 0 | 12 | 6,578 | 57,822 | 822 | 2.0 | 1.7 | 196.9 | 198.6 | 0.00 | 0.20 | I could not complete the task because the site did not load. Every attempt to open https://the-internet.herokuapp.com/windows timed out after 30 seconds (three  |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 11,204 | 0 | 38 | 14,890 | 338,177 | 3,437 | 3.6 | 2.0 | 86.9 | 88.8 | 0.00 | 0.23 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: not submitted The top three texts and BO |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 16,079 | 2 | 42 | 17,811 | 335,791 | 4,639 | 2.0 | 1.6 | 62.8 | 64.5 | 0.00 | 0.28 | Everything in the task is done, and the original tab is on the Web form with README.md selected and no Submit clicked. **Result tab (opened by "Open new window |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 16,759 | 3 | 38 | 23,091 | 387,150 | 5,500 | 2.0 | 1.4 | 76.2 | 77.5 | 0.00 | 0.22 | Everything ran as requested, and the original tab is left on the Web form with README.md selected and no Submit clicked. **Result tab ("We Arrive Here", window |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | 1 | success | n/a | 1200 | 30 | 1,123,966 | 418.7 | 0.777 | unknown | known |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 86 | 2,183,024 | 559.2 | 1.238 | unknown | known |
| `longlive-wiki-moons` | Mantis | 1 | 1 | success | n/a | 1200 | 53 | 841,761 | 521.1 | 0.535 | unknown | known |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 22 | 644,654 | 266.7 | 0.604 | unknown | known |
| `longlive-gutenberg-novels` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 852,784 | 107.1 | 0.502 | unknown | known |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 45 | 1,104,110 | 203.8 | 0.635 | unknown | known |
| `longlive-gutenberg-gothic` | Mantis | 1 | 1 | success | n/a | 1200 | 50 | 1,919,447 | 152.6 | 0.87 | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 40 | 846,316 | 183.1 | 0.537 | unknown | known |
| `longlive-met-vangogh` | Mantis | 1 | 1 | success | n/a | 1200 | 25 | 523,465 | 111.0 | 0.391 | unknown | known |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 21 | 621,581 | 151.5 | 0.489 | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 1 | 1 | success | n/a | 1200 | 18 | 345,768 | 100.5 | 0.244 | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 23 | 626,017 | 128.3 | 0.405 | unknown | known |
| `longlive-gutenberg-shakespeare-search` | Mantis | 1 | 1 | success | n/a | 1200 | 30 | 645,982 | 136.8 | 0.413 | unknown | known |
| `longlive-gutenberg-shakespeare-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 28 | 754,235 | 159.0 | 0.431 | unknown | known |
| `longlive-met-monet-search` | Mantis | 1 | 1 | success | n/a | 1200 | 33 | 946,043 | 162.3 | 0.552 | unknown | known |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 39 | 1,950,569 | 217.9 | 1.019 | unknown | known |
| `longlive-met-rembrandt-search` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 700,370 | 121.8 | 0.439 | unknown | known |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 35 | 2,053,645 | 254.7 | 1.046 | unknown | known |
| `longlive-form-selenium-student` | Mantis | 1 | 1 | success | n/a | 1200 | 74 | 1,381,991 | 201.0 | 1.027 | unknown | known |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 7 | 76,819 | 37.1 | 0.15 | unknown | known |
| `longlive-form-selenium-review` | Mantis | 1 | 1 | success | n/a | 1200 | 21 | 305,171 | 55.3 | 0.222 | unknown | known |
| `longlive-form-selenium-review` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 32 | 408,049 | 84.8 | 0.28 | unknown | known |
| `longlive-form-selenium-select` | Mantis | 1 | 1 | success | n/a | 1200 | 63 | 657,731 | 126.8 | 0.608 | unknown | known |
| `longlive-form-selenium-select` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 34 | 341,623 | 70.0 | 0.295 | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 1 | 1 | success | n/a | 1200 | 24 | 240,873 | 39.4 | 0.166 | unknown | known |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 25 | 401,344 | 75.5 | 0.247 | unknown | known |
| `longlive-sauce-checkout-review` | Mantis | 1 | 1 | success | n/a | 1200 | 26 | 443,500 | 67.9 | 0.248 | unknown | known |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 41 | 737,906 | 111.5 | 0.414 | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 4 | 64,412 | 196.9 | 0.054 | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 25 | 353,105 | 86.9 | 0.209 | unknown | known |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 353,644 | 62.8 | 0.237 | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 27 | 410,279 | 76.2 | 0.285 | unknown | known |
