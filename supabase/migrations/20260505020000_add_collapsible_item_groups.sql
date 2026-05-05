create table if not exists public.unit_compartment_item_groups (
  id uuid primary key default gen_random_uuid(),
  compartment_id uuid not null references public.unit_compartments(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (compartment_id, name)
);

create table if not exists public.kit_item_groups (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid not null references public.kits(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kit_id, name)
);

alter table public.unit_compartment_items
  add column if not exists group_id uuid references public.unit_compartment_item_groups(id) on delete set null;

alter table public.kit_items
  add column if not exists group_id uuid references public.kit_item_groups(id) on delete set null;

create index if not exists unit_compartment_item_groups_parent_sort_idx
  on public.unit_compartment_item_groups (compartment_id, sort_order, created_at, id);

create index if not exists kit_item_groups_parent_sort_idx
  on public.kit_item_groups (kit_id, sort_order, created_at, id);

create index if not exists unit_compartment_items_group_sort_idx
  on public.unit_compartment_items (group_id, sort_order, created_at, id);

create index if not exists kit_items_group_sort_idx
  on public.kit_items (group_id, sort_order, created_at, id);

insert into public.unit_compartment_item_groups (compartment_id, name, sort_order)
select compartment_id, subcategory, min(coalesce(subcategory_sort_order, sort_order, 0))
from public.unit_compartment_items
where subcategory is not null and btrim(subcategory) <> '' and group_id is null
group by compartment_id, subcategory
on conflict (compartment_id, name) do nothing;

update public.unit_compartment_items item
set group_id = item_group.id
from public.unit_compartment_item_groups item_group
where item.group_id is null
  and item.subcategory is not null
  and btrim(item.subcategory) <> ''
  and item_group.compartment_id = item.compartment_id
  and item_group.name = item.subcategory;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'unit_compartment_item_groups_set_updated_at') then
    create trigger unit_compartment_item_groups_set_updated_at before update on public.unit_compartment_item_groups for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'kit_item_groups_set_updated_at') then
    create trigger kit_item_groups_set_updated_at before update on public.kit_item_groups for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.unit_compartment_item_groups enable row level security;
alter table public.kit_item_groups enable row level security;

drop policy if exists "authenticated users can read compartment item groups" on public.unit_compartment_item_groups;
drop policy if exists "admins can manage compartment item groups" on public.unit_compartment_item_groups;
drop policy if exists "authenticated users can read kit item groups" on public.kit_item_groups;
drop policy if exists "admins can manage kit item groups" on public.kit_item_groups;

create policy "authenticated users can read compartment item groups" on public.unit_compartment_item_groups for select using (auth.uid() is not null);
create policy "admins can manage compartment item groups" on public.unit_compartment_item_groups for all using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users can read kit item groups" on public.kit_item_groups for select using (auth.uid() is not null);
create policy "admins can manage kit item groups" on public.kit_item_groups for all using (public.is_admin()) with check (public.is_admin());
