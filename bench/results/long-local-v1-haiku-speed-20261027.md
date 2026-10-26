# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-26; runs per task and approach: 3; 4 runs in parallel.
- Scope: 16 tasks × 1 approaches × 3 runs = 48 logical runs; 48 recorded so far; 48 total attempts including retries.
- Claude runtime: 2.1.310 (Claude Code); resolved model(s): claude-haiku-5-5.
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
| Tool calls (including retries) | 1,277 |
| MCP tool errors (including retries) | 8 |
| Browser observation text (observed chars) | 686,050 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,774 |
| Cache-write input tokens (total) | 669,956 |
| Cache-read input tokens (total) | 11,814,113 |
| Output tokens (total) | 101,016 |
| Total input tokens incl. cache (legacy) | 12,485,843 |
| MCP startup (total, s) | 101.8 |
| CLI startup (total, s) | 106.6 |
| CLI execution (total, s) | 1763.4 |
| CLI wall (total, s) | 1870.0 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 14.7 |
| Harness capture (total, s) | 0.0 |
| Cost estimate (USD; including retries) | 0.30 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 8,569 | 0 | 38 | 10,922 | 219,846 | 2,087 | 2.0 | 2.8 | 36.7 | 39.5 | 0.00 | 0.25 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 20 | 0 | 8,271 | 0 | 32 | 10,755 | 175,857 | 2,139 | 2.0 | 2.8 | 33.0 | 35.9 | 0.00 | 0.38 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 8,299 | 0 | 36 | 10,365 | 198,305 | 1,749 | 2.1 | 2.8 | 27.8 | 30.6 | 0.00 | 0.25 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 11,489 | 0 | 44 | 13,509 | 273,921 | 2,984 | 2.1 | 2.8 | 48.6 | 51.4 | 0.00 | 0.31 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 10,125 | 0 | 48 | 12,128 | 289,024 | 2,452 | 2.0 | 1.7 | 45.7 | 47.4 | 0.00 | 0.46 | Receipt B-8228, total charged €101.29 |
| `llf-basket-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 9,024 | 0 | 36 | 11,392 | 207,378 | 2,258 | 2.0 | 2.1 | 36.3 | 38.5 | 0.00 | 0.22 | Receipt B-8228, total charged €101.29 |
| `llf-access-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 38 | 0 | 38,903 | 0 | 54 | 30,313 | 602,032 | 3,608 | 2.0 | 2.7 | 55.4 | 58.1 | 0.00 | 0.23 | Receipt A-5340 |
| `llf-access-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 33,795 | 0 | 40 | 26,707 | 372,155 | 3,288 | 2.0 | 2.0 | 35.9 | 37.9 | 0.00 | 0.32 | A-5340 |
| `llf-access-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 31 | 0 | 34,064 | 0 | 42 | 27,694 | 409,419 | 4,054 | 2.0 | 2.4 | 50.8 | 53.2 | 0.00 | 0.27 | A-5340 |
| `llf-access-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 31 | 0 | 34,016 | 0 | 44 | 26,899 | 426,526 | 3,292 | 2.0 | 2.3 | 52.0 | 54.3 | 0.00 | 0.38 | A-5340 |
| `llf-access-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 33,862 | 0 | 44 | 27,055 | 430,036 | 3,634 | 2.0 | 1.9 | 47.9 | 49.8 | 0.00 | 0.44 | A-5340 |
| `llf-access-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 52 | 0 | 49,780 | 0 | 56 | 38,387 | 707,690 | 4,967 | 2.0 | 2.3 | 64.1 | 66.3 | 0.00 | 0.48 | A-5340 |
| `llf-suppliers-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 14 | 0 | 4,487 | 0 | 22 | 7,135 | 102,092 | 1,003 | 2.0 | 1.9 | 22.9 | 24.8 | 0.00 | 0.41 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 4,474 | 0 | 22 | 7,364 | 103,443 | 1,127 | 2.0 | 1.9 | 21.9 | 23.9 | 0.00 | 0.33 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,223 | 0 | 24 | 7,721 | 115,421 | 1,144 | 2.0 | 2.0 | 22.4 | 24.4 | 0.00 | 0.30 | Receipt Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 2 | 7,242 | 0 | 32 | 8,807 | 164,582 | 1,316 | 2.0 | 2.2 | 29.1 | 31.3 | 0.00 | 0.33 | Receipt Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 2 | 7,479 | 0 | 32 | 8,968 | 165,950 | 1,334 | 2.2 | 3.0 | 32.1 | 35.1 | 0.00 | 0.38 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 2 | 6,732 | 0 | 30 | 8,428 | 151,738 | 1,113 | 2.5 | 2.2 | 26.2 | 28.5 | 0.00 | 0.29 | Receipt Q-4293 · EUR 870.00 |
| `llf-retention-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 43 | 0 | 20,737 | 0 | 50 | 17,673 | 357,230 | 2,541 | 2.0 | 2.2 | 52.7 | 54.9 | 0.00 | 0.22 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 15,864 | 0 | 46 | 14,370 | 292,705 | 2,109 | 2.0 | 2.0 | 44.1 | 46.1 | 0.00 | 0.23 | R-6635 |
| `llf-retention-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 42 | 0 | 20,724 | 0 | 48 | 17,408 | 338,997 | 2,334 | 2.0 | 1.9 | 44.4 | 46.3 | 0.00 | 0.40 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 44 | 0 | 21,562 | 0 | 48 | 17,928 | 349,141 | 2,241 | 2.0 | 2.2 | 46.0 | 48.1 | 0.00 | 0.28 | R-6635 |
| `llf-retention-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 44 | 0 | 21,540 | 0 | 48 | 17,927 | 349,345 | 2,292 | 2.2 | 1.9 | 53.4 | 55.4 | 0.00 | 0.22 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 39 | 0 | 18,623 | 0 | 46 | 16,024 | 301,956 | 2,060 | 2.0 | 1.5 | 43.0 | 44.5 | 0.00 | 0.38 | R-6635 |
| `llf-workspace-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 7,116 | 0 | 30 | 9,576 | 163,851 | 1,845 | 2.1 | 2.0 | 29.9 | 31.9 | 0.00 | 0.20 | WS-3551 |
| `llf-workspace-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 21 | 1 | 7,012 | 0 | 32 | 9,335 | 169,871 | 1,623 | 2.0 | 2.8 | 27.6 | 30.4 | 0.00 | 0.24 | WS-3551 |
| `llf-workspace-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 7,193 | 0 | 28 | 9,451 | 146,311 | 1,566 | 2.7 | 1.8 | 28.4 | 30.2 | 0.00 | 0.23 | WS-3551 |
| `llf-workspace-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 7,171 | 0 | 34 | 9,582 | 182,264 | 1,870 | 2.1 | 2.8 | 34.1 | 36.9 | 0.00 | 0.26 | WS-3551 |
| `llf-workspace-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 7,809 | 0 | 38 | 9,960 | 216,447 | 1,807 | 2.9 | 2.2 | 31.3 | 33.5 | 0.00 | 0.20 | WS-3551 |
| `llf-workspace-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 32 | 0 | 12,655 | 0 | 28 | 12,913 | 162,617 | 2,116 | 2.0 | 2.5 | 34.2 | 36.6 | 0.00 | 0.33 | WS-3551 |
| `llf-casework-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 16,679 | 0 | 40 | 14,390 | 265,554 | 2,013 | 2.0 | 2.0 | 38.9 | 40.9 | 0.00 | 0.22 | CW-4013 |
| `llf-casework-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 15,545 | 0 | 38 | 13,678 | 244,382 | 1,916 | 2.1 | 2.2 | 42.2 | 44.4 | 0.00 | 0.25 | CW-4013 |
| `llf-casework-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 14,381 | 0 | 38 | 13,137 | 233,716 | 1,952 | 2.2 | 2.8 | 36.4 | 39.2 | 0.00 | 0.23 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 14,399 | 0 | 38 | 13,072 | 234,991 | 1,798 | 2.4 | 2.0 | 29.9 | 31.9 | 0.00 | 0.33 | CW-4013 |
| `llf-casework-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 1 | 14,952 | 0 | 40 | 13,393 | 249,624 | 1,842 | 2.8 | 2.0 | 38.8 | 40.7 | 0.00 | 0.31 | CW-4013 |
| `llf-casework-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 14,342 | 0 | 38 | 13,091 | 233,188 | 1,903 | 2.0 | 1.9 | 40.2 | 42.1 | 0.00 | 0.28 | CW-4013 |
| `llf-budgets-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,190 | 0 | 24 | 8,196 | 116,469 | 1,342 | 2.0 | 2.8 | 22.0 | 24.8 | 0.00 | 0.25 | BG-4763 |
| `llf-budgets-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,190 | 0 | 24 | 8,075 | 115,872 | 1,224 | 2.1 | 2.1 | 24.7 | 26.8 | 0.00 | 0.34 | BG-4763 |
| `llf-budgets-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,190 | 0 | 24 | 8,133 | 116,355 | 1,279 | 2.1 | 1.8 | 22.0 | 23.8 | 0.00 | 0.47 | BG-4763 |
| `llf-budgets-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,576 | 0 | 26 | 8,482 | 128,260 | 1,504 | 2.0 | 2.9 | 29.5 | 32.5 | 0.00 | 0.43 | BG-4763 |
| `llf-budgets-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 7,340 | 0 | 28 | 9,696 | 150,389 | 1,569 | 2.0 | 2.2 | 27.9 | 30.1 | 0.00 | 0.22 | BG-4763 |
| `llf-budgets-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,178 | 0 | 24 | 8,069 | 116,041 | 1,259 | 2.1 | 2.3 | 22.9 | 25.2 | 0.00 | 0.30 | BG-4763 |
| `llf-dispatch-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 10,640 | 0 | 34 | 12,489 | 199,075 | 2,395 | 2.0 | 1.8 | 33.0 | 34.7 | 0.00 | 0.22 | DP-1635 |
| `llf-dispatch-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 42 | 0 | 16,849 | 0 | 44 | 16,093 | 290,099 | 2,517 | 2.5 | 2.2 | 43.4 | 45.6 | 0.00 | 0.38 | DP-1635 |
| `llf-dispatch-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 35 | 0 | 13,145 | 0 | 36 | 13,701 | 217,552 | 2,206 | 2.0 | 2.1 | 28.5 | 30.6 | 0.00 | 0.31 | DP-1635 |
| `llf-dispatch-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 10,284 | 0 | 44 | 11,580 | 251,253 | 2,023 | 2.1 | 2.3 | 42.4 | 44.6 | 0.00 | 0.29 | DP-1635 |
| `llf-dispatch-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 42 | 0 | 16,722 | 0 | 44 | 15,952 | 290,026 | 2,393 | 2.0 | 1.8 | 46.3 | 48.1 | 0.00 | 0.28 | DP-1635 |
| `llf-dispatch-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 10,608 | 0 | 38 | 12,033 | 215,117 | 1,928 | 2.0 | 2.0 | 36.5 | 38.5 | 0.00 | 0.31 | DP-1635 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | 1 | success | n/a | 1200 | 21 | 230,806 | 36.7 | 0.005 | unknown | known |
| `llf-basket-off` | Mantis | 2 | 1 | success | n/a | 1200 | 20 | 186,644 | 33.0 | 0.005 | unknown | known |
| `llf-basket-off` | Mantis | 3 | 1 | success | n/a | 1200 | 21 | 208,706 | 27.8 | 0.005 | unknown | known |
| `llf-basket-on` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 287,474 | 48.6 | 0.007 | unknown | known |
| `llf-basket-on` | Mantis | 2 | 1 | success | n/a | 1200 | 25 | 301,200 | 45.7 | 0.007 | unknown | known |
| `llf-basket-on` | Mantis | 3 | 1 | success | n/a | 1200 | 22 | 218,806 | 36.3 | 0.005 | unknown | known |
| `llf-access-off` | Mantis | 1 | 1 | success | n/a | 1200 | 38 | 632,399 | 55.4 | 0.014 | unknown | known |
| `llf-access-off` | Mantis | 2 | 1 | success | n/a | 1200 | 30 | 398,902 | 35.9 | 0.011 | unknown | known |
| `llf-access-off` | Mantis | 3 | 1 | success | n/a | 1200 | 31 | 437,155 | 50.8 | 0.012 | unknown | known |
| `llf-access-on` | Mantis | 1 | 1 | success | n/a | 1200 | 31 | 453,469 | 52.0 | 0.011 | unknown | known |
| `llf-access-on` | Mantis | 2 | 1 | success | n/a | 1200 | 30 | 457,135 | 47.9 | 0.012 | unknown | known |
| `llf-access-on` | Mantis | 3 | 1 | success | n/a | 1200 | 52 | 746,133 | 64.1 | 0.017 | unknown | known |
| `llf-suppliers-off` | Mantis | 1 | 1 | success | n/a | 1200 | 14 | 109,249 | 22.9 | 0.003 | unknown | known |
| `llf-suppliers-off` | Mantis | 2 | 1 | success | n/a | 1200 | 15 | 110,829 | 21.9 | 0.003 | unknown | known |
| `llf-suppliers-off` | Mantis | 3 | 1 | success | n/a | 1200 | 16 | 123,166 | 22.4 | 0.003 | unknown | known |
| `llf-suppliers-on` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 173,421 | 29.1 | 0.004 | unknown | known |
| `llf-suppliers-on` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 174,950 | 32.1 | 0.004 | unknown | known |
| `llf-suppliers-on` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 160,196 | 26.2 | 0.004 | unknown | known |
| `llf-retention-off` | Mantis | 1 | 1 | success | n/a | 1200 | 43 | 374,953 | 52.7 | 0.008 | unknown | known |
| `llf-retention-off` | Mantis | 2 | 1 | success | n/a | 1200 | 33 | 307,121 | 44.1 | 0.007 | unknown | known |
| `llf-retention-off` | Mantis | 3 | 1 | success | n/a | 1200 | 42 | 356,453 | 44.4 | 0.008 | unknown | known |
| `llf-retention-on` | Mantis | 1 | 1 | success | n/a | 1200 | 44 | 367,117 | 46.0 | 0.008 | unknown | known |
| `llf-retention-on` | Mantis | 2 | 1 | success | n/a | 1200 | 44 | 367,320 | 53.4 | 0.008 | unknown | known |
| `llf-retention-on` | Mantis | 3 | 1 | success | n/a | 1200 | 39 | 318,026 | 43.0 | 0.007 | unknown | known |
| `llf-workspace-off` | Mantis | 1 | 1 | success | n/a | 1200 | 22 | 173,457 | 29.9 | 0.004 | unknown | known |
| `llf-workspace-off` | Mantis | 2 | 1 | success | n/a | 1200 | 21 | 179,238 | 27.6 | 0.004 | unknown | known |
| `llf-workspace-off` | Mantis | 3 | 1 | success | n/a | 1200 | 21 | 155,790 | 28.4 | 0.004 | unknown | known |
| `llf-workspace-on` | Mantis | 1 | 1 | success | n/a | 1200 | 21 | 191,880 | 34.1 | 0.005 | unknown | known |
| `llf-workspace-on` | Mantis | 2 | 1 | success | n/a | 1200 | 23 | 226,445 | 31.3 | 0.005 | unknown | known |
| `llf-workspace-on` | Mantis | 3 | 1 | success | n/a | 1200 | 32 | 175,558 | 34.2 | 0.005 | unknown | known |
| `llf-casework-off` | Mantis | 1 | 1 | success | n/a | 1200 | 24 | 279,984 | 38.9 | 0.007 | unknown | known |
| `llf-casework-off` | Mantis | 2 | 1 | success | n/a | 1200 | 23 | 258,098 | 42.2 | 0.006 | unknown | known |
| `llf-casework-off` | Mantis | 3 | 1 | success | n/a | 1200 | 22 | 246,891 | 36.4 | 0.006 | unknown | known |
| `llf-casework-on` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 248,101 | 29.9 | 0.006 | unknown | known |
| `llf-casework-on` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 263,057 | 38.8 | 0.006 | unknown | known |
| `llf-casework-on` | Mantis | 3 | 1 | success | n/a | 1200 | 22 | 246,317 | 40.2 | 0.006 | unknown | known |
| `llf-budgets-off` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 124,689 | 22.0 | 0.003 | unknown | known |
| `llf-budgets-off` | Mantis | 2 | 1 | success | n/a | 1200 | 16 | 123,971 | 24.7 | 0.003 | unknown | known |
| `llf-budgets-off` | Mantis | 3 | 1 | success | n/a | 1200 | 16 | 124,512 | 22.0 | 0.003 | unknown | known |
| `llf-budgets-on` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 136,768 | 29.5 | 0.004 | unknown | known |
| `llf-budgets-on` | Mantis | 2 | 1 | success | n/a | 1200 | 21 | 160,113 | 27.9 | 0.004 | unknown | known |
| `llf-budgets-on` | Mantis | 3 | 1 | success | n/a | 1200 | 16 | 124,134 | 22.9 | 0.003 | unknown | known |
| `llf-dispatch-off` | Mantis | 1 | 1 | success | n/a | 1200 | 30 | 211,598 | 33.0 | 0.006 | unknown | known |
| `llf-dispatch-off` | Mantis | 2 | 1 | success | n/a | 1200 | 42 | 306,236 | 43.4 | 0.007 | unknown | known |
| `llf-dispatch-off` | Mantis | 3 | 1 | success | n/a | 1200 | 35 | 231,289 | 28.5 | 0.006 | unknown | known |
| `llf-dispatch-on` | Mantis | 1 | 1 | success | n/a | 1200 | 28 | 262,877 | 42.4 | 0.006 | unknown | known |
| `llf-dispatch-on` | Mantis | 2 | 1 | success | n/a | 1200 | 42 | 306,022 | 46.3 | 0.007 | unknown | known |
| `llf-dispatch-on` | Mantis | 3 | 1 | success | n/a | 1200 | 30 | 227,188 | 36.5 | 0.006 | unknown | known |
