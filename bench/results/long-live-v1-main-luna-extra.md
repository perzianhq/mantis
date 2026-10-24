# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 1 runs in parallel.
- Scope: 1 tasks × 1 approaches × 1 runs = 1 logical runs; 1 recorded so far; 1 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Accessibility tree (Playwright MCP) |
|---|---:|
| First-pass correct (attempt 1) | 1 / 1 |
| After reruns / merged correct | 1 / 1 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 1 / 1 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 24 |
| MCP tool errors (including retries) | 3 |
| Browser observation text (observed chars) | 19,181 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 14,857 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 218,112 |
| Output tokens (total) | 1,145 |
| Total input tokens incl. cache (legacy) | 232,969 |
| MCP startup (total, s) | 2.0 |
| CLI startup (total, s) | 0.5 |
| CLI execution (total, s) | 53.4 |
| CLI wall (total, s) | 53.9 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.2 |
| Harness capture (total, s) | 12.4 |
| Cost estimate (USD; including retries) | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 24 | 3 | 19,181 | 0 | 14,857 | 0 | 218,112 | 1,145 | 2.0 | 0.5 | 53.4 | 53.9 | 0.00 | 0.18 | New tab: New Window (rechecked; tab remains open) Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: not selected—the harness-prov |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 24 | 232,969 | 53.4 | unknown | unknown | known |
