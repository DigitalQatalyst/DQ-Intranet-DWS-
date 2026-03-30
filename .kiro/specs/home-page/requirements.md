# Requirements Document: Home Page

## 1. Overview

The Home Page serves as the primary landing page and digital workspace for the DQ Intranet platform. It provides users with comprehensive access to four major service marketplaces, an AI-powered assistant interface, social proof elements, and clear pathways to engage with platform services.

### 1.1 Purpose & Goals

| Attribute | Value |
|-----------|-------|
| **Primary Purpose** | Serve as the main entry point and navigation hub for the DQ Intranet platform |
| **Target Users** | All DQ associates (authenticated and unauthenticated) |
| **Key Objectives** | Provide quick access to services, showcase platform value, enable AI-assisted navigation |

### 1.2 Key Features

- Full-height hero section with AI prompt interface
- What's Happening at DQ featured content carousel
- Four service marketplace hubs with 17 total service cards
- DWS AI Assistant chat bot (coming soon feature)
- Impact statistics and social proof
- Associate testimonials carousel
- Partner categories and featured sectors
- Authentication-aware personalization
- Responsive design for all devices

## 2. Glossary

| Term | Definition |
|------|------------|
| **System** | The Home Page application |
| **Hero_Section** | The full-height gradient section with AI assistant interface and primary CTA |
| **Featured_Content** | Dynamic carousel showcasing latest news, podcasts, events, and updates from DQ Media Center |
| **Service_Hub** | A categorized collection of related services organized into four main categories |
| **Service_Card** | Individual service item with title, description, icon, status indicator, and navigation |
| **AI_Assistant** | DWS AI Assistant chat bot interface (currently in "Coming Soon" state) |
| **Marketplace** | A collection of services, guides, or resources accessible through the platform |
| **Coming_Soon_Badge** | Visual indicator showing a feature is not yet available |
| **Authentication_Context** | User login state management system |
| **Carousel** | Auto-advancing content display with manual navigation controls |
| **Impact_Stat** | Animated numerical metric displaying platform achievements |
| **Associate_Feedback** | User testimonial or reflection from DQ team members |
| **Partner_Category** | One of four pillars (Governance, Operations, Platforms, Delivery) |
| **Featured_Sector** | Core factory or stream logo displayed in partner carousel |
| **Service_Status** | Active or coming_soon indicator for service availability |

## 3. Service Marketplace Structure

### 3.1 Marketplace Overview

| Marketplace Hub | Service Count | Active Services | Coming Soon |
|----------------|---------------|-----------------|-------------|
| Learning Center & DQ Knowledge Hub | 5 | 3 | 2 |
| Media & Communications Hub | 4 | 3 | 1 |
| Service Requests & Enablement Hub | 4 | 0 | 4 |
| Organization, Roles & People | 4 | 0 | 4 |
| **Total** | **17** | **6** | **11** |

### 3.2 Service Cards by Marketplace

#### Learning Center & DQ Knowledge Hub

| Service | Status | Route |
|---------|--------|-------|
| Learning Center | Active | /marketplace/guides?tab=glossary |
| GHC | Active | /marketplace/guides/dq-ghc |
| DQ Guidelines | Active | /marketplace/guides?tab=guidelines |
| AI Prompt Library | Coming Soon | /marketplace/services-center?tab=prompt_library |
| DevOps Knowledge Center | Coming Soon | /marketplace/guides?tab=blueprints |

#### Media & Communications Hub

| Service | Status | Route |
|---------|--------|-------|
| News & Announcements | Active | /marketplace/opportunities?tab=announcements |
| Podcasts | Active | /marketplace/opportunities?tab=podcasts |
| Blogs | Active | /marketplace/opportunities?tab=insights |
| Events | Coming Soon | /communities/events |

#### Service Requests & Enablement Hub

| Service | Status | Route |
|---------|--------|-------|
| Technology | Coming Soon | /marketplace/services-center?tab=technology |
| Employee Service | Coming Soon | /marketplace/services-center?tab=business |
| AI Tools | Coming Soon | /marketplace/services-center?tab=ai_tools |
| Digital Worker | Coming Soon | /marketplace/services-center?tab=digital_worker |

#### Organization, Roles & People

