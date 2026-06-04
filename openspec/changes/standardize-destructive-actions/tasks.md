## 1. Shared Component

- [ ] 1.1 Create `src/components/delete-confirm-button.tsx` with two-stage confirm/cancel logic.
- [ ] 1.2 Accept `formAction`, `hiddenInputs`, and optional `disabled` props.

## 2. Kits Pages

- [ ] 2.1 Replace single-click delete on `kits/page.tsx` with `DeleteConfirmButton`.
- [ ] 2.2 Replace per-row `deleteKitGroup` buttons on `kits/[id]/page.tsx` with `DeleteConfirmButton`.
- [ ] 2.3 Replace per-row `deleteKitItem` buttons on `kits/[id]/page.tsx` with `DeleteConfirmButton`.

## 3. Unit Builder Page

- [ ] 3.1 Replace `deleteUnitCompartment` with `DeleteConfirmButton`.
- [ ] 3.2 Replace `deleteCompartmentGroup` with `DeleteConfirmButton`.
- [ ] 3.3 Replace `deleteUnitItem` with `DeleteConfirmButton`.
- [ ] 3.4 Replace `removeKitFromUnit` with `DeleteConfirmButton`.

## 4. Equipment Page

- [ ] 4.1 Add destructive mode toggle to the equipment catalog page.
- [ ] 4.2 Hide delete icons when toggle is off, matching units/users pattern.

## 5. Verification

- [ ] 5.1 Run TypeScript typecheck.
