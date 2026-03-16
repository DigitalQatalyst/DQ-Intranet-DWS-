import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import type { NewsItem } from '@/data/media/news';
import { useArticleData } from '@/hooks/useArticleData';
import { useEngagementMetrics } from '@/hooks/useEngagementMetrics';
import { HeroSection } from '@/components/media-center/detail/HeroSection';
import { ArticleContent } from '@/components/media-center/detail/ArticleContent';
import { ArticleSummary } from '@/components/media-center/detail/ArticleSummary';
import { EngagementMetrics } from '@/components/media-center/detail/EngagementMetrics';
import { ErrorState } from '@/components/media-center/detail/ErrorState';

// Helper function to determine layout type - only podcasts use the series page, all others use standard layout
const shouldUseNewLayout = (article: NewsItem | null): boolean => {
  return false; // All articles now use the standard layout
};


const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'highlights' | 'related'>('details');

  const { article, related, isLoading, loadError } = useArticleData(id);
  const { likes, hasLiked, views, handleLike } = useEngagementMetrics(id, article?.id);

  const useNewLayout = shouldUseNewLayout(article);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <ErrorState isLoading={isLoading} loadError={loadError} />
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="flex-1">
        <HeroSection 
          article={article} 
          location={location}
          isBookmarked={isBookmarked}
          onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
        />

        {/* Main Content Section - seamless transition from hero */}
        <section className="bg-white relative" style={{ zIndex: 20, borderTop: 'none', marginTop: '-120px' }}>
          <div className="mx-auto pt-0 pb-8" style={{ maxWidth: '1336px', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content - 2/3 width */}
              <div className="lg:col-span-2">
                {/* Article Content - no tabs */}
                <div>
                  <div className="prose max-w-none">
                    <ArticleContent
                      article={article}
                      related={related}
                      shouldUseNewLayout={useNewLayout}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Sidebar - 1/3 width */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <ArticleSummary article={article} shouldUseNewLayout={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
