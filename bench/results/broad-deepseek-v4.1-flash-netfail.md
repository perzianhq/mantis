# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-17; runs per task and approach: 3; 2 runs in parallel.
- Scope: 25 tasks × 3 approaches × 3 runs = 225 logical runs; 12 recorded so far; 12 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 0 / 4 | 0 / 4 | 0 / 4 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 4 | 4 | 4 |
| Tool calls (including retries) | 0 | 0 | 0 |
| Sarvam API attempts (including retries) | 0 | 0 | 0 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 0 | 0 | 0 |
| Browser observation images (observed blocks) | 0 | 0 | 0 |
| Normal input tokens (total) | unknown | unknown | unknown |
| Cache-write input tokens (total) | unknown | unknown | unknown |
| Cache-read input tokens (total) | unknown | unknown | unknown |
| Output tokens (total) | unknown | unknown | unknown |
| Total input tokens incl. cache (legacy) | unknown | unknown | unknown |
| MCP startup (total, s) | 8.1 | 8.1 | 8.0 |
| CLI startup (total, s) | unknown | unknown | unknown |
| CLI execution (total, s) | unknown | unknown | unknown |
| CLI wall (total, s) | unknown | unknown | unknown |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.2 | 0.2 | 0.2 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | unknown | unknown | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `form-subscribe` | Screenshots (click by x,y) | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `form-subscribe` | Mantis | 2 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.05 | Sarvam network request failed |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 2 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `form-subscribe` | Screenshots (click by x,y) | 2 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.05 | Sarvam network request failed |
| `form-subscribe` | Mantis | 3 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 3 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.05 | Sarvam network request failed |
| `form-subscribe` | Screenshots (click by x,y) | 3 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `login` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
| `login` | Accessibility tree (Playwright MCP) | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.05 | Sarvam network request failed |
| `login` | Screenshots (click by x,y) | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.0 | unknown | unknown | unknown | 0.00 | 0.06 | Sarvam network request failed |
