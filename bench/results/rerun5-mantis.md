# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-17; runs per task and approach: 1; 2 runs in parallel.
- Scope: 1 tasks × 1 approaches × 1 runs = 1 logical runs; 1 recorded so far; 1 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 1 / 1 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 4 |
| Sarvam API attempts (including retries) | 5 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 702 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,447 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 8,576 |
| Output tokens (total) | 208 |
| Total input tokens incl. cache (legacy) | 10,023 |
| MCP startup (total, s) | 2.0 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 11.1 |
| CLI wall (total, s) | 11.1 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.3 |
| Harness capture (total, s) | 0.7 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 0.06 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `cookie-cart` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 702 | 0 | 1,447 | 0 | 8,576 | 208 | 2.0 | 0.0 | 11.1 | 11.1 | 0.00 | 0.27 | The product was added successfully. ANSWER: Added to cart (1 item). |
