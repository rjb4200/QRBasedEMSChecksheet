## 1. Database Changes

- [ ] 1.1 Add position column to compartment_items table via Supabase migration
- [ ] 1.2 Populate position values for existing items based on current order
- [ ] 1.3 Update item fetch queries to order by position

## 2. UI Component

- [ ] 2.1 Add drag-and-drop reordering to equipment list component
- [ ] 2.2 Add up/down arrow buttons for each item
- [ ] 2.3 Style reorder controls to be visible only to admin users
- [ ] 2.4 Add visual feedback during drag operation

## 3. Backend API

- [ ] 3.1 Create API endpoint to update item positions
- [ ] 3.2 Implement batch position update logic
- [ ] 3.3 Add validation to ensure valid positions

## 4. Integration

- [ ] 4.1 Integrate reordering UI on units page compartment view
- [ ] 4.2 Ensure checkoff page displays items in new order
- [ ] 4.3 Ensure records view displays items in new order
- [ ] 4.4 Ensure printouts display items in new order

## 5. Validation and Testing

- [ ] 5.1 Run typecheck to verify no type errors
- [ ] 5.2 Run lint to verify no linting issues
- [ ] 5.3 Build the project to ensure everything compiles
- [ ] 5.4 Test drag-and-drop reordering
- [ ] 5.5 Test arrow button reordering
- [ ] 5.6 Test order persists after page refresh
- [ ] 5.7 Verify new order appears on checkoff, records, and printouts