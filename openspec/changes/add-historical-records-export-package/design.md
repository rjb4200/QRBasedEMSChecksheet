## Context

The app already has three export mechanisms for historical records: Simple CSV (unit-day rows), Detailed CSV (per-compartment/per-item rows), and a landscape print layout. These all live under `/admin/archives`. Separately, `src/lib/pdf/daily-checksheets.ts` generates WFD-branded PDFs via pdfkit — currently used only by the cron email report attachment.

No ZIP library exists in the project. The existing data pipeline (`archive-records.ts`, `checksheet-documents.ts`) is well-tested and handles date-range queries, unit filtering, and ledger-backed record reconstruction.

Phase 2 is a read-only export workflow — a prerequisite before any future data clearing (Phase 3). It must coexist with all existing exports.

## Goals / Non-Goals

**Goals:**

- Admin selects a historical date range and optionally a unit filter on the Records page
- System generates a ZIP archive containing: simple CSV, detailed CSV, one PDF per day (using the existing pdfkit renderer), and a `manifest.json` index
- ZIP is streamed as a download via a Route Handler
- Manifest records: date range, units, record counts, export timestamp, archive identifiers, and file listing
- All existing export links remain unchanged and functional

**Non-Goals:**

- No record deletion or clearing (reserved for Phase 3)
- No new PDF rendering approach — reuse `generateDailyChecksheetsPdf()` as-is
- No progress streaming or async job queue for this phase
- No changes to the existing Simple CSV, Detailed CSV, Print, or Exceptions export routes
- No database schema changes or migrations

## Decisions

### 1. PDF Generation: Reuse `generateDailyChecksheetsPdf()`

**Decision:** Call `generateDailyChecksheetsPdf(date)` once per day in the selected range. Each call returns `{ filename, content: Buffer }`.

**Rationale:** The pdfkit renderer is already deployed, WFD-branded with logos, uses the same data pipeline as the Records print page, and produces letter-landscape tables matching the print layout. This avoids introducing a new rendering dependency or duplicating layout logic.

**Alternatives considered:**
- **Generate PDF from print page HTML** — Requires puppeteer or `@react-pdf/renderer`, both heavy dependencies. The print page also needs a browser context for rendering, adding deployment complexity.
- **One giant PDF covering all days** — Would need pdfkit page management across days, complicates the existing single-day generator. One PDF per day is cleaner and mirrors the existing print behavior.

### 2. ZIP Library: `archiver`

**Decision:** Use `archiver` for ZIP generation.

**Rationale:** `archiver` supports streaming — buffers can be piped directly into the ZIP and streamed to the response without holding the entire archive in memory. This matters for larger date ranges (30+ days with many units). `archiver` is Node-only, which is fine for a Route Handler.

**Alternatives considered:**
- **`jszip`** — Simpler API, but in-memory only. Could cause OOM with large exports on Vercel's limited memory. Acceptable for typical 14-day use but less future-proof.
- **`adm-zip`** — Lighter but also in-memory. Less mature streaming support.

### 3. Route: New Route Handler

**Decision:** New Route Handler at `src/app/admin/archives/export-package/route.ts` accepting query params `from`, `to`, and optional `unitId`.

**Rationale:** Follows the existing pattern (`/admin/archives/export/route.ts`, `/admin/exceptions/export/route.ts`). A Route Handler can stream the ZIP response directly. The export is a GET request (download, not mutation).

**Alternatives considered:**
- **API route under `/api/`** — Inconsistent with existing export routes which live under `/admin/archives/`.
- **Server Action** — Server Actions return serializable objects, not streams. Not suitable for file downloads.

### 4. Manifest Format: JSON

**Decision:** JSON file named `manifest.json` at the root of the ZIP archive.

**Rationale:** JSON is machine-readable, human-readable, and requires no parser on the receiving end. The manifest is metadata, not a user-facing document. Structure follows the acceptance criteria (date range, units, record count, timestamp, identifiers).

**Structure:**
```json
{
  "exportId": "<uuid>",
  "generatedAt": "<ISO 8601>",
  "dateRange": { "from": "YYYY-MM-DD", "to": "YYYY-MM-DD" },
  "dateCount": 15,
  "units": [
    { "id": "<uuid>", "name": "Medic 1", "records": 15, "archiveIds": ["<uuid>", ...] }
  ],
  "totalRecords": 75,
  "totalExceptions": 12,
  "contents": {
    "csv": ["records-simple.csv", "records-detailed.csv"],
    "pdfs": ["checksheet-2026-05-01.pdf", "checksheet-2026-05-02.pdf", ...],
    "manifest": "manifest.json"
  }
}
```

### 5. UI: Inline date range on the Records page

**Decision:** Add a second form row (or toggle) with `from`/`to` date inputs and an "Export Package" submit button on `/admin/archives`. The existing single-date filter form remains for day-by-day browsing. Existing CSV buttons remain unchanged.

**Rationale:** Keeps everything on one page. The existing page already has a filter form — extending it with a date range for the package export is a natural fit. A modal would add unnecessary complexity for two date inputs.

### 6. No unit filter for PDFs — PDF is always per-day, all units

**Decision:** The PDFs in the package always include all units for a given day (matching the behavior of `generateDailyChecksheetsPdf()`). If the admin selects a specific `unitId`, it filters the CSVs but does NOT affect PDF content. The manifest records which units are relevant.

**Rationale:** The pdfkit renderer doesn't currently support per-unit filtering. Adding that would require modifying `generateDailyChecksheetsPdf()`, which is outside scope for "reuse existing renderer." The CSVs provide per-unit filtered data instead.

**Alternative:** Could filter at the PDF level by modifying the generator — deferred to a follow-up if requested.

## Risks / Trade-offs

- **[Vercel timeout on large ranges]** — Generating PDFs for 90+ days could exceed Vercel's function timeout (10s hobby, 60s pro). **Mitigation:** The UI should suggest 30-day range increments; document the limit. For Phase 3 (clear workflow), consider batching.
- **[pdfkit font resolution]** — `verifyFontAccess()` in the existing pdf generator already handles Vercel vendor-chunks path resolution. No changes needed, but worth testing on deploy.
- **[Memory pressure]** — `archiver` streams to response, but pdfkit buffers each PDF in memory first. **Mitigation:** Each PDF is generated and appended to the archive one at a time, not all at once.
- **[No progress feedback]** — User clicks and waits with a spinner until the download starts. **Mitigation:** Acceptable for MVP. The typical 14-day export finishes quickly. Can add progress polling in a follow-up.

## Open Questions

- Should the package include the Exceptions CSV for the range as well? (Proposal mentions CSVs generically; the existing exceptions export is on a separate page.) — Leaning yes, for completeness.
- Should the ZIP filename follow a convention like `checkoff-export-{from}-to-{to}.zip`? — Yes.
