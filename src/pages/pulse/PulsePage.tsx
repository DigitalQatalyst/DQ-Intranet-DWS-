import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar";
import { FilterIcon, XIcon, ChevronDown, MessageSquare, BarChart3, MessageCircle, Calendar, Clock, MapPin, Building, Users, HomeIcon, ChevronRightIcon } from "lucide-react";
import { CourseCardSkeleton } from "../../components/SkeletonLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";
import { FilterConfig } from "../../components/marketplace/FilterSidebar";

// Interface for database Pulse item
interface PulseItemFromDB {
  id: string;
  title: string;
  description: string | null;
  type: 'poll' | 'survey' | 'feedback';
  department: string | null;
  location_filter: string | null;
  published_at: string | null;
  closes_at: string | null;
  created_at: string;
  image_url: string | null;
  response_count: number;
  total_responses: number;
  tags: string[] | null;
  survey_type: string | null;
  feedback_type: string | null;
}

// Interface for transformed Pulse item for display
interface TransformedPulseItem {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  surveyType: string;
  type: 'poll' | 'survey' | 'feedback';
  launchDate: string;
  deadline: string;
  progress: string;
  participantsCount: number;
  imageUrl: string;
  actionButton: string;
  publishedAt: string;
  closesAt: string | null;
  createdAt: string;
  isActive: boolean;
}

