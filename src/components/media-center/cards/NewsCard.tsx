import type { NewsItem } from '@/data/media/news';
import { Link } from 'react-router-dom';
import { formatDateVeryShort, generateTitle, getNewsTypeDisplay, getNewsImageSrc } from '@/utils/newsUtils';

interface NewsCardProps {
  item: NewsItem;
  href?: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

const fallbackHero =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

export function NewsCard({ item, href }: NewsCardProps) {
  const imageSrc = getNewsImageSrc(item, fallbackImages, fallbackHero);
  const displayTitle = generateTitle(item);
  const newsTypeDisplay = getNewsTypeDisplay(item);

  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[360px]">
      {/* Image */}
      <div className="overflow-hidden rounded-t-2xl">
        <img src={imageSrc} alt={displayTitle} className="h-48 w-full object-cover object-top transition-transform duration-300 hover:scale-105" loading="lazy" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Tag row */}
        <div className="mb-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${newsTypeDisplay.color}18`, color: newsTypeDisplay.color }}
          >
            {newsTypeDisplay.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-2">
          {displayTitle}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed flex-1">
          {item.excerpt}
        </p>

        {/* Date */}
        <div className="mt-2 text-xs text-gray-400 font-medium">
          {formatDateVeryShort(item.date)}
        </div>

        {/* CTA */}
        <div className="mt-2">
          <span className="block h-9 rounded-full bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90">
            View Details
          </span>
        </div>
      </div>
    </article>
  );

  return href ? <Link to={href} className="flex h-full flex-col no-underline">{inner}</Link> : inner;
}
