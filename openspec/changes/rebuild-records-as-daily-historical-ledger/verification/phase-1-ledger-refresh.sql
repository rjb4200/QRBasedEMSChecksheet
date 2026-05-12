-- Set the selected operational date before running.
-- Example: \set selected_date '2026-05-12'

with expected_units as (
  select
    u.id,
    u.name,
    u.status,
    coalesce(compartment_counts.count, 0) + coalesce(kit_counts.count, 0) as total_compartments
  from public.units u
  left join (
    select unit_id, count(*)::integer as count
    from public.unit_compartments
    group by unit_id
  ) compartment_counts on compartment_counts.unit_id = u.id
  left join (
    select unit_id, count(*)::integer as count
    from public.unit_kits
    group by unit_id
  ) kit_counts on kit_counts.unit_id = u.id
  where u.deleted_at is null
), ledger_rows as (
  select *
  from public.daily_unit_ledgers
  where shift_date = :'selected_date'::date
    and shift_period = 'daily'
)
select
  expected_units.id as unit_id,
  expected_units.name as expected_unit_name,
  ledger_rows.unit_name as ledger_unit_name,
  expected_units.status as expected_unit_status,
  ledger_rows.unit_status as ledger_unit_status,
  expected_units.total_compartments as expected_total_compartments,
  ledger_rows.total_compartments as ledger_total_compartments,
  case
    when ledger_rows.unit_id is null then 'missing_ledger_row'
    when ledger_rows.unit_name is distinct from expected_units.name then 'unit_name_mismatch'
    when ledger_rows.unit_status is distinct from expected_units.status then 'unit_status_mismatch'
    when ledger_rows.total_compartments is distinct from expected_units.total_compartments then 'total_compartments_mismatch'
    else 'ok'
  end as verification_status
from expected_units
left join ledger_rows on ledger_rows.unit_id = expected_units.id
where ledger_rows.unit_id is null
   or ledger_rows.unit_name is distinct from expected_units.name
   or ledger_rows.unit_status is distinct from expected_units.status
   or ledger_rows.total_compartments is distinct from expected_units.total_compartments
order by expected_units.name;
