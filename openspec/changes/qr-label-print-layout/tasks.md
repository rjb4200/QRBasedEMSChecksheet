## 1. Add print-specific CSS overrides

- [x] 1.1 Add `@page { size: letter; margin: 0.25in; }` CSS to page.tsx
- [x] 1.2 Update `QrCodeGrid` grid to `print:grid-cols-2` and remove gap
- [x] 1.3 Size each label card to `print:w-[288px] print:h-[288px]` via custom CSS or inline style

## 2. Increase QR code size

- [x] 2.1 Change QR image from `print:h-40 print:w-40` (1.67") to `print:h-[216px] print:w-[216px]` (~2.25")
- [x] 2.2 Reduce surrounding padding to fit content within 3" height

## 3. Remove redundant text from print

- [x] 3.1 Add `print:hidden` to the "Code:" text element
- [x] 3.2 Add `print:hidden` to the full URL line
- [x] 3.3 Reduce unit name font to `print:text-xs` (12px)
- [x] 3.4 Reduce compartment name font to `print:text-xs` (12px)

## 4. Verify and test

- [x] 4.1 Run typecheck and build to ensure no errors
- [ ] 4.2 Test Print / Save as PDF in Chrome — verify 2-column layout
- [ ] 4.3 Measure label cell size in the generated PDF
- [ ] 4.4 Verify individual "Print This QR" output is unchanged
- [ ] 4.5 Commit and push
