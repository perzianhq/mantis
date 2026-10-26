# live-v1: frozen public live-site benchmark

`live-v1` is a 30-scored-task (v1.9), public, read-only live-site cohort. It retains one excluded task in the public catalog for documentation. It is separate from every local suite and from the gated Online-Mind2Web `realsite-tasks.json` source.

v1.9 drops model judging: every scored row has a deterministic final-state key, replayed only from saved captured evidence (no network or provider calls).

The documented allocation is six families of five tasks: standards, documentation, civic reference, open data, site navigation, and interactive exploration. At v1.3 the 29 scored rows had 19 deterministic terminal-state contracts and 10 task-specific blind-judge contracts, with 7 easy, 14 medium, and 8 hard tasks. The catalog spans more than 15 independent sites; no site has more than three rows.

The immutable task IDs and contract hash are in [manifests/live-v1.json](manifests/live-v1.json). Each source fingerprint is a SHA-256 of its canonical URL plus the task-specific grading contract, deliberately not a volatile HTML hash.

## Run plan

The scorecard is three approaches × three repeats × all 30 scored rows. The fixed approaches are Mantis, Playwright accessibility tree, and screenshot; execution has a 600-second limit.

```powershell
$env:AGENT_SUITE = 'live-v1'
$env:AGENT_TASKS = 'all'
$env:AGENT_APPROACHES = 'mantis,tree,screenshot'
$env:AGENT_RUNS = '3'
$env:AGENT_MAX_STEPS = '50'
$env:AGENT_TIMEOUT_S = '600'
npm run bench:agent
```

`AGENT_TASKS=all` is deliberately different for this suite: it selects all scored rows, including the judged rows. Excluded rows stay in the catalog and manifest but are neither scheduled nor scored. Evidence is captured by the harness after browser actions; deterministic rows require a successful final reply, one terminal capture, the canonical final URL/query, visible expected evidence, and any required terminal form state. Interactive/custom-control gaps remain blind judged using their row-specific rubrics.

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

## Changelog and disclosures

