-- Guides performance: indexes, tsvector, materialized view, RPC
-- Run in Supabase SQL editor or via psql. Idempotent where possible.

-- Extensions
create extension if not exists pg_trgm;

-- 1) Helpful btree indexes
create index if not exists guides_status_domain_idx on public.guides (status, domain);
create index if not exists guides_guide_type_idx on public.guides (guide_type);
create index if not exists guides_function_area_idx on public.guides (function_area);
-- For updated sorting; include desc explicitly in queries; index still helps
create index if not exists guides_updated_at_idx on public.guides (last_updated_at desc);
-- Fast lookup by slug
create unique index if not exists guides_slug_uniq on public.guides (slug);

-- 2) Full‑text search tsvector (generated) + GIN
alter table public.guides
  add column if not exists search_tsv tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(body,'')), 'C')
  ) stored;

create index if not exists guides_search_tsv_gin on public.guides using gin (search_tsv);

-- Optional fuzzy title search
create index if not exists guides_title_trgm_gin on public.guides using gin (title gin_trgm_ops);

-- 3) Flattened search materialized view
-- Note: use materialized for performance; provides stable snapshot for cursoring
create materialized view if not exists public.guides_search_mv as
  select
    g.id,
    g.slug,
    g.title,
    g.summary,
    g.hero_image_url,
    g.domain,
    g.guide_type,
    g.function_area,
    g.status,
    g.last_updated_at as updated_at,
    g.download_count,
    g.search_tsv as tsv
  from public.guides g
  where true
  with no data;

-- Unique index to allow concurrent refresh and cursor pagination
create unique index if not exists guides_search_mv_id_uniq on public.guides_search_mv (id);
create index if not exists guides_search_mv_updated_idx on public.guides_search_mv (updated_at desc, id);
create index if not exists guides_search_mv_downloads_idx on public.guides_search_mv (download_count desc, id);
create index if not exists guides_search_mv_domain_idx on public.guides_search_mv (domain);
create index if not exists guides_search_mv_type_idx on public.guides_search_mv (guide_type);
create index if not exists guides_search_mv_function_idx on public.guides_search_mv (function_area);
create index if not exists guides_search_mv_status_idx on public.guides_search_mv (status);
create index if not exists guides_search_mv_tsv_gin on public.guides_search_mv using gin (tsv);

-- Helper function to refresh MV concurrently
create or replace function public.refresh_guides_search_mv() returns void
language plpgsql security definer as $$
begin
  perform 1; -- no-op to ensure function body not empty
  begin
    refresh materialized view concurrently public.guides_search_mv;
  exception when feature_not_supported then
    -- concurrent refresh requires unique index; if not available, fallback
    refresh materialized view public.guides_search_mv;
  end;
end; $$;

-- Trigger to refresh on content changes (lightweight, debounced by transaction)
drop trigger if exists trg_refresh_guides_search_mv on public.guides;
create trigger trg_refresh_guides_search_mv
after insert or update or delete on public.guides
for each statement execute procedure public.refresh_guides_search_mv();

-- 4) Cursor‑based search RPC
-- Cursor is a base64 JSON: {"k":"updated"|"downloads","t":"ISO-8601","id":"uuid"}
create or replace function public.rpc_guides_search(
  q text,
  domains text[],
  types text[],
  functions text[],
  status_filter text,
  sort text,
  limit_count int,
  after text
) returns table (
  id uuid,
  slug text,
  title text,
  summary text,
  hero_image_url text,
  domain text,
  guide_type text,
  function_area text,
  status text,
  updated_at timestamptz,
  download_count int,
  cursor text,
  has_more boolean
) language plpgsql security definer as $$
declare
  use_downloads boolean := (coalesce(sort,'') = 'downloads');
  cur_key text;
  cur_time timestamptz;
  cur_id uuid;
  rows int := 0;
begin
  -- Decode cursor if provided
  if after is not null and length(after) > 0 then
    begin
      select (payload->>'k')::text, (payload->>'t')::timestamptz, (payload->>'id')::uuid
      into cur_key, cur_time, cur_id
      from (select convert_from(decode(after, 'base64'), 'utf8')::jsonb as payload) t;
    exception when others then
      cur_key := null; cur_time := null; cur_id := null;
    end;
  end if;

  return query
  with base as (
    select * from public.guides_search_mv v
    where (q is null or length(q) = 0 or v.tsv @@ websearch_to_tsquery('english', q))
      and (status_filter is null or length(status_filter) = 0 or v.status = status_filter)
      and (domains is null or array_length(domains,1) is null or v.domain = any(domains))
      and (types is null or array_length(types,1) is null or v.guide_type = any(types))
      and (functions is null or array_length(functions,1) is null or v.function_area = any(functions))
      and (v.status = 'Approved')
  ), paged as (
    select * from base
    where (
      case
        when use_downloads and cur_time is not null and cur_id is not null then (download_count, id) < (select download_count, cur_id from base b where b.id = cur_id limit 1)
        when not use_downloads and cur_time is not null and cur_id is not null then (updated_at, id) < (cur_time, cur_id)
        else true
      end
    )
    order by
      case when use_downloads then download_count end desc nulls last,
      updated_at desc,
      id desc
    limit coalesce(limit_count, 24)
  )
  select
    p.id, p.slug, p.title, p.summary, p.hero_image_url, p.domain, p.guide_type, p.function_area, p.status, p.updated_at, p.download_count,
    encode(convert_to(jsonb_build_object('k', case when use_downloads then 'downloads' else 'updated' end, 't', p.updated_at, 'id', p.id)::text, 'utf8'),'base64') as cursor,
    exists(select 1 from base b
           where (
             case when use_downloads then (b.download_count, b.id) < (p.download_count, p.id)
                  else (b.updated_at, b.id) < (p.updated_at, p.id) end
           ) limit 1) as has_more
  from paged p;
end; $$;

-- Grant execute to anon, authenticated
do $$
begin
  grant execute on function public.rpc_guides_search(text, text[], text[], text[], text, text, int, text) to anon, authenticated;
exception when others then null; end $$;

