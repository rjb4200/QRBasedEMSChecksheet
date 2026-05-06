create table if not exists public.qr_targets (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  unit_id uuid not null references public.units(id) on delete cascade,
  compartment_id uuid references public.unit_compartments(id) on delete cascade,
  unit_kit_id uuid references public.unit_kits(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint qr_targets_one_target check (
    (compartment_id is not null and unit_kit_id is null)
    or
    (compartment_id is null and unit_kit_id is not null)
  )
);

create unique index if not exists qr_targets_code_unique_idx on public.qr_targets (code);

create unique index if not exists qr_targets_active_compartment_unique_idx
  on public.qr_targets (compartment_id)
  where active = true and compartment_id is not null;

create unique index if not exists qr_targets_active_unit_kit_unique_idx
  on public.qr_targets (unit_kit_id)
  where active = true and unit_kit_id is not null;

create index if not exists qr_targets_unit_idx on public.qr_targets (unit_id);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'qr_targets_set_updated_at') then
    create trigger qr_targets_set_updated_at before update on public.qr_targets for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.qr_targets enable row level security;

drop policy if exists "authenticated users can read qr targets" on public.qr_targets;
drop policy if exists "admins can manage qr targets" on public.qr_targets;

create policy "authenticated users can read qr targets" on public.qr_targets for select using (auth.uid() is not null);
create policy "admins can manage qr targets" on public.qr_targets for all using (public.is_admin()) with check (public.is_admin());
