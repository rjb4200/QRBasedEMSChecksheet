## Why

The Records page currently duplicates export controls: one row for "Export Package" (from/to dates with a single button) and a separate row for "Simple CSV" and "Detailed CSV" links. Consolidating all three export formats into the same from/to date form reduces visual clutter, eliminates redundant date input, and makes export options discoverable in one place.

## What Changes

- Remove the standalone "Simple CSV" and "Detailed CSV" link row from the Records page
- Add "Simple CSV" and "Detailed CSV" as submit buttons in the existing Export form row alongside "Full Package"
- The Export form's `from`/`to`/`unitId` inputs now serve all three format buttons uniformly
- Existing export routes (`/admin/archives/export` and `/admin/archives/export-package`) are unchanged

## Capabilities

### Modified Capabilities

- `archive-history`: Records page export layout consolidated — CSV links removed, CSV buttons added to the Export form row alongside the Full Package button

## Impact

- **Modified**: `src/app/admin/archives/page.tsx` — remove standalone CSV link row, add two new submit buttons to the Export form
- **No route changes** — existing export and export-package routes unchanged
- **No new dependencies, no migrations, no tests required**
