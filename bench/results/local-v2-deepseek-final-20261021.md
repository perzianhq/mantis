# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 3; 10 runs in parallel.
- Scope: 48 tasks × 3 approaches × 3 runs = 432 logical runs; 432 recorded so far; 432 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 130 / 144 | 125 / 144 | 122 / 144 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 14 | 19 | 22 |
| Tool calls (including retries) | 1,230 | 1,421 | 2,104 |
| Sarvam API attempts (including retries) | 1,324 | 1,527 | 2,222 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 2786.5 | 3907.5 | 5307.0 |
| Sarvam limiter queue / cooldown (total, s) | 11699.3 / 0.0 | 15049.8 / 0.0 | 21385.5 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 2474.3 / 0.0 | 3416.7 / 0.0 | 4838.7 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 43 | 26 | 27 |
| Browser observation text (observed chars) | 422,100 | 1,206,192 | 45,186 |
| Browser observation images (observed blocks) | 29 | 70 | 960 |
| Normal input tokens (total) | 525,603 | 991,438 | 2,908,999 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 3,910,144 | 9,375,744 | 8,189,696 |
| Output tokens (total) | 125,506 | 205,209 | 256,644 |
| Total input tokens incl. cache (legacy) | 4,435,747 | 10,367,182 | 11,098,695 |
| MCP startup (total, s) | 115.4 | 72.6 | 158.6 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 14485.8 | 18957.3 | 26692.5 |
| CLI wall (total, s) | 14485.8 | 18957.3 | 26692.5 |
| Fixture verification (total, s) | 0.1 | 0.3 | 0.4 |
| Cleanup (total, s) | 21.9 | 22.6 | 22.1 |
| Harness capture (total, s) | 86.8 | 896.8 | 112.4 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 28.27 | 51.02 | 103.77 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,341 | 0 | 8,320 | 338 | 1.4 | 0.0 | 7.6 | 7.6 | 0.00 | 0.20 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,555 | 0 | 24,960 | 382 | 1.8 | 0.0 | 6.4 | 6.4 | 0.00 | 0.16 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 181 | 4 | 5,290 | 0 | 17,280 | 685 | 1.8 | 0.0 | 66.8 | 66.8 | 0.00 | 0.15 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,350 | 0 | 8,320 | 330 | 1.5 | 0.0 | 6.6 | 6.6 | 0.00 | 0.14 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 24,699 | 0 | 10,122 | 0 | 34,048 | 394 | 1.8 | 0.0 | 61.0 | 61.0 | 0.00 | 0.17 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 458 | 11 | 43,096 | 0 | 118,144 | 4,525 | 1.8 | 0.0 | 313.5 | 313.5 | 0.00 | 0.16 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,357 | 0 | 8,320 | 321 | 1.5 | 0.0 | 8.7 | 8.7 | 0.00 | 0.15 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 35,585 | 0 | 13,533 | 0 | 24,960 | 365 | 1.8 | 0.0 | 8.2 | 8.2 | 0.00 | 0.13 | Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | success | 1 | 24 | 0 | 25 | 0 | 455 | 12 | 42,964 | 0 | 102,016 | 2,952 | 1.8 | 0.0 | 253.4 | 253.4 | 0.00 | 0.16 | Account 058 \| Amount \| 8,742 |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,352 | 0 | 8,192 | 328 | 1.4 | 0.0 | 5.8 | 5.8 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 24,102 | 0 | 9,565 | 0 | 24,960 | 321 | 0.5 | 0.0 | 60.1 | 60.1 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | success | 1 | 15 | 0 | 16 | 0 | 257 | 7 | 9,403 | 0 | 50,304 | 1,427 | 1.2 | 0.0 | 188.5 | 188.5 | 0.00 | 0.17 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 3,163 | 0 | 2,911 | 0 | 11,648 | 650 | 0.9 | 0.0 | 64.3 | 64.3 | 0.00 | 0.14 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 23,953 | 0 | 9,838 | 0 | 34,176 | 456 | 0.5 | 0.0 | 115.1 | 115.1 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 257 | 7 | 9,068 | 0 | 50,048 | 1,263 | 1.3 | 0.0 | 177.4 | 177.4 | 0.00 | 0.16 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,354 | 0 | 8,192 | 325 | 1.0 | 0.0 | 57.8 | 57.8 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,615 | 0 | 25,088 | 371 | 0.5 | 0.0 | 61.8 | 61.8 | 0.00 | 0.15 | Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | success | 1 | 15 | 0 | 16 | 0 | 257 | 7 | 8,979 | 0 | 49,536 | 896 | 1.2 | 0.0 | 174.0 | 174.0 | 0.00 | 0.18 | Account 058 \| Owner \| Owner 17 |
| `v2-table-wide-column` | Mantis | 1 | success | 1 | 6 | 0 | 5 | 0 | 19,757 | 0 | 10,469 | 0 | 21,248 | 2,193 | 0.8 | 0.0 | 70.0 | 70.0 | 0.00 | 0.15 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 35 | 0 | 35 | 0 | 49,731 | 10 | 94,858 | 0 | 934,528 | 14,767 | 0.5 | 0.0 | 539.7 | 539.7 | 0.00 | 0.18 | agent step budget exhausted at 35 steps |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 250 | 5 | 6,815 | 0 | 26,880 | 1,233 | 1.0 | 0.0 | 170.6 | 170.6 | 0.00 | 0.15 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 12 | 0 | 13 | 0 | 19,959 | 0 | 12,874 | 0 | 93,568 | 1,843 | 0.8 | 0.0 | 119.9 | 119.9 | 0.00 | 0.17 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 28 | 0 | 29 | 0 | 35,564 | 8 | 27,677 | 0 | 500,992 | 4,529 | 0.5 | 0.0 | 298.4 | 298.4 | 0.00 | 0.18 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 313 | 7 | 8,993 | 0 | 48,896 | 1,375 | 1.1 | 0.0 | 223.8 | 223.8 | 0.00 | 0.18 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 3 | success | 1 | 11 | 0 | 11 | 0 | 12,032 | 0 | 8,245 | 0 | 44,672 | 1,030 | 0.8 | 0.0 | 118.2 | 118.2 | 0.00 | 0.16 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 17 | 0 | 18 | 0 | 79,679 | 7 | 46,563 | 0 | 468,224 | 7,380 | 0.4 | 0.0 | 408.9 | 408.9 | 0.00 | 0.22 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 315 | 7 | 9,047 | 0 | 48,640 | 1,294 | 1.2 | 0.0 | 179.4 | 179.4 | 0.00 | 0.15 | Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,394 | 0 | 19,712 | 542 | 0.9 | 0.0 | 60.7 | 60.7 | 0.00 | 0.21 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,725 | 0 | 38,912 | 665 | 0.5 | 0.0 | 117.8 | 117.8 | 0.00 | 0.21 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,133 | 0 | 25,088 | 548 | 1.1 | 0.0 | 115.9 | 115.9 | 0.00 | 0.19 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,285 | 0 | 19,456 | 430 | 0.9 | 0.0 | 63.4 | 63.4 | 0.00 | 0.17 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,593 | 0 | 39,040 | 688 | 0.5 | 0.0 | 115.8 | 115.8 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 195 | 3 | 4,216 | 0 | 15,872 | 533 | 1.1 | 0.0 | 111.0 | 111.0 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,391 | 0 | 19,712 | 481 | 0.9 | 0.0 | 63.5 | 63.5 | 0.00 | 0.14 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,488 | 0 | 39,040 | 599 | 0.5 | 0.0 | 117.9 | 117.9 | 0.00 | 0.18 | ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 199 | 3 | 4,540 | 0 | 16,000 | 596 | 1.2 | 0.0 | 113.0 | 113.0 | 0.00 | 0.15 | ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 16 | 0 | 17 | 0 | 12,173 | 0 | 8,617 | 0 | 62,464 | 1,678 | 0.8 | 0.0 | 176.1 | 176.1 | 0.00 | 0.18 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 35 | 1 | 35 | 0 | 34,729 | 2 | 33,022 | 0 | 472,576 | 13,250 | 0.5 | 0.0 | 606.7 | 606.7 | 0.00 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 239 | 5 | 6,612 | 0 | 26,240 | 951 | 1.2 | 0.0 | 70.4 | 70.4 | 0.00 | 0.15 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | 1 | 18 | 0 | 19 | 0 | 11,166 | 0 | 8,976 | 0 | 70,656 | 1,644 | 0.9 | 0.0 | 182.2 | 182.2 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | step_limit | 1 | 50 | 0 | 35 | 0 | 33,666 | 2 | 31,431 | 0 | 473,344 | 13,435 | 0.5 | 0.0 | 547.2 | 547.2 | 0.00 | 0.19 | agent step budget exhausted at 35 steps |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | success | 1 | 18 | 0 | 19 | 0 | 372 | 9 | 17,515 | 0 | 69,888 | 1,461 | 1.1 | 0.0 | 174.2 | 174.2 | 0.00 | 0.17 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 3 | success | 1 | 16 | 0 | 17 | 0 | 8,350 | 1 | 9,303 | 0 | 61,568 | 3,425 | 0.8 | 0.0 | 181.6 | 181.6 | 0.00 | 0.15 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 17 | 0 | 18 | 0 | 19,316 | 0 | 11,083 | 0 | 99,584 | 1,800 | 0.5 | 0.0 | 186.2 | 186.2 | 0.00 | 0.16 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 379 | 9 | 17,561 | 0 | 69,632 | 1,340 | 1.1 | 0.0 | 228.9 | 228.9 | 0.00 | 0.15 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,574 | 0 | 2,400 | 0 | 12,672 | 464 | 0.8 | 0.0 | 60.7 | 60.7 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,840 | 0 | 31,488 | 628 | 0.5 | 0.0 | 70.2 | 70.2 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 244 | 6 | 7,867 | 0 | 41,728 | 877 | 1.2 | 0.0 | 132.7 | 132.7 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,574 | 0 | 2,483 | 0 | 12,544 | 488 | 0.9 | 0.0 | 59.9 | 59.9 | 0.00 | 0.14 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,618 | 0 | 31,744 | 658 | 0.5 | 0.0 | 66.2 | 66.2 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | success | 1 | 15 | 0 | 16 | 0 | 244 | 7 | 8,717 | 0 | 49,792 | 864 | 1.2 | 0.0 | 181.2 | 181.2 | 0.00 | 0.16 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,690 | 0 | 16,000 | 527 | 0.8 | 0.0 | 66.9 | 66.9 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,612 | 0 | 31,744 | 689 | 0.5 | 0.0 | 68.7 | 68.7 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 244 | 6 | 7,911 | 0 | 41,600 | 872 | 1.1 | 0.0 | 171.6 | 171.6 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 6,914 | 0 | 3,786 | 0 | 14,592 | 455 | 0.9 | 0.0 | 110.2 | 110.2 | 0.00 | 0.15 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 16,451 | 0 | 7,104 | 0 | 28,928 | 547 | 0.5 | 0.0 | 106.9 | 106.9 | 0.00 | 0.15 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | 1 | 19 | 0 | 20 | 0 | 281 | 9 | 20,020 | 0 | 81,536 | 3,319 | 1.1 | 0.0 | 239.5 | 239.5 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 4,584 | 0 | 3,259 | 0 | 17,408 | 465 | 0.8 | 0.0 | 108.6 | 108.6 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 6,854 | 0 | 29,312 | 538 | 0.5 | 0.0 | 105.0 | 105.0 | 0.00 | 0.17 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 198 | 5 | 6,741 | 0 | 25,728 | 1,172 | 1.1 | 0.0 | 112.4 | 112.4 | 0.00 | 0.18 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 4,400 | 0 | 2,996 | 0 | 13,824 | 414 | 0.9 | 0.0 | 62.3 | 62.3 | 0.00 | 0.16 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 16,439 | 0 | 7,047 | 0 | 29,056 | 635 | 0.5 | 0.0 | 65.9 | 65.9 | 0.00 | 0.16 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | success | 1 | 23 | 0 | 24 | 0 | 302 | 11 | 40,615 | 0 | 102,016 | 4,107 | 1.1 | 0.0 | 295.1 | 295.1 | 0.00 | 0.14 | case-024 \| Select \| case-024 selected |
| `v2-list-nested-scroll` | Mantis | 1 | success | 1 | 18 | 0 | 19 | 0 | 16,981 | 0 | 11,117 | 0 | 91,520 | 2,608 | 0.8 | 0.0 | 190.9 | 190.9 | 0.00 | 0.13 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 17 | 0 | 18 | 0 | 30,785 | 0 | 14,030 | 0 | 118,528 | 2,133 | 0.5 | 0.0 | 186.1 | 186.1 | 0.00 | 0.14 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 270 | 6 | 7,609 | 0 | 36,352 | 1,131 | 1.2 | 0.0 | 131.6 | 131.6 | 0.00 | 0.15 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 2 | success | 1 | 18 | 1 | 12 | 0 | 15,294 | 1 | 10,390 | 0 | 54,400 | 3,436 | 0.8 | 0.0 | 124.0 | 124.0 | 0.00 | 0.17 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 28 | 0 | 23 | 0 | 41,030 | 1 | 19,857 | 0 | 211,200 | 3,998 | 0.5 | 0.0 | 301.9 | 301.9 | 0.00 | 0.32 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 269 | 6 | 7,805 | 0 | 36,608 | 1,258 | 1.1 | 0.0 | 117.9 | 117.9 | 0.00 | 0.16 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 3 | success | 1 | 16 | 1 | 17 | 0 | 12,827 | 0 | 8,978 | 0 | 75,776 | 1,759 | 0.8 | 0.0 | 185.1 | 185.1 | 0.00 | 0.14 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 21,894 | 0 | 9,787 | 0 | 66,048 | 2,029 | 0.5 | 0.0 | 176.2 | 176.2 | 0.00 | 0.15 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | success | 1 | 16 | 0 | 17 | 0 | 336 | 8 | 10,087 | 0 | 60,928 | 1,373 | 1.1 | 0.0 | 169.7 | 169.7 | 0.00 | 0.18 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,119 | 0 | 11,520 | 431 | 0.8 | 0.0 | 56.5 | 56.5 | 0.00 | 0.13 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,505 | 0 | 7,424 | 178 | 0.5 | 0.0 | 49.1 | 49.1 | 0.00 | 0.14 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,475 | 0 | 2,304 | 304 | 1.0 | 0.0 | 9.1 | 9.1 | 0.00 | 0.18 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,600 | 0 | 9,216 | 315 | 0.9 | 0.0 | 60.7 | 60.7 | 0.00 | 0.13 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,377 | 0 | 7,552 | 256 | 0.5 | 0.0 | 53.0 | 53.0 | 0.00 | 0.14 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | success | 1 | 3 | 0 | 4 | 0 | 107 | 2 | 2,901 | 0 | 3,840 | 694 | 1.0 | 0.0 | 58.6 | 58.6 | 0.00 | 0.14 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,600 | 0 | 9,216 | 340 | 0.7 | 0.0 | 60.2 | 60.2 | 0.00 | 0.14 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 1 | 4 | 0 | 3,593 | 0 | 2,402 | 0 | 10,752 | 335 | 0.5 | 0.0 | 103.6 | 103.6 | 0.00 | 0.16 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | success | 1 | 5 | 1 | 6 | 0 | 128 | 2 | 5,684 | 0 | 11,008 | 3,124 | 1.0 | 0.0 | 118.6 | 118.6 | 0.00 | 0.13 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 844 | 1 | 1,617 | 0 | 7,296 | 274 | 0.7 | 0.0 | 51.9 | 51.9 | 0.00 | 0.15 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,125 | 0 | 3,603 | 0 | 22,400 | 1,321 | 0.5 | 0.0 | 63.6 | 63.6 | 0.00 | 0.20 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 133 | 2 | 2,946 | 0 | 5,632 | 428 | 1.1 | 0.0 | 51.0 | 51.0 | 0.00 | 0.13 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 924 | 1 | 2,058 | 0 | 9,600 | 471 | 0.7 | 0.0 | 61.6 | 61.6 | 0.00 | 0.17 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 2,286 | 1 | 2,517 | 0 | 10,752 | 394 | 0.5 | 0.0 | 10.4 | 10.4 | 0.00 | 0.14 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,478 | 0 | 2,304 | 182 | 1.1 | 0.0 | 8.6 | 8.6 | 0.00 | 0.14 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,541 | 1 | 2,430 | 0 | 12,416 | 536 | 0.9 | 0.0 | 62.9 | 62.9 | 0.00 | 0.13 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,661 | 1 | 3,032 | 0 | 14,976 | 590 | 0.6 | 0.0 | 58.3 | 58.3 | 0.00 | 0.13 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,478 | 0 | 2,304 | 200 | 1.1 | 0.0 | 54.9 | 54.9 | 0.00 | 0.16 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 987 | 1 | 2,150 | 0 | 13,824 | 431 | 1.0 | 0.0 | 62.2 | 62.2 | 0.00 | 0.15 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,332 | 1 | 2,168 | 0 | 11,136 | 298 | 0.4 | 0.0 | 51.3 | 51.3 | 0.00 | 0.17 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,470 | 0 | 2,304 | 164 | 1.0 | 0.0 | 47.4 | 47.4 | 0.00 | 0.15 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 691 | 1 | 1,858 | 0 | 9,088 | 501 | 1.0 | 0.0 | 61.5 | 61.5 | 0.00 | 0.20 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,917 | 2 | 3,029 | 0 | 13,696 | 2,230 | 0.4 | 0.0 | 71.6 | 71.6 | 0.00 | 0.14 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,470 | 0 | 2,304 | 176 | 1.2 | 0.0 | 50.0 | 50.0 | 0.00 | 0.15 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 987 | 1 | 2,302 | 0 | 13,696 | 436 | 0.7 | 0.0 | 62.6 | 62.6 | 0.00 | 0.17 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,352 | 1 | 2,179 | 0 | 11,136 | 393 | 0.7 | 0.0 | 10.7 | 10.7 | 0.00 | 0.15 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,480 | 0 | 2,304 | 161 | 1.1 | 0.0 | 9.7 | 9.7 | 0.00 | 0.13 | Dock C \| min \| 17 |
| `v2-chart-responsive` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 2,149 | 0 | 9,856 | 861 | 0.9 | 0.0 | 57.7 | 57.7 | 0.00 | 0.15 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,439 | 0 | 10,624 | 527 | 0.5 | 0.0 | 57.4 | 57.4 | 0.00 | 0.19 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,474 | 0 | 2,304 | 431 | 1.2 | 0.0 | 9.6 | 9.6 | 0.00 | 0.14 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 530 | 0 | 1,015 | 0 | 5,248 | 287 | 0.8 | 0.0 | 51.4 | 51.4 | 0.00 | 0.13 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,260 | 1 | 3,241 | 0 | 14,720 | 1,078 | 0.5 | 0.0 | 59.8 | 59.8 | 0.00 | 0.14 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,466 | 0 | 2,304 | 354 | 1.1 | 0.0 | 52.3 | 52.3 | 0.00 | 0.14 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 2,392 | 0 | 9,600 | 740 | 0.8 | 0.0 | 59.9 | 59.9 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,368 | 0 | 10,624 | 498 | 0.5 | 0.0 | 54.6 | 54.6 | 0.00 | 0.14 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 134 | 2 | 2,814 | 0 | 5,760 | 720 | 1.0 | 0.0 | 55.8 | 55.8 | 0.00 | 0.14 | Bookings \| Q4 \| 147 |
| `v2-interaction-form-preferences` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,661 | 0 | 9,216 | 270 | 0.7 | 0.0 | 48.3 | 48.3 | 0.00 | 0.16 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 7 | 0 | 3,696 | 0 | 3,084 | 0 | 21,120 | 426 | 0.5 | 0.0 | 61.3 | 61.3 | 0.00 | 0.13 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | step_limit | 1 | 38 | 1 | 35 | 0 | 610 | 18 | 97,547 | 0 | 153,984 | 6,877 | 1.1 | 0.0 | 543.6 | 543.6 | 0.00 | 0.15 | agent step budget exhausted at 35 steps |
| `v2-interaction-form-preferences` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,640 | 0 | 9,216 | 259 | 0.8 | 0.0 | 57.6 | 57.6 | 0.00 | 0.13 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,496 | 0 | 17,408 | 388 | 0.4 | 0.0 | 59.2 | 59.2 | 0.00 | 0.13 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | step_limit | 1 | 38 | 0 | 35 | 0 | 643 | 17 | 92,971 | 0 | 143,360 | 6,040 | 1.1 | 0.0 | 482.3 | 482.3 | 0.00 | 0.13 | agent step budget exhausted at 35 steps |
| `v2-interaction-form-preferences` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,658 | 0 | 9,216 | 267 | 0.7 | 0.0 | 60.2 | 60.2 | 0.00 | 0.13 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,489 | 0 | 17,408 | 392 | 0.6 | 0.0 | 61.0 | 61.0 | 0.00 | 0.13 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | success | 1 | 32 | 0 | 33 | 0 | 420 | 14 | 61,698 | 0 | 147,968 | 3,199 | 1.2 | 0.0 | 419.4 | 419.4 | 0.00 | 0.13 | Saved Security alerts with weekly digest. |
| `v2-interaction-form-frame-payment` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,482 | 0 | 9,344 | 233 | 0.9 | 0.0 | 55.7 | 55.7 | 0.00 | 0.13 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,348 | 0 | 17,152 | 347 | 0.5 | 0.0 | 103.9 | 103.9 | 0.00 | 0.14 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,544 | 0 | 38,656 | 656 | 1.3 | 0.0 | 178.7 | 178.7 | 0.00 | 0.21 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,485 | 0 | 9,344 | 234 | 0.7 | 0.0 | 58.6 | 58.6 | 0.00 | 0.13 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,366 | 0 | 17,152 | 353 | 0.5 | 0.0 | 64.3 | 64.3 | 0.00 | 0.13 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 257 | 5 | 6,638 | 0 | 32,256 | 670 | 1.0 | 0.0 | 120.7 | 120.7 | 0.00 | 0.14 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,485 | 0 | 9,344 | 234 | 0.7 | 0.0 | 51.5 | 51.5 | 0.00 | 0.13 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,387 | 0 | 17,152 | 357 | 0.4 | 0.0 | 104.1 | 104.1 | 0.00 | 0.14 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 257 | 6 | 7,672 | 0 | 38,272 | 717 | 1.0 | 0.0 | 127.7 | 127.7 | 0.00 | 0.14 | Invoice PAY-482 paid with card ending 7719. |
| `v2-interaction-form-combobox` | Mantis | 1 | success | 1 | 22 | 2 | 21 | 0 | 2,552 | 1 | 7,088 | 0 | 63,872 | 2,010 | 0.7 | 0.0 | 297.9 | 297.9 | 0.00 | 0.19 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 1 | 13 | 0 | 4,036 | 0 | 5,141 | 0 | 44,800 | 1,278 | 0.4 | 0.0 | 132.4 | 132.4 | 0.00 | 0.14 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 209 | 5 | 6,250 | 0 | 25,088 | 599 | 1.0 | 0.0 | 119.6 | 119.6 | 0.00 | 0.14 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 2 | success | 1 | 9 | 0 | 10 | 0 | 1,394 | 0 | 2,890 | 0 | 21,248 | 649 | 0.7 | 0.0 | 123.5 | 123.5 | 0.00 | 0.13 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 19 | 1 | 20 | 0 | 6,498 | 2 | 9,350 | 0 | 95,872 | 1,881 | 0.4 | 0.0 | 243.1 | 243.1 | 0.00 | 0.13 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 230 | 6 | 7,504 | 0 | 35,072 | 782 | 1.1 | 0.0 | 118.5 | 118.5 | 0.00 | 0.16 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,155 | 0 | 2,878 | 0 | 18,688 | 599 | 0.7 | 0.0 | 117.4 | 117.4 | 0.00 | 0.14 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 4,180 | 0 | 5,016 | 0 | 44,928 | 995 | 0.4 | 0.0 | 171.0 | 171.0 | 0.00 | 0.16 | West Ridge assigned. |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,582 | 0 | 38,528 | 766 | 1.0 | 0.0 | 115.8 | 115.8 | 0.00 | 0.13 | West Ridge assigned. |
| `v2-interaction-form-validation-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,758 | 0 | 11,392 | 282 | 0.7 | 0.0 | 60.4 | 60.4 | 0.00 | 0.13 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,995 | 0 | 24,064 | 456 | 0.4 | 0.0 | 60.7 | 60.7 | 0.00 | 0.18 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,804 | 0 | 23,040 | 725 | 1.0 | 0.0 | 114.5 | 114.5 | 0.00 | 0.13 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,744 | 0 | 11,392 | 279 | 0.7 | 0.0 | 61.3 | 61.3 | 0.00 | 0.13 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,852 | 0 | 24,064 | 408 | 0.4 | 0.0 | 107.4 | 107.4 | 0.00 | 0.14 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 11 | 0 | 12 | 0 | 255 | 4 | 5,934 | 0 | 25,856 | 718 | 1.1 | 0.0 | 134.8 | 134.8 | 0.00 | 0.12 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 905 | 0 | 1,792 | 0 | 11,392 | 308 | 0.8 | 0.0 | 58.2 | 58.2 | 0.00 | 0.12 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,928 | 0 | 24,064 | 437 | 0.4 | 0.0 | 73.5 | 73.5 | 0.00 | 0.16 | Invite sent to ada@northwind.test. |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 276 | 5 | 7,048 | 0 | 34,688 | 841 | 1.0 | 0.0 | 183.7 | 183.7 | 0.00 | 0.13 | Invite sent to ada@northwind.test. |
| `v2-interaction-overlay-dialog` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,355 | 0 | 9,216 | 207 | 0.7 | 0.0 | 58.7 | 58.7 | 0.00 | 0.13 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,393 | 0 | 20,608 | 387 | 0.4 | 0.0 | 104.0 | 104.0 | 0.00 | 0.13 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,874 | 0 | 10,368 | 325 | 1.1 | 0.0 | 58.4 | 58.4 | 0.00 | 0.16 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,472 | 0 | 9,088 | 204 | 0.7 | 0.0 | 12.6 | 12.6 | 0.00 | 0.18 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,385 | 0 | 20,608 | 377 | 0.4 | 0.0 | 71.5 | 71.5 | 0.00 | 0.13 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,900 | 0 | 10,368 | 343 | 1.0 | 0.0 | 65.7 | 65.7 | 0.00 | 0.16 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,379 | 0 | 9,344 | 274 | 0.8 | 0.0 | 56.7 | 56.7 | 0.00 | 0.13 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,541 | 0 | 20,352 | 355 | 0.5 | 0.0 | 107.0 | 107.0 | 0.00 | 0.15 | Report exported with essential privacy. |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,936 | 0 | 10,368 | 350 | 1.0 | 0.0 | 103.3 | 103.3 | 0.00 | 0.12 | Report exported with essential privacy. |
| `v2-interaction-overlay-shadow` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,511 | 0 | 9,088 | 229 | 0.8 | 0.0 | 58.8 | 58.8 | 0.00 | 0.13 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,231 | 0 | 16,896 | 323 | 0.4 | 0.0 | 65.1 | 65.1 | 0.00 | 0.14 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 1 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,778 | 0 | 31,360 | 581 | 1.0 | 0.0 | 129.6 | 129.6 | 0.00 | 0.13 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,499 | 0 | 9,088 | 215 | 0.7 | 0.0 | 55.0 | 55.0 | 0.00 | 0.12 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,194 | 0 | 17,024 | 353 | 0.4 | 0.0 | 59.4 | 59.4 | 0.00 | 0.16 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,514 | 0 | 31,872 | 621 | 1.2 | 0.0 | 176.9 | 176.9 | 0.00 | 0.13 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,514 | 0 | 9,088 | 220 | 0.7 | 0.0 | 56.2 | 56.2 | 0.00 | 0.16 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,231 | 0 | 16,896 | 324 | 0.4 | 0.0 | 63.0 | 63.0 | 0.00 | 0.15 | Compact density applied. |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 3 | success | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,666 | 0 | 31,616 | 605 | 1.2 | 0.0 | 127.3 | 127.3 | 0.00 | 0.13 | Compact density applied. |
| `v2-interaction-overlay-modal` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,103 | 0 | 13,568 | 445 | 0.7 | 0.0 | 71.2 | 71.2 | 0.00 | 0.12 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,867 | 0 | 23,808 | 462 | 0.4 | 0.0 | 63.6 | 63.6 | 0.00 | 0.14 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | success | 1 | 23 | 0 | 20 | 0 | 380 | 8 | 10,699 | 0 | 73,856 | 1,190 | 1.0 | 0.0 | 244.6 | 244.6 | 0.00 | 0.13 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,097 | 0 | 13,568 | 349 | 0.8 | 0.0 | 114.3 | 114.3 | 0.00 | 0.13 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,833 | 0 | 23,808 | 477 | 0.5 | 0.0 | 112.2 | 112.2 | 0.00 | 0.15 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 2 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,500 | 0 | 21,760 | 491 | 1.0 | 0.0 | 164.6 | 164.6 | 0.00 | 0.15 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,621 | 0 | 2,826 | 0 | 18,816 | 503 | 0.7 | 0.0 | 70.6 | 70.6 | 0.00 | 0.15 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,817 | 0 | 23,808 | 455 | 0.4 | 0.0 | 112.7 | 112.7 | 0.00 | 0.14 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 267 | 6 | 8,106 | 0 | 40,576 | 938 | 1.0 | 0.0 | 178.7 | 178.7 | 0.00 | 0.15 | Project renamed to Aurora. |
| `v2-interaction-overlay-toast` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 582 | 0 | 1,406 | 0 | 9,088 | 205 | 0.7 | 0.0 | 57.8 | 57.8 | 0.00 | 0.14 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,548 | 0 | 20,096 | 335 | 0.4 | 0.0 | 64.3 | 64.3 | 0.00 | 0.14 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,737 | 0 | 10,496 | 328 | 1.0 | 0.0 | 64.1 | 64.1 | 0.00 | 0.14 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,763 | 0 | 11,264 | 274 | 0.7 | 0.0 | 111.0 | 111.0 | 0.00 | 0.20 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,582 | 0 | 20,096 | 352 | 0.7 | 0.0 | 110.1 | 110.1 | 0.00 | 0.13 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,865 | 0 | 10,368 | 329 | 1.0 | 0.0 | 108.4 | 108.4 | 0.00 | 0.13 | Archive undone. |
| `v2-interaction-overlay-toast` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,827 | 0 | 11,264 | 303 | 0.8 | 0.0 | 105.6 | 105.6 | 0.00 | 0.15 | Archive undone. |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,548 | 0 | 20,096 | 335 | 0.4 | 0.0 | 71.4 | 71.4 | 0.00 | 0.14 | Archive undone. |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,859 | 0 | 10,368 | 328 | 1.0 | 0.0 | 66.5 | 66.5 | 0.00 | 0.13 | Archive undone. |
| `v2-interaction-spa-client-route` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,748 | 0 | 11,392 | 223 | 0.7 | 0.0 | 61.8 | 61.8 | 0.00 | 0.16 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,643 | 0 | 20,608 | 342 | 0.4 | 0.0 | 105.5 | 105.5 | 0.00 | 0.13 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,790 | 0 | 10,368 | 304 | 1.1 | 0.0 | 58.9 | 58.9 | 0.00 | 0.13 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,748 | 0 | 11,392 | 223 | 0.8 | 0.0 | 57.7 | 57.7 | 0.00 | 0.14 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,645 | 0 | 20,608 | 342 | 0.4 | 0.0 | 115.1 | 115.1 | 0.00 | 0.28 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,852 | 0 | 10,368 | 321 | 1.0 | 0.0 | 68.4 | 68.4 | 0.00 | 0.14 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 981 | 0 | 1,748 | 0 | 11,392 | 223 | 0.8 | 0.0 | 61.2 | 61.2 | 0.00 | 0.14 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,627 | 0 | 20,608 | 338 | 0.5 | 0.0 | 63.5 | 63.5 | 0.00 | 0.13 | Mercury marked complete. |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,786 | 0 | 10,368 | 308 | 1.2 | 0.0 | 108.6 | 108.6 | 0.00 | 0.13 | Mercury marked complete. |
| `v2-interaction-spa-history-draft` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,202 | 0 | 1,765 | 0 | 11,776 | 294 | 0.8 | 0.0 | 61.7 | 61.7 | 0.00 | 0.14 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,268 | 0 | 16,896 | 365 | 0.5 | 0.0 | 61.4 | 61.4 | 0.00 | 0.13 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,070 | 0 | 12,288 | 395 | 1.2 | 0.0 | 68.1 | 68.1 | 0.00 | 0.16 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,450 | 0 | 9,472 | 250 | 0.9 | 0.0 | 57.9 | 57.9 | 0.00 | 0.15 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,224 | 0 | 16,896 | 309 | 0.4 | 0.0 | 60.6 | 60.6 | 0.00 | 0.13 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,102 | 0 | 12,160 | 356 | 1.0 | 0.0 | 112.8 | 112.8 | 0.00 | 0.12 | Release notes |
| `v2-interaction-spa-history-draft` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,413 | 0 | 9,472 | 226 | 0.7 | 0.0 | 56.9 | 56.9 | 0.00 | 0.13 | Release notes |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,240 | 0 | 16,896 | 312 | 0.7 | 0.0 | 107.9 | 107.9 | 0.00 | 0.14 | Release notes |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 4,000 | 0 | 12,288 | 358 | 1.0 | 0.0 | 110.9 | 110.9 | 0.00 | 0.12 | Release notes |
| `v2-interaction-spa-route-recovery` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,936 | 0 | 13,952 | 273 | 0.7 | 0.0 | 101.4 | 101.4 | 0.00 | 0.14 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,354 | 0 | 28,288 | 433 | 0.9 | 0.0 | 75.5 | 75.5 | 0.00 | 0.13 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,029 | 0 | 16,768 | 412 | 1.1 | 0.0 | 118.0 | 118.0 | 0.00 | 0.13 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,950 | 0 | 13,952 | 281 | 0.7 | 0.0 | 59.5 | 59.5 | 0.00 | 0.12 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,481 | 0 | 28,416 | 502 | 0.4 | 0.0 | 116.3 | 116.3 | 0.00 | 0.15 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,009 | 0 | 16,896 | 437 | 1.0 | 0.0 | 113.7 | 113.7 | 0.00 | 0.16 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 1,904 | 0 | 13,952 | 265 | 0.7 | 0.0 | 105.5 | 105.5 | 0.00 | 0.14 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,416 | 0 | 28,288 | 454 | 0.4 | 0.0 | 119.4 | 119.4 | 0.00 | 0.14 | Notification settings recovered and saved. |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 5,085 | 0 | 16,768 | 423 | 1.0 | 0.0 | 118.8 | 118.8 | 0.00 | 0.14 | Notification settings recovered and saved. |
| `v2-interaction-spa-retry-recovery` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 643 | 0 | 1,569 | 0 | 9,088 | 245 | 0.7 | 0.0 | 64.6 | 64.6 | 0.00 | 0.14 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,665 | 0 | 20,096 | 341 | 0.7 | 0.0 | 64.4 | 64.4 | 0.00 | 0.13 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,852 | 0 | 10,368 | 302 | 1.0 | 0.0 | 109.1 | 109.1 | 0.00 | 0.14 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,505 | 0 | 9,088 | 210 | 0.7 | 0.0 | 59.6 | 59.6 | 0.00 | 0.13 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,677 | 0 | 20,096 | 343 | 0.4 | 0.0 | 64.4 | 64.4 | 0.00 | 0.18 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,890 | 0 | 10,368 | 312 | 1.2 | 0.0 | 64.0 | 64.0 | 0.00 | 0.13 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 725 | 0 | 1,508 | 0 | 9,088 | 211 | 0.7 | 0.0 | 13.8 | 13.8 | 0.00 | 0.15 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,677 | 0 | 20,096 | 343 | 0.4 | 0.0 | 70.9 | 70.9 | 0.00 | 0.13 | Contacts synced after retry. |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,960 | 0 | 10,240 | 299 | 1.0 | 0.0 | 111.9 | 111.9 | 0.00 | 0.14 | Contacts synced after retry. |
| `v2-reading-landmark-jump` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,200 | 0 | 3,456 | 0 | 20,096 | 791 | 0.7 | 0.0 | 115.0 | 115.0 | 0.00 | 0.14 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 35 | 4 | 35 | 0 | 17,752 | 1 | 20,876 | 0 | 306,560 | 7,602 | 0.4 | 0.0 | 523.0 | 523.0 | 0.00 | 0.16 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | step_limit | 1 | 35 | 2 | 35 | 0 | 457 | 14 | 80,956 | 0 | 196,096 | 6,968 | 1.0 | 0.0 | 422.6 | 422.6 | 0.00 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Mantis | 2 | step_limit | 1 | 35 | 5 | 35 | 0 | 5,858 | 2 | 14,362 | 0 | 174,720 | 5,631 | 0.8 | 0.0 | 421.9 | 421.9 | 0.00 | 0.14 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 31 | 0 | 27 | 0 | 19,688 | 1 | 20,305 | 0 | 255,488 | 7,499 | 0.5 | 0.0 | 370.8 | 370.8 | 0.00 | 0.15 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | step_limit | 1 | 35 | 1 | 35 | 0 | 686 | 15 | 90,719 | 0 | 199,424 | 8,137 | 1.2 | 0.0 | 440.8 | 440.8 | 0.00 | 0.13 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Mantis | 3 | step_limit | 1 | 39 | 3 | 35 | 0 | 7,351 | 1 | 15,629 | 0 | 175,744 | 6,729 | 0.7 | 0.0 | 417.6 | 417.6 | 0.00 | 0.14 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 3 | step_limit | 1 | 35 | 2 | 35 | 0 | 18,153 | 3 | 23,051 | 0 | 314,752 | 8,488 | 0.5 | 0.0 | 419.8 | 419.8 | 0.00 | 0.15 | agent step budget exhausted at 35 steps |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 3 | step_limit | 1 | 35 | 2 | 35 | 0 | 895 | 13 | 72,861 | 0 | 211,456 | 9,846 | 1.0 | 0.0 | 462.9 | 462.9 | 0.40 | 0.13 | agent step budget exhausted at 35 steps |
| `v2-reading-deep-fact` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,574 | 0 | 2,443 | 0 | 16,640 | 433 | 0.7 | 0.0 | 64.4 | 64.4 | 0.00 | 0.16 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,261 | 0 | 33,280 | 608 | 0.4 | 0.0 | 116.7 | 116.7 | 0.00 | 0.14 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 1 | success | 1 | 30 | 1 | 31 | 0 | 499 | 14 | 69,368 | 0 | 151,936 | 4,257 | 1.0 | 0.0 | 354.1 | 354.1 | 0.00 | 0.13 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 2 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 1,574 | 0 | 2,563 | 0 | 16,512 | 413 | 0.7 | 0.0 | 61.6 | 61.6 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,100 | 0 | 33,408 | 606 | 0.4 | 0.0 | 112.3 | 112.3 | 0.00 | 0.18 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 2 | success | 1 | 17 | 0 | 18 | 0 | 298 | 8 | 10,527 | 0 | 69,888 | 1,581 | 1.0 | 0.0 | 181.3 | 181.3 | 0.00 | 0.14 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,961 | 0 | 2,885 | 0 | 19,584 | 526 | 0.7 | 0.0 | 61.6 | 61.6 | 0.00 | 0.13 | Appendix clause 31: Cinder-693 |
| `v2-reading-deep-fact` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 4,592 | 0 | 4,162 | 0 | 33,280 | 611 | 0.4 | 0.0 | 110.6 | 110.6 | 0.00 | 0.13 | answer did not match the expected result |
| `v2-reading-deep-fact` | Screenshots (click by x,y) | 3 | success | 1 | 15 | 0 | 16 | 0 | 291 | 7 | 8,980 | 0 | 53,120 | 1,076 | 1.0 | 0.0 | 177.7 | 177.7 | 0.00 | 0.13 | Appendix clause 31: Cinder-693 |
| `v2-reading-cross-region` | Mantis | 1 | success | 1 | 21 | 2 | 18 | 0 | 2,704 | 1 | 9,614 | 0 | 64,640 | 4,944 | 0.7 | 0.0 | 243.9 | 243.9 | 0.00 | 0.15 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 10 | 0 | 11 | 0 | 4,947 | 1 | 5,861 | 0 | 41,472 | 1,326 | 0.4 | 0.0 | 126.5 | 126.5 | 0.00 | 0.13 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 1 | success | 1 | 26 | 1 | 27 | 0 | 619 | 11 | 43,246 | 0 | 126,208 | 4,102 | 1.0 | 0.0 | 303.2 | 303.2 | 0.00 | 0.14 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 2 | success | 1 | 16 | 2 | 17 | 0 | 2,494 | 1 | 6,036 | 0 | 48,256 | 1,594 | 0.7 | 0.0 | 170.2 | 170.2 | 0.00 | 0.18 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 2 | step_limit | 1 | 35 | 2 | 35 | 0 | 16,909 | 1 | 22,632 | 0 | 351,872 | 9,209 | 0.5 | 0.0 | 540.1 | 540.1 | 0.00 | 0.16 | agent step budget exhausted at 35 steps |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 260 | 6 | 7,867 | 0 | 40,832 | 999 | 1.0 | 0.0 | 136.5 | 136.5 | 0.00 | 0.12 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Mantis | 3 | success | 1 | 17 | 1 | 16 | 0 | 2,756 | 0 | 5,425 | 0 | 43,264 | 1,514 | 0.8 | 0.0 | 191.0 | 191.0 | 0.00 | 0.15 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 11 | 0 | 12 | 0 | 5,339 | 1 | 6,118 | 0 | 46,592 | 1,368 | 0.4 | 0.0 | 124.0 | 124.0 | 0.00 | 0.14 | Delivery region: Aster-862 |
| `v2-reading-cross-region` | Screenshots (click by x,y) | 3 | success | 1 | 29 | 2 | 30 | 0 | 838 | 12 | 74,570 | 0 | 206,208 | 9,056 | 1.0 | 0.0 | 372.2 | 372.2 | 0.00 | 0.13 | Delivery region: Aster-862 |
| `v2-reading-collapsed-context` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,995 | 0 | 2,764 | 0 | 19,456 | 457 | 0.7 | 0.0 | 62.3 | 62.3 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 4,163 | 0 | 33,152 | 667 | 0.4 | 0.0 | 74.0 | 74.0 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 1 | success | 1 | 24 | 1 | 25 | 0 | 525 | 10 | 36,059 | 0 | 134,400 | 4,987 | 1.1 | 0.0 | 350.4 | 350.4 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 1,995 | 0 | 2,876 | 0 | 19,840 | 579 | 0.8 | 0.0 | 106.8 | 106.8 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 3,863 | 0 | 33,280 | 610 | 0.4 | 0.0 | 119.7 | 119.7 | 0.00 | 0.14 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 2 | success | 1 | 34 | 2 | 35 | 0 | 680 | 15 | 108,274 | 0 | 224,000 | 9,493 | 1.0 | 0.0 | 539.1 | 539.1 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 1,995 | 0 | 2,827 | 0 | 19,456 | 464 | 0.7 | 0.0 | 67.6 | 67.6 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 4,392 | 0 | 3,855 | 0 | 33,280 | 612 | 0.7 | 0.0 | 113.8 | 113.8 | 0.00 | 0.14 | Expanded retained context: Dune-119 |
| `v2-reading-collapsed-context` | Screenshots (click by x,y) | 3 | success | 1 | 15 | 0 | 16 | 0 | 296 | 7 | 9,443 | 0 | 55,040 | 1,391 | 1.0 | 0.0 | 177.1 | 177.1 | 0.00 | 0.13 | Expanded retained context: Dune-119 |
| `v2-workflow-multi-step-order` | Mantis | 1 | success | 1 | 13 | 0 | 14 | 0 | 2,550 | 0 | 4,214 | 0 | 33,152 | 689 | 0.7 | 0.0 | 127.2 | 127.2 | 0.00 | 0.14 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 14 | 0 | 15 | 0 | 6,670 | 0 | 6,339 | 0 | 56,192 | 851 | 0.4 | 0.0 | 176.5 | 176.5 | 0.00 | 0.14 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 1 | success | 1 | 28 | 0 | 29 | 0 | 400 | 13 | 47,341 | 0 | 115,328 | 1,743 | 1.0 | 0.0 | 293.2 | 293.2 | 0.00 | 0.13 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 2 | success | 1 | 14 | 0 | 15 | 0 | 2,810 | 0 | 4,621 | 0 | 36,096 | 688 | 0.7 | 0.0 | 119.3 | 119.3 | 0.00 | 0.14 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 14 | 0 | 15 | 0 | 6,670 | 0 | 6,043 | 0 | 56,960 | 913 | 0.4 | 0.0 | 175.3 | 175.3 | 0.00 | 0.13 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 2 | success | 1 | 37 | 0 | 38 | 0 | 494 | 17 | 78,572 | 0 | 165,888 | 2,441 | 1.0 | 0.0 | 474.7 | 474.7 | 0.00 | 0.14 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Mantis | 3 | success | 1 | 12 | 0 | 13 | 0 | 2,191 | 0 | 4,005 | 0 | 29,696 | 663 | 0.8 | 0.0 | 168.7 | 168.7 | 0.00 | 0.14 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 17 | 0 | 18 | 0 | 8,131 | 3 | 9,346 | 0 | 89,728 | 1,057 | 0.4 | 0.0 | 229.1 | 229.1 | 0.00 | 0.15 | Receipt: Cinder-127 |
| `v2-workflow-multi-step-order` | Screenshots (click by x,y) | 3 | success | 1 | 44 | 1 | 45 | 0 | 509 | 20 | 113,295 | 0 | 227,456 | 3,868 | 1.0 | 0.0 | 596.7 | 596.7 | 0.00 | 0.14 | Receipt: Cinder-127 |
| `v2-workflow-cross-page-compare` | Mantis | 1 | success | 1 | 12 | 0 | 13 | 0 | 3,689 | 0 | 4,201 | 0 | 32,256 | 594 | 0.7 | 0.0 | 162.7 | 162.7 | 0.00 | 0.16 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 14 | 0 | 15 | 0 | 7,469 | 0 | 5,930 | 0 | 57,344 | 902 | 0.4 | 0.0 | 179.7 | 179.7 | 0.00 | 0.16 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 0 | 15 | 0 | 257 | 7 | 8,722 | 0 | 45,568 | 1,052 | 1.0 | 0.0 | 182.4 | 182.4 | 0.00 | 0.13 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 2 | success | 1 | 14 | 0 | 15 | 0 | 4,279 | 0 | 5,190 | 0 | 39,552 | 1,170 | 0.7 | 0.0 | 131.1 | 131.1 | 0.00 | 0.13 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 13 | 0 | 14 | 0 | 6,718 | 0 | 5,569 | 0 | 51,584 | 758 | 0.4 | 0.0 | 179.3 | 179.3 | 0.00 | 0.14 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 2 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,606 | 0 | 45,568 | 810 | 1.0 | 0.0 | 181.1 | 181.1 | 0.00 | 0.13 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Mantis | 3 | success | 1 | 13 | 0 | 14 | 0 | 3,972 | 0 | 4,602 | 0 | 35,584 | 732 | 0.7 | 0.0 | 128.1 | 128.1 | 0.00 | 0.14 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 15 | 0 | 16 | 0 | 7,956 | 1 | 7,725 | 0 | 63,104 | 1,097 | 0.4 | 0.0 | 187.7 | 187.7 | 0.00 | 0.16 | Receipt: Aster-301 |
| `v2-workflow-cross-page-compare` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 15 | 0 | 256 | 7 | 8,314 | 0 | 45,568 | 737 | 1.0 | 0.0 | 181.4 | 181.4 | 0.00 | 0.14 | Receipt: Aster-301 |
| `v2-workflow-save-resume` | Mantis | 1 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,715 | 0 | 27,904 | 539 | 0.7 | 0.0 | 121.7 | 121.7 | 0.00 | 0.14 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,732 | 0 | 40,832 | 628 | 0.4 | 0.0 | 166.9 | 166.9 | 0.00 | 0.13 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,547 | 0 | 36,736 | 661 | 1.0 | 0.0 | 172.0 | 172.0 | 0.00 | 0.14 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,836 | 0 | 3,714 | 0 | 27,904 | 538 | 0.7 | 0.0 | 124.7 | 124.7 | 0.00 | 0.14 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,707 | 0 | 40,832 | 603 | 0.4 | 0.0 | 172.3 | 172.3 | 0.00 | 0.15 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 2 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,466 | 0 | 37,248 | 755 | 1.1 | 0.0 | 179.9 | 179.9 | 0.00 | 0.17 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Mantis | 3 | success | 1 | 10 | 0 | 11 | 0 | 2,557 | 0 | 3,514 | 0 | 24,320 | 431 | 0.7 | 0.0 | 115.0 | 115.0 | 0.00 | 0.13 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 11 | 0 | 12 | 0 | 5,076 | 0 | 4,588 | 0 | 40,832 | 613 | 0.4 | 0.0 | 163.1 | 163.1 | 0.00 | 0.14 | Receipt: Ember-583 |
| `v2-workflow-save-resume` | Screenshots (click by x,y) | 3 | success | 1 | 13 | 0 | 14 | 0 | 246 | 6 | 7,546 | 0 | 36,992 | 728 | 1.0 | 0.0 | 129.2 | 129.2 | 0.00 | 0.14 | Receipt: Ember-583 |
| `v2-workflow-conditional-branch` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 1,208 | 0 | 2,593 | 0 | 17,920 | 389 | 0.7 | 0.0 | 112.4 | 112.4 | 0.00 | 0.14 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,295 | 0 | 47,104 | 728 | 0.6 | 0.0 | 175.4 | 175.4 | 0.00 | 0.13 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 1 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,479 | 0 | 97,792 | 1,327 | 1.1 | 0.0 | 299.0 | 299.0 | 0.00 | 0.15 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 2 | success | 1 | 11 | 0 | 12 | 0 | 2,123 | 0 | 3,658 | 0 | 26,496 | 521 | 0.7 | 0.0 | 117.0 | 117.0 | 0.00 | 0.13 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,400 | 0 | 46,848 | 728 | 0.4 | 0.0 | 173.9 | 173.9 | 0.00 | 0.15 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,657 | 0 | 97,536 | 1,335 | 1.0 | 0.0 | 297.0 | 297.0 | 0.00 | 0.20 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 2,123 | 0 | 3,649 | 0 | 26,624 | 531 | 0.7 | 0.0 | 177.6 | 177.6 | 0.00 | 0.13 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 12 | 0 | 13 | 0 | 6,131 | 0 | 5,237 | 0 | 47,104 | 770 | 0.4 | 0.0 | 134.1 | 134.1 | 0.00 | 0.13 | Receipt: Ember-356 |
| `v2-workflow-conditional-branch` | Screenshots (click by x,y) | 3 | success | 1 | 24 | 0 | 25 | 0 | 369 | 11 | 31,613 | 0 | 97,408 | 1,289 | 1.0 | 0.0 | 249.0 | 249.0 | 0.00 | 0.16 | Receipt: Ember-356 |
| `v2-heldout-extra-table-grouped-total` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,402 | 0 | 1,561 | 0 | 9,472 | 225 | 0.7 | 0.0 | 52.8 | 52.8 | 0.00 | 0.13 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,762 | 0 | 3,258 | 0 | 21,504 | 360 | 0.4 | 0.0 | 68.0 | 68.0 | 0.00 | 0.14 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 190 | 3 | 3,874 | 0 | 10,368 | 311 | 1.0 | 0.0 | 115.3 | 115.3 | 0.00 | 0.20 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,402 | 0 | 1,596 | 0 | 9,472 | 236 | 0.7 | 0.0 | 59.8 | 59.8 | 0.00 | 0.13 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 4,762 | 0 | 3,172 | 0 | 21,632 | 390 | 0.4 | 0.0 | 107.1 | 107.1 | 0.00 | 0.17 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 190 | 3 | 3,520 | 0 | 10,752 | 323 | 1.0 | 0.0 | 58.3 | 58.3 | 0.00 | 0.13 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,402 | 0 | 1,590 | 0 | 9,472 | 265 | 0.7 | 0.0 | 59.3 | 59.3 | 0.00 | 0.14 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 4,762 | 0 | 3,118 | 0 | 21,632 | 369 | 0.4 | 0.0 | 62.4 | 62.4 | 0.00 | 0.14 | Coastal total: $478. |
| `v2-heldout-extra-table-grouped-total` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 190 | 3 | 3,790 | 0 | 10,496 | 333 | 1.0 | 0.0 | 104.1 | 104.1 | 0.00 | 0.15 | Coastal total: $478. |
| `v2-heldout-extra-table-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,725 | 0 | 1,962 | 0 | 11,904 | 291 | 0.7 | 0.0 | 57.7 | 57.7 | 0.00 | 0.12 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,779 | 0 | 3,430 | 0 | 21,632 | 420 | 0.4 | 0.0 | 103.9 | 103.9 | 0.00 | 0.17 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,915 | 0 | 10,496 | 408 | 1.2 | 0.0 | 74.9 | 74.9 | 0.00 | 0.22 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,725 | 0 | 2,084 | 0 | 11,776 | 327 | 0.9 | 0.0 | 62.5 | 62.5 | 0.00 | 0.19 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 4,779 | 0 | 3,324 | 0 | 21,632 | 401 | 0.5 | 0.0 | 61.4 | 61.4 | 0.00 | 0.15 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,899 | 0 | 10,624 | 423 | 1.0 | 0.0 | 110.3 | 110.3 | 0.00 | 0.17 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,725 | 0 | 2,035 | 0 | 11,904 | 325 | 0.7 | 0.0 | 109.4 | 109.4 | 0.00 | 0.17 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 4,779 | 0 | 3,450 | 0 | 21,632 | 456 | 0.4 | 0.0 | 113.4 | 113.4 | 0.00 | 0.16 | Record RQ-361 repaired. |
| `v2-heldout-extra-table-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,981 | 0 | 10,496 | 406 | 1.1 | 0.0 | 68.2 | 68.2 | 0.00 | 0.23 | Record RQ-361 repaired. |
| `v2-heldout-extra-list-offscreen-action` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 6,942 | 0 | 4,092 | 0 | 23,808 | 449 | 1.0 | 0.0 | 69.5 | 69.5 | 0.00 | 0.20 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 13,873 | 0 | 4,960 | 0 | 16,768 | 274 | 0.6 | 0.0 | 64.5 | 64.5 | 0.00 | 0.17 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 270 | 5 | 6,601 | 0 | 26,368 | 834 | 1.1 | 0.0 | 120.8 | 120.8 | 0.00 | 0.17 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Mantis | 2 | success | 1 | 9 | 0 | 10 | 0 | 7,061 | 0 | 4,296 | 0 | 26,752 | 507 | 1.0 | 0.0 | 119.3 | 119.3 | 0.00 | 0.18 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 13,873 | 0 | 5,038 | 0 | 16,768 | 325 | 0.5 | 0.0 | 58.0 | 58.0 | 0.00 | 0.18 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Screenshots (click by x,y) | 2 | success | 1 | 20 | 0 | 21 | 0 | 438 | 10 | 25,276 | 0 | 79,360 | 1,479 | 1.2 | 0.0 | 243.3 | 243.3 | 0.00 | 0.19 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 6,973 | 0 | 4,279 | 0 | 27,008 | 570 | 0.9 | 0.0 | 75.0 | 75.0 | 0.00 | 0.22 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 13,873 | 0 | 4,948 | 0 | 16,768 | 271 | 0.5 | 0.0 | 57.3 | 57.3 | 0.00 | 0.14 | alert-086 marked as read. |
| `v2-heldout-extra-list-offscreen-action` | Screenshots (click by x,y) | 3 | success | 1 | 18 | 0 | 19 | 0 | 404 | 9 | 17,581 | 0 | 69,888 | 1,357 | 1.5 | 0.0 | 237.6 | 237.6 | 0.00 | 0.17 | alert-086 marked as read. |
| `v2-heldout-extra-list-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 4,087 | 0 | 2,738 | 0 | 14,080 | 322 | 1.1 | 0.0 | 63.8 | 63.8 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 12,273 | 0 | 6,046 | 0 | 33,536 | 470 | 0.6 | 0.0 | 67.2 | 67.2 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 20 | 0 | 21 | 0 | 331 | 9 | 17,161 | 0 | 76,928 | 1,062 | 1.1 | 0.0 | 243.8 | 243.8 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 4,087 | 0 | 2,689 | 0 | 14,080 | 311 | 0.8 | 0.0 | 106.6 | 106.6 | 0.00 | 0.18 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 12,273 | 0 | 5,969 | 0 | 33,536 | 447 | 0.4 | 0.0 | 78.0 | 78.0 | 0.00 | 0.18 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 29 | 0 | 30 | 0 | 415 | 14 | 65,057 | 0 | 118,912 | 5,910 | 1.1 | 0.0 | 419.0 | 419.0 | 0.00 | 0.14 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 4,087 | 0 | 2,732 | 0 | 14,080 | 320 | 0.8 | 0.0 | 64.4 | 64.4 | 0.00 | 0.17 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 12,273 | 0 | 5,985 | 0 | 33,536 | 444 | 0.5 | 0.0 | 105.3 | 105.3 | 0.00 | 0.16 | case-050 selected from refreshed results. |
| `v2-heldout-extra-list-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 17 | 0 | 18 | 0 | 290 | 8 | 9,946 | 0 | 62,592 | 887 | 1.3 | 0.0 | 232.0 | 232.0 | 0.00 | 0.14 | case-050 selected from refreshed results. |
| `v2-heldout-extra-chart-legend-filter` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,520 | 0 | 2,062 | 0 | 11,776 | 347 | 0.8 | 0.0 | 56.6 | 56.6 | 0.00 | 0.17 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,486 | 0 | 3,001 | 0 | 20,864 | 404 | 0.5 | 0.0 | 61.2 | 61.2 | 0.00 | 0.15 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 21 | 1 | 22 | 0 | 450 | 10 | 40,597 | 0 | 120,064 | 6,924 | 1.1 | 0.0 | 301.0 | 301.0 | 0.00 | 0.21 | fixture check failed (18 observations) |
| `v2-heldout-extra-chart-legend-filter` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,520 | 0 | 2,047 | 0 | 11,776 | 343 | 0.8 | 0.0 | 60.9 | 60.9 | 0.00 | 0.19 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,486 | 0 | 3,013 | 0 | 20,864 | 400 | 0.5 | 0.0 | 113.3 | 113.3 | 0.00 | 0.21 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 12 | 0 | 13 | 0 | 246 | 6 | 9,208 | 0 | 40,320 | 2,557 | 1.3 | 0.0 | 138.8 | 138.8 | 0.00 | 0.16 | fixture check failed (11 observations) |
| `v2-heldout-extra-chart-legend-filter` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,520 | 0 | 2,049 | 0 | 11,776 | 347 | 0.8 | 0.0 | 61.5 | 61.5 | 0.00 | 0.20 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,486 | 0 | 3,035 | 0 | 20,864 | 401 | 0.5 | 0.0 | 108.9 | 108.9 | 0.00 | 0.16 | North April selected: 52 units. |
| `v2-heldout-extra-chart-legend-filter` | Screenshots (click by x,y) | 3 | step_limit | 1 | 35 | 1 | 35 | 0 | 566 | 17 | 134,734 | 0 | 249,472 | 13,246 | 1.3 | 0.0 | 537.0 | 537.0 | 0.00 | 0.19 | agent step budget exhausted at 35 steps |
| `v2-heldout-extra-chart-recovery` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,872 | 0 | 2,006 | 0 | 11,904 | 318 | 0.8 | 0.0 | 64.3 | 64.3 | 0.00 | 0.19 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,480 | 0 | 2,902 | 0 | 20,864 | 409 | 0.5 | 0.0 | 64.9 | 64.9 | 0.00 | 0.15 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 180 | 4 | 5,382 | 0 | 13,568 | 952 | 1.2 | 0.0 | 105.7 | 105.7 | 0.00 | 0.15 | fixture check failed (5 observations) |
| `v2-heldout-extra-chart-recovery` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,872 | 0 | 2,111 | 0 | 11,776 | 275 | 0.9 | 0.0 | 102.5 | 102.5 | 0.00 | 0.14 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,480 | 0 | 2,858 | 0 | 20,864 | 390 | 0.4 | 0.0 | 70.8 | 70.8 | 0.00 | 0.17 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 180 | 3 | 3,927 | 0 | 10,368 | 429 | 1.1 | 0.0 | 64.9 | 64.9 | 0.00 | 0.14 | fixture check failed (5 observations) |
| `v2-heldout-extra-chart-recovery` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,872 | 0 | 2,004 | 0 | 11,904 | 287 | 0.8 | 0.0 | 53.3 | 53.3 | 0.00 | 0.17 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,480 | 0 | 2,790 | 0 | 20,864 | 367 | 0.5 | 0.0 | 61.5 | 61.5 | 0.00 | 0.17 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-chart-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 21 | 1 | 22 | 0 | 421 | 10 | 29,814 | 0 | 97,024 | 3,116 | 1.1 | 0.0 | 294.2 | 294.2 | 0.00 | 0.15 | West Wednesday selected: 46 ms. |
| `v2-heldout-extra-form-date-range` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,116 | 0 | 1,635 | 0 | 9,472 | 289 | 1.0 | 0.0 | 59.1 | 59.1 | 0.00 | 0.16 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,520 | 0 | 2,381 | 0 | 17,152 | 415 | 0.4 | 0.0 | 60.8 | 60.8 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Screenshots (click by x,y) | 1 | success | 1 | 26 | 0 | 27 | 0 | 388 | 12 | 49,492 | 0 | 118,656 | 3,678 | 1.1 | 0.0 | 308.9 | 308.9 | 0.00 | 0.26 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,116 | 0 | 1,609 | 0 | 9,472 | 261 | 0.7 | 0.0 | 59.1 | 59.1 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,520 | 0 | 2,339 | 0 | 17,152 | 398 | 0.4 | 0.0 | 58.5 | 58.5 | 0.00 | 0.19 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Screenshots (click by x,y) | 2 | success | 1 | 20 | 0 | 17 | 0 | 380 | 6 | 9,477 | 0 | 55,936 | 1,794 | 1.0 | 0.0 | 227.6 | 227.6 | 0.00 | 0.15 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,116 | 0 | 1,577 | 0 | 9,472 | 250 | 0.8 | 0.0 | 29.3 | 29.3 | 0.00 | 0.16 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,520 | 0 | 2,411 | 0 | 17,024 | 376 | 0.4 | 0.0 | 59.4 | 59.4 | 0.00 | 0.17 | Reserved 2027-03-12 through 2027-09-18. |
| `v2-heldout-extra-form-date-range` | Screenshots (click by x,y) | 3 | step_limit | 1 | 35 | 0 | 35 | 0 | 530 | 13 | 50,719 | 0 | 173,824 | 4,248 | 1.3 | 0.0 | 473.3 | 473.3 | 0.00 | 0.18 | agent step budget exhausted at 35 steps |
| `v2-heldout-extra-form-custom-toggle` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,127 | 0 | 1,492 | 0 | 9,344 | 241 | 0.9 | 0.0 | 51.3 | 51.3 | 0.00 | 0.15 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,432 | 0 | 2,709 | 0 | 20,864 | 360 | 0.5 | 0.0 | 103.9 | 103.9 | 0.00 | 0.16 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 181 | 3 | 3,920 | 0 | 10,368 | 339 | 1.1 | 0.0 | 91.4 | 91.4 | 0.00 | 0.13 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,546 | 0 | 1,946 | 0 | 11,776 | 330 | 0.7 | 0.0 | 60.7 | 60.7 | 0.00 | 0.15 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 3,432 | 0 | 2,740 | 0 | 20,864 | 364 | 0.5 | 0.0 | 67.1 | 67.1 | 0.00 | 0.15 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 181 | 3 | 3,960 | 0 | 10,368 | 352 | 1.0 | 0.0 | 60.5 | 60.5 | 0.00 | 0.14 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,127 | 0 | 1,499 | 0 | 9,344 | 250 | 0.7 | 0.0 | 16.9 | 16.9 | 0.00 | 0.14 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 3,432 | 0 | 2,731 | 0 | 20,864 | 361 | 0.7 | 0.0 | 64.3 | 64.3 | 0.00 | 0.14 | Pager notifications enabled. |
| `v2-heldout-extra-form-custom-toggle` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 181 | 3 | 3,898 | 0 | 10,368 | 336 | 1.0 | 0.0 | 63.6 | 63.6 | 0.00 | 0.15 | Pager notifications enabled. |
| `v2-heldout-extra-overlay-focus-trap` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,636 | 0 | 2,036 | 0 | 14,208 | 325 | 0.7 | 0.0 | 59.3 | 59.3 | 0.00 | 0.14 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 3,263 | 0 | 3,026 | 0 | 24,576 | 445 | 0.4 | 0.0 | 63.7 | 63.7 | 0.00 | 0.14 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 448 | 4 | 5,686 | 0 | 22,272 | 605 | 1.0 | 0.0 | 158.9 | 158.9 | 0.00 | 0.17 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,486 | 0 | 2,007 | 0 | 14,208 | 369 | 1.1 | 0.0 | 61.2 | 61.2 | 0.00 | 0.15 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 3,263 | 0 | 3,059 | 0 | 24,576 | 456 | 0.5 | 0.0 | 64.4 | 64.4 | 0.00 | 0.15 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Screenshots (click by x,y) | 2 | success | 1 | 9 | 0 | 10 | 0 | 217 | 4 | 5,221 | 0 | 19,584 | 472 | 1.0 | 0.0 | 117.5 | 117.5 | 0.00 | 0.18 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,201 | 0 | 1,873 | 0 | 11,520 | 310 | 0.7 | 0.0 | 57.2 | 57.2 | 0.00 | 0.15 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 3,263 | 0 | 3,035 | 0 | 24,576 | 446 | 0.4 | 0.0 | 105.2 | 105.2 | 0.00 | 0.16 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-focus-trap` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 448 | 4 | 5,789 | 0 | 22,016 | 568 | 1.1 | 0.0 | 159.9 | 159.9 | 0.00 | 0.18 | Workspace archived with code AR-641. |
| `v2-heldout-extra-overlay-recovery` | Mantis | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,314 | 0 | 2,907 | 0 | 19,584 | 484 | 0.7 | 0.0 | 111.5 | 111.5 | 0.00 | 0.13 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 4,389 | 0 | 3,983 | 0 | 29,056 | 571 | 0.4 | 0.0 | 120.9 | 120.9 | 0.00 | 0.13 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Screenshots (click by x,y) | 1 | success | 1 | 8 | 0 | 9 | 0 | 205 | 4 | 5,227 | 0 | 17,024 | 514 | 1.4 | 0.0 | 112.2 | 112.2 | 0.00 | 0.14 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,314 | 0 | 2,870 | 0 | 19,968 | 546 | 0.9 | 0.0 | 116.2 | 116.2 | 0.00 | 0.14 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 4,389 | 0 | 3,657 | 0 | 29,056 | 512 | 0.5 | 0.0 | 74.3 | 74.3 | 0.00 | 0.14 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 205 | 4 | 5,067 | 0 | 17,024 | 476 | 1.1 | 0.0 | 74.9 | 74.9 | 0.00 | 0.13 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Mantis | 3 | success | 1 | 8 | 0 | 9 | 0 | 2,314 | 0 | 2,972 | 0 | 19,840 | 538 | 0.9 | 0.0 | 115.5 | 115.5 | 0.00 | 0.15 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 4,389 | 0 | 3,599 | 0 | 28,928 | 518 | 0.5 | 0.0 | 118.9 | 118.9 | 0.00 | 0.19 | Release notes pinned from current actions. |
| `v2-heldout-extra-overlay-recovery` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 205 | 4 | 5,071 | 0 | 17,280 | 532 | 1.0 | 0.0 | 73.6 | 73.6 | 0.00 | 0.14 | Release notes pinned from current actions. |
| `v2-heldout-extra-spa-stale-target` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,277 | 0 | 1,844 | 0 | 11,776 | 322 | 0.7 | 0.0 | 63.3 | 63.3 | 0.00 | 0.15 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,955 | 0 | 2,768 | 0 | 20,608 | 370 | 0.4 | 0.0 | 117.5 | 117.5 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Screenshots (click by x,y) | 1 | success | 1 | 14 | 1 | 15 | 0 | 238 | 7 | 9,507 | 0 | 50,688 | 1,619 | 1.0 | 0.0 | 172.2 | 172.2 | 0.00 | 0.19 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,579 | 0 | 2,267 | 0 | 14,208 | 357 | 0.7 | 0.0 | 63.2 | 63.2 | 0.00 | 0.17 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,955 | 0 | 2,814 | 0 | 20,736 | 459 | 0.6 | 0.0 | 107.5 | 107.5 | 0.00 | 0.17 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Screenshots (click by x,y) | 2 | success | 1 | 12 | 0 | 13 | 0 | 238 | 6 | 8,085 | 0 | 35,584 | 1,246 | 1.0 | 0.0 | 176.6 | 176.6 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,579 | 0 | 2,204 | 0 | 14,208 | 336 | 0.7 | 0.0 | 65.7 | 65.7 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,955 | 0 | 2,889 | 0 | 20,608 | 433 | 0.4 | 0.0 | 65.9 | 65.9 | 0.00 | 0.17 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-stale-target` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 7 | 0 | 176 | 3 | 3,969 | 0 | 10,368 | 346 | 1.2 | 0.0 | 108.8 | 108.8 | 0.00 | 0.16 | Current report downloaded after remount. |
| `v2-heldout-extra-spa-error-boundary` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 1,714 | 0 | 2,410 | 0 | 16,512 | 349 | 0.9 | 0.0 | 106.2 | 106.2 | 0.00 | 0.17 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 3,873 | 0 | 3,505 | 0 | 28,544 | 439 | 0.6 | 0.0 | 109.0 | 109.0 | 0.00 | 0.17 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Screenshots (click by x,y) | 1 | success | 1 | 16 | 0 | 17 | 0 | 265 | 8 | 10,300 | 0 | 60,160 | 1,113 | 1.1 | 0.0 | 193.0 | 193.0 | 0.00 | 0.17 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Mantis | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,085 | 0 | 2,665 | 0 | 19,456 | 393 | 0.8 | 0.0 | 113.2 | 113.2 | 0.00 | 0.16 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 3,873 | 0 | 3,581 | 0 | 28,416 | 431 | 0.5 | 0.0 | 111.8 | 111.8 | 0.00 | 0.18 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 453 | 13 | 47,740 | 0 | 95,104 | 1,892 | 1.1 | 0.0 | 297.8 | 297.8 | 0.00 | 0.18 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,103 | 0 | 1,715 | 0 | 11,520 | 263 | 0.8 | 0.0 | 64.5 | 64.5 | 0.00 | 0.18 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 3,873 | 0 | 3,473 | 0 | 28,544 | 434 | 0.9 | 0.0 | 112.4 | 112.4 | 0.00 | 0.18 | Contacts imported after recovery. |
| `v2-heldout-extra-spa-error-boundary` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 209 | 4 | 4,970 | 0 | 17,024 | 435 | 1.2 | 0.0 | 70.3 | 70.3 | 0.00 | 0.16 | Contacts imported after recovery. |
| `v2-heldout-reading-sticky-context` | Mantis | 1 | wrong_answer | 1 | 22 | 2 | 21 | 0 | 2,534 | 2 | 8,693 | 0 | 69,376 | 3,192 | 0.8 | 0.0 | 248.9 | 248.9 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 35 | 3 | 35 | 0 | 13,327 | 2 | 22,578 | 0 | 314,368 | 10,423 | 0.5 | 0.0 | 548.0 | 548.0 | 0.00 | 0.19 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 1 | step_limit | 1 | 35 | 1 | 35 | 0 | 851 | 16 | 86,547 | 0 | 187,264 | 6,320 | 1.2 | 0.0 | 462.9 | 462.9 | 0.00 | 0.15 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-sticky-context` | Mantis | 2 | step_limit | 1 | 46 | 7 | 35 | 0 | 5,393 | 2 | 17,289 | 0 | 196,736 | 8,331 | 0.8 | 0.0 | 471.3 | 471.3 | 0.00 | 0.14 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 30 | 1 | 31 | 0 | 12,066 | 5 | 20,205 | 0 | 242,688 | 6,518 | 0.5 | 0.0 | 363.7 | 363.7 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 2 | step_limit | 1 | 35 | 1 | 35 | 0 | 580 | 16 | 75,625 | 0 | 176,384 | 4,937 | 1.2 | 0.0 | 427.4 | 427.4 | 0.00 | 0.16 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-sticky-context` | Mantis | 3 | step_limit | 1 | 35 | 4 | 35 | 0 | 4,379 | 2 | 13,080 | 0 | 157,568 | 4,690 | 0.8 | 0.0 | 414.0 | 414.0 | 0.00 | 0.14 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 3 | step_limit | 1 | 35 | 2 | 35 | 0 | 13,029 | 3 | 22,972 | 0 | 325,632 | 10,313 | 0.5 | 0.0 | 443.5 | 443.5 | 0.00 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 3 | step_limit | 1 | 35 | 1 | 35 | 0 | 956 | 15 | 79,292 | 0 | 177,792 | 5,704 | 1.1 | 0.0 | 356.5 | 356.5 | 0.00 | 0.16 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Mantis | 1 | step_limit | 1 | 35 | 6 | 35 | 0 | 4,652 | 1 | 13,962 | 0 | 169,600 | 5,785 | 0.8 | 0.0 | 368.7 | 368.7 | 0.00 | 0.18 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,786 | 1 | 3,787 | 0 | 25,472 | 659 | 0.4 | 0.0 | 103.0 | 103.0 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 1 | step_limit | 1 | 35 | 2 | 35 | 0 | 1,029 | 13 | 74,186 | 0 | 211,840 | 7,198 | 1.0 | 0.0 | 423.8 | 423.8 | 0.00 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Mantis | 2 | step_limit | 1 | 35 | 3 | 35 | 0 | 5,264 | 2 | 14,537 | 0 | 175,232 | 5,403 | 0.7 | 0.0 | 363.1 | 363.1 | 0.10 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 28 | 4 | 29 | 0 | 10,180 | 1 | 15,373 | 0 | 199,040 | 5,170 | 0.4 | 0.0 | 367.0 | 367.0 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 2 | step_limit | 1 | 35 | 2 | 35 | 0 | 1,355 | 15 | 85,565 | 0 | 213,504 | 8,200 | 1.3 | 0.0 | 425.3 | 425.3 | 0.00 | 0.18 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Mantis | 3 | step_limit | 1 | 37 | 3 | 35 | 0 | 5,085 | 2 | 15,696 | 0 | 173,440 | 7,304 | 0.7 | 0.0 | 427.7 | 427.7 | 0.00 | 0.17 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 3 | step_limit | 1 | 35 | 4 | 35 | 0 | 14,920 | 1 | 21,886 | 0 | 304,000 | 9,472 | 0.4 | 0.0 | 479.4 | 479.4 | 0.25 | 0.19 | agent step budget exhausted at 35 steps |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 34 | 1 | 35 | 0 | 1,475 | 15 | 82,392 | 0 | 185,344 | 5,242 | 1.0 | 0.0 | 463.5 | 463.5 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Mantis | 1 | success | 1 | 6 | 0 | 6 | 0 | 1,224 | 0 | 1,804 | 0 | 11,776 | 332 | 0.8 | 0.0 | 55.1 | 55.1 | 0.00 | 0.17 | Receipt: Ember-614 |
| `v2-heldout-workflow-review-submit` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,207 | 0 | 2,203 | 0 | 16,896 | 349 | 0.4 | 0.0 | 51.4 | 51.4 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 224 | 3 | 4,302 | 0 | 14,336 | 429 | 1.4 | 0.0 | 107.0 | 107.0 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Mantis | 2 | wrong_answer | 1 | 5 | 0 | 5 | 0 | 946 | 0 | 1,453 | 0 | 9,472 | 279 | 0.8 | 0.0 | 55.8 | 55.8 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,694 | 1 | 3,530 | 0 | 22,912 | 578 | 0.5 | 0.0 | 100.6 | 100.6 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 226 | 3 | 4,370 | 0 | 14,208 | 409 | 1.1 | 0.0 | 109.2 | 109.2 | 0.00 | 0.22 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,231 | 0 | 1,817 | 0 | 11,648 | 306 | 0.8 | 0.0 | 61.8 | 61.8 | 0.00 | 0.16 | Receipt: Ember-614 |
| `v2-heldout-workflow-review-submit` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,207 | 0 | 2,206 | 0 | 16,896 | 350 | 0.5 | 0.0 | 13.6 | 13.6 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-heldout-workflow-review-submit` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 226 | 3 | 4,302 | 0 | 14,336 | 424 | 1.1 | 0.0 | 111.2 | 111.2 | 0.00 | 0.17 | Receipt: Ember-614 |
| `v2-heldout-workflow-recovery` | Mantis | 1 | wrong_answer | 1 | 17 | 1 | 18 | 0 | 2,632 | 1 | 6,178 | 0 | 48,768 | 1,484 | 0.8 | 0.0 | 179.4 | 179.4 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 3,513 | 0 | 3,458 | 0 | 27,776 | 496 | 0.5 | 0.0 | 71.3 | 71.3 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 191 | 4 | 5,008 | 0 | 16,896 | 477 | 1.1 | 0.0 | 71.0 | 71.0 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Mantis | 2 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 1,437 | 0 | 2,330 | 0 | 16,128 | 356 | 0.8 | 0.0 | 64.8 | 64.8 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 4,487 | 2 | 5,658 | 0 | 38,400 | 598 | 0.5 | 0.0 | 116.7 | 116.7 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 191 | 4 | 5,124 | 0 | 16,768 | 437 | 1.1 | 0.0 | 115.8 | 115.8 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Mantis | 3 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 1,708 | 0 | 2,582 | 0 | 18,560 | 433 | 0.8 | 0.0 | 108.5 | 108.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 4,020 | 1 | 4,611 | 0 | 33,536 | 611 | 0.8 | 0.0 | 109.9 | 109.9 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-heldout-workflow-recovery` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 191 | 4 | 5,106 | 0 | 16,768 | 470 | 1.1 | 0.0 | 106.0 | 106.0 | 0.00 | 0.15 | answer did not match the expected result |
