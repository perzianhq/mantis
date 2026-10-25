# Results

All benchmark numbers in one place. How to re-run them: [README.md](README.md).
Mantis is compared with the accessibility tree (Playwright MCP 0.0.83) and with screenshots (our own minimal tool).
Headline models are Luna (`gpt-6-luna`) and Haiku (`claude-haiku-5-5`). Suites are reported separately.

## Long workflows (long-local-v1)

Formerly named `live-long-fixtures` (the tasks run on local fixtures, not live sites); result files from before the rename keep the old name.

16 local tasks (8 workflows x hazard off/on) x 3 approaches x 3 runs = 144 runs per model, graded by the full-ledger grader in `bench/agent/long-local-v1.ts`; details in [long-v1.md](long-v1.md). Exec is mean agent execution time per run (`cliExecutionMs`).

| Model | Approach | Score | Mean exec | Median exec | Input tokens | Output tokens | Tool calls |
|---|---|---:|---:|---:|---:|---:|---:|
| `gpt-6-luna` | Mantis | **48/48** | **103s** | **91s** | **17.3M** | **50k** | **1190** |
| | Accessibility tree | **48/48** | 132s | 123s | 28.0M | 67k | 1685 |
| | Screenshots | 42/48 | 163s | 148s | 31.0M | 153k | 2774 |
| `claude-haiku-5-5` | Mantis | **48/48** | **42s** | **41s** | **12.1M** | **108k** | **1501** |
| | Accessibility tree | **48/48** | 59s | 61s | 18.7M | 157k | 1827 |
| | Screenshots | **48/48** | 64s | 68s | 27.1M | 269k | 2876 |

- Mantis vs tree: Luna 22% less time, 38% fewer input tokens, 29% fewer calls; Haiku 29% less time, 35% fewer input tokens, 18% fewer calls. Scores are equal.
- Luna's screenshot approach failed 6 of 48 rows; Mantis and the tree failed none.
- Luna ran locally on Windows (concurrency 30) and Haiku on cloud Linux (concurrency 12), so compare approaches within a model, not times across models. Rows that needed a retry are best-of-two.
- A later Mantis-only full run (20261023, final fixtures and graders) scored 48/48 for both models (`results/live-long-fixtures-{luna,haiku}-mantis-final-20261023.md`); the table keeps the same-condition three-way run so approaches stay comparable.
- Basket and retention rows were rerun after two fixture fixes (history restore, unsaved retention summary); other rows were regraded offline with the current graders from the same runs. Merged files: `results/live-long-fixtures-{luna,haiku}-merged-20261023.md`.

## Long real-site tasks (long-live-v1)

16 real-site tasks x {Mantis, tree} x 3 runs = 48 runs per approach and model, judged blind by Codex `gpt-6.1-sol`. Final scores come from one clean run per model (`long-live-v1-final-{luna,haiku}`) rejudged with attempt-bound transcripts and upload chronology. No row is selected by outcome.

| Agent | Mantis | Tree (Playwright MCP) |
|---|---:|---:|
| Luna (`gpt-6-luna`, Codex, medium) | **41/48 (85%)** | 37/48 (77%) |
| Haiku (`claude-haiku-5-5`) | **47/48 (98%)** | 44/48 (92%) |

Efficiency, medians over all 48 runs per approach, failed runs included (wall time is whole agent run; pure agent execution `cliExecutionMs` gives the same ratios, 49.4s vs 73.9s Luna and 88.4s vs 133.8s Haiku):

| Metric | Luna Mantis | Luna tree | Diff | Haiku Mantis | Haiku tree | Diff |
|---|---:|---:|---:|---:|---:|---:|
| Wall time (s) | 50.1 | 74.8 | -33% | 90.1 | 135.1 | -33% |
| Tool calls | 18 | 25 | -28% | 26 | 32 | -19% |
| Input tokens | 262k | 362k | -28% | 432k | 746k | -42% |
| Output tokens | 1.08k | 1.34k | -19% | 6.03k | 5.99k | +1% |
| Tool output read (k chars) | 31.4 | 86.7 | -64% | 32.2 | 64.7 | -50% |
| Cost (USD) | n/a | n/a | n/a | 0.319 | 0.432 | -26% |

