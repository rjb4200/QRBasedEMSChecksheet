-- Set the selected operational date before running.
-- Example: \set selected_date '2026-05-12'

with ledger_units as (
  select unit_id
  from public.daily_unit_ledgers
  where shift_date = :'selected_date'::date
    and shift_period = 'daily'
), check_units as (
  select distinct unit_id
  from public.compartment_checks
  where shift_date = :'selected_date'::date
    and shift_period = 'daily'
), crew_units as (
  select distinct unit_id
  from public.daily_unit_crews
  where shift_date = :'selected_date'::date
    and shift_period = 'daily'
), comment_units as (
  select distinct unit_id
  from public.daily_unit_comments
  where shift_date = :'selected_date'::date
    and shift_period = 'daily'
)
select
  count(*) as ledger_unit_count,
  count(*) filter (where check_units.unit_id is null) as ledger_units_without_checks,
  count(*) filter (where crew_units.unit_id is not null) as ledger_units_with_crews,
  count(*) filter (where comment_units.unit_id is not null) as ledger_units_with_comments
from ledger_units
left join check_units on check_units.unit_id = ledger_units.unit_id
left join crew_units on crew_units.unit_id = ledger_units.unit_id
left join comment_units on comment_units.unit_id = ledger_units.unit_id;
