import { Event } from '../components/DQEventsCalendar';
// Helper function to create dates
const createDate = (year: number, month: number, day: number, hour: number, minute: number): Date => {
  return new Date(year, month, day, hour, minute);
};
// Current date information for creating relative dates
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
// Mock event data
export const mockEvents: Event[] = [{
  id: '1',
  title: 'Digital Qatalyst Town Hall',
  start: createDate(currentYear, currentMonth, 15, 10, 0),
  end: createDate(currentYear, currentMonth, 15, 11, 30),
  category: 'Internal',
  description: 'Quarterly company-wide meeting to discuss achievements, goals, and upcoming initiatives.',
  location: 'Main Conference Room + Zoom'
}, {
  id: '2',
  title: 'Client Onboarding: TechCorp',
  start: createDate(currentYear, currentMonth, 16, 14, 0),
  end: createDate(currentYear, currentMonth, 16, 15, 30),
  category: 'Client',
  description: 'Initial onboarding session with TechCorp to discuss project requirements and timeline.',
  location: 'Meeting Room 3 + Teams'
}, {
  id: '3',
  title: 'Advanced React Training',
  start: createDate(currentYear, currentMonth, 18, 9, 0),
  end: createDate(currentYear, currentMonth, 18, 17, 0),
  category: 'Training',
  description: 'Full-day workshop on advanced React patterns and performance optimization techniques.',
  location: 'Training Center + Zoom'
}, {
  id: '4',
  title: 'Product Launch: Analytics Dashboard 2.0',
  start: createDate(currentYear, currentMonth, 22, 13, 0),
  end: createDate(currentYear, currentMonth, 22, 15, 0),
  category: 'Launches',
  description: 'Official launch of our new Analytics Dashboard with enhanced visualization features.',
  location: 'Auditorium + YouTube Live'
}, {
  id: '5',
  title: 'Team Building: Innovation Workshop',
  start: createDate(currentYear, currentMonth, 24, 13, 0),
  end: createDate(currentYear, currentMonth, 24, 16, 0),
  category: 'Internal',
  description: 'Interactive workshop focused on fostering innovation and creative problem-solving skills.',
  location: 'Innovation Lab'
}, {
  id: '6',
  title: 'Client Review: GlobalTech',
  start: createDate(currentYear, currentMonth, 17, 11, 0),
  end: createDate(currentYear, currentMonth, 17, 12, 0),
  category: 'Client',
  description: 'Monthly progress review with GlobalTech stakeholders to present deliverables and gather feedback.',
  location: 'Virtual Meeting (Zoom)'
}, {
  id: '7',
  title: 'UX/UI Design Principles',
  start: createDate(currentYear, currentMonth, 25, 14, 0),
  end: createDate(currentYear, currentMonth, 25, 16, 0),
  category: 'Training',
  description: 'Training session covering essential UX/UI design principles and best practices.',
  location: 'Design Studio + Zoom'
}, {
  id: '8',
  title: 'Marketing Campaign Kickoff',
  start: createDate(currentYear, currentMonth, 19, 10, 0),
  end: createDate(currentYear, currentMonth, 19, 11, 30),
  category: 'Launches',
  description: 'Kickoff meeting for the Q3 marketing campaign focusing on new client acquisition.',
  location: 'Marketing Department'
}, {
  id: '9',
  title: 'Executive Strategy Meeting',
  start: createDate(currentYear, currentMonth, 21, 9, 0),
  end: createDate(currentYear, currentMonth, 21, 12, 0),
  category: 'Internal',
  description: 'Quarterly strategy meeting with executive leadership to align on company direction and priorities.',
  location: 'Executive Boardroom'
}, {
  id: '10',
  title: 'Client Workshop: Data Analytics',
  start: createDate(currentYear, currentMonth, 26, 13, 0),
  end: createDate(currentYear, currentMonth, 26, 16, 0),
  category: 'Client',
  description: 'Interactive workshop with client teams on leveraging our data analytics platform effectively.',
  location: 'Client HQ + Teams'
}, {
  id: '11',
  title: 'Cybersecurity Best Practices',
  start: createDate(currentYear, currentMonth, 28, 10, 0),
  end: createDate(currentYear, currentMonth, 28, 12, 0),
  category: 'Training',
  description: 'Mandatory training session on cybersecurity awareness and best practices for all employees.',
  location: 'Training Room B + Zoom'
}, {
  id: '12',
  title: 'New Feature Release: AI Assistant',
  start: createDate(currentYear, currentMonth, 30, 15, 0),
  end: createDate(currentYear, currentMonth, 30, 16, 30),
  category: 'Launches',
  description: 'Launch of our new AI Assistant feature with demo and Q&A session.',
  location: 'Demo Space + YouTube Live'
}];