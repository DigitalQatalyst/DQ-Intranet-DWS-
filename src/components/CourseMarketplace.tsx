import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Component,
} from "react";
import { FilterSidebar } from "./FilterSidebar";
import { CourseGrid } from "./CourseGrid";
import { SearchBar } from "./SearchBar";
import {
  FilterIcon,
  XIcon,
  BookmarkIcon,
  Share2Icon,
  HomeIcon,
  ChevronRightIcon,
} from "lucide-react";
import { RelatedCourses } from "./RelatedCourses";
import { CourseComparison } from "./CourseComparison";
import { CourseCardSkeleton, ErrorDisplay } from "./SkeletonLoader";
import { useNavigate } from "react-router-dom";
import { fetchCourses, fetchFilterOptions } from "../services/courses";
import {
  toggleCourseBookmark,
  addCourseToComparison,
  removeCourseFromComparison,
} from "../services/mutations";
import { CourseType, ProviderType, CourseFilters } from "../types/course";

export const CourseMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CourseFilters>({
    category: '',
    deliveryMode: '',
    businessStage: '',
    provider: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [deliveryModes, setDeliveryModes] = useState<
    { id: string; name: string }[]
  >([]);
  const [businessStages, setBusinessStages] = useState<
    { id: string; name: string }[]
  >([]);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setCategories(options.categories);
        setDeliveryModes(options.deliveryModes);
        setBusinessStages(options.businessStages);
        setProviders(options.providers);
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to load filter options");
      }
    };
    loadFilterOptions();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseData = await fetchCourses(filters, searchQuery);
        setCourses(courseData);
        setFilteredCourses(courseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        setLoading(false);
      }
    };
    loadCourses();
  }, [searchQuery, filters]);

  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: value === prev[filterType] ? "" : value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      category: '',
      deliveryMode: '',
      businessStage: '',
      provider: ''
    });
    setSearchQuery("");
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const toggleBookmark = useCallback((courseId: string) => {
    setBookmarkedCourses((prev) => {
      const isCurrentlyBookmarked = prev.includes(courseId);
      const newBookmarks = isCurrentlyBookmarked
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
      toggleCourseBookmark(
        courseId,
        "current-user-id",
        isCurrentlyBookmarked
      ).catch((error) => {
        console.error("Error toggling bookmark:", error);
        setBookmarkedCourses(prev);
      });
      return newBookmarks;
    });
  }, []);

  const handleAddToComparison = useCallback(
    (course: CourseType) => {
      if (
        compareCourses.length < 3 &&
        !compareCourses.some((c) => c.id === course.id)
      ) {
        setCompareCourses((prev) => [...prev, course]);
        addCourseToComparison(course.id, "current-user-id").catch((error) => {
          console.error("Error adding to comparison:", error);
          setCompareCourses((prev) => prev.filter((c) => c.id !== course.id));
        });
      }
    },
    [compareCourses]
  );

  const handleRemoveFromComparison = useCallback(
    (courseId: string) => {
      const previousCourses = [...compareCourses];
      setCompareCourses((prev) =>
        prev.filter((course) => course.id !== courseId)
      );
      removeCourseFromComparison(courseId, "current-user-id").catch((error) => {
        console.error("Error removing from comparison:", error);
        setCompareCourses(previousCourses);
      });
    },
    [compareCourses]
  );

  const handleFilterByStatus = useCallback(
    (filterId: string | null) => {
      if (filterId === "all") {
        resetFilters();
      } else if (filterId === "online") {
        setFilters((prev) => ({
          ...prev,
          deliveryMode: "Online",
        }));
      } else if (filterId === "inperson") {
        setFilters((prev) => ({
          ...prev,
          deliveryMode: "In-person",
        }));
      } else if (filterId === "bookmarked") {
        const bookmarked = courses.filter((course) =>
          bookmarkedCourses.includes(course.id)
        );
        setFilteredCourses(bookmarked);
      }
    },
    [courses, bookmarkedCourses, resetFilters]
  );

  const retryFetchCourses = useCallback(() => {
    setError(null);
    setFilters((prev) => ({
      ...prev,
    }));
  }, []);

  const categoryNames = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );
  const deliveryModeNames = useMemo(
    () => deliveryModes.map((d) => d.name),
    [deliveryModes]
  );
  const businessStageNames = useMemo(
    () => businessStages.map((b) => b.name),
    [businessStages]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center"
            >
              <HomeIcon size={16} className="mr-1" />
              <span>Home</span>
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">Onboarding Flows</span>
            </div>
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        DQ Onboarding Flows
      </h1>
      <p className="text-gray-600 mb-6">
        Discover guided flows to get productive fast in the Digital Workspace.
      </p>

      <div className="mb-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {compareCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-blue-800">
              Flow Comparison ({compareCourses.length}/3)
            </h3>
            <div>
              <button
                onClick={() => setShowComparison(true)}
                className="text-blue-600 hover:text-blue-800 font-medium mr-4"
              >
                Compare Selected
              </button>
              <button
                onClick={() => setCompareCourses([])}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {compareCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-full px-3 py-1 flex items-center gap-2 text-sm border border-gray-200"
              >
                <span className="truncate max-w-[150px]">{course.title}</span>
                <button
                  onClick={() => handleRemoveFromComparison(course.id)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={`Remove ${course.title} from comparison`}
                >
                  <XIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="xl:hidden sticky top-0 z-20 bg-gray-50 py-2 shadow-sm">
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
            {Object.values(filters).some((f) => f !== "") && (
              <button
                onClick={resetFilters}
                className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

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
            aria-label="Onboarding filters"
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
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  isResponsive={true}
                  categories={categoryNames}
                  deliveryModes={deliveryModeNames}
                  businessStages={businessStageNames}
                  providers={providers}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:block xl:w-1/4">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {Object.values(filters).some((f) => f !== "") && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 text-sm font-medium"
                >
                  Reset All
                </button>
              )}
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              isResponsive={false}
              categories={categoryNames}
              deliveryModes={deliveryModeNames}
              businessStages={businessStageNames}
              providers={providers}
            />
          </div>
        </div>

        <div className="xl:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, idx) => (
                <CourseCardSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <ErrorDisplay message={error} onRetry={retryFetchCourses} />
          ) : (
            <CourseGrid
              courses={filteredCourses}
              onCourseSelect={course => navigate(`/onboarding/${course.id}`)}
              bookmarkedCourses={bookmarkedCourses}
              onToggleBookmark={(course) => toggleBookmark(course.id)}
              onAddToComparison={handleAddToComparison}
            />
          )}
        </div>
      </div>

      {showComparison && (
        <CourseComparison
          courses={compareCourses}
          onClose={() => setShowComparison(false)}
          onRemoveCourse={handleRemoveFromComparison}
        />
      )}
    </div>
  );
};

export default CourseMarketplace;
