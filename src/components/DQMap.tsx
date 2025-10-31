import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, { MapboxEvent, RasterLayerSpecification, RasterSourceSpecification, Style } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { LocationType, MapLocation, MapStyle, Region } from '../types/map';
import { MARKER_COLORS } from './map/constants';
import { fetchAllLocations, fetchLocationsByRegion, fetchLocationsByType } from '../api/MAPAPI';

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? '';
mapboxgl.accessToken = accessToken;

const MAPBOX_STYLES: Record<MapStyle, string> = {
  standard: 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  hybrid: 'mapbox://styles/mapbox/outdoors-v12',
};

const OSM_RASTER_SOURCE: RasterSourceSpecification = {
  type: 'raster',
  tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
  tileSize: 256,
  attribution: '© OpenStreetMap contributors',
};

const OSM_RASTER_LAYER: RasterLayerSpecification = {
  id: 'osm-layer',
  type: 'raster',
  source: 'osm-tiles',
};

const OSM_STYLE: Style = {
  version: 8,
  sources: {
    'osm-tiles': OSM_RASTER_SOURCE,
  },
  layers: [OSM_RASTER_LAYER],
};

const DEFAULT_CENTER: [number, number] = [54.377, 24.453];
const DEFAULT_ZOOM = 10;

type AllOption<T> = T | 'All';

type MapStateSnapshot = {
  loading: boolean;
  locationsCount: number;
  mapboxEnabled: boolean;
};

type DQMapProps = {
  className?: string;
  mapStyle: MapStyle;
  regionFilter?: AllOption<Region>;
  typeFilter?: AllOption<LocationType>;
  onStateChange?: (snapshot: MapStateSnapshot) => void;
  onMapboxAvailabilityChange?: (available: boolean) => void;
};

const forceResize = (map: mapboxgl.Map) => {
  map.resize();
  requestAnimationFrame(() => map.resize());
};

