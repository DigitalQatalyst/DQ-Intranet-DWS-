import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from './FilterSidebar.js';
import { MarketplaceGrid } from './MarketplaceGrid.js';
import { SearchBar } from '../SearchBar.js';
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon, ChevronDown } from 'lucide-react';
import { ErrorDisplay, CourseCardSkeleton } from '../SkeletonLoader.js';
import { fetchMarketplaceItems, fetchMarketplaceFilters } from '../../services/marketplace.js';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig.js';
import { MarketplaceComparison } from './MarketplaceComparison.js';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { getFallbackItems } from '../../utils/fallbackData';
import KnowledgeHubGrid from './KnowledgeHubGrid';
import { LMS_COURSES } from '@/data/lmsCourseDetails';
import { parseFacets, applyFilters } from '@/lms/filters';
import {
  LOCATION_ALLOW,
  LEVELS,
  CATEGORY_OPTS,
  DELIVERY_OPTS,
  DURATION_OPTS
} from '@/lms/config';
import GuidesFilters, { GuidesFacets } from '../guides/GuidesFilters';
import GuidesGrid from '../guides/GuidesGrid';
import { supabaseClient, supabase } from '../../lib/supabaseClient';
import { track } from '../../utils/analytics';

const LEARNING_TYPE_FILTER: FilterConfig = {
  id: 'learningType',
  title: 'Learning Type',
  options: [
    { id: 'courses', name: 'Courses' },
    { id: 'curricula', name: 'Curricula' },
    { id: 'testimonials', name: 'Testimonials' }
  ]
};

const prependLearningTypeFilter = (marketplaceType: string, configs: FilterConfig[]): FilterConfig[] => {
  if (marketplaceType !== 'courses') {
    return configs;
  }
  const hasLearningType = configs.some(config => config.id === 'learningType');
  if (hasLearningType) {
    return configs.map(config => {
      if (config.id !== 'learningType') return config;
      const options = config.options.length ? config.options : LEARNING_TYPE_FILTER.options;
      return { ...config, options };
    });
  }
  return [LEARNING_TYPE_FILTER, ...configs];
};

const COURSE_FILTER_CONFIG: FilterConfig[] = [
  {
    id: 'category',
    title: 'Course Category',
    options: CATEGORY_OPTS.map(value => ({ id: value, name: value }))
  },
  {
    id: 'delivery',
    title: 'Delivery Mode',
    options: DELIVERY_OPTS.map(value => ({ id: value, name: value }))
  },
  {
    id: 'duration',
    title: 'Duration',
    options: DURATION_OPTS.map(value => ({ id: value, name: value }))
  },
  {
    id: 'department',
    title: 'Department',
    options: [
      { id: 'DCO', name: 'DCO' },
      { id: 'DBP', name: 'DBP' },
      { id: 'HR', name: 'HR' },
      { id: 'IT', name: 'IT' },
      { id: 'Finance', name: 'Finance' }
    ]
  },
  {
    id: 'level',
    title: 'Level',
    options: LEVELS.map(level => ({ id: level.code, name: level.label }))
  },
  {
    id: 'location',
    title: 'Location/Studio',
    options: LOCATION_ALLOW.map(value => ({ id: value, name: value }))
  },
  {
    id: 'audience',
    title: 'Audience',
    options: [
      { id: 'Associate', name: 'Associate' },
      { id: 'Lead', name: 'Lead' }
    ]
  },
  {
    id: 'status',
    title: 'Status',
    options: [
      { id: 'live', name: 'Live' },
      { id: 'coming-soon', name: 'Coming Soon' }
    ]
  }
];

interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}

export interface MarketplacePageProps {
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding' | 'guides' | 'events';
  title: string;
  description: string;
  promoCards?: any[];
}

const SUBDOMAIN_BY_DOMAIN: Record<string, string[]> = {
  strategy: ['journey', 'history', 'digital-framework', 'initiatives', 'clients'],
  guidelines: ['resources', 'policies', 'design-systems'],
  blueprints: ['devops', 'dbp', 'dxp', 'dws', 'products', 'projects'],
};

const DEFAULT_GUIDE_PAGE_SIZE = 9;
const GUIDE_LIST_SELECT = [
  'id',
  'slug',
  'title',
  'summary',
  'hero_image_url',
  'last_updated_at',
  'author_name',
  'author_org',
  'is_editors_pick',
  'download_count',
  'guide_type',
  'domain',
  'function_area',
  'unit',
  'sub_domain',
  'location',
  'status',
  'complexity_level',
].join(',');

const parseFilterValues = (params: URLSearchParams, key: string): string[] =>
  (params.get(key) || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

// Interface for Supabase event data from upcoming_events view or events_v2 table
interface UpcomingEventView {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
  location_filter?: string | null; // For filtering (from events_v2 table)
  department?: string | null; // Department field for filtering (from events_v2 table)
  image_url: string | null;
  meeting_link: string | null;
  is_virtual: boolean;
  is_all_day: boolean;
  max_attendees: number | null;
  registration_required: boolean;
  registration_deadline: string | null;
  organizer_id: string;
  organizer_name: string | null;
  organizer_email: string | null;
  status: string;
  is_featured: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

// Interface for Supabase events table
interface EventsTableRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string; // DATE format: YYYY-MM-DD
  event_time: string | null; // TIME format: HH:MM:SS
  community_id: string | null;
  created_by: string | null;
  created_at: string;
}

// Interface for events stored in posts table
interface PostEventRow {
  id: string;
  title: string;
  content: string | null;
  description?: string | null;
  event_date: string | null; // TIMESTAMPTZ format
  event_location: string | null;
  post_type: string;
  community_id: string | null;
  created_by: string | null;
  created_at: string;
  tags?: string[] | null;
}

// Union type for all event sources
type SupabaseEvent = UpcomingEventView | EventsTableRow | PostEventRow;

// Interface for marketplace event format
interface MarketplaceEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  eventType: string;
  businessStage: string;
  provider: {
    name: string;
    logoUrl: string;
    description?: string;
  };
  date: string;
  time?: string;
  location: string;
  price: string;
  capacity?: string;
  details?: string[];
  tags: string[];
  imageUrl?: string;
  department?: string; // Preserve department field for filtering
}

