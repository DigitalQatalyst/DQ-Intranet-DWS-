# DQ Glossary Terms - Supabase Integration

This directory contains SQL scripts for setting up the DQ Glossary Terms table in Supabase.

## Setup Instructions

1. **Create the table:**
   ```sql
   -- Run this in your Supabase SQL editor
   \i sql/glossary_terms_table.sql
   ```
   Or copy and paste the contents of `glossary_terms_table.sql` into the Supabase SQL editor.

2. **Seed the data:**
   ```sql
   -- Run this in your Supabase SQL editor
   \i sql/glossary_terms_seed.sql
   ```
   Or copy and paste the contents of `glossary_terms_seed.sql` into the Supabase SQL editor.

## Table Structure

The `glossary_terms` table includes:
- `id` (UUID, primary key)
- `term` (text) - The glossary term name
- `slug` (text, unique) - URL-friendly identifier
- `short_definition` (text) - Card-friendly 1-2 line definition
- `full_definition` (text) - Complete DQ context definition
- `category` (text) - One of: frameworks-models, ways-of-working, governance-systems, platforms-tools, roles-structures
- `used_in` (text[]) - Array of contexts: dws-core, l24-working-rooms, learning-center, governance
- `related_terms` (text[]) - Array of related term slugs
- `status` (text) - 'Active' or 'Deprecated'
- `owner` (text) - Term owner (e.g., 'Digital Qatalyst')
- `updated_at` (timestamp) - Last update timestamp

## Row Level Security

The table has RLS enabled with a public read policy, matching the existing DWS pattern for read-only content.

## Future Enhancements

- Admin UI for managing glossary terms (future phase)
- Edit/update capabilities (future phase)
- Analytics tracking (future phase)
- AI explanations (future phase)

