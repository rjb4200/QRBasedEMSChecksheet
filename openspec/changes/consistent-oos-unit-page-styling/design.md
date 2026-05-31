## Context

The Fleet Panel displays OOS units with muted slate styling: `bg-slate-50`, `border-slate-200`, `opacity-70`, an "Out of Service" badge in slate tones, and OOS timestamp/by-name details. The individual unit page currently uses a red danger banner (`border-red-200 bg-red-50 text-red-800`) that reads "This unit is out of service." These send conflicting visual signals.

The unit page query already selects `units.status` but does not currently select `oos_at` or `oos_by`, so OOS detail data is unavailable on the page.

## Goals / Non-Goals

**Goals:**

- Replace the red danger banner on the unit page with muted slate styling matching the Fleet Panel OOS treatment.
- Display OOS timestamp and by-name details when available from the database.
- Preserve all existing unit page behavior for in-service units.

**Non-Goals:**

- Change the Fleet Panel OOS styling.
- Add OOS toggling or management to the unit page.
- Change compartment/kit card styling on the unit page.
- Affect how OOS units are handled in checkoff workflows.

## Decisions

1. Match the Fleet Panel's slate color palette for OOS.

   Use the same `slate` tones and badge styling the Fleet Panel already uses for OOS cards. This creates visual consistency without introducing a new treatment.

   Alternative: keep the red banner but soften it. Confusing because red implies error/alarm.

2. Query `oos_at` and `oos_by` alongside the existing `units` select.

   The Fleet Panel already exposes `oosAt` and `oosByName` via the fleet status data path. The unit page can select these fields directly from the `units` table without schema changes.

   Alternative: call a separate endpoint for OOS details. Unnecessary complexity.

3. Fall back gracefully when no OOS detail data exists.

   Display a simple "Out of Service" slate banner when `oos_at` and `oos_by` are null, matching what the Fleet Panel does when no OOS timestamp is available.

   Alternative: omit the banner entirely if no OOS details exist. That would hide the OOS state.

## Risks / Trade-offs

- OOS units with no detail data won't show who/when -> keep the slate banner present with just "Out of Service" text.
- Unit page already uses slate for compartment card styling -> ensure the OOS banner is visually distinct from compartment cards.
