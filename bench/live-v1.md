# live-v1: frozen public live-site benchmark

`live-v1` is a 30-task, public, read-only live-site cohort. It is separate from every local suite and from the gated Online-Mind2Web `realsite-tasks.json` source.

The frozen allocation is six families of five tasks: standards, documentation, civic reference, open data, site navigation, and interactive exploration. It has 20 deterministic terminal-state contracts and 10 task-specific blind-judge contracts, with 8 easy, 14 medium, and 8 hard tasks. The catalog spans more than 15 independent sites; no site has more than three rows.

The immutable task IDs and contract hash are in [manifests/live-v1.json](manifests/live-v1.json). Each source fingerprint is a SHA-256 of its canonical URL plus the task-specific grading contract, deliberately not a volatile HTML hash.

## Run plan

The scorecard is three approaches × three repeats × all 30 rows. The fixed approaches are Mantis, Playwright accessibility tree, and screenshot; execution has a 600-second limit and Sarvam's default live-v1 completion budget is 50 steps.

```powershell
$env:AGENT_SUITE = 'live-v1'
$env:AGENT_TASKS = 'all'
$env:AGENT_APPROACHES = 'mantis,tree,screenshot'
$env:AGENT_RUNS = '3'
$env:AGENT_MAX_STEPS = '50'
$env:AGENT_TIMEOUT_S = '600'
npm run bench:agent
```

`AGENT_TASKS=all` is deliberately different for this suite: it selects all 30 rows, including the 10 judged rows. Evidence is captured by the harness after browser actions; deterministic rows require a successful final reply, one terminal capture, the canonical final URL/query, visible expected evidence, and any required terminal form state. Interactive/custom-control gaps remain blind judged using their row-specific rubrics.

## Preflight status

[live-v1-preflight.json](live-v1-preflight.json) is an offline inventory created because no external browser preflight was available during setup. Every candidate is explicitly `unverified-offline`; it does not claim that a site was reachable or that its content was observed.

The free collector makes no model calls. It defaults to this safe offline inventory:

```powershell
npx tsx bench/agent/live-v1-preflight.ts
```

To run public GET probes before a later promotion, opt in explicitly:

```powershell
$env:LIVE_V1_PREFLIGHT_NETWORK = '1'
npx tsx bench/agent/live-v1-preflight.ts
```

Review changed redirects, access blocks, and page text before changing a catalog contract or replacing this frozen cohort. Do not rerun a paid benchmark merely to preflight sources.
