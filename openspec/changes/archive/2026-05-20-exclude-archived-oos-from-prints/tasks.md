## 1. Print Query Update

- [x] 1.1 Update daily checksheet print query to exclude archived units (`deleted_at IS NOT NULL` / archived ledger rows)
- [x] 1.2 Update daily checksheet print query to exclude OOS units (`status = out_of_service`)

## 2. Testing

- [x] 2.1 Verify archived units do not appear in printout
- [x] 2.2 Verify OOS units do not appear in printout
- [x] 2.3 Verify active units still appear in printout

## 3. Validation

- [x] 3.1 Run typecheck to verify no type errors
- [x] 3.2 Run lint to verify no linting issues
- [x] 3.3 Build the project to ensure everything compiles
