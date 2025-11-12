import { useEffect, useMemo, useState } from 'react';
import { NEWS, type NewsItem } from '@/data/media/news';
import type { FiltersValue } from './types';
import { NewsCard } from './cards/NewsCard';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
}

const UPDATE_TYPES = ['Announcement', 'Guidelines', 'Notice'];
const matchesSelection = (value: string | undefined, selections?: string[]) =>
  !selections?.length || (value && selections.includes(value));

export default function AnnouncementsGrid({ query }: GridProps) {
  const [sourceItems, setSourceItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/lib/supabaseClient');
        const supabase = (mod as any).supabase as any;
        const { data, error } = await supabase
          .from('news')
          .select('id,title,type,date,author,byline,views,excerpt,image,department,location,domain,theme,tags,readingTime,newsType,newsSource,focusArea');
        if (error) throw error;
        if (!cancelled && Array.isArray(data)) setSourceItems(data as NewsItem[]);
      } catch {
        if (!cancelled) setSourceItems(NEWS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const search = query.q?.toLowerCase() ?? '';
    return sourceItems
      .filter((item) => UPDATE_TYPES.includes(item.type))
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
        const okDepartment = matchesSelection(item.department, department);
        const okLocation = matchesSelection(item.location, location);
        const okNewsType = matchesSelection(item.newsType, newsType);
        const okSource = matchesSelection(item.newsSource, newsSource);
        const okFocus = matchesSelection(item.focusArea, focusArea);
        return okDepartment && okLocation && okNewsType && okSource && okFocus;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [query, sourceItems]);

  if (query.tab !== 'announcements' || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items ({items.length})</h3>
        <span>Auto-refresh · Live</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item: NewsItem) => (
          <NewsCard key={item.id} item={item} href={`/marketplace/news/${item.id}`} />
        ))}
      </div>
    </section>
  );
}
