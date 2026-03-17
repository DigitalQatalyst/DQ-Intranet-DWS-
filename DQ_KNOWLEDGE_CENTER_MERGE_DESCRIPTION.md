# Extended Merge Description: DQ Knowledge Center to stage00 Branch

## Overview

This merge operation transfers **only** the DQ Knowledge Center (Guides Marketplace) feature from the `feat/guides-marketplace` branch to the `stage00` branch. The DQ Knowledge Center is a comprehensive knowledge repository system that provides centralized access to organizational guides, guidelines, testimonials, glossary terms, FAQs, and 6xD perspectives.

**Primary Route**: `/marketplace/guides`  
**Alternative Routes**: `/guides` and `/knowledge-hub` (both redirect to `/marketplace/guides`)

---

## Complete File Inventory

### 1. Core Marketplace Component
**File**: `src/components/marketplace/MarketplacePage.tsx`
- **Purpose**: Main marketplace page component with guides-specific logic
- **Key Features**:
  - Multi-tab interface (Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs)
  - Advanced filtering system with URL-based state management
  - Full-text search functionality with "Search in DQ Knowledge Center" placeholder
  - Integration with GuidesFilters, GuidesGrid, TestimonialsGrid, GlossaryGrid, and SixXDPerspectiveCards
  - Responsive design with mobile support
  - Analytics tracking for user interactions

### 2. Routing Configuration

**File**: `src/pages/marketplace/MarketplaceRouter.tsx`
- **Purpose**: Defines all routes for the guides marketplace
- **Routes Included**:
  - `/marketplace/guides` - Main marketplace page
  - `/marketplace/guides/:itemId` - Individual guide detail pages
  - `/marketplace/guides/glossary` - Glossary browse page
  - `/marketplace/guides/glossary/:termId` - Glossary term detail pages
  - `/marketplace/guides/6xd-perspective/:perspectiveId` - 6xD perspective detail pages
  - `/marketplace/guides/faqs` - FAQs page
  - `/marketplace/guides/testimonials` - Testimonials page
- **Implementation**: Uses React.lazy for code splitting and performance optimization

**File**: `src/AppRouter.tsx` (Partial Merge Required)
- **Changes to Include**:
  - Line 79: `<Route path="/marketplace/*" element={<MarketplaceRouter />} />`
  - Lines 84-86: Redirect routes for `/guides` and `/knowledge-hub` to `/marketplace/guides`
  - Lines 81-83: Admin routes for guides CRUD operations (`/admin/guides`)
- **Note**: Only merge guides-related routes, exclude other marketplace routes if they exist

### 3. Guide Detail Pages (`src/pages/guides/`)

All files in this directory are required for the DQ Knowledge Center:

1. **`GuideDetailPage.tsx`**
   - Main detail page for individual guides
   - Displays guide content with markdown rendering
   - Shows metadata (author, last updated, download count)
   - Includes related guides section
   - Handles document attachments and templates
   - Displays step-by-step guide content

2. **`GlossaryPage.tsx`**
   - Glossary browse page with filtering capabilities
   - Two-level filtering system (GHC/6xD)
   - Category-based organization
   - Search functionality for glossary terms

3. **`GlossaryTermDetailPage.tsx`**
   - Individual glossary term detail pages
   - Full term definitions with examples
   - Related terms navigation
   - Category and domain information

4. **`SixXDPerspectiveDetailPage.tsx`**
   - 6xD perspective detail pages
   - Framework perspective explanations
   - Integration with glossary terms

5. **`FAQsPage.tsx`**
   - FAQs page wrapper component
   - Routes to FAQsPageContent

6. **`FAQsPageContent.tsx`**
   - FAQs content component
   - Displays frequently asked questions
   - Searchable and filterable FAQ list

7. **`TestimonialsDetailPage.tsx`**
   - Testimonials detail page
   - Client testimonials display
   - Filtering and search capabilities

8. **`6xDGlossaryPage.tsx`**
   - 6xD-specific glossary page
   - 6xD framework terminology

