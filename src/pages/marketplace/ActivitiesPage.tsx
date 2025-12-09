import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

type WorkCenterTabKey = 'sessions' | 'projects-tasks' | 'trackers';

const ActivitiesPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<WorkCenterTabKey>(() => {
    const paramTab = searchParams.get('tab');
    if (paramTab === 'sessions' || paramTab === 'projects-tasks' || paramTab === 'trackers') {
      return paramTab;
    }
    return 'sessions';
  });

  // Update tab when searchParams change
  useEffect(() => {
    const paramTab = searchParams.get('tab');
    if (paramTab === 'sessions' || paramTab === 'projects-tasks' || paramTab === 'trackers') {
      setTab(paramTab);
    } else if (!paramTab) {
      setTab('sessions');
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const nextTab = value as WorkCenterTabKey;
    setTab(nextTab);
    const params = new URLSearchParams(location.search);
    if (nextTab === 'sessions') {
      params.delete('tab');
    } else {
      params.set('tab', nextTab);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Work Center</span>
                </div>
              </li>
            </ol>
          </nav>

          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">DQ Work Center</h1>
            <p className="text-gray-600">
              Run work sessions, manage projects & tasks, and track performance across workflows.
            </p>
          </header>

          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b border-gray-200">
              <TabsList className="flex h-auto w-full justify-start gap-8 overflow-x-auto bg-transparent p-0 text-gray-700">
                <TabsTrigger
                  value="sessions"
                  className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
                >
                  Work Sessions
                </TabsTrigger>
                <TabsTrigger
                  value="projects-tasks"
                  className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
                >
                  Projects & Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="trackers"
                  className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
                >
                  Performance Trackers
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-8">
              <TabsContent value="sessions" className="m-0">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Work Sessions</h2>
                  <p className="text-gray-600 mb-4">
                    Run daily and weekly work sessions, reviews, retros, and collaborator touchpoints.
                  </p>
                  <p className="text-gray-500">Content coming soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="projects-tasks" className="m-0">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Projects & Tasks</h2>
                  <p className="text-gray-600 mb-4">
                    Manage tasks, planners, chat threads, and ATP delivery activities.
                  </p>
                  <p className="text-gray-500">Content coming soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="trackers" className="m-0">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Performance Trackers</h2>
                  <p className="text-gray-600 mb-4">
                    Track statuses, categories, descriptions, and live workflow updates.
                  </p>
                  <p className="text-gray-500">Content coming soon.</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
