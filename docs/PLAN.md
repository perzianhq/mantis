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

## Next steps

Eval pipeline (Sol review, 2026-10-17: deterministic checks carry the main score; judge only what has no executable oracle). Cheapest first:

1. **Grader hardening.** Stricter answer normalization (no correct token inside a wrong sentence; `18` must not match `18.5`; check state proves the end state, not just page load). Add contradiction, wrong-path and valid-alternative near-miss cases to `test/fixture-verification.test.ts`.
2. **Offline metrics from saved traces.** Tool-use (error/repeat/blocked-click rates, action postconditions) and information coverage (required facts present in tool output vs ignored by the model), from the 225 broad-run traces. Add cost per success including failed attempts.
3. **Seeded fixture variants and one self-hosted app.** Breaks the ceiling (tree is 75/75); only if Luna/Haiku runs don't separate the approaches.
4. **Frozen real-site set.** Reviewed answer keys (see item 6 below); judge only the unkeyed remainder, calibrated against human labels.

Deferred by that review: mandatory judging of every real-site run, the 20-deterministic/10-ambiguous split, broad judge calibration trials, the all-step tool judge below.

Mantis weak-spot fixes (Sol analysis of the 225-run table, 2026-10-17). Each needs a synthetic test with a near miss first, then 25 tasks x 3 runs. Protect 74/75 correct, median 4 calls and 10.9k input tokens; confirm on Luna/Haiku:

- **Prose in action diffs.** `src/diff.ts` indexes only text/headings, so added or changed paragraphs report "no visible change" (plans-pick, faq-refund, modal-delete). Do first. Verify on those three, then signup-validation, checkout-steps, menu-settings.
- **Shorter tool descriptions.** About 1k tokens of repeated schema overhead per run (chart-march). Measure offline first, then chart-march and the small interaction tasks.
- **`find` returns bounded row/following-paragraph context** (churned-max, feed-scroll). Test adjacent-row confusion.
- **Document `press("End")` for feeds** (feed-scroll took 6 scrolls vs the tree's 3). Check virtualized lists.
- **Explicit, bounded truncation recovery.** Render trims at 6k chars; capture stops at 3,000 nodes. Test deep-text pages.
- **Visual/canvas coverage tests** before changing any fallback policy.
- **Leave alone:** the longlist-item miss (model error) and the timing medians. Recheck both x5 under matched scheduling.

Also pending: Luna and Haiku confirmation runs of the fixture table.

5. **Tool judge (deferred).** Extend [offline tool diagnostics](../bench/README.md#tool-diagnostics)
   with semantic review using one rubric for Mantis, tree and screenshots:
   - Action: reported success without a page change, or a blocked valid click.
   - Perception: information visible on screen but missing from the output, versus present and ignored.
   - Errors: vague/wrong guidance, versus clear guidance the agent did not follow.

   Report tool-fault rate, silent failures, missed content and tool-versus-agent attribution.
   Use before/after evidence and a fixed rubric; this judge cannot be blind because output reveals
   the tool. Save tool-call traces beside results, including cloud runs.
6. **Frozen real-site eval.** Follow the [task and answer-key plan](../bench/README.md#real-site-tasks-blind-judge),
   with outcome and tool judging, 3 runs and per-task reporting. New failures become tasks; publish losses too.
7. **Launch.** GitHub release, demo and outreach: [LAUNCH.md](LAUNCH.md).

Later: fallback tools inside iframes; add Chrome DevTools MCP and browser-use to the token replay.

## Unverified coverage

The headed `ask_human` window needs a display; ECharts/Highcharts had no fixture coverage
(only Chart.js) in the original fallback implementation. Recheck before claiming coverage.
