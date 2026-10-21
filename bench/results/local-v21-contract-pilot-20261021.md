# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 1; 10 runs in parallel.
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
| Correct | 2 / 3 | 2 / 3 | 2 / 3 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 1 | 1 | 1 |
| Tool calls (including retries) | 46 | 62 | 20 |
| Sarvam API attempts (including retries) | 42 | 64 | 23 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 121.9 | 309.2 | 53.8 |
| Sarvam limiter queue / cooldown (total, s) | 94.3 / 0.0 | 143.5 / 0.0 | 95.0 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 110.2 / 0.0 | 292.8 / 0.0 | 46.1 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 2 | 5 | 0 |
| Browser observation text (observed chars) | 7,368 | 23,837 | 589 |
| Browser observation images (observed blocks) | 3 | 9 | 9 |
| Normal input tokens (total) | 18,130 | 49,759 | 12,250 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 148,480 | 840,064 | 37,632 |
| Output tokens (total) | 6,987 | 25,250 | 1,610 |
| Total input tokens incl. cache (legacy) | 166,610 | 889,823 | 49,882 |
| MCP startup (total, s) | 5.8 | 4.0 | 7.5 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 216.1 | 452.7 | 148.8 |
| CLI wall (total, s) | 216.1 | 452.7 | 148.8 |
| Fixture verification (total, s) | 0.0 | 0.2 | 0.0 |
| Cleanup (total, s) | 0.9 | 0.9 | 1.0 |
| Harness capture (total, s) | 4.1 | 35.9 | 1.2 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 1.26 | 4.32 | 0.49 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v21-reliability-recycled-control` | Mantis | 1 | success | 1 | 7 | 0 | 8 | 0 | 2,034 | 0 | 2,616 | 0 | 17,280 | 482 | 1.9 | 0.0 | 12.5 | 12.5 | 0.00 | 0.34 | Cedar-73 completed. |
| `v21-reliability-recycled-control` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 3,300 | 0 | 3,260 | 0 | 24,192 | 517 | 1.3 | 0.0 | 66.8 | 66.8 | 0.00 | 0.28 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 233 | 4 | 5,494 | 0 | 21,248 | 575 | 2.5 | 0.0 | 71.2 | 71.2 | 0.00 | 0.29 | Cedar-73 completed. |
| `v21-reliability-visible-chart-series` | Mantis | 1 | wrong_answer | 1 | 29 | 1 | 23 | 0 | 3,888 | 1 | 11,296 | 0 | 104,704 | 5,334 | 2.0 | 0.0 | 130.4 | 130.4 | 0.00 | 0.28 | answer did not match the expected result |
| `v21-reliability-visible-chart-series` | Accessibility tree (Playwright MCP) | 1 | step_limit | 1 | 50 | 5 | 50 | 0 | 18,128 | 8 | 43,093 | 0 | 797,056 | 24,026 | 1.4 | 0.0 | 317.9 | 317.9 | 0.21 | 0.33 | agent step budget exhausted at 50 steps |
| `v21-reliability-visible-chart-series` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 189 | 3 | 3,991 | 0 | 10,752 | 715 | 2.5 | 0.0 | 69.7 | 69.7 | 0.00 | 0.33 | answer did not match the expected result |
| `v21-reliability-nested-child-action` | Mantis | 1 | success | 1 | 10 | 1 | 11 | 0 | 1,446 | 2 | 4,218 | 0 | 26,496 | 1,171 | 2.0 | 0.0 | 73.2 | 73.2 | 0.00 | 0.27 | Request approved. |
| `v21-reliability-nested-child-action` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,409 | 1 | 3,406 | 0 | 18,816 | 707 | 1.4 | 0.0 | 67.9 | 67.9 | 0.00 | 0.28 | Request approved. |
| `v21-reliability-nested-child-action` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 167 | 2 | 2,765 | 0 | 5,632 | 320 | 2.5 | 0.0 | 7.9 | 7.9 | 0.00 | 0.35 | Request approved. |
