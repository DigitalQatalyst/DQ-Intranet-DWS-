# Prompt Library Service Card Creation Guide

## Overview
This guide details the complete process of creating a new service card for the Prompt Library in the DQ Service Center. Follow these steps to add AI prompts that users can easily copy and use with their AI coding assistants.

---

## Step 1: Add Service Card to Mock Data

**File:** `src/utils/mockMarketplaceData.ts`

Add a new service object to the `mockNonFinancialServices` array:

```typescript
{
  id: '17', // Use next available ID
  title: 'Supabase Full-Stack Development Prompt',
  description: 'Comprehensive development guidelines for building modern full-stack applications with TypeScript, React, Next.js, Expo, Supabase, and related technologies. Includes best practices for code structure, state management, testing, and deployment in monorepo setups.',
  category: 'Prompt Library', // IMPORTANT: Must be 'Prompt Library'
  serviceType: 'Self-Service',
  deliveryMode: 'Online',
  businessStage: 'All Stages',
  promptType: 'dev_prompts', // Options: business, tech, dev_prompts, devops_prompts, ai
  technologies: ['TypeScript', 'React', 'Next.js', 'Expo', 'Supabase', 'Zustand', 'TanStack Query', 'Stripe'],
  provider: {
    name: 'Digital Innovation',
    logoUrl: '/DWS-Logo.png',
    description: 'Digital Innovation team curates and maintains a library of AI prompts and development guidelines to accelerate project delivery and ensure consistent code quality.',
  },
  duration: 'Immediate',
  price: 'Free',
  details: [
    'Complete TypeScript and React development guidelines',
    'Supabase integration best practices',
    'State management with Zustand and TanStack Query',
    'Cross-platform development with Expo and React Native',
    'Stripe payment and subscription model implementation',
    'Monorepo management with Turbo',
    'Testing, performance optimization, and error handling patterns',
  ],
  tags: ['Prompt Library', 'Development', 'Full-Stack', 'TypeScript', 'Supabase'],
  featuredImageUrl: '/images/services/dev-prompt-supabase.jpg',
  sourceUrl: 'https://cursor.directory/rules/supabase', // URL to the original source
}
```

### Key Properties:
- **`category`**: Must be `'Prompt Library'` to trigger special handling
- **`promptType`**: Determines which filter category the prompt appears under:
  - `business` - Business (Admin, HR, Finance, Ops)
  - `tech` - Tech (Hardware, Software)
  - `dev_prompts` - Dev Prompts (Software Development)
  - `devops_prompts` - DevOps Prompts (Deployment)
  - `ai` - AI (Machine Learning)
- **`technologies`**: Array of technologies covered in the prompt
- **`sourceUrl`**: URL to the original source (e.g., cursor.directory, GitHub, documentation)
- **`featuredImageUrl`**: Add corresponding image to `/public/images/services/`

---

## Step 2: Extend Content Block Type (One-time Setup)

**File:** `src/utils/serviceDetailsContent.ts`

The `code` block type has already been added to support prompt display:

```typescript
export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'iframe'; src: string; width?: string; height?: string; title?: string }
  | { type: 'code'; code: string; language?: string; title?: string }; // For prompts
```

---

## Step 3: Create Custom Tab Definition

**File:** `src/utils/serviceDetailsContent.ts`

Add a custom tab entry in the `SERVICE_CUSTOM_TABS` object:

```typescript
export const SERVICE_CUSTOM_TABS: Record<string, Record<string, CustomTab[]>> = {
  'non-financial': {
    '17': [ // Use your service ID
      { id: 'submit_request', label: 'Prompt' }, // Single tab labeled "Prompt"
    ],
    // ... other services
  },
};
```

This replaces the default tabs with a single "Prompt" tab.

---

## Step 4: Add Service Details Content

**File:** `src/utils/serviceDetailsContent.ts`

Add the prompt content to the `SERVICE_DETAILS_CONTENT` object:

```typescript
export const SERVICE_DETAILS_CONTENT: Record<string, Record<string, Record<string, TabContent>>> = {
  'non-financial': {
    '17': { // Use your service ID
      submit_request: {
        heading: 'Supabase Full-Stack Development Prompt',
        blocks: [
          {
            type: 'p',
            text: 'This comprehensive prompt provides expert guidance for building modern full-stack applications with TypeScript, React, Next.js, Expo, and Supabase. Copy and use this prompt with your AI coding assistant to ensure consistent, high-quality code following industry best practices.',
          },
          {
            type: 'code',
            language: 'markdown', // Optional: for syntax highlighting
            title: 'Full-Stack Development Guidelines', // Optional: title above code block
            code: `Your complete prompt text here...
            
