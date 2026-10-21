# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 5 runs in parallel.
- Scope: 6 tasks × 1 approaches × 3 runs = 18 logical runs; 18 recorded so far; 18 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 18 / 18 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 137 |
| Sarvam API attempts (including retries) | 151 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 276.2 |
| Sarvam limiter queue / cooldown (total, s) | 2777.5 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 242.3 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 4 |
| Browser observation text (observed chars) | 52,782 |
| Browser observation images (observed blocks) | 10 |
| Normal input tokens (total) | 67,875 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 409,216 |
| Output tokens (total) | 20,816 |
| Total input tokens incl. cache (legacy) | 477,091 |
| MCP startup (total, s) | 19.6 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 3053.6 |
| CLI wall (total, s) | 3053.6 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 2.9 |
| Harness capture (total, s) | 11.0 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 4.09 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `project-eval-table-wide-reorder` | Mantis | 1 | success | 1 | 21 | 1 | 22 | 0 | 13,172 | 1 | 16,936 | 0 | 104,704 | 8,376 | 1.7 | 0.0 | 662.0 | 662.0 | 0.00 | 0.15 | The page source confirms the ledger data. After clicking the visible "Sort score descending" control, the rows reorder to 84, 73, 62, 50 (descending). The rq-63 |
| `project-eval-table-wide-reorder` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,279 | 0 | 1,446 | 0 | 7,040 | 443 | 1.7 | 0.0 | 63.8 | 63.8 | 0.00 | 0.15 | Sorted by score descending: 84, 73, 62, 50. The top rq-63 row shows Score 84. rq-63 \| Score \| 84 ANSWER: rq-63 \| Score \| 84 |
| `project-eval-table-wide-reorder` | Mantis | 3 | success | 1 | 19 | 2 | 16 | 0 | 2,725 | 8 | 9,265 | 0 | 56,576 | 4,441 | 1.6 | 0.0 | 431.4 | 431.4 | 0.00 | 0.23 | Sorted descending, the ledger's top row is rq-63 (Owner Mina, Region North, Notes Escalated). I verified visually that the 5th column header is "Score" and the  |
| `project-eval-table-native-pages` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,142 | 0 | 1,419 | 0 | 6,912 | 229 | 1.7 | 0.0 | 63.4 | 63.4 | 0.00 | 0.14 | Found batch-38 on page 2 of 2. batch-38 \| Units \| 39 ANSWER: batch-38 \| Units \| 39 |
| `project-eval-table-native-pages` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,142 | 0 | 1,430 | 0 | 6,912 | 279 | 1.7 | 0.0 | 64.1 | 64.1 | 0.00 | 0.20 | Page 2 of 2 contains batch-38. In the Units column, the value is 39. batch-38 \| Units \| 39 ANSWER: batch-38 \| Units \| 39 |
| `project-eval-table-native-pages` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,585 | 0 | 1,999 | 0 | 9,088 | 379 | 0.8 | 0.0 | 117.3 | 117.3 | 0.00 | 0.17 | I navigated to page 2 of 2, which contains batch-38. In the Units column, batch-38 shows the value 39. batch-38 \| Units \| 39 ANSWER: batch-38 \| Units \| 39 |
| `project-eval-feed-nested-grouped` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,458 | 0 | 1,774 | 0 | 9,600 | 269 | 1.0 | 0.0 | 117.7 | 117.7 | 0.00 | 0.16 | The South group was selected and Incident 18 acknowledged. The receipt shown is: ANSWER: incident-18 acknowledged. |
| `project-eval-feed-nested-grouped` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,529 | 0 | 2,079 | 0 | 12,160 | 353 | 1.0 | 0.0 | 119.7 | 119.7 | 0.00 | 0.13 | The South group was selected and Incident 18 acknowledged. The receipt shown is: ANSWER: incident-18 acknowledged. |
| `project-eval-feed-nested-grouped` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,529 | 0 | 2,056 | 0 | 12,160 | 330 | 0.7 | 0.0 | 118.2 | 118.2 | 0.00 | 0.15 | The South group was selected and Incident 18 acknowledged. The receipt shown is exactly: ANSWER: incident-18 acknowledged. |
| `project-eval-feed-recycled-dispatch` | Mantis | 1 | success | 1 | 10 | 0 | 11 | 0 | 4,207 | 0 | 4,412 | 0 | 27,648 | 767 | 0.7 | 0.0 | 180.6 | 180.6 | 0.00 | 0.13 | The receipt shown after pinning Dispatch 29 is the notification text. ANSWER: dispatch-29 pinned. |
| `project-eval-feed-recycled-dispatch` | Mantis | 2 | success | 1 | 13 | 0 | 14 | 0 | 5,429 | 0 | 5,586 | 0 | 39,552 | 927 | 0.8 | 0.0 | 296.9 | 296.9 | 0.00 | 0.18 | Dispatch 29 (lane 4) was located by scrolling the recycled feed and pinned. The receipt shown is: `dispatch-29 pinned.` ANSWER: dispatch-29 pinned. |
| `project-eval-feed-recycled-dispatch` | Mantis | 3 | success | 1 | 11 | 0 | 12 | 0 | 4,820 | 0 | 4,793 | 0 | 31,872 | 818 | 0.8 | 0.0 | 182.5 | 182.5 | 0.00 | 0.14 | I scrolled the recycled feed until Dispatch 29 appeared (row #53, "Dispatch 29 — lane 4 — pin"), clicked its pin button, and the page displayed the receipt. AN |
| `project-eval-chart-long-series` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,678 | 0 | 1,845 | 0 | 8,832 | 253 | 0.8 | 0.0 | 116.6 | 116.6 | 0.00 | 0.16 | Series: Approved capacity \| Week 42 \| 65 ANSWER: Approved capacity \| Week 42 \| 65 |
| `project-eval-chart-long-series` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,363 | 0 | 1,507 | 0 | 6,784 | 230 | 0.8 | 0.0 | 52.2 | 52.2 | 0.00 | 0.19 | The approved series is revealed. Reading the rendered chart data for Week 42: - Series: Approved capacity - Week: Week 42 - Value: 65 ANSWER: Approved capacit |
| `project-eval-chart-long-series` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 1,678 | 0 | 1,838 | 0 | 8,832 | 247 | 1.1 | 0.0 | 58.5 | 58.5 | 0.00 | 0.18 | Series: Approved capacity \| Week 42 \| 65 ANSWER: Approved capacity \| Week 42 \| 65 |
| `project-eval-chart-svg-selection` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,356 | 0 | 2,030 | 0 | 13,312 | 410 | 0.8 | 0.0 | 117.1 | 117.1 | 0.00 | 0.14 | The receipt reads exactly: ANSWER: April Meridian selected: 80 units. |
| `project-eval-chart-svg-selection` | Mantis | 2 | success | 1 | 13 | 1 | 14 | 0 | 2,334 | 1 | 5,218 | 0 | 34,176 | 1,531 | 1.0 | 0.0 | 175.7 | 175.7 | 0.00 | 0.13 | The April Meridian point was selected and the receipt reads exactly: **"April Meridian selected: 80 units."** ANSWER: April Meridian selected: 80 units. |
| `project-eval-chart-svg-selection` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,356 | 0 | 2,242 | 0 | 13,056 | 534 | 0.9 | 0.0 | 115.9 | 115.9 | 0.00 | 0.12 | I opened the page, verified the chart data (Apr 80), and selected April Meridian via the provided control. The page then displayed the receipt exactly: ANSWER: |
