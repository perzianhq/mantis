# long

Hard, long-horizon tasks. live-v1 is saturated (86-90 of 90 per approach), so these add task length and in-flight page hazards.

## Phase A: long-local-v1 (built)

16 local tasks: 8 workflows (basket, access, suppliers, retention, workspace, casework, budgets, dispatch) x hazard off/on. Source: `bench/agent/long-local-v1.ts`; config: `bench/manifests/long-local-v1.json`.

- Hazards fire only on semantic events (an add, a stage, a save), never on timers. Off uses seed 44117, on uses the paired seed 11903 (workflows 7319 / 19417).
- The grader compares the full business ledger to an independently written expected state. It also requires the terminal URL, the visible confirmation, `completed=true`, `pending=0` and a matching final revision. A rollback after success fails. The answer must carry the displayed receipt (and the money total where asked).
- Every case has a named near miss. Tests: `test/long-local-v1.test.ts` (reference walkthrough passes; near miss, rollback, late revision, pending, wrong URL and stop-one-step-early fail) and `test/fixture-verification.test.ts`.
- Scored run: 8 workflows x 2 hazards x 3 approaches x 3 repeats = 144 runs per model; timeout 1200 s, max tool calls 100, max steps 150, concurrency 3. Pilot (unscored): timeout 1800 s, 160 tool calls, 200 steps, 1 run.
- Telemetry per run: tool calls, steps, wall time (`bench/agent/long-telemetry.ts`). `AGENT_MAX_TOOL_CALLS` caps tool calls.

```
AGENT_SUITE=long-local-v1 AGENT_TASKS=all AGENT_RUNS=3 AGENT_CONCURRENCY=3
```

## Phase B: long-live-v1 (draft; not frozen)

The reviewable draft is `bench/agent/long-live-v1-draft.json`; its loader is `bench/agent/long-live-v1.ts`. Excluded rows are retained but never scheduled. At freeze time, verify at least 12 scored rows, every scored key and its near miss, then run `assertLongLiveFreezable(rows)` and generate `bench/manifests/long-live-v1.json` with `buildLongLiveV1Manifest(rows)`. Do not hand-write manifest hashes.

Real-site candidates. None is frozen: keys and walkthroughs are unverified and every row is excluded until verified.

| Task | Family | Grading | Site | Task | Key status | Near miss |
|---|---|---|---|---|---|---|
| livelong-wiki-probes | civic-reference | deterministic | https://en.wikipedia.org/ | Compare Voyager 1, Voyager 2, Pioneer 10, Pioneer 11, New Horizons, Cassini-Huygens, Galileo spacecraft and Juno spacecraft. Report each launch date, COSPAR ID, rocket and launch mass; identify the lightest launch mass and finish on its article. | to-verify | Swap launch and dry mass for one probe. |
| livelong-wiki-moons | civic-reference | deterministic | https://en.wikipedia.org/ | Compare Io, Europa, Ganymede, Callisto, Titan, Triton, Enceladus and Mimas. Report each mean radius, orbital period and discovery date; order by mean radius and finish on the smallest moon's article. | to-verify | Use an equatorial radius or transpose two moons' periods. |
| livelong-gutenberg-novels | site-navigation | deterministic | https://www.gutenberg.org/ | Compare the English Text records for Pride and Prejudice, Sense and Sensibility, Emma, Mansfield Park, Persuasion, Northanger Abbey, Jane Eyre and Wuthering Heights. Use the lowest eBook number when multiple records qualify. Report title, eBook number, release date and LoC class; identify the earliest Gutenberg release, breaking ties by eBook number, and finish on that record. | to-verify | Substitute original publication year for Gutenberg release date. |
| livelong-gutenberg-gothic | site-navigation | deterministic | https://www.gutenberg.org/ | Audit Frankenstein, Dracula, The Picture of Dorian Gray, Strange Case of Dr Jekyll and Mr Hyde, The Castle of Otranto, The Mysteries of Udolpho, The Monk and The Turn of the Screw. For each use the lowest-numbered English Text record and report eBook number, credited author, release date and LoC class. Finish on the Frankenstein record. | to-verify | Use metadata from a different Frankenstein edition. |
| livelong-met-vangogh | interactive-exploration | deterministic | https://www.metmuseum.org/art/collection | Prepare an object checklist for Met collection IDs 436528, 436532, 436535, 436524, 436525, 436526, 436527 and 436530. Report each title, displayed date, medium, object number and centimetre dimensions. Finish on record 436530. | to-verify | Swap two records' object numbers or dimensions. |
| livelong-met-monet | interactive-exploration | deterministic | https://www.metmuseum.org/art/collection | Compare Met records 438008, 437137, 437127, 437131, 437133, 437142, 438003 and 438005. Report title, displayed date, object number, credit line and centimetre dimensions for each. Finish on record 438005. | to-verify | Merge the two Water Lilies records into one tuple. |
| livelong-openlibrary-austen | interactive-exploration | deterministic | https://openlibrary.org/advancedsearch | Compare the earliest dated English print editions with a named publisher for Austen's six completed novels. Break same-year ties by edition OLID. Report edition OLID, publication date, publisher and pagination for each; finish on the Emma edition. | to-verify | Use work-level first-publication metadata for an edition. |
| livelong-openlibrary-dickens | interactive-exploration | deterministic | https://openlibrary.org/advancedsearch | Compare the earliest dated English print editions with a named publisher for Oliver Twist, David Copperfield, Bleak House, Hard Times, A Tale of Two Cities and Great Expectations. Break same-year ties by edition OLID. Report OLID, date, publisher and pagination; finish on the Great Expectations edition. | to-verify | Substitute an abridged edition with the same work title. |
| livelong-eurostat-population | open-data | deterministic | https://ec.europa.eu/eurostat/databrowser/ | Configure demo_pjan for Germany, France, Italy and Spain; total sex, total age, persons; years 2010, 2015, 2020 and 2023. Display countries as rows and years as columns, report all 16 cells with any status flags, inspect dataset metadata, and finish with that table visible. | to-verify | One year or sex selection differs despite the correct dataset title. |
| livelong-eurostat-unemployment | open-data | deterministic | https://ec.europa.eu/eurostat/databrowser/ | Configure une_rt_a for Germany, France, Italy and Spain; total sex, ages 15-74, percentage of active population; years 2015, 2019, 2020 and 2023. Report the 16 annual values and status flags, inspect definitions, and finish with countries as rows and years as columns. | to-verify | Use youth unemployment or a different unit with otherwise matching selections. |

Freezing a row means resolving the canonical pages, capturing the labelled values with revision IDs, reviewing definitions, and recording a reviewed answer key. Judging is by sol (Codex) until the calibration gate in `bench/README.md` passes.

## Status

Fixtures built and tested. Luna and Haiku scored runs are complete; results are in [RESULTS.md](RESULTS.md#long-workflows-long-local-v1). Phase B (real-site long tasks) is documentation only and unrun; judging is by sol.
