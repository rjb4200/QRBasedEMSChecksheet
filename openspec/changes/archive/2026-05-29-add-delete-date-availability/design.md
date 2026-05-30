## Context

The Records page includes a DELETE Records danger-zone component that accepts native date inputs, previews per-table row counts, exports a package, and then requires slide-to-confirm before deletion. The current defaults reuse the selected records-page date, so an admin can land on a date with no deletable historical data and has no visible hint about where records actually exist.

Native `input[type="date"]` controls cannot mark individual calendar days with data. Highlighting dates inside the calendar would require a custom date picker, which is larger than needed for the immediate usability problem.

## Goals / Non-Goals

**Goals:**

- Show admins the oldest and newest eligible dates containing operational records before they preview deletion counts.
- Default the DELETE range to the oldest eligible deletion window.
- Respect the existing 60-day maximum and existing rule that today's shift is never eligible for deletion.
- Keep the existing preview, export, and slide-to-confirm workflow intact.

**Non-Goals:**

- Replace native date inputs with a custom calendar.
- Display per-day dots, heatmaps, or counts inside the browser calendar picker.
- Change deletion eligibility rules, exported package contents, or transactional delete behavior.
- Add new database tables or external UI dependencies.

## Decisions

1. Use a server-side availability lookup instead of client-side probing.

   The page can query the minimum and maximum operational dates across the tables already included in data rotation, then pass those dates to the DELETE component. This avoids extra client round trips and keeps delete-range guidance consistent with server-side rules.

   Alternative considered: call the existing preview endpoint repeatedly from the client. That would be slower, noisier, and still would not identify the true oldest date without scanning ranges.

2. Default to the oldest eligible 60-day window.

   The default `from` date will be the oldest eligible operational record date. The default `to` date will be the earliest of oldest-plus-60-days, newest eligible record date, and yesterday's shift date. This makes the default range useful while preserving the current 60-day guardrail and today's exclusion.

   Alternative considered: keep defaulting to the selected Records page date and only show helper text. That improves discoverability but still forces admins to manually enter the obvious first cleanup window.

3. Treat date availability as guidance, not authorization.

   The availability lookup helps populate the UI, but the existing validation and database functions remain the source of truth for deletion. Preview and POST delete must still validate the selected range.

   Alternative considered: rely only on disabled/min/max input attributes. This is insufficient because clients can bypass UI constraints and because admins may still choose a narrower valid range.

## Risks / Trade-offs

- Availability query misses a table that delete includes -> keep the lookup aligned with the existing data-rotation table list and cover it with tests.
- No eligible records exist -> show a clear empty-state message and avoid implying a valid delete range.
- Time-zone boundary confusion -> use existing shift-date strings and current shift date logic rather than browser-local date math.
- Helper text could be mistaken as confirmation counts -> label it as available date range only; retain the existing Preview Records step for exact counts.
