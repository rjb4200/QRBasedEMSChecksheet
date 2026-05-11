## 1. Update Kits page query

- [ ] 1.1 Read current query in `src/app/admin/kits/page.tsx`
- [ ] 1.2 Add `units.deleted_at IS NULL` filter to kit-relationship join
- [ ] 1.3 Ensure kit attachment count reflects the filter

## 2. Verify attached unit lists

- [ ] 2.1 Check the assigned unit name display uses filtered results

## 3. Verify and test

- [ ] 3.1 Run typecheck and build
- [ ] 3.2 Verify active unit counts are correct
- [ ] 3.3 Verify archived units still exist in `unit_kits` table
- [ ] 3.4 Commit and push
