# Mantis: plan and progress

What Mantis is: [README.md](../README.md). Design: [APPROACH.md](APPROACH.md).
Benchmark commands, grading and the frozen real-site task plan: [bench/README.md](../bench/README.md).

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
fixed fixtures → seeded variants → coverage matrix → frozen live-site set → publish
```

| Phase | Run | Gate |
| --- | --- | --- |
| Fixed fixtures | Local forms, reading, tables, dialogs, SPA navigation, charts, iframes, and long flows. | Executable DOM/state oracle and near-miss tests. |
| Seeded variants | The same local workflows with generated content, ordering, and answers. | Record seed; oracle is derived from it. |
| Coverage matrix | Seeded cases for regions/long reading, virtual lists, forms, dense tables, charts/canvas, overlays/shadow DOM, SPA retries, and long workflows. | Coverage tag, oracle, near miss, and matched Mantis/tree/screenshot run. |
| Frozen live sites | Small reviewed, read-only public-site set for navigation, retrieval, comparison, and multi-page work. | Capture date, browser version and evidence; answer key where possible, judge only the rest. |
| Publish | Matched runs for Mantis, tree, and screenshot. | Per-task score, seed/trace, calls, latency, tokens, cost, and failures. |

Keep model, browser, retry policy, timeout, and token budget matched across approaches. Use fixed/seeded cases for code changes; run the live-site set only at milestones or after browser/tooling changes.

## Current sequence

1. Run build and focused free tests: diff, prose/action diff, fixture verification, offline analysis, real-site, and coverage.
2. Freeze the seeded local manifest and executable oracles.
3. Run the DeepSeek/Sarvam local baseline: **25 tasks × 3 approaches × 3 runs = 225**. Compare score, calls, p50/p90 latency, tokens, and cost against the prior seeded baseline; disclose harness/browser differences.
4. Freeze the local baseline. Do not tune fixtures further.
5. Add coverage-matrix fixtures, then establish the frozen read-only live-site set. No self-hosted-app stage is planned.

## Deferred work

- Semantic tool diagnostics with a shared rubric for Mantis, tree, and screenshot.
- Fallback coverage for headed `ask_human`, ECharts, and Highcharts.
- Chrome DevTools MCP and browser-use replay comparisons.
- Launch materials: [LAUNCH.md](LAUNCH.md).
