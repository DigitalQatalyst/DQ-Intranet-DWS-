import React from 'react';
import type { Unit } from '../../types/directory';

interface UnitCardProps {
  unit: Unit;
}

// Priority order for tag selection
const tagPriority = [
  'Governance', 'Operations', 'Platform', 'Delivery',
  'HRA', 'Finance', 'Intelligence', 'Solutions', 'SecDevOps', 'Products'
];


// Select primary tag based on priority
const getPrimaryTag = (unit: Unit): string => {
  // Check sector first
  if (tagPriority.includes(unit.sector)) {
    return unit.sector;
  }
  
  // Check streams
  if (unit.streams) {
    for (const priority of tagPriority) {
      if (unit.streams.includes(priority)) {
        return priority;
      }
    }
  }
  
  // Check tags
  if (unit.tags) {
    for (const priority of tagPriority) {
      if (unit.tags.includes(priority)) {
        return priority;
      }
    }
  }
  
  // Default to sector
  return unit.sector;
};

// Use existing descriptions (already concise)
const getDescription = (unit: Unit): string => {
  return unit.description || '';
};

export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const primaryTag = getPrimaryTag(unit);
  const description = getDescription(unit);
  const initial = unit.name.charAt(0).toUpperCase();

  return (
    <article
      className="bg-white border transition-all duration-200"
      style={{
        borderColor: '#E3E7F8',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D4DBF1';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(19, 30, 66, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E3E7F8';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
      }}
    >
      {/* Logo + Title + Pill */}
      <div className="flex items-center gap-3 mb-4">
        {/* Logo / Monogram */}
        {unit.logoUrl ? (
          <img
            src={unit.logoUrl}
            alt=""
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-base"
            style={{
              backgroundColor: '#EEF3FF',
              color: '#25406F',
            }}
          >
            {initial}
          </div>
        )}

        {/* Title + Tag */}
        <div className="min-w-0 flex-1">
          <h3
            className="font-bold truncate mb-1"
            style={{
              color: '#131E42',
              fontSize: '16px',
              lineHeight: '1.4',
            }}
            title={unit.name}
          >
            {unit.name}
          </h3>
          <span
            className="inline-block text-xs rounded-full px-2 py-0.5"
            style={{
              color: '#25406F',
              backgroundColor: '#EEF3FF',
              border: '1px solid #D9E2FF',
              fontWeight: 500,
            }}
          >
            {primaryTag}
          </span>
        </div>
      </div>

      {/* Description - exactly 2 lines */}
      <p
        className="text-sm line-clamp-2 mb-4"
        style={{
          color: '#475569',
          lineHeight: '1.5',
        }}
        title={description}
      >
        {description}
      </p>

      {/* Towers Block */}
      {unit.streams && unit.streams.length > 0 && (
        <div
          className="rounded-xl mb-4"
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E3E7F8',
            padding: '12px',
          }}
        >
          <div className="flex flex-wrap gap-1.5">
            {unit.streams.map((stream, index) => (
              <span
                key={index}
                className="text-xs rounded-md px-2 py-1"
                style={{
                  backgroundColor: '#E3E7F8',
                  color: '#25406F',
                  fontWeight: 500,
                }}
              >
                {stream}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gradient Button (DWS Style) */}
      <a
        href={unit.marketplaceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(90deg, #002180 0%, #FB5535 100%)',
          color: '#FFFFFF',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 33, 128, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        aria-label={`View profile for ${unit.name}`}
      >
        View Profile
      </a>
    </article>
  );
};

