# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-07; runs per task and approach: 3; 3 runs in parallel.
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
| Tool calls (including retries) | 607 | 638 | 843 |
| MCP tool errors (including retries) | 19 | 20 | 5 |
| Browser observation text (observed chars) | 392,239 | 475,494 | 88,109 |
| Browser observation images (observed blocks) | 0 | 0 | 330 |
| Normal input tokens (total) | 730 | 492 | 670 |
| Cache-write input tokens (total) | 345,657 | 412,137 | 680,479 |
| Cache-read input tokens (total) | 5,395,347 | 4,529,629 | 6,976,248 |
| Output tokens (total) | 56,681 | 72,259 | 90,910 |
| Total input tokens incl. cache (legacy) | 5,741,734 | 4,942,258 | 7,657,397 |
| MCP startup (total, s) | 42.0 | 37.2 | 37.0 |
| CLI startup (total, s) | 116.4 | 119.7 | 160.8 |
| CLI execution (total, s) | 1158.9 | 863.5 | 962.3 |
| CLI wall (total, s) | 1275.3 | 983.2 | 1123.1 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 16.1 | 16.5 | 17.0 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | 0.15 | 0.16 | 0.25 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Shopping recommendation and visits

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| shopping-v2-material-colour | mantis | 3/3 | 3/3 | 3/3 | 65 |
| shopping-v2-material-colour | tree | 3/3 | 3/3 | 3/3 | 84 |
| shopping-v2-material-colour | screenshot | 3/3 | 3/3 | 3/3 | 113 |
| shopping-v2-tier-size | mantis | 3/3 | 3/3 | 3/3 | 107 |
| shopping-v2-tier-size | tree | 3/3 | 3/3 | 3/3 | 90 |
| shopping-v2-tier-size | screenshot | 3/3 | 3/3 | 3/3 | 122 |
| shopping-v2-closure-capacity | mantis | 3/3 | 3/3 | 3/3 | 95 |
| shopping-v2-closure-capacity | tree | 3/3 | 3/3 | 3/3 | 115 |
| shopping-v2-closure-capacity | screenshot | 3/3 | 3/3 | 3/3 | 134 |
| shopping-v2-finish-shape | mantis | 3/3 | 3/3 | 3/3 | 111 |
| shopping-v2-finish-shape | tree | 3/3 | 3/3 | 3/3 | 104 |
| shopping-v2-finish-shape | screenshot | 3/3 | 3/3 | 3/3 | 141 |
| shopping-v2-textile-pattern | mantis | 1/3 | 1/3 | 3/3 | 102 |
| shopping-v2-textile-pattern | tree | 1/3 | 1/3 | 3/3 | 116 |
| shopping-v2-textile-pattern | screenshot | 3/3 | 3/3 | 3/3 | 163 |
| shopping-v2-material-swatch | mantis | 2/3 | 2/3 | 3/3 | 127 |
| shopping-v2-material-swatch | tree | 2/3 | 2/3 | 3/3 | 129 |
| shopping-v2-material-swatch | screenshot | 3/3 | 3/3 | 3/3 | 170 |

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| All tasks | mantis | 15/18 | 15/18 | 18/18 | 607 |
| All tasks | tree | 15/18 | 15/18 | 18/18 | 638 |
| All tasks | screenshot | 18/18 | 18/18 | 18/18 | 843 |

## Per run

