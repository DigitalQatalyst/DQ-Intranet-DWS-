import React, { useEffect, useState } from 'react';
import { CommunitiesLayout } from './CommunitiesLayout';
import { supabaseClient } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

interface Community {
  id: string;
  name: string;
  description: string;
  imageurl: string;
  category: string;
  tags: string[];
  isprivate: boolean;
  membercount: number;
  activemembers: number;
  activitylevel: string;
  recentactivity: string;
  created_at: string;
}

export function CommunityList() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const from = loadMore ? communities.length : 0;
      const to = from + pageSize - 1;

      // Fetch communities from Supabase
      const { data, error: fetchError, count } = await supabaseClient
        .from('communities')
        .select('*', { count: 'exact' })
        .eq('isprivate', false) // Only show public communities
        .order('membercount', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      const newCommunities = data || [];
      
      if (loadMore) {
        setCommunities(prev => [...prev, ...newCommunities]);
      } else {
        setCommunities(newCommunities);
      }

      // Check if there are more communities to load
      setHasMore(count ? (from + newCommunities.length) < count : false);
      
    } catch (err: any) {
      console.error('Error fetching communities:', err);
      setError(err.message || 'Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchCommunities(true);
  };

  if (loading && communities.length === 0) {
    return (
      <CommunitiesLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
            <p className="mt-2 text-gray-600">
              Discover and join communities that match your interests and professional goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CommunitiesLayout>
    );
  }

  if (error) {
    return (
      <CommunitiesLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading communities: {error}</p>
            <button 
              onClick={() => fetchCommunities()} 
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </CommunitiesLayout>
    );
  }

  return (
    <CommunitiesLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
          <p className="mt-2 text-gray-600">
            Discover and join communities that match your interests and professional goals.
          </p>
        </div>

        {communities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No communities found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  to={`/communities/${community.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={community.imageurl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                      alt={community.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {community.name}
                      </h3>
                      {community.category && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#E6EBF5', color: '#030F35' }}>
                          {community.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {community.description || 'No description available'}
                    </p>
                    
                    {community.tags && community.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {community.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{community.membercount || 0}</span> members
                        {community.activemembers > 0 && (
                          <span className="ml-2">· <span className="font-medium">{community.activemembers}</span> active</span>
                        )}
                      </div>
                      <span className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" style={{ backgroundColor: '#030F35' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#051633'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030F35'}>
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Communities'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </CommunitiesLayout>
  );
}