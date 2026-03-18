import { LOCATION_ALLOW, LevelCode } from '@/lms/config';
import {
  levelLabelFromCode,
  levelShortLabelFromCode
} from '@/lms/levels';
import { lmsSupabaseClient } from '@/lib/lmsSupabaseClient';
import { formatDurationFromMinutes } from '@/utils/durationFormatter';

const allowedLocations = new Set<string>(LOCATION_ALLOW as readonly string[]);

const cleanLocations = (values?: string[]) => {
  const list = (values || []).filter(value => allowedLocations.has(value));
  return list.length ? list : ['Riyadh'];
};


const L = (code: string): LevelCode => {
  if (!code) return 'L1';

  const trimmed = code.trim();
  if (!trimmed) return 'L1';

  // 1. Try exact match with valid codes
  const validCodes: LevelCode[] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
  const upper = trimmed.toUpperCase() as LevelCode;
  if (validCodes.includes(upper)) return upper;

  // 2. Try prefix match (e.g., "L0. Starting" or "L0 – Starting")
  const prefixMatch = trimmed.match(/^(L\d)/i);
  if (prefixMatch) {
    const normalized = prefixMatch[1].toUpperCase() as LevelCode;
    if (validCodes.includes(normalized)) return normalized;
  }

  // 3. Try matching descriptive labels (case-insensitive)
  const lower = trimmed.toLowerCase();
  if (lower.includes('starting') || lower.includes('learning')) return 'L0';
  if (lower.includes('follow') || lower.includes('awareness')) return 'L1';
  if (lower.includes('assist')) return 'L2';
  if (lower.includes('apply')) return 'L3';
  if (lower.includes('enable')) return 'L4';
  if (lower.includes('ensure')) return 'L5';
  if (lower.includes('influence')) return 'L6';
  if (lower.includes('inspire')) return 'L7';

  return 'L1';
};

export type LmsDetail = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseCategory: string;
  deliveryMode: 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online';
  duration: string;
  durationMinutes?: number; // Actual duration in minutes from database
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
  caseStudies?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  references?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  imageUrl?: string;
  // Curriculum structure based on course type:
  // Track (Bundles): Contains courses, each course has topics, topics have lessons
  // Course (Multi-Lessons): Contains topics, topics have lessons
  // Single Lesson: Contains lessons directly
  curriculum?: Array<{
    id: string;
    title: string;
    description?: string;
    duration?: string;
    order: number;
    isLocked?: boolean;
    // For Track (Bundles): course slug to navigate to course page
    courseSlug?: string;
    // For Track (Bundles) and Course (Multi-Lessons): topics array
    topics?: Array<{
      id: string;
      title: string;
      description?: string;
      duration?: string;
      order: number;
      isLocked?: boolean;
      // Lessons within a topic
      lessons: Array<{
        id: string;
        title: string;
        description?: string;
        duration?: string;
        type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading' | 'final-assessment';
        order: number;
        isLocked?: boolean;
        videoUrl?: string;
        content?: string;
      }>;
    }>;
    // For Single Lesson: lessons directly (no topics)
    lessons?: Array<{
      id: string;
      title: string;
      description?: string;
      duration?: string;
      type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading' | 'final-assessment';
      order: number;
      isLocked?: boolean;
      videoUrl?: string;
      content?: string;
    }>;
  }>;
};

// Database types (snake_case from Supabase) - Updated for new schema
type DBCourse = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string | null;
  excerpt: string | null;
  category: string;
  delivery_mode: 'online' | 'in-person' | 'hybrid' | null;
  duration: number; // minutes
  level_code: string | null;
  department: string | null; // TEXT, not array
  audience: string | null; // TEXT, not array
  status: 'draft' | 'published' | 'archived';
  highlights: string[];
  outcomes: string[];
  course_type: 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | null;
  track: string | null;
  rating: number;
  review_count: number;
  image_url: string | null;
  faq: any[]; // JSONB array
  created_at: string;
  updated_at: string;
};

type DBModule = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: number; // minutes
  item_order: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
};

type DBLesson = {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  duration: number; // minutes
  item_order: number;
  is_locked: boolean;
  content: string | null; // Markdown
  video_url: string | null;
  created_at: string;
  updated_at: string;
};

// Quiz types
type DBQuiz = {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  questions: any[];
  created_at: string;
  updated_at: string;
};

/**
 * Fetches all courses from Supabase
 * Uses 'lms_courses' table
 */
async function fetchCourses(): Promise<DBCourse[]> {
  try {
    console.log('[LMS] Fetching courses from Supabase (lms_courses table)...');

    const { data, error } = await lmsSupabaseClient
      .from('lms_courses')
      .select('*')
      .order('title');

    if (error) {
      console.error('[LMS] Error fetching courses:', error);
      console.error('[LMS] Error code:', error.code);
      console.error('[LMS] Error message:', error.message);
      console.error('[LMS] Error details:', error.details);
      console.error('[LMS] Error hint:', error.hint);
      throw new Error(`Failed to fetch courses: ${error.message} (code: ${error.code})`);
    }

    console.log(`[LMS] Successfully fetched ${data?.length || 0} courses`);
    if (data && data.length > 0) {
      console.log('[LMS] Sample course:', { id: data[0].id, title: data[0].title, slug: data[0].slug });
    }
    return data || [];
  } catch (err) {
    console.error('[LMS] Exception in fetchCourses:', err);
    throw err;
  }
}

