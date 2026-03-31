/**
 * DWS AI Assistant — knowledge base for DQ and the Digital Workspace.
 * Used by DWSChatWidget to answer questions about the platform, journeys, and ways of working.
 */

export interface DWSKnowledgeEntry {
  summary: string;
  details: string;
  related?: string[];
  /** Optional next-step or CTA text */
  nextStep?: string;
}

export type DWSKnowledgeMap = Record<string, DWSKnowledgeEntry>;

/** Keywords/phrases that map to each topic (lowercased for matching). */
export interface TopicTriggers {
  topicId: string;
  keywords: string[];
}

/** Greeting / small-talk replies in DWS tone. */
export const DWS_GREETINGS: Record<string, string[]> = {
  hi: [
    "Hi! I'm your DWS AI Assistant. What can I help you with in the Digital Workspace today?",
    "Hi there! Ask me anything about DQ and the Digital Workspace.",
    "Hey! I can help you with onboarding, services, learning, or where to find things in DWS.",
  ],
  hello: [
    "Hello! I'm here to help with anything about DQ and the Digital Workspace.",
    "Hello! What can I help you find in DWS today?",
    "Hello there! Ask me about onboarding, IT or HR requests, courses, or the directory.",
  ],
  hey: [
    "Hey! I'm your DWS assistant. How can I help?",
    "Hey there! Ask me about the platform, services, learning, or getting started.",
    "Hey! What do you want to know about DQ or DWS?",
  ],
  thanks: [
    "You're welcome! If you need anything else about DWS or DQ, just ask.",
    "Happy to help. Anything else you want to know about the Digital Workspace?",
    "Anytime! Ask me more about DWS whenever you need.",
  ],
  "thank you": [
    "You're welcome! Happy to help. Come back anytime you have questions about the Digital Workspace.",
    "Glad that helped. Want help with anything else in DWS?",
    "You're welcome! If you need more help, I'm here.",
  ],
  bye: [
    "Bye! If you need help again, open this chat or use the hero search on the home page.",
    "Take care! Come back anytime you need help with DWS.",
    "See you later! Ask me about DWS anytime.",
  ],
  goodbye: [
    "Goodbye! Remember—you can always ask me about DWS, onboarding, or any DQ tool.",
    "Goodbye! I'm here whenever you need help with the Digital Workspace.",
    "All the best! Come back if you need anything about DQ or DWS.",
  ],
  "good morning": [
    "Good morning! I'm your DWS AI Assistant. What can I help you with today?",
    "Good morning! Ask me about onboarding, services, learning, or DQ updates.",
  ],
  "good afternoon": [
    "Good afternoon! How can I help you with the DQ Digital Workspace today?",
    "Good afternoon! What can I help you find in DWS?",
  ],
  "good evening": [
    "Good evening! I'm here to help with anything about DWS and DQ.",
    "Good evening! Ask me about the platform, onboarding, or services.",
  ],
};

/** Single line “what is DWS / what is DQ” for quick answers. */
export const DWS_QUICK_FACTS: Record<string, string> = {
  dws: "DWS is the DQ Digital Workspace—one trusted hub for tools, requests, learning, and collaboration so every Qatalyst can move work forward, fast.",
  dq: "DQ (Digital Qatalyst) is a digital transformation company. We build smart workspaces and productivity platforms. Studios in UAE, KSA, and Kenya; we combine governance, operations, and platforms into one ecosystem.",
  "digital workspace": "The Digital Workspace (DWS) is your one place for tools, service requests, learning, and collaboration at DQ. Everything you need to get started, work smarter, and unlock progress is here.",
  qatalyst: "Qatalyst is what we call our people—everyone who works at Digital Qatalyst (DQ). The Digital Workspace (DWS) is built so every Qatalyst can move work forward, fast.",
};

