Guide Details Page: Behavior and Logic

Overview

- Canonical route: `/marketplace/guides/:slug` (slug or id supported).
- Legacy compatibility: `/marketplace/knowledge-hub/:id` resolves to the same details page.
- Source of truth: Supabase `public.guides` with optional relations `guide_attachments` and `guide_templates`.

Data Fetching

- Primary: calls `/api/guides/:idOrSlug` which resolves by `id` or `slug` and returns:
  - Core fields: `slug, title, summary, hero_image_url, document_url, domain, guide_type, function_area, status, complexity_level, last_updated_at, author_name, author_org, is_editors_pick, download_count`.
  - Content: `body` (Markdown) for inline rendering when applicable.
  - Related: `steps, attachments, templates` when available.
- Fallback: If the API isn’t reachable, client fetches from Supabase anon with RLS enforced (returns only `Approved`).
- Related guides: client-side Supabase query (RLS enforced). Up to 6, filter by same Domain first, then fallback to same Guide Type. Excludes current slug. Order: editor’s pick desc, downloads desc, last updated desc.

Dynamic Rendering Rules

- Sections render only when content exists; empty sections are hidden without layout gaps.
- Deterministic image fallback: domain → type → neutral via `getGuideImageUrl`.
- Type-adaptive emphasis:
  - Policy: show compliance metadata (status, effective date, author, org, complexity) first.
  - Process / SOP / Procedure: render `body` inline and show steps/flow when present.
  - Template: prioritize template downloads and quick access CTA; render optional short `body` below.
  - Checklist: render `body` and steps as checkable items (client-only state).
  - Best Practice: render `body` and emphasize recommended actions.
- CTA: “Open Guide” uses `document_url` when present, falling back to first template or attachment URL.

Interactions

- Open Guide: opens in new tab and fires `Guides.OpenGuide` with `slug` and `url`.
- Share: uses Web Share API when available; else copies link to clipboard. Fires `Guides.Share`.
- Print: triggers `window.print()`. Fires `Guides.Print`.
- Downloads: clicks on attachments/templates fire `Guides.Download` with `category`, `id/url`, and `title`.
- Related: clicks fire `Guides.RelatedClick` with `from` and `to` slugs.

Access Control & RLS

- Public (anonymous) users see only `Approved` guides due to RLS on anon Supabase queries.
- The API layer can return non-approved rows; the details page gates display:
  - If `status !== 'Approved'` and no authenticated user: show clean 404 state.
  - If authenticated: show a visible non-approved banner.

Navigation & State

- Breadcrumb: Home → Guides → {Guide} (consistent with other marketplaces).
- “Back to Guides” preserves list query params by passing state from the list page and restoring it on the details page.
- Sections include `id` attributes to allow future hash deep links: `#attachments`, `#templates`, `#related`, `#metadata`, `#content`.

Performance & Accessibility

- Lazy-load images and avoid CLS by reserving space via fixed heights.
- Semantic structure: header, main, aside, nav with aria labels.
- All images include alt text; controls are keyboard-accessible with focus styles.

Analytics Events

- Guides.ViewDetail: `{ slug }`
- Guides.OpenGuide: `{ slug, url }`
- Guides.Download: `{ slug, category: 'attachment'|'template', id, title? }`
- Guides.RelatedClick: `{ from, to }`
- Guides.Share: `{ slug }`
- Guides.Print: `{ slug }`
