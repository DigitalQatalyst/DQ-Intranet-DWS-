import type { NewsItem } from '@/data/media/news';
import { Link } from 'react-router-dom';
import { formatDateVeryShort, generateTitle, getNewsImageSrc } from '@/utils/newsUtils';

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

// Unique color for Blog tag
const BLOG_COLOR = '#14B8A6'; // Teal color for blogs
const PODCAST_COLOR = '#8B5CF6'; // Purple color for podcasts

interface BlogCardProps {
  item: NewsItem;
  href?: string;
}

export function BlogCard({ item, href }: BlogCardProps) {
  // Check if this is a podcast
  const isPodcast = item.format === 'Podcast' || item.tags?.some(tag => tag.toLowerCase().includes('podcast'));
  const imageSrc = getNewsImageSrc(item, fallbackImages);
  const authorName = item.byline || item.author || 'DQ Media Team';
  const displayTitle = generateTitle(item);
  const categoryLabel = isPodcast ? 'Podcast' : 'Blog';
  const categoryColor = isPodcast ? PODCAST_COLOR : BLOG_COLOR;
  const buttonText = isPodcast ? 'Listen Now' : 'View Insights';
  
  // Get views from localStorage (synced with details page)
  const storedViews = typeof window !== 'undefined' ? localStorage.getItem(`news-views-${item.id}`) : null;
  const views = storedViews ? parseInt(storedViews, 10) : 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img src={imageSrc} alt={displayTitle} className="h-48 w-full object-cover object-top" loading="lazy" />
        {/* Category tag with unique color */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColor }} />
          {categoryLabel}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col">
          <div className="text-xs text-gray-500">
            {authorName} · {formatDateVeryShort(item.date)}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3.25rem]">
            {displayTitle}
          </h3>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3 min-h-[3.5rem]">
            {item.excerpt}
          </p>

          <div className="mt-3 text-xs text-gray-500">
            {isPodcast ? `${views} listens` : `${views} views`}
          </div>
        </div>

        <div className="mt-auto pt-4">
          {href ? (
            <Link
              to={href}
              className="block h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90"
            >
              {buttonText}
            </Link>
          ) : (
            <button className="h-9 w-full rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
