param([string]$Dir = "bench/results/agent-logs/regression-mantis-local-v1-nav-fixes-20261021", [int]$Total = 75, [string]$Job = ".codex-jobs/terra-sol-p2.status", [string]$Out = "")
while ($true) {
  Clear-Host
  Get-Date
  $files = Get-ChildItem "$Dir/*.jsonl" -ErrorAction SilentlyContinue
  $started = ($files | Measure-Object).Count
  $done = ($files | Where-Object { Test-Path ($_.FullName -replace '\.jsonl$', '.final.png') } | Measure-Object).Count
  "runs started: $started/$Total  finished: $done/$Total  ($Dir)"
  if (Test-Path $Job) { Select-String -Path $Job -Pattern '^(label|state)=' | ForEach-Object { $_.Line } }
  if ($Out -and (Test-Path $Out)) { "--- $Out (last 15 lines)"; Get-Content $Out -Tail 15 }
  Start-Sleep 180
}
