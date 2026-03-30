import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { formatDate, getNewsTypeDisplay } from '@/utils/newsUtils';

interface ArticleSummaryProps {
  article: NewsItem;
  shouldUseNewLayout: boolean;
  onListenNow?: () => void;
}

export const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, onListenNow }) => {
  const announcementDate = article.date ? formatDate(article.date) : '';
  const isBlog = article.type === 'Thought Leadership' && article.format !== 'Podcast';
  const isPodcast = article.format === 'Podcast' || article.tags?.some(t => t.toLowerCase().includes('podcast'));
  const displayAuthor = isBlog || isPodcast
    ? (article.byline || article.author || 'DQ Media Team')
    : article.author;

  const summaryTitle = isPodcast ? 'Episode Summary' : isBlog ? 'Blog Summary' : 'Announcement Summary';

  const rows = [
    { label: 'Author', value: displayAuthor ?? '—' },
    { label: 'Date', value: announcementDate },
    { label: isPodcast ? 'Duration' : 'Reading Time', value: isPodcast ? '60+ Minutes' : (article.readingTime ? `${article.readingTime} min` : '<5 min') },
    { label: 'Category', value: getNewsTypeDisplay(article).label },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.excerpt, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <div className="sticky top-8 space-y-4">
      {/* Summary Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold text-foreground">{summaryTitle}</h3>
        </div>
        <div className="px-5 pb-5">
          {/* Key-value rows */}
          <div className="space-y-2.5 mb-5">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="space-y-2.5">
            {isPodcast ? (
              <button
                type="button"
                onClick={onListenNow}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#081540' }}
              >
                Listen Now <ArrowRight className="h-4 w-4" />
              </button>
            ) : isBlog ? (
              <a
                href={article.externalUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#081540' }}
              >
                Read More <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#081540' }}
              >
                Share Announcement <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
