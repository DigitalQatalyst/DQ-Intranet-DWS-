# Service Detail Page Specification

## Overview
A dedicated detail page for service-type guidelines that displays comprehensive service information with the existing design language, keeping visual consistency with the current marketplace UI.

## User Flow
1. User browses Guidelines marketplace (`/marketplace/guides`)
2. User clicks on a **Service** guideline card
3. App navigates to `/marketplace/guides/service/:itemId`
4. Service detail page loads with service information
5. User can click "More Detail" to navigate to full guide document (`/marketplace/guides/:itemId`)

## Architecture Decision
- **ServiceDetailPage** does NOT replace GuideDetailPage.tsx
- **Separate route**: `/marketplace/guides/service/:itemId` for service guidelines
- **Reason**: Regular guides and service guidelines represent different user journeys
- **Benefit**: Clean architecture, no conditional logic, predictable UI

## Page Structure

### 1. Hero Section
- **Background**: Dark gradient (purple to navy) matching the reference design
- **Breadcrumb Navigation**: Home > Services Center > [Service Name]
- **Service Badge**: Category badge (e.g., "TECHNOLOGY SERVICE", "BUSINESS SERVICE")
- **Service Title**: Large, prominent heading
- **Service Description**: 2-3 line summary
- **Service Metadata Tags**:
  - Service Type (Query, Support, Requisition, Self-Service)
  - Delivery Mode (Online, In-person, Hybrid)
  - Department/Provider
  - Location (if applicable)

### 2. Main Content Area

#### Left Column (2/3 width)
**Tab Navigation**:
1. **Service Details** (default)
   - Full service description
   - Service highlights (bullet points with checkmarks)
   - Prerequisites or requirements
   - Expected outcomes

2. **How to Request**
   - Step-by-step request process
   - Required information/documents
   - Request form or submission method
   - Processing timeline

3. **FAQ**
   - Common questions about the service
   - Troubleshooting tips
   - Self-service resources

4. **Contact & SLA**
   - Department contact information
   - Service Level Agreement details
   - Response time expectations
   - Escalation procedures

#### Right Column (1/3 width) - Sticky Sidebar
**Service Summary Card**:
- Service Type
- Delivery Mode
- Response Time
- Department
- Location
- **Primary CTA Button**: "Request Service" (pink/magenta)
- **Secondary Action**: "Save for Later" (outline button)

### 3. Related Services Section
- Grid of 3 related service cards
- "Browse all services" link
- Filtered by same category or department

## Design Specifications

### Colors
- **Hero Background**: `linear-gradient(135deg, #4A1D6E 0%, #1A2B5E 100%)`
- **Primary CTA**: `#E91E63` (pink/magenta)
- **Text on Dark**: `#FFFFFF` with 90% opacity for secondary text
- **Body Background**: `#F9FAFB` (light gray)
- **Card Background**: `#FFFFFF`
- **Border**: `#E5E7EB`
- **Success/Check Icons**: `#10B981` (green)

### Typography
- **Hero Title**: 2.5rem (40px), bold, white
- **Section Headings**: 1.5rem (24px), semibold
- **Body Text**: 1rem (16px), regular
- **Metadata Tags**: 0.875rem (14px), medium

### Spacing
- **Hero Section**: 200px height minimum
- **Content Padding**: 3rem (48px) vertical, 2rem (32px) horizontal
- **Card Padding**: 1.5rem (24px)
- **Section Gaps**: 2rem (32px)

### Components
- **Tabs**: Underline style with active indicator
- **Badges**: Rounded, uppercase, small text
- **Buttons**: Rounded corners (8px), medium size
- **Icons**: Lucide React icons, 18-20px size

## Data Structure

```typescript
interface ServiceDetail {
  id: string
  title: string
  description: string
  category: 'technology' | 'business' | 'digital_worker' | 'prompt_library' | 'ai_tools'
  serviceType: 'query' | 'support' | 'requisition' | 'self-service'
  deliveryMode: 'online' | 'inperson' | 'hybrid'
  provider: string // Department name
  location?: string
  responseTime?: string
  slaDetails?: {
    responseTime: string
    resolutionTime: string
    availability: string
  }
  highlights: string[]
  requestProcess: {
    steps: string[]
    requiredInfo: string[]
    submissionMethod: string
  }
  faqs: Array<{
    question: string
    answer: string
  }>
  contactInfo: {
    department: string
    email?: string
    phone?: string
    teams?: string
  }
  relatedServices: string[] // Array of service IDs
}
```

## Routing
- **Route**: `/marketplace/services-center/:serviceId`
- **Component**: `ServiceDetailPage.tsx`
- **Location**: `src/pages/marketplace/ServiceDetailPage.tsx`

## Implementation Files

### New Files to Create
1. `src/pages/marketplace/ServiceDetailPage.tsx` - Main detail page component
2. `src/components/services/ServiceHeroSection.tsx` - Hero section component
3. `src/components/services/ServiceSummaryCard.tsx` - Sticky sidebar card
4. `src/components/services/ServiceTabs.tsx` - Tab navigation component
5. `src/components/services/RelatedServicesGrid.tsx` - Related services section

### Files to Modify
1. `src/pages/marketplace/MarketplaceRouter.tsx` - Add new route
2. `src/components/Cards/ServiceCard.tsx` - Add click handler to navigate to detail page

## Responsive Behavior
- **Desktop (>1024px)**: Two-column layout with sticky sidebar
- **Tablet (768px-1024px)**: Two-column layout, sidebar scrolls with content
- **Mobile (<768px)**: Single column, summary card moves to top after hero

## Accessibility
- Proper heading hierarchy (h1 for title, h2 for sections)
- ARIA labels for interactive elements
- Keyboard navigation support for tabs
- Focus indicators on all interactive elements
- Alt text for icons

## Success Criteria
- [ ] Page loads service data from database
- [ ] Hero section displays with correct styling
- [ ] All tabs are functional and display correct content
- [ ] Sidebar is sticky on desktop
- [ ] Related services load and display
- [ ] "Request Service" button triggers appropriate action
- [ ] Page is fully responsive
- [ ] Breadcrumb navigation works correctly
- [ ] Back navigation preserves filter state
