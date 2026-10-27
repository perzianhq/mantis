#!/usr/bin/env bash
# Mantis-only Haiku recheck of the two Gutenberg book tasks after the offscreen-budget fix.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_APPROACHES=mantis AGENT_RUNS=3 AGENT_CONCURRENCY=4 AGENT_TIMEOUT_S=1200
AGENT_SUITE=long-live-v1 AGENT_OUT=long-live-v1-haiku-budgetfix-20261027 \
  AGENT_TASKS=longlive-gutenberg-novels,longlive-gutenberg-gothic \
  npm run bench:agent > bench/results/long-live-v1-haiku-budgetfix-20261027.out.log 2>&1
