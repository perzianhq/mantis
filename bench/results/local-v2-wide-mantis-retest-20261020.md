# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 3; 3 runs in parallel.
- Scope: 1 tasks × 1 approaches × 3 runs = 3 logical runs; 3 recorded so far; 3 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 0 / 3 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 3 |
| Tool calls (including retries) | 26 |
| Sarvam API attempts (including retries) | 29 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 54.3 |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 51.1 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 50,061 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 35,732 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 145,920 |
| Output tokens (total) | 4,762 |
| Total input tokens incl. cache (legacy) | 181,652 |
| MCP startup (total, s) | 2.5 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 54.3 |
| CLI wall (total, s) | 54.3 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.4 |
| Harness capture (total, s) | 2.8 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 1.47 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-table-wide-column` | Mantis | 1 | wrong_answer | 1 | 14 | 0 | 15 | 0 | 22,972 | 0 | 15,944 | 0 | 81,408 | 1,902 | 0.8 | 0.0 | 23.8 | 23.8 | 0.00 | 0.13 | fixture check failed (9 observations) |
| `v2-table-wide-column` | Mantis | 2 | wrong_answer | 1 | 3 | 0 | 4 | 0 | 12,286 | 0 | 7,878 | 0 | 7,296 | 675 | 0.9 | 0.0 | 7.7 | 7.7 | 0.00 | 0.15 | fixture check failed (1 observations) |
| `v2-table-wide-column` | Mantis | 3 | wrong_answer | 1 | 9 | 0 | 10 | 0 | 14,803 | 0 | 11,910 | 0 | 57,216 | 2,185 | 0.8 | 0.0 | 22.9 | 22.9 | 0.00 | 0.14 | fixture check failed (1 observations) |
