# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 6 runs in parallel.
- Scope: 6 exact recovery rows = 6 logical runs; 6 recorded so far; 6 total attempts including retries.
- Exact rows: `livev1-standards-css-color-4|mantis|1`, `livev1-docs-node-url|mantis|3`, `livev1-civic-archives-about|mantis|3`, `livev1-navigation-wikipedia-ada|mantis|3`, `livev1-navigation-met-collection|mantis|1`, `livev1-navigation-met-collection|mantis|2`.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 6 / 6 |
| After reruns / merged correct | 6 / 6 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 6 / 6 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 32 |
| MCP tool errors (including retries) | 1 |
| Browser observation text (observed chars) | 93,730 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 84 |
| Cache-write input tokens (total) | 78,603 |
| Cache-read input tokens (total) | 494,163 |
| Output tokens (total) | 5,285 |
| Total input tokens incl. cache (legacy) | 572,850 |
| MCP startup (total, s) | 12.4 |
| CLI startup (total, s) | 11.8 |
| CLI execution (total, s) | 175.9 |
| CLI wall (total, s) | 187.7 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 1.0 |
| Harness capture (total, s) | 21.2 |
| Cost estimate (USD; including retries) | 0.52 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-standards-css-color-4` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 15,804 | 0 | 14 | 12,664 | 80,866 | 1,051 | 2.0 | 1.9 | 42.7 | 44.6 | 0.00 | 0.13 | The displayed title is "CSS Color Module Level 4", shown as the page heading and in the browser tab title. I reached it from w3.org via Standards & groups, then |
| `livev1-docs-node-url` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 7 | 0 | 14,817 | 0 | 18 | 13,353 | 107,208 | 1,080 | 2.1 | 1.9 | 26.9 | 28.7 | 0.00 | 0.18 | The API section title is **URL**. The page I ended on is the URL docs page for Node.js v26.12.1, with the main heading "## URL" and the browser title "URL \| Nod |
| `livev1-civic-archives-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,404 | 0 | 8 | 9,754 | 32,451 | 511 | 2.1 | 2.0 | 20.1 | 22.2 | 0.00 | 0.16 | The About page names the organization as the **National Archives and Records Administration (NARA)**. The page text reads: "The National Archives and Records Ad |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,191 | 0 | 8 | 10,220 | 33,784 | 641 | 2.1 | 2.0 | 14.1 | 16.1 | 0.00 | 0.24 | I opened the Ada Lovelace article on English Wikipedia and it is the page currently open. I searched from the Wikipedia main page, and the search returned the a |
| `livev1-navigation-met-collection` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 18,666 | 0 | 16 | 14,394 | 99,650 | 827 | 2.1 | 2.0 | 24.3 | 26.3 | 0.00 | 0.20 | The collection search for "Wheat Field with Cypresses" returned 1,057 results, and the first one is the object page for Vincent van Gogh's *Wheat Field with Cyp |
| `livev1-navigation-met-collection` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 9 | 1 | 25,848 | 0 | 20 | 18,218 | 140,204 | 1,175 | 2.1 | 2.0 | 47.8 | 49.8 | 0.00 | 0.12 | The Met's collection search for "Wheat Field with Cypresses" returned 1,057 results, and the first match is the object page for Vincent van Gogh's *Wheat Field  |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-standards-css-color-4` | Mantis | 1 | 1 | success | n/a | 600 | 6 | 93,544 | 42.7 | 0.088 | unknown | known |
| `livev1-docs-node-url` | Mantis | 3 | 1 | success | n/a | 600 | 7 | 120,579 | 26.9 | 0.098 | unknown | known |
| `livev1-civic-archives-about` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 42,213 | 20.1 | 0.054 | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 44,012 | 14.1 | 0.058 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 1 | 1 | success | n/a | 600 | 6 | 114,060 | 24.3 | 0.096 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 2 | 1 | success | n/a | 600 | 9 | 158,442 | 47.8 | 0.128 | unknown | known |
