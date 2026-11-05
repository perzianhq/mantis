# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-05; runs per task and approach: 1; 12 runs in parallel.
- Scope: 8 tasks × 3 approaches × 1 runs = 24 logical runs; 24 recorded so far; 24 total attempts including retries.
- Codex runtime: codex-cli 0.166.0-alpha.6; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| First-pass correct (attempt 1) | 8 / 8 | 8 / 8 | 8 / 8 |
| After reruns / merged correct | 8 / 8 | 8 / 8 | 8 / 8 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 8 / 8 | 8 / 8 | 8 / 8 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 49 | 81 | 99 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 74,909 | 200,006 | 1,848 |
| Browser observation images (observed blocks) | 2 | 3 | 46 |
| Normal input tokens (total) | 259,293 | 198,481 | 261,834 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 767,360 | 779,904 | 1,583,872 |
| Output tokens (total) | 3,885 | 3,714 | 8,298 |
| Total input tokens incl. cache (legacy) | 1,026,653 | 978,385 | 1,845,706 |
| MCP startup (total, s) | 16.8 | 16.8 | 16.8 |
| CLI startup (total, s) | 7.3 | 6.9 | 6.2 |
| CLI execution (total, s) | 259.3 | 311.3 | 396.0 |
| CLI wall (total, s) | 266.6 | 318.2 | 402.2 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 1.6 | 1.6 | 1.4 |
| Harness capture (total, s) | 3.5 | 58.5 | 5.5 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `visuallive-books-one-star` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 12,079 | 1 | 62,134 | 0 | 83,456 | 679 | 2.1 | 1.2 | 36.3 | 37.5 | 0.00 | 0.19 | The one-star book is **Friday Night Lights: A Town, a Team, and a Dream**. The Sports and Games category page is currently visible. Its results show the book title and one filled star; the other books shown have different ratings. I identified the star visually from the current page. |
| `visuallive-books-one-star` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 10 | 0 | 71,540 | 1 | 36,555 | 0 | 246,912 | 639 | 2.1 | 1.1 | 48.3 | 49.4 | 0.00 | 0.19 | The book with a one-star rating is **Sugar Rush (Offensive Line #2)**. The current page shows its title and one highlighted star; this is the site’s displayed rating. Earlier, I observed it among the five books in the Sports and Games category. |
| `visuallive-books-one-star` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 101 | 3 | 26,179 | 0 | 63,744 | 601 | 2.2 | 1.1 | 33.4 | 34.5 | 0.00 | 0.22 | The one-star book is **Sugar Rush (Offensive Line #2) (The Ivy Years #3)**. The Sports and Games page currently shows that title with one filled star out of five, among five results. Earlier, the page showed the category listing before I scrolled down to reveal the full title and its rating. |
| `visuallive-books-five-star-page` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 9 | 0 | 33,641 | 0 | 40,342 | 0 | 192,768 | 786 | 2.2 | 1.1 | 59.1 | 60.2 | 0.00 | 0.21 | I reached **Page 4 of 50**, showing books 61–80. The page’s current text view displays the titles, but not the star ratings, so I can’t reliably identify which titles are rated five stars from the evidence available. Currently visible: the Page 4 catalogue listing at https://books.toscrape.com/catalogue/page-4.html. I also briefly opened the first book’s detail page and returned; that earlier observation did not show its rating. |
| `visuallive-books-five-star-page` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 66,266 | 0 | 45,922 | 0 | 58,368 | 596 | 2.2 | 1.3 | 38.4 | 39.6 | 0.00 | 0.27 | The page 4 listing shows these five-star titles: - The Nameless City (The Nameless City #1) - The Murder That Never Was (Forensic Instincts #5) - The Most Perfect Thing: Inside (and Outside) a Bird's Egg - The Mindfulness and Acceptance Workbook for Anxiety: A Guide to Breaking Free from Anxiety, Phobias, and Worry Using Acceptance and Commitment Therapy - The Life-Changing Magic of Tidying Up: The Japanese Art of Decluttering and Organizing - The Inefficiency Assassin: Time Management Tactics for Working Smarter, Not Longer - The Gutsy Girl: Escapades for Your Life of Epic Adventure - The Electric Pencil: Drawings from Inside State Hospital No. 3 - The Death of Humanity: and the Case for Life - The Bulletproof Diet: Lose up to a Pound a Day, Reclaim Energy and Focus, Upgrade Your Life - The Art Forger - The Age of Genius: The Seventeenth Century and the Birth of the Modern Mind - The Activist's Tao Te Ching: Ancient Advice for a Modern Revolution - Spark Joy: An Illustrated Master Class on the Art of Organizing and Tidying Up - Soul Reader - Security - Saga, Volume 6 (Saga (Collected Editions) #6) - Saga, Volume 5 (Saga (Collected Editions) #5) - Reskilling America: Learning to Labor in the Twenty-First Century - Rat Queens, Vol. 3: Demons (Rat Queens (Collected Editions) #11-15) Currently visible: the catalogue’s “Page 4 of 50” listing, showing results 61–80. The titles above are taken from that page’s five-star ratings. |
| `visuallive-books-five-star-page` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 18 | 0 | 385 | 8 | 54,101 | 0 | 236,160 | 1,788 | 2.2 | 1.2 | 73.6 | 74.9 | 0.00 | 0.17 | The five-star titles on page 4 are: - The Inefficiency Assassin: Time Management Tactics for Working Smarter, Not Longer - The Activist's Tao Te Ching: Ancient Advice for a Modern Revolution The listing showed “Page 4 of 50” and the five-star ratings. I opened each book to confirm its full title, then returned to the catalogue page. The page currently visible is the page 4 listing; the full titles were visible on the product pages during those earlier observations. |
| `visuallive-oscars-ajax-winner` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 1,747 | 0 | 13,247 | 0 | 32,768 | 175 | 2.2 | 1.3 | 20.2 | 21.4 | 0.00 | 0.21 | Spotlight |
| `visuallive-oscars-ajax-winner` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 9,188 | 0 | 28,607 | 0 | 44,672 | 234 | 2.2 | 1.3 | 28.2 | 29.4 | 0.00 | 0.20 | Spotlight |
| `visuallive-oscars-ajax-winner` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 106 | 2 | 24,565 | 0 | 51,072 | 425 | 2.2 | 1.2 | 27.4 | 28.6 | 0.00 | 0.22 | Spotlight |
| `visuallive-quotes-infinite-scroll` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 11 | 0 | 17,177 | 0 | 36,813 | 0 | 172,928 | 681 | 2.2 | 1.3 | 37.3 | 38.6 | 0.00 | 0.21 | I scrolled through the infinite feed to its current bottom. The page shows quotes through Allen Saunders, but J.R.R. Tolkien does not appear in the loaded content, so I can’t report tags from the site. The current page remains at `https://quotes.toscrape.com/scroll`; no sign-in, purchase, or personal-information prompt is open. |
| `visuallive-quotes-infinite-scroll` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 46 | 0 | 35,247 | 0 | 39,094 | 0 | 175,232 | 809 | 2.2 | 1.2 | 90.2 | 91.4 | 0.00 | 0.17 | The J.R.R. Tolkien quote’s tags are: **bilbo, journey, lost, quest, travel, wander**. The page currently shows the quote “Not all those who wander are lost,” its author, and the site-provided tags. I did not log in or enter personal information. |
| `visuallive-quotes-infinite-scroll` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 40 | 0 | 750 | 20 | 68,699 | 0 | 797,952 | 2,748 | 2.2 | 1.1 | 118.3 | 119.4 | 0.00 | 0.13 | J.R.R. Tolkien’s quote is tagged: bilbo, journey, lost, quest, travel, wander. The current page view shows the Tolkien quote and all six site-listed tags. Earlier views showed other quotes as I scrolled down; I did not estimate or infer the tags. |
| `visuallive-quotes-delayed` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 8 | 0 | 2,065 | 0 | 29,985 | 0 | 112,128 | 539 | 2.0 | 0.5 | 47.9 | 48.4 | 0.00 | 0.16 | The first quote on page 3 is by **Pablo Neruda**. The page currently shows the quote beginning “I love you without knowing how, or when, or from where” and its author attribution, “by Pablo Neruda.” |
| `visuallive-quotes-delayed` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 4,412 | 0 | 16,987 | 0 | 92,672 | 404 | 2.0 | 0.5 | 30.7 | 31.2 | 0.00 | 0.23 | The current page is `https://quotes.toscrape.com/js-delayed/page/3/`, but it displays only the site header, Login link, Previous/Next navigation, and footer. No quotes or author are visible, so I can’t report the first quote’s author from the page evidence. |
| `visuallive-quotes-delayed` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 21 | 0 | 331 | 9 | 59,573 | 0 | 286,336 | 1,592 | 2.0 | 0.4 | 85.8 | 86.2 | 0.00 | 0.13 | The first quote on page 3 is by **Pablo Neruda**. The page currently shows that quote and author at the top; I reached it by advancing from the starting page through pages 2 and 3. |
| `visuallive-dynamic-loading` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 392 | 0 | 22,266 | 0 | 36,224 | 230 | 2.0 | 1.0 | 16.8 | 17.8 | 0.00 | 0.21 | After clicking **Start**, the page displayed **“Hello World!”** The current page shows that result. |
| `visuallive-dynamic-loading` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 3,119 | 0 | 6,520 | 0 | 76,288 | 278 | 2.0 | 0.8 | 41.5 | 42.2 | 0.00 | 0.17 | After clicking **Start**, the page displayed **“Hello World!”**. That is the current site-generated result visible on the page. |
| `visuallive-dynamic-loading` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 105 | 2 | 7,632 | 0 | 66,688 | 452 | 2.0 | 0.4 | 26.5 | 26.9 | 0.00 | 0.19 | After clicking **Start**, the page displayed **Hello World!**. It is currently visible as the generated result. |
| `visuallive-xkcd-iso-date` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 4,583 | 0 | 30,076 | 0 | 58,496 | 368 | 2.0 | 0.4 | 18.7 | 19.1 | 0.00 | 0.19 | The comic identifies `2013-02-27` as the correct numeric date format example. I left the comic open at https://xkcd.com/1179/. The current page shows the “ISO 8601” comic; the date was read from the comic image via OCR. No sign-in, purchase, or personal-information prompt appeared. |
| `visuallive-xkcd-iso-date` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 9,458 | 1 | 14,197 | 0 | 50,432 | 390 | 2.0 | 0.4 | 17.7 | 18.1 | 0.00 | 0.22 | The comic shows `2013-02-27` as the correct numeric date format. The page is currently displaying the comic image, including the date and the surrounding text about ISO’s numeric date format. This is the page evidence; `2013-02-27` is the date read from the image. |
| `visuallive-xkcd-iso-date` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 35 | 1 | 7,810 | 0 | 43,392 | 300 | 2.0 | 0.4 | 12.3 | 12.7 | 0.00 | 0.21 | The comic shows `2013-02-27` as the correct numeric date format. The page is currently displaying the comic image as evidence; that date is read from the image, not calculated. |
| `visuallive-xkcd-worth-time` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 3,225 | 1 | 24,430 | 0 | 78,592 | 427 | 2.0 | 0.7 | 23.1 | 23.7 | 0.00 | 0.16 | **2 hours.** The comic’s chart shows **5 seconds** saved per task and **daily** frequency intersecting at **2 hours**. Currently visible: the xkcd comic image with the chart, including those row and column labels. No inputs or site generated results beyond the chart were involved; I read the chart directly. |
| `visuallive-xkcd-worth-time` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 776 | 1 | 10,599 | 0 | 35,328 | 364 | 2.0 | 0.4 | 16.3 | 16.8 | 0.00 | 0.18 | The chart gives **2 hours** for a task done **daily** that you make **5 seconds** shorter, across five years. The comic is currently visible in the browser, with the chart showing the “5 seconds” row and “daily” column. The **2 hours** is the chart’s result, not my own estimate. |
| `visuallive-xkcd-worth-time` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 35 | 1 | 13,275 | 0 | 38,528 | 392 | 2.0 | 0.4 | 18.7 | 19.1 | 0.00 | 0.14 | **2 hours.** For a task done daily, the comic’s chart shows **2 hours** as the maximum time to spend making it **5 seconds shorter** over five years. The comic is currently visible at **https://xkcd.com/1205/**. The chart’s relevant inputs are **5 seconds saved** and **daily** frequency; its cell shows **2 hours**. This is the chart’s result, not my own estimate. |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `visuallive-books-one-star` | Mantis | 1 | 1 | success | n/a | 600 | 7 | 145,590 | 36.3 | unknown | unknown | known |
| `visuallive-books-one-star` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 10 | 283,467 | 48.3 | unknown | unknown | known |
| `visuallive-books-one-star` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 6 | 89,923 | 33.4 | unknown | unknown | known |
| `visuallive-books-five-star-page` | Mantis | 1 | 1 | success | n/a | 600 | 9 | 233,110 | 59.1 | unknown | unknown | known |
| `visuallive-books-five-star-page` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 4 | 104,290 | 38.4 | unknown | unknown | known |
| `visuallive-books-five-star-page` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 18 | 290,261 | 73.6 | unknown | unknown | known |
| `visuallive-oscars-ajax-winner` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 46,015 | 20.2 | unknown | unknown | known |
| `visuallive-oscars-ajax-winner` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 4 | 73,279 | 28.2 | unknown | unknown | known |
| `visuallive-oscars-ajax-winner` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 5 | 75,637 | 27.4 | unknown | unknown | known |
| `visuallive-quotes-infinite-scroll` | Mantis | 1 | 1 | success | n/a | 600 | 11 | 209,741 | 37.3 | unknown | unknown | known |
| `visuallive-quotes-infinite-scroll` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 46 | 214,326 | 90.2 | unknown | unknown | known |
| `visuallive-quotes-infinite-scroll` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 40 | 866,651 | 118.3 | unknown | unknown | known |
| `visuallive-quotes-delayed` | Mantis | 1 | 1 | success | n/a | 600 | 8 | 142,113 | 47.9 | unknown | unknown | known |
| `visuallive-quotes-delayed` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 7 | 109,659 | 30.7 | unknown | unknown | known |
| `visuallive-quotes-delayed` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 21 | 345,909 | 85.8 | unknown | unknown | known |
| `visuallive-dynamic-loading` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 58,490 | 16.8 | unknown | unknown | known |
| `visuallive-dynamic-loading` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 5 | 82,808 | 41.5 | unknown | unknown | known |
| `visuallive-dynamic-loading` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 5 | 74,320 | 26.5 | unknown | unknown | known |
| `visuallive-xkcd-iso-date` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 88,572 | 18.7 | unknown | unknown | known |
| `visuallive-xkcd-iso-date` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 3 | 64,629 | 17.7 | unknown | unknown | known |
| `visuallive-xkcd-iso-date` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 51,202 | 12.3 | unknown | unknown | known |
| `visuallive-xkcd-worth-time` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 103,022 | 23.1 | unknown | unknown | known |
| `visuallive-xkcd-worth-time` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 2 | 45,927 | 16.3 | unknown | unknown | known |
| `visuallive-xkcd-worth-time` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 51,803 | 18.7 | unknown | unknown | known |
