# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 4 runs in parallel.
- Scope: 2 tasks × 2 approaches × 1 runs = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) |
|---|---:|---:|
| First-pass correct (attempt 1) | 2 / 2 | 2 / 2 |
| After reruns / merged correct | 2 / 2 | 2 / 2 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 2 / 2 | 2 / 2 |
| Connection-failure attempts | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 |
| Other attempted failures | 0 | 0 |
| Tool calls (including retries) | 83 | 60 |
| MCP tool errors (including retries) | 5 | 1 |
| Browser observation text (observed chars) | 94,495 | 148,406 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | 101,576 | 64,202 |
| Cache-write input tokens (total) | 0 | 0 |
| Cache-read input tokens (total) | 945,152 | 772,736 |
| Output tokens (total) | 4,802 | 4,539 |
| Total input tokens incl. cache (legacy) | 1,046,728 | 836,938 |
| MCP startup (total, s) | 4.1 | 4.1 |
| CLI startup (total, s) | 8.9 | 11.9 |
| CLI execution (total, s) | 428.7 | 223.9 |
| CLI wall (total, s) | 437.6 | 235.9 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.4 | 0.5 |
| Harness capture (total, s) | 53.7 | 40.1 |
| Cost estimate (USD; including retries) | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 36 | 0 | 43,841 | 0 | 46,698 | 0 | 190,592 | 1,654 | 2.1 | 6.0 | 120.1 | 126.1 | 0.00 | 0.23 | Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| 258 kg Pioneer 11 \| 1973-0 |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 35,746 | 0 | 18,963 | 0 | 191,232 | 1,460 | 2.1 | 6.0 | 72.4 | 78.4 | 0.00 | 0.28 | Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| 258 kg Pioneer 11 \| 1973-0 |
| `longlive-wiki-moons` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 47 | 5 | 50,654 | 0 | 54,878 | 0 | 754,560 | 3,148 | 2.1 | 2.9 | 308.7 | 311.5 | 0.00 | 0.17 | Io \| 1824.2 km \| 1.769 d \| 1610-01-08 Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08 Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07 Callisto \| 2410.3 km  |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 32 | 1 | 112,660 | 0 | 45,239 | 0 | 581,504 | 3,079 | 2.1 | 6.0 | 151.5 | 157.5 | 0.00 | 0.22 | Io \| 1824.2 km \| 1.769137786 d \| 1610-01-08 Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08 Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07 Callisto \| 2410 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | 1 | success | n/a | 1200 | 36 | 237,290 | 120.1 | unknown | unknown | known |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 28 | 210,195 | 72.4 | unknown | unknown | known |
| `longlive-wiki-moons` | Mantis | 1 | 1 | success | n/a | 1200 | 47 | 809,438 | 308.7 | unknown | unknown | known |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 32 | 626,743 | 151.5 | unknown | unknown | known |
