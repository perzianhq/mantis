# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 1; 3 runs in parallel.
- Scope: 2 tasks × 1 approaches × 1 runs = 2 logical runs; 2 recorded so far; 2 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 2 / 2 |
| After reruns / merged correct | 2 / 2 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 2 / 2 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 49 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 21,723 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 81,721 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 755,712 |
| Output tokens (total) | 1,998 |
| Total input tokens incl. cache (legacy) | 837,433 |
| MCP startup (total, s) | 4.0 |
| CLI startup (total, s) | 1.3 |
| CLI execution (total, s) | 102.5 |
| CLI wall (total, s) | 103.8 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.3 |
| Harness capture (total, s) | 0.0 |
| Cost estimate (USD; including retries) | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-casework-off` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 10,416 | 0 | 39,851 | 0 | 327,040 | 896 | 2.0 | 0.6 | 41.5 | 42.2 | 0.00 | 0.16 | CW-4013 |
| `llf-casework-on` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 11,307 | 0 | 41,870 | 0 | 428,672 | 1,102 | 2.0 | 0.6 | 61.0 | 61.6 | 0.00 | 0.13 | CW-4013 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-casework-off` | Mantis | 1 | 1 | success | n/a | 1200 | 22 | 366,891 | 41.5 | unknown | unknown | known |
| `llf-casework-on` | Mantis | 1 | 1 | success | n/a | 1200 | 27 | 470,542 | 61.0 | unknown | unknown | known |
