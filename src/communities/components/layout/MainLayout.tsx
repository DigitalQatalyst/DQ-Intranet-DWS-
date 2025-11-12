import React, { useState } from 'react';
import { useAuth } from '@/components/Header';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageLayout, PageSection, SectionContent } from '@/communities/components/PageLayout';
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  hidePageLayout?: boolean;
}
export function MainLayout({
  children,
  title,
  subtitle,
  fullWidth = false,
  hidePageLayout = false
}: MainLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Main DWS Header */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main content area */}
      <main className="flex-grow">
        {hidePageLayout ? (
          <div className={`flex-1 ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} w-full py-6`}>
            {children}
          </div>
        ) : (
          <PageLayout title={title} headerSubtitle={subtitle}>
            <PageSection>
              <SectionContent>{children}</SectionContent>
            </PageSection>
          </PageLayout>
        )}
      </main>

      {/* Main DWS Footer */}
      <Footer isLoggedIn={!!user} />
    </div>
  );
}
