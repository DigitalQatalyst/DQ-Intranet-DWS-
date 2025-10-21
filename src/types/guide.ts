export type GuideStatus = 'Draft' | 'Approved' | 'Archived';

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
  domain?: string;
  functionArea?: string;
  complexityLevel?: 'Basic' | 'Intermediate' | 'Comprehensive';
  steps?: Array<{ position?: number; title?: string; content?: string }>;
  attachments?: Array<{ type?: 'file' | 'link'; title?: string; url?: string }>;
  templates?: Array<{ title?: string; url?: string; kind?: 'downloadable' | 'interactive' }>;
  relatedTools?: Array<{ title?: string; url?: string }>;
}

export interface GuideTaxonomies {
  domain: { id: number; name: string }[];
  guideType: { id: number; name: string }[];
  functionArea: { id: number; name: string }[];
  status: { id: number; name: string }[];
}
