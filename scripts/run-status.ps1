param([string]$Dir = "bench/results/agent-logs/regression-mantis-local-v1-nav-fixes-20261021", [int]$Total = 75, [string]$Job = ".codex-jobs/terra-sol-p2.status")
while ($true) {
  Clear-Host
  Get-Date
  $n = (Get-ChildItem "$Dir/*.log" -ErrorAction SilentlyContinue).Count
  "runs done: $n/$Total  ($Dir)"
  if (Test-Path $Job) { Select-String -Path $Job -Pattern '^(label|state)=' | ForEach-Object { $_.Line } }
  Start-Sleep 180
}
