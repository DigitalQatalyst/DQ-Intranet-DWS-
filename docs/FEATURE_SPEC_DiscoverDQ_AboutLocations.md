# ONBOARDING PROMPT — DISCOVER DQ | ABOUT & LOCATIONS MODULE

## SUMMARY CONTEXT

- **Feature**: A unified "About & Locations" module that sits at the top of `/discover-dq` page, combining Hero, About DQ content, and interactive locations map.
- **Location**: Lives as the first section on `/discover-dq` route (before Vision & Mission, DNA, Directory, etc.).
- **Purpose**: Users quickly understand who DQ is, see where DQ operates (DXB, NBO, KSA), and jump to deeper sections via clear CTAs.
- **Data**: v1 uses static structured content (About text, hero stats, location list). Future: optional Dataverse entity `dq_location` for editable content.
- **Final Behaviour**: Single cohesive module with hero stats, short About DQ story, interactive map showing DQ offices, and navigation CTAs to Vision & Mission, DNA, and Directory sections.

---

## SECTION 1 — EXISTING CODEBASE STRUCTURE

**Folders and Files:**
- `src/pages/DiscoverDQ.tsx` - Main page component (modify to add new module at top)
- `src/components/Discover/HeroDiscoverDQ.tsx` - Existing hero (refactor or integrate)
- `src/components/Discover/` - All Discover section components
- `src/components/map/MapCard.tsx` - Map component (reuse)
- `src/api/MAPAPI.ts` - Location data and types (reuse `DQ_LOCATIONS`, `LocationItem`)
- `src/components/AnimationUtils.tsx` - Animation utilities (reuse)

**Rules:**
- Keep existing sections (Vision & Mission, DNA, Workspace Insights, D6 Cards, Directory) unchanged.
- Reuse `MapCard` and `DQMap` components from `src/components/map/`.
- Follow EJP design system (navy theme, card styles, button styles from `src/styles/theme.css`).
- Remove any mock/placeholder data; use structured static content or config files.
- Component structure: Create `src/components/Discover/AboutLocationsModule.tsx` as the main module component.

---

## SECTION 2 — TARGET SYSTEM ARCHITECTURE

### 2.1 Frontend

**Tech Stack:**
- React + TypeScript
- Tailwind CSS
- React Router for navigation
- Existing animation utilities (`AnimatedText`, `FadeInUpOnScroll`, `StaggeredFadeIn`)

**Design Components to Reuse:**
- `MapCard` from `src/components/map/MapCard.tsx`
- `DQMap` from `src/components/DQMap.tsx`
- EJP-style buttons (navy theme: `#0B1E67`, `var(--dws-navy)`)
- Card styles from `src/styles/theme.css`
- Typography: Playfair Display for headings, system fonts for body

**Filters:**
- None in v1 (map shows all DQ office locations: DXB, NBO, KSA)

**UX Behaviour:**
- Module renders as single section with three sub-sections:
  1. **Hero Stats Bar**: 3-4 stat cards (studios, markets, associates, etc.)
  2. **About DQ Content**: Headline, 1-2 paragraphs, 3-4 bullet points
  3. **Locations Map**: Interactive map with DQ office pins (DXB, NBO, KSA), hover/click for details
- Smooth scroll to anchor links for CTAs (Vision & Mission: `#vision-mission`, DNA: `#dna`, Directory: `#dq-directory`)
- Map interaction: Hover shows location name, click shows detail popup/card with address, contact, description

### 2.2 Middleware / Backend

**v1: No middleware required** (static content)

**Future (optional):**
- `GET /api/about-dq` - Returns About DQ content (headline, paragraphs, bullets)
- `GET /api/locations` - Returns DQ office locations (filtered to type: "Headquarters" | "Regional Office")
- `GET /api/stats` - Returns hero stats (studios count, markets, associates, etc.)

**Conceptual Endpoint Behaviour:**
- All endpoints return JSON with structured content
- Locations endpoint filters `DQ_LOCATIONS` to only DQ offices (exclude clients, banks, authorities)
- Stats endpoint aggregates from directory/associates data

### 2.3 Data Model

**v1 Static Content:**
- `AboutDQContent` type:
  - `headline: string`
  - `paragraphs: string[]` (1-2 items)
  - `bullets: string[]` (3-4 items)
- `HeroStats` type:
  - `studios: number` (e.g., 3)
  - `markets: string` (e.g., "UAE, KSA, Kenya")
  - `associates: number` (e.g., 150+)
  - `projects?: number` (optional)
