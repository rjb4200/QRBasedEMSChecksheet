## 1. Remove Current Units Fallback

- [x] 1.1 Remove the loop that seeds `fallbackUnits` from all current `unitRows`
- [x] 1.2 Verify no code path iterates over `unitRows` for historical date fallback

## 2. Build Date-Specific Fallback

- [x] 2.1 Collect units from `compartment_checks` for the specific date
- [x] 2.2 Collect units from `shift_archives` for the specific date
- [x] 2.3 Collect units from `daily_unit_crews` for the specific date
- [x] 2.4 Union all collected units into a unique set for that date

## 3. Status Assignment

- [x] 3.1 Use archive `unit_status` if available from historical record
- [x] 3.2 Otherwise assign `"unknown"` status - do not use current unit status
- [x] 3.3 Ensure denominator only counts `"in_service"` status

## 4. Verification

- [x] 4.1 Verify historical dates no longer show all currently in-service units
- [x] 4.2 Verify CSV export uses same corrected logic
- [x] 4.3 Run typecheck and lint
