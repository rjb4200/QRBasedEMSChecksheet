## 1. Database

- [x] 1.1 Create migration adding nullable `qr_location_note` to `unit_compartments`
- [x] 1.2 Create migration adding nullable `qr_location_note` to `unit_kits`
- [x] 1.3 Verify existing rows remain valid with null reminder fields

## 2. Admin Unit Editor

- [x] 2.1 Update admin unit detail query to select compartment `qr_location_note`
- [x] 2.2 Update admin unit detail query to select unit-kit assignment `qr_location_note`
- [x] 2.3 Add server action to update a compartment QR location reminder
- [x] 2.4 Add server action to update an assigned kit QR location reminder
- [x] 2.5 Trim reminder text and store empty strings as `null`
- [x] 2.6 Add optional QR Location Reminder field for each compartment
- [x] 2.7 Add optional QR Location Reminder field for each assigned kit
- [x] 2.8 Revalidate the edited unit page after reminder saves

## 3. Unit Dashboard Display

- [x] 3.1 Update unit dashboard query to include compartment `qr_location_note`
- [x] 3.2 Update unit dashboard query to include assigned-kit `qr_location_note`
- [x] 3.3 Pass reminder text into target card rendering
- [x] 3.4 Add subtle collapsed-by-default expand/collapse control only when reminder text exists
- [x] 3.5 Show `QR Location:` label and reminder text near the bottom of expanded content
- [x] 3.6 Ensure targets with empty reminder text show no QR reminder UI
- [x] 3.7 Ensure mobile layout remains clean and readable

## 4. Workflow Preservation

- [x] 4.1 Confirm checkoff page routes are unchanged
- [x] 4.2 Confirm checkoff save/submit actions are unchanged
- [x] 4.3 Confirm records/archive behavior is unchanged
- [x] 4.4 Confirm QR/NFC redirect behavior is unchanged

## 5. Verification

- [x] 5.1 Run `npm run lint` and fix any issues
- [x] 5.2 Run `npm run typecheck` and fix any issues
- [x] 5.3 Run `npm run build` and verify no build errors
- [x] 5.4 Manual test: add reminder text to a compartment and confirm it appears only when expanded
- [x] 5.5 Manual test: add reminder text to a unit-assigned kit and confirm it appears only when expanded
- [x] 5.6 Manual test: confirm the same kit can have different reminder text on different units
- [x] 5.7 Manual test: clear reminder text and confirm no QR reminder UI appears
- [x] 5.8 Manual test: verify mobile layout
- [x] 5.9 Manual test: confirm expand/collapse remains smooth
- [x] 5.10 Manual test: confirm no effect on checkoff behavior
