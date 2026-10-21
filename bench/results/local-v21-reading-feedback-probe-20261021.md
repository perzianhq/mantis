# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-21; runs per task and approach: 3; 8 runs in parallel.
- Scope: 8 exact recovery rows = 8 logical runs; 8 recorded so far; 8 total attempts including retries.
- Exact rows: `v2-reading-landmark-jump|mantis|2`, `v2-reading-landmark-jump|mantis|3`, `v2-reading-landmark-jump|tree|1`, `v2-reading-landmark-jump|tree|3`, `v2-reading-landmark-jump|screenshot|1`, `v2-reading-landmark-jump|screenshot|2`, `v2-reading-landmark-jump|screenshot|3`, `v2-reading-cross-region|tree|2`.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs. Sarvam's 600s active-work timeout pauses for local limiter/cooldown/retry waits; a 1800s wall-clock cap remains. Reports retain both wait and timeout telemetry.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 0 / 2 | 3 / 3 | 1 / 3 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 2 | 0 | 2 |
| Tool calls (including retries) | 100 | 28 | 149 |
| Sarvam API attempts (including retries) | 100 | 31 | 150 |
| Sarvam HTTP 429 responses | 0 | 0 | 0 |
| Sarvam execution excl. quota/retry wait (total, s) | 282.0 | 63.1 | 505.0 |
| Sarvam limiter queue / cooldown (total, s) | 320.6 / 0.0 | 192.7 / 0.0 | 482.3 / 0.0 |
| Sarvam active request / retry backoff (total, s) | 261.9 / 0.0 | 51.3 / 0.0 | 475.2 / 0.0 |
| Sarvam active work / local quota wait (total, s) | unknown | unknown | unknown |
| Sarvam wall-cap timeouts | 0 | 0 | 0 |
| MCP tool errors (including retries) | 8 | 0 | 5 |
| Browser observation text (observed chars) | 19,459 | 15,314 | 3,334 |
| Browser observation images (observed blocks) | 8 | 1 | 64 |
| Normal input tokens (total) | 46,474 | 14,769 | 514,538 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 736,512 | 108,288 | 1,105,920 |
| Output tokens (total) | 19,855 | 2,345 | 40,490 |
| Total input tokens incl. cache (legacy) | 782,986 | 123,057 | 1,620,458 |
| MCP startup (total, s) | 2.5 | 5.0 | 4.8 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 602.6 | 255.8 | 987.3 |
| CLI wall (total, s) | 602.6 | 255.8 | 987.3 |
| Fixture verification (total, s) | 0.1 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.4 | 0.4 |
| Harness capture (total, s) | 4.2 | 17.4 | 7.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 3.61 | 0.67 | 17.67 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 9 | 0 | 10 | 0 | 5,121 | 0 | 4,470 | 0 | 33,536 | 599 | 1.7 | 0.0 | 68.4 | 68.4 | 0.00 | 0.15 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 1 | step_limit | 1 | 50 | 2 | 50 | 0 | 1,011 | 21 | 175,059 | 0 | 359,424 | 12,229 | 1.6 | 0.0 | 325.4 | 325.4 | 0.00 | 0.13 | agent step budget exhausted at 50 steps |
| `v2-reading-landmark-jump` | Mantis | 2 | step_limit | 1 | 50 | 5 | 50 | 0 | 9,103 | 3 | 22,366 | 0 | 351,872 | 9,117 | 1.2 | 0.0 | 278.9 | 278.9 | 0.00 | 0.16 | agent step budget exhausted at 50 steps |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 2 | step_limit | 1 | 50 | 2 | 50 | 0 | 1,502 | 21 | 142,810 | 0 | 365,184 | 11,491 | 1.6 | 0.0 | 315.6 | 315.6 | 0.00 | 0.15 | agent step budget exhausted at 50 steps |
| `v2-reading-landmark-jump` | Mantis | 3 | step_limit | 1 | 50 | 3 | 50 | 0 | 10,356 | 5 | 24,108 | 0 | 384,640 | 10,738 | 1.3 | 0.0 | 323.7 | 323.7 | 0.07 | 0.13 | agent step budget exhausted at 50 steps |
| `v2-reading-landmark-jump` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 9 | 0 | 10 | 0 | 5,121 | 0 | 4,505 | 0 | 33,792 | 665 | 1.6 | 0.0 | 66.7 | 66.7 | 0.00 | 0.15 | Current program release: Ember-985 |
| `v2-reading-landmark-jump` | Screenshots (click by x,y) | 3 | success | 1 | 49 | 1 | 50 | 0 | 821 | 22 | 196,669 | 0 | 381,312 | 16,770 | 1.6 | 0.0 | 346.4 | 346.4 | 0.00 | 0.13 | Current program release: Ember-985 |
| `v2-reading-cross-region` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 10 | 0 | 11 | 0 | 5,072 | 1 | 5,794 | 0 | 40,960 | 1,081 | 1.6 | 0.0 | 120.7 | 120.7 | 0.00 | 0.15 | Delivery region: Aster-862 |
