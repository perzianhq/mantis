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
| Tool calls (including retries) | 36 |
| MCP tool errors (including retries) | 7 |
| Browser observation text (observed chars) | 10,556 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 36 |
| Cache-write input tokens (total) | 34,281 |
| Cache-read input tokens (total) | 400,767 |
| Output tokens (total) | 16,693 |
| Total input tokens incl. cache (legacy) | 435,084 |
| MCP startup (total, s) | 2.0 |
| CLI startup (total, s) | 1.6 |
| CLI execution (total, s) | 98.6 |
| CLI wall (total, s) | 100.1 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.2 |
| Harness capture (total, s) | 1.3 |
| Cost estimate (USD; including retries) | 0.50 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-select` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 36 | 7 | 10,556 | 0 | 36 | 34,281 | 400,767 | 16,693 | 2.0 | 1.6 | 98.6 | 100.1 | 0.00 | 0.19 | selectWithoutMultiple \| two selectWithMultipleEqualsMultiple \| Emmental, Cheddar selectWithEmptyStringMultiple \| one, two selectWithMultipleWithoutValue \| two s |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-select` | Mantis | 1 | 1 | success | n/a | 1200 | 36 | 435,084 | 98.6 | 0.499 | unknown | known |
