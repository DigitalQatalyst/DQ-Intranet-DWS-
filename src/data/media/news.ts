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
  content?: string; // Full article content for detail pages
};

export const NEWS: NewsItem[] = [
  /*
  {
    id: 'dq-townhall-meeting-agenda',
    title: 'DQ Townhall Meeting Agenda',
    type: 'Announcement',
    date: '2025-11-21',
    author: 'Irene Musyoki',
    byline: 'DQ Operations',
    views: 0,
    excerpt:
      'Join us for the upcoming DQ Townhall meeting featuring working room guidelines, Scrum Master framework discussions, and important organizational updates.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Operations',
    location: 'Dubai',
    domain: 'Operations',
    tags: ['townhall', 'meeting', 'agenda', 'framework'],
    readingTime: '5–10',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Townhall Meeting Agenda

## Welcome & Introduction

Join us for an informative and engaging DQ Townhall meeting where we'll discuss important updates, share insights, and align on our organizational goals and practices.

## Working Room Guidelines

**Presenter: Sreya L.**

This session will cover essential guidelines for working rooms and collaborative spaces. Topics include:
- Best practices for room usage and booking
- Maintenance and cleanliness standards
- Collaboration etiquette and respect for shared spaces
- Optimizing workspace utilization for maximum productivity

## Scrum Master Framework

**Presenter: Sreya L.**

An in-depth exploration of the Scrum Master framework and its implementation within DQ:
- Core principles and values of Scrum
- Roles and responsibilities within the framework
- Sprint planning and execution best practices
- Continuous improvement and retrospective processes
- How Scrum enhances team collaboration and delivery

## Meeting Objectives

This townhall aims to:
- Align all associates on working room protocols
- Deepen understanding of Agile and Scrum methodologies
- Foster a culture of collaboration and continuous improvement
- Provide a platform for questions and discussion

## Important Notes

- Please arrive on time to ensure we can cover all agenda items
- Questions and discussions are encouraged during designated Q&A segments
- Meeting materials and recordings will be shared following the session`
  },
  {
    id: 'dq-leave-process-guideline',
    title: 'DQ Leave Process Guidelines',
    type: 'Guidelines',
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt:
      'Complete guide to the leave approval process, including required steps, notification procedures, and consequences for non-compliance.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    tags: ['leave', 'guidelines', 'policy', 'HRA'],
    readingTime: '5–10',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Leave Process Guideline

## Leave Process

### Step 1: Obtain Approval from HRA & Management
Obtain approval from HRA & Management, clearly indicating:
- **Reason for leave**: Specify the purpose of your leave
- **Leave period**: Include start and end dates
- **Associates covering critical tasks**: Identify who will cover your responsibilities during your absence

### Step 2: Submit an Approval Request
Log into the system and submit your leave request through the designated platform.

### Step 3: Notify via the HR Channel
Share a brief notification in the designated HR channel to inform relevant parties of your leave request.

### Step 4: Confirm Approval Status
**Important**: Wait for confirmation that your leave has been approved before proceeding with any leave arrangements.

### Step 5: Notify via the Leaves Channel
Once approved, post an update in the Leaves channel for broader visibility across the organization.

## Leave Non-Compliance Consequences

### Recorded Violation
Any leave taken without prior approval or proper handover is documented as a violation.

### Warnings System
- **First instance**: Formal warning issued
- **Second instance**: Formal warning issued
- **Third instance**: Final warning and escalation to HR & Management

### Termination
Three violations may result in termination of employment.

## Important Reminder
**Approval Requirement**: All leave must be approved by HRA and Management to ensure fairness and compliance with company policies.`
  },
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
    focusArea: 'Culture & People',
    content: `# Leadership Principles | What's Your Leadership Superpower?

## The Research Behind Leadership Excellence

Researchers have identified more than **1,000 leadership traits**, but only a handful consistently drive real impact. This deep dive explores the core leadership principles that separate high-performing teams from the rest.

## The Five Core Leadership Superpowers

### 1. Visionary Thinking
- **What it is**: The ability to see beyond current constraints and articulate a compelling future
- **Why it matters**: Teams need direction and purpose to perform at their best
- **How to develop**: Practice scenario planning, engage in strategic conversations, and regularly communicate the "why" behind decisions

### 2. Adaptive Resilience
- **What it is**: Maintaining effectiveness while navigating uncertainty and change
- **Why it matters**: Modern organizations face constant disruption and complexity
- **How to develop**: Embrace experimentation, learn from failures quickly, and build systems that can evolve

### 3. Empathetic Intelligence
- **What it is**: Understanding and responding to the emotional and motivational needs of your team
- **Why it matters**: People perform best when they feel understood and valued
- **How to develop**: Practice active listening, seek to understand before being understood, and invest in one-on-one relationships

### 4. Decision Velocity
- **What it is**: Making quality decisions quickly with incomplete information
- **Why it matters**: Speed of decision-making often determines competitive advantage
- **How to develop**: Establish decision frameworks, delegate appropriately, and accept that perfect information rarely exists

### 5. Growth Catalyst
- **What it is**: Actively developing others and creating opportunities for team growth
- **Why it matters**: Sustainable success requires building capability in others
- **How to develop**: Mentor regularly, provide stretch assignments, and celebrate learning over perfection

## The DQ Leadership Framework

At DQ, we've integrated these superpowers into our **Everyday Journey Playbook (EJP)**:

### **Morning Rituals**
- **Vision Check**: Start each day by connecting work to larger purpose
- **Team Pulse**: Quick emotional intelligence check-in with your squad
- **Priority Clarity**: Use decision velocity to focus on what matters most

### **Throughout the Day**
- **Adaptive Responses**: When plans change, model resilience and help others navigate
- **Growth Moments**: Look for opportunities to coach and develop team members
- **Empathetic Leadership**: Practice understanding before directing

### **Evening Reflection**
- **Impact Assessment**: What leadership superpower did you use most today?
- **Growth Planning**: How can you develop your weaker superpowers tomorrow?
- **Team Development**: What growth opportunities can you create for others?

## Measuring Leadership Impact

### **Individual Metrics**
- **Decision Speed**: Time from problem identification to resolution
- **Team Engagement**: Regular pulse surveys and feedback sessions
- **Growth Outcomes**: Number of team members promoted or developed

### **Team Metrics**
- **Delivery Velocity**: Consistent improvement in team output quality and speed
- **Innovation Rate**: Number of new ideas generated and implemented
- **Retention**: Team members choosing to stay and grow with the organization

## Your Leadership Development Plan

### **Week 1-2: Assessment**
1. Take the DQ Leadership Superpower Assessment
2. Gather 360-degree feedback from peers and team members
3. Identify your strongest and weakest superpowers

### **Week 3-4: Focus Area Selection**
1. Choose one superpower to develop intensively
2. Create specific, measurable development goals
3. Find an accountability partner or mentor

### **Month 2-3: Practice and Application**
1. Apply your chosen superpower daily
2. Track progress and gather feedback
3. Adjust approach based on results

### **Month 4+: Integration and Expansion**
1. Integrate the developed superpower into your natural leadership style
2. Begin developing the next superpower
3. Start mentoring others in leadership development

## Resources for Continued Growth

### **DQ Internal Resources**
- **Leadership Guild**: Monthly sessions with senior leaders
- **EJP Toolkit**: Practical exercises and frameworks
- **Mentorship Program**: Pairing with experienced leaders

### **External Learning**
- **Recommended Reading**: Curated list of leadership books and articles
- **Conference Attendance**: Support for relevant leadership conferences
- **Executive Coaching**: Access to professional development coaching

## The Ripple Effect

Remember: **Leadership is not about being perfect—it's about being intentional**. Every interaction is an opportunity to model the behaviors you want to see in your team and organization.

When you develop your leadership superpowers, you don't just improve your own effectiveness—you create a ripple effect that elevates everyone around you.

---

*What's your leadership superpower? Take the assessment and start your development journey today.*`
  },
  {
    id: 'dq-storybook-live',
    title: 'From Vision to Impact: The DQ Storybook Goes Live!',
    type: 'Announcement',
    date: '2024-08-14',
    author: 'Irene Musyoki',
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
    author: 'Irene Musyoki',
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
    author: 'Felicia Araba',
    views: 58,
    excerpt: 'New guidelines to enhance fairness and transparency for shifts allocation across teams…',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    department: 'DCO Operations',
    location: 'Dubai',
    domain: 'People',
    tags: ['shifts', 'allocation', 'scheduling', 'guidelines'],
    readingTime: '5–10',
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
    author: 'Irene Musyoki',
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
    author: 'Felicia Araba',
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
    author: 'Felicia Araba',
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
  ,
  {
    id: 'company-wide-lunch-break-schedule',
    title: 'DQ CHANGES | COMPANY-WIDE LUNCH BREAK SCHEDULE',
    type: 'Announcement',
    date: '2025-11-13',
    author: 'Irene Musyoki',
    byline: 'Corporate Comms',
    views: 0,
    excerpt:
      'Unified lunch break for all associates: 2:00 PM – 3:00 PM DXB Time. Please avoid meetings within this window (except emergencies).',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    location: 'Dubai',
    tags: ['policy', 'schedule', 'collaboration'],
    readingTime: '5–10',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
    content: `# Enhancing Collaboration Through Unified Scheduling

## Overview
To enhance collaboration and synchronize workflows across all studios, we are implementing a unified company-wide lunch break schedule.

## New Schedule Details
**Effective immediately**, the designated lunch break for all associates will be:
- **Time**: 2:00 PM – 3:00 PM Dubai (DXB) Time
- **Applies to**: All associates across all locations
- **Goal**: Create a common window for breaks, ensuring seamless collaboration

## Implementation Guidelines

### For All Associates
- Plan to take your lunch during this designated hour
- Ensure you are back online and available from 3:00 PM DXB Time
- Use this time to recharge and connect with colleagues

### For Meeting Organizers
- **Avoid scheduling meetings** during the 2:00 PM - 3:00 PM DXB Time block
- **Exception**: Critical emergency meetings that cannot be scheduled at any other time
- Consider time zone differences when planning cross-regional meetings

## Benefits of This Initiative
- **Improved Collaboration**: Synchronized break times across all teams
- **Better Work-Life Balance**: Dedicated time for proper meal breaks
- **Enhanced Productivity**: Refreshed teams returning to work together
- **Stronger Team Bonds**: Opportunities for informal interactions

## Questions?
For any questions or concerns about this new policy, please reach out to your local HR representative or contact DQ Communications directly.

Thank you for your cooperation in helping us build a more synchronized and efficient work environment.`
  },
  {
    id: 'grading-review-program-grp',
    title: 'DQ ADP | GRADING REVIEW PROGRAM (GRP)',
    type: 'Announcement',
    date: '2025-11-13',
    author: 'Irene Musyoki',
    byline: 'Corporate Comms',
    views: 0,
    excerpt:
      'Launch of the DQ Associate Grade Review Program to align associates to the SFIA-based grading scale; initial focus group led by Araba and Mercy Kyuma.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    tags: ['SFIA', 'grading', 'capability'],
    readingTime: '10–20',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
    content: `# DQ Associate Grade Review Program Launch

## Program Overview
We are pleased to announce the launch of the **DQ Associate Grade Review Program (GRP)**. This comprehensive initiative aims to ensure all associates are aligned to the DQ SFIA-based grading scale, reflecting both their competence levels and scope of responsibility.

## Leadership Team
The review will be led by:
- **Araba** - Program Lead
- **Mercy Kyuma** - Co-Lead & Assessment Coordinator

## Implementation Phases

### Phase 1: Initial Focus Group
- **Participants**: Approximately 10 selected associates
- **Duration**: 2-3 weeks
- **Purpose**: Pilot testing and process refinement
- **Communication**: Direct contact with selected participants

### Phase 2: Organization-wide Rollout
- **Scope**: All DQ associates across all locations
- **Timeline**: Following successful completion of Phase 1
- **Communication**: Comprehensive updates through this channel

## Review Process Types

### Level Confirmation
- Validation of current grading alignment
- Assessment of role responsibilities vs. current grade
- Documentation of competency evidence

### Upgrade Opportunities
- Identification of associates ready for advancement
- Skills gap analysis and development planning
- Clear pathway definition for progression

### Development-Focused Adjustments
- **Rare cases**: Temporary grade adjustments for enhanced learning
- **Purpose**: Accelerated skill development and organizational growth
- **Support**: Additional mentoring and development resources

## SFIA Framework Integration
Our grading system is built on the **Skills Framework for the Information Age (SFIA)**, ensuring:
- **Industry Standards**: Alignment with global best practices
- **Clear Progression**: Defined competency levels and career paths
- **Objective Assessment**: Standardized evaluation criteria
- **Professional Growth**: Structured development opportunities

## Benefits for Associates
- **Transparent Career Progression**: Clear understanding of advancement criteria
- **Fair Compensation**: Grading aligned with market standards and responsibilities
- **Skill Development**: Targeted learning and growth opportunities
- **Professional Recognition**: Formal acknowledgment of competencies and contributions

## Next Steps
1. **Phase 1 participants** will be contacted directly within the next week
2. **All associates** will receive detailed information packets
3. **Managers** will be briefed on the assessment process and timeline
4. **Regular updates** will be shared through this communication channel

## Questions & Support
For questions about the GRP program, please contact:
- **HR Team**: Your local HR representative
- **Program Leads**: Araba or Mercy Kyuma
- **DQ Communications**: For general program information

We are committed to maintaining transparent, fair, and consistent grading standards that support both individual growth and organizational excellence.

*More details will follow as we progress through the program phases. Stay tuned for updates!*`
  },
  {
    id: 'dq-wfh-guidelines',
    title: 'DQ WFH Guidelines',
    type: 'Guidelines',
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt:
      'Work From Home (WFH) guidelines outlining purpose, roles, processes, tools, KPIs, and compliance for remote work across DQ.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80',
    department: 'HRA (People)',
    location: 'Remote',
    domain: 'People',
    tags: ['WFH', 'guidelines', 'policy'],
    readingTime: '10–20',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Work From Home (WFH) Guidelines

## WFH Guideline Overview
The **Work From Home (WFH) Guidelines** provide a clear framework for how remote work is requested, approved, executed, and monitored across DQ. Each section below is designed to keep productivity, accountability, and culture intact while associates are working remotely.

## 1. Purpose and Scope

### Purpose
- Provide structured, standardized processes for WFH implementation, approval, and management.
- Promote accountability, productivity, and collaboration.
- Maintain operational efficiency, cultural alignment, and compliance with company standards.

### Scope
- Applies to **all DQ Associates**.
- Covers the end-to-end process of requesting, approving, monitoring, and reporting WFH arrangements.

## 2. Roles and Responsibilities

### Associate
- Submit WFH requests at least **24 hours in advance** via the HR Channel, with reason and date(s).
- Post daily action updates and relevant channel engagement links in the HR Channel.
- Remain active and visible on **DQ Live24** during working hours.

### Line Manager
- Review and provide **pre-approval** for WFH requests based on operational needs.
- Monitor deliverables and ensure accountability for remote work.
- Provide feedback and flag repeated non-compliance to HR.

### Human Resources (HR)
- Provide **final approval** for all WFH requests once Line Manager pre-approval is confirmed.
- Ensure requests align with policy and are consistent across departments.

### HR & Administration (HRA)
- Oversee overall compliance and adherence to the WFH guidelines.

## 3. Guiding Principles and Controls

- **Transparency** – All WFH activities, updates, and deliverables are visible to key stakeholders.
- **Accountability** – Associates remain responsible for deliverables, timelines, and communication.
- **Equity and Fairness** – Approvals are objective and based on role, performance, and continuity.
- **Compliance and Discipline** – Adhere to WFH policies, timelines, and workflows.
- **Collaboration and Communication** – Use approved tools and maintain active engagement.
- **Data Security and Confidentiality** – Protect company data when working remotely.

## 4. WFH Processes

1. **Submit request** – Associate submits WFH request at least 24 hours in advance via the HR Channel, including reason, dates, and expected working hours.
2. **Line Manager pre-approval** – Line Manager reviews impact on workload and coverage, then pre-approves or requests changes.
3. **HR final approval** – HR verifies compliance, records the decision, and notifies Associate and Line Manager.
4. **Post the day plan** – On the WFH day, Associate creates a thread in the HR Channel before work starts with actions for the day and engagement links.
5. **Clock-in & presence** – Associate clocks in on **DQ Shifts** and stays active on **DQ Live24**.
6. **Work execution & communication** – Follow the day plan, provide regular updates, respond promptly, and attend all calls.
7. **Record deliverables** – At end of day, Associate posts completed tasks, outstanding items, and blockers in the HR thread.
8. **Monitoring & compliance** – HRA and Line Manager monitor adherence; repeated non-compliance triggers formal review.
9. **Escalation & follow-up** – Failure to post updates or remain active on DQ Live24 may be treated as an unpaid workday and can lead to revocation of WFH privileges or performance review.

## 5. Tools and Resources

- **DQ Live24** – Visibility and communication.
- **DQ Logistics Channel** – Sharing approved WFH schedules.
- **HR Portal** – Submitting requests and tracking WFH history.

## 6. Key Performance Indicators (KPIs)

- **Timely Submission** – 100% of WFH requests submitted at least 24 hours in advance.
- **Approval Compliance** – 100% adherence to the approval workflow.
- **Visibility Compliance** – 100% of approved WFH associates post daily actions and engagement links.
- **Attendance Accuracy** – 100% of WFH attendance tracked via DQ Shifts and DQ Live24.
- **Policy Adherence** – Zero unapproved or non-compliant WFH cases per review cycle.
- **Performance Consistency** – Productivity maintained at in-office levels.

## 7. Compliance and Governance

- All WFH requests must follow the 24-hour advance notice rule with Line Manager pre-approval and HR final approval.
- Associates must post daily actions and engagement links; failure to do so may result in the day being treated as unpaid.
- WFH attendance must be logged through DQ Live24 for verification.
- HRA monitors adherence, consistency, and reports non-compliance cases.

## 8. Review and Update Schedule

- **Quarterly Review** – HR and Admin review guidelines every three months.
- **Ad-hoc Updates** – Additional updates may be made when gaps or improvements are identified.

## 9. Appendix and References

- Appendix A – WFH Request Template.
- Appendix B – DQ Shifts Attendance Guide.
- Appendix C – Remote Work Security Checklist.

## Need Help? Contact the Team

**Key Contacts**
- **Pelagie Njiki** – CoE Lead
- **Mauline Wangui** – TechOps Coordinator
- **Martin Wambugu** – Content & Marketing Analyst
`,
  },
  {
    id: 'dq-dress-code-guideline',
    title: 'DQ Dress Code Guidelines',
    type: 'Guidelines',
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt:
      'Dress code guideline balancing professionalism and comfort across the work week, with clear expectations, exceptions, and consequences.',
    // Image shows a professional group of 2 men and 1 woman in official black suits
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    tags: ['dress code', 'guidelines', 'policy'],
    readingTime: '10–20',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Dress Code Guideline (Version 1.0)

## Context
At **DigitalQatalyst (DQ)**, professional appearance shapes how our brand is perceived, supports personal confidence, and creates an environment where associates feel comfortable and productive. This guideline sets expectations for attire so we strike the right balance between professionalism and comfort.

## Purpose
These dress code guidelines ensure associates align with DQ's culture of professionalism while allowing flexibility for creativity and comfort. The standard is **business casual Monday–Thursday** with a more relaxed **Casual Friday**, adapted for the diverse nature of work at DQ.

## Key Characteristics

- **Professional Appearance** – Associates dress in a professional, decent, and clean manner; clothing should enhance DQ's image.
- **Cultural Sensitivity** – Outfits should be respectful of cultural and religious norms.
- **Personal Grooming** – Hair, nails, and hygiene are maintained to a high standard. Fragrances, jewelry, and accessories should not distract from the professional setting.

## Dress Code Details

### Monday to Thursday – Business Casual

- **Men**
  - Well-fitted button-down shirt or polo
  - Tailored trousers, khakis, or chinos
  - Closed-toe shoes such as loafers or formal shoes

- **Women**
  - Blouse or sweater with tailored pants or skirt
  - Knee-length professional skirt or dress
  - Closed-toe shoes (flats or heels)

### Friday – Casual

- **Men**
  - Polo shirts or casual button-down shirts
  - Clean, well-fitted jeans
  - Casual shoes, sneakers, or loafers

- **Women**
  - Casual blouses or t‑shirts with jeans or casual skirt/dress
  - Comfortable, casual closed shoes or sneakers

## Preparation Before Implementation

Before rolling out the dress code:

- **Communicate Dress Code** – Send formal communication via Teams explaining the guideline and effective date.
- **Provide Visuals** – Share example images of acceptable business casual and Casual Friday outfits for men and women.
- **Clarify Exceptions** – Highlight how medical or other special cases will be handled.

## Guidelines During Workdays

- Associates are expected to follow the dress code **every working day** (business casual Monday–Thursday, casual on Friday).
- **Team Leads** oversee compliance within their teams and address non-compliance promptly.
- **HRA** holds overall responsibility for monitoring and enforcing these guidelines.

### Non-Compliance and Escalation

Failure to comply with the dress code may result in:

1. **Verbal warning** – Direct message to the associate.
2. **Written warning** – Formal note placed on the associate's HR channel.
3. **Further disciplinary action** – May include suspension or other actions as deemed appropriate.

Associates and leaders are jointly responsible for ensuring the guideline is understood and consistently applied.

## Special Considerations

- **Client-Facing Meetings** – More formal business attire may be required; guidance will be communicated in advance.
- **Company Events or Presentations** – Formal business attire is required.
- **Extreme Weather** – Attire may be adjusted for comfort while staying within professional bounds.
- **Medical Exceptions** – Reasonable adjustments can be made for medical reasons; these should be discussed confidentially with HR.

## Prohibited Attire

The following are **strictly prohibited** during working days:

- Ripped jeans
- Graphic t‑shirts or overly casual tops
- Beachwear, sweatpants, gym wear, or shorts
- Flip-flops, sandals, or other overly casual footwear

## Post-Implementation Review

### Monitor Compliance
- Conduct occasional reviews to ensure the dress code is being followed across teams and locations.

### Recognition and Rewards
- **Best Dressed Award** – Recognise associates who consistently model the dress code.
- **Most Improved Award** – Appreciate associates who show clear improvement in adherence.

These recognitions help reinforce the guideline in a positive, motivating way.

### Adjust Guidelines as Needed
- Collect feedback and update the guideline where aspects prove unclear, impractical, or misaligned with DQ culture.

## Visuals and Examples

- **Business Casual** – Button-up shirt, slacks, blazer (men); blouse and pencil skirt or knee-length dress with flats or heels (women).
- **Casual Fridays** – Polo shirt and jeans with casual shoes (men); casual top with jeans and flats/sneakers (women). Always maintain neat, non-revealing, and culturally respectful outfits.

Where in doubt, associates should choose the more professional option and consult HR or their Line Manager for clarification.
`,
  },
  {
    id: 'dq-storybook-latest-links',
    title: 'DQ Storybook — Latest Version and Links',
    type: 'Announcement',
    date: '2025-11-13',
    author: 'Irene Musyoki',
    views: 0,
    excerpt:
      'Explore the latest DQ Storybook and quick links to GHC elements including Vision, HoV, Persona, Agile TMS/SoS/Flows, and 6xD.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    domain: 'Business',
    tags: ['story', 'GHC', 'references'],
    readingTime: '5–10',
    newsType: 'Corporate Announcements',
    newsSource: 'DQ Communications',
    focusArea: 'GHC',
    content: `# DQ Storybook — Latest Version and Quick Reference Links

## Introduction
Here's the latest version of the **DQ Storybook** — our evolving narrative that brings the Golden Honeycomb of Competencies (GHC) to life. We're continuing to shape and refine this Storybook, so keep an eye out for new updates and deep dives in the coming weeks.

## Main Storybook Access
**[DQ Storybook: Complete Guide](https://dq-storybook.example.com)**
*Your comprehensive resource for understanding DQ's methodology, culture, and operational excellence.*

---

## Quick Reference Links

### 01. DQ Vision (Purpose)
**[Access DQ Vision →](https://dq-vision.example.com)**
- Our foundational purpose and strategic direction
- Long-term goals and organizational mission
- Vision alignment across all business units

### 02. DQ HoV (Culture)
**[Explore House of Values →](https://dq-hov.example.com)**
- Core values that guide our daily operations
- Cultural principles and behavioral expectations
- Team collaboration and ethical standards

### 03. DQ Persona (Identity)
**[Discover DQ Persona →](https://dq-persona.example.com)**
- Our unique organizational identity and brand
- Professional characteristics and market positioning
- Client interaction and service delivery standards

### 04. Agile TMS (Tasks)
**[View Task Management System →](https://dq-tms.example.com)**
- Agile task organization and workflow management
- Sprint planning and execution methodologies
- Performance tracking and delivery metrics

### 05. Agile SoS (Governance)
**[Access Scrum of Scrums →](https://dq-sos.example.com)**
- Cross-team coordination and governance structures
- Escalation procedures and decision-making frameworks
- Inter-departmental communication protocols

### 06. Agile Flows (Value Streams)
**[Explore Value Streams →](https://dq-flows.example.com)**
- End-to-end value delivery processes
- Customer journey mapping and optimization
- Continuous improvement methodologies

### 07. Agile 6xD (Products)
**[Discover 6xD Framework →](https://dq-6xd.example.com)**
*Link to be updated - Coming Soon*
- Six-dimensional product development approach
- Innovation frameworks and delivery excellence
- Product lifecycle management and optimization

---

## How to Use These Resources

### For New Team Members
1. **Start with DQ Vision** to understand our purpose
2. **Review HoV** to align with our cultural values
3. **Explore DQ Persona** to understand our identity
4. **Dive into operational frameworks** (TMS, SoS, Flows, 6xD)

### For Existing Associates
- **Regular Reference**: Bookmark these links for quick access
- **Team Meetings**: Use these resources to align discussions
- **Client Presentations**: Reference our methodologies and approaches
- **Professional Development**: Deepen your understanding of DQ excellence

### For Project Teams
- **Project Kickoffs**: Align on DQ methodologies and standards
- **Sprint Planning**: Reference TMS and Flows for optimal delivery
- **Stakeholder Communication**: Use Persona and Vision for consistent messaging

## Updates and Maintenance
- **Regular Updates**: Content is refreshed bi-weekly
- **Feedback Welcome**: Submit suggestions through DQ Communications
- **Version Control**: All changes are tracked and communicated
- **Mobile Optimization**: All links are mobile-friendly for on-the-go access

## Support and Questions
For questions about any of these resources or to request additional documentation:
- **DQ Communications Team**: [communications@dq.com](mailto:communications@dq.com)
- **Internal Slack**: #dq-storybook-support
- **Knowledge Base**: [help.dq.com](https://help.dq.com)

---

*Keep this reference handy for quick access to all DQ frameworks and methodologies. Together, we continue to build excellence through shared knowledge and consistent application of our proven approaches.*`
  }
  */
];
