## 1. Archive Summary Logic

- [x] 1.1 Update daily group completed-unit rule from `100%`/completed status to `completionPercentage > 95`
- [x] 1.2 Keep denominator limited to records whose historical unit status is `in_service`
- [x] 1.3 Update archive CSV or labels if they describe completed units as 100% only

## 2. Missing Ledger Fallback

- [x] 2.1 Detect dates in the selected range with no `daily_unit_ledgers` rows
- [x] 2.2 Build best-effort unit-day records from current units and units with `compartment_checks` on missing-ledger dates
- [x] 2.3 Include crew lock data in fallback completed count
- [x] 2.4 Ensure fallback records do not override saved ledger rows when ledgers exist

## 3. Shift Reset Ledger and Archive Totals

- [x] 3.1 Update shift-reset unit query to include `unit_kits(id)` as well as `unit_compartments(id)`
- [x] 3.2 Save ledger `total_compartments` using compartments plus kits
- [x] 3.3 Calculate archive completion using compartments plus kits, with crew handled consistently by archive records page
- [x] 3.4 Verify future reset output populates `daily_unit_ledgers` and `shift_archives`

## 4. Verification

- [x] 4.1 Verify 2026-05-05 no longer shows `0/0` when check data exists
- [x] 4.2 Verify daily numerator counts only in-service units with `completionPercentage > 95`
- [x] 4.3 Verify days with no check/ledger data still communicate no saved ledger or no data clearly
- [x] 4.4 Run typecheck and lint
