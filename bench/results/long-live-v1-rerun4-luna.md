# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 15 exact recovery rows = 15 logical runs; 15 recorded so far; 19 total attempts including retries.
- Exact rows: `longlive-wiki-moons|mantis|1`, `longlive-wiki-moons|mantis|3`, `longlive-gutenberg-gothic|tree|1`, `longlive-gutenberg-gothic|tree|2`, `longlive-gutenberg-gothic|tree|3`, `longlive-gutenberg-dickens-search|mantis|3`, `longlive-met-monet-search|mantis|1`, `longlive-met-monet-search|mantis|2`, `longlive-met-rembrandt-search|tree|1`, `longlive-internet-window-frames-upload|tree|1`, `longlive-internet-window-frames-upload|tree|2`, `longlive-internet-window-frames-upload|tree|3`, `longlive-selenium-window-frames-upload|tree|1`, `longlive-selenium-window-frames-upload|tree|2`, `longlive-selenium-window-frames-upload|tree|3`.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 3 / 5 | 3 / 6 |
| After reruns / merged correct | 3 / 5 | 3 / 6 |
| Rows with unknown usage | 2 rows have unknown usage | 7 rows have unknown usage |
| Correct (legacy terminal row) | 3 / 5 | 3 / 6 |
| Connection-failure attempts | 0 | 8 |
| Logical runs ending in connection failure | 0 | 4 |
| Other attempted failures | 2 | 3 |
| Tool calls (including retries) | 63 | 81 |
| MCP tool errors (including retries) | 2 | 0 |
| Browser observation text (observed chars) | 123,957 | 446,303 |
| Browser observation images (observed blocks) | 0 | 1 |
| Normal input tokens (total) | unknown | unknown |
| Cache-write input tokens (total) | unknown | unknown |
| Cache-read input tokens (total) | unknown | unknown |
| Output tokens (total) | unknown | unknown |
| Total input tokens incl. cache (legacy) | unknown | unknown |
| MCP startup (total, s) | 10.3 | 29.0 |
| CLI startup (total, s) | 3.6 | 9.7 |
| CLI execution (total, s) | 298.6 | 329.3 |
| CLI wall (total, s) | 302.2 | 339.0 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 1.1 | 2.9 |
| Harness capture (total, s) | 12.8 | 77.8 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-moons` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 8 | 1 | 21,655 | 0 | 23,326 | 0 | 151,296 | 770 | 2.1 | 0.8 | 42.8 | 43.6 | 0.00 | 0.24 | I used Wikipedia’s on-site search for Io and Mimas. The current page is Mimas (`https://en.wikipedia.org/wiki/Mimas`), but it shows no visible content. I could  |
| `longlive-wiki-moons` | Mantis | 3 | cli_error | cli_error | cli_error | 1 | n/a | 1200 | 29 | 1 | 30,759 | 0 | unknown | unknown | unknown | unknown | 2.1 | 0.9 | 105.5 | 106.4 | 0.00 | 0.21 | codex CLI returned an error result |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 6 | 0 | 63,601 | 0 | 42,708 | 0 | 109,568 | 698 | 2.1 | 1.0 | 40.6 | 41.5 | 0.00 | 0.23 | I searched the catalogue for `84`; it returned *Frankenstein; or, The modern Prometheus* by Mary Wollstonecraft Shelley. The page currently visible is #84, with |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 30 | 0 | 177,364 | 0 | 57,182 | 0 | 254,208 | 1,181 | 2.1 | 1.0 | 96.1 | 97.0 | 0.00 | 0.21 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture of  |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 181,741 | 1 | 75,603 | 0 | 240,128 | 1,557 | 2.1 | 1.0 | 87.9 | 88.9 | 0.00 | 0.24 | Currently visible: Project Gutenberg’s #84 page at **https://www.gutenberg.org/ebooks/84**, positioned at “About this eBook.” Its displayed title, author, relea |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 11 | 0 | 26,415 | 0 | 35,352 | 0 | 188,160 | 866 | 2.1 | 1.0 | 63.9 | 64.9 | 0.00 | 0.21 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 The release dates and LoC codes were displayed on each |
| `longlive-met-monet-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 4 | 0 | 16,944 | 0 | 20,455 | 0 | 126,336 | 642 | 2.0 | 0.5 | 28.5 | 29.0 | 0.00 | 0.24 | I reached the Monet search, but couldn’t continue: the browser controls for clicking and filling filters returned “not a function,” so I couldn’t enable Has ima |
| `longlive-met-monet-search` | Mantis | 2 | cli_error | cli_error | cli_error | 1 | n/a | 1200 | 11 | 0 | 28,184 | 0 | unknown | unknown | unknown | unknown | 2.0 | 0.4 | 57.9 | 58.3 | 0.00 | 0.20 | codex CLI returned an error result |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | cli_error | cli_error | cli_error | 1 | n/a | 1200 | 5 | 0 | 20,737 | 0 | unknown | unknown | unknown | unknown | 2.0 | 0.4 | 39.9 | 40.3 | 0.00 | 0.20 | codex CLI returned an error result |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | cli_error | cli_error | cli_error | 1 | n/a | 1200 | 5 | 0 | 2,374 | 0 | unknown | unknown | unknown | unknown | 2.0 | 0.5 | 25.7 | 26.1 | 0.00 | 0.26 | codex CLI returned an error result |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | cli_error | cli_error | cli_error | 1 | n/a | 1200 | 1 | 0 | 486 | 0 | unknown | unknown | unknown | unknown | 2.0 | 0.5 | 14.7 | 15.2 | 0.00 | 0.19 | codex CLI returned an error result |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | connection_failure | connection_failure | connection_failure | 2 | n/a | 1200 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 4.0 | 1.6 | 4.7 | 6.3 | 0.00 | 0.48 | MCP connection failed: no server reported connected |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | connection_failure | connection_failure | connection_failure | 2 | n/a | 1200 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 4.0 | 1.7 | 5.9 | 7.6 | 0.00 | 0.41 | MCP connection failed: no server reported connected |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | connection_failure | connection_failure | connection_failure | 2 | n/a | 1200 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 4.5 | 1.0 | 8.2 | 9.3 | 0.00 | 0.32 | MCP connection failed: no server reported connected |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | connection_failure | connection_failure | connection_failure | 2 | n/a | 1200 | 0 | 0 | 0 | 0 | unknown | unknown | unknown | unknown | 4.0 | 1.1 | 5.6 | 6.8 | 0.00 | 0.34 | MCP connection failed: no server reported connected |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-moons` | Mantis | 1 | 1 | success | n/a | 1200 | 8 | 174,622 | 42.8 | unknown | unknown | known |
| `longlive-wiki-moons` | Mantis | 3 | 1 | cli_error | n/a | 1200 | 29 | unknown | 105.5 | unknown | unknown | unknown |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 6 | 152,276 | 40.6 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 30 | 311,390 | 96.1 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 34 | 315,731 | 87.9 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | 1 | success | n/a | 1200 | 11 | 223,512 | 63.9 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 1 | 1 | success | n/a | 1200 | 4 | 146,791 | 28.5 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 2 | 1 | cli_error | n/a | 1200 | 11 | unknown | 57.9 | unknown | unknown | unknown |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | 1 | cli_error | n/a | 1200 | 5 | unknown | 39.9 | unknown | unknown | unknown |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | cli_error | n/a | 1200 | 5 | unknown | 25.7 | unknown | unknown | unknown |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | cli_error | n/a | 1200 | 1 | unknown | 14.7 | unknown | unknown | unknown |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | connection_failure | n/a | 1200 | 0 | unknown | 2.6 | unknown | unknown | unknown |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 2 | connection_failure | n/a | 1200 | 0 | unknown | 2.1 | unknown | unknown | unknown |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | connection_failure | n/a | 1200 | 0 | unknown | 3.1 | unknown | unknown | unknown |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 2 | connection_failure | n/a | 1200 | 0 | unknown | 2.8 | unknown | unknown | unknown |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | connection_failure | n/a | 1200 | 0 | unknown | 3.0 | unknown | unknown | unknown |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 2 | connection_failure | n/a | 1200 | 0 | unknown | 5.2 | unknown | unknown | unknown |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | connection_failure | n/a | 1200 | 0 | unknown | 2.9 | unknown | unknown | unknown |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 2 | connection_failure | n/a | 1200 | 0 | unknown | 2.7 | unknown | unknown | unknown |
