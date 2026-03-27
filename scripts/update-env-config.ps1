# Script to update .env file with new Supabase configuration
# This script updates the .env file with the new DWS Supabase project credentials

$envFile = ".env"
$envExampleFile = ".env.example"

# Check if .env file exists
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  .env file does not exist. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path $envExampleFile) {
        Copy-Item $envExampleFile $envFile
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example file not found. Please create .env manually." -ForegroundColor Red
        exit 1
    }
}

# Read current .env file
$envContent = Get-Content $envFile -Raw

# New Supabase configuration values
# ⚠️  REPLACE THESE WITH YOUR ACTUAL CREDENTIALS — never commit real secrets
$newConfig = @{
    "VITE_SUPABASE_URL" = "<YOUR_SUPABASE_URL>"
    "VITE_SUPABASE_ANON_KEY" = "<YOUR_SUPABASE_ANON_KEY>"
    "SUPABASE_SERVICE_ROLE_KEY" = "<YOUR_SUPABASE_SERVICE_ROLE_KEY>"
    "VITE_SUPABASE_REDIRECT_URL" = "http://localhost:3000/auth/callback"
    "VITE_SUPABASE_SITE_URL" = "https://dws.digitalqatalyst.com"
    "NODE_ENV" = "development"
}

Write-Host "🔧 Updating .env file with new Supabase configuration..." -ForegroundColor Cyan

# Update each environment variable
$lines = $envContent -split "`n"
$updatedLines = @()
$keysUpdated = @{}

foreach ($line in $lines) {
    $trimmedLine = $line.Trim()
    $updated = $false
    
    foreach ($key in $newConfig.Keys) {
        if ($trimmedLine -match "^$key\s*=") {
            $updatedLines += "$key=$($newConfig[$key])"
            $keysUpdated[$key] = $true
            $updated = $true
            Write-Host "  ✅ Updated $key" -ForegroundColor Green
            break
        }
    }
    
    if (-not $updated -and $trimmedLine.Length -gt 0) {
        $updatedLines += $line
    }
}

# Add any new variables that weren't found
foreach ($key in $newConfig.Keys) {
    if (-not $keysUpdated.ContainsKey($key)) {
        $updatedLines += "$key=$($newConfig[$key])"
        Write-Host "  ✅ Added $key" -ForegroundColor Green
    }
}

# Rebuild content
$envContent = $updatedLines -join "`n"

# Write updated content back to .env file
Set-Content -Path $envFile -Value $envContent -NoNewline

Write-Host ""
Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your development server" -ForegroundColor White
Write-Host "  2. Verify the configuration is working" -ForegroundColor White
Write-Host "  3. Test the Communities feature" -ForegroundColor White
Write-Host ""

