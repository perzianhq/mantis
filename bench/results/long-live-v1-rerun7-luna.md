# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 7 exact recovery rows = 7 logical runs; 7 recorded so far; 7 total attempts including retries.
- Exact rows: `longlive-wiki-moons|mantis|3`, `longlive-gutenberg-gothic|tree|1`, `longlive-gutenberg-gothic|tree|2`, `longlive-gutenberg-gothic|tree|3`, `longlive-selenium-window-frames-upload|tree|1`, `longlive-selenium-window-frames-upload|tree|2`, `longlive-selenium-window-frames-upload|tree|3`.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 1 / 1 | 6 / 6 |
| After reruns / merged correct | 1 / 1 | 6 / 6 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 1 / 1 | 6 / 6 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 6 | 205 |
| MCP tool errors (including retries) | 0 | 2 |
| Browser observation text (observed chars) | 14,665 | 851,758 |
| Browser observation images (observed blocks) | 0 | 2 |
| Normal input tokens (total) | 20,006 | 231,631 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 115,200 | 1,887,872 |
| Output tokens (total) | 660 | 8,839 |
| Total input tokens incl. cache (legacy) | 135,206 | 2,119,503 |
| MCP startup (total, s) | 2.1 | 12.5 |
| CLI startup (total, s) | 0.6 | 3.4 |
| CLI execution (total, s) | 38.9 | 395.0 |
| CLI wall (total, s) | 39.5 | 398.4 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.2 | 1.0 |
| Harness capture (total, s) | 1.9 | 129.7 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-moons` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 6 | 0 | 14,665 | 0 | 20,006 | 0 | 115,200 | 660 | 2.1 | 0.6 | 38.9 | 39.5 | 0.00 | 0.20 | I opened Io through Wikipedia’s on-site search, then viewed the pinned revision. Its infobox shows mean radius **1824.2±0.2 km**, sidereal orbital period **1.76 |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 36 | 0 | 156,795 | 0 | 36,102 | 0 | 149,376 | 1,208 | 2.1 | 0.6 | 55.4 | 56.0 | 0.00 | 0.18 | The current page is #84, with “About this eBook” and its metadata visible. The title and credited author were observed on the catalogue result and eBook pages.  |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 54 | 0 | 369,501 | 1 | 48,685 | 0 | 354,816 | 1,702 | 2.1 | 0.6 | 83.1 | 83.8 | 0.00 | 0.17 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 267,423 | 0 | 46,209 | 0 | 167,552 | 1,356 | 2.1 | 0.6 | 58.8 | 59.4 | 0.00 | 0.17 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture of  |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 27 | 1 | 19,473 | 1 | 35,748 | 0 | 455,296 | 1,724 | 2.1 | 0.6 | 70.7 | 71.3 | 0.00 | 0.16 | I completed the tab sequence and left the original tab on the Web form with `README.md` selected. The visible form confirms the filename is selected. **Submit w |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 27 | 0 | 17,840 | 0 | 27,216 | 0 | 322,176 | 1,419 | 2.1 | 0.6 | 61.7 | 62.2 | 0.00 | 0.17 | The retained result tab currently shows **“List of stuff”** and **“Almost empty”** as its two H1 headings, plus the success paragraph **“Success!”**. I rechecke |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 27 | 1 | 20,726 | 0 | 37,671 | 0 | 438,656 | 1,430 | 2.0 | 0.4 | 65.3 | 65.7 | 0.00 | 0.15 | The **original tab** is currently on the Web form page. The File input contains the harness-provided `README.md`; I did not click Submit. The result tab and ano |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-moons` | Mantis | 3 | 1 | success | n/a | 1200 | 6 | 135,206 | 38.9 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 36 | 185,478 | 55.4 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 54 | 403,501 | 83.1 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 34 | 213,761 | 58.8 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 27 | 491,044 | 70.7 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 27 | 349,392 | 61.7 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 27 | 476,327 | 65.3 | unknown | unknown | known |
