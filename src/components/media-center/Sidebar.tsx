import React from 'react';
import { cn } from '@/lib/media-center-utils';
import { Button } from '@/components/ui/media-center-button';

interface MetadataItem {
  label: string;
  value: string;
}

interface SidebarProps {
  title: string;
  metadata: MetadataItem[];
  primaryCTA: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  title, 
  metadata, 
  primaryCTA, 
  secondaryCTA,
  className 
}) => {
  return (
    <div className={cn('sticky top-8', className)}>
      {/* Summary Card */}
      <div className="bg-[hsl(0_0%_100%)] border border-[hsl(0_0%_88%)] rounded-xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-[hsl(0_0%_98%)] px-4 py-3 border-b border-[hsl(0_0%_88%)]">
          <h3 className="font-semibold text-[hsl(0_0%_4%)]">{title}</h3>
        </div>

        {/* Metadata Rows */}
        <div className="p-4 space-y-3">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-[hsl(0_0%_64%)]">{item.label}</span>
              <span className="text-sm font-medium text-[hsl(0_0%_4%)]">{item.value}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="p-4 space-y-3 border-t border-[hsl(0_0%_88%)]">
          {/* Primary CTA */}
          <Button
            onClick={primaryCTA.onClick}
            className="w-full bg-[hsl(210_100%_70%)] hover:bg-[hsl(210_100%_60%)] text-white"
          >
            {primaryCTA.text}
          </Button>

          {/* Secondary CTA */}
          {secondaryCTA && (
            <Button
              variant="outline"
              onClick={secondaryCTA.onClick}
              className="w-full border-[hsl(0_0%_88%)] text-[hsl(0_0%_4%)] hover:bg-[hsl(0_0%_98%)]"
            >
              {secondaryCTA.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
