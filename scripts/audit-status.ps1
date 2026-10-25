param(
  [string]$Jsonl = 'bench/results/judge-audit-run.jsonl',
  [string]$Log = '.codex-jobs/judge-audit-run.out.log',
  [int]$Total = 120
)
# One-row live status for the judge audit: reads local files only, redraws on change.
$last = ''
while ($true) {
  $n = 0
  if (Test-Path $Jsonl) { $n = @(Get-Content $Jsonl | Where-Object { $_.Trim() }).Count }
  $line = ''
  if (Test-Path $Log) {
    $m = Select-String -Path $Log -Pattern 'audit judged' | Select-Object -Last 1
    if ($m) { $line = $m.Line }
  }
  $s = "audit packets $n/$Total  |  $line"
  if ($s -ne $last) { Write-Host $s; $last = $s }
  Start-Sleep -Seconds 1
}
