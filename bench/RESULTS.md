# Results

All benchmark numbers in one place. How to re-run them: [README.md](README.md).
Mantis is compared with the accessibility tree (Playwright MCP 0.0.83) and with screenshots (our own minimal tool).
Suites are reported separately; the sections below run from current scorecards to historical pilots.
The frozen live-site cohort ([live-v1](live-v1.md), v1.3 keys) has a scored Sarvam result below; Luna/Haiku confirmation is pending.

## Live-v1.3 real sites, Sarvam (current)

Frozen `live-v1` with v1.3 keys: 29 scored public-site tasks x 3 approaches x 3 runs = 261 runs (the GNU GPL-3 task is excluded: the host timed out for all nine runs, so it was unwinnable here). Agent `deepseek-v4.1-flash` through Sarvam; 10 scheduled cases. 20 tasks are graded by deterministic validators on captured final state; the rest are judged blind by Codex `gpt-6.1-sol` (0 judge errors). Result: `live-v1-deepseek-v1_2-20261022-judged`.

| Per-run | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Success / failure / blocked | 76 / 8 / 3 | 83 / 3 / 1 | 83 / 4 / 0 |
| Success rate (87 runs) | 87.4% | **95.4%** | **95.4%** |
| Deterministic-graded tasks | 48 / 53 | 50 / 53 | 53 / 54 |
| Judge-graded tasks | 28 / 31 | 33 / 33 | 30 / 33 |
| Avg tool calls | **6.2** | 6.9 | 12.3 |
| Avg input tokens | **51.0k** | 139.4k | 55.5k |

- Mantis is 8 points behind tree and screenshots on success but uses 63% fewer input tokens than tree and about half the calls of screenshots. This is a Sarvam result only, not a Luna/Haiku claim.
- Mantis misses: IMDb search (3 blocked/failed; the agent looped on a custom verification gate, since fixed generically and not yet re-run live), USGS about (CAPTCHA/403 on all approaches), Met collection search (2; token exhaustion after detours), and one each on MDN, Census about and Our World in Data CO2.
- **Disclosure:** Sol failure reviews found no Mantis tool defect apart from the IMDb gate. After seeing v1.2 results, the Django, USGS and OWID task wording and keys were revised (v1.3) to accept equivalent official pages, and GPL-3 was excluded. v1.2 numbers (all 30 tasks, 90 runs each) were Mantis 71, tree 78, screenshots 75 successes.
- **v1.4 swap:** the excluded GPL-3 row was replaced by `livev1-standards-rfc-8259` (kept GPL-3 as `excluded:true`), so the scored set stays 30. The table above covers the 29 tasks run before the swap; the RFC 8259 task ran separately (Sarvam, judged): 3/3 success for each approach, so the full 30-task set is Mantis 79/90, tree 86/90, screenshots 86/90 (87.8% / 95.6% / 95.6%).
- **Local-v1 regression after the Opus review fixes (A-E merged):** Mantis 75/75, median 4 tool calls (baseline 74/75, median 4).
- **IMDb gate fix (generic, fixture-tested):** Sarvam rerun, agent-reported 2/3 success (41, 50 and 13 calls); not judged.
- Reproduce: `JUDGE_IN=live-v1-deepseek-v1_2-20261022 npm run bench:judge` (raw run JSON/markdown stay local).

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

## Local tasks, Sarvam final seeded baseline

Frozen `local-v1` ([manifest](manifests/local-v1.json)). Agent `deepseek-v4.1-flash` through Sarvam V2 only; these are not Luna/Haiku or general-model claims.
25 code-graded local fixture tasks x 3 approaches x 3 runs = 225 logical runs, with frozen fixture seed
`20261018`. The run used a 100-step budget, 10 scheduled cases, 16 active model calls, 50 RPM, a 600s
active-work timeout, and an 1,800s wall cap. There were no HTTP 429s or wall-cap timeouts.

| Per-run median / total | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | **75/75** | **75/75** | 70/75 |
| Execution excl. quota/retry wait (p50) | **8.14s** | 11.59s | 16.45s |
| End-to-end CLI wall time (p50) | **58.56s** | 66.83s | 121.07s |
| Input tokens incl. cache (p50) | **11.1k** | 22.9k | 27.7k |
| Output tokens (p50) | **279** | 454 | 573 |
| Cost estimate, INR (p50) | **0.08** | 0.16 | 0.22 |
| Total input tokens incl. cache | **1.67M** | 4.91M | 13.11M |
| Total output tokens | **37.2k** | 54.8k | 154.9k |
| Total cost estimate, INR | **10.35** | 20.60 | 91.36 |

