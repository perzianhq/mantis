# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-22; runs per task and approach: 3; 10 runs in parallel.
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
| Tool calls (including retries) | 460 |
| Sarvam API attempts (including retries) | 510 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1377.6 |
| Sarvam limiter queue / cooldown (total, s) | 4216.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 1229.8 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 295,395 |
| Browser observation images (observed blocks) | 1 |
| Normal input tokens (total) | 256,672 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,616,000 |
| Output tokens (total) | 34,404 |
| Total input tokens incl. cache (legacy) | 1,872,672 |
| MCP startup (total, s) | 76.2 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 5593.7 |
| CLI wall (total, s) | 5593.7 |
| Fixture verification (total, s) | 5.7 |
| Cleanup (total, s) | 14.9 |
| Harness capture (total, s) | 70.7 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 10.84 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 3,111 | 0 | 9,088 | 256 | 1.5 | 0.0 | 63.9 | 63.9 | 0.03 | 0.20 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 3,112 | 0 | 9,088 | 256 | 1.5 | 0.0 | 21.6 | 21.6 | 0.03 | 0.19 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 3,221 | 0 | 8,960 | 250 | 1.6 | 0.0 | 21.7 | 21.7 | 0.04 | 0.20 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,005 | 0 | 3,240 | 0 | 8,960 | 212 | 1.6 | 0.0 | 24.5 | 24.5 | 0.03 | 0.23 | ANSWER: Welcome back |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,005 | 0 | 3,168 | 0 | 9,088 | 255 | 1.6 | 0.0 | 24.9 | 24.9 | 0.03 | 0.21 | The heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,005 | 0 | 3,251 | 0 | 8,960 | 223 | 1.6 | 0.0 | 23.0 | 23.0 | 0.02 | 0.19 | ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 3,120 | 0 | 8,832 | 208 | 1.6 | 0.0 | 63.9 | 63.9 | 0.01 | 0.21 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 2,885 | 0 | 9,088 | 217 | 1.6 | 0.0 | 21.1 | 21.1 | 0.01 | 0.17 | ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 3,117 | 0 | 8,832 | 215 | 1.6 | 0.0 | 65.2 | 65.2 | 0.01 | 0.22 | ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,275 | 0 | 3,241 | 0 | 7,168 | 185 | 1.6 | 0.0 | 24.2 | 24.2 | 0.01 | 0.20 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,385 | 0 | 1,872 | 0 | 11,520 | 213 | 0.9 | 0.0 | 55.6 | 55.6 | 0.01 | 0.19 | ANSWER: Record 150 details |
| `longlist-item` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,443 | 0 | 2,085 | 0 | 14,336 | 306 | 0.9 | 0.0 | 62.1 | 62.1 | 0.01 | 0.21 | ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 834 | 0 | 965 | 0 | 6,016 | 134 | 0.9 | 0.0 | 46.2 | 46.2 | 0.01 | 0.19 | ANSWER: $39 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 834 | 0 | 963 | 0 | 6,016 | 133 | 1.0 | 0.0 | 54.2 | 54.2 | 0.01 | 0.27 | ANSWER: $39 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 834 | 0 | 965 | 0 | 6,016 | 134 | 1.0 | 0.0 | 56.0 | 56.0 | 0.01 | 0.24 | ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,459 | 0 | 12,416 | 270 | 1.0 | 0.0 | 57.5 | 57.5 | 0.01 | 0.19 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,361 | 0 | 12,416 | 212 | 0.8 | 0.0 | 53.8 | 53.8 | 0.01 | 0.19 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 11,022 | 0 | 5,398 | 0 | 12,416 | 231 | 1.1 | 0.0 | 59.2 | 59.2 | 0.01 | 0.18 | ANSWER: Last updated: just now; Nova 3 amount: $5,314 |
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,144 | 0 | 2,097 | 0 | 16,000 | 404 | 1.3 | 0.0 | 79.7 | 79.7 | 0.05 | 0.19 | ANSWER: The first attempt failed with "Password must be at least 8 characters."; retrying with strongpass456 succeeded, and the page ends with "Welcome, hello@e |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,144 | 0 | 2,189 | 0 | 16,000 | 435 | 0.9 | 0.0 | 68.5 | 68.5 | 0.06 | 0.17 | ANSWER: First attempt failed with "Password must be at least 8 characters."; retrying with strongpass456 succeeded — the page then says "Welcome, hello@example. |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,144 | 0 | 2,176 | 0 | 16,000 | 436 | 0.8 | 0.0 | 75.8 | 75.8 | 0.05 | 0.19 | ANSWER: First attempt failed with "Password must be at least 8 characters." After retrying with strongpass456, the page says "Welcome, hello@example.test" and " |
| `checkout-steps` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,287 | 0 | 2,097 | 0 | 16,000 | 347 | 1.1 | 0.0 | 64.5 | 64.5 | 0.07 | 0.18 | ANSWER: Order #B2048, total charged $31.25. |
| `checkout-steps` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,287 | 0 | 2,097 | 0 | 16,000 | 346 | 0.9 | 0.0 | 64.2 | 64.2 | 0.06 | 0.18 | ANSWER: Order number B2048, total charged $31.25. |
| `checkout-steps` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,287 | 0 | 2,032 | 0 | 16,000 | 334 | 0.8 | 0.0 | 65.8 | 65.8 | 0.07 | 0.21 | ANSWER: Order #B2048, total charged: $31.25 |
| `booking-date` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,025 | 0 | 1,728 | 0 | 11,008 | 316 | 0.9 | 0.0 | 64.3 | 64.3 | 0.04 | 0.19 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 2 | success | 1 | 6 | 0 | 6 | 0 | 1,406 | 0 | 2,132 | 0 | 13,696 | 338 | 0.8 | 0.0 | 114.6 | 114.6 | 0.06 | 0.30 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,025 | 0 | 1,746 | 0 | 11,008 | 323 | 0.9 | 0.0 | 59.0 | 59.0 | 0.06 | 0.20 | ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,609 | 0 | 3,840 | 90 | 0.7 | 0.0 | 15.6 | 15.6 | 0.00 | 0.19 | ANSWER: 1888 |
| `article-deep-fact` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,618 | 0 | 3,840 | 165 | 0.7 | 0.0 | 6.0 | 6.0 | 0.00 | 0.17 | The article states the harbour light was first lit in 1888. ANSWER: 1888 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,613 | 0 | 3,840 | 130 | 0.9 | 0.0 | 6.5 | 6.5 | 0.00 | 0.16 | The article states the harbour light was first lit in 1888. ANSWER: 1888 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,510 | 0 | 1,514 | 0 | 6,656 | 198 | 0.8 | 0.0 | 43.0 | 43.0 | 0.00 | 0.18 | ANSWER: Gadget 30 — SKU: G-4096, In stock: 97 |
| `inventory-lookup` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,510 | 0 | 1,511 | 0 | 6,656 | 191 | 0.9 | 0.0 | 46.4 | 46.4 | 0.00 | 0.20 | ANSWER: Gadget 30 — SKU: G-4096, In stock: 97 |
| `inventory-lookup` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,246 | 0 | 3,840 | 113 | 1.4 | 0.0 | 37.4 | 37.4 | 0.00 | 0.18 | ANSWER: Gadget 30 — SKU G-4096, 97 in stock. |
| `churned-max` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 11,792 | 0 | 6,087 | 0 | 12,800 | 950 | 1.1 | 0.0 | 57.3 | 57.3 | 0.04 | 0.19 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 11,792 | 0 | 6,143 | 0 | 12,672 | 694 | 0.9 | 0.0 | 54.6 | 54.6 | 0.08 | 0.27 | ANSWER: Vertex 6 — $9,900 |
| `churned-max` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,895 | 0 | 5,856 | 0 | 12,800 | 726 | 1.0 | 0.0 | 52.7 | 52.7 | 0.03 | 0.21 | ANSWER: Vertex 6 — $9,900 |
| `search-pagination` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,323 | 0 | 2,676 | 0 | 17,024 | 298 | 1.0 | 0.0 | 111.1 | 111.1 | 0.01 | 0.24 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,323 | 0 | 2,716 | 0 | 17,024 | 310 | 1.0 | 0.0 | 103.2 | 103.2 | 0.02 | 0.17 | ANSWER: mira.k. |
| `search-pagination` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,348 | 0 | 2,584 | 0 | 17,152 | 332 | 0.8 | 0.0 | 58.8 | 58.8 | 0.01 | 0.18 | The result "Koala facts" is on page 4 and was opened; it shows "Written by mira.k." ANSWER: mira.k. |
| `feed-scroll` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,777 | 0 | 3,022 | 0 | 16,512 | 336 | 0.8 | 0.0 | 82.3 | 82.3 | 0.10 | 0.24 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,720 | 0 | 3,128 | 0 | 16,512 | 379 | 0.8 | 0.0 | 74.4 | 74.4 | 0.14 | 0.26 | Post #36 reads: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 4,302 | 0 | 3,630 | 0 | 22,912 | 360 | 0.8 | 0.0 | 74.3 | 74.3 | 0.04 | 0.23 | ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 738 | 0 | 1,122 | 0 | 8,320 | 226 | 0.9 | 0.0 | 43.6 | 43.6 | 0.01 | 0.19 | The file was deleted and the confirmation message appeared. ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,017 | 0 | 1,625 | 0 | 10,496 | 221 | 1.1 | 0.0 | 58.0 | 58.0 | 0.01 | 0.41 | ANSWER: Quarterly draft was moved to trash. |
| `modal-delete` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,017 | 0 | 1,433 | 0 | 10,752 | 285 | 1.1 | 0.0 | 59.6 | 59.6 | 0.01 | 0.27 | The "Quarterly draft" file has been removed from the list, and the confirmation message displayed is "Quarterly draft was moved to trash." ANSWER: Quarterly dr |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,075 | 0 | 2,152 | 0 | 15,360 | 283 | 0.9 | 0.0 | 99.1 | 99.1 | 0.03 | 0.17 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,075 | 0 | 2,152 | 0 | 15,360 | 283 | 0.8 | 0.0 | 92.6 | 92.6 | 0.04 | 0.24 | ANSWER: Theme saved: Midnight |
| `menu-settings` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,075 | 0 | 2,152 | 0 | 15,360 | 283 | 0.8 | 0.0 | 56.9 | 56.9 | 0.03 | 0.20 | ANSWER: Theme saved: Midnight |
| `spa-team` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,041 | 0 | 1,608 | 0 | 10,624 | 234 | 0.7 | 0.0 | 60.5 | 60.5 | 0.01 | 0.17 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,383 | 0 | 2,048 | 0 | 13,184 | 286 | 1.1 | 0.0 | 65.9 | 65.9 | 0.01 | 0.21 | ANSWER: priya@example.test |
| `spa-team` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,041 | 0 | 1,558 | 0 | 10,624 | 203 | 0.9 | 0.0 | 60.8 | 60.8 | 0.01 | 0.18 | ANSWER: priya@example.test |
| `plans-pick` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 913 | 0 | 5,888 | 128 | 1.3 | 0.0 | 53.7 | 53.7 | 0.01 | 0.15 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 909 | 0 | 5,888 | 133 | 1.3 | 0.0 | 45.4 | 45.4 | 0.01 | 0.17 | ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,276 | 0 | 8,064 | 166 | 1.0 | 0.0 | 51.4 | 51.4 | 0.01 | 0.18 | ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,309 | 0 | 8,192 | 186 | 1.0 | 0.0 | 57.4 | 57.4 | 0.00 | 0.19 | ANSWER: 45 days |
| `faq-refund` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 858 | 0 | 6,016 | 142 | 0.9 | 0.0 | 19.9 | 19.9 | 0.01 | 0.19 | ANSWER: 45 days |
| `faq-refund` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 863 | 0 | 6,016 | 145 | 0.8 | 0.0 | 18.6 | 18.6 | 0.01 | 0.18 | ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,198 | 0 | 1,688 | 0 | 11,008 | 279 | 0.7 | 0.0 | 56.0 | 56.0 | 0.05 | 0.20 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,198 | 0 | 1,788 | 0 | 10,880 | 265 | 0.8 | 0.0 | 74.8 | 74.8 | 0.03 | 0.17 | ANSWER: R-8064 |
| `iframe-pay` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,198 | 0 | 1,785 | 0 | 10,880 | 270 | 0.8 | 0.0 | 48.2 | 48.2 | 0.08 | 0.34 | ANSWER: R-8064 |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 908 | 0 | 5,888 | 175 | 0.7 | 0.0 | 9.5 | 9.5 | 0.00 | 0.22 | ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 914 | 0 | 5,888 | 154 | 0.9 | 0.0 | 7.4 | 7.4 | 0.00 | 0.19 | ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 340 | 1 | 1,428 | 0 | 8,064 | 209 | 0.9 | 0.0 | 58.3 | 58.3 | 0.00 | 0.18 | ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 23 | 0 | 24 | 0 | 8,530 | 0 | 9,319 | 0 | 109,056 | 1,784 | 1.1 | 0.0 | 249.3 | 249.3 | 0.31 | 0.17 | ANSWER: Order number S-5856, total charged $101.29. |
| `long-shop` | Mantis | 2 | success | 1 | 24 | 0 | 25 | 0 | 8,990 | 0 | 9,692 | 0 | 114,944 | 1,746 | 0.8 | 0.0 | 252.2 | 252.2 | 0.41 | 0.15 | ANSWER: Order #S-5856, total charged $101.29 |
| `long-shop` | Mantis | 3 | success | 1 | 24 | 0 | 25 | 0 | 9,451 | 0 | 11,348 | 0 | 133,376 | 3,117 | 0.9 | 0.0 | 279.0 | 279.0 | 0.31 | 0.15 | ANSWER: Order #S-5856, total charged $101.29. |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,261 | 0 | 9,475 | 0 | 56,832 | 1,343 | 1.1 | 0.0 | 171.9 | 171.9 | 0.43 | 0.15 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 2 | success | 1 | 12 | 0 | 10 | 0 | 15,879 | 0 | 7,843 | 0 | 48,000 | 1,013 | 0.8 | 0.0 | 155.2 | 155.2 | 0.44 | 0.16 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 3 | success | 1 | 12 | 0 | 10 | 0 | 15,853 | 0 | 7,936 | 0 | 48,512 | 1,185 | 0.8 | 0.0 | 118.6 | 118.6 | 0.55 | 0.18 | ANSWER: Saved 6 changes. Change set C-5365. |
| `long-onboard` | Mantis | 1 | success | 1 | 24 | 0 | 24 | 0 | 8,002 | 0 | 8,493 | 0 | 100,224 | 1,314 | 1.4 | 0.0 | 243.9 | 243.9 | 0.51 | 0.15 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 2 | success | 1 | 22 | 0 | 21 | 0 | 6,600 | 0 | 7,601 | 0 | 81,408 | 1,209 | 1.0 | 0.0 | 208.2 | 208.2 | 0.44 | 0.18 | ANSWER: W-8780 |
| `long-onboard` | Mantis | 3 | success | 1 | 24 | 0 | 25 | 0 | 7,167 | 0 | 8,837 | 0 | 99,456 | 1,345 | 0.8 | 0.0 | 222.6 | 222.6 | 0.55 | 0.18 | ANSWER: W-8780 |
| `long-laptops` | Mantis | 1 | success | 1 | 10 | 0 | 7 | 0 | 13,753 | 0 | 8,817 | 0 | 28,288 | 1,351 | 0.7 | 0.0 | 109.3 | 109.3 | 0.02 | 0.16 | All under-$1,000 laptops checked: Aero 13 (11h), Bolt 14 (9h), Cirrus Air (13.5h), Delta 15 (8h), Echo Flip (12h), Atlas 14 (16h), Orbit Go (10.5h). Atlas 14 ha |
| `long-laptops` | Mantis | 2 | success | 1 | 14 | 0 | 15 | 0 | 19,584 | 0 | 11,401 | 0 | 83,712 | 1,022 | 1.0 | 0.0 | 128.9 | 128.9 | 0.03 | 0.15 | ANSWER: Atlas 14 — 1.28 kg |
| `long-laptops` | Mantis | 3 | success | 1 | 10 | 0 | 8 | 0 | 13,657 | 0 | 7,640 | 0 | 34,432 | 958 | 0.8 | 0.0 | 78.7 | 78.7 | 0.02 | 0.19 | ANSWER: Atlas 14 — 1.28 kg |
