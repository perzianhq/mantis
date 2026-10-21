# Real-agent eval

> Sarvam V2 API tool loop (requested model `deepseek-v4.1-flash`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Sarvam completion responses; cost is an INR estimate from published prices; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-10-18; runs per task and approach: 3; 10 runs in parallel.
- Scope: 25 tasks × 3 approaches × 3 runs = 225 logical runs; 57 recorded so far; 57 total attempts including retries.
- Sarvam runtime: Sarvam V2 API; resolved model(s): deepseekv4.1-flash.
- MCP startup (spawn + warm-up) is separate from Sarvam execution time. Execution runs from the first API request to the final response. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: a minimal computer-use-style server (bench/agent/screenshot-mcp.ts): screenshot, click(x,y), type, key, scroll, back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis | Accessibility tree (Playwright MCP) | Screenshots (click by x,y) |
|---|---:|---:|---:|
| Correct | 20 / 20 | 19 / 19 | 13 / 18 |
| Connection-failure attempts | 0 | 0 | 0 |
| Logical runs ending in connection failure | 0 | 0 | 0 |
| Other attempted failures | 0 | 0 | 5 |
| Tool calls (including retries) | 76 | 92 | 146 |
| Sarvam API attempts (including retries) | 110 | 126 | 186 |
| Sarvam HTTP 429 responses | 17 | 18 | 27 |
| MCP tool errors (including retries) | 0 | 0 | 0 |
| Browser observation text (observed chars) | 49,541 | 211,236 | 3,050 |
| Browser observation images (observed blocks) | 0 | 0 | 60 |
| Normal input tokens (total) | 42,232 | 96,520 | 78,176 |
| Cache-write input tokens (total) | 0 | 0 | 0 |
| Cache-read input tokens (total) | 176,640 | 371,712 | 254,336 |
| Output tokens (total) | 5,201 | 6,482 | 8,968 |
| Total input tokens incl. cache (legacy) | 218,872 | 468,232 | 332,512 |
| MCP startup (total, s) | 38.4 | 21.5 | 44.9 |
| CLI startup (total, s) | 0.0 | 0.0 | 0.0 |
| CLI execution (total, s) | 4560.7 | 5185.8 | 7629.1 |
| CLI wall (total, s) | 4560.7 | 5185.8 | 7629.1 |
| Fixture verification (total, s) | 1.2 | 0.9 | 2.1 |
| Cleanup (total, s) | 9.1 | 8.3 | 8.5 |
| Harness capture (total, s) | 13.2 | 80.2 | 25.2 |
| Cost estimate (USD; including retries) | unknown | unknown | unknown |
| Cost estimate (INR; including retries) | 1.69 | 3.28 | 3.02 |

## Per run

| Task | Approach | Run | Status | Attempts | Tool calls | Tool errors | API attempts | 429s | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `form-subscribe` | Mantis | 1 | success | 1 | 5 | 0 | 7 | 2 | 1,011 | 0 | 1,479 | 0 | 8,832 | 300 | 2.2 | 0.0 | 246.8 | 246.8 | 0.09 | 0.42 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 6 | 0 | 7 | 1 | 2,714 | 0 | 2,412 | 0 | 16,640 | 380 | 1.5 | 0.0 | 248.0 | 248.0 | 0.12 | 0.73 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 1 | timeout | 1 | 10 | 0 | 12 | 2 | 194 | 4 | 5,215 | 0 | 16,896 | 608 | 2.9 | 0.0 | 600.3 | 600.3 | 0.05 | 0.32 | timed out after 600s |
| `form-subscribe` | Mantis | 2 | success | 1 | 5 | 0 | 6 | 1 | 1,011 | 0 | 1,539 | 0 | 8,704 | 265 | 2.1 | 0.0 | 248.7 | 248.7 | 0.08 | 0.37 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 6 | 0 | 8 | 2 | 2,714 | 0 | 2,308 | 0 | 16,768 | 373 | 1.5 | 0.0 | 190.1 | 190.1 | 0.06 | 0.40 | The page shows the confirmation message: **"Subscribed from Ireland (weekly: yes)."** ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 2 | timeout | 1 | 11 | 0 | 14 | 3 | 194 | 5 | 5,289 | 0 | 20,736 | 589 | 2.8 | 0.0 | 600.0 | 600.0 | 0.05 | 0.35 | timed out after 600s |
| `form-subscribe` | Mantis | 3 | success | 1 | 5 | 0 | 6 | 1 | 1,011 | 0 | 1,544 | 0 | 8,704 | 266 | 2.3 | 0.0 | 248.0 | 248.0 | 0.10 | 0.39 | The confirmation message shown is: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 6 | 0 | 7 | 1 | 2,714 | 0 | 2,182 | 0 | 16,896 | 363 | 1.6 | 0.0 | 307.8 | 307.8 | 0.13 | 0.46 | The page shows the confirmation message: "Subscribed from Ireland (weekly: yes)." ANSWER: Subscribed from Ireland (weekly: yes). |
| `form-subscribe` | Screenshots (click by x,y) | 3 | timeout | 1 | 10 | 0 | 14 | 4 | 194 | 4 | 5,167 | 0 | 16,896 | 596 | 2.9 | 0.0 | 600.7 | 600.7 | 0.07 | 0.39 | timed out after 600s |
| `login` | Mantis | 1 | success | 1 | 4 | 0 | 7 | 2 | 977 | 0 | 1,565 | 0 | 8,704 | 238 | 2.3 | 0.0 | 244.4 | 244.4 | 0.04 | 0.39 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 7 | 1 | 2,259 | 0 | 2,448 | 0 | 16,128 | 326 | 0.7 | 0.0 | 357.0 | 357.0 | 0.04 | 0.32 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Screenshots (click by x,y) | 1 | success | 1 | 10 | 0 | 12 | 1 | 220 | 3 | 4,671 | 0 | 15,360 | 597 | 3.6 | 0.0 | 535.7 | 535.7 | 0.41 | 0.38 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Mantis | 2 | success | 1 | 4 | 0 | 7 | 2 | 977 | 0 | 1,582 | 0 | 8,704 | 245 | 2.3 | 0.0 | 237.8 | 237.8 | 0.07 | 0.47 | The sign-in succeeded and the page heading is now "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 8 | 2 | 2,259 | 0 | 2,296 | 0 | 16,256 | 320 | 1.0 | 0.0 | 358.6 | 358.6 | 0.06 | 0.38 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Screenshots (click by x,y) | 2 | timeout | 1 | 16 | 0 | 18 | 2 | 342 | 4 | 6,594 | 0 | 32,128 | 869 | 2.2 | 0.0 | 600.0 | 600.0 | 0.27 | 0.25 | timed out after 600s |
| `login` | Mantis | 3 | success | 1 | 4 | 0 | 8 | 3 | 977 | 0 | 1,556 | 0 | 8,704 | 233 | 1.6 | 0.0 | 296.4 | 296.4 | 0.04 | 0.33 | Signed in successfully. The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `login` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 8 | 2 | 2,259 | 0 | 2,433 | 0 | 16,128 | 323 | 0.9 | 0.0 | 413.9 | 413.9 | 0.05 | 0.43 | The page heading after signing in is **Welcome back**. ANSWER: Welcome back |
| `login` | Screenshots (click by x,y) | 3 | success | 1 | 8 | 0 | 9 | 0 | 200 | 2 | 3,421 | 0 | 10,496 | 420 | 2.0 | 0.0 | 354.6 | 354.6 | 0.62 | 0.51 | The page heading after signing in is "Welcome back". ANSWER: Welcome back |
| `cookie-cart` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 517 | 0 | 1,126 | 0 | 6,656 | 184 | 1.5 | 0.0 | 117.8 | 117.8 | 0.02 | 0.40 | The product was added successfully. ANSWER: Cart updated (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 5 | 0 | 6 | 0 | 1,913 | 0 | 2,291 | 0 | 16,128 | 291 | 0.9 | 0.0 | 238.7 | 238.7 | 0.02 | 0.39 | The product was added successfully. ANSWER: Cart updated (1 item). |
| `cookie-cart` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 7 | 0 | 134 | 3 | 3,698 | 0 | 8,576 | 342 | 2.0 | 0.0 | 240.8 | 240.8 | 0.04 | 0.55 | The product was added successfully. The confirmation message displayed is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,581 | 0 | 8,448 | 251 | 1.5 | 0.0 | 242.7 | 242.7 | 0.02 | 0.51 | The product was added after accepting the cookie dialog, and the page confirmed it with the message "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 5 | 0 | 6 | 0 | 1,913 | 0 | 2,139 | 0 | 16,384 | 362 | 0.9 | 0.0 | 182.4 | 182.4 | 0.02 | 0.42 | The product was added successfully. After accepting the cookie dialog and clicking "Add to cart", the page displayed the confirmation message: **"Cart updated ( |
| `cookie-cart` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 7 | 0 | 134 | 3 | 3,542 | 0 | 8,576 | 301 | 2.3 | 0.0 | 237.4 | 237.4 | 0.06 | 0.78 | The product was added successfully. The confirmation message displayed is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `cookie-cart` | Mantis | 3 | success | 1 | 4 | 0 | 5 | 0 | 700 | 0 | 1,493 | 0 | 8,576 | 270 | 1.6 | 0.0 | 178.3 | 178.3 | 0.04 | 0.46 | The product was added to the cart after accepting the cookie dialog. The confirmation message displayed is "Cart updated (1 item)." ANSWER: Cart updated (1 ite |
| `cookie-cart` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 5 | 0 | 7 | 1 | 1,913 | 0 | 2,032 | 0 | 16,384 | 324 | 1.4 | 0.0 | 246.9 | 246.9 | 0.03 | 0.41 | I accepted the cookie dialog, then clicked "Add to cart". The confirmation message shown was: **"Cart updated (1 item)."** ANSWER: Cart updated (1 item). |
| `cookie-cart` | Screenshots (click by x,y) | 3 | success | 1 | 14 | 0 | 17 | 2 | 199 | 7 | 8,498 | 0 | 42,624 | 951 | 2.9 | 0.0 | 545.6 | 545.6 | 0.06 | 0.44 | The product was added to the cart. The confirmation message displayed is "Cart updated (1 item)." ANSWER: Cart updated (1 item). |
| `longlist-item` | Mantis | 1 | success | 1 | 3 | 0 | 5 | 1 | 1,251 | 0 | 1,568 | 0 | 7,296 | 201 | 1.9 | 0.0 | 180.7 | 180.7 | 0.03 | 0.60 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 23,521 | 0 | 9,214 | 0 | 27,776 | 264 | 0.8 | 0.0 | 123.6 | 123.6 | 0.03 | 0.38 | The page it leads to (http://127.0.0.1:56651/item/150) has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Screenshots (click by x,y) | 1 | success | 1 | 7 | 0 | 10 | 2 | 156 | 3 | 4,060 | 0 | 10,880 | 544 | 3.3 | 0.0 | 425.6 | 425.6 | 0.10 | 0.37 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Mantis | 2 | success | 1 | 4 | 0 | 5 | 0 | 1,382 | 0 | 1,876 | 0 | 9,600 | 249 | 3.2 | 0.0 | 126.9 | 126.9 | 0.01 | 0.36 | The page "Record 150" leads to a page with the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 7 | 2 | 23,521 | 0 | 9,080 | 0 | 27,904 | 257 | 1.6 | 0.0 | 187.4 | 187.4 | 0.01 | 0.53 | The "Record 150" link leads to `/item/150`, whose page heading is "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Screenshots (click by x,y) | 2 | success | 1 | 7 | 0 | 8 | 0 | 156 | 3 | 3,979 | 0 | 10,496 | 450 | 3.1 | 0.0 | 303.5 | 303.5 | 0.15 | 0.41 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Mantis | 3 | success | 1 | 3 | 0 | 4 | 0 | 1,251 | 0 | 1,564 | 0 | 7,296 | 200 | 1.9 | 0.0 | 119.6 | 119.6 | 0.04 | 0.67 | The page it leads to has the heading "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 23,521 | 0 | 9,116 | 0 | 27,904 | 257 | 0.6 | 0.0 | 183.9 | 183.9 | 0.03 | 0.40 | The heading of the page is "Record 150 details". ANSWER: Record 150 details |
| `longlist-item` | Screenshots (click by x,y) | 3 | timeout | 1 | 11 | 0 | 12 | 1 | 174 | 4 | 5,716 | 0 | 21,504 | 801 | 2.0 | 0.0 | 600.2 | 600.2 | 0.07 | 0.37 | timed out after 600s |
| `pricing-team` | Mantis | 1 | success | 1 | 2 | 0 | 5 | 2 | 798 | 0 | 951 | 0 | 4,864 | 142 | 2.4 | 0.0 | 182.5 | 182.5 | 0.03 | 0.41 | The pricing page shows the Business plan price. ANSWER: $39 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 6 | 1 | 2,309 | 0 | 2,107 | 0 | 13,056 | 217 | 1.0 | 0.0 | 182.9 | 182.9 | 0.01 | 0.39 | The Business plan is priced at **$39 per month**. ANSWER: $39 per month |
| `pricing-team` | Screenshots (click by x,y) | 1 | success | 1 | 4 | 0 | 6 | 1 | 116 | 2 | 2,372 | 0 | 4,352 | 199 | 2.0 | 0.0 | 242.1 | 242.1 | 0.02 | 0.39 | The pricing page shows the Business plan at $39 per month. ANSWER: $39 per month |
| `pricing-team` | Mantis | 2 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 951 | 0 | 4,864 | 147 | 1.3 | 0.0 | 175.3 | 175.3 | 0.04 | 0.70 | The pricing page shows the Business plan at **$39 per month**. ANSWER: $39 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 5 | 0 | 2,309 | 0 | 2,012 | 0 | 13,184 | 251 | 1.1 | 0.0 | 296.0 | 296.0 | 0.13 | 0.47 | I found the pricing page. The Business plan is listed as **$39 per month**. ANSWER: $39 per month |
| `pricing-team` | Screenshots (click by x,y) | 2 | success | 1 | 4 | 0 | 5 | 0 | 116 | 2 | 2,398 | 0 | 4,352 | 207 | 2.3 | 0.0 | 234.1 | 234.1 | 0.05 | 0.57 | The pricing page shows the Business plan at $39 per month. ANSWER: $39 per month |
| `pricing-team` | Mantis | 3 | success | 1 | 2 | 0 | 3 | 0 | 798 | 0 | 951 | 0 | 4,864 | 147 | 1.8 | 0.0 | 178.7 | 178.7 | 0.02 | 0.45 | The pricing page lists the Business plan at **$39 per month**. ANSWER: $39 per month |
| `pricing-team` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 5 | 0 | 2,309 | 0 | 1,982 | 0 | 13,184 | 217 | 1.1 | 0.0 | 298.8 | 298.8 | 0.02 | 0.54 | The Business plan is priced at $39 per month. ANSWER: $39 per month |
| `pricing-team` | Screenshots (click by x,y) | 3 | success | 1 | 4 | 0 | 5 | 0 | 116 | 2 | 2,444 | 0 | 4,352 | 218 | 2.0 | 0.0 | 235.6 | 235.6 | 0.02 | 0.42 | The pricing page shows the Business plan price. ANSWER: $39 per month |
| `dashboard-refresh` | Mantis | 1 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,398 | 0 | 10,880 | 304 | 1.4 | 0.0 | 236.3 | 236.3 | 0.02 | 0.55 | I clicked the **Refresh** button on the dashboard. The "Last updated" line now reads **"Last updated: just now"** (it previously said "10:00"). The amount for  |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 4 | 0 | 5 | 0 | 37,230 | 0 | 13,185 | 0 | 24,320 | 406 | 0.8 | 0.0 | 238.4 | 238.4 | 0.01 | 0.40 | The data has been refreshed. Here's what I found: - **"Last updated" line:** After clicking Refresh, it now reads **"Last updated: just now"** (it was "10:00"  |
| `dashboard-refresh` | Screenshots (click by x,y) | 1 | success | 1 | 6 | 0 | 9 | 2 | 135 | 3 | 3,718 | 0 | 8,704 | 406 | 2.2 | 0.0 | 478.2 | 478.2 | 0.04 | 1.01 | I found the information. After refreshing, the "Last updated" line says "just now", and Nova 3 shows an amount of $5,314 (Pending). ANSWER: Last updated: just  |
| `dashboard-refresh` | Mantis | 2 | success | 1 | 3 | 0 | 4 | 0 | 10,957 | 0 | 5,381 | 0 | 10,880 | 254 | 1.7 | 0.0 | 239.0 | 239.0 | 0.02 | 0.48 | The "Last updated" line now reads **"Last updated: just now"** (it was "10:00" before the refresh). Nova 3 shows an amount of **$5,314**. ANSWER: Last updated |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 2 | success | 1 | 4 | 0 | 8 | 3 | 37,230 | 0 | 12,854 | 0 | 24,576 | 363 | 1.2 | 0.0 | 358.9 | 358.9 | 0.02 | 0.41 | After clicking Refresh, the "Last updated" line now reads **"just now"** (it was "10:00" before). The amount for **Nova 3** is **$5,314** (status: Pending). A |
| `dashboard-refresh` | Screenshots (click by x,y) | 2 | success | 1 | 6 | 0 | 11 | 4 | 135 | 3 | 3,692 | 0 | 8,832 | 494 | 2.2 | 0.0 | 323.1 | 323.1 | 0.01 | 0.47 | After refreshing, the "Last updated" line now reads **"just now"** (it previously said "10:00"). The amount for **Nova 3** is **$5,314** (status: Pending). AN |
| `dashboard-refresh` | Mantis | 3 | success | 1 | 3 | 0 | 6 | 2 | 10,957 | 0 | 5,417 | 0 | 10,880 | 284 | 1.5 | 0.0 | 299.1 | 299.1 | 0.01 | 0.35 | After refreshing, the "Last updated" line now reads **"Last updated: just now"** (it was "10:00" before). The amount for **Nova 3** is **$5,314** (status: Pend |
| `dashboard-refresh` | Accessibility tree (Playwright MCP) | 3 | success | 1 | 4 | 0 | 7 | 2 | 35,710 | 0 | 12,794 | 0 | 24,448 | 383 | 1.6 | 0.0 | 300.0 | 300.0 | 0.01 | 0.46 | After refreshing, the "Last updated" line now reads **"Last updated: just now"** (it was "10:00" before the refresh). The amount for **Nova 3** is **$5,314** ( |
| `dashboard-refresh` | Screenshots (click by x,y) | 3 | success | 1 | 6 | 0 | 10 | 3 | 135 | 3 | 3,702 | 0 | 8,576 | 376 | 2.5 | 0.0 | 471.6 | 471.6 | 0.03 | 0.48 | The "Last updated" line now reads **"just now"** (it was "10:00" before the refresh). The amount for **Nova 3** is **$5,314** (status: Pending). ANSWER: Last  |
| `signup-validation` | Mantis | 1 | success | 1 | 7 | 0 | 9 | 1 | 1,408 | 0 | 2,608 | 0 | 15,872 | 559 | 2.3 | 0.0 | 409.9 | 409.9 | 0.26 | 0.41 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
| `signup-validation` | Accessibility tree (Playwright MCP) | 1 | success | 1 | 8 | 0 | 9 | 0 | 2,918 | 0 | 3,635 | 0 | 27,648 | 805 | 1.2 | 0.0 | 472.6 | 472.6 | 0.12 | 0.37 | The first attempt failed, but the retry succeeded. **First attempt (password `abc123`):** Failed with the error — *"Password must be at least 8 characters."*  |
| `signup-validation` | Mantis | 2 | success | 1 | 6 | 0 | 7 | 0 | 1,103 | 0 | 2,102 | 0 | 13,312 | 462 | 1.5 | 0.0 | 351.6 | 351.6 | 0.24 | 0.43 | The first attempt with password `abc123` failed with the error: **"Password must be at least 8 characters."** Retrying with `strongpass456` succeeded. At the e |
