import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import type { NewsItem } from '@/data/media/news';
import { HeroSection } from '@/components/media-center/detail/HeroSection';
import { ArticleSummary } from '@/components/media-center/detail/ArticleSummary';
import { SeriesTabContent } from '@/components/podcast/SeriesTabContent';
import { AudioPlayerBar } from '@/components/podcast/AudioPlayerBar';
import { usePodcastEpisodes } from './hooks/usePodcastEpisodes';
import { usePodcastAudio } from './hooks/usePodcastAudio';
import { isTrustedAudioUrl } from './utils/podcastUtils';

export default function PodcastSeriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isExecutionMindsetSeries = location.pathname.includes('the-execution-mindset');
  const seriesTitle = isExecutionMindsetSeries ? 'The Execution Mindset' : 'Action-Solver Podcast';

  const [sortBy] = useState<'latest' | 'most-listened'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'impact' | 'episodes'>('overview');
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const [targetEpisodeId, setTargetEpisodeId] = useState<string | null>(null);

  const urlFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    const searchParams = new URLSearchParams(location.search);
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

  const {
    episodes, setEpisodes,
    loading,
    episodeDurations, setEpisodeDurations,
    savedEpisodes, setSavedEpisodes,
    countedEpisodes, setCountedEpisodes,
    filteredAndSortedEpisodes,
    episodeNumberMap,
    latestEpisode,
  } = usePodcastEpisodes(isExecutionMindsetSeries, urlFilters, sortBy);

  const audio = usePodcastAudio({
    episodes, filteredAndSortedEpisodes,
    setEpisodes, setEpisodeDurations, countedEpisodes, setCountedEpisodes,
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTargetEpisodeId(params.get('episode'));
  }, [location.search]);

  React.useEffect(() => {
    if (!targetEpisodeId || episodes.length === 0) return;
    if (!episodes.some((ep) => ep.id === targetEpisodeId)) return;
    setExpandedEpisode(targetEpisodeId);
    const el = document.getElementById(`episode-${targetEpisodeId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [targetEpisodeId, episodes]);

  const seriesAsArticle: NewsItem = useMemo(() => ({
    id: isExecutionMindsetSeries ? 'the-execution-mindset' : 'action-solver-podcast',
    title: seriesTitle,
    type: 'Thought Leadership',
    format: 'Podcast',
    date: latestEpisode?.date || new Date().toISOString().split('T')[0],
    author: 'DQ Media Team',
    byline: 'DQ Media Team',
    views: episodes.reduce((sum, ep) => sum + (ep.views || 0), 0),
    excerpt: 'Short conversations that solve real work problems at DQ.',
    audioUrl: latestEpisode?.audioUrl,
    tags: ['podcast'],
    readingTime: '<5',
  }), [isExecutionMindsetSeries, seriesTitle, latestEpisode, episodes]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return episodes.filter((ep) => ep.title.toLowerCase().includes(query));
  }, [episodes, searchQuery]);

  const handleShare = async (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/marketplace/news/${episode.id}`;
    const canUseShare = navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl });
    try {
      if (canUseShare) {
        await navigator.share({ title: episode.title, text: episode.excerpt || '', url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareSuccess(episode.id);
      setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      const isAbort = (error as Error).name === 'AbortError';
      if (!isAbort && canUseShare) {
        await navigator.clipboard.writeText(shareUrl).then(() => {
          setShareSuccess(episode.id);
          setTimeout(() => setShareSuccess(null), 2000);
        }).catch(console.error);
      }
    }
  };

  const handleDownload = async (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!episode.audioUrl) { alert('Audio file not available for download'); return; }
    if (!isTrustedAudioUrl(episode.audioUrl)) { alert('Invalid or untrusted audio source.'); return; }
    try {
      const trustedUrl = new URL(episode.audioUrl, window.location.origin).toString();
      const response = await fetch(trustedUrl, { method: 'GET' });
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

  const handleEpisodeCardClick = (episodeId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setExpandedEpisode(expandedEpisode === episodeId ? null : episodeId);
  };

  const handleSelectEpisodeFromSearch = (episodeId: string) => {
    setSearchQuery('');
    const params = new URLSearchParams(location.search);
    params.set('tab', 'podcasts'); params.set('episode', episodeId);
    const basePath = isExecutionMindsetSeries ? '/marketplace/news/the-execution-mindset' : '/marketplace/news/action-solver-podcast';
    navigate(`${basePath}?${params.toString()}`);
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
      <audio ref={audio.audioRef} preload="metadata" />

      <HeroSection article={seriesAsArticle} location={location} isBookmarked={false} onBookmarkToggle={() => {}} />

      <main className="flex-1 px-6 pb-12" style={{ marginTop: '0', position: 'relative', zIndex: 20 }}>
        <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3" style={{ maxWidth: '1336px' }}>

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
                    {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            <SeriesTabContent
              activeTab={activeTab}
              isExecutionMindsetSeries={isExecutionMindsetSeries}
              episodesTabProps={{
                filteredAndSortedEpisodes, episodeNumberMap, sortBy,
                expandedEpisode, hoveredEpisode, savedEpisodes, shareSuccess, episodeDurations,
                searchQuery, searchResults,
                isCurrentlyPlaying: (id) => audio.currentlyPlaying === id,
                isPlaying: audio.isPlaying,
                onSetSearchQuery: setSearchQuery,
                onSelectFromSearch: handleSelectEpisodeFromSearch,
                onPlay: audio.handlePlayEpisode,
                onExpand: handleEpisodeCardClick,
                onShare: handleShare,
                onDownload: handleDownload,
                onSave: handleSave,
                onHover: setHoveredEpisode,
              }}
            />
          </div>

          <aside className="order-first lg:order-last">
            <div className="sticky top-8">
              <ArticleSummary
                article={seriesAsArticle}
                shouldUseNewLayout={true}
                onListenNow={() => {
                  setActiveTab('episodes');
                  const firstEpisode = filteredAndSortedEpisodes[0];
                  if (firstEpisode) audio.handlePlayEpisode(firstEpisode);
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
            <div className="flex flex-col rounded-2xl p-6 bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer" onClick={() => navigate(`/marketplace/news/the-execution-mindset${location.search}`)}>
              <div className="flex flex-col flex-grow space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-muted-foreground border border-border self-start">Podcast</span>
                <h3 className="text-base font-semibold text-foreground leading-snug">The Execution Mindset</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow">Short conversations that solve real work problems at DQ.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors mt-auto">Listen now →</span>
              </div>
            </div>
          )}
          {isExecutionMindsetSeries && (
            <div className="flex flex-col rounded-2xl p-6 bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer" onClick={() => navigate(`/marketplace/news/action-solver-podcast${location.search}`)}>
              <div className="flex flex-col flex-grow space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-muted-foreground border border-border self-start">Podcast</span>
                <h3 className="text-base font-semibold text-foreground leading-snug">Action-Solver Podcast</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow">Short conversations that solve real work problems at DQ.</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors mt-auto">Listen now →</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {audio.audioError && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-50 border-t border-red-200 px-6 py-3 text-sm text-red-700 text-center">
          {audio.audioError} Please ensure the audio file has been uploaded to the server.
        </div>
      )}

      {audio.currentlyPlaying && !audio.audioError && (
        <AudioPlayerBar
          currentlyPlaying={audio.currentlyPlaying}
          isPlaying={audio.isPlaying}
          currentTime={audio.currentTime}
          duration={audio.duration}
          volume={audio.volume}
          isMuted={audio.isMuted}
          playbackSpeed={audio.playbackSpeed}
          episodes={episodes}
          filteredAndSortedEpisodes={filteredAndSortedEpisodes}
          seriesLabel={isExecutionMindsetSeries ? 'Execution Mindset Series' : 'Action-Solver Series'}
          onPlay={audio.handlePlayEpisode}
          onSeek={audio.handleSeek}
          onSeekMouseUp={audio.handleSeekMouseUp}
          onSkipBackward={audio.skipBackward}
          onSkipForward={audio.skipForward}
          onVolumeChange={audio.handleVolumeChange}
          onToggleMute={audio.toggleMute}
          onPlaybackSpeedChange={audio.handlePlaybackSpeedChange}
          onPrevious={audio.handlePreviousEpisode}
          onNext={audio.handleNextEpisode}
          onClose={audio.handleClosePlayer}
        />
      )}

      {(audio.currentlyPlaying || audio.audioError) && <div className="h-20" />}
      <Footer />
    </div>
  );
}
