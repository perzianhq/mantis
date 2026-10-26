# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-26; runs per task and approach: 3; 4 runs in parallel.
- Scope: 16 tasks × 1 approaches × 3 runs = 48 logical runs; 48 recorded so far; 48 total attempts including retries.
- Codex runtime: codex-cli 0.164.0-alpha.11.1; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 47 / 48 |
| After reruns / merged correct | 47 / 48 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 47 / 48 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 1 |
| Tool calls (including retries) | 1,044 |
| MCP tool errors (including retries) | 1 |
| Browser observation text (observed chars) | 532,208 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,293,562 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 16,143,360 |
| Output tokens (total) | 46,239 |
| Total input tokens incl. cache (legacy) | 17,436,922 |
| MCP startup (total, s) | 101.4 |
| CLI startup (total, s) | 37.4 |
| CLI execution (total, s) | 1675.6 |
| CLI wall (total, s) | 1713.0 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 15.1 |
| Harness capture (total, s) | 0.0 |
| Cost estimate (USD; including retries) | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,730 | 0 | 20,896 | 0 | 268,032 | 852 | 2.5 | 0.7 | 28.4 | 29.1 | 0.00 | 0.25 | Receipt B-8228, total charged €101.29 |
| `llf-basket-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,730 | 0 | 22,313 | 0 | 266,624 | 864 | 2.4 | 0.7 | 30.1 | 30.8 | 0.00 | 0.32 | Receipt B-8228; total charged €101.29 |
| `llf-basket-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 6,697 | 0 | 37,123 | 0 | 268,160 | 891 | 2.4 | 0.7 | 29.6 | 30.3 | 0.00 | 0.36 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 7,644 | 0 | 31,001 | 0 | 291,328 | 994 | 2.3 | 0.7 | 31.3 | 32.0 | 0.00 | 0.24 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 7,848 | 0 | 12,728 | 0 | 235,136 | 950 | 2.0 | 0.6 | 25.4 | 26.0 | 0.00 | 0.23 | Receipt B-8228; total charged €101.29 |
| `llf-basket-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 19 | 0 | 7,666 | 0 | 12,755 | 0 | 241,280 | 953 | 2.1 | 0.6 | 27.4 | 28.0 | 0.00 | 0.23 | Receipt B-8228; total charged €101.29 |
| `llf-access-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 29 | 0 | 29,886 | 0 | 28,990 | 0 | 332,416 | 1,037 | 2.0 | 0.6 | 36.3 | 36.9 | 0.00 | 0.24 | A-5340 |
| `llf-access-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 29,880 | 0 | 45,250 | 0 | 398,336 | 1,082 | 2.0 | 0.5 | 33.3 | 33.8 | 0.00 | 0.21 | A-5340 |
| `llf-access-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 29,475 | 0 | 23,806 | 0 | 402,304 | 1,005 | 2.1 | 0.6 | 36.9 | 37.5 | 0.00 | 0.29 | A-5340 |
| `llf-access-on` | Mantis | 1 | wrong_answer | wrong_answer | wrong_answer | 1 | n/a | 1200 | 31 | 0 | 29,972 | 0 | 48,034 | 0 | 629,248 | 1,332 | 2.1 | 0.6 | 51.4 | 52.0 | 0.00 | 0.38 | full terminal ledger differs from expected state: saved, staged |
| `llf-access-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 29,791 | 0 | 36,815 | 0 | 373,504 | 1,066 | 2.1 | 0.6 | 33.7 | 34.2 | 0.00 | 0.28 | A-5340 |
| `llf-access-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 29,435 | 0 | 22,421 | 0 | 240,128 | 993 | 2.1 | 0.6 | 27.6 | 28.2 | 0.00 | 0.24 | A-5340 |
| `llf-suppliers-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,347 | 0 | 34,953 | 0 | 260,736 | 819 | 2.0 | 0.6 | 34.1 | 34.7 | 0.00 | 0.24 | Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 4,100 | 0 | 24,995 | 0 | 221,312 | 642 | 2.1 | 0.7 | 26.8 | 27.5 | 0.00 | 0.29 | Q-4293, EUR 870.00 |
| `llf-suppliers-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 4,100 | 0 | 17,890 | 0 | 228,736 | 652 | 2.0 | 0.7 | 26.9 | 27.6 | 0.00 | 0.23 | Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 6,413 | 0 | 27,088 | 0 | 255,616 | 613 | 2.0 | 1.5 | 27.3 | 28.8 | 0.00 | 0.28 | Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 5,881 | 0 | 19,133 | 0 | 232,576 | 664 | 2.0 | 2.1 | 21.9 | 24.0 | 0.00 | 0.39 | Q-4293, EUR 870.00 |
| `llf-suppliers-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 5,846 | 0 | 19,773 | 0 | 231,936 | 683 | 2.0 | 0.5 | 23.6 | 24.1 | 0.00 | 0.23 | Receipt Q-4293; EUR 870.00 |
| `llf-retention-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 11,138 | 0 | 26,020 | 0 | 375,168 | 897 | 2.1 | 0.5 | 35.0 | 35.5 | 0.00 | 0.22 | R-6635 |
| `llf-retention-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 11,584 | 0 | 21,122 | 0 | 402,816 | 849 | 2.1 | 0.6 | 32.5 | 33.1 | 0.00 | 0.30 | R-6635 |
| `llf-retention-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 11,138 | 0 | 26,347 | 0 | 393,600 | 1,018 | 2.1 | 0.6 | 40.0 | 40.6 | 0.00 | 0.32 | R-6635 |
| `llf-retention-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 11,810 | 0 | 27,386 | 0 | 411,520 | 1,098 | 2.1 | 0.6 | 40.1 | 40.7 | 0.00 | 0.24 | R-6635 |
| `llf-retention-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 12,240 | 0 | 28,524 | 0 | 447,872 | 1,106 | 2.3 | 0.6 | 41.6 | 42.1 | 0.00 | 0.79 | R-6635 |
| `llf-retention-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 1 | 11,471 | 0 | 37,547 | 0 | 383,488 | 1,107 | 2.0 | 0.5 | 48.0 | 48.5 | 0.00 | 0.93 | R-6635 |
| `llf-workspace-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,945 | 0 | 12,719 | 0 | 275,968 | 902 | 2.0 | 0.6 | 27.7 | 28.3 | 0.00 | 0.71 | WS-3551 |
| `llf-workspace-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 7,314 | 0 | 32,335 | 0 | 289,152 | 961 | 2.1 | 0.6 | 42.1 | 42.7 | 0.00 | 0.23 | WS-3551 |
| `llf-workspace-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,879 | 0 | 30,566 | 0 | 289,408 | 928 | 2.0 | 1.6 | 40.7 | 42.4 | 0.00 | 0.35 | WS-3551 |
| `llf-workspace-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,904 | 0 | 21,188 | 0 | 267,264 | 860 | 2.0 | 2.2 | 29.4 | 31.6 | 0.00 | 0.24 | WS-3551 |
| `llf-workspace-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,892 | 0 | 12,581 | 0 | 275,968 | 857 | 2.0 | 2.1 | 31.4 | 33.4 | 0.00 | 0.20 | WS-3551 |
| `llf-workspace-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 6,904 | 0 | 30,705 | 0 | 257,792 | 896 | 2.0 | 0.5 | 30.7 | 31.2 | 0.00 | 0.28 | WS-3551 |
| `llf-casework-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 14,398 | 0 | 45,758 | 0 | 441,472 | 1,131 | 2.0 | 1.3 | 39.5 | 40.7 | 0.00 | 0.50 | CW-4013 |
| `llf-casework-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 13,100 | 0 | 28,604 | 0 | 431,488 | 1,074 | 2.1 | 0.6 | 40.0 | 40.6 | 0.00 | 0.33 | CW-4013 |
| `llf-casework-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 14,398 | 0 | 45,966 | 0 | 441,728 | 1,167 | 2.0 | 0.7 | 46.7 | 47.3 | 0.00 | 0.23 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 14,359 | 0 | 42,066 | 0 | 461,184 | 1,116 | 2.0 | 0.7 | 49.0 | 49.7 | 0.00 | 0.35 | CW-4013 |
| `llf-casework-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 13,064 | 0 | 39,275 | 0 | 409,728 | 1,061 | 2.0 | 1.0 | 42.3 | 43.2 | 0.00 | 0.39 | CW-4013 |
| `llf-casework-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 13,064 | 0 | 29,113 | 0 | 413,824 | 1,032 | 2.0 | 0.5 | 36.6 | 37.1 | 0.00 | 0.21 | CW-4013 |
| `llf-budgets-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,190 | 0 | 11,849 | 0 | 253,696 | 867 | 2.0 | 0.6 | 28.7 | 29.3 | 0.00 | 0.22 | BG-4763 |
| `llf-budgets-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,190 | 0 | 19,610 | 0 | 253,696 | 816 | 2.1 | 0.7 | 27.5 | 28.2 | 0.00 | 0.23 | BG-4763 |
| `llf-budgets-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,190 | 0 | 18,970 | 0 | 245,120 | 716 | 2.5 | 1.1 | 25.9 | 27.1 | 0.00 | 0.27 | BG-4763 |
| `llf-budgets-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 18 | 0 | 6,251 | 0 | 23,152 | 0 | 276,096 | 890 | 2.0 | 0.8 | 35.6 | 36.4 | 0.00 | 0.34 | BG-4763 |
| `llf-budgets-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 16 | 0 | 5,178 | 0 | 20,999 | 0 | 243,712 | 779 | 2.1 | 0.5 | 26.2 | 26.7 | 0.00 | 0.20 | BG-4763 |
| `llf-budgets-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 5,548 | 0 | 20,417 | 0 | 260,480 | 844 | 2.1 | 0.6 | 30.4 | 31.0 | 0.00 | 0.25 | BG-4763 |
| `llf-dispatch-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 8,958 | 0 | 26,636 | 0 | 494,208 | 1,318 | 2.6 | 0.6 | 47.2 | 47.9 | 0.00 | 0.40 | DP-1635 |
| `llf-dispatch-off` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 8,755 | 0 | 29,417 | 0 | 538,240 | 1,269 | 2.1 | 0.5 | 47.6 | 48.1 | 0.00 | 0.23 | DP-1635 |
| `llf-dispatch-off` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 8,678 | 0 | 23,523 | 0 | 384,896 | 1,494 | 2.0 | 0.6 | 39.7 | 40.3 | 0.00 | 0.35 | DP-1635 |
| `llf-dispatch-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 8,905 | 0 | 17,192 | 0 | 403,328 | 1,063 | 2.0 | 0.5 | 43.7 | 44.2 | 0.00 | 0.38 | DP-1635 |
| `llf-dispatch-on` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 8,626 | 0 | 24,237 | 0 | 341,760 | 925 | 2.2 | 1.1 | 36.1 | 37.2 | 0.00 | 0.21 | DP-1635 |
| `llf-dispatch-on` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 8,696 | 0 | 33,774 | 0 | 401,280 | 1,106 | 2.2 | 0.6 | 41.7 | 42.3 | 0.00 | 0.27 | DP-1635 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-basket-off` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 288,928 | 28.4 | unknown | unknown | known |
| `llf-basket-off` | Mantis | 2 | 1 | success | n/a | 1200 | 17 | 288,937 | 30.1 | unknown | unknown | known |
| `llf-basket-off` | Mantis | 3 | 1 | success | n/a | 1200 | 18 | 305,283 | 29.6 | unknown | unknown | known |
| `llf-basket-on` | Mantis | 1 | 1 | success | n/a | 1200 | 18 | 322,329 | 31.3 | unknown | unknown | known |
| `llf-basket-on` | Mantis | 2 | 1 | success | n/a | 1200 | 19 | 247,864 | 25.4 | unknown | unknown | known |
| `llf-basket-on` | Mantis | 3 | 1 | success | n/a | 1200 | 19 | 254,035 | 27.4 | unknown | unknown | known |
| `llf-access-off` | Mantis | 1 | 1 | success | n/a | 1200 | 29 | 361,406 | 36.3 | unknown | unknown | known |
| `llf-access-off` | Mantis | 2 | 1 | success | n/a | 1200 | 28 | 443,586 | 33.3 | unknown | unknown | known |
| `llf-access-off` | Mantis | 3 | 1 | success | n/a | 1200 | 28 | 426,110 | 36.9 | unknown | unknown | known |
| `llf-access-on` | Mantis | 1 | 1 | wrong_answer | n/a | 1200 | 31 | 677,282 | 51.4 | unknown | unknown | known |
| `llf-access-on` | Mantis | 2 | 1 | success | n/a | 1200 | 28 | 410,319 | 33.7 | unknown | unknown | known |
| `llf-access-on` | Mantis | 3 | 1 | success | n/a | 1200 | 28 | 262,549 | 27.6 | unknown | unknown | known |
| `llf-suppliers-off` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 295,689 | 34.1 | unknown | unknown | known |
| `llf-suppliers-off` | Mantis | 2 | 1 | success | n/a | 1200 | 15 | 246,307 | 26.8 | unknown | unknown | known |
| `llf-suppliers-off` | Mantis | 3 | 1 | success | n/a | 1200 | 15 | 246,626 | 26.9 | unknown | unknown | known |
| `llf-suppliers-on` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 282,704 | 27.3 | unknown | unknown | known |
| `llf-suppliers-on` | Mantis | 2 | 1 | success | n/a | 1200 | 15 | 251,709 | 21.9 | unknown | unknown | known |
| `llf-suppliers-on` | Mantis | 3 | 1 | success | n/a | 1200 | 15 | 251,709 | 23.6 | unknown | unknown | known |
| `llf-retention-off` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 401,188 | 35.0 | unknown | unknown | known |
| `llf-retention-off` | Mantis | 2 | 1 | success | n/a | 1200 | 24 | 423,938 | 32.5 | unknown | unknown | known |
| `llf-retention-off` | Mantis | 3 | 1 | success | n/a | 1200 | 23 | 419,947 | 40.0 | unknown | unknown | known |
| `llf-retention-on` | Mantis | 1 | 1 | success | n/a | 1200 | 25 | 438,906 | 40.1 | unknown | unknown | known |
| `llf-retention-on` | Mantis | 2 | 1 | success | n/a | 1200 | 27 | 476,396 | 41.6 | unknown | unknown | known |
| `llf-retention-on` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 421,035 | 48.0 | unknown | unknown | known |
| `llf-workspace-off` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 288,687 | 27.7 | unknown | unknown | known |
| `llf-workspace-off` | Mantis | 2 | 1 | success | n/a | 1200 | 18 | 321,487 | 42.1 | unknown | unknown | known |
| `llf-workspace-off` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 319,974 | 40.7 | unknown | unknown | known |
| `llf-workspace-on` | Mantis | 1 | 1 | success | n/a | 1200 | 17 | 288,452 | 29.4 | unknown | unknown | known |
| `llf-workspace-on` | Mantis | 2 | 1 | success | n/a | 1200 | 17 | 288,549 | 31.4 | unknown | unknown | known |
| `llf-workspace-on` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 288,497 | 30.7 | unknown | unknown | known |
| `llf-casework-off` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 487,230 | 39.5 | unknown | unknown | known |
| `llf-casework-off` | Mantis | 2 | 1 | success | n/a | 1200 | 25 | 460,092 | 40.0 | unknown | unknown | known |
| `llf-casework-off` | Mantis | 3 | 1 | success | n/a | 1200 | 27 | 487,694 | 46.7 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 503,250 | 49.0 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 2 | 1 | success | n/a | 1200 | 25 | 449,003 | 42.3 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 442,937 | 36.6 | unknown | unknown | known |
| `llf-budgets-off` | Mantis | 1 | 1 | success | n/a | 1200 | 16 | 265,545 | 28.7 | unknown | unknown | known |
| `llf-budgets-off` | Mantis | 2 | 1 | success | n/a | 1200 | 16 | 273,306 | 27.5 | unknown | unknown | known |
| `llf-budgets-off` | Mantis | 3 | 1 | success | n/a | 1200 | 16 | 264,090 | 25.9 | unknown | unknown | known |
| `llf-budgets-on` | Mantis | 1 | 1 | success | n/a | 1200 | 18 | 299,248 | 35.6 | unknown | unknown | known |
| `llf-budgets-on` | Mantis | 2 | 1 | success | n/a | 1200 | 16 | 264,711 | 26.2 | unknown | unknown | known |
| `llf-budgets-on` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 280,897 | 30.4 | unknown | unknown | known |
| `llf-dispatch-off` | Mantis | 1 | 1 | success | n/a | 1200 | 33 | 520,844 | 47.2 | unknown | unknown | known |
| `llf-dispatch-off` | Mantis | 2 | 1 | success | n/a | 1200 | 33 | 567,657 | 47.6 | unknown | unknown | known |
| `llf-dispatch-off` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 408,419 | 39.7 | unknown | unknown | known |
| `llf-dispatch-on` | Mantis | 1 | 1 | success | n/a | 1200 | 25 | 420,520 | 43.7 | unknown | unknown | known |
| `llf-dispatch-on` | Mantis | 2 | 1 | success | n/a | 1200 | 25 | 365,997 | 36.1 | unknown | unknown | known |
| `llf-dispatch-on` | Mantis | 3 | 1 | success | n/a | 1200 | 25 | 435,054 | 41.7 | unknown | unknown | known |
