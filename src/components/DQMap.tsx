import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapLocation, MapStyle, Region, LocationType } from '../types/map';
import {
  fetchAllLocations,
  fetchLocationsByRegion,
  fetchLocationsByType,
  getUniqueRegions,
  getUniqueTypes,
} from '../api/MAPAPI';

// Set Mapbox access token
mapboxgl.accessToken = (import.meta as any).env.VITE_MAPBOX_TOKEN || '';

// Pin colors by type
const PIN_COLORS: Record<string, string> = {
  'Headquarters': '#111827',
  'Regional Office': '#4F46E5',
  'Client': '#0EA5E9',
  'Authority': '#F59E0B',
  'Default': '#6B7280',
};

const MAPBOX_STYLES = {
  standard: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  hybrid: 'mapbox://styles/mapbox/satellite-streets-v12',
};

interface DQMapProps {
  className?: string;
}

export const DQMap: React.FC<DQMapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [isLoading, setIsLoading] = useState(true);

  const regions = getUniqueRegions();
  const types = getUniqueTypes();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxgl.accessToken) {
      console.error('VITE_MAPBOX_TOKEN is not set');
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLES[mapStyle],
      center: [51.5, 25.2], // Centered on Gulf region
      zoom: 5,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      }),
      'bottom-left'
    );

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(MAPBOX_STYLES[mapStyle]);
    }
  }, [mapStyle]);

  // Fetch locations based on filters
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        let data: MapLocation[];

        if (selectedRegion !== 'All') {
          data = await fetchLocationsByRegion(selectedRegion as Region);
        } else if (selectedType !== 'All') {
          data = await fetchLocationsByType(selectedType as LocationType);
        } else {
          data = await fetchAllLocations();
        }

        setLocations(data);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, [selectedRegion, selectedType]);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      const color = PIN_COLORS[location.type] || PIN_COLORS['Default'];

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      popupContent.innerHTML = `
        <div class="font-semibold text-base mb-1" style="color: var(--dws-text);">${location.name}</div>
        <div class="text-xs mb-2" style="color: var(--dws-accent);">${location.type} · ${location.region}</div>
        <div class="text-sm mb-2" style="color: var(--dws-text-dim);">${location.description}</div>
        ${location.address ? `<div class="text-xs mb-1" style="color: var(--dws-text-dim);">📍 ${location.address}</div>` : ''}
        ${location.contactPhone ? `<div class="text-xs mb-1" style="color: var(--dws-text-dim);">📞 ${location.contactPhone}</div>` : ''}
        ${location.services ? `<div class="text-xs mb-1" style="color: var(--dws-accent);">🔧 ${location.services.join(' • ')}</div>` : ''}
        ${location.operatingHours ? `<div class="text-xs" style="color: var(--dws-text-dim);">🕐 ${location.operatingHours}</div>` : ''}
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
      }).setDOMContent(popupContent);

      // Create marker (flip to [lng, lat] for Mapbox)
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.position[1], location.position[0]]) // Flip: [lng, lat]
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to markers if we have locations
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach((loc) => {
        bounds.extend([loc.position[1], loc.position[0]]); // Flip: [lng, lat]
      });
      map.current?.fitBounds(bounds, { padding: 50, maxZoom: 10 });
    }
  }, [locations, isLoading]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Filters Header */}
      <div className="p-4 bg-white border-b border-gray-200 space-y-3">
        <div className="flex flex-wrap gap-3">
          {/* Region Filter */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="region-filter" className="block text-xs font-medium mb-1" style={{ color: 'var(--dws-accent)' }}>
              Region
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedType('All'); // Reset type when region changes
              }}
              className="w-full h-9 px-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--dws-card-border)',
                color: 'var(--dws-text)',
              }}
            >
              <option value="All">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="type-filter" className="block text-xs font-medium mb-1" style={{ color: 'var(--dws-accent)' }}>
              Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedRegion('All'); // Reset region when type changes
              }}
              className="w-full h-9 px-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--dws-card-border)',
                color: 'var(--dws-text)',
              }}
            >
              <option value="All">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Style Switcher */}
          <div className="flex-1 min-w-[140px]">
            <label htmlFor="style-switcher" className="block text-xs font-medium mb-1" style={{ color: 'var(--dws-accent)' }}>
              Map Style
            </label>
            <select
              id="style-switcher"
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as MapStyle)}
              className="w-full h-9 px-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--dws-card-border)',
                color: 'var(--dws-text)',
              }}
            >
              <option value="standard">Standard</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(PIN_COLORS).filter(([key]) => key !== 'Default').map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: color, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
              />
              <span className="text-xs" style={{ color: 'var(--dws-text-dim)' }}>
                {type}
              </span>
            </div>
          ))}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="text-xs" style={{ color: 'var(--dws-text-dim)' }}>
            Showing {locations.length} location{locations.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-sm font-medium" style={{ color: 'var(--dws-accent)' }}>
              Loading map...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

