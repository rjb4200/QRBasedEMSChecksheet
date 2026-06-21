## GitHub Issue

Fixes #95: Update Admin Guide to reflect current navigation, Pushover settings, and upcoming Issues workflow.

## Root Cause

`ADMINGUIDE.md` still describes older admin navigation and only partially documents current communication and issue-tracking workflows. Current routes include Records/Archives, System Log, Issues, Templates, and admin dashboard cards that are not accurately reflected in the guide.

## Proposed Solution

- Update route references and admin area names to match current routes.
- Document Records/Archives and System Log as current admin areas.
- Expand Admin Users communication settings to include weekly issues digest and shift-specific Pushover preferences.
- Document the current Issues workflow: list/detail pages, tags, comments, addressed notes, weekly digest relationship, and Fleet visibility.

## Scope

- Documentation-only changes to `ADMINGUIDE.md`.
- OpenSpec proposal/task archive for traceability.

## Non-Goals

- No application code changes.
- No new Issues workflow functionality.
- No notification behavior changes.
- No database, API, or authentication changes.

## Risk Assessment

- Regression risk: Very low. Documentation-only.
- Operational risk: Low. The guide will more accurately describe shipped admin workflows.

## Verification Plan

- Compare documented admin routes against `src/app/admin/**/page.tsx`.
- Compare documented notification settings against Admin Users page state fields.
- Review the docs-only diff.
- Run `npm run typecheck` to confirm no code impact.

## Rollback Plan

Revert the Admin Guide and OpenSpec archive changes. No runtime or database state is affected.
