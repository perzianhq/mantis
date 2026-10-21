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
| Correct | 25 / 25 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 150 |
| Sarvam API attempts (including retries) | 166 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 91,377 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 76,073 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 454,528 |
| Output tokens (total) | 12,751 |
| Total input tokens incl. cache (legacy) | 530,601 |
| MCP startup (total, s) | 26.3 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 2378.1 |
| CLI wall (total, s) | 2378.1 |
| Fixture verification (total, s) | 1.7 |
| Cleanup (total, s) | 4.4 |
| Harness capture (total, s) | 29.2 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 3.47 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,472 | 0 | 8,832 | 300 | 1.4 | 0.0 | 85.5 | 85.5 | 0.03 | 0.16 | The form was submitted with Country = Ireland and the weekly newsletter checkbox checked. The page shows the confirmation message: "Subscribed from Ireland (we |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,591 | 0 | 8,704 | 253 | 1.4 | 0.0 | 76.0 | 76.0 | 0.03 | 0.15 | Signed in successfully. The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,552 | 0 | 8,448 | 238 | 1.4 | 0.0 | 81.8 | 81.8 | 0.01 | 0.19 | The product was added after accepting the cookie dialog, and the page confirmed it with the message **"Cart updated (1 item)."** ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,419 | 0 | 2,031 | 0 | 12,032 | 300 | 1.5 | 0.0 | 98.5 | 98.5 | 0.01 | 0.18 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,165 | 0 | 1,374 | 0 | 6,784 | 199 | 1.5 | 0.0 | 68.7 | 68.7 | 0.00 | 0.18 | The pricing page shows the Business plan at **$39 per month**. ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,335 | 0 | 10,880 | 233 | 1.5 | 0.0 | 68.2 | 68.2 | 0.01 | 0.20 | The "Last updated" line now reads **"Last updated: just now"** (it was "10:00" before the refresh). Nova 3's amount is **$5,314**. ANSWER: Last updated: just  |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,146 | 0 | 2,189 | 0 | 13,568 | 557 | 1.5 | 0.0 | 131.9 | 131.9 | 0.07 | 0.18 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `checkout-steps` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,264 | 0 | 2,012 | 0 | 13,312 | 417 | 1.5 | 0.0 | 127.7 | 127.7 | 0.06 | 0.19 | The order was completed successfully. - **Order number:** B2048 - **Total charged:** $31.25 Steps taken: entered "Noor Ali" with city "Dublin" (Step 1: Shippi |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,699 | 0 | 8,960 | 347 | 1.5 | 0.0 | 89.1 | 89.1 | 0.04 | 0.19 | The booking was successful. The confirmation message reads: "Booked for 2026-12-25 at 20:00, 3 guests." ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,605 | 0 | 3,072 | 108 | 1.5 | 0.0 | 16.8 | 16.8 | 0.00 | 0.17 | The article states the harbour light was finally lit for the first time in **1888**. ANSWER: 1888 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,242 | 0 | 3,072 | 130 | 0.7 | 0.0 | 51.5 | 51.5 | 0.00 | 0.19 | Gadget 30 has SKU **G-4096** and **97** in stock. ANSWER: SKU G-4096, 97 in stock |
| `churned-max` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 6,154 | 0 | 3,981 | 0 | 15,232 | 785 | 0.8 | 0.0 | 100.2 | 100.2 | 0.03 | 0.19 | The list contains 20 Churned customers. The highest amount among them is Vertex 6 at $9,900. ANSWER: Vertex 6 — $9,900 |
| `search-pagination` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,646 | 0 | 14,336 | 324 | 0.8 | 0.0 | 133.7 | 133.7 | 0.01 | 0.17 | The result "Koala facts" was on page 4, and its content shows it was written by mira.k. ANSWER: mira.k. |
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,851 | 0 | 9,216 | 238 | 0.7 | 0.0 | 96.7 | 96.7 | 0.08 | 0.17 | ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,181 | 0 | 6,656 | 201 | 0.7 | 0.0 | 79.7 | 79.7 | 0.01 | 0.20 | The file "Quarterly draft" was deleted. After confirming the delete dialog, the confirmation message shown was: **"Quarterly draft was moved to trash."** ANSW |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,225 | 0 | 12,544 | 302 | 0.8 | 0.0 | 129.3 | 129.3 | 0.03 | 0.14 | The Account menu → Settings page was opened, the theme was switched to Midnight, and Save was clicked. The confirmation shown was: ANSWER: Theme saved: Midnigh |
| `spa-team` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,565 | 0 | 8,704 | 245 | 0.8 | 0.0 | 98.9 | 98.9 | 0.01 | 0.18 | The designer is Priya Shah, and her email address is priya@example.test. ANSWER: priya@example.test |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,253 | 0 | 6,528 | 172 | 0.8 | 0.0 | 69.5 | 69.5 | 0.01 | 0.17 | I selected the Business plan and received the confirmation message. ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 853 | 0 | 4,864 | 154 | 0.8 | 0.0 | 62.4 | 62.4 | 0.01 | 0.18 | The reimbursement policy section is now expanded and states the answer. ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,696 | 0 | 9,088 | 310 | 0.8 | 0.0 | 84.7 | 84.7 | 0.03 | 0.16 | The payment was approved successfully. ANSWER: R-8064 |
| `chart-march` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 461 | 0 | 1,256 | 0 | 6,528 | 293 | 0.8 | 0.0 | 78.2 | 78.2 | 0.00 | 0.18 | The chart is a Chart.js bar chart titled "Monthly sales, first half of the year." The extracted values are: - Jan: 18 - Feb: 25 - **Mar: 57** - Apr: 31 - May:  |
| `long-shop` | Mantis | 1 | success | 1 | 23 | 0 | 24 | 0 | 8,103 | 0 | 9,915 | 0 | 100,608 | 2,153 | 0.8 | 0.0 | 173.6 | 173.6 | 0.26 | 0.14 | The order was placed successfully. Summary of what I did: - Added 2× Summit Flask ($14.00 each), 1× Harbor Satchel ($22.50), 3× Cedar Wrap ($8.50 each), and 1× |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,807 | 0 | 53,504 | 1,624 | 0.8 | 0.0 | 117.8 | 117.8 | 0.45 | 0.17 | All changes are confirmed saved. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Summary of what I changed (and nothing else): - Ine |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 22 | 0 | 7,458 | 0 | 8,067 | 0 | 77,056 | 1,394 | 0.8 | 0.0 | 158.6 | 158.6 | 0.48 | 0.15 | The workspace was created successfully with all the specified details: Aster Works (51–200 employees, Germany, VAT DE123456789), admin Nora Bell, Growth plan bi |
| `long-laptops` | Mantis | 1 | success | 1 | 11 | 0 | 8 | 0 | 13,750 | 0 | 7,675 | 0 | 32,000 | 1,474 | 0.8 | 0.0 | 99.3 | 99.3 | 0.03 | 0.19 | I've gathered all the data. Here are the laptops under $1,000 with their battery life (video playback) and weight: \| Laptop \| Price \| Battery life \| Weight \| \| |
