#!/usr/bin/env bash
# Mantis-only Haiku rerun on cases where the 8 post-0.1.9 fixes should show. Usage: run-fix-compare.sh long | short
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_APPROACHES=mantis AGENT_RUNS=3 AGENT_CONCURRENCY=4 AGENT_TIMEOUT_S=1200
case "$1" in
  long) AGENT_SUITE=long-live-v1 AGENT_OUT=long-live-v1-haiku-fixes-20261027 \
    AGENT_TASKS=longlive-wiki-probes,longlive-wiki-moons,longlive-gutenberg-novels,longlive-gutenberg-gothic,longlive-gutenberg-dickens-search,longlive-gutenberg-shakespeare-search,longlive-met-monet-search \
    npm run bench:agent > bench/results/long-live-v1-haiku-fixes-20261027.out.log 2>&1 ;;
  short) AGENT_SUITE=live-v1 AGENT_OUT=live-v1-haiku-fixes-20261027 \
    AGENT_TASKS=livev1-standards-rfc-8259,livev1-standards-rfc-9110,livev1-docs-python-json,livev1-docs-mdn-http-overview,livev1-civic-loc-about,livev1-navigation-gutenberg-search \
    npm run bench:agent > bench/results/live-v1-haiku-fixes-20261027.out.log 2>&1 ;;
esac
