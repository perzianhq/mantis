#!/usr/bin/env bash
# Broad run (deepseek-v4.1-flash, 25 fixture tasks x 3 approaches x 3 runs) with a status file the watcher reads.
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1
d=.codex-jobs; l=broad-run
st() { printf 'label=%s\nstate=%s\nstart=%s\nend=%s\nexit=%s\n' "$l" "$1" "$s" "$2" "$3" > $d/$l.status; }
s=$(date -u +%FT%TZ); st running "" ""
set -a; . ./.env; set +a
AGENT_PROVIDER=sarvam AGENT_MODEL=deepseek-v4.1-flash AGENT_RUNS=3 AGENT_APPROACHES=mantis,tree,screenshot \
AGENT_TASKS=form-subscribe,login,cookie-cart,longlist-item,pricing-team,dashboard-refresh,signup-validation,checkout-steps,booking-date,article-deep-fact,inventory-lookup,churned-max,search-pagination,feed-scroll,modal-delete,menu-settings,spa-team,plans-pick,faq-refund,iframe-pay,chart-march,long-shop,long-admin,long-onboard,long-laptops \
AGENT_OUT=broad-deepseek-v4.1-flash SARVAM_CONCURRENCY=2 SARVAM_RPM=30 npm run bench:agent > $d/$l.log 2>&1
c=$?
if [ $c -eq 0 ]; then npm --prefix bench/agent run bench:tool-diagnostics -- broad-deepseek-v4.1-flash >> $d/$l.log 2>&1; c=$?; fi
st "$([ $c -eq 0 ] && echo done || echo failed)" "$(date -u +%FT%TZ)" "$c"
exit $c
