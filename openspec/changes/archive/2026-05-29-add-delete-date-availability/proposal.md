## Why

Admins currently must guess a DELETE date range before previewing whether any records exist in that range. This makes the destructive data rotation workflow harder to use because the page gives no guidance about where historical records actually begin.

## What Changes

- Show the available eligible DELETE record date range in the DELETE Records section.
- Default the DELETE range to the oldest eligible records instead of the currently selected single records-page date.
- Set the default DELETE end date to no more than 60 days after the oldest eligible date and never include today's shift.
- Keep the existing preview/export/slide-to-confirm delete flow unchanged.
- Do not replace native date inputs with a custom calendar in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `data-rotation`: DELETE record range selection will surface available data dates and default to the oldest eligible deletion window.

## Impact

- Affects the Records page DELETE section defaults and helper text.
- Affects server-side data lookup for data rotation date availability.
- No database schema changes expected.
- No new frontend calendar dependency expected.
