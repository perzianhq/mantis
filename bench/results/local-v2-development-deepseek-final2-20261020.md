# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 52 recorded so far; 52 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 17 / 19 | 14 / 17 | 11 / 16 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 2 | 3 | 5 |
| Tool calls (including retries) | 150 | 179 | 391 |
| Sarvam API attempts (including retries) | 166 | 172 | 391 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 299.8 | 383.0 | 949.7 |
| Sarvam limiter queue / cooldown (total, s) | 1348.7 / 0.0 | 1609.8 / 0.0 | 3733.6 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 265.0 / 0.0 | 341.7 / 0.0 | 863.3 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 2 | 0 | 0 |
| Browser observation text (observed chars) | 127,711 | 340,917 | 5,911 |
| Browser observation images (observed blocks) | 1 | 17 | 171 |
| Normal input tokens (total) | 96,994 | 201,967 | 746,144 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 542,592 | 1,420,288 | 1,674,368 |
| Output tokens (total) | 18,740 | 20,295 | 66,688 |
| Total input tokens incl. cache (legacy) | 639,586 | 1,622,255 | 2,420,512 |
| MCP startup (total, s) | 17.5 | 9.6 | 19.9 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 1648.5 | 1992.8 | 4683.2 |
| CLI wall (total, s) | 1648.5 | 1992.8 | 4683.2 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 3.2 | 2.9 | 2.6 |
| Harness capture (total, s) | 9.9 | 117.4 | 19.8 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 4.66 | 7.89 | 26.49 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,473 | 0 | 7,936 | 310 | 1.5 | 0.0 | 5.6 | 5.6 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,225 | 0 | 33,792 | 461 | 0.9 | 0.0 | 63.0 | 63.0 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 737 | 16 | 96,376 | 0 | 172,928 | 12,218 | 1.9 | 0.0 | 457.1 | 457.1 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,311 | 0 | 8,192 | 388 | 1.5 | 0.0 | 7.3 | 7.3 | 0.00 | 0.25 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,483 | 0 | 24,832 | 391 | 1.0 | 0.0 | 11.6 | 11.6 | 0.00 | 0.15 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 29 | 0 | 30 | 0 | 421 | 14 | 75,515 | 0 | 136,064 | 6,317 | 1.8 | 0.0 | 421.7 | 421.7 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,327 | 0 | 8,064 | 276 | 1.6 | 0.0 | 6.5 | 6.5 | 0.00 | 0.19 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,397 | 0 | 24,832 | 364 | 1.1 | 0.0 | 9.7 | 9.7 | 0.00 | 0.24 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 178 | 6 | 7,754 | 0 | 33,664 | 1,249 | 1.8 | 0.0 | 125.3 | 125.3 | 0.00 | 0.15 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,390 | 0 | 7,936 | 310 | 1.5 | 0.0 | 7.0 | 7.0 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,742 | 0 | 24,960 | 453 | 0.5 | 0.0 | 60.7 | 60.7 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 632 | 14 | 77,767 | 0 | 177,792 | 6,935 | 1.4 | 0.0 | 479.8 | 479.8 | 0.00 | 0.18 | sarvam CLI returned an error result |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,281 | 0 | 8,064 | 327 | 1.0 | 0.0 | 58.4 | 58.4 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,670 | 0 | 25,088 | 497 | 0.6 | 0.0 | 60.2 | 60.2 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 30 | 0 | 31 | 0 | 455 | 14 | 66,264 | 0 | 124,800 | 5,337 | 1.2 | 0.0 | 364.8 | 364.8 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,349 | 0 | 8,064 | 386 | 0.7 | 0.0 | 55.9 | 55.9 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,514 | 0 | 25,088 | 403 | 0.4 | 0.0 | 59.1 | 59.1 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 33 | 0 | 34 | 0 | 421 | 14 | 62,088 | 0 | 148,608 | 3,554 | 1.2 | 0.0 | 359.6 | 359.6 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 12,210 | 0 | 8,251 | 0 | 47,232 | 1,066 | 0.9 | 0.0 | 122.8 | 122.8 | 0.00 | 0.16 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 37 | 0 | 15 | 0 | 35,503 | 6 | 23,300 | 0 | 214,528 | 4,309 | 0.6 | 0.0 | 233.8 | 233.8 | 0.00 | 0.16 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 360 | 17 | 102,489 | 0 | 187,136 | 8,142 | 1.2 | 0.0 | 530.8 | 530.8 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 2 | wrong_answer | 1 | 12 | 1 | 11 | 0 | 17,592 | 0 | 12,347 | 0 | 49,664 | 3,111 | 0.7 | 0.0 | 126.5 | 126.5 | 0.00 | 0.17 | fixture check failed (3 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 37,290 | 10 | 55,378 | 0 | 645,248 | 5,597 | 0.4 | 0.0 | 477.9 | 477.9 | 0.00 | 0.24 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 487 | 16 | 81,179 | 0 | 165,376 | 5,856 | 1.0 | 0.0 | 360.0 | 360.0 | 0.00 | 0.16 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 10,264 | 0 | 7,069 | 0 | 38,272 | 1,048 | 0.7 | 0.0 | 113.6 | 113.6 | 0.00 | 0.16 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 29,694 | 0 | 10,877 | 0 | 7,552 | 276 | 0.4 | 0.0 | 6.2 | 6.2 | 0.00 | 0.16 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 376 | 16 | 96,560 | 0 | 176,384 | 6,764 | 1.1 | 0.0 | 427.2 | 427.2 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,372 | 0 | 19,200 | 541 | 0.7 | 0.0 | 63.4 | 63.4 | 0.00 | 0.15 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,289 | 0 | 29,440 | 606 | 0.4 | 0.0 | 110.9 | 110.9 | 0.00 | 0.16 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,243 | 0 | 9,856 | 489 | 1.0 | 0.0 | 59.3 | 59.3 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,567 | 0 | 19,200 | 602 | 0.7 | 0.0 | 62.0 | 62.0 | 0.00 | 0.16 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,075 | 0 | 29,184 | 480 | 0.4 | 0.0 | 66.3 | 66.3 | 0.00 | 0.15 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 195 | 5 | 6,061 | 0 | 22,656 | 538 | 1.0 | 0.0 | 95.0 | 95.0 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 4,863 | 0 | 3,581 | 0 | 15,104 | 407 | 0.7 | 0.0 | 61.1 | 61.1 | 0.00 | 0.15 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,076 | 0 | 29,312 | 536 | 0.4 | 0.0 | 63.1 | 63.1 | 0.00 | 0.16 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 195 | 2 | 3,412 | 0 | 9,728 | 542 | 1.0 | 0.0 | 114.6 | 114.6 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 16 | 0 | 17 | 0 | 10,522 | 0 | 8,051 | 0 | 62,848 | 1,517 | 0.7 | 0.0 | 180.2 | 180.2 | 0.00 | 0.21 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 19 | 0 | 20 | 0 | 269 | 8 | 12,461 | 0 | 91,264 | 3,355 | 1.1 | 0.0 | 238.2 | 238.2 | 0.00 | 0.14 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 20 | 0 | 21 | 0 | 12,665 | 1 | 11,172 | 0 | 93,824 | 3,353 | 0.8 | 0.0 | 242.7 | 242.7 | 0.00 | 0.16 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 18 | 0 | 19 | 0 | 21,936 | 0 | 11,935 | 0 | 109,824 | 1,593 | 0.4 | 0.0 | 182.3 | 182.3 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 28 | 0 | 18 | 0 | 422 | 8 | 11,100 | 0 | 64,896 | 2,067 | 1.1 | 0.0 | 237.4 | 237.4 | 0.00 | 0.15 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 19 | 0 | 20 | 0 | 12,110 | 0 | 8,720 | 0 | 77,696 | 1,194 | 0.7 | 0.0 | 188.6 | 188.6 | 0.00 | 0.21 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 17 | 0 | 18 | 0 | 17,182 | 1 | 11,175 | 0 | 102,912 | 2,449 | 0.5 | 0.0 | 246.5 | 246.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 23 | 0 | 24 | 0 | 281 | 11 | 33,826 | 0 | 88,576 | 2,253 | 1.1 | 0.0 | 238.7 | 238.7 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 3,336 | 0 | 3,386 | 0 | 18,304 | 881 | 0.7 | 0.0 | 108.9 | 108.9 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,612 | 0 | 31,232 | 603 | 0.4 | 0.0 | 108.1 | 108.1 | 0.00 | 0.17 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 10,049 | 0 | 64,640 | 1,072 | 1.0 | 0.0 | 173.7 | 173.7 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 9 | 1 | 9 | 0 | 3,324 | 0 | 4,712 | 0 | 23,424 | 2,009 | 0.7 | 0.0 | 119.5 | 119.5 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,628 | 0 | 31,232 | 658 | 0.5 | 0.0 | 118.5 | 118.5 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,849 | 0 | 15,360 | 577 | 0.8 | 0.0 | 60.7 | 60.7 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,591 | 0 | 31,232 | 619 | 0.5 | 0.0 | 114.8 | 114.8 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,786 | 0 | 14,208 | 437 | 0.8 | 0.0 | 57.8 | 57.8 | 0.00 | 0.16 | case-024 \| Select \| case-024 selected. |