| Service | Status | Route |
|---------|--------|-------|
| Units | Coming Soon | /marketplace/work-directory?tab=units |
| Task Template | Coming Soon | /activities/projects |
| Planner Template | Coming Soon | /activities/sessions |
| Associates Directory | Coming Soon | /marketplace/work-directory?tab=associates |

## 4. Requirements

### Requirement 1: Hero Section with AI Assistant Interface

**User Story:** As a user visiting the home page, I want to see an engaging hero section with AI assistance, so that I can quickly understand the platform's purpose and get help with my needs.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Components** | HeroSection, AIPromptInterface, SuggestionPills, OnboardingCTA |
| **Dependencies** | Authentication Context, DWS Chat Widget, Search Router |

#### Acceptance Criteria

1. WHEN a user loads the home page, THE System SHALL display a full-height (100vh) gradient hero section with animated text and background image
2. WHEN the hero section loads, THE System SHALL present an AI prompt interface with "AI Ready" indicator and suggestion pills
3. WHEN a user is not authenticated, THE System SHALL display "Start Your Onboarding Journey" CTA that routes to signin with redirect
4. WHEN an authenticated user visits, THE System SHALL display personalized greeting with user's first name in the prompt placeholder
5. WHEN a user clicks a suggestion pill, THE System SHALL populate the AI prompt input field with that suggestion text
6. WHEN a user submits a prompt, THE System SHALL dispatch custom events to the DWS chat widget (dq-hero-sent-to-chat, dws-chat-send-message)
7. WHEN the chat widget is unavailable, THE System SHALL fallback to search routing using getSearchMatches utility
8. WHEN animations are enabled, THE System SHALL animate text appearance, suggestion pill interactions, and gradient overlay pulsing
9. WHEN suggestion pills are displayed, THE System SHALL show them with staggered fade-in animation after 500ms focus delay
10. WHEN the scroll indicator is clicked, THE System SHALL smoothly scroll to the next section

### Requirement 2: DWS AI Assistant Chat Bot (Coming Soon Feature)

**User Story:** As a user, I want to access the DWS AI Assistant chat bot, so that I can get help and guidance through conversational AI.

| Attribute | Value |
|-----------|-------|
| **Priority** | Medium |
| **Status** | Coming Soon (Feature Flag: CHAT_ENABLED = false) |
| **Components** | DWSChatProvider, ChatButton, ComingSoonBadge, ComingSoonTooltip |
| **Dependencies** | DWS Chat Widget |

#### Acceptance Criteria

1. WHEN the chat bot feature flag is disabled (CHAT_ENABLED = false), THE System SHALL display a gray gradient button with lock icon at 60% opacity
2. WHEN the coming soon button is displayed, THE System SHALL show a pulsing "COMING SOON" badge with lock icon in the top-right corner
3. WHEN a user clicks the coming soon button, THE System SHALL display an enhanced tooltip with lock icon, feature name, and encouragement message
4. WHEN the tooltip is displayed, THE System SHALL auto-dismiss it after 3 seconds
5. WHEN the chat bot feature flag is enabled (CHAT_ENABLED = true), THE System SHALL display a blue gradient button with chat bubble icon
6. WHEN the chat bot is enabled and clicked, THE System SHALL open the chat widget interface
7. WHEN the button is displayed, THE System SHALL position it fixed at bottom-right (24px from edges) with z-index 9998
8. WHEN the coming soon state is active, THE System SHALL set cursor to "not-allowed" and disable hover scale effects
9. WHEN the active state is enabled, THE System SHALL apply hover scale 1.1 transition effect
10. WHEN screen readers are used, THE System SHALL provide appropriate ARIA labels indicating the feature status

### Requirement 3: What's Happening at DQ Featured Content

**User Story:** As a user, I want to see the latest news, podcasts, events, and updates from DQ, so that I can stay informed about what's happening in the organization.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Components** | FeaturedNationalProgram |
| **Dependencies** | Media Center Service, News API |

#### Acceptance Criteria

