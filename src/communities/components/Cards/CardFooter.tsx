import React from 'react';
export interface CardFooterProps {
  primaryCTA?: {
    text: string;
    onClick: (e: React.MouseEvent) => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryCTA?: {
    text: string;
    onClick: (e: React.MouseEvent) => void;
  };
  actions?: React.ReactNode;
}
export const CardFooter: React.FC<CardFooterProps> = ({
  primaryCTA,
  secondaryCTA,
  actions
}) => {
  if (!primaryCTA && !secondaryCTA && !actions) {
    return null;
  }
  return (
    <div className="mt-auto border-t border-gray-100 p-4 pt-5">
      {actions && <div className="mb-4">{actions}</div>}
      {(primaryCTA || secondaryCTA) && (
        <div className="flex flex-col gap-3">
          {secondaryCTA && (
            <button
              onClick={secondaryCTA.onClick}
              className="w-full h-10 px-4 py-2 text-sm font-medium text-dq-navy bg-white border border-dq-navy rounded-md hover:bg-dq-navy/10 transition-colors whitespace-nowrap flex items-center justify-center"
            >
              {secondaryCTA.text}
            </button>
          )}
          {primaryCTA && (
            <button
              type="button"
              onClick={(e) => {
                console.log('🔵 CardFooter: Primary CTA button clicked', { text: primaryCTA.text });
                primaryCTA.onClick(e);
              }}
              className={`w-full h-10 px-4 py-2 text-sm font-bold rounded-md transition-colors whitespace-nowrap flex items-center justify-center ${
                primaryCTA.variant === 'secondary'
                  ? 'text-dq-navy bg-white border border-dq-navy hover:bg-dq-navy/10'
                  : 'text-white bg-dq-navy hover:bg-[#13285A]'
              }`}
            >
              {primaryCTA.text}
            </button>
          )}
        </div>
      )}
    </div>
  );
};