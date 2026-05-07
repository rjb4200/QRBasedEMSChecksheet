## Why

Past Checkoff Records currently risks using current unit status as fallback data for historical dates, causing inaccurate summaries when a unit's service status has changed since the selected date. The Records page should reflect the fleet state for that specific day, not today's configuration.

## What Changes

- Update Past Checkoff Records to prefer `daily_unit_ledgers` historical unit status/name when available.
- Build fallback records only from date-specific `shift_archives`, `compartment_checks`, or `daily_unit_crews` - never from all current units.
- Use historical `unitStatus === "in_service"` for completion totals.
- Ensure CSV export uses the same corrected historical logic.
- Mark units with unknown historical status as `"unknown"`, never assume current status.

## Capabilities

### New Capabilities
- `past-checkoff-record-summary`: Historical fleet record summaries using authoritative historical unit status when available.

### Modified Capabilities
- `past-checkoff-record-summary`: Update requirements to explicitly require historical unit status from ledgers, with fallback to date-specific records only.

## Impact

- **Code**: `src/lib/archive-records.ts` (getDailyUnitRecords, groupDailyUnitRecords), `src/app/admin/archives/page.tsx`, `src/app/admin/archives/export/route.ts`.
- **Data**: No schema change required. Reuses existing `daily_unit_ledgers`, `shift_archives`, `compartment_checks`, and `daily_unit_crews` data.
- **Behavior**: Past dates will no longer inflate counts by adding all currently in-service units.