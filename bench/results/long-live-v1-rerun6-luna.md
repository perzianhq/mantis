# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 9 exact recovery rows = 9 logical runs; 9 recorded so far; 9 total attempts including retries.
- Exact rows: `longlive-internet-window-frames-upload|tree|1`, `longlive-internet-window-frames-upload|tree|2`, `longlive-internet-window-frames-upload|tree|3`, `longlive-selenium-window-frames-upload|tree|1`, `longlive-selenium-window-frames-upload|tree|2`, `longlive-selenium-window-frames-upload|tree|3`, `longlive-met-monet-search|mantis|1`, `longlive-met-monet-search|mantis|2`, `longlive-gutenberg-dickens-search|mantis|3`.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 3 / 3 | 6 / 6 |
| After reruns / merged correct | 3 / 3 | 6 / 6 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 3 / 3 | 6 / 6 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 56 | 145 |
| MCP tool errors (including retries) | 0 | 7 |
| Browser observation text (observed chars) | 143,429 | 120,786 |
| Browser observation images (observed blocks) | 0 | 4 |
| Normal input tokens (total) | 99,482 | 212,994 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 1,262,976 | 2,392,064 |
| Output tokens (total) | 3,446 | 8,072 |
| Total input tokens incl. cache (legacy) | 1,362,458 | 2,605,058 |
| MCP startup (total, s) | 6.2 | 12.4 |
| CLI startup (total, s) | 2.5 | 3.9 |
| CLI execution (total, s) | 232.3 | 417.0 |
| CLI wall (total, s) | 234.8 | 420.9 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.5 | 1.0 |
| Harness capture (total, s) | 11.3 | 85.6 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-dickens-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 10 | 0 | 26,414 | 0 | 16,478 | 0 | 189,056 | 858 | 2.1 | 0.8 | 53.3 | 54.1 | 0.00 | 0.20 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: the second advanced-search results  |
| `longlive-met-monet-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 24 | 0 | 62,406 | 0 | 33,423 | 0 | 579,712 | 1,435 | 2.1 | 0.9 | 98.4 | 99.3 | 0.00 | 0.15 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: |
| `longlive-met-monet-search` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 54,609 | 0 | 49,581 | 0 | 494,208 | 1,153 | 2.1 | 0.8 | 80.6 | 81.4 | 0.00 | 0.18 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 23 | 2 | 26,364 | 0 | 39,893 | 0 | 385,920 | 1,122 | 2.1 | 0.8 | 60.7 | 61.5 | 0.00 | 0.18 | Current original tab: File Uploader at `/upload`, with the supplied `README.md` selected in the file control. Upload was not submitted. The new tab remains open |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 24 | 2 | 18,979 | 2 | 36,347 | 0 | 301,824 | 1,138 | 2.1 | 0.8 | 66.7 | 67.5 | 0.00 | 0.18 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: README.md Upload: not submitted Earlier observations: “New |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 24 | 2 | 25,422 | 1 | 35,140 | 0 | 426,240 | 1,286 | 2.1 | 0.8 | 95.5 | 96.3 | 0.00 | 0.17 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM In the earlier Nested Frames view, the top parent frameset contained the |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 16,089 | 0 | 33,671 | 0 | 430,592 | 1,457 | 2.0 | 0.5 | 61.9 | 62.4 | 0.00 | 0.15 | The named result tab showed **“Success!”** and both h1 headings: **“List of stuff”** and **“Almost empty.”** I revisited it and confirmed those headings remaine |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 17,249 | 0 | 25,221 | 0 | 381,568 | 1,411 | 2.0 | 0.5 | 65.9 | 66.5 | 0.00 | 0.15 | The original tab is currently on the Web form page. The File input was given the harness-provided `README.md`; I did not click Submit. The two retained tabs are |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 25 | 1 | 16,683 | 1 | 42,722 | 0 | 465,920 | 1,658 | 2.0 | 0.6 | 66.2 | 66.7 | 0.00 | 0.15 | The original tab is on the Web form with `README.md` selected. The visible form still shows its inputs and the Submit button; I did not click Submit. Both new t |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-gutenberg-dickens-search` | Mantis | 3 | 1 | success | n/a | 1200 | 10 | 205,534 | 53.3 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 1 | 1 | success | n/a | 1200 | 24 | 613,135 | 98.4 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 2 | 1 | success | n/a | 1200 | 22 | 543,789 | 80.6 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 23 | 425,813 | 60.7 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 24 | 338,171 | 66.7 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 24 | 461,380 | 95.5 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 23 | 464,263 | 61.9 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 26 | 406,789 | 65.9 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 25 | 508,642 | 66.2 | unknown | unknown | known |
