# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 4 exact recovery rows = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Exact rows: `longlive-gutenberg-gothic|tree|2`, `longlive-internet-window-frames-upload|tree|2`, `longlive-selenium-window-frames-upload|tree|1`, `longlive-selenium-window-frames-upload|mantis|3`.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 1 / 1 | 3 / 3 |
| After reruns / merged correct | 1 / 1 | 3 / 3 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 1 / 1 | 3 / 3 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 20 | 125 |
| MCP tool errors (including retries) | 1 | 1 |
| Browser observation text (observed chars) | 16,666 | 204,135 |
| Browser observation images (observed blocks) | 0 | 8 |
| Normal input tokens (total) | 34 | 152 |
| Cache-write input tokens (total) | 24,019 | 160,669 |
| Cache-read input tokens (total) | 252,656 | 3,353,020 |
| Output tokens (total) | 4,143 | 20,040 |
| Total input tokens incl. cache (legacy) | 276,709 | 3,513,841 |
| MCP startup (total, s) | 2.1 | 6.2 |
| CLI startup (total, s) | 1.5 | 5.5 |
| CLI execution (total, s) | 48.8 | 358.2 |
| CLI wall (total, s) | 50.3 | 363.7 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.2 | 0.6 |
| Harness capture (total, s) | 1.4 | 73.0 |
| Cost estimate (USD; including retries) | 0.23 | 1.91 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 69 | 1 | 179,058 | 1 | 82 | 100,016 | 2,677,312 | 10,943 | 2.0 | 1.9 | 231.2 | 233.1 | 0.00 | 0.20 | \| eBook number \| displayed title \| credited Author \| YYYY-MM-DD \| LoC code \| \|---\|---\|---\|---\|---\| \| 84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mar |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 10,400 | 2 | 32 | 26,181 | 269,712 | 2,769 | 2.1 | 1.9 | 55.2 | 57.1 | 0.00 | 0.17 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: not submitted The new tab was read earli |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 32 | 0 | 14,677 | 5 | 38 | 34,472 | 405,996 | 6,328 | 2.1 | 1.8 | 71.7 | 73.5 | 0.00 | 0.21 | Both iframe pages show the same heading and frame content, and README.md is selected on the Web form without a submit. - **Result tab** (`resultPage.html`, win |
| `longlive-selenium-window-frames-upload` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 20 | 1 | 16,666 | 0 | 34 | 24,019 | 252,656 | 4,143 | 2.1 | 1.5 | 48.8 | 50.3 | 0.00 | 0.17 | Everything you asked for is done, and the original tab is on the Web form with README.md selected and not submitted. **Result tab** (opened from "Open new wind |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 69 | 2,777,410 | 231.2 | 1.343 | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 24 | 295,925 | 55.2 | 0.221 | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 32 | 440,506 | 71.7 | 0.346 | unknown | known |
| `longlive-selenium-window-frames-upload` | Mantis | 3 | 1 | success | n/a | 1200 | 20 | 276,709 | 48.8 | 0.228 | unknown | known |
