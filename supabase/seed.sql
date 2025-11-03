-- Seed file for News & Announcements
-- This file populates the database with initial data based on the current dummy data

-- First, let's create a test user if it doesn't exist (for author_id)
-- Note: In production, this should be a real user from auth.users
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Try to get an existing user or use a placeholder UUID
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NULL THEN
    test_user_id := '00000000-0000-0000-0000-000000000001'::UUID;
  END IF;
  
  -- Store in a temporary table for use in subsequent inserts
  CREATE TEMP TABLE IF NOT EXISTS temp_user (id UUID);
  DELETE FROM temp_user;
  INSERT INTO temp_user VALUES (test_user_id);
END $$;

-- Get category IDs for reference
DO $$
DECLARE
  tech_cat_id UUID;
  company_cat_id UUID;
  events_cat_id UUID;
  achievement_cat_id UUID;
  security_cat_id UUID;
  facilities_cat_id UUID;
BEGIN
  SELECT id INTO tech_cat_id FROM public.news_categories WHERE name = 'Technology';
  SELECT id INTO company_cat_id FROM public.news_categories WHERE name = 'Company';
  SELECT id INTO events_cat_id FROM public.news_categories WHERE name = 'Events';
  SELECT id INTO achievement_cat_id FROM public.news_categories WHERE name = 'Achievement';
  SELECT id INTO security_cat_id FROM public.news_categories WHERE name = 'Security';
  SELECT id INTO facilities_cat_id FROM public.news_categories WHERE name = 'Facilities';

  -- Store in temporary tables
  CREATE TEMP TABLE IF NOT EXISTS temp_categories (
    name VARCHAR(100),
    id UUID
  );
  DELETE FROM temp_categories;
  INSERT INTO temp_categories VALUES 
    ('Technology', tech_cat_id),
    ('Company', company_cat_id),
    ('Events', events_cat_id),
    ('Achievement', achievement_cat_id),
    ('Security', security_cat_id),
    ('Facilities', facilities_cat_id);
END $$;

