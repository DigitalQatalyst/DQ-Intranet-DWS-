import React from 'react';
import { designTokens } from './designTokens';
export interface ResponsiveCardGridProps {
  children: React.ReactNode;
  className?: string;
  'data-id'?: string;
}
export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  children,
  className = '',
  'data-id': dataId
}) => {
  // Use an auto-fit grid so cards are centered and extra empty columns don't appear
  // by default we create columns that are at least 280px and grow to fill available space
  const autoFitClass = 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]';
  return (
    <div
      className={`grid ${autoFitClass} ${designTokens.responsive.gap} ${className}`}
      data-id={dataId}
    >
      {children}
    </div>
  );
};