import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, CheckCircleIcon, ExternalLinkIcon, ChevronRightIcon, HomeIcon, FileText, ChevronLeft, ChevronRight, MoreHorizontal, XIcon, Plus, Minus } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
import { getServiceTabContent, getCustomTabs } from '../../utils/serviceDetailsContent';
import type { ContentBlock } from '../../utils/serviceDetailsContent';
import { fetchMarketplaceItemDetails, fetchRelatedMarketplaceItems } from '../../services/marketplace';
import { ErrorDisplay } from '../../components/SkeletonLoader';
import { Link } from 'react-router-dom';
import { getFallbackItemDetails, getFallbackItems } from '../../utils/fallbackData';
import { getAIToolDataById } from '../../utils/aiToolsData';
import { getDigitalWorkerServiceById } from '../../utils/digitalWorkerData';
import { ProcedureStages, procedureStagesConfigs } from '../../components/ProcedureStages';
import LeaveRequestForm from '../../components/marketplace/LeaveRequestForm';
import { TechSupportForm } from '../../components/marketplace/TechSupportForm';
import { INITIAL_APPROVERS } from '../../utils/mockApprovers';
import { ServiceHeroSection } from '../../components/marketplace/ServiceHeroSection';
import { ServiceDetailsSidebar } from '../../components/marketplace/ServiceDetailsSidebar';
interface MarketplaceDetailsPageProps {
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding';
  bookmarkedItems?: string[];
  onToggleBookmark?: (itemId: string) => void;
  onAddToComparison?: (item: any) => void;
}
const MarketplaceDetailsPage: React.FC<MarketplaceDetailsPageProps> = ({
  marketplaceType,
  bookmarkedItems = [],
  onToggleBookmark: _onToggleBookmark = (item) => {
    console.log('Toggle bookmark:', item)
  },
  onAddToComparison: _onAddToComparison = (item) => {
    console.log('Add to comparison:', item)
  }
}) => {
  const {
    itemId
  } = useParams<{
    itemId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldTakeAction = searchParams.get('action') === 'true';
  const serviceTab = searchParams.get('tab'); // Get tab from URL for Services Center
  const config = getMarketplaceConfig(marketplaceType);
  
  // Helper to get tab label
  const getTabLabel = (tab: string | null): string => {
    if (!tab) return '';
    const tabMap: Record<string, string> = {
      'technology': 'Technology',
      'business': 'Employee Services',
      'digital_worker': 'Digital Worker',
      'prompt_library': 'Prompt Library',
      'ai_tools': 'AI Tools'
    };
    return tabMap[tab] || '';
  };
  
  // Helper to get back URL with tab preserved
  const getBackUrl = (): string => {
    if (marketplaceType === 'non-financial' && serviceTab) {
      return `${config.route}?tab=${serviceTab}`;
    }
    return config.route;
  };
  const [item, setItem] = useState<any | null>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [_isBookmarked, _setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showStickyBottomCTA, setShowStickyBottomCTA] = useState(false);
  // FLOATING CARD STATE REMOVED:
  // Removed isVisible, isFloatingCardVisible, and headerHeight state variables
  // as they were only used for the floating sidebar behavior which has been removed.
  // To restore floating behavior, add back:
  // const [isVisible, setIsVisible] = useState(false);
  // const [isFloatingCardVisible, setIsFloatingCardVisible] = useState(true);
  // const [headerHeight, setHeaderHeight] = useState(80);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isTechSupportFormOpen, setIsTechSupportFormOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
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
  }, [item]);
  // FLOATING CARD SCROLL HANDLER REMOVED:
  // Previously, this handler managed floating card visibility based on scroll position.
  // The floating card behavior has been removed, so this handler is no longer needed.
  // The sticky bottom CTA is now handled by the handler below.
  // To restore floating behavior, add back the scroll detection logic that sets isVisible state.
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
  // Check for custom tabs for this service
  const customTabs = item ? getCustomTabs(marketplaceType, item.id) : undefined;
  const tabsToUse = customTabs || config.tabs;
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<string>(config.tabs[0]?.id || 'about');
  
  // Update active tab when custom tabs are loaded
  useEffect(() => {
    if (customTabs && customTabs.length > 0) {
      setActiveTab(customTabs[0].id);
    }
  }, [customTabs]);
  // Generate a random rating between 4.0 and 5.0 for display purposes
  // const rating = (4 + Math.random()).toFixed(1);
  // const reviewCount = Math.floor(Math.random() * 50) + 10;
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
        // If item data is available, use it, otherwise use fallback data
        const finalItemData = itemData || getFallbackItemDetails(marketplaceType, itemId || 'fallback-1');
        if (finalItemData) {
          setItem(finalItemData);
          // setIsBookmarked(bookmarkedItems.includes(finalItemData.id));
          // Fetch related items
          let relatedItemsData: any[] = [];
          try {
            relatedItemsData = await fetchRelatedMarketplaceItems(marketplaceType, finalItemData.id, finalItemData.category || '', finalItemData.provider?.name || '');
          } catch (relatedError) {
            console.error('Error fetching related items:', relatedError);
            // Use fallback related items on error
          }
          // Use fetched related items if available, otherwise use fallback
          setRelatedItems(relatedItemsData && relatedItemsData.length > 0 ? relatedItemsData : getFallbackItems(marketplaceType));
          if (shouldTakeAction) {
            setTimeout(() => {
              const actionSection = document.getElementById('action-section');
              if (actionSection) {
                actionSection.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }, 100);

            // REMOVED: Auto-open Leave Application form
            // if (finalItemData.id === '13') {
            //   // Leave application
            //   setIsRequestFormOpen(true);
            // }

            // REMOVED: Auto-open TechSupportForm
            // else if (marketplaceType === 'non-financial' && ['1', '2', '3'].includes(finalItemData.id)) {
            //   // IT Support Form, Support Charter Template, IT Support Walkthrough
            //   setIsTechSupportFormOpen(true);
            // }
          }
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
      } catch (err) {
        console.error(`Error in marketplace details page:`, err);
        // Use fallback data even on general errors
        const fallbackItem = getFallbackItemDetails(marketplaceType, 'generic-fallback');
        setItem(fallbackItem);
        setRelatedItems(getFallbackItems(marketplaceType));
        setError(null); // Clear error since we're showing fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [itemId, marketplaceType, bookmarkedItems, shouldTakeAction, navigate, config]);

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
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex-grow">
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
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link to={getBackUrl()} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    {config.itemNamePlural}
                  </Link>
                </div>
              </li>
              {marketplaceType === 'non-financial' && serviceTab && getTabLabel(serviceTab) && (
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link to={getBackUrl()} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      {getTabLabel(serviceTab)}
                    </Link>
                  </div>
                </li>
              )}
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">Details</span>
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
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              {config.itemName} Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The {config.itemName.toLowerCase()} you're looking for doesn't
              exist or has been removed.
            </p>
            <Link to={config.route} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
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
  const isPromptLibrary = item.id === '17' || item.category === 'Prompt Library';
  const isAITool = item.category === 'AI Tools';
  const isDigitalWorker = item.category === 'Digital Worker';
  const isLeaveApplication = item.id === '13';
  const isITSupportService = marketplaceType === 'non-financial' && ['1', '2', '3'].includes(item.id);
  const primaryAction =
    isLeaveApplication ? 'Apply For Leave'
    : isPromptLibrary ? 'View Prompt'
    : isDigitalWorker ? 'View Details'
    : isAITool ? 'Request Tool'
    : config.primaryCTA;
  // const secondaryAction = config.secondaryCTA;
  // Extract details for the sidebar
  const detailItems = config.attributes.map(attr => ({
    label: attr.label,
    value: item[attr.key] || 'N/A'
  })).filter(detail => detail.value !== 'N/A');
  // Extract highlights/features based on marketplace type
  const highlights = marketplaceType === 'courses' ? item.learningOutcomes || [] : item.details || [];
  // Render tab content with consistent styling
  // Code block component with copy functionality
  const CodeBlock: React.FC<{ code: string; language?: string; title?: string }> = ({ code, language, title }) => {
    const [copied, setCopied] = React.useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="mb-6 relative">
        {title && (
          <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300">
            <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
          </div>
        )}
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-b-lg overflow-x-auto text-sm leading-relaxed">
            <code className={language ? `language-${language}` : ''}>{code}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Accordion component for FAQs
  const AccordionBlock: React.FC<{ items: Array<{ question: string; answer: string }> }> = ({ items }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div className="space-y-4 mb-6">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-lg overflow-hidden transition-all duration-300 ease-in border-2"
              style={{ 
                borderColor: isOpen ? '#030F35' : '#E5E7EB',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left transition-all duration-300 ease-in"
                style={isOpen ? { 
                  backgroundColor: '#030F35',
                  color: 'white'
                } : { 
                  backgroundColor: 'white',
                  color: '#374151' 
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <span className="text-base font-medium pr-4">
                  {item.question}
                </span>
                <div 
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in"
                  style={isOpen ? { backgroundColor: 'white' } : { backgroundColor: '#E5E7EB' }}
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" style={{ color: '#030F35' }} />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in"
                style={{
                  maxHeight: isOpen ? '500px' : '0px',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="px-5 pb-5 pt-2.5 bg-white">
                  <p className="text-gray-600 text-base leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBlocks = (blocks: ContentBlock[]) => {
    return (blocks || []).map((block, idx) => {
      if (block.type === 'p') {
        return <p key={idx} className="text-gray-700 text-base leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: block.text }}></p>;
      }
      if (block.type === 'ol') {
        return <ol key={idx} className="list-decimal pl-6 space-y-3 text-gray-700 mb-4 text-base">
            {block.items.map((it, i) => <li key={i} className="pl-2 leading-relaxed">{it}</li>)}
          </ol>;
      }
      if (block.type === 'ul') {
        return <ul key={idx} className="list-disc pl-6 space-y-3 text-gray-700 mb-4 text-base">
            {block.items.map((it, i) => <li key={i} className="pl-2 leading-relaxed">{it}</li>)}
          </ul>;
      }
      if (block.type === 'iframe') {
        return <div key={idx} className="mb-6">
            <iframe
              src={block.src}
              width={block.width || '640'}
              height={block.height || '360'}
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              title={block.title || 'Embedded video'}
              className="rounded-lg shadow-md"
            />
          </div>;
      }
      if (block.type === 'accordion') {
        return <AccordionBlock key={idx} items={block.items || []} />;
      }
      if (block.type === 'code') {
        return <CodeBlock key={idx} code={block.code} language={block.language} title={block.title} />;
      }
      if (block.type === 'procedure_stages') {
        const config = procedureStagesConfigs[block.configKey as keyof typeof procedureStagesConfigs];
        if (config) {
          return <ProcedureStages key={idx} config={{ ...config, title: '' }} className="my-6" />;
        }
        return null;
      }
      return null;
    });
  };
  const renderTabContent = (tabId: string) => {
    const tab = tabsToUse.find(t => t.id === tabId);
    if (!tab) return null;
    
    // Special handling for AI Tools - MUST BE FIRST before generic content
    if (item?.category === 'AI Tools') {
      const toolData = getAIToolDataById(item?.id);
      
      if (toolData) {
        // About Tab for AI Tools
        if (tabId === 'about') {
          return <div className="space-y-8">
              {/* Tool Description */}
              <div className="text-gray-700 text-lg leading-relaxed mb-4">
                {itemDescription}
              </div>
              
              {/* Key Features Section */}
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Key Features Included</h4>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  {toolData.features.keyFeatures.map((feature, index) => (
                    <div key={index} className="group flex items-start gap-3 rounded-xl bg-white p-4 border border-gray-100 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>;
        }
        
        // System Requirements Tab for AI Tools
        if (tabId === 'system_requirements') {
          const requirements = toolData.systemRequirements;

          return (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">System Requirements</h2>
                <p className="text-sm text-gray-600">
                  Ensure your system meets these specifications for optimal {toolData.name} performance
                </p>
              </div>

              {/* Minimum Requirements */}
              <div className="border-l-4 bg-white p-5 rounded-r-lg shadow-sm" style={{ borderLeftColor: '#FB5535' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Minimum Requirements</h3>
                <ul className="space-y-2.5">
                  {Object.entries(requirements.minimum).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase w-24 flex-shrink-0 pt-0.5">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-700 flex-1">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Requirements */}
              <div className="border-l-4 bg-white p-5 rounded-r-lg shadow-sm" style={{ borderLeftColor: '#030F35' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Requirements</h3>
                <ul className="space-y-2.5">
                  {Object.entries(requirements.recommended).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase w-24 flex-shrink-0 pt-0.5">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-700 flex-1">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Notes */}
              {requirements.additionalNotes && requirements.additionalNotes.length > 0 && (
                <div className="border-l-4 border-gray-400 bg-white p-5 rounded-r-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                  <ul className="space-y-2">
                    {requirements.additionalNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }
        
        // Licenses Tab for AI Tools
        if (tabId === 'licenses') {
          const content = getServiceTabContent(marketplaceType, item?.id, tabId);
          
          return <div className="space-y-8">
              {/* Intro Text */}
              {content?.blocks && content.blocks.length > 0 && content.blocks[0].type === 'p' && (
                <div className="text-gray-700 text-lg leading-relaxed">
                  {content.blocks[0].text}
                </div>
              )}
              
              {/* License Status Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Subscription Status Card */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-400/20 blur-3xl"></div>
                  <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl"></div>
                  
                  <div className="absolute right-4 top-4 opacity-5">
                    <svg className="h-24 w-24 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subscription Status</p>
                        <p className="text-xs text-gray-500 mt-0.5">Current License State</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-4xl font-black text-green-700">{toolData.license.subscriptionStatus}</p>
                      <div className="flex h-3 w-3 items-center justify-center">
                        <span className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative h-3 w-3 rounded-full bg-green-600 shadow-lg shadow-green-500/50"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-green-800 bg-green-100/50 rounded-lg px-3 py-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Fully operational & ready to use</span>
                    </div>
                  </div>
                </div>
                
                {/* Expiry Date Card */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl"></div>
                  <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl"></div>
                  
                  <div className="absolute right-4 top-4 opacity-5">
                    <svg className="h-24 w-24" style={{ color: '#1A2E6E' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ 
                        background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)',
                        boxShadow: '0 10px 25px -5px rgba(26, 46, 110, 0.5)'
                      }}>
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Expiry Date</p>
                        <p className="text-xs text-gray-500 mt-0.5">License Validity</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-4xl font-black" style={{ color: '#1A2E6E' }}>{toolData.license.expiryDate}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-blue-900 bg-blue-100/50 rounded-lg px-3 py-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">No expiration - continuous access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>;
        }
        
        // Visit Site Tab for AI Tools
        if (tabId === 'visit_site') {
          const content = getServiceTabContent(marketplaceType, item?.id, tabId);
          const urlField = content?.action?.urlField;
          const computedUrl = (urlField && item && item[urlField]) || content?.action?.fallbackUrl || toolData.homepage || '#';
          
          return <div className="space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                <div className="relative px-8 py-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-1">{toolData.name}</h3>
                        <p className="text-blue-100 text-sm">Official Website</p>
                      </div>
                    </div>
                    <a 
                      href={computedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-blue-50 text-gray-900 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-xl"
                    >
                      Visit Website
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Description */}
              {content?.blocks && content.blocks.length > 0 && (
                <div className="text-gray-700 text-lg leading-relaxed">
                  {renderBlocks(content.blocks)}
                </div>
              )}
            </div>;
        }
      }
    }
    
    // Check if this is a custom tab with its own content
    const content = getServiceTabContent(marketplaceType, item?.id, tabId);
    if (content) {
      // Special handling for visit_site tab
      if (tabId === 'visit_site') {
        const urlField = content.action?.urlField;
        const computedUrl = (urlField && item && item[urlField]) || content.action?.fallbackUrl || '#';
        
        return <div className="space-y-8">
            <div className="prose max-w-none">
              {content.heading && <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">{content.heading}</h2>}
              {renderBlocks(content.blocks || [])}
            </div>
            <div className="pt-4">
              <button 
                id="action-section" 
                className="px-6 py-3.5 text-white text-base font-bold rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2" 
                style={{ backgroundColor: '#030F35' }} 
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')} 
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')} 
                onClick={() => window.open(computedUrl, '_blank', 'noopener,noreferrer')}
              >
                {content.action?.label || 'Visit Website'}
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </button>
            </div>
          </div>;
      }
      
      // Render content with action button if available (skip for leave applications as they use sidebar button)
      return <div className="space-y-8">
          <div className="prose max-w-none">
            {content.heading && <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">{content.heading}</h2>}
            {renderBlocks(content.blocks || [])}
          </div>
          {content.action && content.action.label !== 'Apply For Leave' && <div className="pt-4">
              <button id="action-section" className="px-6 py-3.5 text-white text-base font-bold rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" style={{ backgroundColor: '#030F35' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')} onClick={() => {
              const urlField = content.action?.urlField;
              const computedUrl = (urlField && item && item[urlField]) || content.action?.fallbackUrl || '#';
              window.open(computedUrl, '_blank', 'noopener');
          }}>
                {content.action.label}
              </button>
            </div>}
        </div>;
    }
    
    // Special handling for Digital Worker services
    if (item?.category === 'Digital Worker') {
      const dwService = getDigitalWorkerServiceById(item?.id);
      
      if (dwService) {
        // About Tab for Digital Worker
        if (tabId === 'about') {
          return <div className="space-y-8">
              {/* Overview Text */}
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {dwService.about.overview}
              </div>
              
              {/* Key Highlights Section */}
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Key Highlights</h4>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  {dwService.keyHighlights.map((highlight, index) => (
                    <div key={index} className="group flex items-start gap-3 rounded-xl bg-white p-4 border border-gray-100 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>;
        }
        
        // Requirements Tab for Digital Worker
        if (tabId === 'requirements') {
          return (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Requirements</h2>
                <p className="text-sm text-gray-600">
                  Ensure these requirements are met before implementing {dwService.title}
                </p>
              </div>

              {/* Requirements List */}
              <div className="border-l-4 bg-white p-6 rounded-r-lg shadow-sm" style={{ borderLeftColor: '#030F35' }}>
                <ul className="space-y-4">
                  {dwService.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md mt-0.5" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 flex-1 leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }
        
        // Tools Tab for Digital Worker
        if (tabId === 'tools') {
          return (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tools & Technologies</h2>
                <p className="text-sm text-gray-600">
                  Technologies and platforms used in this service
                </p>
              </div>

              {/* Tools Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dwService.tools.map((tool, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300">
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl"></div>
                    
                    <div className="relative flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 font-semibold leading-relaxed">{tool}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        
        // Sample Use Case Tab for Digital Worker
        if (tabId === 'sample_use_case') {
          return (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sample Use Case</h2>
                <p className="text-sm text-gray-600">
                  Real-world implementation scenario for {dwService.title}
                </p>
              </div>

              {/* Use Case Steps */}
              <div className="space-y-4">
                {dwService.sampleUseCase.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      }
    }
    
    // Return specific tab content based on tab ID for non-custom tabs
    switch (tabId) {
      case 'licenses': {
        // Special rendering for AI tools licenses tab
        const isAITool = item?.category === 'AI Tools';
        if (isAITool) {
          const content = getServiceTabContent(marketplaceType, item?.id, tabId);
          const toolData = getAIToolDataById(item?.id);
          
          return <div className="space-y-8">
              {/* Hero Section with Tool Name */}
              <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                <div className="relative px-8 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-1">{toolData?.name || item?.title}</h3>
                        <p className="text-blue-100 text-sm">License Information</p>
                      </div>
                    </div>
                    <a 
                      href={toolData?.homepage || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
                    >
                      Visit Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Intro Text */}
              {content?.blocks && content.blocks.length > 0 && (
                <div className="text-gray-700 text-lg leading-relaxed">
                  {renderBlocks(content.blocks)}
                </div>
              )}
              
              {/* License Status Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Subscription Status Card */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  {/* Decorative Elements */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-400/20 blur-3xl"></div>
                  <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl"></div>
                  
                  {/* Icon Background */}
                  <div className="absolute right-4 top-4 opacity-5">
                    <svg className="h-24 w-24 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subscription Status</p>
                        <p className="text-xs text-gray-500 mt-0.5">Current License State</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-4xl font-black text-green-700">{toolData?.license.subscriptionStatus || 'Active'}</p>
                      <div className="flex h-3 w-3 items-center justify-center">
                        <span className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative h-3 w-3 rounded-full bg-green-600 shadow-lg shadow-green-500/50"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-green-800 bg-green-100/50 rounded-lg px-3 py-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Fully operational & ready to use</span>
                    </div>
                  </div>
                </div>
                
                {/* Expiry Date Card */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  {/* Decorative Elements */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl"></div>
                  <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl"></div>
                  
                  {/* Icon Background */}
                  <div className="absolute right-4 top-4 opacity-5">
                    <svg className="h-24 w-24" style={{ color: '#1A2E6E' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ 
                        background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)',
                        boxShadow: '0 10px 25px -5px rgba(26, 46, 110, 0.5)'
                      }}>
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Expiry Date</p>
                        <p className="text-xs text-gray-500 mt-0.5">License Validity</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-4xl font-black" style={{ color: '#1A2E6E' }}>{toolData?.license.expiryDate || 'N/A'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-blue-900 bg-blue-100/50 rounded-lg px-3 py-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">No expiration - continuous access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features Section */}
              {toolData?.features && (
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Key Features Included</h4>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    {toolData.features.keyFeatures.map((feature, index) => (
                      <div key={index} className="group flex items-start gap-3 rounded-xl bg-white p-4 border border-gray-100 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Info Banner */}
              <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="mb-2 text-lg font-bold text-blue-900">License Management</h5>
                    <p className="text-blue-800 leading-relaxed">
                      Your license remains active as long as you are actively using {toolData?.shortName || 'the tool'} and remain employed at DQ. 
                      Inactive licenses may be reallocated after 60 days of non-use. For questions about your license status or to request 
                      access, contact the Digital Innovation team.
                    </p>
                  </div>
                </div>
              </div>
            </div>;
        }
        // Fallback to default rendering for non-AI tools
        break;
      }
      case 'submit_request': {
        const content = getServiceTabContent(marketplaceType, item?.id, tabId);
        const urlField = content?.action?.urlField;
        const computedUrl = (urlField && item && item[urlField]) || content?.action?.fallbackUrl || '#';
        
        // Check if this is a prompt library item (service 17)
        const isPromptLibrary = item?.id === '17' || item?.category === 'Prompt Library';
        
        return <div className="space-y-6">
            <div className="prose max-w-none">
              {content?.heading && <h3 className="text-xl font-bold text-gray-900 mb-2">{content.heading}</h3>}
              {renderBlocks(content?.blocks || [])}
            </div>
            {!isPromptLibrary && content?.action && <div>
                <button 
                  id="action-section" 
                  className="px-4 py-3 text-white font-bold rounded-md transition-colors shadow-md" 
                  style={{ backgroundColor: '#030F35' }} 
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')} 
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')} 
                  onClick={() => {
                    if (isITSupportService) {
                      setIsTechSupportFormOpen(true);
                    } else {
                      window.open(computedUrl, '_blank', 'noopener');
                    }
                  }}
                >
                  {content.action.label || 'Submit Request'}
                </button>
              </div>}
          </div>;
      }
      case 'self_service_faq': {
        const content = getServiceTabContent(marketplaceType, item?.id, tabId);
        return <div className="space-y-6">
            <div className="prose max-w-none">
              {content?.heading && <h3 className="text-xl font-bold text-gray-900 mb-2">{content.heading}</h3>}
              {renderBlocks(content?.blocks || [])}
            </div>
          </div>;
      }
      case 'contact_sla': {
        const content = getServiceTabContent(marketplaceType, item?.id, tabId);
        return <div className="space-y-6">
            <div className="prose max-w-none">
              {content?.heading && <h3 className="text-xl font-bold text-gray-900 mb-2">{content.heading}</h3>}
              {renderBlocks(content?.blocks || [])}
            </div>
          </div>;
      }
      case 'about':
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Learn more about this {config.itemName.toLowerCase()} and what it
              offers for your business.
            </p>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-5">{itemDescription}</p>
              {marketplaceType === 'courses' && <p className="text-gray-700">
                  This course is designed to accommodate {item.businessStage}{' '}
                  businesses, with a focus on practical applications that you
                  can implement immediately. Our experienced instructors bring
                  real-world expertise to help you navigate the challenges of
                  modern business environments.
                </p>}
              {marketplaceType === 'financial' && <p className="text-gray-700">
                  This financial service is tailored for businesses at the{' '}
                  {item.businessStage || 'growth'} stage, providing the
                  financial resources needed to achieve your business
                  objectives. With competitive terms and a streamlined
                  application process, you can access the funding you need
                  quickly and efficiently.
                </p>}
              {marketplaceType === 'non-financial' && <p className="text-gray-700">
                  This service is designed to support businesses at all stages,
                  with particular benefits for those in the{' '}
                  {item.businessStage || 'growth'} phase. Our team of experts
                  will work closely with you to ensure you receive the maximum
                  value and can implement effective solutions for your specific
                  business needs.
                </p>}
            </div>
            {/* Key Highlights Section - Unified layout for all marketplace types */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Key Highlights
              </h3>
              {/* Features/Highlights list - Consistent for all types */}
              <ul className="space-y-2">
                {highlights.map((highlight, index) => <li key={index} className="flex items-start">
                    <CheckCircleIcon size={16} className="text-dqYellow mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
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
              <div className="flex flex-col md:flex-row md:items-center mb-6 bg-blue-50 p-3 rounded-lg">
                <div className="flex-grow flex items-center">
                  <Calendar className="text-blue-600 mr-3" size={18} />
                  <div>
                    <p className="font-medium text-gray-800">
                      Start Date:{' '}
                      <span className="text-blue-700">{item.startDate}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {item.duration}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                    {item.deliveryMode}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Timeline
              </h3>
              <div className="space-y-4">
                <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-gray-900">Week 1</h4>
                  <p className="text-gray-700">
                    Introduction and foundation concepts
                  </p>
                </div>
                <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-gray-900">Week 2</h4>
                  <p className="text-gray-700">
                    Core principles and practical exercises
                  </p>
                </div>
                <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-gray-900">Week 3-4</h4>
                  <p className="text-gray-700">
                    Advanced techniques and final projects
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-gray-900">Final Week</h4>
                  <p className="text-gray-700">
                    Project presentations and certification
                  </p>
                </div>
              </div>
              {/* Location if applicable */}
              {item.location && <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MapPin className="text-blue-600 mr-2" size={16} />
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
                    <CheckCircleIcon size={16} className="text-dqYellow mr-2 flex-shrink-0" />
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
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-100">
                Businesses report an average of 40% improvement in relevant
                metrics within 6 months of course completion.
              </div>
            </div>
          </div>;
      case 'eligibility_terms':
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
                      <CheckCircleIcon size={16} className="text-dqYellow mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>) : <li className="flex items-start">
                    <CheckCircleIcon size={16} className="text-dqYellow mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      {item.eligibility || `Businesses at the ${item.businessStage || 'growth'} stage`}
                    </span>
                  </li>}
              </ul>
              <div className="mt-6 bg-blue-50 rounded-lg p-3">
                <h4 className="text-md font-medium text-blue-800 mb-2">
                  Not sure if you qualify?
                </h4>
                <p className="text-gray-700 mb-3 text-sm">
                  Contact {item.provider.name} for a preliminary eligibility
                  assessment before submitting your full application.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center">
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
        return <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Learn more about the provider and their expertise in this field.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <img src={provider.logoUrl} alt={provider.name} className="h-16 w-16 object-contain rounded-lg" />
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
  // Handle primary action button click
  const handlePrimaryActionClick = () => {
    // Check if this is Leave Application service (id '13')
    if (isLeaveApplication) {
      setIsRequestFormOpen(true);
    } else if (isITSupportService) {
      setIsTechSupportFormOpen(true);
    } else if (isPromptLibrary && item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    } else if (isAITool) {
      setIsTechSupportFormOpen(true);
    }
  };
  return <div className="bg-white min-h-screen flex flex-col">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.4), 0 4px 6px -2px rgba(34, 197, 94, 0.2);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        {/* Breadcrumbs (outside hero) */}
        <div className="w-full bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <nav className="flex pt-4 pb-2" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link to={getBackUrl()} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                      {config.itemNamePlural}
                    </Link>
                  </div>
                </li>
                {marketplaceType === 'non-financial' && serviceTab && getTabLabel(serviceTab) && (
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      <Link to={getBackUrl()} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                        {getTabLabel(serviceTab)}
                      </Link>
                    </div>
                  </li>
                )}
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">
                      {itemTitle}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section - full-width background */}
        <div ref={heroRef} className="w-full bg-gray-50">
          <ServiceHeroSection 
            item={item}
          />
        </div>
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 w-full bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div ref={containerRef} className="flex items-center w-full relative">
              {showNavigation && <button className="absolute left-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors bg-white z-10" onClick={scrollLeft} aria-label="Scroll tabs left">
                  <ChevronLeft size={16} />
                </button>}
              <div ref={tabsRef} className="flex overflow-x-auto scrollbar-hide w-full" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
                {tabsToUse.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-8 py-4 text-base font-semibold whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'}`} aria-selected={activeTab === tab.id} aria-controls={`tabpanel-${tab.id}`} role="tab">
                    {tab.label}
                  </button>)}
              </div>
              {showNavigation && <>
                  <button className="absolute right-8 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors bg-white z-10" onClick={scrollRight} aria-label="Scroll tabs right">
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute right-0">
                    <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors bg-white z-10" onClick={() => setShowTabsMenu(!showTabsMenu)} aria-label="Show all tabs menu" aria-expanded={showTabsMenu}>
                      <MoreHorizontal size={16} />
                    </button>
                    {showTabsMenu && <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowTabsMenu(false)} aria-hidden="true" />
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                          <div className="py-1 max-h-64 overflow-y-auto">
                            {tabsToUse.map(tab => <button key={tab.id} className={`w-full text-left px-4 py-3 text-base font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
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
            <div className="col-span-12 lg:col-span-8">
              {/* Tab Content */}
              <div className="mb-8">
                {tabsToUse.map(tab => <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'} id={`tabpanel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`}>
                    {renderTabContent(tab.id)}
                  </div>)}
              </div>
              {/* Mobile/Tablet Summary Card - only visible on mobile/tablet */}
              <div className="lg:hidden mt-8">
                <ServiceDetailsSidebar
                  detailItems={detailItems}
                  highlights={highlights}
                  marketplaceType={marketplaceType}
                  primaryAction={primaryAction}
                  onPrimaryActionClick={handlePrimaryActionClick}
                  isPromptLibrary={isPromptLibrary}
                  isDigitalWorker={isDigitalWorker}
                  sourceUrl={item?.sourceUrl}
                  summaryCardRef={summaryCardRef}
                />
              </div>
            </div>
            {/* Summary card column (~4 columns) - visible only on desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-[96px]">
                <ServiceDetailsSidebar
                  detailItems={detailItems}
                  highlights={highlights}
                  marketplaceType={marketplaceType}
                  primaryAction={primaryAction}
                  onPrimaryActionClick={handlePrimaryActionClick}
                  isPromptLibrary={isPromptLibrary}
                  isDigitalWorker={isDigitalWorker}
                  sourceUrl={item?.sourceUrl}
                  summaryCardRef={summaryCardRef}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Related Items */}
        <section className="bg-gray-50 py-10 border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related {config.itemNamePlural}
              </h2>
              <a href={config.route} className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                See All {config.itemNamePlural}
                <ChevronRightIcon size={16} className="ml-1" />
              </a>
            </div>
            {relatedItems.length > 0 ? <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedItems.map(relatedItem => <Link key={relatedItem.id} to={`${config.route}/${relatedItem.id}`} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow block">
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-gray-600">
                          {relatedItem.provider.name}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {relatedItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedItem.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(relatedItem.tags || []).slice(0, 2).map((tag, idx) => <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>)}
                      </div>
                    </Link>)}
                </div>
              </div> : <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">
                  No related {config.itemNamePlural.toLowerCase()} found
                </p>
              </div>}
          </div>
        </section>
        {/* Sticky mobile CTA */}
        {showStickyBottomCTA && <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-30 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <div className="mr-3">
                <div className="text-gray-900 font-bold">
                  {marketplaceType === 'courses' ? item.price || 'Free' : marketplaceType === 'financial' ? item.amount || 'Apply Now' : 'Request Now'}
                </div>
                <div className="text-sm text-gray-600">
                  {item.duration || item.serviceType || ''}
                </div>
              </div>
              <button 
                className="flex-1 px-4 py-3 text-white font-bold rounded-md transition-colors shadow-md flex items-center justify-center gap-2"
                style={{ backgroundColor: '#030F35' }} 
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')} 
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')}
                onClick={() => {
                  // Check if this is Leave Application service (id '13')
                  if (isLeaveApplication) {
                    setIsRequestFormOpen(true);
                  } else if (isITSupportService) {
                    setIsTechSupportFormOpen(true);
                  } else if (isPromptLibrary && item.sourceUrl) {
                    window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
                  } else if (isAITool) {
                    setIsTechSupportFormOpen(true);
                  }
                }}
              >
                {isPromptLibrary ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Page
                  </>
                ) : (
                  primaryAction
                )}
              </button>
            </div>
          </div>}
      </main>
      <Footer isLoggedIn={false} />
      
      {/* Request Form Modal */}
      <LeaveRequestForm 
        isOpen={isRequestFormOpen} 
        onClose={() => setIsRequestFormOpen(false)}
        initialApprovers={INITIAL_APPROVERS}
      />

      {/* Technology Support Form Modal (IT Support service) */}
      <TechSupportForm 
        isOpen={isTechSupportFormOpen}
        onClose={() => setIsTechSupportFormOpen(false)}
      />
    </div>;
};
export default MarketplaceDetailsPage;

