## Context

The admin UI has been incrementally iconified over multiple changes. Pages that have already been converted use these icon conventions:

| Action | Icon | Source |
|---|---|---|
| Edit | `IconEdit` (pencil) | `icons.tsx` |
| Delete | `IconTrash` (trash can) | `icons.tsx` |
| Save | `IconSave` (floppy disk) | `icons.tsx` |
| Cancel | `IconCancel` (X) | `icons.tsx` |
| QR Codes | `IconQr` (QR code) | `icons.tsx` |
| Filter | Inline SVG (funnel) | `analytics/page.tsx` |

Some pages still use text for these same actions. This change brings them in line with the standard.

## Goals / Non-Goals

**Goals:**

- Replace text action buttons with the standard icon set.
- Extract the filter SVG into a shared `IconFilter` component.
- Document the standard so future pages use icons without needing separate proposals.

**Non-Goals:**

- Change form submit buttons that have long descriptive labels ("Create Kit", "Print Today's Check Sheets").
- Change state-toggle buttons ("Set OOS/Set In-Service").
- Convert pagination links ("Previous", "Next") to icons.

## Decisions

1. Row-level repeated actions use icon-only buttons with tooltips.

   Edit, Delete, Save, Cancel, and Remove actions that appear on every row of a list use the shared icon components. Tooltips and `aria-label` attributes provide accessible labels.

   Alternative: icon + text. Adds horizontal space and visual clutter for repeated actions.

2. Add `IconFilter` to the shared icons file.

   The analytics page has an inline filter SVG. Extracting it to `icons.tsx` makes it available to the system log page and other future pages.

   Alternative: copy the SVG inline on each page. Duplicates the SVG, makes future changes harder.

3. Save buttons continue to use the `SaveButton` wrapper component where applicable.

   The `SaveButton` component already handles pending/saved state. Pages that use `<SaveButton>` or `<button type="submit">` with `IconSave` both follow the standard.

   Alternative: always use SaveButton. Not always feasible — server component forms don't need a client-side pending indicator.

## Icon Reference

These are the standard icons and their recommended use:

| Icon | When to use |
|---|---|
| `IconEdit` | Edit/rename row actions |
| `IconTrash` | Delete/remove row actions |
| `IconSave` | Save form changes |
| `IconCancel` | Cancel editing or dismiss confirm |
| `IconQr` | Navigate to QR codes |
| `IconFilter` | Filter/search actions |
