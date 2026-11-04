# Real-agent eval

> Claude Code (`claude -p`) (requested model `claude-haiku-5-5`) does each task with one browser approach at a time. Correctness uses the expected answer and, for instrumented local fixtures, a page-state check. Token values come from the Claude stream; reported cost is retained; missing values stay unknown. An LLM is in the loop, so numbers vary run to run.

- Date: 2026-11-04; runs per task and approach: 2; 6 runs in parallel.
- Scope: 3 tasks × 1 approaches × 2 runs = 6 logical runs; 6 recorded so far; 6 total attempts including retries.
- Claude runtime: 2.1.310 (Claude Code); resolved model(s): claude-haiku-5-5.
- MCP startup (spawn + warm-up) is separate from Claude execution time. Execution runs from process launch to exit; startup is launch to first init event. Fixture verification and cleanup are timed separately. These include contention from parallel runs.
- Browser observation size counts text characters and image blocks returned by browser MCP tools. It is a separate diagnostic from Claude-reported input tokens; the benchmark does not subtract it to estimate overhead.
- Mantis: all its tools. Accessibility tree: Playwright MCP 0.0.83 (headless, isolated) without its JavaScript-running tools. Screenshots: an Anthropic-style computer tool (bench/agent/screenshot-mcp.ts), plus navigate and back.
- No skill, no system prompt beyond the task; built-in tools off. 
- A retry after an MCP connection failure is retained as a separate attempt and its measured cost is included. Connection failures are excluded from the correctness denominator; timeouts, CLI failures, and wrong answers after connection count as attempted failures.

## Summary

| | Mantis |
|---|---:|
| First-pass correct (attempt 1) | 6 / 6 |
| After reruns / merged correct | 6 / 6 |
| Rows with unknown usage | 0 rows have unknown usage |
| Correct (legacy terminal row) | 6 / 6 |
| Connection-failure attempts | 0 |
| Logical runs ending in connection failure | 0 |
| Other attempted failures | 0 |
| Tool calls (including retries) | 20 |
| MCP tool errors (including retries) | 0 |
| Browser observation text (observed chars) | 13,939 |
| Browser observation images (observed blocks) | 0 |
| Normal input tokens (total) | 48 |
| Cache-write input tokens (total) | 58,378 |
| Cache-read input tokens (total) | 160,625 |
| Output tokens (total) | 2,855 |
| Total input tokens incl. cache (legacy) | 219,051 |
| MCP startup (total, s) | 12.5 |
| CLI startup (total, s) | 14.1 |
| CLI execution (total, s) | 76.8 |
| CLI wall (total, s) | 90.9 |
| Fixture verification (total, s) | 0.0 |
| Cleanup (total, s) | 1.7 |
| Harness capture (total, s) | 0.0 |
| Cost estimate (USD; including retries) | 0.01 |

- Effective budgets: no provider max-step loop; timeout 600s per attempt.

## Per run

| Task | Approach | Run | Status | First pass | Recovery | Attempts | Max steps | Timeout (s) | Tool calls | Tool errors | Obs. chars | Obs. images | Normal in | Cache write | Cache read | Output | MCP startup (s) | CLI startup (s) | CLI execution (s) | CLI wall (s) | Verify (s) | Cleanup (s) | Answer / error |
|---|---|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,968 | 0 | 8 | 9,558 | 26,524 | 639 | 2.1 | 2.3 | 12.4 | 14.7 | 0.00 | 0.29 | feed-087 \| Pin \| Dispatch 087 pinned. |
| `v2-list-virtual-target` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 1,892 | 0 | 8 | 9,571 | 26,510 | 482 | 2.1 | 2.3 | 12.7 | 15.0 | 0.00 | 0.27 | feed-087 \| Pin \| Confirmation: Dispatch 087 pinned. |
| `v2-list-nested-scroll` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 3,508 | 0 | 8 | 10,208 | 27,900 | 595 | 2.1 | 2.3 | 14.8 | 17.1 | 0.00 | 0.26 | inbox-062 \| Archive \| inbox-062 archived |
| `v2-list-nested-scroll` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 3 | 0 | 3,508 | 0 | 8 | 10,218 | 27,910 | 507 | 2.1 | 2.5 | 13.1 | 15.5 | 0.00 | 0.28 | inbox-062 \| Archive \| inbox-062 archived |
| `capability-colour-swatch` | Mantis | 1 | success | success | success | 1 | n/a | 600 | 3 | 0 | 925 | 0 | 8 | 8,983 | 25,683 | 302 | 2.1 | 2.3 | 10.3 | 12.6 | 0.00 | 0.32 | SW-38 |
| `capability-colour-swatch` | Mantis | 2 | success | success | success | 1 | n/a | 600 | 5 | 0 | 2,138 | 0 | 8 | 9,840 | 26,098 | 330 | 2.1 | 2.3 | 13.5 | 15.8 | 0.00 | 0.24 | SW-38 |

## Per attempt cost and execution

| Task | Approach | Run | Attempt | Status | Max steps | Timeout (s) | Tool calls | Total input tokens | CLI execution (s) | Cost USD | Cost INR | Usage |
|---|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `v2-list-virtual-target` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 36,090 | 12.4 | 0.002 | unknown | known |
| `v2-list-virtual-target` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 36,089 | 12.7 | 0.002 | unknown | known |
| `v2-list-nested-scroll` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 38,116 | 14.8 | 0.003 | unknown | known |
| `v2-list-nested-scroll` | Mantis | 2 | 1 | success | n/a | 600 | 3 | 38,136 | 13.1 | 0.003 | unknown | known |
| `capability-colour-swatch` | Mantis | 1 | 1 | success | n/a | 600 | 3 | 34,674 | 10.3 | 0.002 | unknown | known |
| `capability-colour-swatch` | Mantis | 2 | 1 | success | n/a | 600 | 5 | 35,946 | 13.5 | 0.002 | unknown | known |
