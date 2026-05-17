## 1. Rotated Label Layout

- [x] 1.1 Add `format` query parameter handling to the admin QR page (or a new route if preferred).
- [x] 1.2 Create a `RotatedLabelGrid` component with 5-row × 2-column CSS grid layout.
- [x] 1.3 Implement the rotated content container with `transform: rotate(90deg)` and correct dimensions.
- [x] 1.4 Render unit name, target name, short URL, and QR code in each label.
- [x] 1.5 Add print settings guidance on the page (scale 100%, headers off).

## 2. Preserve Existing Behavior

- [x] 2.1 Ensure the existing QR print layout renders when no format parameter is set.
- [x] 2.2 Add a format switcher or link between the two layouts.

## 3. Verification

- [x] 3.1 Run `npm run typecheck` and `npm run lint`.
- [x] 3.2 Verify the rotated label grid renders 10 labels per page.
- [x] 3.3 Verify labels contain unit name, target name, short URL, and QR code.
- [x] 3.4 Verify the existing QR print layout is unchanged.
