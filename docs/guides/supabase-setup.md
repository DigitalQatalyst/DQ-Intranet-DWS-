Supabase Setup for Guides

Env vars
- SUPABASE_URL: Project URL
- SUPABASE_ANON_KEY: anon public key (client)
- SUPABASE_SERVICE_ROLE_KEY: service role key (server-only)

Clients
- Client: src/lib/supabaseClient.ts (anon)
- Server: api/lib/supabaseAdmin.ts (service role)

Schema (describe)
- guides: id (uuid/text), slug (unique), title, summary, heroImageUrl, skillLevel (Beginner|Intermediate|Advanced), estimatedTimeMin (int), lastUpdatedAt (timestamptz), status (Draft|Published|Archived), authorName, authorOrg, isEditorsPick (bool), downloadCount (int default 0), tags (text[])
- guide_steps: guide_id FK -> guides, position int, title, body
- guide_attachments: guide_id FK, kind ('file'|'link'), title, url, size
- guide_templates: guide_id FK, title, url, size
- guide_tools: id, name, slug; guide_tool_xref: (guide_id, tool_id)
- guide_topics: id, name; guide_topic_xref: (guide_id, topic_id)
- guide_audiences: id, name; xref: (guide_id, audience_id)
- guide_formats: id, name; xref: (guide_id, format_id)
- guide_languages: id, name; xref: (guide_id, language_id)
- guides_versions: guide_id, version, changed_at, diff_summary

Indexes
- PK/FK on all junctions
- GIN on guides.tags
- btree on guides.lastUpdatedAt
- partial index for guides(status='Published')

Full-text search
- guides_search tsvector over: title, summary, aggregated steps.body, tags, authorName, authorOrg
- GIN index on guides_search

RPC (stored procedure)
- rpc_guides_search(q text, filters jsonb, sort text, page int, page_size int)
  - Returns: { items: jsonb[], total: int, facets: jsonb }
  - Facets compute counts for current filter context; when computing a facet group, exclude that group's current filters (standard faceting behavior)
  - Filters JSON keys: type, audience, topic, tool, skill, time, format, freshness, popularity, lang

Storage
- Buckets: guides-attachments, guides-templates, guide-images
- Use storage.createSignedUploadUrl for Admin uploads; UI uses signed URL to PUT

RLS
- Enable RLS on all tables
- anon SELECT only where guides.status='Published'
- Authenticated Admin/Editor roles can INSERT/UPDATE/DELETE
- Use service role key in API routes under /api/admin/**

Seed
- Use SQL or CSV import to seed a few guides, topics, audiences, formats, etc.

Local run
- Set envs in .env.local
- Start dev: npm run dev

