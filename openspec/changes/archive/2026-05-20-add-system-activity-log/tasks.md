## 1. Database

- [x] 1.1 Create migration for `system_logs` table with columns: id, created_at, actor_type, actor_id, actor_name, action, area, target_type, target_id, target_name, result, message, before_data, after_data, metadata
- [x] 1.2 Add index on `(created_at desc)`
- [x] 1.3 Add index on `(area, created_at desc)`
- [x] 1.4 Add index on `(target_type, target_id, created_at desc)`
- [x] 1.5 Add RLS policies: admin select, admin insert
- [x] 1.6 Add database cleanup function that deletes `system_logs` rows older than 3 months
- [x] 1.7 Schedule cleanup to run automatically

## 2. Logging Helper

- [x] 2.1 Create `src/lib/system-log.ts` with `logSystemEvent()` function
- [x] 2.2 Use `createAdminClient()` for inserts
- [x] 2.3 Catch and silently handle insert errors
- [x] 2.4 Export typed param interface

## 3. Admin Unit Actions Instrumentation

- [x] 3.1 Log unit status changes in admin unit edit actions
- [x] 3.2 Log unit create/archive actions
- [x] 3.3 Log compartment/item CRUD actions
- [x] 3.4 Log kit create/edit/archive/assign actions

## 4. Crew and Restock Instrumentation

- [x] 4.1 Log crew signature lock/unlock events in `saveUnitCrew` / `unlockUnitCrew`
- [x] 4.2 Log manual restock item add/remove/addressed events
- [x] 4.3 Log restock addressed/unaddressed toggle events

## 5. Cron and System Instrumentation

- [x] 5.1 Log daily email report sent event in cron route
- [x] 5.2 Log daily email report failed event with error message
- [x] 5.3 Log manual force-send cron trigger
- [x] 5.4 Log PDF generation failures

## 6. Admin System Log Page

- [x] 6.1 Create `src/app/admin/system-log/page.tsx` as server component
- [x] 6.2 Fetch log rows with pagination, ordered by created_at desc
- [x] 6.3 Add filter controls: date range, area dropdown, result (success/failure/warning), free-text search
- [x] 6.4 Render log rows with actor, action, area, target, result, timestamp
- [x] 6.5 Implement expandable row details showing message, before_data, after_data, metadata
- [x] 6.6 Style failed rows with red indicators for easy scanning
- [x] 6.7 Add "System Log" link to admin layout navigation

## 7. Verification

- [x] 7.1 Run `npm run lint` and fix any issues
- [x] 7.2 Run `npm run typecheck` and fix any issues
- [x] 7.3 Run `npm run build` and verify no build errors
- [x] 7.4 Manual test: change unit status, confirm log row appears
- [x] 7.5 Manual test: lock crew signatures, confirm log row appears
- [x] 7.6 Manual test: trigger daily report with force=true, confirm success/failure row appears
- [x] 7.7 Manual test: visit /admin/system-log, verify filters work
- [x] 7.8 Manual test: expand a log row to see details
- [x] 7.9 Manual test: crew user cannot access /admin/system-log
- [x] 7.10 Manual test: insert an old test log row, run cleanup, confirm logs older than 3 months are deleted and newer logs remain
