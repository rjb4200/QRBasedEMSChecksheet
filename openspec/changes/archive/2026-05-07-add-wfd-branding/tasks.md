## 1. Asset Serving

- [x] 1.1 Inspect current Next.js image, metadata, favicon, layout, login, header, print, PDF, and archive/report patterns
- [x] 1.2 Confirm whether committed `images/WFD_Logo_1848.jpg` and `images/City of winchester Seal.png` can be imported directly or need runtime derivatives
- [x] 1.3 Create or generate public/runtime derivatives only if required, preserving the committed `images/` assets as source files

## 2. Browser Tab Icon

- [x] 2.1 Add a WFD-derived favicon or Next.js app icon from `images/WFD_Logo_1848.jpg`
- [x] 2.2 Verify app metadata/title remains readable and favicon changes do not affect page layout

## 3. Login Page Branding

- [x] 3.1 Add the WFD logo to the login page with descriptive alt text
- [x] 3.2 Add Winchester Fire Department and qrCheckoff identity text near the login form
- [x] 3.3 Keep the login form visually primary and verify the layout remains usable on mobile

## 4. Main App Header Branding

- [x] 4.1 Locate the shared app header or top navigation used by the main app surfaces
- [x] 4.2 Add a compact WFD logo next to the app name with descriptive alt text
- [x] 4.3 Verify the header does not crowd buttons, menus, unit controls, or fleet panel controls on desktop or mobile

## 5. Print and Archive Branding

- [x] 5.1 Add compact WFD logo and Winchester Fire Department name to printed daily check sheet headers
- [x] 5.2 Add matching compact WFD branding to existing archive or historical print/report outputs
- [x] 5.3 Optionally add the City seal only as a small footer mark or faint watermark when it does not reduce readability
- [x] 5.4 Ensure printed output remains readable in black and white and if images fail to load

## 6. Scope and Verification

- [x] 6.1 Verify no Supabase schema, authentication, QR, checkoff, fleet logic, unit status, archive logic, report logic, label, or admin feature behavior changed
- [x] 6.2 Verify branding was not added to unit cards, compartment cards, item rows, labels, QR speed paths, buttons, modals, or table rows
- [x] 6.3 Run typecheck and lint
