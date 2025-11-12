import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FilterIcon, HomeIcon, XIcon, ChevronRightIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import FiltersPanel from '@/components/media-center/FiltersPanel';
import AnnouncementsGrid from '@/components/media-center/AnnouncementsGrid';
import BlogsGrid from '@/components/media-center/BlogsGrid';
import JobsGrid from '@/components/media-center/JobsGrid';
import type { FacetConfig, FiltersValue, MediaCenterTabKey } from '@/components/media-center/types';

const PINNED_FACETS: FacetConfig[] = [
  {
    key: 'department',
    label: 'Department',
    options: [
      'HRA (People)',
      'Finance',
      'Deals',
      'Stories',
      'Intelligence',
      'Solutions',
      'SecDevOps',
      'Products',
      'Delivery — Deploys',
      'Delivery — Designs',
      'DCO Operations',
      'DBP Platform',
      'DBP Delivery'
    ]
  },
  { key: 'location', label: 'Location', options: ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] }
];

const SECONDARY_FACETS: Record<MediaCenterTabKey, FacetConfig[]> = {
  announcements: [
    {
      key: 'department',
      label: 'Department',
      options: [
        'HRA (People)',
        'Finance',
        'Deals',
        'Stories',
        'Intelligence',
        'Solutions',
        'SecDevOps',
        'Products',
        'Delivery — Deploys',
        'Delivery — Designs',
        'DCO Operations',
        'DBP Platform',
        'DBP Delivery'
      ]
    },
    { key: 'location', label: 'Location', options: ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] },
    {
      key: 'newsType',
      label: 'News Type',
      options: ['Corporate Announcements', 'Product / Project Updates', 'Events & Campaigns', 'Digital Tech News']
    },
    {
      key: 'newsSource',
      label: 'News Source',
      options: ['DQ Leadership', 'DQ Operations', 'DQ Communications']
    },
    {
      key: 'focusArea',
      label: 'Topic / Focus Area',
      options: ['GHC', 'DWS', 'Culture & People']
    },
    {
      key: 'audience',
      label: 'Audience',
      options: ['All Hands', 'Leads', 'Partners', 'Public']
    },
    {
      key: 'channel',
      label: 'Channel',
      options: ['Email', 'Townhall', 'Portal', 'Social']
    }
  ],
  insights: [
    {
      key: 'department',
      label: 'Department',
      options: [
        'HRA (People)',
        'Finance',
        'Deals',
        'Stories',
        'Intelligence',
        'Solutions',
        'SecDevOps',
        'Products',
        'Delivery — Deploys',
        'Delivery — Designs',
        'DCO Operations',
        'DBP Platform',
        'DBP Delivery'
      ]
    },
    { key: 'location', label: 'Location', options: ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] },
    {
      key: 'newsType',
      label: 'News Type',
      options: ['Corporate Announcements', 'Product / Project Updates', 'Events & Campaigns', 'Digital Tech News']
    },
    {
      key: 'newsSource',
      label: 'News Source',
      options: ['DQ Leadership', 'DQ Operations', 'DQ Communications']
    },
    {
      key: 'focusArea',
      label: 'Topic / Focus Area',
      options: ['GHC', 'DWS', 'Culture & People']
    },
    {
      key: 'format',
      label: 'Format',
      options: ['Tutorial', 'Case Study', 'Opinion', 'How-to']
    },
    {
      key: 'readingTime',
      label: 'Reading Time',
      options: ['< 3 min', '3–5 min', '5–10 min', '> 10 min']
    }
  ],
  opportunities: [
    {
      key: 'department',
      label: 'Department',
      options: [
        'HRA (People)',
        'Finance',
        'Deals',
        'Stories',
        'Intelligence',
        'Solutions',
        'SecDevOps',
        'Products',
        'Delivery — Deploys',
        'Delivery — Designs',
        'DCO Operations',
        'DBP Platform',
        'DBP Delivery'
      ]
    },
    { key: 'location', label: 'Location', options: ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] },
    { key: 'deptType', label: 'Role Type', options: ['Tech', 'Design', 'Ops', 'Finance', 'HR'] },
    {
      key: 'sfiaLevel',
      label: 'SFIA Level',
      options: [
        { value: 'L0', label: 'L0 · Starting', description: 'Learning' },
        { value: 'L1', label: 'L1 · Follow', description: 'Self Aware' },
        { value: 'L2', label: 'L2 · Assist', description: 'Self Lead' },
        { value: 'L3', label: 'L3 · Apply', description: 'Drive Squad' },
        { value: 'L4', label: 'L4 · Enable', description: 'Drive Team' },
        { value: 'L5', label: 'L5 · Ensure', description: 'Steer Org' },
        { value: 'L6', label: 'L6 · Influence', description: 'Steer Cross' },
        { value: 'L7', label: 'L7 · Inspire', description: 'Inspire Market' }
      ]
    },
    { key: 'contract', label: 'Contract Type', options: ['Full-time', 'Part-time', 'Contract', 'Intern'] },
    { key: 'workMode', label: 'Work Mode', options: ['Onsite', 'Hybrid', 'Remote'] },
    { key: 'postedWithin', label: 'Posted Within', options: ['Last 7 days', 'Last 30 days', 'Any time'] }
  ]
};

const TAB_SUMMARIES: Record<
  MediaCenterTabKey,
  { title: string; description: string; meta?: string }
