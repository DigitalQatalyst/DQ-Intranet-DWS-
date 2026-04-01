import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { formatTime } from '@/utils/newsUtils';

interface AudioPlayerProps {
  audioUrl: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export function AudioPlayer({ audioUrl, onPlayStateChange, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const audio = audioRef.current;

    const updateTime = () => {
      if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayStateChange?.(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl, onPlayStateChange]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Handle play error silently
      });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + seconds, duration);
  };

  const skipBackward = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - seconds, 0);
  };

  if (!audioUrl) return null;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Listen to Podcast</h2>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex flex-col items-center space-y-4">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          className="w-16 h-16 bg-[#030f35] hover:bg-[#021028] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#030f35] focus:ring-offset-2"
          aria-label={isPlaying ? 'Pause podcast' : 'Play podcast'}
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" />
          )}
        </button>
        
        {/* Time Display */}
        <div className="text-gray-700 text-sm font-medium">
          <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl">
          <div
            className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={duration || 100}
            aria-valuenow={currentTime}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                skipForward(10);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                skipBackward(10);
              }
            }}
          >
            <div
              className="h-2 bg-[#030f35] rounded-full transition-all"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        
        {/* Skip Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => skipBackward(15)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            aria-label="Rewind 15 seconds"
          >
            -15s
          </button>
          <button
            type="button"
            onClick={() => skipForward(15)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            aria-label="Forward 15 seconds"
          >
            +15s
          </button>
        </div>
      </div>
    </div>
  );
}

