## Why

The restocking list and exception views are short-term, shift-bound tools for crew-facing equipment checks. Admins have no way to create, track, or resolve long-running problems that span multiple shifts — a missing IV pump that won't be replaced for weeks, a radio that intermittently fails, a cabinet door that needs maintenance. These aren't checkoff discrepancies; they're known operational issues that need a persistent home visible to all admins.

## What Changes

- Create an `issues` database table with title, description, optional unit reference, status (open/in_progress/closed), creator, and timestamps
- Add a new `/admin/issues` page displaying all issues in a filterable list with status tabs
- Add a collapsible create-issue form directly on the page
- Add status-change dropdowns on each issue card to move between open → in_progress → closed
- Add an "Issues" link to the top admin navigation bar (not the hamburger menu)
- Create admin-authenticated API routes for listing, creating, updating, and deleting issues

## Capabilities

### New Capabilities

- `issue-tracker`: An admin-facing issues page where long-running operational problems can be created, filtered by status, and moved through an open → in_progress → closed lifecycle independently of the crew-facing restock system

## Impact

- **New files**: `src/app/admin/issues/page.tsx`, `src/app/api/admin/issues/route.ts`, `src/app/api/admin/issues/[id]/route.ts`, database migration
- **Modified files**: `src/components/admin-nav.tsx` (add top-nav link), `src/lib/system-log.ts` (if logging issue creation/status changes)
- **Database**: New `issues` table (7 columns, 1 FK to units)
- **Dependencies**: None
