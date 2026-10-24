# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 1 runs in parallel.
- Scope: 1 tasks × 1 approaches × 1 runs = 1 logical runs; 1 recorded so far; 1 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 1 / 1 |
| After reruns / merged correct | 1 / 1 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 1 / 1 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 25 |
| MCP tool errors (including retries) | 3 |
| Browser observation text (observed chars) | 15,635 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 24 |
| Cache-write input tokens (total) | 19,003 |
| Cache-read input tokens (total) | 194,052 |
| Output tokens (total) | 5,528 |
| Total input tokens incl. cache (legacy) | 213,079 |
| MCP startup (total, s) | 2.0 |
| CLI startup (total, s) | 1.2 |
| CLI execution (total, s) | 40.0 |
| CLI wall (total, s) | 41.2 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.2 |
| Harness capture (total, s) | 1.1 |
| Cost estimate (USD; including retries) | 0.21 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-student` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 25 | 3 | 15,635 | 0 | 24 | 19,003 | 194,052 | 5,528 | 2.0 | 1.2 | 40.0 | 41.2 | 0.00 | 0.18 | Prepared: Ada Example; Four; Eggs and Sausages; unsubmitted The second read confirms the reviewed values are on the page: email `ada@example.com` (kept), age 3 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-student` | Mantis | 1 | 1 | success | n/a | 1200 | 25 | 213,079 | 40.0 | 0.212 | unknown | known |
