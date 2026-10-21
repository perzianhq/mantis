# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 6 runs in parallel.
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
| Tool calls (including retries) | 79 |
| Sarvam API attempts (including retries) | 82 |
| Sarvam HTTP 429 responses | 0 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 58,325 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 44,084 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 386,688 |
| Output tokens (total) | 9,662 |
| Total input tokens incl. cache (legacy) | 430,772 |
| MCP startup (total, s) | 7.5 |
| CLI startup (total, s) | 0.0 |
| CLI execution (total, s) | 524.5 |
| CLI wall (total, s) | 524.5 |
| Fixture verification (total, s) | 1.4 |
| Cleanup (total, s) | 1.3 |
| Harness capture (total, s) | 3.4 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | 2.31 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,047 | 0 | 1,861 | 0 | 9,216 | 242 | 1.0 | 0.0 | 25.2 | 25.2 | 0.17 | 0.16 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 694 | 0 | 1,091 | 0 | 6,784 | 232 | 1.0 | 0.0 | 21.9 | 21.9 | 0.01 | 0.17 | The file "Quarterly draft" was deleted, and the confirmation message shown was: **"Quarterly draft was moved to trash."** ANSWER: Quarterly draft was moved to |
| `plans-pick` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 598 | 0 | 1,125 | 0 | 6,656 | 168 | 1.0 | 0.0 | 20.5 | 20.5 | 0.01 | 0.18 | I selected the Business plan and received the confirmation message. ANSWER: BIZ-77 |
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,156 | 0 | 6,784 | 199 | 1.0 | 0.0 | 20.7 | 20.7 | 0.01 | 0.18 | The reimbursement policy FAQ states: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `chart-march` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 320 | 0 | 904 | 0 | 4,736 | 160 | 1.0 | 0.0 | 11.0 | 11.0 | 0.00 | 0.19 | The chart shows a bar chart of monthly sales. The value for March (Mar) is 57 units. ANSWER: 57 |
| `long-shop` | Mantis | 1 | success | 1 | 21 | 0 | 22 | 0 | 7,236 | 0 | 8,792 | 0 | 85,504 | 1,808 | 1.0 | 0.0 | 148.4 | 148.4 | 0.25 | 0.15 | The order was placed successfully. Order summary: - 2× Summit Flask ($14.00 each) - 1× Harbor Satchel ($22.50) - 3× Cedar Wrap ($8.50 each) - 1× Cotton Smock ( |
| `long-admin` | Mantis | 1 | success | 1 | 21 | 0 | 19 | 0 | 39,677 | 0 | 21,156 | 0 | 193,024 | 5,475 | 0.7 | 0.0 | 154.1 | 154.1 | 0.53 | 0.14 | The confirmation message reads: **"Saved 6 changes. Change set C-5365."** Summary of what I did (6 changes, verified before saving): - Inez Cruz → Editor (page |
| `long-onboard` | Mantis | 1 | success | 1 | 22 | 0 | 21 | 0 | 6,780 | 0 | 7,999 | 0 | 73,984 | 1,378 | 0.7 | 0.0 | 122.6 | 122.6 | 0.46 | 0.15 | The workspace was created successfully with all the specified details: - Company: Aster Works, 51–200 employees, Germany, VAT DE123456789 - Admin: Nora Bell (no |
