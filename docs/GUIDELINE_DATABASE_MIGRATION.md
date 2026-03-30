# Associate Owned Asset Guidelines - Database Migration

## Overview

This document explains how to migrate the Associate Owned Asset Guidelines from hardcoded React components to database-driven content.

## Current State

The guideline content is currently hardcoded in:
- `src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage.tsx`

All tables and text content are defined as JavaScript objects within the component.

## New Architecture

### Database Storage
Content is stored in the `guides` table in the `body` field as JSON with this structure:

```json
{
  "sections": [
    {
      "id": "context",
      "title": "1. Context",
      "order": 1,
      "type": "text",
      "content": "Text content here..."
    },
    {
      "id": "core-components",
      "title": "4. Core Components",
      "order": 4,
      "type": "table",
      "description": "Description text",
      "table": {
        "title": "Core Components",
        "columns": [
          { "header": "#", "accessor": "number" },
          { "header": "Program", "accessor": "program" }
        ],
        "data": [
          { "number": "01", "program": "BYOD" }
        ]
      }
    }
  ]
}
```

### Component Updates
The new component (`GuidelinePage-new.tsx`) fetches content from the database and renders it dynamically.

## Migration Steps

### Step 1: Prepare the Data

Complete the JSON data file with all sections:
`scripts/guideline-data/associate-owned-asset-data.json`

You need to add the remaining sections (FYOD, HYOD, etc.) following the same pattern.

### Step 2: Run the Migration Script

```bash
node scripts/migrate-associate-asset-guideline.js
```

This will:
- Read the JSON data file
- Update or create the guide in the database
- Store all content in the `body` field as JSON

### Step 3: Replace the Component

```bash
# Backup the old component
mv src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage.tsx src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage-old.tsx

# Use the new component
mv src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage-new.tsx src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage.tsx
```

### Step 4: Test

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3004/marketplace/guides/dq-associate-owned-asset-guidelines`
3. Verify all sections and tables render correctly

## Benefits

1. **Easy Updates**: Update content via database without code changes
2. **Consistent Structure**: All guidelines can follow the same pattern
3. **Version Control**: Track content changes in the database
4. **Admin Interface**: Can build a CMS to manage content
5. **Scalability**: Easy to add new guidelines with similar structure

## Content Management

### Updating Content

You can update the content by:

1. **Direct Database Update**:
   ```sql
   UPDATE guides 
   SET body = '{"sections": [...]}'::jsonb,
       last_updated_at = NOW()
   WHERE slug = 'dq-associate-owned-asset-guidelines';
   ```

2. **Via Script**:
   - Update the JSON file
   - Run the migration script again

3. **Future: Admin Interface**:
   - Build a form-based editor
   - WYSIWYG for text sections
   - Table builder for structured data

## Next Steps

1. Complete the JSON data file with all remaining sections
2. Run the migration
3. Test thoroughly
4. Apply the same pattern to other guidelines
5. Consider building an admin interface for content management

## Rollback

If you need to rollback:

```bash
mv src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage-old.tsx src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage.tsx
```

The hardcoded version will work again immediately.
