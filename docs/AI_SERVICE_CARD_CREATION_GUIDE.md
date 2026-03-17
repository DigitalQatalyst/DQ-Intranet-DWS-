# AI Service Card & Detail Page Creation Guide

> **Reference Guide for Creating AI Tool Service Cards in DQ Intranet Service Center**

This document provides a comprehensive guide for creating new AI service cards and their detail pages in the DQ Intranet Service Center. Use the existing Cursor AI and Lovable AI implementations as templates.

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Data Structure](#data-structure)
4. [Step-by-Step Creation Process](#step-by-step-creation-process)
5. [Service Card Integration](#service-card-integration)
6. [Detail Page Tabs](#detail-page-tabs)
7. [Styling Guidelines](#styling-guidelines)
8. [Examples](#examples)
9. [Best Practices](#best-practices)
10. [Testing Checklist](#testing-checklist)

---

## Overview

AI service cards are specialized service offerings in the Service Center marketplace that provide access to AI-powered tools. They feature:

- **Service Card**: Grid display in the marketplace
- **Detail Page**: Comprehensive information with custom tabs
- **Access Request**: Integration with Microsoft Forms for requisitions
- **Rich Content**: Features, system requirements, licenses, and more

### Key Characteristics

- **Category**: Always `"AI Tools"`
- **Service Type**: `"Requisition"`
- **Access Type**: `"request_access"`
- **Pricing**: Typically `"paid"` or `"Licensed"`

---

## File Structure

### Core Files to Edit

```
DQ-Intranet-DWS-/
├── src/
│   ├── utils/
│   │   ├── aiToolsData.ts              # AI-specific detailed data
│   │   ├── mockMarketplaceData.ts      # Service card data
│   │   └── serviceDetailsContent.ts    # Tab content configuration (if needed)
│   ├── pages/
│   │   └── marketplace/
│   │       └── MarketplaceDetailsPage.tsx  # Detail page component
│   └── components/
│       └── marketplace/
│           ├── ServiceCard.tsx         # Card component
│           └── ServiceGrid.tsx         # Grid layout
└── public/
    └── images/
        └── services/
            ├── cursor-ai.jpg           # Service images
            └── lovable-ai.jpg
```

---

## Data Structure

### 1. AI Tools Data (`src/utils/aiToolsData.ts`)

This file contains the comprehensive data structure for AI tools, providing detailed information for the detail pages.

#### AIToolData Interface

```typescript
export interface AIToolData {
  id: string;                    // Must match service ID in mockMarketplaceData
  name: string;                  // Full tool name
  shortName: string;             // Short/display name
  description: string;           // Brief description
  category: string;              // Should be 'AI Tools'
  homepage: string;              // Official tool website
  
  license: {
    subscriptionStatus: 'Active' | 'Inactive' | 'Pending';
    expiryDate: string;          // 'N/A' for no expiry, or ISO date
    licenseType?: string;        // e.g., 'Business Pro Plan'
    totalSeats?: number;         // Number of licenses
    renewalDate?: string;        // e.g., 'December 2025'
  };
  
  features: {
    keyFeatures: string[];       // 6 main features (bullet points)
    highlights: string[];        // 6 detailed feature descriptions
  };
  
  systemRequirements: {
    minimum: {
      os: string;
      processor: string;
      ram: string;
      storage: string;
      display: string;
      internet: string;
      browser?: string;          // Optional
    };
    recommended: {
      processor: string;
      ram: string;
      storage: string;
      display: string;
      internet: string;
      os?: string;               // Optional
      browser?: string;          // Optional
    };
    additionalNotes: string[];   // 4-5 additional notes
  };
  
  about: {
    overview: string;            // 2-3 sentence overview
  };
  
  provider: {
    name: string;                // e.g., 'Digital Innovation'
    logoUrl: string;             // Provider logo path
  };
}
```

### 2. Service Card Data (`src/utils/mockMarketplaceData.ts`)

This file contains the basic service information displayed in marketplace cards.

#### Service Item Structure

```typescript
{
  id: string;                    // Unique ID (must match aiToolsData)
  title: string;                 // Service title
  description: string;           // Card description (2-3 sentences)
  category: 'AI Tools';          // Must be 'AI Tools'
  serviceType: 'Requisition';    // Service type
  deliveryMode: 'Online';        // Delivery mode
  businessStage: string;         // Target business stage
  toolCategory: string;          // Tool subcategory
  accessType: 'request_access';  // Access type
  pricing: string;               // 'paid' or 'Licensed'
  
  provider: {
    name: string;
    logoUrl: string;
    description: string;         // Provider description
  };
  
  duration: string;              // e.g., '1-2 business days'
  price: string;                 // Display price
  details: string[];             // 6-8 bullet points
  tags: string[];                // Display tags
  featuredImageUrl: string;      // Card image path
  requestUrl: string;            // Microsoft Form URL
  homepageUrl: string;           // Tool homepage URL
}
```

---

## Step-by-Step Creation Process

### Step 1: Prepare Assets

1. **Gather Information**
   - Tool name and description
   - Official website URL
   - License details
   - Features list
   - System requirements
   - Microsoft Form URL for access requests

2. **Prepare Images**
   - Service card image (recommended: 1200x600px)
   - Provider logo (if different from existing)
   - Save to `/public/images/services/[tool-name].jpg`

### Step 2: Add to AI Tools Data

Open `src/utils/aiToolsData.ts` and add a new entry:

```typescript
export const AI_TOOLS_DATA: Record<string, AIToolData> = {
  'cursor-ai': { /* existing */ },
  'lovable-ai': { /* existing */ },
  
  // Add your new tool here
  'your-tool-key': {
    id: '12',  // Use next available ID
    name: 'Your Tool Name',
    shortName: 'Short Name',
    description: 'Brief description for cards',
    category: 'AI Tools',
    homepage: 'https://yourtool.com',
    
    license: {
      subscriptionStatus: 'Active',
      expiryDate: 'N/A',
      licenseType: 'Plan Type',
      totalSeats: 25,
      renewalDate: 'Month Year',
    },
    
    features: {
      keyFeatures: [
        'Feature 1',
        'Feature 2',
        'Feature 3',
        'Feature 4',
        'Feature 5',
        'Feature 6',
      ],
      highlights: [
        'Detailed explanation of feature 1',
        'Detailed explanation of feature 2',
        'Detailed explanation of feature 3',
        'Detailed explanation of feature 4',
        'Detailed explanation of feature 5',
        'Detailed explanation of feature 6',
      ],
    },
    
    systemRequirements: {
      minimum: {
        os: 'Windows 10+, macOS 10.15+, Linux',
        processor: 'Intel Core i3 or equivalent (2.0 GHz+)',
        ram: '4 GB minimum',
        storage: '500 MB available space',
        display: '1280 x 720 resolution minimum',
        internet: 'Stable broadband (5+ Mbps)',
        browser: 'Modern browser (optional)',
      },
      recommended: {
        os: 'Latest Windows, macOS, or Linux',
        processor: 'Intel Core i5/i7 or AMD Ryzen 5/7 (2.5 GHz+)',
        ram: '16 GB or more',
        storage: 'SSD with 1 GB+ free space',
        display: '1920 x 1080 or higher',
        internet: 'High-speed broadband (10+ Mbps)',
        browser: 'Latest Chrome recommended',
      },
      additionalNotes: [
        'Note 1 about requirements or features',
        'Note 2 about requirements or features',
        'Note 3 about requirements or features',
        'Note 4 about requirements or features',
      ],
    },
    
    about: {
      overview: 'Comprehensive overview paragraph describing the tool, its purpose, and key capabilities. Keep it to 2-3 sentences that provide context and value proposition.',
    },
    
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
    },
  },
};
```

### Step 3: Add to Service Marketplace Data

Open `src/utils/mockMarketplaceData.ts` and add to `mockNonFinancialServices`:

```typescript
export const mockNonFinancialServices = [
  // ... existing services
  
  {
    id: '12',  // Must match aiToolsData ID
    title: 'Your Tool Name',
    description:
      'Request access to Your Tool Name, [description of what it does]. Perfect for [use cases]. Submit your requisition to start using this powerful tool.',
    category: 'AI Tools',
    serviceType: 'Requisition',
    deliveryMode: 'Online',
    businessStage: 'All Stages',
    toolCategory: 'appropriate_category',  // e.g., 'code_assistants', 'design_tools'
    accessType: 'request_access',
    pricing: 'paid',
    
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/YourTool-Logo.png',
      description:
        'Brief description of the provider and their role in offering this tool.',
    },
    
    duration: '1-2 business days',
    price: 'Licensed',
    
    details: [
      'Request access to tool platform',
      'Key capability 1',
      'Key capability 2',
      'Key capability 3',
      'Key capability 4',
      'Includes onboarding and usage guidelines',
    ],
    
    tags: ['Digital Innovation', 'Online', 'AI Tools'],
    featuredImageUrl: '/images/services/your-tool.jpg',
    requestUrl: 'https://forms.office.com/pages/responsepage.aspx?id=YourFormID',
    homepageUrl: 'https://yourtool.com',
  },
];
```

### Step 4: Add Custom Tabs Configuration

Open `src/utils/serviceDetailsContent.ts` and add tabs configuration in `SERVICE_CUSTOM_TABS`:

```typescript
export const SERVICE_CUSTOM_TABS: Record<string, Record<string, CustomTab[]>> = {
  'non-financial': {
    '10': [ // Cursor AI
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    '11': [ // Lovable AI
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    // Add your new tool here
    '12': [ // Your Tool Name
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
  },
};
```

### Step 5: Update Helper Function Types (Optional)

If you want TypeScript autocompletion, update the helper function in `aiToolsData.ts`:

```typescript
export function getAIToolData(
  toolKey: 'cursor-ai' | 'lovable-ai' | 'your-tool-key'
): AIToolData {
  return AI_TOOLS_DATA[toolKey];
}
```

---

## Service Card Integration

### Card Display

Service cards are automatically rendered in the marketplace grid. The `ServiceCard` component handles:

1. **Display Logic**
   - Image from `featuredImageUrl`
   - Title and description
   - Tags and category badges
   - Provider information

2. **Actions**
   - "View Details" → Navigates to detail page
   - "Request Access" → Opens Microsoft Form in new tab
   - Bookmark toggle
   - Quick view modal

3. **AI Tool Detection**

The card automatically detects AI Tools by category:

```typescript
if (item.category === 'AI Tools') {
  return 'Request Access';
}
```

### Card Appearance

- **Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Hover Effects**: Elevation and subtle animations
- **Category Badge**: Displays "AI Tools" badge
- **Provider Logo**: Shows at bottom of card

---

## Detail Page Tabs

AI Tools get custom tabs on their detail pages:

### Tab Structure

1. **About** (Default)
   - Comprehensive overview
   - Tool capabilities and description
   - Key features grid (6 features)
   - Feature highlights with detailed descriptions
   - Access request CTA

2. **System Requirements**
   - Minimum requirements section (orange left border `#FB5535`)
   - Recommended requirements section (dark blue left border `#030F35`)
   - Additional notes section
   - Clean, minimalistic list design

3. **Licenses**
   - Subscription status card
   - License information (type, status)
   - Renewal dates
   - Total seats available

4. **Visit Site**
   - External link to tool's official homepage
   - Opens in new tab

### Tab Configuration

Tabs are automatically configured for AI Tools in `src/utils/serviceDetailsContent.ts`:

```typescript
// In SERVICE_CUSTOM_TABS configuration
'10': [ // Cursor AI
  { id: 'about', label: 'About' },
  { id: 'system_requirements', label: 'System Requirements' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'visit_site', label: 'Visit Site' },
],
'11': [ // Lovable AI
  { id: 'about', label: 'About' },
  { id: 'system_requirements', label: 'System Requirements' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'visit_site', label: 'Visit Site' },
],
'12': [ // ChatGPT
  { id: 'about', label: 'About' },
  { id: 'system_requirements', label: 'System Requirements' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'visit_site', label: 'Visit Site' },
],
```

**Note**: When adding a new AI tool, you must add its custom tabs configuration in `serviceDetailsContent.ts` using the tool's ID.

---

## Styling Guidelines

### System Requirements Tab

The system requirements use a minimalistic design with colored left borders:

#### Minimum Requirements
- **Left Border**: `#FB5535` (4px solid)
- **Background**: White
- **Border Radius**: Rounded right (`rounded-r-lg`)
- **Shadow**: Subtle shadow (`shadow-sm`)

#### Recommended Requirements
- **Left Border**: `#030F35` (4px solid)
- **Background**: White
- **Border Radius**: Rounded right (`rounded-r-lg`)
- **Shadow**: Subtle shadow (`shadow-sm`)

#### Content Styling
```css
/* Section Headers */
font-size: 1.125rem (18px)
font-weight: 600 (semibold)
color: #111827 (gray-900)
margin-bottom: 0.75rem

/* Labels (Left Column) */
font-size: 0.75rem (12px)
font-weight: 600 (semibold)
text-transform: uppercase
color: #6B7280 (gray-500)
width: 6rem (fixed width for alignment)

/* Values (Right Column) */
font-size: 0.875rem (14px)
color: #374151 (gray-700)
line-height: normal

/* Spacing */
padding: 1.25rem (20px)
item spacing: 0.625rem (10px)
```

### Feature Cards

```css
/* Grid Layout */
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 1.5rem

/* Feature Item */
background: white
padding: 1.5rem
border-radius: 0.75rem
border: 1px solid #E5E7EB
transition: all 0.2s

/* Hover State */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
border-color: brand-color
```

### License Cards

```css
/* Status Card */
background: gradient (green for active)
border: 2px solid
border-radius: 1rem
padding: 1.5rem
position: relative
overflow: hidden
```

---

## Examples

### Example 1: Cursor AI

**Use Case**: AI-powered code editor

**Key Features**:
- Comprehensive system requirements (desktop app)
- Active subscription
- Multiple feature categories
- Developer-focused

**File Locations**:
- Data: `aiToolsData.ts` → `'cursor-ai'`
- Service: `mockMarketplaceData.ts` → ID `'10'`
- Image: `/images/services/cursor-ai.jpg`

### Example 2: Lovable AI

**Use Case**: Low-code AI platform

**Key Features**:
- Cloud-based (no local storage required)
- Browser-based requirements
- Team collaboration features
- Rapid development focus

**File Locations**:
- Data: `aiToolsData.ts` → `'lovable-ai'`
- Service: `mockMarketplaceData.ts` → ID `'11'`
- Image: `/images/services/lovable-ai.jpg`

---

## Best Practices

### Content Writing

1. **Descriptions**
   - Keep card descriptions to 2-3 sentences
   - Focus on benefits and use cases
   - Include call-to-action language

2. **Features**
   - Use active voice
   - Start with action verbs
   - Be specific and measurable
   - Limit to 6 key features

3. **System Requirements**
   - Be precise with version numbers
   - Include both minimum and recommended
   - Add context for technical terms
   - Note any special dependencies

4. **Additional Notes**
   - Include important disclaimers
   - Mention compatibility considerations
   - Highlight best practices
   - Note any limitations

### Technical Guidelines

1. **IDs**
   - Use sequential numeric IDs ('10', '11', '12', etc.)
   - Ensure consistency between `aiToolsData.ts` and `mockMarketplaceData.ts`
   - Use kebab-case for tool keys ('cursor-ai', 'lovable-ai')

2. **Images**
   - Optimize images before upload
   - Use consistent dimensions (1200x600px recommended)
   - Use descriptive filenames
   - Store in `/public/images/services/`

3. **URLs**
   - Always use HTTPS
   - Test all external links
   - Use `target="_blank"` for external links
   - Include `rel="noopener noreferrer"` for security

4. **Data Validation**
   - Ensure all required fields are filled
   - Check for typos and formatting
   - Validate dates and version numbers
   - Test with TypeScript type checking

### Accessibility

1. **Alt Text**
   - Provide descriptive alt text for images
   - Include tool name and context

2. **Color Contrast**
   - Ensure text meets WCAG AA standards
   - Test with color contrast checkers
   - Don't rely solely on color for information

3. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Test tab order
   - Provide focus indicators

---

## Testing Checklist

### Before Deployment

- [ ] Data added to both `aiToolsData.ts` and `mockMarketplaceData.ts`
- [ ] Custom tabs added to `serviceDetailsContent.ts`
- [ ] IDs match between all three files
- [ ] Images uploaded and paths correct
- [ ] All required fields filled
- [ ] Microsoft Form URL tested
- [ ] Homepage URL tested
- [ ] Service card displays correctly in grid
- [ ] Detail page loads without errors
- [ ] All 4 tabs render properly (About, System Requirements, Licenses, Visit Site)
- [ ] "About" tab is the default active tab
- [ ] System requirements formatted correctly with colored borders
- [ ] License information displays with status
- [ ] Features grid renders (6 items)
- [ ] "Visit Site" tab links to correct homepage
- [ ] Mobile responsive design works
- [ ] Bookmark functionality works
- [ ] Quick view modal works
- [ ] "Request Access" button opens form
- [ ] Related services display
- [ ] Browser compatibility checked
- [ ] TypeScript compilation successful
- [ ] No console errors
- [ ] Accessibility checks pass

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Responsive Testing

- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Large screens (> 1440px)

---

## Troubleshooting

### Common Issues

#### Service Card Not Appearing

**Problem**: New service doesn't show in marketplace grid

**Solutions**:
1. Verify category is exactly `'AI Tools'` (case-sensitive)
2. Check if service is in correct array (`mockNonFinancialServices`)
3. Clear browser cache and reload
4. Check browser console for errors

#### Detail Page Shows Error

**Problem**: Clicking service card shows error page

**Solutions**:
1. Verify ID matches between `aiToolsData.ts` and `mockMarketplaceData.ts`
2. Check that `getAIToolDataById()` can find the tool
3. Verify all required fields are present
4. Check browser console for missing data

#### System Requirements Not Styled

**Problem**: System requirements don't show colored borders

**Solutions**:
1. Verify `category === 'AI Tools'`
2. Check that system requirements data exists
3. Verify inline styles are applied correctly
4. Check Tailwind classes are correct

#### Images Not Loading

**Problem**: Service card or detail page images broken

**Solutions**:
1. Verify image exists in `/public/images/services/`
2. Check file path spelling and case
3. Verify image format is supported (jpg, png, svg)
4. Check browser network tab for 404 errors

---

## Quick Reference

### File Checklist

When creating a new AI service card, you need to edit:

1. ✅ `src/utils/aiToolsData.ts` - Add detailed tool data
2. ✅ `src/utils/mockMarketplaceData.ts` - Add service card data
3. ✅ `src/utils/serviceDetailsContent.ts` - Add custom tabs configuration
4. ✅ `public/images/services/` - Add tool image

### Required Fields Summary

**aiToolsData.ts**:
- id, name, shortName, description, category, homepage
- license (status, expiry, type, seats, renewal)
- features (6 keyFeatures, 6 highlights)
- systemRequirements (minimum, recommended, additionalNotes)
- about (overview)
- provider (name, logoUrl)

**mockMarketplaceData.ts**:
- id, title, description, category, serviceType
- deliveryMode, businessStage, toolCategory
- accessType, pricing, provider
- duration, price, details, tags
- featuredImageUrl, requestUrl, homepageUrl

---

## Color Reference

| Element | Color Code | Usage |
|---------|-----------|--------|
| Minimum Requirements Border | `#FB5535` | Left border for minimum specs |
| Recommended Requirements Border | `#030F35` | Left border for recommended specs |
| Active Status | `#10B981` | Active license indicators |
| Pending Status | `#F59E0B` | Pending status indicators |
| Inactive Status | `#EF4444` | Inactive status indicators |

---

## Support & Contact

For questions or assistance with creating AI service cards:

- **Technical Support**: Digital Innovation Team
- **Content Questions**: Service Center Team
- **Access Issues**: IT Service Desk

---

**Last Updated**: November 26, 2025  
**Version**: 1.0.0