This is where you paste the entire prompt.
It can be multiple lines and will be displayed
in a code block with copy functionality.`,
          },
        ],
        // NO action property - this prevents the button below code from appearing
      },
    },
  },
};
```

### Important Notes:
- **Do NOT add an `action` property** - This prevents the redundant button below the code
- Use template literals (backticks) for multi-line code
- The code block automatically gets a copy button in the top-right corner

---

## Step 5: Code Block Rendering (Already Implemented)

**File:** `src/pages/marketplace/MarketplaceDetailsPage.tsx`

The `CodeBlock` component has been implemented to handle the display and copy functionality:

```typescript
const CodeBlock: React.FC<{ code: string; language?: string; title?: string }> = ({ code, language, title }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 relative">
      {title && (
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300">
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        </div>
      )}
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-b-lg overflow-x-auto text-sm leading-relaxed">
          <code className={language ? `language-${language}` : ''}>{code}</code>
        </pre>
        <button onClick={handleCopy} className="...">
          {/* Copy button with icon and feedback */}
        </button>
      </div>
    </div>
  );
};
```

This component provides:
- Dark theme code display
- Copy-to-clipboard button in top-right corner
- Visual feedback ("Copied!") for 2 seconds
- Optional title and syntax highlighting

---

## Step 6: Sidebar & Mobile "Copy Prompt" Buttons (Already Implemented)

**File:** `src/pages/marketplace/MarketplaceDetailsPage.tsx`

The sidebar and mobile sticky buttons automatically detect Prompt Library items and show "Copy Prompt" instead of "Request Service":

```typescript
const isPromptLibrary = item.id === '17' || item.category === 'Prompt Library';
const primaryAction = isPromptLibrary ? 'Copy Prompt' : config.primaryCTA;
```

