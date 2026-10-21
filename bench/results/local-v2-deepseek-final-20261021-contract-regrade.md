# Offline saved-run regrade

Source: `bench\results\local-v2-deepseek-final-20261021.json` (SHA-256 `ffa0a4898f12a8d9762bd164adbbd23ffb3bcd26d4f9cbd8e0b394d1ccbfbfdf`).

Answer regrade: 397 pass, 35 fail, 0 unknown; changes: 33 wrong-answer → success and 0 success → wrong-answer.
Legacy fixture checks: 416 pass, 16 fail, 0 unknown. Hardened state: 0 unknown/rerun-needed.

## Runs needing evidence, task review, or a rerun

| Task | Approach | Run | Answer | Legacy fixture | Hardened state | Why |
| --- | --- | ---: | --- | --- | --- | --- |

## Limits

- Answers are regraded from the complete saved provider reply, not the truncated result.answer display field. Answer-change labels compare a replayed current legacy regex to strict current grading; they are not inferred from legacy outcome/state booleans.
- Legacy fixtureCheck is only a historical boolean. It is reported separately and never treated as authoritative hardened state evidence.
- A historical run with a task state check and no persisted authoritative observations matched to its task and attempt is unknown/rerun-needed even if its answer passes.
- Timeouts, crashes, CLI errors, connection failures, and invalid/non-completed results are never promoted by an answer regrade.
