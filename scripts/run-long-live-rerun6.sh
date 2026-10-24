#!/usr/bin/env bash
# Rerun rows affected by the tree upload-root, sanitizer-independent harness fix and the combobox popup diagnostic (Luna).
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
export AGENT_SUITE=long-live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis,tree AGENT_RUNS=3 AGENT_CONCURRENCY=6
rows="longlive-internet-window-frames-upload|tree|1,longlive-internet-window-frames-upload|tree|2,longlive-internet-window-frames-upload|tree|3,longlive-selenium-window-frames-upload|tree|1,longlive-selenium-window-frames-upload|tree|2,longlive-selenium-window-frames-upload|tree|3,longlive-met-monet-search|mantis|1,longlive-met-monet-search|mantis|2,longlive-gutenberg-dickens-search|mantis|3"
AGENT_PROVIDER=codex AGENT_MODEL=gpt-6-luna AGENT_REASONING=medium AGENT_ROWS="$rows" AGENT_OUT=long-live-v1-rerun6-luna npm run bench:agent > bench/results/long-live-v1-rerun6-luna.out.log 2>&1