### Button Features:
- **Button Text**: "Visit Page" with external link icon
- **Functionality**: Opens the source URL in a new tab
- **Styling**: Blue background (#1A2E6E) with hover effect (#152554)
- **Source URL**: Stored in the `sourceUrl` field of the service card

---

## Step 7: External Link Icon (Already Implemented)

**File:** `src/pages/marketplace/MarketplaceDetailsPage.tsx`

The "Visit Page" button uses an external link icon (arrow pointing out):

```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>
```

---

## Complete Example: Creating a New Prompt

Let's say you want to add a "Python Django Best Practices" prompt:

### 1. Add to `mockMarketplaceData.ts`:
```typescript
{
  id: '18',
  title: 'Python Django Best Practices Prompt',
  description: 'Expert guidelines for building scalable Django applications with clean architecture, security best practices, and performance optimization.',
  category: 'Prompt Library',
  serviceType: 'Self-Service',
  deliveryMode: 'Online',
  businessStage: 'All Stages',
  promptType: 'dev_prompts',
  technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
  provider: {
    name: 'Digital Innovation',
    logoUrl: '/DWS-Logo.png',
    description: 'Digital Innovation team curates development prompts.',
  },
  duration: 'Immediate',
  price: 'Free',
  details: [
    'Django project structure and organization',
    'Security best practices and authentication',
    'Database optimization and ORM patterns',
    'Async task processing with Celery',
    'API development with Django REST Framework',
  ],
  tags: ['Prompt Library', 'Python', 'Django', 'Backend'],
  featuredImageUrl: '/images/services/dev-prompt-django.jpg',
  sourceUrl: 'https://example.com/django-prompt-source',
}
```

### 2. Add custom tab in `serviceDetailsContent.ts`:
```typescript
'18': [
  { id: 'submit_request', label: 'Prompt' },
],
```

### 3. Add content in `serviceDetailsContent.ts`:
```typescript
'18': {
  submit_request: {
    heading: 'Python Django Best Practices Prompt',
    blocks: [
      {
        type: 'p',
        text: 'Use this prompt to get expert Django development guidance from your AI assistant.',
      },
      {
        type: 'code',
        language: 'markdown',
        title: 'Django Development Guidelines',
        code: `You are an expert Python Django developer...

[Your complete prompt here]`,
      },
    ],
  },
},
```

---

## Checklist for New Prompts

- [ ] Add service card to `mockMarketplaceData.ts`
  - [ ] Set `category: 'Prompt Library'`
  - [ ] Set appropriate `promptType`
  - [ ] List all relevant `technologies`
  - [ ] Add meaningful `details` array
  - [ ] Add `sourceUrl` linking to the original source
  
- [ ] Add custom tab in `SERVICE_CUSTOM_TABS`
  - [ ] Use service ID as key
  - [ ] Label as "Prompt"
  
- [ ] Add content in `SERVICE_DETAILS_CONTENT`
  - [ ] Include introductory paragraph
  - [ ] Add code block with complete prompt
  - [ ] Do NOT add `action` property
  
- [ ] Add featured image to `/public/images/services/`
  - [ ] Use naming convention: `dev-prompt-[technology].jpg`
  
- [ ] Test the prompt
  - [ ] Verify it appears in correct filter category
  - [ ] Test copy functionality in code block
  - [ ] Test sidebar "Visit Page" button opens source URL
  - [ ] Test on mobile (sticky CTA opens source URL)
  - [ ] Verify source URL opens in new tab

---

## Filter Categories Reference

Ensure your prompt appears in the correct category by setting `promptType`:

| promptType | Display Name | Description |
|------------|--------------|-------------|
| `business` | Business (Admin, HR, Finance, Ops) | Business operations and management |
| `tech` | Tech (Hardware, Software) | General technology and IT |
| `dev_prompts` | Dev Prompts (Software Development) | Software development practices |
| `devops_prompts` | DevOps Prompts (Deployment) | DevOps and deployment automation |
| `ai` | AI (Machine Learning) | Machine learning and AI development |

---

## Copy Functionality & Source Links

Users can interact with prompts through multiple methods:

1. **Code Block Copy Button** (Top-right of code block)
   - Always visible in code block
   - Instant feedback with icon change
   - Green background on copy
   - Copies entire prompt to clipboard

2. **Sidebar "Visit Page" Button** (Desktop)
   - Visible in service details sidebar
   - Opens source URL in new tab
   - Links to original prompt source
   - Blue background with hover effect

3. **Sticky Mobile CTA** (Mobile only)
   - Appears at bottom when scrolling
   - Same "Visit Page" functionality as sidebar
   - Opens source URL in new tab
   - Responsive design

---

## Troubleshooting

### Button Still Shows Below Code
- Check that you removed the `action` property from service content
- Verify `isPromptLibrary` detection is working (check `category: 'Prompt Library'`)

### Prompt Not Appearing in Correct Filter
- Verify `promptType` matches one of the five valid options
- Check spelling and casing (use lowercase with underscores)

### Copy Not Working
- Ensure browser supports `navigator.clipboard` API
- Check that code block has `type: 'code'` and includes `code` property
- Verify the prompt text doesn't have syntax errors in template literal

### Styling Issues
- Check that Tailwind classes are not purged
- Verify CSS animations are present in `MarketplaceDetailsPage.tsx`
- Ensure custom colors are defined in `tailwind.config.js`

---

## Best Practices

1. **Prompt Quality**
   - Write clear, actionable prompts
   - Include specific examples and guidelines
   - Structure prompts with clear sections
   - Test prompts with AI assistants before adding

2. **Descriptions**
   - Write concise service descriptions (2-3 sentences)
   - Highlight key technologies and benefits
   - Use active voice

3. **Tags**
   - Always include 'Prompt Library' as first tag
   - Add 3-5 relevant technology/topic tags
   - Use consistent naming conventions

4. **Images**
   - Use high-quality featured images
   - Maintain consistent aspect ratio (16:9 recommended)
   - Optimize file size for web

5. **Maintenance**
   - Review and update prompts quarterly
   - Keep up with technology updates
   - Gather user feedback on prompt effectiveness

---

## Future Enhancements

Potential improvements to consider:

- [ ] Add prompt versioning system
- [ ] Implement prompt rating/feedback
- [ ] Add usage analytics tracking
- [ ] Create prompt templates for common patterns
- [ ] Add prompt preview before copying
- [ ] Support for multi-file prompts
- [ ] Prompt sharing functionality
- [ ] Integration with popular AI assistants

---

## Support

For questions or issues with the Prompt Library:
- Contact: Digital Innovation Team
- Documentation: This guide
- Reference Implementation: Service ID '17' (Supabase Full-Stack Development Prompt)

---

**Last Updated:** November 25, 2024  
**Version:** 1.0  
**Maintained By:** Digital Innovation Team

