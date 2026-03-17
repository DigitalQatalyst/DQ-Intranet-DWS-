import { geocode } from './geocode';
import { isValidLatLng, maybeFlip } from '../utils/geo';

export type CleanLocation = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  category?: string;
  lat?: number;
  lng?: number;
  description?: string;
  services?: string[];
  region?: string;
};

export type RawLocation = CleanLocation & {
  lat?: number;
  lng?: number;
};

const composeQuery = (loc: RawLocation) => {
  if (loc.address) return loc.address;
  const parts = [loc.name, loc.city, loc.country].filter(Boolean);
  return parts.join(', ');
};

export async function resolveCleanLocations(raw: RawLocation[]): Promise<CleanLocation[]> {
  const resolved: CleanLocation[] = [];

  for (const record of raw) {
    let lat = record.lat;
    let lng = record.lng;

    const flipped = maybeFlip(lat, lng, record.country);
    if (flipped) {
      lat = flipped.lat;
      lng = flipped.lng;
    }

    if (!isValidLatLng(lat, lng, record.country)) {
      const query = composeQuery(record);
      if (query) {
        const geocoded = await geocode(query);
        if (geocoded) {
          lat = geocoded.lat;
          lng = geocoded.lng;
        }
      }
    }

    if (!isValidLatLng(lat, lng, record.country)) {
      console.warn('[resolveCleanLocations] skipping invalid location', record.name, record.id);
      continue;
    }

    resolved.push({
      ...record,
      lat,
      lng,
    });
  }

  return resolved;
}
