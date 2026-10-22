# live-v1: frozen public live-site benchmark

`live-v1` is a 29-scored-task, public, read-only live-site cohort. It retains one excluded task in the public catalog for documentation. It is separate from every local suite and from the gated Online-Mind2Web `realsite-tasks.json` source.

The documented allocation is six families of five tasks: standards, documentation, civic reference, open data, site navigation, and interactive exploration. The 29 scored rows have 19 deterministic terminal-state contracts and 10 task-specific blind-judge contracts, with 7 easy, 14 medium, and 8 hard tasks. The catalog spans more than 15 independent sites; no site has more than three rows.

The immutable task IDs and contract hash are in [manifests/live-v1.json](manifests/live-v1.json). Each source fingerprint is a SHA-256 of its canonical URL plus the task-specific grading contract, deliberately not a volatile HTML hash.

## Run plan

The scorecard is three approaches × three repeats × all 29 scored rows. The fixed approaches are Mantis, Playwright accessibility tree, and screenshot; execution has a 600-second limit and Sarvam's default live-v1 completion budget is 50 steps.

```powershell
$env:AGENT_SUITE = 'live-v1'
$env:AGENT_TASKS = 'all'
$env:AGENT_APPROACHES = 'mantis,tree,screenshot'
$env:AGENT_RUNS = '3'
$env:AGENT_MAX_STEPS = '50'
$env:AGENT_TIMEOUT_S = '600'
npm run bench:agent
```

`AGENT_TASKS=all` is deliberately different for this suite: it selects all 29 scored rows, including the 10 judged rows. Excluded rows stay in the catalog and manifest but are neither scheduled nor scored. Evidence is captured by the harness after browser actions; deterministic rows require a successful final reply, one terminal capture, the canonical final URL/query, visible expected evidence, and any required terminal form state. Interactive/custom-control gaps remain blind judged using their row-specific rubrics.

## Preflight status

[live-v1-preflight.json](live-v1-preflight.json) is an offline inventory created because no external browser preflight was available during setup. Every candidate is explicitly `unverified-offline`; it does not claim that a site was reachable or that its content was observed.

The free collector makes no model calls. It defaults to this safe offline inventory:

```powershell
npx tsx bench/agent/live-v1-preflight.ts
```

To run public GET probes before a later promotion, opt in explicitly:

```powershell
$env:LIVE_V1_PREFLIGHT_NETWORK = '1'
npx tsx bench/agent/live-v1-preflight.ts
```

Review changed redirects, access blocks, and page text before changing a catalog contract or replacing this frozen cohort. Do not rerun a paid benchmark merely to preflight sources.

## Version history

- **v1.4**: replaced the excluded `livev1-standards-gpl-3` with `livev1-standards-rfc-8259` (open RFC 8259, report its displayed title; static `rfc-editor.org` page, also accepts `/info/rfc8259`), restoring 30 scored rows (31 documented). The new task has no captured run yet.
- **v1.6**: replaced `livev1-interactive-imdb-search` with `livev1-interactive-tmdb-search` (same query and rubric on TMDB). IMDb serves a human-verification page to plain headless Playwright, which Mantis and the screenshot baseline use, while the Playwright MCP tree baseline avoids it only because its default launch hides `navigator.webdriver`; the case measured launch fingerprints, not navigation. The swap was made after seeing results. The v1.5 IMDb line is kept in `bench/RESULTS.md` as historical.
- **v1.7**: replaced `livev1-civic-usgs-about` with `livev1-civic-nist-about` (open the NIST About page, report the heading "About NIST"). USGS served bot-check/CAPTCHA/403 pages in the v1.2 run (Mantis 0/3, tree 1/3, screenshots 3/3 by solving the check), so the task measured access gates rather than navigation. The swap was made after seeing results. The NIST row ran on Sarvam with the deterministic key: 9/9 success.
- **v1.5**: relaxed `livev1-docs-mdn-http-overview` to accept the `/Web/HTTP` landing page or the `/Guides/Overview` guide with the matching heading (a too-strict key failed tree twice and Mantis once); replaced the Met “Starry Night” query (not in the Met collection) with “Wheat Field with Cypresses”. Scored set is still 30; only those two rows changed.
- **v1.3**: excluded `livev1-standards-gpl-3` from scheduling and scoring because GNU timed out for every approach in the captured 20261022 run and archive.org does not meet the live-origin contract. The task remains documented, leaving 29 scored rows. Deterministic keys now accept the captured official Django overview and its page-specific heading, PostgreSQL's current version-18 alias (not older versions), USGS About/Who We Are destinations with their displayed headings, and both captured Our World in Data emissions pages with their matching titles.
- **v1.2** (task hash `d43e36e4`): replaced `livev1-interactive-smithsonian-search` with `livev1-interactive-arxiv-search` (judged, hard). A 12-run deepseek probe (`live-v1-smithsonian-probe-20261022`) showed Smithsonian search blocked by Cloudflare human verification for all three approaches (6/6 blocked), while `livev1-navigation-smithsonian-aircraft` succeeded 6/6 and stays. The v1.1 hash `5ca08a21` covers the earlier set.
- **v1.1** (task hash `5ca08a21`): loosened five deterministic contracts that rejected legitimate variants of the intended page, using the saved run `live-v1-deepseek-final-20261021`. The URL predicate gained optional `alsoPaths` (alternate pathnames of the same page, `*` = one segment; trailing slashes are ignored) in `bench/agent/realsite.ts`.
  - `gpl-3`: also accepts `/licenses/gpl-3.0.html`. `rfc-9110`: also `/info/rfc9110`. `node-url`: also `/docs/*/api/url.html` (latest and versioned docs). `nasa-missions`: also `/nasa-missions/`.
  - Grader hardening (`bench/agent/grading.ts`): the GPL date and OpenAPI keys are `entity` requirements (word-bounded, negation and conflict checks) instead of unbounded `text` substrings, and answers are NFKC-normalized before matching so compatibility forms (full-width digits, ligatures) compare equal.
  - `census-about`: the page shows "U.S. Census Bureau", never "United States Census Bureau", so the answer and page-text predicate is now "Census Bureau".
  - Unchanged on purpose: USGS (failures were bot-check access blocks), and the MDN landing, Django marketing and OWID greenhouse-gas pages, which are different pages from the intended ones.
- **Run 20261021 (`live-v1-deepseek-final-20261021`)** used the earlier uncommitted manifest, task hash `fe757761` (committed hash `8622db61`), and the two judged tasks since swapped (internetarchive -> gutenberg, alltrails -> smithsonian). Its deterministic scores are not comparable with v1.1 for the five rows above; rescore from saved evidence or rerun.
