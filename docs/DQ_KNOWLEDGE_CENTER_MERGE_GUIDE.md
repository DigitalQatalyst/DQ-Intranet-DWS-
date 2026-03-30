# DQ Knowledge Center - Complete Merge Guide to stage00 Branch

## Overview
This document provides a complete guide for merging **only** the DQ Knowledge Center (Guides Marketplace) feature from `feat/guides-marketplace` branch to `stage00` branch. The DQ Knowledge Center is a centralized knowledge repository that provides access to organizational guides, guidelines, testimonials, glossary terms, FAQs, and 6xD perspectives.

## Route Information
- **Primary Route**: `/marketplace/guides`
- **Alternative Routes**: 
  - `/guides` (redirects to `/marketplace/guides`)
  - `/knowledge-hub` (redirects to `/marketplace/guides`)
- **Detail Routes**: 
  - `/marketplace/guides/:itemId` - Individual guide detail pages
  - `/marketplace/guides/glossary` - Glossary browse page
  - `/marketplace/guides/glossary/:termId` - Glossary term detail pages
  - `/marketplace/guides/6xd-perspective/:perspectiveId` - 6xD perspective detail pages
  - `/marketplace/guides/faqs` - FAQs page
  - `/marketplace/guides/testimonials` - Testimonials page

---

## Complete File List to Merge

### 1. Main Marketplace Page
- **`src/components/marketplace/MarketplacePage.tsx`**
  - Main marketplace page component with guides-specific logic
  - Handles filtering, searching, and tab navigation for guides
  - Integrates GuidesFilters, GuidesGrid, TestimonialsGrid, GlossaryGrid, and SixXDPerspectiveCards components
  - Supports multiple tabs: Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs

### 2. Routing Configuration
- **`src/pages/marketplace/MarketplaceRouter.tsx`**
  - Defines all routes for the guides marketplace
  - Includes lazy-loaded route components for guide detail pages
  - Handles routing for glossary, FAQs, testimonials, and 6xD perspectives

- **`src/AppRouter.tsx`**
  - Main app router with redirects from `/guides` and `/knowledge-hub` to `/marketplace/guides`
  - Admin routes for guides CRUD operations
  - **Note**: Only merge guides-related routes, not other marketplace routes

### 3. Guide Pages (src/pages/guides/)
- **`GuideDetailPage.tsx`** - Main detail page for individual guides
- **`GlossaryPage.tsx`** - Glossary browse page with filtering
- **`GlossaryTermDetailPage.tsx`** - Individual glossary term detail pages
- **`SixXDPerspectiveDetailPage.tsx`** - 6xD perspective detail pages
- **`FAQsPage.tsx`** - FAQs page component
- **`FAQsPageContent.tsx`** - FAQs content component
- **`TestimonialsDetailPage.tsx`** - Testimonials detail page
- **`6xDGlossaryPage.tsx`** - 6xD glossary page
- **`Agile6xDGlossaryPage.tsx`** - Agile 6xD glossary page
- **`GHCGlossaryDetailPage.tsx`** - GHC glossary detail page
- **`GlossaryBrowsePage.tsx`** - Glossary browse page
- **`StandardizedGlossaryDetailPage.tsx`** - Standardized glossary detail page
- **`glossaryData.ts`** - Glossary terms data
- **`ghcTermsData.ts`** - GHC terms data
- **`glossaryFilters.ts`** - Glossary filtering utilities

### 4. Guide Components (src/components/guides/)
- **`GuidesGrid.tsx`** - Grid component for displaying guides
- **`GuidesFilters.tsx`** - Filter sidebar component for guides
- **`GuideCard.tsx`** - Card component for individual guide items
- **`TestimonialsGrid.tsx`** - Grid component for testimonials
- **`GlossaryGrid.tsx`** - Grid component for glossary terms
- **`SixXDPerspectiveCards.tsx`** - Cards component for 6xD perspectives
- **`MarkdownRenderer.tsx`** - Markdown rendering component
- **`DocumentPreview.tsx`** - Document preview component
- **`GlossaryDetailAccordion.tsx`** - Accordion component for glossary details

### 5. API Routes (api/guides/)
- **`api/guides/index.ts`**
  - Main API endpoint for searching and listing guides
  - Supports filtering by domain, guide_type, function_area, and status
  - Implements cursor-based pagination
  - Returns facets for filtering UI
  - Uses Supabase RPC function `rpc_guides_search`

- **`api/guides/[id].ts`**
  - API endpoint for fetching individual guide details
  - Supports fetching by UUID or slug
  - Includes guide body, steps, attachments, and templates
  - Implements ETag caching for performance

- **`api/guides/taxonomies.ts`**
  - API endpoint for fetching available filter options
  - Returns distinct values for domain, guide_type, function_area, and status

