# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 1 runs in parallel.
- Scope: 25 tasks × 3 approaches × 3 runs = 225 logical runs; 5 recorded so far; 5 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 2 / 2 | 2 / 2 | 1 / 1 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 10 | 12 | 18 |
| Sarvam API attempts (including retries) | 10 | 12 | 19 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 2,022 | 6,092 | 281 |
| Browser observation images (observed blocks) | 0 | 0 | 7 |
| Normal input tokens (total) | 2,981 | 5,226 | 9,399 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 17,536 | 33,920 | 60,032 |
| Output tokens (total) | 541 | 780 | 1,061 |
| Total input tokens incl. cache (legacy) | 20,517 | 39,146 | 69,431 |
| MCP startup (total, s) | 1.4 | 0.8 | 1.1 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 18.8 | 27.4 | 38.7 |
| CLI wall (total, s) | 18.8 | 27.4 | 38.7 |
| Fixture verification (total, s) | 0.1 | 0.1 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.3 | 0.2 |
| Harness capture (total, s) | 0.4 | 7.6 | 0.7 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.14 | 0.23 | 0.38 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,550 | 0 | 8,704 | 269 | 0.7 | 0.0 | 10.7 | 10.7 | 0.04 | 0.15 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,046 | 0 | 2,662 | 0 | 16,896 | 388 | 0.4 | 0.0 | 16.5 | 16.5 | 0.04 | 0.16 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 1 | success | 1 | 18 | 0 | 19 | 0 | 281 | 7 | 9,399 | 0 | 60,032 | 1,061 | 1.1 | 0.0 | 38.7 | 38.7 | 0.05 | 0.16 | The confirmation message shown is: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,431 | 0 | 8,832 | 272 | 0.7 | 0.0 | 8.1 | 8.1 | 0.03 | 0.16 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,046 | 0 | 2,564 | 0 | 17,024 | 392 | 0.4 | 0.0 | 10.9 | 10.9 | 0.03 | 0.16 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
