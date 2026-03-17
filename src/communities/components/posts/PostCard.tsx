import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Share2, Calendar, MapPin } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  community_id: string;
  community_name: string;
  author_username: string;
  author_avatar?: string;
  helpful_count?: number;
  insightful_count?: number;
  comment_count?: number;
  tags?: string[];
  post_type?: 'text' | 'media' | 'poll' | 'event' | 'article' | 'announcement';
  metadata?: any;
  event_date?: string;
  event_location?: string;
}

interface PostCardProps {
  post: Post;
  onActionComplete?: () => void;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const getPostTypeBadge = (type: string) => {
    const badges = {
      event: 'bg-green-100 text-green-800',
      poll: 'bg-blue-100 text-blue-800',
      media: 'bg-purple-100 text-purple-800',
      article: 'bg-orange-100 text-orange-800',
      announcement: 'bg-red-100 text-red-800',
      text: 'bg-gray-100 text-gray-800'
    };
    return badges[type as keyof typeof badges] || badges.text;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-medium text-sm">
                {post.author_username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/communities/profile/${post.created_by}`)}
                  className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {post.author_username}
                </button>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPostTypeBadge(post.post_type || 'text')}`}
                >
                  {post.post_type || 'text'}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  onClick={() => navigate(`/communities/community/${post.community_id}`)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {post.community_name}
                </button>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 leading-relaxed line-clamp-3">{post.content}</p>
        
        {/* Event specific content */}
        {post.post_type === 'event' && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-4 text-sm text-green-800">
              {post.event_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.event_date).toLocaleDateString()}</span>
                </div>
              )}
              {post.event_location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{post.event_location}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-sm">{post.helpful_count || 0}</span>
          </button>
          <button
            onClick={() => navigate(`/communities/post/${post.id}`)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">{post.comment_count || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share2 className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}