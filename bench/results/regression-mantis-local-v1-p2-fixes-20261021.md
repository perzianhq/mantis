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
| Tool calls (including retries) | 467 |
| Sarvam API attempts (including retries) | 519 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1056.8 |
| Sarvam limiter queue / cooldown (total, s) | 4543.4 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 781.3 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 296,981 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 241,713 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,552,640 |
| Output tokens (total) | 34,809 |
| Total input tokens incl. cache (legacy) | 1,794,353 |
| MCP startup (total, s) | 160.5 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 5600.2 |
| CLI wall (total, s) | 5600.2 |
| Fixture verification (total, s) | 14.7 |
| Cleanup (total, s) | 26.7 |
| Harness capture (total, s) | 68.2 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 10.47 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,610 | 0 | 8,448 | 249 | 1.9 | 0.0 | 7.6 | 7.6 | 0.07 | 0.31 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,482 | 0 | 8,576 | 249 | 2.0 | 0.0 | 9.1 | 9.1 | 0.05 | 0.24 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,479 | 0 | 8,576 | 248 | 2.0 | 0.0 | 5.9 | 5.9 | 0.04 | 0.23 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,616 | 0 | 8,448 | 212 | 2.1 | 0.0 | 62.9 | 62.9 | 0.08 | 0.57 | ANSWER: Welcome back |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,632 | 0 | 8,448 | 228 | 2.2 | 0.0 | 8.1 | 8.1 | 0.09 | 0.29 | ANSWER: Welcome back |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,762 | 0 | 8,320 | 230 | 2.1 | 0.0 | 6.5 | 6.5 | 0.03 | 0.25 | ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,554 | 0 | 8,320 | 222 | 2.1 | 0.0 | 7.7 | 7.7 | 0.01 | 0.42 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,381 | 0 | 8,448 | 215 | 2.1 | 0.0 | 8.6 | 8.6 | 0.01 | 0.31 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 517 | 0 | 1,243 | 0 | 6,400 | 192 | 2.1 | 0.0 | 6.8 | 6.8 | 0.02 | 0.34 | ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,378 | 0 | 1,859 | 0 | 9,472 | 259 | 2.1 | 0.0 | 6.0 | 6.0 | 0.01 | 0.23 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,361 | 0 | 1,666 | 0 | 9,600 | 221 | 1.7 | 0.0 | 61.5 | 61.5 | 0.02 | 0.27 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,361 | 0 | 1,660 | 0 | 9,600 | 215 | 2.2 | 0.0 | 60.3 | 60.3 | 0.03 | 0.30 | ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 969 | 0 | 4,736 | 141 | 2.5 | 0.0 | 56.8 | 56.8 | 0.01 | 0.33 | The Business plan price is displayed as "$39 per month". ANSWER: $39 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 1,093 | 0 | 4,608 | 134 | 2.1 | 0.0 | 57.2 | 57.2 | 0.01 | 0.26 | ANSWER: $39 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 1,097 | 0 | 4,608 | 139 | 1.8 | 0.0 | 57.3 | 57.3 | 0.01 | 0.26 | ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,334 | 0 | 10,752 | 212 | 1.5 | 0.0 | 58.9 | 58.9 | 0.01 | 0.26 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,361 | 0 | 10,752 | 213 | 1.4 | 0.0 | 58.3 | 58.3 | 0.01 | 0.27 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,341 | 0 | 10,752 | 203 | 1.4 | 0.0 | 60.4 | 60.4 | 0.01 | 0.28 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,282 | 0 | 12,928 | 427 | 1.4 | 0.0 | 113.6 | 113.6 | 0.12 | 0.32 | ANSWER: The first attempt failed with "Password must be at least 8 characters."; retrying with strongpass456 succeeded, and the page ends by showing "Welcome, h |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,178 | 0 | 13,056 | 468 | 1.6 | 0.0 | 64.0 | 64.0 | 0.08 | 0.24 | ANSWER: The first attempt with password abc123 failed with the error "Password must be at least 8 characters." After retrying with strongpass456, the page says  |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,200 | 0 | 12,928 | 401 | 1.5 | 0.0 | 64.0 | 64.0 | 0.10 | 0.25 | ANSWER: First attempt failed with "Password must be at least 8 characters."; after retrying with strongpass456, the page says "Welcome, hello@example.test" and  |
| `checkout-steps` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,435 | 0 | 2,587 | 0 | 15,104 | 353 | 1.5 | 0.0 | 64.1 | 64.1 | 0.10 | 0.24 | ANSWER: Order #B2048, total charged $31.25. |
| `checkout-steps` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,264 | 0 | 2,135 | 0 | 12,928 | 335 | 1.8 | 0.0 | 61.3 | 61.3 | 0.11 | 0.30 | ANSWER: Order #B2048, total charged: $31.25. |
| `checkout-steps` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,435 | 0 | 2,459 | 0 | 15,232 | 352 | 1.7 | 0.0 | 114.0 | 114.0 | 0.09 | 0.28 | ANSWER: Order #B2048, total charged $31.25 |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,867 | 0 | 8,576 | 292 | 1.8 | 0.0 | 62.1 | 62.1 | 0.06 | 0.23 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,355 | 0 | 2,142 | 0 | 11,136 | 387 | 1.8 | 0.0 | 60.5 | 60.5 | 0.07 | 0.28 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,775 | 0 | 8,704 | 304 | 1.8 | 0.0 | 56.3 | 56.3 | 0.06 | 0.29 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,657 | 0 | 2,944 | 131 | 1.6 | 0.0 | 52.2 | 52.2 | 0.00 | 0.29 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,529 | 0 | 3,072 | 90 | 1.4 | 0.0 | 2.6 | 2.6 | 0.01 | 0.27 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,533 | 0 | 3,072 | 143 | 1.4 | 0.0 | 4.8 | 4.8 | 0.00 | 0.27 | ANSWER: 1888 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,510 | 0 | 1,645 | 0 | 5,248 | 188 | 1.4 | 0.0 | 53.2 | 53.2 | 0.00 | 0.33 | ANSWER: Gadget 30 — SKU G-4096, 97 in stock. |
| `inventory-lookup` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,510 | 0 | 1,645 | 0 | 5,248 | 180 | 1.6 | 0.0 | 54.7 | 54.7 | 0.00 | 0.31 | ANSWER: SKU G-4096, 97 in stock |
| `inventory-lookup` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,294 | 0 | 2,944 | 116 | 1.4 | 0.0 | 50.5 | 50.5 | 0.01 | 0.47 | ANSWER: Gadget 30 — SKU: G-4096, In stock: 97 |
| `churned-max` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 11,792 | 0 | 6,163 | 0 | 11,136 | 921 | 2.4 | 0.0 | 54.0 | 54.0 | 0.11 | 0.29 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 11,892 | 0 | 6,657 | 0 | 17,792 | 1,195 | 1.5 | 0.0 | 109.1 | 109.1 | 0.11 | 0.41 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 5,531 | 0 | 2,618 | 0 | 3,072 | 527 | 1.5 | 0.0 | 49.7 | 49.7 | 0.01 | 0.29 | ANSWER: Vertex 6 — $9,900 |
| `search-pagination` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,092 | 0 | 11,648 | 266 | 1.5 | 0.0 | 110.7 | 110.7 | 0.05 | 0.40 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,213 | 0 | 11,520 | 271 | 1.5 | 0.0 | 107.5 | 107.5 | 0.04 | 0.37 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,797 | 0 | 2,200 | 0 | 11,520 | 258 | 1.4 | 0.0 | 55.7 | 55.7 | 0.01 | 0.25 | ANSWER: mira.k. |
| `feed-scroll` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,182 | 0 | 3,158 | 0 | 13,952 | 331 | 1.6 | 0.0 | 61.6 | 61.6 | 0.25 | 0.39 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,111 | 0 | 2,183 | 0 | 11,520 | 327 | 1.6 | 0.0 | 59.2 | 59.2 | 0.18 | 0.42 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,799 | 0 | 9,088 | 229 | 1.6 | 0.0 | 56.1 | 56.1 | 0.21 | 0.38 | ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,285 | 0 | 6,400 | 168 | 1.5 | 0.0 | 54.4 | 54.4 | 0.02 | 0.40 | ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 973 | 0 | 1,478 | 0 | 8,448 | 189 | 1.8 | 0.0 | 58.3 | 58.3 | 0.03 | 0.38 | ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 973 | 0 | 1,587 | 0 | 8,448 | 265 | 1.8 | 0.0 | 58.4 | 58.4 | 0.03 | 0.54 | The file "Quarterly draft" has been deleted, and the confirmation message is shown. ANSWER: Quarterly draft was moved to trash. |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,023 | 0 | 2,082 | 0 | 12,416 | 280 | 1.3 | 0.0 | 63.1 | 63.1 | 0.06 | 0.41 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 750 | 0 | 1,598 | 0 | 10,496 | 252 | 2.2 | 0.0 | 61.1 | 61.1 | 0.08 | 0.37 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 750 | 0 | 1,602 | 0 | 10,496 | 253 | 2.9 | 0.0 | 61.2 | 61.2 | 0.11 | 0.43 | ANSWER: Theme saved: Midnight |
| `spa-team` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,744 | 0 | 8,320 | 222 | 2.9 | 0.0 | 10.4 | 10.4 | 0.02 | 0.61 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,729 | 0 | 8,320 | 215 | 3.0 | 0.0 | 61.7 | 61.7 | 0.03 | 0.43 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,023 | 0 | 1,577 | 0 | 8,448 | 197 | 2.2 | 0.0 | 56.9 | 56.9 | 0.02 | 0.38 | ANSWER: priya@example.test |
| `plans-pick` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 925 | 0 | 4,608 | 137 | 2.4 | 0.0 | 6.9 | 6.9 | 0.01 | 0.40 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 805 | 0 | 4,736 | 144 | 2.7 | 0.0 | 52.4 | 52.4 | 0.01 | 0.39 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,116 | 0 | 6,528 | 166 | 3.3 | 0.0 | 55.8 | 55.8 | 0.02 | 0.39 | ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,409 | 0 | 6,400 | 188 | 3.6 | 0.0 | 55.0 | 55.0 | 0.01 | 0.44 | ANSWER: 45 days |
| `faq-refund` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,270 | 0 | 6,528 | 176 | 3.0 | 0.0 | 53.3 | 53.3 | 0.01 | 0.35 | ANSWER: 45 days |
| `faq-refund` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 867 | 0 | 4,736 | 143 | 3.1 | 0.0 | 49.4 | 49.4 | 0.01 | 0.47 | ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,830 | 0 | 8,704 | 273 | 2.9 | 0.0 | 51.2 | 51.2 | 0.18 | 0.51 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,715 | 0 | 8,832 | 280 | 2.9 | 0.0 | 56.8 | 56.8 | 0.09 | 0.41 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,681 | 0 | 8,832 | 262 | 2.2 | 0.0 | 55.2 | 55.2 | 0.12 | 0.34 | ANSWER: R-8064 |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 922 | 0 | 4,608 | 135 | 2.6 | 0.0 | 5.8 | 5.8 | 0.01 | 0.60 | ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 787 | 0 | 4,736 | 146 | 2.9 | 0.0 | 5.3 | 5.3 | 0.01 | 0.42 | ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 537 | 0 | 1,133 | 0 | 6,528 | 228 | 2.6 | 0.0 | 53.1 | 53.1 | 0.00 | 0.37 | ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 20 | 0 | 21 | 0 | 6,750 | 0 | 8,399 | 0 | 76,544 | 1,612 | 3.6 | 0.0 | 236.5 | 236.5 | 0.94 | 0.41 | ANSWER: Order #S-5856, total charged $101.29. |
| `long-shop` | Mantis | 2 | success | 1 | 21 | 0 | 22 | 0 | 7,236 | 0 | 8,356 | 0 | 82,560 | 1,483 | 3.5 | 0.0 | 246.2 | 246.2 | 0.79 | 0.35 | ANSWER: Order #S-5856, total charged $101.29. |
| `long-shop` | Mantis | 3 | success | 1 | 25 | 0 | 26 | 0 | 9,386 | 0 | 10,380 | 0 | 108,800 | 1,720 | 2.9 | 0.0 | 292.1 | 292.1 | 0.70 | 0.36 | ANSWER: Order #S-5856, total charged $101.29. |
| `long-admin` | Mantis | 1 | success | 1 | 26 | 0 | 22 | 0 | 16,956 | 0 | 11,390 | 0 | 112,640 | 1,783 | 3.3 | 0.0 | 238.6 | 238.6 | 2.20 | 0.46 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 2 | success | 1 | 28 | 0 | 28 | 0 | 37,103 | 0 | 20,801 | 0 | 234,880 | 3,402 | 2.9 | 0.0 | 305.8 | 305.8 | 1.86 | 0.44 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 3 | success | 1 | 13 | 0 | 11 | 0 | 20,217 | 0 | 9,284 | 0 | 50,944 | 1,038 | 2.4 | 0.0 | 120.4 | 120.4 | 1.10 | 0.42 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-onboard` | Mantis | 1 | success | 1 | 23 | 0 | 22 | 0 | 7,926 | 0 | 8,697 | 0 | 77,696 | 1,289 | 2.3 | 0.0 | 242.2 | 242.2 | 1.36 | 0.41 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 2 | success | 1 | 22 | 0 | 22 | 0 | 6,640 | 0 | 7,795 | 0 | 77,824 | 1,400 | 2.6 | 0.0 | 240.6 | 240.6 | 1.15 | 0.37 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 3 | success | 1 | 22 | 0 | 23 | 0 | 6,640 | 0 | 7,660 | 0 | 80,256 | 1,255 | 2.8 | 0.0 | 242.4 | 242.4 | 1.12 | 0.32 | ANSWER: W-8780 |
| `long-laptops` | Mantis | 1 | success | 1 | 10 | 0 | 7 | 0 | 13,682 | 0 | 7,445 | 0 | 25,472 | 1,032 | 2.8 | 0.0 | 65.7 | 65.7 | 0.04 | 0.38 | ANSWER: Atlas 14 — 1.28 kg |
| `long-laptops` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 14,602 | 0 | 8,790 | 0 | 52,992 | 1,127 | 1.9 | 0.0 | 127.3 | 127.3 | 0.07 | 0.37 | ANSWER: Atlas 14 — 1.28 kg |
| `long-laptops` | Mantis | 3 | success | 1 | 10 | 0 | 8 | 0 | 13,586 | 0 | 7,424 | 0 | 31,232 | 1,075 | 1.9 | 0.0 | 115.7 | 115.7 | 0.15 | 0.39 | ANSWER: Atlas 14 — 16 hours of video playback, weight 1.28 kg. |
