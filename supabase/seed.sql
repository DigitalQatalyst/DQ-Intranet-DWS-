-- Seed data matching current UI constants

-- ===== DQ 6x page copy =====
INSERT INTO public.dq_6x_page_copy (key, value) VALUES
  ('title', 'DQ | Products (6x Digital View)')
, ('subtitle', 'Discover the six digital perspectives that structure DQ\'s transformation architecture.')
, ('panel_title', 'D6 (Digital Accelerators - Tools)')
, ('panel_subtitle', '› When will you get there')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ===== Lanes =====
INSERT INTO public.dq_lanes (id, title, subtitle, icon_url, color_hex, sort_order) VALUES
  ('d1', 'D1 (Digital Economy · DE)', '› Why should organisations change', '/images/dq/globe_d1.png', '#fb923c', 1)
, ('d2', 'D2 (Digital Cognitive Organisation · DCO)', '› Where are organisations headed', '/images/dq/globe_d2.png', '#22c55e', 2)
, ('d3', 'D3 (Digital Business Platform · DBP)', '› What target value orchestration engine', '/images/dq/globe_d3.png', '#a855f7', 3)
, ('d4', 'D4 (Digital Transformation · DQ2.0)', '› How to design & deploy the target', '/images/dq/globe_d4.png', '#6366f1', 4)
, ('d5', 'D5 (Digital Worker & Workspace · DW·WS)', '› Who are orchestrators', '/images/dq/globe_d5.png', '#3b82f6', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, icon_url = EXCLUDED.icon_url, color_hex = EXCLUDED.color_hex, sort_order = EXCLUDED.sort_order;

-- ===== Tiles =====
INSERT INTO public.dq_tiles (id, title, subtitle, description, tone, href, sort_order) VALUES
  ('dtmp',   'DTMP',  'Digital Transformation Management Platform', 'DQ DTMP stands for the Digital Transformation Management Platform. It supports the design, deployment, and governance of digital transformation initiatives across the DQ network, enabling structured workflows, performance tracking, and capability development.', 'light', NULL, 1)
, ('dtmaas', 'TMaaS', 'Transformation Management as a Service', 'TMaaS (Transformation Management as a Service) is a flexible, on-demand marketplace that offers affordable digital transformation services, enhanced with AI-driven customization to meet the specific needs of organizations.', 'light', NULL, 2)
, ('dtq4t',  'DTO4T', 'Digital Twin of Organization for Transformation', 'DQ DTO4T stands for the Digital Twin of Organization for Transformation. It is a digital toolkit designed to support training and transformation teams with templates, resources, and interactive modules for internal learning, organizational development, and change enablement.', 'light', NULL, 3)
, ('dtmb',   'DTMB',  'Content & Creative for the DQ ecosystem', 'DQ DTMB focuses on the creation, design, and delivery of digital content and creative assets for the DQ ecosystem. This includes graphics, copywriting, videos, and other multimedia used across DQ platforms.', 'dark', NULL, 4)
, ('dtmi',   'DTMI',  'AI-powered insights & perspectives', 'Digital Transformation Management Insights is an AI-powered online magazine that offers expert perspectives on Digital Cognitive Organizations. It combines research-based articles with a curated resource marketplace to help transformation teams access practical tools, case studies, and strategic guidance.', 'dark', NULL, 5)
, ('dtma',   'DTMA',  'Academy for data-driven dashboards & skills', 'DQ DTMA refers to the Digital Transformation Management Academy. It offers data-driven insights, dashboards, and visualizations focused on talent metrics and operational performance, supporting strategic decision-making in digital transformation efforts.', 'dark', NULL, 6)
, ('dcocc',  'DCO.CC','D6 Collab Centers (HI & AI)', 'DCO.CC hosts collaboration centers (human + AI) for coordination, knowledge sharing, and rapid realization of blueprints and operating models across the DQ ecosystem.', 'green', NULL, 7)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, tone = EXCLUDED.tone, href = EXCLUDED.href, sort_order = EXCLUDED.sort_order;

-- ===== Lane -> Tile map =====
INSERT INTO public.dq_lane_tile_map (lane_id, tile_id) VALUES
  ('d1','dtmp')
, ('d2','dtmaas')
, ('d3','dtq4t')
, ('d4','dtmb')
, ('d5','dcocc')
ON CONFLICT (lane_id, tile_id) DO NOTHING;

-- ===== DQ DNA Nodes =====
INSERT INTO public.dq_dna_nodes (id, role, title, subtitle, fill, details, kb_url, lms_url) VALUES
  (6, 'leftTop',  'Agile Flows',   '(Value Streams)', 'white', NULL, '/marketplace/knowledge?dna=agile-flows', '/lms/courses?dna=agile-flows')
, (5, 'rightTop', 'Agile SOS',     '(Governance)',    'white', NULL, '/marketplace/knowledge?dna=agile-sos',   '/lms/courses?dna=agile-sos')
, (7, 'leftMid',  'Agile DTMF',    '(Products)',      'white', NULL, '/marketplace/knowledge?dna=agile-dtmf',  '/lms/courses?dna=agile-dtmf')
, (1, 'center',   'The Vision',    '(Purpose)',       'navy',  NULL, '/marketplace/knowledge?dna=vision',      '/lms/courses?dna=vision')
, (4, 'rightMid', 'Agile TMS',     '(Tasks)',         'white', NULL, '/marketplace/knowledge?dna=agile-tms',   '/lms/courses?dna=agile-tms')
, (2, 'leftBot',  'The HoV',       '(Culture)',       'navy',  NULL, '/marketplace/knowledge?dna=hov',         '/lms/courses?dna=hov')
, (3, 'rightBot', 'The Personas',  '(Identity)',      'navy',  NULL, '/marketplace/knowledge?dna=personas',    '/lms/courses?dna=personas')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, fill = EXCLUDED.fill, details = EXCLUDED.details, kb_url = EXCLUDED.kb_url, lms_url = EXCLUDED.lms_url;

-- ===== DQ DNA Callouts =====
INSERT INTO public.dq_dna_callouts (role, text, side) VALUES
  ('leftTop',  'How we orchestrate', 'left')
, ('rightTop', 'How we govern',      'right')
, ('leftMid',  'What we offer',      'left')
, ('rightMid', 'How we work',        'right')
, ('leftBot',  'How we behave',      'left')
, ('rightBot', 'Who we are',         'right')
, ('center',   'Why we exist',       'bottom');
