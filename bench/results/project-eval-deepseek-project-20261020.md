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
| Tool calls (including retries) | 145 |
| Sarvam API attempts (including retries) | 155 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 366.2 |
| Sarvam limiter queue / cooldown (total, s) | 2516.2 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 328.6 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 16 |
| Browser observation text (observed chars) | 62,561 |
| Browser observation images (observed blocks) | 3 |
| Normal input tokens (total) | 80,081 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 595,840 |
| Output tokens (total) | 29,690 |
| Total input tokens incl. cache (legacy) | 675,921 |
| MCP startup (total, s) | 19.1 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 2882.4 |
| CLI wall (total, s) | 2882.4 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 3.1 |
| Harness capture (total, s) | 13.7 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 5.42 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `project-eval-table-wide-reorder` | Mantis | 1 | success | 1 | 5 | 1 | 6 | 0 | 1,979 | 0 | 2,654 | 0 | 13,824 | 921 | 1.6 | 0.0 | 64.4 | 64.4 | 0.00 | 0.19 | Sorted by Score descending. The ledger now reads: rq-63 (Mina, 84), rq-08 (73), rq-63 (Oren, 62), rq-19 (50). For rq-63, the Score column value is 84. ANSWER:  |
| `project-eval-table-wide-reorder` | Mantis | 2 | success | 1 | 4 | 1 | 5 | 0 | 1,370 | 0 | 2,063 | 0 | 10,880 | 778 | 1.7 | 0.0 | 123.2 | 123.2 | 0.00 | 0.16 | Sorted by score descending, the ledger order is: rq-63 (Mina, 84), rq-08 (73), rq-63 (Oren, 62), rq-19 (50). For rq-63, the Score column value is 84. ANSWER:  |
| `project-eval-table-wide-reorder` | Mantis | 3 | success | 1 | 6 | 1 | 7 | 0 | 2,794 | 0 | 3,086 | 0 | 17,024 | 1,085 | 1.7 | 0.0 | 124.0 | 124.0 | 0.00 | 0.15 | Sorted by score descending (84, 73, 62, 50). The top rq-63 row is Mina / North / Escalated with Score 84. ANSWER: rq-63 \| Score \| 84 |
| `project-eval-table-native-pages` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,142 | 0 | 1,351 | 0 | 8,320 | 269 | 1.6 | 0.0 | 64.6 | 64.6 | 0.00 | 0.20 | The page containing batch-38 is page 2 of 2. In the Units column, batch-38 has the value 39. ANSWER: batch-38 \| Units \| 39 |
| `project-eval-table-native-pages` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,585 | 0 | 1,753 | 0 | 11,008 | 363 | 1.7 | 0.0 | 64.1 | 64.1 | 0.00 | 0.20 | The page containing batch-38 is page 2 of 2. In the Units column, batch-38 has the value 39. ANSWER: batch-38 \| Units \| 39 |
| `project-eval-table-native-pages` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,142 | 0 | 1,373 | 0 | 8,320 | 237 | 1.0 | 0.0 | 60.3 | 60.3 | 0.00 | 0.16 | The page containing batch-38 is page 2 of 2. In the Units column, batch-38 has value 39. ANSWER: batch-38 \| Units \| 39 |
| `project-eval-feed-nested-grouped` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,458 | 0 | 2,041 | 0 | 11,008 | 269 | 1.0 | 0.0 | 117.2 | 117.2 | 0.00 | 0.16 | The South group was selected and Incident 18 acknowledged. The receipt shown is: ANSWER: incident-18 acknowledged. |
| `project-eval-feed-nested-grouped` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,529 | 0 | 2,276 | 0 | 13,952 | 359 | 0.9 | 0.0 | 118.2 | 118.2 | 0.00 | 0.16 | I selected the South incident group and acknowledged Incident 18 via its nested list action. The receipt shown was: `incident-18 acknowledged.` ANSWER: incide |
| `project-eval-feed-nested-grouped` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,458 | 0 | 2,041 | 0 | 11,008 | 276 | 0.8 | 0.0 | 118.4 | 118.4 | 0.00 | 0.17 | I selected the South group and acknowledged Incident 18. The receipt shown was: "incident-18 acknowledged." ANSWER: incident-18 acknowledged. |
| `project-eval-feed-recycled-dispatch` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 2,573 | 0 | 2,674 | 0 | 16,768 | 427 | 0.8 | 0.0 | 176.6 | 176.6 | 0.00 | 0.18 | Dispatch 29 was located by scrolling the recycled feed and pinned. The receipt shown is: **`dispatch-29 pinned.`** ANSWER: dispatch-29 pinned. |
| `project-eval-feed-recycled-dispatch` | Mantis | 2 | success | 1 | 10 | 0 | 11 | 0 | 4,207 | 0 | 4,159 | 0 | 31,104 | 652 | 0.7 | 0.0 | 294.4 | 294.4 | 0.00 | 0.19 | Dispatch 29 was located by scrolling the recycled feed and pinned. The receipt shown is: `dispatch-29 pinned.` ANSWER: dispatch-29 pinned. |
| `project-eval-feed-recycled-dispatch` | Mantis | 3 | success | 1 | 7 | 1 | 8 | 0 | 2,768 | 0 | 2,859 | 0 | 19,712 | 444 | 0.8 | 0.0 | 177.8 | 177.8 | 0.00 | 0.17 | I scrolled the recycled feed until Dispatch 29 appeared, then pinned it. The receipt shown is: **`dispatch-29 pinned.`** ANSWER: dispatch-29 pinned. |
| `project-eval-chart-long-series` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,363 | 0 | 1,587 | 0 | 8,064 | 244 | 0.8 | 0.0 | 120.2 | 120.2 | 0.00 | 0.15 | The approved series is revealed. Reading the rendered chart data for Week 42: - Series: Approved capacity - Week: Week 42 - Value: 65 ANSWER: Approved capacit |
| `project-eval-chart-long-series` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,363 | 0 | 1,576 | 0 | 8,064 | 264 | 0.8 | 0.0 | 120.8 | 120.8 | 0.00 | 0.15 | The approved series is revealed. Reading the rendered chart data: - Series: **Approved capacity** - Week 42 value: **65** ANSWER: Approved capacity \| Week 42  |
| `project-eval-chart-long-series` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,363 | 0 | 1,585 | 0 | 8,064 | 254 | 0.9 | 0.0 | 60.2 | 60.2 | 0.00 | 0.34 | The approved series is revealed. Reading the chart data for Week 42: - Series: **Approved capacity** - Week: **Week 42** - Value: **65** ANSWER: Approved capa |
| `project-eval-chart-svg-selection` | Mantis | 1 | success | 1 | 17 | 2 | 18 | 0 | 7,409 | 1 | 9,720 | 0 | 64,512 | 3,975 | 0.8 | 0.0 | 370.9 | 370.9 | 0.00 | 0.13 | I inspected the page and its source. The chart's April point (circle at cx=420, cy=105) has no click handler; the only interactive control is the "Select April  |
| `project-eval-chart-svg-selection` | Mantis | 2 | success | 1 | 26 | 7 | 25 | 0 | 14,086 | 1 | 23,150 | 0 | 182,912 | 13,360 | 0.8 | 0.0 | 384.0 | 384.0 | 0.00 | 0.12 | I selected April Meridian (the visible April point in the chart, value 80) and the page's status receipt reads exactly: **April Meridian selected: 80 units.**  |
| `project-eval-chart-svg-selection` | Mantis | 3 | success | 1 | 32 | 3 | 27 | 0 | 9,972 | 1 | 14,133 | 0 | 151,296 | 5,513 | 0.9 | 0.0 | 322.8 | 322.8 | 0.00 | 0.12 | I opened the page, inspected the rendered chart (a single visible April point at value 80), and selected April Meridian via the provided control. The receipt sh |
