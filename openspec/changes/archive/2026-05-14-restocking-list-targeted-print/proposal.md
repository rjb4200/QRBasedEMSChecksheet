## Why

The Restocking List Print button currently calls `window.print()` which opens the browser print dialog for the entire unit page — including the header, status cards, crew lock, comments, and other sections. This produces a multi-page printout when crews only need a simple checklist of restocking items.

## What Changes

- Replace `window.print()` with a targeted print that opens a new window containing only the restocking checklist content and triggers the print dialog.
- The print output shows unit name, date, a "Restocking List" title, and the grouped deficiency items in a clean list format.
- No changes to Copy behavior or any other section.

## Capabilities

### New Capabilities

### Modified Capabilities
- `automatic-restocking-list`: Restocking List Print button prints only the restocking checklist instead of the full unit page.

## Impact

- `src/components/restocking-list-section.tsx` Print button handler.
- No database changes, no other surface changes.
