# DQ Knowledge Center Marketplace - Complete Functionality & UI Prompt

## Overview
Build a comprehensive knowledge center marketplace with advanced filtering, multi-tab navigation, search capabilities, and dynamic content display. The system should support multiple content types (guides, courses, products, testimonials, glossary, FAQs) with tab-specific filtering and layouts.

## Core Features

### 1. Multi-Tab Navigation System
- **Tab Structure**: Horizontal tab navigation with active state indicators
- **Tab Types**:
  - Strategy/GHC (Golden Honeycomb of Competencies)
  - Guidelines (policies, resources, best practices)
  - 6xD (Six dimensions of digital transformation)
  - Products/Blueprints (solutions and offerings)
  - Testimonials (client success stories)
  - Glossary (terminology and definitions)
  - FAQs (frequently asked questions)

- **Tab Features**:
  - Active tab highlighted with colored bottom border
  - Tab-specific descriptions displayed below tabs
  - URL parameter sync (`?tab=strategy`)
  - Smooth transitions between tabs
  - Tab-specific filter configurations

### 2. Advanced Filtering System

#### Filter Sidebar (Desktop & Mobile)
- **Desktop**: Fixed sidebar on left (25% width)
- **Mobile**: Collapsible overlay with toggle button
- **Filter Categories** (tab-dependent):
  - Domain/Category
  - Sub-domain
  - Guide Type (Best Practice, SOP, Template, etc.)
  - Unit/Department
  - Location (Dubai, Nairobi, Riyadh)
  - Status (Approved, Draft, Published)
  - Strategy Type (for Strategy tab)
  - Framework/Program (GHC 1-7 for Strategy)
  - Product Type/Stage (for Products tab)
  - Testimonial Category (for Testimonials tab)
  - Knowledge System (for Glossary tab)
  - FAQ Category (for FAQs tab)

#### Filter Behavior
- **Multi-select**: Checkboxes for multiple selections
- **URL Sync**: All filters reflected in URL parameters
- **Dynamic Options**: Filter options update based on available content
- **Faceted Counts**: Show count of items per filter option
- **Reset Functionality**: Clear all filters button
- **Collapsed State**: Filters can be collapsed/expanded
- **Active Indicators**: Visual badges showing active filter count

### 3. Search Functionality
- **Global Search Bar**: Full-width search input at top
- **Search Scope**: Searches across title, summary, tags, metadata
- **Real-time**: Updates results as you type (debounced)
- **URL Parameter**: `?q=search+term`
- **Highlight**: Search terms highlighted in results (optional)
- **Placeholder**: Context-aware placeholder text

### 4. Content Display Layouts

#### Grid Layout (Default for most tabs)
- **Responsive Grid**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large screens: 4 columns

- **Card Components**:
  - Hero image (16:9 aspect ratio)
  - Title (truncated to 2 lines)
  - Summary/description (truncated to 3 lines)
  - Metadata badges (category, type, status)
  - Author information
  - Last updated date
  - Download count
  - Editor's pick badge (star icon)
  - Action buttons (View, Bookmark, Compare)

#### List Layout (Alternative view)
- Horizontal cards with image on left
- More detailed information visible
- Better for scanning long lists

#### Special Layouts:
- **Glossary**: Alphabetical grouping with letter headers
- **FAQs**: Accordion-style expandable questions
- **Products**: Feature-rich cards with stage indicators
- **Testimonials**: Quote-style cards with client logos

### 5. Sorting Options
- **Sort Dropdown**: Top-right of content area
- **Sort Options**:
  - Editor's Pick (default)
  - Most Recent (last updated)
  - Most Downloaded
  - Alphabetical (A-Z)
  - Relevance (when searching)

### 6. Pagination
- **Page Size**: Configurable (default 200 items for guides)
- **Pagination Controls**:
  - Previous/Next buttons
  - Page number buttons (1, 2, 3, ...)
  - Jump to page input
  - Total count display ("Showing 1-20 of 150")
- **URL Parameter**: `?page=2`
- **Scroll to Top**: Auto-scroll when changing pages

### 7. Breadcrumb Navigation
- Home > Knowledge Center > [Current Tab]
- Clickable links for navigation
- Current page not clickable
- Chevron separators

### 8. Tab-Specific Features

