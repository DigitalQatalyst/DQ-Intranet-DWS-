import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, LocateFixed, Maximize2, Search, MapPin, List, Grid3x3, Navigation } from 'lucide-react';

import { DQMap, type DQMapRef } from '../DQMap';
import { MARKER_COLORS } from './constants';
import { getUniqueRegions, getUniqueTypes, fetchAllLocations } from '../../api/MAPAPI';
import type { MapStyle, MapLocation, Region, LocationType } from '../../types/map';

type MapCardProps = {
  className?: string;
};

type MapStateSnapshot = {
  loading: boolean;
  locationsCount: number;
  mapboxEnabled: boolean;
};

type ViewMode = 'map' | 'list' | 'grid';

const MAP_STYLE_LABELS: Record<MapStyle, string> = {
  standard: 'Standard',
  satellite: 'Satellite',
  hybrid: 'Hybrid',
};

const LEGEND_ITEMS = Object.entries(MARKER_COLORS)
  .filter(([key]) => key !== 'Default')
  .map(([label, color]) => ({ label, color }));

const NAVY_BLUE = '#030F35';

export const MapCard: React.FC<MapCardProps> = ({ className = '' }) => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [activeTab, setActiveTab] = useState<'Sectors' | 'Zones'>('Zones');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [selectedType, setSelectedType] = useState<LocationType | 'All'>('All');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [mapState, setMapState] = useState<MapStateSnapshot>({
    loading: true,
    locationsCount: 0,
    mapboxEnabled: true,
  });
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [allLocations, setAllLocations] = useState<MapLocation[]>([]);
  const styleMenuRef = useRef<HTMLDivElement | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<DQMapRef | null>(null);

  // Load all locations for filtering
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locations = await fetchAllLocations();
        setAllLocations(locations);
      } catch (error) {
        console.error('[MapCard] Failed to load locations', error);
      }
    };
    loadLocations();
  }, []);

  const regions = useMemo(() => getUniqueRegions(), []);
  const types = useMemo(() => getUniqueTypes(), []);

  // Filter locations based on active tab and selection
  const filteredLocations = useMemo(() => {
    let filtered = allLocations;

    if (activeTab === 'Zones' && selectedRegion !== 'All') {
      filtered = filtered.filter((loc) => loc.region === selectedRegion);
    } else if (activeTab === 'Sectors' && selectedType !== 'All') {
      filtered = filtered.filter((loc) => loc.type === selectedType);
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(lowerQuery) ||
          loc.description.toLowerCase().includes(lowerQuery) ||
          loc.address?.toLowerCase().includes(lowerQuery),
      );
    }

    return filtered;
  }, [allLocations, activeTab, selectedRegion, selectedType, searchQuery]);

  const handleMapStateChange = useCallback((snapshot: MapStateSnapshot) => {
    setMapState(snapshot);
  }, []);

  const handleMapboxAvailabilityChange = useCallback((value: boolean) => {
    setMapState((prev) => ({ ...prev, mapboxEnabled: value }));
  }, []);

  const toggleStyleMenu = useCallback(() => {
    setStyleMenuOpen((open) => !open);
  }, []);

  const closeStyleMenu = useCallback(() => setStyleMenuOpen(false), []);

  const toggleFilterMenu = useCallback(() => {
    setFilterMenuOpen((open) => !open);
  }, []);

  const closeFilterMenu = useCallback(() => setFilterMenuOpen(false), []);

  // Reset selection when switching tabs
  useEffect(() => {
    if (activeTab === 'Zones') {
      setSelectedType('All');
    } else {
      setSelectedRegion('All');
    }
    setFilterMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (!styleMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!styleMenuRef.current) return;
      if (!styleMenuRef.current.contains(event.target as Node)) {
        setStyleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [styleMenuOpen]);

  useEffect(() => {
    if (!filterMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!filterMenuRef.current) return;
      if (!filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterMenuOpen]);

  useEffect(() => {
    if (!mapState.mapboxEnabled) {
      setStyleMenuOpen(false);
    }
  }, [mapState.mapboxEnabled]);

  const mapStyleOptions = useMemo(
    () =>
      (Object.keys(MAP_STYLE_LABELS) as MapStyle[]).map((key) => ({
        value: key,
        label: MAP_STYLE_LABELS[key],
      })),
    [],
  );

  return (
    <div
      className={`relative flex h-[240px] w-full flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_10px_30px_rgba(3,15,53,0.08)] md:h-[360px] xl:h-[440px] xl:w-[680px] ${className}`}
      style={{
        boxShadow: '0 12px 40px rgba(2,6,23,0.08)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[100] flex items-center gap-2 flex-wrap">
        <div className="pointer-events-auto relative flex-1 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search businesses, zones, sectors..."
            className="h-9 w-full rounded-lg border border-gray-200 bg-white/90 px-9 text-sm text-slate-700 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-[#030F35] focus:ring-2 focus:ring-[#030F35]/30"
            type="search"
            aria-label="Search locations"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-1 py-1 shadow-sm">
            {(['Sectors', 'Zones'] as const).map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab);
                  }}
                  className={`h-7 rounded-full px-3 text-xs font-semibold transition ${
                    isActive ? 'bg-[#030F35] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                  aria-pressed={isActive}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-auto relative" ref={filterMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFilterMenu();
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#030F35]/50 hover:text-[#030F35]"
              aria-haspopup="listbox"
              aria-expanded={filterMenuOpen}
              aria-label={`Select ${activeTab.toLowerCase()}`}
            >
              {activeTab === 'Zones'
                ? selectedRegion === 'All'
                  ? 'All Zones'
                  : selectedRegion
                : selectedType === 'All'
                ? 'All Sectors'
                : selectedType}
              <ChevronDown className="h-4 w-4" />
            </button>
            {filterMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-[110]">
                <ul className="py-1 max-h-60 overflow-y-auto" role="listbox" aria-label={`${activeTab} options`}>
                  <li>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeTab === 'Zones') {
                          setSelectedRegion('All');
                        } else {
                          setSelectedType('All');
                        }
                        closeFilterMenu();
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                        (activeTab === 'Zones' ? selectedRegion === 'All' : selectedType === 'All')
                          ? 'bg-[#030F35]/10 text-[#030F35]'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      All {activeTab}
                      {(activeTab === 'Zones' ? selectedRegion === 'All' : selectedType === 'All') && (
                        <LocateFixed className="h-4 w-4" />
                      )}
                    </button>
                  </li>
                  {(activeTab === 'Zones' ? regions : types).map((option) => {
                    const isActive =
                      activeTab === 'Zones' ? selectedRegion === option : selectedType === option;
                    return (
                      <li key={option}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeTab === 'Zones') {
                              setSelectedRegion(option);
                            } else {
                              setSelectedType(option);
                            }
                            closeFilterMenu();
                          }}
                          className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                            isActive ? 'bg-[#030F35]/10 text-[#030F35]' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {option}
                          {isActive && <LocateFixed className="h-4 w-4" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white/90 px-1 py-1 shadow-sm" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('map');
            }}
            className={`h-7 w-7 rounded-md flex items-center justify-center transition ${
              viewMode === 'map' ? 'bg-[#030F35] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Map view"
            aria-pressed={viewMode === 'map'}
          >
            <MapPin className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('list');
            }}
            className={`h-7 w-7 rounded-md flex items-center justify-center transition ${
              viewMode === 'list' ? 'bg-[#030F35] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('grid');
            }}
            className={`h-7 w-7 rounded-md flex items-center justify-center transition ${
              viewMode === 'grid' ? 'bg-[#030F35] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
        <div className="pointer-events-auto relative" ref={styleMenuRef} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (mapState.mapboxEnabled) {
                toggleStyleMenu();
              }
            }}
            className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${
              mapState.mapboxEnabled
                ? 'border-gray-200 bg-white/90 text-slate-700 shadow-sm hover:border-[#030F35]/50 hover:text-[#030F35]'
                : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            }`}
            aria-haspopup="listbox"
            aria-expanded={styleMenuOpen}
            aria-label="Select map style"
          >
            Map Style
            <ChevronDown className="h-4 w-4" />
          </button>
          {styleMenuOpen && mapState.mapboxEnabled && (
            <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-[110]">
              <ul className="py-1" role="listbox" aria-label="Map style options">
                {mapStyleOptions.map((option) => {
                  const isActive = option.value === mapStyle;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMapStyle(option.value);
                          closeStyleMenu();
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                          isActive ? 'bg-[#030F35]/10 text-[#030F35]' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {option.label}
                        {isActive && <LocateFixed className="h-4 w-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Trigger locate user location
              if (mapRef.current) {
                mapRef.current.locateUser();
              }
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white/90 text-slate-600 shadow-sm transition hover:border-[#030F35]/40 hover:text-[#030F35] hover:bg-[#030F35]/5"
            aria-label="Locate my location"
            title="Locate my location"
          >
            <Navigation className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Toggle fullscreen - could be implemented later
              console.log('Fullscreen clicked');
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white/90 text-slate-600 shadow-sm transition hover:border-[#030F35]/40 hover:text-[#030F35]"
            aria-label="Toggle fullscreen map"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
          {LEGEND_ITEMS.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full border border-white shadow-[0_1px_3px_rgba(15,23,42,0.2)]"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
        {!mapState.loading && (
          <span className="pointer-events-auto inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
            {mapState.locationsCount} location{mapState.locationsCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="relative flex flex-1 min-h-0 h-full">
        {viewMode === 'map' && (
          <DQMap
            ref={mapRef}
            className="relative flex-1 min-h-0 h-full"
            mapStyle={mapStyle}
            regionFilter={activeTab === 'Zones' ? selectedRegion : 'All'}
            typeFilter={activeTab === 'Sectors' ? selectedType : 'All'}
            onStateChange={handleMapStateChange}
            onMapboxAvailabilityChange={handleMapboxAvailabilityChange}
          />
        )}
        {viewMode === 'list' && (
          <div className="relative flex-1 min-h-0 h-full overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      // Optionally zoom to location on map if needed
                      setViewMode('map');
                    }}
                  >
                    <div className="font-semibold text-sm text-slate-900">{location.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{location.type} · {location.region}</div>
                    {location.description && (
                      <div className="text-xs text-slate-600 mt-1">{location.description}</div>
                    )}
                    {location.address && (
                      <div className="text-xs text-slate-500 mt-1">📍 {location.address}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  No locations found. Try adjusting your filters or search.
                </div>
              )}
            </div>
          </div>
        )}
        {viewMode === 'grid' && (
          <div className="relative flex-1 min-h-0 h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setViewMode('map');
                    }}
                  >
                    <div className="font-semibold text-sm text-slate-900">{location.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{location.type} · {location.region}</div>
                    {location.description && (
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">{location.description}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-500 py-8">
                  No locations found. Try adjusting your filters or search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapCard;
