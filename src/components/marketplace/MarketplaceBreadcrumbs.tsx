import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';

interface MarketplaceBreadcrumbsProps {
  isGuides: boolean;
  isServicesCenter: boolean;
  config: { title: string; route: string; itemNamePlural: string };
  activeServiceTab: string;
}

const SERVICE_CENTER_TAB_INFO: Record<string, { label: string }> = {
  technology: { label: 'Technology' },
  business: { label: 'Employee Services' },
  digital_worker: { label: 'Digital Worker' },
  prompt_library: { label: 'Prompt Library' },
  ai_tools: { label: 'AI Tools' }
};

export const MarketplaceBreadcrumbs: React.FC<MarketplaceBreadcrumbsProps> = ({
  isGuides,
  isServicesCenter,
  config,
  activeServiceTab
}) => (
  <nav className="flex mb-4" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-2">
      <li className="inline-flex items-center">
        <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
          <HomeIcon size={16} className="mr-1" />
          <span>Home</span>
        </Link>
      </li>
      {isGuides ? (
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRightIcon size={16} className="text-gray-400" />
            <span className="ml-1 text-gray-700 md:ml-2">{config.title}</span>
          </div>
        </li>
      ) : (
        <>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <Link to={config.route} className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                {config.itemNamePlural}
              </Link>
            </div>
          </li>
          {isServicesCenter && activeServiceTab && SERVICE_CENTER_TAB_INFO[activeServiceTab] && (
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-700 md:ml-2">
                  {SERVICE_CENTER_TAB_INFO[activeServiceTab].label}
                </span>
              </div>
            </li>
          )}
        </>
      )}
    </ol>
  </nav>
);
