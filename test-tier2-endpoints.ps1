#!/usr/bin/env pwsh
<#
  Tier 2 Comprehensive Endpoint Test
  Tests all Tier 2 endpoints to identify what's working and what needs fixes
#>

Write-Host "🧪 TIER 2 COMPREHENSIVE ENDPOINT TEST" -ForegroundColor Cyan
Write-Host "=" * 50

$baseUrl = "http://localhost:3000/api"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Method = "GET",
        [string]$Path,
        [string]$Description,
        [psobject]$Body = $null
    )
    
    $url = "$baseUrl$Path"
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            UseBasicParsing = $true
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params['Body'] = $Body | ConvertTo-Json
            $params['ContentType'] = 'application/json'
        }
        
        $response = Invoke-WebRequest @params
        $status = $response.StatusCode
        $result = "✅"
        
    } catch {
        $status = $_.Exception.Response.StatusCode
        if ($null -eq $status) { $status = "ERR" }
        $result = "❌"
    }
    
    Write-Host "$result $Method $Path → $status" -ForegroundColor $(if ($result -eq "✅") { "Green" } else { "Red" })
    
    [PSCustomObject]@{
        Method = $Method
        Path = $Path
        Status = $status
        Description = $Description
        Result = $result
    }
}

Write-Host "`n📊 TIER 1 FEATURES (Foundation)" -ForegroundColor Yellow
$tier1 = @(
    (Test-Endpoint -Path "/health" -Description "Health check"),
    (Test-Endpoint -Path "/projects" -Description "List projects"),
    (Test-Endpoint -Path "/tasks" -Description "List tasks"),
    (Test-Endpoint -Path "/invoices" -Description "List invoices"),
    (Test-Endpoint -Path "/customers" -Description "List customers"),
    (Test-Endpoint -Path "/items" -Description "List items"),
    (Test-Endpoint -Path "/crew" -Description "List crew")
)

Write-Host "`n📊 TIER 2 FEATURES (Growth)" -ForegroundColor Yellow
$tier2 = @(
    (Test-Endpoint -Path "/budgets" -Description "Budget tracking"),
    (Test-Endpoint -Path "/wip-tracking" -Description "WIP metrics"),
    (Test-Endpoint -Path "/invoices/export" -Description "Invoice export"),
    (Test-Endpoint -Path "/workflows" -Description "Approval workflows"),
    (Test-Endpoint -Path "/reports" -Description "Reports engine"),
    (Test-Endpoint -Path "/location-tracking" -Description "Geolocation data"),
    (Test-Endpoint -Path "/task-photos" -Description "Task photo evidence"),
    (Test-Endpoint -Path "/offline-sync-status" -Description "Offline sync status")
)

Write-Host "`n📊 FEATURES BY STATUS" -ForegroundColor Cyan
Write-Host "`nWORKING ✅" -ForegroundColor Green
$allTests = $tier1 + $tier2
$working = $allTests | Where-Object { $_.Result -eq "✅" }
foreach ($test in $working) {
    Write-Host "  $($test.Path) → $($test.Status)"
}

Write-Host "`nBROKEN ❌" -ForegroundColor Red
$broken = $allTests | Where-Object { $_.Result -eq "❌" }
if ($broken.Count -eq 0) {
    Write-Host "  None! All endpoints responding"
} else {
    foreach ($test in $broken) {
        Write-Host "  $($test.Path) → $($test.Status)"
    }
}

Write-Host "`n📈 SUMMARY" -ForegroundColor Cyan
Write-Host "Working:  $(($working).Count)/$($allTests.Count)" -ForegroundColor Green
Write-Host "Broken:   $(($broken).Count)/$($allTests.Count)" -ForegroundColor $(if ($broken.Count -gt 0) { "Red" } else { "Green" })

Write-Host "`n✅ Tier 2 endpoint validation complete"
