## Context

The Records page (`/admin/archives`) currently has two export areas:
1. An Export Package form with `from`/`to`/`unitId` fields and a single "Export Package" button
2. A separate row with "Simple CSV" and "Detailed CSV" `<Link>` elements that use the single-date filter's selected date

This change merges them into one unified export row.

## Goals / Non-Goals

**Goals:**
- One export form row with three buttons: Simple CSV, Detailed CSV, Full Package
- All three use the same `from`/`to`/`unitId` inputs
- Remove the standalone CSV link row
- Zero changes to backend routes

**Non-Goals:**
- No changes to export route handlers
- No changes to CSV or ZIP format
- No new dependencies

## Decisions

### Single form, three `formAction` targets

```tsx
<form method="get">
  <input name="unitId" type="hidden" />
  <input name="from" type="date" />
  <input name="to" type="date" />
  <button formAction="/admin/archives/export?mode=simple">Simple CSV</button>
  <button formAction="/admin/archives/export?mode=detailed">Detailed CSV</button>
  <button formAction="/admin/archives/export-package">Full Package</button>
</form>
```

**Rationale:** The export route already accepts `from`/`to`/`unitId` query params. The existing CSV links were using the single-date filter's params rather than the export form's date range — this fixes that inconsistency. All three exports now use the explicit from/to range.

**Alternatives considered:**
- **Keep CSV links separate** — Duplicate controls, harder to discover.
- **Radiobutton to select format** — Extra click, overengineered for 3 options.
