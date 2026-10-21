# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-19; runs per task and approach: 3; 4 runs in parallel.
- Scope: 21 exact recovery rows = 21 logical runs; 21 recorded so far; 21 total attempts including retries.
- Exact rows: `long-shop|mantis|1`, `long-shop|tree|1`, `long-shop|screenshot|1`, `long-shop|mantis|2`, `long-shop|tree|2`, `long-shop|screenshot|2`, `long-shop|mantis|3`, `long-shop|tree|3`, `long-shop|screenshot|3`, `long-admin|mantis|2`, `long-admin|tree|2`, `long-admin|screenshot|2`, `long-admin|mantis|3`, `long-admin|tree|3`, `long-admin|screenshot|3`, `long-onboard|mantis|1`, `long-onboard|tree|1`, `long-onboard|screenshot|1`, `long-onboard|mantis|3`, `long-onboard|tree|3`, `long-onboard|screenshot|3`.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 7 / 7 | 7 / 7 | 6 / 7 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 1 |
| Tool calls (including retries) | 150 | 184 | 816 |
| Sarvam API attempts (including retries) | 152 | 182 | 725 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 254.0 | 384.9 | 1420.6 |
| Sarvam limiter queue / cooldown (total, s) | 386.2 / 0.0 | 537.9 / 0.0 | 1680.2 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 198.7 / 0.0 | 301.7 / 0.0 | 1211.2 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 3 | 0 |
| Browser observation text (observed chars) | 81,722 | 402,273 | 12,144 |
| Browser observation images (observed blocks) | 0 | 0 | 211 |
| Normal input tokens (total) | 72,721 | 179,232 | 1,652,646 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 718,976 | 2,165,888 | 7,022,720 |
| Output tokens (total) | 13,329 | 17,351 | 71,952 |
| Total input tokens incl. cache (legacy) | 791,697 | 2,345,120 | 8,675,366 |
| MCP startup (total, s) | 5.3 | 4.0 | 7.3 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 640.3 | 922.8 | 3100.8 |
| CLI wall (total, s) | 640.3 | 922.8 | 3100.8 |
| Fixture verification (total, s) | 2.9 | 2.5 | 11.9 |
| Cleanup (total, s) | 0.9 | 1.0 | 0.9 |
| Harness capture (total, s) | 9.6 | 111.5 | 36.9 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 3.58 | 7.39 | 52.38 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `long-shop` | Mantis | 1 | success | 1 | 21 | 0 | 22 | 0 | 7,236 | 0 | 9,891 | 0 | 82,816 | 1,742 | 0.9 | 0.0 | 79.2 | 79.2 | 0.25 | 0.13 | Order placed successfully. Summary of what was done: - Added exactly: 2× Summit Flask ($14.00 each), 1× Harbor Satchel ($22.50), 3× Cedar Wrap ($8.50 each), 1× |
| `long-shop` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 31 | 1 | 32 | 0 | 62,526 | 0 | 29,396 | 0 | 432,768 | 2,918 | 1.2 | 0.0 | 143.1 | 143.1 | 0.24 | 0.14 | The order has been placed successfully. **Order summary:** - Order number: **#S-5856** - Total charged: **$101.29** - Items: 2× Summit Flask ($28.00), 1× Harbo |
| `long-shop` | Screenshots (click by x,y) | 1 | cli_error | 1 | 150 | 0 | 150 | 0 | 2,314 | 41 | 321,638 | 0 | 1,629,952 | 12,753 | 1.1 | 0.0 | 674.1 | 674.1 | 2.11 | 0.13 | sarvam CLI returned an error result |
| `long-shop` | Mantis | 2 | success | 1 | 24 | 0 | 25 | 0 | 8,356 | 0 | 11,423 | 0 | 104,832 | 2,050 | 0.9 | 0.0 | 76.5 | 76.5 | 0.29 | 0.13 | Order placed successfully. Summary of what was done: - Added exactly: 2× Summit Flask ($14.00 each), 1× Harbor Satchel ($22.50), 3× Cedar Wrap ($8.50 each), 1× |
| `long-shop` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 30 | 1 | 31 | 0 | 55,885 | 0 | 26,795 | 0 | 365,952 | 2,572 | 0.4 | 0.0 | 177.5 | 177.5 | 0.24 | 0.15 | The order was placed successfully. Order number: **S-5856** Total charged: **$101.29** The order contains 2 Summit Flask, 1 Harbor Satchel, 3 Cedar Wrap, and  |
| `long-shop` | Screenshots (click by x,y) | 2 | success | 1 | 120 | 0 | 121 | 0 | 1,759 | 32 | 234,826 | 0 | 1,088,000 | 8,020 | 1.0 | 0.0 | 482.8 | 482.8 | 2.00 | 0.14 | The order was placed successfully. - **Order number:** S-5856 - **Total charged:** $101.29 (Subtotal $107.00 − $10.70 coupon + $4.99 Standard shipping) - Shipp |
| `long-shop` | Mantis | 3 | success | 1 | 23 | 0 | 24 | 0 | 10,871 | 0 | 10,270 | 0 | 115,328 | 1,888 | 0.7 | 0.0 | 119.5 | 119.5 | 0.30 | 0.13 | The order was placed successfully. Summary of what was done: - Added exactly: 2× Summit Flask ($28.00), 1× Harbor Satchel ($22.50), 3× Cedar Wrap ($25.50), 1×  |
| `long-shop` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 30 | 1 | 31 | 0 | 55,885 | 0 | 26,746 | 0 | 367,744 | 2,775 | 0.4 | 0.0 | 182.9 | 182.9 | 0.27 | 0.17 | The order was placed successfully. Order confirmation: - **Order number:** S-5856 - **Total charged:** $101.29 - Shipping to Maya Lin, 84 Cedar Lane, Portland  |
| `long-shop` | Screenshots (click by x,y) | 3 | success | 1 | 196 | 0 | 107 | 0 | 3,241 | 25 | 217,541 | 0 | 1,160,832 | 10,569 | 1.0 | 0.0 | 539.1 | 539.1 | 1.49 | 0.13 | The order was placed successfully. Order **#S-5856** confirmed. Total charged: **$101.29** (subtotal $107.00 − $10.70 coupon discount = $96.30, plus $4.99 Stan |
| `long-admin` | Mantis | 2 | success | 1 | 25 | 0 | 26 | 0 | 20,854 | 0 | 15,427 | 0 | 209,920 | 3,618 | 0.7 | 0.0 | 117.3 | 117.3 | 0.73 | 0.14 | The save succeeded. The confirmation banner reads: **"Saved 6 changes. Change set C-5365."** Summary of the edits I made (and verified before saving, changing |
| `long-admin` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 15 | 0 | 13 | 0 | 60,743 | 0 | 22,360 | 0 | 135,936 | 1,990 | 0.4 | 0.0 | 62.2 | 62.2 | 0.42 | 0.14 | The save confirmation appeared in the status area: **"Saved 6 changes. Change set C-5365."** All six requested changes were applied (and the decoy names "Inez  |
| `long-admin` | Screenshots (click by x,y) | 2 | success | 1 | 83 | 0 | 84 | 0 | 1,047 | 31 | 234,916 | 0 | 833,152 | 10,146 | 1.0 | 0.0 | 429.9 | 429.9 | 1.57 | 0.13 | All six changes were applied and saved successfully. The confirmation message displayed at the top of the page reads: **"Saved 6 changes. Change set C-5365."** |
| `long-admin` | Mantis | 3 | success | 1 | 13 | 0 | 11 | 0 | 20,217 | 0 | 9,465 | 0 | 52,992 | 1,418 | 0.7 | 0.0 | 54.6 | 54.6 | 0.44 | 0.12 | All changes were made and saved successfully. I carefully targeted the exact-name matches, avoiding the similarly-named decoys (e.g., "Inez Cruzg", "Sana Iqbalq |
| `long-admin` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 14 | 0 | 12 | 0 | 60,437 | 0 | 21,658 | 0 | 118,400 | 1,841 | 0.7 | 0.0 | 55.3 | 55.3 | 0.42 | 0.14 | The confirmation message displayed after saving reads: **"Saved 6 changes. Change set C-5365."** This reflects the six edits I made: Inez Cruz → Editor, Lara  |
| `long-admin` | Screenshots (click by x,y) | 3 | success | 1 | 61 | 0 | 62 | 0 | 770 | 26 | 239,244 | 0 | 677,120 | 15,667 | 1.0 | 0.0 | 352.6 | 352.6 | 0.67 | 0.16 | The confirmation message is now visible: **"Saved 6 changes. Change set C-5365."** All 6 changes were applied correctly: - Inez Cruz → Editor - Lara Shah → Edi |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 23 | 0 | 6,640 | 0 | 7,944 | 0 | 80,384 | 1,343 | 0.7 | 0.0 | 111.6 | 111.6 | 0.45 | 0.13 | The workspace was created successfully with all the specified details: - Company: Aster Works, 51–200 employees, Germany, VAT DE123456789 - Admin: Nora Bell (no |
| `long-onboard` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 32 | 0 | 31 | 0 | 51,113 | 0 | 25,360 | 0 | 354,176 | 2,572 | 0.5 | 0.0 | 158.3 | 158.3 | 0.42 | 0.15 | The workspace was created successfully. **Summary of what was set up:** - **Company:** Aster Works · 51–200 employees · Germany · VAT DE123456789 - **Admin con |
| `long-onboard` | Screenshots (click by x,y) | 1 | success | 1 | 106 | 0 | 100 | 0 | 1,591 | 28 | 205,831 | 0 | 840,576 | 7,754 | 1.0 | 0.0 | 364.9 | 364.9 | 2.03 | 0.12 | The workspace was created successfully. ANSWER: W-8780 |
| `long-onboard` | Mantis | 3 | success | 1 | 22 | 0 | 21 | 0 | 7,548 | 0 | 8,301 | 0 | 72,704 | 1,270 | 0.7 | 0.0 | 81.5 | 81.5 | 0.46 | 0.13 | The workspace was created successfully. All details were entered as specified: Aster Works (51–200 employees, Germany, VAT DE123456789), admin Nora Bell, Growth |
| `long-onboard` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 32 | 0 | 32 | 0 | 55,684 | 0 | 26,917 | 0 | 390,912 | 2,683 | 0.4 | 0.0 | 143.5 | 143.5 | 0.46 | 0.15 | The workspace was created successfully. The confirmation page shows: **"Workspace W-8780 created for Aster Works (Growth, yearly, 3 invites)."** All the detai |
| `long-onboard` | Screenshots (click by x,y) | 3 | success | 1 | 100 | 0 | 101 | 0 | 1,422 | 28 | 198,650 | 0 | 793,088 | 7,043 | 1.0 | 0.0 | 257.4 | 257.4 | 2.01 | 0.13 | The workspace was created successfully. ANSWER: W-8780 |
