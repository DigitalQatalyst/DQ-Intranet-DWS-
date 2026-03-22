import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import {
  BuildingIcon,
  GraduationCapIcon,
  UsersIcon,
  NewspaperIcon,
  SparklesIcon,
  LucideProps,
  BookOpen,
  Layers,
} from 'lucide-react';

interface Marketplace {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  href: string;
  isComingSoon?: boolean;
}


const marketplaces: Marketplace[] = [
  {
    id: 'learning-center',
    name: 'DQ Learning Center',
    description: 'Designed for your continuous growth. Access the upskilling and certification tools you need to deliver excellence.',
    icon: GraduationCapIcon,
    href: '/lms',
    isComingSoon: false,
  },
  {
    id: 'news-center',
    name: 'DQ Media Center',
    description: 'Your starting point for news, stories, podcasts, and career opportunities at DQ.',
    icon: NewspaperIcon,
    href: '/marketplace/opportunities?tab=announcements',
    isComingSoon: false,
  },
  {
    id: 'knowledge-center',
    name: 'DQ Knowledge Center',
    description: 'The Knowledge Center is your starting point for understanding how DQ works and how to work effectively within it.',
    icon: BookOpen,
    href: '/marketplace/guides?tab=strategy&collapsed=guide_type%2Csub_domain%2Cunit%2Clocation%2Ctestimonial_category%2Cproduct_type%2Cproduct_stage%2Cguidelines_category%2Ccategorization%2Cattachments%2Cstrategy_framework%2Cglossary_knowledge_system%2Cglossary_ghc_dimension%2Cglossary_6xd_perspective%2Cglossary_letter%2Cfaq_category',
    isComingSoon: false,
  },
  {
    id: 'design-system',
    name: 'Design System Marketplace',
    description: 'Explore design system components, patterns, and resources for consistent digital experiences.',
    icon: Layers,
    href: '/marketplace/design-system',
    isComingSoon: false,
  },
  {
    id: 'services-center',
    name: 'DQ Services Center',
    description: 'Business services, technology services, and digital worker tools.',
    icon: BuildingIcon,
    href: '/marketplace/services-center',
    isComingSoon: true,
  },
  {
    id: 'work-center',
    name: 'DQ Work Center',
    description: 'Daily sessions, project work, and execution trackers.',
    icon: CalendarIcon,
    href: '/events',
    isComingSoon: true,
  },
  {
    id: 'work-directory',
    name: 'DQ Work Directory',
    description: 'Units, positions, and associate profiles.',
    icon: UsersIcon,
    href: '/marketplace/work-directory',
    isComingSoon: true,
  },
  {
    id: 'work-communities',
    name: 'DQ Work Communities',
    description: 'Discussion rooms, pulse updates, and events.',
    icon: SparklesIcon,
    href: '/dq-work-communities',
    isComingSoon: true,
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
            <h3 className="text-sm font-semibold text-dq-navy">Explore Marketplaces</h3>
            <p className="text-xs text-dq-navy/70 mt-1 line-clamp-2">
              Find tools and resources that help you work smarter.
            </p>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {marketplaces.map((marketplace, index) => {
              const Icon = marketplace.icon;
              const isComingSoon = marketplace.isComingSoon;
              const isActive = marketplace.id === 'news-center' && (location.pathname.startsWith('/marketplace/opportunities') || location.pathname.startsWith('/marketplace/news'));
              return (
                <a
                  key={marketplace.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  href={marketplace.href}
                  className={`flex items-start px-4 py-3 text-left hover:bg-dq-coral/10 focus:bg-dq-coral/10 focus:outline-none transition-colors duration-150 ${
                    focusedIndex === index ? 'bg-dq-coral/10' : ''
                  } ${isActive ? 'border-l-4 border-dq-coral bg-dq-coral/5' : ''} ${
                    isComingSoon ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  role="menuitem"
                  tabIndex={-1}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={isComingSoon || undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isComingSoon) return;
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