/**
 * Fetches all modules for given course IDs
 */
async function fetchModules(courseIds: string[]): Promise<DBModule[]> {
  if (courseIds.length === 0) return [];

  const { data, error } = await lmsSupabaseClient
    .from('lms_modules')
    .select('*')
    .in('course_id', courseIds)
    .order('item_order');

  if (error) {
    console.error('Error fetching modules:', error);
    throw new Error(`Failed to fetch modules: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetches all lessons for given course IDs and module IDs
 */
async function fetchLessons(courseIds: string[], moduleIds: string[]): Promise<DBLesson[]> {
  const allLessons: DBLesson[] = [];

  // Fetch lessons for modules
  if (moduleIds.length > 0) {
    const { data, error } = await lmsSupabaseClient
      .from('lms_lessons')
      .select('*')
      .in('module_id', moduleIds)
      .order('item_order');

    if (error) {
      console.error('Error fetching lessons for modules:', error);
      throw new Error(`Failed to fetch lessons: ${error.message}`);
    }

    if (data) {
      allLessons.push(...data);
    }
  }

  // Fetch lessons directly on courses (not in modules)
  if (courseIds.length > 0) {
    const { data, error } = await lmsSupabaseClient
      .from('lms_lessons')
      .select('*')
      .in('course_id', courseIds)
      .is('module_id', null) // Only get direct lessons, not ones in modules
      .order('item_order');

    if (error) {
      console.error('Error fetching lessons for courses:', error);
      throw new Error(`Failed to fetch lessons: ${error.message}`);
    }

    if (data) {
      allLessons.push(...data);
    }
  }

  return allLessons;
}

/**
 * Fetches all quizzes for given course IDs
 */
async function fetchQuizzes(courseIds: string[]): Promise<DBQuiz[]> {
  if (courseIds.length === 0) return [];

  const { data, error } = await lmsSupabaseClient
    .from('lms_quizzes')
    .select('*')
    .in('course_id', courseIds)
    .is('lesson_id', null);

  if (error) {
    console.error('Error fetching quizzes:', error);
    // Don't throw, just return empty
    return [];
  }

  return data || [];
}

// Helper to convert minutes to duration enum


// Helper to parse department/audience from TEXT to array
function parseTextToArray(text: string | null): string[] {
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [text];
  } catch {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }
}

// Helper to normalize status
function normalizeStatus(status: string): 'live' | 'coming-soon' {
  if (status === 'published') return 'live';
  if (status === 'draft') return 'coming-soon';
  return 'live';
}

/**
 * Transforms database course to LmsDetail format
 */
function transformCourseToLmsDetail(
  course: DBCourse,
  modules: DBModule[],
  lessons: DBLesson[],
  quizzes: DBQuiz[] = []
): LmsDetail {
  // Get modules for this course
  const courseModules = modules.filter(m => m.course_id === course.id);

  // Build curriculum structure
  const curriculum = courseModules.map(module => {
    // Get lessons for this module
    const moduleLessons = lessons.filter(l => l.module_id === module.id);

    const curriculumItem: any = {
      id: module.id,
      title: module.title,
      description: module.description || undefined,
      duration: module.duration ? formatDurationFromMinutes(module.duration) : undefined,
      order: module.item_order,
      isLocked: module.is_locked,
    };

    // Add lessons if present
    if (moduleLessons.length > 0) {
      curriculumItem.lessons = moduleLessons
        .map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          duration: lesson.duration ? formatDurationFromMinutes(lesson.duration) : undefined,
          type: (lesson.video_url ? 'video' : (lesson.content ? 'guide' : 'reading')) as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
          order: lesson.item_order,
          isLocked: lesson.is_locked,
          videoUrl: lesson.video_url || undefined,
          content: lesson.content || undefined
        }))
        .sort((a, b) => a.order - b.order);
    }

    return curriculumItem;
  }).sort((a, b) => a.order - b.order);

  // If no modules, check for direct lessons on course
  if (curriculum.length === 0) {
    const directLessons = lessons.filter(l => l.course_id === course.id && !l.module_id);
    if (directLessons.length > 0) {
      curriculum.push({
        id: course.id,
        title: course.title,
        order: 0,
        lessons: directLessons
          .map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || undefined,
            duration: lesson.duration ? formatDurationFromMinutes(lesson.duration) : undefined,
            type: (lesson.video_url ? 'video' : (lesson.content ? 'guide' : 'reading')) as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
            order: lesson.item_order,
            isLocked: lesson.is_locked,
            videoUrl: lesson.video_url || undefined,
            content: lesson.content || undefined
          }))
          .sort((a, b) => a.order - b.order)
      });
    }
  }



  // Parse FAQ from JSONB
  const faq = Array.isArray(course.faq) ? course.faq.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) : undefined;

  // Transform the course
  const lmsDetail: LmsDetail = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.category,
    deliveryMode: (course.delivery_mode === 'online' ? 'Online' : (course.delivery_mode === 'hybrid' ? 'Hybrid' : 'Online')),
    duration: formatDurationFromMinutes(course.duration),
    durationMinutes: course.duration, // Store actual minutes from database
    levelCode: L(course.level_code || 'L1'),
    department: parseTextToArray(course.department),
    locations: ['Riyadh'], // Default location
    audience: parseTextToArray(course.audience) as Array<'Associate' | 'Lead'>,
    status: normalizeStatus(course.status),
    summary: course.description || course.title,
    excerpt: course.excerpt || undefined,
    highlights: course.highlights || [],
    outcomes: course.outcomes || [],
    courseType: course.course_type || undefined,
    track: course.track || undefined,
    rating: course.rating > 0 ? course.rating : undefined,
    reviewCount: course.review_count > 0 ? course.review_count : undefined,
    imageUrl: course.image_url || undefined,
    faq
  };

  // Add curriculum if present
  if (curriculum.length > 0) {
    lmsDetail.curriculum = curriculum;
  }

  return lmsDetail;
}

/**
 * Fetches all course details from Supabase and transforms them to LmsDetail format
 */
export async function fetchLmsCourseDetails(): Promise<LmsDetail[]> {
  try {
    console.log('[LMS] Starting to fetch course details...');

    // Fetch all courses
    const courses = await fetchCourses();
    console.log(`[LMS] Found ${courses.length} courses`);

    if (courses.length === 0) {
      console.warn('[LMS] No courses found in database');
      return [];
    }

    const courseIds = courses.map(c => c.id);
    console.log(`[LMS] Fetching modules for ${courseIds.length} courses...`);

    // Fetch modules first
    const modules = await fetchModules(courseIds);
    console.log(`[LMS] Found ${modules.length} modules`);

    const moduleIds = modules.map(m => m.id);

    // Fetch lessons for modules and courses
    console.log(`[LMS] Fetching lessons for ${moduleIds.length} modules and ${courseIds.length} courses...`);
    const lessons = await fetchLessons(courseIds, moduleIds);
    console.log(`[LMS] Found ${lessons.length} lessons`);

    // Fetch quizzes
    console.log(`[LMS] Fetching quizzes (final assessments) for ${courseIds.length} courses...`);
    const quizzes = await fetchQuizzes(courseIds);
    console.log(`[LMS] Found ${quizzes.length} quizzes`);

    // Transform all courses
    console.log('[LMS] Transforming courses to LmsDetail format...');
    const lmsDetails = courses.map(course =>
      transformCourseToLmsDetail(course, modules, lessons, quizzes)
    );

    // Apply location cleaning
    const cleanedDetails = lmsDetails.map(detail => ({
      ...detail,
      locations: cleanLocations(detail.locations)
    }));

    console.log(`[LMS] Successfully transformed ${cleanedDetails.length} courses`);
    return cleanedDetails;
  } catch (error) {
    console.error('[LMS] Error fetching LMS course details:', error);
    if (error instanceof Error) {
      console.error('[LMS] Error message:', error.message);
      console.error('[LMS] Error stack:', error.stack);
    }
    throw error;
  }
}

// Cache for course details
let cachedCourseDetails: LmsDetail[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Gets LMS course details with caching
 */
export async function getLmsCourseDetails(): Promise<LmsDetail[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedCourseDetails && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedCourseDetails;
  }

  // Fetch fresh data
  cachedCourseDetails = await fetchLmsCourseDetails();
  cacheTimestamp = now;

  return cachedCourseDetails;
}

/**
 * Clears the course details cache
 */
export function clearLmsCourseDetailsCache(): void {
  cachedCourseDetails = null;
  cacheTimestamp = null;
}

// For backwards compatibility, export a synchronous version that returns empty array
// Components should use getLmsCourseDetails() instead
export const LMS_COURSE_DETAILS: LmsDetail[] = [];

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

/**
 * Gets LMS courses (card format) from Supabase
 */
export async function getLmsCourses(): Promise<LmsCard[]> {
  const details = await getLmsCourseDetails();
  return details.map(detail => ({
    id: detail.id,
    slug: detail.slug,
    title: detail.title,
    provider: detail.provider,
    courseCategory: detail.courseCategory,
    deliveryMode: detail.deliveryMode,
    duration: detail.duration,
    durationMinutes: detail.durationMinutes,
    levelCode: detail.levelCode,
    levelLabel: levelLabelFromCode(detail.levelCode),
    levelShortLabel: levelShortLabelFromCode(detail.levelCode),
    locations: detail.locations,
    audience: detail.audience,
    status: detail.status,
    summary: detail.summary,
    excerpt: detail.excerpt,
    department: detail.department,
    courseType: detail.courseType || 'Course (Single Lesson)',
    track: detail.track,
    imageUrl: detail.imageUrl,
    rating: detail.rating,
    reviewCount: detail.reviewCount,
  }));
}

// For backwards compatibility, export a synchronous version that returns empty array
// Components should use getLmsCourses() instead
export const LMS_COURSES: LmsCard[] = [];
