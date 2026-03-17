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

// Helper function to determine layout type
const shouldUseNewLayout = (article: NewsItem | null): boolean => {
  if (!article) return false;
  const isBlogArticle = article.type === 'Thought Leadership' && article.format !== 'Podcast';
  return isBlogArticle || 
    (article.format === 'Podcast' || article.tags?.some(tag => tag.toLowerCase().includes('podcast')));
};


const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'related'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="flex-1">
        <HeroSection 
          article={article} 
          location={location}
          isBookmarked={isBookmarked}
          onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
        />

        <section className="bg-white py-6">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <ArticleContent
                  article={article}
                  related={related}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  shouldUseNewLayout={useNewLayout}
                />
                            </div>
                            
              {useNewLayout && activeTab === 'overview' && (
                <div className="lg:col-span-1">
                  <div className="sticky top-8 lg:pt-[41px]">
                    <ArticleSummary article={article} shouldUseNewLayout={true} />
                  </div>
                </div>
              )}
              {!useNewLayout && (
                <div className="lg:col-span-1">
                  <div className="sticky top-8 lg:pt-[41px]">
                    <ArticleSummary article={article} shouldUseNewLayout={false} />
                  </div>
                </div>
              )}
            </div>

            <EngagementMetrics
              views={views}
              likes={likes}
              hasLiked={hasLiked}
              onLike={handleLike}
            />
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
