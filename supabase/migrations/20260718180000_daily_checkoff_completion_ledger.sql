create table public.daily_checkoff_summaries (
  shift_date date not null,
  shift_period public.shift_period not null default 'daily',
  summary_state text not null default 'live' check (summary_state in ('live', 'finalized', 'reconstructed')),
  required_actions integer not null default 0,
  completed_actions integer not null default 0,
  required_units integer not null default 0,
  completed_units integer not null default 0,
  initialized_at timestamptz not null default now(),
  finalized_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (shift_date, shift_period)
);

create table public.daily_checkoff_targets (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  shift_period public.shift_period not null default 'daily',
  unit_id uuid not null references public.units(id) on delete cascade,
  target_type text not null check (target_type in ('compartment', 'kit', 'crew')),
  target_id uuid not null,
  requirement_status text not null default 'required' check (requirement_status in ('required', 'excused')),
  excused_at timestamptz,
  excused_by uuid references public.users(id) on delete set null,
  excusal_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_date, shift_period, unit_id, target_type, target_id)
);

create table public.daily_checkoff_excusal_events (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  shift_period public.shift_period not null default 'daily',
  unit_id uuid not null references public.units(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  reason text not null check (length(btrim(reason)) > 0),
  created_at timestamptz not null default now()
);

create index daily_checkoff_targets_summary_idx on public.daily_checkoff_targets (shift_date, shift_period, requirement_status, unit_id);
create index daily_checkoff_excusal_events_day_idx on public.daily_checkoff_excusal_events (shift_date desc, shift_period, unit_id);

create or replace function public.refresh_daily_checkoff_summary(p_shift_date date, p_shift_period public.shift_period default 'daily')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.daily_checkoff_summaries summary
  set
    required_actions = stats.required_actions,
    completed_actions = stats.completed_actions,
    required_units = stats.required_units,
    completed_units = stats.completed_units,
    updated_at = now()
  from (
    with required_targets as (
      select t.*,
        case
          when t.target_type = 'crew' then exists (
            select 1 from public.daily_unit_crews crew
            where crew.shift_date = t.shift_date and crew.shift_period = t.shift_period
              and crew.unit_id = t.unit_id and crew.locked and btrim(crew.provider_names) <> ''
          )
          else exists (
            select 1 from public.compartment_checks check_row
            where check_row.shift_date = t.shift_date and check_row.shift_period = t.shift_period
              and check_row.unit_id = t.unit_id and check_row.status = 'completed'
              and check_row.target_type = t.target_type and check_row.target_id = t.target_id
          )
        end as is_completed
      from public.daily_checkoff_targets t
      where t.shift_date = p_shift_date and t.shift_period = p_shift_period
        and t.requirement_status = 'required'
    ), per_unit as (
      select unit_id, count(*) as required_actions, count(*) filter (where is_completed) as completed_actions
      from required_targets
      group by unit_id
    )
    select
      coalesce((select count(*) from required_targets), 0)::integer as required_actions,
      coalesce((select count(*) filter (where is_completed) from required_targets), 0)::integer as completed_actions,
      coalesce((select count(*) from per_unit), 0)::integer as required_units,
      coalesce((select count(*) from per_unit where completed_actions = required_actions), 0)::integer as completed_units
  ) stats
  where summary.shift_date = p_shift_date and summary.shift_period = p_shift_period
    and summary.summary_state = 'live';
end;
$$;

create or replace function public.ensure_daily_checkoff_summary(p_shift_date date, p_shift_period public.shift_period default 'daily')
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  created_count integer := 0;
begin
  insert into public.daily_checkoff_summaries (shift_date, shift_period)
  values (p_shift_date, p_shift_period)
  on conflict do nothing;

  get diagnostics created_count = row_count;
  if created_count = 0 then
    return;
  end if;

  insert into public.daily_checkoff_targets (shift_date, shift_period, unit_id, target_type, target_id)
  select p_shift_date, p_shift_period, unit.id, 'compartment', compartment.id
  from public.units unit
  join public.unit_compartments compartment on compartment.unit_id = unit.id
  where unit.status = 'in_service' and unit.deleted_at is null;

  insert into public.daily_checkoff_targets (shift_date, shift_period, unit_id, target_type, target_id)
  select p_shift_date, p_shift_period, unit.id, 'kit', kit.id
  from public.units unit
  join public.unit_kits kit on kit.unit_id = unit.id
  where unit.status = 'in_service' and unit.deleted_at is null;

  insert into public.daily_checkoff_targets (shift_date, shift_period, unit_id, target_type, target_id)
  select p_shift_date, p_shift_period, unit.id, 'crew', unit.id
  from public.units unit
  where unit.status = 'in_service' and unit.deleted_at is null;

  perform public.refresh_daily_checkoff_summary(p_shift_date, p_shift_period);
end;
$$;

create or replace function public.maintain_daily_checkoff_summary()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  row_date date := coalesce(new.shift_date, old.shift_date);
  row_period public.shift_period := coalesce(new.shift_period, old.shift_period);
begin
  if row_period = 'daily' then
    perform public.ensure_daily_checkoff_summary(row_date, row_period);
    perform public.refresh_daily_checkoff_summary(row_date, row_period);
  end if;
  return coalesce(new, old);
end;
$$;

create trigger compartment_checks_maintain_daily_checkoff_summary
after insert or update or delete on public.compartment_checks
for each row execute function public.maintain_daily_checkoff_summary();

create trigger daily_unit_crews_maintain_daily_checkoff_summary
after insert or update or delete on public.daily_unit_crews
for each row execute function public.maintain_daily_checkoff_summary();

create trigger daily_checkoff_targets_maintain_summary
after update on public.daily_checkoff_targets
for each row execute function public.maintain_daily_checkoff_summary();

create or replace function public.excuse_daily_checkoff_unit(
  p_shift_date date,
  p_shift_period public.shift_period,
  p_unit_id uuid,
  p_reason text,
  p_actor_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_daily_checkoff_summary(p_shift_date, p_shift_period);

  insert into public.daily_checkoff_excusal_events (shift_date, shift_period, unit_id, actor_id, reason)
  values (p_shift_date, p_shift_period, p_unit_id, p_actor_id, btrim(p_reason));

  update public.daily_checkoff_targets
  set requirement_status = 'excused', excused_at = now(), excused_by = p_actor_id, excusal_reason = btrim(p_reason), updated_at = now()
  where shift_date = p_shift_date and shift_period = p_shift_period and unit_id = p_unit_id
    and requirement_status = 'required';

  perform public.refresh_daily_checkoff_summary(p_shift_date, p_shift_period);
end;
$$;

insert into public.daily_checkoff_summaries (
  shift_date, shift_period, summary_state, required_actions, completed_actions, required_units, completed_units
)
select
  ledger.shift_date,
  ledger.shift_period,
  'reconstructed',
  sum(ledger.total_compartments + 1)::integer,
  least(
    sum(ledger.total_compartments + 1)::integer,
    coalesce(checks.completed_actions, 0)::integer + coalesce(crews.completed_actions, 0)::integer
  ),
  count(*)::integer,
  0
from public.daily_unit_ledgers ledger
left join (
  select check_row.shift_date, check_row.shift_period, count(distinct (check_row.unit_id, check_row.target_type, check_row.target_id)) as completed_actions
  from public.compartment_checks check_row
  where check_row.status = 'completed'
    and exists (
      select 1 from public.daily_unit_ledgers ledger
      where ledger.shift_date = check_row.shift_date and ledger.shift_period = check_row.shift_period
        and ledger.unit_id = check_row.unit_id and ledger.unit_status = 'in_service'
    )
  group by check_row.shift_date, check_row.shift_period
) checks on checks.shift_date = ledger.shift_date and checks.shift_period = ledger.shift_period
left join (
  select crew.shift_date, crew.shift_period, count(distinct crew.unit_id) as completed_actions
  from public.daily_unit_crews crew
  where crew.locked and btrim(crew.provider_names) <> ''
    and exists (
      select 1 from public.daily_unit_ledgers ledger
      where ledger.shift_date = crew.shift_date and ledger.shift_period = crew.shift_period
        and ledger.unit_id = crew.unit_id and ledger.unit_status = 'in_service'
    )
  group by crew.shift_date, crew.shift_period
) crews on crews.shift_date = ledger.shift_date and crews.shift_period = ledger.shift_period
where ledger.unit_status = 'in_service'
group by ledger.shift_date, ledger.shift_period, checks.completed_actions, crews.completed_actions
on conflict do nothing;

alter table public.daily_checkoff_summaries enable row level security;
alter table public.daily_checkoff_targets enable row level security;
alter table public.daily_checkoff_excusal_events enable row level security;

create policy "supervisors can read daily checkoff summaries" on public.daily_checkoff_summaries for select using (public.is_supervisor_or_admin());
create policy "supervisors can read daily checkoff targets" on public.daily_checkoff_targets for select using (public.is_supervisor_or_admin());
create policy "admins can manage daily checkoff summaries" on public.daily_checkoff_summaries for all using (public.is_admin()) with check (public.is_admin());
create policy "admins can manage daily checkoff targets" on public.daily_checkoff_targets for all using (public.is_admin()) with check (public.is_admin());
create policy "admins can manage daily checkoff excusal events" on public.daily_checkoff_excusal_events for all using (public.is_admin()) with check (public.is_admin());
