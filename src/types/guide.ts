export type GuideStatus = 'draft' | 'published' | 'archived';

export interface Guide {
  id?: string;
  title: string;
  summary?: string;
  slug?: string;
  heroImage?: string;
  estimatedTime?: string;
  skillLevel?: string;
  lastUpdatedAt?: string;
  contributors?: string[];
  status?: GuideStatus;
  guideType?: string;
  businessStage?: string;
  domain?: string;
  format?: string;
  popularity?: string;
  steps?: Array<{ position?: number; title?: string; content?: string }>;
  attachments?: Array<{ type?: 'file' | 'link'; title?: string; url?: string }>;
  templates?: Array<{ title?: string; url?: string; kind?: 'downloadable' | 'interactive' }>;
  relatedTools?: Array<{ title?: string; url?: string }>;
}

export interface GuideTaxonomies {
  guideType: { id: number; name: string }[];
  businessStage: { id: number; name: string }[];
  domain: { id: number; name: string }[];
  format: { id: number; name: string }[];
  popularity: { id: number; name: string }[];
}

