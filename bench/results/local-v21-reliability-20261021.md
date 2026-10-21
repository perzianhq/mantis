# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 1; 10 runs in parallel.
- Scope: 6 tasks × 3 approaches × 1 runs = 18 logical runs; 18 recorded so far; 18 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 5 / 6 | 5 / 6 | 5 / 6 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 1 | 1 | 1 |
| Tool calls (including retries) | 35 | 22 | 29 |
| Sarvam API attempts (including retries) | 41 | 28 | 35 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 82.8 | 47.5 | 68.8 |
| Sarvam limiter queue / cooldown (total, s) | 182.1 / 0.0 | 150.6 / 0.0 | 203.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 71.2 / 0.0 | 37.1 / 0.0 | 58.5 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 1 | 0 | 0 |
| Browser observation text (observed chars) | 8,236 | 10,988 | 1,171 |
| Browser observation images (observed blocks) | 3 | 1 | 13 |
| Normal input tokens (total) | 14,906 | 11,428 | 18,781 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 95,872 | 77,440 | 55,168 |
| Output tokens (total) | 3,962 | 1,695 | 2,570 |
| Total input tokens incl. cache (legacy) | 110,778 | 88,868 | 73,949 |
| MCP startup (total, s) | 10.6 | 6.7 | 12.6 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 264.9 | 198.1 | 271.9 |
| CLI wall (total, s) | 264.9 | 198.1 | 271.9 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 1.9 | 1.7 | 1.7 |
| Harness capture (total, s) | 4.1 | 16.7 | 3.2 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.84 | 0.50 | 0.77 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v21-reliability-inline-prose-tail` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,594 | 0 | 1,140 | 0 | 5,248 | 187 | 1.9 | 0.0 | 4.9 | 4.9 | 0.00 | 0.25 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,423 | 0 | 1,227 | 0 | 7,424 | 195 | 1.3 | 0.0 | 5.2 | 5.2 | 0.00 | 0.26 | Juniper-829 |
| `v21-reliability-inline-prose-tail` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 155 | 2 | 2,797 | 0 | 5,504 | 285 | 2.4 | 0.0 | 7.4 | 7.4 | 0.00 | 0.26 | Juniper-829 |
| `v21-reliability-visible-prose` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 544 | 0 | 940 | 0 | 5,120 | 182 | 2.0 | 0.0 | 4.1 | 4.1 | 0.00 | 0.33 | Harbor-17 |
| `v21-reliability-visible-prose` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 917 | 0 | 1,109 | 0 | 7,424 | 190 | 1.3 | 0.0 | 6.0 | 6.0 | 0.00 | 0.26 | Harbor-17 |
| `v21-reliability-visible-prose` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 134 | 1 | 1,456 | 0 | 2,304 | 162 | 2.4 | 0.0 | 5.6 | 5.6 | 0.00 | 0.30 | Harbor-17 |
| `v21-reliability-recycled-control` | Mantis | 1 | wrong_answer | 1 | 7 | 0 | 8 | 0 | 2,048 | 0 | 2,708 | 0 | 17,152 | 490 | 2.0 | 0.0 | 64.8 | 64.8 | 0.00 | 0.27 | answer did not match the expected result |
| `v21-reliability-recycled-control` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 7 | 0 | 8 | 0 | 3,318 | 0 | 3,234 | 0 | 24,064 | 439 | 1.4 | 0.0 | 62.0 | 62.0 | 0.00 | 0.32 | Receipt: Cedar-73 completed. |
| `v21-reliability-recycled-control` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 233 | 4 | 5,717 | 0 | 21,120 | 584 | 2.5 | 0.0 | 73.9 | 73.9 | 0.00 | 0.24 | Receipt: Cedar-73 completed. |
| `v21-reliability-iframe-shadow-media` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 700 | 0 | 906 | 0 | 5,248 | 206 | 1.9 | 0.0 | 6.4 | 6.4 | 0.00 | 0.29 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 1,001 | 0 | 1,031 | 0 | 7,552 | 183 | 0.7 | 0.0 | 3.9 | 3.9 | 0.00 | 0.26 | 73 lux |
| `v21-reliability-iframe-shadow-media` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 146 | 1 | 1,470 | 0 | 2,304 | 248 | 1.9 | 0.0 | 57.7 | 57.7 | 0.00 | 0.26 | 73 lux |
| `v21-reliability-visible-chart-series` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 974 | 1 | 2,618 | 0 | 13,824 | 769 | 1.3 | 0.0 | 64.6 | 64.6 | 0.00 | 0.38 | 64 units |
| `v21-reliability-visible-chart-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 3 | 0 | 4 | 0 | 1,453 | 1 | 2,167 | 0 | 10,496 | 335 | 1.1 | 0.0 | 58.4 | 58.4 | 0.00 | 0.30 | 64 units |
| `v21-reliability-visible-chart-series` | Screenshots (click by x,y) | 1 | success | 1 | 2 | 0 | 3 | 0 | 148 | 1 | 1,477 | 0 | 2,304 | 196 | 1.8 | 0.0 | 55.9 | 55.9 | 0.00 | 0.31 | 64 units |
| `v21-reliability-nested-child-action` | Mantis | 1 | success | 1 | 16 | 1 | 17 | 0 | 2,376 | 2 | 6,594 | 0 | 49,280 | 2,128 | 1.4 | 0.0 | 120.1 | 120.1 | 0.00 | 0.37 | Request approved. |
| `v21-reliability-nested-child-action` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 2,876 | 0 | 2,660 | 0 | 20,480 | 353 | 0.8 | 0.0 | 62.5 | 62.5 | 0.00 | 0.28 | fixture check failed (5 observations) |
| `v21-reliability-nested-child-action` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 355 | 4 | 5,864 | 0 | 21,632 | 1,095 | 1.5 | 0.0 | 71.4 | 71.4 | 0.00 | 0.37 | fixture check failed (8 observations) |
