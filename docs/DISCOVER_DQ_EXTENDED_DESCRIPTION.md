# Discover DQ Page - Extended Description

This document provides a comprehensive breakdown of every single code element, component, and functionality on the Discover DQ page (`/discover-dq`).

## Table of Contents

1. [Page Entry Point](#page-entry-point)
2. [Main Sections](#main-sections)
3. [Components Breakdown](#components-breakdown)
4. [State Management](#state-management)
5. [Data Sources](#data-sources)
6. [Styling & Theming](#styling--theming)
7. [Interactions & Events](#interactions--events)
8. [Navigation & Routing](#navigation--routing)
9. [API Integrations](#api-integrations)
10. [Animation & Visual Effects](#animation--visual-effects)
11. [Accessibility Features](#accessibility-features)

---

## Page Entry Point

### File: `src/pages/DiscoverDQ.tsx`

**Main Component**: `DiscoverDQ`
- **Type**: React Functional Component (`React.FC`)
- **Route**: `/discover-dq` (defined in `src/AppRouter.tsx`)
- **Layout Structure**:
  - `<Header />` - Site header component
  - `<main>` - Main content wrapper
  - `<Footer />` - Site footer component

**Page-Level State**:
- `supportOpen`: Boolean - Controls support modal visibility
- `supportStatus`: String | null - Support form submission status message
- `isSubmittingSupport`: Boolean - Support form submission loading state
- `selectedTypes`: Set<ClientFilterKey> - Selected client filter types for map
- `selectedLocationId`: String | null - Currently selected location ID on map
- `prefersReducedMotion`: Boolean (memoized) - User's motion preference from media query

**Page-Level Types**:
- `ClientFilterKey`: Union type for client filter keys ("STC" | "SAIB" | "NEOM" | "ADIB" | "Khalifa Fund" | "Khalifa Fund EJ" | "DEWA" | "DFSA" | "SCA" | "MoI")
- `ClientLocation`: Extended `LocationItem` with `filterKey` and `markerColor` properties

**Hardcoded Client Locations Data** (`CLIENT_LOCATIONS` array):
- 10 client locations with full details:
  - STC (Riyadh, Saudi Arabia) - Purple marker (#7C3AED)
  - SAIB (Riyadh, Saudi Arabia) - Dark gray marker (#1F2933)
  - NEOM (Tabuk Region, Saudi Arabia) - Gold marker (#D97706)
  - ADIB (Abu Dhabi, UAE) - Dark blue marker (#162862)
  - Khalifa Fund (Abu Dhabi, UAE) - Green marker (#16A34A)
  - Khalifa Fund EJ (Abu Dhabi, UAE) - Green marker (#16A34A)
  - DEWA (Dubai, UAE) - Green marker (#16A34A)
  - DFSA (Dubai, UAE) - Dark gray marker (#4B5563)
  - SCA (Abu Dhabi, UAE) - Gold marker (#D97706)
  - MoI (Abu Dhabi, UAE) - Red marker (#DC2626)

**Client Filters Array** (`CLIENT_FILTERS`):
- Array of 10 filter buttons with key-label pairs matching client locations

**Page-Level Functions**:
- `filteredLocations`: Memoized filtered locations based on selected types
- `toggleType`: Toggles a client filter type on/off
- `clearTypes`: Clears all selected filter types
- `handleExploreLearningCenter`: Navigates to learning center coming soon page
- `handleExploreKnowledgeCenter`: Navigates to knowledge center coming soon page
- `handleSupportSubmit`: Handles support form submission (form handler)

**Support Modal**:
- Full-screen overlay modal
- Form fields: Name, Work Email, Message
- Submit button with loading state
- Cancel button
- Keyboard escape handler
- Success status message

**Page CSS Module**: `src/pages/DiscoverDQ.module.css`
- Custom CSS variables for DQ brand colors
- Modal styles (overlay, card, header, body, footer)
- Reduced motion support
- Responsive breakpoints

---

## Main Sections

The Discover DQ page consists of 6 main sections in order:

### 1. Hero Section
**Component**: `Discover_HeroSection`
**File**: `src/components/Discover/Discover_HeroSection.tsx`

**Visual Elements**:
- **Background Layers** (EJP-style layered hero):
  1. Base navy/blue gradient (#030F35)
  2. Background image with blur and opacity
  3. Light gradient overlay
  4. Mountain Layer 3 (deepest, heavy blur, low opacity)
  5. Mountain Layer 2 (mid layer, medium blur)
  6. Mountain Layer 1 (foreground, light blur)
  7. Foreground mountain silhouettes (geometric/stepped, clearly visible)
  8. Reflection of mountain silhouettes (below hero, subtle)
  
- **Content**:
  - Main Title: "Discover DigitalQatalyst" (72px, Palatino serif, animated word-by-word)
  - Subtitle: Description text (24px, Helvetica Neue)
  - Stats Cards (3 cards):
    - "126+ Active Users"
    - "120+ Ongoing Projects"
    - "90% Collaboration Satisfaction"
    - Glass-morphism styling with backdrop blur
    - Hover effects with shadow enhancement
  - CTA Buttons (2):
    - "Explore Work Zones" (primary, white background)
    - "Explore Strategy Center" (secondary, transparent with border)

**Animations**:
- `AnimatedText` - Word-by-word reveal for title
- `FadeInUpOnScroll` - Subtitle fade-in
- `StaggeredFadeIn` - Stats cards staggered entrance

**Interactions**:
- Smooth scroll to #growth-areas section
- Navigation to coming soon pages

---

### 2. Map Section (Growth Areas)
**Section ID**: `#growth-areas`
**Location**: Directly in `DiscoverDQ.tsx` (not a separate component)

**Visual Elements**:
- Section Header:
  - Title: "Discover the DigitalQatalyst Ecosystem" (30px, bold, #162862)
  - Description paragraph (16px, #4B5563)
  
- **Client Filter Buttons**:
  - 10 filter buttons (one per client)
  - Color-coded with client's marker color
  - Active state: background color matches marker, white text
  - Inactive state: white background, colored text and border
  - Hover: scale transform (105%)
  - "Clear" button appears when filters are active
  
- **Map Container**:
  - Responsive height: 420px (mobile) → 520px (md) → 608px (lg/xl)
  - Rounded corners (rounded-2xl)
  - White background with shadow
  - Contains `MapCard` component

**Component Used**: `MapCard`
**File**: `src/components/map/MapCard.tsx`

**MapCard Props**:
- `locations`: Array of filtered LocationItem objects
- `selectedId`: Currently selected location ID
- `onSelect`: Callback when location is selected
- `onClearFilters`: Optional callback to clear filters
- `className`: Additional CSS classes

**MapCard Features**:
- "All locations" button (appears when filters active)
- Wraps `DQMap` component

**Component Used**: `DQMap`
**File**: `src/components/DQMap.tsx`

**DQMap Features**:
- **Library**: Leaflet.js for map rendering
- **Basemap**: CARTO Positron (light, minimal style)
- **Initial View**: Center [25.0, 54.0], Zoom 5.5
- **Custom Markers**:
  - SVG-based pin icons (36x48px)
  - Color-coded per location (from location.markerColor or type-based)
  - White center circle with colored dot
  - Drop shadow effect
  - Click handler opens location modal
  
- **Marker Interactions**:
  - Click: Opens location modal + zooms to marker
  - Selected state: Changes marker to accent color (#E95139)
  - Auto-fit bounds when locations change
  
- **Location Modal**:
  - Slide-in panel from right
  - Dark backdrop overlay
  - Shows location details
  - Component: `LocationModal`

**Component Used**: `LocationModal`
**File**: `src/components/map/LocationModal.tsx` (referenced but not read in detail)

**Map Section State Management**:
- Filter selection managed in parent `DiscoverDQ` component
- Selected location synced between map and filter buttons
- Auto-clear selection when filters remove selected location

---

### 3. Vision & Mission Section
**Component**: `Discover_VisionMissionSection`
**File**: `src/components/Discover/Discover_VisionMissionSection.tsx`

**Layout**:
- Background: Light gray (#F9FAFB)
- Padding: 64px vertical (md: 96px)
- Two-column card layout (centered, 32px gap)

**Vision Card** (Left):
- Dimensions: 500px width (responsive: 100% on mobile)
- Padding: 28px (24px on mobile)
- Border radius: 16px
- White background with subtle shadow
- Content:
  - Title: "DQ Vision – Perfecting Life's Transactions" (22px, 600 weight, #030F35)
  - Body text: 3-line description (15px, #4B5563, line-height 1.6)
  - Link: "Read the DQ Vision Story →" (15px, #131E42, hover: #0F1633)
    - External link to Shorthand story
- Flex column layout with auto margin-top on link

**Mission Card** (Right):
- Same styling as Vision card
- Content:
  - Title: "DQ Mission – Building a Smarter, Connected Future" (22px)
  - Body text: 3-line description (15px)
  - Link: "Explore the Knowledge Center →" (15px)
    - Internal navigation to `/marketplace/guides`

**Section Header**:
- Uses `DiscoverSectionTitle` component
- Subtitle: "Defines why DQ exists and how we design, build, and deliver meaningful outcomes together."

**Responsive Behavior**:
- Cards stack vertically on mobile (< 1024px)
- Padding reduces on mobile (24px)
- Font sizes adjust (20px title, 14px body on mobile)

**Component Used**: `DiscoverSectionTitle`
**File**: `src/components/Discover/DiscoverSectionTitle.tsx`

**DiscoverSectionTitle Props**:
- `id`: Optional string for heading ID
- `as`: Heading level ("h1" | "h2", default "h2")
- `children`: Title text content

**Styling**:
- Font: Palatino Linotype, Palatino, Book Antiqua, Georgia, serif
- Size: 48px
- Weight: 700
- Color: #000000
- Center aligned
- Line height: 1.2

---

### 4. DQ DNA Section (Growth Dimensions)
**Component**: `Discover_DNASection`
**File**: `src/components/Discover/Discover_DNASection.tsx`

**Section Layout**:
- Background: White (#fff)
- Padding: 48px vertical (top), 32px (bottom)
- Max width: 1120px, centered

**Section Header**:
- Title: "Growth Dimensions" (via `DiscoverSectionTitle`)
- Description: "Seven interconnected dimensions defining how DQ thinks, works, governs, collaborates, and evolves continuously." (17px, #64748B)

**SVG Diagram** (Interactive Honeycomb):
- ViewBox: 900 x 520
- Max width: 1400px, centered

**7 Hexagon Nodes**:
1. **Center Hexagon**: "The Vision" (Purpose) - Navy filled (#162862)
2. **Left Top**: "Agile Flows" (Value Streams) - Outline
3. **Right Top**: "Agile SOS" (Governance) - Outline
4. **Left Mid**: "Agile DTMF" (Products) - Outline
5. **Right Mid**: "Agile TMS" (Tasks) - Outline
6. **Left Bot**: "The HoV" (Culture) - Navy filled
7. **Right Bot**: "The Personas" (Identity) - Navy filled

**Hexagon Styling**:
- Size: 68px radius
- Navy filled hexagons: White text
- Outline hexagons: Navy text with subtle texture pattern
- Number badges:
  - Core hexes (1-3): White badge with navy border and navy number
  - Outer hexes (4-7): Navy badge with white number
- Hover effects:
  - Scale transform (1.05x)
  - Glow filter
  - Stroke width increase
- Click: Opens dimension modal

**Connector Lines**:
- Horizontal lines from hex edges to labels
- Stroke: Navy (#162862), 2px width
- Animated stroke-dasharray reveal
- End dots (3.5px radius)
- Labels positioned above lines:
  - "How we orchestrate" (left)
  - "How we govern" (right)
  - "What we offer" (left)
  - "How we work" (right)
  - "How we behave" (left)
  - "Who we are" (right)
  
- Special vertical connector:
  - From center hex (The Vision) bottom edge straight down
  - Label: "Why we exist"

**Animation Sequence**:
- Center hex fades in first (delay: 0ms)
- Outer hexes fade in sequentially:
  - leftTop: 80ms
  - rightTop: 160ms
  - leftMid: 240ms
  - rightMid: 320ms
  - leftBot: 400ms
  - rightBot: 480ms
- Connector lines animate with stroke-dasharray (delays: 200-800ms)
- Intersection Observer triggers animation on scroll

**Data Sources**:
- Primary: API fetch via `fetchDna()` from `src/services/dq.ts`
- Fallback: Hardcoded `NODES` and `CALLOUTS` arrays
- Growth dimension content: Hardcoded `GROWTH_DIMENSIONS_CONTENT` object

**Dimension Modal**:
- Opens when hexagon is clicked
- Component: `DimensionModal` (internal to Discover_DNASection)
- Content:
  - Title and subtitle
  - Description paragraph (17px, max-height with scroll)
  - Two CTA buttons:
    - Primary: External link to Shorthand story (opens in new tab)
    - Secondary: Internal navigation to Knowledge Center route
- Modal styling:
  - Max width: 720px
  - Max height: 72vh
  - White background, rounded corners (16px)
  - Shadow: 0 20px 60px rgba(16, 24, 64, 0.18)
  - Backdrop: rgba(22, 40, 98, 0.45) with blur
- Accessibility:
  - Keyboard trap (Tab navigation)
  - Escape key to close
  - Focus management
  - ARIA labels

**Dimension Content** (7 dimensions):
1. The DQ Vision - Purpose | Why we exist
2. The HoV - Culture | How we behave
3. The Personas - Identity | Who we are
4. Agile TMS - Tasks | How we work
5. Agile SoS - Governance | How we govern
6. Agile Flows - Value Streams | How we orchestrate
7. Agile DTMF - Products | What we offer

Each dimension includes:
- Title
- Subtitle
- Full description paragraph
- Primary CTA (external link)
- Secondary CTA (internal route)

---

### 5. Six Digital Architecture Section (Agile 6xD)
**Component**: `Discover_SixDigitalSection`
**File**: `src/components/Discover/Discover_SixDigitalSection.tsx`

**Section Layout**:
- Background: Light gray (#F9FAFB)
- Padding: 64px vertical (py-16)
- Container: Max width with responsive padding

**Section Header**:
- Title: "Agile 6xD (Products)" (via `DiscoverSectionTitle`)
- Description: "Six digital perspectives guiding how DQ designs, builds, and scales transformation as living systems." (18px, gray-600)
- Uses `FadeInUpOnScroll` animation

**Progress Bar** (Desktop only, hidden on mobile):
- Horizontal progress bar (slate-200 background)
- Gradient fill (DQ CTA gradient)
- 6 clickable dots representing each dimension
- Progress percentage calculated: `((activeIndex + 1) / 6) * 100`
- Smooth width transition (700ms ease-out)
- Dot states:
  - Active: White background, blue border (#1452F0)
  - Inactive: Slate background, white border

**6 Dimension Cards** (Grid Layout):
- Grid: 1 column (mobile) → 2 columns (sm) → 3 columns (lg)
- Gap: 24px (gap-6)
- Min width: 300px (flex-shrink-0 on mobile)

**Card Structure** (per dimension):
- Container: White background, rounded-xl, shadow-md
- Min height: 420px
- Padding: 24px (p-6)
- Flex column layout
- Active state: Ring-2 ring-blue (#1452F0), shadow-lg
- Hover: shadow-lg, translate-y (-4px)

**Card Content**:
- Header Row:
  - Icon container: Rounded-full, 48px (p-3)
    - Active: Blue background (#1452F0), white icon
    - Inactive: Blue-100 background, blue-600 icon
  - Text container:
    - Label: "DIMENSION" (11px, uppercase, tracking-wide, slate-500)
    - Title: Dimension title (20px, bold, gray-800, clamp-1)

- Description: Short description paragraph (gray-600, clamp-2, mb-4)

- Key Areas List:
  - Heading: "Key Areas:" (semibold, gray-700, mb-2)
  - Bulleted list (space-y-1):
    - Bullet color: DQ coral (active) or DQ navy (inactive)
    - Text: gray-600

- CTA Button: "View Details" (mt-auto)
  - Background: #131E42 (navy)
  - Hover: #0F1A4F
  - White text, rounded-md
  - Arrow icon (↗) with translate-x on hover
  - Click: Opens dimension modal

- Badge (top-right corner):
  - Dimension ID (D1-D6)
  - Active: DQ coral background, white text
  - Inactive: Gray background, gray text
  - 32px circle, absolute positioned

**6 Dimensions Data**:
1. **D1 - Digital Economy (DE)**
   - Icon: Building2
   - Short: "How organisations create value, compete, and grow in a digital-first economy."
   - Key Areas: 3 items
   
2. **D2 - Digital Cognitive Organisation (DCO)**
   - Icon: Brain
   - Short: "How organisations think, learn, and decide using data, intelligence, and feedback loops."
   - Key Areas: 3 items

3. **D3 - Digital Business Platforms (DBP)**
   - Icon: Layers
   - Short: "Technology platforms that connect services, data, and stakeholders at scale."
   - Key Areas: 3 items

4. **D4 - Digital Transformation (DT2.0)**
   - Icon: Shuffle
   - Short: "Next-generation transformation model for designing and deploying change."
   - Key Areas: 3 items

5. **D5 - Digital Worker & Workspace (DW:WS)**
   - Icon: Users
   - Short: "Modern digital employee experience — tools, spaces, and ways of working."
   - Key Areas: 3 items

6. **D6 - Digital Accelerators (Tools)**
   - Icon: Rocket
   - Short: "Tools, templates, and automation that speed up delivery and adoption."
   - Key Areas: 3 items

**State Management**:
- `activeIndex`: Number - Currently active/hovered card index (0-5)
- `activeDimension`: SixDigitalStep | null - Selected dimension for modal

**Interactions**:
- Mouse enter on card: Updates `activeIndex`
- Click on card: Opens dimension modal
- Click on progress bar dot: Updates `activeIndex`
- Modal close: Resets `activeDimension`

**Dimension Modal**:
- Component: `DQSixDigitalModal`
- File: `src/components/Discover/DQSixDigitalModal.tsx`

**Modal Features**:
- Fixed overlay, centered, max-width 4xl (1024px)
- Backdrop: Black 40% opacity with blur
- White card, rounded-3xl, shadow
- Max height: 90vh, scrollable content

**Modal Content**:
- Header:
  - Badge: "DIMENSION" (uppercase, tracking-wide, navy background 10% opacity)
  - Title: Dimension title (2xl/3xl, semibold, navy)
  - Close button: X icon, hover states

- Description: Modal description paragraph (base, slate-600)

- Key Areas Box:
  - Light gray background (#F8FAFC)
  - Rounded-2xl, border, padding
  - Heading: "Key Areas"
  - Bulleted list with DQ coral bullets

- Available Services Section:
  - Heading: "Available Services"
  - Grid: 1 column (mobile) → 2 columns (sm)
  - 2 service cards per dimension:
    - Learning: "LMS Courses" (navy badge)
    - Service: "Knowledge Hub" (coral badge)
  - Each service card:
    - White background, border, shadow
    - Badge: Type indicator
    - Title: Service name
    - Description: Service description
    - Provider: "Learning Center" or "Knowledge Center"
    - "Explore Service" button (navy, hover states)

- Next Action Section:
  - Text: "Next Action" label (coral, uppercase)
  - Description: Guidance text
  - "Visit Knowledge Center" button (navy, large, arrow icon)

**Modal Navigation**:
- `onExploreKnowledge`: Navigates to `/coming-soon?type=knowledge&dimension={id}`
- `onExploreLearning`: Navigates to `/coming-soon?type=lms&dimension={id}`

**Accessibility**:
- Keyboard trap (Tab navigation)
- Escape key to close
- Focus management
- ARIA labels (dialog, modal, labelledby, describedby)

---

### 6. Directory Section
**Component**: `Discover_DirectorySection`
**File**: `src/components/Discover/Discover_DirectorySection.tsx`

**Section Layout**:
- Background: White (#FFFFFF)
- Padding: 64px vertical (md: 80px), 80px bottom
- Max width: 1240px, centered

**Section Header**:
- Title: "DQ Directory" (via `DiscoverSectionTitle`)
- Subtitle: "Explore DQ teams, capabilities, and factories delivering solutions, services, and innovation across the ecosystem." (customizable via props)
- Center aligned

**Controls Row** (Sticky):
- Sticky positioning: top-16 (64px from top)
- Background: White
- Border: #E3E7F8
- Rounded-2xl
- Padding: 16px
- Shadow-sm
- Z-index: 10
- Layout: Flex row (column on mobile), gap-4

**Search Input**:
- Icon: Search icon (lucide-react), 18px, left positioned
- Input:
  - Full width (flex-1)
  - Height: 44px (h-11)
  - Padding: Left 44px (for icon), Right 16px
  - Placeholder: "Search people, teams, or keywords…"
  - Background: #F9FAFB
  - Border: #E3E7F8
  - Rounded-xl
  - Text: 14px, #131E42
  - Focus: Ring-2, ring-offset-1
- Debounced: 300ms delay before filtering

**View Toggle** (Tab Buttons):
- Container: Inline-flex, rounded-xl, padding-1
- Background: #F9FAFB
- Border: #E3E7F8
- Two buttons:
  - "Units" tab
  - "Associates" tab
- Button states:
  - Active: White background, navy text (#131E42), shadow
  - Inactive: Transparent, gray text (#334266)
- Transitions: All properties, smooth

**Filters Button**:
- Icon: Filter icon (lucide-react), 16px
- Text: "Filters"
- Badge: Active filter count (coral background #FB5535, white text)
  - Shows: selectedSectors + selectedStreams + searchQuery count
- States:
  - Active: Navy background (#131E42), white text
  - Inactive: Light background (#F9FAFB), navy text
- Click: Toggles `showFilters` state

**Filter Chips Panel** (Conditional):
- Visible when `showFilters` is true
- Background: White
- Border: #E3E7F8
- Rounded-xl
- Padding: 16px
- Space-y-3 layout

**Sector Filters**:
- Label: "Sector" (14px, semibold, navy)
- "Clear all" link (coral, hover underline)
- Flex wrap, gap-2
- 4 sector buttons:
  - Governance
  - Operations
  - Platform
  - Delivery
- Button states:
  - Selected: Navy background (#131E42), white text, navy border
  - Unselected: Light background (#F9FAFB), gray text (#334266), light border (#E3E7F8)
- Transitions: All properties

**Results Count**:
- Text: "{count} units found" or "{count} associates found"
- Font: 14px, medium, gray (#334266, 85% opacity)

**Grid Layout**:
- Units view:
  - Component: `DirectoryCard`
  - Grid: 1 column (mobile) → 2 columns (sm) → 3 columns (lg)
  - Gap: 24px (gap-6)
  - Limit: First 9 units displayed
  - "View Full Directory" button at bottom (centered)
  
- Associates view:
  - Component: `AssociateCard` (internal)
  - Grid: 1 column (mobile) → 2 columns (sm) → 3 columns (lg)
  - Gap: 24px (gap-6)
  - Limit: First 9 associates displayed
  - "View Full Directory" button at bottom (centered)

**DirectoryCard Component**:
- File: `src/components/Directory/DirectoryCard.tsx` (referenced)
- Props:
  - `logoUrl`: Optional banner image
  - `title`: Unit name
  - `tag`: Sector
  - `description`: Mandate or current focus
  - `towers`: Focus tags or WI areas
  - `onViewProfile`: Click handler

**AssociateCard Component** (Internal):
- Defined within `Discover_DirectorySection.tsx`
- Fixed height: 460px (h-[460px])
- Card base: Rounded-2xl, border, white background, shadow, hover effects
- Padding: 24px (p-6)
- Flex column layout

**AssociateCard Content**:
- Header:
  - Avatar: Initials circle (48px, slate-100 background, slate-700 text)
  - Name: 16px, semibold, slate-900, clamp-2
  - Tag badge: Rounded-full, slate-100 background, slate-700 text, 11px
  - Description: 14px, slate-600, clamp-2 (optional)
  - One-liner: 13px, slate-600, clamp-2 (optional)

- Contact Panel (Meta Panel):
  - Background: slate-50 (#F9FAFB)
  - Rounded-xl
  - Padding: 16px
  - Margin-bottom: 16px
  - Contact items:
    - Phone: 📞 icon, link (tel:)
    - Email: ✉️ icon, link (mailto:)
    - Location/Website: 🌐 icon, link or text

- CTA Button:
  - "View Profile" (full width)
  - Background: #131E42 (navy)
  - Hover: #0F1633
  - White text, rounded-xl, 14px, semibold
  - Click: Opens associate modal

**Associate Modal**:
- Component: `DirectoryAssociateModal`
- File: `src/components/Directory/DirectoryAssociateModal.tsx` (referenced)
- Props:
  - `open`: Boolean
  - `profile`: DirectoryAssociateProfile object
  - `onClose`: Close handler

**Data Sources**:
- Hooks: `useWorkUnits()`, `useAssociates()` from `src/hooks/useWorkDirectory`
- Types: `WorkUnit`, `WorkAssociate` from `src/data/workDirectoryTypes`
- URL Parameters:
  - `q`: Search query
  - `view`: View mode ("units" | "associates")
  - `sectors`: Comma-separated sector filter
  - `streams`: Comma-separated stream filter

**State Management**:
- `searchQuery`: String - Current search input
- `debouncedQuery`: String - Debounced search (300ms)
- `viewMode`: "units" | "associates" - Current view
- `selectedSectors`: SectorType[] - Selected sector filters
- `selectedStreams`: String[] - Selected stream filters
- `showFilters`: Boolean - Filter panel visibility
- `selectedAssociateProfile`: DirectoryAssociateProfile | null - Selected associate for modal
- `isAssociateModalOpen`: Boolean - Associate modal visibility

**Filtering Logic**:
- Units: Filters by unitName, mandate, currentFocus, sector, unitType, focusTags, wiAreas
- Associates: Filters by name, title, role, unit, sector, tag, email, mobile, location, company, website
- Sector filter: Includes only selected sectors
- Search: Case-insensitive, matches any field

**Navigation**:
- Unit click: Navigates to `/work-directory/units/{slug}`
- "View Full Directory": Navigates to `/marketplace/work-directory?tab={viewMode}`
- URL params sync with state (replace mode)

**Loading States**:
- `workUnitsLoading`: Shows "Loading units..." message
- `workAssociatesLoading`: Shows "Loading associates..." message

---

## Components Breakdown

### Shared/Utility Components

**AnimationUtils**
- File: `src/components/AnimationUtils.tsx`
- Exports:
  - `AnimatedText`: Word-by-word text reveal animation
  - `FadeInUpOnScroll`: Fade and slide-up on scroll
  - `StaggeredFadeIn`: Staggered animation for lists
  - `useCountUp`: Number counter animation hook
  - `HorizontalScrollReveal`: Horizontal scroll reveal

**DiscoverSectionTitle**
- File: `src/components/Discover/DiscoverSectionTitle.tsx`
- Purpose: Consistent section title styling
- Props: `id`, `as` (h1/h2), `children`
- Styling: Palatino serif, 48px, 700 weight, center aligned

**Header & Footer**
- Files: `src/components/Header/Header.tsx`, `src/components/Footer/Footer.tsx`
- Wraps entire page content
- Standard site navigation elements

---

## State Management

**Page-Level State** (DiscoverDQ.tsx):
- Support modal state (3 variables)
- Map filter state (2 variables)
- Motion preference (1 memoized value)

**Hero Section** (Discover_HeroSection):
- No internal state (pure presentational)

**Map Section** (DiscoverDQ.tsx + MapCard + DQMap):
- Filter selection (parent)
- Selected location (parent)
- Map loading (DQMap internal)
- Modal visibility (DQMap internal)

**Vision & Mission** (Discover_VisionMissionSection):
- No internal state (pure presentational)

**DNA Section** (Discover_DNASection):
- `hoveredId`: Number | null - Hovered hexagon ID
- `nodesDb`: DqDnaNode[] | null - API-fetched nodes
- `calloutsDb`: DqDnaCallout[] | null - API-fetched callouts
- `hasAnimated`: Boolean - Animation trigger flag
- `selectedDimension`: GrowthDimensionContent | null - Modal content
- `isModalOpen`: Boolean - Modal visibility

**Six Digital Section** (Discover_SixDigitalSection):
- `activeIndex`: Number - Active card index (0-5)
- `activeDimension`: SixDigitalStep | null - Modal content

**Directory Section** (Discover_DirectorySection):
- Search state (2 variables: query + debounced)
- View mode (1 variable)
- Filter state (3 variables: sectors, streams, visibility)
- Modal state (2 variables: profile + visibility)
- URL params sync (useSearchParams hook)

---

## Data Sources

**Hardcoded Data**:
- Client locations (10 items in DiscoverDQ.tsx)
- Client filters (10 items in DiscoverDQ.tsx)
- Growth dimensions content (7 items in Discover_DNASection.tsx)
- Six digital steps (6 items in Discover_SixDigitalSection.tsx)
- DNA nodes (7 items, fallback in Discover_DNASection.tsx)
- DNA callouts (6 items, fallback in Discover_DNASection.tsx)

**API Data**:
- DNA nodes/callouts: `fetchDna()` from `src/services/dq.ts` (optional, with fallback)
- Work units: `useWorkUnits()` hook → Supabase query
- Work associates: `useAssociates()` hook → Supabase query

**Type Definitions**:
- `LocationItem`: `src/api/MAPAPI.ts`
- `WorkUnit`, `WorkAssociate`: `src/data/workDirectoryTypes.ts`
- `SectorType`, `ViewMode`: `src/types/directory.ts`
- `DqDnaNode`, `DqDnaCallout`: `src/services/dq.ts`

---

## Styling & Theming

**CSS Modules**:
- `DiscoverDQ.module.css`: Page-level styles, modal styles, CSS variables

**TailwindCSS Classes**:
- Used extensively throughout all components
- Custom colors: dq-navy, dq-orange, dq-coral, etc.
- Responsive breakpoints: sm, md, lg, xl, 2xl

**Inline Styles**:
- Used for precise pixel-perfect styling
- Font families, colors, spacing
- SVG styling (DNA section)

**CSS Variables** (DiscoverDQ.module.css):
- `--dws-orange`: #FB5535
- `--dws-maroon`: #6B3E5C
- `--dws-navy`: #0E1446
- `--dws-white`: #FFFFFF
- `--dws-gray`: #F6F7F9
- `--dws-text`: #0B1220
- `--dws-muted`: #6B7280
- `--dws-border`: #E5E7EB

**Color Palette**:
- Primary Navy: #030F35, #131E42, #162862, #0E1F4A
- Primary Orange/Red: #FB5535, #E95139, #DC2626
- Grays: #F9FAFB, #F3F4F6, #E5E7EB, #94A3B8, #64748B, #4B5563, #334155
- Accent: #1452F0 (blue), #16A34A (green), #D97706 (gold), #7C3AED (purple)

---

## Interactions & Events

**Scroll Interactions**:
- Smooth scroll to #growth-areas (hero CTA)
- Intersection Observer for animation triggers (DNA section)
- Scroll-triggered fade-in animations (multiple sections)

**Click Interactions**:
- Filter buttons (map section)
- Hexagon clicks (DNA section)
- Dimension card clicks (Six Digital section)
- Progress bar dots (Six Digital section)
- Directory card clicks (Directory section)
- CTA buttons (all sections)
- Modal close buttons (all modals)
- Support form submit

**Hover Interactions**:
- Filter buttons: Scale transform
- Stats cards: Shadow enhancement
- Hexagons: Scale + glow filter
- Directory cards: Shadow + ring
- Dimension cards: Shadow + translate
- Buttons: Background color changes, translate transforms
- Links: Color changes

**Keyboard Interactions**:
- Escape key: Closes modals (DNA, Six Digital, Support, Map location)
- Tab key: Modal focus trap
- Enter/Space: Activates buttons and cards

**Form Interactions**:
- Support form: Name, email, message validation
- Search input: Debounced filtering (300ms)
- URL param sync: Updates on filter/view changes

**Map Interactions**:
- Marker click: Opens location modal, zooms to marker
- Filter selection: Updates visible markers
- Marker hover: (handled by Leaflet default)
- Zoom controls: Leaflet default controls

---

## Navigation & Routing

**Internal Routes**:
- `/discover-dq`: Main page
- `/marketplace/guides`: Knowledge Center (Vision & Mission link)
- `/marketplace/work-directory?tab={mode}`: Full directory
- `/work-directory/units/{slug}`: Unit detail page
- `/resource-coming-soon?title=...`: Learning Center coming soon
- `/insight-coming-soon?title=...`: Knowledge Center coming soon
- `/coming-soon?type={type}&dimension={id}`: Dimension-specific coming soon

**External Links**:
- Shorthand stories (7 links for DNA dimensions)
- Client websites (10 links for map locations)

**Navigation Methods**:
- `useNavigate()` hook (React Router)
- `<a>` tags with `href` for external links
- `window.open()` for external links in modals
- Smooth scroll for anchor links

---

## API Integrations

**DNA Data** (Optional):
- Endpoint: Via `fetchDna()` service
- Fallback: Hardcoded data if API fails
- Types: `DqDnaNode[]`, `DqDnaCallout[]`

**Work Directory**:
- Supabase queries via `useWorkUnits()` and `useAssociates()` hooks
- Tables: `work_units`, `work_associates` (inferred)
- Real-time: Not specified (likely not used)

**No Other APIs**:
- Map uses Leaflet tile layers (CARTO)
- All other data is hardcoded

---

## Animation & Visual Effects

**Animation Utilities**:
- `AnimatedText`: Word-by-word reveal with configurable delay/duration
- `FadeInUpOnScroll`: Opacity + translateY on intersection
- `StaggeredFadeIn`: Sequential fade-in for child elements
- `useCountUp`: Number counter animation (not used on this page)

**CSS Animations**:
- Modal enter: Fade + scale + translateY
- Hexagon fade-in: Opacity + scale
- Connector line draw: Stroke-dasharray animation
- Button hover: Transform translateY
- Card hover: Transform translateY, shadow enhancement

**Transitions**:
- All interactive elements: 200-300ms transitions
- Color changes: 200ms ease
- Transform changes: 300ms ease-out
- Modal backdrop: 300ms opacity transition

**Reduced Motion Support**:
- `prefersReducedMotion` media query check
- Animations disabled when user prefers reduced motion
- CSS: `@media (prefers-reduced-motion: reduce)`

**Visual Effects**:
- Glass-morphism: Backdrop blur on stats cards
- Gradient overlays: Multiple layers in hero section
- SVG filters: Glow effect on hexagon hover
- Drop shadows: Multiple levels for depth
- Blur effects: Background image, mountain layers, modal backdrop

---

## Accessibility Features

**ARIA Labels**:
- Modal dialogs: `role="dialog"`, `aria-modal="true"`
- Modal titles: `aria-labelledby`
- Modal descriptions: `aria-describedby`
- Buttons: `aria-label` for icon-only buttons
- Tabs: `role="tablist"`, `role="tab"`, `aria-selected`

**Keyboard Navigation**:
- Modal focus trap (Tab cycling)
- Escape key to close modals
- Enter/Space to activate buttons
- Focus visible styles on interactive elements

**Semantic HTML**:
- Proper heading hierarchy (h1, h2, h3)
- Section elements with IDs
- Button elements for actions
- Link elements for navigation
- Form elements with labels

**Screen Reader Support**:
- Alt text for images (where applicable)
- Hidden text for icon-only buttons
- Descriptive link text
- Form label associations

**Focus Management**:
- Modal opens: Focus moves to close button
- Modal closes: Focus returns to trigger element
- Focus visible rings on all interactive elements

**Color Contrast**:
- Text colors meet WCAG contrast requirements
- Interactive elements have sufficient contrast
- Focus indicators are clearly visible

---

## Summary

The Discover DQ page is a comprehensive, multi-section page showcasing DigitalQatalyst's vision, mission, growth dimensions, digital architecture, and team directory. It uses:

- **6 main sections**: Hero, Map, Vision & Mission, DNA, Six Digital, Directory
- **15+ components**: Mix of page-specific and shared components
- **10+ state variables**: Managed across multiple components
- **3 data sources**: Hardcoded, API (optional), Supabase
- **Extensive animations**: Scroll-triggered, hover, click interactions
- **Full accessibility**: ARIA, keyboard navigation, focus management
- **Responsive design**: Mobile-first, breakpoints at sm/md/lg/xl

All code is located in:
- `src/pages/DiscoverDQ.tsx` (main page)
- `src/components/Discover/` (section components)
- `src/components/map/` (map-related components)
- `src/components/Directory/` (directory components)
- `src/components/AnimationUtils.tsx` (animation utilities)

