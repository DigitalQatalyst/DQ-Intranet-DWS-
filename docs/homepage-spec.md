# Home Page — Functional & UX Spec (DQ Intranet)

_Last updated: 2026-02-04_

## Page Purpose
The home page is the signed-out/signed-in landing for Digital Workspace (DQ). It must guide associates to onboarding, marketplaces, knowledge, and media while showcasing trust signals and support entry points.

## Layout & Sections (top → bottom)
1) **Hero**  
   - Full-height gradient hero with animated overlay and AI prompt box.  
   - Primary CTA: `Start Your Onboarding Journey` → `/signin?redirect=/onboarding/welcome` (if signed out) or `/onboarding/welcome` (if signed in).  
   - Secondary affordances: suggestion pills populate the prompt input; submit dispatches `dq-hero-sent-to-chat` and `dws-chat-send-message` browser events and falls back to `/search?query={text}` when chat is unavailable.  
   - Scroll indicator moves to the next section smoothly.

2) **What’s Happening at DQ (Featured updates carousel)**  
   - Auto-advancing (5s) carousel of latest news/events/podcasts from Media Center; manual dots to switch slides.  
   - Each slide: partnership chip, title, description, `View Details` link (to `/marketplace/news/:id`) and optional `Apply` CTA.  
   - Fallback slide shown when no live media data is available; uses local asset (no remote fetch).

3) **Proof & Trust**  
   - Impact stats (animated counters).  
   - “Associate Voices” carousel with modal, autoplay with pause on hover/touch.  
   - “Four Pillars of Success” grid of partner categories with animated counters.  
   - Featured sectors logo ticker with controls.

4) **Associate Growth Journey**  
   - Timeline + paged cards describing eight journey stages.  
   - CTA per stage opens modal (`StageModal`) with detailed content.  
   - Progress bar animates when section enters viewport.

5) **Services & Marketplaces**  
   - Four hubs (Learning, Media, Service Requests, Organization).  
   - Each hub uses `ServiceCarousel` with cards (active vs. “Coming Soon”).  
   - Card click navigates to configured path.

6) **Knowledge Hub (Insights)**  
   - Segmented tabs: `News`, `Podcast`.  
   - Fetches Media Center data; falls back to cached items with inline notice.  
   - Cards open `/marketplace/news/:id`; empty-state copy shown if no items.

7) **Lead & Apply (Get Support)**  
   - Three action cards + “Get Support” modal form (name/email/message).  
   - Form traps focus, supports ESC to close, shows success/error status.  
   - CTA buttons use DQ gradient and keyboard activation.

8) **Header/Footer**  
   - Unmodified per requirement.

## Data & States
- **Media data:** `fetchAllNews()` (local Media Center feed). Sorted by date descending.  
- **Hero loading overlay:** 100ms artificial delay on first load; shows spinner and copy.  
- **Fallback behaviour:**  
  - Featured updates: falls back to static slide.  
  - Knowledge Hub: shows amber notice and cached items when live load fails or returns empty.  
- **Carousels:** auto-advance every 5s; pause on hover/touch where applicable.

## Interactions & Navigation
- Hero search submit → chat events; fallback router → single match route or `/search?query=`.  
- Scroll indicator → scrolls to the next main section.  
- Service cards → navigate to `service.path`. Coming Soon cards are disabled with lock icon.  
- Knowledge Hub cards → detail page; podcasts reuse News card presentation.  
- Support modal → form validation (all fields required); success message shown inline.

## Accessibility
- Keyboard: carousels and CTAs focusable; hero submit disabled when empty; support modal traps focus and closes on ESC.  
- ARIA: buttons include `aria-label` where icons are primary affordances.  
- Color: text contrasts against gradients (#030F35 / white) meet WCAG AA for primary CTAs.

## Acceptance Criteria (QA/UAT)
1. Hero CTA routes correctly based on auth state; prompt submit fires both custom events and navigates when chat unavailable.  
2. Featured updates display latest news/events/podcasts or fallback slide; auto-advance and dot navigation work.  
3. Knowledge Hub:  
   - News tab shows announcements/company/policy/upcoming items (max 6).  
   - Podcast tab shows podcast-formatted items (max 6) with a visible “Play” badge.  
   - If data load fails, amber notice appears and cached content renders; no blank state.  
4. Journey stage cards open the correct modal; progress bar animates on viewport entry.  
5. Service carousels render correct counts and disable “Coming Soon” cards.  
6. Support modal: required fields enforced, success and error states visible; focus returns to trigger on close.  
7. Page remains functional with slow/failed media fetch (no unhandled errors).  
8. No changes to header/footer markup or behaviour.

## Test Plan (manual)
- Desktop Chrome + mobile viewport.  
- Disable network to Media Center endpoint (simulated) → verify fallback notices and content still render in Featured updates and Knowledge Hub.  
- Keyboard-only path: navigate hero input → submit; tab through carousels; open/close modals.  
- Screen-reader spot check of hero, cards, modals (ensure labels announced).  
- Responsive: verify carousels collapse to 1-up at <640px and 2-up at <1024px.
