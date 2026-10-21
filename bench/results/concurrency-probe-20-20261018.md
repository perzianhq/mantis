# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 20 runs in parallel.
- Scope: 25 tasks × 1 approaches × 1 runs = 25 logical runs; 16 recorded so far; 16 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 6 / 16 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 10 |
| Tool calls (including retries) | 14 |
| Sarvam API attempts (including retries) | 40 |
| Sarvam HTTP 429 responses | 20 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 8,522 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | unknown |
| Cache-write input tokens (total) | unknown |
| Cache-read input tokens (total) | unknown |
| Output tokens (total) | unknown |
| Total input tokens incl. cache (legacy) | unknown |
| MCP startup (total, s) | 39.1 |
| CLI startup (total, s) | unknown |
| CLI execution (total, s) | unknown |
| CLI wall (total, s) | unknown |
| Fixture verification (total, s) | 0.1 |
| Cleanup (total, s) | 3.6 |
| Harness capture (total, s) | 5.5 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `login` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.4 | unknown | unknown | unknown | 0.00 | 0.24 | Sarvam HTTP 429 |
| `cookie-cart` | Mantis | 1 | success | 1 | 3 | 0 | 6 | 2 | 517 | 0 | 1,163 | 0 | 6,656 | 217 | 2.4 | 0.0 | 18.2 | 18.2 | 0.01 | 0.19 | The product was added successfully. ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 3 | 0 | 8 | 4 | 1,251 | 0 | 1,567 | 0 | 7,296 | 201 | 2.4 | 0.0 | 38.6 | 38.6 | 0.01 | 0.20 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 951 | 0 | 4,864 | 133 | 2.6 | 0.0 | 8.4 | 8.4 | 0.01 | 0.20 | The Business plan is $39 per month. ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.6 | unknown | unknown | unknown | 0.00 | 0.17 | Sarvam HTTP 429 |
| `checkout-steps` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.4 | unknown | unknown | unknown | 0.00 | 0.21 | Sarvam HTTP 429 |
| `booking-date` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.8 | unknown | unknown | unknown | 0.00 | 0.29 | Sarvam HTTP 429 |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,605 | 0 | 3,072 | 136 | 2.4 | 0.0 | 4.3 | 4.3 | 0.01 | 0.28 | The article states: "After years of planning and two failed attempts to secure funding, the harbour light was finally lit for the first time in 1888, guiding sh |
| `inventory-lookup` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.7 | unknown | unknown | unknown | 0.00 | 0.24 | Sarvam HTTP 429 |
| `modal-delete` | Mantis | 1 | success | 1 | 3 | 0 | 10 | 6 | 694 | 0 | 1,187 | 0 | 6,656 | 178 | 2.6 | 0.0 | 49.8 | 49.8 | 0.01 | 0.20 | The file was deleted successfully. ANSWER: Quarterly draft was moved to trash. |
| `menu-settings` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.7 | unknown | unknown | unknown | 0.00 | 0.22 | Sarvam HTTP 429 |
| `spa-team` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.6 | unknown | unknown | unknown | 0.00 | 0.29 | Sarvam HTTP 429 |
| `plans-pick` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.8 | unknown | unknown | unknown | 0.00 | 0.28 | Sarvam HTTP 429 |
| `faq-refund` | Mantis | 1 | success | 1 | 2 | 0 | 11 | 8 | 549 | 0 | 725 | 0 | 4,992 | 163 | 2.6 | 0.0 | 60.8 | 60.8 | 0.01 | 0.16 | The reimbursement policy section states: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `iframe-pay` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.4 | unknown | unknown | unknown | 0.00 | 0.20 | Sarvam HTTP 429 |
| `long-shop` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 0.7 | unknown | unknown | unknown | 0.00 | 0.19 | Sarvam HTTP 429 |
