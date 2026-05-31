## Why

The units page panel uses a border on the outer wrapper instead of on the individual unit rows, which doesn't match the Fleet Panel pattern where borders are on the cards inside a borderless panel. Removing the panel border and adding borders to unit rows creates visual consistency.

## What Changes

- Remove `border border-slate-200` from the outer shared panel on the units page.
- Add `border border-slate-200` to in-service unit rows, matching the Fleet Panel card border pattern.

## Capabilities

### Modified Capabilities

- `unit-configuration`: Unit row borders match the Fleet Panel card styling.

## Impact

- Affects `src/app/admin/units/page.tsx`.
