<p align="center"><img src="docs/img/banner.svg" alt="mantis" width="100%"></p>

**Lets AI agents browse the web as short, numbered text instead of screenshots.**

[perzian.dev/mantis](https://perzian.dev/mantis/) · by [Perzian](https://perzian.dev)

It works with Claude Code, Codex, Cursor or your own agent as an MCP server. [Install in two commands](docs/SETUP.md#install).

## How it works

<p align="center"><img src="docs/img/flow.svg" alt="Agent sends open/click to Mantis; Mantis reads the page in Chromium, numbers each control and returns only what changed; CAPTCHA, 2FA and payment go to you" width="100%"></p>

## What the agent sees

<p align="center"><img src="docs/img/sees.svg" alt="A shop page with a cookie popup becomes 8 numbered lines; after click #3 only the changes come back" width="100%"></p>

## Results

Early numbers, and they come from Mantis's own test pages: 25 local tasks graded by code, one model (`deepseek-v4.1-flash`), 3 runs each.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | 74/75 | 75/75 | 71/75 |
| Median tool calls | 4 | 6 | 10 |
| Median input tokens | 10.9k | 22.8k | 18.3k |
| Median time | 16.5s | 31.9s | 39.6s |

All three mostly succeed, so the difference is cost and speed: Mantis used about half the median input tokens of the tree and about a sixth of the screenshots' total cost. Real-site accuracy is not yet measured on a reviewed set. Method and caveats: [bench/RESULTS.md](bench/RESULTS.md).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
