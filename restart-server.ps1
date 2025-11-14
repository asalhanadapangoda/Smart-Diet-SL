# Script to restart the server and check database connection

Write-Host "🛑 Stopping existing server processes..." -ForegroundColor Yellow

# Find and stop node processes on port 5000
$processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $processes) {
    Write-Host "Stopping process $pid..." -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

Write-Host "`n🚀 Starting server..." -ForegroundColor Green
Set-Location Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Set-Location ..

Write-Host "`n⏳ Waiting for server to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "`n🔍 Checking server status..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri http://localhost:5000/api/health -UseBasicParsing
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host $health.Content
    
    Write-Host "`n🔍 Checking database connection..." -ForegroundColor Cyan
    $dbHealth = Invoke-WebRequest -Uri http://localhost:5000/api/health/db -UseBasicParsing
    $dbStatus = $dbHealth.Content | ConvertFrom-Json
    Write-Host "Database Status: $($dbStatus.status)" -ForegroundColor $(if ($dbStatus.status -eq 'connected') { 'Green' } else { 'Red' })
    Write-Host $dbHealth.Content
} catch {
    Write-Host "❌ Server not responding yet. Please check the server terminal for errors." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Done! Check the server terminal window for detailed logs." -ForegroundColor Green

