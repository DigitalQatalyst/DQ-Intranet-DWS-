-- =====================================================
-- Insert Sample Content for Knowledge Hub
-- =====================================================
-- This adds sample Guidelines and Learning content
-- that will appear in the "Latest DQ Developments" section
-- =====================================================

-- Insert Guidelines content
INSERT INTO public.guides (slug, title, excerpt, body, guide_type, domain, status, tags, image)
VALUES
  (
    'shift-allocation-guidelines',
    'Shifts Allocation Guidelines Released',
    'New workspace guidelines launched to improve workload balance, transparency, and efficiency.',
    '# Shifts Allocation Guidelines

## Overview
These guidelines help teams manage shift allocations effectively...

## Key Principles
- Fair distribution of work
- Transparency in allocation
- Efficiency in execution',
    'Guidelines',
    'Operations',
    'Approved',
    ARRAY['Guidelines', 'Policy', 'Operations', 'Workforce'],
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
  ),
  (
    'wfh-policy-update',
    'Work From Home Policy Update',
    'Updated WFH guidelines to support hybrid work and maintain productivity.',
    '# Work From Home Policy

## Purpose
Support flexible work arrangements while maintaining team collaboration...

## Guidelines
- Minimum 2 days in office per week
- Core hours: 10 AM - 3 PM
- Regular team sync meetings',
    'Guidelines',
    'HR',
    'Approved',
    ARRAY['Guidelines', 'Policy', 'HR', 'Remote Work'],
    'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800'
  ),
  (
    'code-review-standards',
    'Code Review Standards & Best Practices',
    'Comprehensive guidelines for conducting effective code reviews across all projects.',
    '# Code Review Standards

## Purpose
Ensure code quality and knowledge sharing...

## Review Checklist
- Code functionality
- Test coverage
- Documentation
- Performance considerations',
    'Guidelines',
    'Engineering',
    'Approved',
    ARRAY['Guidelines', 'Engineering', 'Best Practices', 'Quality'],
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body = EXCLUDED.body,
  tags = EXCLUDED.tags,
  updated_at = NOW();

-- Insert Learning content
INSERT INTO public.guides (slug, title, excerpt, body, guide_type, domain, status, tags, image)
VALUES
  (
    'leadership-essentials-course',
    'Leadership Essentials | Building Your Foundation',
    'Master the core principles of effective leadership at DQ through practical frameworks and real-world scenarios.',
    '# Leadership Essentials Course

## What You''ll Learn
- Vision and strategic thinking
- Team motivation and engagement
- Decision-making frameworks
- Communication excellence

## Course Structure
- 8 modules
- 20 hours of content
- Practical exercises
- Peer learning sessions',
    'Thought Leadership',
    'Learning',
    'Approved',
    ARRAY['Learning', 'Course', 'Leadership', 'Development', 'Training'],
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
  ),
  (
    'agile-mastery-bootcamp',
    'Agile Mastery Bootcamp | From Basics to Advanced',
    'Comprehensive training on Agile methodologies, Scrum practices, and continuous improvement.',
    '# Agile Mastery Bootcamp

## Overview
Deep dive into Agile practices used at DQ...

## Topics Covered
- Scrum framework
- Sprint planning
- Retrospectives
- Agile metrics
- Scaling Agile

## Duration
- 5 days intensive
- Hands-on workshops
- Real project simulations',
    'Thought Leadership',
    'Learning',
    'Approved',
    ARRAY['Learning', 'Course', 'Agile', 'Scrum', 'Training', 'Development'],
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
  ),
  (
    'emotional-intelligence-growth',
    'Emotional Intelligence & Personal Growth',
    'Develop self-awareness, empathy, and interpersonal skills to enhance collaboration and leadership.',
    '# Emotional Intelligence Course

## Why EQ Matters
Emotional intelligence drives collaboration, resilience, and growth...

## Learning Outcomes
- Self-awareness techniques
- Empathy development
- Conflict resolution
- Stress management
- Building trust

## Format
- Self-paced learning
- Interactive exercises
- Group discussions
- Personal coaching sessions',
    'Thought Leadership',
    'Learning',
    'Approved',
    ARRAY['Learning', 'Course', 'Emotional Intelligence', 'Growth', 'Skill Development'],
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
  ),
  (
    'technical-writing-workshop',
    'Technical Writing Workshop | Clear Documentation',
    'Learn to write clear, concise technical documentation that helps teams work more effectively.',
    '# Technical Writing Workshop

## Skills You''ll Gain
- Clear communication
- Documentation structure
- API documentation
- User guides
- Process documentation

## Workshop Format
- 2-day intensive
- Hands-on practice
- Peer reviews
- Real documentation projects',
    'Thought Leadership',
    'Learning',
    'Approved',
    ARRAY['Learning', 'Course', 'Writing', 'Documentation', 'Training', 'Skill'],
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body = EXCLUDED.body,
  tags = EXCLUDED.tags,
  updated_at = NOW();

-- Verify the data
SELECT 
  slug,
  title,
  guide_type,
  tags,
  status
FROM public.guides
WHERE slug IN (
  'shift-allocation-guidelines',
  'wfh-policy-update',
  'code-review-standards',
  'leadership-essentials-course',
  'agile-mastery-bootcamp',
  'emotional-intelligence-growth',
  'technical-writing-workshop'
)
ORDER BY guide_type, slug;

-- Success message
DO $$
DECLARE
  guidelines_count INTEGER;
  learning_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO guidelines_count FROM guides WHERE tags && ARRAY['Guidelines'];
  SELECT COUNT(*) INTO learning_count FROM guides WHERE tags && ARRAY['Learning'];
  
  RAISE NOTICE '✅ Sample content inserted successfully!';
  RAISE NOTICE 'Guidelines items: %', guidelines_count;
  RAISE NOTICE 'Learning items: %', learning_count;
  RAISE NOTICE '';
  RAISE NOTICE 'These will now appear in the "Latest DQ Developments" section';
  RAISE NOTICE 'Refresh your browser to see them!';
END $$;
