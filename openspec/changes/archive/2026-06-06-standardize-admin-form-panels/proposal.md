## Why

Admin form panels have accumulated visual inconsistencies across 13 forms on 9 pages. Border radius drifts between `rounded-xl` and `rounded-2xl`. Card padding alternates between `p-4` and `p-5`. Two filter panels lack section labels entirely. Following the header standardization in #69, this brings the same rigor to form panels — defining two clean patterns (always-visible and expandable) that share identical visual classes but differ in UX structure.

## What Changes

- Unify all form inputs, selects, and buttons to `rounded-2xl` (fix `rounded-xl` drift on Issues and Users pages)
- Unify card padding on form panel wrappers to `p-4`
- Remove stray `border border-slate-200` from Equipment Add form
- Add missing red section labels to Archives Filter and Analytics Filter
- Standardize Kits From Compartment submit button to primary red style
- Gridify Archives Export layout and fix its non-standard label style
- Remove inner `bg-slate-50` container from Issues Create and Users Add forms
- Formalize two panel styles: always-visible form panel and expandable toggle panel

## Capabilities

### New Capabilities

- `admin-form-panels`: Standardize create/add panels and filter panels across admin pages with two visual patterns sharing identical class tokens

### Modified Capabilities

None — pure visual and structural standardization, no behavioral requirement changes.

## Impact

- **Affected files (9 pages)**: `src/app/admin/page.tsx`, `src/app/admin/equipment/page.tsx`, `src/app/admin/system-log/page.tsx`, `src/app/admin/archives/page.tsx`, `src/app/admin/analytics/page.tsx`, `src/app/admin/units/page.tsx`, `src/app/admin/kits/page.tsx`, `src/app/admin/issues/page.tsx`, `src/app/admin/users/page.tsx`
- **Unaffected**: Detail/builder pages, print pages, QR page — no form panels to change
- **No API, database, or dependency changes**
