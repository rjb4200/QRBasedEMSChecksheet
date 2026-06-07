## 1. Shared Components

- [x] 1.1 Extract duplicated SVG spinner into `src/components/spinner.tsx`
- [x] 1.2 Update `SaveStatusMessage` to use `rounded-2xl px-4 py-3 text-sm font-bold` for visual consistency with admin banners
- [x] 1.3 Replace inline spinner definitions in `SubmitButton`, `EditableCatalogRow`, and `QrSaveButton` with the shared `Spinner` component

## 2. Admin Page Integration

- [x] 2.1 Wire `useSaveFeedback` into `src/app/admin/users/page.tsx` for add/save/delete/test actions
- [x] 2.2 Wire `useSaveFeedback` into `src/app/admin/issues/page.tsx` for issue creation
- [x] 2.3 Wire `useSaveFeedback` into `src/app/admin/issues/[id]/page.tsx` for status, tag, and detail edits

## 3. Structured Server Action Results

- [x] 3.1 Convert `saveEquipment` in `src/app/admin/equipment/actions.ts` to return structured results for name-conflict updates
- [x] 3.2 Verify `deleteEquipment` and equipment edit-mode delete already use consistent return-value + inline error display

## 4. Verification

- [x] 4.1 Run the production build
- [ ] 4.2 Verify spinner renders consistently across all admin action buttons
- [ ] 4.3 Verify success/error messages appear inline on Users, Issues, and Equipment pages
- [ ] 4.4 Verify disabled button styling is consistent across admin pages
