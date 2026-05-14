## 1. Shared Restocking Utility

- [x] 1.1 Audit existing exception detection logic in unit pages, archive records, print pages, and PDF/email generation.
- [x] 1.2 Create a shared restocking utility that normalizes quantity, checkbox, and condition deficiencies from `item_data`.
- [x] 1.3 Support both compartment and assigned-kit sources with source names and stable grouping.
- [x] 1.4 Ensure unchecked sections without check data do not produce restocking entries.

## 2. Unit Checksheet UI

- [x] 2.1 Query current unit check data and item definitions needed to build the unit Restocking List.
- [x] 2.2 Render a compact `Restocking List` section below Daily Unit Comments on the unit checksheet page.
- [x] 2.3 Hide the Restocking List when no exceptions exist.
- [x] 2.4 Add dynamic in-checkoff Restocking List updates as item values change on compartment and kit checkoff forms.

## 3. Records and Archive Surfaces

- [x] 3.1 Add Restocking List data to daily unit record read models using the shared utility.
- [x] 3.2 Render Restocking Lists in Records/archive views when historical exceptions exist.
- [x] 3.3 Ensure archived lists are derived from saved historical check data and remain hidden when empty.

## 4. Print, PDF, and Email Output

- [x] 4.1 Add Restocking List rendering to printable checksheets when unit exceptions exist.
- [x] 4.2 Add Restocking List rendering to checksheet PDF output.
- [x] 4.3 Add Restocking List rendering to daily email PDF/report output.
- [x] 4.4 Ensure print/PDF/email outputs omit Restocking List sections for units with no exceptions.

## 5. Verification

- [x] 5.1 Run `npm run typecheck` and `npm run lint`.
- [x] 5.2 Verify quantity, checkbox, and condition exceptions appear with readable deficiency text.
- [x] 5.3 Verify assigned kit exceptions appear grouped with compartment exceptions.
- [x] 5.4 Verify fixing item values removes entries dynamically during checkoff.
- [x] 5.5 Verify historical records, print output, PDF output, and daily email PDF include Restocking Lists only when exceptions exist.
