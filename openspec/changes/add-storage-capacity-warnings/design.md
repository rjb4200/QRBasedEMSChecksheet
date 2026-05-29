## Context

The Supabase database has a per-plan storage limit. The app currently has no visibility into current usage or how close it is to the limit. Phase 1 adds a lightweight monitoring mechanism and admin-only warning banners to surface storage pressure before it becomes critical.

## Goals / Non-Goals

**Goals:**
- Query current database size using `pg_database_size()`.
- Compare usage against a configurable `DATABASE_STORAGE_LIMIT_MB` value.
- Show a yellow warning banner at 90% usage.
- Show a red critical banner at 95% usage.
- Keep the check fast and non-blocking for the Fleet Panel.

**Non-Goals:**
- Do not export, delete, or rotate any data.
- Do not add user-facing storage visibility.
- Do not add email alerts for storage thresholds.
- Do not change any checkoff, records, or operational behavior.

## Decisions

### Decision 1: Use `pg_database_size()` server-side

Query `SELECT pg_database_size(current_database())` from the server using the service-role admin client. Compute usage percentage against the configured limit.

Rationale: This is a built-in Postgres function that requires no extra extensions, no schema changes, and works with the existing admin client.

### Decision 2: Configurable limit via `DATABASE_STORAGE_LIMIT_MB`

Use an environment variable for the storage limit so it can be set per-plan and updated without code changes.

Rationale: Supabase plan limits vary and cannot be reliably queried from SQL. An env var provides explicit control.

### Decision 3: Banner on the Fleet Panel

Render the warning banner as a server component on the Fleet Panel page above the fleet matrix, visible only to admin users.

Rationale: The Fleet Panel is the primary admin landing page. Adding the banner there ensures admins see it regularly without cluttering other admin pages.

### Decision 4: Default threshold at 500 MB

If `DATABASE_STORAGE_LIMIT_MB` is not set, default to 500 MB (Supabase free tier limit).

Rationale: Provides a safe default that prevents false-positive warnings while still catching critical situations on the smallest plan.

## Risks / Trade-offs

- **Risk**: `pg_database_size()` could be slow on very large databases. -> **Mitigation**: It's a single system function call and runs in milliseconds.
- **Risk**: The banner could be distracting during normal operations. -> **Mitigation**: Only shown at 90%+, which should be rare. Dismissible could be a future enhancement.

## Migration Plan

1. Create the database usage helper.
2. Create the storage warning banner component.
3. Add the banner to the Fleet Panel.
4. Configure `DATABASE_STORAGE_LIMIT_MB` in the deployment environment.
5. Run lint, typecheck, and build.
