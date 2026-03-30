import React from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Radio } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { formatTime } from '@/utils/newsUtils';

interface AudioPlayerBarProps {
  currentlyPlaying: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  episodes: NewsItem[];
  filteredAndSortedEpisodes: NewsItem[];
  seriesLabel: string;
  onPlay: (episode: NewsItem, e?: React.MouseEvent) => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
  onSkipBackward: (s?: number) => void;
  onSkipForward: (s?: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentlyPlaying, isPlaying, currentTime, duration, volume, isMuted, playbackSpeed,
  episodes, filteredAndSortedEpisodes, seriesLabel,
  onPlay, onSeek, onSeekMouseUp, onSkipBackward, onSkipForward,
  onVolumeChange, onToggleMute, onPlaybackSpeedChange, onPrevious, onNext, onClose,
}) => {
  const currentIdx = filteredAndSortedEpisodes.findIndex(e => e.id === currentlyPlaying);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === filteredAndSortedEpisodes.length - 1;
  const currentEpisode = episodes.find(e => e.id === currentlyPlaying);
  const progress = ((currentTime || 0) / (duration || 1)) * 100;
  const volumeProgress = (isMuted ? 0 : volume) * 100;
  const nextSpeedIndex = (SPEEDS.indexOf(playbackSpeed) + 1) % SPEEDS.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] bg-gray-100 border-t-2 border-[#0f2055]">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-6">
          {/* Episode info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
              {isPlaying
                ? <svg className="w-6 h-6 text-[#0f2055]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                : <Radio size={20} className="text-gray-600" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#0f2055]">{currentEpisode?.title || 'Unknown Episode'}</p>
              <p className="truncate text-xs text-gray-600">{seriesLabel}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
            <div className="flex items-center gap-4">
              <button onClick={onPrevious} disabled={isFirst} className={`p-1.5 transition-colors ${isFirst ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-[#0f2055]'}`} aria-label="Previous episode">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              <button onClick={() => onSkipBackward(10)} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label="Skip backward 10 seconds"><RotateCcw size={18} /></button>
              <button
                onClick={() => { if (currentEpisode) onPlay(currentEpisode); }}
                className="p-2 rounded-full bg-[#0f2055] text-white hover:scale-105 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <button onClick={() => onSkipForward(10)} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label="Skip forward 10 seconds"><RotateCw size={18} /></button>
              <button onClick={onNext} disabled={isLast} className={`p-1.5 transition-colors ${isLast ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-[#0f2055]'}`} aria-label="Next episode">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-600 whitespace-nowrap">{formatTime(currentTime || 0)}</span>
              <input
                type="range" min="0" max={duration || 0} step="0.1" value={currentTime || 0}
                onChange={onSeek} onMouseUp={onSeekMouseUp}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-300"
                style={{ background: `linear-gradient(to right, #0f2055 0%, #0f2055 ${progress}%, #d1d5db ${progress}%, #d1d5db 100%)` }}
              />
              <span className="text-xs text-gray-600 whitespace-nowrap">{formatTime(duration || 0)}</span>
              <button
                onClick={() => onPlaybackSpeedChange(SPEEDS[nextSpeedIndex])}
                className="px-2 py-0.5 text-xs text-gray-600 hover:text-[#0f2055] transition-colors border border-[#0f2055] rounded"
                aria-label="Playback speed"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>

          {/* Volume + close */}
          <div className="flex items-center gap-2">
            <button onClick={onToggleMute} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-300"
              style={{ background: `linear-gradient(to right, #0f2055 0%, #0f2055 ${volumeProgress}%, #d1d5db ${volumeProgress}%, #d1d5db 100%)` }}
            />
            <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-[#0f2055] transition-colors" aria-label="Close player">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
