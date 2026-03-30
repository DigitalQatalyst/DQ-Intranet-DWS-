import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon, Star, ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LMS_COURSE_DETAILS } from '../../data/lmsCourseDetails';
import { useCourseReviewsBySlug, useCourseReviewStats } from '../../hooks/useCourseReviews';
import { ReviewList } from '../../components/lms/ReviewCard';
import { useLmsCourse } from '../../hooks/useLmsCourses';

export const LmsCourseReviewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get course from static data (fallback)
  const courseFromStatic = LMS_COURSE_DETAILS.find(detail => detail.slug === slug);

  // Fetch course from Supabase
  const { data: course, isLoading: courseLoading } = useLmsCourse(slug || '');

  // Fetch reviews 
  const { data: reviews, isLoading: reviewsLoading } = useCourseReviewsBySlug(slug || '');

  // Fetch review stats
  const courseId = course?.id || courseFromStatic?.id || '';
  const { data: stats } = useCourseReviewStats(courseId);

  if (courseLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (!course && !courseFromStatic) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Course Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't locate that LMS course.
            </p>
            <button
              onClick={() => navigate('/lms')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Learning Center
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const courseTitle = course?.title || courseFromStatic?.title || 'Course';
  const courseSlug = course?.slug || courseFromStatic?.slug || slug;
  const averageRating = stats?.averageRating || course?.rating || courseFromStatic?.rating || 0;
  const reviewCount = stats?.totalReviews || reviews?.length || 0;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        {/* Header Section */}
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
                      Courses
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link to={`/lms/${courseSlug}`} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      {courseTitle}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">Reviews</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate(`/lms/${courseSlug}`)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Course
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews for {courseTitle}</h1>
              <div className="flex items-center gap-4">
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
                <span className="text-gray-600">
                  Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            {/* Rating Distribution */}
            {stats && stats.totalReviews > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Rating Distribution</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5];
                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-6">{rating}</span>
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-10">
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <ReviewList
              reviews={reviews}
              showCourseLink={false}
              emptyMessage="No reviews yet. Be the first to review this course!"
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your learning experience with this course!
              </p>
              <Link
                to={`/lms/${courseSlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start Learning
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourseReviewsPage;
