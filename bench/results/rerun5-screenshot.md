# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-17; runs per task and approach: 1; 2 runs in parallel.
- Scope: 4 tasks × 1 approaches × 1 runs = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Screenshots (click by x,y) |
|---|---:|
| Correct | 3 / 4 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 1 |
| Tool calls (including retries) | 214 |
| Sarvam API attempts (including retries) | 190 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 3,202 |
| Browser observation images (observed blocks) | 73 |
| Normal input tokens (total) | 449,400 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 1,385,984 |
| Output tokens (total) | 22,934 |
| Total input tokens incl. cache (legacy) | 1,835,384 |
| MCP startup (total, s) | 8.1 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 1469.3 |
| CLI wall (total, s) | 1469.3 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 1.0 |
| Harness capture (total, s) | 14.6 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 14.34 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `booking-date` | Screenshots (click by x,y) | 1 | success | 1 | 62 | 0 | 36 | 0 | 903 | 14 | 71,955 | 0 | 200,320 | 4,775 | 2.0 | 0.0 | 308.3 | 308.3 | 0.00 | 0.20 | The booking was successful. The confirmation message reads: **"Booked for 2026-12-24 at 19:00, 3 guests."** ANSWER: Booked for 2026-12-24 at 19:00, 3 guests. |
| `churned-max` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 146 | 5 | 6,059 | 0 | 22,144 | 2,233 | 2.0 | 0.0 | 87.0 | 87.0 | 0.00 | 0.25 | I've reviewed the full customer table. Let me compile all the Churned customers: - Initech 1: $7,838 - Stark 1: $4,595 - Tyrell 1: $1,352 - Globex 2: $7,109 -  |
| `long-shop` | Screenshots (click by x,y) | 1 | timeout | 1 | 71 | 0 | 71 | 0 | 1,160 | 28 | 175,068 | 0 | 461,056 | 6,132 | 2.0 | 0.0 | 600.1 | 600.1 | 0.00 | 0.26 | timed out after 600s |
| `long-admin` | Screenshots (click by x,y) | 1 | success | 1 | 71 | 0 | 72 | 0 | 993 | 26 | 196,318 | 0 | 702,464 | 9,794 | 2.0 | 0.0 | 474.0 | 474.0 | 0.00 | 0.26 | The save completed. The confirmation message displayed at the top of the page reads: **"Saved 6 changes. Change set C-5365."** I made exactly the six requeste |
