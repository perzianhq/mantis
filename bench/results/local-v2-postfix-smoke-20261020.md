# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 1; 3 runs in parallel.
- Scope: 3 tasks × 3 approaches × 1 runs = 9 logical runs; 9 recorded so far; 9 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 3 / 3 | 3 / 3 | 3 / 3 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 17 | 17 | 38 |
| Sarvam API attempts (including retries) | 20 | 20 | 41 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 33.7 | 34.4 | 95.5 |
| Sarvam limiter queue / cooldown (total, s) | 30.0 / 0.0 | 0.0 / 0.0 | 60.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 29.8 / 0.0 | 29.0 / 0.0 | 87.4 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 5,323 | 11,586 | 861 |
| Browser observation images (observed blocks) | 1 | 0 | 17 |
| Normal input tokens (total) | 7,209 | 8,985 | 27,869 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 39,424 | 61,952 | 110,336 |
| Output tokens (total) | 2,195 | 1,253 | 5,822 |
| Total input tokens incl. cache (legacy) | 46,633 | 70,937 | 138,205 |
| MCP startup (total, s) | 2.2 | 1.4 | 3.1 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 63.7 | 34.4 | 155.6 |
| CLI wall (total, s) | 63.7 | 34.4 | 155.6 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.5 | 0.4 | 0.4 |
| Harness capture (total, s) | 0.9 | 11.8 | 2.1 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.43 | 0.39 | 1.36 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-paginated-filter` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,247 | 0 | 2,910 | 0 | 15,232 | 1,187 | 0.8 | 0.0 | 16.7 | 16.7 | 0.00 | 0.18 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 7,086 | 0 | 4,706 | 0 | 31,104 | 589 | 0.5 | 0.0 | 17.4 | 17.4 | 0.00 | 0.15 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-list-paginated-filter` | Screenshots (click by x,y) | 1 | success | 1 | 19 | 0 | 20 | 0 | 283 | 9 | 16,705 | 0 | 67,584 | 1,193 | 1.1 | 0.0 | 63.1 | 63.1 | 0.00 | 0.14 | request-032 \| Select \| Request 032 (North) selected. |
| `v2-chart-svg-series` | Mantis | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,012 | 1 | 2,195 | 0 | 11,008 | 546 | 0.7 | 0.0 | 7.3 | 7.3 | 0.00 | 0.14 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,963 | 0 | 1,388 | 0 | 7,424 | 200 | 0.5 | 0.0 | 5.0 | 5.0 | 0.00 | 0.15 | South \| Mar \| 39 |
| `v2-chart-svg-series` | Screenshots (click by x,y) | 1 | success | 1 | 9 | 0 | 10 | 0 | 353 | 4 | 5,790 | 0 | 22,912 | 4,115 | 1.0 | 0.0 | 74.5 | 74.5 | 0.00 | 0.14 | South \| Mar \| 39 |
| `v2-interaction-overlay-modal` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,064 | 0 | 2,104 | 0 | 13,184 | 462 | 0.7 | 0.0 | 39.6 | 39.6 | 0.00 | 0.13 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,537 | 0 | 2,891 | 0 | 23,424 | 464 | 0.4 | 0.0 | 12.0 | 12.0 | 0.00 | 0.14 | Project renamed to Aurora. |
| `v2-interaction-overlay-modal` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 225 | 4 | 5,374 | 0 | 19,840 | 514 | 1.0 | 0.0 | 18.0 | 18.0 | 0.00 | 0.14 | Project renamed to Aurora. |
