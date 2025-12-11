import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { DirectoryCard, DirectoryCardData } from '../Directory/DirectoryCard';
import DirectoryAssociateModal, {
  DirectoryAssociateProfile,
} from '../Directory/DirectoryAssociateModal';
import { useWorkUnits, useAssociates } from '../../hooks/useWorkDirectory';
import type { ViewMode, SectorType } from '../../types/directory';
import type { WorkUnit, WorkAssociate } from '../../data/workDirectoryTypes';

interface Discover_DirectorySectionProps {
  title?: string;
  subtitle?: string;
}

/**
 * Map WorkUnit to unified DirectoryCardData
 */
const mapWorkUnitToCard = (workUnit: WorkUnit): DirectoryCardData => ({
  logoUrl: workUnit.bannerImageUrl || undefined,
  title: workUnit.unitName,
  tag: workUnit.sector,
  description: workUnit.mandate || workUnit.currentFocus || '',
  towers: workUnit.focusTags || workUnit.wiAreas || undefined,
});

/**
 * Map WorkAssociate to unified Associate type used in Discover_DirectorySection
 */
const mapWorkAssociateToAssociate = (workAssociate: WorkAssociate): Associate => {
  // Extract first skill/tag for the tag field
  const tag = workAssociate.keySkills?.[0] || workAssociate.department || workAssociate.currentRole || '';
  
  return {
    name: workAssociate.name,
    title: workAssociate.currentRole,
    role: workAssociate.currentRole,
    unit: workAssociate.unit,
    tag: tag,
    email: workAssociate.email,
    mobile: workAssociate.phone || undefined,
    location: workAssociate.location,
    company: 'DigitalQatalyst',
    sector: inferSectorFromTag(tag, workAssociate.unit),
  };
};

type Associate = {
  name: string;
  title: string;
  role: string;
  unit: string;
  tag: string;
  email?: string;
  mobile?: string;
  location?: string;
  company?: string;
  website?: string;
  sector?: SectorType;
};

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();

const sanitizeTelHref = (value: string): string => value.replace(/\s+/g, '');

const inferSectorFromTag = (tag: string, unit: string): SectorType => {
  const text = `${tag} ${unit}`.toLowerCase();
  if (text.includes('governance')) return 'Governance';
  if (
    text.includes('operation') ||
    text.includes('hra') ||
    text.includes('coe') ||
    text.includes('o2p')
  ) {
    return 'Operations';
  }
  if (
    text.includes('deliver') ||
    text.includes('deploy') ||
    text.includes('design') ||
    text.includes('account')
  ) {
    return 'Delivery';
  }
  return 'Platform';
};

const getDescription = (associate: Associate): string => {
  const title = associate.title?.trim();
  const role = associate.role?.trim();
  if (title && role) {
    return title.length <= role.length ? title : role;
  }
  return title || role || '';
};

const getOneLiner = (a: Associate): string => {
  const parts = [a.title?.trim(), a.role?.trim()].filter(Boolean);
  return parts.join(' • ');
};

const mapAssociateToProfile = (associate: Associate): DirectoryAssociateProfile => ({
  name: associate.name,
  roleTitle: getOneLiner(associate) || associate.title || associate.role,
  unitName: associate.unit || 'DigitalQatalyst',
  tag: associate.tag,
  email: associate.email,
  phone: associate.mobile,
  location: associate.location,
  studio: associate.company,
  description: getDescription(associate) || undefined,
  skills: associate.tag ? [associate.tag] : undefined,
});

const CARD_BASE =
  'rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition';
const PAD = 'flex min-h-[360px] flex-col p-6';
const META_PANEL = 'rounded-xl bg-slate-50 p-4 mb-4';
const CTA_NAVY =
  'w-full rounded-xl bg-[#131E42] text-white text-sm py-2.5 font-semibold hover:bg-[#0F1633] transition-colors';

interface AssociateCardProps {
  associate: Associate;
  onOpen: (associate: Associate) => void;
}

