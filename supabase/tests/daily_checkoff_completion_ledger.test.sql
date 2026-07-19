begin;

select plan(10);

insert into public.units (id, name)
values ('10000000-0000-0000-0000-000000000001', 'Daily ledger pgTAP unit');

insert into public.unit_compartments (id, unit_id, name, sort_order)
values
  ('10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'Primary', 1),
  ('10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', 'Secondary', 2);

select lives_ok(
  $$ select public.ensure_daily_checkoff_summary('2026-07-20', 'daily') $$,
  'initializes the daily manifest'
);

select is(
  (select count(*) from public.daily_checkoff_targets where shift_date = '2026-07-20'),
  3::bigint,
  'snapshots compartment and crew targets'
);

select is(
  (select required_actions from public.daily_checkoff_summaries where shift_date = '2026-07-20'),
  3,
  'summary counts all required actions after initialization'
);

select lives_ok(
  $$ select public.ensure_daily_checkoff_summary('2026-07-20', 'daily') $$,
  'allows duplicate initialization'
);

select is(
  (select count(*) from public.daily_checkoff_targets where shift_date = '2026-07-20'),
  3::bigint,
  'duplicate initialization does not add targets'
);

insert into public.compartment_checks (
  unit_id, compartment_id, target_type, target_id, shift_date, shift_period, status
) values (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000011',
  'compartment',
  '10000000-0000-0000-0000-000000000011',
  '2026-07-20',
  'daily',
  'completed'
);

select is(
  (select completed_actions from public.daily_checkoff_summaries where shift_date = '2026-07-20'),
  1,
  'a completed check refreshes the summary'
);

insert into public.daily_unit_crews (shift_date, shift_period, unit_id, provider_names, locked)
values ('2026-07-20', 'daily', '10000000-0000-0000-0000-000000000001', 'A. Provider', true);

select is(
  (select completed_actions from public.daily_checkoff_summaries where shift_date = '2026-07-20'),
  2,
  'a locked crew entry refreshes the summary'
);

select lives_ok(
  $$ select public.excuse_daily_checkoff_unit('2026-07-20', 'daily', '10000000-0000-0000-0000-000000000001', 'Unit unavailable') $$,
  'records a unit excusal'
);

select is(
  (select required_actions from public.daily_checkoff_summaries where shift_date = '2026-07-20'),
  0,
  'excused targets are excluded from the required action count'
);

select is(
  (select reason from public.daily_checkoff_excusal_events where shift_date = '2026-07-20'),
  'Unit unavailable',
  'stores the excusal audit event'
);

select * from finish();
rollback;
