# Demo task for the video and README GIF

One real task, same prompt for both tools, shown side by side with an estimated replay token counter. Record on **Luna** (steadier across reruns than Haiku).

**Task:** `longlive-gutenberg-dickens-search` (from `long-live-v1`). On Project Gutenberg, run Advanced Search for author Charles Dickens, language English, LoC class PR. Inspect result page one, follow next to page two, then look up #98 and #1400 through separate Quick searches, report `eBook number | title | release date | LoC class`, and return to page two of the original search. About 10 to 35 tool calls, 40 s to 1.5 minutes.

## Figures (the video replays each tool's median-by-input-tokens run of 5, run 20261104: 238k tokens, 11 calls, 55 s vs 887k, 25 calls, 103 s; all 10 runs graded success)

Luna (`gpt-6-luna`, local). Mantis and tree ran in the same session (`dickens-video-luna-20261104`), five runs each, both run 3 replayed. Neither replayed run hit a timeout; the tree run has one failed click (no matching element), kept as logged.

| | Mantis | Tree (Playwright MCP style) | Change |
|---|---|---|---|
| Input tokens, replayed run (r3) | 238,210 | 887,347 | -73% |
| Wall time, replayed run (r3) | 54.6 s | 103.4 s | -47% |
| Tool calls, replayed run (r3) | 11 | 25 | -56% |
| Input tokens, range over 5 runs | 219,060 to 247,030 | 753,977 to 1,044,454 | |
| Wall time, range over 5 runs | 43.8 to 58.8 s | 88.2 to 103.4 s | |
| Tool calls, range over 5 runs | 11 to 12 | 21 to 29 | |

Wall time is `timings.cliWallMs`. The replayed tree run is the median by tokens but the slowest of the five (median 98.1 s); Mantis run 3 is the median on all three measures. Quote the range: **3-5x fewer input tokens, about half the time, less than half the calls.** Luna reports tokens only, so no dollar figure is claimed for it.

Same-build Haiku rerun (`dickens-video-haiku-20261103`, 5 runs each, not used for the video): median by tokens Mantis 409k / 43 calls / 146 s vs tree 933k / 43 calls / 237 s. Gutenberg's search took over 5 s that night; Haiku on Mantis treated the click's "navigation did not finish in time" error as a failure and restarted the search about 7 times.

Previous video (run 20261027, 3 runs each, median by tokens): Mantis 249,752 / 11 calls / 42 s vs tree 1,166,463 / 35 / 96 s; that tree run included one 5 s click timeout.

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

Sources: current Luna table `bench/results/dickens-video-luna-20261104.json`, logs in `bench/results/agent-logs/dickens-video-luna-20261104/` (`video/render/extract.mjs` reads them). Earlier-build and Haiku tables: `bench/results/long-live-v1-final-{luna,haiku}.json` (published) and `bench/results/long-live-v1-crosscheck-{luna,haiku}.json` (rerun): `totalInputTokens`, `toolCalls`, `costUsd`, `timings.cliWallMs`. Cost is the Claude CLI's `total_cost_usd`.

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

Fresh browser profile, same model, show the per-call token counter. Last frame, safe to claim for the replayed run: "about half the time, over 3.5x fewer input tokens, less than half the calls" (selected example; the medians above are the headline). Show exact final totals; label intermediate estimates.
