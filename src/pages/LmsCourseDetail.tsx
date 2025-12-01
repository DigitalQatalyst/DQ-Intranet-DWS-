import React, { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  HomeIcon,
  ChevronRightIcon,
  PlayCircleIcon,
  Clock,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  Calendar,
  GraduationCap
} from "lucide-react";
import { useLmsCourse, useLmsCourseDetails } from "../hooks/useLmsCourses";
import type { LmsDetail } from "../data/lmsCourseDetails";
import { ICON_BY_ID, resolveChipIcon } from "../utils/lmsIcons";
import { BookOpenCheck } from "lucide-react";
import { levelShortLabelFromCode } from "@/lms/levels";

const formatList = (values: string[]) => values.join(", ");

const formatChips = (course: LmsDetail) => {
  const chips: Array<{ key: string; label: string; iconValue?: string }> = [
    { key: "courseCategory", label: course.courseCategory },
    { key: "deliveryMode", label: course.deliveryMode, iconValue: course.deliveryMode },
    { key: "duration", label: course.duration, iconValue: course.duration },
    { key: "level", label: levelShortLabelFromCode(course.levelCode), iconValue: course.levelCode }
  ];
  const nonGlobalLocation = course.locations.find((location) => location !== "Global");
  if (nonGlobalLocation) {
    chips.push({ key: "location", label: nonGlobalLocation });
  }
  const audienceIsLeadOnly =
    course.audience.length === 1 && course.audience[0].toLowerCase() === "lead";
  if (audienceIsLeadOnly) {
    chips.push({ key: "audience", label: "Lead-only", iconValue: "Lead" });
  }
  return chips;
};

export const LmsCourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch course data from Supabase - MUST be called before any conditional returns
  const { data: detail, isLoading: detailLoading, error: detailError } = useLmsCourse(slug || '');
  const { data: allCourses = [] } = useLmsCourseDetails();

  const relatedCourses = useMemo(() => {
    if (!detail) return [];
    return allCourses.filter(
      (d) =>
        d.courseCategory === detail.courseCategory && d.id !== detail.id
    );
  }, [detail, allCourses]);

  // Show loading state
  if (detailLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
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
  if (detailError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Error Loading Course
            </h2>
            <p className="text-gray-600 mb-6">
              {detailError.message || 'An error occurred while loading the course details.'}
            </p>
            <button
              onClick={() => navigate("/lms")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to LMS Courses
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Show not found state
  if (!detail) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Course Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't locate that LMS course. Head back to the marketplace
              to explore the latest learning paths.
            </p>
            <button
              onClick={() => navigate("/lms")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to LMS Courses
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const HeroIcon = ICON_BY_ID[detail.id] || BookOpenCheck;
  const chipData = useMemo(() => formatChips(detail), [detail]);
  const statusLabel = detail.status === "live" ? "Live" : "Coming Soon";
  const statusClass =
    detail.status === "live"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
            <nav className="flex mb-6" aria-label="Breadcrumb">
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
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link
                      to="/lms"
                      className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                    >
                      LMS Courses
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">
                      {detail.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HeroIcon className="h-6 w-6 shrink-0 text-blue-600" aria-hidden="true" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {detail.title}
                </h1>
              </div>
              <p className="text-lg text-gray-600">{detail.summary}</p>
              <div className="flex flex-wrap gap-2">
                {chipData.map((chip, index) => {
                  const ChipIcon = resolveChipIcon(chip.key, chip.iconValue ?? chip.label);
                  return (
                    <span
                      key={`${chip.key}-${index}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {ChipIcon ? <ChipIcon className="h-4 w-4 mr-1" /> : null}
                      {chip.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Course Highlights
                </h2>
                <ul className="space-y-3">
                  {detail.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Learning Outcomes
                </h2>
                <ul className="space-y-3">
                  {detail.outcomes.map((outcome, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <GraduationCap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {relatedCourses.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Related LMS Courses
                  </h2>
                  <div className="space-y-4">
                    {relatedCourses.map((course) => {
                      const CourseIcon = ICON_BY_ID[course.id] || BookOpenCheck;
                      return (
                        <Link
                          key={course.id}
                          to={`/lms/${course.slug}`}
                          className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <CourseIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {course.summary}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right rail */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Details
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      Starts
                    </dt>
                    <dd className="text-gray-900">Self-paced</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      Duration
                    </dt>
                    <dd className="text-gray-900">{detail.duration}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </dt>
                    <dd className="text-gray-900">
                      {formatList(detail.locations)}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Users className="w-4 h-4" />
                      Audience
                    </dt>
                    <dd className="text-gray-900">
                      {formatList(detail.audience)}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Building2 className="w-4 h-4" />
                      Department
                    </dt>
                    <dd className="text-gray-900">
                      {formatList(detail.department)}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Status
                    </dt>
                    <dd className="text-gray-900">{statusLabel}</dd>
                  </div>
                </dl>
                <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <PlayCircleIcon className="w-5 h-5" />
                  Start Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourseDetail;
