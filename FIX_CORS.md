# Fix CORS Error - Complete Guide

## The Problem
You're seeing: `Access to fetch at 'https://jmhtrffmxjxhoxpesubv.supabase.co/...' from origin 'http://localhost:3004' has been blocked by CORS policy`

## Solution 1: Check Supabase Dashboard (Recommended)

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Go to **Settings** → **API**
3. Scroll down to **CORS Settings** or **Allowed Origins**

### Step 2: Add localhost to allowed origins
Add these origins:
```
http://localhost:3004
http://localhost:5173
http://localhost:5174
http://127.0.0.1:3004
```

### Step 3: Save and test
- Save the settings
- Refresh your browser
- The CORS error should be gone

## Solution 2: Use Environment Variable (Alternative)

If Solution 1 doesn't work, you can use the proxy I added:

1. Add to `.env.local`:
```
VITE_USE_SUPABASE_PROXY=true
```

2. Restart dev server:
```bash
npm run dev
```

## Solution 3: Verify Environment Variables

Make sure `.env.local` has correct values:

```bash
VITE_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from:
- Supabase Dashboard → Settings → API
- Copy "Project URL" and "anon public" key

## Solution 4: Check Supabase Project Status

1. Go to Supabase Dashboard
2. Check if your project is active (not paused)
3. Verify the project URL matches what's in `.env.local`

## After Fixing

1. **Restart dev server** (important!):
   ```bash
   npm run dev
   ```

2. **Hard refresh browser**:
   - `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)

3. **Check console** - errors should be gone

## Still Not Working?

Run this in browser console to test:

```javascript
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.from('work_positions').select('id').limit(1);
console.log('Test result:', { data, error });
```

If this works but the app doesn't, there's a different issue.

