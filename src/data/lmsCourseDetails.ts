import { LOCATION_ALLOW, LEVELS, LevelCode } from '@/lms/config';
import {
  levelLabelFromCode,
  levelShortLabelFromCode
} from '@/lms/levels';
import { supabaseClient } from '@/lib/supabaseClient';

const allowedLocations = new Set<string>(LOCATION_ALLOW as readonly string[]);

const cleanLocations = (values?: string[]) => {
  const list = (values || []).filter(value => allowedLocations.has(value));
  return list.length ? list : ['Riyadh'];
};

const LEVEL_CODE_SET = new Set<LevelCode>(LEVELS.map(level => level.code));

const L = (code: string): LevelCode => {
  const normalized = code.toUpperCase() as LevelCode;
  return LEVEL_CODE_SET.has(normalized) ? normalized : 'L1';
};

export type LmsDetail = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseCategory: string;
  deliveryMode: 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online';
  duration: 'Bite-size' | 'Short' | 'Medium' | 'Long';
  levelCode: LevelCode;
  department: string[];
  locations: string[];
  audience: Array<'Associate' | 'Lead'>;
  status: 'live' | 'coming-soon';
  summary: string;
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
        type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading';
        order: number;
        isLocked?: boolean;
      }>;
    }>;
    // For Single Lesson: lessons directly (no topics)
    lessons?: Array<{
      id: string;
      title: string;
      description?: string;
      duration?: string;
      type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading';
      order: number;
      isLocked?: boolean;
    }>;
  }>;
};

// Database types (snake_case from Supabase)
type DBCourse = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  delivery_mode: string;
  duration: string;
  level_code: string;
  department: string[];
  locations: string[];
  audience: string[];
  status: string;
  summary: string;
  highlights: string[];
  outcomes: string[];
  course_type: string | null;
  track: string | null;
  rating: number | null;
  review_count: number | null;
  testimonials: any;
  case_studies: any;
  references: any;
  faq: any;
  image_url?: string | null;
};

type DBCurriculumItem = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  item_order: number;
  is_locked: boolean;
  course_slug: string | null;
};

type DBTopic = {
  id: string;
  curriculum_item_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  topic_order: number;
  is_locked: boolean;
};

type DBLesson = {
  id: string;
  topic_id: string | null;
  curriculum_item_id: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  type: string;
  lesson_order: number;
  is_locked: boolean;
};

/**
 * Fetches all courses from Supabase
 * Uses 'lms_courses' table
 */
