import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Factory,
  Users,
  Briefcase,
  Rocket,
  Code,
  Shield,
  FileText,
  BarChart3,
  Lightbulb,
  ShoppingBag,
  Heart,
  Globe,
  Settings,
  Zap,
} from 'lucide-react';

interface UnitIconProps {
  sector?: string;
  unitName?: string;
}

export function getUnitIcon({ sector, unitName }: UnitIconProps): LucideIcon {
  const normalizedSector = sector?.toLowerCase() || '';
  const normalizedUnit = unitName?.toLowerCase() || '';

  // Match by unit name first (more specific)
  if (normalizedUnit.includes('hra') || normalizedUnit.includes('people') || normalizedUnit.includes('hr')) {
    return Heart;
  }
  if (normalizedUnit.includes('finance')) {
    return ShoppingBag;
  }
  if (normalizedUnit.includes('deals')) {
    return Briefcase;
  }
  if (normalizedUnit.includes('stories') || normalizedUnit.includes('content')) {
    return FileText;
  }
  if (normalizedUnit.includes('intelligence') || normalizedUnit.includes('analytics')) {
    return BarChart3;
  }
  if (normalizedUnit.includes('solutions')) {
    return Lightbulb;
  }
  if (normalizedUnit.includes('products')) {
    return Rocket;
  }
  if (normalizedUnit.includes('secdevops') || normalizedUnit.includes('security')) {
    return Shield;
  }
  if (normalizedUnit.includes('delivery') || normalizedUnit.includes('deploy')) {
    return Zap;
  }
  if (normalizedUnit.includes('design')) {
    return Code;
  }
  if (normalizedUnit.includes('platform') || normalizedUnit.includes('dco') || normalizedUnit.includes('operations')) {
    return Settings;
  }
  if (normalizedUnit.includes('coe')) {
    return Globe;
  }

  // Match by sector
  if (normalizedSector.includes('factory')) {
    return Factory;
  }
  if (normalizedSector.includes('sector')) {
    return Building2;
  }
  if (normalizedSector.includes('unit')) {
    return Users;
  }

  // Default
  return Building2;
}

