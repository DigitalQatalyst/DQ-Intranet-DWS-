import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useArticleData } from '@/hooks/useArticleData';
import { useEngagementMetrics } from '@/hooks/useEngagementMetrics';
import { HeroSection } from '@/components/media-center/detail/HeroSection';
import { ArticleContent } from '@/components/media-center/detail/ArticleContent';
import { ArticleSummary } from '@/components/media-center/detail/ArticleSummary';
import { ErrorState } from '@/components/media-center/detail/ErrorState';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { article, related, isLoading, loadError } = useArticleData(id);
  useEngagementMetrics(id, article?.id);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <ErrorState isLoading={isLoading} loadError={loadError} />
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />

      <HeroSection
        article={article}
        location={location}
        isBookmarked={isBookmarked}
        onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
      />

      <main
        className="flex-1 px-6 pb-12"
        style={{ marginTop: '0', position: 'relative', zIndex: 20 }}
      >
        <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3" style={{ maxWidth: '1336px' }}>
          <div className="lg:col-span-2 space-y-6">
            <ArticleContent
              article={article}
              related={related}
              shouldUseNewLayout={false}
            />
          </div>

          <aside className="order-first lg:order-last">
            <ArticleSummary article={article} shouldUseNewLayout={true} />
          </aside>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
