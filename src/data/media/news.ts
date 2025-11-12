export type NewsItem = {
  id: string;
  title: string;
  type: 'Announcement' | 'Guidelines' | 'Notice' | 'Thought Leadership';
  date: string;
  author: string;
  byline?: string;
  views: number;
  excerpt: string;
  image?: string;
  department?: string;
  location?: 'Dubai' | 'Nairobi' | 'Riyadh' | 'Remote';
  domain?: 'Technology' | 'Business' | 'People' | 'Operations';
  theme?: 'Leadership' | 'Delivery' | 'Culture' | 'DTMF';
  tags?: string[];
  readingTime?: '<5' | '5–10' | '10–20' | '20+';
  newsType?: 'Corporate Announcements' | 'Product / Project Updates' | 'Events & Campaigns' | 'Digital Tech News';
  newsSource?: 'DQ Leadership' | 'DQ Operations' | 'DQ Communications';
  focusArea?: 'GHC' | 'DWS' | 'Culture & People';
};

export const NEWS: NewsItem[] = [
  {
    id: 'leadership-principles',
    title: "Leadership Principles | What’s Your Leadership Superpower?",
    type: 'Thought Leadership',
    date: '2024-08-19',
    author: 'Leads',
    byline: 'Stephanie Kioko',
    views: 47,
    excerpt:
      'Researchers have identified more than 1,000 leadership traits, but only a handful consistently drive real impact…',
    department: 'Stories',
    location: 'Remote',
    theme: 'Leadership',
    tags: ['Playbook', 'EJP'],
    readingTime: '10–20',
    newsType: 'Digital Tech News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People'
  },
  {
    id: 'dq-storybook-live',
    title: 'From Vision to Impact: The DQ Storybook Goes Live!',
    type: 'Announcement',
    date: '2024-08-14',
    author: 'DQ Communications',
    views: 75,
    excerpt: 'We’re excited to announce that the DQ Story is now officially published on the DQ Competencies page…',
    department: 'Products',
    location: 'Dubai',
    domain: 'Business',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Communications',
    focusArea: 'GHC'
  },
  {
    id: 'dq-persona-mindset',
    title: 'DQ Persona | Not Just a Role – It’s a Qatalyst Mindset',
    type: 'Thought Leadership',
    date: '2024-08-12',
    author: 'DQ Associates',
    byline: 'Stephanie Kioko',
    views: 55,
    excerpt:
      'Culture eats strategy for breakfast—why a Qatalyst mindset matters for how we work and deliver…',
    department: 'Stories',
    location: 'Remote',
    theme: 'Culture',
    tags: ['QMS'],
    readingTime: '5–10',
    newsType: 'Events & Campaigns',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People'
  },
  {
    id: 'growth-emotional-intelligence',
    title: 'Grounded in Growth and Emotional Intelligence',
    type: 'Thought Leadership',
    date: '2024-08-08',
    author: 'Leads',
    byline: 'Stephanie Kioko',
    views: 79,
    excerpt:
      'People with a Growth Mindset are twice as likely to take on challenges and push through obstacles…',
    department: 'Intelligence',
    location: 'Dubai',
    theme: 'Leadership',
    tags: ['EJP', 'Playbook'],
    readingTime: '10–20',
    newsType: 'Digital Tech News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People'
  },
  {
    id: 'one-vision',
    title: 'The One Vision We All Build Toward',
    type: 'Thought Leadership',
    date: '2024-08-04',
    author: 'Partners',
    byline: 'Stephanie Kioko',
    views: 50,
    excerpt:
      'At DQ, we all share a single powerful vision that guides how we build and deliver value…',
    department: 'Solutions',
    location: 'Remote',
    theme: 'Delivery',
    tags: ['Playbook', 'QMS'],
    readingTime: '5–10',
    newsType: 'Product / Project Updates',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC'
  },
  {
    id: 'life-transactions',
    title: 'DQ’s Path to Perfect Life Transactions',
    type: 'Thought Leadership',
    date: '2024-08-01',
    author: 'Leads',
    byline: 'Stephanie Kioko',
    views: 49,
    excerpt:
      'Every day we make thousands of transactions—here’s how we design for clarity and flow…',
    department: 'Delivery — Deploys',
    location: 'Remote',
    theme: 'DTMF',
    tags: ['QMS', 'EJP'],
    readingTime: '10–20',
    newsType: 'Product / Project Updates',
    newsSource: 'DQ Operations',
    focusArea: 'GHC'
  },
  {
    id: 'agile-way-week',
    title: 'Your Week, the Agile Way',
    type: 'Thought Leadership',
    date: '2024-07-28',
    author: 'DQ Associates',
    byline: 'Stephanie Kioko',
    views: 69,
    excerpt:
      'Practical ways to plan your week with agile habits—focus, alignment, and iterative delivery…',
    department: 'Delivery — Designs',
    location: 'Nairobi',
    theme: 'Delivery',
    tags: ['Playbook'],
    readingTime: '<5',
    newsType: 'Events & Campaigns',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'riyadh-horizon-hub',
    title: 'Riyadh Horizon Hub Opens for Cross-Studio Delivery',
    type: 'Announcement',
    date: '2024-07-20',
    author: 'DQ Communications',
    views: 61,
    excerpt:
      'The new Riyadh Horizon Hub is live—bringing Delivery, Platform, and People teams together to accelerate Saudi programs.',
    department: 'Delivery — Deploys',
    location: 'Riyadh',
    domain: 'Business',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC'
  },
  {
    id: 'shifts-allocation-guidelines',
    title: 'Shifts Allocation Guidelines',
    type: 'Guidelines',
    date: '2024-07-25',
    author: 'DQ Communications',
    views: 58,
    excerpt: 'New guidelines to enhance fairness and transparency for shifts allocation across teams…',
    department: 'DCO Operations',
    location: 'Dubai',
    domain: 'People',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'islamic-new-year',
    title: 'Honoring the Islamic New Year',
    type: 'Notice',
    date: '2024-06-27',
    author: 'DQ Communications',
    views: 63,
    excerpt:
      'A reflection on Al-Hijra 1447 AH—renewal, gratitude, and the values that ground our community…',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    newsType: 'Events & Campaigns',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People'
  },
  {
    id: 'dq-website-launch',
    title: 'DQ Corporate Website Launch!',
    type: 'Announcement',
    date: '2024-06-24',
    author: 'DQ Communications',
    views: 84,
    excerpt:
      'Our new DQ corporate website is live—packed with what makes DQ a leader in digital delivery…',
    department: 'Products',
    location: 'Remote',
    domain: 'Technology',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Communications',
    focusArea: 'DWS'
  },
  {
    id: 'po-dev-sync-guidelines',
    title: 'Product Owner & Dev Sync Guidelines',
    type: 'Guidelines',
    date: '2024-06-19',
    author: 'DQ Communications',
    views: 70,
    excerpt:
      'Standardizing PO–Dev syncs for clarity, cadence, and decision-making across products…',
    department: 'DBP Delivery',
    location: 'Dubai',
    domain: 'Operations',
    newsType: 'Product / Project Updates',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'riyadh-designing-at-scale',
    title: 'Designing at Scale for Riyadh Citizen Services',
    type: 'Thought Leadership',
    date: '2024-06-15',
    author: 'Leads',
    byline: 'Yara Al Harthy',
    views: 52,
    excerpt:
      'How the Riyadh studio co-created digital citizen services with local regulators—pairing delivery playbooks with cultural fluency.',
    department: 'Delivery — Designs',
    location: 'Riyadh',
    theme: 'Delivery',
    tags: ['Playbook', 'EJP'],
    readingTime: '10–20',
    newsType: 'Product / Project Updates',
    newsSource: 'DQ Operations',
    focusArea: 'GHC'
  },
  {
    id: 'azure-devops-task-guidelines',
    title: 'Azure DevOps Task Guidelines',
    type: 'Guidelines',
    date: '2024-06-12',
    author: 'DQ Communications',
    views: 77,
    excerpt:
      'New task guidelines for ADO: naming, states, and flow so teams ship with less friction…',
    department: 'SecDevOps',
    location: 'Remote',
    domain: 'Technology',
    newsType: 'Digital Tech News',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'eid-al-adha',
    title: 'Blessed Eid al-Adha!',
    type: 'Notice',
    date: '2024-06-05',
    author: 'DQ Communications',
    views: 47,
    excerpt:
      'Warmest wishes to all observing Eid al-Adha—celebrating community and gratitude…',
    department: 'HRA (People)',
    location: 'Nairobi',
    domain: 'People',
    newsType: 'Events & Campaigns',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People'
  }
];
