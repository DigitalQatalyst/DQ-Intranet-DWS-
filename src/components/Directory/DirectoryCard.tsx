import React from 'react';

export type DirectoryCardData = {
  logoUrl?: string;
  title: string;
  tag: string;
  description: string;
  towers?: string[];        // For Units: tower badges
  roleInfo?: {              // For Associates: role/unit info
    role: string;
    unit: string;
    email?: string;
  };
  onClick: () => void;
};

/**
 * EJP-style unified directory card for Units and Associates
 * Clean, professional layout with consistent spacing and navy-blue theme
 */
export const DirectoryCard: React.FC<DirectoryCardData> = ({
  logoUrl,
  title,
  tag,
  description,
  towers,
  roleInfo,
  onClick,
}) => {
  const initial = title?.[0]?.toUpperCase() ?? 'D';
  const hasTowers = towers && towers.length > 0;
  const hasRoleInfo = roleInfo !== undefined;

  return (
    <article
      className="bg-white border transition-all duration-200 flex flex-col"
      style={{
        borderColor: '#E3E7F8',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        minHeight: '320px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D4DBF1';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E3E7F8';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Header: Logo/Avatar + Title + Tag */}
      <div className="flex items-start gap-3 mb-3">
        {/* Circular Logo/Avatar (48x48px for Associates) */}
        <div
          className={`${hasRoleInfo ? 'w-12 h-12' : 'w-10 h-10'} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}
          style={{
            backgroundColor: '#F4F6FA',
          }}
          aria-hidden="true"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span
              className="font-semibold"
              style={{
                color: '#25406F',
                fontSize: hasRoleInfo ? '16px' : '14px',
              }}
            >
              {initial}
            </span>
          )}
        </div>

        {/* Title + Tag */}
        <div className="min-w-0 flex-1">
          <h3
            className="font-bold leading-tight mb-1.5"
            style={{
              color: '#131E42',
              fontSize: '16px',
            }}
            title={title}
          >
            {title}
          </h3>
          <span
            className="inline-block px-2.5 py-1 rounded-full font-medium"
            style={{
              backgroundColor: '#EEF2FF',
              color: '#002180',
              fontSize: '11.5px',
            }}
          >
            {tag}
          </span>
        </div>
      </div>

      {/* Description (exactly 2 lines) */}
      <p
        className="text-sm leading-relaxed clamp-2 mb-4 flex-grow"
        style={{
          color: '#3C4659',
          fontSize: '14px',
        }}
        title={description}
      >
        {description}
      </p>

      {/* Tower Box (for Units) OR Role Info Box (for Associates) */}
      {(hasTowers || hasRoleInfo) && (
        <div
          className="rounded-lg mb-4"
          style={{
            backgroundColor: '#F7F8FB',
            padding: '12px 14px',
            minHeight: '60px',
          }}
        >
          {/* Towers: Render as mini-pills */}
          {hasTowers && (
            <div className="flex flex-wrap gap-1.5">
              {towers!.map((tower, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 rounded-lg font-medium"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#25406F',
                    fontSize: '12px',
                    border: '1px solid #E3E7F8',
                  }}
                >
                  {tower}
                </span>
              ))}
            </div>
          )}

          {/* Role Info: Show Role, Unit, Email */}
          {hasRoleInfo && (
            <div className="space-y-1">
              <div
                className="font-medium text-sm"
                style={{ color: '#131E42' }}
                title={roleInfo!.role}
              >
                {roleInfo!.role}
              </div>
              <div
                className="text-xs"
                style={{ color: '#25406F' }}
                title={roleInfo!.unit}
              >
                {roleInfo!.unit}
              </div>
              {roleInfo!.email && (
                <div
                  className="text-xs truncate"
                  style={{ color: '#5B6785' }}
                  title={roleInfo!.email}
                >
                  {roleInfo!.email}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CTA Button (EJP Navy) */}
      <button
        onClick={onClick}
        className="w-full font-semibold transition-all"
        style={{
          height: '44px',
          borderRadius: '10px',
          backgroundColor: 'var(--dws-navy)',
          color: 'var(--dws-white)',
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--dws-navy-press)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 30, 103, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--dws-navy)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--dws-outline)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
        aria-label={`View profile for ${title}`}
      >
        View Profile
      </button>
    </article>
  );
};
