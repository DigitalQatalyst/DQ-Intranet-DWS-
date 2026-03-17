import {
  BookOpenCheck,
  GraduationCap,
  Atom,
  MonitorSmartphone,
  Layers,
  GitBranch,
  Brain,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';

export const ICON_BY_ID: Record<string, any> = {
  'dq-essentials': BookOpenCheck,
  'ghc-primer': GraduationCap,
  'sixx-digital': Atom,
  'dws-tools': MonitorSmartphone,
  'dxp-basics': Layers,
  'git-vercel': GitBranch,
  'cursor-ai': Brain,
  'first-7-days': CalendarDays,
  'governance-lite': ShieldCheck
};

export const DEFAULT_COURSE_ICON = BookOpenCheck;
