import React, { useState } from 'react';
import { cn } from '@/lib/media-center-utils';
import { Check } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  content: RichContent[];
}

interface RichContent {
  type: 'heading' | 'paragraph' | 'checklist' | 'divider' | 'custom';
  content?: string;
  items?: string[];
  custom?: React.ReactNode;
  accentColor?: string;
}

interface TabContentProps {
  tabs: TabItem[];
  className?: string;
}

const TabContent: React.FC<TabContentProps> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const renderRichContent = (content: RichContent[]) => {
    return content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return (
            <h2 
              key={index}
              className="text-2xl font-bold text-[hsl(0_0%_4%)] mb-4 relative pl-4"
            >
              {block.accentColor && (
                <span 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                  style={{ backgroundColor: block.accentColor }}
                />
              )}
              {block.content}
            </h2>
          );

        case 'paragraph':
          return (
            <p key={index} className="text-[hsl(0_0%_64%)] leading-relaxed mb-4">
              {block.content}
            </p>
          );

        case 'checklist':
          return (
            <ul key={index} className="space-y-2 mb-4">
              {block.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <Check 
                    size={16} 
                    className="text-[hsl(160_100%_50%)] mt-0.5 flex-shrink-0" 
                  />
                  <span className="text-[hsl(0_0%_64%)]">{item}</span>
                </li>
              ))}
            </ul>
          );

        case 'divider':
          return (
            <hr 
              key={index} 
              className="border-[hsl(0_0%_88%)] my-6"
            />
          );

        case 'custom':
          return <div key={index}>{block.custom}</div>;

        default:
          return null;
      }
    });
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Bar */}
      <div className="border-b border-[hsl(0_0%_88%)]">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-[hsl(210_100%_70%)] text-[hsl(210_100%_70%)]'
                  : 'border-transparent text-[hsl(0_0%_64%)] hover:text-[hsl(0_0%_4%)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'space-y-6',
              activeTab === tab.id ? 'block' : 'hidden'
            )}
          >
            {renderRichContent(tab.content)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContent;
