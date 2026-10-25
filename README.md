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

**Long multi-step workflows** (`long-local-v1`: 16 local tasks with in-page hazards, 3 runs per approach, code-graded). Score is out of 48; time is mean agent execution per run.

**Headline (Mantis / tree / screenshots):** Luna **48/48 / 48/48 / 42/48**; Haiku **48/48 / 48/48 / 48/48**. Mantis is 22–29% faster with 35–38% fewer input tokens than the tree.

Full table: [bench/RESULTS.md](bench/RESULTS.md)

**Real sites** (`live-v1` v1.7: 30 tasks, 3 runs per approach, judged blind). Success out of 90:

| Model | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| `gpt-6-luna` | 89 | **90** | 85 |
| `claude-haiku-5-5` | 87 | 86 | **89** |

**Long real-site workflows** (`long-live-v1`: 16 tasks on public sites, 3 runs per approach, judged blind, medians over all 48 runs, failures included). Mantis vs the accessibility tree:

| Model | | Mantis | Accessibility tree |
|---|---|---:|---:|
| `gpt-6-luna` | Correct | **41/48** | 37/48 |
| | Time | **50s** | 75s |
| | Input tokens | **262k** | 362k |
| | Tool calls | **18** | 25 |
| `claude-haiku-5-5` | Correct | **47/48** | 45/48 |
| | Time | **90s** | 135s |
| | Input tokens | **432k** | 746k |
| | Tool calls | **26** | 32 |

**Net:** Accuracy is on par with the tree or slightly better. On long real-site tasks Mantis is about a third faster at the median with 28–42% fewer input tokens. The accuracy gap is small and partly explained: three of Luna's four net wins come from one task where Playwright MCP does not read iframe contents ([playwright#43628](https://github.com/microsoft/playwright/issues/43628)), and one of Haiku's two follows a Mantis fix made after that failure (rerun of that one cell, the rest not rerun). The blind judge has not passed its calibration gate: an audit against the deterministic answer keys gave 79% agreement and 6/48 false successes, partly from a Project Gutenberg form quirk and process rules (on-site search) that final state cannot show, so treat the model-judged rows as indicative ([details](bench/RESULTS.md)). The long real-site task set was adjusted before scoring; the swaps are listed in [bench/RESULTS.md](bench/RESULTS.md). Accuracy claims cover read/navigate tasks on public sites with Luna and Haiku. The screenshot baseline is our own minimal tool, not a product's.

### Where Mantis is better

- **Long workflows.** Same accuracy as the tree, with 22–29% less time, 35–38% fewer input tokens and 18–29% fewer tool calls, because each step returns only what changed.
- **Versus screenshots.** Fewer tokens and calls everywhere; Luna also missed 6 of 48 where Mantis and the tree did not.
- **Long real sites.** The time and token savings hold on public sites: about a third less time and 28–42% fewer input tokens at the median.
- **Short tasks.** Roughly a tie with the tree. The edge appears once tasks run to many steps.

Method and caveats: [bench/RESULTS.md](bench/RESULTS.md).

## Learn more

- [How it works in detail](docs/APPROACH.md)
- [Claude skill](skill/README.md): teaches Claude how to read Mantis output
- [Install, configuration and tool reference](docs/SETUP.md)
- [Re-running the benchmarks](bench/README.md)

## License

MIT
