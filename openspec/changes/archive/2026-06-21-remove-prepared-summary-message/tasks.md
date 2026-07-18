## 1. Remove the component from the unit dashboard page

- [x] 1.1 Remove the `UnitSummaryCacheHint` import from `src/app/units/[id]/page.tsx` (line 12)
- [x] 1.2 Remove the `<UnitSummaryCacheHint ... />` JSX rendering from `src/app/units/[id]/page.tsx` (line 148)

## 2. Delete the component file

- [x] 2.1 Delete `src/components/unit-summary-cache-hint.tsx`

## 3. Verification

- [x] 3.1 Run `npm run build` to verify no compilation errors
- [x] 3.2 Confirm no remaining imports of `UnitSummaryCacheHint` exist in the codebase
