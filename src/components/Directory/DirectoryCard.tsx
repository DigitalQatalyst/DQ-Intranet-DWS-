import React from 'react';

export type DirectoryCardData = {
  logoUrl?: string;
  title: string;
  tag: string;
  description: string;
  towers?: string[];
  roleInfo?: {
    role: string;
    unit: string;
    email?: string;
  };
  onViewProfile?: () => void;
};

const getInitial = (title: string) => title?.[0]?.toUpperCase() ?? 'D';

/**
 * DQ-style unified directory card for Units and Associates
 * Clean, professional layout with consistent spacing and navy-blue theme
 */
export const DirectoryCard: React.FC<DirectoryCardData> = ({
  logoUrl,
  title,
  tag,
  description,
  towers,
  roleInfo,
  onViewProfile,
}) => {
  const hasTowers = Boolean(towers && towers.length);
  const hasRoleInfo = Boolean(roleInfo);
  const initial = getInitial(title);

  const renderInfoBlock = () => {
    if (hasTowers) {
      return (
        <div className="flex flex-wrap gap-2">
          {towers!.map((tower, index) => (
            <span
              key={index}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
              style={{ border: '1px solid #E3E7F8' }}
            >
              {tower}
            </span>
          ))}
        </div>
      );
    }

    if (hasRoleInfo && roleInfo) {
      return (
        <div className="space-y-1 text-sm">
          <div className="font-semibold text-[#131E42]" title={roleInfo.role}>
            {roleInfo.role}
          </div>
          <div className="text-xs text-[#25406F]" title={roleInfo.unit}>
            {roleInfo.unit}
          </div>
          {roleInfo.email && (
            <div className="text-xs text-[#5B6785] truncate" title={roleInfo.email}>
              {roleInfo.email}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <article
      className="bg-white border transition-all duration-200 flex flex-col"
      style={{
        borderColor: 'rgba(0,0,0,0.05)',
        borderRadius: '14px',
        padding: '26px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        // Fixed height to keep all directory cards visually consistent
        height: '460px',
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
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`${hasRoleInfo ? 'w-12 h-12' : 'w-10 h-10'} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}
              style={{ backgroundColor: '#F4F6FA' }}
              aria-hidden="true"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span
                  className="font-semibold"
                  style={{ color: '#25406F', fontSize: hasRoleInfo ? '16px' : '14px' }}
                >
                  {initial}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="font-bold leading-tight mb-1.5 clamp-2"
                style={{ color: '#131E42', fontSize: '16px' }}
                title={title}
              >
                {title}
              </h3>
              <span
                className="inline-block px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#EEF2FF', color: '#002180', fontSize: '11.5px' }}
              >
                {tag}
              </span>
            </div>
          </div>

          <p
            className="text-sm leading-relaxed clamp-3"
            style={{ color: '#3C4659', fontSize: '14px' }}
            title={description}
          >
            {description}
          </p>
        </div>

        {/* Bottom block: info panel + CTA pinned to bottom */}
        <div className="mt-auto space-y-4">
          {(hasTowers || hasRoleInfo) && (
            <div className="rounded-2xl bg-slate-50 p-3">{renderInfoBlock()}</div>
          )}

          {/* CTA Button (DQ Navy) */}
          <button
            type="button"
            onClick={onViewProfile}
            className="mt-6 w-full font-semibold transition-all"
            style={{
              height: '48px',
              borderRadius: '12px',
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
        </div>
      </div>
    </article>
  );
};
