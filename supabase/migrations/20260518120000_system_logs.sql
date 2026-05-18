create extension if not exists pg_cron;

create table if not exists public.system_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_type text not null check (actor_type in ('admin', 'crew', 'system')),
  actor_id text,
  actor_name text,
  action text not null,
  area text not null,
  target_type text,
  target_id text,
  target_name text,
  result text not null default 'success' check (result in ('success', 'failure', 'warning')),
  message text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb
);

create index if not exists system_logs_created_at_idx on public.system_logs (created_at desc);
create index if not exists system_logs_area_created_at_idx on public.system_logs (area, created_at desc);
create index if not exists system_logs_target_idx on public.system_logs (target_type, target_id, created_at desc);

alter table public.system_logs enable row level security;

drop policy if exists "admins can read system logs" on public.system_logs;
drop policy if exists "admins can create system logs" on public.system_logs;

create policy "admins can read system logs" on public.system_logs for select using (public.is_admin());
create policy "admins can create system logs" on public.system_logs for insert with check (public.is_admin());

create or replace function public.delete_old_system_logs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.system_logs
  where created_at < now() - interval '3 months';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.delete_old_system_logs() from public;
revoke execute on function public.delete_old_system_logs() from anon;
revoke execute on function public.delete_old_system_logs() from authenticated;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'delete-old-system-logs') then
    perform cron.unschedule('delete-old-system-logs');
  end if;

  perform cron.schedule(
    'delete-old-system-logs',
    '0 3 * * *',
    'select public.delete_old_system_logs();'
  );
end $$;
