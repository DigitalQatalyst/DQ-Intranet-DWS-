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

  // Separate episodes by series
  const actionSolverEpisodes = useMemo(() => {
    return podcastEpisodes.filter(ep => ep.audioUrl?.startsWith('/Podcasts/'));
  }, [podcastEpisodes]);

  const executionMindsetEpisodes = useMemo(() => {
    return podcastEpisodes.filter(ep => ep.audioUrl?.includes('/02. Series 02 - The Execution Mindset/'));
  }, [podcastEpisodes]);

  const calcAvgDuration = (episodes: typeof podcastEpisodes) => {
    if (episodes.length === 0) return 0;
    const total = episodes.reduce((sum, ep) => {
      if (ep.readingTime) {
        const dur = formatDuration(ep.readingTime);
        return sum + (parseInt(dur.replace(' min', '')) || 0);
      }
      return sum;
    }, 0);
    return Math.round(total / episodes.length);
  };

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

    // Duration filter - check if average duration matches
    const durationFilter = filters.readingTime;
    if (durationFilter && durationFilter.length > 0) {
      const avg = calcAvgDuration(podcastEpisodes);
      const matchesDuration = durationFilter.some((filter) => {
        if (filter === '10–20' || filter === '10–20 Min') {
          return avg >= 10 && avg < 20;
        } else if (filter === '20+' || filter === '20+ Min') {
          return avg >= 20;
        }
        return false;
      });
      if (!matchesDuration) return false;
    }

    return true;
  }, [query.filters, podcastEpisodes]);

  if (!shouldShowSeries) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <h3 className="font-medium text-gray-800">Available Items (0)</h3>
                </div>
        <div className="text-center py-12 text-gray-500">No podcast series found matching the selected filters</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items (2)</h3>
            </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 [&>*]:max-w-full">
        <PodcastSeriesCard
          href={`/marketplace/news/action-solver-podcast${location.search}`}
          title="Action-Solver Podcast"
          description="Short conversations that solve real work problems at DQ"
          episodeCount={actionSolverEpisodes.length}
          avgDuration={calcAvgDuration(actionSolverEpisodes)}
        />
        <PodcastSeriesCard
          href={`/marketplace/news/the-execution-mindset${location.search}`}
          title="The Execution Mindset"
          description="Short conversations that solve real work problems at DQ."
          episodeCount={executionMindsetEpisodes.length}
          avgDuration={calcAvgDuration(executionMindsetEpisodes)}
        />
      </div>
    </section>
  );
}

