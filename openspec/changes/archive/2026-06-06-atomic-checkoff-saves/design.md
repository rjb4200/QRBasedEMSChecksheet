## Context

The checkoff save pipeline uses a `SELECT → INSERT/UPDATE` pattern that is not atomic. Three independent triggers (page-load auto-create, 700ms debounced auto-save, manual submit) can race. The auto-save `useEffect` timer is never cancelled on submit, meaning a completed check can be overwritten back to "in_progress." Supabase's `.upsert()` with `onConflict` provides atomic upsert semantics using the existing database unique indexes, but the application code doesn't use it.

## Goals / Non-Goals

**Goals:**
- Make every write to `compartment_checks` atomic — no SELECT-then-INSERT/UPDATE window
- Prevent the auto-save timer from firing during or after a manual submission
- Apply the same atomic pattern to both compartment and kit checkoff paths

**Non-Goals:**
- Adding database-level transactions (Supabase client doesn't support explicit transactions on the server)
- Changing the collision prevention lock/takeover/stale-timeout behavior
- Modifying the checkoff form's UI or UX

## Decisions

### Decision 1: Use Supabase `.upsert()` with `onConflict` instead of SELECT+INSERT/UPDATE

Supabase's `.upsert()` accepts an `onConflict` option that maps to PostgreSQL's `ON CONFLICT ... DO UPDATE`. The existing partial unique indexes (`compartment_checks_compartment_target_unique` and `compartment_checks_kit_target_unique`) are the natural conflict targets.

```ts
// Before (race-prone):
const { data: existing } = await supabase.select(...).maybeSingle();
const result = existing ? UPDATE : INSERT;

// After (atomic):
const result = await supabase
  .from("compartment_checks")
  .upsert(payload, { onConflict: "unit_id, compartment_id, shift_date, shift_period" });
```

Supabase internally translates `onConflict` to a Postgres `ON CONFLICT (...) DO UPDATE SET ...` clause. The key requirement is that the conflict columns match an existing unique constraint/index.

**Alternative considered**: Using database transaction with `BEGIN/COMMIT`. Rejected — Supabase JS client doesn't support explicit transactions, and the `upsert` approach achieves the same atomicity with a single round-trip.

### Decision 2: Use `ignoreDuplicates: false` (upsert, not insert-or-ignore)

`.upsert()` with `onConflict` will update the existing row when a conflict is detected. This is the desired behavior — it replaces the manual SELECT-then-UPDATE path. Using `ignoreDuplicates: true` would silently skip conflicts, which would drop data.

### Decision 3: Clear auto-save timer and guard during submission

Three changes to `checkoff-form.tsx`:
1. Store the timer ref in a `useRef` so it can be cleared when submit fires
2. Set an `isSubmitting` ref to `true` when submit starts, checked in the auto-save callback
3. Clear the timer and guard during the `startTransition` callback

### Decision 4: Apply upsert to page-load auto-create as well

The page-load logic in `page.tsx` (both compartment and kit variants) currently does a manual SELECT-then-INSERT. Change to `.upsert()` for consistency and atomicity.

## Risks / Trade-offs

- **Risk**: `.upsert()` with `onConflict` requires exact column names matching the unique index. The compartment path uses `compartment_id` and the kit path uses `unit_kit_id` — different conflict columns → **Mitigation**: Pass the correct `onConflict` columns based on target type, matching the partial unique indexes
- **Risk**: Upsert may update columns that shouldn't be overwritten (e.g., `created_at`) → **Mitigation**: The upsert payload explicitly sets all columns, including `created_at` which is conditionally included only on first insert via `.upsert()` defaults behavior
- **Trade-off**: Losing the granular control of "SELECT first, then decide INSERT or UPDATE" → The decision is always "upsert the latest data," which is correct for this use case
