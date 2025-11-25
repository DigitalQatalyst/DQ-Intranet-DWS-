# Quick Start: Create Test User

## Easiest Method (3 Steps)

### Step 1: Get Your Supabase Keys

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **service_role** key (the long JWT token - NOT the anon key)

### Step 2: Set Environment Variables

**Windows PowerShell:**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="paste-your-service-role-key-here"
$env:VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

**Windows Command Prompt:**
```cmd
set SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
set VITE_SUPABASE_URL=https://your-project-id.supabase.co
```

**Mac/Linux:**
```bash
export SUPABASE_SERVICE_ROLE_KEY="paste-your-service-role-key-here"
export VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### Step 3: Run the Script

```bash
npm run create-test-user
```

Or directly:
```bash
node scripts/create-test-user.js
```

## That's It! 

The script will create:
- **Email**: `testuser@example.com`
- **Password**: `TestUser123!`

You can now use these credentials to sign in to your app.

## Troubleshooting

**"Missing SUPABASE_SERVICE_ROLE_KEY"**
→ Make sure you set the environment variable in the same terminal window before running the script

**"Missing VITE_SUPABASE_URL"**
→ Set the environment variable with your Supabase project URL

**"Cannot find module"**
→ Run `npm install` first

## Alternative: Use .env File

Create a `.env` file in the project root:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
```

Then install dotenv:
```bash
npm install dotenv
```

The script will automatically load the .env file.


