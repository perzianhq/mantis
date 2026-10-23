<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Same tasks, same pass criteria, three ways to browse. Mantis vs the accessibility tree (Playwright MCP) vs screenshots.

**Long multi-step workflows** (`live-long-fixtures`: 16 local tasks with in-page hazards, 3 runs per approach, code-graded). Score is out of 48; time is mean agent execution per run.

| Model | | Mantis | Accessibility tree | Screenshots |
|---|---|---:|---:|---:|
| `gpt-6-luna` | Correct | **48/48** | **48/48** | 42/48 |
| | Time | **103s** | 132s | 163s |
| | Input tokens | **17.3M** | 28.0M | 31.0M |
| | Tool calls | **1190** | 1685 | 2774 |
| `claude-haiku-5-5` | Correct | **48/48** | **48/48** | **48/48** |
| | Time | **42s** | 59s | 64s |
| | Input tokens | **12.1M** | 18.7M | 27.1M |
| | Tool calls | **1501** | 1827 | 2876 |

**Real sites** (`live-v1` v1.7: 30 tasks, 3 runs per approach, judged blind). Success out of 90:

| Model | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| `gpt-6-luna` | 89 | **90** | 85 |
| `claude-haiku-5-5` | 87 | 86 | **89** |

**Net:** accuracy is on par with the tree (within 1 run of 90 on real sites, equal on long workflows), at roughly 30% fewer tokens and calls on long tasks.

### Where Mantis is better

- **Long workflows.** Same accuracy as the tree, with 22–29% less time, 35–38% fewer input tokens and 18–29% fewer tool calls, because each step returns only what changed.
- **Versus screenshots.** Fewer tokens and calls everywhere; Luna also missed 6 of 48 where Mantis and the tree did not.
- **Short tasks.** Roughly a tie with the tree. The edge grows with task length.

Method and caveats: [bench/RESULTS.md](bench/RESULTS.md).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
