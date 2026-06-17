## Why

Supabase security advisor flagged three tables in the public schema — `issues`, `issue_notes`, and `weekly_email_report_runs` — as having Row-Level Security disabled. Anyone with the project URL and the anon key (embedded in client-side code) can read, create, edit, and delete every row in these tables with no authentication required.

## What Changes

- Enable RLS on `public.issues`, `public.issue_notes`, and `public.weekly_email_report_runs`
- Create RLS policies on each table (admin-only CRUD, consistent with the `system_logs` pattern)
- New database migration file

## Capabilities

No new capabilities or modified capability requirements. This is a database security configuration fix that brings three tables into compliance with the project's existing RLS posture. The application code already accesses these tables via the service-role client (`createAdminClient()`), so no behavioral or API changes are needed.

## Impact

- **Database**: One new migration to enable RLS and create policies
- **Application code**: None — server-side operations use `createAdminClient()` (service role, bypasses RLS); client-side code does not query these tables directly
