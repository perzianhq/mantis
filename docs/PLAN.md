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
   - Keep the benchmark harness in this repo: pinned app version/image, Docker Compose, deterministic seed/reset command, task manifests, executable final-state checks, and run instructions.
   - Run the app only locally/CI for evaluation. It is not part of the Mantis server, published npm package, or a requirement for ordinary Mantis users.
   - Prefer a small open-source CRM or commerce admin. Cover normal product work: locate/filter a record, edit a field, create an order/invite, save, and verify the persisted final state.
   - Compare Mantis, tree, and screenshot under matched model, browser, retry, timeout, and token budgets; publish seed, image digest, traces, per-task outcomes, cost, and failures.
4. **Frozen real-site set.** Reviewed read-only answer keys (see item 6 below); judge only the unkeyed remainder, calibrated against human labels. Use this after controlled variants/self-hosted coverage so live-site failures can be separated from page drift, consent, or bot defenses.

### Evaluation ladder

```text
Fixed fixtures
  → seeded fixture variants
  → self-hosted real app
  → frozen live-site set
  → publish benchmark
```

| Stage | Cases | Where it runs | What is checked |
| --- | --- | --- | --- |
| Fixed fixtures | Forms, lookup/reading, tables and pagination, dialogs, SPA navigation, dynamic content, charts, iframes, and long shop/admin/onboarding flows. Include wrong-row, partial-state, and stale-state near misses. | Existing local fixture server; developer machine and CI. | Executable DOM/state oracle. Fast regression suite; no network. |
| Seeded variants | Same workflows, but generated product/customer names, prices, IDs, row order, wording, pagination size, and correct answer. | Local fixture server and CI; record the seed per result. | Oracle derived from that seed. Ensures tools/models read the page rather than rely on a fixed answer. |
| Self-hosted real app | Ordinary product work: filter/find a record, edit a field, create an order or invite, save, reload, and verify final persisted state. | Local Docker Compose or CI service container, with a pinned image/version and resettable seeded database. | Database/UI final-state oracle after every run. Never part of the Mantis runtime. |
| Frozen live-site set | Read-only navigation, retrieval, comparison, and multi-page tasks on public sites. No account changes, purchases, invitations, or irreversible actions. | A scheduled/manual networked benchmark run; capture date, URL, page evidence, model, and browser version. | Reviewed answer key where possible; human/judge only for genuinely unkeyed outcomes. |
| Publish benchmark | Matched runs of Mantis, tree, and screenshot approaches across the preceding stages. | Reproducible local/CI commands plus documented live-site procedure. | Per-task results, seeds/image digests, raw traces, costs, time, tool calls, and failures—not just an aggregate score. |

Run all approaches with the same model, browser, retry policy, timeout, and token budget. Start with fixed/seeded cases for every code change; run self-hosted and live-site suites at milestone releases or after browser/tooling changes.

### Current execution plan (after `5feb975` hardening)

Use **DeepSeek v4.1 Flash through Sarvam only** for the fresh local baseline. The historical 225-run set predates persisted terminal evidence, so repeat the same model first: it isolates the effect of the hardening. A second Sarvam model adds a variable without closing that evidence gap. Treat Sarvam credits as a ceiling, not a target.

1. **Free gate:** run the build plus focused `diff`, `prose-diff`, `actions-diff`, `fixture-verification`, `offline-analysis`, `realsite`, and `coverage` tests. Regenerate the saved offline reports. Do not spend model credits unless all pass.
2. **Paid smoke:** run DeepSeek on `plans-pick`, `faq-refund`, `modal-delete`, `long-shop`, `long-admin`, and `long-onboard` with Mantis, tree, and screenshot: **6 tasks × 3 approaches × 1 run = 18 runs**. Inspect full replies, attempt IDs, terminal fixture evidence, costs including failed attempts, and traces before promotion.
3. **Frozen seeded baseline:** only if the smoke evidence is usable and infrastructure is sound, generate one held-out seeded version of each of the 25 local tasks, freeze the seed manifest and executable oracles, then run **25 seeded tasks × 3 approaches × 3 runs = 225 runs** with the same DeepSeek configuration. Do not duplicate the already-published fixed-fixture 225. Keep model failures; repair infrastructure failures before starting a fresh, separately named dataset.
4. **Independent confirmation:** run a representative six-task seeded matrix at **3 runs per approach = 54 runs per model**, first on Luna and then separately on Haiku. This tests model transfer; it is more valuable than a second Sarvam model.
5. **Increase difficulty only if needed:** if the seeded baseline is still near the ceiling, build the self-hosted app with executable state oracles before expanding the frozen live-site set.

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
