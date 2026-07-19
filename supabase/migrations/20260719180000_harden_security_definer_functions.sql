-- Revoke PUBLIC REST API access from SECURITY DEFINER functions
-- These are all called via server actions (service_role) or database triggers and don't need direct REST access.
-- Postgres grants EXECUTE to PUBLIC by default; anon and authenticated inherit from PUBLIC,
-- so we must revoke from PUBLIC to actually block anon/authenticated access.

revoke execute on function public.excuse_daily_checkoff_unit(date, shift_period, uuid, text, uuid) from public;
revoke execute on function public.ensure_daily_checkoff_summary(date, shift_period) from public;
revoke execute on function public.refresh_daily_checkoff_summary(date, shift_period) from public;
revoke execute on function public.maintain_daily_checkoff_summary() from public;
revoke execute on function public.start_daily_checkoff_summary(date, shift_period) from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.get_database_size() from public;
revoke execute on function public.save_compartment_check_atomic(uuid, text, uuid, date, shift_period, check_status, jsonb, integer, uuid) from public;
revoke execute on function public.set_updated_at() from public;

-- Note: current_user_role(), is_admin(), and is_supervisor_or_admin() intentionally
-- retain PUBLIC EXECUTE because they are referenced in RLS policy expressions.

-- Harden search_path on SECURITY DEFINER functions that lack an explicit setting

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.get_database_size()
returns bigint
language sql
security definer
set search_path = ''
as $$
  select pg_database_size(current_database());
$$;

-- Harden search_path on INVOKER functions flagged by the linter

create or replace function public.preview_operational_counts(from_date text, to_date text, unit_id text default null)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  result jsonb;
  unit_filter text := '';
begin
  if unit_id is not null then
    unit_filter := ' and unit_id = ' || quote_literal(unit_id);
  end if;

  execute format('select jsonb_build_object(
    ''compartment_checks'', (select count(*) from compartment_checks where shift_date >= %L and shift_date <= %L %s),
    ''shift_archives'', (select count(*) from shift_archives where shift_date >= %L and shift_date <= %L %s),
    ''daily_unit_ledgers'', (select count(*) from daily_unit_ledgers where shift_date >= %L and shift_date <= %L %s),
    ''daily_unit_crews'', (select count(*) from daily_unit_crews where shift_date >= %L and shift_date <= %L %s),
    ''daily_unit_comments'', (select count(*) from daily_unit_comments where shift_date >= %L and shift_date <= %L %s),
    ''daily_section_comments'', (select count(*) from daily_section_comments where shift_date >= %L and shift_date <= %L %s),
    ''daily_restock_items'', (select count(*) from daily_restock_items where shift_date >= %L and shift_date <= %L %s),
    ''daily_email_report_runs'', (select count(*) from daily_email_report_runs where report_date >= %L and report_date <= %L)
  )',
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date
  ) into result;

  return result;
end;
$$;

create or replace function public.clear_operational_records(from_date text, to_date text, unit_id text default null)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  result jsonb;
  unit_filter text := '';
begin
  if unit_id is not null then
    unit_filter := ' and unit_id = ' || quote_literal(unit_id);
  end if;

  execute format('select jsonb_build_object(
    ''compartment_checks'', (select count(*) from compartment_checks where shift_date >= %L and shift_date <= %L %s),
    ''shift_archives'', (select count(*) from shift_archives where shift_date >= %L and shift_date <= %L %s),
    ''daily_unit_ledgers'', (select count(*) from daily_unit_ledgers where shift_date >= %L and shift_date <= %L %s),
    ''daily_unit_crews'', (select count(*) from daily_unit_crews where shift_date >= %L and shift_date <= %L %s),
    ''daily_unit_comments'', (select count(*) from daily_unit_comments where shift_date >= %L and shift_date <= %L %s),
    ''daily_section_comments'', (select count(*) from daily_section_comments where shift_date >= %L and shift_date <= %L %s),
    ''daily_restock_items'', (select count(*) from daily_restock_items where shift_date >= %L and shift_date <= %L %s),
    ''daily_email_report_runs'', (select count(*) from daily_email_report_runs where report_date >= %L and report_date <= %L)
  )',
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date
  ) into result;

  execute format('delete from compartment_checks where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from shift_archives where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from daily_unit_ledgers where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from daily_unit_crews where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from daily_unit_comments where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from daily_section_comments where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from daily_restock_items where shift_date >= %L and shift_date <= %L %s', from_date, to_date, unit_filter);
  execute format('delete from daily_email_report_runs where report_date >= %L and report_date <= %L', from_date, to_date);

  return result;
end;
$$;

-- Add missing RLS policies for tables with RLS enabled but zero policies

do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'admin_users'
  ) then
    drop policy if exists "admins can manage admin_users" on public.admin_users;
    drop policy if exists "supervisors can read admin_users" on public.admin_users;
    drop policy if exists "users can read own admin_user" on public.admin_users;

    create policy "admins can manage admin_users" on public.admin_users for all using (public.is_admin()) with check (public.is_admin());
    create policy "supervisors can read admin_users" on public.admin_users for select using (public.is_supervisor_or_admin());

    -- Allow email reports to resolve recipient names via auth.uid() = user_id join
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'admin_users' and column_name = 'user_id'
    ) then
      create policy "users can read own admin_user" on public.admin_users for select using (auth.uid() = user_id);
    end if;
  end if;
end $$;

alter table if exists public.daily_email_report_runs enable row level security;

drop policy if exists "admins can manage daily_email_report_runs" on public.daily_email_report_runs;
drop policy if exists "supervisors can read daily_email_report_runs" on public.daily_email_report_runs;

create policy "admins can manage daily_email_report_runs" on public.daily_email_report_runs for all using (public.is_admin()) with check (public.is_admin());
create policy "supervisors can read daily_email_report_runs" on public.daily_email_report_runs for select using (public.is_supervisor_or_admin());

-- Harden legacy backup table with admin-only policies
alter table if exists public.compartment_checks_backup_20260607 enable row level security;
drop policy if exists "admins can manage compartment_checks_backup" on public.compartment_checks_backup_20260607;
create policy "admins can manage compartment_checks_backup" on public.compartment_checks_backup_20260607 for all using (public.is_admin()) with check (public.is_admin());
