// Types for DQ DNA Nodes and Tiles based on Supabase schema

export type DqRole = 'vision' | 'hov' | 'personas' | 'tms' | 'sos' | 'flows' | 'dtmf';
export type DqFill = 'blue' | 'teal' | 'purple' | 'indigo' | 'orange' | 'rose' | 'emerald';
export type DqTone = 'primary' | 'secondary' | 'accent' | 'neutral';

/**
 * DQ DNA Node - represents one of the 7 core dimensions
 */
export interface DqDnaNode {
  id: number;                    // 1-7, matches UI numbering
  role: DqRole;
  title: string;
  subtitle: string;
  fill: DqFill;
  details?: string[];            // Optional bullet points
  kb_url: string;                // Knowledge base URL
  lms_url: string;               // Learning management system URL
  image_url?: string;            // Unsplash image URL for DNA node
  created_at: string;
}

/**
 * DQ Tile - represents marketplace tiles
 */
export interface DqTile {
  id: string;                    // e.g. 'dtmp', 'dtmaas', 'dtq4t', 'dtmb', 'dtmi', 'dtma', 'dcocc'
  title: string;
  subtitle: string;
  description: string;
  tone: DqTone;
  href?: string;
  sort_order: number;
  image_url?: string;            // Unsplash image URL for tile
  created_at: string;
}

/**
 * Extended DnaItem for UI components (combines database fields with UI-specific props)
 */
export interface DnaItemUI extends Omit<DqDnaNode, 'role' | 'fill'> {
  key: string;                   // Same as role
  tag: string;                   // Same as subtitle
  description: string;           // Combines subtitle and details
  href: string;                  // Same as kb_url or lms_url
  accent?: DqFill;               // Same as fill
  icon?: React.ReactNode;        // UI icon component
}
