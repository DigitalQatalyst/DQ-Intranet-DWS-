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
  Lock
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourse, useLmsCourseDetails } from '../../hooks/useLmsCourses';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import {
  CARD_ICON_BY_ID,
  DEFAULT_COURSE_ICON,
  resolveChipIcon
} from '../../utils/lmsIcons';
import { LEVELS, LOCATION_ALLOW } from '@/lms/config';

const formatChips = (course: LmsDetail) => {
  try {
  const levelLabel = LEVELS.find(level => level.code === course.levelCode)?.label;
  const chips: Array<{ key: string; label: string; iconValue?: string }> = [];
    const locations = course.locations || [];
    const location = locations.find(
    loc => loc !== 'Global' && (LOCATION_ALLOW as readonly string[]).includes(loc)
  );
  if (location) {
    chips.push({ key: 'location', label: location, iconValue: location });
  }
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
    default:
      return type;
  }
};

type TabType = 'highlights' | 'outcomes' | 'details' | 'curriculum' | 'faq';

export const LmsCourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('highlights');
  // State for expanded sections in curriculum
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Fetch course data from Supabase - MUST be called before any conditional returns
  const { data: course, isLoading: courseLoading, isFetching: courseFetching, error: courseError } = useLmsCourse(slug || '');
  const { data: allCourses = [] } = useLmsCourseDetails();

  // Track previous slug to detect navigation
  const prevSlugRef = React.useRef<string | undefined>(slug);
  const [isNavigating, setIsNavigating] = React.useState(false);
  
  // Reset component state when slug changes (navigation to different course)
  React.useEffect(() => {
    if (prevSlugRef.current !== slug && prevSlugRef.current !== undefined) {
      setIsNavigating(true);
      setExpandedCourses(new Set());
      setExpandedTopics(new Set());
      setActiveTab('highlights');
      setRenderError(null);
      prevSlugRef.current = slug;
    } else if (prevSlugRef.current === undefined) {
      prevSlugRef.current = slug;
    }
  }, [slug]);
  
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
              Back to Learning Center
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
              Back to Learning Center
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
    { id: 'highlights' as TabType, label: isTrack ? 'Track Highlights' : 'Course Highlights' },
    { id: 'outcomes' as TabType, label: 'Learning Outcomes' },
    { id: 'details' as TabType, label: isTrack ? 'Track Details' : 'Course Details' },
    { id: 'curriculum' as TabType, label: isTrack ? 'Track Curriculum' : 'Course Curriculum' },
    ...(isTrack && course?.faq && Array.isArray(course.faq) && course.faq.length > 0 ? [{ id: 'faq' as TabType, label: 'FAQ' }] : []),
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link to="/lms" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      courses
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2 truncate max-w-[200px]">
                      {course.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600 font-medium">{course.provider}</span>
                  {course.track && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm font-medium" style={{ color: '#030F35' }}>{course.track}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <HeroIcon className="h-6 w-6 shrink-0" style={{ color: '#030F35' }} aria-hidden="true" />
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
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
                            className={i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                    </div>
                    <Link
                      to={`/lms/${course.slug}/reviews`}
                      className="font-medium flex items-center gap-1 hover:underline"
                      style={{ color: '#030F35' }}
                    >
                      <MessageSquare size={16} />
                      <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
                    </Link>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {chipData.map((chip, index) => {
                    const Icon = resolveChipIcon(chip.key, chip.iconValue ?? chip.label);
                    return (
                      <span
                        key={`${chip.key}-${chip.label}-${index}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-50 border-blue-200"
                        style={{ color: '#030F35' }}
                      >
                      {Icon ? <Icon className="h-4 w-4 mr-1.5" /> : null}
                      {chip.label}
                      </span>
                    );
                })}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {course.summary}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusClass}`}>
                  {statusLabel}
                </span>
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
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
              {/* Track/Course Highlights Tab */}
              {activeTab === 'highlights' && (
                <section className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    {highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <CheckCircleIcon size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* Learning Outcomes Tab */}
              {activeTab === 'outcomes' && (
                <section className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ol className="space-y-4">
                    {outcomes.map((outcome, index) => (
                      <li key={outcome} className="flex items-start gap-3">
                        <span className="font-semibold" style={{ color: '#030F35' }}>{index + 1}.</span>
                        <p className="text-gray-700 leading-relaxed">{outcome}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
              )}

              {/* Track/Course Details Tab */}
              {activeTab === 'details' && (
                <section className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {course.summary}
                    </p>
                    {isTrack ? (
                      // Track Details: Show total hours, videos, articles, labs
                      (() => {
                        // Calculate track stats from curriculum
                        let totalHours = 0;
                        let videoCount = 0;
                        let articleCount = 0;
                        let labCount = 0;
                        
                        if (curriculum && curriculum.length > 0) {
                          curriculum.forEach((item) => {
                            if (item.topics) {
                              item.topics.forEach((topic) => {
                                if (topic.lessons) {
                                  topic.lessons.forEach((lesson) => {
                                    // Parse duration (e.g., "15 min", "2 hours")
                                    const duration = lesson.duration || '';
                                    const hoursMatch = duration.match(/(\d+)\s*h/i);
                                    const minsMatch = duration.match(/(\d+)\s*min/i);
                                    if (hoursMatch) {
                                      totalHours += parseInt(hoursMatch[1]);
                                    } else if (minsMatch) {
                                      totalHours += parseInt(minsMatch[1]) / 60;
                                    }
                                    
                                    // Count by type
                                    if (lesson.type === 'video') videoCount++;
                                    else if (lesson.type === 'reading' || lesson.type === 'guide') articleCount++;
                                    else if (lesson.type === 'workshop' || lesson.type === 'assignment') labCount++;
                                  });
                                }
                              });
                            }
                          });
                        }
                        
                        return (
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2" style={{ color: '#030F35' }} />
                              <span className="text-gray-600">
                                Total Hours: <span className="font-medium text-gray-900">{totalHours.toFixed(1)} hours</span>
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Video size={16} className="mr-2" style={{ color: '#030F35' }} />
                              <span className="text-gray-600">
                                Videos: <span className="font-medium text-gray-900">{videoCount}</span>
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FileText size={16} className="mr-2" style={{ color: '#030F35' }} />
                              <span className="text-gray-600">
                                Articles: <span className="font-medium text-gray-900">{articleCount}</span>
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-2" style={{ color: '#030F35' }} />
                              <span className="text-gray-600">
                                Labs: <span className="font-medium text-gray-900">{labCount}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // Course Details: Show regular course info
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" style={{ color: '#030F35' }} />
                          <span className="text-gray-600">
                            Duration: <span className="font-medium text-gray-900">{course.duration}</span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <PlayCircleIcon size={16} className="mr-2" style={{ color: '#030F35' }} />
                          <span className="text-gray-600">
                            Delivery Mode: <span className="font-medium text-gray-900">{course.deliveryMode}</span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" style={{ color: '#030F35' }} />
                          <span className="text-gray-600">
                            Location: <span className="font-medium text-gray-900">{locationsLabel}</span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircleIcon size={16} className="mr-2" style={{ color: '#030F35' }} />
                          <span className="text-gray-600">
                            Level: <span className="font-medium text-gray-900">{course.levelCode}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <section className="space-y-4">
                  {curriculum && curriculum.length > 0 && (
                    <div className="flex items-center justify-start mb-2">
                      <span className="text-sm text-gray-600">
                        This course has {courseStats.totalModules} {courseStats.totalModules === 1 ? 'module' : 'modules'} and {courseStats.totalLessons} {courseStats.totalLessons === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>
                  )}
                  {curriculum && curriculum.length > 0 ? (
                    <div className="space-y-4">
                      {curriculum
                        .sort((a, b) => a.order - b.order)
                        .map((item, curriculumIndex) => {
                          const isCourse = course.courseType === 'Course (Multi-Lessons)';
                          const isSingleLesson = course.courseType === 'Course (Single Lesson)';

                          // Track (Bundles): Show courses with topics and lessons, or just course links if no topics
                          if (isTrack) {
                            // If it has topics, show expandable section
                            if (item.topics && item.topics.length > 0) {
                              const isExpanded = expandedCourses.has(item.id);
                              const toggleCourse = () => {
                                setExpandedCourses(prev => {
                                  const next = new Set(prev);
                                  if (next.has(item.id)) {
                                    next.delete(item.id);
                                  } else {
                                    next.add(item.id);
                                  }
                                  return next;
                                });
                              };

                              return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                  {/* Course Header */}
                                  <div
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                      item.isLocked ? 'opacity-60' : ''
                                    }`}
                                    onClick={toggleCourse}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                          <BookOpen size={20} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                            {item.courseSlug && (
                                              <Link
                                                to={`/lms/${item.courseSlug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-sm font-medium flex items-center hover:underline"
                                                style={{ color: '#030F35' }}
                                              >
                                                View Course
                                                <ChevronRightIcon size={14} className="ml-1" />
                                              </Link>
                                            )}
                                          </div>
                                          {item.description && (
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                          )}
                                        </div>
                                      </div>
                                      <button className="ml-4 text-gray-400 hover:text-gray-600">
                                        {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Topics and Lessons (Expandable) */}
                                  {isExpanded && (
                                  <div className="border-t border-gray-200 bg-gray-50">
                                    {item.topics
                                      .sort((a, b) => a.order - b.order)
                                      .map((topic, index) => {
                                        const isTopicExpanded = expandedTopics.has(topic.id);
                                        const toggleTopic = () => {
                                          setExpandedTopics(prev => {
                                            const next = new Set(prev);
                                            if (next.has(topic.id)) {
                                              next.delete(topic.id);
                                            } else {
                                              next.add(topic.id);
                                            }
                                            return next;
                                          });
                                        };

                                        const lessonCount = topic.lessons?.length || 0;
                                        // Find the sequential module number across all topics
                                        const topicIndex = allTopics.findIndex(t => t.topic.id === topic.id);
                                        const moduleNumber = topicIndex >= 0 ? topicIndex + 1 : index + 1;

                                        return (
                                          <div key={topic.id} className="border-b border-gray-200 last:border-b-0">
                                            {/* Topic Header */}
                                            <div
                                              className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                              onClick={toggleTopic}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FileText size={16} />
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900">{topic.title}</h4>
                                                      <span className="text-xs text-gray-500">
                                                        Module {moduleNumber}. {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                                                      </span>
                                                    </div>
                                                    {topic.description && (
                                                      <p className="text-xs text-gray-600 mt-1">{topic.description}</p>
                                                    )}
                                                  </div>
                                                </div>
                                                <button className="ml-4 text-gray-400 hover:text-gray-600">
                                                  {isTopicExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                                                </button>
                                              </div>
                                            </div>

                                            {/* Lessons (Expandable) */}
                                            {isTopicExpanded && topic.lessons && (
                                              <div className="bg-white pl-12 pr-4 py-3 space-y-2">
                                                {topic.lessons
                                                  .sort((a, b) => a.order - b.order)
                                                  .map((lesson) => {
                                                    const LessonIcon = getLessonTypeIcon(lesson.type);
                                                    const isLocked = lesson.isLocked;
                                                    return (
                                                      <div
                                                        key={lesson.id}
                                                        className={`p-3 rounded-lg border ${
                                                          isLocked
                                                            ? 'border-gray-200 opacity-60 bg-gray-50'
                                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                                                        }`}
                                                      >
                                                        <div className="flex items-start gap-3">
                                                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            isLocked
                                                              ? 'bg-gray-100 text-gray-400'
                                                              : 'bg-blue-50 text-blue-600'
                                                          }`}>
                                                            {isLocked ? (
                                                              <Lock size={16} />
                                                            ) : (
                                                              <LessonIcon size={16} />
                                                            )}
                                                          </div>
                                                          <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                              <span className="text-xs font-medium text-gray-500">
                                                                Lesson {lesson.order}
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
                                                            <h5 className={`text-sm font-medium mb-1 ${
                                                              isLocked ? 'text-gray-500' : 'text-gray-900'
                                                            }`}>
                                                              {lesson.title}
                                                            </h5>
                                                            {lesson.description && (
                                                              <p className={`text-xs mb-2 ${
                                                                isLocked ? 'text-gray-400' : 'text-gray-600'
                                                              }`}>
                                                                {lesson.description}
                                                              </p>
                                                            )}
                                                            {lesson.duration && (
                                                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Clock size={12} />
                                                                <span>{lesson.duration}</span>
                                                              </div>
                                                            )}
                                                          </div>
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
                                )}
                              </div>
                            );
                            }
                            
                            // Track (Bundles): Show course link only (no topics preview)
                            if (item.courseSlug && (!item.topics || item.topics.length === 0)) {
                              return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                  <div className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                          <BookOpen size={20} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                          </div>
                                          {item.description && (
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                          )}
                                        </div>
                                      </div>
                                      {item.courseSlug && (
                                        <Link
                                          to={`/lms/${item.courseSlug}`}
                                          className="px-4 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap ml-4"
                                          style={{ 
                                            color: '#030F35',
                                            borderColor: '#030F35'
                                          }}
                                        >
                                          View Course
                                          <ChevronRightIcon size={14} className="inline ml-1" />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }

                          // Course (Multi-Lessons): Show topics with lessons
                          // Each curriculum item represents a topic, and each topic has nested topics with lessons
                          // OR curriculum item has lessons directly (legacy structure)
                          if (isCourse) {
                            // Handle structure with topics array
                            if (item.topics && item.topics.length > 0) {
                              // Check if section header title matches any topic title (to avoid duplicates)
                              const hasMatchingTopicTitle = item.topics.some(topic => topic.title === item.title);
                              const shouldShowSectionHeader = !hasMatchingTopicTitle && (item.topics.length > 1 || item.description);
                              
                              return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                  {/* Topic Section Header - Only show if title doesn't match topic titles */}
                                  {shouldShowSectionHeader && (
                                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    )}
                                  </div>
                                  )}

                                  {/* Topics within this section */}
                                  <div className={shouldShowSectionHeader ? "divide-y divide-gray-200" : ""}>
                                    {item.topics
                                      .sort((a, b) => a.order - b.order)
                                      .map((topic, index) => {
                                        const isTopicExpanded = expandedTopics.has(topic.id);
                                        const toggleTopic = () => {
                                          setExpandedTopics(prev => {
                                            const next = new Set(prev);
                                            if (next.has(topic.id)) {
                                              next.delete(topic.id);
                                            } else {
                                              next.add(topic.id);
                                            }
                                            return next;
                                          });
                                        };

                                        const lessonCount = topic.lessons?.length || 0;
                                        // Find the sequential module number across all topics
                                        const topicIndex = allTopics.findIndex(t => t.topic.id === topic.id);
                                        const moduleNumber = topicIndex >= 0 ? topicIndex + 1 : index + 1;

                                        return (
                                          <div key={topic.id}>
                                            {/* Topic Header */}
                                            <div
                                              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                              onClick={toggleTopic}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FileText size={16} />
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900">{topic.title}</h4>
                                                      <span className="text-xs text-gray-500">
                                                        Module {moduleNumber}. {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                                                      </span>
                                                    </div>
                                                    {topic.description && (
                                                      <p className="text-xs text-gray-600 mt-1">{topic.description}</p>
                                                    )}
                                                  </div>
                                                </div>
                                                <button className="ml-4 text-gray-400 hover:text-gray-600">
                                                  {isTopicExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                                                </button>
                                              </div>
                                            </div>

                                            {/* Lessons (Expandable) */}
                                            {isTopicExpanded && topic.lessons && (
                                              <div className="bg-gray-50 pl-12 pr-4 py-3 space-y-2">
                                                {topic.lessons
                                                  .sort((a, b) => a.order - b.order)
                                                  .map((lesson) => {
                                                    const LessonIcon = getLessonTypeIcon(lesson.type);
                                                    const isLocked = lesson.isLocked;
                                                    return (
                                                      <div
                                                        key={lesson.id}
                                                        className={`p-3 rounded-lg border ${
                                                          isLocked
                                                            ? 'border-gray-200 opacity-60 bg-gray-50'
                                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                                                        }`}
                                                      >
                                                        <div className="flex items-start gap-3">
                                                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            isLocked
                                                              ? 'bg-gray-100 text-gray-400'
                                                              : 'bg-blue-50 text-blue-600'
                                                          }`}>
                                                            {isLocked ? (
                                                              <Lock size={16} />
                                                            ) : (
                                                              <LessonIcon size={16} />
                                                            )}
                                                          </div>
                                                          <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                              <span className="text-xs font-medium text-gray-500">
                                                                Lesson {lesson.order}
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
                                                            <h5 className={`text-sm font-medium mb-1 ${
                                                              isLocked ? 'text-gray-500' : 'text-gray-900'
                                                            }`}>
                                                              {lesson.title}
                                                            </h5>
                                                            {lesson.description && (
                                                              <p className={`text-xs mb-2 ${
                                                                isLocked ? 'text-gray-400' : 'text-gray-600'
                                                              }`}>
                                                                {lesson.description}
                                                              </p>
                                                            )}
                                                            {lesson.duration && (
                                                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Clock size={12} />
                                                                <span>{lesson.duration}</span>
                                                              </div>
                                                            )}
                                                          </div>
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
                                </div>
                              );
                            }
                            
                            // Handle legacy structure with lessons directly (treat curriculum item as a topic)
                            if (item.lessons && item.lessons.length > 0) {
                              const isTopicExpanded = expandedTopics.has(item.id);
                              const toggleTopic = () => {
                                setExpandedTopics(prev => {
                                  const next = new Set(prev);
                                  if (next.has(item.id)) {
                                    next.delete(item.id);
                                  } else {
                                    next.add(item.id);
                                  }
                                  return next;
                                });
                              };

                              const lessonCount = item.lessons?.length || 0;
                              const moduleNumber = curriculumIndex + 1;

                              return (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                  {/* Topic Header */}
                                  <div
                                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={toggleTopic}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                          <FileText size={16} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                                            <span className="text-xs text-gray-500">
                                              Module {moduleNumber}. {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                                            </span>
                                          </div>
                                          {item.description && (
                                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                          )}
                                        </div>
                                      </div>
                                      <button className="ml-4 text-gray-400 hover:text-gray-600">
                                        {isTopicExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Lessons (Expandable) */}
                                  {isTopicExpanded && (
                                    <div className="bg-gray-50 pl-12 pr-4 py-3 space-y-2">
                                      {item.lessons
                                        .sort((a, b) => a.order - b.order)
                                        .map((lesson) => {
                                          const LessonIcon = getLessonTypeIcon(lesson.type);
                                          const isLocked = lesson.isLocked;
                                          return (
                                            <div
                                              key={lesson.id}
                                              className={`p-3 rounded-lg border ${
                                                isLocked
                                                  ? 'border-gray-200 opacity-60 bg-gray-50'
                                                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                                              }`}
                                            >
                                              <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                                  isLocked
                                                    ? 'bg-gray-100 text-gray-400'
                                                    : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                  {isLocked ? (
                                                    <Lock size={16} />
                                                  ) : (
                                                    <LessonIcon size={16} />
                                                  )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium text-gray-500">
                                                      Lesson {lesson.order}
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
                                                  <h5 className={`text-sm font-medium mb-1 ${
                                                    isLocked ? 'text-gray-500' : 'text-gray-900'
                                                  }`}>
                                                    {lesson.title}
                                                  </h5>
                                                  {lesson.description && (
                                                    <p className={`text-xs mb-2 ${
                                                      isLocked ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                      {lesson.description}
                                                    </p>
                                                  )}
                                                  {lesson.duration && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                      <Clock size={12} />
                                                      <span>{lesson.duration}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          }

                          // Legacy code kept for reference but replaced above
                          if (false && isCourse && item.topics) {
                            return (
                              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                {/* Topic Section Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                  {item.description && (
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  )}
                                </div>

                                {/* Topics within this section */}
                                <div className="divide-y divide-gray-200">
                                  {item.topics
                                    .sort((a, b) => a.order - b.order)
                                    .map((topic) => {
                                      const isTopicExpanded = expandedTopics.has(topic.id);
                                      const toggleTopic = () => {
                                        setExpandedTopics(prev => {
                                          const next = new Set(prev);
                                          if (next.has(topic.id)) {
                                            next.delete(topic.id);
                                          } else {
                                            next.add(topic.id);
                                          }
                                          return next;
                                        });
                                      };

                                      return (
                                        <div key={topic.id}>
                                          {/* Topic Header */}
                                          <div
                                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={toggleTopic}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3 flex-1">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                  <FileText size={16} />
                                                </div>
                                                <div className="flex-1">
                                                  <h4 className="font-medium text-gray-900">{topic.title}</h4>
                                                  {topic.description && (
                                                    <p className="text-xs text-gray-600 mt-1">{topic.description}</p>
                                                  )}
                                                </div>
                                              </div>
                                              <button className="ml-4 text-gray-400 hover:text-gray-600">
                                                {isTopicExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                                              </button>
                                            </div>
                                          </div>

                                          {/* Lessons (Expandable) */}
                                          {isTopicExpanded && topic.lessons && (
                                            <div className="bg-gray-50 pl-12 pr-4 py-3 space-y-2">
                                              {topic.lessons
                                                .sort((a, b) => a.order - b.order)
                                                .map((lesson) => {
                                                  const LessonIcon = getLessonTypeIcon(lesson.type);
                                                  const isLocked = lesson.isLocked;
                                                  return (
                                                    <div
                                                      key={lesson.id}
                                                      className={`p-3 rounded-lg border ${
                                                        isLocked
                                                          ? 'border-gray-200 opacity-60 bg-gray-50'
                                                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                                                      }`}
                                                    >
                                                      <div className="flex items-start gap-3">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                                          isLocked
                                                            ? 'bg-gray-100 text-gray-400'
                                                            : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                          {isLocked ? (
                                                            <Lock size={16} />
                                                          ) : (
                                                            <LessonIcon size={16} />
                                                          )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                          <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-medium text-gray-500">
                                                              Lesson {lesson.order}
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
                                                          <h5 className={`text-sm font-medium mb-1 ${
                                                            isLocked ? 'text-gray-500' : 'text-gray-900'
                                                          }`}>
                                                            {lesson.title}
                                                          </h5>
                                                          {lesson.description && (
                                                            <p className={`text-xs mb-2 ${
                                                              isLocked ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                              {lesson.description}
                                                            </p>
                                                          )}
                                                          {lesson.duration && (
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                              <Clock size={12} />
                                                              <span>{lesson.duration}</span>
                                                            </div>
                                                          )}
                                                        </div>
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
                              </div>
                            );
                          }

                          // Single Lesson: Show lessons directly
                          if (isSingleLesson && item.lessons) {
                            return (
                              <div key={item.id} className="space-y-3">
                                {item.lessons
                                  .sort((a, b) => a.order - b.order)
                                  .map((lesson) => {
                                    const LessonIcon = getLessonTypeIcon(lesson.type);
                                    const isLocked = lesson.isLocked;
                                    return (
                                      <div
                                        key={lesson.id}
                                        className={`bg-white border rounded-lg p-4 transition-all ${
                                          isLocked
                                            ? 'border-gray-200 opacity-60 cursor-not-allowed'
                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                                        }`}
                                      >
                                        <div className="flex items-start gap-4">
                                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                            isLocked
                                              ? 'bg-gray-100 text-gray-400'
                                              : 'bg-blue-50 text-blue-600'
                                          }`}>
                                            {isLocked ? (
                                              <Lock size={20} />
                                            ) : (
                                              <LessonIcon size={20} />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-sm font-medium text-gray-500">
                                                Lesson {lesson.order}
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
                                            <h3 className={`text-lg font-semibold mb-1 ${
                                              isLocked ? 'text-gray-500' : 'text-gray-900'
                                            }`}>
                                              {lesson.title}
                                            </h3>
                                            {lesson.description && (
                                              <p className={`text-sm mb-2 ${
                                                isLocked ? 'text-gray-400' : 'text-gray-600'
                                              }`}>
                                                {lesson.description}
                                              </p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                              {lesson.duration && (
                                                <div className="flex items-center gap-1">
                                                  <Clock size={14} />
                                                  <span>{lesson.duration}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          }

                          return null;
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
                    <span className="font-medium text-gray-900">{course.duration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Lessons</span>
                    <span className="font-medium text-gray-900">
                      {courseStats.totalLessons} {courseStats.totalLessons === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Level</span>
                    <span className="font-medium text-gray-900 text-right">
                      {LEVELS.find(level => level.code === course.levelCode)?.label || course.levelCode}
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
                    className="w-full px-4 py-3 text-white font-semibold rounded-md transition-colors shadow-md hover:opacity-90" 
                    style={{ backgroundColor: '#030F35' }}
                  >
                    Start Lesson
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