const AssociateCard: React.FC<AssociateCardProps> = ({ associate, onOpen }) => {
  const { name, tag, email, mobile, location, website } = associate;
  const mailHref = email ? `mailto:${email}` : undefined;
  const phoneHref = mobile ? `tel:${sanitizeTelHref(mobile)}` : undefined;
  const description = getDescription(associate);
  const oneLiner = getOneLiner(associate);
  const locationLabel = website ? website.replace(/^https?:\/\//, '') : location;
  const websiteHref =
    website && (website.startsWith('http://') || website.startsWith('https://'))
      ? website
      : website
      ? `https://${website}`
      : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(associate)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(associate);
        }
      }}
      className={`${CARD_BASE} focus:outline-none focus:ring-2 focus:ring-[#131E42]/40`}
    >
      <div className={PAD}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
            {initials(name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">{name}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {tag}
              </span>
            </div>
            {description && (
              <p className="mt-1 text-sm text-slate-600 clamp-2">{description}</p>
            )}
            {oneLiner && (
              <p className="mt-2 text-[13px] leading-5 text-slate-600 clamp-2">{oneLiner}</p>
            )}
          </div>
        </div>

        <div className="flex-grow" />

        {/* Contact panel sits just above CTA */}
        <div className={META_PANEL}>
          {mobile && (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true">📞</span>
              <a
                href={phoneHref}
                onClick={(event) => event.stopPropagation()}
                className="underline underline-offset-2 hover:text-slate-900"
              >
                {mobile}
              </a>
            </div>
          )}
          {email && (
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true">✉️</span>
              <a
                href={mailHref}
                onClick={(event) => event.stopPropagation()}
                className="truncate underline underline-offset-2 hover:text-slate-900"
              >
                {email}
              </a>
            </div>
          )}
          {locationLabel && (
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true">🌐</span>
              {websiteHref ? (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="underline underline-offset-2 hover:text-slate-900"
                >
                  {locationLabel}
                </a>
              ) : (
                <span>{locationLabel}</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(associate);
            }}
            className={CTA_NAVY}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const Discover_DirectorySection: React.FC<Discover_DirectorySectionProps> = ({
  subtitle = 'Connect with DQ sectors, teams, and associates driving collaboration, delivery, and innovation across the Digital Workspace.',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Fetch units and associates from DQ Work Directory
  const { units: workUnits, loading: workUnitsLoading } = useWorkUnits();
  const { associates: workAssociates, loading: workAssociatesLoading } = useAssociates();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'units'
  );
  const [selectedSectors, setSelectedSectors] = useState<SectorType[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssociateProfile, setSelectedAssociateProfile] =
    useState<DirectoryAssociateProfile | null>(null);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (viewMode !== 'units') params.set('view', viewMode);
    if (selectedSectors.length > 0) params.set('sectors', selectedSectors.join(','));
    if (selectedStreams.length > 0) params.set('streams', selectedStreams.join(','));
    
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, viewMode, selectedSectors, selectedStreams, setSearchParams]);

  // Use Work Directory associates instead of hardcoded data
  const showcaseAssociates = useMemo<Associate[]>(() => {
    return workAssociates.map(mapWorkAssociateToAssociate);
  }, [workAssociates]);

  // Filter logic for Work Directory units
  const filteredWorkUnits = useMemo(() => {
    let filtered = [...workUnits];

    // Search
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((unit) =>
        [
          unit.unitName,
          unit.mandate,
          unit.currentFocus,
          unit.sector,
          unit.unitType,
          ...(unit.focusTags || []),
          ...(unit.wiAreas || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((unit) => selectedSectors.includes(unit.sector as SectorType));
    }

    return filtered;
  }, [debouncedQuery, selectedSectors, workUnits]);

  const filteredAssociates = useMemo(() => {
    let filtered = [...showcaseAssociates];

    // Search
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((person) =>
        [
          person.name,
          person.title,
          person.role,
          person.unit,
          person.sector,
          person.tag,
          person.email,
          person.mobile,
          person.location,
          person.company,
          person.website,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter(
        (person) => person.sector && selectedSectors.includes(person.sector)
      );
    }

    return filtered;
  }, [debouncedQuery, selectedSectors, showcaseAssociates]);
  const visibleAssociates = useMemo(
    () => filteredAssociates.slice(0, 9),
    [filteredAssociates]
  );

  const toggleSector = (sector: SectorType) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedStreams([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSectors.length > 0 || selectedStreams.length > 0 || searchQuery.trim();
  const sectors: SectorType[] = ['Governance', 'Operations', 'Platform', 'Delivery'];
  
  // Map and filter Work Directory units for display (limit to 9)
  const workDirectoryUnitsForDisplay = useMemo(() => {
    return filteredWorkUnits.slice(0, 9).map(mapWorkUnitToCard);
  }, [filteredWorkUnits]);
  
  // Keep track of original work units for click handler
  const workUnitsForDisplay = useMemo(() => {
    return filteredWorkUnits.slice(0, 9);
  }, [filteredWorkUnits]);
  
  const handleViewFullDirectory = useCallback(() => {
    const tab = viewMode === 'associates' ? 'associates' : 'units';
    navigate(`/marketplace/work-directory?tab=${tab}`);
  }, [navigate, viewMode]);
  
  const handleWorkUnitClick = useCallback((workUnit: WorkUnit) => {
    navigate(`/work-directory/units/${workUnit.slug}`);
  }, [navigate]);

  const openAssociateModal = (person: Associate) => {
    setSelectedAssociateProfile(mapAssociateToProfile(person));
    setIsAssociateModalOpen(true);
  };

  const closeAssociateModal = () => {
    setIsAssociateModalOpen(false);
    setTimeout(() => setSelectedAssociateProfile(null), 200);
  };

  return (
    <section
      id="dq-directory"
      className="py-16 md:py-20 pb-20"
      style={{ backgroundColor: '#F9FAFB' }}
      aria-labelledby="directory-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1
            id="directory-heading"
            className="font-serif text-[32px] md:text-[40px] font-bold tracking-[0.04em] leading-tight text-[#030F35] mb-3"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            {viewMode === 'units' ? 'DQ Directory' : 'DQ Directory'}
          </h1>
          <p
            className="text-sm md:text-base max-w-[720px] mx-auto leading-relaxed"
            style={{ color: '#334266', opacity: 0.85 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Controls Row */}
        <div
          className="sticky top-16 z-10 bg-white rounded-2xl border p-4 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 shadow-sm"
          style={{ borderColor: '#E3E7F8' }}
        >
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#25406F', opacity: 0.6 }}
              />
              <input
                type="text"
                placeholder="Search people, teams, or keywords…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E3E7F8',
                  color: '#131E42',
                }}
              />
            </div>
          </div>

          {/* View Toggle */}
          <div
            className="inline-flex rounded-xl p-1"
            role="tablist"
            style={{ backgroundColor: '#F9FAFB', border: '1px solid #E3E7F8' }}
          >
            <button
              onClick={() => setViewMode('units')}
              role="tab"
              aria-selected={viewMode === 'units'}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: viewMode === 'units' ? '#fff' : 'transparent',
                color: viewMode === 'units' ? '#131E42' : '#334266',
                boxShadow: viewMode === 'units' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Units
            </button>
            <button
              onClick={() => setViewMode('associates')}
              role="tab"
              aria-selected={viewMode === 'associates'}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: viewMode === 'associates' ? '#fff' : 'transparent',
                color: viewMode === 'associates' ? '#131E42' : '#334266',
                boxShadow: viewMode === 'associates' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Associates
            </button>
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 h-11 rounded-xl font-semibold text-sm transition-colors"
            style={{
              backgroundColor: showFilters ? '#131E42' : '#F9FAFB',
              color: showFilters ? '#fff' : '#131E42',
              border: '1px solid #E3E7F8',
            }}
            aria-label="Toggle filters"
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#FB5535', color: '#fff' }}
              >
                {selectedSectors.length + selectedStreams.length + (searchQuery.trim() ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-xl border space-y-3" style={{ borderColor: '#E3E7F8' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#131E42' }}>
                Sector
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#FB5535' }}
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => toggleSector(sector)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    backgroundColor: selectedSectors.includes(sector) ? '#131E42' : '#F9FAFB',
                    color: selectedSectors.includes(sector) ? '#fff' : '#334266',
                    border: `1px solid ${
                      selectedSectors.includes(sector) ? '#131E42' : '#E3E7F8'
                    }`,
                  }}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: '#334266', opacity: 0.85 }}>
            {viewMode === 'units' ? filteredWorkUnits.length : filteredAssociates.length}{' '}
            {viewMode === 'units' ? 'units' : 'associates'} found
          </p>
        </div>

        {/* Grid */}
        {viewMode === 'associates' ? (
          <>
            {workAssociatesLoading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading associates...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {visibleAssociates.map((person, index) => (
                    <AssociateCard
                      key={`${person.name}-${person.unit}-${index}`}
                      associate={person}
                      onOpen={openAssociateModal}
                    />
                  ))}
                </div>
                {visibleAssociates.length > 0 && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={handleViewFullDirectory}
                      className="inline-flex items-center rounded-2xl bg-[#030F35] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020b29]"
                    >
                      View Full Directory →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {workUnitsLoading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading units...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {workDirectoryUnitsForDisplay.map((cardData, index) => {
                    const workUnit = workUnitsForDisplay[index];
                    return (
                      <DirectoryCard
                        key={workUnit?.id || index}
                        {...cardData}
                        onViewProfile={() => workUnit && handleWorkUnitClick(workUnit)}
                      />
                    );
                  })}
                </div>
                {workDirectoryUnitsForDisplay.length > 0 && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={handleViewFullDirectory}
                      className="inline-flex items-center rounded-2xl bg-[#030F35] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020b29]"
                    >
                      View Full Directory →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

      </div>
      <DirectoryAssociateModal
        open={isAssociateModalOpen}
        profile={selectedAssociateProfile}
        onClose={closeAssociateModal}
      />
    </section>
  );
};

export default Discover_DirectorySection;
