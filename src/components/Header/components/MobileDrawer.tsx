import React, { useEffect, useState } from 'react';
import { MenuIcon, XIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { BuildingIcon, CreditCardIcon, NewspaperIcon, UsersIcon, GraduationCapIcon, TrendingUpIcon, CalendarIcon, SparklesIcon } from 'lucide-react';
interface MobileDrawerProps {
  isCompact?: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  isSignedIn: boolean;
}
const marketplaces = [{
  id: 'non-financial',
  name: 'IT & Systems Support',
  description: 'Helpdesk, access requests, device & app support.',
  icon: BuildingIcon,
  href: '/marketplace/non-financial'
}, {
  id: 'finance',
  name: 'HR & Finance Services',
  description: 'Leave, payroll, benefits, and reimbursements.',
  icon: CreditCardIcon,
  href: '/marketplace/finance'
}, {
  id: 'media',
  name: 'Facilities & Logistics',
  description: 'Office access, seating, travel, and logistics.',
  icon: NewspaperIcon,
  href: '/marketplace/media'
}, {
  id: 'community',
  name: 'Associates Directory',
  description: 'Find people, teams, and contacts across DQ.',
  icon: UsersIcon,
  href: '/marketplace/community'
}, {
  id: 'course',
  name: 'DQ LMS Courses',
  description: '7x GHC, 6x Digital, 12x HoV, 1x Day in DQ, Key Tools.',
  icon: GraduationCapIcon,
  href: '/marketplace/courses'
}, {
  id: 'investment',
  name: 'Certifications & Onboarding',
  description: 'Mandatory training and new associate onboarding.',
  icon: TrendingUpIcon,
  href: '/marketplace/investment'
}, {
    id: 'calendar',
    name: 'Calendar & Events',
    description: 'Digital platform that connects event organizers with attendees, vendors, and service providers.',
    icon: CalendarIcon,
    href: '/events',
  },{
  id: 'opportunity',
  name: 'News & Announcements',
  description: 'Company updates and internal notices.',
  icon: SparklesIcon,
  href: '/marketplace/opportunities'
}];
export function MobileDrawer({
  isCompact = false,
  onSignIn,
  onSignUp,
  isSignedIn
}: MobileDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExploreExpanded, setIsExploreExpanded] = useState(false);
  useEffect(() => {
    if (isDrawerOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isDrawerOpen]);

  const handleSignIn = () => {
    onSignIn();
    setIsDrawerOpen(false);
  };
  // Sign out is handled via profile dropdown in desktop; mobile can add later if needed
  const handleCTAClick = (action: string) => {
    console.log(`${action} clicked`);
    setIsDrawerOpen(false);
  };
  const handleMarketplaceClick = (href: string) => {
    console.log('Navigate to:', href);
    setIsDrawerOpen(false);
  };
  const handleDiscoverClick = () => {
    console.log('Navigate to: Explore DQ');
    setIsDrawerOpen(false);
  };
  return <>
    {/* Always visible primary CTA + hamburger menu for Mobile (<768px) */}
    <div className="flex items-center space-x-2 md:hidden">
      {!isSignedIn && <button className={`px-3 py-2 bg-white text-dq-navy shadow-sm rounded-md hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium ${isCompact ? 'text-sm px-2 py-1.5' : 'text-sm'}`} onClick={() => handleCTAClick('Request Support')}>
        Request Support
      </button>}
      {/* Hamburger menu button */}
      <button className={`p-2 text-white hover:bg-white/10 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${isCompact ? 'p-1.5' : ''}`} onClick={() => setIsDrawerOpen(!isDrawerOpen)} aria-label="Open navigation menu" aria-expanded={isDrawerOpen}>
        {isDrawerOpen ? <XIcon size={isCompact ? 20 : 24} /> : <MenuIcon size={isCompact ? 20 : 24} />}
      </button>
    </div>
    {/* Tablet hamburger menu (768px - 1023px) */}
    <div className="hidden md:flex lg:hidden items-center">
      <button className={`p-2 text-white hover:bg-white/10 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${isCompact ? 'p-1.5' : ''}`} onClick={() => setIsDrawerOpen(!isDrawerOpen)} aria-label="Open navigation menu" aria-expanded={isDrawerOpen}>
        {isDrawerOpen ? <XIcon size={isCompact ? 20 : 24} /> : <MenuIcon size={isCompact ? 20 : 24} />}
      </button>
    </div>
    {/* Mobile and Tablet drawer overlay */}
    {isDrawerOpen && <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsDrawerOpen(false)} />
      {/* Mobile and Tablet drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white to-[#F6F8FB] shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dq-navy/10 bg-white">
            <h2 className="text-lg font-semibold text-dq-navy md:text-base sm:text-sm">
              Menu
            </h2>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-dq-coral/10 rounded-md transition-colors" aria-label="Close menu">
              <XIcon size={18} className="text-dq-navy" />
            </button>
          </div>
          {/* Drawer content - scrollable area */}
          <div className={`flex-1 overflow-y-auto ${!isSignedIn ? 'pb-20' : ''}`}>
            {/* Navigation Section - Show for Mobile only, Tablet has these in header */}
            <div className="px-4 py-3 md:hidden">
              <h3 className="text-xs font-semibold text-dq-navy/60 uppercase tracking-wider mb-2 md:text-[11px] sm:text-[10px]">
                Navigation
              </h3>
              {/* Explore Accordion */}
              <div className="mb-1">
                <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-dq-navy hover:bg-dq-coral/10 rounded-lg transition-colors text-sm font-medium tracking-tight md:text-[13px] sm:text-xs md:py-2 sm:py-1.5" onClick={() => setIsExploreExpanded(!isExploreExpanded)} aria-expanded={isExploreExpanded}>
                  <span>Explore Marketplaces</span>
                  <ChevronDownIcon size={14} className={`text-dq-coral transition-transform md:w-3 md:h-3 sm:w-3 sm:h-3 ${isExploreExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExploreExpanded && <div className="mt-1 ml-3 space-y-0.5">
                  {marketplaces.map(marketplace => {
                    const Icon = marketplace.icon;
                    return <button key={marketplace.id} className="w-full flex items-start px-2.5 py-2 text-left hover:bg-dq-coral/10 rounded-lg transition-colors md:py-1.5 sm:py-1" onClick={() => handleMarketplaceClick(marketplace.href)}>
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon size={14} className="text-dq-coral md:w-3 md:h-3 sm:w-3 sm:h-3" />
                      </div>
                      <div className="ml-2.5 flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-dq-navy truncate leading-tight md:text-xs sm:text-[11px]">
                          {marketplace.name}
                        </p>
                        <p className="text-[11px] text-dq-navy/70 mt-0.5 leading-[1.4] line-clamp-2 md:text-[10px] sm:text-[9px]">
                          {marketplace.description}
                        </p>
                      </div>
                    </button>;
                  })}
                </div>}
              </div>
              {/* Discover AbuDhabi */}
              <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-dq-navy hover:bg-dq-coral/10 rounded-lg transition-colors text-sm font-medium tracking-tight md:text-[13px] sm:text-xs md:py-2 sm:py-1.5" onClick={handleDiscoverClick}>
                <span>Explore DQ</span>
                <ChevronRightIcon size={14} className="text-dq-coral md:w-3 md:h-3 sm:w-3 sm:h-3" />
              </button>
            </div>
            {/* Divider - Only show for mobile */}
            <div className="border-t border-dq-navy/10 mx-4 my-2 md:hidden"></div>
            {/* Get Started Section - Always visible, contains both CTAs */}
            <div className="px-4 py-3">
              <h3 className="text-xs font-semibold text-dq-navy/60 uppercase tracking-wider mb-2 md:text-[11px] sm:text-[10px]">
                Get Started
              </h3>
              <div className="space-y-1">
                {/* Join a Workspace - Always visible */}
                <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-dq-navy hover:bg-dq-coral/10 rounded-lg transition-colors text-sm font-medium tracking-tight md:text-[13px] sm:text-xs md:py-2 sm:py-1.5" onClick={() => handleCTAClick('Join a Workspace')}>
                  <span>Join a Workspace</span>
                  <ChevronRightIcon size={14} className="text-dq-coral md:w-3 md:h-3 sm:w-3 sm:h-3" />
                </button>
                {/* Request Support - Only for non-signed-in users, styled as emphasized menu item */}
                {!isSignedIn && <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-dq-navy hover:bg-dq-coral/10 rounded-lg transition-colors text-sm font-bold tracking-tight md:text-[13px] sm:text-xs md:py-2 sm:py-1.5 border-l-4 border-dq-coral" onClick={() => handleCTAClick('Request Support')}>
                  <span>Request Support</span>
                  <ChevronRightIcon size={14} className="text-dq-coral md:w-3 md:h-3 sm:w-3 sm:h-3" />
                </button>}
              </div>
            </div>
          </div>
          {/* Sticky CTA at bottom for non-signed-in users */}
          {!isSignedIn && (
            <div className="sticky bottom-0 left-0 right-0 px-4 py-4 border-t border-dq-navy/10 bg-white shadow-lg">
              <button className="w-full px-4 py-3 bg-[image:var(--dq-cta-gradient)] text-white rounded-lg transition-all duration-200 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-dq-navy/40 font-bold text-base tracking-tight shadow-md md:text-[15px] sm:text-sm" onClick={handleSignIn}>
                Sign In to DQ Workspace
              </button>
              <p className="text-xs text-dq-navy/60 text-center mt-2 md:text-[11px] sm:text-[10px]">
                Access your personalized dashboard
              </p>
            </div>
          )}
        </div>
      </div>
    </>}
  </>;
}
