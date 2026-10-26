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

Mantis vs the accessibility tree (Playwright MCP) on public sites, medians, `gpt-6-luna` and `claude-haiku-5-5`:

**Long tasks** (16 tasks, 48 runs per cell):

| | Luna Mantis | Luna tree | Haiku Mantis | Haiku tree |
|---|---:|---:|---:|---:|
| Correct | **41/48** | 37/48 | **47/48** | 44/48 |
| Time | **50s** | 75s | **90s** | 135s |
| Input tokens | **262k** | 362k | **432k** | 746k |

**Short tasks** (30 tasks, 90 runs per cell):

| | Luna Mantis | Luna tree | Haiku Mantis | Haiku tree |
|---|---:|---:|---:|---:|
| Success | 89/90 | **90/90** | 89/90 | 89/90 |
| Input tokens (mean) | **87k** | 122k | **72k** | 142k |
| Time | 44s | **23s** | 45s | 43s |

Long tasks: about a third less time and 28-42% fewer input tokens, accuracy equal or better. Short tasks: accuracy within one task of the tree and 28-49% fewer tokens, but not faster (timings are being re-measured under cleaner conditions).

Judge is uncalibrated (79% agreement with deterministic keys), so model-judged rows are indicative; one short task was swapped after scoring. Screenshot baseline, local workflows, method and all caveats: [bench/RESULTS.md](bench/RESULTS.md).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
