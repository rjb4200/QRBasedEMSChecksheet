## 1. Database Migration

- [x] 1.1 Create migration `add_clear_operational_records_function.sql` with `clear_operational_records(from_date, to_date, unit_id)` stored procedure that counts and deletes rows from all 8 operational tables in a transaction
- [x] 1.2 Create migration `add_preview_operational_counts_function.sql` with `preview_operational_counts(from_date, to_date, unit_id)` stored procedure that returns per-table row counts without deleting

## 2. Data Rotation Library

- [x] 2.1 Create `src/lib/data-rotation.ts` with `previewRotationCounts(from, to, unitId?)` function that calls the preview stored procedure and returns per-table counts
- [x] 2.2 Add `clearOperationalRecords(from, to, unitId?)` function that calls the clear stored procedure and returns deletion counts
- [x] 2.3 Add guardrail validation: reject ranges > 60 days, reject ranges that include today's shift date
- [x] 2.4 Add `rotateRecords(from, to, unitId?)` orchestrator function that runs export (Phase 2), validates ZIP, clears records, and logs to system_logs

## 3. Client Component: SlideToConfirm

- [x] 3.1 Create `src/components/slide-to-confirm.tsx` client component with styled range input that snaps back when released before 100%
- [x] 3.2 Component calls `onConfirm` callback only when slider reaches 100% and is released
- [x] 3.3 Add disabled/loading state support for when the clear operation is in progress

## 4. Route Handler: Clear Records

- [x] 4.1 Create `src/app/admin/archives/clear-records/route.ts` with POST handler accepting `{ from, to, unitId? }` body
- [x] 4.2 Validate input: require admin auth, validate date range ≤ 60 days, exclude today
- [x] 4.3 Call `rotateRecords()` orchestrator and return result with counts and audit log confirmation

## 5. UI Integration: Records Page

- [x] 5.1 Add "Clear Records" section to `src/app/admin/archives/page.tsx` with from/to date inputs and "Preview" button
- [x] 5.2 Add row count preview panel that displays per-table counts after preview is triggered
- [x] 5.3 Add "Export and Clear" button that triggers Phase 2 export, then presents SlideToConfirm
- [x] 5.4 Wire SlideToConfirm to call the clear-records route on confirm
- [x] 5.5 Add success/error feedback states (toast or inline message)
- [x] 5.6 Ensure existing export buttons (Simple CSV, Detailed CSV, Export Package, Print) remain functional

## 6. Testing

- [x] 6.1 Add unit test for `previewRotationCounts()` verifying correct per-table counts for a given range
- [x] 6.2 Add unit test for `clearOperationalRecords()` verifying all 8 tables are cleared and counts are returned
- [x] 6.3 Add unit test verifying 60-day guardrail rejects ranges > 60 days
- [x] 6.4 Add unit test verifying today's-shift guardrail rejects ranges including today's shift date
- [x] 6.5 Add unit test for `rotateRecords()` verifying ZIP export succeeds before clear, and audit log is written
- [x] 6.6 Add unit test for `rotateRecords()` verifying clear is blocked when export fails
- [x] 6.7 Add unit test for clear-records route verifying admin auth requirement and input validation
- [x] 6.8 Add component test for SlideToConfirm verifying slider snaps back when released early and enables on full slide
