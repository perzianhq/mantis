# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 1; 10 runs in parallel.
- Scope: 1 tasks × 3 approaches × 1 runs = 3 logical runs; 3 recorded so far; 3 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 1 / 1 | 1 / 1 | 1 / 1 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 3 | 12 | 4 |
| Sarvam API attempts (including retries) | 4 | 13 | 5 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 6.3 | 32.0 | 8.0 |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 | 0.0 / 0.0 | 0.0 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 4.9 / 0.0 | 29.5 / 0.0 | 5.9 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 1 | 0 |
| Browser observation text (observed chars) | 807 | 3,843 | 169 |
| Browser observation images (observed blocks) | 0 | 2 | 2 |
| Normal input tokens (total) | 1,265 | 7,168 | 2,765 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 7,168 | 57,856 | 5,504 |
| Output tokens (total) | 253 | 2,302 | 271 |
| Total input tokens incl. cache (legacy) | 8,433 | 65,024 | 8,269 |
| MCP startup (total, s) | 1.2 | 0.7 | 1.7 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 6.3 | 32.0 | 8.0 |
| CLI wall (total, s) | 6.3 | 32.0 | 8.0 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.3 | 0.3 |
| Harness capture (total, s) | 0.2 | 6.5 | 0.2 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.06 | 0.45 | 0.10 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v21-reliability-visible-chart-series` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 807 | 0 | 1,265 | 0 | 7,168 | 253 | 1.2 | 0.0 | 6.3 | 6.3 | 0.00 | 0.28 | 64 units |
| `v21-reliability-visible-chart-series` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 12 | 1 | 13 | 0 | 3,843 | 2 | 7,168 | 0 | 57,856 | 2,302 | 0.7 | 0.0 | 32.0 | 32.0 | 0.00 | 0.27 | 64 units |
| `v21-reliability-visible-chart-series` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 169 | 2 | 2,765 | 0 | 5,504 | 271 | 1.7 | 0.0 | 8.0 | 8.0 | 0.00 | 0.28 | 64 units |