/** Full knowledge entries: topicId -> { summary, details, related?, nextStep? }. */
export const DWS_KNOWLEDGE: DWSKnowledgeMap = {
  /* ---- Platform overview ---- */
  what_is_dws: {
    summary: "DWS is the DQ Digital Workspace—your one hub for tools, requests, learning, and collaboration.",
    details:
      "The Digital Workspace brings together: (1) Learning & Knowledge—understand DQ and learn; (2) Services & Enablement—get access, tools, and support; (3) Work Execution—do your work; (4) Collaboration & Communities—align, get feedback, discuss; (5) Updates & Culture—stay informed; (6) People & Organization—know who does what. Everything you need to get started, work smarter, and unlock real progress at DQ is here.",
    related: ["onboarding", "services", "learning", "work execution", "collaboration", "updates", "people"],
    nextStep: "Try: “How do I start onboarding?” or “Where do I request IT or HR services?”",
  },
  dws_offerings: {
    summary: "DWS brings everything for work into one place: learn, request, execute, collaborate, stay updated, and find people.",
    details:
      "What we have: (1) Learning & Knowledge—courses, LMS, library, guidelines, strategy, prompt library. (2) Services & Enablement—technology/IT, employee (HR/finance/admin), digital worker services, AI tools. (3) Work Execution—sessions, projects & tasks, trackers. (4) Collaboration & Communities—discussions, pulse, working events. (5) Updates & Culture—news, blogs, jobs, podcast. (6) People & Organization—directory, units, positions, associates.",
    related: ["what_is_dws", "services_enablement", "learning_knowledge", "work_execution", "collaboration_communities"],
    nextStep: "Ask me to open a specific area, e.g., “Show Services & Enablement options” or “Where is the LMS?”",
  },
  dws_benefits: {
    summary: "What you get from DWS: faster onboarding, one-stop services, guided execution, and clear visibility.",
    details:
      "Benefits include: (1) Start fast—new joiner flows, Day in DQ guidance. (2) Self-serve—single console for IT/HR/admin requests with tracking. (3) Learn continuously—LMS, tracks, guidelines, strategy. (4) Execute clearly—sessions, projects, tasks, trackers. (5) Stay aligned—news, blogs, working events, pulse. (6) Know who does what—directory, units, positions, associates.",
    related: ["onboarding", "services_enablement", "work_execution", "updates_culture", "people_organization"],
    nextStep: "Try “How do I start onboarding?” or “Where do I log an IT request?” or “Show me this week’s LMS courses.”",
  },
  dws_services_catalog: {
    summary: "Services catalog: Technology Services, Employee Services, Digital Worker Services, AI Tools, Prompt Library.",
    details:
      "Technology Services: environments, access, support, tooling. Employee Services: HR, finance, admin requests. Digital Worker Services: document writers, prompting kits, AI agents, BPM helpers. AI Tools: copilots and automation. Prompt Library: reusable prompts and patterns.",
    related: ["technology_services", "employee_services", "digital_worker", "ai_tools", "prompt_library"],
    nextStep: "Ask “Open Technology Services” or “Where’s the HR leave policy?” or “Show Digital Worker services.”",
  },
  dws_get_help: {
    summary: "Need help? Use this chatbot or the Services & Enablement center for tracked requests.",
    details:
      "For quick answers, ask me. For tracked issues, open Services & Enablement → Technology (IT) or Employee (HR/finance/admin). For learning questions, open Learning & Knowledge → Library/LMS. For who-does-what, use the Work Directory.",
    related: ["services_enablement", "technology_services", "employee_services", "directory"],
    nextStep: "Say “Open an IT request”, “Find HR leave policy”, or “Who handles access requests?”",
  },
  what_is_dq: {
    summary: "DQ (Digital Qatalyst) is a digital transformation company focused on smart workspaces and productivity platforms.",
    details:
      "Digital Qatalyst has studios in UAE, KSA, and Kenya. We combine governance, operations, and platforms into one ecosystem. The DQ Digital Workspace (DWS) is our internal platform so every Qatalyst can move work forward, fast—tools, requests, learning, and collaboration in one place.",
    related: ["DWS", "onboarding", "people"],
    nextStep: "Ask “What is DWS?” or “How do I get started at DQ?”",
  },

  /* ---- Journey 1: Learning & Knowledge ---- */
  learning_knowledge: {
    summary: "Learning & Knowledge is where you understand DQ and build skills.",
    details:
      "You get: Library (glossaries, FAQs, playbooks), Courses & Curricula (LMS across GHC, 6xD, DWS, DXP), Learning Tracks, Reviews for courses and bootcamps, Knowledge Centre (delivery blueprints for 6xD, DevOps, DBP, DXP, DWS), Guidelines (standards and ways of working), Strategy (DQ journey, 6xD, initiatives), and the Prompt Library (AI prompts and patterns).",
    related: ["Library", "Courses", "LMS", "Guidelines", "Strategy", "Prompt Library", "Knowledge Centre"],
    nextStep: "Go to Learning & Knowledge on the home page, or ask “Where are the LMS courses?” or “What’s in the Library?”",
  },
  library: {
    summary: "The Library has glossaries, FAQs, playbooks, and reference resources for everyday work.",
    details:
      "Browse glossaries, FAQs, playbooks, and reference materials. It’s part of Learning & Knowledge. You can reach it from the Guides/Marketplace area under the Library or glossary tab.",
    related: ["glossary", "FAQs", "playbooks", "Knowledge Centre", "Guidelines"],
    nextStep: "On the home page, open Learning & Knowledge and choose Library, or go to the guides/marketplace and open the glossary/FAQs.",
  },
  courses: {
    summary: "Courses & Curricula cover core and advanced LMS learning across GHC, 6xD, DWS, DXP, and key tools.",
    details:
      "Explore LMS curricula and learning tracks tailored to roles, journeys, and competencies. You can also see reviews and feedback on courses and bootcamps. Access via Learning & Knowledge or the learning/courses area.",
    related: ["LMS", "learning tracks", "GHC", "6xD", "reviews"],
    nextStep: "Use “Courses & Curricula” or “Learning Tracks” from the home page, or go to the learning/courses section.",
  },
  lms: {
    summary: "The LMS is where you find courses, curricula, and learning tracks at DQ.",
    details:
      "The Learning Management System (LMS) hosts courses and learning tracks across GHC, 6xD, DWS, DXP, and key tools. You can explore courses, follow learning paths, and see reviews. It’s part of Learning & Knowledge.",
    related: ["courses", "learning tracks", "reviews", "Learning & Knowledge"],
    nextStep: "From the home page, open Learning & Knowledge → Courses & Curricula or Learning Tracks, or go to the learning/courses area.",
  },
  guidelines: {
    summary: "Guidelines are official standards, governance models, and ways of working that guide execution across DQ.",
    details:
      "Guidelines cover how we work—attendance, WFH, dress code, agenda scheduling, RAID, rescue shifts, biometrics, asset maintenance, Azure DevOps, and more. They’re part of Learning & Knowledge and available in the Guides/Marketplace under the guidelines tab.",
    related: ["Library", "Strategy", "ways of working", "governance"],
    nextStep: "Open Learning & Knowledge → Guidelines on the home page, or go to the guides/marketplace and select Guidelines.",
  },
  strategy: {
    summary: "Strategy helps you understand DQ’s journey, 6xD, initiatives, clients, and operating models.",
    details:
      "The Strategy area covers vision, mission, 6xD, competencies, agile (TMS, SOS, Flows, 6xD), House of Values, and how we align. It’s part of Learning & Knowledge and available under the strategy tab in guides.",
    related: ["vision", "mission", "6xD", "competencies", "agile", "House of Values"],
    nextStep: "Open Learning & Knowledge → Strategy on the home page, or go to the guides/marketplace and open Strategy.",
  },
  prompt_library: {
    summary: "The Prompt Library holds curated, reusable AI prompts and patterns to accelerate delivery and decision-making.",
    details:
      "Use it to learn how AI prompting is used across DQ—better thinking, delivery, and everyday digital work. It lives under Services & Enablement (Services Center → Prompt Library) and is linked from the AI Prompting page.",
    related: ["AI prompting", "Digital Worker", "AI tools", "Services & Enablement"],
    nextStep: "Go to the AI Prompting page from the lead/apply section, or Services Center → Prompt Library.",
  },
  knowledge_centre: {
    summary: "The Knowledge Centre (blueprints) helps you apply delivery blueprints for 6xD, DevOps, DBP, DXP, and DWS execution.",
    details:
      "It’s part of Learning & Knowledge. You’ll find blueprints and reference material for how we design, build, and deliver. Access via Learning & Knowledge → Knowledge Centre or the blueprints tab in guides.",
    related: ["Library", "Strategy", "blueprints", "6xD", "DBP", "DXP"],
    nextStep: "Open Learning & Knowledge → Knowledge Centre on the home page, or the blueprints section in guides.",
  },

  /* ---- Journey 2: Services & Enablement ---- */
  services_enablement: {
    summary: "Services & Enablement is where you get access, tools, and support.",
    details:
      "Technology Services: environments, access, support, and tooling for DQ platforms. Employee Services: finance, HR, and admin requests through one trackable console. Digital Worker Services: Doc Writers, prompting kits, AI tools, agents, and BPM helpers. AI Tools: copilots and automation for execution and delivery.",
    related: ["Technology Services", "Employee Services", "Digital Worker", "AI Tools", "Services Center"],
    nextStep: "Use “Services & Enablement” on the home page, or go to the Services Center and pick Technology, Employee, or Digital Worker.",
  },
  technology_services: {
    summary: "Technology Services cover environments, access, support, and tooling for DQ technology platforms.",
    details:
      "Request environments, access, support, and tooling through the Services Center. It’s under Services & Enablement → Technology Services.",
    related: ["IT", "access", "environments", "Services Center", "Employee Services"],
    nextStep: "Go to home → Services & Enablement → Technology Services, or Services Center → Technology tab.",
  },
  employee_services: {
    summary: "Employee Services let you submit finance, HR, and admin requests through one trackable console.",
    details:
      "Submit finance, HR, and admin requests (e.g. leave, policies, expenses) in one place. Part of Services & Enablement; access via Services Center → Employee Services.",
    related: ["HR", "finance", "admin", "leave", "policy", "Services Center"],
    nextStep: "Open Services & Enablement → Employee Services on the home page, or Services Center → Business/Employee tab.",
  },
  digital_worker: {
    summary: "Digital Worker Services include Doc Writers, prompting kits, AI tools, agents, and BPM helpers to speed up delivery.",
    details:
      "Use Document Writers, prompting kits, AI tools, AI agents, and BPM 4.0 helpers. All part of Services & Enablement; reach them via Services Center → Digital Worker.",
    related: ["AI tools", "Prompt Library", "AI prompting", "BPM", "Services & Enablement"],
    nextStep: "Go to Services & Enablement → Digital Worker Services, or Services Center → Digital Worker tab.",
  },
  ai_tools: {
    summary: "AI Tools are copilots and automation that support execution, automation, and delivery across DQ.",
    details:
      "They sit under Services & Enablement and Services Center. Use them together with the Prompt Library and Digital Worker services for better prompting and day-to-day work.",
    related: ["Digital Worker", "Prompt Library", "AI prompting", "Services & Enablement"],
    nextStep: "Open Services & Enablement → AI Tools or Digital Worker Services, or the AI Prompting page.",
  },
  it_request: {
    summary: "IT and technology requests are handled through Technology Services in the Services Center.",
    details:
      "Open the Services Center (Services & Enablement on the home page) and use the Technology tab to request environments, access, support, or tooling. You can track requests there too.",
    related: ["Technology Services", "Services Center", "access", "support"],
    nextStep: "Go to home → Services & Enablement → Technology Services, or Services Center → Technology.",
  },
  hr_request: {
    summary: "HR, leave, and policy requests go through Employee Services in the Services Center.",
    details:
      "Use Services & Enablement → Employee Services (or Services Center → Business/Employee tab) to submit HR, finance, and admin requests—e.g. leave, policies, expenses. Everything is tracked in one console.",
    related: ["Employee Services", "leave", "policy", "finance", "Services Center"],
    nextStep: "Open Services & Enablement → Employee Services, or Services Center → Employee/Business tab.",
  },

  /* ---- Journey 3: Work Execution ---- */
  work_execution: {
    summary: "Work Execution is where you do the work—sessions, projects, tasks, and trackers.",
    details:
      "Work Sessions: plan and run daily/weekly sessions, reviews, retros, and check-ins. Projects & Tasks: organize projects, tasks, and boards so work stays visible and on track. Trackers: follow statuses, categories, and live updates across activities and workflows. Some areas may be “Coming soon” and linked from the home page.",
    related: ["work sessions", "projects", "tasks", "trackers", "activities"],
    nextStep: "On the home page, open Work Execution and choose Work Sessions, Projects & Tasks, or Trackers.",
  },
  work_sessions: {
    summary: "Work Sessions help you plan and run daily and weekly work sessions, reviews, retros, and check-ins.",
    details:
      "They’re part of Work Execution. Use them to keep routines visible and aligned. Access via home → Work Execution → Work Sessions.",
    related: ["projects", "tasks", "trackers", "Work Execution"],
    nextStep: "Go to home → Work Execution → Work Sessions.",
  },
  projects_tasks: {
    summary: "Projects & Tasks help you organize projects, tasks, and boards so work stays visible and on track.",
    details:
      "Part of Work Execution. You can manage work items and boards in one place. Access via home → Work Execution → Projects & Tasks.",
    related: ["work sessions", "trackers", "Work Execution"],
    nextStep: "Go to home → Work Execution → Projects & Tasks.",
  },
  trackers: {
    summary: "Trackers let you follow statuses, categories, and live updates across activities and workflows.",
    details:
      "They’re part of Work Execution. Use them to see progress and status at a glance. Access via home → Work Execution → Trackers.",
    related: ["work sessions", "projects", "tasks", "Work Execution"],
    nextStep: "Go to home → Work Execution → Trackers.",
  },

  /* ---- Journey 4: Collaboration & Communities ---- */
  collaboration_communities: {
    summary: "Collaboration & Communities is where you align, get feedback, and discuss.",
    details:
      "Discussions: open spaces for DNA practices, learnings, Q&A, and team topics. Pulse: quick polls and surveys for team sentiment and feedback. Working Events: upcoming events, townhalls, and experience sessions across DQ. Some features may be “Coming soon” and linked from the home page.",
    related: ["Discussions", "Pulse", "Working Events", "communities", "Q Forum"],
    nextStep: "On the home page, open Collaboration & Communities and choose Discussions, Pulse, or Working Events.",
  },
  discussions: {
    summary: "Discussions are open spaces for DNA practices, learnings, Q&A, and team topics.",
    details:
      "Part of Collaboration & Communities. Use them for forums, topics, and practice-based conversation. Access via home → Collaboration & Communities → Discussions.",
    related: ["Pulse", "Working Events", "Q Forum", "communities"],
    nextStep: "Go to home → Collaboration & Communities → Discussions.",
  },
  pulse: {
    summary: "Pulse gives you quick polls and surveys to capture team sentiment and feedback.",
    details:
      "It’s part of Collaboration & Communities. Use it for fast feedback and check-ins. Access via home → Collaboration & Communities → Pulse.",
    related: ["Discussions", "Working Events", "Collaboration & Communities"],
    nextStep: "Go to home → Collaboration & Communities → Pulse.",
  },
  events: {
    summary: "Working Events include townhalls, experience sessions, and other events across DQ.",
    details:
      "Discover upcoming events and calendars in Collaboration & Communities → Working Events. You’ll also see events and podcasts in Stay Ahead / Knowledge Hub.",
    related: ["Working Events", "townhalls", "Collaboration & Communities", "Podcast"],
    nextStep: "Open Collaboration & Communities → Working Events on the home page, or check Stay Ahead / Knowledge Hub.",
  },

  /* ---- Journey 5: Updates & Culture ---- */
  updates_culture: {
    summary: "Updates & Culture is where you stay informed—news, blogs, events, and jobs.",
    details:
      "News & Announcements: official DQ news, platform releases, and org updates. Blogs & Stories: stories and perspectives from teams and leaders. Job Openings: open roles and internal opportunities. You’ll find these under Opportunities/Marketplace and in the Knowledge Hub (News, Podcast).",
    related: ["News", "Blogs", "Job Openings", "Podcast", "Stay Ahead"],
    nextStep: "On the home page, open Updates & Culture or go to Marketplace/Opportunities and Knowledge Hub.",
  },
  news: {
    summary: "News & Announcements bring you official DQ news, platform releases, and important org updates.",
    details:
      "Part of Updates & Culture. Access via Opportunities/Marketplace or the Knowledge Hub (News tab).",
    related: ["Blogs", "Job Openings", "Updates & Culture", "Knowledge Hub"],
    nextStep: "Go to home → Updates & Culture → News, or Knowledge Hub → News, or Marketplace → Opportunities.",
  },
  blogs: {
    summary: "Blogs & Stories are updates and perspectives from teams and leaders across DQ.",
    details:
      "Part of Updates & Culture. You’ll find them in Marketplace/Opportunities (Insights) and in the Knowledge Hub.",
    related: ["News", "Job Openings", "Updates & Culture", "Knowledge Hub"],
    nextStep: "Open Updates & Culture → Blogs & Stories, or Marketplace → Opportunities → Insights.",
  },
  jobs: {
    summary: "Job Openings let you browse open roles and internal opportunities across DQ.",
    details:
      "Part of Updates & Culture. Access via Marketplace/Opportunities or the dedicated job-openings area.",
    related: ["News", "Blogs", "Updates & Culture", "opportunities"],
    nextStep: "Go to home → Updates & Culture → Job Openings, or Marketplace → Opportunities.",
  },
  podcast: {
    summary: "The Podcast tab in Stay Ahead / Knowledge Hub hosts podcasts and audio content from DQ.",
    details:
      "Stay Ahead with Workspace Insights includes News and Podcast. Use the Podcast tab for audio series and discussions. It’s in the Knowledge Hub / Stay Ahead section on the home page.",
    related: ["News", "Events", "Knowledge Hub", "Updates & Culture"],
    nextStep: "On the home page, open Stay Ahead / Knowledge Hub and switch to the Podcast tab.",
  },

  /* ---- Journey 6: People & Organization ---- */
  people_organization: {
    summary: "People & Organization helps you see who does what—units, positions, and associates.",
    details:
      "Units: sectors, mandates, priorities, and performance. Positions: role descriptions and key responsibilities. Associates: profiles, contacts, skills, and performance details. Access via Work Directory or the People & Organization section on the home page.",
    related: ["Units", "Positions", "Associates", "Work Directory", "directory"],
    nextStep: "Open People & Organization on the home page, or go to the Work Directory (Units, Positions, Associates).",
  },
  directory: {
    summary: "The Work Directory shows units, positions, and associates so you can find who does what.",
    details:
      "Explore units (sectors, mandates), browse positions (roles, responsibilities), and view associate profiles (contacts, skills). Part of People & Organization; often under Work Directory or marketplace/work-directory.",
    related: ["Units", "Positions", "Associates", "People & Organization"],
    nextStep: "Go to home → People & Organization, or open the Work Directory (Units, Positions, Associates tabs).",
  },
  units: {
    summary: "Units are sectors, mandates, priorities, and performance metrics at DQ.",
    details:
      "Part of People & Organization. Browse them in the Work Directory under the Units tab.",
    related: ["Positions", "Associates", "directory", "People & Organization"],
    nextStep: "Open Work Directory → Units, or People & Organization → Units.",
  },
  positions: {
    summary: "Positions are role descriptions and key responsibilities at DQ.",
    details:
      "Part of People & Organization. Browse them in the Work Directory under the Positions tab.",
    related: ["Units", "Associates", "directory", "People & Organization"],
    nextStep: "Open Work Directory → Positions, or People & Organization → Positions.",
  },
  associates: {
    summary: "Associates are people at DQ—profiles, contacts, skills, and performance details.",
    details:
      "Part of People & Organization. View them in the Work Directory under the Associates tab.",
    related: ["Units", "Positions", "directory", "People & Organization"],
    nextStep: "Open Work Directory → Associates, or People & Organization → Associates.",
  },

  /* ---- Onboarding & getting started ---- */
  onboarding: {
    summary: "Onboarding is how you start your DQ journey and get productive from day one.",
    details:
      "Start Your Onboarding Journey from the lead/apply section or home: “Begin Onboarding” takes you to the onboarding flow. You’ll get guided tracks, LMS starter courses, and access to the Knowledge Hub. DWS stages (e.g. Starting) include onboarding guides and starter learning.",
    related: ["Start Your DQ Journey", "LMS", "Knowledge Hub", "Services & Enablement"],
    nextStep: "Use “Start Your DQ Journey” → “Begin Onboarding” on the landing page, or go to /onboarding/welcome.",
  },
  get_started: {
    summary: "To get started at DQ, begin onboarding and explore the six journey areas.",
    details:
      "(1) Start Your Onboarding Journey (Begin Onboarding). (2) Use Learning & Knowledge for courses, library, and guidelines. (3) Use Services & Enablement for IT, HR, and digital worker tools. (4) Work Execution for sessions, projects, trackers. (5) Collaboration & Communities for discussions, pulse, events. (6) Updates & Culture for news, blogs, jobs. (7) People & Organization for the directory.",
    related: ["onboarding", "Learning & Knowledge", "Services & Enablement", "Work Execution"],
    nextStep: "Click “Begin Onboarding” from “Start Your DQ Journey,” then explore the six sections on the home page.",
  },
  support: {
    summary: "For support and guidance, use Employee Services (HR/admin) and Technology Services (IT) in the Services Center.",
    details:
      "Employee Services: HR, finance, admin. Technology Services: IT, access, environments. You can also use the “Get Support & Guidance” flow from the landing section if it’s shown. The DWS chatbot (me) can point you to the right place for any of these.",
    related: ["Technology Services", "Employee Services", "Services Center", "IT request", "HR request"],
    nextStep: "Go to Services & Enablement on the home page, then Technology Services or Employee Services, or open the Services Center.",
  },
  ai_prompting: {
    summary: "AI Prompting at DQ is about using prompts and patterns to improve thinking, delivery, and everyday digital work.",
    details:
      "The AI Prompting page explains how we use prompting across DQ. The Prompt Library (under Services Center) has curated, reusable AI prompts and patterns. Digital Worker services include prompting kits and AI tools. Use “Learn AI Prompting” from the lead/apply section to open the AI Prompting page.",
    related: ["Prompt Library", "Digital Worker", "AI tools", "Services & Enablement"],
    nextStep: "Click “Learn AI Prompting” from the landing cards, or go to the AI Prompting page and Services Center → Prompt Library.",
  },
};

