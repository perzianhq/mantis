# Demo task for the video and README GIF

One real task, same prompt for both tools, shown side by side with an estimated replay token counter. Record on **Luna** (steadier across reruns than Haiku).

**Task:** `longlive-gutenberg-dickens-search` (from `long-live-v1`). On Project Gutenberg, run Advanced Search for author Charles Dickens, language English, LoC class PR. Inspect result page one, follow next to page two, then look up #98 and #1400 through separate Quick searches, report `eBook number | title | release date | LoC class`, and return to page two of the original search. About 10 to 35 tool calls, 40 s to 1.5 minutes.

## Figures (the video replays the median-by-input-tokens run of run 20261027: 250k tokens, 11 calls, 42 s vs 35 calls, 1.17M, 91 s; every run graded success)

The tree run's call 7 (`browser_click`) hit Playwright's 5000 ms action timeout. The replay cuts that 5 s wait from the tree's timeline and total (`cut` in `video/render/extract.mjs`), so the video shows 91.2 s instead of the logged 96.2 s; calls and tokens are unchanged. The video's final card says so.

Luna (`gpt-6-luna`, local). Mantis and tree ran in the same session (20261027), three runs each. The video replays run 3 of each approach, the median by input tokens (Mantis 212k / 250k / 304k, tree 633k / 1.17M / 1.25M):

| | Mantis | Tree (Playwright MCP style) | Change |
|---|---|---|---|
| Input tokens, replayed run (r3) | 249,752 | 1,166,463 | -79% |
| Wall time, replayed run (r3) | 42 s | 91 s (96 s logged, minus one 5 s click timeout) | -53% |
| Tool calls, replayed run (r3) | 11 | 35 | -69% |
| Input tokens, range over 3 runs | 211,872 to 303,548 | 632,662 to 1,250,898 | |
| Wall time, range over 3 runs | 37 to 57 s | 66 to 96 s | |
| Tool calls, range over 3 runs | 11 to 14 | 20 to 35 | |

Wall time is `timings.cliWallMs` (the md's "CLI wall" column; the md's "CLI execution" column is 0.4 to 0.7 s shorter: 41.8 s and 95.7 s for the replayed runs). The tree varies a lot between runs (20 to 35 calls); Mantis stays at 11 to 14 calls. Quote the range: **about 2x to 5x fewer input tokens, about half the time, about a third to a half of the calls.** Luna reports tokens only, so no dollar figure is claimed for it.

Earlier build (before the settle-timing changes), published run `long-live-v1-final-luna` and an independent rerun `long-live-v1-crosscheck-luna`. The video previously replayed the first column (Mantis run 2, tree run 1):

| | Mantis | Tree (Playwright MCP style) | Change |
|---|---|---|---|
| Input tokens, published | 291,952 | 733,231 | -60% |
| Input tokens, rerun | 289,972 | 1,123,795 | -74% |
| Wall time, published | 50 s | 73 s | -32% |
| Wall time, rerun | 47 s | 75 s | -37% |
| Tool calls, published | 10 | 22 | -55% |
| Tool calls, rerun | 14 | 29 | -52% |

Haiku 5.5 (`claude-haiku-5-5`), earlier build, is less steady on this task: Mantis 315k tokens published vs 417k on the rerun (the rerun took a longer path with a full-page read), tree 761k vs 738k.

| Haiku | Mantis | Tree | Change |
|---|---|---|---|
| Input tokens, published | 315,438 | 761,236 | -59% |
| Input tokens, rerun | 416,989 | 737,865 | -43% |
| Wall time, published | 63 s | 119 s | -47% |
| Wall time, rerun | 68 s | 91 s | -25% |
| Cost, published | $0.234 | $0.430 | -46% |
| Cost, rerun | $0.291 | $0.418 | -30% |

Sources: current Luna table `bench/results/long-live-v1-luna-speed-20261027.json` (Mantis) and `bench/results/long-live-v1-luna-tree-20261027.json` (tree), logs in `bench/results/agent-logs/` under the same names (`video/render/extract.mjs` reads them). Earlier-build and Haiku tables: `bench/results/long-live-v1-final-{luna,haiku}.json` (published) and `bench/results/long-live-v1-crosscheck-{luna,haiku}.json` (rerun): `totalInputTokens`, `toolCalls`, `costUsd`, `timings.cliWallMs`. Cost is the Claude CLI's `total_cost_usd`.

A Sol review of the commits since the headline run found no regression in tokens or latency: tool descriptions are identical, the new MCP instruction adds about 32 tokens, and the Haiku Dickens gap is a different agent path (more calls, one full read), not bigger tool output.

## Runner-up: `longlive-met-monet-search` (earlier build)

| Luna | Mantis | Tree | Change |
|---|---|---|---|
| Input tokens, published | 576,118 | 1,124,550 | -49% |
| Input tokens, rerun | 657,046 | 1,115,535 | -41% |
| Wall time, published | 94 s | 204 s | -54% |
| Wall time, rerun | 103 s | 158 s | -35% |

Haiku on the same task (published / rerun): tokens -59% / -69%, time -41% / -58%, cost -48% / -56%.

## Honesty note

This is a selected example from the 16 long tasks, picked for the demo because short tasks tie. Across all long-live-v1 tasks the medians are smaller: wall time -36% on both models, input tokens -29% (Luna) and -47% (Haiku) (fresh same-session tree rerun, 20261027). Say so in the caption. Full results and failures: `bench/RESULTS.md`.

## Recording tips

Fresh browser profile, same model, show the per-call token counter. Last frame, safe to claim for the replayed run: "less than half the time, over 4x fewer input tokens, about a third of the calls" (selected example; the medians above are the headline). Show exact final totals; label intermediate estimates.
