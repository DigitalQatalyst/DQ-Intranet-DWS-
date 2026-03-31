# DQ Learning Center (LMS) - Technical Specification Document

**Version:** 1.0  
**Date:** February 4, 2026  
**Module:** `/lms` Route & Learning Center Feature  

---

## 1. Executive Summary

The **DQ Learning Center** is a comprehensive Learning Management System (LMS) module that provides employees with access to upskilling resources, certification tools, and structured learning paths. The system supports three primary content types:

1. **Courses** - Individual learning modules (Single Lesson or Multi-Lessons)
2. **Learning Tracks** - Bundled courses that form structured learning journeys
3. **Reviews** - User testimonials and course feedback

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TypeScript)               │
├─────────────────────────────────────────────────────────────────────┤
│  Pages                    │  Components              │  Hooks       │
│  ├─ LmsCourses.tsx       │  ├─ MarketplaceCard     │  useLmsCourses│
│  ├─ LmsCourseDetailPage  │  ├─ FilterSidebar       │  useLmsCourse │
│  ├─ LmsLessonPage        │  ├─ SearchBar           │  useLmsCourse │
│  ├─ LmsCourseReviewsPage │  └─ Header/Footer       │  Details      │
│  ├─ LmsCourseAssessment  │                          │  useLmsLearning│
│  └─ MyLearningDashboard  │                          │  Paths        │
├─────────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  Services                 │  Types                   │  Config      │
│  ├─ lmsService.ts        │  ├─ lmsSupabase.ts       │  config.ts   │
│  └─ lmsCourseDetails.ts  │  └─ database.types.ts   │  levels.ts   │
├─────────────────────────────────────────────────────────────────────┤
│                      SUPABASE (LMS Database)                        │
├─────────────────────────────────────────────────────────────────────┤
│  Tables                                                              │
│  ├─ lms_courses          ├─ lms_modules           ├─ lms_lessons   │
│  ├─ lms_learning_paths   ├─ lms_path_items        ├─ lms_quizzes   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Route Structure

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/lms` | `LmsCourses.tsx` | Main Learning Center marketplace with tabs for Courses, Tracks, and Reviews |
| `/lms/:slug` | `LmsCourseDetailPage.tsx` | Detailed course/track view with curriculum, outcomes, and reviews |
| `/lms/:courseSlug/lesson/:lessonId` | `LmsLessonPage.tsx` | Individual lesson content viewer (video/guide/quiz) |
| `/lms/:slug/reviews` | `LmsCourseReviewsPage.tsx` | Full reviews list for a course |
| `/lms/:slug/assessment` | `LmsCourseAssessmentPage.tsx` | Final assessment/quiz page |
| `/lms/my-learning` | `MyLearningDashboard.tsx` | Personal learning dashboard with progress |

### 3.2 Page Components

#### 3.2.1 `LmsCourses.tsx` - Main Marketplace Page

**Location:** `src/pages/LmsCourses.tsx`

**Purpose:** Main entry point for the Learning Center displaying all courses, learning tracks, and reviews with filtering capabilities.

**Features:**
- **Tab Navigation:** Courses | Learning Tracks | Reviews
- **Filter Sidebar:** Department, Category, Provider, Course Type, SFIA Rating, Location, Audience
- **Search Functionality:** Text-based search across titles, summaries, providers
- **Pagination:** 12 items per page
- **Responsive Design:** Mobile filter drawer, desktop sidebar

**State Management:**
```typescript
const [searchParams, setSearchParams] = useSearchParams();
const [searchQuery, setSearchQuery] = useState("");
const [showFilters, setShowFilters] = useState(false);
const [activeTab, setActiveTab] = useState<'courses' | 'tracks' | 'reviews'>('courses');
const [currentPage, setCurrentPage] = useState(1);
```

**Data Hooks:**
```typescript
const { data: LMS_COURSES, isLoading, error } = useLmsCourses();
const { data: LMS_COURSE_DETAILS } = useLmsCourseDetails();
const { data: LEARNING_PATHS } = useLmsLearningPaths();
```

**Filter Configuration:**
| Filter ID | Title | Options Source |
|-----------|-------|----------------|
| `department` | Department | Static list (HRA, Finance, Deals, etc.) |
| `category` | Course Category | `CATEGORY_OPTS` (GHC, 6x Digital, DWS, DXP, Key Tools) |
| `provider` | LMS Item Provider | Static list (DQ HRA, DQ DTMB, etc.) |
| `courseType` | Course Types | Single Lesson, Multi-Lessons, Bundles |
| `sfiaRating` | Rating - SFIA | `SFIA_LEVELS` (L0-L7) |
| `location` | Location/Studio | `LOCATION_OPTS` (Dubai, Nairobi, Riyadh, Remote) |
| `audience` | Audience | Associate, Lead |

---

#### 3.2.2 `LmsCourseDetailPage.tsx` - Course/Track Detail Page

**Location:** `src/pages/lms/LmsCourseDetailPage.tsx`

**Purpose:** Displays comprehensive details for a single course or learning track.

**Layout Sections:**
1. **Hero Section** - Course title, provider, status, rating, image background
2. **Tab Navigation** - Details | Learning Outcomes | Curriculum | Reviews | FAQ
3. **Main Content Area** - Tab-specific content
4. **Sidebar** - Quick stats, CTA buttons, related courses

**Tab Content:**

| Tab | Content |
|-----|---------|
| **Details** | Duration, Level, Delivery Mode, Lessons count, Summary, Highlights, Track info |
| **Learning Outcomes** | Bullet list of what learners will achieve |
| **Curriculum** | Expandable modules with lessons (supports nested topics) |
| **Reviews** | User testimonials with ratings |
| **FAQ** | Accordion-style Q&A (tracks only) |

**State Management:**
```typescript
const [activeTab, setActiveTab] = useState<'details' | 'outcomes' | 'curriculum' | 'reviews' | 'faq'>('details');
const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
```

**Course Type Handling:**
| Course Type | Curriculum Structure |
|-------------|---------------------|
| `Course (Single Lesson)` | Flat list of lessons |
| `Course (Multi-Lessons)` | Modules → Lessons |
| `Course (Bundles)` | Courses → Modules → Lessons (clickable course links) |

---

#### 3.2.3 `LmsLessonPage.tsx` - Lesson Viewer

**Location:** `src/pages/lms/LmsLessonPage.tsx`

**Purpose:** Displays individual lesson content (video, guide, quiz).

**Features:**
- Video player integration
- Markdown content rendering
- Progress tracking (localStorage-based)
- Sequential lesson locking
- Navigation to next/previous lessons

**Progress Tracking:**
```typescript
// Completion stored in localStorage
localStorage.setItem(`lms_lesson_completed_${lessonId}`, 'true');
```

---

### 3.3 Custom Hooks

#### 3.3.1 `useLmsCourses.ts`

**Location:** `src/hooks/useLmsCourses.ts`

**Exported Hooks:**

| Hook | Purpose | Return Type |
|------|---------|-------------|
| `useLmsCourses()` | Fetch all courses (card format) | `LmsCard[]` |
| `useLmsCourseDetails()` | Fetch all course details | `LmsDetail[]` |
| `useLmsCourse(slug)` | Fetch single course by slug | `LmsDetail | null` |
| `useLmsCoursesFiltered(filters)` | Fetch courses with filters | `LmsCard[]` |
| `useLmsReviews()` | Fetch all reviews | `Review[]` |
| `useCreateReview()` | Create new review mutation | `UseMutationResult` |
| `useLmsLearningPaths()` | Fetch all learning paths | `LmsCard[]` |

**React Query Configuration:**
```typescript
{
  queryKey: ['lms', 'courses'],
  staleTime: 5 * 60 * 1000, // 5 minutes cache
  refetchOnMount: true,
  refetchOnWindowFocus: false,
}
```

---

### 3.4 Services Layer

#### 3.4.1 `lmsService.ts`

**Location:** `src/services/lmsService.ts`

**Functions:**

| Function | Description | Returns |
|----------|-------------|---------|
| `fetchAllCourses()` | Get all published courses | `LmsCard[]` |
| `fetchCourseBySlug(slug)` | Get course with full curriculum | `LmsDetail | null` |
| `fetchCoursesByFilters(filters)` | Get filtered courses | `LmsCard[]` |
| `fetchAllReviews()` | Get all course reviews | `Review[]` |
| `createReview(courseId, review)` | Create new review | `Review` |
| `fetchQuizByLessonId(lessonId)` | Get quiz for a lesson | `LmsQuizRow | null` |
| `fetchQuizByCourseId(courseId)` | Get final assessment quiz | `LmsQuizRow | null` |
| `fetchAllLearningPaths()` | Get all learning paths | `LmsCard[]` |
| `fetchLearningPathBySlug(slug)` | Get learning path details | `LmsDetail | null` |
| `findLearningPathsForCourse(courseId)` | Find paths containing course | `PathInfo[]` |
| `fetchCoursesInLearningPath(pathId)` | Get courses in a path | `CourseInfo[]` |

---

#### 3.4.2 `lmsCourseDetails.ts`

**Location:** `src/data/lmsCourseDetails.ts`

**Purpose:** Core data fetching and transformation layer.

**Functions:**

| Function | Description |
|----------|-------------|
| `fetchCourses()` | Raw Supabase query for courses |
| `fetchModules(courseIds)` | Raw Supabase query for modules |
| `fetchLessons(courseIds, moduleIds)` | Raw Supabase query for lessons |
| `fetchQuizzes(courseIds)` | Raw Supabase query for quizzes |
| `transformCourseToLmsDetail()` | Transform DB row to `LmsDetail` |
| `getLmsCourseDetails()` | Cached course details fetch |
| `getLmsCourses()` | Get courses in card format |
| `clearLmsCourseDetailsCache()` | Invalidate cache |

**Caching:**
```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedCourseDetails: LmsDetail[] | null = null;
let cacheTimestamp: number | null = null;
```

---

### 3.5 Configuration

#### 3.5.1 `config.ts`

**Location:** `src/lms/config.ts`

```typescript
// Allowed locations for courses
export const LOCATION_ALLOW = ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] as const;

