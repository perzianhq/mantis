#!/usr/bin/env bash
# Clean full long-live-v1 run (16 tasks x mantis,tree x 3 runs) for Luna then Haiku at concurrency 12, then judge each. No merging.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
export AGENT_SUITE=long-live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis,tree AGENT_RUNS=3 AGENT_CONCURRENCY=12
AGENT_PROVIDER=codex AGENT_MODEL=gpt-6-luna AGENT_REASONING=medium AGENT_OUT=long-live-v1-final-luna npm run bench:agent > bench/results/long-live-v1-final-luna.out.log 2>&1
AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_OUT=long-live-v1-final-haiku npm run bench:agent > bench/results/long-live-v1-final-haiku.out.log 2>&1
for n in final-luna final-haiku; do
  JUDGE_IN=long-live-v1-$n npm run bench:judge > bench/results/long-live-v1-$n-judge.out.log 2>&1
done
