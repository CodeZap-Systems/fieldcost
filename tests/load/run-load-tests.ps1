# Load Test Runner
param([string]$BaseUrl = "http://localhost:3000")

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ResultsDir = "load-test-results-$Timestamp"
New-Item -ItemType Directory -Force -Path $ResultsDir > $null

Write-Host "FieldCost Load Tests" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

$Tests = @("auth-load-test.js", "project-load-test.js", "task-load-test.js", "invoice-load-test.js")

foreach ($TestFile in $Tests) {
    Write-Host "Running: $TestFile" -ForegroundColor Yellow
    $TestPath = "tests/load/$TestFile"
    
    if (Test-Path $TestPath) {
        $env:BASE_URL = $BaseUrl
        & k6 run $TestPath --out json="$ResultsDir/$TestFile.json" 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PASSED" -ForegroundColor Green
        } else {
            Write-Host "FAILED" -ForegroundColor Red
        }
    } else {
        Write-Host "NOT FOUND" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Results in: $ResultsDir" -ForegroundColor Cyan
