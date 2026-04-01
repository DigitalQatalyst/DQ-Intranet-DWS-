import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  FilterIcon,
  XIcon,
  HomeIcon,
  ChevronRightIcon,
  Star,
  Clock,
  BookOpen,
  Layers,
} from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import {
  FilterSidebar,
  FilterConfig,
} from "../components/marketplace/FilterSidebar";
import { MarketplaceCard } from "../components/marketplace/MarketplaceCard";
import {
  useLmsCourses,
  useLmsCourseDetails,
  useLmsLearningPaths,
} from "../hooks/useLmsCourses";
import {
  parseFacets,
  applyFilters,
  LOCATION_OPTS,
  CATEGORY_OPTS,
} from "../utils/lmsFilters";
import { SFIA_LEVELS } from "../lms/config";

const toggleFilter = (
  sp: URLSearchParams,
  setSp: (sp: URLSearchParams, options?: { replace?: boolean }) => void,
  key: string,
  value: string,
) => {
  const curr = new Set(sp.get(key)?.split(",").filter(Boolean) || []);
  curr.has(value) ? curr.delete(value) : curr.add(value);
  const newParams = new URLSearchParams(sp);
  if (curr.size) {
    newParams.set(key, Array.from(curr).join(","));
  } else {
    newParams.delete(key);
  }
  setSp(newParams, { replace: true });
};

type TabType = "courses" | "tracks" | "reviews";

// --- Shared filter option constants ---
const DEPARTMENT_OPTIONS: FilterConfig["options"] = [
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
  { id: "DBP Delivery", name: "DBP Delivery" },
];

const PROVIDER_OPTIONS: FilterConfig["options"] = [
  { id: "DQ HRA", name: "DQ HRA" },
  { id: "DQ DTMB", name: "DQ DTMB" },
  { id: "DQ DTMA", name: "DQ DTMA" },
  { id: "Tech (Microsoft)", name: "Tech (Microsoft)" },
  { id: "Tech (Ardoq)", name: "Tech (Ardoq)" },
];

const AUDIENCE_OPTIONS: FilterConfig["options"] = [
  { id: "Associate", name: "Associate" },
  { id: "Lead", name: "Lead" },
];

function buildFilterConfig(tab: TabType): FilterConfig[] {
  const base: FilterConfig[] = [
    { id: "department", title: "Department", options: DEPARTMENT_OPTIONS },
    { id: "provider", title: "LMS Item Provider", options: PROVIDER_OPTIONS },
    { id: "audience", title: "Audience", options: AUDIENCE_OPTIONS },
  ];

  if (tab === "reviews") {
    return [
      ...base,
      {
        id: "courseType",
        title: "Course Types",
        options: [
          { id: "Course (Single Lesson)", name: "Course (Single Lesson)" },
          { id: "Course (Multi-Lessons)", name: "Course (Multi-Lessons)" },
          { id: "Course (Bundles)", name: "Course (Bundles)" },
        ],
      },
    ];
  }

  const shared: FilterConfig[] = [
    {
      id: "category",
      title: "Course Category",
      options: CATEGORY_OPTS.map((c) => ({ id: c, name: c })),
    },
    {
      id: "sfiaRating",
      title: "Rating - SFIA",
      options: SFIA_LEVELS.map((l) => ({ id: l.code, name: l.label })),
    },
    {
      id: "location",
      title: "Location/Studio",
      options: LOCATION_OPTS.map((l) => ({ id: l, name: l })),
    },
  ];

  if (tab === "tracks") {
    return [base[0], shared[0], base[1], shared[1], shared[2], base[2]];
  }

  return [
    base[0],
    shared[0],
    base[1],
    {
      id: "courseType",
      title: "Course Types",
      options: [
        { id: "Course (Single Lesson)", name: "Course (Single Lesson)" },
        { id: "Course (Multi-Lessons)", name: "Course (Multi-Lessons)" },
      ],
    },
    shared[1],
    shared[2],
    base[2],
  ];
}

