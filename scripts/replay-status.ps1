param([Parameter(Mandatory)][string]$Log, [Parameter(Mandatory)][int]$Total, [string[]]$Builds = @('new', 'fix'))
# Live one-row status for bench/latency-ab.mjs: arms done per build (read from its local log, no API calls).
# $Total = tasks x reps per build (upper bound; tasks failing preflight are skipped).
$start = Get-Date
$last = ''
while ($true) {
  $text = if (Test-Path $Log) { Get-Content $Log -Raw } else { '' }
  $parts = foreach ($b in $Builds) {
    $ms = [regex]::Matches($text, "\[latency-ab\] \S+ $b \d+/\d+: ([\d.]+)ms") | ForEach-Object { [double]$_.Groups[1].Value }
    $n = @($ms).Count
    $med = if ($n) { [int](@($ms | Sort-Object)[[int]($n / 2)]) } else { 0 }
    "$b $n/$Total"
  }
  $skipped = ([regex]::Matches($text, 'preflight skipped')).Count
  $sec = [int]((Get-Date) - $start).TotalSeconds
  $line = ($parts -join ' | ') + " | $([int]($sec / 60))m$($sec % 60)s"
  $done = $text -match '"outFile"'
  [Console]::Write("`r" + $line.PadRight(44))
  if ($done) { break }
  Start-Sleep 1
}
Write-Host ''
Get-Content $Log | Select-Object -Last 3