// SFIA Level definitions
export const SFIA_LEVELS = [
  { code: 'L0', label: 'L0. Starting (Learning)' },
  { code: 'L1', label: 'L1. Follow (Self Aware)' },
  { code: 'L2', label: 'L2. Assist (Self Lead)' },
  { code: 'L3', label: 'L3. Apply (Drive Squad)' },
  { code: 'L4', label: 'L4. Enable (Drive Team)' },
  { code: 'L5', label: 'L5. Ensure (Steer Org)' },
  { code: 'L6', label: 'L6. Influence (Steer Cross)' },
  { code: 'L7', label: 'L7. Inspire (Inspire Market)' }
] as const;

// Course categories
export const CATEGORY_OPTS = ['GHC', '6x Digital', 'DWS', 'DXP', 'Key Tools'] as const;

// Delivery modes
export const DELIVERY_OPTS = ['Video', 'Guide', 'Workshop', 'Hybrid', 'Online'] as const;

// Duration labels
export const DURATION_OPTS = ['Bite-size', 'Short', 'Medium', 'Long'] as const;
```

---

## 4. Database Schema

### 4.1 Environment Configuration

The LMS uses a **separate Supabase instance** from the main application:

```env
# Main application Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# LMS-specific Supabase (separate database)
VITE_LMS_SUPABASE_URL=https://yyy.supabase.co
VITE_LMS_SUPABASE_ANON_KEY=yyy
```

**Client Initialization:**
```typescript
// src/lib/lmsSupabaseClient.ts
export const lmsSupabaseClient = createClient(
  import.meta.env.VITE_LMS_SUPABASE_URL,
  import.meta.env.VITE_LMS_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);
