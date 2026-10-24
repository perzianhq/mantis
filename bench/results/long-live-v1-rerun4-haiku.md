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
| Tool calls (including retries) | 28 | 104 |
| MCP tool errors (including retries) | 2 | 2 |
| Browser observation text (observed chars) | 27,100 | 204,740 |
| Browser observation images (observed blocks) | 0 | 4 |
| Normal input tokens (total) | 44 | 156 |
| Cache-write input tokens (total) | 29,760 | 129,537 |
| Cache-read input tokens (total) | 380,290 | 2,878,494 |
| Output tokens (total) | 4,844 | 19,164 |
| Total input tokens incl. cache (legacy) | 410,094 | 3,008,187 |
| MCP startup (total, s) | 2.1 | 6.2 |
| CLI startup (total, s) | 1.8 | 6.1 |
| CLI execution (total, s) | 52.9 | 313.0 |
| CLI wall (total, s) | 54.7 | 319.1 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.2 | 0.5 |
| Harness capture (total, s) | 1.4 | 60.3 |
| Cost estimate (USD; including retries) | 0.30 | 1.64 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 46 | 2 | 170,791 | 1 | 74 | 86,136 | 2,010,415 | 7,807 | 2.0 | 2.0 | 166.0 | 168.0 | 0.00 | 0.15 | 84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR 345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \|  |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 25 | 0 | 11,453 | 0 | 36 | 15,183 | 323,559 | 3,526 | 2.1 | 2.2 | 66.5 | 68.7 | 0.00 | 0.20 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md (set through the file chooser to the harness path |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 22,496 | 3 | 46 | 28,218 | 544,520 | 7,831 | 2.1 | 1.9 | 80.5 | 82.4 | 0.00 | 0.19 | The web form now shows README.md selected in File input, with no Submit clicked. Both retained tabs still show their headings. **Result tab (window name "resul |
| `longlive-selenium-window-frames-upload` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 28 | 2 | 27,100 | 0 | 44 | 29,760 | 380,290 | 4,844 | 2.1 | 1.8 | 52.9 | 54.7 | 0.00 | 0.19 | The Web form tab now shows README.md selected on "File input" and no Submit was clicked. The two retained tabs are still open. **Result tab** (opened from "Ope |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 46 | 2,096,625 | 166.0 | 1.043 | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 25 | 338,778 | 66.5 | 0.207 | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 33 | 572,784 | 80.5 | 0.387 | unknown | known |
| `longlive-selenium-window-frames-upload` | Mantis | 3 | 1 | success | n/a | 1200 | 28 | 410,094 | 52.9 | 0.298 | unknown | known |
