drop table if exists public.personnel_signatures;

alter table public.shift_archives drop column if exists signatures;
