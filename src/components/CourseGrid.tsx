import React, { useState } from 'react';
import { CourseCard } from './CourseCard';
import { CourseType } from '../utils/mockData';
import { CourseQuickViewModal } from './CourseQuickViewModal';
import { PromoCard } from './PromoCard';
import { Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface CourseGridProps {
  courses: CourseType[];
  onCourseSelect: (course: CourseType) => void;
  bookmarkedCourses: string[];
  onToggleBookmark: (courseId: string) => void;
  onAddToComparison: (course: CourseType) => void;
}
export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  onCourseSelect,
  bookmarkedCourses,
  onToggleBookmark,
  onAddToComparison
}) => {
  const [quickViewCourse, setQuickViewCourse] = useState<CourseType | null>(null);
  const navigate = useNavigate();
  // Promo cards to be inserted after every 6 regular cards
  const promoCards = [{
    id: 'learning-spotlight',
    title: 'Ready to Accelerate?',
    description: 'Explore guided onboarding journeys and essentials that help you ramp faster at DQ.',
    icon: <Calendar size={24} className="text-white" />,
    path: '/onboarding',
    gradientFrom: 'from-[#030F35]',
    gradientTo: 'to-[#FB5535]',
    ctaLabel: 'Explore Now'
  }, {
    id: 'mentor-support',
    title: 'Need a Coach or Mentor?',
    description: 'Connect with DQ coaches and onboarding partners for personalized guidance on your first wins.',
    icon: <Briefcase size={24} className="text-white" />,
    path: '/mentorship/request',
    gradientFrom: 'from-[#FB5535]',
    gradientTo: 'to-[#030F35]',
    ctaLabel: 'Get Support'
  }];
  if (courses.length === 0) {
    return <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No onboarding flows found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search criteria
        </p>
      </div>;
  }
  // Insert promo cards after every 6 regular cards
  const itemsWithPromos = courses.reduce((acc, course, index) => {
    acc.push({
      type: 'course',
      data: course
    });
    // Insert a promo card after every 6 courses
    if ((index + 1) % 6 === 0 && promoCards[Math.floor(index / 6) % promoCards.length]) {
      const promoIndex = Math.floor(index / 6) % promoCards.length;
      acc.push({
        type: 'promo',
        data: promoCards[promoIndex]
      });
    }
    return acc;
  }, [] as Array<{
    type: 'course' | 'promo';
    data: any;
  }>);
  return <div>
      <div className="flex justify-between items-center mb-4">
        {/* Responsive header - concise on mobile */}
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Available Flows ({courses.length})
        </h2>
        <div className="text-sm text-gray-500 hidden sm:block">
          Showing {courses.length} of {courses.length} flows
        </div>
        {/* Mobile-friendly header */}
        <h2 className="text-lg font-medium text-gray-800 sm:hidden">
          {courses.length} Flows Available
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {itemsWithPromos.map((item, idx) => {
        if (item.type === 'course') {
          const course = item.data as CourseType;
          // Add tags to course object for display in CourseCard
          const courseWithTags = {
            ...course,
            tags: [course.category, course.deliveryMode]
          };
          return <CourseCard key={`course-${course.id}`} course={courseWithTags} onClick={() => onCourseSelect(course)} onQuickView={() => setQuickViewCourse(course)} isBookmarked={bookmarkedCourses.includes(course.id)} onToggleBookmark={() => onToggleBookmark(course.id)} onAddToComparison={() => onAddToComparison(course)} />;
        } else if (item.type === 'promo') {
          const promo = item.data;
          return <PromoCard key={`promo-${promo.id}-${idx}`} title={promo.title} description={promo.description} icon={promo.icon} path={promo.path} gradientFrom={promo.gradientFrom} gradientTo={promo.gradientTo} ctaLabel={promo.ctaLabel} />;
        }
        return null;
      })}
      </div>
      {/* Quick View Modal */}
      {quickViewCourse && <CourseQuickViewModal course={quickViewCourse} onClose={() => setQuickViewCourse(null)} onViewDetails={() => {
      setQuickViewCourse(null);
      navigate(`/onboarding/${quickViewCourse.id}`);
    }} isBookmarked={bookmarkedCourses.includes(quickViewCourse.id)} onToggleBookmark={() => onToggleBookmark(quickViewCourse.id)} onAddToComparison={() => {
      onAddToComparison(quickViewCourse);
      setQuickViewCourse(null);
    }} />}
    </div>;
};
