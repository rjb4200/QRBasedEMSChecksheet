## Context

The Restocking List currently displays deficiency entries as plain text. Crews need to mark items as addressed, and the state must be visible to all providers viewing the same unit. The issue specifies a polling-based approach rather than Supabase Realtime for lower complexity.

## Goals / Non-Goals

**Goals:**
- Store addressed state per restocking item in a `daily_restock_items` table.
- Render checkboxes on each Restocking List entry.
- Save addressed toggles to the database on click.
- Poll for addressed state changes every 15 seconds when the list is expanded and visible.
- Polling must not reload, flicker, collapse sections, or reset form state.
- Reposition the Restocking List immediately below the header, above the crew signature (CrewNameLock) section.

**Non-Goals:**
- Do not implement Supabase Realtime in the first version.
- Do not modify the original checkoff exception data.
- Do not remove entries from the Restocking List when addressed.
- Do not add loading spinners during normal polling (only for initial load or errors).

## Decisions

1. **Use a `RestockingAddressedMap` passed to the client component.**

   Rationale: The page server component queries `daily_restock_items` and passes the addressed state as initial props. This avoids the client needing to backfill rows on first render.

   Alternative considered: Have the client backfill on first expand. Adds complexity to the first-render path.

2. **Create a `daily_restock_items` updater function in restocking-list.ts.**

   Rationale: Co-locate the data logic with the existing restocking types. The component only calls a clean toggle action.

3. **Polling with `useEffect` + `setInterval` + guards.**

   Rationale: Simple, standard React pattern. Guards (expanded, visibility, save-in-progress) pause/resume the interval.

   ```
   ┌─────────────────────────────────────────────┐
   │           POLLING STATE MACHINE             │
   ├─────────────────────────────────────────────┤
   │                                             │
   │   [expanded=false] ──▶ STOPPED              │
   │   [tab hidden]     ──▶ STOPPED              │
   │   [saving]         ──▶ STOPPED              │
   │   [expanded +      ──▶ RUNNING              │
   │    visible +        │  fetch every 15s      │
   │    not saving]      │                       │
   │                                             │
   └─────────────────────────────────────────────┘
   ```

4. **Optimistic UI with revert on failure.**

   Rationale: Checkbox toggle should feel instant. The DB write happens in the background. If it fails, revert the checkbox and show a brief error.

   Alternative considered: Wait for server response before toggling. Feels sluggish on the UI.

## Risks / Trade-offs

- Polling adds server load -> 15-second interval is low frequency. The query is a simple indexed lookup.
- Stale data window up to 15 seconds -> Acceptable for a crew restocking workflow. Can be upgraded to Realtime later without changing the data model.
- `visibilityState` not available in all browsers -> Fallback: always poll when expanded. Minor.
- Moving the Restocking List to the top of the page below the header makes it the first actionable content crews see -> This prioritizes restocking awareness over the compartment status grid.