### 6. Configuration & Utilities
- **`src/utils/marketplaceConfig.ts`**
  - Marketplace configuration including guides/knowledge-hub config
  - Defines guides marketplace metadata, attributes, tabs, and filter categories
  - Configuration for "DQ Knowledge Center" title and description
  - **Note**: Only merge guides/knowledge-hub config sections

- **`src/utils/guideImageMap.ts`**
  - Mapping utility for guide images

- **`src/utils/searchRouter.ts`**
  - Includes knowledge center in search routing
  - Handles search queries for guides/knowledge center
  - **Note**: Only merge knowledge-center related sections

### 7. Supporting Components
- **`src/components/marketplace/KnowledgeHubCard.tsx`** - Card component for knowledge hub items
- **`src/components/marketplace/KnowledgeHubGrid.tsx`** - Grid component for knowledge hub
- **`src/components/marketplace/FilterSidebar.tsx`** - Reusable filter sidebar (used by guides)

### 8. Header/Navigation Integration
- **`src/components/Header/components/ExploreDropdown.tsx`**
  - Includes "DQ Knowledge Center" in the explore dropdown menu
  - Links to `/marketplace/guides`
  - **Note**: Only merge knowledge-center entry

- **`src/components/Header/components/MobileDrawer.tsx`**
  - Mobile navigation includes "DQ Knowledge Center" link
  - **Note**: Only merge knowledge-center entry

### 9. Integration Points
- **`src/pages/DiscoverDQ.tsx`**
  - Links to Knowledge Center from DNA section
  - `handleExploreKnowledgeCenter` function
  - **Note**: Only merge knowledge center related functions

- **`src/components/map/LocationModal.tsx`**
  - "Visit Knowledge Center" button in location modals
  - Links to location-specific knowledge centers
  - **Note**: Only merge knowledge center button

- **`src/components/Discover/Discover_DNASection.tsx`**
  - Knowledge center CTA button
  - **Note**: Only merge knowledge center CTA

---

## Files to EXCLUDE from Merge

The following files should **NOT** be included in this merge as they are not part of the DQ Knowledge Center feature:

### Guidelines Detail Pages (Not part of marketplace)
- All files in `src/pages/guidelines/` directory (these are separate guideline detail pages, not part of the marketplace)

### Scripts (Development tools)
- All files in `scripts/` directory (development/maintenance scripts)

### Documentation
- `docs/guides/` directory (setup documentation, not runtime code)
- Other documentation files

### Other Marketplace Types
- Courses marketplace files
- Financial services marketplace files
- Non-financial services marketplace files
- News marketplace pages

### Other Features
- Communities features
- Work Directory features
- LMS/Courses features
- Products features (unless specifically related to knowledge center)

---

## Key Features Implemented

### 1. Multi-Tab Interface
- **Guidelines Tab**: Displays operational guidelines
- **Strategy Tab**: Displays strategic guides
- **Blueprints Tab**: Displays blueprint guides
- **Testimonials Tab**: Displays client testimonials
- **Glossary Tab**: Displays glossary terms with filtering
- **FAQs Tab**: Displays frequently asked questions

### 2. Advanced Filtering
- Filter by Domain (e.g., GHC, 6xD, Agile)
- Filter by Guide Type (e.g., Guidelines, Strategy, Blueprints)
- Filter by Function Area
- Filter by Status (e.g., Approved, Draft)
- URL-based filter state management
- Faceted search with counts

### 3. Search Functionality
- Full-text search across guide titles and summaries
- Search bar with placeholder "Search in DQ Knowledge Center"
- Search results integrated with filters
- Analytics tracking for search queries

### 4. Guide Detail Pages
- Rich content display with markdown rendering
- Guide metadata (author, last updated, download count)
- Related guides section
- Document attachments and templates
- Step-by-step guide content

### 5. Glossary Features
- Two-level filtering system (GHC/6xD)
- Category-based organization
- Term detail pages with full definitions
- Related terms navigation

### 6. 6xD Perspectives
- Dedicated cards for 6xD framework perspectives
- Detail pages for each perspective
- Integration with glossary

---

## Database Dependencies

### Required Tables
- `guides` - Main guides table
- `guide_steps` - Step-by-step content for guides
- `guide_attachments` - Attachments for guides
- `guide_templates` - Templates for guides

### Required Functions
- `rpc_guides_search` - RPC function for searching guides with cursor-based pagination

---

## Git Commands for Selective Merge

### Option 1: Checkout Specific Files (Recommended)