Means give smaller gaps (wall time -22% Luna, -18% Haiku; input tokens -40% Luna, -36% Haiku; Haiku cost -28%) because a few long failed runs dominate. The judge has not passed its calibration gate (100 packets, 30 tasks, 95% agreement, <=2% false successes): the sol audit of 120 deterministic-graded packets over 33 tasks gave 79.2% agreement (95% CI 71.1–85.5%) and 6/48 false successes ([judge-audit.md](results/judge-audit.md)); 11 of the 25 disagreements are `unsure`, counted as disagreements. The gold labels are the deterministic graders, which check final state only, so some disagreements are sol enforcing process rules (no login, on-site search, the `Earlier:` line) and some are sol accepting answers a strict URL check rejects; the gold set is not itself proven correct. Two causes are known and neither is fixed by changing a grader: (1) the Project Gutenberg results form shows `lang=Any` in the final frame even with `lang=en` in the URL and "Language = English" in the page text, so sol's language failures on the Dickens and Shakespeare searches are a site-form quirk, not agent errors; (2) "use the on-site search" cannot be graded from final state, because the saved URLs and typed values rarely show a search (0 of 28 Wikipedia journals have a search URL), so that rule stays a judge matter. Many `unsure` verdicts on multi-entry Wikipedia and Gutenberg tasks come from the judge's evidence limit (about 12 frames in the sol audit; the Sonnet rerun raised the cap to 24), not from agent failures. A forbidden-count rule (fail any reply that quotes the live result total) was tried on the two Met search tasks and dropped: the task bars using the total as an answer fact, not mentioning it, and the harness prompt asks agents to report visible state, so it only produced false failures. The scores above are unchanged by this audit. The same 120 packets re-judged by Sonnet (`claude-sonnet-5-5`) with the 24-frame evidence cap gave 85.0% agreement (102/120) and 11/48 false successes, 0 false failures, 7 non-success/failure verdicts counted as disagreements: more agreement than sol, more leniency, still short of the gate ([judge-audit-sonnet-run.jsonl](results/judge-audit-sonnet-run.jsonl)). It calibrates Sonnet, not the sol that judged the model-graded rows. A sol review of Sonnet's 18 disagreements found 8 gold labels wrong or too strict (the grader rejected correct or equivalent answers: paraphrase vs an exact `Earlier:` line, URL and path variants, heading and viewport checks), 5 cases of judge leniency (non-visible required sections, exact author strings) and 5 evidence limits. Counting those 8 as agreement, Sonnet is at 90.8% (109/120) with 4/40 false successes and sol at 84.2% (101/120) with 0/40; these are corrected estimates from one reviewer, not a rerun, and the gate stays unmet or unverified. None of the 8 is a published `long-live-v1-final` row: they sit in superseded pilot/main files and in `live-v1` Luna and deepseek rows, so the long real-site table above is unaffected. Of the three `live-v1` Luna screenshot rows among them, the census-about key was widened to accept the official "Who We Are" subpage and that row regraded offline (Luna screenshots 85 to 86). The two django-overview rows stay failures: the final frame was correct but the agent reported the page banner instead of the "Why Django?" heading, so those labels were not wrong. The Luna Mantis (89) and tree (90) figures are unchanged.

