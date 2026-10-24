# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 12 runs in parallel.
- Scope: 16 tasks × 2 approaches × 1 runs = 32 logical runs; 32 recorded so far; 32 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
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
| Tool calls (including retries) | 367 | 408 |
| MCP tool errors (including retries) | 20 | 19 |
| Browser observation text (observed chars) | 568,398 | 1,209,988 |
| Browser observation images (observed blocks) | 2 | 0 |
| Normal input tokens (total) | 506,556 | 623,630 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 5,231,104 | 7,332,224 |
| Output tokens (total) | 24,659 | 22,049 |
| Total input tokens incl. cache (legacy) | 5,737,660 | 7,955,854 |
| MCP startup (total, s) | 33.9 | 36.9 |
| CLI startup (total, s) | 26.3 | 25.4 |
| CLI execution (total, s) | 2057.1 | 2073.8 |
| CLI wall (total, s) | 2083.5 | 2099.2 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 5.8 | 5.3 |
| Harness capture (total, s) | 281.1 | 462.2 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 49 | 5 | 47,950 | 0 | 39,776 | 0 | 399,744 | 2,599 | 2.2 | 2.6 | 410.9 | 413.5 | 0.00 | 0.17 | Voyager 1 \| 1977-09-05 \| 1977-084A \| Titan IIIE \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| Titan IIIE \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| Atlas  |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 32,202 | 0 | 50,356 | 0 | 250,112 | 1,965 | 2.2 | 2.7 | 339.5 | 342.2 | 0.00 | 0.24 | Voyager 1 \| 1977-09-05 \| 1977-084A \| Titan IIIE-Centaur \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| Titan IIIE-Centaur \| 721.9 kg Pioneer 10 \| 1972-03-03  |
| `longlive-wiki-moons` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 49 | 6 | 49,341 | 0 | 21,830 | 0 | 540,928 | 2,689 | 2.2 | 2.5 | 481.0 | 483.5 | 0.00 | 0.14 | Currently visible: the pinned Mimas article, with infobox radius `197.49±0.07 km`, sidereal period `0.942421959 d`, and discovery date `17 September 1789`. The  |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 79,110 | 0 | 28,213 | 0 | 217,344 | 1,587 | 2.2 | 2.5 | 124.3 | 126.7 | 0.00 | 0.32 | Io \| 1824.2 \| 1.769137786 \| 1610-01-08 Europa \| 1560.8 \| 3.551181 \| 1610-01-08 Ganymede \| 2632.27 \| 7.15455296 \| 1610-01-07 Callisto \| 2410.3 \| 16.6890184 \| 161 |
| `longlive-gutenberg-novels` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 54,336 | 0 | 39,142 | 0 | 149,504 | 1,042 | 2.2 | 2.7 | 79.1 | 81.8 | 0.00 | 0.40 | 105 \| Persuasion \| 1994-02-01 \| PR 121 \| Northanger Abbey \| 1994-04-01 \| PR 141 \| Mansfield Park \| 1994-06-01 \| PR 158 \| Emma \| 1994-08-01 \| PR 161 \| Se |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 26 | 3 | 42,214 | 0 | 21,600 | 0 | 299,136 | 1,346 | 2.2 | 2.8 | 211.5 | 214.3 | 0.00 | 0.39 | #1342 \| Pride and Prejudice \| 1998-06-01 \| PR #161 \| Sense and Sensibility \| 1994-09-01 \| PR #158 \| Emma \| 1994-08-01 \| PR #141 \| Mansfield Park \| 1994-06-01 \|  |
| `longlive-gutenberg-gothic` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 28 | 2 | 66,654 | 0 | 72,516 | 0 | 320,128 | 2,498 | 2.2 | 2.7 | 114.6 | 117.3 | 0.00 | 0.36 | 84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR 345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \|  |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 29 | 1 | 174,434 | 0 | 68,401 | 0 | 593,152 | 1,607 | 2.2 | 2.5 | 143.3 | 145.8 | 0.00 | 0.50 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture of  |
| `longlive-met-vangogh` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 92,080 | 0 | 35,743 | 0 | 243,200 | 1,400 | 2.3 | 2.4 | 128.6 | 131.1 | 0.00 | 0.33 | 436528 \| Irises \| 1890 \| Oil on canvas \| 58.187 \| 73.7 x 92.1 cm 436532 \| Self-Portrait with a Straw Hat (obverse: The Potato Peeler) \| 1887 \| Oil on canvas \| 6 |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 114,312 | 0 | 37,003 | 0 | 296,448 | 1,437 | 2.3 | 2.7 | 210.8 | 213.5 | 0.00 | 0.37 | 436528 \| Irises \| 1890 \| Oil on canvas \| 58.187 \| 73.7 x 92.1 cm 436532 \| Self-Portrait with a Straw Hat (obverse: The Potato Peeler) \| 1887 \| Oil on canvas \| 6 |
| `longlive-gutenberg-dickens-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 2 | 25,762 | 0 | 32,104 | 0 | 259,840 | 977 | 2.3 | 2.6 | 95.8 | 98.4 | 0.00 | 0.39 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: the second advanced-search results  |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 20 | 2 | 113,454 | 0 | 53,528 | 0 | 667,904 | 1,249 | 2.3 | 2.3 | 120.9 | 123.1 | 0.00 | 0.36 | #98 \| A Tale of Two Cities \| 1994-01-01 \| PR #1400 \| Great Expectations \| Release Date and LoC class not visible Earlier: #98 I inspected page one and follo |
| `longlive-gutenberg-shakespeare-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 13 | 1 | 41,662 | 0 | 25,295 | 0 | 269,184 | 1,237 | 2.0 | 1.3 | 68.5 | 69.9 | 0.00 | 0.63 | 1524 \| Hamlet \| 1998-11-01 \| PR 1533 \| Macbeth \| 1998-11-01 \| PR — Earlier: #1524 Both catalogue records displayed the same release date, Nov 1, 1998; #1524  |
| `longlive-gutenberg-shakespeare-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 26 | 1 | 203,511 | 0 | 53,150 | 0 | 1,027,584 | 1,470 | 2.0 | 1.2 | 107.9 | 109.1 | 0.00 | 0.38 | 1524 \| Hamlet \| 1998-11-01 \| PR 1533 \| Macbeth \| 1998-11-01 \| PR The records have the same release date, so the lower eBook number makes **#1524 earlier** by |
| `longlive-met-monet-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 39 | 0 | 81,755 | 0 | 77,257 | 0 | 1,039,616 | 2,261 | 2.0 | 0.8 | 170.3 | 171.1 | 0.00 | 0.32 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 31 | 1 | 155,635 | 0 | 66,979 | 0 | 1,173,120 | 1,560 | 3.2 | 0.8 | 179.8 | 180.5 | 0.00 | 0.34 | Current page: The original Monet results, showing **43–84 of 244 results**, with **Has image** applied and **Title (a-z)** selected. The other quick filters wer |
| `longlive-met-rembrandt-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 10 | 0 | 25,801 | 0 | 23,480 | 0 | 185,600 | 535 | 2.0 | 2.7 | 46.6 | 49.3 | 0.00 | 0.50 | I inspected page one and used pagination to inspect page two of the original “Rembrandt” search. The current page shows results 43–84, with Has image checked an |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 115,225 | 0 | 50,684 | 0 | 621,440 | 1,162 | 2.0 | 0.6 | 135.0 | 135.6 | 0.00 | 0.33 | 437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm 437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm Taller: 437394 Curren |
| `longlive-form-selenium-student` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 20 | 1 | 14,444 | 0 | 14,666 | 0 | 198,144 | 2,193 | 2.0 | 1.3 | 42.8 | 44.1 | 0.00 | 0.35 | The first pass showed email `ada@example.com`, age `35`, “Draft profile,” “Ada,” “Draft synthetic notes,” “Example Lane,” checkbox changes, and selectomatic “Tw |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 11 | 1 | 13,556 | 0 | 11,953 | 0 | 139,136 | 1,037 | 2.0 | 0.9 | 33.3 | 34.2 | 0.00 | 0.40 | Prepared: Ada Example; Four; Eggs and Sausages; unsubmitted The Form Page currently shows email `ada@example.com`, age `36`, “Reviewed profile,” “Ada Example,” |
| `longlive-form-selenium-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 21 | 1 | 7,997 | 0 | 30,742 | 0 | 343,936 | 1,904 | 2.0 | 0.7 | 60.5 | 61.2 | 0.00 | 0.30 | Prepared: LL16 rehearsal; unsubmitted The form is left open with the review values visible: text “LL16 rehearsal,” textarea “Synthetic profile. Leave unsubmitt |
| `longlive-form-selenium-review` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 22 | 1 | 25,348 | 0 | 21,278 | 0 | 142,720 | 1,308 | 2.5 | 1.1 | 48.1 | 49.1 | 0.00 | 0.34 | Prepared: LL16 rehearsal; unsubmitted The form currently shows Text input “LL16 rehearsal,” Textarea “Synthetic profile. Leave unsubmitted.”, Dropdown (select) |
| `longlive-form-selenium-select` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 5 | 0 | 2,278 | 0 | 8,256 | 0 | 91,648 | 1,169 | 2.0 | 0.7 | 27.5 | 28.2 | 0.00 | 0.78 | I could not complete the requested passes with the available browser controls. The page is still open and was not submitted. The browser’s select action picks o |
| `longlive-form-selenium-select` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 12,489 | 0 | 23,729 | 0 | 82,688 | 965 | 3.2 | 2.4 | 44.7 | 47.1 | 0.00 | 0.34 | selectWithoutMultiple \| two selectWithMultipleEqualsMultiple \| Emmental, Cheddar selectWithEmptyStringMultiple \| one, two selectWithMultipleWithoutValue \| two s |
| `longlive-sauce-cart-revise` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 12,013 | 0 | 22,259 | 0 | 264,192 | 802 | 2.3 | 0.8 | 49.3 | 50.1 | 0.00 | 0.40 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart is currently visible with quantity 1 for each item, a cart badge showing 2 items, and Chec |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 25 | 1 | 43,804 | 0 | 40,960 | 0 | 380,928 | 1,000 | 2.0 | 0.6 | 78.6 | 79.2 | 0.00 | 0.33 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 Currently visible on the cart page: the badge shows **2 items**, with quantity **1** each for Sauce |
| `longlive-sauce-checkout-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 23,630 | 0 | 19,806 | 0 | 502,656 | 1,343 | 2.0 | 0.6 | 80.4 | 81.0 | 0.00 | 0.28 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Currently visible: Checkout: Overview, with one Onesie and one Fleece Jacke |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 38 | 1 | 60,567 | 0 | 50,994 | 0 | 824,832 | 1,716 | 2.3 | 0.9 | 111.8 | 112.7 | 0.00 | 0.20 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Currently visible on Sauce Demo’s Checkout: Overview: one Sauce Labs Fleece |
| `longlive-internet-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 4 | 2 | 460 | 0 | 9,116 | 0 | 100,096 | 537 | 2.0 | 0.7 | 148.4 | 149.2 | 0.00 | 0.19 | I couldn’t complete the browser handoff. The browser timed out twice opening the requested page, and its current observation shows no visible content. I couldn’ |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 23 | 4 | 10,753 | 0 | 23,127 | 0 | 361,728 | 1,310 | 2.0 | 0.8 | 127.5 | 128.3 | 0.00 | 0.17 | New tab: New Window (earlier observation; rechecked) Top left: LEFT (inside the top parent frameset) Top middle: MIDDLE (inside the top parent frameset) Top rig |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 22,235 | 2 | 34,568 | 0 | 322,688 | 1,473 | 2.1 | 1.2 | 52.8 | 54.0 | 0.00 | 0.30 | - **Result tab (rechecked):** headings “List of stuff” and “Almost empty”; success text: “Success!” - **Anonymous iframe tab (rechecked):** top heading “This is |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 25 | 3 | 13,374 | 0 | 21,675 | 0 | 253,952 | 1,330 | 2.0 | 0.8 | 56.9 | 57.7 | 0.00 | 0.29 | The result tab remains open. Its success paragraph is **“Success!”** and its two `<h1>` headings are **“List of stuff”** and **“Almost empty.”** I revisited it  |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | 1 | success | n/a | 1200 | 49 | 439,520 | 410.9 | unknown | unknown | known |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 33 | 300,468 | 339.5 | unknown | unknown | known |
| `longlive-wiki-moons` | Mantis | 1 | 1 | success | n/a | 1200 | 49 | 562,758 | 481.0 | unknown | unknown | known |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 23 | 245,557 | 124.3 | unknown | unknown | known |
| `longlive-gutenberg-novels` | Mantis | 1 | 1 | success | n/a | 1200 | 15 | 188,646 | 79.1 | unknown | unknown | known |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 26 | 320,736 | 211.5 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Mantis | 1 | 1 | success | n/a | 1200 | 28 | 392,644 | 114.6 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 29 | 661,553 | 143.3 | unknown | unknown | known |
| `longlive-met-vangogh` | Mantis | 1 | 1 | success | n/a | 1200 | 30 | 278,943 | 128.6 | unknown | unknown | known |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 34 | 333,451 | 210.8 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 291,944 | 95.8 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 20 | 721,432 | 120.9 | unknown | unknown | known |
| `longlive-gutenberg-shakespeare-search` | Mantis | 1 | 1 | success | n/a | 1200 | 13 | 294,479 | 68.5 | unknown | unknown | known |
| `longlive-gutenberg-shakespeare-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 26 | 1,080,734 | 107.9 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 1 | 1 | success | n/a | 1200 | 39 | 1,116,873 | 170.3 | unknown | unknown | known |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 31 | 1,240,099 | 179.8 | unknown | unknown | known |
| `longlive-met-rembrandt-search` | Mantis | 1 | 1 | success | n/a | 1200 | 10 | 209,080 | 46.6 | unknown | unknown | known |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 18 | 672,124 | 135.0 | unknown | unknown | known |
| `longlive-form-selenium-student` | Mantis | 1 | 1 | success | n/a | 1200 | 20 | 212,810 | 42.8 | unknown | unknown | known |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 11 | 151,089 | 33.3 | unknown | unknown | known |
| `longlive-form-selenium-review` | Mantis | 1 | 1 | success | n/a | 1200 | 21 | 374,678 | 60.5 | unknown | unknown | known |
| `longlive-form-selenium-review` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 22 | 163,998 | 48.1 | unknown | unknown | known |
| `longlive-form-selenium-select` | Mantis | 1 | 1 | success | n/a | 1200 | 5 | 99,904 | 27.5 | unknown | unknown | known |
| `longlive-form-selenium-select` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 24 | 106,417 | 44.7 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 286,451 | 49.3 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 25 | 421,888 | 78.6 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Mantis | 1 | 1 | success | n/a | 1200 | 28 | 522,462 | 80.4 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 38 | 875,826 | 111.8 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 4 | 109,212 | 148.4 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 23 | 384,855 | 127.5 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 357,256 | 52.8 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 25 | 275,627 | 56.9 | unknown | unknown | known |
