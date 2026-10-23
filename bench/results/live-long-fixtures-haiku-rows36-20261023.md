# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 12 runs in parallel.
- Scope: 36 exact recovery rows = 36 logical runs; 36 recorded so far; 36 total attempts including retries.
- Exact rows: `llf-basket-off|mantis|1`, `llf-basket-off|mantis|2`, `llf-basket-off|mantis|3`, `llf-basket-off|tree|1`, `llf-basket-off|tree|2`, `llf-basket-off|tree|3`, `llf-basket-off|screenshot|1`, `llf-basket-off|screenshot|2`, `llf-basket-off|screenshot|3`, `llf-basket-on|mantis|1`, `llf-basket-on|mantis|2`, `llf-basket-on|mantis|3`, `llf-basket-on|tree|1`, `llf-basket-on|tree|2`, `llf-basket-on|tree|3`, `llf-basket-on|screenshot|1`, `llf-basket-on|screenshot|2`, `llf-basket-on|screenshot|3`, `llf-retention-off|mantis|1`, `llf-retention-off|mantis|2`, `llf-retention-off|mantis|3`, `llf-retention-off|tree|1`, `llf-retention-off|tree|2`, `llf-retention-off|tree|3`, `llf-retention-off|screenshot|1`, `llf-retention-off|screenshot|2`, `llf-retention-off|screenshot|3`, `llf-retention-on|mantis|1`, `llf-retention-on|mantis|2`, `llf-retention-on|mantis|3`, `llf-retention-on|tree|1`, `llf-retention-on|tree|2`, `llf-retention-on|tree|3`, `llf-retention-on|screenshot|1`, `llf-retention-on|screenshot|2`, `llf-retention-on|screenshot|3`.
- Claude runtime: 2.1.309 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 12 / 12 | 12 / 12 | 12 / 12 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 412 | 502 | 689 |
| MCP tool errors (including retries) | 1 | 15 | 1 |
| Browser observation text (observed chars) | 167,012 | 370,953 | 50,630 |
| Browser observation images (observed blocks) | 0 | 0 | 249 |
| Normal input tokens (total) | 482 | 564 | 510 |
| Cache-write input tokens (total) | 169,167 | 292,685 | 482,338 |
| Cache-read input tokens (total) | 2,898,521 | 5,380,928 | 5,586,346 |
| Output tokens (total) | 27,610 | 42,508 | 72,262 |
| Total input tokens incl. cache (legacy) | 3,068,170 | 5,674,177 | 6,069,194 |
| MCP startup (total, s) | 25.2 | 25.3 | 25.4 |
| CLI startup (total, s) | 47.5 | 52.2 | 49.7 |
| CLI execution (total, s) | 573.9 | 821.7 | 554.4 |
| CLI wall (total, s) | 621.4 | 873.9 | 604.1 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.0 | 0.1 | 0.0 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | 0.08 | 0.13 | 0.19 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | 1 | 21 | 0 | 6,545 | 0 | 36 | 13,453 | 178,813 | 2,056 | 2.2 | 9.2 | 45.4 | 54.6 | 0.00 | 0.00 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 37 | 2 | 26,953 | 0 | 40 | 28,248 | 357,217 | 3,501 | 2.2 | 10.6 | 64.6 | 75.2 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 1 | success | 1 | 71 | 0 | 4,611 | 22 | 42 | 46,778 | 521,114 | 7,911 | 2.2 | 10.4 | 56.9 | 67.3 | 0.01 | 0.01 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | 1 | 22 | 0 | 7,154 | 0 | 36 | 13,991 | 181,983 | 2,168 | 2.2 | 9.3 | 40.8 | 50.1 | 0.00 | 0.01 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 41 | 4 | 27,003 | 0 | 60 | 28,611 | 542,528 | 4,018 | 2.2 | 10.1 | 73.7 | 83.7 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 2 | success | 1 | 66 | 0 | 4,513 | 22 | 44 | 46,722 | 536,246 | 7,931 | 2.3 | 9.9 | 56.6 | 66.5 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 3 | success | 1 | 33 | 0 | 13,546 | 0 | 34 | 17,889 | 189,833 | 2,064 | 2.3 | 9.8 | 43.4 | 53.2 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 41 | 0 | 33,762 | 0 | 38 | 32,453 | 363,877 | 4,326 | 2.3 | 9.9 | 61.9 | 71.8 | 0.00 | 0.01 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 3 | success | 1 | 64 | 0 | 4,341 | 21 | 42 | 40,443 | 437,157 | 7,056 | 2.4 | 10.1 | 52.3 | 62.3 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 1 | success | 1 | 30 | 0 | 11,915 | 0 | 28 | 16,970 | 149,144 | 2,175 | 2.4 | 9.4 | 36.1 | 45.5 | 0.00 | 0.01 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 36 | 2 | 26,576 | 0 | 38 | 27,874 | 311,041 | 3,643 | 2.4 | 10.0 | 56.8 | 66.8 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 1 | success | 1 | 58 | 0 | 3,947 | 19 | 40 | 38,771 | 410,125 | 5,931 | 2.4 | 9.2 | 46.6 | 55.8 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | 1 | 20 | 0 | 6,483 | 0 | 34 | 7,920 | 174,055 | 2,275 | 2.0 | 1.0 | 40.9 | 42.0 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 37 | 2 | 28,166 | 0 | 40 | 20,066 | 369,327 | 3,547 | 2.0 | 1.3 | 57.7 | 59.0 | 0.00 | 0.01 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 2 | success | 1 | 70 | 0 | 4,731 | 23 | 44 | 40,765 | 505,474 | 7,847 | 2.0 | 1.6 | 53.0 | 54.6 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 3 | success | 1 | 30 | 0 | 11,419 | 0 | 32 | 11,171 | 178,542 | 2,228 | 2.0 | 1.3 | 36.7 | 37.9 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 35 | 2 | 26,943 | 0 | 40 | 20,259 | 363,251 | 4,322 | 2.0 | 1.6 | 58.8 | 60.5 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 3 | success | 1 | 62 | 0 | 4,297 | 21 | 44 | 41,903 | 505,968 | 6,990 | 2.0 | 1.1 | 51.8 | 52.9 | 0.00 | 0.00 | Receipt B-8228 · Total charged €101.29 |
| `llf-retention-off` | Mantis | 1 | success | 1 | 38 | 0 | 16,249 | 0 | 46 | 13,179 | 283,376 | 2,255 | 2.0 | 1.3 | 54.0 | 55.3 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 45 | 0 | 31,176 | 0 | 46 | 21,407 | 446,624 | 3,223 | 2.0 | 1.5 | 73.8 | 75.3 | 0.00 | 0.01 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 1 | success | 1 | 53 | 0 | 4,166 | 21 | 44 | 39,266 | 476,997 | 4,822 | 2.0 | 1.2 | 39.9 | 41.1 | 0.00 | 0.01 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | 1 | 42 | 0 | 17,729 | 0 | 50 | 14,449 | 322,210 | 2,565 | 2.0 | 1.6 | 62.0 | 63.6 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 49 | 1 | 32,910 | 0 | 64 | 22,483 | 661,838 | 3,446 | 2.0 | 1.3 | 80.9 | 82.2 | 0.00 | 0.01 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 2 | success | 1 | 48 | 0 | 3,911 | 20 | 42 | 37,198 | 435,167 | 4,509 | 2.0 | 1.3 | 37.3 | 38.6 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Mantis | 3 | success | 1 | 42 | 0 | 18,653 | 0 | 42 | 14,416 | 270,195 | 2,135 | 2.0 | 1.2 | 49.5 | 50.8 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 45 | 0 | 29,475 | 0 | 46 | 20,552 | 432,333 | 3,126 | 2.0 | 1.4 | 74.0 | 75.5 | 0.00 | 0.01 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 3 | success | 1 | 49 | 0 | 4,068 | 21 | 44 | 39,260 | 480,312 | 4,997 | 2.0 | 1.4 | 40.4 | 41.7 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | 1 | 44 | 0 | 18,968 | 0 | 48 | 15,090 | 319,522 | 2,471 | 2.0 | 1.5 | 58.1 | 59.6 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 44 | 0 | 37,789 | 0 | 44 | 24,359 | 443,287 | 3,056 | 2.0 | 1.5 | 69.1 | 70.7 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 1 | success | 1 | 52 | 0 | 4,006 | 20 | 42 | 37,669 | 437,113 | 4,690 | 2.0 | 1.1 | 39.0 | 40.1 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Mantis | 2 | success | 1 | 44 | 0 | 18,940 | 0 | 48 | 15,208 | 324,747 | 2,627 | 2.0 | 1.0 | 54.0 | 54.9 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 45 | 1 | 39,031 | 0 | 46 | 24,974 | 474,296 | 3,018 | 2.0 | 1.6 | 71.6 | 73.2 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 2 | success | 1 | 52 | 1 | 4,360 | 20 | 42 | 38,326 | 443,325 | 5,345 | 2.0 | 1.5 | 45.5 | 47.0 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | 1 | 46 | 1 | 19,411 | 0 | 48 | 15,431 | 326,101 | 2,591 | 2.0 | 1.0 | 52.9 | 54.0 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 47 | 1 | 31,169 | 0 | 62 | 21,399 | 615,309 | 3,282 | 2.0 | 1.2 | 78.8 | 80.0 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 3 | success | 1 | 44 | 0 | 3,679 | 19 | 40 | 35,237 | 397,348 | 4,233 | 2.0 | 1.0 | 35.2 | 36.2 | 0.00 | 0.00 | R-6635 |
