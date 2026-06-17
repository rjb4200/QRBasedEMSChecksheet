## Context

Three tables in the public schema — `issues`, `issue_notes`, and `weekly_email_report_runs` — were created in early June without Row-Level Security enabled or any RLS policies defined. Supabase's security advisor flagged this as a critical vulnerability: anyone with the anon key can read, write, and delete all rows.

The rest of the database consistently follows the pattern: `CREATE TABLE` → `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` → `CREATE POLICY ... for select/insert/etc`. The `system_logs` table (created May 18) is the closest analog — an admin-only table with `public.is_admin()` policies.

## Goals / Non-Goals

**Goals:**
- Enable RLS on `public.issues`, `public.issue_notes`, and `public.weekly_email_report_runs`
- Create admin-only RLS policies on all three tables
- Match the existing project conventions for RLS (same `public.is_admin()` helper, same policy naming)

**Non-Goals:**
- No application code changes — server-side operations already use `createAdminClient()` (service role, bypasses RLS)
- No schema or behavioral changes — the tables, their data, and how they're accessed remain identical
- No changes to other tables — all other tables already have RLS enabled

## Decisions

**Policy scope: full admin CRUD on all three tables.**

The `system_logs` pattern only grants SELECT and INSERT (it's append-only). But `issues` and `issue_notes` need UPDATE (status transitions, edits) and DELETE (issue cleanup), and `weekly_email_report_runs` may need DELETE (cleanup of old runs). Granting all four operations via `public.is_admin()` is consistent with how other admin-managed tables (e.g., `admin_users`, `units`, `equipment_catalog`) work — the admin role has full access.

**Separate policies per operation, not a single blanket policy.**

Following the existing convention: each operation gets its own named `policy "admins can <verb> <table>"` with the appropriate `for` clause. This is clearer for auditing and matches the project style.

**No authenticated-user or public policies.**

These are admin-only internal tables. No client-side code queries them directly. The service-role client handles all application access.

## Risks / Trade-offs

- **No risk of breakage** — the migration only adds RLS + policies. The service-role client (`createAdminClient()`) used by all server code bypasses RLS entirely.
- **Only anon-key access is blocked** — which is exactly the vulnerability being fixed.
- **Rollback** — simply `DROP POLICY ... ON <table>` and `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` on the three tables.
