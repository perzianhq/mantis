# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 1; 10 runs in parallel.
- Scope: 1 tasks × 1 approaches × 1 runs = 1 logical runs; 1 recorded so far; 1 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 0 / 1 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 1 |
| Tool calls (including retries) | 13 |
| Sarvam API attempts (including retries) | 14 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 39.3 |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 37.7 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 1 |
| Browser observation text (observed chars) | 1,851 |
| Browser observation images (observed blocks) | 3 |
| Normal input tokens (total) | 8,864 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 44,032 |
| Output tokens (total) | 4,288 |
| Total input tokens incl. cache (legacy) | 52,896 |
| MCP startup (total, s) | 0.8 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 39.3 |
| CLI wall (total, s) | 39.3 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.2 |
| Harness capture (total, s) | 1.5 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 0.69 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `project-eval-table-wide-reorder` | Mantis | 1 | wrong_answer | 1 | 13 | 1 | 14 | 0 | 1,851 | 3 | 8,864 | 0 | 44,032 | 4,288 | 0.8 | 0.0 | 39.3 | 39.3 | 0.00 | 0.16 | required visible workflow state was not reached |
