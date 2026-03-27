export interface WorkUnit {
  id: string;
  slug: string;
  sector: string;
  unitName: string;
  unitType: string;
  mandate?: string | null;
  location: string;
  focusTags?: string[] | null;
  priorityLevel?: string | null;
  priorityScope?: string | null;
  performanceStatus?: string | null;
  performanceScore?: number | null;
  performanceSummary?: string | null;
  performanceNotes?: string | null;
  performanceUpdatedAt?: string | null;
  wiAreas?: string[] | null;
  bannerImageUrl?: string | null;
  department?: string | null;
  currentFocus?: string | null;
  priorities?: string | null;
  prioritiesList?: string[] | null;
  updatedAt?: string | null;
}

export interface WorkPosition {
  id: string;
  slug: string;
  positionName: string;
  heroTitle?: string | null;
  roleFamily?: string | null;
  unit?: string | null;
  unitSlug?: string | null;
  location?: string | null;
  sfiaLevel?: string | null;
  sfiaRating?: string | null;
  summary?: string | null;
  description?: string | null;
  responsibilities?: string[] | null;
  expectations?: string | null;
  status?: string | null;
  imageUrl?: string | null;
  bannerImageUrl?: string | null;
  department?: string | null;
  contractType?: string | null;
  reportsTo?: string | null;
}

export interface EmployeeProfile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  department?: string | null;
  unit?: string | null;
  role?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  summary?: string | null;
  key_skills?: string[] | null;
  sfia_rating?: string | null;
  status?: string | null;
  hobbies?: string[] | null;
  technical_skills?: string[] | null;
  functional_skills?: string[] | null;
  soft_skills?: string[] | null;
  key_competencies?: string[] | null;
  languages?: string[] | null;
  [key: string]: unknown;
}

export interface WorkAssociate {
  id: string;
  name: string;
  currentRole: string;
  department: string;
  unit: string;
  location: string;
  sfiaRating: string;
  status: string;
  level?: string | null;
  email: string;
  phone?: string | null;
  teams_link?: string | null;
  keySkills: string[];
  bio: string;
  summary?: string | null;
  avatarUrl?: string | null;
  hobbies?: string[];
  technicalSkills?: string[];
  functionalSkills?: string[];
  softSkills?: string[];
  keyCompetencies?: string[];
  languages?: string[];
}

