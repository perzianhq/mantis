# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 2 runs in parallel.
- Scope: 1 tasks × 3 approaches × 3 runs = 9 logical runs; 9 recorded so far; 9 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 3 / 3 | 3 / 3 | 3 / 3 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 9 | 14 | 12 |
| Sarvam API attempts (including retries) | 12 | 17 | 15 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 2,898 | 6,621 | 333 |
| Browser observation images (observed blocks) | 0 | 1 | 6 |
| Normal input tokens (total) | 3,399 | 7,329 | 7,146 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 20,480 | 46,208 | 13,056 |
| Output tokens (total) | 578 | 1,129 | 643 |
| Total input tokens incl. cache (legacy) | 23,879 | 53,537 | 20,202 |
| MCP startup (total, s) | 6.1 | 6.1 | 6.1 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 22.1 | 34.2 | 20.9 |
| CLI wall (total, s) | 22.1 | 34.2 | 20.9 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.5 | 0.5 | 0.4 |
| Harness capture (total, s) | 1.5 | 10.1 | 0.9 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 0.16 | 0.32 | 0.25 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `faq-refund` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 952 | 0 | 1,278 | 0 | 6,656 | 184 | 2.0 | 0.0 | 6.0 | 6.0 | 0.01 | 0.21 | The Help centre's reimbursement policy states you can ask for a full reimbursement within 45 days of purchase. ANSWER: 45 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,892 | 0 | 1,986 | 0 | 12,928 | 229 | 2.0 | 0.0 | 6.4 | 6.4 | 0.01 | 0.18 | You can ask for a full reimbursement within **45 days** of purchase. ANSWER: 45 days |
| `faq-refund` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,406 | 0 | 4,352 | 226 | 2.0 | 0.0 | 7.4 | 7.4 | 0.01 | 0.13 | The reimbursement policy states: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `faq-refund` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,065 | 0 | 6,912 | 197 | 2.0 | 0.0 | 4.6 | 4.6 | 0.00 | 0.14 | The reimbursement policy section is expanded and confirms the answer. ANSWER: 45 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,892 | 0 | 1,752 | 0 | 13,184 | 240 | 2.0 | 0.0 | 6.0 | 6.0 | 0.01 | 0.14 | You can ask for a full reimbursement within **45 days** of purchase. ANSWER: 45 days |
| `faq-refund` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,370 | 0 | 4,352 | 213 | 2.0 | 0.0 | 5.9 | 5.9 | 0.01 | 0.14 | The reimbursement policy states: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `faq-refund` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 973 | 0 | 1,056 | 0 | 6,912 | 197 | 2.0 | 0.0 | 11.4 | 11.4 | 0.01 | 0.15 | The reimbursement policy states you can ask for a full reimbursement within 45 days of purchase. ANSWER: 45 days |
| `faq-refund` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 0 | 2,837 | 1 | 3,591 | 0 | 20,096 | 660 | 2.0 | 0.0 | 21.7 | 21.7 | 0.01 | 0.13 | The Help centre page shows the reimbursement policy answer: "You can ask for a full reimbursement within 45 days of purchase." ANSWER: 45 days |
| `faq-refund` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 111 | 2 | 2,370 | 0 | 4,352 | 204 | 2.0 | 0.0 | 7.6 | 7.6 | 0.01 | 0.14 | The reimbursement policy states you can ask for a full reimbursement within 45 days of purchase. ANSWER: 45 days |
