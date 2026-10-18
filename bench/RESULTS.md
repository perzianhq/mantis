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

## Local tasks, Sarvam pilot (one model)

Agent `deepseek-v4.1-flash` (Sarvam V2 API) only. Results for this model alone; they are not Luna/Haiku numbers and not a general claim.
25 local tasks x 3 approaches x 3 runs = 225 runs, graded by code (page state plus exact match on the final answer; no judge).
Five failed cells were re-run once after a grader fix and harness repairs (cookie-cart/mantis, churned-max, booking-date, long-shop, long-admin on screenshots);
the merged table uses the re-run result for those cells, and the other failures are kept as model mistakes.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct | 74/75 | **75/75** | 71/75 |
| Median tool calls | **4** | 6 | 10 |
| Median input tokens | **10.9k** | 22.8k | 18.3k |
| Median time | **16.5s** | 31.9s | 39.6s |
| Total cost (INR) | **11.7** | 23.7 | 73.4 |
| Total input tokens | **1.99M** | 6.35M | 10.62M |

- Failures: Mantis `longlist-item` run 3 (answered the page title, not the heading it was shown); screenshots `long-shop` runs 1 (timeout, 600s) and 3, `long-admin` run 3, `long-onboard` run 2.
- Accuracy is at the ceiling for the tree, so this separates the approaches on cost and speed, not success.
- Files: [merged](results/broad-deepseek-v4.1-flash-merged.json) · [original 225](results/broad-deepseek-v4.1-flash.md) · [re-runs](results/rerun5-mantis.md), [screenshots](results/rerun5-screenshot.md).

## Local tasks, Sarvam seeded fixture profile

The same 25 local tasks x 3 approaches x 3 runs, using frozen profile `AGENT_FIXTURE_SEED=20261018`.
This is a different data profile, not a claim that the model improved between runs. The original raw
table had nine FAQ verifier false-fails (recovered separately after the attempt-URL fix) and one
quoted-answer grader false-fail for Mantis. Two screenshot cells ended in provider CLI errors and
remain unresolved; they are not counted as model failures.

| | Mantis | Accessibility tree | Screenshots |
|---|---:|---:|---:|
| Correct after verified recovery | **75/75** | **75/75** | 73/75 + 2 CLI errors |
| Median tool calls | **4** | 6 | 10 |
| Median input tokens | **11.5k** | 23.0k | 27.6k |
| Median time | **16.9s** | 29.2s | 38.2s |
| Total cost (INR) | **11.3** | 20.4 | 100.3 |
| Total input tokens | **1.83M** | 4.84M | 13.71M |

- Compared with the earlier fixed-profile table, Mantis used 8% fewer total input tokens and 3%
  less cost, with a 0.4s slower median. The profile changed, so treat that as robustness evidence,
  not a performance delta.
- The frozen seed and exact recovery accounting are retained in local run artifacts; only this compact,
  reviewable scorecard is committed to avoid versioning 50MB of raw provider traces.

## Token replay

14 scripted tasks, no LLM ([results](results/latest.md)). Per step, Mantis returns a median of 28 tokens,
the tree 131, screenshots about 1,366. All three finish all 14 tasks. Some huge pages drive the total-token gap,
and on those Mantis shows a trimmed view, so this measures cheap orientation, not reading a whole article.

## Caveats

- 25 of the 26 local tasks are pages written by the Mantis authors.
- The screenshot baseline is our own minimal tool, not a product's.
- Live sites change; real-site numbers are a snapshot.
