Guides Seeding Runbook

Env variables
- SUPABASE_URL: Your project URL (https://xyzcompany.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY: Service role key (server-only)

Files
- data/seed-taxonomy.json – tools, topics, audiences, formats, languages
- data/seed-guides.json – 20+ guides with core + content arrays
- data/seed-xrefs.json – per guide mappings to taxonomies

Behavior & schema assumptions
- Lookup tables: guide_tools, guide_topics, guide_audiences, guide_formats, guide_languages
- Guides table: guides (id, slug, title, summary, heroImageUrl, skillLevel, estimatedTimeMin, lastUpdatedAt, status, authorName, authorOrg, isEditorsPick, downloadCount, guideType)
- Content tables: guide_steps, guide_attachments, guide_templates
- Junctions: guide_tool_xref, guide_topic_xref, guide_audience_xref, guide_format_xref, guide_language_xref
- Time bucket + Freshness: derived at query time in RPC (not stored)
- RLS: anon may SELECT only where guides.status = 'Published'

Run the seed
1) Set envs locally (PowerShell example)
   $env:SUPABASE_URL="https://YOUR.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY="service-role-key"

2) Run
   npm run db:seed-guides

What the script does
- Upserts lookups (by slug/name)
- Upserts guides base rows (by slug)
- Replaces dependent rows (steps, attachments, templates) per guide
- Replaces xrefs (tools/topics/audiences/formats/languages) per guide
- Prints counts and a sample API query to verify

Verify
- Supabase Dashboard → Table Editor → confirm guides + lookups populated
- Open the app → /marketplace/guides
- Try filters for Guide Type, Audience, Topic, Tool, Skill Level, Format, Freshness, Popularity, Language
- Confirm that Draft/Archived guides do not appear when logged out

Notes
- Freshness buckets (Last 30/90/365 days) are determined from lastUpdatedAt inside the RPC (not stored)
- Time buckets are derived from estimatedTimeMin in RPC, using: Quick <10, Short 10–30, Medium 31–60, Deep Dive >60