```

---

### 4.2 Core Tables

#### 4.2.1 `lms_courses`

**Purpose:** Main courses table containing course metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `TEXT` | PRIMARY KEY | Unique course identifier |
| `slug` | `TEXT` | UNIQUE, NOT NULL | URL-friendly identifier |
| `title` | `TEXT` | NOT NULL | Course display title |
| `provider` | `TEXT` | NOT NULL | Provider name (e.g., "DQ HRA") |
| `description` | `TEXT` | - | Full course description |
| `excerpt` | `TEXT` | - | Short description for cards |
| `category` | `TEXT` | NOT NULL | Course category |
| `delivery_mode` | `ENUM` | - | 'online', 'in-person', 'hybrid' |
| `duration` | `INTEGER` | NOT NULL | Duration in minutes |
| `level_code` | `TEXT` | - | SFIA level (L0-L8) |
| `department` | `TEXT` | - | Target departments (comma-separated or JSON) |
| `audience` | `TEXT` | - | Target audience (Associate, Lead) |
| `status` | `ENUM` | NOT NULL, DEFAULT 'published' | 'draft', 'published', 'archived' |
| `highlights` | `TEXT[]` | DEFAULT '{}' | Array of highlight strings |
| `outcomes` | `TEXT[]` | DEFAULT '{}' | Array of learning outcome strings |
| `course_type` | `TEXT` | - | 'Course (Single Lesson)', 'Course (Multi-Lessons)' |
| `track` | `TEXT` | - | Associated track name |
| `rating` | `NUMERIC` | DEFAULT 0 | Average rating (0-5) |
| `review_count` | `INTEGER` | DEFAULT 0 | Number of reviews |
| `image_url` | `TEXT` | - | Hero image URL |
| `faq` | `JSONB` | DEFAULT '[]' | FAQ array `[{question, answer}]` |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_lms_courses_slug ON lms_courses(slug);
CREATE INDEX idx_lms_courses_category ON lms_courses(category);
CREATE INDEX idx_lms_courses_provider ON lms_courses(provider);
CREATE INDEX idx_lms_courses_status ON lms_courses(status);
```

