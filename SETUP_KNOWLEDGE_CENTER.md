# Setup DQ Knowledge Center Data

## ✅ Step 1: Connection Test (DONE!)

Your Supabase connection is working! 
- URL: `https://faqystypjlxqvgkhnbyq.supabase.co`
- Status: ✅ Connected

## 📋 Step 2: Create Database Tables

You need to run the schema migration scripts to create the necessary tables.

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/sql/new

2. **Create the Guides Table**
   - Open file: `db/supabase/create_guides_table_and_update_agile_tms.sql`
   - Copy all contents
   - Paste in Supabase SQL Editor
   - Click "Run"

3. **Verify Table Creation**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'guides';
   ```

## 📊 Step 3: Populate Knowledge Center Content

Run these SQL scripts in order to populate your database with DQ Knowledge Center content:

### Core Strategy Guides (Run these first)

1. **DQ Vision**
   - File: `db/supabase/sync_dq_vision_to_supabase.sql`
   - Creates: Vision and Mission guide

2. **DQ House of Values (HoV)**
   - File: `db/supabase/sync_dq_hov_to_supabase.sql`
   - Creates: House of Values guide

3. **DQ Persona**
   - File: `db/supabase/sync_dq_persona_to_supabase.sql`
   - Creates: Persona guide

4. **DQ GHC Overview**
   - File: `db/supabase/sync_dq_ghc_overview_to_supabase.sql`
   - Creates: Golden Honeycomb overview

### Agile Framework Guides

5. **Agile TMS (Team Management System)**
   - File: `db/supabase/sync_dq_agile_tms_to_supabase.sql`

6. **Agile SoS (Scrum of Scrums)**
   - File: `db/supabase/sync_dq_agile_sos_to_supabase.sql`

7. **Agile Flows**
   - File: `db/supabase/sync_dq_agile_flows_to_supabase.sql`

8. **Agile 6xD**
   - File: `db/supabase/sync_dq_agile_6xd_to_supabase.sql`

### How to Run Each Script

For each file above:
1. Open the file in your code editor
2. Copy all contents (Ctrl+A, Ctrl+C)
3. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/sql/new
4. Paste the SQL
5. Click "Run"
6. Check for success message

## 🧪 Step 4: Verify Data

After running all scripts, verify the data:

```sql
-- Check all GHC guides
SELECT slug, title, status, LENGTH(body) as content_length
FROM guides
WHERE slug IN (
  'dq-vision',
  'dq-hov', 
  'dq-persona',
  'dq-ghc-overview',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
)
ORDER BY slug;
```

Expected result: 8 guides with content

## 🔧 Step 5: Test in Your App

Run the connection test again:

```bash
node test-supabase-connection.js
```

You should see:
- ✅ Guides table: EXISTS
- ✅ GHC guides: 8/7 (or more)

## 🎯 Step 6: Update KnowledgeHub Component

The KnowledgeHub component is already configured to fetch from the Media Center service. Once you have data in Supabase, you may want to update the service to fetch from there.

### Current State
- `src/services/mediaCenterService.ts` - Uses local data from `src/data/media/news.ts`

### To Use Supabase Data
You would need to:
1. Create a Supabase service for guides/news
2. Update `mediaCenterService.ts` to fetch from Supabase
3. Map the data structure appropriately

## 📝 Quick Command Reference

```bash
# Test connection
node test-supabase-connection.js

# Start dev server
npm run dev

# Visit Knowledge Hub
# http://localhost:3004/#tools-resources-services
```

## 🆘 Troubleshooting

### "Table does not exist" error
- Run `create_guides_table_and_update_agile_tms.sql` first

### "Duplicate key" error
- The guide already exists, you can skip or update it

### "Permission denied" error
- Check RLS policies in Supabase Dashboard
- Make sure public read access is enabled

### No data showing in app
- Verify data exists: Run verification SQL above
- Check browser console for errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

## 📚 Additional Resources

- Supabase Dashboard: https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq
- SQL Editor: https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/sql/new
- Table Editor: https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/editor

## ✨ What's Next?

After setup is complete:
1. Your KnowledgeHub will show Guidelines and Learning tabs
2. Data will be fetched from local files (for now)
3. You can later migrate to fetch from Supabase
4. The merge with develop should work smoothly

---

**Note:** The current KnowledgeHub component uses local data. The Supabase data is ready for when you want to switch to a database-backed solution.
