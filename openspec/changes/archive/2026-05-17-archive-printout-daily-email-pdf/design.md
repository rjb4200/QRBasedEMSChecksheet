## Context

The daily email report cron route at `src/app/api/cron/daily-email-report/route.ts` currently calls `generateDailyChecksheetsPdf()` which produces a per-unit checksheet PDF using data from `getDailyChecksheetDocument()`. The archive print page at `/admin/archives/print` already renders a daily ledger view using `getDailyUnitRecords()` with readiness states, exceptions, crew names, and comments.

The goal is to replace the checksheet PDF with an archive-style PDF that matches the print page content, keeping the cron route, recipient logic, and Resend setup unchanged.

## Goals / Non-Goals

**Goals:**
- Generate a PDF matching the archive print page layout for the daily email attachment.
- Create a shared data builder so both the archive print page and email PDF use the same data source.
- Use PDFKit with landscape letter size and a table layout consistent with the print page.
- Preserve the existing daily email body, cron route, recipient logic, and Resend setup.
- Ensure the PDF works in production/Vercel with no missing font or file errors.

**Non-Goals:**
- Do not redesign the email body or subject.
- Do not change report recipients, cron schedule, or admin email preferences.
- Do not introduce headless browser PDF rendering.
- Do not change the archive print page behavior.

## Decisions

1. **Use `getDailyUnitRecords` as the shared data source for the PDF.**

   Rationale: The archive print page already uses this function. It returns `DailyUnitRecord[]` with `checkStatus`, `exceptions`, `crewLocked`, `comments`, and timing fields. Using the same data source prevents drift between the print page and the email PDF.

   Alternative considered: Build a new data query. This would duplicate logic and risk divergence from the print page.

2. **Generate PDF with PDFKit in landscape letter, table layout.**

   Rationale: PDFKit is already a dependency and works in Vercel/Node.js. A landscape table matches the print page layout and fits all columns without wrapping.

   Alternative considered: Puppeteer/headless browser rendering of the print page HTML. This would give pixel-perfect matching but adds a heavy dependency, deployment complexity, and slower generation.

3. **Replace the existing PDF generator rather than adding a parallel one.**

   Rationale: The existing `generateDailyChecksheetsPdf` is only used by the daily email cron route. Replacing it keeps the codebase simpler than maintaining two PDF generators.

   Alternative considered: Keep both generators and switch via a config flag. This adds dead code and confusion about which PDF format is authoritative.

4. **Use a landscape table with columns matching the print page: Unit, Service, Check Status, Sections, Exceptions, Comments, Crew.**

   Rationale: This is the same layout the print page uses. The PDF should be a faithful representation of the same data.

## Risks / Trade-offs

- **PDFKit table layout won't be pixel-identical to the HTML print page** -> Acceptable; the data content matches. Use similar column proportions and branding (WFD logo, City seal).
- **Long exception lists or comments may overflow cells** -> Truncate or use smaller font; exceptions are already comma-separated in the print page.
- **Helvetica.afm must resolve in Vercel** -> This worked previously after a fix; verify with a force send.
- **Existing `generateDailyChecksheetsPdf` consumers (if any beyond cron) break** -> The only caller is the cron route; no external consumers.
