import React from 'react';
import { Play, Clock } from 'lucide-react';

interface PodcastCardProps {
  episode: string;
  title: string;
  category: string;
  description: string;
  date: string;
  duration?: string;
  imageUrl?: string;
  onPlay: () => void;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({
  episode,
  title,
  category,
  description,
  date,
  duration,
  imageUrl,
  onPlay,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      {/* Podcast Visual Header */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden bg-gray-100">
        {/* Background Image */}
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
          </>
        ) : (
          <div className="text-gray-300 text-6xl font-bold">♪</div>
        )}

        {/* Episode Badge */}
        <div className="absolute top-4 left-4 bg-[#0F1D4A] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {episode}
        </div>

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <Clock size={12} />
            {duration}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title with External Link Icon */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 flex-1">
            {title}
          </h3>
          <button
            onClick={onPlay}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Open podcast"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.66667L12 12M12 4.66667L4.66667 4.66667M12 4.66667L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Category */}
        <p className="text-sm font-medium text-orange-500 mb-3">{category}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        {/* Footer with Date and Play Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{date}</span>
          <button
            onClick={onPlay}
            className="bg-[#0F1D4A] hover:bg-[#1a2d5f] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Play size={12} fill="white" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
