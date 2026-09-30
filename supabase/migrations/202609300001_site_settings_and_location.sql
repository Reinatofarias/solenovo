create table if not exists public.site_settings (
  id text primary key,
  announcement_enabled boolean not null default true,
  announcement_left text not null default '',
  announcement_center text not null default '',
  announcement_right text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (
  id, announcement_enabled, announcement_left, announcement_center, announcement_right
) values (
  'main',
  true,
  'Alta Camisaria · Coleção Autoral em Preparação',
  'Algodão Nobre & Linho Italiano · Corte sob Medida',
  'Atelier São Paulo'
) on conflict (id) do nothing;

create table if not exists public.visitor_location_events (
  id bigint generated always as identity primary key,
  country text not null,
  region text not null,
  city text not null,
  viewed_at timestamptz not null default now()
);

create index if not exists visitor_location_events_viewed_at_idx
  on public.visitor_location_events (viewed_at desc);

alter table public.site_settings enable row level security;
alter table public.visitor_location_events enable row level security;
revoke all on public.site_settings from anon, authenticated;
revoke all on public.visitor_location_events from anon, authenticated;
grant all on public.site_settings to service_role;
grant all on public.visitor_location_events to service_role;
grant usage, select on sequence public.visitor_location_events_id_seq to service_role;

create or replace function public.location_summary(p_days integer default 30)
returns table(country text, region text, city text, views bigint)
language sql
security definer
set search_path = public
as $$
  select
    visitor_location_events.country,
    visitor_location_events.region,
    visitor_location_events.city,
    count(*) as views
  from public.visitor_location_events
  where viewed_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
  group by 1, 2, 3
  order by views desc, country, region, city;
$$;

revoke all on function public.location_summary(integer) from public, anon, authenticated;
grant execute on function public.location_summary(integer) to service_role;
