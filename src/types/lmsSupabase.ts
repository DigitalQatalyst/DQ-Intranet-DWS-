/**
 * TypeScript types for Supabase LMS tables
 * These types match the new database schema with learning paths, modules, and lessons
 */

// Manual type definitions
export type DeliveryMode = 'online' | 'in-person' | 'hybrid';
export type Duration = 'Bite-size' | 'Short' | 'Medium' | 'Long'; // For display, duration in DB is INTEGER (minutes)
export type LevelCode = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type CourseType = 'Course (Single Lesson)' | 'Course (Multi-Lessons)';

// Learning Path types
export interface LmsLearningPathRow {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string | null;
  category: string;
  duration: number; // minutes
  level_code: string | null;
  department: string | null;
  audience: string | null;
  status: CourseStatus;
  highlights: string[];
  outcomes: string[];
  rating: number;
  review_count: number;
  image_url: string | null;
  faq: any[]; // JSONB array
  created_at: string;
  updated_at: string;
}

// Course types
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
  faq: any[]; // JSONB array
  created_at: string;
  updated_at: string;
}

// Path Items (junction table)
export interface LmsPathItemRow {
  path_id: string;
  course_id: string;
  position: number;
}

// Module types
export interface LmsModuleRow {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: number; // minutes
  item_order: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

// Lesson types
export interface LmsLessonRow {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  duration: number; // minutes
  item_order: number;
  is_locked: boolean;
  content: string | null; // Markdown content
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

// Quiz types
export interface LmsQuizRow {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  questions: any[]; // JSONB array
  created_at: string;
  updated_at: string;
}

// Nested types for API responses
export interface LmsCourseWithRelations extends LmsCourseRow {
  modules?: LmsModuleWithRelations[];
  lessons?: LmsLessonRow[]; // Lessons directly on course (not in modules)
  quiz?: LmsQuizRow | null; // Course-level quiz (Final Assessment)
}

export interface LmsModuleWithRelations extends LmsModuleRow {
  lessons: LmsLessonRow[];
}

// For backwards compatibility with existing code
export type LmsReviewRow = never; // Reviews removed from schema
export type LmsCaseStudyRow = never; // Case studies removed from schema
export type LmsReferenceRow = never; // References removed from schema
export type LmsFaqRow = never; // FAQs are now JSONB in courses
export type LmsCurriculumItemRow = LmsModuleRow; // Alias for backwards compatibility
export type LmsCurriculumTopicRow = never; // Topics removed, replaced by modules
export type LmsCurriculumLessonRow = LmsLessonRow; // Alias for backwards compatibility
export type LmsCurriculumItemWithRelations = LmsModuleWithRelations; // Alias
export type LmsCurriculumTopicWithRelations = never; // Topics removed