// Transform Supabase event to marketplace event format
const transformEventToMarketplace = (event: SupabaseEvent): MarketplaceEvent => {
  let startDate: Date;
  let endDate: Date;
  let category: string;
  let location: string;
  let description: string;
  let imageUrl: string | null = null;
  let tags: string[] = [];
  let department: string | undefined = undefined;

  // Check event type and extract data accordingly
  if ('start_time' in event && 'end_time' in event) {
    // Event from upcoming_events view or events_v2 table
    const evt = event as UpcomingEventView;
    startDate = new Date(evt.start_time);
    endDate = new Date(evt.end_time);
    category = evt.category || "General";
    location = evt.location || "TBA";
    description = evt.description || "";
    imageUrl = evt.image_url;
    tags = evt.tags || [];
    // Extract department field if available (from events_v2 table)
    if ('department' in evt && evt.department) {
      department = evt.department as string;
    }
  } else if ('post_type' in event && event.post_type === 'event') {
    // Event from posts table
    const evt = event as PostEventRow;
    if (evt.event_date) {
      startDate = new Date(evt.event_date);
    } else {
      startDate = new Date(evt.created_at);
    }
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour
    category = evt.community_id ? "Community" : "General";
    location = evt.event_location || "TBA";
    description = evt.content || evt.description || "";
    tags = evt.tags || [];
  } else {
    // Event from events table
    const evt = event as EventsTableRow;
    const eventDate = evt.event_date; // YYYY-MM-DD format
    const eventTime = evt.event_time || "00:00:00"; // HH:MM:SS format
    const dateTimeString = `${eventDate}T${eventTime}`;
    startDate = new Date(dateTimeString);
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour
    category = evt.community_id ? "Community" : "General";
    location = "TBA";
    description = evt.description || "";
  }

  // Format date and time
  const dateStr = startDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Determine event type from category or tags
  const eventType = category || "General";
  
  // Default business stage
  const businessStage = "All Stages";

  // Default provider
  const provider = {
    name: "DQ Events",
    logoUrl: "/DWS-Logo.png",
    description: "Digital Qatalyst Events"
  };

  // Default price
  const price = "Free";

  return {
    id: event.id,
    title: event.title,
    description,
    category,
    eventType,
    businessStage,
    provider,
    date: dateStr,
    time: timeStr,
    location,
    price,
    tags,
    imageUrl: imageUrl || undefined,
    department, // Preserve department field for filtering
  };
};

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  title: _title,
  description: _description,
  promoCards = []
}) => {
  const isGuides = marketplaceType === 'guides';
  const isCourses = marketplaceType === 'courses';
  const isKnowledgeHub = marketplaceType === 'knowledge-hub';
  const isEvents = marketplaceType === 'events';
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getMarketplaceConfig(marketplaceType);

  // Items & filters state
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Guides facets + URL state
  const [facets, setFacets] = useState<GuidesFacets>({});
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));
  const searchStartRef = useRef<number | null>(null);

  const pageSize = Math.min(50, Math.max(1, parseInt(queryParams.get('pageSize') || String(DEFAULT_GUIDE_PAGE_SIZE), 10)));
  const currentPage = Math.max(1, parseInt(queryParams.get('page') || '1', 10));
  const totalPages = Math.max(1, Math.ceil(Math.max(totalCount, 0) / pageSize));

  // UI state
  
  // For courses: URL-based filtering
  const courseFacets = isCourses ? parseFacets(searchParams) : undefined;
  const lmsFilteredItems = isCourses
    ? applyFilters(LMS_COURSES, courseFacets || {})
    : [];
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  // Knowledge-hub specific state
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // Events filter accordion state - track which filter is expanded
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  
  // Courses: URL toggle function
  const toggleFilter = useCallback((key: string, value: string) => {
    const curr = new Set((searchParams.get(key)?.split(",").filter(Boolean)) || []);
    curr.has(value) ? curr.delete(value) : curr.add(value);
    const newParams = new URLSearchParams(searchParams);
    if (curr.size) {
      newParams.set(key, Array.from(curr).join(","));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  // Apply search query to LMS items
  const searchFilteredItems = isCourses && searchQuery
    ? lmsFilteredItems.filter(item => {
        const searchableText = [
          item.title,
          item.summary,
          item.courseCategory,
          item.deliveryMode,
          item.duration,
          item.levelCode,
          item.levelLabel,
          ...(item.locations || []),
          ...(item.audience || []),
          ...(item.department || [])
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(searchQuery.toLowerCase());
      })
    : lmsFilteredItems;
  
  // Compute filters from URL for courses
  const urlBasedFilters: Record<string, string[]> = isCourses
    ? {
        category: courseFacets?.category || [],
        delivery: courseFacets?.delivery || [],
        duration: courseFacets?.duration || [],
        level: (courseFacets?.level || []) as string[],
        department: courseFacets?.department || [],
        location: courseFacets?.location || [],
        audience: courseFacets?.audience || [],
        status: courseFacets?.status || []
      }
    : {};
  
  // Handle track parameter for newjoiner (courses)
  useEffect(() => {
    if (isCourses) {
      const track = searchParams.get('track');
      if (track === 'newjoiner') {
        const newParams = new URLSearchParams(searchParams);
        if (!newParams.get('level')) {
          newParams.set('level', 'L1,L2');
        }
        if (!newParams.get('category')) {
          newParams.set('category', 'Day in DQ');
        }
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [isCourses, searchParams, setSearchParams]);
  
  // Load filter configurations
  useEffect(() => {
    if (isCourses) {
      setFilterConfig(COURSE_FILTER_CONFIG);
      setLoading(false);
      return;
    }
  const loadFilterOptions = async () => {
      if (isGuides || isKnowledgeHub) {
        if (filterConfig.length || Object.keys(filters).length) {
          setFilterConfig([]);
          setFilters({});
        }
        return;
      }
      // Initialize filter config for events - fetch Department and Location from database
      if (isEvents) {
        const loadEventsFilters = async () => {
          try {
            // Fetch Department and Location options from database
            const [departmentResult, locationResult] = await Promise.all([
              supabase.rpc('get_filter_options', { p_filter_type: 'department', p_filter_category: 'events' }),
              supabase.rpc('get_filter_options', { p_filter_type: 'location', p_filter_category: 'events' })
            ]);

            // Build filter config with database values
            const updatedFilterConfig: FilterConfig[] = [];
            
            // Add Department filter (first) - from database
            // RPC returns: id = option_value (database value), name = option_label (display name)
            // Use opt.id (option_value) for name to ensure exact database value matching
            if (departmentResult.data && departmentResult.data.length > 0) {
              updatedFilterConfig.push({
                id: 'department',
                title: 'Department',
                options: departmentResult.data.map((opt: any) => ({
                  id: opt.id.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
                  name: opt.id // Use option_value (opt.id) for exact database value matching
                }))
              });
            } else {
              // Fallback: use config if database is empty
              const deptConfig = config.filterCategories?.find(c => c.id === 'department');
              if (deptConfig) updatedFilterConfig.push(deptConfig);
            }

            // Add Location filter (second) - from database
            if (locationResult.data && locationResult.data.length > 0) {
              updatedFilterConfig.push({
                id: 'location',
                title: 'Location',
                options: locationResult.data.map((opt: any) => ({
                  id: opt.id.toLowerCase().replace(/\s+/g, '-'),
                  name: opt.id // Use option_value (opt.id) for exact database value matching
                }))
              });
            } else {
              // Fallback: use config if database is empty
              const locConfig = config.filterCategories?.find(c => c.id === 'location');
              if (locConfig) updatedFilterConfig.push(locConfig);
            }

            // Add other filters from config (Time Range, Event Type, Delivery Mode, Duration Band)
            const otherFilters = config.filterCategories?.filter(c => 
              c.id !== 'department' && c.id !== 'location'
            ) || [];
            updatedFilterConfig.push(...otherFilters);

            setFilterConfig(updatedFilterConfig);
            console.log('Events filter config loaded:', updatedFilterConfig.length, 'categories (Department and Location from database)');
          } catch (error) {
            console.error('Error loading filter options from database, using config fallback:', error);
            // Fallback to config if database fetch fails
            if (config.filterCategories && config.filterCategories.length > 0) {
              setFilterConfig(config.filterCategories);
            }
          }
        };
        
        loadEventsFilters();
        return;
      }
      try {
        let filterOptions = await fetchMarketplaceFilters(marketplaceType);
        filterOptions = prependLearningTypeFilter(marketplaceType, filterOptions);
        setFilterConfig(filterOptions);
        const initial: Record<string, string> = {};
        filterOptions.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setFilterConfig(config.filterCategories);
        const initial: Record<string, string> = {};
        config.filterCategories.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
      }
    };
    loadFilterOptions();
  }, [marketplaceType, config, isCourses, isGuides, isKnowledgeHub, isEvents]);
  
  // Fetch items based on marketplace type
  useEffect(() => {
    const run = async () => {
      // COURSES: items come from LMS arrays / URL filters; no fetch
      if (isCourses) {
        setLoading(false);
        setError(null);
        // optional: reflect count in state for pager/UI
        setTotalCount(searchFilteredItems.length);
        setItems([]);               // not used in render for courses
        setFilteredItems([]);       // render uses searchFilteredItems when isCourses
        return;
      }

      // KNOWLEDGE HUB: use fallback data (no API)
      if (isKnowledgeHub) {
        const fallbackItems = getFallbackItems(marketplaceType);
        setItems(fallbackItems);
        setFilteredItems(fallbackItems);
        setTotalCount(fallbackItems.length);
        setLoading(false);
        return;
      }

      // EVENTS: fetch from Supabase
      if (isEvents) {
        setLoading(true);
        try {
          let data: SupabaseEvent[] | null = null;
          let error: any = null;

          // Strategy 1: Try to fetch from events_v2 table (primary source)
          try {
            const now = new Date().toISOString();
            let eventsQuery = supabaseClient
              .from("events_v2")
              .select("*")
              .eq("status", "published") // Only get published events
              .gte("start_time", now); // Only get future events

            // Apply backend filters based on activeFilters
            if (activeFilters.length > 0 && filterConfig.length > 0) {
              // Group filters by category
              const filtersByCategory: Record<string, string[]> = {};
              
              activeFilters.forEach(filterName => {
                const category = filterConfig.find(c => 
                  c.options.some(opt => opt.name === filterName)
                );
                if (category) {
                  if (!filtersByCategory[category.id]) {
                    filtersByCategory[category.id] = [];
                  }
                  filtersByCategory[category.id].push(filterName);
                }
              });

              // Apply event-type filter (maps to category column)
              // Use exact filter names: Webinar, Workshop, Seminar, Panel, Conference, Networking, Competition, Pitch Day
              if (filtersByCategory['event-type'] && filtersByCategory['event-type'].length > 0) {
                // Map exact filter names to database category values
                const categoryMap: Record<string, string> = {
                  'Webinar': 'Training',
                  'Workshop': 'Training',
                  'Seminar': 'Training',
                  'Panel': 'Internal',
                  'Conference': 'Launches',
                  'Networking': 'Internal',
                  'Competition': 'Internal',
                  'Pitch Day': 'Launches'
                };
                
                // Use exact filter names (case-sensitive)
                const categoryValues = filtersByCategory['event-type']
                  .map(name => {
                    // Match exact filter name
                    return categoryMap[name] || null;
                  })
                  .filter((value): value is string => value !== null);
                
                if (categoryValues.length > 0) {
                  // Use exact database column name: category
                  eventsQuery = eventsQuery.in('category', categoryValues);
                }
              }

              // Apply delivery-mode filter (maps to is_virtual column)
              // Use exact filter names: Onsite, Online, Hybrid
              if (filtersByCategory['delivery-mode'] && filtersByCategory['delivery-mode'].length > 0) {
                const deliveryModes = filtersByCategory['delivery-mode'];
                
                // Use exact filter names (case-sensitive)
                const hasOnline = deliveryModes.includes('Online');
                const hasOnsite = deliveryModes.includes('Onsite');

                // If only one mode selected, apply backend filter using exact database column name: is_virtual
                if (deliveryModes.length === 1) {
                  if (hasOnline) {
                    // Online = is_virtual = true
                    eventsQuery = eventsQuery.eq('is_virtual', true);
                  } else if (hasOnsite) {
                    // Onsite = is_virtual = false
                    eventsQuery = eventsQuery.eq('is_virtual', false);
                  }
                  // Hybrid requires client-side filtering (checking both is_virtual and location for hybrid indicators)
                }
                // If multiple modes selected, we'll filter client-side for OR logic
              }

              // Apply duration-band filter (calculate from start_time and end_time)
              if (filtersByCategory['duration-band'] && filtersByCategory['duration-band'].length > 0) {
                // Duration filtering requires calculating duration from start_time and end_time
                // This is complex to do in Supabase, so we'll filter client-side
                // The duration is calculated in the transformation function
              }

              // Apply time-range filter
              // Use exact filter names: Today, This Week, Next 30 Days, Custom Date Range
              // Use exact database column name: start_time
              if (filtersByCategory['time-range'] && filtersByCategory['time-range'].length > 0) {
                const timeRange = filtersByCategory['time-range'][0]; // Take first selected
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Use exact filter names (case-sensitive)
                if (timeRange === 'Today') {
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  eventsQuery = eventsQuery
                    .gte('start_time', today.toISOString())
                    .lt('start_time', tomorrow.toISOString());
                } else if (timeRange === 'This Week') {
                  const nextWeek = new Date(today);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  eventsQuery = eventsQuery
                    .gte('start_time', today.toISOString())
                    .lt('start_time', nextWeek.toISOString());
                } else if (timeRange === 'Next 30 Days') {
                  const next30Days = new Date(today);
                  next30Days.setDate(next30Days.getDate() + 30);
                  eventsQuery = eventsQuery
                    .gte('start_time', today.toISOString())
                    .lte('start_time', next30Days.toISOString());
                } else if (timeRange === 'Custom Date Range') {
                  // Custom date range would need additional UI/state to get start and end dates
                  // For now, apply no additional filter (shows all future events)
                }
              }

              // Apply department filter (backend)
              // Use exact database column name: department
              // filtersByCategory['department'] contains option.name values which should match database department values
              if (filtersByCategory['department'] && filtersByCategory['department'].length > 0) {
                const departmentValues = filtersByCategory['department'];
                // Use these values directly - they should match the database department column values
                // If loaded from database RPC, opt.id (option_value) is used as option.name
                // If loaded from config fallback, option.name might need normalization
                console.log('Applying department filter with values:', departmentValues);
                eventsQuery = eventsQuery.in('department', departmentValues);
              }

              // Apply location filter (backend)
              // Use exact database column name: location_filter
              // filtersByCategory['location'] contains option_label values which match option_value in our database
              if (filtersByCategory['location'] && filtersByCategory['location'].length > 0) {
                const locationValues = filtersByCategory['location'];
                // Use these values directly as they match the database option_value
                eventsQuery = eventsQuery.in('location_filter', locationValues);
              }
            }

            // Apply ordering
            eventsQuery = eventsQuery.order("start_time", { ascending: true });

            const queryResult = await eventsQuery;

            if (!queryResult.error && queryResult.data) {
              data = queryResult.data;
              console.log("Fetched events from events_v2 table");
            } else {
              throw queryResult.error || new Error("Events_v2 table query failed");
            }
          } catch (eventsV2Error) {
            // events_v2 table doesn't exist or has errors, try fallback strategies
            console.log("events_v2 table not available, trying fallback strategies...");
            error = eventsV2Error;

            // Strategy 2: Try to fetch from upcoming_events view
            try {
              const viewQuery = await supabaseClient
                .from("upcoming_events")
                .select("*")
                .order("start_time", { ascending: true });

              if (!viewQuery.error && viewQuery.data && viewQuery.data.length > 0) {
                data = viewQuery.data;
                console.log("Fetched events from upcoming_events view");
              } else {
                throw new Error("View not available or empty");
              }
            } catch (viewError) {
              // View doesn't exist or error, try events table
              console.log("upcoming_events view not available, trying events table...");
              
              // Strategy 3: Try events table
              try {
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
                const tableQuery = await supabaseClient
                  .from("events")
                  .select("*")
                  .gte("event_date", today) // Only get events from today onwards
                  .order("event_date", { ascending: true })
                  .order("event_time", { ascending: true });

                if (!tableQuery.error && tableQuery.data) {
                  data = tableQuery.data;
                  console.log("Fetched events from events table");
                } else {
                  throw tableQuery.error || new Error("Events table query failed");
                }
              } catch (tableError) {
                // Events table doesn't exist or has errors, try posts table
                console.log("events table not available, trying posts table with event type...");
                error = tableError;

                // Strategy 4: Fetch from posts table where post_type = 'event'
                try {
                  const now = new Date().toISOString();
                  const postsQuery = await supabaseClient
                    .from("posts")
                    .select("id, title, content, event_date, event_location, post_type, community_id, created_by, created_at, tags, status")
                    .eq("post_type", "event")
                    .eq("status", "active") // Required for RLS policy
                    .not("event_date", "is", null)
                    .gte("event_date", now) // Only get future events
                    .order("event_date", { ascending: true });

                  if (!postsQuery.error && postsQuery.data) {
                    // Transform posts to match our event interface
                    data = postsQuery.data.map((post: any) => ({
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      description: post.content,
                      event_date: post.event_date,
                      event_location: post.event_location,
                      post_type: post.post_type,
                      community_id: post.community_id,
                      created_by: post.created_by,
                      created_at: post.created_at,
                      tags: post.tags,
                    })) as PostEventRow[];
                    error = null;
                    console.log("Fetched events from posts table");
                  } else {
                    console.warn("Could not fetch events from posts table:", postsQuery.error?.message || "Unknown error");
                    throw postsQuery.error || new Error("Posts table query failed");
                  }
                } catch (postsError: any) {
                  // Check if it's a permission error (42501) or other error
                  if (postsError?.code === '42501') {
                    console.warn("Permission denied accessing posts table. Events from posts may not be available.");
                    error = null;
                    data = null;
                  } else {
                    error = postsError;
                    console.error("Error fetching events from posts table:", postsError);
                  }
                }
              }
            }
          }

          // Handle errors gracefully
          if (error && (!data || data.length === 0)) {
            if (error?.code === '42501') {
              console.warn("Permission denied: Events may require authentication or proper RLS policies.");
            } else {
              console.error("Error fetching events:", error);
            }
            // Fallback to empty state or mock data
            const fallbackItems = getFallbackItems(marketplaceType);
            setItems(fallbackItems);
            setFilteredItems(fallbackItems);
            setTotalCount(fallbackItems.length);
            setLoading(false);
            return;
          }

          if (!data || data.length === 0) {
            console.log("No events found in Supabase");
            // Fallback to mock data if no events found
            const fallbackItems = getFallbackItems(marketplaceType);
            setItems(fallbackItems);
            setFilteredItems(fallbackItems);
            setTotalCount(fallbackItems.length);
            setLoading(false);
            return;
          }

          // Transform Supabase data to marketplace format
          const marketplaceEvents = data.map(transformEventToMarketplace);

          setItems(marketplaceEvents);
          setFilteredItems(marketplaceEvents);
          setTotalCount(marketplaceEvents.length);
        } catch (err) {
          console.error("Error in fetchEvents:", err);
          // Fallback to mock data on error
          const fallbackItems = getFallbackItems(marketplaceType);
          setItems(fallbackItems);
          setFilteredItems(fallbackItems);
          setTotalCount(fallbackItems.length);
        } finally {
          setLoading(false);
        }
        return;
      }

      // GUIDES: Supabase query + facets
      if (isGuides) {
        setLoading(true);
        try {
          let q = supabaseClient.from('guides').select(GUIDE_LIST_SELECT, { count: 'exact' });

          const qStr = queryParams.get('q') || '';
          const domains     = parseFilterValues(queryParams, 'domain');
          const rawSubs     = parseFilterValues(queryParams, 'sub_domain');
          const guideTypes  = parseFilterValues(queryParams, 'guide_type');
          const units       = parseFilterValues(queryParams, 'unit');
          const locations   = parseFilterValues(queryParams, 'location');
          const statuses    = parseFilterValues(queryParams, 'status');

          const allowed = new Set<string>();
          domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowed.add(s)));
          const subDomains = allowed.size ? rawSubs.filter(v => allowed.has(v)) : [];

          if (rawSubs.length && subDomains.length !== rawSubs.length) {
            const next = new URLSearchParams(queryParams.toString());
            if (subDomains.length) next.set('sub_domain', subDomains.join(','));
            else next.delete('sub_domain');
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
            }
            setQueryParams(new URLSearchParams(next.toString()));
            setLoading(false);
            return;
          }

          if (statuses.length) q = q.in('status', statuses); else q = q.eq('status', 'Approved');
          if (qStr) q = q.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
          if (domains.length)   q = q.in('domain', domains);
          if (subDomains.length)q = q.in('sub_domain', subDomains);
          if (guideTypes.length)q = q.in('guide_type', guideTypes);
          if (units.length)     q = q.in('unit', units);
          if (locations.length) q = q.in('location', locations);

          const sort = queryParams.get('sort') || 'relevance';
          if (sort === 'updated')       q = q.order('last_updated_at', { ascending: false, nullsFirst: false });
          else if (sort === 'downloads')q = q.order('download_count',   { ascending: false, nullsFirst: false });
          else if (sort === 'editorsPick') {
            q = q.order('is_editors_pick', { ascending: false })
                .order('last_updated_at', { ascending: false, nullsFirst: false });
          } else {
            q = q.order('is_editors_pick', { ascending: false })
                .order('download_count',   { ascending: false, nullsFirst: false })
                .order('last_updated_at',  { ascending: false, nullsFirst: false });
          }

          const from = (currentPage - 1) * pageSize;
          const to   = from + pageSize - 1;

          const listPromise = q.range(from, to);
          let facetQ = supabaseClient
            .from('guides')
            .select('domain,sub_domain,guide_type,function_area,unit,location,status')
            .eq('status', 'Approved');

          if (qStr)              facetQ = facetQ.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
          if (domains.length)    facetQ = facetQ.in('domain', domains);
          if (subDomains.length) facetQ = facetQ.in('sub_domain', subDomains);
          if (guideTypes.length) facetQ = facetQ.in('guide_type', guideTypes);
          if (units.length)      facetQ = facetQ.in('unit', units);
          if (locations.length)  facetQ = facetQ.in('location', locations);
          if (statuses.length)   facetQ = facetQ.in('status', statuses);

          const [{ data: rows, count, error }, { data: facetRows, error: facetError }] = await Promise.all([
            listPromise,
            facetQ,
          ]);
          if (error) throw error;
          if (facetError) console.warn('Facet query failed', facetError);

          const mapped = (rows || []).map((r: any) => {
            const unitValue = r.unit ?? r.function_area ?? null;
            const subDomainValue = r.sub_domain ?? r.subDomain ?? null;
            return {
              id: r.id,
              slug: r.slug,
              title: r.title,
              summary: r.summary,
              heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
              // skillLevel: r.skill_level ?? r.skillLevel,
              estimatedTimeMin: r.estimated_time_min ?? r.estimatedTimeMin,
              lastUpdatedAt: r.last_updated_at ?? r.lastUpdatedAt,
              authorName: r.author_name ?? r.authorName,
              authorOrg: r.author_org ?? r.authorOrg,
              isEditorsPick: r.is_editors_pick ?? r.isEditorsPick,
              downloadCount: r.download_count ?? r.downloadCount,
              guideType: r.guide_type ?? r.guideType,
              domain: r.domain ?? null,
              functionArea: unitValue,
              unit: unitValue,
              subDomain: subDomainValue,
              location: r.location ?? null,
              status: r.status ?? null,
              complexityLevel: r.complexity_level ?? null,
            };
          });

          let out = mapped;
          if (domains.length)    out = out.filter(it => it.domain && domains.includes(it.domain));
          if (subDomains.length) out = out.filter(it => it.subDomain && subDomains.includes(it.subDomain));
          if (guideTypes.length) out = out.filter(it => it.guideType && guideTypes.includes(it.guideType));
          if (units.length)      out = out.filter(it => (it.unit || it.functionArea) && units.includes(it.unit || it.functionArea));
          if (locations.length)  out = out.filter(it => it.location && locations.includes(it.location));
          if (statuses.length)   out = out.filter(it => it.status && statuses.includes(it.status));

          if (sort === 'updated')       out.sort((a,b) => new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
          else if (sort === 'downloads')out.sort((a,b) => (b.downloadCount||0)-(a.downloadCount||0));
          else if (sort === 'editorsPick')
            out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) ||
                              new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
          else
            out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) ||
                              (b.downloadCount||0)-(a.downloadCount||0) ||
                              new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());

          const total = typeof count === 'number' ? count : out.length;
          const lastPage = Math.max(1, Math.ceil(total / pageSize));
          if (currentPage > lastPage) {
            const next = new URLSearchParams(queryParams.toString());
            if (lastPage <= 1) next.delete('page'); else next.set('page', String(lastPage));
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setQueryParams(new URLSearchParams(next.toString()));
            setLoading(false);
            return;
          }

          // facets query (unchanged)
          const countBy = (arr: any[] | null | undefined, key: string) => {
            const m = new Map<string, number>();
            for (const r of (arr || [])) { const v = (r as any)[key]; if (!v) continue; m.set(v, (m.get(v)||0)+1); }
            return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt }))
                      .sort((a,b)=> a.name.localeCompare(b.name));
          };

          const domainFacets      = countBy(facetRows, 'domain');
          const guideTypeFacets   = countBy(facetRows, 'guide_type');
          const subDomainFacetsRaw= countBy(facetRows, 'sub_domain');
          const unitFacets        = countBy(facetRows, 'unit');
          const locationFacets    = countBy(facetRows, 'location');
          const statusFacets      = countBy(facetRows, 'status');

          const allowedForFacets = new Set<string>();
          domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowedForFacets.add(s)));
          const subDomainFacets = allowedForFacets.size
            ? subDomainFacetsRaw.filter(opt => allowedForFacets.has(opt.id))
            : subDomainFacetsRaw;

          setItems(out);
          setFilteredItems(out);
          setTotalCount(total);
          setFacets({
            domain: domainFacets,
            sub_domain: subDomainFacets,
            guide_type: guideTypeFacets,
            unit: unitFacets,
            location: locationFacets,
            status: statusFacets,
          });

          const start = searchStartRef.current;
          if (start) { const latency = Date.now() - start; track('Guides.Search', { q: qStr, latency_ms: latency }); searchStartRef.current = null; }
          track('Guides.ViewList', { q: qStr, sort, page: String(currentPage) });
        } catch (e) {
          console.error('Error fetching guides:', e);
          setItems([]); setFilteredItems([]); setFacets({}); setTotalCount(0);
        } finally {
          setLoading(false);
        }
        return;
      }

      // OTHER MARKETPLACES (financial, non-financial, onboarding)
      setLoading(true);
      setError(null);
      try {
        const itemsData = await fetchMarketplaceItems(
          marketplaceType,
          Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : (v || '')])),
          searchQuery
        );
        const finalItems = itemsData?.length ? itemsData : getFallbackItems(marketplaceType);
        setItems(finalItems);
        setFilteredItems(finalItems);
        setTotalCount(finalItems.length);
      } catch (err) {
        console.error(`Error fetching ${marketplaceType} items:`, err);
        setError(`Failed to load ${marketplaceType}`);
        const fallbackItems = getFallbackItems(marketplaceType);
        setItems(fallbackItems);
        setFilteredItems(fallbackItems);
        setTotalCount(fallbackItems.length);
      } finally {
        setLoading(false);
      }
    };

    run();
    // Keep deps lean; no need to include functions like isGuides
    // Include activeFilters and filterConfig for Events to re-fetch when filters change
  }, [marketplaceType, filters, searchQuery, queryParams, isCourses, isKnowledgeHub, isEvents, currentPage, pageSize, activeFilters, filterConfig]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (isCourses) {
      toggleFilter(filterType, value);
      return;
    }
    if (isGuides) {
      // Guides filters are handled via queryParams in GuidesFilters component
      return;
    }
    setFilters(prev => {
      const current = prev[filterType];
      if (Array.isArray(current)) {
        const exists = current.includes(value);
        const nextValues = exists ? current.filter(v => v !== value) : [...current, value];
        return { ...prev, [filterType]: nextValues };
      } else {
        return { ...prev, [filterType]: value === prev[filterType] ? '' : value };
      }
    });
  }, [isCourses, isGuides, marketplaceType, toggleFilter]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    if (isCourses) {
      const newParams = new URLSearchParams();
      setSearchParams(newParams, { replace: true });
      setSearchQuery('');
    } else if (isKnowledgeHub || isEvents) {
      setActiveFilters([]);
      setSearchQuery('');
    } else if (isGuides) {
      const newParams = new URLSearchParams();
      const qs = newParams.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
      setQueryParams(newParams);
      setSearchQuery('');
    } else {
      const empty: Record<string, string> = {};
      filterConfig.forEach(c => { empty[c.id] = ''; });
      setFilters(empty);
      setSearchQuery('');
    }
  }, [isCourses, isKnowledgeHub, isEvents, isGuides, marketplaceType, filterConfig, setSearchParams]);
  
  // Knowledge Hub filter handlers
  const handleKnowledgeHubFilterChange = useCallback((filter: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  }, []);
  
  const clearKnowledgeHubFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  // Apply filters and search to events (similar to knowledge-hub)
  useEffect(() => {
    if (!isEvents) return;
    
    let filtered = [...items];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.eventType?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply active filters
    if (activeFilters.length > 0 && filterConfig.length > 0) {
      filtered = filtered.filter(item => {
        return activeFilters.every(filterName => {
          // Check if filter matches any item property
          const category = filterConfig.find(c => 
            c.options.some(opt => opt.name === filterName)
          );
          if (!category) return true;
          
          // Match based on category type
          switch (category.id) {
            case 'event-type':
              return item.eventType === filterName || item.category === filterName;
            case 'delivery-mode':
              return item.location?.toLowerCase().includes(filterName.toLowerCase()) || 
                     (filterName.toLowerCase() === 'online' && item.location?.toLowerCase().includes('online'));
            case 'department':
              // Department filtering is handled by backend query, but include client-side fallback
              // Check if item has department property that matches the filter
              return item.department === filterName || 
                     (item.department && item.department.toLowerCase() === filterName.toLowerCase());
            case 'location':
              // Location filtering is handled by backend query, but include client-side fallback
              return item.location === filterName || 
                     (item.location && item.location.toLowerCase() === filterName.toLowerCase());
            case 'cost-type':
              const price = item.price?.toLowerCase() || '';
              if (filterName === 'Free') return price.includes('free') || price === '0';
              if (filterName === 'Paid') return !price.includes('free') && price !== '0';
              return true;
            case 'business-stage':
              return item.businessStage === filterName;
            default:
              return true;
          }
        });
      });
    }
    
    setFilteredItems(filtered);
    setTotalCount(filtered.length);
  }, [isEvents, items, searchQuery, activeFilters, filterConfig]);
  
  // UI helpers
  const toggleFilters = useCallback(() => setShowFilters(prev => !prev), []);
  const toggleBookmark = useCallback((itemId: string) => {
    setBookmarkedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  }, []);
  const handleAddToComparison = useCallback((item: any) => {
    if (compareItems.length < 3 && !compareItems.some(c => c.id === item.id)) {
      setCompareItems(prev => [...prev, item]);
    }
  }, [compareItems]);
  const handleRemoveFromComparison = useCallback((itemId: string) => {
    setCompareItems(prev => prev.filter(item => item.id !== itemId));
  }, []);
  const retryFetch = useCallback(() => { setError(null); setLoading(true); }, []);
  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    const next = new URLSearchParams(queryParams.toString());
    if (clamped <= 1) next.delete('page');
    else next.set('page', String(clamped));
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setQueryParams(new URLSearchParams(next.toString()));
  }, [queryParams, totalPages]);

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${isGuides ? 'guidelines-theme' : ''}`}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors"
                aria-label="Navigate to Home"
              >
                <HomeIcon size={16} className="mr-1" aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>
            {isEvents ? (() => {
              // Determine active tab based on pathname for Events marketplace
              const isPulseTab = location.pathname === '/marketplace/pulse' || location.pathname.startsWith('/marketplace/pulse/');
              const isEventsTab = location.pathname === '/marketplace/events' || location.pathname.startsWith('/marketplace/events/');
              const isDiscussionsTab = location.pathname === '/communities' || location.pathname.startsWith('/community/');
              
              // Determine current page label
              let currentPageLabel = 'Events';
              if (isPulseTab) {
                currentPageLabel = 'Pulse';
              } else if (isDiscussionsTab) {
                currentPageLabel = 'Discussions';
              }
              
              return (
                <>
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400 mx-1" aria-hidden="true" />
                      <Link 
                        to="/communities" 
                        className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors"
                        aria-label="Navigate to DQ Work Communities"
                      >
                        DQ Work Communities
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400 mx-1" aria-hidden="true" />
                      <span className="text-gray-500 text-sm md:text-base font-medium">{currentPageLabel}</span>
                    </div>
                  </li>
                </>
              );
            })() : isGuides ? (
              <>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400 mx-1" aria-hidden="true" />
                    <span className="ml-1 text-gray-500 md:ml-2 text-sm md:text-base">Resources</span>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400 mx-1" aria-hidden="true" />
                    <span className="ml-1 text-gray-700 md:ml-2 text-sm md:text-base font-medium">Guidelines</span>
                  </div>
                </li>
              </>
            ) : (
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400 mx-1" aria-hidden="true" />
                  <span className="ml-1 text-gray-500 md:ml-2 text-sm md:text-base">{config.itemNamePlural}</span>
                </div>
              </li>
            )}
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {/* Current Focus Section and Navigation Tabs - Only for Events */}
        {isEvents && (
          <>
            {/* Current Focus Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs uppercase text-gray-500 font-medium mb-2">CURRENT FOCUS</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Events</h2>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Stay up to date with upcoming events, workshops, and team gatherings. Explore activities within DQ that encourage collaboration, growth, and innovation.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap">
                  Tab overview
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <nav className="flex" aria-label="Tabs">
                <button
                  onClick={() => {
                    // Discussion tab - routes to Communities Marketplace
                    navigate('/communities');
                  }}
                  className={`py-4 px-4 text-sm transition-colors border-b ${
                    location.pathname === '/communities' || location.pathname.startsWith('/community/')
                      ? 'border-blue-600 text-gray-900 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                  }`}
                >
                  Discussion
                </button>
                <button
                  onClick={() => {
                    // Pulse tab - routes to Pulse Marketplace
                    navigate('/marketplace/pulse');
                  }}
                  className={`py-4 px-4 text-sm transition-colors border-b ${
                    location.pathname === '/marketplace/pulse' || location.pathname.startsWith('/marketplace/pulse/')
                      ? 'border-blue-600 text-gray-900 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                  }`}
                >
                  Pulse
                </button>
                <button
                  onClick={() => {
                    // Events tab - stays on current page (Events Marketplace)
                    navigate('/marketplace/events');
                  }}
                  className={`py-4 px-4 text-sm transition-colors border-b ${
                    location.pathname === '/marketplace/events' || location.pathname.startsWith('/marketplace/events/')
                      ? 'border-blue-600 text-gray-900 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                  }`}
                >
                  Events
                </button>
              </nav>
            </div>
          </>
        )}

        {/* Search + Sort */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              searchQuery={isGuides ? (queryParams.get('q') || '') : searchQuery}
              setSearchQuery={(q: string) => {
                if (isGuides) {
                  const next = new URLSearchParams(queryParams.toString());
                  next.delete('page');
                  if (q) next.set('q', q); else next.delete('q');
                  const qs = next.toString();
                  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                  setQueryParams(new URLSearchParams(next.toString()));
                } else {
                  setSearchQuery(q);
                }
              }}
            />
          </div>
          {isGuides && (
            <select
              className="border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)] focus:border-[var(--guidelines-primary)]"
              aria-label="Sort guides"
              value={queryParams.get('sort') || 'relevance'}
              onChange={(e) => {
                const next = new URLSearchParams(queryParams.toString());
                next.delete('page');
                next.set('sort', e.target.value);
                const qs = next.toString();
                window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                setQueryParams(new URLSearchParams(next.toString()));
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="updated">Last Updated</option>
              <option value="downloads">Most Downloaded</option>
              <option value="editorsPick">Editor's Pick</option>
            </select>
          )}
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {(isCourses ? Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) : 
                 isKnowledgeHub || isEvents ? activeFilters.length > 0 :
                 isGuides ? false :
                 Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''))) && (
                <button onClick={resetFilters} className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={toggleFilters} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close filters">
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  {isGuides ? (
                    <GuidesFilters facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
                  ) : isKnowledgeHub || isEvents ? (
                    <div className="space-y-0">
                      {filterConfig.map(category => {
                        const isExpanded = expandedFilter === category.id;
                        return (
                          <div key={category.id} className="border-b border-gray-100">
                            <button
                              className="flex w-full justify-between items-center text-left font-medium text-gray-900 py-3 hover:text-gray-700 transition-colors"
                              onClick={() => setExpandedFilter(isExpanded ? null : category.id)}
                              type="button"
                              aria-expanded={isExpanded}
                            >
                              <span>{category.title}</span>
                              <ChevronDown
                                size={16}
                                className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ease-in-out ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="pb-3 space-y-2">
                                {category.options.map(option => (
                                  <div key={option.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`mobile-${category.id}-${option.id}`}
                                      checked={activeFilters.includes(option.name)}
                                      onChange={() => handleKnowledgeHubFilterChange(option.name)}
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                      htmlFor={`mobile-${category.id}-${option.id}`}
                                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                                    >
                                      {option.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <FilterSidebar
                      filters={isCourses ? urlBasedFilters : (Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v : (v ? [v] : [])])) as Record<string, string[]>)}
                      filterConfig={filterConfig}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                      isResponsive={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            {isGuides ? (
              <GuidesFilters facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {(isCourses ? Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) : 
                     isKnowledgeHub || isEvents ? activeFilters.length > 0 :
                     Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''))) && (
                    <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">Reset All</button>
                  )}
                </div>
                {isKnowledgeHub || isEvents ? (
                  <div className="space-y-0">
                    {filterConfig.map(category => {
                      const isExpanded = expandedFilter === category.id;
                      return (
                        <div key={category.id} className="border-b border-gray-100">
                          <button
                            className="flex w-full justify-between items-center text-left font-medium text-gray-900 py-3 hover:text-gray-700 transition-colors"
                            onClick={() => setExpandedFilter(isExpanded ? null : category.id)}
                            type="button"
                            aria-expanded={isExpanded}
                          >
                            <span>{category.title}</span>
                            <ChevronDown
                              size={16}
                              className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ease-in-out ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="pb-3 space-y-2">
                              {category.options.map(option => (
                                <div key={option.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`desktop-${category.id}-${option.id}`}
                                    checked={activeFilters.includes(option.name)}
                                    onChange={() => handleKnowledgeHubFilterChange(option.name)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label
                                    htmlFor={`desktop-${category.id}-${option.id}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <FilterSidebar
                    filters={isCourses ? urlBasedFilters : (Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v : (v ? [v] : [])])) as Record<string, string[]>)}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={false}
                  />
                )}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => <CourseCardSkeleton key={idx} />)}
              </div>
            ) : error && !isGuides && !isKnowledgeHub && !isEvents ? (
              <ErrorDisplay message={error} onRetry={retryFetch} />
            ) : isKnowledgeHub ? (
              <KnowledgeHubGrid
                bookmarkedItems={bookmarkedItems}
                onToggleBookmark={toggleBookmark}
                onAddToComparison={handleAddToComparison}
                searchQuery={searchQuery}
                activeFilters={activeFilters}
                onFilterChange={handleKnowledgeHubFilterChange}
                onClearFilters={clearKnowledgeHubFilters}
              />
            ) : isGuides ? (
              <>
                <GuidesGrid
                  items={filteredItems}
                  onClickGuide={(g) => {
                    const qs = queryParams.toString();
                    navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, { state: { fromQuery: qs } });
                  }}
                />
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 rounded border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <MarketplaceGrid
                items={isCourses ? searchFilteredItems.map(course => {
                  const allowedSet = new Set<string>(LOCATION_ALLOW as readonly string[]);
                  const safeLocations = (course.locations || []).filter(loc => allowedSet.has(loc));
                  return {
                    ...course,
                    locations: safeLocations.length ? safeLocations : ['Global'],
                    provider: { name: course.provider, logoUrl: '/DWS-Logo.png' },
                    description: course.summary
                  };
                }) : filteredItems}
                marketplaceType={marketplaceType}
                bookmarkedItems={bookmarkedItems}
                onToggleBookmark={toggleBookmark}
                onAddToComparison={handleAddToComparison}
                promoCards={promoCards}
              />
            )}
          </div>
        </div>

        {/* Comparison modal */}
        {showComparison && (
          <MarketplaceComparison
            items={compareItems}
            onClose={() => setShowComparison(false)}
            onRemoveItem={handleRemoveFromComparison}
            marketplaceType={marketplaceType}
          />
        )}
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default MarketplacePage;
