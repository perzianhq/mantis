# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 19 runs in parallel.
- Scope: 19 exact recovery rows = 19 logical runs; 19 recorded so far; 19 total attempts including retries.
- Exact rows: `llf-basket-off|screenshot|2`, `llf-basket-on|tree|1`, `llf-basket-on|screenshot|1`, `llf-basket-on|mantis|2`, `llf-basket-on|tree|2`, `llf-basket-on|screenshot|2`, `llf-basket-on|tree|3`, `llf-access-off|screenshot|2`, `llf-access-off|screenshot|3`, `llf-access-on|screenshot|1`, `llf-access-on|screenshot|2`, `llf-retention-off|screenshot|2`, `llf-retention-on|screenshot|1`, `llf-retention-on|screenshot|3`, `llf-workspace-on|screenshot|1`, `llf-dispatch-off|screenshot|2`, `llf-dispatch-off|screenshot|3`, `llf-dispatch-on|screenshot|2`, `llf-dispatch-on|screenshot|3`.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 1 / 1 | 2 / 3 | 11 / 15 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 1 | 4 |
| Tool calls (including retries) | 18 | 102 | 972 |
| MCP tool errors (including retries) | 0 | 17 | 7 |
| Browser observation text (observed chars) | 5,936 | 72,676 | 18,549 |
| Browser observation images (observed blocks) | 0 | 0 | 282 |
| Normal input tokens (total) | 42,389 | 144,979 | 806,599 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 163,328 | 1,108,736 | 8,448,256 |
| Output tokens (total) | 897 | 4,302 | 51,325 |
| Total input tokens incl. cache (legacy) | 205,717 | 1,253,715 | 9,254,855 |
| MCP startup (total, s) | 2.6 | 7.7 | 44.1 |
| CLI startup (total, s) | 2.1 | 7.0 | 45.7 |
| CLI execution (total, s) | 29.8 | 167.4 | 1283.6 |
| CLI wall (total, s) | 31.9 | 174.3 | 1329.3 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.7 | 3.0 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Screenshots (click by x,y) | 2 | success | 1 | 70 | 0 | 1,153 | 16 | 49,250 | 0 | 332,928 | 3,259 | 2.3 | 3.3 | 69.5 | 72.8 | 0.00 | 0.21 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 1 | wrong_answer | 1 | 28 | 4 | 20,154 | 0 | 63,410 | 0 | 369,280 | 1,261 | 2.5 | 2.3 | 59.4 | 61.7 | 0.00 | 0.24 | full terminal ledger differs from expected state |
| `llf-basket-on` | Screenshots (click by x,y) | 1 | success | 1 | 66 | 0 | 1,075 | 17 | 66,281 | 0 | 298,624 | 2,614 | 2.5 | 2.6 | 72.8 | 75.5 | 0.00 | 0.21 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | 1 | 18 | 0 | 5,936 | 0 | 42,389 | 0 | 163,328 | 897 | 2.6 | 2.1 | 29.8 | 31.9 | 0.00 | 0.32 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 38 | 8 | 24,052 | 0 | 41,034 | 0 | 448,128 | 1,645 | 2.6 | 2.4 | 61.7 | 64.1 | 0.00 | 0.22 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Screenshots (click by x,y) | 2 | success | 1 | 67 | 0 | 1,099 | 17 | 45,565 | 0 | 348,288 | 3,522 | 2.6 | 2.7 | 68.3 | 71.0 | 0.00 | 0.23 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 36 | 5 | 28,470 | 0 | 40,535 | 0 | 291,328 | 1,396 | 2.6 | 2.3 | 46.2 | 48.5 | 0.00 | 0.25 | Receipt B-8228; total charged €101.29 |
| `llf-access-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 28 | 0 | 468 | 9 | 34,011 | 0 | 198,528 | 1,500 | 2.7 | 3.2 | 43.5 | 46.7 | 0.00 | 0.27 | workflow is incomplete or still pending |
| `llf-access-off` | Screenshots (click by x,y) | 3 | success | 1 | 86 | 0 | 1,412 | 20 | 62,219 | 0 | 523,008 | 3,443 | 2.8 | 3.1 | 92.2 | 95.3 | 0.00 | 0.18 | A-5340 |
| `llf-access-on` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 80 | 0 | 1,194 | 24 | 60,880 | 0 | 477,568 | 5,351 | 2.8 | 4.1 | 91.6 | 95.6 | 0.00 | 0.17 | full terminal ledger differs from expected state |
| `llf-access-on` | Screenshots (click by x,y) | 2 | success | 1 | 88 | 0 | 1,291 | 33 | 47,846 | 0 | 857,856 | 4,119 | 2.8 | 3.5 | 98.6 | 102.1 | 0.00 | 0.15 | A-5340 |
| `llf-retention-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 50 | 0 | 921 | 20 | 54,564 | 0 | 838,528 | 3,844 | 3.0 | 2.5 | 97.0 | 99.5 | 0.00 | 0.21 | workflow is incomplete or still pending |
| `llf-retention-on` | Screenshots (click by x,y) | 1 | success | 1 | 46 | 1 | 779 | 15 | 70,447 | 0 | 709,760 | 3,180 | 3.0 | 2.7 | 89.3 | 92.0 | 0.00 | 0.18 | R-6635 |
| `llf-retention-on` | Screenshots (click by x,y) | 3 | success | 1 | 51 | 1 | 805 | 20 | 99,155 | 0 | 883,200 | 3,737 | 3.1 | 2.9 | 107.9 | 110.9 | 0.00 | 0.16 | R-6635 |
| `llf-workspace-on` | Screenshots (click by x,y) | 1 | success | 1 | 76 | 5 | 3,061 | 11 | 22,907 | 0 | 180,352 | 1,816 | 3.2 | 3.4 | 53.9 | 57.3 | 0.00 | 0.26 | WS-3551 |
| `llf-dispatch-off` | Screenshots (click by x,y) | 2 | wrong_answer | 1 | 21 | 0 | 511 | 7 | 25,895 | 0 | 184,576 | 1,122 | 3.3 | 3.4 | 37.6 | 41.0 | 0.00 | 0.27 | workflow is not settled |
| `llf-dispatch-off` | Screenshots (click by x,y) | 3 | success | 1 | 71 | 0 | 1,266 | 21 | 83,159 | 0 | 1,270,528 | 4,833 | 3.4 | 2.2 | 147.9 | 150.1 | 0.00 | 0.14 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 2 | success | 1 | 82 | 0 | 1,935 | 24 | 45,941 | 0 | 492,672 | 4,234 | 3.4 | 3.4 | 90.9 | 94.3 | 0.00 | 0.17 | DP-1635 |
| `llf-dispatch-on` | Screenshots (click by x,y) | 3 | success | 1 | 90 | 0 | 1,579 | 28 | 38,479 | 0 | 851,840 | 4,751 | 3.4 | 2.7 | 122.7 | 125.4 | 0.00 | 0.16 | DP-1635 |
