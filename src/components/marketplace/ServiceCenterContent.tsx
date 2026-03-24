import React from 'react';

interface ServiceCenterContentProps {
  isServicesCenter: boolean;
  activeServiceTab: string;
  setActiveServiceTab: (tab: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams, options?: { replace?: boolean }) => void;
}

const SERVICE_CENTER_TAB_INFO: Record<string, { label: string; description: string; author: string; order: number }> = {
  technology: {
    label: 'Technology',
    description: 'Access technology-related services including IT support, software requests, system access, and technical assistance.',
    author: 'Managed by DQ IT Support and Technical teams.',
    order: 0
  },
  business: {
    label: 'Employee Services',
    description: 'Explore employee services including HR support, finance services, administrative requests, and operational assistance.',
    author: 'Provided by DQ HR, Finance, and Administrative teams.',
    order: 1
  },
  digital_worker: {
    label: 'Digital Worker',
    description: 'Discover digital worker services including automation solutions, AI agents requests, AI tools and usage guidelines',
    author: 'Handled by DQ Automation Teams.',
    order: 2
  },
  prompt_library: {
    label: 'Prompt Library',
    description: "A curated collection of your team's best and previously used prompts to speed up workflows and boost productivity.",
    author: 'Curated and maintained by DQ Digital Innovation Teams.',
    order: 3
  },
  ai_tools: {
    label: 'AI Tools',
    description: 'A centralized hub showcasing all AI tools and solutions used across the company.',
    author: 'Provided by DQ AI & Innovation Teams.',
    order: 4
  }
};

export const ServiceCenterContent: React.FC<ServiceCenterContentProps> = ({
  isServicesCenter,
  activeServiceTab,
  setActiveServiceTab,
  searchParams,
  setSearchParams
}) => {
  if (!isServicesCenter || !SERVICE_CENTER_TAB_INFO[activeServiceTab]) return null;
  const info = SERVICE_CENTER_TAB_INFO[activeServiceTab];

  return (
    <>
      <div className="mb-6">
        <div className="mb-4 p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current focus</p>
              <p className="text-lg font-semibold text-gray-900 mb-1">{info.label}</p>
            </div>
            <button className="px-3 py-1.5 rounded-full text-xs font-medium text-blue-700" style={{ backgroundColor: '#DBEAFE' }}>
              Tab overview
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-1">{info.description}</p>
          <p className="text-xs text-gray-500">{info.author}</p>
        </div>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Service tabs">
          {Object.entries(SERVICE_CENTER_TAB_INFO).sort((a,b) => a[1].order - b[1].order).map(([tabId, tabInfo]) => {
            const isActive = activeServiceTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => {
                  setActiveServiceTab(tabId);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('tab', tabId);
                  setSearchParams(newParams, { replace: false });
                }}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                   isActive ? 'border-blue-700' : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
                style={isActive ? { color: '#030F35', borderColor: '#030F35' } : {}}
                aria-current={isActive ? 'page' : undefined}
              >
                {tabInfo.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
