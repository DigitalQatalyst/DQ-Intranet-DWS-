import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CommunityHome } from './CommunityHome';
import Communities from './pages/Communities';
import { CommunityFeed } from './CommunityFeed';
import { AuthProvider } from './contexts/AuthProvider';

export function CommunitiesRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<CommunityHome />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/feed" element={<CommunityFeed />} />
        <Route path="/*" element={<CommunityHome />} />
      </Routes>
    </AuthProvider>
  );
}