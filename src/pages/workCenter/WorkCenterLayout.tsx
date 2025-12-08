import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { SearchBar } from '../../components/SearchBar';

interface WorkCenterLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showSearch?: boolean;
}

export const WorkCenterLayout: React.FC<WorkCenterLayoutProps> = ({ 
  children, 
  showNavigation = true,
  showSearch = true 
}) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const pathname = location.pathname;
  const isViewPage = pathname.includes('/projects/') || pathname.includes('/trackers/') || pathname.includes('/tasks/');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs - only show if not in a detail view */}
        {!isViewPage && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                >
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">work center</span>
                </div>
              </li>
            </ol>
          </nav>
        )}

        {/* Title and Description - only show if not in a detail view */}
        {!isViewPage && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Work Center</h1>
            <p className="text-gray-600 mb-6">
              Centralized platform for managing sessions, tasks, and trackers across projects and teams.
            </p>
          </>
        )}

        {/* Navigation and Search - only show on main pages, not detail pages */}
        {showNavigation && !isViewPage && (
          <>
            {/* Tab Overview Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">CURRENT FOCUS</p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {pathname.includes('/sessions') || pathname === '/work-center' ? 'Sessions' : 
                     pathname.includes('/projects') ? 'Projects' : 
                     pathname.includes('/trackers') ? 'Trackers' : 'Sessions'}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    {pathname.includes('/sessions') || pathname === '/work-center' 
                      ? 'View and manage recurring organizational sessions. Calendar view showing all session types including retro, CWS, onboarding, and scrum sessions across departments.'
                      : pathname.includes('/projects')
                      ? 'Manage projects and work items across teams. View different projects, filter by client and project lead, and track work items with detailed information including context, purpose, MVPs, discussion, and checklist items.'
                      : 'Track features and deliverables in Excel-like format. View feature items with owner, status, dates, next best actions, and links to tasks, chat engagement, and outputs.'}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    Sourced from DQ Work Center teams.
                  </p>
                </div>
                {/* Tab Overview Pill - Helper indicator */}
                <div className="ml-4">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-800">Tab overview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <Link
                    to="/work-center/sessions"
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      pathname.includes('/sessions') || pathname === '/work-center'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Sessions
                  </Link>
                  <Link
                    to="/work-center/projects"
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      pathname.includes('/projects')
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Projects
                  </Link>
                  <Link
                    to="/work-center/trackers"
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      pathname.includes('/trackers')
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Trackers
                  </Link>
                </nav>
              </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="mb-6">
                <SearchBar 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery}
                />
              </div>
            )}
          </>
        )}

        {/* Content */}
        {children}
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

