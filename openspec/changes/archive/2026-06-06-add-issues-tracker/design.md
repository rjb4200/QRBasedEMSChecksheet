## Context

The application has a crew-facing restocking list and exception views tied to checkoff data, but no persistent issue tracking for long-running operational problems. Admins currently have no dedicated place to log, monitor, or resolve issues that span multiple shifts. The restocking list is intentionally short-term (auto-clears with shifts) and exceptions are read-only par-count deviations — neither is suitable for tracking a missing IV pump that won't be replaced for weeks.

## Goals / Non-Goals

**Goals:**
- Create a minimal `issues` table with title, description, optional unit reference, status, and creator
- Build a `/admin/issues` page with a filterable list grouped by status
- Allow admins to create issues directly from the page
- Allow admins to change an issue's status via dropdown
- Add an "Issues" link to the top admin navigation bar

**Non-Goals:**
- No comments, attachments, assignments, due dates, or categories
- No crew-facing visibility (issues are admin-only)
- No integration with the restocking list or checkoff flow
- No automatic issue generation from checkoff data
- No notifications for issue status changes
- No soft-delete or archival — a DELETE endpoint is included but not surfaced in the UI yet

## Decisions

### Decision 1: Single table with status enum, no separate workflow tables

A single `issues` table with a `status` text column constrained to `open`, `in_progress`, `closed`. No separate workflow/transition tables or state machines — the dropdown on the card directly updates the status column.

**Rationale:** Stage 1A needs minimal infrastructure. Future stages can add workflow rules, transitions, and audit trails without changing the core data model. The CHECK constraint validates status values at the database level.

### Decision 2: One CRUD API with admin session requirement

Two route files under `/api/admin/issues/` — a collection route (`route.ts`) for GET list and POST create, and a parameterized route (`[id]/route.ts`) for PUT update and DELETE. All routes require admin session authentication via the existing `requireAdminSession` pattern.

**Rationale:** Follows the existing admin API pattern used by `admin-users/route.ts` and `admin-users/[id]/route.ts`. Consistent auth, error handling, and response format.

### Decision 3: Issues page as a standalone server component

The `/admin/issues` page is a single-page server component with a collapsible create form (client-side toggle) and status-filtered issue cards. The create form uses a client-side POST fetch. Status changes use PUT fetch.

**Rationale:** Simpler than a multi-route admin pattern. The page replaces what would otherwise be scattered across multiple pages. After initial page load with all issues, client-side filtering by status eliminates page reloads.

### Decision 4: Top-level nav link, not hamburger menu

"Issues" is added to the top navigation bar alongside Fleet, Records, and System Log — not tucked into the hamburger menu.

**Rationale:** The feature is operational (not configuration), used frequently, and should be immediately visible to all admins. Configuration pages (Units, Kits, Equipment, Users) stay in the hamburger.

### Decision 5: Status badge colors consistent with existing palette

| Status | Color | Pattern |
|---|---|---|
| Open | Red | `text-red-700 bg-red-50` (active/attention) |
| In Progress | Amber | `text-amber-700 bg-amber-50` (in motion) |
| Closed | Green | `text-green-700 bg-green-50` (resolved) |

This follows the existing fleet panel color conventions (red for incomplete/attention, amber for warning, green for complete).

## Risks / Trade-offs

- **[Risk] No audit trail for status changes** → Mitigation: Status changes will be logged to system_logs in a future stage. For now, the `updated_at` timestamp provides basic tracking.
- **[Trade-off] Issues not linked to restock items** → By design. Issues are independent of checkoff data. This prevents coupling two different lifecycles.
- **[Risk] Accidental issue deletion** → Mitigation: DELETE endpoint exists but is not exposed in the UI in Stage 1A. Only the API route supports it for programmatic cleanup.
- **[Trade-off] Client-side status filtering** → Filtering happens client-side on already-loaded data, not via server queries. This is fine for the expected volume (tens of issues, not thousands). Can be moved to server-side pagination in a future stage.
