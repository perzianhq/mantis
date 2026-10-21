# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-19; runs per task and approach: 3; 4 runs in parallel.
- Scope: 18 exact recovery rows = 18 logical runs; 18 recorded so far; 18 total attempts including retries.
- Exact rows: `booking-date|screenshot|1`, `booking-date|screenshot|2`, `booking-date|screenshot|3`, `checkout-steps|screenshot|2`, `long-admin|screenshot|1`, `long-admin|screenshot|2`, `long-admin|screenshot|3`, `long-onboard|screenshot|1`, `long-onboard|screenshot|2`, `long-onboard|screenshot|3`, `long-onboard|tree|2`, `long-onboard|tree|3`, `long-shop|screenshot|1`, `long-shop|screenshot|2`, `long-shop|screenshot|3`, `long-shop|tree|1`, `long-shop|tree|2`, `long-shop|tree|3`.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 0 / 0 | 5 / 5 | 6 / 13 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 7 |
| Tool calls (including retries) | 0 | 161 | 1,010 |
| Sarvam API attempts (including retries) | 0 | 163 | 984 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | unknown | 295.6 | 1894.1 |
| Sarvam limiter queue / cooldown (total, s) | unknown | 485.1 / 0.0 | 2544.9 / 0.0 |
| Sarvam active request / retry backoff (total, s) | unknown | 223.4 / 0.0 | 1657.1 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 3 | 0 |
| Browser observation text (observed chars) | 0 | 307,002 | 14,850 |
| Browser observation images (observed blocks) | 0 | 0 | 337 |
| Normal input tokens (total) | unknown | 147,704 | 2,439,064 |
| Cache-write input tokens (total) | unknown | 0 | 0 |
| Cache-read input tokens (total) | unknown | 2,160,896 | 9,147,264 |
| Output tokens (total) | unknown | 14,224 | 115,570 |
| Total input tokens incl. cache (legacy) | unknown | 2,308,600 | 11,586,328 |
| MCP startup (total, s) | 0.0 | 2.1 | 14.3 |
| CLI startup (total, s) | unknown | 0.0 | 0.0 |
| CLI execution (total, s) | unknown | 780.7 | 4438.9 |
| CLI wall (total, s) | unknown | 780.7 | 4438.9 |
| Fixture verification (total, s) | 0.0 | 1.6 | 14.1 |
| Cleanup (total, s) | 0.0 | 0.8 | 1.9 |
| Harness capture (total, s) | 0.0 | 93.7 | 44.1 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | unknown | 6.27 | 77.69 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `checkout-steps` | Screenshots (click by x,y) | 2 | success | 1 | 25 | 0 | 26 | 0 | 371 | 10 | 25,163 | 0 | 90,112 | 1,293 | 1.3 | 0.0 | 79.3 | 79.3 | 0.10 | 0.14 | The order has been placed successfully. Order number: **#B2048** Total charged: **$31.25** ANSWER: Order #B2048, total charged $31.25 |
| `booking-date` | Screenshots (click by x,y) | 1 | success | 1 | 40 | 0 | 41 | 0 | 509 | 15 | 78,415 | 0 | 233,216 | 4,748 | 1.3 | 0.0 | 193.7 | 193.7 | 0.09 | 0.13 | The booking was successful. The confirmation message reads: "Booked for 2026-12-25 at 20:00, 3 guests." ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Screenshots (click by x,y) | 2 | success | 1 | 27 | 0 | 28 | 0 | 405 | 9 | 20,625 | 0 | 109,696 | 2,114 | 1.2 | 0.0 | 130.3 | 130.3 | 0.10 | 0.14 | The booking was successful. The confirmation message reads: **"Booked for 2026-12-25 at 20:00, 3 guests."** ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `booking-date` | Screenshots (click by x,y) | 3 | success | 1 | 35 | 0 | 36 | 0 | 582 | 11 | 46,816 | 0 | 193,792 | 4,649 | 1.3 | 0.0 | 189.2 | 189.2 | 0.10 | 0.13 | The booking was confirmed successfully. ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `long-shop` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 34 | 1 | 35 | 0 | 70,685 | 0 | 35,412 | 0 | 522,240 | 3,081 | 0.4 | 0.0 | 174.1 | 174.1 | 0.26 | 0.19 | The order was placed successfully. **Order summary:** - Order number: **S-5856** - Total charged: **$101.29** Breakdown: Subtotal $107.00 (2× Summit Flask $14 |
| `long-shop` | Screenshots (click by x,y) | 1 | cli_error | 1 | 124 | 0 | 100 | 0 | 1,769 | 42 | 297,178 | 0 | 794,624 | 8,824 | 1.0 | 0.0 | 439.2 | 439.2 | 1.10 | 0.17 | sarvam CLI returned an error result |
| `long-shop` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 31 | 1 | 32 | 0 | 62,526 | 0 | 28,793 | 0 | 432,256 | 2,825 | 0.4 | 0.0 | 139.9 | 139.9 | 0.24 | 0.14 | The order was placed successfully. **Order number:** S-5856 **Total charged:** $101.29 Order summary: - 2× Summit Flask ($14.00 each) = $28.00 - 1× Harbor Sat |
| `long-shop` | Screenshots (click by x,y) | 2 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,528 | 34 | 243,168 | 0 | 809,856 | 10,793 | 1.0 | 0.0 | 489.8 | 489.8 | 1.01 | 0.17 | sarvam CLI returned an error result |
| `long-shop` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 31 | 1 | 32 | 0 | 62,526 | 0 | 28,988 | 0 | 434,944 | 2,927 | 0.4 | 0.0 | 175.6 | 175.6 | 0.25 | 0.20 | The order was placed successfully. **Order number:** S-5856 **Total charged:** $101.29 Order details: - 2× Summit Flask ($14.00 each) = $28.00 - 1× Harbor Sat |
| `long-shop` | Screenshots (click by x,y) | 3 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,563 | 37 | 249,646 | 0 | 765,312 | 7,850 | 1.0 | 0.0 | 404.3 | 404.3 | 1.04 | 0.13 | sarvam CLI returned an error result |
| `long-admin` | Screenshots (click by x,y) | 1 | success | 1 | 71 | 0 | 72 | 0 | 933 | 26 | 194,214 | 0 | 688,640 | 10,255 | 1.1 | 0.0 | 361.1 | 361.1 | 1.34 | 0.14 | The save confirmation appeared at the top of the page. ANSWER: Saved 6 changes. Change set C-5365. |
| `long-admin` | Screenshots (click by x,y) | 2 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,415 | 41 | 381,135 | 0 | 1,509,888 | 21,790 | 1.0 | 0.0 | 596.8 | 596.8 | 1.46 | 0.13 | sarvam CLI returned an error result |
| `long-admin` | Screenshots (click by x,y) | 3 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,439 | 34 | 375,136 | 0 | 1,826,304 | 24,235 | 1.0 | 0.0 | 591.8 | 591.8 | 1.96 | 0.13 | sarvam CLI returned an error result |
| `long-onboard` | Screenshots (click by x,y) | 1 | cli_error | 1 | 108 | 0 | 100 | 0 | 1,633 | 28 | 203,886 | 0 | 819,968 | 7,638 | 1.0 | 0.0 | 379.9 | 379.9 | 2.02 | 0.18 | sarvam CLI returned an error result |
| `long-onboard` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 33 | 0 | 32 | 0 | 55,581 | 0 | 27,452 | 0 | 380,672 | 2,716 | 0.4 | 0.0 | 126.3 | 126.3 | 0.42 | 0.15 | The workspace was created successfully. **Workspace created:** W-8780 — "Workspace W-8780 created for Aster Works (Growth, yearly, 3 invites)." Summary of wha |
| `long-onboard` | Screenshots (click by x,y) | 2 | success | 1 | 80 | 0 | 81 | 0 | 1,238 | 22 | 135,795 | 0 | 518,144 | 4,609 | 1.1 | 0.0 | 346.2 | 346.2 | 1.82 | 0.18 | The workspace was created successfully. Summary of what I set up: - **Company:** Aster Works, 51–200 employees, Germany, VAT ID DE123456789 - **Admin contact:* |
| `long-onboard` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 32 | 0 | 32 | 0 | 55,684 | 0 | 27,059 | 0 | 390,784 | 2,675 | 0.4 | 0.0 | 164.8 | 164.8 | 0.45 | 0.13 | The workspace was created successfully. The confirmation page shows "Workspace W-8780 created for Aster Works (Growth, yearly, 3 invites)." All requested detai |
| `long-onboard` | Screenshots (click by x,y) | 3 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,465 | 28 | 187,887 | 0 | 787,712 | 6,772 | 1.0 | 0.0 | 237.3 | 237.3 | 1.94 | 0.14 | sarvam CLI returned an error result |
