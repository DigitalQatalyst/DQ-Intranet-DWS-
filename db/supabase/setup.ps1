# =====================================================
# Supabase Communities Setup Script (PowerShell)
# =====================================================
# This script helps you set up the communities database
# =====================================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Supabase Communities Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envPath = "..\..\..env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ Error: .env file not found in project root" -ForegroundColor Red
    Write-Host "Please create a .env file with your Supabase credentials"
    exit 1
}

Write-Host "✓ Found .env file" -ForegroundColor Green

# Read .env file
$envContent = Get-Content $envPath
$supabaseUrl = ($envContent | Select-String "VITE_SUPABASE_URL=(.+)").Matches.Groups[1].Value
$supabaseKey = ($envContent | Select-String "VITE_SUPABASE_ANON_KEY=(.+)").Matches.Groups[1].Value

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Found Supabase configuration" -ForegroundColor Green
Write-Host "  URL: $supabaseUrl"
Write-Host ""

# Extract project reference
$projectRef = $supabaseUrl -replace "https://([^.]+)\..*", '$1'

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Setup Options" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "1. Open Supabase Dashboard SQL Editor"
Write-Host "2. Show SQL file locations"
Write-Host "3. Copy schema SQL to clipboard"
Write-Host "4. Copy seed data SQL to clipboard"
Write-Host "5. Show connection string"
Write-Host "6. Exit"
Write-Host ""
$choice = Read-Host "Choose an option (1-6)"

switch ($choice) {
    "1" {
        $dashboardUrl = "https://supabase.com/dashboard/project/$projectRef/sql/new"
        Write-Host ""
        Write-Host "Opening Supabase SQL Editor..." -ForegroundColor Green
        Start-Process $dashboardUrl
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Copy contents of communities_schema.sql and run it"
        Write-Host "2. Copy contents of communities_seed_data.sql and run it"
    }
    "2" {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Cyan
        Write-Host "SQL File Locations" -ForegroundColor Cyan
        Write-Host "==========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Schema file:" -ForegroundColor Yellow
        Write-Host "  $(Resolve-Path '.\communities_schema.sql')"
        Write-Host ""
        Write-Host "Seed data file:" -ForegroundColor Yellow
        Write-Host "  $(Resolve-Path '.\communities_seed_data.sql')"
        Write-Host ""
        Write-Host "Instructions:" -ForegroundColor Yellow
        Write-Host "1. Open these files in your text editor"
        Write-Host "2. Copy their contents"
        Write-Host "3. Paste in Supabase SQL Editor"
        Write-Host "4. Run each file in order (schema first, then seed data)"
    }
    "3" {
        $schemaContent = Get-Content ".\communities_schema.sql" -Raw
        Set-Clipboard $schemaContent
        Write-Host ""
        Write-Host "✓ Schema SQL copied to clipboard!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef/sql/new"
        Write-Host "2. Paste (Ctrl+V) and run the SQL"
        Write-Host "3. Run this script again and choose option 4 for seed data"
    }
    "4" {
        $seedContent = Get-Content ".\communities_seed_data.sql" -Raw
        Set-Clipboard $seedContent
        Write-Host ""
        Write-Host "✓ Seed data SQL copied to clipboard!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef/sql/new"
        Write-Host "2. Paste (Ctrl+V) and run the SQL"
        Write-Host "3. Check the output for a summary of created records"
    }
    "5" {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Cyan
        Write-Host "Database Connection" -ForegroundColor Cyan
        Write-Host "==========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You'll need your database password from Supabase."
        Write-Host ""
        Write-Host "Connection string format:" -ForegroundColor Yellow
        Write-Host "postgresql://postgres:[YOUR-PASSWORD]@db.$projectRef.supabase.co:5432/postgres"
        Write-Host ""
        Write-Host "To get your password:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef/settings/database"
        Write-Host "2. Look for 'Database password' or reset it"
        Write-Host ""
        Write-Host "To run SQL files with psql:" -ForegroundColor Yellow
        Write-Host 'psql "postgresql://postgres:[PASSWORD]@db.' -NoNewline
        Write-Host "$projectRef" -NoNewline -ForegroundColor Cyan
        Write-Host '.supabase.co:5432/postgres" -f .\communities_schema.sql'
        Write-Host ""
    }
    "6" {
        Write-Host "Exiting..." -ForegroundColor Gray
        exit 0
    }
    default {
        Write-Host "Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Next Steps After Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Verify tables in Supabase Dashboard > Table Editor" -ForegroundColor White
Write-Host "2. Start your dev server: npm run dev" -ForegroundColor White
Write-Host "3. Test /communities route (should show 6 communities)" -ForegroundColor White
Write-Host "4. Test /communities/feed route (should show posts)" -ForegroundColor White
Write-Host "5. Create a test user and join a community" -ForegroundColor White
Write-Host ""
Write-Host "For detailed information, see: db\supabase\README.md" -ForegroundColor Gray
Write-Host ""
