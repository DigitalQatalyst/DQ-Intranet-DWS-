import { DQ_LOCATIONS, type LocationItem } from "../api/MAPAPI";

export type AboutDQContent = {
  headline: string;
  paragraphs: string[];
  bullets: string[];
};

export type HeroStats = {
  studios: number;
  markets: string;
  associates: number;
  projects?: number;
};

export const ABOUT_DQ_CONTENT: AboutDQContent = {
  headline: "Discover Digital Qatalyst",
  paragraphs: [
    "Digital Qatalyst (DQ) is a digital transformation company focused on building smart workspaces and productivity platforms.",
  ],
  bullets: [
    "Studios in DXB, NBO and KSA markets.",
    "Focused on digital productivity, workspaces and agile delivery.",
    "Combines governance, operations and platforms into one ecosystem.",
  ],
};

export const HERO_STATS: HeroStats = {
  studios: 3,
  markets: "UAE, KSA, Kenya",
  associates: 150,
  projects: 100,
};

export const DQ_OFFICE_LOCATIONS: LocationItem[] = DQ_LOCATIONS.filter(
  (loc) => loc.type === "Headquarters" || loc.type === "Regional Office"
);

