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
| First-pass correct (attempt 1) | 15 / 18 | 15 / 18 | 18 / 18 |
| After reruns / merged correct | 15 / 18 | 15 / 18 | 18 / 18 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 15 / 18 | 15 / 18 | 18 / 18 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 3 | 3 | 0 |
| Tool calls (including retries) | 591 | 649 | 825 |
| MCP tool errors (including retries) | 8 | 19 | 1 |
| Browser observation text (observed chars) | 396,271 | 477,106 | 88,984 |
| Browser observation images (observed blocks) | 4 | 1 | 316 |
| Normal input tokens (total) | 694 | 484 | 640 |
| Cache-write input tokens (total) | 351,134 | 419,859 | 654,654 |
| Cache-read input tokens (total) | 5,182,140 | 4,353,439 | 6,210,273 |
| Output tokens (total) | 60,456 | 76,367 | 90,580 |
| Total input tokens incl. cache (legacy) | 5,533,968 | 4,773,782 | 6,865,567 |
| MCP startup (total, s) | 36.2 | 36.3 | 36.3 |
| CLI startup (total, s) | 22.7 | 22.9 | 22.5 |
| CLI execution (total, s) | 805.1 | 631.1 | 679.9 |
| CLI wall (total, s) | 827.8 | 654.0 | 702.5 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 2.5 | 2.7 | 2.4 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | 0.15 | 0.17 | 0.24 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Shopping recommendation and visits

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| shopping-v2-material-colour | mantis | 3/3 | 3/3 | 3/3 | 80 |
| shopping-v2-material-colour | tree | 3/3 | 3/3 | 3/3 | 94 |
| shopping-v2-material-colour | screenshot | 3/3 | 3/3 | 3/3 | 113 |
| shopping-v2-tier-size | mantis | 3/3 | 3/3 | 3/3 | 111 |
| shopping-v2-tier-size | tree | 3/3 | 3/3 | 3/3 | 101 |
| shopping-v2-tier-size | screenshot | 3/3 | 3/3 | 3/3 | 127 |
| shopping-v2-closure-capacity | mantis | 3/3 | 3/3 | 3/3 | 95 |
| shopping-v2-closure-capacity | tree | 3/3 | 3/3 | 3/3 | 109 |
| shopping-v2-closure-capacity | screenshot | 3/3 | 3/3 | 3/3 | 129 |
| shopping-v2-finish-shape | mantis | 3/3 | 3/3 | 3/3 | 112 |
| shopping-v2-finish-shape | tree | 3/3 | 3/3 | 3/3 | 105 |
| shopping-v2-finish-shape | screenshot | 3/3 | 3/3 | 3/3 | 141 |
| shopping-v2-textile-pattern | mantis | 0/3 | 0/3 | 3/3 | 92 |
| shopping-v2-textile-pattern | tree | 1/3 | 1/3 | 3/3 | 114 |
| shopping-v2-textile-pattern | screenshot | 3/3 | 3/3 | 3/3 | 150 |
| shopping-v2-material-swatch | mantis | 3/3 | 3/3 | 3/3 | 101 |
| shopping-v2-material-swatch | tree | 2/3 | 2/3 | 3/3 | 126 |
| shopping-v2-material-swatch | screenshot | 3/3 | 3/3 | 3/3 | 165 |

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| All tasks | mantis | 15/18 | 15/18 | 18/18 | 591 |
| All tasks | tree | 15/18 | 15/18 | 18/18 | 649 |
| All tasks | screenshot | 18/18 | 18/18 | 18/18 | 825 |

## Per run

