## 1. Locate Archive Detail Rendering

- [x] 1.1 Identify the Records/archive detail page component that renders Started, Duration, Snapshot/Status Note, Checked By, and Submitted metadata.
- [x] 1.2 Confirm which timestamp field is archive creation time and should be labeled "Archived At".

## 2. Conditional Metadata Display

- [x] 2.1 Hide Started metadata when no meaningful start timestamp exists.
- [x] 2.2 Hide Duration metadata when no meaningful duration exists.
- [x] 2.3 Hide Snapshot/Status Note metadata when no meaningful status note exists.
- [x] 2.4 Hide Checked By metadata when no user/name/email value exists.
- [x] 2.5 Rename archive creation timestamp label from "Submitted" to "Archived At" on archive detail pages.

## 3. Preserve Required Operational Content

- [x] 3.1 Ensure Shift, Operational Date, Archived At, completion count, and completion percentage remain visible.
- [x] 3.2 Ensure Unit Comments render only when a nonblank saved comment exists.
- [x] 3.3 Ensure compartment/check data rendering remains unchanged.

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm run lint`.
- [x] 4.2 Verify an archive record with missing optional metadata does not show "Not recorded" or "No status note" placeholders.
- [x] 4.3 Verify an archive record with populated optional metadata still shows those values.
- [x] 4.4 Verify historical check data and completion totals remain unchanged.
