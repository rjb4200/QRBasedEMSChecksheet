alter table public.admin_users
  add column if not exists email text,
  add column if not exists receives_daily_report boolean not null default true;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admin_users_email_format_check'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_email_format_check
      check (
        email is null
        or email = ''
        or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
      );
  end if;
end $$;

create table if not exists public.daily_email_report_runs (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  sent_at timestamptz not null default now(),
  recipient_count integer not null default 0,
  status text not null,
  error_message text,
  resend_message_id text,
  created_at timestamptz not null default now()
);

create index if not exists daily_email_report_runs_status_idx
  on public.daily_email_report_runs (status, report_date desc);
