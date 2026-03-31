import React from 'react';
import { getServiceTabContent } from '@/data/marketplace/services-center-tabs';

interface GenericTabRendererProps {
  item: any;
  tabId: string;
  marketplaceType: string;
  renderBlocks: (blocks: any[]) => React.ReactNode;
}

export const GenericTabRenderer: React.FC<GenericTabRendererProps> = ({
  item,
  tabId,
  marketplaceType,
  renderBlocks
}) => {
  const content = getServiceTabContent(marketplaceType, item?.id, tabId);
  if (!content) return null;

  // Visit Site Tab
  if (tabId === 'visit_site') {
    const urlField = content.action?.urlField;
    const computedUrl = (urlField && item?.[urlField]) || content.action?.fallbackUrl || '#';

    return (
      <div className="space-y-8">
        <div className="prose max-w-none">
          {content.heading && <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">{content.heading}</h2>}
          {renderBlocks(content.blocks || [])}
        </div>
        <div className="pt-4">
          <button
            id="action-section"
            className="px-6 py-3.5 text-white text-base font-bold rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            style={{ backgroundColor: '#030F35' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')}
            onClick={() => window.open(computedUrl, '_blank', 'noopener,noreferrer')}
          >
            {content.action?.label || 'Visit Website'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Generic content with optional action button
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        {content.heading && <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">{content.heading}</h2>}
        {renderBlocks(content.blocks || [])}
      </div>
      {content.action && content.action.label !== 'Apply For Leave' && (
        <div className="pt-4">
          <button
            id="action-section"
            className="px-6 py-3.5 text-white text-base font-bold rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#030F35' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')}
            onClick={() => {
              const urlField = content.action?.urlField;
              const computedUrl = (urlField && item?.[urlField]) || content.action?.fallbackUrl || '#';
              window.open(computedUrl, '_blank', 'noopener');
            }}
          >
            {content.action.label}
          </button>
        </div>
      )}
    </div>
  );
};
