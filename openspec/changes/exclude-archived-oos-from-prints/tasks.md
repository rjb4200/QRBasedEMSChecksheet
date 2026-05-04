## 1. Print Query Update

- [ ] 1.1 Update daily checksheet print query to exclude archived units (archived_at IS NOT NULL)
- [ ] 1.2 Update daily checksheet print query to exclude OOS units (oos_at IS NOT NULL)

## 2. Testing

- [ ] 2.1 Verify archived units do not appear in printout
- [ ] 2.2 Verify OOS units do not appear in printout
- [ ] 2.3 Verify active units still appear in printout

## 3. Validation

- [ ] 3.1 Run typecheck to verify no type errors
- [ ] 3.2 Run lint to verify no linting issues
- [ ] 3.3 Build the project to ensure everything compiles