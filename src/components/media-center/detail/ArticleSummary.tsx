import React from 'react';
import { useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import { formatDate, getNewsTypeDisplay } from '@/utils/newsUtils';

interface ArticleSummaryProps {
  article: NewsItem;
  shouldUseNewLayout: boolean;
}

export const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, shouldUseNewLayout }) => {
  const location = useLocation();
  const announcementDate = article.date ? formatDate(article.date) : '';
  const displayAuthor = article.type === 'Thought Leadership'
    ? (article.byline || article.author || 'DQ Media Team')
    : article.author;

  const getFullBlogUrl = (): string => {
    if (article.id === 'compute-nationalism-rise') {
      return 'https://corp-web.qatalyst.tech/blog/rise-of-compute-nationalism';
    }

    if (article.id === 'beijing-ai-superstate') {
      return 'https://corp-web.qatalyst.tech/blog/china-ai-superstate';
    }

    if (article.id === 'europe-ethical-ai-compute') {
      return 'https://corp-web.qatalyst.tech/blog/europe-ai-compute-challenge';
    }

    return `/marketplace/news/${article.id}${location.search || ''}`;
  };

  if (shouldUseNewLayout) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" aria-label="Article Summary">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Article Summary</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Author</span>
            <span className="text-gray-900 font-medium">{displayAuthor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date</span>
            <span className="text-gray-900 font-medium">{announcementDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Reading Time</span>
            <span className="text-gray-900 font-medium">{article.readingTime || '5–10'} min</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Category</span>
            <span className="text-gray-900 font-medium">{getNewsTypeDisplay(article).label}</span>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button 
            type="button"
            className="w-full px-4 py-3 text-white font-semibold rounded-md transition-colors shadow-md hover:opacity-90" 
            style={{ backgroundColor: '#030F35' }}
            onClick={() => {
              window.open(getFullBlogUrl(), '_blank');
            }}
          >
            View Full Blog
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" aria-label="Announcement Summary">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Announcement Summary</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Author</span>
          <span className="text-gray-900 font-medium">HRA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date</span>
          <span className="text-gray-900 font-medium">{announcementDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Reading Time</span>
          <span className="text-gray-900 font-medium">{article.readingTime || '5–10'} min</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Category</span>
          <span className="text-gray-900 font-medium">{getNewsTypeDisplay(article).label}</span>
        </div>
      </div>
    </section>
  );
};
