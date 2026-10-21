# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6.1-sol`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-19; runs per task and approach: 1; 3 runs in parallel.
- Scope: 2 tasks × 3 approaches × 1 runs = 6 logical runs; 3 recorded so far; 3 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.10.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 1 / 1 | 1 / 1 | 1 / 1 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 4 | 5 | 9 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 1,004 | 2,179 | 176 |
| Browser observation images (observed blocks) | 0 | 0 | 3 |
| Normal input tokens (total) | 13,490 | 13,986 | 24,532 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 55,424 | 46,208 | 58,880 |
| Output tokens (total) | 263 | 254 | 427 |
| Total input tokens incl. cache (legacy) | 68,914 | 60,194 | 83,412 |
| MCP startup (total, s) | 2.0 | 2.1 | 2.1 |
| CLI startup (total, s) | 0.7 | 0.6 | 0.6 |
| CLI execution (total, s) | 15.7 | 14.8 | 22.6 |
| CLI wall (total, s) | 16.3 | 15.5 | 23.3 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.1 | 0.1 | 0.1 |
| Harness capture (total, s) | 0.0 | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 4 | 0 | 1,004 | 0 | 13,490 | 0 | 55,424 | 263 | 2.0 | 0.7 | 15.7 | 16.3 | 0.00 | 0.13 | ANSWER: Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 2,179 | 0 | 13,986 | 0 | 46,208 | 254 | 2.1 | 0.6 | 14.8 | 15.5 | 0.00 | 0.14 | ANSWER: Subscribed from Canada (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 1 | success | 1 | 9 | 0 | 176 | 3 | 24,532 | 0 | 58,880 | 427 | 2.1 | 0.6 | 22.6 | 23.3 | 0.00 | 0.13 | ANSWER: Subscribed from Canada (weekly: yes). |
