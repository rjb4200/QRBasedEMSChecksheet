## Why

This is Phase 2 of the database capacity protection strategy (superseding #5). Before any future record-clearing can happen, admins need a reliable, self-contained way to download a complete archival snapshot of historical records. The existing per-format CSV exports and print view work today but require multiple downloads and don't bundle everything together. A single downloadable ZIP package with CSVs, printable PDFs, and a manifest gives admins a one-click archive they can store offline — a prerequisite for any future data rotation.

## What Changes

- Add a new "Export Package" option on the Records page that accepts a date range and generates a downloadable ZIP archive
- The ZIP includes: a simple CSV of unit-day records, a detailed CSV of per-compartment/per-item data, one printable PDF per day (using the existing pdfkit renderer), and a `manifest.json` index file
- The manifest records the date range, units included, record counts, export timestamp, archive identifiers, and file listing
- **No records are deleted or cleared** — this is a fully read-only export workflow
- All existing exports (Simple CSV, Detailed CSV, Print, Exceptions CSV) remain unchanged and available

## Capabilities

### New Capabilities

- `export-package`: Generates a downloadable ZIP archive containing CSV exports, printable PDF check sheets, and a structured manifest for a selected historical date range

### Modified Capabilities

- `archive-history`: Adds a new export package option to the Records page alongside existing CSV exports, including date range selection and ZIP download behavior

## Impact

- **New UI**: "Export Package" button and date range picker on `/admin/archives` page
- **New route**: `/admin/archives/export-package` Route Handler that generates and streams the ZIP
- **New library**: `src/lib/export-package.ts` assembling the ZIP contents (CSVs, PDFs, manifest)
- **New dependency**: `archiver` (or `jszip`) for ZIP generation — no zip library currently in the project
- **Reuses**: `src/lib/archive-records.ts` (data queries), `src/lib/checksheet-documents.ts` (detailed CSV), `src/lib/pdf/daily-checksheets.ts` (PDF generation via pdfkit)
- **No database changes**, no migration
