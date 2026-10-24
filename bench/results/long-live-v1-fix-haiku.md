# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-24; runs per task and approach: 1; 4 runs in parallel.
- Scope: 2 tasks × 2 approaches × 1 runs = 4 logical runs; 4 recorded so far; 4 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
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
| Tool calls (including retries) | 63 | 72 |
| MCP tool errors (including retries) | 3 | 3 |
| Browser observation text (observed chars) | 179,718 | 166,621 |
| Browser observation images (observed blocks) | 0 | 0 |
| Normal input tokens (total) | 82 | 106 |
| Cache-write input tokens (total) | 111,436 | 102,785 |
| Cache-read input tokens (total) | 1,140,795 | 1,898,116 |
| Output tokens (total) | 14,204 | 14,222 |
| Total input tokens incl. cache (legacy) | 1,252,313 | 2,001,007 |
| MCP startup (total, s) | 4.1 | 4.1 |
| CLI startup (total, s) | 4.4 | 3.9 |
| CLI execution (total, s) | 363.4 | 301.0 |
| CLI wall (total, s) | 367.8 | 304.9 |
| Fixture verification (total, s) | 0.0 | 0.0 |
| Cleanup (total, s) | 0.4 | 0.5 |
| Harness capture (total, s) | 16.6 | 46.5 |
| Cost estimate (USD; including retries) | 0.97 | 1.17 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 41 | 2 | 52,905 | 0 | 48 | 39,988 | 662,324 | 7,832 | 2.0 | 2.3 | 251.4 | 253.6 | 0.00 | 0.16 | Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg Voyager 2 \| 1977-08-20 \| 1977-076A \| 721.9 kg Pioneer 10 \| 1972-03-03 \| 1972-012A \| 258 kg Pioneer 11 \| 1973-04-06 \| |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 46 | 3 | 112,805 | 0 | 72 | 67,603 | 1,441,902 | 8,232 | 2.0 | 2.0 | 186.1 | 188.2 | 0.00 | 0.21 | Voyager 1, Voyager 2, Pioneer 10, Pioneer 11, New Horizons, Cassini-Huygens, Galileo and Juno were each reached through the on-site search and then read from th |
| `longlive-wiki-moons` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 22 | 1 | 126,813 | 0 | 34 | 71,448 | 478,471 | 6,372 | 2.0 | 2.2 | 112.1 | 114.2 | 0.00 | 0.28 | Io \| 1824.2 km \| 1.769 d \| 1610-01-08 Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08 Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07 Callisto \| 2410.3 km \| 16.6 |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 1200 | 26 | 0 | 53,816 | 0 | 34 | 35,182 | 456,214 | 5,990 | 2.1 | 1.9 | 114.8 | 116.8 | 0.00 | 0.27 | Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07 Titan \| 2574.765 km \| 15.945448 d \| 1655-03-25 Callisto \| 2410.3 km \| 16.6890184 d \| 1610-01-07 Io \| 1824.2 km |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-wiki-probes` | Mantis | 1 | 1 | success | n/a | 1200 | 41 | 702,360 | 251.4 | 0.466 | unknown | known |
| `longlive-wiki-probes` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 46 | 1,509,577 | 186.1 | 0.81 | unknown | known |
| `longlive-wiki-moons` | Mantis | 1 | 1 | success | n/a | 1200 | 22 | 549,953 | 112.1 | 0.507 | unknown | known |
| `longlive-wiki-moons` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 1200 | 26 | 491,430 | 114.8 | 0.359 | unknown | known |
