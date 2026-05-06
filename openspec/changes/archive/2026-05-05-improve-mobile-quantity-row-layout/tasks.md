## 1. Quantity Row Layout

- [x] 1.1 Update quantity item rendering in `checkoff-form.tsx` to stack item text and controls on mobile
- [x] 1.2 Add `min-w-0` and wrapping classes to item text/name so long names do not overflow
- [x] 1.3 Preserve existing minus/current-count/plus controls, disabled behavior, and value updates
- [x] 1.4 Keep larger viewport layout readable without forcing mobile-only spacing on desktop

## 2. Non-Quantity Safety

- [x] 2.1 Verify checkbox item rows remain readable and tappable
- [x] 2.2 Verify condition item rows remain readable and tappable
- [x] 2.3 Verify grouped and ungrouped item sections both use the improved quantity layout

## 3. Validation

- [x] 3.1 Verify long quantity names wrap cleanly at narrow mobile width
- [x] 3.2 Verify no horizontal scrolling or overlap in quantity rows
- [x] 3.3 Verify checkoff save/submit payload behavior is unchanged
- [x] 3.4 Run `npm run lint`
- [x] 3.5 Run `npm run typecheck`
