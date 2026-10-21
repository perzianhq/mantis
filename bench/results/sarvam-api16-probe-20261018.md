# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 4; 16 runs in parallel.
- Scope: 4 tasks × 1 approaches × 4 runs = 16 logical runs; 16 recorded so far; 16 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 16 / 16 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 104 |
| Sarvam API attempts (including retries) | 110 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 113,277 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 67,807 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 492,544 |
| Output tokens (total) | 11,232 |
| Total input tokens incl. cache (legacy) | 560,351 |
| MCP startup (total, s) | 35.6 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 1679.1 |
| CLI wall (total, s) | 1679.1 |
| Fixture verification (total, s) | 3.3 |
| Cleanup (total, s) | 2.8 |
| Harness capture (total, s) | 8.8 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 3.12 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,855 | 0 | 9,216 | 240 | 2.3 | 0.0 | 121.2 | 121.2 | 0.08 | 0.15 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,894 | 0 | 9,216 | 253 | 1.9 | 0.0 | 122.3 | 122.3 | 0.08 | 0.13 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,726 | 0 | 9,344 | 247 | 2.1 | 0.0 | 121.8 | 121.8 | 0.07 | 0.14 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 4 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,866 | 0 | 9,216 | 239 | 2.1 | 0.0 | 121.6 | 121.6 | 0.08 | 0.15 | ANSWER: The meeting moved to Friday at dusk. |
| `plans-pick` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 905 | 0 | 4,736 | 145 | 2.2 | 0.0 | 61.9 | 61.9 | 0.01 | 0.19 | I clicked the Business plan and received the confirmation message. ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,267 | 0 | 6,528 | 181 | 2.4 | 0.0 | 66.1 | 66.1 | 0.00 | 0.16 | I selected the Business plan ($15/month) and the page confirmed the choice. ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,270 | 0 | 6,528 | 182 | 2.2 | 0.0 | 65.9 | 65.9 | 0.01 | 0.19 | The Business plan was selected and the page confirms the choice. ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 4 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,255 | 0 | 6,528 | 177 | 2.2 | 0.0 | 66.4 | 66.4 | 0.01 | 0.17 | I clicked the Business plan ($15/month) and the page confirmed the selection. ANSWER: BIZ-77 |
| `chart-march` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 537 | 0 | 1,302 | 0 | 6,528 | 321 | 2.3 | 0.0 | 67.1 | 67.1 | 0.00 | 0.17 | The chart is a Chart.js bar chart titled "Monthly sales, first half of the year," with the y-axis labeled "Units sold." The extracted values are: - Jan: 18 - F |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 902 | 0 | 4,736 | 164 | 2.2 | 0.0 | 63.4 | 63.4 | 0.00 | 0.21 | The chart shows units sold per month: Jan 18, Feb 25, Mar 57, Apr 31, May 37, Jun 29. ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 902 | 0 | 4,736 | 164 | 2.1 | 0.0 | 62.2 | 62.2 | 0.00 | 0.25 | The chart shows units sold per month: Jan 18, Feb 25, Mar 57, Apr 31, May 37, Jun 29. ANSWER: 57 |
| `chart-march` | Mantis | 4 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 902 | 0 | 4,736 | 144 | 2.3 | 0.0 | 61.4 | 61.4 | 0.00 | 0.18 | The chart shows units sold per month. For March, the value is 57. ANSWER: 57 |
| `long-admin` | Mantis | 1 | success | 1 | 17 | 0 | 15 | 0 | 29,916 | 0 | 14,508 | 0 | 107,392 | 2,589 | 2.3 | 0.0 | 190.8 | 190.8 | 0.62 | 0.17 | The save succeeded. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** I made exactly the six requested changes (carefully avoiding the  |
| `long-admin` | Mantis | 2 | success | 1 | 13 | 0 | 11 | 0 | 20,523 | 0 | 9,953 | 0 | 54,400 | 1,630 | 2.3 | 0.0 | 138.3 | 138.3 | 0.44 | 0.14 | The save was successful. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** All six changes were applied correctly (and I avoided the si |
| `long-admin` | Mantis | 3 | success | 1 | 13 | 0 | 11 | 0 | 15,955 | 0 | 8,453 | 0 | 52,992 | 1,373 | 2.3 | 0.0 | 139.0 | 139.0 | 0.43 | 0.15 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Summary of what I changed (6 edits, no one else touched): - Inez Cruz → Editor - Lara |
| `long-admin` | Mantis | 4 | success | 1 | 25 | 0 | 25 | 0 | 35,080 | 0 | 18,847 | 0 | 195,712 | 3,183 | 2.3 | 0.0 | 209.7 | 209.7 | 1.44 | 0.24 | The changes are saved. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Summary of what I changed (6 changes, nobody else): - Inez Cru |
