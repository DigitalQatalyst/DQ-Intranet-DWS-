import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { FilterSidebar, FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceCard } from "../components/marketplace/MarketplaceCard";
import { LMS_COURSES } from "../data/lmsCourses";
import { ICON_BY_ID } from "../utils/lmsIcons";
import {
  parseFacets,
  applyFilters,
  LOCATION_OPTS,
  LEVEL_OPTS,
  CATEGORY_OPTS,
  DELIVERY_OPTS,
  DURATION_OPTS
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

export const LmsCourses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const facets = parseFacets(searchParams);
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
          item.duration,
          item.levelCode,
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

  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        id: "category",
        title: "Course Category",
        options: CATEGORY_OPTS.map((c) => ({ id: c, name: c }))
      },
      {
        id: "delivery",
        title: "Delivery Mode",
        options: DELIVERY_OPTS.map((d) => ({ id: d, name: d }))
      },
      {
        id: "duration",
        title: "Duration",
        options: DURATION_OPTS.map((d) => ({ id: d, name: d }))
      },
      {
        id: "level",
        title: "Level",
        options: LEVEL_OPTS.map((l) => ({ id: l.code, name: l.label }))
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
    ],
    []
  );

  const urlBasedFilters: Record<string, string[]> = useMemo(
    () => ({
      category: facets.category || [],
      delivery: facets.delivery || [],
      duration: facets.duration || [],
      level: facets.level || [],
      location: facets.location || [],
      audience: facets.audience || []
    }),
    [facets]
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
                <span className="ml-1 text-gray-500 md:ml-2">LMS Courses</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">LMS Courses</h1>
        <p className="text-gray-600 mb-6">
          Explore our learning management system courses
        </p>
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
                  className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
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
                    className="text-blue-600 text-sm font-medium"
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
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourses;

