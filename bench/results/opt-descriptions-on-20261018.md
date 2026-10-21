# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 1 runs in parallel.
- Scope: 2 tasks × 1 approaches × 3 runs = 6 logical runs; 6 recorded so far; 6 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 6 / 6 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 25 |
| Sarvam API attempts (including retries) | 31 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 4,346 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 9,080 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 56,320 |
| Output tokens (total) | 2,017 |
| Total input tokens incl. cache (legacy) | 65,400 |
| MCP startup (total, s) | 4.4 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 56.0 |
| CLI wall (total, s) | 56.0 |
| Fixture verification (total, s) | 0.2 |
| Cleanup (total, s) | 1.0 |
| Harness capture (total, s) | 0.9 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 0.47 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 1,986 | 0 | 13,440 | 465 | 0.7 | 0.0 | 8.1 | 8.1 | 0.05 | 0.17 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded — the pag |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,143 | 0 | 13,312 | 484 | 0.7 | 0.0 | 9.0 | 9.0 | 0.05 | 0.16 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,164 | 0 | 13,312 | 494 | 0.7 | 0.0 | 13.7 | 13.7 | 0.07 | 0.16 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** After retrying with `strongpass456`, the account  |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 779 | 0 | 4,864 | 146 | 0.8 | 0.0 | 3.3 | 3.3 | 0.00 | 0.18 | The chart shows units sold per month. For March, the value is 57. ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 397 | 0 | 1,234 | 0 | 6,528 | 296 | 0.7 | 0.0 | 5.2 | 5.2 | 0.00 | 0.19 | The chart data extraction shows the "Units sold" values for each month: - Jan: 18 - Feb: 25 - **Mar: 57** - Apr: 31 - May: 37 - Jun: 29 ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 774 | 0 | 4,864 | 132 | 0.7 | 0.0 | 16.7 | 16.7 | 0.00 | 0.16 | ANSWER: 57 |
