## 1. Format Selection

- [x] 1.1 Add a new R011 format selector option to the QR labels page
- [x] 1.2 Support a distinct query parameter for the R011 rotated 3x2 format
- [x] 1.3 Ensure existing Spartan and Avery selectors remain unchanged

## 2. R011 Geometry And Capacity

- [x] 2.1 Add an R011 labels-per-sheet cap of 10 physical labels
- [x] 2.2 Add a position helper using the provided R011 margins and pitch values
- [x] 2.3 Ensure duplicate copies count toward the 10-label cap for R011

## 3. Print Rendering

- [x] 3.1 Reuse or extend the rotated 3x2 print grid to support R011
- [x] 3.2 Render R011 labels in a 2-column by 5-row layout
- [x] 3.3 Keep QR code content rotated and omit visible code text / full URL text
- [x] 3.4 Show an R011-specific selection limit message in the UI

## 4. Validation

- [ ] 4.1 Manual test: R011 selector loads the correct template
- [ ] 4.2 Manual test: R011 enforces the 10-label physical selection cap
- [ ] 4.3 Manual test: R011 print positions align with the provided sheet geometry
- [ ] 4.4 Verify Spartan S004 and Avery 94237 still work unchanged
- [x] 4.5 Run `npm run lint`
- [x] 4.6 Run `npm run typecheck`
- [x] 4.7 Run `npm run build`