/** Trigger phrases (lowercase) per topic. First match wins; order matters for overlaps. */
export const DWS_TOPIC_TRIGGERS: TopicTriggers[] = [
  { topicId: "what_is_dq", keywords: ["what is dq", "what is digital qatalyst", "who is dq", "tell me about dq", "digital qatalyst"] },
  { topicId: "what_is_dws", keywords: ["what is dws", "what is digital workspace", "what is the digital workspace", "explain dws", "what does dws"] },
  { topicId: "dws_offerings", keywords: ["what do you have", "what we have", "what dws has", "what is included", "features of dws", "capabilities"] },
  { topicId: "dws_benefits", keywords: ["what you get", "benefits", "value", "why use dws", "what do i get"] },
  { topicId: "dws_services_catalog", keywords: ["services catalog", "service catalog", "what services", "list of services", "catalog", "offerings"] },
  { topicId: "guidelines", keywords: ["guidelines", "policies", "dress code", "leave policy", "wfh", "shifts", "ado", "devops task guidelines"] },
  { topicId: "learning_knowledge", keywords: ["learning and knowledge", "learning & knowledge", "learn something", "understand dq", "learning", "knowledge"] },
  { topicId: "library", keywords: ["library", "glossary", "glossaries", "faq", "faqs", "playbook", "playbooks", "reference"] },
  { topicId: "courses", keywords: ["courses", "curricula", "curriculum", "learning tracks", "lms courses", "this week's courses", "week's lms"] },
  { topicId: "lms", keywords: ["lms", "learning management", "learning path", "learning paths"] },
  { topicId: "guidelines", keywords: ["guidelines", "guideline", "policy", "policies", "wfh", "attendance", "dress code", "raid", "rescue shift", "biometric", "azure devops", "agenda scheduling"] },
  { topicId: "strategy", keywords: ["strategy", "vision", "mission", "6xd", "six digital", "competencies", "house of values", "agile", "ghc"] },
  { topicId: "prompt_library", keywords: ["prompt library", "prompt library", "ai prompts", "prompts"] },
  { topicId: "knowledge_centre", keywords: ["knowledge centre", "knowledge center", "blueprint", "blueprints", "dbp", "dxp", "devops"] },
  { topicId: "services_enablement", keywords: ["services and enablement", "services & enablement", "services", "enablement", "service request"] },
  { topicId: "technology_services", keywords: ["technology services", "it service", "it request", "open an it", "technology request", "environments", "access request"] },
  { topicId: "employee_services", keywords: ["employee services", "hr request", "hr leave", "hr policy", "leave policy", "finance", "admin request", "hr services"] },
  { topicId: "digital_worker", keywords: ["digital worker", "doc writer", "doc writers", "bpm", "ai agents"] },
  { topicId: "ai_tools", keywords: ["ai tools", "ai tool", "copilot", "copilots"] },
  { topicId: "it_request", keywords: ["it request", "it ticket", "technology request", "open an it service"] },
  { topicId: "hr_request", keywords: ["hr request", "hr leave", "where's the hr", "leave policy", "hr policy"] },
  { topicId: "work_execution", keywords: ["work execution", "work execution", "doing work", "sessions", "projects", "tasks", "trackers"] },
  { topicId: "work_sessions", keywords: ["work sessions", "daily session", "weekly session", "retro", "reviews", "check-in"] },
  { topicId: "projects_tasks", keywords: ["projects and tasks", "projects & tasks", "projects", "tasks", "boards"] },
  { topicId: "trackers", keywords: ["trackers", "tracker", "status", "workflow"] },
  { topicId: "collaboration_communities", keywords: ["collaboration", "communities", "collaboration and communities", "discussion", "pulse", "events"] },
  { topicId: "discussions", keywords: ["discussions", "discussion", "forums", "q forum", "dna", "practices"] },
  { topicId: "pulse", keywords: ["pulse", "polls", "surveys", "sentiment"] },
  { topicId: "events", keywords: ["events", "working events", "townhall", "town halls", "experience session"] },
  { topicId: "updates_culture", keywords: ["updates and culture", "updates & culture", "updates", "culture", "what's happening"] },
  { topicId: "news", keywords: ["news", "announcements", "dq news"] },
  { topicId: "blogs", keywords: ["blogs", "stories", "insights"] },
  { topicId: "jobs", keywords: ["jobs", "job openings", "open roles", "opportunities", "internal roles"] },
  { topicId: "podcast", keywords: ["podcast", "podcasts", "stay ahead"] },
  { topicId: "people_organization", keywords: ["people and organization", "people & organization", "people", "organization", "who does what"] },
  { topicId: "directory", keywords: ["directory", "work directory", "find someone", "who does what"] },
  { topicId: "units", keywords: ["units", "sectors", "mandates"] },
  { topicId: "positions", keywords: ["positions", "roles", "role description"] },
  { topicId: "associates", keywords: ["associates", "associate profiles", "contacts", "colleagues"] },
  { topicId: "onboarding", keywords: ["onboarding", "onboard", "start my journey", "start journey", "begin onboarding", "day in dq", "new joiner"] },
  { topicId: "get_started", keywords: ["get started", "how do i start", "where do i start", "start here", "first day"] },
  { topicId: "support", keywords: ["support", "get support", "guidance", "help me", "who can help"] },
  { topicId: "ai_prompting", keywords: ["ai prompting", "learn ai prompting", "prompting"] },
  { topicId: "dws_get_help", keywords: ["help options", "how to get help", "need help", "where to get help", "support options"] },
];

