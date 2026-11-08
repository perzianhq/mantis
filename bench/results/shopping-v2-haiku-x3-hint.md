# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-08; runs per task and approach: 3; 3 runs in parallel.
- Scope: 6 tasks × 3 approaches × 3 runs = 54 logical runs; 54 recorded so far; 54 total attempts including retries.
- Claude runtime: 2.1.310 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| First-pass correct (attempt 1) | 17 / 18 | 15 / 18 | 18 / 18 |
| After reruns / merged correct | 17 / 18 | 15 / 18 | 18 / 18 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 17 / 18 | 15 / 18 | 18 / 18 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 1 | 3 | 0 |
| Tool calls (including retries) | 650 | 643 | 799 |
| MCP tool errors (including retries) | 15 | 15 | 0 |
| Browser observation text (observed chars) | 422,820 | 474,582 | 85,655 |
| Browser observation images (observed blocks) | 21 | 0 | 320 |
| Normal input tokens (total) | 720 | 466 | 640 |
| Cache-write input tokens (total) | 369,637 | 408,203 | 650,644 |
| Cache-read input tokens (total) | 5,553,791 | 4,191,790 | 6,292,272 |
| Output tokens (total) | 62,568 | 74,953 | 88,689 |
| Total input tokens incl. cache (legacy) | 5,924,148 | 4,600,459 | 6,943,556 |
| MCP startup (total, s) | 36.3 | 36.3 | 36.3 |
| CLI startup (total, s) | 23.8 | 25.6 | 25.0 |
| CLI execution (total, s) | 813.5 | 634.5 | 671.0 |
| CLI wall (total, s) | 837.2 | 660.1 | 696.0 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 3.0 | 3.1 | 3.0 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | 0.16 | 0.16 | 0.24 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Shopping recommendation and visits

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| shopping-v2-material-colour | mantis | 3/3 | 3/3 | 3/3 | 85 |
| shopping-v2-material-colour | tree | 3/3 | 3/3 | 3/3 | 82 |
| shopping-v2-material-colour | screenshot | 3/3 | 3/3 | 3/3 | 113 |
| shopping-v2-tier-size | mantis | 3/3 | 3/3 | 3/3 | 87 |
| shopping-v2-tier-size | tree | 3/3 | 3/3 | 3/3 | 91 |
| shopping-v2-tier-size | screenshot | 3/3 | 3/3 | 3/3 | 128 |
| shopping-v2-closure-capacity | mantis | 3/3 | 3/3 | 3/3 | 98 |
| shopping-v2-closure-capacity | tree | 3/3 | 3/3 | 3/3 | 126 |
| shopping-v2-closure-capacity | screenshot | 3/3 | 3/3 | 3/3 | 130 |
| shopping-v2-finish-shape | mantis | 3/3 | 3/3 | 3/3 | 138 |
| shopping-v2-finish-shape | tree | 3/3 | 3/3 | 3/3 | 105 |
| shopping-v2-finish-shape | screenshot | 3/3 | 3/3 | 3/3 | 138 |
| shopping-v2-textile-pattern | mantis | 2/3 | 2/3 | 3/3 | 114 |
| shopping-v2-textile-pattern | tree | 1/3 | 1/3 | 3/3 | 122 |
| shopping-v2-textile-pattern | screenshot | 3/3 | 3/3 | 3/3 | 126 |
| shopping-v2-material-swatch | mantis | 3/3 | 3/3 | 3/3 | 128 |
| shopping-v2-material-swatch | tree | 2/3 | 2/3 | 3/3 | 117 |
| shopping-v2-material-swatch | screenshot | 3/3 | 3/3 | 3/3 | 164 |

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| All tasks | mantis | 17/18 | 17/18 | 18/18 | 650 |
| All tasks | tree | 15/18 | 15/18 | 18/18 | 643 |
| All tasks | screenshot | 18/18 | 18/18 | 18/18 | 799 |

## Per run

