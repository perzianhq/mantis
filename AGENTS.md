# Agent guidance

For all coding agents (Claude Code loads this via CLAUDE.md).

## Talking to the user
- Keep replies short and to the point: lead with the result in 1–3 lines. Use tables only when they replace more text. Skip background and caveats unless they change a decision.

## Working
- Parallelize independent light tasks: reads, searches, edits, builds, small tests. Sequence dependent steps.
- Codex jobs: use `scripts/codex-job.sh` with a short label; from Claude Code, use Bash with `run_in_background` to show in background tasks. Don't poll; read only `.codex-jobs/<label>.out.md` after completion.
- Run heavy jobs (agent evals, full suites, many browsers) one at a time to avoid RAM contention.
- Fix bugs that evals expose in general, never around the case that exposed them. No site names, URLs, site class names or task text in `src/`. Reproduce the pattern in a synthetic fixture, then test it with a passing case and a near miss.

## Models
| Agent | Planning, analysis, review | Implementation (writing and editing code) |
|---|---|---|
| Claude Code | Opus, high effort | Sonnet subagent (`model: "sonnet"`) |
| Codex | `gpt-6.1-sol`, high reasoning effort | `gpt-5.6-terra` |
| Sarvam trials (savings unmeasured) | Fixture agents first; `deepseek-v4.1-flash` trace-analysis trials, `sarvam-105b` summary trials (reasoning off); sol samples both | `glm-5.3` coding-review trial only |

Plan on the strong model; delegate coding to the cheaper one with files and acceptance criteria. Review its diff on the strong model.

- Cloud sessions (cloud evals and other cloud work) run on Sonnet.
- The agent under test in evals is `claude-haiku-5-5` (`AGENT_PROVIDER=claude`) or `gpt-6-luna` (Codex, `AGENT_MODEL=gpt-6-luna`).
- Sarvam's primary role is the agent under test on fixture tasks with deterministic graders. Match tasks, runs, budgets and approaches on one model per table; Luna/Haiku remain headline numbers. No visual tasks on text-only models or sole Sarvam benchmark claims.
- Trial Sarvam trace/log analysis and doc summaries with source references and sol sampling for omissions and invented claims. Tool diagnostics flag steps for planned semantic review; sol validates a sample.
- Put `SARVAM_API_KEY` only in gitignored `.env`.

## Testing and evals
- Use the highest parallelism this 12-core machine allows: vitest's default thread pool (don't serialise); `AGENT_CONCURRENCY` as high as RAM allows (about 6 browsers).
- Don't run the unit suite while a big eval is running; they compete for RAM.
- Run long work (evals, full suites) in the background and report when it finishes.
- Run Sarvam jobs one at a time: 30 RPM and 429 cooldowns are shared across processes; the concurrency cap of 2 is per process.

## Commands
See [setup](docs/SETUP.md#build-and-test) for build/test; [benchmarks](bench/README.md) for commands, `AGENT_*` env vars and result format.

## Benchmark focus
- Our main competitor is the accessibility-tree tool (Playwright MCP). Routine comparisons are Mantis vs tree vs screenshot. Skip browser-use and DevTools unless asked.
- Real-site runs are graded by the blind judge (`npm run bench:judge`). The judge must differ from the agent under test. Keep Codex `gpt-6.1-sol`, high reasoning, as the default judge until the calibration gate passes: at least 100 packets, 30 tasks, 95% agreement, and no more than 2% false successes. Use Sonnet (`JUDGE_PROVIDER=claude`) only where Codex isn't, such as cloud sessions.
- Sarvam judge calibration and the first-pass filter failed: [measurements](bench/README.md#measured-sarvam-snapshot-2026-10-17). Text-only evidence mode needs fresh calibration. The different-model rule includes aliases.
- Plan a frozen real-site set of about 30 tasks with reviewed deterministic answer keys where stable; complete opted-in validators route captured final state before judging, while missing evidence falls back and access blocks remain blocked adjudications. Legacy checks can force failure after judging; they do not establish success or skip model calls.
- Before briefing a cloud eval, read [Running in the cloud](bench/README.md#running-in-the-cloud). Include real-site task rows inline: the file is gitignored and gated.
- Every agent task needs a grader test in `test/fixture-verification.test.ts` with a passing case and a near-miss failing case.

## Git
- Commit or push only when the user asks. Don't commit `bench/results/agent-debug.*` or `codex-smoke.*`.
