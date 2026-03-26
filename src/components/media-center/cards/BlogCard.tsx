import type { NewsItem } from '@/data/media/news';
import { Link } from 'react-router-dom';
import { formatDateVeryShort, generateTitle, getNewsImageSrc } from '@/utils/newsUtils';

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

const BLOG_COLOR = '#14B8A6';
const PODCAST_COLOR = '#F97316';

interface BlogCardProps {
  item: NewsItem;
  href?: string;
}

export function BlogCard({ item, href }: BlogCardProps) {
  const isPodcast = item.format === 'Podcast' || item.tags?.some(tag => tag.toLowerCase().includes('podcast'));
  const imageSrc = getNewsImageSrc(item, fallbackImages);
  const displayTitle = generateTitle(item);
  const categoryLabel = isPodcast ? 'Podcast' : 'Blog';
  const categoryColor = isPodcast ? PODCAST_COLOR : BLOG_COLOR;

  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[360px]">
      {/* Image */}
      <div className="overflow-hidden rounded-t-2xl">
        <img src={imageSrc} alt={displayTitle} className="h-48 w-full object-cover object-top transition-transform duration-300 hover:scale-105" loading="lazy" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Tags row */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${categoryColor}18`, color: categoryColor }}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-2">
          {displayTitle}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {item.excerpt}
        </p>

        {/* Date */}
        <div className="mt-3 text-xs text-gray-400 font-medium">
          {formatDateVeryShort(item.date)}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <span className="block h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90">
            {isPodcast ? 'Listen Now' : 'Read More'}
          </span>
        </div>
      </div>
    </article>
  );

  return href ? <Link to={href} className="flex h-full flex-col no-underline">{inner}</Link> : inner;
}
