-- ============================================================================
-- Recreate Work Positions Table with Correct Structure
-- This script will DROP the existing table and create a new one with proper structure
-- WARNING: This will DELETE all existing position data!
-- ============================================================================

-- ===== STEP 1: Drop Existing Table and Dependencies =====
-- Drop the table (this will also drop indexes and policies)
DROP TABLE IF EXISTS public.work_positions CASCADE;

-- ===== STEP 2: Create New Table with Correct Structure =====
CREATE TABLE public.work_positions (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  position_name text NOT NULL,
  hero_title text,
  role_family text NOT NULL,  -- Required: Core Delivery & Product Roles, Engineering Roles, etc.
  unit text,
  unit_slug text,
  location text,  -- DXB, NBO, KSA, Remote, Global, or specific city
  sfia_level text,  -- L0, L1, L2, L3, L4, L5, L6, L7
  sfia_rating text,  -- Alternative rating system
  summary text,
  description text,
  responsibilities text[] DEFAULT '{}',
  expectations text,
  status text NOT NULL DEFAULT 'Active',  -- Active, Inactive, Archived
  image_url text,
  banner_image_url text,
  department text,  -- Operations, etc.
  contract_type text,  -- Full-time, Part-time, Contract, etc.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== STEP 3: Create Indexes for Performance =====
CREATE INDEX idx_work_positions_unit ON public.work_positions(unit);
CREATE INDEX idx_work_positions_location ON public.work_positions(location);
CREATE INDEX idx_work_positions_slug ON public.work_positions(slug);
CREATE INDEX idx_work_positions_role_family ON public.work_positions(role_family);
CREATE INDEX idx_work_positions_status ON public.work_positions(status);
CREATE INDEX idx_work_positions_sfia_level ON public.work_positions(sfia_level);

-- ===== STEP 4: Enable Row Level Security =====
ALTER TABLE public.work_positions ENABLE ROW LEVEL SECURITY;

-- ===== STEP 5: Create RLS Policies =====
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to work_positions" ON public.work_positions;

-- Allow public read access
CREATE POLICY "Allow public read access to work_positions"
  ON public.work_positions
  FOR SELECT
  USING (true);

-- ===== STEP 6: Add Table Comment =====
COMMENT ON TABLE public.work_positions IS 'Job positions and roles available at DQ, organized by role family';

-- ===== STEP 7: Insert Positions from ADP Tracker =====
-- Core Delivery & Product Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('product-owner-001', 'product-owner', 'Product Owner', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('business-analyst-001', 'business-analyst', 'Business Analyst', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('project-manager-001', 'project-manager', 'Project Manager', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('delivery-lead-001', 'delivery-lead', 'Delivery Lead', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('scrum-master-001', 'scrum-master', 'Scrum Master', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('section-scrum-master-001', 'section-scrum-master', 'Section Scrum Master', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('unit-lead-001', 'unit-lead', 'Unit Lead', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('sector-lead-001', 'sector-lead', 'Sector Lead', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('factory-lead-001', 'factory-lead', 'Factory Lead', 'Core Delivery & Product Roles', 'Active', 'Operations'),
('tower-lead-001', 'tower-lead', 'Tower Lead', 'Core Delivery & Product Roles', 'Active', 'Operations');

-- Design & UX Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('ui-ux-designer-001', 'ui-ux-designer', 'UI/UX Designer', 'Design & UX Roles', 'Active', 'Operations'),
('product-designer-001', 'product-designer', 'Product Designer', 'Design & UX Roles', 'Active', 'Operations'),
('visual-designer-001', 'visual-designer', 'Visual Designer', 'Design & UX Roles', 'Active', 'Operations');

-- Engineering Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('solution-engineer-001', 'solution-engineer', 'Solution Engineer', 'Engineering Roles', 'Active', 'Operations'),
('feature-developer-001', 'feature-developer', 'Feature Developer', 'Engineering Roles', 'Active', 'Operations'),
('functionality-developer-001', 'functionality-developer', 'Functionality Developer', 'Engineering Roles', 'Active', 'Operations'),
('endpoint-developer-001', 'endpoint-developer', 'Endpoint Developer', 'Engineering Roles', 'Active', 'Operations'),
('frontend-developer-001', 'frontend-developer', 'Frontend Developer', 'Engineering Roles', 'Active', 'Operations'),
('backend-developer-001', 'backend-developer', 'Backend Developer', 'Engineering Roles', 'Active', 'Operations'),
('full-stack-developer-001', 'full-stack-developer', 'Full-Stack Developer', 'Engineering Roles', 'Active', 'Operations'),
('devops-engineer-001', 'devops-engineer', 'DevOps Engineer', 'Engineering Roles', 'Active', 'Operations'),
('crm-engineer-001', 'crm-engineer', 'CRM Engineer', 'Engineering Roles', 'Active', 'Operations'),
('automation-engineer-001', 'automation-engineer', 'Automation Engineer', 'Engineering Roles', 'Active', 'Operations'),
('ai-developer-001', 'ai-developer', 'AI Developer', 'Engineering Roles', 'Active', 'Operations'),
('mobile-ai-developer-001', 'mobile-ai-developer', 'Mobile & AI Developer', 'Engineering Roles', 'Active', 'Operations'),
('energy-management-engineer-001', 'energy-management-engineer', 'Energy/Energy Management Engineer', 'Engineering Roles', 'Active', 'Operations'),
('industrial-automation-engineer-001', 'industrial-automation-engineer', 'Industrial Automation Engineer', 'Engineering Roles', 'Active', 'Operations');

-- Platform / Operations / TechOps Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('techops-analyst-001', 'techops-analyst', 'TechOps Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('platforms-operations-developer-001', 'platforms-operations-developer', 'Platforms & Operations Developer', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('it-support-analyst-001', 'it-support-analyst', 'IT Support Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('support-analyst-001', 'support-analyst', 'Support Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('operations-analyst-001', 'operations-analyst', 'Operations Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('admin-analyst-001', 'admin-analyst', 'Admin Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations');

-- Data / Intelligence Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('data-analyst-001', 'data-analyst', 'Data Analyst', 'Data / Intelligence Roles', 'Active', 'Operations'),
('data-engineer-001', 'data-engineer', 'Data Engineer', 'Data / Intelligence Roles', 'Active', 'Operations'),
('insight-specialist-001', 'insight-specialist', 'Insight Specialist', 'Data / Intelligence Roles', 'Active', 'Operations'),
('architect-engineer-001', 'architect-engineer', 'Architect Engineer', 'Data / Intelligence Roles', 'Active', 'Operations'),
('digital-business-architect-001', 'digital-business-architect', 'Digital Business Architect', 'Data / Intelligence Roles', 'Active', 'Operations'),
('enterprise-architect-001', 'enterprise-architect', 'Enterprise Architect', 'Data / Intelligence Roles', 'Active', 'Operations');

-- Business / Commercial Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('bd-analyst-001', 'bd-analyst', 'BD Analyst', 'Business / Commercial Roles', 'Active', 'Operations'),
('bd-executive-001', 'bd-executive', 'BD Executive', 'Business / Commercial Roles', 'Active', 'Operations'),
('marketing-comms-lead-001', 'marketing-comms-lead', 'Marketing & Comms Lead', 'Business / Commercial Roles', 'Active', 'Operations'),
('digital-marketer-001', 'digital-marketer', 'Digital Marketer', 'Business / Commercial Roles', 'Active', 'Operations'),
('content-analyst-001', 'content-analyst', 'Content Analyst', 'Business / Commercial Roles', 'Active', 'Operations'),
('content-specialist-001', 'content-specialist', 'Content Specialist', 'Business / Commercial Roles', 'Active', 'Operations'),
('business-development-lead-001', 'business-development-lead', 'Business Development Lead', 'Business / Commercial Roles', 'Active', 'Operations');

-- HR / People Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('hr-analyst-001', 'hr-analyst', 'HR Analyst', 'HR / People Roles', 'Active', 'Operations'),
('hr-admin-001', 'hr-admin', 'HR Admin', 'HR / People Roles', 'Active', 'Operations');

-- Specialized Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('cybersecurity-analyst-001', 'cybersecurity-analyst', 'Cybersecurity Analyst', 'Specialized Roles', 'Active', 'Operations'),
('cyber-security-analyst-001', 'cyber-security-analyst', 'Cyber Security Analyst', 'Specialized Roles', 'Active', 'Operations'),
('soc-analyst-001', 'soc-analyst', 'SOC Analyst', 'Specialized Roles', 'Active', 'Operations'),
('governance-analyst-001', 'governance-analyst', 'Governance Analyst', 'Specialized Roles', 'Active', 'Operations'),
('productivity-analyst-001', 'productivity-analyst', 'Productivity Analyst', 'Specialized Roles', 'Active', 'Operations'),
('finance-analyst-001', 'finance-analyst', 'Finance Analyst', 'Specialized Roles', 'Active', 'Operations');

-- Leadership Roles
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('lead-567-001', 'lead-567-organisation', 'Lead (567 | Organisation)', 'Leadership Roles', 'Active', 'Operations'),
('lead-345-001', 'lead-345-area-sector', 'Lead (345 | Area | Sector)', 'Leadership Roles', 'Active', 'Operations'),
('lead-234-001', 'lead-234-factory-unit', 'Lead (234 | Factory | Unit)', 'Leadership Roles', 'Active', 'Operations'),
('lead-123-001', 'lead-123-tower-section', 'Lead (123 | Tower | Section)', 'Leadership Roles', 'Active', 'Operations'),
('lead-012-001', 'lead-012-squad-initiative', 'Lead (012 | Squad | Initiative)', 'Leadership Roles', 'Active', 'Operations');

-- ===== STEP 8: Verify Data =====
-- Check how many positions were inserted
SELECT 
  role_family,
  COUNT(*) as position_count
FROM public.work_positions
GROUP BY role_family
ORDER BY role_family;

-- Show total count
SELECT COUNT(*) as total_positions FROM public.work_positions;


