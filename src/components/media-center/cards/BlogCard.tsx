import type { NewsItem } from '@/data/media/news';

import { Link } from 'react-router-dom';

interface BlogCardProps {
  item: NewsItem;
  href?: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function BlogCard({ item, href }: BlogCardProps) {
  const hash = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
  const imageSrc = item.image || fallbackImages[hash % fallbackImages.length];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img src={imageSrc} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
          Thought Leadership
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col">
          <div className="mb-1 text-xs text-gray-500">
            {(item.byline || item.author) ?? 'DQ Media Team'} · {item.views} views · {formatDate(item.date)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
            {item.newsType && <span className="rounded-full bg-gray-100 px-2 py-1">{item.newsType}</span>}
            {item.newsSource && <span className="rounded-full bg-gray-100 px-2 py-1">{item.newsSource}</span>}
            {item.focusArea && <span className="rounded-full bg-gray-100 px-2 py-1">{item.focusArea}</span>}
          </div>
        </div>

        <div className="mt-auto pt-4">
          {href ? (
            <Link
              to={href}
              className="block w-full h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90"
            >
              View Insights
            </Link>
          ) : (
            <button className="w-full h-9 rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              View Insights
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
