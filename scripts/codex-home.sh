#!/usr/bin/env bash
# Print the CODEX_HOME of the first Codex account that is not marked exhausted (rotation order: 7859, w, amit).
# Usage: export CODEX_HOME=$(scripts/codex-home.sh)      mark one used up: scripts/codex-home.sh --exhausted <name>
#        clear markers: scripts/codex-home.sh --reset
# Accounts and sign-in are managed outside this repo (see software4/CLAUDE.md); this script never reads auth.json.
STATE="${CODEX_ROTATE_STATE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.codex-jobs/rotate-state}"
HOMES="${CODEX_HOMES:-7859:C:/Users/aadit/.codex-7859 w:C:/Users/aadit/.codex-w amit:C:/Users/aadit/.codex-amit}"
mkdir -p "$STATE"
case "${1:-}" in
  --exhausted) date -u +%FT%TZ > "$STATE/EXHAUSTED_$2"; exit 0 ;;
  --reset) rm -f "$STATE"/EXHAUSTED_*; exit 0 ;;
esac
for entry in $HOMES; do
  name=${entry%%:*}; home=${entry#*:}
  [ -f "$STATE/EXHAUSTED_$name" ] && continue
  [ -f "$home/auth.json" ] || continue
  echo "$name:$home"; exit 0
done
exit 1
