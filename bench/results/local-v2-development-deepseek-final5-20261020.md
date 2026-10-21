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
| Correct | 89 / 96 | 90 / 96 | 72 / 96 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 7 | 6 | 24 |
| Tool calls (including retries) | 812 | 943 | 1,745 |
| Sarvam API attempts (including retries) | 888 | 960 | 1,809 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 2049.9 | 2274.2 | 4354.2 |
| Sarvam limiter queue / cooldown (total, s) | 18181.6 / 0.0 | 17765.0 / 0.0 | 33425.5 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 1674.0 / 0.0 | 1794.4 / 0.0 | 3660.5 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 22 | 9 | 7 |
| Browser observation text (observed chars) | 361,637 | 872,281 | 35,733 |
| Browser observation images (observed blocks) | 27 | 44 | 760 |
| Normal input tokens (total) | 394,747 | 609,555 | 2,865,359 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 2,832,128 | 5,130,240 | 7,345,920 |
| Output tokens (total) | 104,258 | 112,009 | 253,508 |
| Total input tokens incl. cache (legacy) | 3,226,875 | 5,739,795 | 10,211,279 |
| MCP startup (total, s) | 83.8 | 54.8 | 117.2 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 20231.5 | 20039.2 | 37779.7 |
| CLI wall (total, s) | 20231.5 | 20039.2 | 37779.7 |
| Fixture verification (total, s) | 0.1 | 0.0 | 0.7 |
| Cleanup (total, s) | 22.1 | 22.5 | 21.1 |
| Harness capture (total, s) | 63.3 | 570.8 | 92.1 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 22.23 | 29.56 | 101.93 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,373 | 0 | 8,064 | 349 | 1.9 | 0.0 | 108.2 | 108.2 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,048 | 0 | 33,920 | 414 | 1.2 | 0.0 | 180.8 | 180.8 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 29 | 0 | 30 | 0 | 312 | 14 | 62,083 | 0 | 129,920 | 3,261 | 2.4 | 0.0 | 773.8 | 773.8 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 3,277 | 0 | 2,734 | 0 | 10,624 | 290 | 2.0 | 0.0 | 113.2 | 113.2 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 39,460 | 0 | 14,955 | 0 | 34,048 | 462 | 1.2 | 0.0 | 180.1 | 180.1 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 31 | 0 | 32 | 0 | 325 | 15 | 68,128 | 0 | 139,136 | 3,171 | 2.3 | 0.0 | 838.4 | 838.4 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 3,277 | 0 | 2,629 | 0 | 10,752 | 327 | 1.9 | 0.0 | 181.7 | 181.7 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,052 | 0 | 33,920 | 408 | 1.2 | 0.0 | 229.2 | 229.2 | 0.00 | 0.26 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 664 | 15 | 93,826 | 0 | 182,656 | 7,691 | 2.4 | 0.0 | 1008.8 | 1008.8 | 0.00 | 0.24 | sarvam CLI returned an error result |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,062 | 0 | 2,415 | 0 | 7,936 | 341 | 1.9 | 0.0 | 110.5 | 110.5 | 0.00 | 0.23 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,716 | 0 | 24,832 | 378 | 0.5 | 0.0 | 126.3 | 126.3 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 434 | 15 | 61,018 | 0 | 159,616 | 3,900 | 1.2 | 0.0 | 838.3 | 838.3 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,246 | 0 | 8,064 | 368 | 0.8 | 0.0 | 113.9 | 113.9 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,570 | 0 | 24,960 | 383 | 0.7 | 0.0 | 172.7 | 172.7 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 23 | 0 | 24 | 0 | 322 | 10 | 26,983 | 0 | 90,368 | 2,088 | 1.1 | 0.0 | 713.2 | 713.2 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,308 | 0 | 8,064 | 360 | 0.8 | 0.0 | 173.8 | 173.8 | 0.00 | 0.26 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,496 | 0 | 25,088 | 390 | 0.6 | 0.0 | 69.2 | 69.2 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 834 | 14 | 74,727 | 0 | 170,240 | 7,141 | 1.2 | 0.0 | 900.9 | 900.9 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 22,508 | 0 | 11,965 | 0 | 31,232 | 779 | 0.8 | 0.0 | 294.9 | 294.9 | 0.00 | 0.23 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 26 | 0 | 18 | 0 | 47,656 | 5 | 32,751 | 0 | 335,488 | 9,024 | 0.5 | 0.0 | 654.0 | 654.0 | 0.00 | 0.24 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 394 | 15 | 82,331 | 0 | 182,144 | 5,362 | 1.1 | 0.0 | 774.3 | 774.3 | 0.13 | 0.21 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 14 | 1 | 15 | 0 | 24,009 | 0 | 20,334 | 0 | 97,536 | 8,897 | 0.8 | 0.0 | 494.0 | 494.0 | 0.00 | 0.21 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 29,694 | 0 | 10,881 | 0 | 7,552 | 206 | 0.5 | 0.0 | 60.5 | 60.5 | 0.00 | 0.24 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 398 | 15 | 83,886 | 0 | 182,272 | 5,527 | 1.1 | 0.0 | 963.4 | 963.4 | 0.09 | 0.20 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 3 | success | 1 | 21 | 4 | 18 | 0 | 18,090 | 7 | 20,269 | 0 | 140,032 | 7,628 | 0.7 | 0.0 | 473.9 | 473.9 | 0.00 | 0.24 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 68 | 0 | 19 | 0 | 39,276 | 8 | 28,157 | 0 | 310,912 | 5,741 | 0.5 | 0.0 | 469.5 | 469.5 | 0.00 | 0.26 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 393 | 16 | 74,495 | 0 | 149,504 | 3,508 | 1.1 | 0.0 | 831.0 | 831.0 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,529 | 0 | 19,072 | 552 | 0.8 | 0.0 | 176.5 | 176.5 | 0.00 | 0.22 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,736 | 0 | 38,400 | 656 | 0.5 | 0.0 | 128.6 | 128.6 | 0.00 | 0.25 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,239 | 0 | 22,912 | 647 | 1.1 | 0.0 | 246.7 | 246.7 | 0.00 | 0.24 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,485 | 0 | 19,200 | 534 | 0.9 | 0.0 | 129.8 | 129.8 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,174 | 0 | 29,312 | 626 | 0.5 | 0.0 | 238.4 | 238.4 | 0.00 | 0.26 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,288 | 0 | 9,856 | 498 | 1.2 | 0.0 | 171.5 | 171.5 | 0.00 | 0.27 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,409 | 0 | 19,200 | 550 | 0.8 | 0.0 | 131.1 | 131.1 | 0.00 | 0.25 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,121 | 0 | 29,440 | 554 | 0.5 | 0.0 | 236.6 | 236.6 | 0.00 | 0.22 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 195 | 2 | 3,526 | 0 | 9,728 | 520 | 1.1 | 0.0 | 226.9 | 226.9 | 0.00 | 0.23 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 21 | 1 | 22 | 0 | 13,809 | 0 | 10,944 | 0 | 94,336 | 2,436 | 0.8 | 0.0 | 586.5 | 586.5 | 0.00 | 0.23 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 26 | 0 | 27 | 0 | 30,657 | 1 | 18,463 | 0 | 229,376 | 3,089 | 0.4 | 0.0 | 671.5 | 671.5 | 0.00 | 0.22 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 17 | 0 | 18 | 0 | 233 | 8 | 10,096 | 0 | 58,240 | 1,185 | 1.1 | 0.0 | 422.3 | 422.3 | 0.00 | 0.23 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 14 | 0 | 15 | 0 | 11,731 | 0 | 7,410 | 0 | 51,840 | 1,312 | 0.9 | 0.0 | 480.5 | 480.5 | 0.00 | 0.23 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 17 | 0 | 18 | 0 | 19,316 | 0 | 10,778 | 0 | 98,432 | 1,793 | 0.5 | 0.0 | 372.7 | 372.7 | 0.00 | 0.24 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 201 | 6 | 7,668 | 0 | 35,968 | 1,124 | 1.3 | 0.0 | 242.2 | 242.2 | 0.00 | 0.26 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | cli_error | 1 | 35 | 5 | 35 | 0 | 24,146 | 1 | 26,649 | 0 | 317,824 | 16,661 | 0.9 | 0.0 | 1123.3 | 1123.3 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 16 | 0 | 17 | 0 | 16,695 | 0 | 9,577 | 0 | 86,016 | 1,424 | 0.5 | 0.0 | 305.5 | 305.5 | 0.00 | 0.23 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 201 | 6 | 8,037 | 0 | 37,376 | 1,422 | 1.3 | 0.0 | 301.1 | 301.1 | 0.00 | 0.21 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,975 | 0 | 15,232 | 824 | 0.8 | 0.0 | 171.2 | 171.2 | 0.00 | 0.21 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,748 | 0 | 31,104 | 589 | 0.5 | 0.0 | 239.2 | 239.2 | 0.00 | 0.26 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 9,961 | 0 | 64,896 | 1,212 | 1.2 | 0.0 | 414.6 | 414.6 | 0.00 | 0.21 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,574 | 0 | 2,254 | 0 | 12,416 | 508 | 0.8 | 0.0 | 113.2 | 113.2 | 0.00 | 0.23 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,534 | 0 | 31,360 | 649 | 0.5 | 0.0 | 290.9 | 290.9 | 0.00 | 0.27 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 10,117 | 0 | 66,048 | 1,538 | 1.2 | 0.0 | 420.8 | 420.8 | 0.00 | 0.26 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,862 | 0 | 15,360 | 521 | 0.8 | 0.0 | 166.7 | 166.7 | 0.00 | 0.24 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,586 | 0 | 31,360 | 622 | 0.5 | 0.0 | 68.6 | 68.6 | 0.00 | 0.23 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 9,913 | 0 | 65,536 | 1,130 | 1.1 | 0.0 | 357.9 | 357.9 | 0.00 | 0.22 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,780 | 0 | 14,208 | 466 | 0.8 | 0.0 | 169.1 | 169.1 | 0.00 | 0.24 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 7,089 | 0 | 28,672 | 612 | 0.5 | 0.0 | 173.5 | 173.5 | 0.00 | 0.22 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 268 | 8 | 11,693 | 0 | 73,088 | 3,381 | 1.1 | 0.0 | 424.6 | 424.6 | 0.00 | 0.25 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,689 | 0 | 14,336 | 434 | 0.8 | 0.0 | 185.3 | 185.3 | 0.00 | 0.21 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,975 | 0 | 28,800 | 593 | 0.5 | 0.0 | 179.6 | 179.6 | 0.00 | 0.27 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | success | 1 | 28 | 0 | 29 | 0 | 756 | 13 | 72,068 | 0 | 145,024 | 7,460 | 1.1 | 0.0 | 720.2 | 720.2 | 0.00 | 0.30 | case-024 \| Select \| case-024 selected |
| `v2-list-reordered-item` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,676 | 0 | 14,336 | 405 | 0.8 | 0.0 | 127.5 | 127.5 | 0.00 | 0.24 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,921 | 0 | 28,800 | 900 | 0.5 | 0.0 | 178.9 | 178.9 | 0.00 | 0.22 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 719 | 16 | 109,578 | 0 | 189,312 | 9,015 | 1.1 | 0.0 | 910.8 | 910.8 | 0.00 | 0.20 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Mantis | 1 | success | 1 | 14 | 0 | 15 | 0 | 14,825 | 0 | 8,552 | 0 | 61,184 | 1,244 | 0.9 | 0.0 | 410.2 | 410.2 | 0.00 | 0.25 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 14 | 0 | 15 | 0 | 26,204 | 0 | 11,766 | 0 | 91,776 | 3,163 | 0.5 | 0.0 | 353.9 | 353.9 | 0.00 | 0.29 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 515 | 14 | 72,099 | 0 | 163,712 | 6,257 | 1.1 | 0.0 | 900.6 | 900.6 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Mantis | 2 | success | 1 | 17 | 0 | 18 | 0 | 14,994 | 0 | 10,137 | 0 | 78,208 | 2,215 | 1.0 | 0.0 | 531.1 | 531.1 | 0.00 | 0.31 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 51 | 2 | 35 | 0 | 39,408 | 8 | 45,087 | 0 | 653,056 | 20,927 | 0.7 | 0.0 | 1080.6 | 1080.6 | 0.00 | 0.28 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 548 | 13 | 64,437 | 0 | 169,344 | 14,356 | 1.2 | 0.0 | 1007.5 | 1007.5 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Mantis | 3 | success | 1 | 16 | 0 | 17 | 0 | 16,871 | 0 | 9,562 | 0 | 76,032 | 1,771 | 0.8 | 0.0 | 416.2 | 416.2 | 0.00 | 0.23 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 21,894 | 0 | 9,572 | 0 | 68,224 | 1,726 | 0.7 | 0.0 | 245.8 | 245.8 | 0.00 | 0.24 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 365 | 11 | 43,908 | 0 | 139,136 | 4,625 | 1.1 | 0.0 | 678.3 | 678.3 | 0.00 | 0.21 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,174 | 0 | 11,136 | 521 | 0.9 | 0.0 | 115.1 | 115.1 | 0.00 | 0.23 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,387 | 0 | 7,424 | 223 | 0.5 | 0.0 | 63.5 | 63.5 | 0.00 | 0.22 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,451 | 0 | 1,664 | 376 | 1.2 | 0.0 | 62.3 | 62.3 | 0.00 | 0.23 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 4 | 0 | 4 | 0 | 992 | 0 | 1,177 | 0 | 7,168 | 281 | 0.8 | 0.0 | 53.6 | 53.6 | 0.00 | 0.22 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,253 | 0 | 7,552 | 169 | 0.5 | 0.0 | 56.0 | 56.0 | 0.00 | 0.30 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | success | 1 | 28 | 1 | 29 | 0 | 567 | 12 | 72,955 | 0 | 166,528 | 10,526 | 1.1 | 0.0 | 1019.3 | 1019.3 | 0.00 | 0.20 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,022 | 0 | 11,264 | 542 | 0.9 | 0.0 | 72.2 | 72.2 | 0.00 | 0.20 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,257 | 0 | 7,552 | 196 | 0.5 | 0.0 | 8.9 | 8.9 | 0.00 | 0.20 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,445 | 0 | 1,664 | 151 | 1.3 | 0.0 | 60.7 | 60.7 | 0.00 | 0.24 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,511 | 1 | 2,059 | 0 | 9,600 | 415 | 0.9 | 0.0 | 115.0 | 115.0 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,168 | 0 | 7,552 | 197 | 0.5 | 0.0 | 106.0 | 106.0 | 0.00 | 0.27 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 143 | 1.2 | 0.0 | 57.8 | 57.8 | 0.00 | 0.25 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 824 | 0 | 883 | 0 | 5,248 | 176 | 0.8 | 0.0 | 54.7 | 54.7 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 2,347 | 1 | 2,023 | 0 | 10,624 | 351 | 0.6 | 0.0 | 70.9 | 70.9 | 0.00 | 0.21 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 143 | 1.2 | 0.0 | 9.6 | 9.6 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 824 | 0 | 910 | 0 | 5,248 | 259 | 0.9 | 0.0 | 56.3 | 56.3 | 0.00 | 0.24 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 2,306 | 1 | 2,439 | 0 | 10,624 | 345 | 0.6 | 0.0 | 61.0 | 61.0 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 151 | 1.3 | 0.0 | 107.5 | 107.5 | 0.00 | 0.24 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,676 | 0 | 8,960 | 337 | 0.8 | 0.0 | 122.1 | 122.1 | 0.00 | 0.29 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 933 | 1 | 1,613 | 0 | 7,552 | 203 | 0.5 | 0.0 | 110.9 | 110.9 | 0.00 | 0.29 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,452 | 0 | 1,664 | 224 | 1.1 | 0.0 | 107.6 | 107.6 | 0.00 | 0.22 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 691 | 1 | 1,834 | 0 | 11,008 | 345 | 0.8 | 0.0 | 130.3 | 130.3 | 0.00 | 0.24 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 11,695 | 0 | 7,338 | 0 | 21,760 | 2,617 | 0.5 | 0.0 | 288.7 | 288.7 | 0.00 | 0.26 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,444 | 0 | 1,664 | 169 | 1.4 | 0.0 | 57.3 | 57.3 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-chart-image-fact` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,557 | 0 | 9,088 | 459 | 1.0 | 0.0 | 62.9 | 62.9 | 0.00 | 0.22 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,907 | 2 | 2,825 | 0 | 13,696 | 526 | 0.5 | 0.0 | 116.8 | 116.8 | 0.00 | 0.21 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,444 | 0 | 1,664 | 343 | 1.3 | 0.0 | 65.6 | 65.6 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-chart-responsive` | Mantis | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 530 | 0 | 911 | 0 | 5,120 | 196 | 0.8 | 0.0 | 61.9 | 61.9 | 0.00 | 0.27 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,249 | 0 | 10,496 | 330 | 0.5 | 0.0 | 124.9 | 124.9 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 135 | 2 | 2,852 | 0 | 4,736 | 515 | 1.3 | 0.0 | 113.7 | 113.7 | 0.00 | 0.22 | answer did not match the expected result |
| `v2-chart-responsive` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 976 | 0 | 1,376 | 0 | 7,168 | 366 | 0.8 | 0.0 | 166.1 | 166.1 | 0.00 | 0.21 | Bookings by quarter \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,269 | 0 | 10,496 | 365 | 0.7 | 0.0 | 62.5 | 62.5 | 0.00 | 0.33 | answer did not match the expected result |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 127 | 2 | 2,774 | 0 | 4,608 | 416 | 1.2 | 0.0 | 117.0 | 117.0 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-chart-responsive` | Mantis | 3 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 550 | 1 | 1,316 | 0 | 7,296 | 376 | 0.8 | 0.0 | 63.9 | 63.9 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,282 | 0 | 10,496 | 389 | 0.5 | 0.0 | 130.1 | 130.1 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 1 | 35 | 0 | 868 | 13 | 104,763 | 0 | 322,816 | 15,182 | 1.2 | 0.0 | 1012.4 | 1012.4 | 0.00 | 0.23 | sarvam CLI returned an error result |
| `v2-interaction-form-preferences` | Mantis | 1 | success | 1 | 4 | 0 | 4 | 0 | 631 | 0 | 1,255 | 0 | 6,912 | 247 | 0.9 | 0.0 | 115.5 | 115.5 | 0.00 | 0.24 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,494 | 0 | 17,152 | 384 | 0.6 | 0.0 | 113.8 | 113.8 | 0.00 | 0.29 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | cli_error | 1 | 36 | 0 | 35 | 0 | 573 | 17 | 86,870 | 0 | 137,856 | 5,736 | 1.2 | 0.0 | 1074.4 | 1074.4 | 0.00 | 0.23 | sarvam CLI returned an error result |
| `v2-interaction-form-preferences` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,607 | 0 | 8,960 | 272 | 0.9 | 0.0 | 116.9 | 116.9 | 0.00 | 0.25 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,377 | 0 | 17,280 | 390 | 0.5 | 0.0 | 122.8 | 122.8 | 0.00 | 0.23 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | success | 1 | 29 | 0 | 30 | 0 | 379 | 13 | 50,648 | 0 | 116,864 | 2,453 | 1.2 | 0.0 | 839.4 | 839.4 | 0.00 | 0.25 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,600 | 0 | 8,960 | 262 | 0.8 | 0.0 | 181.8 | 181.8 | 0.00 | 0.28 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,366 | 0 | 17,280 | 367 | 0.6 | 0.0 | 123.6 | 123.6 | 0.00 | 0.23 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 594 | 15 | 65,165 | 0 | 152,192 | 3,515 | 1.6 | 0.0 | 834.1 | 834.1 | 0.00 | 0.29 | sarvam CLI returned an error result |
| `v2-interaction-form-frame-payment` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,595 | 0 | 8,960 | 244 | 0.8 | 0.0 | 64.5 | 64.5 | 0.00 | 0.27 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,204 | 0 | 17,152 | 383 | 0.8 | 0.0 | 117.2 | 117.2 | 0.00 | 0.28 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 313 | 8 | 10,363 | 0 | 65,408 | 1,065 | 1.2 | 0.0 | 412.0 | 412.0 | 0.00 | 0.20 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,469 | 0 | 9,088 | 245 | 0.8 | 0.0 | 178.4 | 178.4 | 0.00 | 0.21 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,225 | 0 | 17,024 | 341 | 1.1 | 0.0 | 110.1 | 110.1 | 0.00 | 0.22 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 299 | 7 | 9,124 | 0 | 53,248 | 1,027 | 1.4 | 0.0 | 469.6 | 469.6 | 0.00 | 0.25 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,433 | 0 | 9,088 | 233 | 1.0 | 0.0 | 110.1 | 110.1 | 0.00 | 0.24 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,170 | 0 | 17,152 | 365 | 0.9 | 0.0 | 133.1 | 133.1 | 0.00 | 0.23 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | success | 1 | 17 | 0 | 18 | 0 | 313 | 7 | 9,305 | 0 | 58,368 | 1,046 | 1.1 | 0.0 | 365.6 | 365.6 | 0.00 | 0.24 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-combobox` | Mantis | 1 | success | 1 | 22 | 2 | 23 | 0 | 2,682 | 1 | 7,821 | 0 | 67,584 | 1,840 | 0.8 | 0.0 | 535.6 | 535.6 | 0.00 | 0.21 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 16 | 1 | 17 | 0 | 16,741 | 1 | 11,097 | 0 | 93,184 | 1,579 | 0.5 | 0.0 | 296.0 | 296.0 | 0.00 | 0.24 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 234 | 5 | 6,122 | 0 | 25,856 | 574 | 1.1 | 0.0 | 343.4 | 343.4 | 0.00 | 0.21 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 2 | success | 1 | 12 | 0 | 13 | 0 | 1,712 | 0 | 4,183 | 0 | 29,824 | 1,117 | 0.7 | 0.0 | 193.6 | 193.6 | 0.00 | 0.25 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 13 | 1 | 14 | 0 | 4,487 | 1 | 6,287 | 0 | 52,096 | 1,260 | 0.5 | 0.0 | 305.3 | 305.3 | 0.00 | 0.24 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 2 | success | 1 | 39 | 0 | 29 | 0 | 581 | 12 | 46,212 | 0 | 118,272 | 2,814 | 1.1 | 0.0 | 833.5 | 833.5 | 0.00 | 0.26 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 3 | success | 1 | 27 | 3 | 26 | 0 | 3,166 | 3 | 9,654 | 0 | 87,296 | 2,478 | 0.8 | 0.0 | 769.7 | 769.7 | 0.00 | 0.24 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 25 | 1 | 26 | 0 | 19,467 | 2 | 16,628 | 0 | 168,192 | 3,486 | 0.5 | 0.0 | 765.0 | 765.0 | 0.00 | 0.25 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 255 | 6 | 7,555 | 0 | 35,712 | 863 | 1.1 | 0.0 | 252.2 | 252.2 | 0.00 | 0.23 | West Ridge assigned. |
| `v2-interaction-form-validation-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,776 | 0 | 11,008 | 282 | 0.8 | 0.0 | 117.1 | 117.1 | 0.00 | 0.22 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,837 | 0 | 23,808 | 414 | 0.5 | 0.0 | 123.7 | 123.7 | 0.00 | 0.24 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,546 | 0 | 20,096 | 575 | 1.1 | 0.0 | 190.9 | 190.9 | 0.00 | 0.21 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,671 | 0 | 11,136 | 288 | 0.8 | 0.0 | 180.0 | 180.0 | 0.00 | 0.25 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,850 | 0 | 23,808 | 417 | 0.5 | 0.0 | 131.4 | 131.4 | 0.00 | 0.25 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 11 | 0 | 12 | 0 | 255 | 4 | 5,570 | 0 | 23,040 | 655 | 1.1 | 0.0 | 304.2 | 304.2 | 0.00 | 0.21 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,659 | 0 | 11,136 | 285 | 0.9 | 0.0 | 167.4 | 167.4 | 0.00 | 0.26 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,940 | 0 | 23,936 | 470 | 0.5 | 0.0 | 297.9 | 297.9 | 0.00 | 0.26 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,598 | 0 | 20,096 | 576 | 1.1 | 0.0 | 238.3 | 238.3 | 0.00 | 0.23 | Invite sent to ada@northwind.test. |
| `v2-interaction-overlay-dialog` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,486 | 0 | 8,832 | 237 | 0.8 | 0.0 | 166.0 | 166.0 | 0.00 | 0.21 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,549 | 0 | 20,096 | 378 | 0.5 | 0.0 | 111.3 | 111.3 | 0.00 | 0.29 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,668 | 0 | 9,088 | 364 | 2.1 | 0.0 | 118.4 | 118.4 | 0.00 | 0.21 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,376 | 0 | 8,960 | 246 | 1.7 | 0.0 | 116.4 | 116.4 | 0.00 | 0.24 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,621 | 0 | 20,096 | 402 | 0.5 | 0.0 | 116.9 | 116.9 | 0.00 | 0.22 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,664 | 0 | 9,088 | 351 | 1.2 | 0.0 | 118.4 | 118.4 | 0.00 | 0.21 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,302 | 0 | 8,960 | 206 | 0.8 | 0.0 | 121.7 | 121.7 | 0.00 | 0.22 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,501 | 0 | 20,096 | 356 | 0.5 | 0.0 | 125.1 | 125.1 | 0.00 | 0.25 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,616 | 0 | 9,088 | 340 | 1.1 | 0.0 | 120.6 | 120.6 | 0.00 | 0.23 | Report exported with essential privacy. |
| `v2-interaction-overlay-shadow` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,462 | 0 | 8,832 | 219 | 0.9 | 0.0 | 118.7 | 118.7 | 0.00 | 0.24 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,106 | 0 | 16,768 | 314 | 0.5 | 0.0 | 129.8 | 129.8 | 0.00 | 0.26 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 8,918 | 0 | 52,992 | 942 | 1.1 | 0.0 | 353.8 | 353.8 | 0.00 | 0.19 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,351 | 0 | 8,960 | 224 | 0.8 | 0.0 | 62.9 | 62.9 | 0.00 | 0.24 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,173 | 0 | 16,768 | 338 | 0.5 | 0.0 | 126.7 | 126.7 | 0.00 | 0.20 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 244 | 6 | 7,394 | 0 | 36,096 | 701 | 1.1 | 0.0 | 410.5 | 410.5 | 0.00 | 0.21 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,342 | 0 | 8,960 | 220 | 0.8 | 0.0 | 170.4 | 170.4 | 0.00 | 0.23 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,071 | 0 | 16,768 | 307 | 0.5 | 0.0 | 226.6 | 226.6 | 0.00 | 0.21 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 3 | success | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 8,950 | 0 | 52,608 | 905 | 1.2 | 0.0 | 418.1 | 418.1 | 0.00 | 0.20 | Compact density applied. |
| `v2-interaction-overlay-modal` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 1,944 | 0 | 13,312 | 353 | 0.8 | 0.0 | 172.5 | 172.5 | 0.00 | 0.21 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,787 | 0 | 23,552 | 504 | 0.5 | 0.0 | 181.4 | 181.4 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,527 | 0 | 20,224 | 649 | 1.3 | 0.0 | 245.4 | 245.4 | 0.00 | 0.24 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,393 | 0 | 2,180 | 0 | 15,872 | 374 | 1.0 | 0.0 | 239.4 | 239.4 | 0.00 | 0.20 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,809 | 0 | 23,552 | 474 | 0.6 | 0.0 | 181.8 | 181.8 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,160 | 0 | 19,968 | 526 | 1.1 | 0.0 | 247.2 | 247.2 | 0.00 | 0.20 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 1,788 | 0 | 13,440 | 375 | 0.8 | 0.0 | 190.4 | 190.4 | 0.00 | 0.23 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,803 | 0 | 23,552 | 486 | 0.6 | 0.0 | 114.7 | 114.7 | 0.00 | 0.22 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,146 | 0 | 19,968 | 502 | 1.1 | 0.0 | 247.9 | 247.9 | 0.00 | 0.21 | Project renamed to Aurora. |
| `v2-interaction-overlay-toast` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 582 | 0 | 1,105 | 0 | 9,088 | 213 | 0.8 | 0.0 | 185.3 | 185.3 | 0.00 | 0.28 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,237 | 0 | 20,096 | 327 | 0.5 | 0.0 | 179.9 | 179.9 | 0.00 | 0.21 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,551 | 0 | 9,088 | 317 | 1.1 | 0.0 | 121.5 | 121.5 | 0.00 | 0.21 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,779 | 0 | 10,880 | 271 | 0.8 | 0.0 | 126.6 | 126.6 | 0.00 | 0.28 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,252 | 0 | 20,096 | 333 | 0.5 | 0.0 | 182.6 | 182.6 | 0.00 | 0.21 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,719 | 0 | 8,960 | 328 | 1.1 | 0.0 | 128.9 | 128.9 | 0.00 | 0.21 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,555 | 0 | 11,136 | 284 | 0.8 | 0.0 | 165.2 | 165.2 | 0.00 | 0.24 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,314 | 0 | 20,096 | 352 | 0.5 | 0.0 | 166.4 | 166.4 | 0.00 | 0.22 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,719 | 0 | 8,960 | 328 | 1.1 | 0.0 | 119.3 | 119.3 | 0.00 | 0.20 | Archive undone. |
| `v2-interaction-spa-client-route` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,638 | 0 | 11,136 | 223 | 0.8 | 0.0 | 237.9 | 237.9 | 0.00 | 0.22 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,497 | 0 | 20,480 | 347 | 0.5 | 0.0 | 181.3 | 181.3 | 0.00 | 0.21 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,574 | 0 | 9,088 | 328 | 1.1 | 0.0 | 120.5 | 120.5 | 0.00 | 0.21 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 981 | 0 | 1,761 | 0 | 11,008 | 222 | 0.8 | 0.0 | 117.0 | 117.0 | 0.00 | 0.24 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,497 | 0 | 20,480 | 347 | 0.5 | 0.0 | 236.3 | 236.3 | 0.00 | 0.24 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,756 | 0 | 8,832 | 303 | 1.2 | 0.0 | 170.2 | 170.2 | 0.00 | 0.22 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,638 | 0 | 11,136 | 223 | 0.8 | 0.0 | 347.1 | 347.1 | 0.00 | 0.24 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,811 | 0 | 2,479 | 0 | 20,480 | 342 | 0.6 | 0.0 | 133.2 | 133.2 | 0.00 | 0.24 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,674 | 0 | 8,960 | 313 | 1.0 | 0.0 | 126.0 | 126.0 | 0.00 | 0.21 | Mercury marked complete. |
| `v2-interaction-spa-history-draft` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,665 | 0 | 8,960 | 253 | 1.0 | 0.0 | 176.4 | 176.4 | 0.00 | 0.20 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,140 | 0 | 16,768 | 336 | 0.5 | 0.0 | 113.4 | 113.4 | 0.00 | 0.25 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,116 | 0 | 10,496 | 393 | 1.1 | 0.0 | 176.3 | 176.3 | 0.00 | 0.21 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,518 | 0 | 9,088 | 246 | 0.8 | 0.0 | 113.4 | 113.4 | 0.00 | 0.22 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,133 | 0 | 16,768 | 318 | 0.5 | 0.0 | 125.0 | 125.0 | 0.00 | 0.24 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 3,945 | 0 | 10,624 | 388 | 1.3 | 0.0 | 125.5 | 125.5 | 0.00 | 0.21 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,518 | 0 | 9,216 | 310 | 0.8 | 0.0 | 118.2 | 118.2 | 0.00 | 0.22 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,155 | 0 | 16,768 | 394 | 0.5 | 0.0 | 242.6 | 242.6 | 0.00 | 0.26 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 3 | success | 1 | 9 | 0 | 10 | 0 | 213 | 4 | 4,963 | 0 | 17,152 | 544 | 1.1 | 0.0 | 284.4 | 284.4 | 0.00 | 0.21 | Release notes |
| `v2-interaction-spa-route-recovery` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 2,141 | 0 | 13,312 | 273 | 0.8 | 0.0 | 186.2 | 186.2 | 0.00 | 0.22 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,346 | 0 | 28,032 | 466 | 0.5 | 0.0 | 239.1 | 239.1 | 0.00 | 0.21 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,775 | 0 | 15,104 | 433 | 1.1 | 0.0 | 184.1 | 184.1 | 0.00 | 0.20 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 2,017 | 0 | 13,440 | 272 | 0.8 | 0.0 | 227.1 | 227.1 | 0.00 | 0.21 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,314 | 0 | 28,032 | 472 | 0.5 | 0.0 | 305.5 | 305.5 | 0.00 | 0.24 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,903 | 0 | 14,976 | 433 | 1.1 | 0.0 | 243.3 | 243.3 | 0.00 | 0.22 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 2,017 | 0 | 13,440 | 272 | 0.8 | 0.0 | 176.9 | 176.9 | 0.00 | 0.20 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,326 | 0 | 28,032 | 461 | 0.5 | 0.0 | 300.0 | 300.0 | 0.00 | 0.23 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,907 | 0 | 14,976 | 449 | 1.1 | 0.0 | 233.2 | 233.2 | 0.00 | 0.20 | Notification settings recovered and saved. |
| `v2-interaction-spa-retry-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 913 | 0 | 1,661 | 0 | 11,136 | 290 | 0.8 | 0.0 | 170.2 | 170.2 | 0.00 | 0.32 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,385 | 0 | 20,096 | 343 | 0.5 | 0.0 | 172.4 | 172.4 | 0.00 | 0.25 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,616 | 0 | 9,088 | 323 | 1.2 | 0.0 | 121.2 | 121.2 | 0.00 | 0.21 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,466 | 0 | 8,832 | 213 | 0.9 | 0.0 | 69.7 | 69.7 | 0.00 | 0.25 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,373 | 0 | 20,096 | 343 | 0.5 | 0.0 | 126.8 | 126.8 | 0.00 | 0.24 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,716 | 0 | 8,960 | 305 | 1.1 | 0.0 | 169.2 | 169.2 | 0.00 | 0.20 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,348 | 0 | 8,960 | 216 | 0.8 | 0.0 | 173.9 | 173.9 | 0.00 | 0.20 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,394 | 0 | 20,096 | 340 | 0.5 | 0.0 | 179.8 | 179.8 | 0.00 | 0.25 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,820 | 0 | 8,832 | 304 | 1.3 | 0.0 | 308.3 | 308.3 | 0.00 | 0.21 | Contacts synced after retry. |
| `v2-reading-landmark-jump` | Mantis | 1 | cli_error | 1 | 35 | 1 | 35 | 0 | 6,836 | 2 | 14,558 | 0 | 175,872 | 5,721 | 0.8 | 0.0 | 901.4 | 901.4 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 20 | 1 | 21 | 0 | 21,315 | 1 | 14,101 | 0 | 144,896 | 1,946 | 0.6 | 0.0 | 414.2 | 414.2 | 0.00 | 0.23 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 742 | 17 | 101,804 | 0 | 187,136 | 8,593 | 1.1 | 0.0 | 832.5 | 832.5 | 0.00 | 0.18 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Mantis | 2 | cli_error | 1 | 35 | 2 | 35 | 0 | 15,441 | 3 | 17,507 | 0 | 171,520 | 6,784 | 0.9 | 0.0 | 895.5 | 895.5 | 0.06 | 0.18 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 27 | 0 | 28 | 0 | 25,528 | 2 | 20,015 | 0 | 240,640 | 4,838 | 0.6 | 0.0 | 778.7 | 778.7 | 0.00 | 0.23 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 35 | 0 | 886 | 16 | 103,577 | 0 | 184,704 | 7,851 | 1.2 | 0.0 | 723.0 | 723.0 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Mantis | 3 | cli_error | 1 | 35 | 1 | 35 | 0 | 11,748 | 2 | 20,200 | 0 | 182,656 | 10,072 | 0.7 | 0.0 | 841.4 | 841.4 | 0.00 | 0.22 | sarvam CLI returned an error result |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 25 | 1 | 26 | 0 | 23,639 | 1 | 17,340 | 0 | 196,736 | 3,737 | 0.5 | 0.0 | 545.9 | 545.9 | 0.00 | 0.27 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,072 | 14 | 82,422 | 0 | 203,392 | 12,072 | 1.1 | 0.0 | 770.7 | 770.7 | 0.47 | 0.21 | sarvam CLI returned an error result |
| `v2-reading-deep-fact` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,759 | 0 | 3,060 | 0 | 19,072 | 677 | 0.7 | 0.0 | 176.0 | 176.0 | 0.00 | 0.65 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,246 | 0 | 32,768 | 680 | 0.5 | 0.0 | 126.7 | 126.7 | 0.00 | 0.26 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 866 | 14 | 86,814 | 0 | 196,224 | 7,021 | 2.6 | 0.0 | 653.1 | 653.1 | 0.00 | 0.29 | sarvam CLI returned an error result |
| `v2-reading-deep-fact` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,535 | 0 | 2,432 | 0 | 16,256 | 454 | 0.9 | 0.0 | 184.3 | 184.3 | 0.00 | 0.22 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,036 | 0 | 32,512 | 525 | 0.5 | 0.0 | 237.9 | 237.9 | 0.00 | 0.19 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,126 | 15 | 79,173 | 0 | 201,856 | 7,360 | 1.1 | 0.0 | 524.4 | 524.4 | 0.00 | 0.25 | sarvam CLI returned an error result |
| `v2-reading-deep-fact` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,913 | 0 | 2,870 | 0 | 18,816 | 493 | 0.7 | 0.0 | 172.4 | 172.4 | 0.00 | 0.19 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,168 | 0 | 32,512 | 560 | 0.5 | 0.0 | 70.7 | 70.7 | 0.00 | 0.21 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 3 | success | 1 | 17 | 0 | 18 | 0 | 291 | 8 | 10,826 | 0 | 66,688 | 1,762 | 1.1 | 0.0 | 236.0 | 236.0 | 0.00 | 0.24 | Appendix clause 31: Cinder-693 |
| `v2-reading-cross-region` | Mantis | 1 | success | 1 | 15 | 0 | 12 | 0 | 2,143 | 0 | 4,550 | 0 | 28,928 | 1,328 | 0.9 | 0.0 | 126.5 | 126.5 | 0.00 | 0.21 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 4,927 | 1 | 5,840 | 0 | 40,576 | 1,200 | 0.5 | 0.0 | 125.7 | 125.7 | 0.00 | 0.19 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 240 | 5 | 6,432 | 0 | 26,368 | 712 | 1.1 | 0.0 | 120.6 | 120.6 | 0.00 | 0.18 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 1,816 | 1 | 4,227 | 0 | 28,288 | 1,241 | 0.8 | 0.0 | 231.6 | 231.6 | 0.00 | 0.24 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,440 | 0 | 4,354 | 0 | 33,024 | 833 | 1.0 | 0.0 | 120.9 | 120.9 | 0.00 | 0.21 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 2 | success | 1 | 28 | 0 | 29 | 0 | 602 | 13 | 60,733 | 0 | 135,552 | 4,206 | 1.0 | 0.0 | 299.3 | 299.3 | 0.00 | 0.18 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 3 | success | 1 | 16 | 2 | 17 | 0 | 7,553 | 0 | 6,495 | 0 | 54,144 | 1,246 | 0.8 | 0.0 | 184.3 | 184.3 | 0.00 | 0.24 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 21 | 1 | 22 | 0 | 9,864 | 1 | 12,968 | 0 | 135,936 | 4,507 | 0.5 | 0.0 | 300.3 | 300.3 | 0.00 | 0.22 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,058 | 14 | 78,786 | 0 | 202,112 | 7,946 | 1.2 | 0.0 | 538.7 | 538.7 | 0.00 | 0.20 | sarvam CLI returned an error result |
| `v2-reading-collapsed-context` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,639 | 0 | 3,160 | 0 | 19,072 | 839 | 0.9 | 0.0 | 116.7 | 116.7 | 0.00 | 0.21 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 4,879 | 1 | 5,418 | 0 | 39,552 | 866 | 0.5 | 0.0 | 118.5 | 118.5 | 0.00 | 0.22 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,476 | 11 | 53,426 | 0 | 224,640 | 8,642 | 1.3 | 0.0 | 477.6 | 477.6 | 0.00 | 0.25 | sarvam CLI returned an error result |
| `v2-reading-collapsed-context` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,557 | 0 | 2,482 | 0 | 16,000 | 409 | 0.8 | 0.0 | 62.2 | 62.2 | 0.00 | 0.18 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,081 | 0 | 32,384 | 604 | 0.5 | 0.0 | 114.0 | 114.0 | 0.00 | 0.24 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 1 | 35 | 0 | 1,233 | 14 | 90,290 | 0 | 199,552 | 8,052 | 1.2 | 0.0 | 478.3 | 478.3 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-reading-collapsed-context` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 1,557 | 0 | 2,441 | 0 | 16,000 | 399 | 0.9 | 0.0 | 112.1 | 112.1 | 0.00 | 0.18 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,029 | 0 | 32,512 | 597 | 0.5 | 0.0 | 117.5 | 117.5 | 0.00 | 0.22 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 3 | success | 1 | 29 | 0 | 30 | 0 | 907 | 12 | 51,738 | 0 | 154,752 | 4,337 | 1.1 | 0.0 | 368.6 | 368.6 | 0.00 | 0.37 | Expanded retained context: Dune-119 |
| `v2-workflow-multi-step-order` | Mantis | 1 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 3,750 | 0 | 29,056 | 641 | 0.7 | 0.0 | 166.7 | 166.7 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 16 | 0 | 17 | 0 | 7,644 | 2 | 8,338 | 0 | 82,432 | 1,112 | 0.7 | 0.0 | 183.6 | 183.6 | 0.00 | 0.26 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 1 | success | 1 | 42 | 0 | 43 | 0 | 779 | 18 | 107,675 | 0 | 215,040 | 5,603 | 1.2 | 0.0 | 479.1 | 479.1 | 0.00 | 0.20 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 2 | success | 1 | 13 | 0 | 14 | 0 | 2,550 | 0 | 4,162 | 0 | 31,872 | 658 | 0.7 | 0.0 | 127.4 | 127.4 | 0.00 | 0.24 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 23 | 1 | 24 | 0 | 10,160 | 1 | 10,946 | 0 | 131,072 | 2,205 | 0.6 | 0.0 | 240.0 | 240.0 | 0.00 | 0.21 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 2 | success | 1 | 34 | 0 | 35 | 0 | 453 | 16 | 71,328 | 0 | 140,672 | 2,392 | 1.1 | 0.0 | 409.6 | 409.6 | 0.00 | 0.18 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 3 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 3,665 | 0 | 29,056 | 637 | 0.8 | 0.0 | 118.2 | 118.2 | 0.00 | 0.22 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 15 | 0 | 16 | 0 | 7,188 | 0 | 6,357 | 0 | 61,312 | 1,020 | 0.6 | 0.0 | 180.9 | 180.9 | 0.00 | 0.33 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 400 | 13 | 47,667 | 0 | 112,000 | 1,912 | 1.3 | 0.0 | 309.9 | 309.9 | 0.00 | 0.17 | Receipt: Cinder-127 |
| `v2-workflow-cross-page-compare` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 3,408 | 0 | 3,864 | 0 | 27,776 | 527 | 0.9 | 0.0 | 121.5 | 121.5 | 0.00 | 0.18 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,639 | 0 | 51,072 | 784 | 0.6 | 0.0 | 177.5 | 177.5 | 0.00 | 0.24 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,308 | 0 | 42,496 | 849 | 1.1 | 0.0 | 180.6 | 180.6 | 0.00 | 0.25 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 3,408 | 0 | 3,813 | 0 | 27,904 | 545 | 0.8 | 0.0 | 168.6 | 168.6 | 0.00 | 0.20 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 14 | 0 | 15 | 0 | 7,469 | 0 | 6,047 | 0 | 56,960 | 853 | 1.2 | 0.0 | 174.8 | 174.8 | 0.00 | 0.20 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,136 | 0 | 42,368 | 766 | 1.9 | 0.0 | 166.7 | 166.7 | 0.00 | 0.24 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 3,408 | 0 | 4,873 | 0 | 27,008 | 539 | 0.7 | 0.0 | 117.4 | 117.4 | 0.00 | 0.19 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 7,198 | 0 | 49,408 | 831 | 0.5 | 0.0 | 174.2 | 174.2 | 0.00 | 0.22 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 9,192 | 0 | 41,472 | 924 | 1.0 | 0.0 | 179.9 | 179.9 | 0.00 | 0.20 | Receipt: Aster-301 |
| `v2-workflow-save-resume` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,994 | 0 | 27,136 | 530 | 0.9 | 0.0 | 129.8 | 129.8 | 0.00 | 0.18 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 5,052 | 0 | 39,936 | 640 | 0.5 | 0.0 | 130.1 | 130.1 | 0.00 | 0.19 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 1 | success | 1 | 17 | 0 | 18 | 0 | 279 | 8 | 10,714 | 0 | 57,088 | 1,021 | 1.2 | 0.0 | 237.4 | 237.4 | 0.00 | 0.17 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 4,080 | 0 | 27,008 | 524 | 0.8 | 0.0 | 118.9 | 118.9 | 0.00 | 0.19 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,730 | 0 | 40,320 | 600 | 0.6 | 0.0 | 127.7 | 127.7 | 0.00 | 0.19 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,593 | 0 | 33,664 | 677 | 1.2 | 0.0 | 177.2 | 177.2 | 0.00 | 0.17 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,997 | 0 | 27,136 | 544 | 0.8 | 0.0 | 172.6 | 172.6 | 0.00 | 0.18 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 7,049 | 0 | 38,016 | 631 | 0.4 | 0.0 | 165.4 | 165.4 | 0.00 | 0.18 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,726 | 0 | 33,792 | 742 | 1.1 | 0.0 | 131.0 | 131.0 | 0.00 | 0.19 | Receipt: Ember-583 |
| `v2-workflow-conditional-branch` | Mantis | 1 | success | 1 | 9 | 0 | 10 | 0 | 1,428 | 0 | 2,950 | 0 | 20,352 | 454 | 0.8 | 0.0 | 72.0 | 72.0 | 0.00 | 0.18 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,289 | 0 | 46,464 | 748 | 0.8 | 0.0 | 171.3 | 171.3 | 0.00 | 0.20 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 1 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 32,079 | 0 | 92,416 | 1,382 | 1.2 | 0.0 | 230.6 | 230.6 | 0.00 | 0.15 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,636 | 0 | 17,664 | 418 | 0.8 | 0.0 | 108.1 | 108.1 | 0.00 | 0.19 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,373 | 0 | 46,464 | 757 | 0.6 | 0.0 | 170.0 | 170.0 | 0.00 | 0.16 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,521 | 0 | 91,648 | 1,270 | 1.1 | 0.0 | 139.0 | 139.0 | 0.00 | 0.15 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 3 | success | 1 | 10 | 0 | 11 | 0 | 1,788 | 0 | 3,119 | 0 | 23,296 | 505 | 0.7 | 0.0 | 69.1 | 69.1 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,348 | 0 | 46,336 | 759 | 0.5 | 0.0 | 127.2 | 127.2 | 0.00 | 0.17 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 3 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,483 | 0 | 92,032 | 1,390 | 1.0 | 0.0 | 167.4 | 167.4 | 0.00 | 0.15 | Receipt: Ember-356 |
