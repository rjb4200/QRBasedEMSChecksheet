create table if not exists public.daily_section_comments (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  shift_period public.shift_period not null default 'daily',
  unit_id uuid not null references public.units(id) on delete cascade,
  source_type text not null check (source_type in ('compartment', 'kit')),
  source_id uuid not null,
  source_name text not null,
  comment text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_date, shift_period, unit_id, source_type, source_id),
  constraint daily_section_comments_comment_length check (char_length(comment) <= 2000)
);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'daily_section_comments_set_updated_at'
  ) then
    create trigger daily_section_comments_set_updated_at before update on public.daily_section_comments for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.daily_section_comments enable row level security;

drop policy if exists "public can read daily section comments" on public.daily_section_comments;
drop policy if exists "admins can manage daily section comments" on public.daily_section_comments;

create policy "public can read daily section comments" on public.daily_section_comments for select using (true);
create policy "admins can manage daily section comments" on public.daily_section_comments for all using (public.is_admin()) with check (public.is_admin());
