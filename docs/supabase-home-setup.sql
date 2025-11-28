-- Supabase schema for homepage content and request capture.
-- Adjust types as needed; run in SQL editor.

-- SERVICES
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null,
  path text,
  icon text,
  tags text[],
  is_active boolean default true,
  "order" int,
  updated_at timestamptz default now()
);
create index if not exists services_category_idx on public.services(category);
create index if not exists services_active_idx on public.services(is_active);

-- STORIES
create table if not exists public.stories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  image text,
  author text,
  published_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists stories_published_idx on public.stories(published_at desc);

-- NEWS
create table if not exists public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  link text,
  type text,
  published_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists news_published_idx on public.news(published_at desc);

-- EVENTS
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  link text,
  created_at timestamptz default now()
);
create index if not exists events_starts_idx on public.events(starts_at asc);

-- JOURNEYS
create table if not exists public.journeys (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text,
  stage text,
  "order" int,
  cta_label text,
  cta_link text,
  created_at timestamptz default now()
);
create index if not exists journeys_order_idx on public.journeys("order" asc);

-- REQUESTS (for CTAs/forms)
create table if not exists public.requests (
  id uuid default gen_random_uuid() primary key,
  type text check (type in ('workspace','access','demo','support')) not null,
  name text not null,
  email text not null,
  message text,
  metadata jsonb,
  status text default 'new',
  created_at timestamptz default now()
);
create index if not exists requests_type_idx on public.requests(type);
create index if not exists requests_created_idx on public.requests(created_at desc);

-- Basic full-text search over services/stories/journeys.
create or replace function public.search_home_content(query text)
returns table(id text, title text, type text, description text, link text) as $$
  select id::text, title, 'service'::text, description, coalesce(path, '#')
  from public.services
  where is_active = true
    and to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')) @@ plainto_tsquery(query)
  union all
  select id::text, title, 'journey', summary, coalesce(cta_link, '#')
  from public.journeys
  where to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'')) @@ plainto_tsquery(query)
  union all
  select id::text, title, 'story', excerpt, '#'
  from public.stories
  where published_at is not null and published_at <= now()
    and to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')) @@ plainto_tsquery(query);
$$ language sql stable;

-- ---------------- RLS ----------------
alter table public.services enable row level security;
alter table public.stories enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.journeys enable row level security;
alter table public.requests enable row level security;

-- Public selects for published/active content.
create policy services_read on public.services
  for select using (is_active = true);
create policy stories_read on public.stories
  for select using (published_at is not null and published_at <= now());
create policy news_read on public.news
  for select using (published_at is not null and published_at <= now());
create policy events_read on public.events
  for select using (true);
create policy journeys_read on public.journeys
  for select using (true);

-- Requests: allow inserts from anon; no public read/update/delete.
create policy requests_insert on public.requests
  for insert with check (true);
