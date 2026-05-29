## Why

The Supabase database has a plan-dependent storage limit. If the database fills up, the app could lock up or fail silently. Phase 1 adds proactive monitoring and admin warning banners so admins can see when storage is approaching capacity before it becomes critical.

## What Changes

- Add a server-side helper that queries current database usage via `pg_database_size()`.
- Support a configurable `DATABASE_STORAGE_LIMIT_MB` environment variable for the storage limit.
- Show a warning banner on the admin Fleet Panel when database usage exceeds 90%.
- Show a critical warning banner when database usage exceeds 95%.
- No warnings shown when usage is below 90%.
- No export, deletion, or data rotation behavior in this phase.

## Capabilities

### New Capabilities
- `storage-capacity-monitoring`: Database storage usage is monitored and admin warning banners appear when capacity thresholds are crossed.

### Modified Capabilities
- `fleet-dashboard`: The Fleet Panel now displays a storage capacity warning banner when database usage exceeds the configured thresholds.

## Impact

- **New helper**: `src/lib/database-usage.ts` — queries `pg_database_size()` and computes usage percentage.
- **New component**: `src/components/storage-warning-banner.tsx` — renders yellow (90%) or red (95%) warning banner.
- **Admin page**: Add banner to `src/app/admin/page.tsx`.
- **Config**: New `DATABASE_STORAGE_LIMIT_MB` environment variable.
- **Behavior**: No changes to checkoff, records, email, export, or data deletion.
