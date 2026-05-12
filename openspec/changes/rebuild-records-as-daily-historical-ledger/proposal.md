## Why

The Records page currently behaves like a checkoff-summary surface, but supervisors need it to be the historical daily record of unit readiness. Rebuilding Records around a selected operational date and daily ledger rows makes historical readiness auditable even when units were incomplete, not started, out of service, or not required.

## What Changes

- Reframe Records as a date-based daily readiness ledger rather than a completion-only summary.
- Show every unit that was active or out of service for the selected date when daily ledger data exists.
- Include unit readiness state for checked, incomplete, not started, and not required units.
- Include exceptions, saved crew names, and saved daily unit comments in the unit/day record.
- Preserve ledger-first behavior so saved daily unit ledger rows are authoritative for historical unit inclusion and service status.
- Use date-specific fallback data only when ledger rows are unavailable.
- **BREAKING**: Records page semantics change from a primarily aggregated past-checkoff summary to the canonical daily historical ledger for unit readiness.

## Capabilities

### New Capabilities
- `daily-readiness-ledger-records`: Records page behavior for selecting a date and rendering the complete daily historical unit readiness ledger.

### Modified Capabilities
- `past-checkoff-record-summary`: Records summary behavior changes to be derived from the date ledger and distinguish checked, incomplete, not started, and not required states.
- `daily-unit-service-snapshots`: Daily ledger rows must support Records as the authoritative historical source for active and out-of-service unit inclusion.

## Impact

- Records page UI and data-loading flow.
- Historical Records summary, detail, print, and export consumers if they share Records data.
- Daily ledger query and fallback reconstruction logic.
- Unit checkoff completion, exception, crew-name, and daily comment joins for a selected date.
