## 1. Setup

- [x] 1.1 Add `archiver` dependency to package.json
- [x] 1.2 Add `@types/archiver` devDependency for TypeScript support

## 2. Export Package Library

- [x] 2.1 Create `src/lib/export-package.ts` with `generateExportPackage()` function that accepts from/to dates and optional unitId
- [x] 2.2 Build manifest JSON within the export function (exportId UUID, generatedAt timestamp, dateRange, units array with record counts and archive IDs, totalRecords, totalExceptions, contents listing)
- [x] 2.3 Assemble simple CSV (via `getDailyUnitRecords` + `archiveRecordToCsv`) and add to archive as `records-simple.csv`
- [x] 2.4 Assemble detailed CSV (via `getDailyChecksheetDocument` + `detailedChecksheetsCsv`) and add to archive as `records-detailed.csv`
- [x] 2.5 Assemble exceptions CSV (via `getDiscrepancies` + existing export logic) and add to archive as `exceptions-{from}-to-{to}.csv`
- [x] 2.6 Generate one PDF per day via `generateDailyChecksheetsPdf(date)` and add each to archive as `checksheet-{date}.pdf`
- [x] 2.7 Add `manifest.json` to archive as the final entry
- [x] 2.8 Finalize the archiver stream and return the readable stream for the response

## 3. Route Handler

- [x] 3.1 Create `src/app/admin/archives/export-package/route.ts` with a GET handler
- [x] 3.2 Parse `from`, `to`, and optional `unitId` from query params with validation
- [x] 3.3 Call `generateExportPackage()` and pipe the archiver stream to the response
- [x] 3.4 Set Content-Type to `application/zip` and Content-Disposition with filename `checkoff-export-{from}-to-{to}.zip`

## 4. UI Integration

- [x] 4.1 Add "Export Package" button and from/to date inputs to `src/app/admin/archives/page.tsx` alongside existing CSV buttons
- [x] 4.2 Wire the button to submit GET request to `/admin/archives/export-package` with from, to, and unitId params
- [x] 4.3 Ensure existing Simple CSV, Detailed CSV, and Print buttons continue to function unchanged

## 5. Testing

- [x] 5.1 Add unit test for `generateExportPackage()` verifying ZIP structure (contains manifest.json, CSVs, PDFs for a single-day range)
- [x] 5.2 Add unit test verifying manifest contents (correct date range, unit listing, record counts)
- [x] 5.3 Add unit test verifying read-only behavior (no database mutations during export)
- [x] 5.4 Add unit test for the Route Handler verifying correct Content-Type and Content-Disposition headers
