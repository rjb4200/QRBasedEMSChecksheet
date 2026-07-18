## Why

`src/lib/archive-records.ts` has become a mixed-responsibility module for Daily Readiness records. It combines public record types, date-range handling, Supabase queries, ledger-backed record construction, fallback reconstruction, grouping/trend logic, CSV export, and restocking integration, making records bugs harder to isolate and trend-chart issues harder to debug.

## What Changes

- Split Daily Readiness records logic into focused modules under `src/lib/records` or an equivalent records-focused folder.
- Keep `src/lib/archive-records.ts` as a stable public facade during the refactor so existing page, export, PDF, and test imports do not need to change all at once.
- Separate pure calculation and read-model building from Supabase query code.
- Separate grouping/trend helpers from record fetching and CSV/export helpers.
- Preserve current Daily Readiness records, CSV export, restocking list, print/PDF, and page behavior unless a specific pre-existing bug is explicitly fixed.
- Investigate the broken `Last 14 Days Check Completion` chart while extracting the trend code, and fix it only if the cause is isolated and the behavior change is low risk.
- Do not change database schema or redesign the Records UI.

## Capabilities

### New Capabilities
- `records-module-architecture`: Internal module boundaries and public facade expectations for Daily Readiness records code.

### Modified Capabilities
- None. This change is primarily an implementation refactor. Any substantive Daily Readiness business-rule change should be captured separately unless the chart fix is confirmed to be a narrow correction of existing broken behavior.

## Impact

- Affected code: `src/lib/archive-records.ts`, new files under `src/lib/records`, and focused tests around Daily Readiness record building/grouping/export behavior.
- Public imports from `@/lib/archive-records` should remain valid for existing consumers.
- No database schema changes.
- No new runtime dependencies.
- Related GitHub issue: #126.
