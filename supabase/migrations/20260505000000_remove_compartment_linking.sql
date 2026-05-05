drop table if exists public.shared_compartment_items cascade;

drop index if exists public.unit_compartments_linked_group_idx;
drop index if exists public.unit_compartment_items_shared_link_idx;

alter table if exists public.unit_compartment_items
  drop constraint if exists unit_compartment_items_shared_item_id_fkey,
  drop column if exists shared_item_id;

alter table if exists public.unit_compartments
  drop column if exists linked_group;
