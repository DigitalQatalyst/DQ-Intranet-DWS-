import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BookmarkIcon, ScaleIcon, Clock, Calendar, DollarSign, MapPin, ArrowLeftIcon, StarIcon, CheckCircleIcon, ExternalLinkIcon, ChevronRightIcon, HomeIcon, FileText, BuildingIcon, ChevronLeft, ChevronRight, MoreHorizontal, XIcon, Target, Award, TrendingUp, BookOpen, Users } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
import { fetchMarketplaceItemDetails, fetchRelatedMarketplaceItems } from '../../services/marketplace';
import { ErrorDisplay } from '../../components/SkeletonLoader';
import { Link } from 'react-router-dom';
import { getFallbackItemDetails, getFallbackItems } from '../../utils/fallbackData';
import { supabaseClient } from '../../lib/supabaseClient';
import { toast } from 'sonner';
interface MarketplaceDetailsPageProps {
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding' | 'events';
  bookmarkedItems?: string[];
  onToggleBookmark?: (itemId: string) => void;
  onAddToComparison?: (item: any) => void;
}
const MarketplaceDetailsPage: React.FC<MarketplaceDetailsPageProps> = ({
  marketplaceType,
  bookmarkedItems = [],
  onToggleBookmark = () => {},
  onAddToComparison = () => {}
}) => {
  const {
    itemId
  } = useParams<{
    itemId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldTakeAction = searchParams.get('action') === 'true';
  const config = getMarketplaceConfig(marketplaceType);
  const [item, setItem] = useState<any | null>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [relatedEventsLoading, setRelatedEventsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFloatingCardVisible, setIsFloatingCardVisible] = useState(true);
  const [showStickyBottomCTA, setShowStickyBottomCTA] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const contentColumnRef = useRef<HTMLDivElement>(null);
  // Check if tabs overflow and need navigation controls
  const checkOverflow = () => {
    if (tabsRef.current && containerRef.current) {
      const scrollWidth = tabsRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth - 96; // Account for potential arrow buttons
      setShowNavigation(scrollWidth > clientWidth);
    }
  };
  useEffect(() => {
    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [config.tabs]);
  // Update floating card visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Get header height dynamically
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 80;
      setHeaderHeight(headerHeight);
      
      if (heroRef.current && contentColumnRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        const contentColumnRect = contentColumnRef.current.getBoundingClientRect();
        
        // Card height estimate (approximately 400px including padding)
        const cardHeight = 400;
        const cardBottomPosition = headerHeight + cardHeight + 20;
        
        // Check if we're within the content column bounds
        // Card should be sticky only when:
        // 1. Hero section is scrolled past the header
        // 2. Content column is still visible
        // 3. Card bottom position hasn't reached the bottom of the content column
        const isHeroScrolledPast = heroBottom <= headerHeight + 16;
        const isContentColumnVisible = contentColumnRect.top < window.innerHeight;
        const isWithinContentBounds = contentColumnRect.bottom > cardBottomPosition;
        
        // Show floating card only when within content column bounds
        setIsVisible(isHeroScrolledPast && isContentColumnVisible && isWithinContentBounds);
        
        // For mobile, we'll handle this differently with the sticky bottom CTA
        if (window.innerWidth < 1024) {
          const summaryCardBottom = summaryCardRef.current?.getBoundingClientRect().bottom || 0;
          setShowStickyBottomCTA(summaryCardBottom < 0);
        } else {
          setShowStickyBottomCTA(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    // Initial check
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  // Handle scroll for sticky bottom CTA on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (summaryCardRef.current && window.innerWidth < 1024) {
        const summaryCardBottom = summaryCardRef.current.offsetTop + summaryCardRef.current.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        // Show sticky CTA when scrolled past summary card
        setShowStickyBottomCTA(scrollPosition > summaryCardBottom + 100);
      } else {
        setShowStickyBottomCTA(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  // Clear any redirect timers when component unmounts
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<string>(config.tabs[0]?.id || 'about');
  // Generate a random rating between 4.0 and 5.0 for display purposes
  const rating = (4 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;
      setLoading(true);
      setError(null);
      // Clear any existing redirect timer
      if (redirectTimer) {
        clearTimeout(redirectTimer);
        setRedirectTimer(null);
      }
      try {
        // Try to fetch item details
        let itemData = null;
        try {
          itemData = await fetchMarketplaceItemDetails(marketplaceType, itemId);
        } catch (fetchError) {
          console.error(`Error fetching ${marketplaceType} item details:`, fetchError);
          // We'll handle this below by using fallback data
        }
        // For events, only use database data - don't fall back to mock data
        if (marketplaceType === 'events') {
          if (!itemData) {
            setError('Event not found. Please check the event ID and try again.');
            setLoading(false);
            return;
          }
          setItem(itemData);
          if (itemData && 'id' in itemData) {
            setIsBookmarked(bookmarkedItems.includes(itemData.id));
          }
          
          // Fetch related events from database (only for events marketplace)
          if (marketplaceType === 'events' && itemData && 'category' in itemData && itemData.category) {
            setRelatedEventsLoading(true);
            try {
              const { data: relatedEventsData, error: relatedError } = await supabaseClient
                .from('events_v2')
                .select('id, title, description, start_time, end_time, category, location, image_url, tags')
                .eq('status', 'published' as any)
                .eq('category', itemData.category as any) // Filter by same category
                .neq('id', itemId || '' as any) // Exclude current event
                .gte('start_time', new Date().toISOString()) // Only future events
                .order('start_time', { ascending: true })
                .limit(5); // Limit to 5 events
              
              if (!relatedError && relatedEventsData) {
                const transformedRelated = relatedEventsData.map((event: any) => ({
                  id: event.id,
                  event_title: event.title,
                  title: event.title,
                  event_description: event.description,
                  description: event.description,
                  tags: event.tags || []
                }));
                setRelatedItems(transformedRelated);
              } else {
                setRelatedItems([]);
              }
            } catch (relatedError) {
              console.error('Error fetching related events:', relatedError);
              setRelatedItems([]);
            } finally {
              setRelatedEventsLoading(false);
            }
          } else {
            // For non-events or events without category, fetch related items normally
            let relatedItemsData: any[] = [];
            try {
              if (itemData && 'id' in itemData) {
                const category = 'category' in itemData ? itemData.category : '';
                const providerName = itemData.provider && 'name' in itemData.provider ? itemData.provider.name : '';
                relatedItemsData = await fetchRelatedMarketplaceItems(marketplaceType, itemData.id, category || '', providerName || '');
              }
            } catch (relatedError) {
              console.error('Error fetching related items:', relatedError);
            }
            setRelatedItems(relatedItemsData && relatedItemsData.length > 0 ? relatedItemsData : []);
          }
        } else {
          // For other marketplace types, use fallback data if needed
          const finalItemData = itemData || getFallbackItemDetails(marketplaceType, itemId || 'fallback-1');
          if (finalItemData) {
            setItem(finalItemData);
            setIsBookmarked(bookmarkedItems.includes(finalItemData.id));
            // Fetch related items
            let relatedItemsData: any[] = [];
            try {
              if (finalItemData && 'id' in finalItemData) {
                const category = 'category' in finalItemData ? finalItemData.category : '';
                const providerName = finalItemData.provider && 'name' in finalItemData.provider ? finalItemData.provider.name : '';
                relatedItemsData = await fetchRelatedMarketplaceItems(marketplaceType, finalItemData.id, category || '', providerName || '');
              }
            } catch (relatedError) {
              console.error('Error fetching related items:', relatedError);
              // Use fallback related items on error
            }
            // Use fetched related items if available, otherwise use fallback
            setRelatedItems(relatedItemsData && relatedItemsData.length > 0 ? relatedItemsData : getFallbackItems(marketplaceType));
          } else {
            // Item not found - use generic fallback
            const genericFallback = getFallbackItemDetails(marketplaceType, 'generic-fallback');
            setItem(genericFallback);
            setError(null); // Clear any error since we're showing fallback data
            // Set a redirect timer with a longer delay (5 seconds)
            const timer = setTimeout(() => {
              navigate(config.route);
            }, 5000);
            setRedirectTimer(timer);
          }
        }
        
        // If the action parameter is true, scroll to the action section
        if (shouldTakeAction) {
          setTimeout(() => {
            const actionSection = document.getElementById('action-section');
            if (actionSection) {
              actionSection.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      } catch (err) {
        console.error(`Error in marketplace details page:`, err);
        // For events, show error instead of fallback
        if (marketplaceType === 'events') {
          setError(`Failed to load event details: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } else {
          // Use fallback data even on general errors for other types
          const fallbackItem = getFallbackItemDetails(marketplaceType, 'generic-fallback');
          setItem(fallbackItem);
          setRelatedItems(getFallbackItems(marketplaceType));
          setError(null); // Clear error since we're showing fallback data
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [itemId, marketplaceType, bookmarkedItems, shouldTakeAction, navigate, config]);


  const handleToggleBookmark = () => {
    if (item) {
      onToggleBookmark(item.id);
      setIsBookmarked(!isBookmarked);
    }
  };
  const handleAddToComparison = () => {
    if (item) {
      onAddToComparison(item);
    }
  };

  // Handle event registration for events marketplace - redirect to meeting link
  const handleEventRegistration = () => {
    if (marketplaceType !== 'events' || !item) {
      return;
    }
    // Redirect to meeting link if available
    if (item.meetingLink) {
      window.open(item.meetingLink, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Meeting link not available for this event');
    }
  };

  // Legacy function (keeping for compatibility)
  const handleEventRegistrationLegacy = async () => {
    if (marketplaceType !== 'events' || !item || !itemId) {
      return;
    }

    try {
      // Get current user from Supabase
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        toast.error('Please sign in to register for events');
        // Optionally redirect to sign in page
        // navigate('/sign-in');
        return;
      }

      // Save registration to event_registrations table
      const { error: registrationError } = await supabaseClient
        .from('event_registrations')
        .insert({
          user_id: user.id,
          event_id: itemId,
          status: 'registered'
        } as any);

      if (registrationError) {
        // Check if user is already registered
        if (registrationError.code === '23505') { // Unique constraint violation
          toast.info('You are already registered for this event');
          return;
        }
        throw new Error(`Registration failed: ${registrationError.message}`);
      }

      // Registration successful
      toast.success('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register for event');
    }
  };

  const retryFetch = () => {
    setError(null);
    // Re-fetch by triggering the useEffect
    if (itemId) {
      setLoading(true);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>;
  }
  if (error) {
    return <div className="min-h-screen flex flex-col bg-[#030F35]/5">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <nav className="flex mb-4 min-h-[24px]" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-[#030F35]/70 hover:text-[#030F35] inline-flex items-center text-sm md:text-base transition-colors" aria-label="Navigate to Home">
                  <HomeIcon size={16} className="mr-1" aria-hidden="true" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-[#030F35]/40 mx-1 flex-shrink-0" aria-hidden="true" />
                  <Link to={config.route} className="text-[#030F35]/70 hover:text-[#030F35] text-sm md:text-base font-medium transition-colors">
                    {config.itemNamePlural}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-[#030F35]/40 mx-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-[#030F35]/60 text-sm md:text-base font-medium whitespace-nowrap">Details</span>
                </div>
              </li>
            </ol>
          </nav>
          <ErrorDisplay message={error} onRetry={retryFetch} additionalMessage={redirectTimer ? `Redirecting to ${config.itemNamePlural} page in a few seconds...` : undefined} />
        </div>
        <Footer isLoggedIn={false} />
      </div>;
  }
  if (!item) {
    return <div className="min-h-screen flex flex-col bg-[#030F35]/5">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-[#030F35] mb-2">
              {config.itemName} Not Found
            </h2>
            <p className="text-[#030F35]/70 mb-4">
              The {config.itemName.toLowerCase()} you're looking for doesn't
              exist or has been removed.
            </p>
            <Link to={config.route} className="px-4 py-2 bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] text-white rounded-md hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A] transition-colors inline-block shadow-md">
              Back to {config.itemNamePlural}
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>;
  }
  // Extract display properties based on marketplace type
  const itemTitle = item.title;
  const itemDescription = item.description;
  const provider = item.provider;
  const primaryAction = marketplaceType === 'events' ? 'Join' : config.primaryCTA;
  const secondaryAction = config.secondaryCTA;
  // Extract tags based on marketplace type
  // For events, combine actual filter fields: category (if not null), location_filter (if Remote or physical), department, and tags
  const displayTags = marketplaceType === 'events' 
    ? [
        // Include category only if it exists and is not null
        ...(item.category ? [item.category] : []),
        // Include location_filter if it's "Remote" or a physical location (not virtual meeting platforms)
        ...(item.location_filter && item.location_filter !== 'TBA' && 
            (item.location_filter === 'Remote' || 
             (!item.isVirtual && !['Microsoft Teams Meeting', 'Zoom', 'Google Meet', 'WebEx'].some(platform => 
              item.location_filter.toLowerCase().includes(platform.toLowerCase())
            ))) ? [item.location_filter] : []),
        // Include department(s) - handle both array and single value
        ...(item.department ? (Array.isArray(item.department) ? item.department : [item.department]) : []),
        // Include existing tags
        ...(item.tags || [])
      ].filter(Boolean)
    : (item.tags || [item.category, marketplaceType === 'courses' ? item.deliveryMode : item.serviceType, item.businessStage].filter(Boolean));
  // Extract details for the sidebar
  const detailItems = config.attributes.map(attr => ({
    label: attr.label,
    value: item[attr.key] || 'N/A'
  })).filter(detail => detail.value !== 'N/A');
  // Extract highlights/features based on marketplace type
  const highlights = marketplaceType === 'courses' ? item.learningOutcomes || [] : item.details || [];
  // Render tab content with consistent styling
  const renderTabContent = (tabId: string) => {
    const tab = config.tabs.find(t => t.id === tabId);
    if (!tab) return null;
    // Return specific tab content based on tab ID
    switch (tabId) {
      case 'about':
        return <div className="space-y-6">
            {marketplaceType !== 'events' && (
              <p className="text-[#030F35]/70 text-lg mb-6 leading-relaxed">
                Learn more about this {config.itemName.toLowerCase()} and what it
                offers for your business.
              </p>
            )}
            <div className="prose max-w-none">
              {marketplaceType === 'events' ? (
                <div className="space-y-4">
                  {/* Event Description Box */}
                  {itemDescription && (
                    <div className="bg-[#030F35]/5 rounded-lg p-4 border border-[#030F35]/20">
                      <h3 className="text-lg font-semibold text-[#030F35] mb-4">About Event</h3>
                      <p className="text-[#030F35]/80 leading-relaxed">{itemDescription}</p>
                    </div>
                  )}
                  {/* Event Information */}
                  <div className="bg-[#030F35]/5 rounded-lg p-4 border border-[#030F35]/20">
                    <h3 className="text-lg font-semibold text-[#030F35] mb-4">Event Information</h3>
                    <div className="space-y-3">
                      {item.date && <div className="flex items-start">
                          <Calendar className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="font-semibold text-[#030F35]">Date</h4>
                            <p className="text-[#030F35]/80">{item.date}</p>
                          </div>
                        </div>}
                      {item.time && <div className="flex items-start">
                          <Clock className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="font-semibold text-[#030F35]">Time</h4>
                            <p className="text-[#030F35]/80">{item.time}</p>
                          </div>
                        </div>}
                      {item.location && <div className="flex items-start">
                          <MapPin className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="font-semibold text-[#030F35]">Location</h4>
                            <p className="text-[#030F35]/80">{item.location}</p>
                          </div>
                        </div>}
                    </div>
                  </div>
                  {/* Registration Notice */}
                  {item.meetingLink && <div className="bg-[#030F35]/5 rounded-lg p-4 border border-[#030F35]/20">
                      <h4 className="font-semibold text-[#030F35] mb-2">Join Online</h4>
                      <a href={item.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#030F35] hover:text-[#13285A] underline">
                        {item.meetingLink}
                      </a>
                    </div>}
                </div>
              ) : (
                <>
                  <p className="text-[#030F35]/80 mb-5 leading-relaxed">{itemDescription}</p>
                  {marketplaceType === 'courses' && <p className="text-[#030F35]/80">
                      This course is designed to accommodate {item.businessStage}{' '}
                      businesses, with a focus on practical applications that you
                      can implement immediately. Our experienced instructors bring
                      real-world expertise to help you navigate the challenges of
                      modern business environments.
                    </p>}
                  {marketplaceType === 'financial' && <p className="text-[#030F35]/80">
                      This financial service is tailored for businesses at the{' '}
                      {item.businessStage || 'growth'} stage, providing the
                      financial resources needed to achieve your business
                      objectives. With competitive terms and a streamlined
                      application process, you can access the funding you need
                      quickly and efficiently.
                    </p>}
                  {marketplaceType === 'non-financial' && <p className="text-[#030F35]/80">
                      This service is designed to support businesses at all stages,
                      with particular benefits for those in the{' '}
                      {item.businessStage || 'growth'} phase. Our team of experts
                      will work closely with you to ensure you receive the maximum
                      value and can implement effective solutions for your specific
                      business needs.
                    </p>}
                </>
              )}
            </div>
            {/* Key Highlights Section - Unified layout for all marketplace types */}
            <div className="bg-[#030F35]/5 rounded-lg p-4 border border-[#030F35]/20">
              <h3 className="text-xl font-bold text-[#030F35] mb-4">
                Key Highlights
              </h3>
              {/* Features/Highlights list - Consistent for all types */}
              <ul className="space-y-2">
                {highlights.map((highlight, index) => <li key={index} className="flex items-start">
                    <CheckCircleIcon size={16} className="text-[#FB5535] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[#030F35]/80">{highlight}</span>
                  </li>)}
              </ul>
            </div>
          </div>;
      case 'schedule':
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Here's the complete schedule and timeline for this course.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center mb-6 bg-[#030F35]/5 p-3 rounded-lg">
                <div className="flex-grow flex items-center">
                  <Calendar className="text-[#030F35] mr-3" size={18} />
                  <div>
                    <p className="font-medium text-gray-800">
                      Start Date:{' '}
                      <span className="text-[#030F35]">{item.startDate}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {item.duration}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FB5535]/10 text-[#FB5535] border border-[#FB5535]/20">
                    {item.deliveryMode}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Timeline
              </h3>
              <div className="space-y-4">
                <div className="relative pl-8 pb-4 border-l-2 border-[#030F35]/30">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#030F35]"></div>
                  <h4 className="font-semibold text-gray-900">Week 1</h4>
                  <p className="text-gray-700">
                    Introduction and foundation concepts
                  </p>
                </div>
                <div className="relative pl-8 pb-4 border-l-2 border-[#030F35]/30">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#030F35]"></div>
                  <h4 className="font-semibold text-gray-900">Week 2</h4>
                  <p className="text-gray-700">
                    Core principles and practical exercises
                  </p>
                </div>
                <div className="relative pl-8 pb-4 border-l-2 border-[#030F35]/30">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#030F35]"></div>
                  <h4 className="font-semibold text-gray-900">Week 3-4</h4>
                  <p className="text-gray-700">
                    Advanced techniques and final projects
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#030F35]"></div>
                  <h4 className="font-semibold text-gray-900">Final Week</h4>
                  <p className="text-gray-700">
                    Project presentations and certification
                  </p>
                </div>
              </div>
              {/* Location if applicable */}
              {item.location && <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MapPin className="text-[#030F35] mr-2" size={16} />
                    Location Details
                  </h4>
                  <p className="text-gray-700 ml-6">{item.location}</p>
                </div>}
            </div>
          </div>;
      case 'learning_outcomes':
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              What you'll learn from this course and the skills you'll develop.
            </p>
            {/* Core Learning Outcomes - simplified numbered list */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Core Learning Outcomes
              </h3>
              <ol className="space-y-3">
                {highlights.map((outcome, index) => <li key={index} className="pl-2">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">
                        {index + 1}.
                      </span>
                      <p className="text-gray-700 leading-relaxed">{outcome}</p>
                    </div>
                  </li>)}
              </ol>
            </div>
            {/* Skills You'll Gain - compact two-column grid */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Skills You'll Gain
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {['Strategic thinking and planning', 'Problem-solving techniques', 'Implementation best practices', 'Performance measurement', 'Risk assessment and mitigation', 'Communication and presentation'].map((skill, index) => <div key={index} className="flex items-center">
                    <CheckCircleIcon size={16} className="text-[#1A2E6E] mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{skill}</span>
                  </div>)}
              </div>
            </div>
            {/* Upon Completion - single subtle highlight box */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Upon Completion
              </h3>
              <p className="text-gray-700 mb-3">
                Receive a certificate of completion, gain practical skills for
                immediate implementation, and join our network of alumni and
                industry professionals.
              </p>
              <div className="text-sm text-gray-600 bg-[#030F35]/5 p-3 rounded border border-[#030F35]/20">
                Businesses report an average of 40% improvement in relevant
                metrics within 6 months of course completion.
              </div>
            </div>
          </div>;
      case 'eligibility_terms':
        // For events, show event details instead of eligibility/terms
        if (marketplaceType === 'events') {
          return <div className="space-y-6">
              <p className="text-gray-600 text-lg mb-6">
                Event details and important information.
              </p>
              {/* Event Details Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Event Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="text-[#030F35] mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Date & Time</h4>
                      <p className="text-gray-700">{item.date}</p>
                      {item.time && <p className="text-gray-700">{item.time}</p>}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-[#030F35] mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-700">{item.location}</p>
                      {item.isVirtual && item.meetingLink && <a href={item.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#030F35] hover:text-[#13285A] underline text-sm mt-1 block">
                          Join Meeting Link
                        </a>}
                    </div>
                  </div>
                  {item.capacity && <div className="flex items-start">
                      <Users className="text-[#030F35] mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-semibold text-gray-900">Capacity</h4>
                        <p className="text-gray-700">{item.capacity}</p>
                      </div>
                    </div>}
                  {item.registrationRequired && <div className="flex items-start">
                      <CheckCircleIcon className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-semibold text-gray-900">Registration</h4>
                        <p className="text-gray-700">Registration is required for this event</p>
                        {item.registrationDeadline && <p className="text-gray-600 text-sm mt-1">
                            Deadline: {new Date(item.registrationDeadline).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                          </p>}
                      </div>
                    </div>}
                </div>
              </div>
              {/* Tags Section */}
              {item.tags && item.tags.length > 0 && <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Event Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, index: number) => <span key={index} className="px-3 py-1 bg-[#030F35]/10 text-[#030F35] rounded-full text-sm font-medium">
                        {tag}
                      </span>)}
                  </div>
                </div>}
            </div>;
        }
        // For other marketplace types, show eligibility/terms
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Review eligibility requirements and terms & conditions for this
              service.
            </p>
            {/* Eligibility Section - unified card style */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Eligibility Requirements
              </h3>
              <ul className="space-y-2">
                {item.eligibilityCriteria ? item.eligibilityCriteria.map((criteria, index) => <li key={index} className="flex items-start">
                      <CheckCircleIcon size={16} className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>) : <li className="flex items-start">
                    <CheckCircleIcon size={16} className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      {item.eligibility || `Businesses at the ${item.businessStage || 'growth'} stage`}
                    </span>
                  </li>}
              </ul>
              <div className="mt-6 bg-[#030F35]/5 rounded-lg p-3">
                <h4 className="text-md font-medium text-[#030F35] mb-2">
                  Not sure if you qualify?
                </h4>
                <p className="text-gray-700 mb-3 text-sm">
                  Contact {item.provider.name} for a preliminary eligibility
                  assessment before submitting your full application.
                </p>
                <button className="text-[#030F35] text-sm font-medium hover:text-[#13285A] transition-colors flex items-center">
                  Contact Provider
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
            {/* Terms & Conditions Section - unified card style */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Terms & Conditions
              </h3>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Key Terms
              </h4>
              <p className="text-gray-700 mb-4">
                {item.keyTerms || 'Zero interest rate with a grace period of 12 months. Repayment in equal monthly installments over the loan tenure. Early settlement allowed without penalties after 24 months.'}
              </p>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Additional Terms
              </h4>
              <ul className="space-y-2">
                {item.additionalTerms ? item.additionalTerms.map((term, index) => <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">{term}</span>
                    </li>) : <>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">
                        Collateral requirements will be determined based on loan
                        amount and business risk profile
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">
                        Late payment penalties may apply as per the final loan
                        agreement
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">
                        Prepayment options available subject to terms outlined
                        in the loan agreement
                      </span>
                    </li>
                  </>}
              </ul>
            </div>
            <div className="text-sm text-gray-500 italic">
              The information provided here is a summary of key terms and
              conditions. The full terms and conditions will be provided in the
              final agreement. {item.provider.name} reserves the right to modify
              these terms at their discretion.
            </div>
          </div>;
      case 'application_process':
        // For events, show registration process
        if (marketplaceType === 'events') {
          return <div className="space-y-6">
              <p className="text-gray-600 text-lg mb-6">
                How to join this event.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  {item.meetingLink ? (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-gray-500 font-medium">1.</span>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Click Join
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            Use the "Join" button above to join the event.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-gray-500 font-medium">2.</span>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Join the Meeting
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            You'll be redirected to the meeting link to join the event.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="text-[#1A2E6E] mx-auto mb-4" size={48} />
                      <h4 className="font-medium text-gray-900 mb-2">
                        Join at Scheduled Time
                      </h4>
                      <p className="text-gray-600 text-sm">
                        This event is open to all. Simply join at the scheduled time and location.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>;
        }
        // For other marketplace types, show application process
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Follow these simple steps to complete your application.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-3">
                {item.applicationProcess ? item.applicationProcess.map((step, index) => <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">
                        {index + 1}.
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>) : <>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">1.</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Submit Application
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Complete the online application form with your
                          business details and required information.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">2.</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Document Verification
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Upload required documents for verification and wait
                          for our team to review them.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">3.</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Review & Approval
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Our team will review your application and contact you
                          with a decision within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </>}
              </div>
            </div>
          </div>;
      case 'required_documents':
        // For events, show "What to Bring"
        if (marketplaceType === 'events') {
          return <div className="space-y-6">
              <p className="text-gray-600 text-lg mb-6">
                What you might need to bring or prepare for this event.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What to Bring
                </h3>
                {item.requiredDocuments && item.requiredDocuments.length > 0 ? <div className="grid md:grid-cols-2 gap-3">
                    {item.requiredDocuments.map((doc: string, index: number) => <div key={index} className="flex items-start">
                        <FileText size={16} className="text-[#030F35] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{doc}</span>
                      </div>)}
                  </div> : <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircleIcon size={16} className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">
                        {item.isVirtual ? 'A device with internet connection and the meeting link' : 'Just yourself - no special items required'}
                      </span>
                    </div>
                    {item.meetingLink && <div className="flex items-start">
                        <CheckCircleIcon size={16} className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          Meeting link will be provided after registration
                        </span>
                      </div>}
                    {!item.isVirtual && <div className="flex items-start">
                        <CheckCircleIcon size={16} className="text-[#1A2E6E] mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          Arrive 10-15 minutes early for check-in
                        </span>
                      </div>}
                  </div>}
                {item.registrationRequired && <div className="mt-6 text-sm text-gray-700 bg-[#030F35]/5 p-3 rounded border border-[#030F35]/20">
                    <span className="font-medium text-[#030F35]">Note:</span> Make sure you've completed registration before the event. You'll receive a confirmation email with all the details.
                  </div>}
              </div>
            </div>;
        }
        // For other marketplace types, show required documents
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Prepare these documents to support your application and ensure a
              smooth process.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Required Documents
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {item.requiredDocuments ? item.requiredDocuments.map((doc, index) => <div key={index} className="flex items-start">
                      <FileText size={16} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </div>) : <>
                    <div className="flex items-start">
                      <FileText size={16} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Business Registration Certificate
                      </span>
                    </div>
                    <div className="flex items-start">
                      <FileText size={16} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Trade License</span>
                    </div>
                    <div className="flex items-start">
                      <FileText size={16} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Financial Statements (last 2 years)
                      </span>
                    </div>
                    <div className="flex items-start">
                      <FileText size={16} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Business Plan or Proposal
                      </span>
                    </div>
                  </>}
              </div>
              <div className="mt-6 text-sm text-gray-700 bg-amber-50 p-3 rounded border border-amber-100">
                <span className="font-medium text-amber-800">Note:</span> All
                documents must be submitted in PDF format. Documents in
                languages other than English or Arabic must be accompanied by
                certified translations.
              </div>
            </div>
          </div>;
      case 'provider':
        // For events, show organizer information
        if (marketplaceType === 'events') {
          return <div className="space-y-6">
              <p className="text-gray-600 text-lg mb-6">
                Learn more about the event organizer.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <img src={provider.logoUrl} alt={provider.name} className="h-16 w-16 object-contain rounded-lg max-w-16" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {provider.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Event Organizer
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  {provider.description || `${provider.name} is organizing this event.`}
                </p>
                {item.organizerEmail && <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Contact Information
                    </h4>
                    <a href={`mailto:${item.organizerEmail}`} className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                      {item.organizerEmail}
                      <ExternalLinkIcon size={16} className="ml-1" />
                    </a>
                  </div>}
                {item.tags && item.tags.length > 0 && <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      Event Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag: string, index: number) => <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {tag}
                        </span>)}
                    </div>
                  </div>}
              </div>
            </div>;
        }
        // For other marketplace types, show provider information
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Learn more about the provider and their expertise in this field.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <img src={provider.logoUrl} alt={provider.name} className="h-16 w-16 object-contain rounded-lg max-w-16" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {marketplaceType === 'courses' ? 'Leading provider of business education' : marketplaceType === 'financial' ? 'Trusted financial services provider' : 'Expert business services provider'}
                  </p>
                </div>
                <div className="md:ml-auto flex flex-col md:items-end">
                  <div className="text-sm text-gray-500">Established</div>
                  <div className="font-medium text-blue-600">
                    {item.providerEstablished || '2007'}{' '}
                    {item.providerLocation || 'UAE'}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                {provider.description || `${provider.name} is an independent, not-for-profit small and medium enterprises (SMEs) socio-economic development organization established in 2007.`}
              </p>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Areas of Expertise
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {item.providerExpertise ? item.providerExpertise.map((expertise, index) => <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {expertise}
                    </span>) : <>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      SME Financing
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      Business Advisory
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                      Entrepreneurship
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                      Financial Planning
                    </span>
                  </>}
              </div>
              <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center">
                Visit Provider Website
                <ExternalLinkIcon size={16} className="ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-sm text-gray-500 mb-1">Location</h4>
                <p className="font-medium text-gray-900">
                  {item.providerLocation || 'Abu Dhabi, UAE'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-sm text-gray-500 mb-1">Contact</h4>
                <p className="font-medium text-gray-900">
                  {item.providerContact || 'info@provider.ae'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-sm text-gray-500 mb-1">Services</h4>
                <p className="font-medium text-gray-900">
                  {item.providerServices || '20+ Financial Products'}
                </p>
              </div>
            </div>
          </div>;
      // Add other tab cases as needed
      default:
        if (tab.renderContent) {
          return <div>
              <p className="text-gray-600 text-lg mb-6">
                Additional information about this{' '}
                {config.itemName.toLowerCase()}.
              </p>
              {tab.renderContent(item, marketplaceType)}
            </div>;
        }
        return <div>
            <p className="text-gray-600 text-lg mb-6">
              Additional information about this {config.itemName.toLowerCase()}.
            </p>
            <p className="text-gray-500">Content for {tab.label} tab</p>
          </div>;
    }
  };
  // Combined SummaryCard component that works for both desktop and mobile
  const SummaryCard = ({
    isFloating = false
  }) => <div ref={isFloating ? null : summaryCardRef} className={`
        bg-white rounded-lg shadow-md border border-[#030F35]/20 overflow-hidden
        ${isFloating ? 'fixed z-[100]' : ''}
      `} style={isFloating ? {
    top: `${headerHeight + 20}px`,
    right: '2rem',
    width: '340px',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto'
  } : {}}>
      <div className="bg-[#030F35]/5 p-4 border-b border-[#030F35]/20">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg text-[#030F35]">
            {config.itemName} Details
          </h3>
          {isFloating && <button onClick={() => setIsFloatingCardVisible(false)} className="p-1 hover:bg-[#030F35]/10 rounded transition-colors text-[#030F35]/70" aria-label="Hide card">
              <XIcon size={16} />
            </button>}
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {detailItems.map((detail, index) => <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-[#030F35]/60">{detail.label}:</span>
              <span className="text-sm font-medium text-[#030F35]">
                {detail.value || 'N/A'}
              </span>
            </div>)}
        </div>
        <div className="border-t border-[#030F35]/20 pt-4 mb-4">
          <h4 className="text-sm font-medium text-[#030F35] mb-3">
            {marketplaceType === 'courses' ? 'This course includes:' : marketplaceType === 'financial' ? 'This service includes:' : 'This service includes:'}
          </h4>
          <ul className="space-y-2">
            {highlights.slice(0, 4).map((highlight, index) => <li key={index} className="flex items-start">
                <CheckCircleIcon size={14} className="text-[#FB5535] mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm text-[#030F35]/80">{highlight}</span>
              </li>)}
          </ul>
        </div>
        <button 
          id="action-section" 
          onClick={marketplaceType === 'events' ? handleEventRegistration : undefined}
          className={`w-full px-4 py-3 text-white font-bold rounded-md transition-colors shadow-md ${marketplaceType === 'events' ? '' : 'mb-3'} ${
            marketplaceType === 'events' 
              ? 'bg-[#030F35] hover:bg-[#13285A] active:bg-[#0A1F2E]' 
              : 'bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A]'
          }`}
        >
          {primaryAction}
        </button>
        {marketplaceType !== 'events' && (
          <button onClick={handleAddToComparison} className="w-full px-4 py-2.5 text-[#030F35] font-medium bg-white border border-[#030F35]/30 rounded-md hover:bg-[#030F35]/10 transition-colors flex items-center justify-center">
            <ScaleIcon size={16} className="mr-2" />
            Add to Comparison
          </button>
        )}
      </div>
    </div>;
  return <div className="bg-white min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        {/* Hero Banner - consistent header layout */}
        <div ref={heroRef} className="w-full bg-white">
          {/* For events: Breadcrumbs and banner with gradient */}
          {marketplaceType === 'events' ? (
            <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <nav className="flex pt-4 pb-2 min-h-[24px]" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                      <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors" aria-label="Navigate to Home">
                        <HomeIcon size={16} className="mr-1" aria-hidden="true" />
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                        <Link to="/communities" className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors" aria-label="Navigate to DQ Work Communities">
                          DQ Work Communities
                        </Link>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                        <Link to={config.route} className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors">
                          Events
                        </Link>
                      </div>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                        <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">
                          {itemTitle}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-4 pb-8">
                {/* Department/Category info */}
                {(item.department || item.category) && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600 font-medium">
                      {item.department || item.category || 'Digital Qatalyst Events'}
                    </span>
                  </div>
                )}
                
                {/* Title Row - Title on left, Live tag on right */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight flex-1">
                    {itemTitle}
                  </h1>
                  
                  {/* Live tag (if event is currently happening) */}
                  {(() => {
                    const startTime = item.start_time || item.startTime;
                    const endTime = item.end_time || item.endTime;
                    
                    if (startTime && endTime) {
                      try {
                        const now = new Date();
                        const start = new Date(startTime);
                        const end = new Date(endTime);
                        const isLive = now >= start && now <= end;
                        
                        if (isLive) {
                          return (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">
                              Live
                            </span>
                          );
                        }
                      } catch (e) {
                        console.error('Error parsing event dates:', e);
                      }
                    }
                    
                    if (item.status === 'live' || item.isLive) {
                      return (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">
                          Live
                        </span>
                      );
                    }
                    
                    return null;
                  })()}
                </div>
                {/* Tags - Below title */}
                {displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1 mb-4">
                    {displayTags.map((tag, index) => {
                      const tagColors = [
                        'bg-blue-100 text-blue-700 border-blue-200',
                        'bg-green-100 text-green-700 border-green-200',
                        'bg-purple-100 text-purple-700 border-purple-200',
                        'bg-pink-100 text-pink-700 border-pink-200'
                      ];
                      const colorClass = tagColors[index] || tagColors[tagColors.length - 1];
                      
                      return (
                        <span 
                          key={index} 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${colorClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {/* Description below tags */}
                <p className="text-gray-700 text-lg mb-6 max-w-4xl leading-relaxed border-b border-gray-200 pb-6">
                  The DQ Townhall is a company-wide meeting to discuss updates, share progress, celebrate achievements, and foster communication.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Breadcrumbs - on light grey background (for non-events) */}
              <div className="w-full bg-gray-50">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                  <nav className="flex pt-4 pb-3 min-h-[24px]" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                      <li className="inline-flex items-center">
                        <Link to="/" className="text-[#030F35]/70 hover:text-[#030F35] inline-flex items-center text-sm md:text-base transition-colors" aria-label="Navigate to Home">
                          <HomeIcon size={16} className="mr-1" aria-hidden="true" />
                          <span>Home</span>
                        </Link>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <ChevronRightIcon size={16} className="text-[#030F35]/40 mx-1 flex-shrink-0" aria-hidden="true" />
                          <Link to={config.route} className="text-[#030F35]/70 hover:text-[#030F35] text-sm md:text-base font-medium transition-colors">
                            {config.itemNamePlural}
                          </Link>
                        </div>
                      </li>
                      <li aria-current="page">
                        <div className="flex items-center">
                          <ChevronRightIcon size={16} className="text-[#030F35]/40 mx-1 flex-shrink-0" aria-hidden="true" />
                          <span className="text-[#030F35]/60 text-sm md:text-base font-medium whitespace-nowrap">
                            {itemTitle}
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              {/* Title Section - on light grey background (for non-events) */}
              <div className="w-full bg-gray-50">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl py-6">
                  {/* Category/Provider info */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-[#030F35]/70">{provider.name}</span>
                    {item.category && (
                      <>
                        <span className="text-[#030F35]/40">·</span>
                        <span className="text-sm text-[#030F35]/70">{item.category}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Title Row */}
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#030F35] leading-tight">
                      {itemTitle}
                    </h1>
                  </div>
                </div>
              </div>
              
              {/* Content Area - Tags and Description (for non-events) */}
              <div className="container mx-auto px-4 md:px-6 max-w-7xl py-6">
                {/* Tags - Below title, horizontally aligned */}
                {displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {displayTags.map((tag, index) => {
                      const tagColors = [
                        'bg-blue-100 text-blue-700 border-blue-200',
                        'bg-green-100 text-green-700 border-green-200',
                        'bg-purple-100 text-purple-700 border-purple-200',
                        'bg-pink-100 text-pink-700 border-pink-200'
                      ];
                      const colorClass = tagColors[index] || tagColors[tagColors.length - 1];
                      
                      return (
                        <span 
                          key={index} 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${colorClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {/* Description */}
                {itemDescription && (
                  <p className="text-[#030F35]/80 text-base mb-6 max-w-3xl leading-relaxed">
                    {itemDescription}
                  </p>
                )}
                
                {/* Ratings row - Bookmark removed for events */}
                {marketplaceType === 'courses' && (
                  <div className="flex items-center w-full mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} size={16} className={`${parseFloat(rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {rating}
                      </span>
                      <span className="mx-1.5 text-gray-500">·</span>
                      <span className="text-sm text-gray-500">
                        {reviewCount} reviews
                      </span>
                    </div>
                    <button onClick={handleToggleBookmark} className={`p-1.5 rounded-full ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ml-2`} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                      <BookmarkIcon size={18} className={isBookmarked ? 'fill-yellow-600' : ''} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* Tabs Navigation */}
        <div className="border-b border-[#030F35]/20 w-full bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div ref={containerRef} className="flex items-center w-full relative">
              {showNavigation && <button className="absolute left-0 p-2 text-[#030F35]/60 hover:text-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#030F35] focus:ring-offset-2 rounded-md transition-colors bg-white z-10" onClick={scrollLeft} aria-label="Scroll tabs left">
                  <ChevronLeft size={16} />
                </button>}
              <div ref={tabsRef} className="flex overflow-x-auto scrollbar-hide w-full" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
                {config.tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === tab.id ? 'text-[#030F35] border-[#030F35]' : 'text-[#030F35]/60 border-transparent hover:text-[#030F35] hover:border-[#030F35]/30'}`} aria-selected={activeTab === tab.id} aria-controls={`tabpanel-${tab.id}`} role="tab">
                    {tab.label}
                  </button>)}
              </div>
              {showNavigation && <>
                  <button className="absolute right-8 p-2 text-[#030F35]/60 hover:text-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#030F35] focus:ring-offset-2 rounded-md transition-colors bg-white z-10" onClick={scrollRight} aria-label="Scroll tabs right">
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute right-0">
                    <button className="p-2 text-[#030F35]/60 hover:text-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#030F35] focus:ring-offset-2 rounded-md transition-colors bg-white z-10" onClick={() => setShowTabsMenu(!showTabsMenu)} aria-label="Show all tabs menu" aria-expanded={showTabsMenu}>
                      <MoreHorizontal size={16} />
                    </button>
                    {showTabsMenu && <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowTabsMenu(false)} aria-hidden="true" />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-[#030F35]/20">
                          <div className="py-1 max-h-64 overflow-y-auto">
                            {config.tabs.map(tab => <button key={tab.id} className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeTab === tab.id ? 'bg-[#030F35]/10 text-[#030F35]' : 'text-[#030F35]/80 hover:bg-[#030F35]/5'}`} onClick={() => {
                        setActiveTab(tab.id);
                        setShowTabsMenu(false);
                      }} role="menuitem">
                                {tab.label}
                              </button>)}
                          </div>
                        </div>
                      </>}
                  </div>
                </>}
            </div>
          </div>
        </div>
        {/* Main content area with 12-column grid layout */}
        <div ref={mainContentRef} className="container mx-auto px-4 md:px-6 max-w-7xl py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Content column (~8 columns) */}
            <div ref={contentColumnRef} className="col-span-12 lg:col-span-8">
              {/* Tab Content */}
              <div className="mb-8 space-y-6">
                {config.tabs.map(tab => <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'} id={`tabpanel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`}>
                    {renderTabContent(tab.id)}
                  </div>)}
              </div>
              {/* Mobile/Tablet Summary Card - only visible on mobile/tablet */}
              <div className="lg:hidden mt-8">
                <SummaryCard isFloating={false} />
              </div>
            </div>
            {/* Summary card column (~4 columns) - visible only on desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-[96px]">
                {!isVisible && isFloatingCardVisible && <SummaryCard isFloating={false} />}
              </div>
            </div>
          </div>
        </div>
        {/* Floating card - visible when scrolled past hero section */}
        {isVisible && isFloatingCardVisible && <SummaryCard isFloating={true} />}
        {/* Related Items */}
        <section className="bg-[#030F35]/5 py-10 border-t border-[#030F35]/20">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#030F35]">
                Related {config.itemNamePlural}
              </h2>
              <a href={config.route} className="text-[#030F35] font-medium hover:text-[#13285A] flex items-center transition-colors">
                See All {config.itemNamePlural}
                <ChevronRightIcon size={16} className="ml-1" />
              </a>
            </div>
            {/* For events, fetch and display related events dynamically */}
            {marketplaceType === 'events' ? (
              relatedEventsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#030F35]"></div>
                  <p className="mt-4 text-[#030F35]/70">Loading related events...</p>
                </div>
              ) : relatedItems.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedItems.map((relatedEvent: any, index: number) => (
                      <div 
                        key={relatedEvent.id || index} 
                        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow border border-[#030F35]/10" 
                        onClick={() => {
                          if (relatedEvent.id) {
                            navigate(`/marketplace/${marketplaceType}/${relatedEvent.id}`);
                          }
                        }}
                      >
                        <h3 className="font-semibold text-[#030F35] mb-2">
                          {relatedEvent.event_title || relatedEvent.title || 'Related Event'}
                        </h3>
                        <p className="text-sm text-[#030F35]/70 line-clamp-2 mb-3">
                          {relatedEvent.event_description || relatedEvent.description || ''}
                        </p>
                        {relatedEvent.tags && relatedEvent.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {relatedEvent.tags.slice(0, 2).map((tag: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-[#030F35]/10 text-[#030F35] text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-[#030F35]/20">
                  <p className="text-[#030F35]/70">
                    No related events found in the same category.
                  </p>
                </div>
              )
            ) : relatedItems.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedItems.map(relatedItem => <div key={relatedItem.id} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow border border-[#030F35]/10" onClick={() => navigate(`/marketplace/${marketplaceType}/${relatedItem.id}`)}>
                      <div className="flex items-center mb-3">
                        <img src={relatedItem.provider.logoUrl} alt={relatedItem.provider.name} className="h-8 w-8 object-contain mr-2 rounded" />
                        <span className="text-sm text-[#030F35]/70">
                          {relatedItem.provider.name}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#030F35] mb-2">
                        {relatedItem.title}
                      </h3>
                      <p className="text-sm text-[#030F35]/70 line-clamp-2 mb-3">
                        {relatedItem.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(relatedItem.tags || []).slice(0, 2).map((tag, idx) => <span key={idx} className="px-2 py-0.5 bg-[#030F35]/10 text-[#030F35] text-xs rounded-full">
                              {tag}
                            </span>)}
                      </div>
                    </div>)}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-[#030F35]/20">
                <p className="text-[#030F35]/60">
                  No related {config.itemNamePlural.toLowerCase()} found
                </p>
              </div>
            )}
          </div>
        </section>
        {/* Sticky mobile CTA */}
        {showStickyBottomCTA && <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#030F35]/20 p-3 lg:hidden z-30 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <div className="mr-3">
                <div className="text-[#030F35] font-bold">
                  {marketplaceType === 'courses' ? item.price || 'Free' : marketplaceType === 'financial' ? item.amount || 'Apply Now' : marketplaceType === 'events' ? '' : 'Request Now'}
                </div>
                <div className="text-sm text-[#030F35]/70">
                  {item.duration || item.serviceType || ''}
                </div>
              </div>
              <button 
                onClick={marketplaceType === 'events' ? handleEventRegistration : undefined}
                className="flex-1 px-4 py-3 text-white font-bold rounded-md bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#030F35] hover:from-[#13285A] hover:via-[#1A2E6E] hover:to-[#13285A] transition-colors shadow-md"
              >
                {primaryAction}
              </button>
            </div>
          </div>}
      </main>
      <Footer isLoggedIn={false} />
    </div>;
};
export default MarketplaceDetailsPage;

