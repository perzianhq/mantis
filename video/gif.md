# Demo task for the video and README GIF

One real task, same prompt for both tools, shown side by side with an estimated replay token counter. Record on **Luna** (steadier across reruns than Haiku).

**Task:** `longlive-gutenberg-dickens-search` (from `long-live-v1`). On Project Gutenberg, run Advanced Search for author Charles Dickens, language English, LoC class PR. Inspect result page one, follow next to page two, then look up #98 and #1400 through separate Quick searches, report `eBook number | title | release date | LoC class`, and return to page two of the original search. About 11 to 30 tool calls, 1 to 2 minutes.

## Figures (the video replays the middle run: 292k tokens, 10 calls, 50 s vs 22 calls, 733k, 73 s; every run graded success)

Luna (`gpt-6-luna`, local). Published run and an independent rerun on the same commit:

| | Mantis | Tree (Playwright MCP style) | Change |
|---|---|---|---|
| Input tokens, published | 291,952 | 733,231 | -60% |
| Input tokens, rerun | 289,972 | 1,123,795 | -74% |
| Wall time, published | 50 s | 73 s | -32% |
| Wall time, rerun | 47 s | 75 s | -37% |
| Tool calls, published (the run replayed in the video) | 10 | 22 | -55% |
| Tool calls, rerun | 14 | 29 | -52% |

Mantis is stable across the two runs (about 290k tokens, 47-50 s). The tree varies more (733k to 1.12M tokens). Quote the range: **about 2.5x to 4x fewer input tokens, about a third less time, about half the calls.** Luna reports tokens only, so no dollar figure is claimed for it.

Haiku 5.5 (`claude-haiku-5-5`) is less steady on this task: Mantis 315k tokens published vs 417k on the rerun (the rerun took a longer path with a full-page read), tree 761k vs 738k.

| Haiku | Mantis | Tree | Change |
|---|---|---|---|
| Input tokens, published | 315,438 | 761,236 | -59% |
| Input tokens, rerun | 416,989 | 737,865 | -43% |
| Wall time, published | 63 s | 119 s | -47% |
| Wall time, rerun | 68 s | 91 s | -25% |
| Cost, published | $0.234 | $0.430 | -46% |
| Cost, rerun | $0.291 | $0.418 | -30% |

Sources: `bench/results/long-live-v1-final-{luna,haiku}.json` (published) and `bench/results/long-live-v1-crosscheck-{luna,haiku}.json` (rerun): `totalInputTokens`, `toolCalls`, `costUsd`, `timings.cliWallMs`. Cost is the Claude CLI's `total_cost_usd`.

A Sol review of the commits since the headline run found no regression in tokens or latency: tool descriptions are identical, the new MCP instruction adds about 32 tokens, and the Haiku Dickens gap is a different agent path (more calls, one full read), not bigger tool output.

## Runner-up: `longlive-met-monet-search`

| Luna | Mantis | Tree | Change |
|---|---|---|---|
| Input tokens, published | 576,118 | 1,124,550 | -49% |
| Input tokens, rerun | 657,046 | 1,115,535 | -41% |
| Wall time, published | 94 s | 204 s | -54% |
| Wall time, rerun | 103 s | 158 s | -35% |

Haiku on the same task (published / rerun): tokens -59% / -69%, time -41% / -58%, cost -48% / -56%.

## Honesty note

This is a selected example from the 16 long tasks, picked for the demo because short tasks tie. Across all long-live-v1 tasks the medians are smaller: wall time -33% on both models, input tokens -28% (Luna) and -42% (Haiku), and total Haiku cost -26%. Say so in the caption. Full results and failures: `bench/RESULTS.md`.

## Recording tips

Fresh browser profile, same model, show the per-call token counter. Last frame, safe to claim: "about a third less time, over 2x fewer input tokens, about half the calls". Show exact final totals; label intermediate estimates.