| Task | Approach | Run | Status | Answer-only | Workflow | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 27 | 0 | 19,108 | 0 | 30 | 20,993 | 194,767 | 2,089 | 2.0 | 1.6 | 33.0 | 34.5 | 0.00 | 0.17 | Alder item (Reference ql92g5u, $60.00, Linen, Red) added to cart |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 22,186 | 0 | 22 | 18,833 | 186,014 | 3,031 | 2.0 | 1.7 | 27.0 | 28.7 | 0.00 | 0.16 | Alder item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 38 | 0 | 3,638 | 15 | 32 | 31,794 | 282,358 | 4,269 | 2.0 | 1.8 | 32.0 | 33.8 | 0.00 | 0.18 | Alder item (reference ql92g5u, $60.00, Linen, Red) added to cart |
| `shopping-v2-material-colour` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 0 | 24,296 | 0 | 28 | 18,914 | 199,470 | 1,914 | 2.0 | 1.3 | 34.0 | 35.3 | 0.00 | 0.22 | Ember item (Reference qeu7h8f, $60.00) added to cart |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 23,671 | 0 | 20 | 19,331 | 159,851 | 2,666 | 2.0 | 1.5 | 26.4 | 27.9 | 0.00 | 0.20 | Ember item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 38 | 0 | 4,824 | 16 | 32 | 33,560 | 294,363 | 4,205 | 2.0 | 1.4 | 30.5 | 31.9 | 0.00 | 0.22 | Added Ember item (ref qeu7h8f, $60.00) to the cart; it is the only catalog item matching the browsed Linen/Green spec (per Birch's stockroom preview), and the cart now shows (1). |
| `shopping-v2-material-colour` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 24 | 1 | 15,336 | 0 | 36 | 14,492 | 226,475 | 2,471 | 2.0 | 1.6 | 36.1 | 37.7 | 0.00 | 0.14 | Ember item |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 26 | 0 | 21,813 | 0 | 18 | 18,314 | 134,530 | 2,605 | 2.0 | 2.1 | 22.9 | 25.0 | 0.00 | 0.15 | Ember item (Reference q8fcib0) added to cart; cart now shows 1 item. |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 3,613 | 15 | 34 | 31,096 | 285,928 | 3,680 | 2.0 | 1.6 | 31.2 | 32.8 | 0.00 | 0.15 | Ember item added to cart (Linen, Blue, $60.00), the cart now shows (1). |
| `shopping-v2-tier-size` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 25 | 1 | 14,708 | 0 | 32 | 14,633 | 205,958 | 2,662 | 2.0 | 1.2 | 36.0 | 37.2 | 0.00 | 0.16 | Ember item (Reference q14fdn5j, $60.00) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 1 | 21,609 | 0 | 22 | 18,918 | 184,359 | 3,001 | 2.0 | 1.3 | 28.3 | 29.6 | 0.00 | 0.16 | Ember item |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 47 | 0 | 5,231 | 23 | 46 | 43,838 | 559,881 | 4,271 | 2.0 | 1.3 | 37.2 | 38.6 | 0.00 | 0.15 | Ember item added to cart (Everyday tier, Compact size, $60.00, Reference q14fdn5j); cart now shows (1). |
| `shopping-v2-tier-size` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 25 | 1 | 17,204 | 0 | 44 | 15,464 | 298,752 | 2,401 | 2.0 | 1.2 | 41.6 | 42.9 | 0.00 | 0.16 | Alder item (Reference q1au8m2y, $60.00) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 0 | 21,251 | 0 | 18 | 18,762 | 133,152 | 3,083 | 2.0 | 1.4 | 27.5 | 28.9 | 0.00 | 0.16 | Alder item (Reference q1au8m2y, $60.00) added to cart |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 3,852 | 16 | 36 | 33,296 | 318,678 | 4,220 | 2.0 | 1.3 | 33.1 | 34.4 | 0.00 | 0.13 | Alder item (Reference q1au8m2y, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-tier-size` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 25,825 | 0 | 30 | 20,239 | 222,945 | 2,090 | 2.0 | 1.2 | 32.1 | 33.3 | 0.00 | 0.14 | Flint item (Reference q1h93l0d, $60.00) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 33 | 1 | 24,592 | 0 | 24 | 20,793 | 191,730 | 3,234 | 2.0 | 1.4 | 29.1 | 30.6 | 0.00 | 0.15 | Flint item added to cart (Reference q1h93l0d, $60.00) |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 41 | 0 | 3,876 | 16 | 36 | 33,096 | 319,839 | 3,971 | 2.0 | 1.4 | 33.7 | 35.1 | 0.00 | 0.16 | Flint item (Reference q1h93l0d, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 29,028 | 0 | 32 | 21,928 | 250,768 | 2,120 | 2.0 | 1.2 | 33.2 | 34.4 | 0.00 | 0.17 | Cairn item (Reference q5rxw4g, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 35 | 1 | 26,806 | 0 | 22 | 22,183 | 191,464 | 3,490 | 2.0 | 1.4 | 28.6 | 29.9 | 0.00 | 0.15 | Cairn item (Reference q5rxw4g, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 0 | 4,122 | 17 | 36 | 35,283 | 349,098 | 4,581 | 2.0 | 1.2 | 36.7 | 38.0 | 0.00 | 0.15 | Cairn item |
| `shopping-v2-closure-capacity` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 22,172 | 0 | 36 | 17,910 | 247,284 | 2,114 | 2.0 | 1.2 | 38.7 | 39.9 | 0.00 | 0.17 | Flint item (Reference qp0iswp, $60.00) added to cart — Closure, Zip, 24 litres, matching the shopper's viewed items. |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 55 | 3 | 33,559 | 0 | 72 | 27,151 | 732,910 | 4,315 | 2.0 | 1.3 | 70.0 | 71.3 | 0.00 | 0.19 | Flint item (Reference qp0iswp, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 5,309 | 17 | 24 | 34,814 | 217,945 | 3,725 | 2.0 | 1.3 | 30.5 | 31.9 | 0.00 | 0.18 | Flint item (Reference qp0iswp, $60.00) added to cart — the only catalog item matching the shopper's Zip closure and 24 litre capacity; cart now shows (1). |
| `shopping-v2-closure-capacity` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 3 | 21,211 | 0 | 42 | 17,670 | 290,202 | 2,445 | 2.0 | 1.2 | 45.7 | 47.0 | 0.00 | 0.18 | Iris item (Reference qilntza, $60.00, Zip closure, 18 litres) added to cart |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 1 | 28,458 | 0 | 24 | 23,265 | 220,604 | 3,765 | 2.0 | 1.4 | 29.9 | 31.3 | 0.00 | 0.18 | Iris item |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 4,100 | 17 | 32 | 27,893 | 246,453 | 4,186 | 2.0 | 1.2 | 30.5 | 31.7 | 0.00 | 0.16 | Iris item (Zip closure, 18 litres, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-finish-shape` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 3 | 26,501 | 0 | 44 | 20,990 | 330,812 | 2,642 | 2.0 | 1.4 | 45.4 | 46.8 | 0.00 | 0.18 | Birch item (Reference qoy9345, $60.00) added to cart |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 1 | 27,404 | 0 | 20 | 22,273 | 168,539 | 3,328 | 2.0 | 1.3 | 26.4 | 27.7 | 0.00 | 0.16 | Added Birch item (Reference qoy9345, $60.00) to the cart; the cart now shows 1 item. |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 4,343 | 18 | 38 | 37,124 | 387,359 | 4,812 | 2.0 | 1.3 | 36.6 | 37.9 | 0.00 | 0.18 | Birch item ($60.00, Reference qoy9345) added to cart; cart now shows (1). |
| `shopping-v2-finish-shape` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 51 | 0 | 29,152 | 0 | 46 | 24,153 | 381,726 | 3,616 | 2.0 | 1.3 | 49.9 | 51.2 | 0.00 | 0.19 | Ember item (Reference q5po6bw, Matte finish, Oval shape, $60.00) added to cart |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 0 | 27,322 | 0 | 24 | 22,951 | 219,551 | 3,793 | 2.0 | 1.3 | 32.6 | 33.9 | 0.00 | 0.17 | Added Ember item (Reference q5po6bw, $60.00) to the cart; it matches the shopper's browsed Matte/Oval pattern. |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 4,337 | 18 | 32 | 28,861 | 251,046 | 4,865 | 2.0 | 1.4 | 36.4 | 37.8 | 0.00 | 0.18 | Added Ember item to the cart ($60.00, Matte finish, Oval shape). |
| `shopping-v2-finish-shape` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 51 | 0 | 32,937 | 0 | 44 | 26,334 | 396,449 | 3,968 | 2.0 | 1.5 | 59.2 | 60.6 | 0.00 | 0.19 | Ember item (Reference qc4j59b, $60.00) added to cart |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 35 | 1 | 26,343 | 0 | 42 | 22,429 | 403,125 | 3,623 | 2.0 | 1.7 | 39.3 | 41.1 | 0.00 | 0.19 | Ember item |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 5,610 | 18 | 40 | 37,418 | 395,076 | 4,640 | 2.0 | 1.5 | 40.4 | 41.9 | 0.00 | 0.17 | Added Ember item (Reference qc4j59b, $60.00) to the cart; it is the only catalog item matching the shopper's browsed Matte finish and Square shape, and the cart now shows (1). |
| `shopping-v2-textile-pattern` | Mantis | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 30 | 0 | 18,366 | 0 | 42 | 18,879 | 300,651 | 5,145 | 2.0 | 1.5 | 50.7 | 52.2 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 40 | 1 | 28,904 | 0 | 24 | 25,922 | 234,323 | 5,919 | 2.0 | 1.4 | 43.7 | 45.0 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 4,945 | 16 | 24 | 34,153 | 211,360 | 4,741 | 2.0 | 1.4 | 31.9 | 33.3 | 0.00 | 0.15 | Alder item (reference qsa0va, $60.00) added to cart |
| `shopping-v2-textile-pattern` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 2 | 25,073 | 8 | 50 | 25,345 | 471,745 | 7,003 | 2.0 | 1.2 | 63.4 | 64.7 | 0.00 | 0.18 | Ember item (Reference q1tej3wz, $60.00) added to cart |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 1 | 30,889 | 0 | 26 | 28,913 | 255,786 | 7,696 | 2.0 | 1.3 | 52.9 | 54.2 | 0.00 | 0.17 | Ember item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 5,759 | 19 | 40 | 41,274 | 414,051 | 6,936 | 2.0 | 1.2 | 46.8 | 48.0 | 0.00 | 0.17 | Ember item added to cart (Cart (1)): Canvas with the checkerboard pattern shared by all four browsed products, $60.00. |
| `shopping-v2-textile-pattern` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 21,800 | 7 | 56 | 22,539 | 480,891 | 6,190 | 2.0 | 1.3 | 60.7 | 62.0 | 0.00 | 0.15 | Haven item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 39 | 1 | 27,247 | 0 | 22 | 24,588 | 191,445 | 5,383 | 2.0 | 1.2 | 35.4 | 36.6 | 0.00 | 0.19 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 4,945 | 16 | 34 | 33,643 | 306,560 | 4,064 | 2.0 | 1.7 | 33.4 | 35.1 | 0.00 | 0.14 | Added Haven item (Reference q1mzo4zk, $60.00) to the cart; the cart now shows (1). |
| `shopping-v2-material-swatch` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 52 | 0 | 34,166 | 6 | 42 | 27,602 | 402,833 | 4,621 | 2.0 | 1.3 | 48.7 | 50.0 | 0.00 | 0.19 | Flint item (Reference q1e507hn, $60.00) added to cart; the cart now shows Cart (1). |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 36 | 0 | 25,887 | 0 | 22 | 22,823 | 191,812 | 4,538 | 2.0 | 1.2 | 32.8 | 34.0 | 0.00 | 0.17 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 50 | 0 | 5,987 | 18 | 28 | 38,693 | 264,405 | 5,688 | 2.0 | 1.2 | 38.7 | 39.9 | 0.00 | 0.20 | Flint item |
| `shopping-v2-material-swatch` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 32 | 1 | 21,687 | 0 | 46 | 19,110 | 325,409 | 3,752 | 2.0 | 1.2 | 52.5 | 53.7 | 0.00 | 0.14 | Cairn item |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 41 | 1 | 28,999 | 0 | 22 | 25,470 | 195,937 | 5,552 | 2.0 | 1.3 | 38.4 | 39.7 | 0.00 | 0.18 | Cairn item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 66 | 0 | 6,414 | 25 | 52 | 52,605 | 718,516 | 8,846 | 2.0 | 1.3 | 61.5 | 62.8 | 0.00 | 0.17 | Cairn item |
| `shopping-v2-material-swatch` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 2 | 24,250 | 0 | 40 | 22,442 | 326,654 | 5,325 | 2.0 | 1.3 | 52.4 | 53.7 | 0.00 | 0.14 | Dune item added to cart |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 27,642 | 0 | 22 | 25,284 | 196,658 | 5,931 | 2.0 | 1.3 | 43.4 | 44.7 | 0.00 | 0.16 | Dune item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 48 | 0 | 4,750 | 20 | 44 | 42,203 | 469,356 | 6,989 | 2.0 | 1.2 | 49.9 | 51.1 | 0.00 | 0.14 | Added Dune item ($60.00, reference q1qyq5ch) to the cart; cart now shows (1). |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | 1 | success | n/a | 600 | 27 | 215,790 | 33.0 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 28 | 204,869 | 27.0 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 38 | 314,184 | 32.0 | 0.011 | unknown | known |
| `shopping-v2-material-colour` | Mantis | 2 | 1 | success | n/a | 600 | 34 | 218,412 | 34.0 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 28 | 179,202 | 26.4 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 38 | 327,955 | 30.5 | 0.012 | unknown | known |
| `shopping-v2-material-colour` | Mantis | 3 | 1 | success | n/a | 600 | 24 | 241,003 | 36.1 | 0.006 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 26 | 152,862 | 22.9 | 0.006 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 37 | 317,058 | 31.2 | 0.011 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 1 | 1 | success | n/a | 600 | 25 | 220,623 | 36.0 | 0.006 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 30 | 203,299 | 28.3 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 47 | 603,765 | 37.2 | 0.017 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 2 | 1 | success | n/a | 600 | 25 | 314,260 | 41.6 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 28 | 151,932 | 27.5 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 40 | 352,010 | 33.1 | 0.012 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 3 | 1 | success | n/a | 600 | 37 | 243,214 | 32.1 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 33 | 212,547 | 29.1 | 0.008 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 41 | 352,971 | 33.7 | 0.012 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 1 | 1 | success | n/a | 600 | 40 | 272,728 | 33.2 | 0.008 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 35 | 213,669 | 28.6 | 0.008 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 44 | 384,417 | 36.7 | 0.013 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 2 | 1 | success | n/a | 600 | 28 | 265,230 | 38.7 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 55 | 760,133 | 70.0 | 0.015 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 43 | 252,783 | 30.5 | 0.011 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 3 | 1 | success | n/a | 600 | 30 | 307,914 | 45.7 | 0.008 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 36 | 243,893 | 29.9 | 0.009 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 43 | 274,378 | 30.5 | 0.01 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 1 | 1 | success | n/a | 600 | 36 | 351,846 | 45.4 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 34 | 190,832 | 26.4 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 46 | 424,521 | 36.6 | 0.014 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 2 | 1 | success | n/a | 600 | 51 | 405,925 | 49.9 | 0.01 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 36 | 242,526 | 32.6 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 46 | 279,939 | 36.4 | 0.011 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 3 | 1 | success | n/a | 600 | 51 | 422,827 | 59.2 | 0.011 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 35 | 425,596 | 39.3 | 0.01 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 46 | 432,534 | 40.4 | 0.014 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 1 | 1 | wrong_answer | n/a | 600 | 30 | 319,572 | 50.7 | 0.009 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 40 | 260,269 | 43.7 | 0.01 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 40 | 245,537 | 31.9 | 0.011 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 2 | 1 | success | n/a | 600 | 44 | 497,140 | 63.4 | 0.013 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 43 | 284,725 | 52.9 | 0.012 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 46 | 455,365 | 46.8 | 0.016 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 3 | 1 | success | n/a | 600 | 40 | 503,486 | 60.7 | 0.012 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | 1 | wrong_answer | n/a | 600 | 39 | 216,055 | 35.4 | 0.01 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 40 | 340,237 | 33.4 | 0.012 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 1 | 1 | success | n/a | 600 | 52 | 430,477 | 48.7 | 0.012 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 36 | 214,657 | 32.8 | 0.009 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 50 | 303,126 | 38.7 | 0.013 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 2 | 1 | success | n/a | 600 | 32 | 344,565 | 52.5 | 0.009 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 41 | 221,429 | 38.4 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 66 | 771,173 | 61.5 | 0.022 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 3 | 1 | success | n/a | 600 | 44 | 349,136 | 52.4 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 40 | 221,964 | 43.4 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 48 | 511,603 | 49.9 | 0.017 | unknown | known |