| Task | Approach | Run | Status | Answer-only | Workflow | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 0 | 16,112 | 0 | 42 | 20,096 | 281,264 | 2,617 | 2.0 | 1.9 | 45.1 | 47.0 | 0.00 | 0.14 | Alder item (Reference ql92g5u, Linen, Red, $60.00) added to cart |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 23,605 | 0 | 20 | 26,526 | 153,038 | 2,776 | 2.0 | 1.9 | 25.8 | 27.6 | 0.00 | 0.15 | Alder item (Reference ql92g5u, $60.00) added to cart |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 39 | 0 | 3,835 | 16 | 30 | 35,232 | 259,834 | 4,122 | 2.0 | 1.8 | 34.2 | 36.0 | 0.00 | 0.15 | Alder item |
| `shopping-v2-material-colour` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 24 | 1 | 18,527 | 0 | 30 | 15,424 | 192,488 | 1,726 | 2.0 | 1.2 | 30.9 | 32.1 | 0.00 | 0.13 | Ember item added to cart (Linen, Green; matches the Linen/Green pattern of all four browsed items) |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 35 | 3 | 28,480 | 0 | 26 | 22,965 | 242,870 | 3,801 | 2.0 | 1.2 | 32.1 | 33.3 | 0.00 | 0.14 | Ember item (qeu7h8f, $60.00) added to cart |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 4,627 | 15 | 32 | 31,996 | 284,651 | 4,165 | 2.0 | 1.2 | 32.9 | 34.1 | 0.00 | 0.13 | Ember item (added to cart; the cart now shows 1) |
| `shopping-v2-material-colour` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 26 | 1 | 18,884 | 0 | 46 | 15,684 | 312,442 | 1,946 | 2.0 | 1.2 | 42.0 | 43.1 | 0.00 | 0.16 | Ember item (Reference q8fcib0) added to cart; cart now shows 1. |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 31 | 1 | 24,885 | 0 | 22 | 20,658 | 186,033 | 3,190 | 2.0 | 1.2 | 28.4 | 29.6 | 0.00 | 0.14 | Added Ember item (Reference q8fcib0, $60.00) to the cart. |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 4,592 | 15 | 34 | 31,347 | 287,420 | 3,463 | 2.0 | 1.2 | 33.3 | 34.4 | 0.00 | 0.13 | Ember item added to cart (Linen, Blue; matches the shopper's browsing history) |
| `shopping-v2-tier-size` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 23,984 | 0 | 32 | 19,508 | 232,427 | 2,279 | 2.0 | 1.2 | 33.1 | 34.2 | 0.00 | 0.13 | Ember item (Reference q14fdn5j, $60.00, Everyday / Compact) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 27,075 | 0 | 32 | 23,415 | 274,504 | 4,124 | 2.0 | 1.2 | 38.2 | 39.4 | 0.00 | 0.13 | Ember item (Reference q14fdn5j, $60.00) added to cart |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 5,113 | 17 | 38 | 34,990 | 351,549 | 3,782 | 2.0 | 1.2 | 34.2 | 35.4 | 0.00 | 0.12 | Ember item (Reference q14fdn5j, $60.00) added to cart |
| `shopping-v2-tier-size` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 25,820 | 0 | 30 | 20,369 | 224,248 | 2,240 | 2.0 | 1.2 | 34.0 | 35.2 | 0.00 | 0.13 | Alder item (Reference q1au8m2y, $60.00) added to cart; cart now shows Cart (1). |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 1 | 23,056 | 0 | 20 | 19,846 | 158,655 | 3,210 | 2.0 | 1.3 | 26.4 | 27.6 | 0.00 | 0.12 | Alder item added to cart (Reference q1au8m2y, $60.00) |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 3,852 | 16 | 36 | 33,129 | 318,290 | 4,109 | 2.0 | 1.3 | 32.5 | 33.8 | 0.00 | 0.14 | Alder item added to cart (Reference q1au8m2y, $60.00); the cart now shows (1). |
| `shopping-v2-tier-size` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 25,825 | 0 | 30 | 20,262 | 223,241 | 2,118 | 2.0 | 1.3 | 31.9 | 33.2 | 0.00 | 0.14 | Flint item (Reference q1h93l0d, $60.00) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 31 | 1 | 22,014 | 0 | 38 | 19,353 | 333,287 | 2,982 | 2.0 | 1.2 | 36.8 | 38.0 | 0.00 | 0.15 | Flint item added to cart (Cart: 1) |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 0 | 5,400 | 17 | 38 | 36,749 | 372,212 | 5,404 | 2.0 | 1.2 | 40.4 | 41.6 | 0.00 | 0.14 | Added Flint item (Reference q1h93l0d, $60.00) to the cart; the cart now shows (1). |
| `shopping-v2-closure-capacity` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 27,339 | 0 | 32 | 21,495 | 250,295 | 2,514 | 2.0 | 1.2 | 38.3 | 39.5 | 0.00 | 0.14 | Cairn item (Reference q5rxw4g, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 32 | 1 | 24,066 | 0 | 24 | 20,307 | 212,605 | 3,146 | 2.0 | 1.3 | 28.2 | 29.5 | 0.00 | 0.14 | Cairn item added to cart (Buckle closure, 24 litres; cart now shows 1) |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 4,102 | 17 | 36 | 35,393 | 350,180 | 4,724 | 2.0 | 1.3 | 35.7 | 37.0 | 0.00 | 0.14 | Cairn item (Reference q5rxw4g, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-closure-capacity` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 21,096 | 0 | 34 | 17,775 | 234,827 | 2,477 | 2.0 | 1.4 | 38.7 | 40.1 | 0.00 | 0.15 | Flint item (Reference qp0iswp, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 45 | 2 | 27,363 | 0 | 66 | 23,850 | 668,928 | 4,587 | 2.0 | 1.3 | 60.5 | 61.8 | 0.00 | 0.16 | Flint item |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 4,097 | 17 | 36 | 35,214 | 348,300 | 4,601 | 2.0 | 1.3 | 35.0 | 36.2 | 0.00 | 0.14 | Flint item ($60.00, Zip closure, 24 litres) added to cart; cart now shows (1). |
| `shopping-v2-closure-capacity` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 27 | 0 | 17,252 | 0 | 34 | 16,230 | 233,507 | 2,929 | 2.0 | 1.2 | 37.5 | 38.7 | 0.00 | 0.14 | Added Iris item (Reference qilntza, $60.00) to the cart, Closure Zip, Capacity 18 litres. |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 32 | 1 | 25,452 | 0 | 20 | 21,084 | 163,951 | 3,262 | 2.0 | 1.2 | 28.5 | 29.7 | 0.00 | 0.13 | Iris item (Reference qilntza, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 4,097 | 17 | 38 | 35,171 | 356,013 | 4,657 | 2.0 | 1.2 | 40.4 | 41.6 | 0.00 | 0.13 | Added Iris item ($60.00, Zip closure, 18 litres) to the cart; the cart now shows (1). |
| `shopping-v2-finish-shape` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 49 | 0 | 29,998 | 0 | 46 | 25,123 | 414,287 | 4,468 | 2.0 | 1.1 | 55.6 | 56.8 | 0.00 | 0.16 | Birch item (Reference qoy9345, $60.00) added to cart |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 1 | 27,404 | 0 | 20 | 22,080 | 168,405 | 3,122 | 2.0 | 1.2 | 27.2 | 28.4 | 0.00 | 0.14 | Birch item (Reference qoy9345, $60.00) added to cart; cart now shows 1 item. |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 4,343 | 18 | 40 | 36,999 | 395,309 | 4,769 | 2.0 | 1.1 | 37.8 | 39.0 | 0.00 | 0.14 | Birch item added to cart (Cart (1)): Brushed Round, matching the four items the shopper browsed. |
| `shopping-v2-finish-shape` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 1 | 21,980 | 0 | 46 | 18,294 | 325,002 | 2,494 | 2.0 | 1.1 | 48.4 | 49.6 | 0.00 | 0.12 | Ember item (reference q5po6bw, $60.00, Matte, Oval) added to cart |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 1 | 25,938 | 0 | 24 | 21,662 | 219,473 | 3,340 | 2.0 | 1.2 | 28.4 | 29.6 | 0.00 | 0.27 | Ember item |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 48 | 0 | 4,383 | 18 | 34 | 37,330 | 313,652 | 5,080 | 2.0 | 1.2 | 38.0 | 39.2 | 0.00 | 0.14 | Ember item (Matte, Oval) added to cart at $60.00; cart now shows (1). |
| `shopping-v2-finish-shape` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 33 | 3 | 18,873 | 0 | 44 | 17,668 | 310,878 | 3,387 | 2.0 | 1.3 | 44.4 | 45.7 | 0.00 | 0.15 | Added Ember item (Reference qc4j59b, $60.00) to the cart; Matte finish and Square shape match all four browsed products. |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 1 | 28,649 | 0 | 28 | 23,650 | 259,543 | 3,840 | 2.0 | 1.1 | 32.7 | 33.9 | 0.00 | 0.17 | Ember item (Reference qc4j59b, $60.00) added to cart |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 47 | 0 | 5,518 | 18 | 40 | 37,188 | 394,896 | 4,268 | 2.0 | 1.2 | 36.9 | 38.1 | 0.00 | 0.14 | Ember item (Reference qc4j59b, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-textile-pattern` | Mantis | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 38 | 0 | 25,600 | 0 | 32 | 22,202 | 247,929 | 4,329 | 2.0 | 1.3 | 46.8 | 48.1 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 39 | 0 | 26,430 | 0 | 28 | 23,619 | 241,347 | 4,787 | 2.0 | 1.3 | 36.4 | 37.7 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 55 | 0 | 6,497 | 20 | 30 | 42,343 | 335,064 | 5,999 | 2.0 | 1.3 | 41.1 | 42.4 | 0.00 | 0.14 | Alder item (Reference qsa0va, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-textile-pattern` | Mantis | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 30 | 0 | 20,422 | 0 | 50 | 20,223 | 386,698 | 5,523 | 2.0 | 1.2 | 62.4 | 63.6 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 39 | 1 | 27,244 | 0 | 22 | 24,774 | 192,327 | 5,668 | 2.0 | 1.6 | 38.2 | 39.9 | 0.00 | 0.18 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 43 | 0 | 5,242 | 16 | 24 | 34,162 | 210,626 | 4,509 | 2.0 | 1.2 | 30.3 | 31.5 | 0.00 | 0.14 | Added Ember item (Reference q1tej3wz, $60.00) to the cart, since it is the only catalog item that is Canvas with the checkerboard pattern the shopper viewed. |
| `shopping-v2-textile-pattern` | Mantis | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 24 | 0 | 15,623 | 0 | 34 | 16,643 | 222,210 | 4,394 | 2.0 | 1.3 | 48.4 | 49.7 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 0 | 26,367 | 1 | 24 | 27,072 | 222,853 | 6,852 | 2.0 | 1.2 | 48.3 | 49.5 | 0.00 | 0.14 | Haven item (Reference q1mzo4zk, $60.00) added to cart; the cart now shows 1 item. |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 52 | 0 | 4,946 | 18 | 34 | 38,457 | 334,374 | 5,916 | 2.0 | 1.2 | 40.6 | 41.8 | 0.00 | 0.13 | Haven item (Reference q1mzo4zk, $60.00) added to cart — the shopper's four browsed products are all Canvas with the dot pattern, and Haven's stockroom preview matches that; the cart now shows (1). |
| `shopping-v2-material-swatch` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 38 | 0 | 25,089 | 4 | 54 | 23,601 | 495,103 | 5,899 | 2.0 | 1.2 | 64.1 | 65.3 | 0.00 | 0.14 | Flint item (Reference q1e507hn, $60.00) recommended and added to cart; cart now shows Cart (1). |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 40 | 0 | 27,594 | 0 | 22 | 24,835 | 195,238 | 5,483 | 2.0 | 1.2 | 36.6 | 37.8 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 49 | 1 | 6,194 | 18 | 38 | 35,141 | 373,126 | 6,677 | 2.0 | 1.2 | 42.8 | 44.0 | 0.00 | 0.14 | Flint item |
| `shopping-v2-material-swatch` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 33 | 1 | 19,631 | 0 | 44 | 20,105 | 344,952 | 5,668 | 2.0 | 1.2 | 57.3 | 58.5 | 0.00 | 0.13 | Cairn item added to cart (Reference q1kjv6f2, $60.00) |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 45 | 3 | 32,564 | 0 | 26 | 28,400 | 264,243 | 6,510 | 2.0 | 1.2 | 42.2 | 43.4 | 0.00 | 0.14 | Cairn item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 52 | 0 | 6,439 | 20 | 32 | 35,588 | 311,443 | 6,606 | 2.0 | 1.2 | 39.9 | 41.2 | 0.00 | 0.13 | Cairn item (Reference q1kjv6f2, $60.00) added to cart; cart now shows (1) |
| `shopping-v2-material-swatch` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 0 | 24,216 | 0 | 34 | 20,432 | 250,342 | 3,448 | 2.0 | 1.2 | 46.1 | 47.3 | 0.00 | 0.12 | Dune item (Reference q1qyq5ch, $60.00, Steel) added to cart |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 41 | 1 | 28,920 | 0 | 22 | 25,763 | 196,139 | 5,687 | 2.0 | 1.2 | 36.2 | 37.4 | 0.00 | 0.16 | Dune item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 64 | 0 | 5,707 | 23 | 50 | 48,225 | 613,334 | 7,729 | 2.0 | 1.2 | 54.1 | 55.3 | 0.00 | 0.13 | Dune item (Reference q1qyq5ch, $60.00) added to cart; cart now shows (1). |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | 1 | success | n/a | 600 | 30 | 301,402 | 45.1 | 0.008 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 28 | 179,584 | 25.8 | 0.008 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 39 | 295,096 | 34.2 | 0.012 | unknown | known |
| `shopping-v2-material-colour` | Mantis | 2 | 1 | success | n/a | 600 | 24 | 207,942 | 30.9 | 0.006 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 35 | 265,861 | 32.1 | 0.009 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 37 | 316,679 | 32.9 | 0.011 | unknown | known |
| `shopping-v2-material-colour` | Mantis | 3 | 1 | success | n/a | 600 | 26 | 328,172 | 42.0 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 31 | 206,713 | 28.4 | 0.008 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 37 | 318,801 | 33.3 | 0.011 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 1 | 1 | success | n/a | 600 | 37 | 251,967 | 33.1 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 40 | 297,951 | 38.2 | 0.009 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 43 | 386,577 | 34.2 | 0.012 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 2 | 1 | success | n/a | 600 | 37 | 244,647 | 34.0 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 30 | 178,521 | 26.4 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 40 | 351,455 | 32.5 | 0.012 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 3 | 1 | success | n/a | 600 | 37 | 243,533 | 31.9 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 31 | 352,678 | 36.8 | 0.009 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 44 | 408,999 | 40.4 | 0.014 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 1 | 1 | success | n/a | 600 | 40 | 271,822 | 38.3 | 0.008 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 32 | 232,936 | 28.2 | 0.008 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 43 | 385,609 | 35.7 | 0.013 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 2 | 1 | success | n/a | 600 | 28 | 252,636 | 38.7 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 45 | 692,844 | 60.5 | 0.014 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 43 | 383,550 | 35.0 | 0.013 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 3 | 1 | success | n/a | 600 | 27 | 249,771 | 37.5 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 32 | 185,055 | 28.5 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 43 | 391,222 | 40.4 | 0.013 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 1 | 1 | success | n/a | 600 | 49 | 439,456 | 55.6 | 0.011 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 34 | 190,505 | 27.2 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 46 | 432,348 | 37.8 | 0.014 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 2 | 1 | success | n/a | 600 | 30 | 343,342 | 48.4 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 34 | 241,159 | 28.4 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 48 | 351,016 | 38.0 | 0.013 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 3 | 1 | success | n/a | 600 | 33 | 328,590 | 44.4 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 37 | 283,221 | 32.7 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 47 | 432,124 | 36.9 | 0.014 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 1 | 1 | wrong_answer | n/a | 600 | 38 | 270,163 | 46.8 | 0.009 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 39 | 264,994 | 36.4 | 0.01 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 55 | 377,437 | 41.1 | 0.015 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 2 | 1 | wrong_answer | n/a | 600 | 30 | 406,971 | 62.4 | 0.011 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | 1 | wrong_answer | n/a | 600 | 39 | 217,123 | 38.2 | 0.01 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 43 | 244,812 | 30.3 | 0.011 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 3 | 1 | wrong_answer | n/a | 600 | 24 | 238,887 | 48.4 | 0.008 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 36 | 249,949 | 48.3 | 0.011 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 52 | 372,865 | 40.6 | 0.014 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 1 | 1 | success | n/a | 600 | 38 | 518,758 | 64.1 | 0.013 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 40 | 220,095 | 36.6 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 49 | 408,305 | 42.8 | 0.014 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 2 | 1 | success | n/a | 600 | 33 | 365,101 | 57.3 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 45 | 292,669 | 42.2 | 0.012 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 52 | 347,063 | 39.9 | 0.014 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 3 | 1 | success | n/a | 600 | 30 | 270,808 | 46.1 | 0.008 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 41 | 221,924 | 36.2 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 64 | 661,609 | 54.1 | 0.02 | unknown | known |
