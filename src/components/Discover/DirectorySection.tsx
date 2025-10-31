import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Phone, Mail, Globe, Building2, User } from 'lucide-react';

export type DirectoryItem = {
  id: string;
  name: string;
  tag?: string;
  logoUrl?: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  sector?: string; // DCO Operations, DBP Platform, DBP Delivery
  factory?: string; // HRA, Finance, Intelligence, etc.
  region?: 'Anyshore' | 'Offshore' | 'Nearshore';
  href: string;
};

export type AssociateItem = {
  id: string;
  name: string;
  role: string;
  unit: string;
  email: string;
  photo?: string;
  phone?: string;
  href: string;
};

type ViewMode = 'unit' | 'associate';

interface DirectorySectionProps {
  items: DirectoryItem[];
  associates?: AssociateItem[];
  onSearch?: (query: string) => void;
  categories?: string[];
  title?: string;
  subtitle?: string;
  note?: string;
  showRegionLegend?: boolean;
}

// DQ2.0 Sector colors
const sectorColors: Record<string, { text: string; bg: string }> = {
  'DCO Operations': { text: '#0E1446', bg: '#DCFCE7' }, // Light green
  'DBP Platform': { text: '#0E1446', bg: '#E0E7FF' }, // Light indigo
  'DBP Delivery': { text: '#0E1446', bg: '#DBEAFE' }, // Light blue
};

// Region colors (shore model)
const regionColors: Record<string, string> = {
  'Anyshore': '#B33426', // Red
  'Offshore': '#2E9C59', // Green
  'Nearshore': '#1C2E6E', // Blue
};

const categoryColors: Record<string, { text: string; bg: string }> = {
  'The Vision': { text: '#0E1446', bg: '#EEF2FF' },
  'The HoV': { text: '#0E1446', bg: '#FFF1F2' },
  'The Personas': { text: '#0E1446', bg: '#F0F9FF' },
  'Agile TMS': { text: '#0E1446', bg: '#FFF7ED' },
  'Agile SOS': { text: '#0E1446', bg: '#EEF2FF' },
  'Agile Flows': { text: '#0E1446', bg: '#F0FDF4' },
  'Agile DTMF': { text: '#0E1446', bg: '#FEF3F2' },
  Innovation: { text: '#0E1446', bg: '#FFF7ED' },
  Learning: { text: '#0E1446', bg: '#F0F9FF' },
  Technology: { text: '#0E1446', bg: '#E9EEFF' },
  Finance: { text: '#0E1446', bg: '#E9EEFF' },
  Healthcare: { text: '#0E1446', bg: '#EAF7FF' },
  'Learning & Development': { text: '#0E1446', bg: '#F0F9FF' },
  'Project Delivery': { text: '#0E1446', bg: '#FEF3F2' },
  'Support & Services': { text: '#0E1446', bg: '#F0FDF4' },
  Community: { text: '#0E1446', bg: '#FDF4FF' },
  default: { text: '#0E1446', bg: '#F3F4F6' },
};