1. WHEN the featured content section loads, THE System SHALL display "What's Happening at DQ" title with descriptive subtitle
2. WHEN featured items are loaded, THE System SHALL fetch latest content from DQ Media Center (news, podcasts, events)
3. WHEN content is displayed, THE System SHALL show a carousel with up to 6 featured items (2 news, 2 events, 2 podcasts)
4. WHEN each featured item is rendered, THE System SHALL display partnership badge, title with type prefix (Update/Podcast/Blog), description, and background image
5. WHEN a featured item has a background image, THE System SHALL apply gradient overlay (coral to navy to dark blue) over the image
6. WHEN no background image is available, THE System SHALL use default honeycomb pattern with gradient overlay
7. WHEN the carousel is active, THE System SHALL auto-advance to next item every 5 seconds
8. WHEN navigation dots are displayed, THE System SHALL highlight active item and allow direct navigation by clicking dots
9. WHEN "View Details" button is clicked, THE System SHALL navigate to /marketplace/news/{itemId} for the featured item
10. WHEN API fails to load content, THE System SHALL display fallback content promoting Digital Workspace onboarding

#### Content Loading Rules

| Content Type | Filter Logic | Count | Title Prefix |
|--------------|--------------|-------|--------------|
| News | Exclude podcasts and events | 2 latest | "Update \|" |
| Events | newsType = "Upcoming Events" or tags contain "event" | 2 latest | "Update \|" |
| Podcasts | format = "Podcast" or tags contain "podcast" | 2 latest | "Podcast \|" |
| Blogs | type = "Thought Leadership" and not podcast | - | "Blog \|" |

### Requirement 4: Services & Marketplaces Section

**User Story:** As a user, I want to browse available services organized by category, so that I can find and access the services I need.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Components** | Home (Services), ServiceCarousel, ServiceCard, CategoryHeader |
| **Dependencies** | MarketplaceRouter, React Router |

#### Acceptance Criteria

1. WHEN the services section loads, THE System SHALL display a section title "Services & Marketplaces" with descriptive subtitle
2. WHEN service hubs are displayed, THE System SHALL show four main categories with their respective service cards
3. WHEN each category is displayed, THE System SHALL show a category header with icon, title, and animated counter
4. WHEN service cards are rendered, THE System SHALL display title, description, icon, and status-appropriate CTA button
5. WHEN a service is active (isActive: true), THE System SHALL display "Explore Now" button with hover effects and enable navigation
6. WHEN a service is coming soon (isActive: false), THE System SHALL display gray card with "Coming Soon" badge, lock icon, and disabled state
7. WHEN a user clicks an active service card, THE System SHALL navigate to the service's designated path
8. WHEN a user clicks a coming soon service card, THE System SHALL prevent navigation and maintain disabled state
9. WHEN service cards are displayed on mobile, THE System SHALL use ServiceCarousel component for horizontal scrolling
10. WHEN animations are enabled, THE System SHALL apply staggered fade-in-up animations to service cards

### Requirement 5: Proof and Trust Section with Impact Statistics

**User Story:** As a user, I want to see platform impact metrics and DQ advantages, so that I can understand the value and credibility of the platform.

| Attribute | Value |
|-----------|-------|
| **Priority** | Medium |
| **Components** | ProofAndTrust, ImpactStatsGrid |
| **Dependencies** | Animation utilities |

#### Acceptance Criteria

