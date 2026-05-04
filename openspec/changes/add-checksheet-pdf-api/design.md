## Context

The existing print functionality in `src/app/admin/checksheets/print/page.tsx` generates checksheet PDFs using browser print. The `src/lib/checksheet-documents.ts` contains the logic for building checksheet data with unit creation date filtering. Users want to trigger this same functionality programmatically via API for n8n workflow automation.

## Goals / Non-Goals

**Goals:**
- Create API endpoint that generates PDF from completed checksheet data
- Support date parameter to get historical checksheets
- Support optional filtering by unit IDs
- Enable n8n integration for automated printing workflows

**Non-Goals:**
- Authentication for the API (keep public like existing print functionality)
- PDF storage or file management
- Email delivery (handled by n8n)
- Changing existing print page behavior

## Decisions

### 1. Implementation Approach

**Decision:** Use Next.js API route (`/api/checksheets/print`) instead of Supabase Edge Function.

**Rationale:**
- Existing PDF generation logic uses browser print CSS which needs React context
- Next.js API route can import existing components or use headless browser library
- Simpler to maintain within existing codebase structure
- Can leverage existing `checksheet-documents.ts` utility functions

**Alternative Considered:** Supabase Edge Function with Puppeteer
- Edge Functions have limited JavaScript runtime and PDF generation is complex
- Would require significant additional code compared to Next.js approach

### 2. PDF Generation Library

**Decision:** Use `puppeteer` or `@react-pdf/renderer` for server-side PDF generation.

**Rationale:**
- `@react-pdf/renderer` allows defining PDF as React components, matching existing UI patterns
- Can reuse portions of existing print page styling
- Works in Node.js environment without browser

**Alternative Considered:** `playwright`
- More heavyweight, requires browser installation
- Better for complex interactive pages but overkill here

### 3. API Response Format

**Decision:** Return PDF directly with `Content-Type: application/pdf` and `Content-Disposition: inline`.

**Rationale:**
- n8n can consume binary response directly
- Inline display allows preview in browser if needed
- Simpler than returning base64 or JSON with PDF URL

### 4. Endpoint Design

**Decision:**
- `GET /api/checksheets/print` - returns today's checksheet (default)
- `GET /api/checksheets/print?date=2026-05-04` - returns specific date
- `GET /api/checksheets/print?unitIds=1,2,3` - filter to specific units

**Rationale:**
- Query parameters allow flexible filtering without creating many endpoints
- Date format ISO 8601 for clarity
- Unit IDs as comma-separated list for simple parsing

## Risks / Trade-offs

- **Performance:** PDF generation server-side can be slow. Mitigated by timeout limits and n8n retry logic.
- **Styling Consistency:** Server-rendered PDF may differ slightly from browser print. Mitigated by using same styling approach.
- **No Authentication:** API is public like existing print page. Mitigated by low impact - just generates checksheet data.

## Migration Plan

1. Install `@react-pdf/renderer` dependency
2. Create API route handler
3. Implement PDF generation using existing checksheet logic
4. Test with n8n webhook consumption
5. Update N8NGUIDE.md with API usage examples

## Open Questions

- Should API require API key for security? (No - keep public like existing print)
- Should we add rate limiting? (Not needed for expected low volume)