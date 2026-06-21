## GitHub Issue

Fixes #94: Fix README documentation drift for database guide, environment variables, and current admin areas.

## Root Cause

`README.md` has not been kept in sync with current repository state. It still describes `DATABASEGUIDE.md` as future work, omits current environment variables from `.env.example`, and summarizes admin navigation with outdated wording.

## Proposed Solution

- Update README environment variable tables to match `.env.example`.
- Replace the future `DATABASEGUIDE.md` reference with the existing documentation file.
- Refresh admin feature/navigation descriptions to reflect current routes and distinguish implemented areas from planned capabilities.
- Keep deployment notes aligned with the updated environment variable list.

## Scope

- Documentation-only changes to `README.md`.
- OpenSpec proposal/task archive for traceability.

## Non-Goals

- No application code changes.
- No environment variable renaming.
- No deployment configuration changes.
- No database, RLS, or Supabase changes.

## Risk Assessment

- Regression risk: Very low. Documentation-only.
- Security risk: Low. The update reinforces that secrets remain server-only and must not be committed.

## Verification Plan

- Compare README variable tables against `.env.example`.
- Confirm `DATABASEGUIDE.md` exists and README links to it as current documentation.
- Run a docs-focused diff review.
- Run `npm run typecheck` to confirm no accidental code impact.

## Rollback Plan

Revert the README and OpenSpec archive changes. No runtime state or database changes are involved.
