import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FilterSidebar, FilterConfig } from '../../components/marketplace/FilterSidebar';
import { FilterIcon, XIcon } from 'lucide-react';
import { SessionDetailsModal } from './components/SessionDetailsModal';

interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'retro' | 'cws' | 'scrum' | 'townhall' | 'wr' | 'ct';
  department: string;
  location: string;
  attendees: string[];
  agenda: string[];
  description?: string;
  joinLink: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
}

// Department colors
const departmentColors: Record<string, { bg: string; border: string }> = {
  'CoE': { bg: '#1A2E6E', border: '#1A2E6E' },
  'Products': { bg: '#607D8B', border: '#607D8B' },
  'Solutions': { bg: '#00BCD4', border: '#00BCD4' },
  'DevOps': { bg: '#795548', border: '#795548' },
  'Intelligence': { bg: '#FF9800', border: '#FF9800' },
  'Deals': { bg: '#4CAF50', border: '#4CAF50' },
  'HRA': { bg: '#1A2E6E', border: '#1A2E6E' },
  'Stories': { bg: '#9C27B0', border: '#9C27B0' },
  'Delivery - Designs': { bg: '#3F51B5', border: '#3F51B5' },
  'Delivery - Deploys': { bg: '#E91E63', border: '#E91E63' },
  'All Departments': { bg: '#9E9E9E', border: '#9E9E9E' },
};

const departments = [
  'CoE',
  'Products',
  'Solutions',
  'DevOps',
  'Intelligence',
  'Deals',
  'HRA',
  'Stories',
  'Delivery - Designs',
  'Delivery - Deploys',
];

// Helper function to get last Friday of a month
function getLastFridayOfMonth(year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0); // Last day of month
  const dayOfWeek = lastDay.getDay(); // 0 = Sunday, 5 = Friday
  const lastFriday = new Date(lastDay);
  
  if (dayOfWeek === 5) {
    // Last day is Friday, use it
    return lastFriday;
  } else if (dayOfWeek < 5) {
    // Last day is before Friday, go back
    lastFriday.setDate(lastDay.getDate() - (dayOfWeek + 2));
  } else {
    // Last day is Saturday, go back 1 day
    lastFriday.setDate(lastDay.getDate() - 1);
  }
  
  return lastFriday;
}

// Helper function to get a specific weekday in a week
function getWeekdayInWeek(baseDate: Date, targetDay: number): Date {
  const date = new Date(baseDate);
  const currentDay = date.getDay();
  const daysToAdd = (targetDay - currentDay + 7) % 7;
  date.setDate(date.getDate() + daysToAdd);
  return date;
}

