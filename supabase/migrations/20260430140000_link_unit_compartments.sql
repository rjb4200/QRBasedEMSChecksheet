alter table public.unit_compartments add column if not exists linked_group text;

create index if not exists unit_compartments_linked_group_idx on public.unit_compartments (unit_id, linked_group) where linked_group is not null;
