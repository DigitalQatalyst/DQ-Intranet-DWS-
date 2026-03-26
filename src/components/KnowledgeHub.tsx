import React, { useEffect, useState } from "react";
import { Loader, AlertCircle, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeInUpOnScroll } from "./AnimationUtils";
import { NewsCard } from "./CardComponents";
import { knowledgeHubSupabase } from '@/services/knowledgeHubClient';
import { createClient } from '@supabase/supabase-js';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
  image?: string;
  source?: string;
  tags?: string[];
  type?: string;
  newsType?: string;
  focusArea?: string;
  department?: string;
  newsSource?: string;
  byline?: string;
  author?: string;
}

// Mock data for fallback - keep the existing data
const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Agile Working at DQ | Not Just for Projects",
    excerpt:
      "Discover how agile principles are helping teams across DQ collaborate faster and deliver with confidence.",
    date: "August 21, 2025",
    category: "Agile Working",
    source: "DQ Insights",
    imageUrl:
      "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "2",
    title: "From Vision to Impact | The DQ Storybook Goes Live!",
    excerpt:
      "The DQ Storybook is now published—bringing together our competencies, values, and transformation journey.",
    date: "August 14, 2025",
    category: "Strategy",
    source: "DQ Governance Office",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3",
    title: "Leadership Principles | What’s Your Superpower?",
    excerpt:
      "Uncover what makes effective leaders thrive at DQ and explore practical tools to grow your leadership strengths.",
    date: "August 19, 2025",
    category: "Leadership",
    source: "DQ Learning Hub",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "4",
    title: "Grounded in Growth and Emotional Intelligence",
    excerpt:
      "Learn how emotional intelligence drives collaboration, resilience, and growth across our teams.",
    date: "August 8, 2025",
    category: "Culture",
    source: "DQ Culture Team",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "5",
    title: "Shifts Allocation Guidelines Released",
    excerpt:
      "New workspace guidelines launched to improve workload balance, transparency, and efficiency.",
    date: "July 25, 2025",
    category: "Policy Update",
    source: "DQ Operations",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "6",
    title: "New DQ Innovation Hub Opens",
    excerpt:
      "A digital hub for experimentation and collaboration is now live, inviting teams to explore and innovate together.",
    date: "July 10, 2025",
    category: "Innovation",
    source: "DQ Labs",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

// Event and Resource mock data removed (unused) to satisfy noUnusedLocals.

// Define interface for tab items
type TabId = "guidelines" | "learning";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full flex justify-center mb-6" role="tablist" aria-label="Knowledge Hub tabs">
      <div className="inline-flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 px-1 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`kh-panel-${tab.id}`}
              id={`kh-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative mx-0.5 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8EFF]/40 inline-flex items-center ${
                isActive
                  ? "bg-[#DDE8FF] text-[#030F35] shadow-[inset_0_-2px_0_0_#5B8EFF]"
                  : "text-[#3b4a66] hover:bg-[#F5F8FF]"
              }`}
            >
              <span className="mr-2" aria-hidden="true">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader size={40} className="text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium">Loading data...</p>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle size={40} className="text-red-500 mb-4" />
    <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Data</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      {message || "We couldn't load the data. Please try again later."}
    </p>
  </div>
);