---

#### 4.2.2 `lms_modules`

**Purpose:** Modules within courses (for Multi-Lessons courses).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `TEXT` | PRIMARY KEY | Unique module identifier |
| `course_id` | `TEXT` | FK → lms_courses(id), NOT NULL | Parent course |
| `title` | `TEXT` | NOT NULL | Module title |
| `description` | `TEXT` | - | Module description |
| `duration` | `INTEGER` | - | Duration in minutes |
| `item_order` | `INTEGER` | NOT NULL, DEFAULT 0 | Display order |
| `is_locked` | `BOOLEAN` | DEFAULT false | Whether module is locked |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_lms_modules_course_id ON lms_modules(course_id);
CREATE INDEX idx_lms_modules_order ON lms_modules(course_id, item_order);
```

---

#### 4.2.3 `lms_lessons`

**Purpose:** Individual lessons within modules or directly in courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `TEXT` | PRIMARY KEY | Unique lesson identifier |
| `course_id` | `TEXT` | FK → lms_courses(id), NOT NULL | Parent course |
| `module_id` | `TEXT` | FK → lms_modules(id), NULLABLE | Parent module (null for direct lessons) |
| `title` | `TEXT` | NOT NULL | Lesson title |
| `description` | `TEXT` | - | Lesson description |
| `duration` | `INTEGER` | - | Duration in minutes |
| `item_order` | `INTEGER` | NOT NULL, DEFAULT 0 | Display order |
| `is_locked` | `BOOLEAN` | DEFAULT false | Whether lesson is locked |
| `content` | `TEXT` | - | Markdown content (for guides) |
| `video_url` | `TEXT` | - | Video URL (for video lessons) |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_lms_lessons_course_id ON lms_lessons(course_id);
CREATE INDEX idx_lms_lessons_module_id ON lms_lessons(module_id);
CREATE INDEX idx_lms_lessons_order ON lms_lessons(item_order);
```

---

#### 4.2.4 `lms_learning_paths`

**Purpose:** Learning paths (tracks) that bundle multiple courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `TEXT` | PRIMARY KEY | Unique path identifier |
| `slug` | `TEXT` | UNIQUE, NOT NULL | URL-friendly identifier |
| `title` | `TEXT` | NOT NULL | Path display title |
| `provider` | `TEXT` | NOT NULL | Provider name |
| `description` | `TEXT` | - | Path description |
| `category` | `TEXT` | NOT NULL | Category |
| `duration` | `INTEGER` | NOT NULL | Total duration in minutes |
| `level_code` | `TEXT` | - | SFIA level |
| `department` | `TEXT` | - | Target departments |
| `audience` | `TEXT` | - | Target audience |
| `status` | `ENUM` | DEFAULT 'published' | Status |
| `highlights` | `TEXT[]` | DEFAULT '{}' | Highlights |
| `outcomes` | `TEXT[]` | DEFAULT '{}' | Learning outcomes |
| `rating` | `NUMERIC` | DEFAULT 0 | Average rating |
| `review_count` | `INTEGER` | DEFAULT 0 | Review count |
| `image_url` | `TEXT` | - | Hero image URL |
| `faq` | `JSONB` | DEFAULT '[]' | FAQ array |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Last update timestamp |

