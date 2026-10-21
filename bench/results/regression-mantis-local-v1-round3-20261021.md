# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 3; 10 runs in parallel.
- Scope: 25 tasks × 1 approaches × 3 runs = 75 logical runs; 75 recorded so far; 75 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 74 / 75 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 1 |
| Tool calls (including retries) | 448 |
| Sarvam API attempts (including retries) | 501 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1188.6 |
| Sarvam limiter queue / cooldown (total, s) | 4190.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 878.3 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 1 |
| Browser observation text (observed chars) | 291,531 |
| Browser observation images (observed blocks) | 2 |
| Normal input tokens (total) | 234,770 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,384,448 |
| Output tokens (total) | 31,851 |
| Total input tokens incl. cache (legacy) | 1,619,218 |
| MCP startup (total, s) | 190.4 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 5378.7 |
| CLI wall (total, s) | 5378.7 |
| Fixture verification (total, s) | 13.4 |
| Cleanup (total, s) | 29.0 |
| Harness capture (total, s) | 69.7 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 9.91 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,610 | 0 | 8,448 | 249 | 3.7 | 0.0 | 7.9 | 7.9 | 0.08 | 0.41 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,482 | 0 | 8,576 | 249 | 4.0 | 0.0 | 13.4 | 13.4 | 0.07 | 0.40 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,610 | 0 | 8,448 | 249 | 4.0 | 0.0 | 9.6 | 9.6 | 0.07 | 0.41 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,744 | 0 | 8,320 | 212 | 4.0 | 0.0 | 9.1 | 9.1 | 0.06 | 0.38 | ANSWER: Welcome back |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,740 | 0 | 8,320 | 211 | 4.0 | 0.0 | 11.7 | 11.7 | 0.11 | 0.52 | ANSWER: Welcome back |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,760 | 0 | 8,320 | 228 | 4.0 | 0.0 | 8.1 | 8.1 | 0.07 | 0.41 | ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,361 | 0 | 8,448 | 202 | 4.2 | 0.0 | 61.1 | 61.1 | 0.02 | 0.31 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,474 | 0 | 8,320 | 197 | 4.2 | 0.0 | 9.8 | 9.8 | 0.03 | 0.43 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,485 | 0 | 8,320 | 199 | 4.2 | 0.0 | 10.7 | 10.7 | 0.03 | 0.37 | ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,382 | 0 | 1,856 | 0 | 9,472 | 267 | 4.2 | 0.0 | 60.5 | 60.5 | 0.03 | 0.49 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,361 | 0 | 1,661 | 0 | 9,600 | 216 | 2.5 | 0.0 | 58.3 | 58.3 | 0.03 | 0.38 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,382 | 0 | 1,681 | 0 | 9,600 | 229 | 2.2 | 0.0 | 55.6 | 55.6 | 0.03 | 0.40 | ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 969 | 0 | 4,736 | 140 | 2.8 | 0.0 | 55.2 | 55.2 | 0.02 | 0.39 | The Business plan price is displayed on the pricing page. ANSWER: $39 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 1,093 | 0 | 4,608 | 134 | 2.5 | 0.0 | 54.3 | 54.3 | 0.03 | 0.34 | ANSWER: $39 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 969 | 0 | 4,736 | 141 | 2.5 | 0.0 | 54.2 | 54.2 | 0.01 | 0.34 | The Business plan price is displayed as "$39 per month". ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,373 | 0 | 10,752 | 238 | 2.6 | 0.0 | 55.6 | 55.6 | 0.01 | 0.39 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,231 | 0 | 10,880 | 212 | 2.3 | 0.0 | 53.4 | 53.4 | 0.02 | 0.37 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,222 | 0 | 10,880 | 236 | 2.1 | 0.0 | 54.0 | 54.0 | 0.01 | 0.35 | The refresh is done and verified. "Last updated" now reads "just now", and Nova 3's amount is $5,314. ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,290 | 0 | 12,928 | 444 | 2.9 | 0.0 | 63.9 | 63.9 | 0.12 | 0.35 | ANSWER: The first attempt failed with "Password must be at least 8 characters."; after retrying with strongpass456, the page says "Welcome, hello@example.test"  |
| `signup-validation` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,510 | 0 | 2,495 | 0 | 15,616 | 471 | 3.0 | 0.0 | 62.9 | 62.9 | 0.12 | 0.36 | ANSWER: The first attempt failed with the error "Password must be at least 8 characters." After retrying with password strongpass456, the page says "Welcome, he |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,146 | 0 | 2,116 | 0 | 13,184 | 447 | 2.0 | 0.0 | 64.4 | 64.4 | 0.23 | 0.34 | ANSWER: The first attempt failed with "Password must be at least 8 characters."; after retrying with strongpass456, the page says "Welcome, hello@example.test"  |
| `checkout-steps` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,264 | 0 | 2,258 | 0 | 12,800 | 333 | 2.1 | 0.0 | 62.0 | 62.0 | 0.14 | 0.36 | ANSWER: Order #B2048, total charged: $31.25 |
| `checkout-steps` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,264 | 0 | 2,023 | 0 | 13,056 | 347 | 2.8 | 0.0 | 61.6 | 61.6 | 0.15 | 0.34 | ANSWER: Order #B2048, total charged $31.25. |
| `checkout-steps` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,435 | 0 | 2,531 | 0 | 15,232 | 364 | 2.4 | 0.0 | 63.4 | 63.4 | 0.14 | 0.44 | ANSWER: Order #B2048, total charged $31.25 |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,833 | 0 | 8,704 | 338 | 2.3 | 0.0 | 59.6 | 59.6 | 0.09 | 0.36 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 975 | 0 | 1,747 | 0 | 8,960 | 374 | 2.3 | 0.0 | 57.5 | 57.5 | 0.08 | 0.37 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 3 | success | 1 | 6 | 0 | 6 | 0 | 1,356 | 0 | 2,257 | 0 | 11,136 | 424 | 2.8 | 0.0 | 57.0 | 57.0 | 0.10 | 0.35 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,661 | 0 | 2,944 | 113 | 2.7 | 0.0 | 52.5 | 52.5 | 0.01 | 0.46 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 143 | 2.0 | 0.0 | 6.3 | 6.3 | 0.01 | 0.37 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 97 | 2.1 | 0.0 | 51.2 | 51.2 | 0.01 | 0.35 | ANSWER: 1888 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 3 | 1 | 4 | 0 | 1,579 | 0 | 1,945 | 0 | 7,680 | 288 | 2.2 | 0.0 | 55.6 | 55.6 | 0.01 | 0.38 | ANSWER: Gadget 30 has SKU G-4096 and 97 in stock. |
| `inventory-lookup` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,166 | 0 | 3,072 | 139 | 2.8 | 0.0 | 49.8 | 49.8 | 0.01 | 0.52 | ANSWER: Gadget 30 — SKU: G-4096, In stock: 97 |
| `inventory-lookup` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,166 | 0 | 3,072 | 116 | 2.3 | 0.0 | 49.3 | 49.3 | 0.01 | 0.43 | ANSWER: Gadget 30 — SKU: G-4096, In stock: 97 |
| `churned-max` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 11,594 | 0 | 6,407 | 0 | 15,360 | 917 | 2.2 | 0.0 | 60.1 | 60.1 | 0.10 | 0.35 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 11,792 | 0 | 5,888 | 0 | 11,008 | 672 | 3.0 | 0.0 | 57.6 | 57.6 | 0.08 | 0.33 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 6,120 | 0 | 3,702 | 0 | 11,136 | 660 | 2.4 | 0.0 | 59.1 | 59.1 | 0.09 | 0.37 | ANSWER: Vertex 6 — $9,900 |
| `search-pagination` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,201 | 0 | 11,520 | 262 | 2.3 | 0.0 | 57.4 | 57.4 | 0.04 | 0.39 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,200 | 0 | 11,520 | 258 | 2.2 | 0.0 | 58.6 | 58.6 | 0.04 | 0.36 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,213 | 0 | 11,520 | 265 | 2.1 | 0.0 | 58.7 | 58.7 | 0.04 | 0.35 | fixture check failed (9 observations) |
| `feed-scroll` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,182 | 0 | 3,098 | 0 | 13,952 | 319 | 2.6 | 0.0 | 61.3 | 61.3 | 0.21 | 0.38 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,821 | 0 | 9,088 | 256 | 2.6 | 0.0 | 58.0 | 58.0 | 0.29 | 0.97 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,799 | 0 | 9,088 | 229 | 2.3 | 0.0 | 61.1 | 61.1 | 0.21 | 0.36 | ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,285 | 0 | 6,400 | 168 | 1.9 | 0.0 | 53.7 | 53.7 | 0.02 | 0.39 | ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 973 | 0 | 1,605 | 0 | 8,448 | 284 | 2.0 | 0.0 | 57.7 | 57.7 | 0.02 | 0.36 | The "Quarterly draft" file has been removed from the list, and the confirmation message is displayed. ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,157 | 0 | 6,528 | 168 | 2.5 | 0.0 | 54.3 | 54.3 | 0.03 | 0.35 | ANSWER: Quarterly draft was moved to trash. |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,093 | 0 | 12,416 | 282 | 2.1 | 0.0 | 110.2 | 110.2 | 0.08 | 0.36 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,056 | 0 | 12,416 | 263 | 2.0 | 0.0 | 105.2 | 105.2 | 0.08 | 0.39 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,066 | 0 | 12,416 | 265 | 1.9 | 0.0 | 103.7 | 103.7 | 0.07 | 0.36 | ANSWER: Theme saved: Midnight |
| `spa-team` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 651 | 0 | 1,335 | 0 | 6,400 | 176 | 1.8 | 0.0 | 52.1 | 52.1 | 0.01 | 0.40 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,588 | 0 | 8,448 | 201 | 2.8 | 0.0 | 59.0 | 59.0 | 0.02 | 0.39 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,525 | 0 | 8,576 | 251 | 2.8 | 0.0 | 58.8 | 58.8 | 0.02 | 0.36 | The designer is Priya Shah, and clicking her reveals the email. ANSWER: priya@example.test |
| `plans-pick` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 917 | 0 | 4,608 | 133 | 2.0 | 0.0 | 5.3 | 5.3 | 0.01 | 0.40 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 921 | 0 | 4,608 | 128 | 2.1 | 0.0 | 6.2 | 6.2 | 0.01 | 0.36 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 805 | 0 | 4,736 | 144 | 2.1 | 0.0 | 52.9 | 52.9 | 0.01 | 0.34 | ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,395 | 0 | 6,400 | 175 | 2.4 | 0.0 | 57.7 | 57.7 | 0.02 | 0.40 | ANSWER: 45 days |
| `faq-refund` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 868 | 0 | 4,736 | 143 | 1.9 | 0.0 | 54.3 | 54.3 | 0.01 | 0.38 | ANSWER: 45 days |
| `faq-refund` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,277 | 0 | 6,528 | 186 | 1.8 | 0.0 | 54.1 | 54.1 | 0.02 | 0.39 | ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,827 | 0 | 8,704 | 272 | 1.7 | 0.0 | 56.9 | 56.9 | 0.07 | 0.36 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,604 | 0 | 8,960 | 283 | 2.2 | 0.0 | 58.7 | 58.7 | 0.13 | 0.48 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,684 | 0 | 8,832 | 267 | 2.1 | 0.0 | 11.5 | 11.5 | 0.09 | 0.40 | ANSWER: R-8064 |
| `chart-march` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 417 | 1 | 1,686 | 0 | 8,320 | 288 | 2.2 | 0.0 | 57.9 | 57.9 | 0.01 | 0.35 | ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 340 | 1 | 1,294 | 0 | 6,528 | 241 | 2.4 | 0.0 | 53.3 | 53.3 | 0.01 | 0.42 | ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 787 | 0 | 4,736 | 129 | 2.6 | 0.0 | 5.2 | 5.2 | 0.00 | 0.33 | ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 23 | 0 | 22 | 0 | 7,117 | 0 | 8,690 | 0 | 82,304 | 1,576 | 2.7 | 0.0 | 244.1 | 244.1 | 0.62 | 0.34 | ANSWER: Order #S-5856, total charged $101.29. |
| `long-shop` | Mantis | 2 | success | 1 | 20 | 0 | 21 | 0 | 6,946 | 0 | 8,173 | 0 | 77,440 | 1,590 | 2.3 | 0.0 | 240.4 | 240.4 | 0.60 | 0.35 | ANSWER: Order number S-5856, total charged $101.29. |
| `long-shop` | Mantis | 3 | success | 1 | 22 | 0 | 18 | 0 | 9,928 | 0 | 9,032 | 0 | 80,512 | 1,648 | 2.2 | 0.0 | 241.9 | 241.9 | 0.79 | 0.37 | ANSWER: Order #S-5856, total charged $101.29 |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,594 | 0 | 50,688 | 1,078 | 2.0 | 0.0 | 127.1 | 127.1 | 1.14 | 0.39 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 2 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,298 | 0 | 51,200 | 1,061 | 2.3 | 0.0 | 169.5 | 169.5 | 1.21 | 0.39 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 15,712 | 0 | 7,599 | 0 | 43,520 | 981 | 2.4 | 0.0 | 117.5 | 117.5 | 1.12 | 0.45 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-onboard` | Mantis | 1 | success | 1 | 23 | 0 | 22 | 0 | 7,096 | 0 | 8,532 | 0 | 77,824 | 1,290 | 1.9 | 0.0 | 283.5 | 283.5 | 1.49 | 0.30 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 2 | success | 1 | 22 | 0 | 22 | 0 | 6,690 | 0 | 8,008 | 0 | 75,776 | 1,271 | 2.6 | 0.0 | 201.4 | 201.4 | 1.22 | 0.35 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 3 | success | 1 | 24 | 0 | 24 | 0 | 8,261 | 0 | 9,021 | 0 | 88,448 | 1,650 | 2.4 | 0.0 | 198.1 | 198.1 | 1.19 | 0.33 | ANSWER: W-8780 |
| `long-laptops` | Mantis | 1 | success | 1 | 14 | 0 | 15 | 0 | 19,121 | 0 | 11,298 | 0 | 77,568 | 1,211 | 2.0 | 0.0 | 184.2 | 184.2 | 0.09 | 0.35 | ANSWER: Atlas 14 — 1.28 kg |
| `long-laptops` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 14,602 | 0 | 8,549 | 0 | 52,864 | 1,005 | 2.0 | 0.0 | 129.4 | 129.4 | 0.06 | 0.33 | ANSWER: Atlas 14 — 1.28 kg |
| `long-laptops` | Mantis | 3 | success | 1 | 14 | 0 | 15 | 0 | 19,121 | 0 | 11,005 | 0 | 77,056 | 958 | 1.9 | 0.0 | 121.5 | 121.5 | 0.13 | 0.32 | ANSWER: Atlas 14 — 16 hours battery life (video playback), weight 1.28 kg. |