- Mantis and tree reached the correctness ceiling. Screenshot had one visual-read miss (`chart-march`: 56 vs 57) and four genuine 100-step budget exhaustions (`long-shop` runs 1–2, `long-admin` run 2, `long-onboard` run 2). These were not throttles, timeout failures, tool errors, or grader failures.
- “Execution” removes locally measured quota, cooldown, and retry wait; CLI wall time retains that wait. Medians and totals include every logical run, including screenshot failures. Costs are published-rate INR estimates.
- The raw result artifact and traces remain local rather than versioned; the frozen configuration above is sufficient to reproduce the scorecard.


## Real sites (historical pilot)

Not the live-site scorecard: an early pilot on a sampled public dataset, kept for reference.
Codex CLI, `gpt-6-luna`, medium reasoning, 1 run per task. Tasks are a seeded, level-stratified sample of
[Online-Mind2Web](https://huggingface.co/datasets/osunlp/Online-Mind2Web) (live public sites). Each run was graded
by a blind judge (`claude-sonnet-5-5`), which saw the final reply with tool-revealing lines removed and a fresh
screenshot of the final page, but not which approach produced it.

| Approach | Correct | Avg tool calls | Avg input tokens | Avg time |
|---|---:|---:|---:|---:|
| Mantis | **7/10** | **8.4** | **185k** | 55 s |
| Accessibility tree | 5/10 | 12.2 | 311k | 50 s |
| Screenshots | 6/10 | 17.9 | 310k | 76 s |

- The first sample of 10 had 5 tasks where every approach was stopped by bot detection
  (Cloudflare, Access Denied, 403, CAPTCHA). Those 5 were replaced by the next tasks in the same seeded order
  whose start page loaded in headless Chromium, keeping the level mix (2 easy, 3 medium).
- Per task: Mantis alone solved Healthline; screenshots alone solved SmartAsset; all three failed justice.gov
  and the Stanford task (it needs a login).
- 10 tasks x 1 run is a pilot: it shows a direction, not a margin.

Files: [first sample](results/codex-luna-realsite-judged.md) · [replacements](results/codex-luna-realsite-swap-judged.md)
(raw runs: `results/codex-luna-realsite*.json`).

## Local tasks (earlier pilots, historical)

26 tasks on pages written by the Mantis authors (known answers, graded by code). Short tasks are 1 run each.

| Agent | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Codex `gpt-6.1-sol` ([results](results/codex-sol.md)) | 22/22 · 1.58M tokens | 22/22 · 1.50M | 20/22 · 1.86M |
| Codex `gpt-6-luna` ([results](results/codex-luna.md)) | 21/22 · 1.74M | 22/22 · 1.97M | 17/22 · 2.65M |
| Claude `claude-haiku-5-5` ([results](results/claude-haiku.md)) | 22/22 · 1.29M | 22/22 · 1.77M | 22/22 · 1.25M |

Long tasks: 4 tasks of 15–27 actions each (shop checkout, admin edits, a 5-step wizard, comparing 7 products), 3 runs each.

| Agent | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Codex `gpt-6-luna` ([results](results/codex-luna-long.md)) | 12/12 · 2.59M tokens | 10/12 · 4.84M | 9/12 · 4.64M |
| Claude `claude-haiku-5-5` ([results](results/claude-haiku-long.md)) | 12/12 · 3.15M | 12/12 · 4.96M | 12/12 · 5.01M |

On short tasks Mantis and the tree are about even. On long tasks the tree uses 1.6–1.9x Mantis's tokens,
because every step re-reads more of the page. Time and cost are in the results files.

## Token replay

14 scripted tasks, no LLM ([results](results/latest.md)). Per step, Mantis returns a median of 28 tokens,
the tree 131, screenshots about 1,366. All three finish all 14 tasks. Some huge pages drive the total-token gap,
and on those Mantis shows a trimmed view, so this measures cheap orientation, not reading a whole article.

## Caveats

- The final local-v1 baseline uses 25 author-written fixture tasks. The earlier 26-task local pilots include one live task.
- Local-v2 and local-v2.1 are code-graded fixture suites with different step caps (35 and 50); do not merge them with each other, with local-v1, or with real-site pilots.
- The screenshot baseline is our own minimal tool, not a product's.
- Live sites change; real-site numbers are a snapshot.
