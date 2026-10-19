# Local v2 coverage contract (plan)

**Status:** planning contract; no v2 fixture, task, runner selection, or result manifest
exists yet.  `local-v1.json` remains the immutable 25-case baseline and is reported
separately.  Do not edit v1 fixtures, tasks, graders, seed, or result to satisfy this
contract.

## Scope and score unit

V2 will contain **48 scored local cases**: eight domains times six cases.  A case is a
seeded fixture workflow with one explicit completion condition, a deterministic oracle,
and one independently testable near miss.  Case IDs below are reserved planning names,
not task definitions.

| Domain | Three behavior families, each with two required structural cases | Required capability |
| --- | --- | --- |
| `regions-reading` | region retrieval: `landmark-jump` / `deep-fact`; context retention: `cross-region` / `collapsed-context`; reading recovery: `sticky-context` / `reading-recovery` | Locate, retain context across, and answer from long/partitioned reading surfaces. |
| `lists-scrolling` | target retrieval: `virtual-target` / `paginated-filter`; list-state disambiguation: `reordered-item` / `nested-scroll`; off-screen action/recovery: `offscreen-action` / `list-recovery` | Find and act on an item in long, virtual, paginated, filtered, or nested-scroll collections. |
| `forms-controls` | validation/repair: `native-validation` / `form-recovery`; choice controls: `combobox-choice` / `custom-toggle`; ranged or framed submission: `date-range` / `embedded-frame` | Complete and verify native, custom, and embedded controls, including validation repair. |
| `dense-tables` | multi-constraint lookup: `sort-row` / `filtered-cell`; constrained record retrieval: `wide-column` / `paginated-record`; group/repair: `grouped-total` / `table-recovery` | Retrieve or change the correct table value despite density, sorting, grouping, or pagination. |
| `charts-canvas-images` | plotted-datum retrieval: `svg-series` / `canvas-point`; annotated-visual retrieval: `image-fact` / `responsive-chart`; chart-state/recovery: `legend-filter` / `chart-recovery` | Obtain the specified visual datum or change chart state with an accessible or visual fallback. |
| `overlays-shadow-dom` | foreground confirmation: `modal-confirm` / `popover-menu`; component-boundary action: `shadow-action` / `stacked-overlay`; focus/recovery: `focus-trap` / `overlay-recovery` | Reach and close/confirm layered, portal, and shadow-root interactions without acting behind them. |
| `spa-navigation-recovery` | route/state navigation: `route-transition` / `history-state`; delayed/stale recovery: `loading-retry` / `stale-target`; error recovery: `error-boundary` / `spa-recovery` | Complete navigation under client-side state changes, loading, stale references, and recoverable errors. |
| `long-workflows` | commerce workflow: `multi-step-order` / `cross-page-compare`; admin workflow: `save-resume` / `conditional-branch`; onboarding workflow: `review-submit` / `workflow-recovery` | Maintain state, evidence, and completion over a multi-step workflow. |

Every family must have exactly two cases with materially different structures (for
example renderer/DOM hierarchy, interaction mechanism, navigation or scroll owner,
or state transition), not a value-only substitution such as a different label, target,
seed, position, or formatting.  Every row records its domain, family, structural
variant, seed, expected final state, oracle ID, near-miss ID, and split (`development`
or `held-out`). The first four rows in each domain are development rows; the last two
are held-out rows. This gives 32 development and 16 held-out scored cases. A fixture
may exercise multiple UI patterns, but it has one primary domain and may not be counted
in another domain's quota.

## Domain contracts

### Regions and long reading

- **Requirements:** landmark/heading navigation, long-document retrieval, collapsed or
  sticky context, and an answer tied to the target region rather than an adjacent match.
- **Structural variants:** change landmark nesting and labels, heading depth, content
  order, distractor wording, expansion state, and target position; at least two cases put
  the target beyond the initial viewport.
- **Oracle and near miss:** derive the answer from seeded target data and assert the
  exact answer plus target-region identity.  A same-looking fact in a sibling region,
  an unexpanded disclosure, or the preceding/next occurrence must fail.
- **Held-out discipline:** hold out one reordered/nested-landmark layout and one
  collapsed-or-sticky-context layout; do not use their markup, labels, target values, or
  seeds while tuning development fixtures or Mantis behavior.

### Lists and scrolling

- **Requirements:** retrieval/action in virtual, paginated, filtered, nested-scroll, and
  off-screen lists, including recovery after a list update.
- **Structural variants:** vary item count, window size, page or fetch-batch boundaries,
  sort and filter order, nested scroll owner, duplicate labels, and target index.
- **Oracle and near miss:** assert the seeded item ID and resulting page state/action,
  not merely visible text.  A same-name item, neighbor index, stale pre-filter item, or
  action taken in the wrong scroll container must fail.
- **Held-out discipline:** reserve one virtual-list window/batch regime and one
  nested-scroll-plus-reorder regime; never expose their target IDs or generator settings
  in development prompts or expected-answer fixtures.

### Forms and embedded controls

- **Requirements:** validated data entry, custom selection, dates/ranges, toggles, and
  an embedded frame/control, followed by confirmation of submitted state.
- **Structural variants:** vary control implementation (native, ARIA, custom element),
  required/optional fields, invalid values, field order, labels/help text, frame origin
  route, and success/error copy.
- **Oracle and near miss:** assert normalized submitted values, required side effects,
  and error clearance where applicable.  A visually filled but uncommitted control,
  wrong option with the same prefix, invalid range, or host-page value instead of frame
  value must fail.
