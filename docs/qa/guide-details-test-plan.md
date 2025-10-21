Guide Details Page — QA Test Plan

Core Scenarios

- Route resolution
  - Navigate to `/marketplace/guides/:slug` for a valid slug → details render.
  - Navigate to `/marketplace/knowledge-hub/:id` (legacy) → same details render.
  - Invalid slug/id → clean 404 state with back link.

- Data visibility (RLS)
  - As public (logged out): non-Approved slugs should not render (404 state).
  - As authenticated: Draft/Archived renders with a prominent non-approved banner.

- Dynamic sections
  - Policy: inline body renders; metadata section first; hides steps when none.
  - Process/SOP: inline body renders as primary content; steps shown when present.
  - Template: templates section prioritized; prominent CTA; optional short body renders below.
  - Checklist: inline body renders; steps show checkboxes; toggling is keyboard accessible.
  - Best Practice: inline body renders with recommended actions emphasis.
  - Empty states: if no attachments/templates/related, sections are omitted without gaps.

- Fallback image logic
  - Missing/invalid `hero_image_url` → domain fallback, then type, then neutral.
  - All images have alt text and load lazily.

- Interactions
  - Open Guide: opens new tab; event `Guides.OpenGuide` fires.
  - Share: Web Share API path or clipboard fallback; event `Guides.Share` fires.
  - Print: triggers print dialog; event `Guides.Print` fires.
  - Download attachment/template: opens URL; event `Guides.Download` fires with correct metadata.
  - Related guide click: navigates to new details; event `Guides.RelatedClick` fires.

- Navigation state
  - From list page with filters/search, click a guide → details.
  - Click “Back to Guides” → returns to listing with previous query preserved.

Accessibility

- Keyboard navigation order is logical through header → main → sidebar → footer.
- Buttons and links have visible focus; aria labels on breadcrumb and checkboxes.
- Semantics: `header`, `nav[aria-label=Breadcrumb]`, `main`, `aside`, section headings with `aria-labelledby`.

Performance

- Images use `loading="lazy"`; no major CLS when hero loads.
- Related guides query limited to 6; ordered by relevance.

Regression Checks

- Other marketplace routes and details pages render unchanged.
- Guides listing loads and card clicks navigate correctly.
