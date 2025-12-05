# Discover DQ – Component & File Structure

## Entry Page / Route

- `src/pages/DiscoverDQ.tsx` – Main page component for `/discover-dq` route
- `src/AppRouter.tsx` – Route definition: `<Route path="/discover-dq" element={<DiscoverDQ />} />`

## Components used by Discover DQ

### Directly imported in DiscoverDQ.tsx

- **HeroDiscoverDQ** – `src/components/Discover/HeroDiscoverDQ.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: Hero section with stats cards and CTAs

- **VisionMission** – `src/components/Discover/VisionMission.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: Vision & Mission cards section

- **DQDNA** – `src/components/Discover/DQDNA.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: Interactive honeycomb DNA visualization with 7 growth dimensions

- **WorkspaceInsights** – `src/components/Discover/WorkspaceInsights.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: Bar chart showing DQ DNA growth potential metrics

- **DQSixDigitalJourney** – `src/components/Discover/DQSixDigitalJourney.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: 6x Digital Architecture cards with modal details

- **DQDirectory** – `src/components/Discover/DQDirectory.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: Directory section with Units/Associates search and filtering

- **MapCard** – `src/components/map/MapCard.tsx`
  - used in: `DiscoverDQ.tsx`
  - purpose: Wrapper component for interactive map with location filtering

### Indirectly used (via other components)

- **DQMap** – `src/components/DQMap.tsx`
  - used in: `MapCard.tsx`
  - purpose: Leaflet-based map component rendering location markers

- **LocationModal** – `src/components/map/LocationModal.tsx`
  - used in: `DQMap.tsx`
  - purpose: Slide-in modal showing location details when marker is clicked

- **MapActionButton** – `src/components/map/MapActionButton.tsx`
  - used in: `LocationModal.tsx`
  - purpose: Action buttons for visiting knowledge center or website

- **DQSixDigitalModal** – `src/components/Discover/DQSixDigitalModal.tsx`
  - used in: `DQSixDigitalJourney.tsx`
  - purpose: Modal dialog showing detailed information for each 6x Digital dimension

- **SectionCTAButton** – `src/components/common/SectionCTAButton.tsx`
  - used in: `DQDNA.tsx`
  - purpose: Reusable CTA button component for section actions

- **DirectoryCard** – `src/components/Directory/DirectoryCard.tsx`
  - used in: `DQDirectory.tsx`
  - purpose: Unified card component for displaying Units in directory

- **DirectoryProfileModal** – `src/components/Directory/DirectoryProfileModal.tsx`
  - used in: `DQDirectory.tsx`
  - purpose: Modal showing unit profile details

- **DirectoryAssociateModal** – `src/components/Directory/DirectoryAssociateModal.tsx`
  - used in: `DQDirectory.tsx`
  - purpose: Modal showing associate profile details

### Shared utilities

- **AnimationUtils** – `src/components/AnimationUtils.tsx`
  - used in: `HeroDiscoverDQ.tsx`, `DQSixDigitalJourney.tsx`
  - purpose: Animation components (AnimatedText, FadeInUpOnScroll, StaggeredFadeIn)

## Data / Config

- **MAPAPI.ts** – `src/api/MAPAPI.ts`
  - Exports: `DQ_LOCATIONS` (array of LocationItem), `LOCATION_FILTERS`, types (`LocationCategory`, `LocationItem`)
  - Used by: `DiscoverDQ.tsx` (for map section filtering), `MapCard.tsx`, `DQMap.tsx`

- **directoryData.ts** – `src/data/directoryData.ts`
  - Exports: `unitsData` (array of Unit objects)
  - Used by: `DQDirectory.tsx`

- **directory.ts** – `src/types/directory.ts`
  - Exports: TypeScript types (`Unit`, `Associate`, `SectorType`, `ViewMode`, etc.)
  - Used by: `DQDirectory.tsx`, `DirectoryCard.tsx`

- **map/constants.ts** – `src/components/map/constants.ts`
  - Exports: `MARKER_COLORS` (color mapping for location types)
  - Used by: `DQMap.tsx`, `LocationModal.tsx`

- **dq.ts** – `src/services/dq.ts`
  - Exports: `fetchDna()` function, types (`DqDnaNode`, `DqDnaCallout`)
  - Used by: `DQDNA.tsx` (optional API fetch, falls back to hardcoded data)

- **locationResolver.ts** – `src/services/locationResolver.ts`
  - Used by: `MAPAPI.ts` (internal location data processing)

- **DiscoverDQ.module.css** – `src/pages/DiscoverDQ.module.css`
  - Used by: `DiscoverDQ.tsx` (CSS module for page-specific styles)

## Notable "candidate" files

### Unused / old components (0 references)

- **D6CardsSection.tsx** – `src/components/Discover/D6CardsSection.tsx`
  - Status: Not imported anywhere
  - Note: Similar functionality to `DQSixDigitalJourney.tsx` but different implementation. Appears to be an alternative/legacy version.

- **DirectorySection.tsx** – `src/components/Discover/DirectorySection.tsx`
  - Status: Not imported anywhere
  - Note: Generic directory section component with different API than `DQDirectory.tsx`. May be intended for reuse elsewhere.

- **DiscoverDQSectionWrapper.tsx** – `src/components/Discover/DiscoverDQSectionWrapper.tsx`
  - Status: Not imported anywhere
  - Note: Simple wrapper component for consistent section styling. Unused utility.

- **DqDnaSection.tsx** – `src/components/Discover/DqDnaSection.tsx`
  - Status: Not imported anywhere
  - Note: Alternative DNA section using card grid layout (vs. honeycomb in `DQDNA.tsx`). Different visual approach.

- **DQSectors.tsx** – `src/components/Discover/DQSectors.tsx`
  - Status: Not imported anywhere
  - Note: Sector cards component showing Governance, Operations, Platform, Delivery. Not used on Discover DQ page.

- **VisionMissionSection.tsx** – `src/components/Discover/VisionMissionSection.tsx`
  - Status: Not imported anywhere
  - Note: Alternative Vision & Mission section component. `VisionMission.tsx` is used instead.

- **NeedHelp.tsx** – `src/components/Discover/NeedHelp.tsx`
  - Status: Not imported anywhere
  - Note: Support/help section component. Not currently used on Discover DQ page.

### Other Discover DQ related files (not on main page)

- **DiscoverDQPage.tsx** – `src/pages/DiscoverDQ/DiscoverDQPage.tsx`
  - Status: Separate page component (different from `DiscoverDQ.tsx`)
  - Note: Appears to be an alternative/older implementation of the Discover DQ page

- **index.tsx** – `src/pages/DiscoverDQ/index.tsx`
  - Status: Likely exports `DiscoverDQPage.tsx`
  - Note: May be an alternative entry point

## Summary

**Active components on `/discover-dq`:**
- HeroDiscoverDQ
- VisionMission
- DQDNA
- WorkspaceInsights
- DQSixDigitalJourney
- DQDirectory
- MapCard (with DQMap, LocationModal, MapActionButton)

**Unused candidate files:**
- 7 components in `src/components/Discover/` with 0 references
- 1 alternative page implementation in `src/pages/DiscoverDQ/`

All unused files appear to be alternative implementations or legacy components that were replaced by the current active components.

