import type { SearchResultCard } from '@/pages/SearchResultsPage.types';

/**
 * Maps a free-text query to one or more DQ marketplaces with summaries.
 * This is used by both the hero search and the SearchResultsPage.
 */
export function getSearchMatches(query: string): SearchResultCard[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const normalized = trimmedQuery.toLowerCase();

  const catalog: Record<string, SearchResultCard> = {
    it: {
      id: 'it',
      title: 'IT & Systems Support',
      description:
        'Helpdesk, access requests, device provisioning, and app support for every squad.',
      href: '/it-systems-support',
    },
    hr: {
      id: 'hr',
      title: 'HR & Finance Services',
      description:
        'Leave policies, payroll assistance, reimbursements, and people operations in one place.',
      href: '/hr-finance-services',
    },
    facilities: {
      id: 'facilities',
      title: 'Facilities & Logistics',
      description:
        'Seat requests, office logistics, travel coordination, and on-site workspace support.',
      href: '/facilities-logistics',
    },
    learningCenter: {
      id: 'learning-center',
      title: 'DQ Learning Center',
      description: 'Courses, learning tracks, and associate reviews for core DQ capabilities.',
      href: '/lms',
    },
    servicesCenter: {
      id: 'services-center',
      title: 'DQ Services Center',
      description: 'Business services, technology services, and digital worker tools.',
      href: '/dq-services-center',
    },
    workCenter: {
      id: 'work-center',
      title: 'DQ Work Center',
      description: 'Daily sessions, project work, and execution trackers.',
      href: '/events',
    },
    workDirectory: {
      id: 'work-directory',
      title: 'DQ Work Directory',
      description: 'Units, positions, and associate profiles across the organization.',
      href: '/marketplace/work-directory',
    },
    mediaCenter: {
      id: 'media-center',
      title: 'DQ Media Center',
      description: 'News, announcements, blogs, and internal job openings.',
      href: '/marketplace/opportunities',
    },
    mediaNews: {
      id: 'media-news',
      title: 'News & Announcements · DQ Media Center',
      description: 'Corporate announcements, product updates, and key comms from across DQ.',
      href: '/marketplace/opportunities?tab=announcements',
    },
    mediaBlogs: {
      id: 'media-blogs',
      title: 'Blogs & Stories · DQ Media Center',
      description: 'Long-form blogs, stories, and thought leadership from DQ teams.',
      href: '/marketplace/opportunities?tab=insights',
    },
    mediaJobs: {
      id: 'media-jobs',
      title: 'Job Openings · DQ Media Center',
      description: 'Internal job openings, mobility opportunities, and career moves inside DQ.',
      href: '/marketplace/opportunities?tab=opportunities',
    },
    workCommunities: {
      id: 'work-communities',
      title: 'DQ Work Communities',
      description: 'Discussion rooms, pulse updates, and events for teams and chapters.',
      href: '/dq-work-communities',
    },
    knowledgeCenter: {
      id: 'knowledge-center',
      title: 'DQ Knowledge Center',
      description: 'Strategy guides, blueprints, libraries, and testimonials.',
      href: '/marketplace/guides',
    },
  };

  const results: SearchResultCard[] = [];

  const add = (key: keyof typeof catalog) => {
    const card = catalog[key];
    if (!results.find((r) => r.id === card.id)) {
      results.push(card);
    }
  };

  // Map common intents/keywords to marketplaces
  if (
    /\bit\b/.test(normalized) ||
    normalized.includes('device') ||
    normalized.includes('system') ||
    normalized.includes('laptop') ||
    normalized.includes('password')
  ) {
    add('it');
    add('servicesCenter');
  }

  if (
    /\bhr\b/.test(normalized) ||
    normalized.includes('leave') ||
    normalized.includes('payroll') ||
    normalized.includes('benefit') ||
    normalized.includes('salary')
  ) {
    add('hr');
    add('servicesCenter');
  }

  if (
    normalized.includes('seat') ||
    normalized.includes('seating') ||
    normalized.includes('office') ||
    normalized.includes('facility') ||
    normalized.includes('logistics')
  ) {
    add('facilities');
  }

  if (
    normalized.includes('course') ||
    normalized.includes('training') ||
    normalized.includes('learning') ||
    normalized.includes('lms') ||
    normalized.includes('track')
  ) {
    add('learningCenter');
  }

  if (
    normalized.includes('service') ||
    normalized.includes('request') ||
    normalized.includes('ticket') ||
    normalized.includes('support')
  ) {
    add('servicesCenter');
  }

  if (
    normalized.includes('session') ||
    normalized.includes('tracker') ||
    normalized.includes('project') ||
    normalized.includes('task') ||
    normalized.includes('execution')
  ) {
    add('workCenter');
  }

  if (
    normalized.includes('directory') ||
    normalized.includes('associate') ||
    normalized.includes('profile') ||
    normalized.includes('position') ||
    normalized.includes('role') ||
    normalized.includes('org chart')
  ) {
    add('workDirectory');
  }

  if (
    normalized.includes('news') ||
    normalized.includes('announcement') ||
    normalized.includes('release') ||
    normalized.includes('update')
  ) {
    add('mediaCenter');
    add('mediaNews');
  }

  if (
    normalized.includes('blog') ||
    normalized.includes('story') ||
    normalized.includes('stories')
  ) {
    add('mediaCenter');
    add('mediaBlogs');
  }

  if (
    normalized.includes('job') ||
    normalized.includes('opening') ||
    normalized.includes('vacancy') ||
    normalized.includes('career')
  ) {
    add('mediaCenter');
    add('mediaJobs');
  }

  if (
    normalized.includes('community') ||
    normalized.includes('discussion') ||
    normalized.includes('pulse') ||
    normalized.includes('poll') ||
    normalized.includes('room')
  ) {
    add('workCommunities');
  }

  if (
    normalized.includes('guide') ||
    normalized.includes('blueprint') ||
    normalized.includes('playbook') ||
    normalized.includes('knowledge') ||
    normalized.includes('faq') ||
    normalized.includes('glossary') ||
    normalized.includes('library')
  ) {
    add('knowledgeCenter');
  }

  // Fallback: if nothing matched, suggest Knowledge Center as a starting point
  if (!results.length) {
    add('knowledgeCenter');
  }

  return results;
}


