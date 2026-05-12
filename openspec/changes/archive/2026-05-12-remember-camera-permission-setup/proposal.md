## Why

Users must click "Request Camera Permissions" every time they open the built-in QR scanner, even after previously granting access. A simple localStorage flag lets the app skip this step on repeat visits.

## What Changes

- Set `localStorage` flag `qrCheckoff.cameraPermissionInitialized = true` after first successful camera setup
- Skip the in-app permission button on future visits when flag exists
- Browser camera permission rules are still respected

## Capabilities

### New Capabilities

- None (UX improvement — no new spec-level capability)

### Modified Capabilities

- None

## Impact

- `src/app/scan/page.tsx` — Check flag on load, set flag after success
- No database, no API, no new files
