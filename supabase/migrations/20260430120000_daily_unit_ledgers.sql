create table if not exists public.daily_unit_ledgers (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  shift_period public.shift_period not null,
  unit_id uuid not null,
  unit_name text not null,
  unit_status text not null,
  total_compartments integer not null default 0,
  created_at timestamptz not null default now(),
  unique (shift_date, shift_period, unit_id)
);

create index if not exists daily_unit_ledgers_shift_idx on public.daily_unit_ledgers (shift_date desc, shift_period);

alter table public.daily_unit_ledgers enable row level security;

create policy "supervisors can read daily unit ledgers" on public.daily_unit_ledgers for select using (public.is_supervisor_or_admin());
create policy "admins can manage daily unit ledgers" on public.daily_unit_ledgers for all using (public.is_admin()) with check (public.is_admin());
