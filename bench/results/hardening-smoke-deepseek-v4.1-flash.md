# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 2 runs in parallel.
- Scope: 6 tasks × 3 approaches × 1 runs = 18 logical runs; 18 recorded so far; 18 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 6 / 6 | 6 / 6 | 4 / 6 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 2 |
| Tool calls (including retries) | 74 | 97 | 316 |
| Sarvam API attempts (including retries) | 77 | 101 | 316 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 1 | 0 |
| Browser observation text (observed chars) | 43,146 | 191,592 | 4,425 |
| Browser observation images (observed blocks) | 0 | 0 | 123 |
| Normal input tokens (total) | 37,565 | 92,156 | 1,020,930 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 329,216 | 1,090,688 | 3,416,704 |
| Output tokens (total) | 7,579 | 8,610 | 51,278 |
| Total input tokens incl. cache (legacy) | 366,781 | 1,182,844 | 4,437,634 |
| MCP startup (total, s) | 12.1 | 12.1 | 12.1 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 234.7 | 373.9 | 1168.5 |
| CLI wall (total, s) | 234.7 | 373.9 | 1168.5 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 1.0 | 1.0 | 0.9 |
| Harness capture (total, s) | 5.0 | 56.8 | 14.5 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 1.90 | 3.75 | 32.62 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 664 | 0 | 2,470 | 0 | 5,376 | 187 | 2.0 | 0.0 | 5.1 | 5.1 | 0.00 | 0.23 | The file was deleted and the confirmation message shown was: "Old report was moved to trash." ANSWER: Old report was moved to trash. |
| `modal-delete` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 0 | 3,157 | 0 | 5,104 | 0 | 17,664 | 347 | 2.0 | 0.0 | 13.9 | 13.9 | 0.00 | 0.22 | The file "Old report" was deleted. After confirming the dialog ("Delete "Old report"? This cannot be undone."), the page showed the status message: **"Old repo |
| `modal-delete` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 4,043 | 0 | 8,192 | 365 | 2.0 | 0.0 | 10.4 | 10.4 | 0.00 | 0.15 | The file "Old report" was deleted, and a confirmation message appeared in the bottom-right corner. ANSWER: Old report was moved to trash. |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 583 | 0 | 1,255 | 0 | 6,528 | 145 | 2.0 | 0.0 | 4.2 | 4.2 | 0.00 | 0.15 | ANSWER: PRO-77 |
| `plans-pick` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,727 | 0 | 1,832 | 0 | 13,056 | 230 | 2.0 | 0.0 | 40.8 | 40.8 | 0.00 | 0.15 | I clicked the Pro plan and the page displayed a confirmation. ANSWER: PRO-77 |
| `plans-pick` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 112 | 2 | 2,388 | 0 | 4,352 | 195 | 2.0 | 0.0 | 38.5 | 38.5 | 0.00 | 0.15 | The confirmation code is PRO-77. ANSWER: PRO-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 931 | 0 | 1,062 | 0 | 6,912 | 206 | 2.0 | 0.0 | 5.1 | 5.1 | 0.00 | 0.14 | The refund policy section states: "You can ask for a full refund within 30 days of purchase." ANSWER: 30 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,872 | 0 | 1,870 | 0 | 13,056 | 236 | 2.0 | 0.0 | 8.1 | 8.1 | 0.00 | 0.14 | The refund policy states: "You can ask for a full refund within 30 days of purchase." ANSWER: 30 days |
| `faq-refund` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,404 | 0 | 4,352 | 220 | 2.0 | 0.0 | 7.0 | 7.0 | 0.00 | 0.15 | The refund policy states: "You can ask for a full refund within 30 days of purchase." ANSWER: 30 days |
| `long-shop` | Mantis | 1 | success | 1 | 21 | 0 | 22 | 0 | 7,187 | 0 | 9,043 | 0 | 89,088 | 2,279 | 2.0 | 0.0 | 70.8 | 70.8 | 0.00 | 0.17 | The order was completed successfully. Here's a summary of what was done: - **Cart contents** (only the requested items): 2× Trail Mug ($14.00 ea), 1× Canvas To |
| `long-shop` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 31 | 1 | 32 | 0 | 62,444 | 0 | 29,874 | 0 | 436,736 | 3,017 | 2.0 | 0.0 | 128.7 | 128.7 | 0.00 | 0.16 | The order was placed successfully. Order confirmation shows: - **Order number:** #S-1814 - **Total charged:** $101.29 - Shipping to Grace Hopper, 12 Navy Way,  |
| `long-shop` | Screenshots (click by x,y) | 1 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,393 | 44 | 383,573 | 0 | 1,115,008 | 17,545 | 2.0 | 0.0 | 438.1 | 438.1 | 0.00 | 0.15 | sarvam CLI returned an error result |
| `long-admin` | Mantis | 1 | success | 1 | 22 | 0 | 22 | 0 | 26,888 | 0 | 15,920 | 0 | 146,944 | 3,400 | 2.0 | 0.0 | 94.1 | 94.1 | 0.00 | 0.14 | The save was successful. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** All six changes were applied and verified: - Ivy Chen → Edi |
| `long-admin` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 20 | 0 | 20 | 0 | 66,648 | 0 | 26,129 | 0 | 220,160 | 2,247 | 2.0 | 0.0 | 71.6 | 71.6 | 0.00 | 0.16 | The save was successful. The confirmation status message reads: **"Saved 6 changes. Change set C-5365."** Summary of changes made (6 total): - Ivy Chen → Edito |
| `long-admin` | Screenshots (click by x,y) | 1 | success | 1 | 102 | 0 | 99 | 0 | 1,334 | 39 | 398,694 | 0 | 1,499,520 | 25,213 | 2.0 | 0.0 | 434.8 | 434.8 | 0.00 | 0.15 | The save succeeded. The confirmation message displayed on the page reads: **"Saved 6 changes. Change set C-5365."** All six changes were applied and saved: Iv |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 21 | 0 | 6,893 | 0 | 7,815 | 0 | 74,368 | 1,362 | 2.0 | 0.0 | 55.4 | 55.4 | 0.00 | 0.14 | The workspace was created successfully with all the specified details: - **Company:** Northwind Labs, 51–200 employees, Germany, VAT DE123456789 - **Admin conta |
| `long-onboard` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 32 | 0 | 32 | 0 | 55,744 | 0 | 27,347 | 0 | 390,016 | 2,533 | 2.0 | 0.0 | 110.8 | 110.8 | 0.00 | 0.16 | The workspace was created successfully. The confirmation shows: "Workspace W-3248 created for Northwind Labs (Growth, yearly, 3 invites)." ANSWER: W-3248 |
| `long-onboard` | Screenshots (click by x,y) | 1 | cli_error | 1 | 100 | 0 | 100 | 0 | 1,340 | 33 | 229,828 | 0 | 785,280 | 7,740 | 2.0 | 0.0 | 239.5 | 239.5 | 0.00 | 0.16 | sarvam CLI returned an error result |
