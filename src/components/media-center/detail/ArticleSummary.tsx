import React from 'react';
import { useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import { formatDate, getNewsTypeDisplay } from '@/utils/newsUtils';

interface ArticleSummaryProps {
  article: NewsItem;
  shouldUseNewLayout: boolean;
  onListenNow?: () => void;
}

export const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, shouldUseNewLayout, onListenNow }) => {
  const location = useLocation();
  const announcementDate = article.date ? formatDate(article.date) : '';
  const displayAuthor = article.type === 'Thought Leadership'
    ? (article.byline || article.author || 'DQ Media Team')
    : article.author;
  const isBlog = article.type === 'Thought Leadership' && article.format !== 'Podcast';
  const isPodcast = article.format === 'Podcast' || article.tags?.some(tag => tag.toLowerCase().includes('podcast'));

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ml-auto" style={{ maxWidth: '320px' }} aria-label="Announcement Summary">
      <div className="px-5 py-5">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
        {isPodcast ? 'Episode Summary' : isBlog ? 'Blog Summary' : 'Announcement Summary'}
      </h3>
        
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Author</span>
            <span className="text-gray-900 font-semibold text-sm">{displayAuthor}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Date</span>
            <span className="text-gray-900 font-semibold text-sm">{announcementDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{isPodcast ? 'Duration' : 'Reading Time'}</span>
            <span className="text-gray-900 font-semibold text-sm">&lt;5 min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Category</span>
            <span className="text-gray-900 font-semibold text-sm">{getNewsTypeDisplay(article).label}</span>
          </div>
        </div>

        <div>
          {isPodcast ? (
            onListenNow ? (
              <button
                type="button"
                onClick={onListenNow}
                className="block w-full px-5 py-3 text-white font-semibold text-sm rounded-lg transition-all hover:opacity-90 text-center"
                style={{ backgroundColor: '#122157' }}
              >
                Listen Now
              </button>
            ) : (
            <a
              href={article.audioUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-5 py-3 text-white font-semibold text-sm rounded-lg transition-all hover:opacity-90 text-center"
              style={{ backgroundColor: '#122157' }}
            >
              Listen Now
            </a>
            )
          ) : isBlog ? (
            <a
              href={article.externalUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-5 py-3 text-white font-semibold text-sm rounded-lg transition-all hover:opacity-90 text-center" 
              style={{ backgroundColor: '#122157' }}
            >
              Read More
            </a>
          ) : (
            <button 
              type="button"
              className="w-full px-5 py-3 text-white font-semibold text-sm rounded-lg transition-all hover:opacity-90 flex items-center justify-center" 
              style={{ backgroundColor: '#122157' }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              Share Announcement
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
