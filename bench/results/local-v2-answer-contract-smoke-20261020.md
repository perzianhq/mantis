# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 1; 3 runs in parallel.
- Scope: 1 tasks × 3 approaches × 1 runs = 3 logical runs; 2 recorded so far; 2 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 0 / 1 | 0 / 1 | 0 / 0 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 1 | 1 | 0 |
| Tool calls (including retries) | 3 | 4 | 0 |
| Sarvam API attempts (including retries) | 4 | 5 | 0 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 10.1 | 16.4 | unknown |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 | 0.0 / 0.0 | unknown |
| Sarvam active request / retry backoff (total, s) | 9.0 / 0.0 | 14.8 / 0.0 | unknown |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 3,200 | 18,527 | 0 |
| Browser observation images (observed blocks) | 0 | 0 | 0 |
| Normal input tokens (total) | 2,515 | 7,938 | unknown |
| Cache-write input tokens (total) | 0 | 0 | unknown |
| Cache-read input tokens (total) | 7,936 | 25,216 | unknown |
| Output tokens (total) | 418 | 686 | unknown |
| Total input tokens incl. cache (legacy) | 10,451 | 33,154 | unknown |
| MCP startup (total, s) | 0.9 | 1.4 | 0.0 |
| CLI startup (total, s) | 0.0 | 0.0 | unknown |
| CLI execution (total, s) | 10.1 | 16.4 | unknown |
| CLI wall (total, s) | 10.1 | 16.4 | unknown |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.1 | 0.2 | 0.0 |
| Harness capture (total, s) | 0.4 | 2.5 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.11 | 0.28 | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-sort-row` | Mantis | 1 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 3,200 | 0 | 2,515 | 0 | 7,936 | 418 | 0.9 | 0.0 | 10.1 | 10.1 | 0.00 | 0.14 | answer did not match the expected result |
| `v2-table-sort-row` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 4 | 0 | 5 | 0 | 18,527 | 0 | 7,938 | 0 | 25,216 | 686 | 1.4 | 0.0 | 16.4 | 16.4 | 0.00 | 0.15 | answer did not match the expected result |
