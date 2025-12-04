import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageLayoutProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  headerSubtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ title, breadcrumbs, headerSubtitle, children, className }: PageLayoutProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex text-sm text-gray-500 mb-2">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {item.href && !item.current ? (
                <a href={item.href} className="hover:text-gray-700">
                  {item.label}
                </a>
              ) : (
                <span className={item.current ? 'text-gray-900' : 'text-gray-500'}>
                  {item.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {headerSubtitle && (
          <p className="text-gray-600 mt-1">{headerSubtitle}</p>
        )}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('p-6 pb-4 border-b border-gray-100', className)}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      )}
    </div>
  );
}

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionContent({ children, className }: SectionContentProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex text-sm text-gray-500', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.current ? (
            <a href={item.href} className="hover:text-gray-700">
              {item.label}
            </a>
          ) : (
            <span className={item.current ? 'text-gray-900' : 'text-gray-500'}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}