// DQ Map Location Types

export type LocationType = 'Headquarters' | 'Regional Office' | 'Client' | 'Authority';
export type Region = 'Dubai' | 'Abu Dhabi' | 'Riyadh' | 'Nairobi' | 'Kenya' | 'NEOM';

export type MapLocation = {
  id: string;
  name: string;
  position: [number, number]; // [lat, lng] - IMPORTANT: stored as lat,lng
  description: string;
  address?: string;
  contactPhone?: string;
  type: LocationType;
  region: Region;
  services?: string[];
  operatingHours?: string;
};

export type MapStyle = 'standard' | 'satellite' | 'hybrid';
