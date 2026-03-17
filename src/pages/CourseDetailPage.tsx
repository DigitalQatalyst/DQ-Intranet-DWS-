import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BookmarkIcon, ScaleIcon, Calendar, MapPin, StarIcon, CheckCircleIcon, ExternalLinkIcon, ChevronRightIcon, HomeIcon } from 'lucide-react';
import { RelatedCourses } from '../components/RelatedCourses';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { graphqlClient } from '../services/graphql/client';
import { GET_COURSE_DETAILS, GET_RELATED_COURSES } from '../services/graphql/queries';
import { CourseType } from '../types/course';
import { ErrorDisplay } from '../components/SkeletonLoader';
interface CourseDetailPageProps {
  bookmarkedCourses: string[];
  onToggleBookmark: (courseId: string) => void;
  onAddToComparison: (course: CourseType) => void;
}
export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  bookmarkedCourses = [],
  onToggleBookmark = () => undefined,
  onAddToComparison = () => undefined
}) => {
  const {
    courseId
  } = useParams<{
    courseId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldEnroll = searchParams.get('enroll') === 'true';
  const [course, setCourse] = useState<CourseType | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<CourseType[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Generate a random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch course details
        const {
          course
        } = await graphqlClient.request(GET_COURSE_DETAILS, {
          id: courseId
        });
        if (course) {
          setCourse(course);
          setIsBookmarked(bookmarkedCourses.includes(course.id));
          // Fetch related courses
          const {
            relatedCourses
          } = await graphqlClient.request(GET_RELATED_COURSES, {
            id: courseId,
            category: course.category,
            provider: course.provider.name
          });
          setRelatedCourses(relatedCourses || []);
          // If the enroll parameter is true, scroll to the enrollment section
          if (shouldEnroll) {
            setTimeout(() => {
              const enrollSection = document.getElementById('enroll-section');
              if (enrollSection) {
                enrollSection.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }, 100);
          }
        } else {
          // Course not found
          setError('Course not found');
          setTimeout(() => {
            navigate('/courses');
          }, 3000);
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId, bookmarkedCourses, shouldEnroll, navigate]);
  const handleToggleBookmark = () => {
    if (course) {
      onToggleBookmark(course.id);
      setIsBookmarked(!isBookmarked);
    }
  };
  const handleAddToComparison = () => {
    if (course) {
      onAddToComparison(course);
    }
  };
  const retryFetch = () => {
    setError(null);
    // Re-fetch by triggering the useEffect
    if (courseId) {
      setLoading(true);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>;
  }
  if (error) {
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <ErrorDisplay message={error} onRetry={retryFetch} />
        </div>
        <Footer isLoggedIn={false} />
      </div>;
  }
  if (!course) {
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Course Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Back to Courses
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>;
  }
  return <div className="bg-white min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <a href="/courses" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Courses
                  </a>
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
        </div>

        {/* Hero Banner */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Left side - Course info */}
              <div className="lg:w-2/3">
                {/* Provider Section - Logo removed */}
                <div className="flex items-center mb-3">
                  <span className="text-gray-600 font-medium">
                    {course.provider.name}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {course.title}
                </h1>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {course.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                    {course.deliveryMode}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    {course.businessStage}
                  </span>
                </div>
                {/* Rating */}
                <div className="flex items-center mb-5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} size={16} className={`${parseFloat(rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {rating}
                  </span>
                  <span className="mx-1.5 text-gray-500">·</span>
                  <span className="text-sm text-gray-500">
                    {reviewCount} reviews
                  </span>
                </div>
                <p className="text-gray-700 mb-6 max-w-2xl">
                  {course.description}
                </p>
                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button className="px-6 py-3 text-white font-bold rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:from-teal-600 hover:via-blue-600 hover:to-purple-700 transition-colors shadow-md">
                    Enroll Now
                  </button>
                  <button className="px-6 py-3 text-blue-600 font-medium bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center">
                    View Provider
                    <ExternalLinkIcon size={16} className="ml-2" />
                  </button>
                  <div className="flex items-center space-x-3 ml-auto">
                    <button onClick={handleToggleBookmark} className={`p-2 rounded-full ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                      <BookmarkIcon size={20} className={isBookmarked ? 'fill-yellow-600' : ''} />
                    </button>
                    <button onClick={handleAddToComparison} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200" aria-label="Add to comparison" title="Add to comparison">
                      <ScaleIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Right side - Image */}
              <div className="lg:w-1/3 w-full">
                <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                  <img src={`https://source.unsplash.com/random/800x450?${course.category.toLowerCase()},education`} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content with sticky sidebar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-2/3">
              {/* Course Highlights Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                    <CheckCircleIcon size={18} />
                  </span>
                  Key Highlights
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learningOutcomes.slice(0, 4).map((outcome, index) => <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 h-full">
                      <CheckCircleIcon size={20} className="text-dqYellow mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>)}
                </div>
              </section>

              {/* Description Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About This Course
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-5">
                    This comprehensive course is designed to provide you with
                    the skills and knowledge needed to excel in{' '}
                    {course.category}. Whether you're just starting out or
                    looking to advance your existing skills, this course offers
                    practical insights and hands-on experience to help you
                    achieve your goals.
                  </p>
                  <p className="text-gray-700">
                    The course is structured to accommodate{' '}
                    {course.businessStage} businesses, with a focus on practical
                    applications that you can implement immediately. Our
                    experienced instructors bring real-world expertise to help
                    you navigate the challenges of modern business environments.
                  </p>
                </div>
              </section>

              {/* Learning Outcomes Section */}
              <section className="mb-12 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What You'll Learn
                </h2>
                <div className="grid gap-4">
                  {course.learningOutcomes.map((outcome, index) => <div key={index} className="flex items-start bg-white p-5 rounded-lg shadow-sm">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{outcome}</span>
                    </div>)}
                </div>
              </section>

              {/* Course Schedule */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Course Schedule
                </h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center mb-6 bg-blue-50 p-3 rounded-lg">
                    <Calendar className="text-blue-600 mr-3 mb-2 md:mb-0" size={20} />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">
                        Start Date:{' '}
                        <span className="text-blue-700">
                          {course.startDate}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Starts: {course.startDate}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 md:ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                        {course.deliveryMode}
                      </span>
                    </div>
                  </div>
                  {/* Timeline view */}
                  <div className="space-y-4">
                    <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <h4 className="font-semibold text-gray-900">Week 1</h4>
                      <p className="text-gray-700">
                        Introduction and foundation concepts
                      </p>
                    </div>
                    <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <h4 className="font-semibold text-gray-900">Week 2</h4>
                      <p className="text-gray-700">
                        Core principles and practical exercises
                      </p>
                    </div>
                    <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <h4 className="font-semibold text-gray-900">
                        Week 3-4
                      </h4>
                      <p className="text-gray-700">
                        Advanced techniques and final projects
                      </p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                      <h4 className="font-semibold text-gray-900">
                        Final Week
                      </h4>
                      <p className="text-gray-700">
                        Project presentations and certification
                      </p>
                    </div>
                  </div>
                  {/* Location if applicable */}
                  {course.location && <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <MapPin className="text-blue-600 mr-2" size={18} />
                        <h4 className="font-medium text-gray-800">Location</h4>
                      </div>
                      <p className="text-gray-700 mt-1 ml-6">
                        {course.location}
                      </p>
                    </div>}
                </div>
              </section>

              {/* Provider Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About the Provider
                </h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <img src={course.provider.logoUrl} alt={course.provider.name} className="h-16 w-16 object-contain rounded-lg shadow-sm" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {course.provider.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Leading provider of business education
                      </p>
                    </div>
                    <div className="md:ml-auto flex flex-col md:items-end">
                      <div className="text-sm text-gray-500">Credibility</div>
                      <div className="flex items-center">
                        <span className="font-bold text-blue-600 mr-2">
                          500+
                        </span>
                        <span className="text-gray-700">SMEs trained</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {course.provider.description}
                  </p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center">
                    Visit Provider Website
                    <ExternalLinkIcon size={16} className="ml-1" />
                  </button>
                </div>
              </section>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                  <h3 className="font-bold text-lg">Course Details</h3>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-gray-900">
                        {course.price || 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-bold text-gray-900">
                        {course.startDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-bold text-gray-900">
                        {course.deliveryMode}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      This course includes:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircleIcon size={16} className="text-dqYellow mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          Comprehensive course materials
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon size={16} className="text-dqYellow mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          Expert-led sessions
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon size={16} className="text-dqYellow mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          Certificate of completion
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon size={16} className="text-dqYellow mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          Access to exclusive resources
                        </span>
                      </li>
                    </ul>
                  </div>
                  <button id="enroll-section" className="w-full px-4 py-3 text-white font-bold rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:from-teal-600 hover:via-blue-600 hover:to-purple-700 transition-colors shadow-md mb-3">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <section className="bg-gray-50 py-10 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Courses
              </h2>
              <a href="/courses" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                See All Courses
                <ChevronRightIcon size={16} className="ml-1" />
              </a>
            </div>
            {relatedCourses.length > 0 ? <RelatedCourses currentCourse={course} courses={relatedCourses} onCourseSelect={selectedCourse => navigate(`/courses/${selectedCourse.id}`)} bookmarkedCourses={bookmarkedCourses} onToggleBookmark={onToggleBookmark} /> : <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">No related courses found</p>
              </div>}
          </div>
        </section>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-30">
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <div className="text-gray-900 font-bold">
              {course.price || 'Free'}
            </div>
            <div className="text-sm text-gray-600">{course.startDate}</div>
          </div>
          <button className="flex-1 px-4 py-3 text-white font-bold rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:from-teal-600 hover:via-blue-600 hover:to-purple-700 transition-colors shadow-md">
            Enroll Now
          </button>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>;
};