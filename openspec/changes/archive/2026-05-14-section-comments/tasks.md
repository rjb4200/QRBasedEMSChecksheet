## 1. Database

- [x] 1.1 Create migration for `daily_section_comments` table with columns: id, shift_date, shift_period, unit_id, source_type, source_id, source_name, comment, created_at, updated_at. Add unique constraint and RLS policies.

## 2. Checkoff Page Comment Entry

- [x] 2.1 Add comment textarea to compartment checkoff page (`src/app/checkoff/[unitId]/[compartmentId]/page.tsx`).
- [x] 2.2 Add comment textarea to kit checkoff page (`src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx`).
- [x] 2.3 Update `upsertTargetCheck` in `src/app/checkoff/[unitId]/[compartmentId]/actions.ts` to accept a comment parameter and upsert/delete in `daily_section_comments`.
- [x] 2.4 Wire comment save on submit so the comment is persisted when the section is submitted.

## 3. Unit Page Display

- [x] 3.1 Query `daily_section_comments` for current unit/date/shift on the unit dashboard page.
- [x] 3.2 Render a "Section Comments" block with each comment labeled by source name.
- [x] 3.3 Hide the block when no section comments exist.
- [x] 3.4 Ensure section comments display separately from the existing unit-level comment field.

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm run lint`.
- [x] 4.2 Verify compartment comment submit/update/delete flows.
- [x] 4.3 Verify kit comment submit/update/delete flows.
- [x] 4.4 Verify merged display on unit page with multiple section comments.
