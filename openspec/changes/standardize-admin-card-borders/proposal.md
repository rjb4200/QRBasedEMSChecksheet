## Why

Admin pages use card containers to group related content — list containers, individual list items, and section panels. Border weight on these cards is inconsistent: Archives and Kits use `border-2` while Units, Equipment, and Issues use `border` (or no border at all). Following the header (#69) and form panel (#70) standardization, this unifies card borders to `border-2` — the heavier weight provides clearer visual separation between cards.

## What Changes

- Upgrade Units list items from `border` to `border-2 border-slate-200`
- Upgrade Units list container from no border to `border-2 border-slate-200`
- Upgrade Equipment catalog rows from `border` to `border-2 border-slate-200`
- Upgrade Issues list container from `border` to `border-2 border-slate-200` and add `p-5` padding

## Capabilities

### New Capabilities

- `admin-card-borders`: Standardize admin list container and list item cards to use `border-2 border-slate-200`

### Modified Capabilities

None — pure visual standardization, no behavioral changes.

## Impact

- **Affected files (5)**: `src/app/admin/units/page.tsx`, `src/app/admin/equipment/editable-catalog-row.tsx`, `src/app/admin/issues/page.tsx`, `src/components/fleet-matrix.tsx`
- **Unaffected**: Archives, Kits already use `border-2`. Content cards (forms, sections) remain borderless.
- **No API, database, or dependency changes**
