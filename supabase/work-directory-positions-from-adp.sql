-- ============================================================================
-- Work Directory Positions from ADP Tracker
-- Complete list of positions organized by role family
-- ============================================================================

-- IMPORTANT: Run supabase/fix-work-positions-department.sql first if you get
-- a NOT NULL constraint error on the department column

-- ===== Core Delivery & Product Roles =====
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
('tower-lead-001', 'tower-lead', 'Tower Lead', 'Core Delivery & Product Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Design & UX Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('ui-ux-designer-001', 'ui-ux-designer', 'UI/UX Designer', 'Design & UX Roles', 'Active', 'Operations'),
('product-designer-001', 'product-designer', 'Product Designer', 'Design & UX Roles', 'Active', 'Operations'),
('visual-designer-001', 'visual-designer', 'Visual Designer', 'Design & UX Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Engineering Roles =====
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
('industrial-automation-engineer-001', 'industrial-automation-engineer', 'Industrial Automation Engineer', 'Engineering Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Platform / Operations / TechOps Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('techops-analyst-001', 'techops-analyst', 'TechOps Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('platforms-operations-developer-001', 'platforms-operations-developer', 'Platforms & Operations Developer', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('it-support-analyst-001', 'it-support-analyst', 'IT Support Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('support-analyst-001', 'support-analyst', 'Support Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('operations-analyst-001', 'operations-analyst', 'Operations Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations'),
('admin-analyst-001', 'admin-analyst', 'Admin Analyst', 'Platform / Operations / TechOps Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Data / Intelligence Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('data-analyst-001', 'data-analyst', 'Data Analyst', 'Data / Intelligence Roles', 'Active', 'Operations'),
('data-engineer-001', 'data-engineer', 'Data Engineer', 'Data / Intelligence Roles', 'Active', 'Operations'),
('insight-specialist-001', 'insight-specialist', 'Insight Specialist', 'Data / Intelligence Roles', 'Active', 'Operations'),
('architect-engineer-001', 'architect-engineer', 'Architect Engineer', 'Data / Intelligence Roles', 'Active', 'Operations'),
('digital-business-architect-001', 'digital-business-architect', 'Digital Business Architect', 'Data / Intelligence Roles', 'Active', 'Operations'),
('enterprise-architect-001', 'enterprise-architect', 'Enterprise Architect', 'Data / Intelligence Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Business / Commercial Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('bd-analyst-001', 'bd-analyst', 'BD Analyst', 'Business / Commercial Roles', 'Active', 'Operations'),
('bd-executive-001', 'bd-executive', 'BD Executive', 'Business / Commercial Roles', 'Active', 'Operations'),
('marketing-comms-lead-001', 'marketing-comms-lead', 'Marketing & Comms Lead', 'Business / Commercial Roles', 'Active', 'Operations'),
('digital-marketer-001', 'digital-marketer', 'Digital Marketer', 'Business / Commercial Roles', 'Active', 'Operations'),
('content-analyst-001', 'content-analyst', 'Content Analyst', 'Business / Commercial Roles', 'Active', 'Operations'),
('content-specialist-001', 'content-specialist', 'Content Specialist', 'Business / Commercial Roles', 'Active', 'Operations'),
('business-development-lead-001', 'business-development-lead', 'Business Development Lead', 'Business / Commercial Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== HR / People Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('hr-analyst-001', 'hr-analyst', 'HR Analyst', 'HR / People Roles', 'Active', 'Operations'),
('hr-admin-001', 'hr-admin', 'HR Admin', 'HR / People Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Specialized Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('cybersecurity-analyst-001', 'cybersecurity-analyst', 'Cybersecurity Analyst', 'Specialized Roles', 'Active', 'Operations'),
('cyber-security-analyst-001', 'cyber-security-analyst', 'Cyber Security Analyst', 'Specialized Roles', 'Active', 'Operations'),
('soc-analyst-001', 'soc-analyst', 'SOC Analyst', 'Specialized Roles', 'Active', 'Operations'),
('governance-analyst-001', 'governance-analyst', 'Governance Analyst', 'Specialized Roles', 'Active', 'Operations'),
('productivity-analyst-001', 'productivity-analyst', 'Productivity Analyst', 'Specialized Roles', 'Active', 'Operations'),
('finance-analyst-001', 'finance-analyst', 'Finance Analyst', 'Specialized Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- ===== Leadership Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status, department) VALUES
('lead-567-001', 'lead-567-organisation', 'Lead (567 | Organisation)', 'Leadership Roles', 'Active', 'Operations'),
('lead-345-001', 'lead-345-area-sector', 'Lead (345 | Area | Sector)', 'Leadership Roles', 'Active', 'Operations'),
('lead-234-001', 'lead-234-factory-unit', 'Lead (234 | Factory | Unit)', 'Leadership Roles', 'Active', 'Operations'),
('lead-123-001', 'lead-123-tower-section', 'Lead (123 | Tower | Section)', 'Leadership Roles', 'Active', 'Operations'),
('lead-012-001', 'lead-012-squad-initiative', 'Lead (012 | Squad | Initiative)', 'Leadership Roles', 'Active', 'Operations')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status,
  department = EXCLUDED.department;

-- Verify import
SELECT 
  role_family,
  COUNT(*) as position_count,
  STRING_AGG(position_name, ', ' ORDER BY position_name) as positions
FROM work_positions
WHERE role_family IS NOT NULL
GROUP BY role_family
ORDER BY role_family;
