import { ICON_BY_ID, DEFAULT_COURSE_ICON } from '@/lms/icons';
export { ICON_BY_ID, DEFAULT_COURSE_ICON };
export const CARD_ICON_BY_ID = ICON_BY_ID;

import type { LucideIcon } from 'lucide-react';
import {
  BookOpenCheck,
  GraduationCap,
  Atom,
  MonitorSmartphone,
  Layers,
  GitBranch,
  FileText,
  Clock as ClockIcon,
  MapPin,
  UserRound,
  Building2,
  CheckCircle2,
  Hourglass,
  Video,
  Workflow
} from 'lucide-react';

const courseCategoryIcons: Record<string, LucideIcon> = {
  GHC: GraduationCap,
  "6x Digital": Atom,
  DWS: MonitorSmartphone,
  DXP: Layers,
  "Key Tools": GitBranch,
  "Day in DQ": BookOpenCheck
};

const deliveryModeIcons: Record<string, LucideIcon> = {
  Video,
  Guide: FileText,
  Hybrid: Workflow,
  Workshop: Workflow,
  Online: Video
};

export const resolveChipIcon = (
  key: string,
  value?: string
): LucideIcon | null => {
  if (!value) return null;
  switch (key) {
    case "courseCategory":
      return courseCategoryIcons[value] || null;
    case "deliveryMode":
      return deliveryModeIcons[value] || null;
    case "duration":
      return ClockIcon;
    case "level":
      return GraduationCap;
    case "location":
      return MapPin;
    case "audience":
      return UserRound;
    case "department":
      return Building2;
    case "status":
      return value.toLowerCase() === "live"
        ? CheckCircle2
        : value === "coming-soon"
        ? Hourglass
        : null;
    default:
      return null;
  }
};
