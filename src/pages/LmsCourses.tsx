import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon, Star } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { FilterSidebar, FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceCard } from "../components/marketplace/MarketplaceCard";
import { useLmsCourses, useLmsCourseDetails } from "../hooks/useLmsCourses";
import { ICON_BY_ID } from "../utils/lmsIcons";
import {
  parseFacets,
  applyFilters,
  LOCATION_OPTS,
  CATEGORY_OPTS,
  DELIVERY_OPTS
} from "../utils/lmsFilters";
import { SFIA_LEVELS } from "../lms/config";
import { BookOpenCheck } from "lucide-react";

const toggleFilter = (
  sp: URLSearchParams,
  setSp: (sp: URLSearchParams, options?: { replace?: boolean }) => void,
  key: string,
  value: string
) => {
  const curr = new Set((sp.get(key)?.split(",").filter(Boolean)) || []);
  curr.has(value) ? curr.delete(value) : curr.add(value);
  const newParams = new URLSearchParams(sp);
  if (curr.size) {
    newParams.set(key, Array.from(curr).join(","));
  } else {
    newParams.delete(key);
  }
  setSp(newParams, { replace: true });
};

type TabType = 'courses' | 'tracks' | 'reviews';

export const LmsCourses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 12 items per page
  
  // Track previous filter state to detect actual changes
  const prevFilterKeyRef = React.useRef<string>('');

  // Fetch courses from Supabase - MUST be called before any conditional returns
  const { data: LMS_COURSES = [], isLoading: coursesLoading, error: coursesError } = useLmsCourses();
  const { data: LMS_COURSE_DETAILS = [], isLoading: detailsLoading } = useLmsCourseDetails();

  const facets = parseFacets(searchParams);
  
  // Get all reviews from courses
  const allReviews = useMemo(() => {
    const reviews: Array<{
      id: string;
      author: string;
      role: string;
      text: string;
      rating: number;
      courseId: string;
      courseSlug: string;
      courseTitle: string;
      courseType?: string;
      provider?: string;
      audience?: Array<'Associate' | 'Lead'>;
      department?: string[];
    }> = [];
    
    LMS_COURSE_DETAILS.forEach((course) => {
      if (course.testimonials) {
        course.testimonials.forEach((testimonial, index) => {
          reviews.push({
            id: `${course.id}-review-${index}`,
            ...testimonial,
            courseId: course.id,
            courseSlug: course.slug,
            courseTitle: course.title,
            courseType: course.courseType,
            provider: course.provider,
            audience: course.audience,
            department: course.department
          });
        });
      }
    });
    
    return reviews;
  }, [LMS_COURSE_DETAILS]);

  // Filter reviews based on search and filters
  const filteredReviews = useMemo(() => {
    let items = allReviews;
    
    // Filter by course type if selected
    if (facets.courseType && facets.courseType.length > 0) {
      items = items.filter((item) => 
        item.courseType && facets.courseType?.includes(item.courseType)
      );
    }
    
    // Filter by provider if selected
    if (facets.provider && facets.provider.length > 0) {
      items = items.filter((item) => 
        item.provider && facets.provider?.includes(item.provider)
      );
    }
    
    // Filter by audience if selected
    if (facets.audience && facets.audience.length > 0) {
      items = items.filter((item) => 
        item.audience && item.audience.some(aud => facets.audience?.includes(aud))
      );
    }
    
    // Filter by department if selected
    if (facets.department && facets.department.length > 0) {
      items = items.filter((item) => 
        item.department && item.department.some(dept => facets.department?.includes(dept))
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => {
        const searchableText = [
          item.author,
          item.role,
          item.text,
          item.courseTitle,
          item.courseType,
          item.provider
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }
    
    return items;
  }, [allReviews, facets, searchQuery]);

  // Calculate total courses (excluding learning tracks/bundles)
  const totalCourses = useMemo(() => {
    return LMS_COURSES.filter((item) => item.courseType !== 'Course (Bundles)').length;
  }, [LMS_COURSES]);

  // Filter courses - exclude bundles for courses tab
  const filteredItems = useMemo(() => {
    let items = applyFilters(LMS_COURSES, facets);
    // Filter out bundles for courses tab
    if (activeTab === 'courses') {
      items = items.filter((item) => 
        item.courseType !== 'Course (Bundles)'
      );
    }
    // Only show bundles for tracks tab
    if (activeTab === 'tracks') {
      items = items.filter((item) => 
        item.courseType === 'Course (Bundles)'
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => {
        const searchableText = [
          item.title,
          item.summary,
          item.courseCategory,
          item.deliveryMode,
          item.provider,
          item.courseType,
          item.track,
          ...(item.locations || []),
          ...(item.audience || [])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }
    return items;
  }, [LMS_COURSES, facets, searchQuery, activeTab]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters or tab changes
  // Create a stable key from search params and search query to detect actual changes
  useEffect(() => {
    const filterKey = `${searchParams.toString()}-${searchQuery}-${activeTab}`;
    if (prevFilterKeyRef.current && prevFilterKeyRef.current !== filterKey) {
      setCurrentPage(1);
    }
    prevFilterKeyRef.current = filterKey;
  }, [searchParams, searchQuery, activeTab]);

  // Dynamic filter config based on active tab
  const filterConfig: FilterConfig[] = useMemo(
    () => {
      if (activeTab === 'reviews') {
        // For reviews: show department, provider, audience, and course type filters
        return [
          {
            id: "department",
            title: "Department",
            options: [
              { id: "HRA (People)", name: "HRA (People)" },
              { id: "Finance", name: "Finance" },
              { id: "Deals", name: "Deals" },
              { id: "Stories", name: "Stories" },
              { id: "Intelligence", name: "Intelligence" },
              { id: "Solutions", name: "Solutions" },
              { id: "SecDevOps", name: "SecDevOps" },
              { id: "Products", name: "Products" },
              { id: "Delivery — Deploys", name: "Delivery — Deploys" },
              { id: "Delivery — Designs", name: "Delivery — Designs" },
              { id: "DCO Operations", name: "DCO Operations" },
              { id: "DBP Platform", name: "DBP Platform" },
              { id: "DBP Delivery", name: "DBP Delivery" }
            ]
          },
          {
            id: "provider",
            title: "LMS Item Provider",
            options: [
              { id: "DQ HRA", name: "DQ HRA" },
              { id: "DQ DTMB", name: "DQ DTMB" },
              { id: "DQ DTMA", name: "DQ DTMA" },
              { id: "Tech (Microsoft)", name: "Tech (Microsoft)" },
              { id: "Tech (Ardoq)", name: "Tech (Ardoq)" }
            ]
          },
          {
            id: "audience",
            title: "Audience",
            options: [
              { id: "Associate", name: "Associate" },
              { id: "Lead", name: "Lead" }
            ]
          },
          {
            id: "courseType",
            title: "Course Types",
            options: [
              { id: "Course (Single Lesson)", name: "Course (Single Lesson)" },
              { id: "Course (Multi-Lessons)", name: "Course (Multi-Lessons)" },
              { id: "Course (Bundles)", name: "Course (Bundles)" }
            ]
          }
        ];
      } else if (activeTab === 'tracks') {
        // For tracks: same filters as courses but without course types
        return [
          {
            id: "department",
            title: "Department",
            options: [
              { id: "HRA (People)", name: "HRA (People)" },
              { id: "Finance", name: "Finance" },
              { id: "Deals", name: "Deals" },
              { id: "Stories", name: "Stories" },
              { id: "Intelligence", name: "Intelligence" },
              { id: "Solutions", name: "Solutions" },
              { id: "SecDevOps", name: "SecDevOps" },
              { id: "Products", name: "Products" },
              { id: "Delivery — Deploys", name: "Delivery — Deploys" },
              { id: "Delivery — Designs", name: "Delivery — Designs" },
              { id: "DCO Operations", name: "DCO Operations" },
              { id: "DBP Platform", name: "DBP Platform" },
              { id: "DBP Delivery", name: "DBP Delivery" }
            ]
          },
          {
            id: "category",
            title: "Course Category",
            options: CATEGORY_OPTS.map((c) => ({ id: c, name: c }))
          },
          {
            id: "provider",
            title: "LMS Item Provider",
            options: [
              { id: "DQ HRA", name: "DQ HRA" },
              { id: "DQ DTMB", name: "DQ DTMB" },
              { id: "DQ DTMA", name: "DQ DTMA" },
              { id: "Tech (Microsoft)", name: "Tech (Microsoft)" },
              { id: "Tech (Ardoq)", name: "Tech (Ardoq)" }
            ]
          },
          {
            id: "sfiaRating",
            title: "Rating - SFIA",
            options: SFIA_LEVELS.map((level) => ({ id: level.code, name: level.label }))
          },
          {
            id: "location",
            title: "Location/Studio",
            options: LOCATION_OPTS.map((l) => ({ id: l, name: l }))
          },
          {
            id: "audience",
            title: "Audience",
            options: [
              { id: "Associate", name: "Associate" },
              { id: "Lead", name: "Lead" }
            ]
          }
        ];
      } else {
        // For courses: show all filters except delivery mode, course types only Single Lesson and Multi-Lessons
        return [
      {
        id: "department",
        title: "Department",
        options: [
          { id: "HRA (People)", name: "HRA (People)" },
          { id: "Finance", name: "Finance" },
          { id: "Deals", name: "Deals" },
          { id: "Stories", name: "Stories" },
          { id: "Intelligence", name: "Intelligence" },
          { id: "Solutions", name: "Solutions" },
          { id: "SecDevOps", name: "SecDevOps" },
          { id: "Products", name: "Products" },
          { id: "Delivery — Deploys", name: "Delivery — Deploys" },
          { id: "Delivery — Designs", name: "Delivery — Designs" },
          { id: "DCO Operations", name: "DCO Operations" },
          { id: "DBP Platform", name: "DBP Platform" },
          { id: "DBP Delivery", name: "DBP Delivery" }
        ]
      },
      {
        id: "category",
        title: "Course Category",
        options: CATEGORY_OPTS.map((c) => ({ id: c, name: c }))
      },
      {
            id: "provider",
            title: "LMS Item Provider",
            options: [
              { id: "DQ HRA", name: "DQ HRA" },
              { id: "DQ DTMB", name: "DQ DTMB" },
              { id: "DQ DTMA", name: "DQ DTMA" },
              { id: "Tech (Microsoft)", name: "Tech (Microsoft)" },
              { id: "Tech (Ardoq)", name: "Tech (Ardoq)" }
            ]
          },
          {
            id: "courseType",
            title: "Course Types",
            options: [
              { id: "Course (Single Lesson)", name: "Course (Single Lesson)" },
              { id: "Course (Multi-Lessons)", name: "Course (Multi-Lessons)" }
            ]
      },
      {
        id: "sfiaRating",
        title: "Rating - SFIA",
        options: SFIA_LEVELS.map((level) => ({ id: level.code, name: level.label }))
      },
      {
        id: "location",
        title: "Location/Studio",
        options: LOCATION_OPTS.map((l) => ({ id: l, name: l }))
      },
      {
        id: "audience",
        title: "Audience",
        options: [
          { id: "Associate", name: "Associate" },
          { id: "Lead", name: "Lead" }
        ]
      }
        ];
      }
    },
    [activeTab]
  );

  const urlBasedFilters: Record<string, string[]> = useMemo(
    () => {
      if (activeTab === 'reviews') {
        return {
          provider: facets.provider || [],
          audience: facets.audience || [],
          courseType: facets.courseType || [],
          department: facets.department || []
        };
      } else if (activeTab === 'tracks') {
        return {
          category: facets.category || [],
          provider: facets.provider || [],
          sfiaRating: facets.sfiaRating || [],
          location: facets.location || [],
          audience: facets.audience || [],
          department: facets.department || []
        };
      } else {
        return {
      category: facets.category || [],
          provider: facets.provider || [],
          courseType: facets.courseType || [],
      sfiaRating: facets.sfiaRating || [],
      location: facets.location || [],
      audience: facets.audience || [],
      department: facets.department || []
        };
      }
    },
    [facets, activeTab]
  );

  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      toggleFilter(searchParams, setSearchParams, filterType, value);
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    setSearchQuery("");
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(urlBasedFilters).some(
        (f) => Array.isArray(f) && f.length > 0
      ),
    [urlBasedFilters]
  );

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleViewDetails = useCallback((item: typeof LMS_COURSES[number]) => {
    // Navigation handled by Link in card
  }, []);

  // Handle loading state
  if (coursesLoading || detailsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (coursesError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold mb-2">Error loading courses</p>
            <p className="text-sm">{coursesError.message}</p>
            <p className="text-xs mt-4 text-gray-500">Check the browser console for details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">courses</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Center</h1>
        <p className="text-gray-600 mb-6">
          {activeTab === 'courses' 
            ? "Centralized platform that enables associates to access structured learning modules from GHC, 6xD, DWS, and DXP, supporting continuous upskilling and certification within the DQ ecosystem."
            : "Explore authentic reviews and testimonials from learners across DQ. Discover how courses have transformed work practices, developed skills, and shaped professional journeys within our learning community."}
        </p>
        
        {/* Tab Overview Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">CURRENT FOCUS</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#030F35' }}>
                {activeTab === 'courses' ? 'Courses & Curricula' : activeTab === 'tracks' ? 'Learning Tracks' : 'Reviews & Testimonials'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                {activeTab === 'courses' 
                  ? "Browse comprehensive learning tracks, individual courses, and structured curricula designed to enhance your skills across GHC, 6xD, DWS, and DXP frameworks."
                  : activeTab === 'tracks'
                  ? "Explore structured learning tracks that combine multiple courses into comprehensive learning journeys. Each track includes courses, topics, and lessons designed to master specific skills and competencies."
                  : "Read real experiences and insights from DQ associates who have completed courses. Learn how training has impacted their work, improved their skills, and advanced their careers."}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {activeTab === 'courses' 
                  ? "Sourced from DQ Learning & Development, GHC, 6xD, DWS, and DXP teams."
                  : activeTab === 'tracks'
                  ? "Sourced from DQ Learning & Development teams and structured learning programs."
                  : "Sourced from course participants and verified learners across DQ studios."}
              </p>
            </div>
            <div 
              className="px-3 py-1.5 text-xs font-medium rounded-full ml-4"
              style={{ 
                backgroundColor: '#F0F4FF',
                color: '#030F35'
              }}
            >
              Tab overview
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6" data-tabs-section>
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'courses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={activeTab === 'courses' ? { borderColor: '#030F35', color: '#030F35' } : {}}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tracks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={activeTab === 'tracks' ? { borderColor: '#030F35', color: '#030F35' } : {}}
            >
              Learning Tracks
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={activeTab === 'reviews' ? { borderColor: '#030F35', color: '#030F35' } : {}}
            >
              Reviews
            </button>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Desktop filter reset */}
        <div className="hidden xl:flex justify-end mb-4">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:text-gray-900 shadow-sm"
              style={{ color: '#030F35', borderColor: '#E5E7EB' }}
            >
              Reset All
            </button>
          )}
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-sm font-medium whitespace-nowrap px-3 py-2"
                  style={{ color: '#030F35' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={toggleFilters}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={urlBasedFilters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-sm font-medium"
                    style={{ color: '#030F35' }}
                  >
                    Reset All
                  </button>
                )}
              </div>
              <FilterSidebar
                filters={urlBasedFilters}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                isResponsive={false}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {activeTab === 'tracks' ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                    Learning Tracks ({filteredItems.length})
                  </h2>
                  <div className="text-sm text-gray-500 hidden sm:block">
                    Showing {filteredItems.length} tracks
                  </div>
                  <h2 className="text-lg font-medium text-gray-800 sm:hidden">
                    {filteredItems.length} Learning Tracks
                  </h2>
                </div>
                {/* Compact Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedItems.map((track) => {
                    const trackDetail = LMS_COURSE_DETAILS.find(c => c.id === track.id);
                    if (!trackDetail || !trackDetail.curriculum) return null;
                    
                    // Calculate stats
                    const totalCourses = trackDetail.curriculum.length;
                    const totalTopics = trackDetail.curriculum.reduce((acc, course) => {
                      if (course.topics) return acc + course.topics.length;
                      return acc;
                    }, 0);
                    const totalLessons = trackDetail.curriculum.reduce((acc, course) => {
                      if (course.topics) {
                        return acc + course.topics.reduce((topicAcc, topic) => {
                          return topicAcc + (topic.lessons?.length || 0);
                        }, 0);
                      }
                      if (course.lessons) return acc + course.lessons.length;
                      return acc;
                    }, 0);
                    
                    return (
                      <Link
                        key={track.id}
                        to={`/lms/${track.slug}`}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full"
                      >
                        {/* Track Image */}
                        {(track.imageUrl || trackDetail.imageUrl) && (
                          <div className="w-full h-48 bg-gray-200 overflow-hidden">
                            <img
                              src={track.imageUrl || trackDetail.imageUrl}
                              alt={track.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 p-6 flex flex-col">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{track.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{track.summary}</p>
                          
                          {/* Stats */}
                          <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                            <span>{totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}</span>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F3F4F6', color: '#000000' }}>
                              {track.provider}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F3F4F6', color: '#000000' }}>
                              {track.courseCategory}
                            </span>
                            {track.rating && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F3F4F6', color: '#000000' }}>
                                ⭐ {track.rating} ({track.reviewCount})
                              </span>
                            )}
                          </div>
                          
                          {/* Course List Preview */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Courses in Track</div>
                            <div className="space-y-2">
                              {trackDetail.curriculum.slice(0, 3).map((course, idx) => (
                                <div key={course.id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="line-clamp-1">{course.title}</span>
                                </div>
                              ))}
                              {trackDetail.curriculum.length > 3 && (
                                <div className="text-xs text-gray-500 italic">
                                  +{trackDetail.curriculum.length - 3} more courses
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* View Button */}
                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm font-medium" style={{ color: '#030F35' }}>
                              <span>View Track Details</span>
                              <span>→</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <div className="col-span-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <p className="text-gray-600">
                        No learning tracks found matching your filters.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Pagination for tracks */}
                {activeTab === 'tracks' && totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      style={{ 
                        color: currentPage === 1 ? '#9CA3AF' : '#030F35',
                        borderColor: currentPage === 1 ? '#D1D5DB' : '#030F35'
                      }}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === page
                                  ? 'text-white'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              style={
                                currentPage === page
                                  ? { backgroundColor: '#030F35' }
                                  : {}
                              }
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      style={{ 
                        color: currentPage === totalPages ? '#9CA3AF' : '#030F35',
                        borderColor: currentPage === totalPages ? '#D1D5DB' : '#030F35'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : activeTab === 'reviews' ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                    Reviews ({filteredReviews.length})
                  </h2>
                  <div className="text-sm text-gray-500 hidden sm:block">
                    Showing {filteredReviews.length} of {allReviews.length} reviews
                  </div>
                  <h2 className="text-lg font-medium text-gray-800 sm:hidden">
                    {filteredReviews.length} Reviews
                  </h2>
                </div>
                <div className="space-y-6">
                  {filteredReviews.map((review) => {
                    // Extract title and body from review text
                    // Format: "Title: Body text" or just "Body text"
                    const colonIndex = review.text.indexOf(':');
                    const hasTitle = colonIndex > 0 && colonIndex < 50; // Title should be reasonably short
                    const title = hasTitle ? review.text.substring(0, colonIndex).trim() : null;
                    const body = hasTitle 
                      ? review.text.substring(colonIndex + 1).trim()
                      : review.text;

                    return (
                      <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            {title && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {title}
                              </h3>
                            )}
                            <p className="text-gray-700 leading-relaxed mb-4">
                              {body}
                            </p>
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-medium text-gray-900">{review.author}</p>
                                <p className="text-sm text-gray-600">{review.role}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <Link
                            to={`/lms/${review.courseSlug}`}
                            className="text-sm font-medium inline-flex items-center hover:underline"
                            style={{ color: '#030F35' }}
                          >
                            View Course: {review.courseTitle}
                            <ChevronRightIcon size={16} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {filteredReviews.length === 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <p className="text-gray-600">
                        No reviews found matching your filters.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                Available Courses ({filteredItems.length})
              </h2>
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing {paginatedItems.length} of {filteredItems.length} {filteredItems.length === 1 ? 'course' : 'courses'}
              </div>
              <h2 className="text-lg font-medium text-gray-800 sm:hidden">
                {filteredItems.length} Courses Available
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {paginatedItems.map((item) => {
                const Icon = ICON_BY_ID[item.id] || BookOpenCheck;
                const courseDetail = LMS_COURSE_DETAILS.find(c => c.id === item.id);
                return (
                  <MarketplaceCard
                    key={item.id}
                    item={{
                      ...item,
                      provider: { name: item.provider, logoUrl: "/DWS-Logo.png" },
                      description: item.summary,
                      imageUrl: item.imageUrl,
                      curriculum: courseDetail?.curriculum
                    }}
                    marketplaceType="courses"
                    isBookmarked={false}
                    onToggleBookmark={() => {}}
                    onAddToComparison={() => {}}
                    onQuickView={() => {}}
                  />
                );
              })}
            </div>
            
            {/* Pagination for courses */}
            {activeTab === 'courses' && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{ 
                    color: currentPage === 1 ? '#9CA3AF' : '#030F35',
                    borderColor: currentPage === 1 ? '#D1D5DB' : '#030F35'
                  }}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'text-white'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          style={
                            currentPage === page
                              ? { backgroundColor: '#030F35' }
                              : {}
                          }
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{ 
                    color: currentPage === totalPages ? '#9CA3AF' : '#030F35',
                    borderColor: currentPage === totalPages ? '#D1D5DB' : '#030F35'
                  }}
                >
                  Next
                </button>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourses;

