# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-08; runs per task and approach: 3; 3 runs in parallel.
- Scope: 6 tasks × 3 approaches × 3 runs = 54 logical runs; 54 recorded so far; 54 total attempts including retries.
- Codex runtime: codex-cli 0.167.0-alpha.3.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| First-pass correct (attempt 1) | 12 / 18 | 8 / 18 | 4 / 18 |
| After reruns / merged correct | 12 / 18 | 8 / 18 | 4 / 18 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 12 / 18 | 8 / 18 | 4 / 18 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 6 | 10 | 14 |
| Tool calls (including retries) | 433 | 693 | 807 |
| MCP tool errors (including retries) | 0 | 21 | 1 |
| Browser observation text (observed chars) | 330,565 | 570,977 | 17,178 |
| Browser observation images (observed blocks) | 12 | 0 | 327 |
| Normal input tokens (total) | 598,889 | 695,646 | 718,434 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 7,302,400 | 10,039,552 | 10,747,392 |
| Output tokens (total) | 21,596 | 29,892 | 53,952 |
| Total input tokens incl. cache (legacy) | 7,901,289 | 10,735,198 | 11,465,826 |
| MCP startup (total, s) | 36.3 | 36.3 | 36.3 |
| CLI startup (total, s) | 6.6 | 7.0 | 6.6 |
| CLI execution (total, s) | 1172.9 | 1352.0 | 2088.3 |
| CLI wall (total, s) | 1179.6 | 1359.1 | 2094.8 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 2.8 | 2.8 | 2.9 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Shopping recommendation and visits

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| shopping-v2-material-colour | mantis | 3/3 | 3/3 | 3/3 | 62 |
| shopping-v2-material-colour | tree | 0/3 | 0/3 | 3/3 | 120 |
| shopping-v2-material-colour | screenshot | 1/3 | 1/3 | 2/3 | 105 |
| shopping-v2-tier-size | mantis | 2/3 | 2/3 | 2/3 | 63 |
| shopping-v2-tier-size | tree | 3/3 | 3/3 | 3/3 | 103 |
| shopping-v2-tier-size | screenshot | 0/3 | 0/3 | 2/3 | 105 |
| shopping-v2-closure-capacity | mantis | 2/3 | 2/3 | 2/3 | 66 |
| shopping-v2-closure-capacity | tree | 2/3 | 2/3 | 3/3 | 109 |
| shopping-v2-closure-capacity | screenshot | 1/3 | 1/3 | 3/3 | 143 |
| shopping-v2-finish-shape | mantis | 1/3 | 1/3 | 1/3 | 77 |
| shopping-v2-finish-shape | tree | 2/3 | 2/3 | 3/3 | 121 |
| shopping-v2-finish-shape | screenshot | 0/3 | 0/3 | 3/3 | 180 |
| shopping-v2-textile-pattern | mantis | 2/3 | 2/3 | 3/3 | 91 |
| shopping-v2-textile-pattern | tree | 1/3 | 1/3 | 3/3 | 110 |
| shopping-v2-textile-pattern | screenshot | 2/3 | 2/3 | 3/3 | 133 |
| shopping-v2-material-swatch | mantis | 2/3 | 2/3 | 3/3 | 74 |
| shopping-v2-material-swatch | tree | 0/3 | 0/3 | 3/3 | 130 |
| shopping-v2-material-swatch | screenshot | 0/3 | 0/3 | 3/3 | 141 |

| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |
|---|---|---:|---:|---:|---:|
| All tasks | mantis | 12/18 | 12/18 | 14/18 | 433 |
| All tasks | tree | 8/18 | 8/18 | 18/18 | 693 |
| All tasks | screenshot | 4/18 | 4/18 | 16/18 | 807 |

## Per run

