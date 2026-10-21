# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 131 recorded so far; 131 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 33 / 44 | 37 / 44 | 22 / 43 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 11 | 7 | 21 |
| Tool calls (including retries) | 277 | 343 | 679 |
| Sarvam API attempts (including retries) | 325 | 402 | 754 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1272.1 | 2029.9 | 5677.4 |
| Sarvam limiter queue / cooldown (total, s) | 2475.4 / 0.0 | 2752.5 / 0.0 | 5822.4 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 1190.1 / 45.7 | 1942.0 / 56.4 | 5449.4 / 127.9 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 2 | 0 | 0 |
| Browser observation text (observed chars) | 227,591 | 548,962 | 11,821 |
| Browser observation images (observed blocks) | 6 | 28 | 280 |
| Normal input tokens (total) | 190,947 | 310,262 | 954,227 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 1,163,008 | 2,589,312 | 2,729,984 |
| Output tokens (total) | 59,797 | 48,009 | 93,023 |
| Total input tokens incl. cache (legacy) | 1,353,955 | 2,899,574 | 3,684,211 |
| MCP startup (total, s) | 37.4 | 23.1 | 49.8 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 3793.2 | 4838.9 | 11627.8 |
| CLI wall (total, s) | 3793.2 | 4838.9 | 11627.8 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.1 |
| Cleanup (total, s) | 8.0 | 8.4 | 7.8 |
| Harness capture (total, s) | 21.5 | 230.1 | 38.3 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 11.63 | 14.09 | 34.99 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,459 | 0 | 8,064 | 374 | 1.4 | 0.0 | 11.0 | 11.0 | 0.00 | 0.15 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 39,460 | 0 | 14,980 | 0 | 34,048 | 446 | 1.0 | 0.0 | 64.8 | 64.8 | 0.00 | 0.25 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 26 | 0 | 32 | 0 | 612 | 11 | 50,045 | 0 | 137,728 | 6,733 | 1.7 | 0.0 | 708.2 | 708.2 | 0.00 | 0.16 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,428 | 0 | 7,936 | 258 | 1.4 | 0.0 | 7.7 | 7.7 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 9,991 | 0 | 34,048 | 450 | 1.1 | 0.0 | 64.5 | 64.5 | 0.00 | 0.21 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 40 | 0 | 583 | 13 | 57,816 | 0 | 210,944 | 6,395 | 1.7 | 0.0 | 829.7 | 829.7 | 0.00 | 0.17 | sarvam CLI returned an error result |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,460 | 0 | 7,936 | 290 | 1.4 | 0.0 | 8.4 | 8.4 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,102 | 0 | 33,920 | 436 | 1.0 | 0.0 | 8.6 | 8.6 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 9 | 0 | 10 | 0 | 177 | 4 | 6,057 | 0 | 20,224 | 1,598 | 1.7 | 0.0 | 124.6 | 124.6 | 0.00 | 0.18 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,421 | 0 | 7,936 | 377 | 1.5 | 0.0 | 10.3 | 10.3 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,703 | 0 | 24,832 | 366 | 0.6 | 0.0 | 64.3 | 64.3 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 40 | 0 | 420 | 15 | 66,977 | 0 | 162,432 | 4,512 | 1.1 | 0.0 | 746.6 | 746.6 | 0.00 | 0.16 | sarvam CLI returned an error result |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,243 | 0 | 8,064 | 276 | 0.8 | 0.0 | 56.7 | 56.7 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,563 | 0 | 24,960 | 345 | 0.6 | 0.0 | 62.4 | 62.4 | 0.00 | 0.19 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | cli_error | 1 | 35 | 0 | 38 | 0 | 622 | 14 | 66,228 | 0 | 193,408 | 6,314 | 1.2 | 0.0 | 819.4 | 819.4 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,293 | 0 | 8,064 | 310 | 1.0 | 0.0 | 6.2 | 6.2 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 20,872 | 0 | 8,673 | 0 | 34,176 | 554 | 0.6 | 0.0 | 60.6 | 60.6 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 21 | 0 | 23 | 0 | 306 | 9 | 17,983 | 0 | 80,384 | 1,592 | 1.3 | 0.0 | 525.6 | 525.6 | 0.00 | 0.23 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 7,676 | 0 | 5,756 | 0 | 29,312 | 672 | 0.8 | 0.0 | 114.6 | 114.6 | 0.00 | 0.18 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 17 | 0 | 26 | 0 | 33,738 | 6 | 21,780 | 0 | 263,424 | 3,009 | 0.4 | 0.0 | 466.1 | 466.1 | 0.00 | 0.19 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | cli_error | 1 | 35 | 0 | 37 | 0 | 395 | 15 | 81,091 | 0 | 196,096 | 7,136 | 1.1 | 0.0 | 777.7 | 777.7 | 0.00 | 0.17 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 19,703 | 0 | 10,795 | 0 | 27,136 | 1,017 | 0.8 | 0.0 | 64.0 | 64.0 | 0.00 | 0.17 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 17 | 0 | 23 | 0 | 33,351 | 5 | 21,264 | 0 | 268,928 | 3,347 | 0.5 | 0.0 | 589.2 | 589.2 | 0.00 | 0.16 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | timeout | 1 | 32 | 0 | 33 | 0 | 371 | 15 | 82,378 | 0 | 151,296 | 5,364 | 1.0 | 0.0 | 894.6 | 894.6 | 0.00 | 0.21 | active-work timed out after 600s |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 9 | 0 | 11 | 0 | 14,811 | 0 | 8,929 | 0 | 33,664 | 1,228 | 0.8 | 0.0 | 302.2 | 302.2 | 0.00 | 0.17 | fixture check failed (21 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 30,587 | 1 | 12,547 | 0 | 33,536 | 742 | 0.4 | 0.0 | 43.9 | 43.9 | 0.00 | 0.16 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 36 | 0 | 395 | 16 | 94,284 | 0 | 175,872 | 6,840 | 1.1 | 0.0 | 686.5 | 686.5 | 0.09 | 0.17 | sarvam CLI returned an error result |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,441 | 0 | 19,200 | 472 | 0.8 | 0.0 | 78.5 | 78.5 | 0.00 | 0.16 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,280 | 0 | 29,568 | 660 | 0.5 | 0.0 | 52.0 | 52.0 | 0.00 | 0.21 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 195 | 2 | 3,542 | 0 | 9,728 | 568 | 1.0 | 0.0 | 57.0 | 57.0 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,960 | 0 | 4,387 | 0 | 19,200 | 507 | 0.8 | 0.0 | 30.7 | 30.7 | 0.00 | 0.23 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,505 | 0 | 38,400 | 588 | 0.6 | 0.0 | 27.0 | 27.0 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 195 | 2 | 3,298 | 0 | 9,856 | 534 | 1.1 | 0.0 | 30.6 | 30.6 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,583 | 0 | 19,200 | 604 | 0.7 | 0.0 | 46.9 | 46.9 | 0.00 | 0.16 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,512 | 0 | 38,912 | 698 | 0.5 | 0.0 | 68.9 | 68.9 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,217 | 0 | 22,912 | 641 | 1.3 | 0.0 | 106.4 | 106.4 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 12 | 0 | 13 | 0 | 8,635 | 0 | 6,054 | 0 | 38,400 | 965 | 0.7 | 0.0 | 110.6 | 110.6 | 0.00 | 0.16 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 34 | 0 | 36 | 0 | 35,115 | 1 | 24,173 | 0 | 388,992 | 5,461 | 0.4 | 0.0 | 475.0 | 475.0 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 25 | 0 | 16 | 0 | 392 | 7 | 10,185 | 0 | 52,096 | 2,309 | 1.0 | 0.0 | 163.6 | 163.6 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | cli_error | 1 | 37 | 2 | 35 | 0 | 34,886 | 1 | 47,838 | 0 | 400,640 | 35,224 | 0.7 | 0.0 | 627.8 | 627.8 | 0.00 | 0.16 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 23 | 0 | 24 | 0 | 22,137 | 0 | 13,429 | 0 | 149,760 | 2,347 | 0.4 | 0.0 | 198.1 | 198.1 | 0.00 | 0.19 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 29 | 0 | 30 | 0 | 415 | 9 | 21,637 | 0 | 138,752 | 2,496 | 1.0 | 0.0 | 411.8 | 411.8 | 0.00 | 0.16 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 17 | 0 | 14 | 0 | 11,845 | 0 | 8,120 | 0 | 54,272 | 1,442 | 0.7 | 0.0 | 183.1 | 183.1 | 0.00 | 0.20 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 21 | 0 | 22 | 0 | 24,617 | 0 | 13,816 | 0 | 145,152 | 2,507 | 0.5 | 0.0 | 272.5 | 272.5 | 0.00 | 0.19 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 25 | 0 | 16 | 0 | 392 | 7 | 9,520 | 0 | 49,664 | 1,679 | 1.0 | 0.0 | 314.0 | 314.0 | 0.00 | 0.21 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,574 | 0 | 2,426 | 0 | 12,288 | 517 | 0.7 | 0.0 | 57.5 | 57.5 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,758 | 0 | 31,104 | 724 | 0.5 | 0.0 | 108.8 | 108.8 | 0.00 | 0.21 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 20 | 0 | 283 | 8 | 10,367 | 0 | 65,152 | 1,303 | 1.0 | 0.0 | 336.0 | 336.0 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,885 | 0 | 15,360 | 587 | 0.7 | 0.0 | 74.5 | 74.5 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,604 | 0 | 31,232 | 613 | 0.5 | 0.0 | 77.1 | 77.1 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 9,845 | 0 | 65,152 | 1,378 | 1.2 | 0.0 | 247.8 | 247.8 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,574 | 0 | 2,436 | 0 | 12,416 | 590 | 0.8 | 0.0 | 36.6 | 36.6 | 0.00 | 0.17 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,608 | 0 | 31,360 | 661 | 0.4 | 0.0 | 61.8 | 61.8 | 0.00 | 0.19 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 283 | 8 | 9,963 | 0 | 64,896 | 1,169 | 1.1 | 0.0 | 167.9 | 167.9 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,791 | 0 | 14,208 | 420 | 0.7 | 0.0 | 68.1 | 68.1 | 0.00 | 0.16 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 7,151 | 0 | 28,672 | 696 | 0.6 | 0.0 | 64.6 | 64.6 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 25 | 0 | 26 | 0 | 304 | 12 | 53,358 | 0 | 109,824 | 5,834 | 1.2 | 0.0 | 365.6 | 365.6 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-list-reordered-item` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,748 | 0 | 14,464 | 517 | 0.7 | 0.0 | 63.5 | 63.5 | 0.00 | 0.16 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 16,926 | 1 | 8,356 | 0 | 36,992 | 1,095 | 0.4 | 0.0 | 93.5 | 93.5 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 211 | 7 | 9,806 | 0 | 42,240 | 2,719 | 1.1 | 0.0 | 123.9 | 123.9 | 0.00 | 0.15 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,691 | 0 | 14,336 | 992 | 0.8 | 0.0 | 88.9 | 88.9 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,961 | 0 | 29,184 | 904 | 0.4 | 0.0 | 54.7 | 54.7 | 0.00 | 0.16 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | cli_error | 1 | 35 | 0 | 35 | 0 | 607 | 16 | 94,051 | 0 | 164,992 | 7,073 | 1.0 | 0.0 | 392.2 | 392.2 | 0.00 | 0.21 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Mantis | 1 | success | 1 | 18 | 0 | 19 | 0 | 15,110 | 0 | 10,839 | 0 | 88,576 | 2,665 | 0.7 | 0.0 | 225.4 | 225.4 | 0.00 | 0.20 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 13 | 0 | 14 | 0 | 26,149 | 0 | 11,215 | 0 | 82,048 | 1,888 | 0.4 | 0.0 | 173.6 | 173.6 | 0.00 | 0.18 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 31 | 0 | 32 | 0 | 403 | 12 | 51,875 | 0 | 155,520 | 4,501 | 1.1 | 0.0 | 327.5 | 327.5 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-list-nested-scroll` | Mantis | 2 | success | 1 | 16 | 0 | 17 | 0 | 16,892 | 0 | 9,990 | 0 | 78,720 | 1,795 | 0.8 | 0.0 | 193.1 | 193.1 | 0.00 | 0.20 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 40 | 0 | 35 | 0 | 30,705 | 6 | 31,472 | 0 | 481,024 | 12,162 | 0.4 | 0.0 | 524.9 | 524.9 | 0.00 | 0.20 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 29 | 0 | 30 | 0 | 386 | 11 | 37,151 | 0 | 129,536 | 2,860 | 1.1 | 0.0 | 386.1 | 386.1 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-list-nested-scroll` | Mantis | 3 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 16,871 | 0 | 9,906 | 0 | 76,928 | 2,294 | 0.7 | 0.0 | 215.1 | 215.1 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 14 | 0 | 15 | 0 | 21,992 | 0 | 9,951 | 0 | 76,288 | 1,417 | 0.4 | 0.0 | 172.7 | 172.7 | 0.00 | 0.20 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 30 | 0 | 31 | 0 | 389 | 12 | 44,666 | 0 | 141,824 | 3,748 | 1.0 | 0.0 | 366.4 | 366.4 | 0.00 | 0.18 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,137 | 0 | 11,136 | 446 | 0.7 | 0.0 | 71.0 | 71.0 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,387 | 0 | 7,424 | 180 | 0.5 | 0.0 | 21.8 | 21.8 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,445 | 0 | 1,664 | 179 | 1.1 | 0.0 | 47.3 | 47.3 | 0.00 | 0.18 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 4 | 0 | 4 | 0 | 992 | 0 | 1,177 | 0 | 7,168 | 250 | 0.8 | 0.0 | 29.3 | 29.3 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,255 | 0 | 7,552 | 197 | 0.5 | 0.0 | 53.7 | 53.7 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | success | 1 | 3 | 0 | 4 | 0 | 107 | 2 | 2,413 | 0 | 3,072 | 462 | 1.1 | 0.0 | 30.7 | 30.7 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,444 | 0 | 9,088 | 282 | 0.8 | 0.0 | 39.9 | 39.9 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,258 | 0 | 7,552 | 321 | 0.5 | 0.0 | 16.1 | 16.1 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,451 | 0 | 1,664 | 222 | 1.3 | 0.0 | 42.2 | 42.2 | 0.00 | 0.19 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 667 | 0 | 713 | 0 | 3,200 | 143 | 0.8 | 0.0 | 46.9 | 46.9 | 0.00 | 0.19 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 2,286 | 1 | 2,391 | 0 | 10,624 | 279 | 0.5 | 0.0 | 42.7 | 42.7 | 0.00 | 0.19 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,458 | 0 | 1,664 | 174 | 1.1 | 0.0 | 30.0 | 30.0 | 0.00 | 0.20 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 824 | 0 | 888 | 0 | 5,248 | 180 | 0.8 | 0.0 | 22.4 | 22.4 | 0.00 | 0.22 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,169 | 0 | 7,552 | 255 | 0.5 | 0.0 | 19.9 | 19.9 | 0.00 | 0.21 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,462 | 0 | 1,664 | 184 | 1.2 | 0.0 | 22.3 | 22.3 | 0.00 | 0.23 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 824 | 0 | 897 | 0 | 5,248 | 194 | 0.8 | 0.0 | 29.4 | 29.4 | 0.00 | 0.20 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 2,286 | 1 | 2,392 | 0 | 10,624 | 283 | 0.5 | 0.0 | 55.8 | 55.8 | 0.00 | 0.19 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,458 | 0 | 1,664 | 155 | 1.3 | 0.0 | 46.5 | 46.5 | 0.00 | 0.20 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 691 | 1 | 1,967 | 0 | 10,880 | 378 | 0.9 | 0.0 | 86.7 | 86.7 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 913 | 1 | 1,590 | 0 | 7,552 | 205 | 0.6 | 0.0 | 49.4 | 49.4 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,454 | 0 | 1,664 | 177 | 1.1 | 0.0 | 37.0 | 37.0 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-chart-image-fact` | Mantis | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 691 | 1 | 1,846 | 0 | 11,008 | 379 | 0.8 | 0.0 | 51.2 | 51.2 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 913 | 1 | 1,590 | 0 | 7,552 | 207 | 0.5 | 0.0 | 24.4 | 24.4 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,464 | 0 | 1,664 | 204 | 1.1 | 0.0 | 42.0 | 42.0 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-chart-image-fact` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,540 | 0 | 9,088 | 391 | 0.8 | 0.0 | 32.8 | 32.8 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 933 | 1 | 1,613 | 0 | 7,552 | 278 | 0.5 | 0.0 | 21.6 | 21.6 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,454 | 0 | 1,664 | 177 | 1.1 | 0.0 | 20.9 | 20.9 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-chart-responsive` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 1,944 | 0 | 9,472 | 467 | 0.8 | 0.0 | 58.8 | 58.8 | 0.00 | 0.18 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,303 | 0 | 10,496 | 377 | 0.5 | 0.0 | 43.5 | 43.5 | 0.00 | 0.21 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,435 | 0 | 1,664 | 212 | 1.1 | 0.0 | 35.5 | 35.5 | 0.00 | 0.19 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 530 | 0 | 822 | 0 | 5,248 | 236 | 0.8 | 0.0 | 39.8 | 39.8 | 0.00 | 0.19 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,435 | 0 | 10,496 | 492 | 0.5 | 0.0 | 55.1 | 55.1 | 0.00 | 0.18 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 135 | 2 | 3,053 | 0 | 4,864 | 774 | 1.2 | 0.0 | 59.5 | 59.5 | 0.00 | 0.18 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 530 | 0 | 783 | 0 | 5,248 | 263 | 1.0 | 0.0 | 29.2 | 29.2 | 0.00 | 0.24 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,280 | 0 | 10,496 | 357 | 0.5 | 0.0 | 40.3 | 40.3 | 0.00 | 0.18 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,435 | 0 | 1,664 | 359 | 1.1 | 0.0 | 19.3 | 19.3 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Mantis | 1 | success | 1 | 4 | 0 | 4 | 0 | 631 | 0 | 1,395 | 0 | 6,784 | 252 | 0.9 | 0.0 | 46.8 | 46.8 | 0.00 | 0.18 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,489 | 0 | 17,152 | 386 | 0.5 | 0.0 | 57.7 | 57.7 | 0.00 | 0.22 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | cli_error | 1 | 16 | 0 | 22 | 0 | 313 | 6 | 8,120 | 0 | 45,056 | 986 | 1.2 | 0.0 | 267.1 | 267.1 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-interaction-form-preferences` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,650 | 0 | 8,960 | 292 | 0.9 | 0.0 | 57.4 | 57.4 | 0.00 | 0.18 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,392 | 0 | 17,280 | 396 | 0.5 | 0.0 | 62.4 | 62.4 | 0.00 | 0.19 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | cli_error | 1 | 15 | 0 | 21 | 0 | 292 | 6 | 7,997 | 0 | 40,704 | 1,127 | 1.1 | 0.0 | 226.8 | 226.8 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-interaction-form-preferences` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,595 | 0 | 8,960 | 260 | 0.8 | 0.0 | 38.3 | 38.3 | 0.00 | 0.20 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,397 | 0 | 17,280 | 388 | 0.5 | 0.0 | 95.0 | 95.0 | 0.00 | 0.20 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | cli_error | 1 | 13 | 0 | 19 | 0 | 279 | 5 | 6,855 | 0 | 30,080 | 858 | 1.1 | 0.0 | 215.0 | 215.0 | 0.00 | 0.18 | sarvam CLI returned an error result |
| `v2-interaction-form-frame-payment` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,482 | 0 | 9,088 | 264 | 0.9 | 0.0 | 57.1 | 57.1 | 0.00 | 0.20 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,248 | 0 | 17,024 | 350 | 0.7 | 0.0 | 56.6 | 56.6 | 0.00 | 0.22 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | cli_error | 1 | 10 | 0 | 16 | 0 | 227 | 5 | 5,215 | 0 | 18,816 | 538 | 1.1 | 0.0 | 183.8 | 183.8 | 0.00 | 0.17 | sarvam CLI returned an error result |
| `v2-interaction-form-frame-payment` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,694 | 0 | 8,960 | 294 | 0.8 | 0.0 | 66.5 | 66.5 | 0.00 | 0.18 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,181 | 0 | 17,152 | 370 | 0.5 | 0.0 | 58.2 | 58.2 | 0.00 | 0.23 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | cli_error | 1 | 9 | 0 | 15 | 0 | 227 | 4 | 4,986 | 0 | 15,104 | 547 | 1.1 | 0.0 | 179.2 | 179.2 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-interaction-form-frame-payment` | Mantis | 3 | cli_error | 1 | 3 | 0 | 9 | 0 | 570 | 0 | 833 | 0 | 5,120 | 206 | 0.8 | 0.0 | 143.6 | 143.6 | 0.00 | 0.19 | sarvam CLI returned an error result |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,246 | 0 | 17,024 | 346 | 0.5 | 0.0 | 58.7 | 58.7 | 0.00 | 0.17 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | cli_error | 1 | 5 | 0 | 11 | 0 | 185 | 2 | 2,548 | 0 | 4,608 | 301 | 1.1 | 0.0 | 133.9 | 133.9 | 0.00 | 0.16 | sarvam CLI returned an error result |
| `v2-interaction-form-combobox` | Mantis | 1 | cli_error | 1 | 4 | 0 | 10 | 0 | 689 | 0 | 1,221 | 0 | 6,784 | 227 | 0.8 | 0.0 | 128.1 | 128.1 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | cli_error | 1 | 4 | 0 | 10 | 0 | 1,608 | 0 | 1,252 | 0 | 10,368 | 226 | 0.5 | 0.0 | 117.8 | 117.8 | 0.00 | 0.18 | sarvam CLI returned an error result |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | cli_error | 1 | 1 | 0 | 7 | 0 | 133 | 0 | 184 | 0 | 512 | 91 | 1.1 | 0.0 | 79.0 | 79.0 | 0.00 | 0.16 | sarvam CLI returned an error result |
| `v2-interaction-form-combobox` | Mantis | 2 | cli_error | 1 | 0 | 0 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.7 | 0.0 | 36.4 | 36.4 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | cli_error | 1 | 0 | 0 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.5 | 0.0 | 39.0 | 39.0 | 0.00 | 0.14 | sarvam CLI returned an error result |
