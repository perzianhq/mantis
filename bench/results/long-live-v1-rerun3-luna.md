# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 3; 6 runs in parallel.
- Scope: 13 exact recovery rows = 13 logical runs; 13 recorded so far; 13 total attempts including retries.
- Exact rows: `longlive-wiki-probes|tree|1`, `longlive-wiki-probes|tree|2`, `longlive-wiki-probes|tree|3`, `longlive-wiki-moons|tree|3`, `longlive-gutenberg-novels|tree|1`, `longlive-gutenberg-novels|tree|2`, `longlive-gutenberg-gothic|tree|1`, `longlive-gutenberg-gothic|tree|2`, `longlive-gutenberg-gothic|tree|3`, `longlive-met-vangogh|tree|1`, `longlive-met-vangogh|tree|2`, `longlive-gutenberg-dickens-search|tree|2`, `longlive-met-rembrandt-search|tree|1`.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 0 / 0 | 13 / 13 |
| After reruns / merged correct | 0 / 0 | 13 / 13 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 0 / 0 | 13 / 13 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 0 | 378 |
| MCP tool errors (including retries) | 0 | 3 |
| Browser observation text (observed chars) | 0 | 5,295,077 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | unknown | 556,341 |
| Cache-write input tokens (total) | unknown | 0 |
| Cache-read input tokens (total) | unknown | 5,185,920 |
| Output tokens (total) | unknown | 19,066 |
| Total input tokens incl. cache (legacy) | unknown | 5,742,261 |
| MCP startup (total, s) | 0.0 | 27.4 |
| CLI startup (total, s) | unknown | 8.4 |
| CLI execution (total, s) | unknown | 990.3 |
| CLI wall (total, s) | unknown | 998.7 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.0 | 2.3 |
| Harness capture (total, s) | 0.0 | 344.1 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 52,518 | 0 | 48,433 | 0 | 276,096 | 1,894 | 2.1 | 0.6 | 81.3 | 81.9 | 0.00 | 0.17 | Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| 258 kg Pioneer 11 \| 1973-04-06 \| |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 23 | 0 | 91,174 | 0 | 26,678 | 0 | 247,296 | 1,448 | 2.1 | 0.6 | 70.7 | 71.3 | 0.00 | 0.19 | Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| 258 kg Pioneer 11 \| 1973-04-06 \| |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 47,197 | 0 | 31,212 | 0 | 284,160 | 1,855 | 2.1 | 0.7 | 77.8 | 78.5 | 0.00 | 0.17 | Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| 258 kg Pioneer 11 \| 1973-04-06 \| |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 62 | 1 | 3,830,705 | 0 | 44,238 | 0 | 465,664 | 1,994 | 2.1 | 0.7 | 118.4 | 119.1 | 0.00 | 0.20 | Io \| 1824.2 km \| 1.769 d \| 1610-01-08 Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08 Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07 Callisto \| 2410.3 km \| 16.6 |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 200,148 | 0 | 55,430 | 0 | 330,112 | 1,574 | 2.1 | 0.7 | 60.3 | 61.0 | 0.00 | 0.18 | 1342 \| Pride and Prejudice \| 1998-06-01 \| PR 161 \| Sense and Sensibility \| 1994-09-01 \| PR 158 \| Emma \| 1994-08-01 \| PR 141 \| Mansfield Park \| 1994-06-01 \| PR 1 |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 33 | 0 | 126,763 | 0 | 46,867 | 0 | 199,680 | 1,129 | 2.1 | 0.7 | 53.3 | 53.9 | 0.00 | 0.18 | 1342 \| Pride and Prejudice \| 1998-06-01 \| PR 161 \| Sense and Sensibility \| 1994-09-01 \| PR 158 \| Emma \| 1994-08-01 \| PR 141 \| Mansfield Park \| 1994-06-01 \| PR 1 |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 202,596 | 0 | 39,245 | 0 | 131,712 | 940 | 2.0 | 0.5 | 49.3 | 49.8 | 0.00 | 0.17 | 84 \| Frankenstein; or, The modern Prometheus \| Mary Wollstonecraft Shelley \| 1993-10-01 \| PR 345 \| Dracula \| Bram Stoker \| 1995-10-01 \| PR 174 \| The Picture |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 136,571 | 0 | 32,626 | 0 | 140,288 | 949 | 2.0 | 0.5 | 40.0 | 40.6 | 0.00 | 0.18 | 84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR 345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01  |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 1200 | 46 | 0 | 125,230 | 0 | 56,179 | 0 | 1,785,216 | 3,090 | 2.0 | 0.4 | 129.2 | 129.6 | 0.00 | 0.16 | Currently visible: #84’s “About this eBook” section at https://www.gutenberg.org/ebooks/84, including its title, Author, LoC Class, eBook-No. and Release Date.  |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 17 | 0 | 44,548 | 0 | 34,392 | 0 | 361,472 | 1,220 | 2.0 | 1.5 | 72.7 | 74.2 | 0.00 | 0.19 | 436528 \| Irises \| 1890 \| Oil on canvas \| 58.187 \| 73.7 x 92.1 cm 436532 \| Self-Portrait with a Straw Hat (obverse: The Potato Peeler) \| 1887 \| Oil on canvas \| 6 |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 20 | 1 | 86,435 | 0 | 32,105 | 0 | 220,160 | 1,148 | 2.0 | 0.4 | 67.2 | 67.6 | 0.00 | 0.19 | 436528 \| Irises \| 1890 \| Oil on canvas \| 58.187 \| 73.7 x 92.1 cm 436532 \| Self-Portrait with a Straw Hat (obverse: The Potato Peeler) \| 1887 \| Oil on canvas \| 6 |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 1200 | 21 | 0 | 264,010 | 0 | 37,585 | 0 | 573,696 | 1,137 | 2.7 | 0.5 | 64.7 | 65.2 | 0.00 | 0.18 | #98 \| A Tale of Two Cities \| 1994-01-01 \| PR #1400 \| Great Expectations \| 1998-07-01 \| PR Earlier: #98 Currently visible: advanced-search results page two, |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 15 | 1 | 87,182 | 0 | 71,351 | 0 | 170,368 | 688 | 2.0 | 0.4 | 105.7 | 106.1 | 0.00 | 0.17 | I started the Rembrandt search, selected **Has image** and **Title (a-z)**, and inspected the first page. The rendered first-page range was **1–42 of 4,025 resu |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 28 | 324,529 | 81.3 | unknown | unknown | known |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 23 | 273,974 | 70.7 | unknown | unknown | known |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 28 | 315,372 | 77.8 | unknown | unknown | known |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 62 | 509,902 | 118.4 | unknown | unknown | known |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 34 | 385,542 | 60.3 | unknown | unknown | known |
| `longlive-gutenberg-novels` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 33 | 246,547 | 53.3 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 34 | 170,957 | 49.3 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 17 | 172,914 | 40.0 | unknown | unknown | known |
| `longlive-gutenberg-gothic` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 1200 | 46 | 1,841,395 | 129.2 | unknown | unknown | known |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 17 | 395,864 | 72.7 | unknown | unknown | known |
| `longlive-met-vangogh` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 20 | 252,265 | 67.2 | unknown | unknown | known |
| `longlive-gutenberg-dickens-search` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 1200 | 21 | 611,281 | 64.7 | unknown | unknown | known |
| `longlive-met-rembrandt-search` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 15 | 241,719 | 105.7 | unknown | unknown | known |
