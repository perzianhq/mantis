#!/usr/bin/env bash
# Rerun of the 5 cells that failed on grader/token-cap issues (1 run each), on the fixed code.
# Sarvam jobs run one at a time against the shared 30 RPM limit. Status file for the watcher.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
d=.codex-jobs; l=rerun5
st() { printf 'label=%s\nstate=%s\nstart=%s\nend=%s\nexit=%s\n' "$l" "$1" "$s" "$2" "$3" > $d/$l.status; }
s=$(date -u +%FT%TZ); st running "" ""
set -a; . ./.env; set +a
export AGENT_PROVIDER=sarvam AGENT_MODEL=deepseek-v4.1-flash AGENT_RUNS=1 SARVAM_CONCURRENCY=1 SARVAM_RPM=30
AGENT_APPROACHES=mantis AGENT_TASKS=cookie-cart AGENT_OUT=rerun5-mantis npm run bench:agent > $d/$l.log 2>&1; c1=$?
AGENT_APPROACHES=screenshot AGENT_TASKS=churned-max,booking-date,long-shop,long-admin AGENT_OUT=rerun5-screenshot npm run bench:agent > $d/$l-screenshot.log 2>&1; c2=$?
c=$((c1||c2))
st "$([ $c -eq 0 ] && echo done || echo failed)" "$(date -u +%FT%TZ)" "$c"
exit $c
