## 1. Server Action

- [x] 1.1 Add a pre-delete usage check query covering `unit_compartment_items`, `kit_items`, and `template_compartment_items`
- [x] 1.2 Fetch friendly usage location names (unit/compartment, kit, template) in the pre-check
- [x] 1.3 Convert `deleteEquipment` to return structured `{ ok, message }` instead of throwing errors
- [x] 1.4 Remove the blind `unit_compartment_items` and `template_compartment_items` deletion calls (no cascade)

## 2. Edit Mode Delete

- [x] 2.1 Replace the non-functional edit-mode delete button with a working async handler matching the normal-mode pattern
- [x] 2.2 Remove the fake confirm-then-exit-edit `onClick` handler

## 3. UI Error Handling

- [x] 3.1 Add client-side result state handling in `EditableCatalogRow` to capture the server action response
- [x] 3.2 Display a blocking message inline when `ok === false`, listing usage locations
- [x] 3.3 Handle the success case (`ok === true`) — the row can be removed or the page revalidated

## 4. Verification

- [x] 4.1 Run the production build
- [ ] 4.2 Verify deleting an unused equipment item succeeds
- [ ] 4.3 Verify deleting a kit-referenced item shows the blocking message with kit names
- [ ] 4.4 Verify normal-mode and edit-mode delete behavior is identical