import type { Facets } from "../lms/filters";

function buildUrlFilters(
  tab: TabType,
  facets: Facets,
): Record<string, string[]> {
  const base = {
    provider: facets.provider || [],
    audience: facets.audience || [],
    department: facets.department || [],
  };
  if (tab === "reviews") {
    return { ...base, courseType: facets.courseType || [] };
  }
  const extended = {
    ...base,
    category: facets.category || [],
    sfiaRating: facets.sfiaRating || [],
    location: facets.location || [],
  };
  if (tab === "tracks") return extended;
  return { ...extended, courseType: facets.courseType || [] };
}

interface PaginationBarProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        style={{
          color: currentPage === 1 ? "#9CA3AF" : "#030F35",
          borderColor: currentPage === 1 ? "#D1D5DB" : "#030F35",
        }}
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isNearCurrent =
            page >= currentPage - 1 && page <= currentPage + 1;
          const isEdge = page === 1 || page === totalPages;
          const isEllipsis =
            page === currentPage - 2 || page === currentPage + 2;
          if (isEdge || isNearCurrent) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page ? "text-white" : "text-gray-700 hover:bg-gray-50"}`}
                style={
                  currentPage === page ? { backgroundColor: "#030F35" } : {}
                }
              >
                {page}
              </button>
            );
          }
          if (isEllipsis)
            return (
              <span key={page} className="px-2 text-gray-500">
                ...
              </span>
            );
          return null;
        })}
      </div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        style={{
          color: currentPage === totalPages ? "#9CA3AF" : "#030F35",
          borderColor: currentPage === totalPages ? "#D1D5DB" : "#030F35",
        }}
      >
        Next
      </button>
    </div>
  );
}

import type { LmsCard, LmsDetail } from "../data/lmsCourseDetails";

interface TabContentProps {
  readonly filteredItems: LmsCard[];
  readonly paginatedItems: LmsCard[];
  readonly LMS_COURSE_DETAILS: LmsDetail[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly setCurrentPage: (page: number) => void;
}

function TracksContent({
  filteredItems,
  paginatedItems,
  LMS_COURSE_DETAILS,
  currentPage,
  totalPages,
  setCurrentPage,
}: TabContentProps) {
  return (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedItems.map((track) => {
          const trackDetail = LMS_COURSE_DETAILS.find((c) => c.id === track.id);
          const totalCourseCount = trackDetail?.curriculum?.length || 0;
          const totalLessons =
            trackDetail?.curriculum?.reduce((sum, item) => {
              const direct = item.lessons?.length || 0;
              const nested =
                item.topics?.reduce(
                  (t, topic) => t + (topic.lessons?.length || 0),
                  0,
                ) || 0;
              return sum + direct + nested;
            }, 0) || 0;
          const durationLabel = track.duration || "N/A";
          return (
            <Link
              key={track.id}
              to={`/lms/${track.slug}`}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
            >
              <div className="flex flex-col h-full">
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                  {track.imageUrl ? (
                    <img
                      src={track.imageUrl}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <BookOpen size={48} className="text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    {track.courseCategory && (
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-bold tracking-widest uppercase text-purple-700 shadow-sm border border-white/20">
                        {track.courseCategory}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-5 py-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight transition-colors text-[#1E293B] group-hover:text-blue-600">
                    {track.title}
                  </h3>
                  <p className="text-sm text-[#64748B] line-clamp-3 mb-4 leading-relaxed">
                    {track.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[#64748B] text-xs font-semibold mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{durationLabel}</span>
                    </div>
                    {(totalCourseCount > 0 || totalLessons > 0) && (
                      <span className="text-gray-300 text-lg">·</span>
                    )}
                    {totalCourseCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Layers size={14} />
                        <span>{totalCourseCount} Courses</span>
                      </div>
                    )}
                    {totalCourseCount > 0 && totalLessons > 0 && (
                      <span className="text-gray-300 text-lg">·</span>
                    )}
                    {totalLessons > 0 && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} />
                        <span>{totalLessons} Lessons</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between text-sm font-bold transition-colors text-[#030F35] group-hover:text-blue-600">
                    <span>View Track Details</span>
                    <ChevronRightIcon
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="col-span-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 font-medium">Coming Soon</p>
          </div>
        )}
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

interface ReviewItem {
  readonly id: string;
  readonly author: string;
  readonly role: string;
  readonly text: string;
  readonly rating: number;
  readonly courseSlug: string;
  readonly courseTitle: string;
}

interface ReviewsContentProps {
  readonly filteredReviews: ReviewItem[];
  readonly allReviews: ReviewItem[];
}

function ReviewsContent({ filteredReviews, allReviews }: ReviewsContentProps) {
  return (
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
          const colonIndex = review.text.indexOf(":");
          const hasTitle = colonIndex > 0 && colonIndex < 50;
          const title = hasTitle
            ? review.text.substring(0, colonIndex).trim()
            : null;
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
                  <p className="text-gray-700 leading-relaxed mb-4">{body}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-600">{review.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {new Array(5).fill(null).map((_, i) => (
                        <Star
                          key={`star-${review.id}-${i}`}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
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
                  style={{ color: "#030F35" }}
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
            <p className="text-gray-600 font-medium">Coming Soon</p>
          </div>
        )}
      </div>
    </>
  );
}

type ReviewItem2 = {
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
  audience?: Array<"Associate" | "Lead">;
  department?: string[];
};

function extractReviews(
  details: ReturnType<typeof useLmsCourseDetails>["data"],
): ReviewItem2[] {
  const reviews: ReviewItem2[] = [];
  (details ?? []).forEach((course) => {
    course.testimonials?.forEach((testimonial, index) => {
      reviews.push({
        id: `${course.id}-review-${index}`,
        ...testimonial,
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        courseType: course.courseType,
        provider: course.provider,
        audience: course.audience,
        department: course.department,
      });
    });
  });
  return reviews;
}

function filterReviews(
  items: ReviewItem2[],
  facets: Facets,
  searchQuery: string,
): ReviewItem2[] {
  let result = items;
  if (facets.courseType?.length)
    result = result.filter(
      (i) => i.courseType && facets.courseType!.includes(i.courseType),
    );
  if (facets.provider?.length)
    result = result.filter(
      (i) => i.provider && facets.provider!.includes(i.provider),
    );
  if (facets.audience?.length)
    result = result.filter((i) =>
      i.audience?.some((a) => facets.audience!.includes(a)),
    );
  if (facets.department?.length)
    result = result.filter((i) =>
      i.department?.some((d) => facets.department!.includes(d)),
    );
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter((i) =>
      [i.author, i.role, i.text, i.courseTitle, i.courseType, i.provider]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  return result;
}

function isPageLoading(
  activeTab: TabType,
  coursesLoading: boolean,
  detailsLoading: boolean,
  learningPathsLoading: boolean,
): boolean {
  return (
    coursesLoading ||
    detailsLoading ||
    (activeTab === "tracks" && learningPathsLoading)
  );
}

function buildTabContent(
  activeTab: TabType,
  filteredItems: LmsCard[],
  paginatedItems: LmsCard[],
  LMS_COURSE_DETAILS: LmsDetail[],
  pagination: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (p: number) => void;
  },
  filteredReviews: ReviewItem2[],
  allReviews: ReviewItem2[],
): React.ReactNode {
  if (activeTab === "tracks") {
    return (
      <TracksContent
        filteredItems={filteredItems}
        paginatedItems={paginatedItems}
        LMS_COURSE_DETAILS={LMS_COURSE_DETAILS}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        setCurrentPage={pagination.setCurrentPage}
      />
    );
  }
  if (activeTab === "reviews") {
    return (
      <ReviewsContent
        filteredReviews={filteredReviews}
        allReviews={allReviews}
      />
    );
  }
  return (
    <CoursesContent
      filteredItems={filteredItems}
      paginatedItems={paginatedItems}
      LMS_COURSE_DETAILS={LMS_COURSE_DETAILS}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      setCurrentPage={pagination.setCurrentPage}
    />
  );
}

function computeFilteredItems(
  activeTab: TabType,
  LMS_COURSES: LmsCard[],
  LEARNING_PATHS: LmsCard[],
  facets: Facets,
  searchQuery: string,
): LmsCard[] {
  let items: LmsCard[];
  if (activeTab === "tracks") {
    items = filterTrackItems(LEARNING_PATHS, facets);
  } else {
    items = applyFilters(LMS_COURSES, facets);
    if (activeTab === "courses") {
      items = items.filter((item) => item.courseType !== "Course (Bundles)");
    }
  }
  if (searchQuery) {
    items = applySearchFilter(items, searchQuery);
  }
  return items;
}

function filterTrackItems(items: LmsCard[], facets: Facets): LmsCard[] {
  let result = items;
  if (facets.category?.length)
    result = result.filter((i) => facets.category!.includes(i.courseCategory));
  if (facets.provider?.length)
    result = result.filter((i) => facets.provider!.includes(i.provider));
  if (facets.sfiaRating?.length)
    result = result.filter((i) => facets.sfiaRating!.includes(i.levelCode));
  if (facets.location?.length)
    result = result.filter((i) =>
      i.locations.some((l) => facets.location!.includes(l)),
    );
  if (facets.audience?.length)
    result = result.filter((i) =>
      i.audience.some((a) => facets.audience!.includes(a)),
    );
  if (facets.department?.length)
    result = result.filter((i) =>
      i.department.some((d) => facets.department!.includes(d)),
    );
  return result;
}

function applySearchFilter(items: LmsCard[], query: string): LmsCard[] {
  const q = query.toLowerCase();
  return items.filter((item) =>
    [
      item.title,
      item.summary,
      item.courseCategory,
      item.deliveryMode,
      item.provider,
      item.courseType,
      item.track,
      ...(item.locations || []),
      ...(item.audience || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

function CoursesContent({
  filteredItems,
  paginatedItems,
  LMS_COURSE_DETAILS,
  currentPage,
  totalPages,
  setCurrentPage,
}: TabContentProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Available Courses ({filteredItems.length})
        </h2>
        <div className="text-sm text-gray-500 hidden sm:block">
          Showing {paginatedItems.length} of {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "course" : "courses"}
        </div>
        <h2 className="text-lg font-medium text-gray-800 sm:hidden">
          {filteredItems.length} Courses Available
        </h2>
      </div>
      {filteredItems.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 font-medium">Coming Soon</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {paginatedItems.map((item) => {
          const courseDetail = LMS_COURSE_DETAILS.find((c) => c.id === item.id);
          return (
            <MarketplaceCard
              key={item.id}
              item={{
                ...item,
                provider: { name: item.provider, logoUrl: "/DWS-Logo.png" },
                description: item.summary,
                imageUrl: item.imageUrl,
                curriculum: courseDetail?.curriculum,
              }}
              marketplaceType="courses"
              isBookmarked={false}
              onToggleBookmark={() => {
                /* noop */
              }}
              onQuickView={() => {
                /* noop */
              }}
            />
          );
        })}
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

export const LmsCourses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 12 items per page

  // Track previous filter state to detect actual changes
  const prevFilterKeyRef = React.useRef<string>("");

  // Fetch courses from Supabase - MUST be called before any conditional returns
  const {
    data: LMS_COURSES = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useLmsCourses();
  const { data: LMS_COURSE_DETAILS = [], isLoading: detailsLoading } =
    useLmsCourseDetails();
  const { data: LEARNING_PATHS = [], isLoading: learningPathsLoading } =
    useLmsLearningPaths();

  const facets = parseFacets(searchParams);

  // Get all reviews from courses
  const allReviews = useMemo(
    () => extractReviews(LMS_COURSE_DETAILS),
    [LMS_COURSE_DETAILS],
  );

  // Filter reviews based on search and filters
  const filteredReviews = useMemo(
    () => filterReviews(allReviews, facets, searchQuery),
    [allReviews, facets, searchQuery],
  );

  // Filter courses - exclude bundles for courses tab, use learning paths for tracks tab
  const filteredItems = useMemo(
    () =>
      computeFilteredItems(
        activeTab,
        LMS_COURSES,
        LEARNING_PATHS,
        facets,
        searchQuery,
      ),
    [LMS_COURSES, LEARNING_PATHS, facets, searchQuery, activeTab],
  );

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
  const filterConfig = useMemo(() => buildFilterConfig(activeTab), [activeTab]);

  const urlBasedFilters = useMemo(
    () => buildUrlFilters(activeTab, facets),
    [facets, activeTab],
  );

  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      toggleFilter(searchParams, setSearchParams, filterType, value);
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    setSearchQuery("");
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(urlBasedFilters).some(
        (f) => Array.isArray(f) && f.length > 0,
      ),
    [urlBasedFilters],
  );

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Handle loading state
  if (
    isPageLoading(
      activeTab,
      coursesLoading,
      detailsLoading,
      learningPathsLoading,
    )
  ) {
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
            <p className="text-xs mt-4 text-gray-500">
              Check the browser console for details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabContent = buildTabContent(
    activeTab,
    filteredItems,
    paginatedItems,
    LMS_COURSE_DETAILS,
    { currentPage, totalPages, setCurrentPage },
    filteredReviews,
    allReviews,
  );

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
                <span className="ml-1 text-gray-500 md:ml-2">
                  DQ Learning Center
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          DQ Learning Center
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-5xl">
          Designed for your continuous growth. Access the upskilling and
          certification tools you need to deliver excellence.
        </p>

        {/* Tabs */}
        <div className="border-b border-gray-100 mb-8" data-tabs-section>
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "courses"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={
                activeTab === "courses"
                  ? { borderColor: "#030F35", color: "#030F35" }
                  : {}
              }
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab("tracks")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "tracks"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={
                activeTab === "tracks"
                  ? { borderColor: "#030F35", color: "#030F35" }
                  : {}
              }
            >
              Learning Tracks
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={
                activeTab === "reviews"
                  ? { borderColor: "#030F35", color: "#030F35" }
                  : {}
              }
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Tab specific info box */}
        <div className="bg-white rounded-xl border border-gray-200/60 p-5 mb-8 shadow-sm">
          <p className="text-gray-500 text-sm">
            {activeTab === "courses" &&
              "Find exactly what you need. Pick and choose individual courses to build your expertise one topic at a time."}
            {activeTab === "tracks" &&
              "Explore structured learning tracks that combine multiple courses into comprehensive learning journeys."}
            {activeTab === "reviews" &&
              "Read real experiences and insights from DQ associates who have completed courses."}
          </p>
        </div>

        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Desktop filter reset */}
        <div className="hidden xl:flex justify-end mb-4">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:text-gray-900 shadow-sm"
              style={{ color: "#030F35", borderColor: "#E5E7EB" }}
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
                  style={{ color: "#030F35" }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <button
            type="button"
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden w-full h-full border-0 p-0 cursor-default ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleFilters}
            aria-label="Close filters overlay"
            aria-hidden={!showFilters}
            tabIndex={showFilters ? 0 : -1}
          >
            <dialog
              id="filter-sidebar"
              open={showFilters}
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out m-0 p-0 border-0 ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`}
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
            </dialog>
          </button>
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-sm font-medium"
                    style={{ color: "#030F35" }}
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
          <div className="xl:w-3/4">{tabContent}</div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourses;
