create table if not exists public.daily_unit_comments (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  shift_period public.shift_period not null default 'daily',
  unit_id uuid not null references public.units(id) on delete cascade,
  comment text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_date, shift_period, unit_id)
);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'daily_unit_comments_set_updated_at'
  ) then
    create trigger daily_unit_comments_set_updated_at before update on public.daily_unit_comments for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.daily_unit_comments enable row level security;

drop policy if exists "public can read daily unit comments" on public.daily_unit_comments;
drop policy if exists "admins can manage daily unit comments" on public.daily_unit_comments;

create policy "public can read daily unit comments" on public.daily_unit_comments for select using (true);
create policy "admins can manage daily unit comments" on public.daily_unit_comments for all using (public.is_admin()) with check (public.is_admin());
