# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 16 runs in parallel.
- Scope: 25 tasks × 3 approaches × 3 runs = 225 logical runs; 78 recorded so far; 78 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 28 / 28 | 23 / 27 | 10 / 23 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 4 | 13 |
| Tool calls (including retries) | 115 | 153 | 162 |
| Sarvam API attempts (including retries) | 162 | 199 | 203 |
| Sarvam HTTP 429 responses | 23 | 26 | 29 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 71,577 | 224,062 | 3,771 |
| Browser observation images (observed blocks) | 0 | 0 | 60 |
| Normal input tokens (total) | 59,283 | 117,589 | 77,394 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 265,088 | 567,552 | 214,016 |
| Output tokens (total) | 7,932 | 10,894 | 9,514 |
| Total input tokens incl. cache (legacy) | 324,371 | 685,141 | 291,410 |
| MCP startup (total, s) | 54.9 | 35.9 | 59.4 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 7964.7 | 9763.8 | 11011.9 |
| CLI wall (total, s) | 7964.7 | 9763.8 | 11011.9 |
| Fixture verification (total, s) | 2.2 | 1.9 | 3.1 |
| Cleanup (total, s) | 12.9 | 11.8 | 9.9 |
| Harness capture (total, s) | 19.8 | 118.6 | 20.3 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 2.45 | 4.37 | 3.04 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 6 | 0 | 10 | 4 | 1,341 | 0 | 1,865 | 0 | 11,008 | 343 | 2.6 | 0.0 | 543.9 | 543.9 | 0.10 | 0.45 | The form was submitted with Country = Ireland and the weekly newsletter checkbox checked. ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 1 | 2,714 | 0 | 2,516 | 0 | 16,512 | 372 | 1.8 | 0.0 | 245.0 | 245.0 | 0.05 | 0.39 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 1 | timeout | 1 | 4 | 0 | 4 | 0 | 114 | 2 | 1,574 | 0 | 2,944 | 209 | 3.4 | 0.0 | 600.0 | 600.0 | 0.02 | 0.39 | timed out after 600s |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 5 | 0 | 1,011 | 0 | 1,553 | 0 | 8,704 | 270 | 2.9 | 0.0 | 243.4 | 243.4 | 0.06 | 0.42 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 1 | 2,714 | 0 | 2,388 | 0 | 16,640 | 355 | 1.7 | 0.0 | 240.7 | 240.7 | 0.05 | 0.50 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 2 | timeout | 1 | 10 | 0 | 12 | 2 | 194 | 4 | 5,103 | 0 | 16,896 | 576 | 3.5 | 0.0 | 600.3 | 600.3 | 0.06 | 0.43 | timed out after 600s |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 1 | 1,011 | 0 | 1,437 | 0 | 8,832 | 256 | 2.6 | 0.0 | 246.0 | 246.0 | 0.04 | 0.33 | ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 6 | 0 | 2,714 | 0 | 2,405 | 0 | 16,768 | 408 | 1.6 | 0.0 | 365.1 | 365.1 | 0.07 | 0.44 | The page shows the confirmation message. ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 3 | timeout | 1 | 8 | 0 | 11 | 3 | 154 | 3 | 3,950 | 0 | 10,752 | 495 | 3.7 | 0.0 | 600.5 | 600.5 | 0.03 | 0.43 | timed out after 600s |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 977 | 0 | 1,550 | 0 | 8,704 | 236 | 2.8 | 0.0 | 120.4 | 120.4 | 0.04 | 0.52 | Signed in successfully. The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 8 | 2 | 2,259 | 0 | 2,442 | 0 | 16,128 | 327 | 1.8 | 0.0 | 242.1 | 242.1 | 0.07 | 0.42 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Screenshots (click by x,y) | 1 | timeout | 1 | 8 | 0 | 11 | 3 | 200 | 2 | 2,559 | 0 | 8,832 | 376 | 3.8 | 0.0 | 600.8 | 600.8 | 0.30 | 0.35 | timed out after 600s |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 6 | 1 | 977 | 0 | 1,564 | 0 | 8,704 | 259 | 2.8 | 0.0 | 245.2 | 245.2 | 0.05 | 0.34 | The sign-in succeeded — the page title changed to "Welcome — Acme" and the heading changed from "Sign in" to "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 2,259 | 0 | 2,433 | 0 | 16,128 | 323 | 1.9 | 0.0 | 245.6 | 245.6 | 0.05 | 0.38 | The page heading after signing in is **Welcome back**. ANSWER: Welcome back |
| `login` | Screenshots (click by x,y) | 2 | timeout | 1 | 8 | 0 | 9 | 1 | 200 | 2 | 2,575 | 0 | 8,832 | 378 | 4.1 | 0.0 | 601.1 | 601.1 | 0.34 | 0.39 | timed out after 600s |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 7 | 2 | 977 | 0 | 1,563 | 0 | 8,704 | 251 | 2.7 | 0.0 | 244.2 | 244.2 | 0.06 | 0.41 | The sign-in succeeded — the page title changed to "Welcome — Acme" and the main heading is now "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 3 | timeout | 1 | 5 | 0 | 7 | 2 | 2,259 | 0 | 1,854 | 0 | 13,056 | 299 | 0.8 | 0.0 | 600.0 | 600.0 | 0.05 | 0.40 | timed out after 600s |
| `login` | Screenshots (click by x,y) | 3 | success | 1 | 9 | 0 | 11 | 1 | 200 | 3 | 4,433 | 0 | 12,800 | 508 | 2.1 | 0.0 | 600.0 | 600.0 | 0.48 | 0.39 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 517 | 0 | 1,142 | 0 | 6,656 | 192 | 1.4 | 0.0 | 122.9 | 122.9 | 0.01 | 0.51 | The product was added after accepting cookies. ANSWER: Cart updated (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 8 | 1 | 2,250 | 0 | 2,674 | 0 | 19,456 | 365 | 2.3 | 0.0 | 418.0 | 418.0 | 0.02 | 0.38 | The product was added successfully. After accepting the cookie dialog and clicking "Add to cart", the page displayed the confirmation message: **"Cart updated  |
| `cookie-cart` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 8 | 1 | 134 | 3 | 3,546 | 0 | 8,576 | 302 | 2.2 | 0.0 | 431.4 | 431.4 | 0.02 | 0.46 | The product was added successfully. The confirmation message displayed is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 7 | 2 | 700 | 0 | 1,565 | 0 | 8,448 | 236 | 1.5 | 0.0 | 478.1 | 478.1 | 0.02 | 0.39 | The product was added to the cart, and the confirmation message is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 8 | 2 | 1,913 | 0 | 2,182 | 0 | 16,256 | 339 | 0.9 | 0.0 | 416.9 | 416.9 | 0.02 | 0.45 | The product was added successfully. After accepting the cookie dialog and clicking "Add to cart", the page displayed the confirmation message: **"Cart updated ( |
| `cookie-cart` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 8 | 1 | 134 | 3 | 3,610 | 0 | 8,576 | 333 | 1.6 | 0.0 | 476.1 | 476.1 | 0.02 | 0.40 | The product was added successfully. The confirmation message displayed is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 3 | 0 | 5 | 1 | 517 | 0 | 1,125 | 0 | 6,656 | 205 | 1.2 | 0.0 | 311.1 | 311.1 | 0.01 | 0.52 | The product was added successfully. The confirmation message is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 8 | 2 | 1,913 | 0 | 2,032 | 0 | 16,384 | 331 | 0.9 | 0.0 | 475.9 | 475.9 | 0.03 | 0.39 | The product was added successfully. After accepting the cookie dialog and clicking "Add to cart", the page displayed the confirmation message: **"Cart updated ( |
| `cookie-cart` | Screenshots (click by x,y) | 3 | timeout | 1 | 6 | 0 | 7 | 1 | 134 | 3 | 2,688 | 0 | 6,400 | 273 | 1.6 | 0.0 | 600.0 | 600.0 | 0.01 | 0.36 | timed out after 600s |
| `longlist-item` | Mantis | 1 | success | 1 | 4 | 0 | 5 | 0 | 1,378 | 0 | 1,918 | 0 | 9,728 | 314 | 1.6 | 0.0 | 354.9 | 354.9 | 0.03 | 0.57 | The page leads to a heading of "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 23,521 | 0 | 9,120 | 0 | 27,904 | 285 | 0.9 | 0.0 | 341.9 | 341.9 | 0.03 | 0.47 | The page it leads to (URL `/item/150`) has the heading: **Record 150 details** ANSWER: Record 150 details |
| `longlist-item` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 10 | 2 | 156 | 3 | 3,955 | 0 | 10,624 | 472 | 2.5 | 0.0 | 421.8 | 421.8 | 0.18 | 0.63 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,378 | 0 | 1,870 | 0 | 9,600 | 239 | 2.0 | 0.0 | 237.3 | 237.3 | 0.02 | 0.40 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 23,521 | 0 | 9,244 | 0 | 27,776 | 282 | 1.5 | 0.0 | 236.3 | 236.3 | 0.03 | 0.41 | The "Record 150" link leads to a page with the heading **"Record 150 details"**. ANSWER: Record 150 details |
| `longlist-item` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 10 | 2 | 156 | 3 | 4,025 | 0 | 10,624 | 473 | 2.1 | 0.0 | 421.4 | 421.4 | 0.16 | 0.74 | The heading of the page is "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,251 | 0 | 1,564 | 0 | 7,296 | 200 | 1.5 | 0.0 | 297.5 | 297.5 | 0.02 | 0.56 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 23,521 | 0 | 8,964 | 0 | 28,032 | 257 | 1.0 | 0.0 | 239.4 | 239.4 | 0.03 | 0.45 | The "Record 150" link led to a page with the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Screenshots (click by x,y) | 3 | success | 1 | 7 | 0 | 9 | 1 | 156 | 3 | 4,017 | 0 | 10,624 | 492 | 2.2 | 0.0 | 298.2 | 298.2 | 0.17 | 0.44 | The page for "Record 150" leads to a page with the heading "Record 150 details". ANSWER: Record 150 details |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 961 | 0 | 4,864 | 192 | 1.4 | 0.0 | 161.7 | 161.7 | 0.02 | 0.41 | The pricing page shows the plans clearly: - Starter: $9 per month - **Business: $39 per month** - Enterprise: contact us ANSWER: $39 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 2,309 | 0 | 1,979 | 0 | 13,184 | 232 | 0.9 | 0.0 | 178.1 | 178.1 | 0.04 | 0.46 | I found the pricing page. The Business plan is listed as **$39 per month**. ANSWER: $39 per month |
| `pricing-team` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 5 | 0 | 116 | 2 | 2,394 | 0 | 4,352 | 213 | 2.1 | 0.0 | 178.6 | 178.6 | 0.02 | 0.64 | The pricing page shows the Business plan price. ANSWER: $39 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 1,165 | 0 | 1,365 | 0 | 6,784 | 193 | 1.4 | 0.0 | 173.6 | 173.6 | 0.07 | 0.61 | The pricing page shows the Business plan at $39 per month. ANSWER: $39 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 7 | 2 | 2,309 | 0 | 1,984 | 0 | 13,184 | 231 | 2.9 | 0.0 | 305.9 | 305.9 | 0.06 | 0.91 | The pricing page shows the Business plan at **$39 per month**. ANSWER: $39 per month |
| `pricing-team` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 7 | 2 | 116 | 2 | 2,398 | 0 | 4,352 | 216 | 2.5 | 0.0 | 247.2 | 247.2 | 0.02 | 0.43 | The pricing page shows the Business plan at $39 per month. ANSWER: $39 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 5 | 2 | 798 | 0 | 951 | 0 | 4,864 | 167 | 2.0 | 0.0 | 185.0 | 185.0 | 0.01 | 0.37 | I found the pricing page and the Business plan price. - Starter: $9 per month - Business: $39 per month - Enterprise: contact us ANSWER: $39 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 7 | 2 | 2,309 | 0 | 2,019 | 0 | 13,184 | 276 | 1.3 | 0.0 | 307.1 | 307.1 | 0.02 | 0.40 | I navigated to the pricing page and found the plan details. - Starter: $9 per month - **Business: $39 per month** - Enterprise: contact us ANSWER: $39 per mon |
| `pricing-team` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 6 | 1 | 116 | 2 | 2,398 | 0 | 4,352 | 217 | 2.3 | 0.0 | 184.2 | 184.2 | 0.01 | 0.38 | The pricing page shows the Business plan at **$39 per month**. ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,434 | 0 | 10,880 | 289 | 2.5 | 0.0 | 127.0 | 127.0 | 0.01 | 0.36 | After clicking Refresh, the "Last updated" line now reads **"Last updated: just now"** (it was "10:00" before the refresh). The amount for Nova 3 is **$5,314** |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 1 | 20,147 | 0 | 7,741 | 0 | 24,320 | 424 | 1.8 | 0.0 | 247.9 | 247.9 | 0.01 | 0.37 | After refreshing the dashboard, the "Last updated" line now reads **"Last updated: just now"** (it previously said "10:00"). The amount for **Nova 3** is **$5,3 |
| `dashboard-refresh` | Screenshots (click by x,y) | 1 | wrong_answer | 1 | 6 | 0 | 7 | 0 | 135 | 3 | 3,776 | 0 | 8,832 | 521 | 3.7 | 0.0 | 425.7 | 425.7 | 0.03 | 0.39 | fixture check failed (5 observations) |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 5 | 1 | 10,957 | 0 | 5,385 | 0 | 10,880 | 268 | 3.1 | 0.0 | 184.4 | 184.4 | 0.02 | 0.95 | The dashboard refreshed successfully. - **Last updated** now reads: **"Last updated: just now"** (it was "10:00" before the refresh). - **Nova 3** amount: **$5 |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 37,230 | 0 | 12,996 | 0 | 24,448 | 366 | 1.6 | 0.0 | 245.4 | 245.4 | 0.02 | 0.43 | After clicking Refresh, the "Last updated" line now reads **"Last updated: just now"** (it was "10:00" before refreshing). The amount for **Nova 3** is **$5,31 |
| `dashboard-refresh` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 9 | 2 | 135 | 3 | 3,642 | 0 | 8,704 | 398 | 2.7 | 0.0 | 363.0 | 363.0 | 0.04 | 0.43 | I refreshed the data and checked the table. - After clicking **Refresh**, the "Last updated" line now reads: **just now** (it previously said 10:00). - The amo |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,449 | 0 | 10,880 | 331 | 1.8 | 0.0 | 184.3 | 184.3 | 0.04 | 0.51 | After clicking Refresh, the "Last updated" line now reads **"Last updated: just now"** (it previously said "10:00"). The amount for **Nova 3** is **$5,314** (s |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 3 | wrong_answer | 1 | 4 | 0 | 6 | 1 | 37,230 | 0 | 12,969 | 0 | 24,448 | 361 | 1.4 | 0.0 | 242.4 | 242.4 | 0.03 | 0.55 | fixture check failed (3 observations) |
| `dashboard-refresh` | Screenshots (click by x,y) | 3 | wrong_answer | 1 | 6 | 0 | 8 | 1 | 135 | 3 | 3,716 | 0 | 8,960 | 513 | 2.0 | 0.0 | 361.2 | 361.2 | 0.02 | 0.40 | fixture check failed (5 observations) |
| `signup-validation` | Mantis | 1 | success | 1 | 7 | 0 | 9 | 1 | 1,510 | 0 | 2,535 | 0 | 15,744 | 455 | 2.2 | 0.0 | 422.6 | 422.6 | 0.17 | 0.38 | The first attempt failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the end the page says: **"We |
| `signup-validation` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 10 | 1 | 2,918 | 0 | 3,631 | 0 | 27,264 | 710 | 1.2 | 0.0 | 483.6 | 483.6 | 0.21 | 0.45 | The first attempt failed with the error **"Password must be at least 8 characters."** After retrying with `strongpass456`, the account was created successfully. |
| `signup-validation` | Screenshots (click by x,y) | 1 | timeout | 1 | 10 | 0 | 10 | 0 | 237 | 2 | 3,406 | 0 | 12,544 | 532 | 2.0 | 0.0 | 600.0 | 600.0 | 0.29 | 0.36 | timed out after 600s |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,112 | 0 | 13,312 | 473 | 1.4 | 0.0 | 360.8 | 360.8 | 0.17 | 0.39 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `signup-validation` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 8 | 0 | 9 | 0 | 2,918 | 0 | 3,492 | 0 | 27,392 | 711 | 0.9 | 0.0 | 539.3 | 539.3 | 0.15 | 0.41 | The first attempt failed with the error **"Password must be at least 8 characters."** After retrying with `strongpass456`, the account was created successfully. |
| `signup-validation` | Screenshots (click by x,y) | 2 | timeout | 1 | 9 | 0 | 9 | 0 | 237 | 1 | 2,941 | 0 | 11,008 | 516 | 2.8 | 0.0 | 600.0 | 600.0 | 0.27 | 0.36 | timed out after 600s |
| `signup-validation` | Mantis | 3 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,106 | 0 | 13,312 | 479 | 2.1 | 0.0 | 356.0 | 356.0 | 0.48 | 0.52 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** The retry with `strongpass456` succeeded. At the  |
| `signup-validation` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 8 | 0 | 9 | 0 | 2,918 | 0 | 3,226 | 0 | 27,776 | 729 | 1.3 | 0.0 | 476.6 | 476.6 | 0.27 | 0.42 | The first attempt failed, but the retry succeeded. **First attempt (password `abc123`):** Failed with the error: *"Password must be at least 8 characters."* * |
| `signup-validation` | Screenshots (click by x,y) | 3 | timeout | 1 | 10 | 0 | 11 | 1 | 237 | 2 | 3,206 | 0 | 12,544 | 504 | 2.3 | 0.0 | 600.2 | 600.2 | 0.28 | 0.36 | timed out after 600s |
| `checkout-steps` | Mantis | 1 | success | 1 | 7 | 0 | 10 | 2 | 1,435 | 0 | 2,376 | 0 | 15,616 | 398 | 1.7 | 0.0 | 598.1 | 598.1 | 0.12 | 0.37 | The order was completed successfully. - Shipping: Noor Ali, Dublin - Delivery: Express (+$7.50) - Order number: **B2048** - Total charged: **$31.25** ANSWER:  |
| `checkout-steps` | Accessibility tree (Playwright MCP) | 1 | timeout | 1 | 10 | 0 | 12 | 2 | 3,724 | 0 | 3,820 | 0 | 31,360 | 577 | 1.1 | 0.0 | 600.0 | 600.0 | 0.09 | 0.36 | timed out after 600s |
| `checkout-steps` | Screenshots (click by x,y) | 1 | timeout | 1 | 8 | 0 | 10 | 2 | 177 | 3 | 3,255 | 0 | 9,728 | 411 | 2.0 | 0.0 | 600.0 | 600.0 | 0.15 | 0.34 | timed out after 600s |
| `checkout-steps` | Mantis | 2 | success | 1 | 7 | 0 | 9 | 1 | 1,435 | 0 | 2,321 | 0 | 15,744 | 380 | 1.9 | 0.0 | 477.6 | 477.6 | 0.30 | 0.48 | Order placed successfully for Noor Ali, shipping to Dublin with Express delivery. ANSWER: Order number: B2048; Total charged: $31.25 |
| `checkout-steps` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 10 | 0 | 13 | 2 | 3,724 | 0 | 4,201 | 0 | 35,456 | 621 | 0.8 | 0.0 | 593.6 | 593.6 | 0.11 | 0.36 | The order was completed successfully. - **Order number:** B2048 - **Total charged:** $31.25 ANSWER: Order #B2048, total charged $31.25 |
| `checkout-steps` | Screenshots (click by x,y) | 2 | timeout | 1 | 9 | 0 | 11 | 2 | 198 | 3 | 4,227 | 0 | 12,160 | 586 | 2.0 | 0.0 | 600.0 | 600.0 | 0.15 | 0.40 | timed out after 600s |
| `checkout-steps` | Mantis | 3 | success | 1 | 7 | 0 | 11 | 3 | 1,435 | 0 | 2,278 | 0 | 15,744 | 410 | 1.4 | 0.0 | 531.0 | 531.0 | 0.13 | 0.36 | The order was completed successfully. - Shipping: Noor Ali, Dublin - Delivery: Express (+$7.50) - Order number: **B2048** - Total charged: **$31.25** ANSWER:  |
| `checkout-steps` | Accessibility tree (Playwright MCP) | 3 | timeout | 1 | 9 | 0 | 11 | 2 | 3,441 | 0 | 3,419 | 0 | 27,264 | 541 | 0.8 | 0.0 | 600.0 | 600.0 | 0.10 | 0.45 | timed out after 600s |
| `booking-date` | Mantis | 1 | success | 1 | 5 | 0 | 8 | 2 | 1,335 | 0 | 2,071 | 0 | 11,392 | 438 | 1.4 | 0.0 | 412.8 | 412.8 | 0.08 | 0.36 | The booking was submitted successfully with the requested details (date 2026-12-25, time 20:00, 3 guests). ANSWER: The confirmation says: "Booked for 2026-12-2 |
| `booking-date` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 9 | 2 | 2,589 | 0 | 2,758 | 0 | 20,096 | 515 | 1.1 | 0.0 | 472.6 | 472.6 | 0.08 | 0.38 | The booking was successful. The confirmation status message reads: **"Booked for 2026-12-25 at 20:00, 3 guests."** ANSWER: Booked for 2026-12-25 at 20:00, 3 g |
| `booking-date` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 7 | 0 | 2,589 | 0 | 2,806 | 0 | 19,968 | 492 | 0.9 | 0.0 | 291.5 | 291.5 | 0.17 | 0.44 | The confirmation status message reads: "Booked for 2026-12-25 at 20:00, 3 guests." ANSWER: Booked for 2026-12-25 at 20:00, 3 guests. |
| `article-deep-fact` | Mantis | 1 | success | 1 | 3 | 0 | 3 | 0 | 5,128 | 0 | 2,013 | 0 | 5,888 | 250 | 1.5 | 0.0 | 168.6 | 168.6 | 0.01 | 0.51 | The article states the harbour light was first lit in 1888. ANSWER: 1888 |
| `article-deep-fact` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 2 | 0 | 3 | 0 | 6,149 | 0 | 2,294 | 0 | 7,168 | 165 | 0.9 | 0.0 | 112.9 | 112.9 | 0.00 | 0.36 | The article states: "After years of planning and two failed attempts to secure funding, the harbour light was finally lit for the first time in 1888, guiding sh |
| `article-deep-fact` | Mantis | 2 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,605 | 0 | 3,072 | 104 | 1.4 | 0.0 | 116.4 | 116.4 | 0.03 | 0.62 | The article states the harbour light was first lit in 1888. ANSWER: 1888 |
| `article-deep-fact` | Mantis | 3 | success | 1 | 1 | 0 | 2 | 0 | 4,713 | 0 | 1,605 | 0 | 3,072 | 104 | 2.0 | 0.0 | 59.8 | 59.8 | 0.00 | 0.36 | The article states the harbour light was first lit in **1888**. ANSWER: 1888 |
