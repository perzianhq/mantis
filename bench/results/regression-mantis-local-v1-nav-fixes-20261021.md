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
| Correct | 75 / 75 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 442 |
| Sarvam API attempts (including retries) | 495 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1207.3 |
| Sarvam limiter queue / cooldown (total, s) | 4044.5 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 984.0 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 270,820 |
| Browser observation images (observed blocks) | 1 |
| Normal input tokens (total) | 238,701 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,312,512 |
| Output tokens (total) | 31,370 |
| Total input tokens incl. cache (legacy) | 1,551,213 |
| MCP startup (total, s) | 115.6 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 5251.8 |
| CLI wall (total, s) | 5251.8 |
| Fixture verification (total, s) | 8.2 |
| Cleanup (total, s) | 21.4 |
| Harness capture (total, s) | 49.9 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 9.92 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 2,878 | 0 | 7,168 | 245 | 2.0 | 0.0 | 23.3 | 23.3 | 0.03 | 0.22 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,011 | 0 | 2,923 | 0 | 7,040 | 227 | 2.0 | 0.0 | 23.0 | 23.0 | 0.04 | 0.23 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 2,890 | 0 | 7,168 | 249 | 2.1 | 0.0 | 23.7 | 23.7 | 0.05 | 0.22 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 2,961 | 0 | 7,168 | 265 | 2.0 | 0.0 | 16.3 | 16.3 | 0.06 | 0.34 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 3,024 | 0 | 7,040 | 222 | 2.1 | 0.0 | 21.2 | 21.2 | 0.03 | 0.23 | ANSWER: Welcome back |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 2,929 | 0 | 7,168 | 233 | 2.1 | 0.0 | 22.0 | 22.0 | 0.03 | 0.22 | ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 2,777 | 0 | 7,040 | 203 | 2.1 | 0.0 | 17.8 | 17.8 | 0.01 | 0.32 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 2,861 | 0 | 7,040 | 242 | 2.1 | 0.0 | 60.9 | 60.9 | 0.02 | 0.41 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 2,777 | 0 | 7,040 | 203 | 2.1 | 0.0 | 23.9 | 23.9 | 0.01 | 0.22 | ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,251 | 0 | 2,690 | 0 | 6,016 | 185 | 2.1 | 0.0 | 14.8 | 14.8 | 0.02 | 0.35 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,382 | 0 | 1,689 | 0 | 9,600 | 246 | 1.6 | 0.0 | 54.8 | 54.8 | 0.01 | 0.24 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,382 | 0 | 1,681 | 0 | 9,600 | 229 | 1.5 | 0.0 | 55.0 | 55.0 | 0.01 | 0.20 | ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 2,245 | 0 | 3,456 | 134 | 1.1 | 0.0 | 50.7 | 50.7 | 0.01 | 0.29 | ANSWER: $39 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 1,093 | 0 | 4,608 | 134 | 1.1 | 0.0 | 47.8 | 47.8 | 0.01 | 0.27 | ANSWER: $39 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 965 | 0 | 4,736 | 134 | 1.2 | 0.0 | 45.9 | 45.9 | 0.02 | 0.29 | ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,222 | 0 | 10,880 | 207 | 1.2 | 0.0 | 49.8 | 49.8 | 0.01 | 0.25 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,377 | 0 | 10,752 | 240 | 1.2 | 0.0 | 49.0 | 49.0 | 0.01 | 0.25 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,285 | 0 | 10,880 | 336 | 1.1 | 0.0 | 48.8 | 48.8 | 0.01 | 0.23 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,274 | 0 | 12,928 | 421 | 1.1 | 0.0 | 105.3 | 105.3 | 0.10 | 0.31 | ANSWER: First attempt failed with "Password must be at least 8 characters."; retrying with strongpass456 succeeded, and the page says "Welcome, hello@example.te |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,077 | 0 | 13,056 | 405 | 1.9 | 0.0 | 64.1 | 64.1 | 0.11 | 0.30 | ANSWER: First attempt failed with "Password must be at least 8 characters."; retrying with strongpass456 succeeded, and the page ends by saying "Welcome, hello@ |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,176 | 0 | 13,056 | 447 | 1.4 | 0.0 | 57.8 | 57.8 | 0.11 | 0.28 | ANSWER: The first attempt failed with "Password must be at least 8 characters." After retrying with strongpass456, the page says "Welcome, hello@example.test" a |
| `checkout-steps` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,264 | 0 | 2,135 | 0 | 12,928 | 333 | 1.2 | 0.0 | 65.8 | 65.8 | 0.06 | 0.27 | ANSWER: Order #B2048, total charged $31.25 |
| `checkout-steps` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,435 | 0 | 2,579 | 0 | 15,104 | 345 | 1.3 | 0.0 | 62.8 | 62.8 | 0.07 | 0.23 | ANSWER: Order #B2048, total charged: $31.25 |
| `checkout-steps` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,435 | 0 | 2,448 | 0 | 15,232 | 352 | 1.1 | 0.0 | 110.5 | 110.5 | 0.09 | 0.28 | ANSWER: Order #B2048, total charged $31.25. |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,922 | 0 | 8,576 | 311 | 1.2 | 0.0 | 65.0 | 65.0 | 0.05 | 0.23 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 2 | success | 1 | 6 | 0 | 6 | 0 | 1,356 | 0 | 1,956 | 0 | 11,264 | 333 | 1.2 | 0.0 | 106.3 | 106.3 | 0.06 | 0.34 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,355 | 0 | 2,075 | 0 | 11,136 | 379 | 1.1 | 0.0 | 109.7 | 109.7 | 0.10 | 0.32 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,657 | 0 | 2,944 | 143 | 1.1 | 0.0 | 45.8 | 45.8 | 0.00 | 0.39 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 90 | 1.4 | 0.0 | 7.3 | 7.3 | 0.00 | 0.30 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 106 | 1.8 | 0.0 | 5.8 | 5.8 | 0.00 | 0.24 | ANSWER: 1888 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,510 | 0 | 1,675 | 0 | 5,248 | 219 | 1.4 | 0.0 | 51.1 | 51.1 | 0.01 | 0.33 | ANSWER: Gadget 30 — SKU: G-4096, In stock: 97 |
| `inventory-lookup` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,166 | 0 | 3,072 | 115 | 1.4 | 0.0 | 50.0 | 50.0 | 0.00 | 0.26 | ANSWER: Gadget 30 has SKU G-4096 with 97 in stock. |
| `inventory-lookup` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,510 | 0 | 1,541 | 0 | 5,376 | 210 | 1.4 | 0.0 | 49.9 | 49.9 | 0.00 | 0.30 | ANSWER: Gadget 30 has SKU G-4096 and 97 in stock. |
| `churned-max` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 5,562 | 0 | 3,423 | 0 | 6,784 | 670 | 1.0 | 0.0 | 50.6 | 50.6 | 0.06 | 0.28 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 6,120 | 0 | 3,904 | 0 | 11,136 | 723 | 1.0 | 0.0 | 57.8 | 57.8 | 0.07 | 0.30 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 6,120 | 0 | 3,768 | 0 | 11,136 | 631 | 1.3 | 0.0 | 58.7 | 58.7 | 0.07 | 0.45 | ANSWER: Vertex 6 — $9,900 |
| `search-pagination` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,213 | 0 | 11,520 | 265 | 1.0 | 0.0 | 99.9 | 99.9 | 0.02 | 0.35 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,093 | 0 | 11,648 | 273 | 1.7 | 0.0 | 16.4 | 16.4 | 0.03 | 0.28 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,079 | 0 | 11,648 | 264 | 1.8 | 0.0 | 61.8 | 61.8 | 0.02 | 0.27 | ANSWER: mira.k. |
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,969 | 0 | 8,960 | 242 | 1.6 | 0.0 | 14.6 | 14.6 | 0.19 | 0.27 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,837 | 0 | 9,088 | 239 | 1.5 | 0.0 | 57.4 | 57.4 | 0.20 | 0.30 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,753 | 0 | 9,216 | 262 | 1.8 | 0.0 | 55.5 | 55.5 | 0.15 | 0.25 | ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 973 | 0 | 1,685 | 0 | 8,320 | 260 | 1.7 | 0.0 | 58.3 | 58.3 | 0.01 | 0.27 | The file "Quarterly draft" was deleted and the confirmation message shown is: "Quarterly draft was moved to trash." ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,157 | 0 | 6,528 | 180 | 1.6 | 0.0 | 58.1 | 58.1 | 0.02 | 0.42 | ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 973 | 0 | 1,476 | 0 | 8,448 | 190 | 1.3 | 0.0 | 53.9 | 53.9 | 0.02 | 0.32 | ANSWER: Quarterly draft was moved to trash. |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 1,950 | 0 | 12,544 | 267 | 1.3 | 0.0 | 107.0 | 107.0 | 0.07 | 0.39 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,066 | 0 | 12,416 | 277 | 1.4 | 0.0 | 103.8 | 103.8 | 0.04 | 0.27 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,056 | 0 | 12,416 | 263 | 1.3 | 0.0 | 99.2 | 99.2 | 0.04 | 0.32 | ANSWER: Theme saved: Midnight |
| `spa-team` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,705 | 0 | 8,320 | 197 | 1.8 | 0.0 | 60.1 | 60.1 | 0.01 | 0.28 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,588 | 0 | 8,448 | 201 | 1.8 | 0.0 | 59.0 | 59.0 | 0.01 | 0.28 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 964 | 0 | 1,585 | 0 | 8,448 | 219 | 1.7 | 0.0 | 58.8 | 58.8 | 0.01 | 0.29 | ANSWER: priya@example.test |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,102 | 0 | 6,528 | 162 | 2.0 | 0.0 | 53.4 | 53.4 | 0.01 | 0.35 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,253 | 0 | 6,400 | 171 | 1.9 | 0.0 | 57.0 | 57.0 | 0.01 | 0.27 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,116 | 0 | 6,528 | 162 | 1.5 | 0.0 | 56.0 | 56.0 | 0.01 | 0.26 | ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,405 | 0 | 6,400 | 183 | 0.9 | 0.0 | 50.6 | 50.6 | 0.01 | 0.31 | ANSWER: 45 days |
| `faq-refund` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 869 | 0 | 4,736 | 144 | 2.4 | 0.0 | 9.1 | 9.1 | 0.00 | 0.26 | ANSWER: 45 days |
| `faq-refund` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,283 | 0 | 6,528 | 189 | 2.0 | 0.0 | 16.4 | 16.4 | 0.01 | 0.27 | ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,601 | 0 | 8,960 | 282 | 1.5 | 0.0 | 59.3 | 59.3 | 0.06 | 0.25 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,731 | 0 | 8,832 | 284 | 1.4 | 0.0 | 56.9 | 56.9 | 0.07 | 0.27 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,681 | 0 | 8,832 | 266 | 1.6 | 0.0 | 11.2 | 11.2 | 0.05 | 0.27 | ANSWER: R-8064 |
| `chart-march` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 340 | 1 | 1,434 | 0 | 6,400 | 254 | 1.6 | 0.0 | 13.0 | 13.0 | 0.00 | 0.30 | ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 783 | 0 | 4,736 | 162 | 1.6 | 0.0 | 12.1 | 12.1 | 0.00 | 0.26 | ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 788 | 0 | 4,736 | 174 | 2.0 | 0.0 | 56.9 | 56.9 | 0.00 | 0.30 | ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 20 | 0 | 21 | 0 | 6,750 | 0 | 8,521 | 0 | 75,008 | 1,495 | 2.1 | 0.0 | 187.9 | 187.9 | 0.31 | 0.28 | ANSWER: Order #S-5856, total charged $101.29. |
| `long-shop` | Mantis | 2 | success | 1 | 21 | 0 | 22 | 0 | 7,236 | 0 | 8,628 | 0 | 83,456 | 1,634 | 1.5 | 0.0 | 254.2 | 254.2 | 0.58 | 0.24 | ANSWER: Order #S-5856, total charged $101.29 |
| `long-shop` | Mantis | 3 | success | 1 | 24 | 0 | 25 | 0 | 8,503 | 0 | 9,679 | 0 | 101,632 | 1,631 | 1.0 | 0.0 | 247.4 | 247.4 | 0.51 | 0.24 | ANSWER: Order number S-5856, total charged $101.29. |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,523 | 0 | 9,521 | 0 | 50,816 | 940 | 1.3 | 0.0 | 163.8 | 163.8 | 0.77 | 0.38 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 2 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,392 | 0 | 51,968 | 1,157 | 1.4 | 0.0 | 163.9 | 163.9 | 0.59 | 0.26 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 3 | success | 1 | 13 | 0 | 11 | 0 | 15,955 | 0 | 8,061 | 0 | 51,072 | 981 | 1.5 | 0.0 | 162.4 | 162.4 | 0.74 | 0.24 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 23 | 0 | 6,612 | 0 | 8,222 | 0 | 79,744 | 1,320 | 1.3 | 0.0 | 232.7 | 232.7 | 0.61 | 0.23 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 2 | success | 1 | 22 | 0 | 21 | 0 | 6,690 | 0 | 7,792 | 0 | 73,088 | 1,313 | 2.1 | 0.0 | 193.9 | 193.9 | 0.88 | 0.27 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 3 | success | 1 | 23 | 0 | 23 | 0 | 8,004 | 0 | 8,366 | 0 | 82,432 | 1,372 | 1.3 | 0.0 | 203.0 | 203.0 | 0.60 | 0.21 | ANSWER: W-8780 |
| `long-laptops` | Mantis | 1 | success | 1 | 10 | 0 | 7 | 0 | 13,586 | 0 | 7,273 | 0 | 25,216 | 994 | 1.4 | 0.0 | 72.4 | 72.4 | 0.03 | 0.34 | ANSWER: Atlas 14 — 1.28 kg |
| `long-laptops` | Mantis | 2 | success | 1 | 14 | 0 | 15 | 0 | 19,121 | 0 | 11,439 | 0 | 79,744 | 1,339 | 1.3 | 0.0 | 118.9 | 118.9 | 0.06 | 0.26 | All under-$1,000 laptops checked: - Aero 13: 11 h, 1.20 kg - Bolt 14: 9 h, 1.50 kg - Cirrus Air: 13.5 h, 1.10 kg - Delta 15: 8 h, 1.95 kg - Echo Flip: 12 h, 1.4 |
| `long-laptops` | Mantis | 3 | success | 1 | 10 | 0 | 8 | 0 | 13,682 | 0 | 7,448 | 0 | 31,232 | 995 | 2.0 | 0.0 | 62.6 | 62.6 | 0.04 | 0.28 | ANSWER: Atlas 14 — 1.28 kg |
