import { useState, useEffect, useMemo } from 'react';
import type { NewsItem } from '@/data/media/news';
import { ACTION_SOLVER_EPISODE_ORDER, loadEpisodesData, filterEpisodes, sortEpisodes } from '../utils/podcastUtils';

export function usePodcastEpisodes(
  isExecutionMindsetSeries: boolean,
  urlFilters: Record<string, string[]>,
  sortBy: 'latest' | 'most-listened'
) {
  const [episodes, setEpisodes] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodeDurations, setEpisodeDurations] = useState<Map<string, number>>(new Map());
  const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
  const [countedEpisodes, setCountedEpisodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('podcast-saved-episodes');
    if (saved) { try { setSavedEpisodes(new Set(JSON.parse(saved))); } catch (_) { /* invalid localStorage data — ignore */ } }
  }, []);

  useEffect(() => {
    const counted = localStorage.getItem('podcast-counted-episodes');
    if (counted) { try { setCountedEpisodes(new Set(JSON.parse(counted))); } catch (_) { /* invalid localStorage data — ignore */ } }
  }, []);

  useEffect(() => {
    if (savedEpisodes.size > 0) {
      localStorage.setItem('podcast-saved-episodes', JSON.stringify(Array.from(savedEpisodes)));
    } else {
      localStorage.removeItem('podcast-saved-episodes');
    }
  }, [savedEpisodes]);

  useEffect(() => {
    if (countedEpisodes.size > 0) {
      localStorage.setItem('podcast-counted-episodes', JSON.stringify(Array.from(countedEpisodes)));
    } else {
      localStorage.removeItem('podcast-counted-episodes');
    }
  }, [countedEpisodes]);

  useEffect(() => {
    const load = async () => {
      try {
        const { episodes: loaded, durations } = await loadEpisodesData(isExecutionMindsetSeries);
        setEpisodes(loaded);
        setEpisodeDurations(durations);
      } catch (_) { /* episode load failed — loading will still be cleared */ }
      finally { setLoading(false); }
    };
    load();
  }, [isExecutionMindsetSeries]);

  const filteredAndSortedEpisodes = useMemo(() => {
    const filtered = filterEpisodes([...episodes], urlFilters, episodeDurations);
    return sortEpisodes(filtered, sortBy);
  }, [episodes, sortBy, urlFilters, episodeDurations]);

  const episodeNumberMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!isExecutionMindsetSeries) {
      ACTION_SOLVER_EPISODE_ORDER.forEach((id, index) => {
        if (episodes.some((ep) => ep.id === id)) map.set(id, index + 1);
      });
      let nextNumber = ACTION_SOLVER_EPISODE_ORDER.length + 1;
      episodes.forEach((ep) => { if (!map.has(ep.id)) map.set(ep.id, nextNumber++); });
    } else {
      const sortedByDateAsc = [...episodes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      sortedByDateAsc.forEach((ep, index) => map.set(ep.id, index + 1));
    }
    return map;
  }, [episodes, isExecutionMindsetSeries]);

  const latestEpisode = episodes.length > 0
    ? [...episodes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return {
    episodes, setEpisodes,
    loading,
    episodeDurations, setEpisodeDurations,
    savedEpisodes, setSavedEpisodes,
    countedEpisodes, setCountedEpisodes,
    filteredAndSortedEpisodes,
    episodeNumberMap,
    latestEpisode,
  };
}
