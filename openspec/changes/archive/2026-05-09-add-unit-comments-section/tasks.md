## 1. Database Changes

- [ ] 1.1 Add comments column to daily_units table via Supabase migration
- [ ] 1.2 Verify migration applies correctly to database

## 2. Unit Detail Page Updates

- [ ] 2.1 Update unit detail page to add comments input field during checkoff
- [ ] 2.2 Add comments display section above "Past exceptions" section
- [ ] 2.3 Implement conditional rendering (show only when comments exist)
- [ ] 2.4 Add comment text field with 500 character limit

## 3. Records View Updates

- [ ] 3.1 Update supervisor records view to display comments when present
- [ ] 3.2 Implement conditional display for records page comments

## 4. Print Document Updates

- [ ] 4.1 Update checksheet print document to include comments section
- [ ] 4.2 Implement conditional rendering for print output
- [ ] 4.3 Test print output with and without comments

## 5. Validation and Testing

- [ ] 5.1 Run typecheck to verify no type errors
- [ ] 5.2 Run lint to verify no linting issues
- [ ] 5.3 Build the project to ensure everything compiles
- [ ] 5.4 Test the complete flow: add comments, view unit, view records, print