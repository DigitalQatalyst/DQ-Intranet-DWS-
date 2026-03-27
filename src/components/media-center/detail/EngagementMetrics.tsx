import React from 'react';
import { Heart } from 'lucide-react';

interface EngagementMetricsProps {
  views: number;
  likes: number;
  hasLiked: boolean;
  onLike: () => void;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  views,
  likes,
  hasLiked,
  onLike,
}) => {
  return (
    <div className="mt-4 bg-white p-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <span>{views} views</span>
        </div>
        <button 
          type="button"
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
            hasLiked 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-gray-600 hover:text-red-600'
          }`}
          aria-label={hasLiked ? 'Liked' : 'Like this article'}
        >
          <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};
