## 1. Database Schema

- [x] 1.1 Add Supabase migration for `kits`, `kit_items`, and `unit_kits`
- [x] 1.2 Add indexes and uniqueness constraints for kit names, kit items, and unit assignments
- [x] 1.3 Extend `compartment_checks` with nullable `unit_kit_id`
- [x] 1.4 Replace compartment-only check uniqueness with partial unique indexes for compartment and kit targets
- [x] 1.5 Add check constraint requiring exactly one target: `compartment_id` or `unit_kit_id`
- [x] 1.6 Add RLS policies/triggers consistent with current admin/service access patterns
- [x] 1.7 Apply migration to Supabase

## 2. Admin Navigation and Kit CRUD

- [x] 2.1 Add Kits link to `src/app/admin/layout.tsx`
- [x] 2.2 Create `src/app/admin/kits/actions.ts`
- [x] 2.3 Create `src/app/admin/kits/page.tsx` listing kits and assignments
- [x] 2.4 Create `src/app/admin/kits/[id]/page.tsx` for kit editing
- [x] 2.5 Implement create, update metadata, copy, and delete kit actions
- [x] 2.6 Block kit deletion while assigned and show assigned units
- [x] 2.7 Implement kit photo upload using existing storage pattern or a kit-specific path

## 3. Kit Item Management

- [x] 3.1 Add equipment selector using `equipment_catalog`
- [x] 3.2 Add kit item action defaulting `input_type` and `par_level` from catalog
- [x] 3.3 Implement delete kit item action
- [x] 3.4 Implement kit item reorder action
- [x] 3.5 Prevent duplicate equipment entries in a kit
- [x] 3.6 Ensure kit item edits affect all assigned units by reading from `kit_items`

## 4. Copy and Clone Workflows

- [x] 4.1 Implement `createKitFromCompartment`
- [x] 4.2 Add UI on Kits page to create a kit from an existing compartment
- [x] 4.3 Implement `cloneKitToUnitCompartment`
- [x] 4.4 Add UI on unit detail page to create an independent compartment from a kit
- [x] 4.5 Verify cloned compartments do not remain tied to kits

## 5. Unit Kit Assignment UI

- [x] 5.1 Query available kits and assigned `unit_kits` on unit detail page
- [x] 5.2 Implement `assignKitToUnit` action
- [x] 5.3 Implement `removeKitFromUnit` action
- [x] 5.4 Render compartments and assigned kits in one combined sort order
- [x] 5.5 Render assigned kit cards collapsed by default using `<details>`
- [x] 5.6 Show kit equipment read-only when expanded
- [x] 5.7 Add direct `Edit Kit` link for each assigned kit
- [x] 5.8 Copy unit creation flow should copy kit assignments as references

## 6. Crew Checkoff Targets

- [x] 6.1 Add shared target mapping helper for compartments and kit assignments
- [x] 6.2 Update unit dashboard page to list assigned kits with compartments
- [x] 6.3 Add kit checkoff route for `/checkoff/{unitId}/kit/{unitKitId}`
- [x] 6.4 Reuse checkoff form rendering for kit items
- [x] 6.5 Update checkoff save/takeover/submit logic to support `unit_kit_id`
- [x] 6.6 Ensure kit checkoff completion is independent per unit assignment
- [x] 6.7 Preserve current compartment checkoff route behavior

## 7. QR Code Support

- [x] 7.1 Update admin QR print page to include assigned kits
- [x] 7.2 Update QR API endpoint to include assigned kits
- [x] 7.3 Generate kit assignment QR URLs with `unitId` and `unitKitId`
- [x] 7.4 Verify each assignment of the same kit gets a distinct QR code

## 8. Fleet, Records, and Reporting

- [x] 8.1 Update `src/lib/fleet.ts` to count assigned kits in totals and completion
- [x] 8.2 Update unit list/count displays to include kits where appropriate
- [x] 8.3 Update `src/lib/checksheet-documents.ts` to include kit targets in print documents and CSV exports
- [x] 8.4 Update archive record helpers to include kit target totals and check rows
- [x] 8.5 Update discrepancy/exception reporting to include kit items
- [x] 8.6 Update incomplete unit alert logic to count assigned kits
- [x] 8.7 Update analytics queries/display to include kit targets or target labels

## 9. Documentation and Validation

- [x] 9.1 Update `ADMINGUIDE.md` with Kits page and assignment workflow
- [x] 9.2 Run `npm run lint`
- [x] 9.3 Run `npm run typecheck`
- [x] 9.4 Run `npm run build`
- [x] 9.5 Verify admin can create/edit/copy/delete unassigned kits
- [x] 9.6 Verify admin cannot delete assigned kits
- [x] 9.7 Verify assigned kits appear in unit, QR, crew, fleet, records, and print flows
