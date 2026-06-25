## 1. Persisted Sort Action

- [x] 1.1 Add a server action that fetches a unit's compartments and assigned kits, builds one mixed list using visible names, and sorts it case-insensitively A-Z.
- [x] 1.2 Update `unit_compartments.sort_order` and `unit_kits.sort_order` from the sorted list using weighted increments while preserving target internals.
- [x] 1.3 Revalidate affected unit builder, checkoff, and QR pages after the action completes.

## 2. Unit Builder UI

- [x] 2.1 Add a one-click alphabetize form/button to the admin unit builder page.
- [x] 2.2 Keep existing manual sort order inputs and existing sort-order rendering unchanged.

## 3. Verification

- [x] 3.1 Validate the OpenSpec change.
- [x] 3.2 Run TypeScript and lint checks. (`npm run typecheck` passes; `npm run lint` is blocked by unrelated existing lint errors.)
