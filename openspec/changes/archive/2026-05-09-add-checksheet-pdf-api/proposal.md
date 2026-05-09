## Why

The current system requires manual navigation to the admin checksheets print page to generate and print daily checksheets. Users want to automate this process using n8n workflows that can programmatically fetch the completed checksheet as a PDF and send it to an office printer or email it to the office. This eliminates the need for manual printing and ensures completed checksheets are reliably delivered to the office.

## What Changes

- Add new API endpoint `/api/checksheets/print/[date]` that returns a generated PDF on request
- Add new API endpoint `/api/checksheets/print/latest` that returns today's completed checksheet
- Accept query parameters to filter which units to include (unit IDs, fleet, active only)
- PDF is generated on-demand, not stored, using existing checksheet document logic
- PDF response includes proper Content-Disposition headers for download/display
- Supabase Edge Function or Next.js API route implementation depending on PDF generation approach

## Capabilities

### New Capabilities

- `checksheet-pdf-api`: On-demand API endpoint that generates and returns daily checksheet as PDF for n8n workflow integration.

### Modified Capabilities

- None. This adds a new capability without modifying existing functionality.

## Impact

- New API endpoints in Next.js app
- Existing `src/lib/checksheet-documents.ts` logic reused for PDF generation
- n8n can consume the API to automate printing workflows
- No changes to existing print page functionality
- No new database changes required