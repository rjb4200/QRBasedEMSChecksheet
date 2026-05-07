create table if not exists public.shift_calendar (
  id uuid primary key default gen_random_uuid(),
  operational_date date not null unique,
  shift_name text not null check (shift_name in ('1st Shift', '2nd Shift', '3rd Shift')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

insert into public.shift_calendar (operational_date, shift_name, starts_at, ends_at)
select
  day::date as operational_date,
  case mod((day::date - date '2026-05-08')::integer, 3)
    when 0 then '1st Shift'
    when 1 then '2nd Shift'
    else '3rd Shift'
  end as shift_name,
  (day::date + time '06:00') at time zone 'America/New_York' as starts_at,
  (day::date + interval '1 day' + time '06:00') at time zone 'America/New_York' as ends_at
from generate_series(date '2026-01-01', date '2030-12-31', interval '1 day') as day
on conflict (operational_date) do update set
  shift_name = excluded.shift_name,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at;

alter table public.shift_calendar enable row level security;

drop policy if exists "authenticated users can read shift calendar" on public.shift_calendar;
drop policy if exists "admins can manage shift calendar" on public.shift_calendar;

create policy "authenticated users can read shift calendar" on public.shift_calendar for select using (auth.uid() is not null);
create policy "admins can manage shift calendar" on public.shift_calendar for all using (public.is_admin()) with check (public.is_admin());

alter table public.compartment_checks add column if not exists started_at timestamptz;
alter table public.compartment_checks add column if not exists submitted_at timestamptz;
alter table public.compartment_checks add column if not exists time_to_complete_seconds integer;

update public.compartment_checks
set started_at = coalesce(started_at, created_at),
    submitted_at = coalesce(submitted_at, completed_at),
    time_to_complete_seconds = coalesce(time_to_complete_seconds, greatest(0, extract(epoch from (completed_at - created_at))::integer))
where started_at is null
   or (completed_at is not null and submitted_at is null)
   or (completed_at is not null and time_to_complete_seconds is null);

alter table public.shift_archives add column if not exists operational_date date;
alter table public.shift_archives add column if not exists shift_id uuid references public.shift_calendar(id) on delete set null;
alter table public.shift_archives add column if not exists started_at timestamptz;
alter table public.shift_archives add column if not exists submitted_at timestamptz;
alter table public.shift_archives add column if not exists last_activity_at timestamptz;
alter table public.shift_archives add column if not exists time_to_complete_seconds integer;
alter table public.shift_archives add column if not exists checked_by uuid references public.users(id) on delete set null;

update public.shift_archives archive
set operational_date = coalesce(archive.operational_date, archive.shift_date),
    shift_id = coalesce(archive.shift_id, calendar.id)
from public.shift_calendar calendar
where calendar.operational_date = archive.shift_date
  and (archive.operational_date is null or archive.shift_id is null);

create index if not exists shift_calendar_operational_date_idx on public.shift_calendar (operational_date);
create index if not exists compartment_checks_timing_idx on public.compartment_checks (shift_date, shift_period, unit_id, started_at, submitted_at);
create index if not exists shift_archives_operational_shift_idx on public.shift_archives (operational_date, shift_id);
