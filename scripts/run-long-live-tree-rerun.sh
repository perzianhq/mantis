#!/usr/bin/env bash
# Rerun failed tree rows (excluding upload tasks) from long-live-v1 on a stable connection. Rows come from .tree-rows.json.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
export AGENT_SUITE=long-live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis,tree AGENT_RUNS=3 AGENT_CONCURRENCY=6
luna=$(node -e "console.log(require('./.tree-rows.json').luna.join(','))")
haiku=$(node -e "console.log(require('./.tree-rows.json').haiku.join(','))")
AGENT_PROVIDER=codex AGENT_MODEL=gpt-6-luna AGENT_REASONING=medium AGENT_ROWS="$luna" AGENT_OUT=long-live-v1-rerun3-luna npm run bench:agent > bench/results/long-live-v1-rerun3-luna.out.log 2>&1
AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_ROWS="$haiku" AGENT_OUT=long-live-v1-rerun3-haiku npm run bench:agent > bench/results/long-live-v1-rerun3-haiku.out.log 2>&1