- `DQOfficeLocation` (subset of `LocationItem` from `MAPAPI.ts`):
  - Filter `DQ_LOCATIONS` where `type === "Headquarters" | "Regional Office"`
  - Required fields: `id`, `name`, `city`, `country`, `coordinates`, `address`, `contact`, `email`

**Future Dataverse Entity (optional):**
- `dq_location` table:
  - `cr123_locationid` (GUID, primary key)
  - `cr123_name` (text)
  - `cr123_city` (text)
  - `cr123_country` (text)
  - `cr123_latitude` (decimal)
  - `cr123_longitude` (decimal)
  - `cr123_address` (text)
  - `cr123_type` (choice: Headquarters, Regional Office)
  - `cr123_contact` (text, optional)
  - `cr123_email` (email, optional)
  - `cr123_description` (text, optional)

---

## SECTION 3 — FRONTEND COMPONENT BEHAVIOUR

### Main Module Component: `AboutLocationsModule`

**Layout:**
- Full-width section with max-width container (1280px)
- Background: White or light gray (`#F9FAFB`)
- Three-column layout on desktop, stacked on mobile:
  1. Left: Hero Stats (3-4 stat cards in grid)
  2. Center: About DQ content (headline, paragraphs, bullets)
  3. Right: Locations Map (interactive map with DQ office pins)

**Stats Cards:**
- Display: Value (large, bold) + Label (small, uppercase)
- Style: EJP navy theme, rounded cards with subtle shadow
- Responsive: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop

**About DQ Content:**
- Headline: Playfair Display, 32-40px, bold, navy (`#030F35`)
- Paragraphs: 14-16px, gray text (`#475569`), max-width 600px
- Bullets: Checkmark or dot icons, 14px text
- CTA buttons below content: "Explore Vision & Mission", "Discover DNA", "Browse Directory"
- Buttons: EJP navy primary style, smooth scroll to anchors

**Locations Map:**
- Uses `MapCard` component with filtered locations (only DQ offices)
- Map height: 400-500px on desktop, 300px on mobile
- Pins: Custom markers for DXB, NBO, KSA
- Interaction:
  - Hover: Show location name tooltip
  - Click: Show detail card/popup with address, contact, email, description
- Location labels: "DXB", "NBO", "KSA" badges on map or in legend

**Responsive Behaviour:**
- Mobile: Stack all three sections vertically
- Tablet: Stats and About side-by-side, Map full-width below
- Desktop: Three-column layout

---

## SECTION 4 — REQUIRED MIDDLEWARE ROUTES

**v1: No routes required** (static content)

**Future (optional):**
- `GET /api/about-dq` - Returns About DQ content JSON
- `GET /api/locations?type=office` - Returns DQ office locations (filters by type)
- `GET /api/stats` - Returns hero stats JSON

**Response Format:**
```json
// GET /api/about-dq
{
  "headline": "Who We Are",
  "paragraphs": ["...", "..."],
  "bullets": ["...", "...", "...", "..."]
}

// GET /api/locations?type=office
{
  "locations": [
    {
      "id": "dq-dubai-opal",
      "name": "OPAL Tower Office (DQ Dubai Office)",
      "city": "Dubai",
      "country": "United Arab Emirates",
      "coordinates": { "lng": 55.2755, "lat": 25.1915 },
      "address": "...",
      "contact": "...",
      "email": "..."
    }
  ]
}

// GET /api/stats
{
  "studios": 3,
  "markets": "UAE, KSA, Kenya",
  "associates": 150,
  "projects": 120
}
```

---

## SECTION 5 — BUSINESS LOGIC (IN MIDDLEWARE)

**v1: No business logic** (static content)

**Future (if using Dataverse):**
- Location filtering: Only return locations where `cr123_type` is "Headquarters" or "Regional Office"
- Stats calculation: Aggregate from associates table (count by studio), projects table (active count)
- Content versioning: If About content is editable, return latest approved version

**Special Conditions:**
- Map coordinates must be valid (lat: -90 to 90, lng: -180 to 180)
- Location names must be unique
- Stats should be cached/updated daily (not real-time)

---

## SECTION 6 — REQUIRED REACT QUERY HOOKS

**v1: No hooks required** (static content in component or config file)

**Future (if using middleware):**
- `useAboutDQ()` - Fetches About DQ content from `/api/about-dq`
- `useDQOffices()` - Fetches DQ office locations from `/api/locations?type=office`
- `useHeroStats()` - Fetches hero stats from `/api/stats`

