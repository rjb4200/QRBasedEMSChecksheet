## 1. Database migration

- [x] 1.1 Add `monthly_check_day` integer column to `units` table
- [x] 1.2 Add check constraint (null or 1-31)

## 2. Date logic helper

- [x] 2.1 Create `src/lib/monthly-check.ts` with `shouldShowMonthlyCheckReminder` function
- [x] 2.2 Implement short-month fallback (29-31 → last day of month)
- [x] 2.3 Read timezone from `TIMEZONE` env var (default `America/New_York`)
- [x] 2.4 Add `TIMEZONE` to `.env.example`

## 3. Banner component

- [x] 3.1 Create `src/components/monthly-check-banner.tsx` with amber styling
- [x] 3.2 Use non-blocking but persistent display

## 4. Admin unit form

- [x] 4.1 Add `monthly_check_day` to unit select query in admin unit edit page
- [x] 4.2 Add number input field with validation (blank or 1-31)
- [x] 4.3 Update save action to handle `monthly_check_day`

## 5. Crew-facing pages

- [x] 5.1 Add banner to unit check sheet page (`/units/[id]`)
- [x] 5.2 Add banner to compartment check page (`/checkoff/[unitId]/[compartmentId]`)
- [x] 5.3 Add banner to kit check page (`/checkoff/[unitId]/kit/[unitKitId]`)

## 6. Verify and test

- [x] 6.1 Run typecheck and build
- [x] 6.2 Verify banner appears on matching day
- [x] 6.3 Verify no banner when day doesn't match
- [x] 6.4 Verify short-month fallback logic
- [x] 6.5 Commit and push
