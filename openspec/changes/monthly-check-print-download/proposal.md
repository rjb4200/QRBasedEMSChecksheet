## Why

The monthly check banner has a link to the PDF, but crews need to print it — not just open it in a browser tab. Adding a Print button that triggers the browser print dialog directly saves steps. The existing Download link is also kept.

## What Changes

- Add an API route `/api/monthly-check-form` that proxies the PDF from the external server, solving the cross-origin issue that blocks `window.print()`
- Add a Print button to the monthly check banner that opens the proxied PDF and triggers the print dialog
- Add a Download link to the same proxied PDF for manual saving
- Convert the banner to a client component to handle the `window.print()` call

## Capabilities

### New Capabilities

- `monthly-check-print`: Print and download actions for the monthly check form

### Modified Capabilities

- None

## Impact

- New file: `src/app/api/monthly-check-form/route.ts` — proxy API route
- `src/components/monthly-check-banner.tsx` — Add Print button and Download link
