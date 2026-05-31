## Why

The Fleet Panel displays OOS units with muted slate styling that communicates "not currently operational" without implying an error. The individual unit page currently uses a red danger banner for OOS, which sends a conflicting "something is wrong" signal. Making the unit page OOS styling match the Fleet Panel creates visual consistency and a clearer operational message.

## What Changes

- Replace the red danger banner on the unit page with muted slate styling matching the Fleet Panel OOS treatment.
- Display OOS timestamp and by-name information on the unit page when available.
- Add `oos_at` and `oos_by` fields to the unit page database query.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `fleet-panel-status-badges`: OOS visual treatment extends to the individual unit page using matching muted slate styling instead of a red danger banner.

## Impact

- Affects the unit dashboard page query and OOS display section.
- No database schema changes expected.
- No API changes expected.
- No new dependency expected.