---

#### 4.2.5 `lms_path_items`

**Purpose:** Junction table linking learning paths to courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `path_id` | `TEXT` | FK → lms_learning_paths(id), NOT NULL | Parent path |
| `course_id` | `TEXT` | FK → lms_courses(id), NOT NULL | Course in path |
| `position` | `INTEGER` | NOT NULL | Order in path |

**Primary Key:** `(path_id, course_id)`

---

#### 4.2.6 `lms_quizzes`

**Purpose:** Quizzes and final assessments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `TEXT` | PRIMARY KEY | Unique quiz identifier |
| `course_id` | `TEXT` | FK → lms_courses(id), NOT NULL | Parent course |
| `lesson_id` | `TEXT` | FK → lms_lessons(id), NULLABLE | Parent lesson (null for course-level) |
| `title` | `TEXT` | NOT NULL | Quiz title |
| `description` | `TEXT` | - | Quiz description |
| `questions` | `JSONB` | NOT NULL | Array of question objects |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Last update timestamp |

**Questions JSONB Structure:**
```json
[
  {
    "id": "q1",
    "type": "multiple-choice",
    "question": "What is...?",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B" },
      { "id": "c", "text": "Option C" },
      { "id": "d", "text": "Option D" }
    ],
    "correctAnswer": "b",
    "explanation": "Because..."
  }
]
```

---

### 4.3 Entity Relationship Diagram

```
┌──────────────────┐     ┌──────────────────┐
│ lms_learning_    │     │                  │
│    paths         │     │   lms_courses    │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ slug (UNIQUE)    │     │ slug (UNIQUE)    │
│ title            │     │ title            │
│ provider         │     │ provider         │
│ description      │     │ description      │
│ category         │     │ category         │
│ duration         │     │ duration         │
│ level_code       │     │ level_code       │
│ status           │     │ status           │
│ ...              │     │ course_type      │
└────────┬─────────┘     │ ...              │
         │               └────────┬─────────┘
         │                        │
         ▼                        │
┌──────────────────┐              │
│ lms_path_items   │              │
├──────────────────┤              │
│ path_id (FK)─────┼──────────────┤
│ course_id (FK)───┼──────────────┤
│ position         │              │
└──────────────────┘              │
                                  ▼
                        ┌──────────────────┐
                        │   lms_modules    │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ course_id (FK)───┼───◄
                        │ title            │
                        │ description      │
                        │ duration         │
                        │ item_order       │
                        │ is_locked        │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   lms_lessons    │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ course_id (FK)───┼───◄
                        │ module_id (FK)───┼───◄
                        │ title            │
                        │ content          │
                        │ video_url        │
                        │ duration         │
                        │ item_order       │
                        │ is_locked        │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   lms_quizzes    │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ course_id (FK)───┼───◄
                        │ lesson_id (FK)───┼───◄
                        │ title            │
                        │ description      │
                        │ questions (JSONB)│
                        └──────────────────┘
```

---

### 4.4 Row Level Security (RLS)

All LMS tables have RLS enabled with the following policies:

```sql
-- Enable RLS
ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_quizzes ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can view courses"
    ON lms_courses FOR SELECT
    USING (status = 'published');

CREATE POLICY "Public can view modules"
    ON lms_modules FOR SELECT
    USING (true);

CREATE POLICY "Public can view lessons"
    ON lms_lessons FOR SELECT
    USING (true);

CREATE POLICY "Public can view learning paths"
    ON lms_learning_paths FOR SELECT
    USING (status = 'published');
```

---

## 5. TypeScript Type Definitions

### 5.1 Core Types

**Location:** `src/types/lmsSupabase.ts`

