# Script to update all Supabase client imports to use centralized client
$files = Get-ChildItem -Path "src/communities" -Recurse -Include "*.ts","*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if file doesn't contain supabase imports
    if ($content -notmatch "supabase.*client") {
        continue
    }
    
    # Replace various import patterns
    $content = $content -replace "from ['`"]@/communities/integrations/supabase/client['`"]", 'from "@/lib/supabaseClient"'
    $content = $content -replace "from ['`"]\.\./integrations/supabase/client['`"]", 'from "@/lib/supabaseClient"'
    $content = $content -replace "from ['`"]\.\./\.\./integrations/supabase/client['`"]", 'from "@/lib/supabaseClient"'
    $content = $content -replace "from ['`"]\.\./\.\./\.\./integrations/supabase/client['`"]", 'from "@/lib/supabaseClient"'
    $content = $content -replace "from ['`"]\.\./\.\./\.\./\.\./integrations/supabase/client['`"]", 'from "@/lib/supabaseClient"'
    
    # Write back if changed
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Updated: $($file.FullName)"
}

Write-Host "Done updating Supabase imports!"

