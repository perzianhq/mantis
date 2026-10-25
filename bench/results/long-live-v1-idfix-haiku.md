# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-25; runs per task and approach: 3; 3 runs in parallel.
- Scope: 1 tasks × 1 approaches × 3 runs = 3 logical runs; 3 recorded so far; 3 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 3 / 3 |
| After reruns / merged correct | 3 / 3 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 3 / 3 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 106 |
| MCP tool errors (including retries) | 1 |
| Browser observation text (observed chars) | 29,080 |
| Browser observation images (observed blocks) | 3 |
| Normal input tokens (total) | 84 |
| Cache-write input tokens (total) | 68,369 |
| Cache-read input tokens (total) | 666,536 |
| Output tokens (total) | 23,136 |
| Total input tokens incl. cache (legacy) | 734,989 |
| MCP startup (total, s) | 6.1 |
| CLI startup (total, s) | 5.9 |
| CLI execution (total, s) | 169.2 |
| CLI wall (total, s) | 175.1 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 0.4 |
| Harness capture (total, s) | 3.0 |
| Cost estimate (USD; including retries) | 0.80 |

- Effective budgets: no provider max-step loop; timeout 1200s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-select` | Mantis | 1 | success | success | success | 1 | n/a | 1200 | 44 | 1 | 12,236 | 3 | 36 | 26,975 | 307,102 | 8,404 | 2.0 | 2.0 | 64.1 | 66.0 | 0.00 | 0.13 | Several controls had no ID in the page read output, so I confirmed #2, #7 and #8 with ID selectors and visual checks. The page is left open on the final state, unsubmitted. selectWithoutMultiple \| two selectWithMultipleEqualsMultiple \| Emmental, Cheddar selectWithEmptyStringMultiple \| one, two selectWithMultipleWithoutValue \| two selectWithRandomMultipleValue \| one selectWithMultipleLongList \| two, five, six narrow \| Avonlea Clothbound Cheddar The read-back after the final audit shows these values as the site reports them. The site's values for the cheese list are lowercase ("emmental, cheddar"); I used the capitalized visible option labels. |
| `longlive-form-selenium-select` | Mantis | 2 | success | success | success | 1 | n/a | 1200 | 34 | 0 | 9,861 | 0 | 28 | 18,624 | 225,615 | 7,963 | 2.0 | 2.0 | 57.4 | 59.4 | 0.00 | 0.14 | selectWithoutMultiple \| two selectWithMultipleEqualsMultiple \| Emmental, Cheddar selectWithEmptyStringMultiple \| one, two selectWithMultipleWithoutValue \| two selectWithRandomMultipleValue \| one selectWithMultipleLongList \| two, five, six narrow \| Avonlea Clothbound Cheddar The tools did not expose the IDs for three of the requested controls. I matched them by content: the cheese multi-select (#2) as selectWithMultipleEqualsMultiple, the six-item multi-select (#7) as selectWithMultipleLongList, and the LaClare single-select (#8) as narrow. The other four IDs were read directly from the page. I read back the page after the first pass, the review pass and the final audit, and nothing was submitted. The page is still open on the final state, with the final selections showing in the read-back. |
| `longlive-form-selenium-select` | Mantis | 3 | success | success | success | 1 | n/a | 1200 | 28 | 0 | 6,983 | 0 | 20 | 22,770 | 133,819 | 6,769 | 2.1 | 1.9 | 47.7 | 49.7 | 0.00 | 0.15 | All seven controls are set to the final audit values, and the read-back matches. Nothing was submitted. selectWithoutMultiple \| two selectWithMultipleEqualsMultiple \| emmental, cheddar selectWithEmptyStringMultiple \| one, two selectWithMultipleWithoutValue \| two selectWithRandomMultipleValue \| one selectWithMultipleLongList \| two, five, six narrow \| Avonlea Clothbound Cheddar The page's accessibility output only exposed HTML IDs for five controls, so I mapped the other two by their content and position. The cheese list is #2 (selectWithMultipleEqualsMultiple), the one-to-six list is #7 (selectWithMultipleLongList), and the LaClare/Avonlea list is #8 (narrow). The cheese options are shown in lowercase in the page output, so I reported them that way. |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `longlive-form-selenium-select` | Mantis | 1 | 1 | success | n/a | 1200 | 44 | 334,113 | 64.1 | 0.319 | unknown | known |
| `longlive-form-selenium-select` | Mantis | 2 | 1 | success | n/a | 1200 | 34 | 244,267 | 57.4 | 0.257 | unknown | known |
| `longlive-form-selenium-select` | Mantis | 3 | 1 | success | n/a | 1200 | 28 | 156,609 | 47.7 | 0.227 | unknown | known |
