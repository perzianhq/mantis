# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 12 runs in parallel.
- Scope: 16 tasks × 1 approaches × 3 runs = 48 logical runs; 48 recorded so far; 48 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 48 / 48 |
| After reruns / merged correct | 48 / 48 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 48 / 48 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 1,578 |
| MCP tool errors (including retries) | 6 |
| Browser observation text (observed chars) | 731,230 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 2,078 |
| Cache-write input tokens (total) | 809,588 |
| Cache-read input tokens (total) | 17,580,687 |
| Output tokens (total) | 132,613 |
| Total input tokens incl. cache (legacy) | 18,392,353 |
| MCP startup (total, s) | 107.5 |
| CLI startup (total, s) | 126.4 |
| CLI execution (total, s) | 2362.4 |
| CLI wall (total, s) | 2488.9 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 15.8 |
| Harness capture (total, s) | 0.0 |
| Cost estimate (USD; including retries) | 10.31 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 29 | 0 | 11,302 | 0 | 38 | 14,894 | 287,201 | 2,621 | 2.1 | 4.2 | 40.4 | 44.6 | 0.00 | 0.22 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 8,946 | 0 | 40 | 13,041 | 289,046 | 2,269 | 2.1 | 5.0 | 35.0 | 40.0 | 0.00 | 0.22 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 9,890 | 0 | 40 | 13,772 | 291,463 | 2,547 | 2.1 | 4.2 | 42.9 | 47.0 | 0.00 | 0.25 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 10,075 | 0 | 50 | 13,971 | 374,955 | 2,861 | 2.1 | 4.4 | 58.1 | 62.5 | 0.00 | 0.19 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 9,971 | 0 | 54 | 14,739 | 427,207 | 3,676 | 2.2 | 4.7 | 55.6 | 60.3 | 0.00 | 0.19 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 10,104 | 0 | 40 | 14,172 | 297,277 | 2,941 | 2.2 | 4.9 | 44.2 | 49.1 | 0.00 | 0.20 | Receipt B-8228, total charged €101.29 |
| `llf-access-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 50 | 0 | 43,345 | 0 | 52 | 37,369 | 696,156 | 6,506 | 2.2 | 4.1 | 69.2 | 73.3 | 0.00 | 0.25 | A-5340 |
| `llf-access-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 42 | 0 | 26,487 | 0 | 60 | 26,434 | 699,668 | 5,336 | 2.2 | 4.9 | 71.3 | 76.2 | 0.00 | 0.30 | A-5340 |
| `llf-access-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 50 | 0 | 41,274 | 0 | 60 | 35,218 | 764,404 | 5,267 | 2.2 | 4.0 | 70.9 | 75.0 | 0.00 | 0.28 | A-5340 |
| `llf-access-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 53 | 0 | 28,822 | 0 | 54 | 27,782 | 614,553 | 5,111 | 2.2 | 4.9 | 65.1 | 70.0 | 0.00 | 0.22 | Receipt A-5340 |
| `llf-access-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 40 | 0 | 26,100 | 0 | 56 | 25,273 | 628,035 | 4,482 | 2.2 | 4.5 | 66.6 | 71.2 | 0.00 | 0.23 | A-5340 |
| `llf-access-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 40 | 0 | 34,738 | 0 | 60 | 29,991 | 713,405 | 4,035 | 2.2 | 4.7 | 57.9 | 62.6 | 0.00 | 0.23 | A-5340 |
| `llf-suppliers-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 5,866 | 0 | 32 | 10,184 | 209,625 | 1,442 | 2.0 | 1.0 | 27.2 | 28.2 | 0.00 | 0.22 | Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 6,491 | 0 | 20 | 10,473 | 122,820 | 1,358 | 2.0 | 1.2 | 23.7 | 24.9 | 0.00 | 0.21 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,287 | 0 | 30 | 9,882 | 191,859 | 1,594 | 2.1 | 1.7 | 30.1 | 31.8 | 0.00 | 0.20 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 26 | 2 | 12,141 | 0 | 32 | 13,558 | 225,347 | 1,503 | 2.0 | 1.2 | 39.8 | 41.0 | 0.00 | 0.20 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 2 | 11,986 | 0 | 48 | 13,225 | 359,094 | 1,756 | 2.1 | 1.3 | 41.3 | 42.5 | 0.00 | 0.21 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 26 | 2 | 11,968 | 0 | 48 | 13,547 | 364,109 | 2,050 | 2.0 | 1.1 | 40.9 | 42.0 | 0.00 | 0.20 | Receipt Q-4293, EUR 870.00 |
| `llf-retention-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 48 | 0 | 21,644 | 0 | 58 | 20,371 | 520,848 | 3,084 | 2.0 | 1.3 | 50.0 | 51.4 | 0.00 | 0.26 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 46 | 0 | 20,846 | 0 | 54 | 19,522 | 473,840 | 3,060 | 2.0 | 1.5 | 50.7 | 52.2 | 0.00 | 0.34 | R-6635 |
| `llf-retention-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 47 | 0 | 21,221 | 0 | 54 | 19,722 | 486,086 | 2,693 | 2.0 | 1.5 | 70.5 | 72.0 | 0.00 | 0.41 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 42 | 0 | 17,013 | 0 | 60 | 17,485 | 498,207 | 2,916 | 2.2 | 2.3 | 53.4 | 55.8 | 0.00 | 0.38 | R-6635 |
| `llf-retention-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 18,545 | 0 | 50 | 18,244 | 417,535 | 2,627 | 2.0 | 2.2 | 47.0 | 49.2 | 0.00 | 0.28 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 40 | 0 | 17,121 | 0 | 48 | 17,208 | 385,420 | 2,460 | 2.0 | 1.5 | 48.1 | 49.6 | 0.00 | 0.86 | R-6635 |
| `llf-workspace-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 32 | 0 | 13,907 | 0 | 36 | 15,357 | 278,939 | 2,244 | 2.0 | 1.3 | 38.6 | 39.9 | 0.00 | 0.21 | WS-3551 |
| `llf-workspace-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 11,768 | 0 | 30 | 14,061 | 212,925 | 2,293 | 2.0 | 1.2 | 35.6 | 36.8 | 0.00 | 0.20 | WS-3551 |
| `llf-workspace-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 14,453 | 0 | 38 | 15,693 | 297,944 | 2,292 | 2.0 | 1.0 | 42.7 | 43.8 | 0.00 | 1.18 | WS-3551 |
| `llf-workspace-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 11,038 | 0 | 26 | 13,828 | 181,886 | 2,185 | 2.0 | 0.9 | 33.9 | 34.8 | 0.00 | 0.90 | WS-3551 |
| `llf-workspace-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 6,113 | 0 | 30 | 10,452 | 199,087 | 1,700 | 2.0 | 1.2 | 39.6 | 40.9 | 0.00 | 0.45 | WS-3551 |
| `llf-workspace-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 6,719 | 0 | 32 | 11,190 | 218,873 | 1,845 | 2.0 | 1.1 | 42.0 | 43.1 | 0.00 | 0.44 | WS-3551 |
| `llf-casework-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 11,374 | 0 | 40 | 13,957 | 302,513 | 2,240 | 2.0 | 1.1 | 62.9 | 64.0 | 0.00 | 0.38 | CW-4013 |
| `llf-casework-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 11,583 | 0 | 42 | 13,964 | 320,776 | 2,177 | 2.0 | 1.4 | 63.9 | 65.3 | 0.00 | 0.41 | CW-4013 |
| `llf-casework-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 12,297 | 0 | 46 | 14,292 | 357,400 | 2,163 | 2.0 | 1.4 | 39.7 | 41.1 | 0.00 | 0.44 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 39 | 0 | 24,066 | 0 | 40 | 21,118 | 358,948 | 2,646 | 3.4 | 5.4 | 47.3 | 52.7 | 0.00 | 0.35 | CW-4013 |
| `llf-casework-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 12,027 | 0 | 44 | 14,093 | 337,663 | 2,067 | 4.1 | 3.2 | 54.0 | 57.3 | 0.00 | 0.35 | CW-4013 |
| `llf-casework-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 39 | 0 | 24,066 | 0 | 42 | 21,424 | 376,630 | 2,910 | 2.4 | 3.2 | 55.5 | 58.8 | 0.00 | 0.42 | CW-4013 |
| `llf-budgets-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 31 | 0 | 9,994 | 0 | 36 | 13,775 | 263,276 | 2,356 | 2.6 | 2.4 | 46.9 | 49.3 | 0.00 | 0.43 | BG-4763 |
| `llf-budgets-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 31 | 0 | 9,743 | 0 | 36 | 13,600 | 262,001 | 2,276 | 2.0 | 3.7 | 37.4 | 41.1 | 0.00 | 0.30 | BG-4763 |
| `llf-budgets-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 31 | 0 | 9,399 | 0 | 36 | 13,411 | 260,369 | 2,253 | 2.0 | 5.5 | 43.7 | 49.2 | 0.00 | 0.33 | BG-4763 |
| `llf-budgets-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 20 | 0 | 5,781 | 0 | 34 | 10,697 | 229,073 | 1,876 | 2.0 | 2.0 | 34.7 | 36.7 | 0.00 | 0.42 | BG-4763 |
| `llf-budgets-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 8,888 | 0 | 28 | 12,686 | 191,135 | 1,954 | 2.0 | 2.4 | 46.3 | 48.7 | 0.00 | 0.27 | BG-4763 |
| `llf-budgets-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 7,857 | 0 | 40 | 12,305 | 284,900 | 2,440 | 2.0 | 1.3 | 60.9 | 62.2 | 0.00 | 0.31 | BG-4763 |
| `llf-dispatch-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 15,252 | 0 | 48 | 17,548 | 391,604 | 3,240 | 2.0 | 1.7 | 54.8 | 56.5 | 0.00 | 0.25 | DP-1635 |
| `llf-dispatch-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 15,252 | 0 | 48 | 17,677 | 393,325 | 3,252 | 2.0 | 1.1 | 57.1 | 58.2 | 0.00 | 0.27 | DP-1635 |
| `llf-dispatch-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 15,198 | 0 | 48 | 17,564 | 392,586 | 3,161 | 3.4 | 3.9 | 53.0 | 56.9 | 0.00 | 0.28 | DP-1635 |
| `llf-dispatch-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 39 | 0 | 12,862 | 0 | 46 | 15,662 | 359,792 | 2,691 | 3.1 | 2.8 | 64.4 | 67.2 | 0.00 | 0.26 | DP-1635 |
| `llf-dispatch-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 15,213 | 0 | 48 | 17,557 | 391,693 | 3,114 | 2.2 | 2.7 | 54.0 | 56.7 | 0.00 | 0.28 | DP-1635 |
| `llf-dispatch-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 15,197 | 0 | 46 | 17,600 | 379,189 | 3,043 | 3.5 | 2.1 | 53.4 | 55.5 | 0.00 | 0.21 | DP-1635 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | 1 | success | n/a | 1200 | 29 | 302,133 | 40.4 | 0.181 | unknown | known |
| `llf-basket-off` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 302,127 | 35.0 | 0.17 | unknown | known |
| `llf-basket-off` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 305,275 | 42.9 | 0.177 | unknown | known |
| `llf-basket-on` | Mantis | 1 | 1 | success | n/a | 1200 | 26 | 388,976 | 58.1 | 0.208 | unknown | known |
| `llf-basket-on` | Mantis | 2 | 1 | success | n/a | 1200 | 27 | 442,000 | 55.6 | 0.239 | unknown | known |
| `llf-basket-on` | Mantis | 3 | 1 | success | n/a | 1200 | 24 | 311,489 | 44.2 | 0.187 | unknown | known |
| `llf-access-off` | Mantis | 1 | 1 | success | n/a | 1200 | 50 | 733,577 | 69.2 | 0.447 | unknown | known |
| `llf-access-off` | Mantis | 2 | 1 | success | n/a | 1200 | 42 | 726,162 | 71.3 | 0.389 | unknown | known |
| `llf-access-off` | Mantis | 3 | 1 | success | n/a | 1200 | 50 | 799,682 | 70.9 | 0.441 | unknown | known |
| `llf-access-on` | Mantis | 1 | 1 | success | n/a | 1200 | 53 | 642,389 | 65.1 | 0.365 | unknown | known |
| `llf-access-on` | Mantis | 2 | 1 | success | n/a | 1200 | 40 | 653,364 | 66.6 | 0.351 | unknown | known |
| `llf-access-on` | Mantis | 3 | 1 | success | n/a | 1200 | 40 | 743,456 | 57.9 | 0.387 | unknown | known |
| `llf-suppliers-off` | Mantis | 1 | 1 | success | n/a | 1200 | 19 | 219,841 | 27.2 | 0.123 | unknown | known |
| `llf-suppliers-off` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 133,313 | 23.7 | 0.097 | unknown | known |
| `llf-suppliers-off` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 201,771 | 30.1 | 0.119 | unknown | known |
| `llf-suppliers-on` | Mantis | 1 | 1 | success | n/a | 1200 | 26 | 238,937 | 39.8 | 0.141 | unknown | known |
| `llf-suppliers-on` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 372,367 | 41.3 | 0.184 | unknown | known |
| `llf-suppliers-on` | Mantis | 3 | 1 | success | n/a | 1200 | 26 | 377,704 | 40.9 | 0.191 | unknown | known |
| `llf-retention-off` | Mantis | 1 | 1 | success | n/a | 1200 | 48 | 541,277 | 50.0 | 0.279 | unknown | known |
| `llf-retention-off` | Mantis | 2 | 1 | success | n/a | 1200 | 46 | 493,416 | 50.7 | 0.261 | unknown | known |
| `llf-retention-off` | Mantis | 3 | 1 | success | n/a | 1200 | 47 | 505,862 | 70.5 | 0.26 | unknown | known |
| `llf-retention-on` | Mantis | 1 | 1 | success | n/a | 1200 | 42 | 515,752 | 53.4 | 0.259 | unknown | known |
| `llf-retention-on` | Mantis | 2 | 1 | success | n/a | 1200 | 43 | 435,829 | 47.0 | 0.233 | unknown | known |
| `llf-retention-on` | Mantis | 3 | 1 | success | n/a | 1200 | 40 | 402,676 | 48.1 | 0.217 | unknown | known |
| `llf-workspace-off` | Mantis | 1 | 1 | success | n/a | 1200 | 32 | 294,332 | 38.6 | 0.175 | unknown | known |
| `llf-workspace-off` | Mantis | 2 | 1 | success | n/a | 1200 | 28 | 227,016 | 35.6 | 0.151 | unknown | known |
| `llf-workspace-off` | Mantis | 3 | 1 | success | n/a | 1200 | 33 | 313,675 | 42.7 | 0.183 | unknown | known |
| `llf-workspace-on` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 195,740 | 33.9 | 0.139 | unknown | known |
| `llf-workspace-on` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 209,569 | 39.6 | 0.125 | unknown | known |
| `llf-workspace-on` | Mantis | 3 | 1 | success | n/a | 1200 | 22 | 230,095 | 42.0 | 0.135 | unknown | known |
| `llf-casework-off` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 316,510 | 62.9 | 0.177 | unknown | known |
| `llf-casework-off` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 334,782 | 63.9 | 0.181 | unknown | known |
| `llf-casework-off` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 371,738 | 39.7 | 0.193 | unknown | known |
| `llf-casework-on` | Mantis | 1 | 1 | success | n/a | 1200 | 39 | 380,106 | 47.3 | 0.227 | unknown | known |
| `llf-casework-on` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 351,800 | 54.0 | 0.185 | unknown | known |
| `llf-casework-on` | Mantis | 3 | 1 | success | n/a | 1200 | 39 | 398,096 | 55.5 | 0.237 | unknown | known |
| `llf-budgets-off` | Mantis | 1 | 1 | success | n/a | 1200 | 31 | 277,087 | 46.9 | 0.166 | unknown | known |
| `llf-budgets-off` | Mantis | 2 | 1 | success | n/a | 1200 | 31 | 275,637 | 37.4 | 0.164 | unknown | known |
| `llf-budgets-off` | Mantis | 3 | 1 | success | n/a | 1200 | 31 | 273,816 | 43.7 | 0.162 | unknown | known |
| `llf-budgets-on` | Mantis | 1 | 1 | success | n/a | 1200 | 20 | 239,804 | 34.7 | 0.137 | unknown | known |
| `llf-budgets-on` | Mantis | 2 | 1 | success | n/a | 1200 | 27 | 203,849 | 46.3 | 0.134 | unknown | known |
| `llf-budgets-on` | Mantis | 3 | 1 | success | n/a | 1200 | 24 | 297,245 | 60.9 | 0.168 | unknown | known |
| `llf-dispatch-off` | Mantis | 1 | 1 | success | n/a | 1200 | 43 | 409,200 | 54.8 | 0.232 | unknown | known |
| `llf-dispatch-off` | Mantis | 2 | 1 | success | n/a | 1200 | 43 | 411,050 | 57.1 | 0.233 | unknown | known |
| `llf-dispatch-off` | Mantis | 3 | 1 | success | n/a | 1200 | 43 | 410,198 | 53.0 | 0.231 | unknown | known |
| `llf-dispatch-on` | Mantis | 1 | 1 | success | n/a | 1200 | 39 | 375,500 | 64.4 | 0.207 | unknown | known |
| `llf-dispatch-on` | Mantis | 2 | 1 | success | n/a | 1200 | 43 | 409,298 | 54.0 | 0.23 | unknown | known |
| `llf-dispatch-on` | Mantis | 3 | 1 | success | n/a | 1200 | 43 | 396,835 | 53.4 | 0.226 | unknown | known |
