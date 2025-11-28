import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { BuildingIcon, GraduationCapIcon, UsersIcon, NewspaperIcon, SparklesIcon, FileText, LucideProps, BookOpen } from 'lucide-react';

interface Marketplace {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  href: string;
}


const marketplaces: Marketplace[] = [
  {
    id: 'learning-center',
    name: 'DQ Learning Center',
    description: 'Courses, learning tracks, and associate reviews.',
    icon: GraduationCapIcon,
    href: '/dq-learning-center',
  },
  {
    id: 'services-center',
    name: 'DQ Services Center',
    description: 'Business services, technology services, and digital worker tools.',
    icon: BuildingIcon,
    href: '/dq-services-center',
  },
  {
    id: 'calendar',
    name: 'Calendar & Events',
    description: 'Digital platform that connects event organizers with attendees, vendors, and service providers.',
    icon: CalendarIcon,
    href: '/events',
  },
  {
    id: 'guidelines',
    name: 'Guidelines Marketplace',
    description: 'Access practical guidelines, templates, and processes.',
    icon: BookOpen,
    href: '/marketplace/guides',
  },
  {
    id: 'work-directory',
    name: 'DQ Work Directory',
    description: 'Units, positions, and associate profiles.',
    icon: UsersIcon,
    href: '/dq-work-directory',
  },
  {
    id: 'media-center',
    name: 'DQ Media Center',
    description: 'News, announcements, job openings, and blogs.',
    icon: NewspaperIcon,
    href: '/dq-media-center',
  },
  {
    id: 'work-communities',
    name: 'DQ Work Communities',
    description: 'Discussion rooms, pulse updates, and events.',
    icon: SparklesIcon,
    href: '/dq-work-communities',
  },
  {
    id: 'knowledge-center',
    name: 'DQ Knowledge Center',
    description: 'Strategy guides, blueprints, libraries, and testimonials.',
    icon: FileText,
    href: '/dq-knowledge-center',
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
        className={`flex items-center text-white hover:text-[#FF874F] hover:bg-white/10 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-2 py-1 ${
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
          <div className="overflow-y-auto">
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
