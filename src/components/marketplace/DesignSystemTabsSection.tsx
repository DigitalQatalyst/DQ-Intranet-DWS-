import React from 'react';
import { DesignSystemTab, DESIGN_SYSTEM_TAB_LABELS, DESIGN_SYSTEM_TAB_DESCRIPTIONS } from './MarketplaceUtils';

interface DesignSystemTabsSectionProps {
  isDesignSystem: boolean;
  activeDesignSystemTab: DesignSystemTab;
  setActiveDesignSystemTab: (tab: DesignSystemTab) => void;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams, options?: { replace?: boolean }) => void;
}

export const DesignSystemTabsSection: React.FC<DesignSystemTabsSectionProps> = ({
  isDesignSystem,
  activeDesignSystemTab,
  setActiveDesignSystemTab,
  searchParams,
  setSearchParams
}) => {
  if (!isDesignSystem) return null;
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Design System navigation">
        {(['cids', 'vds', 'cds'] as DesignSystemTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveDesignSystemTab(tab);
              const newParams = new URLSearchParams(searchParams);
              newParams.set('tab', tab);
              setSearchParams(newParams, { replace: false });
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeDesignSystemTab === tab
                ? 'border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeDesignSystemTab === tab ? 'page' : undefined}
          >
            {DESIGN_SYSTEM_TAB_LABELS[tab]}
          </button>
        ))}
      </nav>
      {activeDesignSystemTab && DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab] && (
        <div className="pt-4 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].description}
          </p>
          {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].author && (
            <p className="text-xs text-gray-500 mt-2">
              {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].author}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
