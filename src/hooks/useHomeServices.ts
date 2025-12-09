import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { getServiceIcon } from '@/utils/serviceIconMap';
import type { LucideIcon } from 'lucide-react';

export interface HomeService {
  id: string;
  title: string;
  description: string | null;
  category: string;
  path: string | null;
  icon: string | null;
  iconComponent?: React.ReactNode; // React component for the icon
  tags: string[] | null;
  is_active: boolean | null;
  isActive?: boolean; // Mapped from is_active
  order: number | null;
  isTabbedCard?: boolean; // Special flag for tabbed cards
}

interface ServicesByCategory {
  learningKnowledge: HomeService[];
  servicesDigital: HomeService[];
  workCollaboration: HomeService[];
  cultureEvents: HomeService[];
  peopleOrg: HomeService[];
}

// Map Supabase categories to our internal category keys
const CATEGORY_MAPPING: Record<string, keyof ServicesByCategory> = {
  'Learning & Work Knowledge Hub': 'learningKnowledge',
  'Services & Digital Enablement': 'servicesDigital',
  'Work Execution & Collaboration': 'workCollaboration',
  'Culture, Events & Communications': 'cultureEvents',
  'People & Organization Hub': 'peopleOrg',
};

export function useHomeServices() {
  return useQuery<ServicesByCategory, Error>({
    queryKey: ['home-services'],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching home services:', error);
        throw error;
      }

      // Group services by category and map icon strings to React components
      const grouped: ServicesByCategory = {
        learningKnowledge: [],
        servicesDigital: [],
        workCollaboration: [],
        cultureEvents: [],
        peopleOrg: [],
      };

      (data || []).forEach((service) => {
        const categoryKey = CATEGORY_MAPPING[service.category];
        if (categoryKey) {
          const IconComponent = getServiceIcon(service.icon);
          const mappedService: HomeService = {
            ...service,
            isActive: service.is_active ?? true,
            iconComponent: <IconComponent />,
            // Check if this is the work-directory-hub card
            isTabbedCard: service.id === 'work-directory-hub',
          };
          grouped[categoryKey].push(mappedService);
        }
      });

      return grouped;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
