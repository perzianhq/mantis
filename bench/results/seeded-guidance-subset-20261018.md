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
| Tool calls (including retries) | 22 |
| Sarvam API attempts (including retries) | 28 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 7,524 |
| Browser observation images (observed blocks) | 1 |
| Normal input tokens (total) | 10,564 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 50,816 |
| Output tokens (total) | 1,768 |
| Total input tokens incl. cache (legacy) | 61,380 |
| MCP startup (total, s) | 12.1 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 48.3 |
| CLI wall (total, s) | 48.3 |
| Fixture verification (total, s) | 0.5 |
| Cleanup (total, s) | 1.0 |
| Harness capture (total, s) | 0.8 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 0.48 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 3,307 | 0 | 8,192 | 266 | 2.0 | 0.0 | 12.9 | 12.9 | 0.17 | 0.18 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,717 | 0 | 9,728 | 243 | 2.0 | 0.0 | 5.8 | 5.8 | 0.19 | 0.15 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,768 | 0 | 9,728 | 258 | 2.0 | 0.0 | 6.3 | 6.3 | 0.18 | 0.15 | ANSWER: The meeting moved to Friday at dusk. |
| `chart-march` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 537 | 0 | 1,059 | 0 | 7,040 | 260 | 2.0 | 0.0 | 6.7 | 6.7 | 0.00 | 0.15 | The chart shows monthly units sold for the first half of the year. According to the chart data, March (Mar) had 57 units sold. ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 429 | 0 | 1,064 | 0 | 7,040 | 313 | 2.0 | 0.0 | 8.4 | 8.4 | 0.00 | 0.19 | The chart's data confirms the value for March. - Jan: 18 - Feb: 25 - **Mar: 57** - Apr: 31 - May: 37 - Jun: 29 ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 417 | 1 | 1,649 | 0 | 9,088 | 428 | 2.0 | 0.0 | 8.2 | 8.2 | 0.00 | 0.16 | The chart shows monthly units sold, and the March bar reaches approximately 57 on the y-axis (between 50 and 60, closer to 57). This matches the chart's underly |
