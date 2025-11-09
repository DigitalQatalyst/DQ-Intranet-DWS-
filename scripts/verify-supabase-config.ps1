# Script to verify Supabase configuration
Write-Host "🔍 Verifying Supabase Configuration..." -ForegroundColor Cyan
Write-Host ""

$requiredVars = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY"
)

$optionalVars = @(
    "SUPABASE_SERVICE_ROLE_KEY",
    "VITE_SUPABASE_REDIRECT_URL",
    "VITE_SUPABASE_SITE_URL",
    "NODE_ENV"
)

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env file does not exist!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envFile -Raw
$allVars = $requiredVars + $optionalVars

Write-Host "📋 Environment Variables Status:" -ForegroundColor Yellow
Write-Host ""

foreach ($var in $allVars) {
    if ($envContent -match "$var\s*=") {
        $value = [regex]::Match($envContent, "$var\s*=\s*(.+)").Groups[1].Value.Trim()
        $displayValue = if ($value.Length -gt 50) { $value.Substring(0, 50) + "..." } else { $value }
        
        if ($requiredVars -contains $var) {
            Write-Host "  ✅ $var = $displayValue" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  $var = $displayValue" -ForegroundColor Cyan
        }
    } else {
        if ($requiredVars -contains $var) {
            Write-Host "  ❌ $var = MISSING (REQUIRED)" -ForegroundColor Red
        } else {
            Write-Host "  ⚠️  $var = MISSING (optional)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "🔍 Checking for new DWS Supabase project..." -ForegroundColor Cyan

if ($envContent -match "VITE_SUPABASE_URL\s*=\s*(.+)") {
    $url = [regex]::Match($envContent, "VITE_SUPABASE_URL\s*=\s*(.+)").Groups[1].Value.Trim()
    
    if ($url -match "jmhtrffmxjxhoxpesubv") {
        Write-Host "  ✅ Using new DWS Supabase project: $url" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Using different Supabase project: $url" -ForegroundColor Yellow
        Write-Host "     Expected: https://jmhtrffmxjxhoxpesubv.supabase.co" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Configuration check complete!" -ForegroundColor Green

