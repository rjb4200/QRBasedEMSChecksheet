create unique index if not exists compartment_checks_normalized_target_unique
  on public.compartment_checks (unit_id, target_type, target_id, shift_date, shift_period);
