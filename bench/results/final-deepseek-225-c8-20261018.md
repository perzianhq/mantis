# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 8 runs in parallel.
- Scope: 25 tasks × 3 approaches × 3 runs = 225 logical runs; 17 recorded so far; 17 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 7 / 7 | 7 / 7 | 3 / 3 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 31 | 38 | 46 |
| Sarvam API attempts (including retries) | 35 | 42 | 49 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 6,811 | 18,941 | 757 |
| Browser observation images (observed blocks) | 0 | 0 | 18 |
| Normal input tokens (total) | 10,470 | 16,839 | 24,036 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 61,568 | 117,504 | 138,880 |
| Output tokens (total) | 1,835 | 2,492 | 2,689 |
| Total input tokens incl. cache (legacy) | 72,038 | 134,343 | 162,916 |
| MCP startup (total, s) | 6.3 | 4.0 | 3.7 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 508.6 | 582.6 | 749.4 |
| CLI wall (total, s) | 508.6 | 582.6 | 749.4 |
| Fixture verification (total, s) | 0.2 | 0.2 | 0.2 |
| Cleanup (total, s) | 1.3 | 1.3 | 0.5 |
| Harness capture (total, s) | 1.3 | 23.1 | 1.8 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.49 | 0.74 | 0.95 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,412 | 0 | 8,832 | 269 | 1.1 | 0.0 | 66.3 | 66.3 | 0.03 | 0.25 | The form was submitted with Country = Ireland and the weekly newsletter checkbox checked. The page shows the confirmation message: ANSWER: Subscribed from Irel |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 6 | 0 | 3,046 | 0 | 2,521 | 0 | 17,024 | 375 | 0.7 | 0.0 | 68.5 | 68.5 | 0.03 | 0.18 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 1 | success | 1 | 19 | 0 | 20 | 0 | 281 | 8 | 10,169 | 0 | 68,608 | 1,055 | 1.3 | 0.0 | 304.0 | 304.0 | 0.05 | 0.19 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 2 | success | 1 | 6 | 0 | 6 | 0 | 1,341 | 0 | 1,873 | 0 | 11,008 | 349 | 1.1 | 0.0 | 69.9 | 69.9 | 0.02 | 0.16 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 6 | 0 | 3,046 | 0 | 2,652 | 0 | 16,896 | 380 | 0.8 | 0.0 | 68.7 | 68.7 | 0.03 | 0.17 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 2 | success | 1 | 17 | 0 | 18 | 0 | 256 | 7 | 9,140 | 0 | 54,912 | 940 | 1.3 | 0.0 | 263.7 | 263.7 | 0.04 | 0.18 | The confirmation message is: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,449 | 0 | 8,832 | 283 | 1.0 | 0.0 | 67.3 | 67.3 | 0.03 | 0.17 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 3,046 | 0 | 2,440 | 0 | 17,024 | 366 | 0.7 | 0.0 | 69.9 | 69.9 | 0.03 | 0.15 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,591 | 0 | 8,704 | 263 | 0.8 | 0.0 | 70.1 | 70.1 | 0.03 | 0.19 | The sign-in succeeded — the page title changed to "Welcome — Acme" and the heading is now "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,530 | 0 | 2,327 | 0 | 16,640 | 317 | 0.5 | 0.0 | 76.1 | 76.1 | 0.02 | 0.18 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 11 | 0 | 220 | 3 | 4,727 | 0 | 15,360 | 694 | 1.0 | 0.0 | 181.8 | 181.8 | 0.14 | 0.18 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,438 | 0 | 8,832 | 243 | 0.7 | 0.0 | 72.0 | 72.0 | 0.02 | 0.17 | Signed in successfully. The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,530 | 0 | 2,348 | 0 | 16,640 | 441 | 0.4 | 0.0 | 111.7 | 111.7 | 0.02 | 0.18 | The page heading after signing in is **Welcome back**. ANSWER: Welcome back |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,586 | 0 | 8,704 | 247 | 0.7 | 0.0 | 102.0 | 102.0 | 0.02 | 0.20 | The sign-in succeeded and the page heading is now "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 6 | 0 | 2,530 | 0 | 2,364 | 0 | 16,640 | 317 | 0.4 | 0.0 | 110.8 | 110.8 | 0.02 | 0.19 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 517 | 0 | 1,121 | 0 | 6,656 | 181 | 0.8 | 0.0 | 61.0 | 61.0 | 0.01 | 0.20 | The product was added successfully. ANSWER: Cart updated (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 2,213 | 0 | 2,187 | 0 | 16,640 | 296 | 0.5 | 0.0 | 76.9 | 76.9 | 0.01 | 0.21 | The product was added successfully. The confirmation message is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
