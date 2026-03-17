import React from 'react';
import { Calendar, User, Building2 } from 'lucide-react';
import { formatDate } from '@/utils/newsUtils';
import type { NewsItem } from '@/data/media/news';

interface MediaMetaBlockProps {
  item: NewsItem;
  displayAuthor?: string;
}

export function MediaMetaBlock({ item, displayAuthor }: MediaMetaBlockProps) {
  const announcementDate = item.date ? formatDate(item.date) : '';
  const contactLabel = 'HRA';
  const departmentLabel = 'HRA';

  return (
    <section className="bg-gray-50 rounded-lg p-6 border border-gray-200" aria-label="Company News Details">
      <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">COMPANY NEWS DETAILS</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-gray-500 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ANNOUNCEMENT DATE</div>
            <div className="text-sm text-gray-900">{announcementDate}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <User size={16} className="text-gray-500 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">RELEVANT CONTACT</div>
            <div className="text-sm text-gray-900">{contactLabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building2 size={16} className="text-gray-500 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">DEPARTMENT</div>
            <div className="text-sm text-gray-900">{departmentLabel}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

