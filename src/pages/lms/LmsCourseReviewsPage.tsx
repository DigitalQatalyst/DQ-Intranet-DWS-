import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon, Star, ArrowLeft } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LMS_COURSE_DETAILS } from '../../data/lmsCourseDetails';

export const LmsCourseReviewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = LMS_COURSE_DETAILS.find(detail => detail.slug === slug);

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

  // Mock reviews data - in a real app, this would come from an API
  const reviews = [
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Senior Developer',
      rating: 5,
      date: '2024-01-15',
      text: 'This course provided excellent insights into how DQ operates. Very comprehensive and well-structured!',
      helpful: 12
    },
    {
      id: 2,
      author: 'Ahmed Al-Mansoori',
      role: 'Product Manager',
      rating: 4,
      date: '2024-01-10',
      text: 'Great orientation material for new team members. The content is clear and easy to follow.',
      helpful: 8
    },
    {
      id: 3,
      author: 'Maria Garcia',
      role: 'Design Lead',
      rating: 5,
      date: '2024-01-05',
      text: 'Excellent course! I learned a lot about DQ\'s structure and processes.',
      helpful: 15
    },
    {
      id: 4,
      author: 'John Smith',
      role: 'Engineer',
      rating: 4,
      date: '2023-12-28',
      text: 'Very helpful for understanding how DQ works. Would recommend to new joiners.',
      helpful: 6
    }
  ];

  const averageRating = course.rating || 4.5;
  const reviewCount = course.reviewCount || reviews.length;

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
                    <Link to="/lms" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      courses
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link to={`/lms/${course.slug}`} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      {course.title}
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
                onClick={() => navigate(`/lms/${course.slug}`)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Course
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews for {course.title}</h1>
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
                  <span className="ml-2 text-lg font-semibold text-gray-900">{averageRating}</span>
                </div>
                <span className="text-gray-600">Based on {reviewCount} reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-10">
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.author}</h3>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button className="hover:text-blue-600">Helpful ({review.helpful})</button>
                  <button className="hover:text-blue-600">Report</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsCourseReviewsPage;

