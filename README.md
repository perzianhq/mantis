<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Frozen `local-v1` baseline: 25 code-graded fixture tasks, `deepseek-v4.1-flash` through Sarvam V2, three runs per approach (225 logical runs). This is a local-fixture result, not a general-model or live-site claim.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **75/75** | **75/75** | 70/75 |
| Median input tokens | **11.1k** | 22.9k | 27.7k |
| Median clean execution | **8.14s** | 11.59s | 16.45s |
| Median end-to-end wall time | **58.56s** | 66.83s | 121.07s |
| Median cost estimate | **₹0.08** | ₹0.16 | ₹0.22 |

Mantis reached the same local correctness as the tree with 52.9% fewer median input tokens and 31.6% lower median clean execution time. Screenshot had one visual-read miss and four 100-step budget exhaustions. “Clean execution” excludes locally measured quota/retry wait; wall time includes it. Method, caveats and older pilot results: [bench/RESULTS.md](bench/RESULTS.md).

Next: a separate planned 48-case `local-v2` coverage suite, then a separate frozen live-site set. See the [evaluation plan](docs/PLAN.md#evaluation-plan).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
