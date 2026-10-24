# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 25 exact recovery rows = 25 logical runs; 25 recorded so far; 25 total attempts including retries.
- Exact rows: `longlive-sauce-cart-revise|mantis|1`, `longlive-sauce-checkout-review|mantis|1`, `longlive-sauce-cart-revise|tree|1`, `longlive-sauce-checkout-review|tree|1`, `longlive-internet-window-frames-upload|mantis|1`, `longlive-form-selenium-review|mantis|1`, `longlive-sauce-cart-revise|mantis|2`, `longlive-sauce-checkout-review|mantis|2`, `longlive-sauce-cart-revise|tree|2`, `longlive-sauce-checkout-review|tree|2`, `longlive-internet-window-frames-upload|mantis|2`, `longlive-form-selenium-review|mantis|2`, `longlive-sauce-cart-revise|mantis|3`, `longlive-sauce-checkout-review|mantis|3`, `longlive-sauce-cart-revise|tree|3`, `longlive-sauce-checkout-review|tree|3`, `longlive-internet-window-frames-upload|mantis|3`, `longlive-form-selenium-review|mantis|3`, `longlive-internet-window-frames-upload|tree|1`, `longlive-internet-window-frames-upload|tree|2`, `longlive-met-vangogh|mantis|1`, `longlive-met-vangogh|mantis|2`, `longlive-met-rembrandt-search|mantis|1`, `longlive-met-rembrandt-search|mantis|2`, `longlive-gutenberg-dickens-search|mantis|3`.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 17 / 17 | 8 / 8 |
| After reruns / merged correct | 17 / 17 | 8 / 8 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 17 / 17 | 8 / 8 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 347 | 246 |
| MCP tool errors (including retries) | 8 | 16 |
| Browser observation text (observed chars) | 454,429 | 360,200 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | 577,421 | 349,964 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 5,286,272 | 4,867,200 |
| Output tokens (total) | 19,415 | 11,281 |
| Total input tokens incl. cache (legacy) | 5,863,693 | 5,217,164 |
| MCP startup (total, s) | 34.7 | 16.1 |
| CLI startup (total, s) | 13.2 | 3.9 |
| CLI execution (total, s) | 1025.6 | 659.7 |
| CLI wall (total, s) | 1038.9 | 663.6 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 3.1 | 1.5 |
| Harness capture (total, s) | 29.2 | 162.9 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-met-vangogh` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 87,051 | 0 | 27,135 | 0 | 234,368 | 1,981 | 2.1 | 1.1 | 102.9 | 104.0 | 0.00 | 0.16 | 436528 \| Irises \| 1890 \| Oil on canvas \| 58.187 \| 73.7 x 92.1 cm 436532 \| Self-Portrait with a Straw Hat (obverse: The Potato Peeler) \| 1887 \| Oil on canvas \| 6 |
| `longlive-met-vangogh` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 90,872 | 0 | 38,597 | 0 | 169,472 | 1,254 | 2.1 | 1.1 | 89.0 | 90.0 | 0.00 | 0.16 | 436528 \| Irises \| 1890 \| Oil on canvas \| 58.187 \| 73.7 x 92.1 cm 436532 \| Self-Portrait with a Straw Hat (obverse: The Potato Peeler) \| 1887 \| Oil on canvas \| 6 |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 10 | 2 | 9,050 | 0 | 18,569 | 0 | 165,760 | 754 | 2.1 | 1.1 | 35.2 | 36.3 | 0.00 | 0.21 | I selected Author **Charles Dickens**, Language **English**, and Subject Areas **PR Language and Literatures: English literature**, leaving the other filters at |
| `longlive-met-rembrandt-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 63,524 | 0 | 52,585 | 0 | 921,728 | 2,340 | 2.1 | 1.1 | 166.9 | 168.0 | 0.00 | 0.17 | 437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm 437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm Taller: 437394 Curren |
| `longlive-met-rembrandt-search` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 25 | 2 | 51,637 | 0 | 57,283 | 0 | 553,728 | 1,352 | 2.1 | 0.9 | 93.5 | 94.5 | 0.00 | 0.17 | 437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm 437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm Taller: 437394 The cu |
| `longlive-form-selenium-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 6,918 | 0 | 25,189 | 0 | 164,480 | 785 | 2.1 | 0.9 | 30.0 | 30.9 | 0.00 | 0.22 | Prepared: LL16 rehearsal; unsubmitted The form currently shows Text input “LL16 rehearsal,” Textarea “Synthetic profile. Leave unsubmitted.,” Dropdown (select) |
| `longlive-form-selenium-review` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 12 | 0 | 8,456 | 0 | 18,847 | 0 | 161,408 | 1,035 | 2.0 | 0.5 | 26.3 | 26.8 | 0.00 | 0.24 | Prepared: LL16 rehearsal; unsubmitted The form is showing Text input “LL16 rehearsal,” Textarea “Synthetic profile. Leave unsubmitted.,” Dropdown (select) “Two |
| `longlive-form-selenium-review` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 13 | 0 | 8,394 | 0 | 19,465 | 0 | 200,576 | 897 | 2.0 | 0.7 | 28.4 | 29.1 | 0.00 | 0.21 | Prepared: LL16 rehearsal; unsubmitted. The page currently shows Text input “LL16 rehearsal,” Textarea “Synthetic profile. Leave unsubmitted.”, Dropdown (select |
| `longlive-sauce-cart-revise` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 13,889 | 0 | 38,469 | 0 | 238,208 | 789 | 2.0 | 0.6 | 41.5 | 42.1 | 0.00 | 0.17 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart currently shows quantity 1 for each item, a “Cart, 2 items” badge, and the Checkout button |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 42,568 | 0 | 52,883 | 0 | 372,352 | 1,075 | 2.0 | 0.7 | 60.7 | 61.4 | 0.00 | 0.17 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart is currently visible with one of each item, a badge showing 2 items, and Checkout visible. |
| `longlive-sauce-cart-revise` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 17 | 1 | 13,959 | 0 | 37,979 | 0 | 256,000 | 884 | 2.0 | 0.5 | 47.7 | 48.3 | 0.00 | 0.18 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart currently shows quantity 1 for each item, a “Cart, 2 items” badge, and the Checkout button |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 40,999 | 0 | 47,674 | 0 | 447,104 | 1,226 | 2.0 | 0.6 | 61.4 | 62.0 | 0.00 | 0.19 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart currently shows quantity 1 for each item, a cart badge of 2, and Checkout visible. I did n |
| `longlive-sauce-cart-revise` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 18 | 1 | 16,102 | 0 | 40,248 | 0 | 258,048 | 825 | 2.0 | 0.5 | 42.3 | 42.8 | 0.00 | 0.17 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart currently shows quantity 1 for each item, a badge of 2, and Checkout visible. The Products |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 26 | 1 | 48,710 | 0 | 32,893 | 0 | 488,192 | 1,157 | 2.0 | 0.5 | 63.3 | 63.8 | 0.00 | 0.19 | Cart: Sauce Labs Backpack; Sauce Labs Bolt T-Shirt; count 2 The cart currently shows quantity 1 for each item, a badge of 2, and Checkout visible. I left Check |
| `longlive-sauce-checkout-review` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 26 | 1 | 21,341 | 0 | 45,304 | 0 | 412,288 | 998 | 2.0 | 0.4 | 55.6 | 56.0 | 0.00 | 0.20 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Currently visible on Checkout: Overview: one Onesie and one Fleece Jacket,  |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 50 | 5 | 79,054 | 0 | 47,947 | 0 | 1,246,208 | 2,085 | 2.0 | 0.4 | 113.0 | 113.5 | 0.00 | 0.18 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Currently visible on Checkout: Overview: one Onesie and one Fleece Jacket,  |
| `longlive-sauce-checkout-review` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 23,554 | 0 | 49,042 | 0 | 492,288 | 1,418 | 2.0 | 0.5 | 61.9 | 62.4 | 0.00 | 0.17 | Current page: Checkout: Overview. The cart badge shows 2, and the visible line items are one Sauce Labs Onesie and one Sauce Labs Fleece Jacket. The page also s |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 40 | 2 | 65,206 | 0 | 55,274 | 0 | 888,832 | 1,793 | 2.0 | 0.4 | 159.6 | 160.0 | 0.00 | 0.16 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Currently visible: Checkout: Overview on Sauce Demo. The site shows one Sau |
| `longlive-sauce-checkout-review` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 32 | 1 | 24,469 | 0 | 48,537 | 0 | 438,272 | 1,356 | 2.0 | 0.4 | 69.4 | 69.9 | 0.00 | 0.16 | Review: Sauce Labs Onesie; Sauce Labs Fleece Jacket; count 2; stopped before Finish Currently visible on Checkout: Overview: one Onesie and one Fleece Jacket,  |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 42 | 3 | 65,762 | 0 | 60,154 | 0 | 891,264 | 1,804 | 2.0 | 0.4 | 97.5 | 97.9 | 0.00 | 0.23 | Currently visible: Checkout: Overview at `https://www.saucedemo.com/checkout-step-two.html`, with cart badge **2** and one each of Sauce Labs Onesie and Sauce L |
| `longlive-internet-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,211 | 0 | 31,368 | 0 | 175,616 | 794 | 2.0 | 0.5 | 42.4 | 42.9 | 0.00 | 0.19 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: not submitted The frame text and new tab |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 21 | 3 | 9,346 | 0 | 20,406 | 0 | 305,792 | 1,149 | 2.0 | 0.4 | 57.9 | 58.3 | 0.00 | 0.18 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: not selected; the file chooser rejected the supplied p |
| `longlive-internet-window-frames-upload` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,253 | 0 | 10,733 | 0 | 218,752 | 1,001 | 2.0 | 1.9 | 46.2 | 48.1 | 0.00 | 0.18 | New tab: New Window (rechecked; retained in the other tab) Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: no |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 17 | 2 | 8,555 | 0 | 32,733 | 0 | 227,456 | 992 | 2.0 | 0.4 | 46.3 | 46.8 | 0.00 | 0.16 | I visited the requested pages and observed the new tab heading and frame text. I could not select the file: the browser’s file chooser denied the exact harness- |
| `longlive-internet-window-frames-upload` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 14 | 0 | 4,749 | 0 | 18,071 | 0 | 225,280 | 952 | 2.0 | 0.4 | 46.3 | 46.7 | 0.00 | 0.15 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: not submitted The tab and frame text are |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-met-vangogh` | Mantis | 1 | 1 | success | n/a | 1200 | 30 | 261,503 | 102.9 | unknown | unknown | known |
| `longlive-met-vangogh` | Mantis | 2 | 1 | success | n/a | 1200 | 28 | 208,069 | 89.0 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | 1 | success | n/a | 1200 | 10 | 184,329 | 35.2 | unknown | unknown | known |
| `longlive-met-rembrandt-search` | Mantis | 1 | 1 | success | n/a | 1200 | 34 | 974,313 | 166.9 | unknown | unknown | known |
| `longlive-met-rembrandt-search` | Mantis | 2 | 1 | success | n/a | 1200 | 25 | 611,011 | 93.5 | unknown | unknown | known |
| `longlive-form-selenium-review` | Mantis | 1 | 1 | success | n/a | 1200 | 11 | 189,669 | 30.0 | unknown | unknown | known |
| `longlive-form-selenium-review` | Mantis | 2 | 1 | success | n/a | 1200 | 12 | 180,255 | 26.3 | unknown | unknown | known |
| `longlive-form-selenium-review` | Mantis | 3 | 1 | success | n/a | 1200 | 13 | 220,041 | 28.4 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 276,677 | 41.5 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 24 | 425,235 | 60.7 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 2 | 1 | success | n/a | 1200 | 17 | 293,979 | 47.7 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 26 | 494,778 | 61.4 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Mantis | 3 | 1 | success | n/a | 1200 | 18 | 298,296 | 42.3 | unknown | unknown | known |
| `longlive-sauce-cart-revise` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 26 | 521,085 | 63.3 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Mantis | 1 | 1 | success | n/a | 1200 | 26 | 457,592 | 55.6 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 50 | 1,294,155 | 113.0 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Mantis | 2 | 1 | success | n/a | 1200 | 28 | 541,330 | 61.9 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 40 | 944,106 | 159.6 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Mantis | 3 | 1 | success | n/a | 1200 | 32 | 486,809 | 69.4 | unknown | unknown | known |
| `longlive-sauce-checkout-review` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 42 | 951,418 | 97.5 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 206,984 | 42.4 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 21 | 326,198 | 57.9 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 2 | 1 | success | n/a | 1200 | 17 | 229,485 | 46.2 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 17 | 260,189 | 46.3 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 3 | 1 | success | n/a | 1200 | 14 | 243,351 | 46.3 | unknown | unknown | known |
