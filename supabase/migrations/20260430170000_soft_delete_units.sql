alter table public.units add column if not exists deleted_at timestamptz;

create index if not exists units_deleted_at_idx on public.units (deleted_at);