9. **`Agile6xDGlossaryPage.tsx`**
   - Agile 6xD glossary page
   - Agile-specific terminology

10. **`GHCGlossaryDetailPage.tsx`**
    - GHC glossary detail page
    - GHC-specific term details

11. **`GhcGlossaryPage.tsx`**
    - GHC glossary browse page

12. **`GlossaryBrowsePage.tsx`**
    - Standard glossary browse page
    - General glossary browsing interface

13. **`StandardizedGlossaryDetailPage.tsx`**
    - Standardized glossary term detail page
    - Standardized terminology display

14. **`GlossaryPageContent.tsx`**
    - Glossary page content component
    - Reusable glossary display logic

15. **Data Files**:
    - `glossaryData.ts` - Glossary terms data structure
    - `ghcTermsData.ts` - GHC terms data
    - `agile6xdGlossaryData.ts` - Agile 6xD glossary data
    - `glossaryFilters.ts` - Glossary filtering utilities

### 4. Guide Components (`src/components/guides/`)

All components in this directory are required:

1. **`GuidesGrid.tsx`**
   - Grid component for displaying guides in card layout
   - Responsive grid system
   - Loading states and error handling
   - Empty state messaging

2. **`GuidesFilters.tsx`**
   - Filter sidebar component for guides
   - Filter categories: Domain, Guide Type, Function Area, Status
   - Faceted search with result counts
   - URL-based filter state synchronization

3. **`GuideCard.tsx`**
   - Card component for individual guide items
   - Displays guide metadata, title, summary
   - Category badges and status indicators
   - Click navigation to detail page

4. **`TestimonialsGrid.tsx`**
   - Grid component for testimonials
   - Testimonial card layout
   - Client information display

5. **`GlossaryGrid.tsx`**
   - Grid component for glossary terms
   - Term card display with categories
   - Search and filter integration

6. **`SixXDPerspectiveCards.tsx`**
   - Cards component for 6xD perspectives
   - Perspective visualization
   - Navigation to detail pages

7. **`MarkdownRenderer.tsx`**
   - Markdown rendering component
   - Converts markdown content to HTML
   - Syntax highlighting support
   - Link and image handling

8. **`DocumentPreview.tsx`**
   - Document preview component
   - File attachment display
   - Download functionality

9. **`GlossaryDetailAccordion.tsx`**
   - Accordion component for glossary details
   - Expandable term definitions
   - Related terms display

### 5. API Routes (`api/guides/`)

All API endpoints in this directory are required:

1. **`api/guides/index.ts`**
   - Main API endpoint for searching and listing guides
   - **Query Parameters**:
     - `search`: Full-text search query
     - `domain`: Filter by domain (GHC, 6xD, Agile)
     - `guide_type`: Filter by guide type (Guidelines, Strategy, Blueprints)
     - `function_area`: Filter by function area
     - `status`: Filter by status (Approved, Draft)
     - `cursor`: Cursor for pagination
     - `limit`: Results per page
   - **Returns**: Guide list with facets for filtering UI
   - **Implementation**: Uses Supabase RPC function `rpc_guides_search` for cursor-based pagination

2. **`api/guides/[id].ts`**
   - API endpoint for fetching individual guide details
   - **Supports**: Fetching by UUID or slug
   - **Returns**: 
     - Guide body (markdown content)
     - Guide steps (step-by-step instructions)
     - Attachments (document files)
     - Templates (guide templates)
   - **Features**: ETag caching for performance optimization

3. **`api/guides/taxonomies.ts`**
   - API endpoint for fetching available filter options
   - **Returns**: Distinct values for:
     - Domain options
     - Guide type options
     - Function area options
     - Status options
   - **Purpose**: Populates filter dropdowns in the UI

### 6. Configuration & Utilities

**File**: `src/utils/marketplaceConfig.ts` (Partial Merge Required)
- **Changes to Include**:
  - Lines 894-900: Guides marketplace configuration
    - `id: 'guides'`
    - `route: '/marketplace/guides'`
    - `title: 'DQ Knowledge Center'`
    - `description: 'Access practical guidelines, templates, and processes...'`
  - Tab definitions for Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs
  - Filter category configurations for guides
