alter table public.daily_unit_crews add column if not exists locked boolean not null default false;
