import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import { formatDateShort, getNewsTypeDisplay } from '@/utils/newsUtils';
import { parseBold } from '@/utils/contentParsing';
import { AudioPlayer } from '@/components/media-center/shared/AudioPlayer';
import { generateAnnouncementHeading, buildOverview, generateBlogSummary } from './contentHelpers';

interface ArticleContentProps {
  article: NewsItem;
  related: NewsItem[];
  activeTab: 'overview' | 'related';
  onTabChange: (tab: 'overview' | 'related') => void;
  shouldUseNewLayout: boolean;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  article,
  related,
  activeTab,
  onTabChange,
  shouldUseNewLayout,
}) => {
  const location = useLocation();
  const isPodcast = article.format === 'Podcast' || article.tags?.some(tag => tag.toLowerCase().includes('podcast'));
  const hasAudio = isPodcast && article.audioUrl;
  const overview = buildOverview(article);

  if (shouldUseNewLayout) {
    return (
      <>
        {hasAudio && article.audioUrl && <AudioPlayer audioUrl={article.audioUrl} />}
        
        <div>
          <div className="flex flex-col sm:flex-row gap-0 -mx-6 px-6">
            <button
              type="button"
              onClick={() => onTabChange('overview')}
              className={`px-4 py-1 font-medium text-sm transition-colors border-b-2 relative ${
                activeTab === 'overview'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onTabChange('related')}
              className={`px-4 py-1 font-medium text-sm transition-colors border-b-2 relative ${
                activeTab === 'related'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Related Media
            </button>
          </div>
          <div className="border-b border-gray-200 w-screen relative left-1/2 -translate-x-1/2"></div>
          <div className="pt-4">
            {activeTab === 'overview' ? (
              <div className="space-y-4">
                <div className="space-y-4">
                  {generateBlogSummary(article).map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <section aria-label="Related Media">
                <div className="space-y-3">
                  {related && related.length > 0 ? (
                    related.slice(0, 5).map((item) => {
                      const relatedDate = formatDateShort(item.date);
                      const newsTypeDisplay = getNewsTypeDisplay(item);
                      return (
                        <Link
                          key={item.id}
                          to={`/marketplace/news/${item.id}${location.search || ''}`}
                          className="block rounded-lg p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-1.5 bg-white border border-gray-200 text-gray-700">
                                {newsTypeDisplay?.color && (
                                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: newsTypeDisplay.color }} />
                                )}
                                <span>{newsTypeDisplay?.label || 'Announcement'}</span>
                              </span>
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                                {item.title || 'Untitled'}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">{relatedDate}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No related news and announcements available.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow p-6 space-y-4">
      {(() => {
        const headingText = generateAnnouncementHeading(article);
        const isNumberedHeading = /^(\*\*)?\d+\.\s/.test(headingText.trim());
        return (
          <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isNumberedHeading ? 'pl-0' : 'pl-4 relative'}`}>
            {!isNumberedHeading && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent"></span>
            )}
            {headingText}
          </h2>
        );
      })()}
      {overview.map((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;
        const boldText = parseBold(trimmed);
        return (
          <p key={index} className="text-gray-700 text-sm leading-normal mb-2">
            {boldText}
          </p>
        );
      })}
    </article>
  );
};
