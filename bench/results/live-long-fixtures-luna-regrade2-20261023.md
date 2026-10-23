# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 30 runs in parallel.
- Scope: 16 tasks × 3 approaches × 3 runs = 144 logical runs; 144 recorded so far; 145 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.1; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 47 / 48 | 45 / 48 | 33 / 48 |
| Connection-failure attempts | 1 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 1 | 3 | 15 |
| Tool calls (including retries) | 1,194 | 1,668 | 2,626 |
| MCP tool errors (including retries) | 2 | 76 | 10 |
| Browser observation text (observed chars) | 445,340 | 1,325,245 | 47,257 |
| Browser observation images (observed blocks) | 0 | 0 | 806 |
| Normal input tokens (total) | unknown | 2,092,636 | 2,093,139 |
| Cache-write input tokens (total) | unknown | 0 | 0 |
| Cache-read input tokens (total) | unknown | 26,740,608 | 29,907,328 |
| Output tokens (total) | unknown | 67,816 | 148,616 |
| Total input tokens incl. cache (legacy) | unknown | 28,833,244 | 32,000,467 |
| MCP startup (total, s) | 134.9 | 129.1 | 127.5 |
| CLI startup (total, s) | 102.3 | 118.4 | 104.3 |
| CLI execution (total, s) | 4239.7 | 5268.8 | 7684.1 |
| CLI wall (total, s) | 4341.9 | 5387.2 | 7788.4 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 17.2 | 16.9 | 14.8 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | 1 | 18 | 0 | 5,409 | 0 | 25,611 | 0 | 260,352 | 1,043 | 2.4 | 3.5 | 147.8 | 151.3 | 0.00 | 0.35 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 35 | 2 | 27,392 | 0 | 38,305 | 0 | 593,536 | 1,525 | 3.1 | 3.0 | 199.4 | 202.4 | 0.00 | 0.29 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 1 | success | 1 | 65 | 0 | 1,151 | 19 | 70,054 | 0 | 1,249,792 | 4,683 | 3.0 | 6.6 | 229.8 | 236.4 | 0.00 | 0.32 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | 1 | 24 | 1 | 7,727 | 0 | 22,082 | 0 | 348,928 | 1,081 | 3.3 | 3.1 | 192.3 | 195.5 | 0.00 | 0.27 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 36 | 6 | 27,035 | 0 | 57,270 | 0 | 507,008 | 1,497 | 3.2 | 6.5 | 120.7 | 127.2 | 0.00 | 0.31 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 53 | 0 | 851 | 13 | 33,057 | 0 | 206,464 | 2,448 | 3.4 | 3.6 | 166.4 | 170.0 | 0.00 | 0.37 | workflow is incomplete or still pending |
| `llf-basket-off` | Mantis | 3 | success | 1 | 20 | 0 | 5,835 | 0 | 29,253 | 0 | 287,104 | 925 | 3.2 | 6.4 | 80.3 | 86.7 | 0.00 | 0.34 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 39 | 5 | 28,810 | 0 | 47,545 | 0 | 641,152 | 1,769 | 3.2 | 6.3 | 131.7 | 138.0 | 0.00 | 0.44 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Screenshots (click by x,y) | 3 | success | 1 | 80 | 0 | 1,389 | 14 | 35,580 | 0 | 239,744 | 2,760 | 3.2 | 6.3 | 118.1 | 124.4 | 0.00 | 0.30 | Receipt B-8228; total charged €101.29. |
| `llf-basket-on` | Mantis | 1 | success | 1 | 21 | 0 | 6,189 | 0 | 23,340 | 0 | 311,296 | 1,224 | 3.4 | 3.4 | 187.7 | 191.1 | 0.00 | 0.30 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 24 | 6 | 13,949 | 0 | 24,252 | 0 | 257,536 | 1,149 | 3.7 | 2.5 | 166.8 | 169.3 | 0.00 | 0.35 | full terminal ledger differs from expected state |
| `llf-basket-on` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 24 | 0 | 403 | 8 | 20,863 | 0 | 180,224 | 1,644 | 3.7 | 3.1 | 173.6 | 176.8 | 0.00 | 0.31 | workflow is incomplete or still pending |
| `llf-basket-on` | Mantis | 2 | wrong_answer | 1 | 14 | 0 | 4,939 | 0 | 26,505 | 0 | 193,152 | 702 | 3.7 | 2.6 | 118.2 | 120.8 | 0.00 | 0.33 | full terminal ledger differs from expected state |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 2 | wrong_answer | 1 | 25 | 6 | 15,003 | 0 | 38,586 | 0 | 270,592 | 1,253 | 3.2 | 6.6 | 82.0 | 88.7 | 0.00 | 0.32 | workflow is incomplete or still pending |
| `llf-basket-on` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 12 | 0 | 338 | 5 | 38,706 | 0 | 153,216 | 1,105 | 3.4 | 6.5 | 48.9 | 55.4 | 0.00 | 0.36 | workflow is incomplete or still pending |
| `llf-basket-on` | Mantis | 3 | success | 1 | 20 | 0 | 6,279 | 0 | 19,743 | 0 | 311,040 | 881 | 3.8 | 3.3 | 158.8 | 162.0 | 0.00 | 0.33 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 22 | 6 | 12,630 | 0 | 42,220 | 0 | 228,224 | 984 | 3.6 | 6.7 | 64.5 | 71.2 | 0.00 | 0.33 | workflow is incomplete or still pending |
| `llf-basket-on` | Screenshots (click by x,y) | 3 | success | 1 | 71 | 0 | 1,151 | 18 | 51,069 | 0 | 311,040 | 2,976 | 3.6 | 6.1 | 150.0 | 156.1 | 0.00 | 0.34 | Receipt B-8228; total charged €101.29 |
| `llf-access-off` | Mantis | 1 | success | 1 | 35 | 0 | 27,340 | 0 | 29,738 | 0 | 475,648 | 1,586 | 3.9 | 2.7 | 187.4 | 190.1 | 0.00 | 0.34 | A-5340 |
| `llf-access-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 45 | 2 | 74,308 | 0 | 43,675 | 0 | 597,120 | 1,495 | 3.6 | 6.6 | 123.1 | 129.6 | 0.00 | 0.35 | A-5340 |
| `llf-access-off` | Screenshots (click by x,y) | 1 | success | 1 | 82 | 0 | 1,333 | 23 | 68,602 | 0 | 1,734,912 | 6,205 | 3.6 | 6.8 | 302.5 | 309.3 | 0.00 | 0.17 | A-5340 |
| `llf-access-off` | Mantis | 2 | success | 1 | 34 | 1 | 30,550 | 0 | 40,207 | 0 | 488,576 | 1,358 | 3.6 | 6.8 | 103.2 | 110.0 | 0.00 | 0.29 | A-5340 |
| `llf-access-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 44 | 2 | 65,558 | 0 | 70,617 | 0 | 761,216 | 1,666 | 3.6 | 6.6 | 129.4 | 135.9 | 0.00 | 0.34 | A-5340 |
| `llf-access-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 25 | 0 | 434 | 8 | 37,339 | 0 | 176,384 | 1,357 | 3.6 | 6.8 | 62.2 | 69.0 | 0.00 | 0.41 | workflow is incomplete or still pending |
| `llf-access-off` | Mantis | 3 | success | 1 | 32 | 0 | 21,056 | 0 | 40,363 | 0 | 494,080 | 1,210 | 3.6 | 6.5 | 104.7 | 111.2 | 0.00 | 0.35 | A-5340 |
| `llf-access-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 44 | 2 | 66,465 | 0 | 48,845 | 0 | 571,776 | 1,510 | 3.6 | 7.1 | 127.3 | 134.4 | 0.00 | 0.33 | A-5340 |
| `llf-access-off` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 81 | 0 | 1,370 | 23 | 49,377 | 0 | 1,459,456 | 4,404 | 3.6 | 7.1 | 278.9 | 286.0 | 0.00 | 0.29 | full terminal ledger differs from expected state |
| `llf-access-on` | Mantis | 1 | success | 1 | 49 | 0 | 15,277 | 0 | 39,364 | 0 | 310,912 | 1,356 | 3.6 | 6.9 | 96.6 | 103.5 | 0.00 | 0.33 | A-5340 |
| `llf-access-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 45 | 1 | 45,846 | 0 | 77,986 | 0 | 981,632 | 1,704 | 3.6 | 6.5 | 164.5 | 170.9 | 0.00 | 0.33 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 86 | 0 | 1,345 | 25 | 54,122 | 0 | 707,456 | 4,013 | 4.9 | 2.8 | 530.4 | 533.2 | 0.00 | 0.45 | full terminal ledger differs from expected state |
| `llf-access-on` | Mantis | 2 | success | 1 | 33 | 0 | 27,444 | 0 | 55,425 | 0 | 460,160 | 1,300 | 3.6 | 7.1 | 91.1 | 98.2 | 0.00 | 0.36 | A-5340 |
| `llf-access-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 44 | 2 | 29,608 | 0 | 45,415 | 0 | 724,096 | 1,757 | 3.6 | 7.0 | 154.1 | 161.2 | 0.00 | 0.38 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 48 | 0 | 816 | 12 | 38,046 | 0 | 220,288 | 2,009 | 3.7 | 6.9 | 97.9 | 104.8 | 0.00 | 0.37 | workflow is incomplete or still pending |
| `llf-access-on` | Mantis | 3 | success | 1 | 36 | 0 | 11,365 | 0 | 46,102 | 0 | 347,264 | 1,456 | 3.7 | 6.9 | 118.0 | 124.9 | 0.00 | 0.36 | A-5340 |
| `llf-access-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 46 | 2 | 52,241 | 0 | 75,399 | 0 | 1,081,984 | 1,870 | 3.7 | 6.9 | 175.5 | 182.5 | 0.00 | 0.33 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 3 | success | 1 | 87 | 0 | 1,369 | 30 | 75,335 | 0 | 716,160 | 3,860 | 3.7 | 6.9 | 218.6 | 225.5 | 0.00 | 0.35 | A-5340 |
| `llf-suppliers-off` | Mantis | 1 | success | 1 | 18 | 0 | 5,211 | 0 | 29,543 | 0 | 250,624 | 734 | 3.7 | 6.8 | 52.8 | 59.5 | 0.00 | 0.33 | Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 19 | 0 | 12,615 | 0 | 29,296 | 0 | 212,096 | 714 | 3.7 | 6.8 | 55.1 | 62.0 | 0.00 | 0.34 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-off` | Screenshots (click by x,y) | 1 | success | 1 | 37 | 0 | 623 | 15 | 57,957 | 0 | 584,960 | 2,618 | 3.6 | 6.7 | 177.2 | 183.9 | 0.00 | 0.40 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-off` | Mantis | 2 | success | 1 | 17 | 0 | 4,983 | 0 | 14,755 | 0 | 265,600 | 754 | 3.9 | 6.5 | 41.8 | 48.2 | 0.00 | 0.39 | Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 20 | 0 | 13,958 | 0 | 25,697 | 0 | 173,440 | 595 | 4.0 | 6.3 | 53.8 | 60.1 | 0.00 | 0.47 | Q-4293; EUR 870.00 |
| `llf-suppliers-off` | Screenshots (click by x,y) | 2 | success | 1 | 34 | 0 | 549 | 13 | 39,429 | 0 | 506,368 | 2,454 | 2.0 | 0.7 | 189.4 | 190.1 | 0.00 | 0.27 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-off` | Mantis | 3 | success | 2 | 18 | 0 | 5,351 | 0 | unknown | unknown | unknown | unknown | 4.0 | 0.9 | 272.1 | 273.1 | 0.00 | 0.69 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 20 | 0 | 14,400 | 0 | 30,085 | 0 | 259,968 | 711 | 2.0 | 0.5 | 67.7 | 68.2 | 0.00 | 0.39 | Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Screenshots (click by x,y) | 3 | success | 1 | 45 | 0 | 715 | 19 | 40,209 | 0 | 797,440 | 3,471 | 2.0 | 0.7 | 103.8 | 104.4 | 0.00 | 0.31 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Mantis | 1 | success | 1 | 24 | 0 | 10,271 | 0 | 23,908 | 0 | 366,720 | 1,149 | 2.0 | 0.6 | 48.6 | 49.2 | 0.00 | 0.42 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 24 | 1 | 19,811 | 0 | 41,672 | 0 | 366,208 | 932 | 2.1 | 1.3 | 58.6 | 59.9 | 0.00 | 0.33 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Screenshots (click by x,y) | 1 | success | 1 | 51 | 0 | 739 | 20 | 44,979 | 0 | 508,544 | 2,831 | 2.1 | 0.8 | 83.7 | 84.6 | 0.00 | 0.32 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Mantis | 2 | success | 1 | 23 | 0 | 9,818 | 0 | 31,662 | 0 | 338,944 | 950 | 2.0 | 0.5 | 50.6 | 51.1 | 0.00 | 0.42 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 26 | 2 | 21,247 | 0 | 30,424 | 0 | 416,768 | 995 | 2.0 | 0.5 | 59.2 | 59.7 | 0.00 | 0.34 | Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Screenshots (click by x,y) | 2 | success | 1 | 37 | 0 | 695 | 13 | 25,703 | 0 | 567,552 | 2,662 | 2.0 | 0.6 | 86.2 | 86.8 | 0.00 | 0.35 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Mantis | 3 | success | 1 | 20 | 0 | 9,040 | 0 | 30,862 | 0 | 294,784 | 1,014 | 2.0 | 0.4 | 45.7 | 46.2 | 0.00 | 0.42 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 24 | 1 | 19,811 | 0 | 28,355 | 0 | 380,800 | 1,067 | 2.0 | 0.4 | 59.7 | 60.1 | 0.00 | 0.37 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Screenshots (click by x,y) | 3 | success | 1 | 41 | 0 | 647 | 19 | 33,286 | 0 | 402,432 | 3,019 | 2.0 | 0.5 | 86.1 | 86.6 | 0.00 | 0.35 | Receipt Q-4293; EUR 870.00 |
| `llf-retention-off` | Mantis | 1 | success | 1 | 25 | 0 | 9,980 | 0 | 39,049 | 0 | 387,328 | 932 | 2.0 | 0.4 | 56.7 | 57.2 | 0.00 | 0.34 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 47 | 1 | 40,635 | 0 | 48,404 | 0 | 940,032 | 1,664 | 2.2 | 0.6 | 120.8 | 121.3 | 0.00 | 0.39 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 1 | success | 1 | 43 | 1 | 737 | 16 | 45,986 | 0 | 697,600 | 3,200 | 2.0 | 0.6 | 117.2 | 117.8 | 0.00 | 0.34 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | 1 | 25 | 0 | 9,612 | 0 | 23,900 | 0 | 386,432 | 1,022 | 3.1 | 0.7 | 55.9 | 56.6 | 0.00 | 0.43 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 48 | 2 | 41,201 | 0 | 70,454 | 0 | 941,184 | 1,705 | 2.0 | 1.6 | 143.5 | 145.1 | 0.00 | 0.32 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 62 | 0 | 891 | 28 | 52,138 | 0 | 1,200,000 | 4,755 | 2.3 | 2.5 | 177.3 | 179.8 | 0.00 | 0.30 | workflow is incomplete or still pending |
| `llf-retention-off` | Mantis | 3 | success | 1 | 27 | 0 | 10,522 | 0 | 41,255 | 0 | 371,200 | 992 | 2.4 | 0.7 | 61.0 | 61.7 | 0.00 | 0.46 | R-6635 |
| `llf-retention-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 51 | 5 | 41,970 | 0 | 56,071 | 0 | 1,038,848 | 1,833 | 2.0 | 0.6 | 130.6 | 131.2 | 0.00 | 0.46 | R-6635 |
| `llf-retention-off` | Screenshots (click by x,y) | 3 | success | 1 | 45 | 1 | 781 | 15 | 37,482 | 0 | 763,008 | 3,133 | 2.0 | 0.5 | 100.8 | 101.3 | 0.00 | 0.30 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | 1 | 33 | 0 | 14,720 | 0 | 45,948 | 0 | 420,608 | 1,212 | 2.3 | 4.2 | 62.6 | 66.8 | 0.00 | 0.47 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 47 | 3 | 38,306 | 0 | 61,540 | 0 | 909,824 | 1,701 | 3.0 | 2.3 | 112.6 | 114.9 | 0.00 | 0.40 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 47 | 0 | 855 | 18 | 43,395 | 0 | 839,808 | 3,795 | 4.1 | 0.7 | 125.6 | 126.3 | 0.00 | 0.42 | workflow is incomplete or still pending |
| `llf-retention-on` | Mantis | 2 | success | 1 | 27 | 0 | 10,328 | 0 | 24,396 | 0 | 421,760 | 1,145 | 2.2 | 0.7 | 60.6 | 61.3 | 0.00 | 0.40 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 44 | 3 | 36,351 | 0 | 47,317 | 0 | 843,136 | 1,538 | 2.0 | 0.5 | 139.9 | 140.4 | 0.00 | 0.39 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 2 | success | 1 | 53 | 1 | 828 | 21 | 35,032 | 0 | 611,200 | 3,598 | 3.0 | 0.6 | 99.7 | 100.3 | 0.00 | 0.33 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | 1 | 26 | 0 | 10,254 | 0 | 34,351 | 0 | 396,928 | 1,196 | 2.0 | 0.5 | 60.4 | 60.9 | 0.00 | 0.33 | R-6635 |
| `llf-retention-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 45 | 4 | 35,591 | 0 | 78,282 | 0 | 822,912 | 1,648 | 2.0 | 0.5 | 155.0 | 155.5 | 0.00 | 0.52 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 55 | 1 | 871 | 19 | 71,612 | 0 | 1,010,688 | 4,006 | 2.0 | 0.4 | 180.6 | 181.1 | 0.00 | 0.31 | workflow is incomplete or still pending |
| `llf-workspace-off` | Mantis | 1 | success | 1 | 19 | 0 | 5,739 | 0 | 19,123 | 0 | 295,808 | 952 | 2.0 | 0.4 | 46.7 | 47.1 | 0.00 | 0.36 | WS-3551 |
| `llf-workspace-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 32 | 1 | 18,451 | 0 | 29,842 | 0 | 507,392 | 1,536 | 2.9 | 0.6 | 84.5 | 85.1 | 0.00 | 0.34 | WS-3551 |
| `llf-workspace-off` | Screenshots (click by x,y) | 1 | success | 1 | 57 | 0 | 1,136 | 13 | 28,979 | 0 | 221,696 | 1,911 | 2.0 | 0.4 | 62.4 | 62.9 | 0.00 | 0.35 | WS-3551 |
| `llf-workspace-off` | Mantis | 2 | success | 1 | 19 | 0 | 6,171 | 0 | 22,317 | 0 | 294,528 | 955 | 3.9 | 0.7 | 42.2 | 42.9 | 0.00 | 0.37 | WS-3551 |
| `llf-workspace-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 28 | 0 | 16,611 | 0 | 28,967 | 0 | 434,688 | 1,390 | 2.7 | 0.6 | 70.3 | 70.9 | 0.00 | 0.34 | WS-3551 |
| `llf-workspace-off` | Screenshots (click by x,y) | 2 | success | 1 | 62 | 0 | 1,208 | 15 | 34,392 | 0 | 695,936 | 2,816 | 2.0 | 0.5 | 137.9 | 138.3 | 0.00 | 0.37 | WS-3551 |
| `llf-workspace-off` | Mantis | 3 | success | 1 | 20 | 0 | 6,173 | 0 | 26,947 | 0 | 304,512 | 978 | 2.0 | 3.0 | 50.0 | 53.0 | 0.00 | 0.45 | WS-3551 |
| `llf-workspace-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 30 | 0 | 18,092 | 0 | 43,532 | 0 | 457,216 | 1,414 | 2.0 | 0.5 | 84.9 | 85.4 | 0.00 | 0.33 | WS-3551 |
| `llf-workspace-off` | Screenshots (click by x,y) | 3 | success | 1 | 56 | 0 | 1,080 | 16 | 28,989 | 0 | 294,784 | 2,153 | 2.0 | 0.4 | 81.7 | 82.1 | 0.00 | 0.36 | WS-3551 |
| `llf-workspace-on` | Mantis | 1 | success | 1 | 23 | 0 | 6,163 | 0 | 38,272 | 0 | 350,208 | 1,103 | 2.9 | 1.8 | 60.7 | 62.5 | 0.00 | 0.34 | WS-3551 |
| `llf-workspace-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 36 | 3 | 18,524 | 0 | 28,561 | 0 | 210,816 | 1,348 | 3.1 | 0.6 | 63.7 | 64.2 | 0.00 | 0.30 | WS-3551 |
| `llf-workspace-on` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 102 | 2 | 2,111 | 22 | 52,640 | 0 | 462,848 | 3,867 | 2.0 | 0.5 | 144.7 | 145.2 | 0.00 | 0.38 | workflow is not settled |
| `llf-workspace-on` | Mantis | 2 | success | 1 | 24 | 0 | 6,140 | 0 | 22,145 | 0 | 398,848 | 1,284 | 2.0 | 0.4 | 66.8 | 67.3 | 0.00 | 0.32 | WS-3551 |
| `llf-workspace-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 32 | 0 | 19,802 | 0 | 32,175 | 0 | 512,000 | 1,446 | 2.0 | 0.5 | 97.2 | 97.7 | 0.00 | 0.35 | WS-3551 |
| `llf-workspace-on` | Screenshots (click by x,y) | 2 | success | 1 | 66 | 0 | 1,191 | 19 | 34,188 | 0 | 420,352 | 2,767 | 3.1 | 0.5 | 104.2 | 104.7 | 0.00 | 0.43 | WS-3551 |
| `llf-workspace-on` | Mantis | 3 | success | 1 | 20 | 0 | 6,159 | 0 | 19,554 | 0 | 311,936 | 982 | 2.0 | 0.5 | 62.0 | 62.5 | 0.00 | 0.27 | WS-3551 |
| `llf-workspace-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 29 | 0 | 16,852 | 0 | 22,836 | 0 | 457,984 | 1,453 | 2.0 | 0.6 | 76.8 | 77.4 | 0.00 | 0.36 | WS-3551 |
| `llf-workspace-on` | Screenshots (click by x,y) | 3 | success | 1 | 55 | 0 | 1,078 | 15 | 37,005 | 0 | 896,768 | 3,926 | 2.0 | 0.6 | 169.4 | 170.0 | 0.00 | 0.35 | WS-3551 |
| `llf-casework-off` | Mantis | 1 | success | 1 | 23 | 0 | 8,994 | 0 | 16,428 | 0 | 192,000 | 824 | 3.0 | 0.7 | 49.7 | 50.4 | 0.00 | 0.38 | CW-4013 |
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 42 | 1 | 41,784 | 0 | 65,770 | 0 | 826,240 | 1,627 | 2.0 | 0.6 | 119.2 | 119.8 | 0.00 | 0.43 | CW-4013 |
| `llf-casework-off` | Screenshots (click by x,y) | 1 | success | 1 | 52 | 0 | 936 | 21 | 49,106 | 0 | 967,680 | 3,280 | 3.0 | 3.3 | 154.0 | 157.4 | 0.00 | 0.46 | CW-4013 |
| `llf-casework-off` | Mantis | 2 | success | 1 | 24 | 0 | 9,696 | 0 | 19,414 | 0 | 252,800 | 862 | 3.2 | 0.8 | 56.7 | 57.6 | 0.00 | 0.34 | CW-4013 |
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 36 | 1 | 34,261 | 0 | 42,936 | 0 | 664,576 | 1,288 | 2.0 | 0.7 | 96.4 | 97.1 | 0.00 | 0.34 | CW-4013 |
| `llf-casework-off` | Screenshots (click by x,y) | 2 | success | 1 | 54 | 0 | 936 | 23 | 51,487 | 0 | 780,672 | 3,360 | 3.6 | 2.0 | 148.6 | 150.6 | 0.00 | 0.34 | CW-4013 |
| `llf-casework-off` | Mantis | 3 | success | 1 | 23 | 0 | 8,994 | 0 | 40,239 | 0 | 335,104 | 876 | 2.0 | 0.6 | 62.8 | 63.4 | 0.00 | 0.33 | CW-4013 |
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 35 | 0 | 34,168 | 0 | 28,772 | 0 | 336,896 | 1,169 | 3.0 | 0.7 | 71.6 | 72.2 | 0.00 | 0.49 | CW-4013 |
| `llf-casework-off` | Screenshots (click by x,y) | 3 | success | 1 | 45 | 0 | 960 | 13 | 46,764 | 0 | 706,048 | 3,080 | 2.9 | 1.9 | 133.2 | 135.1 | 0.00 | 0.34 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | 1 | 24 | 0 | 9,673 | 0 | 38,763 | 0 | 373,504 | 1,072 | 2.0 | 0.8 | 78.6 | 79.5 | 0.00 | 0.37 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 36 | 1 | 34,222 | 0 | 39,276 | 0 | 670,848 | 1,473 | 3.2 | 0.6 | 112.8 | 113.5 | 0.00 | 0.37 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 1 | success | 1 | 48 | 0 | 934 | 17 | 49,354 | 0 | 811,904 | 3,316 | 2.0 | 0.5 | 229.3 | 229.9 | 0.00 | 0.19 | CW-4013 |
| `llf-casework-on` | Mantis | 2 | success | 1 | 25 | 0 | 9,730 | 0 | 31,698 | 0 | 298,112 | 976 | 2.0 | 0.6 | 56.5 | 57.1 | 0.00 | 0.33 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 36 | 1 | 34,181 | 0 | 32,281 | 0 | 674,816 | 1,285 | 3.5 | 9.2 | 100.3 | 109.5 | 0.00 | 0.53 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 2 | success | 1 | 48 | 0 | 992 | 16 | 46,522 | 0 | 841,088 | 3,003 | 2.4 | 0.7 | 219.6 | 220.3 | 0.00 | 0.26 | CW-4013 |
| `llf-casework-on` | Mantis | 3 | success | 1 | 25 | 0 | 10,598 | 0 | 30,170 | 0 | 273,280 | 852 | 5.3 | 2.0 | 53.3 | 55.3 | 0.00 | 0.36 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 36 | 1 | 34,181 | 0 | 47,068 | 0 | 504,832 | 1,259 | 3.4 | 2.0 | 80.1 | 82.1 | 0.00 | 0.48 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 3 | success | 1 | 56 | 0 | 1,018 | 22 | 41,879 | 0 | 497,792 | 2,634 | 2.0 | 0.5 | 189.6 | 190.1 | 0.00 | 0.26 | CW-4013 |
| `llf-budgets-off` | Mantis | 1 | success | 1 | 17 | 0 | 4,871 | 0 | 46,859 | 0 | 219,008 | 858 | 2.0 | 0.7 | 54.5 | 55.2 | 0.00 | 0.46 | BG-4763 |
| `llf-budgets-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 25 | 0 | 15,836 | 0 | 45,883 | 0 | 364,416 | 1,293 | 2.0 | 0.4 | 75.9 | 76.3 | 0.00 | 0.35 | BG-4763 |
| `llf-budgets-off` | Screenshots (click by x,y) | 1 | success | 1 | 54 | 0 | 1,006 | 14 | 53,455 | 0 | 908,544 | 3,767 | 2.0 | 0.5 | 342.2 | 342.8 | 0.00 | 0.14 | BG-4763 |
| `llf-budgets-off` | Mantis | 2 | success | 1 | 20 | 0 | 5,539 | 0 | 26,293 | 0 | 288,128 | 1,121 | 2.0 | 0.4 | 72.0 | 72.4 | 0.00 | 0.34 | BG-4763 |
| `llf-budgets-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 24 | 0 | 14,391 | 0 | 38,896 | 0 | 346,880 | 1,232 | 2.0 | 0.5 | 87.9 | 88.4 | 0.00 | 0.34 | BG-4763 |
| `llf-budgets-off` | Screenshots (click by x,y) | 2 | success | 1 | 51 | 0 | 961 | 14 | 47,432 | 0 | 799,488 | 3,550 | 2.0 | 0.9 | 216.7 | 217.6 | 0.00 | 0.18 | BG-4763 |
| `llf-budgets-off` | Mantis | 3 | success | 1 | 17 | 0 | 4,871 | 0 | 20,253 | 0 | 246,400 | 908 | 4.2 | 0.8 | 54.6 | 55.5 | 0.00 | 0.52 | BG-4763 |
| `llf-budgets-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 25 | 0 | 14,605 | 0 | 35,679 | 0 | 368,256 | 1,282 | 2.1 | 0.8 | 88.5 | 89.3 | 0.00 | 0.30 | BG-4763 |
| `llf-budgets-off` | Screenshots (click by x,y) | 3 | success | 1 | 50 | 0 | 937 | 14 | 27,114 | 0 | 258,304 | 2,427 | 2.0 | 0.6 | 136.4 | 137.0 | 0.00 | 0.34 | BG-4763 |
| `llf-budgets-on` | Mantis | 1 | success | 1 | 18 | 0 | 5,192 | 0 | 18,735 | 0 | 262,528 | 851 | 2.0 | 0.7 | 59.1 | 59.7 | 0.00 | 0.36 | BG-4763 |
| `llf-budgets-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 25 | 0 | 15,804 | 0 | 26,239 | 0 | 384,512 | 1,315 | 2.1 | 0.6 | 116.7 | 117.4 | 0.00 | 0.32 | BG-4763 |
| `llf-budgets-on` | Screenshots (click by x,y) | 1 | success | 1 | 60 | 0 | 1,203 | 15 | 42,444 | 0 | 370,048 | 2,636 | 2.0 | 0.6 | 148.8 | 149.4 | 0.00 | 0.29 | BG-4763 |
| `llf-budgets-on` | Mantis | 2 | success | 1 | 18 | 0 | 5,224 | 0 | 18,303 | 0 | 262,656 | 851 | 2.1 | 0.8 | 54.5 | 55.3 | 0.00 | 0.36 | BG-4763 |
| `llf-budgets-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 25 | 0 | 14,574 | 0 | 35,715 | 0 | 366,848 | 1,194 | 2.0 | 0.6 | 120.6 | 121.1 | 0.00 | 0.45 | BG-4763 |
| `llf-budgets-on` | Screenshots (click by x,y) | 2 | success | 1 | 67 | 4 | 1,771 | 16 | 30,364 | 0 | 316,032 | 2,634 | 2.0 | 0.7 | 165.8 | 166.5 | 0.00 | 0.31 | BG-4763 |
| `llf-budgets-on` | Mantis | 3 | success | 1 | 18 | 0 | 5,224 | 0 | 31,802 | 0 | 249,088 | 829 | 3.7 | 0.6 | 52.7 | 53.3 | 0.00 | 0.54 | BG-4763 |
| `llf-budgets-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 26 | 1 | 15,896 | 0 | 35,419 | 0 | 392,704 | 1,316 | 2.0 | 0.5 | 111.9 | 112.4 | 0.00 | 0.34 | BG-4763 |
| `llf-budgets-on` | Screenshots (click by x,y) | 3 | success | 1 | 53 | 0 | 997 | 14 | 62,693 | 0 | 825,856 | 3,604 | 2.0 | 0.6 | 202.7 | 203.3 | 0.00 | 0.17 | BG-4763 |
| `llf-dispatch-off` | Mantis | 1 | success | 1 | 35 | 0 | 6,889 | 0 | 41,940 | 0 | 519,808 | 1,380 | 2.0 | 0.5 | 129.6 | 130.1 | 0.00 | 0.30 | DP-1635 |
| `llf-dispatch-off` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 36 | 1 | 18,185 | 0 | 43,163 | 0 | 563,712 | 1,634 | 3.0 | 0.7 | 129.4 | 130.1 | 0.00 | 0.27 | DP-1635 |
| `llf-dispatch-off` | Screenshots (click by x,y) | 1 | success | 1 | 84 | 0 | 1,527 | 21 | 43,082 | 0 | 518,144 | 4,862 | 2.0 | 0.5 | 178.2 | 178.7 | 0.00 | 0.18 | DP-1635 |
| `llf-dispatch-off` | Mantis | 2 | success | 1 | 35 | 0 | 6,921 | 0 | 25,538 | 0 | 552,448 | 1,412 | 2.9 | 0.6 | 161.7 | 162.3 | 0.00 | 0.18 | DP-1635 |
| `llf-dispatch-off` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 36 | 1 | 18,185 | 0 | 39,655 | 0 | 566,528 | 1,653 | 2.0 | 0.5 | 141.6 | 142.1 | 0.00 | 0.25 | DP-1635 |
| `llf-dispatch-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 34 | 0 | 608 | 10 | 24,092 | 0 | 219,392 | 2,243 | 3.4 | 0.7 | 99.0 | 99.6 | 0.00 | 0.28 | workflow is not settled |
| `llf-dispatch-off` | Mantis | 3 | success | 1 | 36 | 0 | 7,640 | 0 | 40,955 | 0 | 414,976 | 1,393 | 2.0 | 0.6 | 123.9 | 124.5 | 0.00 | 0.25 | DP-1635 |
| `llf-dispatch-off` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 43 | 0 | 20,197 | 0 | 54,056 | 0 | 474,112 | 1,591 | 2.0 | 0.5 | 135.2 | 135.7 | 0.00 | 0.23 | DP-1635 |
| `llf-dispatch-off` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 32 | 0 | 688 | 10 | 39,715 | 0 | 220,800 | 1,622 | 2.0 | 0.7 | 106.1 | 106.7 | 0.00 | 0.24 | workflow is not settled |
| `llf-dispatch-on` | Mantis | 1 | success | 1 | 25 | 0 | 6,225 | 0 | 39,088 | 0 | 348,544 | 1,070 | 2.0 | 0.5 | 126.1 | 126.7 | 0.00 | 0.21 | DP-1635 |
| `llf-dispatch-on` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 43 | 0 | 20,161 | 0 | 53,112 | 0 | 690,816 | 1,807 | 2.0 | 0.6 | 148.8 | 149.4 | 0.00 | 0.20 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 1 | success | 1 | 73 | 0 | 1,296 | 20 | 74,029 | 0 | 1,379,072 | 3,760 | 2.0 | 0.6 | 202.7 | 203.3 | 0.00 | 0.18 | DP-1635 |
| `llf-dispatch-on` | Mantis | 2 | success | 1 | 34 | 0 | 6,741 | 0 | 40,018 | 0 | 415,616 | 1,368 | 2.0 | 0.7 | 106.2 | 106.9 | 0.00 | 0.19 | DP-1635 |
| `llf-dispatch-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 43 | 0 | 20,161 | 0 | 40,773 | 0 | 703,104 | 1,794 | 2.0 | 0.5 | 124.2 | 124.7 | 0.00 | 0.22 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 10 | 0 | 250 | 5 | 18,608 | 0 | 131,840 | 997 | 2.0 | 0.6 | 64.8 | 65.4 | 0.00 | 0.24 | workflow is not settled |
| `llf-dispatch-on` | Mantis | 3 | success | 1 | 33 | 0 | 6,273 | 0 | 24,229 | 0 | 518,528 | 1,380 | 2.0 | 0.8 | 103.5 | 104.2 | 0.00 | 0.18 | DP-1635 |
| `llf-dispatch-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 45 | 0 | 21,380 | 0 | 44,318 | 0 | 739,328 | 1,735 | 3.1 | 0.7 | 135.0 | 135.7 | 0.00 | 0.15 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 93 | 0 | 1,552 | 27 | 29,448 | 0 | 517,504 | 3,395 | 2.0 | 0.5 | 140.9 | 141.5 | 0.00 | 0.15 | answer did not match the expected result |
