# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 1; 3 runs in parallel.
- Scope: 2 tasks × 2 approaches × 1 runs = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|
| First-pass correct (attempt 1) | 2 / 2 | 2 / 2 |
| After reruns / merged correct | 2 / 2 | 2 / 2 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 2 / 2 | 2 / 2 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 80 | 119 |
| MCP tool errors (including retries) | 2 | 0 |
| Browser observation text (observed chars) | 78,210 | 2,182 |
| Browser observation images (observed blocks) | 0 | 44 |
| Normal input tokens (total) | 122,200 | 119,107 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 1,354,112 | 1,679,360 |
| Output tokens (total) | 2,803 | 6,332 |
| Total input tokens incl. cache (legacy) | 1,476,312 | 1,798,467 |
| MCP startup (total, s) | 4.1 | 4.1 |
| CLI startup (total, s) | 1.1 | 1.1 |
| CLI execution (total, s) | 153.6 | 188.6 |
| CLI wall (total, s) | 154.7 | 189.7 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.3 | 0.3 |
| Harness capture (total, s) | 0.0 | 0.0 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 40 | 1 | 39,126 | 0 | 60,720 | 0 | 597,376 | 1,319 | 2.0 | 0.6 | 65.3 | 65.9 | 0.00 | 0.14 | CW-4013 |
| `llf-casework-off` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 1200 | 73 | 0 | 1,200 | 31 | 68,112 | 0 | 914,688 | 3,502 | 2.0 | 0.6 | 95.8 | 96.3 | 0.00 | 0.13 | CW-4013 |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 40 | 1 | 39,084 | 0 | 61,480 | 0 | 756,736 | 1,484 | 2.0 | 0.5 | 88.3 | 88.8 | 0.00 | 0.15 | CW-4013 |
| `llf-casework-on` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 1200 | 46 | 0 | 982 | 13 | 50,995 | 0 | 764,672 | 2,830 | 2.0 | 0.5 | 92.8 | 93.4 | 0.00 | 0.17 | CW-4013 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `llf-casework-off` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 40 | 658,096 | 65.3 | unknown | unknown | known |
| `llf-casework-off` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 1200 | 73 | 982,800 | 95.8 | unknown | unknown | known |
| `llf-casework-on` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 40 | 818,216 | 88.3 | unknown | unknown | known |
| `llf-casework-on` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 1200 | 46 | 815,667 | 92.8 | unknown | unknown | known |
