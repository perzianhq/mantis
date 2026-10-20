# Mantis: plan and progress

What Mantis is: [README.md](../README.md). Design: [APPROACH.md](APPROACH.md).
Benchmark commands and grading: [bench/README.md](../bench/README.md).

## Code layout

```
Agent (Claude, Cursor, …)
      │  MCP (stdio)
MCP server      src/server.ts      the tools
Translator      src/translate.ts   cleanup, numbering, regions, text format
                src/diff.ts        what changed after an action
                src/memory.ts      site memory
Page capture    src/capture/       injected DOM walker → raw nodes
Fallbacks       src/fallback/      media, data, ocr, look, ask_human
Browser         src/browser.ts     Playwright (the library, not Playwright MCP)
```

Stack: TypeScript (ESM, Node ≥20), Playwright, `@modelcontextprotocol/sdk`, zod, vitest.

## Evaluation plan

```text
frozen local-v1 (complete) → local-v2 implementation / verification → separate frozen live-site set → publish
```

| Phase | Run | Gate |
| --- | --- | --- |
| Local-v1 — complete | Frozen 25-task seeded local baseline, 3 approaches × 3 repeats = 225 logical runs. | Preserve the [manifest](../bench/manifests/local-v1.json) and [final scorecard](../bench/RESULTS.md#local-tasks-sarvam-final-seeded-baseline). |
| Local-v2 — implementation / verification | Implemented 48-case framework: eight domains × six cases, using three behavior families × two materially different structural cases per domain. No scored v2 result exists yet. | Verify seeded structural variants, executable state oracles, passing/near-miss tests, and held-out discipline; then freeze and run matched Mantis/tree/screenshot evaluations. See the [coverage contract](../bench/manifests/local-v2-plan.md). |
| Frozen live sites — later | Separate reviewed, read-only public-site set for navigation, retrieval, comparison, and multi-page work. | Preflight the [30-slot candidate pool](../bench/manifests/live-site-candidates.md), then freeze explicit rows with date/browser/evidence; reviewed deterministic validators where complete, blind judge for the rest. |
| Publish | Matched runs for Mantis, tree, and screenshot. | Per-task score, seed/trace, calls, latency, tokens, cost, and failures. |

Keep model, browser, retry policy, timeout, and token budget matched across approaches. Publish each suite separately; never combine local-v1, local-v2, and live-site scores. Run the live-site set only at milestones or after browser/tooling changes. No self-hosted-app stage is planned.

## Current sequence

1. Preserve local-v1 fixtures, tasks, graders, seed, and results; the final 225-run baseline is complete.
2. The local-v2 fixtures and runner selection are implemented without modifying v1. Finish free oracle/near-miss verification, then freeze its case/seed manifest; no v2 score is published yet.
3. Run the frozen 48 cases × 3 approaches × 3 repeats = 432 scored runs per model. Keep held-out cases out of tuning.
4. Establish the separate frozen live-site set using the [real-site plan](../bench/README.md#real-site-tasks-blind-judge).

## Deferred work

- Semantic tool diagnostics with a shared rubric for Mantis, tree, and screenshot.
- Fallback coverage for headed `ask_human`, ECharts, and Highcharts.
- Chrome DevTools MCP and browser-use replay comparisons.
- Launch materials: [LAUNCH.md](LAUNCH.md).
