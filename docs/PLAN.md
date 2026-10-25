# Mantis: plan and progress

What Mantis is: [README.md](../README.md). Design: [APPROACH.md](APPROACH.md).
Benchmark commands and grading: [bench/README.md](../bench/README.md).

## Code layout

```
Agent (Claude, Cursor, …)
      │  MCP (stdio)
MCP server      src/server.ts      the tools
Translator      src/translate.ts   cleanup, numbering, regions, text format
                src/diff.ts        what changed after an action
                src/memory.ts      site memory
Page capture    src/capture/       injected DOM walker → raw nodes
Fallbacks       src/fallback/      media, data, ocr, look, ask_human
Browser         src/browser.ts     Playwright (the library, not Playwright MCP)
```

Stack: TypeScript (ESM, Node ≥20), Playwright, `@modelcontextprotocol/sdk`, zod, vitest.

## Evaluation plan

```text
frozen local-v1 → local-v2 full scorecard → local-v2.1 reliability scorecard → frozen live-site set (live-v1, complete) → publish
```

| Phase | Run | Gate |
| --- | --- | --- |
| Local-v1 — complete | Frozen 25-task seeded local baseline, 3 approaches × 3 repeats = 225 logical runs. | Preserve the [manifest](../bench/manifests/local-v1.json) and [final scorecard](../bench/RESULTS.md#local-tasks-sarvam-final-seeded-baseline). |
| Local-v2 full — complete | Frozen 48-case local scorecard: 3 approaches × 3 repeats = 432 rows, DeepSeek through Sarvam. | Preserve the versioned offline regrade and its 35-step policy. See [results](../bench/RESULTS.md#local-v2-full-scorecard-historical). |
| Local-v2.1 — complete | Frozen 54-case reliability scorecard: local-v2 plus six distinct perception/action contracts; 3 approaches × 3 repeats = 486 rows at a 50-completion non-`long` cap. | Publish separately; never replace local-v2. See [results](../bench/RESULTS.md#local-v21-full-scorecard-current). |
| Frozen live sites — complete | Separate read-only public-site set: [live-v1](../bench/live-v1.md) v1.8, 30 tasks, three approaches × three repeats, for Luna and Haiku. | Scored with deterministic validators where complete and the blind judge for the rest. See [results](../bench/RESULTS.md#live-site-scorecard-live-v1-v18). |
| Publish | Matched runs for Mantis, tree, and screenshot. | Per-task score, seed/trace, calls, latency, tokens, cost, and failures. |

Keep model, browser, retry policy, timeout, and token budget matched across approaches. Publish each suite separately; never combine local-v1, local-v2, local-v2.1, and live-site scores. Run the live-site set only at milestones or after browser/tooling changes. No self-hosted-app stage is planned.

## Current sequence

1. Preserve local-v1 fixtures, tasks, graders, seed, and results; the final 225-run baseline is complete.
2. Preserve the completed 48-case local-v2 scorecard and its regrade; do not replace individual rows.
3. Preserve the completed 54-case local-v2.1 scorecard; do not replace individual rows.
4. Preserve the completed live-v1 v1.8 scorecard; see [live-v1](../bench/live-v1.md). Launch steps are below. The gated Online-Mind2Web path ([real-site tasks](../bench/README.md#real-site-tasks-blind-judge)) is a historical pilot.

## Next steps: open-source launch (v0.1.5, public beta)

Verdict (Opus review, 2026-10-24): good enough to launch as a v0.x beta. Accuracy is within one task of the tree on real sites (Luna 89 vs 90, Haiku 89 vs 89 of 90) and long workflows (48/48 both), with 35–38% fewer input tokens on long tasks. No large live-site expansion before launch; scope the claim as "read/navigate on public sites, 2 models".

### Must do before launch
1. **Done: release 0.1.5** (npm, GitHub release and MCP Registry; v0.1.6 ships the install, OCR-prefetch and CI changes). Original note: npm `mantis-browser@0.1.3` (published 2026-10-19) predates about 20 `src/` commits behind the headline numbers. Bump `package.json` and `server.json` (still 0.1.2) to 0.1.4, tag it from the benchmarked commit, and cite that commit in [RESULTS.md](../bench/RESULTS.md).
2. **Honest claims.** Fix stale numbers in [LAUNCH.md](LAUNCH.md). Limit "~30% fewer" to long tasks. State that the screenshot baseline is our own tool. Publish the swapped-out live-v1 tasks (IMDb, USGS, GPL-3, data-gov-climate) next to the scores. The 30-task set is frozen at v1.8 after the disclosed EIA swap.
3. **Judge check.** The calibration gate (100 packets, 30 tasks, 95% agreement, at most 2% false successes) is not met; a human spot-checks about 30 sol verdicts.
4. **Done: install on Windows, Mac and Linux.** `mantis install` (with `--with-deps` for bare Linux) fetches Chromium and OCR data; the CI `install` job exercises the packed package on all three OSes. Original note: Risk: `npx playwright install chromium` fetches a different Chromium build than the package needs, so the first launch fails. Add a `mantis install` command or a clear error. OCR data downloads on first use; document it.
5. **Security (partly done: `SECURITY.md` and README link exist; untrusted-data note sent once in the MCP server instructions, no per-call marker).**
   - Add `SECURITY.md` and a README section.
   - ~~Untrusted marker~~: done as a one-time MCP `instructions` note (zero per-call tokens); no sanitising, documented in `SECURITY.md`.
   - Check whether `upload` restricts local paths.
   - `ask_human` needs a display; document it.
6. **Done: CI.** Build and test plus a packed-install job on Ubuntu, Windows and macOS.
7. **Repo hygiene.**
   - ~~Tracked internal policy files and Codex helper scripts expose internal policy and local paths: untrack or sanitise.~~ (done)
   - ~~Docs link to the gitignored `.codex-jobs/`~~ (checked: no tracked doc links it).
   - Delete about 145 untracked scratch files at the repo root (`.tmp-*`) and decide which `bench/results/` leftovers to commit or ignore.

### Before launch (moved up, 2026-10-24)
- `long-live-v1`: 16 long real-site tasks (5 multi-entity extraction, 4 search+facets+pagination, 3 form fills without submit, 2 demo-site test-account flows, 2 new-tab/iframe/upload; 10 medium, 6 hard; at most 4 demo sites). Size on the tree walkthrough at 20-40 calls (about 15-30 for Mantis), cap 100 calls and 1200 s. Reviewed deterministic keys and final-state validators; sol only for leftovers. Pilot once per approach and model, replace failures, then freeze (at least 12 must survive). Luna and Haiku, Mantis vs tree, 3 runs each (192 runs, plus 64-run pilot). Report the median paired ratio per task with a bootstrap CI over tasks, on rows where both succeeded. Backs the long-task claim on real sites, which is measured on local fixtures only (`long-local-v1`). Does not block launch if the copy stays scoped to local fixtures; ship as a labelled follow-up within about 2 weeks. Draft: `bench/agent/long-live-v1-draft.json`.

### Before launch, remaining (moved up, 2026-10-25)
- [x] README opens with the GIF, install and a 3-line example.
- [x] [CONTRIBUTING.md](../CONTRIBUTING.md) and [CHANGELOG.md](../CHANGELOG.md). Issue templates were done earlier.
- [x] Re-run Haiku tree and screenshots on the same CLI build and machine as the Mantis re-run (local CLI 2.1.161), so the live-v1 token and latency columns become comparable. Mantis `src/` is frozen at `v0.1.6` (`059cccf`); since `70dbd5f` it only gained install changes and the MCP note, so Mantis rows stay valid. 180 Haiku runs (30 tasks x 3 x 2 approaches); Luna needs no re-run.
- [x] Replace the fragile `data-gov-climate` task (v1.8, live-v1 only) with EIA About; all 18 runs succeeded and the swap is disclosed beside the scores.

### Optional
- Add Claude's own browser tools (Claude in Chrome, built-in browser pane) as a fourth approach on a few long tasks. Unmeasured; Claude would be the agent, so it is not like-for-like with the Luna/Haiku rows.

### After launch
- ~~Add `upload` to the tool table in SETUP.md~~ (done).
- Integration PRs and guides: [LAUNCH.md](LAUNCH.md#5-after-launch-becoming-the-default).

### Action plan (remaining)
1. ~~Cut v0.1.6~~ (done: npm, GitHub tag, MCP Registry).
2. ~~Spot-check about 30 sol verdicts~~ (done, recorded in [RESULTS.md](../bench/RESULTS.md)).
3. ~~Untrusted-content note; GitHub repo topics~~ (done).
4. ~~Clean untracked scratch files~~ (done).
5. ~~Submit listings~~ (official MCP registry, Glama and `awesome-mcp-servers` done; Smithery and mcp.so skipped, paid).
5b. ~~Finish the two unchecked items in "Before launch, remaining"~~ (done: Haiku re-run and EIA swap, v1.8).
5c. ~~Write launch drafts~~ (done: [LAUNCH.md](LAUNCH.md#4-drafts); re-check numbers against README.md and bench/RESULTS.md before posting).
6. ~~Record the 30-second video and GIF; README opens with it~~ (done, [video/gif.md](../video/gif.md)).
7. Not started: Show HN, Tue-Thu 8-10am US Eastern, then X, Reddit and LinkedIn per [LAUNCH.md](LAUNCH.md#3-launch-week).

### Biggest risks
- Installs that fail on day one.
- Show HN finding a prompt-injection hole, or calling post-result task swaps cherry-picking.

Not verified in the review: whether the repo is public, npm Trusted Publishing setup, a fresh install, whether tests pass now, and `upload` path limits.

## Deferred work

- Semantic tool diagnostics with a shared rubric for Mantis, tree, and screenshot.
- Fallback coverage for headed `ask_human`, ECharts, and Highcharts.
- Chrome DevTools MCP and browser-use replay comparisons.
- Launch materials: [LAUNCH.md](LAUNCH.md).
