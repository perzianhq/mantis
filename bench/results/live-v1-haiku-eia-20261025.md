# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-25; runs per task and approach: 3; 3 runs in parallel.
- Scope: 1 tasks × 3 approaches × 3 runs = 9 logical runs; 9 recorded so far; 9 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
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
| Tool calls (including retries) | 6 | 15 | 14 |
| MCP tool errors (including retries) | 0 | 1 | 0 |
| Browser observation text (observed chars) | 15,123 | 50,080 | 239 |
| Browser observation images (observed blocks) | 0 | 0 | 7 |
| Normal input tokens (total) | 285 | 28 | 26 |
| Cache-write input tokens (total) | 30,634 | 39,367 | 28,072 |
| Cache-read input tokens (total) | 90,876 | 162,359 | 91,085 |
| Output tokens (total) | 1,521 | 2,521 | 3,015 |
| Total input tokens incl. cache (legacy) | 121,795 | 201,754 | 119,183 |
| MCP startup (total, s) | 6.1 | 6.2 | 6.1 |
| CLI startup (total, s) | 7.0 | 5.9 | 6.0 |
| CLI execution (total, s) | 36.8 | 47.8 | 38.7 |
| CLI wall (total, s) | 43.8 | 53.7 | 44.7 |
| Fixture verification (total, s) | 0.0 | 0.0 | 0.0 |
| Cleanup (total, s) | 0.9 | 0.9 | 0.8 |
| Harness capture (total, s) | 0.8 | 11.7 | 2.0 |
| Cost estimate (USD; including retries) | 0.17 | 0.23 | 0.18 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-data-eia-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,041 | 0 | 95 | 14,698 | 25,818 | 501 | 2.1 | 2.7 | 12.2 | 14.8 | 0.00 | 0.27 | The agency name on the EIA About page is **U.S. Energy Information Administration (EIA)**. The page's About EIA heading and browser title both show this name, and its text describes EIA as an independent federal authority for energy statistics and analysis. I did not log in, purchase anything, or enter any personal information. |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 13,850 | 0 | 8 | 11,812 | 40,646 | 830 | 2.1 | 3.0 | 15.2 | 18.1 | 0.00 | 0.32 | The agency name on the EIA About page is **U.S. Energy Information Administration**, abbreviated EIA. I reached it by clicking the "About EIA" footer link from the homepage. The page's lead heading reads "The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people." The page title is "U.S. Energy Information Administration - EIA - Independent Statistics and Analysis," and the footer repeats the full name. This comes from the accessibility snapshot, not a visual check. No sign-in, purchase, or personal-information step came up, and I entered nothing. |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 95 | 3 | 10 | 10,534 | 39,270 | 1,537 | 2.1 | 2.9 | 15.2 | 18.2 | 0.00 | 0.32 | The agency name on the About EIA page is **U.S. Energy Information Administration**. It appears in the site header ("Independent Statistics and Analysis / U.S. Energy Information Administration") and in the page's intro: "The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people." I reached the page from the homepage by clicking "About EIA" in the footer. I did not log in, buy anything, or enter any information. The current screen shows the About EIA page sections (Our Work, Our Organization, Our History), which were observed directly in this session. The browser tools don't expose the address bar, so I can't read the exact URL. The last URL I navigated to was https://www.eia.gov/, and the About page was reached from there by a click. |
| `livev1-data-eia-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,041 | 0 | 95 | 7,964 | 32,538 | 476 | 2.0 | 3.1 | 11.6 | 14.7 | 0.00 | 0.33 | The agency name shown on the About page is **U.S. Energy Information Administration (EIA)**. The page heading reads "About EIA," and the body says EIA "collects, processes, analyzes," and so on, and was established October 1, 1977. I navigated from the homepage footer's "About EIA" link and did not log in, buy anything, or enter any information. |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 13,850 | 0 | 8 | 11,802 | 40,634 | 758 | 2.0 | 1.5 | 14.4 | 15.9 | 0.00 | 0.24 | The About page names the agency as **U.S. Energy Information Administration (EIA)**. Its main heading is "About EIA," and the introduction reads "The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people." The footer also shows "U.S. Energy Information Administration." I reached the page by clicking the "About EIA" link in the homepage footer. No sign-in, purchase, or personal-information step came up, so I didn't enter anything. |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 72 | 2 | 8 | 8,784 | 25,918 | 759 | 2.0 | 1.6 | 12.4 | 14.0 | 0.00 | 0.24 | The About EIA page shows the agency name as the **U.S. Energy Information Administration** (abbreviated EIA). The page's intro sentence reads "The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people," and the header logo says the same. I reached the page by typing its URL directly rather than clicking through from the homepage, which I did not mention in my first step. No sign-in, purchase, or personal-information step came up. |
| `livev1-data-eia-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,041 | 0 | 95 | 7,972 | 32,520 | 544 | 2.0 | 1.2 | 13.1 | 14.3 | 0.00 | 0.29 | The About page names the agency as the **U.S. Energy Information Administration (EIA)**. Its heading reads "The U.S. Energy Information Administration (EIA) collects, processes, analyzes…", and the page title is "U.S. Energy Information Administration - EIA - Independent Statistics and Analysis." I navigated from the homepage footer's "About EIA" link. No login, purchase, or personal information was involved, so nothing is left open at a prompt. |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 3 | success | success | success | 1 | n/a | 600 | 7 | 1 | 22,380 | 0 | 12 | 15,753 | 81,079 | 933 | 2.1 | 1.4 | 18.2 | 19.6 | 0.00 | 0.33 | The agency name on the About EIA page (https://www.eia.gov/about/) is **U.S. Energy Information Administration**, shown in the page title and its lead sentence, which describes EIA as collecting, processing, analyzing, and publishing energy data. The footer on that page also shows the same name. I only navigated and read the page, so there were no sign-in, purchase, or personal-information prompts. The viewport screenshot is saved as `eia-about-page.png` in the working directory. |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 72 | 2 | 8 | 8,754 | 25,897 | 719 | 2.0 | 1.4 | 11.1 | 12.5 | 0.00 | 0.28 | The EIA About page shows the agency name as **U.S. Energy Information Administration**. The page header reads "U.S. Energy Information Administration" with the tagline "Independent Statistics and Analysis," and the intro text reads "The U.S. Energy Information Administration (EIA) collects, processes, analyzes, and publishes energy data for the American people." I reached the page by going to the homepage and then to /about/ directly, because I didn't use the site's navigation menu. No sign-in, purchase, or personal-information prompts came up, and I didn't enter anything. |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-data-eia-about` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 40,611 | 12.2 | 0.071 | unknown | known |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 1 | 1 | success | n/a | 600 | 4 | 52,466 | 15.2 | 0.069 | unknown | known |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 1 | 1 | success | n/a | 600 | 6 | 49,814 | 15.2 | 0.074 | unknown | known |
| `livev1-data-eia-about` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 40,597 | 11.6 | 0.047 | unknown | known |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 2 | 1 | success | n/a | 600 | 4 | 52,444 | 14.4 | 0.068 | unknown | known |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 2 | 1 | success | n/a | 600 | 4 | 34,710 | 12.4 | 0.052 | unknown | known |
| `livev1-data-eia-about` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 40,587 | 13.1 | 0.048 | unknown | known |
| `livev1-data-eia-about` | Accessibility tree (Playwright MCP) | 3 | 1 | success | n/a | 600 | 7 | 96,844 | 18.2 | 0.097 | unknown | known |
| `livev1-data-eia-about` | Screenshots (click by x,y) | 3 | 1 | success | n/a | 600 | 4 | 34,659 | 11.1 | 0.051 | unknown | known |
