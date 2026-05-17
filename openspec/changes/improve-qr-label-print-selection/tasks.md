## 1. Selection State And Controls

- [x] 1.1 Update the QR label client component to initialize every label as selected and every second-copy option as off.
- [x] 1.2 Add per-label Print label and Print second copy controls for the 3x2 label workflow.
- [x] 1.3 Add Select All and Deselect All controls that update all label selection states.
- [x] 1.4 Add a Print Selected action that uses the current label selection state instead of printing all labels.
- [x] 1.5 Show a clear "No labels selected." message and skip opening print when the selected physical label list is empty.

## 2. Print List And Duplicate Copies

- [x] 2.1 Build a physical print list from selected labels, adding one item for selected labels and a second identical item when Print second copy is enabled.
- [x] 2.2 Ensure duplicate physical labels reuse the same QR data URL, encoded URL, short code, and QR target metadata.
- [x] 2.3 Ensure deselected labels produce zero physical labels even when Print second copy is enabled.
- [x] 2.4 Remove the separate single-label print workflow from the QR label page.

## 3. Label Rendering And Pagination

- [x] 3.1 Render print output from the physical print list instead of the original QR target list.
- [x] 3.2 Keep 3x2 pagination at 10 rendered physical labels per sheet with 2 columns and 5 rows.
- [x] 3.3 Remove visible `/q/{code}` text from printed 3x2 labels while keeping the QR code URL unchanged.
- [x] 3.4 Keep label text readable by showing the unit name and compartment/kit name with clean wrapping.

## 4. Verification

- [x] 4.1 Verify selected labels print and deselected labels do not print.
- [x] 4.2 Verify second-copy labels print twice and both copies scan to the same checkoff target.
- [x] 4.3 Verify no new QR targets or database records are created for second copies.
- [x] 4.4 Verify a 10-physical-label case fits on one 3x2 sheet and an 11-physical-label case starts a second sheet.
- [x] 4.5 Run lint, typecheck, and available build/test verification.
