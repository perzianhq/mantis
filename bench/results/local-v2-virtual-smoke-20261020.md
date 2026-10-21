# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-20; runs per task and approach: 1; 3 runs in parallel.
- Scope: 1 tasks × 3 approaches × 1 runs = 3 logical runs; 3 recorded so far; 3 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 1 / 1 | 0 / 1 | 1 / 1 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 1 | 0 |
| Tool calls (including retries) | 17 | 35 | 17 |
| Sarvam API attempts (including retries) | 18 | 35 | 18 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 29.0 | 145.0 | 35.2 |
| Sarvam limiter queue / cooldown (total, s) | 0.0 / 0.0 | 9.9 / 0.0 | 0.0 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 26.4 / 0.0 | 142.1 / 0.0 | 31.8 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 11,203 | 37,241 | 233 |
| Browser observation images (observed blocks) | 0 | 1 | 8 |
| Normal input tokens (total) | 8,753 | 31,488 | 9,881 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 67,200 | 498,048 | 59,136 |
| Output tokens (total) | 1,309 | 13,704 | 1,290 |
| Total input tokens incl. cache (legacy) | 75,953 | 529,536 | 69,017 |
| MCP startup (total, s) | 0.8 | 0.5 | 1.0 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 29.0 | 154.9 | 35.2 |
| CLI wall (total, s) | 29.0 | 154.9 | 35.2 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.2 | 0.2 | 0.1 |
| Harness capture (total, s) | 1.1 | 20.7 | 0.9 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.39 | 2.48 | 0.41 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | success | 1 | 17 | 0 | 18 | 0 | 11,203 | 0 | 8,753 | 0 | 67,200 | 1,309 | 0.8 | 0.0 | 29.0 | 29.0 | 0.00 | 0.16 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Accessibility tree (Playwright MCP) | 1 | cli_error | 1 | 35 | 0 | 35 | 0 | 37,241 | 1 | 31,488 | 0 | 498,048 | 13,704 | 0.5 | 0.0 | 154.9 | 154.9 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `v2-list-virtual-target` | Screenshots (click by x,y) | 1 | success | 1 | 17 | 0 | 18 | 0 | 233 | 8 | 9,881 | 0 | 59,136 | 1,290 | 1.0 | 0.0 | 35.2 | 35.2 | 0.00 | 0.14 | feed-087 \| Pin \| Dispatch 087 pinned. |
