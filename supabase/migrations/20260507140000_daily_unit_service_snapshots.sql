alter table public.daily_unit_ledgers
  add column if not exists archived boolean not null default false,
  add column if not exists status_note text;
