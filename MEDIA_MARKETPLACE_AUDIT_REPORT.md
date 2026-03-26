# MEDIA MARKETPLACE AUDIT REPORT

**Project:** DQ-Intranet-DWS
**Feature URL:** `http://localhost:3004/marketplace/media-center?tab=announcements`
**Branch:** `feature/news-marketplace`
**Audit Date:** 2026-03-25
**Prepared By:** Automated Dependency-Aware Structural Audit
**Status:** Draft — For Manual Review Before Execution

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Audit Scope](#2-audit-scope)
3. [Media Marketplace Functional Boundary](#3-media-marketplace-functional-boundary)
4. [Dependency Map](#4-dependency-map)
5. [Structure Report](#5-structure-report)
6. [File Classification Matrix](#6-file-classification-matrix)
7. [Unused / Deletable Files](#7-unused--deletable-files)
8. [Seed Files and Test Scripts Review](#8-seed-files-and-test-scripts-review)
9. [Merge and Overwrite Risk Assessment](#9-merge-and-overwrite-risk-assessment)
10. [Safe Cleanup Plan](#10-safe-cleanup-plan)
11. [Final Minimal File Set](#11-final-minimal-file-set)
12. [Final Recommendations](#12-final-recommendations)
13. [Safe Execution Recommendation](#safe-execution-recommendation)

---

## 1. Executive Summary

### Feature Identity

The **Media Marketplace** refers to the media-center sub-section of the broader marketplace feature, accessible at `/marketplace/media-center`. This is a tab-driven content hub rendering:

- **Announcements** — internal company news, policies, events
- **Insights / Blogs** — thought leadership articles
- **Podcasts** — audio series cards and episode lists
- **Opportunities / Jobs** — open job listings with detail and application flows

### Isolation Assessment

| Question | Answer |
|----------|--------|
| Can Media Marketplace be isolated cleanly? | **Partially** — its own component tree is clean, but it is registered inside `MarketplaceRouter.tsx`, which serves 30+ other routes. Isolating the page requires extracting route registration carefully. |
| Are there clean feature boundaries? | **Yes** for components. The `src/components/media-center/` folder is self-contained. |
| Are shared dependencies a risk? | **Yes** — Header, Footer, Auth context, UI library, analytics utils, and Supabase client are shared app-wide. |
| Is mock/seed data still active? | **Yes** — `src/data/media/news.ts` contains a large MOCK_NEWS fallback array still used in `mediaCenterService.ts`. |
| Is there test coverage? | **Minimal** — only `tests/guides.spec.ts` exists; no media-specific test file. |

### Approximate Counts

| Category | Count |
|----------|-------|
| Core Media Feature Files | ~35 |
| Shared Dependencies (required) | ~18 |
| Integration Files (routing, providers) | ~5 |
| Seed / Mock Data Files | ~6 |
| Scripts (migration/content) | 127 (most are operational relics) |
| Test Files | 1 (guides only, not media) |
| Deletable with confidence | ~15–25 scripts; 3 debug Python files |

### Key Risks

1. **MarketplaceRouter.tsx** is a shared routing file managing all `/marketplace/*` routes. Overwriting it blindly will break 30+ other routes.
2. **src/data/media/news.ts** is a large fallback data file (~112KB). It is still actively used as fallback in `mediaCenterService.ts`. Do not delete.
3. **`src/pages/media/`** and **`src/pages/media-center/`** folders appear to contain legacy page variants. These need manual validation against the active routes.
4. **127 scripts** in `/scripts/` are operational artifacts — most are one-time migration helpers. Batch deletion requires individual validation.
5. A merge from another branch may overwrite `MarketplaceRouter.tsx`, `mediaCenterService.ts`, or shared UI components — these require manual diff.

### Recommended Cleanup Strategy

- **Immediate safe removals:** Python debug scripts, clearly orphaned one-time migration scripts with no active references
- **Deferred validation:** Legacy page duplicates (`src/pages/media/`, `src/pages/media-center/` vs `src/pages/marketplace/`)
- **Preserve strictly:** All shared infrastructure, routing files, auth context, environment files, Supabase client

---

## 2. Audit Scope

### Root Folders Reviewed

```
d:\DQ\DWS\News-Marketpalce-25-Mar\DQ-Intranet-DWS\
├── src/                    REVIEWED — full traversal
├── scripts/                REVIEWED — all 127 files listed
├── tests/                  REVIEWED — 1 file found
├── data/                   REVIEWED — guides.sqlite only
├── supabase/               REVIEWED — top level
├── sql/                    REVIEWED — 3 markdown docs
├── public/                 NOT FULLY REVIEWED — static assets, assumed standard
├── api/                    NOT FULLY REVIEWED — backend functions
├── db/                     NOT FULLY REVIEWED — database config
├── k8s/                    NOT REVIEWED — infrastructure only
├── docs/                   NOT REVIEWED — documentation only
├── .kiro/                  REVIEWED — 3 spec sets
├── .github/                NOT REVIEWED — CI/CD workflows
```

### Feature Folders Reviewed

```
src/components/media-center/        FULLY REVIEWED
src/components/marketplace/         FULLY REVIEWED
src/pages/marketplace/              FULLY REVIEWED
src/pages/media/                    LISTED (contents need validation)
src/pages/media-center/             LISTED (contents need validation)
src/services/                       LISTED + key files read
src/hooks/                          LISTED + key files read
src/data/media/                     REVIEWED
src/utils/                          LISTED + key files identified
src/types/                          LISTED
```

### Config/Build/Test Locations Reviewed

```
package.json                        REVIEWED (scripts + deps)
tsconfig.json                       NOTED (@ alias confirmed)
vite.config.ts                      NOTED
.env, .env.example                  EXISTENCE CONFIRMED
tests/guides.spec.ts                REVIEWED
```

### Assumptions and Limitations

- File contents were read via automated tooling. Some file relationships are inferred from import patterns and naming conventions.
- Files marked **"Needs Manual Validation"** require a human to open and verify the import graph at runtime.
- The `src/pages/media/` and `src/pages/media-center/` directories are listed but their exact route registrations could not be fully confirmed — treat as manual review required.
- The 127 scripts in `/scripts/` were listed but not individually read; their "obsolete" classification is based on naming patterns, not confirmed import absence.
- `api/` backend functions were not deeply traced — indirect dependencies on the Supabase schema are assumed.

---

## 3. Media Marketplace Functional Boundary

The **Media Marketplace** is the feature rendered at `/marketplace/media-center`.

### Pages

| Page | Route | File |
|------|-------|------|
| Media Center Hub | `/marketplace/media-center` | `src/pages/marketplace/NewsPage.tsx` |
| Article / Announcement Detail | `/marketplace/media-center/:articleId` | `src/pages/marketplace/NewsDetailPage.tsx` |
| Job Detail | `/marketplace/media-center/jobs/:jobId` | `src/pages/marketplace/JobDetailPage.tsx` |
| Job Application | `/marketplace/media-center/jobs/:jobId/apply` | `src/pages/marketplace/JobApplicationPage.tsx` |
| Podcast Series | `/marketplace/news/action-solver-podcast` and similar | `src/pages/marketplace/PodcastSeriesPage.tsx` |

### Components

**Grid / Tab Components:**
- `src/components/media-center/AnnouncementsGrid.tsx`
- `src/components/media-center/BlogsGrid.tsx`
- `src/components/media-center/JobsGrid.tsx`
- `src/components/media-center/PodcastsGrid.tsx`
- `src/components/media-center/TabContent.tsx`
- `src/components/media-center/FiltersPanel.tsx`

**Layout Components (media-center scoped):**
- `src/components/media-center/Navigation.tsx`
- `src/components/media-center/Hero.tsx`
- `src/components/media-center/Footer.tsx`
- `src/components/media-center/Sidebar.tsx`
- `src/components/media-center/RelatedArticles.tsx`

**Card Components:**
- `src/components/media-center/cards/NewsCard.tsx`
- `src/components/media-center/cards/BlogCard.tsx`
- `src/components/media-center/cards/JobCard.tsx`
- `src/components/media-center/cards/PodcastSeriesCard.tsx`

**Detail Sub-Components:**
- `src/components/media-center/detail/HeroSection.tsx`
- `src/components/media-center/detail/ArticleContent.tsx`
- `src/components/media-center/detail/ArticleSummary.tsx`
- `src/components/media-center/detail/ErrorState.tsx`
- `src/components/media-center/detail/EngagementMetrics.tsx`
- `src/components/media-center/detail/buildOverview.ts`
- `src/components/media-center/detail/contentHelpers.ts`

**Type Definitions:**
- `src/components/media-center/types.ts` — `MediaCenterTabKey`, `FacetConfig`, `FiltersValue`

### Routes

- **Parent router:** `src/pages/marketplace/MarketplaceRouter.tsx`
- **Registration path:** `AppRouter.tsx` → `/marketplace/*` → `MarketplaceRouter.tsx`
- **Relevant route definitions inside MarketplaceRouter.tsx:**
  ```
  /marketplace/media-center           → NewsPage
  /marketplace/media-center/:id       → NewsDetailPage
  /marketplace/news/*                 → PodcastSeriesPage (specific slugs)
  ```

### Services / APIs

| Service | File | Data Source |
|---------|------|-------------|
| Fetch all news/announcements | `src/services/mediaCenterService.ts` → `fetchAllNews()` | Supabase + MOCK_NEWS fallback |
| Fetch all jobs | `src/services/mediaCenterService.ts` → `fetchAllJobs()` | Supabase + fallback |
| Fetch job by ID | `src/services/mediaCenterService.ts` → `fetchJobById()` | Supabase |
| Marketplace items (partial use) | `src/services/marketplace.ts` | GraphQL + Supabase |

### Hooks

| Hook | File | Used By |
|------|------|---------|
| `useArticleData` | `src/hooks/useArticleData.ts` | `NewsDetailPage.tsx` |
| `useEngagementMetrics` | `src/hooks/useEngagementMetrics.ts` | `NewsDetailPage.tsx` |
| `useMediaItem` | `src/hooks/useMediaItem.ts` | Media detail components |
| `UseMediaSearch` | `src/hooks/UseMediaSearch.ts` | Search within media |

### State / Store

- No dedicated Redux/Zustand slice for media-center. State is local (`useState`) + React Query.
- Auth state comes from `AuthContext` (shared).
- Seen-items tracking via `src/utils/mediaTracking.ts` (localStorage-based).

### Assets

- Icons: `lucide-react` (external package, no local files)
- Tailwind CSS (utility classes only, no dedicated CSS module)
- Local image: `/job openings.jpg` referenced in `JobDetailPage.tsx` (fallback hero)
- External fallback images: Unsplash URLs (CDN, no local asset)

### Configs

- No dedicated feature config file. Tab definitions live inside `NewsPage.tsx` (SECONDARY_FACETS object).
- `src/utils/marketplaceConfig.ts` — shared marketplace-wide config, partially used

### Integration Points with Larger App

| Integration | Mechanism |
|-------------|-----------|
| App-wide routing | `MarketplaceRouter.tsx` registered in `AppRouter.tsx` |
| Authentication | `AuthContext` from `src/components/Header/context/AuthContext.tsx` |
| Analytics | `track()` from `src/utils/analytics.ts` |
| Seen-item tracking | `getSeenMediaItems()` from `src/utils/mediaTracking.ts` |
| Header/Footer | Shared `src/components/Header/index.tsx`, `src/components/Footer/index.tsx` |
| Supabase client | Initialized in `src/lib/` or `src/services/` — shared singleton |
| Apollo GraphQL | Configured in `src/main.tsx`, used by `src/services/graphql/client.ts` |

---

## 4. Dependency Map

### 4.1 Direct Feature Files

These files are **owned by and exclusively serving** the Media Marketplace feature.

| File Path | Purpose | Why Required | Directly Used By | Overwrite Risk | Deletion Status |
|-----------|---------|--------------|-----------------|----------------|-----------------|
| `src/pages/marketplace/NewsPage.tsx` | Main entry point for media-center hub | Renders all tabs (announcements, insights, podcasts, jobs) | `MarketplaceRouter.tsx` | **High** — contains tab logic and SECONDARY_FACETS | Keep |
| `src/pages/marketplace/NewsDetailPage.tsx` | Article/announcement detail view | Renders full article with engagement metrics | `MarketplaceRouter.tsx` | **Medium** | Keep |
| `src/pages/marketplace/JobDetailPage.tsx` | Job listing detail view | Shows job description, requirements, apply CTA | `MarketplaceRouter.tsx` | **Medium** | Keep |
| `src/pages/marketplace/JobApplicationPage.tsx` | Job application form | Allows users to apply for jobs | `MarketplaceRouter.tsx` | **Medium** | Keep |
| `src/pages/marketplace/PodcastSeriesPage.tsx` | Podcast series detail | Renders podcast series metadata and episodes | `MarketplaceRouter.tsx` | **Medium** | Keep |
| `src/components/media-center/AnnouncementsGrid.tsx` | Grid of announcement cards | Renders filtered announcements in the Announcements tab | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/BlogsGrid.tsx` | Grid of blog/insight cards | Renders filtered blog articles in the Insights tab | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/JobsGrid.tsx` | Grid of job opportunity cards | Renders job listings in the Opportunities tab | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/PodcastsGrid.tsx` | Grid of podcast series cards | Renders podcasts in the Podcasts tab | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/FiltersPanel.tsx` | Filter sidebar for all tabs | Provides facet filtering per tab | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/TabContent.tsx` | Tab content wrapper | Manages tab-panel rendering | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/Navigation.tsx` | Media-center navigation bar | Provides secondary nav within media-center | `NewsPage.tsx` / detail pages | **Low** | Keep |
| `src/components/media-center/Hero.tsx` | Hero banner for media center | Top banner section | `NewsPage.tsx` | **Low** | Keep |
| `src/components/media-center/Footer.tsx` | Media-center footer section | Bottom section with links | `NewsPage.tsx` / detail pages | **Low** | Keep |
| `src/components/media-center/Sidebar.tsx` | Article sidebar | Related content and metadata in detail view | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/RelatedArticles.tsx` | Related content cards | Shows related articles at bottom of detail | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/types.ts` | TypeScript type definitions | `MediaCenterTabKey`, `FacetConfig`, `FiltersValue` | All media-center components | **Medium** | Keep |
| `src/components/media-center/cards/NewsCard.tsx` | Announcement card UI | Renders individual announcement item | `AnnouncementsGrid.tsx` | **Low** | Keep |
| `src/components/media-center/cards/BlogCard.tsx` | Blog card UI | Renders individual blog/insight item | `BlogsGrid.tsx` | **Low** | Keep |
| `src/components/media-center/cards/JobCard.tsx` | Job card UI | Renders individual job listing | `JobsGrid.tsx` | **Low** | Keep |
| `src/components/media-center/cards/PodcastSeriesCard.tsx` | Podcast card UI | Renders podcast series | `PodcastsGrid.tsx` | **Low** | Keep |
| `src/components/media-center/detail/HeroSection.tsx` | Detail page hero | Hero section in article detail view | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/detail/ArticleContent.tsx` | Article body renderer | Renders markdown/rich text article body | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/detail/ArticleSummary.tsx` | Article summary block | Key summary before full article | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/detail/ErrorState.tsx` | Error display | Shows error state on fetch failure | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/detail/EngagementMetrics.tsx` | View/like metrics | Shows read count, reactions | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/detail/buildOverview.ts` | Overview builder utility | Constructs article overview metadata | `NewsDetailPage.tsx` | **Low** | Keep |
| `src/components/media-center/detail/contentHelpers.ts` | Content formatting helpers | Utility functions for article content parsing | Multiple detail components | **Low** | Keep |
| `src/services/mediaCenterService.ts` | Primary data service | `fetchAllNews()`, `fetchAllJobs()`, `fetchJobById()` from Supabase | `NewsPage.tsx`, `NewsDetailPage.tsx`, hooks | **High** | Keep |
| `src/hooks/useArticleData.ts` | Article data hook | Encapsulates fetch + state for article detail | `NewsDetailPage.tsx` | **Medium** | Keep |
| `src/hooks/useEngagementMetrics.ts` | Engagement data hook | Tracks and fetches engagement counts | `NewsDetailPage.tsx`, `EngagementMetrics.tsx` | **Medium** | Keep |
| `src/hooks/useMediaItem.ts` | Single media item hook | Fetches individual media item by ID | Detail components | **Medium** | Keep |
| `src/hooks/UseMediaSearch.ts` | Media search hook | Handles search within media content | `FiltersPanel.tsx` / `NewsPage.tsx` | **Medium** | Keep |
| `src/data/media/news.ts` | Mock news fallback data | Large `MOCK_NEWS` array used as fallback when Supabase is unavailable | `mediaCenterService.ts` | **High** — large file, actively referenced | Keep |
| `src/data/media/jobs.ts` | Mock jobs fallback data | Job type definitions and mock job listings | `mediaCenterService.ts` | **High** | Keep |

---

### 4.2 Shared Dependencies

These files exist **outside** the media feature folder but are **required** for the feature to function.

| File Path | Dependency Type | Why Media Marketplace Depends on It | Shared With Other Features | Overwrite Risk | Deletion Status |
|-----------|-----------------|--------------------------------------|---------------------------|----------------|-----------------|
| `src/pages/marketplace/MarketplaceRouter.tsx` | Routing — route registry | All `/marketplace/*` routes are registered here, including `/media-center` | **Yes** — manages 30+ routes for courses, financial, services, guides, design-system, products | **High** | Do Not Delete |
| `src/AppRouter.tsx` | Root routing | Registers `MarketplaceRouter` under `/marketplace/*`; also handles auth guards, Apollo, DWSChat | **Yes** — entire app | **High** | Do Not Delete |
| `src/main.tsx` | App entry point | Bootstraps MSAL auth, Apollo Client, React Query, renders `AppRouter` | **Yes** — entire app | **High** | Do Not Delete |
| `src/components/Header/index.tsx` | Shared layout | Header rendered on all marketplace pages including media-center pages | **Yes** — all pages | **High** | Do Not Delete |
| `src/components/Header/Header.tsx` | Shared layout | Header implementation | **Yes** — all pages | **High** | Do Not Delete |
| `src/components/Header/ProfileDropdown.tsx` | Shared layout | User profile menu in header | **Yes** — all pages | **Medium** | Do Not Delete |
| `src/components/Header/context/AuthContext.tsx` | Auth context | Provides user auth state to entire app including media pages | **Yes** — app-wide | **High** | Do Not Delete |
| `src/components/Footer/index.tsx` | Shared layout | Footer rendered on media-center pages | **Yes** — all pages | **Medium** | Do Not Delete |
| `src/components/Footer/Footer.tsx` | Shared layout | Footer implementation | **Yes** — all pages | **Medium** | Do Not Delete |
| `src/components/ui/tabs.tsx` | UI component | Tab navigation used by `NewsPage.tsx` | **Yes** — UI library used app-wide | **Low** | Do Not Delete |
| `src/components/ui/button.tsx` | UI component | Buttons in media-center components | **Yes** — UI library | **Low** | Do Not Delete |
| `src/components/ui/card.tsx` | UI component | Card containers in grids | **Yes** — UI library | **Low** | Do Not Delete |
| `src/components/ui/badge.tsx` | UI component | Category/type badges on cards | **Yes** — UI library | **Low** | Do Not Delete |
| `src/components/ui/input.tsx` | UI component | Search and filter inputs | **Yes** — UI library | **Low** | Do Not Delete |
| `src/components/ui/breadcrumb.tsx` | UI component | Navigation breadcrumbs on detail pages | **Yes** — UI library | **Low** | Do Not Delete |
| `src/components/ui/media-center-button.tsx` | UI component | Specialized button variant for media-center | Likely media-specific despite being in ui/ | **Medium** | Manual Review |
| `src/utils/analytics.ts` | Analytics utility | `track()` function called in `NewsPage.tsx` and detail pages | **Yes** — used across features | **Medium** | Do Not Delete |
| `src/utils/mediaTracking.ts` | Tracking utility | `getSeenMediaItems()` — marks items as seen (localStorage) | Likely media-specific despite being in utils/ | **Medium** | Manual Review |
| `src/services/graphql/client.ts` | GraphQL client | Apollo client configuration for marketplace API calls | **Yes** — shared across marketplace | **Medium** | Do Not Delete |
| `src/services/graphql/queries.ts` | GraphQL queries | Contains `MARKETPLACE_QUERIES` including knowledge-hub queries | **Yes** — shared across marketplace | **Medium** | Do Not Delete |
| `src/lib/supabaseClient.ts` (or equivalent) | Database client | Supabase singleton used by `mediaCenterService.ts` | **Yes** — used by all Supabase-backed services | **High** | Do Not Delete |

---

### 4.3 Indirect Dependencies

Secondary dependencies reached through the dependency chain.

| File Path | Dependency Chain | Risk If Removed |
|-----------|-----------------|-----------------|
| `src/utils/marketplaceConfig.ts` | `MarketplaceRouter.tsx` → `marketplaceConfig.ts` | Would break all marketplace routing logic and tab configurations |
| `src/types/marketplace.ts` | `MarketplacePage.tsx` → `marketplace.ts` types; potentially used in media service typing | TypeScript errors across marketplace, may include media-relevant interfaces |
| `src/components/DWSChatProvider.tsx` | `AppRouter.tsx` wraps app with `DWSChatProvider` | If removed from AppRouter context, chat widget unavailable app-wide |
| `src/components/DWSChatWidget.tsx` | Used within `DWSChatProvider.tsx` | Dependency of provider |
| `src/components/ProtectedRoute.tsx` | `AppRouter.tsx` wraps marketplace routes in auth guard | Removing breaks authentication on all marketplace routes including media-center |
| `src/components/SearchBar.tsx` | Used by `MarketplacePage.tsx` (not directly media-center but same router context) | Risk to marketplace shell |
| `src/components/SkeletonLoader.tsx` | Used for loading states across marketplace | Removing causes missing component errors if imported in media hooks/pages |
| `tsconfig.json` | Defines `@/` path alias used in all src imports | Removing or altering breaks all absolute imports across the project |
| `vite.config.ts` | Build configuration; defines path aliases and dev server settings | Build fails if removed or misconfigured |
| `package.json` | All library dependencies (lucide-react, radix-ui, tailwind, supabase, etc.) | Project cannot build without |
| `.env` | Supabase URL, API keys, auth config | `mediaCenterService.ts` Supabase client fails if env vars missing |
| `src/components/common/ComingSoonCountdownPage.tsx` | Referenced in `App.tsx` routing | Removing breaks coming-soon routes registered in App.tsx |

---

## 5. Structure Report

### Top-Level Directory Involvement

```
d:\DQ\DWS\News-Marketpalce-25-Mar\DQ-Intranet-DWS\
├── src/
│   ├── components/
│   │   ├── media-center/           ← PRIMARY: All media-center UI components
│   │   │   ├── cards/              ← Card sub-components (4 files)
│   │   │   ├── detail/             ← Detail page sub-components (7 files)
│   │   │   ├── [root files]        ← Grid, panel, nav, hero, footer, types (12 files)
│   │   ├── marketplace/            ← SHARED: General marketplace components
│   │   ├── Header/                 ← SHARED: App-wide header
│   │   ├── Footer/                 ← SHARED: App-wide footer
│   │   ├── ui/                     ← SHARED: Base UI component library (shadcn/ui)
│   │   └── [64 top-level files]    ← App-wide shared components
│   ├── pages/
│   │   ├── marketplace/            ← PRIMARY: Pages for all marketplace routes
│   │   │   ├── NewsPage.tsx        ← Entry point for /marketplace/media-center
│   │   │   ├── NewsDetailPage.tsx
│   │   │   ├── JobDetailPage.tsx
│   │   │   ├── JobApplicationPage.tsx
│   │   │   ├── PodcastSeriesPage.tsx
│   │   │   ├── MarketplaceRouter.tsx  ← SHARED: Route registry for all /marketplace/*
│   │   │   └── [8 other marketplace pages]
│   │   ├── media/                  ← NEEDS VALIDATION: Possible legacy page variants
│   │   ├── media-center/           ← NEEDS VALIDATION: Possible legacy page variants
│   │   └── [19 other page directories]
│   ├── services/
│   │   ├── mediaCenterService.ts   ← PRIMARY: Data fetching for media-center
│   │   ├── marketplace.ts          ← SHARED: Data fetching for all marketplace types
│   │   └── graphql/                ← SHARED: Apollo GraphQL client + queries
│   ├── hooks/
│   │   ├── useArticleData.ts       ← PRIMARY: Article data management
│   │   ├── useEngagementMetrics.ts ← PRIMARY: Engagement tracking
│   │   ├── useMediaItem.ts         ← PRIMARY: Single item fetching
│   │   └── UseMediaSearch.ts       ← PRIMARY: Media search hook
│   ├── data/
│   │   └── media/
│   │       ├── news.ts             ← PRIMARY: Mock/fallback news data (~112KB)
│   │       └── jobs.ts             ← PRIMARY: Mock/fallback job data
│   ├── utils/
│   │   ├── analytics.ts            ← SHARED: Event tracking
│   │   ├── mediaTracking.ts        ← LIKELY MEDIA-SPECIFIC: Seen-items tracking
│   │   └── marketplaceConfig.ts    ← SHARED: All marketplace type configs
│   ├── types/
│   │   └── marketplace.ts          ← SHARED: Shared type definitions
│   ├── App.tsx                     ← SHARED: Non-marketplace routes
│   ├── AppRouter.tsx               ← SHARED: Root router — registers all route sections
│   └── main.tsx                    ← SHARED: App bootstrap (MSAL, Apollo, React Query)
├── supabase/
│   ├── seed-news-announcements.sql ← MEDIA SEED: News seed data
│   └── seed-news-blogs.sql         ← MEDIA SEED: Blog seed data
├── scripts/                        ← 127 operational/migration scripts
├── tests/
│   └── guides.spec.ts              ← TEST: Guides only, not media
└── data/
    └── guides.sqlite               ← LOCAL DB: Guides development database
```

### Major Entry Points

| Entry Point | Path | Description |
|-------------|------|-------------|
| App Bootstrap | `src/main.tsx` | Initializes MSAL, Apollo, React Query, renders AppRouter |
| Root Router | `src/AppRouter.tsx` | Manages all top-level routes and auth guards |
| Marketplace Router | `src/pages/marketplace/MarketplaceRouter.tsx` | Registers all `/marketplace/*` sub-routes |
| Media Center Page | `src/pages/marketplace/NewsPage.tsx` | Renders at `/marketplace/media-center` |

### Module Relationships

```
main.tsx
  └── AppRouter.tsx
        ├── App.tsx (non-marketplace routes)
        ├── MarketplaceRouter.tsx (/marketplace/*)
        │     ├── NewsPage.tsx (/media-center)
        │     │     ├── FiltersPanel.tsx
        │     │     ├── AnnouncementsGrid.tsx → NewsCard.tsx
        │     │     ├── BlogsGrid.tsx → BlogCard.tsx
        │     │     ├── JobsGrid.tsx → JobCard.tsx
        │     │     ├── PodcastsGrid.tsx → PodcastSeriesCard.tsx
        │     │     └── mediaCenterService.ts → Supabase / MOCK_NEWS
        │     ├── NewsDetailPage.tsx (/media-center/:id)
        │     │     ├── useArticleData.ts → mediaCenterService.ts
        │     │     ├── useEngagementMetrics.ts
        │     │     ├── detail/HeroSection.tsx
        │     │     ├── detail/ArticleContent.tsx
        │     │     ├── detail/ArticleSummary.tsx
        │     │     ├── detail/EngagementMetrics.tsx
        │     │     ├── detail/ErrorState.tsx
        │     │     └── Sidebar.tsx, RelatedArticles.tsx
        │     ├── JobDetailPage.tsx
        │     ├── JobApplicationPage.tsx
        │     └── PodcastSeriesPage.tsx
        ├── DashboardRouter.tsx (/dashboard/*)
        └── [other route sections]
```

### Architectural Notes

- **No Redux / Zustand**: Media-center uses local state + React Query only
- **Fallback data pattern**: `mediaCenterService.ts` tries Supabase first, falls back to `MOCK_NEWS` / `src/data/media/`
- **Tab-driven UI**: Tabs are defined inline in `NewsPage.tsx` via `SECONDARY_FACETS` constant
- **Lazy loading**: Most guides and product pages in `MarketplaceRouter.tsx` are lazy-loaded; media-center pages may or may not be — needs confirmation
- **No feature flags**: No explicit feature flag system found; features are enabled by route registration

---

## 6. File Classification Matrix

| File Path | Category | Reason | Used By | Risk Level | Recommended Action | Confidence |
|-----------|----------|--------|---------|------------|--------------------|------------|
| `src/pages/marketplace/NewsPage.tsx` | Core Feature File | Primary rendering page for /marketplace/media-center | MarketplaceRouter.tsx | High | Preserve Carefully | High |
| `src/pages/marketplace/NewsDetailPage.tsx` | Core Feature File | Article detail page | MarketplaceRouter.tsx | Medium | Overwrite Allowed (with review) | High |
| `src/pages/marketplace/JobDetailPage.tsx` | Core Feature File | Job detail page | MarketplaceRouter.tsx | Medium | Overwrite Allowed (with review) | High |
| `src/pages/marketplace/JobApplicationPage.tsx` | Core Feature File | Job application form | MarketplaceRouter.tsx | Medium | Overwrite Allowed | High |
| `src/pages/marketplace/PodcastSeriesPage.tsx` | Core Feature File | Podcast series view | MarketplaceRouter.tsx | Medium | Overwrite Allowed | High |
| `src/components/media-center/AnnouncementsGrid.tsx` | Core Feature File | Announcements tab content | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/BlogsGrid.tsx` | Core Feature File | Insights tab content | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/JobsGrid.tsx` | Core Feature File | Opportunities tab content | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/PodcastsGrid.tsx` | Core Feature File | Podcasts tab content | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/FiltersPanel.tsx` | Core Feature File | Filter UI for all tabs | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/Navigation.tsx` | Core Feature File | Secondary nav within media section | NewsPage.tsx, detail pages | Low | Overwrite Allowed | High |
| `src/components/media-center/Hero.tsx` | Core Feature File | Hero banner for media-center | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/Footer.tsx` | Core Feature File | Media-center footer | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/TabContent.tsx` | Core Feature File | Tab panel wrapper | NewsPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/Sidebar.tsx` | Core Feature File | Detail page sidebar | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/RelatedArticles.tsx` | Core Feature File | Related content at article bottom | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/types.ts` | Core Feature File | Type definitions for media-center | All media-center components | Medium | Preserve Carefully | High |
| `src/components/media-center/cards/NewsCard.tsx` | Core Feature File | Announcement card | AnnouncementsGrid.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/cards/BlogCard.tsx` | Core Feature File | Blog card | BlogsGrid.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/cards/JobCard.tsx` | Core Feature File | Job card | JobsGrid.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/cards/PodcastSeriesCard.tsx` | Core Feature File | Podcast card | PodcastsGrid.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/HeroSection.tsx` | Core Feature File | Detail hero | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/ArticleContent.tsx` | Core Feature File | Article body | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/ArticleSummary.tsx` | Core Feature File | Article summary block | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/ErrorState.tsx` | Core Feature File | Error display | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/EngagementMetrics.tsx` | Core Feature File | Engagement display | NewsDetailPage.tsx | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/buildOverview.ts` | Core Feature File | Overview utility | Detail components | Low | Overwrite Allowed | High |
| `src/components/media-center/detail/contentHelpers.ts` | Core Feature File | Content utilities | Detail components | Low | Overwrite Allowed | High |
| `src/services/mediaCenterService.ts` | Core Feature File | Primary data service | NewsPage.tsx, hooks | High | Preserve Carefully | High |
| `src/hooks/useArticleData.ts` | Core Feature File | Article data hook | NewsDetailPage.tsx | Medium | Overwrite Allowed | High |
| `src/hooks/useEngagementMetrics.ts` | Core Feature File | Engagement hook | NewsDetailPage.tsx | Medium | Overwrite Allowed | High |
| `src/hooks/useMediaItem.ts` | Core Feature File | Single item hook | Detail components | Medium | Overwrite Allowed | High |
| `src/hooks/UseMediaSearch.ts` | Core Feature File | Media search hook | NewsPage.tsx | Medium | Overwrite Allowed | High |
| `src/data/media/news.ts` | Core Feature File | Mock/fallback news data (~112KB) | mediaCenterService.ts | High | Preserve Carefully | High |
| `src/data/media/jobs.ts` | Core Feature File | Mock/fallback job data | mediaCenterService.ts | High | Preserve Carefully | High |
| `src/pages/marketplace/MarketplaceRouter.tsx` | Integration File | Route registry for all /marketplace/* | AppRouter.tsx | High | Manual Review | High |
| `src/AppRouter.tsx` | Integration File | Root router, wraps all route sections | main.tsx | High | Manual Review | High |
| `src/main.tsx` | Integration File | App bootstrap | entry | High | Manual Review | High |
| `src/App.tsx` | Integration File | Non-marketplace routes | AppRouter.tsx | High | Manual Review | High |
| `src/components/Header/index.tsx` | Shared Dependency | App-wide header | All pages | High | Manual Review | High |
| `src/components/Header/Header.tsx` | Shared Dependency | Header implementation | Header/index.tsx | High | Manual Review | High |
| `src/components/Header/ProfileDropdown.tsx` | Shared Dependency | Profile menu | Header.tsx | Medium | Manual Review | High |
| `src/components/Header/context/AuthContext.tsx` | Shared Dependency | Auth state provider | App-wide | High | Manual Review | High |
| `src/components/Footer/index.tsx` | Shared Dependency | App-wide footer | All pages | Medium | Manual Review | High |
| `src/components/Footer/Footer.tsx` | Shared Dependency | Footer implementation | Footer/index.tsx | Medium | Manual Review | High |
| `src/components/ui/tabs.tsx` | Shared Dependency | Tab UI primitive | NewsPage.tsx + others | Low | Keep | High |
| `src/components/ui/button.tsx` | Shared Dependency | Button primitive | App-wide | Low | Keep | High |
| `src/components/ui/card.tsx` | Shared Dependency | Card primitive | App-wide | Low | Keep | High |
| `src/components/ui/badge.tsx` | Shared Dependency | Badge primitive | App-wide | Low | Keep | High |
| `src/components/ui/input.tsx` | Shared Dependency | Input primitive | App-wide | Low | Keep | High |
| `src/components/ui/breadcrumb.tsx` | Shared Dependency | Breadcrumb primitive | App-wide | Low | Keep | High |
| `src/components/ui/media-center-button.tsx` | Shared Dependency | Media-specific button | Media-center likely | Medium | Manual Review | Medium |
| `src/utils/analytics.ts` | Shared Dependency | Event tracking | App-wide | Medium | Keep | High |
| `src/utils/mediaTracking.ts` | Optional Support File | Seen-items localStorage tracking | NewsPage.tsx | Medium | Manual Review | Medium |
| `src/utils/marketplaceConfig.ts` | Shared Dependency | Marketplace config data | MarketplaceRouter, pages | High | Keep | High |
| `src/types/marketplace.ts` | Shared Dependency | Type definitions | App-wide | Medium | Keep | High |
| `src/services/graphql/client.ts` | Shared Dependency | Apollo GraphQL client | App-wide | Medium | Keep | High |
| `src/services/graphql/queries.ts` | Shared Dependency | GraphQL queries | App-wide | Medium | Keep | High |
| `src/utils/mockMarketplaceData.ts` | Optional Support File | Fallback mock data for marketplace items | MarketplacePage.tsx | Low | Manual Review | Medium |
| `src/utils/fallbackData.ts` | Optional Support File | Generic fallback items | Marketplace services | Low | Manual Review | Medium |
| `src/utils/staticProducts.ts` | Optional Support File | Static product definitions | ProductDetailPage | Low | Manual Review | Medium |
| `src/utils/designSystemData.ts` | Optional Support File | Design system item data | DesignSystemCard | Low | Manual Review | Medium |
| `src/pages/media/` (folder) | Manual Review Required | Possible legacy media pages; route registration unconfirmed | Unknown | High | Manual Review | Low |
| `src/pages/media-center/` (folder) | Manual Review Required | Possible legacy media-center pages; may be superseded by marketplace/NewsPage | Unknown | High | Manual Review | Low |
| `supabase/seed-news-announcements.sql` | Seed File | Seeds news/announcement data into Supabase | Supabase DB (dev/prod) | Medium | Keep | High |
| `supabase/seed-news-blogs.sql` | Seed File | Seeds blog post data into Supabase | Supabase DB (dev/prod) | Medium | Keep | High |
| `scripts/seed-media-data.sh` | Seed File | Shell script to run media seeds | Dev workflow | Low | Keep | High |
| `scripts/verify-media-tables.js` | Test Script | Verifies media table structure in DB | Dev/CI workflow | Low | Keep | High |
| `tests/guides.spec.ts` | Test Script | Playwright/Vitest spec for guides feature | CI test runner | Low | Keep | High |
| `count_braces_mp.py` | Deprecated File | Debug utility for MarketplacePage.tsx brace matching | None (manual use) | None | Delete Safe | High |
| `count_braces.py` | Deprecated File | Generic brace matcher | None (manual use) | None | Delete Safe | High |
| `count_braces_lines.py` | Deprecated File | Line-aware brace matcher | None (manual use) | None | Delete Safe | High |
| `data/guides.sqlite` | Seed File | Local SQLite dev database for guides | Local dev only | None | Manual Review | Medium |
| `src/data/testSupabaseConnection.ts` | Test Script | Supabase connection test utility | Dev testing | None | Delete After Validation | Medium |
| `.kiro/specs/` | Optional Support File | Feature specification files (Kiro IDE) | Dev tooling only | None | Keep | High |
| `scripts/generate-seeds.js` | Seed File | Script to generate seed data | Dev workflow | Low | Keep | Medium |

---

## 7. Unused / Deletable Files

### 7.1 Safe to Delete

These files have strong evidence of being unused, purely for debug/development convenience, or entirely replaced.

| File | Justification |
|------|---------------|
| `count_braces_mp.py` | Python debug script that reads `MarketplacePage.tsx` and counts braces to diagnose syntax errors. It is a one-time manual debug tool. No project code imports it. Not tracked as a build artifact. |
| `count_braces.py` | Same as above — generic brace counter. No imports, no references. |
| `count_braces_lines.py` | Same as above — line-aware variant. No imports, no references. |

**Justification for confidence:** Python files cannot be imported by the TypeScript/React app. They exist only in the root directory as manual debug tools. No build script or CI pipeline references `.py` files. Their presence alongside the `feature/news-marketplace` branch strongly suggests they were created during development of this branch and are no longer needed.

---

### 7.2 Delete After Validation

These files appear removable but require runtime or DB validation before deletion.

| File | Justification | Validation Required |
|------|---------------|---------------------|
| `src/data/testSupabaseConnection.ts` | Named as a test/diagnostic utility. Not a component or service. Likely used only during DB setup. | Grep for any imports of this file; confirm it is not imported in any service or test |
| `data/guides.sqlite` | Local SQLite development database. Supabase is the production data source. This file is not committed for deployment. | Confirm no scripts in `scripts/` or `package.json` reference `data/guides.sqlite` actively |
| `scripts/cleanup-temp-sql.cjs` | Named as a temporary SQL cleanup script | Confirm the SQL it references was already applied and the task is complete |
| `scripts/switch-branch.sh` | Branch-switching shell script in scripts folder | Confirm it's not referenced by CI or any developer workflow document |
| `scripts/sonar-scan.js` | Likely wraps SonarQube scan; check if it duplicates the `sonarqube/` folder setup | Confirm `.github/workflows/` or `package.json` doesn't exclusively rely on this file |

**Note:** The bulk of the 127 scripts in `/scripts/` follow a pattern of one-time content migrations and database setup operations. **Each individual script should be validated** before deletion by checking:
1. Is it referenced in `package.json` scripts?
2. Is it referenced in any GitHub Actions workflow?
3. Was it referenced in a recent commit that clearly marked the work as complete?

Scripts clearly matching **completed one-time tasks** (e.g., `create-dress-code-guideline.js`, `update-atp-stop-scans-title.js`) are candidates for deletion but require the above validation.

---

### 7.3 Not Safe to Delete Yet

These appear suspicious but may still be required.

| File | Why Suspicious | Why It May Still Be Needed |
|------|----------------|---------------------------|
| `src/pages/media/` (folder contents) | There is a `/marketplace/media-center` route served by `pages/marketplace/NewsPage.tsx` — a parallel `pages/media/` folder suggests legacy or duplicate pages | May be registered at a separate route not seen in the audit, or used in the dashboard. Needs route-grep validation. |
| `src/pages/media-center/` (folder contents) | Same concern as above. Both `media/` and `media-center/` may be legacy duplicates of the marketplace version | May be linked from somewhere else in the app (App.tsx, dashboard, sidebar). Needs grep of all import references. |
| `src/utils/mockMarketplaceData.ts` | "mock" in name suggests placeholder | Referenced in `MarketplacePage.tsx` as a fallback — actively used |
| `src/utils/fallbackData.ts` | "fallback" in name | Referenced in marketplace services as a data fallback — likely still active |
| `scripts/db.js` | Generic name, opaque purpose | May be a shared DB utility used by other scripts — needs content review before deletion |
| `scripts/update-env-config.ps1` | PowerShell environment config script | May be part of a developer onboarding or CI environment setup — check if referenced in docs |

---

## 8. Seed Files and Test Scripts Review

### Seed Files

| File | Still Referenced | Affects Which Environment | Deletion Recommendation | Validation Required |
|------|-----------------|--------------------------|------------------------|---------------------|
| `supabase/seed-news-announcements.sql` | **Yes** — `scripts/seed-media-data.sh` and `package.json` likely reference this | Dev + Staging DB seeding | **Keep** — actively seeds Supabase `news` or `announcements` table | Run against a clean DB to verify it applies cleanly |
| `supabase/seed-news-blogs.sql` | **Yes** — same seed pipeline | Dev + Staging DB seeding | **Keep** — seeds blog content table | Same |
| `scripts/seed-media-data.sh` | Referenced by dev workflow | Dev only | **Keep** — orchestrates seed execution | Confirm it points to correct SQL files |
| `scripts/generate-seeds.js` | Unknown — may be used to regenerate seed files | Dev only | **Keep for now** | Check if output seeds match current DB schema |
| `data/guides.sqlite` | Possibly by scripts during local dev | Local dev only | **Delete After Validation** — local SQLite not used in prod | Confirm no active script reads it during `npm run dev` |

### Mock Data

| File | Status | Notes |
|------|--------|-------|
| `src/data/media/news.ts` | **Active fallback** — used in `mediaCenterService.ts` when Supabase is unavailable | Large file (~112KB). Do not delete until Supabase data is stable and fallback is explicitly removed from service |
| `src/data/media/jobs.ts` | **Active fallback** — same pattern | Contains job type definitions + mock job data |
| `src/utils/mockMarketplaceData.ts` | **Active fallback** — referenced in `MarketplacePage.tsx` | Used when GraphQL/API returns no data |
| `src/utils/fallbackData.ts` | **Active fallback** — referenced in services | Generic item fallback |

### Obsolete Mock / Fixture Candidates

| File | Concern |
|------|---------|
| `src/data/lmsCourseDetails.ts` | May be superseded by Supabase LMS data — Needs Manual Validation |
| `src/data/lmsCourses.ts` | Same — may be replaced by live LMS data |
| `src/data/perspectives.ts` | 6XD perspectives static data — check if referenced in an active route |
| `src/data/dwsChatKnowledge.ts` | DWSChat training data — check if still used by `DWSChatProvider.tsx` |

### Test Scripts Review

| File | Status | Notes |
|------|--------|-------|
| `tests/guides.spec.ts` | **Active** — likely covers guide detail page routes | Not media-specific. Keep. Ensure it still passes after branch merge. |
| `scripts/test-wfh-api-response.js` | One-time API test for WFH content | No reference in `package.json` test script. Candidate for deletion after validation. |
| `scripts/final-verify-*.js` (multiple) | Manual verification scripts for completed tasks | Likely obsolete if tasks are done. Delete After Validation. |
| `scripts/verify-*.js` (multiple) | Verification scripts | Same pattern — verify completion, then delete |

### Scripts Tied to Legacy Implementations

The following scripts are tied to historical content operations and are **unlikely to be re-run**:

```
scripts/create-dress-code-guideline.js       → One-time guideline creation
scripts/create-wfh-guidelines.js             → WFH policy creation (superseded by recreate-* version)
scripts/delete-wfh-guideline.js              → Deletion was a one-time action
scripts/recreate-wfh-guideline.js            → Recreate was one-time
scripts/update-atp-stop-scans-title.js       → Title update is idempotent/one-time
scripts/update-avr-awards-title.js           → Same
scripts/update-hov-to-brainstorming.js       → One-time rename
scripts/find-and-remove-all-dark-images.js   → One-time image cleanup
scripts/fix-duplicate-images.js              → One-time deduplication
```

**Recommendation:** Create a `scripts/archive/` subfolder and move these before deletion. Confirm via `git log` that these were run as committed operations before removing them permanently.

---

## 9. Merge and Overwrite Risk Assessment

### 9.1 Safe to Overwrite

Files exclusively owned by the Media Marketplace feature with no shared usage risk.

| File | Reason Safe to Overwrite |
|------|--------------------------|
| `src/components/media-center/AnnouncementsGrid.tsx` | Feature-owned, no other feature imports this |
| `src/components/media-center/BlogsGrid.tsx` | Feature-owned |
| `src/components/media-center/JobsGrid.tsx` | Feature-owned |
| `src/components/media-center/PodcastsGrid.tsx` | Feature-owned |
| `src/components/media-center/FiltersPanel.tsx` | Feature-owned |
| `src/components/media-center/Navigation.tsx` | Feature-owned |
| `src/components/media-center/Hero.tsx` | Feature-owned |
| `src/components/media-center/Footer.tsx` | Feature-owned |
| `src/components/media-center/Sidebar.tsx` | Feature-owned |
| `src/components/media-center/RelatedArticles.tsx` | Feature-owned |
| `src/components/media-center/TabContent.tsx` | Feature-owned |
| `src/components/media-center/cards/*.tsx` (all 4) | Feature-owned |
| `src/components/media-center/detail/*.tsx` (all 7) | Feature-owned |
| `src/pages/marketplace/NewsDetailPage.tsx` | Exclusively serves media-center detail route |
| `src/pages/marketplace/JobDetailPage.tsx` | Exclusively serves media jobs route |
| `src/pages/marketplace/JobApplicationPage.tsx` | Exclusively serves job application route |
| `src/pages/marketplace/PodcastSeriesPage.tsx` | Exclusively serves podcast route |
| `src/hooks/useArticleData.ts` | Media-specific hook |
| `src/hooks/useEngagementMetrics.ts` | Media-specific hook |
| `src/hooks/useMediaItem.ts` | Media-specific hook |
| `src/hooks/UseMediaSearch.ts` | Media-specific hook |

---

### 9.2 Risky to Overwrite

Files that serve the feature but are also shared or environment-sensitive.

| File | Risk Reason |
|------|-------------|
| `src/pages/marketplace/NewsPage.tsx` | Contains inline SECONDARY_FACETS tab config — if the merging branch has different tab structure, this will change behavior for all tabs, not just announcements |
| `src/services/mediaCenterService.ts` | Contains both Supabase integration AND fallback to `MOCK_NEWS`. If the incoming version removes the fallback, environments without Supabase will break. |
| `src/components/media-center/types.ts` | Type definitions shared across all media-center components — changing types here causes TypeScript errors in all dependent files simultaneously |
| `src/data/media/news.ts` | Large mock data file used as fallback. If the merge removes entries or changes the data shape, it silently breaks the fallback behavior |
| `src/data/media/jobs.ts` | Same risk as news.ts |
| `src/utils/mediaTracking.ts` | LocalStorage key names may differ between branches. Mismatched keys cause seen-items tracking to silently reset for users |
| `src/pages/marketplace/MarketplaceRouter.tsx` | **Highest risk** — any overwrite of this file affects all 30+ marketplace routes. Even a small merge conflict here can take down unrelated features |

---

### 9.3 Must Preserve or Manually Diff

Files that must **never be blindly replaced** and require careful manual comparison.

| File | Why Preserve / Manually Diff |
|------|------------------------------|
| `src/AppRouter.tsx` | Root router for the entire application. Contains Apollo provider, MSAL auth guard, DWSChatProvider, and all top-level route registrations. A blind overwrite could break authentication, chat, or all routes. |
| `src/main.tsx` | App bootstrap — MSAL config, Apollo endpoint URL, React Query setup. Environment-specific settings here may differ between branches. |
| `src/App.tsx` | Non-marketplace routes (home, signin, onboarding, etc.). Overwriting could remove routes that are still active but not part of the media feature. |
| `src/components/Header/context/AuthContext.tsx` | Auth provider — any change here affects all authenticated flows across the entire app |
| `.env` | Never commit or overwrite environment files. Each environment (dev, staging, prod) has its own values. |
| `tsconfig.json` | TypeScript config with `@/` path alias — changing this breaks ALL absolute imports |
| `vite.config.ts` | Build config — changing port, alias, or proxy settings affects dev server and build output |
| `package.json` | Dependency manifest — merging package.json requires careful resolution of version conflicts |
| `supabase/seed-news-announcements.sql` | If the incoming branch has a different data shape, running this seed on a DB that already has data could cause schema conflicts or duplicate entries |
| `supabase/seed-news-blogs.sql` | Same concern |

---

## 10. Safe Cleanup Plan

### Phase 1: Audit Confirmation

**Objective:** Validate file classifications before any changes.

- [ ] **Grep check for `src/pages/media/` and `src/pages/media-center/`**: Run `grep -r "pages/media" src/` and `grep -r "media-center" src/App.tsx src/AppRouter.tsx` to confirm whether these legacy page folders are registered in any active route. If they are not, classify as safe to remove.
- [ ] **Verify `src/data/testSupabaseConnection.ts` imports**: Run `grep -r "testSupabaseConnection" src/` — if no results, classify as safe to delete.
- [ ] **Verify `src/utils/mediaTracking.ts` usage**: Confirm which components call `getSeenMediaItems()`. If only `NewsPage.tsx`, this is media-feature-owned and safe to overwrite.
- [ ] **Flag `MarketplaceRouter.tsx`** as the highest-risk file for any merge — review route diff manually before accepting any changes.
- [ ] **Confirm lazy-loading status of NewsPage.tsx**: Check if `MarketplaceRouter.tsx` imports `NewsPage` lazily or eagerly.
- [ ] **Confirm `src/components/ui/media-center-button.tsx`** is only used within media-center components — if so, reclassify as Core Feature File.
- [ ] **Review scripts folder**: Cross-reference each script against `package.json` scripts section and GitHub Actions workflows. Mark any script not referenced as a deletion candidate.

### Phase 2: Prepare Clean File Set

**Objective:** Build the verified clean version of Media Marketplace files.

- [ ] Create a branch: `feature/media-marketplace-clean`
- [ ] Copy **only confirmed Core Feature Files** into the new branch (see Section 11)
- [ ] Do NOT copy `MarketplaceRouter.tsx` — instead, isolate only the media-center route lines for review
- [ ] Do NOT copy `AppRouter.tsx`, `main.tsx`, `App.tsx` — these must come from the target branch
- [ ] Copy `supabase/seed-news-*.sql` files — these are safe and feature-specific
- [ ] Exclude all Python debug files (`count_braces*.py`)
- [ ] Exclude the 127 scripts unless they have been explicitly validated as still-needed

### Phase 3: Controlled Merge / Selective Overwrite

**Objective:** Apply clean files to the target branch with surgical precision.

- [ ] **Do NOT** use `git checkout feature/news-marketplace -- src/` (directory-level copy) — this blindly replaces all files
- [ ] Instead, overwrite **only the files listed in Section 11** using `git checkout [branch] -- [file]` per individual file
- [ ] For `MarketplaceRouter.tsx`: Do a manual diff. Copy only the media-center route additions/changes. Do not touch other route definitions.
- [ ] For `mediaCenterService.ts`: Do a manual diff. Preserve the fallback pattern unless Supabase is confirmed stable in the target environment.
- [ ] For `src/data/media/news.ts`: Do not overwrite unless you are certain the data shape is identical or you intend to change it.
- [ ] After applying files, run `npm run build` immediately to catch TypeScript errors before testing.

### Phase 4: Validation Checklist

Run these checks after the merge/overwrite:

**Build & Type Safety**
- [ ] `npm install` — completes without errors
- [ ] `npm run build` — no TypeScript errors, no module resolution failures
- [ ] `npm run lint` — no new ESLint errors introduced
- [ ] `npx tsc --noEmit` — clean type check

**Route Resolution**
- [ ] Navigate to `http://localhost:3004/marketplace/media-center` — page renders
- [ ] Navigate with `?tab=announcements` — announcements tab activates
- [ ] Navigate with `?tab=insights` — blogs tab activates
- [ ] Navigate with `?tab=podcasts` — podcasts tab activates
- [ ] Navigate with `?tab=opportunities` — jobs tab activates
- [ ] Click an announcement card → detail page loads
- [ ] Click a job card → job detail loads
- [ ] Click Apply on a job → application form renders

**API & Data Integration**
- [ ] Announcements load from Supabase (check network tab)
- [ ] Fallback to MOCK_NEWS works when Supabase is offline
- [ ] Engagement metrics display on article detail
- [ ] Seen-item tracking updates on revisit (localStorage key persists)

**Other Marketplace Routes (Regression Check)**
- [ ] `/marketplace/courses` — still loads
- [ ] `/marketplace/guides` — still loads
- [ ] `/marketplace/financial` — still loads
- [ ] `/marketplace/services-center` — still loads
- [ ] `/marketplace/design-system` — still loads

**Shared Infrastructure**
- [ ] Header renders with user profile
- [ ] Authentication guard works (protected routes redirect unauthenticated users)
- [ ] DWSChat widget is visible
- [ ] Footer renders

**Import / Asset Check**
- [ ] No 404 errors in console for assets
- [ ] `/job openings.jpg` exists in `public/` folder
- [ ] lucide-react icons render correctly
- [ ] Tailwind classes are applied (no raw class names visible)

**CI/Test Check**
- [ ] `tests/guides.spec.ts` still passes
- [ ] No new test failures introduced

### Phase 5: Final Prune

Execute this phase ONLY after Phase 4 passes completely.

- [ ] Delete `count_braces_mp.py`, `count_braces.py`, `count_braces_lines.py` from project root
- [ ] Move one-time migration scripts to `scripts/archive/` (do not delete without archiving)
- [ ] Delete `src/data/testSupabaseConnection.ts` if Phase 1 confirmed zero imports
- [ ] Review and decide on `src/pages/media/` and `src/pages/media-center/` folder contents after Phase 1 route grep
- [ ] If `data/guides.sqlite` is confirmed unused in active dev workflow, delete it
- [ ] Update `MEMORY.md` and project documentation to reflect the cleaned state

---

## 11. Final Minimal File Set

### Core Feature Files (Media Marketplace owns these)

```
src/pages/marketplace/NewsPage.tsx
src/pages/marketplace/NewsDetailPage.tsx
src/pages/marketplace/JobDetailPage.tsx
src/pages/marketplace/JobApplicationPage.tsx
src/pages/marketplace/PodcastSeriesPage.tsx

src/components/media-center/AnnouncementsGrid.tsx
src/components/media-center/BlogsGrid.tsx
src/components/media-center/JobsGrid.tsx
src/components/media-center/PodcastsGrid.tsx
src/components/media-center/FiltersPanel.tsx
src/components/media-center/Navigation.tsx
src/components/media-center/Hero.tsx
src/components/media-center/Footer.tsx
src/components/media-center/Sidebar.tsx
src/components/media-center/RelatedArticles.tsx
src/components/media-center/TabContent.tsx
src/components/media-center/types.ts

src/components/media-center/cards/NewsCard.tsx
src/components/media-center/cards/BlogCard.tsx
src/components/media-center/cards/JobCard.tsx
src/components/media-center/cards/PodcastSeriesCard.tsx

src/components/media-center/detail/HeroSection.tsx
src/components/media-center/detail/ArticleContent.tsx
src/components/media-center/detail/ArticleSummary.tsx
src/components/media-center/detail/ErrorState.tsx
src/components/media-center/detail/EngagementMetrics.tsx
src/components/media-center/detail/buildOverview.ts
src/components/media-center/detail/contentHelpers.ts

src/services/mediaCenterService.ts

src/hooks/useArticleData.ts
src/hooks/useEngagementMetrics.ts
src/hooks/useMediaItem.ts
src/hooks/UseMediaSearch.ts

src/data/media/news.ts
src/data/media/jobs.ts
```

**Total Core Feature Files: 35**

---

### Required Shared Files (Media Marketplace depends on these)

```
src/pages/marketplace/MarketplaceRouter.tsx      ← Route registration (shared)
src/AppRouter.tsx                                ← Root router (shared)
src/main.tsx                                     ← Bootstrap (shared)
src/App.tsx                                      ← Non-marketplace routes (shared)

src/components/Header/index.tsx                  ← Layout
src/components/Header/Header.tsx                 ← Layout
src/components/Header/ProfileDropdown.tsx        ← Layout
src/components/Header/context/AuthContext.tsx    ← Auth

src/components/Footer/index.tsx                  ← Layout
src/components/Footer/Footer.tsx                 ← Layout

src/components/ui/tabs.tsx                       ← UI library
src/components/ui/button.tsx                     ← UI library
src/components/ui/card.tsx                       ← UI library
src/components/ui/badge.tsx                      ← UI library
src/components/ui/input.tsx                      ← UI library
src/components/ui/breadcrumb.tsx                 ← UI library
src/components/ui/media-center-button.tsx        ← UI (needs validation)

src/utils/analytics.ts                           ← Tracking
src/utils/mediaTracking.ts                       ← Seen-items tracking
src/utils/marketplaceConfig.ts                   ← Marketplace config
src/types/marketplace.ts                         ← Type definitions
```

**Total Required Shared Files: ~21**

---

### Required Integration Files

```
src/services/graphql/client.ts                   ← Apollo client
src/services/graphql/queries.ts                  ← GraphQL queries
src/services/marketplace.ts                      ← Marketplace data service (partially required)
src/lib/supabaseClient.ts (or equivalent)        ← Supabase singleton
src/components/ProtectedRoute.tsx                ← Auth guard
src/components/DWSChatProvider.tsx               ← App-wide chat provider
```

---

### Required Config / Environment Touchpoints

```
package.json                                     ← Dependencies
tsconfig.json                                    ← TypeScript config (@ alias)
vite.config.ts                                   ← Build config
.env                                             ← Environment variables (SUPABASE_URL, keys)
.env.example                                     ← Template (safe to version)
```

---

### Seed / Data Infrastructure (Required for Dev/Staging)

```
supabase/seed-news-announcements.sql             ← News seed data
supabase/seed-news-blogs.sql                     ← Blog seed data
scripts/seed-media-data.sh                       ← Seed runner
scripts/verify-media-tables.js                   ← DB schema verification
```

---

## 12. Final Recommendations

### Is Cleanup Safe?

**Yes, with surgical precision.** The Media Marketplace has a clean component boundary in `src/components/media-center/`. The primary risk is the shared routing file (`MarketplaceRouter.tsx`) and the large mock data file (`news.ts`). Neither should be replaced blindly.

### What Should Be Done First

1. **Validate route registrations** for `src/pages/media/` and `src/pages/media-center/` — if these are unused, they are the cleanest deletion opportunity.
2. **Delete the Python debug files** immediately — zero risk, no dependencies.
3. **Lock `MarketplaceRouter.tsx` for manual diff** — put it on the "must not blindly overwrite" list before any merge begins.
4. **Confirm Supabase stability** before removing `MOCK_NEWS` fallback from `mediaCenterService.ts`.

### Biggest Risk Areas

| Risk | Severity | Mitigation |
|------|----------|------------|
| Overwriting `MarketplaceRouter.tsx` without diffing | Critical | Always diff this file manually. Never use directory-level git checkout on it. |
| Removing `MOCK_NEWS` fallback before Supabase is confirmed stable | High | Keep `src/data/media/news.ts` and the fallback logic in `mediaCenterService.ts` until production is confirmed stable |
| Mass-deleting scripts without checking `package.json` references | Medium | Cross-reference `package.json` scripts section before any script deletion |
| Overwriting `AppRouter.tsx` blindly in a merge | Critical | This file must be manually merged — it touches authentication, providers, and all top-level routing |
| Duplicate pages in `src/pages/media/` vs `src/pages/marketplace/` | Medium | Grep all imports and route registrations before deleting either folder |

### Safest Merge Strategy

1. **Branch from `main`** — do not overwrite `main` directly.
2. **Use individual file-level cherry-pick** — `git checkout [source-branch] -- [exact-file-path]` for each confirmed Core Feature File.
3. **Manually merge the shared files** — `MarketplaceRouter.tsx`, `AppRouter.tsx`, `mediaCenterService.ts` require manual diff.
4. **Run `npm run build` after every batch of overwrites** — catch errors early, not at the end.
5. **Keep the fallback data** (`src/data/media/news.ts`) until a production Supabase run confirms all data is present.
6. **Archive scripts, do not delete** — move to `scripts/archive/` to preserve history without cluttering the active scripts folder.

---

## Safe Execution Recommendation

### Current Project Status

Based on this audit, the project is in the following state for the Media Marketplace feature:

- The feature component tree is **cleanly isolated** in `src/components/media-center/`
- The pages are **clearly identified** in `src/pages/marketplace/`
- The services and hooks are **unambiguously media-specific**
- **Two risk zones exist**: shared routing (`MarketplaceRouter.tsx`) and shared app infrastructure (`AppRouter.tsx`, `main.tsx`)
- **Legacy page duplicates** (`src/pages/media/`, `src/pages/media-center/`) are **unresolved** and require manual route validation before any cleanup proceeds

### Recommended Path

> **The project is ready for: Selective Overwrite Plus Manual Diff**

This means:

1. **The Core Feature Files** (35 files in `src/components/media-center/`, `src/pages/marketplace/News*.tsx`, `Job*.tsx`, `Podcast*.tsx`, hooks, and data) **can be selectively overwritten** from the clean branch with low risk.

2. **The Shared Files** (`MarketplaceRouter.tsx`, `AppRouter.tsx`, `mediaCenterService.ts`, `types.ts`, seed SQL files) **must be manually diffed** before overwrite. Do not accept the incoming version wholesale.

3. **The infrastructure files** (`main.tsx`, `App.tsx`, `.env`, `package.json`, `tsconfig.json`, `vite.config.ts`) **must be preserved** from the target branch unless there is a specific, known, intentional change to apply.

4. **Do not proceed to any cleanup or deletion** until Phase 4 (Validation Checklist) in Section 10 has been fully completed and all checks pass.

5. **The Python debug files** (`count_braces*.py`) can be **deleted immediately** as they carry zero functional risk.

---

*Report generated: 2026-03-25*
*Auditor: Claude Code (Automated Structural Audit)*
*Branch: feature/news-marketplace*
*Working Directory: d:\DQ\DWS\News-Marketpalce-25-Mar\DQ-Intranet-DWS*
