<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Frozen `local-v2-development` baseline: 32 code-graded fixture tasks, `deepseek-v4.1-flash` through Sarvam V2, three runs per approach (288 logical runs). This covers the development split of the planned 48-case v2 suite; it is a local-fixture result, not a general-model or live-site claim.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **93/96** | 92/96 | 92/96 |
| Median input tokens | **15.8k** | 34.6k | 44.2k |
| Median execution excl. limiter/retry wait | **11.4s** | 15.4s | 22.0s |
| Median end-to-end wall time | **64.1s** | 106.1s | 149.6s |
| Median cost estimate | **₹0.114** | ₹0.187 | ₹0.303 |

Mantis scored 96.9%, versus 95.8% for both baselines, with 54.2% fewer median input tokens than the tree and 64.2% fewer than screenshots. Execution excludes locally measured limiter/retry wait; wall time includes it. Method, caveats, the historical v1 baseline, and pilot results: [bench/RESULTS.md](bench/RESULTS.md).

Next: freeze the complete 48-case v2 selector and run the matched scorecard. After that, freeze the separate live-site set. See the [evaluation plan](docs/PLAN.md#evaluation-plan).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