-- Insert news articles
INSERT INTO public.news_articles (
  id,
  title,
  slug,
  description,
  content,
  featured_image_url,
  category_id,
  author_id,
  publisher_name,
  publisher_department,
  status,
  published_at,
  views_count,
  is_featured,
  is_pinned
) VALUES
-- Article 1: AI-Powered Workspace Platform
(
  'a1111111-1111-1111-1111-111111111111'::UUID,
  'Digital Qatalyst Launches AI-Powered Workspace Platform',
  'digital-qatalyst-launches-ai-powered-workspace-platform',
  'We''re thrilled to announce the launch of our revolutionary AI-powered Digital Workspace Platform, designed to transform how teams collaborate and innovate in 2025.',
  '<h2>Overview</h2>
<p>At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest developments across our organization. This announcement reflects our commitment to transparency, innovation, and continuous improvement as we work together to deliver exceptional value to our clients and stakeholders.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Enhanced collaboration tools and processes to streamline team workflows</li>
  <li>New opportunities for professional development and skill enhancement</li>
  <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
  <li>Focus on employee well-being and work-life balance</li>
  <li>Commitment to sustainable growth and community impact</li>
</ul>

<h2>Impact on Teams</h2>
<p>This initiative will positively impact various teams across Digital Qatalyst, fostering better communication, knowledge sharing, and cross-functional collaboration. We encourage all team members to actively participate and contribute their insights to make this a success.</p>

<h2>Next Steps</h2>
<ol>
  <li>Review the details and familiarize yourself with the changes</li>
  <li>Attend upcoming information sessions and Q&A forums</li>
  <li>Reach out to your team lead or HR for any questions or clarifications</li>
  <li>Provide feedback through our internal communication channels</li>
  <li>Stay tuned for follow-up announcements and updates</li>
</ol>

<h2>Our Culture</h2>
<p>This announcement embodies Digital Qatalyst''s culture of continuous learning, adaptability, and excellence. We value every team member''s contribution and are committed to creating an environment where innovation thrives and everyone can reach their full potential.</p>

<h2>Get Involved</h2>
<p>We encourage you to engage with this initiative by sharing your thoughts, asking questions, and collaborating with your colleagues. Together, we can make Digital Qatalyst an even better place to work and grow.</p>',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  (SELECT id FROM temp_categories WHERE name = 'Technology'),
  (SELECT id FROM temp_user LIMIT 1),
  'Digital Qatalyst',
  'Technology',
  'published',
  '2025-10-28 09:00:00+00'::TIMESTAMP WITH TIME ZONE,
  245,
  true,
  true
),
-- Article 2: Q4 Town Hall
(
  'a2222222-2222-2222-2222-222222222222'::UUID,
  'Q4 2025 Town Hall: Year-End Achievements & 2026 Vision',
  'q4-2025-town-hall-year-end-achievements-2026-vision',
  'Join our leadership team on November 5th as we celebrate our accomplishments this year and unveil our strategic vision for 2026.',
  '<h2>Overview</h2>
<p>At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest developments across our organization. This announcement reflects our commitment to transparency, innovation, and continuous improvement as we work together to deliver exceptional value to our clients and stakeholders.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Enhanced collaboration tools and processes to streamline team workflows</li>
  <li>New opportunities for professional development and skill enhancement</li>
  <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
  <li>Focus on employee well-being and work-life balance</li>
  <li>Commitment to sustainable growth and community impact</li>
</ul>

<h2>Impact on Teams</h2>
<p>This initiative will positively impact various teams across Digital Qatalyst, fostering better communication, knowledge sharing, and cross-functional collaboration. We encourage all team members to actively participate and contribute their insights to make this a success.</p>

<h2>Next Steps</h2>
<ol>
  <li>Review the details and familiarize yourself with the changes</li>
  <li>Attend upcoming information sessions and Q&A forums</li>
  <li>Reach out to your team lead or HR for any questions or clarifications</li>
  <li>Provide feedback through our internal communication channels</li>
  <li>Stay tuned for follow-up announcements and updates</li>
</ol>',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
  (SELECT id FROM temp_categories WHERE name = 'Company'),
  (SELECT id FROM temp_user LIMIT 1),
  'Digital Qatalyst',
  'HR',
  'published',
  '2025-10-25 10:00:00+00'::TIMESTAMP WITH TIME ZONE,
  189,
  true,
  false
),
-- Article 3: Innovation Week
(
  'a3333333-3333-3333-3333-333333333333'::UUID,
  'Annual Innovation Week: November 10-14, 2025',
  'annual-innovation-week-november-10-14-2025',
  'Save the date! Our annual Innovation Week returns with workshops, hackathons, and guest speakers from leading tech companies. Let''s innovate together!',
  '<h2>Overview</h2>
<p>At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest developments across our organization. This announcement reflects our commitment to transparency, innovation, and continuous improvement as we work together to deliver exceptional value to our clients and stakeholders.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Enhanced collaboration tools and processes to streamline team workflows</li>
  <li>New opportunities for professional development and skill enhancement</li>
  <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
  <li>Focus on employee well-being and work-life balance</li>
  <li>Commitment to sustainable growth and community impact</li>
</ul>

<h2>Impact on Teams</h2>
<p>This initiative will positively impact various teams across Digital Qatalyst, fostering better communication, knowledge sharing, and cross-functional collaboration. We encourage all team members to actively participate and contribute their insights to make this a success.</p>

<h2>Next Steps</h2>
<ol>
  <li>Review the details and familiarize yourself with the changes</li>
  <li>Attend upcoming information sessions and Q&A forums</li>
  <li>Reach out to your team lead or HR for any questions or clarifications</li>
  <li>Provide feedback through our internal communication channels</li>
  <li>Stay tuned for follow-up announcements and updates</li>
</ol>',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
  (SELECT id FROM temp_categories WHERE name = 'Events'),
  (SELECT id FROM temp_user LIMIT 1),
  'Digital Qatalyst',
  'Events',
  'published',
  '2025-10-22 08:30:00+00'::TIMESTAMP WITH TIME ZONE,
  312,
  false,
  false
),
-- Article 4: Top Workplace Award
(
  'a4444444-4444-4444-4444-444444444444'::UUID,
  'DQ Recognized as Top Workplace for Innovation 2025',
  'dq-recognized-as-top-workplace-for-innovation-2025',
  'Proud moment! Digital Qatalyst has been named one of the Top 10 Most Innovative Workplaces by Tech Excellence Awards 2025.',
  '<h2>Overview</h2>
<p>At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest developments across our organization. This announcement reflects our commitment to transparency, innovation, and continuous improvement as we work together to deliver exceptional value to our clients and stakeholders.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Enhanced collaboration tools and processes to streamline team workflows</li>
  <li>New opportunities for professional development and skill enhancement</li>
  <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
  <li>Focus on employee well-being and work-life balance</li>
  <li>Commitment to sustainable growth and community impact</li>
</ul>

<h2>Impact on Teams</h2>
<p>This initiative will positively impact various teams across Digital Qatalyst, fostering better communication, knowledge sharing, and cross-functional collaboration. We encourage all team members to actively participate and contribute their insights to make this a success.</p>

<h2>Our Culture</h2>
<p>This announcement embodies Digital Qatalyst''s culture of continuous learning, adaptability, and excellence. We value every team member''s contribution and are committed to creating an environment where innovation thrives and everyone can reach their full potential.</p>',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  (SELECT id FROM temp_categories WHERE name = 'Achievement'),
  (SELECT id FROM temp_user LIMIT 1),
  'Digital Qatalyst',
  'Communications',
  'published',
  '2025-10-20 11:00:00+00'::TIMESTAMP WITH TIME ZONE,
  428,
  true,
  false
),
-- Article 5: Cybersecurity Training
(
  'a5555555-5555-5555-5555-555555555555'::UUID,
  'New Cybersecurity Protocols: Mandatory Training by Nov 15',
  'new-cybersecurity-protocols-mandatory-training-by-nov-15',
  'As part of our commitment to data security, all team members must complete the updated cybersecurity training module by November 15, 2025.',
  '<h2>Overview</h2>
<p>At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest developments across our organization. This announcement reflects our commitment to transparency, innovation, and continuous improvement as we work together to deliver exceptional value to our clients and stakeholders.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Enhanced collaboration tools and processes to streamline team workflows</li>
  <li>New opportunities for professional development and skill enhancement</li>
  <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
  <li>Focus on employee well-being and work-life balance</li>
  <li>Commitment to sustainable growth and community impact</li>
</ul>

<h2>Next Steps</h2>
<ol>
  <li>Review the details and familiarize yourself with the changes</li>
  <li>Attend upcoming information sessions and Q&A forums</li>
  <li>Reach out to your team lead or HR for any questions or clarifications</li>
  <li>Provide feedback through our internal communication channels</li>
  <li>Stay tuned for follow-up announcements and updates</li>
</ol>',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
  (SELECT id FROM temp_categories WHERE name = 'Security'),
  (SELECT id FROM temp_user LIMIT 1),
  'Digital Qatalyst',
  'IT Security',
  'published',
  '2025-10-18 09:00:00+00'::TIMESTAMP WITH TIME ZONE,
  156,
  false,
  false
),
-- Article 6: Abu Dhabi Office
(
  'a6666666-6666-6666-6666-666666666666'::UUID,
  'New Abu Dhabi Office Space: Grand Opening December 2025',
  'new-abu-dhabi-office-space-grand-opening-december-2025',
  'Exciting news! Our expanded Abu Dhabi office featuring state-of-the-art collaboration spaces, wellness areas, and innovation labs opens next month.',
  '<h2>Overview</h2>
<p>At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest developments across our organization. This announcement reflects our commitment to transparency, innovation, and continuous improvement as we work together to deliver exceptional value to our clients and stakeholders.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Enhanced collaboration tools and processes to streamline team workflows</li>
  <li>New opportunities for professional development and skill enhancement</li>
  <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
  <li>Focus on employee well-being and work-life balance</li>
  <li>Commitment to sustainable growth and community impact</li>
</ul>

<h2>Impact on Teams</h2>
<p>This initiative will positively impact various teams across Digital Qatalyst, fostering better communication, knowledge sharing, and cross-functional collaboration. We encourage all team members to actively participate and contribute their insights to make this a success.</p>

<h2>Get Involved</h2>
<p>We encourage you to engage with this initiative by sharing your thoughts, asking questions, and collaborating with your colleagues. Together, we can make Digital Qatalyst an even better place to work and grow.</p>',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  (SELECT id FROM temp_categories WHERE name = 'Facilities'),
  (SELECT id FROM temp_user LIMIT 1),
  'Digital Qatalyst',
  'Facilities',
  'published',
  '2025-10-15 14:00:00+00'::TIMESTAMP WITH TIME ZONE,
  203,
  false,
  false
);