async function fetchCourses(): Promise<DBCourse[]> {
  try {
    console.log('[LMS] Fetching courses from Supabase (lms_courses table)...');
    
    const { data, error } = await supabaseClient
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
 * Fetches all curriculum items for given course IDs
 */
async function fetchCurriculumItems(courseIds: string[]): Promise<DBCurriculumItem[]> {
  if (courseIds.length === 0) return [];

  const { data, error } = await supabaseClient
    .from('lms_curriculum_items')
    .select('*')
    .in('course_id', courseIds)
    .order('item_order');

  if (error) {
    console.error('Error fetching curriculum items:', error);
    throw new Error(`Failed to fetch curriculum items: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetches all topics for given curriculum item IDs
 */
async function fetchTopics(curriculumItemIds: string[]): Promise<DBTopic[]> {
  if (curriculumItemIds.length === 0) return [];

  const { data, error } = await supabaseClient
    .from('lms_topics')
    .select('*')
    .in('curriculum_item_id', curriculumItemIds)
    .order('topic_order');

  if (error) {
    console.error('Error fetching topics:', error);
    throw new Error(`Failed to fetch topics: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetches all lessons for given topic IDs and curriculum item IDs
 */
async function fetchLessons(topicIds: string[], curriculumItemIds: string[]): Promise<DBLesson[]> {
  const allLessons: DBLesson[] = [];

  // Fetch lessons for topics
  if (topicIds.length > 0) {
    const { data, error } = await supabaseClient
      .from('lms_lessons')
      .select('*')
      .in('topic_id', topicIds)
      .order('lesson_order');

    if (error) {
      console.error('Error fetching lessons for topics:', error);
      throw new Error(`Failed to fetch lessons: ${error.message}`);
    }

    if (data) {
      allLessons.push(...data);
    }
  }

  // Fetch lessons for curriculum items
  if (curriculumItemIds.length > 0) {
    const { data, error } = await supabaseClient
      .from('lms_lessons')
      .select('*')
      .in('curriculum_item_id', curriculumItemIds)
      .is('topic_id', null) // Only get direct lessons, not ones in topics
      .order('lesson_order');

    if (error) {
      console.error('Error fetching lessons for curriculum items:', error);
      throw new Error(`Failed to fetch lessons: ${error.message}`);
    }

    if (data) {
      allLessons.push(...data);
    }
  }

  return allLessons;
}

/**
 * Transforms database course to LmsDetail format
 */
function transformCourseToLmsDetail(
  course: DBCourse,
  curriculumItems: DBCurriculumItem[],
  topics: DBTopic[],
  lessons: DBLesson[]
): LmsDetail {
  // Get curriculum items for this course
  const courseCurriculumItems = curriculumItems.filter(ci => ci.course_id === course.id);

  // Build curriculum structure
  const curriculum = courseCurriculumItems.map(curriculumItem => {
    // Get topics for this curriculum item
    const itemTopics = topics.filter(t => t.curriculum_item_id === curriculumItem.id);

    // Get lessons for this curriculum item (direct lessons, not in topics)
    const directLessons = lessons.filter(
      l => l.curriculum_item_id === curriculumItem.id && !l.topic_id
    );

    // Build topics with their lessons
    const topicsWithLessons = itemTopics.map(topic => {
      const topicLessons = lessons
        .filter(l => l.topic_id === topic.id)
        .map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          duration: lesson.duration || undefined,
          type: lesson.type as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
          order: lesson.lesson_order,
          isLocked: lesson.is_locked
        }))
        .sort((a, b) => a.order - b.order);

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description || undefined,
        duration: topic.duration || undefined,
        order: topic.topic_order,
        isLocked: topic.is_locked,
        lessons: topicLessons
      };
    }).sort((a, b) => a.order - b.order);

    // Transform direct lessons
    const transformedDirectLessons = directLessons
      .map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || undefined,
        duration: lesson.duration || undefined,
        type: lesson.type as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
        order: lesson.lesson_order,
        isLocked: lesson.is_locked
      }))
      .sort((a, b) => a.order - b.order);

    const curriculumItemData: any = {
      id: curriculumItem.id,
      title: curriculumItem.title,
      description: curriculumItem.description || undefined,
      duration: curriculumItem.duration || undefined,
      order: curriculumItem.item_order,
      isLocked: curriculumItem.is_locked
    };

    // Add course slug if present (for bundles)
    if (curriculumItem.course_slug) {
      curriculumItemData.courseSlug = curriculumItem.course_slug;
    }

    // Add topics if present (for multi-lesson courses or bundles)
    if (topicsWithLessons.length > 0) {
      curriculumItemData.topics = topicsWithLessons;
    }

    // Add direct lessons if present (for single lesson courses)
    if (transformedDirectLessons.length > 0) {
      curriculumItemData.lessons = transformedDirectLessons;
    }

    return curriculumItemData;
  }).sort((a, b) => a.order - b.order);

  // Transform the course
  const lmsDetail: LmsDetail = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.category,
    deliveryMode: course.delivery_mode as 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online',
    duration: course.duration as 'Bite-size' | 'Short' | 'Medium' | 'Long',
    levelCode: L(course.level_code),
    department: course.department || [],
    locations: course.locations || [],
    audience: (course.audience || []) as Array<'Associate' | 'Lead'>,
    status: course.status as 'live' | 'coming-soon',
    summary: course.summary,
    highlights: course.highlights || [],
    outcomes: course.outcomes || [],
    courseType: course.course_type as 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)' | undefined,
    track: course.track || undefined,
    rating: course.rating || undefined,
    reviewCount: course.review_count || undefined,
    imageUrl: course.image_url || undefined
  };

  // Add optional fields if present
  if (course.testimonials) {
    lmsDetail.testimonials = course.testimonials;
  }
  if (course.case_studies) {
    lmsDetail.caseStudies = course.case_studies;
  }
  if (course.references) {
    lmsDetail.references = course.references;
  }
  if (course.faq) {
    lmsDetail.faq = course.faq;
  }

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
    console.log(`[LMS] Fetching curriculum items for ${courseIds.length} courses...`);

    // Fetch curriculum items first
    const curriculumItems = await fetchCurriculumItems(courseIds);
    console.log(`[LMS] Found ${curriculumItems.length} curriculum items`);
    
    const curriculumItemIds = curriculumItems.map(ci => ci.id);

    // Fetch topics for all curriculum items
    console.log(`[LMS] Fetching topics for ${curriculumItemIds.length} curriculum items...`);
    const topics = await fetchTopics(curriculumItemIds);
    console.log(`[LMS] Found ${topics.length} topics`);
    
    const topicIds = topics.map(t => t.id);

    // Fetch lessons for topics and curriculum items
    console.log(`[LMS] Fetching lessons for ${topicIds.length} topics and ${curriculumItemIds.length} curriculum items...`);
    const lessons = await fetchLessons(topicIds, curriculumItemIds);
    console.log(`[LMS] Found ${lessons.length} lessons`);

    // Transform all courses
    console.log('[LMS] Transforming courses to LmsDetail format...');
    const lmsDetails = courses.map(course =>
      transformCourseToLmsDetail(course, curriculumItems, topics, lessons)
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
  levelCode: LevelCode;
  levelLabel: string;
  levelShortLabel: string;
  locations: string[];
  audience: string[];
  status: string;
  summary: string;
  department: string[];
  courseType?: 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)';
  track?: string;
  imageUrl?: string;
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
  levelCode: detail.levelCode,
  levelLabel: levelLabelFromCode(detail.levelCode),
  levelShortLabel: levelShortLabelFromCode(detail.levelCode),
  locations: detail.locations,
  audience: detail.audience,
  status: detail.status,
  summary: detail.summary,
  department: detail.department,
  courseType: detail.courseType || 'Course (Single Lesson)',
  track: detail.track,
    imageUrl: detail.imageUrl
  }));
}

// For backwards compatibility, export a synchronous version that returns empty array
// Components should use getLmsCourses() instead
export const LMS_COURSES: LmsCard[] = [];