- **Held-out discipline:** reserve one custom-control composition and one embedded-frame
  validation path; their DOM shape and generated valid values are not used to refine
  selectors, prompts, or recovery logic.

### Dense tables

- **Requirements:** correct row/cell lookup or mutation through sorting, filters, wide
  columns, grouping, and pagination, with header-to-cell association preserved.
- **Structural variants:** vary row order, repeated values, column order/visibility,
  group expansion, page size, sort direction, and numeric/date formatting.
- **Oracle and near miss:** assert stable row key, column key, and normalized target
  value or mutation.  A matching value from another row/column, pre-sort row position,
  collapsed group total, or wrong page must fail.
- **Held-out discipline:** reserve one column permutation with duplicate values and one
  grouped/paginated variant; do not tune table traversal on their seed outputs.

### Charts, canvas, and images

- **Requirements:** read or change a specified datum in SVG/canvas/image-backed visual
  content, including legend/filter state and responsive geometry.
- **Structural variants:** vary renderer, series/order, scale, viewport, tooltip trigger,
  legend placement, image annotations, and whether the intended datum has an accessible
  text alternative.
- **Oracle and near miss:** derive the datum/state from the fixture model and assert
  series, category, value, and selected state as relevant.  A nearby point, same value
  from another series, stale tooltip, or decorative-image text must fail.
- **Held-out discipline:** reserve one canvas/responsive geometry case and one
  image/legend-state case; their coordinates, pixel labels, and alternate-text choices
  cannot become hard-coded product behavior.

### Overlays and shadow DOM

- **Requirements:** discover and operate menus, dialogs, portals, shadow-root controls,
  and focus traps; confirm the foreground action and intended post-condition.
- **Structural variants:** vary portal host, open/closed component boundary where the
  platform permits observation, z-order, dismissal method, focus placement, backdrop,
  and duplicated background controls.
- **Oracle and near miss:** assert overlay lifecycle, active target identity, and final
  side effect.  A click through the backdrop, background duplicate, dismissal without
  confirmation, or interaction with a stale overlay must fail.
- **Held-out discipline:** reserve one stacked-portal/focus-trap composition and one
  shadow-host composition; keep their host names, layering, and confirmation values out
  of development examples.

### SPA navigation and recovery

- **Requirements:** route navigation, browser history/state, wait/retry behavior,
  stale-target recovery, and recovery from a deliberate local error boundary.
- **Structural variants:** vary route shape, history depth, loading latency, replacement
  versus push state, DOM remounting, transient failure timing, and retry affordance.
- **Oracle and near miss:** assert route/state plus the final destination-specific result
  or mutation.  A matching URL with stale content, old history state, pre-retry view, or
  success claimed after an error boundary must fail.
- **Held-out discipline:** reserve one remount/stale-reference case and one
  retry/error-boundary timing case; no retries, waits, or selectors may be tuned against
  their traces before the held-out evaluation is recorded.

### Long workflows

- **Requirements:** complete a stateful multi-step task with retained selections,
  cross-page evidence, conditional branching, save/resume, review, and final submission.
- **Structural variants:** vary step order, branch predicate, persisted versus ephemeral
  state, intervening navigation, review wording, and where a recoverable interruption
  occurs.
- **Oracle and near miss:** assert every required intermediate state and the final
  submission payload/outcome.  A correct-looking final answer with a missing persisted
  choice, skipped branch, wrong comparison source, or incomplete review must fail.
- **Held-out discipline:** reserve one save/resume flow and one conditional/review flow;
  their branch data and expected payloads stay unavailable until the scored run.

## Executable grading and held-out rules

Each case must have an executable deterministic oracle. State-changing cases require a
browser-state oracle independent of the model's final text. For read-only
reading/chart/retrieval cases, require either deterministic grading against the seeded
answer or an observable answer submission, plus relevant state checks where applicable.
Put a passing fixture test and a separately named failing near-miss test in
`test/fixture-verification.test.ts`; the near miss mutates only the target-adjacent wrong
state or answer and proves the oracle rejects it. A raw answer string, screenshot, or
judge verdict is insufficient without that deterministic grade or observable submission.
Run a score only when fixture state, final evidence capture, and both tests are present.

Seeds generate data and expected values at run time; they must not leak target answers in
task wording, DOM-only metadata, filenames, or logs supplied to the agent.  Freeze the
case list, seed schedule, oracle and near-miss before the first published v2 comparison.
Development failures may change the implementation and development cases, but any such
change requires a new frozen v2 manifest/version.  Held-out cases are executed only for
predeclared checkpoints; inspect them after scoring, then replace them with a new held-out
split before another tuning cycle.  Never silently fold held-out traces into development.

## Run and reporting protocol

For each model, run the same 48 case IDs, seeds, browser version, prompt contract,
timeouts, retry policy, token budget, and grader for exactly these approaches:
`mantis`, `tree`, and `screenshot`. Execute **three independent repeats** per
case-and-approach: `48 × 3 approaches × 3 repeats = 432 planned logical rows per model`.
Isolate browser and agent process per attempt, randomize execution order without changing
the frozen row set, and retry each connection failure once. An unresolved connection
failure is excluded from correctness denominators; report its retry time and cost
separately. Crashes and timeouts remain failed scored attempts.

Report overall, domain, split (development/held-out), and approach success counts and
rates; retain per-case outcome, seed, oracle/near-miss IDs, trace/evidence path, steps,
tokens, and timing.  Compare approaches only within a model and matched row set.  Publish
v2 scores separately from `local-v1`; v1 remains a historical frozen baseline, not a
subset, denominator, or regression target for v2.
