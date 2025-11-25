-- Add all users to all communities in community_members table
-- This script inserts each user into every existing community
-- Uses ON CONFLICT DO NOTHING to avoid duplicates

INSERT INTO community_members (community_id, user_id, role, joined_at)
SELECT 
  c.id AS community_id,
  u.user_id,
  'member' AS role,
  NOW() AS joined_at
FROM 
  communities c
CROSS JOIN (
  VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID), -- alex
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID), -- brianna
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID), -- casey
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID), -- dylan
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID), -- elin
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::UUID)  -- frank
) AS u(user_id)
ON CONFLICT (community_id, user_id) DO NOTHING;



