# Results

All benchmark numbers in one place. How to re-run them: [README.md](README.md).
Mantis is compared with the accessibility tree (Playwright MCP 0.0.83) and with screenshots (our own minimal tool).
Headline models are Luna (`gpt-6-luna`) and Haiku (`claude-haiku-5-5`). Suites are reported separately.

## Long workflows (live-long-fixtures)

16 local tasks (8 workflows x hazard off/on) x 3 approaches x 3 runs = 144 runs per model, graded by the full-ledger grader in `bench/agent/live-long-fixtures.ts`; details in [live-long-v1.md](live-long-v1.md). Exec is mean agent execution time per run (`cliExecutionMs`).

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

## Live-site scorecard (live-v1 v1.7)

Frozen [live-v1](live-v1.md) v1.7: 30 real-site tasks x 3 approaches x 3 runs = 90 runs per approach and model, judged blind by Codex `gpt-6.1-sol`. Task changes, regrades and run notes are in the [live-v1 changelog](live-v1.md#changelog-and-disclosures).

Post-hoc swaps were GPL-3 to RFC 8259, IMDb to TMDB, and USGS to NIST; see the [changelog and disclosures](live-v1.md#changelog-and-disclosures). The 30 tasks are now frozen with no further swaps. The blind judge (`gpt-6.1-sol`) has not passed its calibration gate: 100 packets, 30 tasks, 95% agreement, and <=2% false successes.

**Luna (`gpt-6-luna`)**

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Success (of 90) | 89 | **90** | 85 |
| Avg input tokens | **88.1k** | 123.1k | 122.7k |

**Haiku (`claude-haiku-5-5`)**

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Success (of 90) | 87 | 86 | **89** |
| Avg input tokens (not comparable, see note) | 77.6k | 116.5k | 53.1k |

Haiku input tokens are not comparable across columns: the tree and screenshot runs used Claude CLI 2.1.308 on cloud, the Mantis re-run used 2.1.161 locally, which sends more input per turn (median 14.5k vs 8.3k). The earlier local rerun of blocked rows inflated all three similarly (Mantis 50.4k to 83.7k, tree 116.5k to 216.8k, screenshots 53.1k to 79.6k, on a different task subset). Mantis page text per call is unchanged (10.2k vs 10.6k chars). Mantis rows are a re-run after `src/` gap fixes (20261023); Haiku includes 6 connection-failure rows re-run alone (6/6 success). Failures: Luna 1 (`rfc-8259`), Haiku 3 (`node-url`, `data-gov-climate` x2), all agent behaviour or site drift; see the [live-v1 changelog](live-v1.md#changelog-and-disclosures).

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
- The 35 remaining misses are 28 step limits and seven task/action mistakes. The raw artifact, traces, and regrade artifact remain local. `local-v1` below remains a separate historical baseline.
- The published local-v2 command explicitly used 35 standard steps. Future non-`long` local-v2 runs default to 50, a separate policy/result line that does not alter this score.

## Token replay

14 scripted tasks, no LLM ([results](results/latest.md)). Per step, Mantis returns a median of 28 tokens,
the tree 131, screenshots about 1,366. All three finish all 14 tasks. Some huge pages drive the total-token gap,
and on those Mantis shows a trimmed view, so this measures cheap orientation, not reading a whole article.

## Caveats

- Local-v2 and local-v2.1 are code-graded fixture suites with different step caps (35 and 50); do not merge them with each other or with the other suites.
- The screenshot baseline is our own minimal tool, not a product's.
- Live sites change; real-site numbers are a snapshot.
