import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface CommunitiesLayoutProps {
  children: React.ReactNode;
}

export function CommunitiesLayout({ children }: CommunitiesLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => {}}
        sidebarOpen={false}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
}