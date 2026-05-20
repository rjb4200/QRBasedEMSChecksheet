## Context

The project has zero structured logging. The only audit trail is `daily_email_report_runs` (specific to cron email), which already follows a pattern of recording `report_date`, `status`, `error_message` in a dedicated table. The new `system_logs` table generalizes this pattern across all admin and system events.

Existing server actions (unit edit, crew lock, manual restock) are already centralized in `src/app/units/[id]/actions.ts` and `src/app/admin/units/actions.ts`, making them straightforward instrumentation points.

## Goals / Non-Goals

**Goals:**
- Record important admin, operational, and system events in a structured database table.
- Provide a filterable admin UI at `/admin/system-log`.
- Keep log writes server-side only (no client-side inserts).
- Make failed events visually identifiable.
- Keep system logs for 3 months and automatically purge older entries.

**Non-Goals:**
- Do not log every page view, click, or keystroke.
- Do not store secrets, passwords, auth headers, or cron tokens.
- Do not allow public/crew users to read or write logs.
- Do not create a real-time notification system.

## Decisions

### Decision 1: Single `system_logs` table with JSONB detail columns

**Choice**: One table with `before_data` and `after_data` as nullable JSONB columns, plus a `metadata` JSONB column for arbitrary context.

**Rationale**: Avoids table-per-event-type explosion. JSONB is flexible enough to record different event shapes without schema changes. The `area` + `action` columns provide structured querying while JSONB handles event-specific details.

### Decision 2: `logSystemEvent()` helper with typed parameters

**Choice**: A TypeScript function `logSystemEvent(params)` that accepts a structured object and inserts into `system_logs` via admin client.

**Rationale**: Keeps instrumentation consistent across the codebase. The typed interface prevents misspelled action names or missing required fields. All log writes flow through one function, making it easy to add rate limiting or async batching later.

### Decision 3: Server component admin page with client filters

**Choice**: `/admin/system-log` is a server component that fetches initial log rows, with client-side filter controls that trigger server re-fetches via URL search params.

**Rationale**: Matches the existing admin page pattern (archives, units). Server components keep the DB query server-side. URL search params make filter state shareable/bookmarkable.

### Decision 4: Expandable row details

**Choice**: Each log row has a click-to-expand disclosure showing `message`, `before_data`, `after_data`, and `metadata` rendered as formatted key-value pairs.

**Rationale**: Keeps the list compact for scanning while providing forensic detail when needed.

### Decision 5: Log writes are fire-and-forget

**Choice**: `logSystemEvent()` catches its own errors silently. A failed log write never throws an error that breaks the calling action.

**Rationale**: The system log is an audit trail, not a critical path dependency. If logging fails, the original action (e.g., saving crew signatures) must still succeed.

### Decision 6: Three-month retention enforced in the database

**Choice**: System logs older than 3 months are deleted by a scheduled database cleanup job.

**Rationale**: Retention belongs close to the data so it does not depend on an admin page visit or application server runtime. Three months provides enough troubleshooting history for normal operations while limiting table growth and reducing long-term storage of operational metadata.

## Risks / Trade-offs

- **Risk**: Scheduled cleanup could fail and logs could grow past 3 months. → **Mitigation**: Implement cleanup as an explicit database function/job and include manual verification that old rows are purged.
- **Risk**: Logging every admin edit adds DB write overhead. → **Mitigation**: JSONB inserts are lightweight; one extra INSERT per action is negligible compared to the primary DB operations.
- **Trade-off**: Logs are append-only with no editing. → Acceptable for an audit trail; immutable by design.

## Migration Plan

1. Run migration creating `system_logs` table, indexes, cleanup function, and scheduled retention job.
2. Deploy `logSystemEvent()` helper and instrumentation points.
3. Deploy admin system log page.
4. Rollback: drop scheduled job/function/table, remove instrumentation calls, remove admin page.
