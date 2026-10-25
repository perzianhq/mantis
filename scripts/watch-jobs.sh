#!/usr/bin/env bash
# Token-free watcher for Codex jobs and benchmark runs. Polls every 30s, pops a Windows
# notification and appends to .codex-jobs/watch.log on: a job ending (done/failed), a benchmark
# "ABORTED"/harness-error line, or all jobs finished. Exits after the first alert so the launching
# Claude session is woken; relaunch it to keep watching.
# Usage: scripts/watch-jobs.sh   (launch as a background Bash call)
set -u
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
dir=${WATCH_JOBS_DIR:-$root/.codex-jobs}
log=$dir/watch.log
seen=$dir/.watch-seen
cursor=$dir/.watch-cursors
touch "$seen"
touch "$cursor"
start_ts=$(date +%s)
interval=${WATCH_JOBS_INTERVAL:-30}


alert() { # message
  local msg=$1
  printf '%s %s\n' "$(date +%H:%M:%S)" "$msg" | tee -a "$log"
  if [ "${WATCH_JOBS_NO_NOTIFY:-0}" != 1 ]; then
    powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; \$n=New-Object System.Windows.Forms.NotifyIcon; \$n.Icon=[System.Drawing.SystemIcons]::Warning; \$n.Visible=\$true; \$n.ShowBalloonTip(15000,'Mantis jobs',\$env:W_MSG,'Warning'); Start-Sleep 16; \$n.Dispose()" >/dev/null 2>&1 &
  fi
}
export W_MSG=""

while true; do
  running=0
  for s in "$dir"/*.status; do
    [ -e "$s" ] || continue
    label=$(sed -n 's/^label=//p' "$s"); state=$(sed -n 's/^state=//p' "$s"); code=$(sed -n 's/^exit=//p' "$s")
    if [ "$state" = running ]; then running=$((running+1)); continue; fi
    key="$label:$state:$(sed -n 's/^end=//p' "$s")"
    if ! grep -qxF "$key" "$seen"; then
      echo "$key" >> "$seen"
      # only alert on jobs that finished after the watcher started
      if [ "$(stat -c %Y "$s")" -ge "$start_ts" ] 2>/dev/null; then
        W_MSG="Job $label $state (exit $code)"; alert "$W_MSG"; exit 0
      fi
    fi
  done
  for l in "$dir"/*.log; do
    [ -e "$l" ] || continue
    # Derive every cursor field from one immutable copy. Reading the live log
    # separately for its size and checksum can record a self-inconsistent cursor
    # if the job appends between those reads.
    snapshot=$(mktemp "$dir/.watch-snapshot.XXXXXX")
    cat "$l" > "$snapshot"
    lines=$(wc -l < "$snapshot")
    size=$(stat -c %s "$snapshot" 2>/dev/null || wc -c < "$snapshot" | tr -d '[:space:]')
    first_hash=$(sed -n '1p' "$snapshot" | cksum | awk '{print $1}')
    previous=$(awk -F '\t' -v path="$l" '$1 == path { value=$2 } END { print value + 0 }' "$cursor")
    previous_size=$(awk -F '\t' -v path="$l" '$1 == path { value=$3 } END { print value + 0 }' "$cursor")
    previous_hash=$(awk -F '\t' -v path="$l" '$1 == path { value=$4 } END { print value }' "$cursor")
    previous_content_hash=$(awk -F '\t' -v path="$l" '$1 == path { value=$5 } END { print value }' "$cursor")
    # A replacement can keep or grow its line count and retain its first line.
    # Hash the byte prefix already consumed: appends preserve it, replacements do not.
    replaced=0
    if [ "$lines" -lt "$previous" ] || [ "$size" -lt "$previous_size" ] || { [ -n "$previous_hash" ] && [ "$first_hash" != "$previous_hash" ]; }; then
      replaced=1
    elif [ "$previous_size" -gt 0 ] && [ -n "$previous_content_hash" ]; then
      consumed_hash=$(head -c "$previous_size" "$snapshot" | cksum | awk '{print $1 ":" $2}')
      [ "$consumed_hash" = "$previous_content_hash" ] || replaced=1
    fi
    [ "$replaced" -eq 1 ] && previous=0
    content_hash=$(cksum < "$snapshot" | awk '{print $1 ":" $2}')
    awk -F '\t' -v path="$l" '$1 != path' "$cursor" > "$cursor.tmp" && mv "$cursor.tmp" "$cursor"
    printf '%s\t%s\t%s\t%s\t%s\n' "$l" "$lines" "$size" "$first_hash" "$content_hash" >> "$cursor"
    if [ "$lines" -gt "$previous" ]; then
      if sed -n "$((previous + 1)),$lines p" "$snapshot" | grep -q -E '^(ABORTED: harness|Error: .*network request failed)'; then
        rm -f "$snapshot"
        W_MSG="Harness error in $(basename "$l")"; alert "$W_MSG"; exit 0
      fi
    fi
    rm -f "$snapshot"
  done
  if [ "$running" -eq 0 ]; then W_MSG="No Codex jobs running"; alert "$W_MSG"; exit 0; fi
  sleep "$interval"
done
