import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CommunityHome } from './CommunityHome';
import { CommunityList } from './CommunityList';
import { AuthProvider } from './contexts/AuthProvider';

export function CommunitiesRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<CommunityHome />} />
        <Route path="/communities" element={<CommunityList />} />
        <Route path="/*" element={<CommunityHome />} />
      </Routes>
    </AuthProvider>
  );
}