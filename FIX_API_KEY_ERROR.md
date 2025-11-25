# Fix: "Invalid API key" Error

## The Problem

You're getting: `AuthApiError: Invalid API key`

This means the script can't authenticate with Supabase because:
1. The service role key is missing
2. You're using the wrong key (anon key instead of service_role key)
3. The key wasn't set in the current terminal session

## Quick Fix

### Step 1: Get the Correct Key

1. Go to **https://app.supabase.com**
2. Select your project
3. Go to **Settings** → **API**
4. Find the **`service_role`** key section
5. Click **"Reveal"** or **"Copy"** to get the full key
6. **IMPORTANT**: This is the LONG key that starts with `eyJ...` - NOT the short `anon` key

### Step 2: Set the Key in PowerShell

**In the SAME PowerShell window** where you'll run the script:

```powershell
# Set the service role key (replace with your actual key)
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.your-actual-key-here"

# Set the Supabase URL (replace with your actual URL)
$env:VITE_SUPABASE_URL="https://your-project-id.supabase.co"

# Verify they're set
echo $env:SUPABASE_SERVICE_ROLE_KEY
echo $env:VITE_SUPABASE_URL
```

### Step 3: Run the Script

```powershell
npm run create-test-user
```

## How to Identify the Correct Key

The **service_role** key:
- ✅ Starts with `eyJ` (it's a JWT token)
- ✅ Is much longer than the anon key
- ✅ Has `service_role` in the decoded payload
- ✅ Located in the "service_role" section of the API settings

The **anon** key (WRONG):
- ❌ Also starts with `eyJ` but shorter
- ❌ Has `anon` in the decoded payload
- ❌ Located in the "anon" or "public" section

## Common Mistakes

### Mistake 1: Using Anon Key
```powershell
# ❌ WRONG - This is the anon key
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIn0..."
```

**Fix**: Use the service_role key from the "service_role" section

### Mistake 2: Key Not Set in Current Session
```powershell
# You set it in one PowerShell window
$env:SUPABASE_SERVICE_ROLE_KEY="..."

# But run the script in a different window
# ❌ The key won't be available
```

**Fix**: Set the key in the SAME terminal window where you run the script

### Mistake 3: Key Has Extra Spaces or Quotes
```powershell
# ❌ WRONG - Extra quotes
$env:SUPABASE_SERVICE_ROLE_KEY='"eyJhbGci..."'

# ❌ WRONG - Extra spaces
$env:SUPABASE_SERVICE_ROLE_KEY=" eyJhbGci... "
```

**Fix**: No quotes needed, no extra spaces

## Verify Your Setup

Run this to check if everything is set correctly:

```powershell
# Check if variables are set
if ($env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "✓ Service Role Key is set" -ForegroundColor Green
    Write-Host "  Length: $($env:SUPABASE_SERVICE_ROLE_KEY.Length) characters"
    Write-Host "  Starts with: $($env:SUPABASE_SERVICE_ROLE_KEY.Substring(0, 10))..."
} else {
    Write-Host "✗ Service Role Key is NOT set" -ForegroundColor Red
}

if ($env:VITE_SUPABASE_URL) {
    Write-Host "✓ Supabase URL is set" -ForegroundColor Green
    Write-Host "  URL: $env:VITE_SUPABASE_URL"
} else {
    Write-Host "✗ Supabase URL is NOT set" -ForegroundColor Red
}
```

## Alternative: Use .env File

If setting environment variables is problematic, create a `.env` file:

1. Create `.env` in the project root (same folder as `package.json`)
2. Add:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   ```
3. Install dotenv:
   ```bash
   npm install dotenv
   ```
4. The script will automatically load it

## Still Not Working?

1. **Double-check the key**: Make absolutely sure you copied the `service_role` key, not `anon`
2. **Check the URL**: Make sure it's your correct Supabase project URL
3. **Verify in Supabase Dashboard**: Go to Settings → API and confirm the service_role key is active
4. **Try a new terminal**: Close and open a new PowerShell window, then set the variables again

## Test the Key Manually

You can test if your key works by running this in PowerShell:

```powershell
# Test the connection
$headers = @{
    "apikey" = $env:SUPABASE_SERVICE_ROLE_KEY
    "Authorization" = "Bearer $env:SUPABASE_SERVICE_ROLE_KEY"
}

$response = Invoke-RestMethod -Uri "$env:VITE_SUPABASE_URL/rest/v1/" -Headers $headers -Method Get
Write-Host "Connection successful!" -ForegroundColor Green
```

If this fails, your key is definitely wrong.


