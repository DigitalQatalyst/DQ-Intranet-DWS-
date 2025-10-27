-- Simplified Guides schema: add new columns and indexes
-- Run this in Supabase SQL editor or via psql

alter table public.guides
  add column if not exists domain text,
  add column if not exists guide_type text,
  add column if not exists function_area text,
  add column if not exists status text default 'Approved',
  add column if not exists complexity_level text,
  add column if not exists body text,
  add column if not exists document_url text;

-- Helpful indexes for filtering
create index if not exists guides_domain_idx on public.guides (domain);
create index if not exists guides_guide_type_idx on public.guides (guide_type);
create index if not exists guides_function_area_idx on public.guides (function_area);

-- RLS: anon selects only Approved
alter table public.guides enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies p
    join pg_class c on c.oid = p.polrelid
    where c.relname = 'guides' and p.polname = 'guides_select_approved'
  ) then
    create policy guides_select_approved on public.guides
      for select using (status = 'Approved');
  end if;
end $$;