const createMarkerElement = (strokeColor: string) => {
  const node = document.createElement('div');
  node.style.cssText =
    'width:30px;height:30px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 4px rgba(3,15,53,0.25));z-index:5;';
  node.innerHTML = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="14" fill="white" stroke="${strokeColor}" stroke-width="2"/>
    <circle cx="15" cy="15" r="7" fill="${strokeColor}" fill-opacity="0.12"/>
    <circle cx="15" cy="15" r="3" fill="${strokeColor}"/>
  </svg>`;
  return node;
};

const buildPopupMarkup = (location: MapLocation) =>
  `<div class="space-y-1">${[
    `<div class="font-semibold text-base text-slate-900">${location.name}</div>`,
    `<div class="text-xs text-slate-500">${location.type} · ${location.region}</div>`,
    location.description && `<div class="text-sm text-slate-600">${location.description}</div>`,
    location.address && `<div class="text-xs text-slate-500">📍 ${location.address}</div>`,
    location.contactPhone && `<div class="text-xs text-slate-500">📞 ${location.contactPhone}</div>`,
    location.services?.length ? `<div class="text-xs text-slate-500">🔧 ${location.services.join(' • ')}</div>` : '',
    location.operatingHours && `<div class="text-xs text-slate-500">🕐 ${location.operatingHours}</div>`,
  ]
    .filter(Boolean)
    .join('')}</div>`;

export const DQMap: React.FC<DQMapProps> = ({
  className = '',
  mapStyle,
  regionFilter = 'All',
  typeFilter = 'All',
  onStateChange,
  onMapboxAvailabilityChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const locationsRef = useRef<MapLocation[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mapboxActiveRef = useRef<boolean>(Boolean(accessToken));

  const [mapboxEnabled, setMapboxEnabled] = useState<boolean>(Boolean(accessToken));
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const effectiveRegion = regionFilter;
  const effectiveType = useMemo<AllOption<LocationType>>(() => {
    if (effectiveRegion !== 'All') return 'All';
    return typeFilter;
  }, [effectiveRegion, typeFilter]);

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const dataset = locationsRef.current;

    dataset.forEach((location) => {
      const stroke = MARKER_COLORS[location.type] ?? MARKER_COLORS.Default;
      const marker = new mapboxgl.Marker({
        element: createMarkerElement(stroke),
        anchor: 'bottom',
      })
        .setLngLat([location.position[1], location.position[0]])
        .setPopup(
          new mapboxgl.Popup({
            offset: 16,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '280px',
          }).setHTML(buildPopupMarkup(location)),
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (dataset.length) {
      const bounds = dataset.reduce(
        (acc, location) => acc.extend([location.position[1], location.position[0]]),
        new mapboxgl.LngLatBounds(),
      );
      map.fitBounds(bounds, { padding: 32, maxZoom: 12, duration: 600 });
    } else {
      map.easeTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 600 });
    }
  }, []);

  const ensureMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const draw = () => {
      if (!mapRef.current) return;
      forceResize(mapRef.current);
      renderMarkers();
    };

    if (typeof map.isStyleLoaded === 'function' && map.isStyleLoaded()) {
      draw();
    } else {
      map.once('idle', draw);
    }
  }, [renderMarkers]);

  const fallbackToOsm = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapboxActiveRef.current) return;

    mapboxActiveRef.current = false;
    setMapboxEnabled(false);
    setMapReady(false);
    onMapboxAvailabilityChange?.(false);

    map.setStyle(OSM_STYLE);
    const handleReady = () => {
      if (!mapRef.current) return;
      setMapReady(true);
      ensureMarkers();
    };

    map.once('styledata', handleReady);
    map.once('idle', handleReady);
  }, [ensureMarkers, onMapboxAvailabilityChange]);

  useEffect(() => {
    onMapboxAvailabilityChange?.(mapboxEnabled);
  }, [mapboxEnabled, onMapboxAvailabilityChange]);

  useEffect(() => {
    onStateChange?.({
      loading,
      locationsCount: locations.length,
      mapboxEnabled,
    });
  }, [loading, locations.length, mapboxEnabled, onStateChange]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapNodeRef.current,
      style: mapboxActiveRef.current ? MAPBOX_STYLES.standard : OSM_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      cooperativeGestures: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

    let fallbackTimeout: number | undefined;

    const clearFallbackTimer = () => {
      if (fallbackTimeout) {
        window.clearTimeout(fallbackTimeout);
        fallbackTimeout = undefined;
      }
    };

    const handleLoad = () => {
      clearFallbackTimer();
      setMapReady(true);
      ensureMarkers();
    };

    const handleStyleData = () => {
      if (map.isStyleLoaded()) {
        clearFallbackTimer();
        setMapReady(true);
        forceResize(map);
      }
    };

    const handleError = (event: unknown) => {
      const evt: any = event as any;
      if (!evt?.error) return;
      const status = (evt.error as { status?: number }).status;
      const message = (evt.error as Error).message || '';
      const lower = message.toLowerCase();
      const shouldFallback =
        status === 401 ||
        status === 403 ||
        status === 404 ||
        message.includes('Unauthorized') ||
        message.includes('forbidden') ||
        message.includes('style') ||
        lower.includes('token') ||
        lower.includes('access') ||
        lower.includes('authorization') ||
        lower.includes('account');

      if (shouldFallback && mapboxActiveRef.current) {
        console.warn('[DQMap] Mapbox style error, falling back to OSM.', event);
        clearFallbackTimer();
        fallbackToOsm();
      }
    };

    map.on('load', handleLoad);
    const handleIdle = () => {
      clearFallbackTimer();
      setMapReady(true);
      ensureMarkers();
    };

    map.on('styledata', handleStyleData);
    map.once('idle', handleIdle);
    map.on('error', handleError);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        if (mapRef.current) forceResize(mapRef.current);
      });
      resizeObserverRef.current = observer;
      if (wrapperRef.current) observer.observe(wrapperRef.current);
      map.on('remove', () => observer.disconnect());
    }

    const handleWindowResize = () => {
      if (mapRef.current) forceResize(mapRef.current);
    };
    window.addEventListener('resize', handleWindowResize);

    const canvas = map.getCanvas();
    const handleContextLost = (event: Event) => {
      (event as any).preventDefault?.();
      setMapReady(false);
      requestAnimationFrame(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
    };
    canvas.addEventListener('webglcontextlost' as any, handleContextLost as unknown as EventListener, false);

    fallbackTimeout = window.setTimeout(() => {
      if (!mapReady && mapboxActiveRef.current) {
        console.warn('[DQMap] Map did not become ready in time, switching to OSM fallback.');
        fallbackToOsm();
      }
    }, 3500);

    return () => {
      canvas.removeEventListener('webglcontextlost' as any, handleContextLost as unknown as EventListener);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      clearFallbackTimer();
      map.off('load', handleLoad);
      map.off('styledata', handleStyleData);
      map.off('idle', handleIdle);
      map.off('error', handleError);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [ensureMarkers, fallbackToOsm]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapboxEnabled) return;

    const targetStyle = MAPBOX_STYLES[mapStyle];
    if (!targetStyle) return;

    setMapReady(false);

    const handleStyleData = () => {
      if (!mapRef.current) return;
      setMapReady(true);
      ensureMarkers();
    };

    const handleError = (event: MapboxEvent) => {
      console.error('[DQMap] Mapbox style switch failed, using OSM fallback.', event);
      map.off('styledata', handleStyleData);
      fallbackToOsm();
    };

    map.once('styledata', handleStyleData);
    map.once('error', handleError);
    map.setStyle(targetStyle);

    return () => {
      map.off('styledata', handleStyleData);
      map.off('error', handleError);
    };
  }, [mapStyle, mapboxEnabled, ensureMarkers, fallbackToOsm]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const data =
          effectiveRegion !== 'All'
            ? await fetchLocationsByRegion(effectiveRegion as Region)
            : effectiveType !== 'All'
            ? await fetchLocationsByType(effectiveType as LocationType)
            : await fetchAllLocations();

        if (!cancelled) {
          setLocations(data);
        }
      } catch (error) {
        console.error('[DQMap] Failed to load locations', error);
        if (!cancelled) {
          setLocations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [effectiveRegion, effectiveType]);

  useEffect(() => {
    locationsRef.current = locations;
    if (!loading) {
      ensureMarkers();
    }
  }, [locations, loading, ensureMarkers]);

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full min-h-[360px] ${className}`}
      style={{ minHeight: '360px' }}
    >
      <div ref={mapNodeRef} className="absolute inset-0 h-full w-full" />
      {(!mapReady || loading) && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm">
          <span className="rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
            Loading map…
          </span>
        </div>
      )}
    </div>
  );
};

export default DQMap;