-- Get tag IDs and create article-tag associations
DO $$
DECLARE
  ai_tag_id UUID;
  innovation_tag_id UUID;
  townhall_tag_id UUID;
  leadership_tag_id UUID;
  teambuilding_tag_id UUID;
  award_tag_id UUID;
  recognition_tag_id UUID;
  training_tag_id UUID;
  compliance_tag_id UUID;
  office_tag_id UUID;
  expansion_tag_id UUID;
BEGIN
  SELECT id INTO ai_tag_id FROM public.news_tags WHERE name = 'AI';
  SELECT id INTO innovation_tag_id FROM public.news_tags WHERE name = 'Innovation';
  SELECT id INTO townhall_tag_id FROM public.news_tags WHERE name = 'Town Hall';
  SELECT id INTO leadership_tag_id FROM public.news_tags WHERE name = 'Leadership';
  SELECT id INTO teambuilding_tag_id FROM public.news_tags WHERE name = 'Team Building';
  SELECT id INTO award_tag_id FROM public.news_tags WHERE name = 'Award';
  SELECT id INTO recognition_tag_id FROM public.news_tags WHERE name = 'Recognition';
  SELECT id INTO training_tag_id FROM public.news_tags WHERE name = 'Training';
  SELECT id INTO compliance_tag_id FROM public.news_tags WHERE name = 'Compliance';
  SELECT id INTO office_tag_id FROM public.news_tags WHERE name = 'Office';
  SELECT id INTO expansion_tag_id FROM public.news_tags WHERE name = 'Expansion';

  -- Article 1: AI + Innovation
  INSERT INTO public.news_article_tags (article_id, tag_id) VALUES
    ('a1111111-1111-1111-1111-111111111111'::UUID, ai_tag_id),
    ('a1111111-1111-1111-1111-111111111111'::UUID, innovation_tag_id);

  -- Article 2: Town Hall + Leadership
  INSERT INTO public.news_article_tags (article_id, tag_id) VALUES
    ('a2222222-2222-2222-2222-222222222222'::UUID, townhall_tag_id),
    ('a2222222-2222-2222-2222-222222222222'::UUID, leadership_tag_id);

  -- Article 3: Innovation + Team Building
  INSERT INTO public.news_article_tags (article_id, tag_id) VALUES
    ('a3333333-3333-3333-3333-333333333333'::UUID, innovation_tag_id),
    ('a3333333-3333-3333-3333-333333333333'::UUID, teambuilding_tag_id);

  -- Article 4: Award + Recognition
  INSERT INTO public.news_article_tags (article_id, tag_id) VALUES
    ('a4444444-4444-4444-4444-444444444444'::UUID, award_tag_id),
    ('a4444444-4444-4444-4444-444444444444'::UUID, recognition_tag_id);

  -- Article 5: Training + Compliance
  INSERT INTO public.news_article_tags (article_id, tag_id) VALUES
    ('a5555555-5555-5555-5555-555555555555'::UUID, training_tag_id),
    ('a5555555-5555-5555-5555-555555555555'::UUID, compliance_tag_id);

  -- Article 6: Office + Expansion
  INSERT INTO public.news_article_tags (article_id, tag_id) VALUES
    ('a6666666-6666-6666-6666-666666666666'::UUID, office_tag_id),
    ('a6666666-6666-6666-6666-666666666666'::UUID, expansion_tag_id);
END $$;

-- Add some sample reactions (optional - requires real user IDs)
-- Uncomment and modify with real user IDs if needed
/*
INSERT INTO public.news_reactions (article_id, user_id, reaction_type) VALUES
  ('a1111111-1111-1111-1111-111111111111'::UUID, 'USER_ID_HERE'::UUID, 'like'),
  ('a1111111-1111-1111-1111-111111111111'::UUID, 'USER_ID_HERE'::UUID, 'love'),
  ('a4444444-4444-4444-4444-444444444444'::UUID, 'USER_ID_HERE'::UUID, 'celebrate');
*/

-- Clean up temporary tables
DROP TABLE IF EXISTS temp_user;
DROP TABLE IF EXISTS temp_categories;

-- Display summary
DO $$
DECLARE
  article_count INTEGER;
  tag_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO article_count FROM public.news_articles;
  SELECT COUNT(*) INTO tag_count FROM public.news_article_tags;
  
  RAISE NOTICE 'Seed completed successfully!';
  RAISE NOTICE 'Total articles inserted: %', article_count;
  RAISE NOTICE 'Total article-tag associations: %', tag_count;
END $$;