/** Default reply when no topic matches—DWS-style and actionable. */
export const DWS_DEFAULT_REPLY =
  "I’m your DWS AI Assistant (offline mode). I didn’t find a direct match for that. You can ask me about:\n\n" +
  "• **What is DWS or DQ?** — platform and company\n" +
  "• **Onboarding** — how to start your journey / Day in DQ\n" +
  "• **Learning & Knowledge** — courses, LMS, library, guidelines, strategy\n" +
  "• **Services & Enablement** — IT, HR, digital worker, AI tools\n" +
  "• **Work Execution** — sessions, projects, tasks, trackers\n" +
  "• **Collaboration & Communities** — discussions, pulse, events\n" +
  "• **Updates & Culture** — news, blogs, jobs, podcast\n" +
  "• **People & Organization** — directory, units, positions, associates\n\n" +
  "Try: “What do I get in DWS?”, “Where do I request IT?”, “How do I start onboarding?”, or “Show this week’s LMS courses.”";

/** “Help” / “What can you do?” reply. */
export const DWS_HELP_REPLY =
  "I’m your DWS AI Assistant (offline mode) and I know the Digital Workspace end-to-end. Ask me for:\n\n" +
  "**What we have** — learning (courses, LMS, library, guidelines, strategy), services (IT/HR/admin, digital worker, AI tools, prompt library), work execution (sessions, projects/tasks, trackers), collaboration (discussions, pulse, events), updates (news, blogs, jobs, podcast), people (directory, units, positions, associates).\n\n" +
  "**What you get** — faster onboarding (Day in DQ, start journey), one-stop service requests with tracking, guided learning paths, clear work plans, alignment via news/pulse/events, visibility on who does what.\n\n" +
  "**Quick asks** — “Where do I request IT?”, “Find the HR leave policy”, “Open Digital Worker services”, “Show this week’s LMS courses”, “Explain DWS in one line.”";
