import React from 'react';
import { CommunitiesLayout } from './CommunitiesLayout';

export function CommunityList() {
  const mockCommunities = [
    {
      id: '1',
      name: 'Tech Innovators Abu Dhabi',
      description: 'A community for technology enthusiasts and innovators in Abu Dhabi.',
      memberCount: 245,
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '2',
      name: 'Digital Transformation Hub',
      description: 'Connecting professionals driving digital transformation across industries.',
      memberCount: 189,
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '3',
      name: 'Startup Ecosystem UAE',
      description: 'Supporting entrepreneurs and startups in the UAE ecosystem.',
      memberCount: 312,
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

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
          {mockCommunities.map((community) => (
            <div
              key={community.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={community.imageUrl}
                  alt={community.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {community.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {community.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {community.memberCount} members
                  </span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Load More Communities
          </button>
        </div>
      </div>
    </CommunitiesLayout>
  );
}