export type LatLng = [number, number]; // [lat, lng]
export type LngLat = [number, number]; // [lng, lat]

const COUNTRY_BOUNDS: Record<string, { lat: [number, number]; lng: [number, number] }> = {
  UAE: { lat: [22, 27.5], lng: [51, 56.5] },
  KSA: { lat: [15, 32.5], lng: [34, 56] },
  KE: { lat: [-5.5, 5.5], lng: [33.5, 42.5] },
};

export const isValidLatLng = (lat?: number, lng?: number, country?: string): boolean => {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return false;
  }

  if (country) {
    const bounds = COUNTRY_BOUNDS[country.toUpperCase()];
    if (bounds) {
      const withinLat = lat >= bounds.lat[0] && lat <= bounds.lat[1];
      const withinLng = lng >= bounds.lng[0] && lng <= bounds.lng[1];
      if (!withinLat || !withinLng) return false;
    }
  }

  return true;
};

export const maybeFlip = (
  lat?: number,
  lng?: number,
  country?: string,
): { lat: number; lng: number } | null => {
  if (isValidLatLng(lat, lng, country)) return { lat: lat!, lng: lng! };
  if (isValidLatLng(lng, lat, country)) return { lat: lng!, lng: lat! };
  return null;
};

export const toLngLat = (lat: number, lng: number): LngLat => [lng, lat];

export const toLatLng = (lng: number, lat: number): LatLng => [lat, lng];
