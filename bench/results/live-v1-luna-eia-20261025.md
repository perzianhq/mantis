# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-25; runs per task and approach: 3; 3 runs in parallel.
- Scope: 1 tasks × 3 approaches × 3 runs = 9 logical runs; 9 recorded so far; 9 total attempts including retries.
- Codex runtime: codex-cli 0.164.0-alpha.11.1; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| First-pass correct (attempt 1) | 3 / 3 | 3 / 3 | 3 / 3 |
| After reruns / merged correct | 3 / 3 | 3 / 3 | 3 / 3 |
| Rows with unknown usage | 0 rows have unknown usage | 0 rows have unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 3 / 3 | 3 / 3 | 3 / 3 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 0 |
| Tool calls (including retries) | 6 | 12 | 19 |
| MCP tool errors (including retries) | 0 | 0 | 1 |
| Browser observation text (observed chars) | 15,123 | 59,808 | 300 |
| Browser observation images (observed blocks) | 0 | 0 | 8 |
| Normal input tokens (total) | 54,637 | 70,690 | 59,931 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 124,800 | 168,448 | 256,512 |
| Output tokens (total) | 751 | 855 | 1,921 |
| Total input tokens incl. cache (legacy) | 179,437 | 239,138 | 316,443 |
| MCP startup (total, s) | 6.1 | 6.1 | 6.1 |
| CLI startup (total, s) | 2.3 | 1.8 | 2.0 |
| CLI execution (total, s) | 46.1 | 55.8 | 66.8 |
| CLI wall (total, s) | 48.4 | 57.6 | 68.8 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 1.0 | 0.9 | 1.0 |
| Harness capture (total, s) | 0.7 | 10.0 | 2.7 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-data-eia-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,041 | 0 | 24,253 | 0 | 35,456 | 260 | 2.1 | 0.6 | 19.8 | 20.4 | 0.00 | 0.36 | The About page identifies the agency as the **U.S. Energy Information Administration (EIA)**. The page says it collects, processes, and analyzes energy information. That is the text currently visible on the page; the homepage footer had shown the agency name earlier as well. |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 19,936 | 0 | 18,837 | 0 | 61,824 | 293 | 2.1 | 0.6 | 23.0 | 23.6 | 0.00 | 0.25 | The current page shows the About EIA heading and says: “The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people.” The agency name is **U.S. Energy Information Administration (EIA)**. No inputs were needed; I did not log in, purchase anything, or enter personal information. |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 8 | 0 | 104 | 3 | 15,973 | 0 | 109,056 | 747 | 2.1 | 0.6 | 31.2 | 31.8 | 0.00 | 0.34 | The About page identifies the agency as the **U.S. Energy Information Administration (EIA)**. The current page shows: “The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people.” This is the site’s displayed result; I did not calculate or estimate it. The earlier homepage header also showed “U.S. Energy Information Administration.” |
| `livev1-data-eia-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,041 | 0 | 15,128 | 0 | 44,544 | 235 | 2.0 | 0.9 | 13.6 | 14.5 | 0.00 | 0.36 | The About page identifies the agency as the **U.S. Energy Information Administration (EIA)**. The page is currently showing that name in its About section; I did not enter personal information or encounter a sign-in or purchase prompt. |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 19,936 | 0 | 18,795 | 0 | 60,416 | 266 | 2.0 | 0.6 | 15.2 | 15.8 | 0.00 | 0.38 | The About page identifies the agency as the **U.S. Energy Information Administration (EIA)**. The page currently shows that name in its introductory heading; this is the site’s displayed text, not a calculated result. No sign-in, purchase, or personal-information prompt is open. |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 72 | 2 | 18,242 | 0 | 57,472 | 474 | 2.0 | 0.6 | 15.2 | 15.8 | 0.00 | 0.34 | The About EIA page currently shows the agency name as **U.S. Energy Information Administration (EIA)**. The page text says it “collects, processes, analyzes, and publishes energy data for the American people.” No inputs or site-generated results were involved. |
| `livev1-data-eia-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,041 | 0 | 15,256 | 0 | 44,800 | 256 | 2.0 | 0.8 | 12.8 | 13.6 | 0.00 | 0.25 | The About page identifies the agency as the **U.S. Energy Information Administration (EIA)**. That is the agency name shown in the page’s “About EIA” section. Currently visible: the About page, with the heading “About EIA” and the agency name in its introductory text. No inputs or site generated results are involved. |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 19,936 | 0 | 33,058 | 0 | 46,208 | 296 | 2.0 | 0.6 | 17.6 | 18.2 | 0.00 | 0.24 | The agency name shown on the EIA About page is **U.S. Energy Information Administration (EIA)**. The page’s visible text says it “collects, processes, analyzes, and publishes energy data for the American people.” Currently visible: the About EIA page, with that agency name in its introductory heading. No inputs or site-generated results apply to this request. |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 3 | success | success | success | 1 | n/a | 600 | 7 | 1 | 124 | 3 | 25,716 | 0 | 89,984 | 700 | 2.0 | 0.8 | 20.4 | 21.2 | 0.00 | 0.28 | The **About EIA** page currently shows: “The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people.” The agency name shown there is **U.S. Energy Information Administration**. The earlier homepage header also displayed “U.S. Energy Information Administration”; the About page is the current visible evidence. |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-data-eia-about` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 59,709 | 19.8 | unknown | unknown | known |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 4 | 80,661 | 23.0 | unknown | unknown | known |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 8 | 125,029 | 31.2 | unknown | unknown | known |
| `livev1-data-eia-about` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 59,672 | 13.6 | unknown | unknown | known |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 4 | 79,211 | 15.2 | unknown | unknown | known |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 4 | 75,714 | 15.2 | unknown | unknown | known |
| `livev1-data-eia-about` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 60,056 | 12.8 | unknown | unknown | known |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 4 | 79,266 | 17.6 | unknown | unknown | known |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 7 | 115,700 | 20.4 | unknown | unknown | known |
