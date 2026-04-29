create extension if not exists "pgcrypto";

create type public.app_role as enum ('user', 'supervisor', 'admin');
create type public.unit_status as enum ('in_service', 'out_of_service');
create type public.item_input_type as enum ('quantity', 'checkbox', 'condition');
create type public.shift_period as enum ('day', 'night');
create type public.check_status as enum ('in_progress', 'completed', 'partially_complete');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references public.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.equipment_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_par_level numeric,
  input_type public.item_input_type not null default 'quantity',
  category text not null default 'Uncategorized',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.template_compartments (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  grid_position jsonb not null default '{}'::jsonb,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, name)
);

create table public.template_compartment_items (
  id uuid primary key default gen_random_uuid(),
  compartment_id uuid not null references public.template_compartments(id) on delete cascade,
  equipment_id uuid not null references public.equipment_catalog(id) on delete restrict,
  sort_order integer not null default 0,
  par_level numeric,
  input_type public.item_input_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (compartment_id, equipment_id)
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit_kind text not null default 'EC',
  status public.unit_status not null default 'in_service',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.unit_compartments (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  grid_position jsonb not null default '{}'::jsonb,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, name)
);

create table public.unit_compartment_items (
  id uuid primary key default gen_random_uuid(),
  compartment_id uuid not null references public.unit_compartments(id) on delete cascade,
  equipment_id uuid not null references public.equipment_catalog(id) on delete restrict,
  sort_order integer not null default 0,
  par_level numeric,
  input_type public.item_input_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (compartment_id, equipment_id)
);

create table public.compartment_checks (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  compartment_id uuid not null references public.unit_compartments(id) on delete cascade,
  shift_date date not null,
  shift_period public.shift_period not null,
  status public.check_status not null default 'in_progress',
  checked_by uuid references public.users(id) on delete set null,
  item_data jsonb not null default '{}'::jsonb,
  time_on_page integer not null default 0,
  completed_at timestamptz,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, compartment_id, shift_date, shift_period)
);

create table public.shift_archives (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null,
  shift_period public.shift_period not null,
  unit_id uuid not null references public.units(id) on delete cascade,
  status public.check_status not null,
  completion_percentage numeric not null default 0,
  completed_compartments integer not null default 0,
  total_compartments integer not null default 0,
  check_data jsonb not null default '[]'::jsonb,
  signatures jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (shift_date, shift_period, unit_id)
);

create table public.personnel_signatures (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  shift_date date not null,
  shift_period public.shift_period not null,
  user_id uuid not null references public.users(id) on delete cascade,
  signed_at timestamptz not null default now(),
  unique (unit_id, shift_date, shift_period, user_id)
);

create index equipment_catalog_name_idx on public.equipment_catalog using gin (to_tsvector('english', name));
create unique index equipment_catalog_name_unique_idx on public.equipment_catalog (lower(name));
create index equipment_catalog_category_idx on public.equipment_catalog (category);
create index compartment_checks_shift_idx on public.compartment_checks (shift_date, shift_period);
create index compartment_checks_unit_idx on public.compartment_checks (unit_id, shift_date, shift_period);
create index shift_archives_unit_idx on public.shift_archives (unit_id, shift_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger user_roles_set_updated_at before update on public.user_roles for each row execute function public.set_updated_at();
create trigger equipment_catalog_set_updated_at before update on public.equipment_catalog for each row execute function public.set_updated_at();
create trigger templates_set_updated_at before update on public.templates for each row execute function public.set_updated_at();
create trigger template_compartments_set_updated_at before update on public.template_compartments for each row execute function public.set_updated_at();
create trigger template_compartment_items_set_updated_at before update on public.template_compartment_items for each row execute function public.set_updated_at();
create trigger units_set_updated_at before update on public.units for each row execute function public.set_updated_at();
create trigger unit_compartments_set_updated_at before update on public.unit_compartments for each row execute function public.set_updated_at();
create trigger unit_compartment_items_set_updated_at before update on public.unit_compartment_items for each row execute function public.set_updated_at();
create trigger compartment_checks_set_updated_at before update on public.compartment_checks for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role from public.user_roles where user_id = auth.uid()), 'user'::public.app_role);
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() = 'admin';
$$;

create or replace function public.is_supervisor_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() in ('supervisor', 'admin');
$$;

alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.equipment_catalog enable row level security;
alter table public.templates enable row level security;
alter table public.template_compartments enable row level security;
alter table public.template_compartment_items enable row level security;
alter table public.units enable row level security;
alter table public.unit_compartments enable row level security;
alter table public.unit_compartment_items enable row level security;
alter table public.compartment_checks enable row level security;
alter table public.shift_archives enable row level security;
alter table public.personnel_signatures enable row level security;

create policy "users can read own profile" on public.users for select using (id = auth.uid() or public.is_supervisor_or_admin());
create policy "admins can manage users" on public.users for all using (public.is_admin()) with check (public.is_admin());

create policy "users can read own role" on public.user_roles for select using (user_id = auth.uid() or public.is_supervisor_or_admin());
create policy "admins can manage roles" on public.user_roles for all using (public.is_admin()) with check (public.is_admin());

create policy "authenticated users can read equipment" on public.equipment_catalog for select using (auth.uid() is not null);
create policy "admins can manage equipment" on public.equipment_catalog for all using (public.is_admin()) with check (public.is_admin());

create policy "supervisors can read templates" on public.templates for select using (public.is_supervisor_or_admin());
create policy "admins can manage templates" on public.templates for all using (public.is_admin()) with check (public.is_admin());
create policy "supervisors can read template compartments" on public.template_compartments for select using (public.is_supervisor_or_admin());
create policy "admins can manage template compartments" on public.template_compartments for all using (public.is_admin()) with check (public.is_admin());
create policy "supervisors can read template items" on public.template_compartment_items for select using (public.is_supervisor_or_admin());
create policy "admins can manage template items" on public.template_compartment_items for all using (public.is_admin()) with check (public.is_admin());

create policy "authenticated users can read units" on public.units for select using (auth.uid() is not null);
create policy "admins can manage units" on public.units for all using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users can read unit compartments" on public.unit_compartments for select using (auth.uid() is not null);
create policy "admins can manage unit compartments" on public.unit_compartments for all using (public.is_admin()) with check (public.is_admin());
create policy "authenticated users can read unit items" on public.unit_compartment_items for select using (auth.uid() is not null);
create policy "admins can manage unit items" on public.unit_compartment_items for all using (public.is_admin()) with check (public.is_admin());

create policy "authenticated users can read checks" on public.compartment_checks for select using (auth.uid() is not null);
create policy "users can create own checks" on public.compartment_checks for insert with check (auth.uid() = checked_by);
create policy "authenticated users can update active checks" on public.compartment_checks for update using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admins can delete checks" on public.compartment_checks for delete using (public.is_admin());

create policy "supervisors can read archives" on public.shift_archives for select using (public.is_supervisor_or_admin());
create policy "admins can manage archives" on public.shift_archives for all using (public.is_admin()) with check (public.is_admin());

create policy "authenticated users can read signatures" on public.personnel_signatures for select using (auth.uid() is not null);
create policy "users can create own signatures" on public.personnel_signatures for insert with check (auth.uid() = user_id);
create policy "admins can manage signatures" on public.personnel_signatures for all using (public.is_admin()) with check (public.is_admin());
