# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 1; 15 runs in parallel.
- Scope: 25 tasks × 1 approaches × 1 runs = 25 logical runs; 9 recorded so far; 9 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| Correct | 7 / 9 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 2 |
| Tool calls (including retries) | 20 |
| Sarvam API attempts (including retries) | 52 |
| Sarvam HTTP 429 responses | 25 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 12,329 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | unknown |
| Cache-write input tokens (total) | unknown |
| Cache-read input tokens (total) | unknown |
| Output tokens (total) | unknown |
| Total input tokens incl. cache (legacy) | unknown |
| MCP startup (total, s) | 18.5 |
| CLI startup (total, s) | unknown |
| CLI execution (total, s) | unknown |
| CLI wall (total, s) | unknown |
| Fixture verification (total, s) | 0.1 |
| Cleanup (total, s) | 1.8 |
| Harness capture (total, s) | 3.8 |
| Cost estimate (USD; including retries) | unknown |
| Cost estimate (INR; including retries) | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 4 | 0 | 12 | 7 | 1,011 | 0 | 1,468 | 0 | 8,704 | 277 | 2.0 | 0.0 | 94.8 | 94.8 | 0.03 | 0.18 | The form was submitted with Country set to Ireland and the weekly newsletter checkbox checked. The page shows the confirmation message: "Subscribed from Irelan |
| `cookie-cart` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 517 | 0 | 1,271 | 0 | 6,528 | 230 | 1.8 | 0.0 | 51.2 | 51.2 | 0.01 | 0.20 | The product was added successfully. After accepting the cookie dialog and clicking "Add to cart", the cart status changed from "Cart is empty." to the confirmat |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 8 | 5 | 798 | 0 | 951 | 0 | 4,864 | 147 | 2.0 | 0.0 | 75.9 | 75.9 | 0.01 | 0.20 | The pricing page shows the Business plan at **$39 per month**. ANSWER: $39 per month |
| `article-deep-fact` | Mantis | 1 | success | 1 | 1 | 0 | 7 | 5 | 4,713 | 0 | 1,605 | 0 | 3,072 | 129 | 2.1 | 0.0 | 76.4 | 76.4 | 0.00 | 0.19 | The article states: "After years of planning and two failed attempts to secure funding, the harbour light was finally lit for the first time in 1888, guiding sh |
| `inventory-lookup` | Mantis | 1 | success | 1 | 1 | 0 | 2 | 0 | 1,446 | 0 | 1,249 | 0 | 3,072 | 143 | 2.2 | 0.0 | 15.4 | 15.4 | 0.00 | 0.27 | Gadget 30 has SKU **G-4096** and **97** in stock. ANSWER: Gadget 30 — SKU G-4096, 97 in stock. |
| `churned-max` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.1 | unknown | unknown | unknown | 0.00 | 0.23 | Sarvam HTTP 429 |
| `search-pagination` | Mantis | 1 | success | 1 | 5 | 0 | 9 | 3 | 1,797 | 0 | 2,176 | 0 | 11,776 | 287 | 2.1 | 0.0 | 80.1 | 80.1 | 0.02 | 0.18 | The result titled "Koala facts" was on page 4 of the search results. Opening it shows it was written by mira.k. ANSWER: mira.k. |
| `feed-scroll` | Mantis | 1 | success | 1 | 4 | 0 | 10 | 5 | 2,047 | 0 | 1,861 | 0 | 9,216 | 242 | 2.2 | 0.0 | 88.9 | 88.9 | 0.07 | 0.18 | Post #36 says: "The meeting moved to Friday at dusk." ANSWER: The meeting moved to Friday at dusk. |
| `modal-delete` | Mantis | 1 | crash | 1 | 0 | 0 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 2.1 | unknown | unknown | unknown | 0.00 | 0.21 | Sarvam HTTP 429 |
