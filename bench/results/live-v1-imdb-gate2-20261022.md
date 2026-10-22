# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-22; runs per task and approach: 3; 10 runs in parallel.
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
| Correct | 2 / 3 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 1 |
| Tool calls (including retries) | 104 |
| Sarvam API attempts (including retries) | 105 |
| Sarvam HTTP 429 responses | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 657.6 |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 515.0 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown |
| Sarvam wall-cap timeouts | 0 |
| MCP tool errors (including retries) | 1 |
| Browser observation text (observed chars) | 63,952 |
| Browser observation images (observed blocks) | 13 |
| Normal input tokens (total) | 88,181 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,090,304 |
| Output tokens (total) | 45,620 |
| Total input tokens incl. cache (legacy) | 1,178,485 |
| MCP startup (total, s) | 2.7 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 657.6 |
| CLI wall (total, s) | 657.6 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.5 |
| Harness capture (total, s) | 9.0 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 7.54 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-interactive-imdb-search` | Mantis | 1 | step_limit | 1 | 50 | 0 | 50 | 0 | 14,252 | 8 | 25,406 | 0 | 530,432 | 9,825 | 0.9 | 0.0 | 196.3 | 196.3 | 0.00 | 0.14 | agent step budget exhausted at 50 steps |
| `livev1-interactive-imdb-search` | Mantis | 2 | success | 1 | 41 | 1 | 43 | 0 | 39,370 | 5 | 55,011 | 0 | 520,960 | 32,974 | 0.9 | 0.0 | 387.4 | 387.4 | 0.00 | 0.14 | I've completed my investigation. Here's what happened and what is currently visible. **What I did:** 1. Started at `https://www.imdb.com/` — IMDb immediately s |
| `livev1-interactive-imdb-search` | Mantis | 3 | success | 1 | 13 | 0 | 12 | 0 | 10,330 | 0 | 7,764 | 0 | 38,912 | 2,821 | 0.9 | 0.0 | 73.9 | 73.9 | 0.00 | 0.18 | ## What I did 1. **Opened IMDb** (`https://www.imdb.com/`) — it returned a **"Let's confirm you are human"** human-verification page. I clicked **Begin**, whic |
