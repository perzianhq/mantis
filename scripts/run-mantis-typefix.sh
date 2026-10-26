#!/usr/bin/env bash
# Haiku Mantis-only live-v1 run on the current build (type request grace + latency fixes): 30 tasks x 3 runs, concurrency 6.
# Usage: run-mantis-typefix.sh build | haiku
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export MANTIS_CHROMIUM="${MANTIS_CHROMIUM:-/c/Users/aadit/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe}"
export AGENT_SUITE=live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis AGENT_RUNS=3 AGENT_MAX_STEPS=50 AGENT_TIMEOUT_S=600 AGENT_CONCURRENCY=6 MANTIS_TIMING=1
case "$1" in
  build) npm run build ;;
  haiku) AGENT_PROVIDER=claude AGENT_MODEL=claude-haiku-5-5 AGENT_OUT=live-v1-haiku-mantis-typefix-20261026 npx tsx bench/agent/run.ts > bench/results/live-v1-haiku-mantis-typefix-20261026.out.log 2>&1 ;;
esac
