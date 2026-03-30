import { useState, useRef, useEffect } from 'react';
import type { NewsItem } from '@/data/media/news';
import { incrementListenCount } from '@/services/mediaCenterService';

interface UsePodcastAudioOptions {
  episodes: NewsItem[];
  filteredAndSortedEpisodes: NewsItem[];
  setEpisodes: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  setEpisodeDurations: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  countedEpisodes: Set<string>;
  setCountedEpisodes: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function usePodcastAudio({
  episodes,
  filteredAndSortedEpisodes,
  setEpisodes,
  setEpisodeDurations,
  countedEpisodes,
  setCountedEpisodes,
}: UsePodcastAudioOptions) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handlePlayEpisode = async (episode: NewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!episode.audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (currentlyPlaying === episode.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { try { await audio.play(); setIsPlaying(true); } catch (_) { /* browser blocked play — ignore */ } }
      return;
    }

    try {
      setCurrentTime(0); setDuration(0); setAudioError(null);
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
        try { await audio.play(); setIsPlaying(true); } catch (_) { setIsPlaying(false); }
      }, { once: true });
      if (audio.readyState >= 2) { audio.playbackRate = playbackSpeed; await audio.play(); setIsPlaying(true); }
    } catch (_) { setIsPlaying(false); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        if (currentlyPlaying) {
          setEpisodeDurations(prev => { const m = new Map(prev); m.set(currentlyPlaying, audio.duration); return m; });
        }
      }
    };
    const handleEnded = () => {
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
    const handleAudioError = () => { setAudioError('Audio file could not be loaded.'); setIsPlaying(false); setCurrentlyPlaying(null); };
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('error', handleAudioError);
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
      audio.removeEventListener('error', handleAudioError);
    };
  }, [currentlyPlaying, volume, isMuted, playbackSpeed]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current; if (!audio) return;
    const t = parseFloat(e.target.value);
    if (!isNaN(t) && isFinite(t)) { audio.currentTime = t; setCurrentTime(t); }
  };

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

  return {
    audioRef,
    currentlyPlaying, isPlaying, currentTime, duration, volume, isMuted, playbackSpeed, audioError,
    handlePlayEpisode, handleSeek, handleSeekMouseUp,
    skipBackward, skipForward,
    handleVolumeChange, toggleMute, handlePlaybackSpeedChange,
    handleNextEpisode, handlePreviousEpisode, handleClosePlayer,
  };
}
