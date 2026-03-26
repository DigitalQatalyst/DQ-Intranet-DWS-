import React from 'react';
import { WorkGuideTab, TAB_LABELS, TAB_DESCRIPTIONS } from './MarketplaceUtils';

interface GuidesTabsSectionProps {
  isGuides: boolean;
  activeTab: WorkGuideTab;
  handleGuidesTabChange: (tab: WorkGuideTab) => void;
}

export const GuidesTabsSection: React.FC<GuidesTabsSectionProps> = ({
  isGuides,
  activeTab,
  handleGuidesTabChange
}) => {
  if (!isGuides) return null;
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Guides navigation">
        {(['strategy', 'guidelines', '6xd', 'blueprints', 'testimonials', 'glossary', 'faqs'] as WorkGuideTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => handleGuidesTabChange(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
              activeTab === tab
                ? 'border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>
      {activeTab && TAB_DESCRIPTIONS[activeTab] && (
        <div className="pt-2 pb-2 mt-3 border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
          <p className="text-sm text-gray-600 leading-relaxed">
            {TAB_DESCRIPTIONS[activeTab].description}
          </p>
        </div>
      )}
    </div>
  );
};
