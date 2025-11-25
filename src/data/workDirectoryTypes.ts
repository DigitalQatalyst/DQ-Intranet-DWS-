// TypeScript types matching Supabase schema rows
export type WorkUnitRow = {
  id: string;
  sector: string;
  unit_name: string;
  unit_type: string;
  mandate: string;
  location: string;
  banner_image_url?: string | null;
  priority_scope?: string | null;
  performance_status?: string | null;
  focus_tags: string[] | null;
  slug: string;
  wi_areas?: string[] | null;
  priorities?: string | null;
  performance_summary?: string | null;
  priorities_list?: string[] | null;
  current_focus?: string | null;
  performance_notes?: string | null;
  priority_level?: string | null;
  performance_score?: number | null;
  performance_updated_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface WorkUnit {
  id: string;
  slug: string;
  sector: string;
  unitName: string;
  unitType: string;
  mandate: string;
  location: string;
  focusTags: string[];
  priorityScope?: string | null;
  performanceStatus?: string | null;
  wiAreas: string[];
  department?: string;
  bannerImageUrl?: string | null;
  priorities?: string | null;
  performanceSummary?: string | null;
  prioritiesList?: string[] | null;
  currentFocus?: string | null;
  performanceNotes?: string | null;
  priorityLevel?: string | null;
  priorityScopeRaw?: string | null;
  updatedAt?: string | null;
  performanceScore?: number | null;
  performanceUpdatedAt?: string | null;
}

export type UnitFilters = {
  department: string[];
  unitType: string[];
  location: string[];
  focusTags: string[];
};

export type WorkPositionRow = {
  id: string;
  slug: string;
  position_name: string;
  role_family: string | null;
  department: string | null;
  unit: string | null;
  unit_slug: string | null;
  location: string | null;
  sfia_rating: string | null;
  sfia_level: string | null;
  contract_type: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[] | null;
  expectations: string | null; // Changed from string[] to string (text field)
  image_url: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface WorkPosition {
  id: string;
  slug: string;
  positionName: string;
  roleFamily?: string | null;
  department?: string | null;
  unit?: string | null;
  unitSlug?: string | null;
  location?: string | null;
  sfiaRating?: string | null;
  sfiaLevel?: string | null;
  contractType?: string | null;
  summary?: string | null;
  description?: string | null;
  responsibilities: string[];
  expectations: string | null; // Changed from string[] to string (text field)
  imageUrl?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type Associate = {
  id: string; // uuid
  name: string; // text
  current_role: string; // text
  department: string; // text
  unit: string; // text
  location: string; // text
  sfia_rating: string; // text
  status: string; // text
  email: string; // text
  key_skills: string[]; // jsonb
  bio: string; // text
  avatar_url?: string | null; // text
  phone?: string | null; // text
  summary?: string | null; // text
  created_at?: string;
  updated_at?: string;
};

export type EmployeeProfile = {
  id: string | null;
  full_name: string | null;
  role_title: string | null;
  unit: string | null;
  department: string | null;
  location: string | null;
  years_experience: number | null;
  status: string | null;
  sfia_level: string | null;
  bio: string | null;
  core_skills: string[] | null;
  key_attributes: string[] | null;
  tools_and_systems: string[] | null;
  qualifications: string[] | null;
  languages: string[] | null;
  hobbies: string[] | null;
  notable_achievements: string[] | null;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
};
