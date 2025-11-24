# Check Environment Variables

## "Failed to fetch" Error - Quick Fix

This error usually means:
1. ❌ Environment variables not loaded
2. ❌ Wrong Supabase URL/Key
3. ❌ Network/CORS issue
4. ❌ Dev server needs restart

## Step 1: Check .env.local file

Create or check `.env.local` in your project root:

```bash
# In your project root
cat .env.local
```

It should have:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 2: Get correct values from Supabase

1. Go to your Supabase Dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Step 3: Restart dev server

After updating `.env.local`:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Step 4: Verify in browser console

Open browser console and run:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

If these show `undefined`, the env vars aren't loaded!

## Step 5: Test connection

In browser console:

```javascript
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Test connection
const { data, error } = await supabase.from('work_positions').select('id').limit(1);
console.log('Connection test:', { data, error });
```

