<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

<p align="center"><img src="video/mantis-demo.gif" alt="Side-by-side replay of the same task with Mantis and Playwright MCP: Mantis finishes in 10 calls and about 292k input tokens, Playwright MCP in 22 calls and about 733k" width="100%"></p>

*One real task (Luna, logged runs replayed): about a third less time, over 2x fewer input tokens, about half the calls. This is a selected example from 16 long tasks; medians across all 16 are in [Results](#results). [Full video](video/mantis-demo.mp4).*

Security and threat model: [SECURITY.md](SECURITY.md).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Same tasks, same pass criteria, three ways to browse: Mantis, the accessibility tree (Playwright MCP) and screenshots. Models: `gpt-6-luna` and `claude-haiku-5-5`. Full tables, method and caveats: [bench/RESULTS.md](bench/RESULTS.md).

**Long local workflows** (`long-local-v1`: 16 fixture tasks, 3 runs each, code-graded). Correct out of 48, Mantis / tree / screenshots: Luna 48 / 48 / 42, Haiku 48 / 48 / 48. Mantis uses 22-29% less time and 35-38% fewer input tokens than the tree.

**Long real-site workflows** (`long-live-v1`: 16 tasks on public sites, 48 runs per cell, blind judge). Medians over all runs, failures included. Mantis vs tree:

| | Luna Mantis | Luna tree | Haiku Mantis | Haiku tree |
|---|---:|---:|---:|---:|
| Correct | **41/48** | 37/48 | **47/48** | 44/48 |
| Time | **50s** | 75s | **90s** | 135s |
| Input tokens | **262k** | 362k | **432k** | 746k |
| Tool calls | **18** | 25 | **26** | 32 |

**Short real-site tasks** (`live-v1` v1.7: 30 tasks, 90 runs per cell, blind judge or validators):

| | Luna Mantis | Luna tree | Luna shots | Haiku Mantis | Haiku tree | Haiku shots |
|---|---:|---:|---:|---:|---:|---:|
| Success /90 | 89 | **90** | 86 | 87 | 87 | **89** |
| Tool calls (median) | **4** | **4** | 6 | **4** | 7 | 8 |
| Input tokens (mean) | **88k** | 123k | 123k | 78k* | 117k* | 53k* |
| Tool output (median chars) | 9.3k | 54.9k | **0.1k** | 9.6k | 29.0k | **0.6k** |
| Time (median) | 44s | **23s** | 29s | 46s* | **18s*** | **18s*** |

\*Haiku tokens and time are not comparable across columns: tree and screenshot runs used a different CLI build and machine than the later Mantis re-run. The screenshot baseline is our own minimal tool, not a product's.

**Reading it:**
- **Long tasks:** about a third less time, 28-42% fewer input tokens, 19-28% fewer calls, with accuracy equal or better.
- **Short tasks:** accuracy ties; Mantis returns about 3-6x less page text than the tree, but is not faster. The Mantis rows are a later re-run, and the original Haiku run had equal medians across approaches (17.5-17.9s). The slowdown's cause is not isolated.
- **Luna's lead is narrow:** 3 of its 4 net wins come from one iframe task where Playwright MCP misses frame contents ([playwright#43628](https://github.com/microsoft/playwright/issues/43628)). Without it: 38/45 vs 37/45.
- **Haiku's lead (+3):** 2 from the Internet window/frames task, 1 from one `gutenberg-gothic` run. One Mantis fix landed after a failure (that cell was rerun).
- **The judge is not calibrated:** 79% agreement and 6/48 false successes against deterministic keys, so treat model-judged rows as indicative ([details](bench/RESULTS.md#long-real-site-tasks-long-live-v1)).
- **Scope:** read/navigate tasks on public sites, two models. The long-live-v1 task set was adjusted before scoring; swaps are listed in [bench/RESULTS.md](bench/RESULTS.md).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
