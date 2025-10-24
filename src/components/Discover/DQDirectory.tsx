import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { DirectoryCard, DirectoryCardData } from '../Directory/DirectoryCard';
import { AssociateModal } from '../Directory/AssociateModal';
import { unitsData, associatesData } from '../../data/directoryData';
import type { Unit, Associate, ViewMode, SectorType } from '../../types/directory';

interface DQDirectoryProps {
  title?: string;
  subtitle?: string;
}

/**
 * Map Unit to unified DirectoryCardData
 */
const mapUnitToCard = (unit: Unit, onViewProfile: () => void): DirectoryCardData => ({
  logoUrl: unit.logoUrl,
  title: unit.name,
  tag: unit.sector,
  description: unit.description || '',
  towers: unit.streams,
  onClick: onViewProfile,
});

/**
 * Map Associate to unified DirectoryCardData
 */
const mapAssociateToCard = (
  associate: Associate,
  onViewProfile: () => void
): DirectoryCardData => ({
  logoUrl: associate.avatarUrl,
  title: associate.name,
  tag: associate.sector,
  description: associate.description || '',
  roleInfo: {
    role: associate.roleTitle,
    unit: associate.unitName,
    email: associate.email,
  },
  onClick: onViewProfile,
});

export const DQDirectory: React.FC<DQDirectoryProps> = ({
  subtitle = 'Connect with DQ sectors, teams, and associates driving collaboration, delivery, and innovation across the Digital Workspace.',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'units'
  );
  const [selectedSectors, setSelectedSectors] = useState<SectorType[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter logic
  const filteredUnits = useMemo(() => {
    let filtered = [...unitsData];

    // Search
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((unit) =>
        [unit.name, unit.description, unit.sector, ...(unit.streams || []), ...(unit.tags || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((unit) => selectedSectors.includes(unit.sector));
    }

    // Stream filter
    if (selectedStreams.length > 0) {
      filtered = filtered.filter((unit) =>
        unit.streams?.some((stream) => selectedStreams.includes(stream))
      );
    }

    return filtered;
  }, [debouncedQuery, selectedSectors, selectedStreams]);

  const filteredAssociates = useMemo(() => {
    let filtered = [...associatesData];

    // Search
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((person) =>
        [
          person.name,
          person.roleTitle,
          person.unitName,
          person.sector,
          ...(person.skills || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((person) => selectedSectors.includes(person.sector));
    }

    return filtered;
  }, [debouncedQuery, selectedSectors]);

  const handleViewProfile = useCallback((person: Associate) => {
    setSelectedAssociate(person);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAssociate(null), 300);
  }, []);

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

  const currentData = viewMode === 'units' ? filteredUnits : filteredAssociates;
  const sectors: SectorType[] = ['Governance', 'Operations', 'Platform', 'Delivery'];

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
            className="text-[32px] md:text-[40px] font-bold tracking-tight leading-tight mb-3"
            style={{ color: '#131E42' }}
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
                    border: `1px solid ${selectedSectors.includes(sector) ? '#131E42' : '#E3E7F8'}`,
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
            {currentData.length} {viewMode === 'units' ? 'units' : 'associates'} found
          </p>
        </div>

        {/* Grid */}
        {currentData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base font-medium mb-2" style={{ color: '#131E42' }}>
              No results found
            </p>
            <p className="text-sm" style={{ color: '#334266', opacity: 0.75 }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-12">
            {viewMode === 'units'
              ? (currentData as Unit[]).map((unit) => (
                  <DirectoryCard
                    key={unit.id}
                    {...mapUnitToCard(unit, () => {
                      window.open(unit.marketplaceUrl, '_blank');
                    })}
                  />
                ))
              : (currentData as Associate[]).map((person) => (
                  <DirectoryCard
                    key={person.id}
                    {...mapAssociateToCard(person, () => handleViewProfile(person))}
                  />
                ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <a
            href="/marketplace/directory"
            className="dws-btn-primary inline-flex items-center gap-2"
            aria-label="View full directory in marketplace"
          >
            View Full Directory
          </a>
        </div>
      </div>

      {/* Associate Modal */}
      <AssociateModal person={selectedAssociate} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

