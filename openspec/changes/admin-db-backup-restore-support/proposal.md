## GitHub Issue

Requested change: Add admin-only database backup/export support with a guarded restore workflow, stale-backup warning banner, and a scriptable endpoint or command that can be run automatically from an external server.

## Root Cause

The application currently relies on the live Supabase/Postgres database as the authoritative data store. If the database were corrupted, accidentally changed, or otherwise lost, there is no app-level backup workflow that confirms recent backup status, stores backup metadata, or gives an administrator a documented recovery path.

## Proposed Solution

Add an admin-only backup and recovery capability with the following behavior:

- Add an admin backup page, likely under `/admin/backups`.
- Display last successful backup metadata, including timestamp, status, destination/type, and any available file size or checksum.
- Show a prominent warning banner when the last successful backup is more than 14 days old or when no successful backup has ever been recorded.
- Provide an admin-only manual "Create Backup Now" action.
- Provide a scriptable backup trigger that can be called by a bash script from a trusted server for automated backups.
- Require strong authentication for script-triggered backups, such as a dedicated backup token stored only in server environment variables.
- Record backup attempts and results in a database-backed audit table.
- Store backup files outside the production database, preferably encrypted or in a private storage destination.
- Add a restore/recovery page or workflow that is admin-only and intentionally guarded by multiple confirmations.
- Make restore support conservative: restore should require explicit backup selection, typed confirmation text, final confirmation, and clear warnings that production data may be overwritten.
- Prefer documenting and supporting restore to a staging/new project first before allowing production restore.

## Scope

- Admin UI for backup status and manual backup creation.
- Stale-backup banner when the most recent successful backup is older than 14 days.
- Server-only backup execution path using secure credentials.
- Scriptable backup endpoint or command suitable for scheduled cron/bash automation.
- Backup metadata/audit records.
- Guarded restore workflow design with multiple confirmations.
- Restore runbook/documentation for safe recovery.

## Non-Goals

- No public backup/export endpoint.
- No client-side exposure of database passwords, service-role keys, or backup storage credentials.
- No unauthenticated import/export access.
- No automatic production restore without admin interaction.
- No default destructive restore button on normal admin pages.
- No change to normal checkoff, restocking, QR, unit, kit, or crew workflows.

## Security Requirements

- Backup and restore controls must be admin-only.
- Scripted backup access must use a dedicated secret/token separate from normal user credentials.
- Secrets must be stored in environment variables and never returned to the browser.
- Backup files must not be publicly accessible.
- Restore actions must require multiple confirmations before any destructive operation.
- Backup and restore attempts must be audited with timestamp, actor/source, result, and error summary when applicable.

## Design Notes

The preferred implementation is export-first, restore-second:

1. Build reliable backup creation and metadata tracking.
2. Add stale-backup warning and automation hooks.
3. Document restore to a fresh/staging Supabase project.
4. Add production restore only if it can be guarded safely.

For Supabase/Postgres, full backup and restore should use database dump tooling such as Supabase CLI or Postgres-compatible dump/restore commands from a server-side environment, not browser-side table-by-table export.

## Risk Assessment

- Regression risk: Low for backup-only features if isolated under admin routes and server actions.
- Security risk: Moderate to high if backup/restore credentials are mishandled; must keep all secrets server-side.
- Data risk: Low for export-only; high for restore if destructive operations are exposed. Restore must be gated and preferably tested against a staging database first.
- UX risk: Low. The stale-backup banner should be visible but limited to admin backup context unless explicitly expanded later.

## Verification Plan

- Verify non-admin users cannot access backup pages, manual backup actions, script endpoints, or restore controls.
- Verify admins can see last successful backup metadata.
- Verify banner appears when no successful backup exists.
- Verify banner appears when last successful backup is more than 14 days old.
- Verify banner does not appear when a successful backup is 14 days old or newer.
- Verify manual backup records a successful metadata row when backup completes.
- Verify failed backup attempts are recorded with failure status and error summary.
- Verify scripted backup endpoint rejects missing/invalid tokens.
- Verify scripted backup endpoint accepts a valid backup token and creates/records a backup.
- Verify restore workflow requires multiple confirmations and cannot be triggered accidentally.
- Verify backup files are not publicly accessible.
- Run type checking and lint/build if feasible.

## Rollback Plan

Disable the admin backup routes/actions and script endpoint, remove backup UI links, and retain or drop backup metadata tables depending on whether historical audit records need to be preserved. Since normal checkoff and unit workflows should not depend on this feature, rollback should not affect field operations.