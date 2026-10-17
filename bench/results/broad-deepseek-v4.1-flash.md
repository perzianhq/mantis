# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-17; runs per task and approach: 3; 2 runs in parallel.
- Scope: 25 tasks × 3 approaches × 3 runs = 225 logical runs; 225 recorded so far; 225 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 73 / 75 | 75 / 75 | 68 / 75 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 2 | 0 | 7 |
| Tool calls (including retries) | 488 | 673 | 1,494 |
| Sarvam API attempts (including retries) | 534 | 735 | 1,523 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| MCP tool errors (including retries) | 1 | 5 | 0 |
| Browser observation text (observed chars) | 322,740 | 1,115,967 | 26,527 |
| Browser observation images (observed blocks) | 0 | 5 | 513 |
| Normal input tokens (total) | 255,374 | 566,343 | 2,138,881 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 1,734,784 | 5,785,088 | 8,114,432 |
| Output tokens (total) | 42,409 | 62,937 | 140,842 |
| Total input tokens incl. cache (legacy) | 1,990,158 | 6,351,431 | 10,253,313 |
| MCP startup (total, s) | 151.2 | 151.5 | 151.1 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 1919.4 | 2930.1 | 6107.5 |
| CLI wall (total, s) | 1919.4 | 2930.1 | 6107.5 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 12.1 | 11.8 | 10.8 |
| Harness capture (total, s) | 46.4 | 423.3 | 82.3 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 11.70 | 23.66 | 72.32 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,004 | 0 | 1,436 | 0 | 8,704 | 237 | 2.0 | 0.0 | 7.7 | 7.7 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 2,710 | 0 | 2,529 | 0 | 16,512 | 357 | 2.0 | 0.0 | 9.4 | 9.4 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 281 | 7 | 9,426 | 0 | 60,288 | 1,058 | 2.0 | 0.0 | 75.4 | 75.4 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,004 | 0 | 1,495 | 0 | 8,832 | 284 | 2.0 | 0.0 | 6.8 | 6.8 | 0.00 | 0.15 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 2,710 | 0 | 2,261 | 0 | 16,768 | 368 | 2.0 | 0.0 | 40.9 | 40.9 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 2 | success | 1 | 19 | 0 | 20 | 0 | 301 | 7 | 9,615 | 0 | 64,128 | 1,208 | 2.0 | 0.0 | 65.0 | 65.0 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,004 | 0 | 1,518 | 0 | 8,832 | 300 | 2.0 | 0.0 | 37.0 | 37.0 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 2,710 | 0 | 2,248 | 0 | 16,768 | 351 | 2.0 | 0.0 | 12.2 | 12.2 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 281 | 7 | 9,491 | 0 | 59,264 | 982 | 2.0 | 0.0 | 61.4 | 61.4 | 0.00 | 0.13 | Subscribed from Canada (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 965 | 0 | 1,584 | 0 | 8,704 | 275 | 2.0 | 0.0 | 13.7 | 13.7 | 0.00 | 0.13 | Signed in |
| `login` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,260 | 0 | 2,434 | 0 | 16,128 | 322 | 2.0 | 0.0 | 37.1 | 37.1 | 0.00 | 0.13 | Signed in |
| `login` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 202 | 2 | 3,293 | 0 | 10,624 | 390 | 2.0 | 0.0 | 16.9 | 16.9 | 0.00 | 0.13 | Signed in |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 965 | 0 | 1,588 | 0 | 8,704 | 238 | 2.0 | 0.0 | 12.3 | 12.3 | 0.00 | 0.14 | Signed in |
| `login` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,260 | 0 | 2,435 | 0 | 16,128 | 434 | 2.0 | 0.0 | 39.7 | 39.7 | 0.00 | 0.14 | Signed in |
| `login` | Screenshots (click by x,y) | 2 | success | 1 | 28 | 0 | 29 | 0 | 493 | 8 | 12,825 | 0 | 105,728 | 1,789 | 2.0 | 0.0 | 115.3 | 115.3 | 0.00 | 0.12 | Signed in |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 965 | 0 | 1,564 | 0 | 8,704 | 230 | 2.0 | 0.0 | 6.8 | 6.8 | 0.00 | 0.13 | Signed in |
| `login` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,260 | 0 | 2,299 | 0 | 16,256 | 324 | 2.0 | 0.0 | 13.5 | 13.5 | 0.00 | 0.14 | Signed in |
| `login` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 202 | 2 | 3,297 | 0 | 10,880 | 442 | 2.0 | 0.0 | 42.3 | 42.3 | 0.00 | 0.16 | Signed in |
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 702 | 0 | 1,496 | 0 | 8,576 | 241 | 2.0 | 0.0 | 10.0 | 10.0 | 0.00 | 0.13 | Added to cart (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,914 | 0 | 2,154 | 0 | 16,256 | 332 | 2.0 | 0.0 | 40.7 | 40.7 | 0.00 | 0.13 | Added to cart (1 item). |
| `cookie-cart` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 134 | 3 | 3,602 | 0 | 8,576 | 319 | 2.0 | 0.0 | 39.9 | 39.9 | 0.00 | 0.13 | Added to cart (1 item). |
| `cookie-cart` | Mantis | 2 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 518 | 0 | 1,065 | 0 | 6,784 | 225 | 2.1 | 0.0 | 5.4 | 5.4 | 0.00 | 0.13 | answer did not match the expected result |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,914 | 0 | 2,026 | 0 | 16,384 | 335 | 2.0 | 0.0 | 13.7 | 13.7 | 0.00 | 0.14 | Added to cart (1 item). |
| `cookie-cart` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 134 | 3 | 3,606 | 0 | 8,576 | 324 | 2.0 | 0.0 | 10.3 | 10.3 | 0.00 | 0.14 | Added to cart (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 518 | 0 | 1,058 | 0 | 6,784 | 228 | 2.0 | 0.0 | 33.9 | 33.9 | 0.00 | 0.13 | Added to cart (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,251 | 0 | 2,393 | 0 | 19,712 | 358 | 2.0 | 0.0 | 40.2 | 40.2 | 0.00 | 0.13 | Added to cart (1 item). |
| `cookie-cart` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 134 | 3 | 3,604 | 0 | 8,576 | 309 | 2.0 | 0.0 | 11.4 | 11.4 | 0.00 | 0.13 | Added to cart (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,368 | 0 | 1,905 | 0 | 9,600 | 282 | 2.0 | 0.0 | 9.9 | 9.9 | 0.00 | 0.13 | Detail for item 150 |
| `longlist-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 23,518 | 0 | 9,076 | 0 | 27,904 | 237 | 2.0 | 0.0 | 7.5 | 7.5 | 0.00 | 0.12 | Detail for item 150 |
| `longlist-item` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 154 | 3 | 3,832 | 0 | 10,368 | 382 | 2.0 | 0.0 | 40.4 | 40.4 | 0.00 | 0.13 | Detail for item 150 |
| `longlist-item` | Mantis | 2 | success | 1 | 7 | 1 | 8 | 0 | 1,627 | 0 | 2,933 | 0 | 17,536 | 861 | 2.0 | 0.0 | 46.4 | 46.4 | 0.00 | 0.13 | Detail for item 150 |
| `longlist-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 23,518 | 0 | 9,083 | 0 | 27,904 | 244 | 2.0 | 0.0 | 9.0 | 9.0 | 0.00 | 0.14 | Detail for item 150 |
| `longlist-item` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 154 | 3 | 3,766 | 0 | 10,368 | 376 | 2.0 | 0.0 | 14.5 | 14.5 | 0.00 | 0.13 | Detail for item 150 |
| `longlist-item` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 1,368 | 0 | 1,902 | 0 | 9,600 | 246 | 2.0 | 0.0 | 13.4 | 13.4 | 0.00 | 0.13 | answer did not match the expected result |
| `longlist-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,358 | 0 | 1,639 | 0 | 13,056 | 236 | 2.0 | 0.0 | 35.7 | 35.7 | 0.00 | 0.14 | Detail for item 150 |
| `longlist-item` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 154 | 3 | 3,976 | 0 | 10,368 | 418 | 2.0 | 0.0 | 39.6 | 39.6 | 0.00 | 0.13 | Detail for item 150 |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 794 | 0 | 966 | 0 | 4,864 | 133 | 2.0 | 0.0 | 7.4 | 7.4 | 0.00 | 0.15 | $29 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,305 | 0 | 2,133 | 0 | 13,056 | 234 | 2.0 | 0.0 | 7.8 | 7.8 | 0.00 | 0.13 | $29 per month |
| `pricing-team` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 116 | 2 | 2,476 | 0 | 4,352 | 237 | 2.0 | 0.0 | 5.0 | 5.0 | 0.00 | 0.12 | $29 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 794 | 0 | 966 | 0 | 4,864 | 146 | 2.0 | 0.0 | 10.3 | 10.3 | 0.00 | 0.13 | $29 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,305 | 0 | 1,857 | 0 | 13,312 | 232 | 2.0 | 0.0 | 33.3 | 33.3 | 0.00 | 0.13 | $29 per month |
| `pricing-team` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 116 | 2 | 2,398 | 0 | 4,352 | 203 | 2.0 | 0.0 | 30.0 | 30.0 | 0.00 | 0.14 | $29 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 794 | 0 | 972 | 0 | 4,864 | 180 | 2.0 | 0.0 | 10.7 | 10.7 | 0.00 | 0.14 | $29 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,305 | 0 | 1,854 | 0 | 13,312 | 355 | 2.0 | 0.0 | 10.4 | 10.4 | 0.00 | 0.15 | $29 per month |
| `pricing-team` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 116 | 2 | 2,390 | 0 | 4,352 | 204 | 2.0 | 0.0 | 7.3 | 7.3 | 0.00 | 0.13 | $29 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,963 | 0 | 5,387 | 0 | 10,880 | 241 | 2.0 | 0.0 | 8.7 | 8.7 | 0.00 | 0.14 | Last updated: just now; Initech 3 = $4,218 |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 20,162 | 0 | 7,956 | 0 | 33,280 | 490 | 2.0 | 0.0 | 32.9 | 32.9 | 0.00 | 0.13 | Last updated: just now; Initech 3 amount: $4,218 |
| `dashboard-refresh` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,864 | 0 | 8,832 | 512 | 2.0 | 0.0 | 38.9 | 38.9 | 0.00 | 0.13 | After refreshing, the "Last updated" line says "just now", and the amount for Initech 3 is $4,218. |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 10,963 | 0 | 5,389 | 0 | 10,880 | 228 | 2.0 | 0.0 | 13.1 | 13.1 | 0.00 | 0.14 | Last updated: just now; Initech 3 amount is $4,218 |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 37,236 | 0 | 13,059 | 0 | 24,448 | 381 | 2.0 | 0.0 | 9.3 | 9.3 | 0.00 | 0.13 | Last updated: just now; Initech 3 amount: $4,218 |
| `dashboard-refresh` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,670 | 0 | 8,832 | 474 | 2.0 | 0.0 | 11.6 | 11.6 | 0.00 | 0.12 | Last updated: just now; Initech 3 amount = $4,218 (Pending) |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,963 | 0 | 5,263 | 0 | 11,008 | 239 | 2.0 | 0.0 | 5.8 | 5.8 | 0.00 | 0.13 | Last updated: just now; Initech 3 = $4,218 |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 37,236 | 0 | 13,036 | 0 | 24,448 | 377 | 2.0 | 0.0 | 33.7 | 33.7 | 0.00 | 0.14 | Last updated: just now; Initech 3 amount = $4,218 |
| `dashboard-refresh` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,822 | 0 | 8,960 | 548 | 2.0 | 0.0 | 43.2 | 43.2 | 0.00 | 0.13 | Last updated: just now; Initech 3 amount = $4,218 |
| `signup-validation` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,495 | 0 | 2,562 | 0 | 15,744 | 464 | 2.0 | 0.0 | 14.9 | 14.9 | 0.00 | 0.13 | Welcome, new@example.com — "Your account is ready." |
| `signup-validation` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,909 | 0 | 3,604 | 0 | 27,264 | 709 | 2.0 | 0.0 | 43.9 | 43.9 | 0.00 | 0.15 | The page says "Welcome, new@example.com" and "Your account is ready." (the first attempt failed with "Password must be at least 8 characters.") |
| `signup-validation` | Screenshots (click by x,y) | 1 | success | 1 | 30 | 0 | 21 | 0 | 564 | 4 | 8,444 | 0 | 49,664 | 1,737 | 2.0 | 0.0 | 96.9 | 96.9 | 0.00 | 0.13 | Welcome, new@example.com — Your account is ready. |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,091 | 0 | 2,204 | 0 | 13,312 | 473 | 2.0 | 0.0 | 16.1 | 16.1 | 0.00 | 0.15 | "Your account is ready." (with heading "Welcome, new@example.com") |
| `signup-validation` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,909 | 0 | 3,355 | 0 | 27,520 | 704 | 2.0 | 0.0 | 39.5 | 39.5 | 0.00 | 0.14 | The page says "Welcome, new@example.com" and "Your account is ready." (the first attempt failed with "Password must be at least 8 characters.") |
| `signup-validation` | Screenshots (click by x,y) | 2 | success | 1 | 22 | 0 | 23 | 0 | 424 | 4 | 8,516 | 0 | 52,736 | 1,432 | 2.0 | 0.0 | 80.8 | 80.8 | 0.00 | 0.14 | Welcome, new@example.com — Your account is ready. |
| `signup-validation` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,495 | 0 | 2,463 | 0 | 16,128 | 552 | 2.0 | 0.0 | 17.5 | 17.5 | 0.00 | 0.12 | The page says "Welcome, new@example.com" and "Your account is ready." (after the first attempt failed with "Password must be at least 8 characters.") |
| `signup-validation` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 2,909 | 0 | 3,414 | 0 | 27,520 | 700 | 2.0 | 0.0 | 41.3 | 41.3 | 0.00 | 0.14 | Welcome, new@example.com — Your account is ready. |
| `signup-validation` | Screenshots (click by x,y) | 3 | success | 1 | 33 | 0 | 20 | 0 | 611 | 4 | 8,625 | 0 | 47,232 | 1,865 | 2.0 | 0.0 | 70.7 | 70.7 | 0.00 | 0.13 | The page says "Welcome, new@example.com" and "Your account is ready." (The first attempt failed with "Password must be at least 8 characters.") |
| `checkout-steps` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,584 | 0 | 2,843 | 0 | 17,920 | 419 | 2.0 | 0.0 | 42.9 | 42.9 | 0.00 | 0.14 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 3,732 | 0 | 4,039 | 0 | 35,712 | 647 | 2.0 | 0.0 | 48.8 | 48.8 | 0.00 | 0.13 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Screenshots (click by x,y) | 1 | success | 1 | 21 | 0 | 22 | 0 | 333 | 8 | 10,966 | 0 | 71,424 | 1,282 | 2.0 | 0.0 | 70.1 | 70.1 | 0.00 | 0.13 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,584 | 0 | 2,832 | 0 | 17,920 | 417 | 2.0 | 0.0 | 28.6 | 28.6 | 0.00 | 0.14 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 10 | 0 | 11 | 0 | 3,732 | 0 | 4,314 | 0 | 35,328 | 623 | 2.0 | 0.0 | 48.6 | 48.6 | 0.00 | 0.15 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Screenshots (click by x,y) | 2 | success | 1 | 39 | 0 | 40 | 0 | 643 | 14 | 59,944 | 0 | 182,912 | 2,496 | 2.0 | 0.0 | 158.3 | 158.3 | 0.00 | 0.13 | Order #A1042, total charged $27.50. |
| `checkout-steps` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,584 | 0 | 2,818 | 0 | 17,920 | 408 | 2.0 | 0.0 | 39.1 | 39.1 | 0.00 | 0.13 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 10 | 0 | 11 | 0 | 3,732 | 0 | 4,162 | 0 | 35,328 | 595 | 2.0 | 0.0 | 31.9 | 31.9 | 0.00 | 0.14 | Order #A1042, total charged $27.50 |
| `checkout-steps` | Screenshots (click by x,y) | 3 | success | 1 | 29 | 0 | 30 | 0 | 417 | 12 | 40,783 | 0 | 110,208 | 1,725 | 2.0 | 0.0 | 118.1 | 118.1 | 0.00 | 0.13 | Order #A1042 confirmed. Total charged: $27.50. |
| `booking-date` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,711 | 0 | 8,832 | 254 | 2.0 | 0.0 | 11.3 | 11.3 | 0.00 | 0.12 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,052 | 0 | 2,370 | 0 | 16,384 | 457 | 2.0 | 0.0 | 33.5 | 33.5 | 0.00 | 0.15 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Screenshots (click by x,y) | 1 | success | 1 | 55 | 0 | 56 | 0 | 753 | 17 | 120,780 | 0 | 411,520 | 7,835 | 2.0 | 0.0 | 239.3 | 239.3 | 0.00 | 0.14 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,666 | 0 | 8,960 | 343 | 2.0 | 0.0 | 33.0 | 33.0 | 0.00 | 0.14 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,589 | 0 | 2,726 | 0 | 19,968 | 471 | 2.0 | 0.0 | 15.0 | 15.0 | 0.00 | 0.12 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Screenshots (click by x,y) | 2 | success | 1 | 42 | 0 | 43 | 0 | 551 | 14 | 63,651 | 0 | 207,744 | 3,154 | 2.0 | 0.0 | 161.5 | 161.5 | 0.00 | 0.12 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,022 | 0 | 1,585 | 0 | 8,960 | 259 | 2.0 | 0.0 | 14.3 | 14.3 | 0.00 | 0.13 | The confirmation says: "Booked for 2026-12-24 at 19:00, 3 guests." |
| `booking-date` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,052 | 0 | 2,346 | 0 | 16,384 | 450 | 2.0 | 0.0 | 14.1 | 14.1 | 0.00 | 0.14 | Booked for 2026-12-24 at 19:00, 3 guests. |
| `booking-date` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 39 | 0 | 40 | 0 | 526 | 12 | 71,734 | 0 | 231,808 | 11,193 | 2.0 | 0.0 | 199.3 | 199.3 | 0.00 | 0.13 | fixture check failed (15 observations) |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,487 | 0 | 3,200 | 104 | 2.0 | 0.0 | 3.9 | 3.9 | 0.00 | 0.12 | 1874 |
| `article-deep-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 6,149 | 0 | 2,295 | 0 | 7,168 | 152 | 2.0 | 0.0 | 3.8 | 3.8 | 0.00 | 0.12 | 1874 |
| `article-deep-fact` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 113 | 2 | 2,368 | 0 | 4,352 | 271 | 2.0 | 0.0 | 28.8 | 28.8 | 0.00 | 0.15 | 1874 |
| `article-deep-fact` | Mantis | 2 | success | 1 | 3 | 0 | 3 | 0 | 5,128 | 0 | 2,033 | 0 | 5,888 | 284 | 2.0 | 0.0 | 4.0 | 4.0 | 0.00 | 0.15 | 1874 |
| `article-deep-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 6,149 | 0 | 2,165 | 0 | 7,296 | 171 | 2.0 | 0.0 | 8.7 | 8.7 | 0.00 | 0.22 | 1874 |
| `article-deep-fact` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 113 | 2 | 2,384 | 0 | 4,352 | 282 | 2.0 | 0.0 | 8.2 | 8.2 | 0.00 | 0.16 | 1874 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,615 | 0 | 3,072 | 129 | 2.0 | 0.0 | 21.7 | 21.7 | 0.00 | 0.15 | 1874 |
| `article-deep-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 6,149 | 0 | 2,039 | 0 | 7,424 | 164 | 2.0 | 0.0 | 6.6 | 6.6 | 0.00 | 0.13 | 1874 |
| `article-deep-fact` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 113 | 2 | 2,374 | 0 | 4,352 | 280 | 2.0 | 0.0 | 11.7 | 11.7 | 0.00 | 0.14 | 1874 |
| `inventory-lookup` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 1,447 | 0 | 1,248 | 0 | 3,072 | 129 | 2.0 | 0.0 | 2.5 | 2.5 | 0.00 | 0.12 | Widget 30 — SKU W-1203, 113 in stock. |
| `inventory-lookup` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 5,882 | 0 | 2,790 | 0 | 7,296 | 161 | 2.0 | 0.0 | 2.5 | 2.5 | 0.00 | 0.15 | SKU W-1203, 113 in stock |
| `inventory-lookup` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 114 | 2 | 2,379 | 0 | 4,352 | 230 | 2.0 | 0.0 | 22.7 | 22.7 | 0.00 | 0.12 | Widget 30 — SKU W-1203, 113 in stock. |
| `inventory-lookup` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 1,447 | 0 | 1,248 | 0 | 3,072 | 129 | 2.0 | 0.0 | 5.9 | 5.9 | 0.00 | 0.15 | Widget 30 — SKU W-1203, 113 in stock. |
| `inventory-lookup` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 5,882 | 0 | 2,916 | 0 | 7,168 | 166 | 2.0 | 0.0 | 6.4 | 6.4 | 0.00 | 0.16 | Widget 30 — SKU W-1203, 113 in stock. |
| `inventory-lookup` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 114 | 2 | 2,399 | 0 | 4,352 | 235 | 2.0 | 0.0 | 9.1 | 9.1 | 0.00 | 0.15 | SKU W-1203, 113 in stock |
| `inventory-lookup` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 1,447 | 0 | 1,120 | 0 | 3,200 | 124 | 2.0 | 0.0 | 2.0 | 2.0 | 0.00 | 0.14 | W-1203, 113 in stock |
| `inventory-lookup` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 5,882 | 0 | 2,785 | 0 | 7,296 | 160 | 2.0 | 0.0 | 2.9 | 2.9 | 0.00 | 0.15 | W-1203, 113 in stock |
| `inventory-lookup` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 114 | 2 | 2,437 | 0 | 4,352 | 243 | 2.0 | 0.0 | 4.7 | 4.7 | 0.00 | 0.13 | Widget 30 has SKU W-1203 and 113 in stock. |
| `churned-max` | Mantis | 1 | success | 1 | 3 | 0 | 3 | 0 | 6,194 | 0 | 3,622 | 0 | 6,912 | 880 | 2.0 | 0.0 | 23.6 | 23.6 | 0.00 | 0.13 | Acme 6 — $9,950 |
| `churned-max` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 28,128 | 0 | 10,192 | 0 | 15,616 | 667 | 2.0 | 0.0 | 22.1 | 22.1 | 0.00 | 0.16 | Acme 6 — $9,950 |
| `churned-max` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 148 | 5 | 6,141 | 0 | 22,528 | 2,658 | 2.0 | 0.0 | 34.5 | 34.5 | 0.00 | 0.14 | answer did not match the expected result |
| `churned-max` | Mantis | 2 | success | 1 | 4 | 0 | 4 | 0 | 11,865 | 0 | 5,945 | 0 | 11,264 | 1,031 | 2.0 | 0.0 | 15.2 | 15.2 | 0.00 | 0.14 | Acme 6 — $9,950 |
| `churned-max` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 18,620 | 0 | 6,448 | 0 | 7,424 | 903 | 2.0 | 0.0 | 10.9 | 10.9 | 0.00 | 0.18 | Acme 6 — $9,950 |
| `churned-max` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 148 | 5 | 5,695 | 0 | 22,528 | 1,553 | 2.0 | 0.0 | 36.8 | 36.8 | 0.00 | 0.14 | Acme 6 — $9,950 |
| `churned-max` | Mantis | 3 | success | 1 | 3 | 0 | 3 | 0 | 5,632 | 0 | 3,360 | 0 | 6,912 | 770 | 2.0 | 0.0 | 23.5 | 23.5 | 0.00 | 0.14 | Acme 6 — $9,950 |
| `churned-max` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 28,128 | 0 | 10,481 | 0 | 15,744 | 1,001 | 2.0 | 0.0 | 11.4 | 11.4 | 0.00 | 0.13 | Acme 6 — $9,950 |
| `churned-max` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 135 | 4 | 5,003 | 0 | 14,976 | 1,245 | 2.0 | 0.0 | 24.9 | 24.9 | 0.00 | 0.15 | Acme 6 — $9,950 |
| `search-pagination` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,303 | 0 | 2,578 | 0 | 14,464 | 328 | 2.0 | 0.0 | 20.8 | 20.8 | 0.00 | 0.13 | dana.r. |
| `search-pagination` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 8,885 | 0 | 5,856 | 0 | 41,728 | 517 | 2.0 | 0.0 | 42.3 | 42.3 | 0.00 | 0.17 | dana.r. |
| `search-pagination` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 204 | 6 | 7,198 | 0 | 30,720 | 598 | 2.0 | 0.0 | 54.8 | 54.8 | 0.00 | 0.15 | dana.r |
| `search-pagination` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,303 | 0 | 2,414 | 0 | 14,592 | 319 | 2.0 | 0.0 | 16.5 | 16.5 | 0.00 | 0.13 | dana.r. |
| `search-pagination` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 10 | 0 | 11 | 0 | 8,885 | 0 | 6,002 | 0 | 41,600 | 547 | 2.0 | 0.0 | 50.8 | 50.8 | 0.00 | 0.15 | dana.r. |
| `search-pagination` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 183 | 5 | 6,006 | 0 | 21,888 | 524 | 2.0 | 0.0 | 36.2 | 36.2 | 0.00 | 0.17 | dana.r. |
| `search-pagination` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,800 | 0 | 2,203 | 0 | 11,776 | 260 | 2.0 | 0.0 | 19.9 | 19.9 | 0.00 | 0.17 | dana.r. |
| `search-pagination` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 10 | 0 | 11 | 0 | 8,885 | 0 | 5,672 | 0 | 41,856 | 534 | 2.0 | 0.0 | 47.7 | 47.7 | 0.00 | 0.14 | dana.r. |
| `search-pagination` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 225 | 7 | 8,300 | 0 | 41,728 | 854 | 2.0 | 0.0 | 58.1 | 58.1 | 0.00 | 0.15 | dana.r |
| `feed-scroll` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,773 | 0 | 3,909 | 0 | 23,552 | 441 | 2.0 | 0.0 | 37.8 | 37.8 | 0.00 | 0.13 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 5,455 | 0 | 3,790 | 0 | 26,880 | 461 | 2.0 | 0.0 | 32.4 | 32.4 | 0.00 | 0.14 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 169 | 7 | 8,031 | 0 | 40,448 | 543 | 2.0 | 0.0 | 60.6 | 60.6 | 0.00 | 0.13 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 6,853 | 0 | 5,032 | 0 | 31,232 | 574 | 2.0 | 0.0 | 47.1 | 47.1 | 0.00 | 0.13 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 5,455 | 0 | 3,854 | 0 | 26,624 | 416 | 2.0 | 0.0 | 20.6 | 20.6 | 0.00 | 0.13 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 7 | 0 | 169 | 3 | 3,743 | 0 | 8,832 | 510 | 2.0 | 0.0 | 22.7 | 22.7 | 0.00 | 0.14 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,794 | 0 | 4,017 | 0 | 23,680 | 552 | 2.0 | 0.0 | 43.2 | 43.2 | 0.00 | 0.13 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 6,759 | 0 | 4,649 | 0 | 34,048 | 577 | 2.0 | 0.0 | 43.8 | 43.8 | 0.00 | 0.14 | The meeting moved to Thursday at noon. |
| `feed-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 169 | 7 | 7,885 | 0 | 40,832 | 604 | 2.0 | 0.0 | 53.2 | 53.2 | 0.00 | 0.12 | The meeting moved to Thursday at noon. |
| `modal-delete` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,346 | 0 | 1,788 | 0 | 10,880 | 243 | 2.0 | 0.0 | 22.7 | 22.7 | 0.00 | 0.13 | "Old report was moved to trash." |
| `modal-delete` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,157 | 0 | 2,700 | 0 | 20,096 | 328 | 2.0 | 0.0 | 32.7 | 32.7 | 0.00 | 0.14 | Old report was moved to trash. |
| `modal-delete` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,723 | 0 | 8,576 | 385 | 2.0 | 0.0 | 14.4 | 14.4 | 0.00 | 0.12 | "Old report was moved to trash." |
| `modal-delete` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,346 | 0 | 1,792 | 0 | 10,880 | 241 | 2.0 | 0.0 | 20.8 | 20.8 | 0.00 | 0.13 | Old report was moved to trash. |
| `modal-delete` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,157 | 0 | 2,705 | 0 | 20,096 | 330 | 2.0 | 0.0 | 31.4 | 31.4 | 0.00 | 0.14 | Old report was moved to trash. |
| `modal-delete` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,639 | 0 | 8,576 | 373 | 2.0 | 0.0 | 26.2 | 26.2 | 0.00 | 0.14 | Old report was moved to trash. |
| `modal-delete` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,346 | 0 | 1,799 | 0 | 10,880 | 268 | 2.0 | 0.0 | 20.9 | 20.9 | 0.00 | 0.13 | Old report was moved to trash. |
| `modal-delete` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,157 | 0 | 2,594 | 0 | 20,224 | 344 | 2.0 | 0.0 | 24.1 | 24.1 | 0.00 | 0.13 | Old report was moved to trash. |
| `modal-delete` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,685 | 0 | 8,576 | 375 | 2.0 | 0.0 | 36.7 | 36.7 | 0.00 | 0.12 | Old report was moved to trash. |
| `menu-settings` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 999 | 0 | 2,255 | 0 | 12,544 | 302 | 2.0 | 0.0 | 24.1 | 24.1 | 0.00 | 0.12 | Theme saved: Dark |
| `menu-settings` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 3,699 | 0 | 3,947 | 0 | 30,848 | 489 | 2.1 | 0.0 | 36.0 | 36.0 | 0.00 | 0.16 | Theme saved: Dark |
| `menu-settings` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 178 | 5 | 6,077 | 0 | 21,632 | 472 | 2.0 | 0.0 | 34.6 | 34.6 | 0.00 | 0.14 | "Theme saved: Dark" |
| `menu-settings` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 999 | 0 | 2,256 | 0 | 12,544 | 293 | 2.0 | 0.0 | 32.4 | 32.4 | 0.00 | 0.13 | Theme saved: Dark |
| `menu-settings` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 3,699 | 0 | 3,764 | 0 | 30,848 | 461 | 2.0 | 0.0 | 41.0 | 41.0 | 0.00 | 0.13 | Theme saved: Dark |
| `menu-settings` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 178 | 5 | 6,085 | 0 | 21,760 | 514 | 2.0 | 0.0 | 28.2 | 28.2 | 0.00 | 0.12 | Theme saved: Dark |
| `menu-settings` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 999 | 0 | 2,256 | 0 | 12,544 | 296 | 2.0 | 0.0 | 31.0 | 31.0 | 0.00 | 0.12 | Theme saved: Dark |
| `menu-settings` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 3,699 | 0 | 3,709 | 0 | 31,104 | 500 | 2.0 | 0.0 | 43.2 | 43.2 | 0.00 | 0.14 | Theme saved: Dark |
| `menu-settings` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 218 | 7 | 8,589 | 0 | 42,624 | 924 | 2.0 | 0.0 | 45.9 | 45.9 | 0.00 | 0.12 | Theme saved: Dark |
| `spa-team` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 643 | 0 | 1,240 | 0 | 6,656 | 190 | 2.0 | 0.0 | 13.8 | 13.8 | 0.00 | 0.12 | mia@example.com |
| `spa-team` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,078 | 0 | 2,851 | 0 | 19,584 | 318 | 2.0 | 0.0 | 31.6 | 31.6 | 0.00 | 0.13 | mia@example.com |
| `spa-team` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 133 | 3 | 3,585 | 0 | 8,576 | 318 | 2.0 | 0.0 | 32.0 | 32.0 | 0.00 | 0.12 | mia@example.com |
| `spa-team` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 643 | 0 | 1,111 | 0 | 6,784 | 188 | 2.0 | 0.0 | 10.6 | 10.6 | 0.00 | 0.12 | mia@example.com |
| `spa-team` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,078 | 0 | 2,723 | 0 | 19,712 | 327 | 2.0 | 0.0 | 21.7 | 21.7 | 0.00 | 0.14 | mia@example.com |
| `spa-team` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 133 | 3 | 3,639 | 0 | 8,576 | 365 | 2.0 | 0.0 | 26.7 | 26.7 | 0.00 | 0.13 | mia@example.com |
| `spa-team` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 643 | 0 | 1,241 | 0 | 6,656 | 191 | 2.0 | 0.0 | 22.2 | 22.2 | 0.00 | 0.17 | mia@example.com |
| `spa-team` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,078 | 0 | 2,549 | 0 | 19,968 | 343 | 2.0 | 0.0 | 26.2 | 26.2 | 0.00 | 0.13 | mia@example.com |
| `spa-team` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 133 | 3 | 3,653 | 0 | 8,576 | 361 | 2.0 | 0.0 | 19.2 | 19.2 | 0.00 | 0.13 | mia@example.com |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 542 | 0 | 1,099 | 0 | 6,656 | 164 | 2.0 | 0.0 | 10.2 | 10.2 | 0.00 | 0.12 | PRO-77 |
| `plans-pick` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,727 | 0 | 1,936 | 0 | 12,928 | 215 | 2.0 | 0.0 | 25.3 | 25.3 | 0.00 | 0.14 | PRO-77 |
| `plans-pick` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 112 | 2 | 2,426 | 0 | 4,352 | 220 | 2.0 | 0.0 | 22.6 | 22.6 | 0.00 | 0.14 | PRO-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 542 | 0 | 1,227 | 0 | 6,528 | 165 | 2.0 | 0.0 | 13.6 | 13.6 | 0.00 | 0.13 | PRO-77 |
| `plans-pick` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,727 | 0 | 1,936 | 0 | 12,928 | 227 | 2.0 | 0.0 | 13.9 | 13.9 | 0.00 | 0.13 | PRO-77 |
| `plans-pick` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 112 | 2 | 2,396 | 0 | 4,352 | 195 | 2.0 | 0.0 | 14.8 | 14.8 | 0.00 | 0.14 | PRO-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 542 | 0 | 1,227 | 0 | 6,528 | 157 | 2.0 | 0.0 | 10.2 | 10.2 | 0.00 | 0.12 | PRO-77 |
| `plans-pick` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,727 | 0 | 1,696 | 0 | 13,184 | 228 | 2.0 | 0.0 | 14.4 | 14.4 | 0.00 | 0.16 | PRO-77 |
| `plans-pick` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 112 | 2 | 2,436 | 0 | 4,352 | 237 | 2.0 | 0.0 | 25.8 | 25.8 | 0.00 | 0.15 | PRO-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 841 | 0 | 1,244 | 0 | 6,656 | 184 | 2.0 | 0.0 | 16.4 | 16.4 | 0.00 | 0.13 | 30 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,872 | 0 | 1,992 | 0 | 12,928 | 216 | 2.0 | 0.0 | 17.0 | 17.0 | 0.00 | 0.14 | 30 days |
| `faq-refund` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,410 | 0 | 4,352 | 218 | 2.0 | 0.0 | 16.3 | 16.3 | 0.00 | 0.13 | 30 days |
| `faq-refund` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 841 | 0 | 1,116 | 0 | 6,784 | 174 | 2.0 | 0.0 | 12.2 | 12.2 | 0.00 | 0.16 | 30 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,872 | 0 | 1,858 | 0 | 13,056 | 228 | 2.0 | 0.0 | 13.9 | 13.9 | 0.00 | 0.14 | 30 days |
| `faq-refund` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,402 | 0 | 4,352 | 216 | 2.0 | 0.0 | 22.5 | 22.5 | 0.00 | 0.14 | 30 days |
| `faq-refund` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 841 | 0 | 1,087 | 0 | 6,784 | 162 | 2.0 | 0.0 | 20.4 | 20.4 | 0.00 | 0.13 | 30 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,872 | 0 | 1,736 | 0 | 13,184 | 230 | 2.0 | 0.0 | 18.4 | 18.4 | 0.00 | 0.13 | 30 days |
| `faq-refund` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,400 | 0 | 4,352 | 225 | 2.0 | 0.0 | 15.3 | 15.3 | 0.00 | 0.13 | 30 days |
| `iframe-pay` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,812 | 0 | 9,088 | 349 | 2.0 | 0.0 | 13.4 | 13.4 | 0.00 | 0.14 | R-5531 |
| `iframe-pay` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,479 | 0 | 2,604 | 0 | 16,640 | 412 | 2.0 | 0.0 | 16.3 | 16.3 | 0.00 | 0.12 | R-5531 |
| `iframe-pay` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 224 | 2 | 4,132 | 0 | 14,464 | 555 | 2.0 | 0.0 | 43.0 | 43.0 | 0.00 | 0.15 | R-5531 |
| `iframe-pay` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,810 | 0 | 8,960 | 294 | 2.0 | 0.0 | 22.5 | 22.5 | 0.00 | 0.13 | R-5531 |
| `iframe-pay` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,479 | 0 | 2,444 | 0 | 16,768 | 402 | 2.0 | 0.0 | 24.0 | 24.0 | 0.00 | 0.21 | R-5531 |
| `iframe-pay` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 224 | 2 | 3,838 | 0 | 14,464 | 506 | 2.0 | 0.0 | 41.2 | 41.2 | 0.00 | 0.14 | R-5531 |
| `iframe-pay` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,156 | 0 | 1,690 | 0 | 9,088 | 296 | 2.0 | 0.0 | 13.8 | 13.8 | 0.00 | 0.14 | R-5531 |
| `iframe-pay` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,479 | 0 | 2,429 | 0 | 16,768 | 396 | 2.0 | 0.0 | 29.7 | 29.7 | 0.00 | 0.19 | R-5531 |
| `iframe-pay` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 224 | 2 | 3,870 | 0 | 14,464 | 521 | 2.0 | 0.0 | 37.8 | 37.8 | 0.00 | 0.15 | R-5531 |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 923 | 0 | 4,736 | 158 | 2.0 | 0.0 | 8.0 | 8.0 | 0.00 | 0.13 | 42 |
| `chart-march` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 12,019 | 1 | 7,456 | 0 | 22,016 | 1,071 | 2.0 | 0.0 | 31.0 | 31.0 | 0.00 | 0.14 | 42 |
| `chart-march` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 113 | 2 | 2,470 | 0 | 4,352 | 262 | 2.0 | 0.0 | 17.9 | 17.9 | 0.00 | 0.14 | 42 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 919 | 0 | 4,736 | 158 | 2.0 | 0.0 | 11.8 | 11.8 | 0.00 | 0.14 | 42 |
| `chart-march` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,575 | 2 | 5,819 | 0 | 31,872 | 1,903 | 2.0 | 0.0 | 37.4 | 37.4 | 0.00 | 0.15 | 42 |
| `chart-march` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 92 | 1 | 1,262 | 0 | 1,664 | 171 | 2.0 | 0.0 | 6.9 | 6.9 | 0.00 | 0.23 | 42 |
| `chart-march` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 791 | 0 | 4,864 | 146 | 2.0 | 0.0 | 5.4 | 5.4 | 0.00 | 0.14 | 42 |
| `chart-march` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 12,200 | 2 | 7,154 | 0 | 22,528 | 678 | 2.0 | 0.0 | 25.4 | 25.4 | 0.00 | 0.18 | 42 |
| `chart-march` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 92 | 1 | 1,268 | 0 | 1,664 | 294 | 2.0 | 0.0 | 17.8 | 17.8 | 0.00 | 0.21 | 42 |
| `long-shop` | Mantis | 1 | success | 1 | 20 | 0 | 21 | 0 | 6,571 | 0 | 8,540 | 0 | 78,848 | 1,830 | 2.0 | 0.0 | 80.6 | 80.6 | 0.00 | 0.20 | Order #S-1814, total charged $101.29 |
| `long-shop` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 31 | 1 | 32 | 0 | 62,444 | 0 | 29,217 | 0 | 435,840 | 2,928 | 2.0 | 0.0 | 126.7 | 126.7 | 0.00 | 0.15 | Order #S-1814, total charged $101.29 |
| `long-shop` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 93 | 0 | 94 | 0 | 1,222 | 34 | 246,754 | 0 | 736,640 | 12,271 | 2.0 | 0.0 | 389.7 | 389.7 | 0.00 | 0.13 | fixture check failed (281 observations) |
| `long-shop` | Mantis | 2 | success | 1 | 26 | 0 | 27 | 0 | 10,471 | 0 | 11,908 | 0 | 140,416 | 3,409 | 2.0 | 0.0 | 106.5 | 106.5 | 0.00 | 0.15 | Order number S-1814, total charged $101.29. |
| `long-shop` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 36 | 2 | 37 | 0 | 75,088 | 0 | 34,735 | 0 | 585,472 | 3,530 | 2.0 | 0.0 | 145.9 | 145.9 | 0.00 | 0.18 | Order number #S-1814, total charged $101.29 |
| `long-shop` | Screenshots (click by x,y) | 2 | success | 1 | 94 | 0 | 95 | 0 | 1,145 | 36 | 263,046 | 0 | 923,008 | 10,178 | 2.0 | 0.0 | 362.7 | 362.7 | 0.00 | 0.12 | Order number S-1814, total charged $101.29 |
| `long-shop` | Mantis | 3 | success | 1 | 20 | 0 | 21 | 0 | 6,553 | 0 | 8,210 | 0 | 77,568 | 1,793 | 2.0 | 0.0 | 70.2 | 70.2 | 0.00 | 0.14 | Order number S-1814, total charged $101.29 |
| `long-shop` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 38 | 1 | 39 | 0 | 79,975 | 0 | 36,581 | 0 | 642,688 | 3,339 | 2.0 | 0.0 | 151.9 | 151.9 | 0.00 | 0.20 | Order number #S-1814, total charged $101.29. |
| `long-shop` | Screenshots (click by x,y) | 3 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,924 | 31 | 225,830 | 0 | 901,120 | 9,898 | 2.0 | 0.0 | 378.5 | 378.5 | 0.00 | 0.13 | Agent step budget exhausted. |
| `long-admin` | Mantis | 1 | success | 1 | 17 | 0 | 15 | 0 | 29,440 | 0 | 13,756 | 0 | 110,976 | 1,780 | 2.0 | 0.0 | 60.2 | 60.2 | 0.00 | 0.13 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 28 | 0 | 29 | 0 | 106,800 | 0 | 42,876 | 0 | 617,472 | 5,606 | 2.0 | 0.0 | 129.2 | 129.2 | 0.00 | 0.18 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Screenshots (click by x,y) | 1 | success | 1 | 58 | 0 | 59 | 0 | 839 | 20 | 119,457 | 0 | 408,576 | 5,311 | 2.0 | 0.0 | 236.3 | 236.3 | 0.00 | 0.12 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Mantis | 2 | success | 1 | 21 | 0 | 19 | 0 | 41,431 | 0 | 19,412 | 0 | 176,384 | 3,087 | 2.0 | 0.0 | 78.0 | 78.0 | 0.00 | 0.12 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 30 | 1 | 30 | 0 | 80,708 | 0 | 37,474 | 0 | 613,376 | 6,009 | 2.0 | 0.0 | 114.2 | 114.2 | 0.00 | 0.17 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 21 | 0 | 22 | 0 | 338 | 10 | 39,099 | 0 | 112,256 | 8,551 | 2.0 | 0.0 | 109.4 | 109.4 | 0.00 | 0.13 | fixture check failed (14 observations) |
| `long-admin` | Mantis | 3 | success | 1 | 26 | 0 | 27 | 0 | 24,844 | 0 | 17,391 | 0 | 240,768 | 3,893 | 2.0 | 0.0 | 98.8 | 98.8 | 0.00 | 0.16 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 15 | 0 | 13 | 0 | 60,741 | 0 | 22,107 | 0 | 135,552 | 1,867 | 2.0 | 0.0 | 41.4 | 41.4 | 0.00 | 0.20 | Saved 6 changes. Change set C-5365. |
| `long-admin` | Screenshots (click by x,y) | 3 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,458 | 18 | 123,838 | 0 | 958,720 | 7,470 | 2.0 | 0.0 | 393.9 | 393.9 | 0.00 | 0.14 | Agent step budget exhausted. |
| `long-onboard` | Mantis | 1 | success | 1 | 23 | 0 | 22 | 0 | 7,089 | 0 | 8,026 | 0 | 79,488 | 1,345 | 2.0 | 0.0 | 85.9 | 85.9 | 0.00 | 0.18 | W-3248 |
| `long-onboard` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 31 | 0 | 31 | 0 | 50,862 | 0 | 24,869 | 0 | 348,544 | 2,123 | 2.0 | 0.0 | 120.0 | 120.0 | 0.00 | 0.17 | W-3248 |
| `long-onboard` | Screenshots (click by x,y) | 1 | success | 1 | 104 | 0 | 91 | 0 | 1,595 | 27 | 203,511 | 0 | 778,496 | 8,229 | 2.0 | 0.0 | 406.4 | 406.4 | 0.00 | 0.12 | W-3248 |
| `long-onboard` | Mantis | 2 | success | 1 | 24 | 0 | 24 | 0 | 8,178 | 0 | 9,072 | 0 | 89,728 | 1,569 | 2.0 | 0.0 | 86.1 | 86.1 | 0.00 | 0.13 | W-3248 |
| `long-onboard` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 31 | 0 | 30 | 0 | 50,970 | 0 | 25,022 | 0 | 340,480 | 2,455 | 2.0 | 0.0 | 157.7 | 157.7 | 0.00 | 0.18 | W-3248 |
| `long-onboard` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 18 | 0 | 19 | 0 | 330 | 6 | 10,603 | 0 | 58,752 | 4,787 | 2.0 | 0.0 | 108.9 | 108.9 | 0.00 | 0.18 | fixture check failed (15 observations) |
| `long-onboard` | Mantis | 3 | success | 1 | 23 | 0 | 22 | 0 | 7,857 | 0 | 8,003 | 0 | 79,488 | 1,366 | 2.0 | 0.0 | 67.4 | 67.4 | 0.00 | 0.13 | W-3248 |
| `long-onboard` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 34 | 0 | 32 | 0 | 51,903 | 0 | 25,675 | 0 | 378,624 | 2,687 | 2.0 | 0.0 | 108.9 | 108.9 | 0.00 | 0.15 | W-3248 |
| `long-onboard` | Screenshots (click by x,y) | 3 | success | 1 | 86 | 0 | 85 | 0 | 1,303 | 27 | 187,722 | 0 | 625,408 | 6,865 | 2.0 | 0.0 | 481.3 | 481.3 | 0.00 | 0.31 | W-3248 |
| `long-laptops` | Mantis | 1 | success | 1 | 8 | 0 | 5 | 0 | 12,668 | 0 | 6,410 | 0 | 12,544 | 1,019 | 2.0 | 0.0 | 22.9 | 22.9 | 0.00 | 1.81 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 16 | 0 | 17 | 0 | 21,043 | 0 | 12,048 | 0 | 127,872 | 1,589 | 2.0 | 0.0 | 61.5 | 61.5 | 0.00 | 0.29 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Screenshots (click by x,y) | 1 | success | 1 | 22 | 0 | 23 | 0 | 782 | 8 | 11,164 | 0 | 84,992 | 1,500 | 2.0 | 0.0 | 166.6 | 166.6 | 0.00 | 0.29 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Mantis | 2 | success | 1 | 8 | 0 | 5 | 0 | 12,668 | 0 | 6,448 | 0 | 12,416 | 1,039 | 2.0 | 0.0 | 19.4 | 19.4 | 0.00 | 0.26 | The Nimbus 14 ($949) has the longest battery life at 16 hours of video playback, and it weighs 1.35 kg. |
| `long-laptops` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 16 | 0 | 17 | 0 | 23,881 | 0 | 13,140 | 0 | 131,712 | 1,594 | 2.0 | 0.0 | 92.6 | 92.6 | 0.00 | 0.43 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Screenshots (click by x,y) | 2 | success | 1 | 32 | 0 | 33 | 0 | 1,046 | 12 | 43,674 | 0 | 140,800 | 2,336 | 2.0 | 0.0 | 129.0 | 129.0 | 0.00 | 0.25 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Mantis | 3 | success | 1 | 8 | 0 | 5 | 0 | 12,839 | 0 | 6,513 | 0 | 14,080 | 1,203 | 2.0 | 0.0 | 22.3 | 22.3 | 0.00 | 0.24 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 16 | 0 | 17 | 0 | 23,881 | 0 | 13,261 | 0 | 131,968 | 1,644 | 2.0 | 0.0 | 68.9 | 68.9 | 0.00 | 0.51 | Nimbus 14 — 1.35 kg |
| `long-laptops` | Screenshots (click by x,y) | 3 | success | 1 | 30 | 0 | 31 | 0 | 1,099 | 11 | 35,459 | 0 | 127,744 | 2,215 | 2.0 | 0.0 | 69.3 | 69.3 | 0.00 | 0.26 | Nimbus 14 — 1.35 kg |
