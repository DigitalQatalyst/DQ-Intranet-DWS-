-- Create community_events table
-- Purpose: Store events for communities in the DQ Intranet
-- Affected tables: community_events (new table)
-- Considerations: Members can view events, authenticated members can create events, creators can update/delete their own events

-- Create community_events table
create table if not exists public.community_events (
  id uuid default gen_random_uuid() primary key,
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  event_time time,
  location text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_community_events_community_id on public.community_events(community_id);
create index if not exists idx_community_events_event_date on public.community_events(event_date);
create index if not exists idx_community_events_created_by on public.community_events(created_by);
create index if not exists idx_community_events_created_at on public.community_events(created_at desc);

-- Create function to update updated_at timestamp
create or replace function update_community_events_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_community_events_updated_at
  before update on public.community_events
  for each row
  execute function update_community_events_updated_at();

-- Enable Row Level Security
alter table public.community_events enable row level security;

-- RLS Policies for community_events

-- Policy: Anyone can view community events
create policy "Anyone can view community events"
  on public.community_events
  for select
  to anon, authenticated
  using (true);

-- Policy: Authenticated users can create events in communities they're members of
create policy "Members can create community events"
  on public.community_events
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.memberships
      where memberships.user_id = auth.uid()
      and memberships.community_id = community_events.community_id
    )
    and auth.uid() = created_by
  );

-- Policy: Users can update their own events
create policy "Users can update own community events"
  on public.community_events
  for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Policy: Users can delete their own events
create policy "Users can delete own community events"
  on public.community_events
  for delete
  to authenticated
  using (auth.uid() = created_by);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select on public.community_events to anon, authenticated;
grant insert, update, delete on public.community_events to authenticated;

-- Add comment to table
comment on table public.community_events is 'Events for communities in the DQ Intranet';
