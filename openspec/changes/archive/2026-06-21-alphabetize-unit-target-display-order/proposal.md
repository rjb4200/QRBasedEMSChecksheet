## Why

Unit checkoff targets are currently ordered by manually entered `sort_order` values, which can leave mixed compartments and assigned kits hard to scan. Admins need a quick way to normalize a unit's target order alphabetically while preserving the existing weighted ordering system for manual adjustments and downstream views.

## What Changes

- Add a one-click unit builder action that alphabetizes a unit's mixed compartments and assigned kits by visible target name.
- Persist the alphabetized mixed order back to existing `unit_compartments.sort_order` and `unit_kits.sort_order` values.
- Keep unit checkoff, unit builder, QR labels, archives, and any other existing sort-order-driven views using persisted `sort_order` rather than adding a separate display-only sort.
- Preserve item ordering inside compartments and kits, QR location notes, section comments, status colors, and restocking behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `unit-configuration`: Unit builder gains a persisted alphabetize action for mixed compartment and assigned-kit target ordering.

## Impact

- Affected code: `src/app/admin/units/actions.ts`, `src/app/admin/units/[id]/page.tsx`.
- Affected data: existing `sort_order` columns on `unit_compartments` and `unit_kits` are updated when the admin explicitly runs the action.
- No database schema changes, migrations, dependency changes, or route changes.
