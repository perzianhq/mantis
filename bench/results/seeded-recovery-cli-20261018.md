# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 1 runs in parallel.
- Scope: 2 tasks × 1 approaches × 1 runs = 2 logical runs; 2 recorded so far; 2 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Screenshots (click by x,y) |
|---|---:|
| Correct | 2 / 2 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 189 |
| Sarvam API attempts (including retries) | 191 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 2,600 |
| Browser observation images (observed blocks) | 58 |
| Normal input tokens (total) | 428,273 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,687,424 |
| Output tokens (total) | 17,600 |
| Total input tokens incl. cache (legacy) | 2,115,697 |
| MCP startup (total, s) | 4.0 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 390.7 |
| CLI wall (total, s) | 390.7 |
| Fixture verification (total, s) | 7.8 |
| Cleanup (total, s) | 0.5 |
| Harness capture (total, s) | 14.5 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 13.40 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `long-admin` | Screenshots (click by x,y) | 1 | success | 1 | 99 | 0 | 100 | 0 | 1,278 | 30 | 241,762 | 0 | 1,017,600 | 11,230 | 2.0 | 0.0 | 208.7 | 208.7 | 3.66 | 0.23 | The save was successful. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** ANSWER: Saved 6 changes. Change set C-5365. |
| `long-onboard` | Screenshots (click by x,y) | 1 | success | 1 | 90 | 0 | 91 | 0 | 1,322 | 28 | 186,511 | 0 | 669,824 | 6,370 | 2.0 | 0.0 | 182.0 | 182.0 | 4.11 | 0.27 | The workspace was created successfully. **Workspace W-8780 created for Aster Works (Growth, yearly, 3 invites).** Summary of what was set up: - **Company:** A |
