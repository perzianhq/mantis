# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 8 runs in parallel.
- Scope: 8 tasks × 1 approaches × 1 runs = 8 logical runs; 8 recorded so far; 8 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 8 / 8 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 75 |
| Sarvam API attempts (including retries) | 82 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 37,540 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 34,245 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 292,608 |
| Output tokens (total) | 6,167 |
| Total input tokens incl. cache (legacy) | 326,853 |
| MCP startup (total, s) | 10.0 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 582.2 |
| CLI wall (total, s) | 582.2 |
| Fixture verification (total, s) | 1.5 |
| Cleanup (total, s) | 1.3 |
| Harness capture (total, s) | 3.2 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 1.65 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 6 | 0 | 7 | 0 | 4,125 | 0 | 3,148 | 0 | 14,208 | 342 | 1.3 | 0.0 | 68.4 | 68.4 | 0.16 | 0.16 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,181 | 0 | 6,656 | 190 | 1.3 | 0.0 | 28.9 | 28.9 | 0.01 | 0.17 | The file was deleted and the confirmation message shown was: **"Quarterly draft was moved to trash."** ANSWER: Quarterly draft was moved to trash. |
| `plans-pick` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 324 | 0 | 905 | 0 | 4,736 | 140 | 1.2 | 0.0 | 19.8 | 19.8 | 0.01 | 0.20 | The page confirmed the selection. ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 725 | 0 | 4,992 | 163 | 1.3 | 0.0 | 20.7 | 20.7 | 0.01 | 0.17 | The reimbursement policy section states: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 774 | 0 | 4,864 | 186 | 1.3 | 0.0 | 22.0 | 22.0 | 0.00 | 0.17 | The chart shows monthly sales for the first half of the year. According to the data, March (Mar) had **57** units sold. ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 20 | 0 | 21 | 0 | 6,946 | 0 | 8,148 | 0 | 80,384 | 1,860 | 1.3 | 0.0 | 143.0 | 143.0 | 0.24 | 0.14 | Order placed successfully. **Summary:** - Cart: 2× Summit Flask ($14.00), 1× Harbor Satchel ($22.50), 3× Cedar Wrap ($8.50), 1× Cotton Smock ($31.00) → Subtota |
| `long-admin` | Mantis | 1 | success | 1 | 18 | 0 | 18 | 0 | 17,046 | 0 | 11,075 | 0 | 96,256 | 1,890 | 1.3 | 0.0 | 133.9 | 133.9 | 0.62 | 0.18 | All changes verified and saved. The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Verified final states: - Inez Cruz → Editor ✓ - Lara |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 23 | 0 | 7,536 | 0 | 8,289 | 0 | 80,512 | 1,396 | 1.2 | 0.0 | 145.5 | 145.5 | 0.45 | 0.15 | The workspace was created successfully. I completed all steps: - **Company:** Aster Works, 51–200 employees, Germany, VAT ID DE123456789 - **Admin contact:** N |