```typescript
// Delivery modes
export type DeliveryMode = 'online' | 'in-person' | 'hybrid';

// Duration labels (for display)
export type Duration = 'Bite-size' | 'Short' | 'Medium' | 'Long';

// SFIA Level codes
export type LevelCode = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

// Course status
export type CourseStatus = 'draft' | 'published' | 'archived';

// Course types
export type CourseType = 'Course (Single Lesson)' | 'Course (Multi-Lessons)';

// Course row from database
export interface LmsCourseRow {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string | null;
  category: string;
  delivery_mode: DeliveryMode | null;
  duration: number; // minutes
  level_code: string | null;
  department: string | null;
  audience: string | null;
  status: CourseStatus;
  highlights: string[];
  outcomes: string[];
  course_type: CourseType | null;
  track: string | null;
  rating: number;
  review_count: number;
  image_url: string | null;
  faq: any[];
  created_at: string;
  updated_at: string;
}

// Module row from database
export interface LmsModuleRow {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: number;
  item_order: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

// Lesson row from database
export interface LmsLessonRow {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  duration: number;
  item_order: number;
  is_locked: boolean;
  content: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

// Quiz row from database
export interface LmsQuizRow {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  questions: any[];
  created_at: string;
  updated_at: string;
}

// Course with nested relations
export interface LmsCourseWithRelations extends LmsCourseRow {
  modules?: LmsModuleWithRelations[];
  lessons?: LmsLessonRow[];
  quiz?: LmsQuizRow | null;
}

export interface LmsModuleWithRelations extends LmsModuleRow {
  lessons: LmsLessonRow[];
}
```

---

### 5.2 Frontend Types

**Location:** `src/data/lmsCourseDetails.ts`

```typescript
// Card display type (for listings)
export type LmsCard = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseCategory: string;
  deliveryMode: string;
  duration: string;
  durationMinutes?: number;
  levelCode: LevelCode;
  levelLabel: string;
  levelShortLabel: string;
  locations: string[];
  audience: string[];
  status: string;
  summary: string;
  excerpt?: string;
  department: string[];
  courseType?: 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)';
  track?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
};

// Detailed course type (for detail pages)
export type LmsDetail = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseCategory: string;
  deliveryMode: 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online';
  duration: string;
  durationMinutes?: number;
  levelCode: LevelCode;
  department: string[];
  locations: string[];
  audience: Array<'Associate' | 'Lead'>;
  status: 'live' | 'coming-soon';
  summary: string;
  excerpt?: string;
  highlights: string[];
  outcomes: string[];
  courseType?: 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)';
  track?: string;
  rating?: number;
  reviewCount?: number;
  testimonials?: Array<{
    author: string;
    role: string;
    text: string;
    rating: number;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  imageUrl?: string;
  curriculum?: Array<CurriculumItem>;
};

// Curriculum structure
interface CurriculumItem {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  order: number;
  isLocked?: boolean;
  courseSlug?: string; // For tracks
  topics?: Array<{
    id: string;
    title: string;
    description?: string;
    duration?: string;
    order: number;
    isLocked?: boolean;
    lessons: Lesson[];
  }>;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading' | 'final-assessment';
  order: number;
  isLocked?: boolean;
  videoUrl?: string;
  content?: string;
}
```

---

## 6. Data Flow

### 6.1 Course Listing Flow

```
User visits /lms
       │
       ▼
LmsCourses.tsx
       │
       ├─► useLmsCourses()          ─► getLmsCourses()
       │                                     │
       ├─► useLmsCourseDetails()    ─► getLmsCourseDetails()
       │                                     │
       └─► useLmsLearningPaths()    ─► fetchAllLearningPaths()
                                             │
                                             ▼
                                    lmsSupabaseClient
                                             │
                                             ▼
                                    Supabase (lms_courses, lms_learning_paths)
```

### 6.2 Course Detail Flow

```
User visits /lms/:slug
       │
       ▼
LmsCourseDetailPage.tsx
       │
       ├─► useLmsCourse(slug)
       │         │
       │         ▼
       │   getLmsCourseDetails()
       │         │
       │         ├─► fetchCourses()      ─► lms_courses
       │         ├─► fetchModules()      ─► lms_modules  
       │         ├─► fetchLessons()      ─► lms_lessons
       │         └─► fetchQuizzes()      ─► lms_quizzes
       │
       └─► findLearningPathsForCourse(courseId)
                 │
                 ▼
           lms_path_items + lms_learning_paths
```

### 6.3 Lesson Viewing Flow

```
User clicks on lesson
       │
       ▼
LmsLessonPage.tsx
       │
       ├─► useLmsCourse(courseSlug)  ─► Course with full curriculum
       │
       ├─► Find lesson in curriculum by lessonId
       │
       ├─► Render video player OR markdown content
       │
       └─► Track completion in localStorage
               │
               ▼
         localStorage.setItem(`lms_lesson_completed_${lessonId}`, 'true')
```

