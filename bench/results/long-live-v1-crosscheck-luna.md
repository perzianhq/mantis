# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-25; runs per task and approach: 3; 2 runs in parallel.
- Scope: 2 tasks × 2 approaches × 3 runs = 12 logical runs; 12 recorded so far; 12 total attempts including retries.
- Codex runtime: codex-cli 0.164.0-alpha.11.1; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 6 / 6 | 6 / 6 |
| After reruns / merged correct | 6 / 6 | 6 / 6 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 6 / 6 | 6 / 6 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 114 | 158 |
| MCP tool errors (including retries) | 2 | 10 |
| Browser observation text (observed chars) | 272,430 | 1,109,748 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | 232,127 | 353,112 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 2,563,200 | 5,628,672 |
| Output tokens (total) | 7,030 | 8,984 |
| Total input tokens incl. cache (legacy) | 2,795,327 | 5,981,784 |
| MCP startup (total, s) | 12.1 | 12.1 |
| CLI startup (total, s) | 2.6 | 2.5 |
| CLI execution (total, s) | 419.3 | 614.6 |
| CLI wall (total, s) | 421.9 | 617.1 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 1.0 | 1.1 |
| Harness capture (total, s) | 11.1 | 258.3 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-dickens-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 14 | 0 | 28,977 | 0 | 26,548 | 0 | 263,424 | 927 | 2.0 | 0.5 | 46.9 | 47.4 | 0.00 | 0.15 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: advanced-search results page two, showing the selected Author Dickens, LoC Class PR, Language English filters and 145 books found. The displayed release dates and LoC codes above were observed on each exact-ID catalogue page. The “Earlier” line is my comparison of those displayed dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 29 | 3 | 134,041 | 0 | 84,257 | 0 | 1,143,424 | 1,635 | 2.0 | 0.5 | 80.9 | 81.4 | 0.00 | 0.16 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR — Earlier 1400 \| Great Expectations \| 1998-07-01 \| PR Currently visible: the second advanced-search results page, showing Author = Charles Dickens, Language = English, LoC Class = PR, 145 books found, and #1400 Great Expectations. The dates and class codes above were observed on the separate exact-ID catalogue records after Quick searches. |
| `longlive-gutenberg-dickens-search` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 26,433 | 0 | 45,083 | 0 | 201,088 | 781 | 2.0 | 0.4 | 36.8 | 37.2 | 0.00 | 0.14 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: the second advanced-search results page, with Charles Dickens, English, and PR selections retained. It shows 145 books found; the inspected second-page entries include eBooks 9712, 50334, 9697, 9715, and 9723. I separately searched for 98 and 1400, opened the matching results, and observed the titles, release dates, and LoC class codes reported above. The earlier release is my comparison of the displayed dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 29 | 2 | 123,791 | 0 | 59,091 | 0 | 1,064,704 | 1,687 | 2.0 | 0.4 | 74.4 | 74.8 | 0.00 | 0.25 | #98 \| A Tale of Two Cities \| 1994-01-01 \| PR #1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: advanced-search results page two, with Author = Charles Dickens, Language = English, and LoC Class = PR selections retained. The catalogue records for #98 and #1400 were inspected earlier; their displayed release dates establish that #98 is earlier. |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 15 | 1 | 41,653 | 0 | 47,520 | 0 | 298,240 | 999 | 2.0 | 0.4 | 50.1 | 50.5 | 0.00 | 0.15 | #98 \| A Tale of Two Cities \| 1994-01-01 \| PR #1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: Gutenberg’s second advanced-search results page, showing 145 books and the selected author, English language, and PR class filters. The titles, release dates, and PR codes above were observed on each exact-ID catalogue record. “Earlier” is my comparison of the displayed release dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 24 | 1 | 188,843 | 0 | 45,583 | 0 | 852,736 | 1,334 | 2.0 | 0.4 | 64.1 | 64.5 | 0.00 | 0.17 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: advanced-search results page two, with the Charles Dickens, English, and PR selections retained. The release dates and LoC codes above are from the two exact-ID catalogue records. The earlier release is my comparison of those displayed dates. |
| `longlive-met-monet-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 34 | 1 | 66,754 | 0 | 43,127 | 0 | 864,640 | 1,712 | 2.0 | 0.4 | 114.5 | 114.9 | 0.00 | 0.19 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: 437133 Currently visible: page two of the original Monet search, with Has image checked, Title (a-z) selected, and the rendered range “43-84 of 244 results for Monet.” The artwork dates, object numbers, and dimensions above were read earlier from each object’s Artwork Details / Overview. The height comparison is my calculation from the displayed dimensions. |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 32 | 1 | 356,336 | 0 | 60,303 | 0 | 1,055,232 | 1,920 | 2.0 | 0.4 | 157.9 | 158.3 | 0.00 | 0.18 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: 437133 Currently visible: page two of the original Monet search, with Has image checked, Title (a-z) selected, and rendered results range 43–84 of 244. The height comparison is my calculation from the displayed Overview dimensions. |
| `longlive-met-monet-search` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 42,292 | 0 | 31,043 | 0 | 317,568 | 966 | 2.0 | 0.4 | 68.2 | 68.6 | 0.00 | 0.17 | The page currently visible is page two of the original Monet search, showing **43–84 of 244 results**, with **Has image** checked and **Title (a-z)** selected. Earlier, a Title-field search for “Bridge over a Pond of Water Lilies” returned object **437127**. Its Overview displayed date **1899** and object number **29.100.113**. I did not obtain the displayed dimensions or complete the separate Title-field search for “Garden at Sainte-Adresse,” so I can’t reliably report the requested comparison or taller object. |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 13 | 1 | 75,446 | 0 | 46,704 | 0 | 313,728 | 728 | 2.0 | 0.4 | 66.6 | 67.0 | 0.00 | 0.15 | I searched **Monet** in **All Fields**. The first rendered results page showed **1–42 of 250**. After turning on **Has image** and selecting **Title (a-z)**, the rendered results showed **1–42 of 244**. I wasn’t able to complete the requested inspections: the page-two click failed, and I did not open either object through its own Title-field search. I therefore can’t report the requested Artwork Details or dimensions, or claim that page two is currently visible. The latest observed page is still the original Monet search, page one, with Has image enabled and Title (a-z) selected. |
| `longlive-met-monet-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 66,321 | 0 | 38,806 | 0 | 618,240 | 1,645 | 2.0 | 0.4 | 102.9 | 103.3 | 0.00 | 0.15 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: 437133 The dates, object numbers, and dimensions are from each artwork’s Overview. The height comparison uses the first displayed dimension: 98.1 cm is greater than 92.7 cm. Currently visible: the original Monet search, page two, with the search field set to All Fields, Has image checked, the other quick filters off, Title (a-z) selected, and the rendered range “43-84 of 244 results for Monet.” The two artwork details above are from earlier observations. |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 31 | 2 | 231,291 | 0 | 57,174 | 0 | 1,198,848 | 1,680 | 2.0 | 0.4 | 170.6 | 171.0 | 0.00 | 0.18 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: 437133 The displayed dates, object numbers, and dimensions came from each object’s Artwork Details / Overview. At the end, the page currently shows the original Monet search, Has image checked, Title (a-z) selected, and the rendered range **43–84 of 244 results**. The first page showed **1–42 of 244 results**. |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-dickens-search` | Mantis | 1 | 1 | success | n/a | 1200 | 14 | 289,972 | 46.9 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 29 | 1,227,681 | 80.9 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 2 | 1 | success | n/a | 1200 | 11 | 246,171 | 36.8 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 29 | 1,123,795 | 74.4 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | 1 | success | n/a | 1200 | 15 | 345,760 | 50.1 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 24 | 898,319 | 64.1 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 1 | 1 | success | n/a | 1200 | 34 | 907,767 | 114.5 | unknown | unknown | known |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 32 | 1,115,535 | 157.9 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 2 | 1 | success | n/a | 1200 | 15 | 348,611 | 68.2 | unknown | unknown | known |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 13 | 360,432 | 66.6 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 657,046 | 102.9 | unknown | unknown | known |
| `longlive-met-monet-search` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 31 | 1,256,022 | 170.6 | unknown | unknown | known |
