#!/usr/bin/env bash
# Wait for the Haiku run to finish (result file appears with 96 rows), then run Luna and judge both.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
while pgrep -f "AGENT_OUT=long-live-v1-final-haiku" >/dev/null 2>&1 || ! grep -q "wrote bench/results/long-live-v1-final-haiku" bench/results/long-live-v1-final-haiku.out.log 2>/dev/null; do sleep 20; done
bash scripts/run-long-live-final.sh luna
bash scripts/run-long-live-final.sh judge
