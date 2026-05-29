-- Preview operational record counts without deleting
CREATE OR REPLACE FUNCTION preview_operational_counts(from_date text, to_date text, unit_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  unit_filter text := '';
BEGIN
  IF unit_id IS NOT NULL THEN
    unit_filter := ' AND unit_id = ''' || unit_id || '''';
  END IF;

  EXECUTE format('SELECT jsonb_build_object(
    ''compartment_checks'', (SELECT count(*) FROM compartment_checks WHERE shift_date >= %L AND shift_date <= %L %s),
    ''shift_archives'', (SELECT count(*) FROM shift_archives WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_unit_ledgers'', (SELECT count(*) FROM daily_unit_ledgers WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_unit_crews'', (SELECT count(*) FROM daily_unit_crews WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_unit_comments'', (SELECT count(*) FROM daily_unit_comments WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_section_comments'', (SELECT count(*) FROM daily_section_comments WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_restock_items'', (SELECT count(*) FROM daily_restock_items WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_email_report_runs'', (SELECT count(*) FROM daily_email_report_runs WHERE report_date >= %L AND report_date <= %L)
  )',
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date
  ) INTO result;

  RETURN result;
END;
$$;

-- Clear operational records in a transaction, returning deleted counts
CREATE OR REPLACE FUNCTION clear_operational_records(from_date text, to_date text, unit_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  unit_filter text := '';
BEGIN
  IF unit_id IS NOT NULL THEN
    unit_filter := ' AND unit_id = ''' || unit_id || '''';
  END IF;

  EXECUTE format('SELECT jsonb_build_object(
    ''compartment_checks'', (SELECT count(*) FROM compartment_checks WHERE shift_date >= %L AND shift_date <= %L %s),
    ''shift_archives'', (SELECT count(*) FROM shift_archives WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_unit_ledgers'', (SELECT count(*) FROM daily_unit_ledgers WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_unit_crews'', (SELECT count(*) FROM daily_unit_crews WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_unit_comments'', (SELECT count(*) FROM daily_unit_comments WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_section_comments'', (SELECT count(*) FROM daily_section_comments WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_restock_items'', (SELECT count(*) FROM daily_restock_items WHERE shift_date >= %L AND shift_date <= %L %s),
    ''daily_email_report_runs'', (SELECT count(*) FROM daily_email_report_runs WHERE report_date >= %L AND report_date <= %L)
  )',
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date, unit_filter,
    from_date, to_date
  ) INTO result;

  EXECUTE format('DELETE FROM compartment_checks WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM shift_archives WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM daily_unit_ledgers WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM daily_unit_crews WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM daily_unit_comments WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM daily_section_comments WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM daily_restock_items WHERE shift_date >= %L AND shift_date <= %L %s', from_date, to_date, unit_filter);
  EXECUTE format('DELETE FROM daily_email_report_runs WHERE report_date >= %L AND report_date <= %L', from_date, to_date);

  RETURN result;
END;
$$;
