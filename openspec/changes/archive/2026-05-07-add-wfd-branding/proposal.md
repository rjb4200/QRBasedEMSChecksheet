## Why

qrCheckoff has the needed Winchester Fire Department and City of Winchester image assets committed, but the app still presents as a mostly generic equipment check system. A small branding pass will make login, navigation, and printed check sheets clearly identifiable as Winchester Fire Department materials without changing operational workflows.

## What Changes

- Add light Winchester Fire Department branding using the committed image assets under `images/`.
- Use `images/WFD_Logo_1848.jpg` as the primary WFD logo for favicon, login, app header, and print headers.
- Use `images/City of winchester Seal.png` only as an optional secondary formal mark in printed output.
- Confirm the static serving/import method before wiring image references into UI and print surfaces.
- Keep the first pass limited to browser tab icon, login page, main app header, check sheet print-offs, and existing archive/printed report surfaces.
- Avoid database, authentication, QR scanning, checkoff, fleet panel behavior, unit status, archive logic, reporting logic, theme, and admin-setting changes.

## Capabilities

### New Capabilities
- `wfd-branding`: Light Winchester Fire Department visual branding for favicon, login, app header, and printed check sheet/report surfaces.

### Modified Capabilities
- `past-checkoff-record-summary`: Printed/archive check sheet outputs include compact WFD branding while preserving existing archive content and behavior.

## Impact

- **Assets**: Existing committed files under `images/`; implementation may copy or generate web-served derivatives if Next.js cannot serve/import the current paths directly.
- **UI**: Login page and main app header receive compact WFD logo treatment.
- **Metadata/Favicon**: Browser tab icon uses WFD logo or a WFD-derived favicon asset.
- **Print/PDF**: Printed check sheets and existing archive/report print surfaces receive compact official headers and optional secondary City seal treatment.
- **Out of Scope**: No Supabase schema changes, workflow changes, QR behavior changes, fleet logic changes, archive logic changes, admin branding controls, theme system, or broad redesign.
