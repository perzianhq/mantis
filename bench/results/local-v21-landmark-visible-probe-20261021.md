# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 3; 4 runs in parallel.
- Scope: 4 exact recovery rows = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Exact rows: `v2-reading-landmark-jump|mantis|2`, `v2-reading-landmark-jump|mantis|3`, `v2-reading-landmark-jump|screenshot|1`, `v2-reading-landmark-jump|screenshot|2`.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 2 / 2 | 0 / 0 | 2 / 2 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 16 | 0 | 35 |
| Sarvam API attempts (including retries) | 18 | 0 | 37 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 38.5 | unknown | 85.6 |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 | unknown | 11.7 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 33.8 / 0.0 | unknown | 77.4 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 4,581 | 0 | 727 |
| Browser observation images (observed blocks) | 0 | 0 | 14 |
| Normal input tokens (total) | 6,159 | unknown | 25,623 |
| Cache-write input tokens (total) | 0 | unknown | 0 |
| Cache-read input tokens (total) | 40,320 | unknown | 131,712 |
| Output tokens (total) | 1,104 | unknown | 2,278 |
| Total input tokens incl. cache (legacy) | 46,479 | unknown | 157,335 |
| MCP startup (total, s) | 1.9 | 0.0 | 2.5 |
| CLI startup (total, s) | 0.0 | unknown | 0.0 |
| CLI execution (total, s) | 38.5 | unknown | 97.3 |
| CLI wall (total, s) | 38.5 | unknown | 97.3 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.0 | 0.3 |
| Harness capture (total, s) | 2.0 | 0.0 | 2.9 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.29 | unknown | 0.95 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | success | 1 | 11 | 0 | 12 | 0 | 249 | 5 | 6,433 | 0 | 28,928 | 624 | 1.2 | 0.0 | 26.7 | 26.7 | 0.00 | 0.15 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Mantis | 2 | success | 1 | 7 | 0 | 8 | 0 | 1,887 | 0 | 2,716 | 0 | 16,768 | 436 | 1.0 | 0.0 | 14.8 | 14.8 | 0.00 | 0.15 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | success | 1 | 24 | 0 | 25 | 0 | 478 | 9 | 19,190 | 0 | 102,784 | 1,654 | 1.2 | 0.0 | 70.6 | 70.6 | 0.00 | 0.15 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Mantis | 3 | success | 1 | 9 | 0 | 10 | 0 | 2,694 | 0 | 3,443 | 0 | 23,552 | 668 | 0.9 | 0.0 | 23.6 | 23.6 | 0.00 | 0.15 | Current program release: Ember-985 |
