-- ============================================
-- Complete LMS Migration SQL
-- Generated from lmsCourseDetails.ts
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Supabase Migration: LMS Data Schema and Population
-- This migration creates the LMS schema and populates it from TypeScript data
-- Generated for DQ Intranet Learning Management System

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS curriculum_items CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Create courses table
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    category TEXT NOT NULL,
    delivery_mode TEXT NOT NULL,
    duration TEXT NOT NULL,
    level_code TEXT NOT NULL,
    department TEXT[] NOT NULL DEFAULT '{}',
    locations TEXT[] NOT NULL DEFAULT '{}',
    audience TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    outcomes TEXT[] NOT NULL DEFAULT '{}',
    course_type TEXT,
    track TEXT,
    rating DECIMAL(3, 2),
    review_count INTEGER,
    testimonials JSONB,
    case_studies JSONB,
    references JSONB,
    faq JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create curriculum_items table
CREATE TABLE curriculum_items (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    item_order INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    course_slug TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create topics table
CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    curriculum_item_id TEXT NOT NULL REFERENCES curriculum_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    topic_order INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
    curriculum_item_id TEXT REFERENCES curriculum_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    type TEXT NOT NULL,
    lesson_order INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure one of the foreign keys is set
    CONSTRAINT lessons_parent_check CHECK (
        (topic_id IS NOT NULL AND curriculum_item_id IS NULL) OR
        (topic_id IS NULL AND curriculum_item_id IS NOT NULL)
    )
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_provider ON courses(provider);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_track ON courses(track);
CREATE INDEX idx_courses_course_type ON courses(course_type);
CREATE INDEX idx_curriculum_items_course_id ON curriculum_items(course_id);
CREATE INDEX idx_curriculum_items_course_slug ON curriculum_items(course_slug);
CREATE INDEX idx_topics_curriculum_item_id ON topics(curriculum_item_id);
CREATE INDEX idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX idx_lessons_curriculum_item_id ON lessons(curriculum_item_id);

-- ============================================
-- 3. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_items_updated_at
    BEFORE UPDATE ON curriculum_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- NOTE: Data population will be done via the
-- JavaScript/TypeScript migration script
-- (migrate_lms_data.js)
-- ============================================



-- ============================================
-- INSERT COURSES
-- ============================================

INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('dq-essentials', 'dq-essentials', 'DQ Essentials: How DQ Works', 'DQ HRA', 'Day in DQ', 'Video', 'Short', 'L1', '{DCO}', '{Riyadh}', '{Associate,Lead}', 'live', 'Orientation to DQ''s mission, structure, and the operating models that shape everyday work.', '{Understand DQ''s vision, DNA, and operating rhythms,See how GHC and 6xD connect to daily delivery,Know where to find core guidelines and help}', '{Explain DQ''s mission and how teams align to it,Navigate Learning Center, Guidelines, and Requests,Identify your next learning steps by role and level,Apply essentials in your first projects}', 'Course (Single Lesson)', 'Leadership Track', 4.5, 24, '[{"author":"Sarah Johnson","role":"Senior Developer","text":"How DQ shaped my work ethic: This course provided excellent insights into how DQ operates. The mission and structure clarity helped me align my work with DQ''s values from day one.","rating":5},{"author":"Ahmed Al-Mansoori","role":"Product Manager","text":"Great orientation material for new team members. Understanding the operating models has been crucial for my role.","rating":4},{"author":"Rachel Kim","role":"Engineering Lead","text":"The DQ Essentials course transformed my understanding of how teams work together. The GHC and 6xD frameworks are now central to how I lead.","rating":5}]', '[{"title":"DQ Transformation Case Study","description":"How DQ essentials were applied in a real transformation project","link":"/case-studies/dq-transformation"}]', '[{"title":"DQ Mission Statement","description":"Official DQ mission and vision documentation","link":"/references/dq-mission"}]', NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('ghc-primer', 'ghc-primer', 'GHC Primer: Collaboration & Delivery', 'DQ DTMB', 'GHC', 'Guide', 'Short', 'L2', '{DCO}', '{Riyadh}', '{Associate}', 'live', 'Golden Honeycomb Competences (GHC) that enable teaming, agile delivery, and culture at DQ.', '{GHC overview: pillars and language,7S, SoS, and DTMF at a glance,Real examples from DQ initiatives}', '{Describe each GHC pillar and its intent,Map 7S/SoS practices to your team rituals,Use DTMF for planning and retros,Choose the next GHC module to go deeper}', 'Course (Multi-Lessons)', 'Leadership Track', 4.8, 18, '[{"author":"Michael Chen","role":"Product Lead","text":"How DQ shaped my work ethic: The GHC framework completely transformed how I approach collaboration and delivery. The 7S practices are now part of my daily routine.","rating":5},{"author":"Priya Patel","role":"Senior Developer","text":"This course gave me the tools to be a better leader. The DTMF framework for planning has been a game-changer for our team.","rating":5}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('sixx-digital', 'sixx-digital', '6x Digital: Transformation Framework', 'DQ DTMA', '6x Digital', 'Video', 'Medium', 'L3', '{DBP}', '{Riyadh}', '{Associate,Lead}', 'live', 'Explore D1–D6: the six perspectives we use to scope, govern, and deliver transformation.', '{D1–D6 overview with simple visuals,Where DTMP/DTMB/DTMA fit,Link 6xD to portfolio and delivery}', '{Explain the purpose of each D (D1–D6),Relate 6xD to your initiative lifecycle,Pick the right artefacts for each phase,Plan next learning in the D6 product set}', 'Course (Multi-Lessons)', 'Leadership Track', 4.6, 15, '[{"author":"Thomas Brown","role":"Transformation Lead","text":"The 6x Digital framework has been instrumental in our transformation projects. The D1-D6 perspectives provide clear structure and governance.","rating":5},{"author":"Sophie Williams","role":"Senior Consultant","text":"Excellent course on transformation frameworks. The practical examples and artefact guidance are very helpful.","rating":4}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('dws-tools', 'dws-tools', 'Working in DWS: Tools & Daily Flow', 'Tech (Microsoft)', 'DWS', 'Hybrid', 'Long', 'L4', '{DBP}', '{Remote}', '{Associate}', 'live', 'Hands-on walkthrough of planners, dashboards, and request flows inside Digital Workspace Services.', '{Daily flow: plan → execute → review,Requests hub, trackers, and dashboards,Tips for speed and quality in DWS}', '{Run your day in DWS with confidence,Use standardized requests and templates,Read status from dashboards and reports,Troubleshoot common blockers fast}', 'Course (Bundles)', 'Working in DWS', 4.7, 32, '[{"author":"James Wilson","role":"Technical Lead","text":"How DQ shaped my work ethic: Working in DWS taught me the importance of structured workflows and clear communication. The daily flow practices have made me more efficient and organized.","rating":5},{"author":"Emma Thompson","role":"Project Manager","text":"The DWS tools course transformed how I manage projects. The dashboards and request flows have streamlined our entire workflow.","rating":4}]', NULL, NULL, '[{"question":"What are the requirements for taking this track?","answer":"This track is designed for team members who work with Digital Workspace Services (DWS). Basic familiarity with DQ tools and workflows is recommended. You should have access to DWS systems, which will be provided if needed."},{"question":"How long does it take to complete the Working in DWS track?","answer":"The Working in DWS track can be completed at your own pace. Most participants finish the core content within 2-4 weeks, depending on the time dedicated. The track includes hands-on exercises and practical applications."},{"question":"Do I need prior experience with DWS?","answer":"No prior experience is required. The track starts with DWS basics and progressively covers more advanced topics. However, having basic familiarity with DQ workflows will help you get the most out of the track."},{"question":"What tools and systems are covered?","answer":"The track covers planners, dashboards, request flows, trackers, and other essential DWS tools. You will learn how to navigate these systems and use them effectively in your daily work."},{"question":"Is there support available if I encounter issues?","answer":"Yes, each course includes support resources and documentation. You can also reach out to the Tech (Microsoft) team or your DWS administrator for assistance with specific issues or questions."}]');
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('dxp-basics', 'dxp-basics', 'DXP Basics: Content & Components', 'DQ DTMA', 'DXP', 'Guide', 'Medium', 'L2', '{DBP}', '{Dubai}', '{Associate}', 'live', 'Composable content, blueprints, and product patterns in the DQ Experience Platform.', '{Core content types and relationships,Reusable components and patterns,Blueprint-first delivery approach}', '{Model content with the right types,Assemble pages using approved components,Follow blueprint conventions for reuse,Plan a safe DXP change and release}', 'Course (Single Lesson)', NULL, 4.4, 12, '[{"author":"Alex Rivera","role":"Frontend Developer","text":"DXP Basics helped me understand the content modeling approach. The blueprint patterns are now part of my daily workflow.","rating":4},{"author":"Jessica Taylor","role":"Content Strategist","text":"Great introduction to DXP content architecture. The composable content concepts are well explained.","rating":5}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('git-vercel', 'git-vercel', 'Key Tools: Git & Vercel for DQ Projects', 'Tech (Microsoft)', 'Key Tools', 'Video', 'Short', 'L5', '{DBP}', '{Dubai}', '{Associate}', 'live', 'DQ''s way of branching, committing, reviewing, and deploying with Vercel.', '{Branch strategy and commit hygiene,PR reviews with guardrails,Preview deployments on Vercel}', '{Create clean branches and atomic commits,Run PR reviews with required checks,Trigger preview/live deploys safely,Rollback and hotfix with confidence}', 'Course (Single Lesson)', NULL, 4.7, 28, '[{"author":"Kevin Park","role":"DevOps Engineer","text":"How DQ shaped my work ethic: This course on Git and Vercel established best practices that I use in every project. The deployment workflow is now second nature.","rating":5},{"author":"Maria Garcia","role":"Full Stack Developer","text":"Excellent guide to DQ''s Git workflow. The branch strategy and PR process are clearly explained.","rating":4}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('cursor-ai', 'cursor-ai', 'Cursor AI for Daily Dev', 'Tech (Ardoq)', 'Key Tools', 'Video', 'Short', 'L3', '{DBP}', '{Remote}', '{Associate}', 'live', 'Use Cursor AI to accelerate delivery with safe prompts, reviews, and automation.', '{Prompt patterns for code and tests,Refactor and review with guardrails,Generate docs and changelogs}', '{Write effective development prompts,Scale reviews with AI responsibly,Automate repetitive repo tasks,Document changes as you code}', 'Course (Single Lesson)', NULL, 4.9, 35, '[{"author":"Daniel Lee","role":"Software Engineer","text":"How DQ shaped my work ethic: Cursor AI has transformed my development workflow. The prompt patterns and automation features have significantly increased my productivity.","rating":5},{"author":"Nicole Chen","role":"Tech Lead","text":"This course on Cursor AI is a must for developers. The safe prompt patterns and review guardrails are essential for responsible AI use.","rating":5},{"author":"Ryan O''Connor","role":"Senior Developer","text":"Great course on AI-assisted development. The documentation generation features are a game-changer.","rating":4}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('first-7-days', 'first-7-days', 'Your First 7 Days at DQ', 'DQ HRA', 'Day in DQ', 'Guide', 'Medium', 'L1', '{DCO}', '{Riyadh}', '{Associate}', 'live', 'Seven-day onboarding sprint that blends culture, delivery basics, and workspace tooling for every new joiner.', '{Day-by-day starter plan,Core tools checklist,Meetings and rituals you''ll use}', '{Complete the onboarding sprint,Set up tools and access correctly,Deliver a small task with guidance,Book your next learning modules}', 'Course (Multi-Lessons)', 'Onboarding', 4.9, 45, '[{"author":"David Martinez","role":"New Associate","text":"How DQ shaped my work ethic: The first 7 days program gave me everything I needed to hit the ground running. The structured approach and clear guidance made my transition seamless.","rating":5},{"author":"Lisa Anderson","role":"Software Engineer","text":"This onboarding experience is the best I''ve ever had. The day-by-day plan and tool setup checklist made it so easy to get started.","rating":5}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('governance-lite', 'governance-lite', 'Governance Lite: DCO & DBP Policies', 'DQ DTMB', 'GHC', 'Guide', 'Short', 'L2', '{DCO,DBP}', '{Riyadh}', '{Associate,Lead}', 'live', 'Lead-level governance kit for running reviews, managing risk, and aligning delivery to the mission.', '{Lightweight governance you''ll actually use,Reviews, approvals, and exceptions,Where to find official templates}', '{Apply the right review at the right time,Document decisions and exceptions,Use approved templates and trackers,Reduce risk while keeping speed}', 'Course (Single Lesson)', 'Leadership Track', 4.5, 20, '[{"author":"Robert Kim","role":"Engineering Manager","text":"Governance Lite provides exactly what I need: practical governance tools without the overhead. The templates and review processes are invaluable.","rating":5},{"author":"Amanda Foster","role":"Project Lead","text":"This course on governance has streamlined our review processes. The lightweight approach keeps us moving fast while maintaining quality.","rating":4}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('leadership-track', 'leadership-track', 'Leadership Track', 'DQ HRA', 'GHC', 'Hybrid', 'Long', 'L3', '{DCO}', '{Riyadh}', '{Lead}', 'live', 'Comprehensive leadership development track covering essential skills, frameworks, and practices for effective leadership at DQ.', '{Complete leadership journey from fundamentals to advanced,GHC frameworks and collaboration practices,DQ products and transformation methodologies,Real-world case studies and practical exercises}', '{Master leadership fundamentals using GHC,Understand DQ products and transformation frameworks,Apply leadership principles in real scenarios,Build a comprehensive leadership toolkit}', 'Course (Bundles)', 'Leadership Track', NULL, NULL, NULL, NULL, NULL, '[{"question":"What are the requirements for taking this track?","answer":"This track is designed for Lead-level team members. Prior experience with DQ fundamentals and basic understanding of GHC frameworks is recommended, though not required. The track is suitable for both new leaders and experienced leaders looking to enhance their skills."},{"question":"How long does it take to complete the Leadership Track?","answer":"The Leadership Track is designed as a comprehensive learning journey. While the duration varies based on your pace, most participants complete the track within 8-12 weeks when dedicating 5-10 hours per week to learning."},{"question":"Can I take individual courses from this track?","answer":"Yes, all courses within the Leadership Track can be taken individually. However, we recommend following the track sequence for the best learning experience, as each course builds upon the previous one."},{"question":"What happens if I get stuck on a course?","answer":"Each course includes access to support resources, discussion forums, and mentorship opportunities. You can also reach out to the course provider or your learning coordinator for assistance."},{"question":"Do I receive a certificate upon completion?","answer":"Yes, upon successful completion of all courses in the Leadership Track, you will receive a Leadership Track completion certificate that recognizes your achievement and skills development."}]');
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('onboarding-track', 'onboarding-track', 'Onboarding', 'DQ HRA', 'Day in DQ', 'Hybrid', 'Long', 'L1', '{DCO}', '{Riyadh}', '{Associate}', 'live', 'Complete onboarding experience for new team members, covering culture, tools, processes, and first tasks.', '{Seven-day onboarding sprint,Core tools and workspace setup,DQ culture and values,First task guidance and support}', '{Complete the onboarding sprint successfully,Set up all necessary tools and access,Understand DQ culture and operating models,Deliver your first task with confidence}', 'Course (Bundles)', 'Onboarding', 4.9, 58, '[{"author":"Chris Anderson","role":"New Team Member","text":"How DQ shaped my work ethic: The Onboarding track made my transition into DQ seamless. The structured approach and supportive guidance helped me feel confident from day one.","rating":5},{"author":"Sarah Mitchell","role":"Recent Hire","text":"Best onboarding experience I''ve ever had. The seven-day sprint format and comprehensive tool setup made it easy to get started.","rating":5},{"author":"Michael Chang","role":"Software Engineer","text":"The Onboarding track covers everything you need to know. The culture overview and first task guidance were particularly helpful.","rating":5}]', NULL, NULL, '[{"question":"What are the requirements for taking this track?","answer":"This track is designed for all new team members joining DQ. No prior experience is required. You will need access to DQ systems and tools, which will be provided during the onboarding process."},{"question":"How long does the onboarding track take?","answer":"The Onboarding Track is structured as a seven-day sprint, with guided activities and tasks for each day. Most new team members complete the core onboarding within the first week, with additional resources available for ongoing reference."},{"question":"What tools do I need access to before starting?","answer":"You will receive access to all necessary tools and systems as part of the onboarding process. The track includes setup guides and checklists to ensure you have everything you need to get started."},{"question":"Can I skip certain parts of the onboarding?","answer":"While the onboarding track is designed to be comprehensive, you can work with your manager or onboarding coordinator to customize your learning path based on your role and prior experience. However, we recommend completing all core modules for the best experience."},{"question":"What support is available during onboarding?","answer":"You will be assigned an onboarding buddy or mentor who can help answer questions and provide guidance. Additionally, each course includes support resources, and you can reach out to the DQ HRA team for assistance at any time."},{"question":"What happens after I complete the onboarding track?","answer":"After completing the onboarding track, you will have access to additional learning resources and can begin exploring other courses and tracks in the Learning Center. Your manager will also help you identify your next learning steps based on your role and career goals."}]');
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('ms-teams-meetings', 'ms-teams-meetings', 'Ms Teams (Meetings)', 'Tech (Microsoft)', 'Key Tools', 'Video', 'Long', 'L2', '{DBP Platform}', '{Riyadh}', '{Associate,Lead}', 'live', 'Master Microsoft Teams meetings from joining and scheduling to advanced features like webinars, live events, and immersive experiences.', '{Join and schedule meetings with ease,Advanced meeting controls and collaboration tools,Live events, webinars, and town halls,Immersive experiences and Teams Premium features}', '{Join and schedule Teams meetings effectively,Use meeting controls and collaboration features,Organize and host large-scale events,Troubleshoot common meeting issues}', 'Course (Multi-Lessons)', NULL, 4.6, 28, '[{"author":"Mohammed Al-Rashid","role":"Project Manager","text":"This course transformed how I conduct meetings in Teams. The scheduling and collaboration features have made my team more productive.","rating":5},{"author":"Sara Ahmed","role":"Team Lead","text":"Excellent coverage of Teams meeting features. The webinar and live event sections were particularly helpful for our organization.","rating":4}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('ms-teams-chat', 'ms-teams-chat', 'Ms Teams (Chat)', 'Tech (Microsoft)', 'Key Tools', 'Guide', 'Medium', 'L2', '{DBP Platform}', '{Riyadh}', '{Associate,Lead}', 'live', 'Master Microsoft Teams chat features including messaging, file sharing, group chats, and advanced collaboration tools.', '{Send and manage messages effectively,Share files, pictures, and links,Organize group chats and conversations,Use advanced chat features and commands}', '{Communicate effectively using Teams chat,Share files and collaborate in conversations,Manage chat threads and organize conversations,Use productivity features and slash commands}', 'Course (Multi-Lessons)', NULL, 4.5, 22, '[{"author":"Fatima Al-Zahra","role":"Communication Specialist","text":"This course made me much more efficient with Teams chat. The file sharing and group chat features are now second nature.","rating":5},{"author":"Khalid Hassan","role":"Team Coordinator","text":"Great overview of Teams chat capabilities. The advanced features and commands section was particularly useful.","rating":4}]', NULL, NULL, NULL);
INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES ('microsoft-teams-help-learning', 'microsoft-teams-help-learning', 'Microsoft Teams help & Learning', 'Tech (Microsoft)', 'Key Tools', 'Hybrid', 'Long', 'L2', '{DBP Platform}', '{Riyadh}', '{Associate,Lead}', 'live', 'Comprehensive learning track for Microsoft Teams covering meetings, chat, collaboration, and advanced features to help you master Teams for effective communication and teamwork.', '{Master Teams meetings from basics to advanced events,Learn chat, messaging, and collaboration features,Organize webinars, live events, and town halls,Troubleshoot common issues and optimize productivity}', '{Join, schedule, and manage Teams meetings effectively,Communicate efficiently using Teams chat features,Organize and host large-scale events and webinars,Resolve common issues and use advanced features}', 'Course (Bundles)', 'Microsoft Teams help & Learning', 4.6, 35, '[{"author":"Ahmad Al-Mansoori","role":"Project Lead","text":"This comprehensive track transformed how our team uses Microsoft Teams. The meetings and chat courses are both excellent, and we''re now much more productive.","rating":5},{"author":"Layla Al-Rashid","role":"Operations Manager","text":"The Microsoft Teams track is incredibly thorough. I especially appreciated the troubleshooting section and advanced features coverage.","rating":4},{"author":"Omar Hassan","role":"Team Coordinator","text":"As someone new to Teams, this track was perfect. The step-by-step approach and comprehensive coverage helped me become proficient quickly.","rating":5}]', NULL, NULL, '[{"question":"What are the requirements for taking this track?","answer":"This track is designed for all team members who use Microsoft Teams. No prior experience is required, but having access to Microsoft Teams and a basic understanding of collaboration tools will be helpful. You should have access to Teams within your organization."},{"question":"How long does it take to complete the Microsoft Teams help & Learning track?","answer":"The Microsoft Teams track can be completed at your own pace. Most participants finish the core content within 4-6 weeks when dedicating 3-5 hours per week. The track includes comprehensive coverage of meetings and chat features."},{"question":"Can I take individual courses from this track?","answer":"Yes, all courses within the Microsoft Teams track can be taken individually. The \\"Ms Teams (Meetings)\\" and \\"Ms Teams (Chat)\\" courses are available as standalone courses, though we recommend taking the full track for complete Teams mastery."},{"question":"What topics are covered in this track?","answer":"The track covers Teams meetings (joining, scheduling, managing, webinars, live events), Teams chat (messaging, file sharing, group chats), collaboration features, and troubleshooting. It includes both beginner and advanced topics."},{"question":"Do I need Teams Premium for all features?","answer":"Many features work with standard Teams. Some advanced features like immersive experiences, advanced meeting protection, and certain event features require Teams Premium. The course clearly indicates which features require Premium."},{"question":"What support is available if I encounter issues?","answer":"Each course includes troubleshooting lessons and resources. You can also reach out to your IT support team or the Microsoft Teams administrator for assistance with technical issues or access problems."}]');

-- ============================================
-- INSERT CURRICULUM ITEMS
-- ============================================

INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('lesson-1', 'dq-essentials', 'Introduction to DQ', 'Overview of DQ''s mission, vision, and core values', '15 min', 1, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-ghc-foundations', 'ghc-primer', 'Becoming a Leader Using GHC', 'Core GHC principles and frameworks', NULL, 1, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-dq-products', 'ghc-primer', 'DQ Products', 'Understanding DQ product ecosystem', NULL, 2, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-dws-basics', 'dws-tools', 'DWS Basics', 'Introduction to Digital Workspace Services', NULL, 1, false, 'dws-basics');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-dws-advanced', 'dws-tools', 'Advanced DWS', 'Advanced features and workflows', NULL, 2, false, 'dws-advanced');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-week-1', 'first-7-days', 'Week 1: Getting Started', 'Initial setup, orientation, and tool configuration', NULL, 1, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-dq-essentials-track', 'leadership-track', 'DQ Essentials: How DQ Works', 'Orientation to DQ''s mission, structure, and operating models', NULL, 1, false, 'dq-essentials');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-ghc-primer-track', 'leadership-track', 'GHC Primer: Collaboration & Delivery', 'Golden Honeycomb Competences for teaming and agile delivery', NULL, 2, false, 'ghc-primer');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-sixx-digital-track', 'leadership-track', '6x Digital: Transformation Framework', 'Six perspectives for scoping, governing, and delivering transformation', NULL, 3, true, 'sixx-digital');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-first-7-days-track', 'onboarding-track', 'Your First 7 Days at DQ', 'Seven-day onboarding sprint with day-by-day guidance', NULL, 1, false, 'first-7-days');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-dq-essentials-onboarding', 'onboarding-track', 'DQ Essentials: How DQ Works', 'Orientation to DQ''s mission and structure', NULL, 2, false, 'dq-essentials');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('section-teams-login', 'ms-teams-meetings', 'Teams login', 'Learn how to access and use Microsoft Teams', NULL, 1, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('section-join-meeting', 'ms-teams-meetings', 'Join a meeting', 'Various ways to join Teams meetings', NULL, 2, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('section-schedule-meeting', 'ms-teams-meetings', 'Schedule a meeting', 'Create and manage Teams meetings', NULL, 3, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-manage-calendar', 'ms-teams-meetings', 'Manage your calendar', 'Calendar management in Teams', NULL, 4, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-participate-meetings', 'ms-teams-meetings', 'Participate in meetings', 'Active participation and collaboration in meetings', NULL, 5, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-immersive-experiences', 'ms-teams-meetings', 'Immersive experiences', 'Advanced immersive meeting features', NULL, 6, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-teams-premium', 'ms-teams-meetings', 'Teams Premium', 'Advanced Teams Premium features', NULL, 7, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-meeting-options', 'ms-teams-meetings', 'Meeting options', 'Advanced meeting configuration and settings', NULL, 8, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-recording-options', 'ms-teams-meetings', 'Recording options', 'Record and manage meeting recordings', NULL, 9, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-live-events', 'ms-teams-meetings', 'Live events', 'Organize and produce live events', NULL, 10, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-webinars', 'ms-teams-meetings', 'Webinars', 'Create and manage Teams webinars', NULL, 11, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-town-halls', 'ms-teams-meetings', 'Town halls', 'Organize and host town hall meetings', NULL, 12, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-best-practices-meetings', 'ms-teams-meetings', 'Best practices', 'Best practices for Teams meetings', NULL, 13, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-troubleshooting-meetings', 'ms-teams-meetings', 'Troubleshooting', 'Common issues and solutions for Teams meetings', NULL, 14, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-send-messages', 'ms-teams-chat', 'Send messages', 'Master messaging in Teams', NULL, 1, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-chat-outside-team', 'ms-teams-chat', 'Chat outside a team', 'External communication features', NULL, 2, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-manage-messages', 'ms-teams-chat', 'Manage messages', 'Organize and manage your messages', NULL, 3, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-group-chat', 'ms-teams-chat', 'Group chat', 'Manage group conversations', NULL, 4, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('topic-learn-more-chat', 'ms-teams-chat', 'Learn more', 'Advanced chat features and tips', NULL, 5, false, NULL);
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-ms-teams-meetings', 'microsoft-teams-help-learning', 'Ms Teams (Meetings)', 'Master Microsoft Teams meetings from joining and scheduling to advanced features like webinars, live events, and immersive experiences.', NULL, 1, false, 'ms-teams-meetings');
INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES ('course-ms-teams-chat', 'microsoft-teams-help-learning', 'Ms Teams (Chat)', 'Master Microsoft Teams chat features including messaging, file sharing, group chats, and advanced collaboration tools.', NULL, 2, false, 'ms-teams-chat');

-- ============================================
-- INSERT TOPICS
-- ============================================

INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-ghc-overview', 'topic-ghc-foundations', 'GHC Fundamentals', 'Introduction to Golden Honeycomb Competences', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-ghc-pillars', 'topic-ghc-foundations', 'The 7 Pillars', 'Deep dive into each of the 7 GHC pillars', NULL, 2, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-7s-sos', 'topic-dq-products', '7S and SoS Practices', 'Understanding 7S framework and SoS methodologies', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-dtmf', 'topic-dq-products', 'DTMF Framework', 'Learn about DTMF for planning and retrospectives', NULL, 2, true);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-dws-intro', 'course-dws-basics', 'Getting Started with DWS', 'Introduction to DWS tools and navigation', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-dws-advanced', 'course-dws-advanced', 'Advanced Features', 'Advanced DWS capabilities', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-days-1-3', 'topic-week-1', 'Days 1-3: Orientation and Setup', 'Welcome, team introduction, and workspace setup', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-days-4-7', 'topic-week-1', 'Days 4-7: First Tasks and Integration', 'Complete first tasks and integrate into team workflows', NULL, 2, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-essentials-intro', 'course-dq-essentials-track', 'DQ Fundamentals', 'Core DQ concepts and structure', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-ghc-leadership', 'course-ghc-primer-track', 'Becoming a Leader Using GHC', 'Core GHC principles for leadership', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-dq-products-lead', 'course-ghc-primer-track', 'DQ Products for Leaders', 'Understanding DQ product ecosystem from a leadership perspective', NULL, 2, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-6x-overview', 'course-sixx-digital-track', '6x Digital Overview', 'Introduction to D1-D6 perspectives', NULL, 1, true);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-day-1-3', 'course-first-7-days-track', 'Days 1-3: Getting Started', 'Initial setup and orientation', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-day-4-7', 'course-first-7-days-track', 'Days 4-7: First Tasks', 'Complete first tasks and establish workflows', NULL, 2, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-essentials-onboarding', 'course-dq-essentials-onboarding', 'DQ Fundamentals', 'Core DQ concepts for new team members', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-teams-login', 'section-teams-login', 'Teams login', 'Learn how to access and use Microsoft Teams', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-join-meeting', 'section-join-meeting', 'Join a meeting', 'Various ways to join Teams meetings', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('topic-schedule-meeting', 'section-schedule-meeting', 'Schedule a meeting', 'Create and manage Teams meetings', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('track-topic-meetings-overview', 'course-ms-teams-meetings', 'Meeting Fundamentals', 'Core meeting features and controls', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('track-topic-meetings-advanced', 'course-ms-teams-meetings', 'Advanced Meeting Features', 'Webinars, live events, and premium features', NULL, 2, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('track-topic-chat-basics', 'course-ms-teams-chat', 'Chat Fundamentals', 'Core messaging and communication features', NULL, 1, false);
INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES ('track-topic-chat-advanced', 'course-ms-teams-chat', 'Advanced Chat Features', 'Group chats, commands, and productivity tools', NULL, 2, false);

-- ============================================
-- INSERT LESSONS
-- ============================================

INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-1-content', NULL, 'lesson-1', 'Introduction to DQ', 'Overview of DQ''s mission, vision, and core values', '15 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-ghc-1', 'topic-ghc-overview', NULL, 'Introduction to 5Ps', 'Understanding the 5Ps framework', '20 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-ghc-2', 'topic-ghc-overview', NULL, 'Agile Practices', 'Agile methodologies in GHC context', '25 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-ghc-3', 'topic-ghc-pillars', NULL, 'Pillar 1-3 Overview', 'First three pillars explained', '30 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-ghc-4', 'topic-ghc-pillars', NULL, 'Pillar 4-7 Overview', 'Remaining pillars explained', '30 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-7s-1', 'topic-7s-sos', NULL, '7S Framework Introduction', 'Overview of the 7S framework', '25 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-7s-2', 'topic-7s-sos', NULL, 'SoS Methodologies', 'Scrum of Scrums practices', '20 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-dtmf-1', 'topic-dtmf', NULL, 'DTMF Basics', 'Introduction to DTMF framework', '20 min', 'guide', 1, true);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-dtmf-2', 'topic-dtmf', NULL, 'DTMF in Practice', 'Applying DTMF in real scenarios', '25 min', 'workshop', 2, true);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-dws-1', 'topic-dws-intro', NULL, 'DWS Overview', 'Introduction to Digital Workspace Services', '15 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-dws-2', 'topic-dws-intro', NULL, 'Navigation Basics', 'How to navigate the DWS interface', '10 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-dws-adv-1', 'topic-dws-advanced', NULL, 'Advanced Workflows', 'Complex workflow patterns', '30 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-1', 'topic-days-1-3', NULL, 'Day 1: Welcome and Orientation', 'Introduction to DQ, meet your team, and set up your workspace', '2 hours', 'workshop', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-2', 'topic-days-1-3', NULL, 'Day 2: Tools and Access', 'Set up all necessary tools and gain access to required systems', '1.5 hours', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-3', 'topic-days-1-3', NULL, 'Day 3: Core Processes', 'Learn about daily workflows and processes', '2 hours', 'video', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-4', 'topic-days-4-7', NULL, 'Day 4: First Task', 'Complete your first assigned task with mentor support', '3 hours', 'assignment', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-5', 'topic-days-4-7', NULL, 'Day 5: Team Rituals', 'Participate in team meetings and understand rituals', '1 hour', 'workshop', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-6', 'topic-days-4-7', NULL, 'Day 6: Review and Feedback', 'Review your progress and receive feedback', '1 hour', 'workshop', 3, true);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-7', 'topic-days-4-7', NULL, 'Day 7: Next Steps', 'Plan your learning path and next steps', '1 hour', 'guide', 4, true);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-essentials-1', 'topic-essentials-intro', NULL, 'Introduction to DQ', 'Overview of DQ''s mission, vision, and core values', '15 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-essentials-2', 'topic-essentials-intro', NULL, 'DQ Structure and Teams', 'Understanding DQ''s organizational structure', '20 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-ghc-lead-1', 'topic-ghc-leadership', NULL, 'Introduction to 5Ps', 'Understanding the 5Ps framework for leadership', '20 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-ghc-lead-2', 'topic-ghc-leadership', NULL, 'Agile Leadership Practices', 'Agile methodologies in leadership context', '25 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-dq-prod-lead-1', 'topic-dq-products-lead', NULL, '7S Framework for Leaders', 'Applying 7S framework in leadership', '25 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-6x-1', 'topic-6x-overview', NULL, 'D1-D6 Introduction', 'Overview of the six transformation perspectives', '30 min', 'video', 1, true);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-1', 'topic-day-1-3', NULL, 'Day 1: Welcome and Orientation', 'Introduction to DQ and team setup', '2 hours', 'workshop', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-2', 'topic-day-1-3', NULL, 'Day 2: Tools and Access', 'Set up necessary tools and gain access', '1.5 hours', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-day-4', 'topic-day-4-7', NULL, 'Day 4: First Task', 'Complete your first assigned task', '3 hours', 'assignment', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-essentials-onboarding-1', 'topic-essentials-onboarding', NULL, 'Introduction to DQ', 'Overview of DQ''s mission and values', '15 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-login-1', 'topic-teams-login', NULL, 'How to Login', 'Step-by-step guide to logging into Microsoft Teams', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-login-2', 'topic-teams-login', NULL, 'Use Teams on the web', 'Access Teams through web browser', '3 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-join-1', 'topic-join-meeting', NULL, 'Join a meeting in Teams', 'Join meetings from within Teams app', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-join-2', 'topic-join-meeting', NULL, 'Join without a Teams account', 'Join as a guest without Teams account', '4 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-join-3', 'topic-join-meeting', NULL, 'Join a meeting outside your org', 'Participate in external organization meetings', '5 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-join-4', 'topic-join-meeting', NULL, 'Join on a second device', 'Join same meeting from multiple devices', '4 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-join-5', 'topic-join-meeting', NULL, 'Join as a view-only attendee', 'Attend meetings in view-only mode', '3 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-join-6', 'topic-join-meeting', NULL, 'Join from Google', 'Join Teams meetings from Google Calendar', '4 min', 'video', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-1', 'topic-schedule-meeting', NULL, 'Schedule a meeting in Teams', 'Basic meeting scheduling in Teams', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-2', 'topic-schedule-meeting', NULL, 'Schedule from Outlook', 'Create Teams meetings from Outlook', '4 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-3', 'topic-schedule-meeting', NULL, 'Schedule from Google', 'Schedule Teams meetings via Google Calendar', '4 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-4', 'topic-schedule-meeting', NULL, 'Instant meeting', 'Start an immediate meeting', '3 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-5', 'topic-schedule-meeting', NULL, 'Personal meeting templates', 'Create and use meeting templates', '5 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-6', 'topic-schedule-meeting', NULL, 'Add a dial-in number', 'Include phone dial-in options', '3 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-7', 'topic-schedule-meeting', NULL, 'Invite people', 'Add participants to meetings', '3 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-8', 'topic-schedule-meeting', NULL, 'Meeting roles', 'Understand organizer, presenter, and attendee roles', '4 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-9', 'topic-schedule-meeting', NULL, 'Add co-organizers', 'Share meeting organization responsibilities', '4 min', 'video', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-10', 'topic-schedule-meeting', NULL, 'Hide attendee names', 'Privacy settings for meeting participants', '3 min', 'guide', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-11', 'topic-schedule-meeting', NULL, 'Lock a meeting', 'Secure meetings by locking access', '3 min', 'guide', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-schedule-12', 'topic-schedule-meeting', NULL, 'End a meeting', 'Properly conclude Teams meetings', '2 min', 'video', 12, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-1', NULL, 'topic-manage-calendar', 'Manage your calendar', 'Overview of calendar management', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-2', NULL, 'topic-manage-calendar', 'See all your meetings', 'View your complete meeting schedule', '3 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-3', NULL, 'topic-manage-calendar', 'Get started in new calendar', 'Introduction to new calendar interface', '4 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-4', NULL, 'topic-manage-calendar', 'Customize your calendar', 'Personalize calendar settings and views', '5 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-5', NULL, 'topic-manage-calendar', 'View multiple calendars', 'Manage multiple calendar views', '4 min', 'video', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-6', NULL, 'topic-manage-calendar', 'Work plans', 'Create and manage work plans', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-calendar-7', NULL, 'topic-manage-calendar', 'Share your calendar', 'Share calendar with colleagues', '4 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-1', NULL, 'topic-participate-meetings', 'Meeting controls', 'Essential meeting controls and features', '6 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-2', NULL, 'topic-participate-meetings', 'Chat', 'Use chat during meetings', '4 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-3', NULL, 'topic-participate-meetings', 'Present content', 'Share your screen and content', '5 min', 'video', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-4', NULL, 'topic-participate-meetings', 'Presenter modes', 'Different presentation modes available', '5 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-5', NULL, 'topic-participate-meetings', 'Share slides', 'Present PowerPoint slides in meetings', '4 min', 'video', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-6', NULL, 'topic-participate-meetings', 'Share sound', 'Share computer audio during presentations', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-7', NULL, 'topic-participate-meetings', 'Use video', 'Manage video settings and controls', '4 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-8', NULL, 'topic-participate-meetings', 'Apply video filters', 'Use video filters and effects', '4 min', 'video', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-9', NULL, 'topic-participate-meetings', 'Mute and unmute', 'Audio controls in meetings', '3 min', 'video', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-10', NULL, 'topic-participate-meetings', 'Spotlight a video', 'Highlight specific participants', '3 min', 'guide', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-11', NULL, 'topic-participate-meetings', 'Multitasking', 'Work on multiple tasks during meetings', '4 min', 'guide', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-12', NULL, 'topic-participate-meetings', 'Raise your hand', 'Use hand raise feature to participate', '2 min', 'video', 12, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-13', NULL, 'topic-participate-meetings', 'Live reactions', 'Express reactions during meetings', '3 min', 'video', 13, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-14', NULL, 'topic-participate-meetings', 'Take meeting notes', 'Collaborate on meeting notes', '5 min', 'guide', 14, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-15', NULL, 'topic-participate-meetings', 'Join a breakout room', 'Participate in breakout sessions', '5 min', 'video', 15, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-16', NULL, 'topic-participate-meetings', 'Customize your view', 'Adjust meeting view settings', '4 min', 'guide', 16, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-17', NULL, 'topic-participate-meetings', 'Laser pointer', 'Use laser pointer during presentations', '3 min', 'video', 17, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-18', NULL, 'topic-participate-meetings', 'Cast from a desktop', 'Cast content from desktop to Teams', '4 min', 'guide', 18, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-19', NULL, 'topic-participate-meetings', 'Share physical resources', 'Share physical whiteboards and resources', '4 min', 'video', 19, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-20', NULL, 'topic-participate-meetings', 'Use a green screen', 'Virtual background with green screen', '5 min', 'guide', 20, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-21', NULL, 'topic-participate-meetings', 'Join as an avatar', 'Participate using personalized avatars', '4 min', 'video', 21, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-22', NULL, 'topic-participate-meetings', 'Customize your avatar', 'Create and customize your Teams avatar', '5 min', 'guide', 22, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-participate-23', NULL, 'topic-participate-meetings', 'Use emotes, gestures, and more', 'Express yourself with avatars', '4 min', 'video', 23, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-1', NULL, 'topic-immersive-experiences', 'Get started with immersive events', 'Introduction to immersive events', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-2', NULL, 'topic-immersive-experiences', 'Schedule an immersive event', 'Plan and schedule immersive experiences', '5 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-3', NULL, 'topic-immersive-experiences', 'Customize an immersive event', 'Personalize immersive event settings', '6 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-4', NULL, 'topic-immersive-experiences', 'Host an immersive event', 'Lead immersive events effectively', '6 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-5', NULL, 'topic-immersive-experiences', 'Attend an immersive event', 'Participate in immersive experiences', '5 min', 'video', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-6', NULL, 'topic-immersive-experiences', 'Get started with immersive spaces', 'Introduction to immersive spaces', '5 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-7', NULL, 'topic-immersive-experiences', 'Use in-meeting controls', 'Control features during immersive meetings', '5 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-immersive-8', NULL, 'topic-immersive-experiences', 'Spatial audio', 'Enhanced audio in immersive spaces', '4 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-premium-1', NULL, 'topic-teams-premium', 'Overview of Microsoft Teams Premium', 'Introduction to Teams Premium capabilities', '6 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-premium-2', NULL, 'topic-teams-premium', 'Intelligent productivity', 'AI-powered productivity features', '5 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-premium-3', NULL, 'topic-teams-premium', 'Advanced meeting protection', 'Enhanced security and protection', '5 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-premium-4', NULL, 'topic-teams-premium', 'Engaging event experiences', 'Premium features for large events', '5 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-1', NULL, 'topic-meeting-options', 'Change your background', 'Customize virtual backgrounds', '4 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-2', NULL, 'topic-meeting-options', 'Meeting themes', 'Apply visual themes to meetings', '4 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-3', NULL, 'topic-meeting-options', 'Audio settings', 'Configure audio preferences', '5 min', 'video', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-4', NULL, 'topic-meeting-options', 'Manage attendee audio and video', 'Control participant audio/video settings', '5 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-5', NULL, 'topic-meeting-options', 'Manage what attendees see', 'Control attendee view permissions', '4 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-6', NULL, 'topic-meeting-options', 'Use the green room', 'Prepare before joining main meeting', '4 min', 'video', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-7', NULL, 'topic-meeting-options', 'Use RTMP-In', 'Stream into Teams using RTMP', '5 min', 'guide', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-8', NULL, 'topic-meeting-options', 'Reduce background noise', 'Noise suppression features', '4 min', 'video', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-9', NULL, 'topic-meeting-options', 'Voice isolation in Teams', 'Advanced audio isolation', '4 min', 'guide', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-10', NULL, 'topic-meeting-options', 'Mute notifications', 'Manage notifications during meetings', '3 min', 'guide', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-11', NULL, 'topic-meeting-options', 'Manage breakout rooms', 'Create and manage breakout sessions', '6 min', 'video', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-12', NULL, 'topic-meeting-options', 'Live transcription', 'Enable and use live captions', '4 min', 'video', 12, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-13', NULL, 'topic-meeting-options', 'Language interpretation', 'Multi-language meeting support', '5 min', 'guide', 13, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-14', NULL, 'topic-meeting-options', 'Multilingual speech recognition', 'Speech recognition for multiple languages', '5 min', 'guide', 14, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-15', NULL, 'topic-meeting-options', 'Q&A', 'Manage questions and answers', '4 min', 'video', 15, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-16', NULL, 'topic-meeting-options', 'Live captions', 'Real-time captioning features', '4 min', 'video', 16, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-17', NULL, 'topic-meeting-options', 'Real-Time Text', 'Real-time text transcription', '4 min', 'guide', 17, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-18', NULL, 'topic-meeting-options', 'End-to-end encryption', 'Secure encrypted meetings', '5 min', 'guide', 18, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-19', NULL, 'topic-meeting-options', 'Watermark', 'Add watermarks to protect content', '4 min', 'guide', 19, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-20', NULL, 'topic-meeting-options', 'Sensitive content detection', 'Protect sensitive information', '5 min', 'guide', 20, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-21', NULL, 'topic-meeting-options', 'Meeting attendance reports', 'Track and review meeting attendance', '5 min', 'video', 21, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-22', NULL, 'topic-meeting-options', 'Using the lobby', 'Manage waiting room features', '4 min', 'guide', 22, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-options-23', NULL, 'topic-meeting-options', 'Meeting options', 'Complete overview of meeting settings', '6 min', 'video', 23, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-recording-1', NULL, 'topic-recording-options', 'Record a meeting', 'Start and stop meeting recordings', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-recording-2', NULL, 'topic-recording-options', 'Recap', 'AI-generated meeting summaries', '4 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-recording-3', NULL, 'topic-recording-options', 'Play and share a meeting recording', 'Access and distribute recordings', '5 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-recording-4', NULL, 'topic-recording-options', 'Delete a recording', 'Remove meeting recordings', '3 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-recording-5', NULL, 'topic-recording-options', 'Edit or delete a transcript', 'Manage meeting transcripts', '4 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-recording-6', NULL, 'topic-recording-options', 'Customize access to recordings or transcripts', 'Control who can access recordings', '5 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-1', NULL, 'topic-live-events', 'Switch to town halls', 'Migrate from live events to town halls', '5 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-2', NULL, 'topic-live-events', 'Get started', 'Introduction to live events', '5 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-3', NULL, 'topic-live-events', 'Schedule a live event', 'Plan and schedule live events', '6 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-4', NULL, 'topic-live-events', 'Invite attendees', 'Manage live event invitations', '4 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-5', NULL, 'topic-live-events', 'organizer checklist', 'Checklist for event organizers', '5 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-6', NULL, 'topic-live-events', 'For tier 1 events', 'Best practices for large-scale events', '6 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-7', NULL, 'topic-live-events', 'Produce a live event', 'Production workflow for live events', '7 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-8', NULL, 'topic-live-events', 'Produce a live event with Teams Encoder', 'Advanced production with encoder', '8 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-9', NULL, 'topic-live-events', 'Best practices', 'Tips for successful live events', '5 min', 'guide', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-10', NULL, 'topic-live-events', 'Present', 'Presentation tips for live events', '5 min', 'video', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-11', NULL, 'topic-live-events', 'Moderate a Q&A', 'Manage Q&A during live events', '5 min', 'guide', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-12', NULL, 'topic-live-events', 'Allow anonymous presenters', 'Enable anonymous participation', '4 min', 'guide', 12, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-13', NULL, 'topic-live-events', 'Attendee engagement report', 'Analyze event engagement metrics', '5 min', 'video', 13, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-14', NULL, 'topic-live-events', 'Recording and reports', 'Access recordings and analytics', '5 min', 'guide', 14, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-15', NULL, 'topic-live-events', 'Attend a live event in Teams', 'Participant guide for live events', '4 min', 'video', 15, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-16', NULL, 'topic-live-events', 'Participate in a Q&A', 'Submit questions during events', '3 min', 'guide', 16, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-live-17', NULL, 'topic-live-events', 'Use live captions', 'Access captions during live events', '3 min', 'video', 17, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-1', NULL, 'topic-webinars', 'Get started', 'Introduction to Teams webinars', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-2', NULL, 'topic-webinars', 'Schedule a webinar', 'Plan and schedule webinars', '6 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-3', NULL, 'topic-webinars', 'Customize a webinar', 'Personalize webinar settings', '5 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-4', NULL, 'topic-webinars', 'Publicize a webinar', 'Promote and share webinars', '4 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-5', NULL, 'topic-webinars', 'Manage webinar registration', 'Handle attendee registration', '5 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-6', NULL, 'topic-webinars', 'Change webinar details', 'Update webinar information', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-7', NULL, 'topic-webinars', 'Manage webinar emails', 'Configure email notifications', '4 min', 'guide', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-8', NULL, 'topic-webinars', 'Cancel a webinar', 'Cancel scheduled webinars', '3 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-9', NULL, 'topic-webinars', 'Manage webinar recordings', 'Access and manage webinar recordings', '4 min', 'video', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-webinar-10', NULL, 'topic-webinars', 'Webinar attendance report', 'Review webinar participation data', '4 min', 'guide', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-1', NULL, 'topic-town-halls', 'Get started with town hall', 'Introduction to town halls', '5 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-2', NULL, 'topic-town-halls', 'Schedule a town hall', 'Plan and schedule town halls', '6 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-3', NULL, 'topic-town-halls', 'Manage town hall emails', 'Configure email communications', '4 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-4', NULL, 'topic-town-halls', 'Customize a town hall', 'Personalize town hall settings', '5 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-5', NULL, 'topic-town-halls', 'Host a town hall', 'Best practices for hosting', '6 min', 'video', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-6', NULL, 'topic-town-halls', 'Control production tools', 'Use production features', '5 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-7', NULL, 'topic-town-halls', 'Attend a town hall', 'Participant guide for town halls', '4 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-8', NULL, 'topic-town-halls', 'Chat in a town hall', 'Use chat features during town halls', '4 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-9', NULL, 'topic-town-halls', 'Town hall insights', 'Analyze town hall engagement', '5 min', 'video', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-10', NULL, 'topic-town-halls', 'Manage town hall recordings', 'Access and manage recordings', '4 min', 'guide', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-townhall-11', NULL, 'topic-town-halls', 'Cancel a town hall', 'Cancel scheduled town halls', '3 min', 'guide', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-best-1', NULL, 'topic-best-practices-meetings', 'Setting up large meetings and events', 'Best practices for large-scale meetings', '6 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-best-2', NULL, 'topic-best-practices-meetings', 'Presenting in large meetings and events', 'Presentation tips for large audiences', '6 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-best-3', NULL, 'topic-best-practices-meetings', 'Producing large meetings and events', 'Production workflow best practices', '7 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-best-4', NULL, 'topic-best-practices-meetings', 'Hosting hybrid meetings and events in Microsoft Teams Rooms', 'Best practices for hybrid setups', '7 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-1', NULL, 'topic-troubleshooting-meetings', 'Can''t join a meeting', 'Troubleshoot meeting join issues', '5 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-2', NULL, 'topic-troubleshooting-meetings', 'Camera isn''t working', 'Fix camera issues in Teams', '5 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-3', NULL, 'topic-troubleshooting-meetings', 'Microphone isn''t working', 'Resolve microphone problems', '5 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-4', NULL, 'topic-troubleshooting-meetings', 'My speaker isn''t working', 'Fix audio output issues', '4 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-5', NULL, 'topic-troubleshooting-meetings', 'Can''t record a meeting', 'Troubleshoot recording problems', '5 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-6', NULL, 'topic-troubleshooting-meetings', 'Can''t transcribe a meeting', 'Fix transcription issues', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-7', NULL, 'topic-troubleshooting-meetings', 'Meeting chat access', 'Resolve chat access problems', '4 min', 'guide', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-8', NULL, 'topic-troubleshooting-meetings', 'Breakout rooms issues', 'Fix breakout room problems', '5 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-9', NULL, 'topic-troubleshooting-meetings', 'Immersive spaces issues', 'Troubleshoot immersive space problems', '5 min', 'guide', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-10', NULL, 'topic-troubleshooting-meetings', 'Meetings keep dropping', 'Resolve connection stability issues', '5 min', 'guide', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-trouble-11', NULL, 'topic-troubleshooting-meetings', 'Call and meeting quality', 'Improve audio and video quality', '6 min', 'guide', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-1', NULL, 'topic-send-messages', 'Start a chat with others', 'Initiate conversations in Teams', '4 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-2', NULL, 'topic-send-messages', 'Send and read', 'Basic message sending and reading', '3 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-3', NULL, 'topic-send-messages', 'Send a file, picture, or link', 'Share files and media in chats', '5 min', 'video', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-4', NULL, 'topic-send-messages', 'Send an emoji, GIF, or sticker', 'Add emojis and media to messages', '4 min', 'video', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-5', NULL, 'topic-send-messages', 'Select your emoji skin tone', 'Customize emoji appearance', '2 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-6', NULL, 'topic-send-messages', 'Use custom emoji', 'Create and use custom emojis', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-7', NULL, 'topic-send-messages', 'Read receipts', 'Understand message read status', '3 min', 'guide', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-8', NULL, 'topic-send-messages', 'Format a message', 'Apply formatting to messages', '4 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-9', NULL, 'topic-send-messages', 'Check your spelling in multiple languages', 'Use spell check for different languages', '4 min', 'guide', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-10', NULL, 'topic-send-messages', 'Use suggested replies', 'Quick reply suggestions', '3 min', 'video', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-11', NULL, 'topic-send-messages', 'Like or react to messages', 'React to messages with emojis', '3 min', 'video', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-12', NULL, 'topic-send-messages', 'Copy and paste', 'Copy and paste content in Teams', '2 min', 'guide', 12, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-13', NULL, 'topic-send-messages', 'Mark a message as important or urgent', 'Highlight important messages', '3 min', 'guide', 13, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-14', NULL, 'topic-send-messages', 'Share your screen in a chat', 'Screen sharing in chat windows', '4 min', 'video', 14, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-15', NULL, 'topic-send-messages', 'Share a contact', 'Share contact information', '3 min', 'guide', 15, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-16', NULL, 'topic-send-messages', 'Forward a message', 'Forward messages to others', '3 min', 'guide', 16, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-17', NULL, 'topic-send-messages', 'Report messages', 'Report inappropriate content', '3 min', 'guide', 17, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-18', NULL, 'topic-send-messages', 'Use file suggestions', 'AI-powered file recommendations', '4 min', 'video', 18, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-19', NULL, 'topic-send-messages', 'Record a video clip', 'Send video messages', '5 min', 'video', 19, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-20', NULL, 'topic-send-messages', 'Use text predictions', 'AI text completion suggestions', '4 min', 'video', 20, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-send-21', NULL, 'topic-send-messages', 'Schedule chat messages', 'Schedule messages for later', '4 min', 'guide', 21, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-external-1', NULL, 'topic-chat-outside-team', 'Add or invite people outside your org to a chat', 'Include external participants', '5 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-external-2', NULL, 'topic-chat-outside-team', 'Accept people outside your org', 'Approve external participant requests', '4 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-external-3', NULL, 'topic-chat-outside-team', 'Block or unblock people outside your org', 'Manage external contacts', '4 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-external-4', NULL, 'topic-chat-outside-team', 'Send messages to Skype for Business users', 'Interoperability with Skype', '4 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-1', NULL, 'topic-manage-messages', 'Edit or delete a message', 'Modify sent messages', '4 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-2', NULL, 'topic-manage-messages', 'Save a message', 'Bookmark important messages', '3 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-3', NULL, 'topic-manage-messages', 'Hide a chat or leave a chat thread', 'Organize your chat list', '4 min', 'video', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-4', NULL, 'topic-manage-messages', 'Pin a chat message', 'Pin important messages', '3 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-5', NULL, 'topic-manage-messages', 'Hide, unhide, mute, add a chat to Favorites, or mark a chat as unread', 'Chat organization options', '5 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-6', NULL, 'topic-manage-messages', 'Accept or block chat requests from people inside your org', 'Manage internal chat requests', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-7', NULL, 'topic-manage-messages', 'Open a chat in a new window', 'Multi-window chat management', '3 min', 'guide', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-8', NULL, 'topic-manage-messages', 'Prevent spam or phishing attempts from external chats', 'Security and spam prevention', '5 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-9', NULL, 'topic-manage-messages', 'Search for messages', 'Find messages using search', '4 min', 'video', 9, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-10', NULL, 'topic-manage-messages', 'Translate a message', 'Translate messages to your language', '4 min', 'video', 10, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-11', NULL, 'topic-manage-messages', 'Change the spacing', 'Adjust message spacing', '2 min', 'guide', 11, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-12', NULL, 'topic-manage-messages', 'Preview messages', 'Message preview features', '3 min', 'guide', 12, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-13', NULL, 'topic-manage-messages', 'Show chat info', 'View chat details and settings', '3 min', 'guide', 13, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-14', NULL, 'topic-manage-messages', 'Manage chats with the Teams mobile app', 'Mobile chat management', '4 min', 'video', 14, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-manage-15', NULL, 'topic-manage-messages', 'Share to Outlook from Teams', 'Integration with Outlook', '4 min', 'guide', 15, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-group-1', NULL, 'topic-group-chat', 'Leave or remove someone from a group chat', 'Manage group membership', '4 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-group-2', NULL, 'topic-group-chat', 'Personalize your group chat image', 'Customize group appearance', '3 min', 'guide', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-group-3', NULL, 'topic-group-chat', 'Chat with members from distribution list or M365 group', 'Create chats from groups', '4 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-group-4', NULL, 'topic-group-chat', 'Share a link to a specific message', 'Link to specific messages', '3 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-1', NULL, 'topic-learn-more-chat', 'Use slash commands', 'Productivity commands in Teams', '5 min', 'guide', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-2', NULL, 'topic-learn-more-chat', 'Send Praise to people', 'Recognize team members', '3 min', 'video', 2, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-3', NULL, 'topic-learn-more-chat', 'Use code blocks', 'Format code in messages', '4 min', 'guide', 3, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-4', NULL, 'topic-learn-more-chat', 'Send code snippets in a message', 'Share code snippets', '4 min', 'guide', 4, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-5', NULL, 'topic-learn-more-chat', 'Use Markdown formatting', 'Apply Markdown in messages', '5 min', 'guide', 5, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-6', NULL, 'topic-learn-more-chat', 'Use Immersive Reader', 'Accessibility reading features', '4 min', 'guide', 6, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-7', NULL, 'topic-learn-more-chat', 'Do your one-on-ones with Teams chat', 'Conduct one-on-one meetings', '5 min', 'video', 7, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('lesson-learn-8', NULL, 'topic-learn-more-chat', 'Get started with storyline', 'Introduction to storyline features', '5 min', 'guide', 8, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('track-lesson-join-basics', 'track-topic-meetings-overview', NULL, 'Joining and Scheduling Basics', 'Essential skills for participating in Teams meetings', '10 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('track-lesson-events', 'track-topic-meetings-advanced', NULL, 'Large-Scale Events', 'Organizing webinars and town halls', '15 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('track-lesson-messaging', 'track-topic-chat-basics', NULL, 'Effective Messaging', 'Send and manage messages in Teams', '8 min', 'video', 1, false);
INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES ('track-lesson-productivity', 'track-topic-chat-advanced', NULL, 'Productivity Features', 'Slash commands and advanced collaboration', '10 min', 'guide', 1, false);

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT 
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM curriculum_items) as curriculum_items,
  (SELECT COUNT(*) FROM topics) as topics,
  (SELECT COUNT(*) FROM lessons) as lessons;
