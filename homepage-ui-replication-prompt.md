# DWS Homepage Complete UI & Functionality Guide

This comprehensive guide captures the FULL homepage structure, all sections, functionality, animations, and design patterns. Use this to replicate the exact same UI/UX for new pages.

---

## Complete Homepage Structure

The homepage consists of 8 main sections in this order:
1. **HeroSection** - Full-height hero with AI prompt interface
2. **FeaturedNationalProgram** - Auto-advancing carousel (360px height)
3. **ProofAndTrust** - Impact stats, testimonials, partner categories, featured sectors
4. **EnterpriseStages** - Associate growth journey cards with timeline
5. **Home** - Services & Marketplaces (4 categories with service cards)
6. **KnowledgeHub** - Tabbed content (News/Podcasts) with cards
7. **LeadApplySection** - Final CTA with action cards
8. **Footer** - Standard footer

---

## Design System & Visual Style

### Color Palette
- **Primary Navy**: `#030F35` (DQ Navy - main brand color)
- **Secondary Navy**: `#1A2E6E` (lighter navy for accents)
- **Gradient Backgrounds**: 
  - Hero: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7))` over background image
  - Cards: `linear-gradient(90deg, rgba(3,15,53,0.95) 0%, rgba(3,15,53,0.80) 100%)`
  - CTA Button: `linear-gradient(135deg, #FB5535 0%, #1A2E6E 50%, #030F35 100%)`
- **Text Colors**: White on dark backgrounds, gray-800/gray-900 on light backgrounds
- **Border Colors**: `rgba(255,255,255,0.18)` for card borders on dark backgrounds

### Typography
- **Headings**: Bold, large sizes (text-3xl to text-6xl)
- **Body Text**: text-sm to text-lg, gray-600 for secondary text
- **Font Weight**: Bold for headings (font-bold), medium for buttons (font-medium)

### Spacing & Layout
- **Container**: `container mx-auto px-4` (responsive padding)
- **Section Padding**: `py-16` (vertical spacing between sections)
- **Card Padding**: `p-6` (internal card spacing)
- **Gap Between Cards**: `gap-4` in grid layouts

---

## Layout Structure

### 1. Full-Height Hero Section (100vh)
```typescript
// Hero section with gradient background and overlay
<div className="relative w-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden"
  style={{
    backgroundImage: "linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url('[YOUR_IMAGE_URL]')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  }}>
  
  {/* Animated gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-600/40 mix-blend-multiply"
    style={{ animation: "pulse-gradient 8s ease-in-out infinite alternate" }} />
  
  {/* Content container */}
  <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
    {/* Animated headline */}
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
      Your Digital Workspace for Everything DQ
    </h1>
    
    {/* Subtitle */}
    <p className="text-xl text-white/90 mb-8">
      Access tools, request services, learn, and collaborate all in one place.
    </p>
    
    {/* AI Search Interface (optional) */}
    <div className="w-full max-w-3xl mb-10">
      <div className="bg-white rounded-lg shadow-lg p-3">
        {/* Search input with AI indicator */}
      </div>
    </div>
    
    {/* CTA Button */}
    <button className="px-8 py-3 bg-[linear-gradient(135deg,_#FB5535_0%,_#1A2E6E_50%,_#030F35_100%)] hover:brightness-105 text-white font-bold rounded-lg shadow-lg">
      Start Your Journey
    </button>
  </div>
  
  {/* Scroll indicator */}
  <button className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <ChevronDown size={24} className="text-white" />
  </button>
</div>
```

### 2. Featured Content Carousel (360px height)
```typescript
// Auto-advancing carousel with navigation dots
<div className="bg-white py-12">
  <div className="container mx-auto px-4">
    <div className="relative h-[360px] rounded-2xl overflow-hidden">
      {/* Carousel items with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
        <div className="p-8 text-white">
          <span className="text-sm font-semibold">Partnership Badge</span>
          <h2 className="text-3xl font-bold mt-2">Featured Title</h2>
          <p className="text-lg mt-4">Description text...</p>
          <button className="mt-6 px-6 py-2 bg-white text-navy rounded-lg">
            View Details
          </button>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {/* Dot indicators */}
      </div>
    </div>
  </div>
</div>
```

### 3. Service Cards Grid (Main Content Pattern)
```typescript
// Category section with header and card grid
<div className="bg-white py-16">
  <div className="container mx-auto px-4">
    
    {/* Section Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Services & Marketplaces
      </h2>
      <p className="text-lg text-gray-600">
        Everything you need to get started, work smarter, and unlock real progress
      </p>
    </div>
    
    {/* Category Header with Icon */}
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-dq-navy/10 flex items-center justify-center mr-3">
          <BookOpen size={24} className="text-dq-navy" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Category Name</h2>
      </div>
      <div className="ml-13 text-gray-600">
        <span className="font-semibold">5+</span> services available
      </div>
    </div>
    
    {/* Service Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Individual Service Card */}
      <div className="bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] 
                      border border-[rgba(255,255,255,0.18)] 
                      rounded-2xl p-6 flex flex-col justify-between min-h-[260px] 
                      shadow-sm hover:shadow-md hover:-translate-y-0.5 
                      cursor-pointer transition-all duration-300">
        
        {/* Icon + Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-white/40 
                          shadow-sm flex items-center justify-center">
            <BookOpen size={20} className="text-[#030F35]" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1">Service Title</h2>
        </div>
        
        {/* Description */}
        <p className="text-sm text-white/90 leading-snug mt-3 mb-4 line-clamp-2">
          Service description text that explains what this service offers...
        </p>
        
        {/* CTA Button */}
        <button className="cta-dq">
          Explore Now
          <span className="chev">›</span>
        </button>
      </div>
    </div>
  </div>
</div>
```

### 4. Coming Soon Card Variant
```typescript
// Disabled card with "Coming Soon" badge
<div className="bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] 
                border border-[rgba(255,255,255,0.12)] 
                text-white/50 cursor-not-allowed opacity-70
                rounded-2xl p-6 flex flex-col justify-between min-h-[260px]">
  
  {/* Coming Soon Badge */}
  <div className="absolute top-3 right-3 bg-yellow-400 text-[10px] font-bold 
                  px-2 py-1 rounded-full text-gray-900 flex items-center">
    <Clock size={12} className="mr-1" />
    Coming Soon
  </div>
  
  {/* Same structure as active card but with disabled styling */}
  <button className="bg-white/70 text-gray-600 cursor-not-allowed" disabled>
    <Lock size={14} className="mr-2" /> Coming Soon
  </button>
</div>
```

---

## Key CSS Styles

### DQ CTA Button Style
```css
.cta-dq {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 20px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14.5px;
  color: white;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: saturate(140%) blur(4px);
  transition: all 0.3s ease;
}

.cta-dq:hover {
  color: #1a2e6e;
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}
```

### Animations
```css
@keyframes pulse-gradient {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## All Homepage Sections (Complete)

### Section 2: Featured National Program (What's Happening at DQ)
```typescript
// Auto-advancing carousel showing latest news, blogs, and jobs
// Height: 360px, Auto-advance: 5 seconds
<div className="w-full py-8 px-4">
  <h2 className="text-3xl font-bold text-gray-900 mb-3">
    What's Happening at DQ
  </h2>
  
  <div className="relative rounded-3xl overflow-hidden shadow-xl max-w-[1506px] mx-auto">
    <div className="h-[360px] p-10 flex flex-col justify-between"
         style={{
           backgroundImage: `linear-gradient(to right, rgba(15, 29, 74, 0.45), rgba(15, 29, 74, 0.45)), url(${bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center text-white">
        <h3 className="font-bold mb-4 text-white max-w-3xl" style={{ fontSize: '30px' }}>
          {title}
        </h3>
        <p className="max-w-2xl text-white/90" style={{ fontSize: '18px' }}>
          {description}
        </p>
      </div>
      
      {/* CTA */}
      <a href={learnMoreHref} 
         className="px-6 py-3 bg-white text-[#0F1D4A] font-semibold rounded-lg">
        READ MORE <ArrowRight />
      </a>
    </div>
  </div>
  
  {/* Navigation dots */}
  <div className="flex justify-center gap-2 mt-6">
    {/* Active dot: bg-orange-500 w-8 h-2 */}
    {/* Inactive dot: bg-gray-300 w-2 h-2 */}
  </div>
</div>
```

**Key Features:**
- Fetches latest content from Media Center API
- Auto-advances every 5 seconds
- Shows news, blogs, and job postings
- Gradient overlay on background images
- Navigation dots for manual control

### Section 3: ProofAndTrust (4 Sub-sections)

#### 3a. Impact Statistics
```typescript
// 3 stat cards in a grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
  <div className="rounded-2xl bg-[#F6F7F9] p-6 md:p-8 text-center min-h-[220px]">
    {/* Icon */}
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full 
                    bg-[#FB5535]/10 text-[#FB5535]">
      <Icon size={20} />
    </div>
    
    {/* Animated Counter */}
    <div className="text-3xl font-bold text-dq-navy mb-1">
      <AnimatedCounter value={500} />+
    </div>
    
    {/* Label */}
    <div className="text-sm text-gray-600">Active Associates</div>
  </div>
</div>
```

#### 3b. Associate Feedback Carousel
```typescript
// Full-width testimonial cards (1030px × 344px)
// Auto-advances every 5 seconds, pauses on hover
<div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
  <div className="max-w-6xl mx-auto">
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8"
         style={{ width: '100%', maxWidth: '1030px', height: '344px' }}>
      
      {/* Large quote mark */}
      <svg width="48" height="48" className="text-coral-500 mb-6">
        {/* Quote SVG path */}
      </svg>
      
      {/* Testimonial text */}
      <p className="text-gray-700 italic font-medium" style={{ fontSize: '17px' }}>
        {feedback}
      </p>
      
      {/* Author info with avatar initials */}
      <div className="flex items-center gap-4 mt-6">
        <div className="w-14 h-14 rounded-full bg-coral-500/40 text-white font-bold">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 3c. Four Pillars (Partner Categories)
```typescript
// 4 cards in grid showing organizational pillars
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="rounded-xl p-6 bg-white shadow-sm hover:shadow-md">
    {/* Icon with color */}
    <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
         style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
      <Icon size={28} />
    </div>
    
    {/* Title & Subtitle */}
    <h3 className="text-lg font-semibold text-gray-900 mb-1">Governance</h3>
    <p className="text-sm text-gray-600 mb-4">Strategic oversight</p>
    
    {/* Animated Counter */}
    <div className="text-3xl font-bold text-indigo-600">
      <AnimatedCounter value={25} />+
    </div>
  </div>
</div>
```

#### 3d. Featured Sectors Carousel
```typescript
// Auto-scrolling logo carousel
<div className="relative py-8">
  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
    Featured Sectors
  </h3>
  
  <div className="flex overflow-x-auto scrollbar-hide gap-8">
    {/* Logos with grayscale filter, color on hover */}
    <img src={logo} 
         className="h-16 md:h-20 object-contain"
         style={{ 
           filter: 'grayscale(100%)', 
           opacity: 0.7,
           transition: 'all 0.5s'
         }} />
  </div>
  
  {/* Navigation arrows */}
</div>
```

### Section 4: EnterpriseStages (Associate Growth Journey)

```typescript
// Journey cards with progress timeline
<div className="bg-gray-50 pt-10 pb-16">
  {/* Progress Timeline (desktop only) */}
  <div className="hidden lg:block mb-12">
    <div className="relative h-2 w-full rounded-full bg-dq-navy/20 max-w-[1100px] mx-auto">
      {/* Animated progress bar */}
      <div className="absolute h-2 rounded-full bg-[image:var(--dq-cta-gradient)]"
           style={{ width: `${progress}%` }} />
      
      {/* Stage dots */}
      <div className="absolute w-6 h-6 rounded-full bg-dq-coral border-2 border-white" />
    </div>
  </div>
  
  {/* Stage Cards Grid */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white rounded-2xl border p-6 h-[339px] w-full max-w-[485px]">
      {/* Header with icon, title, and stage number */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <Icon size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-800">Starting</h3>
        <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-semibold">
          1
        </div>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">Description...</p>
      
      {/* Key Benefits */}
      <div className="mb-6">
        <h4 className="text-sm font-bold mb-2">Key Benefits:</h4>
        <ul className="text-sm space-y-1.5">
          <li>• Benefit 1</li>
          <li>• Benefit 2</li>
        </ul>
      </div>
      
      {/* CTA Button */}
      <button className="w-full rounded-lg bg-[#131E42] text-white py-2.5 px-4">
        Learn More <ArrowRight />
      </button>
    </div>
  </div>
</div>
```

**Key Features:**
- 8 journey stages (Starting, Follow, Assist, Apply, Enable, Ensure, Influence, Inspire)
- Animated progress timeline on desktop
- Pagination for mobile/tablet
- Modal opens on card click with detailed stage info
- Cards are 339px height × 485px max width

### Section 6: KnowledgeHub (Tabbed Content)

```typescript
// Segmented tabs with News and Podcast sections
<div className="bg-gray-50 py-16">
  {/* Segmented Tabs */}
  <div className="inline-flex rounded-full bg-white shadow-sm ring-1 ring-black/5 px-1 py-1">
    <button className={`px-5 py-2 rounded-full text-sm font-medium ${
      isActive ? 'bg-[#DDE8FF] text-[#030F35] shadow-[inset_0_-2px_0_0_#5B8EFF]' 
                : 'text-[#3b4a66] hover:bg-[#F5F8FF]'
    }`}>
      <Newspaper size={16} /> News
    </button>
  </div>
  
  {/* News Tab Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* NewsCard components */}
  </div>
  
  {/* Podcast Tab Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* PodcastCard components */}
  </div>
</div>
```

**Key Features:**
- Fetches latest news, blogs, podcasts from Media Center API
- Segmented tab control with smooth transitions
- Shows top 6 items per tab
- Graceful fallback to cached content if API fails
- Loading and error states

### Section 7: LeadApplySection (Final CTA)

```typescript
// Gradient background with floating shapes and action cards
<section className="relative overflow-hidden 
                    bg-[linear-gradient(135deg,#FB5535_0%,#1A2E6E_50%,#030F35_100%)] 
                    py-20 text-white">
  
  {/* Floating animated shapes */}
  <div className="absolute inset-0">
    <div className="absolute rounded-full animate-float"
         style={{ 
           width: '120px', 
           height: '120px',
           background: 'rgba(3,15,53,0.15)',
           animationDuration: '15s'
         }} />
  </div>
  
  {/* Content */}
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
    Ready to Move Work Forward?
  </h2>
  
  {/* Action Cards */}
  <div className="flex flex-wrap justify-center gap-6">
    <article className="bg-white rounded-2xl p-6 w-[320px] h-[350px] text-left">
      {/* Icon */}
      <div className="inline-flex rounded-full bg-[#FB5535]/10 p-3 mb-3">
        <Icon size={28} className="text-[#FB5535]" />
      </div>
      
      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-[#030F35] mb-3 text-center">
        Start Onboarding
      </h3>
      <p className="text-gray-600 text-center">Description...</p>
      
      {/* CTA Button */}
      <button className="mt-6 rounded-md px-5 py-2.5 font-semibold 
                         bg-[linear-gradient(135deg,#FB5535_0%,#1A2E6E_50%,#030F35_100%)] 
                         text-white shadow-[0_6px_20px_rgba(3,15,53,0.18)]">
        Get Started
      </button>
    </article>
  </div>
</section>
```

**Key Features:**
- Gradient background with animated floating shapes
- 4-5 action cards (320px × 350px)
- Coming soon states with lock icon and badge
- Support modal (currently disabled)
- Cards have gradient CTA buttons

---

## Component Patterns

### Responsive Grid
- **Mobile (<640px)**: 1 column
- **Tablet (640-1024px)**: 2 columns
- **Desktop (>1024px)**: 4 columns

```typescript
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

### Animation Utilities
- Use `FadeInUpOnScroll` for sections that animate on scroll
- Use `StaggeredFadeIn` for sequential animations
- Use `AnimatedCounter` for number animations
- Use `AnimatedText` for word-by-word text reveals

### Icons
- Use Lucide React icons
- Icon size: 20-24px for cards, 32px for hero
- Icon wrapper: circular background with border

---

## Accessibility Features

1. **ARIA Labels**: Add `aria-label` to all interactive elements
2. **Keyboard Navigation**: Ensure all buttons are keyboard accessible
3. **Focus Indicators**: Visible focus states on interactive elements
4. **Alt Text**: Provide descriptive alt text for images
5. **Color Contrast**: Minimum 4.5:1 ratio for text
6. **Reduced Motion**: Respect `prefers-reduced-motion` preference

---

## Implementation Checklist

- [ ] Full-height hero section with gradient overlay
- [ ] Animated headline text
- [ ] Search/prompt interface (optional)
- [ ] CTA button with gradient background
- [ ] Scroll indicator with bounce animation
- [ ] Featured content carousel (if needed)
- [ ] Category headers with icons and counters
- [ ] Service cards grid (4 columns on desktop)
- [ ] Active card state with hover effects
- [ ] Coming soon card variant with badge
- [ ] DQ CTA button styling
- [ ] Responsive breakpoints
- [ ] Animation utilities
- [ ] Accessibility features
- [ ] Loading state overlay

---

## Example Usage

To create a new page with this UI:

1. Copy the hero section structure for your page header
2. Use the service cards grid pattern for your main content
3. Apply the DQ color palette and typography
4. Add the CTA button styling
5. Include animation utilities for scroll effects
6. Ensure responsive grid layouts
7. Test accessibility features

This design system ensures consistency across all DWS pages while maintaining the professional, modern aesthetic of the homepage.


---

## Key Functionality & Interactions

### Auto-Advancing Carousels
- **FeaturedNationalProgram**: 5 second intervals
- **AssociateFeedback**: 5 second intervals, pauses on hover
- **FeaturedSectors**: Auto-scrolls every 5 seconds
- All support manual navigation with arrows and dots

### Loading States
```typescript
// 100ms loading overlay on page load
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 100);
  return () => clearTimeout(timer);
}, []);

if (isLoading) {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 
                    flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent 
                      rounded-full animate-spin" />
      <h2 className="text-white text-xl font-bold">Loading Digital Workspace</h2>
    </div>
  );
}
```

### Animation Utilities (AnimationUtils.tsx)
```typescript
// Fade in and slide up when element enters viewport
<FadeInUpOnScroll delay={0.2}>
  <Component />
</FadeInUpOnScroll>

// Staggered animation for multiple children
<StaggeredFadeIn staggerDelay={0.15}>
  {items.map(item => <Card key={item.id} />)}
</StaggeredFadeIn>

// Animated number counter
<AnimatedCounter value={500} duration={2000} />

// Horizontal scroll reveal
<HorizontalScrollReveal direction="left" distance={50}>
  <Component />
</HorizontalScrollReveal>

// Animated text (word by word)
<AnimatedText text="Your Digital Workspace" gap="1rem" />
```

### Touch Gestures
```typescript
// Swipe navigation for carousels
const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
  const threshold = 40;
  
  if (deltaX > threshold) handlePrev();
  else if (deltaX < -threshold) handleNext();
};
```

### Modal Management
```typescript
// Stage modal with focus trap and keyboard navigation
const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

// Trap focus within modal
useEffect(() => {
  if (!isOpen) return;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      // Focus trap logic
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen]);
```

### Data Fetching
```typescript
// Fetch from Media Center API with fallback
useEffect(() => {
  async function loadData() {
    setIsLoading(true);
    try {
      const [news, jobs] = await Promise.all([
        fetchAllNews(),
        fetchAllJobs()
      ]);
      setData([...news, ...jobs]);
    } catch (error) {
      console.error('API error:', error);
      setData(fallbackData); // Use cached/static data
    } finally {
      setIsLoading(false);
    }
  }
  loadData();
}, []);
```

---

## Responsive Breakpoints

### Grid Layouts
```css
/* Service Cards */
grid-cols-1              /* Mobile: <640px */
sm:grid-cols-2           /* Tablet: 640-1024px */
lg:grid-cols-4           /* Desktop: >1024px */

/* Stage Cards */
grid-cols-1              /* Mobile */
md:grid-cols-2           /* Tablet: 768px+ */
lg:grid-cols-3           /* Desktop: 1024px+ */

/* News/Podcast Cards */
grid-cols-1              /* Mobile */
md:grid-cols-2           /* Tablet */
lg:grid-cols-3           /* Desktop */
```

### Typography Scaling
```css
/* Headings */
text-3xl md:text-4xl lg:text-5xl    /* Main headings */
text-2xl md:text-3xl                /* Section headings */
text-xl md:text-2xl                 /* Card headings */

/* Body Text */
text-base sm:text-lg                /* Descriptions */
text-sm                             /* Card content */
```

### Spacing
```css
/* Section Padding */
py-16                    /* Desktop */
py-12                    /* Tablet */
py-8                     /* Mobile */

/* Container Padding */
px-4                     /* Mobile */
px-6 md:px-12           /* Tablet/Desktop */
```

---

## Complete CSS Animations

```css
/* Gradient pulse for hero overlay */
@keyframes pulse-gradient {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

/* Fade in and slide up */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating shapes */
@keyframes float {
  0% {
    transform: translateY(0) translateX(0) rotate(0);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-30px) translateX(20px) rotate(5deg);
    opacity: 0.6;
  }
  66% {
    transform: translateY(20px) translateX(-15px) rotate(-3deg);
    opacity: 0.4;
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0);
    opacity: 0.3;
  }
}

/* Bounce animation */
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Scale in */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Ripple effect */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
```

---

## Implementation Checklist (Complete)

### Structure
- [ ] Full-height hero section (100vh) with gradient overlay
- [ ] Featured carousel (360px height, auto-advance 5s)
- [ ] Impact statistics grid (3 cards)
- [ ] Associate feedback carousel (1030×344px cards)
- [ ] Four pillars grid (4 cards)
- [ ] Featured sectors auto-scrolling carousel
- [ ] Journey stages with progress timeline (8 stages)
- [ ] Services grid (4 categories, 17 total cards)
- [ ] Tabbed knowledge hub (News/Podcasts)
- [ ] Final CTA section with action cards
- [ ] Loading overlay (100ms delay)

### Functionality
- [ ] Auto-advancing carousels (5s intervals)
- [ ] Pause on hover for carousels
- [ ] Touch swipe gestures (40px threshold)
- [ ] Navigation dots and arrows
- [ ] Modal with focus trap
- [ ] Keyboard navigation (Tab, Escape, Enter)
- [ ] API data fetching with fallback
- [ ] Loading and error states
- [ ] Animated counters on scroll
- [ ] Progress timeline animation

### Animations
- [ ] FadeInUpOnScroll for sections
- [ ] StaggeredFadeIn for card grids
- [ ] AnimatedCounter for statistics
- [ ] HorizontalScrollReveal for content
- [ ] AnimatedText for hero headline
- [ ] Floating shapes animation
- [ ] Gradient pulse animation
- [ ] Hover effects on cards
- [ ] Button ripple effects

### Responsive Design
- [ ] Mobile: 1 column layouts
- [ ] Tablet: 2 column layouts
- [ ] Desktop: 3-4 column layouts
- [ ] Typography scaling
- [ ] Touch-friendly targets (44px min)
- [ ] Horizontal scroll on mobile
- [ ] Hide timeline on mobile
- [ ] Pagination for stage cards

### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Screen reader announcements
- [ ] Color contrast 4.5:1 minimum
- [ ] Alt text for images
- [ ] Semantic HTML structure
- [ ] Skip links for navigation
- [ ] Reduced motion support

### Performance
- [ ] Lazy load images
- [ ] Optimize carousel animations
- [ ] Debounce scroll events
- [ ] Memoize expensive calculations
- [ ] Code splitting for modals
- [ ] Preload critical assets
- [ ] 100ms loading delay optimization

---

## Data Sources

### Static Data Files
- `src/data/landingPageContent.ts` - Hero content, impact stats, testimonials, partner categories, featured sectors
- `src/data/dwsStages.ts` - Journey stage definitions
- `src/data/media/news.ts` - News item types
- `src/data/media/jobs.ts` - Job item types

### API Services
- `src/services/mediaCenterService.ts` - Fetches latest news, blogs, podcasts, jobs
  - `fetchAllNews()` - Returns NewsItem[]
  - `fetchAllJobs()` - Returns JobItem[]

### Service Card Configuration
Located in `src/components/Home.tsx`:
- Learning Hub: 5 cards (3 active, 2 coming soon)
- Media Hub: 4 cards (3 active, 1 coming soon)
- Service Enablement: 4 cards (0 active, 4 coming soon)
- Org & People: 4 cards (0 active, 4 coming soon)

---

## Summary

This guide captures the COMPLETE homepage including:
- ✅ All 8 sections with full code examples
- ✅ Every component pattern and variant
- ✅ All animations and transitions
- ✅ Complete functionality (carousels, modals, gestures)
- ✅ Responsive breakpoints and layouts
- ✅ Accessibility features
- ✅ Data fetching with fallbacks
- ✅ Loading and error states
- ✅ Touch interactions
- ✅ Keyboard navigation

Use this as your complete reference to build pages with the exact same look, feel, and functionality as the DWS homepage.
