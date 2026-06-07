alter table public.compartment_checks
  add column if not exists target_type text,
  add column if not exists target_id uuid;

update public.compartment_checks
set
  target_type = 'compartment',
  target_id = compartment_id
where compartment_id is not null
  and unit_kit_id is null
  and (target_type is null or target_id is null);

update public.compartment_checks
set
  target_type = 'kit',
  target_id = unit_kit_id
where unit_kit_id is not null
  and compartment_id is null
  and (target_type is null or target_id is null);

alter table public.compartment_checks
  add constraint compartment_checks_target_identity_valid
  check (
    (target_type = 'compartment' and target_id = compartment_id and compartment_id is not null and unit_kit_id is null)
    or
    (target_type = 'kit' and target_id = unit_kit_id and unit_kit_id is not null and compartment_id is null)
  ) not valid;

alter table public.compartment_checks
  validate constraint compartment_checks_target_identity_valid;
