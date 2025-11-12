# Simple script to add missing environment variables to .env file
$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Raw

# Check and add missing variables
$varsToAdd = @()

if ($content -notmatch "VITE_SUPABASE_REDIRECT_URL") {
    $varsToAdd += "VITE_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback"
}

if ($content -notmatch "VITE_SUPABASE_SITE_URL") {
    $varsToAdd += "VITE_SUPABASE_SITE_URL=https://dws.digitalqatalyst.com"
}

if ($varsToAdd.Count -gt 0) {
    Write-Host "Adding missing environment variables..." -ForegroundColor Cyan
    Add-Content -Path $envFile -Value ""
    Add-Content -Path $envFile -Value "# DWS Communities Supabase Auth Configuration"
    foreach ($var in $varsToAdd) {
        Add-Content -Path $envFile -Value $var
        Write-Host "  Added: $var" -ForegroundColor Green
    }
    Write-Host "Done!" -ForegroundColor Green
} else {
    Write-Host "All required variables are already present." -ForegroundColor Green
}

