<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Frozen `local-v2.1` scorecard: 54 code-graded fixture tasks, `deepseek-v4.1-flash` through Sarvam V2, three runs per approach (486 logical runs). This is a local-fixture result, not a general-model or live-site claim.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **159/162** | 157/162 | 150/162 |
| Median input tokens | **15.7k** | 26.8k | 31.6k |
| Median active model-request time | **11.1s** | 13.1s | 20.4s |
| Median agent execution excl. limiter/retry wait | **13.1s** | 15.9s | 22.9s |
| Median end-to-end wall time | **63.8s** | 89.3s | 122.9s |
| Median cost estimate | **₹0.099** | ₹0.143 | ₹0.242 |

Mantis scored 98.1%, versus 96.9% for the tree and 92.6% for screenshots, with 41.6% fewer median input tokens than the tree and 50.4% fewer than screenshots. Execution excludes locally measured limiter/retry wait; wall time includes it. Method, audit caveats, and historical baselines: [bench/RESULTS.md](bench/RESULTS.md).

Frozen live-site set `live-v1` (30 real-site tasks, same model, three runs per approach, judged by a different model): Mantis 85/90, tree 88/90, screenshots 89/90. Mantis is slightly behind on success here (its misses are mostly USGS, where all approaches struggled), and it used far fewer input tokens than the tree on the v1.5 set (about 63% fewer). One task was swapped from IMDb to TMDB after IMDb's human-verification gate blocked Mantis and screenshots' plain headless launch but not the tree baseline, whose Playwright MCP hides the automation signal by default; see [bench/RESULTS.md](bench/RESULTS.md). Sarvam only, not a Luna/Haiku claim; the catalog was revised after seeing results, as disclosed there. See the [evaluation plan](docs/PLAN.md#evaluation-plan).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
