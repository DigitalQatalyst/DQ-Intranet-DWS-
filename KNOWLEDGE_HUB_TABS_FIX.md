# Knowledge Hub Tabs Fix - Show Only Correct Items

## Problem 1: Learning Tab
The Learning tab was showing 6 courses (MS Planner and MS Teams courses) instead of just the GHC course that appears on the marketplace.

### Root Cause
The database query was fetching courses with status `'archived'` in addition to `'published'`. The 9 MS Planner/Teams courses are archived, while only the GHC course has status `'published'`.

### Solution
Updated `src/components/KnowledgeHub.tsx`:

1. **Database Query Filter** (line ~265):
   - Changed from: `.in('status', ['Published', 'published', 'archived'])`
   - Changed to: `.eq('status', 'published')`
   - This ensures only published courses are fetched from the LMS database

2. **Simplified Learning Filter** (line ~303):
   - Removed complex keyword matching logic
   - Now simply filters for items with `type: 'Thought Leadership'` AND `newsType: 'Course'`
   - Since we're already filtering at DB level, we just need to identify LMS course items

### Database Status (LMS)
From `check-marketplace-courses.js`:
- **Published**: 1 course (Golden Honeycomb of Competencies)
- **Archived**: 9 courses (MS Planner and MS Teams courses)

### Result
The Learning tab now shows ONLY the GHC course, matching what appears on the marketplace page.

---

## Problem 2: Guidelines Tab
The Guidelines tab was showing 6 items (GHC competencies, HoV values, Products, etc.) instead of just the 1 guideline: "DQ Associate Owned Asset Guidelines".

### Root Cause
The filter was too broad - it was matching items based on category, tags, and newsType. The Knowledge Hub database has 23 items with status "Approved", but only 1 has `type: 'Guideline'`. The other items are:
- GHC competencies (type: null, category: 'Strategy')
- House of Values items (type: null, category: 'Strategy')
- Products (type: 'blueprint', category: 'Products')
- Blueprints (type: 'Blueprint', category: 'blueprints')

### Solution
Updated `src/components/KnowledgeHub.tsx`:

**Guidelines Filter** (line ~303):
- Changed to filter ONLY items with `type: 'Guideline'` or `type: 'Guidelines'` (case-insensitive)
- Removed all fallback checks for category, tags, and newsType
- This ensures only actual guidelines are shown

### Database Status (Knowledge Hub)
From `check-knowledge-hub-guides.js`:
- **Total Approved items**: 23
- **Items with type='Guideline'**: 1 (DQ Associate Owned Asset Guidelines)
- **Other items**: GHC competencies, HoV values, Products, Blueprints (should NOT show in Guidelines tab)

### Result
The Guidelines tab now shows ONLY the "DQ Associate Owned Asset Guidelines" item.

---

## Files Modified
- `src/components/KnowledgeHub.tsx`

## Analysis Scripts Created
- `check-marketplace-courses.js` - Analyzes LMS courses
- `check-knowledge-hub-guides.js` - Analyzes Knowledge Hub guidelines
