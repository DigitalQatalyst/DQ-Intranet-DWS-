import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Radio, Play, Pause, Share2, Download, Bookmark, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { fetchAllNews, incrementListenCount } from '@/services/mediaCenterService';
import { formatDateVeryShort, formatDuration, formatTime } from '@/utils/newsUtils';
import { parseBold } from '@/utils/contentParsing';
import { HeroSection } from '@/components/media-center/detail/HeroSection';
import { ArticleSummary } from '@/components/media-center/detail/ArticleSummary';

const ACTION_SOLVER_EPISODE_ORDER: string[] = [
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

export default function PodcastSeriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isExecutionMindsetSeries = location.pathname.includes('the-execution-mindset');
  const seriesTitle = isExecutionMindsetSeries ? 'The Execution Mindset' : 'Action-Solver Podcast';


  const [episodes, setEpisodes] = useState<NewsItem[]>([]);

  const seriesHeroExcerpt = isExecutionMindsetSeries ? 'Short conversations that solve real work problems at DQ.' : 'Short conversations that solve real work problems at DQ.';
  const [loading, setLoading] = useState(true);
  const [sortBy] = useState<'latest' | 'most-listened'>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const [episodeDurations, setEpisodeDurations] = useState<Map<string, number>>(new Map());
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'impact' | 'episodes'>('overview');
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [targetEpisodeId, setTargetEpisodeId] = useState<string | null>(null);
  const [countedEpisodes, setCountedEpisodes] = useState<Set<string>>(new Set());

  const searchParams = new URLSearchParams(location.search);

  const urlFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('filters.')) {
        const filterKey = key.replace('filters.', '');
        if (!filters[filterKey]) filters[filterKey] = [];
        if (value && !filters[filterKey].includes(value)) filters[filterKey].push(value);
      } else if (key.startsWith('filters[') && key.endsWith(']')) {
        const filterKey = key.slice(7, -1);
        if (!filters[filterKey]) filters[filterKey] = [];
        if (value && !filters[filterKey].includes(value)) filters[filterKey].push(value);
      }
    });
    return filters;
  }, [location.search]);

  useEffect(() => {
    const saved = localStorage.getItem('podcast-saved-episodes');
    if (saved) { try { setSavedEpisodes(new Set(JSON.parse(saved))); } catch {} }
  }, []);

  useEffect(() => {
    const counted = localStorage.getItem('podcast-counted-episodes');
    if (counted) { try { setCountedEpisodes(new Set(JSON.parse(counted))); } catch {} }
  }, []);

  useEffect(() => {
    if (countedEpisodes.size > 0) {
      localStorage.setItem('podcast-counted-episodes', JSON.stringify(Array.from(countedEpisodes)));
    } else { localStorage.removeItem('podcast-counted-episodes'); }
  }, [countedEpisodes]);

  useEffect(() => {
    if (!targetEpisodeId || episodes.length === 0) return;
    if (!episodes.some((ep) => ep.id === targetEpisodeId)) return;
    setExpandedEpisode(targetEpisodeId);
    const el = document.getElementById(`episode-${targetEpisodeId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [targetEpisodeId, episodes]);

  useEffect(() => {
    if (savedEpisodes.size > 0) {
      localStorage.setItem('podcast-saved-episodes', JSON.stringify(Array.from(savedEpisodes)));
    } else { localStorage.removeItem('podcast-saved-episodes'); }
  }, [savedEpisodes]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTargetEpisodeId(params.get('episode'));
  }, [location.search]);

  React.useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const allNews = await fetchAllNews();
        const allPodcastEpisodes = allNews.filter(
          (item) => item.format === 'Podcast' || item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
        );
        const seriesEpisodes = allPodcastEpisodes.filter((item) => {
          if (!item.audioUrl) return false;
          if (isExecutionMindsetSeries) return item.audioUrl.includes('/02. Series 02 - The Execution Mindset/');
          return item.audioUrl.startsWith('/Podcasts/');
        });
        setEpisodes(seriesEpisodes);

        const durations = new Map<string, number>();
        const loadPromises = seriesEpisodes.map((episode) => {
          if (!episode.audioUrl) return Promise.resolve();
          return new Promise<void>((resolve) => {
            const audio = new Audio(episode.audioUrl);
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
        setEpisodeDurations(durations);
      } catch {}
      finally { setLoading(false); }
    };
    loadEpisodes();
  }, [isExecutionMindsetSeries]);

  const filteredAndSortedEpisodes = useMemo(() => {
    let filtered = [...episodes];
    const domainFilter = urlFilters.domain;
    const durationFilter = urlFilters.readingTime;

    filtered = filtered.filter((episode) => {
      if (domainFilter && domainFilter.length > 0) {
        if (!episode.domain || !domainFilter.includes(episode.domain)) return false;
      }
      if (durationFilter && durationFilter.length > 0) {
        const episodeDurationSeconds = episodeDurations.get(episode.id);
        let durationMinutes = 0;
        if (episodeDurationSeconds && episodeDurationSeconds > 0) {
          durationMinutes = Math.round(episodeDurationSeconds / 60);
        } else if (episode.readingTime) {
          const dur = formatDuration(episode.readingTime);
          durationMinutes = parseInt(dur.replace(' min', '')) || 0;
        }
        const matchesDuration = durationFilter.some((filter) => {
          if (filter === '10–20') return durationMinutes >= 10 && durationMinutes < 20;
          if (filter === '20+') return durationMinutes >= 20;
          return false;
        });
        if (!matchesDuration) return false;
      }
      return true;
    });

    if (sortBy === 'latest') {
      const orderMap = new Map<string, number>(ACTION_SOLVER_EPISODE_ORDER.map((id, index) => [id, index + 1]));
      filtered.sort((a, b) => {
        const numA = orderMap.get(a.id) ?? 0;
        const numB = orderMap.get(b.id) ?? 0;
        if (numA !== numB) return numA - numB; // EP1 first, EP10 last
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    } else if (sortBy === 'most-listened') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return filtered;
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

  // Fake NewsItem for HeroSection / ArticleSummary
  const seriesAsArticle: NewsItem = {
    id: isExecutionMindsetSeries ? 'the-execution-mindset' : 'action-solver-podcast',
    title: seriesTitle,
    type: 'Thought Leadership',
    format: 'Podcast',
    date: latestEpisode?.date || new Date().toISOString().split('T')[0],
    author: 'DQ Media Team',
    byline: 'DQ Media Team',
    views: episodes.reduce((sum, ep) => sum + (ep.views || 0), 0),
    excerpt: seriesHeroExcerpt,
    audioUrl: latestEpisode?.audioUrl,
    tags: ['podcast'],
    readingTime: '<5',
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => { if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) setCurrentTime(audio.currentTime); };
    const updateDuration = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        if (currentlyPlaying) {
          setEpisodeDurations(prev => { const m = new Map(prev); m.set(currentlyPlaying, audio.duration); return m; });
        }
      }
    };
    const handleEnded = () => {
      // Auto-play next episode
      const currentIdx = filteredAndSortedEpisodes.findIndex(ep => ep.id === currentlyPlaying);
      if (currentIdx !== -1 && currentIdx < filteredAndSortedEpisodes.length - 1) {
        handlePlayEpisode(filteredAndSortedEpisodes[currentIdx + 1]);
      } else {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
        setCurrentTime(0);
      }
    };
    const timeInterval = setInterval(() => { if (audio && !audio.paused && !audio.ended) updateTime(); }, 100);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', updateDuration);
    audio.addEventListener('canplay', updateDuration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackSpeed;
    if (audio.readyState >= 1) updateDuration();
    return () => {
      clearInterval(timeInterval);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentlyPlaying, volume, isMuted, playbackSpeed]);

  const handlePlayEpisode = async (episode: NewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!episode.audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (currentlyPlaying === episode.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { try { await audio.play(); setIsPlaying(true); } catch {} }
      return;
    }
    try {
      setCurrentTime(0); setDuration(0);
      audio.src = episode.audioUrl;
      audio.playbackRate = playbackSpeed;
      audio.load();
      setCurrentlyPlaying(episode.id);
      if (!countedEpisodes.has(episode.id)) {
        incrementListenCount(episode.id).catch(console.error);
        setCountedEpisodes(prev => new Set(prev).add(episode.id));
        setEpisodes(prev => prev.map(ep => ep.id === episode.id ? { ...ep, views: (ep.views || 0) + 1 } : ep));
      }
      audio.addEventListener('loadedmetadata', async () => {
        if (audio.duration) {
          setDuration(audio.duration);
          setEpisodeDurations(prev => { const m = new Map(prev); m.set(episode.id, audio.duration); return m; });
        }
        audio.playbackRate = playbackSpeed;
        try { await audio.play(); setIsPlaying(true); } catch { setIsPlaying(false); }
      }, { once: true });
      if (audio.readyState >= 2) { audio.playbackRate = playbackSpeed; await audio.play(); setIsPlaying(true); }
    } catch { setIsPlaying(false); }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current; if (!audio) return;
    const t = parseFloat(e.target.value);
    if (!isNaN(t) && isFinite(t)) { audio.currentTime = t; setCurrentTime(t); }
  };
  const handleSeekMouseDown = () => {};
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const audio = audioRef.current; if (!audio) return;
    const t = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(t) && isFinite(t)) { audio.currentTime = t; setCurrentTime(t); if (isPlaying) audio.play().catch(console.error); }
  };
  const skipBackward = (s = 10) => { const a = audioRef.current; if (a) a.currentTime = Math.max(0, a.currentTime - s); };
  const skipForward = (s = 10) => { const a = audioRef.current; if (a) a.currentTime = Math.min(a.duration, a.currentTime + s); };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current; if (!audio) return;
    const v = parseFloat(e.target.value); audio.volume = v; setVolume(v); setIsMuted(v === 0);
  };
  const toggleMute = () => {
    const audio = audioRef.current; if (!audio) return;
    if (isMuted) { audio.volume = volume > 0 ? volume : 0.5; setIsMuted(false); }
    else { audio.volume = 0; setIsMuted(true); }
  };
  const handlePlaybackSpeedChange = (speed: number) => {
    const audio = audioRef.current; if (!audio) return;
    audio.playbackRate = speed; setPlaybackSpeed(speed);
  };
  const handleNextEpisode = () => {
    if (!currentlyPlaying) return;
    const idx = filteredAndSortedEpisodes.findIndex(ep => ep.id === currentlyPlaying);
    if (idx < filteredAndSortedEpisodes.length - 1) handlePlayEpisode(filteredAndSortedEpisodes[idx + 1]);
  };
  const handlePreviousEpisode = () => {
    if (!currentlyPlaying) return;
    const idx = filteredAndSortedEpisodes.findIndex(ep => ep.id === currentlyPlaying);
    if (idx > 0) handlePlayEpisode(filteredAndSortedEpisodes[idx - 1]);
  };
  const handleClosePlayer = () => {
    const audio = audioRef.current; if (audio) audio.pause();
    setCurrentlyPlaying(null); setIsPlaying(false); setCurrentTime(0);
  };
  const handleEpisodeCardClick = (episodeId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setExpandedEpisode(expandedEpisode === episodeId ? null : episodeId);
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return episodes.filter((ep) => ep.title.toLowerCase().includes(query));
  }, [episodes, searchQuery]);

  const handleSelectEpisodeFromSearch = (episodeId: string) => {
    setSearchQuery('');
    const params = new URLSearchParams(location.search);
    params.set('tab', 'podcasts'); params.set('episode', episodeId);
    const basePath = isExecutionMindsetSeries ? '/marketplace/news/the-execution-mindset' : '/marketplace/news/action-solver-podcast';
    navigate(`${basePath}?${params.toString()}`);
  };

  const handleShare = async (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/marketplace/news/${episode.id}`;
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl })) {
        await navigator.share({ title: episode.title, text: episode.excerpt || '', url: shareUrl });
      } else { await navigator.clipboard.writeText(shareUrl); }
      setShareSuccess(episode.id); setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try { await navigator.clipboard.writeText(shareUrl); setShareSuccess(episode.id); setTimeout(() => setShareSuccess(null), 2000); } catch {}
      }
    }
  };

  const handleDownload = async (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!episode.audioUrl) { alert('Audio file not available for download'); return; }
    try {
      const response = await fetch(episode.audioUrl);
      if (!response.ok) throw new Error('Failed to fetch');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch { alert('Failed to download audio file. Please try again.'); }
  };

  const handleSave = (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedEpisodes(prev => {
      const s = new Set(prev);
      if (s.has(episode.id)) s.delete(episode.id); else s.add(episode.id);
      return s;
    });
  };

  const renderEpisodeContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let keyCounter = 0;
    let firstHeadingSkipped = false;
    let inFocusSection = false;
    let shouldStop = false;
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paraText = currentParagraph.join(' ').trim();
        if (paraText) elements.push(<p key={keyCounter++} className="text-gray-700 text-sm leading-normal mb-2">{parseBold(paraText)}</p>);
        currentParagraph = [];
      }
    };
    for (const line of lines) {
      if (shouldStop) break;
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (!firstHeadingSkipped && trimmed.match(/^#+\s+/)) { firstHeadingSkipped = true; continue; }
      const headingMatch = trimmed.match(/^(##+)\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const headingText = headingMatch[2].trim();
        const normalizedHeading = headingText.toLowerCase();
        const isFocusOfEpisode = normalizedHeading.includes('focus of the episode') || normalizedHeading.includes('focus of episode') || normalizedHeading.includes('goal of this episode') || normalizedHeading.includes('goal of episode');
        if (inFocusSection && !isFocusOfEpisode) { flushParagraph(); shouldStop = true; break; }
        if (isFocusOfEpisode) {
          flushParagraph(); inFocusSection = true;
          const titleCaseHeading = headingText.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          if (level === 2) {
            elements.push(<h3 key={keyCounter++} className="text-lg font-bold text-gray-900 mt-6 mb-4 pl-4 relative"><span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent" />{titleCaseHeading}</h3>);
          } else {
            elements.push(<h4 key={keyCounter++} className="text-base font-bold text-gray-900 mt-4 mb-3">{titleCaseHeading}</h4>);
          }
          continue;
        }
        if (!inFocusSection) continue;
      }
      if (inFocusSection) currentParagraph.push(trimmed);
    }
    if (inFocusSection) flushParagraph();
    return elements;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 p-8"><div className="mx-auto max-w-7xl text-center text-gray-600">Loading...</div></main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <audio ref={audioRef} preload="metadata" />

      {/* Hero banner */}
      <HeroSection
        article={seriesAsArticle}
        location={location}
        isBookmarked={false}
        onBookmarkToggle={() => {}}
      />

      {/* Main content — pulled up to overlap hero fade */}
      <main className="flex-1 px-6 pb-12" style={{ marginTop: '0', position: 'relative', zIndex: 20 }}>
        <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3" style={{ maxWidth: '1336px' }}>

          {/* Left: Episode List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab bar */}
            <div className="border-b border-border">
              <div className="flex gap-0">
                {(['overview', 'highlights', 'impact', 'episodes'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors capitalize ${
                      activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="py-2 max-w-[760px] space-y-6">
                    {isExecutionMindsetSeries ? (
                      <>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">The Execution Mindset Series is designed to build the mindset required to consistently move from intention to execution. It focuses on how work gets done — shifting from discussion, delay, and inconsistency to clarity, ownership, and follow-through.</p>
                        <div className="space-y-3">
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
                            What You'll Gain
                          </h2>
                          <ul className="space-y-[11px] pt-1">
                            {[
                              'Develop a mindset of execution over discussion',
                              'Strengthen ownership from task initiation to closure',
                              'Improve consistency in delivering results',
                              'Build discipline in defining and completing actions',
                              'Reduce delays caused by overthinking or lack of clarity',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">The Action Solver Podcast is designed to shift how we respond to problems at work — from discussion and observation to structured action and execution.</p>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">Each episode tackles real scenarios at DQ, helping you move from passive behaviors to becoming a Practical Solver — someone who thinks clearly, acts early, and follows through.</p>
                        <div className="space-y-3">
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
                            What You'll Gain
                          </h2>
                          <ul className="space-y-[11px] pt-1">
                            {[
                              'Move from talking about problems → solving them',
                              'Take action earlier instead of reacting late',
                              'Improve decision-making with clarity and intent',
                              'Strengthen ownership and follow-through',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Highlights Tab */}
                {activeTab === 'highlights' && (
                  <div className="py-2 max-w-[760px] space-y-6">
                    {isExecutionMindsetSeries ? (
                      <>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">This episode is designed for associates looking to strengthen their execution and follow-through, especially those who start tasks but struggle to close them. It is also valuable for teams aiming to improve accountability and delivery, as well as anyone looking to build a more consistent execution mindset.</p>
                        <div className="space-y-3">
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
                            Approach
                          </h2>
                          <ul className="space-y-[11px] pt-1">
                            {[
                              'Listen Actively',
                              'Spot the pattern',
                              'Use the insights on a current task or decision',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">This episode is ideal for associates looking to improve how they approach challenges, especially those who find themselves stuck in discussions without action, waiting for direction, or taking unstructured actions.</p>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">It is designed for anyone ready to become a more practical and effective problem solver.</p>
                        <div className="space-y-3">
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
                            Approach
                          </h2>
                          <ul className="space-y-[11px] pt-1">
                            {[
                              'Listen actively',
                              'Spot the pattern',
                              'Use the insight on a current task or decision',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Impact Tab */}
                {activeTab === 'impact' && (
                  <div className="py-2 max-w-[760px] space-y-6">
                    {isExecutionMindsetSeries ? (
                      <>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">Listen to this series when tasks are started but never completed, work slows down due to unclear ownership, or when discussions keep happening but action doesn't follow. It's designed to help you cut through the noise, take control, and build consistency in how you deliver results.</p>
                        <div className="space-y-3">
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
                            When to Listen
                          </h2>
                          <ul className="space-y-[11px] pt-1">
                            {[
                              'At the start of your day',
                              'Before planning your work',
                              'When reviewing tasks or progress',
                              'When work feels stuck or delayed',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">Listen to this series when tasks are started but never completed, work slows down due to unclear ownership, or when discussions keep happening but action doesn't follow.</p>
                        <p className="text-base font-normal leading-[1.75] text-[#475467]">It's designed to help you cut through the noise, take control, and build consistency in how you deliver results.</p>
                        <div className="space-y-3">
                          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
                            When to Listen
                          </h2>
                          <ul className="space-y-[11px] pt-1">
                            {[
                              'At the start of your day',
                              'Before planning your work',
                              'When reviewing tasks or progress',
                              'When work feels stuck or delayed',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Episodes Tab */}
                {activeTab === 'episodes' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold text-gray-900">All Episodes</h2>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search episodes"
                            className="w-48 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f2055]"
                          />
                          {searchQuery && searchResults.length > 0 && (
                            <div className="absolute z-20 mt-1 w-48 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                              {searchResults.map((result) => (
                                <button key={result.id} type="button" onClick={() => handleSelectEpisodeFromSearch(result.id)} className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-gray-50">
                                  <span className="font-medium text-gray-900 line-clamp-1">{result.title}</span>
                                  <span className="text-xs text-gray-500">EP {episodeNumberMap.get(result.id)}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
  
                      </div>
                    </div>

                {/* Episodes List */}
                <div className="space-y-0 relative">
                  {filteredAndSortedEpisodes.map((episode, index) => {
                    const isNew = false;
                    const episodeNumber = episodeNumberMap.get(episode.id) ?? (sortBy === 'latest' ? filteredAndSortedEpisodes.length - index : index + 1);
                    const isCurrentlyPlaying = currentlyPlaying === episode.id;
                    const isExpanded = expandedEpisode === episode.id;
                    const isHovered = hoveredEpisode === episode.id;
                    return (
                      <div
                        key={episode.id}
                        id={`episode-${episode.id}`}
                        onMouseEnter={() => setHoveredEpisode(episode.id)}
                        onMouseLeave={() => setHoveredEpisode(null)}
                        style={{ zIndex: isHovered ? 50 : 1 }}
                        className={`group flex items-center gap-4 border-b border-gray-100 py-3 px-2 transition-all duration-300 ${isCurrentlyPlaying ? 'bg-[#0f2055]/5' : ''} ${isHovered ? 'scale-[1.02] bg-white shadow-lg border-gray-200 rounded-lg relative' : hoveredEpisode && hoveredEpisode !== episode.id ? 'opacity-50' : ''}`}
                      >
                        <button onClick={(e) => handlePlayEpisode(episode, e)} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition hover:scale-110">
                          {isCurrentlyPlaying && isPlaying
                            ? <Pause size={20} className="text-[#0f2055]" />
                            : <Play size={20} className="text-gray-400 group-hover:text-[#0f2055]" fill="currentColor" />}
                        </button>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={(e) => handleEpisodeCardClick(episode.id, e)}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 font-medium">EP {episodeNumber}</span>
                            {isNew && <span className="text-xs font-semibold text-[#0f2055]">NEW</span>}
                          </div>
                          <h3 className={`text-sm font-semibold mb-1 truncate ${isCurrentlyPlaying ? 'text-[#0f2055]' : 'text-gray-900'}`}>{episode.title}</h3>
                          {!isExpanded && <p className="text-xs text-gray-600 line-clamp-1 mb-1">{episode.excerpt}</p>}
                          {isExpanded && episode.content && (
                            <div className="mt-2 mb-3">
                              <div className="text-xs text-gray-600 mb-3">{renderEpisodeContent(episode.content)}</div>
                              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                                <button onClick={(e) => handleShare(episode, e)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${shareSuccess === episode.id ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                  <Share2 size={14} /><span>{shareSuccess === episode.id ? 'Copied!' : 'Share'}</span>
                                </button>
                                <button onClick={(e) => handleDownload(episode, e)} disabled={!episode.audioUrl} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${!episode.audioUrl ? 'opacity-50 cursor-not-allowed border-gray-300 bg-white text-gray-400' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                  <Download size={14} /><span>Download</span>
                                </button>
                                <button onClick={(e) => handleSave(episode, e)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${savedEpisodes.has(episode.id) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                  <Bookmark size={14} fill={savedEpisodes.has(episode.id) ? 'currentColor' : 'none'} /><span>{savedEpisodes.has(episode.id) ? 'Saved' : 'Save'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xs text-gray-500 mb-1">{episodeDurations.has(episode.id) ? formatTime(episodeDurations.get(episode.id)!) : formatDuration(episode.readingTime)}</div>
                          <div className="text-xs text-gray-400">{formatDateVeryShort(episode.date)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                  </>
                )}
          </div>

          {/* Right Sidebar */}
          <aside className="order-first lg:order-last">
            <div className="sticky top-8">
              <ArticleSummary
                article={seriesAsArticle}
                shouldUseNewLayout={true}
                onListenNow={() => {
                  setActiveTab('episodes');
                  const firstEpisode = filteredAndSortedEpisodes[0];
                  if (firstEpisode) handlePlayEpisode(firstEpisode);
                }}
              />
            </div>
          </aside>

        </div>
      </main>

        {/* Related Podcasts */}
        <section className="mx-auto px-6 py-10 border-t border-border" style={{ maxWidth: '1336px' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Related Podcasts</h2>
            <a href={`/marketplace/media-center?tab=podcasts${location.search ? '&' + location.search.slice(1) : ''}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Browse all podcasts <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!isExecutionMindsetSeries && (
              <div
                className="flex flex-col rounded-2xl p-6 bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => navigate(`/marketplace/news/the-execution-mindset${location.search}`)}
              >
                <div className="flex flex-col flex-grow space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-muted-foreground border border-border self-start">Podcast</span>
                  <h3 className="text-base font-semibold text-foreground leading-snug">The Execution Mindset</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow">Short conversations that solve real work problems at DQ.</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors mt-auto">
                    Listen now →
                  </span>
                </div>
              </div>
            )}
            {isExecutionMindsetSeries && (
              <div
                className="flex flex-col rounded-2xl p-6 bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => navigate(`/marketplace/news/action-solver-podcast${location.search}`)}
              >
                <div className="flex flex-col flex-grow space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-muted-foreground border border-border self-start">Podcast</span>
                  <h3 className="text-base font-semibold text-foreground leading-snug">Action-Solver Podcast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow">Short conversations that solve real work problems at DQ.</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors mt-auto">
                    Listen now →
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

      {/* Persistent Bottom Audio Player */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-[300] bg-gray-100 border-t-2 border-[#0f2055]">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center gap-6">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                  {isPlaying
                    ? <svg className="w-6 h-6 text-[#0f2055]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                    : <Radio size={20} className="text-gray-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#0f2055]">{episodes.find(e => e.id === currentlyPlaying)?.title || 'Unknown Episode'}</p>
                  <p className="truncate text-xs text-gray-600">{isExecutionMindsetSeries ? 'Execution Mindset Series' : 'Action-Solver Series'}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                <div className="flex items-center gap-4">
                  <button onClick={handlePreviousEpisode} disabled={filteredAndSortedEpisodes.findIndex(e => e.id === currentlyPlaying) === 0} className={`p-1.5 transition-colors ${filteredAndSortedEpisodes.findIndex(e => e.id === currentlyPlaying) === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-[#0f2055]'}`} aria-label="Previous episode">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  </button>
                  <button onClick={() => skipBackward(10)} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label="Skip backward 10 seconds"><RotateCcw size={18} /></button>
                  <button onClick={() => { const ep = episodes.find(e => e.id === currentlyPlaying); if (ep) handlePlayEpisode(ep); }} className="p-2 rounded-full bg-[#0f2055] text-white hover:scale-105 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>
                  <button onClick={() => skipForward(10)} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label="Skip forward 10 seconds"><RotateCw size={18} /></button>
                  <button onClick={handleNextEpisode} disabled={filteredAndSortedEpisodes.findIndex(e => e.id === currentlyPlaying) === filteredAndSortedEpisodes.length - 1} className={`p-1.5 transition-colors ${filteredAndSortedEpisodes.findIndex(e => e.id === currentlyPlaying) === filteredAndSortedEpisodes.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-[#0f2055]'}`} aria-label="Next episode">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-gray-600 whitespace-nowrap">{formatTime(currentTime || 0)}</span>
                  <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime || 0} onChange={handleSeek} onMouseDown={handleSeekMouseDown} onMouseUp={handleSeekMouseUp} className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-300"
                    style={{ background: `linear-gradient(to right, #0f2055 0%, #0f2055 ${((currentTime || 0) / (duration || 1)) * 100}%, #d1d5db ${((currentTime || 0) / (duration || 1)) * 100}%, #d1d5db 100%)` }} />
                  <span className="text-xs text-gray-600 whitespace-nowrap">{formatTime(duration || 0)}</span>
                  <button onClick={() => { const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]; const i = speeds.indexOf(playbackSpeed); handlePlaybackSpeedChange(speeds[(i + 1) % speeds.length]); }} className="px-2 py-0.5 text-xs text-gray-600 hover:text-[#0f2055] transition-colors border border-[#0f2055] rounded" aria-label="Playback speed">{playbackSpeed}x</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-300"
                  style={{ background: `linear-gradient(to right, #0f2055 0%, #0f2055 ${(isMuted ? 0 : volume) * 100}%, #d1d5db ${(isMuted ? 0 : volume) * 100}%, #d1d5db 100%)` }} />
                <button onClick={handleClosePlayer} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label="Close player">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentlyPlaying && <div className="h-20" />}
      <Footer />
    </div>
  );
}
