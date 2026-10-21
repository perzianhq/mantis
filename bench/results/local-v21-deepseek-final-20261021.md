# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 3; 10 runs in parallel.
- Scope: 54 tasks × 3 approaches × 3 runs = 486 logical runs; 486 recorded so far; 486 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 159 / 162 | 157 / 162 | 150 / 162 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 3 | 5 | 12 |
| Tool calls (including retries) | 1,268 | 1,386 | 2,328 |
| Sarvam API attempts (including retries) | 1,332 | 1,519 | 2,447 |
| Sarvam HTTP 429 responses | 1 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 3204.0 | 4224.3 | 6719.3 |
| Sarvam limiter queue / cooldown (total, s) | 11694.5 / 19.6 | 13656.0 / 12.6 | 21985.3 / 30.6 |
| Sarvam active request / retry backoff (total, s) | 2850.3 / 0.0 | 3744.8 / 0.0 | 6162.0 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 38 | 23 | 32 |
| Browser observation text (observed chars) | 479,682 | 1,064,492 | 52,527 |
| Browser observation images (observed blocks) | 21 | 82 | 1,044 |
| Normal input tokens (total) | 586,075 | 1,038,140 | 3,912,126 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 4,133,120 | 8,902,272 | 10,278,784 |
| Output tokens (total) | 176,891 | 212,841 | 346,636 |
| Total input tokens incl. cache (legacy) | 4,719,195 | 9,940,412 | 14,190,910 |
| MCP startup (total, s) | 161.3 | 99.2 | 218.5 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 14918.1 | 17892.9 | 28735.2 |
| CLI wall (total, s) | 14918.1 | 17892.9 | 28735.2 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 34.4 | 34.0 | 34.0 |
| Harness capture (total, s) | 99.4 | 921.6 | 157.5 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 35.29 | 52.75 | 139.34 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,309 | 0 | 8,320 | 281 | 1.9 | 0.0 | 7.8 | 7.8 | 0.00 | 0.25 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 34,781 | 0 | 13,917 | 0 | 33,920 | 407 | 1.4 | 0.0 | 62.0 | 62.0 | 0.00 | 0.40 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 24 | 0 | 25 | 0 | 455 | 12 | 42,934 | 0 | 101,632 | 2,913 | 2.4 | 0.0 | 302.2 | 302.2 | 0.00 | 0.31 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,366 | 0 | 8,320 | 364 | 2.0 | 0.0 | 7.5 | 7.5 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,441 | 0 | 24,960 | 309 | 1.4 | 0.0 | 10.6 | 10.6 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 48 | 0 | 49 | 0 | 873 | 24 | 170,552 | 0 | 280,704 | 14,071 | 2.5 | 0.0 | 631.8 | 631.8 | 0.00 | 0.41 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,271 | 0 | 8,320 | 290 | 1.9 | 0.0 | 6.2 | 6.2 | 0.00 | 0.26 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,364 | 0 | 33,920 | 476 | 1.3 | 0.0 | 12.3 | 12.3 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 9 | 0 | 10 | 0 | 192 | 4 | 6,064 | 0 | 21,376 | 1,433 | 2.5 | 0.0 | 129.9 | 129.9 | 0.00 | 0.38 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,347 | 0 | 8,192 | 280 | 2.0 | 0.0 | 4.7 | 4.7 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,511 | 0 | 25,088 | 364 | 0.6 | 0.0 | 59.9 | 59.9 | 0.00 | 0.30 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 237 | 6 | 7,774 | 0 | 38,400 | 767 | 1.5 | 0.0 | 176.1 | 176.1 | 0.00 | 0.35 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,449 | 0 | 8,192 | 369 | 1.1 | 0.0 | 61.7 | 61.7 | 0.00 | 0.37 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 18,903 | 0 | 7,998 | 0 | 34,304 | 478 | 0.7 | 0.0 | 61.5 | 61.5 | 0.00 | 0.36 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 257 | 7 | 9,804 | 0 | 50,816 | 1,921 | 1.5 | 0.0 | 172.9 | 172.9 | 0.00 | 0.31 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,345 | 0 | 8,192 | 319 | 0.9 | 0.0 | 56.4 | 56.4 | 0.00 | 0.35 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,389 | 0 | 25,216 | 357 | 0.9 | 0.0 | 9.6 | 9.6 | 0.00 | 0.33 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 324 | 7 | 9,942 | 0 | 65,792 | 1,712 | 1.8 | 0.0 | 237.2 | 237.2 | 0.00 | 0.29 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | success | 1 | 12 | 0 | 13 | 0 | 14,229 | 0 | 9,498 | 0 | 62,592 | 1,810 | 1.7 | 0.0 | 175.4 | 175.4 | 0.00 | 0.39 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 23 | 0 | 24 | 0 | 35,386 | 8 | 29,100 | 0 | 405,376 | 7,011 | 1.1 | 0.0 | 352.1 | 352.1 | 0.00 | 0.36 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 347 | 8 | 10,421 | 0 | 64,768 | 1,707 | 2.3 | 0.0 | 182.1 | 182.1 | 0.00 | 0.36 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 8 | 0 | 7 | 0 | 29,857 | 0 | 15,460 | 0 | 41,088 | 1,559 | 1.5 | 0.0 | 114.2 | 114.2 | 0.00 | 0.31 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 29 | 0 | 15 | 0 | 34,876 | 6 | 22,143 | 0 | 207,232 | 3,329 | 0.9 | 0.0 | 230.2 | 230.2 | 0.00 | 0.39 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 314 | 7 | 9,107 | 0 | 49,664 | 3,628 | 1.9 | 0.0 | 188.2 | 188.2 | 0.00 | 0.30 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 29,656 | 0 | 15,361 | 0 | 40,320 | 1,705 | 1.4 | 0.0 | 71.6 | 71.6 | 0.00 | 0.30 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 33 | 0 | 34 | 0 | 36,396 | 8 | 28,933 | 0 | 621,184 | 4,841 | 0.9 | 0.0 | 367.3 | 367.3 | 0.00 | 0.35 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 281 | 6 | 7,775 | 0 | 36,480 | 1,125 | 2.0 | 0.0 | 173.1 | 173.1 | 0.00 | 0.38 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 6,035 | 0 | 4,651 | 0 | 24,064 | 568 | 1.4 | 0.0 | 106.2 | 106.2 | 0.00 | 0.31 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,318 | 0 | 29,696 | 637 | 0.8 | 0.0 | 106.0 | 106.0 | 0.00 | 0.27 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,297 | 0 | 25,216 | 600 | 2.1 | 0.0 | 118.2 | 118.2 | 0.00 | 0.38 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,490 | 0 | 19,712 | 561 | 1.3 | 0.0 | 63.2 | 63.2 | 0.00 | 0.34 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,170 | 0 | 29,824 | 636 | 0.9 | 0.0 | 63.4 | 63.4 | 0.00 | 0.32 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 195 | 5 | 6,239 | 0 | 25,216 | 573 | 1.9 | 0.0 | 120.3 | 120.3 | 0.00 | 0.38 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,271 | 0 | 19,712 | 448 | 1.3 | 0.0 | 62.1 | 62.1 | 0.00 | 0.27 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,190 | 0 | 29,824 | 628 | 0.8 | 0.0 | 66.1 | 66.1 | 0.00 | 0.35 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 195 | 5 | 6,351 | 0 | 25,344 | 675 | 1.8 | 0.0 | 118.8 | 118.8 | 0.00 | 0.38 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 22 | 1 | 19 | 0 | 13,258 | 0 | 13,982 | 0 | 98,688 | 6,034 | 1.6 | 0.0 | 307.6 | 307.6 | 0.00 | 0.32 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 22 | 0 | 23 | 0 | 25,098 | 1 | 15,885 | 0 | 169,088 | 2,762 | 0.9 | 0.0 | 249.4 | 249.4 | 0.00 | 0.34 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 307 | 7 | 8,954 | 0 | 47,616 | 1,046 | 2.0 | 0.0 | 128.7 | 128.7 | 0.00 | 0.34 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 17 | 0 | 18 | 0 | 12,200 | 0 | 8,432 | 0 | 66,816 | 1,158 | 1.5 | 0.0 | 187.4 | 187.4 | 0.00 | 0.36 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 19 | 0 | 20 | 0 | 21,921 | 0 | 12,735 | 0 | 123,136 | 2,051 | 0.6 | 0.0 | 234.7 | 234.7 | 0.00 | 0.33 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 239 | 5 | 6,568 | 0 | 26,240 | 956 | 2.0 | 0.0 | 171.6 | 171.6 | 0.00 | 0.41 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 18 | 0 | 19 | 0 | 10,857 | 0 | 9,658 | 0 | 72,960 | 5,440 | 1.5 | 0.0 | 215.0 | 215.0 | 0.00 | 0.43 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 16 | 0 | 17 | 0 | 16,689 | 0 | 10,148 | 0 | 89,088 | 2,080 | 0.9 | 0.0 | 232.1 | 232.1 | 0.00 | 0.34 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 306 | 7 | 8,970 | 0 | 48,128 | 1,100 | 2.0 | 0.0 | 176.9 | 176.9 | 0.00 | 0.24 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,838 | 0 | 15,744 | 515 | 1.4 | 0.0 | 105.4 | 105.4 | 0.00 | 0.36 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,838 | 0 | 31,488 | 621 | 0.9 | 0.0 | 115.9 | 115.9 | 0.00 | 0.34 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 244 | 6 | 7,769 | 0 | 41,600 | 809 | 1.6 | 0.0 | 166.5 | 166.5 | 0.00 | 0.34 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,909 | 0 | 15,616 | 489 | 1.4 | 0.0 | 43.1 | 43.1 | 0.00 | 0.34 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,618 | 0 | 31,616 | 599 | 0.9 | 0.0 | 71.6 | 71.6 | 0.00 | 0.25 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 244 | 7 | 8,722 | 0 | 49,920 | 857 | 1.9 | 0.0 | 177.9 | 177.9 | 0.00 | 0.34 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,756 | 0 | 15,872 | 639 | 1.4 | 0.0 | 106.8 | 106.8 | 0.00 | 0.32 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,600 | 0 | 31,616 | 584 | 0.8 | 0.0 | 114.3 | 114.3 | 0.00 | 0.37 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | success | 1 | 19 | 0 | 20 | 0 | 283 | 9 | 16,959 | 0 | 71,424 | 1,086 | 2.0 | 0.0 | 213.2 | 213.2 | 0.00 | 0.37 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,816 | 0 | 14,592 | 620 | 1.5 | 0.0 | 59.8 | 59.8 | 0.00 | 0.30 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 16,451 | 0 | 7,134 | 0 | 28,928 | 827 | 0.9 | 0.0 | 67.7 | 67.7 | 0.00 | 0.31 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 219 | 6 | 7,959 | 0 | 36,096 | 1,559 | 2.2 | 0.0 | 177.1 | 177.1 | 0.00 | 0.32 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,804 | 0 | 14,464 | 396 | 1.1 | 0.0 | 61.2 | 61.2 | 0.00 | 0.38 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,923 | 0 | 29,184 | 494 | 0.6 | 0.0 | 108.5 | 108.5 | 0.00 | 0.35 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | step_limit | 1 | 50 | 1 | 50 | 0 | 716 | 20 | 187,783 | 0 | 369,536 | 15,307 | 2.2 | 0.0 | 625.9 | 625.9 | 0.00 | 0.36 | agent step budget exhausted at 50 steps |
| `v2-list-reordered-item` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,751 | 0 | 14,720 | 466 | 1.5 | 0.0 | 69.3 | 69.3 | 0.00 | 0.35 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,883 | 0 | 29,312 | 649 | 0.8 | 0.0 | 61.9 | 61.9 | 0.00 | 0.36 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 260 | 9 | 18,172 | 0 | 71,168 | 2,587 | 2.0 | 0.0 | 236.6 | 236.6 | 0.00 | 0.34 | case-024 \| Select \| case-024 selected. |
| `v2-list-nested-scroll` | Mantis | 1 | success | 1 | 20 | 0 | 21 | 0 | 24,265 | 0 | 13,098 | 0 | 123,520 | 2,361 | 1.5 | 0.0 | 242.9 | 242.9 | 0.00 | 0.32 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 23 | 0 | 24 | 0 | 11,576 | 8 | 16,386 | 0 | 195,584 | 2,697 | 0.8 | 0.0 | 358.6 | 358.6 | 0.00 | 0.36 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 356 | 9 | 17,824 | 0 | 70,272 | 1,631 | 2.0 | 0.0 | 181.0 | 181.0 | 0.00 | 0.28 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 2 | success | 1 | 16 | 1 | 17 | 0 | 13,513 | 0 | 8,878 | 0 | 75,648 | 1,479 | 1.4 | 0.0 | 177.3 | 177.3 | 0.00 | 0.46 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | step_limit | 1 | 50 | 0 | 50 | 0 | 26,382 | 15 | 178,639 | 0 | 762,624 | 22,315 | 0.9 | 0.0 | 775.1 | 775.1 | 0.00 | 0.37 | agent step budget exhausted at 50 steps |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 0 | 19 | 0 | 370 | 9 | 18,220 | 0 | 72,320 | 1,944 | 2.0 | 0.0 | 235.8 | 235.8 | 0.00 | 0.42 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 3 | success | 1 | 15 | 0 | 16 | 0 | 16,262 | 0 | 9,592 | 0 | 70,656 | 1,797 | 1.4 | 0.0 | 181.4 | 181.4 | 0.00 | 0.36 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | step_limit | 1 | 50 | 1 | 50 | 0 | 32,813 | 4 | 41,228 | 0 | 964,608 | 18,365 | 0.8 | 0.0 | 702.4 | 702.4 | 0.00 | 0.38 | agent step budget exhausted at 50 steps |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 356 | 9 | 17,588 | 0 | 70,272 | 2,059 | 2.4 | 0.0 | 186.7 | 186.7 | 0.00 | 0.28 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,012 | 1 | 2,050 | 0 | 9,344 | 413 | 1.7 | 0.0 | 50.9 | 50.9 | 0.00 | 0.36 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,765 | 1 | 3,217 | 0 | 14,976 | 531 | 0.8 | 0.0 | 53.9 | 53.9 | 0.00 | 0.33 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | step_limit | 1 | 51 | 3 | 50 | 0 | 2,395 | 20 | 334,102 | 0 | 915,968 | 45,096 | 2.0 | 0.0 | 777.4 | 777.4 | 0.00 | 0.28 | agent step budget exhausted at 50 steps |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,012 | 1 | 1,986 | 0 | 9,472 | 496 | 1.5 | 0.0 | 59.3 | 59.3 | 0.00 | 0.33 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 2,450 | 1 | 2,610 | 0 | 10,752 | 290 | 0.7 | 0.0 | 10.7 | 10.7 | 0.00 | 0.34 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 2 | 19 | 0 | 724 | 7 | 17,450 | 0 | 103,808 | 9,461 | 2.0 | 0.0 | 293.4 | 293.4 | 0.00 | 0.32 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,129 | 0 | 11,520 | 564 | 1.3 | 0.0 | 60.7 | 60.7 | 0.00 | 0.29 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 2,450 | 1 | 2,659 | 0 | 10,752 | 348 | 0.8 | 0.0 | 53.1 | 53.1 | 0.00 | 0.29 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | success | 1 | 3 | 1 | 4 | 0 | 235 | 1 | 1,965 | 0 | 3,840 | 726 | 2.1 | 0.0 | 17.3 | 17.3 | 0.00 | 0.36 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,491 | 0 | 1,564 | 0 | 7,424 | 305 | 1.4 | 0.0 | 45.9 | 45.9 | 0.00 | 0.36 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 2,286 | 1 | 2,424 | 0 | 10,752 | 314 | 0.9 | 0.0 | 46.2 | 46.2 | 0.00 | 0.32 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 133 | 2 | 2,796 | 0 | 5,632 | 377 | 1.9 | 0.0 | 51.3 | 51.3 | 0.00 | 0.38 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,571 | 0 | 1,855 | 0 | 9,728 | 534 | 1.4 | 0.0 | 52.8 | 52.8 | 0.00 | 0.30 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 4,109 | 0 | 3,542 | 0 | 21,888 | 900 | 1.0 | 0.0 | 20.3 | 20.3 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,478 | 0 | 2,304 | 197 | 1.9 | 0.0 | 9.4 | 9.4 | 0.00 | 0.32 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 904 | 0 | 1,425 | 0 | 7,424 | 426 | 1.3 | 0.0 | 48.0 | 48.0 | 0.00 | 0.41 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 2,286 | 1 | 2,461 | 0 | 10,752 | 333 | 1.3 | 0.0 | 49.7 | 49.7 | 0.00 | 0.34 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 133 | 2 | 2,756 | 0 | 5,632 | 349 | 1.9 | 0.0 | 53.5 | 53.5 | 0.00 | 0.25 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,872 | 0 | 9,088 | 722 | 1.3 | 0.0 | 53.9 | 53.9 | 0.00 | 0.25 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,352 | 1 | 2,167 | 0 | 10,368 | 379 | 0.7 | 0.0 | 50.8 | 50.8 | 0.00 | 0.25 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,476 | 0 | 2,304 | 155 | 2.2 | 0.0 | 13.3 | 13.3 | 0.00 | 0.27 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 2 | success | 1 | 6 | 0 | 5 | 0 | 987 | 1 | 1,976 | 0 | 9,344 | 419 | 1.4 | 0.0 | 11.1 | 11.1 | 0.00 | 0.27 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 933 | 1 | 1,736 | 0 | 7,552 | 367 | 0.6 | 0.0 | 12.3 | 12.3 | 0.00 | 0.41 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,478 | 0 | 2,304 | 172 | 1.3 | 0.0 | 49.1 | 49.1 | 0.00 | 0.41 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,764 | 0 | 9,216 | 1,087 | 1.4 | 0.0 | 64.3 | 64.3 | 0.00 | 0.33 | Dock C \| min \| 17 min |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | step_limit | 1 | 50 | 7 | 50 | 0 | 24,243 | 0 | 42,416 | 0 | 831,360 | 23,641 | 0.6 | 0.0 | 571.4 | 571.4 | 0.00 | 0.30 | agent step budget exhausted at 50 steps |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,478 | 0 | 2,304 | 180 | 1.4 | 0.0 | 46.1 | 46.1 | 0.00 | 0.31 | Dock C \| min \| 17 |
| `v2-chart-responsive` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 530 | 0 | 974 | 0 | 5,248 | 311 | 1.4 | 0.0 | 44.7 | 44.7 | 0.00 | 0.45 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 27 | 6 | 25 | 0 | 10,069 | 4 | 40,662 | 0 | 425,472 | 32,207 | 0.8 | 0.0 | 472.9 | 472.9 | 0.00 | 0.33 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,464 | 0 | 2,304 | 322 | 1.9 | 0.0 | 14.0 | 14.0 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 2,149 | 0 | 9,600 | 554 | 1.4 | 0.0 | 46.9 | 46.9 | 0.00 | 0.33 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,293 | 0 | 10,624 | 531 | 0.9 | 0.0 | 43.4 | 43.4 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 135 | 2 | 2,960 | 0 | 5,760 | 517 | 1.9 | 0.0 | 52.0 | 52.0 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 976 | 0 | 1,627 | 0 | 7,296 | 477 | 1.4 | 0.0 | 14.9 | 14.9 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,276 | 0 | 10,624 | 386 | 0.9 | 0.0 | 13.3 | 13.3 | 0.00 | 0.30 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,464 | 0 | 2,304 | 359 | 1.9 | 0.0 | 9.7 | 9.7 | 0.00 | 0.33 | Bookings \| Q4 \| 147 |
| `v2-interaction-form-preferences` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,542 | 0 | 9,344 | 273 | 1.4 | 0.0 | 47.5 | 47.5 | 0.00 | 0.35 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,643 | 0 | 17,280 | 390 | 0.8 | 0.0 | 56.2 | 56.2 | 0.00 | 0.31 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | success | 1 | 57 | 2 | 46 | 0 | 945 | 24 | 171,982 | 0 | 221,696 | 13,878 | 1.9 | 0.0 | 415.3 | 415.3 | 0.00 | 0.28 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,018 | 0 | 1,607 | 0 | 9,216 | 250 | 1.1 | 0.0 | 45.7 | 45.7 | 0.00 | 0.33 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,486 | 0 | 17,408 | 386 | 0.9 | 0.0 | 46.2 | 46.2 | 0.00 | 0.35 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | step_limit | 1 | 51 | 1 | 50 | 0 | 769 | 22 | 146,274 | 0 | 279,168 | 8,566 | 2.1 | 0.0 | 358.2 | 358.2 | 0.00 | 0.28 | agent step budget exhausted at 50 steps |
| `v2-interaction-form-preferences` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,429 | 0 | 9,472 | 280 | 1.4 | 0.0 | 49.8 | 49.8 | 0.00 | 0.38 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 7 | 0 | 3,696 | 0 | 2,956 | 0 | 21,248 | 421 | 0.8 | 0.0 | 64.8 | 64.8 | 0.00 | 0.30 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | step_limit | 1 | 51 | 1 | 50 | 0 | 1,167 | 19 | 130,640 | 0 | 326,656 | 10,852 | 2.0 | 0.0 | 353.2 | 353.2 | 0.00 | 0.27 | agent step budget exhausted at 50 steps |
| `v2-interaction-form-frame-payment` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,491 | 0 | 9,344 | 236 | 1.4 | 0.0 | 22.0 | 22.0 | 0.00 | 0.30 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,424 | 0 | 17,152 | 374 | 0.8 | 0.0 | 62.1 | 62.1 | 0.00 | 0.36 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 257 | 5 | 6,600 | 0 | 32,000 | 640 | 1.9 | 0.0 | 121.0 | 121.0 | 0.00 | 0.29 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,494 | 0 | 9,344 | 237 | 1.5 | 0.0 | 50.0 | 50.0 | 0.00 | 0.36 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,348 | 0 | 17,152 | 345 | 0.8 | 0.0 | 21.3 | 21.3 | 0.00 | 0.33 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,811 | 0 | 38,784 | 708 | 1.9 | 0.0 | 131.9 | 131.9 | 0.00 | 0.15 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,502 | 0 | 9,344 | 239 | 1.5 | 0.0 | 60.9 | 60.9 | 0.00 | 0.17 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,589 | 0 | 17,024 | 399 | 1.1 | 0.0 | 62.2 | 62.2 | 0.00 | 0.17 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,665 | 0 | 38,656 | 675 | 1.9 | 0.0 | 125.5 | 125.5 | 0.00 | 0.17 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-combobox` | Mantis | 1 | success | 1 | 23 | 1 | 24 | 0 | 3,060 | 1 | 8,262 | 0 | 74,752 | 1,994 | 1.6 | 0.0 | 252.0 | 252.0 | 0.00 | 0.17 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 1 | 13 | 0 | 4,230 | 1 | 5,750 | 0 | 47,872 | 818 | 1.0 | 0.0 | 131.7 | 131.7 | 0.00 | 0.19 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,597 | 0 | 38,272 | 739 | 1.9 | 0.0 | 128.0 | 128.0 | 0.00 | 0.15 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 2 | success | 1 | 12 | 1 | 13 | 0 | 1,443 | 1 | 4,151 | 0 | 30,592 | 995 | 1.6 | 0.0 | 126.6 | 126.6 | 0.00 | 0.16 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 17 | 1 | 18 | 0 | 4,959 | 1 | 7,441 | 0 | 71,936 | 1,386 | 1.1 | 0.0 | 129.1 | 129.1 | 0.00 | 0.16 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 289 | 7 | 9,189 | 0 | 54,784 | 1,023 | 1.9 | 0.0 | 190.2 | 190.2 | 0.00 | 0.17 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 3 | success | 1 | 26 | 3 | 27 | 0 | 2,614 | 3 | 9,691 | 0 | 96,384 | 2,793 | 0.8 | 0.0 | 361.0 | 361.0 | 0.00 | 0.16 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 16 | 1 | 17 | 0 | 5,484 | 2 | 8,295 | 0 | 72,064 | 1,525 | 0.5 | 0.0 | 186.0 | 186.0 | 0.00 | 0.16 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,736 | 0 | 38,784 | 750 | 1.1 | 0.0 | 173.7 | 173.7 | 0.00 | 0.15 | West Ridge assigned. |
| `v2-interaction-form-validation-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,758 | 0 | 11,392 | 282 | 0.7 | 0.0 | 62.5 | 62.5 | 0.00 | 0.17 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,978 | 0 | 24,192 | 489 | 0.5 | 0.0 | 114.4 | 114.4 | 0.00 | 0.15 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,482 | 0 | 22,400 | 509 | 1.1 | 0.0 | 116.4 | 116.4 | 0.00 | 0.17 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,786 | 0 | 11,392 | 289 | 0.9 | 0.0 | 108.5 | 108.5 | 0.00 | 0.17 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,888 | 0 | 24,064 | 414 | 0.5 | 0.0 | 112.9 | 112.9 | 0.00 | 0.15 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 11 | 0 | 12 | 0 | 255 | 4 | 5,774 | 0 | 25,472 | 634 | 1.1 | 0.0 | 122.2 | 122.2 | 0.00 | 0.14 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,758 | 0 | 11,392 | 282 | 0.8 | 0.0 | 61.3 | 61.3 | 0.00 | 0.17 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,886 | 0 | 24,064 | 417 | 0.4 | 0.0 | 69.5 | 69.5 | 0.00 | 0.16 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 276 | 4 | 6,246 | 0 | 28,672 | 789 | 1.0 | 0.0 | 126.8 | 126.8 | 0.00 | 0.17 | Invite sent to ada@northwind.test. |
| `v2-interaction-overlay-dialog` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 929 | 0 | 1,756 | 0 | 11,264 | 239 | 0.8 | 0.0 | 57.2 | 57.2 | 0.00 | 0.15 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,502 | 0 | 20,480 | 373 | 0.5 | 0.0 | 64.3 | 64.3 | 0.00 | 0.17 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,934 | 0 | 10,368 | 350 | 1.2 | 0.0 | 62.6 | 62.6 | 0.00 | 0.15 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,463 | 0 | 9,088 | 201 | 0.9 | 0.0 | 59.5 | 59.5 | 0.00 | 0.17 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,504 | 0 | 20,480 | 375 | 0.4 | 0.0 | 119.6 | 119.6 | 0.00 | 0.15 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,918 | 0 | 10,240 | 305 | 1.2 | 0.0 | 64.0 | 64.0 | 0.00 | 0.17 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,385 | 0 | 9,216 | 217 | 0.7 | 0.0 | 56.1 | 56.1 | 0.00 | 0.14 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,497 | 0 | 20,480 | 374 | 0.5 | 0.0 | 113.6 | 113.6 | 0.00 | 0.15 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,936 | 0 | 10,368 | 352 | 1.2 | 0.0 | 110.8 | 110.8 | 0.00 | 0.14 | Report exported with essential privacy. |
| `v2-interaction-overlay-shadow` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,493 | 0 | 9,088 | 213 | 0.8 | 0.0 | 60.1 | 60.1 | 0.00 | 0.16 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,222 | 0 | 16,896 | 320 | 0.4 | 0.0 | 113.0 | 113.0 | 0.00 | 0.21 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,886 | 0 | 32,128 | 698 | 1.0 | 0.0 | 172.7 | 172.7 | 0.00 | 0.14 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,511 | 0 | 9,088 | 219 | 0.9 | 0.0 | 11.6 | 11.6 | 0.00 | 0.16 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,245 | 0 | 16,896 | 338 | 0.4 | 0.0 | 59.0 | 59.0 | 0.00 | 0.18 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,704 | 0 | 32,128 | 669 | 1.0 | 0.0 | 174.5 | 174.5 | 0.00 | 0.16 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,514 | 0 | 9,088 | 220 | 0.8 | 0.0 | 56.4 | 56.4 | 0.00 | 0.17 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,224 | 0 | 17,024 | 364 | 0.5 | 0.0 | 110.5 | 110.5 | 0.00 | 0.16 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,698 | 0 | 32,000 | 642 | 1.0 | 0.0 | 168.9 | 168.9 | 0.00 | 0.17 | Compact density applied. |
| `v2-interaction-overlay-modal` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,097 | 0 | 13,568 | 349 | 1.0 | 0.0 | 67.3 | 67.3 | 0.00 | 0.15 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,816 | 0 | 23,808 | 451 | 0.4 | 0.0 | 67.8 | 67.8 | 0.00 | 0.18 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,536 | 0 | 22,272 | 585 | 1.1 | 0.0 | 123.9 | 123.9 | 0.00 | 0.17 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,103 | 0 | 13,568 | 355 | 0.8 | 0.0 | 63.3 | 63.3 | 0.00 | 0.16 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,855 | 0 | 23,808 | 456 | 0.5 | 0.0 | 64.6 | 64.6 | 0.00 | 0.17 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,650 | 0 | 22,016 | 531 | 1.0 | 0.0 | 121.7 | 121.7 | 0.00 | 0.15 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,393 | 0 | 2,520 | 0 | 16,128 | 444 | 0.7 | 0.0 | 115.5 | 115.5 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,826 | 0 | 23,808 | 468 | 0.5 | 0.0 | 113.5 | 113.5 | 0.00 | 0.19 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 3 | success | 1 | 23 | 0 | 24 | 0 | 393 | 7 | 11,178 | 0 | 78,464 | 1,582 | 1.1 | 0.0 | 354.0 | 354.0 | 0.00 | 0.14 | Project renamed to Aurora. |
| `v2-interaction-overlay-toast` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,764 | 0 | 11,264 | 265 | 0.9 | 0.0 | 111.4 | 111.4 | 0.00 | 0.20 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,532 | 0 | 20,096 | 333 | 0.6 | 0.0 | 107.8 | 107.8 | 0.00 | 0.16 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,865 | 0 | 10,368 | 329 | 1.0 | 0.0 | 107.1 | 107.1 | 0.00 | 0.15 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,754 | 0 | 11,264 | 263 | 0.7 | 0.0 | 58.7 | 58.7 | 0.00 | 0.17 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,524 | 0 | 20,096 | 329 | 0.4 | 0.0 | 62.4 | 62.4 | 0.00 | 0.18 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,737 | 0 | 10,496 | 336 | 1.0 | 0.0 | 110.3 | 110.3 | 0.00 | 0.15 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,761 | 0 | 11,264 | 264 | 0.7 | 0.0 | 106.0 | 106.0 | 0.00 | 0.17 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,594 | 0 | 20,096 | 355 | 0.4 | 0.0 | 63.9 | 63.9 | 0.00 | 0.14 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,961 | 0 | 10,240 | 328 | 1.2 | 0.0 | 70.7 | 70.7 | 0.00 | 0.14 | Archive undone. |
| `v2-interaction-spa-client-route` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,748 | 0 | 11,392 | 223 | 0.8 | 0.0 | 65.7 | 65.7 | 0.00 | 0.16 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,662 | 0 | 20,608 | 348 | 0.5 | 0.0 | 67.3 | 67.3 | 0.00 | 0.14 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,898 | 0 | 10,240 | 302 | 1.2 | 0.0 | 63.2 | 63.2 | 0.00 | 0.17 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,748 | 0 | 11,392 | 223 | 0.8 | 0.0 | 60.8 | 60.8 | 0.00 | 0.19 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,615 | 0 | 20,608 | 338 | 0.5 | 0.0 | 109.5 | 109.5 | 0.00 | 0.16 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,944 | 0 | 10,240 | 324 | 1.0 | 0.0 | 62.2 | 62.2 | 0.00 | 0.14 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 981 | 0 | 1,748 | 0 | 11,392 | 223 | 0.7 | 0.0 | 58.9 | 58.9 | 0.00 | 0.16 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,645 | 0 | 20,608 | 345 | 0.5 | 0.0 | 65.6 | 65.6 | 0.00 | 0.16 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,828 | 0 | 10,368 | 317 | 1.1 | 0.0 | 73.1 | 73.1 | 0.00 | 0.17 | Mercury marked complete. |
| `v2-interaction-spa-history-draft` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,435 | 0 | 9,472 | 244 | 0.8 | 0.0 | 55.3 | 55.3 | 0.00 | 0.15 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,263 | 0 | 16,896 | 333 | 0.5 | 0.0 | 61.1 | 61.1 | 0.00 | 0.16 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,103 | 0 | 12,288 | 377 | 1.0 | 0.0 | 109.8 | 109.8 | 0.00 | 0.16 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 2 | success | 1 | 4 | 0 | 6 | 1 | 908 | 0 | 1,428 | 0 | 9,472 | 235 | 0.7 | 0.0 | 65.3 | 65.3 | 0.00 | 0.15 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,227 | 0 | 16,896 | 319 | 0.4 | 0.0 | 18.8 | 18.8 | 0.00 | 0.16 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 3,990 | 0 | 12,288 | 356 | 1.0 | 0.0 | 68.3 | 68.3 | 0.00 | 0.14 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,448 | 0 | 9,472 | 249 | 0.8 | 0.0 | 63.7 | 63.7 | 0.00 | 0.15 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,236 | 0 | 16,896 | 319 | 0.5 | 0.0 | 62.0 | 62.0 | 0.00 | 0.16 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,027 | 0 | 12,288 | 378 | 1.1 | 0.0 | 68.7 | 68.7 | 0.00 | 0.17 | Release notes |
| `v2-interaction-spa-route-recovery` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,968 | 0 | 13,952 | 287 | 0.7 | 0.0 | 109.8 | 109.8 | 0.00 | 0.16 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,442 | 0 | 28,288 | 456 | 0.5 | 0.0 | 121.0 | 121.0 | 0.00 | 0.17 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,025 | 0 | 16,896 | 453 | 1.1 | 0.0 | 119.6 | 119.6 | 0.00 | 0.18 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,904 | 0 | 13,952 | 265 | 0.8 | 0.0 | 107.2 | 107.2 | 0.00 | 0.16 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,458 | 0 | 28,288 | 462 | 0.5 | 0.0 | 78.9 | 78.9 | 0.00 | 0.16 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,073 | 0 | 16,768 | 425 | 1.0 | 0.0 | 113.9 | 113.9 | 0.00 | 0.19 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,940 | 0 | 13,952 | 280 | 0.7 | 0.0 | 71.7 | 71.7 | 0.00 | 0.20 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,410 | 0 | 28,288 | 461 | 0.5 | 0.0 | 119.4 | 119.4 | 0.00 | 0.15 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,069 | 0 | 16,768 | 435 | 1.0 | 0.0 | 106.9 | 106.9 | 0.00 | 0.17 | Notification settings recovered and saved. |
| `v2-interaction-spa-retry-recovery` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,508 | 0 | 9,088 | 211 | 0.7 | 0.0 | 18.6 | 18.6 | 0.00 | 0.19 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,689 | 0 | 20,096 | 343 | 0.5 | 0.0 | 73.5 | 73.5 | 0.00 | 0.18 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,968 | 0 | 10,368 | 357 | 1.0 | 0.0 | 69.2 | 69.2 | 0.00 | 0.21 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 913 | 0 | 1,872 | 0 | 11,264 | 267 | 1.3 | 0.0 | 99.2 | 99.2 | 0.00 | 0.17 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,677 | 0 | 20,096 | 343 | 1.0 | 0.0 | 107.7 | 107.7 | 0.00 | 0.16 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,928 | 0 | 10,368 | 338 | 1.1 | 0.0 | 105.0 | 105.0 | 0.00 | 0.15 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,508 | 0 | 9,088 | 211 | 0.8 | 0.0 | 49.3 | 49.3 | 0.00 | 0.16 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,677 | 0 | 20,096 | 343 | 0.5 | 0.0 | 104.0 | 104.0 | 0.00 | 0.20 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,958 | 0 | 10,240 | 296 | 1.1 | 0.0 | 60.4 | 60.4 | 0.00 | 0.16 | Contacts synced after retry. |
| `v2-reading-landmark-jump` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 2,694 | 0 | 3,504 | 0 | 23,040 | 578 | 0.7 | 0.0 | 115.6 | 115.6 | 0.00 | 0.16 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 5,288 | 0 | 4,605 | 0 | 33,536 | 599 | 0.5 | 0.0 | 127.2 | 127.2 | 0.00 | 0.16 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 249 | 5 | 6,382 | 0 | 28,928 | 641 | 1.0 | 0.0 | 126.0 | 126.0 | 0.00 | 0.16 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,330 | 0 | 3,145 | 0 | 20,096 | 588 | 0.9 | 0.0 | 113.8 | 113.8 | 0.00 | 0.16 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 5,288 | 0 | 4,296 | 0 | 34,048 | 640 | 0.5 | 0.0 | 159.6 | 159.6 | 0.00 | 0.16 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | success | 1 | 11 | 0 | 12 | 0 | 249 | 5 | 6,365 | 0 | 29,056 | 625 | 1.0 | 0.0 | 127.2 | 127.2 | 0.00 | 0.18 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 2,694 | 0 | 3,445 | 0 | 22,912 | 551 | 0.7 | 0.0 | 75.1 | 75.1 | 0.00 | 0.22 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 5,288 | 0 | 4,451 | 0 | 33,664 | 601 | 0.4 | 0.0 | 125.8 | 125.8 | 0.00 | 0.17 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 3 | success | 1 | 11 | 0 | 12 | 0 | 249 | 5 | 6,492 | 0 | 29,056 | 646 | 1.1 | 0.0 | 123.7 | 123.7 | 0.00 | 0.20 | Current program release: Ember-985 |
| `v2-reading-deep-fact` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 2,207 | 0 | 3,288 | 0 | 22,656 | 643 | 0.8 | 0.0 | 121.1 | 121.1 | 0.00 | 0.21 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,192 | 0 | 33,280 | 617 | 0.4 | 0.0 | 123.4 | 123.4 | 0.00 | 0.17 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 1 | success | 1 | 29 | 1 | 30 | 0 | 454 | 13 | 64,664 | 0 | 148,096 | 4,748 | 1.0 | 0.0 | 411.6 | 411.6 | 0.00 | 0.15 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 2 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 2,207 | 0 | 3,154 | 0 | 22,400 | 538 | 1.1 | 0.0 | 119.8 | 119.8 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,124 | 0 | 33,280 | 588 | 0.8 | 0.0 | 112.1 | 112.1 | 0.00 | 0.15 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 298 | 7 | 9,513 | 0 | 58,624 | 1,331 | 1.0 | 0.0 | 224.7 | 224.7 | 0.00 | 0.17 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,829 | 0 | 2,735 | 0 | 19,712 | 543 | 0.8 | 0.0 | 72.2 | 72.2 | 0.00 | 0.16 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,143 | 0 | 33,536 | 668 | 0.4 | 0.0 | 116.1 | 116.1 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 3 | success | 1 | 21 | 0 | 22 | 0 | 358 | 10 | 26,694 | 0 | 90,112 | 2,116 | 1.1 | 0.0 | 239.0 | 239.0 | 0.00 | 0.20 | Appendix clause 31: Cinder-693 |
| `v2-reading-cross-region` | Mantis | 1 | success | 1 | 12 | 1 | 13 | 0 | 2,035 | 0 | 4,408 | 0 | 32,384 | 1,246 | 0.8 | 0.0 | 172.0 | 172.0 | 0.00 | 0.16 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 5,072 | 1 | 5,729 | 0 | 41,088 | 1,051 | 0.5 | 0.0 | 169.8 | 169.8 | 0.00 | 0.17 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 240 | 5 | 6,640 | 0 | 29,952 | 873 | 1.0 | 0.0 | 128.5 | 128.5 | 0.00 | 0.17 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 2 | success | 1 | 13 | 1 | 14 | 0 | 2,390 | 0 | 4,674 | 0 | 35,968 | 1,288 | 0.9 | 0.0 | 174.0 | 174.0 | 0.00 | 0.19 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 0 | 12 | 0 | 5,498 | 1 | 6,327 | 0 | 47,232 | 1,417 | 0.4 | 0.0 | 171.4 | 171.4 | 0.00 | 0.16 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 2 | success | 1 | 11 | 0 | 12 | 0 | 240 | 5 | 6,419 | 0 | 29,056 | 644 | 1.0 | 0.0 | 162.0 | 162.0 | 0.00 | 0.16 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 3 | success | 1 | 13 | 1 | 14 | 0 | 2,170 | 0 | 5,177 | 0 | 37,888 | 1,926 | 0.8 | 0.0 | 178.6 | 178.6 | 0.00 | 0.16 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,565 | 0 | 4,136 | 0 | 33,408 | 618 | 0.5 | 0.0 | 120.9 | 120.9 | 0.00 | 0.16 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 3 | success | 1 | 11 | 0 | 12 | 0 | 240 | 5 | 6,666 | 0 | 28,928 | 666 | 1.0 | 0.0 | 125.3 | 125.3 | 0.00 | 0.16 | Delivery region: Aster-862 |
| `v2-reading-collapsed-context` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,995 | 0 | 2,805 | 0 | 19,456 | 469 | 0.7 | 0.0 | 113.3 | 113.3 | 0.00 | 0.15 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,011 | 0 | 33,152 | 642 | 0.4 | 0.0 | 120.3 | 120.3 | 0.00 | 0.22 | answer did not match the expected result |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 1 | success | 1 | 25 | 2 | 26 | 0 | 368 | 11 | 50,839 | 0 | 141,568 | 6,084 | 1.0 | 0.0 | 360.1 | 360.1 | 0.00 | 0.17 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,001 | 0 | 2,899 | 0 | 20,096 | 549 | 0.7 | 0.0 | 66.5 | 66.5 | 0.00 | 0.16 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 3,922 | 0 | 33,280 | 628 | 0.4 | 0.0 | 117.3 | 117.3 | 0.00 | 0.16 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 2 | success | 1 | 29 | 1 | 30 | 0 | 538 | 13 | 70,451 | 0 | 171,520 | 5,717 | 1.0 | 0.0 | 413.8 | 413.8 | 0.00 | 0.19 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 2,439 | 0 | 3,350 | 0 | 22,656 | 549 | 0.7 | 0.0 | 70.1 | 70.1 | 0.00 | 0.19 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,034 | 0 | 32,896 | 562 | 0.4 | 0.0 | 114.5 | 114.5 | 0.00 | 0.17 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 3 | success | 1 | 23 | 2 | 24 | 0 | 366 | 9 | 26,053 | 0 | 129,920 | 5,193 | 1.1 | 0.0 | 304.1 | 304.1 | 0.00 | 0.17 | Expanded retained context: Dune-119 |
| `v2-workflow-multi-step-order` | Mantis | 1 | success | 1 | 13 | 0 | 14 | 0 | 2,550 | 0 | 4,422 | 0 | 32,256 | 598 | 0.9 | 0.0 | 167.3 | 167.3 | 0.00 | 0.17 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 15 | 0 | 16 | 0 | 7,188 | 0 | 6,657 | 0 | 62,208 | 942 | 0.4 | 0.0 | 180.6 | 180.6 | 0.00 | 0.18 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 1 | success | 1 | 43 | 0 | 44 | 0 | 512 | 20 | 103,843 | 0 | 207,872 | 2,995 | 1.0 | 0.0 | 531.7 | 531.7 | 0.00 | 0.16 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 2 | success | 1 | 15 | 1 | 16 | 0 | 2,373 | 1 | 4,990 | 0 | 40,448 | 810 | 0.7 | 0.0 | 192.8 | 192.8 | 0.00 | 0.20 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 15 | 0 | 16 | 0 | 7,188 | 0 | 6,465 | 0 | 62,720 | 1,067 | 0.4 | 0.0 | 134.1 | 134.1 | 0.00 | 0.18 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 2 | success | 1 | 35 | 0 | 36 | 0 | 461 | 17 | 82,643 | 0 | 155,264 | 3,101 | 1.0 | 0.0 | 472.7 | 472.7 | 0.00 | 0.16 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 3 | success | 1 | 13 | 0 | 14 | 0 | 2,550 | 0 | 4,278 | 0 | 32,768 | 654 | 0.7 | 0.0 | 137.9 | 137.9 | 0.00 | 0.19 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 15 | 0 | 16 | 0 | 7,157 | 1 | 7,266 | 0 | 71,552 | 1,086 | 0.6 | 0.0 | 140.9 | 140.9 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 3 | success | 1 | 36 | 1 | 37 | 0 | 459 | 17 | 81,331 | 0 | 166,400 | 2,987 | 1.1 | 0.0 | 471.5 | 471.5 | 0.00 | 0.15 | Receipt: Cinder-127 |
| `v2-workflow-cross-page-compare` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 3,408 | 0 | 3,920 | 0 | 28,544 | 526 | 0.8 | 0.0 | 158.0 | 158.0 | 0.00 | 0.19 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,632 | 0 | 51,584 | 778 | 0.6 | 0.0 | 167.8 | 167.8 | 0.00 | 0.21 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,592 | 0 | 45,568 | 957 | 1.2 | 0.0 | 172.8 | 172.8 | 0.00 | 0.20 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 2 | success | 1 | 12 | 0 | 13 | 0 | 3,689 | 0 | 4,101 | 0 | 32,256 | 689 | 0.7 | 0.0 | 133.9 | 133.9 | 0.00 | 0.21 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 14 | 0 | 15 | 0 | 7,205 | 1 | 6,839 | 0 | 57,088 | 899 | 0.4 | 0.0 | 173.4 | 173.4 | 0.00 | 0.17 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,472 | 0 | 45,568 | 812 | 1.2 | 0.0 | 176.5 | 176.5 | 0.00 | 0.15 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 3 | success | 1 | 14 | 0 | 15 | 0 | 4,040 | 0 | 5,056 | 0 | 39,424 | 999 | 0.8 | 0.0 | 138.9 | 138.9 | 0.00 | 0.17 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 14 | 0 | 15 | 0 | 7,469 | 0 | 6,107 | 0 | 57,344 | 893 | 0.5 | 0.0 | 181.7 | 181.7 | 0.00 | 0.17 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,154 | 0 | 45,696 | 790 | 1.1 | 0.0 | 177.5 | 177.5 | 0.00 | 0.17 | Receipt: Aster-301 |
| `v2-workflow-save-resume` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,708 | 0 | 27,904 | 537 | 0.8 | 0.0 | 123.7 | 123.7 | 0.00 | 0.16 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,782 | 0 | 40,832 | 675 | 0.5 | 0.0 | 170.5 | 170.5 | 0.00 | 0.16 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,623 | 0 | 36,480 | 646 | 1.0 | 0.0 | 179.7 | 179.7 | 0.00 | 0.15 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,700 | 0 | 27,904 | 539 | 0.7 | 0.0 | 119.2 | 119.2 | 0.00 | 0.17 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,814 | 0 | 40,832 | 644 | 0.4 | 0.0 | 119.5 | 119.5 | 0.00 | 0.17 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,646 | 0 | 36,736 | 684 | 1.0 | 0.0 | 177.0 | 177.0 | 0.00 | 0.19 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,720 | 0 | 27,904 | 544 | 0.7 | 0.0 | 130.1 | 130.1 | 0.00 | 0.15 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,715 | 0 | 40,832 | 638 | 0.4 | 0.0 | 168.2 | 168.2 | 0.00 | 0.18 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,691 | 0 | 36,608 | 681 | 1.1 | 0.0 | 178.8 | 178.8 | 0.00 | 0.18 | Receipt: Ember-583 |
| `v2-workflow-conditional-branch` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,586 | 0 | 18,048 | 412 | 0.7 | 0.0 | 112.6 | 112.6 | 0.00 | 0.19 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,487 | 0 | 46,720 | 728 | 0.5 | 0.0 | 191.1 | 191.1 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 1 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 32,121 | 0 | 97,664 | 1,383 | 1.1 | 0.0 | 297.9 | 297.9 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,123 | 0 | 3,648 | 0 | 26,496 | 511 | 0.8 | 0.0 | 170.0 | 170.0 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,300 | 0 | 47,104 | 799 | 0.5 | 0.0 | 126.8 | 126.8 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 32,021 | 0 | 97,536 | 1,344 | 1.0 | 0.0 | 300.3 | 300.3 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 3 | success | 1 | 10 | 0 | 11 | 0 | 1,788 | 0 | 3,283 | 0 | 23,680 | 521 | 0.7 | 0.0 | 111.0 | 111.0 | 0.00 | 0.20 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,314 | 0 | 46,976 | 727 | 0.5 | 0.0 | 134.5 | 134.5 | 0.00 | 0.20 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 3 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,561 | 0 | 97,792 | 1,335 | 1.1 | 0.0 | 258.7 | 258.7 | 0.00 | 0.16 | Receipt: Ember-356 |
| `v2-heldout-extra-table-grouped-total` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,402 | 0 | 1,590 | 0 | 9,472 | 247 | 0.8 | 0.0 | 56.8 | 56.8 | 0.00 | 0.18 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,762 | 0 | 3,238 | 0 | 21,504 | 367 | 0.5 | 0.0 | 120.0 | 120.0 | 0.00 | 0.20 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 190 | 3 | 3,908 | 0 | 10,368 | 328 | 1.1 | 0.0 | 64.0 | 64.0 | 0.00 | 0.17 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,402 | 0 | 1,589 | 0 | 9,472 | 234 | 0.8 | 0.0 | 55.7 | 55.7 | 0.00 | 0.16 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 4,762 | 0 | 3,122 | 0 | 21,632 | 367 | 0.5 | 0.0 | 106.6 | 106.6 | 0.00 | 0.15 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 190 | 3 | 3,810 | 0 | 10,496 | 340 | 1.0 | 0.0 | 64.9 | 64.9 | 0.00 | 0.22 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,402 | 0 | 1,590 | 0 | 9,472 | 234 | 0.7 | 0.0 | 56.2 | 56.2 | 0.00 | 0.19 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 4,762 | 0 | 3,138 | 0 | 21,632 | 369 | 0.5 | 0.0 | 112.4 | 112.4 | 0.00 | 0.16 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 190 | 3 | 3,520 | 0 | 10,752 | 324 | 1.0 | 0.0 | 61.4 | 61.4 | 0.00 | 0.18 | Coastal total: $478. |
| `v2-heldout-extra-table-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,725 | 0 | 2,082 | 0 | 11,776 | 289 | 0.7 | 0.0 | 56.4 | 56.4 | 0.00 | 0.16 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,779 | 0 | 3,508 | 0 | 21,632 | 439 | 0.9 | 0.0 | 104.6 | 104.6 | 0.00 | 0.21 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,865 | 0 | 10,624 | 439 | 1.5 | 0.0 | 101.8 | 101.8 | 0.00 | 0.19 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,725 | 0 | 2,007 | 0 | 11,904 | 348 | 1.2 | 0.0 | 101.3 | 101.3 | 0.00 | 0.17 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 4,779 | 0 | 3,334 | 0 | 21,632 | 403 | 0.5 | 0.0 | 71.3 | 71.3 | 0.00 | 0.17 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,911 | 0 | 10,496 | 407 | 1.0 | 0.0 | 113.1 | 113.1 | 0.00 | 0.21 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,725 | 0 | 2,063 | 0 | 11,776 | 327 | 0.8 | 0.0 | 64.4 | 64.4 | 0.00 | 0.16 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 4,779 | 0 | 3,432 | 0 | 21,632 | 429 | 0.4 | 0.0 | 99.6 | 99.6 | 0.00 | 0.19 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,883 | 0 | 10,624 | 408 | 1.1 | 0.0 | 65.1 | 65.1 | 0.00 | 0.20 | Record RQ-361 repaired. |
| `v2-heldout-extra-list-offscreen-action` | Mantis | 1 | success | 1 | 10 | 0 | 11 | 0 | 7,027 | 0 | 4,747 | 0 | 29,568 | 629 | 0.8 | 0.0 | 118.7 | 118.7 | 0.00 | 0.20 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 13,873 | 0 | 5,008 | 0 | 16,768 | 292 | 0.4 | 0.0 | 66.6 | 66.6 | 0.00 | 0.18 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 303 | 6 | 7,934 | 0 | 36,608 | 1,001 | 1.3 | 0.0 | 134.1 | 134.1 | 0.00 | 0.20 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Mantis | 2 | success | 1 | 9 | 0 | 10 | 0 | 7,038 | 0 | 4,443 | 0 | 26,496 | 547 | 0.7 | 0.0 | 114.1 | 114.1 | 0.00 | 0.21 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 13,873 | 0 | 4,960 | 0 | 16,768 | 274 | 0.5 | 0.0 | 59.1 | 59.1 | 0.00 | 0.22 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 373 | 8 | 10,026 | 0 | 61,440 | 1,141 | 1.2 | 0.0 | 183.1 | 183.1 | 0.00 | 0.20 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 6,996 | 0 | 4,403 | 0 | 26,752 | 539 | 0.7 | 0.0 | 108.4 | 108.4 | 0.00 | 0.20 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 13,873 | 0 | 4,992 | 0 | 16,768 | 302 | 0.6 | 0.0 | 60.6 | 60.6 | 0.00 | 0.20 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 404 | 9 | 17,609 | 0 | 70,400 | 1,404 | 1.1 | 0.0 | 234.3 | 234.3 | 0.00 | 0.16 | alert-086 marked as read. |
| `v2-heldout-extra-list-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 4,087 | 0 | 2,666 | 0 | 14,080 | 302 | 0.8 | 0.0 | 60.1 | 60.1 | 0.00 | 0.20 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 12,273 | 0 | 5,959 | 0 | 33,536 | 450 | 0.5 | 0.0 | 127.2 | 127.2 | 0.00 | 0.21 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 21 | 0 | 22 | 0 | 331 | 10 | 24,270 | 0 | 80,256 | 1,211 | 1.2 | 0.0 | 286.5 | 286.5 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 4,087 | 0 | 2,709 | 0 | 14,080 | 320 | 0.8 | 0.0 | 65.4 | 65.4 | 0.00 | 0.19 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 12,273 | 0 | 5,933 | 0 | 33,536 | 440 | 0.6 | 0.0 | 65.6 | 65.6 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 19 | 0 | 20 | 0 | 311 | 9 | 17,097 | 0 | 71,040 | 1,160 | 1.2 | 0.0 | 238.9 | 238.9 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 4,087 | 0 | 2,839 | 0 | 13,952 | 314 | 0.9 | 0.0 | 69.3 | 69.3 | 0.00 | 0.16 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 12,273 | 0 | 6,015 | 0 | 33,536 | 455 | 0.5 | 0.0 | 111.7 | 111.7 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 20 | 0 | 21 | 0 | 331 | 9 | 17,725 | 0 | 78,336 | 1,328 | 1.1 | 0.0 | 283.5 | 283.5 | 0.00 | 0.19 | case-050 selected from refreshed results. |
| `v2-heldout-extra-chart-legend-filter` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,520 | 0 | 2,025 | 0 | 11,776 | 335 | 0.8 | 0.0 | 64.0 | 64.0 | 0.00 | 0.19 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,486 | 0 | 2,989 | 0 | 20,864 | 395 | 0.5 | 0.0 | 70.8 | 70.8 | 0.00 | 0.18 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 15 | 1 | 16 | 0 | 406 | 6 | 9,258 | 0 | 52,864 | 1,756 | 1.4 | 0.0 | 228.4 | 228.4 | 0.00 | 0.17 | fixture check failed (12 observations) |
| `v2-heldout-extra-chart-legend-filter` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,929 | 0 | 2,449 | 0 | 14,336 | 375 | 1.0 | 0.0 | 101.8 | 101.8 | 0.00 | 0.18 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,486 | 0 | 3,045 | 0 | 20,864 | 404 | 0.6 | 0.0 | 103.7 | 103.7 | 0.00 | 0.16 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Screenshots (click by x,y) | 2 | step_limit | 1 | 50 | 1 | 50 | 0 | 957 | 24 | 247,152 | 0 | 481,152 | 22,455 | 1.1 | 0.0 | 795.0 | 795.0 | 0.00 | 0.16 | agent step budget exhausted at 50 steps |
| `v2-heldout-extra-chart-legend-filter` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,520 | 0 | 2,069 | 0 | 11,776 | 353 | 0.8 | 0.0 | 106.8 | 106.8 | 0.00 | 0.21 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,486 | 0 | 3,031 | 0 | 20,864 | 389 | 0.4 | 0.0 | 101.6 | 101.6 | 0.00 | 0.16 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 40 | 1 | 41 | 0 | 623 | 19 | 193,096 | 0 | 320,128 | 15,862 | 1.2 | 0.0 | 724.8 | 724.8 | 0.00 | 0.17 | fixture check failed (30 observations) |
| `v2-heldout-extra-chart-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,872 | 0 | 2,013 | 0 | 12,032 | 386 | 0.8 | 0.0 | 59.1 | 59.1 | 0.00 | 0.16 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,480 | 0 | 2,804 | 0 | 20,864 | 371 | 0.4 | 0.0 | 65.1 | 65.1 | 0.00 | 0.19 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 1 | 19 | 0 | 276 | 8 | 12,995 | 0 | 90,368 | 4,000 | 1.2 | 0.0 | 253.0 | 253.0 | 0.00 | 0.22 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,872 | 0 | 1,987 | 0 | 11,904 | 314 | 0.7 | 0.0 | 17.9 | 17.9 | 0.00 | 0.20 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,480 | 0 | 2,846 | 0 | 20,864 | 392 | 0.4 | 0.0 | 62.2 | 62.2 | 0.00 | 0.18 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 201 | 4 | 5,605 | 0 | 17,280 | 963 | 1.1 | 0.0 | 76.2 | 76.2 | 0.00 | 0.20 | fixture check failed (7 observations) |
| `v2-heldout-extra-chart-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,872 | 0 | 2,112 | 0 | 11,776 | 281 | 0.8 | 0.0 | 59.5 | 59.5 | 0.00 | 0.16 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,480 | 0 | 2,802 | 0 | 20,864 | 382 | 0.4 | 0.0 | 105.2 | 105.2 | 0.00 | 0.18 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,959 | 0 | 10,368 | 702 | 1.0 | 0.0 | 105.4 | 105.4 | 0.00 | 0.18 | fixture check failed (5 observations) |
| `v2-heldout-extra-form-date-range` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,116 | 0 | 1,630 | 0 | 9,472 | 274 | 1.0 | 0.0 | 55.3 | 55.3 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,235 | 0 | 3,023 | 0 | 20,864 | 478 | 0.5 | 0.0 | 67.2 | 67.2 | 0.00 | 0.18 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Screenshots (click by x,y) | 1 | success | 1 | 22 | 0 | 23 | 0 | 338 | 9 | 19,213 | 0 | 87,168 | 1,888 | 1.1 | 0.0 | 243.2 | 243.2 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,116 | 0 | 1,676 | 0 | 9,472 | 305 | 0.8 | 0.0 | 55.0 | 55.0 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,520 | 0 | 2,501 | 0 | 17,152 | 456 | 0.4 | 0.0 | 59.1 | 59.1 | 0.00 | 0.17 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Screenshots (click by x,y) | 2 | success | 1 | 63 | 0 | 44 | 0 | 903 | 19 | 128,889 | 0 | 274,304 | 6,808 | 1.0 | 0.0 | 548.2 | 548.2 | 0.00 | 0.23 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,116 | 0 | 1,592 | 0 | 9,472 | 262 | 0.8 | 0.0 | 58.2 | 58.2 | 0.00 | 0.16 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,520 | 0 | 2,389 | 0 | 17,152 | 415 | 0.4 | 0.0 | 58.8 | 58.8 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Screenshots (click by x,y) | 3 | success | 1 | 27 | 0 | 28 | 0 | 400 | 11 | 40,453 | 0 | 126,464 | 3,342 | 1.1 | 0.0 | 355.4 | 355.4 | 0.00 | 0.17 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-custom-toggle` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,546 | 0 | 1,900 | 0 | 11,648 | 274 | 0.7 | 0.0 | 55.8 | 55.8 | 0.00 | 0.16 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,432 | 0 | 2,708 | 0 | 20,864 | 354 | 0.4 | 0.0 | 105.3 | 105.3 | 0.00 | 0.15 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 181 | 3 | 3,920 | 0 | 10,368 | 339 | 1.1 | 0.0 | 62.7 | 62.7 | 0.00 | 0.16 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,127 | 0 | 1,511 | 0 | 9,344 | 248 | 0.7 | 0.0 | 15.0 | 15.0 | 0.00 | 0.18 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,432 | 0 | 2,756 | 0 | 20,864 | 378 | 0.4 | 0.0 | 62.5 | 62.5 | 0.00 | 0.16 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 181 | 3 | 3,914 | 0 | 10,368 | 340 | 1.0 | 0.0 | 102.9 | 102.9 | 0.00 | 0.16 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,127 | 0 | 1,439 | 0 | 9,344 | 230 | 0.7 | 0.0 | 15.8 | 15.8 | 0.00 | 0.17 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,432 | 0 | 2,724 | 0 | 20,864 | 364 | 0.5 | 0.0 | 65.3 | 65.3 | 0.00 | 0.16 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 181 | 3 | 3,764 | 0 | 10,496 | 335 | 1.1 | 0.0 | 104.7 | 104.7 | 0.00 | 0.20 | Pager notifications enabled. |
| `v2-heldout-extra-overlay-focus-trap` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,486 | 0 | 2,098 | 0 | 14,080 | 345 | 0.7 | 0.0 | 103.9 | 103.9 | 0.00 | 0.17 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 3,263 | 0 | 3,041 | 0 | 24,576 | 450 | 0.4 | 0.0 | 99.9 | 99.9 | 0.00 | 0.18 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Screenshots (click by x,y) | 1 | success | 1 | 9 | 0 | 10 | 0 | 217 | 4 | 5,057 | 0 | 19,712 | 461 | 1.0 | 0.0 | 72.6 | 72.6 | 0.00 | 0.16 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,201 | 0 | 1,746 | 0 | 11,648 | 310 | 0.7 | 0.0 | 60.9 | 60.9 | 0.00 | 0.17 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 4,149 | 0 | 3,762 | 0 | 30,080 | 566 | 0.5 | 0.0 | 107.6 | 107.6 | 0.00 | 0.16 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Screenshots (click by x,y) | 2 | success | 1 | 9 | 0 | 10 | 0 | 217 | 4 | 5,287 | 0 | 19,456 | 453 | 1.3 | 0.0 | 77.9 | 77.9 | 0.00 | 0.16 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,636 | 0 | 1,956 | 0 | 14,208 | 290 | 0.9 | 0.0 | 60.8 | 60.8 | 0.00 | 0.20 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 3,263 | 0 | 3,056 | 0 | 24,576 | 457 | 0.5 | 0.0 | 67.6 | 67.6 | 0.00 | 0.17 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 448 | 4 | 5,736 | 0 | 22,272 | 613 | 1.0 | 0.0 | 110.3 | 110.3 | 0.00 | 0.19 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-recovery` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,314 | 0 | 2,880 | 0 | 19,968 | 582 | 0.8 | 0.0 | 107.3 | 107.3 | 0.00 | 0.30 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 4,389 | 0 | 3,633 | 0 | 28,928 | 482 | 0.5 | 0.0 | 120.2 | 120.2 | 0.00 | 0.16 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 205 | 4 | 5,091 | 0 | 17,280 | 541 | 1.0 | 0.0 | 68.4 | 68.4 | 0.00 | 0.17 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,314 | 0 | 2,936 | 0 | 19,456 | 524 | 0.8 | 0.0 | 111.6 | 111.6 | 0.00 | 0.16 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 4,389 | 0 | 3,663 | 0 | 28,800 | 465 | 0.4 | 0.0 | 106.4 | 106.4 | 0.00 | 0.16 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 205 | 4 | 5,099 | 0 | 17,152 | 510 | 1.1 | 0.0 | 73.0 | 73.0 | 0.00 | 0.16 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 2,314 | 0 | 3,117 | 0 | 19,584 | 556 | 0.8 | 0.0 | 64.2 | 64.2 | 0.00 | 0.17 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 4,389 | 0 | 3,855 | 0 | 29,056 | 549 | 0.5 | 0.0 | 116.6 | 116.6 | 0.00 | 0.16 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 205 | 4 | 5,193 | 0 | 17,280 | 547 | 1.0 | 0.0 | 108.8 | 108.8 | 0.00 | 0.17 | Release notes pinned from current actions. |
| `v2-heldout-extra-spa-stale-target` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,223 | 0 | 1,773 | 0 | 11,648 | 251 | 0.8 | 0.0 | 56.8 | 56.8 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,955 | 0 | 2,786 | 0 | 20,608 | 395 | 0.4 | 0.0 | 62.2 | 62.2 | 0.00 | 0.17 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 176 | 3 | 3,925 | 0 | 10,368 | 330 | 1.1 | 0.0 | 58.5 | 58.5 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,579 | 0 | 2,242 | 0 | 14,208 | 345 | 0.7 | 0.0 | 114.6 | 114.6 | 0.00 | 0.20 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,955 | 0 | 2,750 | 0 | 20,608 | 379 | 0.5 | 0.0 | 103.6 | 103.6 | 0.00 | 0.18 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 176 | 3 | 3,855 | 0 | 10,496 | 344 | 1.1 | 0.0 | 66.5 | 66.5 | 0.00 | 0.19 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,579 | 0 | 2,327 | 0 | 14,208 | 377 | 0.7 | 0.0 | 56.2 | 56.2 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,955 | 0 | 2,788 | 0 | 20,608 | 411 | 0.4 | 0.0 | 60.2 | 60.2 | 0.00 | 0.19 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 176 | 3 | 3,925 | 0 | 10,368 | 330 | 1.0 | 0.0 | 71.3 | 71.3 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-error-boundary` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,714 | 0 | 2,345 | 0 | 16,640 | 363 | 0.7 | 0.0 | 65.6 | 65.6 | 0.00 | 0.16 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,873 | 0 | 3,477 | 0 | 28,544 | 432 | 0.4 | 0.0 | 74.9 | 74.9 | 0.00 | 0.16 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 209 | 4 | 4,950 | 0 | 16,896 | 398 | 1.0 | 0.0 | 71.3 | 71.3 | 0.00 | 0.17 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,714 | 0 | 2,396 | 0 | 16,512 | 337 | 0.8 | 0.0 | 73.3 | 73.3 | 0.00 | 0.15 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,873 | 0 | 3,573 | 0 | 28,416 | 427 | 0.5 | 0.0 | 113.1 | 113.1 | 0.00 | 0.16 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Screenshots (click by x,y) | 2 | success | 1 | 27 | 0 | 28 | 0 | 493 | 14 | 55,331 | 0 | 110,464 | 2,002 | 1.4 | 0.0 | 311.4 | 311.4 | 0.00 | 0.18 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,714 | 0 | 2,410 | 0 | 16,512 | 339 | 0.9 | 0.0 | 115.1 | 115.1 | 0.00 | 0.17 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,873 | 0 | 3,493 | 0 | 28,544 | 431 | 0.6 | 0.0 | 111.5 | 111.5 | 0.00 | 0.16 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 209 | 4 | 4,996 | 0 | 16,896 | 415 | 1.1 | 0.0 | 118.7 | 118.7 | 0.00 | 0.15 | Contacts imported after recovery. |
| `v2-heldout-reading-sticky-context` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,228 | 0 | 1,658 | 0 | 9,472 | 361 | 1.0 | 0.0 | 106.5 | 106.5 | 0.00 | 0.16 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,142 | 0 | 2,835 | 0 | 20,736 | 386 | 0.5 | 0.0 | 103.7 | 103.7 | 0.00 | 0.19 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 1 | success | 1 | 19 | 1 | 20 | 0 | 295 | 9 | 17,938 | 0 | 74,624 | 1,477 | 1.0 | 0.0 | 235.1 | 235.1 | 0.00 | 0.17 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,604 | 0 | 2,292 | 0 | 14,208 | 384 | 0.8 | 0.0 | 61.7 | 61.7 | 0.00 | 0.15 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,142 | 0 | 2,897 | 0 | 20,736 | 454 | 0.4 | 0.0 | 109.5 | 109.5 | 0.00 | 0.16 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 2 | success | 1 | 35 | 1 | 36 | 0 | 591 | 15 | 83,803 | 0 | 182,144 | 6,098 | 1.1 | 0.0 | 380.6 | 380.6 | 0.00 | 0.15 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,604 | 0 | 2,265 | 0 | 14,208 | 382 | 0.7 | 0.0 | 56.5 | 56.5 | 0.00 | 0.15 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,323 | 0 | 1,998 | 0 | 13,696 | 270 | 0.7 | 0.0 | 15.1 | 15.1 | 0.00 | 0.16 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 3 | success | 1 | 19 | 1 | 20 | 0 | 300 | 9 | 18,508 | 0 | 77,184 | 1,810 | 1.1 | 0.0 | 237.8 | 237.8 | 0.00 | 0.15 | Juniper-418 |
| `v2-heldout-reading-recovery` | Mantis | 1 | step_limit | 1 | 80 | 12 | 50 | 0 | 9,734 | 2 | 27,069 | 0 | 392,448 | 13,877 | 0.7 | 0.0 | 666.7 | 666.7 | 0.00 | 0.20 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,218 | 1 | 3,352 | 0 | 20,096 | 694 | 0.4 | 0.0 | 114.2 | 114.2 | 0.00 | 0.16 | Dune-502 |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 1 | step_limit | 1 | 50 | 2 | 50 | 0 | 2,564 | 19 | 149,620 | 0 | 380,928 | 10,162 | 1.0 | 0.0 | 647.1 | 647.1 | 0.00 | 0.16 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Mantis | 2 | success | 1 | 9 | 0 | 10 | 0 | 1,235 | 1 | 3,633 | 0 | 22,400 | 937 | 0.7 | 0.0 | 117.7 | 117.7 | 0.00 | 0.17 | Dune-502 |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 21 | 3 | 20 | 0 | 7,364 | 2 | 12,256 | 0 | 111,104 | 5,022 | 0.4 | 0.0 | 245.4 | 245.4 | 0.00 | 0.16 | Dune-502 |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 2 | step_limit | 1 | 50 | 3 | 50 | 0 | 1,669 | 20 | 178,453 | 0 | 382,976 | 13,945 | 1.0 | 0.0 | 687.5 | 687.5 | 0.00 | 0.14 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Mantis | 3 | cli_error | 1 | 95 | 9 | 50 | 0 | 12,142 | 1 | 76,830 | 0 | 668,288 | 69,939 | 0.7 | 0.0 | 918.7 | 918.7 | 0.00 | 0.14 | sarvam CLI returned an error result |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 23 | 2 | 24 | 0 | 9,362 | 1 | 18,585 | 0 | 184,320 | 10,151 | 0.4 | 0.0 | 416.5 | 416.5 | 0.00 | 0.17 | Dune-502 |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 3 | step_limit | 1 | 50 | 2 | 50 | 0 | 1,801 | 22 | 169,537 | 0 | 348,160 | 11,917 | 1.0 | 0.0 | 557.0 | 557.0 | 0.00 | 0.13 | agent step budget exhausted at 50 steps |
| `v2-heldout-workflow-review-submit` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 940 | 0 | 1,485 | 0 | 9,344 | 246 | 0.7 | 0.0 | 49.8 | 49.8 | 0.00 | 0.16 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,207 | 0 | 2,242 | 0 | 16,896 | 351 | 0.4 | 0.0 | 57.9 | 57.9 | 0.00 | 0.16 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 224 | 3 | 4,368 | 0 | 14,208 | 400 | 1.0 | 0.0 | 114.9 | 114.9 | 0.00 | 0.16 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 933 | 0 | 1,444 | 0 | 9,472 | 266 | 0.7 | 0.0 | 56.5 | 56.5 | 0.00 | 0.16 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,207 | 0 | 2,235 | 0 | 16,896 | 351 | 0.4 | 0.0 | 55.6 | 55.6 | 0.00 | 0.18 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 226 | 3 | 4,460 | 0 | 14,208 | 415 | 1.4 | 0.0 | 60.7 | 60.7 | 0.00 | 0.17 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 933 | 0 | 1,454 | 0 | 9,472 | 276 | 0.7 | 0.0 | 10.7 | 10.7 | 0.00 | 0.15 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,207 | 0 | 2,246 | 0 | 16,896 | 350 | 0.5 | 0.0 | 56.8 | 56.8 | 0.00 | 0.15 | Ember-614 |
| `v2-heldout-workflow-review-submit` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 224 | 3 | 4,368 | 0 | 14,208 | 390 | 1.0 | 0.0 | 108.5 | 108.5 | 0.00 | 0.21 | Ember-614 |
| `v2-heldout-workflow-recovery` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,415 | 0 | 2,382 | 0 | 16,128 | 456 | 0.7 | 0.0 | 101.8 | 101.8 | 0.00 | 0.16 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,000 | 1 | 4,541 | 0 | 33,664 | 629 | 0.4 | 0.0 | 67.8 | 67.8 | 0.00 | 0.16 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 191 | 4 | 4,998 | 0 | 16,896 | 430 | 1.0 | 0.0 | 65.9 | 65.9 | 0.00 | 0.15 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Mantis | 2 | success | 1 | 15 | 1 | 16 | 0 | 2,360 | 1 | 4,866 | 0 | 40,448 | 929 | 0.9 | 0.0 | 127.9 | 127.9 | 0.00 | 0.17 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,513 | 0 | 3,288 | 0 | 28,032 | 439 | 0.4 | 0.0 | 65.3 | 65.3 | 0.00 | 0.17 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 191 | 4 | 4,990 | 0 | 16,896 | 428 | 1.0 | 0.0 | 108.9 | 108.9 | 0.00 | 0.18 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,708 | 0 | 2,583 | 0 | 18,688 | 476 | 0.7 | 0.0 | 113.2 | 113.2 | 0.00 | 0.16 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,513 | 0 | 3,276 | 0 | 28,032 | 435 | 0.4 | 0.0 | 69.9 | 69.9 | 0.00 | 0.17 | Fjord-733 |
| `v2-heldout-workflow-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 191 | 4 | 5,050 | 0 | 16,896 | 438 | 1.0 | 0.0 | 107.2 | 107.2 | 0.00 | 0.16 | Fjord-733 |
| `v21-reliability-inline-prose-tail` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,594 | 0 | 1,125 | 0 | 5,248 | 161 | 0.7 | 0.0 | 9.4 | 9.4 | 0.00 | 0.17 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,423 | 0 | 1,229 | 0 | 7,424 | 171 | 0.4 | 0.0 | 13.7 | 13.7 | 0.00 | 0.16 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 155 | 2 | 2,727 | 0 | 5,504 | 243 | 1.1 | 0.0 | 56.8 | 56.8 | 0.00 | 0.23 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,594 | 0 | 1,148 | 0 | 5,248 | 230 | 0.8 | 0.0 | 51.6 | 51.6 | 0.00 | 0.18 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,423 | 0 | 1,104 | 0 | 7,552 | 243 | 0.5 | 0.0 | 46.9 | 46.9 | 0.00 | 0.17 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 155 | 2 | 2,765 | 0 | 5,504 | 256 | 1.0 | 0.0 | 50.7 | 50.7 | 0.00 | 0.20 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,594 | 0 | 1,140 | 0 | 5,248 | 208 | 0.8 | 0.0 | 6.0 | 6.0 | 0.00 | 0.17 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,423 | 0 | 1,102 | 0 | 7,552 | 176 | 0.5 | 0.0 | 6.2 | 6.2 | 0.00 | 0.20 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 155 | 2 | 2,741 | 0 | 5,504 | 247 | 1.0 | 0.0 | 55.3 | 55.3 | 0.00 | 0.14 | Juniper-829 |
| `v21-reliability-visible-prose` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 544 | 0 | 960 | 0 | 5,120 | 204 | 0.8 | 0.0 | 4.5 | 4.5 | 0.00 | 0.16 | Harbor-17 |
| `v21-reliability-visible-prose` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 917 | 0 | 981 | 0 | 7,552 | 158 | 0.5 | 0.0 | 49.9 | 49.9 | 0.00 | 0.16 | Harbor-17 |
| `v21-reliability-visible-prose` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 134 | 1 | 1,452 | 0 | 2,304 | 138 | 1.2 | 0.0 | 48.9 | 48.9 | 0.00 | 0.15 | Harbor-17 |
| `v21-reliability-visible-prose` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 544 | 0 | 960 | 0 | 5,120 | 210 | 1.6 | 0.0 | 47.3 | 47.3 | 0.00 | 0.15 | Harbor-17 |
| `v21-reliability-visible-prose` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 917 | 0 | 990 | 0 | 7,552 | 165 | 0.9 | 0.0 | 44.3 | 44.3 | 0.00 | 0.15 | Harbor-17 |
| `v21-reliability-visible-prose` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 134 | 1 | 1,456 | 0 | 2,304 | 179 | 1.8 | 0.0 | 6.5 | 6.5 | 0.00 | 0.18 | Harbor-17 |
| `v21-reliability-visible-prose` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 544 | 0 | 959 | 0 | 5,120 | 179 | 1.6 | 0.0 | 4.0 | 4.0 | 0.00 | 0.17 | Harbor-17 |
| `v21-reliability-visible-prose` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 917 | 0 | 1,140 | 0 | 7,424 | 178 | 1.0 | 0.0 | 5.7 | 5.7 | 0.00 | 0.16 | Harbor-17 |
| `v21-reliability-visible-prose` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 134 | 1 | 1,456 | 0 | 2,304 | 151 | 1.8 | 0.0 | 6.1 | 6.1 | 0.00 | 0.16 | Harbor-17 |
| `v21-reliability-recycled-control` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,651 | 0 | 2,059 | 0 | 14,208 | 308 | 1.6 | 0.0 | 63.2 | 63.2 | 0.00 | 0.15 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 3,300 | 0 | 3,214 | 0 | 24,192 | 489 | 1.1 | 0.0 | 64.4 | 64.4 | 0.00 | 0.17 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 233 | 4 | 5,449 | 0 | 20,992 | 520 | 1.9 | 0.0 | 72.3 | 72.3 | 0.00 | 0.17 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,651 | 0 | 2,070 | 0 | 14,208 | 319 | 1.5 | 0.0 | 60.9 | 60.9 | 0.00 | 0.16 | Cedar-73 completed. |
| `v21-reliability-recycled-control` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 3,300 | 0 | 3,274 | 0 | 24,192 | 482 | 1.1 | 0.0 | 69.1 | 69.1 | 0.00 | 0.16 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 233 | 4 | 5,636 | 0 | 20,992 | 554 | 1.9 | 0.0 | 121.3 | 121.3 | 0.00 | 0.24 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,651 | 0 | 2,140 | 0 | 14,208 | 315 | 0.7 | 0.0 | 64.3 | 64.3 | 0.00 | 0.19 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 3,300 | 0 | 3,012 | 0 | 24,320 | 451 | 0.5 | 0.0 | 65.7 | 65.7 | 0.00 | 0.15 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 233 | 4 | 5,635 | 0 | 21,120 | 560 | 1.3 | 0.0 | 118.2 | 118.2 | 0.00 | 0.15 | Receipt: Cedar-73 completed. |
| `v21-reliability-iframe-shadow-media` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 626 | 0 | 888 | 0 | 5,248 | 197 | 1.0 | 0.0 | 53.2 | 53.2 | 0.00 | 0.18 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,001 | 0 | 1,031 | 0 | 7,552 | 230 | 0.5 | 0.0 | 8.5 | 8.5 | 0.00 | 0.18 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 146 | 1 | 1,480 | 0 | 2,304 | 318 | 1.0 | 0.0 | 6.2 | 6.2 | 0.00 | 0.16 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 615 | 0 | 913 | 0 | 5,248 | 224 | 0.8 | 0.0 | 5.6 | 5.6 | 0.00 | 0.20 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,001 | 0 | 1,033 | 0 | 7,552 | 169 | 0.5 | 0.0 | 7.3 | 7.3 | 0.00 | 0.16 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 146 | 1 | 1,470 | 0 | 2,304 | 218 | 1.8 | 0.0 | 56.5 | 56.5 | 0.00 | 0.19 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,113 | 0 | 1,673 | 0 | 9,600 | 407 | 1.4 | 0.0 | 60.2 | 60.2 | 0.00 | 0.21 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,001 | 0 | 1,031 | 0 | 7,552 | 204 | 1.0 | 0.0 | 52.9 | 52.9 | 0.00 | 0.16 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 166 | 2 | 3,160 | 0 | 5,888 | 681 | 1.1 | 0.0 | 62.5 | 62.5 | 0.00 | 0.14 | 73 lux |
| `v21-reliability-visible-chart-series` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 827 | 1 | 1,793 | 0 | 9,344 | 439 | 0.8 | 0.0 | 60.9 | 60.9 | 0.00 | 0.16 | 64 units |
| `v21-reliability-visible-chart-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 2,284 | 1 | 3,461 | 0 | 18,432 | 1,290 | 0.9 | 0.0 | 112.6 | 112.6 | 0.00 | 0.16 | 64 units |
| `v21-reliability-visible-chart-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 148 | 1 | 1,481 | 0 | 2,304 | 168 | 1.1 | 0.0 | 56.7 | 56.7 | 0.00 | 0.15 | 64 units |
| `v21-reliability-visible-chart-series` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 807 | 0 | 1,309 | 0 | 7,168 | 364 | 0.7 | 0.0 | 54.9 | 54.9 | 0.00 | 0.14 | 64 units |
| `v21-reliability-visible-chart-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 1 | 11 | 0 | 4,339 | 3 | 8,516 | 0 | 47,360 | 3,352 | 0.8 | 0.0 | 135.1 | 135.1 | 0.00 | 0.18 | 64 units |
| `v21-reliability-visible-chart-series` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 169 | 2 | 2,761 | 0 | 5,504 | 261 | 1.1 | 0.0 | 56.3 | 56.3 | 0.00 | 0.27 | 64 units |
| `v21-reliability-visible-chart-series` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 487 | 0 | 822 | 0 | 5,248 | 243 | 1.1 | 0.0 | 54.3 | 54.3 | 0.00 | 0.21 | 64 units |
| `v21-reliability-visible-chart-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 7 | 0 | 2,654 | 2 | 4,032 | 0 | 23,040 | 1,096 | 0.5 | 0.0 | 66.6 | 66.6 | 0.00 | 0.15 | 64 units |
| `v21-reliability-visible-chart-series` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 148 | 1 | 1,481 | 0 | 2,304 | 228 | 1.1 | 0.0 | 55.9 | 55.9 | 0.00 | 0.20 | 64 units |
| `v21-reliability-nested-child-action` | Mantis | 1 | success | 1 | 13 | 2 | 14 | 0 | 1,879 | 1 | 4,973 | 0 | 34,816 | 1,331 | 0.9 | 0.0 | 124.3 | 124.3 | 0.00 | 0.13 | Request approved. |
| `v21-reliability-nested-child-action` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,922 | 0 | 1,917 | 0 | 13,696 | 353 | 0.5 | 0.0 | 57.6 | 57.6 | 0.00 | 0.16 | Request approved. |
| `v21-reliability-nested-child-action` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 167 | 2 | 2,717 | 0 | 5,632 | 288 | 1.4 | 0.0 | 57.0 | 57.0 | 0.00 | 0.15 | Request approved. |
| `v21-reliability-nested-child-action` | Mantis | 2 | success | 1 | 19 | 2 | 17 | 0 | 2,580 | 0 | 5,777 | 0 | 47,616 | 2,089 | 0.7 | 0.0 | 128.8 | 128.8 | 0.00 | 0.14 | Request approved. |
| `v21-reliability-nested-child-action` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,922 | 0 | 1,904 | 0 | 13,696 | 364 | 0.6 | 0.0 | 12.6 | 12.6 | 0.00 | 0.14 | Request approved. |
| `v21-reliability-nested-child-action` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 167 | 2 | 2,809 | 0 | 5,632 | 335 | 1.1 | 0.0 | 58.6 | 58.6 | 0.00 | 0.15 | Request approved. |
| `v21-reliability-nested-child-action` | Mantis | 3 | success | 1 | 10 | 1 | 10 | 0 | 1,486 | 1 | 3,502 | 0 | 23,040 | 967 | 0.8 | 0.0 | 64.4 | 64.4 | 0.00 | 0.13 | Request approved. |
| `v21-reliability-nested-child-action` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,922 | 0 | 1,956 | 0 | 13,696 | 368 | 0.5 | 0.0 | 55.8 | 55.8 | 0.00 | 0.14 | Request approved. |
| `v21-reliability-nested-child-action` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 167 | 2 | 2,835 | 0 | 5,632 | 352 | 1.0 | 0.0 | 58.9 | 58.9 | 0.00 | 0.15 | Request approved. |
