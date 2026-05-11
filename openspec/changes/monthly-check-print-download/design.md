## Context

The monthly check PDF is hosted at `winchesterfireems.com` which is a different origin than `dailycheck.winchesterfireems.com`. Cross-origin restrictions prevent `window.print()` on the PDF. The solution is a same-origin API route that proxies the PDF.

## Goals / Non-Goals

**Goals:**
- Print button opens PDF in new window and triggers print dialog
- Download link lets crews manually save the PDF
- Same-origin proxy so print works on all desktop browsers

**Non-Goals:**
- Changing the PDF URL (still hardcoded)
- Per-unit PDF configuration

## Decisions

1. **API route proxy** over hosting the PDF in `/public/`
   - Rationale: PDF changes can be made on the main site without redeploying the app

2. **Client component for the banner** over separate print button component
   - Rationale: The `window.print()` call requires client-side JS. Converting the banner to `"use client"` is the minimal change.

3. **Both Print and Download** — Print opens a window and auto-triggers print; Download just links to the PDF
   - Rationale: Desktop crews want print; some may also want to save a copy

## API Route Design

```ts
// src/app/api/monthly-check-form/route.ts
const PDF_URL = "https://winchesterfireems.com/images/Monthly%20Ambulance%20Inventory.pdf";

export async function GET() {
  const res = await fetch(PDF_URL);
  return new Response(res.body, {
    headers: { "Content-Type": "application/pdf" },
  });
}
```

## Print Flow

```
User clicks Print
  → window.open("/api/monthly-check-form")
  → loads PDF (same-origin, no CORS)
  → window.onload → window.print()
  → browser print dialog opens
  → user prints or cancels
```

## Risks / Trade-offs

- **[Risk] API route fetches PDF on every request** → Mitigation: Add `Cache-Control` headers or use Next.js ISR caching
