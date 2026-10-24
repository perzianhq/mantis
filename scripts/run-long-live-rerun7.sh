#!/usr/bin/env bash
# Rerun every remaining judged failure from the merged long-live-v1 results, then judge. Replace-if-improved is done by merge-long-live.mjs.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
export AGENT_SUITE=long-live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis,tree AGENT_RUNS=3 AGENT_CONCURRENCY=6
luna="longlive-wiki-moons|mantis|3,longlive-gutenberg-gothic|tree|1,longlive-gutenberg-gothic|tree|2,longlive-gutenberg-gothic|tree|3,longlive-selenium-window-frames-upload|tree|1,longlive-selenium-window-frames-upload|tree|2,longlive-selenium-window-frames-upload|tree|3"
haiku="longlive-internet-window-frames-upload|tree|2"
AGENT_PROVIDER=codex AGENT_MODEL=gpt-6-luna AGENT_REASONING=medium AGENT_ROWS="$luna" AGENT_OUT=long-live-v1-rerun7-luna npm run bench:agent > bench/results/long-live-v1-rerun7-luna.out.log 2>&1
AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_ROWS="$haiku" AGENT_OUT=long-live-v1-rerun7-haiku npm run bench:agent > bench/results/long-live-v1-rerun7-haiku.out.log 2>&1
for n in rerun7-luna rerun7-haiku; do
  JUDGE_IN=long-live-v1-$n npm run bench:judge > bench/results/long-live-v1-$n-judge.out.log 2>&1
done