// Generate recurring sessions based on real data
function generateRecurringSessions(): Session[] {
  const sessions: Session[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate sessions for the next 12 weeks
  for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (weekOffset * 7));
    
    // Scrum COE Prod - Mon-Fri 08:00-08:30 (Daily)
    for (let day = 1; day <= 5; day++) {
      const scrumDate = getWeekdayInWeek(weekStart, day);
      if (scrumDate >= today) {
        sessions.push({
          id: `scrum-coe-prod-${weekOffset}-${day}`,
          title: 'Scrum COE Prod',
          start: new Date(scrumDate.setHours(8, 0, 0, 0)),
          end: new Date(scrumDate.setHours(8, 30, 0, 0)),
          type: 'scrum',
          department: 'CoE',
          location: 'Remote',
          attendees: ['CoE Unit & Product Factory Members'],
          agenda: [
            'QCC – WSU | SEDU',
            'QCC – ATP | Tasks | Outcomes | CLIs',
            'Review – Gaps & Blockers in session (escalate on channel if needed)'
          ],
          description: 'Ensure task clarity and alignment of associates on a daily and weekly basis. Enforce adherence to DQ Task Management Standards (Agile TMS), guided by the 7S Tenets.',
          joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_Njc1MDc2NmEtYjdkMS00MmNiLWEwYzgtMWViMjZhYjlmZWNh%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
          frequency: 'daily',
        });
      }
    }
    
    // CoE | CWS (Leads) - Monday 08:45-09:45 (Weekly)
    const cwsLeadsDate = getWeekdayInWeek(weekStart, 1);
    if (cwsLeadsDate >= today) {
      sessions.push({
        id: `cws-coe-leads-${weekOffset}`,
        title: 'CoE | CWS (Leads)',
        start: new Date(cwsLeadsDate.setHours(8, 45, 0, 0)),
        end: new Date(cwsLeadsDate.setHours(9, 45, 0, 0)),
        type: 'cws',
        department: 'CoE',
        location: 'Remote',
        attendees: ['CoE Leads', 'CWS Leads'],
        agenda: [
          'ATP Guidelines',
          'Employment Grading & Pay + DQ Scrum Mastering',
          'Implementation of CDS',
          'AoB: Open floor for leadership insights or questions'
        ],
        description: 'To recap and reinforce the Lead\'s mandate, tools, and working responsibilities. To align the week\'s focus areas across units to drive coherence and execution momentum.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZjZlODA1ZjItMjEwZi00OTIzLWExOTAtYWM3OTZjNGMxYmFi%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22e691a64f-0e15-4da2-bf25-3b2177e7b742%22%7d',
        frequency: 'weekly',
      });
    }
    
    // WR | DQ.Products - Mon-Fri 08:30-17:00 (Daily)
    for (let day = 1; day <= 5; day++) {
      const wrProductsDate = getWeekdayInWeek(weekStart, day);
      if (wrProductsDate >= today) {
        sessions.push({
          id: `wr-products-${weekOffset}-${day}`,
          title: 'WR | DQ.Products',
          start: new Date(wrProductsDate.setHours(8, 30, 0, 0)),
          end: new Date(wrProductsDate.setHours(17, 0, 0, 0)),
          type: 'wr',
          department: 'Products',
          location: 'Remote',
          attendees: ['Product Factory Members'],
          agenda: [
            'Sprint Plan Review – Monday 12pm – 2pm (DXB)',
            'Product Launch Update & Review',
            'Sprint Review & Functional Tracker Review',
            'Daily Plan vs Actual',
            'Barriers & Risks',
            'Any Other Business (AoB)'
          ],
          description: 'Ensure Timely Product Development & Launches: Align all teams to clear blockers and meet deadlines, with a focus on overcoming past delays.',
          joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDk0YTRmYjAtOTU2ZC00OTA3LWIzMWMtYzQ3MmM1ZmM0Mjdi%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
          frequency: 'daily',
        });
      }
    }
    
    // WR | DQ.Solutions | DevOps | INT - Mon-Fri 08:00-17:00 (Daily)
    for (let day = 1; day <= 5; day++) {
      const wrSolutionsDevOpsDate = getWeekdayInWeek(weekStart, day);
      if (wrSolutionsDevOpsDate >= today) {
      sessions.push({
          id: `wr-solutions-devops-int-${weekOffset}-${day}`,
          title: 'WR | DQ.Solutions | DevOps | INT',
          start: new Date(wrSolutionsDevOpsDate.setHours(8, 0, 0, 0)),
          end: new Date(wrSolutionsDevOpsDate.setHours(17, 0, 0, 0)),
          type: 'wr',
          department: 'Solutions',
          location: 'Remote',
          attendees: ['DevOps Factory', 'Solution Factory', 'INT Factory'],
          agenda: [
            'General Scrum (9:00 am - 9:30 am)',
            'DSL Scrum (9:30 am - 10:00 am)',
            'Deep Work Sprint 1 (10:00 am - 12:30 pm)',
            'Mid-Day Check-In (12:30 pm - 1:00 pm)',
            'LnD | PROD | Prac Streams (1:00 pm - 2:00 pm)',
            'Deep Work Sprint 2 (3:00 pm - 5:00 pm)',
            'EoD Scrum (5:00 pm - 6:00 pm)'
          ],
          description: 'Drives focused task completion on priority risks, dependencies, and cross-factory integration across projects (DFSA & KF), ensuring fast turnaround and sustained delivery momentum.',
          joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MjZmZmI4MzEtNDZjZi00MWU0LTkyNzUtMjhkYzI3ZTA1ZTg5%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22fb3794c9-eedf-492b-9c56-aa073026a5e8%22%7d',
          frequency: 'daily',
        });
      }
    }
    
    // WR | DQ.Solutions - Mon-Fri 08:00-17:00 (Daily)
    for (let day = 1; day <= 5; day++) {
      const wrSolutionsDate = getWeekdayInWeek(weekStart, day);
      if (wrSolutionsDate >= today) {
        sessions.push({
          id: `wr-solutions-${weekOffset}-${day}`,
          title: 'WR | DQ.Solutions',
          start: new Date(wrSolutionsDate.setHours(8, 0, 0, 0)),
          end: new Date(wrSolutionsDate.setHours(17, 0, 0, 0)),
          type: 'wr',
          department: 'Solutions',
          location: 'Remote',
          attendees: ['Solution Factory Members'],
          agenda: [
            'Sprint Plan Review — Monday 12:00 pm - 1:00 pm',
            'Kick Off Scrum (9:30 am - 10:00 am)',
            'Deep Work Sprint 1 (10:00 am - 12:30 pm)',
            'Mid-Day Check-In (12:30 pm - 1:00 pm)',
            'Deep Work Sprint 2 (3:00 pm - 5:00 pm)',
            'EoD Scrum (5:00 pm - 6:00 pm)',
            'Retro — Fri 10:00 AM –11:30 AM'
          ],
          description: 'Enable focused task completion and coordination. Strengthen peer accountability and ownership. Improve visibility and momentum on key deliverables.',
          joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YjI4MDZmOTQtMjQ2Yy00ZjMyLTgyZTYtZTQ0ZmVmYWM1ZDQ3%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
          frequency: 'daily',
        });
      }
    }
    
    // WR | DQ. Deals - Mon-Fri 08:30-17:00 (Daily)
    for (let day = 1; day <= 5; day++) {
      const wrDealsDate = getWeekdayInWeek(weekStart, day);
      if (wrDealsDate >= today) {
        sessions.push({
          id: `wr-deals-${weekOffset}-${day}`,
          title: 'WR | DQ. Deals',
          start: new Date(wrDealsDate.setHours(8, 30, 0, 0)),
          end: new Date(wrDealsDate.setHours(17, 0, 0, 0)),
          type: 'wr',
          department: 'Deals',
          location: 'Remote',
          attendees: ['Deals Factory Members'],
          agenda: [
            'SPRINT PLAN REVIEW – 11:30 am to 12:30 pm | Monday (Weekly)',
            'Kick Off Scrum (9:30 am - 10:00 am)',
            'Deep Work Sprint 1 (10:00 am - 12:30 pm)',
            'Mid-Day Check-In (12:30 pm - 1:00 pm)',
            'Deep Work Sprint 2 (3:00 pm - 5:00 pm)',
            'EoD Scrum (5:00 pm - 6:00 pm)',
            'RETRO – 10:00 am to 12:00 pm | Thursday (Weekly)'
          ],
          description: 'Ensure Deal Progression: Track and accelerate the progress of active deals, ensuring alignment across BD/Partner teams.',
          joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzkzZGU1NjQtMTM5Mi00Y2ZiLWFlNmUtYTI5YjM1MzQ5MDM3%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
          frequency: 'daily',
        });
      }
    }
    
    // CT.WS | DSG (GOV) - Mondays 10:00-11:00 (Weekly)
    const ctDsgGovDate = getWeekdayInWeek(weekStart, 1);
    if (ctDsgGovDate >= today) {
      sessions.push({
        id: `ct-dsg-gov-${weekOffset}`,
        title: 'CT.WS | DSG (GOV)',
        start: new Date(ctDsgGovDate.setHours(10, 0, 0, 0)),
        end: new Date(ctDsgGovDate.setHours(11, 0, 0, 0)),
        type: 'ct',
        department: 'Delivery - Designs',
        location: 'Remote',
        attendees: ['DSG Team', 'Governance Team'],
        agenda: [
          'Governance (CIMD | RAID | Delivery Plan..)',
          'Stakeholder Management/Review'
        ],
        description: 'Review dashboards to assess current gaps and risks. Identify, assign, and track resolution actions for high-priority issues. Projects: ADIB | KF | NEOM | STC | SAIB | DEWA',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MjVjNzUzNmEtMTk1OS00ZTg4LTlhODgtYTFjNzY5Njk1Mzg3%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%224f3930c0-15b8-4543-bc94-f546acf0ac56%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CWS | DQ.HRA - Mondays 11:00-12:00 (Weekly)
    const cwsHraDate = getWeekdayInWeek(weekStart, 1);
    if (cwsHraDate >= today) {
      sessions.push({
        id: `cws-hra-${weekOffset}`,
        title: 'CWS | DQ.HRA',
        start: new Date(cwsHraDate.setHours(11, 0, 0, 0)),
        end: new Date(cwsHraDate.setHours(12, 0, 0, 0)),
        type: 'cws',
        department: 'HRA',
        location: 'Remote',
        attendees: ['HRA Factory Members', 'H2O Tower', 'O2P Tower', 'Smart DWS & CO-share Tower'],
        agenda: [
          'Action Items – Review previous CWS action items',
          'Tracker Review – Review Factory/Tower Tracker Status',
          'This Week\'s Priorities – Each tower shares weekly sprint plan',
          'Live Co-Working – Collaboratively work through shared tasks, overlaps, or blockers',
          'Next Steps & Owners – Confirm responsibilities and co-working follow-up'
        ],
        description: 'Align on weekly execution priorities across towers. Strengthen co-working between leads and members to ensure smooth delivery.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZWIwOWNiY2ItZTgxMy00ZDg2LThlNmYtNTQ5NzY5YWVhZGIz%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CWS | DQ.INT - Mondays 11:00-12:00 (Weekly)
    const cwsIntDate = getWeekdayInWeek(weekStart, 1);
    if (cwsIntDate >= today) {
      sessions.push({
        id: `cws-int-${weekOffset}`,
        title: 'CWS | DQ.INT',
        start: new Date(cwsIntDate.setHours(11, 0, 0, 0)),
        end: new Date(cwsIntDate.setHours(12, 0, 0, 0)),
        type: 'cws',
        department: 'Intelligence',
        location: 'Remote',
        attendees: ['INT Factory Members', 'DBs | Pipe | API Tower', 'AI | Analytics Tower'],
        agenda: [
          'Actions Items – Review progress on previous session action items',
          'Tracker Status – Review Factory/Tower tracker status',
          'This Week\'s Priorities – Each tower shares weekly sprint plan view',
          'Live Co-Working – Collaboratively work through shared tasks, overlaps, or blockers',
          'Next Steps & Owners – Confirm responsibilities and co-working follow-ups'
        ],
        description: 'Align on weekly execution priorities across towers. Strengthen co-working between leads and members to ensure smooth delivery.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YjBjZDJkZWYtMTUxZi00NjdhLWI3YWYtYWM3ZDAxOGIwOTk3%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CWS | DQ.Stories - Mondays 12:00-13:00 (Weekly)
    const cwsStoriesDate = getWeekdayInWeek(weekStart, 1);
    if (cwsStoriesDate >= today) {
      sessions.push({
        id: `cws-stories-${weekOffset}`,
        title: 'CWS | DQ.Stories',
        start: new Date(cwsStoriesDate.setHours(12, 0, 0, 0)),
        end: new Date(cwsStoriesDate.setHours(13, 0, 0, 0)),
        type: 'cws',
        department: 'Stories',
        location: 'Remote',
        attendees: ['Stories Factory Members', 'Blueprints | Collaterals Tower', 'LMS Tower'],
        agenda: [
          'Actions Items – Review progress on previous session action items',
          'Tracker Status – Review Factory/Tower tracker status',
          'This Week\'s Priorities – Each tower shares weekly sprint plan view',
          'Live Co-Working – Collaboratively work through shared tasks, overlaps, or blockers',
          'Next Steps & Owners – Confirm responsibilities and co-working follow-ups'
        ],
        description: 'Align on weekly execution priorities across towers. Strengthen co-working between leads and members to ensure smooth delivery.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTRiMmExMWUtNGI3NS00ZmM0LWE4MTMtNjQxZTRkNmJmNzNl%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CWS | DQ.DevOps - Tuesdays 14:00-14:45 (Weekly)
    const cwsDevOpsDate = getWeekdayInWeek(weekStart, 2);
    if (cwsDevOpsDate >= today) {
      sessions.push({
        id: `cws-devops-${weekOffset}`,
        title: 'CWS | DQ.DevOps',
        start: new Date(cwsDevOpsDate.setHours(14, 0, 0, 0)),
        end: new Date(cwsDevOpsDate.setHours(14, 45, 0, 0)),
        type: 'cws',
        department: 'DevOps',
        location: 'Remote',
        attendees: ['DevOps Factory Members', 'CICD Tower', 'Test Tower', 'Host | DWS Support Tower'],
        agenda: [
          'Action Items – Review previous CWS action items',
          'Tracker Review – Review Factory/Tower Tracker Status',
          'This Week\'s Priorities – Each tower shares weekly sprint plan',
          'Live Co-Working – Collaboratively work through shared tasks, overlaps, or blockers',
          'Next Steps & Owners – Confirm responsibilities and co-working follow-up'
        ],
        description: 'Align on weekly execution priorities across towers. Strengthen co-working between leads and members to ensure smooth delivery.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YmRiNjgwMDItYTdmYy00ZDFjLTk0YWItZWIzOTc5OTU0NTI2%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CT.WS | DPL (DXB) - Tuesdays 16:00-17:00 (Weekly)
    const ctDplDxbDate = getWeekdayInWeek(weekStart, 2);
    if (ctDplDxbDate >= today) {
      sessions.push({
        id: `ct-dpl-dxb-${weekOffset}`,
        title: 'CT.WS | DPL (DXB)',
        start: new Date(ctDplDxbDate.setHours(16, 0, 0, 0)),
        end: new Date(ctDplDxbDate.setHours(17, 0, 0, 0)),
        type: 'ct',
        department: 'Delivery - Deploys',
        location: 'Dubai',
        attendees: ['DPL Team', 'DevOps Team', 'Support Team'],
        agenda: [
          'Governance (CIMD | RAID | Delivery Plan..)',
          'Stakeholder Management/Review',
          'Dev (FQAD | Tasks | Demo…)',
          'DevOps (Environment Set-up/Readiness)',
          'Support (Tickets)'
        ],
        description: 'Review dashboards to assess current gaps and risks. Projects: DFSA | INC02 (Support) | DFSA | INC03 (Carry-over & Skunk)',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MmM5ZWE5MjItM2VkYy00OTU5LTg0YTMtNGRkZjRlMjVjNmNh%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CoE | GOV - Wednesdays 08:45-09:45 (Weekly)
    const coeGovDate = getWeekdayInWeek(weekStart, 3);
    if (coeGovDate >= today) {
      sessions.push({
        id: `coe-gov-${weekOffset}`,
        title: 'CoE | GOV',
        start: new Date(coeGovDate.setHours(8, 45, 0, 0)),
        end: new Date(coeGovDate.setHours(9, 45, 0, 0)),
        type: 'cws',
        department: 'CoE',
        location: 'Remote',
        attendees: ['CoE Unit Members', 'All Unit Leads'],
        agenda: [
          'Initiatives Rundown (All Units) – Review initiatives, link to mandates/strategy, and share progress updates',
          'Improvements Achieved – Highlight progress and wins for each initiative',
          'Gaps Identified – Discuss challenges and areas requiring intervention',
          'Resolve Plan vs. Actual – Review weekly plan against outcomes achieved',
          'Any Other Business (AoB) – Open discussion on additional items'
        ],
        description: 'The forum reinforces control over delivery and operations while also reinforcing the culture needed to sustain growth.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NGJkNDUzZWYtNmVlOC00MWM5LWExZGItNDIyOTYzMDA3Yzgw%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%224f3930c0-15b8-4543-bc94-f546acf0ac56%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CT.WS | DSG (KSA) - Wednesdays 10:30-12:30 (Weekly) - Assuming 10:30 instead of 22:30
    const ctDsgKsaDate = getWeekdayInWeek(weekStart, 3);
    if (ctDsgKsaDate >= today) {
      sessions.push({
        id: `ct-dsg-ksa-${weekOffset}`,
        title: 'CT.WS | DSG (KSA)',
        start: new Date(ctDsgKsaDate.setHours(10, 30, 0, 0)),
        end: new Date(ctDsgKsaDate.setHours(12, 30, 0, 0)),
        type: 'ct',
        department: 'Delivery - Designs',
        location: 'Riyadh',
        attendees: ['DSG Team', 'Governance Team'],
        agenda: [
          'Governance (CIMD | RAID | Delivery Plan..)',
          'Stakeholder Management/Review'
        ],
        description: 'Review dashboards to assess current gaps and risks. Projects: NEOM | STC | SAIB',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWQ2NjdkZWUtNmI1YS00Njk5LTk5OWMtYmIxNmUwM2Q3YzJm%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
        frequency: 'weekly',
      });
    }
    
    // RETRO | DEALS (BD) - Thursdays 10:00-11:00 (Weekly)
    const retroDealsDate = getWeekdayInWeek(weekStart, 4);
    if (retroDealsDate >= today) {
      sessions.push({
        id: `retro-deals-${weekOffset}`,
        title: 'RETRO | DEALS (BD)',
        start: new Date(retroDealsDate.setHours(10, 0, 0, 0)),
        end: new Date(retroDealsDate.setHours(11, 0, 0, 0)),
        type: 'retro',
        department: 'Deals',
        location: 'Remote',
        attendees: ['Business Development Team', 'Partners Team'],
        agenda: [
          'Follow-up Actions – Review progress from previous session actions',
          'Review : Plan vs Actual | Demo',
          'AoB – Capture additional BD/Partner updates'
        ],
        description: 'Ensure working structures deliver consistent workforce visibility and process efficiency.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzkzZGU1NjQtMTM5Mi00Y2ZiLWFlNmUtYTI5YjM1MzQ5MDM3%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
        frequency: 'weekly',
      });
    }
    
    // RETRO | DQ.DevOps - Thursdays 14:30-15:30 (Weekly)
    const retroDevOpsDate = getWeekdayInWeek(weekStart, 4);
    if (retroDevOpsDate >= today) {
      sessions.push({
        id: `retro-devops-${weekOffset}`,
        title: 'RETRO | DQ.DevOps',
        start: new Date(retroDevOpsDate.setHours(14, 30, 0, 0)),
        end: new Date(retroDevOpsDate.setHours(15, 30, 0, 0)),
        type: 'retro',
        department: 'DevOps',
        location: 'Remote',
        attendees: ['DevOps Factory Members'],
        agenda: [
          'Previous Actions – Align on previous retro actions to ensure closure',
          'Progress Review – Track weekly targets, updates, and demos (Tracker, Threads)',
          'Blockers & Gaps – Capture issues and resolution paths',
          'Any Other Business (AoB) – Open floor for additional inputs'
        ],
        description: 'Align on DevOps factory purpose. Ensure working structures deliver consistent workforce visibility and process efficiency.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_M2Y1OTNlN2MtNjk3ZS00YjBiLThiMzgtOGFlMzdlOTY1ZjBk%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22d2b63820-0f87-440e-b6f2-21d8df352daf%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CT.WS | DPL (DXB) - Thursdays 15:30-16:45 (Weekly)
    const ctDplDxbThuDate = getWeekdayInWeek(weekStart, 4);
    if (ctDplDxbThuDate >= today) {
      sessions.push({
        id: `ct-dpl-dxb-thu-${weekOffset}`,
        title: 'CT.WS | DPL (DXB)',
        start: new Date(ctDplDxbThuDate.setHours(15, 30, 0, 0)),
        end: new Date(ctDplDxbThuDate.setHours(16, 45, 0, 0)),
        type: 'ct',
        department: 'Delivery - Deploys',
        location: 'Dubai',
        attendees: ['DPL Team', 'DevOps Team', 'Support Team'],
        agenda: [
          'Governance (CIMD | RAID | Delivery Plan..)',
          'Stakeholder Management/Review',
          'Dev (FQAD | Tasks | Demo…)',
          'DevOps (Environment Set-up/Readiness)',
          'Support (Tickets)'
        ],
        description: 'Review dashboards to assess current gaps and risks. Projects: DFSA | INC02 (Support) | DFSA | INC03 (Carry-over & Skunk)',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MmM5ZWE5MjItM2VkYy00OTU5LTg0YTMtNGRkZjRlMjVjNmNh%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
        frequency: 'weekly',
      });
    }
    
    // RETRO | DQ.HRA - Fridays 09:30-10:30 (Weekly)
    const retroHraDate = getWeekdayInWeek(weekStart, 5);
    if (retroHraDate >= today) {
      sessions.push({
        id: `retro-hra-${weekOffset}`,
        title: 'RETRO | DQ.HRA',
        start: new Date(retroHraDate.setHours(9, 30, 0, 0)),
        end: new Date(retroHraDate.setHours(10, 30, 0, 0)),
        type: 'retro',
        department: 'HRA',
        location: 'Remote',
        attendees: ['HRA Factory Members'],
        agenda: [
          'Previous Actions– Update on previous actions to ensure closure',
          'Progress Review (Demos) – Track weekly targets, updates, and actions (Tracker, Threads)',
          'Blockers & Gaps – Capture HR & Admin issues and resolution paths',
          'Any Other Business (AoB) – Open floor for additional reflections'
        ],
        description: 'Align on HRA factory purpose. Ensure HR & Admin structures deliver consistent workforce visibility, engagement, and compliance.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_OWVkZTBmMTUtYmMxNi00ZGFhLTllZDctYzU0YmZlNzI3OGRi%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
        frequency: 'weekly',
      });
    }
    
    // CT.WS | DSG (UAE) - Fridays 14:00-15:00 (Weekly)
    const ctDsgUaeDate = getWeekdayInWeek(weekStart, 5);
    if (ctDsgUaeDate >= today) {
      sessions.push({
        id: `ct-dsg-uae-${weekOffset}`,
        title: 'CT.WS | DSG (UAE)',
        start: new Date(ctDsgUaeDate.setHours(14, 0, 0, 0)),
        end: new Date(ctDsgUaeDate.setHours(15, 0, 0, 0)),
        type: 'ct',
        department: 'Delivery - Designs',
        location: 'Dubai',
        attendees: ['DSG Team', 'Governance Team'],
        agenda: [
          'Governance (CIMD | RAID | Delivery Plan..)',
          'Stakeholder Management/Review'
        ],
        description: 'Review dashboards to assess current gaps and risks. Projects: ADIB | KF | DEWA | DFSA (Skunk)',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NzE5MGQyNDYtMDI2ZC00ZGY5LTkzNDQtYWVlNDVjYmEzOTJk%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
        frequency: 'weekly',
      });
    }
  }
  
  // Generate Townhall sessions - Monthly on last Friday
  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const currentDate = new Date(today);
    currentDate.setMonth(today.getMonth() + monthOffset);
    const lastFriday = getLastFridayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    if (lastFriday >= today) {
      sessions.push({
        id: `townhall-${monthOffset}`,
        title: 'DQ | TOWNHALL',
        start: new Date(lastFriday.setHours(16, 0, 0, 0)),
        end: new Date(lastFriday.setHours(17, 0, 0, 0)),
        type: 'townhall',
        department: 'All Departments',
        location: 'All Locations',
        attendees: ['All Locations - All Team Members', 'Leadership Team'],
        agenda: [
          'Welcome & Introduction',
          'Organizational Updates',
          'Q&A Session'
        ],
        description: 'Company-wide meeting that brings together associates from all levels to discuss key organizational updates, initiatives, and priorities.',
        joinLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzkwYmUwOGEtY2JiNS00NjI3LTllNzgtMjBlYjdiYWEwODcx%40thread.v2/0?context=%7b%22Tid%22%3a%22199ebd0d-2986-4f3d-8659-4388c5b2a724%22%2c%22Oid%22%3a%22a279e9cd-4b83-4d0f-a087-7c08441d7b7f%22%7d',
        frequency: 'monthly',
      });
    }
  }
  
  return sessions;
}

const dummySessions = generateRecurringSessions();

interface SessionsPageProps {
  searchQuery: string;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ searchQuery }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');

  // Parse filters from URL
  const departmentFilters = useMemo(() => {
    const dept = searchParams.get('department');
    return dept ? dept.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const sessionTypeFilters = useMemo(() => {
    const type = searchParams.get('sessionType');
    return type ? type.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const frequencyFilters = useMemo(() => {
    const freq = searchParams.get('frequency');
    return freq ? freq.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    let filtered = dummySessions;

    // Filter by department
    if (departmentFilters.length > 0) {
      filtered = filtered.filter(session =>
        departmentFilters.includes(session.department)
      );
    }

    // Filter by session type
    if (sessionTypeFilters.length > 0) {
      filtered = filtered.filter(session =>
        sessionTypeFilters.includes(session.type)
      );
    }

    // Filter by frequency
    if (frequencyFilters.length > 0) {
      filtered = filtered.filter(session =>
        frequencyFilters.includes(session.frequency)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(query) ||
        session.description?.toLowerCase().includes(query) ||
        session.department.toLowerCase().includes(query)
      );
    }

    // Sort by date (nearest to latest)
    filtered.sort((a, b) => a.start.getTime() - b.start.getTime());

    return filtered;
  }, [departmentFilters, sessionTypeFilters, frequencyFilters, searchQuery]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = new Set((newParams.get(filterType)?.split(',').filter(Boolean)) || []);
    
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }

    if (current.size > 0) {
      newParams.set(filterType, Array.from(current).join(','));
    } else {
      newParams.delete(filterType);
    }

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filterConfig: FilterConfig[] = useMemo(() => [
      {
        id: 'department',
        title: 'Department',
        options: departments.map(dept => ({ id: dept, name: dept })),
      },
      {
        id: 'sessionType',
        title: 'Session Type',
        options: [
          { id: 'retro', name: 'Retro' },
          { id: 'cws', name: 'CWS' },
          { id: 'scrum', name: 'Scrum' },
          { id: 'townhall', name: 'Townhall' },
          { id: 'wr', name: 'Working Room' },
          { id: 'ct', name: 'Control Tower' },
        ],
      },
      {
        id: 'frequency',
        title: 'Session Frequency',
        options: [
          { id: 'daily', name: 'Daily' },
          { id: 'weekly', name: 'Weekly' },
          { id: 'bi-weekly', name: 'Bi-Weekly' },
          { id: 'monthly', name: 'Monthly' },
          { id: 'quarterly', name: 'Quarterly' },
        ],
      },
    ], []);

  const urlBasedFilters: Record<string, string[]> = useMemo(() => ({
    department: departmentFilters,
    sessionType: sessionTypeFilters,
    frequency: frequencyFilters,
  }), [departmentFilters, sessionTypeFilters, frequencyFilters]);

  // Format events for FullCalendar with department colors
  const formattedEvents = filteredSessions.map(session => {
    const colors = departmentColors[session.department] || { bg: '#1A2E6E', border: '#1A2E6E' };

    return {
      id: session.id,
      title: `${session.title} - ${session.location}`,
      start: session.start,
      end: session.end,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: '#FFFFFF',
      extendedProps: {
        session: session,
      },
    };
  });

  const handleEventClick = (info: any) => {
    setSelectedSession(info.event.extendedProps.session);
  };

  const handleViewChange = (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    setCalendarView(view);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      retro: 'Retro',
      cws: 'CWS',
      scrum: 'Scrum',
      townhall: 'Townhall',
      wr: 'Working Room',
      ct: 'Control Tower',
    };
    return labels[type] || type;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Mobile filter toggle */}
      <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
            aria-expanded={showFilters}
            aria-controls="filter-sidebar"
          >
            <FilterIcon size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) && (
            <button
              onClick={resetFilters}
              className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter sidebar - mobile/tablet */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-30 xl:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            id="filter-sidebar"
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={urlBasedFilters}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                isResponsive={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter sidebar - desktop */}
      <div className="hidden xl:block xl:w-1/4">
        <div className="bg-white rounded-lg shadow p-4 sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) && (
              <button
                onClick={resetFilters}
                className="text-blue-600 text-sm font-medium"
              >
                Reset All
              </button>
            )}
          </div>
          <FilterSidebar
            filters={urlBasedFilters}
            filterConfig={filterConfig}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            isResponsive={false}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="xl:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sessions ({filteredSessions.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`px-3 py-1 text-sm rounded-md ${
                calendarView === 'dayGridMonth'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`px-3 py-1 text-sm rounded-md ${
                calendarView === 'timeGridWeek'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange('timeGridDay')}
              className={`px-3 py-1 text-sm rounded-md ${
                calendarView === 'timeGridDay'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <FullCalendar
            key={calendarView}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={calendarView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            events={formattedEvents}
            eventClick={handleEventClick}
            height="auto"
            aspectRatio={calendarView === 'timeGridDay' ? 1.5 : 1.8}
            dayMaxEvents={calendarView === 'dayGridMonth' ? 3 : true}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            eventClassNames="rounded-md overflow-hidden"
            dayCellClassNames="hover:bg-gray-50"
            eventDisplay="block"
            eventTextColor="#FFFFFF"
          />
        </div>

        {/* Department Legend */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Department Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {departments.map((dept) => {
              const colors = departmentColors[dept] || { bg: '#1A2E6E', border: '#1A2E6E' };
              return (
                <div key={dept} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span className="text-sm text-gray-700">{dept}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session list */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {filteredSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sessions found</p>
            ) : (
              filteredSessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{session.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {session.start.toLocaleDateString()} at{' '}
                        {session.start.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {getTypeLabel(session.type)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {session.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};
