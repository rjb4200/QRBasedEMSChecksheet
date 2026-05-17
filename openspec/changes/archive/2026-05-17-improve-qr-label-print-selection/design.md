## Context

The unit QR page currently renders QR codes for compartments and assigned kits and supports a default grid plus a 3x2 rotated label format. The existing workflow is print-oriented but not selection-oriented: admins can print all labels or a single label, and the printed 3x2 label content includes the visible short URL. QR target creation and reuse already happen server-side when the QR page loads, and this change must preserve that one-target-per-checkoff-location model.

## Goals / Non-Goals

**Goals:**

- Provide one selectable label print workflow for standard and 3x2 QR labels.
- Default all labels to visible and selected.
- Allow admins to select/deselect individual labels and select/deselect all labels.
- Allow a selected label to print a second physical copy using the same QR URL and QR image.
- Remove visible `/q/{code}` text from printed labels while keeping the QR encoded URL unchanged.
- Keep 3x2 label pagination deterministic at 10 rendered physical labels per page.

**Non-Goals:**

- Creating new QR targets or database records for duplicate physical labels.
- Changing `/q/{code}` resolution, QR target storage, or scanner behavior.
- Adding a label designer or arbitrary label dimensions.
- Replacing NFC/copy URL administrative support.

## Decisions

### Keep Selection State Client-Side

The selection and second-copy state will live in the QR label client component because it is transient print preparation state. No database persistence is needed, and refreshing the page can safely restore all labels to selected with second copies off.

Alternative considered: Persist label print preferences per unit. This adds schema and stale-preference complexity without being required by the workflow.

### Build a Physical Print List Before Rendering

Printing will derive a physical label list from the current UI state: zero copies for deselected labels, one copy for selected labels, and two copies for selected labels with second copy enabled. Pagination will operate on this physical list rather than the original QR target list, so duplicate copies count toward the 10-label page limit.

Alternative considered: Render duplicates inside the original label map. This makes pagination harder to reason about and risks second copies not counting as physical labels.

### Reuse Existing QR Code Data

The duplicate copy uses the same `dataUrl`, URL, code, and target metadata as the first copy. The implementation must not call QR target creation for duplicate copies.

Alternative considered: Generate a new QR code image for each duplicate copy. This is unnecessary because the image is identical and could create confusion about target identity.

### Separate Admin Display From Printed Label Content

The admin page can still show code/URL information for copying and NFC programming where useful, but printed 3x2 label content will omit visible `/q/{code}` text. Label space should prioritize unit name, target name, and QR code scannability.

Alternative considered: Remove visible URL text everywhere. This conflicts with existing admin/NFC workflow requirements that make the copyable URL useful outside print output.

## Risks / Trade-offs

- Browser print engines can handle page breaks inconsistently -> paginate the rendered physical list into explicit 10-label sheet containers and verify print CSS at 100% scale.
- Long target names may still crowd labels -> remove the visible short URL and allow target names to wrap within the label text area.
- Users may enable second copy while a label is deselected -> selection remains authoritative, so deselected labels print zero copies regardless of second-copy state.
- No labels selected could open a blank print dialog -> block printing and show a clear no-labels-selected message.
