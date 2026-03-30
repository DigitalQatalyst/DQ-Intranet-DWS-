import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import type { LocationItem } from "../api/MAPAPI";
import { MARKER_COLORS } from "./map/constants";
import LocationModal from "./map/LocationModal";

// CARTO Positron (light, minimal basemap)
const CARTO_TILE_LAYER =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const INITIAL_CENTER: [number, number] = [25.0, 54.0]; // [lat, lng] for Leaflet
const INITIAL_ZOOM = 5.5;
const PRIMARY_PIN_COLOR = "#162862"; // DWS Primary Dark Blue
const ACCENT_PIN_COLOR = "#E95139"; // DWS Accent Orange

const DQMap: React.FC<{
  className?: string;
  locations: LocationItem[];
  selectedId?: string | null;
  onSelect?: (location: LocationItem) => void;
}> = ({ className = "", locations, selectedId, onSelect }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validLocations = useMemo(
    () => locations.filter((item) => item.coordinates),
    [locations]
  );
  const lastSelectedIdRef = useRef<string | null>(null);

  // Create custom marker icon
  const createMarkerIcon = (color: string): L.DivIcon => {
    return L.divIcon({
      className: "dq-map-marker",
      iconSize: [36, 48],
      iconAnchor: [18, 42],
      html: `
        <div style="
          width: 36px;
          height: 48px;
          position: relative;
          cursor: pointer;
          filter: drop-shadow(0 8px 18px rgba(3, 15, 53, 0.25));
        ">
          <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.06 0 0 8.16 0 18.22C0 28.28 10.74 40.98 16.42 47.02C17.1 47.74 18.26 47.74 18.94 47.02C24.62 40.98 35.36 28.28 35.36 18.22C35.36 8.16 27.3 0 17.36 0H18Z" fill="${color}"/>
            <circle cx="18" cy="18" r="6.5" fill="white" fill-opacity="0.92"/>
            <circle cx="18" cy="18" r="3.2" fill="${color}"/>
          </svg>
        </div>
      `,
    });
  };


  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        zoomControl: false,
        attributionControl: false,
      });

      // Add CARTO Positron light basemap
      L.tileLayer(CARTO_TILE_LAYER, {
        attribution: CARTO_ATTRIBUTION,
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      // Add custom zoom controls
      L.control
        .zoom({
          position: "topright",
        })
        .addTo(map);

      // Add attribution
      L.control
        .attribution({
          position: "bottomright",
          prefix: false,
        })
        .addTo(map);

      map.on("load", () => {
        setIsMapLoading(false);
      });

      map.whenReady(() => {
        setIsMapLoading(false);
        requestAnimationFrame(() => {
          map.invalidateSize();
        });
      });

      mapRef.current = map;
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setIsMapLoading(false);
    }

    return () => {
      if (mapRef.current) {
        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};
        popupRef.current?.remove();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    validLocations.forEach((location) => {
      const coords = location.coordinates;
      if (!coords) return;

      // Prefer explicit markerColor when provided, otherwise fall back to type-based color or primary
      const baseColor =
        location.markerColor ||
        MARKER_COLORS[location.type as keyof typeof MARKER_COLORS] ||
        PRIMARY_PIN_COLOR;
      const icon = createMarkerIcon(baseColor);

      const marker = L.marker([coords.lat, coords.lng], { icon }).addTo(map);

      // Handle marker click - open modal instead of popup
      marker.on("click", () => {
        onSelect?.(location);
        setSelectedLocation(location);
        setIsModalOpen(true);

        // Smooth zoom to marker
        map.setView([coords.lat, coords.lng], Math.max(map.getZoom(), 12), {
          animate: true,
          duration: 0.8,
        });
      });

      markersRef.current[location.id] = marker;
    });

    // Fit bounds to all markers
    if (validLocations.length > 0) {
      const bounds = L.latLngBounds(
        validLocations.map((location) => [
          location.coordinates!.lat,
          location.coordinates!.lng,
        ])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [60, 60],
          animate: true,
          duration: 1.0,
          maxZoom: 8,
        });
      }
    } else {
      map.setView(INITIAL_CENTER, INITIAL_ZOOM);
    }
  }, [validLocations, onSelect]);

  // Handle selected location from external selection (e.g., filter)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    // If selection is cleared, reset last highlighted marker (if any)
    if (!selectedId) {
      if (lastSelectedIdRef.current) {
        const previous = validLocations.find(
          (item) => item.id === lastSelectedIdRef.current
        );
        const previousMarker = markersRef.current[lastSelectedIdRef.current];
        if (previous && previousMarker) {
          const baseColor =
            previous.markerColor ||
            MARKER_COLORS[previous.type as keyof typeof MARKER_COLORS] ||
            PRIMARY_PIN_COLOR;
          previousMarker.setIcon(createMarkerIcon(baseColor));
        }
        lastSelectedIdRef.current = null;
      }
      return;
    }

    const location = validLocations.find((item) => item.id === selectedId);
    if (!location || !location.coordinates) return;

    const marker = markersRef.current[location.id];
    if (!marker) return;

    // Reset previously selected marker back to primary color
    if (
      lastSelectedIdRef.current &&
      lastSelectedIdRef.current !== location.id
    ) {
      const previous = validLocations.find(
        (item) => item.id === lastSelectedIdRef.current
      );
      const previousMarker = markersRef.current[lastSelectedIdRef.current];
      if (previous && previousMarker) {
        const baseColor =
          previous.markerColor ||
          MARKER_COLORS[previous.type as keyof typeof MARKER_COLORS] ||
          PRIMARY_PIN_COLOR;
        previousMarker.setIcon(createMarkerIcon(baseColor));
      }
    }

    // Highlight current marker with accent color
    marker.setIcon(createMarkerIcon(ACCENT_PIN_COLOR));
    lastSelectedIdRef.current = location.id;

    // Open modal for selected location
    setSelectedLocation(location);
    setIsModalOpen(true);

    // Smooth zoom to selected location
    map.setView([location.coordinates.lat, location.coordinates.lng], 13, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedId, validLocations]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        requestAnimationFrame(() => {
          mapRef.current?.invalidateSize();
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        style={{
          borderRadius: "inherit",
        }}
      />

      {/* Loading indicator */}
      {isMapLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-40"
          style={{
            borderRadius: "inherit",
          }}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#030F35] mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Gradient overlay for EJP style - subtle branded gradient */}
      {!isMapLoading && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(251, 85, 53, 0.02) 0%,
              rgba(3, 15, 53, 0.04) 50%,
              rgba(3, 15, 53, 0.06) 100%
            )`,
            borderRadius: "inherit",
            zIndex: 1,
          }}
        />
      )}

      {/* Location Modal - Slides in from the right */}
      {selectedLocation && (
        <>
          {/* Backdrop overlay - subtle darkening */}
          <div
            className={`absolute inset-0 bg-black/10 z-40 transition-opacity duration-300 ${
              isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => {
              setIsModalOpen(false);
              setSelectedLocation(null);
            }}
          />
          {/* Slide-in panel */}
          <LocationModal
            location={selectedLocation}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedLocation(null);
            }}
          />
        </>
      )}
    </div>
  );
};

export default DQMap;
