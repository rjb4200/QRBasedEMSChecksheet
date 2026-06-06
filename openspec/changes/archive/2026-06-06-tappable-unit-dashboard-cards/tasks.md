## 1. Implement conditional card links

- [x] 1.1 Add `href` derivation based on `target.type` (compartment vs kit) in the card map
- [x] 1.2 Conditionally wrap yellow and green cards in `<Link href={...} className="block">` in `src/app/units/[id]/page.tsx`
- [x] 1.3 Grey cards remain as plain `<article>` without a Link wrapper
- [x] 1.4 Add `onClick={(e) => e.stopPropagation()}` on the QR location `<summary>` for tappable cards

## 2. Verification

- [x] 2.1 Run `npm run build` to verify compilation