Final scores are in [RESULTS.md](RESULTS.md#live-site-scorecard-live-v1-v18). Everything below was changed or disclosed after seeing results; it is kept here so the headline tables stay short. Entries run newest first.

### v1.9 deterministic regrade (20261026)

All 540 clean short-run rows now use saved terminal evidence only; no model-judge verdict remains in the scorecard. Final deterministic counts: Luna: Mantis 86/90, tree 86/90, screenshots 90/90. Haiku: Mantis 90/90, tree 88/90, screenshots 88/90. The retained failures are destination, terminal-evidence, or access-block failures documented in `.codex-jobs/graders2.out.md`.

The four task-derived key corrections accept Open Library's results ordering evidence, TMDB's `/search/movie` alias with its query, arXiv advanced-search's term field, and OpenAPI 3.1's `/oas/v3.1.0` alias. Each has a synthetic passing and near-miss fixture test. The v1.9 contract hash is `e12d5a169cd10150bbf79220505fb3adadc1373ad1333dab71f11c01875e864f`; source fingerprint set hash is `907c383b3b8fe96ea477c6481fb2ca0a8f4b75ade89206e15bd5ccd944e84e8f`.

### Clean short re-run (20261026, historical judge pass)

Re-ran all 30 short tasks for Luna and Haiku: 3 approaches interleaved, 3 runs, one build, 6 concurrent runs per model. The first judging pass left 169 judge-timeout rows; they were re-judged (gpt-6.1-sol for 21, claude-sonnet-5-5 for the rest; per-run `judgeModel` in `results/live-v1-{luna,haiku}-clean-20261026-final.json`). Result: Mantis 86/90 (Luna) and 90/90 (Haiku), tree 85/90 and 88/90, screenshots 90/90 and 88/90. Mantis median time was below the tree for both models. This replaces the earlier short-task timing comparison, which mixed concurrency levels and hosts.

### v1.8 task swap: data.gov climate to EIA About

`livev1-data-data-gov-climate` was replaced by `livev1-data-eia-about` (EIA About page; answer "Energy Information Administration"; <https://www.eia.gov/about/>). Its strict `/climate/1/` URL contract and site drift made the old task fragile: it caused 7 of 9 Haiku failures and some Mantis misses. The 18 EIA runs (3 approaches x 3 runs x 2 models) all passed deterministic validation. Old data.gov results remain in `bench/results/` and are disclosed here.

### Historical v1.7 Haiku tree and screenshot re-run on the Mantis CLI build (20261025)

Tree and screenshots were re-run for Haiku on all 30 tasks x 3 runs (180 runs) locally on Claude CLI 2.1.161, the same build as the Mantis re-run, so token and tool-output columns are now comparable. Mantis and Luna were not re-run. Concurrency was 16 on a 12-core, 16 GB machine; 4 rows damaged by contention were re-run at concurrency 4, so latency may be inflated. Judged blind by sol (same deterministic-first gate; 57 validator-graded and 33 judge-graded rows per approach) after fixing evidence-frame paths, which had caused an earlier judge pass to return unsure and blocked verdicts; final: 0 unsure, 0 blocked. Historical v1.7 results: tree 86/90 (was 87), screenshots 88/90 (was 89); failures were `data-gov-climate` x5 plus tree `css-color-4` run 2. The original cloud-CLI-2.1.308 tree and screenshot numbers are superseded. Results: `live-v1-haiku-localcli-merged-20261025-judged`.

### Historical v1.7 Mantis re-run after `src/` gap fixes (20261023)

Mantis was re-run on all 30 tasks x 3 runs for Luna and Haiku (tree and screenshot numbers unchanged). Haiku had 6 MCP connection-failure rows, re-run alone (`...-rec-20261024`, 6/6 success) and merged. Historical v1.7 failures: Luna `rfc-8259` run 2, Haiku `node-url` run 1 and `data-gov-climate` runs 1-2, all agent behaviour or site drift, no Mantis defect (sol-reviewed). `livev1-data-data-gov-climate` was fragile (the site's climate page drifted) and was replaced in v1.8.

### v1.7 grader fixes (after seeing Luna results)

- `matchesAnswerRequirement` now strips markdown backticks and `**` before matching (source, requirement and `with.value`). A correct answer written as `` `application/json` `` previously failed a literal match; a pickle near-miss still fails.
- The Eurostat database key gained `alsoPaths: ["/eurostat/data/database"]` (an alias of `/eurostat/web/main/data/database`).
- Both are generic grader rules with passing and near-miss tests in `test/live-v1.test.ts`.
- New `taskHash` `38a1ec62e200ec6da9af0008046ba07a3c14245a20cce7e541cd2569ed8bfa9c`, `sourceFingerprintSetHash` `388cb8daf83b03cdd2dd3d3f5557dd140641876e39b002373699e6b30cd6ba6e` (manifest and preflight updated).
- Luna was regraded with them (pre-regrade file kept in `bench/results/prev/`); Haiku had no deterministic failures to regrade.

### v1.7 task swap: USGS to NIST

`livev1-civic-usgs-about` was replaced by `livev1-civic-nist-about` (open the NIST About page, report the heading "About NIST"). USGS served bot-check/CAPTCHA/403 pages in the v1.2 run (Mantis 0/3, tree 1/3, screenshots 3/3 by solving the check), so the task measured access gates rather than navigation. The swap was made after seeing v1.6 results. The NIST row ran on Sarvam with the deterministic key, 3 runs per approach: 9/9 success (Mantis 3/3 in 4-7 calls, about 23k input tokens on average; tree 3/3 in 7-8 calls, about 36k; screenshots 3/3 in 7-8 calls, about 19k). The 30-task Sarvam set was then Mantis 88/90, tree 90/90, screenshots 89/90 (97.8% / 100% / 98.9%). The USGS v1.2 evidence stays in `bench/results/agent-logs/live-v1-deepseek-v1_2-20261022/`. Remaining Mantis misses: Census (1) and OWID (1); screenshots missed Census once. The Sarvam token/call table is the v1.5 set, not recomputed. Sarvam only, not a Luna/Haiku claim.

### v1.7 Luna and Haiku runs

Run on v1.7: 30 tasks x 3 approaches x 3 runs = 270 runs per model, judged blind by Codex `gpt-6.1-sol` (high reasoning); 20+ tasks are graded by deterministic validators on captured final state. Results: `live-v1-luna-20261022-judged`, `live-v1-haiku-20261022-judged`. Reproduce: `JUDGE_IN=live-v1-luna-20261022 npm run bench:judge` (and `live-v1-haiku-20261022`).

- **Luna** (local run): Mantis and tree are perfect; Mantis uses about 26% fewer input tokens than either baseline. The five screenshot misses are two wrong RFC URLs (rfc-8259 run 2, rfc-9110 run 3), two Django overviews without the "Why Django?" heading, and one borderline Census About page.
- **Haiku** (cloud run plus local rerun): the cloud run hit Cloudflare/Vercel bot checks on W3C (WCAG 2.2, CSS Color 4), the Met and TMDB: 33 runs were judged blocked, not failed. Those 33 were rerun locally (same model and settings) and judged by sol; all 33 are merged into the headline scores (pre-merge file in `bench/results/prev/haiku-judged-pre-local-rerun.*`, rerun in `live-v1-haiku-20261022-localrerun-judged`). Final: 7 failures. Six are `docs-node-url` (Mantis 2, tree 3, screenshots 1): Haiku stopped on the API index instead of the `url.html` page, a Haiku-specific weakness (Luna passed all 9). One is a tree WCAG 2.2 run with an empty final reply. Superseded by the 20261025 re-run above: Mantis uses about 49% fewer input tokens than tree (78k vs 153k), about even with screenshots (82k); median time is 46.4s Mantis, 43.7s tree, 33.4s screenshots.
- **Latency:** Mantis cuts tokens (about 25-35% vs the tree) and tool output (3-6x), but not wall time on these short tasks. Merged medians: Luna 43.7s Mantis vs 23.4s tree vs 28.5s screenshots; Haiku 46.4s vs 43.7s vs 33.4s (tree and screenshots re-run on the same CLI build at concurrency 16, so their times may be inflated by contention).
- **Judge notes:** Haiku's first judge pass ran on cloud Sonnet and was redone with sol; the Sonnet pass is kept in `bench/results/prev/`. The first sol pass was text-only because the cloud run recorded evidence paths from another machine (fixed by relocating them to the local log folder) and was redone with the evidence frames. The deterministic gate then treated 18 Cloudflare interstitial final frames (WCAG 2.2, CSS Color 4) as answer failures; `isAccessBlockText` now recognises Cloudflare and Vercel checkpoint pages, with tests, so they go to model adjudication and came back blocked. Only those 18 rows were rejudged; the other 252 verdicts were unchanged. The 33 blocked runs were then rerun locally (the first local judge attempt failed with `spawn codex ENOENT` and was redone with Codex on PATH). One Luna judge run hit a stale-log error and was rerun (`live-v1-luna-20261022-unsure`).

### v1.6 task swap: IMDb to TMDB

`livev1-interactive-imdb-search` was replaced by `livev1-interactive-tmdb-search` (same "Spirited Away" search on TMDB), because IMDb measured launch fingerprints rather than navigation. The swap was made after seeing v1.5 results. The new task ran on Sarvam, judged by Codex sol, 3 runs per approach: 9/9 success (Mantis 3/3 in 3-5 calls and about 23k input tokens on average; tree 3/3 in 6-12 calls, about 133k; screenshots 3/3 in 16-18 calls, about 68k). The 30-task Sarvam set was then Mantis 85/90, tree 88/90, screenshots 89/90 (94.4% / 97.8% / 98.9%). The IMDb v1.5 line stays as historical (Mantis 0/3, tree 3/3, screenshots 3/3 by solving the CAPTCHA). Remaining Mantis misses: USGS (3), Census (1), OWID (1). Sarvam only, not a Luna/Haiku claim.

**IMDb root cause (diagnosed, not worked around):** the site shows a human-verification gate to Playwright's default headless launch, with or without Mantis code. The Playwright MCP baseline is not gated because it launches Chromium with `--disable-blink-features=AutomationControlled` by default, which hides the automation signal; adding that flag to a plain launch reproduced the pass (3/3 vs 0/2). Screenshots were gated too but their agent solved the CAPTCHA by clicking images. Mantis hands CAPTCHAs to a human and does not mask automation, so its IMDb result is an environment difference, not a Mantis navigation bug. IMDb is non-comparable across approaches.

**IMDb gate fix (generic, fixture-tested):** the agent looped on a custom verification gate, since fixed generically; Sarvam rerun, agent-reported 2/3 success (41, 50 and 13 calls); not judged.

### v1.5 key and task fixes (made after seeing v1.4 results)

The MDN key was too strict (failed tree 2/3 and Mantis 1/3), so it now accepts the HTTP landing page or the Overview guide with its matching heading. The Met "Starry Night" query is not in the Met collection, so the task now searches "Wheat Field with Cypresses". Both tasks were rerun (Sarvam, judged by Codex sol, 3 runs per approach): 6/6 success for each of Mantis, tree and screenshots. Replacing the old MDN and Met results, the 30-task Sarvam set was Mantis 82/90, tree 88/90, screenshots 89/90 (91.1% / 97.8% / 98.9%). Remaining Mantis misses were IMDb (3), USGS (3), Census (1) and OWID (1), all counted as misses. Sarvam only, not a Luna/Haiku claim.

### v1.4 task swap: GPL-3 to RFC 8259

The excluded GPL-3 row was replaced by `livev1-standards-rfc-8259` (kept GPL-3 as `excluded:true`), so the scored set stays 30. The RFC 8259 task was added to keep the scored set at 30.

### Task and key changes by version

- **v1.7 census key widening** (after seeing the sol review of the judge audit): `livev1-gov-census-about` gained `alsoPaths: ["/about-us/who.html"]` (the official Who We Are page answers the same question). Generic mechanism, tests in `test/fixture-verification.test.ts`. One Luna screenshot row was regraded (85 to 86). New `taskHash` `6b08ef1a6bb21d2065a7f597e68a96e7d1466606b0ae7878dc896ce1cb42c04e`, `sourceFingerprintSetHash` `19beb3d06cedf18d92efae2210b90b9ba32ebd770e01e3066877dada1e41acc7` (manifest and preflight updated). The hashes in the grader-fixes entry below are the pre-widening ones.

- **Haiku WCAG rejudge**: `livev1-standards-wcag-22` tree run 1 was first judged failure on the grounds that the reply was empty, but the recorded answer is non-empty. It was re-judged alone on identical evidence (sol) and is success, so Haiku tree is 87/90 (was 86). The only row re-judged; the first verdict is replaced in `live-v1-haiku-20261022-localrerun-judged.json` (row flagged `rejudged`).

- **v1.7 grader fixes** (after seeing Luna results):
  - `matchesAnswerRequirement` strips markdown backticks and `**` before matching (source, requirement and `with.value`).
  - The Eurostat database key gained `alsoPaths: ["/eurostat/data/database"]`.
  - Generic, with passing and near-miss tests in `test/live-v1.test.ts`.
  - New `taskHash` `38a1ec62e200ec6da9af0008046ba07a3c14245a20cce7e541cd2569ed8bfa9c`, `sourceFingerprintSetHash` `388cb8daf83b03cdd2dd3d3f5557dd140641876e39b002373699e6b30cd6ba6e` (manifest and preflight updated).
  - Luna was regraded; scores are in [RESULTS.md](RESULTS.md).

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
