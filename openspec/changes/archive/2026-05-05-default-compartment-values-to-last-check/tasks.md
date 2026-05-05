## 1. Query Logic

- [x] 1.1 Create function to query most recent completed check within 7 days
- [x] 1.2 Use daily_unit_crews table with locked true and date filter
- [x] 1.3 Order by updated_at descending to get most recent

## 2. Default Value Population

- [x] 2.1 Update checkoff page to fetch previous check values
- [x] 2.2 Match compartment items by compartment_id
- [x] 2.3 Populate item values (count, checked state) from previous check
- [x] 2.4 Implement fallback to par values when no recent check exists

## 3. Integration

- [x] 3.1 Integrate smart defaults into the unit checkoff flow
- [x] 3.2 Ensure checkbox default behavior (checked) is preserved
- [x] 3.3 Handle new units with no history gracefully

## 4. Validation and Testing

- [x] 4.1 Run typecheck to verify no type errors
- [x] 4.2 Run lint to verify no linting issues
- [x] 4.3 Build the project to ensure everything compiles
- [x] 4.4 Test with unit that has recent completed check (should use previous values)
- [x] 4.5 Test with unit that has no recent check (should use par values)
- [x] 4.6 Test with new unit (should use par values)
