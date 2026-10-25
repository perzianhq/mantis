# Launch and growth plan

## 1. The claim

Lead with the Luna and Haiku results in [README.md](../README.md#results): `long-local-v1` (long workflows on local fixtures, not live sites, 48/48 for Mantis on both models with 22-29% less time and 35-38% fewer input tokens than the tree; short tasks are about a tie) and the frozen live-site set `live-v1` v1.8 (read/navigate tasks on public sites; success out of 90 for Mantis / tree / screenshots: Luna 89/90/86, Haiku 89/89/90). The screenshot baseline is our own minimal tool, not a product's. Per-task changes and disclosures: [bench/live-v1.md](../bench/live-v1.md#changelog-and-disclosures); tables and caveats: [bench/RESULTS.md](../bench/RESULTS.md).
Publish failures and method beside the claim. Lead with agent task results; replay measures
cheap orientation, not reading a whole article.

## 2. Gate: don't launch until all of these are done

- [x] Freeze the evaluated source version (v0.1.5 = `70dbd5f`; headline runs: `416fd28`, `83ebb6a`, differences in [RESULTS.md](../bench/RESULTS.md)) and complete the [planned evaluations](PLAN.md#current-sequence).
- [x] Make a 30-second side-by-side video of the same task, with a live token counter; export a README GIF. Task, figures and cross-check: [video/gif.md](../video/gif.md) (record on Luna).
- [x] Open the README with the GIF, measured claim, [install](SETUP.md#install) and a 3-line example.
- [x] Configure npm Trusted Publishing for `perzianhq/mantis` and `.github/workflows/publish-npm.yml`.
- [x] Publish a matching GitHub release (v0.1.5).
- [x] CI green on Ubuntu, Windows and macOS (tests plus a packed-install check); issue templates and `SECURITY.md` in place.
- [x] v0.1.6 cut (install, OCR prefetch, CI, untrusted-data note); judge spot-check recorded.
- [x] Submit directory listings (official MCP registry, Glama and `awesome-mcp-servers` done; Smithery and mcp.so skipped because paid).

## 3. Launch week

| Day | Where | What |
|---|---|---|
| Before launch | Official MCP registry, Glama, `awesome-mcp-servers` (Smithery and mcp.so skipped, paid) | Submit listings (done) |
| Launch (Tue–Thu, 8–10am US Eastern) | **Show HN** | Post a first comment; answer comments all day |
| Launch | **X** | Video thread; tag agent/MCP builders |
| Launch +1 | **Reddit**: r/ClaudeAI, r/mcp, r/LocalLLaMA, r/ChatGPTCoding | “I built” with numbers; cheap/open models for LocalLLaMA (r/ChatGPTCoding: reuse the r/mcp draft) |
| Launch +2 | **LinkedIn** | What you built and learned |
| Launch +7 to +14 | **Product Hunt** | Landing-page badge |

## 4. Drafts

Numbers come only from [README.md](../README.md#results) and [bench/RESULTS.md](../bench/RESULTS.md); re-check before posting.

### Show HN

**Title:** `Show HN: Mantis – AI agents browse the web as numbered text, not screenshots`

**URL:** https://github.com/perzianhq/mantis

**First comment** (HN has no markdown: strip `**` and `>`, indent code blocks 2 spaces):

> Mantis is an MCP server that lets an agent (Claude Code, Codex, Cursor, your own) browse in Chromium and read pages as short numbered text instead of screenshots or a full accessibility tree.
>
> **Problem.** A screenshot costs about 1,366 tokens per step in my replay and needs coordinate clicks. The accessibility tree is long and misses what a person sees, like a cookie dialog covering the page.
>
> **Example.** A shop page with a cookie popup:
>
> ```
> Page: Shop
> [dialog "Accept cookies?" — covers page]
>   #3 button "Accept"
>   #4 button "Reject"
> [main]
>   # Shop
>   #1 button "Add to cart" (covered)
>   #2 link "More products" (covered)
> ```
>
> After `click #3` only the changes come back:
>
> ```
> clicked #3 button "Accept"
> ~ #1 "Add to cart": no longer covered
> ~ #2 "More products": no longer covered
> - dialog "Accept cookies?" closed
> ```
>
> **Results.** Two models (`gpt-6-luna`, `claude-haiku-5-5`), Mantis vs accessibility tree (Playwright MCP) vs screenshots. Real-site tasks are read/navigate on public sites.
>
> - Long workflows on local fixtures (16 tasks x 3 runs): Mantis and the tree both 48/48 on both models; Mantis used 22-29% less time and 35-38% fewer input tokens than the tree.
> - Long real-site workflows (16 tasks, 48 runs per cell): Mantis vs tree is Luna 41/48 vs 37/48, Haiku 47/48 vs 44/48. Medians: Luna 50s vs 75s, Haiku 90s vs 135s. Haiku Mantis includes one cell re-run after a tool fix (`form-selenium-select`, 2/3 failed before); without it Haiku is 45/48 vs 44/48. Without one iframe task Luna is 38/45 vs 37/45.
> - Short real-site tasks (30 tasks, 90 runs per cell), success /90 for Mantis / tree / screenshots: Luna 89/90/86, Haiku 89/89/90: within one task of the tree.
>
> **Method and failures.**
>
> - **Post-hoc task swaps.** Four short-task swaps: GPL-3 to RFC 8259, IMDb to TMDB, USGS to NIST, data-gov-climate to EIA About. The last (v1.8) removed 7 Haiku failures: Mantis 2, tree 3, screenshots 2. Haiku went from 87/86/88 to 89/89/90, so Mantis's one-task lead over the tree became a tie. Long-live tasks were also substituted before the final run. The set is now frozen. Details: bench/live-v1.md.
> - **The judge is uncalibrated.** Blind judge `gpt-6.1-sol`: 79% agreement with deterministic keys (95% CI 71.1-85.5%), 6/48 false successes, against a gate of 95% and <=2%. Treat model-judged rows as indicative.
> - **The screenshot baseline is my own minimal tool.**
> - **Not faster on short tasks.** About 3-6x less page text and 28-49% fewer input tokens than the tree (about even with Haiku screenshots, 72k vs 75k, which scored 90 and ran faster, 33s vs 45s). Luna medians are 44s vs 23s for the tree; Haiku 45s vs 43s, though the Haiku tree and screenshot times may be inflated by a 16-way parallel run. The speedup is on long tasks only.
> - **Known gaps.** Closed shadow roots are unreadable; image tools don't look inside iframes. Page text is unsanitised, so prompt injection is possible (SECURITY.md). Two models. Live sites change. Published numbers ran on earlier commits than the npm build (RESULTS.md, Benchmarked source).
>
> Install: `npx -y -p mantis-browser mantis install`, then `claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp`. MIT, benchmarks re-runnable. I want tasks where Mantis loses.

### X thread

1. AI agents browse with screenshots (about 1,366 tokens per step in my replay) or long accessibility trees. Mantis is an open-source MCP server that gives them short numbered text. [video]
2. A shop page with a cookie popup becomes 8 lines: `#3 button "Accept"`, `#1 button "Add to cart" (covered)`. After `click #3`, only the changes come back. [sees.svg]
3. Long local workflows: Mantis and the accessibility tree both 48/48 on Luna and Haiku, but Mantis used 22-29% less time and 35-38% fewer input tokens.
4. Long real-site workflows (48 runs per cell): Luna 41/48 vs 37/48 for the tree, 50s vs 75s. Haiku 47/48 vs 44/48 (45/48 without one cell re-run after a tool fix), 90s vs 135s.
5. Short real-site tasks: within one task of the tree. Success /90, Mantis / tree / screenshots: Luna 89/90/86, Haiku 89/89/90. Mantis used 28-49% fewer input tokens than the tree, but was not faster.
6. Caveats: four tasks swapped post-hoc (EIA About removed 7 Haiku failures and ended Mantis's lead on Haiku), the judge is uncalibrated (79% agreement), the screenshot baseline is my own tool.
7. Gaps: closed shadow roots, no image tools in iframes, page text is untrusted. Two models, read/navigate on public sites.
8. `npx -y -p mantis-browser mantis install`, then `claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp`. Repo, tables, method: github.com/perzianhq/mantis. Tell me tasks where it loses.

### Reddit

Each links the repo.

- **r/ClaudeAI:** "Mantis: an MCP server so Claude Code reads pages as short numbered text instead of screenshots. Haiku, 30 short real-site tasks: Mantis 89, tree 89, screenshots 90 of 90; 49% fewer input tokens than the tree, about even with screenshots (72k vs 75k). Long real-site workflows: 47/48 vs 44/48 for the tree (45/48 without one re-run cell), about a third less time. Caveats: uncalibrated judge, post-hoc task swaps (disclosed), not faster on short tasks. `claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp`"
- **r/mcp:** "Open-source browser MCP server with numbered text and diff-only results, about 3-6x less page text than the Playwright MCP tree on short tasks. Accuracy within one task of the tree on 30 real-site tasks (Luna 89 vs 90, Haiku 89 vs 89 of 90). Page text is untrusted (SECURITY.md). Caveats: uncalibrated judge, post-hoc task swaps (disclosed). Feedback on the tool surface welcome."
- **r/LocalLLaMA:** "Smaller prompts for browser agents: 35-38% fewer input tokens than the accessibility tree on long local workflows (both 48/48), 28-49% on short real-site tasks. Only tested `gpt-6-luna` and `claude-haiku-5-5` on real sites; the judge is uncalibrated and the screenshot baseline is my own. Which local models should I try?"

### LinkedIn

> I open-sourced Mantis, a browser tool that lets AI agents read the web as short numbered text instead of screenshots.
>
> Two models, read/navigate tasks, vs the accessibility tree: on long local workflows Mantis and the tree both scored 48/48, with Mantis using 22-29% less time and 35-38% fewer input tokens. On 30 short real-site tasks accuracy was within one task (Luna 89 vs 90, Haiku 89 vs 89 of 90); Mantis used 28-49% fewer input tokens but was not faster.
>
> Three lessons:
> 1. Disclose task swaps next to the scores. One post-hoc swap moved Haiku from 87/86/88 to 89/89/90 and removed Mantis's lead over the tree.
> 2. An uncalibrated judge (79% agreement with deterministic keys) makes results indicative, not conclusive.
> 3. A token saving is not a speed saving; it showed up on long tasks only.
>
> Repo, tables and failures: github.com/perzianhq/mantis

## 5. After launch: becoming the default

- **Ship where agents are installed.** Claude Code plugin, Codex setup docs, integration PRs/guides
  for Cursor, Cline, LangChain, the OpenAI Agents SDK and browser-agent frameworks.
- **Pitch scale.** Publish measured cost per 1,000 tasks.
- **One deep post:** “Why AI agents shouldn't take screenshots”, with the benchmark.
- **Keep benchmarks public and re-runnable.** Invite tasks where Mantis loses; fix them in public.
- Answer issues within a day for the first month.
- Ship small releases with short changelog posts.

## 6. What to measure

Weekly npm downloads, repeat use, merged integrations and outside issues. GitHub stars are a weaker signal.
