## Context

The Exceptions panel groups items by date and renders a 5-column table inside each date section. Tables use `min-w-[760px]` forcing horizontal scroll. The table layout uses significant vertical space for headers, and the repeating table structure makes it hard to scan which unit has the most exceptions.

## Goals / Non-Goals

**Goals:**

- Group exceptions by unit within each date.
- Render each exception as a compact single-line row: `Item · Compartment — Issue (actual/expected)`.
- Make unit sections collapsible with a unit name header and count badge.
- Preserve the existing three-date default expansion and date-level grouping.

**Non-Goals:**

- Change the filter form, Export CSV, or date range logic.
- Change how exceptions are computed or stored.

## Decisions

1. Group exceptions by unit inside each date using a nested loop.

   A simple `reduce` or `Map<unitName, items[]>` within each date group. No new data fetching needed — the existing `group.items` array already has `unitName` on each item.

   Alternative: create a separate grouping function. Adds layer without benefit; the page server component can do the grouping inline.

2. Use collapsible unit sections within each date.

   Unit sections are closed by default within expanded dates, showing just the unit name and exception count. Opening reveals the compact rows.

   Alternative: expand all units by default. Would defeat the purpose of reducing visible noise.

3. Compact row format: `Item · Compartment — Issue (actual/expected)`.

   No column headers, no row borders beyond a subtle separator. The issue type is color-coded (red for Missing, amber for below par).

   Alternative: keep mini-table with two columns. Less compact.
