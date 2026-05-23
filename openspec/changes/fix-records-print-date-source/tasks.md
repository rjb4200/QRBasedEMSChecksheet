## 1. Records Print Action

- [x] 1.1 Update the Records page print action to submit current form values to `/admin/archives/print` using GET
- [x] 1.2 Ensure the print submission includes the current `date` value
- [x] 1.3 Ensure the print submission includes the current `unitId` value when selected
- [x] 1.4 Keep the existing Filter action behavior unchanged

## 2. Print Route Validation

- [x] 2.1 Verify `/admin/archives/print` continues to honor the `date` query parameter
- [x] 2.2 Verify `/admin/archives/print` continues to honor the `unitId` query parameter
- [x] 2.3 Verify the print route still defaults to today only when no valid date is provided

## 3. Verification

- [ ] 3.1 Manual test: change the Records page date and click Print without clicking Filter first
- [ ] 3.2 Manual test: select both date and unit, then click Print without clicking Filter first
- [ ] 3.3 Manual test: click Filter first, then Print, and confirm the same date/unit are used
- [ ] 3.4 Manual test: open `/admin/archives/print` without `date` and confirm safe default behavior
- [x] 3.5 Run `npm run lint`
- [x] 3.6 Run `npm run typecheck`
- [x] 3.7 Run `npm run build`
