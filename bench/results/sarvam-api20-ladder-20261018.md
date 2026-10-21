# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 5; 20 runs in parallel.
- Scope: 4 tasks × 1 approaches × 5 runs = 20 logical runs; 2 recorded so far; 2 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 2 / 2 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 4 |
| Sarvam API attempts (including retries) | 6 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 644 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,812 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 9,472 |
| Output tokens (total) | 299 |
| Total input tokens incl. cache (legacy) | 11,284 |
| MCP startup (total, s) | 5.6 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 124.2 |
| CLI wall (total, s) | 124.2 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.4 |
| Harness capture (total, s) | 0.3 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 0.08 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `plans-pick` | Mantis | 5 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 908 | 0 | 4,736 | 138 | 2.9 | 0.0 | 62.5 | 62.5 | 0.01 | 0.23 | The confirmation code is BIZ-77. ANSWER: BIZ-77 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 904 | 0 | 4,736 | 161 | 2.8 | 0.0 | 61.7 | 61.7 | 0.01 | 0.19 | The chart shows monthly sales for the first half of the year. For March, the value is 57 units. ANSWER: 57 |
