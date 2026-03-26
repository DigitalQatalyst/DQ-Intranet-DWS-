import React from 'react';
import Navigation from '@/components/media-center/Navigation';
import Hero from '@/components/media-center/Hero';
import TabContent from '@/components/media-center/TabContent';
import Sidebar from '@/components/media-center/Sidebar';
import RelatedArticles from '@/components/media-center/RelatedArticles';
import Footer from '@/components/media-center/Footer';
import { cn } from '@/lib/media-center-utils';

const CourseDetailPage: React.FC = () => {
  // Sample data - in real app this would come from API
  const courseData = {
    title: "Advanced React Development with TypeScript",
    description: "Master modern React development with TypeScript, including hooks, context, testing, and best practices for building scalable applications.",
    badge: "Advanced Course",
    metadata: [
      { label: "Duration", value: "8 weeks" },
      { label: "Level", value: "Advanced" },
      { label: "Students", value: "1,234" },
      { label: "Rating", value: "4.8/5" },
    ],
  };

  const sidebarData = {
    title: "Course Summary",
    metadata: [
      { label: "Instructor", value: "John Doe" },
      { label: "Language", value: "English" },
      { label: "Certificate", value: "Yes" },
      { label: "Access", value: "Lifetime" },
    ],
    primaryCTA: {
      text: "Enroll Now",
      onClick: () => console.log('Enroll clicked'),
    },
    secondaryCTA: {
      text: "Preview Course",
      onClick: () => console.log('Preview clicked'),
    },
  };

  const tabsData = [
    {
      id: 'details',
      label: 'Details',
      content: [
        {
          type: 'heading' as const,
          content: 'Course Overview',
          accentColor: '#3B82F6',
        },
        {
          type: 'paragraph' as const,
          content: 'This comprehensive course takes you from intermediate to advanced React development. You\'ll learn the latest React patterns, TypeScript integration, and industry best practices.',
        },
        {
          type: 'checklist' as const,
          items: [
            'Advanced React Hooks and custom hooks',
            'TypeScript integration and type safety',
            'State management with Context and Redux',
            'Testing with Jest and React Testing Library',
            'Performance optimization techniques',
          ],
        },
        {
          type: 'heading' as const,
          content: 'What You\'ll Learn',
          accentColor: '#10B981',
        },
        {
          type: 'checklist' as const,
          items: [
            'Build complex React applications',
            'Implement TypeScript best practices',
            'Master React testing strategies',
            'Optimize application performance',
            'Deploy production-ready apps',
          ],
        },
      ],
    },
    {
      id: 'updates',
      label: 'Updates',
      content: [
        {
          type: 'heading' as const,
          content: 'Latest Updates',
          accentColor: '#F97316',
        },
        {
          type: 'paragraph' as const,
          content: 'No new updates have been posted for this announcement yet. Check back soon for rescheduled event details and the associate poll results.',
        },
      ],
    },
  ];

  const relatedArticles = [
    {
      id: '1',
      title: 'React Performance Optimization Guide',
      description: 'Learn how to optimize your React applications for maximum performance.',
      category: 'Performance',
      readTime: '15 min read',
      thumbnail: '/api/placeholder/400/225',
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      description: 'Essential TypeScript patterns and practices for React development.',
      category: 'TypeScript',
      readTime: '12 min read',
      thumbnail: '/api/placeholder/400/225',
    },
    {
      id: '3',
      title: 'Testing React Components',
      description: 'Comprehensive guide to testing React applications with Jest and RTL.',
      category: 'Testing',
      readTime: '18 min read',
      thumbnail: '/api/placeholder/400/225',
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(0_0%_98%)]">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero
        title={courseData.title}
        description={courseData.description}
        badge={courseData.badge}
        metadata={courseData.metadata}
      />

      {/* Main Content */}
      <main className="bg-white pt-8 pb-8">
        <div className="mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Tab Content */}
            <div className="lg:col-span-3 space-y-6">
              <TabContent tabs={tabsData} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar
                title={sidebarData.title}
                metadata={sidebarData.metadata}
                primaryCTA={sidebarData.primaryCTA}
                secondaryCTA={sidebarData.secondaryCTA}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