// KnowledgeHub Content Component
const KnowledgeHubContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("guidelines");
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [mediaCenterNews, setMediaCenterNews] = useState<NewsItem[]>([]);
  const [loadFallback, setLoadFallback] = useState(false);

  const tabs: TabItem[] = [
    {
      id: "guidelines",
      label: "Guidelines",
      icon: <Radio size={16} className="#030F35-600" />,
    },
    {
      id: "learning",
      label: "Learning",
      icon: <Radio size={16} className="#030F35-600" />,
    },
  ];

  // Handle tab change with animation
  const handleTabChange = (id: TabId) => {
    if (activeTab === id) return;
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(id);
      setIsTabChanging(false);
    }, 300);
  };

  // Fetch latest media center items once, reuse for display
  useEffect(() => {
    let isMounted = true;

    async function loadMediaCenterData() {
      setIsLoading(true);
      setError(null);
      try {
        let allContent: NewsItem[] = [];

        // Fetch from Knowledge Hub (Guidelines)
        if (knowledgeHubSupabase) {
          try {
            // Try v_media_all view first, fall back to guides table if view doesn't exist
            let khData: any[] | null = null;
            let khError: any = null;

            // Try the view first
            const viewResult = await knowledgeHubSupabase
              .from('v_media_all')
              .select('*')
              .eq('status', 'Approved')
              .order('date', { ascending: false })
              .limit(50);

            if (viewResult.error && (viewResult.error.code === 'PGRST204' || viewResult.error.code === 'PGRST205')) {
              // View doesn't exist, query guides table directly
              console.log('📊 v_media_all view not found, querying guides table directly');
              const guidesResult = await knowledgeHubSupabase
                .from('guides')
                .select('*')
                .eq('status', 'Approved')
                .order('last_updated_at', { ascending: false })
                .limit(50);
              
              khData = guidesResult.data;
              khError = guidesResult.error;
            } else {
              khData = viewResult.data;
              khError = viewResult.error;
            }

            if (!khError && khData) {
              console.log('📊 Knowledge Hub raw data:', khData.length, 'items');
              console.log('📊 Sample items:', khData.slice(0, 3).map(i => ({ 
                title: i.title, 
                type: i.type || i.guide_type, 
                category: i.category || i.domain 
              })));
              
              const transformedKH: NewsItem[] = khData.map((item: any) => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                excerpt: item.description || item.summary || item.excerpt || '',
                date: item.date || item.last_updated_at,
                image: item.image_url || item.hero_image_url,
                tags: item.tags || [],
                type: item.type || item.guide_type || '', // Use type, fall back to guide_type, NO default
                category: item.category || item.domain || 'Guidelines',
                newsType: item.news_type,
                focusArea: item.focus_area || item.domain,
                department: item.category || item.domain,
                newsSource: item.source || item.author_name || 'DQ',
                byline: item.author_name,
                author: item.author_name,
              }));
              
              console.log('📊 Transformed KH data:', transformedKH.length, 'items');
              console.log('📊 Types in data:', [...new Set(transformedKH.map(i => i.type))]);
              
              allContent = [...allContent, ...transformedKH];
            } else if (khError) {
              console.error('Knowledge Hub fetch error:', khError);
            }
          } catch (err) {
            console.warn('Knowledge Hub fetch failed:', err);
          }
        }

        // Fetch from LMS (Learning courses)
        try {
          const lmsUrl = import.meta.env.VITE_LMS_SUPABASE_URL;
          const lmsKey = import.meta.env.VITE_LMS_SUPABASE_ANON_KEY;
          
          if (lmsUrl && lmsKey) {
            const lmsClient = createClient(lmsUrl, lmsKey);
            const { data: lmsData, error: lmsError } = await lmsClient
              .from('lms_courses')
              .select('*')
              .eq('status', 'published') // Only show published courses (excludes archived)
              .order('updated_at', { ascending: false })
              .limit(50);

            if (!lmsError && lmsData) {
              const transformedLMS: NewsItem[] = lmsData.map((course: any) => ({
                id: course.id,
                slug: course.slug,
                title: course.title,
                excerpt: course.excerpt || course.description || '',
                date: course.updated_at,
                image: course.image_url,
                tags: ['Learning', 'Course', course.category].filter(Boolean),
                type: 'Thought Leadership',
                category: course.category || 'Learning',
                newsType: 'Course',
                focusArea: 'Learning',
                department: course.department || 'Learning',
                newsSource: course.provider || 'DQ Learning',
                byline: course.provider,
                author: course.provider,
              }));
              allContent = [...allContent, ...transformedLMS];
            }
          }
        } catch (err) {
          console.warn('LMS fetch failed:', err);
        }

        if (!isMounted) return;

        setMediaCenterNews(allContent);
        setLoadFallback(allContent.length === 0);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading Media Center data:", err);
        setError({
          message: "Unable to load latest media items. Showing fallback content.",
        });
        setMediaCenterNews([]);
        setLoadFallback(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMediaCenterData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Get Guidelines data (only active guidelines, exclude archived)
  const getGuidelinesData = () => {
    const newsSource = mediaCenterNews.length > 0 ? mediaCenterNews : newsItems;
    
    console.log('🔍 getGuidelinesData - Total items:', newsSource.length);
    console.log('🔍 All items with types:', newsSource.map(i => ({ title: i.title, type: i.type })));
    
    const filtered = newsSource.filter((item) => {
        // Check if item is a guideline by looking at type field
        // The database has guide_type='Guideline' which gets mapped to type='Guideline'
        const itemType = (item.type || '').toLowerCase();
        const isGuideline = itemType === 'guideline' || itemType === 'guidelines';
        
        console.log(`🔍 Checking item: "${item.title}" - type: "${item.type}" - isGuideline: ${isGuideline}`);
        
        if (!isGuideline) return false;
        
        // Exclude archived guidelines
        const isArchived = item.slug === 'dq-leave-guidelines';
        
        if (!isArchived) {
          console.log('✅ Active guideline:', item.title);
        }
        
        return !isArchived;
      });
    
    console.log('🔍 Filtered guidelines:', filtered.length);
    
    return filtered
      .map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        date: item.date,
        category: "Guidelines",
        tags: item.tags || ["Guidelines"],
        source: item.newsSource || item.byline || item.author || "DQ Guidelines",
        imageUrl: item.image || undefined,
      }))
      .slice(0, 6);
  };

  // Get Learning data (courses from LMS)
  const getLearningData = () => {
    const newsSource = mediaCenterNews.length > 0 ? mediaCenterNews : newsItems;
    
    // Filter for items that came from LMS (type: 'Thought Leadership' with newsType: 'Course')
    // Since we're already filtering at DB level for status='published', we just need to identify LMS items
    const filtered = newsSource.filter((item) => {
        // LMS courses are marked with type: 'Thought Leadership' and newsType: 'Course'
        if (item.type === 'Thought Leadership' && item.newsType === 'Course') {
          return true;
        }
        
        // Fallback: check tags for 'Course'
        if (item.tags && Array.isArray(item.tags)) {
          const tagString = item.tags.join(' ').toLowerCase();
          if (tagString.includes('course')) {
            return true;
          }
        }
        
        return false;
      });
    
    return filtered
      .map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        date: item.date,
        category: item.category || "Learning",
        tags: item.tags || [item.category || "Learning"],
        source: item.newsSource || item.byline || item.author || "DQ Learning",
        imageUrl: item.image || undefined,
      }))
      .slice(0, 6);
  };


  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
            Latest DQ Developments
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mx-auto clamp-2 leading-relaxed max-w-4xl">
            Explore the latest GHC courses and guidelines to accelerate your journey at DQ.
          </p>
        </FadeInUpOnScroll>
        {/* Segmented Tabs */}
        <SegmentedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        {/* Tab Content with Fade Transition */}
        <div
          className={`transition-opacity duration-300 ${
            isTabChanging ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Loading State */}
          {isLoading && <LoadingIndicator />}

          {/* Error banner (content still shown below if fallback available) */}
          {error && !isLoading && <ErrorMessage message={error.message} />}

          {/* Guidelines Tab */}
          {activeTab === "guidelines" && !isLoading && (
            <section
              id="kh-panel-guidelines"
              aria-label="Guidelines content"
              aria-live="polite"
            >
              {loadFallback && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Showing cached guidelines while live data is unavailable.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getGuidelinesData().length === 0 ? (
                  <div className="col-span-full text-center text-gray-600">
                    No guidelines available right now.
                  </div>
                ) : (
                  getGuidelinesData().map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <NewsCard
                        content={{
                          title: item.title,
                          description: item.excerpt,
                          imageUrl: item.imageUrl,
                          tags: item.tags ?? [item.category],
                          date: item.date,
                          source: item.source,
                        }}
                        ctaLabel="Open Guideline"
                        onQuickView={() => {
                          navigate(`/guides`);
                        }}
                        onReadMore={() => {
                          navigate(`/guides`);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Learning Tab */}
          {activeTab === "learning" && !isLoading && (
            <section
              id="kh-panel-learning"
              aria-label="Learning content"
              aria-live="polite"
            >
              {loadFallback && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Showing cached learning content while live data is unavailable.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getLearningData().length === 0 ? (
                  <div className="col-span-full text-center text-gray-600">
                    No learning content available right now.
                  </div>
                ) : (
                  getLearningData().map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <NewsCard
                        content={{
                          title: item.title,
                          description: item.excerpt,
                          imageUrl: item.imageUrl,
                          tags: item.tags ?? [item.category],
                          date: item.date,
                          source: item.source,
                        }}
                        ctaLabel="Start Course"
                        onQuickView={() => {
                          navigate(`/lms`);
                        }}
                        onReadMore={() => {
                          navigate(`/lms`);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

        </div>
      </div>
      {/* Add keyframes for animations */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoom-in 0.5s ease-out forwards;
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

// Main KnowledgeHub component
const KnowledgeHub: React.FC = () => {
  // Always render without Apollo since we don't have the dependency
  return <KnowledgeHubContent />;
};

export default KnowledgeHub;
