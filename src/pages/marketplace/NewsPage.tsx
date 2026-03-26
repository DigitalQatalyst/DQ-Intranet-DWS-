import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FilterIcon, HomeIcon, XIcon, ChevronRightIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import FiltersPanel from '@/components/media-center/FiltersPanel';
import AnnouncementsGrid from '@/components/media-center/AnnouncementsGrid';
import BlogsGrid from '@/components/media-center/BlogsGrid';
import PodcastsGrid from '@/components/media-center/PodcastsGrid';
import type { FacetConfig, FiltersValue, MediaCenterTabKey } from '@/components/media-center/types';
import type { NewsItem } from '@/data/media/news';
import type { JobItem } from '@/data/media/jobs';
import { fetchAllNews, fetchAllJobs } from '@/services/mediaCenterService';
import { markMediaItemSeen, getSeenMediaItems } from '@/utils/mediaTracking';

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
    { key: 'location', label: 'Location', options: ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] },
    {
      key: 'newsType',
      label: 'Type',
      options: ['Policy Update', 'Upcoming Events', 'Company News', 'Holidays']
    },
    {
      key: 'dateRange',
      label: 'Date',
      options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year']
    }
  ],
  insights: [
    { key: 'location', label: 'Location', options: ['Dubai', 'Nairobi', 'Riyadh', 'Remote'] },
    {
      key: 'theme',
      label: 'Theme',
      options: ['Leadership', 'Delivery', 'Culture', 'DTMF']
    },
    {
      key: 'readingTime',
      label: 'Reading Time',
      options: ['<5', '5–10', '10–20', '20+']
    }
  ],
  podcasts: [
    {
      key: 'theme',
      label: 'Theme',
      options: ['Leadership', 'Delivery', 'Culture']
    },
    {
      key: 'readingTime',
      label: 'Duration',
      options: ['10–20', '20+']
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

type MediaKind = 'news' | 'job';

interface MediaNotification {
  id: string;
  kind: MediaKind;
  title: string;
  href: string;
  meta: string;
}

const buildNewsNotification = (item: NewsItem): MediaNotification => {
  const isBlog = item.type === 'Thought Leadership';
  const author = item.byline || item.author;
  return {
    id: item.id,
    kind: 'news',
    title: item.title,
    href: `/marketplace/news/${item.id}`,
    meta: isBlog ? `New blog from ${author}` : `New update from ${author}`
  };
};

const buildJobNotification = (job: JobItem): MediaNotification => {
  return {
    id: job.id,
    kind: 'job',
    title: job.title,
    href: `/marketplace/opportunities/${job.id}`,
    meta: `${job.location} · ${job.type} · ${job.roleType} role`
  };
};

const getLatestUnseenMediaItem = (newsItems: NewsItem[], jobItems: JobItem[]): MediaNotification | null => {
  if (typeof window === 'undefined') return null;
  try {
    const seen = getSeenMediaItems();
    const seenNews = new Set(seen.news);
    const seenJobs = new Set(seen.jobs);

    const latestUnseenNews = [...newsItems]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .find((item) => !seenNews.has(item.id));

    const latestUnseenJob = [...jobItems]
      .sort((a, b) => (a.postedOn < b.postedOn ? 1 : -1))
      .find((job) => !seenJobs.has(job.id));

    if (!latestUnseenNews && !latestUnseenJob) return null;
    if (latestUnseenNews && !latestUnseenJob) return buildNewsNotification(latestUnseenNews);
    if (!latestUnseenNews && latestUnseenJob) return buildJobNotification(latestUnseenJob);

    if (latestUnseenNews && latestUnseenJob) {
      const newsTime = new Date(latestUnseenNews.date).getTime();
      const jobTime = new Date(latestUnseenJob.postedOn).getTime();
      return newsTime >= jobTime
        ? buildNewsNotification(latestUnseenNews)
        : buildJobNotification(latestUnseenJob);
    }

    return null;
  } catch {
    return null;
  }
};

const TAB_SUMMARIES: Record<
  MediaCenterTabKey,
  { title: string; description: string; meta?: string }
> = {
  announcements: {
    title: 'News & Announcements',
    description:
      'Discover what is happening in DQ, including important announcements, and what teams are building.',
    meta: 'Sourced from DQ Leadership, Operations, and Communications.'
  },
  insights: {
    title: 'Blogs',
    description:
      'Dive into thought leadership, personal stories, and expert insights written by colleagues across DQ.',
    meta: 'Authored by DQ Associates, Leads, and Partners.'
  },
  podcasts: {
    title: 'Podcasts',
    description:
      'Tune in to conversations, stories, and expert insights from DQ leaders and associates.',
    meta: 'Listen to conversations that matter.'
  },
  opportunities: {
    title: 'Job Openings',
    description:
      'Ready for a new challenge? Grow with us. Explore open roles exclusively for DQ associates.',
    meta: 'Use Department, Location, Role Type, and SFIA to find the right internal match.'
  }
};

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<MediaCenterTabKey>(() => {
    const paramTab = searchParams.get('tab');
    const validTabs: MediaCenterTabKey[] = ['announcements', 'insights', 'podcasts', 'opportunities'];
    if (paramTab && validTabs.includes(paramTab as MediaCenterTabKey)) {
      return paramTab as MediaCenterTabKey;
    }
    if (location.pathname.includes('/opportunities')) {
      return 'opportunities';
    }
    return 'announcements';
  });
  const [queryText, setQueryText] = useState(() => searchParams.get('q') ?? '');
  const [filters, setFilters] = useState<FiltersValue>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newItem, setNewItem] = useState<MediaNotification | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

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
  }, [filters]);

  // Keep local search text in sync with URL ?q= from external entry points (e.g., hero search)
  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? '';
    setQueryText(urlQuery);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    async function loadMediaData() {
      setIsLoadingData(true);
      try {
        const [newsData, jobsData] = await Promise.all([fetchAllNews(), fetchAllJobs()]);
        if (!isMounted) return;
        setNewsItems(newsData);
        setJobItems(jobsData);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;
        setLoadError('Unable to load media items right now.');
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    loadMediaData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!newsItems.length && !jobItems.length) return;
    const item = getLatestUnseenMediaItem(newsItems, jobItems);
    setNewItem(item);
  }, [newsItems, jobItems]);

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

  // Podcast episode search results for the Podcasts tab
  const podcastSearchResults = useMemo(() => {
    if (tab !== 'podcasts') return [] as NewsItem[];
    const search = queryText.trim().toLowerCase();
    if (!search) return [] as NewsItem[];

    return newsItems
      .filter(
        (item) =>
          item.format === 'Podcast' ||
          item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
      )
      .filter((item) => item.title.toLowerCase().includes(search));
  }, [tab, queryText, newsItems]);

  const searchPlaceholder = useMemo(() => {
    switch (tab) {
      case 'announcements':
        return 'Search announcements and updates… e.g., townhall, product update';
      case 'insights':
        return 'Search blogs and insights… e.g., case study, delivery lessons';
      case 'podcasts':
        return 'Search podcast titles… e.g., Execution Beats Intelligence';
      case 'opportunities':
        return 'Search jobs and roles… e.g., SFIA L3, frontend developer';
      default:
        return 'Search…';
    }
  }, [tab]);

  const toggleFilters = () => setShowFilters((prev) => !prev);
  const clearFilters = () => setFilters({});

  const handleViewNewItem = () => {
    if (!newItem) return;
    markMediaItemSeen(newItem.kind === 'job' ? 'job' : 'news', newItem.id);
    const target = newItem.href;
    setNewItem(null);
    navigate(target);
  };

  const handleDismissNewItem = () => {
    if (!newItem) return;
    markMediaItemSeen(newItem.kind === 'job' ? 'job' : 'news', newItem.id);
    setNewItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />

      {newItem && (
        <div className="fixed right-4 top-18 z-50 w-full max-w-xs p-2 sm:right-4 sm:top-20">
          <div className="group flex items-stretch overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_15px_60px_rgba(15,23,42,0.15)] transition-all duration-200 hover:shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#1A2E6E]">
                {newItem.kind === 'job' ? 'New job opening' : 'New story'}
              </p>
              <p className="text-sm font-semibold leading-5 text-gray-900 line-clamp-2">{newItem.title}</p>
              <p className="text-xs leading-snug text-gray-600 line-clamp-2">{newItem.meta}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleViewNewItem}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#030f35] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#030f35]"
                >
                  View now
                </button>
                <button
                  type="button"
                  onClick={handleDismissNewItem}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700"
                  aria-label="Dismiss new item notification"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <nav className="flex mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900" rel="noopener noreferrer">
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

        <header className="mb-6 space-y-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DQ Media Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Your starting point for news, stories, podcasts, and career opportunities at DQ.
            </p>
          </div>
        </header>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            const nextTab = value as MediaCenterTabKey;
            setTab(nextTab);
            const params = new URLSearchParams(location.search);
            if (nextTab === 'announcements') {
              params.delete('tab');
            } else {
              params.set('tab', nextTab);
            }
            setSearchParams(params);
          }}
          className="w-full"
        >
          <div className="border-b border-gray-200">
            <TabsList className="flex h-auto w-full justify-start gap-8 overflow-x-auto bg-transparent p-0 text-gray-700">
              <TabsTrigger
                value="announcements"
                className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                News & Announcements
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                Blogs
              </TabsTrigger>
              <TabsTrigger
                value="podcasts"
                className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                Podcasts
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="rounded-none border-b-2 border-transparent px-0 py-2 justify-start text-left text-gray-700 transition-colors duration-200 data-[state=active]:border-[#1A2E6E] data-[state=active]:font-medium data-[state=active]:text-[#1A2E6E]"
              >
                Job Openings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab-specific about block below navigation (compact 1–2 line description) */}
          <div className="mt-3 mb-4">
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-700 leading-snug line-clamp-2">
                {TAB_SUMMARIES[tab].description}
              </p>
            </div>
          </div>

          <div className="mt-4 mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full">
              <Input
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-11 w-full"
              />
              {tab === 'podcasts' && queryText.trim() && (
                <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {podcastSearchResults.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No podcast episodes found matching "{queryText}".
                    </div>
                  ) : (
                    podcastSearchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setQueryText('');
                          const params = new URLSearchParams();
                          params.set('tab', 'podcasts');
                          params.set('episode', item.id);
                          navigate(`/marketplace/news/action-solver-podcast?${params.toString()}`);
                        }}
                        className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 line-clamp-1">{item.title}</span>
                        <span className="text-xs text-gray-500">Podcast episode</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
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
              {isLoadingData && !newsItems.length && !jobItems.length && (
                <div className="text-sm text-gray-500">Loading latest items</div>
              )}
              {loadError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loadError}
                </div>
              )}
              <TabsContent value="announcements">
                <AnnouncementsGrid query={query} items={newsItems} />
              </TabsContent>
              <TabsContent value="insights">
                <BlogsGrid query={query} items={newsItems} />
              </TabsContent>
              <TabsContent value="podcasts">
                <PodcastsGrid query={query} items={newsItems} />
              </TabsContent>
              <TabsContent value="opportunities">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="relative h-48 w-full bg-gray-200">
                      <img
                        src="/image (8).jpg"
                        alt="Job Openings Coming Soon"
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                      {/* Centered overlay text across the image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/60 px-5 py-2">
                          <p className="text-sm font-semibold text-white">Job Openings Coming Soon</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className="text-sm text-gray-600 max-w-xl mx-auto">
                        Internal job postings will be published here once the Job Openings feature is live.
                      </p>
                    </div>
                  </div>
                </div>
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
