## 1. Create proxy API route

- [ ] 1.1 Create `src/app/api/monthly-check-form/route.ts` that fetches and returns the PDF
- [ ] 1.2 Add optional `Cache-Control` header for performance

## 2. Update banner with Print and Download

- [ ] 2.1 Convert `MonthlyCheckReminderBanner` to a `"use client"` component
- [ ] 2.2 Add Print button that opens proxied PDF and calls `window.print()`
- [ ] 2.3 Add Download link to the proxied PDF

## 3. Verify

- [ ] 3.1 Run typecheck and build
- [ ] 3.2 Verify print dialog opens on desktop
- [ ] 3.3 Verify download link works
- [ ] 3.4 Commit and push
