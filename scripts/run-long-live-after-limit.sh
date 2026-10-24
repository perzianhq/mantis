#!/usr/bin/env bash
# Runs Luna, then judges both models (used after a Codex usage-limit interruption).
cd "$(dirname "$0")/.." || exit 1
bash scripts/run-long-live-final.sh luna
bash scripts/run-long-live-final.sh judge