```bash
# Switch to stage00 branch
git checkout stage00

# Create a new branch for the merge
git checkout -b merge/dq-knowledge-center

# Checkout all guide-related files from feat/guides-marketplace branch
git checkout feat/guides-marketplace -- src/components/marketplace/MarketplacePage.tsx
git checkout feat/guides-marketplace -- src/pages/marketplace/MarketplaceRouter.tsx
git checkout feat/guides-marketplace -- api/guides/
git checkout feat/guides-marketplace -- src/pages/guides/
git checkout feat/guides-marketplace -- src/components/guides/
git checkout feat/guides-marketplace -- src/utils/guideImageMap.ts
git checkout feat/guides-marketplace -- src/components/marketplace/KnowledgeHubCard.tsx
git checkout feat/guides-marketplace -- src/components/marketplace/KnowledgeHubGrid.tsx
git checkout feat/guides-marketplace -- src/components/marketplace/FilterSidebar.tsx

# For partial file merges (requires manual editing):
# - src/AppRouter.tsx (only guides routes)
# - src/utils/marketplaceConfig.ts (only guides config)
# - src/utils/searchRouter.ts (only knowledge-center sections)
# - src/components/Header/components/ExploreDropdown.tsx (only knowledge-center entry)
# - src/components/Header/components/MobileDrawer.tsx (only knowledge-center entry)
# - src/pages/DiscoverDQ.tsx (only handleExploreKnowledgeCenter function)
# - src/components/map/LocationModal.tsx (only knowledge center button)
# - src/components/Discover/Discover_DNASection.tsx (only knowledge center CTA)

# Review changes
git status
git diff --cached

# Commit the merge
git add .
git commit -m "feat: Add DQ Knowledge Center (Guides Marketplace) to stage00"
```

### Option 2: Manual File Comparison

For files that need partial merging (like AppRouter.tsx), use:

```bash
# Checkout the file temporarily
git checkout feat/guides-marketplace -- src/AppRouter.tsx

# Manually edit to include only guides-related routes
# Then commit
```

---

## Testing Checklist

After merge, verify:

- [ ] `/marketplace/guides` route works
- [ ] All tabs display correctly (Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs)
- [ ] Filtering works on all tabs
- [ ] Search functionality works
- [ ] Guide detail pages load correctly (`/marketplace/guides/:itemId`)
- [ ] Glossary browse page works (`/marketplace/guides/glossary`)
- [ ] Glossary term detail pages work (`/marketplace/guides/glossary/:termId`)
- [ ] 6xD perspective pages work (`/marketplace/guides/6xd-perspective/:perspectiveId`)
- [ ] FAQs page works (`/marketplace/guides/faqs`)
- [ ] Testimonials page works (`/marketplace/guides/testimonials`)
- [ ] API endpoints return correct data (`/api/guides`, `/api/guides/[id]`, `/api/guides/taxonomies`)
- [ ] Navigation links from Discover DQ page work
- [ ] Navigation links from header dropdown work
- [ ] Location modal knowledge center buttons work
- [ ] No console errors
- [ ] Mobile responsiveness maintained
- [ ] Redirects work (`/guides` → `/marketplace/guides`, `/knowledge-hub` → `/marketplace/guides`)

---

## Deployment Notes

### Environment Variables
- Ensure Supabase connection is configured
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

### Database Migrations
- Ensure guides tables and RPC functions are created in the target database
- Verify Row Level Security (RLS) policies are in place
- Run any required migrations for guides schema

### Build Requirements
- No additional build steps required
- All dependencies should already be in package.json
- Verify TypeScript compilation succeeds

---

## Summary

This merge includes **only** the DQ Knowledge Center (Guides Marketplace) feature, which provides:
- A comprehensive knowledge repository interface
- Multi-tab navigation (Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs)
- Advanced filtering and search capabilities
- Individual guide detail pages
- Glossary and 6xD perspective features
- Full API integration with Supabase
- Responsive design and accessibility features

**All other features and changes from the `feat/guides-marketplace` branch are excluded from this merge.**

---

## Quick Reference: All Files to Merge

```
src/components/marketplace/MarketplacePage.tsx
src/pages/marketplace/MarketplaceRouter.tsx
src/pages/guides/ (all files)
src/components/guides/ (all files)
api/guides/ (all files)
src/utils/guideImageMap.ts
src/components/marketplace/KnowledgeHubCard.tsx
src/components/marketplace/KnowledgeHubGrid.tsx
src/components/marketplace/FilterSidebar.tsx

Partial merges required:
- src/AppRouter.tsx (guides routes only)
- src/utils/marketplaceConfig.ts (guides config only)
- src/utils/searchRouter.ts (knowledge-center sections only)
- src/components/Header/components/ExploreDropdown.tsx (knowledge-center entry only)
- src/components/Header/components/MobileDrawer.tsx (knowledge-center entry only)
- src/pages/DiscoverDQ.tsx (handleExploreKnowledgeCenter function only)
- src/components/map/LocationModal.tsx (knowledge center button only)
- src/components/Discover/Discover_DNASection.tsx (knowledge center CTA only)
```

