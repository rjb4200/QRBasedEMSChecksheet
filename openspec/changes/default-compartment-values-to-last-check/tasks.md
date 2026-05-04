## 1. Query Logic

- [ ] 1.1 Create function to query most recent completed check within 7 days
- [ ] 1.2 Use daily_unit_crews table with locked_at not null and date filter
- [ ] 1.3 Order by locked_at descending to get most recent

## 2. Default Value Population

- [ ] 2.1 Update checkoff page to fetch previous check values
- [ ] 2.2 Match compartment items by compartment_id
- [ ] 2.3 Populate item values (count, checked state) from previous check
- [ ] 2.4 Implement fallback to par values when no recent check exists

## 3. Integration

- [ ] 3.1 Integrate smart defaults into the unit checkoff flow
- [ ] 3.2 Ensure checkbox default behavior (checked) is preserved
- [ ] 3.3 Handle new units with no history gracefully

## 4. Validation and Testing

- [ ] 4.1 Run typecheck to verify no type errors
- [ ] 4.2 Run lint to verify no linting issues
- [ ] 4.3 Build the project to ensure everything compiles
- [ ] 4.4 Test with unit that has recent completed check (should use previous values)
- [ ] 4.5 Test with unit that has no recent check (should use par values)
- [ ] 4.6 Test with new unit (should use par values)