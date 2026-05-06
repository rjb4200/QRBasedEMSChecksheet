## 1. Database Model

- [x] 1.1 Add a Supabase migration creating `qr_targets` with code, unit, compartment, unit kit, active, timestamps, and one-target check constraint
- [x] 1.2 Add unique constraint/index for `qr_targets.code`
- [x] 1.3 Add partial unique indexes enforcing one active QR target per compartment and one active QR target per assigned unit kit
- [x] 1.4 Add updated-at trigger and RLS policies for QR target reads/management consistent with existing admin/server usage

## 2. QR Target Utilities

- [x] 2.1 Create a server-side QR code generation utility using the safe alphabet and five-character default length
- [x] 2.2 Implement get-or-create behavior that automatically creates missing active QR targets for a compartment or unit kit
- [x] 2.3 Implement collision retry handling for unique code conflicts with a bounded retry limit

## 3. Resolver Route

- [x] 3.1 Add `/q/[code]` route that looks up active QR targets by code
- [x] 3.2 Redirect active compartment QR targets to the existing compartment checkoff URL
- [x] 3.3 Redirect active assigned kit QR targets to the existing assigned kit checkoff URL
- [x] 3.4 Show a generic invalid/inactive QR page for missing, inactive, deleted, or unresolved targets

## 4. QR Generation Surfaces

- [x] 4.1 Update admin unit QR page to create/reuse QR targets and generate `/q/{code}` URLs
- [x] 4.2 Show each target's short code and short URL in the admin QR card UI
- [x] 4.3 Ensure admins do not need to manually generate QR codes before printing
- [x] 4.4 Update `api/units/[id]/qr` output to automatically create/reuse targets and return short QR URLs and codes instead of UUID URLs

## 5. Scanner Behavior

- [x] 5.1 Update camera scanner validation to accept `/q/` paths as valid checkoff QR paths
- [x] 5.2 Preserve invalid error behavior for unsupported QR paths

## 6. Validation

- [x] 6.1 Verify compartment QR resolves to the correct compartment checkoff flow
- [x] 6.2 Verify assigned kit QR resolves to the correct assigned kit checkoff flow
- [x] 6.3 Verify invalid and inactive QR codes show the generic invalid page without internal IDs or database errors
- [x] 6.4 Verify missing QR targets are created automatically when viewing or printing QR codes
- [x] 6.5 Run `npm run lint`
- [x] 6.6 Run `npm run typecheck`
