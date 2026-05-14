create table if not exists public.daily_restock_items (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  shift_date date not null,
  shift_period public.shift_period not null default 'daily',
  target_type text not null check (target_type in ('compartment', 'kit')),
  target_id uuid not null,
  item_id uuid not null,
  issue_type text not null check (issue_type in ('missing', 'below_par', 'condition_issue')),
  addressed boolean not null default false,
  addressed_at timestamptz,
  addressed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, shift_date, shift_period, target_type, target_id, item_id)
);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'daily_restock_items_set_updated_at'
  ) then
    create trigger daily_restock_items_set_updated_at before update on public.daily_restock_items for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.daily_restock_items enable row level security;

drop policy if exists "public can read daily restock items" on public.daily_restock_items;
drop policy if exists "public can manage daily restock items" on public.daily_restock_items;

create policy "public can read daily restock items" on public.daily_restock_items for select using (true);
create policy "public can manage daily restock items" on public.daily_restock_items for all using (public.is_admin()) with check (public.is_admin());
