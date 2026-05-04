## 1. Database Changes

- [ ] 1.1 Add `archived_at` column to `units` table via Supabase migration
- [ ] 1.2 Add `oos_at` column to `units` table via Supabase migration
- [ ] 1.3 Verify migration applies correctly to database

## 2. Fleet Panel Updates

- [ ] 2.1 Update fleet query to exclude archived units (`archived_at IS NULL`)
- [ ] 2.2 Update fleet query to include OOS units with distinct styling
- [ ] 2.3 Add OOS status indicator to fleet unit cards

## 3. Print Document Updates

- [ ] 3.1 Update print query to exclude archived units
- [ ] 3.2 Verify archived units excluded from daily checksheet print

## 4. Records View Updates

- [ ] 4.1 Update record count queries to exclude archived units
- [ ] 4.2 Ensure historical records still show archived units for dates when they were active

## 5. Unit Detail Page Updates

- [ ] 5.1 Add grey styling for archived units (background, border)
- [ ] 5.2 Add "ARCHIVED" badge to archived unit pages
- [ ] 5.3 Add orange/yellow styling for OOS units
- [ ] 5.4 Add "OOS" badge to OOS unit pages
- [ ] 5.5 Add archive/unarchive button for admin
- [ ] 5.6 Add OOS/clear OOS button for admin

## 6. Unit Actions

- [ ] 6.1 Add archive action to set `archived_at` timestamp
- [ ] 6.2 Add unarchive action to clear `archived_at` timestamp
- [ ] 6.3 Add mark OOS action to set `oos_at` timestamp
- [ ] 6.4 Add clear OOS action to clear `oos_at` timestamp
- [ ] 6.5 Ensure compartment layout preserved on unarchive

## 7. Validation and Testing

- [ ] 7.1 Run typecheck to verify no type errors
- [ ] 7.2 Run lint to verify no linting issues
- [ ] 7.3 Build the project to ensure everything compiles
- [ ] 7.4 Test archive/unarchive flow
- [ ] 7.5 Test OOS/clear OOS flow
- [ ] 7.6 Verify archived units hidden from fleet and prints
- [ ] 7.7 Verify archived units appear in historical records