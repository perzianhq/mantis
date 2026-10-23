# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-23; runs per task and approach: 3; 12 runs in parallel.
- Scope: 30 tasks × 1 approaches × 3 runs = 90 logical runs; 90 recorded so far; 108 total attempts including retries.
- Claude runtime: 2.1.161 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 72 / 72 |
| After reruns / merged correct | 84 / 84 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 84 / 84 |
| Connection-failure attempts | 24 |
| Logical runs ending in connection failure | 6 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 383 |
| MCP tool errors (including retries) | 13 |
| Browser observation text (observed chars) | 958,304 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 1,126 |
| Cache-write input tokens (total) | 1,068,206 |
| Cache-read input tokens (total) | 5,797,489 |
| Output tokens (total) | 96,102 |
| Total input tokens incl. cache (legacy) | 6,866,821 |
| MCP startup (total, s) | 318.5 |
| CLI startup (total, s) | 1049.7 |
| CLI execution (total, s) | 4066.7 |
| CLI wall (total, s) | 5116.4 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 153.1 |
| Harness capture (total, s) | 432.8 |
| Cost estimate (USD; including retries) | 7.19 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-standards-rfc-8259` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 17,431 | 0 | 14 | 14,289 | 79,053 | 915 | 2.1 | 4.1 | 51.1 | 55.2 | 0.00 | 1.03 | The RFC 8259 page is open. Its displayed heading is "RFC 8259: STD 90: The JavaScript Object Notation (JSON) Data Interchange Format", and the browser tab reads |
| `livev1-standards-rfc-8259` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 17,431 | 0 | 14 | 14,239 | 79,028 | 864 | 2.1 | 3.7 | 41.6 | 45.2 | 0.00 | 1.40 | The RFC 8259 page is open. Its displayed heading is "RFC 8259: STD 90: The JavaScript Object Notation (JSON) Data Interchange Format" (the browser tab shows the |
| `livev1-standards-rfc-8259` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 17,431 | 0 | 14 | 14,257 | 79,052 | 968 | 2.1 | 3.9 | 41.4 | 45.3 | 0.00 | 4.69 | RFC 8259's displayed title is "The JavaScript Object Notation (JSON) Data Interchange Format," shown on its page with the heading "RFC 8259: STD 90: The JavaScr |
| `livev1-standards-wcag-22` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 12,961 | 0 | 14 | 11,487 | 80,122 | 892 | 2.1 | 3.9 | 126.8 | 130.8 | 0.00 | 1.59 | The W3C page titled "Web Content Accessibility Guidelines (WCAG) 2.2" is the WCAG 2.2 recommendation. The site lists it as a W3C Recommendation dated 12 Decembe |
| `livev1-standards-wcag-22` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 7 | 0 | 13,061 | 0 | 14 | 11,779 | 80,963 | 998 | 2.1 | 3.7 | 152.2 | 155.9 | 0.00 | 1.11 | The WCAG 2.2 recommendation's displayed title is "Web Content Accessibility Guidelines (WCAG) 2.2". The page shows it as a W3C Recommendation dated 12 December  |
| `livev1-standards-wcag-22` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 12,952 | 0 | 14 | 11,473 | 80,032 | 892 | 2.1 | 4.5 | 126.3 | 130.7 | 0.00 | 2.98 | The WCAG 2.2 recommendation's displayed title is **Web Content Accessibility Guidelines (WCAG) 2.2**. The page shows it as the main heading, with "W3C Recommend |
| `livev1-standards-rfc-9110` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 9,641 | 0 | 14 | 10,401 | 79,282 | 827 | 2.2 | 3.8 | 61.5 | 65.3 | 0.00 | 2.43 | The RFC 9110 page is open, and its displayed title is **"HTTP Semantics"**. The full heading reads "RFC 9110: STD 97: HTTP Semantics", and the browser tab shows |
| `livev1-standards-rfc-9110` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 9,641 | 0 | 14 | 10,389 | 79,330 | 1,022 | 2.2 | 4.5 | 65.9 | 70.4 | 0.00 | 2.59 | The displayed title of RFC 9110 is **"HTTP Semantics"**. The full heading on the RFC Editor page reads "RFC 9110: STD 97: HTTP Semantics", and the browser tab r |
| `livev1-standards-rfc-9110` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 9,641 | 0 | 14 | 10,345 | 79,265 | 823 | 2.2 | 4.1 | 66.3 | 70.4 | 0.00 | 4.36 | The RFC 9110 page displays the title "RFC 9110: STD 97: HTTP Semantics" as its main heading. The browser tab reads "RFC 9110: HTTP Semantics \| RFC Editor". The  |
| `livev1-standards-openapi-31` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 7,672 | 0 | 10 | 9,635 | 47,211 | 830 | 2.2 | 3.8 | 25.5 | 29.3 | 0.00 | 5.33 | The title of the OpenAPI 3.1.0 specification page reads "OpenAPI Specification v3.1.0", with the heading "Version 3.1.0" and a publication date of 15 February 2 |
| `livev1-standards-openapi-31` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,938 | 0 | 12 | 9,945 | 62,931 | 1,013 | 2.2 | 3.7 | 33.1 | 36.8 | 0.00 | 3.06 | The title of the OpenAPI 3.1.0 specification page reads "OpenAPI Specification v3.1.0". The page's heading also says "Version 3.1.0", dated 15 February 2021. I |
| `livev1-standards-openapi-31` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,938 | 0 | 12 | 9,684 | 62,624 | 675 | 2.2 | 4.5 | 32.3 | 36.8 | 0.00 | 2.64 | The OpenAPI 3.1.0 specification page shows the title "OpenAPI Specification v3.1.0", with "Version 3.1.0" and a publication date of 15 February 2021. I reached  |
| `livev1-standards-css-color-4` | Mantis | 1 | connection_failure | connection_failure | connection_failure | 2 | n/a | 600 | 0 | 0 | 0 | 0 | 8 | 10,900 | 6,116 | 1,190 | 14.1 | 36.2 | 19.4 | 55.5 | 0.00 | 3.32 | MCP connection failed: pending |
| `livev1-standards-css-color-4` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 15,530 | 0 | 14 | 12,438 | 80,302 | 1,067 | 4.1 | 16.0 | 129.0 | 145.0 | 0.00 | 0.78 | The displayed title is **"CSS Color Module Level 4"** (the page's `<h1>` and browser tab title). The name you gave, "CSS Color Level 4", is the short name I sea |
| `livev1-standards-css-color-4` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 13,241 | 0 | 14 | 11,520 | 78,567 | 885 | 7.1 | 9.2 | 119.8 | 129.0 | 0.00 | 1.03 | The CSS Color Level 4 spec's displayed title is **"CSS Color Module Level 4"**. I reached it from the W3C homepage through Standards & groups, then "W3C standar |
| `livev1-docs-python-json` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 15,643 | 0 | 10 | 12,953 | 50,569 | 1,140 | 3.1 | 8.3 | 41.7 | 50.0 | 0.00 | 1.23 | The json module heading on the Python 3.15.1 docs is **"json — JSON encoder and decoder"**. I reached it from docs.python.org by following "Library reference", |
| `livev1-docs-python-json` | Mantis | 2 | success | connection_failure | success | 2 | n/a | 600 | 4 | 0 | 15,658 | 0 | 16 | 18,328 | 70,602 | 1,386 | 4.3 | 29.2 | 31.8 | 61.0 | 0.00 | 5.34 | The json module heading is **"json — JSON encoder and decoder"**. I reached it from docs.python.org by following the Library reference link and then the json en |
| `livev1-docs-python-json` | Mantis | 3 | success | connection_failure | success | 2 | n/a | 600 | 4 | 0 | 10,459 | 0 | 16 | 16,095 | 66,173 | 1,352 | 5.2 | 31.2 | 27.2 | 58.3 | 0.00 | 4.93 | The module heading is **"json — JSON encoder and decoder"**. I started at https://docs.python.org/, which redirected to the 3.15.1 docs at /3/. From there I op |
| `livev1-docs-mdn-http-overview` | Mantis | 1 | success | connection_failure | success | 2 | n/a | 600 | 5 | 0 | 14,375 | 0 | 14 | 17,930 | 54,043 | 1,936 | 13.6 | 31.1 | 47.1 | 78.2 | 0.00 | 3.92 | The heading is **"Overview of HTTP"**. I reached it by typing "HTTP overview" into MDN's site search, which returned the page at `/en-US/docs/Web/HTTP/Guides/Ov |
| `livev1-docs-mdn-http-overview` | Mantis | 2 | success | connection_failure | success | 2 | n/a | 600 | 4 | 0 | 13,062 | 0 | 14 | 17,133 | 53,795 | 1,435 | 5.6 | 29.5 | 43.6 | 73.0 | 0.00 | 3.85 | The page heading is **"Overview of HTTP"**. I got there from MDN's homepage by using the site search for "HTTP overview", which redirected to `/en-US/docs/Web/H |
| `livev1-docs-mdn-http-overview` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,920 | 0 | 12 | 9,603 | 63,775 | 851 | 4.1 | 18.3 | 33.2 | 51.5 | 0.00 | 1.64 | The heading of MDN's HTTP overview page is "Overview of HTTP". I reached it from the home page by using the site search for "HTTP overview" and opening the top  |
| `livev1-docs-node-url` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 5,451 | 0 | 8 | 8,315 | 32,375 | 721 | 2.7 | 7.3 | 23.2 | 30.5 | 0.00 | 2.12 | The Node.js API documentation index is open. The page's main heading and title are both "Index". - **API section title:** "Index", from the heading "## Index"  |
| `livev1-docs-node-url` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 15,013 | 0 | 14 | 13,257 | 77,986 | 884 | 2.9 | 8.6 | 37.1 | 45.7 | 0.00 | 1.39 | The API section title is **URL**. The page heading reads "## URL" and the browser tab title is "URL \| Node.js v26.12.1 Documentation". I got there by clicking D |
| `livev1-docs-node-url` | Mantis | 3 | connection_failure | connection_failure | connection_failure | 2 | n/a | 600 | 0 | 0 | 0 | 0 | 8 | 10,890 | 6,116 | 1,363 | 6.0 | 24.7 | 17.4 | 42.1 | 0.00 | 3.49 | MCP connection failed: pending |
| `livev1-docs-django-overview` | Mantis | 1 | success | connection_failure | success | 2 | n/a | 600 | 2 | 0 | 6,391 | 0 | 12 | 13,839 | 35,074 | 1,193 | 5.2 | 21.5 | 26.8 | 48.3 | 0.00 | 1.54 | The heading on Django's overview page is **"Why Django?"**. I got there from the docs home page by clicking the "Overview" link in the main navigation, which re |
| `livev1-docs-django-overview` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,391 | 0 | 8 | 8,318 | 32,008 | 464 | 4.3 | 10.7 | 20.3 | 31.0 | 0.00 | 1.74 | The Django overview page's main heading is **"Why Django?"**. Its browser title is "Django overview \| Django". I opened https://docs.djangoproject.com/, which  |
| `livev1-docs-django-overview` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 6,391 | 0 | 8 | 8,445 | 32,012 | 607 | 2.9 | 10.4 | 21.2 | 31.5 | 0.00 | 2.15 | The Django overview page's main heading is **"Why Django?"** (page title: "Django overview \| Django"). I started at the docs home page (`https://docs.djangopro |
| `livev1-docs-postgresql-types` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 13,454 | 0 | 18 | 12,908 | 112,823 | 987 | 3.1 | 10.4 | 45.1 | 55.5 | 0.00 | 0.68 | The current data-types chapter is **"Chapter 8. Data Types"**, from the PostgreSQL 18.6 documentation (the version the site labels "Current"). Path: postgresql |
| `livev1-docs-postgresql-types` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 9 | 1 | 11,493 | 0 | 20 | 12,446 | 127,822 | 1,576 | 2.0 | 10.4 | 62.8 | 73.2 | 0.00 | 0.55 | The current data-types chapter heading is **"Chapter 8. Data Types"**. What's visible now: the PostgreSQL 18 documentation page at Chapter 8, with its table of |
| `livev1-docs-postgresql-types` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 9 | 2 | 11,787 | 0 | 22 | 12,463 | 138,877 | 1,304 | 2.4 | 10.5 | 118.2 | 128.7 | 0.00 | 0.90 | The current data-types chapter is titled **"Chapter 8. Data Types"**. The site's documentation index labels PostgreSQL 18 as "Current" (the 18.6 manual), and v |
| `livev1-civic-loc-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 1 | 9,365 | 0 | 12 | 9,443 | 59,451 | 594 | 3.0 | 10.6 | 71.3 | 81.9 | 0.00 | 1.43 | The organization name shown on the About page is **Library of Congress**. The page heading reads "About the Library of Congress," and the body describes it as " |
| `livev1-civic-loc-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 1 | 9,365 | 0 | 12 | 9,453 | 59,480 | 610 | 3.8 | 11.1 | 65.2 | 76.3 | 0.00 | 0.84 | The organization name on the About page is **Library of Congress**. The page describes it as "an agency of the legislative branch of the U.S. government." I wen |
| `livev1-civic-loc-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 2 | 9,386 | 0 | 14 | 9,736 | 70,369 | 936 | 3.3 | 10.0 | 87.5 | 97.5 | 0.00 | 2.48 | The About page at loc.gov names the organization as the **Library of Congress**. The page heading is "About the Library of Congress," and the body text describe |
| `livev1-civic-nasa-missions` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 14,443 | 0 | 12 | 12,334 | 63,721 | 751 | 3.5 | 8.7 | 23.6 | 32.3 | 0.00 | 0.50 | The heading on NASA's Missions page is **"Missions"**. I reached it from the homepage by clicking the "Missions" link under "More Topics from NASA," and the pag |
| `livev1-civic-nasa-missions` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 1 | 7,989 | 0 | 12 | 9,759 | 60,131 | 616 | 2.0 | 8.1 | 61.2 | 69.3 | 0.00 | 1.36 | The NASA Missions page heading is "Missions". I reached it from the homepage by clicking the "Missions" link under "More Topics from NASA". The first attempt to |
| `livev1-civic-nasa-missions` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 14,525 | 0 | 12 | 12,097 | 63,727 | 533 | 2.0 | 5.5 | 20.7 | 26.1 | 0.00 | 0.49 | The page heading is **"Missions"**, with the subheading "NASA explores the secrets of the universe for the benefit of all." I got there by clicking the "Mission |
| `livev1-civic-census-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 1 | 11,540 | 0 | 12 | 10,940 | 62,091 | 887 | 3.0 | 3.7 | 71.7 | 75.4 | 0.00 | 1.98 | The agency name on the About page is **United States Census Bureau**. The site header shows it as "United States Census Bureau" (#3), and the page is titled "Ab |
| `livev1-civic-census-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,138 | 0 | 8 | 9,608 | 33,338 | 591 | 2.0 | 4.9 | 42.2 | 47.1 | 0.00 | 2.06 | The About page is open. The agency name shown in its header is "United States Census Bureau," and the page body refers to it as "the Census Bureau." This comes  |
| `livev1-civic-census-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 3 | 0 | 11,466 | 0 | 10 | 10,880 | 49,554 | 802 | 2.0 | 3.4 | 64.7 | 68.2 | 0.00 | 2.00 | The About page shows the agency name as **United States Census Bureau**, in the header logo link (#3). The body text also uses "U.S. Census Bureau" (in the "Wit |
| `livev1-civic-nist-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 9,480 | 0 | 12 | 9,677 | 62,605 | 591 | 2.0 | 1.9 | 28.2 | 30.1 | 0.00 | 1.57 | The heading on the NIST About destination is **"About NIST"** (page title "About NIST \| NIST"). I reached it from nist.gov by expanding the "About NIST" menu an |
| `livev1-civic-nist-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 9,084 | 0 | 12 | 9,456 | 62,531 | 545 | 2.0 | 2.1 | 28.9 | 31.0 | 0.00 | 1.37 | The heading on the About destination is **"About NIST"**. I reached it from the homepage by expanding the "About NIST" menu and clicking "About Us." What is vi |
| `livev1-civic-nist-about` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 4 | 0 | 9,539 | 0 | 12 | 9,711 | 62,675 | 711 | 2.0 | 2.6 | 36.3 | 38.9 | 0.00 | 1.47 | The heading on the official About page is **"About NIST"**. I reached it from the homepage by expanding the "About NIST" menu and selecting "About Us," which le |
| `livev1-civic-archives-about` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,404 | 0 | 8 | 9,710 | 32,437 | 435 | 2.0 | 4.0 | 27.5 | 31.5 | 0.00 | 0.88 | The About page (What is the National Archives?) names the organization as **The National Archives and Records Administration (NARA)**. The page heading reads "W |
| `livev1-civic-archives-about` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,404 | 0 | 8 | 9,760 | 32,458 | 554 | 2.9 | 12.4 | 24.5 | 36.9 | 0.00 | 1.24 | The About page names the organization as **The National Archives and Records Administration (NARA)**. The page heading reads "What is the National Archives and  |
| `livev1-civic-archives-about` | Mantis | 3 | connection_failure | connection_failure | connection_failure | 2 | n/a | 600 | 0 | 0 | 0 | 0 | 8 | 10,900 | 6,116 | 1,214 | 4.1 | 23.9 | 13.1 | 37.0 | 0.00 | 2.13 | MCP connection failed: pending |
| `livev1-data-world-bank-population` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 7 | 0 | 14,650 | 0 | 18 | 12,732 | 117,406 | 1,077 | 4.4 | 8.5 | 52.0 | 60.5 | 0.00 | 0.95 | The indicator title is **"Population, total"** (indicator code SP.POP.TOTL). The page currently shows the title "Population, total", the source "World Populati |
| `livev1-data-world-bank-population` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 9,449 | 0 | 14 | 10,200 | 78,266 | 857 | 2.7 | 8.5 | 37.0 | 45.4 | 0.00 | 1.19 | The indicator title is **"Population, total"** (code SP.POP.TOTL), with the source listed as the UN World Population Prospects and a CC BY-4.0 license. The pag |
| `livev1-data-world-bank-population` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 10,849 | 0 | 14 | 10,933 | 79,824 | 1,223 | 2.3 | 7.2 | 41.6 | 48.8 | 0.00 | 1.49 | The indicator title is **"Population, total"** (indicator code SP.POP.TOTL, source: UN World Population Prospects, license CC BY-4.0). What is visible now on t |
| `livev1-data-ourworldindata-co2` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 4,954 | 0 | 8 | 7,748 | 31,850 | 669 | 2.7 | 7.2 | 31.2 | 38.4 | 0.00 | 0.61 | The CO₂ page's title is **"CO₂ and Greenhouse Gas Emissions"**. I reached it from the homepage's "Popular pages" link labeled "CO₂ Emissions". The browser tab t |
| `livev1-data-ourworldindata-co2` | Mantis | 2 | success | connection_failure | success | 2 | n/a | 600 | 2 | 0 | 4,954 | 0 | 12 | 13,230 | 34,933 | 1,179 | 4.3 | 19.6 | 30.9 | 50.5 | 0.00 | 1.95 | The CO₂ emissions page is titled **"CO₂ and Greenhouse Gas Emissions"**. I reached it from the homepage's "Popular pages" link "CO₂ Emissions," which redirected |
| `livev1-data-ourworldindata-co2` | Mantis | 3 | success | connection_failure | success | 2 | n/a | 600 | 3 | 0 | 7,046 | 0 | 12 | 14,187 | 34,949 | 1,294 | 4.7 | 25.4 | 29.5 | 55.0 | 0.00 | 2.08 | The page is titled "CO₂ and Greenhouse Gas Emissions". I got there from the homepage's "CO₂ Emissions" popular-pages link. The browser tab title is "CO₂ and Gre |
| `livev1-data-data-gov-climate` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 19 | 0 | 47,217 | 0 | 30 | 27,425 | 284,867 | 3,363 | 3.0 | 8.4 | 108.0 | 116.4 | 0.00 | 4.91 | I could not find a climate topic page on Data.gov, so I have no topic name to report. What I checked: - **Home page (data.gov):** no topics, categories, or cli |
| `livev1-data-data-gov-climate` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 13 | 0 | 32,128 | 0 | 24 | 21,813 | 193,088 | 3,164 | 3.7 | 6.7 | 80.2 | 87.0 | 0.00 | 1.64 | I could not find a climate topic page on Data.gov, so I have no topic name to report. What I checked: - **data.gov home:** no climate or topic link. The nav ha |
| `livev1-data-data-gov-climate` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 11,164 | 0 | 14 | 10,429 | 75,554 | 1,066 | 2.2 | 7.4 | 29.1 | 36.5 | 0.00 | 0.82 | The topic name is **Climate**. I reached it by opening `https://data.gov/climate`, which redirected to `https://data.gov/climate/1/`. The page heading reads "Cl |
| `livev1-data-eurostat-database` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 18 | 0 | 34,735 | 0 | 30 | 22,439 | 270,498 | 2,842 | 2.0 | 5.5 | 115.6 | 121.1 | 0.00 | 0.98 | The Eurostat database landing page's displayed title is "Database" (the main heading, with the browser tab reading "Database - Eurostat"). I reached it from com |
| `livev1-data-eurostat-database` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 8,070 | 0 | 10 | 9,295 | 45,853 | 1,312 | 2.0 | 12.9 | 28.3 | 41.2 | 0.00 | 2.41 | The displayed title is **"Database"**, shown as the main heading on Eurostat's database page. The browser tab reads "Database - Eurostat". What is visible now: |
| `livev1-data-eurostat-database` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 15 | 2 | 19,101 | 0 | 30 | 15,264 | 228,936 | 2,403 | 2.0 | 8.0 | 98.4 | 106.4 | 0.00 | 0.53 | The Eurostat database landing page is open, and its displayed title is **"Database"** (the H1, with the breadcrumb ending in "Database"). Below it is the "Data  |
| `livev1-data-oecd-data-explorer` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 3,555 | 0 | 8 | 7,226 | 31,214 | 744 | 3.5 | 9.7 | 22.6 | 32.3 | 0.00 | 2.26 | The OECD Data Explorer landing page shows the product name "OECD Data Explorer" as its main heading. The logo's alt text reads ".Stat Data Explorer", so the pla |
| `livev1-data-oecd-data-explorer` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 4,269 | 0 | 10 | 7,821 | 43,979 | 718 | 2.0 | 8.4 | 25.8 | 34.2 | 0.00 | 1.05 | The OECD Data Explorer landing page shows the product name **"OECD Data Explorer"** as its main heading. The subheading reads "Find, understand and use the data |
| `livev1-data-oecd-data-explorer` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 3,119 | 0 | 8 | 7,009 | 31,211 | 663 | 2.0 | 8.7 | 20.1 | 28.7 | 0.00 | 2.56 | The landing page's main heading reads **"OECD Data Explorer."** The logo's alt text reads "Home – .Stat Data Explorer - Logo," so the page also uses ".Stat Data |
| `livev1-navigation-wikipedia-ada` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,191 | 0 | 8 | 10,230 | 33,789 | 712 | 3.4 | 10.4 | 27.7 | 38.1 | 0.00 | 3.25 | The Ada Lovelace article is open and visible. I searched for "Ada Lovelace" from the Wikipedia home page, and the site loaded the article titled "Ada Lovelace - |
| `livev1-navigation-wikipedia-ada` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,191 | 0 | 8 | 10,218 | 33,783 | 556 | 2.0 | 14.2 | 27.5 | 41.6 | 0.00 | 1.99 | The Ada Lovelace article is open and visible. I got there by searching "Ada Lovelace" from the Wikipedia homepage. The page title is "Ada Lovelace - Wikipedia", |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | connection_failure | connection_failure | connection_failure | 2 | n/a | 600 | 0 | 0 | 0 | 0 | 8 | 10,918 | 6,116 | 1,283 | 5.4 | 28.5 | 15.9 | 44.4 | 0.00 | 9.20 | MCP connection failed: pending |
| `livev1-navigation-merriam-serendipity` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 11,707 | 0 | 10 | 11,518 | 49,127 | 776 | 2.1 | 17.1 | 57.8 | 74.9 | 0.00 | 1.11 | The Merriam-Webster entry for "serendipity" is open and its definition is visible. It's a noun, pronounced ˌser-ən-ˈdi-pə-tē, defined as "the ability to find va |
| `livev1-navigation-merriam-serendipity` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 11,007 | 0 | 8 | 11,064 | 33,760 | 718 | 3.9 | 11.2 | 50.6 | 61.9 | 0.00 | 1.49 | Merriam-Webster's entry for "serendipity" is open and the definition is visible. I searched from the homepage and it loaded the dictionary entry directly. Nothi |
| `livev1-navigation-merriam-serendipity` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 3 | 0 | 16,924 | 0 | 8 | 13,809 | 33,721 | 694 | 4.1 | 10.7 | 53.0 | 63.7 | 0.00 | 0.48 | The Merriam-Webster entry for "serendipity" is open and its definition is visible. I typed "serendipity" into the site search and it loaded the dictionary entry |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,965 | 0 | 8 | 10,283 | 32,957 | 723 | 2.1 | 11.0 | 44.8 | 55.9 | 0.00 | 1.48 | I opened the collection object page for the 1903 Wright Flyer from the homepage's "From the collection" section. The page is currently showing the object summar |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 9,965 | 0 | 8 | 10,223 | 32,954 | 710 | 2.1 | 11.3 | 48.4 | 59.7 | 0.00 | 0.46 | The Wright Flyer collection object page is open. The page shows the object title "1903 Wright Flyer" with inventory number A19610048000. It lists the date as 19 |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 3 | success | connection_failure | success | 2 | n/a | 600 | 3 | 0 | 10,025 | 0 | 14 | 15,771 | 50,556 | 1,565 | 10.0 | 26.2 | 51.3 | 77.5 | 0.00 | 1.18 | I opened the 1903 Wright Flyer collection object page (inventory number A19610048000) from the museum homepage's "From the collection" section. The page is open |
| `livev1-navigation-gutenberg-search` | Mantis | 1 | success | connection_failure | success | 2 | n/a | 600 | 2 | 0 | 6,887 | 0 | 12 | 14,359 | 36,264 | 1,640 | 6.5 | 42.3 | 34.9 | 77.2 | 0.00 | 0.91 | The search for "Frankenstein" is done, and the results page is still open. It is at https://www.gutenberg.org/ebooks/search/?query=Frankenstein, and the "Books: |
| `livev1-navigation-gutenberg-search` | Mantis | 2 | success | connection_failure | success | 2 | n/a | 600 | 2 | 0 | 6,432 | 0 | 12 | 14,157 | 36,061 | 1,278 | 4.1 | 41.2 | 32.8 | 74.0 | 0.00 | 1.08 | The search results page for "Frankenstein" is open and visible. I did not log in, buy anything, or enter personal information. The visible page shows "Displayi |
| `livev1-navigation-gutenberg-search` | Mantis | 3 | success | connection_failure | success | 2 | n/a | 600 | 2 | 0 | 6,856 | 0 | 12 | 14,374 | 36,312 | 1,822 | 7.8 | 28.8 | 31.3 | 60.1 | 0.00 | 0.84 | The search for "Frankenstein" ran on Project Gutenberg and the results page is open. Nothing was logged into, purchased, or entered. What is visible now: "Book |
| `livev1-navigation-met-collection` | Mantis | 1 | connection_failure | connection_failure | connection_failure | 2 | n/a | 600 | 0 | 0 | 0 | 0 | 8 | 10,938 | 6,116 | 1,491 | 4.9 | 29.7 | 14.5 | 44.1 | 0.00 | 1.74 | MCP connection failed: pending |
| `livev1-navigation-met-collection` | Mantis | 2 | connection_failure | connection_failure | connection_failure | 2 | n/a | 600 | 0 | 0 | 0 | 0 | 8 | 10,936 | 6,116 | 1,477 | 5.6 | 24.9 | 18.8 | 43.7 | 0.00 | 1.74 | MCP connection failed: pending |
| `livev1-navigation-met-collection` | Mantis | 3 | success | connection_failure | success | 2 | n/a | 600 | 7 | 2 | 18,350 | 0 | 22 | 20,190 | 118,452 | 1,458 | 4.6 | 26.2 | 43.5 | 69.7 | 0.00 | 1.43 | The Met's collection search for "Wheat Field with Cypresses" returned 1,057 results, and the first is the Van Gogh painting. I opened its object page, which is  |
| `livev1-interactive-openlibrary-subject` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,203 | 0 | 12 | 9,062 | 61,982 | 606 | 8.0 | 4.0 | 32.5 | 36.5 | 0.00 | 0.30 | Searched Open Library for "machine learning" and the results page is open with the query retained. The site reports "1 - 20 of 6,867 results" (site-generated, s |
| `livev1-interactive-openlibrary-subject` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 4 | 0 | 7,201 | 0 | 12 | 9,120 | 62,153 | 697 | 4.0 | 5.2 | 29.1 | 34.3 | 0.00 | 0.32 | The Open Library search for "machine learning" ran, and the results page is open with the query still in the search box. The site reports "1 - 20 of 6,867 resul |
| `livev1-interactive-openlibrary-subject` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 13,115 | 0 | 12 | 11,877 | 67,730 | 801 | 2.5 | 6.5 | 32.0 | 38.5 | 0.00 | 0.56 | The Open Library search for "machine learning" is open with the query kept in the search box. The results page shows "1 - 20 of 6,867 results" with "Relevance"  |
| `livev1-interactive-github-issues` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,178 | 0 | 8 | 9,521 | 33,348 | 526 | 2.9 | 7.8 | 26.8 | 34.5 | 0.00 | 0.24 | The microsoft/vscode Issues page is open with the Open tab selected. The site shows "Open (19,092)" and "Closed (237,939)", and the search box reads "is:issue s |
| `livev1-interactive-github-issues` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,072 | 0 | 8 | 9,500 | 33,294 | 799 | 2.0 | 7.7 | 29.6 | 37.3 | 0.00 | 0.68 | The microsoft/vscode Issues page is open with the open-issues state visible. The search box contains `is:issue state:open`, and the "Open (19,092)" tab is selec |
| `livev1-interactive-github-issues` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 2 | 0 | 8,072 | 0 | 8 | 9,602 | 33,303 | 1,058 | 4.0 | 4.2 | 29.4 | 33.6 | 0.00 | 0.14 | The microsoft/vscode Issues page is open with the Open filter active, and it's still showing that state. - **Site-generated results:** The "Open (19,092)" tab  |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 6 | 0 | 9,421 | 0 | 14 | 11,022 | 78,186 | 1,247 | 3.4 | 4.0 | 23.5 | 27.5 | 0.00 | 0.23 | The search for "Eiffel Tower" returned 9 results across several cities. I opened the Paris one, "Tour Eiffel" (way 5013364), which is the page now showing. The |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 6,200 | 0 | 14 | 9,323 | 74,958 | 941 | 2.8 | 4.7 | 25.6 | 30.3 | 0.00 | 0.17 | I searched OpenStreetMap for "Eiffel Tower" and opened the Paris landmark from the results. The search returned 18 results, and the first was an artwork in Kolk |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 6,200 | 0 | 14 | 9,312 | 74,949 | 846 | 2.3 | 4.2 | 24.0 | 28.2 | 0.00 | 0.17 | I searched OpenStreetMap for "Eiffel Tower" and opened the Paris result, "Tour Eiffel" (way 5013364), at 5 Avenue Anatole France, 75007 Paris. That is the site' |
| `livev1-interactive-tmdb-search` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 4 | 0 | 18,210 | 0 | 10 | 15,664 | 49,864 | 1,381 | 2.0 | 3.9 | 28.4 | 32.3 | 0.00 | 0.17 | The search for "Spirited Away" returned 9 movie results. I opened the top title result, which is TMDB's page for the 2001 Studio Ghibli film (movie ID 129), and |
| `livev1-interactive-tmdb-search` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 13,834 | 0 | 10 | 13,348 | 49,742 | 1,396 | 3.7 | 5.1 | 28.9 | 34.1 | 0.00 | 0.13 | The search for "Spirited Away" returned 9 movie results, and the top film result is the 2001 film, which TMDB shows at `/movie/129`. The title page is open now, |
| `livev1-interactive-tmdb-search` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 16,821 | 0 | 10 | 15,047 | 54,013 | 1,441 | 3.3 | 5.1 | 26.1 | 31.2 | 0.00 | 0.14 | The search for "Spirited Away" returned results, and I opened the top title, which is the 2001 Studio Ghibli film. The title page is now showing. - **Search re |
| `livev1-interactive-arxiv-search` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 5 | 0 | 6,857 | 0 | 12 | 9,311 | 61,514 | 1,019 | 2.8 | 6.0 | 20.0 | 26.0 | 0.00 | 0.16 | The arXiv search for "attention is all you need" is complete and the results page is left open with the query still in the search box. The site reports "Showing |
| `livev1-interactive-arxiv-search` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 7 | 0 | 9,931 | 0 | 14 | 11,198 | 83,651 | 1,177 | 2.3 | 5.8 | 31.6 | 37.5 | 0.00 | 0.12 | The arXiv search for "attention is all you need" is done, and the results page is still open with the query in the search box. - **Visible on the page:** "Show |
| `livev1-interactive-arxiv-search` | Mantis | 3 | success | success | success | 1 | n/a | 600 | 5 | 0 | 7,104 | 0 | 12 | 9,392 | 61,678 | 1,260 | 2.0 | 5.3 | 20.8 | 26.1 | 0.00 | 0.16 | The arXiv search for "attention is all you need" is open and the query is still in the search box. The results page reports **134 results** for "all fields". I |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `livev1-standards-rfc-8259` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 93,356 | 51.1 | 0.091 | unknown | known |
| `livev1-standards-rfc-8259` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 93,281 | 41.6 | 0.09 | unknown | known |
| `livev1-standards-rfc-8259` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 93,323 | 41.4 | 0.092 | unknown | known |
| `livev1-standards-wcag-22` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 91,623 | 126.8 | 0.081 | unknown | known |
| `livev1-standards-wcag-22` | Mantis | 2 | 1 | success | n/a | 600 | 7 | 92,756 | 152.2 | 0.083 | unknown | known |
| `livev1-standards-wcag-22` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 91,519 | 126.3 | 0.08 | unknown | known |
| `livev1-standards-rfc-9110` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 89,697 | 61.5 | 0.075 | unknown | known |
| `livev1-standards-rfc-9110` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 89,733 | 65.9 | 0.078 | unknown | known |
| `livev1-standards-rfc-9110` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 89,624 | 66.3 | 0.075 | unknown | known |
| `livev1-standards-openapi-31` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 56,856 | 25.5 | 0.063 | unknown | known |
| `livev1-standards-openapi-31` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 72,888 | 33.1 | 0.071 | unknown | known |
| `livev1-standards-openapi-31` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 72,320 | 32.3 | 0.065 | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 1 | 1 | connection_failure | n/a | 600 | 0 | 8,511 | 12.0 | 0.03 | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 1 | 2 | connection_failure | n/a | 600 | 0 | 8,513 | 7.3 | 0.03 | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 92,754 | 129.0 | 0.087 | unknown | known |
| `livev1-standards-css-color-4` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 90,101 | 119.8 | 0.08 | unknown | known |
| `livev1-docs-python-json` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 63,532 | 41.7 | 0.081 | unknown | known |
| `livev1-docs-python-json` | Mantis | 2 | 1 | connection_failure | n/a | 600 | 0 | 8,507 | 11.6 | 0.031 | unknown | known |
| `livev1-docs-python-json` | Mantis | 2 | 2 | success | n/a | 600 | 4 | 80,439 | 20.2 | 0.08 | unknown | known |
| `livev1-docs-python-json` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,505 | 9.6 | 0.032 | unknown | known |
| `livev1-docs-python-json` | Mantis | 3 | 2 | success | n/a | 600 | 4 | 73,779 | 17.5 | 0.068 | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 1 | 1 | connection_failure | n/a | 600 | 0 | 8,510 | 8.3 | 0.031 | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 1 | 2 | success | n/a | 600 | 5 | 63,477 | 38.9 | 0.081 | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 2 | 1 | connection_failure | n/a | 600 | 0 | 8,512 | 8.7 | 0.03 | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 2 | 2 | success | n/a | 600 | 4 | 62,430 | 34.9 | 0.072 | unknown | known |
| `livev1-docs-mdn-http-overview` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 73,390 | 33.2 | 0.068 | unknown | known |
| `livev1-docs-node-url` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 40,698 | 23.2 | 0.052 | unknown | known |
| `livev1-docs-node-url` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 91,257 | 37.1 | 0.086 | unknown | known |
| `livev1-docs-node-url` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,508 | 8.2 | 0.031 | unknown | known |
| `livev1-docs-node-url` | Mantis | 3 | 2 | connection_failure | n/a | 600 | 0 | 8,506 | 9.2 | 0.032 | unknown | known |
| `livev1-docs-django-overview` | Mantis | 1 | 1 | connection_failure | n/a | 600 | 0 | 8,513 | 9.9 | 0.031 | unknown | known |
| `livev1-docs-django-overview` | Mantis | 1 | 2 | success | n/a | 600 | 2 | 40,412 | 16.8 | 0.05 | unknown | known |
| `livev1-docs-django-overview` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 40,334 | 20.3 | 0.048 | unknown | known |
| `livev1-docs-django-overview` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 40,465 | 21.2 | 0.05 | unknown | known |
| `livev1-docs-postgresql-types` | Mantis | 1 | 1 | success | n/a | 600 | 7 | 125,749 | 45.1 | 0.097 | unknown | known |
| `livev1-docs-postgresql-types` | Mantis | 2 | 1 | success | n/a | 600 | 9 | 140,288 | 62.8 | 0.109 | unknown | known |
| `livev1-docs-postgresql-types` | Mantis | 3 | 1 | success | n/a | 600 | 9 | 151,362 | 118.2 | 0.108 | unknown | known |
| `livev1-civic-loc-about` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 68,906 | 71.3 | 0.062 | unknown | known |
| `livev1-civic-loc-about` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 68,945 | 65.2 | 0.062 | unknown | known |
| `livev1-civic-loc-about` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 80,119 | 87.5 | 0.072 | unknown | known |
| `livev1-civic-nasa-missions` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 76,067 | 23.6 | 0.077 | unknown | known |
| `livev1-civic-nasa-missions` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 69,902 | 61.2 | 0.064 | unknown | known |
| `livev1-civic-nasa-missions` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 75,836 | 20.7 | 0.073 | unknown | known |
| `livev1-civic-census-about` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 73,043 | 71.7 | 0.073 | unknown | known |
| `livev1-civic-census-about` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 42,954 | 42.2 | 0.055 | unknown | known |
| `livev1-civic-census-about` | Mantis | 3 | 1 | success | n/a | 600 | 3 | 60,444 | 64.7 | 0.068 | unknown | known |
| `livev1-civic-nist-about` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 72,294 | 28.2 | 0.064 | unknown | known |
| `livev1-civic-nist-about` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 71,999 | 28.9 | 0.062 | unknown | known |
| `livev1-civic-nist-about` | Mantis | 3 | 1 | success | n/a | 600 | 4 | 72,398 | 36.3 | 0.066 | unknown | known |
| `livev1-civic-archives-about` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 42,155 | 27.5 | 0.053 | unknown | known |
| `livev1-civic-archives-about` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 42,226 | 24.5 | 0.055 | unknown | known |
| `livev1-civic-archives-about` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,513 | 5.1 | 0.03 | unknown | known |
| `livev1-civic-archives-about` | Mantis | 3 | 2 | connection_failure | n/a | 600 | 0 | 8,511 | 7.9 | 0.031 | unknown | known |
| `livev1-data-world-bank-population` | Mantis | 1 | 1 | success | n/a | 600 | 7 | 130,156 | 52.0 | 0.099 | unknown | known |
| `livev1-data-world-bank-population` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 88,480 | 37.0 | 0.075 | unknown | known |
| `livev1-data-world-bank-population` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 90,771 | 41.6 | 0.083 | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 39,606 | 31.2 | 0.049 | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 2 | 1 | connection_failure | n/a | 600 | 0 | 8,521 | 5.5 | 0.03 | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 2 | 2 | success | n/a | 600 | 2 | 39,654 | 25.4 | 0.047 | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,521 | 5.8 | 0.03 | unknown | known |
| `livev1-data-ourworldindata-co2` | Mantis | 3 | 2 | success | n/a | 600 | 3 | 40,627 | 23.8 | 0.053 | unknown | known |
| `livev1-data-data-gov-climate` | Mantis | 1 | 1 | success | n/a | 600 | 19 | 312,322 | 108.0 | 0.239 | unknown | known |
| `livev1-data-data-gov-climate` | Mantis | 2 | 1 | success | n/a | 600 | 13 | 214,925 | 80.2 | 0.187 | unknown | known |
| `livev1-data-data-gov-climate` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 85,997 | 29.1 | 0.078 | unknown | known |
| `livev1-data-eurostat-database` | Mantis | 1 | 1 | success | n/a | 600 | 18 | 292,967 | 115.6 | 0.208 | unknown | known |
| `livev1-data-eurostat-database` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 55,158 | 28.3 | 0.068 | unknown | known |
| `livev1-data-eurostat-database` | Mantis | 3 | 1 | success | n/a | 600 | 15 | 244,230 | 98.4 | 0.162 | unknown | known |
| `livev1-data-oecd-data-explorer` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 38,448 | 22.6 | 0.048 | unknown | known |
| `livev1-data-oecd-data-explorer` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 51,810 | 25.8 | 0.053 | unknown | known |
| `livev1-data-oecd-data-explorer` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 38,228 | 20.1 | 0.046 | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 44,027 | 27.7 | 0.059 | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 44,009 | 27.5 | 0.057 | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,520 | 8.5 | 0.032 | unknown | known |
| `livev1-navigation-wikipedia-ada` | Mantis | 3 | 2 | connection_failure | n/a | 600 | 0 | 8,522 | 7.4 | 0.03 | unknown | known |
| `livev1-navigation-merriam-serendipity` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 60,655 | 57.8 | 0.07 | unknown | known |
| `livev1-navigation-merriam-serendipity` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 44,832 | 50.6 | 0.062 | unknown | known |
| `livev1-navigation-merriam-serendipity` | Mantis | 3 | 1 | success | n/a | 600 | 3 | 47,538 | 53.0 | 0.072 | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 43,248 | 44.8 | 0.059 | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 43,185 | 48.4 | 0.059 | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,525 | 19.9 | 0.032 | unknown | known |
| `livev1-navigation-smithsonian-aircraft` | Mantis | 3 | 2 | success | n/a | 600 | 3 | 57,816 | 31.4 | 0.065 | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 1 | 1 | connection_failure | n/a | 600 | 0 | 8,522 | 14.0 | 0.037 | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 1 | 2 | success | n/a | 600 | 2 | 42,113 | 21.0 | 0.052 | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 2 | 1 | connection_failure | n/a | 600 | 0 | 8,522 | 9.5 | 0.029 | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 2 | 2 | success | n/a | 600 | 2 | 41,708 | 23.3 | 0.055 | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,522 | 8.0 | 0.034 | unknown | known |
| `livev1-navigation-gutenberg-search` | Mantis | 3 | 2 | success | n/a | 600 | 2 | 42,176 | 23.3 | 0.059 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 1 | 1 | connection_failure | n/a | 600 | 0 | 8,532 | 5.8 | 0.035 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 1 | 2 | connection_failure | n/a | 600 | 0 | 8,530 | 8.7 | 0.03 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 2 | 1 | connection_failure | n/a | 600 | 0 | 8,530 | 8.0 | 0.032 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 2 | 2 | connection_failure | n/a | 600 | 0 | 8,530 | 10.7 | 0.033 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 3 | 1 | connection_failure | n/a | 600 | 0 | 8,530 | 7.8 | 0.029 | unknown | known |
| `livev1-navigation-met-collection` | Mantis | 3 | 2 | success | n/a | 600 | 7 | 130,134 | 35.7 | 0.104 | unknown | known |
| `livev1-interactive-openlibrary-subject` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 71,056 | 32.5 | 0.062 | unknown | known |
| `livev1-interactive-openlibrary-subject` | Mantis | 2 | 1 | success | n/a | 600 | 4 | 71,285 | 29.1 | 0.063 | unknown | known |
| `livev1-interactive-openlibrary-subject` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 79,619 | 32.0 | 0.077 | unknown | known |
| `livev1-interactive-github-issues` | Mantis | 1 | 1 | success | n/a | 600 | 2 | 42,877 | 26.8 | 0.054 | unknown | known |
| `livev1-interactive-github-issues` | Mantis | 2 | 1 | success | n/a | 600 | 2 | 42,802 | 29.6 | 0.058 | unknown | known |
| `livev1-interactive-github-issues` | Mantis | 3 | 1 | success | n/a | 600 | 2 | 42,913 | 29.4 | 0.062 | unknown | known |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 1 | 1 | success | n/a | 600 | 6 | 89,222 | 23.5 | 0.084 | unknown | known |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 84,295 | 25.6 | 0.072 | unknown | known |
| `livev1-interactive-openstreetmap-eiffel` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 84,275 | 24.0 | 0.07 | unknown | known |
| `livev1-interactive-tmdb-search` | Mantis | 1 | 1 | success | n/a | 600 | 4 | 65,538 | 28.4 | 0.094 | unknown | known |
| `livev1-interactive-tmdb-search` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 63,100 | 28.9 | 0.086 | unknown | known |
| `livev1-interactive-tmdb-search` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 69,070 | 26.1 | 0.094 | unknown | known |
| `livev1-interactive-arxiv-search` | Mantis | 1 | 1 | success | n/a | 600 | 5 | 70,837 | 20.0 | 0.069 | unknown | known |
| `livev1-interactive-arxiv-search` | Mantis | 2 | 1 | success | n/a | 600 | 7 | 94,863 | 31.6 | 0.085 | unknown | known |
| `livev1-interactive-arxiv-search` | Mantis | 3 | 1 | success | n/a | 600 | 5 | 71,082 | 20.8 | 0.073 | unknown | known |
