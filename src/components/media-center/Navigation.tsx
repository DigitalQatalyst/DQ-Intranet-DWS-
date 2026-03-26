import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/media-center-utils';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/media-center', label: 'Media Center' },
    { path: '/media-center/courses', label: 'Courses' },
    { path: '/media-center/guides', label: 'Guides' },
    { path: '/media-center/resources', label: 'Resources' },
  ];

  return (
    <nav className={cn(
      'sticky top-0 z-50 w-full border-b border-[hsl(0_0%_88%)] bg-[hsl(0_0%_100%_/95%)] backdrop-blur-md',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-[hsl(0_0%_4%)] hover:text-[hsl(210_100%_70%)] transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(220_90%_50%)] to-[hsl(210_100%_50%)]" />
            <span className="font-semibold text-lg">DQ Learn</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[hsl(210_100%_70%)]',
                  location.pathname === item.path
                    ? 'text-[hsl(210_100%_70%)]'
                    : 'text-[hsl(0_0%_64%)]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md text-[hsl(0_0%_64%)] hover:text-[hsl(0_0%_4%)] hover:bg-[hsl(0_0%_98%)]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
