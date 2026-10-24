# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 8 exact recovery rows = 8 logical runs; 8 recorded so far; 8 total attempts including retries.
- Exact rows: `longlive-form-selenium-review|mantis|1`, `longlive-sauce-cart-revise|mantis|1`, `longlive-form-selenium-review|mantis|2`, `longlive-sauce-cart-revise|mantis|2`, `longlive-form-selenium-review|mantis|3`, `longlive-sauce-cart-revise|mantis|3`, `longlive-sauce-cart-revise|tree|1`, `longlive-sauce-checkout-review|mantis|2`.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 7 / 7 | 1 / 1 |
| After reruns / merged correct | 7 / 7 | 1 / 1 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 7 / 7 | 1 / 1 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 138 | 26 |
| MCP tool errors (including retries) | 0 | 2 |
| Browser observation text (observed chars) | 122,354 | 25,879 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | 222 | 38 |
| Cache-write input tokens (total) | 150,062 | 30,117 |
| Cache-read input tokens (total) | 1,747,333 | 367,842 |
| Output tokens (total) | 18,488 | 3,097 |
| Total input tokens incl. cache (legacy) | 1,897,617 | 397,997 |
| MCP startup (total, s) | 14.4 | 2.1 |
| CLI startup (total, s) | 18.0 | 3.3 |
| CLI execution (total, s) | 295.5 | 60.9 |
| CLI wall (total, s) | 313.5 | 64.2 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 1.3 | 0.2 |
| Harness capture (total, s) | 7.3 | 16.7 |
| Cost estimate (USD; including retries) | 1.36 | 0.27 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 14 | 0 | 12,781 | 0 | 20 | 21,371 | 128,022 | 2,422 | 2.1 | 3.3 | 29.0 | 32.3 | 0.00 | 0.22 | Prepared: LL16 rehearsal; unsubmitted The form is filled and nothing was submitted. The final read of the page shows: - Text input: "LL16 rehearsal" - Textarea |
| `longlive-form-selenium-review` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 14,329 | 0 | 22 | 22,053 | 148,657 | 2,221 | 2.1 | 3.1 | 28.2 | 31.3 | 0.00 | 0.19 | Prepared: LL16 rehearsal; unsubmitted The form is filled and unsubmitted. The page shows no site-generated result, since Submit was never clicked. Current val |
| `longlive-form-selenium-review` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 10,624 | 0 | 28 | 21,123 | 203,330 | 3,236 | 2.1 | 3.1 | 38.0 | 41.1 | 0.00 | 0.18 | Prepared: LL16 rehearsal; unsubmitted The form on the page now shows the review-corrected values: - Text input: "LL16 rehearsal" - Textarea: "Synthetic profile |
| `longlive-sauce-cart-revise` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 30,640 | 0 | 32 | 29,490 | 281,720 | 2,508 | 2.1 | 3.0 | 46.8 | 49.8 | 0.00 | 0.16 | The cart now holds exactly one Sauce Labs Backpack and one Sauce Labs Bolt T-Shirt, with the badge at 2 and the Checkout button visible. I did not click Checkou |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 26 | 2 | 25,879 | 0 | 38 | 30,117 | 367,842 | 3,097 | 2.1 | 3.3 | 60.9 | 64.2 | 0.00 | 0.17 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart page is open and currently shows one Backpack (QTY 1, $29.99) and one Bolt T-Shirt (QTY 1, |
| `longlive-sauce-cart-revise` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 20 | 0 | 18,281 | 0 | 40 | 22,812 | 323,962 | 2,289 | 2.1 | 3.0 | 44.3 | 47.3 | 0.00 | 0.16 | Cart now holds the Sauce Labs Backpack and Sauce Labs Bolt T-Shirt, each at quantity 1, with the badge at 2 and Checkout visible. I did not click Checkout. Car |
| `longlive-sauce-cart-revise` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 15,626 | 0 | 32 | 15,038 | 246,408 | 2,339 | 2.0 | 1.2 | 45.2 | 46.4 | 0.00 | 0.17 | The cart now holds exactly one Sauce Labs Backpack and one Sauce Labs Bolt T-Shirt, with the cart badge reading "Cart, 2 items" and Checkout visible. I did not  |
| `longlive-sauce-checkout-review` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 20,073 | 0 | 48 | 18,175 | 415,234 | 3,473 | 2.0 | 1.3 | 64.0 | 65.3 | 0.00 | 0.20 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish The page is currently at "Checkout: Overview" with the Finish button not cl |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-review` | Mantis | 1 | 1 | success | n/a | 1200 | 14 | 149,413 | 29.0 | 0.155 | unknown | known |
| `longlive-form-selenium-review` | Mantis | 2 | 1 | success | n/a | 1200 | 15 | 170,732 | 28.2 | 0.161 | unknown | known |
| `longlive-form-selenium-review` | Mantis | 3 | 1 | success | n/a | 1200 | 15 | 224,481 | 38.0 | 0.189 | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 1 | 1 | success | n/a | 1200 | 28 | 311,242 | 46.8 | 0.233 | unknown | known |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 26 | 397,997 | 60.9 | 0.27 | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 2 | 1 | success | n/a | 1200 | 20 | 346,814 | 44.3 | 0.217 | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 3 | 1 | success | n/a | 1200 | 18 | 261,478 | 45.2 | 0.165 | unknown | known |
| `longlive-sauce-checkout-review` | Mantis | 2 | 1 | success | n/a | 1200 | 28 | 433,457 | 64.0 | 0.245 | unknown | known |
