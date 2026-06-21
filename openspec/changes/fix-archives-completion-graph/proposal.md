## Why

GitHub issue #117 reports that the Archives / Daily Readiness completion graph can show `0/6` for a day where completed and near-complete unit records exist. The graph is fed by a stale `getTrendGroups()` helper that duplicates completion logic instead of using the official Daily Readiness Records grouping path.

## What Changes

- Feed the Archives completion trend chart from `getDailyUnitRecords({}).groups`.
- Remove the duplicate `getTrendGroups()` helper and its graph-only completion calculation/debug logging.
- Add regression coverage for the issue #117 scenario: six in-service units, five at 100%, one above 95%, graph group returns `6/6`.
- Preserve the existing `completionPercentage > 95` completion rule and in-service denominator behavior.

## Capabilities

### New Capabilities

- `archive-completion-graph`: Archives completion graph uses the same grouped completion data as Daily Readiness Records.

### Modified Capabilities

- None.

## Impact

- GitHub issue: #117.
- Root cause: `src/app/admin/archives/page.tsx` imports `getTrendGroups()`, while `src/lib/archive-records.ts` already exposes `groupDailyUnitRecords()` using the official `completionPercentage > 95` rule.
- Affected code: `src/app/admin/archives/page.tsx`, `src/lib/archive-records.ts`, `src/lib/archive-records.test.ts`.
- Risk assessment: Low. The change removes a duplicate read-only calculation and points the graph at the existing official grouped records.
- Verification plan: Run focused archive-records tests, TypeScript, and lint.
- Rollback plan: Revert this branch/commit to restore the prior graph helper path.
