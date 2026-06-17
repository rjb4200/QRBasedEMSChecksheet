## 1. Migration

- [x] 1.1 Create migration `20260616120000_enable_rls_on_issues_and_report_tables.sql` with RLS enable statements and admin-only policies for `issues`, `issue_notes`, and `weekly_email_report_runs`
- [x] 1.2 Push migration to remote database via `supabase db push`

## 2. Verification

- [x] 2.1 Confirm Supabase security advisor no longer flags the three tables
- [x] 2.2 Verify anon-key queries are rejected and service-role queries still work
- [x] 2.3 Test that existing application flows (issues page, weekly digest) remain unaffected
