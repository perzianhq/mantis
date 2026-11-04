# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-04; runs per task and approach: 1; 12 runs in parallel.
- Scope: 12 tasks × 3 approaches × 1 runs = 36 logical runs; 36 recorded so far; 36 total attempts including retries.
- Codex runtime: codex-cli 0.166.0-alpha.5.1; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| First-pass correct (attempt 1) | 12 / 12 | 10 / 12 | 11 / 12 |
| After reruns / merged correct | 12 / 12 | 10 / 12 | 11 / 12 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 12 / 12 | 10 / 12 | 11 / 12 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 2 | 1 |
| Tool calls (including retries) | 45 | 79 | 90 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 16,702 | 76,650 | 2,306 |
| Browser observation images (observed blocks) | 1 | 4 | 43 |
| Normal input tokens (total) | 268,772 | 260,420 | 284,382 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 718,720 | 1,026,816 | 1,237,888 |
| Output tokens (total) | 3,560 | 4,791 | 8,328 |
| Total input tokens incl. cache (legacy) | 987,492 | 1,287,236 | 1,522,270 |
| MCP startup (total, s) | 25.4 | 25.5 | 25.3 |
| CLI startup (total, s) | 10.5 | 11.0 | 10.9 |
| CLI execution (total, s) | 240.2 | 306.5 | 374.1 |
| CLI wall (total, s) | 250.7 | 317.5 | 385.0 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 3.5 | 3.5 | 3.3 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,892 | 0 | 33,068 | 0 | 39,808 | 280 | 2.2 | 1.6 | 20.9 | 22.5 | 0.00 | 0.31 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | wrong_answer | wrong_answer | 1 | n/a | 600 | 7 | 0 | 6,095 | 0 | 28,382 | 0 | 83,072 | 334 | 2.2 | 1.4 | 20.7 | 22.1 | 0.00 | 0.30 | fixture check failed (1 observations) |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 16 | 0 | 361 | 8 | 53,367 | 0 | 216,448 | 1,304 | 2.2 | 1.6 | 49.9 | 51.5 | 0.00 | 0.25 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-paginated-filter` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 1,969 | 0 | 21,406 | 0 | 78,848 | 323 | 2.2 | 1.4 | 22.3 | 23.8 | 0.00 | 0.35 | request-032 \| Select \| Confirmation: Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 8 | 0 | 7,086 | 0 | 14,672 | 0 | 112,128 | 417 | 2.2 | 1.4 | 29.7 | 31.1 | 0.00 | 0.33 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 10 | 0 | 218 | 4 | 27,637 | 0 | 123,264 | 814 | 2.3 | 1.5 | 39.3 | 40.8 | 0.00 | 0.32 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-reordered-item` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 2,199 | 0 | 15,220 | 0 | 71,808 | 288 | 2.3 | 1.3 | 17.7 | 19.0 | 0.00 | 0.31 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 16,439 | 0 | 25,099 | 0 | 84,224 | 339 | 2.3 | 1.4 | 21.9 | 23.3 | 0.00 | 0.31 | case-024 \| Select \| case-024 selected. |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | wrong_answer | wrong_answer | wrong_answer | 1 | n/a | 600 | 12 | 0 | 235 | 6 | 31,256 | 0 | 162,688 | 1,169 | 2.3 | 1.8 | 50.7 | 52.4 | 0.00 | 0.25 | answer did not match the expected result |
| `v2-list-nested-scroll` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 3,508 | 0 | 21,345 | 0 | 51,968 | 210 | 2.3 | 1.5 | 15.8 | 17.2 | 0.00 | 0.34 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | wrong_answer | wrong_answer | 1 | n/a | 600 | 15 | 0 | 22,091 | 0 | 58,309 | 0 | 156,288 | 848 | 2.3 | 1.4 | 38.6 | 40.1 | 0.00 | 0.34 | fixture check failed (87 observations) |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 14 | 0 | 317 | 7 | 30,302 | 0 | 190,848 | 1,212 | 2.3 | 1.7 | 54.5 | 56.2 | 0.00 | 0.23 | inbox-062 \| Archive \| inbox-062 archived. |
| `v2-chart-svg-series` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 992 | 0 | 27,791 | 0 | 57,472 | 272 | 2.0 | 0.6 | 23.7 | 24.3 | 0.00 | 0.28 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 3,861 | 0 | 11,718 | 0 | 59,264 | 262 | 2.0 | 1.3 | 17.0 | 18.4 | 0.00 | 0.30 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 107 | 1 | 22,811 | 0 | 27,648 | 379 | 2.0 | 0.8 | 17.1 | 17.9 | 0.00 | 0.32 | South \| Mar \| 39 |
| `v2-chart-canvas-point` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 884 | 0 | 14,926 | 0 | 70,912 | 369 | 2.0 | 0.7 | 20.1 | 20.8 | 0.00 | 0.32 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 4,035 | 1 | 28,475 | 0 | 59,136 | 456 | 2.0 | 0.5 | 25.4 | 25.9 | 0.00 | 0.24 | API latency \| Friday \| 51 |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 131 | 2 | 6,232 | 0 | 71,808 | 412 | 2.0 | 0.5 | 21.1 | 21.6 | 0.00 | 0.26 | API latency \| Friday \| 51 |
| `v2-chart-image-fact` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 691 | 1 | 28,351 | 0 | 70,784 | 409 | 2.0 | 0.7 | 21.3 | 22.0 | 0.00 | 0.26 | Dock C \| min \| 17 min |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 913 | 1 | 27,111 | 0 | 18,816 | 329 | 2.0 | 0.7 | 15.7 | 16.4 | 0.00 | 0.22 | Dock C \| min \| 17 min |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 109 | 1 | 21,849 | 0 | 29,184 | 424 | 2.0 | 0.7 | 16.9 | 17.6 | 0.00 | 0.23 | Dock C \| min \| 17 min |
| `v2-chart-responsive` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 530 | 0 | 14,138 | 0 | 44,160 | 367 | 2.0 | 0.6 | 17.1 | 17.8 | 0.00 | 0.22 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 1,676 | 0 | 5,466 | 0 | 39,552 | 182 | 2.0 | 0.6 | 10.8 | 11.5 | 0.00 | 0.24 | Bookings \| Q4 \| 147 |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 138 | 2 | 18,577 | 0 | 59,392 | 398 | 2.0 | 0.6 | 20.0 | 20.6 | 0.00 | 0.27 | Bookings by quarter \| Q4 \| 147 |
| `capability-colour-swatch` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 925 | 0 | 14,716 | 0 | 57,344 | 230 | 2.2 | 0.6 | 15.9 | 16.5 | 0.00 | 0.23 | SW-38 |
| `capability-colour-swatch` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 10 | 0 | 5,783 | 1 | 15,655 | 0 | 143,232 | 540 | 2.0 | 0.7 | 34.6 | 35.4 | 0.00 | 0.26 | SW-38 |
| `capability-colour-swatch` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 164 | 3 | 25,379 | 0 | 74,112 | 520 | 2.0 | 0.4 | 26.2 | 26.6 | 0.00 | 0.30 | SW-38 |
| `capability-photo-fact` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 471 | 0 | 17,626 | 0 | 49,920 | 257 | 2.0 | 0.5 | 19.0 | 19.4 | 0.00 | 0.28 | KX-48273 |
| `capability-photo-fact` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,305 | 1 | 17,634 | 0 | 39,552 | 252 | 2.0 | 0.5 | 14.9 | 15.4 | 0.00 | 0.35 | KX-48273 |
| `capability-photo-fact` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 113 | 1 | 7,430 | 0 | 42,496 | 284 | 2.0 | 0.4 | 14.1 | 14.5 | 0.00 | 0.31 | KX-48273 |
| `capability-revisit-earlier` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 2,198 | 0 | 29,740 | 0 | 84,736 | 330 | 2.0 | 0.5 | 25.0 | 25.5 | 0.00 | 0.32 | ORD-4829-QX |
| `capability-revisit-earlier` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 11 | 0 | 4,910 | 0 | 16,311 | 0 | 148,352 | 539 | 2.2 | 0.5 | 29.0 | 29.5 | 0.00 | 0.28 | ORD-4829-QX |
| `capability-revisit-earlier` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 12 | 0 | 260 | 5 | 25,786 | 0 | 156,416 | 902 | 2.0 | 0.5 | 35.4 | 35.9 | 0.00 | 0.27 | ORD-4829-QX |
| `capability-live-update` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 443 | 0 | 30,445 | 0 | 40,960 | 225 | 2.0 | 0.5 | 21.5 | 22.0 | 0.00 | 0.26 | PK-6139 |
| `capability-live-update` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 2,456 | 0 | 11,588 | 0 | 83,200 | 293 | 2.0 | 0.5 | 48.0 | 48.5 | 0.00 | 0.27 | PK-6139 |
| `capability-live-update` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 153 | 3 | 13,756 | 0 | 83,584 | 510 | 2.0 | 0.5 | 28.9 | 29.4 | 0.00 | 0.27 | PK-6139 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 72,876 | 20.9 | unknown | unknown | known |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 7 | 111,454 | 20.7 | unknown | unknown | known |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 16 | 269,815 | 49.9 | unknown | unknown | known |
| `v2-list-paginated-filter` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 100,254 | 22.3 | unknown | unknown | known |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 8 | 126,800 | 29.7 | unknown | unknown | known |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 10 | 150,901 | 39.3 | unknown | unknown | known |
| `v2-list-reordered-item` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 87,028 | 17.7 | unknown | unknown | known |
| `v2-list-reordered-item` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 6 | 109,323 | 21.9 | unknown | unknown | known |
| `v2-list-reordered-item` | Screenshots (click by x,y) | 1 | 1 | wrong_answer | n/a | 600 | 12 | 193,944 | 50.7 | unknown | unknown | known |
| `v2-list-nested-scroll` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 73,313 | 15.8 | unknown | unknown | known |
| `v2-list-nested-scroll` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 15 | 214,597 | 38.6 | unknown | unknown | known |
| `v2-list-nested-scroll` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 14 | 221,150 | 54.5 | unknown | unknown | known |
| `v2-chart-svg-series` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 85,263 | 23.7 | unknown | unknown | known |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 4 | 70,982 | 17.0 | unknown | unknown | known |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 50,459 | 17.1 | unknown | unknown | known |
| `v2-chart-canvas-point` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 85,838 | 20.1 | unknown | unknown | known |
| `v2-chart-canvas-point` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 5 | 87,611 | 25.4 | unknown | unknown | known |
| `v2-chart-canvas-point` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 4 | 78,040 | 21.1 | unknown | unknown | known |
| `v2-chart-image-fact` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 99,135 | 21.3 | unknown | unknown | known |
| `v2-chart-image-fact` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 2 | 45,927 | 15.7 | unknown | unknown | known |
| `v2-chart-image-fact` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 51,033 | 16.9 | unknown | unknown | known |
| `v2-chart-responsive` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 58,298 | 17.1 | unknown | unknown | known |
| `v2-chart-responsive` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 2 | 45,018 | 10.8 | unknown | unknown | known |
| `v2-chart-responsive` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 4 | 77,969 | 20.0 | unknown | unknown | known |
| `capability-colour-swatch` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 72,060 | 15.9 | unknown | unknown | known |
| `capability-colour-swatch` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 10 | 158,887 | 34.6 | unknown | unknown | known |
| `capability-colour-swatch` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 6 | 99,491 | 26.2 | unknown | unknown | known |
| `capability-photo-fact` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 67,546 | 19.0 | unknown | unknown | known |
| `capability-photo-fact` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 3 | 57,186 | 14.9 | unknown | unknown | known |
| `capability-photo-fact` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 2 | 49,926 | 14.1 | unknown | unknown | known |
| `capability-revisit-earlier` | Mantis | 1 | 1 | success | n/a | 600 | 6 | 114,476 | 25.0 | unknown | unknown | known |
| `capability-revisit-earlier` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 11 | 164,663 | 29.0 | unknown | unknown | known |
| `capability-revisit-earlier` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 12 | 182,202 | 35.4 | unknown | unknown | known |
| `capability-live-update` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 71,405 | 21.5 | unknown | unknown | known |
| `capability-live-update` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 6 | 94,788 | 48.0 | unknown | unknown | known |
| `capability-live-update` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 6 | 97,340 | 28.9 | unknown | unknown | known |
