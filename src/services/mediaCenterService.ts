import { supabase } from '@/lib/supabaseClient'
import type { NewsItem } from '@/data/media/news'
import type { JobItem } from '@/data/media/jobs'

// Temporarily exclude specific legacy announcements from UI listings
const EXCLUDED_NEWS_IDS: string[] = [
  'dq-dxb-ksa-christmas-new-year-schedule',
  'dq-nbo-christmas-new-year-schedule'
]

// Fallback mock news data when database is unavailable
const MOCK_NEWS: NewsItem[] = [
  // ANNOUNCEMENTS (for News & Announcements tab)
  {
    id: 'eid-al-fitr-holiday-2026',
    title: 'EID AL-FITR HOLIDAY',
    type: 'Announcement',
    date: '2026-03-16',
    author: 'HRA',
    byline: 'DQ Operations',
    views: 0,
    excerpt: 'As we approach the end of Ramadan, please find latest update regarding the Eid Al-Fitr holiday.',
    department: 'DQ Operations',
    location: 'Dubai',
    domain: 'Operations',
    tags: ['eid', 'holiday', 'ramadan', 'announcement'],
    readingTime: '<5',
    newsType: 'Operational Notices',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    how: `Eid Al-Fitr holidays for DXB and KSA associates have been confirmed from Thursday, 19 March 2026 to Sunday, 22 March 2026, with work resuming on Monday, 23 March 2026.

For NBO associates, the holiday dates in Kenya remain tentative and are pending official gazettement.

The holiday is expected to fall on either Thursday, 19 March or Friday, 20 March 2026, and final confirmation will be shared once the official announcement is made.
Key Highlights:
- DXB & KSA Holidays Confirmed: 19 March – 22 March 2026
- Work Resumes: Monday, 23 March 2026
- NBO Holiday Dates: Pending official confirmation (expected 19 or 20 March)
- Final confirmation for NBO will be shared once announced`,
    what: `The following holiday schedule updates outline confirmed dates for DXB and KSA, along with tentative timelines for NBO to help teams plan effectively.
What's Changing:
- DXB & KSA Holidays Confirmed: 19 March – 22 March 2026
- Work Resumes: Monday, 23 March 2026
- NBO Holiday Dates: Pending official confirmation (expected 19 or 20 March)
- Final confirmation for NBO will be shared once announced`,
    when: `The following timeline outlines confirmed holiday dates and expected schedules to help teams plan accordingly.
Timeline:
- DXB & KSA Holidays: 19 March – 22 March 2026
- Work Resumes: 23 March 2026
- NBO Holiday: Expected on 19 or 20 March (TBC)
- Final NBO confirmation will be shared once officially announced`,
    why: `As Ramadan concludes, Eid Al-Fitr holiday updates have been shared for DXB, KSA, and NBO. While DXB and KSA dates are confirmed, NBO dates remain tentative, and teams are advised to plan work accordingly.
Purpose:
- Provide clarity on Eid Al-Fitr holiday dates for DXB, KSA, and NBO teams
- Ensure teams are aware of confirmed vs tentative schedules
- Support proactive planning and workload management
- Maintain smooth operations and minimal disruption during the holiday period`,
  },
  {
    id: 'ramadan-work-timings-2026',
    title: 'Ramadan Work Timings Updates',
    type: 'Announcement',
    date: '2026-02-13',
    author: 'HRA',
    byline: 'DQ Operations',
    views: 0,
    excerpt: 'Updated working arrangements during Ramadan starting 17 February 2026.',
    department: 'DQ Operations',
    location: 'Dubai',
    domain: 'Operations',
    tags: ['ramadan', 'working hours', 'DXB', 'KSA', 'schedule'],
    readingTime: '<5',
    newsType: 'Company News',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `In observance of the holy month of Ramadan, updated working arrangements will take effect from Tuesday, 17 February 2026, to support employees while maintaining smooth collaboration across teams.

During this period, DXB and KSA associates will follow revised working hours from 9:00 AM to 3:00 PM (Monday to Friday), without a lunch break, while NBO associates will continue with their regular working hours. To ensure effective coordination between locations, the NBO lunch break will be temporarily adjusted to 3:00 PM – 4:00 PM (DXB Time) / 2:00 PM – 3:00 PM (NBO Time), creating a shared collaboration window from 2:00 PM – 3:00 PM (DXB Time) for cross-team meetings.

Sessions that were previously scheduled during the adjusted period are being coordinated with Sreya Lakshmi and will be rescheduled to align with the new arrangement. Teams are encouraged to update their calendars accordingly to ensure a smooth workflow throughout the Ramadan period. Ramadan Mubarak to all observing — we wish everyone a blessed and peaceful month.`,
    why: `In observance of the holy month of Ramadan, working arrangements are being adjusted to support employees while maintaining smooth collaboration across teams.
Purpose:
- Respect Ramadan observance
- Support employee wellbeing
- Maintain operational continuity between DXB, KSA, and NBO teams`,
    what: `The following working arrangements have been updated effective 17 February 2026.
What's changing:
- DXB & KSA working hours: 9:00 AM – 3:00 PM (Monday to Friday)
- Working hours are exclusive of a lunch break
- NBO associates will continue with their regular working hours
- NBO lunch break adjusted: 3:00 PM – 4:00 PM (DXB Time) / 2:00 PM – 3:00 PM (NBO Time)`,
    how: `In observance of Ramadan, updated working arrangements will take effect from 17 February 2026 to support employees while ensuring smooth collaboration across teams. DXB and KSA associates will follow revised working hours, while NBO will continue with its regular schedule.

DXB and KSA will work from 9:00 AM – 3:00 PM (Monday–Friday) without a lunch break. The NBO lunch break will be temporarily adjusted to enable a shared collaboration window from 2:00 PM – 3:00 PM (DXB Time).

Sessions scheduled during the adjusted period will be rescheduled to align with the new arrangement. Teams are encouraged to update their calendars to ensure a smooth workflow throughout the Ramadan period.
Key Highlights:
- Revised Ramadan Working Hours: DXB and KSA associates will work 9:00 AM – 3:00 PM (Monday–Friday) without a lunch break.
- NBO Working Hours: NBO associates will continue with their regular working hours.
- Adjusted NBO Lunch Break: Temporarily moved to 3:00 PM – 4:00 PM (DXB Time) / 2:00 PM – 3:00 PM (NBO Time) to support cross-team collaboration.
- Collaboration Window: A shared meeting window from 2:00 PM – 3:00 PM (DXB Time) will be available for cross-location coordination.
- Session Rescheduling: Sessions scheduled during the adjusted period will be rescheduled in coordination with Sreya Lakshmi.`,
    when: `Ramadan Mubarak to all observing. We wish everyone a blessed and peaceful month.
Timeline:
- Effective Tuesday, 17th February 2026 through the end of Ramadan.
- All DXB and KSA associates are expected to follow the revised schedule from the first day of Ramadan.`,
  },
  {
    id: 'dxb-eoy-event-postponement',
    title: 'DXB EoY Event Postponement',
    type: 'Announcement',
    archived: true,
    date: '2025-12-19',
    author: 'Fadil A',
    byline: 'DQ Operations',
    views: 0,
    excerpt: 'Due to unfavourable weather conditions, the DQ Studios Y/E Annual Gathering scheduled for 19.12.2025 has been rescheduled for everyone safety.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Operations',
    location: 'Dubai',
    domain: 'Operations',
    tags: ['event', 'postponement', 'annual gathering', 'weather'],
    readingTime: '<5',
    newsType: 'Company News',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DXB EoY Event Postponement

Due to unfavourable weather conditions, the DQ Studios Y/E Annual Gathering scheduled for 19.12.2025 has been rescheduled for everyone's safety.

We sincerely apologise for the inconvenience and appreciate your understanding.

To ensure the date chosen is convenient for DXB Associates. I will be sharing a poll shortly to confirm a date. Once confirmed, details regarding the rescheduled date will be shared after.`
  },
  {
    id: 'dq-townhall-meeting-agenda',
    title: 'DQ Townhall Meeting Agenda',
    type: 'Announcement',
    archived: true,
    date: '2025-11-21',
    author: 'Irene Musyoki',
    byline: 'DQ Operations',
    views: 0,
    excerpt: 'Join us for the upcoming DQ Townhall meeting featuring working room guidelines, Scrum Master framework discussions, and important organizational updates.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Operations',
    location: 'Dubai',
    domain: 'Operations',
    tags: ['townhall', 'meeting', 'agenda', 'framework'],
    readingTime: '5–10',
    newsType: 'Upcoming Events',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Townhall Meeting Agenda

Join us for the upcoming DQ Townhall meeting featuring working room guidelines, Scrum Master framework discussions, and important organizational updates.

## Welcome & Introduction

Join us for an informative and engaging DQ Townhall meeting where we'll discuss important updates, share insights, and align on our organizational goals and practices.

## Working Room Guidelines

**Presenter: Sreya L.**

This session will cover essential guidelines for working rooms and collaborative spaces.

## Scrum Master Framework

**Presenter: Sreya L.**

An in-depth exploration of the Scrum Master framework and its implementation within DQ.`
  },
  {
    id: 'dq-leave-process-guideline',
    title: 'DQ Leave Process Guidelines',
    type: 'Guidelines',
    archived: true,
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt: 'Complete guide to the leave approval process, including required steps, notification procedures, and consequences for non-compliance.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    tags: ['leave', 'guidelines', 'policy', 'HRA'],
    readingTime: '5–10',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Leave Process Guideline

Complete guide to the leave approval process, including required steps, notification procedures, and consequences for non-compliance.

## Leave Process

### Step 1: Obtain Approval from HRA & Management
Obtain approval from HRA & Management, clearly indicating reason for leave, leave period, and associates covering critical tasks.`
  },
  {
    id: 'dq-storybook-live',
    title: 'From Vision to Impact: The DQ Storybook Goes Live!',
    type: 'Announcement',
    archived: true,
    date: '2024-08-14',
    author: 'Irene Musyoki',
    byline: 'DQ Communications',
    views: 75,
    excerpt: 'We are excited to announce that the DQ Story is now officially published on the DQ Competencies page.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    department: 'Products',
    location: 'Dubai',
    domain: 'Business',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'GHC',
    content: `# From Vision to Impact: The DQ Storybook Goes Live!

We are excited to announce that the DQ Story is now officially published on the DQ Competencies page.`
  },
  
  // BLOGS (for Blogs tab)
  {
    id: 'compute-nationalism-rise',
    title: 'Are We Watching the Rise of Compute Nationalism?',
    type: 'Thought Leadership',
    date: '2025-12-15',
    author: 'Dr. Stéphane Niango',
    byline: 'Dr. Stéphane Niango',
    views: 124,
    excerpt: 'As nations race to control AI infrastructure and computing resources, we explore how geopolitical tensions are reshaping the global technology landscape.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/rise-of-compute-nationalism',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    tags: ['Geopolitics & Technology'],
    content: `This blog explores the rise of compute nationalism, where countries are competing to control AI infrastructure and computing power as a strategic asset. It highlights how this shift is reshaping global power dynamics and what it means for businesses and the future of the AI economy.
What You'll Gain:
- Understand how compute is becoming a key global power resource
- Learn why nations are competing for AI infrastructure and dominance
- Gain insights into the geopolitical impact on technology and business
- Explore what this shift means for the future of AI and global innovation`,
    what: `This blog explores the growing concept of compute nationalism, where nations compete to control AI infrastructure and computing power. It highlights how this shift is redefining global power dynamics and shaping the future of technology and business.
Key Highlights:
- Rise of compute as a strategic global resource
- Nations competing for AI infrastructure dominance
- Shift from traditional resources to digital sovereignty
- Increasing geopolitical tension around AI capabilities
- Risks of centralized AI power and inequality
- Opportunities for emerging regions to become compute hubs`,
    how: `This blog helps associates understand how global shifts in AI and compute power can influence business strategy, innovation, and decision-making. It encourages a broader perspective on how technology trends shape opportunities and risks in the evolving digital landscape.
Key Impact:
- Builds awareness of global AI and technology trends
- Helps think more strategically about innovation and future readiness
- Encourages understanding of geopolitical impact on business
- Supports better decision-making in a rapidly evolving tech landscape
- Highlights opportunities in emerging areas like AI infrastructure and compute hubs`,
    when: `After reading this blog, you will gain a clearer understanding of how compute is becoming a critical global resource and why it matters for the future of AI, business, and innovation. It helps you think more strategically about the role of technology, competition, and global power in shaping opportunities and risks.
Key Points:
- Understand why compute is central to the future of AI and business
- Recognize how global competition impacts technology and innovation
- Learn the importance of AI infrastructure in strategic decision-making`,
  },
  {
    id: 'beijing-ai-superstate',
    title: "Is Beijing Building the World's First AI Superstate?",
    type: 'Thought Leadership',
    date: '2025-12-12',
    author: 'Dr. Stéphane Niango',
    byline: 'Dr. Stéphane Niango',
    views: 98,
    excerpt: 'While the U.S. pushes a loud "compute nationalism" agenda, China is quietly executing a parallel strategy.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/china-ai-superstate',
    readingTime: '5–10',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    tags: ['Geopolitics & Technology'],
    content: `This blog explores how China is quietly building massive AI infrastructure through a coordinated, state-driven approach. It highlights how this strategy could reshape global AI leadership and competitive dynamics.
What You'll Gain:
- Understand China's approach to AI infrastructure expansion
- Learn how coordination gives strategic advantage at scale
- Gain perspective on global AI competition dynamics
- Explore how infrastructure shapes future technological power`,
    what: `A quick overview of the key themes and developments discussed in this blog.
Key Highlights:
- Rapid expansion of AI compute capacity in China
- Control over end-to-end hardware supply chains
- Faster datacenter build cycles compared to the West
- Development of large-scale compute clusters with limited visibility`,
    how: `This blog helps you understand how different national strategies in AI can influence innovation, competition, and business environments globally.
Key Impact:
- Builds awareness of global AI infrastructure strategies
- Highlights importance of speed and coordination in execution
- Encourages thinking beyond models to infrastructure advantage
- Helps assess risks of uneven or hidden technological progress`,
    when: `After reading this blog, you gain a clearer understanding of how China's quiet and structured approach can become a major competitive advantage in the global AI race.
Key Points:
- AI leadership depends on infrastructure, not just innovation
- Execution speed is a critical competitive differentiator
- Supply chain control strengthens technological independence
- Quiet strategies can outperform visible competition
- The AI race is shifting toward compute and scale dominance`,
  },
  {
    id: 'europe-ethical-ai-compute',
    title: "Europe Wants Ethical AI. But Without Compute, Can It Compete?",
    type: 'Thought Leadership',
    date: '2025-12-10',
    author: 'Dr. Stéphane Niango',
    byline: 'Dr. Stéphane Niango',
    views: 89,
    excerpt: 'The European Union has positioned itself as the global moral compass on AI, but ethical leadership does not matter if you do not have compute leadership.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/europe-ai-compute-challenge',
    readingTime: '5–10',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    tags: ['Geopolitics & Technology'],
    content: `This blog examines Europe's strong focus on ethical AI and regulation, while highlighting its growing gap in compute infrastructure. It questions whether ethical leadership alone is enough to compete in the global AI race.
What You'll Gain:
- Understand Europe's position on ethical AI and regulation
- Learn why compute is critical for AI competitiveness
- Gain insight into Europe's current infrastructure challenges
- Explore the gap between policy leadership and execution capability`,
    what: `A quick overview of the key themes and arguments presented in this blog.
Key Highlights:
- Europe leads in AI ethics, regulation, and digital rights
- High energy costs limit datacenter scalability
- Regulatory processes slow down infrastructure development
- Lack of hyperscale tech giants creates compute dependency`,
    how: `This blog helps you understand how gaps in infrastructure can limit innovation, even when strong policies are in place. It highlights the importance of balancing regulation with execution.
Key Impact:
- Builds awareness of trade-offs between regulation and innovation
- Highlights importance of compute in driving AI leadership
- Encourages thinking about execution vs policy balance
- Supports strategic thinking on building sustainable AI ecosystems`,
    when: `After reading this blog, you will get a clearer understanding that ethical leadership alone is not enough — real influence in AI requires strong compute infrastructure and execution capability.
Key Points:
- Ethical leadership without compute leads to limited global influence
- AI competitiveness depends on infrastructure, energy, and scale
- Over-regulation can slow down innovation and adoption
- Sovereign compute is key to technological independence
- The future of AI belongs to those who can build, not just regulate`,
  },
  
  // PODCASTS (for Podcasts tab)
  {
    id: 'why-execution-beats-intelligence',
    title: 'Why Execution Beats Intelligence: The Real Driver of Growth in DQ',
    type: 'Thought Leadership',
    date: '2024-12-01',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Explore how execution and consistent action drive real growth at DQ, and why intelligence alone is not enough to achieve organizational success.',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Leadership',
    tags: ['podcast', 'execution', 'growth', 'leadership', 'strategy'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Execution_Beats_Intelligence__Why_Action_Wins.m4a',
    content: `# Why Execution Beats Intelligence: The Real Driver of Growth in DQ

Promoting execution over intelligence, stressing why getting things done is more powerful than just knowing the best approach.`
  },
  {
    id: 'why-we-misdiagnose-problems',
    title: 'Why We Misdiagnose Problems — And How to Stop It',
    type: 'Thought Leadership',
    date: '2024-12-02',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Learn why teams often misdiagnose problems and discover practical frameworks to identify root causes and implement effective solutions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Delivery',
    tags: ['podcast', 'problem-solving', 'diagnosis', 'root-cause', 'analysis'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Why We Misdiagnose Problems — And How to Stop It.m4a',
    content: `# Why We Misdiagnose Problems — And How to Stop It

Help us recognise when we're reacting to symptoms instead of diagnosing the real issue.`
  },
  {
    id: 'turning-conversations-into-action',
    title: 'Turning Every Conversation Into Action',
    type: 'Thought Leadership',
    date: '2024-12-03',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Discover how to transform meetings and discussions into concrete actions that drive progress and deliver results.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Delivery',
    tags: ['podcast', 'conversation', 'action', 'meetings', 'productivity'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Turning_Every_Conversation _Into _Action.m4a',
    content: `# Turning Every Conversation Into Action

Why conversations feel satisfying even when nothing moves.`
  },
  {
    id: 'happy-talkers-why-talking-feels-productive',
    title: 'Happy Talkers: Why Talking Feels Productive but Is Not',
    type: 'Thought Leadership',
    date: '2024-12-05',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Explore the phenomenon of "happy talking" and why excessive discussion can create an illusion of productivity without delivering real results.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Culture',
    tags: ['podcast', 'communication', 'productivity', 'meetings', 'culture'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Stop_Happy_Talk_and_Start_Executing.m4a',
    content: `# Happy Talkers: Why Talking Feels Productive but Isn't

Identifying and examining "happy talk," which feels energizing but is low consequence.`
  },
  {
    id: 'agile-the-dq-way-tasks-core-work-system',
    title: 'Agile the DQ Way: Why Tasks Are the Core of Our Work System',
    type: 'Thought Leadership',
    date: '2024-12-07',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Learn how DQ implements Agile principles with tasks as the fundamental unit of work, driving clarity and accountability.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Operations',
    theme: 'Delivery',
    tags: ['podcast', 'agile', 'tasks', 'work-system', 'methodology'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Agile_is_Task_Movement_Not_Ceremony.m4a',
    content: `# Agile the DQ Way: Why Tasks Are the Core of Our Work System

Establishing tasks as the fundamental "heartbeat" and smallest unit of value.`
  },
  // More ANNOUNCEMENTS
  {
    id: 'company-wide-lunch-break-schedule',
    title: 'DQ CHANGES | COMPANY-WIDE LUNCH BREAK SCHEDULE',
    type: 'Announcement',
    archived: true,
    date: '2025-11-13',
    author: 'Irene Musyoki',
    byline: 'Corporate Comms',
    views: 0,
    excerpt: 'Unified lunch break for all associates: 2:00 PM – 3:00 PM DXB Time. Please avoid meetings within this window (except emergencies).',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    location: 'Dubai',
    tags: ['policy', 'schedule', 'collaboration'],
    readingTime: '5–10',
    newsType: 'Policy Update',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
  },
  {
    id: 'grading-review-program-grp',
    title: 'DQ ADP | GRADING REVIEW PROGRAM (GRP)',
    type: 'Announcement',
    archived: true,
    date: '2025-11-13',
    author: 'Irene Musyoki',
    byline: 'Corporate Comms',
    views: 0,
    excerpt: 'Launch of the DQ Associate Grade Review Program to align associates to the SFIA-based grading scale.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    tags: ['SFIA', 'grading', 'capability'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
  },
  {
    id: 'dq-scrum-master-structure-update',
    title: 'DQ Changes: Updated Scrum Master Structure',
    type: 'Announcement',
    archived: true,
    date: '2025-11-27',
    author: 'Felicia Araba',
    views: 0,
    excerpt: 'Updated Scrum Master structure to better align with our delivery framework and enhance team effectiveness.',
    department: 'Operations',
    location: 'Remote',
    domain: 'Operations',
    theme: 'Delivery',
    tags: ['Scrum Master', 'Organizational Structure', 'Leadership'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
  },
  {
    id: 'dq-storybook-latest-links',
    title: 'DQ Storybook — Latest Version and Links',
    type: 'Announcement',
    archived: true,
    date: '2025-11-13',
    author: 'Irene Musyoki',
    views: 0,
    excerpt: 'Explore the latest DQ Storybook and quick links to GHC elements including Vision, HoV, Persona, Agile TMS/SoS/Flows, and 6xD.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    domain: 'Business',
    tags: ['story', 'GHC', 'references'],
    readingTime: '5–10',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'GHC',
  },
  {
    id: 'riyadh-horizon-hub',
    title: 'Riyadh Horizon Hub Opens for Cross-Studio Delivery',
    type: 'Announcement',
    archived: true,
    date: '2024-07-20',
    author: 'Irene Musyoki',
    views: 61,
    excerpt: 'The new Riyadh Horizon Hub is live—bringing Delivery, Platform, and People teams together to accelerate Saudi programs.',
    department: 'Delivery — Deploys',
    location: 'Riyadh',
    domain: 'Business',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
  },
  {
    id: 'dq-website-launch',
    title: 'DQ Corporate Website Launch!',
    type: 'Announcement',
    archived: true,
    date: '2024-06-24',
    author: 'Irene Musyoki',
    views: 84,
    excerpt: 'Our new DQ corporate website is live—packed with what makes DQ a leader in digital delivery…',
    department: 'Products',
    location: 'Remote',
    domain: 'Technology',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'DWS',
  },
  
  // GUIDELINES
  {
    id: 'dq-wfh-guidelines',
    title: 'DQ WFH Guidelines',
    type: 'Guidelines',
    archived: true,
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt: 'Work From Home (WFH) guidelines outlining purpose, roles, processes, tools, KPIs, and compliance for remote work across DQ.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80',
    department: 'HRA (People)',
    location: 'Remote',
    domain: 'People',
    tags: ['WFH', 'guidelines', 'policy'],
    readingTime: '10–20',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
  },
  {
    id: 'dq-dress-code-guideline',
    title: 'DQ Dress Code Guidelines',
    type: 'Guidelines',
    archived: true,
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt: 'Dress code guideline balancing professionalism and comfort across the work week.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    tags: ['dress code', 'guidelines', 'policy'],
    readingTime: '10–20',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
  },
  {
    id: 'shifts-allocation-guidelines',
    title: 'Shifts Allocation Guidelines',
    type: 'Guidelines',
    archived: true,
    date: '2024-07-25',
    author: 'Felicia Araba',
    views: 58,
    excerpt: 'New guidelines to enhance fairness and transparency for shifts allocation across teams…',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    department: 'DCO Operations',
    location: 'Dubai',
    domain: 'People',
    tags: ['shifts', 'allocation', 'scheduling', 'guidelines'],
    readingTime: '5–10',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'DWS',
  },
  {
    id: 'po-dev-sync-guidelines',
    title: 'Product Owner & Dev Sync Guidelines',
    type: 'Guidelines',
    archived: true,
    date: '2024-06-19',
    author: 'Felicia Araba',
    views: 70,
    excerpt: 'Standardizing PO–Dev syncs for clarity, cadence, and decision-making across products…',
    department: 'DBP Delivery',
    location: 'Dubai',
    domain: 'Operations',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'DWS',
  },
  {
    id: 'azure-devops-task-guidelines',
    title: 'Azure DevOps Task Guidelines',
    type: 'Guidelines',
    archived: true,
    date: '2024-06-12',
    author: 'Felicia Araba',
    views: 77,
    excerpt: 'New task guidelines for ADO: naming, states, and flow so teams ship with less friction…',
    department: 'SecDevOps',
    location: 'Remote',
    domain: 'Technology',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'DWS',
  },
  
  // NOTICES
  {
    id: 'islamic-new-year',
    title: 'Honoring the Islamic New Year',
    type: 'Notice',
    archived: true,
    date: '2024-06-27',
    author: 'DQ Communications',
    views: 63,
    excerpt: 'A reflection on Al-Hijra 1447 AH—renewal, gratitude, and the values that ground our community…',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    newsType: 'Holidays',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
  },
  {
    id: 'eid-al-adha',
    title: 'Blessed Eid al-Adha!',
    type: 'Notice',
    archived: true,
    date: '2024-06-05',
    author: 'DQ Communications',
    views: 47,
    excerpt: 'Warmest wishes to all observing Eid al-Adha—celebrating community and gratitude…',
    department: 'HRA (People)',
    location: 'Nairobi',
    domain: 'People',
    newsType: 'Holidays',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
  },
  
  // MORE BLOGS
  {
    id: 'ai-without-compute-global-south',
    title: 'AI Without Compute: Is the Global South Being Left Out of the New Digital Economy?',
    type: 'Thought Leadership',
    date: '2025-12-08',
    author: 'Dr. Stéphane Niango',
    byline: 'Dr. Stéphane Niango',
    views: 203,
    excerpt: 'There is a growing fear across Africa, Southeast Asia, and parts of Latin America: Is the AI revolution about to leave the Global South behind?',
    image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/global-south-ai-compute-divide',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    tags: ['Geopolitics & Technology'],
    content: `This blog explores how limited access to compute is creating a new digital divide, potentially leaving the Global South behind in the AI revolution. It highlights both the risks of dependency and the opportunities to build regional AI ecosystems.
What You'll Gain:
- Understand how compute access shapes the global AI landscape
- Learn why the Global South risks being left out of AI innovation
- Gain insight into the emerging digital divide in AI
- Explore opportunities for building regional compute ecosystems`,
    what: `A quick overview of the key themes and realities discussed in this blog.
Key Highlights:
- AI development is becoming compute-gated and capital intensive
- A growing divide between compute-rich and compute-poor nations
- High costs limit access to training and infrastructure
- Dependence on foreign clouds increases digital reliance
- Global South has advantages like renewable energy and lower costs
- Emerging regions are positioning as future compute hubs`,
    how: `This blog helps you understand how unequal access to technology infrastructure can influence global innovation, economic growth, and digital independence.
Key Impact:
- Builds awareness of the new digital divide in AI
- Highlights risks of technological and economic dependency
- Encourages thinking about inclusive innovation and access
- Supports understanding of global inequality in tech ecosystems
- Promotes strategic thinking on building local capabilities`,
    when: `After reading this blog, you gain a clearer understanding that access to compute is critical for participation in the AI economy, and that regions without it risk long-term dependency unless they act now.
Key Points:
- Compute access determines who innovates and who consumes
- Lack of infrastructure can lead to long-term digital dependency
- Renewable energy and cost advantages offer unique opportunities
- Building local compute is key to sovereignty and growth
- The future of AI depends on inclusive access to infrastructure`,
  },
  {
    id: 'nations-weaponize-attention',
    title: 'How Nations Weaponize Attention Before Missiles',
    type: 'Thought Leadership',
    date: '2025-12-03',
    author: 'Kaylynn Océanne',
    byline: 'Kaylynn Océanne',
    views: 145,
    excerpt: 'When influence campaigns, coordinated misinformation, and AI-generated narratives shape public sentiment and global alliances before any physical conflict begins.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/nations-weaponize-attention-before-missiles',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    tags: ['Digital Warfare'],
    content: `This blog explores how modern geopolitics is shifting from physical conflict to digital influence, where attention, narratives, and public sentiment are shaped long before any real-world action occurs.
What You'll Gain:
- Understand how attention has become a strategic geopolitical asset
- Learn how narratives shape public perception and global decisions
- Gain insight into the role of digital platforms in modern conflict
- Explore how AI is transforming influence and misinformation at scale`,
    what: `A quick overview of the key ideas and mechanisms discussed in this blog.
Key Highlights:
- Shift from traditional warfare to attention-driven influence battles
- Rise of coordinated misinformation and narrative campaigns
- Emotional content spreading faster than verified information
- AI enabling scalable, realistic, and rapid propaganda`,
    how: `This blog helps you understand how digital influence and attention manipulation affect global stability, decision-making, and the way information shapes reality.
Key Impact:
- Builds awareness of digital influence on public perception
- Highlights risks of misinformation and trust erosion
- Encourages critical thinking in high-noise digital environments
- Promotes awareness of cognitive resilience as a key capability`,
    when: `After reading this blog, you will gain a deeper understanding that control over attention and narratives is becoming as powerful as traditional military or economic strength.
Key Points:
- Attention is now a primary battlefield in modern geopolitics
- Narratives can shape outcomes before physical conflict begins
- Misinformation spreads faster than truth in digital ecosystems
- Critical thinking and awareness are essential to navigate digital influence`,
  },
  {
    id: 'half-attention-worker',
    title: 'The Rise of the Half-Attention Worker',
    type: 'Thought Leadership',
    date: '2025-12-05',
    author: 'Kaylynn Océanne',
    byline: 'Kaylynn Océanne',
    views: 167,
    excerpt: 'Why digital environments hardwire workers into split-attention behaviors that harm quality, and how Digital Cognitive Organizations can reclaim the conditions for full attention.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/rise-of-half-attention-worker',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    tags: ['Digital Worker'],
    content: `This blog explores how modern digital work environments are creating "half-attention" behaviors, reducing focus, quality, and wellbeing. It highlights how organizations and individuals can reclaim deep focus through better systems and habits.
What You'll Gain:
- Understand how digital environments impact focus and attention
- Learn why multitasking leads to reduced quality and clarity
- Gain insight into the cognitive cost of constant interruptions
- Explore ways to restore deep work and meaningful productivity`,
    what: `A quick overview of the key themes and ideas discussed in this blog.
Key Highlights:
- Rise of the "Half-Attention Worker" in digital workplaces
- Constant notifications causing context switching and fragmentation
- Multitasking is an illusion of productivity
- Digital culture prioritizes speed over depth`,
    how: `This blog helps you understand how attention directly impacts performance, decision-making, and wellbeing, and why organizations must redesign work environments to support focus.
Key Impact:
- Builds awareness of attention as a critical productivity asset
- Highlights risks of burnout, fatigue, and mental overload
- Encourages shift from reactive work to intentional execution
- Promotes healthier and more sustainable work practices`,
    when: `After reading this blog, you gain a clear understanding that focus is a competitive advantage, and both individuals and organizations must actively protect and design for it.
Key Points:
- Multitasking reduces effectiveness and cognitive performance
- Deep work enables better thinking and higher-quality outcomes
- Attention must be intentionally protected and managed
- Systems and environments shape how people work and think
- The future of work belongs to those who prioritize focus over noise`,
  },
  {
    id: 'architecture-addiction',
    title: 'The Architecture of Addiction: How Interface Design Creates Digital Habits',
    type: 'Thought Leadership',
    date: '2025-12-01',
    author: 'Kaylynn Océanne',
    byline: 'Kaylynn Océanne',
    views: 198,
    excerpt: 'Small triggers, frictionless actions, and micro-gratifications engineered into UI patterns — and why they matter in the Digital Cognitive era.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    externalUrl: 'https://corp-web.qatalyst.tech/blog/architecture-of-addiction-interface-design',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    tags: ['Social Media & Behavioral Design'],
    content: `This blog explores how modern digital interfaces are intentionally designed to capture attention and build addictive habits. It highlights how UI patterns shape behavior and why rethinking design is critical in the Digital Cognitive era.
What You'll Gain:
- Understand how interface design influences user behavior and habits
- Learn how platforms engineer engagement and attention loops
- Gain insight into the attention economy and its impact
- Explore ways to build a healthier relationship with technology`,
    how: `This blog helps you understand how digital design affects focus, behavior, and wellbeing, and why conscious interaction with technology is essential.
Key Impact:
- Builds awareness of how design shapes daily behavior
- Highlights risks of addiction, distraction, and cognitive overload
- Encourages more intentional and mindful technology use
- Promotes understanding of human-centered design principles`,
    when: `After reading this blog, you will gain a clear understanding that attention is being actively shaped by design, and reclaiming control requires both better systems and conscious user behavior.
Key Points:
- Digital habits are often engineered, not accidental
- Attention is the core currency of the digital economy
- Small design and behavior changes can restore user control
- The future of tech depends on designing for human wellbeing`,
    what: `A quick overview of the key concepts and mechanisms discussed in this blog.
Key Highlights:
- Platforms operate as attention-driven economic systems
- UI patterns like infinite scroll and autoplay remove friction
- Variable rewards reinforce compulsive engagement
- Shift needed from attention extraction to attention protection`,
  },
  
  // MORE PODCASTS
  {
    id: 'why-tasks-dont-close-at-dq',
    title: 'Why Tasks Don\'t Close at DQ — And How to Fix It',
    type: 'Thought Leadership',
    date: '2024-12-04',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'An in-depth analysis of why tasks remain open and practical solutions to improve task completion rates across DQ teams.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Operations',
    theme: 'Delivery',
    tags: ['podcast', 'tasks', 'productivity', 'project-management', 'execution'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Why_Smart_Teams_Fail_To_Finish.m4a',
  },
  {
    id: 'execution-styles-why-teams-work-differently',
    title: 'Execution Styles: Why Teams Work Differently and How to Align Them',
    type: 'Thought Leadership',
    date: '2024-12-06',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Understand different execution styles across teams and learn how to align diverse approaches for maximum effectiveness.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'People',
    theme: 'Leadership',
    tags: ['podcast', 'execution', 'teams', 'collaboration', 'alignment'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Stop_Judging_Intent_Coordinate_Work_Styles.m4a',
  },
  {
    id: 'leaders-as-multipliers-accelerate-execution',
    title: 'Leaders as Multipliers: How to Accelerate Team Execution',
    type: 'Thought Leadership',
    date: '2024-12-08',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Discover how leaders can act as multipliers, accelerating team execution and amplifying results through effective leadership practices.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'People',
    theme: 'Leadership',
    tags: ['podcast', 'leadership', 'multipliers', 'execution', 'team-performance'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Execution_Beats_Intelligence__Why_Action_Wins (1).m4a',
  },
  {
    id: 'energy-management-for-high-action-days',
    title: 'How to Manage Your Energy for High-Action Days',
    type: 'Thought Leadership',
    date: '2024-12-19',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Learn how managing usable mental, emotional, and physical energy creates sustainable high-action days and reduces invisible stress.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'People',
    theme: 'Leadership',
    tags: ['podcast', 'energy', 'performance', 'productivity', 'stress'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/Stop_Clock_Watching_Start_Managing_Energy.m4a',
  },
  {
    id: 'execution-metrics-that-drive-movement',
    title: 'Execution Metrics: How to Measure the Only Things That Matter',
    type: 'Thought Leadership',
    date: '2024-12-20',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Explore how to replace vanity metrics with execution metrics like Task Closure Rate, Time to First Action, and Blocker Age to drive real movement.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Leadership',
    domain: 'Operations',
    theme: 'Delivery',
    tags: ['podcast', 'metrics', 'execution', 'performance', 'blockers'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/Podcasts/The_Four_Metrics_That_Drive_Execution_Speed.m4a',
  },
  {
    id: 'ownership-mindset-single-driver',
    title: 'Ownership Mindset: Why Every Task Needs a Single Driver',
    type: 'Thought Leadership',
    date: '2025-01-10',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Explore why every task needs a single, clearly named owner and how ownership mindset accelerates execution across teams.',
    department: 'DQ Leadership',
    domain: 'People',
    theme: 'Leadership',
    tags: ['podcast', 'execution mindset', 'ownership', 'series-2'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Ep 1_Ownership Mindset - Why Every Task Needs a Single Driver.m4a',
  },
  {
    id: 'psychology-of-follow-through',
    title: 'The Psychology of Follow-through: How to Finish What You Start',
    type: 'Thought Leadership',
    date: '2025-01-11',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Understand the mental barriers that stop us from finishing and learn simple tools to close the loop on commitments.',
    department: 'DQ Leadership',
    domain: 'People',
    theme: 'Leadership',
    tags: ['podcast', 'execution mindset', 'follow-through', 'series-2'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Ep 2_The Psychology of Follow-through - How to Finish What You Start.m4a',
  },
  {
    id: 'dont-mistake-motion-for-progress',
    title: 'Don\'t Mistake Motion for Progress',
    type: 'Thought Leadership',
    date: '2025-01-12',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Learn to separate activity from real movement so you can stop spinning and start advancing meaningful work.',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Delivery',
    tags: ['podcast', 'execution mindset', 'focus', 'series-2'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Don_t_Mistake_Motion_For_Progress (2).m4a',
  },
  {
    id: 'cutting-the-noise-focus-habits',
    title: 'Cutting the Noise: Focus Habits for Digital Workers',
    type: 'Thought Leadership',
    date: '2025-01-13',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Practical focus habits for digital workers who are overwhelmed by pings, channels, and constant micro-requests.',
    department: 'DQ Leadership',
    domain: 'People',
    theme: 'Delivery',
    tags: ['podcast', 'execution mindset', 'focus', 'digital workers', 'series-2'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Ep 8_Cutting the Noise - Focus Habits for Digital Workers.m4a',
  },
  {
    id: 'build-high-velocity-team-culture',
    title: 'How to Build a High-Velocity Team Culture',
    type: 'Thought Leadership',
    date: '2025-01-14',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Explore the cultural rules and rituals that separate high-velocity teams from well-intentioned but slow ones.',
    department: 'DQ Leadership',
    domain: 'Operations',
    theme: 'Leadership',
    tags: ['podcast', 'execution mindset', 'team culture', 'series-2'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Ep 9_How to Build a High-Velocity Team Culture.m4a',
  },
  {
    id: 'micro-actions-beat-big-plans',
    title: 'Micro Actions Beat Big Plans',
    type: 'Thought Leadership',
    date: '2025-01-15',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Why tiny, well-chosen moves out-perform grand plans that never quite get off the ground.',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Delivery',
    tags: ['podcast', 'execution mindset', 'micro actions', 'series-2'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Micro_Actions_Beat_Big_Plans (1).m4a',
  },
  {
    id: 'micro-actions-convert-intention-into-traction',
    title: 'Micro-Actions: Converting Intention into Traction',
    type: 'Thought Leadership',
    date: '2025-01-16',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'A practical walkthrough of how to turn vague intentions into small, trackable movements that compound.',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Delivery',
    tags: ['podcast', 'execution mindset', 'traction', 'series-2'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Micro-Actions_Convert_Intention_Into_Traction.m4a',
  },
  {
    id: 'stop-discussion-start-action-clarity',
    title: 'Stop Discussion, Start Action Through Clarity',
    type: 'Thought Leadership',
    date: '2025-01-17',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    excerpt: 'Why unclear ownership, fuzzy outcomes, and vague next steps keep teams in discussion loops instead of decisive action.',
    department: 'DQ Leadership',
    domain: 'Business',
    theme: 'Leadership',
    tags: ['podcast', 'execution mindset', 'clarity', 'series-2'],
    readingTime: '20+',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    format: 'Podcast',
    source: 'DigitalQatalyst',
    audioUrl: '/02. Series 02 - The Execution Mindset/Stop_Discussion_Start_Action_Through_Clarity.m4a',
  },
]


// Fallback mock jobs data when database is unavailable
const MOCK_JOBS: JobItem[] = [
  {
    id: 'mock-job-1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    roleType: 'Tech',
    location: 'Remote',
    type: 'Full-time',
    seniority: 'Senior',
    sfiaLevel: 'L5',
    summary: 'Join our engineering team to build scalable solutions for enterprise clients.',
    description: 'We are looking for an experienced Full Stack Developer to join our growing team and work on cutting-edge projects.',
    responsibilities: ['Build scalable web applications', 'Collaborate with cross-functional teams', 'Mentor junior developers'],
    requirements: ['5+ years experience', 'React & Node.js expertise', 'Strong problem-solving skills'],
    benefits: ['Competitive salary', 'Remote work', 'Professional development'],
    postedOn: '2026-02-19',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mock-job-2',
    title: 'Product Manager',
    department: 'Product',
    roleType: 'Ops',
    location: 'Dubai',
    type: 'Full-time',
    seniority: 'Mid',
    sfiaLevel: 'L4',
    summary: 'Lead product strategy and execution for our digital transformation initiatives.',
    description: 'Drive product vision and roadmap for enterprise solutions that impact thousands of users.',
    responsibilities: ['Define product strategy', 'Work with stakeholders', 'Analyze metrics'],
    requirements: ['3+ years PM experience', 'Agile methodology', 'Strong communication'],
    benefits: ['Growth opportunities', 'Flexible schedule', 'Health benefits'],
    postedOn: '2026-02-18',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
  },
]

// Map a raw Supabase news row into a NewsItem used by the UI
function mapNewsRowToItem(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    date: row.date,
    author: row.author,
    byline: row.byline ?? undefined,
    views: row.views ?? 0,
    excerpt: row.excerpt,
    image: row.image ?? undefined,
    department: row.department ?? undefined,
    location: row.location ?? undefined,
    domain: row.domain ?? undefined,
    theme: row.theme ?? undefined,
    tags: row.tags ?? undefined,
    readingTime: row.reading_time ?? undefined,
    newsType: row.news_type ?? undefined,
    newsSource: row.news_source ?? undefined,
    focusArea: row.focus_area ?? undefined,
    content: row.content ?? undefined,
    format: row.format ?? undefined,
    source: row.source ?? undefined,
    audioUrl: row.audio_url ?? undefined,
  }
}

/**
 * Fetch all news items from Supabase
 * Returns news sorted by date (newest first)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  const { data, error } = await (supabase as any)
    .from('news_blogs')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchAllNews] Supabase error:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
      error,
    })
    // Return mock data instead of throwing error
    return MOCK_NEWS
  }

  const rows = (data ?? []) as any[]

  // eslint-disable-next-line no-console
  console.log('[fetchAllNews] news_blogs raw data:', rows)

  // If no data from database, return mock data
  if (rows.length === 0) {
    return MOCK_NEWS
  }

  return rows
    .filter(row => !EXCLUDED_NEWS_IDS.includes(row.id))
    .map(mapNewsRowToItem)
}

// Map a raw Supabase jobs row into a JobItem used by the UI
function mapJobRowToItem(row: any): JobItem {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    roleType: row.role_type,
    location: row.location,
    type: row.type,
    seniority: row.seniority,
    sfiaLevel: row.sfia_level,
    summary: row.summary,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
    postedOn: row.posted_on,
    applyUrl: row.apply_url ?? undefined,
    image: row.image ?? undefined,
  }
}

/**
 * Fetch all job items from Supabase
 * Returns jobs sorted by posted date (newest first)
 */
export async function fetchAllJobs(): Promise<JobItem[]> {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .order('posted_on', { ascending: false })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchAllJobs] Supabase error:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
      error,
    })
    // Return mock data instead of throwing error
    return MOCK_JOBS
  }

  const rows = (data ?? []) as any[]
  
  // If no data from database, return mock data
  if (rows.length === 0) {
    return MOCK_JOBS
  }
  
  return rows.map(mapJobRowToItem)
}

/**
 * Fetch a single news item by ID from Supabase
 */
export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  // Check MOCK_NEWS first — it has the latest structured content for blogs
  const mockItem = MOCK_NEWS.find(item => item.id === id)
  if (mockItem) return mockItem

  const { data, error } = await (supabase as any)
    .from('news_blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchNewsById] Supabase error:', error)
    return null
  }

  if (!data) return null

  return mapNewsRowToItem(data as any)
}

/**
 * Increment the listen count for a podcast episode
 */
export async function incrementListenCount(episodeId: string): Promise<void> {
  try {
    // First get current views count
    const { data: currentData, error: fetchError } = await (supabase as any)
      .from('news_blogs')
      .select('views')
      .eq('id', episodeId)
      .single();

    if (fetchError) {
      console.error('[incrementListenCount] Fetch error:', fetchError);
      throw fetchError;
    }

    // Increment the views count
    const currentViews = currentData?.views || 0;
    const { error: updateError } = await (supabase as any)
      .from('news_blogs')
      .update({ views: currentViews + 1 })
      .eq('id', episodeId);

    if (updateError) {
      console.error('[incrementListenCount] Update error:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('[incrementListenCount] Error:', error);
    throw error;
  }
}

/**
 * Fetch a single job item by ID from Supabase
 */
export async function fetchJobById(id: string): Promise<JobItem | null> {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchJobById] Supabase error:', error)
    return null
  }

  if (!data) return null
  return mapJobRowToItem(data as any)
}
