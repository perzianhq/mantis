#!/usr/bin/env bash
# Mantis-only Haiku recheck of dickens and wiki-probes on HEAD (offscreen-budget fix) with tool timing on.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_APPROACHES=mantis AGENT_RUNS=3 AGENT_CONCURRENCY=4 AGENT_TIMEOUT_S=1200 MANTIS_TIMING=1
AGENT_SUITE=long-live-v1 AGENT_OUT=long-live-v1-haiku-recheck-20261027 \
  AGENT_TASKS=longlive-gutenberg-dickens-search,longlive-wiki-probes \
  npm run bench:agent > bench/results/long-live-v1-haiku-recheck-20261027.out.log 2>&1
