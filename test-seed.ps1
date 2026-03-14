# Simple script to test the demo seed endpoint
$Uri = "http://localhost:3000/api/demo/seed"
$Body = "{}"
$Headers = @{ "Content-Type" = "application/json" }

try {
    $response = Invoke-WebRequest -Uri $Uri -Method POST -Body $Body -Headers $Headers -UseBasicParsing -TimeoutSec 30
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
        Write-Host "Response Content: $content"
    }
}
