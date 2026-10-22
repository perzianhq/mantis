# One-line live status. Local only (parses the run's output log and agent-logs dir); makes no API calls.
param([string]$Dir = "", [int]$Total = 75, [string]$Out = "", [int]$Every = 1)
while ($true) {
  $started = 0
  if ($Dir) { $started = (Get-ChildItem "$Dir/*.jsonl" -ErrorAction SilentlyContinue | Measure-Object).Count }
  $per = [ordered]@{}; $done = 0
  if ($Out -and (Test-Path $Out)) {
    foreach ($l in (Get-Content $Out)) {
      if ($l -match '^\[agent\] \((\d+)/\d+\) \S+ / (\S+) / run \d+ \.\.\. (\w+)') {
        $a = $Matches[2]; if (-not $per.Contains($a)) { $per[$a] = @(0, 0) }
        $per[$a][1]++; $done++
        if ($Matches[3] -eq 'success') { $per[$a][0]++ }
      }
    }
  }
  $score = ($per.Keys | ForEach-Object { "{0} {1}/{2}" -f $_, $per[$_][0], $per[$_][1] }) -join ' | '
  $line = "{0:HH:mm:ss}  done {1}/{2}  running {3}  |  {4}" -f (Get-Date), $done, $Total, [Math]::Max(0, $started - $done), $score
  Clear-Host; Write-Host $line
  Start-Sleep $Every
}
