# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 6 runs in parallel.
- Scope: 3 tasks × 2 approaches × 1 runs = 6 logical runs; 6 recorded so far; 6 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
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
| Tool calls (including retries) | 80 | 75 |
| MCP tool errors (including retries) | 6 | 3 |
| Browser observation text (observed chars) | 36,110 | 41,412 |
| Browser observation images (observed blocks) | 2 | 3 |
| Normal input tokens (total) | 124 | 96 |
| Cache-write input tokens (total) | 55,630 | 56,154 |
| Cache-read input tokens (total) | 1,004,443 | 906,480 |
| Output tokens (total) | 21,351 | 14,230 |
| Total input tokens incl. cache (legacy) | 1,060,197 | 962,730 |
| MCP startup (total, s) | 6.4 | 6.4 |
| CLI startup (total, s) | 9.4 | 9.1 |
| CLI execution (total, s) | 423.4 | 349.2 |
| CLI wall (total, s) | 432.8 | 358.3 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.7 | 0.7 |
| Harness capture (total, s) | 104.5 | 54.8 |
| Cost estimate (USD; including retries) | 0.83 | 0.70 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-student` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 24 | 2 | 12,995 | 1 | 30 | 24,572 | 272,271 | 12,706 | 2.2 | 3.5 | 81.4 | 84.8 | 0.00 | 0.23 | The Form Page is partly prepared and unsubmitted, but not complete. I could not map four of the requested controls to their ids with the browser tools available |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 19 | 2 | 14,169 | 0 | 22 | 17,042 | 187,542 | 4,470 | 2.2 | 2.7 | 42.9 | 45.6 | 0.00 | 0.28 | Prepared: Ada Example; Four; Eggs and Sausages; unsubmitted The form page now shows the reviewed values: email ada@example.com, age 36, working "Reviewed profi |
| `longlive-internet-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 33 | 3 | 6,987 | 0 | 54 | 13,042 | 411,547 | 3,558 | 2.2 | 3.1 | 293.9 | 297.0 | 0.00 | 0.23 | New Window: New Window, Top left: LEFT, Top middle: MIDDLE, Top right: RIGHT, Bottom: BOTTOM, Selected file: README.md, Upload: not submitted. The first three  |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 25 | 1 | 11,126 | 0 | 38 | 14,936 | 336,105 | 3,604 | 2.2 | 3.1 | 234.2 | 237.3 | 0.00 | 0.17 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: not submitted Notes: - The first navigat |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 23 | 1 | 16,128 | 1 | 40 | 18,016 | 320,625 | 5,087 | 2.1 | 2.9 | 48.1 | 51.0 | 0.00 | 0.26 | Everything requested is done, and the Web form tab shows README.md selected in the File input with no Submit clicked. **Result tab (opened by "Open new window" |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 31 | 0 | 16,117 | 3 | 36 | 24,176 | 382,833 | 6,156 | 2.1 | 3.4 | 72.1 | 75.4 | 0.00 | 0.21 | Everything is done. The Web form now shows README.md selected in File input, and I did not click Submit. **Result tab ("We Arrive Here", window name "result")* |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-student` | Mantis | 1 | 1 | success | n/a | 1200 | 24 | 296,873 | 81.4 | 0.365 | unknown | known |
| `longlive-form-selenium-student` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 19 | 204,606 | 42.9 | 0.187 | unknown | known |
| `longlive-internet-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 33 | 424,643 | 293.9 | 0.226 | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 25 | 351,079 | 234.2 | 0.211 | unknown | known |
| `longlive-selenium-window-frames-upload` | Mantis | 1 | 1 | success | n/a | 1200 | 23 | 338,681 | 48.1 | 0.24 | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 31 | 407,045 | 72.1 | 0.298 | unknown | known |
