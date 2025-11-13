import { useMemo } from 'react';
import { NEWS, type NewsItem } from '@/data/media/news';
import type { FiltersValue } from './types';
import { BlogCard } from './cards/BlogCard';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
}


export default function BlogsGrid({ query }: GridProps) {
  const sourceItems: NewsItem[] = NEWS;

  const items = useMemo(() => {
    const search = query.q?.toLowerCase() ?? '';
    return sourceItems
      .filter((item) => item.type === 'Thought Leadership')
      .filter((item) => {
        if (!search) return true;
        return (
          item.title.toLowerCase().includes(search) ||
          item.excerpt.toLowerCase().includes(search) ||
          item.author.toLowerCase().includes(search)
        );
      })
      .filter((item) => {
        const department = query.filters?.department;
        const location = query.filters?.location;
        const newsType = query.filters?.newsType;
        const newsSource = query.filters?.newsSource;
        const focusArea = query.filters?.focusArea;

        const matches = (val?: string, sel?: string[]) => !sel?.length || (val && sel.includes(val));
        return (
          matches(item.department, department) &&
          matches(item.location, location) &&
          matches(item.newsType, newsType) &&
          matches(item.newsSource, newsSource) &&
          matches(item.focusArea, focusArea)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [query, sourceItems]);

  if (query.tab !== 'insights' || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items ({items.length})</h3>
        <span>Editors’ picks refreshed weekly</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item: NewsItem) => (
          <BlogCard key={item.id} item={item} href={`/marketplace/news/${item.id}`} />
        ))}
      </div>
    </section>
  );
}
