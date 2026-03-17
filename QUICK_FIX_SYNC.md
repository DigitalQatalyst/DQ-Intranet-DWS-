# Quick Fix: UI ↔ Supabase Sync Issues

## Immediate Steps to Try (in order)

### 1. **Hard Refresh Browser** ⚡ (Most Common Fix)
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- Or: Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### 2. **Restart Dev Server** 🔄
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
# or
vite
```

**Important:** After changing `.env` file, you MUST restart the dev server!

### 3. **Check Environment Variables** 🔍
```bash
# Check your .env file
cat .env | grep SUPABASE

# Should show:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
```

**Verify in Supabase Dashboard:**
1. Go to: https://app.supabase.com
2. Select your project
3. Settings → API
4. Compare Project URL with your `.env` file

### 4. **Clear Browser Cache Completely** 🧹
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** (left sidebar)
4. Check all boxes
5. Click **Clear site data**
6. Refresh page

### 5. **Check Browser Console** 🐛
1. Open DevTools (F12) → Console tab
2. Look for:
   - Red error messages
   - Supabase connection logs
   - Cache warnings
3. Share any errors you see

### 6. **Check Network Tab** 📡
1. Open DevTools (F12) → Network tab
2. Filter by "supabase" or "fetch"
3. Make a change in your UI
4. Check if:
   - Request is sent (should see a request)
   - Status is 200 (success) or 401/403 (auth issue)
   - Response contains your data

### 7. **Verify Data in Supabase** ✅
Run this in Supabase SQL Editor:
```sql
SELECT slug, title, LENGTH(body) as body_length, last_updated_at
FROM public.guides
WHERE slug = 'dq-hov';
```

## Common Issues

### Issue: "Changes in UI don't save to Supabase"
**Possible causes:**
- RLS policy blocking updates
- Wrong API key (using anon key instead of service role)
- Network request failing (check Network tab)

**Fix:**
- Check browser console for errors
- Check Network tab for failed requests
- Verify RLS policies allow updates

### Issue: "Changes in Supabase don't show on localhost"
**Possible causes:**
- Browser cache
- React Query cache
- Wrong Supabase project
- Dev server not restarted

**Fix:**
- Hard refresh (Ctrl+Shift+R)
- Restart dev server
- Verify `.env` points to correct project

## Still Not Working?

1. **Check Supabase Dashboard → Logs** for errors
2. **Verify you're editing the same project** your app connects to
3. **Test with a simple query** in browser console:
   ```javascript
   // Open browser console and run:
   const { data } = await supabaseClient
     .from('guides')
     .select('slug, title')
     .eq('slug', 'dq-hov')
     .single();
   console.log('Data:', data);
   ```

## Need More Help?

Share:
1. Browser console errors (if any)
2. Network tab screenshot (showing Supabase requests)
3. Your `.env` file (hide the keys, just show the URL)
4. Results from the diagnostic SQL query above
