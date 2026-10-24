# Live status for several runs in one tab. Local only (parses output logs); makes no API calls.
# -Runs "Label|out-file|total,Label|out-file|total"
param([string]$Runs = "", [int]$Every = 1)
$specs = $Runs -split ',' | ForEach-Object { $p = $_ -split '\|'; [pscustomobject]@{ Label = $p[0]; Out = $p[1]; Total = [int]$p[2] } }
$last = ""
while ($true) {
  $lines = foreach ($s in $specs) {
    $per = [ordered]@{}; $done = 0
    if (Test-Path $s.Out) {
      foreach ($l in (Get-Content $s.Out)) {
        if ($l -match '^\[agent\] \((\d+)/\d+\) \S+ / (\S+) / run \d+ \.\.\. (\w+)') {
          $a = $Matches[2]; if (-not $per.Contains($a)) { $per[$a] = @(0, 0) }
          $per[$a][1]++; $done++
          if ($Matches[3] -eq 'success') { $per[$a][0]++ }
        }
      }
    }
    $score = ($per.Keys | ForEach-Object { "{0} {1}/{2}" -f $_, $per[$_][0], $per[$_][1] }) -join ' | '
    "{0,-6} done {1}/{2}  |  {3}" -f $s.Label, $done, $s.Total, $score
  }
  $body = $lines -join "`n"
  if ($body -ne $last) { $last = $body; Clear-Host; Write-Host ("{0:HH:mm:ss}" -f (Get-Date)); $lines | ForEach-Object { Write-Host $_ } }
  Start-Sleep $Every
}
