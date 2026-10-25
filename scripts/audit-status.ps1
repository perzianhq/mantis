param([Parameter(Mandatory = $true)][string]$Out)
# Live tally for `bench:judge-audit run`, read from the local output file only.
$last = ''
while ($true) {
  $line = (Get-Content $Out -ErrorAction SilentlyContinue | Select-String '^audit judged' | Select-Object -Last 1)
  if ($line -and "$line" -ne $last) { $last = "$line"; Clear-Host; Write-Host $last }
  Start-Sleep 1
}
