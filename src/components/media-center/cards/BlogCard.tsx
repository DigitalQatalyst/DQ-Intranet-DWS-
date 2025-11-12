import type { NewsItem } from '@/data/media/news';

import { Link } from 'react-router-dom';

interface BlogCardProps {
  item: NewsItem;
  href?: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
];

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function BlogCard({ item, href }: BlogCardProps) {
  const hash = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
  const imageSrc = item.image || fallbackImages[hash % fallbackImages.length];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative mb-3">
        <img src={imageSrc} alt={item.title} className="h-40 w-full rounded-xl object-cover" loading="lazy" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
          Thought Leadership
        </div>
      </div>

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
        <div className="mt-auto" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {href ? (
          <Link
            to={href}
            className="h-9 rounded-xl border border-gray-300 text-center text-sm font-semibold text-gray-800 leading-9 transition hover:bg-gray-50"
          >
            Details
          </Link>
        ) : (
          <button className="h-9 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 transition hover:bg-gray-50">
            Details
          </button>
        )}
        {href ? (
          <Link
            to={href}
            className="h-9 rounded-xl bg-[#1A2E6E] text-center text-sm font-semibold text-white leading-9 transition hover:bg-[#132456]"
          >
            Read Insight
          </Link>
        ) : (
          <button className="h-9 rounded-xl bg-[#1A2E6E] text-sm font-semibold text-white transition hover:bg-[#132456]">
            Read Insight
          </button>
        )}
      </div>
    </article>
  );
}
