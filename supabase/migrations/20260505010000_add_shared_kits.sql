create table if not exists public.kits (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  sort_order integer not null default 0,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kit_items (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid not null references public.kits(id) on delete cascade,
  equipment_id uuid not null references public.equipment_catalog(id) on delete restrict,
  sort_order integer not null default 0,
  par_level numeric,
  input_type public.item_input_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kit_id, equipment_id)
);

create table if not exists public.unit_kits (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  kit_id uuid not null references public.kits(id) on delete restrict,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, kit_id)
);

create index if not exists kits_active_sort_idx on public.kits (active, sort_order, name);
create index if not exists kit_items_kit_sort_idx on public.kit_items (kit_id, sort_order);
create index if not exists unit_kits_unit_sort_idx on public.unit_kits (unit_id, sort_order);
create index if not exists unit_kits_kit_idx on public.unit_kits (kit_id);

do $$
begin
  alter table public.compartment_checks add column if not exists unit_kit_id uuid references public.unit_kits(id) on delete cascade;
  alter table public.compartment_checks alter column compartment_id drop not null;
exception
  when undefined_table then null;
end $$;

alter table if exists public.compartment_checks
  drop constraint if exists compartment_checks_unit_id_compartment_id_shift_date_shift_period_key,
  drop constraint if exists compartment_checks_one_target;

alter table if exists public.compartment_checks
  add constraint compartment_checks_one_target check (
    (compartment_id is not null and unit_kit_id is null)
    or
    (compartment_id is null and unit_kit_id is not null)
  );

create unique index if not exists compartment_checks_compartment_target_unique
  on public.compartment_checks (unit_id, compartment_id, shift_date, shift_period)
  where compartment_id is not null;

create unique index if not exists compartment_checks_kit_target_unique
  on public.compartment_checks (unit_id, unit_kit_id, shift_date, shift_period)
  where unit_kit_id is not null;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'kits_set_updated_at') then
    create trigger kits_set_updated_at before update on public.kits for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'kit_items_set_updated_at') then
    create trigger kit_items_set_updated_at before update on public.kit_items for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'unit_kits_set_updated_at') then
    create trigger unit_kits_set_updated_at before update on public.unit_kits for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.kits enable row level security;
alter table public.kit_items enable row level security;
alter table public.unit_kits enable row level security;

drop policy if exists "authenticated users can read kits" on public.kits;
drop policy if exists "admins can manage kits" on public.kits;
drop policy if exists "authenticated users can read kit items" on public.kit_items;
drop policy if exists "admins can manage kit items" on public.kit_items;
drop policy if exists "authenticated users can read unit kits" on public.unit_kits;
drop policy if exists "admins can manage unit kits" on public.unit_kits;

create policy "authenticated users can read kits" on public.kits for select using (auth.uid() is not null);
create policy "admins can manage kits" on public.kits for all using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users can read kit items" on public.kit_items for select using (auth.uid() is not null);
create policy "admins can manage kit items" on public.kit_items for all using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users can read unit kits" on public.unit_kits for select using (auth.uid() is not null);
create policy "admins can manage unit kits" on public.unit_kits for all using (public.is_admin()) with check (public.is_admin());
