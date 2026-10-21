# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 10 runs in parallel.
- Scope: 25 tasks × 1 approaches × 1 runs = 25 logical runs; 25 recorded so far; 25 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 23 / 25 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 2 |
| Tool calls (including retries) | 141 |
| Sarvam API attempts (including retries) | 347 |
| Sarvam HTTP 429 responses | 190 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 86,577 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | unknown |
| Cache-write input tokens (total) | unknown |
| Cache-read input tokens (total) | unknown |
| Output tokens (total) | unknown |
| Total input tokens incl. cache (legacy) | unknown |
| MCP startup (total, s) | 26.5 |
| CLI startup (total, s) | unknown |
| CLI execution (total, s) | unknown |
| CLI wall (total, s) | unknown |
| Fixture verification (total, s) | 1.8 |
| Cleanup (total, s) | 4.4 |
| Harness capture (total, s) | 13.9 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 4 | 0 | 11 | 6 | 1,011 | 0 | 1,478 | 0 | 8,704 | 255 | 1.5 | 0.0 | 44.5 | 44.5 | 0.03 | 0.15 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 16 | 11 | 977 | 0 | 1,554 | 0 | 8,704 | 236 | 1.5 | 0.0 | 81.0 | 81.0 | 0.03 | 0.23 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 18 | 13 | 700 | 0 | 1,523 | 0 | 8,448 | 206 | 1.5 | 0.0 | 79.6 | 79.6 | 0.01 | 0.20 | The product was added and the page now shows the confirmation message. ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 4 | 0 | 11 | 6 | 1,361 | 0 | 1,854 | 0 | 9,600 | 230 | 1.5 | 0.0 | 53.4 | 53.4 | 0.01 | 0.15 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 7 | 4 | 798 | 0 | 951 | 0 | 4,864 | 133 | 1.5 | 0.0 | 25.5 | 25.5 | 0.01 | 0.18 | The Business plan is $39 per month. ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 1.4 | unknown | unknown | unknown | 0.00 | 0.17 | Sarvam HTTP 429 |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 20 | 13 | 1,103 | 0 | 2,198 | 0 | 13,312 | 497 | 1.5 | 0.0 | 90.4 | 90.4 | 0.05 | 0.17 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `checkout-steps` | Mantis | 1 | success | 1 | 6 | 0 | 19 | 12 | 1,264 | 0 | 2,033 | 0 | 13,312 | 418 | 1.5 | 0.0 | 82.7 | 82.7 | 0.05 | 0.17 | The order was placed successfully. - **Order number:** B2048 - **Total charged:** $31.25 Steps completed: entered name "Noor Ali" and city "Dublin" (Step 1),  |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 13 | 8 | 1,022 | 0 | 1,773 | 0 | 8,960 | 376 | 1.5 | 0.0 | 62.4 | 62.4 | 0.04 | 0.16 | The booking was completed successfully. The confirmation message says: **"Booked for 2026-12-25 at 20:00, 3 guests."** ANSWER: Booked for 2026-12-25 at 20:00, |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 7 | 5 | 4,713 | 0 | 1,477 | 0 | 3,200 | 104 | 1.5 | 0.0 | 24.0 | 24.0 | 0.00 | 0.16 | The article states the harbour light was first lit in **1888**. ANSWER: 1888 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,242 | 0 | 3,072 | 130 | 0.7 | 0.0 | 12.4 | 12.4 | 0.00 | 0.16 | Gadget 30 has SKU **G-4096** with **97** in stock. ANSWER: SKU G-4096, 97 in stock |
| `churned-max` | Mantis | 1 | success | 1 | 3 | 0 | 13 | 9 | 10,897 | 0 | 5,564 | 0 | 11,136 | 786 | 0.7 | 0.0 | 63.8 | 63.8 | 0.01 | 0.16 | The Churned customers and their amounts are: Initech 1 ($7,838), Stark 1 ($4,595), Tyrell 1 ($1,352), Globex 2 ($7,109), Hooli 2 ($3,866), Wonka 2 ($9,623), Acm |
| `search-pagination` | Mantis | 1 | success | 1 | 6 | 0 | 17 | 10 | 2,298 | 0 | 2,534 | 0 | 14,464 | 330 | 0.7 | 0.0 | 82.2 | 82.2 | 0.02 | 0.20 | The result titled "Koala facts" was on page 4 of the search results. Opening it shows it was written by mira.k. ANSWER: mira.k |
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 7 | 2 | 2,047 | 0 | 1,855 | 0 | 9,216 | 240 | 0.8 | 0.0 | 35.7 | 35.7 | 0.15 | 0.23 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 10 | 6 | 694 | 0 | 1,185 | 0 | 6,656 | 192 | 0.7 | 0.0 | 44.3 | 44.3 | 0.01 | 0.23 | The file was deleted and the confirmation message shown was: **"Quarterly draft was moved to trash."** ANSWER: Quarterly draft was moved to trash. |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 18 | 11 | 1,023 | 0 | 2,233 | 0 | 12,544 | 297 | 0.8 | 0.0 | 79.1 | 79.1 | 0.03 | 0.17 | The confirmation shown is: **"Theme saved: Midnight"** ANSWER: Theme saved: Midnight |
| `spa-team` | Mantis | 1 | success | 1 | 4 | 0 | 12 | 7 | 1,023 | 0 | 1,680 | 0 | 8,576 | 245 | 0.7 | 0.0 | 48.1 | 48.1 | 0.01 | 0.16 | The designer in the Team section is Priya Shah, and her email is priya@example.test. ANSWER: priya@example.test |
| `plans-pick` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 0.8 | unknown | unknown | unknown | 0.00 | 0.18 | Sarvam HTTP 429 |
| `faq-refund` | Mantis | 1 | success | 1 | 2 | 0 | 9 | 6 | 549 | 0 | 840 | 0 | 4,864 | 128 | 0.9 | 0.0 | 37.9 | 37.9 | 0.01 | 0.23 | ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 15 | 10 | 1,156 | 0 | 1,686 | 0 | 9,088 | 305 | 0.9 | 0.0 | 59.8 | 59.8 | 0.04 | 0.17 | The payment was approved and the receipt number is R-8064. ANSWER: R-8064 |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 7 | 4 | 320 | 0 | 908 | 0 | 4,736 | 159 | 0.7 | 0.0 | 23.4 | 23.4 | 0.00 | 0.16 | The chart shows monthly sales for the first half of the year. The March bar is labeled **57** units. ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 20 | 0 | 34 | 13 | 6,946 | 0 | 8,275 | 0 | 78,848 | 1,684 | 0.8 | 0.0 | 104.5 | 104.5 | 0.25 | 0.14 | Order placed successfully. - Order number: **S-5856** - Total charged: **$101.29** Details verified: cart contained exactly 2 Summit Flask ($14.00 ea), 1 Harb |
| `long-admin` | Mantis | 1 | success | 1 | 21 | 0 | 35 | 16 | 24,884 | 0 | 15,642 | 0 | 148,992 | 3,911 | 0.8 | 0.0 | 117.3 | 117.3 | 0.61 | 0.15 | The save was successful. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** All six requested changes were applied and verified (Inez C |
| `long-onboard` | Mantis | 1 | success | 1 | 20 | 0 | 34 | 13 | 6,663 | 0 | 7,648 | 0 | 72,704 | 1,290 | 0.9 | 0.0 | 94.0 | 94.0 | 0.47 | 0.14 | The workspace was created successfully with all the specified details: - Company: Aster Works, 51–200 employees, Germany, VAT DE123456789 - Admin: Nora Bell (no |
| `long-laptops` | Mantis | 1 | success | 1 | 10 | 0 | 12 | 5 | 13,682 | 0 | 7,540 | 0 | 26,368 | 1,600 | 0.7 | 0.0 | 53.0 | 53.0 | 0.02 | 0.19 | I've now checked all 7 laptops under $1,000: \| Model \| Price \| Battery (video) \| Weight \| \|---\|---\|---\|---\| \| Aero 13 \| $899 \| 11 h \| 1.20 kg \| \| Bolt 14 \| $74 |
