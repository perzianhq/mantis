# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 53 recorded so far; 53 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 14 / 18 | 15 / 18 | 15 / 17 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 4 | 3 | 2 |
| Tool calls (including retries) | 179 | 256 | 352 |
| Sarvam API attempts (including retries) | 193 | 209 | 356 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 421.4 | 501.8 | 796.9 |
| Sarvam limiter queue / cooldown (total, s) | 1630.4 / 0.0 | 1890.5 / 0.0 | 3293.5 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 378.8 / 0.0 | 458.7 / 0.0 | 717.8 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 3 | 0 | 1 |
| Browser observation text (observed chars) | 144,982 | 372,074 | 5,694 |
| Browser observation images (observed blocks) | 4 | 19 | 154 |
| Normal input tokens (total) | 128,576 | 213,516 | 590,096 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 961,152 | 1,763,328 | 1,459,584 |
| Output tokens (total) | 35,619 | 39,174 | 58,643 |
| Total input tokens incl. cache (legacy) | 1,089,728 | 1,976,844 | 2,049,680 |
| MCP startup (total, s) | 19.3 | 11.2 | 23.2 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 2051.9 | 2392.3 | 4090.4 |
| CLI wall (total, s) | 2051.9 | 2392.3 | 4090.4 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 3.4 | 3.5 | 3.7 |
| Harness capture (total, s) | 12.5 | 133.8 | 20.2 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 7.43 | 10.33 | 21.64 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 3,277 | 0 | 2,722 | 0 | 10,624 | 325 | 1.6 | 0.0 | 6.3 | 6.3 | 0.00 | 0.15 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,379 | 0 | 24,960 | 385 | 1.0 | 0.0 | 9.7 | 9.7 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 9 | 0 | 10 | 0 | 177 | 4 | 5,462 | 0 | 19,840 | 1,095 | 2.0 | 0.0 | 68.6 | 68.6 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,376 | 0 | 7,936 | 273 | 1.6 | 0.0 | 6.8 | 6.8 | 0.00 | 0.19 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,198 | 0 | 33,792 | 428 | 1.1 | 0.0 | 61.8 | 61.8 | 0.00 | 0.19 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 224 | 7 | 10,039 | 0 | 54,016 | 2,170 | 2.0 | 0.0 | 182.6 | 182.6 | 0.00 | 0.16 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 3,277 | 0 | 2,705 | 0 | 10,624 | 311 | 1.6 | 0.0 | 8.5 | 8.5 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,445 | 0 | 24,832 | 366 | 1.1 | 0.0 | 7.8 | 7.8 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 33 | 0 | 34 | 0 | 527 | 15 | 76,009 | 0 | 160,768 | 4,367 | 2.0 | 0.0 | 370.8 | 370.8 | 0.00 | 0.32 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,386 | 0 | 7,936 | 333 | 1.6 | 0.0 | 6.1 | 6.1 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,663 | 0 | 24,832 | 352 | 0.5 | 0.0 | 61.4 | 61.4 | 0.00 | 0.23 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | success | 1 | 21 | 0 | 22 | 0 | 309 | 9 | 19,464 | 0 | 83,072 | 2,307 | 1.2 | 0.0 | 239.8 | 239.8 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,361 | 0 | 7,936 | 402 | 0.8 | 0.0 | 58.2 | 58.2 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,618 | 0 | 24,960 | 372 | 0.5 | 0.0 | 113.2 | 113.2 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 33 | 0 | 34 | 0 | 393 | 15 | 68,754 | 0 | 140,544 | 3,134 | 1.1 | 0.0 | 361.2 | 361.2 | 0.00 | 0.27 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,338 | 0 | 7,936 | 308 | 0.8 | 0.0 | 56.3 | 56.3 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,541 | 0 | 25,088 | 414 | 0.5 | 0.0 | 59.6 | 59.6 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 32 | 0 | 33 | 0 | 611 | 13 | 64,254 | 0 | 162,944 | 5,458 | 1.1 | 0.0 | 419.2 | 419.2 | 0.00 | 0.20 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 7,732 | 0 | 5,915 | 0 | 35,712 | 802 | 0.8 | 0.0 | 118.5 | 118.5 | 0.00 | 0.14 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 36 | 0 | 13 | 0 | 35,065 | 5 | 21,760 | 0 | 174,080 | 3,947 | 0.4 | 0.0 | 243.5 | 243.5 | 0.00 | 0.20 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | success | 1 | 30 | 0 | 20 | 0 | 414 | 9 | 21,999 | 0 | 81,792 | 3,767 | 1.0 | 0.0 | 294.7 | 294.7 | 0.00 | 0.34 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 2 | wrong_answer | 1 | 13 | 0 | 11 | 0 | 17,877 | 0 | 11,333 | 0 | 39,680 | 1,508 | 0.8 | 0.0 | 120.1 | 120.1 | 0.00 | 0.17 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 17 | 0 | 18 | 0 | 33,786 | 6 | 21,699 | 0 | 256,256 | 2,583 | 0.5 | 0.0 | 191.6 | 191.6 | 0.00 | 0.20 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 842 | 17 | 164,698 | 0 | 213,632 | 20,154 | 1.0 | 0.0 | 614.7 | 614.7 | 0.00 | 0.18 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 22 | 1 | 23 | 0 | 22,555 | 1 | 20,214 | 0 | 194,816 | 6,437 | 0.7 | 0.0 | 356.7 | 356.7 | 0.00 | 0.20 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 31,146 | 2 | 14,829 | 0 | 64,384 | 4,425 | 0.5 | 0.0 | 84.8 | 84.8 | 0.00 | 0.17 | fixture check failed (23 observations) |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 382 | 16 | 97,019 | 0 | 205,568 | 7,135 | 1.1 | 0.0 | 420.3 | 420.3 | 0.00 | 0.18 | sarvam CLI returned an error result |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,598 | 0 | 19,072 | 611 | 0.8 | 0.0 | 57.1 | 57.1 | 0.00 | 0.37 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,194 | 0 | 29,184 | 505 | 0.6 | 0.0 | 110.4 | 110.4 | 0.00 | 0.21 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,111 | 0 | 22,656 | 551 | 1.1 | 0.0 | 96.4 | 96.4 | 0.00 | 0.21 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,321 | 0 | 19,072 | 486 | 1.6 | 0.0 | 60.3 | 60.3 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 5,731 | 0 | 4,017 | 0 | 29,440 | 565 | 0.8 | 0.0 | 114.5 | 114.5 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,017 | 0 | 23,168 | 622 | 1.6 | 0.0 | 115.5 | 115.5 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,349 | 0 | 18,944 | 549 | 1.0 | 0.0 | 60.0 | 60.0 | 0.00 | 0.22 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,512 | 0 | 38,656 | 585 | 0.5 | 0.0 | 63.5 | 63.5 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,278 | 0 | 9,856 | 496 | 1.2 | 0.0 | 63.1 | 63.1 | 0.00 | 0.24 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | cli_error | 1 | 35 | 2 | 35 | 0 | 23,785 | 1 | 31,501 | 0 | 336,512 | 16,656 | 1.0 | 0.0 | 473.0 | 473.0 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 16 | 0 | 17 | 0 | 17,129 | 1 | 10,747 | 0 | 97,792 | 1,752 | 0.6 | 0.0 | 229.3 | 229.3 | 0.00 | 0.24 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 17 | 0 | 18 | 0 | 233 | 8 | 10,503 | 0 | 61,440 | 1,815 | 1.3 | 0.0 | 184.1 | 184.1 | 0.00 | 0.27 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 19 | 0 | 20 | 0 | 12,550 | 0 | 10,145 | 0 | 76,032 | 1,815 | 0.9 | 0.0 | 186.8 | 186.8 | 0.00 | 0.19 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 17,132 | 3 | 20,580 | 0 | 361,088 | 7,046 | 0.6 | 0.0 | 362.7 | 362.7 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 201 | 6 | 7,874 | 0 | 36,352 | 1,694 | 1.5 | 0.0 | 176.4 | 176.4 | 0.00 | 0.36 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 24 | 0 | 25 | 0 | 13,964 | 2 | 12,863 | 0 | 122,624 | 2,963 | 1.1 | 0.0 | 240.9 | 240.9 | 0.00 | 0.20 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | cli_error | 1 | 74 | 0 | 35 | 0 | 37,633 | 1 | 32,978 | 0 | 455,040 | 13,187 | 0.5 | 0.0 | 388.8 | 388.8 | 0.00 | 0.16 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 19 | 0 | 20 | 0 | 265 | 8 | 10,374 | 0 | 72,064 | 1,642 | 1.1 | 0.0 | 185.6 | 185.6 | 0.00 | 0.16 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,793 | 0 | 15,232 | 749 | 0.9 | 0.0 | 61.9 | 61.9 | 0.00 | 0.20 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 7,573 | 1 | 6,230 | 0 | 36,352 | 932 | 0.5 | 0.0 | 112.7 | 112.7 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 15 | 0 | 16 | 0 | 236 | 7 | 8,414 | 0 | 46,208 | 906 | 1.7 | 0.0 | 174.5 | 174.5 | 0.00 | 0.17 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,848 | 0 | 15,232 | 562 | 0.9 | 0.0 | 110.4 | 110.4 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,594 | 0 | 31,232 | 733 | 0.5 | 0.0 | 112.5 | 112.5 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 9,827 | 0 | 65,664 | 1,330 | 1.2 | 0.0 | 123.0 | 123.0 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,808 | 0 | 15,232 | 529 | 0.8 | 0.0 | 64.1 | 64.1 | 0.00 | 0.17 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,532 | 0 | 31,360 | 597 | 0.5 | 0.0 | 64.7 | 64.7 | 0.00 | 0.20 | request-032 \| Select \| Request 032 (North) selected. |
