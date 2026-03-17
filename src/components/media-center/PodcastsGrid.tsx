import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import type { FiltersValue } from './types';
import { PodcastSeriesCard } from './cards/PodcastSeriesCard';
import { formatDuration } from '@/utils/newsUtils';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
  items: NewsItem[];
}

export default function PodcastsGrid({ query, items }: GridProps) {
  const location = useLocation();

  if (query.tab !== 'podcasts') {
    return null;
  }

  // Get all podcast episodes
  const podcastEpisodes = useMemo(() => {
    return items.filter(
      (item) =>
        item.format === 'Podcast' ||
        item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
    );
  }, [items]);

  // Calculate average duration of all episodes
  const averageDurationMinutes = useMemo(() => {
    if (podcastEpisodes.length === 0) return 0;
    
    const totalMinutes = podcastEpisodes.reduce((sum, episode) => {
      // Try to get duration from readingTime
      if (episode.readingTime) {
        const dur = formatDuration(episode.readingTime);
        const minutes = parseInt(dur.replace(' min', '')) || 0;
        return sum + minutes;
      }
      return sum;
    }, 0);
    
    return Math.round(totalMinutes / podcastEpisodes.length);
  }, [podcastEpisodes]);

  // Check if series matches filters
  const shouldShowSeries = useMemo(() => {
    const filters = query.filters || {};
    
    // Domain filter - check if any episode matches
    const domainFilter = filters.domain;
    if (domainFilter && domainFilter.length > 0) {
      const hasMatchingDomain = podcastEpisodes.some(
        (episode) => episode.domain && domainFilter.includes(episode.domain)
      );
      if (!hasMatchingDomain) return false;
    }

    // Theme filter - check if any episode matches
    const themeFilter = filters.theme;
    if (themeFilter && themeFilter.length > 0) {
      const hasMatchingTheme = podcastEpisodes.some(
        (episode) => episode.theme && themeFilter.includes(episode.theme)
      );
      if (!hasMatchingTheme) return false;
    }

    // Duration filter - check if average duration matches
    const durationFilter = filters.readingTime;
    if (durationFilter && durationFilter.length > 0) {
      const matchesDuration = durationFilter.some((filter) => {
        if (filter === '10–20') {
          return averageDurationMinutes >= 10 && averageDurationMinutes < 20;
        } else if (filter === '20+') {
          return averageDurationMinutes >= 20;
        }
        return false;
      });
      if (!matchesDuration) return false;
    }

    return true;
  }, [query.filters, podcastEpisodes, averageDurationMinutes]);

  if (!shouldShowSeries) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <h3 className="font-medium text-gray-800">Available Items (0)</h3>
          <span>Podcasts updated regularly</span>
        </div>
        <div className="text-center py-12 text-gray-500">No podcast series found matching the selected filters</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items (2)</h3>
        <span>Podcasts updated regularly</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <PodcastSeriesCard
          href={`/marketplace/news/action-solver-podcast${location.search}`}
        />
        <PodcastSeriesCard
          href={`/marketplace/news/the-execution-mindset${location.search}`}
          title="The Execution Mindset"
          label="Execution Mindset Series"
        />
      </div>
    </section>
  );
}

