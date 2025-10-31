-- =====================================================
-- Communities Seed Data
-- =====================================================
-- Sample data for testing /communities and /communities/feed
-- =====================================================

-- =====================================================
-- SEED USERS
-- =====================================================

INSERT INTO users_local (id, email, password, username, avatar_url, role, created_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'admin_user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin', NOW() - INTERVAL '90 days'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'john.doe@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'john_doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 'member', NOW() - INTERVAL '60 days'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'sarah.smith@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'sarah_smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 'moderator', NOW() - INTERVAL '75 days'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'mike.johnson@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'mike_j', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', 'member', NOW() - INTERVAL '45 days'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'emma.wilson@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'emma_w', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', 'member', NOW() - INTERVAL '30 days'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'alex.brown@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'alex_brown', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'member', NOW() - INTERVAL '20 days'),
('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'lisa.davis@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'lisa_d', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', 'member', NOW() - INTERVAL '15 days'),
('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'david.miller@digitalqatalyst.com', '$2a$10$YourHashedPasswordHere', 'david_m', 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', 'member', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED COMMUNITIES
-- =====================================================

INSERT INTO communities (id, name, description, imageurl, category, tags, isprivate, created_by, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 
 'Tech Innovators Abu Dhabi', 
 'A community for technology enthusiasts and innovators in Abu Dhabi.',
 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
 'Technology',
 ARRAY['tech', 'innovation', 'abudhabi', 'startups'],
 false,
 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
 NOW() - INTERVAL '90 days'),

('22222222-2222-2222-2222-222222222222',
 'Digital Transformation Hub',
 'Connecting professionals driving digital transformation across industries.',
 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
 'Business',
 ARRAY['digital', 'transformation', 'business', 'enterprise'],
 false,
 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
 NOW() - INTERVAL '85 days'),

('33333333-3333-3333-3333-333333333333',
 'Startup Ecosystem UAE',
 'Supporting entrepreneurs and startups in the UAE ecosystem.',
 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
 'Business',
 ARRAY['startups', 'entrepreneurship', 'uae', 'funding'],
 false,
 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
 NOW() - INTERVAL '80 days'),

('44444444-4444-4444-4444-444444444444',
 'AI and Machine Learning',
 'Explore artificial intelligence and machine learning.',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
 'Technology',
 ARRAY['ai', 'ml', 'datascience', 'research'],
 false,
 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
 NOW() - INTERVAL '70 days'),

('55555555-5555-5555-5555-555555555555',
 'Creative Designers Network',
 'A space for designers to showcase work and collaborate.',
 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
 'Creative',
 ARRAY['design', 'creative', 'ux', 'ui'],
 false,
 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
 NOW() - INTERVAL '65 days'),

('66666666-6666-6666-6666-666666666666',
 'Data Science Community',
 'Share insights, datasets, and collaborate on data projects.',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
 'Technology',
 ARRAY['data', 'analytics', 'python', 'statistics'],
 false,
 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
 NOW() - INTERVAL '55 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED MEMBERSHIPS
-- =====================================================

INSERT INTO memberships (user_id, community_id, role, joined_at) VALUES
-- Tech Innovators Abu Dhabi
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '11111111-1111-1111-1111-111111111111', 'admin', NOW() - INTERVAL '90 days'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '11111111-1111-1111-1111-111111111111', 'member', NOW() - INTERVAL '60 days'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '11111111-1111-1111-1111-111111111111', 'moderator', NOW() - INTERVAL '75 days'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '11111111-1111-1111-1111-111111111111', 'member', NOW() - INTERVAL '45 days'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '11111111-1111-1111-1111-111111111111', 'member', NOW() - INTERVAL '30 days'),

-- Digital Transformation Hub
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '22222222-2222-2222-2222-222222222222', 'admin', NOW() - INTERVAL '85 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '22222222-2222-2222-2222-222222222222', 'member', NOW() - INTERVAL '80 days'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '22222222-2222-2222-2222-222222222222', 'member', NOW() - INTERVAL '70 days'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '22222222-2222-2222-2222-222222222222', 'member', NOW() - INTERVAL '20 days'),

-- Startup Ecosystem UAE
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '33333333-3333-3333-3333-333333333333', 'admin', NOW() - INTERVAL '80 days'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '33333333-3333-3333-3333-333333333333', 'member', NOW() - INTERVAL '45 days'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '33333333-3333-3333-3333-333333333333', 'member', NOW() - INTERVAL '30 days'),
('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '33333333-3333-3333-3333-333333333333', 'member', NOW() - INTERVAL '15 days'),
('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '33333333-3333-3333-3333-333333333333', 'member', NOW() - INTERVAL '10 days'),

-- AI and Machine Learning
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '44444444-4444-4444-4444-444444444444', 'admin', NOW() - INTERVAL '70 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '44444444-4444-4444-4444-444444444444', 'member', NOW() - INTERVAL '65 days'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '44444444-4444-4444-4444-444444444444', 'member', NOW() - INTERVAL '30 days'),

-- Creative Designers Network
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '55555555-5555-5555-5555-555555555555', 'admin', NOW() - INTERVAL '65 days'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '55555555-5555-5555-5555-555555555555', 'member', NOW() - INTERVAL '20 days'),
('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '55555555-5555-5555-5555-555555555555', 'member', NOW() - INTERVAL '15 days'),

-- Data Science Community
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '66666666-6666-6666-6666-666666666666', 'admin', NOW() - INTERVAL '55 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '66666666-6666-6666-6666-666666666666', 'member', NOW() - INTERVAL '50 days'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '66666666-6666-6666-6666-666666666666', 'member', NOW() - INTERVAL '40 days')
ON CONFLICT (user_id, community_id) DO NOTHING;

-- =====================================================
-- SEED POSTS
-- =====================================================

INSERT INTO posts (id, title, content, community_id, created_by, post_type, status, tags, created_at) VALUES
('p1111111-1111-1111-1111-111111111111',
 'Welcome to Tech Innovators!',
 'Excited to launch this community for tech enthusiasts in Abu Dhabi. Let us share ideas and collaborate!',
 '11111111-1111-1111-1111-111111111111',
 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
 'text',
 'active',
 ARRAY['welcome', 'introduction'],
 NOW() - INTERVAL '89 days'),

('p2222222-2222-2222-2222-222222222222',
 'AI Trends in 2025',
 'What are the biggest AI trends you are seeing this year? I am particularly interested in generative AI applications.',
 '11111111-1111-1111-1111-111111111111',
 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
 'text',
 'active',
 ARRAY['ai', 'trends', 'discussion'],
 NOW() - INTERVAL '5 days'),

('p3333333-3333-3333-3333-333333333333',
 'Looking for React Developer',
 'Our startup is looking for a senior React developer. Must have 5+ years experience. DM if interested!',
 '33333333-3333-3333-3333-333333333333',
 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
 'text',
 'active',
 ARRAY['jobs', 'react', 'hiring'],
 NOW() - INTERVAL '3 days'),

('p4444444-4444-4444-4444-444444444444',
 'Digital Transformation Best Practices',
 'Sharing our journey of digital transformation. Key lessons: start small, focus on culture, measure everything.',
 '22222222-2222-2222-2222-222222222222',
 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
 'text',
 'active',
 ARRAY['transformation', 'bestpractices', 'leadership'],
 NOW() - INTERVAL '7 days'),

('p5555555-5555-5555-5555-555555555555',
 'Startup Funding Workshop - March 15',
 'Join us for a workshop on securing seed funding. Expert VCs will share insights and answer questions.',
 '33333333-3333-3333-3333-333333333333',
 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
 'event',
 'active',
 ARRAY['event', 'funding', 'workshop'],
 NOW() - INTERVAL '2 days'),

('p6666666-6666-6666-6666-666666666666',
 'Machine Learning Model Deployment',
 'Best practices for deploying ML models to production? Looking for recommendations on tools and frameworks.',
 '44444444-4444-4444-4444-444444444444',
 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
 'text',
 'active',
 ARRAY['ml', 'deployment', 'devops'],
 NOW() - INTERVAL '1 day'),

('p7777777-7777-7777-7777-777777777777',
 'Design System Showcase',
 'Just finished building our company design system. Happy to share learnings and get feedback!',
 '55555555-5555-5555-5555-555555555555',
 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
 'text',
 'active',
 ARRAY['design', 'designsystem', 'ux'],
 NOW() - INTERVAL '4 days'),

('p8888888-8888-8888-8888-888888888888',
 'Python vs R for Data Science',
 'What is your preferred tool for data analysis and why? Let us discuss the pros and cons.',
 '66666666-6666-6666-6666-666666666666',
 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
 'text',
 'active',
 ARRAY['python', 'r', 'datascience', 'discussion'],
 NOW() - INTERVAL '6 days'),

('p9999999-9999-9999-9999-999999999999',
 'Networking Event Next Week',
 'Monthly tech meetup next Thursday at 6 PM. Great opportunity to connect with fellow innovators!',
 '11111111-1111-1111-1111-111111111111',
 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
 'event',
 'active',
 ARRAY['event', 'networking', 'meetup'],
 NOW() - INTERVAL '8 hours'),

('pa111111-1111-1111-1111-111111111111',
 'Cloud Migration Success Story',
 'We successfully migrated our entire infrastructure to AWS. Here is what we learned along the way.',
 '22222222-2222-2222-2222-222222222222',
 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
 'text',
 'active',
 ARRAY['cloud', 'aws', 'migration', 'casestudy'],
 NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED COMMENTS
-- =====================================================

INSERT INTO comments (post_id, created_by, content, status, created_at) VALUES
('p2222222-2222-2222-2222-222222222222', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Great topic! I think multimodal AI is going to be huge this year.', 'active', NOW() - INTERVAL '4 days'),
('p2222222-2222-2222-2222-222222222222', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Agreed! Also seeing a lot of movement in AI agents and autonomous systems.', 'active', NOW() - INTERVAL '4 days'),
('p3333333-3333-3333-3333-333333333333', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Sent you a DM! Very interested in this opportunity.', 'active', NOW() - INTERVAL '2 days'),
('p4444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Culture is indeed the hardest part. How did you handle resistance to change?', 'active', NOW() - INTERVAL '6 days'),
('p6666666-6666-6666-6666-666666666666', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'We use MLflow for model tracking and deployment. Works great with Docker.', 'active', NOW() - INTERVAL '20 hours'),
('p6666666-6666-6666-6666-666666666666', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Also recommend looking into Kubeflow if you are on Kubernetes.', 'active', NOW() - INTERVAL '18 hours'),
('p8888888-8888-8888-8888-888888888888', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Python all the way! The ecosystem is unmatched.', 'active', NOW() - INTERVAL '5 days'),
('p8888888-8888-8888-8888-888888888888', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'I use both depending on the task. R for statistical analysis, Python for ML.', 'active', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED REACTIONS
-- =====================================================

INSERT INTO reactions (post_id, user_id, reaction_type, created_at) VALUES
('p1111111-1111-1111-1111-111111111111', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'helpful', NOW() - INTERVAL '88 days'),
('p1111111-1111-1111-1111-111111111111', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'helpful', NOW() - INTERVAL '88 days'),
('p2222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'insightful', NOW() - INTERVAL '4 days'),
('p2222222-2222-2222-2222-222222222222', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'helpful', NOW() - INTERVAL '4 days'),
('p2222222-2222-2222-2222-222222222222', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'insightful', NOW() - INTERVAL '4 days'),
('p4444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'helpful', NOW() - INTERVAL '6 days'),
('p4444444-4444-4444-4444-444444444444', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'insightful', NOW() - INTERVAL '6 days'),
('p6666666-6666-6666-6666-666666666666', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'helpful', NOW() - INTERVAL '1 day'),
('p6666666-6666-6666-6666-666666666666', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'helpful', NOW() - INTERVAL '1 day'),
('p8888888-8888-8888-8888-888888888888', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'insightful', NOW() - INTERVAL '5 days'),
('p9999999-9999-9999-9999-999999999999', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'helpful', NOW() - INTERVAL '7 hours'),
('p9999999-9999-9999-9999-999999999999', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'helpful', NOW() - INTERVAL '6 hours'),
('pa111111-1111-1111-1111-111111111111', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'insightful', NOW() - INTERVAL '10 hours')
ON CONFLICT (post_id, user_id, reaction_type) DO NOTHING;

-- =====================================================
-- VERIFY DATA
-- =====================================================

-- Show summary
SELECT 'Users created:' as info, COUNT(*) as count FROM users_local
UNION ALL
SELECT 'Communities created:', COUNT(*) FROM communities
UNION ALL
SELECT 'Memberships created:', COUNT(*) FROM memberships
UNION ALL
SELECT 'Posts created:', COUNT(*) FROM posts
UNION ALL
SELECT 'Comments created:', COUNT(*) FROM comments
UNION ALL
SELECT 'Reactions created:', COUNT(*) FROM reactions;