---

## 7. API Queries

### 7.1 Fetch All Courses

```typescript
const { data, error } = await lmsSupabaseClient
  .from('lms_courses')
  .select('*')
  .eq('status', 'published')
  .order('title');
```

### 7.2 Fetch Course with Modules and Lessons

```typescript
// Step 1: Fetch course
const { data: course } = await lmsSupabaseClient
  .from('lms_courses')
  .select('*')
  .eq('slug', slug)
  .single();

// Step 2: Fetch modules
const { data: modules } = await lmsSupabaseClient
  .from('lms_modules')
  .select('*')
  .eq('course_id', course.id)
  .order('item_order');

// Step 3: Fetch lessons for modules
const { data: lessons } = await lmsSupabaseClient
  .from('lms_lessons')
  .select('*')
  .in('module_id', moduleIds)
  .order('item_order');

// Step 4: Fetch direct lessons (not in modules)
const { data: directLessons } = await lmsSupabaseClient
  .from('lms_lessons')
  .select('*')
  .eq('course_id', course.id)
  .is('module_id', null)
  .order('item_order');
```

### 7.3 Fetch Learning Paths

```typescript
const { data } = await lmsSupabaseClient
  .from('lms_learning_paths')
  .select('*')
  .eq('status', 'published')
  .order('title');
```

### 7.4 Find Learning Paths for a Course

```typescript
const { data: pathItems } = await lmsSupabaseClient
  .from('lms_path_items')
  .select(`
    path_id,
    position,
    lms_learning_paths!inner (
      id,
      slug,
      title
    )
  `)
  .eq('course_id', courseId)
  .order('position');
```

---

## 8. Component Props & Interfaces

### 8.1 MarketplaceCard Props

```typescript
interface MarketplaceCardProps {
  item: LmsCard;
  marketplaceType: 'lms';
  onViewDetails: (item: LmsCard) => void;
  formatDuration?: (duration: string) => string;
}
```

### 8.2 FilterSidebar Props

```typescript
interface FilterConfig {
  id: string;
  title: string;
  options: Array<{ id: string; name: string }>;
}

interface FilterSidebarProps {
  filters: Record<string, string[]>;
  filterConfig: FilterConfig[];
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isResponsive?: boolean;
}
```

---

## 9. State Management

### 9.1 URL-Based Filters

Filters are stored in URL search params for shareable links:

```
/lms?category=GHC&provider=DQ%20HRA&sfiaRating=L1,L2
```

**Parsing:**
```typescript
const [searchParams, setSearchParams] = useSearchParams();

const facets = {
  category: searchParams.get('category')?.split(',').filter(Boolean) || [],
  provider: searchParams.get('provider')?.split(',').filter(Boolean) || [],
  courseType: searchParams.get('courseType')?.split(',').filter(Boolean) || [],
  sfiaRating: searchParams.get('sfiaRating')?.split(',').filter(Boolean) || [],
  location: searchParams.get('location')?.split(',').filter(Boolean) || [],
  audience: searchParams.get('audience')?.split(',').filter(Boolean) || [],
  department: searchParams.get('department')?.split(',').filter(Boolean) || [],
};
```

### 9.2 Lesson Progress

Progress is stored in localStorage per lesson:

```typescript
// Check completion
const isCompleted = localStorage.getItem(`lms_lesson_completed_${lessonId}`) === 'true';

// Mark complete
localStorage.setItem(`lms_lesson_completed_${lessonId}`, 'true');

// Check if previous lessons are complete (for sequential locking)
const arePreviousCompleted = allLessons
  .slice(0, currentIndex)
  .every(l => isLessonCompleted(l.id));
```

---

## 10. Utilities

### 10.1 Duration Formatter

**Location:** `src/utils/durationFormatter.ts`

```typescript
export function formatDurationFromMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
}
```

### 10.2 Level Label Resolver

**Location:** `src/lms/levels.ts`

```typescript
export const levelLabelFromCode = (code: LevelCode): string =>
  LEVELS.find(level => level.code === code)?.label ?? code;

export const levelShortLabelFromCode = (code: LevelCode): string => {
  const label = levelLabelFromCode(code);
  return label.replace(' – ', ' · ');
};
```

