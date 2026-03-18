import React from 'react';
import { CheckCircleIcon } from 'lucide-react';

export interface ServiceDetailsSidebarProps {
  detailItems: Array<{ label: string; value: string }>;
  highlights: string[];
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding';
  primaryAction: string;
  onPrimaryActionClick?: () => void;
  isPromptLibrary?: boolean;
  isDigitalWorker?: boolean;
  sourceUrl?: string | null;
  summaryCardRef?: React.RefObject<HTMLDivElement>;
}

// FLOATING BEHAVIOR REMOVED:
// Previously, this component had floating behavior that would change position on scroll.
// All floating-related props and logic have been removed to keep the sidebar fixed at its default position.
// To restore floating behavior, you would need to:
// 1. Add back isFloating, headerHeight, isFloatingCardVisible, onHideFloatingCard props
// 2. Add conditional className and style logic for fixed positioning
// 3. Add the close button (XIcon) for floating state
// 4. Update MarketplaceDetailsPage to conditionally render floating version based on scroll position

export function ServiceDetailsSidebar({
  detailItems,
  highlights,
  marketplaceType,
  primaryAction,
  onPrimaryActionClick,
  isPromptLibrary = false,
  isDigitalWorker = false,
  sourceUrl = null,
  summaryCardRef
}: ServiceDetailsSidebarProps) {
  const getInclusionsLabel = () => {
    if (marketplaceType === 'courses') {
      return 'This course includes:';
    }
    if (marketplaceType === 'financial') {
      return 'This service includes:';
    }
    return 'This service includes:';
  };

  return (
    <div
      ref={summaryCardRef}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg text-gray-900">Service Details</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {detailItems.map((detail, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{detail.label}:</span>
              <span className="text-sm font-medium text-gray-900">
                {detail.value || 'N/A'}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-3">{getInclusionsLabel()}</h4>
          <ul className="space-y-2">
            {highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon
                  size={14}
                  className="text-dqYellow mr-2 mt-1 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Hide button for Digital Worker category */}
        {/* Hide button for Prompt Library items when sourceUrl is null */}
        {!isDigitalWorker && !(isPromptLibrary && !sourceUrl) && (
          <button
            id="action-section"
            className="w-full px-4 py-3 text-white font-bold rounded-md transition-colors shadow-md mb-3 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#030F35' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')}
            onClick={onPrimaryActionClick}
          >
            {isPromptLibrary ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Visit Page
              </>
            ) : (
              primaryAction
            )}
          </button>
        )}
      </div>
    </div>
  );
}
