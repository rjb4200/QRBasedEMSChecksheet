## Why

Changing a unit's service status writes a daily ledger row for that unit. When the Fleet Matrix combines partial ledger data with live unit data, it places ledger-backed units ahead of the rest of the fleet, causing EC4 to appear before EC1-EC3 after its status transition.

The dashboard must retain a predictable apparatus order independent of status changes and show those changes without waiting for the fleet cache to expire.

## What Changes

- Apply a stable natural unit-name order to the final Fleet Matrix data after live and ledger data are merged.
- Preserve ledger-backed operational and historical metadata without allowing partial ledger coverage to alter card order.
- Invalidate the current-shift fleet cache after a unit service-status change so the dashboard reflects the update immediately.
- Add regression coverage for a status transition that creates a partial daily ledger.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `fleet-dashboard`: The Fleet Matrix must retain natural apparatus ordering across unit status changes and promptly reflect the updated service status.

## Impact

- `src/lib/fleet.ts` Fleet Matrix data aggregation and cache management.
- `src/app/admin/units/actions.ts` unit service-status action.
- Fleet aggregation and unit-action test coverage.