export const PulsePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Items & filters state
  const [items, setItems] = useState<TransformedPulseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TransformedPulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [engagementSort, setEngagementSort] = useState<string>(''); // For Engagement Level filter

  // Mobile filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load filter options - using correct Department and Location filters
  useEffect(() => {
    // Correct Department filter options
    const departmentOptions = [
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
    ];

    // Correct Location filter options
    const locationOptions = [
      'Dubai',
      'Nairobi',
      'Riyadh'
    ];

    // Type options (poll, survey, feedback)
    const typeOptions = ['Poll', 'Survey', 'Feedback'];

    // Status options
    const statusOptions = ['Active', 'Closed'];

    // Timeframe options
    const timeframeOptions = ['Today', 'This Week', 'This Month'];

    // Engagement Level options
    const engagementOptions = ['Most Responded', 'Most Recent', 'Trending Topics'];

    const config: FilterConfig[] = [
      {
        id: 'type',
        title: 'Type',
        options: typeOptions.map(type => ({
          id: type.toLowerCase().replace(/\s+/g, '-'),
          name: type
        }))
      },
      {
        id: 'status',
        title: 'Status',
        options: statusOptions.map(status => ({
          id: status.toLowerCase().replace(/\s+/g, '-'),
          name: status
        }))
      },
      {
        id: 'timeframe',
        title: 'Timeframe',
        options: timeframeOptions.map(timeframe => ({
          id: timeframe.toLowerCase().replace(/\s+/g, '-'),
          name: timeframe
        }))
      },
      {
        id: 'engagement',
        title: 'Engagement Level',
        options: engagementOptions.map(engagement => ({
          id: engagement.toLowerCase().replace(/\s+/g, '-'),
          name: engagement
        }))
      },
      {
        id: 'department',
        title: 'Department',
        options: departmentOptions.map(dept => ({
          id: dept.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/—/g, '-'),
          name: dept
        }))
      },
      {
        id: 'location',
        title: 'Location',
        options: locationOptions.map(loc => ({
          id: loc.toLowerCase().replace(/\s+/g, '-'),
          name: loc
        }))
      }
    ];

    setFilterConfig(config);
    
    // Initialize all sections as collapsed
    const initialSections: Record<string, boolean> = {};
    config.forEach(cat => {
      initialSections[cat.id] = false;
    });
    setOpenSections(initialSections);
  }, []);

  // Load Pulse items from Supabase
  useEffect(() => {
    const fetchPulseItems = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch published pulse items from database
        const { data, error: queryError } = await supabase
          .from("pulse_items_with_stats")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (queryError) {
          throw queryError;
        }

        if (!data || data.length === 0) {
          setItems([]);
          setFilteredItems([]);
          setLoading(false);
          return;
        }

        // Transform database items to component format
        const transformedItems: TransformedPulseItem[] = data.map((item: PulseItemFromDB) => {
          // Calculate progress percentage (using response_count from view or total_responses as fallback)
          const responseCount = item.response_count || item.total_responses || 0;
          // Calculate progress based on response count
          // Since we don't have a target, we'll use a simple scale: 0-100 responses maps to 0-100%
          // This gives a visual indicator of engagement level
          const progressPercentage = Math.min(100, responseCount);

          // Determine display type label
          const getTypeLabel = () => {
            if (item.type === 'poll') return 'Poll';
            if (item.type === 'survey') return 'Survey';
            if (item.type === 'feedback') {
              // Use feedback_type if available, otherwise just "Feedback"
              if (item.feedback_type) {
                return item.feedback_type.charAt(0).toUpperCase() + item.feedback_type.slice(1) + ' Feedback';
              }
              return 'Feedback';
            }
            return item.type.charAt(0).toUpperCase() + item.type.slice(1);
          };

          // Determine action button text based on type
          const getActionButton = () => {
            if (item.type === 'poll') return 'Take Poll';
            if (item.type === 'survey') return 'Take Survey';
            if (item.type === 'feedback') return 'Give Feedback';
            return 'Participate';
          };

          // Determine if item is active (not closed)
          const now = new Date();
          const closesAt = item.closes_at ? new Date(item.closes_at) : null;
          const isActive = !closesAt || closesAt > now;

          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            department: item.department || 'N/A',
            location: item.location_filter || 'N/A',
            surveyType: getTypeLabel(),
            type: item.type,
            launchDate: item.published_at || item.created_at || new Date().toISOString(),
            deadline: item.closes_at || '',
            progress: `${progressPercentage}%`,
            participantsCount: responseCount,
            imageUrl: item.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
            actionButton: getActionButton(),
            publishedAt: item.published_at || item.created_at || new Date().toISOString(),
            closesAt: item.closes_at,
            createdAt: item.created_at,
            isActive
          };
        });

        setItems(transformedItems);
        setFilteredItems(transformedItems);
      } catch (err: any) {
        console.error('Error loading pulse items:', err);
        setError(err.message || 'Failed to load pulse items');
        setItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPulseItems();
  }, []);

  // Apply search and filter (client-side)
  useEffect(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const deptMatch = item.department.toLowerCase().includes(query);
        const locMatch = item.location.toLowerCase().includes(query);
        const typeMatch = item.surveyType.toLowerCase().includes(query);
        
        return titleMatch || descMatch || deptMatch || locMatch || typeMatch;
      });
    }

    // Apply active filters (client-side)
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

      // Apply type filter
      if (filtersByCategory['type'] && filtersByCategory['type'].length > 0) {
        filtered = filtered.filter(item => {
          return filtersByCategory['type'].some(filterType => {
            const itemType = item.type;
            const filterTypeLower = filterType.toLowerCase();
            // Map filter names to database types
            if (filterTypeLower === 'poll') return itemType === 'poll';
            if (filterTypeLower === 'survey') return itemType === 'survey';
            if (filterTypeLower === 'feedback') return itemType === 'feedback';
            return false;
          });
        });
      }

      // Apply status filter
      if (filtersByCategory['status'] && filtersByCategory['status'].length > 0) {
        filtered = filtered.filter(item => {
          return filtersByCategory['status'].some(statusFilter => {
            const statusLower = statusFilter.toLowerCase();
            if (statusLower === 'active') return item.isActive;
            if (statusLower === 'closed') return !item.isActive;
            return false;
          });
        });
      }

      // Apply timeframe filter
      if (filtersByCategory['timeframe'] && filtersByCategory['timeframe'].length > 0) {
        const now = new Date();
        filtered = filtered.filter(item => {
          const publishedDate = new Date(item.publishedAt);
          
          return filtersByCategory['timeframe'].some(timeframe => {
            const timeframeLower = timeframe.toLowerCase();
            
            if (timeframeLower === 'today') {
              const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              return publishedDate >= todayStart;
            }
            
            if (timeframeLower === 'this-week') {
              const weekStart = new Date(now);
              weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
              weekStart.setHours(0, 0, 0, 0);
              return publishedDate >= weekStart;
            }
            
            if (timeframeLower === 'this-month') {
              const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
              return publishedDate >= monthStart;
            }
            
            return false;
          });
        });
      }

      // Apply department filter
      if (filtersByCategory['department'] && filtersByCategory['department'].length > 0) {
        filtered = filtered.filter(item => 
          filtersByCategory['department'].includes(item.department)
        );
      }

      // Apply location filter
      if (filtersByCategory['location'] && filtersByCategory['location'].length > 0) {
        filtered = filtered.filter(item => 
          filtersByCategory['location'].includes(item.location)
        );
      }

      // Apply engagement level filter (this is actually a sort, handled separately)
      if (filtersByCategory['engagement'] && filtersByCategory['engagement'].length > 0) {
        const engagementFilter = filtersByCategory['engagement'][0];
        setEngagementSort(engagementFilter);
      } else {
        setEngagementSort('');
      }
    } else {
      setEngagementSort('');
    }

    // Apply engagement level sorting
    if (engagementSort) {
      if (engagementSort === 'Most Responded') {
        filtered.sort((a, b) => b.participantsCount - a.participantsCount);
      } else if (engagementSort === 'Most Recent') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return dateB - dateA;
        });
      } else if (engagementSort === 'Trending Topics') {
        // Trending: combination of recent + high response count
        filtered.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          const daysSinceA = (Date.now() - dateA) / (1000 * 60 * 60 * 24);
          const daysSinceB = (Date.now() - dateB) / (1000 * 60 * 60 * 24);
          
          // Trending score: responses / days since published (higher is better)
          const scoreA = daysSinceA > 0 ? a.participantsCount / daysSinceA : a.participantsCount;
          const scoreB = daysSinceB > 0 ? b.participantsCount / daysSinceB : b.participantsCount;
          
          return scoreB - scoreA;
        });
      }
    }

    setFilteredItems(filtered);
  }, [searchQuery, items, activeFilters, filterConfig, engagementSort]);

  // Handle filter changes
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilters(prev => {
      // Check if this is an engagement level filter
      const engagementOptions = ['Most Responded', 'Most Recent', 'Trending Topics'];
      const isEngagementFilter = engagementOptions.includes(filter);
      
      if (isEngagementFilter) {
        // For engagement level, only allow one selection at a time
        if (prev.includes(filter)) {
          // Remove if already selected
          return prev.filter(f => !engagementOptions.includes(f));
        } else {
          // Remove other engagement options and add the new one
          return [...prev.filter(f => !engagementOptions.includes(f)), filter];
        }
      } else {
        // For other filters, allow multiple selections
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
        }
      }
    });
  }, []);

  // Toggle filter section
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1" />
                <Link to="/communities" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Communities
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1" />
                <span className="text-gray-500 text-sm font-medium">Pulse</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DQ Work Communities</h1>
          <p className="text-gray-600 mb-6">
            Find and join communities to connect with other associates within the organization.
          </p>
        </div>

        {/* Current Focus Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-xs uppercase text-gray-500 font-medium mb-2">CURRENT FOCUS</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Pulse</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Share your thoughts and feedback through surveys, polls, and quick feedback sessions. Pulse is your platform for participating in organizational insights and shaping the future of DQ through direct engagement.
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap">
              Tab overview
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => navigate('/communities')}
              className={`py-4 px-4 text-sm transition-colors border-b ${
                location.pathname === '/communities' || location.pathname.startsWith('/community/')
                  ? 'border-blue-600 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
              }`}
            >
              Discussion
            </button>
            <button
              onClick={() => navigate('/marketplace/pulse')}
              className={`py-4 px-4 text-sm transition-colors border-b ${
                location.pathname === '/marketplace/pulse' || location.pathname.startsWith('/marketplace/pulse/')
                  ? 'border-blue-600 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
              }`}
            >
              Pulse
            </button>
            <button
              onClick={() => navigate('/marketplace/events')}
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

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search polls, surveys, and feedback..."
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <FilterIcon size={20} />
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {activeFilters.map(filter => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {filter}
                <button
                  onClick={() => handleFilterChange(filter)}
                  className="hover:text-blue-900"
                >
                  <XIcon size={14} />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-0">
                {filterConfig.map(category => (
                  <div key={category.id} className="border-b border-gray-100 pb-3">
                    <button
                      onClick={() => toggleSection(category.id)}
                      className="flex w-full justify-between items-center text-left font-medium text-gray-900 py-2 hover:text-gray-700 transition-colors"
                      type="button"
                    >
                      <span>{category.title}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                          openSections[category.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSections[category.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pt-1 space-y-2">
                        {category.options.map(option => (
                          <label
                            key={option.id}
                            className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.includes(option.name)}
                              onChange={() => handleFilterChange(option.name)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg mb-2">No pulse items found</p>
                <p className="text-gray-400 text-sm">
                  {activeFilters.length > 0 || searchQuery
                    ? 'Try adjusting your filters or search query'
                    : 'Check back later for new polls, surveys, and feedback'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    onClick={() => navigate(`/marketplace/pulse/detailsPage?id=${item.id}`)}
                  >
                    {/* Image Banner */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
                        }}
                      />
                      {/* Launch Date Badge */}
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-md shadow-md">
                        <span className="text-xs font-semibold text-gray-700">{formatDate(item.launchDate)}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-grow flex flex-col">
                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Survey Type */}
                      <p className="text-sm text-gray-600 mb-3">
                        {item.surveyType}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {/* Department */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Building size={14} className="mr-2 flex-shrink-0" />
                          <span>{item.department}</span>
                        </div>
                        
                        {/* Location */}
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-2 flex-shrink-0" />
                          <span className="truncate" title={item.location}>{item.location}</span>
                        </div>

                        {/* Launch Date */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-2 flex-shrink-0" />
                          <span>Launched: {formatDate(item.launchDate)}</span>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-2 flex-shrink-0" />
                          <span>Deadline: {formatDate(item.deadline)}</span>
                        </div>

                        {/* Participants Count */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-2 flex-shrink-0" />
                          <span>{item.participantsCount} participants</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{item.progress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: item.progress, backgroundColor: '#FB5535' }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/marketplace/pulse/detailsPage?id=${item.id}`);
                        }}
                        className="w-full mt-auto px-4 py-2.5 text-sm font-semibold text-white bg-dq-navy hover:bg-[#13285A] rounded-md transition-colors"
                      >
                        {item.actionButton}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="bg-white h-full w-full max-w-sm overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XIcon size={24} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {filterConfig.map(category => (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleSection(category.id)}
                      className="flex w-full justify-between items-center text-left font-medium text-gray-900 py-2"
                    >
                      <span>{category.title}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform duration-200 ${
                          openSections[category.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections[category.id] && (
                      <div className="mt-2 space-y-2">
                        {category.options.map(option => (
                          <label
                            key={option.id}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.includes(option.name)}
                              onChange={() => handleFilterChange(option.name)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

