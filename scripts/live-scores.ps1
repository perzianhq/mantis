# Plain-loop live scores for the main run. Local only (parses output logs); no API calls.
param([string]$Prefix = "long-live-v1-main", [int]$Total = 96, [int]$Every = 10)
while ($true) {
  $t = Get-Date -Format HH:mm:ss
  foreach ($m in 'haiku', 'luna') {
    $f = "bench/results/$Prefix-$m.out.log"
    $per = @{}; $done = 0
    if (Test-Path $f) {
      foreach ($l in (Get-Content $f)) {
        if ($l -match '^\[agent\] \((\d+)/\d+\) \S+ / (\S+) / run \d+ \.\.\. (\w+)') {
          $a = $Matches[2]; if (-not $per.ContainsKey($a)) { $per[$a] = @(0, 0) }
          $per[$a][1]++; $done++
          if ($Matches[3] -eq 'success') { $per[$a][0]++ }
        }
      }
    }
    $score = ($per.Keys | Sort-Object | ForEach-Object { "{0} {1}/{2}" -f $_, $per[$_][0], $per[$_][1] }) -join ' | '
    Write-Host ("{0}  {1,-6} done {2}/{3}  |  {4}" -f $t, $m, $done, $Total, $score)
  }
  Write-Host ""
  Start-Sleep $Every
}
