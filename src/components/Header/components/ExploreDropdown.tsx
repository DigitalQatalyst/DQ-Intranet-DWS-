import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { BuildingIcon, CreditCardIcon, NewspaperIcon, UsersIcon, GraduationCapIcon, TrendingUpIcon, SparklesIcon, FileText, LucideProps, BookOpen } from 'lucide-react';

interface Marketplace {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  href: string;
}


const marketplaces: Marketplace[] = [
  {
    id: 'discover-dq',
    name: 'Discover DQ',
    description: 'Tour the digital workspace zones and teams across DQ.',
    icon: SparklesIcon,
    href: '/discover-dq',
  },
  {
    id: 'non-financial',
    name: 'IT & Systems Support',
    description: 'Helpdesk, access requests, device & app support.',
    icon: BuildingIcon,
    href: '/marketplace/non-financial',
  },
  {
    id: 'finance',
    name: 'HR & Finance Services',
    description: 'Leave, payroll, benefits, and reimbursements.',
    icon: CreditCardIcon,
    href: '/marketplace/financial',
  },
  {
    id: 'media',
    name: 'Facilities & Logistics',
    description: 'Office access, seating, travel, and logistics.',
    icon: NewspaperIcon,
    href: '/marketplace/media',
  },
  {
    id: 'community',
    name: 'Associates Directory',
    description: 'Find people, teams, and contacts across DQ.',
    icon: UsersIcon,
    href: '/marketplace/community',
  },
  {
    id: 'course',
    name: 'DQ LMS Courses',
    description: '7x GHC, 6x Digital, 12x HoV, 1x Day in DQ, Key Tools.',
    icon: GraduationCapIcon,
    href: '/marketplace/courses',
  },
  {
    id: 'investment',
    name: 'Certifications & Onboarding',
    description: 'Mandatory training and new associate onboarding.',
    icon: TrendingUpIcon,
    href: '/marketplace/investment',
  },
  {
    id: 'guides',
    name: 'Guides Marketplace',
    description: 'Guides, playbooks, and how-to resources.',
    icon: BookOpen,
    href: '/marketplace/guides',
  },
  {
    id: 'calendar',
    name: 'Calendar & Events',
    description: 'Digital platform that connects event organizers with attendees, vendors, and service providers.',
    icon: CalendarIcon,
    href: '/events',
  },
  {
    id: 'guides',
    name: 'Guidelines Marketplace',
    description: 'Access practical guidelines, templates, and processes.',
    icon: BookOpen,
    href: '/marketplace/guides',
  },
  {
    id: 'opportunity',
    name: 'News & Announcements',
    description: 'Company updates and internal notices.',
    icon: SparklesIcon,
    href: '/marketplace/opportunities',
  },
  {
    id: 'asset-library',
    name: 'Asset Library',
    description: 'Shared design, deployment and marketing artefacts.',
    icon: FileText,
    href: '/marketplace/asset-library',
  },
  {
    id: 'communities',
    name: 'DQ Communities',
    description: 'Connect, collaborate, and engage with peers in vibrant communities.',
    icon: UsersIcon,
    href: '/communities',
  },
];

interface ExploreDropdownProps {
  isCompact?: boolean;
}

export function ExploreDropdown({ isCompact = false }: ExploreDropdownProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % marketplaces.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev <= 0 ? marketplaces.length - 1 : prev - 1));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
          itemRefs.current[focusedIndex]?.click();
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    setFocusedIndex(-1);
    navigate(href); // Use React Router's navigate function
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className={`flex items-center text-white hover:text-dq-coral transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-2 py-1 ${
          isCompact ? 'text-sm' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Explore marketplaces menu"
      >
        <span>Explore</span>
        <ChevronDownIcon
          size={isCompact ? 14 : 16}
          className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-dq-navy/10 z-50 py-2"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="explore-menu"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              Explore Marketplaces
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Discover opportunities across Abu Dhabi's business ecosystem
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {marketplaces.map((marketplace, index) => {
              const Icon = marketplace.icon;
              const isActive = marketplace.id === 'guides' && (location.pathname.startsWith('/marketplace/guides') || location.pathname.startsWith('/marketplace/knowledge-hub'));
              return (
                <a
                  key={marketplace.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  href={marketplace.href}
                  className={`flex items-start px-4 py-3 text-left hover:bg-dq-coral/10 focus:bg-dq-coral/10 focus:outline-none transition-colors duration-150 ${
                    focusedIndex === index ? 'bg-dq-coral/10' : ''
                  } ${isActive ? 'border-l-4 border-dq-coral bg-dq-coral/5' : ''}`}
                  role="menuitem"
                  tabIndex={-1}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(marketplace.href);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onFocus={() => setFocusedIndex(index)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon size={20} className="text-dq-coral" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-dq-navy truncate">
                      {marketplace.name}
                    </p>
                    <p className="text-xs text-dq-navy/70 mt-1 line-clamp-2">
                      {marketplace.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
