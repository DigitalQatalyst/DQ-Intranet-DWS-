import type { MapLocation, Region, LocationType } from '../types/map';

export const LOCATIONS: MapLocation[] = [
  {
    id: 'opal-tower-hq',
    name: 'OPAL Tower, Business Bay (HQ)',
    position: [25.18778, 55.27194],
    description: 'Main headquarters located in OPAL Tower, Business Bay.',
    address: 'Business Bay, Dubai',
    type: 'Headquarters',
    region: 'Dubai',
  },
  {
    id: 'nbo-office',
    name: 'NBO Office',
    position: [-1.28559, 36.81994],
    description: 'East Africa regional office supporting clients across Kenya.',
    address: 'Nairobi, Kenya',
    type: 'Regional Office',
    region: 'Kenya',
  },
  {
    id: 'riyadh-office',
    name: 'Riyadh Office',
    position: [24.6896, 46.6863],
    description: 'Regional office serving the Kingdom of Saudi Arabia.',
    address: 'King Fahd Rd, Riyadh',
    type: 'Regional Office',
    region: 'Riyadh',
  },
  {
    id: 'khalifa-fund',
    name: 'Khalifa Fund (KF)',
    position: [24.466667, 54.366669],
    description: 'Partnering with KF to accelerate SME and entrepreneurship programmes.',
    address: 'Abu Dhabi, UAE',
    type: 'Client',
    region: 'Abu Dhabi',
  },
  {
    id: 'neom-bank',
    name: 'NEOM Bank',
    position: [27.632, 35.3],
    description: 'Supporting NEOM’s next-generation financial initiatives.',
    address: 'NEOM, Saudi Arabia',
    type: 'Client',
    region: 'NEOM',
  },
  {
    id: 'saib-bank',
    name: 'SAIB Bank',
    position: [24.689, 46.685],
    description: 'Digital programmes delivered with Saudi Investment Bank.',
    address: 'Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
  },
  {
    id: 'stc-bank',
    name: 'STC Bank',
    position: [24.7226, 46.6423],
    description: 'STC-backed digital banking ecosystem rollout.',
    address: 'Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
  },
  {
    id: 'adib',
    name: 'ADIB',
    position: [24.4958, 54.3705],
    description: 'Islamic banking transformation with Abu Dhabi Islamic Bank.',
    address: 'Abu Dhabi, UAE',
    type: 'Client',
    region: 'Abu Dhabi',
  },
  {
    id: 'dfsa',
    name: 'DFSA',
    position: [25.2094, 55.2721],
    description: 'Regulatory collaboration with Dubai Financial Services Authority.',
    address: 'DIFC, Dubai',
    type: 'Authority',
    region: 'Dubai',
  },
  {
    id: 'dewa',
    name: 'DEWA',
    position: [25.2165, 55.2607],
    description: 'Smart-city innovation with Dubai Electricity and Water Authority.',
    address: 'Zabeel, Dubai',
    type: 'Authority',
    region: 'Dubai',
  },
];

const delay = () => new Promise((resolve) => setTimeout(resolve, 80));

export const fetchAllLocations = async (): Promise<MapLocation[]> => {
  await delay();
  return LOCATIONS;
};

export const fetchLocationsByRegion = async (region: Region): Promise<MapLocation[]> => {
  await delay();
  return LOCATIONS.filter((loc) => loc.region === region);
};

export const fetchLocationsByType = async (type: LocationType): Promise<MapLocation[]> => {
  await delay();
  return LOCATIONS.filter((loc) => loc.type === type);
};

export const getUniqueRegions = (): Region[] => {
  const regions = new Set(LOCATIONS.map((loc) => loc.region));
  return Array.from(regions).sort();
};

export const getUniqueTypes = (): LocationType[] => {
  const types = new Set(LOCATIONS.map((loc) => loc.type));
  return Array.from(types).sort();
};

export const searchLocations = async (query: string): Promise<MapLocation[]> => {
  await delay();
  const lowerQuery = query.toLowerCase();
  return LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.description.toLowerCase().includes(lowerQuery) ||
      loc.address?.toLowerCase().includes(lowerQuery),
  );
};
