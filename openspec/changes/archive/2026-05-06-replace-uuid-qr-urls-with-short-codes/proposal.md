## Why

Current QR URLs embed unit and target UUIDs, making printed QR codes longer and denser than needed for field scanning. No QR codes have been printed yet, so this is the right time to replace UUID-based QR payloads with short opaque lookup codes without preserving old printed URLs.

## What Changes

- Add short random opaque QR codes that resolve internally to exactly one checkoff target.
- Add a central QR target lookup model for unit compartments and assigned unit kits.
- Add a public `/q/{code}` route that resolves active QR targets without exposing internal IDs or target type in the URL.
- Update QR generation and admin QR display to automatically create missing QR targets and use `/q/{code}` instead of UUID checkoff URLs.
- Add admin visibility for assigned short codes without requiring manual QR generation before printing.
- Preserve existing checkoff form, completion, and submission behavior after resolution.
- **BREAKING**: Printed/generated QR URLs will no longer use UUID-based checkoff paths. Existing UUID routes may remain for internal navigation, but they are no longer the QR output format.

## Capabilities

### New Capabilities

- `short-opaque-qr-codes`: Short random QR lookup codes, `/q/{code}` resolution, automatic QR target creation, QR target lifecycle, and admin display.

### Modified Capabilities

- None.

## Impact

- Database schema: add `qr_targets` table, uniqueness constraints, active-target partial indexes, timestamps, and cascade relationships.
- Supabase access: add queries/mutations for resolving, automatically creating, and reusing QR targets.
- App routes: add `/q/[code]` invalid/resolve behavior and redirect or render into the existing checkoff flow.
- Admin UI: update QR print/manage pages to automatically create missing QR targets, generate short URLs, and show assigned codes.
- QR generation: reduce payload length to `https://dailycheck.winchesterfireems.com/q/{code}`.
- Security/privacy: QR URLs stop exposing unit UUIDs, compartment UUIDs, unit kit UUIDs, target type, or readable unit/target identity.
