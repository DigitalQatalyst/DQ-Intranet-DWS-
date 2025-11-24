# Setup Environment Variables - Step by Step

## The Error
"TypeError: Failed to fetch" means the app can't connect to Supabase.

## Quick Fix

### Step 1: Create `.env.local` file

In your project root (`/Users/chamathpabasara/DQ-Intranet/`), create a file named `.env.local`

### Step 2: Get Your Supabase Credentials

1. Go to your Supabase Dashboard
2. Click **Settings** → **API**
3. You'll see:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (a long JWT token)

### Step 3: Add to `.env.local`

Open `.env.local` and add:

```bash
VITE_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impod2t4bXZrbXRsaHFxemxyZnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MTQ5NDIsImV4cCI6MjA3NTI5MDk0Mn0.5pYL78YvAEZVoVzgPyklyF5Lt75TSIeG4KKNsFXpzu8
```

**⚠️ IMPORTANT:** Replace with YOUR actual values from Supabase Dashboard!

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 5: Check Browser Console

After restarting, open browser console. You should see:
```
🔧 Supabase Client Config: { url: 'https://...', hasAnonKey: true, ... }
```

If you see errors about missing env vars, the `.env.local` file isn't being read.

## Verify It's Working

In browser console, run:

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Both should show values (not `undefined`).

## Common Issues

### Issue 1: File not in right location
- `.env.local` must be in project root (same folder as `package.json`)
- NOT in `src/` folder

### Issue 2: Wrong file name
- Must be exactly `.env.local` (with the dot at the start)
- Not `env.local` or `.env`

### Issue 3: Server not restarted
- Vite only reads `.env.local` when server starts
- You MUST restart after creating/editing the file

### Issue 4: Wrong values
- URL should start with `https://`
- Anon key should be a long JWT token
- Get fresh values from Supabase Dashboard

## Still Not Working?

1. **Check file exists**:
   ```bash
   ls -la .env.local
   ```

2. **Check file contents** (don't share the actual keys!):
   ```bash
   cat .env.local
   ```

3. **Verify in browser**:
   ```javascript
   // In browser console
   console.log(import.meta.env.VITE_SUPABASE_URL);
   ```

If it shows `undefined`, the file isn't being read. Make sure:
- File is named `.env.local` (with dot)
- File is in project root
- Dev server was restarted after creating file

