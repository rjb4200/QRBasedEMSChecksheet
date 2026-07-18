create or replace function public.start_daily_checkoff_summary(p_shift_date date, p_shift_period public.shift_period default 'daily')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.daily_checkoff_summaries
  where shift_date = p_shift_date and shift_period = p_shift_period
    and summary_state = 'reconstructed'
    and not exists (
      select 1 from public.daily_checkoff_targets target
      where target.shift_date = p_shift_date and target.shift_period = p_shift_period
    );

  perform public.ensure_daily_checkoff_summary(p_shift_date, p_shift_period);
end;
$$;

create or replace function public.save_compartment_check_atomic(
  p_unit_id uuid,
  p_target_type text,
  p_target_id uuid,
  p_shift_date date,
  p_shift_period public.shift_period,
  p_status public.check_status,
  p_item_data jsonb default null,
  p_time_on_page integer default null,
  p_checked_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_check_id uuid;
begin
  perform public.start_daily_checkoff_summary(p_shift_date, p_shift_period);

  insert into public.compartment_checks (
    unit_id, target_type, target_id, compartment_id, unit_kit_id, shift_date, shift_period,
    status, item_data, time_on_page, completed_at, submitted_at, time_to_complete_seconds,
    checked_by, last_activity_at, started_at
  ) values (
    p_unit_id, p_target_type, p_target_id,
    case when p_target_type = 'compartment' then p_target_id else null end,
    case when p_target_type = 'kit' then p_target_id else null end,
    p_shift_date, p_shift_period, p_status, coalesce(p_item_data, '{}'::jsonb),
    coalesce(p_time_on_page, 0), case when p_status = 'completed' then v_now else null end,
    case when p_status = 'completed' then v_now else null end,
    case when p_status = 'completed' then 0 else null end,
    case when p_status = 'completed' then p_checked_by else null end, v_now, v_now
  )
  on conflict (unit_id, target_type, target_id, shift_date, shift_period)
  do update set
    status = case when public.compartment_checks.status = 'completed' and excluded.status = 'in_progress' then public.compartment_checks.status else excluded.status end,
    item_data = coalesce(p_item_data, public.compartment_checks.item_data),
    time_on_page = coalesce(p_time_on_page, public.compartment_checks.time_on_page),
    completed_at = case when public.compartment_checks.status = 'completed' and excluded.status = 'in_progress' then public.compartment_checks.completed_at when excluded.status = 'completed' then v_now else public.compartment_checks.completed_at end,
    submitted_at = case when public.compartment_checks.status = 'completed' and excluded.status = 'in_progress' then public.compartment_checks.submitted_at when excluded.status = 'completed' then v_now else public.compartment_checks.submitted_at end,
    time_to_complete_seconds = case when public.compartment_checks.status = 'completed' and excluded.status = 'in_progress' then public.compartment_checks.time_to_complete_seconds when excluded.status = 'completed' then greatest(0, extract(epoch from (v_now - coalesce(public.compartment_checks.started_at, excluded.started_at, v_now)))::integer) else public.compartment_checks.time_to_complete_seconds end,
    checked_by = case when excluded.status = 'completed' and p_checked_by is not null then p_checked_by else public.compartment_checks.checked_by end,
    last_activity_at = v_now,
    started_at = coalesce(public.compartment_checks.started_at, excluded.started_at),
    compartment_id = excluded.compartment_id,
    unit_kit_id = excluded.unit_kit_id,
    target_type = excluded.target_type,
    target_id = excluded.target_id
  returning id into v_check_id;

  return v_check_id;
end;
$$;
