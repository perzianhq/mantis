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
| Correct | 93 / 96 | 92 / 96 | 92 / 96 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 3 | 4 | 4 |
| Tool calls (including retries) | 792 | 935 | 1,287 |
| Sarvam API attempts (including retries) | 860 | 1,010 | 1,379 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1651.7 | 2340.2 | 2838.4 |
| Sarvam limiter queue / cooldown (total, s) | 7846.6 / 0.0 | 9771.4 / 0.0 | 13237.6 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 1380.5 / 0.0 | 1968.4 / 0.0 | 2490.8 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 15 | 12 | 12 |
| Browser observation text (observed chars) | 331,936 | 835,985 | 25,679 |
| Browser observation images (observed blocks) | 17 | 54 | 592 |
| Normal input tokens (total) | 363,426 | 669,039 | 1,403,623 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 2,535,936 | 5,857,024 | 4,675,328 |
| Output tokens (total) | 81,724 | 131,120 | 141,500 |
| Total input tokens incl. cache (legacy) | 2,899,362 | 6,526,063 | 6,078,951 |
| MCP startup (total, s) | 128.4 | 82.0 | 174.9 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 9498.3 | 12111.6 | 16076.1 |
| CLI wall (total, s) | 9498.3 | 12111.6 | 16076.1 |
| Fixture verification (total, s) | 0.1 | 0.0 | 0.0 |
| Cleanup (total, s) | 28.4 | 30.2 | 28.8 |
| Harness capture (total, s) | 90.8 | 650.5 | 113.7 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 18.93 | 33.42 | 52.29 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,284 | 0 | 8,320 | 274 | 1.7 | 0.0 | 4.7 | 4.7 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,281 | 0 | 33,920 | 411 | 1.2 | 0.0 | 62.3 | 62.3 | 0.00 | 0.21 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 181 | 4 | 5,306 | 0 | 17,408 | 884 | 2.2 | 0.0 | 66.8 | 66.8 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,327 | 0 | 8,320 | 304 | 1.8 | 0.0 | 4.9 | 4.9 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,279 | 0 | 33,920 | 396 | 1.3 | 0.0 | 65.2 | 65.2 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 0 | 19 | 0 | 367 | 9 | 23,159 | 0 | 75,520 | 4,356 | 2.1 | 0.0 | 187.6 | 187.6 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,350 | 0 | 8,320 | 331 | 1.8 | 0.0 | 7.7 | 7.7 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,590 | 0 | 24,832 | 321 | 1.3 | 0.0 | 7.1 | 7.1 | 0.00 | 0.28 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 26 | 0 | 27 | 0 | 489 | 13 | 53,343 | 0 | 108,672 | 4,367 | 2.1 | 0.0 | 310.8 | 310.8 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,350 | 0 | 8,192 | 303 | 1.9 | 0.0 | 4.2 | 4.2 | 0.00 | 0.28 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,563 | 0 | 24,960 | 330 | 0.7 | 0.0 | 59.1 | 59.1 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 277 | 7 | 9,166 | 0 | 55,296 | 866 | 1.6 | 0.0 | 179.5 | 179.5 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,363 | 0 | 8,192 | 316 | 1.2 | 0.0 | 59.2 | 59.2 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,375 | 0 | 25,216 | 360 | 0.7 | 0.0 | 59.4 | 59.4 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 257 | 7 | 9,215 | 0 | 50,048 | 1,229 | 1.1 | 0.0 | 232.5 | 232.5 | 0.00 | 0.20 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,386 | 0 | 8,192 | 322 | 0.9 | 0.0 | 5.2 | 5.2 | 0.00 | 0.20 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,605 | 0 | 25,088 | 388 | 0.5 | 0.0 | 56.9 | 56.9 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 15 | 0 | 16 | 0 | 257 | 7 | 9,023 | 0 | 50,176 | 1,153 | 1.1 | 0.0 | 180.9 | 180.9 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | success | 1 | 6 | 0 | 6 | 0 | 14,190 | 0 | 8,082 | 0 | 16,640 | 884 | 0.9 | 0.0 | 63.6 | 63.6 | 0.00 | 0.18 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 30 | 0 | 24 | 0 | 46,326 | 10 | 71,683 | 0 | 457,984 | 8,287 | 0.6 | 0.0 | 425.2 | 425.2 | 0.00 | 0.37 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 281 | 5 | 7,150 | 0 | 31,744 | 2,287 | 1.3 | 0.0 | 125.8 | 125.8 | 0.00 | 0.17 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 7 | 1 | 8 | 0 | 19,785 | 0 | 11,013 | 0 | 35,456 | 1,943 | 0.9 | 0.0 | 123.8 | 123.8 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 20 | 0 | 21 | 0 | 34,807 | 8 | 26,146 | 0 | 328,320 | 4,834 | 0.5 | 0.0 | 243.1 | 243.1 | 0.00 | 0.21 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 347 | 8 | 10,341 | 0 | 63,360 | 1,681 | 1.0 | 0.0 | 234.7 | 234.7 | 0.00 | 0.20 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 3 | success | 1 | 10 | 0 | 9 | 0 | 24,454 | 0 | 14,337 | 0 | 56,448 | 2,101 | 0.8 | 0.0 | 115.6 | 115.6 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 21 | 0 | 22 | 0 | 46,472 | 7 | 30,519 | 0 | 414,976 | 5,656 | 0.5 | 0.0 | 302.3 | 302.3 | 0.00 | 0.39 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | success | 1 | 11 | 0 | 12 | 0 | 280 | 5 | 6,889 | 0 | 30,208 | 1,834 | 1.0 | 0.0 | 118.5 | 118.5 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,309 | 0 | 19,712 | 522 | 0.7 | 0.0 | 108.1 | 108.1 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,316 | 0 | 29,568 | 570 | 0.5 | 0.0 | 63.3 | 63.3 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,217 | 0 | 25,088 | 571 | 1.4 | 0.0 | 114.2 | 114.2 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,397 | 0 | 19,712 | 530 | 0.8 | 0.0 | 61.6 | 61.6 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,020 | 0 | 29,568 | 520 | 0.5 | 0.0 | 64.2 | 64.2 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,269 | 0 | 25,216 | 623 | 1.1 | 0.0 | 122.3 | 122.3 | 0.00 | 0.35 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 4,917 | 0 | 3,937 | 0 | 19,712 | 500 | 0.7 | 0.0 | 115.0 | 115.0 | 0.00 | 0.33 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,095 | 0 | 29,568 | 490 | 0.5 | 0.0 | 111.2 | 111.2 | 0.00 | 0.35 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 195 | 5 | 6,397 | 0 | 25,216 | 641 | 1.0 | 0.0 | 68.3 | 68.3 | 0.00 | 0.35 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 18 | 0 | 19 | 0 | 12,554 | 0 | 11,454 | 0 | 78,080 | 4,033 | 0.8 | 0.0 | 244.4 | 244.4 | 0.00 | 0.32 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 26 | 0 | 27 | 0 | 30,657 | 1 | 18,514 | 0 | 227,968 | 2,964 | 0.5 | 0.0 | 294.8 | 294.8 | 0.00 | 0.38 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 309 | 7 | 9,056 | 0 | 48,000 | 1,142 | 1.1 | 0.0 | 123.9 | 123.9 | 0.00 | 0.32 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 20 | 0 | 14 | 0 | 11,054 | 0 | 8,022 | 0 | 54,784 | 1,700 | 0.9 | 0.0 | 123.1 | 123.1 | 0.00 | 0.31 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | step_limit | 1 | 42 | 1 | 35 | 0 | 22,544 | 2 | 30,441 | 0 | 415,488 | 15,167 | 0.8 | 0.0 | 544.1 | 544.1 | 0.00 | 0.46 | agent step budget exhausted at 35 steps |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 342 | 8 | 10,448 | 0 | 62,848 | 1,419 | 2.3 | 0.0 | 232.5 | 232.5 | 0.00 | 0.39 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 15 | 0 | 12 | 0 | 11,902 | 0 | 7,394 | 0 | 44,800 | 1,508 | 1.4 | 0.0 | 175.4 | 175.4 | 0.00 | 0.35 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 21 | 0 | 22 | 0 | 22,707 | 1 | 13,567 | 0 | 149,504 | 2,123 | 0.8 | 0.0 | 237.1 | 237.1 | 0.00 | 0.36 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 306 | 7 | 8,982 | 0 | 47,744 | 1,087 | 2.2 | 0.0 | 179.7 | 179.7 | 0.00 | 0.34 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,833 | 0 | 15,744 | 486 | 1.7 | 0.0 | 57.6 | 57.6 | 0.00 | 0.39 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,746 | 0 | 31,616 | 666 | 1.0 | 0.0 | 113.2 | 113.2 | 0.00 | 0.33 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 15 | 0 | 16 | 0 | 244 | 7 | 8,858 | 0 | 49,792 | 1,064 | 2.1 | 0.0 | 230.5 | 230.5 | 0.00 | 1.01 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,832 | 0 | 15,744 | 495 | 1.5 | 0.0 | 59.9 | 59.9 | 0.00 | 0.33 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,552 | 0 | 31,616 | 552 | 0.9 | 0.0 | 117.2 | 117.2 | 0.00 | 0.37 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 244 | 6 | 7,991 | 0 | 41,216 | 862 | 2.1 | 0.0 | 181.6 | 181.6 | 0.00 | 0.30 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,763 | 0 | 15,744 | 509 | 1.5 | 0.0 | 109.0 | 109.0 | 0.00 | 0.34 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,632 | 0 | 31,616 | 673 | 0.8 | 0.0 | 110.3 | 110.3 | 0.00 | 0.32 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | success | 1 | 15 | 0 | 16 | 0 | 244 | 7 | 8,788 | 0 | 49,536 | 878 | 2.4 | 0.0 | 127.4 | 127.4 | 0.00 | 0.30 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,838 | 0 | 14,848 | 512 | 1.6 | 0.0 | 57.6 | 57.6 | 0.00 | 0.31 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,983 | 0 | 29,184 | 532 | 0.8 | 0.0 | 109.5 | 109.5 | 0.00 | 0.38 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | 1 | 21 | 0 | 22 | 0 | 273 | 11 | 38,553 | 0 | 85,760 | 3,996 | 2.0 | 0.0 | 359.0 | 359.0 | 0.00 | 0.23 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,899 | 0 | 14,720 | 521 | 1.7 | 0.0 | 59.6 | 59.6 | 0.00 | 0.30 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,980 | 0 | 28,928 | 503 | 1.1 | 0.0 | 67.3 | 67.3 | 0.00 | 0.40 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 219 | 7 | 9,005 | 0 | 42,112 | 1,348 | 3.1 | 0.0 | 181.8 | 181.8 | 0.00 | 0.35 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 3 | success | 1 | 9 | 1 | 10 | 0 | 7,222 | 1 | 5,641 | 0 | 33,536 | 1,336 | 2.4 | 0.0 | 116.6 | 116.6 | 0.00 | 0.34 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,951 | 0 | 29,184 | 636 | 0.9 | 0.0 | 64.1 | 64.1 | 0.00 | 0.32 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 279 | 8 | 12,772 | 0 | 82,816 | 4,077 | 2.0 | 0.0 | 243.5 | 243.5 | 0.00 | 0.33 | case-024 \| Select \| case-024 selected. |
| `v2-list-nested-scroll` | Mantis | 1 | success | 1 | 16 | 0 | 17 | 0 | 14,894 | 0 | 9,369 | 0 | 71,552 | 1,520 | 1.3 | 0.0 | 128.8 | 128.8 | 0.00 | 0.32 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 35 | 0 | 35 | 0 | 37,156 | 3 | 26,001 | 0 | 385,408 | 7,800 | 1.3 | 0.0 | 469.7 | 469.7 | 0.00 | 0.47 | agent step budget exhausted at 35 steps |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 336 | 8 | 10,277 | 0 | 60,544 | 1,415 | 2.0 | 0.0 | 231.4 | 231.4 | 0.00 | 0.32 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 2 | success | 1 | 20 | 0 | 21 | 0 | 19,673 | 0 | 12,043 | 0 | 107,776 | 1,980 | 1.4 | 0.0 | 231.0 | 231.0 | 0.00 | 0.43 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 23 | 0 | 24 | 0 | 27,885 | 0 | 14,225 | 0 | 165,888 | 2,217 | 0.8 | 0.0 | 239.1 | 239.1 | 0.00 | 0.32 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | success | 1 | 20 | 0 | 21 | 0 | 366 | 10 | 26,915 | 0 | 83,456 | 2,429 | 1.9 | 0.0 | 188.3 | 188.3 | 0.00 | 0.24 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 3 | success | 1 | 16 | 0 | 17 | 0 | 16,441 | 0 | 9,701 | 0 | 82,688 | 1,653 | 1.5 | 0.0 | 173.9 | 173.9 | 0.00 | 0.28 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 15 | 0 | 16 | 0 | 26,691 | 1 | 12,883 | 0 | 104,064 | 2,116 | 0.9 | 0.0 | 180.1 | 180.1 | 0.00 | 0.39 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 16 | 0 | 17 | 0 | 336 | 8 | 10,017 | 0 | 60,800 | 1,297 | 1.9 | 0.0 | 177.4 | 177.4 | 0.00 | 0.33 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,597 | 0 | 9,216 | 337 | 1.6 | 0.0 | 58.5 | 58.5 | 0.00 | 0.33 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,509 | 0 | 7,424 | 301 | 0.9 | 0.0 | 5.2 | 5.2 | 0.00 | 0.31 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 124 | 2 | 2,983 | 0 | 5,888 | 616 | 2.0 | 0.0 | 64.2 | 64.2 | 0.00 | 0.26 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,621 | 0 | 9,216 | 389 | 1.5 | 0.0 | 57.6 | 57.6 | 0.00 | 0.29 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,377 | 0 | 7,552 | 275 | 0.8 | 0.0 | 52.3 | 52.3 | 0.00 | 0.28 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,471 | 0 | 2,304 | 317 | 1.7 | 0.0 | 50.7 | 50.7 | 0.00 | 0.31 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,012 | 1 | 2,019 | 0 | 9,344 | 395 | 1.2 | 0.0 | 55.0 | 55.0 | 0.00 | 0.28 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 2,311 | 0 | 1,961 | 0 | 10,752 | 348 | 0.9 | 0.0 | 55.5 | 55.5 | 0.00 | 0.36 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,471 | 0 | 2,304 | 179 | 1.9 | 0.0 | 6.6 | 6.6 | 0.00 | 0.26 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,571 | 0 | 1,991 | 0 | 9,728 | 444 | 1.5 | 0.0 | 61.1 | 61.1 | 0.00 | 0.34 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,986 | 1 | 3,561 | 0 | 19,584 | 847 | 0.9 | 0.0 | 65.6 | 65.6 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 133 | 2 | 2,796 | 0 | 5,632 | 370 | 1.9 | 0.0 | 58.3 | 58.3 | 0.00 | 0.31 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,591 | 1 | 2,483 | 0 | 12,416 | 603 | 1.3 | 0.0 | 58.8 | 58.8 | 0.00 | 0.29 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,290 | 0 | 7,552 | 279 | 1.1 | 0.0 | 54.6 | 54.6 | 0.00 | 0.33 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 133 | 2 | 2,730 | 0 | 5,632 | 352 | 2.1 | 0.0 | 55.7 | 55.7 | 0.00 | 0.29 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,571 | 0 | 2,034 | 0 | 9,472 | 420 | 1.3 | 0.0 | 56.9 | 56.9 | 0.00 | 0.24 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,742 | 0 | 5,583 | 0 | 24,576 | 2,310 | 0.9 | 0.0 | 61.5 | 61.5 | 0.00 | 0.35 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 133 | 2 | 2,844 | 0 | 5,632 | 371 | 1.9 | 0.0 | 60.5 | 60.5 | 0.00 | 0.35 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | success | 1 | 6 | 0 | 5 | 0 | 987 | 1 | 2,001 | 0 | 9,344 | 819 | 1.4 | 0.0 | 59.9 | 59.9 | 0.00 | 0.33 | Dock C \| min \| 17 min |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,332 | 1 | 2,219 | 0 | 11,136 | 334 | 0.9 | 0.0 | 54.4 | 54.4 | 0.00 | 0.32 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,478 | 0 | 2,304 | 156 | 2.1 | 0.0 | 54.7 | 54.7 | 0.00 | 0.30 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,887 | 0 | 9,088 | 388 | 1.6 | 0.0 | 58.5 | 58.5 | 0.00 | 0.33 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 933 | 1 | 1,731 | 0 | 7,552 | 203 | 1.1 | 0.0 | 51.1 | 51.1 | 0.00 | 0.36 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 129 | 2 | 2,848 | 0 | 5,632 | 397 | 1.4 | 0.0 | 59.5 | 59.5 | 0.00 | 0.27 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 691 | 1 | 2,086 | 0 | 11,136 | 630 | 1.0 | 0.0 | 60.0 | 60.0 | 0.00 | 0.22 | Dock C \| min \| 17 min |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,332 | 1 | 2,230 | 0 | 11,136 | 364 | 1.1 | 0.0 | 7.6 | 7.6 | 0.00 | 0.23 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,478 | 0 | 2,304 | 170 | 1.9 | 0.0 | 6.9 | 6.9 | 0.00 | 0.24 | Dock C \| min \| 17 |
| `v2-chart-responsive` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 976 | 0 | 1,496 | 0 | 7,296 | 391 | 1.4 | 0.0 | 55.3 | 55.3 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 1 | 8 | 0 | 3,508 | 1 | 4,835 | 0 | 30,336 | 3,831 | 0.8 | 0.0 | 83.5 | 83.5 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | 1 | 3 | 0 | 4 | 0 | 114 | 2 | 2,630 | 0 | 3,840 | 441 | 2.0 | 0.0 | 55.3 | 55.3 | 0.00 | 0.30 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 550 | 1 | 1,521 | 0 | 7,296 | 411 | 1.4 | 0.0 | 53.8 | 53.8 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,391 | 0 | 10,624 | 488 | 0.7 | 0.0 | 60.5 | 60.5 | 0.00 | 0.27 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | success | 1 | 5 | 1 | 6 | 0 | 135 | 2 | 5,340 | 0 | 10,752 | 2,753 | 1.8 | 0.0 | 108.8 | 108.8 | 0.00 | 0.31 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 2,451 | 0 | 9,728 | 1,163 | 1.1 | 0.0 | 57.4 | 57.4 | 0.00 | 0.28 | Bookings by quarter \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,356 | 0 | 10,624 | 567 | 0.6 | 0.0 | 54.8 | 54.8 | 0.00 | 0.27 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,464 | 0 | 2,304 | 347 | 1.4 | 0.0 | 51.0 | 51.0 | 0.00 | 0.32 | Bookings \| Q4 \| 147 |
| `v2-interaction-form-preferences` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,424 | 0 | 9,472 | 277 | 1.4 | 0.0 | 9.6 | 9.6 | 0.00 | 0.29 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,579 | 0 | 17,280 | 366 | 0.8 | 0.0 | 56.7 | 56.7 | 0.00 | 0.39 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | step_limit | 1 | 35 | 1 | 35 | 0 | 610 | 14 | 57,292 | 0 | 171,648 | 4,866 | 2.0 | 0.0 | 474.8 | 474.8 | 0.00 | 0.28 | agent step budget exhausted at 35 steps |
| `v2-interaction-form-preferences` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,649 | 0 | 9,216 | 262 | 1.4 | 0.0 | 56.7 | 56.7 | 0.00 | 0.30 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,514 | 0 | 17,408 | 394 | 0.8 | 0.0 | 62.1 | 62.1 | 0.00 | 0.29 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | success | 1 | 32 | 1 | 33 | 0 | 414 | 14 | 65,614 | 0 | 160,256 | 5,016 | 1.9 | 0.0 | 468.4 | 468.4 | 0.00 | 0.34 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,442 | 0 | 9,472 | 291 | 1.6 | 0.0 | 59.8 | 59.8 | 0.00 | 0.30 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,470 | 0 | 17,408 | 382 | 1.0 | 0.0 | 60.5 | 60.5 | 0.00 | 0.29 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 313 | 8 | 10,265 | 0 | 67,072 | 1,112 | 2.0 | 0.0 | 229.0 | 229.0 | 0.00 | 0.29 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-frame-payment` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,501 | 0 | 9,344 | 244 | 1.3 | 0.0 | 35.9 | 35.9 | 0.00 | 0.27 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,351 | 0 | 17,152 | 347 | 0.8 | 0.0 | 61.2 | 61.2 | 0.00 | 0.32 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 257 | 5 | 6,920 | 0 | 32,000 | 683 | 2.0 | 0.0 | 173.7 | 173.7 | 0.00 | 0.37 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,488 | 0 | 9,344 | 235 | 1.3 | 0.0 | 58.3 | 58.3 | 0.00 | 0.29 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,322 | 0 | 17,152 | 325 | 1.2 | 0.0 | 63.6 | 63.6 | 0.00 | 0.34 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 257 | 5 | 6,780 | 0 | 32,128 | 679 | 1.8 | 0.0 | 175.0 | 175.0 | 0.00 | 0.27 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,488 | 0 | 9,344 | 235 | 1.3 | 0.0 | 56.8 | 56.8 | 0.00 | 0.30 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,348 | 0 | 17,152 | 329 | 0.7 | 0.0 | 104.0 | 104.0 | 0.00 | 0.33 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 257 | 5 | 6,748 | 0 | 32,256 | 673 | 1.8 | 0.0 | 129.8 | 129.8 | 0.00 | 0.34 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-combobox` | Mantis | 1 | success | 1 | 27 | 2 | 28 | 0 | 2,811 | 2 | 9,642 | 0 | 96,640 | 2,814 | 1.4 | 0.0 | 358.6 | 358.6 | 0.00 | 0.27 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,921 | 0 | 3,298 | 0 | 27,520 | 500 | 0.9 | 0.0 | 119.2 | 119.2 | 0.00 | 0.28 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | success | 1 | 15 | 0 | 16 | 0 | 269 | 7 | 9,082 | 0 | 51,712 | 1,010 | 1.9 | 0.0 | 223.0 | 223.0 | 0.00 | 0.31 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,180 | 0 | 2,567 | 0 | 18,432 | 486 | 1.5 | 0.0 | 68.9 | 68.9 | 0.00 | 0.28 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 18 | 2 | 19 | 0 | 5,845 | 2 | 9,582 | 0 | 90,496 | 2,393 | 0.8 | 0.0 | 242.7 | 242.7 | 0.00 | 0.27 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,777 | 0 | 39,040 | 837 | 1.8 | 0.0 | 174.0 | 174.0 | 0.00 | 0.35 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 3 | success | 1 | 10 | 0 | 11 | 0 | 1,476 | 0 | 3,204 | 0 | 23,936 | 726 | 1.2 | 0.0 | 113.9 | 113.9 | 0.00 | 0.29 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 13 | 0 | 14 | 0 | 4,446 | 0 | 5,222 | 0 | 49,536 | 990 | 0.8 | 0.0 | 173.9 | 173.9 | 0.00 | 0.33 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 388 | 13 | 52,001 | 0 | 123,520 | 2,899 | 2.0 | 0.0 | 355.9 | 355.9 | 0.00 | 0.30 | West Ridge assigned. |
| `v2-interaction-form-validation-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,764 | 0 | 11,392 | 284 | 1.3 | 0.0 | 103.9 | 103.9 | 0.00 | 0.42 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 3,063 | 0 | 24,064 | 474 | 0.8 | 0.0 | 64.7 | 64.7 | 0.00 | 0.30 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,612 | 0 | 22,528 | 581 | 1.8 | 0.0 | 118.1 | 118.1 | 0.00 | 0.30 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,758 | 0 | 11,392 | 282 | 1.4 | 0.0 | 60.8 | 60.8 | 0.00 | 0.32 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,923 | 0 | 24,064 | 419 | 0.8 | 0.0 | 65.9 | 65.9 | 0.00 | 0.30 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 276 | 4 | 6,089 | 0 | 28,800 | 760 | 2.0 | 0.0 | 122.5 | 122.5 | 0.00 | 0.29 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,760 | 0 | 11,392 | 283 | 1.4 | 0.0 | 59.5 | 59.5 | 0.00 | 0.28 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,932 | 0 | 24,064 | 447 | 0.8 | 0.0 | 62.0 | 62.0 | 0.00 | 0.28 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,446 | 0 | 22,528 | 560 | 1.9 | 0.0 | 118.3 | 118.3 | 0.00 | 0.28 | Invite sent to ada@northwind.test. |
| `v2-interaction-overlay-dialog` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,376 | 0 | 9,216 | 214 | 1.3 | 0.0 | 57.8 | 57.8 | 0.00 | 0.32 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,541 | 0 | 20,352 | 355 | 0.9 | 0.0 | 63.4 | 63.4 | 0.00 | 0.30 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,942 | 0 | 10,368 | 352 | 2.1 | 0.0 | 67.8 | 67.8 | 0.00 | 0.30 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,368 | 0 | 9,216 | 213 | 2.0 | 0.0 | 59.3 | 59.3 | 0.00 | 0.33 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,393 | 0 | 20,608 | 379 | 0.9 | 0.0 | 62.3 | 62.3 | 0.00 | 0.30 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,928 | 0 | 10,368 | 348 | 2.1 | 0.0 | 64.1 | 64.1 | 0.00 | 0.22 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,496 | 0 | 9,088 | 212 | 1.0 | 0.0 | 58.8 | 58.8 | 0.00 | 0.29 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,469 | 0 | 20,480 | 369 | 0.8 | 0.0 | 61.5 | 61.5 | 0.00 | 0.32 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,788 | 0 | 10,496 | 348 | 1.9 | 0.0 | 110.0 | 110.0 | 0.00 | 0.33 | Report exported with essential privacy. |
| `v2-interaction-overlay-shadow` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,511 | 0 | 9,088 | 219 | 1.4 | 0.0 | 59.9 | 59.9 | 0.00 | 0.34 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,199 | 0 | 16,896 | 309 | 1.0 | 0.0 | 61.3 | 61.3 | 0.00 | 0.29 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,614 | 0 | 31,744 | 606 | 1.9 | 0.0 | 170.7 | 170.7 | 0.00 | 0.29 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,519 | 0 | 9,088 | 220 | 1.3 | 0.0 | 60.5 | 60.5 | 0.00 | 0.30 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,281 | 0 | 16,896 | 343 | 0.6 | 0.0 | 105.4 | 105.4 | 0.00 | 0.34 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 244 | 6 | 7,565 | 0 | 38,912 | 694 | 1.3 | 0.0 | 173.8 | 173.8 | 0.00 | 0.28 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,511 | 0 | 9,088 | 219 | 1.5 | 0.0 | 56.6 | 56.6 | 0.00 | 0.37 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,344 | 0 | 16,768 | 324 | 0.8 | 0.0 | 59.3 | 59.3 | 0.00 | 0.30 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,702 | 0 | 31,616 | 591 | 1.9 | 0.0 | 170.1 | 170.1 | 0.00 | 0.27 | Compact density applied. |
| `v2-interaction-overlay-modal` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,112 | 0 | 13,568 | 441 | 2.0 | 0.0 | 60.9 | 60.9 | 0.00 | 0.32 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,855 | 0 | 23,808 | 484 | 0.8 | 0.0 | 116.4 | 116.4 | 0.00 | 0.27 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,478 | 0 | 22,016 | 483 | 1.8 | 0.0 | 168.8 | 168.8 | 0.00 | 0.27 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,209 | 0 | 13,568 | 404 | 1.6 | 0.0 | 61.3 | 61.3 | 0.00 | 0.33 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,799 | 0 | 23,808 | 455 | 1.0 | 0.0 | 68.0 | 68.0 | 0.00 | 0.34 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,657 | 0 | 22,016 | 560 | 1.9 | 0.0 | 132.3 | 132.3 | 0.00 | 0.32 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,207 | 0 | 13,568 | 403 | 1.3 | 0.0 | 67.6 | 67.6 | 0.00 | 0.27 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,754 | 0 | 23,808 | 425 | 0.8 | 0.0 | 104.0 | 104.0 | 0.00 | 0.48 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 246 | 5 | 6,792 | 0 | 30,080 | 608 | 1.9 | 0.0 | 121.7 | 121.7 | 0.00 | 0.36 | Project renamed to Aurora. |
| `v2-interaction-overlay-toast` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,763 | 0 | 11,264 | 263 | 1.3 | 0.0 | 60.5 | 60.5 | 0.00 | 0.27 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,586 | 0 | 20,096 | 354 | 1.0 | 0.0 | 59.5 | 59.5 | 0.00 | 0.27 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,997 | 0 | 10,240 | 356 | 1.8 | 0.0 | 63.7 | 63.7 | 0.00 | 0.30 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,008 | 0 | 2,107 | 0 | 13,568 | 305 | 1.3 | 0.0 | 112.3 | 112.3 | 0.00 | 0.33 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,562 | 0 | 20,096 | 348 | 0.7 | 0.0 | 114.9 | 114.9 | 0.00 | 0.30 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,889 | 0 | 10,368 | 334 | 2.2 | 0.0 | 65.5 | 65.5 | 0.00 | 0.34 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,008 | 0 | 2,106 | 0 | 13,568 | 310 | 1.3 | 0.0 | 70.2 | 70.2 | 0.00 | 0.27 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,546 | 0 | 20,096 | 340 | 0.9 | 0.0 | 64.1 | 64.1 | 0.00 | 0.30 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,915 | 0 | 10,240 | 300 | 1.9 | 0.0 | 112.1 | 112.1 | 0.00 | 0.33 | Archive undone. |
| `v2-interaction-spa-client-route` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 981 | 0 | 1,748 | 0 | 11,392 | 223 | 1.0 | 0.0 | 64.5 | 64.5 | 0.00 | 0.21 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,631 | 0 | 20,608 | 339 | 0.8 | 0.0 | 106.9 | 106.9 | 0.00 | 0.31 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,800 | 0 | 10,368 | 299 | 1.8 | 0.0 | 103.6 | 103.6 | 0.00 | 0.27 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,748 | 0 | 11,392 | 223 | 1.4 | 0.0 | 57.7 | 57.7 | 0.00 | 0.28 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,617 | 0 | 20,608 | 338 | 0.8 | 0.0 | 116.9 | 116.9 | 0.00 | 0.27 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,818 | 0 | 10,368 | 305 | 1.9 | 0.0 | 60.8 | 60.8 | 0.00 | 0.34 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,743 | 0 | 11,392 | 222 | 1.4 | 0.0 | 61.3 | 61.3 | 0.00 | 0.34 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,565 | 0 | 20,608 | 320 | 0.8 | 0.0 | 110.0 | 110.0 | 0.00 | 0.42 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,870 | 0 | 10,240 | 292 | 1.3 | 0.0 | 111.4 | 111.4 | 0.00 | 0.35 | Mercury marked complete. |
| `v2-interaction-spa-history-draft` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,404 | 0 | 9,472 | 223 | 0.9 | 0.0 | 55.3 | 55.3 | 0.00 | 0.30 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,273 | 0 | 16,896 | 374 | 0.9 | 0.0 | 14.6 | 14.6 | 0.00 | 0.28 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,121 | 0 | 12,160 | 370 | 2.0 | 0.0 | 67.2 | 67.2 | 0.00 | 0.32 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,103 | 0 | 1,750 | 0 | 11,776 | 314 | 1.4 | 0.0 | 65.5 | 65.5 | 0.00 | 0.31 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,217 | 0 | 16,896 | 309 | 0.8 | 0.0 | 61.3 | 61.3 | 0.00 | 0.29 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,013 | 0 | 12,288 | 366 | 2.0 | 0.0 | 113.3 | 113.3 | 0.00 | 0.28 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,442 | 0 | 9,472 | 240 | 1.4 | 0.0 | 57.9 | 57.9 | 0.00 | 0.24 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,274 | 0 | 16,896 | 335 | 0.8 | 0.0 | 111.2 | 111.2 | 0.00 | 0.28 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,085 | 0 | 12,288 | 377 | 1.5 | 0.0 | 106.0 | 106.0 | 0.00 | 0.33 | Release notes |
| `v2-interaction-spa-route-recovery` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,928 | 0 | 13,952 | 273 | 1.4 | 0.0 | 68.0 | 68.0 | 0.00 | 0.29 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,397 | 0 | 28,416 | 514 | 0.8 | 0.0 | 119.8 | 119.8 | 0.00 | 0.29 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,061 | 0 | 16,768 | 422 | 1.9 | 0.0 | 110.6 | 110.6 | 0.00 | 0.35 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,976 | 0 | 13,952 | 289 | 1.4 | 0.0 | 65.2 | 65.2 | 0.00 | 0.20 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,350 | 0 | 28,288 | 437 | 0.7 | 0.0 | 114.7 | 114.7 | 0.00 | 0.30 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,855 | 0 | 17,024 | 447 | 1.4 | 0.0 | 118.5 | 118.5 | 0.00 | 0.23 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,952 | 0 | 13,952 | 283 | 1.0 | 0.0 | 111.6 | 111.6 | 0.00 | 0.29 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,367 | 0 | 28,288 | 468 | 1.1 | 0.0 | 117.3 | 117.3 | 0.00 | 0.28 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,977 | 0 | 16,896 | 432 | 1.9 | 0.0 | 112.0 | 112.0 | 0.00 | 0.33 | Notification settings recovered and saved. |
| `v2-interaction-spa-retry-recovery` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,508 | 0 | 9,088 | 211 | 1.3 | 0.0 | 56.6 | 56.6 | 0.00 | 0.29 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,657 | 0 | 20,096 | 339 | 0.7 | 0.0 | 108.8 | 108.8 | 0.00 | 0.38 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,930 | 0 | 10,240 | 286 | 1.4 | 0.0 | 107.4 | 107.4 | 0.00 | 0.28 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,526 | 0 | 9,088 | 220 | 1.4 | 0.0 | 12.8 | 12.8 | 0.00 | 0.22 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,665 | 0 | 20,096 | 343 | 1.5 | 0.0 | 61.1 | 61.1 | 0.00 | 0.28 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,960 | 0 | 10,240 | 314 | 2.0 | 0.0 | 62.6 | 62.6 | 0.00 | 0.26 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 913 | 0 | 1,862 | 0 | 11,264 | 265 | 1.4 | 0.0 | 59.7 | 59.7 | 0.00 | 0.36 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,645 | 0 | 20,096 | 339 | 0.8 | 0.0 | 65.3 | 65.3 | 0.00 | 0.32 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,846 | 0 | 10,368 | 299 | 1.4 | 0.0 | 111.2 | 111.2 | 0.00 | 0.34 | Contacts synced after retry. |
| `v2-reading-landmark-jump` | Mantis | 1 | step_limit | 1 | 35 | 4 | 35 | 0 | 6,244 | 2 | 16,756 | 0 | 177,152 | 7,670 | 1.0 | 0.0 | 465.5 | 465.5 | 0.09 | 0.28 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 24 | 1 | 25 | 0 | 11,975 | 3 | 16,644 | 0 | 193,792 | 5,700 | 1.3 | 0.0 | 315.8 | 315.8 | 0.00 | 0.29 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | step_limit | 1 | 35 | 2 | 35 | 0 | 674 | 14 | 92,661 | 0 | 226,816 | 10,123 | 2.1 | 0.0 | 430.2 | 430.2 | 0.00 | 0.28 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Mantis | 2 | step_limit | 1 | 39 | 2 | 35 | 0 | 7,587 | 1 | 15,948 | 0 | 203,136 | 7,223 | 1.5 | 0.0 | 375.4 | 375.4 | 0.00 | 0.33 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 2 | step_limit | 1 | 36 | 3 | 35 | 0 | 16,398 | 2 | 23,508 | 0 | 344,192 | 10,022 | 0.9 | 0.0 | 433.2 | 433.2 | 0.00 | 0.35 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | step_limit | 1 | 35 | 1 | 35 | 0 | 550 | 15 | 90,896 | 0 | 201,600 | 7,522 | 1.9 | 0.0 | 431.9 | 431.9 | 0.00 | 0.23 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Mantis | 3 | step_limit | 1 | 35 | 3 | 35 | 0 | 6,525 | 2 | 16,823 | 0 | 196,864 | 7,630 | 1.4 | 0.0 | 424.7 | 424.7 | 0.00 | 0.30 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 15 | 0 | 16 | 0 | 7,731 | 1 | 9,526 | 0 | 81,536 | 3,086 | 0.6 | 0.0 | 231.4 | 231.4 | 0.00 | 0.34 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 3 | step_limit | 1 | 35 | 2 | 35 | 0 | 758 | 15 | 93,092 | 0 | 202,496 | 10,524 | 1.4 | 0.0 | 530.8 | 530.8 | 0.00 | 0.34 | agent step budget exhausted at 35 steps |
| `v2-reading-deep-fact` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 2,207 | 0 | 3,345 | 0 | 22,656 | 656 | 1.3 | 0.0 | 112.8 | 112.8 | 0.00 | 0.35 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,252 | 0 | 33,024 | 555 | 0.9 | 0.0 | 66.3 | 66.3 | 0.00 | 0.34 | answer did not match the expected result |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 1 | success | 1 | 15 | 0 | 16 | 0 | 291 | 7 | 9,075 | 0 | 53,248 | 1,052 | 1.9 | 0.0 | 131.2 | 131.2 | 0.00 | 0.33 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,983 | 0 | 2,900 | 0 | 19,584 | 506 | 1.3 | 0.0 | 67.0 | 67.0 | 0.00 | 0.33 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,188 | 0 | 33,408 | 627 | 0.8 | 0.0 | 113.4 | 113.4 | 0.00 | 0.33 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 270 | 6 | 7,771 | 0 | 40,448 | 856 | 1.9 | 0.0 | 113.5 | 113.5 | 0.00 | 0.34 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 2,207 | 0 | 3,214 | 0 | 22,656 | 601 | 1.4 | 0.0 | 121.3 | 121.3 | 0.00 | 0.35 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,169 | 0 | 33,280 | 629 | 0.8 | 0.0 | 119.2 | 119.2 | 0.00 | 0.28 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 3 | success | 1 | 22 | 0 | 23 | 0 | 392 | 10 | 36,527 | 0 | 121,472 | 5,200 | 1.8 | 0.0 | 247.7 | 247.7 | 0.00 | 0.31 | Appendix clause 31: Cinder-693 |
| `v2-reading-cross-region` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 2,190 | 0 | 3,958 | 0 | 28,928 | 951 | 1.3 | 0.0 | 121.2 | 121.2 | 0.00 | 0.29 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 11 | 1 | 12 | 0 | 4,947 | 1 | 6,478 | 0 | 48,000 | 1,659 | 0.8 | 0.0 | 166.3 | 166.3 | 0.00 | 0.39 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 260 | 6 | 8,593 | 0 | 43,520 | 1,636 | 1.9 | 0.0 | 167.1 | 167.1 | 0.00 | 0.32 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 2 | success | 1 | 14 | 1 | 15 | 0 | 2,367 | 1 | 5,042 | 0 | 39,296 | 1,151 | 1.4 | 0.0 | 178.4 | 178.4 | 0.00 | 0.36 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 12 | 0 | 13 | 0 | 5,843 | 1 | 8,167 | 0 | 57,472 | 2,810 | 0.9 | 0.0 | 220.4 | 220.4 | 0.00 | 0.34 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 2 | success | 1 | 23 | 2 | 24 | 0 | 445 | 10 | 34,293 | 0 | 118,144 | 4,303 | 1.3 | 0.0 | 288.9 | 288.9 | 0.00 | 0.33 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 3 | success | 1 | 16 | 1 | 17 | 0 | 2,470 | 1 | 6,489 | 0 | 50,304 | 2,999 | 1.3 | 0.0 | 180.3 | 180.3 | 0.00 | 0.32 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 23 | 1 | 24 | 0 | 14,371 | 1 | 17,663 | 0 | 191,360 | 6,969 | 0.8 | 0.0 | 401.7 | 401.7 | 0.00 | 0.38 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 260 | 6 | 8,166 | 0 | 42,240 | 1,322 | 1.8 | 0.0 | 176.2 | 176.2 | 0.00 | 0.34 | Delivery region: Aster-862 |
| `v2-reading-collapsed-context` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 2,358 | 0 | 3,458 | 0 | 23,168 | 794 | 1.3 | 0.0 | 113.3 | 113.3 | 0.00 | 0.33 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 3,934 | 0 | 33,152 | 612 | 0.8 | 0.0 | 68.4 | 68.4 | 0.00 | 0.27 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 277 | 6 | 8,233 | 0 | 41,984 | 1,310 | 1.8 | 0.0 | 174.4 | 174.4 | 0.00 | 0.32 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,995 | 0 | 2,851 | 0 | 19,200 | 400 | 1.4 | 0.0 | 106.7 | 106.7 | 0.00 | 0.33 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 3,897 | 0 | 33,280 | 615 | 0.9 | 0.0 | 76.3 | 76.3 | 0.00 | 0.34 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 1 | 17 | 0 | 297 | 7 | 11,183 | 0 | 67,968 | 2,950 | 2.5 | 0.0 | 188.4 | 188.4 | 0.00 | 0.31 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,995 | 0 | 2,894 | 0 | 19,200 | 431 | 1.4 | 0.0 | 113.1 | 113.1 | 0.00 | 0.34 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 10 | 0 | 11 | 0 | 4,879 | 1 | 5,805 | 0 | 41,984 | 1,558 | 0.8 | 0.0 | 172.6 | 172.6 | 0.00 | 0.37 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 3 | success | 1 | 20 | 1 | 21 | 0 | 466 | 8 | 12,354 | 0 | 92,672 | 2,695 | 1.8 | 0.0 | 228.7 | 228.7 | 0.00 | 0.28 | Expanded retained context: Dune-119 |
| `v2-workflow-multi-step-order` | Mantis | 1 | success | 1 | 13 | 0 | 14 | 0 | 2,550 | 0 | 4,289 | 0 | 32,768 | 653 | 1.4 | 0.0 | 131.3 | 131.3 | 0.00 | 0.31 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 14 | 0 | 15 | 0 | 6,670 | 0 | 6,290 | 0 | 56,448 | 877 | 0.8 | 0.0 | 128.8 | 128.8 | 0.00 | 0.36 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 1 | success | 1 | 30 | 0 | 31 | 0 | 420 | 14 | 53,266 | 0 | 124,032 | 1,592 | 1.8 | 0.0 | 348.0 | 348.0 | 0.00 | 0.28 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 2 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 4,048 | 0 | 29,312 | 603 | 1.4 | 0.0 | 171.0 | 171.0 | 0.00 | 0.31 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 16 | 1 | 17 | 0 | 7,188 | 0 | 7,022 | 0 | 69,760 | 1,346 | 0.9 | 0.0 | 189.8 | 189.8 | 0.00 | 0.36 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 2 | success | 1 | 26 | 0 | 27 | 0 | 380 | 12 | 38,782 | 0 | 103,552 | 1,375 | 1.9 | 0.0 | 301.2 | 301.2 | 0.00 | 0.27 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 3 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 4,003 | 0 | 29,312 | 604 | 1.3 | 0.0 | 125.9 | 125.9 | 0.00 | 0.29 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 17 | 1 | 18 | 0 | 7,675 | 1 | 9,113 | 0 | 89,600 | 2,369 | 0.9 | 0.0 | 183.1 | 183.1 | 0.00 | 0.34 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 400 | 13 | 47,917 | 0 | 117,504 | 1,841 | 2.1 | 0.0 | 351.7 | 351.7 | 0.00 | 0.31 | Receipt: Cinder-127 |
| `v2-workflow-cross-page-compare` | Mantis | 1 | success | 1 | 13 | 0 | 14 | 0 | 3,759 | 0 | 4,718 | 0 | 35,200 | 936 | 1.3 | 0.0 | 170.1 | 170.1 | 0.00 | 0.34 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,621 | 0 | 51,840 | 774 | 0.8 | 0.0 | 186.2 | 186.2 | 0.00 | 0.23 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,208 | 0 | 45,696 | 940 | 1.8 | 0.0 | 179.5 | 179.5 | 0.00 | 0.25 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 2 | success | 1 | 13 | 0 | 14 | 0 | 3,972 | 0 | 4,686 | 0 | 35,584 | 728 | 1.4 | 0.0 | 165.5 | 165.5 | 0.00 | 0.33 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,538 | 0 | 51,840 | 809 | 0.8 | 0.0 | 182.8 | 182.8 | 0.00 | 0.33 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,618 | 0 | 45,568 | 1,156 | 1.8 | 0.0 | 177.2 | 177.2 | 0.00 | 0.34 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 3,408 | 0 | 3,889 | 0 | 28,544 | 564 | 1.4 | 0.0 | 121.9 | 121.9 | 0.00 | 0.27 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 14 | 0 | 15 | 0 | 7,205 | 1 | 6,942 | 0 | 56,960 | 1,060 | 0.8 | 0.0 | 227.6 | 227.6 | 0.00 | 0.29 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 3 | success | 1 | 25 | 0 | 26 | 0 | 512 | 11 | 35,293 | 0 | 111,744 | 2,098 | 1.9 | 0.0 | 256.2 | 256.2 | 0.00 | 0.27 | Receipt: Aster-301 |
| `v2-workflow-save-resume` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,712 | 0 | 27,904 | 540 | 1.3 | 0.0 | 124.7 | 124.7 | 0.00 | 0.32 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,729 | 0 | 40,960 | 640 | 0.7 | 0.0 | 174.2 | 174.2 | 0.00 | 0.34 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,517 | 0 | 36,480 | 627 | 1.4 | 0.0 | 182.5 | 182.5 | 0.00 | 0.36 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,700 | 0 | 27,904 | 538 | 0.9 | 0.0 | 173.3 | 173.3 | 0.00 | 0.35 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,589 | 0 | 40,832 | 602 | 0.8 | 0.0 | 118.9 | 118.9 | 0.00 | 0.33 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 246 | 7 | 8,370 | 0 | 44,928 | 818 | 1.8 | 0.0 | 169.5 | 169.5 | 0.00 | 0.34 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,715 | 0 | 27,904 | 539 | 1.4 | 0.0 | 172.0 | 172.0 | 0.00 | 0.28 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,793 | 0 | 40,832 | 612 | 0.9 | 0.0 | 127.3 | 127.3 | 0.00 | 0.34 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,520 | 0 | 36,864 | 679 | 1.8 | 0.0 | 166.8 | 166.8 | 0.00 | 0.28 | Receipt: Ember-583 |
| `v2-workflow-conditional-branch` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,593 | 0 | 17,920 | 381 | 1.3 | 0.0 | 117.7 | 117.7 | 0.00 | 0.29 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,104 | 0 | 47,360 | 750 | 1.0 | 0.0 | 123.2 | 123.2 | 0.00 | 0.31 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 1 | success | 1 | 21 | 0 | 22 | 0 | 329 | 10 | 23,944 | 0 | 80,384 | 1,075 | 1.8 | 0.0 | 184.6 | 184.6 | 0.00 | 0.27 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,513 | 0 | 18,048 | 398 | 1.3 | 0.0 | 109.2 | 109.2 | 0.00 | 0.32 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,314 | 0 | 46,976 | 724 | 0.8 | 0.0 | 120.2 | 120.2 | 0.00 | 0.31 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,425 | 0 | 96,896 | 1,261 | 2.5 | 0.0 | 129.0 | 129.0 | 0.00 | 0.26 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 3 | success | 1 | 10 | 0 | 11 | 0 | 1,903 | 0 | 3,212 | 0 | 23,424 | 427 | 1.3 | 0.0 | 68.3 | 68.3 | 0.00 | 0.27 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,172 | 0 | 47,104 | 750 | 0.8 | 0.0 | 107.8 | 107.8 | 0.00 | 0.30 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 3 | success | 1 | 21 | 0 | 22 | 0 | 329 | 10 | 24,020 | 0 | 80,768 | 1,105 | 1.8 | 0.0 | 122.5 | 122.5 | 0.00 | 0.27 | Receipt: Ember-356 |
