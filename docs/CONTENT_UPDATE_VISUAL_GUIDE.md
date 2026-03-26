# Visual Guide: Content Update Changes

## What Changed?

### Overview Tab (Tab 1)

#### BEFORE:
```
┌─────────────────────────────────────────┐
│ [Title from Database]                   │
│                                         │
│ [Long description from database body]   │
│                                         │
│ Course Highlights                       │
│ ✓ Highlight 1 (hardcoded)              │
│ ✓ Highlight 2 (hardcoded)              │
│ ✓ Highlight 3 (hardcoded)              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔵 What You'll Learn                │ │
│ │ • Learning point 1 (hardcoded)      │ │
│ │ • Learning point 2 (hardcoded)      │ │
│ │ • Learning point 3 (hardcoded)      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│                    [View Details] ───►  │
└─────────────────────────────────────────┘
```

#### AFTER:
```
┌─────────────────────────────────────────┐
│ [Title from GUIDE_CONTENT]              │
│                                         │
│ [shortOverview from GUIDE_CONTENT]      │
│                                         │
│ Course Highlights                       │
│ ✓ [highlights[0] from GUIDE_CONTENT]   │
│ ✓ [highlights[1] from GUIDE_CONTENT]   │
│ ✓ [highlights[2] from GUIDE_CONTENT]   │
│                                         │
│                    [View Details] ───►  │
└─────────────────────────────────────────┘
```

**Key Changes:**
- ❌ Removed: "What You'll Learn" section
- ✅ Added: Content from centralized constants
- ✅ Cleaner, more focused overview

---

### Explore Storybook Tab (Tab 2)

#### BEFORE:
```
┌─────────────────────────────────────────┐
│           📖                            │
│     [Generic Icon]                      │
│                                         │
│  [Generic storybook description]        │
│                                         │
│        [Open Story Book] ───►           │
└─────────────────────────────────────────┘
```

#### AFTER:
```
┌─────────────────────────────────────────┐
│ [storybookIntro from GUIDE_CONTENT]     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔵 What You'll Learn                │ │
│ │ • [whatYouWillLearn[0]]             │ │
│ │ • [whatYouWillLearn[1]]             │ │
│ │ • [whatYouWillLearn[2]]             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│        [Open Story Book] ───►           │
└─────────────────────────────────────────┘
```

**Key Changes:**
- ✅ Added: Specific storybook introduction text
- ✅ Added: "What You'll Learn" section (moved from Overview)
- ✅ More educational and informative

---

## Example: DQ Vision Page

### Tab 1: Overview

**Title:** The Vision (Purpose)  
**Subtitle:** Why We Are Here

**Content:**
> Our North Star. We exist to make life easier. Our goal is to use technology to make every transaction faster, smarter, and friendlier for everyone.

**Course Highlights:**
- ✓ Solving Chaos: Using digital blueprints to fix messy problems.
- ✓ Being Proactive: Fixing things before they even break.
- ✓ Global Impact: Improving lives in every sector of the economy.

---

### Tab 2: Explore Storybook

**Content:**
> Explore Our Mission: This storybook explains 'Accelerating Life's Transactions.' Read this to understand the big, audacious goal we are all aiming for.

**What You'll Learn:**
- • The Mission: Deeply understand what drives us every day.
- • The Strategy: How we plan to reach this big goal.
- • The Story: How to explain our purpose to others.

---

## Example: Agile TMS Page

### Tab 1: Overview

**Title:** Agile TMS (Tasks)  
**Subtitle:** How We Work

**Content:**
> Getting Things Done. Big dreams need action. The Task Management System (TMS) is how we break huge projects into small, doable steps so we never get overwhelmed.

**Course Highlights:**
- ✓ Radical Focus: Focusing on one thing at a time to do it well.
- ✓ Staying Fast: Measuring our speed to keep improving.
- ✓ Breaking it Down: Turning big problems into small tasks.

---

### Tab 2: Explore Storybook

**Content:**
> Explore Execution: This guide explains our 'Engine of Execution.' Download it to learn how we organize our to-do lists to keep moving fast without burnout.

**What You'll Learn:**
- • Manage Your Day: How to organize your backlog efficiently.
- • Use the Tools: Best practices for our task apps.
- • Deliver Value: How to finish tasks consistently.

---

## Benefits of the New Structure

### 1. **Clearer Information Architecture**
- Overview tab focuses on WHAT the guide is about
- Storybook tab focuses on WHAT YOU'LL LEARN

### 2. **Better User Flow**
```
User Journey:
1. Overview Tab → Quick understanding of the topic
2. Storybook Tab → Understand learning outcomes before diving in
3. Course Tab → Start learning
```

### 3. **Consistent Experience**
All 8 pages now follow the exact same pattern, making navigation predictable.

### 4. **Easier Maintenance**
Content lives in one place (`guideContent.ts`), not scattered across 8 files.

---

## All 8 Pages Updated

| Page | Slug | Status |
|------|------|--------|
| The GHC | `ghc` | ✅ Updated |
| The Vision | `dq-vision` | ✅ Updated |
| The HoV | `dq-hov` | ✅ Updated |
| The Personas | `dq-persona` | ✅ Updated |
| Agile TMS | `dq-agile-tms` | ✅ Updated |
| Agile SOS | `dq-agile-sos` | ✅ Updated |
| Agile Flows | `dq-agile-flows` | ✅ Updated |
| Agile 6xD | `dq-agile-6xd` | ✅ Updated |

---

## Testing Checklist

- [ ] Navigate to each guide page
- [ ] Verify Overview tab shows correct title, subtitle, overview, and highlights
- [ ] Verify Storybook tab shows intro text and "What You'll Learn" section
- [ ] Verify Course tab still works
- [ ] Check mobile responsiveness
- [ ] Verify all links work correctly
- [ ] Check that content matches the specification exactly
