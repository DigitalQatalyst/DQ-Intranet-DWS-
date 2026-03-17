import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { JobItem } from '@/data/media/jobs';
import type { FiltersValue } from './types';
import { JobCard } from './cards/JobCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
  jobs: JobItem[];
}

const ITEMS_PER_PAGE = 9;

export default function JobsGrid({ query, jobs }: GridProps) {
  const sourceItems: JobItem[] = jobs;
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const items = useMemo(() => {
    const search = query.q?.toLowerCase() ?? '';
    return sourceItems
      .filter((job) => {
        if (!search) return true;
        return job.title.toLowerCase().includes(search) || job.summary.toLowerCase().includes(search);
      })
      .filter((job) => {
        const matches = (val?: string, sel?: string[]) => !sel?.length || (val && sel.includes(val));
        const f = query.filters || {};
        const postedWithin = f.postedWithin;
        let withinOk = true;
        if (postedWithin && postedWithin.length) {
          const days = postedWithin.includes('Last 7 days') ? 7 : postedWithin.includes('Last 30 days') ? 30 : undefined;
          if (days) {
            const posted = new Date(job.postedOn).getTime();
            const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
            withinOk = posted >= cutoff;
          }
        }
        return (
          matches(job.department, f.department) &&
          matches(job.location, f.location) &&
          matches(job.type, f.contract) &&
          matches(job.sfiaLevel, f.sfiaLevel) &&
          matches(job.roleType, f.deptType) &&
          matches(job.workMode, f.workMode) &&
          withinOk
        );
      })
      .sort((a, b) => {
        // Sort by postedOn descending (newest first)
        const dateA = new Date(a.postedOn).getTime();
        const dateB = new Date(b.postedOn).getTime();
        return dateB - dateA;
      });
  }, [query, sourceItems]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [query.q, query.filters]);

  if (query.tab !== 'opportunities') {
    return null;
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, endIndex);

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

  if (items.length === 0) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <h3 className="font-medium text-gray-800">Available Items (0)</h3>
          <span>Updated every Monday</span>
        </div>
        <div className="text-center py-12 text-gray-500">No items found</div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items ({items.length})</h3>
        <span>Updated every Monday</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedItems.map((job: JobItem) => (
          <JobCard
            key={job.id}
            job={job}
            href={`/marketplace/opportunities/${job.id}`}
            search={location.search}
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