- **Note**: Only merge the `guides` configuration object, exclude other marketplace configs

**File**: `src/utils/guideImageMap.ts`
- **Purpose**: Mapping utility for guide images
- **Function**: Maps guide types/categories to appropriate image assets
- **Usage**: Used by GuideCard and GuidesGrid components

**File**: `src/utils/searchRouter.ts` (Partial Merge Required)
- **Changes to Include**:
  - Lines 90-91: Knowledge center search routing entry
    - `id: 'knowledge-center'`
    - `title: 'DQ Knowledge Center'`
  - Search query handling for guides/knowledge center
  - Search result routing to `/marketplace/guides`
- **Note**: Only merge knowledge-center related sections

### 7. Supporting Marketplace Components

**File**: `src/components/marketplace/KnowledgeHubCard.tsx`
- Card component for knowledge hub items
- Used in knowledge hub grid displays

**File**: `src/components/marketplace/KnowledgeHubGrid.tsx`
- Grid component for knowledge hub
- Layout for knowledge hub items

**File**: `src/components/marketplace/FilterSidebar.tsx`
- Reusable filter sidebar component
- Used by guides marketplace for filtering
- Generic filter configuration system

### 8. Header/Navigation Integration

**File**: `src/components/Header/components/ExploreDropdown.tsx` (Partial Merge Required)
- **Changes to Include**:
  - Lines 72-73: Knowledge center entry in explore dropdown
    - `id: 'knowledge-center'`
    - `name: 'DQ Knowledge Center'`
    - Link to `/marketplace/guides`
- **Note**: Only merge the knowledge-center menu entry

**File**: `src/components/Header/components/MobileDrawer.tsx` (Partial Merge Required)
- **Changes to Include**:
  - Lines 78-79: Mobile navigation knowledge center link
    - `id: 'knowledge-center'`
    - `name: 'DQ Knowledge Center'`
    - Link to `/marketplace/guides`
- **Note**: Only merge the knowledge-center mobile menu entry

### 9. Integration Points

**File**: `src/pages/DiscoverDQ.tsx` (Partial Merge Required)
- **Changes to Include**:
  - Line 248: `handleExploreKnowledgeCenter` function
    - Navigation handler to knowledge center
    - Called from DNA section CTA buttons
  - Line 377: `onExploreKnowledgeCenter={handleExploreKnowledgeCenter}` prop
- **Note**: Only merge knowledge center related functions, exclude other changes

**File**: `src/components/map/LocationModal.tsx` (Partial Merge Required)
- **Changes to Include**:
  - Line 285: "Visit Knowledge Center" button
    - Button label: "Visit Knowledge Center"
    - Links to location-specific knowledge centers
    - Example: `/knowledge-center/adib`, `/knowledge-center/saib`, `/knowledge-center/neom`
- **Note**: Only merge the knowledge center button, exclude other location modal changes

**File**: `src/components/Discover/Discover_DNASection.tsx` (Partial Merge Required)
- **Changes to Include**:
  - Knowledge center CTA buttons for each DNA dimension:
    - Line 97: "Explore Vision in Knowledge Center" → `/knowledge-center/vision`
    - Line 111: "Explore Culture in Knowledge Center" → `/knowledge-center/culture`
    - Line 125: "Explore Personas in Knowledge Center" → `/knowledge-center/personas`
    - Line 139: "Explore TMS in Knowledge Center" → `/knowledge-center/tms`
    - Line 153: "Explore Governance in Knowledge Center" → `/knowledge-center/governance`
    - Line 167: "Explore Value Streams in Knowledge Center" → `/knowledge-center/value-streams`
    - Line 181: "Explore Products in Knowledge Center" → `/knowledge-center/products`
- **Note**: Only merge knowledge center CTA buttons, exclude other DNA section changes

---

## Features Implemented

