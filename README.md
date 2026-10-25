<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

```bash
npx -y -p mantis-browser mantis install
claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp
npx -y -p mantis-browser mantis read https://example.com   # try it without an agent
```

Windows, Linux servers and other agents: [SETUP](docs/SETUP.md#install).

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

**Short real-site tasks** (`live-v1` v1.8: 30 tasks, 90 runs per cell, blind judge or validators):

| | Luna Mantis | Luna tree | Luna shots | Haiku Mantis | Haiku tree | Haiku shots |
|---|---:|---:|---:|---:|---:|---:|
| Success /90 | 89 | **90** | 86 | 89 | 89 | **90** |
| Tool calls (median) | **3** | 4 | 6 | **4** | 7 | 7.5 |
| Input tokens (mean) | **87k** | 122k | 122k | **72k** | 142k | 75k |
| Tool output (median chars) | 9.2k | 54.9k | **0.1k** | 9.5k | 27.0k | **0.1k** |
| Time (median) | 44s | **23s** | 28s | 45s | 43s | **33s** |

Haiku tree and screenshot runs were redone on the same CLI build (2.1.161, local) as the Mantis re-run, so tokens are comparable; their times come from a 16-way parallel run and may be inflated. The screenshot baseline is our own minimal tool, not a product's.

**Reading it:**
- **Long tasks:** about a third less time, 28-42% fewer input tokens, 19-28% fewer calls, with accuracy equal or better.
- **Short tasks:** accuracy is within one task of the tree on both models (Luna 89 vs 90, Haiku 89 vs 89; Luna screenshots trail at 86, Haiku screenshots lead at 90); Mantis returns about 3-6x less page text than the tree and uses 28-49% fewer input tokens (Haiku screenshots are close, 75k vs 72k), but is not faster: on Haiku it is about even with the tree (45s vs 43s) and slower than screenshots (33s).
- **Task swap:** v1.8 replaced data-gov-climate with EIA About after scoring. It removed 7 Haiku failures (Mantis 2, tree 3, screenshots 2) and none for Luna, so Haiku was 87 / 86 / 88 in v1.7 and is 89 / 89 / 90 now; Mantis no longer leads the tree on Haiku.
- **The judge is not calibrated:** 79% agreement and 6/48 false successes against deterministic keys, so treat model-judged rows as indicative ([details](bench/RESULTS.md#long-real-site-tasks-long-live-v1)).
- **Scope:** read/navigate tasks on public sites, two models; live-v1 swapped one task (data-gov-climate to eia-about) in v1.8. The long-live-v1 task set was adjusted before scoring; swaps are listed in [bench/RESULTS.md](bench/RESULTS.md) and [bench/live-v1.md](bench/live-v1.md#changelog-and-disclosures).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
