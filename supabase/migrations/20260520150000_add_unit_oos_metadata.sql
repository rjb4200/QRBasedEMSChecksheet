alter table public.units
  add column if not exists oos_at timestamptz,
  add column if not exists oos_by_name text;
