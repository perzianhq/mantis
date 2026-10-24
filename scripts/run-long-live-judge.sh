#!/usr/bin/env bash
# Judge one finished long-live-v1 result. Usage: run-long-live-judge.sh final-haiku|final-luna
# For a run still in progress, waits until its out.log reports the result was written.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
set -a; [ -f .env ] && . ./.env; set +a
export PATH="/c/Users/aadit/.codex/plugins/.plugin-appserver:$PATH"
n="$1"
until grep -q "wrote bench/results/long-live-v1-$n" "bench/results/long-live-v1-$n.out.log" 2>/dev/null; do sleep 20; done
JUDGE_IN="long-live-v1-$n" npm run bench:judge > "bench/results/long-live-v1-$n-judge.out.log" 2>&1
