# 🚀 Quick Fix Steps - Get Everything Working

## The Issue
CORS errors blocking all three tabs (Units, Positions, Associates) from loading.

## ✅ Solution (Choose One)

### Option 1: Fix in Supabase Dashboard (Easiest - Recommended)

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Click **Settings** → **API**

2. **Find CORS/Allowed Origins Section**
   - Look for "Allowed Origins" or "CORS Settings"
   - If you don't see it, your Supabase version might auto-allow localhost

3. **Add localhost origins** (if the field exists):
   ```
   http://localhost:3004
   http://localhost:5173
   http://127.0.0.1:3004
   ```

4. **Save and restart**:
   ```bash
   # Stop your dev server (Ctrl+C)
   npm run dev
   ```

5. **Hard refresh browser**: `Cmd+Shift+R` or `Ctrl+Shift+R`

### Option 2: Use Proxy (If Option 1 doesn't work)

1. **Add to `.env.local`**:
   ```
   VITE_USE_SUPABASE_PROXY=true
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Hard refresh browser**

## 🔍 Verify It's Working

After restarting, check browser console:
- ✅ No CORS errors
- ✅ Should see: `[WorkPositions] Fetched X positions from Supabase`
- ✅ All three tabs should load data

## 📋 Checklist

- [ ] Supabase Dashboard → Settings → API → Check CORS settings
- [ ] `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Dev server restarted after changes
- [ ] Browser hard refreshed
- [ ] Check console for success messages

## 🆘 Still Not Working?

1. **Check environment variables**:
   ```bash
   # In terminal, run:
   cat .env.local
   ```

2. **Test Supabase connection**:
   ```javascript
   // In browser console:
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

3. **Verify Supabase project is active**:
   - Go to Supabase Dashboard
   - Make sure project isn't paused

4. **Check Network tab**:
   - Open DevTools → Network tab
   - Look for requests to `supabase.co`
   - Check if they return 200 (success) or errors

