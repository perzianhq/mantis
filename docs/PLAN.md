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
3. **Coverage matrix.** Expand deterministic seeded fixtures across the interaction patterns agents actually face: long reading and regions; infinite scroll, pagination and virtualized lists; validation and multi-step forms; dense admin tables; charts/SVG/canvas; modals, shadow DOM and nested menus; SPA loading/retries; and long workflows. Every new case needs an executable oracle plus a near-miss.
4. **Frozen real-site set.** Add a small, reviewed, read-only set after the coverage matrix. Include public docs/search, data-heavy pages, dynamic navigation, comparison, and multi-page retrieval. Capture date, evidence and browser version; use answer keys where possible and judge only the genuinely unkeyed remainder.

### Evaluation ladder

```text
Fixed fixtures
  → seeded fixture variants
  → coverage matrix
  → frozen live-site set
  → publish benchmark
```

| Stage | Cases | Where it runs | What is checked |
| --- | --- | --- | --- |
| Fixed fixtures | Forms, lookup/reading, tables and pagination, dialogs, SPA navigation, dynamic content, charts, iframes, and long shop/admin/onboarding flows. Include wrong-row, partial-state, and stale-state near misses. | Existing local fixture server; developer machine and CI. | Executable DOM/state oracle. Fast regression suite; no network. |
| Seeded variants | Same workflows, but generated product/customer names, prices, IDs, row order, wording, pagination size, and correct answer. | Local fixture server and CI; record the seed per result. | Oracle derived from that seed. Ensures tools/models read the page rather than rely on a fixed answer. |
| Coverage matrix | Seeded tasks spanning reading/regions, infinite feeds and virtual lists, forms, dense tables, charts, overlays/shadow DOM, SPA states, and long workflows. Include one clear failure-mode or near-miss per capability. | Existing local fixture server and CI. | Executable state/answer oracle, coverage tag, and matched Mantis/tree/screenshot run. |
| Frozen live-site set | Read-only navigation, retrieval, comparison, and multi-page tasks on public sites. No account changes, purchases, invitations, or irreversible actions. | A scheduled/manual networked benchmark run; capture date, URL, page evidence, model, and browser version. | Reviewed answer key where possible; human/judge only for genuinely unkeyed outcomes. |
| Publish benchmark | Matched runs of Mantis, tree, and screenshot approaches across the preceding stages. | Reproducible local/CI commands plus documented live-site procedure. | Per-task results, seeds/image digests, raw traces, costs, time, tool calls, and failures—not just an aggregate score. |

Run all approaches with the same model, browser, retry policy, timeout, and token budget. Start with fixed/seeded cases for every code change; run the frozen live-site suite at milestone releases or after browser/tooling changes.

### Current execution plan (after `5feb975` hardening)

Use **DeepSeek v4.1 Flash through Sarvam only** for the fresh local baseline. The historical 225-run set predates persisted terminal evidence, so repeat the same model first: it isolates the effect of the hardening. A second Sarvam model adds a variable without closing that evidence gap. Treat Sarvam credits as a ceiling, not a target.

1. **Free gate:** run the build plus focused `diff`, `prose-diff`, `actions-diff`, `fixture-verification`, `offline-analysis`, `realsite`, and `coverage` tests. Regenerate the saved offline reports. Do not spend model credits unless all pass.
2. **Paid smoke:** run DeepSeek on `plans-pick`, `faq-refund`, `modal-delete`, `long-shop`, `long-admin`, and `long-onboard` with Mantis, tree, and screenshot: **6 tasks × 3 approaches × 1 run = 18 runs**. Inspect full replies, attempt IDs, terminal fixture evidence, costs including failed attempts, and traces before promotion.
3. **Frozen seeded baseline:** only if the smoke evidence is usable and infrastructure is sound, generate one held-out seeded version of each of the 25 local tasks, freeze the seed manifest and executable oracles, then run **25 seeded tasks × 3 approaches × 3 runs = 225 runs** with the same DeepSeek configuration. Do not duplicate the already-published fixed-fixture 225. Keep model failures; repair infrastructure failures before starting a fresh, separately named dataset.
4. **Final DeepSeek comparison:** after approved harness/tool changes, rerun the same seeded **25 tasks × 3 approaches × 3 runs = 225 runs** on the frozen configuration. Compare score, calls, p50/p90 latency, tokens, and cost with the earlier seeded table; disclose browser/harness differences.
5. **Expand coverage, then live sites:** add coverage-matrix fixture cases first. Next run a small frozen, read-only live-site set. Do not add self-hosted apps to the roadmap.

Deferred by that review: mandatory judging of every real-site run, the 20-deterministic/10-ambiguous split, broad judge calibration trials, the all-step tool judge below.

Mantis weak-spot fixes (Sol analysis of the 225-run table, 2026-10-17). Each needs a synthetic test with a near miss first, then matched DeepSeek seeded runs. Protect correctness and compare calls, latency, tokens and cost:

- **Prose in action diffs.** `src/diff.ts` indexes only text/headings, so added or changed paragraphs report "no visible change" (plans-pick, faq-refund, modal-delete). Do first. Verify on those three, then signup-validation, checkout-steps, menu-settings.
- **Shorter tool descriptions.** About 1k tokens of repeated schema overhead per run (chart-march). Measure offline first, then chart-march and the small interaction tasks.
- **`find` returns bounded row/following-paragraph context** (churned-max, feed-scroll). Test adjacent-row confusion.
- **Document `press("End")` for feeds** (feed-scroll took 6 scrolls vs the tree's 3). Check virtualized lists.
- **Explicit, bounded truncation recovery.** Render trims at 6k chars; capture stops at 3,000 nodes. Test deep-text pages.
- **Visual/canvas coverage tests** before changing any fallback policy.
- **Leave alone:** the longlist-item miss (model error) and the timing medians. Recheck both x5 under matched scheduling.

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
