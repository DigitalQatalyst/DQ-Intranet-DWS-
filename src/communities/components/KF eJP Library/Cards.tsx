import React from 'react';
import { Users, Lock } from 'lucide-react';

interface CommunityCardItem {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activeMembers: number;
  category: string;
  tags: string[];
  imageUrl: string;
  isPrivate: boolean;
  activityLevel: 'low' | 'medium' | 'high';
  recentActivity: string;
}

interface CommunityCardProps {
  item: CommunityCardItem;
  onJoin: () => void;
  onViewDetails: () => void;
}

export function CommunityCard({ item, onJoin, onViewDetails }: CommunityCardProps) {
  const getActivityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {item.name}
          </h3>
          {item.isPrivate && (
            <Lock className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {item.memberCount} members
            </span>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(item.activityLevel)}`}>
            {item.activityLevel} activity
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={onViewDetails}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={onJoin}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}