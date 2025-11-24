# Troubleshooting: Positions Not Showing

## ✅ What We Know Works:
1. ✅ RLS policies are in place
2. ✅ Table has data (you can see it in Supabase)
3. ✅ All columns exist (schema matches)
4. ✅ Query works in Supabase SQL Editor

## 🔍 Next Steps to Debug:

### Step 1: Check Browser Console
1. Open your app in the browser
2. Press `F12` (or `Cmd+Option+I` on Mac) to open Developer Tools
3. Go to the **Console** tab
4. Navigate to the **Positions** tab in your app
5. Look for these messages:
   - `[WorkPositions] Fetched X positions from Supabase`
   - `[WorkPositions] Sample row: ...`
   - `[WorkPositions] Mapped X valid positions`
   - Any error messages (red text)

### Step 2: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Navigate to the Positions tab
3. Look for a request to Supabase (filter by "supabase" or "work_positions")
4. Click on the request and check:
   - **Status**: Should be 200 (not 401 or 403)
   - **Response**: Should show the data
   - **Request URL**: Should include `work_positions`

### Step 3: Check What Error Shows
Look at the Positions tab in your app - does it show:
- "Could not load directory items. permission denied" ❌
- "Loading directory..." (stuck) ⏳
- "No directory entries found" (empty state) 📭
- Nothing at all? 🤷

### Step 4: Test Direct Query
Open browser console and run this:
```javascript
// This will test the query directly
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data, error } = await supabase
  .from('work_positions')
  .select('id, slug, position_name, role_family, department, unit, unit_slug, location, sfia_rating, sfia_level, contract_type, summary, description, responsibilities, expectations, image_url, status, created_at, updated_at')
  .order('position_name', { ascending: true })
  .limit(5);

console.log('Data:', data);
console.log('Error:', error);
```

## 🐛 Common Issues:

### Issue 1: Data is filtered out
- Check if positions have `id` and `position_name` (required fields)
- Check browser console for: `[WorkPositions] Filtered out X invalid positions`

### Issue 2: Query fails silently
- Check Network tab for failed requests
- Check Console for error messages

### Issue 3: Wrong environment variables
- Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing env vars

## 📋 What to Share:
After checking the above, share:
1. What you see in the browser console
2. What the Network tab shows
3. What error message (if any) appears in the UI
4. Results from the direct query test

