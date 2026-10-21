# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 1 runs in parallel.
- Scope: 1 tasks × 1 approaches × 3 runs = 3 logical runs; 3 recorded so far; 3 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 3 / 3 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 52 |
| Sarvam API attempts (including retries) | 48 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 76,070 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 41,160 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 333,696 |
| Output tokens (total) | 8,205 |
| Total input tokens incl. cache (legacy) | 374,856 |
| MCP startup (total, s) | 2.3 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 102.2 |
| CLI wall (total, s) | 102.2 |
| Fixture verification (total, s) | 2.0 |
| Cleanup (total, s) | 0.5 |
| Harness capture (total, s) | 2.3 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 2.06 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `long-admin` | Mantis | 1 | success | 1 | 19 | 0 | 19 | 0 | 22,837 | 0 | 13,572 | 0 | 120,320 | 2,745 | 0.8 | 0.0 | 38.3 | 38.3 | 0.75 | 0.16 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** All requested edits were applied and saved: - Inez Cruz → Editor - Lara Shah → Editor |
| `long-admin` | Mantis | 2 | success | 1 | 12 | 0 | 10 | 0 | 15,189 | 0 | 8,475 | 0 | 46,592 | 1,809 | 0.7 | 0.0 | 22.0 | 22.0 | 0.62 | 0.20 | All six changes were made and saved. The confirmation banner reads: **"Saved 6 changes. Change set C-5365."** Details of what was changed (exactly the six req |
| `long-admin` | Mantis | 3 | success | 1 | 21 | 0 | 19 | 0 | 38,044 | 0 | 19,113 | 0 | 166,784 | 3,651 | 0.8 | 0.0 | 41.8 | 41.8 | 0.61 | 0.17 | All six changes are saved and verified across the three pages, with no other rows modified: - Inez Cruz → Editor - Lara Shah → Editor - Ravi Mehta → Admin - Ow |
