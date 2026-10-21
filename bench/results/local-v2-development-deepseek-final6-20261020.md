# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 76 recorded so far; 76 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 26 / 26 | 21 / 25 | 22 / 25 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 4 | 3 |
| Tool calls (including retries) | 210 | 402 | 418 |
| Sarvam API attempts (including retries) | 230 | 355 | 440 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 454.7 | 1058.6 | unknown |
| Sarvam limiter queue / cooldown (total, s) | 1756.0 / 0.0 | 3206.2 / 0.0 | 3895.7 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 400.4 / 0.0 | 992.4 / 0.0 | 930.3 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 1 | 4 |
| Browser observation text (observed chars) | 176,085 | 588,296 | 7,921 |
| Browser observation images (observed blocks) | 3 | 44 | 200 |
| Normal input tokens (total) | 128,274 | 441,366 | unknown |
| Cache-write input tokens (total) | 0 | 0 | unknown |
| Cache-read input tokens (total) | 789,376 | 4,168,576 | unknown |
| Output tokens (total) | 24,541 | 77,101 | unknown |
| Total input tokens incl. cache (legacy) | 917,650 | 4,609,942 | unknown |
| MCP startup (total, s) | 29.0 | 16.9 | 34.8 |
| CLI startup (total, s) | 0.0 | 0.0 | unknown |
| CLI execution (total, s) | 2210.7 | 4264.8 | unknown |
| CLI wall (total, s) | 2210.7 | 4264.8 | unknown |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 5.5 | 5.4 | 4.8 |
| Harness capture (total, s) | 17.2 | 234.4 | 25.8 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 6.18 | 21.21 | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,349 | 0 | 8,320 | 322 | 1.8 | 0.0 | 6.7 | 6.7 | 0.00 | 0.23 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 34,781 | 0 | 13,958 | 0 | 33,920 | 435 | 1.3 | 0.0 | 9.6 | 9.6 | 0.00 | 0.27 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 31 | 1 | 32 | 0 | 687 | 15 | 64,739 | 0 | 134,400 | 2,532 | 2.2 | 0.0 | 303.4 | 303.4 | 0.00 | 0.19 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,318 | 0 | 8,320 | 316 | 1.8 | 0.0 | 7.2 | 7.2 | 0.00 | 0.33 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 24,282 | 0 | 10,243 | 0 | 33,920 | 443 | 1.1 | 0.0 | 61.2 | 61.2 | 0.00 | 0.22 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | step_limit | 1 | 35 | 0 | 35 | 0 | 665 | 17 | 92,841 | 0 | 156,160 | 6,021 | 2.2 | 0.0 | 424.3 | 424.3 | 0.00 | 0.18 | agent step budget exhausted at 35 steps |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,344 | 0 | 8,320 | 302 | 1.9 | 0.0 | 6.8 | 6.8 | 0.00 | 0.28 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,467 | 0 | 24,960 | 334 | 1.2 | 0.0 | 8.1 | 8.1 | 0.00 | 0.37 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 24 | 0 | 25 | 0 | 455 | 12 | 42,224 | 0 | 98,688 | 2,577 | 2.2 | 0.0 | 301.2 | 301.2 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,354 | 0 | 8,192 | 276 | 1.8 | 0.0 | 6.3 | 6.3 | 0.00 | 0.22 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,689 | 0 | 25,088 | 406 | 1.0 | 0.0 | 59.6 | 59.6 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | success | 1 | 17 | 1 | 18 | 0 | 257 | 8 | 11,287 | 0 | 66,688 | 2,602 | 2.5 | 0.0 | 240.5 | 240.5 | 0.00 | 0.20 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,359 | 0 | 8,192 | 282 | 1.6 | 0.0 | 59.2 | 59.2 | 0.00 | 0.22 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,595 | 0 | 25,088 | 376 | 1.1 | 0.0 | 58.8 | 58.8 | 0.00 | 0.21 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 257 | 6 | 9,496 | 0 | 43,136 | 2,357 | 2.2 | 0.0 | 233.8 | 233.8 | 0.00 | 0.22 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,361 | 0 | 8,192 | 359 | 1.3 | 0.0 | 54.6 | 54.6 | 0.00 | 0.22 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,435 | 0 | 25,088 | 367 | 0.6 | 0.0 | 60.0 | 60.0 | 0.00 | 0.23 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 17 | 0 | 18 | 0 | 291 | 8 | 10,329 | 0 | 64,128 | 1,407 | 1.2 | 0.0 | 183.6 | 183.6 | 0.00 | 0.20 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | success | 1 | 14 | 0 | 14 | 0 | 12,290 | 0 | 9,290 | 0 | 61,056 | 1,392 | 1.0 | 0.0 | 175.4 | 175.4 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 35 | 0 | 35 | 0 | 37,308 | 10 | 56,981 | 0 | 655,104 | 5,994 | 0.6 | 0.0 | 536.1 | 536.1 | 0.00 | 0.23 | agent step budget exhausted at 35 steps |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 314 | 7 | 9,944 | 0 | 46,848 | 2,114 | 1.3 | 0.0 | 231.9 | 231.9 | 0.00 | 0.18 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 12 | 0 | 12 | 0 | 13,941 | 0 | 9,616 | 0 | 55,168 | 1,273 | 0.9 | 0.0 | 121.8 | 121.8 | 0.00 | 0.21 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 31 | 0 | 32 | 0 | 36,539 | 9 | 41,765 | 0 | 569,088 | 5,066 | 0.6 | 0.0 | 360.5 | 360.5 | 0.00 | 0.20 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 348 | 8 | 13,321 | 0 | 78,976 | 4,258 | 1.2 | 0.0 | 238.3 | 238.3 | 0.00 | 0.20 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 3 | success | 1 | 12 | 0 | 13 | 0 | 9,580 | 0 | 7,501 | 0 | 48,384 | 1,453 | 0.9 | 0.0 | 121.7 | 121.7 | 0.00 | 0.17 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 24 | 0 | 25 | 0 | 81,994 | 9 | 88,761 | 0 | 652,160 | 9,972 | 0.5 | 0.0 | 424.0 | 424.0 | 0.00 | 0.20 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | success | 1 | 16 | 0 | 17 | 0 | 347 | 8 | 10,431 | 0 | 64,384 | 1,775 | 1.1 | 0.0 | 182.4 | 182.4 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,377 | 0 | 19,584 | 500 | 0.8 | 0.0 | 68.0 | 68.0 | 0.00 | 0.20 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 6,062 | 0 | 4,592 | 0 | 34,688 | 652 | 0.5 | 0.0 | 65.7 | 65.7 | 0.01 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,373 | 0 | 25,344 | 653 | 1.1 | 0.0 | 67.0 | 67.0 | 0.00 | 0.31 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,375 | 0 | 19,712 | 561 | 0.8 | 0.0 | 60.5 | 60.5 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,163 | 0 | 29,824 | 596 | 0.5 | 0.0 | 112.5 | 112.5 | 0.00 | 0.25 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,474 | 0 | 11,392 | 484 | 1.1 | 0.0 | 111.6 | 111.6 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,354 | 0 | 19,712 | 535 | 0.8 | 0.0 | 112.6 | 112.6 | 0.00 | 0.23 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,542 | 0 | 38,912 | 591 | 0.5 | 0.0 | 64.0 | 64.0 | 0.00 | 0.23 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,323 | 0 | 25,344 | 689 | 1.2 | 0.0 | 121.9 | 121.9 | 0.00 | 0.26 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 19 | 0 | 20 | 0 | 13,032 | 0 | 9,687 | 0 | 82,304 | 2,710 | 0.8 | 0.0 | 236.2 | 236.2 | 0.00 | 0.23 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 48 | 1 | 35 | 0 | 28,063 | 7 | 30,661 | 0 | 464,640 | 12,045 | 0.5 | 0.0 | 503.6 | 503.6 | 0.00 | 0.22 | agent step budget exhausted at 35 steps |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 307 | 7 | 8,698 | 0 | 47,488 | 1,019 | 1.2 | 0.0 | 132.6 | 132.6 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 16 | 0 | 13 | 0 | 10,510 | 0 | 7,455 | 0 | 45,824 | 2,492 | 0.9 | 0.0 | 130.4 | 130.4 | 0.00 | 0.21 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 26 | 0 | 27 | 0 | 24,880 | 2 | 19,175 | 0 | 253,568 | 4,702 | 0.5 | 0.0 | 368.8 | 368.8 | 0.00 | 0.20 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 309 | 7 | 8,918 | 0 | 48,640 | 1,291 | 1.1 | 0.0 | 126.8 | 126.8 | 0.00 | 0.18 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 20 | 0 | 21 | 0 | 12,309 | 0 | 9,625 | 0 | 88,320 | 1,696 | 0.8 | 0.0 | 236.3 | 236.3 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | step_limit | 1 | 35 | 0 | 35 | 0 | 35,741 | 1 | 30,952 | 0 | 450,688 | 12,555 | 0.4 | 0.0 | 484.0 | 484.0 | 0.00 | 0.24 | agent step budget exhausted at 35 steps |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 273 | 6 | 7,648 | 0 | 35,840 | 938 | 1.0 | 0.0 | 123.0 | 123.0 | 0.00 | 0.25 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,760 | 0 | 15,744 | 473 | 0.7 | 0.0 | 106.1 | 106.1 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,764 | 0 | 31,488 | 646 | 0.5 | 0.0 | 116.5 | 116.5 | 0.00 | 0.23 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 244 | 6 | 7,719 | 0 | 41,728 | 1,050 | 1.0 | 0.0 | 167.2 | 167.2 | 0.00 | 0.20 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,792 | 0 | 15,744 | 494 | 0.8 | 0.0 | 59.8 | 59.8 | 0.00 | 0.23 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,638 | 0 | 31,744 | 712 | 0.5 | 0.0 | 117.8 | 117.8 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 244 | 7 | 8,853 | 0 | 49,664 | 938 | 1.7 | 0.0 | 185.6 | 185.6 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,665 | 0 | 16,000 | 576 | 0.9 | 0.0 | 63.4 | 63.4 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,624 | 0 | 31,616 | 587 | 0.5 | 0.0 | 115.5 | 115.5 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | success | 1 | 15 | 0 | 16 | 0 | 244 | 7 | 8,843 | 0 | 49,920 | 916 | 1.2 | 0.0 | 176.1 | 176.1 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,733 | 0 | 14,720 | 446 | 0.7 | 0.0 | 58.1 | 58.1 | 0.00 | 0.19 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 16,451 | 0 | 7,143 | 0 | 28,928 | 500 | 0.5 | 0.0 | 68.8 | 68.8 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | 1 | 24 | 1 | 25 | 0 | 294 | 12 | 59,603 | 0 | 111,872 | 7,009 | 1.1 | 0.0 | 364.8 | 364.8 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected |
| `v2-list-reordered-item` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,791 | 0 | 14,720 | 518 | 0.8 | 0.0 | 67.2 | 67.2 | 0.00 | 0.18 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 7,019 | 0 | 29,056 | 624 | 0.4 | 0.0 | 61.5 | 61.5 | 0.00 | 0.18 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | step_limit | 1 | 35 | 1 | 35 | 0 | 535 | 16 | 96,708 | 0 | 209,280 | 8,835 | 1.1 | 0.0 | 333.1 | 333.1 | 0.00 | 0.16 | agent step budget exhausted at 35 steps |
| `v2-list-reordered-item` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,853 | 0 | 14,720 | 479 | 0.7 | 0.0 | 58.8 | 58.8 | 0.00 | 0.18 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 7,011 | 0 | 29,184 | 606 | 0.5 | 0.0 | 109.7 | 109.7 | 0.00 | 0.20 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | success | 1 | 30 | 0 | 31 | 0 | 487 | 14 | 77,127 | 0 | 150,912 | 9,834 | 1.1 | 0.0 | 326.0 | 326.0 | 0.00 | 0.18 | case-024 \| Select \| case-024 selected. |
| `v2-list-nested-scroll` | Mantis | 1 | success | 1 | 19 | 0 | 20 | 0 | 19,416 | 1 | 13,243 | 0 | 109,184 | 4,087 | 0.8 | 0.0 | 195.3 | 195.3 | 0.00 | 0.17 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 90 | 0 | 35 | 0 | 59,098 | 5 | 41,778 | 0 | 532,352 | 15,429 | 0.5 | 0.0 | 316.3 | 316.3 | 0.00 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 323 | 8 | 10,603 | 0 | 65,920 | 2,054 | 1.2 | 0.0 | 176.8 | 176.8 | 0.00 | 0.19 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 2 | success | 1 | 15 | 0 | 16 | 0 | 14,863 | 0 | 9,235 | 0 | 66,688 | 1,464 | 0.8 | 0.0 | 173.2 | 173.2 | 0.00 | 0.20 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 18 | 0 | 19 | 0 | 27,090 | 1 | 14,530 | 0 | 122,496 | 2,987 | 0.5 | 0.0 | 172.2 | 172.2 | 0.00 | 0.18 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | success | 1 | 16 | 0 | 17 | 0 | 336 | 8 | 10,063 | 0 | 60,800 | 1,421 | 1.1 | 0.0 | 158.9 | 158.9 | 0.00 | 0.17 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,143 | 0 | 11,520 | 468 | 1.8 | 0.0 | 8.1 | 8.1 | 0.00 | 0.29 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,379 | 0 | 7,552 | 259 | 1.2 | 0.0 | 5.9 | 5.9 | 0.00 | 0.23 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,475 | 0 | 2,304 | 245 | 2.1 | 0.0 | 6.0 | 6.0 | 0.00 | 0.24 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,602 | 0 | 9,216 | 304 | 1.8 | 0.0 | 6.6 | 6.6 | 0.00 | 0.24 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,501 | 0 | 7,424 | 217 | 1.2 | 0.0 | 4.0 | 4.0 | 0.00 | 0.25 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,092 | 0 | 11,520 | 763 | 1.7 | 0.0 | 10.4 | 10.4 | 0.00 | 0.18 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 0.5 | unknown | unknown | unknown | 0.00 | 0.00 | MCP server stdout ended during startup |
