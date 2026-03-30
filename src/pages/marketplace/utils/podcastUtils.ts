import { fetchAllNews } from '@/services/mediaCenterService';
import { formatDuration } from '@/utils/newsUtils';
import type { NewsItem } from '@/data/media/news';

export const ACTION_SOLVER_EPISODE_ORDER: string[] = [
  'why-execution-beats-intelligence',
  'why-we-misdiagnose-problems',
  'turning-conversations-into-action',
  'why-tasks-dont-close-at-dq',
  'happy-talkers-why-talking-feels-productive',
  'execution-styles-why-teams-work-differently',
  'agile-the-dq-way-tasks-core-work-system',
  'leaders-as-multipliers-accelerate-execution',
  'energy-management-for-high-action-days',
  'execution-metrics-that-drive-movement',
];

export function filterSeriesEpisodes(allNews: NewsItem[], isExecutionMindsetSeries: boolean): NewsItem[] {
  const SUPABASE_STORAGE_BASE = 'https://jmhtrffmxjxhoxpesubv.supabase.co/storage/v1/object/public/podcasts/';
  const allPodcastEpisodes = allNews.filter(
    (item) => item.format === 'Podcast' || item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
  );
  return allPodcastEpisodes.filter((item) => {
    if (!item.audioUrl) return false;
    if (isExecutionMindsetSeries) {
      return (
        item.audioUrl.includes('/02. Series 02 - The Execution Mindset/') ||
        item.tags?.some((tag) => tag.toLowerCase().includes('series-2'))
      );
    }
    // Action-Solver: Supabase storage URLs or local /Podcasts/ paths, excluding Series 02
    return (
      item.audioUrl.startsWith(SUPABASE_STORAGE_BASE) ||
      (item.audioUrl.startsWith('/Podcasts/') &&
        !item.audioUrl.includes('/02. Series 02 - The Execution Mindset/') &&
        !item.tags?.some((tag) => tag.toLowerCase().includes('series-2')))
    );
  });
}

export async function loadEpisodeDurations(episodes: NewsItem[]): Promise<Map<string, number>> {
  const durations = new Map<string, number>();
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  const loadPromises = episodes.map((episode) => {
    if (!episode.audioUrl) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const isAbsolute = episode.audioUrl!.startsWith('http');
      const src = isAbsolute ? episode.audioUrl! : encodeURI(base + episode.audioUrl!);
      const audio = new Audio(src);
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && isFinite(audio.duration) && !isNaN(audio.duration)) {
          durations.set(episode.id, audio.duration);
        }
        resolve();
      }, { once: true });
      audio.addEventListener('error', () => resolve(), { once: true });
      audio.load();
    });
  });
  await Promise.all(loadPromises);
  return durations;
}

export async function loadEpisodesData(isExecutionMindsetSeries: boolean): Promise<{ episodes: NewsItem[]; durations: Map<string, number> }> {
  const allNews = await fetchAllNews();
  const episodes = filterSeriesEpisodes(allNews, isExecutionMindsetSeries);
  const durations = await loadEpisodeDurations(episodes);
  return { episodes, durations };
}

export function getEpisodeDurationMinutes(episode: NewsItem, episodeDurations: Map<string, number>): number {
  const episodeDurationSeconds = episodeDurations.get(episode.id);
  if (episodeDurationSeconds && episodeDurationSeconds > 0) {
    return Math.round(episodeDurationSeconds / 60);
  } else if (episode.readingTime) {
    const dur = formatDuration(episode.readingTime);
    return parseInt(dur.replace(' min', '')) || 0;
  }
  return 0;
}

export function matchesDurationFilter(durationMinutes: number, durationFilter: string[]): boolean {
  return durationFilter.some((filter) => {
    if (filter === '10–20') return durationMinutes >= 10 && durationMinutes < 20;
    if (filter === '20+') return durationMinutes >= 20;
    return false;
  });
}

export function filterEpisodes(episodes: NewsItem[], urlFilters: Record<string, string[]>, episodeDurations: Map<string, number>): NewsItem[] {
  return episodes.filter((episode) => {
    const domainFilter = urlFilters.domain;
    const durationFilter = urlFilters.readingTime;
    if (domainFilter && domainFilter.length > 0) {
      if (!episode.domain || !domainFilter.includes(episode.domain)) return false;
    }
    if (durationFilter && durationFilter.length > 0) {
      const durationMinutes = getEpisodeDurationMinutes(episode, episodeDurations);
      if (!matchesDurationFilter(durationMinutes, durationFilter)) return false;
    }
    return true;
  });
}

export function sortEpisodes(episodes: NewsItem[], sortBy: 'latest' | 'most-listened'): NewsItem[] {
  if (sortBy === 'latest') {
    const orderMap = new Map<string, number>(ACTION_SOLVER_EPISODE_ORDER.map((id, index) => [id, index + 1]));
    return episodes.sort((a, b) => {
      const numA = orderMap.get(a.id) ?? 0;
      const numB = orderMap.get(b.id) ?? 0;
      if (numA !== numB) return numA - numB;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }
  if (sortBy === 'most-listened') {
    return episodes.sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  return episodes;
}

export function isTrustedAudioUrl(audioUrl: string): boolean {
  // Allow Supabase Storage public URLs
  if (audioUrl.startsWith('https://jmhtrffmxjxhoxpesubv.supabase.co/storage/v1/object/public/podcasts/')) {
    return true;
  }
  try {
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    const parsed = new URL(encodeURI(base + audioUrl), window.location.origin);
    if (parsed.origin !== window.location.origin) return false;
    const allowedPrefixes = [
      '/Podcasts/',
      '/public/Podcasts/',
      '/02. Series 02 - The Execution Mindset/',
    ];
    return allowedPrefixes.some((prefix) =>
      parsed.pathname.startsWith(encodeURI(base + prefix)) ||
      parsed.pathname.startsWith(encodeURI(prefix))
    );
  } catch {
    return false;
  }
}
