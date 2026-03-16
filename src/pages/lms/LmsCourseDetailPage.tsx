import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  BookmarkIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Clock,
  HomeIcon,
  MapPin,
  PlayCircleIcon,
  Star,
  MessageSquare,
  FileText,
  ExternalLink,
  Video,
  BookOpen,
  HelpCircle,
  Users,
  FileCheck,
  Lock,
  Library,
  Loader2
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourse, useLmsCourseDetails } from '../../hooks/useLmsCourses';
import { useCourseReviews, useCourseReviewStats } from '../../hooks/useCourseReviews';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import {
  CARD_ICON_BY_ID,
  DEFAULT_COURSE_ICON,
  resolveChipIcon
} from '../../utils/lmsIcons';
import { SFIA_LEVELS, LOCATION_ALLOW } from '@/lms/config';
import { formatDurationFromMinutes } from '../../utils/durationFormatter';
import { findLearningPathsForCourse, fetchCoursesInLearningPath } from '../../services/lmsService';
import { useQuery } from '@tanstack/react-query';

const formatChips = (course: LmsDetail) => {
  try {
    const levelLabel = SFIA_LEVELS.find(level => level.code === course.levelCode)?.label;
    const chips: Array<{ key: string; label: string; iconValue?: string }> = [];

    const audience = course.audience || [];
    const isLeadOnly = audience.length === 1 && audience[0] === 'Lead';
    if (isLeadOnly) {
      chips.push({ key: 'audience', label: 'Lead-only', iconValue: 'Lead' });
    }
    if (course.courseType) {
      chips.push({ key: 'courseType', label: course.courseType, iconValue: course.courseType });
    }
    return chips;
  } catch (error) {
    console.error('[LMS] Error formatting chips:', error, course);
    return [];
  }
};

const formatList = (values: string[] | null | undefined): string => {
  if (!values || !Array.isArray(values)) return '';
  return values.join(', ');
};

const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video;
    case 'guide':
      return BookOpen;
    case 'quiz':
      return HelpCircle;
    case 'workshop':
      return Users;
    case 'assignment':
      return FileCheck;
    case 'reading':
      return FileText;
    case 'final-assessment':
      return CheckCircleIcon;
    default:
      return BookOpen;
  }
};

const getLessonTypeLabel = (type: string) => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'guide':
      return 'Guide';
    case 'quiz':
      return 'Quiz';
    case 'workshop':
      return 'Workshop';
    case 'assignment':
      return 'Assignment';
    case 'reading':
      return 'Reading';
    case 'final-assessment':
      return 'Final Assessment';
    default:
      return type;
  }
};

type TabType = 'details' | 'outcomes' | 'curriculum' | 'reviews' | 'faq';

