# Instructions for Generating Complete Seed Files

## Overview

Due to the large volume of data and complexity of TypeScript parsing, complete seed files for news and marketplace services should be generated using the following approach:

## Option 1: Manual Extraction (Recommended for Accuracy)

1. Open the source TypeScript files:
   - `src/data/media/news.ts` - for news data
   - `src/utils/mockMarketplaceData.ts` - for marketplace services
   - `src/utils/mockData.ts` - for courses and onboarding flows

2. For each data item, convert to SQL INSERT format:
   ```sql
   INSERT INTO public.news (
     id, title, type, date, author, byline, views, excerpt, image,
     department, location, domain, tags, reading_time, news_type, news_source,
     focus_area, content, format, source, audio_url
   ) VALUES (
     'item-id',
     'Title',
     'Announcement',
     '2025-12-19',
     'Author Name',
     'Byline',
     0,
     'Excerpt text',
     'https://image-url.com',
     'Department',
     'Dubai',
     'Operations',
     ARRAY['tag1', 'tag2'],
     '<5',
     'Company News',
     'DQ Operations',
     'Culture & People',
     'Full markdown content...',
     NULL,
     NULL,
     NULL
   ) ON CONFLICT (id) DO UPDATE SET ...;
   ```

3. Important escaping rules:
   - Single quotes in strings: `'` becomes `''`
   - Newlines in content: Use `\n` or keep as-is if using dollar-quoting
   - Arrays: Use `ARRAY['item1', 'item2']` syntax

## Option 2: Use TypeScript Compiler (Advanced)

You can use the TypeScript compiler to extract values:

```bash
# Install ts-node if needed
npm install -g ts-node

# Create extraction script
node scripts/extract-news-data.js
```

## Option 3: Temporary Runtime Extraction

Create a temporary script that imports the data and outputs SQL:

```typescript
// scripts/output-seed.ts
import { NEWS } from '../src/data/media/news';

// Convert each item to SQL and output
NEWS.forEach(item => {
  // Generate SQL INSERT statement
  console.log(generateSQL(item));
});
```

## Complete Seed Files Needed

1. **seed-news.sql** - All items from `NEWS` array (~25+ items)
2. **seed-marketplace-services.sql** - All items from:
   - `mockCourses` - Courses marketplace
   - `mockFinancialServices` - Financial services
   - `mockNonFinancialServices` - Non-financial services
   - `mockKnowledgeHubItems` - Knowledge hub/guides
   - `mockOnboardingFlows` - Onboarding flows

## Quick Start Template

See `seed-news-partial.sql` for a template showing the first 2 news items. Copy the pattern for all remaining items.

For marketplace services, see the structure in `seed-marketplace-services.sql` (to be created).