### 1. Multi-Tab Interface
- **Guidelines Tab**: Displays operational guidelines with filtering
- **Strategy Tab**: Displays strategic guides and frameworks
- **Blueprints Tab**: Displays blueprint guides and templates
- **Testimonials Tab**: Displays client testimonials with search
- **Glossary Tab**: Displays glossary terms with two-level filtering (GHC/6xD)
- **FAQs Tab**: Displays frequently asked questions with search

### 2. Advanced Filtering System
- **Filter Categories**:
  - Domain (GHC, 6xD, Agile)
  - Guide Type (Guidelines, Strategy, Blueprints)
  - Function Area
  - Status (Approved, Draft)
- **Features**:
  - URL-based filter state management
  - Faceted search with result counts
  - Multiple filter combination support
  - Clear filters functionality

### 3. Search Functionality
- Full-text search across guide titles and summaries
- Search bar with placeholder "Search in DQ Knowledge Center"
- Search results integrated with active filters
- Analytics tracking for search queries
- Search highlighting in results

### 4. Guide Detail Pages
- Rich content display with markdown rendering
- Guide metadata display (author, last updated, download count)
- Related guides section with recommendations
- Document attachments with download functionality
- Step-by-step guide content with navigation
- Template downloads

### 5. Glossary Features
- Two-level filtering system (GHC/6xD categories)
- Category-based organization
- Term detail pages with full definitions
- Related terms navigation
- Search functionality within glossary
- Multiple glossary types (Standard, GHC, 6xD, Agile)

### 6. 6xD Perspectives
- Dedicated cards for 6xD framework perspectives
- Detail pages for each perspective
- Integration with glossary terms
- Framework visualization

### 7. Testimonials
- Grid display of client testimonials
- Filtering and search capabilities
- Detail pages for individual testimonials

### 8. FAQs
- Searchable FAQ list
- Category organization
- Expandable question/answer format

---

## Database Dependencies

### Required Tables
- `guides` - Main guides table with columns:
  - `id` (UUID, primary key)
  - `title` (text)
  - `summary` (text)
  - `body` (text, markdown content)
  - `slug` (text, unique)
  - `domain` (text)
  - `guide_type` (text)
  - `function_area` (text)
  - `status` (text)
  - `author` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- `guide_steps` - Step-by-step content for guides
  - `id` (UUID, primary key)
  - `guide_id` (UUID, foreign key to guides)
  - `step_number` (integer)
  - `title` (text)
  - `content` (text, markdown)

- `guide_attachments` - Attachments for guides
  - `id` (UUID, primary key)
  - `guide_id` (UUID, foreign key to guides)
  - `filename` (text)
  - `file_url` (text)
  - `file_type` (text)

- `guide_templates` - Templates for guides
  - `id` (UUID, primary key)
  - `guide_id` (UUID, foreign key to guides)
  - `template_name` (text)
  - `template_url` (text)

### Required Functions
- `rpc_guides_search` - RPC function for searching guides
  - Implements cursor-based pagination
  - Supports full-text search
  - Returns facets for filtering UI
  - Parameters: search query, filters, cursor, limit

### Required Policies
- Row Level Security (RLS) policies for:
  - `guides` table (SELECT access)
  - `guide_steps` table (SELECT access)
  - `guide_attachments` table (SELECT access)
  - `guide_templates` table (SELECT access)

---

## Git Merge Commands

### Step 1: Switch to stage00 Branch
```bash
git checkout stage00
git pull origin stage00  # Ensure you have latest changes
```

### Step 2: Create Merge Branch
```bash
git checkout -b merge/dq-knowledge-center-to-stage00
```

