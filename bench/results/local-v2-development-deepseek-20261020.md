# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 10 runs in parallel.
- Scope: 32 tasks × 3 approaches × 3 runs = 288 logical runs; 33 recorded so far; 33 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 0 / 12 | 0 / 11 | 0 / 10 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 12 | 11 | 10 |
| Tool calls (including retries) | 487 | 288 | 283 |
| Sarvam API attempts (including retries) | 301 | 296 | 293 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 1852.9 | 2295.5 | 1066.7 |
| Sarvam limiter queue / cooldown (total, s) | 2086.5 / 0.0 | 2022.0 / 0.0 | 1696.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 1676.9 / 0.5 | 2229.6 / 0.0 | 1004.3 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 58 | 28 | 3 |
| Browser observation text (observed chars) | 375,486 | 563,146 | 5,903 |
| Browser observation images (observed blocks) | 30 | 16 | 120 |
| Normal input tokens (total) | 656,686 | 552,720 | 970,340 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 5,457,408 | 8,245,120 | 2,070,400 |
| Output tokens (total) | 211,819 | 290,904 | 117,862 |
| Total input tokens incl. cache (legacy) | 6,114,094 | 8,797,840 | 3,040,740 |
| MCP startup (total, s) | 10.9 | 8.5 | 12.0 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 3939.8 | 4317.4 | 2762.8 |
| CLI wall (total, s) | 3939.8 | 4317.4 | 2762.8 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 1.9 | 1.8 | 1.5 |
| Harness capture (total, s) | 23.7 | 163.9 | 15.9 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 41.39 | 48.49 | 37.67 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | wrong_answer | 1 | 16 | 2 | 11 | 0 | 19,998 | 1 | 11,291 | 0 | 42,624 | 4,473 | 1.3 | 0.0 | 139.7 | 139.7 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 21 | 7 | 19 | 0 | 49,884 | 0 | 36,256 | 0 | 365,696 | 15,512 | 1.7 | 0.0 | 280.6 | 280.6 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-table-sort-row` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 32 | 0 | 33 | 0 | 878 | 12 | 155,322 | 0 | 349,056 | 33,726 | 1.7 | 0.0 | 448.2 | 448.2 | 0.00 | 0.13 | answer did not match the expected result |
| `v2-table-sort-row` | Mantis | 2 | wrong_answer | 1 | 22 | 2 | 23 | 0 | 27,298 | 0 | 20,487 | 0 | 190,720 | 8,482 | 1.4 | 0.0 | 250.5 | 250.5 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 2 | timeout | 1 | 30 | 1 | 30 | 0 | 58,604 | 0 | 111,318 | 0 | 1,221,504 | 91,060 | 1.7 | 0.0 | 845.7 | 845.7 | 0.00 | 0.16 | active-work timed out after 600s |
| `v2-table-sort-row` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 27 | 1 | 28 | 0 | 848 | 11 | 63,372 | 0 | 169,984 | 12,130 | 1.6 | 0.0 | 264.8 | 264.8 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-sort-row` | Mantis | 3 | wrong_answer | 1 | 18 | 1 | 19 | 0 | 22,454 | 0 | 16,380 | 0 | 137,472 | 6,027 | 1.3 | 0.0 | 147.3 | 147.3 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 19 | 2 | 20 | 0 | 55,005 | 0 | 48,213 | 0 | 463,232 | 23,312 | 1.7 | 0.0 | 364.9 | 364.9 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-sort-row` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 44 | 0 | 45 | 0 | 842 | 19 | 220,972 | 0 | 479,232 | 20,945 | 1.7 | 0.0 | 455.3 | 455.3 | 0.00 | 0.14 | fixture check failed (17 observations) |
| `v2-table-filtered-cell` | Mantis | 1 | wrong_answer | 1 | 162 | 11 | 63 | 0 | 71,869 | 5 | 95,291 | 0 | 1,834,368 | 55,826 | 1.3 | 0.0 | 974.6 | 974.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 23 | 2 | 24 | 0 | 39,974 | 6 | 37,210 | 0 | 388,352 | 15,268 | 0.4 | 0.0 | 354.1 | 354.1 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 38 | 1 | 39 | 0 | 902 | 15 | 93,821 | 0 | 208,896 | 9,139 | 1.0 | 0.0 | 296.4 | 296.4 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-filtered-cell` | Mantis | 2 | wrong_answer | 1 | 114 | 23 | 57 | 0 | 58,728 | 5 | 73,748 | 0 | 1,502,592 | 40,959 | 0.7 | 0.0 | 788.3 | 788.3 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 46 | 3 | 50 | 0 | 81,798 | 0 | 111,342 | 0 | 1,865,984 | 71,928 | 0.5 | 0.0 | 877.7 | 877.7 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-table-filtered-cell` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 31 | 1 | 32 | 0 | 784 | 11 | 43,520 | 0 | 161,920 | 5,305 | 1.0 | 0.0 | 263.6 | 263.6 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-table-filtered-cell` | Mantis | 3 | wrong_answer | 1 | 64 | 10 | 44 | 0 | 47,425 | 18 | 342,181 | 0 | 1,014,400 | 64,672 | 0.7 | 0.0 | 847.6 | 847.6 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-filtered-cell` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 62 | 5 | 63 | 0 | 71,381 | 2 | 79,861 | 0 | 2,171,008 | 40,015 | 0.4 | 0.0 | 716.5 | 716.5 | 0.00 | 0.18 | answer did not match the expected result |
| `v2-table-wide-column` | Mantis | 1 | wrong_answer | 1 | 18 | 1 | 19 | 0 | 33,213 | 1 | 21,573 | 0 | 159,360 | 4,934 | 0.7 | 0.0 | 164.8 | 164.8 | 0.00 | 0.14 | fixture check failed (8 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 15 | 0 | 16 | 0 | 92,774 | 3 | 43,360 | 0 | 448,128 | 4,594 | 0.4 | 0.0 | 116.3 | 116.3 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-wide-column` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 52 | 0 | 53 | 0 | 603 | 25 | 271,450 | 0 | 465,536 | 21,890 | 1.0 | 0.0 | 448.9 | 448.9 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-wide-column` | Mantis | 2 | wrong_answer | 1 | 26 | 7 | 20 | 0 | 28,550 | 0 | 24,383 | 0 | 199,552 | 9,964 | 0.7 | 0.0 | 182.4 | 182.4 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 24 | 3 | 23 | 0 | 38,331 | 3 | 27,198 | 0 | 398,080 | 7,204 | 0.4 | 0.0 | 165.6 | 165.6 | 0.00 | 0.20 | answer did not match the expected result |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 23 | 1 | 20 | 0 | 48,524 | 0 | 36,019 | 0 | 300,160 | 13,454 | 0.7 | 0.0 | 209.2 | 209.2 | 0.00 | 0.16 | fixture check failed (20 observations) |
| `v2-table-wide-column` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 32 | 5 | 33 | 0 | 53,689 | 2 | 45,230 | 0 | 854,400 | 18,856 | 0.4 | 0.0 | 415.4 | 415.4 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-table-wide-column` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 32 | 0 | 33 | 0 | 453 | 15 | 106,079 | 0 | 180,992 | 12,438 | 1.0 | 0.0 | 352.1 | 352.1 | 0.00 | 0.17 | answer did not match the expected result |
| `v2-table-paginated-record` | Mantis | 1 | wrong_answer | 1 | 8 | 0 | 9 | 0 | 6,136 | 0 | 5,375 | 0 | 28,800 | 1,015 | 0.7 | 0.0 | 87.9 | 87.9 | 0.00 | 0.16 | answer did not match the expected result |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 5,731 | 0 | 4,163 | 0 | 29,184 | 632 | 0.4 | 0.0 | 47.5 | 47.5 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 199 | 5 | 6,144 | 0 | 22,528 | 667 | 1.1 | 0.0 | 65.6 | 65.6 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-table-paginated-record` | Mantis | 2 | wrong_answer | 1 | 10 | 0 | 9 | 0 | 6,374 | 0 | 5,921 | 0 | 28,416 | 1,388 | 0.7 | 0.0 | 88.4 | 88.4 | 0.00 | 0.19 | answer did not match the expected result |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 10 | 0 | 11 | 0 | 195 | 5 | 6,154 | 0 | 22,912 | 1,122 | 1.0 | 0.0 | 97.9 | 97.9 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-paginated-record` | Mantis | 3 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 4,917 | 0 | 4,037 | 0 | 18,944 | 625 | 0.7 | 0.0 | 59.1 | 59.1 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-table-paginated-record` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 15,975 | 0 | 8,569 | 0 | 39,552 | 2,523 | 0.4 | 0.0 | 133.3 | 133.3 | 0.00 | 0.15 | answer did not match the expected result |
| `v2-table-paginated-record` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 199 | 2 | 3,506 | 0 | 9,344 | 500 | 1.0 | 0.0 | 69.9 | 69.9 | 0.00 | 0.14 | answer did not match the expected result |
