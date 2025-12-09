import {
  GraduationCap,
  Layers,
  Star,
  Compass,
  BarChart,
  Book as BookIcon,
  BookOpen,
  Briefcase,
  Globe,
  Lightbulb,
  Clock,
  ClipboardList,
  TrendingUp,
  MessageCircle,
  HeartHandshake,
  Newspaper,
  Calendar,
  Building,
  Award,
  CircleDot,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Map icon string names from Supabase to React icon components
export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  'GraduationCap': GraduationCap,
  'Layers': Layers,
  'Star': Star,
  'Compass': Compass,
  'BarChart': BarChart,
  'Book': BookIcon,
  'BookOpen': BookOpen,
  'Briefcase': Briefcase,
  'Globe': Globe,
  'Lightbulb': Lightbulb,
  'Clock': Clock,
  'ClipboardList': ClipboardList,
  'TrendingUp': TrendingUp,
  'MessageCircle': MessageCircle,
  'HeartHandshake': HeartHandshake,
  'Newspaper': Newspaper,
  'Calendar': Calendar,
  'Building': Building,
  'Award': Award,
  // Add more mappings as needed
};

export function getServiceIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) return CircleDot;
  const Icon = SERVICE_ICON_MAP[iconName] || CircleDot;
  return Icon;
}
