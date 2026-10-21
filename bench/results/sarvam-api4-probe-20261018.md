# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 4 runs in parallel.
- Scope: 4 tasks × 1 approaches × 1 runs = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 4 / 4 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 38 |
| Sarvam API attempts (including retries) | 42 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 35,743 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 24,617 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 317,184 |
| Output tokens (total) | 5,422 |
| Total input tokens incl. cache (legacy) | 341,801 |
| MCP startup (total, s) | 3.9 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 131.9 |
| CLI wall (total, s) | 131.9 |
| Fixture verification (total, s) | 0.8 |
| Cleanup (total, s) | 0.6 |
| Harness capture (total, s) | 3.8 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 1.34 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,907 | 0 | 9,216 | 243 | 1.0 | 0.0 | 14.3 | 14.3 | 0.09 | 0.15 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,253 | 0 | 6,528 | 177 | 0.9 | 0.0 | 10.4 | 10.4 | 0.01 | 0.16 | I clicked the Business plan ($15/month) and the page confirmed the selection. ANSWER: BIZ-77 |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 776 | 0 | 4,864 | 208 | 1.0 | 0.0 | 9.4 | 9.4 | 0.00 | 0.17 | The chart is a Chart.js bar chart titled "Monthly sales, first half of the year." Its data labels show: - Jan: 18 - Feb: 25 - **Mar: 57** - Apr: 31 - May: 37 - |
| `long-admin` | Mantis | 1 | success | 1 | 29 | 0 | 30 | 0 | 32,778 | 0 | 20,681 | 0 | 296,576 | 4,794 | 1.0 | 0.0 | 97.9 | 97.9 | 0.71 | 0.13 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Summary of what I did (6 changes, nobody else touched): - Inez Cruz (ivy.chen@corp.te |
