# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-04; runs per task and approach: 5; 4 runs in parallel.
- Scope: 1 tasks × 2 approaches × 5 runs = 10 logical runs; 10 recorded so far; 10 total attempts including retries.
- Codex runtime: codex-cli 0.166.0-alpha.5.1; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 5 / 5 | 5 / 5 |
| After reruns / merged correct | 5 / 5 | 5 / 5 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 5 / 5 | 5 / 5 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 57 | 125 |
| MCP tool errors (including retries) | 0 | 2 |
| Browser observation text (observed chars) | 155,976 | 917,110 |
| Browser observation images (observed blocks) | 0 | 1 |
| Normal input tokens (total) | 160,438 | 345,523 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 1,010,688 | 4,067,968 |
| Output tokens (total) | 4,567 | 7,325 |
| Total input tokens incl. cache (legacy) | 1,171,126 | 4,413,491 |
| MCP startup (total, s) | 10.6 | 10.3 |
| CLI startup (total, s) | 5.0 | 4.9 |
| CLI execution (total, s) | 258.7 | 477.4 |
| CLI wall (total, s) | 263.7 | 482.3 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 1.4 | 1.5 |
| Harness capture (total, s) | 6.8 | 84.4 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-dickens-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 27,456 | 0 | 24,756 | 0 | 194,304 | 881 | 2.1 | 1.5 | 54.7 | 56.2 | 0.00 | 0.34 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: the second advanced-search results page, with Author Charles Dickens, Language English, and LoC Class PR selected. The displayed page-two results include eBook numbers 15618, 9708, 9736, and 19337. The titles, release dates, and PR codes above were observed on the catalogue records opened after separate Quick searches for IDs 98 and 1400. “Earlier” is my comparison of their displayed release dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 194,391 | 0 | 53,305 | 0 | 700,672 | 1,311 | 2.1 | 1.5 | 86.7 | 88.2 | 0.00 | 0.36 | #98 \| A Tale of Two Cities \| 1994-01-01 \| PR #1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: the second advanced-search results page, with the Charles Dickens, English, and PR selections retained. Its URL is the original page-two URL. I observed the release dates on each exact-ID catalogue record; the “Earlier” label is my comparison of those dates. |
| `longlive-gutenberg-dickens-search` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 12 | 0 | 31,145 | 0 | 52,726 | 0 | 194,304 | 1,021 | 2.1 | 1.4 | 57.3 | 58.8 | 0.00 | 0.25 | #98 \| A Tale of Two Cities \| 1994-01-01 \| PR #1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible is the second Advanced Search results page. It shows Author = Charles Dickens, Language = English, LoC Class = PR, and page 2 selected. The titles and release dates above were observed on the separate catalogue records reached through Quick search for each exact eBook number; the earlier designation is my comparison of those displayed dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 215,670 | 0 | 80,856 | 0 | 730,240 | 1,645 | 2.1 | 1.4 | 96.7 | 98.1 | 0.00 | 0.30 | Currently visible: Project Gutenberg’s second advanced-search results page, with the original URL and filters retained: Charles Dickens, English, and LoC class PR. Its result list includes #98, *A Tale of Two Cities*. The catalogue records showed: 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 The dates are formatted as YYYY-MM-DD from the records’ displayed dates. The earlier-release comparison is my calculation. Page one, page two, and the separate Quick searches for 98 and 1400 were earlier observations. |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 32,349 | 0 | 19,458 | 0 | 218,752 | 914 | 2.3 | 0.8 | 53.8 | 54.6 | 0.00 | 0.25 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR — Earlier: #98 1400 \| Great Expectations \| 1998-07-01 \| PR I used separate Quick searches for `98` and `1400`, then opened the matching results with those exact eBook IDs. The displayed catalogue records showed release dates Jan 1, 1994 and Jul 1, 1998, respectively. The earlier release is my comparison of those dates. Currently visible: advanced-search results page two, with Author `Charles Dickens`, Language `English`, and LoC Class `PR` retained; the page shows 145 books found and its second-page results. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 25 | 1 | 104,690 | 1 | 98,099 | 0 | 789,248 | 1,503 | 2.0 | 0.7 | 102.7 | 103.4 | 0.00 | 0.32 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: advanced-search results page two, with Charles Dickens, English, and LoC Class PR selected. Page two includes eBook #98, A Tale of Two Cities. The catalogue records were inspected after separate Quick searches for 98 and 1400; their displayed release dates were Jan 1, 1994 and Jul 1, 1998, respectively. The ISO dates and earlier-release comparison above are my conversions and calculation. |
| `longlive-gutenberg-dickens-search` | Mantis | 4 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 32,349 | 0 | 26,465 | 0 | 196,096 | 826 | 2.0 | 0.6 | 43.1 | 43.8 | 0.00 | 0.30 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: advanced-search results page two at the original URL, with Charles Dickens, English, and PR selections retained. I inspected page one and followed its next control; the two catalogue records above were then opened through separate Quick searches for `98` and `1400`. The earlier-release comparison is my calculation from the displayed release dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 4 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 113,137 | 0 | 64,393 | 0 | 852,224 | 1,384 | 2.0 | 0.6 | 91.5 | 92.1 | 0.00 | 0.28 | eBook 98 \| A Tale of Two Cities \| 1994-01-01 \| PR eBook 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 The current page is the second advanced search results page, with the Charles Dickens, English, and PR filters retained. Earlier, I inspected page one and page two, then used separate Quick searches to open the exact #98 and #1400 catalogue records. |
| `longlive-gutenberg-dickens-search` | Mantis | 5 | success | success | success | 1 | n/a | 1200 | 12 | 0 | 32,677 | 0 | 37,033 | 0 | 207,232 | 925 | 2.0 | 0.6 | 49.7 | 50.4 | 0.00 | 0.28 | eBook 98 \| A Tale of Two Cities \| 1994-01-01 \| PR — Earlier: #98 eBook 1400 \| Great Expectations \| 1998-07-01 \| PR Currently visible: the second advanced-search results page, showing 145 books and retaining Charles Dickens, English, and PR. The dates and titles above were observed on the two exact-ID catalogue records; “Earlier” is my comparison of their displayed dates. |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 5 | success | success | success | 1 | n/a | 1200 | 29 | 1 | 289,222 | 0 | 48,870 | 0 | 995,584 | 1,482 | 2.0 | 0.7 | 99.7 | 100.5 | 0.00 | 0.27 | On the page now: the second advanced-search results page, with author Charles Dickens, English, and LoC class PR selected. It shows “A Tale of Two Cities” on page two. The title, release date, and LoC details below were observed earlier on each exact catalogue record; the earlier-release label is my comparison of those displayed dates. 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-dickens-search` | Mantis | 1 | 1 | success | n/a | 1200 | 11 | 219,060 | 54.7 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 21 | 753,977 | 86.7 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 2 | 1 | success | n/a | 1200 | 12 | 247,030 | 57.3 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 25 | 811,096 | 96.7 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | 1 | success | n/a | 1200 | 11 | 238,210 | 53.8 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 25 | 887,347 | 102.7 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 4 | 1 | success | n/a | 1200 | 11 | 222,561 | 43.1 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 4 | 1 | success | n/a | 1200 | 25 | 916,617 | 91.5 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 5 | 1 | success | n/a | 1200 | 12 | 244,265 | 49.7 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 5 | 1 | success | n/a | 1200 | 29 | 1,044,454 | 99.7 | unknown | unknown | known |
