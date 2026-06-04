## 1. Client Component

- [ ] 1.1 Create a `KitAssignmentEditor` client component
- [ ] 1.2 Show read-only assigned units list by default with an "Edit Assignments" button
- [ ] 1.3 Render all active units with checkboxes in edit mode
- [ ] 1.4 Style assigned vs unassigned units differently
- [ ] 1.5 Track pending additions and removals in local state
- [ ] 1.6 Show pending changes summary when changes exist
- [ ] 1.7 Implement Cancel: discard changes and return to read-only
- [ ] 1.8 Implement Apply: confirm via dialog, batch add/remove via server actions, exit edit mode

## 2. Kits Page Integration

- [ ] 2.1 Import and render the `KitAssignmentEditor` in each kit card
- [ ] 2.2 Pass the kit's assigned unit data and full unit list
- [ ] 2.3 Preserve existing kit card layout and styling

## 3. Server Actions

- [ ] 3.1 Reuse `assignKitToUnit` and `removeKitFromUnit` from `admin/units/actions.ts`
- [ ] 3.2 Prevent duplicate assignments during apply

## 4. Validation

- [ ] 4.1 Run `npm run typecheck`
- [ ] 4.2 Run `npm run build`
- [ ] 4.3 Manual test: edit mode toggle, checkbox staging, pending summary
- [ ] 4.4 Manual test: apply with confirmation saves changes
- [ ] 4.5 Manual test: cancel discards changes
- [ ] 4.6 Manual test: error handling keeps edit mode open
