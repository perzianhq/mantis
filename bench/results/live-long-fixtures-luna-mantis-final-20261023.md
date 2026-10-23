# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 12 runs in parallel.
- Scope: 16 tasks × 1 approaches × 3 runs = 48 logical runs; 48 recorded so far; 48 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
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
| Tool calls (including retries) | 1,095 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 396,563 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,257,862 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 15,322,624 |
| Output tokens (total) | 47,256 |
| Total input tokens incl. cache (legacy) | 16,580,486 |
| MCP startup (total, s) | 109.0 |
| CLI startup (total, s) | 49.3 |
| CLI execution (total, s) | 2001.6 |
| CLI wall (total, s) | 2050.9 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 12.5 |
| Harness capture (total, s) | 0.0 |
| Cost estimate (USD; including retries) | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 6,189 | 0 | 34,603 | 0 | 225,920 | 803 | 2.2 | 2.6 | 33.9 | 36.5 | 0.00 | 0.33 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 6,762 | 0 | 35,695 | 0 | 255,104 | 811 | 2.4 | 2.2 | 36.7 | 38.9 | 0.00 | 0.46 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 20 | 0 | 8,111 | 0 | 35,188 | 0 | 207,232 | 831 | 2.5 | 2.0 | 32.3 | 34.3 | 0.00 | 0.38 | Receipt B-8228 · Total charged €101.29 |
| `llf-basket-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,845 | 0 | 50,217 | 0 | 227,200 | 869 | 2.5 | 2.0 | 37.7 | 39.7 | 0.00 | 0.52 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 6,119 | 0 | 35,472 | 0 | 255,232 | 840 | 2.6 | 2.2 | 34.6 | 36.8 | 0.00 | 0.47 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 6,065 | 0 | 27,371 | 0 | 233,984 | 912 | 2.6 | 2.2 | 35.1 | 37.3 | 0.00 | 0.48 | Receipt B-8228, total charged €101.29 |
| `llf-access-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 30,271 | 0 | 52,349 | 0 | 465,792 | 1,286 | 2.7 | 2.0 | 49.8 | 51.8 | 0.00 | 0.31 | A-5340 |
| `llf-access-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 38 | 0 | 16,397 | 0 | 27,571 | 0 | 613,632 | 1,546 | 2.7 | 2.1 | 66.0 | 68.1 | 0.00 | 0.36 | A-5340 |
| `llf-access-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 38 | 0 | 16,397 | 0 | 41,024 | 0 | 632,320 | 1,673 | 2.8 | 1.7 | 68.8 | 70.5 | 0.00 | 0.29 | A-5340 |
| `llf-access-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 32 | 0 | 10,359 | 0 | 22,934 | 0 | 421,632 | 1,257 | 2.8 | 1.8 | 50.9 | 52.7 | 0.00 | 0.51 | A-5340 |
| `llf-access-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 14,503 | 0 | 37,006 | 0 | 483,200 | 1,313 | 2.8 | 2.2 | 55.2 | 57.5 | 0.00 | 0.40 | A-5340 |
| `llf-access-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 11,258 | 0 | 24,999 | 0 | 546,560 | 1,578 | 2.9 | 2.0 | 63.8 | 65.8 | 0.00 | 0.28 | A-5340 |
| `llf-suppliers-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 4,459 | 0 | 17,702 | 0 | 232,960 | 701 | 2.0 | 1.5 | 29.7 | 31.1 | 0.00 | 0.26 | Quote receipt Q-4293; EUR 870.00 total. |
| `llf-suppliers-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,061 | 0 | 33,315 | 0 | 232,832 | 680 | 2.0 | 0.8 | 26.5 | 27.3 | 0.00 | 0.24 | Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 3,705 | 0 | 17,242 | 0 | 232,320 | 652 | 2.0 | 0.9 | 31.8 | 32.7 | 0.00 | 0.32 | Receipt Q-4293 · EUR 870.00 |
| `llf-suppliers-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 5,475 | 0 | 18,257 | 0 | 221,696 | 619 | 2.3 | 0.7 | 33.7 | 34.4 | 0.00 | 0.25 | Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,717 | 0 | 19,196 | 0 | 255,360 | 927 | 2.0 | 0.5 | 36.2 | 36.6 | 0.00 | 0.26 | Q-4293; EUR 870.00 |
| `llf-suppliers-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 13 | 0 | 5,522 | 0 | 17,529 | 0 | 194,432 | 620 | 2.0 | 0.5 | 28.7 | 29.2 | 0.00 | 0.30 | Q-4293, EUR 870.00 |
| `llf-retention-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 8,963 | 0 | 30,913 | 0 | 363,264 | 909 | 2.0 | 0.6 | 45.5 | 46.1 | 0.00 | 0.23 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 10,323 | 0 | 30,438 | 0 | 273,664 | 903 | 2.0 | 0.5 | 38.7 | 39.2 | 0.00 | 0.26 | R-6635 |
| `llf-retention-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 9,602 | 0 | 14,989 | 0 | 415,232 | 1,106 | 2.0 | 0.6 | 52.3 | 52.9 | 0.00 | 0.27 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 10,360 | 0 | 32,505 | 0 | 401,664 | 1,120 | 2.1 | 0.8 | 45.1 | 45.9 | 0.00 | 0.27 | R-6635 |
| `llf-retention-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 8,939 | 0 | 29,632 | 0 | 300,800 | 926 | 2.2 | 0.6 | 37.3 | 37.9 | 0.00 | 0.27 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 8,834 | 0 | 22,009 | 0 | 306,048 | 944 | 2.0 | 0.5 | 49.9 | 50.4 | 0.00 | 0.19 | R-6635 |
| `llf-workspace-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 20 | 0 | 6,261 | 0 | 18,879 | 0 | 314,752 | 950 | 2.5 | 1.4 | 37.9 | 39.3 | 0.00 | 0.25 | WS-3551 |
| `llf-workspace-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 6,277 | 0 | 20,635 | 0 | 298,496 | 942 | 2.0 | 0.4 | 37.9 | 38.3 | 0.00 | 0.22 | WS-3551 |
| `llf-workspace-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 6,338 | 0 | 20,304 | 0 | 282,880 | 871 | 2.0 | 0.4 | 40.4 | 40.8 | 0.00 | 0.24 | WS-3551 |
| `llf-workspace-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,872 | 0 | 26,262 | 0 | 246,656 | 851 | 2.4 | 0.7 | 58.4 | 59.1 | 0.00 | 0.21 | WS-3551 |
| `llf-workspace-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 6,228 | 0 | 35,089 | 0 | 284,032 | 933 | 2.0 | 0.4 | 40.4 | 40.9 | 0.00 | 0.22 | WS-3551 |
| `llf-workspace-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,872 | 0 | 13,608 | 0 | 259,712 | 873 | 2.0 | 0.5 | 33.1 | 33.6 | 0.00 | 0.27 | WS-3551 |
| `llf-casework-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 11,334 | 0 | 34,113 | 0 | 421,888 | 1,206 | 2.0 | 0.4 | 53.9 | 54.4 | 0.00 | 0.22 | CW-4013 |
| `llf-casework-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 10,416 | 0 | 38,862 | 0 | 329,088 | 954 | 2.0 | 0.4 | 43.4 | 43.8 | 0.00 | 0.22 | CW-4013 |
| `llf-casework-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 10,385 | 0 | 27,811 | 0 | 261,376 | 881 | 2.0 | 0.5 | 36.2 | 36.6 | 0.00 | 0.20 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 10,391 | 0 | 25,055 | 0 | 342,400 | 926 | 2.0 | 3.1 | 42.7 | 45.8 | 0.00 | 0.18 | CW-4013 |
| `llf-casework-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 10,391 | 0 | 15,061 | 0 | 366,976 | 932 | 3.3 | 0.9 | 45.8 | 46.6 | 0.00 | 0.20 | CW-4013 |
| `llf-casework-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 10,391 | 0 | 25,182 | 0 | 343,040 | 954 | 2.3 | 0.6 | 44.6 | 45.2 | 0.00 | 0.18 | CW-4013 |
| `llf-budgets-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 4,871 | 0 | 20,128 | 0 | 247,296 | 800 | 2.0 | 0.5 | 31.3 | 31.8 | 0.00 | 0.20 | BG-4763 |
| `llf-budgets-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 5,575 | 0 | 19,205 | 0 | 267,904 | 1,049 | 2.0 | 0.5 | 33.0 | 33.5 | 0.00 | 0.16 | BG-4763 |
| `llf-budgets-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 4,871 | 0 | 18,508 | 0 | 248,960 | 801 | 2.4 | 0.5 | 28.2 | 28.7 | 0.00 | 0.22 | BG-4763 |
| `llf-budgets-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 4,861 | 0 | 32,908 | 0 | 234,624 | 839 | 2.5 | 0.5 | 36.6 | 37.1 | 0.00 | 0.26 | BG-4763 |
| `llf-budgets-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 5,301 | 0 | 11,878 | 0 | 286,336 | 837 | 2.0 | 0.5 | 33.9 | 34.4 | 0.00 | 0.19 | BG-4763 |
| `llf-budgets-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 4,845 | 0 | 25,839 | 0 | 241,664 | 826 | 2.0 | 0.4 | 37.2 | 37.7 | 0.00 | 0.16 | BG-4763 |
| `llf-dispatch-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 6,506 | 0 | 20,833 | 0 | 313,088 | 1,182 | 2.6 | 0.5 | 42.5 | 43.0 | 0.00 | 0.14 | DP-1635 |
| `llf-dispatch-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 5,534 | 0 | 13,130 | 0 | 359,680 | 1,095 | 2.0 | 0.5 | 44.6 | 45.1 | 0.00 | 0.14 | DP-1635 |
| `llf-dispatch-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 6,525 | 0 | 25,008 | 0 | 508,160 | 1,335 | 2.0 | 0.4 | 56.0 | 56.4 | 0.00 | 0.13 | DP-1635 |
| `llf-dispatch-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 6,475 | 0 | 26,130 | 0 | 202,880 | 1,072 | 2.4 | 0.9 | 34.2 | 35.1 | 0.00 | 0.15 | DP-1635 |
| `llf-dispatch-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 36 | 0 | 7,453 | 0 | 12,856 | 0 | 277,376 | 1,193 | 2.0 | 0.4 | 37.1 | 37.5 | 0.00 | 0.14 | DP-1635 |
| `llf-dispatch-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 6,354 | 0 | 22,422 | 0 | 385,280 | 1,128 | 2.0 | 0.4 | 52.1 | 52.5 | 0.00 | 0.12 | DP-1635 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 260,523 | 33.9 | unknown | unknown | known |
| `llf-basket-off` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 290,799 | 36.7 | unknown | unknown | known |
| `llf-basket-off` | Mantis | 3 | 1 | success | n/a | 1200 | 20 | 242,420 | 32.3 | unknown | unknown | known |
| `llf-basket-on` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 277,417 | 37.7 | unknown | unknown | known |
| `llf-basket-on` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 290,704 | 34.6 | unknown | unknown | known |
| `llf-basket-on` | Mantis | 3 | 1 | success | n/a | 1200 | 16 | 261,355 | 35.1 | unknown | unknown | known |
| `llf-access-off` | Mantis | 1 | 1 | success | n/a | 1200 | 33 | 518,141 | 49.8 | unknown | unknown | known |
| `llf-access-off` | Mantis | 2 | 1 | success | n/a | 1200 | 38 | 641,203 | 66.0 | unknown | unknown | known |
| `llf-access-off` | Mantis | 3 | 1 | success | n/a | 1200 | 38 | 673,344 | 68.8 | unknown | unknown | known |
| `llf-access-on` | Mantis | 1 | 1 | success | n/a | 1200 | 32 | 444,566 | 50.9 | unknown | unknown | known |
| `llf-access-on` | Mantis | 2 | 1 | success | n/a | 1200 | 33 | 520,206 | 55.2 | unknown | unknown | known |
| `llf-access-on` | Mantis | 3 | 1 | success | n/a | 1200 | 33 | 571,559 | 63.8 | unknown | unknown | known |
| `llf-suppliers-off` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 250,662 | 29.7 | unknown | unknown | known |
| `llf-suppliers-off` | Mantis | 2 | 1 | success | n/a | 1200 | 17 | 266,147 | 26.5 | unknown | unknown | known |
| `llf-suppliers-off` | Mantis | 3 | 1 | success | n/a | 1200 | 15 | 249,562 | 31.8 | unknown | unknown | known |
| `llf-suppliers-on` | Mantis | 1 | 1 | success | n/a | 1200 | 15 | 239,953 | 33.7 | unknown | unknown | known |
| `llf-suppliers-on` | Mantis | 2 | 1 | success | n/a | 1200 | 17 | 274,556 | 36.2 | unknown | unknown | known |
| `llf-suppliers-on` | Mantis | 3 | 1 | success | n/a | 1200 | 13 | 211,961 | 28.7 | unknown | unknown | known |
| `llf-retention-off` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 394,177 | 45.5 | unknown | unknown | known |
| `llf-retention-off` | Mantis | 2 | 1 | success | n/a | 1200 | 26 | 304,102 | 38.7 | unknown | unknown | known |
| `llf-retention-off` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 430,221 | 52.3 | unknown | unknown | known |
| `llf-retention-on` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 434,169 | 45.1 | unknown | unknown | known |
| `llf-retention-on` | Mantis | 2 | 1 | success | n/a | 1200 | 23 | 330,432 | 37.3 | unknown | unknown | known |
| `llf-retention-on` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 328,057 | 49.9 | unknown | unknown | known |
| `llf-workspace-off` | Mantis | 1 | 1 | success | n/a | 1200 | 20 | 333,631 | 37.9 | unknown | unknown | known |
| `llf-workspace-off` | Mantis | 2 | 1 | success | n/a | 1200 | 19 | 319,131 | 37.9 | unknown | unknown | known |
| `llf-workspace-off` | Mantis | 3 | 1 | success | n/a | 1200 | 19 | 303,184 | 40.4 | unknown | unknown | known |
| `llf-workspace-on` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 272,918 | 58.4 | unknown | unknown | known |
| `llf-workspace-on` | Mantis | 2 | 1 | success | n/a | 1200 | 19 | 319,121 | 40.4 | unknown | unknown | known |
| `llf-workspace-on` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 273,320 | 33.1 | unknown | unknown | known |
| `llf-casework-off` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 456,001 | 53.9 | unknown | unknown | known |
| `llf-casework-off` | Mantis | 2 | 1 | success | n/a | 1200 | 22 | 367,950 | 43.4 | unknown | unknown | known |
| `llf-casework-off` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 289,187 | 36.2 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 1 | 1 | success | n/a | 1200 | 22 | 367,455 | 42.7 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 2 | 1 | success | n/a | 1200 | 22 | 382,037 | 45.8 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 3 | 1 | success | n/a | 1200 | 22 | 368,222 | 44.6 | unknown | unknown | known |
| `llf-budgets-off` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 267,424 | 31.3 | unknown | unknown | known |
| `llf-budgets-off` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 287,109 | 33.0 | unknown | unknown | known |
| `llf-budgets-off` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 267,468 | 28.2 | unknown | unknown | known |
| `llf-budgets-on` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 267,532 | 36.6 | unknown | unknown | known |
| `llf-budgets-on` | Mantis | 2 | 1 | success | n/a | 1200 | 19 | 298,214 | 33.9 | unknown | unknown | known |
| `llf-budgets-on` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 267,503 | 37.2 | unknown | unknown | known |
| `llf-dispatch-off` | Mantis | 1 | 1 | success | n/a | 1200 | 33 | 333,921 | 42.5 | unknown | unknown | known |
| `llf-dispatch-off` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 372,810 | 44.6 | unknown | unknown | known |
| `llf-dispatch-off` | Mantis | 3 | 1 | success | n/a | 1200 | 34 | 533,168 | 56.0 | unknown | unknown | known |
| `llf-dispatch-on` | Mantis | 1 | 1 | success | n/a | 1200 | 33 | 229,010 | 34.2 | unknown | unknown | known |
| `llf-dispatch-on` | Mantis | 2 | 1 | success | n/a | 1200 | 36 | 290,232 | 37.1 | unknown | unknown | known |
| `llf-dispatch-on` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 407,702 | 52.1 | unknown | unknown | known |
