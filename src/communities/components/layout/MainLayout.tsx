import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { Header, AuthProvider as CommunitiesAuthProvider } from '@/communities/components/Header';
//import { Header } from "../../components/Header";
import { Footer } from '@/communities/components/Footer';
import { Sidebar } from '@/communities/components/AppSidebar';
import { PageLayout, PageSection, SectionContent } from '@/communities/components/PageLayout';
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  hidePageLayout?: boolean;
}
export function MainLayout({
  children,
  title,
  fullWidth = false,
  hidePageLayout = false
}: MainLayoutProps) {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Map routes to sidebar sections
  useEffect(() => {
    const routeMap: Record<string, string> = {
      '/': 'dashboard',
      '/feed': 'dashboard',
      '/communities': 'profile',
      '/profile': 'profile',
      '/messages': 'documents',
      '/moderation': 'reports',
      '/analytics': 'reports',
      '/settings': 'settings',
      '/activity': 'requests'
    };
    const section = routeMap[location.pathname] || 'dashboard';
    setActiveSection(section);
  }, [location.pathname]);

  // Handle section changes to navigate
  const handleSectionChange = (sectionId: string) => {
    const sectionRoutes: Record<string, string> = {
      'dashboard': '/',
      'profile': '/profile',
      'documents': '/messages',
      'reports': '/moderation',
      'settings': '/settings',
      'requests': '/activity'
    };
    const route = sectionRoutes[sectionId];
    if (route) {
      navigate(route);
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return <div className="flex flex-col min-h-screen w-full">
      {/* DQ Gradient Header - Always visible */}
      <CommunitiesAuthProvider>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      </CommunitiesAuthProvider>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 w-full min-h-screen">
        {/* Sidebar - Desktop: always visible, Mobile: toggle */}
        {user && <>
            {/* Mobile/Tablet backdrop */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection={activeSection} onSectionChange={handleSectionChange} companyName="Community Platform" /> */}
          </>}

        {/* Content - adjusts based on sidebar presence */}
        <div className="flex-1 flex flex-col overflow-auto w-full">
          {hidePageLayout ? <div className={`flex-1 ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} w-full`}>
              {children}
            </div> : <PageLayout title={title}>
              <PageSection>
                <SectionContent>{children}</SectionContent>
              </PageSection>
            </PageLayout>}
          <Footer isLoggedIn={!!user} />
        </div>
      </div>
    </div>;
}
