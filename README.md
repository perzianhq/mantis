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

Live-site set `live-v1` (v1.7): 30 real-site tasks, three runs per approach, judged by `gpt-6.1-sol`. Success out of 90 (average input tokens per run):

| Model | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| `deepseek-v4.1-flash` (Sarvam) | 88 (51.0k) | **90** (139.4k) | 89 (55.5k) |
| `gpt-6-luna` | **90** (91.5k) | **90** (123.1k) | 85 (122.7k) |
| `claude-haiku-5-5` | 88 (50.4k) | 86 (116.5k) | **89** (53.1k) |

Full tables and the task changelog: [bench/RESULTS.md](bench/RESULTS.md) and [bench/live-v1.md](bench/live-v1.md).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
