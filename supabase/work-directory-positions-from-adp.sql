-- ============================================================================
-- Work Directory Positions from ADP Tracker
-- Complete list of positions organized by role family
-- ============================================================================

-- ===== Core Delivery & Product Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('product-owner-001', 'product-owner', 'Product Owner', 'Core Delivery & Product Roles', 'Active'),
('business-analyst-001', 'business-analyst', 'Business Analyst', 'Core Delivery & Product Roles', 'Active'),
('project-manager-001', 'project-manager', 'Project Manager', 'Core Delivery & Product Roles', 'Active'),
('delivery-lead-001', 'delivery-lead', 'Delivery Lead', 'Core Delivery & Product Roles', 'Active'),
('scrum-master-001', 'scrum-master', 'Scrum Master', 'Core Delivery & Product Roles', 'Active'),
('section-scrum-master-001', 'section-scrum-master', 'Section Scrum Master', 'Core Delivery & Product Roles', 'Active'),
('unit-lead-001', 'unit-lead', 'Unit Lead', 'Core Delivery & Product Roles', 'Active'),
('sector-lead-001', 'sector-lead', 'Sector Lead', 'Core Delivery & Product Roles', 'Active'),
('factory-lead-001', 'factory-lead', 'Factory Lead', 'Core Delivery & Product Roles', 'Active'),
('tower-lead-001', 'tower-lead', 'Tower Lead', 'Core Delivery & Product Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Design & UX Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('ui-ux-designer-001', 'ui-ux-designer', 'UI/UX Designer', 'Design & UX Roles', 'Active'),
('product-designer-001', 'product-designer', 'Product Designer', 'Design & UX Roles', 'Active'),
('visual-designer-001', 'visual-designer', 'Visual Designer', 'Design & UX Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Engineering Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('solution-engineer-001', 'solution-engineer', 'Solution Engineer', 'Engineering Roles', 'Active'),
('feature-developer-001', 'feature-developer', 'Feature Developer', 'Engineering Roles', 'Active'),
('functionality-developer-001', 'functionality-developer', 'Functionality Developer', 'Engineering Roles', 'Active'),
('endpoint-developer-001', 'endpoint-developer', 'Endpoint Developer', 'Engineering Roles', 'Active'),
('frontend-developer-001', 'frontend-developer', 'Frontend Developer', 'Engineering Roles', 'Active'),
('backend-developer-001', 'backend-developer', 'Backend Developer', 'Engineering Roles', 'Active'),
('full-stack-developer-001', 'full-stack-developer', 'Full-Stack Developer', 'Engineering Roles', 'Active'),
('devops-engineer-001', 'devops-engineer', 'DevOps Engineer', 'Engineering Roles', 'Active'),
('crm-engineer-001', 'crm-engineer', 'CRM Engineer', 'Engineering Roles', 'Active'),
('automation-engineer-001', 'automation-engineer', 'Automation Engineer', 'Engineering Roles', 'Active'),
('ai-developer-001', 'ai-developer', 'AI Developer', 'Engineering Roles', 'Active'),
('mobile-ai-developer-001', 'mobile-ai-developer', 'Mobile & AI Developer', 'Engineering Roles', 'Active'),
('energy-management-engineer-001', 'energy-management-engineer', 'Energy/Energy Management Engineer', 'Engineering Roles', 'Active'),
('industrial-automation-engineer-001', 'industrial-automation-engineer', 'Industrial Automation Engineer', 'Engineering Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Platform / Operations / TechOps Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('techops-analyst-001', 'techops-analyst', 'TechOps Analyst', 'Platform / Operations / TechOps Roles', 'Active'),
('platforms-operations-developer-001', 'platforms-operations-developer', 'Platforms & Operations Developer', 'Platform / Operations / TechOps Roles', 'Active'),
('it-support-analyst-001', 'it-support-analyst', 'IT Support Analyst', 'Platform / Operations / TechOps Roles', 'Active'),
('support-analyst-001', 'support-analyst', 'Support Analyst', 'Platform / Operations / TechOps Roles', 'Active'),
('operations-analyst-001', 'operations-analyst', 'Operations Analyst', 'Platform / Operations / TechOps Roles', 'Active'),
('admin-analyst-001', 'admin-analyst', 'Admin Analyst', 'Platform / Operations / TechOps Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Data / Intelligence Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('data-analyst-001', 'data-analyst', 'Data Analyst', 'Data / Intelligence Roles', 'Active'),
('data-engineer-001', 'data-engineer', 'Data Engineer', 'Data / Intelligence Roles', 'Active'),
('insight-specialist-001', 'insight-specialist', 'Insight Specialist', 'Data / Intelligence Roles', 'Active'),
('architect-engineer-001', 'architect-engineer', 'Architect Engineer', 'Data / Intelligence Roles', 'Active'),
('digital-business-architect-001', 'digital-business-architect', 'Digital Business Architect', 'Data / Intelligence Roles', 'Active'),
('enterprise-architect-001', 'enterprise-architect', 'Enterprise Architect', 'Data / Intelligence Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Business / Commercial Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('bd-analyst-001', 'bd-analyst', 'BD Analyst', 'Business / Commercial Roles', 'Active'),
('bd-executive-001', 'bd-executive', 'BD Executive', 'Business / Commercial Roles', 'Active'),
('marketing-comms-lead-001', 'marketing-comms-lead', 'Marketing & Comms Lead', 'Business / Commercial Roles', 'Active'),
('digital-marketer-001', 'digital-marketer', 'Digital Marketer', 'Business / Commercial Roles', 'Active'),
('content-analyst-001', 'content-analyst', 'Content Analyst', 'Business / Commercial Roles', 'Active'),
('content-specialist-001', 'content-specialist', 'Content Specialist', 'Business / Commercial Roles', 'Active'),
('business-development-lead-001', 'business-development-lead', 'Business Development Lead', 'Business / Commercial Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== HR / People Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('hr-analyst-001', 'hr-analyst', 'HR Analyst', 'HR / People Roles', 'Active'),
('hr-admin-001', 'hr-admin', 'HR Admin', 'HR / People Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Specialized Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('cybersecurity-analyst-001', 'cybersecurity-analyst', 'Cybersecurity Analyst', 'Specialized Roles', 'Active'),
('cyber-security-analyst-001', 'cyber-security-analyst', 'Cyber Security Analyst', 'Specialized Roles', 'Active'),
('soc-analyst-001', 'soc-analyst', 'SOC Analyst', 'Specialized Roles', 'Active'),
('governance-analyst-001', 'governance-analyst', 'Governance Analyst', 'Specialized Roles', 'Active'),
('productivity-analyst-001', 'productivity-analyst', 'Productivity Analyst', 'Specialized Roles', 'Active'),
('finance-analyst-001', 'finance-analyst', 'Finance Analyst', 'Specialized Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- ===== Leadership Roles =====
INSERT INTO public.work_positions (id, slug, position_name, role_family, status) VALUES
('lead-567-001', 'lead-567-organisation', 'Lead (567 | Organisation)', 'Leadership Roles', 'Active'),
('lead-345-001', 'lead-345-area-sector', 'Lead (345 | Area | Sector)', 'Leadership Roles', 'Active'),
('lead-234-001', 'lead-234-factory-unit', 'Lead (234 | Factory | Unit)', 'Leadership Roles', 'Active'),
('lead-123-001', 'lead-123-tower-section', 'Lead (123 | Tower | Section)', 'Leadership Roles', 'Active'),
('lead-012-001', 'lead-012-squad-initiative', 'Lead (012 | Squad | Initiative)', 'Leadership Roles', 'Active')
ON CONFLICT (id) DO UPDATE SET
  position_name = EXCLUDED.position_name,
  role_family = EXCLUDED.role_family,
  status = EXCLUDED.status;

-- Verify import
SELECT 
  role_family,
  COUNT(*) as position_count,
  STRING_AGG(position_name, ', ' ORDER BY position_name) as positions
FROM work_positions
WHERE role_family IS NOT NULL
GROUP BY role_family
ORDER BY role_family;