- Haiku Mantis includes one cell replaced after a tool fix: `form-selenium-select` failed 2/3 because Mantis did not expose HTML `id`/`name` on identical form controls. After the fix (shown only on look-alike controls) all three runs of that cell were rerun, not just the failures, and passed 3/3. Without the replacement Haiku Mantis is 45/48. Merge: `scripts/merge-idfix.mjs`; files `results/long-live-v1-final-merged-haiku-judged.json`, `results/long-live-v1-idfix-haiku-judged.md`.
- Sol reviewed 24 non-success rows against saved logs (a 25th, Haiku tree `internet-window-frames-upload` run 2, was flipped from success to failure afterwards on manual review: the agent admitted it did not visually confirm the selected filename): 19 model misses, 2 Mantis tool gaps (the id/name gap above, now fixed), 3 Playwright tool gaps (`selenium-window-frames-upload`, iframe contents invisible to the tree snapshot, [microsoft/playwright#43628](https://github.com/microsoft/playwright/issues/43628)), 0 grader or task issues.
- Luna misses cluster in `gutenberg-gothic` (author strings shortened instead of copied exactly), `wiki-probes` (grouped numbers), and `met-rembrandt-search`. Haiku misses: `gutenberg-gothic` tree r3, `internet-window-frames-upload` (Mantis r3, tree r1-r3). Haiku's +3 net lead is 2 from that task and 1 from `gutenberg-gothic`.
- Sensitivity: without the Selenium iframe chain task, Luna is 38/45 Mantis vs 37/45 tree; three of the four net Mantis wins on Luna come from that task. Six tasks pass all 12 observed attempts and give no separation.
- Earlier higher scores (Luna 47/48 vs 42/48, Haiku 48/48 each) merged targeted reruns that replaced only failing verdicts; they are superseded and not a three-run estimate.
- Post-hoc task substitutions (unreachable `/large_form` and blank DemoQA pages) are recorded in the task catalogue `bench/agent/long-live-v1-draft.json`; they were made before the final run.
- Case replacement was reviewed and rejected for v1: contracts stay frozen. For a future v2, reword `gutenberg-gothic`, `wiki-probes`, `met-rembrandt-search`, `internet-window-frames-upload` (accept equivalent name forms, thousands separators, header units, combined frame reads), frozen before any scored run.
- For the tree upload harness, the fixture is written to `<attempt dir>/tree-output`, because tree can upload only from its output directory or the repo.

## Live-site scorecard (live-v1 v1.7)

Frozen [live-v1](live-v1.md) v1.7: 30 real-site tasks x 3 approaches x 3 runs = 90 runs per approach and model, judged blind by Codex `gpt-6.1-sol`. Task changes, regrades and run notes are in the [live-v1 changelog](live-v1.md#changelog-and-disclosures).

Post-hoc swaps were GPL-3 to RFC 8259, IMDb to TMDB, and USGS to NIST; see the [changelog and disclosures](live-v1.md#changelog-and-disclosures). The 30 tasks are now frozen with no further swaps. The blind judge (`gpt-6.1-sol`) has not passed its calibration gate: 100 packets, 30 tasks, 95% agreement, and <=2% false successes.

**Luna (`gpt-6-luna`)**

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Success (of 90) | 89 | **90** | 86 |
| Avg input tokens | **88.1k** | 123.1k | 122.7k |
| Median tool calls | **4** | **4** | 6 |
| Median wall time (s) | 43.7 | **23.4** | 28.5 |
| Median tool output (chars) | 9.3k | 54.9k | **0.1k** |
| Median output tokens | **347** | 364 | 647 |

**Haiku (`claude-haiku-5-5`)**

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Success (of 90) | 87 | 86 | **88** |
| Avg input tokens | **77.6k** | 152.6k | 82.1k |
| Median tool calls | **4** | 7 | 8 |
| Median wall time (s, see note) | 46.4 | 43.7 | **33.4** |
| Median tool output (chars) | 9.6k | 28.8k | **0.1k** |
| Median output tokens | **890** | 1130 | 1564 |

Haiku tree and screenshot rows are a local re-run on Claude CLI 2.1.161 (the same build as the Mantis re-run), 180 runs, judged blind by sol with the same deterministic-first gate (57 validator-graded, 33 judge-graded per cell, 0 unsure, 0 blocked). Tokens and tool output are now comparable across columns; the earlier cloud-CLI-2.1.308 numbers are superseded. Latency is less reliable: the re-run used concurrency 16 (4 contention-damaged rows were re-run at concurrency 4), so tree and screenshot times may be inflated by machine contention; Mantis's concurrency was not recorded. On short tasks Mantis saves tokens and tool output (about 49% fewer input tokens than the tree, about even with screenshots) but is not faster: Haiku medians are 46.4s Mantis, 43.7s tree, 33.4s screenshots; Luna 43.7s vs 23.4s vs 28.5s. Haiku cost is not shown because Mantis cost was not recomputed on this build. Mantis rows are a re-run after `src/` gap fixes (20261023); Haiku includes 6 connection-failure rows re-run alone (6/6 success). Failures: Luna 1 (`rfc-8259`); Haiku Mantis 3 (`node-url`, `data-gov-climate` x2), tree 4 (`data-gov-climate` x3, `css-color-4` run 2), screenshots 2 (`data-gov-climate` x2). `data-gov-climate` is a fragile task (site drift) and accounts for 7 of the 9 Haiku failures. See the [live-v1 changelog](live-v1.md#changelog-and-disclosures).

## Side scorecards (DeepSeek only, local fixtures)

Not headline results: `deepseek-v4.1-flash` through Sarvam on local code-graded fixtures. Luna and Haiku are the headline models.

## Local-v2.1 full scorecard (local fixtures)

Frozen `local-v2.1`: 54 code-graded local fixture tasks (the frozen v2 48 plus six reliability contracts) x 3 approaches x 3 runs = 486 logical rows. Agent `deepseek-v4.1-flash` through Sarvam V2; 10 scheduled cases, 16 active model calls, 50 RPM, and a 50-completion cap for non-`long` tasks. This is a local-fixture result, not a live-site claim.

| Per-run median / total | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **159/162 (98.1%)** | 157/162 (96.9%) | 150/162 (92.6%) |
| Active model-request time (p50) | **11.1s** | 13.1s | 20.4s |
| Agent execution excl. quota/retry wait (p50) | **13.1s** | 15.9s | 22.9s |
| End-to-end CLI wall time (p50) | **63.8s** | 89.3s | 122.9s |
| Input tokens incl. cache (p50) | **15.7k** | 26.8k | 31.6k |
| Output tokens (p50) | **364** | 440 | 645 |
| Cost estimate, INR (p50) | **0.099** | 0.143 | 0.242 |
| Total cost estimate, INR | **35.29** | 52.75 | 139.34 |

- Overall: 466/486 (95.9%). Mantis uses 41.6% fewer median input tokens than tree and 50.4% fewer than screenshots.
- The raw artifact records 466 successes, seven wrong answers, 12 step limits, and one 50th-turn Sarvam `length` result. The harness now correctly classifies that terminal `length` result as a 13th step limit; no row was rerun or promoted.
- Sol audited all 20 misses: 13 are genuine budget exhaustions and seven are genuine task/action mistakes. No fixture, oracle, or provider failure requires a paid rerun.
- Raw artifacts, traces, and the derived offline regrade remain local. This scorecard is ready as a local-fixture baseline only; frozen live-site evaluation remains separate.

## Local-v2 full scorecard (historical)

Frozen `local-v2`: 48 code-graded local fixture tasks x 3 approaches x 3 runs = 432 logical rows. Agent `deepseek-v4.1-flash` through Sarvam V2; 10 scheduled cases, 16 active model calls, and 50 RPM. Scores are an offline regrade of the complete saved outputs under the repaired held-out answer contract and state oracle; it is not a live-site claim.

| Per-run median / total | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **135/144 (93.8%)** | 134/144 (93.1%) | 128/144 (88.9%) |
| Execution excl. quota/retry wait (p50) | **12.7s** | 16.3s | 24.2s |
| End-to-end CLI wall time (p50) | **63.3s** | 104.0s | 133.8s |
| Input tokens incl. cache (p50) | **15.9k** | 28.4k | 42.2k |
| Output tokens (p50) | **363** | 456 | 774 |
| Cost estimate, INR (p50) | **0.105** | 0.156 | 0.284 |
| Total cost estimate, INR | **28.27** | 51.02 | 103.77 |

- All 432 rows launched: no HTTP 429s, connection failures, wall-cap timeouts, or harness failures.
- The original state contract marked 20 completed rows wrong for answer-format/oracle reasons. The versioned regrade promotes those rows from their saved final answers and authoritative fixture observations; no agent or browser row was rerun.
- The 35 remaining misses are 28 step limits and seven task/action mistakes. The raw artifact, traces, and regrade artifact remain local. `local-v1` (the 225-run baseline) remains a separate historical baseline; its raw result is committed gzipped at `bench/results/final-deepseek-225-rpm50-cases10-active600-20261019.json.gz`, and [bench/README.md](README.md) shows how to verify its checksum against [the manifest](manifests/local-v1.json).
- The published local-v2 command explicitly used 35 standard steps. Future non-`long` local-v2 runs default to 50, a separate policy/result line that does not alter this score.

## Token replay

14 scripted tasks, no LLM ([results](results/latest.md)). Per step, Mantis returns a median of 28 tokens,
the tree 131, screenshots about 1,366. All three finish all 14 tasks. Some huge pages drive the total-token gap,
and on those Mantis shows a trimmed view, so this measures cheap orientation, not reading a whole article.

## Benchmarked source

npm `mantis-browser@0.1.5` is built from `70dbd5f`. The published numbers ran on earlier commits; seven agent-visible `src/` commits separate them from v0.1.4, so v0.1.4 is not what was measured.

- `long-live-v1` Luna and Haiku headline: `416fd28` (Haiku's three `form-selenium-select` rerun cells: `70dbd5f`).
- `live-v1` v1.7 Mantis cells and `long-local-v1`: `83ebb6a` (an ancestor of v0.1.4, no `src/` change in between).
- Since v0.1.4: `56048f3` (Chromium failure/version/UA), `373c55b` (multi-select fill), `7bbe75d` (name/id labels), `8742162` (scan reuse, navigation/CAPTCHA retry), `8b4e94f` (action IDs, file names, upload reporting), `416fd28` (URL-only refresh, combobox diagnostics, output sanitization), `70dbd5f` (id/name for look-alike controls). The 0.1.5 build and unit tests pass; the benchmarks were not rerun on `70dbd5f`.

## Caveats

- Local-v2 and local-v2.1 are code-graded fixture suites with different step caps (35 and 50); do not merge them with each other or with the other suites.
- The screenshot baseline is our own minimal tool, not a product's.
- Live sites change; real-site numbers are a snapshot.
- Judge spot-check: a reproducible raw-evidence spot-check of 30 published live-v1 v1.7 and long-live-v1 verdicts across 18 tasks found 27 agreements, two false successes, zero false failures, and one ambiguous deterministic success. Both false successes were Luna nested-frame workflows (one Mantis, one tree) that used combined observations instead of the required separate frame reads; the ambiguous row retained English search results while its language selector recorded Any. The auditor is an AI from the same GPT-6 model family as the `gpt-6.1-sol` judge, so this is not an independent human audit and does not establish the calibration gate.
- Nested-frames contract wording: the Internet window-frames task text asks for separate frame reads. That wording was not enforced on any run: the blind judge sees captures and the final reply, not the operation sequence. A full audit found 6 of its 12 Luna and Haiku rows used one combined frame view yet reported correct answers and final states. Five stay published as successes (Luna Mantis 2 and 3, Luna tree 1, 2 and 3). The sixth, Haiku tree run 2, is published as a failure after manual review, because the agent admitted it did not visually confirm the selected filename (an outcome problem, not the wording). Read strictly, Luna would be Mantis 39/48 vs tree 34/48; Haiku is already 47/48 vs 44/48. Mantis leads either way. Time, token and cost figures do not change. The contract was not changed after the fact.
