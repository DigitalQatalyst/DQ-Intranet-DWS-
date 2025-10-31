import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  BookmarkIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  Clock,
  HomeIcon,
  MapPin,
  PlayCircleIcon
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LMS_COURSE_DETAILS } from '../../data/lmsCourseDetails';
import {
  CARD_ICON_BY_ID,
  DEFAULT_COURSE_ICON,
  resolveChipIcon
} from '../../utils/lmsIcons';
import { LEVELS, LOCATION_ALLOW } from '@/lms/config';

const formatChips = (course: (typeof LMS_COURSE_DETAILS)[number]) => {
  const levelLabel = LEVELS.find(level => level.code === course.levelCode)?.label;
  const chips: Array<{ key: string; label: string; iconValue?: string }> = [
    { key: 'courseCategory', label: course.courseCategory, iconValue: course.courseCategory },
    { key: 'deliveryMode', label: course.deliveryMode, iconValue: course.deliveryMode },
    { key: 'duration', label: course.duration, iconValue: course.duration },
    { key: 'level', label: levelLabel || course.levelCode, iconValue: course.levelCode }
  ];
  const location = course.locations.find(
    loc => loc !== 'Global' && (LOCATION_ALLOW as readonly string[]).includes(loc)
  );
  if (location) {
    chips.push({ key: 'location', label: location, iconValue: location });
  }
  const isLeadOnly = course.audience.length === 1 && course.audience[0] === 'Lead';
  if (isLeadOnly) {
    chips.push({ key: 'audience', label: 'Lead-only', iconValue: 'Lead' });
  }
  return chips;
};

const formatList = (values: string[]) => values.join(', ');

export const LmsCourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = useMemo(
    () => LMS_COURSE_DETAILS.find(detail => detail.slug === slug),
    [slug]
  );

  const relatedCourses = useMemo(() => {
    if (!course) return [];
    return LMS_COURSE_DETAILS.filter(
      detail => detail.courseCategory === course.courseCategory && detail.id !== course.id
    );
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Course Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't locate that LMS course. Head back to the marketplace to explore the latest learning paths.
            </p>
            <button
              onClick={() => navigate('/marketplace/courses')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to LMS Marketplace
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const HeroIcon = CARD_ICON_BY_ID[course.id] || DEFAULT_COURSE_ICON;
  const chipData = useMemo(() => formatChips(course), [course]);
  const statusLabel = course.status === 'live' ? 'Live' : 'Coming Soon';
  const statusClass = course.status === 'live' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200';
  const locationsLabel = formatList(course.locations);
  const audienceLabel = formatList(course.audience);
  const departmentLabel = formatList(course.department);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
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
                    <Link to="/marketplace/courses" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      LMS Courses
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
                <div className="text-sm text-gray-600 font-medium mb-2">
                  {course.provider}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <HeroIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <h1 className="text-xl md:text-2xl font-semibold leading-7 text-gray-900">
                    {course.title}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {chipData.map((chip, index) => {
                  const Icon = resolveChipIcon(chip.key, chip.iconValue ?? chip.labelOriginal ?? chip.label);
                  return <span key={`${chip.key}-${chip.label}-${index}`} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                      index === 0
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : index === 1
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {Icon ? <Icon className="h-4 w-4 mr-1.5" /> : null}
                      {chip.label}
                    </span>;
                })}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
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

        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {course.summary}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock size={16} className="text-blue-600 mr-2" />
                      <span>
                        Duration: <span className="font-medium text-gray-900">{course.duration}</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <PlayCircleIcon size={16} className="text-blue-600 mr-2" />
                      <span>
                        Delivery Mode: <span className="font-medium text-gray-900">{course.deliveryMode}</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-blue-600 mr-2" />
                      <span>
                        Location: <span className="font-medium text-gray-900">{locationsLabel}</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon size={16} className="text-blue-600 mr-2" />
                      <span>
                        Level: <span className="font-medium text-gray-900">{course.levelCode || course.level}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                    <CheckCircleIcon size={18} />
                  </span>
                  Key Highlights
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.highlights.map(highlight => (
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

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Outcomes</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ol className="space-y-4">
                    {course.outcomes.map((outcome, index) => (
                      <li key={outcome} className="flex items-start gap-3">
                        <span className="text-blue-600 font-semibold">{index + 1}.</span>
                        <p className="text-gray-700 leading-relaxed">{outcome}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-28">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Course Summary</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Starts</span>
                    <span className="font-medium text-gray-900">Available Now</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Cost</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Department</span>
                    <span className="font-medium text-gray-900 text-right">{departmentLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Audience</span>
                    <span className="font-medium text-gray-900 text-right">{audienceLabel}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Status</span>
                    <span className="font-medium text-gray-900 text-right">{statusLabel}</span>
                  </div>
                  <button className="w-full px-4 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:from-teal-600 hover:via-blue-600 hover:to-purple-700 transition-colors shadow-md">
                    Enroll Now
                  </button>
                  <button className="w-full px-4 py-2.5 text-blue-600 font-medium bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center">
                    <BookmarkIcon size={16} className="mr-2" />
                    Save for Later
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="bg-gray-50 border-t border-gray-200 py-10">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related LMS Courses</h2>
              <Link to="/marketplace/courses" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                Browse all courses
                <ChevronRightIcon size={16} className="ml-1" />
              </Link>
            </div>
            {relatedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedCourses.map(related => {
                  const RelatedIcon = CARD_ICON_BY_ID[related.id] || DEFAULT_COURSE_ICON;
                  return (
                    <div
                      key={related.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/lms/${related.slug}`)}
                    >
                      <div className="flex items-center mb-3 gap-2">
                        <RelatedIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
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
                No additional courses in this category yet. Check back soon for fresh content.
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
