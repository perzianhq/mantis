# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-05; runs per task and approach: 1; 8 runs in parallel.
- Scope: 8 tasks × 1 approaches × 1 runs = 8 logical runs; 8 recorded so far; 8 total attempts including retries.
- Codex runtime: codex-cli 0.166.0-alpha.6; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 8 / 8 |
| After reruns / merged correct | 8 / 8 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 8 / 8 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 30 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 36,313 |
| Browser observation images (observed blocks) | 1 |
| Normal input tokens (total) | 155,421 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 517,248 |
| Output tokens (total) | 2,716 |
| Total input tokens incl. cache (legacy) | 672,669 |
| MCP startup (total, s) | 16.8 |
| CLI startup (total, s) | 6.7 |
| CLI execution (total, s) | 195.6 |
| CLI wall (total, s) | 202.2 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 1.2 |
| Harness capture (total, s) | 1.9 |
| Cost estimate (USD; including retries) | unknown |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `visuallive-books-one-star` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,910 | 0 | 15,923 | 0 | 46,208 | 251 | 2.1 | 0.9 | 13.6 | 14.5 | 0.00 | 0.19 | The Sports and Games page currently shows five books. The one-star book is **Sugar Rush (Offensive Line #2)**. The page shows its full title, “rating 1 of 5,” and price £24.42. |
| `visuallive-books-five-star-page` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,435 | 0 | 9,650 | 0 | 53,504 | 283 | 2.1 | 0.8 | 15.2 | 16.1 | 0.00 | 0.15 | The currently visible listing is **Page 4 of 50** (books 61–80). Its five-star titles are: - The Inefficiency Assassin: Time Management Tactics for Working Smarter, Not Longer - The Activist's Tao Te Ching: Ancient Advice for a Modern Revolution These titles and ratings are shown in the current page observation. I opened the page directly; I did not use any sign-in or purchase flow. |
| `visuallive-oscars-ajax-winner` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 1,747 | 0 | 13,465 | 0 | 42,496 | 223 | 2.1 | 0.9 | 14.1 | 14.9 | 0.00 | 0.19 | Spotlight The page currently shows the 2015 film results, with “Best Picture” marked for Spotlight. |
| `visuallive-quotes-infinite-scroll` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 2,965 | 0 | 15,255 | 0 | 58,368 | 332 | 2.1 | 0.8 | 20.7 | 21.5 | 0.00 | 0.14 | The J.R.R. Tolkien quote is “Not all those who wander are lost.” Its tags are: **bilbo, journey, lost, quest, travel, wander**. The page is currently showing the quote, author, and tags as evidence. Earlier, the page search found the quote after loading more of the infinite scroll feed. |
| `visuallive-quotes-delayed` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 9 | 0 | 9,056 | 0 | 24,561 | 0 | 129,792 | 506 | 2.1 | 0.9 | 50.2 | 51.1 | 0.00 | 0.15 | The first quote on page 3 is by **Pablo Neruda**. The page currently shows his quote, “I love you without knowing how, or when, or from where…” and the author attribution “by Pablo Neruda.” This is the site’s current result on page 3. |
| `visuallive-dynamic-loading` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 392 | 0 | 6,840 | 0 | 64,640 | 270 | 2.1 | 0.8 | 28.4 | 29.2 | 0.00 | 0.13 | The page-generated text is **“Hello World!”**. It is currently visible on the page after clicking Start; the earlier “Loading...” message has disappeared. |
| `visuallive-xkcd-iso-date` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 4,663 | 0 | 39,447 | 0 | 49,408 | 460 | 2.1 | 0.8 | 26.5 | 27.3 | 0.00 | 0.14 | The date written as the correct numeric format in the comic is **2013-02-27**. The current page is the xkcd “ISO 8601” comic; OCR of its image shows “THIS IS THE CORRECT WAY TO WRITE NUMERIC DATES: 2013-02-27.” That is the site image evidence, not a date I calculated. |
| `visuallive-xkcd-worth-time` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 3,145 | 1 | 30,280 | 0 | 72,832 | 391 | 2.1 | 0.8 | 26.9 | 27.7 | 0.00 | 0.15 | The chart shows **2 hours** for a task done daily that you make 5 seconds shorter. Currently visible: the xkcd comic at https://xkcd.com/1205/, including the chart’s “5 seconds” row and “daily” column. That is the page evidence; I did not use a site-generated calculation result. |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `visuallive-books-one-star` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 62,131 | 13.6 | unknown | unknown | known |
| `visuallive-books-five-star-page` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 63,154 | 15.2 | unknown | unknown | known |
| `visuallive-oscars-ajax-winner` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 55,961 | 14.1 | unknown | unknown | known |
| `visuallive-quotes-infinite-scroll` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 73,623 | 20.7 | unknown | unknown | known |
| `visuallive-quotes-delayed` | Mantis | 1 | 1 | success | n/a | 600 | 9 | 154,353 | 50.2 | unknown | unknown | known |
| `visuallive-dynamic-loading` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 71,480 | 28.4 | unknown | unknown | known |
| `visuallive-xkcd-iso-date` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 88,855 | 26.5 | unknown | unknown | known |
| `visuallive-xkcd-worth-time` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 103,112 | 26.9 | unknown | unknown | known |