### Step 3: Checkout Complete Files from feat/guides-marketplace
```bash
# Core marketplace component
git checkout feat/guides-marketplace -- src/components/marketplace/MarketplacePage.tsx

# Routing
git checkout feat/guides-marketplace -- src/pages/marketplace/MarketplaceRouter.tsx

# All guide pages
git checkout feat/guides-marketplace -- src/pages/guides/

# All guide components
git checkout feat/guides-marketplace -- src/components/guides/

# API routes
git checkout feat/guides-marketplace -- api/guides/

# Utilities
git checkout feat/guides-marketplace -- src/utils/guideImageMap.ts

# Supporting components
git checkout feat/guides-marketplace -- src/components/marketplace/KnowledgeHubCard.tsx
git checkout feat/guides-marketplace -- src/components/marketplace/KnowledgeHubGrid.tsx
git checkout feat/guides-marketplace -- src/components/marketplace/FilterSidebar.tsx
```

### Step 4: Handle Partial File Merges

For files that need partial merging, you'll need to manually edit them:

#### A. `src/AppRouter.tsx`
- Checkout the file temporarily
- Manually copy only the guides-related routes:
  - `<Route path="/marketplace/*" element={<MarketplaceRouter />} />`
  - Redirect routes: `/guides` → `/marketplace/guides` and `/knowledge-hub` → `/marketplace/guides`
  - Admin routes: `/admin/guides/*`

#### B. `src/utils/marketplaceConfig.ts`
- Checkout the file temporarily
- Manually copy only the `guides` configuration object (lines 894-900)
- Ensure the guides config includes all tab definitions and filter categories

#### C. `src/utils/searchRouter.ts`
- Checkout the file temporarily
- Manually copy only the knowledge-center search routing entry (lines 90-91 and related search handling)

#### D. `src/components/Header/components/ExploreDropdown.tsx`
- Checkout the file temporarily
- Manually copy only the knowledge-center menu entry (lines 72-73)

#### E. `src/components/Header/components/MobileDrawer.tsx`
- Checkout the file temporarily
- Manually copy only the knowledge-center mobile menu entry (lines 78-79)

#### F. `src/pages/DiscoverDQ.tsx`
- Checkout the file temporarily
- Manually copy only the `handleExploreKnowledgeCenter` function and its usage

#### G. `src/components/map/LocationModal.tsx`
- Checkout the file temporarily
- Manually copy only the "Visit Knowledge Center" button

#### H. `src/components/Discover/Discover_DNASection.tsx`
- Checkout the file temporarily
- Manually copy only the knowledge center CTA buttons for each DNA dimension

### Step 5: Review Changes
```bash
git status
git diff --cached
```

### Step 6: Commit the Merge
```bash
git add .
git commit -m "feat: Add DQ Knowledge Center (Guides Marketplace) to stage00

- Added complete DQ Knowledge Center feature with multi-tab interface
- Implemented guides marketplace with filtering and search
- Added guide detail pages, glossary, FAQs, and testimonials
- Integrated with navigation (header dropdown, mobile menu)
- Added API routes for guides CRUD operations
- Integrated with Discover DQ page and location modals
- Routes: /marketplace/guides (with /guides and /knowledge-hub redirects)"
```

### Step 7: Test and Verify
- Run the application and test all routes
- Verify filtering and search functionality
- Check navigation links from various entry points
- Test responsive design on mobile devices

---

## Testing Checklist

After merge, verify the following:

### Routes
- [ ] `/marketplace/guides` route loads correctly
- [ ] `/guides` redirects to `/marketplace/guides`
- [ ] `/knowledge-hub` redirects to `/marketplace/guides`
- [ ] `/marketplace/guides/:itemId` loads guide detail pages
- [ ] `/marketplace/guides/glossary` loads glossary browse page
- [ ] `/marketplace/guides/glossary/:termId` loads glossary term details
- [ ] `/marketplace/guides/6xd-perspective/:perspectiveId` loads 6xD perspective pages
- [ ] `/marketplace/guides/faqs` loads FAQs page
- [ ] `/marketplace/guides/testimonials` loads testimonials page
- [ ] `/admin/guides` loads admin list page
- [ ] `/admin/guides/new` loads new guide editor
- [ ] `/admin/guides/:id` loads guide editor for existing guide

