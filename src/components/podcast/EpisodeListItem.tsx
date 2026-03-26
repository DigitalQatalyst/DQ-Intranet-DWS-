import React from 'react';
import { Play, Pause, Share2, Download, Bookmark } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { formatTime, formatDuration, formatDateVeryShort } from '@/utils/newsUtils';
import { EpisodeContent } from './EpisodeContent';

interface EpisodeListItemProps {
  episode: NewsItem;
  episodeNumber: number;
  isCurrentlyPlaying: boolean;
  isPlaying: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  hoveredEpisode: string | null;
  savedEpisodes: Set<string>;
  shareSuccess: string | null;
  episodeDurations: Map<string, number>;
  onPlay: (episode: NewsItem, e: React.MouseEvent) => void;
  onExpand: (episodeId: string, e: React.MouseEvent) => void;
  onShare: (episode: NewsItem, e: React.MouseEvent) => void;
  onDownload: (episode: NewsItem, e: React.MouseEvent) => void;
  onSave: (episode: NewsItem, e: React.MouseEvent) => void;
  onHover: (episodeId: string | null) => void;
}

function getItemHoverClass(isHovered: boolean, hoveredEpisode: string | null, episodeId: string): string {
  if (isHovered) return 'scale-[1.02] bg-white shadow-lg border-gray-200 rounded-lg relative';
  if (hoveredEpisode && hoveredEpisode !== episodeId) return 'opacity-50';
  return '';
}

export const EpisodeListItem: React.FC<EpisodeListItemProps> = ({
  episode, episodeNumber, isCurrentlyPlaying, isPlaying, isExpanded, isHovered,
  hoveredEpisode, savedEpisodes, shareSuccess, episodeDurations,
  onPlay, onExpand, onShare, onDownload, onSave, onHover,
}) => (
  <div
    id={`episode-${episode.id}`}
    onMouseEnter={() => onHover(episode.id)}
    onMouseLeave={() => onHover(null)}
    style={{ zIndex: isHovered ? 50 : 1 }}
    className={`group flex items-center gap-4 border-b border-gray-100 py-3 px-2 transition-all duration-300
      ${isCurrentlyPlaying ? 'bg-[#0f2055]/5' : ''}
      ${getItemHoverClass(isHovered, hoveredEpisode, episode.id)}`}
  >
    <button onClick={(e) => onPlay(episode, e)} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition hover:scale-110">
      {isCurrentlyPlaying && isPlaying
        ? <Pause size={20} className="text-[#0f2055]" />
        : <Play size={20} className="text-gray-400 group-hover:text-[#0f2055]" fill="currentColor" />}
    </button>

    <div className="flex-1 min-w-0 cursor-pointer" onClick={(e) => onExpand(episode.id, e)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-gray-500 font-medium">EP {episodeNumber}</span>
      </div>
      <h3 className={`text-sm font-semibold mb-1 truncate ${isCurrentlyPlaying ? 'text-[#0f2055]' : 'text-gray-900'}`}>
        {episode.title}
      </h3>
      {!isExpanded && <p className="text-xs text-gray-600 line-clamp-1 mb-1">{episode.excerpt}</p>}
      {isExpanded && episode.content && (
        <div className="mt-2 mb-3">
          <div className="text-xs text-gray-600 mb-3">
            <EpisodeContent content={episode.content} />
          </div>
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={(e) => onShare(episode, e)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                ${shareSuccess === episode.id ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Share2 size={14} /><span>{shareSuccess === episode.id ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={(e) => onDownload(episode, e)}
              disabled={!episode.audioUrl}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                ${!episode.audioUrl ? 'opacity-50 cursor-not-allowed border-gray-300 bg-white text-gray-400' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Download size={14} /><span>Download</span>
            </button>
            <button
              onClick={(e) => onSave(episode, e)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                ${savedEpisodes.has(episode.id) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Bookmark size={14} fill={savedEpisodes.has(episode.id) ? 'currentColor' : 'none'} />
              <span>{savedEpisodes.has(episode.id) ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      )}
    </div>

    <div className="flex-shrink-0 text-right">
      <div className="text-xs text-gray-500 mb-1">
        {episodeDurations.has(episode.id) ? formatTime(episodeDurations.get(episode.id)!) : formatDuration(episode.readingTime)}
      </div>
      <div className="text-xs text-gray-400">{formatDateVeryShort(episode.date)}</div>
    </div>
  </div>
);