#### Strategy/GHC Tab
- **Framework Filter**: GHC 1-7 (Vision, HoV, Persona, TMS, SoS, Flows, 6xD)
- **Strategy Type Filter**: Journey, History, Framework
- **Special Cards**: Featured GHC overview cards
- **Status**: Shows Draft, Published, and Approved content

#### Guidelines Tab
- **Category Filter**: Resources, Policies, xDS
- **Categorization**: Policy sets (1A, 1B, 2A-2G)
- **Attachments Filter**: Has attachments vs. no attachments
- **Exclusions**: Filters out Strategy/Blueprint/Testimonial content

#### Products/Blueprints Tab
- **Product Type**: Platform, Academy, Framework, Tooling, Marketplace
- **Product Stage**: Concept, MVP, Live, Scaling, Enterprise-ready
- **Product Class**: Class 01, Class 02, Class 03
- **Static Products**: Uses predefined product list
- **Rich Metadata**: Product owner, practice area

#### Testimonials Tab
- **Category Filter**: Client testimonials, case studies, success stories
- **Client Logo**: Displayed on cards
- **Quote Style**: Testimonial text prominently displayed

#### Glossary Tab
- **Two-Level Filtering**:
  - Primary: Knowledge System (GHC, Agile 6xD, General)
  - Secondary: GHC Dimension (for GHC terms) or 6xD Perspective (for 6xD terms)
- **Alphabetical Browsing**: A-Z letter filters
- **Term Cards**: Term, short intro, full explanation, tags
- **Expandable**: Click to see full definition

#### FAQs Tab
- **Category Filter**: By topic/department
- **Accordion Layout**: Expandable Q&A pairs
- **Search**: Searches both questions and answers

### 9. Interactive Features

#### Bookmarking
- Bookmark icon on each card
- Saves to local storage or user profile
- Bookmarked items highlighted
- View bookmarked items filter

#### Comparison Tool
- Add up to 3 items to compare
- Comparison panel slides in from bottom
- Side-by-side comparison table
- Remove items from comparison
- Clear all comparison

#### Item Actions
- **View Details**: Navigate to detail page
- **Download**: Download attachments (if available)
- **Share**: Copy link or share via social
- **Bookmark**: Save for later
- **Add to Comparison**: Compare with others

### 10. Loading & Error States

#### Loading States
- **Initial Load**: Full-page skeleton loader
- **Filter Changes**: Shimmer effect on cards
- **Pagination**: Loading spinner
- **Search**: Debounced with loading indicator

#### Error States
- **No Results**: Empty state with illustration and message
- **API Error**: Error message with retry button
- **Network Error**: Offline indicator
- **Fallback Data**: Use cached/static data when API fails

### 11. Responsive Design

#### Mobile (< 768px)
- Single column layout
- Collapsible filter sidebar (overlay)
- Stacked search and sort controls
- Touch-friendly tap targets (min 44px)
- Swipeable tabs
- Bottom sheet for filters

#### Tablet (768px - 1024px)
- 2-column grid
- Sidebar can be toggled
- Horizontal scrolling tabs if needed

#### Desktop (> 1024px)
- 3-4 column grid
- Fixed sidebar
- All controls visible
- Hover states and tooltips

### 12. Performance Optimizations
- **Lazy Loading**: Images load as they enter viewport
- **Virtual Scrolling**: For very long lists
- **Debounced Search**: 300ms delay
- **Memoized Filters**: Cache filter calculations
- **Code Splitting**: Load tab content on demand
- **CDN Images**: Optimized image delivery

### 13. Accessibility
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant
- **Alt Text**: All images have descriptive alt text
- **Semantic HTML**: Proper heading hierarchy

### 14. URL State Management
- All filters, search, sort, pagination in URL
- Shareable URLs with current state
- Browser back/forward support
- URL updates without page reload
- Clean URL format (no hash routing)

### 15. Visual Design

#### Color Scheme
- Primary: #030F35 (dark blue)
- Accent: #e1513b (coral/red)
- Background: #f9fafb (light gray)
- Card Background: #ffffff (white)
- Border: #e5e7eb (light gray)
- Text Primary: #111827 (dark gray)
- Text Secondary: #6b7280 (medium gray)

#### Typography
- Headings: Inter or similar sans-serif, bold
- Body: Inter or similar sans-serif, regular
- Font Sizes:
  - H1: 30px (mobile) / 36px (desktop)
  - H2: 24px
  - H3: 20px
  - Body: 14px / 16px
  - Small: 12px / 14px

