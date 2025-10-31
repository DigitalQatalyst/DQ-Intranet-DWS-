export type PostType = 'text' | 'media' | 'poll' | 'event' | 'article' | 'announcement';
export interface BasePost {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  created_at: string;
  created_by: string;
  author_username: string;
  author_avatar?: string;
  community_id: string;
  community_name: string;
  tags?: string[];
  helpful_count?: number;
  insightful_count?: number;
  comment_count?: number;
  post_type?: PostType;
  metadata?: any;
  event_date?: string;
  event_location?: string;
  status?: 'active' | 'flagged' | 'deleted';
}
export interface PostTypeBadgeConfig {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  emoji: string;
  colorClass: string;
}
export interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  caption?: string;
  display_order: number;
}
export interface PollOption {
  id: string;
  option_text: string;
  vote_count: number;
}
export interface EventMetadata {
  start_datetime?: string;
  end_datetime?: string;
  location?: string;
  banner_url?: string;
  rsvp_enabled?: boolean;
  rsvp_count?: number;
}