# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 288 recorded so far; 288 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 75 / 96 | 79 / 96 | 72 / 96 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 21 | 17 | 24 |
| Tool calls (including retries) | 753 | 1,081 | 1,645 |
| Sarvam API attempts (including retries) | 835 | 1,055 | 1,708 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1759.3 | 2895.4 | 3949.9 |
| Sarvam limiter queue / cooldown (total, s) | 13951.0 / 0.0 | 20027.2 / 0.0 | 30970.4 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 1424.2 / 0.0 | 2386.9 / 0.0 | 3283.0 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 7 | 14 | 4 |
| Browser observation text (observed chars) | 320,465 | 903,989 | 33,130 |
| Browser observation images (observed blocks) | 17 | 58 | 720 |
| Normal input tokens (total) | 339,001 | 698,711 | 2,574,145 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 2,367,360 | 7,047,680 | 6,639,104 |
| Output tokens (total) | 74,812 | 170,426 | 220,358 |
| Total input tokens incl. cache (legacy) | 2,706,361 | 7,746,391 | 9,213,249 |
| MCP startup (total, s) | 84.6 | 51.2 | 116.4 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 15710.3 | 22922.6 | 34920.3 |
| CLI wall (total, s) | 15710.3 | 22922.6 | 34920.3 |
| Fixture verification (total, s) | 0.1 | 0.0 | 0.0 |
| Cleanup (total, s) | 22.3 | 21.9 | 22.3 |
| Harness capture (total, s) | 55.4 | 628.8 | 90.4 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 17.51 | 38.89 | 90.81 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,465 | 0 | 7,936 | 364 | 1.5 | 0.0 | 7.5 | 7.5 | 0.00 | 0.25 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,138 | 0 | 33,920 | 460 | 1.0 | 0.0 | 13.3 | 13.3 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 26 | 0 | 27 | 0 | 498 | 12 | 62,805 | 0 | 130,048 | 6,990 | 1.9 | 0.0 | 368.4 | 368.4 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,334 | 0 | 8,064 | 275 | 1.5 | 0.0 | 7.9 | 7.9 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,461 | 0 | 24,832 | 372 | 1.1 | 0.0 | 9.0 | 9.0 | 0.00 | 0.24 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 11 | 0 | 201 | 5 | 6,444 | 0 | 23,552 | 1,036 | 1.9 | 0.0 | 124.4 | 124.4 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 3,277 | 0 | 2,754 | 0 | 10,624 | 338 | 1.6 | 0.0 | 63.4 | 63.4 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,095 | 0 | 33,920 | 473 | 1.1 | 0.0 | 14.3 | 14.3 | 0.00 | 0.19 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 17 | 0 | 18 | 0 | 240 | 8 | 10,577 | 0 | 69,120 | 2,061 | 1.9 | 0.0 | 241.7 | 241.7 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,366 | 0 | 7,936 | 276 | 1.5 | 0.0 | 7.1 | 7.1 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,663 | 0 | 24,960 | 407 | 0.6 | 0.0 | 59.2 | 59.2 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 659 | 12 | 46,975 | 0 | 175,360 | 3,891 | 1.3 | 0.0 | 361.1 | 361.1 | 0.00 | 0.17 | sarvam CLI returned an error result |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,252 | 0 | 8,064 | 303 | 1.1 | 0.0 | 55.6 | 55.6 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,355 | 0 | 24,960 | 313 | 0.7 | 0.0 | 56.0 | 56.0 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 29 | 0 | 30 | 0 | 379 | 12 | 47,313 | 0 | 132,736 | 3,249 | 1.2 | 0.0 | 298.2 | 298.2 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,286 | 0 | 8,064 | 308 | 1.0 | 0.0 | 51.8 | 51.8 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,580 | 0 | 24,960 | 373 | 0.4 | 0.0 | 58.6 | 58.6 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 445 | 14 | 76,783 | 0 | 201,856 | 8,553 | 1.2 | 0.0 | 475.1 | 475.1 | 0.00 | 0.17 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 1 | success | 1 | 22 | 0 | 23 | 0 | 22,251 | 0 | 16,683 | 0 | 163,328 | 2,847 | 0.8 | 0.0 | 247.4 | 247.4 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 22 | 0 | 14 | 0 | 34,125 | 5 | 23,134 | 0 | 199,936 | 6,115 | 0.5 | 0.0 | 249.7 | 249.7 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 384 | 16 | 84,664 | 0 | 172,544 | 6,681 | 1.1 | 0.0 | 424.1 | 424.1 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 2 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 12,307 | 0 | 6,365 | 0 | 8,832 | 825 | 0.8 | 0.0 | 9.5 | 9.5 | 0.00 | 0.17 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 17 | 0 | 13 | 0 | 33,371 | 5 | 20,486 | 0 | 170,624 | 3,727 | 0.5 | 0.0 | 189.7 | 189.7 | 0.00 | 0.18 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 374 | 17 | 82,877 | 0 | 158,848 | 6,785 | 1.1 | 0.0 | 418.1 | 418.1 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 12,354 | 0 | 6,606 | 0 | 11,520 | 542 | 0.7 | 0.0 | 9.2 | 9.2 | 0.00 | 0.21 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 21 | 0 | 22 | 0 | 34,835 | 7 | 24,974 | 0 | 353,536 | 4,528 | 0.5 | 0.0 | 294.8 | 294.8 | 0.00 | 0.18 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | success | 1 | 36 | 0 | 27 | 0 | 508 | 12 | 45,499 | 0 | 109,696 | 4,013 | 1.2 | 0.0 | 353.7 | 353.7 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,530 | 0 | 19,072 | 504 | 0.8 | 0.0 | 111.7 | 111.7 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,284 | 0 | 29,440 | 570 | 0.4 | 0.0 | 109.8 | 109.8 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,491 | 0 | 9,728 | 528 | 1.1 | 0.0 | 102.8 | 102.8 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,271 | 0 | 19,200 | 455 | 0.8 | 0.0 | 62.5 | 62.5 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 5,731 | 0 | 4,066 | 0 | 29,440 | 606 | 0.5 | 0.0 | 119.6 | 119.6 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 195 | 5 | 6,273 | 0 | 22,912 | 657 | 1.1 | 0.0 | 69.7 | 69.7 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,411 | 0 | 19,200 | 614 | 0.9 | 0.0 | 66.6 | 66.6 | 0.00 | 0.23 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,265 | 0 | 29,568 | 617 | 0.5 | 0.0 | 66.4 | 66.4 | 0.00 | 0.22 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,309 | 0 | 9,856 | 539 | 1.1 | 0.0 | 61.7 | 61.7 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | wrong_answer | 1 | 17 | 0 | 18 | 0 | 12,203 | 0 | 9,283 | 0 | 64,768 | 1,527 | 0.8 | 0.0 | 181.1 | 181.1 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | cli_error | 1 | 47 | 0 | 35 | 0 | 39,795 | 6 | 49,261 | 0 | 641,280 | 25,078 | 0.6 | 0.0 | 951.2 | 951.2 | 0.00 | 0.25 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 17 | 0 | 18 | 0 | 233 | 8 | 10,097 | 0 | 60,544 | 1,396 | 1.5 | 0.0 | 176.6 | 176.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-list-virtual-target` | Mantis | 2 | wrong_answer | 1 | 18 | 0 | 15 | 0 | 12,529 | 0 | 8,593 | 0 | 58,880 | 1,783 | 1.1 | 0.0 | 178.9 | 178.9 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 28 | 0 | 29 | 0 | 21,816 | 5 | 25,238 | 0 | 338,432 | 9,496 | 0.7 | 0.0 | 482.6 | 482.6 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 27 | 0 | 28 | 0 | 392 | 9 | 20,837 | 0 | 114,688 | 2,413 | 1.3 | 0.0 | 347.2 | 347.2 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-virtual-target` | Mantis | 3 | wrong_answer | 1 | 13 | 0 | 14 | 0 | 8,666 | 0 | 6,171 | 0 | 41,600 | 1,058 | 0.8 | 0.0 | 125.7 | 125.7 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 33 | 0 | 34 | 0 | 34,410 | 1 | 22,791 | 0 | 346,368 | 4,767 | 0.5 | 0.0 | 489.3 | 489.3 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 28 | 0 | 29 | 0 | 392 | 10 | 28,243 | 0 | 123,904 | 2,278 | 1.1 | 0.0 | 407.5 | 407.5 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-list-paginated-filter` | Mantis | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,859 | 0 | 15,232 | 524 | 0.8 | 0.0 | 68.8 | 68.8 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,704 | 0 | 31,104 | 635 | 0.5 | 0.0 | 112.5 | 112.5 | 0.00 | 0.26 | answer did not match the expected result |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 9,995 | 0 | 65,024 | 1,198 | 1.1 | 0.0 | 234.7 | 234.7 | 0.00 | 0.27 | answer did not match the expected result |
| `v2-list-paginated-filter` | Mantis | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 3,497 | 0 | 4,415 | 0 | 22,400 | 1,845 | 0.8 | 0.0 | 118.4 | 118.4 | 0.00 | 0.70 | answer did not match the expected result |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,592 | 0 | 31,232 | 633 | 0.5 | 0.0 | 109.7 | 109.7 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 10,013 | 0 | 64,768 | 1,370 | 1.0 | 0.0 | 348.1 | 348.1 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-paginated-filter` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,574 | 0 | 2,327 | 0 | 12,416 | 467 | 0.8 | 0.0 | 58.7 | 58.7 | 0.00 | 0.31 | answer did not match the expected result |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,640 | 0 | 31,232 | 623 | 0.5 | 0.0 | 120.9 | 120.9 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 18 | 0 | 19 | 0 | 286 | 8 | 10,403 | 0 | 66,048 | 1,282 | 1.8 | 0.0 | 471.2 | 471.2 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-reordered-item` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,777 | 0 | 14,208 | 410 | 0.8 | 0.0 | 72.3 | 72.3 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 7,106 | 0 | 28,800 | 956 | 0.5 | 0.0 | 132.2 | 132.2 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | 1 | 21 | 0 | 22 | 0 | 300 | 9 | 23,189 | 0 | 98,816 | 5,130 | 1.2 | 0.0 | 493.2 | 493.2 | 0.00 | 0.20 | case-024 \| Select \| case-024 selected |
| `v2-list-reordered-item` | Mantis | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,763 | 0 | 14,336 | 497 | 0.8 | 0.0 | 66.9 | 66.9 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 16,451 | 0 | 6,911 | 0 | 28,928 | 637 | 0.6 | 0.0 | 118.0 | 118.0 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 604 | 16 | 105,251 | 0 | 208,768 | 12,537 | 1.1 | 0.0 | 790.1 | 790.1 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-list-reordered-item` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,603 | 0 | 14,336 | 408 | 0.8 | 0.0 | 110.3 | 110.3 | 0.00 | 0.22 | answer did not match the expected result |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,920 | 0 | 28,928 | 593 | 0.5 | 0.0 | 118.5 | 118.5 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 840 | 15 | 76,950 | 0 | 181,888 | 6,231 | 1.1 | 0.0 | 894.3 | 894.3 | 0.00 | 0.24 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Mantis | 1 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 16,875 | 0 | 9,884 | 0 | 78,336 | 1,851 | 0.8 | 0.0 | 351.9 | 351.9 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 29 | 0 | 30 | 0 | 47,855 | 2 | 24,657 | 0 | 334,464 | 4,465 | 0.5 | 0.0 | 705.2 | 705.2 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | 1 | 28 | 0 | 29 | 0 | 365 | 11 | 44,002 | 0 | 136,320 | 4,656 | 1.1 | 0.0 | 477.4 | 477.4 | 0.00 | 0.23 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 2 | wrong_answer | 1 | 17 | 0 | 18 | 0 | 16,923 | 0 | 10,396 | 0 | 84,352 | 1,946 | 0.8 | 0.0 | 304.5 | 304.5 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 72 | 0 | 35 | 0 | 40,892 | 8 | 39,868 | 0 | 570,112 | 15,840 | 0.5 | 0.0 | 950.6 | 950.6 | 0.00 | 0.25 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | success | 1 | 31 | 0 | 32 | 0 | 397 | 12 | 48,729 | 0 | 157,952 | 4,079 | 1.1 | 0.0 | 717.9 | 717.9 | 0.00 | 0.25 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 3 | wrong_answer | 1 | 17 | 0 | 18 | 0 | 16,923 | 0 | 10,228 | 0 | 83,456 | 2,505 | 0.8 | 0.0 | 311.2 | 311.2 | 0.00 | 0.22 | answer did not match the expected result |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | cli_error | 1 | 80 | 1 | 35 | 0 | 36,759 | 2 | 32,896 | 0 | 441,472 | 16,042 | 0.5 | 0.0 | 899.4 | 899.4 | 0.00 | 0.24 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 33 | 0 | 29 | 0 | 398 | 13 | 59,672 | 0 | 112,640 | 4,600 | 1.1 | 0.0 | 588.6 | 588.6 | 0.00 | 0.28 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,148 | 0 | 11,136 | 489 | 0.8 | 0.0 | 124.3 | 124.3 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,385 | 0 | 7,424 | 174 | 0.5 | 0.0 | 59.2 | 59.2 | 0.00 | 0.21 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,449 | 0 | 1,664 | 209 | 1.1 | 0.0 | 62.6 | 62.6 | 0.00 | 0.24 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 735 | 0 | 1,073 | 0 | 7,040 | 264 | 0.8 | 0.0 | 68.7 | 68.7 | 0.00 | 0.22 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,257 | 0 | 7,552 | 175 | 0.6 | 0.0 | 50.4 | 50.4 | 0.00 | 0.22 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,445 | 0 | 1,664 | 280 | 1.1 | 0.0 | 58.3 | 58.3 | 0.00 | 0.21 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 4 | 0 | 4 | 0 | 992 | 0 | 1,181 | 0 | 7,168 | 332 | 0.8 | 0.0 | 117.5 | 117.5 | 0.00 | 0.23 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,259 | 0 | 7,552 | 183 | 0.5 | 0.0 | 52.5 | 52.5 | 0.00 | 0.21 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,451 | 0 | 1,664 | 417 | 1.2 | 0.0 | 58.0 | 58.0 | 0.00 | 0.25 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 824 | 0 | 1,011 | 0 | 5,120 | 183 | 0.8 | 0.0 | 56.3 | 56.3 | 0.00 | 0.22 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,170 | 0 | 7,552 | 214 | 0.5 | 0.0 | 114.0 | 114.0 | 0.00 | 0.20 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 143 | 1.1 | 0.0 | 59.8 | 59.8 | 0.00 | 0.25 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 667 | 0 | 585 | 0 | 3,328 | 120 | 0.9 | 0.0 | 61.3 | 61.3 | 0.00 | 0.25 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,342 | 0 | 2,222 | 0 | 14,080 | 708 | 0.5 | 0.0 | 178.7 | 178.7 | 0.00 | 0.25 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 170 | 1.2 | 0.0 | 109.5 | 109.5 | 0.00 | 0.27 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,491 | 0 | 1,401 | 0 | 7,296 | 273 | 0.8 | 0.0 | 107.8 | 107.8 | 0.00 | 0.24 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,178 | 0 | 7,552 | 281 | 0.5 | 0.0 | 59.3 | 59.3 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,458 | 0 | 1,664 | 152 | 1.2 | 0.0 | 63.9 | 63.9 | 0.00 | 0.23 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 691 | 1 | 1,920 | 0 | 10,880 | 3,479 | 0.8 | 0.0 | 135.2 | 135.2 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 913 | 1 | 1,600 | 0 | 7,552 | 203 | 0.5 | 0.0 | 59.9 | 59.9 | 0.00 | 0.23 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,454 | 0 | 1,664 | 160 | 1.2 | 0.0 | 54.6 | 54.6 | 0.00 | 0.33 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 691 | 1 | 1,855 | 0 | 11,008 | 390 | 0.8 | 0.0 | 114.8 | 114.8 | 0.00 | 0.22 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 933 | 1 | 1,621 | 0 | 7,552 | 298 | 0.5 | 0.0 | 110.2 | 110.2 | 0.00 | 0.18 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,460 | 0 | 1,664 | 186 | 1.8 | 0.0 | 12.5 | 12.5 | 0.00 | 0.21 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,544 | 0 | 9,088 | 347 | 1.2 | 0.0 | 69.2 | 69.2 | 0.00 | 0.24 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 913 | 1 | 1,600 | 0 | 7,552 | 203 | 0.7 | 0.0 | 59.8 | 59.8 | 0.00 | 0.22 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,454 | 0 | 1,664 | 194 | 1.2 | 0.0 | 58.8 | 58.8 | 0.00 | 0.24 | Dock C \| min \| 17 |
| `v2-chart-responsive` | Mantis | 1 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 550 | 1 | 1,371 | 0 | 7,168 | 324 | 1.0 | 0.0 | 110.1 | 110.1 | 0.00 | 0.26 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,288 | 0 | 10,496 | 2,356 | 0.5 | 0.0 | 123.2 | 123.2 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,438 | 0 | 1,664 | 231 | 1.1 | 0.0 | 37.2 | 37.2 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-chart-responsive` | Mantis | 2 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 550 | 1 | 1,375 | 0 | 7,296 | 404 | 0.8 | 0.0 | 62.3 | 62.3 | 0.00 | 0.25 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,281 | 0 | 10,496 | 350 | 0.5 | 0.0 | 58.7 | 58.7 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,438 | 0 | 1,664 | 477 | 1.3 | 0.0 | 121.6 | 121.6 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-chart-responsive` | Mantis | 3 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 976 | 0 | 1,287 | 0 | 7,296 | 340 | 0.9 | 0.0 | 62.8 | 62.8 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,323 | 0 | 10,496 | 569 | 0.6 | 0.0 | 114.6 | 114.6 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,444 | 0 | 1,664 | 374 | 1.1 | 0.0 | 63.2 | 63.2 | 0.00 | 0.23 | Bookings by quarter \| Q4 \| 147 |
| `v2-interaction-form-preferences` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,750 | 0 | 8,832 | 270 | 0.9 | 0.0 | 54.0 | 54.0 | 0.00 | 0.24 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,560 | 0 | 17,024 | 350 | 0.5 | 0.0 | 122.5 | 122.5 | 0.00 | 0.23 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 684 | 17 | 86,494 | 0 | 142,848 | 4,675 | 1.1 | 0.0 | 730.2 | 730.2 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-interaction-form-preferences` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,611 | 0 | 8,960 | 265 | 0.9 | 0.0 | 122.5 | 122.5 | 0.00 | 0.23 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,384 | 0 | 17,280 | 389 | 0.7 | 0.0 | 124.6 | 124.6 | 0.00 | 0.24 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 719 | 15 | 72,585 | 0 | 153,472 | 4,153 | 1.1 | 0.0 | 843.7 | 843.7 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-interaction-form-preferences` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,602 | 0 | 8,960 | 265 | 0.8 | 0.0 | 112.7 | 112.7 | 0.00 | 0.24 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,371 | 0 | 17,280 | 388 | 0.5 | 0.0 | 220.4 | 220.4 | 0.00 | 0.22 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | success | 1 | 34 | 0 | 35 | 0 | 449 | 15 | 63,058 | 0 | 150,656 | 2,902 | 1.2 | 0.0 | 785.6 | 785.6 | 0.00 | 0.26 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-frame-payment` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,591 | 0 | 8,960 | 247 | 0.8 | 0.0 | 124.5 | 124.5 | 0.00 | 0.23 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,262 | 0 | 17,024 | 360 | 0.6 | 0.0 | 122.0 | 122.0 | 0.00 | 0.26 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,513 | 0 | 36,096 | 720 | 1.1 | 0.0 | 353.2 | 353.2 | 0.00 | 0.22 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,368 | 0 | 1,811 | 0 | 11,520 | 336 | 0.8 | 0.0 | 117.4 | 117.4 | 0.00 | 0.22 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,258 | 0 | 17,024 | 361 | 0.5 | 0.0 | 118.4 | 118.4 | 0.00 | 0.20 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,707 | 0 | 35,584 | 693 | 1.2 | 0.0 | 412.0 | 412.0 | 0.00 | 0.23 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,459 | 0 | 9,088 | 241 | 0.8 | 0.0 | 106.3 | 106.3 | 0.00 | 0.20 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,256 | 0 | 17,024 | 370 | 0.5 | 0.0 | 128.4 | 128.4 | 0.00 | 0.26 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,563 | 0 | 36,480 | 782 | 1.4 | 0.0 | 362.8 | 362.8 | 0.00 | 0.23 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-combobox` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,143 | 0 | 2,615 | 0 | 15,488 | 506 | 0.9 | 0.0 | 182.2 | 182.2 | 0.00 | 0.23 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 3,407 | 0 | 3,867 | 0 | 35,328 | 679 | 0.6 | 0.0 | 177.7 | 177.7 | 0.00 | 0.22 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,627 | 0 | 35,456 | 785 | 1.2 | 0.0 | 369.7 | 369.7 | 0.00 | 0.23 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 908 | 0 | 1,816 | 0 | 13,440 | 380 | 0.8 | 0.0 | 172.6 | 172.6 | 0.00 | 0.24 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 13 | 1 | 14 | 0 | 4,487 | 1 | 6,249 | 0 | 54,272 | 1,568 | 0.6 | 0.0 | 300.8 | 300.8 | 0.00 | 0.25 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,493 | 0 | 35,712 | 715 | 1.1 | 0.0 | 301.7 | 301.7 | 0.00 | 0.21 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 3 | success | 1 | 22 | 2 | 23 | 0 | 2,482 | 1 | 7,492 | 0 | 71,424 | 2,236 | 0.9 | 0.0 | 539.7 | 539.7 | 0.00 | 0.28 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 3,408 | 1 | 4,228 | 0 | 32,768 | 700 | 0.5 | 0.0 | 248.2 | 248.2 | 0.00 | 0.22 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 192 | 3 | 3,982 | 0 | 10,624 | 431 | 1.1 | 0.0 | 128.7 | 128.7 | 0.00 | 0.24 | West Ridge assigned. |
| `v2-interaction-form-validation-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,771 | 0 | 11,008 | 281 | 0.8 | 0.0 | 111.7 | 111.7 | 0.00 | 0.21 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,862 | 0 | 23,936 | 473 | 0.5 | 0.0 | 229.7 | 229.7 | 0.00 | 0.24 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 267 | 4 | 5,958 | 0 | 24,192 | 898 | 1.1 | 0.0 | 295.0 | 295.0 | 0.00 | 0.22 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,648 | 0 | 11,136 | 282 | 0.8 | 0.0 | 109.5 | 109.5 | 0.00 | 0.24 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,859 | 0 | 23,808 | 429 | 0.5 | 0.0 | 228.7 | 228.7 | 0.00 | 0.25 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,530 | 0 | 20,096 | 562 | 1.1 | 0.0 | 229.5 | 229.5 | 0.00 | 0.23 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,643 | 0 | 11,136 | 281 | 0.8 | 0.0 | 105.0 | 105.0 | 0.00 | 0.21 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,844 | 0 | 23,808 | 416 | 0.5 | 0.0 | 178.1 | 178.1 | 0.00 | 0.24 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,480 | 0 | 20,224 | 574 | 1.1 | 0.0 | 428.9 | 428.9 | 0.00 | 0.22 | Invite sent to ada@northwind.test. |
| `v2-interaction-overlay-dialog` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 929 | 0 | 1,776 | 0 | 11,008 | 280 | 0.9 | 0.0 | 68.9 | 68.9 | 0.00 | 0.25 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,589 | 0 | 20,096 | 409 | 0.7 | 0.0 | 176.8 | 176.8 | 0.00 | 0.22 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,606 | 0 | 9,088 | 340 | 1.1 | 0.0 | 231.9 | 231.9 | 0.00 | 0.27 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,322 | 0 | 8,960 | 214 | 0.8 | 0.0 | 67.5 | 67.5 | 0.00 | 0.22 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,621 | 0 | 20,096 | 379 | 0.5 | 0.0 | 175.6 | 175.6 | 0.00 | 0.21 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,622 | 0 | 9,088 | 342 | 1.1 | 0.0 | 129.6 | 129.6 | 0.00 | 0.21 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,309 | 0 | 8,960 | 208 | 0.8 | 0.0 | 65.5 | 65.5 | 0.00 | 0.24 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,541 | 0 | 20,096 | 369 | 0.5 | 0.0 | 171.9 | 171.9 | 0.00 | 0.23 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,626 | 0 | 9,088 | 373 | 1.1 | 0.0 | 176.3 | 176.3 | 0.00 | 0.27 | Report exported with essential privacy. |
| `v2-interaction-overlay-shadow` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,447 | 0 | 8,832 | 214 | 1.2 | 0.0 | 122.4 | 122.4 | 0.00 | 0.26 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,106 | 0 | 16,768 | 322 | 0.5 | 0.0 | 118.4 | 118.4 | 0.00 | 0.24 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 8,831 | 0 | 52,736 | 890 | 1.2 | 0.0 | 423.2 | 423.2 | 0.00 | 0.26 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 449 | 0 | 962 | 0 | 7,040 | 200 | 0.8 | 0.0 | 119.3 | 119.3 | 0.00 | 0.23 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,061 | 0 | 16,768 | 307 | 0.5 | 0.0 | 116.8 | 116.8 | 0.00 | 0.23 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 9,086 | 0 | 53,248 | 996 | 1.1 | 0.0 | 350.8 | 350.8 | 0.00 | 0.26 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,316 | 0 | 8,960 | 213 | 0.8 | 0.0 | 118.9 | 118.9 | 0.00 | 0.24 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,135 | 0 | 16,768 | 325 | 0.6 | 0.0 | 69.7 | 69.7 | 0.00 | 0.26 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 3 | success | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 9,062 | 0 | 52,864 | 941 | 1.2 | 0.0 | 539.4 | 539.4 | 0.00 | 0.21 | Compact density applied. |
| `v2-interaction-overlay-modal` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 1,948 | 0 | 13,312 | 364 | 0.8 | 0.0 | 119.5 | 119.5 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,771 | 0 | 23,552 | 454 | 0.6 | 0.0 | 179.3 | 179.3 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,374 | 0 | 19,840 | 515 | 1.1 | 0.0 | 236.3 | 236.3 | 0.00 | 0.26 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,393 | 0 | 2,205 | 0 | 15,872 | 388 | 0.9 | 0.0 | 175.4 | 175.4 | 0.00 | 0.24 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,713 | 0 | 23,552 | 491 | 0.6 | 0.0 | 287.9 | 287.9 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,298 | 0 | 19,712 | 479 | 1.1 | 0.0 | 348.6 | 348.6 | 0.00 | 0.25 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 1,916 | 0 | 13,312 | 316 | 0.8 | 0.0 | 128.4 | 128.4 | 0.00 | 0.23 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,673 | 0 | 23,552 | 430 | 0.5 | 0.0 | 173.5 | 173.5 | 0.00 | 0.25 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,246 | 0 | 19,968 | 515 | 1.1 | 0.0 | 243.2 | 243.2 | 0.00 | 0.27 | Project renamed to Aurora. |
| `v2-interaction-overlay-toast` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,715 | 0 | 11,008 | 301 | 0.8 | 0.0 | 128.4 | 128.4 | 0.00 | 0.22 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,256 | 0 | 20,096 | 335 | 0.7 | 0.0 | 171.1 | 171.1 | 0.00 | 0.26 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,719 | 0 | 8,960 | 328 | 1.1 | 0.0 | 110.8 | 110.8 | 0.00 | 0.21 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,008 | 0 | 1,936 | 0 | 13,312 | 310 | 0.9 | 0.0 | 177.6 | 177.6 | 0.00 | 0.22 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,278 | 0 | 20,096 | 340 | 0.6 | 0.0 | 188.0 | 188.0 | 0.00 | 0.24 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,513 | 0 | 9,088 | 307 | 1.1 | 0.0 | 111.8 | 111.8 | 0.00 | 0.28 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,669 | 0 | 11,008 | 280 | 0.8 | 0.0 | 127.8 | 127.8 | 0.00 | 0.22 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,252 | 0 | 20,096 | 333 | 0.5 | 0.0 | 118.7 | 118.7 | 0.00 | 0.29 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,587 | 0 | 9,088 | 327 | 1.1 | 0.0 | 176.8 | 176.8 | 0.00 | 0.23 | Archive undone. |
| `v2-interaction-spa-client-route` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,766 | 0 | 11,008 | 223 | 0.9 | 0.0 | 130.3 | 130.3 | 0.00 | 0.20 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,579 | 0 | 20,352 | 339 | 0.9 | 0.0 | 115.7 | 115.7 | 0.00 | 0.22 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,654 | 0 | 8,960 | 308 | 1.4 | 0.0 | 120.1 | 120.1 | 0.00 | 0.23 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 981 | 0 | 1,638 | 0 | 11,136 | 223 | 0.9 | 0.0 | 113.7 | 113.7 | 0.00 | 0.24 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,574 | 0 | 20,352 | 335 | 0.5 | 0.0 | 120.3 | 120.3 | 0.00 | 0.20 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,572 | 0 | 9,088 | 327 | 1.1 | 0.0 | 116.1 | 116.1 | 0.00 | 0.30 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,638 | 0 | 11,136 | 223 | 1.0 | 0.0 | 116.0 | 116.0 | 0.00 | 0.21 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,473 | 0 | 20,480 | 342 | 0.5 | 0.0 | 172.1 | 172.1 | 0.00 | 0.24 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,746 | 0 | 8,832 | 290 | 1.1 | 0.0 | 240.7 | 240.7 | 0.00 | 0.25 | Mercury marked complete. |
| `v2-interaction-spa-history-draft` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,635 | 0 | 8,960 | 240 | 0.8 | 0.0 | 62.7 | 62.7 | 0.00 | 0.23 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,059 | 0 | 16,896 | 346 | 0.5 | 0.0 | 171.7 | 171.7 | 0.00 | 0.24 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,003 | 0 | 11,008 | 459 | 1.3 | 0.0 | 175.4 | 175.4 | 0.00 | 0.22 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,374 | 0 | 1,886 | 0 | 11,648 | 338 | 0.9 | 0.0 | 120.8 | 120.8 | 0.00 | 0.26 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,176 | 0 | 16,768 | 379 | 0.5 | 0.0 | 177.2 | 177.2 | 0.00 | 0.21 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 3,930 | 0 | 10,624 | 379 | 1.7 | 0.0 | 130.0 | 130.0 | 0.00 | 0.24 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,495 | 0 | 9,088 | 227 | 0.9 | 0.0 | 121.3 | 121.3 | 0.00 | 0.22 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,078 | 0 | 16,896 | 346 | 0.5 | 0.0 | 128.1 | 128.1 | 0.00 | 0.23 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 3,860 | 0 | 10,624 | 342 | 1.3 | 0.0 | 177.9 | 177.9 | 0.00 | 0.25 | Release notes |
| `v2-interaction-spa-route-recovery` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 2,117 | 0 | 13,312 | 265 | 0.8 | 0.0 | 121.2 | 121.2 | 0.00 | 0.26 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,394 | 0 | 27,904 | 440 | 0.5 | 0.0 | 228.2 | 228.2 | 0.00 | 0.23 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,777 | 0 | 15,104 | 435 | 1.2 | 0.0 | 241.7 | 241.7 | 0.00 | 0.25 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,989 | 0 | 13,440 | 265 | 0.8 | 0.0 | 121.9 | 121.9 | 0.00 | 0.21 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,392 | 0 | 28,160 | 501 | 0.5 | 0.0 | 176.2 | 176.2 | 0.00 | 0.23 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,815 | 0 | 15,104 | 448 | 1.2 | 0.0 | 170.4 | 170.4 | 0.00 | 0.28 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,989 | 0 | 13,440 | 265 | 0.8 | 0.0 | 118.2 | 118.2 | 0.00 | 0.26 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,290 | 0 | 28,032 | 472 | 0.5 | 0.0 | 236.8 | 236.8 | 0.00 | 0.22 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,907 | 0 | 14,976 | 457 | 1.1 | 0.0 | 237.9 | 237.9 | 0.00 | 0.21 | Notification settings recovered and saved. |
| `v2-interaction-spa-retry-recovery` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,456 | 0 | 8,832 | 210 | 0.8 | 0.0 | 116.5 | 116.5 | 0.00 | 0.26 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,365 | 0 | 20,096 | 339 | 0.5 | 0.0 | 173.3 | 173.3 | 0.00 | 0.23 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,588 | 0 | 9,088 | 305 | 1.1 | 0.0 | 120.5 | 120.5 | 0.00 | 0.22 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,347 | 0 | 8,960 | 229 | 0.8 | 0.0 | 174.5 | 174.5 | 0.00 | 0.29 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,385 | 0 | 20,096 | 343 | 0.5 | 0.0 | 240.9 | 240.9 | 0.00 | 0.22 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,814 | 0 | 8,832 | 299 | 1.3 | 0.0 | 188.8 | 188.8 | 0.00 | 0.23 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 913 | 0 | 1,644 | 0 | 11,136 | 271 | 1.1 | 0.0 | 60.6 | 60.6 | 0.00 | 0.25 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,389 | 0 | 20,096 | 339 | 0.5 | 0.0 | 233.8 | 233.8 | 0.00 | 0.23 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,654 | 0 | 8,960 | 290 | 1.1 | 0.0 | 127.2 | 127.2 | 0.00 | 0.22 | Contacts synced after retry. |
| `v2-reading-landmark-jump` | Mantis | 1 | cli_error | 1 | 35 | 3 | 35 | 0 | 14,913 | 2 | 20,088 | 0 | 164,224 | 8,977 | 0.8 | 0.0 | 839.6 | 839.6 | 0.06 | 0.23 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 1 | cli_error | 1 | 40 | 3 | 35 | 0 | 20,492 | 2 | 26,697 | 0 | 361,344 | 11,501 | 0.5 | 0.0 | 966.8 | 966.8 | 0.00 | 0.26 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 726 | 17 | 94,953 | 0 | 182,144 | 7,806 | 1.2 | 0.0 | 767.2 | 767.2 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Mantis | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 6,661 | 3 | 15,418 | 0 | 172,416 | 6,264 | 0.9 | 0.0 | 723.3 | 723.3 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 35 | 3 | 35 | 0 | 17,673 | 2 | 21,545 | 0 | 310,400 | 7,421 | 0.5 | 0.0 | 786.4 | 786.4 | 0.00 | 0.25 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 972 | 16 | 122,791 | 0 | 186,240 | 14,172 | 1.3 | 0.0 | 950.4 | 950.4 | 0.00 | 0.24 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Mantis | 3 | cli_error | 1 | 35 | 1 | 35 | 0 | 7,265 | 4 | 13,664 | 0 | 168,320 | 4,241 | 0.8 | 0.0 | 775.6 | 775.6 | 0.00 | 0.23 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 26 | 1 | 27 | 0 | 25,387 | 1 | 17,629 | 0 | 211,840 | 3,070 | 0.5 | 0.0 | 596.9 | 596.9 | 0.00 | 0.28 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 638 | 17 | 102,311 | 0 | 164,352 | 8,045 | 1.2 | 0.0 | 978.7 | 978.7 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-reading-deep-fact` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,001 | 0 | 3,006 | 0 | 18,816 | 550 | 0.9 | 0.0 | 129.1 | 129.1 | 0.00 | 0.23 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,233 | 0 | 32,384 | 539 | 0.5 | 0.0 | 226.7 | 226.7 | 0.00 | 0.24 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 1 | success | 1 | 15 | 0 | 16 | 0 | 270 | 7 | 8,897 | 0 | 48,384 | 1,014 | 1.2 | 0.0 | 251.4 | 251.4 | 0.00 | 0.24 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,777 | 0 | 2,860 | 0 | 19,200 | 602 | 0.9 | 0.0 | 168.9 | 168.9 | 0.00 | 0.24 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,217 | 0 | 32,768 | 664 | 0.5 | 0.0 | 227.0 | 227.0 | 0.00 | 0.23 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 841 | 15 | 90,275 | 0 | 188,800 | 7,968 | 1.2 | 0.0 | 794.6 | 794.6 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-reading-deep-fact` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,983 | 0 | 2,877 | 0 | 18,944 | 541 | 0.8 | 0.0 | 176.5 | 176.5 | 0.00 | 0.22 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,134 | 0 | 32,768 | 632 | 0.5 | 0.0 | 243.1 | 243.1 | 0.00 | 0.21 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 871 | 14 | 77,800 | 0 | 192,128 | 6,087 | 1.1 | 0.0 | 830.4 | 830.4 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-reading-cross-region` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,390 | 0 | 2,959 | 0 | 18,688 | 713 | 0.8 | 0.0 | 241.1 | 241.1 | 0.00 | 0.24 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 18 | 1 | 19 | 0 | 19,119 | 1 | 14,473 | 0 | 145,408 | 3,173 | 0.5 | 0.0 | 416.7 | 416.7 | 0.00 | 0.23 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 1 | success | 1 | 29 | 0 | 30 | 0 | 621 | 13 | 59,354 | 0 | 146,944 | 3,811 | 1.1 | 0.0 | 661.8 | 661.8 | 0.00 | 0.30 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 2 | success | 1 | 17 | 0 | 17 | 0 | 2,883 | 1 | 6,517 | 0 | 48,896 | 2,085 | 0.8 | 0.0 | 409.9 | 409.9 | 0.00 | 0.25 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 22 | 1 | 23 | 0 | 21,107 | 1 | 14,803 | 0 | 164,480 | 2,282 | 0.5 | 0.0 | 535.9 | 535.9 | 0.00 | 0.23 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 956 | 15 | 106,602 | 0 | 246,144 | 11,121 | 1.9 | 0.0 | 962.1 | 962.1 | 0.00 | 0.23 | sarvam CLI returned an error result |
| `v2-reading-cross-region` | Mantis | 3 | success | 1 | 8 | 0 | 8 | 0 | 1,125 | 0 | 2,511 | 0 | 15,744 | 546 | 0.8 | 0.0 | 117.5 | 117.5 | 0.00 | 0.27 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 29 | 2 | 29 | 0 | 14,464 | 1 | 19,862 | 0 | 277,760 | 8,301 | 0.5 | 0.0 | 666.4 | 666.4 | 0.00 | 0.29 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 602 | 13 | 58,017 | 0 | 130,432 | 3,619 | 1.1 | 0.0 | 653.6 | 653.6 | 0.00 | 0.20 | Delivery region: Aster-862 |
| `v2-reading-collapsed-context` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,557 | 0 | 2,549 | 0 | 16,000 | 469 | 0.8 | 0.0 | 174.4 | 174.4 | 0.00 | 0.29 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,354 | 0 | 32,512 | 694 | 0.5 | 0.0 | 182.7 | 182.7 | 0.00 | 0.24 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 1 | success | 1 | 31 | 0 | 32 | 0 | 916 | 14 | 66,569 | 0 | 151,168 | 3,946 | 1.9 | 0.0 | 727.1 | 727.1 | 0.00 | 0.21 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,557 | 0 | 2,423 | 0 | 16,000 | 387 | 0.8 | 0.0 | 127.7 | 127.7 | 0.00 | 0.21 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,120 | 0 | 32,512 | 641 | 0.5 | 0.0 | 241.2 | 241.2 | 0.00 | 0.30 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,247 | 14 | 84,602 | 0 | 195,200 | 6,957 | 1.2 | 0.0 | 708.5 | 708.5 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-reading-collapsed-context` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,557 | 0 | 2,428 | 0 | 16,128 | 488 | 0.8 | 0.0 | 178.5 | 178.5 | 0.00 | 0.20 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,093 | 0 | 32,512 | 621 | 0.5 | 0.0 | 282.8 | 282.8 | 0.00 | 0.27 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,348 | 13 | 57,039 | 0 | 204,416 | 6,730 | 1.1 | 0.0 | 781.5 | 781.5 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-workflow-multi-step-order` | Mantis | 1 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 3,986 | 0 | 28,928 | 684 | 0.9 | 0.0 | 430.8 | 430.8 | 0.00 | 0.23 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 22 | 1 | 23 | 0 | 9,946 | 1 | 11,368 | 0 | 127,872 | 2,856 | 0.5 | 0.0 | 535.6 | 535.6 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 1 | success | 1 | 32 | 0 | 33 | 0 | 441 | 15 | 62,975 | 0 | 130,816 | 2,199 | 1.2 | 0.0 | 828.0 | 828.0 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 2 | success | 1 | 13 | 0 | 14 | 0 | 2,550 | 0 | 4,152 | 0 | 32,128 | 664 | 0.8 | 0.0 | 347.6 | 347.6 | 0.00 | 0.21 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 13 | 0 | 14 | 0 | 6,301 | 0 | 5,763 | 0 | 51,200 | 988 | 0.5 | 0.0 | 344.7 | 344.7 | 0.00 | 0.24 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 2 | success | 1 | 28 | 0 | 29 | 0 | 400 | 13 | 45,289 | 0 | 109,696 | 1,584 | 1.2 | 0.0 | 487.9 | 487.9 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 3 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 3,849 | 0 | 28,672 | 603 | 0.9 | 0.0 | 247.1 | 247.1 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 14 | 0 | 15 | 0 | 6,670 | 0 | 5,931 | 0 | 56,064 | 898 | 0.5 | 0.0 | 288.6 | 288.6 | 0.00 | 0.21 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 400 | 13 | 51,533 | 0 | 113,024 | 2,808 | 1.1 | 0.0 | 780.7 | 780.7 | 0.00 | 0.39 | Receipt: Cinder-127 |
| `v2-workflow-cross-page-compare` | Mantis | 1 | success | 1 | 13 | 0 | 14 | 0 | 3,998 | 0 | 4,954 | 0 | 34,560 | 1,132 | 0.9 | 0.0 | 244.0 | 244.0 | 0.00 | 0.23 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,780 | 0 | 50,944 | 791 | 0.5 | 0.0 | 251.7 | 251.7 | 0.00 | 0.24 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 257 | 7 | 8,334 | 0 | 42,368 | 803 | 1.1 | 0.0 | 300.5 | 300.5 | 0.00 | 0.22 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 2 | success | 1 | 13 | 0 | 14 | 0 | 3,972 | 0 | 4,792 | 0 | 34,688 | 825 | 0.8 | 0.0 | 303.3 | 303.3 | 0.00 | 0.24 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,677 | 0 | 50,944 | 811 | 0.5 | 0.0 | 409.5 | 409.5 | 0.00 | 0.22 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,348 | 0 | 42,496 | 935 | 1.0 | 0.0 | 412.1 | 412.1 | 0.00 | 0.21 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 3 | success | 1 | 13 | 0 | 14 | 0 | 4,182 | 0 | 4,826 | 0 | 34,432 | 867 | 0.7 | 0.0 | 300.4 | 300.4 | 0.00 | 0.21 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,496 | 0 | 51,328 | 822 | 0.5 | 0.0 | 304.0 | 304.0 | 0.00 | 0.25 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,564 | 0 | 42,624 | 845 | 1.1 | 0.0 | 348.4 | 348.4 | 0.00 | 0.22 | Receipt: Aster-301 |
| `v2-workflow-save-resume` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,855 | 0 | 27,008 | 536 | 0.8 | 0.0 | 348.4 | 348.4 | 0.00 | 0.26 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,698 | 0 | 40,320 | 623 | 0.5 | 0.0 | 295.9 | 295.9 | 0.00 | 0.21 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,407 | 0 | 33,536 | 627 | 1.1 | 0.0 | 354.4 | 354.4 | 0.00 | 0.66 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,730 | 0 | 27,136 | 537 | 0.7 | 0.0 | 246.3 | 246.3 | 0.00 | 0.20 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,768 | 0 | 40,320 | 653 | 0.5 | 0.0 | 301.9 | 301.9 | 0.00 | 0.26 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,690 | 0 | 33,408 | 652 | 1.1 | 0.0 | 422.5 | 422.5 | 0.00 | 0.21 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,644 | 0 | 27,264 | 547 | 0.8 | 0.0 | 237.1 | 237.1 | 0.00 | 0.30 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,728 | 0 | 40,320 | 622 | 0.5 | 0.0 | 244.3 | 244.3 | 0.00 | 0.26 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,921 | 0 | 33,792 | 767 | 1.1 | 0.0 | 364.3 | 364.3 | 0.00 | 0.21 | Receipt: Ember-583 |
| `v2-workflow-conditional-branch` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 1,428 | 0 | 2,850 | 0 | 20,224 | 466 | 0.8 | 0.0 | 248.0 | 248.0 | 0.00 | 0.32 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,310 | 0 | 46,464 | 765 | 0.5 | 0.0 | 311.4 | 311.4 | 0.00 | 0.21 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 1 | success | 1 | 26 | 0 | 27 | 0 | 390 | 12 | 37,982 | 0 | 102,784 | 1,414 | 1.1 | 0.0 | 484.5 | 484.5 | 0.00 | 0.18 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,342 | 0 | 17,664 | 417 | 2.2 | 0.0 | 179.3 | 179.3 | 0.00 | 0.21 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,322 | 0 | 46,336 | 755 | 0.6 | 0.0 | 235.5 | 235.5 | 0.00 | 0.24 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,169 | 0 | 92,544 | 1,331 | 1.5 | 0.0 | 350.8 | 350.8 | 0.00 | 0.20 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,418 | 0 | 17,664 | 397 | 0.8 | 0.0 | 121.3 | 121.3 | 0.00 | 0.23 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,291 | 0 | 46,336 | 765 | 0.5 | 0.0 | 234.8 | 234.8 | 0.00 | 0.20 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 3 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 32,057 | 0 | 92,672 | 1,389 | 1.5 | 0.0 | 346.7 | 346.7 | 0.00 | 0.18 | Receipt: Ember-356 |
