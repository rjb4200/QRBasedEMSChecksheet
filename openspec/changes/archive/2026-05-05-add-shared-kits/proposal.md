## Why

Repeated equipment layouts need a reliable single source of truth without reviving compartment linking. Shared kits provide centrally managed equipment layouts that units can reference directly while preserving independent checkoff state per unit assignment.

## What Changes

- Add an admin-managed Kits section at `/admin/kits` with navigation from the admin menu.
- Add database tables for shared kit definitions, kit equipment items, and unit kit assignments.
- Allow admins to create, edit, reorder, copy, photo-manage, and delete kits, with deletion blocked while assigned.
- Allow admins to assign kits to units, remove kit assignments, and display assigned kits alongside compartments in a compact read-only style.
- Allow admins to clone a kit into a normal independent unit compartment.
- Allow admins to create a kit from an existing compartment.
- Extend crew checkoff so assigned kits behave like compartments while storing checkoff state independently for each unit kit assignment.
- Extend QR generation/printing so each unit kit assignment gets its own QR code.
- Extend fleet completion, records, printouts, exceptions, and archive-related views to include assigned kits where compartment checks currently appear.
- Keep normal compartments and the global equipment catalog unchanged.

## Capabilities

### New Capabilities
- `shared-kits`: Admin-managed shared kit definitions, unit kit assignments, kit checkoff targets, QR codes, fleet completion, and records integration.

### Modified Capabilities
- None

## Impact

- Database: new `kits`, `kit_items`, and `unit_kits` tables; checkoff storage extended to target either compartments or kit assignments.
- Admin UI: `src/app/admin/layout.tsx`, new `src/app/admin/kits/*`, and `src/app/admin/units/*` assignment/clone UI.
- Crew UI: unit dashboard and checkoff routes/forms need a combined target model for compartments and assigned kits.
- QR: API and admin QR print pages need kit assignment QR codes.
- Reporting: fleet status, daily checksheet documents, archive/records, discrepancy/exception reporting, and alerts need kit-aware totals and records.
- Storage: kit photo uploads use existing compartment-photo pattern or a dedicated kit-photo path/bucket.
