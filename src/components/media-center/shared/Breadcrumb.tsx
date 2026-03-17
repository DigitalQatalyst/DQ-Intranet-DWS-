import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  return (
    <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1A2E6E]">
        <HomeIcon size={16} />
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
          {item.href ? (
            <Link 
              to={item.href}
              className="hover:text-[#1A2E6E]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 line-clamp-1">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

