# Design: Add Unit Display Order

## Context

The application currently relies on implicit ordering, typically alphabetical unit names or raw query ordering. Different pages and exports can therefore present units in inconsistent order.

Operational workflows benefit from a consistent department-defined order. Users expect the same unit order everywhere: Fleet panel, checkoff pages, printouts, exports, emails, archives, and dashboard summaries.

## Goals

- Create one authoritative unit ordering source.
- Keep ordering logic centralized and reusable.
- Ensure operational, print, export, and reporting views remain visually consistent.
- Avoid breaking existing visibility/filtering logic.
- Preserve stable ordering when duplicate or missing order values exist.

## Database design

Add a nullable numeric field to `units`:

```sql
sort_order integer null
```

### Ordering rules

Primary sort:

```text
sort_order ASC NULLS LAST
```

Secondary stable fallback:

```text
name ASC
```

### Migration/backfill

Existing units should receive deterministic values during migration so current visible ordering remains stable after deployment.

Recommended approach:

- Read existing units ordered by current production order.
- Assign incremental values such as 10, 20, 30.
- Leave spacing for future inserts.

## Shared ordering helper

Introduce a shared ordering helper or query utility:

```ts
orderUnits(query)
```

or

```ts
ORDER BY sort_order NULLS LAST, name ASC
```

The goal is preventing pages from independently implementing ordering logic.

## Areas affected

### Fleet panel

Fleet status cards and operational summaries must use configured ordering.

### User unit selection

Unit selection/checkoff-start views must use configured ordering.

### Admin unit management

The admin units page should display the same order being edited.

### Print and PDF rendering

The following must use configured ordering:

- `/admin/checksheets/print`
- Daily email checksheet PDFs
- Export-generated PDFs

### Daily email reporting

Email body sections containing unit lists should use configured ordering:

- unchecked units
- discrepancies/exceptions
- completion summaries

### Records and archives

Views grouped or filtered by unit should preserve configured ordering.

### Exports/imports

Truck layout export/import should preserve ordering metadata.

### Equipment Catalog usage badges

Where equipment usage lists display multiple units, badges should use configured unit order.

## Admin editing UX

Possible approaches:

### Numeric input

Simple numeric `sort_order` field.

Pros:
- Easy implementation.
- Easy bulk editing.
- Predictable database behavior.

Cons:
- Less user-friendly for large reorder operations.

### Up/down controls

Provide move-up/move-down buttons.

Pros:
- Easier for small adjustments.

Cons:
- More server writes.
- Harder for large lists.

### Drag-and-drop

Optional future enhancement.

## Edge cases

### Duplicate sort values

If multiple units share the same value:

```text
sort_order ASC, name ASC
```

ensures stable output.

### Missing values

Null values should sort after configured values.

### Deleted/archived/OOS units

Visibility rules remain unchanged. Only visible ordering changes.

## Risks

- Pages may accidentally bypass shared ordering logic.
- Some exports or API routes may continue using legacy ordering.
- Manual numeric editing may create duplicates frequently.

## Mitigations

- Centralize ordering logic.
- Add regression tests for key operational views.
- Document ordering expectations in OpenSpec and admin documentation.
