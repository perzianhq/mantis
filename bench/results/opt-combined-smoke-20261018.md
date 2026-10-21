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
| Tool calls (including retries) | 65 |
| Sarvam API attempts (including retries) | 62 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 79,940 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 45,384 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 298,880 |
| Output tokens (total) | 8,594 |
| Total input tokens incl. cache (legacy) | 344,264 |
| MCP startup (total, s) | 4.2 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 128.1 |
| CLI wall (total, s) | 128.1 |
| Fixture verification (total, s) | 1.6 |
| Cleanup (total, s) | 0.9 |
| Harness capture (total, s) | 3.2 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 2.19 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `signup-validation` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 1,146 | 0 | 2,245 | 0 | 13,312 | 493 | 0.7 | 0.0 | 10.1 | 10.1 | 0.06 | 0.15 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,245 | 0 | 13,312 | 507 | 0.7 | 0.0 | 8.8 | 8.8 | 0.06 | 0.16 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** After retrying with `strongpass456`, the account  |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,174 | 0 | 13,312 | 481 | 0.7 | 0.0 | 12.0 | 12.0 | 0.06 | 0.15 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 19,388 | 0 | 9,634 | 0 | 52,608 | 1,373 | 0.7 | 0.0 | 30.8 | 30.8 | 0.47 | 0.15 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** I made exactly the six requested changes (and nothing else): - Inez Cruz → Editor - L |
| `long-admin` | Mantis | 2 | success | 1 | 17 | 0 | 15 | 0 | 28,600 | 0 | 14,897 | 0 | 105,344 | 3,117 | 0.7 | 0.0 | 35.0 | 35.0 | 0.50 | 0.16 | The save succeeded. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** I made exactly the six requested changes (and nothing else): - I |
| `long-admin` | Mantis | 3 | success | 1 | 17 | 0 | 15 | 0 | 28,600 | 0 | 14,189 | 0 | 100,992 | 2,623 | 0.7 | 0.0 | 31.3 | 31.3 | 0.49 | 0.15 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** I made exactly the six requested changes (verified across all three pages before savi |