1. WHEN the proof section loads, THE System SHALL display "The DQ Agile Advantage" section with descriptive subtitle
2. WHEN impact statistics are displayed, THE System SHALL show 4 animated counter cards in a responsive grid
3. WHEN each impact stat is rendered, THE System SHALL display icon, animated counter value with prefix/suffix, and descriptive label
4. WHEN impact stats enter viewport, THE System SHALL trigger animated counter from 0 to target value
5. WHEN animations are enabled, THE System SHALL apply staggered fade-in animations with 0.15s delay between cards
6. WHEN cards are displayed, THE System SHALL use light gray background (#F6F7F9) with coral accent icons
7. WHEN cards are hovered, THE System SHALL apply shadow-md transition effect
8. WHEN on mobile devices, THE System SHALL stack cards vertically in single column layout

### Requirement 6: Associate Feedback Carousel

**User Story:** As a user, I want to see testimonials from DQ team members, so that I can understand how DQ values impact associates.

| Attribute | Value |
|-----------|-------|
| **Priority** | Medium |
| **Components** | AssociateFeedbackCarousel |
| **Dependencies** | Carousel utilities |

#### Acceptance Criteria

1. WHEN the feedback section loads, THE System SHALL display "What Our Team Says" section with descriptive subtitle
2. WHEN associate feedback is displayed, THE System SHALL show a carousel with 4 testimonial cards
3. WHEN each feedback card is rendered, THE System SHALL display large quote mark, feedback text, author initials avatar, name, and role
4. WHEN the carousel is active, THE System SHALL auto-advance to next testimonial every 5 seconds
5. WHEN a user hovers over the carousel, THE System SHALL pause auto-advancement
6. WHEN a user uses touch gestures, THE System SHALL support swipe left/right navigation with 40px threshold
7. WHEN navigation arrows are clicked, THE System SHALL smoothly scroll to previous/next testimonial
8. WHEN navigation dots are displayed, THE System SHALL highlight active testimonial and allow direct navigation
9. WHEN feedback cards are displayed, THE System SHALL use gradient background (gray-50 to gray-100) with coral accent
10. WHEN on mobile devices, THE System SHALL show one testimonial at a time in full-width layout

### Requirement 7: Partner Categories and Featured Sectors

**User Story:** As a user, I want to see DQ's four pillars of success and featured sectors, so that I can understand the organizational structure and partnerships.

| Attribute | Value |
|-----------|-------|
| **Priority** | Low |
| **Components** | PartnerCategoriesGrid, FeaturedSectorsCarousel |
| **Dependencies** | Carousel utilities, Animation utilities |

#### Acceptance Criteria

1. WHEN the partners section loads, THE System SHALL display "Our Four Pillars of Success" section with descriptive subtitle
2. WHEN partner categories are displayed, THE System SHALL show 4 cards representing Governance, Operations, Platforms, and Delivery
3. WHEN each category card is rendered, THE System SHALL display icon, title, subtitle, and animated metric counter
4. WHEN category cards enter viewport, THE System SHALL trigger animated counter from 0 to target value
5. WHEN a user hovers over a category card, THE System SHALL apply scale 1.02 transform and shadow-md effect
6. WHEN the featured sectors carousel loads, THE System SHALL display "Featured Sectors" section with subtitle
7. WHEN sector logos are displayed, THE System SHALL show them in grayscale at 70% opacity by default
8. WHEN a user hovers over a sector logo, THE System SHALL remove grayscale filter, set opacity to 100%, and scale to 110%
9. WHEN the carousel is active, THE System SHALL auto-scroll logos every 5 seconds
10. WHEN navigation arrows are clicked, THE System SHALL scroll carousel by 300px in the specified direction

### Requirement 8: Responsive Design and Accessibility

**User Story:** As a user on any device, I want the home page to be accessible and responsive, so that I can use it effectively regardless of my device or abilities.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Standards** | WCAG 2.1 AA |
| **Breakpoints** | Mobile (<640px), Tablet (640-1024px), Desktop (>1024px) |

#### Acceptance Criteria

1. WHEN the page loads on mobile devices (<640px), THE System SHALL adapt all components for touch interaction and single-column layout
2. WHEN the page loads on tablet devices (640px-1024px), THE System SHALL display 2-column grid layouts for service cards
3. WHEN the page loads on desktop devices (>1024px), THE System SHALL display 4-column grid layouts for service cards
4. WHEN carousels are displayed on mobile, THE System SHALL provide touch-friendly swipe navigation
5. WHEN using keyboard navigation, THE System SHALL provide proper focus management and tab order through all interactive elements
6. WHEN screen readers are used, THE System SHALL provide appropriate ARIA labels for all interactive elements and status indicators
7. WHEN animations are reduced in user preferences (prefers-reduced-motion), THE System SHALL disable all animations and transitions
8. WHEN high contrast mode is enabled, THE System SHALL maintain readability and contrast ratios above WCAG AA standards
9. WHEN text is zoomed to 200%, THE System SHALL maintain layout integrity and prevent horizontal scrolling
10. WHEN interactive elements are focused, THE System SHALL display visible focus indicators with appropriate contrast

### Requirement 9: Performance and Loading States

**User Story:** As a user, I want the home page to load quickly and show appropriate loading states, so that I have a smooth experience.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Performance Targets** | LCP <2.5s, FID <100ms, CLS <0.1 |

#### Acceptance Criteria

1. WHEN the page initially loads, THE System SHALL display a full-screen loading overlay with spinner and descriptive text
2. WHEN the loading overlay is displayed, THE System SHALL show "Loading Digital Workspace" message with subtitle
3. WHEN the page finishes loading, THE System SHALL dismiss the loading overlay after 100ms delay
4. WHEN images are loaded, THE System SHALL implement lazy loading for below-the-fold content
5. WHEN animations are triggered, THE System SHALL use CSS transforms and opacity for optimal performance
6. WHEN the page renders, THE System SHALL prioritize above-the-fold content (hero section) for initial paint
7. WHEN external resources fail to load, THE System SHALL gracefully degrade without breaking page layout

### Requirement 10: Navigation and Routing Integration

**User Story:** As a user, I want seamless navigation between home page and marketplace sections, so that I can easily access different services.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Dependencies** | React Router, MarketplaceRouter |

#### Acceptance Criteria

1. WHEN a user clicks an active service card, THE System SHALL navigate to the correct marketplace path using React Router
2. WHEN navigating to Learning Center, THE System SHALL route to /marketplace/guides with appropriate tab parameter
3. WHEN navigating to Media Hub services, THE System SHALL route to /marketplace/opportunities with appropriate tab parameter
4. WHEN navigating to Service Enablement Hub, THE System SHALL route to /marketplace/services-center with appropriate tab parameter
5. WHEN navigating to Organization services, THE System SHALL route to /marketplace/work-directory or /activities paths
6. WHEN the onboarding CTA is clicked while unauthenticated, THE System SHALL route to /signin with redirect parameter to /onboarding/welcome
7. WHEN the onboarding CTA is clicked while authenticated, THE System SHALL route directly to /onboarding/welcome
8. WHEN navigation occurs, THE System SHALL maintain browser history for back button functionality
9. WHEN deep links are accessed, THE System SHALL properly route to the requested marketplace section

### Requirement 11: Authentication State Management

**User Story:** As a user, I want the home page to adapt based on my authentication status, so that I see relevant content and actions.

| Attribute | Value |
|-----------|-------|
| **Priority** | High |
| **Dependencies** | Authentication Context, User Service |

#### Acceptance Criteria

1. WHEN an unauthenticated user visits, THE System SHALL display generic prompt placeholder "What can we help you find today?"
2. WHEN an authenticated user visits, THE System SHALL display personalized prompt placeholder with user's first name
3. WHEN an unauthenticated user clicks the hero CTA, THE System SHALL route to signin page with redirect parameter
4. WHEN an authenticated user clicks the hero CTA, THE System SHALL route directly to onboarding welcome page
5. WHEN user authentication state changes during session, THE System SHALL update relevant UI elements without full page reload
6. WHEN authentication context is unavailable, THE System SHALL treat user as unauthenticated and show appropriate UI
7. WHEN user data is loaded, THE System SHALL access user.firstName property for personalization

## 5. Technical Notes

### 5.1 Feature Flags

| Flag | Current Value | Purpose |
|------|---------------|---------|
| CHAT_ENABLED | false | Controls DWS AI Assistant chat bot availability |

### 5.2 Animation Configuration

| Animation | Duration | Delay | Trigger |
|-----------|----------|-------|---------|
| Hero text fade-in | 1s | 0ms | Page load |
| Suggestion pills | 0.3s | 500ms | After focus |
| Service cards stagger | 0.5s | 0.15s between | Scroll into view |
| Impact stat counters | 2s | 0ms | Scroll into view |
| Carousel auto-advance | - | 5s | Continuous |

### 5.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | <640px | Single column, touch-optimized |
| Tablet | 640px-1024px | 2-column grid |
| Desktop | >1024px | 4-column grid |

## 6. Future Enhancements

- Enable DWS AI Assistant chat bot (set CHAT_ENABLED = true)
- Activate 10 additional service cards currently in "Coming Soon" state
- Add personalized service recommendations based on user role
- Implement service usage analytics and tracking
- Add search functionality within service cards
- Enable service favoriting and quick access
- Add notification system for new services
- Implement A/B testing for hero section variations
