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

Mantis vs the accessibility tree (Playwright MCP) on public sites, `gpt-6-luna` and `claude-haiku-5-5`. Every cell is a per-run median; time is end-to-end wall time per run:

**Long tasks** (correct: 14 keyed tasks, 42 runs per cell; medians: all 16 tasks, 48 runs per cell; both approaches run in the same session):

| | Luna Mantis | Luna tree | Haiku Mantis | Haiku tree |
|---|---:|---:|---:|---:|
| Correct | **35/42** | 34/42 | 40/42 | 40/42 |
| Input tokens (median) | **244k** | 345k | **268k** | 506k |
| Tool calls (median) | **17** | 24 | **19** | 30 |
| Time (median) | **42s** | 66s | **54s** | 85s |

**Short tasks** (30 tasks, 90 runs per cell; tree and screenshot columns are the earlier 20261026 run):

| | Luna Mantis | Luna tree | Luna screenshot | Haiku Mantis | Haiku tree | Haiku screenshot |
|---|---:|---:|---:|---:|---:|---:|
| Correct | 88/90 | 86/90 | **90/90** | **90/90** | 88/90 | 88/90 |
| Input tokens (median) | **64k** | 99k | 104k | 38k | 88k | **33k** |
| Tool calls (median) | **3** | 4 | 7 | **3** | 5 | 6 |
| Time (median) | **16s** | 31s | 35s | 19s | 30s | **23s** |

Long tasks: accuracy within one run, 29-47% fewer input tokens, 29-37% fewer calls and about a third less time than the tree. Short tasks: accuracy equal or better than the tree, 35-57% fewer input tokens. Short-task times compare a newer Mantis build with the earlier tree and screenshot run, so treat that gap as indicative. Screenshots score 2 runs higher on Luna but use more tokens and time there; on Haiku they use fewer tokens.

Scores come from deterministic answer keys on the final page state. Two long iframe/tab tasks can't be keyed and are left out of the long-task counts. Method, screenshot baseline and caveats: [bench/RESULTS.md](bench/RESULTS.md).

## Limitations

- No canvas input: canvas, WebGL, maps and drawing apps are described only as canvas, with no coordinate click or draw tool.
- Login and bot walls need `ask_human`, which needs a display.
- Benchmarked only on read, navigate and form-fill tasks on public sites, with two models. The screenshot baseline is this project's own tool, and a few tasks were swapped after results ([disclosed](bench/RESULTS.md)).
- Page content is untrusted data; see [SECURITY.md](SECURITY.md).
- Small v0.1.x beta.

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
