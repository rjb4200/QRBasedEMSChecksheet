## Context

The app currently generates QR codes from direct UUID checkoff URLs in `src/app/admin/units/[id]/qr/page.tsx` and `src/app/api/units/[id]/qr/route.ts`. The scanner accepts paths beginning with `/checkoff/`, and the existing compartment and assigned-kit checkoff pages already own the actual checkoff form behavior.

The change should keep UUIDs as internal identifiers while replacing printed QR URLs with short random opaque URLs like `/q/F7xQa`. No QR codes have been printed yet, so printed UUID QR compatibility is not required.

## Goals / Non-Goals

**Goals:**

- Generate short opaque QR URLs for unit compartments and assigned unit kits.
- Resolve each active short code to exactly one existing checkoff target.
- Keep QR URLs from revealing unit identity, target name, target type, or UUIDs.
- Automatically create QR targets when missing and reuse existing active codes afterward.
- Let admins see the assigned short code without manually generating QR codes before printing.
- Preserve existing checkoff page behavior after QR resolution.

**Non-Goals:**

- Replace UUID primary keys or internal relationships.
- Preserve old printed UUID QR URLs.
- Treat QR codes as authentication or authorization.
- Change checkoff submission, locking, completion, or archive behavior.
- Add admin QR regeneration in the initial implementation.

## Decisions

### Use a dedicated `qr_targets` lookup table

Create `qr_targets` with a unique `code`, `unit_id`, optional `compartment_id`, optional `unit_kit_id`, `active`, and timestamps. A check constraint enforces exactly one target column. Partial unique indexes enforce one active QR target per compartment and one active QR target per unit kit.

Alternatives considered:

- Add public codes directly to compartments and unit kits. Rejected because it spreads QR lifecycle across multiple tables and makes QR-specific lifecycle less explicit.
- Use readable unit/target codes. Rejected because readable codes reveal operational details and target type.

### Use 5-character random opaque codes by default

Generate codes from an alphanumeric alphabet that excludes visually confusing characters: `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789`. Use cryptographically strong randomness where practical, retry on unique-code collisions, and fail with an admin-visible error after a bounded retry count.

Alternatives considered:

- Four-character codes. Rejected as the default because five characters are still very short while providing much more collision/guessing space.
- Sequential codes. Rejected because they are guessable and disclose issuance patterns.

### Resolve `/q/[code]` to existing checkoff routes

Add a route at `src/app/q/[code]/page.tsx` that looks up an active QR target and redirects to the existing compartment or kit checkoff URL. Invalid, inactive, or missing targets render a generic invalid QR page without internal IDs or database errors.

Alternatives considered:

- Render checkoff forms directly from the resolver route. Rejected because it duplicates checkoff page logic and increases risk of behavioral drift.

### Centralize QR target creation in a server-side utility

Add a small server-side utility for finding or creating active QR targets and generating codes with retry handling. Admin QR pages and the QR API should use this utility so missing QR targets are created automatically during normal QR display/print flows.

Alternatives considered:

- Inline generation in each QR page/API. Rejected because collision handling and reuse rules should be implemented once.

### Defer manual regeneration

Regeneration is optional and not required for the initial implementation. The initial flow only needs automatic create-on-missing behavior and stable reuse of existing active codes.

Alternatives considered:

- Add an admin regenerate button now. Deferred because QR codes have not been printed yet and the immediate need is shorter, automatically available QR URLs.

## Risks / Trade-offs

- Code collisions during generation -> enforce database uniqueness and retry insert with a bounded retry count.
- Guessable public codes -> use random non-sequential codes, at least five characters, active-only lookup, and generic invalid responses.
- Race creating codes for the same target -> rely on partial unique indexes and re-query/retry when inserts conflict.
- Missing QR target during printing -> create it automatically before rendering the QR code.
- QR route redirect changes scanner assumptions -> update scanner validation to accept `/q/` URLs as valid checkoff QR codes.
- RLS/admin access mismatch -> use existing server admin client for QR management paths and add table policies matching current admin/read needs.

## Migration Plan

1. Add `qr_targets` table, check constraint, unique code constraint, active target partial indexes, updated-at trigger, and RLS policies.
2. Add QR code generation and target lookup utility.
3. Add `/q/[code]` resolver route with invalid/inactive UI.
4. Update admin QR page and QR API to create/reuse QR targets and generate `/q/{code}` URLs.
5. Update scanner validation to accept `/q/` URLs and route to the scanned path.
6. Run lint/typecheck and validate compartment and assigned-kit QR flows.

Rollback: keep direct UUID checkoff pages available, revert QR output to `/checkoff/...` if needed, and leave the `qr_targets` table unused until a follow-up migration removes it.

## Open Questions

- Should `/q/[code]` preserve query strings if future QR URLs include mode or tracking parameters?
