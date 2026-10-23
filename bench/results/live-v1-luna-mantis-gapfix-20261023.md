# Real-agent eval

> Codex CLI (`codex exec`) (requested model `gpt-6-luna`, reasoning medium) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Codex event stream; Codex does not report USD cost, so cost remains unknown; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 12 runs in parallel.
- Scope: 30 tasks × 1 approaches × 3 runs = 90 logical runs; 90 recorded so far; 90 total attempts including retries.
- Codex runtime: codex-cli 0.163.0-alpha.11.2; resolved model(s): unknown.
- MCP startup (spawn + warm-up) is separate from Codex execution time. Execution runs from process launch to exit; startup is launch to first `thread.started` event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Codex-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. Codex shell, web, app, skill-discovery, browser, computer, and image-view tools are disabled; only the selected approach MCP server is configured.
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 90 / 90 |
| After reruns / merged correct | 90 / 90 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 90 / 90 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 344 |
| MCP tool errors (including retries) | 8 |
| Browser observation text (observed chars) | 927,292 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,275,770 |
| Cache-write input tokens (total) | 0 |
| Cache-read input tokens (total) | 6,649,216 |
| Output tokens (total) | 33,959 |
| Total input tokens incl. cache (legacy) | 7,924,986 |
| MCP startup (total, s) | 247.2 |
| CLI startup (total, s) | 528.3 |
| CLI execution (total, s) | 3900.5 |
| CLI wall (total, s) | 4428.7 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 142.0 |
| Harness capture (total, s) | 441.0 |
| Cost estimate (USD; including retries) | unknown |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-standards-rfc-8259` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 13,635 | 0 | 11,005 | 0 | 94,592 | 428 | 2.1 | 1.2 | 33.5 | 34.7 | 0.00 | 3.03 | RFC Editor displays the title as **“The JavaScript Object Notation (JSON) Data Interchange Format.”** The current page is RFC 8259’s information page, where the |
| `livev1-standards-rfc-8259` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 12,407 | 0 | 14,620 | 0 | 60,288 | 436 | 2.1 | 1.6 | 33.1 | 34.7 | 0.00 | 1.67 | RFC Editor’s search page shows the query **8259** and the result **RFC 8259: STD 90: The JavaScript Object Notation (JSON) Data Interchange Format**. The displa |
| `livev1-standards-rfc-8259` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 6 | 0 | 22,553 | 0 | 25,497 | 0 | 100,992 | 412 | 2.1 | 1.7 | 52.7 | 54.4 | 0.00 | 1.73 | RFC 8259’s displayed title is **“The JavaScript Object Notation (JSON) Data Interchange Format.”** The RFC page currently shows that title alongside “RFC 8259”  |
| `livev1-standards-wcag-22` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 13,397 | 0 | 18,320 | 0 | 155,904 | 563 | 2.1 | 1.4 | 165.8 | 167.2 | 0.00 | 1.43 | The W3C Recommendation’s displayed title is **Web Content Accessibility Guidelines (WCAG) 2.2**. The page currently shows that title and identifies the document |
| `livev1-standards-wcag-22` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,231 | 0 | 8,193 | 0 | 59,648 | 330 | 2.1 | 1.5 | 19.9 | 21.4 | 0.00 | 2.05 | The displayed title is **Web Content Accessibility Guidelines (WCAG) 2.2**. The current page identifies it as a **W3C Recommendation**, dated **12 December 2024 |
| `livev1-standards-wcag-22` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,165 | 0 | 14,841 | 0 | 71,936 | 339 | 2.1 | 1.8 | 32.9 | 34.6 | 0.00 | 1.56 | The WCAG 2.2 recommendation displays the title **“Web Content Accessibility Guidelines (WCAG) 2.2.”** The page also identifies it as a W3C Recommendation dated  |
| `livev1-standards-rfc-9110` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 9,563 | 0 | 15,606 | 0 | 87,936 | 386 | 2.1 | 1.8 | 77.9 | 79.6 | 0.00 | 4.37 | RFC 9110’s displayed title is **HTTP Semantics**. The RFC Editor page currently shows “RFC 9110: STD 97: HTTP Semantics,” along with its abstract and Internet S |
| `livev1-standards-rfc-9110` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 19,216 | 0 | 24,479 | 0 | 87,040 | 382 | 2.2 | 1.7 | 88.9 | 90.6 | 0.00 | 1.64 | RFC 9110’s displayed protocol title is **HTTP Semantics**. The RFC Editor detail page currently shows “RFC 9110: STD 97: HTTP Semantics” at the top, along with  |
| `livev1-standards-rfc-9110` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 9,563 | 0 | 11,275 | 0 | 92,160 | 359 | 2.2 | 1.7 | 88.8 | 90.6 | 0.00 | 1.76 | The RFC Editor page currently displays **RFC 9110: STD 97: HTTP Semantics** at [rfc-editor.org/info/rfc9110/](https://www.rfc-editor.org/info/rfc9110/). The pag |
| `livev1-standards-openapi-31` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 7,834 | 0 | 25,221 | 0 | 48,128 | 277 | 2.2 | 1.6 | 24.5 | 26.1 | 0.00 | 3.18 | The specification page currently shows the title **“OpenAPI Specification v3.1.0”** and the heading **“Version 3.1.0.”** These are the page’s displayed title an |
| `livev1-standards-openapi-31` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 7,834 | 0 | 23,054 | 0 | 39,808 | 336 | 2.2 | 1.6 | 24.4 | 26.0 | 0.00 | 3.21 | The specification title shows **OpenAPI Specification v3.1.0**. The page also shows **Version 3.1.0** beneath the title. Currently visible evidence: the OpenAP |
| `livev1-standards-openapi-31` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 3 | 0 | 7,543 | 0 | 10,295 | 0 | 62,976 | 308 | 2.2 | 1.7 | 32.8 | 34.6 | 0.00 | 1.80 | The OpenAPI 3.1.0 specification page is open. Its title reads **“OpenAPI Specification v3.1.0”**; the page also shows the heading “Version 3.1.0.” No sign-in, p |
| `livev1-standards-css-color-4` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,991 | 0 | 15,543 | 0 | 72,192 | 441 | 4.9 | 18.7 | 47.3 | 66.0 | 0.00 | 1.80 | The displayed specification title is **CSS Color Module Level 4**. Currently visible on the W3C page: the title, its status as a W3C Candidate Recommendation D |
| `livev1-standards-css-color-4` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,971 | 0 | 16,164 | 0 | 71,680 | 455 | 4.3 | 14.9 | 46.9 | 61.8 | 0.00 | 1.07 | The displayed title is **CSS Color Module Level 4**. It is visible as the specification’s main heading on the current W3C page. The page also shows the version  |
| `livev1-standards-css-color-4` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,968 | 0 | 15,688 | 0 | 72,192 | 496 | 9.3 | 5.6 | 54.4 | 59.9 | 0.00 | 2.23 | The specification’s displayed title is **CSS Color Module Level 4**. It is currently visible at the top of the W3C specification page. Earlier, the W3C homepage |
| `livev1-docs-python-json` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 15,643 | 0 | 19,212 | 0 | 74,112 | 307 | 2.4 | 5.0 | 30.9 | 35.9 | 0.00 | 3.09 | The currently visible Python documentation page shows the module heading **“json — JSON encoder and decoder”**. The page also shows `json` as the module name. E |
| `livev1-docs-python-json` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 15,645 | 0 | 12,731 | 0 | 80,640 | 312 | 4.9 | 9.3 | 45.7 | 55.0 | 0.00 | 2.26 | The current page shows the module heading **“json — JSON encoder and decoder”** in the Python 3.15.1 documentation. The page also shows a `json` label beneath t |
| `livev1-docs-python-json` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 15,780 | 0 | 15,953 | 0 | 93,312 | 369 | 2.4 | 9.2 | 52.2 | 61.4 | 0.00 | 1.06 | The module heading is **“json — JSON encoder and decoder.”** That heading and the page title are currently visible on the Python 3.15.1 documentation page; the  |
| `livev1-docs-mdn-http-overview` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 7,535 | 0 | 9,527 | 0 | 48,512 | 270 | 2.1 | 7.6 | 38.1 | 45.7 | 0.00 | 1.86 | The page heading is **Overview of HTTP**. The current page shows that heading and the introductory text, “HTTP is a protocol for fetching resources such as HTML |
| `livev1-docs-mdn-http-overview` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 7,530 | 0 | 8,112 | 0 | 51,328 | 284 | 2.1 | 7.1 | 43.4 | 50.5 | 0.00 | 0.76 | The current MDN page shows the heading **“Overview of HTTP.”** It is at `https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview`. This is the heading |
| `livev1-docs-mdn-http-overview` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 7,535 | 0 | 8,088 | 0 | 51,328 | 250 | 4.7 | 19.6 | 14.2 | 33.7 | 0.00 | 1.22 | The MDN page heading is **“Overview of HTTP.”** The page currently shows that heading and the opening text describing HTTP as a protocol for fetching resources. |
| `livev1-docs-node-url` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 14,839 | 0 | 26,182 | 0 | 78,592 | 432 | 6.0 | 17.4 | 30.6 | 48.0 | 0.00 | 1.56 | The API section title is **“URL”**. The current page displays “URL \| Node.js v26.12.1 Documentation,” with the “URL” heading and sections including “URL strings |
| `livev1-docs-node-url` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 15,037 | 0 | 31,028 | 0 | 73,984 | 401 | 2.6 | 17.3 | 41.0 | 58.3 | 0.00 | 1.49 | The API section title is **URL**. The current page is the Node.js v26.12.1 URL API documentation, and its main heading reads “URL”; the visible subsection headi |
| `livev1-docs-node-url` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 14,996 | 0 | 13,645 | 0 | 91,776 | 400 | 2.8 | 14.5 | 28.2 | 42.7 | 0.00 | 1.48 | The API section title is **URL**. The current page shows the “URL” heading in the main content and the Node.js v26.12.1 documentation page title. No inputs or s |
| `livev1-docs-django-overview` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,391 | 0 | 13,179 | 0 | 44,928 | 273 | 4.6 | 10.0 | 18.7 | 28.7 | 0.00 | 1.62 | The overview page currently shows the heading **“Why Django?”** at [Django overview](https://www.djangoproject.com/start/overview/). I followed the “Overview” l |
| `livev1-docs-django-overview` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,391 | 0 | 16,614 | 0 | 41,472 | 244 | 5.1 | 7.0 | 18.7 | 25.6 | 0.00 | 1.77 | The Django overview is open. The heading currently shown on the page is **“Why Django?”**. The site identifies the page as “Django overview” at the URL below. |
| `livev1-docs-django-overview` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 7,994 | 0 | 8,357 | 0 | 50,432 | 251 | 3.2 | 6.8 | 15.7 | 22.6 | 0.00 | 2.44 | The page currently shows the heading **“Django at a glance.”** This is the heading visible on the Django overview page I opened. |
| `livev1-docs-postgresql-types` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 13,809 | 0 | 12,031 | 0 | 125,440 | 490 | 3.3 | 3.7 | 41.0 | 44.7 | 0.00 | 0.98 | The current PostgreSQL documentation page shows the chapter heading **“Chapter 8. Data Types.”** It is PostgreSQL 18.6 documentation, and the visible table of c |
| `livev1-docs-postgresql-types` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,074 | 0 | 11,321 | 0 | 45,440 | 298 | 2.5 | 2.8 | 24.5 | 27.4 | 0.00 | 1.39 | The current PostgreSQL documentation is for version 18. Its chapter heading is **“Chapter 8. Data Types.”** The page currently shows that heading and the “Tabl |
| `livev1-docs-postgresql-types` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 7 | 0 | 14,668 | 0 | 22,445 | 0 | 115,968 | 489 | 2.1 | 2.9 | 44.9 | 47.8 | 0.00 | 2.15 | The current manual’s chapter heading is **Chapter 8. Data Types**. It is visible on the page now, along with the chapter table of contents and “Table 8.1. Data  |
| `livev1-civic-loc-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,188 | 0 | 8,249 | 0 | 50,816 | 233 | 2.0 | 3.7 | 24.9 | 28.7 | 0.00 | 1.53 | The About page currently displays the organization name as **Library of Congress**. The page text also describes it as “The Library of Congress.” |
| `livev1-civic-loc-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 1 | 10,079 | 0 | 14,996 | 0 | 69,760 | 417 | 2.0 | 9.1 | 71.3 | 80.4 | 0.00 | 0.58 | The organization name displayed on the About page is **Library of Congress**. The current page also describes “The Library of Congress” in its overview text. Th |
| `livev1-civic-loc-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 3 | 1 | 8,655 | 0 | 10,278 | 0 | 73,856 | 329 | 2.2 | 5.3 | 72.2 | 77.5 | 0.00 | 4.46 | The About page displays the organization name as **Library of Congress**. The visible page heading is “About the Library of Congress,” and its overview text beg |
| `livev1-civic-nasa-missions` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 1 | 6,264 | 0 | 14,788 | 0 | 86,912 | 364 | 2.3 | 5.2 | 96.2 | 101.3 | 0.00 | 1.26 | The NASA missions page is open at https://www.nasa.gov/nasa-missions/, but it currently shows no visible page content, so I can’t verify a displayed heading. Th |
| `livev1-civic-nasa-missions` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 7,909 | 0 | 13,235 | 0 | 60,160 | 260 | 2.0 | 8.2 | 25.9 | 34.1 | 0.00 | 0.69 | The displayed page heading is **Missions**. The NASA missions page is currently visible at https://www.nasa.gov/nasa-missions/, with the heading above the missi |
| `livev1-civic-nasa-missions` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 9,309 | 0 | 16,610 | 0 | 71,936 | 372 | 2.4 | 5.0 | 32.5 | 37.5 | 0.00 | 1.04 | The displayed page heading is **Missions**. The current page shows that heading above “NASA explores the secrets of the universe for the benefit of all.” I reac |
| `livev1-civic-census-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 1 | 9,212 | 0 | 8,800 | 0 | 76,032 | 321 | 2.7 | 2.4 | 79.7 | 82.1 | 0.00 | 0.90 | The About page identifies the agency as the **U.S. Census Bureau**. The page currently shows the heading “About the Bureau” and describes its mission as providi |
| `livev1-civic-census-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 1 | 10,458 | 0 | 17,504 | 0 | 69,504 | 340 | 2.2 | 2.6 | 66.5 | 69.2 | 0.00 | 1.30 | The About page is open at https://www.census.gov/about.html. It identifies the agency as the **U.S. Census Bureau** and states its mission is to serve as the na |
| `livev1-civic-census-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 1 | 6,381 | 0 | 7,321 | 0 | 84,480 | 406 | 2.0 | 3.0 | 64.1 | 67.1 | 0.00 | 0.88 | The About the Bureau page is open at https://www.census.gov/about.html. Its current visible content shows the site header, including “United States Census Burea |
| `livev1-civic-nist-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 10,289 | 0 | 9,281 | 0 | 78,720 | 295 | 2.6 | 7.0 | 26.6 | 33.6 | 0.00 | 0.68 | The heading shown on the official About destination is **“About NIST.”** The page is currently visible at **https://www.nist.gov/about-nist**; its page content  |
| `livev1-civic-nist-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 9,296 | 0 | 10,250 | 0 | 77,568 | 344 | 2.0 | 4.9 | 25.5 | 30.4 | 0.00 | 0.53 | The official About destination shows the heading **“About NIST.”** The page currently visible is [nist.gov/about-nist](https://www.nist.gov/about-nist); its pag |
| `livev1-civic-nist-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 10,287 | 0 | 15,223 | 0 | 73,344 | 355 | 3.5 | 1.5 | 29.1 | 30.6 | 0.00 | 0.56 | The official About destination is [nist.gov/about-nist](https://www.nist.gov/about-nist). Its visible page heading is **“About NIST.”** Currently visible: the  |
| `livev1-civic-archives-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,404 | 0 | 8,588 | 0 | 50,688 | 258 | 2.0 | 1.4 | 27.1 | 28.5 | 0.00 | 0.66 | The About page displays the organization name **National Archives and Records Administration (NARA)**. Its text says, “The National Archives and Records Adminis |
| `livev1-civic-archives-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,404 | 0 | 8,645 | 0 | 50,688 | 283 | 2.1 | 1.4 | 27.8 | 29.3 | 0.00 | 0.54 | The About page displays the organization name **National Archives and Records Administration (NARA)**. The visible text says, “The National Archives and Records |
| `livev1-civic-archives-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,404 | 0 | 10,238 | 0 | 49,024 | 265 | 2.1 | 1.6 | 44.0 | 45.6 | 0.00 | 0.80 | The About page is open at https://www.archives.gov/about. It displays the heading “What is the National Archives and Records Administration?” and identifies the |
| `livev1-data-world-bank-population` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 13,488 | 0 | 10,181 | 0 | 80,512 | 433 | 2.0 | 1.1 | 54.5 | 55.7 | 0.00 | 1.97 | The World Bank indicator title is **“Population, total.”** The current page shows that title in the page header and indicator link. Earlier, the homepage displa |
| `livev1-data-world-bank-population` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 8 | 0 | 17,122 | 0 | 14,197 | 0 | 142,976 | 675 | 2.0 | 0.8 | 69.2 | 70.0 | 0.00 | 1.06 | The indicator title is **Population, total**. The current page, [World Bank Population, total](https://data.worldbank.org/indicator/SP.POP.TOTL), shows **World  |
| `livev1-data-world-bank-population` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 10 | 1 | 20,112 | 0 | 24,855 | 0 | 182,400 | 704 | 2.0 | 0.9 | 96.6 | 97.4 | 0.00 | 0.89 | The indicator title is **Population, total**. The World Bank page currently shows **World (2024): 8.14 Billion** as its site-generated result. The page also ide |
| `livev1-data-ourworldindata-co2` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 4,954 | 0 | 10,420 | 0 | 44,160 | 310 | 2.0 | 1.4 | 26.8 | 28.2 | 0.00 | 1.28 | The page title shown is **“CO₂ and Greenhouse Gas Emissions \| Our World in Data.”** Currently visible: the article heading “CO₂ and Greenhouse Gas Emissions” a |
| `livev1-data-ourworldindata-co2` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 4,954 | 0 | 6,482 | 0 | 49,664 | 248 | 2.8 | 2.1 | 27.8 | 29.9 | 0.00 | 1.59 | The page shows the title **“CO₂ and Greenhouse Gas Emissions.”** I opened it from the homepage’s “CO₂ Emissions” link. The current page evidence identifies it a |
| `livev1-data-ourworldindata-co2` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 4,954 | 0 | 7,141 | 0 | 50,432 | 256 | 2.0 | 11.9 | 30.7 | 42.7 | 0.00 | 1.03 | The page reached from the **CO₂ Emissions** link is titled **“CO₂ and Greenhouse Gas Emissions \| Our World in Data.”** That title and the page heading “CO₂ and  |
| `livev1-data-data-gov-climate` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 9,103 | 0 | 14,295 | 0 | 58,112 | 307 | 3.0 | 3.2 | 30.3 | 33.5 | 0.00 | 1.60 | The Data.gov topic page is **Climate**. The page currently visible is [https://data.gov/climate/1/](https://data.gov/climate/1/); its heading reads “Climate,” w |
| `livev1-data-data-gov-climate` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 11,457 | 0 | 15,623 | 0 | 71,552 | 335 | 2.4 | 3.1 | 28.2 | 31.3 | 0.00 | 1.75 | The current page is Data.gov’s climate topic page. Its visible heading—and the topic name—is **Climate**. The page also shows related topic areas and climate re |
| `livev1-data-data-gov-climate` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 11,371 | 0 | 15,692 | 0 | 85,248 | 394 | 2.0 | 2.9 | 38.7 | 41.5 | 0.00 | 1.16 | The current page is Data.gov’s climate topic page. It shows the topic name **Climate** as the page heading. The page also lists climate topic areas and related  |
| `livev1-data-eurostat-database` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 15,033 | 0 | 12,448 | 0 | 71,040 | 493 | 2.3 | 2.4 | 50.8 | 53.2 | 0.00 | 1.73 | Eurostat’s database landing page displays the title **Database**. The page currently shows the “Database” heading and the data navigation tree. Earlier, the Eu |
| `livev1-data-eurostat-database` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 8 | 0 | 15,015 | 0 | 19,902 | 0 | 130,688 | 668 | 2.1 | 2.4 | 45.2 | 47.6 | 0.00 | 2.44 | The displayed database title is **Database**. The page title is “Database - Eurostat,” and the page heading also reads “Database.” Currently visible on the Eur |
| `livev1-data-eurostat-database` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 3 | 0 | 6,353 | 0 | 12,011 | 0 | 57,088 | 363 | 2.0 | 2.2 | 37.1 | 39.3 | 0.00 | 1.48 | The displayed database title is **“Database.”** The current Eurostat page shows the heading “Database” above the data navigation tree. The page also has cookie  |
| `livev1-data-oecd-data-explorer` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 3,266 | 0 | 11,638 | 0 | 57,600 | 285 | 2.0 | 2.9 | 31.3 | 34.3 | 0.00 | 0.73 | The landing page shows the product name **OECD Data Explorer**, in the page heading. The page currently displays its search box and topic browse options; I did  |
| `livev1-data-oecd-data-explorer` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 3,252 | 0 | 8,531 | 0 | 60,672 | 290 | 2.0 | 16.1 | 24.6 | 40.6 | 0.00 | 1.62 | The landing page shows **OECD Data Explorer** as the product name. The current page displays the heading “OECD Data Explorer” and the tagline “Find, understand  |
| `livev1-data-oecd-data-explorer` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 3 | 0 | 3,179 | 0 | 11,802 | 0 | 57,344 | 281 | 2.7 | 4.8 | 24.2 | 29.0 | 0.00 | 1.13 | The landing page shows the product name **OECD Data Explorer**, with the heading “OECD Data Explorer” above “Find, understand and use the data you need.” The cu |
| `livev1-navigation-wikipedia-ada` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,865 | 0 | 14,875 | 0 | 43,264 | 245 | 4.5 | 2.2 | 32.4 | 34.6 | 0.00 | 0.50 | The Ada Lovelace article is open and visible. Its current page shows the article title and biographical details, including her birth date, 10 December 1815, and |
| `livev1-navigation-wikipedia-ada` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,191 | 0 | 8,754 | 0 | 51,840 | 226 | 2.1 | 2.1 | 22.1 | 24.1 | 0.00 | 1.94 | The Ada Lovelace article is open and visible at https://en.wikipedia.org/wiki/Ada_Lovelace. The page shows her name, article tabs, and the opening biographical  |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,865 | 0 | 9,416 | 0 | 48,768 | 287 | 2.1 | 2.6 | 30.1 | 32.6 | 0.00 | 0.92 | The Ada Lovelace article is open and visible on Wikipedia. The page shows her name, a portrait captioned as a daguerreotype circa 1843, and biographical details |
| `livev1-navigation-merriam-serendipity` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 11,272 | 0 | 15,826 | 0 | 45,440 | 272 | 2.2 | 4.7 | 37.8 | 42.5 | 0.00 | 2.12 | Merriam‑Webster’s dictionary entry for **serendipity** is open. The current page shows the search input “serendipity” and defines it as “the ability to find val |
| `livev1-navigation-merriam-serendipity` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 11,006 | 0 | 10,997 | 0 | 63,360 | 317 | 2.0 | 7.2 | 44.6 | 51.8 | 0.00 | 2.77 | The Merriam-Webster entry for **serendipity** is open. The current page shows the definition: “the ability to find valuable or agreeable things not sought for,” |
| `livev1-navigation-merriam-serendipity` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 11,014 | 0 | 16,069 | 0 | 45,056 | 279 | 2.1 | 16.1 | 41.4 | 57.5 | 0.00 | 3.24 | The Merriam-Webster dictionary entry for **serendipity** is open, with its definition visible: “the ability to find valuable or agreeable things not sought for. |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,965 | 0 | 10,349 | 0 | 49,536 | 381 | 2.0 | 16.6 | 26.2 | 42.8 | 0.00 | 2.55 | The Smithsonian collection page is open for **1903 Wright Flyer**. The current page shows: - The first flight was on December 17, 1903, at Kitty Hawk, with Orv |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 6 | 0 | 13,594 | 0 | 11,073 | 0 | 112,640 | 824 | 3.2 | 9.4 | 49.0 | 58.4 | 0.00 | 2.75 | The Smithsonian National Air and Space Museum collection page is open for **1903 Wright Flyer**. The currently selected Summary tab identifies the Wright Flyer  |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,965 | 0 | 10,360 | 0 | 34,048 | 251 | 6.9 | 2.8 | 32.6 | 35.4 | 0.00 | 2.07 | Opened the Smithsonian collection object page for the **1903 Wright Flyer**. The page currently shows the Summary tab and object details, including inventory nu |
| `livev1-navigation-gutenberg-search` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,432 | 0 | 15,020 | 0 | 46,592 | 288 | 4.3 | 2.8 | 32.5 | 35.3 | 0.00 | 2.52 | The Project Gutenberg results page is open with “Frankenstein” in the search query. It shows “Displaying results 1–10” and lists matching books, including sever |
| `livev1-navigation-gutenberg-search` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,856 | 0 | 9,337 | 0 | 49,792 | 314 | 2.1 | 2.5 | 17.8 | 20.3 | 0.00 | 1.94 | The Project Gutenberg results page is open with “Frankenstein” in the query URL. It shows results 1–10; the first five visible matches are editions of *Frankens |
| `livev1-navigation-gutenberg-search` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,889 | 0 | 7,728 | 0 | 51,328 | 259 | 2.6 | 1.8 | 22.6 | 24.5 | 0.00 | 1.18 | The Project Gutenberg results page is open with **“Frankenstein”** in the search query. The site shows **results 1–10**; the first result is *Frankenstein; or,  |
| `livev1-navigation-met-collection` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 18,231 | 0 | 20,347 | 0 | 89,600 | 457 | 2.0 | 4.0 | 57.5 | 61.6 | 0.00 | 4.84 | The Met’s collection search found **Wheat Field with Cypresses** by Vincent van Gogh. I left its object page visible. The page lists the date as 1889, the mediu |
| `livev1-navigation-met-collection` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 9 | 0 | 29,614 | 0 | 29,105 | 0 | 158,208 | 647 | 2.0 | 3.2 | 83.1 | 86.3 | 0.00 | 0.72 | The Met collection search returned **“Wheat Field with Cypresses”** by Vincent van Gogh. The object page currently shows it was made in 1889, is oil on canvas,  |
| `livev1-navigation-met-collection` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 8 | 0 | 25,654 | 0 | 21,933 | 0 | 142,592 | 520 | 2.0 | 7.3 | 82.3 | 89.5 | 0.00 | 0.96 | The Met object page is open for **Wheat Field with Cypresses** by Vincent van Gogh. The page shows the artwork title, date **1889**, medium **oil on canvas**, o |
| `livev1-interactive-openlibrary-subject` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,226 | 0 | 14,287 | 0 | 72,192 | 349 | 2.9 | 12.0 | 49.0 | 61.0 | 0.00 | 1.73 | Open Library is showing the Books results page for **“machine learning.”** The search field retains the query, and the site reports **1–20 of 6,867 results**. T |
| `livev1-interactive-openlibrary-subject` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 7,368 | 0 | 22,705 | 0 | 79,872 | 488 | 2.0 | 10.0 | 62.5 | 72.5 | 0.00 | 0.51 | Open Library’s results page is open with “machine learning” retained in the search box. The site currently reports **1–20 of 6,867 results**; the first result s |
| `livev1-interactive-openlibrary-subject` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 7,260 | 0 | 14,414 | 0 | 100,096 | 480 | 3.3 | 14.1 | 53.1 | 67.2 | 0.00 | 0.45 | Open Library’s results page is visible at **https://openlibrary.org/search?q=machine+learning**. The search field retains “machine learning,” and the site repor |
| `livev1-interactive-github-issues` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,170 | 0 | 17,376 | 0 | 42,368 | 281 | 3.4 | 11.0 | 40.8 | 51.8 | 0.00 | 1.05 | The current page is the open issues view for `microsoft/vscode`. GitHub shows the search filter `is:issue state:open` and the tab **Open (19,093)**. The visible |
| `livev1-interactive-github-issues` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,178 | 0 | 10,039 | 0 | 49,664 | 259 | 3.8 | 7.7 | 44.0 | 51.6 | 0.00 | 1.12 | The `microsoft/vscode` issues page is open. The current site-generated filter is `is:issue state:open`, and the **Open** tab shows **19,092** issues. The visibl |
| `livev1-interactive-github-issues` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,064 | 0 | 18,948 | 0 | 40,704 | 265 | 2.7 | 4.7 | 42.6 | 47.3 | 0.00 | 0.91 | The page currently shows the `microsoft/vscode` Issues list with **Open (19,093)** selected. The search field contains `is:issue state:open`, and the visible re |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 6,484 | 0 | 8,701 | 0 | 91,136 | 370 | 4.5 | 10.9 | 48.7 | 59.6 | 0.00 | 1.33 | OpenStreetMap’s search for **“Eiffel Tower”** returned several matches. I selected **Tour Eiffel, 5 Avenue Anatole France, Paris 7e**, and the page now shows th |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 4,596 | 0 | 8,139 | 0 | 89,856 | 380 | 2.1 | 9.0 | 45.1 | 54.1 | 0.00 | 1.85 | OpenStreetMap’s search for **“Eiffel Tower”** returned several matches. I selected the Paris result, **“Tour Eiffel, 5, Avenue Anatole France, Quartier du Gros- |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 6,484 | 0 | 8,880 | 0 | 91,648 | 441 | 2.3 | 22.4 | 30.9 | 53.3 | 0.00 | 2.86 | OpenStreetMap shows the selected place **Tour Eiffel** in Paris, identified as **Way 5013364**. The visible site details include Paris, postcode 75007, and 5 Av |
| `livev1-interactive-tmdb-search` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 12,514 | 0 | 20,474 | 0 | 51,584 | 417 | 2.1 | 9.2 | 41.3 | 50.4 | 0.00 | 0.43 | TMDB’s title page for **Spirited Away (2001)** is visible at `/movie/129`. The page shows the title, year, genres, runtime (2h 5m), and overview. The site is di |
| `livev1-interactive-tmdb-search` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 13,825 | 0 | 24,280 | 0 | 53,120 | 363 | 2.0 | 5.2 | 34.5 | 39.7 | 0.00 | 0.67 | TMDB search results showed **Spirited Away**; I opened its title page. The current page identifies it as the 2001 film and shows its genres, runtime, overview,  |
| `livev1-interactive-tmdb-search` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 14,018 | 0 | 9,924 | 0 | 89,600 | 513 | 3.4 | 2.1 | 39.0 | 41.2 | 0.00 | 0.43 | TMDB’s search results page is visible with the query “Spirited Away.” The Movies tab shows 9 results; the first listed movie is “स्पिरिटेड अवे,” also shown with |
| `livev1-interactive-arxiv-search` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 8 | 0 | 12,740 | 0 | 11,571 | 0 | 137,984 | 837 | 3.5 | 2.0 | 47.0 | 49.0 | 0.00 | 1.26 | The arXiv results page is open with `attention is all you need` retained in the search box. The site reports **1–50 of 134 results**. The visible results includ |
| `livev1-interactive-arxiv-search` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 1 | 9,483 | 0 | 9,556 | 0 | 92,544 | 665 | 2.0 | 2.0 | 36.2 | 38.2 | 0.00 | 0.42 | Searched arXiv for **“attention is all you need”**. The results page retains that query and shows **1–50 of 134 results** across all fields. The visible results |
| `livev1-interactive-arxiv-search` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 6,579 | 0 | 17,837 | 0 | 67,072 | 382 | 2.0 | 1.6 | 32.8 | 34.3 | 0.00 | 0.45 | The arXiv results page is open with the query “attention is all you need” retained in the search field. The current page reports **1–50 of 134 results** for all |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-standards-rfc-8259` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 105,597 | 33.5 | unknown | unknown | known |
| `livev1-standards-rfc-8259` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 74,908 | 33.1 | unknown | unknown | known |
| `livev1-standards-rfc-8259` | Mantis | 3 | 1 | success | n/a | 600 | 6 | 126,489 | 52.7 | unknown | unknown | known |
| `livev1-standards-wcag-22` | Mantis | 1 | 1 | success | n/a | 600 | 7 | 174,224 | 165.8 | unknown | unknown | known |
| `livev1-standards-wcag-22` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 67,841 | 19.9 | unknown | unknown | known |
| `livev1-standards-wcag-22` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 86,777 | 32.9 | unknown | unknown | known |
| `livev1-standards-rfc-9110` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 103,542 | 77.9 | unknown | unknown | known |
| `livev1-standards-rfc-9110` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 111,519 | 88.9 | unknown | unknown | known |
| `livev1-standards-rfc-9110` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 103,435 | 88.8 | unknown | unknown | known |
| `livev1-standards-openapi-31` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 73,349 | 24.5 | unknown | unknown | known |
| `livev1-standards-openapi-31` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 62,862 | 24.4 | unknown | unknown | known |
| `livev1-standards-openapi-31` | Mantis | 3 | 1 | success | n/a | 600 | 3 | 73,271 | 32.8 | unknown | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 87,735 | 47.3 | unknown | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 87,844 | 46.9 | unknown | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 87,880 | 54.4 | unknown | unknown | known |
| `livev1-docs-python-json` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 93,324 | 30.9 | unknown | unknown | known |
| `livev1-docs-python-json` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 93,371 | 45.7 | unknown | unknown | known |
| `livev1-docs-python-json` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 109,265 | 52.2 | unknown | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 58,039 | 38.1 | unknown | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 59,440 | 43.4 | unknown | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 59,416 | 14.2 | unknown | unknown | known |
| `livev1-docs-node-url` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 104,774 | 30.6 | unknown | unknown | known |
| `livev1-docs-node-url` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 105,012 | 41.0 | unknown | unknown | known |
| `livev1-docs-node-url` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 105,421 | 28.2 | unknown | unknown | known |
| `livev1-docs-django-overview` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 58,107 | 18.7 | unknown | unknown | known |
| `livev1-docs-django-overview` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 58,086 | 18.7 | unknown | unknown | known |
| `livev1-docs-django-overview` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 58,789 | 15.7 | unknown | unknown | known |
| `livev1-docs-postgresql-types` | Mantis | 1 | 1 | success | n/a | 600 | 7 | 137,471 | 41.0 | unknown | unknown | known |
| `livev1-docs-postgresql-types` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 56,761 | 24.5 | unknown | unknown | known |
| `livev1-docs-postgresql-types` | Mantis | 3 | 1 | success | n/a | 600 | 7 | 138,413 | 44.9 | unknown | unknown | known |
| `livev1-civic-loc-about` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 59,065 | 24.9 | unknown | unknown | known |
| `livev1-civic-loc-about` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 84,756 | 71.3 | unknown | unknown | known |
| `livev1-civic-loc-about` | Mantis | 3 | 1 | success | n/a | 600 | 3 | 84,134 | 72.2 | unknown | unknown | known |
| `livev1-civic-nasa-missions` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 101,700 | 96.2 | unknown | unknown | known |
| `livev1-civic-nasa-missions` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 73,395 | 25.9 | unknown | unknown | known |
| `livev1-civic-nasa-missions` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 88,546 | 32.5 | unknown | unknown | known |
| `livev1-civic-census-about` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 84,832 | 79.7 | unknown | unknown | known |
| `livev1-civic-census-about` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 87,008 | 66.5 | unknown | unknown | known |
| `livev1-civic-census-about` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 91,801 | 64.1 | unknown | unknown | known |
| `livev1-civic-nist-about` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 88,001 | 26.6 | unknown | unknown | known |
| `livev1-civic-nist-about` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 87,818 | 25.5 | unknown | unknown | known |
| `livev1-civic-nist-about` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 88,567 | 29.1 | unknown | unknown | known |
| `livev1-civic-archives-about` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 59,276 | 27.1 | unknown | unknown | known |
| `livev1-civic-archives-about` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 59,333 | 27.8 | unknown | unknown | known |
| `livev1-civic-archives-about` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 59,262 | 44.0 | unknown | unknown | known |
| `livev1-data-world-bank-population` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 90,693 | 54.5 | unknown | unknown | known |
| `livev1-data-world-bank-population` | Mantis | 2 | 1 | success | n/a | 600 | 8 | 157,173 | 69.2 | unknown | unknown | known |
| `livev1-data-world-bank-population` | Mantis | 3 | 1 | success | n/a | 600 | 10 | 207,255 | 96.6 | unknown | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 54,580 | 26.8 | unknown | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 56,146 | 27.8 | unknown | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 57,573 | 30.7 | unknown | unknown | known |
| `livev1-data-data-gov-climate` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 72,407 | 30.3 | unknown | unknown | known |
| `livev1-data-data-gov-climate` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 87,175 | 28.2 | unknown | unknown | known |
| `livev1-data-data-gov-climate` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 100,940 | 38.7 | unknown | unknown | known |
| `livev1-data-eurostat-database` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 83,488 | 50.8 | unknown | unknown | known |
| `livev1-data-eurostat-database` | Mantis | 2 | 1 | success | n/a | 600 | 8 | 150,590 | 45.2 | unknown | unknown | known |
| `livev1-data-eurostat-database` | Mantis | 3 | 1 | success | n/a | 600 | 3 | 69,099 | 37.1 | unknown | unknown | known |
| `livev1-data-oecd-data-explorer` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 69,238 | 31.3 | unknown | unknown | known |
| `livev1-data-oecd-data-explorer` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 69,203 | 24.6 | unknown | unknown | known |
| `livev1-data-oecd-data-explorer` | Mantis | 3 | 1 | success | n/a | 600 | 3 | 69,146 | 24.2 | unknown | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 58,139 | 32.4 | unknown | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 60,594 | 22.1 | unknown | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 58,184 | 30.1 | unknown | unknown | known |
| `livev1-navigation-merriam-serendipity` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 61,266 | 37.8 | unknown | unknown | known |
| `livev1-navigation-merriam-serendipity` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 74,357 | 44.6 | unknown | unknown | known |
| `livev1-navigation-merriam-serendipity` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 61,125 | 41.4 | unknown | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 59,885 | 26.2 | unknown | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 2 | 1 | success | n/a | 600 | 6 | 123,713 | 49.0 | unknown | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 44,408 | 32.6 | unknown | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 61,612 | 32.5 | unknown | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 59,129 | 17.8 | unknown | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 59,056 | 22.6 | unknown | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 109,947 | 57.5 | unknown | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 2 | 1 | success | n/a | 600 | 9 | 187,313 | 83.1 | unknown | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 3 | 1 | success | n/a | 600 | 8 | 164,525 | 82.3 | unknown | unknown | known |
| `livev1-interactive-openlibrary-subject` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 86,479 | 49.0 | unknown | unknown | known |
| `livev1-interactive-openlibrary-subject` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 102,577 | 62.5 | unknown | unknown | known |
| `livev1-interactive-openlibrary-subject` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 114,510 | 53.1 | unknown | unknown | known |
| `livev1-interactive-github-issues` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 59,744 | 40.8 | unknown | unknown | known |
| `livev1-interactive-github-issues` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 59,703 | 44.0 | unknown | unknown | known |
| `livev1-interactive-github-issues` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 59,652 | 42.6 | unknown | unknown | known |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 99,837 | 48.7 | unknown | unknown | known |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 97,995 | 45.1 | unknown | unknown | known |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 100,528 | 30.9 | unknown | unknown | known |
| `livev1-interactive-tmdb-search` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 72,058 | 41.3 | unknown | unknown | known |
| `livev1-interactive-tmdb-search` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 77,400 | 34.5 | unknown | unknown | known |
| `livev1-interactive-tmdb-search` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 99,524 | 39.0 | unknown | unknown | known |
| `livev1-interactive-arxiv-search` | Mantis | 1 | 1 | success | n/a | 600 | 8 | 149,555 | 47.0 | unknown | unknown | known |
| `livev1-interactive-arxiv-search` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 102,100 | 36.2 | unknown | unknown | known |
| `livev1-interactive-arxiv-search` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 84,909 | 32.8 | unknown | unknown | known |
