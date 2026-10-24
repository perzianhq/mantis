# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 6 runs in parallel.
- Scope: 3 tasks × 2 approaches × 1 runs = 6 logical runs; 6 recorded so far; 6 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 3 / 3 | 3 / 3 |
| After reruns / merged correct | 3 / 3 | 3 / 3 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 3 / 3 | 3 / 3 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 29 | 38 |
| MCP tool errors (including retries) | 1 | 4 |
| Browser observation text (observed chars) | 28,934 | 30,103 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | 71,146 | 46,237 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 390,528 | 596,480 |
| Output tokens (total) | 2,340 | 2,763 |
| Total input tokens incl. cache (legacy) | 461,674 | 642,717 |
| MCP startup (total, s) | 6.3 | 6.3 |
| CLI startup (total, s) | 12.1 | 15.9 |
| CLI execution (total, s) | 142.2 | 203.0 |
| CLI wall (total, s) | 154.2 | 219.0 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.7 | 0.6 |
| Harness capture (total, s) | 61.4 | 36.4 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-student` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 13,629 | 0 | 36,165 | 0 | 120,704 | 966 | 2.1 | 2.3 | 24.2 | 26.5 | 0.00 | 0.29 | Prepared: Ada Example; Four; Eggs and Sausages; unsubmitted The current Form Page shows email `ada@example.com`, age `36`, working `Reviewed profile`, inputWit |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 11 | 1 | 13,548 | 0 | 20,355 | 0 | 117,120 | 1,024 | 2.1 | 5.9 | 33.5 | 39.4 | 0.00 | 0.22 | Prepared: Ada Example; Four; Eggs and Sausages; unsubmitted The Form Page currently shows email `ada@example.com`, age `36`, “Reviewed profile,” “Ada Example,” |
| `longlive-internet-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 3 | 1 | 261 | 0 | 13,901 | 0 | 68,992 | 309 | 2.1 | 4.5 | 87.4 | 91.8 | 0.00 | 0.16 | I couldn’t complete the browser handoff. The browser tool timed out opening the requested page, and subsequent reads showed no visible page content. I did not s |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 2 | 2 | 265 | 0 | 5,903 | 0 | 75,776 | 276 | 2.1 | 4.3 | 109.9 | 114.2 | 0.00 | 0.15 | I couldn’t complete the browser handoff: navigation to the requested page timed out, and the browser snapshot also timed out. I wasn’t able to read the tab or f |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 15 | 0 | 15,044 | 0 | 21,080 | 0 | 200,832 | 1,065 | 2.1 | 5.3 | 30.6 | 35.9 | 0.00 | 0.29 | The retained result tab still shows **“List of stuff”** and **“Almost empty”**, with success text **“Success!”** and **“Window name is: result.”** Both iframe  |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 25 | 1 | 16,290 | 0 | 19,979 | 0 | 403,584 | 1,463 | 2.1 | 5.8 | 59.5 | 65.4 | 0.00 | 0.23 | The result tab was open and rechecked. It showed the success text **“Success!”** and both h1 headings: **“List of stuff”** and **“Almost empty.”** The retained  |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-student` | Mantis | 1 | 1 | success | n/a | 1200 | 11 | 156,869 | 24.2 | unknown | unknown | known |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 11 | 137,475 | 33.5 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 3 | 82,893 | 87.4 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 2 | 81,679 | 109.9 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 15 | 221,912 | 30.6 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 25 | 423,563 | 59.5 | unknown | unknown | known |
