#!/usr/bin/env bash
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
for n in rerun6-luna rerun5-luna rerun5-haiku; do
  JUDGE_IN=long-live-v1-$n npm run bench:judge > bench/results/long-live-v1-$n-judge.out.log 2>&1
done
