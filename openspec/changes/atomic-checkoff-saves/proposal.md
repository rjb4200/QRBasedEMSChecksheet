## Why

The checkoff save pipeline has three independent triggers (page-load auto-create, 700ms debounced auto-save, and manual submit) that race against each other without coordination. The SELECT-then-INSERT/UPDATE pattern in `upsertTargetCheck()` is not atomic — two concurrent requests can both find no existing row and both insert, creating duplicates. Critically, the auto-save timer is never cancelled on submit, meaning a completed check can be silently overwritten back to "in_progress." The database already has unique indexes to enforce correctness at the schema level, but the application code doesn't leverage them — it uses a race-prone two-step pattern instead of an atomic upsert.

## What Changes

- Replace the `SELECT → INSERT/UPDATE` pattern in `upsertTargetCheck()` with Supabase `.upsert()` using `onConflict` on the existing unique indexes
- Apply the same `.upsert()` pattern to the page-load auto-create logic in `page.tsx` for both compartment and kit targets
- Clear the 700ms auto-save timer when the Submit button is clicked
- Add an `isSubmitting` guard to prevent auto-saves from firing during submission
- Handle upsert errors gracefully instead of crashing on constraint violations

## Capabilities

### New Capabilities

- `atomic-checkoff-saves`: Make checkoff target saves atomic using database-level upsert with `onConflict`, and prevent the client-side auto-save from racing with manual submission

### Modified Capabilities

- `collision-prevention`: The save mechanism changes from SELECT+INSERT/UPDATE to atomic upsert, but the behavioral requirements (lock detection, stale timeout, takeover) remain unchanged

## Impact

- **Affected files**: `src/app/checkoff/[unitId]/[compartmentId]/actions.ts`, `src/app/checkoff/[unitId]/[compartmentId]/page.tsx`, `src/app/checkoff/[unitId]/[compartmentId]/checkoff-form.tsx`, `src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx`
- **No new dependencies** — Supabase `.upsert()` with `onConflict` is already available
- **No database changes** — the unique indexes already exist and are the `onConflict` targets
- **No API or schema changes**
