Guides Taxonomy & Filters

Core fields (mapping)
- id, slug, title, summary, heroImageUrl
- skillLevel: Beginner | Intermediate | Advanced
- estimatedTimeMin: integer (used to derive time buckets)
- lastUpdatedAt: timestamptz
- status: Draft | Published | Archived
- authorName, authorOrg
- isEditorsPick: boolean
- downloadCount: integer (default 0)
- tags: text[]

Content
- steps[]: ordered list of { position, title, body }
- attachments[]: { kind[file|link], title, url, size }
- templates[]: { title, url, size }
- relatedToolSlugs[]

Taxonomies (multi-select unless noted)
- Guide Type (single): How-to, Playbook, Checklist, Template, Policy/Procedure
- Audience / Role: Founder, Product Manager, Engineer/Dev, Designer/UX, Marketer/Growth, Finance/Compliance, Ops
- Topic (Domain): Finance & Funding, Marketing & Growth, Product & Design, Engineering & DevOps, Legal & Compliance, Operations & Productivity, Strategy & Leadership
- Tool / Integration: freeform lookup
- Skill Level: Beginner, Intermediate, Advanced (also stored as core)
- Time to Complete (derived from estimatedTimeMin): Quick (<10), Short (10–30), Medium (31–60), Deep Dive (>60)
- Format: Step-by-Step, Template Pack, Interactive Tool, Policy/Procedure, Checklist
- Freshness: Last 30 days, Last 90 days, Last 12 months (based on lastUpdatedAt)
- Popularity: Trending, Most Used, Editor’s Pick
- Language: English, Arabic, etc.

URL parameters (CSV per group)
- type, audience, topic, tool, skill, time, format, freshness, popularity, lang
- q (search)
- sort: relevance (default), updated, downloads, editorsPick
- page, pageSize (default 12)

Facet behavior
- OR within a group, AND across groups
- Counts represent current result set with group exclusion when computing current group's counts

Mapping rules
- Time to Complete: derive from estimatedTimeMin using buckets above
- Freshness: compare lastUpdatedAt to now() in RPC
- Popularity: editorsPick boolean; most used by downloadCount desc; trending left to product definition (e.g., recent downloads vs baseline)

