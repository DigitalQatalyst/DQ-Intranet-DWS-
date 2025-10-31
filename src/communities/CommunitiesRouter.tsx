import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CommunityHome } from './CommunityHome';
import { CommunityList } from './CommunityList';
import { CommunityFeed } from './CommunityFeed';
import { AuthProvider } from './contexts/AuthProvider';

export function CommunitiesRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<CommunityHome />} />
        <Route path="/communities" element={<CommunityList />} />
        <Route path="/feed" element={<CommunityFeed />} />
        <Route path="/*" element={<CommunityHome />} />
      </Routes>
    </AuthProvider>
  );
}