#### Spacing
- Container: max-width 1280px, centered
- Padding: 16px (mobile) / 24px (desktop)
- Card Padding: 16px / 20px
- Gap between cards: 16px / 24px

#### Shadows
- Card: 0 1px 3px rgba(0,0,0,0.1)
- Card Hover: 0 4px 12px rgba(0,0,0,0.15)
- Dropdown: 0 10px 25px rgba(0,0,0,0.1)

#### Borders
- Radius: 8px (cards), 6px (buttons), 4px (inputs)
- Width: 1px
- Color: #e5e7eb

### 16. Data Structure

#### Guide/Item Object
```typescript
interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  heroImageUrl: string;
  lastUpdatedAt: string;
  authorName: string;
  authorOrg: string;
  isEditorsPick: boolean;
  downloadCount: number;
  guideType: string;
  domain: string;
  subDomain: string;
  unit: string;
  location: string;
  status: 'Draft' | 'Published' | 'Approved';
  complexityLevel: string;
  tags: string[];
}
```

#### Filter Config
```typescript
interface FilterConfig {
  id: string;
  title: string;
  options: Array<{
    id: string;
    name: string;
    count?: number;
  }>;
}
```

### 17. API Integration
- **Endpoints**:
  - GET `/api/guides` - Fetch guides with filters
  - GET `/api/guides/:slug` - Get single guide
  - GET `/api/filters` - Get available filter options
  - GET `/api/facets` - Get facet counts
  - POST `/api/guides/:id/download` - Track downloads
  - POST `/api/guides/:id/bookmark` - Bookmark item

- **Query Parameters**:
  - `q` - Search query
  - `tab` - Active tab
  - `domain` - Domain filter
  - `guide_type` - Guide type filter
  - `unit` - Unit filter
  - `location` - Location filter
  - `status` - Status filter
  - `sort` - Sort order
  - `page` - Page number
  - `pageSize` - Items per page

### 18. Special Behaviors

#### Tab Switching
- Clear incompatible filters when switching tabs
- Preserve compatible filters (unit, location)
- Reset to page 1
- Update URL
- Smooth transition animation

#### Filter Interactions
- OR logic within same filter category
- AND logic across different categories
- Real-time results update
- Maintain scroll position
- Show "No results" if filters too restrictive

#### Search Behavior
- Searches across multiple fields
- Case-insensitive
- Partial matching
- Highlights in results (optional)
- Clear search button (X icon)

## Implementation Notes

### Technology Stack Recommendations
- **Frontend**: React/Next.js with TypeScript
- **State Management**: React Query + URL state
- **Styling**: Tailwind CSS
- **Icons**: Lucide React or Heroicons
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Image Optimization**: Next/Image or similar

### Key Components to Build
1. `MarketplacePage` - Main container
2. `TabNavigation` - Tab switcher
3. `FilterSidebar` - Filter panel
4. `SearchBar` - Search input
5. `SortDropdown` - Sort selector
6. `GuideGrid` - Card grid layout
7. `GuideCard` - Individual card
8. `Pagination` - Page controls
9. `EmptyState` - No results view
10. `LoadingState` - Skeleton loader
11. `ErrorState` - Error display
12. `ComparisonPanel` - Compare items
13. `GlossaryGrid` - Glossary layout
14. `FAQAccordion` - FAQ layout
15. `TestimonialCard` - Testimonial display

### State Management Pattern
```typescript
// URL-driven state
const [searchParams, setSearchParams] = useSearchParams();
const activeTab = searchParams.get('tab') || 'guidelines';
const searchQuery = searchParams.get('q') || '';
const filters = parseFiltersFromURL(searchParams);

// Derived state
const filteredItems = useMemo(() => 
  applyFilters(items, filters, searchQuery),
  [items, filters, searchQuery]
);
```

### Performance Tips
- Use React.memo for card components
- Implement virtual scrolling for 500+ items
- Debounce search input (300ms)
- Lazy load images with intersection observer
- Code-split tab-specific components
- Cache API responses with React Query
- Optimize bundle size with tree-shaking

## Summary
This marketplace provides a powerful, user-friendly interface for browsing and discovering knowledge resources. The multi-tab structure, advanced filtering, and responsive design ensure users can quickly find relevant content across different categories. The URL-driven state makes it easy to share specific views, while the rich interactive features (bookmarking, comparison, sorting) enhance the user experience.
