# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 15 exact recovery rows = 15 logical runs; 15 recorded so far; 15 total attempts including retries.
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
| First-pass correct (attempt 1) | 5 / 5 | 10 / 10 |
| After reruns / merged correct | 5 / 5 | 10 / 10 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 5 / 5 | 10 / 10 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 137 | 301 |
| MCP tool errors (including retries) | 4 | 21 |
| Browser observation text (observed chars) | 283,279 | 845,251 |
| Browser observation images (observed blocks) | 0 | 1 |
| Normal input tokens (total) | 194,622 | 361,100 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 1,865,472 | 4,798,464 |
| Output tokens (total) | 8,525 | 15,994 |
| Total input tokens incl. cache (legacy) | 2,060,094 | 5,159,564 |
| MCP startup (total, s) | 10.9 | 21.9 |
| CLI startup (total, s) | 2.8 | 5.2 |
| CLI execution (total, s) | 534.5 | 877.1 |
| CLI wall (total, s) | 537.3 | 882.3 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 1.0 | 1.9 |
| Harness capture (total, s) | 13.9 | 208.5 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-moons` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 59 | 1 | 93,169 | 0 | 24,075 | 0 | 293,120 | 2,844 | 2.1 | 0.6 | 176.1 | 176.7 | 0.00 | 0.18 | Io \| 1824.2 km \| 1.769 d \| 1610-01-08 Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08 Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07 Callisto \| 2410.3 km \| 16.6 |
| `longlive-wiki-moons` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 13 | 0 | 38,892 | 0 | 34,256 | 0 | 182,272 | 1,116 | 2.1 | 0.6 | 76.2 | 76.9 | 0.00 | 0.23 | I opened the specified pinned revision URLs. The first Wikipedia search for “Io” led to the disambiguation page, and I did not complete on-site searches for the |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 59 | 0 | 212,298 | 0 | 54,982 | 0 | 418,816 | 2,215 | 2.1 | 0.6 | 131.6 | 132.3 | 0.00 | 0.22 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 76,017 | 0 | 27,986 | 0 | 164,608 | 1,071 | 2.1 | 0.6 | 75.9 | 76.6 | 0.00 | 0.23 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 39 | 0 | 90,672 | 0 | 67,585 | 0 | 1,245,952 | 2,668 | 2.1 | 0.6 | 137.1 | 137.8 | 0.00 | 0.26 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture of  |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 17 | 3 | 31,686 | 0 | 42,443 | 0 | 305,152 | 1,702 | 2.1 | 0.6 | 78.8 | 79.5 | 0.00 | 0.18 | 98 \| A Tale of Two Cities \| 1994-01-01 \| PR 1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: Advanced Search page two, with Dick |
| `longlive-met-monet-search` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 63,284 | 0 | 65,043 | 0 | 585,472 | 1,576 | 2.7 | 0.5 | 110.7 | 111.2 | 0.00 | 0.21 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: |
| `longlive-met-monet-search` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 22 | 0 | 56,248 | 0 | 28,805 | 0 | 499,456 | 1,287 | 2.0 | 0.4 | 92.6 | 93.0 | 0.00 | 0.18 | 437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm 437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm Taller: |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 26 | 1 | 374,997 | 0 | 49,528 | 0 | 894,464 | 1,781 | 2.0 | 0.4 | 153.0 | 153.4 | 0.00 | 0.18 | 437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm 437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm Taller: 437394 Curren |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 26 | 6 | 10,071 | 0 | 21,501 | 0 | 323,328 | 1,249 | 2.0 | 0.5 | 74.7 | 75.2 | 0.00 | 0.19 | New tab: New Window Top left: LEFT Top middle: MIDDLE Top right: RIGHT Bottom: BOTTOM Selected file: not selected Upload: not submitted The top left, middle, a |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 22 | 4 | 16,684 | 0 | 26,983 | 0 | 353,024 | 1,273 | 2.0 | 0.6 | 71.1 | 71.7 | 0.00 | 0.17 | New tab: New Window (rechecked; retained open) Top left: LEFT (child frame of the top parent frameset) Top middle: MIDDLE (child frame of the top parent frame |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 18 | 3 | 22,844 | 0 | 42,515 | 0 | 272,768 | 956 | 3.5 | 0.5 | 62.1 | 62.6 | 0.00 | 0.17 | New tab: New Window — observed in the retained site-created tab; it remains open. Top left: LEFT — child frame in the top parent frameset. Top middle: MIDDLE —  |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 27 | 3 | 14,451 | 1 | 28,748 | 0 | 396,928 | 1,766 | 2.0 | 0.4 | 61.7 | 62.1 | 0.00 | 0.17 | The original tab is on the Web form, with no file selected. I did not click Submit. The README upload was blocked because the browser tool does not allow access |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 25 | 2 | 13,812 | 0 | 24,643 | 0 | 299,392 | 1,431 | 2.0 | 0.4 | 53.2 | 53.6 | 0.00 | 0.15 | The result tab showed **“Success!”** with h1 headings **“List of stuff”** and **“Almost empty.”** I rechecked it before finishing. Both iframe pages showed the |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 25 | 2 | 13,405 | 0 | 16,629 | 0 | 429,184 | 1,584 | 2.0 | 0.4 | 56.6 | 57.0 | 0.00 | 0.15 | The named result tab showed the success text **“Success!”** and both h1 headings: **“List of stuff”** and **“Almost empty.”** I revisited it and confirmed those |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-moons` | Mantis | 1 | 1 | success | n/a | 1200 | 59 | 317,195 | 176.1 | unknown | unknown | known |
| `longlive-wiki-moons` | Mantis | 3 | 1 | success | n/a | 1200 | 13 | 216,528 | 76.2 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 59 | 473,798 | 131.6 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 34 | 192,594 | 75.9 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 39 | 1,313,537 | 137.1 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Mantis | 3 | 1 | success | n/a | 1200 | 17 | 347,595 | 78.8 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 1 | 1 | success | n/a | 1200 | 26 | 650,515 | 110.7 | unknown | unknown | known |
| `longlive-met-monet-search` | Mantis | 2 | 1 | success | n/a | 1200 | 22 | 528,261 | 92.6 | unknown | unknown | known |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 26 | 943,992 | 153.0 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 26 | 344,829 | 74.7 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 22 | 380,007 | 71.1 | unknown | unknown | known |
| `longlive-internet-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 18 | 315,283 | 62.1 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 27 | 425,676 | 61.7 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 25 | 324,035 | 53.2 | unknown | unknown | known |
| `longlive-selenium-window-frames-upload` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 25 | 445,813 | 56.6 | unknown | unknown | known |