export const DirectorySection: React.FC<DirectorySectionProps> = ({
  items,
  associates = [],
  onSearch,
  categories = [],
  title = 'DQ Directory',
  subtitle = 'Connect with DQ associates and teams driving workspace impact.',
  note,
  showRegionLegend = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('unit');
  const navigate = useNavigate();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (onSearch) onSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Filter items (including new org fields)
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    const lower = debouncedQuery.toLowerCase();
    return items.filter((item) =>
      [item.name, item.tag, item.description, item.email, item.phone, item.sector, item.factory, item.region]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(lower)
    );
  }, [items, debouncedQuery]);

  // Filter associates
  const filteredAssociates = useMemo(() => {
    if (!debouncedQuery.trim()) return associates;
    const lower = debouncedQuery.toLowerCase();
    return associates.filter((associate) =>
      [associate.name, associate.role, associate.unit, associate.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(lower)
    );
  }, [associates, debouncedQuery]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    if (onSearch) onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const handleViewProfile = (item: DirectoryItem) => {
    navigate(item.href);
  };

  const getCategoryStyle = (category?: string) => {
    return categoryColors[category || 'default'] || categoryColors.default;
  };

  const getSectorStyle = (sector?: string) => {
    return sectorColors[sector || ''] || categoryColors.default;
  };

  const getRegionColor = (region?: string) => {
    return regionColors[region || ''] || '#6B7280';
  };

  const currentItems = viewMode === 'unit' ? filteredItems : [];
  const currentAssociates = viewMode === 'associate' ? filteredAssociates : [];
  const hasResults = currentItems.length > 0 || currentAssociates.length > 0;

  return (
    <section
      id="directory"
      className="py-16 md:py-24 pb-20"
      style={{ backgroundColor: '#F9FAFB' }}
      aria-labelledby="dir-heading"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="text-center md:text-left flex-1">
              <h2
                id="dir-heading"
                className="text-[34px] md:text-[40px] font-extrabold tracking-tight leading-tight mb-3"
                style={{ color: '#131E42' }}
              >
                {title}
              </h2>
              <p className="text-sm md:text-base max-w-[680px] leading-6" style={{ color: '#6B7280' }}>
                {subtitle}
              </p>
            </div>

            {/* Region Legend */}
            {showRegionLegend && (
              <div className="bg-white rounded-lg border px-4 py-3 shadow-sm" style={{ borderColor: '#E3E7F8' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#131E42' }}>Shore Model</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#B33426' }}></div>
                    <span style={{ color: '#25406F' }}>Anyshore</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2E9C59' }}></div>
                    <span style={{ color: '#25406F' }}>Offshore</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1C2E6E' }}></div>
                    <span style={{ color: '#25406F' }}>Nearshore</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg p-1" role="tablist" style={{ backgroundColor: '#E3E7F8' }}>
            <button
              onClick={() => setViewMode('unit')}
              className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
                viewMode === 'unit'
                  ? 'shadow-sm'
                  : 'hover:bg-white/50'
              }`}
              style={{
                backgroundColor: viewMode === 'unit' ? '#fff' : 'transparent',
                color: viewMode === 'unit' ? '#131E42' : '#6B7280',
              }}
              aria-label="View units"
              role="tab"
              aria-selected={viewMode === 'unit'}
            >
              <Building2 size={16} className="inline mr-2" />
              Unit
            </button>
            <button
              onClick={() => setViewMode('associate')}
              className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
                viewMode === 'associate'
                  ? 'shadow-sm'
                  : 'hover:bg-white/50'
              }`}
              style={{
                backgroundColor: viewMode === 'associate' ? '#fff' : 'transparent',
                color: viewMode === 'associate' ? '#131E42' : '#6B7280',
              }}
              aria-label="View associates"
              role="tab"
              aria-selected={viewMode === 'associate'}
            >
              <User size={16} className="inline mr-2" />
              Associate
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row gap-2 md:gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search size={16} className="text-[#6B7280]" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people, teams, or keywords…"
                className="w-full h-12 pl-11 pr-4 rounded-lg border border-neutral-200 shadow-[0_1px_3px_rgba(14,20,70,.06)] focus:outline-none focus:ring-2 focus:ring-[#1433FF] focus:border-[#1433FF] transition-all text-sm"
                aria-label="Search directory"
              />
            </div>

            {/* Filter & Search Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 w-11 flex items-center justify-center rounded-lg border border-neutral-300 hover:border-[#1433FF] hover:bg-[#F0F4FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1433FF] focus-visible:ring-offset-2"
                aria-label="Open filters"
              >
                <Filter size={18} className="text-[#4B5563]" />
              </button>
              <button
                type="submit"
                className="h-11 px-6 bg-[#1433FF] text-white font-semibold rounded-lg hover:bg-[#0E28CC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1433FF] focus-visible:ring-offset-2 text-sm"
                aria-label="Search directory"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Grid */}
        {!hasResults ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#F9FAFB] border border-dashed border-neutral-300 rounded-xl">
            <Building2 size={48} className="text-neutral-400 mb-4" />
            <p className="text-neutral-600 text-center text-sm">
              No matches found. Try different keywords or clear filters.
            </p>
          </div>
        ) : viewMode === 'unit' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {currentItems.map((item) => {
              const sectorStyle = item.sector ? getSectorStyle(item.sector) : getCategoryStyle(item.category || item.tag);
              const regionColor = item.region ? getRegionColor(item.region) : null;
              
              return (
              <article
                key={item.id}
                className="group bg-white rounded-xl shadow-[0_10px_18px_rgba(14,20,70,.05)] hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 flex flex-col min-h-[220px]"
                style={{ 
                  border: '1px solid #E3E7F8',
                  borderTop: regionColor ? `3px solid ${regionColor}` : '1px solid #E3E7F8'
                }}
              >
                  <div className="p-5 flex flex-col flex-1">
                    {/* Header Row */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Logo/Icon */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1433FF]/10 to-[#1433FF]/5 flex items-center justify-center flex-shrink-0">
                        <Building2 size={18} className="text-[#1433FF]" />
                      </div>

                      {/* Title Stack */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] md:text-[16px] font-bold leading-tight mb-1.5" style={{ color: '#131E42' }}>
                          {item.name}
                        </h3>
                        
                        {/* Sector & Factory Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {item.sector && (
                            <span
                              className="inline-block text-[11px] md:text-[12px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                color: sectorStyle.text,
                                backgroundColor: sectorStyle.bg,
                              }}
                            >
                              {item.sector}
                            </span>
                          )}
                          {item.factory && (
                            <span
                              className="inline-block text-[10px] md:text-[11px] font-medium px-2 py-0.5 rounded-full"
                              style={{
                                color: '#25406F',
                                backgroundColor: '#E3E7F8',
                              }}
                            >
                              {item.factory}
                            </span>
                          )}
                        </div>

                        {/* Region Badge (if no sector/factory, show old tag/category) */}
                        {!item.sector && (item.tag || item.category) && (
                          <span
                            className="inline-block text-[11px] md:text-[12px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              color: sectorStyle.text,
                              backgroundColor: sectorStyle.bg,
                              opacity: 0.9,
                            }}
                          >
                            {item.tag || item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13.5px] md:text-[14px] text-[#4B5563] leading-relaxed mb-4 clamp-2 flex-1">
                      {item.description}
                    </p>

                    {/* Contact Panel */}
                    {(item.phone || item.email || item.website) && (
                      <div className="bg-[#F7F9FF] border border-[#E8ECF5] rounded-lg p-3 mb-4 space-y-2">
                        {item.phone && (
                          <div className="flex items-center gap-2 text-xs text-[#475569]">
                            <Phone size={14} className="flex-shrink-0" />
                            <a
                              href={`tel:${item.phone}`}
                              className="hover:text-[#1433FF] transition-colors truncate"
                              title={item.phone}
                            >
                              {item.phone}
                            </a>
                          </div>
                        )}
                        {item.email && (
                          <div className="flex items-center gap-2 text-xs text-[#475569]">
                            <Mail size={14} className="flex-shrink-0" />
                            <a
                              href={`mailto:${item.email}`}
                              className="hover:text-[#1433FF] transition-colors truncate"
                              title={item.email}
                            >
                              {item.email}
                            </a>
                          </div>
                        )}
                        {item.website && (
                          <div className="flex items-center gap-2 text-xs text-[#475569]">
                            <Globe size={14} className="flex-shrink-0" />
                            <a
                              href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                              className="hover:text-[#1433FF] transition-colors truncate"
                              target="_blank"
                              rel="noopener noreferrer"
                              title={item.website}
                            >
                              {item.website}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer CTA */}
                    <button
                      onClick={() => handleViewProfile(item)}
                      className="w-full h-10 rounded-lg font-semibold text-sm text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        background: 'linear-gradient(135deg, #002180 0%, #FB5535 100%)',
                        border: 'none',
                      }}
                      aria-label={`View profile for ${item.name}`}
                    >
                      View Profile
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Associate View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {currentAssociates.map((associate) => (
              <article
                key={associate.id}
                className="group bg-white rounded-xl shadow-[0_10px_18px_rgba(14,20,70,.05)] hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 flex flex-col min-h-[220px]"
                style={{ border: '1px solid #E3E7F8' }}
              >
                <div className="p-5 flex flex-col flex-1">
                  {/* Photo & Name */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                      style={{ background: 'linear-gradient(135deg, #002180 0%, #FB5535 100%)' }}
                    >
                      {associate.photo ? (
                        <img
                          src={associate.photo}
                          alt={associate.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        associate.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[16px] font-bold leading-tight mb-1"
                        style={{ color: '#131E42' }}
                      >
                        {associate.name}
                      </h3>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#25406F' }}>
                        {associate.role}
                      </p>
                      <span
                        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          color: '#002180',
                          backgroundColor: '#E3E7F8',
                        }}
                      >
                        {associate.unit}
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div
                    className="p-3 rounded-lg mb-4 space-y-2"
                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E3E7F8' }}
                  >
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#25406F' }}>
                      <Mail size={14} className="flex-shrink-0" />
                      <a
                        href={`mailto:${associate.email}`}
                        className="hover:underline truncate"
                        title={associate.email}
                      >
                        {associate.email}
                      </a>
                    </div>
                    {associate.phone && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#25406F' }}>
                        <Phone size={14} className="flex-shrink-0" />
                        <a href={`tel:${associate.phone}`} className="hover:underline">
                          {associate.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(associate.href)}
                    className="w-full h-10 rounded-lg font-semibold text-sm text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, #002180 0%, #FB5535 100%)',
                      border: 'none',
                    }}
                    aria-label={`View profile for ${associate.name}`}
                  >
                    View Profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View Full Directory CTA */}
        {hasResults && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/marketplace/directory')}
              className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-8 py-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: 'linear-gradient(135deg, #002180 0%, #FB5535 100%)',
              }}
              aria-label="View full directory in marketplace"
            >
              View Full Directory
            </button>
          </div>
        )}

        {/* DNA Identity Note */}
        {note && (
          <div className="mt-12 px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border rounded-xl" style={{ borderColor: '#E3E7F8' }}>
            <p className="text-sm md:text-base text-center leading-relaxed" style={{ color: '#25406F' }}>
              <span className="font-semibold" style={{ color: '#131E42' }}>DQ DNA — The Personas (Identity):</span> {note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DirectorySection;