| Task | Approach | Run | Status | Answer-only | Workflow | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 23 | 1 | 17,108 | 0 | 44 | 19,295 | 283,661 | 1,890 | 2.1 | 3.8 | 45.5 | 49.3 | 0.00 | 0.36 | Alder item (ref ql92g5u, $60.00, Linen, Red) added to cart |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 23,658 | 0 | 20 | 26,469 | 152,743 | 2,717 | 2.1 | 3.8 | 29.3 | 33.1 | 0.00 | 0.37 | Alder item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 3,614 | 15 | 34 | 33,419 | 284,720 | 3,869 | 2.1 | 3.7 | 35.3 | 39.1 | 0.00 | 0.34 | Alder item |
| `shopping-v2-material-colour` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 21 | 1 | 12,734 | 0 | 28 | 12,992 | 169,243 | 2,332 | 2.0 | 2.5 | 36.6 | 39.1 | 0.00 | 0.42 | Added Ember item (Linen, Green, $60.00, ref qeu7h8f) to the cart. |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 23,671 | 0 | 20 | 19,409 | 160,004 | 2,706 | 2.0 | 2.6 | 31.0 | 33.5 | 0.00 | 0.40 | Ember item (Reference qeu7h8f, $60.00) added to cart |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 38 | 0 | 4,711 | 16 | 34 | 32,424 | 316,893 | 4,266 | 2.0 | 2.6 | 38.8 | 41.3 | 0.00 | 0.36 | Ember item |
| `shopping-v2-material-colour` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 21 | 1 | 12,657 | 0 | 30 | 12,897 | 178,257 | 2,222 | 2.0 | 2.8 | 35.5 | 38.3 | 0.00 | 0.39 | Ember item added to cart (Linen, Blue; reference q8fcib0; $60.00) |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 1 | 23,575 | 0 | 20 | 19,394 | 159,858 | 2,769 | 2.0 | 2.9 | 26.6 | 29.6 | 0.00 | 0.36 | Ember item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 38 | 0 | 3,636 | 15 | 32 | 31,385 | 280,703 | 3,930 | 2.0 | 2.7 | 36.2 | 38.8 | 0.00 | 0.40 | Ember item (Reference q8fcib0, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-tier-size` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 25 | 1 | 18,361 | 0 | 46 | 15,663 | 307,750 | 2,044 | 2.0 | 2.8 | 50.9 | 53.8 | 0.00 | 0.42 | Ember item (Reference q14fdn5j) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 32 | 2 | 24,832 | 0 | 20 | 20,735 | 174,113 | 3,099 | 2.0 | 2.3 | 29.6 | 31.9 | 0.00 | 0.39 | Ember item (Reference q14fdn5j, $60.00) added to cart |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 3,852 | 16 | 26 | 28,464 | 208,030 | 4,277 | 2.0 | 2.8 | 31.6 | 34.5 | 0.00 | 0.33 | Ember item (Reference q14fdn5j, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-tier-size` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 45 | 1 | 27,891 | 0 | 50 | 22,844 | 410,924 | 3,337 | 2.0 | 2.5 | 59.9 | 62.5 | 0.00 | 0.34 | Alder item (Reference q1au8m2y, $60.00) added to cart; cart now shows 1 item. |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 0 | 21,251 | 0 | 16 | 18,447 | 116,901 | 2,805 | 2.0 | 2.4 | 25.1 | 27.4 | 0.00 | 0.39 | Alder item (Reference q1au8m2y, $60.00) added to cart |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 41 | 0 | 3,868 | 16 | 36 | 33,190 | 318,075 | 4,195 | 2.0 | 2.5 | 36.8 | 39.3 | 0.00 | 0.38 | Alder item added to cart (Cart (1)); it is the only catalog item that is Artisan tier and Standard size, matching what the shopper browsed. |
| `shopping-v2-tier-size` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 37 | 0 | 25,825 | 0 | 30 | 20,201 | 223,068 | 2,050 | 2.0 | 2.5 | 38.6 | 41.1 | 0.00 | 0.37 | Flint item (Reference q1h93l0d, $60.00) added to cart |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 1 | 23,070 | 0 | 20 | 19,568 | 158,435 | 2,936 | 2.0 | 3.0 | 31.3 | 34.3 | 0.00 | 0.35 | Flint item (Reference q1h93l0d, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 41 | 0 | 3,876 | 16 | 34 | 33,198 | 312,343 | 4,086 | 2.0 | 2.5 | 35.7 | 38.2 | 0.00 | 0.36 | Flint item ($60.00, Reference q1h93l0d) added to cart (cart now shows 1) |
| `shopping-v2-closure-capacity` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 28,824 | 0 | 32 | 21,911 | 250,909 | 2,215 | 2.0 | 2.5 | 44.0 | 46.5 | 0.00 | 0.34 | Cairn item (Reference q5rxw4g, $60.00) added to cart |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 0 | 23,726 | 0 | 18 | 19,943 | 136,928 | 3,027 | 2.0 | 2.6 | 26.8 | 29.3 | 0.00 | 0.37 | Cairn item (Reference q5rxw4g, $60.00) added to cart, cart now shows 1 |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 45 | 0 | 4,316 | 18 | 38 | 36,989 | 385,211 | 4,810 | 2.0 | 2.8 | 40.8 | 43.6 | 0.00 | 0.36 | Cairn item (Reference q5rxw4g, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-closure-capacity` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 29 | 3 | 21,769 | 0 | 34 | 17,748 | 235,174 | 2,157 | 2.0 | 2.4 | 43.2 | 45.6 | 0.00 | 0.39 | Flint item |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 53 | 1 | 31,456 | 0 | 86 | 25,516 | 930,630 | 4,119 | 2.0 | 2.5 | 91.7 | 94.2 | 0.00 | 0.34 | Flint item added to cart (Closure: Zip, Capacity: 24 litres, $60.00) |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 45 | 0 | 4,150 | 17 | 38 | 35,213 | 357,103 | 4,472 | 2.0 | 2.4 | 41.9 | 44.3 | 0.00 | 0.34 | Flint item |
| `shopping-v2-closure-capacity` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 26 | 1 | 19,672 | 0 | 38 | 16,436 | 253,223 | 2,036 | 2.0 | 2.4 | 44.9 | 47.3 | 0.00 | 0.34 | Iris item (Reference qilntza) added to cart: Zip closure, 18 litres, matching the four viewed products. |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 32 | 1 | 24,033 | 0 | 22 | 20,107 | 190,556 | 3,053 | 2.0 | 2.4 | 31.7 | 34.2 | 0.00 | 0.39 | Iris item |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 0 | 4,294 | 18 | 40 | 36,750 | 390,061 | 4,606 | 2.0 | 2.3 | 39.1 | 41.5 | 0.00 | 0.34 | Iris item added to cart (Zip closure, 18 litres, $60.00); cart now shows (1). |
| `shopping-v2-finish-shape` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 35 | 0 | 20,495 | 0 | 44 | 19,221 | 345,909 | 3,936 | 2.0 | 2.5 | 61.2 | 63.7 | 0.00 | 0.38 | Birch item (Reference qoy9345, $60.00) added to cart |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 2 | 29,149 | 0 | 26 | 23,374 | 249,307 | 3,492 | 2.0 | 2.4 | 37.4 | 39.7 | 0.00 | 0.48 | Added Birch item (Reference qoy9345, $60.00) to the cart; cart now shows 1. |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 5,390 | 18 | 28 | 36,170 | 267,447 | 3,552 | 2.0 | 2.8 | 33.3 | 36.0 | 0.00 | 0.41 | Birch item added to cart (Brushed, Round, $60.00), matching the Brushed/Round pattern of the four browsed products. |
| `shopping-v2-finish-shape` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 40 | 0 | 22,318 | 0 | 36 | 20,181 | 263,896 | 3,673 | 2.0 | 2.8 | 43.4 | 46.1 | 0.00 | 0.44 | Ember item |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 1 | 27,410 | 0 | 20 | 22,105 | 168,789 | 3,152 | 2.0 | 2.6 | 27.2 | 29.8 | 0.00 | 0.38 | Ember item |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 48 | 0 | 5,646 | 18 | 28 | 36,829 | 270,703 | 3,961 | 2.0 | 2.4 | 44.1 | 46.5 | 0.01 | 3.09 | Ember item (Reference q5po6bw, $60.00) added to cart; the shopper's four viewed products are all Matte/Oval, and Ember is the only catalog item with that finish and shape. |
| `shopping-v2-finish-shape` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 0 | 21,221 | 0 | 40 | 19,641 | 299,617 | 3,821 | 2.0 | 2.9 | 98.4 | 101.3 | 0.00 | 1.90 | Ember item (Reference qc4j59b, $60.00) added to cart; the shopper's four viewed products were all Matte and Square, which matches Ember's specs. |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 1 | 27,395 | 0 | 20 | 22,310 | 168,756 | 3,292 | 2.0 | 2.4 | 61.7 | 64.2 | 0.00 | 2.58 | Ember item (Reference qc4j59b, $60.00) added to cart |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 47 | 0 | 4,363 | 18 | 34 | 36,741 | 314,799 | 4,641 | 2.2 | 36.5 | 67.3 | 103.7 | 0.01 | 1.56 | Ember item ($60.00) |
| `shopping-v2-textile-pattern` | Mantis | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 27 | 1 | 18,839 | 0 | 38 | 17,849 | 252,635 | 3,874 | 2.2 | 16.1 | 94.9 | 111.0 | 0.00 | 1.44 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 36 | 1 | 23,379 | 0 | 32 | 21,920 | 296,414 | 4,787 | 2.1 | 15.1 | 61.3 | 76.4 | 0.00 | 1.70 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 54 | 1 | 5,626 | 21 | 48 | 44,246 | 592,773 | 6,959 | 2.1 | 16.2 | 82.0 | 98.2 | 0.00 | 1.42 | Alder item (Reference qsa0va, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-textile-pattern` | Mantis | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 31 | 3 | 16,978 | 0 | 36 | 18,473 | 260,104 | 5,203 | 3.0 | 13.0 | 85.1 | 98.1 | 0.00 | 1.89 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 42 | 2 | 30,692 | 0 | 30 | 26,014 | 302,049 | 5,098 | 2.2 | 13.3 | 63.1 | 76.4 | 0.00 | 1.53 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 56 | 2 | 5,596 | 21 | 46 | 44,684 | 545,599 | 7,389 | 2.1 | 15.2 | 85.2 | 100.3 | 0.01 | 1.45 | Added Ember item (Reference q1tej3wz, $60.00) to the cart; it is the Canvas item matching the checkerboard pattern the shopper viewed on all four earlier products. |
| `shopping-v2-textile-pattern` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 2 | 27,426 | 0 | 58 | 23,234 | 490,220 | 4,359 | 2.1 | 14.0 | 104.1 | 118.1 | 0.00 | 1.43 | Haven item (Reference q1mzo4zk, $60.00, Canvas) added to cart |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 38 | 0 | 27,120 | 0 | 42 | 26,177 | 405,357 | 6,902 | 2.1 | 17.2 | 85.0 | 102.2 | 0.00 | 1.67 | Haven item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 53 | 0 | 6,139 | 19 | 42 | 40,154 | 436,557 | 5,400 | 2.1 | 15.5 | 72.2 | 87.8 | 0.01 | 1.53 | Haven item (Reference q1mzo4zk, $60.00) added to cart; cart now shows (1). |
| `shopping-v2-material-swatch` | Mantis | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 46 | 2 | 28,576 | 0 | 40 | 23,530 | 339,375 | 3,855 | 4.6 | 12.9 | 85.4 | 98.3 | 0.01 | 2.16 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 41 | 1 | 29,822 | 0 | 26 | 26,465 | 253,653 | 6,011 | 2.1 | 12.5 | 68.1 | 80.6 | 0.00 | 1.62 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 51 | 0 | 5,551 | 19 | 36 | 40,907 | 374,665 | 6,541 | 2.1 | 15.8 | 74.4 | 90.2 | 0.01 | 1.47 | Flint item |
| `shopping-v2-material-swatch` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 42 | 0 | 28,143 | 0 | 44 | 23,102 | 339,604 | 3,809 | 2.1 | 14.9 | 85.0 | 99.9 | 0.00 | 1.53 | Cairn item (Reference q1kjv6f2, $60.00) added to cart; cart now shows Cart (1). |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 3 | 30,808 | 0 | 28 | 26,959 | 274,571 | 6,002 | 2.1 | 16.8 | 69.6 | 86.4 | 0.00 | 1.67 | Cairn item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 52 | 0 | 6,326 | 20 | 36 | 42,287 | 387,415 | 6,137 | 2.1 | 16.0 | 71.5 | 87.5 | 0.00 | 1.44 | Cairn item |
| `shopping-v2-material-swatch` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 39 | 2 | 23,402 | 0 | 62 | 20,439 | 491,778 | 3,868 | 3.7 | 13.2 | 102.2 | 115.3 | 0.00 | 1.56 | Dune item |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 44 | 1 | 30,447 | 0 | 26 | 27,225 | 230,565 | 6,292 | 2.1 | 12.9 | 67.0 | 79.9 | 0.00 | 1.50 | Dune item (Reference q1qyq5ch, $60.00) added to cart; cart now shows 1. |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 67 | 2 | 7,155 | 29 | 60 | 57,429 | 933,151 | 7,819 | 2.1 | 16.1 | 96.2 | 112.2 | 0.00 | 1.43 | Dune item (Reference q1qyq5ch, $60.00) added to cart; the cart now shows (1). |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | 1 | success | n/a | 600 | 23 | 303,000 | 45.5 | 0.008 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 28 | 179,232 | 29.3 | 0.008 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 37 | 318,173 | 35.3 | 0.011 | unknown | known |
| `shopping-v2-material-colour` | Mantis | 2 | 1 | success | n/a | 600 | 21 | 182,263 | 36.6 | 0.005 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 28 | 179,433 | 31.0 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 38 | 349,351 | 38.8 | 0.012 | unknown | known |
| `shopping-v2-material-colour` | Mantis | 3 | 1 | success | n/a | 600 | 21 | 191,184 | 35.5 | 0.005 | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 28 | 179,272 | 26.6 | 0.007 | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 38 | 312,120 | 36.2 | 0.011 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 1 | 1 | success | n/a | 600 | 25 | 323,459 | 50.9 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 32 | 194,868 | 29.6 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 40 | 236,520 | 31.6 | 0.01 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 2 | 1 | success | n/a | 600 | 45 | 433,818 | 59.9 | 0.01 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 28 | 135,364 | 25.1 | 0.006 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 41 | 351,301 | 36.8 | 0.012 | unknown | known |
| `shopping-v2-tier-size` | Mantis | 3 | 1 | success | n/a | 600 | 37 | 243,299 | 38.6 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 30 | 178,023 | 31.3 | 0.007 | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 41 | 345,575 | 35.7 | 0.012 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 1 | 1 | success | n/a | 600 | 40 | 272,852 | 44.0 | 0.008 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 30 | 156,889 | 26.8 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 45 | 422,238 | 40.8 | 0.014 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 2 | 1 | success | n/a | 600 | 29 | 252,956 | 43.2 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 53 | 956,232 | 91.7 | 0.016 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 45 | 392,354 | 41.9 | 0.013 | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 3 | 1 | success | n/a | 600 | 26 | 269,697 | 44.9 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 32 | 210,685 | 31.7 | 0.007 | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 44 | 426,851 | 39.1 | 0.014 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 1 | 1 | success | n/a | 600 | 35 | 365,174 | 61.2 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 36 | 272,707 | 37.4 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 46 | 303,645 | 33.3 | 0.012 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 2 | 1 | success | n/a | 600 | 40 | 284,113 | 43.4 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 34 | 190,914 | 27.2 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 48 | 307,560 | 44.1 | 0.012 | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 3 | 1 | success | n/a | 600 | 36 | 319,298 | 98.4 | 0.009 | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 34 | 191,086 | 61.7 | 0.008 | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 47 | 351,574 | 67.3 | 0.013 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 1 | 1 | wrong_answer | n/a | 600 | 27 | 270,522 | 94.9 | 0.008 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 36 | 318,366 | 61.3 | 0.01 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 54 | 637,067 | 82.0 | 0.018 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 2 | 1 | wrong_answer | n/a | 600 | 31 | 278,613 | 85.1 | 0.009 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | 1 | wrong_answer | n/a | 600 | 42 | 328,093 | 63.1 | 0.011 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 56 | 590,329 | 85.2 | 0.018 | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 3 | 1 | success | n/a | 600 | 44 | 513,512 | 104.1 | 0.012 | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 38 | 431,576 | 85.0 | 0.013 | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 53 | 476,753 | 72.2 | 0.015 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 1 | 1 | wrong_answer | n/a | 600 | 46 | 362,945 | 85.4 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 41 | 280,144 | 68.1 | 0.011 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 51 | 415,608 | 74.4 | 0.015 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 2 | 1 | success | n/a | 600 | 42 | 362,750 | 85.0 | 0.01 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 44 | 301,558 | 69.6 | 0.011 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 52 | 429,738 | 71.5 | 0.015 | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 3 | 1 | success | n/a | 600 | 39 | 512,279 | 102.2 | 0.011 | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 44 | 257,816 | 67.0 | 0.011 | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 67 | 990,640 | 96.2 | 0.025 | unknown | known |
