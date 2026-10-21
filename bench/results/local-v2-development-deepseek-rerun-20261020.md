# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 207 recorded so far; 207 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 16 / 68 | 17 / 70 | 13 / 69 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 52 | 53 | 56 |
| Tool calls (including retries) | 1,348 | 944 | 1,949 |
| Sarvam API attempts (including retries) | 1,176 | 1,015 | 1,810 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 8040.8 | 7446.2 | 9467.1 |
| Sarvam limiter queue / cooldown (total, s) | 6104.2 / 0.0 | 5831.7 / 0.0 | 11626.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 7423.9 / 0.0 | 7124.9 / 0.0 | 8881.2 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 104 | 37 | 11 |
| Browser observation text (observed chars) | 778,925 | 963,784 | 39,804 |
| Browser observation images (observed blocks) | 64 | 53 | 719 |
| Normal input tokens (total) | 1,489,100 | 1,577,527 | 7,541,256 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 25,430,400 | 18,908,928 | 20,068,608 |
| Output tokens (total) | 1,024,875 | 1,003,122 | 1,142,637 |
| Total input tokens incl. cache (legacy) | 26,919,500 | 20,486,455 | 27,609,864 |
| MCP startup (total, s) | 52.9 | 32.8 | 77.4 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 14145.0 | 13278.0 | 21093.2 |
| CLI wall (total, s) | 14145.0 | 13278.0 | 21093.2 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 10.8 | 11.7 | 11.0 |
| Harness capture (total, s) | 73.3 | 580.6 | 93.1 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 157.55 | 154.22 | 318.54 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,447 | 0 | 7,936 | 317 | 1.3 | 0.0 | 7.3 | 7.3 | 0.00 | 0.16 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 33,598 | 0 | 13,501 | 0 | 34,048 | 457 | 0.9 | 0.0 | 63.6 | 63.6 | 0.00 | 0.22 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | success | 1 | 13 | 0 | 14 | 0 | 199 | 6 | 8,918 | 0 | 41,472 | 2,339 | 1.6 | 0.0 | 155.8 | 155.8 | 0.00 | 0.14 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 3,277 | 0 | 2,481 | 0 | 10,880 | 349 | 1.4 | 0.0 | 60.6 | 60.6 | 0.00 | 0.14 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 25,027 | 0 | 10,341 | 0 | 34,048 | 555 | 0.9 | 0.0 | 34.5 | 34.5 | 0.00 | 0.15 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | success | 1 | 33 | 0 | 34 | 0 | 527 | 15 | 87,812 | 0 | 181,248 | 6,464 | 1.6 | 0.0 | 373.3 | 373.3 | 0.00 | 0.15 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,373 | 0 | 7,936 | 254 | 1.3 | 0.0 | 10.1 | 10.1 | 0.00 | 0.15 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 33,598 | 0 | 13,647 | 0 | 34,048 | 466 | 1.0 | 0.0 | 62.8 | 62.8 | 0.00 | 0.17 | ANSWER: Account 058 \| Amount \| 8,742 |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 67 | 1 | 71 | 0 | 1,562 | 27 | 610,152 | 0 | 1,557,376 | 70,323 | 1.6 | 0.0 | 1202.8 | 1202.8 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-table-filtered-cell` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,342 | 0 | 7,936 | 341 | 1.3 | 0.0 | 10.4 | 10.4 | 0.00 | 0.16 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,548 | 0 | 25,088 | 411 | 0.4 | 0.0 | 63.7 | 63.7 | 0.00 | 0.15 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 25 | 0 | 26 | 0 | 324 | 11 | 38,339 | 0 | 101,120 | 3,465 | 1.0 | 0.0 | 354.2 | 354.2 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-filtered-cell` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,336 | 0 | 7,936 | 292 | 0.7 | 0.0 | 50.9 | 50.9 | 0.00 | 0.17 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,671 | 0 | 24,960 | 410 | 0.4 | 0.0 | 56.9 | 56.9 | 0.00 | 0.15 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | success | 1 | 34 | 0 | 35 | 0 | 405 | 15 | 76,135 | 0 | 151,808 | 6,570 | 1.2 | 0.0 | 368.3 | 368.3 | 0.00 | 0.15 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 3,041 | 0 | 2,392 | 0 | 7,936 | 418 | 1.0 | 0.0 | 10.3 | 10.3 | 0.00 | 0.14 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 18,580 | 0 | 7,500 | 0 | 25,088 | 401 | 0.5 | 0.0 | 58.0 | 58.0 | 0.00 | 0.14 | ANSWER: Account 058 \| Owner \| Owner 17 |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 52 | 0 | 53 | 0 | 995 | 21 | 159,117 | 0 | 364,928 | 8,783 | 1.2 | 0.0 | 610.5 | 610.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-wide-column` | Mantis | 1 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 5,144 | 0 | 4,782 | 0 | 26,624 | 931 | 0.7 | 0.0 | 113.7 | 113.7 | 0.00 | 0.14 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 30,100 | 0 | 11,696 | 0 | 20,224 | 496 | 0.4 | 0.0 | 54.4 | 54.4 | 0.00 | 0.14 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | success | 1 | 72 | 0 | 64 | 0 | 738 | 30 | 280,710 | 0 | 627,968 | 20,695 | 1.0 | 0.0 | 823.9 | 823.9 | 0.00 | 0.20 | ANSWER: Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Mantis | 2 | success | 1 | 27 | 4 | 28 | 0 | 30,168 | 5 | 29,298 | 0 | 328,960 | 9,625 | 0.7 | 0.0 | 373.3 | 373.3 | 0.00 | 0.14 | ANSWER: Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 17 | 0 | 18 | 0 | 63,753 | 6 | 40,921 | 0 | 364,160 | 13,323 | 0.4 | 0.0 | 310.4 | 310.4 | 0.00 | 0.15 | The table has been scrolled horizontally, revealing the rightmost "Renewal date" column. For the row with Account 058 (Region 1, Segment 1, Owner 17, $8,742), t |
| `v2-table-wide-column` | Screenshots (click by x,y) | 2 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,237 | 43 | 467,059 | 0 | 1,420,672 | 28,979 | 1.1 | 0.0 | 1114.3 | 1114.3 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 7,676 | 0 | 5,962 | 0 | 31,232 | 687 | 0.7 | 0.0 | 71.2 | 71.2 | 0.00 | 0.15 | fixture check failed (7 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 20 | 0 | 21 | 0 | 34,040 | 6 | 22,578 | 0 | 317,056 | 3,014 | 0.4 | 0.0 | 223.3 | 223.3 | 0.00 | 0.15 | ANSWER: Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | success | 1 | 67 | 0 | 68 | 0 | 798 | 22 | 183,557 | 0 | 632,704 | 12,144 | 1.2 | 0.0 | 656.2 | 656.2 | 0.00 | 0.15 | ANSWER: Account 058 \| Renewal date \| 2027-09-14 |
| `v2-table-paginated-record` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,490 | 0 | 19,072 | 550 | 0.7 | 0.0 | 58.5 | 58.5 | 0.00 | 0.14 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,200 | 0 | 29,440 | 576 | 0.4 | 0.0 | 59.6 | 59.6 | 0.00 | 0.14 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,129 | 0 | 22,784 | 583 | 1.0 | 0.0 | 144.7 | 144.7 | 0.00 | 0.16 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 5,981 | 0 | 4,568 | 0 | 19,072 | 585 | 0.7 | 0.0 | 65.5 | 65.5 | 0.00 | 0.15 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 7 | 0 | 8 | 0 | 8,815 | 0 | 5,138 | 0 | 29,440 | 524 | 0.4 | 0.0 | 64.2 | 64.2 | 0.00 | 0.15 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | success | 1 | 8 | 0 | 9 | 0 | 199 | 3 | 4,410 | 0 | 13,952 | 539 | 1.0 | 0.0 | 60.0 | 60.0 | 0.00 | 0.14 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Mantis | 3 | success | 1 | 7 | 0 | 8 | 0 | 6,035 | 0 | 4,851 | 0 | 23,296 | 605 | 0.7 | 0.0 | 108.5 | 108.5 | 0.00 | 0.14 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 12,283 | 0 | 6,546 | 0 | 38,656 | 653 | 0.4 | 0.0 | 107.0 | 107.0 | 0.00 | 0.15 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | success | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,149 | 0 | 23,424 | 663 | 1.0 | 0.0 | 125.1 | 125.1 | 0.00 | 0.15 | ANSWER: ledger-074 \| Account \| Account 074 |
| `v2-list-virtual-target` | Mantis | 1 | timeout | 1 | 87 | 5 | 56 | 0 | 45,162 | 5 | 101,925 | 0 | 1,620,480 | 83,033 | 0.7 | 0.0 | 1011.2 | 1011.2 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 63 | 3 | 51 | 0 | 47,577 | 1 | 95,625 | 0 | 1,317,888 | 69,067 | 0.4 | 0.0 | 878.1 | 878.1 | 0.00 | 0.27 | fixture check failed (232 observations) |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 47 | 0 | 52 | 0 | 1,205 | 19 | 254,262 | 0 | 633,856 | 53,802 | 1.0 | 0.0 | 754.4 | 754.4 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-list-virtual-target` | Mantis | 2 | timeout | 1 | 111 | 14 | 87 | 0 | 69,736 | 4 | 104,147 | 0 | 3,743,104 | 67,390 | 0.7 | 0.0 | 1087.2 | 1087.2 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 2 | timeout | 1 | 63 | 3 | 69 | 0 | 53,812 | 2 | 109,418 | 0 | 2,631,424 | 85,035 | 0.4 | 0.0 | 1004.4 | 1004.4 | 0.00 | 0.18 | active-work timed out after 600s |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 58 | 1 | 60 | 0 | 1,228 | 25 | 295,109 | 0 | 520,320 | 39,216 | 1.4 | 0.0 | 699.3 | 699.3 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-list-virtual-target` | Mantis | 3 | wrong_answer | 1 | 79 | 2 | 82 | 0 | 78,061 | 2 | 104,297 | 0 | 2,657,920 | 62,435 | 0.8 | 0.0 | 774.0 | 774.0 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 43 | 1 | 48 | 0 | 47,046 | 2 | 100,680 | 0 | 1,145,088 | 74,331 | 0.5 | 0.0 | 699.6 | 699.6 | 0.00 | 0.23 | answer did not match the expected result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 3 | timeout | 1 | 116 | 1 | 70 | 0 | 2,821 | 28 | 559,257 | 0 | 1,218,688 | 70,240 | 1.0 | 0.0 | 796.9 | 796.9 | 0.00 | 0.18 | active-work timed out after 600s |
| `v2-list-paginated-filter` | Mantis | 1 | timeout | 1 | 62 | 8 | 43 | 0 | 22,297 | 1 | 98,271 | 0 | 1,024,384 | 90,279 | 0.7 | 0.0 | 742.5 | 742.5 | 0.00 | 0.17 | active-work timed out after 600s |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 31 | 2 | 39 | 0 | 15,700 | 1 | 103,612 | 0 | 928,128 | 89,576 | 0.4 | 0.0 | 638.1 | 638.1 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 42 | 0 | 48 | 0 | 798 | 19 | 342,107 | 0 | 636,928 | 64,419 | 1.1 | 0.0 | 564.2 | 564.2 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-paginated-filter` | Mantis | 2 | timeout | 1 | 116 | 8 | 65 | 0 | 43,615 | 3 | 103,209 | 0 | 1,558,400 | 82,982 | 0.8 | 0.0 | 774.3 | 774.3 | 0.00 | 0.17 | active-work timed out after 600s |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 2 | timeout | 1 | 50 | 2 | 39 | 0 | 33,145 | 1 | 114,453 | 0 | 1,274,624 | 94,890 | 0.4 | 0.0 | 737.9 | 737.9 | 0.00 | 0.19 | active-work timed out after 600s |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 2 | timeout | 1 | 47 | 0 | 56 | 0 | 1,117 | 20 | 294,278 | 0 | 852,992 | 99,074 | 1.1 | 0.0 | 745.5 | 745.5 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-paginated-filter` | Mantis | 3 | wrong_answer | 1 | 71 | 10 | 49 | 0 | 33,380 | 6 | 103,924 | 0 | 975,104 | 83,050 | 0.7 | 0.0 | 681.1 | 681.1 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 36 | 3 | 42 | 0 | 25,377 | 1 | 102,503 | 0 | 1,409,920 | 84,178 | 0.4 | 0.0 | 611.2 | 611.2 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 3 | timeout | 1 | 125 | 1 | 90 | 0 | 2,530 | 40 | 624,607 | 0 | 1,535,232 | 81,133 | 1.2 | 0.0 | 791.2 | 791.2 | 0.00 | 0.20 | active-work timed out after 600s |
| `v2-list-reordered-item` | Mantis | 1 | timeout | 1 | 64 | 4 | 41 | 0 | 42,378 | 1 | 123,118 | 0 | 1,161,216 | 99,473 | 0.7 | 0.0 | 665.4 | 665.4 | 0.00 | 0.15 | active-work timed out after 600s |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 28 | 2 | 35 | 0 | 30,868 | 1 | 101,239 | 0 | 938,240 | 85,331 | 0.5 | 0.0 | 582.1 | 582.1 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | timeout | 1 | 41 | 1 | 50 | 0 | 1,387 | 17 | 317,292 | 0 | 910,720 | 102,669 | 1.6 | 0.0 | 687.7 | 687.7 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-reordered-item` | Mantis | 2 | timeout | 1 | 82 | 11 | 51 | 0 | 45,628 | 7 | 106,516 | 0 | 1,416,832 | 86,454 | 0.7 | 0.0 | 665.3 | 665.3 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 2 | timeout | 1 | 40 | 10 | 46 | 0 | 32,439 | 1 | 99,561 | 0 | 1,917,184 | 86,152 | 0.4 | 0.0 | 700.2 | 700.2 | 0.00 | 0.18 | active-work timed out after 600s |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 2 | timeout | 1 | 55 | 1 | 61 | 0 | 1,617 | 23 | 613,287 | 0 | 1,413,888 | 87,708 | 1.1 | 0.0 | 704.3 | 704.3 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-reordered-item` | Mantis | 3 | wrong_answer | 1 | 62 | 5 | 51 | 0 | 45,470 | 5 | 101,674 | 0 | 1,556,992 | 77,223 | 0.7 | 0.0 | 590.7 | 590.7 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 3 | timeout | 1 | 31 | 5 | 37 | 0 | 39,090 | 1 | 99,928 | 0 | 1,071,232 | 85,865 | 0.4 | 0.0 | 671.2 | 671.2 | 0.00 | 0.30 | active-work timed out after 600s |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 35 | 1 | 44 | 0 | 1,051 | 16 | 242,095 | 0 | 692,736 | 85,861 | 1.0 | 0.0 | 610.4 | 610.4 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-list-nested-scroll` | Mantis | 1 | timeout | 1 | 94 | 15 | 94 | 0 | 73,770 | 8 | 100,902 | 0 | 3,136,000 | 57,160 | 0.7 | 0.0 | 909.7 | 909.7 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 64 | 1 | 67 | 0 | 73,229 | 4 | 93,380 | 0 | 1,929,856 | 56,095 | 0.4 | 0.0 | 712.8 | 712.8 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 55 | 1 | 58 | 0 | 718 | 25 | 230,681 | 0 | 472,704 | 31,375 | 1.0 | 0.0 | 461.6 | 461.6 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-list-nested-scroll` | Mantis | 2 | timeout | 1 | 87 | 6 | 87 | 0 | 87,460 | 4 | 105,426 | 0 | 3,423,872 | 60,463 | 0.7 | 0.0 | 967.8 | 967.8 | 0.00 | 0.15 | active-work timed out after 600s |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 43 | 0 | 44 | 0 | 39,751 | 1 | 50,209 | 0 | 853,120 | 33,682 | 0.4 | 0.0 | 482.5 | 482.5 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 2 | cli_error | 1 | 127 | 1 | 100 | 0 | 2,243 | 38 | 567,675 | 0 | 1,889,408 | 53,870 | 1.2 | 0.0 | 1051.8 | 1051.8 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-list-nested-scroll` | Mantis | 3 | wrong_answer | 1 | 61 | 5 | 62 | 0 | 45,663 | 1 | 47,124 | 0 | 1,173,504 | 20,797 | 0.7 | 0.0 | 531.9 | 531.9 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 60 | 1 | 45 | 0 | 38,517 | 10 | 107,772 | 0 | 824,064 | 22,606 | 0.4 | 0.0 | 445.3 | 445.3 | 0.00 | 0.18 | fixture check failed (118 observations) |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 74 | 1 | 77 | 0 | 1,385 | 28 | 414,317 | 0 | 1,395,712 | 49,273 | 1.0 | 0.0 | 895.7 | 895.7 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-chart-svg-series` | Mantis | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,610 | 0 | 8,832 | 319 | 1.0 | 0.0 | 42.2 | 42.2 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,382 | 0 | 7,424 | 194 | 0.4 | 0.0 | 23.4 | 23.4 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,442 | 0 | 1,664 | 170 | 1.1 | 0.0 | 8.9 | 8.9 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-svg-series` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 4 | 0 | 992 | 0 | 1,399 | 0 | 6,912 | 251 | 0.8 | 0.0 | 46.0 | 46.0 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,255 | 0 | 7,552 | 200 | 0.4 | 0.0 | 41.4 | 41.4 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 107 | 1 | 1,442 | 0 | 1,664 | 187 | 1.2 | 0.0 | 14.8 | 14.8 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-svg-series` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 992 | 0 | 1,484 | 0 | 8,960 | 255 | 0.9 | 0.0 | 20.0 | 20.0 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,254 | 0 | 7,552 | 166 | 0.4 | 0.0 | 14.7 | 14.7 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 107 | 2 | 2,552 | 0 | 3,072 | 461 | 1.0 | 0.0 | 40.2 | 40.2 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-chart-canvas-point` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,491 | 0 | 1,608 | 0 | 7,040 | 302 | 0.8 | 0.0 | 36.7 | 36.7 | 0.00 | 0.18 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,168 | 0 | 7,552 | 263 | 0.5 | 0.0 | 33.3 | 33.3 | 0.00 | 0.17 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 143 | 1.1 | 0.0 | 7.2 | 7.2 | 0.00 | 0.17 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,491 | 0 | 1,608 | 0 | 7,040 | 307 | 0.8 | 0.0 | 17.9 | 17.9 | 0.00 | 0.16 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 2,286 | 1 | 2,460 | 0 | 10,624 | 363 | 0.4 | 0.0 | 17.9 | 17.9 | 0.00 | 0.19 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,452 | 0 | 1,664 | 164 | 1.2 | 0.0 | 30.0 | 30.0 | 0.00 | 0.15 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,511 | 1 | 2,094 | 0 | 9,344 | 369 | 0.7 | 0.0 | 40.5 | 40.5 | 0.00 | 0.17 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 2 | 0 | 3 | 0 | 1,799 | 0 | 1,170 | 0 | 7,552 | 251 | 0.4 | 0.0 | 34.8 | 34.8 | 0.00 | 0.16 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 3 | success | 1 | 2 | 0 | 3 | 0 | 112 | 1 | 1,456 | 0 | 1,664 | 184 | 1.0 | 0.0 | 16.9 | 16.9 | 0.00 | 0.17 | ANSWER: API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | wrong_answer | 1 | 7 | 0 | 7 | 0 | 1,038 | 1 | 14,357 | 0 | 17,408 | 12,372 | 0.7 | 0.0 | 110.5 | 110.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 19 | 0 | 24 | 0 | 34,900 | 2 | 77,815 | 0 | 508,032 | 56,694 | 0.4 | 0.0 | 538.4 | 538.4 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 109 | 1 | 1,457 | 0 | 1,664 | 1,016 | 1.2 | 0.0 | 12.7 | 12.7 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-chart-image-fact` | Mantis | 2 | wrong_answer | 1 | 19 | 0 | 13 | 0 | 2,170 | 1 | 29,847 | 0 | 74,752 | 26,390 | 0.7 | 0.0 | 256.4 | 256.4 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 11,900 | 1 | 8,141 | 0 | 20,608 | 7,541 | 0.4 | 0.0 | 83.6 | 83.6 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 8 | 0 | 14 | 0 | 421 | 4 | 55,343 | 0 | 240,256 | 49,793 | 1.1 | 0.0 | 369.9 | 369.9 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-chart-image-fact` | Mantis | 3 | timeout | 1 | 38 | 3 | 31 | 0 | 20,003 | 3 | 89,901 | 0 | 835,840 | 84,700 | 0.7 | 0.0 | 805.2 | 805.2 | 0.00 | 0.14 | active-work timed out after 600s |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 13 | 1 | 16 | 0 | 6,247 | 2 | 35,751 | 0 | 150,656 | 29,925 | 0.4 | 0.0 | 305.1 | 305.1 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 3 | timeout | 1 | 180 | 1 | 43 | 0 | 3,730 | 16 | 263,172 | 0 | 961,536 | 75,601 | 1.0 | 0.0 | 965.1 | 965.1 | 0.00 | 0.17 | active-work timed out after 600s |
| `v2-chart-responsive` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 2,273 | 0 | 9,088 | 519 | 0.7 | 0.0 | 36.9 | 36.9 | 0.00 | 0.15 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,270 | 0 | 10,496 | 454 | 0.4 | 0.0 | 10.8 | 10.8 | 0.00 | 0.16 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,439 | 0 | 1,664 | 263 | 1.0 | 0.0 | 8.7 | 8.7 | 0.00 | 0.15 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 530 | 0 | 1,137 | 0 | 4,864 | 265 | 0.7 | 0.0 | 22.4 | 22.4 | 0.00 | 0.27 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,284 | 0 | 10,496 | 350 | 0.5 | 0.0 | 31.5 | 31.5 | 0.00 | 0.18 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 2 | success | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,445 | 0 | 1,664 | 409 | 1.7 | 0.0 | 19.2 | 19.2 | 0.00 | 0.15 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 996 | 1 | 2,131 | 0 | 9,216 | 476 | 0.7 | 0.0 | 36.6 | 36.6 | 0.00 | 0.17 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,789 | 1 | 2,384 | 0 | 10,496 | 577 | 0.5 | 0.0 | 21.6 | 21.6 | 0.00 | 0.15 | ANSWER: Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 2 | 0 | 3 | 0 | 114 | 1 | 1,435 | 0 | 1,664 | 282 | 1.0 | 0.0 | 23.1 | 23.1 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,659 | 0 | 8,832 | 259 | 0.7 | 0.0 | 22.8 | 22.8 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,499 | 0 | 17,152 | 380 | 0.4 | 0.0 | 20.3 | 20.3 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 30 | 0 | 31 | 0 | 426 | 12 | 44,315 | 0 | 134,272 | 2,761 | 1.0 | 0.0 | 205.3 | 205.3 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 4 | 0 | 631 | 0 | 1,337 | 0 | 6,784 | 247 | 0.7 | 0.0 | 22.6 | 22.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 3,051 | 0 | 2,684 | 0 | 20,224 | 370 | 0.4 | 0.0 | 47.4 | 47.4 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 44 | 0 | 45 | 0 | 679 | 19 | 102,012 | 0 | 217,344 | 4,073 | 1.0 | 0.0 | 426.5 | 426.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 5 | 0 | 1,031 | 0 | 1,675 | 0 | 8,832 | 267 | 0.7 | 0.0 | 40.8 | 40.8 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 6 | 0 | 6 | 0 | 3,051 | 0 | 2,451 | 0 | 17,152 | 360 | 0.4 | 0.0 | 44.5 | 44.5 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-form-preferences` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 65 | 0 | 66 | 0 | 1,374 | 27 | 213,792 | 0 | 514,944 | 10,718 | 1.0 | 0.0 | 740.2 | 740.2 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Mantis | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,530 | 0 | 8,960 | 242 | 0.7 | 0.0 | 21.6 | 21.6 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,207 | 0 | 17,024 | 341 | 0.4 | 0.0 | 51.6 | 51.6 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 299 | 7 | 8,952 | 0 | 53,504 | 1,028 | 1.0 | 0.0 | 145.4 | 145.4 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,751 | 0 | 8,832 | 273 | 0.7 | 0.0 | 25.6 | 25.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,160 | 0 | 17,152 | 363 | 0.4 | 0.0 | 58.5 | 58.5 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 299 | 7 | 8,992 | 0 | 52,992 | 922 | 1.0 | 0.0 | 155.9 | 155.9 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 994 | 0 | 1,665 | 0 | 8,832 | 249 | 0.7 | 0.0 | 43.3 | 43.3 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,697 | 0 | 2,137 | 0 | 17,152 | 354 | 0.4 | 0.0 | 50.0 | 50.0 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-frame-payment` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 299 | 7 | 9,022 | 0 | 53,120 | 961 | 1.0 | 0.0 | 172.9 | 172.9 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Mantis | 1 | wrong_answer | 1 | 18 | 1 | 19 | 0 | 2,387 | 1 | 6,236 | 0 | 49,920 | 1,294 | 0.7 | 0.0 | 195.6 | 195.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 24 | 1 | 25 | 0 | 8,105 | 3 | 12,909 | 0 | 134,912 | 3,411 | 0.4 | 0.0 | 252.8 | 252.8 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 11 | 0 | 12 | 0 | 234 | 5 | 6,390 | 0 | 25,984 | 640 | 1.0 | 0.0 | 84.1 | 84.1 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Mantis | 2 | wrong_answer | 1 | 32 | 3 | 33 | 0 | 3,558 | 3 | 11,839 | 0 | 126,976 | 3,190 | 0.7 | 0.0 | 323.2 | 323.2 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 19 | 1 | 20 | 0 | 17,441 | 1 | 12,010 | 0 | 114,944 | 1,566 | 0.4 | 0.0 | 176.7 | 176.7 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 13 | 0 | 14 | 0 | 251 | 6 | 7,489 | 0 | 35,584 | 781 | 1.0 | 0.0 | 162.2 | 162.2 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Mantis | 3 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 1,159 | 0 | 2,825 | 0 | 17,664 | 510 | 0.7 | 0.0 | 92.2 | 92.2 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 13 | 1 | 14 | 0 | 4,580 | 2 | 7,005 | 0 | 56,320 | 1,379 | 0.4 | 0.0 | 158.7 | 158.7 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-combobox` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 12 | 0 | 13 | 0 | 230 | 6 | 7,290 | 0 | 31,872 | 733 | 1.1 | 0.0 | 123.3 | 123.3 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Mantis | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 580 | 0 | 1,372 | 0 | 8,960 | 286 | 0.7 | 0.0 | 30.0 | 30.0 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,893 | 0 | 23,936 | 481 | 0.4 | 0.0 | 73.9 | 73.9 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 11 | 0 | 12 | 0 | 255 | 4 | 5,639 | 0 | 23,040 | 666 | 1.1 | 0.0 | 172.9 | 172.9 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 580 | 0 | 1,345 | 0 | 8,960 | 277 | 0.8 | 0.0 | 55.1 | 55.1 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,870 | 0 | 23,808 | 443 | 0.4 | 0.0 | 112.7 | 112.7 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,354 | 0 | 20,352 | 565 | 1.0 | 0.0 | 104.2 | 104.2 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 580 | 0 | 1,343 | 0 | 8,960 | 262 | 0.7 | 0.0 | 52.1 | 52.1 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,792 | 0 | 2,912 | 0 | 23,808 | 453 | 0.5 | 0.0 | 100.4 | 100.4 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-form-validation-recovery` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 246 | 4 | 5,350 | 0 | 20,224 | 557 | 1.0 | 0.0 | 115.1 | 115.1 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Mantis | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,505 | 0 | 8,704 | 208 | 0.7 | 0.0 | 50.5 | 50.5 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,473 | 0 | 20,096 | 352 | 0.4 | 0.0 | 87.5 | 87.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,616 | 0 | 9,088 | 339 | 1.1 | 0.0 | 62.2 | 62.2 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,589 | 0 | 8,704 | 245 | 0.8 | 0.0 | 68.4 | 68.4 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,529 | 0 | 20,096 | 368 | 0.4 | 0.0 | 46.2 | 46.2 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,826 | 0 | 8,832 | 330 | 1.1 | 0.0 | 68.5 | 68.5 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 742 | 0 | 1,504 | 0 | 8,704 | 208 | 0.7 | 0.0 | 67.6 | 67.6 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,382 | 0 | 2,581 | 0 | 20,096 | 393 | 0.4 | 0.0 | 72.1 | 72.1 | 0.00 | 0.25 | answer did not match the expected result |
| `v2-interaction-overlay-dialog` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,618 | 0 | 9,088 | 341 | 1.1 | 0.0 | 56.9 | 56.9 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Mantis | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,545 | 0 | 8,704 | 234 | 0.8 | 0.0 | 52.4 | 52.4 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,167 | 0 | 16,768 | 329 | 0.6 | 0.0 | 62.0 | 62.0 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 12 | 0 | 13 | 0 | 244 | 5 | 6,612 | 0 | 28,544 | 561 | 1.2 | 0.0 | 130.4 | 130.4 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,530 | 0 | 8,704 | 218 | 0.8 | 0.0 | 49.8 | 49.8 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,191 | 0 | 16,768 | 341 | 0.5 | 0.0 | 46.0 | 46.0 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 8,920 | 0 | 53,632 | 1,024 | 1.2 | 0.0 | 166.2 | 166.2 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 754 | 0 | 1,538 | 0 | 8,704 | 220 | 0.8 | 0.0 | 98.3 | 98.3 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,268 | 0 | 2,236 | 0 | 16,768 | 355 | 0.5 | 0.0 | 74.8 | 74.8 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-overlay-shadow` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 16 | 0 | 17 | 0 | 284 | 7 | 8,656 | 0 | 52,480 | 834 | 1.2 | 0.0 | 282.2 | 282.2 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Mantis | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,120 | 0 | 13,056 | 336 | 0.8 | 0.0 | 83.6 | 83.6 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,744 | 0 | 23,552 | 460 | 0.5 | 0.0 | 106.3 | 106.3 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,305 | 0 | 20,096 | 551 | 1.3 | 0.0 | 134.3 | 134.3 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Mantis | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 1,985 | 0 | 13,312 | 413 | 0.7 | 0.0 | 73.2 | 73.2 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,764 | 0 | 23,552 | 460 | 0.4 | 0.0 | 103.7 | 103.7 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 4,896 | 0 | 20,096 | 466 | 1.1 | 0.0 | 173.6 | 173.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Mantis | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,099 | 0 | 13,056 | 362 | 0.7 | 0.0 | 79.3 | 79.3 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,756 | 0 | 23,552 | 458 | 0.4 | 0.0 | 82.1 | 82.1 | 0.00 | 0.21 | answer did not match the expected result |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,422 | 0 | 19,968 | 550 | 1.0 | 0.0 | 124.7 | 124.7 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,835 | 0 | 10,752 | 264 | 0.8 | 0.0 | 37.5 | 37.5 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,240 | 0 | 20,096 | 326 | 0.4 | 0.0 | 85.3 | 85.3 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,559 | 0 | 9,088 | 319 | 1.0 | 0.0 | 50.8 | 50.8 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Mantis | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,828 | 0 | 10,752 | 270 | 0.7 | 0.0 | 66.0 | 66.0 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,276 | 0 | 20,096 | 345 | 0.4 | 0.0 | 62.4 | 62.4 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,777 | 0 | 8,832 | 311 | 1.0 | 0.0 | 112.0 | 112.0 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 771 | 0 | 1,891 | 0 | 10,752 | 299 | 0.7 | 0.0 | 67.5 | 67.5 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,211 | 0 | 2,268 | 0 | 20,096 | 335 | 0.4 | 0.0 | 104.4 | 104.4 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-overlay-toast` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 173 | 3 | 3,713 | 0 | 8,960 | 326 | 1.0 | 0.0 | 67.7 | 67.7 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,822 | 0 | 10,880 | 223 | 0.7 | 0.0 | 97.8 | 97.8 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,485 | 0 | 20,480 | 350 | 0.4 | 0.0 | 79.1 | 79.1 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,504 | 0 | 9,088 | 304 | 1.0 | 0.0 | 87.3 | 87.3 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Mantis | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,822 | 0 | 10,880 | 223 | 0.7 | 0.0 | 54.1 | 54.1 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,811 | 0 | 2,589 | 0 | 20,352 | 341 | 0.4 | 0.0 | 57.5 | 57.5 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 195 | 4 | 4,880 | 0 | 14,848 | 400 | 1.0 | 0.0 | 98.6 | 98.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Mantis | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 976 | 0 | 1,822 | 0 | 10,880 | 223 | 0.7 | 0.0 | 79.9 | 79.9 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,819 | 0 | 2,491 | 0 | 20,480 | 348 | 0.5 | 0.0 | 62.5 | 62.5 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-spa-client-route` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 175 | 3 | 3,616 | 0 | 9,088 | 342 | 1.0 | 0.0 | 96.5 | 96.5 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Mantis | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 1,374 | 0 | 2,096 | 0 | 11,264 | 310 | 0.7 | 0.0 | 88.8 | 88.8 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,122 | 0 | 16,768 | 319 | 0.4 | 0.0 | 76.4 | 76.4 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 3,904 | 0 | 10,752 | 399 | 1.1 | 0.0 | 91.9 | 91.9 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Mantis | 2 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,720 | 0 | 8,832 | 250 | 0.7 | 0.0 | 59.1 | 59.1 | 0.00 | 0.13 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,140 | 0 | 2,117 | 0 | 16,768 | 311 | 0.4 | 0.0 | 52.0 | 52.0 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 193 | 3 | 4,072 | 0 | 10,496 | 384 | 1.0 | 0.0 | 91.1 | 91.1 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Mantis | 3 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 908 | 0 | 1,602 | 0 | 8,960 | 254 | 0.7 | 0.0 | 47.2 | 47.2 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 5 | 0 | 6 | 0 | 2,132 | 0 | 2,072 | 0 | 16,896 | 354 | 0.4 | 0.0 | 67.7 | 67.7 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-history-draft` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 194 | 3 | 3,832 | 0 | 10,880 | 393 | 1.0 | 0.0 | 88.8 | 88.8 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Mantis | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 2,161 | 0 | 13,184 | 265 | 0.8 | 0.0 | 75.7 | 75.7 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 3,222 | 0 | 2,921 | 0 | 24,064 | 427 | 0.5 | 0.0 | 88.4 | 88.4 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,845 | 0 | 14,976 | 423 | 1.0 | 0.0 | 122.6 | 122.6 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Mantis | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 1,344 | 0 | 2,205 | 0 | 13,184 | 276 | 0.7 | 0.0 | 110.8 | 110.8 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 3,222 | 0 | 2,898 | 0 | 24,064 | 399 | 0.4 | 0.0 | 94.5 | 94.5 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 197 | 4 | 4,911 | 0 | 14,976 | 443 | 1.1 | 0.0 | 102.2 | 102.2 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-interaction-spa-route-recovery` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 3,742 | 0 | 3,394 | 0 | 27,904 | 447 | 0.4 | 0.0 | 80.8 | 80.8 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-interaction-spa-retry-recovery` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,298 | 0 | 2,475 | 0 | 19,968 | 331 | 1.0 | 0.0 | 60.6 | 60.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-interaction-spa-retry-recovery` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 174 | 3 | 3,634 | 0 | 9,088 | 332 | 1.9 | 0.0 | 7.6 | 7.6 | 0.00 | 0.30 | answer did not match the expected result |
