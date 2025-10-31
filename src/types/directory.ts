// DQ Directory Data Models

export type SectorType = "Governance" | "Operations" | "Platform" | "Delivery";

export type Unit = {
  id: string;
  name: string;
  sector: SectorType;
  streams?: string[]; // Tower badges to display
  description?: string;
  marketplaceUrl: string;
  tags?: string[];
  logoUrl?: string; // For EJP card style
};

export type Studio = "DXB" | "NBO" | "KSA" | "Home" | "Other";
export type Status = "Active" | "Probation" | "Onboarding" | "Exited" | "TBC";
export type Seniority = "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";

export type Associate = {
  id: string;
  name: string;
  roleTitle: string;
  unitName: string;
  sector: SectorType;
  studio: Studio;
  status: Status;
  seniority: Seniority;
  tagline?: string;
  skills?: string[];
  phone?: string;
  email?: string;
  profileUrl?: string;
  avatarUrl?: string;
  description?: string; // 2-line bio for card display
};

export type DirectoryFilters = {
  sectors: SectorType[];
  streams: string[];
  studios?: Studio[];
  statuses?: Status[];
  seniorities?: Seniority[];
  skills?: string[];
};

export type ViewMode = 'units' | 'associates';
export type SortOption = 'a-z' | 'most-streams' | 'seniority' | 'recent';
