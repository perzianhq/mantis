# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 3; 10 runs in parallel.
- Scope: 13 exact recovery rows = 13 logical runs; 13 recorded so far; 13 total attempts including retries.
- Exact rows: `v2-heldout-reading-sticky-context|tree|1`, `v2-heldout-reading-sticky-context|screenshot|1`, `v2-heldout-reading-sticky-context|mantis|2`, `v2-heldout-reading-sticky-context|screenshot|2`, `v2-heldout-reading-sticky-context|mantis|3`, `v2-heldout-reading-sticky-context|tree|3`, `v2-heldout-reading-sticky-context|screenshot|3`, `v2-heldout-reading-recovery|mantis|1`, `v2-heldout-reading-recovery|screenshot|1`, `v2-heldout-reading-recovery|mantis|2`, `v2-heldout-reading-recovery|screenshot|2`, `v2-heldout-reading-recovery|mantis|3`, `v2-heldout-reading-recovery|tree|3`.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 3 / 5 | 3 / 3 | 3 / 5 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 2 | 0 | 2 |
| Tool calls (including retries) | 191 | 15 | 181 |
| Sarvam API attempts (including retries) | 135 | 18 | 184 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 433.2 | 49.1 | 549.5 |
| Sarvam limiter queue / cooldown (total, s) | 650.4 / 0.0 | 97.3 / 0.0 | 998.1 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 402.3 / 0.0 | 43.5 / 0.0 | 513.5 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 23 | 0 | 4 |
| Browser observation text (observed chars) | 23,864 | 7,452 | 4,681 |
| Browser observation images (observed blocks) | 7 | 1 | 80 |
| Normal input tokens (total) | 66,674 | 8,140 | 482,464 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 904,064 | 52,864 | 1,079,936 |
| Output tokens (total) | 30,477 | 1,469 | 34,897 |
| Total input tokens incl. cache (legacy) | 970,738 | 61,004 | 1,562,400 |
| MCP startup (total, s) | 6.5 | 2.5 | 8.1 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 1083.5 | 146.4 | 1547.6 |
| CLI wall (total, s) | 1083.5 | 146.4 | 1547.6 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.8 | 0.5 | 0.7 |
| Harness capture (total, s) | 5.9 | 10.1 | 6.3 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 5.32 | 0.38 | 16.27 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,323 | 0 | 2,121 | 0 | 13,568 | 277 | 1.0 | 0.0 | 61.8 | 61.8 | 0.00 | 0.19 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 1 | success | 1 | 26 | 1 | 27 | 0 | 389 | 12 | 49,394 | 0 | 114,688 | 3,862 | 1.8 | 0.0 | 251.9 | 251.9 | 0.00 | 0.14 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,587 | 0 | 2,208 | 0 | 14,208 | 374 | 1.4 | 0.0 | 11.9 | 11.9 | 0.00 | 0.22 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 2 | success | 1 | 27 | 0 | 28 | 0 | 480 | 12 | 47,404 | 0 | 120,576 | 3,222 | 1.7 | 0.0 | 240.8 | 240.8 | 0.00 | 0.16 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 0 | 1,244 | 0 | 1,913 | 0 | 11,776 | 330 | 1.4 | 0.0 | 63.0 | 63.0 | 0.00 | 0.15 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,323 | 0 | 2,100 | 0 | 13,568 | 270 | 1.0 | 0.0 | 14.1 | 14.1 | 0.00 | 0.18 | Juniper-418 |
| `v2-heldout-reading-sticky-context` | Screenshots (click by x,y) | 3 | success | 1 | 28 | 0 | 29 | 0 | 419 | 13 | 55,670 | 0 | 124,288 | 3,354 | 1.8 | 0.0 | 256.4 | 256.4 | 0.00 | 0.15 | Juniper-418 |
| `v2-heldout-reading-recovery` | Mantis | 1 | success | 1 | 26 | 2 | 22 | 0 | 3,288 | 1 | 8,671 | 0 | 76,160 | 3,078 | 1.4 | 0.0 | 195.6 | 195.6 | 0.00 | 0.15 | Dune-502 |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 1 | step_limit | 1 | 50 | 2 | 50 | 0 | 1,244 | 23 | 191,025 | 0 | 383,104 | 14,376 | 1.7 | 0.0 | 419.0 | 419.0 | 0.00 | 0.15 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Mantis | 2 | step_limit | 1 | 104 | 14 | 50 | 0 | 11,947 | 2 | 32,791 | 0 | 471,936 | 18,124 | 1.4 | 0.0 | 452.6 | 452.6 | 0.00 | 0.14 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Screenshots (click by x,y) | 2 | step_limit | 1 | 50 | 1 | 50 | 0 | 2,149 | 20 | 138,971 | 0 | 337,280 | 10,083 | 1.1 | 0.0 | 379.4 | 379.4 | 0.00 | 0.14 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Mantis | 3 | step_limit | 1 | 50 | 7 | 50 | 0 | 5,798 | 4 | 21,091 | 0 | 329,984 | 8,571 | 0.9 | 0.0 | 360.5 | 360.5 | 0.00 | 0.15 | agent step budget exhausted at 50 steps |
| `v2-heldout-reading-recovery` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 7 | 0 | 8 | 0 | 2,806 | 1 | 3,919 | 0 | 25,728 | 922 | 0.4 | 0.0 | 70.6 | 70.6 | 0.00 | 0.18 | Dune-502 |
