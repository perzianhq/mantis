# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 4 runs in parallel.
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
| Tool calls (including retries) | 70 |
| Sarvam API attempts (including retries) | 73 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 38,467 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 31,893 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 244,992 |
| Output tokens (total) | 5,567 |
| Total input tokens incl. cache (legacy) | 276,885 |
| MCP startup (total, s) | 7.1 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 382.4 |
| CLI wall (total, s) | 382.4 |
| Fixture verification (total, s) | 1.3 |
| Cleanup (total, s) | 1.3 |
| Harness capture (total, s) | 2.9 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 1.50 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,858 | 0 | 9,216 | 241 | 0.8 | 0.0 | 14.1 | 14.1 | 0.17 | 0.18 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,187 | 0 | 6,656 | 216 | 0.9 | 0.0 | 10.3 | 10.3 | 0.01 | 0.17 | The file "Quarterly draft" was deleted. After confirming the delete dialog, the page showed the confirmation message: **"Quarterly draft was moved to trash."** |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,133 | 0 | 6,656 | 180 | 0.9 | 0.0 | 11.1 | 11.1 | 0.00 | 0.19 | I selected the Business plan ($15/month) and received the confirmation message. ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 549 | 0 | 853 | 0 | 4,864 | 163 | 0.9 | 0.0 | 10.5 | 10.5 | 0.01 | 0.17 | The reimbursement policy section states: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 902 | 0 | 4,736 | 165 | 0.9 | 0.0 | 8.1 | 8.1 | 0.00 | 0.18 | The chart shows units sold per month: Jan 18, Feb 25, **Mar 57**, Apr 31, May 37, Jun 29. ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 21 | 0 | 22 | 0 | 7,236 | 0 | 8,662 | 0 | 86,144 | 1,891 | 0.8 | 0.0 | 132.5 | 132.5 | 0.24 | 0.13 | Order placed successfully. - Cart: 2× Summit Flask ($28.00), 1× Harbor Satchel ($22.50), 3× Cedar Wrap ($25.50), 1× Cotton Smock ($31.00) = Subtotal $107.00 -  |
| `long-admin` | Mantis | 1 | success | 1 | 13 | 0 | 11 | 0 | 20,243 | 0 | 9,593 | 0 | 52,608 | 1,334 | 0.8 | 0.0 | 70.8 | 70.8 | 0.43 | 0.17 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** All six edits were applied and saved (Inez Cruz → Editor, Ravi Mehta → Admin, Lara Sh |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 21 | 0 | 6,780 | 0 | 7,705 | 0 | 74,112 | 1,377 | 1.3 | 0.0 | 124.9 | 124.9 | 0.45 | 0.14 | The workspace was created successfully with all the specified details. Summary of what was set up: - **Company:** Aster Works, 51–200 employees, Germany, VAT I |
