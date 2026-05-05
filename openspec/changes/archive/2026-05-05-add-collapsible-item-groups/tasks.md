## 1. Database Schema

- [x] 1.1 Add migration for `unit_compartment_item_groups` with indexes, uniqueness, timestamps, and RLS/admin policies
- [x] 1.2 Add migration for `kit_item_groups` with indexes, uniqueness, timestamps, and RLS/admin policies
- [x] 1.3 Add nullable `group_id` to `unit_compartment_items` with `ON DELETE SET NULL`
- [x] 1.4 Add nullable `group_id` to `kit_items` with `ON DELETE SET NULL`
- [x] 1.5 Add indexes for item group lookup and deterministic ordering
- [x] 1.6 Decide whether to backfill existing `subcategory` values into groups and implement if chosen
- [x] 1.7 Apply migration to Supabase

## 2. Shared Group Rendering

- [x] 2.1 Add a small grouping helper that sorts groups, grouped items, and ungrouped items deterministically
- [x] 2.2 Render grouped checkoff items with native `<details open>` sections
- [x] 2.3 Render ungrouped items after grouped sections
- [x] 2.4 Hide empty groups in crew checkoff UI
- [x] 2.5 Preserve existing input controls and checkoff payload shape

## 3. Compartment Admin Groups

- [x] 3.1 Query compartment groups on unit detail page
- [x] 3.2 Add actions to create, rename, delete, and reorder compartment groups
- [x] 3.3 Add group selector when adding equipment to a compartment
- [x] 3.4 Add group selector for existing compartment items
- [x] 3.5 Render compartment items grouped on the admin unit detail page
- [x] 3.6 Ensure deleting a group ungroups items without deleting items

## 4. Kit Admin Groups

- [x] 4.1 Query kit groups on kit edit page and unit read-only kit displays
- [x] 4.2 Add actions to create, rename, delete, and reorder kit groups
- [x] 4.3 Add group selector when adding equipment to a kit
- [x] 4.4 Add group selector for existing kit items
- [x] 4.5 Render kit items grouped on kit admin pages and unit read-only kit sections
- [x] 4.6 Ensure deleting a kit group ungroups items without deleting items

## 5. Copy, Import, and Clone Workflows

- [x] 5.1 Update unit copy to copy compartment groups and remap copied item group IDs
- [x] 5.2 Update compartment import/copy to copy groups and remap copied item group IDs
- [x] 5.3 Update create-kit-from-compartment to copy groups into kit groups and remap item group IDs
- [x] 5.4 Update clone-kit-to-compartment to copy kit groups into compartment groups and remap item group IDs
- [x] 5.5 Verify kit assignments remain references and do not duplicate kit groups during unit copy

## 6. Crew Checkoff and Reporting Safety

- [x] 6.1 Update compartment checkoff page queries to include groups and group IDs
- [x] 6.2 Update assigned kit checkoff page queries to include groups and group IDs
- [x] 6.3 Verify QR routes and QR print pages are unchanged except grouped display where applicable
- [x] 6.4 Verify fleet totals and completion calculations are unchanged
- [x] 6.5 Verify archives, print documents, CSV exports, analytics, and discrepancies do not treat groups as targets

## 7. Validation

- [x] 7.1 Run `npm run lint`
- [x] 7.2 Run `npm run typecheck`
- [x] 7.3 Run `npm run build`
- [x] 7.4 Verify admin can manage groups in compartments and kits
- [x] 7.5 Verify crew checkoff groups default open on desktop and mobile
- [x] 7.6 Verify deleting groups preserves items as ungrouped