> = {
  announcements: {
    title: 'News & Announcement',
    description:
      'Live corporate announcements, product / project updates, events, and comms so every studio keeps pace with what is shipping across DQ.',
    meta: 'Sourced from DQ Leadership, Operations, and Communications.'
  },
  insights: {
    title: 'Blogs',
    description:
      'Long-form blogs and thought-leadership pieces that codify craft, behaviours, and delivery lessons from across chapters.',
    meta: 'Authored by DQ Associates, Leads, and Partners.'
  },
  opportunities: {
    title: 'Jobs opening',
    description:
      'Internal mobility postings for current DQ teammates looking to rotate into a new role, studio, or craft without leaving the company.',
    meta: 'Use Department, Location, Role Type, and SFIA to find the right internal match.'
  }
};

const NewsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<MediaCenterTabKey>('announcements');
  const [queryText, setQueryText] = useState('');
  const [filters, setFilters] = useState<FiltersValue>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setFilters({});
  }, [tab]);

  useEffect(() => {
    setShowFilters(false);
  }, [tab]);

  useEffect(() => {
    const legacyFilters = filters as FiltersValue & { units?: string[] };
    if (legacyFilters.units && !legacyFilters.department) {
      const { units, ...rest } = legacyFilters;
      setFilters({ ...rest, department: units });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facets = useMemo(() => [...SECONDARY_FACETS[tab]], [tab]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((values) => Array.isArray(values) && values.length > 0),
    [filters]
  );

  const query = useMemo(
    () => ({
      tab,
      q: queryText,
      filters
    }),
    [tab, queryText, filters]
  );

  const searchPlaceholder = useMemo(() => {
    switch (tab) {
      case 'announcements':
        return 'Search announcements and updates… e.g., townhall, product update';
      case 'insights':
        return 'Search blogs and insights… e.g., case study, delivery lessons';
      case 'opportunities':
        return 'Search jobs and roles… e.g., SFIA L3, frontend developer';
      default:
        return 'Search…';
    }
  }, [tab]);

  const toggleFilters = () => setShowFilters((prev) => !prev);
  const clearFilters = () => setFilters({});

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <nav className="flex mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon size={16} className="mr-1" />
                Home
              </a>
            </li>
            <li className="inline-flex items-center">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">Resources</span>
            </li>
            <li className="inline-flex items-center text-gray-700">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1 md:ml-2">DQ Media Center</span>
            </li>
          </ol>
        </nav>

        <header className="mb-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DQ Media Center</h1>
            <p className="text-gray-600">
              Discover the latest stories, highlights, and announcements from across DQ.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current focus</p>
                <p className="mt-1 text-base font-semibold text-[#1A2E6E]">{TAB_SUMMARIES[tab].title}</p>
                <p className="mt-1 text-sm text-gray-700">{TAB_SUMMARIES[tab].description}</p>
                {TAB_SUMMARIES[tab].meta && <p className="mt-2 text-xs text-gray-500">{TAB_SUMMARIES[tab].meta}</p>}
              </div>
              <div className="rounded-xl bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#1A2E6E]">
                Tab overview
              </div>
            </div>
          </div>
        </header>

        <Tabs value={tab} onValueChange={(value) => setTab(value as MediaCenterTabKey)} className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="flex h-auto w-full justify-start gap-0 overflow-x-auto bg-transparent p-0 text-gray-700">
              <TabsTrigger
                value="announcements"
                className="flex-1 basis-1/3 rounded-none border-b-2 border-transparent px-0 py-2 text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                News & Announcement
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex-1 basis-1/3 rounded-none border-b-2 border-transparent px-0 py-2 text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                Blogs
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="flex-1 basis-1/3 rounded-none border-b-2 border-transparent px-0 py-2 text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                Jobs opening
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4 mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
            <Input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11"
            />
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={toggleFilters}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                <FilterIcon className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {hasActiveFilters && (
                <button type="button" className="text-sm font-medium text-[#1A2E6E]" onClick={clearFilters}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div
            className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${
              showFilters ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              className={`absolute inset-y-0 left-0 w-full max-w-sm transform bg-white shadow-xl transition-transform duration-300 ${
                showFilters ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={toggleFilters} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close filters">
                  <XIcon size={20} />
                </button>
              </div>
              <div className="h-full overflow-y-auto px-4 pb-6 pt-4 space-y-4">
                <FiltersPanel
                  facets={facets}
                  values={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  groupOrder={{ pinned: ['department', 'location'] }}
                />
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      clearFilters();
                      toggleFilters();
                    }}
                    className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl bg-white p-4 shadow">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                      <button type="button" className="text-sm font-medium text-[#1A2E6E]" onClick={clearFilters}>
                        Reset All
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                      onClick={() => setSidebarCollapsed((v) => !v)}
                    >
                      {sidebarCollapsed ? 'Show' : 'Hide'}
                    </button>
                  </div>
                </div>
                {!sidebarCollapsed && (
                  <FiltersPanel
                    facets={facets}
                    values={filters}
                    onChange={setFilters}
                    onClear={hasActiveFilters ? clearFilters : undefined}
                    groupOrder={{ pinned: ['department', 'location'] }}
                  />
                )}
              </div>
            </aside>

            <section className="space-y-6">
              <TabsContent value="announcements">
                <AnnouncementsGrid query={query} />
              </TabsContent>
              <TabsContent value="insights">
                <BlogsGrid query={query} />
              </TabsContent>
              <TabsContent value="opportunities">
                <JobsGrid query={query} />
              </TabsContent>
            </section>
          </div>
        </Tabs>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsPage;
