## Why

The Fleet Panel Exceptions section currently renders a wide horizontal-scrolling table inside each date group. This layout is visually heavy and hard to scan quickly. Grouping exceptions by unit within each date, as collapsible compact rows, eliminates the table and makes the section denser and faster to scan.

## What Changes

- Replace the per-date table with unit-grouped collapsible sections within each date.
- Each exception row becomes a compact single line: `Item · Compartment — Issue`.
- Keep date-level grouping and the existing three-day default expansion.
- Keep the filter form and Export CSV unchanged.

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: Exceptions panel renders unit-grouped compact rows instead of a table.

## Impact

- Affects the Fleet Panel page rendering.
- May require a helper to group exceptions by unit within each date.
