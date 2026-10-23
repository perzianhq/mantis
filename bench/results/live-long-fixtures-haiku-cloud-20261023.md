# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-22; runs per task and approach: 3; 6 runs in parallel.
- Scope: 16 tasks × 3 approaches × 3 runs = 144 logical runs; 144 recorded so far; 144 total attempts including retries.
- Claude runtime: 2.1.308 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 45 / 48 | 46 / 48 | 43 / 48 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 3 | 2 | 5 |
| Tool calls (including retries) | 1,556 | 1,872 | 2,919 |
| MCP tool errors (including retries) | 7 | 55 | 5 |
| Browser observation text (observed chars) | 650,349 | 1,373,514 | 217,933 |
| Browser observation images (observed blocks) | 0 | 0 | 1,046 |
| Normal input tokens (total) | 1,944 | 2,012 | 2,214 |
| Cache-write input tokens (total) | 595,362 | 984,757 | 1,893,374 |
| Cache-read input tokens (total) | 12,261,772 | 19,447,206 | 25,809,098 |
| Output tokens (total) | 114,983 | 164,592 | 273,390 |
| Total input tokens incl. cache (legacy) | 12,859,078 | 20,433,975 | 27,704,686 |
| MCP startup (total, s) | 111.0 | 105.8 | 107.3 |
| CLI startup (total, s) | 80.4 | 82.5 | 75.1 |
| CLI execution (total, s) | 2008.9 | 2878.5 | 3126.1 |
| CLI wall (total, s) | 2089.3 | 2961.0 | 3201.2 |
| Fixture verification (total, s) | 0.0 | 0.1 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.4 | 0.2 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | 0.30 | 0.47 | 0.77 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | 1 | 42 | 0 | 17,050 | 0 | 46 | 21,992 | 292,409 | 3,854 | 2.1 | 5.4 | 48.3 | 53.8 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 47 | 3 | 31,653 | 0 | 70 | 32,419 | 684,386 | 5,110 | 2.1 | 5.9 | 71.6 | 77.5 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 1 | success | 1 | 64 | 0 | 4,801 | 23 | 48 | 48,436 | 584,120 | 6,791 | 2.1 | 5.6 | 51.4 | 56.9 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | 1 | 40 | 0 | 16,244 | 0 | 40 | 21,077 | 253,580 | 3,530 | 2.1 | 5.6 | 38.7 | 44.3 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 43 | 2 | 35,076 | 0 | 46 | 33,739 | 451,320 | 4,503 | 2.1 | 5.3 | 58.2 | 63.5 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 2 | success | 1 | 81 | 1 | 5,737 | 25 | 48 | 47,588 | 598,693 | 8,599 | 2.1 | 4.9 | 57.2 | 62.1 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 3 | success | 1 | 26 | 0 | 8,752 | 0 | 42 | 9,703 | 234,359 | 2,572 | 2.0 | 1.3 | 39.4 | 40.7 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 44 | 5 | 27,728 | 0 | 48 | 21,442 | 447,993 | 4,511 | 2.0 | 1.5 | 53.8 | 55.3 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 3 | success | 1 | 72 | 0 | 4,958 | 23 | 48 | 41,578 | 551,667 | 8,073 | 2.0 | 1.5 | 52.9 | 54.3 | 0.00 | 0.00 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Mantis | 1 | success | 1 | 36 | 0 | 13,766 | 0 | 64 | 13,709 | 413,845 | 3,676 | 2.0 | 1.2 | 51.5 | 52.7 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 43 | 5 | 28,509 | 0 | 60 | 22,026 | 577,505 | 4,862 | 2.0 | 1.2 | 58.7 | 59.9 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 1 | success | 1 | 80 | 0 | 4,986 | 23 | 48 | 45,273 | 615,359 | 9,122 | 2.0 | 1.5 | 77.4 | 78.9 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | 1 | 39 | 0 | 15,490 | 0 | 50 | 14,830 | 317,041 | 3,474 | 2.0 | 1.2 | 42.3 | 43.5 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 51 | 3 | 39,051 | 0 | 54 | 29,045 | 584,149 | 6,201 | 2.0 | 1.3 | 72.4 | 73.7 | 0.00 | 0.01 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 2 | success | 1 | 67 | 0 | 5,165 | 25 | 52 | 49,662 | 702,291 | 8,609 | 2.0 | 1.3 | 60.8 | 62.1 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 3 | success | 1 | 28 | 0 | 10,256 | 0 | 46 | 10,666 | 262,840 | 2,761 | 2.0 | 1.2 | 38.6 | 39.8 | 0.00 | 0.01 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 44 | 0 | 28,752 | 0 | 78 | 22,543 | 815,180 | 5,566 | 2.0 | 1.2 | 75.0 | 76.2 | 0.00 | 0.01 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 3 | success | 1 | 76 | 0 | 5,224 | 25 | 48 | 42,645 | 574,806 | 8,962 | 2.0 | 1.3 | 58.4 | 59.6 | 0.00 | 0.00 | Receipt B-8228, total charged €101.29 |
| `llf-access-off` | Mantis | 1 | success | 1 | 38 | 0 | 18,225 | 0 | 52 | 16,261 | 390,764 | 3,328 | 2.0 | 1.2 | 47.6 | 48.8 | 0.00 | 0.00 | A-5340 |
| `llf-access-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 48 | 0 | 42,518 | 0 | 42 | 28,114 | 491,119 | 4,315 | 2.0 | 1.4 | 61.2 | 62.6 | 0.00 | 0.01 | A-5340 |
| `llf-access-off` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 84 | 0 | 6,007 | 29 | 60 | 55,592 | 907,148 | 8,227 | 2.0 | 1.3 | 60.2 | 61.6 | 0.00 | 0.01 | terminal path was /live-long/access/off/list |
| `llf-access-off` | Mantis | 2 | success | 1 | 46 | 0 | 36,816 | 0 | 48 | 28,237 | 477,718 | 4,219 | 2.0 | 1.3 | 53.4 | 54.7 | 0.00 | 0.00 | A-5340 |
| `llf-access-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 51 | 0 | 41,970 | 0 | 46 | 27,664 | 509,801 | 3,931 | 2.0 | 1.3 | 62.3 | 63.6 | 0.00 | 0.01 | A-5340 |
| `llf-access-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 108 | 0 | 7,418 | 35 | 74 | 67,746 | 1,339,925 | 10,445 | 2.0 | 1.2 | 75.6 | 76.8 | 0.00 | 0.00 | terminal path was /live-long/access/off/detail |
| `llf-access-off` | Mantis | 3 | success | 1 | 41 | 0 | 38,620 | 0 | 46 | 28,920 | 469,968 | 4,151 | 2.0 | 1.2 | 49.2 | 50.4 | 0.00 | 0.01 | A-5340 |
| `llf-access-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 50 | 0 | 49,425 | 0 | 46 | 31,519 | 582,316 | 4,385 | 2.0 | 1.3 | 64.4 | 65.7 | 0.00 | 0.01 | A-5340 |
| `llf-access-off` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 92 | 1 | 6,785 | 31 | 68 | 59,898 | 1,126,156 | 9,027 | 2.6 | 1.4 | 68.6 | 70.0 | 0.00 | 0.00 | terminal path was /live-long/access/off/detail |
| `llf-access-on` | Mantis | 1 | success | 1 | 39 | 0 | 34,488 | 0 | 54 | 27,253 | 560,088 | 4,703 | 2.0 | 1.3 | 54.3 | 55.5 | 0.00 | 0.00 | A-5340 |
| `llf-access-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 48 | 0 | 42,520 | 0 | 44 | 28,137 | 508,022 | 4,341 | 2.0 | 1.4 | 65.1 | 66.4 | 0.00 | 0.01 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 1 | success | 1 | 90 | 0 | 6,259 | 30 | 62 | 58,200 | 966,975 | 9,069 | 2.0 | 1.2 | 70.6 | 71.8 | 0.00 | 0.00 | A-5340 |
| `llf-access-on` | Mantis | 2 | wrong_answer | 1 | 48 | 0 | 23,401 | 0 | 68 | 19,886 | 569,606 | 3,726 | 2.0 | 1.5 | 62.1 | 63.6 | 0.00 | 0.00 | terminal path was /live-long/access/on/detail |
| `llf-access-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 48 | 0 | 40,504 | 0 | 46 | 26,746 | 497,845 | 3,877 | 2.0 | 1.6 | 65.2 | 66.8 | 0.00 | 0.01 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 100 | 1 | 7,953 | 38 | 80 | 66,540 | 1,450,082 | 10,146 | 2.0 | 1.4 | 82.6 | 84.0 | 0.00 | 0.01 | terminal path was /live-long/access/on/list |
| `llf-access-on` | Mantis | 3 | wrong_answer | 1 | 49 | 0 | 23,542 | 0 | 76 | 20,409 | 636,296 | 4,219 | 2.0 | 1.3 | 67.1 | 68.4 | 0.00 | 0.00 | terminal path was /live-long/access/on/list |
| `llf-access-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 46 | 0 | 39,648 | 0 | 40 | 26,342 | 447,470 | 4,032 | 2.0 | 1.5 | 66.9 | 68.4 | 0.00 | 0.02 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 92 | 1 | 6,787 | 31 | 66 | 57,492 | 1,056,151 | 9,327 | 2.0 | 1.4 | 81.9 | 83.3 | 0.00 | 0.00 | terminal path was /live-long/access/on/list |
| `llf-suppliers-off` | Mantis | 1 | success | 1 | 18 | 0 | 5,088 | 0 | 26 | 5,791 | 118,488 | 1,121 | 2.0 | 1.3 | 22.7 | 24.0 | 0.00 | 0.00 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 18 | 0 | 11,422 | 0 | 22 | 9,115 | 146,020 | 1,519 | 2.0 | 1.2 | 30.3 | 31.5 | 0.00 | 0.01 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Screenshots (click by x,y) | 1 | success | 1 | 34 | 0 | 3,097 | 16 | 34 | 29,349 | 293,492 | 3,002 | 2.0 | 1.2 | 38.7 | 39.9 | 0.00 | 0.00 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 2 | success | 1 | 18 | 0 | 5,211 | 0 | 26 | 5,834 | 118,556 | 1,107 | 2.5 | 1.3 | 25.5 | 26.8 | 0.00 | 0.00 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 20 | 0 | 13,256 | 0 | 26 | 10,180 | 185,832 | 1,659 | 2.0 | 1.4 | 38.4 | 39.9 | 0.00 | 0.00 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Screenshots (click by x,y) | 2 | success | 1 | 34 | 0 | 3,097 | 16 | 36 | 29,217 | 301,059 | 2,879 | 4.5 | 1.7 | 38.7 | 40.3 | 0.00 | 0.00 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 3 | success | 1 | 18 | 0 | 5,088 | 0 | 26 | 5,786 | 118,624 | 1,117 | 2.0 | 1.5 | 34.2 | 35.7 | 0.00 | 0.14 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 24 | 0 | 20,396 | 0 | 26 | 14,082 | 206,638 | 2,105 | 2.0 | 4.0 | 39.1 | 43.2 | 0.00 | 0.00 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Screenshots (click by x,y) | 3 | success | 1 | 34 | 0 | 3,097 | 16 | 34 | 29,372 | 293,712 | 3,017 | 3.7 | 1.7 | 35.6 | 37.2 | 0.00 | 0.00 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 1 | success | 1 | 19 | 2 | 6,590 | 0 | 34 | 6,650 | 164,277 | 1,346 | 2.0 | 1.5 | 36.1 | 37.5 | 0.00 | 0.00 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 28 | 2 | 24,111 | 0 | 32 | 15,866 | 265,259 | 1,999 | 2.0 | 1.6 | 42.9 | 44.5 | 0.00 | 0.00 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Screenshots (click by x,y) | 1 | success | 1 | 34 | 0 | 3,095 | 16 | 36 | 29,156 | 300,771 | 2,829 | 2.3 | 1.5 | 33.2 | 34.7 | 0.00 | 0.00 | Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 2 | success | 1 | 24 | 2 | 8,779 | 0 | 42 | 8,341 | 218,600 | 1,882 | 2.0 | 1.4 | 42.7 | 44.1 | 0.00 | 0.00 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 28 | 2 | 23,044 | 0 | 34 | 15,689 | 278,535 | 2,446 | 4.3 | 1.8 | 43.6 | 45.5 | 0.01 | 0.01 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Screenshots (click by x,y) | 2 | success | 1 | 34 | 0 | 3,095 | 16 | 34 | 29,193 | 292,502 | 2,763 | 2.2 | 1.9 | 32.0 | 33.9 | 0.00 | 0.00 | Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 3 | success | 1 | 24 | 2 | 9,027 | 0 | 42 | 8,119 | 218,034 | 1,594 | 2.0 | 1.5 | 39.5 | 41.0 | 0.00 | 0.00 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 32 | 3 | 19,425 | 0 | 38 | 14,933 | 316,111 | 3,135 | 2.3 | 1.7 | 52.5 | 54.2 | 0.00 | 0.01 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Screenshots (click by x,y) | 3 | success | 1 | 34 | 0 | 3,095 | 16 | 36 | 28,028 | 300,284 | 2,962 | 2.0 | 1.5 | 36.6 | 38.1 | 0.00 | 0.00 | Q-4293 · EUR 870.00 |
| `llf-retention-off` | Mantis | 1 | wrong_answer | 1 | 41 | 1 | 16,197 | 0 | 54 | 13,531 | 339,710 | 2,546 | 2.0 | 1.4 | 58.4 | 59.8 | 0.00 | 0.00 | terminal path was /live-long/retention/off/document |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 48 | 1 | 32,535 | 0 | 74 | 21,909 | 741,018 | 3,288 | 2.0 | 1.3 | 86.5 | 87.8 | 0.00 | 0.01 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 1 | success | 1 | 52 | 0 | 4,141 | 21 | 46 | 39,199 | 485,462 | 4,867 | 2.4 | 1.5 | 48.3 | 49.9 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | 1 | 41 | 0 | 18,148 | 0 | 44 | 14,193 | 278,090 | 2,197 | 2.0 | 1.5 | 40.0 | 41.5 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 45 | 1 | 29,838 | 0 | 68 | 20,324 | 655,015 | 3,171 | 2.0 | 1.6 | 80.8 | 82.4 | 0.00 | 0.01 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 2 | success | 1 | 46 | 0 | 3,728 | 19 | 40 | 35,519 | 398,756 | 4,309 | 2.0 | 1.3 | 42.4 | 43.8 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Mantis | 3 | success | 1 | 42 | 0 | 18,057 | 0 | 50 | 14,415 | 318,273 | 2,337 | 4.0 | 1.4 | 50.4 | 51.8 | 0.00 | 0.00 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 45 | 1 | 39,508 | 0 | 48 | 25,055 | 491,485 | 2,960 | 2.0 | 1.3 | 73.8 | 75.0 | 0.01 | 0.02 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 3 | success | 1 | 52 | 0 | 4,275 | 22 | 46 | 40,480 | 519,307 | 4,627 | 2.0 | 1.1 | 48.3 | 49.5 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | 1 | 48 | 0 | 20,033 | 0 | 54 | 15,789 | 367,595 | 2,553 | 2.0 | 1.4 | 54.9 | 56.3 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 47 | 1 | 31,169 | 0 | 60 | 21,383 | 599,628 | 3,220 | 2.0 | 1.3 | 81.0 | 82.3 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 1 | success | 1 | 48 | 0 | 3,505 | 17 | 36 | 32,803 | 335,031 | 4,353 | 2.3 | 1.3 | 44.5 | 45.8 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Mantis | 2 | success | 1 | 42 | 0 | 18,178 | 0 | 42 | 14,384 | 269,332 | 2,275 | 2.0 | 1.5 | 44.8 | 46.2 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 46 | 0 | 28,306 | 0 | 62 | 20,007 | 583,461 | 3,324 | 2.0 | 1.4 | 78.4 | 79.8 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 2 | success | 1 | 46 | 0 | 3,456 | 17 | 36 | 32,552 | 336,018 | 4,213 | 2.0 | 1.3 | 43.5 | 44.9 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | 1 | 42 | 0 | 16,991 | 0 | 50 | 13,895 | 315,188 | 2,370 | 2.0 | 1.2 | 46.8 | 48.0 | 0.00 | 0.00 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 44 | 0 | 38,938 | 0 | 46 | 24,794 | 471,916 | 2,942 | 2.7 | 1.6 | 68.9 | 70.5 | 0.00 | 0.01 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 3 | success | 1 | 48 | 0 | 3,910 | 20 | 42 | 37,246 | 437,775 | 4,518 | 2.0 | 1.3 | 45.8 | 47.1 | 0.00 | 0.00 | R-6635 |
| `llf-workspace-off` | Mantis | 1 | success | 1 | 22 | 0 | 6,125 | 0 | 30 | 7,043 | 149,489 | 1,601 | 2.0 | 1.4 | 36.0 | 37.3 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 32 | 1 | 18,271 | 0 | 24 | 14,505 | 189,741 | 2,827 | 2.0 | 1.4 | 46.4 | 47.8 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-off` | Screenshots (click by x,y) | 1 | success | 1 | 57 | 0 | 3,783 | 17 | 38 | 33,533 | 356,245 | 4,617 | 4.1 | 1.7 | 53.0 | 54.8 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-off` | Mantis | 2 | success | 1 | 36 | 0 | 13,717 | 0 | 34 | 11,630 | 203,042 | 2,119 | 2.0 | 1.4 | 40.1 | 41.5 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 33 | 2 | 18,255 | 0 | 24 | 14,439 | 189,846 | 2,736 | 2.0 | 1.4 | 49.1 | 50.6 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-off` | Screenshots (click by x,y) | 2 | success | 1 | 55 | 0 | 3,465 | 15 | 34 | 29,200 | 279,429 | 4,497 | 2.0 | 1.6 | 51.4 | 52.9 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-off` | Mantis | 3 | success | 1 | 34 | 0 | 13,688 | 0 | 34 | 11,574 | 202,092 | 2,068 | 2.6 | 1.5 | 43.4 | 44.9 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 31 | 0 | 18,179 | 0 | 24 | 14,203 | 188,485 | 2,597 | 2.0 | 1.5 | 49.0 | 50.6 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-off` | Screenshots (click by x,y) | 3 | success | 1 | 57 | 0 | 3,783 | 17 | 38 | 33,567 | 356,646 | 4,585 | 2.0 | 1.6 | 75.5 | 77.1 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-on` | Mantis | 1 | success | 1 | 30 | 0 | 11,020 | 0 | 26 | 9,844 | 138,329 | 1,923 | 2.0 | 1.3 | 38.9 | 40.2 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 34 | 2 | 19,206 | 0 | 26 | 15,182 | 213,781 | 2,943 | 2.0 | 1.5 | 52.6 | 54.1 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-on` | Screenshots (click by x,y) | 1 | success | 1 | 56 | 0 | 3,622 | 16 | 36 | 32,133 | 322,336 | 4,652 | 2.0 | 1.6 | 84.2 | 85.8 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-on` | Mantis | 2 | success | 1 | 29 | 0 | 10,720 | 0 | 26 | 9,810 | 138,430 | 1,903 | 2.0 | 1.3 | 27.4 | 28.7 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 34 | 2 | 19,338 | 0 | 28 | 15,269 | 229,237 | 2,949 | 2.0 | 1.3 | 50.9 | 52.3 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-on` | Screenshots (click by x,y) | 2 | success | 1 | 57 | 0 | 3,781 | 17 | 38 | 33,561 | 356,764 | 4,618 | 2.0 | 1.4 | 63.9 | 65.3 | 0.00 | 0.00 | WS-3551 |
| `llf-workspace-on` | Mantis | 3 | success | 1 | 28 | 0 | 11,637 | 0 | 26 | 10,059 | 139,385 | 1,777 | 2.0 | 1.3 | 31.1 | 32.4 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 33 | 2 | 18,226 | 0 | 24 | 14,459 | 189,953 | 2,807 | 2.9 | 1.7 | 42.9 | 44.6 | 0.00 | 0.01 | WS-3551 |
| `llf-workspace-on` | Screenshots (click by x,y) | 3 | success | 1 | 56 | 0 | 3,622 | 16 | 36 | 32,087 | 323,126 | 4,606 | 2.0 | 1.4 | 58.6 | 60.0 | 0.00 | 0.01 | WS-3551 |
| `llf-casework-off` | Mantis | 1 | success | 1 | 23 | 0 | 11,260 | 0 | 38 | 9,837 | 208,469 | 1,818 | 2.0 | 5.0 | 39.6 | 44.6 | 0.00 | 0.01 | CW-4013 |
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 35 | 1 | 37,434 | 0 | 42 | 22,786 | 401,145 | 2,995 | 2.0 | 1.4 | 67.5 | 68.9 | 0.00 | 0.01 | CW-4013 |
| `llf-casework-off` | Screenshots (click by x,y) | 1 | success | 1 | 53 | 0 | 4,299 | 21 | 44 | 31,885 | 444,835 | 4,814 | 2.0 | 1.5 | 82.2 | 83.7 | 0.01 | 0.01 | CW-4013 |
| `llf-casework-off` | Mantis | 2 | success | 1 | 23 | 0 | 12,926 | 0 | 32 | 10,809 | 180,526 | 2,008 | 3.0 | 1.5 | 36.0 | 37.5 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 40 | 1 | 39,577 | 0 | 54 | 24,390 | 549,197 | 3,507 | 2.0 | 1.4 | 68.9 | 70.4 | 0.00 | 0.01 | terminal route is /live-long/casework/off/queue |
| `llf-casework-off` | Screenshots (click by x,y) | 2 | success | 1 | 54 | 0 | 4,458 | 22 | 46 | 40,765 | 525,657 | 4,784 | 3.3 | 1.4 | 68.3 | 69.8 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-off` | Mantis | 3 | success | 1 | 22 | 0 | 11,816 | 0 | 32 | 10,229 | 180,867 | 1,916 | 2.0 | 1.3 | 35.4 | 36.7 | 0.00 | 0.01 | CW-4013 |
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 36 | 1 | 34,901 | 0 | 54 | 21,677 | 525,885 | 3,041 | 2.0 | 1.4 | 74.1 | 75.5 | 0.00 | 0.01 | CW-4013 |
| `llf-casework-off` | Screenshots (click by x,y) | 3 | success | 1 | 55 | 0 | 4,482 | 22 | 46 | 41,030 | 526,229 | 5,342 | 2.0 | 1.2 | 73.5 | 74.8 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | 1 | 26 | 0 | 13,178 | 0 | 36 | 11,014 | 204,595 | 1,881 | 2.0 | 1.4 | 41.3 | 42.7 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 43 | 1 | 43,660 | 0 | 36 | 26,773 | 388,730 | 3,490 | 2.9 | 1.5 | 65.4 | 66.9 | 0.00 | 0.01 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 1 | success | 1 | 53 | 0 | 4,297 | 21 | 44 | 38,991 | 483,021 | 4,530 | 2.0 | 1.4 | 90.2 | 91.5 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Mantis | 2 | success | 1 | 22 | 0 | 11,209 | 0 | 36 | 9,804 | 197,959 | 1,818 | 2.0 | 1.4 | 36.3 | 37.7 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 41 | 2 | 42,990 | 0 | 40 | 25,985 | 424,156 | 3,218 | 2.1 | 1.5 | 60.4 | 62.0 | 0.00 | 0.02 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 2 | success | 1 | 56 | 1 | 4,849 | 22 | 46 | 33,987 | 468,349 | 5,193 | 2.0 | 1.4 | 84.1 | 85.6 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Mantis | 3 | success | 1 | 25 | 0 | 12,253 | 0 | 34 | 10,243 | 188,683 | 1,761 | 4.7 | 1.7 | 30.9 | 32.7 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 36 | 2 | 34,596 | 0 | 58 | 21,559 | 600,792 | 3,089 | 2.0 | 1.5 | 64.2 | 65.7 | 0.00 | 0.00 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 3 | success | 1 | 53 | 0 | 4,297 | 21 | 44 | 39,026 | 484,152 | 4,559 | 2.0 | 1.4 | 81.6 | 83.0 | 0.00 | 0.00 | CW-4013 |
| `llf-budgets-off` | Mantis | 1 | success | 1 | 22 | 0 | 6,900 | 0 | 28 | 7,374 | 135,922 | 1,454 | 3.2 | 3.9 | 21.9 | 25.8 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 27 | 0 | 18,032 | 0 | 24 | 13,664 | 186,763 | 2,283 | 3.5 | 1.7 | 38.6 | 40.3 | 0.00 | 0.01 | BG-4763 |
| `llf-budgets-off` | Screenshots (click by x,y) | 1 | success | 1 | 54 | 0 | 4,231 | 21 | 44 | 32,734 | 428,157 | 4,607 | 2.0 | 1.6 | 88.3 | 89.9 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-off` | Mantis | 2 | success | 1 | 19 | 0 | 5,231 | 0 | 30 | 6,307 | 142,175 | 1,375 | 3.0 | 1.2 | 33.3 | 34.5 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 27 | 0 | 18,012 | 0 | 38 | 13,923 | 297,794 | 2,670 | 2.0 | 3.9 | 52.5 | 56.4 | 0.00 | 0.01 | BG-4763 |
| `llf-budgets-off` | Screenshots (click by x,y) | 2 | success | 1 | 54 | 0 | 4,231 | 21 | 46 | 34,149 | 460,192 | 4,698 | 2.0 | 1.2 | 82.5 | 83.6 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-off` | Mantis | 3 | success | 1 | 17 | 0 | 4,678 | 0 | 26 | 5,851 | 119,289 | 1,305 | 2.0 | 1.4 | 27.6 | 29.0 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 27 | 0 | 18,032 | 0 | 24 | 13,702 | 187,016 | 2,321 | 2.0 | 1.4 | 40.0 | 41.5 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-off` | Screenshots (click by x,y) | 3 | success | 1 | 53 | 0 | 4,072 | 20 | 42 | 31,296 | 392,659 | 4,666 | 2.0 | 1.4 | 69.1 | 70.4 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-on` | Mantis | 1 | success | 1 | 18 | 0 | 5,347 | 0 | 28 | 6,284 | 131,404 | 1,322 | 2.0 | 1.3 | 30.7 | 32.0 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 65 | 2 | 41,505 | 0 | 70 | 32,248 | 840,768 | 7,728 | 4.5 | 1.4 | 116.9 | 118.2 | 0.00 | 0.01 | BG-4763 |
| `llf-budgets-on` | Screenshots (click by x,y) | 1 | success | 1 | 55 | 0 | 4,388 | 22 | 46 | 33,211 | 460,516 | 4,852 | 2.0 | 1.3 | 77.8 | 79.1 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-on` | Mantis | 2 | success | 1 | 27 | 0 | 6,578 | 0 | 36 | 8,016 | 185,584 | 2,055 | 2.0 | 1.3 | 36.1 | 37.4 | 0.00 | 0.01 | BG-4763 |
| `llf-budgets-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 27 | 0 | 17,996 | 0 | 28 | 13,611 | 214,947 | 2,316 | 2.0 | 1.2 | 41.8 | 43.0 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-on` | Screenshots (click by x,y) | 2 | success | 1 | 54 | 0 | 4,229 | 21 | 46 | 32,901 | 438,422 | 4,563 | 2.0 | 1.3 | 65.6 | 66.8 | 0.00 | 0.00 | BG-4763 |
| `llf-budgets-on` | Mantis | 3 | success | 1 | 17 | 0 | 4,668 | 0 | 26 | 5,914 | 119,345 | 1,300 | 2.0 | 1.5 | 27.0 | 28.5 | 0.00 | 0.01 | BG-4763 |
| `llf-budgets-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 27 | 0 | 17,996 | 0 | 24 | 13,646 | 186,638 | 2,265 | 2.0 | 1.3 | 42.4 | 43.7 | 0.00 | 0.01 | BG-4763 |
| `llf-budgets-on` | Screenshots (click by x,y) | 3 | success | 1 | 52 | 0 | 3,911 | 19 | 42 | 30,981 | 385,824 | 4,530 | 2.0 | 1.2 | 70.0 | 71.2 | 0.00 | 0.01 | BG-4763 |
| `llf-dispatch-off` | Mantis | 1 | success | 1 | 46 | 0 | 12,619 | 0 | 42 | 12,906 | 257,707 | 3,087 | 4.1 | 1.4 | 48.4 | 49.8 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 43 | 2 | 24,171 | 0 | 38 | 19,241 | 343,849 | 3,891 | 2.0 | 1.7 | 61.8 | 63.5 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-off` | Screenshots (click by x,y) | 1 | success | 1 | 71 | 0 | 4,753 | 22 | 46 | 38,973 | 519,059 | 6,054 | 3.2 | 1.4 | 85.4 | 86.8 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-off` | Mantis | 2 | success | 1 | 47 | 0 | 12,577 | 0 | 46 | 12,691 | 279,766 | 2,898 | 2.0 | 1.2 | 59.0 | 60.2 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 41 | 0 | 22,205 | 0 | 34 | 17,546 | 300,281 | 3,389 | 2.0 | 1.3 | 57.6 | 58.9 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-off` | Screenshots (click by x,y) | 2 | success | 1 | 73 | 0 | 5,207 | 25 | 52 | 41,105 | 624,385 | 6,329 | 2.0 | 1.6 | 84.9 | 86.4 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-off` | Mantis | 3 | success | 1 | 48 | 0 | 12,864 | 0 | 44 | 13,340 | 275,822 | 3,279 | 2.0 | 1.4 | 51.6 | 53.0 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-off` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 42 | 0 | 23,197 | 0 | 38 | 18,326 | 332,513 | 3,592 | 2.0 | 1.4 | 59.8 | 61.1 | 0.00 | 0.01 | terminal route is /live-long/dispatch/off/queue |
| `llf-dispatch-off` | Screenshots (click by x,y) | 3 | success | 1 | 69 | 0 | 4,571 | 21 | 44 | 37,257 | 478,126 | 5,937 | 2.0 | 1.3 | 86.0 | 87.3 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-on` | Mantis | 1 | success | 1 | 46 | 0 | 12,458 | 0 | 44 | 12,518 | 261,902 | 2,857 | 3.3 | 1.5 | 48.9 | 50.5 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 43 | 1 | 22,954 | 0 | 34 | 18,485 | 310,741 | 3,654 | 2.0 | 1.3 | 57.7 | 58.9 | 0.01 | 0.01 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 1 | success | 1 | 75 | 0 | 5,666 | 28 | 56 | 44,501 | 715,469 | 6,522 | 2.1 | 1.3 | 94.6 | 95.9 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-on` | Mantis | 2 | success | 1 | 42 | 0 | 10,363 | 0 | 44 | 11,038 | 246,365 | 2,605 | 2.0 | 1.3 | 55.0 | 56.3 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 44 | 1 | 23,144 | 0 | 36 | 18,300 | 315,721 | 3,503 | 2.0 | 1.4 | 64.7 | 66.1 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 2 | success | 1 | 74 | 0 | 5,371 | 26 | 54 | 44,055 | 671,659 | 6,517 | 2.0 | 1.4 | 93.8 | 95.2 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-on` | Mantis | 3 | success | 1 | 38 | 0 | 12,480 | 0 | 44 | 11,556 | 251,344 | 2,195 | 4.0 | 1.4 | 44.8 | 46.2 | 0.00 | 0.00 | DP-1635 |
| `llf-dispatch-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 43 | 3 | 22,335 | 0 | 34 | 17,765 | 301,203 | 3,379 | 2.0 | 1.4 | 62.0 | 63.4 | 0.00 | 0.01 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 3 | success | 1 | 71 | 0 | 4,894 | 23 | 48 | 39,682 | 540,299 | 6,582 | 2.0 | 1.4 | 76.7 | 78.0 | 0.00 | 0.01 | DP-1635 |
