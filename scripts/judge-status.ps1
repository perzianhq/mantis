param(
  [Parameter(Mandatory = $true)][string]$Out,
  [Parameter(Mandatory = $true)][int]$Total
)
# Live tally for `npm run bench:judge`, read from the local output file only.
$last = ''
while ($true) {
  $lines = @(Get-Content -LiteralPath $Out -ErrorAction SilentlyContinue | Where-Object { $_ -match '^\[judge\] \(\d+/\d+\)' })
  $n = $lines.Count
  $s = @($lines | Where-Object { $_ -match '\.\.\. success\s*$' }).Count
  $f = @($lines | Where-Object { $_ -match '\.\.\. failure\s*$' }).Count
  $line = "judged $n/$Total  success $s  failure $f  other $($n - $s - $f)"
  if ($line -ne $last) { Clear-Host; $line; $last = $line }
  Start-Sleep -Seconds 1
}