| Task | Approach | Run | Status | Answer-only | Workflow | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 20 | 0 | 16,016 | 0 | 44,588 | 0 | 330,880 | 884 | 2.0 | 1.9 | 47.4 | 49.3 | 0.00 | 0.15 | Alder item |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 28 | 0 | 24,168 | 0 | 39,265 | 0 | 235,904 | 1,138 | 2.0 | 2.3 | 41.6 | 43.9 | 0.00 | 0.16 | cart must contain exactly the preferred item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 42 | 0 | 707 | 18 | 30,621 | 0 | 415,872 | 2,823 | 2.0 | 1.6 | 86.8 | 88.4 | 0.00 | 0.16 | Alder item |
| `shopping-v2-material-colour` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 22 | 0 | 17,331 | 0 | 25,423 | 0 | 391,296 | 971 | 2.0 | 0.3 | 50.0 | 50.3 | 0.00 | 0.16 | Ember item |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 52 | 11 | 38,376 | 0 | 64,988 | 0 | 290,432 | 1,258 | 2.0 | 0.3 | 53.0 | 53.3 | 0.00 | 0.19 | cart must contain exactly the preferred item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 26 | 0 | 486 | 10 | 60,052 | 0 | 362,240 | 2,055 | 2.0 | 0.3 | 79.9 | 80.2 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-material-colour` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 20 | 0 | 15,548 | 0 | 24,515 | 0 | 349,312 | 850 | 2.0 | 0.3 | 45.9 | 46.1 | 0.00 | 0.14 | Ember item |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 40 | 2 | 33,503 | 0 | 20,150 | 0 | 363,520 | 1,466 | 2.0 | 0.3 | 55.6 | 55.9 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 37 | 0 | 658 | 15 | 45,281 | 0 | 612,352 | 3,771 | 2.0 | 0.3 | 128.6 | 128.9 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-tier-size` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 24 | 0 | 19,199 | 0 | 15,844 | 0 | 271,744 | 1,014 | 2.0 | 0.3 | 43.3 | 43.5 | 0.00 | 0.15 | Ember item |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 45 | 1 | 37,211 | 0 | 32,768 | 0 | 629,504 | 1,952 | 2.0 | 0.3 | 79.8 | 80.0 | 0.00 | 0.15 | Ember item |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 23 | 0 | 414 | 10 | 34,547 | 0 | 219,520 | 1,442 | 2.0 | 0.3 | 75.2 | 75.5 | 0.00 | 0.16 | cart must contain exactly the preferred item |
| `shopping-v2-tier-size` | Mantis | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 17 | 0 | 11,096 | 0 | 40,525 | 0 | 267,136 | 1,081 | 2.0 | 0.3 | 42.8 | 43.1 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 0 | 21,722 | 0 | 27,786 | 0 | 294,144 | 1,030 | 2.0 | 0.3 | 49.0 | 49.3 | 0.00 | 0.16 | Alder item |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 38 | 0 | 653 | 15 | 23,614 | 0 | 282,240 | 2,140 | 2.0 | 0.3 | 70.2 | 70.5 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-tier-size` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 22 | 0 | 15,788 | 0 | 40,775 | 0 | 352,640 | 1,035 | 2.0 | 0.3 | 50.7 | 50.9 | 0.00 | 0.17 | Flint item |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 1 | 23,109 | 0 | 16,030 | 0 | 139,520 | 955 | 2.0 | 0.3 | 33.7 | 34.0 | 0.00 | 0.17 | Flint item |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 44 | 0 | 738 | 18 | 44,141 | 0 | 384,512 | 2,525 | 2.0 | 0.3 | 82.1 | 82.3 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-closure-capacity` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 24 | 0 | 19,672 | 0 | 26,862 | 0 | 438,784 | 1,142 | 2.0 | 0.3 | 56.6 | 56.8 | 0.00 | 0.15 | Cairn item |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 0 | 24,297 | 0 | 23,628 | 0 | 269,184 | 1,071 | 2.0 | 0.3 | 47.4 | 47.7 | 0.00 | 0.16 | Cairn item (Reference q5rxw4g) added to cart. |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 47 | 1 | 1,433 | 19 | 34,161 | 0 | 572,288 | 3,598 | 2.0 | 0.3 | 104.5 | 104.7 | 0.00 | 0.17 | Cairn item |
| `shopping-v2-closure-capacity` | Mantis | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 16 | 0 | 12,303 | 0 | 21,910 | 0 | 238,464 | 697 | 2.0 | 0.3 | 52.6 | 52.9 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 49 | 1 | 41,948 | 0 | 43,788 | 0 | 1,014,016 | 1,944 | 2.0 | 0.3 | 102.0 | 102.3 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 48 | 0 | 775 | 20 | 49,191 | 0 | 919,808 | 3,511 | 2.0 | 0.3 | 130.4 | 130.7 | 0.00 | 0.20 | cart must contain exactly the preferred item |
| `shopping-v2-closure-capacity` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 26 | 0 | 21,577 | 0 | 35,700 | 0 | 476,288 | 1,196 | 2.0 | 0.3 | 58.4 | 58.7 | 0.00 | 0.20 | Iris item |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 0 | 24,424 | 0 | 37,578 | 0 | 255,872 | 1,181 | 2.0 | 0.3 | 47.3 | 47.6 | 0.00 | 0.14 | Iris item |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 48 | 0 | 794 | 21 | 66,639 | 0 | 930,560 | 3,510 | 2.0 | 0.3 | 127.3 | 127.6 | 0.00 | 0.20 | cart must contain exactly the preferred item |
| `shopping-v2-finish-shape` | Mantis | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 23 | 0 | 18,220 | 0 | 26,627 | 0 | 434,176 | 1,138 | 2.0 | 0.3 | 59.7 | 60.0 | 0.00 | 0.17 | cart must contain exactly the preferred item |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 36 | 0 | 29,573 | 0 | 41,277 | 0 | 419,072 | 1,528 | 2.0 | 0.3 | 65.6 | 65.8 | 0.00 | 0.14 | Birch item |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 55 | 0 | 2,119 | 23 | 34,466 | 0 | 1,093,376 | 4,065 | 2.0 | 0.3 | 155.6 | 155.9 | 0.00 | 0.16 | cart must contain exactly the preferred item |
| `shopping-v2-finish-shape` | Mantis | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 24 | 0 | 19,728 | 0 | 40,360 | 0 | 424,064 | 1,056 | 2.0 | 0.3 | 54.1 | 54.4 | 0.00 | 0.20 | cart must contain exactly the preferred item |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 32 | 0 | 26,162 | 0 | 35,604 | 0 | 574,976 | 1,842 | 2.0 | 0.3 | 76.9 | 77.2 | 0.00 | 0.22 | Ember item |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 43 | 0 | 730 | 17 | 34,029 | 0 | 543,360 | 2,900 | 2.0 | 0.3 | 95.8 | 96.1 | 0.00 | 0.23 | cart must contain exactly the preferred item |
| `shopping-v2-finish-shape` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 30 | 0 | 24,167 | 0 | 57,358 | 0 | 457,984 | 1,253 | 2.0 | 0.3 | 64.1 | 64.4 | 0.00 | 0.14 | Ember item |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 53 | 1 | 47,418 | 0 | 46,744 | 0 | 1,181,184 | 2,504 | 2.0 | 0.3 | 109.9 | 110.2 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 82 | 0 | 1,342 | 32 | 35,162 | 0 | 521,088 | 2,622 | 2.0 | 0.3 | 151.3 | 151.7 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 34 | 0 | 23,967 | 5 | 23,998 | 0 | 675,072 | 2,038 | 2.0 | 0.3 | 99.4 | 99.7 | 0.00 | 0.15 | Alder item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 0 | 22,279 | 0 | 18,813 | 0 | 155,136 | 1,176 | 2.0 | 0.3 | 38.4 | 38.6 | 0.00 | 0.13 | Alder item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 46 | 0 | 1,702 | 16 | 38,644 | 0 | 470,272 | 3,107 | 2.0 | 0.3 | 104.7 | 105.0 | 0.00 | 0.15 | Alder item |
| `shopping-v2-textile-pattern` | Mantis | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 29 | 0 | 17,524 | 4 | 50,219 | 0 | 516,096 | 2,052 | 2.0 | 0.3 | 86.7 | 87.0 | 0.00 | 0.16 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 54 | 0 | 46,471 | 0 | 75,878 | 0 | 1,154,048 | 2,535 | 2.0 | 0.3 | 113.7 | 114.0 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 47 | 0 | 874 | 20 | 31,261 | 0 | 617,600 | 3,874 | 2.0 | 0.3 | 125.7 | 126.0 | 0.00 | 0.14 | Ember item |
| `shopping-v2-textile-pattern` | Mantis | 3 | success | n/a | n/a | success | success | 1 | n/a | 600 | 28 | 0 | 19,746 | 3 | 31,164 | 0 | 395,520 | 1,778 | 2.0 | 0.3 | 67.5 | 67.8 | 0.00 | 0.13 | Haven item |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 28 | 0 | 22,056 | 0 | 39,924 | 0 | 459,520 | 1,448 | 2.0 | 0.3 | 114.4 | 114.6 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 40 | 0 | 1,083 | 17 | 54,365 | 0 | 673,280 | 2,842 | 2.0 | 0.3 | 105.7 | 106.0 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Mantis | 1 | success | n/a | n/a | success | success | 1 | n/a | 600 | 24 | 0 | 17,351 | 0 | 32,912 | 0 | 427,648 | 1,583 | 2.0 | 0.3 | 146.1 | 146.4 | 0.00 | 0.12 | Flint item |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 49 | 1 | 42,150 | 0 | 49,388 | 0 | 1,019,520 | 2,625 | 2.0 | 0.3 | 107.7 | 108.0 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 50 | 0 | 810 | 20 | 44,518 | 0 | 991,360 | 3,764 | 2.0 | 0.3 | 172.3 | 172.5 | 0.00 | 0.13 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Mantis | 2 | success | n/a | n/a | success | success | 1 | n/a | 600 | 24 | 0 | 19,940 | 0 | 26,044 | 0 | 437,760 | 888 | 2.0 | 0.3 | 52.7 | 52.9 | 0.00 | 0.14 | Cairn item |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 51 | 3 | 42,270 | 0 | 45,960 | 0 | 1,068,928 | 2,537 | 2.0 | 0.3 | 120.1 | 120.4 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 45 | 0 | 1,096 | 18 | 25,414 | 0 | 301,312 | 1,970 | 2.0 | 0.3 | 98.7 | 99.0 | 0.00 | 0.14 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Mantis | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 26 | 0 | 21,392 | 0 | 34,065 | 0 | 417,536 | 940 | 2.0 | 0.3 | 95.1 | 95.4 | 0.00 | 0.13 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 30 | 0 | 23,840 | 0 | 36,077 | 0 | 515,072 | 1,702 | 2.0 | 0.3 | 96.1 | 96.3 | 0.00 | 0.15 | cart must contain exactly the preferred item |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | wrong_answer | n/a | n/a | wrong_answer | wrong_answer | 1 | n/a | 600 | 46 | 0 | 764 | 18 | 32,328 | 0 | 836,352 | 3,433 | 2.0 | 0.3 | 193.5 | 193.8 | 0.00 | 0.19 | cart must contain exactly the preferred item |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `shopping-v2-material-colour` | Mantis | 1 | 1 | success | n/a | 600 | 20 | 375,468 | 47.4 | unknown | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 28 | 275,169 | 41.6 | unknown | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 42 | 446,493 | 86.8 | unknown | unknown | known |
| `shopping-v2-material-colour` | Mantis | 2 | 1 | success | n/a | 600 | 22 | 416,719 | 50.0 | unknown | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 2 | 1 | wrong_answer | n/a | 600 | 52 | 355,420 | 53.0 | unknown | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 2 | 1 | wrong_answer | n/a | 600 | 26 | 422,292 | 79.9 | unknown | unknown | known |
| `shopping-v2-material-colour` | Mantis | 3 | 1 | success | n/a | 600 | 20 | 373,827 | 45.9 | unknown | unknown | known |
| `shopping-v2-material-colour` | Accessibility tree (Playwright MCP) | 3 | 1 | wrong_answer | n/a | 600 | 40 | 383,670 | 55.6 | unknown | unknown | known |
| `shopping-v2-material-colour` | Screenshots (click by x,y) | 3 | 1 | wrong_answer | n/a | 600 | 37 | 657,633 | 128.6 | unknown | unknown | known |
| `shopping-v2-tier-size` | Mantis | 1 | 1 | success | n/a | 600 | 24 | 287,588 | 43.3 | unknown | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 45 | 662,272 | 79.8 | unknown | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 1 | 1 | wrong_answer | n/a | 600 | 23 | 254,067 | 75.2 | unknown | unknown | known |
| `shopping-v2-tier-size` | Mantis | 2 | 1 | wrong_answer | n/a | 600 | 17 | 307,661 | 42.8 | unknown | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 28 | 321,930 | 49.0 | unknown | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 2 | 1 | wrong_answer | n/a | 600 | 38 | 305,854 | 70.2 | unknown | unknown | known |
| `shopping-v2-tier-size` | Mantis | 3 | 1 | success | n/a | 600 | 22 | 393,415 | 50.7 | unknown | unknown | known |
| `shopping-v2-tier-size` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 30 | 155,550 | 33.7 | unknown | unknown | known |
| `shopping-v2-tier-size` | Screenshots (click by x,y) | 3 | 1 | wrong_answer | n/a | 600 | 44 | 428,653 | 82.1 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 1 | 1 | success | n/a | 600 | 24 | 465,646 | 56.6 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 30 | 292,812 | 47.4 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 47 | 606,449 | 104.5 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 2 | 1 | wrong_answer | n/a | 600 | 16 | 260,374 | 52.6 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 2 | 1 | wrong_answer | n/a | 600 | 49 | 1,057,804 | 102.0 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 2 | 1 | wrong_answer | n/a | 600 | 48 | 968,999 | 130.4 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Mantis | 3 | 1 | success | n/a | 600 | 26 | 511,988 | 58.4 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 30 | 293,450 | 47.3 | unknown | unknown | known |
| `shopping-v2-closure-capacity` | Screenshots (click by x,y) | 3 | 1 | wrong_answer | n/a | 600 | 48 | 997,199 | 127.3 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 1 | 1 | wrong_answer | n/a | 600 | 23 | 460,803 | 59.7 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 36 | 460,349 | 65.6 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 1 | 1 | wrong_answer | n/a | 600 | 55 | 1,127,842 | 155.6 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 2 | 1 | wrong_answer | n/a | 600 | 24 | 464,424 | 54.1 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 32 | 610,580 | 76.9 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 2 | 1 | wrong_answer | n/a | 600 | 43 | 577,389 | 95.8 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Mantis | 3 | 1 | success | n/a | 600 | 30 | 515,342 | 64.1 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Accessibility tree (Playwright MCP) | 3 | 1 | wrong_answer | n/a | 600 | 53 | 1,227,928 | 109.9 | unknown | unknown | known |
| `shopping-v2-finish-shape` | Screenshots (click by x,y) | 3 | 1 | wrong_answer | n/a | 600 | 82 | 556,250 | 151.3 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 1 | 1 | success | n/a | 600 | 34 | 699,070 | 99.4 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 28 | 173,949 | 38.4 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 46 | 508,916 | 104.7 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 2 | 1 | wrong_answer | n/a | 600 | 29 | 566,315 | 86.7 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 2 | 1 | wrong_answer | n/a | 600 | 54 | 1,229,926 | 113.7 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 47 | 648,861 | 125.7 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Mantis | 3 | 1 | success | n/a | 600 | 28 | 426,684 | 67.5 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Accessibility tree (Playwright MCP) | 3 | 1 | wrong_answer | n/a | 600 | 28 | 499,444 | 114.4 | unknown | unknown | known |
| `shopping-v2-textile-pattern` | Screenshots (click by x,y) | 3 | 1 | wrong_answer | n/a | 600 | 40 | 727,645 | 105.7 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 1 | 1 | success | n/a | 600 | 24 | 460,560 | 146.1 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 1 | 1 | wrong_answer | n/a | 600 | 49 | 1,068,908 | 107.7 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 1 | 1 | wrong_answer | n/a | 600 | 50 | 1,035,878 | 172.3 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 2 | 1 | success | n/a | 600 | 24 | 463,804 | 52.7 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 2 | 1 | wrong_answer | n/a | 600 | 51 | 1,114,888 | 120.1 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 2 | 1 | wrong_answer | n/a | 600 | 45 | 326,726 | 98.7 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Mantis | 3 | 1 | wrong_answer | n/a | 600 | 26 | 451,601 | 95.1 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Accessibility tree (Playwright MCP) | 3 | 1 | wrong_answer | n/a | 600 | 30 | 551,149 | 96.1 | unknown | unknown | known |
| `shopping-v2-material-swatch` | Screenshots (click by x,y) | 3 | 1 | wrong_answer | n/a | 600 | 46 | 868,680 | 193.5 | unknown | unknown | known |