export const LmsCourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  // State for expanded sections in curriculum
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [hasInitializedCurriculum, setHasInitializedCurriculum] = useState(false);
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Fetch course data from Supabase - MUST be called before any conditional returns
  const { data: course, isLoading: courseLoading, isFetching: courseFetching, error: courseError } = useLmsCourse(slug || '');
  const { data: allCourses = [] } = useLmsCourseDetails();

  // Fetch course reviews from database
  const { data: courseReviews = [], isLoading: reviewsLoading } = useCourseReviews(course?.id || '');
  const { data: reviewStats } = useCourseReviewStats(course?.id || '');

  // Find learning paths that contain this course
  const { data: learningPaths = [] } = useQuery({
    queryKey: ['learning-paths-for-course', course?.id],
    queryFn: () => course?.id ? findLearningPathsForCourse(course.id) : Promise.resolve([]),
    enabled: !!course?.id,
  });

  // Fetch courses in the first learning path (if course is part of a track)
  const firstPath = learningPaths[0];
  const { data: pathCourses = [] } = useQuery({
    queryKey: ['courses-in-path', firstPath?.pathId],
    queryFn: () => firstPath?.pathId ? fetchCoursesInLearningPath(firstPath.pathId) : Promise.resolve([]),
    enabled: !!firstPath?.pathId,
  });

  // Track previous slug to detect navigation
  const prevSlugRef = React.useRef<string | undefined>(slug);
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Reset component state when slug changes (navigation to different course)
  React.useEffect(() => {
    if (prevSlugRef.current !== slug && prevSlugRef.current !== undefined) {
      setIsNavigating(true);
      setExpandedCourses(new Set());
      setExpandedTopics(new Set());
      setHasInitializedCurriculum(false);
      setActiveTab('details'); // Reset to details tab on navigation
      setRenderError(null);
      prevSlugRef.current = slug;
    } else if (prevSlugRef.current === undefined) {
      prevSlugRef.current = slug;
    }
  }, [slug]);

  // Helper to check lesson completion (copied from LmsLessonPage for consistency)
  const isLessonCompleted = (lessonId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`lms_lesson_completed_${lessonId}`) === 'true';
  };

  // Helper check all previous lessons
  const arePreviousLessonsCompleted = (
    allLessons: Array<{ id: string; order: number }>,
    currentLessonId: string
  ): boolean => {
    const currentLesson = allLessons.find(l => l.id === currentLessonId);
    if (!currentLesson) return true;

    // Find index
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex <= 0) return true; // First lesson is distinct

    // Check all previous
    const previousLessons = allLessons.slice(0, currentIndex);
    return previousLessons.every(l => isLessonCompleted(l.id));
  };

  // Reset navigating state when course data is loaded and matches current slug
  React.useEffect(() => {
    if (course && !courseFetching) {
      // Only reset if the course slug matches the current route slug
      if (course.slug === slug || course.slug.toLowerCase() === slug?.toLowerCase()) {
        setIsNavigating(false);
      }
    }
  }, [course, courseFetching, slug]);

  // Log course data for debugging
  React.useEffect(() => {
    if (course) {
      console.log('[LMS Detail Page] Course loaded:', {
        id: course.id,
        slug: course.slug,
        title: course.title,
        duration: course.duration,
        durationMinutes: course.durationMinutes,
        hasHighlights: !!course.highlights,
        hasOutcomes: !!course.outcomes,
        hasCurriculum: !!course.curriculum,
        highlightsCount: course.highlights?.length || 0,
        outcomesCount: course.outcomes?.length || 0,
        curriculumCount: course.curriculum?.length || 0,
      });
      console.log('[LMS Detail Page] Full course object:', JSON.stringify(course, null, 2));
    } else {
      console.log('[LMS Detail Page] No course data found');
    }
  }, [course]);

  // Auto-expand first module when data loads
  React.useEffect(() => {
    if (!hasInitializedCurriculum && course?.curriculum && course.curriculum.length > 0) {
      setExpandedCourses(new Set([course.curriculum[0].id]));
      setHasInitializedCurriculum(true);
    }
  }, [course, hasInitializedCurriculum]);

  // Log any errors
  React.useEffect(() => {
    if (courseError) {
      console.error('[LMS Detail Page] Course error:', courseError);
    }
  }, [courseError]);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Ensure arrays exist with defaults - these are not hooks, just computed values
  const highlights = course?.highlights || [];
  const outcomes = course?.outcomes || [];
  const curriculum = course?.curriculum || [];

  // Calculate all topics across all curriculum items for sequential module numbering
  const allTopics = useMemo(() => {
    const topics: Array<{ topic: any; curriculumItemId: string }> = [];
    curriculum
      .sort((a, b) => a.order - b.order)
      .forEach((item) => {
        if (item.topics && item.topics.length > 0) {
          item.topics
            .sort((a, b) => a.order - b.order)
            .forEach((topic) => {
              topics.push({ topic, curriculumItemId: item.id });
            });
        }
      });
    return topics;
  }, [curriculum]);

  // Flatten all lessons for lock logic
  const allFlattenedLessons = useMemo(() => {
    const lessons: Array<{ id: string; order: number; type: string }> = [];
    const sortedCurriculum = [...curriculum].sort((a, b) => a.order - b.order);

    sortedCurriculum.forEach(item => {
      // If item has topics (old structure)
      if (item.topics && item.topics.length > 0) {
        item.topics.sort((a, b) => a.order - b.order).forEach(topic => {
          if (topic.lessons) {
            topic.lessons.sort((a, b) => a.order - b.order).forEach(l => {
              lessons.push({ id: l.id, order: lessons.length, type: l.type });
            });
          }
        });
      }
      // If item has direct lessons (new structure / simple courses)
      else if (item.lessons && item.lessons.length > 0) {
        item.lessons.sort((a, b) => a.order - b.order).forEach(l => {
          lessons.push({ id: l.id, order: lessons.length, type: l.type });
        });
      }
    });
    return lessons;
  }, [curriculum]);

  // Calculate course stats for sidebar
  const courseStats = useMemo(() => {
    let totalLessons = 0;
    let totalModules = 0;

    curriculum.forEach((item) => {
      if (item.topics && Array.isArray(item.topics)) {
        totalModules += item.topics.length;
        item.topics.forEach((topic) => {
          if (topic.lessons && Array.isArray(topic.lessons)) {
            totalLessons += topic.lessons.length;
          }
        });
      } else if (item.lessons && Array.isArray(item.lessons)) {
        totalModules += 1;
        totalLessons += item.lessons.length;
      }
    });

    return { totalLessons, totalModules };
  }, [curriculum]);

  // Get first lesson for "Start Lesson" button
  const firstLesson = useMemo(() => {
    if (!curriculum || curriculum.length === 0) return null;

    // Sort curriculum by order
    const sortedCurriculum = [...curriculum].sort((a, b) => a.order - b.order);

    // Find first lesson
    for (const item of sortedCurriculum) {
      if (item.lessons && item.lessons.length > 0) {
        const sortedLessons = [...item.lessons].sort((a, b) => a.order - b.order);
        if (sortedLessons.length > 0 && !sortedLessons[0].isLocked) {
          return sortedLessons[0];
        }
      }
      if (item.topics && item.topics.length > 0) {
        const sortedTopics = [...item.topics].sort((a, b) => a.order - b.order);
        for (const topic of sortedTopics) {
          if (topic.lessons && topic.lessons.length > 0) {
            const sortedLessons = [...topic.lessons].sort((a, b) => a.order - b.order);
            if (sortedLessons.length > 0 && !sortedLessons[0].isLocked) {
              return sortedLessons[0];
            }
          }
        }
      }
    }

    return null;
  }, [curriculum]);

  const relatedCourses = useMemo(() => {
    if (!course) return [];
    // If course is part of a track, show other courses in the same track
    if (course.track) {
      return allCourses.filter(
        detail => detail.track === course.track && detail.id !== course.id
      );
    }
    // Otherwise show courses in the same category
    return allCourses.filter(
      detail => detail.courseCategory === course.courseCategory && detail.id !== course.id
    );
  }, [course, allCourses]);

  // Process course data with defensive checks - hooks must be called unconditionally
  const chipData = useMemo(() => {
    if (!course) return [];
    try {
      return formatChips(course);
    } catch (error) {
      console.error('[LMS Detail Page] Error formatting chips:', error);
      return [];
    }
  }, [course]);

  // NOW we can have conditional returns - all hooks have been called above
  // Show loading state - check both isLoading and isNavigating to handle route changes
  if (courseLoading || (isNavigating && !course)) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Show error state
  if (courseError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Error Loading Course
            </h2>
            <p className="text-gray-600 mb-6">
              {courseError.message || 'An error occurred while loading the course details.'}
            </p>
            <button
              onClick={() => navigate('/lms')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: '#030F35' }}
            >
              Back to DQ Learning Center
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Show not found state - also check if course slug doesn't match current slug
  if (!course || (course.slug !== slug && course.slug.toLowerCase() !== slug?.toLowerCase())) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Course or Track Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't locate that course or track. Head back to the learning center to explore the latest learning paths.
            </p>
            <button
              onClick={() => navigate('/lms')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: '#030F35' }}
            >
              Back to DQ Learning Center
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Compute other values safely
  const HeroIcon = course ? (CARD_ICON_BY_ID[course.id] || DEFAULT_COURSE_ICON) : DEFAULT_COURSE_ICON;
  const statusLabel = course?.status === 'live' ? 'Live' : 'Coming Soon';
  const statusClass = course?.status === 'live' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200';
  const locationsLabel = formatList(course?.locations);
  const audienceLabel = formatList(course?.audience);
  const departmentLabel = formatList(course?.department);
  const averageRating = course?.rating || 0;
  const reviewCount = course?.reviewCount || 0;

  const isTrack = course?.courseType === 'Course (Bundles)';
  const tabs = [
    { id: 'details' as TabType, label: isTrack ? 'Track Details' : 'Course Details' },
    { id: 'outcomes' as TabType, label: 'Learning Outcomes' },
    { id: 'curriculum' as TabType, label: isTrack ? 'Track Curriculum' : 'Curriculum' },
    { id: 'reviews' as TabType, label: 'Reviews' },
    ...(isTrack && course?.faq && Array.isArray(course.faq) && course.faq.length > 0 ? [{ id: 'faq' as TabType, label: 'FAQ' }] : []),
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        {/* Hero Section */}
        <div
          className="w-full border-b border-gray-200 relative"
          style={{
            backgroundImage: course?.imageUrl
              ? `url(${course.imageUrl})`
              : 'linear-gradient(to right, rgb(239 246 255), rgb(243 232 255))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26, 46, 110, 0.6)' }}></div>
          <div className="relative z-10">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12">
              <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                  <li className="inline-flex items-center">
                    <Link to="/" className="text-white/80 hover:text-white inline-flex items-center">
                      <HomeIcon size={16} className="mr-1" />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-white/60" />
                      <Link to="/lms" className="ml-1 text-white/80 hover:text-white md:ml-2">
                        Courses
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-white/60" />
                      <span className="ml-1 text-white/80 md:ml-2 truncate max-w-[200px]">
                        {course.title}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-white font-medium">{course.provider}</span>
                    {course.track && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm font-medium" style={{ color: '#fcfcfc' }}>{course.track}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <HeroIcon className="h-6 w-6 shrink-0" style={{ color: '#fff' }} aria-hidden="true" />
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">
                      {course.title}
                    </h1>
                  </div>

                  {/* Rating and Reviews */}
                  {averageRating > 0 && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-lg font-semibold text-white">{averageRating.toFixed(1)}</span>
                      </div>
                      <Link
                        to={`/lms/${course.slug}/reviews`}
                        className="font-medium flex items-center gap-1 hover:underline text-white"
                      >
                        <MessageSquare size={16} />
                        <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {chipData.map((chip, index) => {
                      const Icon = resolveChipIcon(chip.key, chip.iconValue ?? chip.label);
                      return (
                        <span
                          key={`${chip.key}-${chip.label}-${index}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-white/20 backdrop-blur-sm border-white/30 text-white"
                        >
                          {Icon ? <Icon className="h-4 w-4 mr-1.5" /> : null}
                          {chip.label}
                        </span>
                      );
                    })}
                  </div>

                </div>
                <div className="flex items-start gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  style={activeTab === tab.id ? { borderColor: '#030F35', color: '#030F35' } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">


              {/* Learning Outcomes Tab */}
              {activeTab === 'outcomes' && (
                <section className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <CheckCircleIcon size={18} className="text-white" />
                      </span>
                      What You'll Learn
                    </h3>
                    <ul className="space-y-4">
                      {outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-3 group">
                          <div className="mt-2 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                          <p className="text-gray-700 leading-relaxed">{outcome}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Track/Course Details Tab */}
              {activeTab === 'details' && (
                <section className="space-y-8">
                  {/* Summary Cards */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                          <Clock size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {course.durationMinutes !== undefined && course.durationMinutes > 0
                              ? formatDurationFromMinutes(course.durationMinutes)
                              : course.duration || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                          <Star size={24} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Level</p>
                          <p className="text-sm font-semibold text-gray-900">{SFIA_LEVELS.find(level => level.code === course.levelCode)?.label || course.levelCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                          <PlayCircleIcon size={24} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">Delivery Mode</p>
                          <p className="text-sm font-semibold text-gray-900">{course.deliveryMode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                          <BookOpen size={24} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            {isTrack ? 'Courses' : 'Lessons'}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {isTrack
                              ? `${curriculum.length} courses`
                              : `${courseStats.totalLessons} lessons`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {course.summary}
                    </p>
                  </div>

                  {/* Course Highlights */}
                  {highlights.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {isTrack ? 'Track Highlights' : 'Course Highlights'}
                      </h3>
                      <div className="space-y-3">
                        {highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-start gap-3"
                          >
                            <CheckCircleIcon size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Part of Track Section */}
                  {firstPath && pathCourses.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#030F35' }}>
                        Part of {firstPath.pathTitle}
                      </h3>
                      <p className="text-gray-700 mb-4 text-sm">
                        This course is part of a larger learning track. Explore other courses in this track to complete your learning journey.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {pathCourses.map((pathCourse, index) => {
                          const isCurrentCourse = pathCourse.slug === course?.slug;
                          return (
                            <React.Fragment key={pathCourse.id}>
                              {index > 0 && (
                                <span className="text-gray-400" style={{ color: '#030F35' }}>→</span>
                              )}
                              {isCurrentCourse ? (
                                <span
                                  className="font-medium text-sm"
                                  style={{ color: '#030F35' }}
                                >
                                  {pathCourse.title}
                                </span>
                              ) : (
                                <Link
                                  to={`/lms/${pathCourse.slug}`}
                                  className="font-medium text-sm hover:underline"
                                  style={{ color: '#030F35' }}
                                >
                                  {pathCourse.title}
                                </Link>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <section className="space-y-4">
                  {curriculum && curriculum.length > 0 && (
                    <div className="flex items-center justify-start mb-2">
                      <span className="text-sm text-gray-600">
                        {isTrack
                          ? `This track has ${curriculum.length} ${curriculum.length === 1 ? 'course' : 'courses'}`
                          : `This course has ${courseStats.totalModules} ${courseStats.totalModules === 1 ? 'module' : 'modules'} and ${courseStats.totalLessons} ${courseStats.totalLessons === 1 ? 'lesson' : 'lessons'}`}
                      </span>
                    </div>
                  )}
                  {curriculum && curriculum.length > 0 ? (
                    <div className="space-y-4">
                      {curriculum
                        .sort((a, b) => a.order - b.order)
                        .map((item, curriculumIndex) => {
                          // Unified Module Rendering

                          // Determine lessons for this module
                          let moduleLessons: any[] = [];
                          if (item.topics && item.topics.length > 0) {
                            // Flatten topics lessons
                            item.topics.sort((a: any, b: any) => a.order - b.order).forEach((t: any) => {
                              if (t.lessons) moduleLessons = [...moduleLessons, ...t.lessons];
                            });
                          } else if (item.lessons) {
                            moduleLessons = item.lessons;
                          }
                          moduleLessons.sort((a, b) => a.order - b.order);

                          const isExpanded = expandedCourses.has(item.id);

                          const toggleExpand = () => {
                            setExpandedCourses(prev => {
                              const next = new Set(prev);
                              if (next.has(item.id)) next.delete(item.id);
                              else next.add(item.id);
                              return next;
                            });
                          };

                          if (isTrack) {
                            return (
                              <Link
                                key={item.id}
                                to={`/lms/${item.courseSlug}`}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden block hover:border-blue-500 hover:shadow-md transition-all group"
                              >
                                <div className="p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                      <Library size={20} />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                      </h3>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-medium text-indigo-600">
                                          Course {curriculumIndex + 1}
                                        </span>
                                        {item.duration && (
                                          <>
                                            <span className="text-gray-300">·</span>
                                            <div className="flex items-center gap-1">
                                              <Clock size={12} className="text-gray-400" />
                                              <span>{item.duration}</span>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRightIcon size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                              </Link>
                            );
                          }

                          // Check if this is Final Assessment module
                          const isFinalAssessmentModule = moduleLessons.some(l => l.type === 'final-assessment');

                          return (
                            <div key={item.id} className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all ${isFinalAssessmentModule ? 'mt-8' : ''}`}>
                              {/* Module Header */}
                              <div
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
                                onClick={toggleExpand}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isFinalAssessmentModule ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {isFinalAssessmentModule ? <CheckCircleIcon size={20} /> : <FileText size={20} />}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                      {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <span>
                                        {isFinalAssessmentModule
                                          ? `Module ${curriculumIndex + 1}. 1 lesson`
                                          : `Module ${curriculumIndex + 1}. ${moduleLessons.length} lessons`
                                        }
                                      </span>
                                      {item.duration && (
                                        <>
                                          <span className="text-gray-300">·</span>
                                          <div className="flex items-center gap-1">
                                            <Clock size={12} className="text-gray-400" />
                                            <span>{item.duration}</span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button className="text-gray-400">
                                  {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                                </button>
                              </div>

                              {/* Lessons List */}
                              {isExpanded && (
                                <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                                  {moduleLessons.map((lesson, lIndex) => {
                                    const LessonIcon = getLessonTypeIcon(lesson.type);
                                    // Lock logic: If is_locked is false in DB, lesson is always accessible.
                                    // If is_locked is true (or undefined for backward compatibility), use sequential order.
                                    const isLocked = lesson.isLocked === false
                                      ? false
                                      : !arePreviousLessonsCompleted(allFlattenedLessons, lesson.id);
                                    // const isCompleted = isLessonCompleted(lesson.id);

                                    return (
                                      <div
                                        key={lesson.id}
                                        onClick={() => !isLocked && navigate(`/lms/${course.slug}/lesson/${lesson.id}`)}
                                        className={`flex items-start p-4 rounded-xl border transition-all ${isLocked
                                          ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-70'
                                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                                          }`}
                                      >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4 ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'
                                          }`}>
                                          {isLocked ? <Lock size={18} /> : <LessonIcon size={18} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-gray-500">
                                              Lesson {curriculumIndex + 1}.{lIndex + 1}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                              {getLessonTypeLabel(lesson.type)}
                                            </span>
                                            {isLocked && (
                                              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                                Locked
                                              </span>
                                            )}
                                          </div>
                                          <h4 className={`text-base font-semibold mb-1 ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {lesson.title}
                                          </h4>
                                          {lesson.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                              {lesson.description}
                                            </p>
                                          )}
                                          {lesson.duration && (
                                            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                                              <Clock size={14} />
                                              <span>{lesson.duration}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Curriculum details are not available for this course yet.
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <section className="space-y-6">
                  {/* Review Stats Summary */}
                  {reviewStats && reviewStats.totalReviews > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">{reviewStats.averageRating.toFixed(1)}</div>
                            <div className="flex items-center justify-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < Math.floor(reviewStats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}</div>
                          </div>
                          <div className="flex-1 max-w-xs">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = reviewStats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5];
                              const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                              return (
                                <div key={rating} className="flex items-center gap-2 text-sm">
                                  <span className="w-3 text-gray-600">{rating}</span>
                                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-yellow-400 rounded-full transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="w-6 text-gray-500 text-right">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <Link
                          to={`/lms/${slug}/reviews`}
                          className="text-sm font-medium hover:underline"
                          style={{ color: '#030F35' }}
                        >
                          View All Reviews →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : courseReviews.length > 0 ? (
                    <div className="space-y-4">
                      {courseReviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.user_name || review.user_email.split('@')[0]}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={i < review.star_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {review.engaging_part && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                Most Engaging: {review.engaging_part}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-700 mb-4">{review.general_feedback}</p>

                          {review.key_learning && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100/50">
                              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                                Key Takeaway
                              </p>
                              <p className="text-sm text-gray-700 italic">"{review.key_learning}"</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {courseReviews.length > 5 && (
                        <div className="text-center pt-4">
                          <Link
                            to={`/lms/${slug}/reviews`}
                            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            style={{ color: '#030F35' }}
                          >
                            View All {courseReviews.length} Reviews
                            <ChevronRightIcon size={16} />
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600">
                        Be the first to share your experience with this course. Complete the course to leave a review.
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* FAQ Tab (only for tracks) */}
              {activeTab === 'faq' && isTrack && course.faq && course.faq.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle size={24} style={{ color: '#030F35' }} />
                    <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                  </div>
                  <div className="space-y-4">
                    {course.faq.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                          <span className="mr-3 flex-shrink-0" style={{ color: '#030F35' }}>
                            Q{index + 1}:
                          </span>
                          <span>{item.question}</span>
                        </h3>
                        <p className="text-gray-700 leading-relaxed ml-8">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Track Information - Only show for courses that are part of a track, not for tracks themselves */}
              {course.track && !isTrack && (
                <section className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Part of {course.track}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    This course is part of a larger learning track. Explore other courses in this track to complete your learning journey.
                  </p>
                  {relatedCourses.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {relatedCourses.map((related) => (
                        <Link
                          key={related.id}
                          to={`/lms/${related.slug}`}
                          className="font-medium text-sm hover:underline"
                          style={{ color: '#030F35' }}
                        >
                          {related.title} →
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Track Courses Information - Show for tracks to highlight courses within the track */}
              {isTrack && course.curriculum && course.curriculum.length > 0 && (
                <section className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Courses in this Track
                  </h3>
                  <p className="text-gray-700 mb-4">
                    This track contains {curriculum.length} {curriculum.length === 1 ? 'course' : 'courses'}. Complete all courses to master the full learning journey. Each course can be accessed individually, and you can view the detailed curriculum in the Curriculum tab above.
                  </p>
                  {curriculum.slice(0, 5).map((item) => (
                    <div key={item.id} className="mb-2">
                      {item.courseSlug ? (
                        <Link
                          to={`/lms/${item.courseSlug}`}
                          className="font-medium text-sm hover:underline flex items-center gap-1"
                          style={{ color: '#030F35' }}
                        >
                          {item.title}
                          <ChevronRightIcon size={14} />
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-700">{item.title}</span>
                      )}
                    </div>
                  ))}
                  {curriculum.length > 5 && (
                    <p className="text-sm text-gray-600 mt-2">
                      and {curriculum.length - 5} more {curriculum.length - 5 === 1 ? 'course' : 'courses'}
                    </p>
                  )}
                </section>
              )}

              {/* Reviews */}
              {course.testimonials && course.testimonials.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                  <div className="space-y-4">
                    {course.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">"{testimonial.text}"</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Case Studies */}
              {course.caseStudies && course.caseStudies.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Studies</h2>
                  <div className="space-y-4">
                    {course.caseStudies.map((caseStudy, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
                            <p className="text-gray-700 mb-4">{caseStudy.description}</p>
                            {caseStudy.link && (
                              <a
                                href={caseStudy.link}
                                className="font-medium flex items-center gap-1 hover:underline"
                                style={{ color: '#030F35' }}
                              >
                                View Case Study
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                          <FileText size={24} className="text-gray-400 ml-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {course.references && course.references.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">References</h2>
                  <div className="space-y-4">
                    {course.references.map((reference, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{reference.title}</h3>
                            <p className="text-gray-700 mb-4">{reference.description}</p>
                            {reference.link && (
                              <a
                                href={reference.link}
                                className="font-medium flex items-center gap-1 hover:underline"
                                style={{ color: '#030F35' }}
                              >
                                View Reference
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                          <FileText size={24} className="text-gray-400 ml-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isTrack ? 'Track Summary' : 'Course Summary'}
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900">
                      {course.durationMinutes !== undefined && course.durationMinutes > 0
                        ? formatDurationFromMinutes(course.durationMinutes)
                        : course.duration || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{isTrack ? 'Courses' : 'Lessons'}</span>
                    <span className="font-medium text-gray-900">
                      {isTrack
                        ? `${curriculum.length} ${curriculum.length === 1 ? 'course' : 'courses'}`
                        : `${courseStats.totalLessons} ${courseStats.totalLessons === 1 ? 'lesson' : 'lessons'}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Level</span>
                    <span className="font-medium text-gray-900 text-right">
                      {SFIA_LEVELS.find(level => level.code === course.levelCode)?.label || course.levelCode}
                    </span>
                  </div>
                  {courseStats.totalModules > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Modules</span>
                      <span className="font-medium text-gray-900">
                        {courseStats.totalModules} {courseStats.totalModules === 1 ? 'module' : 'modules'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (firstLesson && course.status !== 'coming-soon') {
                        navigate(`/lms/${course.slug}/lesson/${firstLesson.id}`);
                      }
                    }}
                    disabled={!firstLesson || course.status === 'coming-soon'}
                    className={`w-full px-4 py-3 text-white font-semibold rounded-md transition-colors shadow-md ${firstLesson && course.status !== 'coming-soon' ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                      }`}
                    style={{ backgroundColor: course.status === 'coming-soon' ? '#9CA3AF' : '#030F35' }}
                  >
                    {course.status === 'coming-soon' ? 'Coming Soon' : (isTrack ? 'Enroll to Curriculum' : 'Start Course')}
                  </button>
                  <button
                    className="w-full px-4 py-2.5 font-medium bg-white border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                    style={{ borderColor: '#030F35', color: '#030F35' }}
                  >
                    <BookmarkIcon size={16} className="mr-2" />
                    Save for Later
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Courses */}
        <section className="bg-gray-50 border-t border-gray-200 py-10">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {course.track ? `Other Courses in ${course.track}` : 'Related Courses'}
              </h2>
              <Link to="/lms" className="font-medium flex items-center hover:underline" style={{ color: '#030F35' }}>
                Browse all courses
                <ChevronRightIcon size={16} className="ml-1" />
              </Link>
            </div>
            {relatedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedCourses.map((related) => {
                  const RelatedIcon = CARD_ICON_BY_ID[related.id] || DEFAULT_COURSE_ICON;
                  return (
                    <div
                      key={related.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/lms/${related.slug}`)}
                    >
                      <div className="flex items-center mb-3 gap-2">
                        <RelatedIcon className="h-5 w-5" style={{ color: '#030F35' }} aria-hidden="true" />
                        <span className="text-sm text-gray-600">{related.provider}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                          {related.courseCategory}
                        </span>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                          {related.deliveryMode}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                No additional courses {course.track ? 'in this track' : 'in this category'} yet. Check back soon for fresh content.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourseDetailPage;
