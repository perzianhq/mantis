# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 1 exact recovery row = 1 logical runs; 1 recorded so far; 1 total attempts including retries.
- Exact rows: `longlive-internet-window-frames-upload|tree|2`.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 0 / 0 | 1 / 1 |
| After reruns / merged correct | 0 / 0 | 1 / 1 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 0 / 0 | 1 / 1 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 0 | 23 |
| MCP tool errors (including retries) | 0 | 0 |
| Browser observation text (observed chars) | 0 | 10,209 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | unknown | 32 |
| Cache-write input tokens (total) | unknown | 23,393 |
| Cache-read input tokens (total) | unknown | 267,840 |
| Output tokens (total) | unknown | 3,218 |
| Total input tokens incl. cache (legacy) | unknown | 291,265 |
| MCP startup (total, s) | 0.0 | 2.0 |
| CLI startup (total, s) | unknown | 1.2 |
| CLI execution (total, s) | unknown | 58.2 |
| CLI wall (total, s) | unknown | 59.4 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.0 | 0.1 |
| Harness capture (total, s) | 0.0 | 12.9 |
| Cost estimate (USD; including retries) | unknown | 0.22 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 10,209 | 0 | 32 | 23,393 | 267,840 | 3,218 | 2.0 | 1.2 | 58.2 | 59.4 | 0.00 | 0.15 | Here is the combined report. The file itself was attached, but I could not confirm the filename on the page. New tab: New Window Top left: LEFT Top middle: MID |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 23 | 291,265 | 58.2 | 0.216 | unknown | known |
