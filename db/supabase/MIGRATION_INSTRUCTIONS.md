# LMS Migration Instructions

## ✅ Migration File Generated

The complete migration file has been generated:
- **Location**: `db/supabase/complete_lms_migration.sql`
- **Size**: ~105 KB
- **Contains**: DDL (schema) + DML (INSERT statements)

## 🚀 How to Run

### Option 1: Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open `db/supabase/complete_lms_migration.sql` in your editor
6. Copy the **entire file contents**
7. Paste into the Supabase SQL Editor
8. Click **Run** (or press Cmd/Ctrl + Enter)

The migration will:
- ✅ Create 4 tables (courses, curriculum_items, topics, lessons)
- ✅ Create indexes for performance
- ✅ Create triggers for updated_at timestamps
- ✅ Insert all course data from `lmsCourseDetails.ts`

### Option 2: Using psql (if you have database connection)

If you have the database connection string:

```bash
psql "$DATABASE_URL" -f db/supabase/complete_lms_migration.sql
```

Or construct manually:
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f db/supabase/complete_lms_migration.sql
```

### Option 3: Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db execute -f db/supabase/complete_lms_migration.sql
```

## 📊 What Gets Migrated

- **Courses**: All course/track details from `LMS_COURSE_DETAILS`
- **Curriculum Items**: Top-level curriculum structure (courses in bundles, topic groups)
- **Topics**: Topics nested under curriculum items
- **Lessons**: Final content units (under topics or directly under curriculum items)

## ✅ Verification

After running the migration, verify in Supabase SQL Editor:

```sql
SELECT 
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM curriculum_items) as curriculum_items,
  (SELECT COUNT(*) FROM topics) as topics,
  (SELECT COUNT(*) FROM lessons) as lessons;
```

Expected counts:
- courses: ~15-20
- curriculum_items: ~50-100  
- topics: ~100-200
- lessons: ~200-500

## 🔍 Check a Specific Course

```sql
SELECT 
  c.title,
  COUNT(DISTINCT ci.id) as curriculum_items,
  COUNT(DISTINCT t.id) as topics,
  COUNT(DISTINCT l.id) as lessons
FROM courses c
LEFT JOIN curriculum_items ci ON ci.course_id = c.id
LEFT JOIN topics t ON t.curriculum_item_id = ci.id
LEFT JOIN lessons l ON (l.topic_id = t.id OR l.curriculum_item_id = ci.id)
WHERE c.slug = 'microsoft-teams-help-learning'
GROUP BY c.id, c.title;
```

## ⚠️ Notes

- The migration uses `ON CONFLICT` for upserts, so it's safe to run multiple times
- All foreign keys have `ON DELETE CASCADE` for data integrity
- Arrays (TEXT[]) and JSONB fields are properly handled
- The migration preserves all relationships between courses, curriculum items, topics, and lessons