**Hook Structure:**
```typescript
// Example (future)
export function useAboutDQ() {
  return useQuery({
    queryKey: ['about-dq'],
    queryFn: async () => {
      const res = await fetch('/api/about-dq');
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
```

**v1 Implementation:**
- Create `src/data/aboutDQData.ts` with static content
- Import directly into component (no hooks needed)

---

## SECTION 7 — FILE STORAGE RULES (IF APPLICABLE)

**Not applicable** - No file uploads in this feature.

---

## SECTION 8 — PERMISSIONS

**End Users:**
- **View**: All users (public, no authentication required)
- **Interact**: All users can hover/click map pins, click CTAs

**Admin (Future):**
- **Edit About Content**: Admin role only (if content becomes editable via CMS)
- **Edit Locations**: Admin role only (if locations become editable)
- **Edit Stats**: Admin role only (if stats become editable)

**v1: No admin UI** - All content edits through code/config files.

---

## SECTION 9 — TESTING

**Required Test Coverage:**

1. **Component Rendering:**
   - AboutLocationsModule renders all three sections (Stats, About, Map)
   - Stats cards display correct values and labels
   - About content displays headline, paragraphs, bullets
   - Map renders with correct DQ office locations (DXB, NBO, KSA)

2. **Map Interaction:**
   - Hover on map pin shows location name tooltip
   - Click on map pin shows detail popup/card with address, contact, email
   - Map filters to only DQ offices (excludes clients, banks, authorities)

3. **Navigation CTAs:**
   - "Explore Vision & Mission" button scrolls to `#vision-mission`
   - "Discover DNA" button scrolls to `#dna`
   - "Browse Directory" button scrolls to `#dq-directory`
   - Smooth scroll behaviour works correctly

4. **Responsive Layout:**
   - Mobile: Sections stack vertically
   - Tablet: Stats and About side-by-side, Map below
   - Desktop: Three-column layout

5. **Data Mapping:**
   - Location data correctly filters `DQ_LOCATIONS` to DQ offices only
   - Stats data matches expected format
   - About content structure matches type definition

6. **Accessibility:**
   - All buttons have aria-labels
   - Map is keyboard navigable
   - Color contrast meets WCAG AA standards

---

## SECTION 10 — EXECUTION RULES FOR CURSOR / AI AGENT

**Standard Execution Rules:**

1. **Inspect Repository Patterns:**
   - Review `src/components/Discover/` for component structure patterns
   - Review `src/pages/DiscoverDQ.tsx` for page integration pattern
   - Review `src/api/MAPAPI.ts` for location data structure
   - Review `src/styles/theme.css` for EJP design tokens

2. **Follow Conventions:**
   - Use TypeScript with strict types
   - Use Tailwind CSS for styling (no inline styles except for dynamic values)
   - Use functional components with hooks
   - Follow existing naming: PascalCase for components, camelCase for functions/variables
   - File structure: One component per file, co-locate related types

3. **Don't Duplicate:**
   - Reuse `MapCard` and `DQMap` components (don't create new map component)
   - Reuse animation utilities from `AnimationUtils.tsx`
   - Reuse EJP button styles from theme (don't create new button component)

4. **Remove Mock Data:**
   - Replace any placeholder/mock data with structured static content
   - Create `src/data/aboutDQData.ts` for About content
   - Use filtered `DQ_LOCATIONS` from `MAPAPI.ts` for map data

5. **Implementation Order:**
   - Step 1: Create `src/data/aboutDQData.ts` with static content types and data
   - Step 2: Create `src/components/Discover/AboutLocationsModule.tsx` component
   - Step 3: Integrate module into `src/pages/DiscoverDQ.tsx` (add as first section)
   - Step 4: Test responsive layout and map interactions
   - Step 5: Test navigation CTAs and smooth scroll

6. **Small Commits:**
   - Commit 1: Add data file with types and static content
   - Commit 2: Add AboutLocationsModule component
   - Commit 3: Integrate module into DiscoverDQ page
   - Commit 4: Add responsive styles and polish

7. **Match Final Behaviour:**
   - Module appears at top of `/discover-dq` page
   - Three sections render correctly (Stats, About, Map)
   - Map shows only DQ offices (DXB, NBO, KSA) with interactive pins
   - CTAs navigate to correct sections via smooth scroll
   - Design matches EJP navy theme and existing Discover page style
   - No console errors or TypeScript warnings

