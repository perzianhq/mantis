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
- `long-live-v1` follow-up: re-grade its published 16-task, 48-run-per-cell Luna and Haiku real-site result with reviewed deterministic keys, replacing the uncalibrated judge. Non-blocking.

### Before launch, remaining (moved up, 2026-10-25)
- [x] README opens with the GIF, install and a 3-line example.
- [x] [CONTRIBUTING.md](../CONTRIBUTING.md) and [CHANGELOG.md](../CHANGELOG.md). Issue templates were done earlier.
- [x] Re-run Haiku tree and screenshots on the same CLI build and machine as the Mantis re-run (local CLI 2.1.161), so the live-v1 token and latency columns become comparable. Mantis `src/` is frozen at `v0.1.6` (`059cccf`); since `70dbd5f` it only gained install changes and the MCP note, so Mantis rows stay valid. 180 Haiku runs (30 tasks x 3 x 2 approaches); Luna needs no re-run.
- [x] Replace the fragile `data-gov-climate` task (v1.8, live-v1 only) with EIA About; all 18 runs succeeded and the swap is disclosed beside the scores.

### Next: drop the judge, speed up Mantis (2026-10-26)
1. **Done: deterministic grading.** Drop the model judge for live-v1. Key the 10 state tasks, take the URL and text from the harness-captured final frame, and fail runs that end on an access-block page. Regrade both clean campaigns from saved evidence with no model calls, check every disagreement, and review the saved frames of every failure plus one passing frame per task. Both clean campaigns regraded offline: Luna Mantis 88, tree 86, screenshot 90; Haiku 90 / 88 / 88 of 90.
2. **Done: Mantis speed** (`15201a2`, `181ce0c`). Add per-phase timing. Fix the stale page after a navigating click, `type` with submit, and sequential `open()`. Ship the walker memoization fix. Each fix gets a fixture with a passing case and a near miss, and nothing site-specific in `src/`.
3. **Done: verify and commit.** tsc and tests, then commit to a feature branch in separate commits (graders, Mantis, docs).
4. **Done: rerun.** Mantis only, 180 runs (Luna 86/90, Haiku 90/90 by the deterministic keys; the model-free replay in [RESULTS.md](../bench/RESULTS.md) found no per-tool regression and `open` about 14% faster, not significant). The `type` request grace is measured on local fixtures: a pending typeahead request 2.9s to 1.1s, a 600ms rendered result still shown, plain input unchanged. Rerun all three approaches only if load makes the timings look unfair.
4b. **Done: Haiku rerun with the fixes.** Haiku Mantis 90/90, about 11% lower median wall time at equal tokens; ship as 0.1.8.
5. **Only if the gap remains.** Fewer double captures, and trimming the first-render tokens. Luna result-list hints only as a generic page-structure signal.

### Optional
- Add Claude's own browser tools (Claude in Chrome, built-in browser pane) as a fourth approach on a few long tasks. Unmeasured; Claude would be the agent, so it is not like-for-like with the Luna/Haiku rows.

### After launch
- ~~Add `upload` to the tool table in SETUP.md~~ (done).
- **0.2: canvas input.** A `draw`/pointer tool for canvas, WebGL and map elements: points on a 0-100 grid relative to a numbered canvas, run as mouse down, move and up, plus a grid overlay on `look` so the model can pick cells. Gap found in the stress pass (Excalidraw tools visible, no way to draw). Check what Playwright MCP's coordinate tools do before claiming a difference. Needs a fixture (canvas that records strokes) with a passing case and a near miss, then a small canvas/map task set.
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
8. After launch: build 0.2 canvas input (see "After launch" above), keep it to one small tool, and test it on a map and a drawing app before any claim. Ship 0.1.8 first; the README Limitations section says there is no coordinate input yet.

### Biggest risks
- Installs that fail on day one.
- Show HN finding a prompt-injection hole, or calling post-result task swaps cherry-picking.

Not verified in the review: whether the repo is public, npm Trusted Publishing setup, whether tests pass now, and `upload` path limits. Fresh install was checked on Linux (a clean directory, and a bare `node:22-slim` container): `mantis install`, `mantis read` and `mantis-mcp` work, and `--with-deps` is required on bare Linux.

## Deferred work

- Semantic tool diagnostics with a shared rubric for Mantis, tree, and screenshot.
- Fallback coverage for headed `ask_human`, ECharts, and Highcharts.
- Chrome DevTools MCP and browser-use replay comparisons.
- Launch materials: [LAUNCH.md](LAUNCH.md).
