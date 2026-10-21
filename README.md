<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Frozen `local-v2` scorecard: 48 code-graded fixture tasks, `deepseek-v4.1-flash` through Sarvam V2, three runs per approach (432 logical runs). Scores are a versioned offline regrade of the saved outputs after repairing the held-out answer contract and state oracle; this is a local-fixture result, not a general-model or live-site claim.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **135/144** | 134/144 | 128/144 |
| Median input tokens | **15.9k** | 28.4k | 42.2k |
| Median execution excl. limiter/retry wait | **12.7s** | 16.3s | 24.2s |
| Median end-to-end wall time | **63.3s** | 104.0s | 133.8s |
| Median cost estimate | **₹0.105** | ₹0.156 | ₹0.284 |

Mantis scored 93.8%, versus 93.1% for the tree and 88.9% for screenshots, with 44.2% fewer median input tokens than the tree and 62.4% fewer than screenshots. Execution excludes locally measured limiter/retry wait; wall time includes it. Method, regrade caveats, the historical v1 baseline, and pilot results: [bench/RESULTS.md](bench/RESULTS.md).

Next: freeze the separate live-site set. See the [evaluation plan](docs/PLAN.md#evaluation-plan).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
