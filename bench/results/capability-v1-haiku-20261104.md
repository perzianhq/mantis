# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-04; runs per task and approach: 1; 12 runs in parallel.
- Scope: 12 tasks × 3 approaches × 1 runs = 36 logical runs; 36 recorded so far; 36 total attempts including retries.
- Claude runtime: 2.1.310 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| First-pass correct (attempt 1) | 11 / 12 | 11 / 12 | 12 / 12 |
| After reruns / merged correct | 11 / 12 | 11 / 12 | 12 / 12 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 11 / 12 | 11 / 12 | 12 / 12 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 1 | 1 | 0 |
| Tool calls (including retries) | 118 | 128 | 87 |
| MCP tool errors (including retries) | 1 | 1 | 0 |
| Browser observation text (observed chars) | 64,904 | 91,532 | 10,674 |
| Browser observation images (observed blocks) | 6 | 5 | 43 |
| Normal input tokens (total) | 202 | 154 | 112 |
| Cache-write input tokens (total) | 89,025 | 110,407 | 124,354 |
| Cache-read input tokens (total) | 1,236,345 | 1,095,577 | 408,796 |
| Output tokens (total) | 11,880 | 16,417 | 11,397 |
| Total input tokens incl. cache (legacy) | 1,325,572 | 1,206,138 | 533,262 |
| MCP startup (total, s) | 26.1 | 25.9 | 26.6 |
| CLI startup (total, s) | 43.3 | 43.2 | 41.8 |
| CLI execution (total, s) | 280.1 | 292.6 | 170.9 |
| CLI wall (total, s) | 323.4 | 335.8 | 212.7 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 3.8 | 4.0 | 3.5 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | 0.04 | 0.04 | 0.03 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 40 | 1 | 27,854 | 0 | 72 | 21,637 | 608,193 | 3,165 | 2.1 | 4.8 | 77.7 | 82.6 | 0.00 | 0.14 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | wrong_answer | wrong_answer | 1 | n/a | 600 | 53 | 0 | 34,818 | 1 | 44 | 29,973 | 462,393 | 7,259 | 2.1 | 4.6 | 58.6 | 63.2 | 0.00 | 0.48 | fixture check failed (53 observations) |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 12 | 0 | 1,468 | 6 | 14 | 16,467 | 60,986 | 1,623 | 2.1 | 4.6 | 18.1 | 22.7 | 0.00 | 0.27 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 2,087 | 0 | 12 | 5,174 | 48,910 | 661 | 2.2 | 4.9 | 14.2 | 19.1 | 0.00 | 0.34 | request-032 \| Select \| Confirmation: Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 12 | 1 | 10,066 | 0 | 16 | 9,846 | 99,283 | 1,296 | 2.2 | 4.5 | 18.6 | 23.1 | 0.00 | 0.33 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 10 | 0 | 1,204 | 5 | 12 | 14,384 | 45,821 | 1,210 | 2.2 | 4.5 | 14.2 | 18.7 | 0.00 | 0.24 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 3,264 | 0 | 8 | 5,816 | 31,065 | 777 | 2.2 | 4.5 | 15.5 | 20.0 | 0.00 | 0.30 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 16,289 | 0 | 8 | 11,923 | 47,135 | 1,083 | 2.2 | 4.5 | 17.5 | 22.1 | 0.00 | 0.30 | case-024 \| Select \| case-024 selected |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 16 | 0 | 1,683 | 7 | 16 | 19,092 | 79,189 | 2,822 | 2.2 | 4.4 | 31.8 | 36.2 | 0.00 | 0.37 | case-024 \| Select \| case-024 selected |
| `v2-list-nested-scroll` | Mantis | 1 | wrong_answer | wrong_answer | wrong_answer | 1 | n/a | 600 | 20 | 0 | 20,220 | 0 | 36 | 16,352 | 252,260 | 2,716 | 2.2 | 4.4 | 51.4 | 55.8 | 0.01 | 0.41 | fixture check failed (27 observations) |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 18 | 0 | 10,988 | 0 | 22 | 11,204 | 152,377 | 2,328 | 2.4 | 4.3 | 32.8 | 37.1 | 0.00 | 0.31 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 10 | 0 | 1,232 | 5 | 12 | 14,853 | 46,629 | 1,531 | 2.4 | 4.2 | 16.5 | 20.6 | 0.00 | 0.30 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-chart-svg-series` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 992 | 0 | 8 | 4,549 | 29,979 | 381 | 2.3 | 2.2 | 11.7 | 13.9 | 0.00 | 0.36 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 1,909 | 0 | 4 | 4,781 | 17,713 | 307 | 2.0 | 2.7 | 9.8 | 12.4 | 0.00 | 0.37 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 501 | 2 | 6 | 5,758 | 15,215 | 471 | 2.1 | 2.7 | 8.3 | 11.0 | 0.00 | 0.42 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 1,334 | 0 | 6 | 4,735 | 21,353 | 612 | 2.1 | 3.2 | 11.5 | 14.7 | 0.00 | 0.36 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 1,745 | 0 | 6 | 4,604 | 28,683 | 395 | 2.0 | 3.6 | 9.7 | 13.3 | 0.00 | 0.36 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 309 | 1 | 4 | 5,342 | 7,768 | 330 | 2.0 | 3.3 | 10.2 | 13.6 | 0.00 | 0.43 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 671 | 0 | 8 | 4,337 | 29,776 | 531 | 2.0 | 3.5 | 10.8 | 14.3 | 0.00 | 0.59 | Dock C \| min \| 17 |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,413 | 1 | 6 | 5,013 | 28,996 | 484 | 2.0 | 4.5 | 10.9 | 15.4 | 0.00 | 0.38 | Dock C \| min \| 17 min |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 503 | 2 | 6 | 5,741 | 15,234 | 470 | 2.4 | 3.7 | 7.9 | 11.6 | 0.00 | 0.35 | Dock C \| min \| 17 |
| `v2-chart-responsive` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 976 | 0 | 8 | 4,644 | 30,006 | 586 | 2.2 | 2.7 | 12.5 | 15.2 | 0.00 | 0.45 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,763 | 1 | 6 | 6,438 | 29,223 | 790 | 2.4 | 2.9 | 12.1 | 15.0 | 0.00 | 0.41 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 311 | 1 | 4 | 5,323 | 7,760 | 562 | 2.6 | 3.3 | 6.9 | 10.2 | 0.00 | 0.21 | Bookings by quarter \| Q4 \| 147 |
| `capability-colour-swatch` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 22 | 0 | 4,394 | 6 | 16 | 8,179 | 76,814 | 1,421 | 2.2 | 3.4 | 23.5 | 26.9 | 0.00 | 0.18 | SW-38 |
| `capability-colour-swatch` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 3,640 | 1 | 10 | 7,711 | 56,303 | 681 | 2.0 | 3.4 | 14.9 | 18.3 | 0.00 | 0.36 | SW-38 |
| `capability-colour-swatch` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 755 | 3 | 8 | 8,823 | 24,390 | 517 | 2.0 | 3.4 | 12.0 | 15.4 | 0.00 | 0.36 | SW-38 |
| `capability-photo-fact` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 471 | 0 | 8 | 4,146 | 29,661 | 344 | 2.0 | 3.3 | 12.7 | 16.0 | 0.00 | 0.35 | KX-48273 |
| `capability-photo-fact` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,238 | 1 | 6 | 5,887 | 28,647 | 414 | 2.0 | 2.7 | 10.3 | 13.0 | 0.00 | 0.42 | KX-48273 |
| `capability-photo-fact` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 507 | 2 | 6 | 5,660 | 15,193 | 290 | 2.0 | 2.7 | 12.0 | 14.8 | 0.00 | 0.21 | KX-48273 |
| `capability-revisit-earlier` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 2,198 | 0 | 12 | 5,266 | 48,643 | 411 | 2.0 | 4.1 | 20.2 | 24.2 | 0.00 | 0.16 | ORD-4829-QX |
| `capability-revisit-earlier` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 11 | 0 | 4,640 | 0 | 14 | 7,099 | 78,927 | 775 | 2.0 | 3.4 | 21.9 | 25.3 | 0.00 | 0.15 | ORD-4829-QX |
| `capability-revisit-earlier` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 12 | 0 | 1,244 | 5 | 14 | 12,442 | 55,478 | 937 | 2.4 | 3.0 | 15.2 | 18.2 | 0.00 | 0.17 | ORD-4829-QX |
| `capability-live-update` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 443 | 0 | 8 | 4,190 | 29,685 | 275 | 2.4 | 2.4 | 18.3 | 20.7 | 0.00 | 0.20 | PK-6139 |
| `capability-live-update` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 8 | 0 | 3,023 | 0 | 12 | 5,928 | 65,897 | 605 | 2.4 | 2.2 | 75.3 | 77.6 | 0.00 | 0.15 | PK-6139 |
| `capability-live-update` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 8 | 0 | 957 | 4 | 10 | 10,469 | 35,133 | 634 | 2.0 | 1.9 | 17.8 | 19.8 | 0.00 | 0.16 | PK-6139 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | 1 | success | n/a | 600 | 40 | 629,902 | 77.7 | 0.012 | unknown | known |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 53 | 492,410 | 58.6 | 0.014 | unknown | known |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 12 | 77,467 | 18.1 | 0.005 | unknown | known |
| `v2-list-paginated-filter` | Mantis | 1 | 1 | success | n/a | 600 | 6 | 54,096 | 14.2 | 0.002 | unknown | known |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 12 | 109,145 | 18.6 | 0.004 | unknown | known |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 10 | 60,217 | 14.2 | 0.004 | unknown | known |
| `v2-list-reordered-item` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 36,889 | 15.5 | 0.002 | unknown | known |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 6 | 59,066 | 17.5 | 0.003 | unknown | known |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 16 | 98,297 | 31.8 | 0.006 | unknown | known |
| `v2-list-nested-scroll` | Mantis | 1 | 1 | wrong_answer | n/a | 600 | 20 | 268,648 | 51.4 | 0.007 | unknown | known |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 18 | 163,603 | 32.8 | 0.005 | unknown | known |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 10 | 61,494 | 16.5 | 0.004 | unknown | known |
| `v2-chart-svg-series` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 34,536 | 11.7 | 0.001 | unknown | known |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 2 | 22,498 | 9.8 | 0.001 | unknown | known |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 3 | 20,979 | 8.3 | 0.002 | unknown | known |
| `v2-chart-canvas-point` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 26,094 | 11.5 | 0.001 | unknown | known |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 2 | 33,293 | 9.7 | 0.001 | unknown | known |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 13,114 | 10.2 | 0.001 | unknown | known |
| `v2-chart-image-fact` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 34,121 | 10.8 | 0.001 | unknown | known |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 3 | 34,015 | 10.9 | 0.002 | unknown | known |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 3 | 20,981 | 7.9 | 0.002 | unknown | known |
| `v2-chart-responsive` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 34,658 | 12.5 | 0.002 | unknown | known |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 3 | 35,667 | 12.1 | 0.002 | unknown | known |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 13,087 | 6.9 | 0.001 | unknown | known |
| `capability-colour-swatch` | Mantis | 1 | 1 | success | n/a | 600 | 22 | 85,009 | 23.5 | 0.003 | unknown | known |
| `capability-colour-swatch` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 7 | 64,024 | 14.9 | 0.002 | unknown | known |
| `capability-colour-swatch` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 6 | 33,221 | 12.0 | 0.002 | unknown | known |
| `capability-photo-fact` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 33,815 | 12.7 | 0.001 | unknown | known |
| `capability-photo-fact` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 3 | 34,540 | 10.3 | 0.002 | unknown | known |
| `capability-photo-fact` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 3 | 20,859 | 12.0 | 0.001 | unknown | known |
| `capability-revisit-earlier` | Mantis | 1 | 1 | success | n/a | 600 | 6 | 53,921 | 20.2 | 0.002 | unknown | known |
| `capability-revisit-earlier` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 11 | 86,040 | 21.9 | 0.003 | unknown | known |
| `capability-revisit-earlier` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 12 | 67,934 | 15.2 | 0.004 | unknown | known |
| `capability-live-update` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 33,883 | 18.3 | 0.001 | unknown | known |
| `capability-live-update` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 8 | 71,837 | 75.3 | 0.002 | unknown | known |
| `capability-live-update` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 8 | 45,612 | 17.8 | 0.003 | unknown | known |