---

## 11. Error Handling

### 11.1 Loading States

```typescript
if (coursesLoading || detailsLoading) {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <p>Loading courses...</p>
    </div>
  );
}
```

### 11.2 Error States

```typescript
if (coursesError) {
  return (
    <div className="text-center text-red-600">
      <p>Error loading courses</p>
      <p>{coursesError.message}</p>
    </div>
  );
}
```

### 11.3 Not Found States

```typescript
if (!course) {
  return (
    <div className="text-center">
      <h2>Course or Track Not Found</h2>
      <button onClick={() => navigate('/lms')}>
        Back to DQ Learning Center
      </button>
    </div>
  );
}
```

---

## 12. File Structure Summary

```
src/
├── pages/
│   ├── LmsCourses.tsx                    # Main marketplace page
│   └── lms/
│       ├── LmsCourseDetailPage.tsx       # Course detail page
│       ├── LmsCourseReviewsPage.tsx      # Reviews page
│       ├── LmsCourseAssessmentPage.tsx   # Quiz/assessment page
│       ├── LmsLessonPage.tsx             # Lesson viewer
│       └── MyLearningDashboard.tsx       # Personal dashboard
├── hooks/
│   └── useLmsCourses.ts                  # React Query hooks
├── services/
│   └── lmsService.ts                     # Supabase service functions
├── data/
│   └── lmsCourseDetails.ts               # Data fetching & transformation
├── lib/
│   └── lmsSupabaseClient.ts              # LMS Supabase client
├── lms/
│   ├── config.ts                         # Configuration constants
│   ├── levels.ts                         # SFIA level utilities
│   ├── filters.ts                        # Filter utilities
│   └── icons.ts                          # Icon mappings
├── types/
│   ├── lmsSupabase.ts                    # Database types
│   └── database.types.ts                 # Supabase generated types
└── utils/
    ├── durationFormatter.ts              # Duration formatting
    ├── lmsFilters.ts                     # Filter logic
    └── lmsIcons.ts                       # Icon resolution
```

---

## 13. Migration & Setup

### 13.1 Initial Database Setup

1. Create LMS tables using schema in `db/supabase/lms_schema.sql`
2. Enable RLS policies
3. Seed initial data from `db/supabase/lms_seed_data.sql`

### 13.2 Environment Configuration

Add to `.env`:
```env
VITE_LMS_SUPABASE_URL=https://your-lms-project.supabase.co
VITE_LMS_SUPABASE_ANON_KEY=your-anon-key
```

### 13.3 Dependency Requirements

```json
{
  "@supabase/supabase-js": "^2.78.0",
  "@tanstack/react-query": "^5.56.2",
  "react-router-dom": "^6.26.2"
}
```

---

## 14. Future Enhancements

### Planned Features
- [ ] User progress tracking in Supabase (replace localStorage)
- [ ] Certificate generation upon course completion
- [ ] SCORM package support
- [ ] Discussion forums per course
- [ ] Instructor-led course scheduling
- [ ] Learning path recommendations based on role
- [ ] Offline content access (PWA)
- [ ] Analytics dashboard for admins

---

## 15. Appendices

### A. SFIA Level Reference

| Code | Label | Description |
|------|-------|-------------|
| L0 | Starting (Learning) | New to the skill, actively learning |
| L1 | Follow (Self Aware) | Can follow instructions, self-aware of limitations |
| L2 | Assist (Self Lead) | Can assist others, self-directed in familiar tasks |
| L3 | Apply (Drive Squad) | Can apply skills independently, leads small teams |
| L4 | Enable (Drive Team) | Enables others, drives team performance |
| L5 | Ensure (Steer Org) | Ensures quality across organization |
| L6 | Influence (Steer Cross) | Influences across organizational boundaries |
| L7 | Inspire (Inspire Market) | Industry thought leader |

### B. Department Codes

- HRA (People)
- Finance
- Deals
- Stories
- Intelligence
- Solutions
- SecDevOps
- Products
- Delivery — Deploys
- Delivery — Designs
- DCO Operations
- DBP Platform
- DBP Delivery

### C. Provider Codes

- DQ HRA
- DQ DTMB
- DQ DTMA
- Tech (Microsoft)
- Tech (Ardoq)

---

*Document maintained by the DQ Intranet Development Team*
