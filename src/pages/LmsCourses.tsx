import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon, Star } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { FilterSidebar, FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceCard } from "../components/marketplace/MarketplaceCard";
import { LMS_COURSES } from "../data/lmsCourses";
import { LMS_COURSE_DETAILS } from "../data/lmsCourseDetails";
import { ICON_BY_ID } from "../utils/lmsIcons";
import {
  parseFacets,
  applyFilters,
  LOCATION_OPTS,
  CATEGORY_OPTS,
  DELIVERY_OPTS
} from "../utils/lmsFilters";
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

type TabType = 'courses' | 'reviews';

export const LmsCourses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('courses');

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
            audience: course.audience
          });
        });
      }
    });
    
    return reviews;
  }, []);

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

  const filteredItems = useMemo(() => {
    let items = applyFilters(LMS_COURSES, facets);
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
  }, [facets, searchQuery]);

  // Dynamic filter config based on active tab
  const filterConfig: FilterConfig[] = useMemo(
    () => {
      if (activeTab === 'reviews') {
        // For reviews: show provider, audience, and course type filters
        return [
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
      } else {
        // For courses: show all filters except delivery mode (as per user request)
        return [
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
              { id: "Course (Multi-Lessons)", name: "Course (Multi-Lessons)" },
              { id: "Course (Bundles)", name: "Course (Bundles)" }
            ]
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
          courseType: facets.courseType || []
        };
      } else {
        return {
      category: facets.category || [],
          provider: facets.provider || [],
          courseType: facets.courseType || [],
      location: facets.location || [],
      audience: facets.audience || []
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

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleViewDetails = useCallback((item: typeof LMS_COURSES[number]) => {
    // Navigation handled by Link in card
  }, []);

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
        <p className="text-gray-600 mb-4">
          Explore our learning management system courses and reviews
        </p>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
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
              {Object.values(urlBasedFilters).some(
                (f) => Array.isArray(f) && f.length > 0
              ) && (
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
                {Object.values(urlBasedFilters).some(
                  (f) => Array.isArray(f) && f.length > 0
                ) && (
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
            {activeTab === 'reviews' ? (
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
                Showing {filteredItems.length} of {LMS_COURSES.length} courses
              </div>
              <h2 className="text-lg font-medium text-gray-800 sm:hidden">
                {filteredItems.length} Courses Available
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredItems.map((item) => {
                const Icon = ICON_BY_ID[item.id] || BookOpenCheck;
                return (
                  <MarketplaceCard
                    key={item.id}
                    item={{
                      ...item,
                      provider: { name: item.provider, logoUrl: "/DWS-Logo.png" },
                      description: item.summary
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

