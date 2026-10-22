# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-22; runs per task and approach: 3; 10 runs in parallel.
- Scope: 26 tasks × 1 approaches × 3 runs = 78 logical runs; 78 recorded so far; 78 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 77 / 78 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 1 |
| Tool calls (including retries) | 441 |
| Sarvam API attempts (including retries) | 498 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1098.9 |
| Sarvam limiter queue / cooldown (total, s) | 4325.2 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 883.9 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 293,181 |
| Browser observation images (observed blocks) | 2 |
| Normal input tokens (total) | 233,816 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,354,496 |
| Output tokens (total) | 31,700 |
| Total input tokens incl. cache (legacy) | 1,588,312 |
| MCP startup (total, s) | 81.8 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 5424.1 |
| CLI wall (total, s) | 5424.1 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 15.4 |
| Harness capture (total, s) | 33.8 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 9.85 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,004 | 0 | 1,521 | 0 | 8,576 | 276 | 1.5 | 0.0 | 10.9 | 10.9 | 0.00 | 0.21 | ANSWER: Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,004 | 0 | 1,610 | 0 | 8,448 | 249 | 1.7 | 0.0 | 11.2 | 11.2 | 0.00 | 0.24 | ANSWER: Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,004 | 0 | 1,610 | 0 | 8,448 | 249 | 1.7 | 0.0 | 7.8 | 7.8 | 0.00 | 0.20 | ANSWER: Subscribed from Canada (weekly: yes). |
| `wikipedia-birthdate` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 2,973 | 0 | 1,372 | 0 | 2,944 | 77 | 1.7 | 0.0 | 61.0 | 61.0 | 0.00 | 0.19 | ANSWER: 23 June 1912 |
| `wikipedia-birthdate` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 2,973 | 0 | 1,363 | 0 | 2,944 | 68 | 1.7 | 0.0 | 64.4 | 64.4 | 0.00 | 0.20 | ANSWER: 23 June 1912 |
| `wikipedia-birthdate` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 2,973 | 0 | 1,372 | 0 | 2,944 | 77 | 1.6 | 0.0 | 61.3 | 61.3 | 0.00 | 0.20 | ANSWER: 23 June 1912 |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 965 | 0 | 1,741 | 0 | 8,320 | 221 | 1.6 | 0.0 | 9.0 | 9.0 | 0.00 | 0.25 | ANSWER: Signed in |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 965 | 0 | 1,741 | 0 | 8,320 | 221 | 1.6 | 0.0 | 10.4 | 10.4 | 0.00 | 0.19 | ANSWER: Signed in |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 965 | 0 | 1,742 | 0 | 8,320 | 231 | 1.6 | 0.0 | 9.5 | 9.5 | 0.00 | 0.32 | ANSWER: Signed in |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 702 | 0 | 1,491 | 0 | 8,320 | 201 | 1.6 | 0.0 | 10.9 | 10.9 | 0.00 | 0.23 | ANSWER: Added to cart (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 702 | 0 | 1,383 | 0 | 8,448 | 215 | 0.8 | 0.0 | 56.6 | 56.6 | 0.00 | 0.23 | ANSWER: Added to cart (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 702 | 0 | 1,363 | 0 | 8,448 | 201 | 1.1 | 0.0 | 54.4 | 54.4 | 0.00 | 0.20 | ANSWER: Added to cart (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,427 | 0 | 2,084 | 0 | 11,904 | 330 | 1.2 | 0.0 | 62.3 | 62.3 | 0.00 | 0.18 | The page it leads to has the heading "Detail for item 150". ANSWER: Detail for item 150 |
| `longlist-item` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,427 | 0 | 2,208 | 0 | 11,904 | 493 | 1.1 | 0.0 | 57.0 | 57.0 | 0.00 | 0.23 | ANSWER: Detail for item 150 |
| `longlist-item` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 1,351 | 0 | 1,804 | 0 | 9,472 | 257 | 1.3 | 0.0 | 56.2 | 56.2 | 0.00 | 0.17 | answer did not match the expected result |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 794 | 0 | 1,093 | 0 | 4,608 | 134 | 1.6 | 0.0 | 52.4 | 52.4 | 0.00 | 0.20 | ANSWER: $29 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 794 | 0 | 1,093 | 0 | 4,608 | 134 | 1.5 | 0.0 | 52.7 | 52.7 | 0.00 | 0.24 | ANSWER: $29 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 794 | 0 | 970 | 0 | 4,736 | 141 | 0.9 | 0.0 | 7.4 | 7.4 | 0.00 | 0.19 | The Team plan price is displayed on the pricing page. ANSWER: $29 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,963 | 0 | 5,431 | 0 | 10,752 | 246 | 0.9 | 0.0 | 11.5 | 11.5 | 0.00 | 0.19 | ANSWER: Last updated: just now; Initech 3 amount: $4,218 |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 11,028 | 0 | 5,299 | 0 | 10,880 | 238 | 1.3 | 0.0 | 57.9 | 57.9 | 0.00 | 0.19 | ANSWER: Last updated: just now; Initech 3 amount: $4,218 |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,963 | 0 | 5,243 | 0 | 10,880 | 216 | 1.1 | 0.0 | 10.3 | 10.3 | 0.00 | 0.19 | ANSWER: Last updated: just now; Initech 3 amount: $4,218 |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,091 | 0 | 2,278 | 0 | 12,928 | 439 | 1.1 | 0.0 | 64.7 | 64.7 | 0.00 | 0.18 | ANSWER: The first attempt with password abc123 failed with the error "Password must be at least 8 characters." Retrying with longenough123 succeeded, and the pa |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,091 | 0 | 2,267 | 0 | 12,928 | 421 | 1.1 | 0.0 | 60.5 | 60.5 | 0.00 | 0.18 | ANSWER: The first attempt failed with "Password must be at least 8 characters."; after retrying with password longenough123, the page says "Welcome, new@example |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,091 | 0 | 2,258 | 0 | 12,800 | 387 | 1.0 | 0.0 | 117.5 | 117.5 | 0.00 | 0.16 | ANSWER: First attempt failed with "Password must be at least 8 characters."; after retrying with longenough123, the page says "Welcome, new@example.com" and "Yo |
| `checkout-steps` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,447 | 0 | 2,656 | 0 | 15,104 | 360 | 0.9 | 0.0 | 111.9 | 111.9 | 0.00 | 0.19 | ANSWER: Order #A1042, total charged $27.50 |
| `checkout-steps` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,276 | 0 | 2,332 | 0 | 12,800 | 346 | 0.9 | 0.0 | 66.0 | 66.0 | 0.00 | 0.18 | ANSWER: Order #A1042, total charged $27.50. |
| `checkout-steps` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,447 | 0 | 2,598 | 0 | 15,104 | 353 | 0.9 | 0.0 | 111.2 | 111.2 | 0.00 | 0.20 | ANSWER: Order #A1042, total charged $27.50. |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,754 | 0 | 8,576 | 249 | 0.9 | 0.0 | 59.4 | 59.4 | 0.00 | 0.18 | ANSWER: Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,355 | 0 | 1,902 | 0 | 11,136 | 303 | 0.9 | 0.0 | 59.4 | 59.4 | 0.00 | 0.24 | ANSWER: Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,621 | 0 | 8,704 | 248 | 0.9 | 0.0 | 103.5 | 103.5 | 0.00 | 0.17 | ANSWER: Booked for 2026-12-24 at 19:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,657 | 0 | 2,944 | 90 | 0.8 | 0.0 | 10.5 | 10.5 | 0.00 | 0.18 | ANSWER: 1874 |
| `article-deep-fact` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 111 | 1.0 | 0.0 | 7.8 | 7.8 | 0.00 | 0.21 | ANSWER: 1874 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 141 | 0.8 | 0.0 | 50.8 | 50.8 | 0.00 | 0.16 | ANSWER: 1874 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 1,447 | 0 | 1,290 | 0 | 2,944 | 166 | 0.9 | 0.0 | 50.7 | 50.7 | 0.00 | 0.27 | ANSWER: Widget 30 has SKU W-1203 and 113 in stock. |
| `inventory-lookup` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,511 | 0 | 1,630 | 0 | 5,248 | 183 | 0.8 | 0.0 | 51.2 | 51.2 | 0.00 | 0.23 | ANSWER: Widget 30 has SKU W-1203 with 113 in stock. |
| `inventory-lookup` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,511 | 0 | 1,630 | 0 | 5,248 | 183 | 0.9 | 0.0 | 54.2 | 54.2 | 0.00 | 0.23 | ANSWER: Widget 30 has SKU W-1203 and 113 in stock. |
| `churned-max` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 5,565 | 0 | 3,394 | 0 | 6,784 | 716 | 0.8 | 0.0 | 54.6 | 54.6 | 0.00 | 0.19 | ANSWER: Acme 6 — $9,950 |
| `churned-max` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 11,147 | 0 | 5,779 | 0 | 11,136 | 732 | 0.8 | 0.0 | 53.1 | 53.1 | 0.00 | 0.19 | ANSWER: Acme 6 — $9,950 |
| `churned-max` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 5,565 | 0 | 3,141 | 0 | 6,912 | 591 | 0.9 | 0.0 | 12.2 | 12.2 | 0.00 | 0.20 | ANSWER: Acme 6 — $9,950 |
| `search-pagination` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,800 | 0 | 2,222 | 0 | 11,520 | 275 | 1.0 | 0.0 | 63.6 | 63.6 | 0.00 | 0.19 | ANSWER: dana.r. |
| `search-pagination` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,800 | 0 | 2,189 | 0 | 11,520 | 257 | 1.1 | 0.0 | 58.3 | 58.3 | 0.00 | 0.18 | ANSWER: dana.r. |
| `search-pagination` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,303 | 0 | 2,616 | 0 | 14,080 | 285 | 0.8 | 0.0 | 61.3 | 61.3 | 0.00 | 0.19 | ANSWER: dana.r. |
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,049 | 0 | 1,927 | 0 | 8,960 | 228 | 1.3 | 0.0 | 7.8 | 7.8 | 0.00 | 0.18 | ANSWER: The meeting moved to Thursday at noon. |
| `feed-scroll` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,049 | 0 | 1,846 | 0 | 9,088 | 242 | 1.0 | 0.0 | 60.0 | 60.0 | 0.00 | 0.18 | ANSWER: The meeting moved to Thursday at noon. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,049 | 0 | 1,799 | 0 | 9,088 | 229 | 1.0 | 0.0 | 56.1 | 56.1 | 0.00 | 0.17 | ANSWER: The meeting moved to Thursday at noon. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 664 | 0 | 1,274 | 0 | 6,400 | 168 | 0.9 | 0.0 | 58.4 | 58.4 | 0.00 | 0.20 | ANSWER: Old report was moved to trash. |
| `modal-delete` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 664 | 0 | 1,274 | 0 | 6,400 | 168 | 0.9 | 0.0 | 55.3 | 55.3 | 0.00 | 0.20 | ANSWER: Old report was moved to trash. |
| `modal-delete` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 664 | 0 | 1,146 | 0 | 6,528 | 168 | 0.8 | 0.0 | 57.0 | 57.0 | 0.00 | 0.21 | ANSWER: Old report was moved to trash. |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 999 | 0 | 2,035 | 0 | 12,416 | 273 | 0.9 | 0.0 | 114.2 | 114.2 | 0.00 | 0.27 | ANSWER: Theme saved: Dark |
| `menu-settings` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 734 | 0 | 1,690 | 0 | 10,368 | 245 | 1.0 | 0.0 | 106.7 | 106.7 | 0.00 | 0.18 | ANSWER: Theme saved: Dark |
| `menu-settings` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 734 | 0 | 1,562 | 0 | 10,496 | 236 | 0.9 | 0.0 | 58.5 | 58.5 | 0.00 | 0.18 | ANSWER: Theme saved: Dark |
| `spa-team` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,009 | 0 | 1,704 | 0 | 8,320 | 201 | 0.9 | 0.0 | 61.1 | 61.1 | 0.00 | 0.20 | ANSWER: mia@example.com |
| `spa-team` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,009 | 0 | 1,672 | 0 | 8,448 | 267 | 0.9 | 0.0 | 57.5 | 57.5 | 0.00 | 0.17 | The designer is Mia Wong, and clicking her revealed the email: mia@example.com. ANSWER: mia@example.com |
| `spa-team` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,009 | 0 | 1,764 | 0 | 8,320 | 251 | 1.0 | 0.0 | 61.1 | 61.1 | 0.00 | 0.19 | The designer is Mia Wong, and her email is displayed as mia@example.com. ANSWER: mia@example.com |
| `plans-pick` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 314 | 0 | 932 | 0 | 4,608 | 142 | 0.8 | 0.0 | 5.6 | 5.6 | 0.00 | 0.20 | ANSWER: PRO-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 583 | 0 | 1,252 | 0 | 6,400 | 170 | 0.8 | 0.0 | 52.8 | 52.8 | 0.00 | 0.19 | ANSWER: PRO-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 314 | 0 | 788 | 0 | 4,736 | 123 | 1.0 | 0.0 | 56.5 | 56.5 | 0.00 | 0.18 | ANSWER: PRO-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 910 | 0 | 1,371 | 0 | 6,400 | 158 | 1.0 | 0.0 | 53.7 | 53.7 | 0.00 | 0.18 | ANSWER: 30 days |
| `faq-refund` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 521 | 0 | 870 | 0 | 4,736 | 139 | 0.9 | 0.0 | 54.1 | 54.1 | 0.00 | 0.21 | ANSWER: 30 days |
| `faq-refund` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 931 | 0 | 1,274 | 0 | 6,528 | 185 | 0.9 | 0.0 | 7.9 | 7.9 | 0.00 | 0.22 | ANSWER: 30 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,743 | 0 | 8,832 | 286 | 1.1 | 0.0 | 58.5 | 58.5 | 0.00 | 0.18 | ANSWER: R-5531 |
| `iframe-pay` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,802 | 0 | 8,704 | 259 | 0.8 | 0.0 | 10.4 | 10.4 | 0.00 | 0.21 | ANSWER: R-5531 |
| `iframe-pay` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,687 | 0 | 8,832 | 268 | 1.0 | 0.0 | 63.2 | 63.2 | 0.00 | 0.19 | ANSWER: R-5531 |
| `chart-march` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 340 | 1 | 1,305 | 0 | 6,528 | 249 | 0.9 | 0.0 | 57.6 | 57.6 | 0.00 | 0.17 | ANSWER: 42 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 915 | 0 | 4,608 | 193 | 0.8 | 0.0 | 4.6 | 4.6 | 0.00 | 0.22 | The chart data is extracted. March shows 42 units sold. ANSWER: 42 |
| `chart-march` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 340 | 1 | 1,268 | 0 | 6,528 | 225 | 0.9 | 0.0 | 53.5 | 53.5 | 0.00 | 0.20 | ANSWER: 42 |
| `long-shop` | Mantis | 1 | success | 1 | 21 | 0 | 22 | 0 | 7,187 | 0 | 8,971 | 0 | 84,480 | 1,665 | 1.1 | 0.0 | 251.1 | 251.1 | 0.00 | 0.19 | ANSWER: Order #S-1814, total charged $101.29 |
| `long-shop` | Mantis | 2 | success | 1 | 21 | 0 | 22 | 0 | 7,187 | 0 | 8,581 | 0 | 83,968 | 1,632 | 1.2 | 0.0 | 233.0 | 233.0 | 0.00 | 0.18 | ANSWER: Order #S-1814, total charged $101.29. |
| `long-shop` | Mantis | 3 | success | 1 | 20 | 0 | 21 | 0 | 6,720 | 0 | 7,792 | 0 | 76,672 | 1,490 | 1.2 | 0.0 | 251.0 | 251.0 | 0.00 | 0.17 | ANSWER: Order #S-1814, total charged $101.29. |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,215 | 0 | 9,451 | 0 | 51,072 | 1,083 | 0.9 | 0.0 | 123.8 | 123.8 | 0.00 | 0.19 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 2 | success | 1 | 13 | 0 | 11 | 0 | 20,215 | 0 | 9,456 | 0 | 51,328 | 1,182 | 0.8 | 0.0 | 176.4 | 176.4 | 0.00 | 0.19 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 3 | success | 1 | 21 | 0 | 16 | 0 | 30,300 | 0 | 14,026 | 0 | 108,288 | 1,863 | 0.8 | 0.0 | 230.2 | 230.2 | 0.00 | 0.17 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 22 | 0 | 6,893 | 0 | 7,871 | 0 | 78,208 | 1,338 | 1.0 | 0.0 | 197.8 | 197.8 | 0.00 | 0.17 | ANSWER: W-3248 |
| `long-onboard` | Mantis | 2 | success | 1 | 22 | 0 | 21 | 0 | 6,893 | 0 | 8,086 | 0 | 72,448 | 1,163 | 0.8 | 0.0 | 198.3 | 198.3 | 0.00 | 0.16 | ANSWER: W-3248 |
| `long-onboard` | Mantis | 3 | success | 1 | 21 | 0 | 22 | 0 | 7,381 | 0 | 8,122 | 0 | 78,464 | 1,284 | 1.0 | 0.0 | 203.8 | 203.8 | 0.00 | 0.15 | ANSWER: W-3248 |
| `long-laptops` | Mantis | 1 | success | 1 | 14 | 0 | 15 | 0 | 19,077 | 0 | 11,161 | 0 | 77,568 | 1,015 | 0.8 | 0.0 | 124.1 | 124.1 | 0.00 | 0.18 | ANSWER: Nimbus 14 — 1.35 kg |
| `long-laptops` | Mantis | 2 | success | 1 | 8 | 0 | 6 | 0 | 12,668 | 0 | 6,458 | 0 | 18,048 | 799 | 0.8 | 0.0 | 113.1 | 113.1 | 0.00 | 0.18 | ANSWER: Nimbus 14 — 1.35 kg |
| `long-laptops` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 12,668 | 0 | 7,135 | 0 | 32,896 | 802 | 0.9 | 0.0 | 71.9 | 71.9 | 0.00 | 0.18 | ANSWER: Nimbus 14 — 1.35 kg |
