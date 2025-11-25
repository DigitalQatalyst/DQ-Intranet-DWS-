-- Example seed values for unit performance
-- Copy/paste into Supabase SQL editor as needed

UPDATE public.work_units
SET
  performance_status = 'on_track',
  performance_score = 82,
  performance_updated_at = now()
WHERE slug = 'dq-delivery-deploys';

UPDATE public.work_units
SET
  performance_status = 'on_track',
  performance_score = 88,
  performance_updated_at = now()
WHERE slug = 'dq-delivery-designs';

UPDATE public.work_units
SET
  performance_status = 'at_risk',
  performance_score = 65,
  performance_updated_at = now()
WHERE slug = 'coe-lead';
