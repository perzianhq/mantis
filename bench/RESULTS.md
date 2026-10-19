# Results

All benchmark numbers in one place. How to re-run them: [README.md](README.md).
Mantis is compared with the accessibility tree (Playwright MCP 0.0.83) and with screenshots (our own minimal tool).

## Real sites (pilot)

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

## Local tasks

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

## Local tasks, Sarvam final seeded baseline

Agent `deepseek-v4.1-flash` through Sarvam V2 only; these are not Luna/Haiku or general-model claims.
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

## Token replay

14 scripted tasks, no LLM ([results](results/latest.md)). Per step, Mantis returns a median of 28 tokens,
the tree 131, screenshots about 1,366. All three finish all 14 tasks. Some huge pages drive the total-token gap,
and on those Mantis shows a trimmed view, so this measures cheap orientation, not reading a whole article.

## Caveats

- 25 of the 26 local tasks are pages written by the Mantis authors.
- The screenshot baseline is our own minimal tool, not a product's.
- Live sites change; real-site numbers are a snapshot.
