#!/usr/bin/env bash
# Rerun of long-live-v1 rows hit by site/network loading, the calendar-day and the upload-filename defects, on the fixed build.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export AGENT_SUITE=long-live-v1 AGENT_TASKS=all AGENT_APPROACHES=mantis,tree AGENT_RUNS=3 AGENT_CONCURRENCY=6
t=longlive-
luna=""; haiku=""
for r in 1 2 3; do
  for a in mantis tree; do luna+="${t}sauce-cart-revise|$a|$r,${t}sauce-checkout-review|$a|$r,"; done
  luna+="${t}internet-window-frames-upload|mantis|$r,${t}form-selenium-review|mantis|$r,"
  haiku+="${t}form-selenium-review|mantis|$r,${t}sauce-cart-revise|mantis|$r,"
done
luna+="${t}internet-window-frames-upload|tree|1,${t}internet-window-frames-upload|tree|2,${t}met-vangogh|mantis|1,${t}met-vangogh|mantis|2,${t}met-rembrandt-search|mantis|1,${t}met-rembrandt-search|mantis|2,${t}gutenberg-dickens-search|mantis|3"
haiku+="${t}sauce-cart-revise|tree|1,${t}sauce-checkout-review|mantis|2"
AGENT_PROVIDER=codex AGENT_MODEL=gpt-6-luna AGENT_REASONING=medium AGENT_ROWS="$luna" AGENT_OUT=long-live-v1-rerun2-luna npm run bench:agent > bench/results/long-live-v1-rerun2-luna.out.log 2>&1
