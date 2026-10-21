# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 10 runs in parallel.
- Scope: 4 tasks × 1 approaches × 3 runs = 12 logical runs; 12 recorded so far; 12 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 12 / 12 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 66 |
| Sarvam API attempts (including retries) | 69 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 71,258 |
| Browser observation images (observed blocks) | 1 |
| Normal input tokens (total) | 42,692 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 225,024 |
| Output tokens (total) | 6,855 |
| Total input tokens incl. cache (legacy) | 267,716 |
| MCP startup (total, s) | 16.7 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 794.2 |
| CLI wall (total, s) | 794.2 |
| Fixture verification (total, s) | 1.8 |
| Cleanup (total, s) | 1.9 |
| Harness capture (total, s) | 6.1 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 1.90 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,910 | 0 | 9,216 | 259 | 1.6 | 0.0 | 65.4 | 65.4 | 0.07 | 0.14 | ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,861 | 0 | 9,216 | 242 | 1.4 | 0.0 | 64.9 | 64.9 | 0.11 | 0.14 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `feed-scroll` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,861 | 0 | 9,216 | 242 | 1.5 | 0.0 | 65.2 | 65.2 | 0.09 | 0.13 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,137 | 0 | 6,656 | 184 | 1.5 | 0.0 | 62.1 | 62.1 | 0.01 | 0.15 | I clicked the Business plan ($15/month) and the page confirmed the selection. ANSWER: BIZ-77 |
| `plans-pick` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 912 | 0 | 4,736 | 175 | 1.5 | 0.0 | 5.8 | 5.8 | 0.01 | 0.17 | I opened the plans page and selected the Business plan ($15/month). The page confirmed with the message "You chose the biz plan. Confirmation code BIZ-77." ANS |
| `plans-pick` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,269 | 0 | 6,528 | 186 | 1.5 | 0.0 | 61.9 | 61.9 | 0.02 | 0.17 | I selected the Business plan ($15/month) and the page confirmed with a confirmation code. ANSWER: BIZ-77 |
| `chart-march` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 340 | 1 | 1,476 | 0 | 6,528 | 293 | 1.4 | 0.0 | 62.4 | 62.4 | 0.00 | 0.17 | The chart shows the March bar at 57 units, consistent with the extracted data (Mar \| 57). ANSWER: 57 |
| `chart-march` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 904 | 0 | 4,736 | 162 | 1.6 | 0.0 | 6.5 | 6.5 | 0.00 | 0.21 | The chart shows monthly units sold for the first half of the year. For March, the value is 57 units. ANSWER: 57 |
| `chart-march` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 901 | 0 | 4,736 | 161 | 1.5 | 0.0 | 5.9 | 5.9 | 0.00 | 0.17 | The chart shows units sold per month: Jan 18, Feb 25, **Mar 57**, Apr 31, May 37, Jun 29. ANSWER: 57 |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,798 | 0 | 52,992 | 1,539 | 1.5 | 0.0 | 128.9 | 128.9 | 0.52 | 0.13 | The confirmation message says: **"Saved 6 changes. Change set C-5365."** I made exactly the six requested changes (avoiding the decoy accounts "Inez Cruzg" and |
| `long-admin` | Mantis | 2 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,816 | 0 | 53,120 | 1,524 | 0.8 | 0.0 | 129.7 | 129.7 | 0.47 | 0.13 | The save was successful. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** All six changes were applied correctly (Inez Cruz → Editor,  |
| `long-admin` | Mantis | 3 | success | 1 | 13 | 0 | 11 | 0 | 22,131 | 0 | 10,847 | 0 | 57,344 | 1,888 | 0.8 | 0.0 | 135.4 | 135.4 | 0.49 | 0.13 | The save succeeded. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Summary of what I changed (6 changes, exact-name matches only, l |
