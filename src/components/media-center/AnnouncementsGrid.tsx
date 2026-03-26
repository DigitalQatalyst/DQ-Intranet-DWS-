import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import type { FiltersValue } from './types';
import { NewsCard } from './cards/NewsCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
  items: NewsItem[];
}

const UPDATE_TYPES = ['Announcement', 'Guidelines', 'Notice'];
const ITEMS_PER_PAGE = 9;
const matchesSelection = (value: string | undefined, selections?: string[]) =>
  !selections?.length || (value && selections.includes(value));

export default function AnnouncementsGrid({ query, items }: GridProps) {
  const sourceItems: NewsItem[] = items;
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const filteredItems = useMemo(() => {
    const search = query.q?.toLowerCase() ?? '';
    const DAY_MS = 24 * 60 * 60 * 1000;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    const normalizeItemDate = (value: string): number | null => {
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };

    return sourceItems
      .filter((item) => UPDATE_TYPES.includes(item.type))
      .filter((item) => {
        if (!search) return true;
        return (
          item.title.toLowerCase().includes(search) ||
          item.excerpt.toLowerCase().includes(search) ||
          item.author.toLowerCase().includes(search)
        );
      })
      .filter((item) => {
        const department = query.filters?.department;
        const location = query.filters?.location;
        const newsType = query.filters?.newsType;
        const newsSource = query.filters?.newsSource;
        const focusArea = query.filters?.focusArea;
        const channel = query.filters?.channel;
        const audience = query.filters?.audience;
        const dateRange = query.filters?.dateRange;
        const okDepartment = matchesSelection(item.department, department);
        const okLocation = matchesSelection(item.location, location);
        const okNewsType = matchesSelection(item.newsType, newsType);
        const okSource = matchesSelection(item.newsSource, newsSource);
        const okFocus = matchesSelection(item.focusArea, focusArea);
        const okChannel = matchesSelection(item.channel, channel);
        const okAudience = matchesSelection(item.audience, audience);
        let okDateRange = true;
        if (dateRange && dateRange.length) {
          const itemTime = item.date ? normalizeItemDate(item.date) : null;

          if (itemTime === null) {
            // If a date filter is active and the item has no valid date, exclude it
            okDateRange = false;
          } else {
            okDateRange = dateRange.some((selection) => {
              if (selection === 'Last 7 days') {
                const start = todayStart - 6 * DAY_MS;
                return itemTime >= start && itemTime <= todayStart;
              }
              if (selection === 'Last 30 days') {
                const start = todayStart - 29 * DAY_MS;
                return itemTime >= start && itemTime <= todayStart;
              }
              if (selection === 'Last 90 days') {
                const start = todayStart - 89 * DAY_MS;
                return itemTime >= start && itemTime <= todayStart;
              }
              if (selection === 'This year') {
                const startOfYear = new Date(today.getFullYear(), 0, 1).getTime();
                return itemTime >= startOfYear && itemTime <= todayStart;
              }
              // Unknown option: fall back to including the item
              return true;
            });
          }
        }
        return okDepartment && okLocation && okNewsType && okSource && okFocus && okChannel && okAudience && okDateRange;
      })
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
  }, [query, sourceItems]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [query.q, query.filters]);

  if (query.tab !== 'announcements') {
    return null;
  }

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display (Google-style pagination)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show on each side of current page
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > delta + 2) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (filteredItems.length === 0) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <h3 className="font-medium text-gray-800">Available Items (0)</h3>
          <span>Auto-refresh · Live</span>
        </div>
        <div className="text-center py-12 text-gray-500">No items found</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items ({filteredItems.length})</h3>
        <span>Auto-refresh · Live</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedItems.map((item: NewsItem) => (
          <NewsCard
            key={item.id}
            item={item}
            href={`/marketplace/news/${item.id}${location.search}`}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8 pb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              const pageNum = page as number;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[36px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#030f35] text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
