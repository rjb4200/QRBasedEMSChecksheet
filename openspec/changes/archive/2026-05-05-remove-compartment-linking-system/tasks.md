## 1. Admin Unit Management Cleanup

- [x] 1.1 Remove `linkUnitCompartment` from `src/app/admin/units/actions.ts`
- [x] 1.2 Remove `linked_group` selection, display, form fields, and `linkUnitCompartment` import from `src/app/admin/units/[id]/page.tsx`
- [x] 1.3 Update `importUnitCompartment` so imported compartments do not select, preserve, or write `linked_group`
- [x] 1.4 Update `addUnitItem` so it adds items only to the submitted `compartmentId`
- [x] 1.5 Search admin unit code for remaining linked-compartment UI text or state and remove it

## 2. Runtime Linking Logic Removal

- [x] 2.1 Search application code for `linked_group`, `linkUnitCompartment`, `shared_compartment`, `shared_item_id`, and linked-compartment wording
- [x] 2.2 Remove or simplify any runtime logic that reads linked-compartment fields
- [x] 2.3 Remove or simplify any runtime logic that writes linked-compartment fields
- [x] 2.4 Verify checkoff submission writes only to the selected unit and compartment
- [x] 2.5 Verify fleet completion/status logic uses direct compartment check records only
- [x] 2.6 Verify QR generation and QR print pages do not group, label, or route based on links

## 3. Database and Types Cleanup

- [x] 3.1 Inspect Supabase migrations/schema for linking-only columns, indexes, constraints, tables, and foreign keys
- [x] 3.2 Add a Supabase migration to drop `unit_compartments.linked_group` and its index if no runtime dependency remains
- [x] 3.3 Remove linking-only shared-compartment schema objects if present and no longer used
- [x] 3.4 Regenerate or update TypeScript database types if the project contains generated Supabase types

## 4. Documentation and OpenSpec Cleanup

- [x] 4.1 Remove linked-compartment guidance from `ADMINGUIDE.md`
- [x] 4.2 Update active OpenSpec specs that still claim linked compartments are supported
- [x] 4.3 Mark or archive pending linked-compartment enhancement changes as obsolete if they conflict with this removal

## 5. Verification

- [x] 5.1 Verify admin users cannot create, edit, view, or manage compartment links
- [x] 5.2 Verify adding an item to one compartment does not add it to any other compartment
- [x] 5.3 Verify importing/copying a compartment creates an independent compartment
- [x] 5.4 Verify QR code routes still open exactly one compartment checkoff page
- [x] 5.5 Verify completing one compartment does not complete or affect another compartment
- [x] 5.6 Run `npm run lint`
- [x] 5.7 Run `npm run typecheck`
- [x] 5.8 Run `npm run build`