### Functionality
- [ ] All tabs display correctly (Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs)
- [ ] Filtering works on all tabs
- [ ] Search functionality works across all content types
- [ ] Guide detail pages display markdown content correctly
- [ ] Related guides section appears on detail pages
- [ ] Document attachments are downloadable
- [ ] Glossary filtering (GHC/6xD) works correctly
- [ ] 6xD perspective cards navigate to detail pages
- [ ] FAQs are searchable and filterable
- [ ] Testimonials grid displays correctly

### Integration Points
- [ ] Navigation link from header dropdown works
- [ ] Mobile navigation link works
- [ ] "Explore Knowledge Center" buttons from Discover DQ DNA section work
- [ ] "Visit Knowledge Center" buttons from location modals work
- [ ] Search router includes knowledge center in results

### API Endpoints
- [ ] `/api/guides` returns guide list with pagination
- [ ] `/api/guides/[id]` returns individual guide details
- [ ] `/api/guides/taxonomies` returns filter options
- [ ] API endpoints handle errors gracefully

### UI/UX
- [ ] No console errors
- [ ] Mobile responsiveness maintained
- [ ] Loading states display correctly
- [ ] Error states display user-friendly messages
- [ ] Empty states display helpful messages
- [ ] All images and assets load correctly

---

## Deployment Notes

### Environment Variables
Ensure the following environment variables are set:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for API routes)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (for client-side)

### Database Migrations
Before deploying, ensure:
1. Guides tables are created in the target database
2. RPC function `rpc_guides_search` is created
3. Row Level Security (RLS) policies are in place
4. All required indexes are created for performance

### Build Requirements
- No additional build steps required
- All dependencies should already be in `package.json`
- Verify TypeScript compilation succeeds: `npm run build`
- Verify no linting errors: `npm run lint`

### Performance Considerations
- API routes implement ETag caching for guide details
- Components use React.lazy for code splitting
- Images are optimized and lazy-loaded
- Search uses cursor-based pagination for large result sets

---

## Summary

This merge includes **only** the DQ Knowledge Center (Guides Marketplace) feature, which provides:

✅ A comprehensive knowledge repository interface  
✅ Multi-tab navigation (Guidelines, Strategy, Blueprints, Testimonials, Glossary, FAQs)  
✅ Advanced filtering and search capabilities  
✅ Individual guide detail pages with markdown rendering  
✅ Glossary and 6xD perspective features  
✅ Full API integration with Supabase  
✅ Responsive design and accessibility features  
✅ Integration with navigation, Discover DQ page, and location modals  

**All other features and changes from the `feat/guides-marketplace` branch are excluded from this merge.**

---

## Quick Reference: File List

### Complete Files to Merge
```
src/components/marketplace/MarketplacePage.tsx
src/pages/marketplace/MarketplaceRouter.tsx
src/pages/guides/ (all 17 files)
src/components/guides/ (all 9 files)
api/guides/ (all 3 files)
src/utils/guideImageMap.ts
src/components/marketplace/KnowledgeHubCard.tsx
src/components/marketplace/KnowledgeHubGrid.tsx
src/components/marketplace/FilterSidebar.tsx
```

### Partial Merges Required (Manual Editing)
```
src/AppRouter.tsx (guides routes only)
src/utils/marketplaceConfig.ts (guides config only)
src/utils/searchRouter.ts (knowledge-center sections only)
src/components/Header/components/ExploreDropdown.tsx (knowledge-center entry only)
src/components/Header/components/MobileDrawer.tsx (knowledge-center entry only)
src/pages/DiscoverDQ.tsx (handleExploreKnowledgeCenter function only)
src/components/map/LocationModal.tsx (knowledge center button only)
src/components/Discover/Discover_DNASection.tsx (knowledge center CTA only)
```

---

## Support

If you encounter any issues during the merge:
1. Review the merge guide: `DQ_KNOWLEDGE_CENTER_MERGE_GUIDE.md`
2. Check for conflicts in partial merge files
3. Verify database schema matches requirements
4. Test API endpoints independently
5. Check browser console for errors

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-22  
**Branch**: feat/guides-marketplace → stage00

