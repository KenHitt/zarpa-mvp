create table public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null,
  event_name text not null check (event_name in ('page_view','experience_added','hotel_selected','checkout_started','booking_created')),
  path text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index analytics_events_event_created_idx on public.analytics_events(event_name, created_at desc);
create index analytics_events_session_idx on public.analytics_events(session_id, created_at);
alter table public.analytics_events enable row level security;

-- Métrica diaria lista para consultar desde SQL Editor o un futuro panel interno.
create view public.analytics_funnel_daily as
select date_trunc('day', created_at)::date as day,
  count(distinct session_id) filter (where event_name = 'page_view') as visitors,
  count(distinct session_id) filter (where event_name in ('experience_added','hotel_selected')) as trips_started,
  count(distinct session_id) filter (where event_name = 'checkout_started') as checkout_started,
  count(distinct session_id) filter (where event_name = 'booking_created') as bookings
from public.analytics_events group by 1 order by 1 desc;
