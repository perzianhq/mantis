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
- [x] Submit directory listings (Glama and `awesome-mcp-servers` done; Smithery and mcp.so skipped because paid).

## 3. Launch week

| Day | Where | What |
|---|---|---|
| Before launch | Official MCP registry, Glama, `awesome-mcp-servers` (Smithery and mcp.so skipped, paid) | Submit listings (done) |
| Launch (Tue–Thu, 8–10am US Eastern) | **Show HN** | Post a first comment; answer comments all day |
| Launch | **X** | Video thread; tag agent/MCP builders |
| Launch +1 | **Reddit**: r/ClaudeAI, r/mcp, r/LocalLLaMA, r/ChatGPTCoding | “I built” with numbers; cheap/open models for LocalLLaMA |
| Launch +2 | **LinkedIn** | What you built and learned |
| Launch +7 to +14 | **Product Hunt** | Landing-page badge |

## 4. Drafts

Every number below comes from [README.md](../README.md#results) or [bench/RESULTS.md](../bench/RESULTS.md); re-check against them before posting. Post the repo link in the first comment, not the title.

### Show HN

**Title:** `Show HN: Mantis – AI agents browse the web as numbered text, not screenshots`

**URL:** https://github.com/perzianhq/mantis

**First comment:**

> Hi HN. Mantis is an MCP server that lets an agent (Claude Code, Codex, Cursor or your own) browse in Chromium and read pages as short numbered text instead of screenshots or a full accessibility tree.
>
> **Problem.** Screenshots cost about 1,366 tokens per step in my replay of scripted tasks and need coordinate clicks. The accessibility tree is exact but long, and it doesn't tell you what a person would notice by looking, like a cookie dialog covering the page.
>
> **Example.** A shop page with a cookie popup becomes 8 lines:
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
> **Results, scoped.** Read/navigate tasks on public sites, two models (`gpt-6-luna`, `claude-haiku-5-5`), Mantis vs the accessibility tree (Playwright MCP) vs screenshots.
>
> - Long workflows on local fixtures (`long-local-v1`, 16 tasks x 3 runs): Mantis 48/48 on both models, with 22-29% less time and 35-38% fewer input tokens than the tree. Luna screenshots got 42/48.
> - Long workflows on real sites (`long-live-v1`, 16 tasks, 48 runs per cell): correct Mantis vs tree is Luna 41/48 vs 37/48, Haiku 47/48 vs 44/48. Medians over all runs, failures included: Luna 50s vs 75s and 262k vs 362k input tokens; Haiku 90s vs 135s and 432k vs 746k.
> - Short real-site tasks (`live-v1` v1.8, 30 tasks, 90 runs per cell), success /90 for Mantis / tree / screenshots: Luna 89/90/86, Haiku 89/89/90. That is a tie on accuracy, not a win.
>
> **Method and where I'd be skeptical.**
>
> - **Post-hoc task swaps.** Four live-v1 tasks were swapped post-hoc: GPL-3 to RFC 8259, IMDb to TMDB, USGS to NIST, and data-gov-climate to EIA About. The last one, in v1.8, removed 7 Haiku failures (Mantis 2, tree 3, screenshots 2) and no Luna failures. The swap lifted Mantis by 2, the tree by 3 and screenshots by 2: Haiku was 87/86/88 in v1.7 and is 89/89/90 now, so Mantis's one-task lead over the tree became a tie. I'd rather you see the swap than find it. The long-live-v1 set also had substitutions (unreachable `/large_form`, blank DemoQA pages) before the final run. The 30-task set is now frozen. Disclosures: bench/live-v1.md.
> - **The judge is not calibrated.** The blind judge (Codex `gpt-6.1-sol`) agreed with deterministic keys 79% of the time (95% CI 71.1-85.5%) and had 6/48 false successes, against a gate of 95% and <=2%. Treat model-judged rows as indicative. In `long-live-v1`, three of the four net Mantis wins on Luna come from one iframe task; without it Luna is 38/45 vs 37/45.
> - **The screenshot baseline is my own minimal tool**, not a product's.
> - **Mantis is not faster on short tasks.** It returns about 3-6x less page text and uses 28-49% fewer input tokens, but Luna medians are 44s Mantis vs 23s tree, and Haiku is 45s vs 43s (screenshots 33s). The Haiku tree/screenshot times came from a 16-way parallel run and may be inflated. The speed gain shows up on long tasks only (about a third less time).
> - **Known gaps.** Closed shadow roots can't be read; the image tools (`media`, `data`, `ocr`, `look`) don't look inside iframes yet. Page text reaches the agent unsanitised with no untrusted-content marker, so prompt injection is possible (see SECURITY.md). Only two models, no self-hosted apps. Live sites change, so real-site numbers are a snapshot.
>
> Install: `npx -y -p mantis-browser mantis install`, then `claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp`. Or try it without an agent: `npx -y -p mantis-browser mantis read https://example.com`. Everything is MIT and the benchmarks are re-runnable (bench/README.md). I especially want tasks where Mantis loses.

### X thread

1. AI agents browse the web with screenshots (about 1,366 tokens per step in my replay, coordinate clicks) or a long accessibility tree. I built Mantis, an MCP server that gives them short numbered text instead. Open source, works with Claude Code, Codex, Cursor. [video/GIF]
2. Example: a shop page with a cookie popup becomes 8 numbered lines. `#3 button "Accept"`, `#1 "Add to cart" (covered)`. After `click #3`, only the changes come back. [sees.svg]
3. Long workflows on local fixtures (16 tasks x 3 runs): Mantis 48/48 on both Luna and Haiku, with 22-29% less time and 35-38% fewer input tokens than the accessibility tree.
4. Long workflows on real sites (16 tasks, 48 runs per cell, medians incl. failures): Luna 41/48 vs 37/48 for the tree, 50s vs 75s. Haiku 47/48 vs 44/48, 90s vs 135s.
5. Short real-site tasks (30 tasks, 90 runs per cell) are a tie on accuracy. Success /90, Mantis / tree / screenshots: Luna 89/90/86, Haiku 89/89/90. Mantis uses 28-49% fewer input tokens but is not faster here.
6. Where to be skeptical: four tasks were swapped after scoring (the last, EIA About, removed 7 Haiku failures: Mantis +2, tree +3, screenshots +2, so Mantis no longer leads the tree on Haiku), the blind judge is uncalibrated (79% agreement, 6/48 false successes), and the screenshot baseline is my own minimal tool.
7. Known gaps: closed shadow roots, no image tools inside iframes, page text is untrusted (prompt injection is possible). Two models, read/navigate tasks on public sites.
8. `npx -y -p mantis-browser mantis install` -> repo, full tables and method: github.com/perzianhq/mantis · perzian.dev/mantis. Tell me tasks where it loses.

### Reddit

Short variants, each linking the repo. Put the caveats in the post itself, not only in comments:

- **r/ClaudeAI.** "I built Mantis, an MCP server that lets Claude Code read web pages as short numbered text instead of screenshots. With Haiku on 30 short real-site tasks it ties the accessibility tree on success (89 vs 89 of 90) and uses 49% fewer input tokens; on long workflows it was 47/48 vs 44/48 and about a third less time. Caveats up front: judge is uncalibrated, tasks were swapped post-hoc (disclosed), not faster on short tasks. Install: `claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp`. Looking for tasks where it fails."
- **r/mcp.** "Open-source MCP server (`mantis-browser`) for browsing with numbered text: `#3 button "Accept"`, and after a click only the diff comes back. Tool results are about 3-6x smaller than the Playwright MCP tree on short tasks. Accuracy is a tie on 30 real-site tasks (Luna 89 vs 90, Haiku 89 vs 89 of 90). Page text is untrusted and unsanitised (SECURITY.md). Feedback on the tool surface welcome."
- **r/LocalLLaMA.** "Smaller prompts for browser agents: Mantis cuts input tokens by 35-38% on long local workflows and 28-49% on short real-site tasks vs the accessibility tree, which matters for cheap or open models. Honest limits: I only tested `gpt-6-luna` and `claude-haiku-5-5` (plus a DeepSeek flash local-fixture run), the judge is uncalibrated, and the screenshot baseline is my own tool. MIT, re-runnable benchmarks. Which local models should I try next?"

### LinkedIn

> I open-sourced Mantis, a browser tool that lets AI agents read the web as short numbered text instead of screenshots.
>
> Why: screenshots cost about 1,366 tokens per step in my replay, and accessibility trees are long. I wanted agents to read what a person would notice and nothing more.
>
> What I measured (two models, read/navigate tasks, Mantis vs accessibility tree vs screenshots): on long local workflows Mantis scored 48/48 on both models, with 22-29% less time and 35-38% fewer input tokens than the tree. On 30 short real-site tasks accuracy was a tie (Luna 89 vs 90, Haiku 89 vs 89 of 90) and Mantis used 28-49% fewer input tokens, but it was not faster.
>
> Three things I learned:
> 1. Disclose task swaps next to the scores. The last of four post-hoc task swaps changed Haiku from 87/86/88 to 89/89/90 and removed Mantis's one-task lead over the tree. Better that I say it than a reader finds it.
> 2. An uncalibrated judge makes a benchmark indicative, not conclusive: mine agreed with deterministic keys 79% of the time.
> 3. A token saving is not a speed saving. It showed up on long tasks, not short ones.
>
> Repo, tables and failures: github.com/perzianhq/mantis. If you have a task where an agent should read a page better, I'd like to try it.

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
