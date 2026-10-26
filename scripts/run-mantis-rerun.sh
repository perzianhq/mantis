#!/usr/bin/env bash
# Mantis-only live-v1 rerun after the Track B speed fixes: 30 tasks x 3 runs, concurrency 6 per model.
# Usage: run-mantis-rerun.sh build | luna | haiku   (build once, then run luna and haiku in parallel)
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
export AGENT_SUITE=live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis AGENT_RUNS=3 AGENT_MAX_STEPS=50 AGENT_TIMEOUT_S=600 AGENT_CONCURRENCY=6 MANTIS_TIMING=1
case "$1" in
  build) npm run build ;;
  luna) AGENT_PROVIDER=codex AGENT_MODEL=gpt-6-luna AGENT_REASONING=medium AGENT_OUT=live-v1-luna-mantis-rerun-20261026 npx tsx bench/agent/run.ts > bench/results/live-v1-luna-mantis-rerun-20261026.out.log 2>&1 ;;
  haiku) AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_OUT=live-v1-haiku-mantis-rerun-20261026 npx tsx bench/agent/run.ts > bench/results/live-v1-haiku-mantis-rerun-20261026.out.log 2>&1 ;;
esac
